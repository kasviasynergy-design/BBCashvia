<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KelasController extends Controller
{
    /**
     * Mengambil daftar kelas beserta jumlah siswa per kelas.
     */
    public function index(): JsonResponse
    {
        $kelas = Kelas::withCount('siswa')
            ->orderBy('nama_kelas')
            ->get()
            ->map(function (Kelas $item) {
                return [
                    'id_kelas' => $item->id_kelas,
                    'nama_kelas' => $item->nama_kelas,
                    'tingkat' => $item->tingkat,
                    'tahun_ajaran' => $item->tahun_ajaran,
                    'jumlah_siswa' => (int) $item->siswa_count,
                ];
            });

        return response()->json([
            'data' => $kelas,
        ]);
    }

    /**
     * Menambahkan kelas.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_kelas' => [
                'required',
                'string',
                'max:50',
            ],
            'tingkat' => [
                'nullable',
                'string',
                'max:20',
            ],
            'tahun_ajaran' => [
                'nullable',
                'string',
                'max:20',
            ],
        ], [
            'nama_kelas.required' => 'Nama kelas wajib diisi.',
            'nama_kelas.max' => 'Nama kelas maksimal 50 karakter.',
            'tingkat.max' => 'Tingkat maksimal 20 karakter.',
            'tahun_ajaran.max' => 'Tahun ajaran maksimal 20 karakter.',
        ]);

        $kelas = Kelas::create([
            'nama_kelas' => $validated['nama_kelas'],
            'tingkat' => $validated['tingkat'] ?? null,
            'tahun_ajaran' => $validated['tahun_ajaran'] ?? null,
        ]);

        return response()->json([
            'message' => 'Data kelas berhasil ditambahkan.',
            'data' => [
                'id_kelas' => $kelas->id_kelas,
                'nama_kelas' => $kelas->nama_kelas,
                'tingkat' => $kelas->tingkat,
                'tahun_ajaran' => $kelas->tahun_ajaran,
                'jumlah_siswa' => 0,
            ],
        ], 201);
    }

    /**
     * Memperbarui kelas.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $kelas = Kelas::findOrFail($id);

        $validated = $request->validate([
            'nama_kelas' => [
                'required',
                'string',
                'max:50',
            ],
            'tingkat' => [
                'nullable',
                'string',
                'max:20',
            ],
            'tahun_ajaran' => [
                'nullable',
                'string',
                'max:20',
            ],
        ], [
            'nama_kelas.required' => 'Nama kelas wajib diisi.',
            'nama_kelas.max' => 'Nama kelas maksimal 50 karakter.',
            'tingkat.max' => 'Tingkat maksimal 20 karakter.',
            'tahun_ajaran.max' => 'Tahun ajaran maksimal 20 karakter.',
        ]);

        $kelas->update([
            'nama_kelas' => $validated['nama_kelas'],
            'tingkat' => $validated['tingkat'] ?? null,
            'tahun_ajaran' => $validated['tahun_ajaran'] ?? null,
        ]);

        return response()->json([
            'message' => 'Data kelas berhasil diperbarui.',
            'data' => [
                'id_kelas' => $kelas->id_kelas,
                'nama_kelas' => $kelas->nama_kelas,
                'tingkat' => $kelas->tingkat,
                'tahun_ajaran' => $kelas->tahun_ajaran,
                'jumlah_siswa' => (int) $kelas->siswa()->count(),
            ],
        ]);
    }

    /**
     * Menghapus kelas jika belum memiliki siswa.
     */
    public function destroy(string $id): JsonResponse
    {
        $kelas = Kelas::findOrFail($id);

        if ($kelas->siswa()->exists()) {
            return response()->json([
                'message' => 'Kelas tidak dapat dihapus karena masih memiliki siswa.',
            ], 409);
        }

        $kelas->delete();

        return response()->json([
            'message' => 'Data kelas berhasil dihapus.',
        ]);
    }
}
