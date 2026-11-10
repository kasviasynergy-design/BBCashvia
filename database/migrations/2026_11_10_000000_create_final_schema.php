<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Skema final BBCashvia untuk instalasi baru.
 *
 * Migrasi lama diarsipkan ke database/migrations/archive karena sebagian
 * besar ditulis untuk database produksi yang sudah memiliki tabel. Akibatnya
 * `migrate:fresh` gagal pada database kosong (mis. SQLite pengujian atau
 * database baru di Railway).
 *
 * Migrasi ini:
 * - membuat seluruh tabel aplikasi bila belum ada;
 * - tidak menyentuh database lama yang sudah memiliki tabel `users` dan
 *   `transaksi` (produksi yang sudah berjalan);
 * - memakai tipe string untuk kolom enum agar kompatibel dengan SQLite dan
 *   nilai lama yang huruf besar/kecilnya berbeda.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Instalasi lama sudah memiliki skema lengkap. Jangan ubah apa pun.
        if (Schema::hasTable('users') && Schema::hasTable('transaksi')) {
            return;
        }

        if (!Schema::hasTable('kelas')) {
            Schema::create('kelas', function (Blueprint $table) {
                $table->bigIncrements('id_kelas');
                $table->string('nama_kelas', 50);
                $table->string('tingkat', 20)->nullable();
                $table->string('tahun_ajaran', 20)->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('siswa')) {
            Schema::create('siswa', function (Blueprint $table) {
                $table->bigIncrements('id_siswa');
                $table->string('nis', 20)->unique('siswa_nis_unique');
                $table->string('nama_siswa', 100);
                $table->unsignedBigInteger('id_kelas')->nullable();
                $table->string('status', 20)->default('Aktif');
                $table->string('Jenis_Kelamin', 20)->nullable();
                $table->string('no_hp', 20)->nullable();

                $table->index('id_kelas');
            });
        }

        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->bigIncrements('id_users');
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->rememberToken();
                $table->string('role', 20)->default('viewer');
                $table->string('jenis_viewer', 20)->nullable();
                $table->unsignedBigInteger('id_siswa')->nullable()->unique('users_id_siswa_unique');
                $table->unsignedBigInteger('id_kelas')->nullable();
                $table->boolean('must_change_password')->default(false);
                $table->timestamp('last_login_at')->nullable();
                $table->timestamps();

                $table->index('id_kelas');
            });
        }

        if (!Schema::hasTable('iuran')) {
            Schema::create('iuran', function (Blueprint $table) {
                $table->bigIncrements('id_iuran');
                $table->unsignedBigInteger('id_kelas')->nullable();
                $table->string('nama_iuran', 100);
                $table->text('keterangan')->nullable();
                $table->date('jatuh_tempo')->nullable();
                $table->string('kategori', 50)->nullable();
                $table->string('frekuensi', 30)->nullable();
                $table->decimal('nominal', 12, 2);
                $table->string('status', 20)->default('aktif');

                $table->index('id_kelas');
            });
        }

        if (!Schema::hasTable('transaksi')) {
            Schema::create('transaksi', function (Blueprint $table) {
                $table->bigIncrements('id_transaksi');
                $table->string('no_bukti', 30)->nullable();
                $table->unsignedBigInteger('id_user')->nullable();
                $table->string('nama_petugas', 100)->nullable();
                $table->unsignedBigInteger('id_siswa')->nullable();
                $table->unsignedBigInteger('id_kelas')->nullable();
                $table->unsignedBigInteger('id_iuran')->nullable();
                $table->dateTime('tanggal');
                $table->decimal('nominal', 12, 2);
                $table->text('keterangan')->nullable();
                $table->string('nama_pembayar', 100)->nullable();
                $table->string('metode', 10)->nullable();
                $table->string('jenis', 20);
                $table->string('kategori', 50)->nullable();
                $table->string('pic', 100)->nullable();
                $table->string('periode', 20)->nullable();
                $table->decimal('uang_diterima', 12, 2)->nullable();
                $table->decimal('kembalian', 12, 2)->default(0);
                $table->string('bukti_transaksi')->nullable();
                $table->dateTime('created_at')->nullable();

                $table->index(['id_kelas', 'id_transaksi'], 'idx_transaksi_kelas_id');
                $table->index('id_user');
                $table->index('id_siswa');
                $table->index('id_iuran');
            });
        }

        if (!Schema::hasTable('detail_transaksi')) {
            Schema::create('detail_transaksi', function (Blueprint $table) {
                $table->bigIncrements('id_detail');
                $table->unsignedBigInteger('id_transaksi');
                $table->unsignedBigInteger('id_iuran')->nullable();
                $table->string('nama_iuran', 100);
                $table->decimal('nominal', 12, 2);

                $table->index('id_transaksi');
                $table->index('id_iuran');
            });
        }

        if (!Schema::hasTable('password_reset_tokens')) {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });
        }

        if (!Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->unsignedBigInteger('user_id')->nullable()->index();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->longText('payload');
                $table->integer('last_activity')->index();
            });
        }

        if (!Schema::hasTable('cache')) {
            Schema::create('cache', function (Blueprint $table) {
                $table->string('key')->primary();
                $table->mediumText('value');
                $table->integer('expiration');
            });
        }

        if (!Schema::hasTable('cache_locks')) {
            Schema::create('cache_locks', function (Blueprint $table) {
                $table->string('key')->primary();
                $table->string('owner');
                $table->integer('expiration');
            });
        }

        if (!Schema::hasTable('jobs')) {
            Schema::create('jobs', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('queue')->index();
                $table->longText('payload');
                $table->unsignedTinyInteger('attempts');
                $table->unsignedInteger('reserved_at')->nullable();
                $table->unsignedInteger('available_at');
                $table->unsignedInteger('created_at');
            });
        }

        if (!Schema::hasTable('job_batches')) {
            Schema::create('job_batches', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('name');
                $table->integer('total_jobs');
                $table->integer('pending_jobs');
                $table->integer('failed_jobs');
                $table->longText('failed_job_ids');
                $table->mediumText('options')->nullable();
                $table->integer('cancelled_at')->nullable();
                $table->integer('created_at');
                $table->integer('finished_at')->nullable();
            });
        }

        if (!Schema::hasTable('failed_jobs')) {
            Schema::create('failed_jobs', function (Blueprint $table) {
                $table->id();
                $table->string('uuid')->unique();
                $table->text('connection');
                $table->text('queue');
                $table->longText('payload');
                $table->longText('exception');
                $table->timestamp('failed_at')->useCurrent();
            });
        }

        if (!Schema::hasTable('personal_access_tokens')) {
            Schema::create('personal_access_tokens', function (Blueprint $table) {
                $table->id();
                $table->morphs('tokenable');
                $table->string('name');
                $table->string('token', 64)->unique();
                $table->text('abilities')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamp('expires_at')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Sengaja tidak menghapus tabel. Rollback pada database produksi tidak
     * boleh menghapus data keuangan. Untuk pengujian, RefreshDatabase
     * memakai migrate:fresh yang membersihkan database lewat db:wipe.
     */
    public function down(): void
    {
        //
    }
};
