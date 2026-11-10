<?php

namespace App\Support;

use Illuminate\Http\Response;
use Throwable;

/**
 * Pembuat respons halaman error yang tidak bergantung pada database,
 * session, auth, Vite, atau aset build.
 */
final class ErrorPage
{
    public static function render(string $view, int $status, ?string $message = null): Response
    {
        try {
            return response()
                ->view($view, ['pesan' => $message], $status)
                ->header('Cache-Control', 'no-store, no-cache, must-revalidate');
        } catch (Throwable) {
            // Jika Blade/storage sedang bermasalah, tetap kirim HTML
            // minimal agar pengguna tidak menerima layar putih/fatal error.
            return self::fallback($status, $message);
        }
    }

    public static function fallback(int $status, ?string $message = null): Response
    {
        $title = match ($status) {
            403 => 'Akses Ditolak',
            404 => 'Halaman Tidak Ditemukan',
            503 => 'Layanan Tidak Tersedia',
            default => 'Kesalahan Server Internal',
        };

        $message ??= match ($status) {
            403 => 'Anda tidak memiliki hak akses untuk membuka halaman ini.',
            404 => 'Alamat yang Anda tuju tidak ditemukan.',
            503 => 'Layanan sedang tidak tersedia. Silakan coba beberapa saat lagi.',
            default => 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.',
        };

        $title = e($title);
        $message = e($message);

        $html = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>{$status} - BBCashvia | KASVIA Synergy</title>
    <style>
        *{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;color:#0f172a;background:linear-gradient(135deg,#eef2f7,#dbe4f0)}
        main{width:100%;max-width:470px;padding:44px 40px 34px;text-align:center;background:#fff;border-radius:20px;box-shadow:0 24px 60px rgba(15,23,42,.14)}
        .code{font-size:68px;font-weight:800;line-height:1;letter-spacing:-.03em;color:#4338ca}
        h1{margin:14px 0 10px;font-size:22px}p{margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.65}
        a{display:inline-block;padding:12px 28px;border-radius:12px;background:#4338ca;color:#fff;text-decoration:none;font-weight:600;font-size:15px}
        small{display:block;margin-top:30px;padding-top:18px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px}
    </style>
</head>
<body>
    <main>
        <div class="code">{$status}</div>
        <h1>{$title}</h1>
        <p>{$message}</p>
        <a href="/login">Ke Halaman Login</a>
        <small>BBCashvia &mdash; KASVIA Synergy &bull; Sistem Pengelolaan Kas Kelas</small>
    </main>
</body>
</html>
HTML;

        return response($html, $status, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
        ]);
    }
}
