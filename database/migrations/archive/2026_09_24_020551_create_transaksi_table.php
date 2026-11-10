<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id('id_transaksi');

            $table->string('no_bukti', 30);

            $table->unsignedBigInteger('id_user');

            $table->unsignedBigInteger('id_siswa')
                ->nullable();

            $table->unsignedBigInteger('id_iuran')
                ->nullable();

            $table->dateTime('tanggal');

            $table->decimal('nominal', 10, 2);

            $table->text('keterangan')
                ->nullable();

            $table->string('nama_pembayar', 100)
                ->nullable();

            $table->enum('metode', ['Transfer', 'QR Code', 'Tunai']);

            $table->enum('jenis', ['Masuk', 'Keluar']);

            $table->string('kategori', 50)
                ->nullable();

            $table->string('pic', 100)
                ->nullable();

            $table->string('periode', 20)
                ->nullable();

            $table->dateTime('created_at');

            // Uang yang diberikan oleh siswa
            $table->decimal('uang_diterima', 10, 2);

            // Uang yang dikembalikan kepada siswa
            $table->decimal('kembalian', 10, 2)
                ->default(0);

            // Relasi User
            $table->foreign('id_user')
                ->references('id_user')
                ->on('users')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            // Relasi Siswa
            $table->foreign('id_siswa')
                ->references('id_siswa')
                ->on('siswa')
                ->onUpdate('cascade')
                ->onDelete('set null');

            // Relasi Iuran
            $table->foreign('id_iuran')
                ->references('id_iuran')
                ->on('iuran')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
