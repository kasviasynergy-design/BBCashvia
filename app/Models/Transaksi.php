<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $table = 'transaksi';

    protected $primaryKey = 'id_transaksi';

    public $timestamps = true;

    const UPDATED_AT = null;

    protected $fillable = [
        'no_bukti',
        'id_user',
        'id_siswa',
        'id_iuran',
        'tanggal',
        'nominal',
        'keterangan',
        'nama_pembayar',
        'metode',
        'jenis',
        'kategori',
        'pic',
        'periode',
        'uang_diterima',
        'kembalian',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'nominal' => 'decimal:2',
        'uang_diterima' => 'decimal:2',
        'kembalian' => 'decimal:2',
        'created_at' => 'datetime',
    ];
}
