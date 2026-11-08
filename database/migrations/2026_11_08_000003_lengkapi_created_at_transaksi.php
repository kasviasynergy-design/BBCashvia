<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * S3-08 - Melengkapi `transaksi.created_at` untuk baris lama.
 *
 * Kolom `created_at` dipulihkan pada S3-07 sebagai nullable agar baris
 * lama tidak gagal. Akibatnya 34 baris lama memiliki created_at NULL
 * dan kolom jam di dashboard/riwayat menampilkan "-". Nilai yang
 * paling akurat dan tidak mengubah tanggal bisnis adalah `tanggal`
 * (kolom datetime yang memang diisi saat transaksi dicatat).
 *
 * Migrasi ini hanya mengisi nilai yang masih NULL; tidak menimpa
 * created_at baris baru dan tidak mengubah nominal/tanggal.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('transaksi')
            || !Schema::hasColumn('transaksi', 'created_at')
            || !Schema::hasColumn('transaksi', 'tanggal')) {
            return;
        }

        DB::statement(
            'UPDATE `transaksi` SET `created_at` = `tanggal` WHERE `created_at` IS NULL'
        );
    }

    public function down(): void
    {
        // Tidak dikosongkan kembali: created_at yang sudah terisi
        // adalah data yang sah dan dibutuhkan tampilan jam.
    }
};
