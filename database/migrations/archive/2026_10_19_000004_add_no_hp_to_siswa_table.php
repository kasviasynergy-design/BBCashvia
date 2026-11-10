<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Menambahkan kolom nomor HP / WhatsApp pada tabel siswa.
 *
 * Sebelumnya form & tabel Data Siswa sudah menyediakan kolom
 * "No. HP / WhatsApp", tetapi kolomnya belum ada di database
 * sehingga tidak pernah bisa disimpan.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('siswa', 'no_hp')) {
            return;
        }

        Schema::table('siswa', function (Blueprint $table) {
            $table->string('no_hp', 20)
                ->nullable()
                ->after('Jenis_Kelamin');
        });
    }

    public function down(): void
    {
        if (!Schema::hasColumn('siswa', 'no_hp')) {
            return;
        }

        Schema::table('siswa', function (Blueprint $table) {
            $table->dropColumn('no_hp');
        });
    }
};
