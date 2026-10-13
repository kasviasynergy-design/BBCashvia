<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Iuran extends Model
{
    protected $table = 'iuran';

    protected $primaryKey = 'id_iuran';

    public $timestamps = true;

    const UPDATED_AT = null;

    protected $fillable = [
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

    public function transaksi(): HasMany
    {
        return $this->hasMany(
            Transaksi::class,
            'id_iuran',
            'id_iuran'
        );
    }
}
