<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * SKKNI-3 - Validasi anti-duplikat saat tambah data baru.
 *
 * Aplikasi BBCashvia memiliki dua jenis klien:
 *  - halaman admin/bendahara/viewer memakai fetch() dan mengharapkan
 *    respons JSON (pesan galat ditampilkan lewat toast/form error);
 *  - formulir biasa (non-AJAX) mengharapkan redirect kembali ke form.
 *
 * Helper ini menyatukan kedua jalur tersebut:
 *  - permintaan JSON/AJAX  -> HTTP 422 + message + errors;
 *  - permintaan form biasa -> redirect()->back()->withInput() dan
 *    flash message `error` yang jelas.
 */
trait MenolakDuplikat
{
    /**
     * Hentikan proses simpan bila data dianggap duplikat.
     *
     * @param  array<string, array<int, string>>  $galat
     */
    protected function tolakDuplikat(
        Request $request,
        bool $duplikat,
        string $pesan,
        array $galat = []
    ): JsonResponse|RedirectResponse|null {
        if (!$duplikat) {
            return null;
        }

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => false,
                'message' => $pesan,
                'errors' => $galat !== [] ? $galat : ['duplikat' => [$pesan]],
            ], 422);
        }

        return redirect()
            ->back()
            ->withInput()
            ->with('error', $pesan);
    }
}
