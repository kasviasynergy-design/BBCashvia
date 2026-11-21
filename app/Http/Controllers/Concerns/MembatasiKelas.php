<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Iuran;
use App\Models\Siswa;
use App\Models\Transaksi;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Membatasi data sesuai kelas pengguna.
 *
 * - Admin            : seluruh kelas (tanpa batasan)
 * - Bendahara/Viewer : hanya kelas yang ditautkan pada users.id_kelas
 *
 * Bila pengguna non-admin belum memiliki id_kelas (belum diatur admin),
 * nilai sentinel -1 dipakai sehingga tidak ada data yang cocok. Ini
 * disengaja agar pengguna tidak melihat data kelas lain sebelum
 * kelasnya ditetapkan.
 */
trait MembatasiKelas
{
    /**
     * id_kelas pengguna, atau null bila mengakses semua kelas.
     *
     * Mengembalikan -1 bila non-admin belum punya kelas (tidak ada
     * data yang cocok).
     */
    protected function kelasDibatasi(Request $request): ?int
    {
        $user = $request->user();

        if (!$user || $user->aksesSemuaKelas()) {
            return null;
        }

        return $user->id_kelas !== null
            ? (int) $user->id_kelas
            : -1;
    }

    /**
     * Validasi parameter id_kelas HANYA bila pemintanya Admin.
     *
     * Bendahara/Viewer yang mengirim id_kelas tidak boleh mendapat 422
     * gara-gara parameter yang memang tidak mereka pakai; nilai tersebut
     * diabaikan sepenuhnya oleh terapkanFilterKelasAdmin().
     */
    protected function validasiFilterKelasAdmin(Request $request): void
    {
        if (!$request->user()?->aksesSemuaKelas()
            || $this->tanpaFilterKelas($request)) {
            return;
        }

        $request->validate([
            'id_kelas' => ['integer', 'exists:kelas,id_kelas'],
        ], [
            'id_kelas.exists' => 'Kelas yang dipilih tidak ditemukan.',
        ]);
    }

    /**
     * Terapkan filter kelas opsional HANYA untuk Admin.
     *
     * Endpoint baca (/data/siswa, /data/iuran, /data/transaksi,
     * /laporan-kas/*, dan API admin) dipakai bersama. Parameter
     * `id_kelas` dari Bendahara/Viewer sengaja diabaikan di sini:
     * pembatasan mereka tetap dipegang oleh kelasDibatasi(),
     * siswaTerbatas(), dan transaksiTerbatas().
     *
     * @param  mixed  $query  Query Builder / Eloquent Builder.
     */
    protected function terapkanFilterKelasAdmin(
        Request $request,
        $query,
        string $kolom = 'id_kelas'
    ): void {
        if (!$request->user()?->aksesSemuaKelas()) {
            return;
        }

        if ($this->tanpaFilterKelas($request)) {
            return;
        }

        $query->where($kolom, (int) $request->input('id_kelas'));
    }

    /** Nilai "Semua Kelas" tidak boleh dianggap sebagai id. */
    private function tanpaFilterKelas(Request $request): bool
    {
        if (!$request->filled('id_kelas')) {
            return true;
        }

        return strtolower(trim((string) $request->input('id_kelas'))) === 'semua';
    }

    /** Query siswa terbatas pada kelas pengguna. */
    protected function siswaTerbatas(Request $request): Builder
    {
        $query = Siswa::query();
        $idKelas = $this->kelasDibatasi($request);
        $idSiswa = $this->siswaSendiri($request);

        if ($idSiswa === -1) {
            // Viewer Siswa tanpa tautan: jangan bocorkan seluruh kelas.
            return $query->whereRaw('1 = 0');
        }

        if ($idSiswa !== null) {
            return $query->where('id_siswa', $idSiswa);
        }

        if ($idKelas !== null) {
            $query->where('id_kelas', $idKelas);
        }

        return $query;
    }

    /**
     * Identitas siswa milik pengguna yang sedang login.
     *
     * Mengembalikan -1 untuk Viewer Siswa yang belum tertaut ke
     * `siswa`, agar query mengembalikan data kosong (bukan seluruh
     * kelas). Bendahara tetap mengelola seluruh kelas walau punya
     * tagihan pribadi.
     */
    protected function siswaSendiri(Request $request): ?int
    {
        $user = $request->user();

        if ($user && $user->hanyaDataSendiri()) {
            return $user->id_siswa !== null
                ? (int) $user->id_siswa
                : -1;
        }

        return null;
    }

    /**
     * Query transaksi terbatas pada kelas pengguna.
     *
     * Memakai kolom transaksi.id_kelas sehingga mencakup pula
     * pengeluaran umum yang tidak terikat siswa. Transaksi lama yang
     * belum punya kelas (id_kelas NULL) hanya terlihat admin.
     */
    protected function transaksiTerbatas(Request $request): Builder
    {
        $query = Transaksi::query();
        $idKelas = $this->kelasDibatasi($request);
        $idSiswa = $this->siswaSendiri($request);

        if ($idSiswa === -1) {
            // Viewer Siswa tanpa tautan: tidak ada transaksi yang boleh
            // dilihat sebelum identitasnya ditetapkan Admin.
            return $query->whereRaw('1 = 0');
        }

        if ($idSiswa !== null) {
            return $query->where('id_siswa', $idSiswa);
        }

        if ($idKelas !== null) {
            $query->where('id_kelas', $idKelas);
        }

        return $query;
    }

    /** Query iuran terbatas pada kelas pengguna. */
    protected function iuranTerbatas(Request $request): Builder
    {
        $query = Iuran::query();
        $idKelas = $this->kelasDibatasi($request);

        if ($idKelas !== null) {
            $query->where('id_kelas', $idKelas);
        }

        return $query;
    }
}
