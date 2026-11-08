<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
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
     * kelas seorang bendahara/viewer (admin tidak dibatasi kelas).
     */
    public function index()
    {
        $users = User::with('kelas')->orderBy('id_users')->get();

        return response()->json([
            'success' => true,
            'data' => $users->map(function ($user) {
                return $this->formatUser($user);
            }),
            'kelas' => Kelas::orderBy('nama_kelas')
                ->get(['id_kelas', 'nama_kelas']),
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
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'peran' => ['required', Rule::in(['admin', 'bendahara', 'viewer'])],
            'jenis_viewer' => ['nullable', Rule::in(['siswa', 'wali_kelas'])],
            'id_kelas' => ['nullable', 'integer', 'exists:kelas,id_kelas'],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[^A-Za-z0-9]/',
            ],
        ], [
            'email.unique' => 'Email sudah terdaftar.',
            'jenis_viewer.in' => 'Jenis viewer harus Siswa atau Wali Kelas.',
            'id_kelas.exists' => 'Kelas yang dipilih tidak ditemukan.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.regex' => 'Kata sandi harus memiliki huruf kapital dan karakter khusus.',
        ]);

        // Aturan peran ↔ jenis pengguna ditegakkan di backend:
        // bendahara selalu siswa, admin tanpa jenis pengguna.
        $peran = $validated['peran'];

        if (strtolower($peran) === 'bendahara'
            && isset($validated['jenis_viewer'])
            && $validated['jenis_viewer'] === 'wali_kelas') {
            throw ValidationException::withMessages([
                'jenis_viewer' => 'Bendahara kelas merupakan siswa, jadi jenis pengguna harus Siswa.',
            ]);
        }

        $user = new User();
        $user->name = $validated['nama'];
        $user->email = $validated['email'];
        $user->role = $validated['peran'];
        $user->jenis_viewer = $this->jenisViewerUntukPeran(
            $validated['peran'],
            $validated['jenis_viewer'] ?? null
        );
        $user->id_kelas = $this->kelasUntukPeran(
            $validated['peran'],
            $validated['id_kelas'] ?? null
        );
        $user->password = Hash::make($validated['password']);
        $user->must_change_password = true;
        $user->save();

        $user->load('kelas');

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

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id_users, 'id_users'),
            ],
            'peran' => ['required', Rule::in(['admin', 'bendahara', 'viewer'])],
            'jenis_viewer' => ['nullable', Rule::in(['siswa', 'wali_kelas'])],
            'id_kelas' => ['nullable', 'integer', 'exists:kelas,id_kelas'],
            'password' => [
                'nullable',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[^A-Za-z0-9]/',
            ],
        ], [
            'email.unique' => 'Email sudah digunakan pengguna lain.',
            'jenis_viewer.in' => 'Jenis viewer harus Siswa atau Wali Kelas.',
            'id_kelas.exists' => 'Kelas yang dipilih tidak ditemukan.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.regex' => 'Kata sandi harus memiliki huruf kapital dan karakter khusus.',
        ]);

        // Aturan peran ↔ jenis pengguna ditegakkan juga saat edit.
        $peranBaru = (int) $user->id_users === 1
            ? $user->role
            : $validated['peran'];

        // Peran akun yang sedang dipakai tidak boleh diubah agar
        // admin tidak kehilangan akses sendiri (self-lockout).
        if ((int) $user->id_users === (int) auth()->id()
            && strtolower((string) $peranBaru) !== strtolower((string) $user->role)) {
            throw ValidationException::withMessages([
                'peran' => 'Peran akun yang sedang digunakan tidak dapat diubah.',
            ]);
        }

        if (strtolower((string) $peranBaru) === 'bendahara'
            && isset($validated['jenis_viewer'])
            && $validated['jenis_viewer'] === 'wali_kelas') {
            throw ValidationException::withMessages([
                'jenis_viewer' => 'Bendahara kelas merupakan siswa, jadi jenis pengguna harus Siswa.',
            ]);
        }

        $user->name = $validated['nama'];
        $user->email = $validated['email'];

        // Akun utama tidak boleh diganti perannya.
        if ((int) $user->id_users !== 1) {
            $user->role = $validated['peran'];
        }

        $user->jenis_viewer = $this->jenisViewerUntukPeran(
            $user->role,
            $validated['jenis_viewer'] ?? null
        );

        // Admin tidak dibatasi kelas; bendahara/viewer memakai kelas terpilih.
        $user->id_kelas = $this->kelasUntukPeran(
            $user->role,
            $validated['id_kelas'] ?? null
        );

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
            $user->must_change_password = true;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Data pengguna berhasil diperbarui.',
            'data' => $this->formatUser($user->fresh('kelas')),
        ]);
    }

    /**
     * Menghapus pengguna.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ((int) $user->id_users === 1) {
            throw ValidationException::withMessages([
                'pengguna' => 'Akun Admin utama tidak dapat dihapus.',
            ]);
        }

        if ((int) $user->id_users === (int) auth()->id()) {
            throw ValidationException::withMessages([
                'pengguna' => 'Akun yang sedang digunakan tidak dapat dihapus.',
            ]);
        }

        // transaksi.id_user memakai ON DELETE RESTRICT. Tanpa
        // pemeriksaan ini, penghapusan pengguna yang pernah mencatat
        // transaksi akan menghasilkan error 500.
        if (Transaksi::where('id_user', $user->id_users)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak dapat dihapus karena memiliki riwayat transaksi.',
            ], 409);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil dihapus.',
        ]);
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
        return [
            'db_id' => $user->id_users,
            'id' => 'PGN-' . str_pad($user->id_users, 3, '0', STR_PAD_LEFT),
            'nama' => $user->name,
            'email' => $user->email,
            'peran' => strtolower($user->role),
            'jenis_viewer' => $user->jenis_viewer,
            'jenis_viewer_label' => $user->labelJenisViewer(),
            'id_kelas' => $user->id_kelas,
            'kelas' => $user->kelas?->nama_kelas,
            'login' => $user->last_login_at
                ? date('Y-m-d H:i', strtotime($user->last_login_at))
                : null,
            'utama' => (int) $user->id_users === 1,
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
