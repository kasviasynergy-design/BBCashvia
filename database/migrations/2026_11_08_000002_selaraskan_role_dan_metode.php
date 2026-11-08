<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * S3-08 - Menyelaraskan panjang `users.role` dan nilai enum
 * `transaksi.metode` dengan nilai yang benar-benar dipakai aplikasi.
 *
 * - `users.role` memakai VARCHAR(255) bawaan Laravel, padahal nilai
 *   yang sah hanya "admin", "bendahara", "viewer" (maksimal 9 huruf).
 *   VARCHAR(20) sudah proporsional dan tetap memberi ruang bila peran
 *   baru ditambahkan.
 * - `transaksi.metode` masih memiliki nilai enum kosong (''). Nilai
 *   itu tidak pernah dikirim UI/validasi (hanya TF/CH) dan controller
 *   mengisi "CH" bila kosong. Setelah dipastikan tidak ada baris
 *   kosong, enum dirapikan menjadi TF/CH.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        if (Schema::hasTable('users') && Schema::hasColumn('users', 'role')) {
            $panjang = DB::table('information_schema.COLUMNS')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'users')
                ->where('COLUMN_NAME', 'role')
                ->value('CHARACTER_MAXIMUM_LENGTH');

            if ($panjang !== null && (int) $panjang > 20) {
                DB::statement(
                    "ALTER TABLE `users` MODIFY `role` VARCHAR(20) NOT NULL DEFAULT 'viewer'"
                );
            }
        }

        if (Schema::hasTable('transaksi')
            && Schema::hasColumn('transaksi', 'metode')) {
            $tipe = (string) DB::table('information_schema.COLUMNS')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'transaksi')
                ->where('COLUMN_NAME', 'metode')
                ->value('COLUMN_TYPE');

            $adaNilaiKosong = DB::table('transaksi')
                ->where('metode', '')
                ->exists();

            if (str_contains($tipe, "''") && !$adaNilaiKosong) {
                DB::statement(
                    "ALTER TABLE `transaksi` MODIFY `metode` ENUM('TF','CH') NOT NULL"
                );
            }
        }
    }

    public function down(): void
    {
        // Tidak dikembalikan: nilai '' pada metode adalah sentinel
        // legacy yang tidak dipakai lagi. Role tetap aman di VARCHAR(20).
    }
};
