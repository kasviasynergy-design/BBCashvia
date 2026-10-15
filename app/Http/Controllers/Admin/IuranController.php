<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class IuranController extends Controller
{
    public function index(): JsonResponse
    {
        $iuran = DB::table('iuran')
            ->orderByDesc('id_iuran')
            ->get()
            ->map(function ($item) {
                return [
                    'id_iuran' => $item->id_iuran,
                    'nama_iuran' => $item->nama_iuran,
                    'keterangan' => $item->keterangan,
                    'jatuh_tempo' => $item->jatuh_tempo,
                    'kategori' => $item->kategori,
                    'nominal' => (float) $item->nominal,
                    'status' => $item->status,
                ];
            });

        return response()->json([
            'data' => $iuran,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_iuran' => ['required', 'string', 'max:100'],
            'keterangan' => ['nullable', 'string'],
            'jatuh_tempo' => ['nullable', 'date'],
            'kategori' => [
                'required',
                Rule::in([
                    'sekali bayar',
                    'mingguan',
                    'bulanan',
                    'tahunan',
                ]),
            ],
            'nominal' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],
            'status' => [
                'required',
                Rule::in(['aktif', 'selesai']),
            ],
        ]);

        $id = DB::table('iuran')->insertGetId($validated);

        return response()->json([
            'message' => 'Iuran berhasil ditambahkan.',
            'data' => DB::table('iuran')
                ->where('id_iuran', $id)
                ->first(),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $exists = DB::table('iuran')
            ->where('id_iuran', $id)
            ->exists();

        if (!$exists) {
            return response()->json([
                'message' => 'Data iuran tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'nama_iuran' => ['required', 'string', 'max:100'],
            'keterangan' => ['nullable', 'string'],
            'jatuh_tempo' => ['nullable', 'date'],
            'kategori' => [
                'required',
                Rule::in([
                    'sekali bayar',
                    'mingguan',
                    'bulanan',
                    'tahunan',
                ]),
            ],
            'nominal' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],
            'status' => [
                'required',
                Rule::in(['aktif', 'selesai']),
            ],
        ]);

        DB::table('iuran')
            ->where('id_iuran', $id)
            ->update($validated);

        return response()->json([
            'message' => 'Iuran berhasil diperbarui.',
            'data' => DB::table('iuran')
                ->where('id_iuran', $id)
                ->first(),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $exists = DB::table('iuran')
            ->where('id_iuran', $id)
            ->exists();

        if (!$exists) {
            return response()->json([
                'message' => 'Data iuran tidak ditemukan.',
            ], 404);
        }

        $dipakaiTransaksi = DB::table('transaksi')
            ->where('id_iuran', $id)
            ->exists();

        if ($dipakaiTransaksi) {
            return response()->json([
                'message' => 'Iuran tidak dapat dihapus karena sudah digunakan oleh transaksi.',
            ], 409);
        }

        DB::table('iuran')
            ->where('id_iuran', $id)
            ->delete();

        return response()->json([
            'message' => 'Iuran berhasil dihapus.',
        ]);
    }
}
