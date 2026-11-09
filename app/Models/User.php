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
        'id_siswa',
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
     * Identitas siswa yang melekat pada akun.
     *
     * Hanya Bendahara dan Viewer Siswa yang wajib memiliki tautan ini;
     * Admin dan Viewer Wali Kelas tidak memiliki tagihan pribadi.
     */
    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'id_siswa', 'id_siswa');
    }

    /**
     * Kelas tempat pengguna bertugas (bendahara / viewer).
     * Admin umumnya NULL dan dapat mengakses seluruh kelas.
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }

    /** Apakah akun ini adalah Bendahara? */
    public function bendahara(): bool
    {
        return strtolower((string) $this->role) === 'bendahara';
    }

    /** Viewer yang memantau sebagai siswa (punya tagihan pribadi). */
    public function viewerSiswa(): bool
    {
        return strtolower((string) $this->role) === 'viewer'
            && $this->jenis_viewer === 'siswa';
    }

    /**
     * Peran yang wajib ditautkan ke satu baris `siswa`.
     * Admin dan Viewer Wali Kelas tidak memiliki identitas siswa.
     */
    public function wajibTautSiswa(): bool
    {
        return $this->bendahara() || $this->viewerSiswa();
    }

    /**
     * Hanya Viewer Siswa yang datanya dibatasi ke dirinya sendiri.
     * Bendahara tetap melihat seluruh kelas walau punya tagihan pribadi.
     *
     * Akun Viewer Siswa yang belum tertaut ke `siswa` tetap dianggap
     * "hanya data sendiri" (tetapi tidak punya data), sehingga tidak
     * pernah melihat seluruh kelas sebelum Admin menautkannya.
     */
    public function hanyaDataSendiri(): bool
    {
        return $this->viewerSiswa();
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
