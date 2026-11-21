<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use App\Support\BerkasAkun;
use App\Support\KataSandiAwal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Throwable;

/**
 * Import pengguna massal BBCashvia.
 *
 * Alur: template -> unggah -> PREVIEW (tidak menyimpan) -> konfirmasi
 * -> simpan hanya baris valid -> unduh file akun berisi password awal.
 */
class PenggunaImportController extends Controller
{
    private const BATAS_BARIS = 200;

    /** Unduh template XLSX. */
    public function template()
    {
        return Response::streamDownload(
            function () {
                echo BerkasAkun::template();
            },
            'template-import-pengguna-bbcashvia.xlsx',
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Cache-Control' => 'no-store, no-cache, must-revalidate',
            ]
        );
    }

    /**
     * Baca berkas dan kembalikan pratinjau validasi. TIDAK menyimpan data.
     */
    public function preview(Request $request)
    {
        $validasi = $request->validate([
            'file' => [
                'required',
                'file',
                'mimes:xlsx,xls,csv,txt',
                'max:2048',
            ],
            'id_kelas' => [
                'nullable',
                'integer',
                'exists:kelas,id_kelas',
            ],
        ], [
            'file.required' => 'Pilih file Excel atau CSV terlebih dahulu.',
            'file.mimes' => 'Format file harus .xlsx, .xls, atau .csv. DOCX tidak didukung untuk data tabular.',
            'file.max' => 'Ukuran file maksimal 2 MB.',
            'id_kelas.exists' => 'Kelas yang dipilih tidak ditemukan.',
        ]);

        $ekstensi = strtolower((string) $request->file('file')->getClientOriginalExtension());

        if (!in_array($ekstensi, ['xlsx', 'xls', 'csv'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Format .docx tidak didukung karena DOCX adalah format dokumen, bukan tabel. Simpan tabel sebagai .xlsx atau .csv.',
            ], 422);
        }

        try {
            $barisMentah = $ekstensi === 'csv'
                ? $this->bacaCsv($request->file('file')->getRealPath())
                : $this->bacaExcel($request->file('file')->getRealPath());
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'File tidak dapat dibaca. Pastikan file Excel/CSV tidak rusak.',
                'debug' => config('app.debug') ? $e->getMessage() : null,
            ], 422);
        }

        if (count($barisMentah) < 2) {
            return response()->json([
                'success' => false,
                'message' => 'File kosong atau hanya berisi judul kolom.',
            ], 422);
        }

        $judul = $this->petakanJudul(array_shift($barisMentah));

        if (!isset($judul['nama'], $judul['email'])) {
            return response()->json([
                'success' => false,
                'message' => 'Kolom "Nama" dan "Email" wajib ada pada baris pertama. Unduh template agar format seragam.',
            ], 422);
        }

        $barisMentah = array_values(array_filter(
            $barisMentah,
            fn ($baris) => !empty(array_filter(
                $baris,
                fn ($nilai) => trim((string) $nilai) !== ''
            ))
        ));

        if (count($barisMentah) > self::BATAS_BARIS) {
            return response()->json([
                'success' => false,
                'message' => 'Maksimal ' . self::BATAS_BARIS . ' baris per berkas. Silakan bagi menjadi beberapa file.',
            ], 422);
        }

        $kelasDefault = $validasi['id_kelas'] ?? null;
        $digunakanEmail = [];
        $digunakanNis = [];
        $hasil = [];
        $berhasil = 0;
        $duplikat = 0;

        foreach ($barisMentah as $indeks => $baris) {
            $data = [
                'nama' => $this->teks($baris[$judul['nama']] ?? ''),
                'email' => mb_strtolower($this->teks($baris[$judul['email']] ?? '')),
                'nis' => isset($judul['nis']) ? $this->teks($baris[$judul['nis']] ?? '') : '',
                'peran' => isset($judul['peran'])
                    ? mb_strtolower($this->teks($baris[$judul['peran']] ?? ''))
                    : '',
                'jenis_viewer' => isset($judul['jenis_viewer'])
                    ? mb_strtolower($this->teks($baris[$judul['jenis_viewer']] ?? ''))
                    : '',
                'kelas' => isset($judul['kelas'])
                    ? $this->teks($baris[$judul['kelas']] ?? '')
                    : '',
                'jenis_kelamin' => isset($judul['jenis_kelamin'])
                    ? strtoupper($this->teks($baris[$judul['jenis_kelamin']] ?? ''))
                    : '',
                'no_hp' => isset($judul['no_hp'])
                    ? $this->teks($baris[$judul['no_hp']] ?? '')
                    : '',
            ];

            $dinilai = $this->nilaiBaris($data, $kelasDefault);

            $kunciEmail = $data['email'];

            if ($kunciEmail !== '' && isset($digunakanEmail[$kunciEmail])) {
                $dinilai['alasan'][] = 'Email sudah digunakan pada baris ' . $digunakanEmail[$kunciEmail] . ' di file ini.';
            } elseif ($kunciEmail !== '') {
                $digunakanEmail[$kunciEmail] = $indeks + 2;
            }

            if ($data['nis'] !== '' && isset($digunakanNis[$data['nis']])) {
                $dinilai['alasan'][] = 'NIS sudah digunakan pada baris ' . $digunakanNis[$data['nis']] . ' di file ini.';
            } elseif ($data['nis'] !== '') {
                $digunakanNis[$data['nis']] = $indeks + 2;
            }

            if ($this->alasanDuplikat($dinilai['alasan'])) {
                $duplikat++;
            }

            $dinilai['valid'] = empty($dinilai['alasan']);

            if ($dinilai['valid']) {
                $berhasil++;
            }

            $hasil[] = [
                'baris' => $indeks + 2,
                'nama' => $data['nama'],
                'email' => $data['email'],
                'nis' => $data['nis'],
                'peran' => $data['peran'],
                'jenis_viewer' => $dinilai['data']['jenis_viewer'] ?? null,
                // Kosongkan label untuk akun tanpa kelas. Teks "Semua Kelas"
                // hanya dipakai di pesan, bukan sebagai nama kelas di DB.
                'kelas' => !empty($dinilai['data']['id_kelas'])
                    ? $this->namaKelas($dinilai['data']['id_kelas'])
                    : '',
                'status' => $dinilai['valid'] ? 'valid' : 'invalid',
                'alasan' => $dinilai['alasan'],
                // Data ternormalisasi dipakai ulang saat konfirmasi, lalu
                // divalidasi ULANG oleh server sebelum disimpan.
                'id_siswa' => $dinilai['data']['id_siswa'] ?? null,
                'id_kelas' => $dinilai['data']['id_kelas'] ?? null,
                'jenis_kelamin' => $dinilai['data']['jenis_kelamin'] ?? null,
                'no_hp' => $dinilai['data']['no_hp'] ?? null,
                'siswa_baru' => !empty($dinilai['data']['siswa_baru']),
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Pratinjau selesai. Periksa data sebelum menyimpan.',
            'total' => count($hasil),
            'berhasil' => $berhasil,
            'gagal' => count($hasil) - $berhasil,
            'duplikat' => $duplikat,
            'data' => $hasil,
            'kelas' => Kelas::orderBy('nama_kelas')->get(['id_kelas', 'nama_kelas']),
            'id_kelas_default' => $kelasDefault,
        ]);
    }

    /**
     * Simpan HANYA baris yang lolos validasi ulang.
     *
     * Akun dan identitas siswa dibuat dalam satu transaksi per baris.
     * Bila siswa gagal dibuat, akun tidak pernah disimpan (dan sebaliknya).
     */
    public function proses(Request $request)
    {
        $request->validate([
            'baris' => ['required', 'array', 'min:1', 'max:' . self::BATAS_BARIS],
            'baris.*' => ['array'],
            'baris.*.nis' => ['nullable', 'string', 'max:11'],
            'baris.*.jenis_kelamin' => ['nullable', 'string', 'max:20'],
            'baris.*.no_hp' => ['nullable', 'string', 'max:20'],
            'id_kelas' => ['nullable', 'integer', 'exists:kelas,id_kelas'],
        ], [
            'baris.required' => 'Tidak ada data untuk disimpan.',
            'baris.max' => 'Maksimal ' . self::BATAS_BARIS . ' akun per proses.',
        ]);

        $kelasDefault = $request->input('id_kelas');
        $barisDiterima = $request->input('baris', []);
        $hasil = [];
        $akun = [];
        $berhasil = 0;
        $gagal = 0;
        $duplikat = 0;
        $siswaDibuat = 0;
        $siswaTerhubung = 0;
        $siswaGagal = 0;
        $emailTersimpan = [];
        $nisTersimpan = [];
        $siswaTersimpan = [];

        DB::transaction(function () use (
            $barisDiterima,
            $kelasDefault,
            &$hasil,
            &$akun,
            &$berhasil,
            &$gagal,
            &$duplikat,
            &$siswaDibuat,
            &$siswaTerhubung,
            &$siswaGagal,
            &$emailTersimpan,
            &$nisTersimpan,
            &$siswaTersimpan
        ) {
            foreach ($barisDiterima as $baris) {
                $data = [
                    'nama' => $this->teks($baris['nama'] ?? ''),
                    'email' => mb_strtolower($this->teks($baris['email'] ?? '')),
                    'nis' => $this->teks($baris['nis'] ?? ''),
                    'peran' => mb_strtolower($this->teks($baris['peran'] ?? '')),
                    'jenis_viewer' => mb_strtolower($this->teks($baris['jenis_viewer'] ?? '')),
                    'kelas' => $this->teks($baris['kelas'] ?? ''),
                    'id_kelas' => $baris['id_kelas'] ?? null,
                    'jenis_kelamin' => strtoupper($this->teks($baris['jenis_kelamin'] ?? '')),
                    'no_hp' => $this->teks($baris['no_hp'] ?? ''),
                ];

                $dinilai = $this->nilaiBaris($data, $kelasDefault, true);
                $nomor = (int) ($baris['baris'] ?? 0);
                $kunciEmail = $data['email'];
                $kunciNis = $data['nis'];

                if ($kunciEmail !== '' && isset($emailTersimpan[$kunciEmail])) {
                    $dinilai['alasan'][] = 'Email sama sudah disimpan pada baris ' . $emailTersimpan[$kunciEmail] . '.';
                }

                if ($kunciNis !== '' && isset($nisTersimpan[$kunciNis])) {
                    $dinilai['alasan'][] = 'NIS sama sudah dipakai pada baris ' . $nisTersimpan[$kunciNis] . '.';
                }

                $idSiswa = $dinilai['data']['id_siswa'] ?? null;

                if ($idSiswa !== null && isset($siswaTersimpan[$idSiswa])) {
                    $dinilai['alasan'][] = 'Siswa sama sudah dipakai pada baris ' . $siswaTersimpan[$idSiswa] . '.';
                }

                $dinilai['alasan'] = array_values(array_unique($dinilai['alasan']));

                if (!empty($dinilai['alasan'])) {
                    $gagal++;

                    if ($this->alasanDuplikat($dinilai['alasan'])) {
                        $duplikat++;
                    }

                    $hasil[] = [
                        'baris' => $nomor,
                        'email' => $data['email'],
                        'status' => 'gagal',
                        'alasan' => $dinilai['alasan'],
                    ];

                    continue;
                }

                $normal = $dinilai['data'];
                $password = KataSandiAwal::buat();

                try {
                    // Savepoint: kalau salah satu penyimpanan gagal, hanya
                    // baris ini yang dibatalkan. Baris lain tetap diproses.
                    $tersimpan = DB::transaction(function () use ($normal, $password, $data) {
                        $idSiswaFinal = null;
                        $siswaBaruDibuat = false;

                        if (!empty($normal['siswa_baru'])) {
                            // Hanya lima identitas dari file yang masuk ke
                            // Data Siswa: NIS/NISN, nama, kelas, jenis
                            // kelamin, no HP. Status=Aktif adalah nilai
                            // sistem, bukan kolom dari berkas import.
                            // Kolom enum DB memakai "Laki-Laki"/"Perempuan",
                            // sama seperti form Data Siswa, bukan L/P.
                            $jenisKelaminDb = null;
                            if ($normal['jenis_kelamin'] === 'L') {
                                $jenisKelaminDb = 'Laki-Laki';
                            } elseif ($normal['jenis_kelamin'] === 'P') {
                                $jenisKelaminDb = 'Perempuan';
                            }

                            $siswa = Siswa::create([
                                'nis' => $data['nis'],
                                'nama_siswa' => $normal['nama'],
                                'id_kelas' => $normal['id_kelas'],
                                'status' => 'Aktif',
                                'Jenis_Kelamin' => $jenisKelaminDb,
                                'no_hp' => $normal['no_hp'] ?: null,
                            ]);

                            $idSiswaFinal = (int) $siswa->id_siswa;
                            $siswaBaruDibuat = true;
                        } else {
                            $idSiswaFinal = $normal['id_siswa'] ?? null;
                        }

                        $namaAkun = $normal['nama'];

                        if ($idSiswaFinal !== null) {
                            $siswa = Siswa::find($idSiswaFinal);

                            if ($siswa === null) {
                                throw new \RuntimeException('Data siswa tidak ditemukan.');
                            }

                            $namaAkun = $siswa->nama_siswa;
                        }

                        $user = new User();
                        $user->name = $namaAkun;
                        $user->email = $normal['email'];
                        $user->role = $normal['peran'];
                        $user->jenis_viewer = $normal['jenis_viewer'];
                        $user->id_siswa = $idSiswaFinal;
                        $user->id_kelas = $normal['id_kelas'];
                        $user->password = Hash::make($password);
                        $user->must_change_password = true;
                        $user->save();

                        return [
                            'user' => $user,
                            'id_siswa' => $idSiswaFinal,
                            'siswa_dibuat' => $siswaBaruDibuat,
                        ];
                    });
                } catch (Throwable $e) {
                    $gagal++;
                    if (!empty($normal['siswa_baru']) || !empty($normal['id_siswa'])) {
                        $siswaGagal++;
                    }

                    $pesanGagal = 'Gagal menyimpan data secara konsisten. Akun dan data siswa tidak dibuat.';
                    $teksGalat = mb_strtolower($e->getMessage());

                    if (str_contains($teksGalat, 'data truncated') || str_contains($teksGalat, 'enum')) {
                        $pesanGagal .= ' Periksa format Jenis Kelamin (L/P) dan Status pada Data Siswa.';
                    } elseif (str_contains($teksGalat, 'duplicate entry')) {
                        $pesanGagal .= ' Ada NIS atau email yang sudah terdaftar.';
                    }

                    $hasil[] = [
                        'baris' => $nomor,
                        'email' => $data['email'],
                        'status' => 'gagal',
                        'alasan' => [$pesanGagal],
                        'debug' => config('app.debug') ? $e->getMessage() : null,
                    ];

                    continue;
                }

                /** @var User $user */
                $user = $tersimpan['user'];

                if ($kunciEmail !== '') {
                    $emailTersimpan[$kunciEmail] = $nomor;
                }

                if ($kunciNis !== '' && $tersimpan['siswa_dibuat']) {
                    $nisTersimpan[$kunciNis] = $nomor;
                }

                if ($tersimpan['id_siswa'] !== null) {
                    $siswaTersimpan[$tersimpan['id_siswa']] = $nomor;
                }

                $berhasil++;

                if ($tersimpan['siswa_dibuat']) {
                    $siswaDibuat++;
                } elseif ($tersimpan['id_siswa'] !== null) {
                    $siswaTerhubung++;
                }

                $akun[] = [
                    'nama' => $user->name,
                    'email' => $user->email,
                    'kelas' => $this->namaKelas($user->id_kelas),
                    'peran' => ucfirst((string) $user->role),
                    'password' => $password,
                ];
            }
        });

        $namaFile = 'akun-pengguna-bbcashvia-' . date('Y-m-d-His') . '.xlsx';

        $pesan = $berhasil
            ? "Import selesai: {$berhasil} akun dibuat, {$siswaDibuat} data siswa ditambahkan, "
                . "{$siswaTerhubung} siswa ditautkan, {$duplikat} duplikat, {$gagal} gagal."
            : 'Import selesai: tidak ada akun yang berhasil dibuat.';

        return response()->json([
            'success' => true,
            'message' => $pesan,
            'total' => count($barisDiterima),
            'berhasil' => $berhasil,
            'akun_berhasil' => $berhasil,
            'siswa_dibuat' => $siswaDibuat,
            'siswa_terhubung' => $siswaTerhubung,
            'siswa_gagal' => $siswaGagal,
            'duplikat' => $duplikat,
            'gagal' => $gagal,
            'rincian' => $hasil,
            'akun' => $akun,
            'file_xlsx' => $berhasil
                ? base64_encode(BerkasAkun::akun($akun))
                : null,
            'nama_file' => $namaFile,
            'peringatan' => BerkasAkun::PERINGATAN,
        ]);
    }

    /**
     * Validasi satu baris memakai aturan yang sama dengan UserController.
     *
     * Bendahara dan Viewer Siswa sama-sama boleh memakai NIS baru; akun
     * dan data siswa dibuat dalam satu transaksi.
     *
     * @return array{valid: bool, alasan: array<int, string>, data: array<string, mixed>}
     */
    private function nilaiBaris(array $data, $kelasDefault, bool $termasukIdKelas = false): array
    {
        $alasan = [];
        $nama = trim((string) ($data['nama'] ?? ''));
        $email = mb_strtolower(trim((string) ($data['email'] ?? '')));
        $nis = trim((string) ($data['nis'] ?? ''));
        $peran = mb_strtolower(trim((string) ($data['peran'] ?? '')));
        $jenis = mb_strtolower(trim((string) ($data['jenis_viewer'] ?? '')));
        $namaKelas = trim((string) ($data['kelas'] ?? ''));

        // Saat mengimpor baris hasil pratinjau, kolom "kelas" hanya label
        // tampilan ("Semua Kelas" untuk akun tanpa kelas). Identitas kelas
        // yang sah sudah ada di id_kelas, jadi jangan dipetakan lagi dari
        // label tersebut. Tanpa ini, semua baris admin/guru tanpa kelas
        // gagal dengan alasan Kelas "Semua Kelas" tidak terdaftar.
        if ($termasukIdKelas && array_key_exists('id_kelas', $data)) {
            $namaKelas = '';
        }

        $jenisKelamin = strtoupper(trim((string) ($data['jenis_kelamin'] ?? '')));
        $noHp = trim((string) ($data['no_hp'] ?? ''));

        if (in_array($jenisKelamin, ['LAKI-LAKI', 'LAKI LAKI'], true)) {
            $jenisKelamin = 'L';
        }
        if (in_array($jenisKelamin, ['PEREMPUAN'], true)) {
            $jenisKelamin = 'P';
        }
        if (!in_array($jenisKelamin, ['L', 'P', ''], true)) {
            $jenisKelamin = '';
        }

        $validator = Validator::make([
            'nama' => $nama,
            'email' => $email,
            'nis' => $nis,
            'peran' => $peran,
            'jenis_viewer' => $jenis,
            'no_hp' => $noHp,
        ], [
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'nis' => ['nullable', 'string', 'max:11'],
            'peran' => ['required', 'in:admin,bendahara,viewer'],
            'jenis_viewer' => ['nullable', 'in:siswa,wali_kelas'],
            'no_hp' => ['nullable', 'string', 'max:20'],
        ], [
            'nama.required' => 'Nama wajib diisi.',
            'nama.max' => 'Nama maksimal 255 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'nis.max' => 'NIS maksimal 11 karakter.',
            'peran.required' => 'Peran wajib diisi.',
            'peran.in' => 'Peran harus admin, bendahara, atau viewer.',
            'jenis_viewer.in' => 'Jenis viewer harus siswa atau wali_kelas.',
            'no_hp.max' => 'Nomor HP maksimal 20 karakter.',
        ]);

        foreach ($validator->errors()->all() as $pesan) {
            $alasan[] = $pesan;
        }

        if ($email !== ''
            && User::whereRaw('LOWER(email) = ?', [$email])->exists()) {
            $alasan[] = 'Email sudah terdaftar.';
        }

        if ($peran === 'bendahara') {
            $jenis = 'siswa';
        } elseif ($peran === 'admin') {
            $jenis = '';
        } elseif ($jenis === '') {
            $jenis = 'siswa';
        }

        /* ---------------------------------------------------------
           Kelas: pilihan Admin mengalahkan kolom file.
           Bila keduanya ada, keduanya harus sama persis.
           --------------------------------------------------------- */
        $idKelasFile = null;

        if ($namaKelas !== '') {
            $kelas = Kelas::whereRaw('LOWER(nama_kelas) = ?', [mb_strtolower($namaKelas)])
                ->first();

            if ($kelas === null) {
                $alasan[] = 'Kelas "' . $namaKelas . '" tidak terdaftar.';
            } else {
                $idKelasFile = (int) $kelas->id_kelas;
            }
        }

        $idKelasDefault = null;

        if ($kelasDefault !== null
            && $kelasDefault !== ''
            && strtolower((string) $kelasDefault) !== 'semua') {
            $idKelasDefault = (int) $kelasDefault;
        }

        if ($idKelasDefault !== null
            && $idKelasFile !== null
            && $idKelasDefault !== $idKelasFile) {
            $alasan[] = 'Kelas pada file ("' . $this->namaKelas($idKelasFile)
                . '") berbeda dengan kelas yang dipilih ("'
                . $this->namaKelas($idKelasDefault) . '").';
        }

        $idKelas = $idKelasDefault ?? $idKelasFile;

        if ($termasukIdKelas && !empty($data['id_kelas'])) {
            $idKelasPreview = (int) $data['id_kelas'];

            if ($idKelasDefault !== null && $idKelasPreview !== $idKelasDefault) {
                $alasan[] = 'Kelas pada pratinjau berbeda dengan kelas yang dipilih. Silakan pratinjau ulang.';
            }

            if ($idKelas === null) {
                $idKelas = $idKelasPreview;
            }
        }

        if ($idKelas !== null && !Kelas::where('id_kelas', $idKelas)->exists()) {
            $alasan[] = 'Kelas yang dipilih tidak ditemukan.';
        }

        /* ---------------------------------------------------------
           Identitas siswa: Bendahara dan Viewer Siswa sama-sama boleh
           memakai NIS baru. Data siswa dibuat lebih dulu, lalu akun
           ditautkan dalam transaksi yang sama.
           --------------------------------------------------------- */
        $idSiswa = null;
        $siswaBaru = false;

        if ($peran === 'bendahara' || ($peran === 'viewer' && $jenis === 'siswa')) {
            if ($nis === '') {
                $alasan[] = 'NIS wajib diisi untuk Bendahara dan Viewer Siswa.';
            } else {
                $siswa = Siswa::where('nis', $nis)->first();

                if ($siswa !== null) {
                    $idSiswa = (int) $siswa->id_siswa;
                    $idKelasSiswa = $siswa->id_kelas
                        ? (int) $siswa->id_kelas
                        : null;

                    if (User::where('id_siswa', $idSiswa)->exists()) {
                        $alasan[] = 'Siswa dengan NIS tersebut sudah memiliki akun.';
                    }

                    if ($idKelas !== null && $idKelasSiswa !== null
                        && $idKelas !== $idKelasSiswa) {
                        $alasan[] = 'Kelas siswa tidak sesuai dengan kelas yang dipilih.';
                    }

                    if ($idKelas === null && $idKelasSiswa !== null) {
                        $idKelas = $idKelasSiswa;
                    }
                } else {
                    // Bendahara / Viewer Siswa: NIS baru otomatis menjadi
                    // Data Siswa sebelum akun dibuat.
                    if ($idKelas === null) {
                        $alasan[] = 'Kelas wajib dipilih atau diisi untuk membuat siswa baru.';
                    }

                    if (mb_strlen($nama) > 100) {
                        $alasan[] = 'Nama siswa baru maksimal 100 karakter.';
                    }

                    $siswaBaru = true;
                }
            }
        }

        if ($peran === 'admin') {
            $idSiswa = null;
        }

        return [
            'valid' => empty($alasan),
            'alasan' => array_values(array_unique($alasan)),
            'data' => [
                'nama' => $nama,
                'email' => $email,
                'nis' => $nis,
                'peran' => $peran,
                'jenis_viewer' => $jenis === '' ? null : $jenis,
                'id_siswa' => $idSiswa,
                'id_kelas' => $idKelas,
                'jenis_kelamin' => $jenisKelamin,
                'no_hp' => $noHp,
                'siswa_baru' => $siswaBaru,
            ],
        ];
    }

    /** Apakah alasan tersebut termasuk duplikat? */
    private function alasanDuplikat(array $alasan): bool
    {
        foreach ($alasan as $pesan) {
            if (str_contains((string) $pesan, 'sudah')) {
                return true;
            }
        }

        return false;
    }

    /** Nama kelas untuk ditampilkan/ ditulis ke file akun. */
    private function namaKelas($idKelas): string
    {
        if ($idKelas === null || $idKelas === '') {
            return 'Semua Kelas';
        }

        return (string) (Kelas::where('id_kelas', $idKelas)->value('nama_kelas') ?? 'Semua Kelas');
    }

    /** Baca XLSX/XLS dengan PhpSpreadsheet. */
    private function bacaExcel(string $path): array
    {
        $buku = IOFactory::load($path);
        $lembar = $buku->getActiveSheet();

        return $lembar->toArray(null, true, true, false);
    }

    /** Baca CSV dengan dukungan BOM dan pemisah koma/semicolon/tab. */
    private function bacaCsv(string $path): array
    {
        $isi = (string) file_get_contents($path);

        if (str_starts_with($isi, "\xEF\xBB\xBF")) {
            $isi = substr($isi, 3);
        }

        $baris = [];
        $handle = fopen('php://temp', 'r+');
        fwrite($handle, $isi);
        rewind($handle);

        while (($record = fgetcsv($handle, 0, ',')) !== false) {
            if (count($record) === 1
                && (str_contains($record[0], ';') || str_contains($record[0], "\t"))) {
                $pemisah = str_contains($record[0], ';') ? ';' : "\t";
                $record = str_getcsv($record[0], $pemisah);
            }

            $baris[] = $record;
        }

        fclose($handle);

        return $baris;
    }

    /** Petakan nama kolom agar template dan variasi umum diterima. */
    private function petakanJudul(array $judul): array
    {
        $peta = [
            'nama' => ['nama', 'nama pengguna', 'nama user', 'nama_siswa'],
            'email' => ['email', 'e-mail', 'gmail', 'email/gmail', 'email gmail'],
            'nis' => ['nis', 'nisn', 'nis / nisn', 'nomor induk siswa'],
            'peran' => ['peran', 'role', 'peran user', 'role user'],
            'jenis_viewer' => ['jenis viewer', 'jenis_viewer', 'jenis', 'tipe viewer'],
            'kelas' => ['kelas', 'nama kelas', 'nama_kelas', 'class'],
            'jenis_kelamin' => ['jenis kelamin', 'jenis_kelamin', 'jk', 'gender'],
            'no_hp' => ['no hp', 'no_hp', 'nohp', 'telepon', 'phone'],
        ];

        $hasil = [];

        foreach ($judul as $indeks => $nilai) {
            $kunci = preg_replace('/[^a-z0-9\/ ]/i', '', mb_strtolower(trim((string) $nilai)));
            $kunci = trim(preg_replace('/\s+/', ' ', (string) $kunci));

            foreach ($peta as $target => $alias) {
                if (in_array($kunci, $alias, true) && !isset($hasil[$target])) {
                    $hasil[$target] = $indeks;
                    break;
                }
            }
        }

        return $hasil;
    }

    /** Nilai cell Excel/CSV ke teks aman. */
    private function teks($nilai): string
    {
        if ($nilai === null) {
            return '';
        }

        if (is_float($nilai)) {
            return number_format($nilai, 0, '.', '');
        }

        return trim((string) $nilai);
    }
}
