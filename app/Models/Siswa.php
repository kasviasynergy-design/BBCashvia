<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    protected $table = 'siswa';

    protected $primaryKey = 'id_siswa';

    public $timestamps = false;

    protected $fillable = [
        'nis',
        'nama_siswa',
        'id_kelas',
        'status',
        'Jenis_Kelamin',
    ];

    public function kelas(): BelongsTo
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
            'id_siswa',
            'id_siswa'
        );
    }
}
