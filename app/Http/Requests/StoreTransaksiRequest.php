<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransaksiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

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
                'exists:users,id_users',
            ],

            'id_siswa' => [
                'nullable',
                'integer',
                'exists:siswa,id_siswa',
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
                Rule::in(['TF', 'CH']),
            ],

            'jenis' => [
                'required',
                Rule::in(['M', 'K']),
            ],

            'kategori' => [
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

            'Detail' => [
                'required',
                'string',
            ],

            'bukti_file' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:2048',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'no_bukti.required' => 'Nomor bukti transaksi wajib diisi.',
            'no_bukti.unique' => 'Nomor bukti transaksi sudah digunakan.',
            'no_bukti.max' => 'Nomor bukti maksimal 30 karakter.',

            'id_user.required' => 'ID pengguna wajib diisi.',
            'id_user.exists' => 'Data pengguna tidak ditemukan.',
            'id_siswa.exists' => 'Data siswa tidak ditemukan.',
            'id_iuran.exists' => 'Data iuran tidak ditemukan.',

            'tanggal.required' => 'Tanggal transaksi wajib diisi.',
            'tanggal.date' => 'Format tanggal transaksi tidak valid.',

            'nominal.required' => 'Nominal transaksi wajib diisi.',
            'nominal.numeric' => 'Nominal transaksi harus berupa angka.',
            'nominal.min' => 'Nominal transaksi tidak boleh negatif.',

            'metode.required' => 'Metode transaksi wajib dipilih.',
            'metode.in' => 'Metode harus berupa TF (Transfer) atau CH (Cash).',

            'jenis.required' => 'Jenis transaksi wajib dipilih.',
            'jenis.in' => 'Jenis transaksi harus berupa M atau K.',

            'uang_diterima.required' => 'Uang diterima wajib diisi.',
            'uang_diterima.numeric' => 'Uang diterima harus berupa angka.',
            'uang_diterima.min' => 'Uang diterima tidak boleh negatif.',
            'uang_diterima.gte' => 'Uang diterima tidak boleh kurang dari nominal transaksi.',

            'Detail.required' => 'Detail transaksi wajib diisi.',
            'bukti_file.file' => 'Bukti transaksi harus berupa file.',
            'bukti_file.mimes' => 'Bukti harus berupa JPG, JPEG, PNG, atau PDF.',
            'bukti_file.max' => 'Ukuran bukti maksimal 2 MB.',
        ];
    }
}
