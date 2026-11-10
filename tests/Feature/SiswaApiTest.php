<?php

namespace Tests\Feature;

use App\Models\Siswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Uji API Data Siswa: jenis kelamin, nomor HP/WhatsApp, dan
 * status iuran harus ikut terkirim tanpa error.
 *
 * Latar belakang: endpoint ini sempat error "Call to undefined
 * method statusIuran()" dan kolom jenis kelamin/nomor HP selalu
 * kosong di halaman Data Siswa.
 */
class SiswaApiTest extends TestCase
{

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

    public function test_index_siswa_mengembalikan_jenis_kelamin_dan_status_iuran(): void
    {
        $this->butuhMysql();

        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/siswa');

        $respons->assertOk()->assertJsonStructure([
            'data',
            'kelas',
        ]);

        $data = $respons->json('data');
        $this->assertNotEmpty($data, 'Data siswa tidak boleh kosong.');

        $pertama = $data[0];
        $this->assertArrayHasKey('jenis_kelamin', $pertama);
        $this->assertArrayHasKey('no_hp', $pertama);
        $this->assertArrayHasKey('status_iuran', $pertama);
        $this->assertContains(
            $pertama['status_iuran'],
            ['lunas', 'sebagian', 'belum'],
            'Status iuran hanya boleh "lunas", "sebagian", atau "belum".'
        );
        $this->assertArrayHasKey('tagihan_iuran', $pertama);
        $this->assertArrayHasKey('terbayar_iuran', $pertama);
        $this->assertArrayHasKey('sisa_iuran', $pertama);
        $this->assertArrayHasKey('rincian_iuran', $pertama);
    }

    public function test_tambah_siswa_menyimpan_jenis_kelamin_dan_nomor_hp(): void
    {
        $this->butuhMysql();

        $respons = $this->actingAs($this->admin())
            ->postJson('/admin/api/siswa', [
                'nis' => 'UJIWA001',
                'nama' => 'Siswa Uji WA',
                'id_kelas' => null,
                'jenis_kelamin' => 'L',
                'no_hp' => '0812-3456-7890',
            ]);

        $respons->assertCreated();

        $this->assertDatabaseHas('siswa', [
            'nis' => 'UJIWA001',
            'nama_siswa' => 'Siswa Uji WA',
            'Jenis_Kelamin' => 'Laki-Laki',
            // Nomor dirapikan jadi digit saja.
            'no_hp' => '081234567890',
        ]);
    }

    public function test_nis_lebih_dari_11_karakter_ditolak(): void
    {
        $this->butuhMysql();

        $respons = $this->actingAs($this->admin())
            ->postJson('/admin/api/siswa', [
                'nis' => '123456789012',
                'nama' => 'Siswa NIS Kepanjangan',
            ]);

        $respons->assertStatus(422)
            ->assertJsonValidationErrors(['nis']);
    }

    public function test_ubah_siswa_dapat_mengosongkan_nomor_hp(): void
    {
        $this->butuhMysql();

        $siswa = Siswa::firstOrFail();

        $this->actingAs($this->admin())
            ->putJson('/admin/api/siswa/' . $siswa->id_siswa, [
                'nis' => $siswa->nis,
                'nama' => $siswa->nama_siswa,
                'id_kelas' => $siswa->id_kelas,
                'jenis_kelamin' => $siswa->Jenis_Kelamin,
                'no_hp' => null,
            ])
            ->assertOk();

        $this->assertDatabaseHas('siswa', [
            'id_siswa' => $siswa->id_siswa,
            'no_hp' => null,
        ]);
    }
}
