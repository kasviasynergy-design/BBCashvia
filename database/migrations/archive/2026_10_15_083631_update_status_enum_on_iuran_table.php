
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Izinkan nilai status lama dan baru untuk sementara.
        DB::statement("
            ALTER TABLE iuran
            MODIFY status ENUM(
                'Sudah bayar',
                'Belum bayar',
                'aktif',
                'selesai'
            ) NOT NULL
        ");

        // Data lama dipertahankan dan program iuran dianggap aktif.
        DB::table('iuran')
            ->whereIn('status', ['Sudah bayar', 'Belum bayar'])
            ->update(['status' => 'aktif']);

        // Tetapkan status program iuran.
        DB::statement("
            ALTER TABLE iuran
            MODIFY status ENUM('aktif', 'selesai') NOT NULL
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE iuran
            MODIFY status ENUM(
                'Sudah bayar',
                'Belum bayar',
                'aktif',
                'selesai'
            ) NOT NULL
        ");

        DB::table('iuran')
            ->whereIn('status', ['aktif', 'selesai'])
            ->update(['status' => 'Belum bayar']);

        DB::statement("
            ALTER TABLE iuran
            MODIFY status ENUM(
                'Sudah bayar',
                'Belum bayar'
            ) NOT NULL
        ");
    }
};
