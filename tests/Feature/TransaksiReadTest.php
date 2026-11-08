<?php

namespace Tests\Feature;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class TransaksiReadTest extends TestCase
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

    public function test_index_transaksi_mengembalikan_data(): void
    {
        $this->butuhMysql();

        // Buat satu transaksi lalu baca lewat endpoint.
        Transaksi::create([
            'no_bukti' => 'TRX-UJI-READ-1',
            'id_user' => $this->admin()->id_users,
            'jenis' => 'pemasukan',
            'metode' => 'CH',
            'tanggal' => '2026-10-18',
            'nominal' => 25000,
            'uang_diterima' => 25000,
            'kembalian' => 0,
            'kategori' => 'Iuran',
            'keterangan' => 'Uji baca transaksi',
        ]);

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi');

        $respons->assertOk();

        $data = $respons->json('data');

        $this->assertIsArray($data);
        $this->assertNotEmpty($data);

        $baris = collect($data)->firstWhere('no_bukti', 'TRX-UJI-READ-1');

        $this->assertNotNull($baris, 'Baris uji tidak ditemukan dalam respons.');
        $this->assertArrayHasKey('id_transaksi', $baris);
        $this->assertArrayHasKey('tanggal', $baris);
        $this->assertArrayHasKey('nominal', $baris);
    }
}
