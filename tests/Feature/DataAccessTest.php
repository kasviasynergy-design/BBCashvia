<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji endpoint data baca (/data/*) untuk role bendahara & viewer,
 * sekaligus memastikan API admin tetap tertutup bagi role lain.
 */
class DataAccessTest extends TestCase
{

    private function butuhMysql(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            $this->markTestSkipped('Uji ini memerlukan koneksi MySQL (database bbcashvia).');
        }
    }

    private function userRole(string $role): User
    {
        return User::whereRaw('LOWER(role) = ?', [$role])->firstOrFail();
    }

    public function test_viewer_dapat_membaca_data_siswa(): void
    {
        $this->butuhMysql();

        $this->actingAs($this->userRole('viewer'))
            ->getJson('/data/siswa')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_viewer_dapat_membaca_data_iuran(): void
    {
        $this->butuhMysql();

        $this->actingAs($this->userRole('viewer'))
            ->getJson('/data/iuran')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_viewer_dilarang_membuka_api_admin(): void
    {
        $this->butuhMysql();

        $this->actingAs($this->userRole('viewer'))
            ->getJson('/admin/api/siswa')
            ->assertForbidden();
    }

    public function test_bendahara_dapat_membaca_data_transaksi(): void
    {
        $this->butuhMysql();

        $this->actingAs($this->userRole('bendahara'))
            ->getJson('/data/transaksi')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }
}
