<?php

use Illuminate\Support\Facades\Route;
use App\Models\Siswa;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\IuranController;

/*
|--------------------------------------------------------------------------
| HALAMAN UTAMA & AUTHENTICATION
|--------------------------------------------------------------------------
*/

// Halaman login
Route::get('/', [AuthController::class, 'showLoginForm'])->name('login');
Route::get('/login', [AuthController::class, 'showLoginForm']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Ganti password
Route::get('/change-password', function () {
    return view('change-password');
})->middleware('auth')->name('change-password');

Route::post('/change-password', [AuthController::class, 'changePassword'])
    ->middleware('auth')
    ->name('change-password.update');


/*
|--------------------------------------------------------------------------
| GROUP ROUTE YANG WAJIB LOGIN
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | HALAMAN ADMIN
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard/admin', function () {
        return view('admin-dashboard');
    })->name('admin.dashboard');

    Route::get('/admin/transaksi', function () {
        return view('admin-transaksi');
    });

    Route::get('/admin/iuran', function () {
        return view('admin-iuran');
    });

    Route::get('/admin/siswa', function () {
        $siswa = Siswa::with('kelas')->get();

        return view('admin-siswa', compact('siswa'));
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
    | API MANAJEMEN PENGGUNA
    |--------------------------------------------------------------------------
    */

    Route::prefix('admin/api/pengguna')
        ->middleware('role:admin')
        ->name('admin.api.pengguna.')
        ->group(function () {

            Route::get('/', [UserController::class, 'index'])
                ->name('index');

            Route::post('/', [UserController::class, 'store'])
                ->name('store');

            Route::put('/{id}', [UserController::class, 'update'])
                ->name('update');

            Route::delete('/{id}', [UserController::class, 'destroy'])
                ->name('destroy');
        });


  /*
    |--------------------------------------------------------------------------
    | API DATA SISWA
    |--------------------------------------------------------------------------
    */

    Route::prefix('admin/api/siswa')
        ->middleware('role:admin')
        ->name('admin.api.siswa.')
        ->group(function () {

            Route::get('/', [SiswaController::class, 'index'])
                ->name('index');

            Route::post('/', [SiswaController::class, 'store'])
                ->name('store');

            Route::put('/{id}', [SiswaController::class, 'update'])
                ->name('update');

            Route::delete('/{id}', [SiswaController::class, 'destroy'])
                ->name('destroy');
        });


    /*
    |--------------------------------------------------------------------------
    | API IURAN
    |--------------------------------------------------------------------------
    | Khusus Admin untuk membaca, menambah, mengedit, dan menghapus iuran.
    */

    Route::prefix('admin/api/iuran')
        ->middleware('role:admin')
        ->name('admin.api.iuran.')
        ->group(function () {

            Route::get('/', [IuranController::class, 'index'])
                ->name('index');

            Route::post('/', [IuranController::class, 'store'])
                ->name('store');

            Route::put('/{id}', [IuranController::class, 'update'])
                ->name('update');

            Route::delete('/{id}', [IuranController::class, 'destroy'])
                ->name('destroy');
        });


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD BENDAHARA
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard/bendahara', function () {
        return view('bendahara-dashboard');
    })->name('bendahara.dashboard');

    Route::get('/bendahara/siswa', function () {
        $siswa = Siswa::with('kelas')->get();

        return view('bendahara-siswa', compact('siswa'));
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
    })->name('viewer.dashboard');

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

});


/*
|--------------------------------------------------------------------------
| PREVIEW UI — DEVELOPMENT ONLY
|--------------------------------------------------------------------------
*/

Route::get('/preview/admin', function () {
    return view('admin-dashboard');
});

Route::get('/preview/viewer', function () {
    return view('viewer-dashboard');
});
