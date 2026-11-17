<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * SKKNI-4 - Rekap agregat dashboard.
 *
 * Memastikan endpoint dashboard mengirim hasil GROUP BY + COUNT/SUM
 * untuk kategori transaksi, kelas, jenis transaksi, dan status siswa.
 */
class DashboardRekapTest extends TestCase
{
    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    public function test_dashboard_mengirim_rekap_agregat_count_dan_sum(): void
    {
        $kelas = Kelas::create([
            'nama_kelas' => 'UJI REKAP AGREGAT',
            'tingkat' => 'XI',
            'tahun_ajaran' => '2026/2027',
        ]);

        $siswaA = Siswa::create([
            'nis' => 'REKAP001',
            'nama_siswa' => 'Siswa Rekap A',
            'id_kelas' => $kelas->id_kelas,
            'status' => 'Aktif',
        ]);

        $siswaB = Siswa::create([
            'nis' => 'REKAP002',
            'nama_siswa' => 'Siswa Rekap B',
            'id_kelas' => $kelas->id_kelas,
            'status' => 'Aktif',
        ]);

        $waktu = date('Y-m-d H:i:s');

        DB::table('transaksi')->insert([
            [
                'id_siswa' => $siswaA->id_siswa,
                'id_kelas' => $kelas->id_kelas,
                'tanggal' => $waktu,
                'nominal' => 10000,
                'jenis' => 'pemasukan',
                'kategori' => 'Kategori Uji Rekap',
                'created_at' => $waktu,
            ],
            [
                'id_siswa' => $siswaB->id_siswa,
                'id_kelas' => $kelas->id_kelas,
                'tanggal' => $waktu,
                'nominal' => 25000,
                'jenis' => 'pemasukan',
                'kategori' => 'Kategori Uji Rekap',
                'created_at' => $waktu,
            ],
        ]);

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'rekap' => [
                        'kategori',
                        'kelas',
                        'jenis',
                        'status_siswa',
                    ],
                ],
            ]);

        $rekap = $respons->json('data.rekap');

        $kategori = collect($rekap['kategori'])
            ->firstWhere('label', 'Kategori Uji Rekap');

        $this->assertNotNull($kategori);
        $this->assertSame(2, $kategori['total_data']);
        $this->assertEqualsWithDelta(35000.0, $kategori['total_nominal'], 0.01);

        $kelasRekap = collect($rekap['kelas'])
            ->firstWhere('label', 'UJI REKAP AGREGAT');

        $this->assertNotNull($kelasRekap);
        $this->assertSame(2, $kelasRekap['total_data']);
        $this->assertEqualsWithDelta(35000.0, $kelasRekap['total_nominal'], 0.01);

        $jenis = collect($rekap['jenis'])
            ->firstWhere('label', 'pemasukan');

        $this->assertNotNull($jenis);
        $this->assertGreaterThanOrEqual(2, $jenis['total_data']);

        $status = collect($rekap['status_siswa'])
            ->firstWhere('label', 'Aktif');

        $this->assertNotNull($status);
        $this->assertGreaterThanOrEqual(2, $status['total_data']);
    }

    public function test_rekap_bendahara_hanya_memuat_kelasnya(): void
    {
        $kelasA = Kelas::create([
            'nama_kelas' => 'UJI REKAP KELAS A',
            'tingkat' => 'XI',
            'tahun_ajaran' => '2026/2027',
        ]);

        $kelasB = Kelas::create([
            'nama_kelas' => 'UJI REKAP KELAS B',
            'tingkat' => 'XI',
            'tahun_ajaran' => '2026/2027',
        ]);

        $waktu = date('Y-m-d H:i:s');

        DB::table('transaksi')->insert([
            [
                'id_kelas' => $kelasA->id_kelas,
                'tanggal' => $waktu,
                'nominal' => 12000,
                'jenis' => 'pemasukan',
                'kategori' => 'Kategori Rekap Kelas A',
                'created_at' => $waktu,
            ],
            [
                'id_kelas' => $kelasB->id_kelas,
                'tanggal' => $waktu,
                'nominal' => 22000,
                'jenis' => 'pemasukan',
                'kategori' => 'Kategori Rekap Kelas B',
                'created_at' => $waktu,
            ],
        ]);

        $bendahara = User::create([
            'name' => 'Bendahara Rekap',
            'email' => 'bendahara_rekap_' . uniqid() . '@example.test',
            'role' => 'bendahara',
            'id_kelas' => $kelasA->id_kelas,
            'password' => Hash::make('KataSandi#1'),
            'must_change_password' => false,
        ]);

        $respons = $this->actingAs($bendahara)
            ->getJson('/bendahara/api/dashboard')
            ->assertOk();

        $rekap = $respons->json('data.rekap');

        $labelKelas = collect($rekap['kelas'])->pluck('label');
        $labelKategori = collect($rekap['kategori'])->pluck('label');

        $this->assertTrue($labelKelas->contains('UJI REKAP KELAS A'));
        $this->assertFalse($labelKelas->contains('UJI REKAP KELAS B'));
        $this->assertTrue($labelKategori->contains('Kategori Rekap Kelas A'));
        $this->assertFalse($labelKategori->contains('Kategori Rekap Kelas B'));
    }
}
