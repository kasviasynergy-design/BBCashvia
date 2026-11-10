<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Tests\TestCase;

/**
 * Uji kunci akses kepemilikan data (anti-IDOR) pada siswa:
 *
 * Pengguna non-admin hanya boleh memutakhirkan dan menghapus
 * data siswa milik kelasnya sendiri. Siswa milik kelas lain
 * harus dianggap tidak ada (404), bukan diberi akses penuh.
 */
class SiswaIdorTest extends TestCase
{

    /** User uji dengan peran & kelas tertentu. */
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

    /**
     * Dua kelas beserta satu siswa di masing-masing kelas.
     */
    private function duaKelasSiswa(): array
    {
        $kelasA = Kelas::create(['nama_kelas' => 'UJI A', 'tingkat' => 'XI']);
        $kelasB = Kelas::create(['nama_kelas' => 'UJI B', 'tingkat' => 'XI']);

        $siswaA = Siswa::create([
            'nis' => 'UA' . substr(uniqid(), -9),
            'nama_siswa' => 'Siswa A',
            'id_kelas' => $kelasA->id_kelas,
            'status' => 'Aktif',
        ]);

        $siswaB = Siswa::create([
            'nis' => 'UB' . substr(uniqid(), -9),
            'nama_siswa' => 'Siswa B',
            'id_kelas' => $kelasB->id_kelas,
            'status' => 'Aktif',
        ]);

        return [$kelasA, $kelasB, $siswaA, $siswaB];
    }

    /** Bentuk isi yang valid untuk memutakhirkan siswa. */
    private function isiPut(Siswa $siswa, array $tambahan = []): array
    {
        return array_merge([
            'nis' => $siswa->nis,
            'nama' => $siswa->nama_siswa,
            'id_kelas' => $siswa->id_kelas,
        ], $tambahan);
    }

    public function test_bendahara_tidak_dapat_update_siswa_kelas_lain(): void
    {
        [$kelasA, , , $siswaB] = $this->duaKelasSiswa();

        $bendahara = $this->userWithRole('bendahara', $kelasA->id_kelas);

        $res = $this->actingAs($bendahara)
            ->putJson('/bendahara/api/siswa/' . $siswaB->id_siswa, $this->isiPut($siswaB, [
                'nama' => 'Siswa B Direbut',
            ]));

        $res->assertStatus(404);

        // Data milik kelas B tidak boleh berubah.
        $this->assertDatabaseHas('siswa', [
            'id_siswa' => $siswaB->id_siswa,
            'nama_siswa' => 'Siswa B',
        ]);
    }

    public function test_bendahara_tidak_dapat_hapus_siswa_kelas_lain(): void
    {
        [$kelasA, , , $siswaB] = $this->duaKelasSiswa();

        $bendahara = $this->userWithRole('bendahara', $kelasA->id_kelas);

        $res = $this->actingAs($bendahara)
            ->deleteJson('/bendahara/api/siswa/' . $siswaB->id_siswa);

        $res->assertStatus(404);

        $this->assertDatabaseHas('siswa', [
            'id_siswa' => $siswaB->id_siswa,
        ]);
    }

    public function test_bendahara_bisa_update_siswa_kelasnya(): void
    {
        [$kelasA, , $siswaA] = $this->duaKelasSiswa();

        $bendahara = $this->userWithRole('bendahara', $kelasA->id_kelas);

        $res = $this->actingAs($bendahara)
            ->putJson('/bendahara/api/siswa/' . $siswaA->id_siswa, $this->isiPut($siswaA, [
                'nama' => 'Siswa A Diperbarui',
            ]));

        $res->assertOk();

        $this->assertDatabaseHas('siswa', [
            'id_siswa' => $siswaA->id_siswa,
            'nama_siswa' => 'Siswa A Diperbarui',
        ]);
    }

    public function test_bendahara_tidak_dapat_pindahkan_siswa_ke_kelas_lain(): void
    {
        [$kelasA, $kelasB, $siswaA] = $this->duaKelasSiswa();

        $bendahara = $this->userWithRole('bendahara', $kelasA->id_kelas);

        // id_kelas kelas B dikirim dari klien sengaja untuk memancing.
        $res = $this->actingAs($bendahara)
            ->putJson('/bendahara/api/siswa/' . $siswaA->id_siswa, $this->isiPut($siswaA, [
                'id_kelas' => $kelasB->id_kelas,
            ]));

        $res->assertOk();
        $this->assertSame(
            $kelasA->id_kelas,
            (int) $siswaA->fresh()->id_kelas,
            'Non-admin tidak boleh memindahkan siswa ke kelas lain.'
        );
    }

    public function test_bendahara_tidak_dapat_buat_siswa_di_kelas_lain(): void
    {
        [$kelasA, $kelasB] = $this->duaKelasSiswa();

        $bendahara = $this->userWithRole('bendahara', $kelasA->id_kelas);

        $res = $this->actingAs($bendahara)
            ->postJson('/bendahara/api/siswa', [
                'nis' => 'UBK' . substr(uniqid(), -8),
                'nama' => 'Siswa Infiltrasi',
                'id_kelas' => $kelasB->id_kelas,
            ]);

        $res->assertCreated();

        // Siswa tetap tercatat di kelasnya sendiri, bukan kelas B.
        $this->assertSame(
            $kelasA->id_kelas,
            (int) Siswa::where('nama_siswa', 'Siswa Infiltrasi')->value('id_kelas')
        );
    }

    public function test_non_admin_tanpa_kelas_tidak_dapat_update_siswa(): void
    {
        [$kelasA, , , $siswaB] = $this->duaKelasSiswa();

        $bendahara = $this->userWithRole('bendahara', null);

        $res = $this->actingAs($bendahara)
            ->putJson('/bendahara/api/siswa/' . $siswaB->id_siswa, $this->isiPut($siswaB));

        $res->assertStatus(404);
    }

    public function test_viewer_ditolak_endpoint_bendahara(): void
    {
        [$kelasA, , $siswaA] = $this->duaKelasSiswa();

        $viewer = $this->userWithRole('viewer', $kelasA->id_kelas);

        $res = $this->actingAs($viewer)
            ->putJson('/bendahara/api/siswa/' . $siswaA->id_siswa, $this->isiPut($siswaA));

        $res->assertForbidden();
    }

    public function test_tamu_tidak_dapat_memutakhirkan_siswa(): void
    {
        [, , , $siswaB] = $this->duaKelasSiswa();

        $res = $this->putJson(
            '/bendahara/api/siswa/' . $siswaB->id_siswa,
            $this->isiPut($siswaB)
        );

        $res->assertUnauthorized();
    }

    public function test_admin_tetap_dapat_memutakhirkan_semua_siswa(): void
    {
        [$kelasA, $kelasB, $siswaA, $siswaB] = $this->duaKelasSiswa();

        $admin = $this->userWithRole('admin');

        $this->actingAs($admin)
            ->putJson('/admin/api/siswa/' . $siswaA->id_siswa, $this->isiPut($siswaA, [
                'nama' => 'Siswa A Versi Admin',
            ]))
            ->assertOk();

        $this->actingAs($admin)
            ->putJson('/admin/api/siswa/' . $siswaB->id_siswa, $this->isiPut($siswaB, [
                'nama' => 'Siswa B Versi Admin',
            ]))
            ->assertOk();

        $this->assertDatabaseHas('siswa', [
            'id_siswa' => $siswaA->id_siswa,
            'id_kelas' => $kelasA->id_kelas,
            'nama_siswa' => 'Siswa A Versi Admin',
        ]);

        $this->assertDatabaseHas('siswa', [
            'id_siswa' => $siswaB->id_siswa,
            'id_kelas' => $kelasB->id_kelas,
            'nama_siswa' => 'Siswa B Versi Admin',
        ]);
    }
}
