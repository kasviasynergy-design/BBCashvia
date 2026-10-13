<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'Detail',
        'bukti_file',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'nominal' => 'decimal:2',
        'uang_diterima' => 'decimal:2',
        'kembalian' => 'decimal:2',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'id_user',
            'id_users'
        );
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(
            Siswa::class,
            'id_siswa',
            'id_siswa'
        );
    }

    public function iuran(): BelongsTo
    {
        return $this->belongsTo(
            Iuran::class,
            'id_iuran',
            'id_iuran'
        );
    }
}
