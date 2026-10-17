<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Transaksi;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Ringkasan statistik untuk halaman Dashboard Admin.
     */
    public function index(): JsonResponse
    {
        $siswaCount = Siswa::count();
        $siswaBelumLunas = Siswa::where('status', '!=', 'Aktif')->count();

        $totalPemasukan = Transaksi::where('jenis', 'Masuk')
            ->sum('nominal');
        $totalPengeluaran = Transaksi::where('jenis', 'Keluar')
            ->sum('nominal');
        $saldoSaatIni = $totalPemasukan - $totalPengeluaran;
        $totalTransaksi = Transaksi::count();

        $iuranTotal = Transaksi::where('kategori', 'Iuran')
            ->where('jenis', 'Masuk')
            ->sum('nominal');
        $iuranTarget = $siswaCount * 250000;

        $bulanIni = date('Y-m');
        $masukBulanIni = Transaksi::where('jenis', 'Masuk')
            ->where('tanggal', 'like', $bulanIni . '%')
            ->sum('nominal');
        $keluarBulanIni = Transaksi::where('jenis', 'Keluar')
            ->where('tanggal', 'like', $bulanIni . '%')
            ->sum('nominal');

        return response()->json([
            'success' => true,
            'data' => [
                'kpi' => [
                    'total_kas' => (float) $saldoSaatIni,
                    'total_pemasukan' => (float) $totalPemasukan,
                    'total_pengeluaran' => (float) $totalPengeluaran,
                    'total_iuran' => (float) $iuranTotal,
                    'jumlah_siswa' => (int) $siswaCount,
                    'siswa_belum_lunas' => (int) $siswaBelumLunas,
                    'total_transaksi' => (int) $totalTransaksi,
                    'iuran_target' => (float) $iuranTarget,
                ],
                'ringkasan' => [
                    'saldo_awal' => 0,
                    'total_masuk' => (float) $totalPemasukan,
                    'total_keluar' => (float) $totalPengeluaran,
                    'saldo_sekarang' => (float) $saldoSaatIni,
                    'masuk_bulan_ini' => (float) $masukBulanIni,
                    'keluar_bulan_ini' => (float) $keluarBulanIni,
                ],
            ],
        ]);
    }

    /**
     * Data grafik 6 bulan terakhir (masuk vs keluar).
     */
    public function chart(): JsonResponse
    {
        $bulanIni = date('Y-m');
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $bulan = date('Y-m', strtotime("-$i months"));
            $namaBulan = date('M', strtotime($bulan . '-01'));

            $masuk = Transaksi::where('jenis', 'Masuk')
                ->where('tanggal', 'like', $bulan . '%')
                ->sum('nominal');
            $keluar = Transaksi::where('jenis', 'Keluar')
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
    public function recent(): JsonResponse
    {
        $transaksi = Transaksi::with('siswa')
            ->orderByDesc('tanggal')
            ->limit(10)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => 'TRX-' . str_pad($t->id_transaksi, 4, '0', STR_PAD_LEFT),
                    'ket' => $t->keterangan ?? '-',
                    'unit' => $t->siswa?->nama_siswa ?? ($t->kategori ?? '-'),
                    'kategori' => $t->kategori ?? '-',
                    'tanggal' => $t->tanggal ? \Carbon\Carbon::parse($t->tanggal)->format('d M Y') : '-',
                    'jam' => $t->tanggal ? \Carbon\Carbon::parse($t->tanggal)->format('H:i') : '-',
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
