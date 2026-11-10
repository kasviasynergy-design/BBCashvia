<?php

namespace Tests\Feature;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji endpoint daftar kategori transaksi.
 *
 * Latar belakang: form "Tambah Transaksi" hanya menampilkan 3 kategori
 * (pemasukan), sedangkan dropdown filter menampilkan 7. Keduanya harus
 * bersumber dari SATU daftar yang sama dengan yang dipakai server,
 * yaitu model Transaksi::KATEGORI.
 */
class KategoriTransaksiApiTest extends TestCase
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

    public function test_endpoint_kategori_admin_mengembalikan_masuk_dan_keluar(): void
    {
        $this->butuhMysql();

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi/kategori');

        $respons->assertOk()
            ->assertJsonPath('success', true);

        $masuk = collect($respons->json('data.masuk'))->pluck('value')->all();
        $keluar = collect($respons->json('data.keluar'))->pluck('value')->all();
        $semua = collect($respons->json('data.semua'))->pluck('value')->all();

        // Daftar harus sama persis dengan sumber tunggal di model.
        $this->assertSame(Transaksi::KATEGORI_MASUK, $masuk);
        $this->assertSame(Transaksi::kategoriKeluar(), $keluar);

        // Gabungan masuk + keluar = seluruh kategori sah.
        $this->assertEqualsCanonicalizing(Transaksi::KATEGORI, $semua);

        // Jumlah 3 + 4 = 7 seperti yang tampil di filter.
        $this->assertCount(3, $masuk);
        $this->assertCount(4, $keluar);
        $this->assertCount(7, $semua);
    }

    public function test_endpoint_kategori_memberi_label_tampilan(): void
    {
        $this->butuhMysql();

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi/kategori');

        $semua = collect($respons->json('data.semua'))
            ->keyBy('value');

        $this->assertSame('Iuran', $semua['Iuran']['label']);
        $this->assertSame('Kas', $semua['kas']['label']);
        $this->assertSame('Pemasukan Lainnya', $semua['pemasukan lainnya']['label']);
        $this->assertSame('Kebutuhan Kelas', $semua['kebutuhan kelas']['label']);
        $this->assertSame('Pengeluaran Lainnya', $semua['pengeluaran lainnya']['label']);
    }

    public function test_bendahara_juga_bisa_ambil_kategori(): void
    {
        $this->butuhMysql();

        $bendahara = User::whereRaw('LOWER(role) = ?', ['bendahara'])->first();

        if (! $bendahara) {
            $this->markTestSkipped('Tidak ada user bendahara.');
        }

        $this->actingAs($bendahara)
            ->getJson('/bendahara/api/transaksi/kategori')
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_kategori_untuk_jenis_memakai_sumber_yang_sama(): void
    {
        // Aturan pengelompokan harus konsisten dengan validasi.
        $this->assertSame(Transaksi::KATEGORI_MASUK, Transaksi::kategoriUntukJenis('pemasukan'));
        $this->assertSame(Transaksi::kategoriKeluar(), Transaksi::kategoriUntukJenis('pengeluaran'));
        $this->assertSame(Transaksi::KATEGORI_MASUK, Transaksi::kategoriUntukJenis('masuk'));
        $this->assertSame(Transaksi::kategoriKeluar(), Transaksi::kategoriUntukJenis('keluar'));
        // Singkatan lama tetap diterima agar data/lama tidak rusak.
        $this->assertSame(Transaksi::KATEGORI_MASUK, Transaksi::kategoriUntukJenis('M'));
        $this->assertSame(Transaksi::kategoriKeluar(), Transaksi::kategoriUntukJenis('K'));
    }

    /**
     * Setiap kategori yang ditampilkan form (dari endpoint) harus
     * benar-benar bisa disimpan server saat jenisnya cocok. Ini bukti
     * bahwa 7 pilihan di form tidak ada yang ditolak.
     */
    public function test_semua_kategori_endpoint_bisa_disimpan(): void
    {
        $this->butuhMysql();

        $semua = [
            ['jenis' => 'pemasukan', 'kategori' => 'Iuran'],
            ['jenis' => 'pemasukan', 'kategori' => 'kas'],
            ['jenis' => 'pemasukan', 'kategori' => 'pemasukan lainnya'],
            ['jenis' => 'pengeluaran', 'kategori' => 'kebutuhan kelas'],
            ['jenis' => 'pengeluaran', 'kategori' => 'perlengkapan kelas'],
            ['jenis' => 'pengeluaran', 'kategori' => 'kegiatan kelas'],
            ['jenis' => 'pengeluaran', 'kategori' => 'pengeluaran lainnya'],
        ];

        foreach ($semua as $i => $baris) {
            $respons = $this->actingAs($this->admin())
                ->postJson('/admin/api/transaksi', [
                    'jenis' => $baris['jenis'],
                    'kategori' => $baris['kategori'],
                    'keterangan' => 'Uji kategori ' . $baris['kategori'],
                    'tanggal' => '2026-10-19',
                    'nominal' => 1000 + $i,
                    'uang_diterima' => 1000 + $i,
                    'metode' => 'CH',
                ]);

            $respons->assertCreated();
        }
    }

    /**
     * Kategori yang salah jenis harus ditolak (422). Inilah alasan
     * form memindahkan radio jenis otomatis saat kategori dipilih.
     */
    public function test_kategori_salah_jenis_ditolak(): void
    {
        $this->butuhMysql();

        // Kategori pengeluaran dikirim sebagai pemasukan.
        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', [
                'jenis' => 'pemasukan',
                'kategori' => 'kebutuhan kelas',
                'keterangan' => 'Salah jenis',
                'tanggal' => '2026-10-19',
                'nominal' => 5000,
                'uang_diterima' => 5000,
                'metode' => 'CH',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['kategori']);

        // Kategori pemasukan dikirim sebagai pengeluaran.
        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', [
                'jenis' => 'pengeluaran',
                'kategori' => 'Iuran',
                'keterangan' => 'Salah jenis 2',
                'tanggal' => '2026-10-19',
                'nominal' => 5000,
                'uang_diterima' => 5000,
                'metode' => 'CH',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['kategori']);
    }
}
