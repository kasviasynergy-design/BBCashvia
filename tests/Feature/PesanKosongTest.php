<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Uji akar masalah "pesan kosong selalu tampil padahal ada data".
 *
 * Penyebab: `.empty-state { display: flex }` di CSS halaman menimpa
 * `[hidden] { display: none }` bawaan browser, sehingga walau JS
 * sudah menyetel `hidden = true`, pesan tetap terlihat.
 *
 * Perbaikan: setiap CSS halaman WAJIB memuat guard `[hidden]`.
 * Uji ini menjaga agar regresi tidak kembali terjadi.
 */
class PesanKosongTest extends TestCase
{
    /**
     * Semua berkas CSS halaman yang dipakai lewat @vite.
     */
    private const CSS_HALAMAN = [
        'admin-dashboard.css',
        'admin-iuran.css',
        'admin-laporan-kas.css',
        'admin-manajemen-pengguna.css',
        'admin-riwayat-transaksi.css',
        'admin-siswa.css',
        'admin-transaksi.css',
        'bendahara-dashboard.css',
        'bendahara-iuran.css',
        'bendahara-laporan-kas.css',
        'bendahara-riwayat-transaksi.css',
        'bendahara-siswa.css',
        'bendahara-transaksi.css',
        'login.css',
        'change-password.css',
        'viewer-dashboard.css',
        'viewer-iuran.css',
        'viewer-laporan-kas.css',
        'viewer-riwayat-transaksi.css',
        'viewer-siswa.css',
        'viewer-transaksi.css',
    ];

    public function test_semua_css_halaman_memuat_guard_hidden(): void
    {
        foreach (self::CSS_HALAMAN as $berkas) {
            $path = resource_path('css/' . $berkas);

            $this->assertFileExists($path, "Berkas CSS {$berkas} harus ada.");

            $isi = file_get_contents($path);

            // Menerima guard global `[hidden] { display:none !important }`
            // maupun versi ter-scope (mis. `.content [hidden]`) selama
            // memakai `!important` sehingga benar-benar menyembunyikan.
            $this->assertMatchesRegularExpression(
                '/\[hidden\][^{]*\{\s*display:\s*none\s*!important;?\s*\}/',
                $isi,
                "CSS {$berkas} harus memuat aturan [hidden] "
                . 'dengan display:none !important agar pesan kosong/modal '
                . 'benar-benar tersembunyi saat atribut hidden diset.'
            );
        }
    }

    public function test_css_ber_empty_state_flex_selalu_memuat_guard(): void
    {
        foreach (self::CSS_HALAMAN as $berkas) {
            $isi = file_get_contents(resource_path('css/' . $berkas));

            // Hanya berkas yang menetapkan display:flex pada
            // .empty-state yang berisiko menimpa [hidden].
            if (!preg_match('/\.empty-state\s*\{[^}]*display:\s*flex/s', $isi)) {
                continue;
            }

            $this->assertMatchesRegularExpression(
                '/\[hidden\]\s*\{\s*display:\s*none\s*!important;?\s*\}/',
                $isi,
                "CSS {$berkas} memakai .empty-state { display:flex } "
                . 'sehingga WAJIB punya guard [hidden].'
            );
        }
    }

    public function test_elemen_pesan_kosong_default_tersembunyi(): void
    {
        $halaman = [
            'admin-siswa.blade.php' => 'emptyState',
            'admin-laporan-kas.blade.php' => 'emptyState',
            'admin-riwayat-transaksi.blade.php' => 'emptyState',
        ];

        foreach ($halaman as $blade => $id) {
            $isi = file_get_contents(resource_path('views/' . $blade));

            $this->assertMatchesRegularExpression(
                '/id="' . preg_quote($id, '/') . '"[^>]*\shidden/',
                $isi,
                "Blade {$blade} harus menandai #{$id} dengan atribut hidden "
                . 'sebagai keadaan awal (sebelum JS memutuskan).'
            );
        }
    }

    public function test_js_menentukan_pesan_kosong_dari_jumlah_baris(): void
    {
        // admin-siswa: hidden = baris.length !== 0
        $siswa = file_get_contents(resource_path('js/admin-siswa.js'));
        $this->assertStringContainsString(
            'empty.hidden = baris.length !== 0',
            $siswa,
            'admin-siswa.js harus menyembunyikan pesan kosong saat ada data.'
        );

        // admin-laporan-kas: kosong.hidden = true setelah render tabel
        $laporan = file_get_contents(resource_path('js/admin-laporan-kas.js'));
        $this->assertStringContainsString(
            'kosong.hidden = true',
            $laporan,
            'admin-laporan-kas.js harus menyembunyikan pesan kosong saat '
            . 'data tersedia.'
        );

        // admin-riwayat: hanya tampil saat baris.length === 0
        $riwayat = file_get_contents(resource_path('js/admin-riwayat-transaksi.js'));
        $this->assertStringContainsString(
            'if (baris.length === 0)',
            $riwayat,
            'admin-riwayat-transaksi.js harus memeriksa jumlah baris.'
        );
    }
}
