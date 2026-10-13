<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE transaksi
            MODIFY metode ENUM('TF', 'CH', '') NOT NULL
        ");

        DB::table('transaksi')
            ->where('metode', 'Tranfer')
            ->update(['metode' => 'TF']);

        DB::table('transaksi')
            ->where('metode', 'Cach')
            ->update(['metode' => 'CH']);
    }

    public function down(): void
    {
        DB::table('transaksi')
            ->where('metode', 'TF')
            ->update(['metode' => 'Tranfer']);

        DB::table('transaksi')
            ->where('metode', 'CH')
            ->update(['metode' => 'Cach']);

        DB::statement("
            ALTER TABLE transaksi
            MODIFY metode ENUM('Tranfer', 'Cach', '') NOT NULL
        ");
    }
};
