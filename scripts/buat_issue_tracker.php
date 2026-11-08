<?php

/**
 * S3-04 - Generator dokumen Issue Tracker.
 *
 * Mencatat setiap temuan cacat/kegagalan uji beserta patch-nya.
 * Menghasilkan:
 *  - docs/S3-04_Issue_Tracker.xlsx  (OOXML murni, tanpa dependensi)
 *  - docs/S3-04_Issue_Tracker.html  (sumber cetak PDF via Edge)
 *
 * Jalankan:  php scripts/buat_issue_tracker.php
 */

declare(strict_types=1);

define('PROYEK', dirname(__DIR__));
define('DOCS', PROYEK . '/docs');

if (!is_dir(DOCS)) {
    mkdir(DOCS, 0777, true);
}

// ============================================================
// DAFTAR TEMUAN (STATUS SIKLUS: Open > Fixed > Verified)
// ============================================================
$temuan[] = [
    'ID' => 'ISS-01',
    'Tanggal' => '22-10-2026',
    'Sumber' => 'S3-03 Functional Testing (UJF-16)',
    'Berkas' => 'config/filesystems.php',
    'Deskripsi' => 'Unduh bukti/nota via URL /storage/* selalu 403. Penyaji berkas Laravel hanya terdaftar untuk disk "local" (privat); disk "public" tidak bertanda serve sehingga /storage diarahkan ke disk privat dan digagalkan.',
    'Prioritas' => 'Tinggi',
    'Reproduksi' => 'Unggah transaksi dengan lampiran bukti, lalu unduh /storage/bukti-transaksi/... => 403 Forbidden.',
    'Patch' => "Tambah 'serve' => true pada disk \"public\" sehingga penyaji /storage memakai disk publik.",
    'Status' => 'Fixed & Verified',
    'Verifikasi' => 'UJF-16 lulus (isi berkas unduhan identik dengan lampiran) & UJF-17 lulus (404 kustom).',
];

$temuan[] = [
    'ID' => 'ISS-02',
    'Tanggal' => '23-10-2026',
    'Sumber' => 'Test regesi PesanKosongTest gagal',
    'Berkas' => 'resources/css/viewer-{siswa,iuran,transaksi,laporan-kas,dashboard,riwayat-transaksi}.css',
    'Deskripsi' => 'Guard [hidden]{display:none !important} hilang pada keenam CSS halaman viewer. Bug "pesan kosong selalu tampil" pernah diperbaiki di admin/bendahara, tetapi halaman viewer terlewat.',
    'Prioritas' => 'Sedang',
    'Reproduksi' => 'Jalankan PesanKosongTest => gagal pada regex guard untuk berkas viewer.',
    'Patch' => 'Tambah blok guard [hidden] di akhir keenam berkas CSS viewer (aditif, tanpa mengubah desain halaman).',
    'Status' => 'Fixed & Verified',
    'Verifikasi' => 'PesanKosongTest 4/4 lulus.',
];

$temuan[] = [
    'ID' => 'ISS-03',
    'Tanggal' => '23-10-2026',
    'Sumber' => 'Test regesi FilterLaporanKasTest gagal',
    'Berkas' => 'resources/js/viewer-laporan-kas.js',
    'Deskripsi' => 'Fallback pembacaan select periode memakai string kosong "" (rapuh), tidak konsisten dengan konvensi kode `|| "all"` pada filter status. Tanpa penanganan bila belum ada periode terpilih.',
    'Prioritas' => 'Rendah',
    'Reproduksi' => "Jalankan FilterLaporanKasTest => pola 'periodFilter?.value || \"all\"' tidak ditemukan.",
    'Patch' => "Fallback menjadi 'all'; saat \"all\" tampilkan periode terbaru bila tersedia, selain itu tetap aman (pesan kosong).",
    'Status' => 'Fixed & Verified',
    'Verifikasi' => 'FilterLaporanKasTest 4/4 lulus.',
];

$temuan[] = [
    'ID' => 'ISS-04',
    'Tanggal' => '23-10-2026',
    'Sumber' => 'Pengamatan saat eksekusi UJF-16',
    'Berkas' => 'Penyaji /storage Laravel (Laravel 12)',
    'Deskripsi' => 'Temuan keamanan: berkas bukti dapat dibuka TANPA login lewat URL publik /storage/*. Risiko rendah (data internal kelas, nama berkas acak), namun layak ditindaklanjuti.',
    'Prioritas' => 'Rendah',
    'Reproduksi' => 'Buka URL bukti tanpa sesi login => respons 200.',
    'Patch' => '(Rekomendasi) percobaan: URL bertanda tangan (signed URL) atau middleware auth pada penyaji - dijadwalkan sprint berikutnya.',
    'Status' => 'Open (dipantau)',
    'Verifikasi' => 'Belum; tindak lanjut sprint berikutnya.',
];

$temuan[] = [
    'ID' => 'ISS-05',
    'Tanggal' => '22-10-2026',
    'Sumber' => 'Persiapan menjalankan pengujian',
    'Berkas' => 'phpunit.xml',
    'Deskripsi' => 'Koneksi pengujian default (sqlite :memory:) tidak kompatibel dengan sebagian migrasi MySQL (tipe kolom dsb.), sehingga suite gagal bila dijalankan apa adanya.',
    'Prioritas' => 'Rendah',
    'Reproduksi' => 'php artisan test tanpa override env => galat pada migrasi.',
    'Patch' => 'Keputusan tim: memakai koneksi MySQL bbcashvia via environment saat menjalankan pengujian (didokumentasikan di README folder dokumen).',
    'Status' => "Won't Fix (keputusan)",
    'Verifikasi' => 'Suite penuh 159 lulus memakai env MySQL.',
];

$temuan[] = [
    'ID' => 'ISS-06',
    'Tanggal' => '23-10-2026',
    'Sumber' => 'Uji manual Admin Iuran + verifikasi skema/data',
    'Berkas' => 'resources/js/admin-iuran.js',
    'Deskripsi' => 'Kategori iuran tidak muncul pada daftar, form edit, dan modal detail. Akar: normalisasiIuran() memindahkan item.kategori ke properti "frekuensi", sementara render membaca item.kategori (undefined => "-"). Data di database sebenarnya benar (kolom enum kategori terisi).',
    'Prioritas' => 'Tinggi',
    'Reproduksi' => 'Tambah iuran dengan kategori Mingguan, muat ulang halaman => kolom Kategori tetap "-".',
    'Patch' => 'normalisasiIuran() kini menyimpan kategori dari database apa adanya (alias frekuensi dihapus); badge daftar, filter, form edit, dan modal detail membaca nilai asli.',
    'Status' => 'Fixed & Verified',
    'Verifikasi' => 'IuranKategoriCrudTest 6/6 lulus (kategori tersimpan & tampil setelah muat ulang); suite penuh 165 lulus.',
];

$temuan[] = [
    'ID' => 'ISS-07',
    'Tanggal' => '23-10-2026',
    'Sumber' => 'Uji manual Admin Iuran (penghapusan gagal)',
    'Berkas' => 'resources/js/admin-iuran.js + resources/js/bendahara-iuran.js',
    'Deskripsi' => 'Hapus iuran selalu gagal 419: requestAPI hanya mengirim header X-CSRF-TOKEN pada request bermuatan, sedangkan DELETE tanpa badan juga ditolak middleware CSRF sebagai token mismatch.',
    'Prioritas' => 'Tinggi',
    'Reproduksi' => 'Klik ikon hapus pada daftar iuran Admin => 419 / "Gagal menghapus".',
    'Patch' => 'Token CSRF kini dikirim untuk SEMUA metode tulis (POST/PUT/DELETE); error 419 ditampilkan sebagai pesan yang mudah dipahami (muat ulang halaman, coba lagi) - middleware CSRF tetap aktif.',
    'Status' => 'Fixed & Verified',
    'Verifikasi' => 'Skenario hapus (berhasil & 409 terlindung) dalam IuranKategoriCrudTest lulus 6/6.',
];

$temuan[] = [
    'ID' => 'ISS-08',
    'Tanggal' => '23-10-2026',
    'Sumber' => 'Pemeriksaan paritas UI Admin vs Bendahara (butir 4 S3-04)',
    'Berkas' => 'resources/js/bendahara-iuran.js, resources/views/bendahara-iuran.blade.php, resources/css/bendahara-iuran.css',
    'Deskripsi' => 'Halaman Iuran Bendahara tidak konsisten dengan Admin: tidak ada tombol/modal hapus (padahal rute mengizinkan), kategori dikonversi paksa ke "sekali bayar" bila kosong, dan badge status "selesai" memakai gaya "nonaktif".',
    'Prioritas' => 'Sedang',
    'Reproduksi' => 'Buka /bendahara/iuran => baris hanya beraksi Detail & Edit.',
    'Patch' => 'Ditambahkan tombol hapus + modal konfirmasi bergaya Admin (komponen modal__dialog--small, btn--danger, icon-btn--danger, delete-box ditambahkan ke CSS bendahara); kategori ditampilkan apa adanya dari tabel; badge status memakai gaya "selesai".',
    'Status' => 'Fixed & Verified',
    'Verifikasi' => 'IuranKategoriCrudTest skenario bendahara (anti-IDOR hapus kelas lain => 404) lulus; kedua JS tervalidasi node --check.',
];

// ============================================================
// HTML (untuk PDF)
// ============================================================
$colMap = ['ID', 'Tanggal', 'Sumber', 'Berkas', 'Deskripsi', 'Prioritas', 'Reproduksi', 'Patch', 'Status', 'Verifikasi'];
$susunHtml = '';
$warnaStatus = [
    'Fixed & Verified' => '#047857',
    'Open (dipantau)' => '#b45309',
    "Won't Fix (keputusan)" => '#475569',
];
foreach ($temuan as $t) {
    $sel = fn (string $kolom): string => htmlspecialchars((string) $t[$kolom], ENT_XML1, 'UTF-8');
    $warna = $warnaStatus[$t['Status']] ?? '#0f172a';
    $susunHtml .= '<tr>'
        . '<td class="c"><b>' . $sel('ID') . '</b></td>'
        . '<td class="c">' . $sel('Tanggal') . '</td>'
        . '<td>' . $sel('Sumber') . '</td>'
        . '<td class="mono">' . $sel('Berkas') . '</td>'
        . '<td>' . $sel('Deskripsi') . '</td>'
        . '<td class="c">' . $sel('Prioritas') . '</td>'
        . '<td>' . $sel('Reproduksi') . '</td>'
        . '<td>' . $sel('Patch') . '</td>'
        . '<td class="c" style="color:' . $warna . ';font-weight:700">' . $sel('Status') . '</td>'
        . '<td>' . $sel('Verifikasi') . '</td>'
        . '</tr>';
}

$html = '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">
<title>S3-04 Issue Tracker - BBCashvia</title>
<style>
@page { size: A4 landscape; margin: 10mm; }
body{font-family:"Segoe UI",Arial,sans-serif;color:#0f172a;margin:18px}
h1{font-size:18px;margin:0 0 4px}
.meta{color:#475569;font-size:10.5px;line-height:1.5}
.rekap{display:inline-block;background:#eef2ff;border:1px solid #c7d2fe;color:#3730a3;font-weight:700;font-size:11px;padding:5px 12px;border-radius:8px;margin:8px 0 2px}
table{border-collapse:collapse;width:100%;font-size:9.2px;margin-top:8px}
th{background:#4338ca;color:#fff;text-align:center;padding:6px 5px;border:1px solid #c7d2fe}
td{border:1px solid #cbd5e1;padding:5px;vertical-align:top}
td.c{text-align:center}.mono{font-family:Consolas,monospace;font-size:8.6px}
.catatan{margin-top:10px;font-size:9.5px;color:#475569;border-top:1px solid #cbd5e1;padding-top:6px}
</style></head><body>
<h1>BBCashvia - Issue Tracker (S3-04: Bug Fixing &amp; Issue Resolution)</h1>
<p class="meta">
Sistem: BBCashvia - Sistem Pengelolaan Kas Kelas (Laravel 12, PHP 8.2.12, MySQL <i>bbcashvia</i>) &bull;
Eksekusi: <b>23 Oktober 2026</b> &bull; Penanggung jawab: <b>Siswa 1 &amp; Siswa 2</b><br>
Siklus temuan: <b>Open &rarr; In Progress &rarr; Fixed &rarr; Verified</b> &mdash; setiap patch diverifikasi ulang dengan PHPUnit.
</p>
<span class="rekap">REKAP: 8 temuan &bull; 6 Fixed &amp; Verified &bull; 1 Open (direncanakan) &bull; 1 Won&apos;t Fix &bull; Suite penuh 165 passed / 0 failed</span>
<table>
<thead><tr><th style="width:5%">ID</th><th style="width:6%">Tanggal</th><th style="width:11%">Sumber temuan</th>
<th style="width:13%">Berkas</th><th style="width:19%">Deskripsi cacat</th><th style="width:5%">Skala</th>
<th style="width:14%">Langkah reproduksi</th><th style="width:15%">Perbaikan (patch)</th>
<th style="width:7%">Status</th><th style="width:13%">Verifikasi</th></tr></thead>
<tbody>' . $susunHtml . '</tbody></table>
<p class="catatan">Semua patch diterapkan minimal (tidak mengubah perilaku yang diandalkan antarmuka lain) dan diverifikasi
dengan regresi PHPUnit penuh: <b>165 passed / 0 failed (822 assertions)</b> &mdash; termasuk 20 skenario fungsional
S3-03 dan 6 regensi cacat iuran baru (IuranKategoriCrudTest). Detail langkah pengujian ikut tercantum di laporan
S3-03_Functional_Testing_Report.</p>
</body></html>';

file_put_contents(DOCS . '/S3-04_Issue_Tracker.html', $html);

// ============================================================
// XLSX (OOXML murni)
// ============================================================
define('TYPE_MAIN', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml');
define('TYPE_SHEET', 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml');
define('TYPE_STYLES', 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml');

function esc(string $nilai): string
{
    return htmlspecialchars($nilai, ENT_XML1, 'UTF-8');
}

function kolom(int $i): string
{
    $idKolom = '';
    while ($i > 0) {
        $sisa = ($i - 1) % 26;
        $idKolom = chr(65 + $sisa) . $idKolom;
        $i = intdiv($i - 1, 26);
    }

    return $idKolom;
}

function keSel(int $barisKe, int $kolKe, string $nilai, int $styleId): string
{
    $ref = kolom($kolKe) . $barisKe;

    return '<c r="' . $ref . '" t="inlineStr" s="' . $styleId
        . '"><is><t xml:space="preserve">' . esc($nilai) . '</t></is></c>';
}

$stylesXml = <<<'XML'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4">
<font><sz val="10"/><name val="Calibri"/></font>
<font><b/><color rgb="FFFFFFFF"/><sz val="10"/><name val="Calibri"/></font>
<font><b/><sz val="13"/><name val="Calibri"/></font>
<font><b/><color rgb="FF047857"/><sz val="10"/><name val="Calibri"/></font>
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
<cellXfs count="6">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="2" borderId="1" xfId="0" applyFill="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top" wrapText="1"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>
XML;

$lebar = [8, 11, 18, 26, 44, 9, 30, 34, 15, 26];
$lebarKolom = '<cols>';
foreach ($lebar as $i => $w) {
    $lebarKolom .= '<col min="' . ($i + 1) . '" max="' . ($i + 1) . '" width="' . $w . '" customWidth="1"/>';
}
$lebarKolom .= '</cols>';

$susunXlsx = [];
$susunXlsx[] = keSel(1, 1, 'BBCashvia - Issue Tracker (S3-04: Bug Fixing & Issue Resolution)', 1);
$susunXlsx[] = keSel(2, 1, 'Sistem: Laravel 12 / PHP 8.2.12 / MySQL bbcashvia - Eksekusi: 23 Oktober 2026 - Penanggung jawab: Siswa 1 & Siswa 2', 3);
$susunXlsx[] = keSel(3, 1, 'Siklus: Open > In Progress > Fixed > Verified - Rekap: 8 temuan | 6 Fixed & Verified | 1 Open | 1 Won\'t Fix | Suite penuh: 165 passed / 0 failed', 3);

$kepala = ['ID', 'Tanggal', 'Sumber temuan', 'Berkas', 'Deskripsi cacat', 'Skala', 'Langkah reproduksi', 'Perbaikan (patch)', 'Status', 'Verifikasi'];
$susunXlsx[] = '';
$noBaris = 5;
foreach ($kepala as $i => $t) {
    $susunXlsx[] = keSel($noBaris, $i + 1, $t, 2);
}

$noBaris = 6;
foreach ($temuan as $t) {
    $susunXlsx[] = keSel($noBaris, 1, $t['ID'], 4);
    $susunXlsx[] = keSel($noBaris, 2, $t['Tanggal'], 4);
    $susunXlsx[] = keSel($noBaris, 3, $t['Sumber'], 3);
    $susunXlsx[] = keSel($noBaris, 4, $t['Berkas'], 3);
    $susunXlsx[] = keSel($noBaris, 5, $t['Deskripsi'], 3);
    $susunXlsx[] = keSel($noBaris, 6, $t['Prioritas'], 4);
    $susunXlsx[] = keSel($noBaris, 7, $t['Reproduksi'], 3);
    $susunXlsx[] = keSel($noBaris, 8, $t['Patch'], 3);
    $susunXlsx[] = keSel($noBaris, 9, $t['Status'],
        $t['Status'] === 'Fixed & Verified' ? 5 : 4);
    $susunXlsx[] = keSel($noBaris, 10, $t['Verifikasi'], 3);
    $noBaris++;
}

$xmlBaris = implode("\n", $susunXlsx);

$sheetXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    . $lebarKolom
    . '<sheetViews><sheetView workbookViewId="0"><pane ySplit="5" topLeftCell="A6" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    . '<sheetData>' . $xmlBaris . '</sheetData></worksheet>';

$workbookXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="S3-04 Issue Tracker" sheetId="1" r:id="rId1"/></sheets></workbook>';

$wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>';

$rootRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>';

$jeniskumpulan = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="' . TYPE_MAIN . '"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="' . TYPE_SHEET . '"/>
<Override PartName="/xl/styles.xml" ContentType="' . TYPE_STYLES . '"/>
</Types>';

$xlsxPath = DOCS . '/S3-04_Issue_Tracker.xlsx';

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
$zip->addFromString('[Content_Types].xml', $jeniskumpulan);
$zip->addFromString('_rels/.rels', $rootRels);
$zip->addFromString('xl/workbook.xml', $workbookXml);
$zip->addFromString('xl/_rels/workbook.xml.rels', $wbRels);
$zip->addFromString('xl/styles.xml', $stylesXml);
$zip->addFromString('xl/worksheets/sheet1.xml', $sheetXml);
$zip->close();

echo '[OK] xlsx : ', $xlsxPath, PHP_EOL;
echo '[OK] html : ', DOCS, '/S3-04_Issue_Tracker.html', PHP_EOL;
echo 'Tercatat ', count($temuan), ' temuan cacat.', PHP_EOL;
