<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Filter kelas HANYA untuk Admin.
 *
 * Endpoint baca (/data/*) dipakai bersama Admin/Bendahara/Viewer.
 * Uji ini memastikan parameter id_kelas dari non-admin diabaikan,
 * bukan sekadar disembunyikan di antarmuka.
 */
class FilterKelasKhususAdminTest extends TestCase
{
    private function user(string $role, ?int $idKelas = null): User
    {
        $user = new User();
        $user->name = 'Uji Filter ' . $role;
        $user->email = 'filter-' . $role . '-' . uniqid() . '@example.test';
        $user->role = $role;
        $user->id_kelas = $idKelas;
        $user->password = bcrypt('rahasia123');

        return $user;
    }

    /** @return array{Kelas, Kelas, Siswa, Siswa, int, int} */
    private function duaKelasLengkap(): array
    {
        $kelasA = Kelas::create([
            'nama_kelas' => 'FKA-' . substr(uniqid(), -6),
            'tingkat' => 'XI',
        ]);
        $kelasB = Kelas::create([
            'nama_kelas' => 'FKB-' . substr(uniqid(), -6),
            'tingkat' => 'XI',
        ]);

        $siswaA = Siswa::create([
            'nis' => 'FA' . substr(uniqid(), -9),
            'nama_siswa' => 'Siswa Filter A',
            'id_kelas' => $kelasA->id_kelas,
            'nama_kelas' => $kelasA->nama_kelas,
            'status' => 'Aktif',
        ]);
        $siswaB = Siswa::create([
            'nis' => 'FB' . substr(uniqid(), -9),
            'nama_siswa' => 'Siswa Filter B',
            'id_kelas' => $kelasB->id_kelas,
            'nama_kelas' => $kelasB->nama_kelas,
            'status' => 'Aktif',
        ]);

        $iuranA = DB::table('iuran')->insertGetId([
            'id_kelas' => $kelasA->id_kelas,
            'nama_iuran' => 'Iuran FKA ' . uniqid(),
            'keterangan' => 'Uji filter kelas',
            'jatuh_tempo' => '2026-12-31',
            'kategori' => 'bulanan',
            'nominal' => 10000,
            'status' => 'aktif',
        ]);
        $iuranB = DB::table('iuran')->insertGetId([
            'id_kelas' => $kelasB->id_kelas,
            'nama_iuran' => 'Iuran FKB ' . uniqid(),
            'keterangan' => 'Uji filter kelas',
            'jatuh_tempo' => '2026-12-31',
            'kategori' => 'bulanan',
            'nominal' => 10000,
            'status' => 'aktif',
        ]);

        foreach ([$siswaA, $siswaB] as $siswa) {
            Transaksi::create([
                'no_bukti' => 'FK-' . uniqid(),
                'id_user' => User::query()->value('id_users') ?? 1,
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

        return [$kelasA, $kelasB, $siswaA, $siswaB, $iuranA, $iuranB];
    }

    public function test_admin_dapat_memfilter_siswa_per_kelas(): void
    {
        [$kelasA] = $this->duaKelasLengkap();

        $respons = $this->actingAs($this->user('admin'))
            ->getJson('/admin/api/siswa?serverSide=1&id_kelas=' . $kelasA->id_kelas);

        $respons->assertOk();

        $ids = collect($respons->json('data'))
            ->pluck('id_kelas')
            ->unique()
            ->all();

        $this->assertSame([$kelasA->id_kelas], $ids);
        $this->assertSame($kelasA->id_kelas, $respons->json('id_kelas_filter'));
        $this->assertSame(10, $respons->json('pagination.per_page'));
    }

    public function test_non_admin_tidak_bisa_memakai_filter_siswa(): void
    {
        [, $kelasB] = $this->duaKelasLengkap();
        $bendahara = $this->user('bendahara', $kelasB->id_kelas);

        // id_kelas palsu juga tidak boleh menimbulkan 422: parameter
        // memang tidak dipakai oleh Bendahara/Viewer.
        $respons = $this->actingAs($bendahara)
            ->getJson('/data/siswa?serverSide=1&id_kelas=999999999');

        $respons->assertOk();

        $ids = collect($respons->json('data'))
            ->pluck('id_kelas')
            ->unique()
            ->all();

        $this->assertSame([$kelasB->id_kelas], $ids);
        $this->assertNull($respons->json('id_kelas_filter'));
    }

    public function test_admin_dapat_memfilter_iuran_per_kelas(): void
    {
        [$kelasA, , , , $iuranA, $iuranB] = $this->duaKelasLengkap();

        $respons = $this->actingAs($this->user('admin'))
            ->getJson('/data/iuran?id_kelas=' . $kelasA->id_kelas);

        $respons->assertOk();

        $ids = collect($respons->json('data'))->pluck('id_iuran')->all();

        $this->assertContains($iuranA, $ids);
        $this->assertNotContains($iuranB, $ids);
        $this->assertSame($kelasA->id_kelas, $respons->json('id_kelas_filter'));
    }

    public function test_non_admin_tidak_bisa_memakai_filter_iuran(): void
    {
        [, $kelasB, , , $iuranA, $iuranB] = $this->duaKelasLengkap();

        $respons = $this->actingAs($this->user('bendahara', $kelasB->id_kelas))
            ->getJson('/data/iuran?id_kelas=999999999');

        $respons->assertOk();

        $ids = collect($respons->json('data'))->pluck('id_iuran')->all();

        $this->assertNotContains($iuranA, $ids);
        $this->assertContains($iuranB, $ids);
    }

    public function test_admin_dapat_memfilter_transaksi_per_kelas(): void
    {
        [$kelasA] = $this->duaKelasLengkap();

        $respons = $this->actingAs($this->user('admin'))
            ->getJson('/data/transaksi?id_kelas=' . $kelasA->id_kelas);

        $respons->assertOk();

        $ids = collect($respons->json('data'))
            ->pluck('id_kelas')
            ->unique()
            ->all();

        $this->assertSame([$kelasA->id_kelas], $ids);
        $this->assertSame($kelasA->id_kelas, $respons->json('filter.id_kelas'));
    }

    public function test_non_admin_tidak_bisa_memakai_filter_transaksi(): void
    {
        [, $kelasB] = $this->duaKelasLengkap();

        $respons = $this->actingAs($this->user('viewer', $kelasB->id_kelas))
            ->getJson('/data/transaksi?id_kelas=999999999');

        $respons->assertOk();

        $ids = collect($respons->json('data'))
            ->pluck('id_kelas')
            ->unique()
            ->all();

        $this->assertSame([$kelasB->id_kelas], $ids);
        $this->assertNull($respons->json('filter.id_kelas'));
    }

    public function test_filter_kelas_juga_berlaku_pada_laporan_dan_pengguna(): void
    {
        [$kelasA, $kelasB] = $this->duaKelasLengkap();

        $laporan = $this->actingAs($this->user('admin'))
            ->get('/laporan-kas/cetak?id_kelas=' . $kelasA->id_kelas);

        $laporan->assertOk();

        $html = (string) $laporan->getContent();

        $this->assertTrue(
            str_contains($html, $kelasA->nama_kelas),
            'Laporan cetak tidak menampilkan kelas yang dipilih Admin.'
        );
        $this->assertTrue(
            !str_contains($html, $kelasB->nama_kelas),
            'Laporan cetak masih menampilkan kelas lain.'
        );

        $userA = $this->user('viewer', $kelasA->id_kelas);
        $userA->save();
        $userB = $this->user('viewer', $kelasB->id_kelas);
        $userB->save();

        $pengguna = $this->actingAs($this->user('admin'))
            ->getJson('/admin/api/pengguna?id_kelas=' . $kelasA->id_kelas);

        $pengguna->assertOk();

        $ids = collect($pengguna->json('data'))->pluck('id_kelas')->unique()->all();

        $this->assertSame([$kelasA->id_kelas], $ids);
        $this->assertSame($kelasA->id_kelas, $pengguna->json('id_kelas_filter'));
    }

    public function test_filter_kelas_hanya_terpasang_di_halaman_admin(): void
    {
        $adminBerkas = [
            'admin-siswa.js',
            'admin-iuran.js',
            'admin-transaksi.js',
            'admin-riwayat-transaksi.js',
            'admin-laporan-kas.js',
            'admin-manajemen-pengguna.js',
        ];

        foreach ($adminBerkas as $berkas) {
            $isi = (string) file_get_contents(resource_path('js/' . $berkas));

            $this->assertTrue(
                str_contains($isi, 'admin-filter-kelas.js'),
                "{$berkas} harus memakai pembantu filter kelas Admin."
            );
        }

        $nonAdminBerkas = [
            'bendahara-siswa.js',
            'bendahara-iuran.js',
            'bendahara-transaksi.js',
            'bendahara-riwayat-transaksi.js',
            'bendahara-laporan-kas.js',
            'viewer-siswa.js',
            'viewer-iuran.js',
            'viewer-transaksi.js',
            'viewer-riwayat-transaksi.js',
            'viewer-laporan-kas.js',
        ];

        foreach ($nonAdminBerkas as $berkas) {
            $isi = (string) file_get_contents(resource_path('js/' . $berkas));

            $this->assertTrue(
                !str_contains($isi, 'admin-filter-kelas.js')
                    && !str_contains($isi, 'filterKelas'),
                "{$berkas} tidak boleh memiliki filter kelas."
            );
        }

        $this->assertTrue(
            str_contains(
                (string) file_get_contents(resource_path('views/admin-iuran.blade.php')),
                'filterKelasIuran'
            )
        );
        $this->assertTrue(
            str_contains(
                (string) file_get_contents(resource_path('views/admin-transaksi.blade.php')),
                'filterKelasTransaksi'
            )
        );
    }
}
