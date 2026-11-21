<?php

namespace App\Support;

use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

/**
 * Berkas Excel BBCashvia untuk import pengguna dan pembagian akun.
 *
 * Seluruh berkas dibuat di memori (tidak ditulis ke storage), sehingga
 * password awal tidak pernah tersimpan di server maupun database.
 */
class BerkasAkun
{
    /** Kolom yang diterima saat import pengguna. */
    public const KOLOM_IMPORT = [
        'Nama',
        'Email',
        'NIS / NISN',
        'Peran',
        'Jenis Viewer',
        'Kelas',
        'Jenis Kelamin',
        'No HP',
    ];

    /** Kolom berkas akun yang diunduh Admin. */
    public const KOLOM_AKUN = [
        'Nama Pengguna',
        'Email/Gmail',
        'Kelas',
        'Role',
        'Password Awal',
    ];

    public const PERINGATAN = 'RAHASIA: File ini berisi password awal. Bagikan hanya kepada pemilik akun masing-masing melalui kanal aman. Password tidak dapat diambil kembali dari database.';

    /** Template XLSX siap diisi Admin. */
    public static function template(): string
    {
        $buku = new Spreadsheet();
        $lembar = $buku->getActiveSheet();
        $lembar->setTitle('Template Pengguna');

        $contoh = [
            self::KOLOM_IMPORT,
            [
                'Budi Santoso',
                'budi@sekolah.sch.id',
                '12345678',
                'viewer',
                'siswa',
                'XI RPL',
                'L',
                '081200000001',
            ],
            [
                'Siti Wali',
                'siti@sekolah.sch.id',
                '',
                'viewer',
                'wali_kelas',
                'XI RPL',
                'P',
                '',
            ],
        ];

        $lembar->fromArray($contoh, null, 'A1');
        self::cantikkan($lembar, count(self::KOLOM_IMPORT), count($contoh));

        foreach (range('A', 'H') as $kolom) {
            $lembar->getColumnDimension($kolom)->setWidth(24);
        }

        $petunjuk = $buku->createSheet();
        $petunjuk->setTitle('Petunjuk');
        $petunjuk->fromArray([
            ['PANDUAN IMPORT PENGGUNA BBCASHVIA'],
            [''],
            ['1. Isi data pada sheet "Template Pengguna". Baris pertama adalah judul kolom, jangan diubah.'],
            ['2. Peran yang diterima: admin, bendahara, viewer (huruf kecil disarankan).'],
            ['3. Jenis Viewer: siswa atau wali_kelas. Bendahara otomatis menjadi siswa; Admin tidak memakai jenis viewer.'],
            ['4. Kolom NIS / NISN wajib diisi (maksimal 11 karakter) untuk Bendahara dan Viewer Siswa. NIS baru otomatis dibuatkan Data Siswa, lalu akun ditautkan; NIS yang sudah ada otomatis terdeteksi.'],
            ['5. Pilih kelas terlebih dahulu pada form import bila ingin mengisi seluruh baris sekaligus. Jika kolom Kelas diisi, namanya harus sama dengan kelas yang dipilih.'],
            ['6. Yang masuk ke Data Siswa HANYA: NIS/NISN, Kelas, Nama, Jenis Kelamin (L/P disimpan sebagai Laki-Laki/Perempuan), dan No HP. Status Aktif diisi otomatis oleh sistem. Email, peran, dan password tetap hanya untuk Manajemen Pengguna.'],
            ['7. Maksimal 200 baris per berkas. Format yang didukung: .xlsx, .xls, dan .csv.'],
            ['8. DOCX tidak didukung karena bukan format tabular; simpan tabel tersebut sebagai Excel atau CSV terlebih dahulu.'],
            ['9. Setiap akun mendapat password awal otomatis dan wajib menggantinya saat login pertama.'],
            ['10. Sebaliknya, nama dan kelas akun selalu mengikuti Data Siswa yang tertaut; email, peran, dan password tidak pernah ditulis ke Data Siswa.'],
            [''],
            [self::PERINGATAN],
        ], null, 'A1');

        $petunjuk->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $petunjuk->getStyle('A13')->getFont()->setBold(true);
        $petunjuk->getColumnDimension('A')->setWidth(120);
        $petunjuk->getStyle('A')->getAlignment()->setWrapText(true);

        return self::keluaran($buku);
    }

    /**
     * Buat XLSX berisi akun hasil pembuatan/import.
     *
     * @param  array<int, array<string, mixed>>  $akun
     */
    public static function akun(array $akun): string
    {
        $buku = new Spreadsheet();
        $lembar = $buku->getActiveSheet();
        $lembar->setTitle('Akun Pengguna');

        $baris = [self::KOLOM_AKUN];

        foreach ($akun as $item) {
            $baris[] = [
                (string) ($item['nama'] ?? ''),
                (string) ($item['email'] ?? ''),
                (string) ($item['kelas'] ?? 'Semua Kelas'),
                (string) ($item['peran'] ?? ''),
                (string) ($item['password'] ?? ''),
            ];
        }

        $lembar->fromArray($baris, null, 'A1');
        self::cantikkan($lembar, count(self::KOLOM_AKUN), count($baris));

        foreach (range('A', 'E') as $kolom) {
            $lembar->getColumnDimension($kolom)->setWidth(28);
        }

        // Password ditulis sebagai teks murni agar tidak dianggap rumus.
        foreach ($baris as $indeks => $item) {
            if ($indeks === 0) {
                continue;
            }

            $lembar->setCellValueExplicit(
                'E' . ($indeks + 1),
                (string) $item[4],
                DataType::TYPE_STRING
            );
        }

        $peringatan = $buku->createSheet();
        $peringatan->setTitle('Peringatan');
        $peringatan->setCellValue('A1', 'INFORMASI LOGIN RAHASIA');
        $peringatan->setCellValue('A3', self::PERINGATAN);
        $peringatan->setCellValue('A5', 'Password awal hanya ditampilkan pada proses pembuatan akun. Admin tidak dapat mengambilnya kembali dari database.');
        $peringatan->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $peringatan->getStyle('A3')->getFont()->setBold(true);
        $peringatan->getColumnDimension('A')->setWidth(120);
        $peringatan->getStyle('A')->getAlignment()->setWrapText(true);

        return self::keluaran($buku);
    }

    /** Header tampilan, lebar, dan filter pada baris judul. */
    private static function cantikkan($lembar, int $jumlahKolom, int $jumlahBaris): void
    {
        $akhirKolom = self::hurufKolom($jumlahKolom);

        $lembar->getStyle("A1:{$akhirKolom}1")
            ->getFont()
            ->setBold(true)
            ->getColor()
            ->setARGB('FFFFFFFF');

        $lembar->getStyle("A1:{$akhirKolom}1")
            ->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()
            ->setARGB('FF2BA19E');

        $lembar->getStyle("A1:{$akhirKolom}1")
            ->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $lembar->getRowDimension(1)->setRowHeight(24);
        $lembar->freezePane('A2');

        if ($jumlahBaris > 1) {
            $lembar->setAutoFilter("A1:{$akhirKolom}{$jumlahBaris}");
        }
    }

    private static function hurufKolom(int $nomor): string
    {
        return \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($nomor);
    }

    private static function keluaran(Spreadsheet $buku): string
    {
        ob_start();
        (new Xlsx($buku))->save('php://output');

        return (string) ob_get_clean();
    }
}
