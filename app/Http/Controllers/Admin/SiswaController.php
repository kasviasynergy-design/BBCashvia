<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SiswaController extends Controller
{
    /**
     * Mengambil data siswa dan daftar jurusan dari database.
     */
    public function index(): JsonResponse
    {
        $siswa = Siswa::with('kelas')
            ->orderBy('nis')
            ->get()
            ->map(function (Siswa $item) {
                return [
                    'id_siswa' => $item->id_siswa,
                    'nis' => $item->nis,
                    'nama' => $item->nama_siswa,
                    'id_kelas' => $item->id_kelas,
                    'kelas' => $item->kelas?->nama_kelas ?? '',
                    'status' => $item->status,
                ];
            });

        $kelas = Kelas::orderBy('nama_kelas')
            ->get(['id_kelas', 'nama_kelas']);

        return response()->json([
            'data' => $siswa,
            'kelas' => $kelas,
        ]);
    }

    /**
     * Menambahkan siswa.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nis' => [
                'required',
                'digits:4',
                'unique:siswa,nis',
            ],
            'nama' => [
                'required',
                'string',
                'min:3',
                'max:100',
            ],
            'id_kelas' => [
                'required',
                'integer',
                'exists:kelas,id_kelas',
            ],
        ], [
            'nis.required' => 'NIS wajib diisi.',
            'nis.digits' => 'NIS harus terdiri dari 4 angka.',
            'nis.unique' => 'NIS sudah digunakan siswa lain.',
            'nama.required' => 'Nama siswa wajib diisi.',
            'nama.min' => 'Nama siswa minimal 3 karakter.',
            'nama.max' => 'Nama siswa maksimal 100 karakter.',
            'id_kelas.required' => 'Jurusan wajib dipilih.',
            'id_kelas.exists' => 'Jurusan yang dipilih tidak ditemukan.',
        ]);

        $siswa = Siswa::create([
            'nis' => $validated['nis'],
            'nama_siswa' => trim($validated['nama']),
            'id_kelas' => $validated['id_kelas'],
            'status' => 'Aktif',
        ]);

        $siswa->load('kelas');

        return response()->json([
            'message' => 'Data siswa berhasil ditambahkan.',
            'data' => $this->formatSiswa($siswa),
        ], 201);
    }

    /**
     * Memperbarui siswa.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $siswa = Siswa::findOrFail($id);

        $validated = $request->validate([
            'nis' => [
                'required',
                'digits:4',
                Rule::unique('siswa', 'nis')->ignore(
                    $siswa->id_siswa,
                    'id_siswa'
                ),
            ],
            'nama' => [
                'required',
                'string',
                'min:3',
                'max:100',
            ],
            'id_kelas' => [
                'required',
                'integer',
                'exists:kelas,id_kelas',
            ],
        ], [
            'nis.required' => 'NIS wajib diisi.',
            'nis.digits' => 'NIS harus terdiri dari 4 angka.',
            'nis.unique' => 'NIS sudah digunakan siswa lain.',
            'nama.required' => 'Nama siswa wajib diisi.',
            'nama.min' => 'Nama siswa minimal 3 karakter.',
            'nama.max' => 'Nama siswa maksimal 100 karakter.',
            'id_kelas.required' => 'Jurusan wajib dipilih.',
            'id_kelas.exists' => 'Jurusan yang dipilih tidak ditemukan.',
        ]);

        $siswa->update([
            'nis' => $validated['nis'],
            'nama_siswa' => trim($validated['nama']),
            'id_kelas' => $validated['id_kelas'],
        ]);

        $siswa->load('kelas');

        return response()->json([
            'message' => 'Data siswa berhasil diperbarui.',
            'data' => $this->formatSiswa($siswa),
        ]);
    }

    /**
     * Menghapus siswa tanpa menghapus riwayat transaksi.
     */
    public function destroy(string $id): JsonResponse
    {
        $siswa = Siswa::findOrFail($id);

        if ($siswa->transaksi()->exists()) {
            return response()->json([
                'message' => 'Siswa tidak dapat dihapus karena memiliki riwayat transaksi.',
            ], 422);
        }

        $siswa->delete();

        return response()->json([
            'message' => 'Data siswa berhasil dihapus.',
        ]);
    }

    /**
     * Format data yang dikirim ke frontend.
     */
    private function formatSiswa(Siswa $siswa): array
    {
        return [
            'id_siswa' => $siswa->id_siswa,
            'nis' => $siswa->nis,
            'nama' => $siswa->nama_siswa,
            'id_kelas' => $siswa->id_kelas,
            'kelas' => $siswa->kelas?->nama_kelas ?? '',
            'status' => $siswa->status,
        ];
    }
}
