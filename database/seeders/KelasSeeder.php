<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Mengisi daftar kelas dasar.
 */
class KelasSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nama_kelas' => 'XI RPL 1',
                'tingkat' => 'XI',
                'tahun_ajaran' => '2026/2027',
            ],
            [
                'nama_kelas' => 'XI DKV 1',
                'tingkat' => 'XI',
                'tahun_ajaran' => '2026/2027',
            ],
            [
                'nama_kelas' => 'XI BR 1',
                'tingkat' => 'XI',
                'tahun_ajaran' => '2026/2027',
            ],
        ];

        foreach ($data as $kelas) {
            DB::table('kelas')->updateOrInsert(
                ['nama_kelas' => $kelas['nama_kelas']],
                $kelas
            );
        }
    }
}
