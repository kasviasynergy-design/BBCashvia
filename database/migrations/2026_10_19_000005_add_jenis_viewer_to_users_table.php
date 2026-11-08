<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Menambahkan kolom jenis_viewer pada tabel users.
 *
 * Di lapangan, akun "viewer" dipakai oleh dua peran berbeda:
 * siswa dan wali kelas. Keduanya sama-sama hanya bisa melihat,
 * tetapi perlu dibedakan namanya di Manajemen Pengguna.
 *
 * Kolom ini hanya untuk penamaan/label; hak akses tetap sama.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('users', 'jenis_viewer')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->enum('jenis_viewer', ['siswa', 'wali_kelas'])
                ->nullable()
                ->after('role');
        });
    }

    public function down(): void
    {
        if (!Schema::hasColumn('users', 'jenis_viewer')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('jenis_viewer');
        });
    }
};
