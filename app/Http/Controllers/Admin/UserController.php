<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Mengambil data pengguna dari database.
     */
    public function index()
    {
        $users = User::orderBy('id_users')->get();

        return response()->json([
            'success' => true,
            'data' => $users->map(function ($user) {
                return [
                    'db_id' => $user->id_users,
                    'id' => 'PGN-' . str_pad($user->id_users, 3, '0', STR_PAD_LEFT),
                    'nama' => $user->name,
                    'email' => $user->email,
                    'peran' => strtolower($user->role),
                    'login' => $user->last_login_at
                        ? date('Y-m-d H:i', strtotime($user->last_login_at))
                        : null,
                    'utama' => (int) $user->id_users === 1,
                ];
            }),
        ]);
    }

    /**
     * Menambahkan pengguna baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'peran' => ['required', Rule::in(['admin', 'bendahara', 'viewer'])],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[^A-Za-z0-9]/',
            ],
        ], [
            'email.unique' => 'Email sudah terdaftar.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.regex' => 'Kata sandi harus memiliki huruf kapital dan karakter khusus.',
        ]);

        $user = new User();
        $user->name = $validated['nama'];
        $user->email = $validated['email'];
        $user->role = $validated['peran'];
        $user->password = Hash::make($validated['password']);
        $user->must_change_password = true;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil ditambahkan.',
            'data' => [
                'db_id' => $user->id_users,
                'id' => 'PGN-' . str_pad($user->id_users, 3, '0', STR_PAD_LEFT),
                'nama' => $user->name,
                'email' => $user->email,
                'peran' => strtolower($user->role),
                'login' => null,
                'utama' => (int) $user->id_users === 1,
            ],
        ], 201);
    }

    /**
     * Memperbarui data pengguna.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id_users, 'id_users'),
            ],
            'peran' => ['required', Rule::in(['admin', 'bendahara', 'viewer'])],
            'password' => [
                'nullable',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[^A-Za-z0-9]/',
            ],
        ], [
            'email.unique' => 'Email sudah digunakan pengguna lain.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.regex' => 'Kata sandi harus memiliki huruf kapital dan karakter khusus.',
        ]);

        $user->name = $validated['nama'];
        $user->email = $validated['email'];

        // Akun utama tidak boleh diganti perannya.
        if ((int) $user->id_users !== 1) {
            $user->role = $validated['peran'];
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
            $user->must_change_password = true;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Data pengguna berhasil diperbarui.',
        ]);
    }

    /**
     * Menghapus pengguna.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ((int) $user->id_users === 1) {
            throw ValidationException::withMessages([
                'pengguna' => 'Akun Admin utama tidak dapat dihapus.',
            ]);
        }

        if ((int) $user->id_users === (int) auth()->id()) {
            throw ValidationException::withMessages([
                'pengguna' => 'Akun yang sedang digunakan tidak dapat dihapus.',
            ]);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil dihapus.',
        ]);
    }
}
