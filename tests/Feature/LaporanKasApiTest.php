<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

/**
 * Uji API yang dipakai halaman Laporan Kas.
 *
 * Halaman Laporan Kas mengambil data dari /admin/api/transaksi.
 * Test ini memastikan endpoint itu benar-benar mengembalikan data
 * (bukan kosong) dan bentuk datanya sesuai yang diharapkan JS.
 */
class LaporanKasApiTest extends TestCase
{
    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    public function test_laporan_kas_mengambil_data_transaksi_dari_api(): void
    {
        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi');

        $respons->assertOk()->assertJsonStructure([
            'success',
            'message',
            'data',
        ]);

        $data = $respons->json('data');

        $this->assertNotEmpty(
            $data,
            'Laporan Kas tidak boleh kosong: API transaksi harus mengembalikan data.'
        );

        // Field yang dipakai JS laporan kas.
        $pertama = $data[0];
        foreach (['jenis', 'kategori', 'nominal', 'uang_diterima', 'tanggal', 'no_bukti'] as $kolom) {
            $this->assertArrayHasKey(
                $kolom,
                $pertama,
                "Field {$kolom} harus ada di data transaksi."
            );
        }
    }

    public function test_kategori_transaksi_cocok_dengan_filter_laporan(): void
    {
        $data = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi')
            ->json('data');

        $enum = [
            'Iuran',
            'kas',
            'kebutuhan kelas',
            'perlengkapan kelas',
            'kegiatan kelas',
            'pemasukan lainnya',
            'pengeluaran lainnya',
        ];

        foreach ($data as $t) {
            $this->assertContains(
                $t['kategori'],
                $enum,
                "Kategori '{$t['kategori']}' tidak dikenal filter Laporan Kas."
            );
        }
    }
}
