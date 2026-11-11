<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Memastikan kolom "Kelas" pada transaksi memakai nama kelas
 * (nama_kelas), bukan nama siswa.
 *
 * Latar belakang: modal detail Riwayat Transaksi sempat menampilkan
 * nama siswa pada baris "Kelas" karena pemetaan JavaScript memakai
 * `nama_siswa`. Uji ini mencegah kesalahan yang sama terulang.
 */
class KelasTransaksiTest extends TestCase
{
    private const FILE_JS = [
        'resources/js/admin-riwayat-transaksi.js',
        'resources/js/bendahara-riwayat-transaksi.js',
        'resources/js/admin-laporan-kas.js',
    ];

    public function test_mapping_kelas_transaksi_memakai_nama_kelas(): void
    {
        foreach (self::FILE_JS as $file) {
            $isi = file_get_contents(base_path($file));

            $this->assertNotFalse($isi, "File $file tidak terbaca.");
            $this->assertStringContainsString(
                'kelas: t.nama_kelas ?? ""',
                $isi,
                "$file harus memakai nama_kelas untuk kolom kelas."
            );
            $this->assertStringNotContainsString(
                'kelas: t.nama_siswa ?? ""',
                $isi,
                "$file tidak boleh memakai nama_siswa untuk kolom kelas."
            );
        }
    }

    public function test_mapping_kelas_admin_transaksi_tidak_fallback_ke_nama_siswa(): void
    {
        $isi = file_get_contents(base_path('resources/js/admin-transaksi.js'));

        $this->assertNotFalse($isi);
        $this->assertStringContainsString(
            'kelas: kelasDariId(t.id_kelas) || t.nama_kelas || ""',
            $isi
        );
        $this->assertStringNotContainsString(
            't.siswa?.nama_kelas ?? t.nama_siswa',
            $isi
        );
    }
}
