<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Transaksi;
use Illuminate\Contracts\Database\Eloquent\Builder;

/**
 * Perhitungan ringkasan kas yang konsisten di seluruh halaman admin.
 *
 * Rumus:
 *
 *   Saldo Sekarang = Total Pemasukan - Total Pengeluaran
 *
 * Semua angka dihitung dari tabel `transaksi` yang menyimpan
 * pemasukan dan pengeluaran secara eksplisit, tanpa saldo awal.
 */
trait MenghitungSaldoKas
{
    /**
     * Ringkasan saldo untuk query transaksi yang sudah dibatasi kelas.
     *
     * Mengembalikan angka mentah (float) supaya pemanggil dapat
     * menyusunnya sesuai kebutuhan responsnya masing-masing.
     *
     * @return array{total_masuk: float, total_keluar: float, saldo_sekarang: float}
     */
    protected function ringkasanSaldo(Builder $queryTransaksi): array
    {
        $totalMasuk = (float) (clone $queryTransaksi)
            ->where('jenis', Transaksi::JENIS_MASUK)
            ->sum('nominal');

        $totalKeluar = (float) (clone $queryTransaksi)
            ->where('jenis', Transaksi::JENIS_KELUAR)
            ->sum('nominal');

        return [
            'total_masuk' => $totalMasuk,
            'total_keluar' => $totalKeluar,
            'saldo_sekarang' => round($totalMasuk - $totalKeluar, 2),
        ];
    }
}
