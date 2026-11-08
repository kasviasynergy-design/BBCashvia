<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Iuran extends Model
{
    protected $table = 'iuran';

    protected $primaryKey = 'id_iuran';

    // Tabel `iuran` pada skema nyata tidak memiliki kolom
    // created_at/updated_at, sehingga Eloquent tidak boleh
    // mencoba menuliskannya.
    public $timestamps = false;

    const UPDATED_AT = null;

    protected $fillable = [
        'id_kelas',
        'nama_iuran',
        'keterangan',
        'jatuh_tempo',
        'kategori',
        'nominal',
        'status',
    ];

    protected $casts = [
        'jatuh_tempo' => 'date',
        'nominal' => 'decimal:2',
    ];

    public function kelas()
    {
        return $this->belongsTo(
            Kelas::class,
            'id_kelas',
            'id_kelas'
        );
    }

    public function transaksi(): HasMany
    {
        return $this->hasMany(
            Transaksi::class,
            'id_iuran',
            'id_iuran'
        );
    }
}
