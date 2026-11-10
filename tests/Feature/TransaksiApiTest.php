<?php

namespace Tests\Feature;

use App\Models\Transaksi;
use App\Models\User;
use Tests\TestCase;

/**
 * Uji transaksi end-to-end pada koneksi MySQL asli.
 * Menggunakan RefreshDatabase sehingga seluruh perubahan
 * di-rollback otomatis (tidak mengubah data secara permanen).
 */
class TransaksiApiTest extends TestCase
{
    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    private function bendahara(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['bendahara'])->firstOrFail();
    }

    private function payloadValid(): array
    {
        return [
            'jenis' => 'pemasukan',
            'metode' => 'CH',
            'tanggal' => '2026-10-18',
            'nominal' => 50000,
            'uang_diterima' => 50000,
            'kategori' => 'Iuran',
            'keterangan' => 'Uji transaksi otomatis',
        ];
    }

    public function test_admin_dapat_membuat_transaksi(): void
    {
        $jumlahAwal = Transaksi::count();

        $respons = $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $this->payloadValid());

        $respons->assertCreated();

        $data = $respons->json('data');

        $this->assertNotEmpty($data['no_bukti']);
        $this->assertSame('pemasukan', $data['jenis']);
        $this->assertSame('CH', $data['metode']);
        $this->assertSame($jumlahAwal + 1, Transaksi::count());
    }

    public function test_metode_tidak_valid_ditolak(): void
    {
        $payload = $this->payloadValid();
        $payload['metode'] = 'Tunai';

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['metode']);
    }

    public function test_bendahara_tidak_dapat_membuat_transaksi_admin(): void
    {
        $this->actingAs($this->bendahara())
            ->postJson('/admin/api/transaksi', $this->payloadValid())
            ->assertForbidden();
    }
}
