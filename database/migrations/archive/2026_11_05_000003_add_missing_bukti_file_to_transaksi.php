<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * S3-07 - Memulihkan kolom `transaksi.bukti_file` yang hilang.
 *
 * Migrasi `2026_10_13_051044_add_bukti_file_column_to_transaksi_table`
 * tercatat sudah dijalankan, tetapi kolomnya tidak ada di database
 * nyata. Akibatnya unggah bukti pembayaran gagal:
 *
 *   SQLSTATE[42S22]: Column not found: 1054 Unknown column
 *   'bukti_file' in 'field list'
 *
 * Migrasi ini hanya menambah kolom bila benar-benar belum ada.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (
            Schema::hasTable('transaksi')
            && !Schema::hasColumn('transaksi', 'bukti_file')
        ) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->string('bukti_file')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (
            Schema::hasTable('transaksi')
            && Schema::hasColumn('transaksi', 'bukti_file')
        ) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->dropColumn('bukti_file');
            });
        }
    }
};
