<?php

namespace Tests\Feature;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji ringkasan Laporan Kas cocok dengan database.
 *
 * Rumus: Saldo Sekarang = Total Pemasukan - Total Pengeluaran.
 * Nilai dihitung dari transaksi tersimpan, TIDAK menghitung transaksi
 * utama dan rinciannya dua kali.
 */
class LaporanKasRingkasanTest extends TestCase
{

    private function butuhMysql(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            $this->markTestSkipped('Perlu koneksi MySQL.');
        }
    }

    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    public function test_ringkasan_api_cocok_dengan_agregasi_database(): void
    {
        $this->butuhMysql();

        $masukDb = (float) Transaksi::where('jenis', 'pemasukan')->sum('nominal');
        $keluarDb = (float) Transaksi::where('jenis', 'pengeluaran')->sum('nominal');

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi')
            ->assertOk();

        $ringkasan = $respons->json('ringkasan');

        $this->assertSame(
            $masukDb,
            (float) $ringkasan['total_masuk'],
            'Total pemasukan harus sama dengan SUM(nominal) jenis pemasukan.'
        );

        $this->assertSame(
            $keluarDb,
            (float) $ringkasan['total_keluar'],
            'Total pengeluaran harus sama dengan SUM(nominal) jenis pengeluaran.'
        );

        $this->assertSame(
            round($masukDb - $keluarDb, 2),
            (float) $ringkasan['saldo_sekarang'],
            'Saldo akhir = pemasukan - pengeluaran.'
        );
    }

    public function test_jumlah_baris_api_sama_dengan_database(): void
    {
        $this->butuhMysql();

        $jumlahDb = Transaksi::count();

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi')
            ->assertOk();

        // API mengirim satu entri per baris transaksi (termasuk
        // anggota grup multi-iuran), sehingga jumlahnya sama dengan
        // jumlah baris di database. Frontend menggabungkan baris
        // ber-no_bukti sama menjadi satu transaksi utama saat tampil.
        $this->assertCount($jumlahDb, $respons->json('data'));
    }
}
