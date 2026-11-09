<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaksi extends Model
{
    protected $table = 'transaksi';

    protected $primaryKey = 'id_transaksi';

    public $timestamps = true;

    const UPDATED_AT = null;

    protected $fillable = [
        'no_bukti',
        'id_user',
        'nama_petugas',
        'id_siswa',
        'id_kelas',
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
        'bukti_transaksi',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
        'nominal' => 'decimal:2',
        'uang_diterima' => 'decimal:2',
        'kembalian' => 'decimal:2',
        'created_at' => 'datetime',
    ];

    /**
     * Nilai turunan yang selalu ikut saat model dikirim ke JSON.
     *
     * Frontend memakai `t.waktu` (jam WIB) untuk kolom "… WIB".
     * Tanpa appends ini, kolom tersebut kosong dan tanggal tampil
     * sebagai "2026-10-20T00:00:00.000000Z".
     */
    protected $appends = [
        'waktu',
        'tanggal_format',
        'kembalian_hitung',
    ];

    /**
     * Zona waktu Indonesia Barat (WIB) untuk tampilan jam.
     */
    public const ZONA_WIB = 'Asia/Jakarta';

    /**
     * Jam transaksi (WIB) dalam format HH:MM, diambil dari created_at.
     *
     * Database menyimpan waktu dalam UTC, sehingga dikonversi dulu
     * ke WIB agar jam yang tampil sesuai waktu pengguna.
     */
    public function getWaktuAttribute(): string
    {
        if (!$this->created_at) {
            return '';
        }

        return $this->created_at
            ->copy()
            ->setTimezone(self::ZONA_WIB)
            ->format('H:i');
    }

    /**
     * Tanggal transaksi dalam format YYYY-MM-DD agar mudah
     * diproses maupun ditampilkan frontend.
     */
    public function getTanggalFormatAttribute(): string
    {
        if (!$this->tanggal) {
            return '';
        }

        return $this->tanggal->format('Y-m-d');
    }

    /**
     * Kembalian = uang diterima - nominal (tidak pernah negatif).
     * Dihitung ulang agar tetap benar walaupun kolom kembalian
     * lama belum ikut terisi.
     */
    public function getKembalianHitungAttribute(): float
    {
        $nominal = (float) ($this->nominal ?? 0);
        $diterima = (float) ($this->uang_diterima ?? $nominal);

        return max(0.0, $diterima - $nominal);
    }

    /**
     * Nilai kategori yang sah sesuai enum kolom `kategori`.
     */
    public const KATEGORI = [
        'Iuran',
        'kas',
        'kebutuhan kelas',
        'perlengkapan kelas',
        'kegiatan kelas',
        'pemasukan lainnya',
        'pengeluaran lainnya',
    ];

    /**
     * Nilai kolom `jenis` di database (kata penuh, bukan singkatan).
     * Ini satu-satunya sumber kebenaran agar tidak ada lagi `M`/`K`.
     */
    public const JENIS_MASUK = 'pemasukan';

    public const JENIS_KELUAR = 'pengeluaran';

    /** Daftar nilai `jenis` yang sah. */
    public const JENIS = [
        self::JENIS_MASUK,
        self::JENIS_KELUAR,
    ];

    /**
     * Kategori yang sah untuk transaksi PEMASUKAN (jenis `pemasukan`).
     *
     * Nilainya persis sama dengan yang dipakai validasi
     * StoreTransaksiRequest, sehingga satu-satunya sumber aturan
     * kategori ada di model ini.
     */
    public const KATEGORI_MASUK = [
        'Iuran',
        'kas',
        'pemasukan lainnya',
    ];

    /**
     * Kategori yang sah untuk transaksi PENGELUARAN (jenis `pengeluaran`).
     * Dihitung dari KATEGORI dikurangi KATEGORI_MASUK agar tidak
     * ada daftar ganda yang bisa saling tidak sinkron.
     */
    public static function kategoriKeluar(): array
    {
        return array_values(array_diff(self::KATEGORI, self::KATEGORI_MASUK));
    }

    /**
     * Daftar kategori yang sah untuk jenis transaksi tertentu.
     *
     * Menerima nilai database (`pemasukan`/`pengeluaran`) maupun
     * padanan lama/antarmuka (`masuk`/`keluar` dan singkatan
     * `M`/`K`) agar tetap tahan terhadap data lama.
     */
    public static function kategoriUntukJenis(?string $jenis): array
    {
        $masuk = in_array(
            strtolower((string) $jenis),
            ['pemasukan', 'masuk', 'm'],
            true
        );

        return $masuk ? self::KATEGORI_MASUK : self::kategoriKeluar();
    }

    /** Apakah jenis menunjuk ke PEMASUKAN? */
    public static function jenisMasuk(?string $jenis): bool
    {
        return in_array(
            strtolower((string) $jenis),
            ['pemasukan', 'masuk', 'm'],
            true
        );
    }

    /**
     * Label tampilan (huruf kecil hanya untuk nilai tertentu di
     * database). Dipakai API kategori agar antarmuka dan server
     * memakai nama yang persis sama.
     */
    public static function labelKategori(string $kategori): string
    {
        $label = [
            'Iuran' => 'Iuran',
            'kas' => 'Kas',
            'kebutuhan kelas' => 'Kebutuhan Kelas',
            'perlengkapan kelas' => 'Perlengkapan Kelas',
            'kegiatan kelas' => 'Kegiatan Kelas',
            'pemasukan lainnya' => 'Pemasukan Lainnya',
            'pengeluaran lainnya' => 'Pengeluaran Lainnya',
        ];

        return $label[$kategori] ?? $kategori;
    }

    /**
     * Samakan kategori kiriman klien (bebas huruf besar/kecil)
     * dengan nilai enum yang tersimpan di database.
     *
     * Mengembalikan null bila tidak dikenali agar validasi
     * Rule::in menolaknya dengan pesan yang jelas.
     */
    public static function normalisasiKategori(?string $kategori): ?string
    {
        if ($kategori === null || trim($kategori) === '') {
            return null;
        }

        $dicari = strtolower(trim($kategori));

        foreach (self::KATEGORI as $sah) {
            if (strtolower($sah) === $dicari) {
                return $sah;
            }
        }

        return null;
    }

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

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(
            Kelas::class,
            'id_kelas',
            'id_kelas'
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

    /**
     * Rincian transaksi pada tabel `detail_transaksi` yang sudah ada
     * di database (satu transaksi dapat memiliki banyak rincian iuran).
     *
     * Dengan relasi ini data detail tidak lagi "tersimpan tapi tak
     * pernah diambil" - modal "Lihat Detail" pada Riwayat Transaksi
     * membacanya lewat relasi ini.
     */
    public function detailTransaksis(): HasMany
    {
        return $this->hasMany(
            DetailTransaksi::class,
            'id_transaksi',
            'id_transaksi'
        );
    }
}
