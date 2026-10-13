<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransaksiSeeder extends Seeder
{
    public function run(): void
    {
        $user = DB::table('users')
            ->where('email', 'bendahara@bbcashvia.test')
            ->first();

        $siswa = DB::table('siswa')
            ->where('nis', '2026001')
            ->first();

        $iuran = DB::table('iuran')
            ->where('nama_iuran', 'Kas Mingguan')
            ->first();

        if (!$user || !$siswa || !$iuran) {
            throw new \RuntimeException(
                'Jalankan UserSeeder, SiswaSeeder, dan IuranSeeder terlebih dahulu.'
            );
        }

        DB::table('transaksi')->updateOrInsert(
            ['no_bukti' => 'TX-DUMMY-001'],
            [
                'id_user' => $user->id,
                'id_siswa' => $siswa->id_siswa,
                'id_iuran' => $iuran->id_iuran,
                'tanggal' => now(),
                'nominal' => 5000,
                'keterangan' => 'Pembayaran kas mingguan',
                'nama_pembayar' => $siswa->nama_siswa,
                'metode' => 'Tunai',
                'jenis' => 'Masuk',
                'kategori' => 'Iuran',
                'pic' => $user->name,
                'periode' => 'Minggu 1 Oktober',
                'created_at' => now(),
                'uang_diterima' => 10000,
                'kembalian' => 5000,
            ]
        );
    }
}
