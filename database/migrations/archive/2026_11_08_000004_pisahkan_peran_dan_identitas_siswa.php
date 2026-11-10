<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Memisahkan PERAN akun dari IDENTITAS SISWA.
 *
 * - `users.id_siswa` menautkan akun Bendahara / Viewer Siswa ke satu
 *   baris `siswa`. Akun Admin dan Viewer Wali Kelas dibiarkan NULL.
 * - `transaksi.nama_petugas` menyimpan nama pencatat sebagai snapshot.
 *   Riwayat tetap terbaca walau akun pengguna kelak dihapus.
 * - `transaksi.id_user` boleh NULL dan memakai ON DELETE SET NULL agar
 *   penghapusan akun tidak pernah menghapus riwayat keuangan.
 *
 * Migrasi ini tidak menghapus/mengubah nominal transaksi dan tidak
 * menebak pasangan siswa untuk akun lama yang ambigu. Akun lama tetap
 * `id_siswa = NULL` sampai Admin menautkannya lewat menu pengguna.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('users')
            && !Schema::hasColumn('users', 'id_siswa')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unsignedBigInteger('id_siswa')
                    ->nullable()
                    ->after('jenis_viewer');

                $table->unique('id_siswa', 'users_id_siswa_unique');

                $table->foreign('id_siswa', 'users_id_siswa_foreign')
                    ->references('id_siswa')
                    ->on('siswa')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
            });
        }

        if (Schema::hasTable('transaksi')
            && !Schema::hasColumn('transaksi', 'nama_petugas')) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->string('nama_petugas', 100)
                    ->nullable()
                    ->after('id_user');
            });
        }

        // Isi snapshot pencatat untuk seluruh transaksi lama yang masih
        // memiliki akun. Transaksi tanpa akun tetap NULL (tidak ditebak).
        if (Schema::hasTable('transaksi')
            && Schema::hasColumn('transaksi', 'nama_petugas')
            && Schema::hasColumn('transaksi', 'id_user')) {
            if (Schema::getConnection()->getDriverName() === 'mysql') {
                DB::statement(
                    'UPDATE `transaksi` t
                     INNER JOIN `users` u ON u.`id_users` = t.`id_user`
                     SET t.`nama_petugas` = u.`name`
                     WHERE t.`nama_petugas` IS NULL'
                );
            } else {
                DB::table('transaksi')
                    ->whereNull('nama_petugas')
                    ->whereNotNull('id_user')
                    ->orderBy('id_transaksi')
                    ->chunkById(200, function ($baris) {
                        $nama = DB::table('users')
                            ->whereIn('id_users', $baris->pluck('id_user'))
                            ->pluck('name', 'id_users');

                        foreach ($baris as $row) {
                            DB::table('transaksi')
                                ->where('id_transaksi', $row->id_transaksi)
                                ->update([
                                    'nama_petugas' => $nama[$row->id_user] ?? null,
                                ]);
                        }
                    }, 'id_transaksi');
            }
        }

        $this->ubahRelasiPencatat();
    }

    public function down(): void
    {
        // Kembalikan foreign key ke perilaku lama hanya bila tidak ada
        // baris yang bergantung pada id_user NULL.
        if (Schema::hasTable('transaksi')
            && Schema::hasColumn('transaksi', 'id_user')
            && DB::table('transaksi')->whereNull('id_user')->doesntExist()) {
            $driver = Schema::getConnection()->getDriverName();

            if ($driver === 'mysql') {
                Schema::table('transaksi', function (Blueprint $table) {
                    $table->dropForeign('transaksi_id_user_foreign');
                });

                DB::statement(
                    'ALTER TABLE `transaksi`
                     MODIFY `id_user` BIGINT UNSIGNED NOT NULL'
                );

                Schema::table('transaksi', function (Blueprint $table) {
                    $table->foreign('id_user', 'transaksi_id_user_foreign')
                        ->references('id_users')
                        ->on('users')
                        ->cascadeOnUpdate()
                        ->restrictOnDelete();
                });
            }
        }

        if (Schema::hasTable('transaksi')
            && Schema::hasColumn('transaksi', 'nama_petugas')) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->dropColumn('nama_petugas');
            });
        }

        if (Schema::hasTable('users')
            && Schema::hasColumn('users', 'id_siswa')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropForeign('users_id_siswa_foreign');
                $table->dropUnique('users_id_siswa_unique');
                $table->dropColumn('id_siswa');
            });
        }
    }

    /**
     * Jadikan `transaksi.id_user` nullable dan ganti foreign key menjadi
     * ON DELETE SET NULL. Di MySQL operasi dilakukan eksplisit agar
     * nama constraint tetap `transaksi_id_user_foreign`.
     */
    private function ubahRelasiPencatat(): void
    {
        if (!Schema::hasTable('transaksi')
            || !Schema::hasColumn('transaksi', 'id_user')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            $adaConstraint = DB::table('information_schema.TABLE_CONSTRAINTS')
                ->where('CONSTRAINT_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', 'transaksi')
                ->where('CONSTRAINT_NAME', 'transaksi_id_user_foreign')
                ->exists();

            if ($adaConstraint) {
                Schema::table('transaksi', function (Blueprint $table) {
                    $table->dropForeign('transaksi_id_user_foreign');
                });
            }

            DB::statement(
                'ALTER TABLE `transaksi`
                 MODIFY `id_user` BIGINT UNSIGNED NULL DEFAULT NULL'
            );

            Schema::table('transaksi', function (Blueprint $table) {
                $table->foreign('id_user', 'transaksi_id_user_foreign')
                    ->references('id_users')
                    ->on('users')
                    ->cascadeOnUpdate()
                    ->nullOnDelete();
            });

            return;
        }

        // Driver lain (mis. SQLite untuk pengujian): cukup buat kolom
        // nullable. Perubahan foreign key tidak portabel di SQLite dan
        // penghapusan pengguna juga dibantu secara eksplisit di controller.
        try {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->unsignedBigInteger('id_user')->nullable()->change();
            });
        } catch (\Throwable $e) {
            // Skema pengujian mungkin belum memiliki tabel transaksi.
        }
    }
};
