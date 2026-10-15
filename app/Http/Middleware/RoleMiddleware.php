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
     */
    public function handle(
        Request $request,
        Closure $next,
        string $role
    ): Response {
        // Verifikasi apakah pengguna sudah login
        if (!Auth::check()) {
            abort(401, 'Silakan login terlebih dahulu.');
        }

        // Ambil role pengguna yang sedang login
        $userRole = strtolower(trim((string) Auth::user()->role));
        $requiredRole = strtolower(trim($role));

        // Verifikasi kesesuaian hak akses
        if ($userRole !== $requiredRole) {
            abort(
                403,
                'Akses Ditolak: Anda tidak memiliki wewenang untuk membuka halaman ini.'
            );
        }

        // Jika role sesuai, lanjutkan ke halaman tujuan
        return $next($request);
    }
}
