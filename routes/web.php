<?php

use Illuminate\Support\Facades\Route;
use App\Models\Siswa;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\IuranController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| HALAMAN UTAMA & AUTHENTICATION
|--------------------------------------------------------------------------
*/

// Halaman login
Route::get('/', [AuthController::class, 'showLoginForm'])->name('login');
Route::get('/login', [AuthController::class, 'showLoginForm']);
// Maksimal 5 percobaan login per menit per IP sebagai penangkal brute force.
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/logout', [AuthController::class, 'logout']);

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
    | DATA BACA (SEMUA ROLE YANG SUDAH LOGIN)
    |--------------------------------------------------------------------------
    | Dipakai halaman bendahara & viewer untuk membaca data nyata dari
    | database tanpa membuka endpoint admin (yang bersifat baca-tulis).
    */

    Route::middleware('role:admin,bendahara,viewer')->group(function () {
        Route::get('/data/dashboard', [DashboardController::class, 'index'])
            ->name('data.dashboard');
        Route::get('/data/dashboard/chart', [DashboardController::class, 'chart'])
            ->name('data.dashboard.chart');
        Route::get('/data/dashboard/recent', [DashboardController::class, 'recent'])
            ->name('data.dashboard.recent');
        Route::get('/data/siswa', [SiswaController::class, 'index'])
            ->name('data.siswa');
        Route::get('/data/kelas', [KelasController::class, 'index'])
            ->name('data.kelas');
        Route::get('/data/iuran', [IuranController::class, 'index'])
            ->name('data.iuran');
        Route::get('/data/transaksi', [TransaksiController::class, 'index'])
            ->name('data.transaksi');
    });

    /*
    |--------------------------------------------------------------------------
    | HALAMAN ADMIN
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {

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
            $kelas = \App\Models\Kelas::orderBy('nama_kelas')
                ->get(['id_kelas', 'nama_kelas']);

            return view('admin-siswa', compact('siswa', 'kelas'));
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
    | TOKEN CSRF TERBARU (ADMIN)
    |--------------------------------------------------------------------------
    | Dipakai JavaScript untuk mengambil token sesi yang masih berlaku
    | sebelum request tulis, sehingga token lama di halaman tidak dipakai.
    */

    Route::get('/admin/api/csrf-token', function () {
        return response()->json(['token' => csrf_token()]);
    })->middleware('role:admin')->name('admin.api.csrf-token');


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
    | API DATA KELAS
    |--------------------------------------------------------------------------
    | Khusus Admin untuk membaca, menambah, mengedit, dan menghapus kelas.
    */

    Route::prefix('admin/api/kelas')
        ->middleware('role:admin')
        ->name('admin.api.kelas.')
        ->group(function () {

            Route::get('/', [KelasController::class, 'index'])
                ->name('index');

            Route::post('/', [KelasController::class, 'store'])
                ->name('store');

            Route::put('/{id}', [KelasController::class, 'update'])
                ->name('update');

            Route::delete('/{id}', [KelasController::class, 'destroy'])
                ->name('destroy');
        });


    /*
    |--------------------------------------------------------------------------
    | API DASHBOARD ADMIN
    |--------------------------------------------------------------------------
    | Statistik dan grafik untuk halaman Dashboard Admin.
    */

    Route::prefix('admin/api/dashboard')
        ->middleware('role:admin')
        ->name('admin.api.dashboard.')
        ->group(function () {

            Route::get('/', [DashboardController::class, 'index'])
                ->name('index');

            Route::get('/chart', [DashboardController::class, 'chart'])
                ->name('chart');

            Route::get('/recent', [DashboardController::class, 'recent'])
                ->name('recent');
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
    | API DATA TRANSAKSI (ADMIN)
    |--------------------------------------------------------------------------
    | Khusus Admin untuk membaca, menambah, mengedit, dan menghapus transaksi.
    */

    Route::prefix('admin/api/transaksi')
        ->middleware('role:admin')
        ->name('admin.api.transaksi.')
        ->group(function () {

            Route::get('/', [TransaksiController::class, 'index'])
                ->name('index');

            // Daftar kategori bersama (harus didaftarkan sebelum
            // rute /{id} agar tidak tertangkap sebagai id).
            Route::get('/kategori', [TransaksiController::class, 'kategori'])
                ->name('kategori');

            Route::post('/', [TransaksiController::class, 'store'])
                ->name('store');

            Route::get('/{id}', [TransaksiController::class, 'show'])
                ->name('show');

            Route::put('/{id}', [TransaksiController::class, 'update'])
                ->name('update');

            Route::delete('/{id}', [TransaksiController::class, 'destroy'])
                ->name('destroy');
        });


    /*
    |--------------------------------------------------------------------------
    | API BENDAHARA
    |--------------------------------------------------------------------------
    | Bendahara mengelola operasional kas: siswa, iuran, dan transaksi.
    | Endpoint ini memakai controller yang sama dengan admin agar
    | perilakunya konsisten.
    */

    Route::prefix('bendahara/api')
        ->middleware('role:admin,bendahara')
        ->name('bendahara.api.')
        ->group(function () {

            // Dashboard
            Route::get('/dashboard', [DashboardController::class, 'index'])
                ->name('dashboard');
            Route::get('/dashboard/chart', [DashboardController::class, 'chart'])
                ->name('dashboard.chart');
            Route::get('/dashboard/recent', [DashboardController::class, 'recent'])
                ->name('dashboard.recent');

            // Siswa
            Route::get('/siswa', [SiswaController::class, 'index'])
                ->name('siswa.index');
            Route::post('/siswa', [SiswaController::class, 'store'])
                ->name('siswa.store');
            Route::put('/siswa/{id}', [SiswaController::class, 'update'])
                ->name('siswa.update');
            Route::delete('/siswa/{id}', [SiswaController::class, 'destroy'])
                ->name('siswa.destroy');

            // Kelas
            Route::get('/kelas', [KelasController::class, 'index'])
                ->name('kelas.index');

            // Iuran
            Route::get('/iuran', [IuranController::class, 'index'])
                ->name('iuran.index');
            Route::post('/iuran', [IuranController::class, 'store'])
                ->name('iuran.store');
            Route::put('/iuran/{id}', [IuranController::class, 'update'])
                ->name('iuran.update');
            Route::delete('/iuran/{id}', [IuranController::class, 'destroy'])
                ->name('iuran.destroy');

            // Transaksi
            Route::get('/transaksi', [TransaksiController::class, 'index'])
                ->name('transaksi.index');
            Route::get('/transaksi/kategori', [TransaksiController::class, 'kategori'])
                ->name('transaksi.kategori');
            Route::post('/transaksi', [TransaksiController::class, 'store'])
                ->name('transaksi.store');
            Route::get('/transaksi/{id}', [TransaksiController::class, 'show'])
                ->name('transaksi.show');
            Route::put('/transaksi/{id}', [TransaksiController::class, 'update'])
                ->name('transaksi.update');
            Route::delete('/transaksi/{id}', [TransaksiController::class, 'destroy'])
                ->name('transaksi.destroy');
        });


    /*
    |--------------------------------------------------------------------------
    | API TAMBAH UNTUK VIEWER
    |--------------------------------------------------------------------------
    | Viewer (wali kelas / siswa) dapat MENAMBAH siswa, iuran, dan
    | transaksi untuk kelasnya sendiri. Endpoint ini menunjuk controller
    | yang sama dengan admin/bendahara; kelas otomatis diikat oleh
    | trait MembatasiKelas.
    */

    Route::prefix('viewer/api')
        ->middleware('role:viewer')
        ->name('viewer.api.')
        ->group(function () {

            Route::get('/transaksi/kategori', [TransaksiController::class, 'kategori'])
                ->name('transaksi.kategori');

            Route::post('/siswa', [SiswaController::class, 'store'])
                ->name('siswa.store');

            Route::post('/iuran', [IuranController::class, 'store'])
                ->name('iuran.store');

            Route::post('/transaksi', [TransaksiController::class, 'store'])
                ->name('transaksi.store');
        });


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD BENDAHARA
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:bendahara')->group(function () {

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
    });


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD VIEWER
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:viewer')->group(function () {

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

});


/*
|--------------------------------------------------------------------------
| PREVIEW UI - DEVELOPMENT ONLY
|--------------------------------------------------------------------------
| Hanya aktif di lingkungan lokal agar tidak dapat diakses di produksi.
*/

if (app()->environment('local')) {
    Route::get('/preview/admin', function () {
        return view('admin-dashboard');
    });

    Route::get('/preview/viewer', function () {
        return view('viewer-dashboard');
    });
}
