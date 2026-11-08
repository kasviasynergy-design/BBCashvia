<?php

namespace Tests\Feature;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji Riwayat Kas: satu pembayaran multi-iuran untuk satu siswa
 * harus tetap tampil sebagai SATU transaksi utama, dengan seluruh
 * rinciannya tersedia pada detail transaksi.
 *
 * Mekanisme: baris-baris transaksi yang berasal dari satu
 * pembayaran disatukan oleh `no_bukti` yang sama. API mengirim
 * setiap baris beserta daftar `rincian` (baris ber-no_bukti sama),
 * sehingga frontend dapat menampilkan satu baris utama + rincian.
 */
class RiwayatKasGrupTest extends TestCase
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

    /**
     * Membuat satu pembayaran multi-iuran: beberapa baris transaksi
     * dengan `no_bukti` yang sama untuk satu siswa.
     *
     * @return array<int, Transaksi>
     */
    private function buatPembayaranMultiIuran(): array
    {
        $user = $this->admin();

        $noBukti = 'GRP-' . now()->format('ymdHis') . random_int(100, 999);

        $baris = [
            ['nama_iuran' => 'Iuran Bulanan', 'nominal' => 15000],
            ['nama_iuran' => 'Iuran Kegiatan', 'nominal' => 25000],
            ['nama_iuran' => 'Iuran Kebersihan', 'nominal' => 10000],
        ];

        $hasil = [];

        foreach ($baris as $i => $item) {
            $hasil[] = Transaksi::create([
                'no_bukti' => $noBukti,
                'id_user' => $user->id_users,
                'tanggal' => '2026-10-18 08:00:00',
                'nominal' => $item['nominal'],
                'uang_diterima' => $item['nominal'],
                'kembalian' => 0,
                'metode' => 'CH',
                'jenis' => 'pemasukan',
                'kategori' => 'Iuran',
                'keterangan' => 'Pembayaran ' . $item['nama_iuran'],
                'periode' => 'Oktober 2026',
            ]);
        }

        return $hasil;
    }

    public function test_pembayaran_multi_iuran_punya_no_bukti_sama(): void
    {
        $this->butuhMysql();

        $baris = $this->buatPembayaranMultiIuran();

        $bukti = collect($baris)->pluck('no_bukti')->unique();

        $this->assertCount(
            1,
            $bukti,
            'Satu pembayaran multi-iuran harus memakai satu no_bukti.'
        );
    }

    public function test_api_mengirim_rincian_grup_pada_index(): void
    {
        $this->butuhMysql();

        $this->buatPembayaranMultiIuran();

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi')
            ->assertOk()
            ->assertJsonPath('success', true);

        $data = collect($respons->json('data'));

        // Cari entri yang mewakili grup (punya >1 rincian).
        $grup = $data->firstWhere('jumlah_rincian', 3);

        $this->assertNotNull(
            $grup,
            'API harus menyertakan entri dengan 3 rincian grup.'
        );

        $this->assertCount(3, $grup['rincian']);

        $this->assertSame(
            50000.0,
            (float) $grup['nominal_grup'],
            'Nominal grup = jumlah seluruh rincian (15000+25000+10000).'
        );

        // Setiap rincian membawa keterangan & nominalnya. Ketika
        // baris tidak terhubung ke master iuran (id_iuran NULL),
        // nama diambil dari keterangan (frontend sudah menangani
        // fallback ini).
        $keterangan = collect($grup['rincian'])->pluck('keterangan');
        $this->assertContains('Pembayaran Iuran Bulanan', $keterangan);
        $this->assertContains('Pembayaran Iuran Kegiatan', $keterangan);

        $nominal = collect($grup['rincian'])
            ->pluck('nominal')
            ->map(fn ($n) => (float) $n)
            ->sort()
            ->values()
            ->all();

        $this->assertSame([10000.0, 15000.0, 25000.0], $nominal);
    }

    public function test_detail_transaksi_memuat_seluruh_rincian(): void
    {
        $this->butuhMysql();

        $baris = $this->buatPembayaranMultiIuran();

        $id = $baris[0]->id_transaksi;

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi/' . $id)
            ->assertOk();

        $this->assertSame(
            3,
            (int) $respons->json('data.jumlah_rincian'),
            'Detail harus memuat 3 rincian grup.'
        );

        $this->assertSame(
            50000.0,
            (float) $respons->json('data.nominal_grup'),
            'Total rincian pada detail harus 50000.'
        );

        $this->assertCount(3, $respons->json('data.rincian'));
    }

    public function test_transaksi_biasa_tetap_satu_rincian(): void
    {
        $this->butuhMysql();

        $user = $this->admin();

        $t = Transaksi::create([
            'no_bukti' => 'SINGLE-' . now()->format('ymdHis') . random_int(100, 999),
            'id_user' => $user->id_users,
            'tanggal' => '2026-10-18 09:00:00',
            'nominal' => 12000,
            'uang_diterima' => 12000,
            'kembalian' => 0,
            'metode' => 'CH',
            'jenis' => 'pemasukan',
            'kategori' => 'kas',
            'keterangan' => 'Transaksi tunggal',
        ]);

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi/' . $t->id_transaksi)
            ->assertOk();

        $this->assertSame(
            1,
            (int) $respons->json('data.jumlah_rincian'),
            'Transaksi biasa hanya punya satu rincian.'
        );

        $this->assertSame(
            12000.0,
            (float) $respons->json('data.nominal_grup')
        );
    }

    /**
     * Inti permintaan: mencatat banyak transaksi sekaligus dengan
     * tanggal sama harus menjadi SATU ID transaksi (satu no_bukti)
     * yang rinciannya tampil di detail.
     */
    public function test_simpan_banyak_transaksi_jadi_satu_id(): void
    {
        $this->butuhMysql();

        $respons = $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', [
                'transaksi' => [
                    [
                        'jenis' => 'pemasukan',
                        'kategori' => 'Iuran',
                        'keterangan' => 'Iuran A',
                        'tanggal' => '2026-10-19',
                        'nominal' => 10000,
                    ],
                    [
                        'jenis' => 'pemasukan',
                        'kategori' => 'Iuran',
                        'keterangan' => 'Iuran B',
                        'tanggal' => '2026-10-19',
                        'nominal' => 20000,
                    ],
                    [
                        'jenis' => 'pemasukan',
                        'kategori' => 'Iuran',
                        'keterangan' => 'Iuran C',
                        'tanggal' => '2026-10-19',
                        'nominal' => 30000,
                    ],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('jumlah', 3);

        $noBukti = $respons->json('no_bukti');
        $this->assertNotEmpty($noBukti);

        // Semua baris berbagi satu nomor bukti.
        $unik = collect($respons->json('data'))->pluck('no_bukti')->unique();
        $this->assertCount(1, $unik);
        $this->assertSame($noBukti, $unik->first());

        // Detail transaksi pertama harus memuat ketiga rincian.
        $idPertama = $respons->json('data.0.id_transaksi');

        $detail = $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi/' . $idPertama)
            ->assertOk();

        $this->assertSame(3, (int) $detail->json('data.jumlah_rincian'));
        $this->assertSame(60000.0, (float) $detail->json('data.nominal_grup'));
    }
}
