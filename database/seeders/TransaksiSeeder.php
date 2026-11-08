<?php

namespace Database\Seeders;

use App\Models\Transaksi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Mengisi transaksi contoh.
 *
 * Catatan skema:
 * - kolom pengguna : id_user (bukan id)
 * - jenis          : enum('pemasukan','pengeluaran')
 * - metode         : enum('TF','CH','')
 * - kategori       : enum sesuai Transaksi::KATEGORI
 */
class TransaksiSeeder extends Seeder
{
    public function run(): void
    {
        // Pengguna admin sebagai pencatat transaksi.
        $user = DB::table('users')
            ->orderBy('id_users')
            ->first();

        if (!$user) {
            throw new \RuntimeException(
                'Jalankan UserSeeder terlebih dahulu.'
            );
        }

        $idUser = $user->id_users;

        // Ambil beberapa siswa & iuran untuk dikaitkan.
        $siswa = DB::table('siswa')->orderBy('id_siswa')->get();
        $iuran = DB::table('iuran')
            ->pluck('id_iuran', 'nama_iuran');

        if ($siswa->isEmpty()) {
            throw new \RuntimeException(
                'Jalankan KelasSeeder dan SiswaSeeder terlebih dahulu.'
            );
        }

        // Kelas pertama dipakai untuk pengeluaran umum (tanpa siswa).
        $idKelasDefault = DB::table('kelas')->orderBy('id_kelas')->value('id_kelas');

        // Daftar transaksi contoh: [no_bukti, jenis, kategori, keterangan,
        // nominal, uang_diterima, metode, tanggal, index siswa].
        $data = [
            ['TRX-2026-001', 'pemasukan', 'Iuran', 'Kas mingguan pekan ke-1', 5000, 5000, 'CH', '2026-10-01', 0],
            ['TRX-2026-002', 'pemasukan', 'Iuran', 'Kas mingguan pekan ke-2', 5000, 10000, 'CH', '2026-10-08', 1],
            ['TRX-2026-003', 'pemasukan', 'kas', 'Setoran kas kelas', 50000, 50000, 'TF', '2026-10-09', 2],
            ['TRX-2026-004', 'pengeluaran', 'kebutuhan kelas', 'Pembelian spidol & penghapus', 25000, 25000, 'CH', '2026-10-10', null],
            ['TRX-2026-005', 'pemasukan', 'Iuran', 'Iuran bulanan Oktober', 20000, 20000, 'TF', '2026-10-11', 3],
            ['TRX-2026-006', 'pengeluaran', 'perlengkapan kelas', 'Beli kertas HVS 2 rim', 30000, 30000, 'CH', '2026-10-12', null],
            ['TRX-2026-007', 'pemasukan', 'Iuran', 'Iuran kegiatan (cicilan)', 25000, 25000, 'CH', '2026-10-13', 4],
            ['TRX-2026-008', 'pemasukan', 'pemasukan lainnya', 'Donasi alumni', 150000, 150000, 'TF', '2026-10-14', null],
            ['TRX-2026-009', 'pengeluaran', 'kegiatan kelas', 'Konsumsi rapat kelas', 45000, 50000, 'CH', '2026-10-15', null],
            ['TRX-2026-010', 'pemasukan', 'Iuran', 'Kas mingguan pekan ke-3', 5000, 5000, 'CH', '2026-10-15', 5],
            ['TRX-2026-011', 'pengeluaran', 'pengeluaran lainnya', 'Iuran kebersihan lingkungan', 20000, 20000, 'CH', '2026-10-16', null],
            ['TRX-2026-012', 'pemasukan', 'kas', 'Setoran kas kelas', 75000, 75000, 'TF', '2026-10-17', 6],
            ['TRX-2026-013', 'pemasukan', 'Iuran', 'Iuran bulanan susulan', 20000, 20000, 'CH', '2026-10-17', 7],
            ['TRX-2026-014', 'pengeluaran', 'kebutuhan kelas', 'Cetak banner kelas', 60000, 60000, 'TF', '2026-10-18', null],
            ['TRX-2026-015', 'pemasukan', 'Iuran', 'Kas mingguan pekan ke-4', 5000, 5000, 'CH', '2026-10-18', 8],
        ];

        // Iuran yang dikaitkan ke transaksi iuran (jika ada).
        $iuranIds = array_values(
            $iuran->only(
                ['Kas Mingguan', 'Iuran Bulanan', 'Iuran Kegiatan']
            )->all()
        );

        foreach ($data as $baris) {
            [
                $noBukti, $jenis, $kategori, $keterangan,
                $nominal, $diterima, $metode, $tanggal, $idxSiswa
            ] = $baris;

            $siswaBaris = $idxSiswa !== null && isset($siswa[$idxSiswa])
                ? $siswa[$idxSiswa]
                : null;

            // Kelas transaksi: dari siswa terkait, atau kelas pertama
            // untuk pengeluaran umum (tanpa siswa).
            $idKelas = $siswaBaris->id_kelas ?? $idKelasDefault;

            DB::table('transaksi')->updateOrInsert(
                ['no_bukti' => $noBukti],
                [
                    'id_user' => $idUser,
                    'id_siswa' => $siswaBaris->id_siswa ?? null,
                    'id_kelas' => $idKelas,
                    'id_iuran' => $iuranIds
                        ? $iuranIds[array_rand($iuranIds)]
                        : null,
                    'tanggal' => $tanggal . ' 08:00:00',
                    'nominal' => $nominal,
                    'keterangan' => $keterangan,
                    'nama_pembayar' => $siswaBaris->nama_siswa ?? null,
                    'metode' => $metode,
                    'jenis' => $jenis,
                    'kategori' => $kategori,
                    'pic' => $user->name,
                    'periode' => 'Oktober 2026',
                    'uang_diterima' => $diterima,
                    'kembalian' => $diterima - $nominal,
                    'created_at' => $tanggal . ' 08:00:00',
                ]
            );
        }
    }
}
