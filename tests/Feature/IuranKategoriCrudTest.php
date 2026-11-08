<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * S3-04: Regensi cacat halaman Iuran (Admin & Bendahara).
 *
 * Cacat yang dijaga:
 *  1. Kategori yang dipilih saat menambah iuran TIDAK MUNCUL pada
 *     daftar (kolom selalu kosong) - akar: pemetaan JS salah kunci.
 *  2. Hapus iuran gagal (419 CSRF) pada halaman admin.
 *  3. Iuran yang dipakai transaksi wajib terlindungi (409) dan
 *     transaksi tidak boleh ikut terhapus.
 */
class IuranKategoriCrudTest extends TestCase
{
    use DatabaseTransactions;

    private function buatUser(
        string $role,
        ?int $idKelas = null
    ): User {
        return User::create([
            'name' => 'Penguji Iuran ' . $role,
            'email' => $role . '_iuran_' . uniqid() . '@example.test',
            'role' => $role,
            'id_kelas' => $idKelas,
            'password' => Hash::make('KataSandi#1'),
            'must_change_password' => false,
        ]);
    }

    private function buatKelas(string $nama = 'UJI IURAN'): Kelas
    {
        return Kelas::create([
            'nama_kelas' => $nama,
            'tingkat' => 'XI',
        ]);
    }

    private function isiIuran(int $idKelas, array $tambahan = []): array
    {
        return array_merge([
            'nama_iuran' => 'UJI Kas Mingguan',
            'kategori' => 'mingguan',
            'nominal' => 5000,
            'status' => 'aktif',
            'jatuh_tempo' => '2026-10-25',
            'keterangan' => 'Uji regensi kategori iuran.',
            'id_kelas' => $idKelas,
        ], $tambahan);
    }

    /** 1) Kategori "mingguan" tersimpan & MUNCUL pada daftar. */
    public function test_kategori_mingguan_tersimpan_dan_tampil_di_daftar(): void
    {
        $admin = $this->buatUser('admin');
        $kelas = $this->buatKelas('UJI IURAN TG');

        $simpan = $this->actingAs($admin)
            ->postJson('/admin/api/iuran', $this->isiIuran($kelas->id_kelas));

        $simpan->assertCreated();
        $simpan->assertJsonPath('data.kategori', 'mingguan');

        // Muat ulang daftar: kategori harus tetap tampil sesuai DB.
        $daftar = $this->actingAs($admin)->getJson('/admin/api/iuran');

        $daftar->assertOk();

        $baris = collect($daftar->json('data'))
            ->firstWhere('nama_iuran', 'UJI Kas Mingguan');

        $this->assertNotNull($baris, 'Iuran baru harus tampil di daftar.');
        $this->assertSame('mingguan', $baris['kategori']);
        $this->assertDatabaseHas('iuran', [
            'nama_iuran' => 'UJI Kas Mingguan',
            'kategori' => 'mingguan',
        ]);
    }

    /** 2) Kategori lain (tahunan) muncul; edit kategori tersimpan. */
    public function test_edit_kategori_iuran_tersimpan(): void
    {
        $admin = $this->buatUser('admin');
        $kelas = $this->buatKelas('UJI IURAN ED');

        $simpan = $this->actingAs($admin)
            ->postJson('/admin/api/iuran', $this->isiIuran($kelas->id_kelas, [
                'kategori' => 'bulanan',
                'nominal' => 20000,
                'nama_iuran' => 'UJI Iuran Bulanan',
            ]));

        $simpan->assertCreated();
        $id = (int) $simpan->json('data.id_iuran');

        $ubah = $this->actingAs($admin)
            ->putJson('/admin/api/iuran/' . $id, $this->isiIuran($kelas->id_kelas, [
                'kategori' => 'tahunan',
                'nominal' => 100000,
                'nama_iuran' => 'UJI Iuran Bulanan',
            ]));

        $ubah->assertOk();
        $ubah->assertJsonPath('data.kategori', 'tahunan');

        $this->assertDatabaseHas('iuran', [
            'id_iuran' => $id,
            'kategori' => 'tahunan',
            'nominal' => 100000,
        ]);
    }

    /** 3) Kategori di luar daftar penting ditolak (tanpa nilai default). */
    public function test_kategori_tidak_sah_ditolak(): void
    {
        $admin = $this->buatUser('admin');
        $kelas = $this->buatKelas('UJI IURAN NS');

        $res = $this->actingAs($admin)
            ->postJson('/admin/api/iuran', $this->isiIuran($kelas->id_kelas, [
                'kategori' => 'harian',
            ]));

        $res->assertStatus(422);
        $this->assertNotEmpty($res->json('errors.kategori.0'));
    }

    /** 4) Hapus iuran yang belum dipakai transaksi: berhasil. */
    public function test_hapus_iuran_tanpa_relasi_transaksi_berhasil(): void
    {
        $admin = $this->buatUser('admin');
        $kelas = $this->buatKelas('UJI IURAN HP');

        $simpan = $this->actingAs($admin)
            ->postJson('/admin/api/iuran', $this->isiIuran($kelas->id_kelas));

        $simpan->assertCreated();
        $id = (int) $simpan->json('data.id_iuran');

        $hapus = $this->actingAs($admin)
            ->deleteJson('/admin/api/iuran/' . $id);

        $hapus->assertOk();
        $this->assertDatabaseMissing('iuran', ['id_iuran' => $id]);
    }

    /** 5) Iuran yang sudah dipakai transaksi: 409, data tetap utuh. */
    public function test_hapus_iuran_yang_dipakai_transaksi_ditolak(): void
    {
        $admin = $this->buatUser('admin');
        $kelas = $this->buatKelas('UJI IURAN RS');

        $simpan = $this->actingAs($admin)
            ->postJson('/admin/api/iuran', $this->isiIuran($kelas->id_kelas));

        $simpan->assertCreated();
        $id = (int) $simpan->json('data.id_iuran');

        // Transaksi nyata yang merujuk iuran (riwayat pembayaran).
        DB::table('transaksi')->insert([
            'no_bukti' => 'TRX-UJI-' . uniqid(),
            'id_user' => $admin->id_users,
            'tanggal' => now(),
            'nominal' => 5000,
            'nama_pembayar' => 'Uji Regensi',
            'metode' => 'CH',
            'jenis' => 'pemasukan',
            'kategori' => 'Iuran',
            'periode' => now()->format('Y-m'),
            'created_at' => now(),
            'uang_diterima' => 5000,
            'kembalian' => 0,
            'id_iuran' => $id,
            'id_kelas' => $kelas->id_kelas,
        ]);

        $hapus = $this->actingAs($admin)
            ->deleteJson('/admin/api/iuran/' . $id);

        $hapus->assertStatus(409);
        $this->assertStringContainsString(
            'sudah digunakan',
            (string) $hapus->json('message')
        );

        // Iuran & riwayat transaksi TIDAK boleh ikut terhapus.
        $this->assertDatabaseHas('iuran', ['id_iuran' => $id]);
        $this->assertDatabaseHas('transaksi', ['id_iuran' => $id]);
    }

    /** 6) Bendahara hanya dapat menghapus iuran kelasnya (anti-IDOR). */
    public function test_bendahara_tidak_bisa_hapus_iuran_kelas_lain(): void
    {
        $kelasA = $this->buatKelas('UJI IURAN SA');
        $kelasB = $this->buatKelas('UJI IURAN SB');
        $bendahara = $this->buatUser('bendahara', $kelasA->id_kelas);

        $simpan = $this->actingAs($this->buatUser('admin'))
            ->postJson('/admin/api/iuran', $this->isiIuran($kelasB->id_kelas, [
                'nama_iuran' => 'UJI Iuran Kelas B',
            ]));

        $simpan->assertCreated();
        $id = (int) $simpan->json('data.id_iuran');

        $hapus = $this->actingAs($bendahara)
            ->deleteJson('/bendahara/api/iuran/' . $id);

        $hapus->assertStatus(404);
        $this->assertDatabaseHas('iuran', ['id_iuran' => $id]);
    }
}
