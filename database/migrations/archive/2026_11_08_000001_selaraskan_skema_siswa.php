<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * S3-08 - Menyelaraskan skema tabel `siswa` dengan validasi aplikasi,
 * model, dan tabel `kelas`.
 *
 * Temuan audit:
 * 1. `siswa.nama_siswa` di database nyata VARCHAR(50), sedangkan
 *    validasi `SiswaController` dan migrasi struktur memakai max 100.
 *    Pada MySQL non-strict, nama 51-100 karakter terpotong diam-diam.
 * 2. `siswa.nama_kelas` adalah enum NOT NULL yang tidak dibuat oleh
 *    migrasi mana pun, tidak ditulis oleh aplikasi (tidak ada di
 *    `$fillable`), dan nilainya hanya duplikasi kategori dari
 *    `kelas.nama_kelas` yang dapat diturunkan lewat `id_kelas`.
 *    Karena NOT NULL tanpa default, MySQL mengisinya dengan nilai
 *    pertama enum ("XI BR") sehingga data bisa salah tanpa error.
 * 3. `siswa.id_kelas` bertipe BIGINT(7) UNSIGNED, sedangkan
 *    `kelas.id_kelas` BIGINT(20) UNSIGNED. Lebar tampilan berbeda
 *    dan membuat skema tidak konsisten dengan foreign key-nya.
 *
 * Migrasi ini aditif/idempoten dan tidak menghapus baris transaksi.
 * Penghapusan `nama_kelas` aman karena informasi kelas tetap utuh di
 * `kelas.nama_kelas` dan dapat di-join melalui `id_kelas`.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        if (!Schema::hasTable('siswa')) {
            return;
        }

        // 1. Lebarkan nama_siswa agar sama dengan aturan validasi.
        if (Schema::hasColumn('siswa', 'nama_siswa')) {
            $panjang = DB::table('information_schema.COLUMNS')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'siswa')
                ->where('COLUMN_NAME', 'nama_siswa')
                ->value('CHARACTER_MAXIMUM_LENGTH');

            if ($panjang !== null && (int) $panjang < 100) {
                DB::statement(
                    'ALTER TABLE `siswa` MODIFY `nama_siswa` VARCHAR(100) NOT NULL'
                );
            }
        }

        // 2. Hapus kolom legacy yang redundan dan tidak dipakai.
        if (Schema::hasColumn('siswa', 'nama_kelas')) {
            Schema::table('siswa', function ($table) {
                $table->dropColumn('nama_kelas');
            });
        }

        // 3. Samakan tipe id_kelas dengan kelas.id_kelas.
        if (Schema::hasColumn('siswa', 'id_kelas')) {
            $tipe = (string) DB::table('information_schema.COLUMNS')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'siswa')
                ->where('COLUMN_NAME', 'id_kelas')
                ->value('COLUMN_TYPE');

            $sudahSesuai = str_contains($tipe, 'bigint(20)')
                || preg_match('/^bigint( unsigned)?$/i', trim($tipe)) === 1;

            if ($tipe !== '' && !$sudahSesuai) {
                $foreignKey = DB::table('information_schema.KEY_COLUMN_USAGE')
                    ->where('TABLE_SCHEMA', DB::getDatabaseName())
                    ->where('TABLE_NAME', 'siswa')
                    ->where('COLUMN_NAME', 'id_kelas')
                    ->whereNotNull('REFERENCED_TABLE_NAME')
                    ->value('CONSTRAINT_NAME');

                if ($foreignKey) {
                    DB::statement(
                        "ALTER TABLE `siswa` DROP FOREIGN KEY `{$foreignKey}`"
                    );
                }

                DB::statement(
                    'ALTER TABLE `siswa` MODIFY `id_kelas` BIGINT(20) UNSIGNED NULL DEFAULT NULL'
                );

                DB::statement(
                    'ALTER TABLE `siswa` ADD CONSTRAINT `siswa_id_kelas_foreign` '
                    . 'FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id_kelas`) '
                    . 'ON DELETE SET NULL ON UPDATE CASCADE'
                );
            }
        }
    }

    public function down(): void
    {
        // Tidak mengembalikan `nama_kelas`: kolom tersebut legacy dan
        // datanya sudah terwakili oleh relasi id_kelas -> kelas.
        // Tipe kolom juga sengaja tidak dikecilkan agar data aman.
    }
};
