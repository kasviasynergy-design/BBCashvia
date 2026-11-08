<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * S3-07 - Memulihkan kolom timestamp yang hilang pada database nyata.
 *
 * Migrasi pembuat tabel `transaksi` sudah mendefinisikan `created_at`,
 * tetapi tabel di database `bbcashvia` tidak memilikinya. Akibatnya
 * setiap penyimpanan lewat Eloquent gagal:
 *
 *   SQLSTATE[42S22]: Column not found: 1054 Unknown column
 *   'created_at' in 'field list'
 *
 * Migrasi ini hanya menambah kolom yang benar-benar belum ada,
 * sehingga aman dijalankan pada database yang sudah lengkap.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (
            Schema::hasTable('transaksi')
            && !Schema::hasColumn('transaksi', 'created_at')
        ) {
            Schema::table('transaksi', function (Blueprint $table) {
                // Nullable agar baris lama (yang terlanjur tersimpan
                // tanpa kolom ini) tidak menggagalkan penambahan.
                $table->dateTime('created_at')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (
            Schema::hasTable('transaksi')
            && Schema::hasColumn('transaksi', 'created_at')
        ) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->dropColumn('created_at');
            });
        }
    }
};
