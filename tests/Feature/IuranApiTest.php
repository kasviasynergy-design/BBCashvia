<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji endpoint iuran (/admin/api/iuran) dan alur pencatatan
 * pembayaran iuran menjadi transaksi nyata.
 *
 * Menggunakan RefreshDatabase sehingga perubahan di-rollback.
 */
class IuranApiTest extends TestCase
{

    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    public function test_index_iuran_mengembalikan_ringkasan(): void
    {
        $this->actingAs($this->admin())
            ->getJson('/admin/api/iuran')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id_iuran',
                        'id_kelas',
                        'nama_iuran',
                        'nominal',
                        'status',
                        'jumlah_siswa',
                        'target',
                        'terkumpul',
                        'peserta',
                    ],
                ],
            ]);
    }

    public function test_peserta_menandai_siswa_yang_sudah_bayar(): void
    {
        $kelas = Kelas::create([
            'nama_kelas' => 'UJI IUR',
            'tingkat' => 'XI',
        ]);

        $siswa = Siswa::create([
            'nis' => 'UI' . substr(uniqid(), -9),
            'nama_siswa' => 'Siswa Iuran',
            'id_kelas' => $kelas->id_kelas,
            'nama_kelas' => 'XI RPL',
            'status' => 'Aktif',
        ]);

        $idIuran = DB::table('iuran')->insertGetId([
            'id_kelas' => $kelas->id_kelas,
            'nama_iuran' => 'Iuran Uji ' . uniqid(),
            'keterangan' => 'Uji',
            'jatuh_tempo' => '2026-10-31',
            'kategori' => 'bulanan',
            'nominal' => 10000,
            'status' => 'aktif',
        ]);

        $res = $this->actingAs($this->admin())
            ->getJson('/admin/api/iuran');

        $res->assertOk();

        $iuran = collect($res->json('data'))
            ->firstWhere('id_iuran', $idIuran);

        $this->assertNotNull($iuran);
        $this->assertSame(1, $iuran['jumlah_siswa']);
        $this->assertSame(10000.0, (float) $iuran['target']);
        $this->assertSame(0.0, (float) $iuran['terkumpul']);
        $this->assertFalse($iuran['peserta'][0]['lunas']);

        // Catat transaksi pembayaran untuk siswa tersebut.
        $this->actingAs($this->admin())->postJson('/admin/api/transaksi', [
            'jenis' => 'pemasukan',
            'kategori' => 'Iuran',
            'keterangan' => 'Pembayaran iuran uji',
            'tanggal' => '2026-10-15',
            'nominal' => 10000,
            'uang_diterima' => 10000,
            'metode' => 'CH',
            'id_siswa' => $siswa->id_siswa,
            'id_iuran' => $idIuran,
            'id_kelas' => $kelas->id_kelas,
            'nama_pembayar' => 'Siswa Iuran',
        ])->assertCreated();

        $res2 = $this->actingAs($this->admin())
            ->getJson('/admin/api/iuran');

        $iuran2 = collect($res2->json('data'))
            ->firstWhere('id_iuran', $idIuran);

        $this->assertSame(10000.0, (float) $iuran2['terkumpul']);
        $this->assertTrue($iuran2['peserta'][0]['lunas']);
    }

    public function test_iuran_selesai_ditolak_untuk_pembayaran_baru(): void
    {
        $kelas = Kelas::create([
            'nama_kelas' => 'UJI SELESAI',
            'tingkat' => 'XI',
        ]);

        $siswa = Siswa::create([
            'nis' => 'US' . substr(uniqid(), -9),
            'nama_siswa' => 'Siswa Iuran Selesai',
            'id_kelas' => $kelas->id_kelas,
            'nama_kelas' => 'XI RPL',
            'status' => 'Aktif',
        ]);

        $idIuran = DB::table('iuran')->insertGetId([
            'id_kelas' => $kelas->id_kelas,
            'nama_iuran' => 'Iuran Selesai ' . uniqid(),
            'keterangan' => 'Uji status selesai',
            'jatuh_tempo' => '2026-10-31',
            'kategori' => 'bulanan',
            'nominal' => 10000,
            'status' => 'selesai',
        ]);

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', [
                'jenis' => 'pemasukan',
                'kategori' => 'Iuran',
                'keterangan' => 'Pembayaran iuran selesai',
                'tanggal' => '2026-10-15',
                'nominal' => 10000,
                'uang_diterima' => 10000,
                'metode' => 'CH',
                'id_siswa' => $siswa->id_siswa,
                'id_iuran' => $idIuran,
                'id_kelas' => $kelas->id_kelas,
                'nama_pembayar' => 'Siswa Iuran Selesai',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('id_iuran');

        $this->assertDatabaseMissing('transaksi', [
            'id_iuran' => $idIuran,
            'id_siswa' => $siswa->id_siswa,
        ]);
    }

    public function test_cicilan_dibatasi_sisa_tagihan_dan_status_tidak_otomatis_selesai(): void
    {
        $kelas = Kelas::create([
            'nama_kelas' => 'UJI CICIL',
            'tingkat' => 'XI',
        ]);

        $siswa = Siswa::create([
            'nis' => 'UC' . substr(uniqid(), -9),
            'nama_siswa' => 'Siswa Cicilan',
            'id_kelas' => $kelas->id_kelas,
            'nama_kelas' => 'XI RPL',
            'status' => 'Aktif',
        ]);

        $idIuran = DB::table('iuran')->insertGetId([
            'id_kelas' => $kelas->id_kelas,
            'nama_iuran' => 'Iuran Cicilan ' . uniqid(),
            'keterangan' => 'Uji cicilan',
            'jatuh_tempo' => '2026-10-31',
            'kategori' => 'bulanan',
            'nominal' => 50000,
            'status' => 'aktif',
        ]);

        $payload = fn (int $nominal) => [
            'jenis' => 'pemasukan',
            'kategori' => 'Iuran',
            'keterangan' => 'Pembayaran cicilan',
            'tanggal' => '2026-10-15',
            'nominal' => $nominal,
            'uang_diterima' => $nominal,
            'metode' => 'CH',
            'id_siswa' => $siswa->id_siswa,
            'id_iuran' => $idIuran,
            'id_kelas' => $kelas->id_kelas,
            'nama_pembayar' => 'Siswa Cicilan',
        ];

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $payload(20000))
            ->assertCreated();

        // Melebihi sisa (50.000 - 20.000) harus ditolak.
        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $payload(40000))
            ->assertStatus(422)
            ->assertJsonValidationErrors('nominal');

        // Sisa tepat 30.000 boleh dilunasi.
        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $payload(30000))
            ->assertCreated();

        // Setelah lunas, pembayaran baru tetap ditolak.
        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $payload(1000))
            ->assertStatus(422);

        $this->assertSame(
            2,
            DB::table('transaksi')
                ->where('id_iuran', $idIuran)
                ->where('id_siswa', $siswa->id_siswa)
                ->count()
        );

        // Status iuran tetap dikelola admin, tidak otomatis Selesai.
        $this->assertSame(
            'aktif',
            DB::table('iuran')->where('id_iuran', $idIuran)->value('status')
        );
    }

    public function test_bendahara_hanya_melihat_iuran_kelasnya(): void
    {
        $bendahara = User::whereRaw('LOWER(role) = ?', ['bendahara'])
            ->firstOrFail();

        $res = $this->actingAs($bendahara)
            ->getJson('/bendahara/api/iuran');

        $res->assertOk();

        $idKelas = collect($res->json('data'))
            ->pluck('id_kelas')
            ->unique()
            ->filter()
            ->values()
            ->all();

        foreach ($idKelas as $id) {
            $this->assertSame((int) $bendahara->id_kelas, (int) $id);
        }
    }
}
