<?php

use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('login');
});


/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/

Route::get('/change-password', function () {
    return view('change-password');
});


/*
|--------------------------------------------------------------------------
| DASHBOARD ADMIN
|--------------------------------------------------------------------------
*/

Route::get('/dashboard/admin', function () {
    return view('admin-dashboard');
})->middleware('role:admin');


/*
|--------------------------------------------------------------------------
| HALAMAN ADMIN — BBCASHVIA
|--------------------------------------------------------------------------
*/

Route::get('/admin/transaksi', function () {
    return view('admin-transaksi');
});

Route::get('/admin/iuran', function () {
    return view('admin-iuran');
});

Route::get('/admin/siswa', function () {
    return view('admin-siswa');
});

Route::get('/admin/laporan-kas', function () {
    return view('admin-laporan-kas');
});

Route::get('/admin/riwayat-transaksi', function () {
    return view('admin-riwayat-transaksi');
});

Route::get('/admin/manajemen-pengguna', function () {
    return view('admin-manajemen-pengguna');
});


/*
|--------------------------------------------------------------------------
| DASHBOARD BENDAHARA
|--------------------------------------------------------------------------
*/

Route::get('/dashboard/bendahara', function () {
    return view('bendahara-dashboard');
})->middleware('role:bendahara');


/*
|--------------------------------------------------------------------------
| HALAMAN BENDAHARA — BBCASHVIA
|--------------------------------------------------------------------------
*/

Route::get('/bendahara/siswa', function () {
    return view('bendahara-siswa');
});

Route::get('/bendahara/iuran', function () {
    return view('bendahara-iuran');
});

Route::get('/bendahara/transaksi', function () {
    return view('bendahara-transaksi');
});

Route::get('/bendahara/laporan-kas', function () {
    return view('bendahara-laporan-kas');
});

Route::get('/bendahara/riwayat-transaksi', function () {
    return view('bendahara-riwayat-transaksi');
});


/*
|--------------------------------------------------------------------------
| DASHBOARD VIEWER
|--------------------------------------------------------------------------
*/

Route::get('/dashboard/viewer', function () {
    return view('viewer-dashboard');
});

Route::get('/viewer/siswa', function () {
    return view('viewer-siswa');
});

Route::get('/viewer/iuran', function () {
    return view('viewer-iuran');
});

Route::get('/viewer/transaksi', function () {
    return view('viewer-transaksi');
});

Route::get('/viewer/riwayat-transaksi', function () {
    return view('viewer-riwayat-transaksi');
});

Route::get('/viewer/laporan-kas', function () {
    return view('viewer-laporan-kas');
});


/*
|--------------------------------------------------------------------------
| PREVIEW UI — DEVELOPMENT ONLY
|--------------------------------------------------------------------------
| Route ini hanya digunakan untuk melihat tampilan UI selama development.
| Tidak menggunakan RoleMiddleware.
|--------------------------------------------------------------------------
*/

Route::get('/preview/admin', function () {
    return view('admin-dashboard');
});

Route::get('/preview/bendahara', function () {
    return view('bendahara-dashboard');
});

Route::get('/preview/viewer', function () {
    return view('viewer-dashboard');
});
