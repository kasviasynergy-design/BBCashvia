<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use RuntimeException;
use Tests\TestCase;

/**
 * S3-02: Uji penanganan galat terpusat (global error handling).
 *
 * Memastikan setiap kategori galat menghasilkan status yang benar,
 * memakai halaman kustom untuk permintaan web, JSON untuk endpoint
 * API/data, dan tercatat di berkas log khusus (app-error.log).
 *
 * Tak memakai DatabaseTransactions: skenario uji di sini tidak
 * memerlukan data tersimpan (pola user sementara dari KelasScopeTest).
 */
class GlobalErrorHandlingTest extends TestCase
{
    /** User sementara tanpa menyimpan ke basis data. */
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

    public function test_404_web_menampilkan_halaman_kustom(): void
    {
        $res = $this->get('/alamat-tidak-wajar-dker');

        $res->assertStatus(404);
        $res->assertSee('Halaman Tidak Ditemukan');
        $res->assertSee('BBCashvia');
    }

    public function test_403_web_menampilkan_halaman_kustom(): void
    {
        $viewer = $this->userWithRole('viewer');

        $res = $this->actingAs($viewer)->get('/dashboard/admin');

        $res->assertStatus(403);
        $res->assertSee('Akses Ditolak');
    }

    public function test_403_api_mengembalikan_json(): void
    {
        $viewer = $this->userWithRole('viewer');

        $res = $this->actingAs($viewer)->getJson('/admin/api/pengguna');

        $res->assertStatus(403);
        $res->assertJson(['success' => false]);
        $this->assertNotEmpty($res->json('message'));
    }

    public function test_tamu_web_diarahkan_ke_login(): void
    {
        $res = $this->get('/dashboard/admin');

        $res->assertRedirect();
    }

    public function test_tamu_api_mengembalikan_json_401(): void
    {
        $res = $this->getJson('/data/siswa');

        $res->assertStatus(401);
        $res->assertJson(['success' => false]);
        $this->assertNotEmpty($res->json('message'));
    }

    public function test_galat_internal_web_menampilkan_halaman_500(): void
    {
        Route::get('/uji-galat-500', fn () => throw new RuntimeException('GALAT_UJI_500'));

        $res = $this->get('/uji-galat-500');

        $res->assertStatus(500);
        $res->assertSee('Kesalahan Server Internal');
    }

    public function test_galat_internal_api_mengembalikan_json_500(): void
    {
        Route::get('/uji-galat-500', fn () => throw new RuntimeException('GALAT_UJI_500'));

        $res = $this->getJson('/uji-galat-500');

        $res->assertStatus(500);
        $res->assertJson(['success' => false]);
        $this->assertNotEmpty($res->json('message'));
    }

    /** Aplikasi mencatat galat 500 ke berkas log khusus. */
    public function test_galat_internal_tercatat_di_berkas_log(): void
    {
        Route::get('/uji-galat-500', fn () => throw new RuntimeException('GALAT_UJI_500'));
        $this->get('/uji-galat-500')->assertStatus(500);

        $berkas = storage_path('logs/app-error.log');

        $this->assertFileExists($berkas);

        $isi = (string) file_get_contents($berkas);
        $this->assertStringContainsString('GALAT_UJI_500', $isi);
        $this->assertStringContainsString('Galat internal aplikasi', $isi);
    }

    public function test_database_mati_menghasilkan_503_json(): void
    {
        $admin = $this->userWithRole('admin');
        $portAsli = config('database.connections.mysql.port');

        // Inti gagali MySQL: arahkan ke port yang tidak berjalan.
        config(['database.connections.mysql.port' => '3309']);
        DB::purge();

        $res = $this->actingAs($admin)->getJson('/data/siswa');

        $res->assertStatus(503);
        $res->assertJson(['success' => false]);
        $this->assertStringContainsStringIgnoringCase(
            'basis data',
            (string) $res->json('message')
        );

        // Kembalikan konfigurasi agar uji berikutnya sehat.
        config(['database.connections.mysql.port' => $portAsli]);
        DB::purge();
    }

    public function test_database_mati_menghasilkan_503_web(): void
    {
        $admin = $this->userWithRole('admin');
        $portAsli = config('database.connections.mysql.port');

        // Halaman admin siswa melakukan kueri basis data - dengan MySQL
        // mati, halaman ini harus menampilkan halaman 503 kustom.
        config(['database.connections.mysql.port' => '3309']);
        DB::purge();

        $res = $this->actingAs($admin)->get('/admin/siswa');

        $res->assertStatus(503);
        $res->assertSee('Layanan Tidak Tersedia');

        config(['database.connections.mysql.port' => $portAsli]);
        DB::purge();
    }

    /** Kegagalan koneksi basis data dicatat di berkas log khusus. */
    public function test_gagal_koneksi_tercatat_di_berkas_log(): void
    {
        $admin = $this->userWithRole('admin');
        $portAsli = config('database.connections.mysql.port');

        config(['database.connections.mysql.port' => '3309']);
        DB::purge();

        $this->actingAs($admin)->getJson('/data/siswa')->assertStatus(503);

        $berkas = storage_path('logs/app-error.log');

        $this->assertFileExists($berkas);

        $isi = (string) file_get_contents($berkas);
        $this->assertStringContainsString('Koneksi basis data gagal', $isi);

        config(['database.connections.mysql.port' => $portAsli]);
        DB::purge();
    }
}
