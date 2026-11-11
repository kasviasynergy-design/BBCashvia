<?php

use App\Http\Controllers\Api\TransaksiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Endpoint transaksi publik dinonaktifkan dengan autentikasi.
// Antarmuka web memakai /admin/api/transaksi (dilindungi role:admin).
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('transaksi', TransaksiController::class);
});
