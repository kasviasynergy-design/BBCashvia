<?php

namespace Tests\Feature;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji penyimpanan banyak transaksi sekaligus dalam satu no_bukti grup.
 *
 * Latar belakang: admin perlu mencatat beberapa transaksi berurutan
 * tanpa menimpa data lama.
 */
class TransaksiBanyakTest extends TestCase
{
    use DatabaseTransactions;

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

    public function test_banyak_transaksi_tersimpan_semua(): void
    {
        $this->butuhMysql();

        $sebelum = Transaksi::count();

        $respons = $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', [
                'transaksi' => [
                    [
                        'jenis' => 'pemasukan',
                        'kategori' => 'kas',
                        'keterangan' => 'Uji banyak 1',
                        'tanggal' => '2026-10-18',
                        'nominal' => 10000,
                        'uang_diterima' => 10000,
                        'metode' => 'CH',
                    ],
                    [
                        'jenis' => 'pemasukan',
                        'kategori' => 'Iuran',
                        'keterangan' => 'Uji banyak 2',
                        'tanggal' => '2026-10-18',
                        'nominal' => 20000,
                        'uang_diterima' => 20000,
                        'metode' => 'CH',
                    ],
                    [
                        'jenis' => 'pengeluaran',
                        'kategori' => 'kebutuhan kelas',
                        'keterangan' => 'Uji banyak 3',
                        'tanggal' => '2026-10-18',
                        'nominal' => 5000,
                        'uang_diterima' => 5000,
                        'metode' => 'CH',
                    ],
                ],
            ]);

        $respons->assertCreated()->assertJsonPath('jumlah', 3);

        // Data lama tetap ada, hanya bertambah 3 baris.
        $this->assertSame($sebelum + 3, Transaksi::count());

        $this->assertDatabaseHas('transaksi', [
            'keterangan' => 'Uji banyak 1',
            'jenis' => 'pemasukan',
            'kategori' => 'kas',
        ]);
        $this->assertDatabaseHas('transaksi', [
            'keterangan' => 'Uji banyak 3',
            'jenis' => 'pengeluaran',
            'kategori' => 'kebutuhan kelas',
        ]);

        // Seluruh baris dari SATU kali simpan memakai SATU nomor
        // bukti bersama, sehingga tampil sebagai satu transaksi
        // utama (satu ID) di Riwayat Kas.
        $bukti = collect($respons->json('data'))->pluck('no_bukti');
        $this->assertCount(
            1,
            $bukti->unique(),
            'Semua baris dalam satu kali simpan harus berbagi satu no_bukti.'
        );

        $this->assertSame(
            $respons->json('no_bukti'),
            $bukti->first(),
            'no_bukti grup pada respons harus sama dengan no_bukti baris.'
        );
    }

    public function test_banyak_transaksi_gagal_total_bila_satu_baris_salah(): void
    {
        $this->butuhMysql();

        $sebelum = Transaksi::count();

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', [
                'transaksi' => [
                    [
                        'jenis' => 'pemasukan',
                        'kategori' => 'kas',
                        'keterangan' => 'Uji rollback benar',
                        'tanggal' => '2026-10-18',
                        'nominal' => 10000,
                        'uang_diterima' => 10000,
                        'metode' => 'CH',
                    ],
                    [
                        'jenis' => 'pemasukan',
                        // Kategori pengeluaran dipadukan jenis pemasukan.
                        'kategori' => 'kebutuhan kelas',
                        'keterangan' => 'Uji rollback salah',
                        'tanggal' => '2026-10-18',
                        'nominal' => 10000,
                    ],
                ],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['transaksi.1.kategori']);

        // Tidak ada baris yang tersimpan (rollback).
        $this->assertSame($sebelum, Transaksi::count());
        $this->assertDatabaseMissing('transaksi', [
            'keterangan' => 'Uji rollback benar',
        ]);
    }

    public function test_banyak_transaksi_menolak_lebih_dari_50_baris(): void
    {
        $this->butuhMysql();

        $baris = [];
        for ($i = 0; $i < 51; $i++) {
            $baris[] = [
                'jenis' => 'pemasukan',
                'kategori' => 'kas',
                'keterangan' => 'Uji batas ' . $i,
                'tanggal' => '2026-10-18',
                'nominal' => 1000,
            ];
        }

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', ['transaksi' => $baris])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['transaksi']);
    }
}
