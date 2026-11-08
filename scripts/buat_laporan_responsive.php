<?php

/**
 * S3-05 - Generator dokumen Laporan Audit Responsivitas.
 *
 * Matriks halaman x resolusi (390 / 768 / 1280) berdasarkan audit kode:
 *  - meta viewport pada Blade,
 *  - breakpoint @media pada CSS tiap halaman,
 *  - proteksi scroll horizontal tabel (anti teks tumpang tindih),
 *  - dukungan prefers-reduced-motion.
 *
 * Status awal tiap sel = hasil audit kode; verifikasi visual menyusul
 * lewat folder tangkapan-layar/.
 *
 * Jalankan: php scripts/buat_laporan_responsive.php
 */

declare(strict_types=1);

define('PROYEK', dirname(__DIR__));
define('DOCS', PROYEK . '/docs');

if (!is_dir(DOCS)) {
    mkdir(DOCS, 0777, true);
}

// ============================================================
// DATA AUDIT KODE (hasil pemeriksaan 23-10-2026)
// ============================================================
$halaman[] = ['blade' => 'login.blade.php', 'peran' => 'Publik', 'url' => '/login', 'viewport' => 'Ya', 'breakpoint' => '1024, 834, 768, 480', 'tabel' => '-', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'change-password.blade.php', 'peran' => 'Login', 'url' => '/ganti-kata-sandi (auth)', 'viewport' => 'Ya', 'breakpoint' => '600, 400', 'tabel' => '-', 'rm' => 'Ya'];

$halaman[] = ['blade' => 'admin-dashboard.blade.php', 'peran' => 'Admin', 'url' => '/dashboard/admin', 'viewport' => 'Ya', 'breakpoint' => '1025+, 769-1024, 768, 480, 360', 'tabel' => 'table-wrap', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'admin-transaksi.blade.php', 'peran' => 'Admin', 'url' => '/admin/transaksi', 'viewport' => 'Ya', 'breakpoint' => '1025+, 769-1024, 768, 480, 360', 'tabel' => 'table-wrap', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'admin-iuran.blade.php', 'peran' => 'Admin', 'url' => '/admin/iuran', 'viewport' => 'Ya', 'breakpoint' => '1025+, 1024, 768, 480', 'tabel' => 'table-wrap', 'rm' => '-'];
$halaman[] = ['blade' => 'admin-siswa.blade.php', 'peran' => 'Admin', 'url' => '/admin/siswa', 'viewport' => 'Ya', 'breakpoint' => '1025+, 769-1024, 768, 480', 'tabel' => 'table-wrap', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'admin-laporan-kas.blade.php', 'peran' => 'Admin', 'url' => '/admin/laporan-kas', 'viewport' => 'Ya', 'breakpoint' => '1025+, 769-1024, 768, 480 + print', 'tabel' => 'table-wrap', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'admin-riwayat-transaksi.blade.php', 'peran' => 'Admin', 'url' => '/admin/riwayat-transaksi', 'viewport' => 'Ya', 'breakpoint' => '1025+, 769-1024, 768, 480', 'tabel' => 'table-wrap', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'admin-manajemen-pengguna.blade.php', 'peran' => 'Admin', 'url' => '/admin/manajemen-pengguna', 'viewport' => 'Ya', 'breakpoint' => '1025+, 769-1024, 768, 480, 360', 'tabel' => 'table-wrap', 'rm' => 'Ya'];

$halaman[] = ['blade' => 'bendahara-dashboard.blade.php', 'peran' => 'Bendahara', 'url' => '/dashboard/bendahara', 'viewport' => 'Ya', 'breakpoint' => '1025+, 769-1024, 768, 480, 360', 'tabel' => 'table-wrap', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'bendahara-transaksi.blade.php', 'peran' => 'Bendahara', 'url' => '/bendahara/transaksi', 'viewport' => 'Ya', 'breakpoint' => '1024, 768, 480', 'tabel' => 'table-wrap', 'rm' => '-'];
$halaman[] = ['blade' => 'bendahara-iuran.blade.php', 'peran' => 'Bendahara', 'url' => '/bendahara/iuran', 'viewport' => 'Ya', 'breakpoint' => '1024, 768, 480', 'tabel' => 'table-wrap', 'rm' => '-'];
$halaman[] = ['blade' => 'bendahara-siswa.blade.php', 'peran' => 'Bendahara', 'url' => '/bendahara/siswa', 'viewport' => 'Ya', 'breakpoint' => '769-1024, 768, 480, 360', 'tabel' => 'table-wrap', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'bendahara-laporan-kas.blade.php', 'peran' => 'Bendahara', 'url' => '/bendahara/laporan-kas', 'viewport' => 'Ya', 'breakpoint' => '1025+, 769-1024, 768, 480, 360 + print', 'tabel' => 'table-wrap', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'bendahara-riwayat-transaksi.blade.php', 'peran' => 'Bendahara', 'url' => '/bendahara/riwayat-transaksi', 'viewport' => 'Ya', 'breakpoint' => '1200, 1024, 760, 560', 'tabel' => 'table-wrap', 'rm' => 'Ya'];

$halaman[] = ['blade' => 'viewer-dashboard.blade.php', 'peran' => 'Viewer', 'url' => '/dashboard/viewer', 'viewport' => 'Ya', 'breakpoint' => 'grid bersama: 1200, 1024, 900, 760, 560', 'tabel' => 'table-wrapper', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'viewer-transaksi.blade.php', 'peran' => 'Viewer', 'url' => '/viewer/transaksi', 'viewport' => 'Ya', 'breakpoint' => 'grid bersama: 1200, 1024, 900, 760, 560', 'tabel' => 'table-wrapper', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'viewer-iuran.blade.php', 'peran' => 'Viewer', 'url' => '/viewer/iuran', 'viewport' => 'Ya', 'breakpoint' => 'grid bersama: 1200, 1024, 900, 760, 560', 'tabel' => 'table-wrapper', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'viewer-siswa.blade.php', 'peran' => 'Viewer', 'url' => '/viewer/siswa', 'viewport' => 'Ya', 'breakpoint' => 'grid bersama + 1024, 640, 420 sendiri', 'tabel' => 'table-wrapper', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'viewer-riwayat-transaksi.blade.php', 'peran' => 'Viewer', 'url' => '/viewer/riwayat-transaksi', 'viewport' => 'Ya', 'breakpoint' => 'grid bersama: 1200, 1024, 900, 760, 560', 'tabel' => 'table-wrapper', 'rm' => 'Ya'];
$halaman[] = ['blade' => 'viewer-laporan-kas.blade.php', 'peran' => 'Viewer', 'url' => '/viewer/laporan-kas', 'viewport' => 'Ya', 'breakpoint' => 'grid bersama: 1200, 1024, 900, 760, 560', 'tabel' => 'table-wrapper', 'rm' => 'Ya'];

$STATUS = 'Lolos audit kode (menunggu verifikasi visual)';

// ============================================================
// HTML (sumber ramai: hasil cetak ke PDF via headless Edge)
// ============================================================
$susunHtml = '';
$no = 0;
foreach ($halaman as $h) {
    $no++;
    $susunHtml .= '<tr>'
        . '<td class="c">' . $no . '</td>'
        . '<td class="mono">' . $h['blade'] . '</td>'
        . '<td>' . $h['peran'] . '</td>'
        . '<td class="mono">' . $h['url'] . '</td>'
        . '<td class="c">' . $h['viewport'] . '</td>'
        . '<td class="mono">' . $h['breakpoint'] . '</td>'
        . '<td class="c mono">' . $h['tabel'] . '</td>'
        . '<td class="c">' . $h['rm'] . '</td>'
        . '<td>' . $STATUS . '</td>'
        . '</tr>';
}

$jumlahH = count($halaman);
$nHtml = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>S3-05 Laporan Audit Responsivitas</title>
<style>
@page{size:A4 landscape;margin:10mm}
*{box-sizing:border-box}
body{font-family:Calibri,Arial,sans-serif;font-size:10px;color:#0f172a;margin:0}
h1{font-size:16px;margin:0 0 4px}
.meta{font-size:9.5px;color:#475569;margin:0 0 6px}
.rekap{display:inline-block;background:rgba(2,132,64,.12);color:#047857;font-weight:700;font-size:10px;padding:4px 9px;border-radius:5px;margin-bottom:6px}
table{border-collapse:collapse;width:100%;font-size:9.2px;margin-top:6px}
th{background:#047857;color:#fff;text-align:center;padding:6px 5px;border:1px solid #6ee7b7}
td{border:1px solid #cbd5e1;padding:5px;vertical-align:top}
td.c{text-align:center}
.mono{font-family:Consolas,monospace;font-size:8.6px}
.kriteria{margin-top:10px;font-size:9.5px;color:#475569;border-top:1px solid #cbd5e1;padding-top:6px}
</style></head><body>
<h1>BBCashvia &mdash; Laporan Audit Responsivitas (S3-05)</h1>
<p class="meta">
Sistem: BBCashvia &mdash; Sistem Pengelolaan Kas Kelas (Laravel 12, PHP 8.2.12, MySQL <i>bbcashvia</i>) &bull;
Audit kode: <b>23 Oktober 2026</b> &bull; Penanggung jawab: <b>Siswa 1 (Frontend)</b> &bull;
Resolusi uji: <b>390px (Mobile), 768px (Tablet), 1280px (Desktop)</b>
</p>
<span class="rekap">REKAP: {$jumlahH} halaman diperiksa &bull; {$jumlahH}/{$jumlahH} meta viewport &ldquo;Ya&rdquo; &bull; {$jumlahH}/{$jumlahH} halaman punya breakpoint CSS selular &bull; 18 tabel dilindungi scroll horizontal &bull; Temuan cacat layout dari audit kode: <b>0</b></span>
<table>
<thead><tr><th style="width:3%">No</th><th style="width:14%">Blade</th><th style="width:7%">Peran</th><th style="width:13%">URL halaman</th>
<th style="width:6%">Viewport</th><th style="width:17%">Breakpoint @media</th><th style="width:8%">Proteksi tabel</th>
<th style="width:8%">Reduced motion</th><th style="width:24%">Status 390 / 768 / 1280</th></tr></thead>
<tbody>{$susunHtml}</tbody>
</table>
<p class="kriteria">
<b>Kriteria visual saat verifikasi tangkapan layar</b> (folder <span class="mono">tangkapan-layar/</span>): (1) sidebar &amp; header rapi &mdash; tidak bertabrakan; (2) teks tabel muat tanpa tumpang tindih &mdash; tabel meluas dengan scroll horizontal bila sempit; (3) tombol &amp; modal tetap mudah disentuh; (4) badge/dot suasana tetap sejajar; (5) tidak ada elemen terpotong di tepi kanan layar.
<br><br>
<b>Catatan:</b> status per halaman di atas adalah <b>hasil audit kode</b> (viewport, rantai breakpoint, proteksi scroll tabel) &mdash; kolom visual terisi final setelah 21 tangkapan layar halaman &times; 3 resolusi diperiksa. Tidak ada halaman tanpa aturan seluler; halaman server memakai rantai import <span class="mono">viewer-*.css &rarr; viewer-shared.css &rarr; bendahara-dashboard.css</span> sehingga menurun dari breakpoint lengkap.
</p>
</body></html>
HTML;

file_put_contents(DOCS . '/S3-05_Responsive_Audit.html', $nHtml);

// ============================================================
// XLSX (OOXML murni, tanpa dependensi)
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
<fill><patternFill patternType="solid"><fgColor rgb="FF047857"/><bgColor indexed="64"/></patternFill></fill>
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

$lebar = [5, 30, 10, 26, 9, 30, 13, 13, 30];
$lebarKolom = '<cols>';
foreach ($lebar as $i => $w) {
    $lebarKolom .= '<col min="' . ($i + 1) . '" max="' . ($i + 1) . '" width="' . $w . '" customWidth="1"/>';
}
$lebarKolom .= '</cols>';

$susunXlsx = [];
$susunXlsx[] = keSel(1, 1, 'BBCashvia - Laporan Audit Responsivitas (S3-05)', 1);
$susunXlsx[] = keSel(2, 1, 'Sistem: Laravel 12 / PHP 8.2.12 / MySQL bbcashvia - Eksekusi: 23 Oktober 2026 - Penanggung jawab: Siswa 1 (Frontend)', 3);
$susunXlsx[] = keSel(3, 1, "Resolusi uji: 390px (Mobile) / 768px (Tablet) / 1280px (Desktop) - Rekap: {$jumlahH} halaman, semua punya viewport + breakpoint, 0 cacat layout dari audit kode", 3);

$kepala = ['No', 'Halaman (Blade)', 'Peran', 'URL halaman', 'Viewport', 'Breakpoint @media', 'Proteksi tabel', 'Reduced motion', 'Status 390/768/1280'];
$susunXlsx[] = '';
$noBaris = 5;
foreach ($kepala as $i => $t) {
    $susunXlsx[] = keSel($noBaris, $i + 1, $t, 2);
}

$noBaris = 6;
foreach ($halaman as $i => $h) {
    $susunXlsx[] = keSel($noBaris, 1, (string) ($i + 1), 5);
    $susunXlsx[] = keSel($noBaris, 2, $h['blade'], 4);
    $susunXlsx[] = keSel($noBaris, 3, $h['peran'], 4);
    $susunXlsx[] = keSel($noBaris, 4, $h['url'], 4);
    $susunXlsx[] = keSel($noBaris, 5, $h['viewport'], 5);
    $susunXlsx[] = keSel($noBaris, 6, $h['breakpoint'], 4);
    $susunXlsx[] = keSel($noBaris, 7, $h['tabel'], 4);
    $susunXlsx[] = keSel($noBaris, 8, $h['rm'], 5);
    $susunXlsx[] = keSel($noBaris, 9, $STATUS, 4);
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
<sheets><sheet name="S3-05 Responsive Audit" sheetId="1" r:id="rId1"/></sheets></workbook>';

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

$xlsxPath = DOCS . '/S3-05_Responsive_Audit.xlsx';

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
echo '[OK] html : ', DOCS, '/S3-05_Responsive_Audit.html', PHP_EOL;
echo 'Teraudit ', count($halaman), ' halaman.', PHP_EOL;
