<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\DatabaseFailure;
use App\Support\ErrorPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Throwable;

class AuthController extends Controller
{
    /**
     * Menampilkan halaman login.
     */
    public function showLoginForm()
    {
        return view('login');
    }

    /**
     * Memproses login menggunakan database.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'role' => [
                'required',
                Rule::in(['admin', 'bendahara', 'viewer']),
            ],
        ]);

        try {
            // Query awal hanya untuk membedakan pesan "email tidak
            // terdaftar" dari "password salah". Autentikasi tetap
            // dilakukan oleh guard Laravel melalui Auth::attempt().
            $user = User::where('email', $validated['email'])->first();

            if (! $user) {
                return $this->loginError(
                    $request,
                    'email',
                    'Email yang Anda masukkan salah atau tidak terdaftar.'
                );
            }

            if (! Hash::check($validated['password'], $user->password)) {
                return $this->loginError(
                    $request,
                    'password',
                    'Password yang Anda masukkan salah.'
                );
            }

            if (strtolower((string) $user->role) !== $validated['role']) {
                return $this->loginError(
                    $request,
                    'role',
                    'Peran yang dipilih tidak sesuai dengan akun ini.'
                );
            }

            if (! Auth::attempt([
                'email' => $validated['email'],
                'password' => $validated['password'],
            ])) {
                return $this->loginError(
                    $request,
                    'password',
                    'Password yang Anda masukkan salah.'
                );
            }

            /** @var User $user */
            $user = Auth::user();

            $request->session()->regenerate();

            $user->last_login_at = now();
            $user->save();
        } catch (Throwable $e) {
            // Hanya kegagalan koneksi database yang diubah menjadi 503.
            // Bug aplikasi lain tetap dilempar ke handler global sebagai 500.
            if (! DatabaseFailure::isConnectionFailure($e)) {
                throw $e;
            }

            DatabaseFailure::report($e, $request, 'Kegagalan database saat login');

            // Jangan tinggalkan sesi setengah jadi bila penyimpanan
            // last_login_at atau session database ikut gagal.
            try {
                if (Auth::check()) {
                    Auth::logout();
                }

                $request->session()->invalidate();
                $request->session()->regenerateToken();
            } catch (Throwable) {
                // Session/cache bisa ikut mati ketika database down.
            }

            return $this->databaseError($request);
        }

        if ($user->must_change_password) {
            $redirect = route('change-password');

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'redirect' => $redirect,
                    'must_change_password' => true,
                ]);
            }

            return redirect()->to($redirect);
        }

        $redirect = match (strtolower((string) $user->role)) {
            'admin' => route('admin.dashboard'),
            'bendahara' => url('/dashboard/bendahara'),
            'viewer' => route('viewer.dashboard'),
            default => null,
        };

        if (! $redirect) {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return $this->loginError(
                $request,
                'role',
                'Peran akun tidak dikenali. Silakan hubungi Admin.'
            );
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'redirect' => $redirect,
                'must_change_password' => false,
            ]);
        }

        return redirect()->intended($redirect);
    }

    /**
     * Memproses perubahan password dan menyimpannya ke database.
     */
    public function changePassword(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sesi login berakhir. Silakan login kembali.',
                ], 401);
            }

            return redirect()->route('login');
        }

        $validated = $request->validate([
            'new_password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[^A-Za-z0-9]/',
                'confirmed',
            ],
        ], [
            'new_password.required' => 'Password baru wajib diisi.',
            'new_password.min' => 'Password minimal 8 karakter.',
            'new_password.regex' => 'Password harus mengandung huruf kapital, angka, dan karakter khusus.',
            'new_password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $user->password = Hash::make($validated['new_password']);
        $user->must_change_password = false;
        $user->save();

        // Akhiri sesi agar pengguna login ulang dengan password baru.
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $redirect = route('login');

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Password berhasil diubah. Silakan login kembali.',
                'redirect' => $redirect,
            ]);
        }

        return redirect()->to($redirect)->with(
            'status',
            'Password berhasil diubah. Silakan login kembali.'
        );
    }

    /**
     * Respons aman ketika database tidak dapat dihubungi saat login.
     *
     * JSON dipakai oleh form login berbasis fetch. Untuk form biasa,
     * flash message hanya aman bila session tidak disimpan di database;
     * jika session memakai database, langsung tampilkan halaman 503 agar
     * proses penyimpanan session tidak menimbulkan error kedua.
     */
    private function databaseError(Request $request)
    {
        $message = 'Gagal terhubung ke server database. Silakan coba beberapa saat lagi.';

        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => $message,
                'errors' => [
                    'email' => [$message],
                ],
            ], 503);
        }

        $sessionAman = in_array(
            config('session.driver'),
            ['file', 'cookie', 'array'],
            true
        );

        if ($sessionAman) {
            return redirect()
                ->route('login')
                ->withErrors(['email' => $message])
                ->withInput($request->only('email'));
        }

        return ErrorPage::render('errors.503', 503, $message);
    }

    /**
     * Mengembalikan pesan kesalahan login.
     */
    private function loginError(
        Request $request,
        string $field,
        string $message
    ) {
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'errors' => [
                    $field => [$message],
                ],
                'message' => $message,
            ], 422);
        }

        return back()
            ->withErrors([$field => $message])
            ->withInput($request->only('email'));
    }

    /**
     * Logout pengguna.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
