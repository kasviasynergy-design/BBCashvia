
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->bigIncrements('id_detail');

            $table->unsignedBigInteger('id_transaksi');
            $table->unsignedBigInteger('id_iuran');

            $table->string('nama_iuran', 100);
            $table->decimal('nominal', 12, 2);

            $table->foreign('id_transaksi')
                ->references('id_transaksi')
                ->on('transaksi')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreign('id_iuran')
                ->references('id_iuran')
                ->on('iuran')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};
