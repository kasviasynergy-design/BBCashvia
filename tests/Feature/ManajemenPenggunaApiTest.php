<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ManajemenPenggunaApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_index_pengguna_menyertakan_kelas(): void
    {
        $admin = new User();
        $admin->name = 'Admin Uji';
        $admin->email = 'adminuji' . uniqid() . '@example.test';
        $admin->role = 'admin';

        $res = $this->actingAs($admin)->getJson('/admin/api/pengguna');

        $res->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'kelas',
            ]);

        $this->assertArrayHasKey('id_kelas', $res->json('data.0'));
        $this->assertArrayHasKey('kelas', $res->json('data.0'));
    }

    public function test_halaman_manajemen_pengguna_memuat_field_kelas(): void
    {
        $admin = new User();
        $admin->name = 'Admin Uji';
        $admin->email = 'adminuji2' . uniqid() . '@example.test';
        $admin->role = 'admin';

        $this->actingAs($admin)
            ->get('/admin/manajemen-pengguna')
            ->assertOk()
            ->assertSee('id="inputKelas"', false)
            ->assertSee('<th>Kelas</th>', false);
    }

    /**
     * Peran bendahara selalu siswa; kombinasi bendahara + wali_kelas
     * harus ditolak backend, bukan sekadar disembunyikan di UI.
     */
    public function test_bendahara_menolak_jenis_pengguna_wali_kelas(): void
    {
        $admin = new User();
        $admin->name = 'Admin Uji';
        $admin->email = 'adminuji3' . uniqid() . '@example.test';
        $admin->role = 'admin';

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Bendahara Uji',
                'email' => 'bendahara' . uniqid() . '@example.test',
                'peran' => 'bendahara',
                'jenis_viewer' => 'wali_kelas',
                'id_kelas' => 4,
                'password' => 'Rahasia#1',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['jenis_viewer']);
    }

    /**
     * Walau klien tidak mengirim jenis pengguna, bendahara yang
     * tersimpan tetap berjenis "siswa".
     */
    public function test_bendahara_tersimpan_sebagai_siswa(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji4' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $email = 'bendaharasli' . uniqid() . '@example.test';

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Bendahara Siswa',
                'email' => $email,
                'peran' => 'bendahara',
                'id_kelas' => 4,
                'password' => 'Rahasia#1',
            ])
            ->assertCreated()
            ->assertJsonPath('data.jenis_viewer', 'siswa');

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => 'bendahara',
            'jenis_viewer' => 'siswa',
        ]);
    }

    /**
     * Admin selalu tanpa jenis pengguna, apa pun yang dikirim klien.
     */
    public function test_admin_tanpa_jenis_pengguna(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji5' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $email = 'adminbaru' . uniqid() . '@example.test';

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Admin Baru',
                'email' => $email,
                'peran' => 'admin',
                'jenis_viewer' => 'wali_kelas',
                'id_kelas' => 4,
                'password' => 'Rahasia#1',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => 'admin',
            'jenis_viewer' => null,
            'id_kelas' => null,
        ]);
    }
}
