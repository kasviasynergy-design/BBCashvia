<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Mengisi data siswa contoh.
 *
 * Catatan skema:
 * - id_kelas : foreign key ke tabel kelas. Nama kelas selalu diambil
 *              dari relasi ini, tidak disimpan ulang di tabel siswa.
 */
class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil id_kelas dari tabel kelas (dibuat oleh KelasSeeder).
        $idKelas = DB::table('kelas')
            ->pluck('id_kelas', 'nama_kelas');

        $data = [
            [
                'nis' => '2026001',
                'nama_siswa' => 'Andi Pratama',
                'id_kelas' => $idKelas['XI RPL 1'] ?? null,
                'Jenis_Kelamin' => 'Laki-Laki',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026002',
                'nama_siswa' => 'Siti Aulia',
                'id_kelas' => $idKelas['XI RPL 1'] ?? null,
                'Jenis_Kelamin' => 'Perempuan',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026003',
                'nama_siswa' => 'Budi Santoso',
                'id_kelas' => $idKelas['XI BR 1'] ?? null,
                'Jenis_Kelamin' => 'Laki-Laki',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026004',
                'nama_siswa' => 'Nadia Putri',
                'id_kelas' => $idKelas['XI DKV 1'] ?? null,
                'Jenis_Kelamin' => 'Perempuan',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026005',
                'nama_siswa' => 'Rizky Maulana',
                'id_kelas' => $idKelas['XI RPL 1'] ?? null,
                'Jenis_Kelamin' => 'Laki-Laki',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026006',
                'nama_siswa' => 'Salsabila Putri',
                'id_kelas' => $idKelas['XI RPL 1'] ?? null,
                'Jenis_Kelamin' => 'Perempuan',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026007',
                'nama_siswa' => 'Fajar Nugraha',
                'id_kelas' => $idKelas['XI DKV 1'] ?? null,
                'Jenis_Kelamin' => 'Laki-Laki',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026008',
                'nama_siswa' => 'Citra Lestari',
                'id_kelas' => $idKelas['XI BR 1'] ?? null,
                'Jenis_Kelamin' => 'Perempuan',
                'status' => 'Aktif',
            ],
            [
                'nis' => '2026009',
                'nama_siswa' => 'Bayu Aditya',
                'id_kelas' => $idKelas['XI RPL 1'] ?? null,
                'Jenis_Kelamin' => 'Laki-Laki',
                'status' => 'Tidak Aktif',
            ],
            [
                'nis' => '2026010',
                'nama_siswa' => 'Dewi Anggraini',
                'id_kelas' => $idKelas['XI RPL 1'] ?? null,
                'Jenis_Kelamin' => 'Perempuan',
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
