<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\MembatasiKelas;
use App\Http\Controllers\Controller;
use App\Models\Iuran;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Transaksi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SiswaController extends Controller
{
    use MembatasiKelas;
    use \App\Http\Controllers\Concerns\MengunciIdempotensi;

    /**
     * Mengambil data siswa dan daftar jurusan dari database.
     *
     * Admin melihat seluruh kelas; bendahara & viewer hanya kelasnya.
     */
    public function index(Request $request): JsonResponse
    {
        $daftarSiswa = $this->siswaTerbatas($request)
            ->with(['kelas', 'transaksi' => function ($q) {
                $q->orderByDesc('tanggal');
            }])
            ->orderBy('nis')
            ->get();

        // Iuran aktif untuk setiap kelas dimuat SATU kali. Status iuran
        // tiap siswa lalu dihitung dari data ini tanpa query berulang
        // (menghindari N+1).
        $includeGlobal = (bool) $request->user()?->aksesSemuaKelas();

        $iuranPerKelas = Iuran::query()
            ->whereIn(
                'id_kelas',
                $daftarSiswa->pluck('id_kelas')
                    ->filter()
                    ->unique()
                    ->values()
            )
            ->whereRaw('LOWER(status) = ?', ['aktif'])
            ->orderBy('nama_iuran')
            ->get()
            ->groupBy('id_kelas');

        // Iuran tanpa kelas berlaku untuk semua siswa. Hanya admin
        // yang melihat seluruh kelas; pengguna terbatas tetap pada
        // iuran kelasnya agar scope data tidak melebar.
        $iuranGlobal = $includeGlobal
            ? Iuran::query()
                ->whereNull('id_kelas')
                ->whereRaw('LOWER(status) = ?', ['aktif'])
                ->orderBy('nama_iuran')
                ->get()
            : collect();

        $siswa = $daftarSiswa->map(function (Siswa $item) use ($iuranPerKelas, $iuranGlobal) {
            $transaksi = $item->transaksi;

            // Riwayat pembayaran (hanya pemasukan).
            $riwayat = $transaksi
                ->filter(fn ($t) => Transaksi::jenisMasuk($t->jenis))
                ->map(function ($t) {
                    return [
                        'id_transaksi' => $t->id_transaksi,
                        'tanggal' => $t->tanggal,
                        'nominal' => (float) $t->nominal,
                        'keterangan' => $t->keterangan,
                        'kategori' => $t->kategori,
                        'periode' => $t->periode,
                    ];
                })
                ->values()
                ->all();

            $totalDibayar = (float) $transaksi
                ->filter(fn ($t) => Transaksi::jenisMasuk($t->jenis))
                ->sum('nominal');

            $iuranSiswa = $item->id_kelas
                ? $iuranPerKelas->get((int) $item->id_kelas, collect())
                : collect();

            if ($iuranGlobal->isNotEmpty()) {
                $iuranSiswa = $iuranSiswa->concat($iuranGlobal);
            }

            $ringkasanIuran = $this->ringkasanIuran($item, $iuranSiswa);

            return [
                'id_siswa' => $item->id_siswa,
                'nis' => $item->nis,
                'nama' => $item->nama_siswa,
                'id_kelas' => $item->id_kelas,
                'kelas' => $item->kelas?->nama_kelas ?? '',
                'status' => $item->status,
                'jenis_kelamin' => $item->Jenis_Kelamin ?? null,
                'no_hp' => $item->no_hp ?? null,
                'jumlah_transaksi' => $riwayat ? count($riwayat) : 0,
                'total_dibayar' => $totalDibayar,
                'riwayat' => $riwayat,
                'status_iuran' => $ringkasanIuran['status_iuran'],
                'tagihan_iuran' => $ringkasanIuran['tagihan_iuran'],
                'terbayar_iuran' => $ringkasanIuran['terbayar_iuran'],
                'sisa_iuran' => $ringkasanIuran['sisa_iuran'],
                'rincian_iuran' => $ringkasanIuran['rincian_iuran'],
            ];
        });

        $kelasQuery = Kelas::orderBy('nama_kelas');

        $idKelas = $this->kelasDibatasi($request);

        if ($idKelas !== null) {
            $kelasQuery->where('id_kelas', $idKelas);
        }

        $kelas = $kelasQuery->get(['id_kelas', 'nama_kelas']);

        return response()->json([
            'data' => $siswa,
            'kelas' => $kelas,
        ]);
    }

    /**
     * Tagihan pribadi pengguna yang sedang login.
     *
     * Identitas siswa TIDAK diambil dari parameter klien. Sumbernya
     * hanya `users.id_siswa` milik sesi, sehingga Viewer Siswa tidak
     * dapat membuka tagihan siswa lain dengan mengganti URL.
     *
     * Iuran global (id_kelas NULL) ikut dihitung karena berlaku untuk
     * semua siswa; iuran kelas lain tidak pernah dicampurkan.
     */
    public function tagihanPribadi(Request $request): JsonResponse
    {
        $user = $request->user();
        $idSiswa = $user?->id_siswa;

        if ($idSiswa === null) {
            return response()->json([
                'success' => true,
                'message' => 'Akun ini tidak memiliki identitas siswa, sehingga tidak ada tagihan pribadi.',
                'data' => null,
            ]);
        }

        $siswa = Siswa::with([
            'kelas',
            'transaksi' => fn ($q) => $q->orderByDesc('tanggal')
                ->orderByDesc('id_transaksi'),
        ])->find((int) $idSiswa);

        if (!$siswa) {
            return response()->json([
                'success' => true,
                'message' => 'Data siswa yang tertaut pada akun tidak ditemukan.',
                'data' => null,
            ]);
        }

        $ringkasan = $this->ringkasanIuran($siswa, null, true);

        $riwayat = $siswa->transaksi
            ->filter(fn ($t) => Transaksi::jenisMasuk($t->jenis))
            ->map(function (Transaksi $t) {
                return [
                    'id_transaksi' => $t->id_transaksi,
                    'tanggal' => $t->tanggal?->format('Y-m-d'),
                    'nominal' => (float) $t->nominal,
                    'keterangan' => $t->keterangan,
                    'kategori' => $t->kategori,
                    'periode' => $t->periode,
                ];
            })
            ->values()
            ->all();

        return response()->json([
            'success' => true,
            'data' => [
                'id_siswa' => $siswa->id_siswa,
                'nis' => $siswa->nis,
                'nama' => $siswa->nama_siswa,
                'id_kelas' => $siswa->id_kelas,
                'kelas' => $siswa->kelas?->nama_kelas ?? '',
                'status' => $siswa->status,
                'riwayat' => $riwayat,
                ...$ringkasan,
            ],
        ]);
    }

    /**
     * Menambahkan siswa.
     */
    public function store(Request $request): JsonResponse
    {
        /* =====================================================
           S3-07 - PENGAMAN SIMPAN GANDA (IDEMPOTENSI)
           ===================================================== */
        $tanggapanDuplikat = $this->klaimIdempotensi($request);

        if ($tanggapanDuplikat !== null) {
            return $tanggapanDuplikat;
        }

        try {
            return $this->tambahSiswa($request);
        } catch (QueryException $e) {
            // S3-07: NIS kini dijamin unik di database; permintaan
            // hampir bersamaan dengan NIS sama didorong dengan pesan
            // yang ramah (bukan galat internal).
            $this->lepaskanIdempotensi($request);

            if ((int) ($e->errorInfo[1] ?? 0) === 1062
                && str_contains((string) $e->getMessage(), 'nis')) {
                throw ValidationException::withMessages([
                    'nis' => ['NIS sudah digunakan siswa lain.'],
                ]);
            }

            throw $e;
        } catch (\Throwable $e) {
            // Proses gagal → lepaskan klaim agar boleh dicoba lagi.
            $this->lepaskanIdempotensi($request);
            throw $e;
        }
    }

    /**
     * Logika penyimpanan siswa asli (utuh), hanya respons akhir yang
     * dibungkus pengaman idempotensi.
     */
    private function tambahSiswa(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nis' => [
                'required',
                'string',
                'max:11',
                'unique:siswa,nis',
            ],
            'nama' => [
                'required',
                'string',
                'min:3',
                'max:100',
            ],
            'id_kelas' => [
                'nullable',
                'integer',
                'exists:kelas,id_kelas',
            ],
            'jenis_kelamin' => [
                'nullable',
                Rule::in(['L', 'P', 'Laki-Laki', 'Perempuan']),
            ],
            'status' => [
                'nullable',
                Rule::in(['Aktif', 'Tidak Aktif']),
            ],
            'no_hp' => [
                'nullable',
                'string',
                'max:20',
            ],
        ], [
            'nis.required' => 'NIS wajib diisi.',
            'nis.max' => 'NIS maksimal 11 karakter.',
            'nis.unique' => 'NIS sudah digunakan siswa lain.',
            'nama.required' => 'Nama siswa wajib diisi.',
            'nama.min' => 'Nama siswa minimal 3 karakter.',
            'nama.max' => 'Nama siswa maksimal 100 karakter.',
            'id_kelas.exists' => 'Jurusan yang dipilih tidak ditemukan.',
            'jenis_kelamin.in' => 'Jenis kelamin harus Laki-Laki atau Perempuan.',
            'status.in' => 'Status harus Aktif atau Tidak Aktif.',
            'no_hp.max' => 'Nomor HP maksimal 20 karakter.',
        ]);

        // Kelas mengikuti pengguna: admin boleh memilih, non-admin
        // diikat kelasnya sendiri bila id_kelas tidak dikirim.
        $batasKelas = $this->kelasDibatasi($request);

        if ($batasKelas === -1) {
            return response()->json([
                'message' => 'Kelas Anda belum ditetapkan oleh admin.',
            ], 403);
        }

        // Anti-IDOR: non-admin selalu diikat ke kelasnya sendiri;
        // id_kelas dari klien diabaikan agar tidak dapat menulis
        // data ke kelas lain.
        $idKelas = $batasKelas ?? ($validated['id_kelas'] ?? null);

        $jenisKelamin = null;
        if (!empty($validated['jenis_kelamin'])) {
            $jenisKelamin = $validated['jenis_kelamin'] === 'L' ? 'Laki-Laki' : 'Perempuan';
        }

        $siswa = Siswa::create([
            'nis' => $validated['nis'],
            'nama_siswa' => trim($validated['nama']),
            'id_kelas' => $idKelas,
            'Jenis_Kelamin' => $jenisKelamin,
            'status' => $validated['status'] ?? 'Aktif',
            'no_hp' => $this->normalisasiHp($validated['no_hp'] ?? null),
        ]);

        $siswa->load('kelas');

        $respons = response()->json([
            'message' => 'Data siswa berhasil ditambahkan.',
            'data' => $this->formatSiswa(
                $siswa,
                (bool) $request->user()?->aksesSemuaKelas()
            ),
        ], 201);

        // S3-07: catat tanggapan untuk permintaan identik berikutnya.
        return $this->responIdempotensi($request, $respons);
    }

    /**
     * Memperbarui siswa.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Anti-IDOR: cari siswa di dalam batas kelas pengguna.
        // Siswa milik kelas lain dianggap tidak ada (404).
        $siswa = $this->siswaTerbatas($request)->find($id);

        if (!$siswa) {
            return response()->json([
                'message' => 'Data siswa tidak ditemukan.',
            ], 404);
        }

        // Batas kelas pengguna: admin null (boleh memindahkan kelas),
        // non-admin diikat kelasnya sendiri.
        $batasKelas = $this->kelasDibatasi($request);

        $validated = $request->validate([
            'nis' => [
                'required',
                'string',
                'max:11',
                Rule::unique('siswa', 'nis')->ignore(
                    $siswa->id_siswa,
                    'id_siswa'
                ),
            ],
            'nama' => [
                'required',
                'string',
                'min:3',
                'max:100',
            ],
            'id_kelas' => [
                'nullable',
                'integer',
                'exists:kelas,id_kelas',
            ],
            'jenis_kelamin' => [
                'nullable',
                Rule::in(['L', 'P', 'Laki-Laki', 'Perempuan']),
            ],
            'status' => [
                'nullable',
                Rule::in(['Aktif', 'Tidak Aktif']),
            ],
            'no_hp' => [
                'nullable',
                'string',
                'max:20',
            ],
        ], [
            'nis.required' => 'NIS wajib diisi.',
            'nis.max' => 'NIS maksimal 11 karakter.',
            'nis.unique' => 'NIS sudah digunakan siswa lain.',
            'nama.required' => 'Nama siswa wajib diisi.',
            'nama.min' => 'Nama siswa minimal 3 karakter.',
            'nama.max' => 'Nama siswa maksimal 100 karakter.',
            'id_kelas.exists' => 'Jurusan yang dipilih tidak ditemukan.',
            'jenis_kelamin.in' => 'Jenis kelamin harus Laki-Laki atau Perempuan.',
            'status.in' => 'Status harus Aktif atau Tidak Aktif.',
            'no_hp.max' => 'Nomor HP maksimal 20 karakter.',
        ]);

        $jenisKelamin = null;
        if (!empty($validated['jenis_kelamin'])) {
            $jenisKelamin = $validated['jenis_kelamin'] === 'L' ? 'Laki-Laki' : 'Perempuan';
        }

        $siswa->update([
            'nis' => $validated['nis'],
            'nama_siswa' => trim($validated['nama']),
            // Non-admin tetap pada kelasnya; admin boleh memindahkan.
            'id_kelas' => $batasKelas ?? ($validated['id_kelas'] ?? null),
            'Jenis_Kelamin' => $jenisKelamin,
            'status' => $validated['status'] ?? 'Aktif',
            'no_hp' => $this->normalisasiHp($validated['no_hp'] ?? null),
        ]);

        $siswa->load('kelas');

        return response()->json([
            'message' => 'Data siswa berhasil diperbarui.',
            'data' => $this->formatSiswa(
                $siswa,
                (bool) $request->user()?->aksesSemuaKelas()
            ),
        ]);
    }

    /**
     * Menghapus siswa tanpa menghapus riwayat transaksi.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        // Anti-IDOR: siswa milik kelas lain dianggap tidak ada (404).
        $siswa = $this->siswaTerbatas($request)->find($id);

        if (!$siswa) {
            return response()->json([
                'message' => 'Data siswa tidak ditemukan.',
            ], 404);
        }

        // Jangan hapus identitas siswa yang masih dipakai akun pengguna.
        // Akun harus ditautkan ulang/dilepas oleh Admin lebih dulu agar
        // login tidak kehilangan identitas secara diam-diam.
        $akunTertaut = \App\Models\User::where('id_siswa', $siswa->id_siswa)->exists();

        if ($akunTertaut) {
            return response()->json([
                'message' => 'Siswa tidak dapat dihapus karena masih tertaut ke akun pengguna. Lepaskan tautan akun tersebut terlebih dahulu.',
            ], 422);
        }

        if ($siswa->transaksi()->exists()) {
            return response()->json([
                'message' => 'Siswa tidak dapat dihapus karena memiliki riwayat transaksi.',
            ], 422);
        }

        $siswa->delete();

        return response()->json([
            'message' => 'Data siswa berhasil dihapus.',
        ]);
    }

    /**
     * Format data yang dikirim ke frontend.
     */
    private function formatSiswa(Siswa $siswa, bool $includeGlobal = false): array
    {
        $ringkasanIuran = $this->ringkasanIuran($siswa, null, $includeGlobal);

        return [
            'id_siswa' => $siswa->id_siswa,
            'nis' => $siswa->nis,
            'nama' => $siswa->nama_siswa,
            'id_kelas' => $siswa->id_kelas,
            'kelas' => $siswa->kelas?->nama_kelas ?? '',
            'jenis_kelamin' => $siswa->Jenis_Kelamin ?? null,
            'no_hp' => $siswa->no_hp ?? null,
            'status' => $siswa->status,
            'status_iuran' => $ringkasanIuran['status_iuran'],
            'tagihan_iuran' => $ringkasanIuran['tagihan_iuran'],
            'terbayar_iuran' => $ringkasanIuran['terbayar_iuran'],
            'sisa_iuran' => $ringkasanIuran['sisa_iuran'],
            'rincian_iuran' => $ringkasanIuran['rincian_iuran'],
        ];
    }

    /**
     * Rapikan nomor HP menjadi digit saja (mis. "0812-3456" -> "08123456").
     * Mengembalikan null bila kosong.
     */
    private function normalisasiHp(?string $nilai): ?string
    {
        if ($nilai === null) {
            return null;
        }

        $digit = preg_replace('/\D+/', '', $nilai);

        return $digit === '' ? null : $digit;
    }

    /**
     * Ringkasan status iuran siswa dari pembayaran yang benar-benar
     * tercatat pada pasangan (id_siswa, id_iuran).
     *
     * Hanya iuran berstatus "aktif" yang sesuai kelas siswa dihitung
     * sebagai tagihan. Pembayaran untuk iuran/kelas lain tidak
     * dicampurkan ke tagihan siswa ini.
     *
     * Status akhir:
     *   - "lunas"    => tidak ada tagihan aktif, atau seluruh iuran
     *                   aktif sudah terbayar penuh;
     *   - "sebagian" => sudah ada pembayaran, tetapi belum semua lunas;
     *   - "belum"    => ada tagihan aktif dan belum ada pembayaran.
     *
     * @param  Collection<int, Iuran>|null  $iuranAktif
     * @return array{
     *     status_iuran: string,
     *     tagihan_iuran: float,
     *     terbayar_iuran: float,
     *     sisa_iuran: float,
     *     rincian_iuran: array<int, array<string, mixed>>
     * }
     */
    private function ringkasanIuran(
        Siswa $siswa,
        ?Collection $iuranAktif = null,
        bool $includeGlobal = false
    ): array {
        if ($iuranAktif === null) {
            $query = Iuran::query()
                ->whereRaw('LOWER(status) = ?', ['aktif']);

            if ($siswa->id_kelas !== null) {
                $query->where(function ($q) use ($siswa, $includeGlobal) {
                    $q->where('id_kelas', $siswa->id_kelas);

                    if ($includeGlobal) {
                        $q->orWhereNull('id_kelas');
                    }
                });
            } elseif ($includeGlobal) {
                $query->whereNull('id_kelas');
            } else {
                // Tanpa kelas dan tanpa iuran global: tidak ada tagihan.
                $query->whereRaw('1 = 0');
            }

            $iuranAktif = $query->orderBy('nama_iuran')->get();
        }

        $transaksi = $siswa->relationLoaded('transaksi')
            ? $siswa->transaksi
            : $siswa->transaksi()->get();

        // Akumulasi pembayaran per id_iuran untuk siswa ini saja.
        $pembayaran = [];

        foreach ($transaksi as $t) {
            if (!Transaksi::jenisMasuk($t->jenis) || empty($t->id_iuran)) {
                continue;
            }

            $idIuran = (int) $t->id_iuran;

            $pembayaran[$idIuran] = ($pembayaran[$idIuran] ?? 0.0)
                + (float) $t->nominal;
        }

        $tagihan = 0.0;
        $terbayar = 0.0;
        $sisa = 0.0;
        $adaPembayaran = false;
        $semuaLunas = true;
        $rincian = [];

        foreach ($iuranAktif as $iuran) {
            $nominal = (float) $iuran->nominal;
            $dibayar = (float) ($pembayaran[(int) $iuran->id_iuran] ?? 0.0);
            $terpakai = min($dibayar, $nominal);
            $sisaItem = max(0.0, $nominal - $dibayar);
            $lunasItem = $nominal <= 0.0 || $dibayar + 0.009 >= $nominal;

            if ($dibayar > 0.009) {
                $adaPembayaran = true;
            }

            if (!$lunasItem) {
                $semuaLunas = false;
            }

            $tagihan += $nominal;
            $terbayar += $terpakai;
            $sisa += $sisaItem;

            $rincian[] = [
                'id_iuran' => (int) $iuran->id_iuran,
                'nama_iuran' => $iuran->nama_iuran,
                'nominal' => round($nominal, 2),
                'terbayar' => round($terpakai, 2),
                'sisa' => round($sisaItem, 2),
                'status' => $lunasItem
                    ? 'lunas'
                    : ($dibayar > 0.009 ? 'sebagian' : 'belum'),
            ];
        }

        if ($iuranAktif->isEmpty()) {
            // Tanpa tagihan aktif, sisa tagihan = 0. Rumus
            // "lunas bila sisa <= 0" menghasilkan lunas, bukan belum.
            $status = 'lunas';
        } elseif ($semuaLunas) {
            $status = 'lunas';
        } elseif ($adaPembayaran) {
            $status = 'sebagian';
        } else {
            $status = 'belum';
        }

        return [
            'status_iuran' => $status,
            'tagihan_iuran' => round($tagihan, 2),
            'terbayar_iuran' => round($terbayar, 2),
            'sisa_iuran' => round($sisa, 2),
            'rincian_iuran' => $rincian,
        ];
    }
}
