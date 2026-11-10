<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Database\QueryException;
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
        $user = new User;
        $user->name = 'Uji '.$role;
        $user->email = $role.'_'.uniqid().'@example.test';
        $user->role = $role;
        $user->id_kelas = $idKelas;
        $user->password = 'x';

        return $user;
    }

    /**
     * Paksa koneksi default ke MySQL pada port yang tidak berjalan.
     * Ini mensimulasikan database mati tanpa membutuhkan server MySQL.
     *
     * @return array{default: string, host: string, port: string}
     */
    private function matikanDatabase(): array
    {
        $asli = [
            'default' => (string) config('database.default'),
            'host' => (string) config('database.connections.mysql.host'),
            'port' => (string) config('database.connections.mysql.port'),
        ];

        config([
            'database.default' => 'mysql',
            'database.connections.mysql.host' => '127.0.0.1',
            'database.connections.mysql.port' => '3309',
        ]);

        // Hanya purge koneksi MySQL. Jangan purge koneksi default
        // (SQLite :memory:) karena akan menghapus database uji yang
        // dipakai bersama oleh tes-tes berikutnya.
        DB::purge('mysql');

        return $asli;
    }

    /**
     * @param  array{default: string, host: string, port: string}  $asli
     */
    private function pulihkanDatabase(array $asli): void
    {
        config([
            'database.default' => $asli['default'],
            'database.connections.mysql.host' => $asli['host'],
            'database.connections.mysql.port' => $asli['port'],
        ]);

        DB::purge('mysql');
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
        $asli = $this->matikanDatabase();

        try {
            $res = $this->actingAs($admin)->getJson('/data/siswa');

            $res->assertStatus(503);
            $res->assertJson(['success' => false]);
            $this->assertStringContainsStringIgnoringCase(
                'basis data',
                (string) $res->json('message')
            );
        } finally {
            $this->pulihkanDatabase($asli);
        }
    }

    public function test_database_mati_menghasilkan_503_web(): void
    {
        $admin = $this->userWithRole('admin');
        $asli = $this->matikanDatabase();

        try {
            // Halaman admin siswa melakukan kueri basis data - dengan MySQL
            // mati, halaman ini harus menampilkan halaman 503 kustom.
            $res = $this->actingAs($admin)->get('/admin/siswa');

            $res->assertStatus(503);
            $res->assertSee('Layanan Tidak Tersedia');
            $res->assertSee('BBCashvia');
        } finally {
            $this->pulihkanDatabase($asli);
        }
    }

    /** Kegagalan koneksi basis data dicatat di berkas log khusus. */
    public function test_gagal_koneksi_tercatat_di_berkas_log(): void
    {
        $admin = $this->userWithRole('admin');
        $asli = $this->matikanDatabase();

        try {
            $this->actingAs($admin)->getJson('/data/siswa')->assertStatus(503);

            $berkas = storage_path('logs/app-error.log');

            $this->assertFileExists($berkas);

            $isi = (string) file_get_contents($berkas);
            $this->assertStringContainsString('Koneksi basis data gagal', $isi);
        } finally {
            $this->pulihkanDatabase($asli);
        }
    }

    public function test_login_saat_database_mati_menghasilkan_503_json(): void
    {
        $asli = $this->matikanDatabase();

        try {
            $res = $this->postJson('/login', [
                'email' => 'admin@example.test',
                'password' => 'KataSandi#1',
                'role' => 'admin',
            ]);

            $res->assertStatus(503);
            $res->assertJson(['success' => false]);
            $this->assertStringContainsStringIgnoringCase(
                'database',
                (string) $res->json('message')
            );
        } finally {
            $this->pulihkanDatabase($asli);
        }
    }

    public function test_login_saat_database_mati_menampilkan_pesan_di_halaman_login(): void
    {
        $asli = $this->matikanDatabase();

        try {
            $res = $this->post('/login', [
                'email' => 'admin@example.test',
                'password' => 'KataSandi#1',
                'role' => 'admin',
            ]);

            $res->assertRedirect(route('login'));
            $res->assertSessionHasErrors('email');

            $this->get('/login')
                ->assertOk()
                ->assertSee('Gagal terhubung ke server database. Silakan coba beberapa saat lagi.');
        } finally {
            $this->pulihkanDatabase($asli);
        }
    }

    public function test_halaman_error_dapat_dirender_tanpa_koneksi_database(): void
    {
        $asli = $this->matikanDatabase();

        try {
            foreach ([
                'errors.404' => 'Halaman Tidak Ditemukan',
                'errors.500' => 'Kesalahan Server Internal',
                'errors.503' => 'Layanan Tidak Tersedia',
            ] as $view => $judul) {
                $html = view($view)->render();

                $this->assertStringContainsString($judul, $html);
                $this->assertStringContainsString('BBCashvia', $html);
            }
        } finally {
            $this->pulihkanDatabase($asli);
        }
    }

    public function test_query_error_bukan_koneksi_tetap_menjadi_500(): void
    {
        Route::get('/uji-query-500', function (): void {
            throw new QueryException(
                'sqlite',
                'select * from tabel_tidak_ada',
                [],
                new \PDOException('SQLSTATE[HY000]: General error: 1 no such table: tabel_tidak_ada')
            );
        });

        $res = $this->get('/uji-query-500');

        $res->assertStatus(500);
        $res->assertSee('Kesalahan Server Internal');
    }
}
