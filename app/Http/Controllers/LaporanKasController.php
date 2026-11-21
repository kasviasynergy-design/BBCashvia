<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\MembatasiKelas;
use App\Http\Controllers\Concerns\MenghitungSaldoKas;
use App\Models\Transaksi;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;

/**
 * Laporan kas BBCashvia untuk dicetak / diunduh sebagai PDF.
 *
 * Seluruh angka berasal dari tabel `transaksi` nyata dan dibatasi oleh
 * hak akses kelas pengguna. Tidak ada data contoh/dummy.
 */
class LaporanKasController extends Controller
{
    use MembatasiKelas;
    use MenghitungSaldoKas;

    /** Halaman laporan siap cetak (browser). */
    public function cetak(Request $request)
    {
        return view('laporan-kas-cetak', $this->dataLaporan($request));
    }

    /** Unduh laporan yang sama sebagai PDF. */
    public function pdf(Request $request)
    {
        $data = $this->dataLaporan($request, true);
        $html = view('laporan-kas-cetak', $data)->render();

        $opsi = new Options();
        $opsi->set('defaultFont', 'helvetica');
        $opsi->set('isRemoteEnabled', false);
        $opsi->set('isPhpEnabled', false);

        $dompdf = new Dompdf($opsi);
        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $namaFile = 'laporan-kas-' . ($data['id_kelas_nama'] === 'Semua Kelas'
            ? 'semua-kelas'
            : preg_replace('/[^A-Za-z0-9]+/', '-', (string) $data['id_kelas_nama']))
            . '-' . date('Ymd-His') . '.pdf';

        return response($dompdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header(
                'Content-Disposition',
                'attachment; filename="' . $namaFile . '"'
            )
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    /**
     * Susun data laporan dari database dengan filter yang sama persis
     * seperti halaman riwayat/laporan kas.
     *
     * @return array<string, mixed>
     */
    private function dataLaporan(Request $request, bool $untukPdf = false): array
    {
        // Filter kelas hanya berlaku untuk Admin. Panggil dulu supaya
        // Bendahara/Viewer yang mengirim id_kelas tidak mendapat 422.
        $this->validasiFilterKelasAdmin($request);

        $request->validate([
            'dari' => ['nullable', 'date'],
            'sampai' => ['nullable', 'date', 'after_or_equal:dari'],
        ], [
            'sampai.after_or_equal' => 'Tanggal akhir tidak boleh sebelum tanggal mulai.',
        ]);

        $query = $this->transaksiTerbatas($request);

        if ($request->filled('dari')) {
            $query->whereDate('tanggal', '>=', $request->input('dari'));
        }

        if ($request->filled('sampai')) {
            $query->whereDate('tanggal', '<=', $request->input('sampai'));
        }

        $namaKelas = 'Semua Kelas';

        if ($request->user()?->aksesSemuaKelas()) {
            if (!$this->tanpaFilterKelas($request)) {
                $idKelas = (int) $request->input('id_kelas');
                $namaKelas = (string) (
                    \App\Models\Kelas::where('id_kelas', $idKelas)
                        ->value('nama_kelas') ?? 'Semua Kelas'
                );
            }
        } else {
            $namaKelas = (string) (
                \App\Models\Kelas::where('id_kelas', $request->user()?->id_kelas)
                    ->value('nama_kelas') ?? 'Kelas Saya'
            );
        }

        // Satu-satunya tempat yang menyaring query berdasarkan pilihan
        // kelas Admin. Non-admin tetap dibatasi transaksiTerbatas().
        $this->terapkanFilterKelasAdmin($request, $query);

        $ringkasan = $this->ringkasanSaldo(clone $query);

        $transaksi = (clone $query)
            ->with([
                'iuran:id_iuran,nama_iuran',
                'siswa:id_siswa,nis,nama_siswa',
                'kelas:id_kelas,nama_kelas',
                'user:id_users,name',
                'detailTransaksis:id_detail,id_transaksi,id_iuran,nama_iuran,nominal',
            ])
            ->orderBy('tanggal')
            ->orderBy('id_transaksi')
            ->get();

        $kelompok = $transaksi->groupBy('no_bukti');

        $rincianTransaksi = $transaksi
            ->map(function (Transaksi $t) use ($kelompok) {
                $anggota = $kelompok->get($t->no_bukti, collect());

                return [
                    'tanggal' => $t->tanggal?->format('d/m/Y') ?? '-',
                    'no_bukti' => $t->no_bukti,
                    'keterangan' => $t->keterangan ?: ($t->kategori ?: '-'),
                    'kategori' => $t->kategori ?: '-',
                    'jenis' => strtolower((string) $t->jenis),
                    'nominal' => (float) $anggota->sum('nominal'),
                    'nama_siswa' => $t->siswa?->nama_siswa ?: ($t->nama_pembayar ?: '-'),
                    'nis' => $t->siswa?->nis,
                    'nama_kelas' => $t->kelas?->nama_kelas ?? '-',
                    'dicatat_oleh' => $t->nama_petugas
                        ?: ($t->user?->name ?: ($t->pic ?: '-')),
                    'rincian' => $anggota
                        ->flatMap(fn (Transaksi $item) => $item->detailTransaksis)
                        ->map(fn ($d) => [
                            'nama_iuran' => $d->nama_iuran,
                            'nominal' => (float) $d->nominal,
                        ])
                        ->values()
                        ->all(),
                ];
            })
            ->values()
            ->all();

        $dari = $request->input('dari');
        $sampai = $request->input('sampai');

        if ($dari || $sampai) {
            $periode = ($dari ? $this->formatTanggal($dari) : 'Awal')
                . ' s/d '
                . ($sampai ? $this->formatTanggal($sampai) : 'Hari ini');
        } else {
            $periode = 'Seluruh periode yang tercatat';
        }

        /*
         * Dompdf membutuhkan ekstensi GD untuk menyisipkan PNG. Karena GD
         * tidak tersedia di beberapa lingkungan, PDF memakai versi JPEG dari
         * logo yang sama. Halaman cetak browser tetap memakai PNG asli.
         */
        $logoPath = public_path(
            $untukPdf
                ? 'image/Logo BBCashvia.pdf.jpg'
                : 'image/Logo BBCashvia.png'
        );

        if ($untukPdf && !file_exists($logoPath)) {
            $logoPath = public_path('image/Logo BBCashvia.png');
        }

        $logo = file_exists($logoPath)
            ? 'data:image/'
                . (str_ends_with(strtolower($logoPath), '.jpg') ? 'jpeg' : 'png')
                . ';base64,' . base64_encode((string) file_get_contents($logoPath))
            : null;

        return [
            'namaAplikasi' => 'BBCashvia',
            'tagline' => 'KASVIA Synergy',
            'logo' => $logo,
            'judul' => 'Laporan Kas Kelas',
            'id_kelas_nama' => $namaKelas,
            'periode' => $periode,
            'rincian_transaksi' => $rincianTransaksi,
            'ringkasan' => $ringkasan,
            'tanggal_cetak' => now()->setTimezone('Asia/Jakarta')
                ->format('d/m/Y H:i') . ' WIB',
            'nama_petugas' => $request->user()?->name ?? '-',
            'mode_pdf' => $untukPdf || $request->boolean('pdf'),
        ];
    }

    private function formatTanggal(string $tanggal): string
    {
        $waktu = strtotime($tanggal);

        return $waktu === false
            ? $tanggal
            : date('d/m/Y', $waktu);
    }
}
