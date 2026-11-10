<?php

namespace Tests\Feature;

use App\Models\Siswa;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji endpoint /bendahara/api/* yang dipakai halaman bendahara.
 * Hanya dapat diakses admin & bendahara. Menggunakan
 * RefreshDatabase sehingga perubahan di-rollback otomatis.
 */
class BendaharaApiTest extends TestCase
{

    private function butuhMysql(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            $this->markTestSkipped(
                'Uji ini memerlukan koneksi MySQL (database bbcashvia).'
            );
        }
    }

    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    private function bendahara(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['bendahara'])->firstOrFail();
    }

    private function viewer(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['viewer'])->firstOrFail();
    }

    public function test_bendahara_dapat_membaca_transaksi(): void
    {
        $this->butuhMysql();

        $this->actingAs($this->bendahara())
            ->getJson('/bendahara/api/transaksi')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_bendahara_dapat_membuat_transaksi(): void
    {
        $this->butuhMysql();

        $jumlahAwal = Transaksi::count();

        $this->actingAs($this->bendahara())
            ->postJson('/bendahara/api/transaksi', [
                'jenis' => 'pemasukan',
                'metode' => 'CH',
                'tanggal' => '2026-10-18',
                'nominal' => 15000,
                'uang_diterima' => 15000,
                'kategori' => 'Kas',
                'keterangan' => 'Uji bendahara',
            ])
            ->assertCreated();

        $this->assertSame($jumlahAwal + 1, Transaksi::count());
    }

    public function test_bendahara_dapat_membuat_dan_menghapus_iuran(): void
    {
        $this->butuhMysql();

        $respons = $this->actingAs($this->bendahara())
            ->postJson('/bendahara/api/iuran', [
                'nama_iuran' => 'Iuran Uji Otomatis',
                'keterangan' => 'Dibuat oleh pengujian.',
                'jatuh_tempo' => '2026-11-01',
                'kategori' => 'bulanan',
                'nominal' => 20000,
                'status' => 'aktif',
            ])
            ->assertCreated();

        $id = $respons->json('data.id_iuran');

        $this->assertNotNull($id);

        $this->actingAs($this->bendahara())
            ->deleteJson("/bendahara/api/iuran/{$id}")
            ->assertOk();

        $this->assertDatabaseMissing('iuran', ['id_iuran' => $id]);
    }

    public function test_bendahara_dapat_membuat_dan_menghapus_siswa(): void
    {
        $this->butuhMysql();

        $respons = $this->actingAs($this->bendahara())
            ->postJson('/bendahara/api/siswa', [
                'nis' => '99999999',
                'nama' => 'Siswa Uji Otomatis',
                'id_kelas' => null,
                'status' => 'Aktif',
            ])
            ->assertCreated();

        $id = $respons->json('data.id_siswa');

        $this->assertNotNull($id);

        $this->actingAs($this->bendahara())
            ->deleteJson("/bendahara/api/siswa/{$id}")
            ->assertOk();

        $this->assertDatabaseMissing('siswa', ['id_siswa' => $id]);
    }

    public function test_viewer_tidak_dapat_mengakses_api_bendahara(): void
    {
        $this->butuhMysql();

        $this->actingAs($this->viewer())
            ->getJson('/bendahara/api/transaksi')
            ->assertForbidden();

        $this->actingAs($this->viewer())
            ->getJson('/bendahara/api/iuran')
            ->assertForbidden();

        $this->actingAs($this->viewer())
            ->getJson('/bendahara/api/siswa')
            ->assertForbidden();
    }

    public function test_tamu_diarahkan_ke_login(): void
    {
        $this->butuhMysql();

        $this->getJson('/bendahara/api/transaksi')
            ->assertUnauthorized();
    }
}
