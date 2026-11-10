<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom id_kelas pada tabel transaksi.
     *
     * Setiap transaksi terikat ke satu kelas, termasuk pengeluaran umum
     * (tanpa siswa) seperti pembelian ATK. Bendahara hanya melihat &
     * mengelola transaksi kelasnya; admin melihat semua.
     *
     * Transaksi lama diisi otomatis dari kelas siswa terkait. Transaksi
     * yang tidak punya siswa dibiarkan NULL (hanya terlihat admin).
     */
    public function up(): void
    {
        if (!Schema::hasColumn('transaksi', 'id_kelas')) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->unsignedBigInteger('id_kelas')->nullable()->after('id_siswa');

                $table->foreign('id_kelas')
                    ->references('id_kelas')
                    ->on('kelas')
                    ->nullOnDelete();
            });

            // Isi data lama berdasarkan kelas siswa terkait.
            DB::statement("
                UPDATE transaksi t
                JOIN siswa s ON t.id_siswa = s.id_siswa
                SET t.id_kelas = s.id_kelas
                WHERE t.id_kelas IS NULL AND s.id_kelas IS NOT NULL
            ");
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('transaksi', 'id_kelas')) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->dropForeign(['id_kelas']);
                $table->dropColumn('id_kelas');
            });
        }
    }
};
