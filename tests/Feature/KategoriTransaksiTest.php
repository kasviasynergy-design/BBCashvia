<?php

namespace Tests\Feature;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Memastikan kategori dari UI (huruf besar/kecil bebas)
 * tetap tersimpan sesuai enum database.
 */
class KategoriTransaksiTest extends TestCase
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

    public static function kategoriUiProvider(): array
    {
        return [
            ['Kas', 'kas', 'pemasukan'],
            ['Kebutuhan kelas', 'kebutuhan kelas', 'pengeluaran'],
            ['Perlengkapan kelas', 'perlengkapan kelas', 'pengeluaran'],
            ['Kegiatan kelas', 'kegiatan kelas', 'pengeluaran'],
            ['Pemasukan lainnya', 'pemasukan lainnya', 'pemasukan'],
            ['Pengeluaran lainnya', 'pengeluaran lainnya', 'pengeluaran'],
            ['Iuran', 'Iuran', 'pemasukan'],
        ];
    }

    #[DataProvider('kategoriUiProvider')]
    public function test_kategori_ui_disimpan_sesuai_enum(string $kirim, string $harus, string $jenis): void
    {
        $this->butuhMysql();

        $respons = $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', [
                'jenis' => $jenis,
                'metode' => 'CH',
                'tanggal' => '2026-10-18',
                'nominal' => 5000,
                'uang_diterima' => 5000,
                'kategori' => $kirim,
                'keterangan' => 'Uji kategori ' . $kirim,
            ]);

        $respons->assertCreated();

        $dibuat = Transaksi::where('keterangan', 'Uji kategori ' . $kirim)
            ->firstOrFail();

        $this->assertSame($harus, $dibuat->kategori);
    }

    public function test_kategori_tidak_dikenal_ditolak(): void
    {
        $this->butuhMysql();

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', [
                'jenis' => 'pemasukan',
                'metode' => 'CH',
                'tanggal' => '2026-10-18',
                'nominal' => 5000,
                'uang_diterima' => 5000,
                'kategori' => 'Entah apa',
                'keterangan' => 'Uji kategori salah',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['kategori']);
    }
}
