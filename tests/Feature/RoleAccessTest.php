<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{

    private function userWithRole(string $role): User
    {
        $user = new User();
        $user->name = 'Uji ' . $role;
        $user->email = $role . '@example.test';
        $user->role = $role;

        return $user;
    }

    public function test_tamu_diarahkan_dari_dashboard_admin(): void
    {
        $this->get('/dashboard/admin')->assertRedirect();
    }

    public function test_admin_dapat_membuka_dashboard_admin(): void
    {
        $this->actingAs($this->userWithRole('admin'))
            ->get('/dashboard/admin')
            ->assertOk();
    }

    public function test_viewer_dilarang_membuka_dashboard_admin(): void
    {
        $this->actingAs($this->userWithRole('viewer'))
            ->get('/dashboard/admin')
            ->assertForbidden();
    }

    public function test_admin_dilarang_membuka_dashboard_viewer(): void
    {
        $this->actingAs($this->userWithRole('admin'))
            ->get('/dashboard/viewer')
            ->assertForbidden();
    }

    public function test_bendahara_dapat_membuka_dashboard_bendahara(): void
    {
        $this->actingAs($this->userWithRole('bendahara'))
            ->get('/dashboard/bendahara')
            ->assertOk();
    }

    public function test_bendahara_dilarang_membuka_dashboard_admin(): void
    {
        $this->actingAs($this->userWithRole('bendahara'))
            ->get('/dashboard/admin')
            ->assertForbidden();
    }

    public function test_semua_halaman_bendahara_dapat_dibuka(): void
    {
        $bendahara = $this->userWithRole('bendahara');

        foreach ([
            '/dashboard/bendahara',
            '/bendahara/siswa',
            '/bendahara/iuran',
            '/bendahara/transaksi',
            '/bendahara/laporan-kas',
            '/bendahara/riwayat-transaksi',
        ] as $halaman) {
            $this->actingAs($bendahara)
                ->get($halaman)
                ->assertOk();
        }
    }

    public function test_semua_halaman_viewer_dapat_dibuka(): void
    {
        $viewer = $this->userWithRole('viewer');

        foreach ([
            '/dashboard/viewer',
            '/viewer/siswa',
            '/viewer/iuran',
            '/viewer/transaksi',
            '/viewer/riwayat-transaksi',
            '/viewer/laporan-kas',
        ] as $halaman) {
            $this->actingAs($viewer)
                ->get($halaman)
                ->assertOk();
        }
    }

    public function test_halaman_menampilkan_nama_pengguna_yang_login(): void
    {
        $namaAdmin = 'Nama Admin Uji';
        $namaBendahara = 'Nama Bendahara Uji';
        $namaViewer = 'Nama Viewer Uji';

        $admin = $this->userWithRole('admin');
        $admin->name = $namaAdmin;

        $bendahara = $this->userWithRole('bendahara');
        $bendahara->name = $namaBendahara;

        $viewer = $this->userWithRole('viewer');
        $viewer->name = $namaViewer;

        $this->actingAs($admin)
            ->get('/dashboard/admin')
            ->assertOk()
            ->assertSee($namaAdmin);

        $this->actingAs($bendahara)
            ->get('/dashboard/bendahara')
            ->assertOk()
            ->assertSee($namaBendahara);

        $this->actingAs($viewer)
            ->get('/dashboard/viewer')
            ->assertOk()
            ->assertSee($namaViewer);
    }

    public function test_halaman_bendahara_menampilkan_label_kelasnya(): void
    {
        $kelas = \App\Models\Kelas::create([
            'nama_kelas' => 'UJI PAGE',
            'tingkat' => 'XI',
        ]);

        $bendahara = $this->userWithRole('bendahara');
        $bendahara->id_kelas = $kelas->id_kelas;

        $this->actingAs($bendahara)
            ->get('/dashboard/bendahara')
            ->assertOk()
            ->assertSee('UJI PAGE');
    }

    public function test_halaman_tidak_lagi_memuat_identitas_dummy(): void
    {
        $dummy = ['Andi Ramadhan', 'Siti Nurhaliza', 'Azis N.', 'xi rpl 1'];

        foreach (['admin', 'bendahara', 'viewer'] as $role) {
            $this->actingAs($this->userWithRole($role))
                ->get('/dashboard/' . $role)
                ->assertOk()
                ->assertDontSee($dummy[0])
                ->assertDontSee($dummy[1])
                ->assertDontSee($dummy[2]);
        }
    }

    public function test_bendahara_dilarang_membuka_halaman_viewer(): void
    {
        $this->actingAs($this->userWithRole('bendahara'))
            ->get('/viewer/transaksi')
            ->assertForbidden();
    }

    public function test_viewer_dilarang_membuka_halaman_bendahara(): void
    {
        $this->actingAs($this->userWithRole('viewer'))
            ->get('/bendahara/transaksi')
            ->assertForbidden();
    }
}
