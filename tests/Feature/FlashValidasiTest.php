<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\MessageBag;
use Illuminate\Support\ViewErrorBag;
use Tests\TestCase;

/**
 * SKKNI-5 - Pesan flash dan validasi yang ramah.
 *
 * Memastikan halaman form menampilkan pesan penolakan duplikat dari
 * session dan ringkasan galat validasi server, termasuk saat modal
 * formulir belum dibuka.
 */
class FlashValidasiTest extends TestCase
{
    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    private function bendahara(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['bendahara'])->firstOrFail();
    }

    public function test_pesan_duplikat_tampil_di_form_admin(): void
    {
        $pesan = 'Data transaksi serupa sudah ada. Periksa kembali nominal dan tanggal.';

        foreach (['/admin/transaksi', '/admin/iuran', '/admin/siswa'] as $url) {
            $this->actingAs($this->admin())
                ->withSession(['error' => $pesan])
                ->get($url)
                ->assertOk()
                ->assertSee('Data tidak dapat disimpan.')
                ->assertSee($pesan);
        }
    }

    public function test_pesan_duplikat_tampil_di_form_bendahara(): void
    {
        $pesan = 'Iuran dengan nama, kelas, kategori, dan jatuh tempo yang sama sudah ada.';

        foreach (['/bendahara/transaksi', '/bendahara/iuran', '/bendahara/siswa'] as $url) {
            $this->actingAs($this->bendahara())
                ->withSession(['error' => $pesan])
                ->get($url)
                ->assertOk()
                ->assertSee('Data tidak dapat disimpan.')
                ->assertSee($pesan);
        }
    }

    public function test_ringkasan_dan_galat_field_validasi_tampil_di_form_iuran(): void
    {
        $galat = (new ViewErrorBag)->put('default', new MessageBag([
            'nama_iuran' => 'Nama iuran wajib diisi.',
            'kategori' => 'Kategori iuran wajib dipilih.',
        ]));

        $halaman = $this->actingAs($this->admin())
            ->withSession(['errors' => $galat])
            ->get('/admin/iuran');

        $halaman->assertOk()
            ->assertSee('Periksa kembali data yang diisi.')
            ->assertSee('Nama iuran wajib diisi.')
            ->assertSee('Kategori iuran wajib dipilih.')
            ->assertSee('name="nama_iuran"', false)
            ->assertSee('name="kategori"', false);
    }
}
