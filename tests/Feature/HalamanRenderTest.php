<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

/**
 * Uji bahwa semua halaman utama dapat dirender tanpa error
 * untuk tiap peran (admin, bendahara, viewer).
 */
class HalamanRenderTest extends TestCase
{

    private function user(string $role): User
    {
        return User::whereRaw('LOWER(role) = ?', [$role])->firstOrFail();
    }

    private const HALAMAN_ADMIN = [
        '/dashboard/admin', '/admin/siswa', '/admin/iuran', '/admin/transaksi',
        '/admin/riwayat-transaksi', '/admin/laporan-kas',
        '/admin/manajemen-pengguna',
    ];

    private const HALAMAN_BENDAHARA = [
        '/dashboard/bendahara', '/bendahara/siswa', '/bendahara/iuran',
        '/bendahara/transaksi', '/bendahara/riwayat-transaksi',
        '/bendahara/laporan-kas',
    ];

    private const HALAMAN_VIEWER = [
        '/dashboard/viewer', '/viewer/siswa', '/viewer/iuran',
        '/viewer/transaksi', '/viewer/riwayat-transaksi',
        '/viewer/laporan-kas',
    ];

    public function test_halaman_admin_dapat_dirender(): void
    {
        foreach (self::HALAMAN_ADMIN as $url) {
            $this->actingAs($this->user('admin'))
                ->get($url)
                ->assertOk();
        }
    }

    public function test_halaman_bendahara_dapat_dirender(): void
    {
        foreach (self::HALAMAN_BENDAHARA as $url) {
            $this->actingAs($this->user('bendahara'))
                ->get($url)
                ->assertOk();
        }
    }

    public function test_halaman_viewer_dapat_dirender(): void
    {
        foreach (self::HALAMAN_VIEWER as $url) {
            $this->actingAs($this->user('viewer'))
                ->get($url)
                ->assertOk();
        }
    }
}
