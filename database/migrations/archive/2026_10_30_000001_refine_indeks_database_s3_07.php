<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
|--------------------------------------------------------------------------
| S3-07 - PENYEMPURNAAN INDEKS DATABASE
|--------------------------------------------------------------------------
| Perubahan pada migrasi ini:
|
| 1. transaksi: indeks gabungan (id_kelas, id_transaksi) untuk pola
|    kueri utama seluruh halaman (WHERE id_kelas = ? ORDER BY
|    id_transaksi DESC) yang dipakai endpoint daftar transaksi,
|    ringkasan saldo, dan dashboard per kelas.
|
| 2. siswa: UNIQUE pada kolom `nis`. Kolom ini sudah memakai aturan
|    `unique:siswa,nis` pada validasi; indeks database menjadikannya
|    jaminan mutlak sehingga dua permintaan hampir bersamaan tidak
|    dapat menghasilkan dua siswa dengan NIS sama. Data NIS saat ini
|    sudah diperiksa tidak ada duplikat, sehingga indeks aman dibuat.
|
| Catatan: bagian `saldo_awal_kas` sudah dihapus bersama fitur
| saldo awal kas, sehingga migrasi ini tidak menyentuh tabel itu lagi.
|
| Rollback (down) mengembalikan struktur persis seperti semula.
*/

return new class extends Migration
{
    public function up(): void
    {
        // 1. Indeks gabungan transaksi per kelas (halaman daftar,
        //    ringkasan, dan dashboard membaca WHERE id_kelas = ?
        //    ORDER BY id_transaksi DESC).
        Schema::table('transaksi', function (Blueprint $table) {
            $table->index(['id_kelas', 'id_transaksi'], 'idx_transaksi_kelas_id');
        });

        // 2. NIS wajib unik di tingkat database (sudah dijamin di
        //    validasi; kini juga sulit-lunak di database).
        Schema::table('siswa', function (Blueprint $table) {
            $table->unique('nis', 'siswa_nis_unique');
        });
    }

    public function down(): void
    {
        Schema::table('siswa', function (Blueprint $table) {
            $table->dropUnique('siswa_nis_unique');
        });

        Schema::table('transaksi', function (Blueprint $table) {
            $table->dropIndex('idx_transaksi_kelas_id');
        });
    }
};
