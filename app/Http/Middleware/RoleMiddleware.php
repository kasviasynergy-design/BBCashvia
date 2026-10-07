<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Memeriksa autentikasi dan hak akses berdasarkan role.
     *
     * Penggunaan:
     * ->middleware('role:admin')
     * ->middleware('role:bendahara')
     * ->middleware('role:viewer')
     */
    public function handle(
        Request $request,
        Closure $next,
        string $role
    ): Response {
        // 1. Verifikasi apakah pengguna sudah login
        if (!Auth::check()) {
            abort(401, 'Silakan login terlebih dahulu.');
        }

        // 2. Ambil role pengguna yang sedang login
        $userRole = Auth::user()->role;

        // 3. Verifikasi kesesuaian hak akses
        if ($userRole !== $role) {
            abort(
                403,
                'Akses Ditolak: Anda tidak memiliki wewenang untuk membuka halaman ini.'
            );
        }

        // 4. Jika role sesuai, lanjutkan ke halaman tujuan
        return $next($request);
    }
}
