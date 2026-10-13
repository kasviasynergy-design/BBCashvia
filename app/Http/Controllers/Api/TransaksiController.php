<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransaksiRequest;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class TransaksiController extends Controller
{
    public function index()
    {
        $transaksi = Transaksi::orderByDesc('id_transaksi')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data transaksi berhasil diambil.',
            'data' => $transaksi,
        ]);
    }

    public function store(StoreTransaksiRequest $request)
    {
        $validated = $request->validated();

        $validated['kembalian'] =
            (float) $validated['uang_diterima']
            - (float) $validated['nominal'];

        if ($request->hasFile('bukti_file')) {
            $validated['bukti_file'] = $request->file('bukti_file')
                ->store('bukti-transaksi', 'public');
        }

        $transaksi = DB::transaction(function () use ($validated) {
            return Transaksi::create($validated);
        });

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil ditambahkan.',
            'data' => $transaksi,
        ], 201);
    }

    public function show(string $id)
    {
        $transaksi = Transaksi::find($id);

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data transaksi berhasil diambil.',
            'data' => $transaksi,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $transaksi = Transaksi::find($id);

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'no_bukti' => [
                'sometimes',
                'required',
                'string',
                'max:30',
                Rule::unique('transaksi', 'no_bukti')
                    ->ignore($transaksi->id_transaksi, 'id_transaksi'),
            ],

            'id_user' => [
                'sometimes',
                'required',
                'integer',
                'exists:users,id_users',
            ],

            'id_siswa' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:siswa,id_siswa',
            ],

            'id_iuran' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:iuran,id_iuran',
            ],

            'tanggal' => [
                'sometimes',
                'required',
                'date',
            ],

            'nominal' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
            ],

            'keterangan' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'nama_pembayar' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'metode' => [
                'sometimes',
                'required',
                Rule::in(['TF', 'CH']),
            ],

            'jenis' => [
                'sometimes',
                'required',
                Rule::in(['M', 'K']),
            ],

            'kategori' => [
                'sometimes',
                'nullable',
                Rule::in([
                    'Iuran',
                    'kas',
                    'kebutuhan kelas',
                    'perlengkapan kelas',
                    'kegiatan kelas',
                    'pemasukan lainnya',
                    'pengeluaran lainnya',
                ]),
            ],

            'pic' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'periode' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
            ],

            'uang_diterima' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
            ],

            'Detail' => [
                'sometimes',
                'required',
                'string',
            ],

            'bukti_file' => [
                'sometimes',
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:2048',
            ],
        ]);

        $nominal = (float) ($validated['nominal'] ?? $transaksi->nominal);
        $uangDiterima = (float) (
            $validated['uang_diterima'] ?? $transaksi->uang_diterima
        );

        if ($uangDiterima < $nominal) {
            return response()->json([
                'success' => false,
                'message' => 'Uang diterima tidak boleh kurang dari nominal transaksi.',
                'errors' => [
                    'uang_diterima' => [
                        'Uang diterima tidak boleh kurang dari nominal transaksi.',
                    ],
                ],
            ], 422);
        }

        $validated['kembalian'] = $uangDiterima - $nominal;

        if ($request->hasFile('bukti_file')) {
            if ($transaksi->bukti_file) {
                Storage::disk('public')->delete($transaksi->bukti_file);
            }

            $validated['bukti_file'] = $request->file('bukti_file')
                ->store('bukti-transaksi', 'public');
        } else {
            unset($validated['bukti_file']);
        }

        $transaksi = DB::transaction(function () use ($transaksi, $validated) {
            $transaksi->update($validated);

            return $transaksi->fresh();
        });

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil diperbarui.',
            'data' => $transaksi,
        ]);
    }

    public function destroy(string $id)
    {
        $transaksi = Transaksi::find($id);

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan.',
            ], 404);
        }

        DB::transaction(function () use ($transaksi) {
            $transaksi->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus.',
        ]);
    }
}
