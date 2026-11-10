
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksi', function (Blueprint $table) {
            $table->foreign('id_user', 'transaksi_id_user_foreign')
                ->references('id_users')
                ->on('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreign('id_iuran', 'transaksi_id_iuran_foreign')
                ->references('id_iuran')
                ->on('iuran')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transaksi', function (Blueprint $table) {
            $table->dropForeign('transaksi_id_user_foreign');
            $table->dropForeign('transaksi_id_iuran_foreign');
        });
    }
};
