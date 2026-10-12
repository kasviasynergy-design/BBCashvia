<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadReceiptRequest extends FormRequest
{
    /**
     * Tentukan apakah request diizinkan.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi file bukti pembayaran.
     */
    public function rules(): array
    {
        return [
            'receipt_image' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ];
    }

    /**
     * Pesan validasi dalam bahasa Indonesia.
     */
    public function messages(): array
    {
        return [
            'receipt_image.required' => 'Bukti pembayaran wajib diunggah.',
            'receipt_image.file'     => 'Berkas bukti pembayaran tidak valid.',
            'receipt_image.image'    => 'Bukti pembayaran harus berupa gambar.',
            'receipt_image.mimes'    => 'Format bukti pembayaran harus JPG, JPEG, PNG, atau WEBP.',
            'receipt_image.max'      => 'Ukuran bukti pembayaran maksimal 2 MB.',
        ];
    }
}
