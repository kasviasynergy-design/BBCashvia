<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransaksiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Endpoint transaksi publik dinonaktifkan dengan autentikasi.
// Antarmuka web memakai /admin/api/transaksi (dilindungi role:admin).
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('transaksi', TransaksiController::class);
});

// Diagnostik sementara untuk memeriksa konfigurasi koneksi database
// dari dalam container Railway. Tidak memakai session atau autentikasi.
Route::get('/diagnose-db', function () {
    $connection = config('database.default');
    $config = config("database.connections.$connection", []);

    $info = [
        'app_env' => app()->environment(),
        'config_cached' => app()->configurationIsCached(),
        'db_connection' => $connection,
        'db_host' => $config['host'] ?? null,
        'db_port' => $config['port'] ?? null,
        'db_database' => $config['database'] ?? null,
        'db_url_present' => filled($config['url'] ?? null),
        'env_db_host_present' => filled(env('DB_HOST')),
        'env_mysqlhost_present' => filled(env('MYSQLHOST')),
        'env_mysql_private_url_present' => filled(env('MYSQL_PRIVATE_URL')),
        'env_mysql_url_present' => filled(env('MYSQL_URL')),
        'session_driver' => config('session.driver'),
        'cache_store' => config('cache.default'),
    ];

    try {
        DB::connection()->getPdo();

        return response()->json(['status' => 'ok'] + $info);
    } catch (Throwable $e) {
        $message = preg_replace(
            ['/password=[^ ]+/i', '/user=[^ ]+/i'],
            ['password=***', 'user=***'],
            $e->getMessage()
        );

        return response()->json([
            'status' => 'error',
            'error_class' => get_class($e),
            'error_code' => $e->getCode(),
            'error_message' => $message,
        ] + $info, 503);
    }
});
