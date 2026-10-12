
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('iuran', function (Blueprint $table) {

            $table->renameColumn('id', 'id_iuran');

            $table->string('nama_iuran', 100)
                ->after('id_iuran');

            $table->text('keterangan')
                ->nullable()
                ->after('nama_iuran');

            $table->date('jatuh_tempo')
                ->nullable()
                ->after('keterangan');

            $table->enum('frekuensi', [
                'Mingguan',
                'Sekali'
            ])->after('jatuh_tempo');

            $table->decimal('nominal', 10, 2)
                ->after('frekuensi');

            $table->enum('status', [
                'A',
                'S',
                'd'
            ])->after('nominal');

            $table->dropColumn([
                'created_at',
                'updated_at'
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('iuran', function (Blueprint $table) {

            $table->renameColumn('id_iuran', 'id');

            $table->dropColumn([
                'nama_iuran',
                'keterangan',
                'jatuh_tempo',
                'frekuensi',
                'nominal',
                'status'
            ]);

            $table->timestamps();
        });
    }
};
