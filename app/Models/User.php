<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $table = 'users';

    protected $primaryKey = 'id_users';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'jenis_viewer',
        'id_kelas',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Kelas tempat pengguna bertugas (bendahara / viewer).
     * Admin umumnya NULL dan dapat mengakses seluruh kelas.
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }

    /** Nama kelas pengguna, atau null bila tidak dibatasi kelas. */
    public function namaKelas(): ?string
    {
        return $this->kelas?->nama_kelas;
    }

    /**
     * Label kelas untuk tampilan:
     * - Admin            : "Semua Kelas"
     * - Bendahara/Viewer : nama kelasnya, atau "Kelas belum ditetapkan"
     *   bila admin belum menetapkan kelasnya.
     */
    public function labelKelas(): string
    {
        if ($this->aksesSemuaKelas()) {
            return 'Semua Kelas';
        }

        return $this->namaKelas() ?? 'Kelas belum ditetapkan';
    }

    /** Admin melihat seluruh kelas. */
    public function aksesSemuaKelas(): bool
    {
        return strtolower((string) $this->role) === 'admin';
    }

    /** Apakah pengguna (bendahara/viewer) hanya memantau satu kelas tertentu. */
    public function terbatasSatuKelas(): bool
    {
        return !$this->aksesSemuaKelas() && $this->id_kelas !== null;
    }

    /**
     * Label jenis viewer untuk tampilan:
     * - siswa      : "Siswa"
     * - wali_kelas : "Wali Kelas"
     * - lainnya    : null (tidak berlaku untuk admin/bendahara)
     */
    public function labelJenisViewer(): ?string
    {
        return match ($this->jenis_viewer) {
            'siswa' => 'Siswa',
            'wali_kelas' => 'Wali Kelas',
            default => null,
        };
    }
}
