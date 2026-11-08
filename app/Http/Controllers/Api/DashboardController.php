<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\MembatasiKelas;
use App\Http\Controllers\Concerns\MenghitungSaldoKas;
use App\Http\Controllers\Controller;
use App\Models\Iuran;
use App\Models\Transaksi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use MembatasiKelas;
    use MenghitungSaldoKas;

    /**
     * Ringkasan statistik dashboard.
     *
     * Admin melihat seluruh kelas; bendahara & viewer hanya kelasnya.
     */
    public function index(Request $request): JsonResponse
    {
        $siswaQuery = $this->siswaTerbatas($request);
        $transaksiQuery = fn () => $this->transaksiTerbatas($request);

        $siswaCount = (clone $siswaQuery)->count();

        // Target iuran dihitung dari iuran aktif yang berlaku untuk
        // siswa, bukan angka tetap 250.000. Iuran global (id_kelas
        // NULL) hanya dihitung untuk admin yang melihat semua kelas.
        $idKelas = $this->kelasDibatasi($request);

        $siswaAktif = (clone $siswaQuery)
            ->where('status', 'Aktif')
            ->get(['id_siswa', 'id_kelas']);

        $iuranAktif = Iuran::query()
            ->whereRaw('LOWER(status) = ?', ['aktif'])
            ->when($idKelas !== null, fn ($q) => $q->where('id_kelas', $idKelas))
            ->get(['id_iuran', 'id_kelas', 'nominal']);

        $pembayaran = DB::table('transaksi')
            ->where('jenis', Transaksi::JENIS_MASUK)
            ->whereNotNull('id_siswa')
            ->whereNotNull('id_iuran')
            ->whereIn('id_siswa', $siswaAktif->pluck('id_siswa'))
            ->selectRaw('id_siswa, id_iuran, SUM(nominal) AS total')
            ->groupBy('id_siswa', 'id_iuran')
            ->get()
            ->keyBy(fn ($baris) => $baris->id_siswa . '|' . $baris->id_iuran);

        $siswaBelumLunas = 0;

        foreach ($siswaAktif as $siswa) {
            $tagihan = $iuranAktif->filter(
                fn ($iuran) => $iuran->id_kelas === null
                    || (int) $iuran->id_kelas === (int) $siswa->id_kelas
            );

            // Tanpa tagihan aktif, sisa tagihan = 0 -> lunas.
            if ($tagihan->isEmpty()) {
                continue;
            }

            $lunas = true;

            foreach ($tagihan as $iuran) {
                $total = (float) (
                    $pembayaran[$siswa->id_siswa . '|' . $iuran->id_iuran]->total ?? 0
                );

                if ($total + 0.009 < (float) $iuran->nominal) {
                    $lunas = false;
                    break;
                }
            }

            if (!$lunas) {
                $siswaBelumLunas++;
            }
        }

        // Saldo kas dihitung backend dari tabel `transaksi`:
        // total pemasukan dikurung total pengeluaran.
        $ringkasan = $this->ringkasanSaldo($transaksiQuery());

        $totalTransaksi = $transaksiQuery()->count();

        $iuranTotal = $transaksiQuery()
            ->where('kategori', 'Iuran')
            ->where('jenis', Transaksi::JENIS_MASUK)
            ->sum('nominal');

        $iuranTarget = 0.0;

        foreach ($iuranAktif as $iuran) {
            $peserta = $iuran->id_kelas === null
                ? $siswaAktif
                : $siswaAktif->where('id_kelas', $iuran->id_kelas);

            $iuranTarget += (float) $iuran->nominal * $peserta->count();
        }

        $bulanIni = date('Y-m');
        $masukBulanIni = $transaksiQuery()
            ->where('jenis', Transaksi::JENIS_MASUK)
            ->where('tanggal', 'like', $bulanIni . '%')
            ->sum('nominal');
        $keluarBulanIni = $transaksiQuery()
            ->where('jenis', Transaksi::JENIS_KELUAR)
            ->where('tanggal', 'like', $bulanIni . '%')
            ->sum('nominal');

        return response()->json([
            'success' => true,
            'data' => [
                'kpi' => [
                    'total_kas' => (float) $ringkasan['saldo_sekarang'],
                    'total_pemasukan' => (float) $ringkasan['total_masuk'],
                    'total_pengeluaran' => (float) $ringkasan['total_keluar'],
                    'total_iuran' => (float) $iuranTotal,
                    'jumlah_siswa' => (int) $siswaCount,
                    'siswa_belum_lunas' => (int) $siswaBelumLunas,
                    'total_transaksi' => (int) $totalTransaksi,
                    'iuran_target' => (float) $iuranTarget,
                ],
                'ringkasan' => [
                    'total_masuk' => (float) $ringkasan['total_masuk'],
                    'total_keluar' => (float) $ringkasan['total_keluar'],
                    'saldo_sekarang' => (float) $ringkasan['saldo_sekarang'],
                    'masuk_bulan_ini' => (float) $masukBulanIni,
                    'keluar_bulan_ini' => (float) $keluarBulanIni,
                ],
            ],
        ]);
    }

    /**
     * Data grafik 6 bulan terakhir (masuk vs keluar).
     */
    public function chart(Request $request): JsonResponse
    {
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $bulan = date('Y-m', strtotime("-$i months"));
            $namaBulan = date('M', strtotime($bulan . '-01'));

            $masuk = $this->transaksiTerbatas($request)
                ->where('jenis', Transaksi::JENIS_MASUK)
                ->where('tanggal', 'like', $bulan . '%')
                ->sum('nominal');
            $keluar = $this->transaksiTerbatas($request)
                ->where('jenis', Transaksi::JENIS_KELUAR)
                ->where('tanggal', 'like', $bulan . '%')
                ->sum('nominal');

            $data[] = [
                'bulan' => $namaBulan,
                'masuk' => (float) $masuk,
                'keluar' => (float) $keluar,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Transaksi terbaru untuk ditampilkan di dashboard.
     */
    public function recent(Request $request): JsonResponse
    {
        $transaksi = $this->transaksiTerbatas($request)
            ->with('siswa')
            ->orderByDesc('tanggal')
            ->orderByDesc('id_transaksi')
            ->limit(10)
            ->get()
            ->map(function ($t) {
                $waktuWib = $t->created_at
                    ? $t->created_at->copy()->setTimezone(Transaksi::ZONA_WIB)
                    : null;

                return [
                    'id' => $t->no_bukti
                        ?: ('TRX-' . str_pad($t->id_transaksi, 4, '0', STR_PAD_LEFT)),
                    'ket' => $t->keterangan ?? '-',
                    'unit' => $t->siswa?->nama_siswa ?? ($t->kategori ?? '-'),
                    'kategori' => $t->kategori ?? '-',
                    'tanggal' => $t->tanggal ? $t->tanggal->format('d M Y') : '-',
                    'tanggal_iso' => $t->tanggal ? $t->tanggal->format('Y-m-d') : null,
                    'jam' => $waktuWib ? $waktuWib->format('H:i') : '-',
                    'nominal' => (float) $t->nominal,
                    'arah' => strtolower($t->jenis),
                    'status' => 'Terverifikasi',
                    'statusTipe' => 'ok',
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $transaksi,
        ]);
    }
}
