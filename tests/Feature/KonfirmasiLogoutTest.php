<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Uji fitur bersama: konfirmasi sebelum logout dan overlay memuat.
 *
 * Konteks permintaan:
 * - Pengguna takut salah pencet Logout langsung keluar tanpa
 *   konfirmasi. Jadi setiap aksi logout harus memunculkan dialog
 *   "Keluar dari akun?" lebih dulu.
 * - Saat data sedang dimuat, layar jangan kosong; harus ada
 *   indikator memuat (spinner / bar tipis di atas).
 *
 * Fitur ini dipasang sekali sebagai partial + aset bersama, lalu
 * dipakai ulang di SEMUA halaman yang punya tombol logout.
 */
class KonfirmasiLogoutTest extends TestCase
{
    private function isi(string $path): string
    {
        $full = resource_path($path);

        $this->assertFileExists($full, "Berkas {$path} harus ada.");

        return file_get_contents($full);
    }

    /** Partial konfirmasi logout + overlay memuat harus ada. */
    public function test_partial_konfirmasi_logout_ada_dan_lengkap(): void
    {
        $isi = $this->isi('views/partials/konfirmasi-logout.blade.php');

        // Dialog konfirmasi.
        $this->assertStringContainsString('id="konfirmasiLogout"', $isi);
        $this->assertStringContainsString('id="klBatal"', $isi);
        $this->assertStringContainsString('id="klKeluar"', $isi);
        $this->assertStringContainsString('Keluar dari akun?', $isi);

        // Overlay memuat.
        $this->assertStringContainsString('id="loadingOverlay"', $isi);
        $this->assertStringContainsString('id="loadingText"', $isi);
        $this->assertStringContainsString('id="topbarLoading"', $isi);
    }

    /** Aset CSS & JS bersama harus ada. */
    public function test_aset_konfirmasi_logout_ada(): void
    {
        $css = $this->isi('css/konfirmasi-logout.css');
        $js = $this->isi('js/konfirmasi-logout.js');

        // Gaya dialog + overlay + spinner.
        $this->assertStringContainsString('.kl-backdrop', $css);
        $this->assertStringContainsString('.kl-loading', $css);
        $this->assertStringContainsString('.kl-spinner', $css);

        // Logika: mencegah logout tanpa konfirmasi & helper memuat.
        $this->assertStringContainsString('konfirmasiLogout', $js);
        $this->assertStringContainsString('/logout', $js);
        $this->assertStringContainsString('KasviaMemuat', $js);
        $this->assertStringContainsString('loadingOverlay', $js);
    }

    /** JS harus mencegah aksi logout sebelum dikonfirmasi. */
    public function test_js_mencegah_logout_sebelum_dikonfirmasi(): void
    {
        $js = $this->isi('js/konfirmasi-logout.js');

        // Aksi default dicegah selama dialog belum dikonfirmasi.
        $this->assertStringContainsString('e.preventDefault()', $js);

        // Form logout dikirim hanya setelah penanda izin dipasang.
        $this->assertStringContainsString('klDiizinkan', $js);

        // Pencegatan pada fase capture + stopImmediatePropagation agar
        // penangan logout bawaan halaman (yang langsung redirect) tidak
        // sempat berjalan sebelum dialog dikonfirmasi.
        $this->assertStringContainsString('stopImmediatePropagation', $js);
        $this->assertMatchesRegularExpression(
            '/addEventListener\("click",[\s\S]{0,1200}\},\s*true\);/',
            $js,
            'Listener klik logout harus dipasang pada fase capture.'
        );
    }

    /** Semua halaman ber-logout harus memuat partial & asetnya. */
    public function test_semua_halaman_logout_memakai_partial_dan_aset(): void
    {
        $daftar = [
            'admin-dashboard.blade.php',
            'admin-iuran.blade.php',
            'admin-laporan-kas.blade.php',
            'admin-manajemen-pengguna.blade.php',
            'admin-riwayat-transaksi.blade.php',
            'admin-siswa.blade.php',
            'admin-transaksi.blade.php',
            'bendahara-dashboard.blade.php',
            'bendahara-iuran.blade.php',
            'bendahara-laporan-kas.blade.php',
            'bendahara-riwayat-transaksi.blade.php',
            'bendahara-siswa.blade.php',
            'bendahara-transaksi.blade.php',
            'viewer-dashboard.blade.php',
            'viewer-iuran.blade.php',
            'viewer-laporan-kas.blade.php',
            'viewer-riwayat-transaksi.blade.php',
            'viewer-siswa.blade.php',
            'viewer-transaksi.blade.php',
        ];

        foreach ($daftar as $nama) {
            $isi = $this->isi('views/' . $nama);

            $this->assertStringContainsString(
                "@include('partials.konfirmasi-logout')",
                $isi,
                "Halaman {$nama} harus menyertakan partial konfirmasi logout."
            );

            $this->assertStringContainsString(
                'resources/css/konfirmasi-logout.css',
                $isi,
                "Halaman {$nama} harus memuat CSS konfirmasi logout."
            );

            $this->assertStringContainsString(
                'resources/js/konfirmasi-logout.js',
                $isi,
                "Halaman {$nama} harus memuat JS konfirmasi logout."
            );
        }
    }

    /** Aset harus terdaftar di vite config agar ikut ter-build. */
    public function test_aset_terdaftar_di_vite_config(): void
    {
        $config = $this->isi('../vite.config.js');

        $this->assertStringContainsString(
            'resources/css/konfirmasi-logout.css',
            $config
        );
        $this->assertStringContainsString(
            'resources/js/konfirmasi-logout.js',
            $config
        );
    }
}
