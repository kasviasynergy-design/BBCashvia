<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom id_kelas pada tabel iuran.
     *
     * Iuran bisa berlaku untuk satu kelas tertentu. Bendahara hanya
     * melihat & mengelola iuran kelasnya; admin melihat semua kelas.
     * Iuran lama dibiarkan NULL (berlaku umum / dikelola admin).
     */
    public function up(): void
    {
        if (!Schema::hasColumn('iuran', 'id_kelas')) {
            Schema::table('iuran', function (Blueprint $table) {
                $table->unsignedBigInteger('id_kelas')->nullable()->after('id_iuran');

                $table->foreign('id_kelas')
                    ->references('id_kelas')
                    ->on('kelas')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('iuran', 'id_kelas')) {
            Schema::table('iuran', function (Blueprint $table) {
                $table->dropForeign(['id_kelas']);
                $table->dropColumn('id_kelas');
            });
        }
    }
};
