<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji ketahanan filter Laporan Kas.
 *
 * Konteks bug: filter yang nilainya kosong ("") atau tidak dikenali
 * membuat SELURUH data terbuang, sehingga halaman menampilkan
 * "Tidak ada transaksi yang cocok dengan filter periode" padahal
 * datanya ada. Sekarang nilai seperti itu diperlakukan sebagai
 * "tanpa filter".
 */
class FilterLaporanKasTest extends TestCase
{
    private function sumberJs(string $berkas): string
    {
        $path = resource_path('js/' . $berkas);

        $this->assertFileExists($path, "Berkas {$berkas} harus ada.");

        return file_get_contents($path);
    }

    public function test_admin_memakai_pembantu_tanpa_filter(): void
    {
        $isi = $this->sumberJs('admin-laporan-kas.js');

        $this->assertStringContainsString(
            'const tanpaFilter',
            $isi,
            'Filter admin harus punya pembantu tanpaFilter().'
        );

        $this->assertStringContainsString(
            'const nilaiFilter',
            $isi,
            'Filter admin harus membaca nilai select lewat nilaiFilter().'
        );

        // Nilai "semua" & "" harus dianggap sama-sama tanpa filter.
        $this->assertStringContainsString("teks === \"\"", $isi);
        $this->assertStringContainsString("teks === \"semua\"", $isi);
    }

    public function test_admin_tidak_membandingkan_langsung_ke_semua(): void
    {
        $isi = $this->sumberJs('admin-laporan-kas.js');

        // Pola lama yang rapuh: nilai kosong ikut menyaring data.
        $this->assertStringNotContainsString(
            'bulan !== "semua" &&',
            $isi,
            'Jangan pakai perbandingan "!== semua" langsung: nilai "" '
            . 'akan membuang semua data.'
        );
        $this->assertStringNotContainsString(
            'jenis !== "semua" &&',
            $isi,
            'Jangan pakai perbandingan "!== semua" langsung.'
        );
    }

    public function test_filter_admin_dipakai_untuk_semua_jenis_saringan(): void
    {
        $isi = $this->sumberJs('admin-laporan-kas.js');

        // Keempat filter pilihan harus memakai tanpaFilter().
        foreach (['bulan', 'tahun', 'jenis', 'kategori'] as $nama) {
            $this->assertStringContainsString(
                'tanpaFilter(' . $nama . ')',
                $isi,
                "Filter {$nama} harus memakai tanpaFilter()."
            );
        }
    }

    public function test_bendahara_dan_viewer_tidak_rapuh_pada_nilai_kosong(): void
    {
        // Bendahara memakai pemeriksaan truthy ("" otomatis diabaikan).
        $bendahara = $this->sumberJs('bendahara-laporan-kas.js');
        $this->assertStringContainsString('if (', $bendahara);
        $this->assertStringContainsString('bulan &&', $bendahara);

        // Viewer memakai fallback periode "all".
        $viewer = $this->sumberJs('viewer-laporan-kas.js');
        $this->assertStringContainsString('periodFilter?.value || "all"', $viewer);
    }
}
