<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * S3-03: PENGUJIAN FUNGSIONAL TERSTRUKTUR (END-TO-END).
 *
 * Dua puluh skenario (10 positif & 10 negatif) mengikuti alur
 * pengguna sebenarnya: dari login → otorisasi → CRUD master data
 * → pencatatan transaksi kas (termasuk berbagi bukti/Nota) →
 * unduh bukti → ringkasan laporan → logout & ganti password.
 *
 * Tiap skenario memakai kode UJF-01..UJF-20 dan hasilnya dipetakan
 * ke laporan Excel/PDF (S3-03_Functional_Testing_Report).
 */
class FungsionalEndToEndTest extends TestCase
{

    /** Buat user nyata (tersimpan dalam transaksi uji). */
    private function buatUser(
        string $role,
        ?int $idKelas = null,
        string $password = 'KataSandi#1'
    ): User {
        return User::create([
            'name' => 'Penguji ' . $role,
            'email' => $role . '_' . uniqid() . '@example.test',
            'role' => $role,
            'id_kelas' => $idKelas,
            'password' => Hash::make($password),
            'must_change_password' => false,
        ]);
    }

    private function buatKelas(string $nama = 'UJI FNC'): Kelas
    {
        return Kelas::create([
            'nama_kelas' => $nama,
            'tingkat' => 'XI',
        ]);
    }

    private function buatSiswa(Kelas $kelas, string $nama = 'Siswa Fungsional'): Siswa
    {
        return Siswa::create([
            'nis' => 'FNC' . substr(uniqid(), -8),
            'nama_siswa' => $nama,
            'id_kelas' => $kelas->id_kelas,
            'status' => 'Aktif',
        ]);
    }

    // ==============================================================
    // KELOMPOK A - AUTENTIKASI (login s.d. ganti password)
    // ==============================================================

    /** UJF-01 - Login admin valid (Positif). */
    public function test_UJF_01_login_admin_valid(): void
    {
        $admin = $this->buatUser('admin');

        $res = $this->post('/login', [
            'email' => $admin->email,
            'password' => 'KataSandi#1',
            'role' => 'admin',
        ]);

        $res->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticated();
    }

    /** UJF-02 - Login bendahara valid (Positif). */
    public function test_UJF_02_login_bendahara_valid(): void
    {
        $kelas = $this->buatKelas('UJI FNC B');
        $bendahara = $this->buatUser('bendahara', $kelas->id_kelas);

        $res = $this->post('/login', [
            'email' => $bendahara->email,
            'password' => 'KataSandi#1',
            'role' => 'bendahara',
        ]);

        $res->assertRedirect(route('bendahara.dashboard'));
        $this->assertAuthenticated();
    }

    /** UJF-03 - Login viewer valid (Positif). */
    public function test_UJF_03_login_viewer_valid(): void
    {
        $kelas = $this->buatKelas('UJI FNC V');
        $viewer = $this->buatUser('viewer', $kelas->id_kelas);

        $res = $this->post('/login', [
            'email' => $viewer->email,
            'password' => 'KataSandi#1',
            'role' => 'viewer',
        ]);

        $res->assertRedirect(route('viewer.dashboard'));
        $this->assertAuthenticated();
    }

    /** UJF-04 - Login dengan password salah (Negatif). */
    public function test_UJF_04_login_password_salah(): void
    {
        $admin = $this->buatUser('admin');

        $res = $this->postJson('/login', [
            'email' => $admin->email,
            'password' => 'BukanSandi#99',
            'role' => 'admin',
        ]);

        $res->assertStatus(422);
        // S3-07: pesan dipisah agar pengguna tahu bagian mana yang salah.
        $res->assertJsonPath('errors.password.0',
            'Password yang Anda masukkan salah.');
        $this->assertGuest();
    }

    /** UJF-05 - Login dengan peran tidak sesuai akun (Negatif). */
    public function test_UJF_05_login_peran_tidak_sesuai(): void
    {
        $admin = $this->buatUser('admin');

        $res = $this->postJson('/login', [
            'email' => $admin->email,
            'password' => 'KataSandi#1',
            'role' => 'viewer',
        ]);

        $res->assertStatus(422);
        $res->assertJsonPath('errors.role.0',
            'Peran yang dipilih tidak sesuai dengan akun ini.');
        $this->assertGuest();
    }

    /** UJF-06 - Tamu mencoba membuka halaman admin (Negatif). */
    public function test_UJF_06_tamu_diarahkan_ke_login(): void
    {
        $this->get('/dashboard/admin')->assertRedirect();
        $this->assertGuest();
    }

    /** UJF-07 - Viewer membuka API admin (Negatif). */
    public function test_UJF_07_viewer_ditolak_api_admin(): void
    {
        $viewer = $this->buatUser('viewer');

        $res = $this->actingAs($viewer)->getJson('/admin/api/pengguna');

        $res->assertStatus(403);
        $res->assertJson(['success' => false]);
        $this->assertNotEmpty($res->json('message'));
    }

    // ==============================================================
    // KELOMPOK B - MASTER DATA (kelas & siswa)
    // ==============================================================

    /** UJF-08 - Admin menambah kelas baru (Positif). */
    public function test_UJF_08_admin_tambah_kelas(): void
    {
        $admin = $this->buatUser('admin');

        $res = $this->actingAs($admin)->postJson('/admin/api/kelas', [
            'nama_kelas' => 'UJI FNC K',
            'tingkat' => 'XI',
        ]);

        $res->assertCreated();
        $res->assertJsonPath('message', 'Data kelas berhasil ditambahkan.');

        $this->assertDatabaseHas('kelas', [
            'nama_kelas' => 'UJI FNC K',
        ]);
    }

    /** UJF-09 - Admin menambah siswa baru (Positif). */
    public function test_UJF_09_admin_tambah_siswa(): void
    {
        $admin = $this->buatUser('admin');
        $kelas = $this->buatKelas('UJI FNC S');

        $res = $this->actingAs($admin)->postJson('/admin/api/siswa', [
            'nis' => 'FNC' . substr(uniqid(), -8),
            'nama' => 'Siswa Fungsional Baru',
            'id_kelas' => $kelas->id_kelas,
        ]);

        $res->assertCreated();
        $res->assertJsonPath('data.nama', 'Siswa Fungsional Baru');
        $res->assertJsonPath('data.kelas', 'UJI FNC S');

        $this->assertDatabaseHas('siswa', [
            'nama_siswa' => 'Siswa Fungsional Baru',
            'id_kelas' => $kelas->id_kelas,
        ]);
    }

    /** UJF-10 - Menambah siswa tanpa NIS (Negatif). */
    public function test_UJF_10_tambah_siswa_tanpa_nis(): void
    {
        $admin = $this->buatUser('admin');
        $kelas = $this->buatKelas('UJI FNC N');

        $res = $this->actingAs($admin)->postJson('/admin/api/siswa', [
            'nama' => 'Siswa Tanpa NIS',
            'id_kelas' => $kelas->id_kelas,
        ]);

        $res->assertStatus(422);
        $res->assertJsonPath('errors.nis.0', 'NIS wajib diisi.');
    }

    /** UJF-11 - Bendahara memutahirkan siswa kelas lain (Negatif, anti-IDOR). */
    public function test_UJF_11_bendahara_tak_bisa_edit_siswa_kelas_lain(): void
    {
        $kelasA = $this->buatKelas('UJI FNC A');
        $kelasB = $this->buatKelas('UJI FNC B');
        $siswaB = $this->buatSiswa($kelasB, 'Siswa Kelas B');
        $bendahara = $this->buatUser('bendahara', $kelasA->id_kelas);

        $res = $this->actingAs($bendahara)
            ->putJson('/bendahara/api/siswa/' . $siswaB->id_siswa, [
                'nis' => $siswaB->nis,
                'nama' => 'Siswa Kelas B Direbut',
                'id_kelas' => $kelasB->id_kelas,
            ]);

        $res->assertStatus(404);

        $this->assertDatabaseHas('siswa', [
            'id_siswa' => $siswaB->id_siswa,
            'nama_siswa' => 'Siswa Kelas B',
        ]);
    }

    // ==============================================================
    // KELOMPOK C - TRANSAKSI KAS (hingga unduh bukti)
    // ==============================================================

    private function isiTransaksiBendahara(Kelas $kelasSiswa, array $tambahan = []): array
    {
        return array_merge([
            'tanggal' => now()->toDateString(),
            'nominal' => 10000,
            'jenis' => 'pemasukan',
            'kategori' => 'Iuran',
            'metode' => 'CH',
            'uang_diterima' => 10000,
            'nama_pembayar' => 'Bapak Siswa Fungsional',
            'periode' => now()->format('Y-m'),
            'id_siswa' => $this->buatSiswa($kelasSiswa)->id_siswa,
        ], $tambahan);
    }

    /** UJF-12 - Bendahara mencatat pemasukan kas (Positif). */
    public function test_UJF_12_bendahara_catat_pemasukan(): void
    {
        $kelas = $this->buatKelas('UJI FNC T');
        $bendahara = $this->buatUser('bendahara', $kelas->id_kelas);

        $res = $this->actingAs($bendahara)
            ->postJson('/bendahara/api/transaksi',
                $this->isiTransaksiBendahara($kelas));

        $res->assertCreated();
        $res->assertJsonPath('data.jenis', 'pemasukan');
        // Kolom DECIMAL MySQL sampai di JSON sebagai string.
        $this->assertSame('10000.00', (string) $res->json('data.nominal'));

        $noBukti = (string) $res->json('data.no_bukti');
        $this->assertStringStartsWith('TRX-', $noBukti);

        $this->assertDatabaseHas('transaksi', [
            'no_bukti' => $noBukti,
            'id_kelas' => $kelas->id_kelas,
            'jenis' => 'pemasukan',
            'kategori' => 'Iuran',
        ]);
    }

    /** UJF-13 - Uang diterima kurang dari nominal (Negatif). */
    public function test_UJF_13_uang_diterima_kurang_dari_nominal(): void
    {
        $kelas = $this->buatKelas('UJI FNC U');
        $bendahara = $this->buatUser('bendahara', $kelas->id_kelas);

        $res = $this->actingAs($bendahara)
            ->postJson('/bendahara/api/transaksi',
                $this->isiTransaksiBendahara($kelas, [
                    'nominal' => 10000,
                    'uang_diterima' => 5000,
                ]));

        $res->assertStatus(422);
        $res->assertJsonPath('errors.uang_diterima.0',
            'Uang diterima tidak boleh kurang dari nominal transaksi.');
    }

    /** UJF-14 - Pembayaran multi-iuran satu nomor bukti (Positif). */
    public function test_UJF_14_pembayaran_banyak_iuran_satu_bukti(): void
    {
        $kelas = $this->buatKelas('UJI FNC M');
        $siswa = $this->buatSiswa($kelas);
        $bendahara = $this->buatUser('bendahara', $kelas->id_kelas);

        $res = $this->actingAs($bendahara)->postJson('/bendahara/api/transaksi', [
            'transaksi' => [
                [
                    'tanggal' => now()->toDateString(),
                    'nominal' => 5000,
                    'jenis' => 'pemasukan',
                    'kategori' => 'Iuran',
                    'periode' => '2026-10',
                    'id_siswa' => $siswa->id_siswa,
                ],
                [
                    'tanggal' => now()->toDateString(),
                    'nominal' => 7000,
                    'jenis' => 'pemasukan',
                    'kategori' => 'Iuran',
                    'periode' => '2026-11',
                    'id_siswa' => $siswa->id_siswa,
                ],
            ],
        ]);

        $res->assertCreated();
        $res->assertJsonPath('jumlah', 2);

        $noBukti = (string) $res->json('no_bukti');
        $this->assertSame(
            $res->json('data.0.no_bukti'),
            $res->json('data.1.no_bukti'),
            'Rincian satu pembayaran harus memakai satu nomor bukti.'
        );
        $this->assertStringStartsWith('TRX-', $noBukti);
    }

    /** UJF-15 - Lampiran bukti berformat tidak sah (Negatif). */
    public function test_UJF_15_bukti_berformat_tidak_sah(): void
    {
        $kelas = $this->buatKelas('UJI FNC F');
        $bendahara = $this->buatUser('bendahara', $kelas->id_kelas);

        $isi = $this->isiTransaksiBendahara($kelas);
        $isi['bukti_transaksi'] = UploadedFile::fake()->create('bukti.txt', 12);

        $res = $this->actingAs($bendahara)
            ->post('/bendahara/api/transaksi', $isi,
                ['Accept' => 'application/json']);

        $res->assertStatus(422);
        $res->assertJsonPath('errors.bukti_transaksi.0',
            'Bukti harus berupa JPG, JPEG, PNG, atau PDF.');
    }

    /** UJF-16 - Bendahara melampirkan bukti dan mengunduhnya (Positif). */
    public function test_UJF_16_lampirkan_dan_unduh_bukti(): void
    {
        $kelas = $this->buatKelas('UJI FNC B');
        $bendahara = $this->buatUser('bendahara', $kelas->id_kelas);

        // PNG 1x1 valid (b64) - ekstensi GD tak wajib di lingkungan CLI.
        $isiAsli = (string) base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
            true
        );

        $isi = $this->isiTransaksiBendahara($kelas);
        $isi['bukti_transaksi'] = UploadedFile::fake()->createWithContent(
            'bukti.png',
            $isiAsli
        );

        $res = $this->actingAs($bendahara)
            ->post('/bendahara/api/transaksi', $isi,
                ['Accept' => 'application/json']);

        $res->assertCreated();

        $path = (string) $res->json('data.bukti_transaksi');
        $this->assertNotEmpty($path, 'Bukti harus berhasil disimpan.');
        $this->assertStringStartsWith('bukti-transaksi/', $path);

        // Nota tersimpan utuh di penyimpanan publik.
        Storage::disk('public')->assertExists($path);
        $this->assertSame($isiAsli, Storage::disk('public')->get($path));

        // Unduh sungguhan via penyaji /storage Laravel: isi harus
        // identik dengan lampiran yang diunggah. Bila respons
        // aliran (stream), ambil lewat streamedContent().
        $unduh = $this->get('/storage/' . $path);

        $unduh->assertOk();

        $isiUnduh = $unduh->baseResponse instanceof \Symfony\Component\HttpFoundation\StreamedResponse
            ? $unduh->streamedContent()
            : (string) $unduh->getContent();

        $this->assertSame($isiAsli, $isiUnduh);

        // Hapus lampirannya agar lingkungan bersih.
        Storage::disk('public')->delete($path);
    }

    /** UJF-17 - Unduh bukti dengan nama palsu → halaman 404 kustom (Negatif). */
    /** UJF-17 - Unduh bukti dengan nama palsu → halaman 404 kustom (Negatif). */
    public function test_UJF_17_unduh_bukti_palsu_404(): void
    {
        $res = $this->get('/storage/bukti-transaksi/tidak-ada-dker.png');

        $res->assertStatus(404);
        $res->assertSee('Halaman Tidak Ditemukan');
    }

    /** UJF-18 - Riwayat kas menampilkan pembayaran kelompok (Positif). */
    public function test_UJF_18_riwayat_kas_kelompok_bukti(): void
    {
        $kelas = $this->buatKelas('UJI FNC R');
        $bendahara = $this->buatUser('bendahara', $kelas->id_kelas);

        $simpan = $this->actingAs($bendahara)
            ->postJson('/bendahara/api/transaksi',
                $this->isiTransaksiBendahara($kelas));

        $simpan->assertCreated();
        $noBukti = (string) $simpan->json('data.no_bukti');

        $admin = $this->buatUser('admin');
        $res = $this->actingAs($admin)->getJson('/admin/api/transaksi');

        $res->assertOk();

        $baris = collect($res->json('data'))
            ->firstWhere('no_bukti', $noBukti);

        $this->assertNotNull($baris, 'Riwayat harus memuat transaksi baru.');
        $this->assertEquals(10000, $baris['nominal_grup']);
        $this->assertSame(1, $baris['jumlah_rincian']);
    }

    // ==============================================================
    // KELOMPOK D - SESI (logout & kegagalan ganti password)
    // ==============================================================

    /** UJF-19 - Logout mengakhiri sesi (Positif). */
    public function test_UJF_19_logout_mengakhiri_sesi(): void
    {
        $admin = $this->buatUser('admin');
        $this->actingAs($admin)->post('/logout')->assertRedirect();

        $this->assertGuest();
        $this->get('/dashboard/admin')->assertRedirect();
    }

    /** UJF-20 - Ganti password tanpa kapital & khusus (Negatif). */
    public function test_UJF_20_ganti_password_lemah_ditolak(): void
    {
        $admin = $this->buatUser('admin');

        $res = $this->actingAs($admin)
            ->post('/change-password', [
                'new_password' => 'password1',
                'new_password_confirmation' => 'password1',
            ]);

        $res->assertSessionHasErrors(['new_password']);
        $this->assertTrue(Hash::check('KataSandi#1', $admin->fresh()->password));
    }
}
