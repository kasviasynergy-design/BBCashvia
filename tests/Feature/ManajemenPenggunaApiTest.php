<?php

namespace Tests\Feature;

use App\Models\Siswa;
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
     * tersimpan tetap berjenis "siswa" dan wajib tertaut ke satu siswa.
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

        $siswa = Siswa::whereNotIn(
            'id_siswa',
            User::whereNotNull('id_siswa')->pluck('id_siswa')
        )->firstOrFail();

        $email = 'bendaharasli' . uniqid() . '@example.test';

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Nama Yang Akan Diganti',
                'email' => $email,
                'peran' => 'bendahara',
                'id_siswa' => $siswa->id_siswa,
                'id_kelas' => 4,
                'password' => 'Rahasia#1',
            ])
            ->assertCreated()
            ->assertJsonPath('data.jenis_viewer', 'siswa')
            ->assertJsonPath('data.id_siswa', (int) $siswa->id_siswa)
            ->assertJsonPath('data.nama', $siswa->nama_siswa);

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => 'bendahara',
            'jenis_viewer' => 'siswa',
            'id_siswa' => $siswa->id_siswa,
            'name' => $siswa->nama_siswa,
            'id_kelas' => $siswa->id_kelas,
        ]);
    }

    /**
     * Bendahara / Viewer Siswa tanpa Data Siswa harus ditolak backend,
     * meskipun validasi frontend dilewati.
     */
    public function test_bendahara_tanpa_data_siswa_ditolak(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji6' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Bendahara Tanpa Siswa',
                'email' => 'tanpasiswa' . uniqid() . '@example.test',
                'peran' => 'bendahara',
                'password' => 'Rahasia#1',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['id_siswa']);
    }

    /**
     * Viewer Wali Kelas tidak perlu (dan tidak boleh memiliki) Data
     * Siswa; kelasnya tetap diambil dari pilihan id_kelas.
     */
    public function test_viewer_wali_kelas_tanpa_data_siswa(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji7' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $email = 'walikelas' . uniqid() . '@example.test';

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Wali Kelas Uji',
                'email' => $email,
                'peran' => 'viewer',
                'jenis_viewer' => 'wali_kelas',
                'id_kelas' => 4,
                'password' => 'Rahasia#1',
            ])
            ->assertCreated()
            ->assertJsonPath('data.id_siswa', null);

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => 'viewer',
            'jenis_viewer' => 'wali_kelas',
            'id_siswa' => null,
            'id_kelas' => 4,
        ]);
    }

    /**
     * Satu siswa hanya boleh memiliki satu akun aktif.
     */
    public function test_satu_siswa_tidak_boleh_punya_dua_akun(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();

        $siswa = Siswa::whereNotIn(
            'id_siswa',
            User::whereNotNull('id_siswa')->pluck('id_siswa')
        )->firstOrFail();

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => $siswa->nama_siswa,
                'email' => 'akunsatu' . uniqid() . '@example.test',
                'peran' => 'bendahara',
                'id_siswa' => $siswa->id_siswa,
                'password' => 'Rahasia#1',
            ])
            ->assertCreated();

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => $siswa->nama_siswa,
                'email' => 'akundua' . uniqid() . '@example.test',
                'peran' => 'viewer',
                'jenis_viewer' => 'siswa',
                'id_siswa' => $siswa->id_siswa,
                'password' => 'Rahasia#1',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['id_siswa']);
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
