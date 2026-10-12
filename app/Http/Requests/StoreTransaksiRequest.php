<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransaksiRequest extends FormRequest
{
    /**
     * Menentukan apakah request diizinkan.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi transaksi BBCashvia.
     */
    public function rules(): array
    {
        return [
            'no_bukti' => [
                'required',
                'string',
                'max:30',
                Rule::unique('transaksi', 'no_bukti'),
            ],

            'id_user' => [
                'required',
                'integer',
                'min:1',
                'exists:users,id',
            ],

            'id_iuran' => [
                'nullable',
                'integer',
                'exists:iuran,id_iuran',
            ],

            'tanggal' => [
                'required',
                'date',
            ],

            'nominal' => [
                'required',
                'numeric',
                'min:0',
            ],

            'keterangan' => [
                'nullable',
                'string',
            ],

            'nama_pembayar' => [
                'nullable',
                'string',
                'max:100',
            ],

            'metode' => [
                'required',
                Rule::in(['TF', 'Q', 'TU']),
            ],

            'jenis' => [
                'required',
                Rule::in(['M', 'K']),
            ],

            'kategori' => [
                'nullable',
                'string',
                'max:50',
            ],

            'pic' => [
                'nullable',
                'string',
                'max:100',
            ],

            'periode' => [
                'nullable',
                'string',
                'max:20',
            ],

            'uang_diterima' => [
                'required',
                'numeric',
                'min:0',
                'gte:nominal',
            ],
        ];
    }

    /**
     * Pesan validasi dalam bahasa Indonesia.
     */
    public function messages(): array
    {
        return [
            'no_bukti.required' => 'Nomor bukti transaksi wajib diisi.',
            'no_bukti.unique' => 'Nomor bukti transaksi sudah digunakan.',
            'no_bukti.max' => 'Nomor bukti maksimal 30 karakter.',

            'id_user.required' => 'ID pengguna wajib diisi.',
            'id_user.integer' => 'ID pengguna harus berupa angka.',
            'id_user.min' => 'ID pengguna tidak valid.',
            'id_user.exists' => 'Data pengguna tidak ditemukan.',

            'id_iuran.integer' => 'ID iuran harus berupa angka.',
            'id_iuran.exists' => 'Data iuran tidak ditemukan.',

            'tanggal.required' => 'Tanggal transaksi wajib diisi.',
            'tanggal.date' => 'Format tanggal transaksi tidak valid.',

            'nominal.required' => 'Nominal transaksi wajib diisi.',
            'nominal.numeric' => 'Nominal transaksi harus berupa angka.',
            'nominal.min' => 'Nominal transaksi tidak boleh negatif.',

            'nama_pembayar.max' => 'Nama pembayar maksimal 100 karakter.',

            'metode.required' => 'Metode transaksi wajib dipilih.',
            'metode.in' => 'Metode harus berupa TF, Q, atau TU.',

            'jenis.required' => 'Jenis transaksi wajib dipilih.',
            'jenis.in' => 'Jenis transaksi harus berupa M atau K.',

            'kategori.max' => 'Kategori maksimal 50 karakter.',
            'pic.max' => 'PIC maksimal 100 karakter.',
            'periode.max' => 'Periode maksimal 20 karakter.',

            'uang_diterima.required' => 'Uang diterima wajib diisi.',
            'uang_diterima.numeric' => 'Uang diterima harus berupa angka.',
            'uang_diterima.min' => 'Uang diterima tidak boleh negatif.',
            'uang_diterima.gte' => 'Uang diterima tidak boleh kurang dari nominal transaksi.',
        ];
    }
}
