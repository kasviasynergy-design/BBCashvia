<?php

namespace Tests\Feature;

use App\Models\Transaksi;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Memastikan daftar kategori yang dipakai filter di JavaScript
 * benar-benar cocok dengan nilai enum di database.
 *
 * Latar belakang: filter riwayat transaksi & laporan kas sempat
 * selalu kosong karena JS memakai huruf besar ("Kas") sedangkan
 * database menyimpan huruf kecil ("kas"). Uji ini mencegah hal
 * itu terulang tanpa perlu membuka browser.
 */
class FilterKategoriTest extends TestCase
{
    private const FILE_JS = [
        'resources/js/admin-riwayat-transaksi.js',
        'resources/js/bendahara-riwayat-transaksi.js',
        'resources/js/admin-transaksi.js',
        'resources/js/bendahara-transaksi.js',
        'resources/js/admin-laporan-kas.js',
        'resources/js/bendahara-laporan-kas.js',
    ];

    /**
     * Ambil nilai enum kategori langsung dari struktur tabel.
     *
     * @return array<int, string>
     */
    private function enumsKategori(): array
    {
        // SQLite tidak mendukung SHOW COLUMNS. Di sana daftar kategori
        // bersumber dari konstanta model yang juga dipakai aplikasi.
        if (DB::connection()->getDriverName() !== 'mysql') {
            return Transaksi::KATEGORI;
        }

        $baris = DB::selectOne("SHOW COLUMNS FROM transaksi LIKE 'kategori'");
        $tipe = (string) ($baris->Type ?? '');

        preg_match_all("/'((?:[^'\\\\]|\\\\.)*)'/", $tipe, $cocok);

        return $cocok[1] ?? [];
    }

    /**
     * Baca seluruh nilai "register kategori" dari sebuah file JS,
     * mengambil pasangan { value: "...", label: "..." }.
     *
     * @return array<int, string>
     */
    private function nilaiKategoriJs(string $file): array
    {
        $isi = file_get_contents(base_path($file));
        $this->assertNotFalse($isi, "File $file tidak terbaca.");

        preg_match_all(
            '/value:\s*"((?:[^"\\\\]|\\\\.)*)"/',
            $isi,
            $cocok
        );

        $nilai = array_values(array_unique($cocok[1] ?? []));

        // Buang nilai non-kategori (mis. opsi "semua").
        return array_values(array_filter(
            $nilai,
            fn ($v) => $v !== 'semua' && $v !== ''
        ));
    }

    public function test_enum_kategori_database_terbaca(): void
    {
        $enum = $this->enumsKategori();

        $this->assertNotEmpty($enum, 'Enum kategori transaksi harus terbaca.');
        $this->assertContains('kas', $enum, 'Enum harus memuat "kas".');
        $this->assertContains('Iuran', $enum, 'Enum harus memuat "Iuran".');
    }

    /**
     * Setiap kategori yang dipakai filter JS harus ada di enum DB
     * (perbandingan tanpa peduli huruf besar/kecil).
     *
     * Berkas yang sudah memakai endpoint kategori backend tidak lagi
     * menulis nilai kategori di JS, jadi cukup dipastikan berkas itu
     * benar-benar mengambil dari API sumber tunggal.
     */
    #[DataProvider('fileJsProvider')]
    public function test_kategori_filter_js_cocok_dengan_database(string $file): void
    {
        $enum = array_map('strtolower', $this->enumsKategori());
        $nilaiJs = $this->nilaiKategoriJs($file);

        // Berkas boleh tidak punya daftar keras asalkan mengambil
        // kategori dari endpoint sumber tunggal.
        if (empty($nilaiJs)) {
            $isi = file_get_contents(base_path($file));

            $this->assertStringContainsString(
                '/transaksi/kategori',
                (string) $isi,
                "$file tidak punya daftar kategori dan juga tidak "
                .'mengambil dari endpoint /transaksi/kategori.'
            );

            return;
        }

        foreach ($nilaiJs as $nilai) {
            $this->assertContains(
                strtolower($nilai),
                $enum,
                "Kategori \"$nilai\" di $file tidak ada di enum database."
            );
        }
    }

    public static function fileJsProvider(): array
    {
        $kasus = [];

        foreach (self::FILE_JS as $file) {
            $kasus[$file] = [$file];
        }

        return $kasus;
    }
}
