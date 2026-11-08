<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * DetailTransaksi - tabel `detail_transaksi` yang sudah ada di database.
 *
 * Satu baris transaksi (pembayaran iuran) dapat memiliki banyak rincian
 * di tabel ini. Rincian memuat nama iuran dan nominal yang dibayarkan
 * pada transaksi tersebut, sehingga dapat ditelusuri dari sisi website
 * (modal "Lihat Detail" pada Riwayat Transaksi).
 */
class DetailTransaksi extends Model
{
    protected $table = 'detail_transaksi';

    protected $primaryKey = 'id_detail';

    public $timestamps = false;

    protected $fillable = [
        'id_transaksi',
        'id_iuran',
        'nama_iuran',
        'nominal',
    ];

    protected $casts = [
        'nominal' => 'decimal:2',
    ];

    /**
     * Transaksi utama pemilik rincian ini
     * (detail_transaksi.id_transaksi → transaksi.id_transaksi).
     */
    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(
            Transaksi::class,
            'id_transaksi',
            'id_transaksi'
        );
    }

    /**
     * Iuran yang dijelaskan oleh rincian ini
     * (detail_transaksi.id_iuran → iuran.id_iuran).
     */
    public function iuran(): BelongsTo
    {
        return $this->belongsTo(
            Iuran::class,
            'id_iuran',
            'id_iuran'
        );
    }
}
