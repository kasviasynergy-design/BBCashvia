<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * S3-07 - Menyamakan lebar kolom `siswa.nis` dengan aturan validasi
 * aplikasi (`max:20`) dan definisi migrasi (`string('nis', 20)`).
 *
 * Database nyata menyimpan kolom ini sebagai VARCHAR(11). Akibatnya
 * NIS yang sah menurut validasi (12–20 karakter) gagal saat INSERT
 * dengan "Data too long for column 'nis'" dan permintaan berakhir 503.
 *
 * Migrasi ini idempoten: hanya melebarkan bila panjangnya masih
 * kurang dari 20. Indeks UNIQUE `siswa_nis_unique` tetap dipertahankan.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('siswa') || !Schema::hasColumn('siswa', 'nis')) {
            return;
        }

        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        $panjang = DB::table('information_schema.COLUMNS')
            ->where('TABLE_SCHEMA', DB::getDatabaseName())
            ->where('TABLE_NAME', 'siswa')
            ->where('COLUMN_NAME', 'nis')
            ->value('CHARACTER_MAXIMUM_LENGTH');

        if ($panjang !== null && (int) $panjang < 20) {
            DB::statement(
                'ALTER TABLE `siswa` MODIFY `nis` VARCHAR(20) NOT NULL'
            );
        }
    }

    public function down(): void
    {
        // Sengaja tidak dikembalikan ke VARCHAR(11): data yang sudah
        // tersimpan dengan NIS lebih dari 11 karakter akan terpotong.
    }
};
