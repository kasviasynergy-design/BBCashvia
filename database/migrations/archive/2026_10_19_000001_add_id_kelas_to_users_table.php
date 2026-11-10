<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom penaut kelas pada tabel users.
     *
     * - Admin  : id_kelas NULL (akses seluruh kelas)
     * - Bendahara / Viewer : id_kelas terisi (hanya kelas tersebut)
     *
     * Kolom dibuat nullable agar admin lama dan user tanpa kelas tetap valid.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'id_kelas')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unsignedBigInteger('id_kelas')->nullable()->after('role');

                $table->foreign('id_kelas')
                    ->references('id_kelas')
                    ->on('kelas')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'id_kelas')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropForeign(['id_kelas']);
                $table->dropColumn('id_kelas');
            });
        }
    }
};
