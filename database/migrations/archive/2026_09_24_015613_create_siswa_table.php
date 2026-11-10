<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('siswa', function (Blueprint $table) {

            $table->renameColumn('id', 'id_siswa');

            $table->string('nis', 20)
                ->after('id_siswa');

            $table->string('nama_siswa', 100)
                ->after('nis');

            $table->enum('id_kelas', [
                'X RPL 1',
                'X BR 1',
                'X DKV 1'
            ])
                ->nullable()
                ->after('nama_siswa');

            $table->enum('status', [
                'Aktif',
                'Tidak Aktif'
            ])
                ->default('Aktif')
                ->after('id_kelas');

            $table->dropColumn([
                'created_at',
                'updated_at'
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('siswa', function (Blueprint $table) {

            $table->renameColumn('id_siswa', 'id');

            $table->dropColumn([
                'nis',
                'nama_siswa',
                'id_kelas',
                'status'
            ]);

            $table->timestamps();
        });
    }
};
