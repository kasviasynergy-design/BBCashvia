<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Http\Request;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\KelasController;

echo "=== TES KONTROLLER (data tes akan dibuat lalu dihapus) ===" . PHP_EOL;
$ok = true;
$idSiswaTes = null;
$idKelasTes = null;

$siswaCtrl = new SiswaController();
$kelasCtrl = new KelasController();

// 1. INDEX siswa
try {
    $res = $siswaCtrl->index(Request::create('/admin/api/siswa', 'GET'));
    $data = $res->getData(true);
    echo "INDEX siswa: " . (isset($data['data']) ? count($data['data']) : '?') . " siswa | kelas: " . (isset($data['kelas']) ? count($data['kelas']) : '?') . PHP_EOL;
} catch (\Throwable $e) { $ok = false; echo "INDEX siswa ERROR: " . $e->getMessage() . PHP_EOL; }

// 2. STORE siswa tes
try {
    $req = Request::create('/admin/api/siswa', 'POST', [], [], [], [], json_encode([
        'nis' => '9999',
        'nama' => 'Tes Verifikasi',
        'id_kelas' => 1,
        'jenis_kelamin' => 'L',
        'status' => 'Aktif',
    ]));
    $req->headers->set('Content-Type', 'application/json');
    $res = $siswaCtrl->store($req);
    $data = json_decode($res->getContent(), true);
    $idSiswaTes = isset($data['data']['id_siswa']) ? $data['data']['id_siswa'] : null;
    $nm = isset($data['message']) ? $data['message'] : 'gagal';
    $nis = isset($data['data']['nis']) ? $data['data']['nis'] : '-';
    $kel = isset($data['data']['kelas']) ? $data['data']['kelas'] : '-';
    $jk = isset($data['data']['jenis_kelamin']) ? $data['data']['jenis_kelamin'] : '-';
    echo "STORE siswa: $nm | id=$idSiswaTes | nis=$nis | kelas=$kel | jk=$jk\n";
    if (!isset($data['data']['id_siswa'])) $ok = false;
} catch (\Throwable $e) { $ok = false; echo "STORE siswa ERROR: " . $e->getMessage() . PHP_EOL; }

// 3. UPDATE siswa tes
if ($idSiswaTes) {
    try {
        $req = Request::create('/admin/api/siswa/' . $idSiswaTes, 'PUT', [], [], [], [], json_encode([
            'nis' => '9999',
            'nama' => 'Tes Verifikasi Diubah',
            'id_kelas' => 1,
            'jenis_kelamin' => 'P',
            'status' => 'Tidak Aktif',
        ]));
        $req->headers->set('Content-Type', 'application/json');
        $res = $siswaCtrl->update($req, (string) $idSiswaTes);
        $data = json_decode($res->getContent(), true);
        $nm = isset($data['message']) ? $data['message'] : 'gagal';
        $nama = isset($data['data']['nama']) ? $data['data']['nama'] : '-';
        echo "UPDATE siswa: $nm | nama=$nama\n";
        if (!isset($data['data']['id_siswa'])) $ok = false;
    } catch (\Throwable $e) { $ok = false; echo "UPDATE siswa ERROR: " . $e->getMessage() . PHP_EOL; }
}

// 4. STORE siswa duplikat nis (harus gagal unique)
try {
    $req = Request::create('/admin/api/siswa', 'POST', [], [], [], [], json_encode([
        'nis' => '2888',
        'nama' => 'Duplikat',
        'id_kelas' => 1,
    ]));
    $req->headers->set('Content-Type', 'application/json');
    $res = $siswaCtrl->store($req);
    echo "STORE duplikat nis status: " . $res->getStatusCode() . " (harus 422)\n";
    if ($res->getStatusCode() !== 422) $ok = false;
} catch (\Throwable $e) { echo "STORE duplikat nis ERROR: " . $e->getMessage() . PHP_EOL; }

// 5. INDEX kelas
try {
    $res = $kelasCtrl->index(Request::create('/admin/api/kelas', 'GET'));
    $data = $res->getData(true);
    echo "INDEX kelas: " . count($data['data']) . " kelas\n";
    foreach ($data['data'] as $k) {
        echo "   - {$k['nama_kelas']} (tingkat={$k['tingkat']}, siswa={$k['jumlah_siswa']})\n";
    }
} catch (\Throwable $e) { $ok = false; echo "INDEX kelas ERROR: " . $e->getMessage() . PHP_EOL; }

// 6. STORE kelas tes
try {
    $req = Request::create('/admin/api/kelas', 'POST', [], [], [], [], json_encode([
        'nama_kelas' => 'Kelas Tes Verifikasi',
        'tingkat' => 'XI',
        'tahun_ajaran' => '2026/2027',
    ]));
    $req->headers->set('Content-Type', 'application/json');
    $res = $kelasCtrl->store($req);
    $data = json_decode($res->getContent(), true);
    $idKelasTes = isset($data['data']['id_kelas']) ? $data['data']['id_kelas'] : null;
    $nm = isset($data['message']) ? $data['message'] : 'gagal';
    $sis = isset($data['data']['jumlah_siswa']) ? $data['data']['jumlah_siswa'] : '-';
    echo "STORE kelas: $nm | id=$idKelasTes | siswa=$sis\n";
    if (!isset($data['data']['id_kelas'])) $ok = false;
} catch (\Throwable $e) { $ok = false; echo "STORE kelas ERROR: " . $e->getMessage() . PHP_EOL; }

// 7. UPDATE kelas tes
if ($idKelasTes) {
    try {
        $req = Request::create('/admin/api/kelas/' . $idKelasTes, 'PUT', [], [], [], [], json_encode([
            'nama_kelas' => 'Kelas Tes Diubah',
            'tingkat' => 'XII',
        ]));
        $req->headers->set('Content-Type', 'application/json');
        $res = $kelasCtrl->update($req, (string) $idKelasTes);
        $data = json_decode($res->getContent(), true);
        $nm = isset($data['message']) ? $data['message'] : 'gagal';
        $nama = isset($data['data']['nama_kelas']) ? $data['data']['nama_kelas'] : '-';
        echo "UPDATE kelas: $nm | nama=$nama\n";
    } catch (\Throwable $e) { $ok = false; echo "UPDATE kelas ERROR: " . $e->getMessage() . PHP_EOL; }
}

// 8. HAPUS siswa tes
if ($idSiswaTes) {
    try {
        $res = $siswaCtrl->destroy((string) $idSiswaTes);
        $data = json_decode($res->getContent(), true);
        $nm = isset($data['message']) ? $data['message'] : 'gagal';
        echo "HAPUS siswa tes: $nm\n";
    } catch (\Throwable $e) { $ok = false; echo "HAPUS siswa tes ERROR: " . $e->getMessage() . PHP_EOL; }
}

// 9. HAPUS kelas tes
if ($idKelasTes) {
    try {
        $res = $kelasCtrl->destroy((string) $idKelasTes);
        $data = json_decode($res->getContent(), true);
        $nm = isset($data['message']) ? $data['message'] : 'gagal';
        echo "HAPUS kelas tes: $nm\n";
    } catch (\Throwable $e) { $ok = false; echo "HAPUS kelas tes ERROR: " . $e->getMessage() . PHP_EOL; }
}

// 10. Verifikasi kembali data asli utuh
$cntSiswa = Siswa::count();
$cntKelas = Kelas::count();
echo "=== AKHIR: siswa=$cntSiswa, kelas=$cntKelas ===" . PHP_EOL;
echo $ok ? "SEMUA TES BERHASIL\n" : "ADA TES YANG GAGAL\n";
