<?php

namespace Tests\Feature;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji CRUD lengkap transaksi (tambah, lihat, ubah, hapus) melalui
 * endpoint yang dipakai halaman admin & bendahara.
 *
 * Latar belakang: tombol aksi di tabel transaksi sempat tidak
 * berfungsi karena data-id dari DOM (string) dibandingkan dengan
 * id dari API (angka). Uji ini memastikan seluruh aksi benar-benar
 * memengaruhi database.
 */
class TransaksiCrudTest extends TestCase
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

    private function bendahara(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['bendahara'])->firstOrFail();
    }

    /**
     * Buat transaksi melalui API dan kembalikan id-nya.
     */
    private function buatTransaksi(User $user, string $prefix, string $prefixUrl = '/admin/api/transaksi'): int
    {
        $res = $this->actingAs($user)->postJson($prefixUrl, [
            'jenis' => 'pemasukan',
            'kategori' => 'kas',
            'keterangan' => 'Uji CRUD ' . $prefix,
            'tanggal' => '2026-10-19',
            'nominal' => 10000,
            'uang_diterima' => 10000,
            'metode' => 'CH',
        ]);

        $res->assertCreated();

        return (int) $res->json('data.id_transaksi');
    }

    public function test_tambah_transaksi_masuk_ke_database(): void
    {
        $this->butuhMysql();

        $id = $this->buatTransaksi($this->admin(), 'tambah');

        $this->assertDatabaseHas('transaksi', [
            'id_transaksi' => $id,
            'keterangan' => 'Uji CRUD tambah',
            'jenis' => 'pemasukan',
        ]);
    }

    public function test_tambah_transaksi_mencatat_pengguna_yang_login(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();

        $res = $this->actingAs($admin)->postJson('/admin/api/transaksi', [
            'jenis' => 'pemasukan',
            'kategori' => 'kas',
            'keterangan' => 'Uji pencatat transaksi',
            'tanggal' => '2026-10-19',
            'nominal' => 10000,
            'uang_diterima' => 10000,
            'metode' => 'CH',
            // Identitas dari klien tidak boleh dipercaya.
            'pic' => 'Palsu',
            'id_user' => 999999,
        ]);

        $res->assertCreated();

        $id = (int) $res->json('data.id_transaksi');

        $this->assertDatabaseHas('transaksi', [
            'id_transaksi' => $id,
            'id_user' => $admin->id_users,
        ]);

        $this->assertNotSame('Palsu', (string) $res->json('data.pic'));

        $this->actingAs($admin)
            ->getJson('/admin/api/transaksi/' . $id)
            ->assertOk()
            ->assertJsonPath('data.dicatat_oleh', $admin->name);
    }

    public function test_ubah_transaksi_tidak_mengubah_pencatat_asli(): void
    {
        $this->butuhMysql();

        $admin = $this->admin();
        $id = $this->buatTransaksi($admin, 'pencatat');

        $this->actingAs($admin)
            ->putJson('/admin/api/transaksi/' . $id, [
                'keterangan' => 'Pencatat tetap',
                'nominal' => 15000,
                'uang_diterima' => 15000,
                'pic' => 'Palsu',
                'id_user' => 999999,
            ])
            ->assertOk();

        $this->assertDatabaseHas('transaksi', [
            'id_transaksi' => $id,
            'id_user' => $admin->id_users,
        ]);
    }

    public function test_lihat_detail_transaksi(): void
    {
        $this->butuhMysql();

        $id = $this->buatTransaksi($this->admin(), 'detail');

        $this->actingAs($this->admin())
            ->getJson('/admin/api/transaksi/' . $id)
            ->assertOk()
            ->assertJsonPath('data.id_transaksi', $id);
    }

    public function test_ubah_transaksi_mengubah_database(): void
    {
        $this->butuhMysql();

        $id = $this->buatTransaksi($this->admin(), 'ubah');

        $this->actingAs($this->admin())
            ->putJson('/admin/api/transaksi/' . $id, [
                'keterangan' => 'Sudah diubah',
                'nominal' => 25000,
                'uang_diterima' => 25000,
            ])
            ->assertOk();

        $this->assertDatabaseHas('transaksi', [
            'id_transaksi' => $id,
            'keterangan' => 'Sudah diubah',
        ]);
    }

    public function test_hapus_transaksi_menghapus_dari_database(): void
    {
        $this->butuhMysql();

        $id = $this->buatTransaksi($this->admin(), 'hapus');

        $this->actingAs($this->admin())
            ->deleteJson('/admin/api/transaksi/' . $id)
            ->assertOk();

        $this->assertDatabaseMissing('transaksi', [
            'id_transaksi' => $id,
        ]);
    }

    public function test_bendahara_dapat_crud_transaksi_kelasnya(): void
    {
        $this->butuhMysql();

        $bendahara = $this->bendahara();

        $id = $this->buatTransaksi(
            $bendahara,
            'bendahara',
            '/bendahara/api/transaksi'
        );

        // Ubah lewat endpoint bendahara.
        $this->actingAs($bendahara)
            ->putJson('/bendahara/api/transaksi/' . $id, [
                'keterangan' => 'Diubah bendahara',
                'nominal' => 15000,
                'uang_diterima' => 15000,
            ])
            ->assertOk();

        $this->assertDatabaseHas('transaksi', [
            'id_transaksi' => $id,
            'keterangan' => 'Diubah bendahara',
        ]);

        // Transaksi baru otomatis terikat kelas bendahara.
        $this->assertDatabaseHas('transaksi', [
            'id_transaksi' => $id,
            'id_kelas' => $bendahara->id_kelas,
        ]);

        // Hapus lewat endpoint bendahara.
        $this->actingAs($bendahara)
            ->deleteJson('/bendahara/api/transaksi/' . $id)
            ->assertOk();

        $this->assertDatabaseMissing('transaksi', [
            'id_transaksi' => $id,
        ]);
    }
}
