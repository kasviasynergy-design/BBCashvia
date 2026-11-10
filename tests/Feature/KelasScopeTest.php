<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Transaksi;
use App\Models\User;
use Tests\TestCase;

class KelasScopeTest extends TestCase
{

    private function userWithRole(string $role, ?int $idKelas = null): User
    {
        $user = new User();
        $user->name = 'Uji ' . $role;
        $user->email = $role . '_' . uniqid() . '@example.test';
        $user->role = $role;
        $user->id_kelas = $idKelas;
        $user->password = 'x';

        return $user;
    }

    private function duaKelas(): array
    {
        $kelasA = Kelas::create(['nama_kelas' => 'UJI A', 'tingkat' => 'XI']);
        $kelasB = Kelas::create(['nama_kelas' => 'UJI B', 'tingkat' => 'XI']);

        Siswa::create([
            'nis' => 'UA' . substr(uniqid(), -9),
            'nama_siswa' => 'Siswa A',
            'id_kelas' => $kelasA->id_kelas,
            'nama_kelas' => 'XI RPL',
            'status' => 'Aktif',
        ]);

        Siswa::create([
            'nis' => 'UB' . substr(uniqid(), -9),
            'nama_siswa' => 'Siswa B',
            'id_kelas' => $kelasB->id_kelas,
            'nama_kelas' => 'XI RPL',
            'status' => 'Aktif',
        ]);

        return [$kelasA, $kelasB];
    }

    public function test_admin_melihat_semua_kelas(): void
    {
        $admin = $this->userWithRole('admin');

        $res = $this->actingAs($admin)->getJson('/data/kelas');

        $res->assertOk();
        $this->assertGreaterThanOrEqual(2, count($res->json('data')));
    }

    public function test_bendahara_hanya_melihat_kelasnya(): void
    {
        [$kelasA] = $this->duaKelas();

        $bendahara = $this->userWithRole('bendahara', $kelasA->id_kelas);

        $res = $this->actingAs($bendahara)->getJson('/data/kelas');

        $res->assertOk();
        $this->assertCount(1, $res->json('data'));
        $this->assertSame(
            'UJI A',
            $res->json('data.0.nama_kelas')
        );
    }

    public function test_bendahara_hanya_melihat_siswa_kelasnya(): void
    {
        [$kelasA] = $this->duaKelas();

        $bendahara = $this->userWithRole('bendahara', $kelasA->id_kelas);

        $res = $this->actingAs($bendahara)->getJson('/data/siswa');

        $res->assertOk();

        $ids = collect($res->json('data'))->pluck('id_kelas')->unique()->all();

        $this->assertSame([$kelasA->id_kelas], $ids);
    }

    public function test_viewer_hanya_melihat_siswa_kelasnya(): void
    {
        [, $kelasB] = $this->duaKelas();

        $viewer = $this->userWithRole('viewer', $kelasB->id_kelas);

        $res = $this->actingAs($viewer)->getJson('/data/siswa');

        $res->assertOk();

        $ids = collect($res->json('data'))->pluck('id_kelas')->unique()->all();

        $this->assertSame([$kelasB->id_kelas], $ids);
    }

    public function test_non_admin_tanpa_kelas_melihat_data_kosong(): void
    {
        $this->duaKelas();

        $bendahara = $this->userWithRole('bendahara', null);

        $res = $this->actingAs($bendahara)->getJson('/data/siswa');

        $res->assertOk();
        $this->assertCount(0, $res->json('data'));
    }

    public function test_admin_menyetel_kelas_pengguna(): void
    {
        $kelas = Kelas::create(['nama_kelas' => 'UJI SET', 'tingkat' => 'XI']);

        $siswa = Siswa::create([
            'nis' => 'SET' . substr(uniqid(), -8),
            'nama_siswa' => 'Siswa Set Kelas',
            'id_kelas' => $kelas->id_kelas,
            'status' => 'Aktif',
        ]);

        $admin = $this->userWithRole('admin');

        $res = $this->actingAs($admin)->postJson('/admin/api/pengguna', [
            'nama' => 'Bendahara Baru',
            'email' => 'baru' . uniqid() . '@example.test',
            'peran' => 'bendahara',
            'id_siswa' => $siswa->id_siswa,
            'id_kelas' => $kelas->id_kelas,
            'password' => 'Rahasia#123',
        ]);

        $res->assertCreated();
        $this->assertSame(
            $kelas->id_kelas,
            $res->json('data.id_kelas')
        );

        $user = User::find($res->json('data.db_id'));
        $this->assertSame($kelas->id_kelas, (int) $user->id_kelas);
        $this->assertSame((int) $siswa->id_siswa, (int) $user->id_siswa);
    }

    public function test_admin_tidak_terikat_kelas(): void
    {
        $kelas = Kelas::create(['nama_kelas' => 'UJI ADM', 'tingkat' => 'XI']);

        $admin = $this->userWithRole('admin');

        $res = $this->actingAs($admin)->postJson('/admin/api/pengguna', [
            'nama' => 'Admin Baru',
            'email' => 'adminbaru' . uniqid() . '@example.test',
            'peran' => 'admin',
            'id_kelas' => $kelas->id_kelas,
            'password' => 'Rahasia#123',
        ]);

        $res->assertCreated();
        $this->assertNull($res->json('data.id_kelas'));
    }

    public function test_label_kelas_sesuai_role(): void
    {
        $kelas = Kelas::create(['nama_kelas' => 'UJI LBL', 'tingkat' => 'XI']);

        $admin = $this->userWithRole('admin');
        $this->assertSame('Semua Kelas', $admin->labelKelas());

        $bendahara = $this->userWithRole('bendahara', $kelas->id_kelas);
        $this->assertSame('UJI LBL', $bendahara->labelKelas());

        $tanpaKelas = $this->userWithRole('viewer', null);
        $this->assertSame('Kelas belum ditetapkan', $tanpaKelas->labelKelas());
    }

    public function test_bendahara_hanya_melihat_transaksi_kelasnya(): void
    {
        [$kelasA, $kelasB] = $this->duaKelas();

        $siswaA = Siswa::where('id_kelas', $kelasA->id_kelas)->first();
        $siswaB = Siswa::where('id_kelas', $kelasB->id_kelas)->first();

        $idUser = User::query()->value('id_users') ?? 1;

        foreach ([$siswaA, $siswaB] as $siswa) {
            Transaksi::create([
                'no_bukti' => 'UJI-' . uniqid(),
                'id_user' => $idUser,
                'id_siswa' => $siswa->id_siswa,
                'id_kelas' => $siswa->id_kelas,
                'tanggal' => now(),
                'nominal' => 1000,
                'metode' => 'CH',
                'jenis' => 'pemasukan',
                'kategori' => 'kas',
                'uang_diterima' => 1000,
                'kembalian' => 0,
            ]);
        }

        $bendahara = $this->userWithRole('bendahara', $kelasA->id_kelas);

        $res = $this->actingAs($bendahara)->getJson('/data/transaksi');

        $res->assertOk();

        $idSiswa = collect($res->json('data'))->pluck('id_siswa')->unique()->all();

        $this->assertSame([$siswaA->id_siswa], $idSiswa);
    }

    public function test_bendahara_melihat_pengeluaran_umum_kelasnya(): void
    {
        [$kelasA, $kelasB] = $this->duaKelas();

        $idUser = User::query()->value('id_users') ?? 1;

        // Pengeluaran umum (tanpa siswa) untuk masing-masing kelas.
        foreach ([$kelasA, $kelasB] as $kelas) {
            Transaksi::create([
                'no_bukti' => 'UJI-UMUM-' . uniqid(),
                'id_user' => $idUser,
                'id_siswa' => null,
                'id_kelas' => $kelas->id_kelas,
                'tanggal' => now(),
                'nominal' => 5000,
                'metode' => 'CH',
                'jenis' => 'pengeluaran',
                'kategori' => 'pengeluaran lainnya',
                'uang_diterima' => 5000,
                'kembalian' => 0,
            ]);
        }

        $bendahara = $this->userWithRole('bendahara', $kelasA->id_kelas);

        $res = $this->actingAs($bendahara)->getJson('/data/transaksi');

        $res->assertOk();

        $idKelas = collect($res->json('data'))->pluck('id_kelas')->unique()->all();

        $this->assertSame([$kelasA->id_kelas], $idKelas);
    }
}
