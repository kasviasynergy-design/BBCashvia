<?php

namespace App\Support;

use RuntimeException;

/**
 * Pembangkit password awal BBCashvia.
 *
 * Password dibuat di server dan hanya dikembalikan sekali pada respons
 * pembuatan akun/import. Database hanya menyimpan hasil Hash::make(),
 * sehingga password plaintext tidak pernah dapat diambil kembali.
 *
 * Aturan yang dipenuhi (lebih ketat dari validasi UserController):
 * - minimal 12 karakter;
 * - mengandung huruf kapital, huruf kecil, angka, dan simbol;
 * - tidak memakai karakter yang sering tertukar saat dibaca manusia
 *   (I, O, 0, 1) agar mudah diketik siswa dari file akun.
 */
class KataSandiAwal
{
    public const PANJANG = 12;

    private const HURUF_BESAR = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

    private const HURUF_KECIL = 'abcdefghijkmnopqrstuvwxyz';

    private const ANGKA = '23456789';

    private const SIMBOL = '!@#$%^&*()-_=+';

    /** Hasilkan satu password awal yang memenuhi seluruh aturan. */
    public static function buat(): string
    {
        $semua = self::HURUF_BESAR
            . self::HURUF_KECIL
            . self::ANGKA
            . self::SIMBOL;

        $karakter = [
            self::acak(self::HURUF_BESAR),
            self::acak(self::HURUF_KECIL),
            self::acak(self::ANGKA),
            self::acak(self::SIMBOL),
        ];

        while (count($karakter) < self::PANJANG) {
            $karakter[] = self::acak($semua);
        }

        // Fisher-Yates agar posisi wajib tidak selalu di depan.
        for ($i = count($karakter) - 1; $i > 0; $i--) {
            $j = random_int(0, $i);
            [$karakter[$i], $karakter[$j]] = [$karakter[$j], $karakter[$i]];
        }

        $password = implode('', $karakter);

        if (!preg_match('/[A-Z]/', $password)
            || !preg_match('/[a-z]/', $password)
            || !preg_match('/[0-9]/', $password)
            || !preg_match('/[^A-Za-z0-9]/', $password)) {
            throw new RuntimeException('Gagal membuat password awal yang valid.');
        }

        return $password;
    }

    private static function acak(string $kumpulan): string
    {
        return $kumpulan[random_int(0, mb_strlen($kumpulan) - 1)];
    }
}
