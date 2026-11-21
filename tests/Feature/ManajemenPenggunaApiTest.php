<?php

namespace Tests\Feature;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ManajemenPenggunaApiTest extends TestCase
{
    /**
     * Kelas uji yang selalu tersedia. Jangan memakai ID hardcode seperti 4
     * karena database baru hanya memiliki tiga kelas dari KelasSeeder.
     */
    private function kelasUji(): Kelas
    {
        return Kelas::firstOrCreate(
            ['nama_kelas' => 'UJI MANAJEMEN PENGGUNA'],
            ['tingkat' => 'XI', 'tahun_ajaran' => '2026/2027']
        );
    }

    public function test_index_pengguna_menyertakan_kelas(): void
    {
        $admin = new User();
        $admin->name = 'Admin Uji';
        $admin->email = 'adminuji' . uniqid() . '@example.test';
        $admin->role = 'admin';

        $res = $this->actingAs($admin)->getJson('/admin/api/pengguna');

        $res->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'kelas',
            ]);

        $this->assertArrayHasKey('id_kelas', $res->json('data.0'));
        $this->assertArrayHasKey('kelas', $res->json('data.0'));
    }

    public function test_halaman_manajemen_pengguna_memuat_field_kelas(): void
    {
        $admin = new User();
        $admin->name = 'Admin Uji';
        $admin->email = 'adminuji2' . uniqid() . '@example.test';
        $admin->role = 'admin';

        $this->actingAs($admin)
            ->get('/admin/manajemen-pengguna')
            ->assertOk()
            ->assertSee('id="inputKelas"', false)
            ->assertSee('<th>Kelas</th>', false);
    }

    /**
     * Peran bendahara selalu siswa; kombinasi bendahara + wali_kelas
     * harus ditolak backend, bukan sekadar disembunyikan di UI.
     */
    public function test_bendahara_menolak_jenis_pengguna_wali_kelas(): void
    {
        $admin = new User();
        $admin->name = 'Admin Uji';
        $admin->email = 'adminuji3' . uniqid() . '@example.test';
        $admin->role = 'admin';

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Bendahara Uji',
                'email' => 'bendahara' . uniqid() . '@example.test',
                'peran' => 'bendahara',
                'jenis_viewer' => 'wali_kelas',
                'id_kelas' => $this->kelasUji()->id_kelas,
                'password' => 'Rahasia#1',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['jenis_viewer']);
    }

    /**
     * Walau klien tidak mengirim jenis pengguna, bendahara yang
     * tersimpan tetap berjenis "siswa" dan wajib tertaut ke satu siswa.
     */
    public function test_bendahara_tersimpan_sebagai_siswa(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji4' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $siswa = Siswa::whereNotIn(
            'id_siswa',
            User::whereNotNull('id_siswa')->pluck('id_siswa')
        )->firstOrFail();

        $email = 'bendaharasli' . uniqid() . '@example.test';

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Nama Yang Akan Diganti',
                'email' => $email,
                'peran' => 'bendahara',
                'id_siswa' => $siswa->id_siswa,
                'id_kelas' => $this->kelasUji()->id_kelas,
                'password' => 'Rahasia#1',
            ])
            ->assertCreated()
            ->assertJsonPath('data.jenis_viewer', 'siswa')
            ->assertJsonPath('data.id_siswa', (int) $siswa->id_siswa)
            ->assertJsonPath('data.nama', $siswa->nama_siswa);

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => 'bendahara',
            'jenis_viewer' => 'siswa',
            'id_siswa' => $siswa->id_siswa,
            'name' => $siswa->nama_siswa,
            'id_kelas' => $siswa->id_kelas,
        ]);
    }

    /**
     * Bendahara / Viewer Siswa tanpa Data Siswa harus ditolak backend,
     * meskipun validasi frontend dilewati.
     */
    public function test_bendahara_tanpa_data_siswa_ditolak(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji6' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Bendahara Tanpa Siswa',
                'email' => 'tanpasiswa' . uniqid() . '@example.test',
                'peran' => 'bendahara',
                'password' => 'Rahasia#1',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['id_siswa']);
    }

    /**
     * Viewer Wali Kelas tidak perlu (dan tidak boleh memiliki) Data
     * Siswa; kelasnya tetap diambil dari pilihan id_kelas.
     */
    public function test_viewer_wali_kelas_tanpa_data_siswa(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji7' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $email = 'walikelas' . uniqid() . '@example.test';

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Wali Kelas Uji',
                'email' => $email,
                'peran' => 'viewer',
                'jenis_viewer' => 'wali_kelas',
                'id_kelas' => $this->kelasUji()->id_kelas,
                'password' => 'Rahasia#1',
            ])
            ->assertCreated()
            ->assertJsonPath('data.id_siswa', null);

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => 'viewer',
            'jenis_viewer' => 'wali_kelas',
            'id_siswa' => null,
            'id_kelas' => $this->kelasUji()->id_kelas,
        ]);
    }

    /**
     * Satu siswa hanya boleh memiliki satu akun aktif.
     */
    public function test_satu_siswa_tidak_boleh_punya_dua_akun(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->firstOrFail();

        $siswa = Siswa::whereNotIn(
            'id_siswa',
            User::whereNotNull('id_siswa')->pluck('id_siswa')
        )->firstOrFail();

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => $siswa->nama_siswa,
                'email' => 'akunsatu' . uniqid() . '@example.test',
                'peran' => 'bendahara',
                'id_siswa' => $siswa->id_siswa,
                'password' => 'Rahasia#1',
            ])
            ->assertCreated();

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => $siswa->nama_siswa,
                'email' => 'akundua' . uniqid() . '@example.test',
                'peran' => 'viewer',
                'jenis_viewer' => 'siswa',
                'id_siswa' => $siswa->id_siswa,
                'password' => 'Rahasia#1',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['id_siswa']);
    }

    /**
     * Admin selalu tanpa jenis pengguna, apa pun yang dikirim klien.
     */
    public function test_admin_tanpa_jenis_pengguna(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji5' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $email = 'adminbaru' . uniqid() . '@example.test';

        $this->actingAs($admin)
            ->postJson('/admin/api/pengguna', [
                'nama' => 'Admin Baru',
                'email' => $email,
                'peran' => 'admin',
                'jenis_viewer' => 'wali_kelas',
                'id_kelas' => $this->kelasUji()->id_kelas,
                'password' => 'Rahasia#1',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => 'admin',
            'jenis_viewer' => null,
            'id_kelas' => null,
        ]);
    }

    public function test_daftar_siswa_form_hanya_kelas_terpilih_dan_menandai_akun(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji6' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $penanda = uniqid();
        $kelasA = Kelas::firstOrCreate(
            ['nama_kelas' => 'UJI FORM A ' . $penanda],
            ['tingkat' => 'XI', 'tahun_ajaran' => '2026/2027']
        );
        $kelasB = Kelas::firstOrCreate(
            ['nama_kelas' => 'UJI FORM B ' . $penanda],
            ['tingkat' => 'XI', 'tahun_ajaran' => '2026/2027']
        );

        $siswaA = Siswa::create([
            'nis' => 'F' . substr($penanda, -10),
            'nama_siswa' => 'Siswa Form A ' . $penanda,
            'id_kelas' => $kelasA->id_kelas,
            'status' => 'Aktif',
        ]);
        $siswaB = Siswa::create([
            'nis' => 'B' . substr($penanda, -10),
            'nama_siswa' => 'Siswa Form B ' . $penanda,
            'id_kelas' => $kelasB->id_kelas,
            'status' => 'Aktif',
        ]);

        $akun = new User();
        $akun->name = $siswaA->nama_siswa;
        $akun->email = 'akunsiswa' . $penanda . '@example.test';
        $akun->role = 'viewer';
        $akun->jenis_viewer = 'siswa';
        $akun->id_siswa = $siswaA->id_siswa;
        $akun->id_kelas = $kelasA->id_kelas;
        $akun->password = Hash::make('Rahasia#1');
        $akun->save();

        $respons = $this->actingAs($admin)->getJson(
            '/admin/api/pengguna/siswa?id_kelas=' . $kelasA->id_kelas
                . '&q=' . urlencode($siswaA->nis)
        );

        $respons->assertOk()->assertJsonPath('total_kelas', 1);

        $data = collect($respons->json('data'))->keyBy('id_siswa');

        $this->assertTrue($data->has($siswaA->id_siswa));
        $this->assertFalse($data->has($siswaB->id_siswa));
        $this->assertTrue((bool) $data[$siswaA->id_siswa]['tertaut']);

        $responsEdit = $this->actingAs($admin)->getJson(
            '/admin/api/pengguna/siswa?id_kelas=' . $kelasA->id_kelas
                . '&id_users=' . $akun->id_users
        );

        $dataEdit = collect($responsEdit->json('data'))->keyBy('id_siswa');
        $this->assertFalse((bool) $dataEdit[$siswaA->id_siswa]['tertaut']);
    }

    public function test_import_viewer_siswa_menambahkan_data_siswa_otomatis(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji7' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $penanda = uniqid();
        $kelas = Kelas::firstOrCreate(
            ['nama_kelas' => 'UJI IMPORT SISWA ' . $penanda],
            ['tingkat' => 'XI', 'tahun_ajaran' => '2026/2027']
        );
        $nis = 'I' . substr($penanda, -10);
        $email = 'importsiswa' . $penanda . '@example.test';
        $nama = 'Siswa Import ' . $penanda;

        $csv = "Nama,Email,NIS,Peran,Jenis Viewer,Kelas,Jenis Kelamin,No HP\n"
            . "{$nama},{$email},{$nis},viewer,siswa,{$kelas->nama_kelas},L,081234567890\n";

        $pratinjau = $this->actingAs($admin)->postJson(
            '/admin/api/pengguna/preview',
            ['file' => UploadedFile::fake()->createWithContent('siswa.csv', $csv)]
        );

        $pratinjau->assertOk()
            ->assertJsonPath('berhasil', 1)
            ->assertJsonPath('data.0.siswa_baru', true);

        $this->assertDatabaseMissing('siswa', ['nis' => $nis]);

        $baris = array_values(array_filter(
            $pratinjau->json('data'),
            fn ($item) => ($item['status'] ?? '') === 'valid'
        ));

        $respons = $this->actingAs($admin)->postJson(
            '/admin/api/pengguna/import',
            ['baris' => $baris]
        );

        $respons->assertOk()
            ->assertJsonPath('akun_berhasil', 1)
            ->assertJsonPath('siswa_dibuat', 1)
            ->assertJsonPath('duplikat', 0)
            ->assertJsonPath('gagal', 0);

        $siswa = Siswa::where('nis', $nis)->firstOrFail();
        $user = User::where('email', $email)->firstOrFail();

        $this->assertDatabaseHas('siswa', [
            'id_siswa' => $siswa->id_siswa,
            'nis' => $nis,
            'nama_siswa' => $nama,
            'id_kelas' => $kelas->id_kelas,
        ]);
        $this->assertSame((int) $siswa->id_siswa, (int) $user->id_siswa);
        $this->assertSame(1, (int) $user->must_change_password);

        $passwordAwal = $respons->json('akun.0.password');
        $this->assertTrue(Hash::check($passwordAwal, $user->password));
        $this->assertNotSame($passwordAwal, $user->password);
    }

    public function test_import_menolak_nis_yang_sudah_memiliki_akun(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji8' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $penanda = uniqid();
        $kelas = Kelas::firstOrCreate(
            ['nama_kelas' => 'UJI DUP NIS ' . $penanda],
            ['tingkat' => 'XI', 'tahun_ajaran' => '2026/2027']
        );
        $nis = 'D' . substr($penanda, -10);

        $siswa = Siswa::create([
            'nis' => $nis,
            'nama_siswa' => 'Siswa Duplikat ' . $penanda,
            'id_kelas' => $kelas->id_kelas,
            'status' => 'Aktif',
        ]);

        $akun = new User();
        $akun->name = $siswa->nama_siswa;
        $akun->email = 'nislama' . $penanda . '@example.test';
        $akun->role = 'viewer';
        $akun->jenis_viewer = 'siswa';
        $akun->id_siswa = $siswa->id_siswa;
        $akun->id_kelas = $kelas->id_kelas;
        $akun->password = Hash::make('Rahasia#1');
        $akun->save();

        $emailBaru = 'nisbaru' . $penanda . '@example.test';
        $csv = "Nama,Email,NIS,Peran,Jenis Viewer,Kelas\n"
            . "Siswa Baru,{$emailBaru},{$nis},viewer,siswa,{$kelas->nama_kelas}\n";

        $respons = $this->actingAs($admin)->postJson(
            '/admin/api/pengguna/preview',
            ['file' => UploadedFile::fake()->createWithContent('duplikat.csv', $csv)]
        );

        $respons->assertOk()
            ->assertJsonPath('berhasil', 0)
            ->assertJsonPath('duplikat', 1);

        $alasan = implode(' ', $respons->json('data.0.alasan'));
        $this->assertStringContainsString('sudah memiliki akun', $alasan);

        $this->assertDatabaseMissing('users', ['email' => $emailBaru]);
    }

    public function test_import_menolak_kelas_file_yang_berbeda_dengan_kelas_pilihan(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji9' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $penanda = uniqid();
        $kelasPilihan = Kelas::firstOrCreate(
            ['nama_kelas' => 'UJI PILIHAN ' . $penanda],
            ['tingkat' => 'XI', 'tahun_ajaran' => '2026/2027']
        );
        $kelasFile = Kelas::firstOrCreate(
            ['nama_kelas' => 'UJI FILE ' . $penanda],
            ['tingkat' => 'XI', 'tahun_ajaran' => '2026/2027']
        );

        $csv = "Nama,Email,NIS,Peran,Jenis Viewer,Kelas\n"
            . "Siswa Beda Kelas,bedakelas{$penanda}@example.test,"
            . 'K' . substr($penanda, -10) . ",viewer,siswa,{$kelasFile->nama_kelas}\n";

        $respons = $this->actingAs($admin)->postJson(
            '/admin/api/pengguna/preview',
            [
                'file' => UploadedFile::fake()->createWithContent('beda-kelas.csv', $csv),
                'id_kelas' => $kelasPilihan->id_kelas,
            ]
        );

        $respons->assertOk()->assertJsonPath('berhasil', 0);

        $alasan = implode(' ', $respons->json('data.0.alasan'));
        $this->assertStringContainsString('berbeda dengan kelas yang dipilih', $alasan);
    }

    public function test_bendahara_juga_membuat_data_siswa_otomatis_lewat_nisn(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji10' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $penanda = uniqid();
        $kelas = Kelas::firstOrCreate(
            ['nama_kelas' => 'UJI BENDAHARA BARU ' . $penanda],
            ['tingkat' => 'XI', 'tahun_ajaran' => '2026/2027']
        );
        $nis = 'B' . substr($penanda, -10);
        $email = 'bendaharabar' . $penanda . '@example.test';
        $nama = 'Bendahara Baru ' . $penanda;

        // Header NISN juga diterima, bukan hanya NIS.
        $csv = "Nama,Email,NISN,Peran,Jenis Viewer,Kelas,Jenis Kelamin,No HP\n"
            . "{$nama},{$email},{$nis},bendahara,siswa,{$kelas->nama_kelas},P,081298765432\n";

        $pratinjau = $this->actingAs($admin)->postJson(
            '/admin/api/pengguna/preview',
            ['file' => UploadedFile::fake()->createWithContent('bendahara.csv', $csv)]
        );

        $pratinjau->assertOk()
            ->assertJsonPath('berhasil', 1)
            ->assertJsonPath('data.0.siswa_baru', true)
            ->assertJsonPath('data.0.peran', 'bendahara');

        $this->assertDatabaseMissing('siswa', ['nis' => $nis]);

        $baris = array_values(array_filter(
            $pratinjau->json('data'),
            fn ($item) => ($item['status'] ?? '') === 'valid'
        ));

        $respons = $this->actingAs($admin)->postJson(
            '/admin/api/pengguna/import',
            ['baris' => $baris]
        );

        $respons->assertOk()
            ->assertJsonPath('akun_berhasil', 1)
            ->assertJsonPath('siswa_dibuat', 1)
            ->assertJsonPath('gagal', 0);

        $siswa = Siswa::where('nis', $nis)->firstOrFail();
        $user = User::where('email', $email)->firstOrFail();

        $this->assertDatabaseHas('siswa', [
            'nis' => $nis,
            'nama_siswa' => $nama,
            'id_kelas' => $kelas->id_kelas,
            'Jenis_Kelamin' => 'Perempuan',
            'no_hp' => '081298765432',
        ]);
        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => 'bendahara',
            'jenis_viewer' => 'siswa',
            'id_siswa' => $siswa->id_siswa,
            'name' => $nama,
            'id_kelas' => $kelas->id_kelas,
        ]);

        // NIS yang sama kini terdeteksi sebagai siswa terdaftar di form akun.
        $cek = $this->actingAs($admin)->getJson(
            '/admin/api/pengguna/siswa?id_kelas=' . $kelas->id_kelas
                . '&q=' . urlencode($nis)
        );

        $cek->assertOk();
        $data = collect($cek->json('data'))->keyBy('id_siswa');
        $this->assertTrue($data->has($siswa->id_siswa));
        $this->assertTrue((bool) $data[$siswa->id_siswa]['tertaut']);
    }

    public function test_import_baris_tanpa_kelas_tidak_gagal_saat_dikonfirmasi(): void
    {
        $admin = User::whereRaw('LOWER(role) = ?', ['admin'])->first();

        if (!$admin) {
            $admin = new User();
            $admin->name = 'Admin Uji';
            $admin->email = 'adminuji11' . uniqid() . '@example.test';
            $admin->role = 'admin';
        }

        $penanda = uniqid();
        $nisLama = 'K' . substr($penanda, -10);
        $siswaTanpaKelas = Siswa::create([
            'nis' => $nisLama,
            'nama_siswa' => 'Siswa Tanpa Kelas ' . $penanda,
            'id_kelas' => null,
            'status' => 'Aktif',
        ]);

        $emailAdmin = 'adminimp' . $penanda . '@example.test';
        $emailViewer = 'viewerimp' . $penanda . '@example.test';

        $csv = "Nama,Email,NIS,Peran,Jenis Viewer,Kelas,Jenis Kelamin,No HP\n"
            . "Admin Import,{$emailAdmin},,admin,,,\n"
            . "Viewer Tanpa Kelas,{$emailViewer},{$nisLama},viewer,siswa,,,\n";

        $pratinjau = $this->actingAs($admin)->postJson(
            '/admin/api/pengguna/preview',
            ['file' => UploadedFile::fake()->createWithContent('tanpa-kelas.csv', $csv)]
        );

        $pratinjau->assertOk()->assertJsonPath('berhasil', 2);

        // Label pratinjau tidak boleh memakai "Semua Kelas" sebagai nama kelas.
        $this->assertSame('', $pratinjau->json('data.0.kelas'));
        $this->assertSame('', $pratinjau->json('data.1.kelas'));

        $baris = array_values(array_filter(
            $pratinjau->json('data'),
            fn ($item) => ($item['status'] ?? '') === 'valid'
        ));

        $respons = $this->actingAs($admin)->postJson(
            '/admin/api/pengguna/import',
            ['id_kelas' => null, 'baris' => $baris]
        );

        $respons->assertOk()
            ->assertJsonPath('akun_berhasil', 2)
            ->assertJsonPath('siswa_dibuat', 0)
            ->assertJsonPath('siswa_terhubung', 1)
            ->assertJsonPath('gagal', 0);

        $this->assertDatabaseHas('users', [
            'email' => $emailAdmin,
            'role' => 'admin',
            'id_kelas' => null,
            'id_siswa' => null,
        ]);
        $this->assertDatabaseHas('users', [
            'email' => $emailViewer,
            'role' => 'viewer',
            'jenis_viewer' => 'siswa',
            'id_siswa' => $siswaTanpaKelas->id_siswa,
            'id_kelas' => null,
        ]);
    }
}
