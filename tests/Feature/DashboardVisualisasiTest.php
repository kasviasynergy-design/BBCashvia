<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

/**
 * SKKNI-5 - Visualisasi statistik dashboard.
 *
 * Memastikan dashboard admin memuat kartu statistik hasil agregat
 * (COUNT/SUM) dan wadah tabel rekap yang responsif.
 */
class DashboardVisualisasiTest extends TestCase
{
    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    public function test_dashboard_admin_menampilkan_kartu_agregat_dan_tabel_rekap(): void
    {
        $halaman = $this->actingAs($this->admin())
            ->get('/dashboard/admin');

        $halaman->assertOk()
            ->assertSee('Transaksi Terkelompok')
            ->assertSee('Total Nominal Rekap')
            ->assertSee('Kelas Terdata')
            ->assertSee('id="rekapTotalTransaksi"', false)
            ->assertSee('id="rekapTotalNominal"', false)
            ->assertSee('id="rekapJumlahKelas"', false)
            ->assertSee('id="rekapKategoriBody"', false)
            ->assertSee('id="rekapKelasBody"', false)
            ->assertSee('id="rekapStatusBody"', false);
    }

    public function test_js_dashboard_mengisi_kartu_dari_hasil_rekap(): void
    {
        $js = file_get_contents(resource_path('js/admin-dashboard.js'));

        $this->assertStringContainsString('renderRekapKpi', $js);
        $this->assertStringContainsString(
            'totalDari(rekap.kategori, "total_data")',
            $js
        );
        $this->assertStringContainsString(
            'totalDari(rekap.kategori, "total_nominal")',
            $js
        );
        $this->assertStringContainsString('rekapJumlahKelas', $js);
    }
}
