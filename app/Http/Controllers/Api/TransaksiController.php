<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransaksiRequest;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TransaksiController extends Controller
{
    /**
     * Menampilkan seluruh transaksi dalam format JSON.
     */
    public function index()
    {
        $transaksi = Transaksi::orderByDesc('id_transaksi')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data transaksi berhasil diambil.',
            'data' => $transaksi,
        ]);
    }

    /**
     * Menyimpan transaksi baru.
     */
    public function store(StoreTransaksiRequest $request)
    {
        $validated = $request->validated();

        $validated['kembalian'] =
            (float) $validated['uang_diterima']
            - (float) $validated['nominal'];

        $transaksi = DB::transaction(function () use ($validated) {
            return Transaksi::create($validated);
        });

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil ditambahkan.',
            'data' => $transaksi,
        ], 201);
    }

    /**
     * Menampilkan satu transaksi berdasarkan ID.
     */
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

    /**
     * Memperbarui transaksi.
     */
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
                'min:1',
                'exists:users,id',
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
                Rule::in(['TF', 'Q', 'TU']),
            ],

            'jenis' => [
                'sometimes',
                'required',
                Rule::in(['M', 'K']),
            ],

            'kategori' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
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
        ], [
            'no_bukti.required' => 'Nomor bukti transaksi wajib diisi.',
            'no_bukti.unique' => 'Nomor bukti transaksi sudah digunakan.',
            'id_user.exists' => 'Data pengguna tidak ditemukan.',
            'id_iuran.exists' => 'Data iuran tidak ditemukan.',
            'tanggal.required' => 'Tanggal transaksi wajib diisi.',
            'tanggal.date' => 'Format tanggal transaksi tidak valid.',
            'nominal.required' => 'Nominal transaksi wajib diisi.',
            'nominal.numeric' => 'Nominal transaksi harus berupa angka.',
            'nominal.min' => 'Nominal transaksi tidak boleh negatif.',
            'metode.required' => 'Metode transaksi wajib dipilih.',
            'metode.in' => 'Metode harus berupa TF, Q, atau TU.',
            'jenis.required' => 'Jenis transaksi wajib dipilih.',
            'jenis.in' => 'Jenis transaksi harus berupa M atau K.',
            'uang_diterima.required' => 'Uang diterima wajib diisi.',
            'uang_diterima.numeric' => 'Uang diterima harus berupa angka.',
            'uang_diterima.min' => 'Uang diterima tidak boleh negatif.',
        ]);

        $nominal = (float) (
            $validated['nominal'] ?? $transaksi->nominal
        );

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

    /**
     * Menghapus transaksi berdasarkan ID.
     */
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
