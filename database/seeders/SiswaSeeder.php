<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nis' => '2026001',
                'nama_siswa' => 'Andi Pratama',
                'id_kelas' => 'X RPL 1',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026002',
                'nama_siswa' => 'Siti Aulia',
                'id_kelas' => 'X RPL 1',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026003',
                'nama_siswa' => 'Budi Santoso',
                'id_kelas' => 'X BR 1',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026004',
                'nama_siswa' => 'Nadia Putri',
                'id_kelas' => 'X DKV 1',
                'status' => 'Aktif',
            ],
        ];

        foreach ($data as $siswa) {
            DB::table('siswa')->updateOrInsert(
                ['nis' => $siswa['nis']],
                $siswa
            );
        }
    }
}
