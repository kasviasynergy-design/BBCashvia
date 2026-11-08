<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Mengisi jenis iuran contoh.
 */
class IuranSeeder extends Seeder
{
    public function run(): void
    {
        // Iuran contoh untuk setiap kelas, sehingga bendahara & viewer
        // tiap kelas melihat datanya sendiri.
        $kelas = DB::table('kelas')->orderBy('id_kelas')->get();

        // Hanya kelas nyata (tiga kelas), bukan kelas sisa pengujian.
        $kelas = $kelas->filter(function ($k) {
            return !str_starts_with((string) $k->nama_kelas, 'UJI');
        });

        if ($kelas->isEmpty()) {
            throw new \RuntimeException(
                'Jalankan KelasSeeder terlebih dahulu.'
            );
        }

        $iuranPerKelas = [
            [
                'nama_iuran' => 'Kas Mingguan',
                'keterangan' => 'Kas kelas yang dibayarkan setiap minggu.',
                'jatuh_tempo' => '2026-10-25',
                'kategori' => 'mingguan',
                'nominal' => 5000,
                'status' => 'aktif',
            ],
            [
                'nama_iuran' => 'Iuran Bulanan',
                'keterangan' => 'Iuran rutin bulanan untuk kebutuhan kelas.',
                'jatuh_tempo' => '2026-10-31',
                'kategori' => 'bulanan',
                'nominal' => 20000,
                'status' => 'aktif',
            ],
            [
                'nama_iuran' => 'Iuran Kegiatan',
                'keterangan' => 'Iuran untuk kegiatan kelas (studi wisata).',
                'jatuh_tempo' => '2026-11-15',
                'kategori' => 'sekali bayar',
                'nominal' => 50000,
                'status' => 'aktif',
            ],
        ];

        foreach ($kelas as $k) {
            foreach ($iuranPerKelas as $iuran) {
                DB::table('iuran')->updateOrInsert(
                    [
                        'nama_iuran' => $iuran['nama_iuran'],
                        'id_kelas' => $k->id_kelas,
                    ],
                    $iuran + ['id_kelas' => $k->id_kelas]
                );
            }
        }
    }
}
