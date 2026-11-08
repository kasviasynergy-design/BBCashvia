<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Mengganti nama kolom `transaksi.bukti_file` menjadi `bukti_transaksi`.
 *
 * Nama lama membingungkan karena transaksi tidak hanya menyimpan file
 * gambar/foto; kolom ini menyimpan path bukti transaksi (bisa PDF).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (
            Schema::hasTable('transaksi')
            && Schema::hasColumn('transaksi', 'bukti_file')
            && !Schema::hasColumn('transaksi', 'bukti_transaksi')
        ) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->renameColumn('bukti_file', 'bukti_transaksi');
            });
        }
    }

    public function down(): void
    {
        if (
            Schema::hasTable('transaksi')
            && Schema::hasColumn('transaksi', 'bukti_transaksi')
            && !Schema::hasColumn('transaksi', 'bukti_file')
        ) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->renameColumn('bukti_transaksi', 'bukti_file');
            });
        }
    }
};
