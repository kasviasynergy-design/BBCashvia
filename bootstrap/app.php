<?php

use App\Http\Middleware\RoleMiddleware;
use App\Support\DatabaseFailure;
use App\Support\ErrorPage;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Railway berada di balik reverse proxy HTTPS. Tanpa ini,
        // Laravel mengira request memakai http sehingga URL/asset bisa
        // menjadi http (mixed content) dan redirect bisa salah skema.
        $middleware->trustProxies(at: '*');

        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /*
        |================================================================
        | PENANGANAN GALAT TERPUSAT
        |================================================================
        | Setiap galat aplikasi dibentuk di SATU tempat menjadi:
        |
        |  - Respons JSON  : untuk endpoint API (prefiks /data, kelompok
        |                    api admin/bendahara/viewer, dan /api) agar
        |                    antarmuka yang memakai fetch selalu
        |                    menerima JSON dan tidak merusak JS.
        |  - Halaman kustom: untuk permintaan halaman web biasa,
        |                    memakai view resources/views/errors/*.
        |
        | Kategori yang dibentuk:
        |  503 - kegagalan koneksi basis data (MySQL mati/terputus)
        |  403 - hak akses ditolak (RoleMiddleware dsb.)
        |  401 - pengguna belum login (tamu diarahkan ke halaman login)
        |  404 - halaman/data tidak ditemukan
        |  500 - galat internal tak terduga
        |
        | Halaman error sengaja tidak memakai auth(), model Eloquent,
        | session, atau query database apa pun. Dengan begitu halaman
        | tetap dapat dirender saat MySQL mati total.
        */

        // ---------------------------------------------------------------
        // 1. Tentukan kapan respons harus berupa JSON.
        // ---------------------------------------------------------------
        $kelompokJson = function (Request $request): bool {
            return $request->expectsJson()
                || $request->is('data/*', 'admin/api/*', 'bendahara/api/*', 'viewer/api/*', 'api/*');
        };

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request, Throwable $e): bool => $kelompokJson($request)
        );

        // ---------------------------------------------------------------
        // 2. Pemetaan galat menjadi respons.
        // ---------------------------------------------------------------
        $exceptions->render(function (Throwable $e, Request $request) use ($kelompokJson) {
            $api = $kelompokJson($request);
            $pesan = (string) $e->getMessage();
            $kode = $e instanceof HttpException ? $e->getStatusCode() : 0;

            // Dibiarkan memakai perilaku default Laravel, supaya status
            // dan bentuk respons yang sudah diandalkan tes lama tidak
            // berubah:
            //   ValidationException        -> 422 (validasi)
            //   AuthorizationException     -> 403 (gate/policy)
            //   ModelNotFoundException     -> 404 (mis. findOrFail)
            $dibiarkan = $e instanceof ValidationException
                || $e instanceof AuthorizationException
                || $e instanceof ModelNotFoundException;

            if ($dibiarkan) {
                return null;
            }

            // ==========================================================
            // (A) KEGAGALAN KONEKSI BASIS DATA → 503
            // ==========================================================
            // Deteksi dibuat spesifik agar kesalahan SQL biasa (mis.
            // kolom tidak ada) tetap menjadi 500, bukan 503.
            if (DatabaseFailure::isConnectionFailure($e)) {
                DatabaseFailure::report($e, $request, 'Koneksi basis data gagal');

                return $api
                    ? response()->json([
                        'success' => false,
                        'message' => 'Server tidak dapat mengakses basis data. Silakan coba beberapa saat lagi.',
                    ], 503)
                    : ErrorPage::render('errors.503', 503);
            }

            // ==========================================================
            // (B) AKSES DITOLAK → 403
            // ==========================================================
            if ($e instanceof HttpException && $kode === 403) {
                return $api
                    ? response()->json([
                        'success' => false,
                        'message' => $pesan ?: 'Akses Ditolak: Anda tidak memiliki wewenang untuk aksi ini.',
                    ], 403)
                    : ErrorPage::render('errors.403', 403, $pesan ?: null);
            }

            // ==========================================================
            // (C) BELUM LOGIN → 401
            // ==========================================================
            // Halaman web: diarahkan ke halaman login (perilaku yang
            // sudah diuji). Permintaan API: JSON 401.
            if ($e instanceof AuthenticationException
                || ($e instanceof HttpException && $kode === 401)) {
                return $api
                    ? response()->json([
                        'success' => false,
                        'message' => 'Sesi berakhir atau Anda belum login. Silakan login terlebih dahulu.',
                    ], 401)
                    : redirect()->route('login');
            }

            // ==========================================================
            // (D) LAYANAN TIDAK TERSEDIA → 503
            // ==========================================================
            // Selain kegagalan DB, 503 juga dipakai Laravel saat mode
            // maintenance. Jangan jatuhkan ke halaman 500.
            if ($e instanceof HttpException && $kode === 503) {
                return $api
                    ? response()->json([
                        'success' => false,
                        'message' => 'Layanan sedang tidak tersedia. Silakan coba beberapa saat lagi.',
                    ], 503)
                    : ErrorPage::render('errors.503', 503, $pesan ?: null);
            }

            // ==========================================================
            // (E) HALAMAN/DATA TIDAK DITEMUKAN → 404
            // ==========================================================
            if ($e instanceof NotFoundHttpException
                || ($e instanceof HttpException && $kode === 404)) {
                return $api
                    ? response()->json([
                        'success' => false,
                        'message' => 'Data atau alamat tujuan tidak ditemukan.',
                    ], 404)
                    : ErrorPage::render('errors.404', 404);
            }

            // ==========================================================
            // (F) GALAT INTERNAL TAK TERDUGA → 500
            // ==========================================================
            // Termasuk HttpException 5xx lainnya. Galat ini dicatat ke
            // berkas log khusus galat.
            if (! $e instanceof HttpException || $kode >= 500) {
                DatabaseFailure::report($e, $request, 'Galat internal aplikasi');

                return $api
                    ? response()->json([
                        'success' => false,
                        'message' => 'Terjadi kesalahan internal pada server. Silakan coba lagi atau hubungi Admin.',
                    ], 500)
                    : ErrorPage::render('errors.500', 500);
            }

            // HttpException lain (< 500, mis. 429 throttle) tetap
            // memakai perilaku bawaan Laravel.
            return null;
        });
    })->create();
