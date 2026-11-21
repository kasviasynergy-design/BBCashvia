<?php

namespace Tests\Feature;

use App\Support\KataSandiAwal;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

/**
 * Pengujian ringkas untuk fitur Demo Day Tahap 4.
 *
 * Semua pengujian di sini bersifatREAD-ONLY terhadap database lokal:
 * tidak menambah/mengubah users, siswa, kelas, maupun transaksi.
 */
class DemoDayFiturTest extends TestCase
{
    private function admin(): User
    {
        $admin = new User();
        $admin->name = 'Admin Uji Demo Day';
        $admin->email = 'admin-demo-' . uniqid() . '@example.test';
        $admin->role = 'admin';

        return $admin;
    }

    public function test_halaman_cetak_laporan_memuat_kop_dan_filter(): void
    {
        $respons = $this->actingAs($this->admin())
            ->get('/laporan-kas/cetak?dari=2026-01-01&sampai=2026-12-31');

        $respons->assertOk();

        /*
         * Pakai assertTrue, bukan assertSee: halaman memuat logo dalam
         * data URI berukuran besar sehingga diff kegagalan assertSee
         * dapat membanjiri keluaran konsol.
         */
        $html = (string) $respons->getContent();

        $this->assertTrue(str_contains($html, 'BBCashvia'), 'Kop BBCashvia tidak ditemukan.');
        $this->assertTrue(str_contains($html, 'KASVIA Synergy'), 'Tagline tidak ditemukan.');
        $this->assertTrue(str_contains($html, 'Laporan Kas Kelas'), 'Judul laporan tidak ditemukan.');
        $this->assertTrue(str_contains($html, '01/01/2026'), 'Filter tanggal mulai tidak tampil.');
        $this->assertTrue(str_contains($html, 'Semua Kelas'), 'Nama kelas tidak tampil.');
    }

    public function test_unduh_pdf_laporan_menghasilkan_dokumen_pdf(): void
    {
        $respons = $this->actingAs($this->admin())
            ->get('/laporan-kas/pdf');

        $respons->assertOk();

        $this->assertSame(
            'application/pdf',
            $respons->headers->get('Content-Type'),
            'Content-Type PDF tidak sesuai.'
        );

        $this->assertTrue(
            str_starts_with((string) $respons->getContent(), '%PDF'),
            'Isi respons bukan dokumen PDF.'
        );
    }

    public function test_paginasi_siswa_server_side_maksimal_sepuluh_baris(): void
    {
        $respons = $this->actingAs($this->admin())
            ->getJson('/admin/api/siswa?serverSide=1&page=1');

        $respons->assertOk()
            ->assertJsonStructure([
                'data',
                'pagination' => [
                    'total',
                    'per_page',
                    'current_page',
                    'last_page',
                    'from',
                    'to',
                ],
                'statistik',
            ]);

        $this->assertSame(10, $respons->json('pagination.per_page'));
        $this->assertLessThanOrEqual(10, count($respons->json('data')));
    }

    public function test_template_import_dapat_diunduh(): void
    {
        $respons = $this->actingAs($this->admin())
            ->get('/admin/api/pengguna/template');

        $respons->assertOk()->assertDownload('template-import-pengguna-bbcashvia.xlsx');

        $this->assertTrue(
            str_contains(
                (string) $respons->headers->get('Content-Type'),
                'spreadsheetml'
            ),
            'Content-Type template bukan XLSX.'
        );
    }

    public function test_pratinjau_import_tidak_menyimpan_baris_invalid(): void
    {
        $email = 'invalid-' . uniqid() . '@example.test';

        $csv = "Nama,Email,NIS,Peran,Kelas\n"
            . "Siswa Uji,{$email},12345,viewer,UJI DATA TIDAK ADA\n";

        $respons = $this->actingAs($this->admin())->postJson(
            '/admin/api/pengguna/preview',
            ['file' => UploadedFile::fake()->createWithContent('siswa.csv', $csv)]
        );

        $respons->assertOk()
            ->assertJsonPath('berhasil', 0)
            ->assertJsonPath('gagal', 1);

        $this->assertDatabaseMissing('users', ['email' => $email]);
    }

    public function test_dokx_ditolak_karena_bukan_format_tabulasi(): void
    {
        $respons = $this->actingAs($this->admin())->postJson(
            '/admin/api/pengguna/preview',
            [
                'file' => UploadedFile::fake()->create(
                    'siswa.docx',
                    10,
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ),
            ]
        );

        $respons->assertStatus(422);
    }

    public function test_password_awal_memenuhi_aturan_aplikasi(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $password = KataSandiAwal::buat();

            $this->assertSame(KataSandiAwal::PANJANG, strlen($password));
            $this->assertMatchesRegularExpression('/[A-Z]/', $password);
            $this->assertMatchesRegularExpression('/[a-z]/', $password);
            $this->assertMatchesRegularExpression('/[0-9]/', $password);
            $this->assertMatchesRegularExpression('/[^A-Za-z0-9]/', $password);
        }
    }
}
