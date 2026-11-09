<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    use \App\Http\Controllers\Concerns\MengunciIdempotensi;

    /**
     * Mengambil data pengguna dari database.
     *
     * Menyertakan id_kelas & nama kelas agar admin dapat menetapkan
     * kelas seorang bendahara/viewer (admin tidak dibatasi kelas),
     * serta daftar siswa untuk menautkan identitas Bendahara /
     * Viewer Siswa.
     */
    public function index()
    {
        $users = User::with(['kelas', 'siswa.kelas'])
            ->orderBy('id_users')
            ->get();

        $tertaut = $users->pluck('id_siswa')
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->all();

        $siswa = Siswa::with('kelas')
            ->orderBy('nama_siswa')
            ->get()
            ->map(function (Siswa $item) use ($tertaut) {
                return [
                    'id_siswa' => $item->id_siswa,
                    'nis' => $item->nis,
                    'nama' => $item->nama_siswa,
                    'id_kelas' => $item->id_kelas,
                    'kelas' => $item->kelas?->nama_kelas ?? '',
                    'status' => $item->status,
                    'tertaut' => in_array((int) $item->id_siswa, $tertaut, true),
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $users->map(function ($user) {
                return $this->formatUser($user);
            }),
            'kelas' => Kelas::orderBy('nama_kelas')
                ->get(['id_kelas', 'nama_kelas']),
            'siswa' => $siswa,
        ]);
    }

    /**
     * Menambahkan pengguna baru.
     */
    public function store(Request $request)
    {
        /* =====================================================
           S3-07 - PENGAMAN SIMPAN GANDA (IDEMPOTENSI)
           ===================================================== */
        $tanggapanDuplikat = $this->klaimIdempotensi($request);

        if ($tanggapanDuplikat !== null) {
            return $tanggapanDuplikat;
        }

        try {
            return $this->tambahPengguna($request);
        } catch (QueryException $e) {
            // S3-07: email sudah dijamin unik oleh indeks database;
            // dua permintaan hampir bersamaan dijawab dengan pesan
            // ramah (bukan galat internal).
            $this->lepaskanIdempotensi($request);

            if ((int) ($e->errorInfo[1] ?? 0) === 1062) {
                if (str_contains((string) $e->getMessage(), 'users_id_siswa_unique')) {
                    throw ValidationException::withMessages([
                        'id_siswa' => ['Siswa tersebut sudah tertaut ke akun lain.'],
                    ]);
                }

                throw ValidationException::withMessages([
                    'email' => ['Email sudah terdaftar.'],
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
     * Logika penyimpanan pengguna asli (utuh), hanya respons akhir
     * yang dibungkus pengaman idempotensi.
     */
    private function tambahPengguna(Request $request)
    {
        $validated = $this->validasiPengguna($request);

        $user = new User();
        $user->email = $validated['email'];
        $user->role = $validated['peran'];
        $user->jenis_viewer = $this->jenisViewerUntukPeran(
            $validated['peran'],
            $validated['jenis_viewer'] ?? null
        );

        $this->terapkanIdentitasSiswa(
            $user,
            $validated['nama'],
            $validated['id_siswa'] ?? null,
            $validated['id_kelas'] ?? null
        );

        $user->password = Hash::make($validated['password']);
        $user->must_change_password = true;
        $user->save();

        $user->load(['kelas', 'siswa.kelas']);

        $respons = response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil ditambahkan.',
            'data' => $this->formatUser($user),
        ], 201);

        // S3-07: catat tanggapan untuk permintaan identik berikutnya.
        return $this->responIdempotensi($request, $respons);
    }

    /**
     * Memperbarui data pengguna.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $this->validasiPengguna($request, $user);

        // Peran akun yang sedang dipakai tidak boleh diubah agar
        // admin tidak kehilangan akses sendiri (self-lockout).
        $peranBaru = strtolower((string) $validated['peran']);

        if ((int) $user->id_users === (int) auth()->id()
            && $peranBaru !== strtolower((string) $user->role)) {
            throw ValidationException::withMessages([
                'peran' => 'Peran akun yang sedang digunakan tidak dapat diubah.',
            ]);
        }

        // Jangan sampai Admin terakhir berubah peran menjadi non-admin.
        if (strtolower((string) $user->role) === 'admin'
            && $peranBaru !== 'admin'
            && User::whereRaw('LOWER(role) = ?', ['admin'])->count() <= 1) {
            throw ValidationException::withMessages([
                'peran' => 'Admin terakhir tidak dapat diubah perannya.',
            ]);
        }

        $user->email = $validated['email'];
        $user->role = $validated['peran'];
        $user->jenis_viewer = $this->jenisViewerUntukPeran(
            $user->role,
            $validated['jenis_viewer'] ?? null
        );

        $this->terapkanIdentitasSiswa(
            $user,
            $validated['nama'],
            $validated['id_siswa'] ?? null,
            $validated['id_kelas'] ?? null
        );

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
            $user->must_change_password = true;
        }

        try {
            $user->save();
        } catch (QueryException $e) {
            if ((int) ($e->errorInfo[1] ?? 0) === 1062) {
                if (str_contains((string) $e->getMessage(), 'users_id_siswa_unique')) {
                    throw ValidationException::withMessages([
                        'id_siswa' => ['Siswa tersebut sudah tertaut ke akun lain.'],
                    ]);
                }

                throw ValidationException::withMessages([
                    'email' => ['Email sudah digunakan pengguna lain.'],
                ]);
            }

            throw $e;
        }

        return response()->json([
            'success' => true,
            'message' => 'Data pengguna berhasil diperbarui.',
            'data' => $this->formatUser($user->fresh(['kelas', 'siswa.kelas'])),
        ]);
    }

    /**
     * Menghapus pengguna tanpa menghapus riwayat keuangan.
     *
     * Nama pencatat disalin ke `transaksi.nama_petugas` lebih dulu,
     * lalu `transaksi.id_user` dikosongkan. Tabel siswa, transaksi,
     * dan detail_transaksi tidak pernah dihapus.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ((int) $user->id_users === (int) auth()->id()) {
            throw ValidationException::withMessages([
                'pengguna' => 'Akun yang sedang digunakan tidak dapat dihapus.',
            ]);
        }

        if (strtolower((string) $user->role) === 'admin'
            && User::whereRaw('LOWER(role) = ?', ['admin'])->count() <= 1) {
            throw ValidationException::withMessages([
                'pengguna' => 'Admin terakhir tidak dapat dihapus.',
            ]);
        }

        DB::transaction(function () use ($user) {
            // Simpan nama pencatat sebagai snapshot agar riwayat tetap
            // menampilkan siapa yang mencatat setelah akun dihapus.
            DB::table('transaksi')
                ->where('id_user', $user->id_users)
                ->where(function ($q) {
                    $q->whereNull('nama_petugas')
                        ->orWhere('nama_petugas', '');
                })
                ->update(['nama_petugas' => $user->name]);

            // Lepaskan relasi pencatat secara eksplisit (portabel untuk
            // database yang foreign key-nya belum ON DELETE SET NULL).
            DB::table('transaksi')
                ->where('id_user', $user->id_users)
                ->update(['id_user' => null]);

            $user->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil dihapus. Riwayat transaksi tetap tersimpan.',
        ]);
    }

    /**
     * Validasi bersama untuk tambah & edit pengguna.
     */
    private function validasiPengguna(Request $request, ?User $user = null): array
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                $user
                    ? Rule::unique('users', 'email')->ignore($user->id_users, 'id_users')
                    : 'unique:users,email',
            ],
            'peran' => ['required', Rule::in(['admin', 'bendahara', 'viewer'])],
            'jenis_viewer' => ['nullable', Rule::in(['siswa', 'wali_kelas'])],
            'id_siswa' => ['nullable', 'integer', 'exists:siswa,id_siswa'],
            'id_kelas' => ['nullable', 'integer', 'exists:kelas,id_kelas'],
            'password' => [
                $user ? 'nullable' : 'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[^A-Za-z0-9]/',
            ],
        ], [
            'email.unique' => $user
                ? 'Email sudah digunakan pengguna lain.'
                : 'Email sudah terdaftar.',
            'jenis_viewer.in' => 'Jenis viewer harus Siswa atau Wali Kelas.',
            'id_kelas.exists' => 'Kelas yang dipilih tidak ditemukan.',
            'id_siswa.exists' => 'Data siswa yang dipilih tidak ditemukan.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.regex' => 'Kata sandi harus memiliki huruf kapital dan karakter khusus.',
        ]);

        $peran = strtolower((string) $validated['peran']);

        // Bendahara adalah siswa yang mengelola kas kelas. Kombinasi
        // Bendahara + Wali Kelas ditolak, bukan diam-diam diubah, agar
        // kesalahan input terlihat oleh Admin.
        if ($peran === 'bendahara'
            && ($validated['jenis_viewer'] ?? null) === 'wali_kelas') {
            throw ValidationException::withMessages([
                'jenis_viewer' => 'Bendahara kelas merupakan siswa, jadi jenis pengguna harus Siswa.',
            ]);
        }

        $jenis = $this->jenisViewerUntukPeran(
            $peran,
            $validated['jenis_viewer'] ?? null
        );

        // Bendahara selalu siswa. Viewer Wali Kelas tidak memiliki
        // identitas siswa dan tidak boleh ditautkan ke baris siswa.
        $wajibSiswa = $peran === 'bendahara'
            || ($peran === 'viewer' && $jenis === 'siswa');

        $idSiswa = $validated['id_siswa'] ?? null;

        if ($wajibSiswa && ($idSiswa === null || $idSiswa === '')) {
            throw ValidationException::withMessages([
                'id_siswa' => 'Data siswa wajib dipilih untuk Bendahara atau Viewer Siswa.',
            ]);
        }

        if (!$wajibSiswa) {
            $idSiswa = null;
        }

        if ($idSiswa !== null && $idSiswa !== '') {
            $dipakai = User::where('id_siswa', (int) $idSiswa)
                ->when($user, fn ($q) => $q->where('id_users', '!=', $user->id_users))
                ->exists();

            if ($dipakai) {
                throw ValidationException::withMessages([
                    'id_siswa' => 'Siswa tersebut sudah tertaut ke akun lain.',
                ]);
            }
        }

        return array_merge($validated, [
            'peran' => $peran,
            'jenis_viewer' => $jenis,
            'id_siswa' => $idSiswa !== null && $idSiswa !== ''
                ? (int) $idSiswa
                : null,
        ]);
    }

    /**
     * Terapkan identitas siswa pada akun.
     *
     * - Bendahara / Viewer Siswa : nama & kelas mengikuti data siswa.
     * - Admin / Viewer Wali Kelas : tanpa id_siswa, kelas dari pilihan.
     */
    private function terapkanIdentitasSiswa(
        User $user,
        string $nama,
        $idSiswa,
        $idKelas
    ): void {
        if ($idSiswa === null || $idSiswa === '') {
            $user->name = $nama;
            $user->id_siswa = null;
            $user->id_kelas = $this->kelasUntukPeran(
                (string) $user->role,
                $idKelas
            );

            return;
        }

        $siswa = Siswa::findOrFail((int) $idSiswa);

        $user->id_siswa = $siswa->id_siswa;
        $user->name = $siswa->nama_siswa;
        $user->id_kelas = $siswa->id_kelas;
    }

    /**
     * Admin selalu tanpa batasan kelas (null); peran lain memakai
     * kelas yang dipilih.
     */
    private function kelasUntukPeran(string $peran, $idKelas): ?int
    {
        if (strtolower($peran) === 'admin') {
            return null;
        }

        return $idKelas !== null && $idKelas !== ''
            ? (int) $idKelas
            : null;
    }

    /**
     * Bentuk data pengguna untuk frontend.
     */
    private function formatUser(User $user): array
    {
        $siswa = $user->siswa;
        $kelas = $siswa?->kelas ?? $user->kelas;

        return [
            'db_id' => $user->id_users,
            'id' => 'PGN-' . str_pad($user->id_users, 3, '0', STR_PAD_LEFT),
            'nama' => $user->name,
            'email' => $user->email,
            'peran' => strtolower($user->role),
            'jenis_viewer' => $user->jenis_viewer,
            'jenis_viewer_label' => $user->labelJenisViewer(),
            'id_siswa' => $user->id_siswa,
            'nis' => $siswa?->nis,
            'nama_siswa' => $siswa?->nama_siswa,
            'id_kelas' => $user->id_kelas,
            'kelas' => $kelas?->nama_kelas,
            'login' => $user->last_login_at
                ? date('Y-m-d H:i', strtotime($user->last_login_at))
                : null,
            'utama' => (int) $user->id_users === 1
                || (strtolower((string) $user->role) === 'admin'
                    && (int) User::whereRaw('LOWER(role) = ?', ['admin'])->count() === 1),
        ];
    }

    /**
     * Jenis pengguna mengikuti aturan peran:
     *
     * - Admin     : selalu tanpa jenis pengguna (null).
     * - Bendahara : selalu SISWA karena bendahara kelas adalah siswa
     *               yang bertugas mengelola keuangan kelas. Pilihan
     *               "wali_kelas" dari klien sengaja diabaikan.
     * - Viewer    : siswa atau wali_kelas; nilai lain dianggap siswa.
     *
     * Aturan ini diterapkan di backend sehingga kombinasi peran &
     * jenis pengguna yang tidak sesuai tidak dapat disimpan walau
     * validasi frontend dilewati.
     */
    private function jenisViewerUntukPeran(string $peran, $jenisViewer): ?string
    {
        switch (strtolower($peran)) {
            case 'bendahara':
                return 'siswa';

            case 'viewer':
                return in_array($jenisViewer, ['siswa', 'wali_kelas'], true)
                    ? $jenisViewer
                    : 'siswa';

            default:
                return null;
        }
    }
}
