<?php

/**
 * S3-03 - Generator Laporan Pengujian Fungsional.
 *
 * Menghasilkan:
 *  - docs/S3-03_Functional_Testing_Report.xlsx  (ditulis ulang OOXML murni)
 *  - docs/S3-03_Functional_Testing_Report.html  (sumber cetak PDF via Edge)
 *
 * Jalankan:  php scripts/buat_laporan_fungsional.php
 */

declare(strict_types=1);

define('PROYEK', dirname(__DIR__));
define('DOCS', PROYEK . '/docs');

if (!is_dir(DOCS)) {
    mkdir(DOCS, 0777, true);
}

$hasil = [];

// =============================================================
// 20 SKENARIO PENGUJIAN FUNGSIONAL (hasil run 2026-10-22)
// =============================================================
$hasil[] = ['1', 'UJF-01', 'Autentikasi', 'Login admin dengan email, password, dan peran yang tepat', 'Positif', 'POST /login (valid)', 'Diarahkan ke /dashboard/admin, sesi aktif', 'PASS'];
$hasil[] = ['2', 'UJF-02', 'Autentikasi', 'Login bendahara kelas dengan kredensial tepat', 'Positif', 'POST /login (valid)', 'Diarahkan ke /dashboard/bendahara, sesi aktif', 'PASS'];
$hasil[] = ['3', 'UJF-03', 'Autentikasi', 'Login viewer kelas dengan kredensial tepat', 'Positif', 'POST /login (valid)', 'Diarahkan ke /dashboard/viewer, sesi aktif', 'PASS'];
$hasil[] = ['4', 'UJF-04', 'Autentikasi', 'Tolak login bila password salah', 'Negatif', 'POST /login (password salah)', '422, pesan "Email atau password yang Anda masukkan salah.", tidak masuk', 'PASS'];
$hasil[] = ['5', 'UJF-05', 'Autentikasi', 'Tolak login bila peran tidak sesuai akun', 'Negatif', 'POST /login (role tapi beda akun)', '422, pesan "Peran yang dipilih tidak sesuai dengan akun ini."', 'PASS'];
$hasil[] = ['6', 'UJF-06', 'Otorisasi', 'Tamu membuka halaman admin tanpa login', 'Negatif', 'GET /dashboard/admin (tanpa sesi)', '302 diarahkan ke halaman login', 'PASS'];
$hasil[] = ['7', 'UJF-07', 'Otorisasi', 'Viewer membuka API manajemen pengguna admin', 'Negatif', 'GET /admin/api/pengguna (bg viewer)', '403 + JSON {success:false, message pesan akses ditolak}', 'PASS'];
$hasil[] = ['8', 'UJF-08', 'Master Data', 'Admin menambah kelas baru', 'Positif', 'POST /admin/api/kelas', '201, pesan "Data kelas berhasil ditambahkan.", data tersimpan', 'PASS'];
$hasil[] = ['9', 'UJF-09', 'Master Data', 'Admin menambah siswa beserta kelas', 'Positif', 'POST /admin/api/siswa', '201, data.nama & data.kelas sesuai, baris tersimpan', 'PASS'];
$hasil[] = ['10', 'UJF-10', 'Master Data', 'Tolak menambah siswa tanpa NIS', 'Negatif', 'POST /admin/api/siswa (tanpa nis)', '422, error "NIS wajib diisi."', 'PASS'];
$hasil[] = ['11', 'UJF-11', 'Otorisasi', 'Bendahara kelas A mencoba memutahirkan siswa kelas B (anti-IDOR)', 'Negatif', 'PUT /bendahara/api/siswa/{id kelas B}', '404 "Data siswa tidak ditemukan.", data kelas B tetap utuh', 'PASS'];
$hasil[] = ['12', 'UJF-12', 'Transaksi Kas', 'Bendahara mencatat pemasukan iuran', 'Positif', 'POST /bendahara/api/transaksi', '201, no_bukti TRX-*, id_kelas diikat kelas bendahara, jenis/kategori benar', 'PASS'];
$hasil[] = ['13', 'UJF-13', 'Transaksi Kas', 'Tolak uang diterima kurang dari nominal', 'Negatif', 'POST /bendahara/api/transaksi (diterima < nominal)', '422, error "Uang diterima tidak boleh kurang dari nominal transaksi."', 'PASS'];
$hasil[] = ['14', 'UJF-14', 'Transaksi Kas', 'Pembayaran beberapa iuran untuk 1 siswa', 'Positif', 'POST transaksi mode array 2 baris', '201 (jumlah 2), kedua baris memakai SATU no_bukti TRX-*', 'PASS'];
$hasil[] = ['15', 'UJF-15', 'Transaksi Kas', 'Tolak lampiran bukti berformat tidak sah', 'Negatif', 'POST transaksi + bukti .txt', '422, error "Bukti harus berupa JPG, JPEG, PNG, atau PDF."', 'PASS'];
$hasil[] = ['16', 'UJF-16', 'Transaksi Kas', 'Lampirkan bukti PNG lalu unduh nota via /storage', 'Positif', 'POST transaksi + bukti.png; GET /storage/{path}', '201 tersimpan; unduh 200; isi berkas unduhan identik dengan lampiran', 'PASS'];
$hasil[] = ['17', 'UJF-17', 'Transaksi Kas', 'Unduh bukti dengan nama tidak dikenal', 'Negatif', 'GET /storage/bukti-transaksi/tidaka*da.png', '404, halaman 404 kustom BBCashvia', 'PASS'];
$hasil[] = ['18', 'UJF-18', 'Laporan Kas', 'Riwayat kas menampilkan pembayaran tersegregasi per no_bukti', 'Positif', 'GET /admin/api/transaksi', '200, baris baru ada, nominal_grup = 10000, jumlah_rincian = 1', 'PASS'];
$hasil[] = ['19', 'UJF-19', 'Sesi', 'Logout mengakhiri sesi pengguna', 'Positif', 'POST /logout; GET /dashboard/admin', '302 ke login; user menjadi tamu; halaman admin tak bisa dibuka', 'PASS'];
$hasil[] = ['20', 'UJF-20', 'Sesi', 'Tolak ganti password tanpa huruf kapital/karakter khusus', 'Negatif', 'POST /change-password (password1)', '422, sesi error ke new_password; password lama tetap berlaku', 'PASS'];

// =============================================================
// BAGIAN 1 - siapkan berkas HTML (untuk PDF)
// =============================================================
$barisHtml = '';
foreach ($hasil as $r) {
    $kelas = $r[7] === 'PASS' ? 'pass' : 'fail';
    $barisHtml .= '<tr>'
        . '<td class="c">' . htmlspecialchars($r[0]) . '</td>'
        . '<td class="c"><b>' . htmlspecialchars($r[1]) . '</b></td>'
        . '<td>' . htmlspecialchars($r[2]) . '</td>'
        . '<td>' . htmlspecialchars($r[3]) . '</td>'
        . '<td class="c">' . htmlspecialchars($r[4]) . '</td>'
        . '<td>' . htmlspecialchars($r[5]) . '</td>'
        . '<td>' . htmlspecialchars($r[6]) . '</td>'
        . '<td class="c ' . $kelas . '"><b>' . htmlspecialchars($r[7]) . '</b></td>'
        . '<td class="c">Siswa 1 &amp; Siswa 2</td>'
        . '</tr>';
}

$html = '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">
<title>S3-03 Functional Testing Report - BBCashvia</title>
<style>
body{font-family:"Segoe UI",Arial,sans-serif;color:#0f172a;margin:26px}
h1{font-size:19px;margin:0 0 4px}
h2{font-size:13px;color:#4338ca;margin:20px 0 6px;text-transform:uppercase;letter-spacing:.05em}
.meta{color:#475569;font-size:11px;line-height:1.55}
.rekap{display:inline-block;background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;font-weight:700;font-size:12px;padding:6px 12px;border-radius:8px;margin:10px 0 4px}
table{border-collapse:collapse;width:100%;font-size:10.5px;margin-top:10px}
th{background:#4338ca;color:#fff;text-align:center;padding:7px 6px;border:1px solid #c7d2fe}
td{border:1px solid #cbd5e1;padding:6px;vertical-align:top}
td.c{text-align:center}
.pass{color:#047857}.fail{color:#b91c1c}
.catatan{margin-top:14px;font-size:10.5px;color:#475569;border-top:1px solid #cbd5e1;padding-top:8px}
</style></head><body>
<h1>BBCashvia - Functional Testing Report (S3-03)</h1>
<p class="meta">
Sistem: BBCashvia - Sistem Pengelolaan Kas Kelas (Laravel 12, PHP 8.2.12, MySQL <i>bbcashvia</i> / XAMPP)<br>
Tanggal eksekusi: <b>22 Oktober 2026</b> &bull; Eksekutor: <b>Siswa 1 &amp; Siswa 2</b><br>
Bukti otomatis: <code>tests/Feature/FungsionalEndToEndTest.php</code> - perintah
<code>php artisan test --filter "FungsionalEndToEndTest"</code><br>
Cakupan alur: <b>login &rarr; otorisasi &rarr; master data &rarr; transaksi kas (lampiran/unduh bukti) &rarr; laporan &rarr; sesi (logout, ganti password)</b>
</p>
<span class="rekap">REKAP: 20 skenario &bull; 10 positif &bull; 10 negatif &bull; 20 PASS &bull; 0 FAIL</span>
<table>
<thead><tr>
<th style="width:4%">No</th><th style="width:7%">Kode</th><th style="width:10%">Modul</th>
<th style="width:22%">Skenario</th><th style="width:7%">Jenis</th>
<th style="width:18%">Langkah pengujian</th><th style="width:24%">Hasil ekspektasi</th>
<th style="width:6%">Status</th><th style="width:9%">Penguji</th>
</tr></thead>
<tbody>' . $barisHtml . '</tbody></table>
<p class="catatan">Semua skenario dieksekusi otomatis dengan PHPUnit/Laravel 12 memakai basis data uji
MySQL <i>bbcashvia</i> (transaksi dibatalkan setelah uji; tidak menodai data sebenarnya).
Bukti lulusan sisi unduh nota diproduksi dengan asersi isi berkas identik pada respons
<code>/storage/{path}</code> (penyali berkas Laravel 12).</p>
</body></html>';

file_put_contents(DOCS . '/S3-03_Functional_Testing_Report.html', $html);

// =============================================================
// BAGIAN 2 - tulis berkas .xlsx (OOXML murni)
// =============================================================
define('TYPE_MAIN', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml');
define('TYPE_SHEET', 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml');
define('TYPE_STYLES', 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml');

function esc(string $nilai): string
{
    return htmlspecialchars($nilai, ENT_XML1, 'UTF-8');
}

function kolom(int $i): string
{
    $qid = '';
    while ($i > 0) {
        $sisa = ($i - 1) % 26;
        $qid = chr(65 + $sisa) . $qid;
        $i = intdiv($i - 1, 26);
    }

    return $qid;
}

function keSel(int $baris, int $kol, $nilai, string $tipe, int $xs): string
{
    $ref = kolom($kol) . $baris;

    if ($tipe === 'n') {
        return '<c r="' . $ref . '" s="' . $xs . '"><v>' . $nilai . '</v></c>';
    }

    return '<c r="' . $ref . '" t="inlineStr" s="' . $xs . '"><is><t xml:space="preserve">'
        . esc((string) $nilai) . '</t></is></c>';
}

$stylesXml = <<<'XML'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="14"/><name val="Calibri"/></font>
<font><b/><color rgb="FF047857"/><sz val="11"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF4338CA"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border/>
<border>
<left style="thin"><color rgb="FFCBD5E1"/></left><right style="thin"><color rgb="FFCBD5E1"/></right>
<top style="thin"><color rgb="FFCBD5E1"/></top><bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
</border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="7">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyNumberFormat="0" applyBorder="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="2" borderId="1" xfId="0" applyFill="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top" wrapText="0"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>
XML;

$wid = [6.5, 9.5, 14, 45, 9.5, 42, 47, 9.5, 17];
$kolHtml = '<cols>';
foreach ($wid as $i => $w) {
    $kolHtml .= '<col min="' . ($i + 1) . '" max="' . ($i + 1) . '" width="' . $w . '" customWidth="1"/>';
}
$kolHtml .= '</cols>';

// ---------- susun baris lembaran ----------
$susun = [];
$susun[] = keSel(1, 1, 'BBCashvia - Functional Testing Report (S3-03)', 's', 1);
$susun[] = keSel(2, 1, 'Diperiksa: 22 Oktober 2026 - Laravel 12, PHP 8.2.12, MySQL bbcashvia (XAMPP) - Penguji: Siswa 1 & Siswa 2', 's', 6);
$susun[] = keSel(3, 1, 'Rekap: 20 skenario | 10 positif | 10 negatif | 20 PASS | 0 FAIL', 's', 6);
$susun[] = keSel(4, 1, 'Bukti otomatis: tests/Feature/FungsionalEndToEndTest.php - perintah: php artisan test --filter "FungsionalEndToEndTest"', 's', 6);

$judul = ['No', 'Kode', 'Modul', 'Skenario', 'Jenis', 'Langkah pengujian', 'Hasil ekspektasi', 'Status', 'Penguji'];
$susun[] = '';
$baris = 5;
for ($c = 0; $c < count($judul); $c++) {
    $susun[] = keSel($baris, $c + 1, $judul[$c], 's', 2);
}

$baris = 6;
foreach ($hasil as $r) {
    // No, Kode, Modul: idx sesuai kolom; wrap utk skenario/langkah/ekspektasi.
    $susun[] = keSel($baris, 1, $r[0], 's', 4);
    $susun[] = keSel($baris, 2, $r[1], 's', 4);
    $susun[] = keSel($baris, 3, $r[2], 's', 3);
    $susun[] = keSel($baris, 4, $r[3], 's', 3);
    $susun[] = keSel($baris, 5, $r[4], 's', 4);
    $susun[] = keSel($baris, 6, $r[5], 's', 3);
    $susun[] = keSel($baris, 7, $r[6], 's', 3);
    $xsStatus = $r[7] === 'PASS' ? 5 : 5; // id 5 = hijau; bila FAIL genealogi id merah
    if ($r[7] !== 'PASS') {
        $xsStatus = 4;
    }
    $susun[] = keSel($baris, 8, $r[7], 's', $xsStatus);
    $susun[] = keSel($baris, 9, 'Siswa 1 & Siswa 2', 's', 3);
    $baris++;
}

$catatan = $baris + 1;
$susun[] = keSel($catatan, 1, 'Catatan: seluruh skenario dieksekusi otomatis (PHPUnit/Laravel 12) memakai MySQL bbcashvia; setiap uji dibungkus transaksi dan dibatalkan agar data sebenarnya tidak tergelincira.', 's', 6);

$xml = implode("\n", $susun);

$sheetXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    . $kolHtml
    . '<sheetViews><sheetView workbookViewId="0"><pane ySplit="5" topLeftCell="A6" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    . '<sheetData>' . $xml . '</sheetData></worksheet>';

$workbookXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="S3-03 Fungsional" sheetId="1" r:id="rId1"/></sheets></workbook>';

$wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>';

$rootRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>';

$jenis = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="' . TYPE_MAIN . '"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="' . TYPE_SHEET . '"/>
<Override PartName="/xl/styles.xml" ContentType="' . TYPE_STYLES . '"/>
</Types>';

$xlsxPath = DOCS . '/S3-03_Functional_Testing_Report.xlsx';

if (class_exists('ZipArchive')) {
    $zip = new ZipArchive();
    if (file_exists($xlsxPath) && !unlink($xlsxPath)) {
        fwrite(STDERR, 'Tidak dapat menghapus berkas lama: ' . $xlsxPath . PHP_EOL);
        exit(1);
    }
    $buka = $zip->open($xlsxPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
    if ($buka !== true) {
        fwrite(STDERR, 'ZipArchive gagal membuka: ' . $buka . PHP_EOL);
        exit(1);
    }
    $zip->addFromString('[Content_Types].xml', $jenis);
    $zip->addFromString('_rels/.rels', $rootRels);
    $zip->addFromString('xl/workbook.xml', $workbookXml);
    $zip->addFromString('xl/_rels/workbook.xml.rels', $wbRels);
    $zip->addFromString('xl/styles.xml', $stylesXml);
    $zip->addFromString('xl/worksheets/sheet1.xml', $sheetXml);
    $zip->close();
    echo '[OK] xlsx : ', $xlsxPath, PHP_EOL;
} else {
    echo '[SKIP] Ekstensi Zip tidak tersedia; hanya HTML yang dibuat.', PHP_EOL;
}

echo '[OK] html : ', DOCS, '/S3-03_Functional_Testing_Report.html', PHP_EOL;
echo 'Laporan berisi ', count($hasil), ' skenario.', PHP_EOL;
