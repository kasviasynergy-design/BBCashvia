
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksi', function (Blueprint $table) {
            $table->unsignedBigInteger('id_siswa')->nullable()->after('id_user');

            $table->foreign('id_siswa', 'transaksi_id_siswa_foreign')
                ->references('id_siswa')
                ->on('siswa')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transaksi', function (Blueprint $table) {
            $table->dropForeign('transaksi_id_siswa_foreign');
            $table->dropColumn('id_siswa');
        });
    }
};
