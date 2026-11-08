<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji halaman Laporan Kas benar-benar memuat data dari database.
 *
 * Konteks bug: skrip halaman memanggil tombol "Cetak"/"Ekspor"
 * yang sudah dihapus dari blade. Karena dipanggil tanpa pemeriksaan,
 * skrip berhenti sebelum sempat memuat data, sehingga Laporan Kas
 * tampak kosong. Test ini memastikan penyebabnya sudah diperbaiki.
 */
class LaporanKasHalamanTest extends TestCase
{
    use DatabaseTransactions;

    private function butuhMysql(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            $this->markTestSkipped('Perlu MySQL (bbcashvia).');
        }
    }

    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    public function test_halaman_laporan_kas_admin_terbuka(): void
    {
        $this->butuhMysql();

        $this->actingAs($this->admin())
            ->get('/admin/laporan-kas')
            ->assertOk()
            ->assertSee('isiTabelLaporan', false)
            ->assertSee('sumMasuk', false);
    }

    public function test_skrip_laporan_kas_tidak_memaksa_elemen_tombol(): void
    {
        $this->butuhMysql();

        $berkas = resource_path('js/admin-laporan-kas.js');
        $isi = file_get_contents($berkas);

        // Tombol cetak/ekspor sudah tidak ada di blade, jadi pemasangan
        // event-nya WAJIB memakai pemeriksaan (guard).
        $this->assertStringContainsString(
            'if (btnCetak)',
            $isi,
            'Pemasangan tombol cetak harus pakai pemeriksaan.'
        );
        $this->assertStringContainsString(
            'if (btnEkspor)',
            $isi,
            'Pemasangan tombol ekspor harus pakai pemeriksaan.'
        );

        $this->assertStringNotContainsString(
            '$("btnCetak").addEventListener',
            $isi,
            'Jangan pasang event ke elemen yang belum tentu ada.'
        );
    }
}
