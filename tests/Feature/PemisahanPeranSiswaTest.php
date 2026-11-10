<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * Regresi pemisahan PERAN akun dari IDENTITAS SISWA.
 *
 * Fokus:
 * - Bendahara / Viewer Siswa memiliki tagihan pribadi tanpa kehilangan
 *   akses kelasnya;
 * - Viewer Siswa hanya melihat data dirinya sendiri;
 * - satu kali simpan banyak transaksi memisahkan bukti per siswa;
 * - identitas siswa tidak dapat dihapus selama masih tertaut akun.
 *
 * Semua perubahan database di-rollback (RefreshDatabase).
 */
class PemisahanPeranSiswaTest extends TestCase
{

    protected function setUp(): void
    {
        parent::setUp();

        if (DB::connection()->getDriverName() !== 'mysql') {
            $this->markTestSkipped('Perlu koneksi MySQL.');
        }

        if (!Schema::hasColumn('users', 'id_siswa')) {
            $this->markTestSkipped('Migrasi users.id_siswa belum diterapkan.');
        }
    }

    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    private function buatKelas(string $prefix): Kelas
    {
        return Kelas::create([
            'nama_kelas' => $prefix . ' ' . substr(uniqid(), -6),
            'tingkat' => 'XI',
            'tahun_ajaran' => '2026/2027',
        ]);
    }

    private function buatSiswa(Kelas $kelas, string $nama): Siswa
    {
        return Siswa::create([
            'nis' => 'PRN' . substr(uniqid(), -8),
            'nama_siswa' => $nama,
            'id_kelas' => $kelas->id_kelas,
            'status' => 'Aktif',
        ]);
    }

    private function buatIuran(Kelas $kelas, float $nominal, string $nama = 'Iuran Uji Peran'): int
    {
        return (int) DB::table('iuran')->insertGetId([
            'id_kelas' => $kelas->id_kelas,
            'nama_iuran' => $nama . ' ' . substr(uniqid(), -6),
            'kategori' => 'bulanan',
            'nominal' => $nominal,
            'status' => 'aktif',
        ]);
    }

    private function buatAkun(
        string $peran,
        ?string $jenisViewer,
        Kelas $kelas,
        ?Siswa $siswa = null,
        string $nama = 'Akun Uji Peran'
    ): User {
        return User::create([
            'name' => $nama,
            'email' => strtolower($peran) . uniqid() . '@example.test',
            'password' => 'Rahasia#123',
            'role' => $peran,
            'jenis_viewer' => $jenisViewer,
            'id_siswa' => $siswa?->id_siswa,
            'id_kelas' => $kelas->id_kelas,
        ]);
    }

    private function catatPembayaran(
        User $pencatat,
        Siswa $siswa,
        int $idIuran,
        float $nominal
    ): void {
        $this->actingAs($pencatat)
            ->postJson('/admin/api/transaksi', [
                'jenis' => 'pemasukan',
                'kategori' => 'Iuran',
                'keterangan' => 'Uji peran',
                'tanggal' => '2026-11-08',
                'nominal' => $nominal,
                'uang_diterima' => $nominal,
                'metode' => 'CH',
                'id_siswa' => $siswa->id_siswa,
                'id_iuran' => $idIuran,
                'id_kelas' => $siswa->id_kelas,
                'nama_pembayar' => $siswa->nama_siswa,
            ])
            ->assertCreated();
    }

    public function test_viewer_siswa_hanya_melihat_data_dan_tagihan_sendiri(): void
    {
        $admin = $this->admin();
        $kelas = $this->buatKelas('UJI VIEWER');
        $sendiri = $this->buatSiswa($kelas, 'Siswa Sendiri');
        $lain = $this->buatSiswa($kelas, 'Siswa Lain');
        $iuran = $this->buatIuran($kelas, 20000);

        $this->catatPembayaran($admin, $sendiri, $iuran, 5000);
        $this->catatPembayaran($admin, $lain, $iuran, 20000);

        $viewer = $this->buatAkun('viewer', 'siswa', $kelas, $sendiri);

        // Daftar siswa hanya berisi dirinya sendiri.
        $resSiswa = $this->actingAs($viewer)
            ->getJson('/data/siswa')
            ->assertOk();

        $this->assertSame(
            [(int) $sendiri->id_siswa],
            collect($resSiswa->json('data'))
                ->pluck('id_siswa')
                ->map(fn ($id) => (int) $id)
                ->all()
        );

        // Riwayat transaksi tidak membocorkan siswa lain.
        $resTransaksi = $this->actingAs($viewer)
            ->getJson('/data/transaksi')
            ->assertOk();

        $this->assertNotEmpty($resTransaksi->json('data'));
        $this->assertSame(
            [(int) $sendiri->id_siswa],
            collect($resTransaksi->json('data'))
                ->pluck('id_siswa')
                ->map(fn ($id) => (int) $id)
                ->unique()
                ->values()
                ->all()
        );

        // Tagihan pribadi berasal dari sesi, bukan parameter URL.
        $resTagihan = $this->actingAs($viewer)
            ->getJson('/data/tagihan-pribadi?id_siswa=' . $lain->id_siswa)
            ->assertOk();

        $this->assertSame(
            (int) $sendiri->id_siswa,
            (int) $resTagihan->json('data.id_siswa')
        );
        $this->assertEquals(20000.0, (float) $resTagihan->json('data.tagihan_iuran'));
        $this->assertEquals(5000.0, (float) $resTagihan->json('data.terbayar_iuran'));
        $this->assertEquals(15000.0, (float) $resTagihan->json('data.sisa_iuran'));
    }

    public function test_viewer_siswa_tanpa_tautan_tidak_melihat_seluruh_kelas(): void
    {
        $kelas = $this->buatKelas('UJI VIEWER LEPAS');
        $this->buatSiswa($kelas, 'Siswa Kelas Satu');
        $this->buatSiswa($kelas, 'Siswa Kelas Dua');

        // Akun lama yang belum ditautkan Admin: tetap Viewer Siswa,
        // tetapi tidak boleh mewarisi akses seluruh kelas.
        $viewer = $this->buatAkun('viewer', 'siswa', $kelas, null);

        $resSiswa = $this->actingAs($viewer)
            ->getJson('/data/siswa')
            ->assertOk();

        $this->assertSame([], $resSiswa->json('data'));

        $resTransaksi = $this->actingAs($viewer)
            ->getJson('/data/transaksi')
            ->assertOk();

        $this->assertSame([], $resTransaksi->json('data'));

        $resTagihan = $this->actingAs($viewer)
            ->getJson('/data/tagihan-pribadi')
            ->assertOk();

        $this->assertNull($resTagihan->json('data'));
    }

    public function test_bendahara_tetap_melihat_kelas_dan_punya_tagihan_pribadi(): void
    {
        $admin = $this->admin();
        $kelas = $this->buatKelas('UJI BENDAHARA');
        $sendiri = $this->buatSiswa($kelas, 'Bendahara Siswa');
        $lain = $this->buatSiswa($kelas, 'Siswa Kelas');
        $iuran = $this->buatIuran($kelas, 10000);

        $bendahara = $this->buatAkun('bendahara', 'siswa', $kelas, $sendiri);

        // Bendahara tetap melihat seluruh siswa kelasnya.
        $resSiswa = $this->actingAs($bendahara)
            ->getJson('/bendahara/api/siswa')
            ->assertOk();

        $ids = collect($resSiswa->json('data'))
            ->pluck('id_siswa')
            ->map(fn ($id) => (int) $id)
            ->all();

        $this->assertContains((int) $sendiri->id_siswa, $ids);
        $this->assertContains((int) $lain->id_siswa, $ids);

        // Tagihan pribadi tetap tersedia untuk bendahara.
        $resTagihan = $this->actingAs($bendahara)
            ->getJson('/data/tagihan-pribadi')
            ->assertOk();

        $this->assertSame(
            (int) $sendiri->id_siswa,
            (int) $resTagihan->json('data.id_siswa')
        );
        $this->assertEquals(10000.0, (float) $resTagihan->json('data.sisa_iuran'));
    }

    public function test_banyak_transaksi_memisahkan_bukti_per_siswa(): void
    {
        $kelas = $this->buatKelas('UJI BANYAK SISWA');
        $siswaA = $this->buatSiswa($kelas, 'Siswa A');
        $siswaB = $this->buatSiswa($kelas, 'Siswa B');
        $iuranA = $this->buatIuran($kelas, 20000, 'Iuran A');
        $iuranB = $this->buatIuran($kelas, 30000, 'Iuran B');

        $bendahara = $this->buatAkun(
            'bendahara',
            'siswa',
            $kelas,
            $siswaA,
            'Bendahara Pencatat'
        );

        $res = $this->actingAs($bendahara)
            ->postJson('/bendahara/api/transaksi', [
                'transaksi' => [
                    [
                        'jenis' => 'pemasukan',
                        'kategori' => 'Iuran',
                        'keterangan' => 'Cicilan A1',
                        'tanggal' => '2026-11-08',
                        'nominal' => 5000,
                        'uang_diterima' => 5000,
                        'metode' => 'CH',
                        'id_siswa' => $siswaA->id_siswa,
                        'id_iuran' => $iuranA,
                        'id_kelas' => $kelas->id_kelas,
                    ],
                    [
                        'jenis' => 'pemasukan',
                        'kategori' => 'Iuran',
                        'keterangan' => 'Cicilan A2',
                        'tanggal' => '2026-11-08',
                        'nominal' => 10000,
                        'uang_diterima' => 10000,
                        'metode' => 'CH',
                        'id_siswa' => $siswaA->id_siswa,
                        'id_iuran' => $iuranB,
                        'id_kelas' => $kelas->id_kelas,
                    ],
                    [
                        'jenis' => 'pemasukan',
                        'kategori' => 'Iuran',
                        'keterangan' => 'Pembayaran B',
                        'tanggal' => '2026-11-08',
                        'nominal' => 20000,
                        'uang_diterima' => 20000,
                        'metode' => 'CH',
                        'id_siswa' => $siswaB->id_siswa,
                        'id_iuran' => $iuranA,
                        'id_kelas' => $kelas->id_kelas,
                    ],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('jumlah', 3);

        $data = collect($res->json('data'));

        $buktiA = $data->where('id_siswa', $siswaA->id_siswa)->pluck('no_bukti')->unique()->values();
        $buktiB = $data->where('id_siswa', $siswaB->id_siswa)->pluck('no_bukti')->unique()->values();

        // Semua iuran satu siswa memakai satu bukti; siswa lain terpisah.
        $this->assertCount(1, $buktiA);
        $this->assertCount(1, $buktiB);
        $this->assertNotSame($buktiA->first(), $buktiB->first());

        // Snapshot pencatat tersimpan pada setiap baris.
        $this->assertSame(
            3,
            $data->filter(
                fn ($baris) => $baris['nama_petugas'] === 'Bendahara Pencatat'
            )->count()
        );

        // Setiap baris tetap memiliki rincian pembayaran sendiri.
        $this->assertSame(3, (int) DB::table('detail_transaksi')
            ->whereIn('id_transaksi', $data->pluck('id_transaksi'))
            ->count());
    }

    public function test_siswa_tertaut_akun_tidak_dapat_dihapus(): void
    {
        $admin = $this->admin();
        $kelas = $this->buatKelas('UJI HAPUS SISWA');
        $siswa = $this->buatSiswa($kelas, 'Siswa Tertaut');

        $this->buatAkun('bendahara', 'siswa', $kelas, $siswa);

        $this->actingAs($admin)
            ->deleteJson('/bendahara/api/siswa/' . $siswa->id_siswa)
            ->assertStatus(422);

        $this->assertDatabaseHas('siswa', [
            'id_siswa' => $siswa->id_siswa,
        ]);
    }
}
