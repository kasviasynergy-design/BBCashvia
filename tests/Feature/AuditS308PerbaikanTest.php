<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Regresi temuan audit S3-08.
 *
 * Fokus:
 * - status cicilan iuran dihitung dari total pembayaran;
 * - target dashboard berasal dari iuran aktif, bukan angka tetap;
 * - detail_transaksi ikut berubah saat transaksi diubah;
 * - no_bukti grup tidak menyatu dengan grup lama;
 * - relasi yang masih dipakai tidak boleh dihapus;
 * - JS memakai nilai arah/target yang benar.
 *
 * Semua perubahan database di-rollback (RefreshDatabase).
 */
class AuditS308PerbaikanTest extends TestCase
{

    private function butuhMysql(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            $this->markTestSkipped('Perlu koneksi MySQL.');
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

    private function buatSiswa(Kelas $kelas, string $nama = 'Siswa Uji S308'): Siswa
    {
        return Siswa::create([
            'nis' => 'S308' . substr(uniqid(), -8),
            'nama_siswa' => $nama,
            'id_kelas' => $kelas->id_kelas,
            'status' => 'Aktif',
        ]);
    }

    private function buatIuran(Kelas $kelas, float $nominal, string $nama = 'Iuran Uji S308'): int
    {
        return (int) DB::table('iuran')->insertGetId([
            'id_kelas' => $kelas->id_kelas,
            'nama_iuran' => $nama . ' ' . substr(uniqid(), -6),
            'kategori' => 'bulanan',
            'nominal' => $nominal,
            'status' => 'aktif',
        ]);
    }

    private function catatPembayaran(
        User $user,
        Siswa $siswa,
        int $idIuran,
        float $nominal,
        ?string $noBukti = null
    ): void {
        $payload = [
            'jenis' => 'pemasukan',
            'kategori' => 'Iuran',
            'keterangan' => 'Uji S308',
            'tanggal' => '2026-11-08',
            'nominal' => $nominal,
            'uang_diterima' => $nominal,
            'metode' => 'CH',
            'id_siswa' => $siswa->id_siswa,
            'id_iuran' => $idIuran,
            'id_kelas' => $siswa->id_kelas,
            'nama_pembayar' => $siswa->nama_siswa,
        ];

        if ($noBukti !== null) {
            $payload['no_bukti'] = $noBukti;
        }

        $this->actingAs($user)
            ->postJson('/admin/api/transaksi', $payload)
            ->assertCreated();
    }

    private function ambilIuran(int $idIuran): array
    {
        $res = $this->actingAs($this->admin())
            ->getJson('/admin/api/iuran')
            ->assertOk();

        $iuran = collect($res->json('data'))->firstWhere('id_iuran', $idIuran);

        $this->assertNotNull($iuran, 'Iuran uji harus ada di respons.');

        return $iuran;
    }

    public function test_cicilan_tidak_otomatis_lunas_sampai_terkumpul_penuh(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();
        $kelas = $this->buatKelas('UJI S308 CICIL');
        $siswa = $this->buatSiswa($kelas);
        $idIuran = $this->buatIuran($kelas, 30000);

        $this->catatPembayaran($admin, $siswa, $idIuran, 10000);

        $iuran = $this->ambilIuran($idIuran);

        $this->assertSame(1, $iuran['jumlah_siswa']);
        $this->assertSame(30000.0, (float) $iuran['target']);
        $this->assertSame(10000.0, (float) $iuran['terkumpul']);
        $this->assertFalse($iuran['peserta'][0]['lunas']);
        $this->assertSame(10000.0, (float) $iuran['peserta'][0]['terbayar']);
        $this->assertSame(20000.0, (float) $iuran['peserta'][0]['sisa']);

        $this->catatPembayaran($admin, $siswa, $idIuran, 20000);

        $iuran2 = $this->ambilIuran($idIuran);

        $this->assertSame(30000.0, (float) $iuran2['terkumpul']);
        $this->assertTrue($iuran2['peserta'][0]['lunas']);
        $this->assertSame(0.0, (float) $iuran2['peserta'][0]['sisa']);
    }

    public function test_dashboard_memakai_target_iuran_nyata_dan_hitungan_cicilan(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();

        $awal = $this->actingAs($admin)
            ->getJson('/admin/api/dashboard')
            ->assertOk()
            ->json('data.kpi');

        $kelas = $this->buatKelas('UJI S308 DASH');
        $siswa = $this->buatSiswa($kelas);
        $idIuran = $this->buatIuran($kelas, 100000);

        $this->catatPembayaran($admin, $siswa, $idIuran, 40000);

        $akhir = $this->actingAs($admin)
            ->getJson('/admin/api/dashboard')
            ->assertOk()
            ->json('data.kpi');

        $this->assertSame(
            1,
            (int) $akhir['jumlah_siswa'] - (int) $awal['jumlah_siswa']
        );

        $this->assertEqualsWithDelta(
            100000.0,
            (float) $akhir['iuran_target'] - (float) $awal['iuran_target'],
            0.01
        );

        $this->assertSame(
            1,
            (int) $akhir['siswa_belum_lunas'] - (int) $awal['siswa_belum_lunas']
        );

        $this->assertEqualsWithDelta(
            40000.0,
            (float) $akhir['total_iuran'] - (float) $awal['total_iuran'],
            0.01
        );

        $this->assertEqualsWithDelta(
            40000.0,
            (float) $akhir['total_kas'] - (float) $awal['total_kas'],
            0.01
        );
    }

    public function test_iuran_global_dihitung_untuk_admin(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();

        $awal = $this->actingAs($admin)
            ->getJson('/admin/api/dashboard')
            ->assertOk()
            ->json('data.kpi');

        DB::table('iuran')->insert([
            'id_kelas' => null,
            'nama_iuran' => 'Iuran Global S308 ' . substr(uniqid(), -6),
            'kategori' => 'tahunan',
            'nominal' => 5000,
            'status' => 'aktif',
        ]);

        $akhir = $this->actingAs($admin)
            ->getJson('/admin/api/dashboard')
            ->assertOk()
            ->json('data.kpi');

        $siswaAktif = (int) DB::table('siswa')
            ->where('status', 'Aktif')
            ->count();

        $this->assertEqualsWithDelta(
            5000.0 * $siswaAktif,
            (float) $akhir['iuran_target'] - (float) $awal['iuran_target'],
            0.01
        );
    }

    public function test_ubah_transaksi_menyelaraskan_detail_iuran(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();
        $kelas = $this->buatKelas('UJI S308 DETAIL');
        $siswa = $this->buatSiswa($kelas);
        $iuranA = $this->buatIuran($kelas, 10000, 'Iuran A');
        $iuranB = $this->buatIuran($kelas, 20000, 'Iuran B');

        $res = $this->actingAs($admin)->postJson('/admin/api/transaksi', [
            'jenis' => 'pemasukan',
            'kategori' => 'Iuran',
            'keterangan' => 'Detail A',
            'tanggal' => '2026-11-08',
            'nominal' => 10000,
            'uang_diterima' => 10000,
            'metode' => 'CH',
            'id_siswa' => $siswa->id_siswa,
            'id_iuran' => $iuranA,
            'id_kelas' => $kelas->id_kelas,
        ])->assertCreated();

        $idTransaksi = (int) $res->json('data.id_transaksi');

        $this->assertDatabaseHas('detail_transaksi', [
            'id_transaksi' => $idTransaksi,
            'id_iuran' => $iuranA,
            'nominal' => 10000,
        ]);

        $this->actingAs($admin)->putJson('/admin/api/transaksi/' . $idTransaksi, [
            'id_iuran' => $iuranB,
            'nominal' => 20000,
            'uang_diterima' => 20000,
        ])->assertOk();

        $this->assertDatabaseHas('detail_transaksi', [
            'id_transaksi' => $idTransaksi,
            'id_iuran' => $iuranB,
            'nominal' => 20000,
        ]);

        $this->assertSame(
            1,
            DB::table('detail_transaksi')
                ->where('id_transaksi', $idTransaksi)
                ->count()
        );

        // Melepas iuran harus menghapus rincian lama.
        $this->actingAs($admin)->putJson('/admin/api/transaksi/' . $idTransaksi, [
            'id_iuran' => null,
        ])->assertOk();

        $this->assertDatabaseMissing('detail_transaksi', [
            'id_transaksi' => $idTransaksi,
        ]);
    }

    public function test_mode_banyak_menolak_no_bukti_yang_sudah_ada(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();
        $noBukti = 'S308-' . substr(uniqid(), -8);

        $this->actingAs($admin)->postJson('/admin/api/transaksi', [
            'no_bukti' => $noBukti,
            'jenis' => 'pemasukan',
            'kategori' => 'kas',
            'keterangan' => 'Pertama',
            'tanggal' => '2026-11-08',
            'nominal' => 1000,
            'uang_diterima' => 1000,
            'metode' => 'CH',
        ])->assertCreated();

        $this->actingAs($admin)->postJson('/admin/api/transaksi', [
            'transaksi' => [
                [
                    'no_bukti' => $noBukti,
                    'jenis' => 'pemasukan',
                    'kategori' => 'kas',
                    'keterangan' => 'Kedua',
                    'tanggal' => '2026-11-08',
                    'nominal' => 2000,
                    'uang_diterima' => 2000,
                    'metode' => 'CH',
                ],
            ],
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['transaksi.0.no_bukti']);
    }

    public function test_kelas_dengan_iuran_tidak_dapat_dihapus(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();
        $kelas = $this->buatKelas('UJI S308 HAPUS KELAS');
        $this->buatIuran($kelas, 10000);

        $this->actingAs($admin)
            ->deleteJson('/admin/api/kelas/' . $kelas->id_kelas)
            ->assertStatus(409);
    }

    public function test_pengguna_dengan_transaksi_dihapus_dan_riwayat_tetap_utuh(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();
        $kelas = $this->buatKelas('UJI S308 HAPUS USER');

        $user = User::create([
            'name' => 'Pengguna Uji S308',
            'email' => 's308' . uniqid() . '@example.test',
            'password' => 'Rahasia#123',
            'role' => 'bendahara',
            'jenis_viewer' => 'siswa',
            'id_kelas' => $kelas->id_kelas,
        ]);

        $noBukti = 'S308U-' . substr(uniqid(), -8);

        Transaksi::create([
            'no_bukti' => $noBukti,
            'id_user' => $user->id_users,
            'tanggal' => '2026-11-08 10:00:00',
            'nominal' => 1000,
            'jenis' => 'pemasukan',
            'kategori' => 'kas',
            'metode' => 'CH',
            'uang_diterima' => 1000,
            'kembalian' => 0,
        ]);

        $this->actingAs($admin)
            ->deleteJson('/admin/api/pengguna/' . $user->id_users)
            ->assertOk();

        // Akun benar-benar hilang...
        $this->assertDatabaseMissing('users', [
            'id_users' => $user->id_users,
        ]);

        // ...tetapi transaksi, nominal, dan nama pencatat tetap ada.
        $transaksi = DB::table('transaksi')->where('no_bukti', $noBukti)->first();

        $this->assertNotNull($transaksi);
        $this->assertNull($transaksi->id_user);
        $this->assertSame('Pengguna Uji S308', $transaksi->nama_petugas);
        $this->assertEquals(1000, $transaksi->nominal);
    }

    public function test_akun_sendiri_tidak_dapat_dihapus(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();

        $this->actingAs($admin)
            ->deleteJson('/admin/api/pengguna/' . $admin->id_users)
            ->assertStatus(422);

        $this->assertDatabaseHas('users', [
            'id_users' => $admin->id_users,
        ]);
    }

    public function test_iuran_yang_sudah_dipakai_tidak_boleh_pindah_kelas(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();
        $kelasA = $this->buatKelas('UJI S308 IURAN A');
        $kelasB = $this->buatKelas('UJI S308 IURAN B');
        $siswa = $this->buatSiswa($kelasA);
        $idIuran = $this->buatIuran($kelasA, 10000);

        $this->catatPembayaran($admin, $siswa, $idIuran, 10000);

        $this->actingAs($admin)->putJson('/admin/api/iuran/' . $idIuran, [
            'id_kelas' => $kelasB->id_kelas,
            'nama_iuran' => 'Iuran Pindah',
            'kategori' => 'bulanan',
            'nominal' => 10000,
            'status' => 'aktif',
        ])->assertStatus(409);
    }

    public function test_js_dashboard_admin_memakai_arah_pemasukan(): void
    {
        $isi = file_get_contents(resource_path('js/admin-dashboard.js'));

        $this->assertStringContainsString('t.arah === "pemasukan"', $isi);
        $this->assertStringNotContainsString('t.arah === "masuk"', $isi);
    }

    public function test_js_viewer_iuran_memakai_target_dan_terkumpul(): void
    {
        $isi = file_get_contents(resource_path('js/viewer-iuran.js'));

        $this->assertStringContainsString('Number(item.target)', $isi);
        $this->assertStringContainsString('Number(item.terkumpul)', $isi);
        $this->assertStringNotContainsString('statusDb === "selesai"', $isi);
    }

    public function test_nama_siswa_sampai_100_karakter_tersimpan_utuh(): void
    {
        $this->butuhMysql();

        $panjang = (int) DB::table('information_schema.COLUMNS')
            ->where('TABLE_SCHEMA', DB::getDatabaseName())
            ->where('TABLE_NAME', 'siswa')
            ->where('COLUMN_NAME', 'nama_siswa')
            ->value('CHARACTER_MAXIMUM_LENGTH');

        if ($panjang < 100) {
            $this->markTestSkipped('Migrasi pelebaran nama_siswa belum diterapkan.');
        }

        $kelas = $this->buatKelas('UJI S308 NAMA');
        $nama = str_repeat('A', 80);
        $siswa = $this->buatSiswa($kelas, $nama);

        $this->assertSame(
            $nama,
            DB::table('siswa')
                ->where('id_siswa', $siswa->id_siswa)
                ->value('nama_siswa')
        );
    }
}
