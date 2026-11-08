<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Uji pilihan kategori pada form transaksi tidak pernah kosong dan
 * mengikuti jenis transaksi (Pemasukan / Pengeluaran).
 *
 * Konteks bug: saat mengubah jenis transaksi lewat radio, daftar
 * kategori TIDAK ikut berubah karena listener hanya memanggil
 * penyesuaian label. Selain itu <select> kategori di halaman admin
 * kosong di markup, sehingga bila JS belum jalan pilihannya tidak
 * ada sama sekali.
 */
class KategoriFormTransaksiTest extends TestCase
{
    private function isiBlade(string $nama): string
    {
        $path = resource_path('views/' . $nama);

        $this->assertFileExists($path, "Blade {$nama} harus ada.");

        return file_get_contents($path);
    }

    private function isiJs(string $nama): string
    {
        $path = resource_path('js/' . $nama);

        $this->assertFileExists($path, "Berkas JS {$nama} harus ada.");

        return file_get_contents($path);
    }

    public function test_select_kategori_admin_punya_seluruh_kategori_di_server(): void
    {
        $isi = $this->isiBlade('admin-transaksi.blade.php');

        // <select id="inputKategori"> harus berisi optgroup/opsi
        // kategori lengkap di server agar tidak pernah kosong walau
        // JS belum sempat jalan.
        $this->assertMatchesRegularExpression(
            '/<select[^>]*id="inputKategori"[^>]*>[\s\S]{0,4000}<option/s',
            $isi,
            'Select #inputKategori di halaman admin harus punya opsi '
            . 'di server agar kategori tidak pernah kosong.'
        );

        // Seluruh 7 kategori harus tertulis di markup server.
        foreach ([
            '<option value="Iuran">Iuran</option>',
            '<option value="kas">Kas</option>',
            '<option value="pemasukan lainnya">Pemasukan Lainnya</option>',
            '<option value="kebutuhan kelas">Kebutuhan Kelas</option>',
            '<option value="perlengkapan kelas">Perlengkapan Kelas</option>',
            '<option value="kegiatan kelas">Kegiatan Kelas</option>',
            '<option value="pengeluaran lainnya">Pengeluaran Lainnya</option>',
        ] as $opsi) {
            $this->assertStringContainsString(
                $opsi,
                $isi,
                "Opsi {$opsi} harus tersedia pada select kategori admin."
            );
        }

        // Dipisah per jenis agar mudah dibaca.
        $this->assertStringContainsString('<optgroup label="Pemasukan">', $isi);
        $this->assertStringContainsString('<optgroup label="Pengeluaran">', $isi);
    }

    public function test_filter_kategori_admin_terisi_sejak_load(): void
    {
        $isi = $this->isiJs('admin-transaksi.js');

        // muatData() harus mengisi dropdown filter kategori lebih dulu,
        // bukan hanya saat filter jenis diubah / reset.
        $this->assertMatchesRegularExpression(
            '/const muatData[\s\S]{0,3000}isiPilihanKategori\(\)[\s\S]{0,200}terapkanFilter\(\)/',
            $isi,
            'muatData() admin harus memanggil isiPilihanKategori() '
            . 'sebelum terapkanFilter() agar pilihan kategori filter '
            . 'tersedia sejak halaman dibuka.'
        );
    }

    public function test_filter_bulan_admin_terisi_sejak_load(): void
    {
        $isi = $this->isiJs('admin-transaksi.js');

        // Fungsi pengisi opsi bulan harus ada.
        $this->assertStringContainsString(
            'const isiPilihanBulan',
            $isi,
            'admin-transaksi.js harus punya fungsi isiPilihanBulan().'
        );

        // Opsi bulan diambil dari data nyata (format YYYY-MM), dan
        // nilai "Semua Bulan" tetap tersedia.
        $this->assertStringContainsString(
            '<option value="semua">Semua Bulan</option>',
            $isi,
            'Dropdown bulan admin harus menyediakan opsi "Semua Bulan".'
        );

        // muatData() harus mengisi opsi bulan sebelum menerapkan filter,
        // bukan hanya saat Reset diklik.
        $this->assertMatchesRegularExpression(
            '/const muatData[\s\S]{0,3000}isiPilihanBulan\(\)[\s\S]{0,200}terapkanFilter\(\)/',
            $isi,
            'muatData() admin harus memanggil isiPilihanBulan() '
            . 'sebelum terapkanFilter() agar pilihan bulan tersedia '
            . 'sejak halaman dibuka.'
        );
    }

    public function test_filter_bulan_admin_diisi_ulang_saat_reset(): void
    {
        $isi = $this->isiJs('admin-transaksi.js');

        // resetFilter() harus mengisi ulang opsi bulan agar semua
        // data kembali tersedia.
        $this->assertMatchesRegularExpression(
            '/const resetFilter[\s\S]{0,600}isiPilihanBulan\(\)[\s\S]{0,200}terapkanFilter\(\)/',
            $isi,
            'resetFilter() admin harus memanggil isiPilihanBulan() '
            . 'lalu terapkanFilter().'
        );
    }

    public function test_admin_memakai_kategori_dari_api_sebagai_sumber_tunggal(): void
    {
        $isi = $this->isiJs('admin-transaksi.js');

        // Harus memakai endpoint kategori sebagai sumbernya.
        $this->assertStringContainsString(
            '/admin/api/transaksi/kategori',
            $isi,
            'admin-transaksi.js harus mengambil kategori dari '
            . 'endpoint /admin/api/transaksi/kategori.'
        );

        $this->assertStringContainsString(
            'const muatKategori',
            $isi,
            'admin-transaksi.js harus punya fungsi muatKategori().'
        );

        // Kategori harus dimuat sebelum data ditampilkan.
        $this->assertMatchesRegularExpression(
            '/muatKategori\(\)\.finally\(\s*muatData\s*\)/',
            $isi,
            'muatKategori() harus dijalankan sebelum muatData() agar '
            . 'form & filter memakai daftar kategori yang sama.'
        );

        // Tidak boleh lagi ada daftar kategori keras (hardcode) lama.
        $this->assertStringNotContainsString(
            'const KATEGORI = [',
            $isi,
            'Daftar kategori keras lama harus dihapus agar tidak ada '
            . 'dua sumber yang bisa tidak sinkron.'
        );
    }

    public function test_form_kategori_admin_menampilkan_seluruh_tujuh_pilihan(): void
    {
        $isi = $this->isiJs('admin-transaksi.js');

        // isiKategoriForm() harus membangun optgroup Pemasukan dan
        // Pengeluaran dari KATEGORI_MASUK & KATEGORI_KELUAR.
        $this->assertMatchesRegularExpression(
            '/const isiKategoriForm[\s\S]{0,900}optgroup label="Pemasukan"[\s\S]{0,200}optgroup label="Pengeluaran"/',
            $isi,
            'Form kategori admin harus menampilkan seluruh kategori '
            . '(7 pilihan) dalam dua kelompok, sama seperti filter.'
        );
    }

    public function test_form_kategori_admin_menyesuaikan_jenis_otomatis(): void
    {
        $isi = $this->isiJs('admin-transaksi.js');

        // Kategori pengeluaran harus memindahkan radio jenis ke
        // "keluar" agar server tidak menolak (422).
        $this->assertStringContainsString(
            'const sesuaikanJenisKeKategori',
            $isi,
            'admin-transaksi.js harus punya penyesuai jenis otomatis '
            . 'dari kategori yang dipilih.'
        );

        $this->assertMatchesRegularExpression(
            '/sesuaikanJenisKeKategori[\s\S]{0,600}jenisTransaksi[\s\S]{0,120}\]/',
            $isi,
            'sesuaikanJenisKeKategori harus memindahkan radio jenis.'
        );

        // Listener perubahan kategori harus terpasang.
        $this->assertMatchesRegularExpression(
            '/\$\(\s*"inputKategori"\s*\)\?\.addEventListener\(\s*"change",\s*sesuaikanJenisKeKategori\s*\)/',
            $isi,
            'Perubahan pilihan kategori harus memicu sesuaikanJenisKeKategori().'
        );
    }

    public function test_admin_mengisi_ulang_kategori_saat_jenis_berubah(): void
    {
        $isi = $this->isiJs('admin-transaksi.js');

        // Saat jenis diubah, kategori harus dipindah ke kategori
        // pertama yang sah untuk jenis itu.
        $this->assertMatchesRegularExpression(
            '/radioJenis[\s\S]{0,500}pilihKategoriPertamaSesuaiJenis\(\)[\s\S]{0,200}sesuaikanLabelJenis\(\)/',
            $isi,
            'Perubahan jenis transaksi di admin harus memindahkan '
            . 'kategori ke pilihan yang sah lalu menyesuaikan label.'
        );
    }

    public function test_bendahara_memakai_kategori_dari_api_dan_menampilkan_semua(): void
    {
        $isi = $this->isiJs('bendahara-transaksi.js');

        // Mengambil kategori dari endpoint sumber tunggal.
        $this->assertStringContainsString(
            'const muatKategori',
            $isi,
            'bendahara-transaksi.js harus punya muatKategori().'
        );

        $this->assertStringContainsString(
            '/bendahara/api/transaksi/kategori',
            $isi,
            'bendahara-transaksi.js harus mengambil kategori dari '
            . 'endpoint /bendahara/api/transaksi/kategori.'
        );

        // Form menampilkan seluruh kategori dipisah per jenis.
        $this->assertMatchesRegularExpression(
            '/const isiKategoriForm[\s\S]{0,1600}buatGrup\(\s*"Pemasukan"[\s\S]{0,200}buatGrup\(\s*"Pengeluaran"/',
            $isi,
            'Form kategori bendahara harus menampilkan seluruh kategori '
            . 'dalam dua kelompok, sama seperti filter.'
        );

        // Jenis menyesuaikan otomatis saat kategori dipilih.
        $this->assertStringContainsString(
            'const sesuaikanJenisKeKategori',
            $isi,
            'bendahara-transaksi.js harus punya penyesuai jenis otomatis.'
        );

        // Kategori dimuat sebelum data.
        $this->assertMatchesRegularExpression(
            '/muatKategori\(\)\.finally\(\s*muatData\s*\)/',
            $isi,
            'muatKategori() harus dijalankan sebelum muatData().'
        );
    }

    public function test_bendahara_mengisi_ulang_kategori_saat_jenis_berubah(): void
    {
        $isi = $this->isiJs('bendahara-transaksi.js');

        // Saat jenis diubah, kategori dipindah ke pilihan pertama
        // yang sah untuk jenis itu.
        $this->assertMatchesRegularExpression(
            '/jenisTransaksi[\s\S]{0,700}pilihKategoriPertamaSesuaiJenis\(\)[\s\S]{0,200}sesuaikanFormJenis\(\)/',
            $isi,
            'Perubahan jenis transaksi di bendahara harus memindahkan '
            . 'kategori ke pilihan yang sah lalu menyesuaikan form.'
        );
    }
}
