<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /*
        |================================================================
        | S3-02: PENANGANAN GALAT TERPUSAT (GLOBAL ERROR HANDLING)
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
        |  503 - kegagalan koneksi basis data (DB Connection Exception)
        |  403 - hak akses ditolak (RoleMiddleware dsb.)
        |  401 - pengguna belum login (tamu diarahkan ke halaman login)
        |  404 - halaman/data tidak ditemukan
        |  500 - galat internal tak terduga
        |
        | Seluruh galat 500 & 503 dicatat ke berkas log khusus
        | storage/logs/app-error.log (channel "error-file").
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

            // ==========================================================
            // (A) KEGAGALAN KONEKSI BASIS DATA → 503
            // ==========================================================
            // Ditandai oleh ConnectionException (koneksi terputus saat
            // kueri), PDOException gagal tersambung, atau pesan khas
            // SQLSTATE[HY000] [kode koneksi] dari MySQL.
            $galatDatabase = $e instanceof \Illuminate\Database\ConnectionException
                || $e instanceof PDOException
                || ($e instanceof \Illuminate\Database\QueryException
                    && preg_match('/sqlstate\[hy000\]\s*\[(2002|2003|2006|2013|1045|1044|1049)\]/', strtolower($pesan)));

            if ($galatDatabase) {
                // Catat ke berkas log khusus galat (channel error-file).
                Log::channel('error-file')->error('Koneksi basis data gagal', [
                    'url' => $request->getRequestUri(),
                    'pesan' => $e->getMessage(),
                ]);

                return $api
                    ? response()->json([
                        'success' => false,
                        'message' => 'Server tidak dapat mengakses basis data. Silakan coba beberapa saat lagi.',
                    ], 503)
                    : response()->view('errors.503', [
                        'pesan' => null,
                    ], 503);
            }

            // Dibiarkan memakai perilaku default Laravel, supaya status
            // dan bentuk respons yang sudah diandalkan tes lama tidak
            // berubah:
            //   ValidationException        -> 422 (validasi)
            //   AuthorizationException     -> 403 (gate/policy)
            //   ModelNotFoundException     -> 404 (mis. findOrFail)
            $dibiarkan = $e instanceof ValidationException
                || $e instanceof \Illuminate\Auth\Access\AuthorizationException
                || $e instanceof ModelNotFoundException;

            if ($dibiarkan) {
                return null;
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
                    : response()->view('errors.403', [
                        'pesan' => $pesan ?: null,
                    ], 403);
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
            // (D) HALAMAN/DATA TIDAK DITEMUKAN → 404
            // ==========================================================
            if ($e instanceof NotFoundHttpException
                || ($e instanceof HttpException && $kode === 404)) {
                return $api
                    ? response()->json([
                        'success' => false,
                        'message' => 'Data atau alamat tujuan tidak ditemukan.',
                    ], 404)
                    : response()->view('errors.404', [
                        'pesan' => null,
                    ], 404);
            }

            // ==========================================================
            // (E) GALAT INTERNAL TAK TERDUGA → 500
            // ==========================================================
            // Termasuk HttpException 5xx lainnya. Galat ini dicatat ke
            // berkas log khusus galat.
            if (! $e instanceof HttpException || $kode >= 500) {
                Log::channel('error-file')->error('Galat internal aplikasi', [
                    'url' => $request->getRequestUri(),
                    'kelas' => $e::class,
                    'pesan' => $e->getMessage(),
                ]);

                return $api
                    ? response()->json([
                        'success' => false,
                        'message' => 'Terjadi kesalahan internal pada server. Silakan coba lagi atau hubungi Admin.',
                    ], 500)
                    : response()->view('errors.500', [
                        'pesan' => null,
                    ], 500);
            }

            // HttpException lain (< 500, mis. 429 throttle) tetap
            // memakai perilaku bawaan Laravel.
            return null;
        });
    })->create();
