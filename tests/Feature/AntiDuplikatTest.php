<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Transaksi;
use App\Models\User;
use Tests\TestCase;

/**
 * SKKNI-3 - Validasi anti-duplikat saat tambah data baru.
 *
 * Uji ini memastikan data identik ditolak (422) dan tidak menambah
 * baris baru, sedangkan data yang berbeda tetap diterima.
 */
class AntiDuplikatTest extends TestCase
{
    private function admin(): User
    {
        return User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();
    }

    private function payloadTransaksi(array $tambahan = []): array
    {
        return array_merge([
            'jenis' => 'pemasukan',
            'kategori' => 'kas',
            'keterangan' => 'Uji anti-duplikat',
            'tanggal' => '2026-11-20',
            'nominal' => 10000,
            'uang_diterima' => 10000,
            'metode' => 'CH',
        ], $tambahan);
    }

    public function test_transaksi_identik_ditolak_dan_tidak_tersimpan(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $this->payloadTransaksi())
            ->assertCreated();

        $sebelum = Transaksi::count();

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $this->payloadTransaksi())
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonValidationErrors(['duplikat']);

        $this->assertSame($sebelum, Transaksi::count());
    }

    public function test_transaksi_dengan_nominal_berbeda_tetap_diterima(): void
    {
        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $this->payloadTransaksi())
            ->assertCreated();

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $this->payloadTransaksi([
                'nominal' => 15000,
                'uang_diterima' => 15000,
            ]))
            ->assertCreated();
    }

    public function test_transaksi_ganda_dalam_satu_kiriman_ditolak(): void
    {
        $sebelum = Transaksi::count();

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', [
                'transaksi' => [
                    $this->payloadTransaksi(['keterangan' => 'Baris pertama']),
                    $this->payloadTransaksi(['keterangan' => 'Baris kedua']),
                ],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['duplikat']);

        $this->assertSame($sebelum, Transaksi::count());
    }

    public function test_iuran_identik_ditolak(): void
    {
        $kelas = Kelas::create([
            'nama_kelas' => 'UJI ANTI DUPLIKAT',
            'tingkat' => 'XI',
            'tahun_ajaran' => '2026/2027',
        ]);

        $payload = [
            'nama_iuran' => 'Iuran Uji Ganda',
            'keterangan' => 'Uji anti-duplikat',
            'jatuh_tempo' => '2026-12-01',
            'kategori' => 'bulanan',
            'nominal' => 20000,
            'status' => 'aktif',
            'id_kelas' => $kelas->id_kelas,
        ];

        $this->actingAs($this->admin())
            ->postJson('/admin/api/iuran', $payload)
            ->assertCreated();

        $this->actingAs($this->admin())
            ->postJson('/admin/api/iuran', $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nama_iuran']);
    }

    public function test_siswa_nama_sama_di_kelas_sama_ditolak(): void
    {
        $kelas = Kelas::create([
            'nama_kelas' => 'UJI SISWA GANDA',
            'tingkat' => 'XI',
            'tahun_ajaran' => '2026/2027',
        ]);

        $this->actingAs($this->admin())
            ->postJson('/admin/api/siswa', [
                'nis' => 'AD' . substr(uniqid(), -8),
                'nama' => 'Siswa Ganda',
                'id_kelas' => $kelas->id_kelas,
            ])
            ->assertCreated();

        $this->actingAs($this->admin())
            ->postJson('/admin/api/siswa', [
                'nis' => 'AD' . substr(uniqid(), -8),
                'nama' => 'Siswa Ganda',
                'id_kelas' => $kelas->id_kelas,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nama']);
    }

    public function test_kelas_identik_ditolak(): void
    {
        $payload = [
            'nama_kelas' => 'UJI KELAS GANDA',
            'tingkat' => 'XI',
            'tahun_ajaran' => '2026/2027',
        ];

        $this->actingAs($this->admin())
            ->postJson('/admin/api/kelas', $payload)
            ->assertCreated();

        $this->actingAs($this->admin())
            ->postJson('/admin/api/kelas', $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nama_kelas']);
    }

    public function test_form_biasa_mendapat_redirect_dan_flash_error(): void
    {
        $payload = $this->payloadTransaksi();

        $this->actingAs($this->admin())
            ->postJson('/admin/api/transaksi', $payload)
            ->assertCreated();

        $this->actingAs($this->admin())
            ->from('/admin/transaksi')
            ->post('/admin/api/transaksi', $payload)
            ->assertRedirect('/admin/transaksi')
            ->assertSessionHas('error');
    }
}
