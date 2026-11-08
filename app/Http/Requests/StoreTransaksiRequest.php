<?php

namespace App\Http\Requests;

use App\Models\Iuran;
use App\Models\Transaksi;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StoreTransaksiRequest extends FormRequest
{
    /** Menandai bahwa permintaan ini mengirim banyak transaksi sekaligus. */
    public bool $modeBanyak = false;

    /** Cache master iuran agar satu kiriman tidak query berulang. */
    private array $iuranCache = [];

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Samakan kategori sebelum divalidasi, sehingga kiriman
     * dari UI (mis. "Kas") tetap cocok dengan enum database
     * ("kas").
     *
     * Mendukung dua bentuk payload:
     *  - satu transaksi (objek biasa) - perilaku lama, tetap jalan;
     *  - banyak transaksi sekaligus (`transaksi` berupa array).
     */
    protected function prepareForValidation(): void
    {
        $daftar = $this->input('transaksi');

        if (is_array($daftar)) {
            $this->modeBanyak = true;

            $dinormalisasi = [];

            foreach ($daftar as $baris) {
                $dinormalisasi[] = $this->normalisasiBaris(
                    is_array($baris) ? $baris : []
                );
            }

            $this->merge(['transaksi' => $dinormalisasi]);

            return;
        }

        if (!$this->has('kategori')) {
            return;
        }

        $dinormalisasi = $this->normalisasiBaris([
            'kategori' => $this->input('kategori'),
        ]);

        if (array_key_exists('kategori', $dinormalisasi)) {
            $this->merge(['kategori' => $dinormalisasi['kategori']]);
        }
    }

    /**
     * Menyamakan kategori satu baris transaksi dengan nilai enum.
     *
     * @param  array<string, mixed>  $baris
     * @return array<string, mixed>
     */
    private function normalisasiBaris(array $baris): array
    {
        $nilai = $baris['kategori'] ?? null;

        // Kosong tetap dibiarkan (nullable).
        if ($nilai === null || trim((string) $nilai) === '') {
            return $baris;
        }

        $normal = Transaksi::normalisasiKategori($nilai);

        // Bila dikenali, samakan dengan enum. Bila tidak, biarkan
        // nilai asli agar Rule::in menolaknya.
        if ($normal !== null) {
            $baris['kategori'] = $normal;
        }

        return $baris;
    }

    public function rules(): array
    {
        if ($this->modeBanyak) {
            return [
                'transaksi' => ['required', 'array', 'min:1', 'max:50'],
                'transaksi.*' => ['required', 'array'],
                'transaksi.*.no_bukti' => [
                    'nullable',
                    'string',
                    'max:30',
                ],
                'transaksi.*.id_siswa' => [
                    'nullable',
                    'integer',
                    'exists:siswa,id_siswa',
                ],
                'transaksi.*.id_kelas' => [
                    'nullable',
                    'integer',
                    'exists:kelas,id_kelas',
                ],
                'transaksi.*.id_iuran' => [
                    'nullable',
                    'integer',
                    'exists:iuran,id_iuran',
                ],
                'transaksi.*.tanggal' => ['required', 'date'],
                'transaksi.*.nominal' => ['required', 'numeric', 'min:0.01'],
                'transaksi.*.keterangan' => ['nullable', 'string'],
                'transaksi.*.nama_pembayar' => ['nullable', 'string', 'max:100'],
                'transaksi.*.metode' => ['nullable', Rule::in(['TF', 'CH'])],
                'transaksi.*.jenis' => ['required', Rule::in(Transaksi::JENIS)],
                'transaksi.*.kategori' => [
                    'nullable',
                    Rule::in(Transaksi::KATEGORI),
                ],
                'transaksi.*.periode' => ['nullable', 'string', 'max:20'],
                'transaksi.*.uang_diterima' => [
                    'nullable',
                    'numeric',
                    'min:0',
                ],
            ];
        }

        return [
            'no_bukti' => [
                'nullable',
                'string',
                'max:30',
                Rule::unique('transaksi', 'no_bukti'),
            ],

            'id_siswa' => [
                'nullable',
                'integer',
                'exists:siswa,id_siswa',
            ],

            'id_kelas' => [
                'nullable',
                'integer',
                'exists:kelas,id_kelas',
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
                'min:0.01',
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
                'nullable',
                Rule::in(['TF', 'CH']),
            ],

            'jenis' => [
                'required',
                Rule::in(Transaksi::JENIS),
            ],

            'kategori' => [
                'nullable',
                Rule::in(Transaksi::KATEGORI),
            ],

            'periode' => [
                'nullable',
                'string',
                'max:20',
            ],

            'uang_diterima' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'bukti_transaksi' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:2048',
            ],
        ];
    }

    /**
     * Pemeriksaan tambahan yang berlaku untuk kedua mode:
     * uang diterima tidak boleh kurang dari nominal, dan kategori
     * harus sesuai arah transaksi (pemasukan vs pengeluaran).
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($this->modeBanyak) {
                foreach ((array) $this->input('transaksi', []) as $index => $baris) {
                    $this->periksaBaris(
                        $validator,
                        is_array($baris) ? $baris : [],
                        "transaksi.{$index}."
                    );

                    $this->periksaNoBuktiBanyak(
                        $validator,
                        is_array($baris) ? $baris : [],
                        "transaksi.{$index}."
                    );
                }

                return;
            }

            $this->periksaBaris($validator, [
                'jenis' => $this->input('jenis'),
                'kategori' => $this->input('kategori'),
                'nominal' => $this->input('nominal'),
                'uang_diterima' => $this->input('uang_diterima'),
                'id_siswa' => $this->input('id_siswa'),
                'id_iuran' => $this->input('id_iuran'),
            ], '');
        });
    }

    /**
     * @param  array<string, mixed>  $baris
     */
    private function periksaBaris(
        Validator $validator,
        array $baris,
        string $prefix
    ): void {
        $nominal = $baris['nominal'] ?? null;
        $diterima = $baris['uang_diterima'] ?? null;

        if ($nominal !== null && $diterima !== null
            && is_numeric($nominal) && is_numeric($diterima)
            && (float) $diterima < (float) $nominal) {
            $validator->errors()->add(
                $prefix . 'uang_diterima',
                'Uang diterima tidak boleh kurang dari nominal transaksi.'
            );
        }

        $this->periksaPembayaranIuran($validator, $baris, $prefix);

        $jenis = $baris['jenis'] ?? null;
        $kategori = $baris['kategori'] ?? null;

        if ($jenis === null || $kategori === null || $kategori === '') {
            return;
        }

        if (!in_array($jenis, Transaksi::JENIS, true)) {
            return;
        }

        $kategoriSah = Transaksi::kategoriUntukJenis($jenis);

        if (!in_array($kategori, $kategoriSah, true)) {
            $validator->errors()->add(
                $prefix . 'kategori',
                Transaksi::jenisMasuk($jenis)
                    ? 'Kategori tersebut bukan kategori pemasukan.'
                    : 'Kategori tersebut bukan kategori pengeluaran.'
            );
        }
    }

    /**
     * Mode banyak menyimpan beberapa baris dengan satu `no_bukti`
     * sebagai satu grup. Nomor yang sudah ada di database harus
     * ditolak agar baris baru tidak menyatu dengan grup lama.
     *
     * @param  array<string, mixed>  $baris
     */
    private function periksaNoBuktiBanyak(
        Validator $validator,
        array $baris,
        string $prefix
    ): void {
        $noBukti = $baris['no_bukti'] ?? null;

        if ($noBukti === null || trim((string) $noBukti) === '') {
            return;
        }

        if (DB::table('transaksi')->where('no_bukti', $noBukti)->exists()) {
            $validator->errors()->add(
                $prefix . 'no_bukti',
                'Nomor bukti transaksi sudah digunakan.'
            );
        }
    }

    /**
     * Aturan pembayaran iuran: wajib terhubung ke siswa, hanya untuk
     * transaksi pemasukan, dan iuran harus masih berstatus Aktif.
     *
     * Pemeriksaan status di sini adalah lapis pertama. Controller
     * memeriksa ulang status iuran di dalam DB::transaction agar
     * perubahan status yang terjadi bersamaan tetap ditolak.
     *
     * @param  array<string, mixed>  $baris
     */
    private function periksaPembayaranIuran(
        Validator $validator,
        array $baris,
        string $prefix
    ): void {
        $idIuran = $baris['id_iuran'] ?? null;

        if ($idIuran === null || $idIuran === '') {
            return;
        }

        $idSiswa = $baris['id_siswa'] ?? null;

        if ($idSiswa === null || $idSiswa === '') {
            $validator->errors()->add(
                $prefix . 'id_siswa',
                'Siswa wajib dipilih untuk pembayaran iuran.'
            );
        }

        $jenis = $baris['jenis'] ?? null;

        if ($jenis !== null && !Transaksi::jenisMasuk((string) $jenis)) {
            $validator->errors()->add(
                $prefix . 'jenis',
                'Pembayaran iuran hanya dapat dicatat sebagai transaksi pemasukan.'
            );
        }

        $iuran = $this->cariIuran($idIuran);

        // ID iuran yang tidak ada sudah ditolak oleh aturan exists.
        if ($iuran === null) {
            return;
        }

        if (strtolower(trim((string) $iuran->status)) !== 'aktif') {
            $validator->errors()->add(
                $prefix . 'id_iuran',
                'Iuran ini sudah berstatus Selesai sehingga tidak dapat menerima pembayaran baru.'
            );

            return;
        }

        // Siswa harus berasal dari kelas iuran (bila iuran terikat kelas).
        if ($idSiswa !== null && $idSiswa !== '' && $iuran->id_kelas) {
            $idKelasSiswa = DB::table('siswa')
                ->where('id_siswa', $idSiswa)
                ->value('id_kelas');

            if ($idKelasSiswa !== null
                && (int) $idKelasSiswa !== (int) $iuran->id_kelas) {
                $validator->errors()->add(
                    $prefix . 'id_siswa',
                    'Siswa tidak terdaftar pada kelas iuran ini.'
                );
            }
        }
    }

    private function cariIuran($idIuran): ?Iuran
    {
        $kunci = (string) $idIuran;

        if (!array_key_exists($kunci, $this->iuranCache)) {
            $this->iuranCache[$kunci] = Iuran::find($idIuran);
        }

        return $this->iuranCache[$kunci];
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
            'nominal.min' => 'Nominal transaksi harus lebih dari 0.',

            'metode.in' => 'Metode harus berupa TF (Transfer) atau CH (Cash).',

            'kategori.in' => 'Kategori transaksi tidak dikenali.',

            'jenis.required' => 'Jenis transaksi wajib dipilih.',
            'jenis.in' => 'Jenis transaksi harus pemasukan atau pengeluaran.',

            'uang_diterima.numeric' => 'Uang diterima harus berupa angka.',
            'uang_diterima.min' => 'Uang diterima tidak boleh negatif.',

            'transaksi.required' => 'Minimal satu transaksi harus diisi.',
            'transaksi.min' => 'Minimal satu transaksi harus diisi.',
            'transaksi.max' => 'Maksimal 50 transaksi dalam satu kali simpan.',

            'transaksi.*.tanggal.required' => 'Tanggal transaksi wajib diisi.',
            'transaksi.*.nominal.required' => 'Nominal transaksi wajib diisi.',
            'transaksi.*.nominal.min' => 'Nominal transaksi harus lebih dari 0.',
            'transaksi.*.jenis.required' => 'Jenis transaksi wajib dipilih.',
            'transaksi.*.kategori.in' => 'Kategori transaksi tidak dikenali.',

            'Detail.required' => 'Detail transaksi wajib diisi.',
            'bukti_transaksi.file' => 'Bukti transaksi harus berupa file.',
            'bukti_transaksi.mimes' => 'Bukti harus berupa JPG, JPEG, PNG, atau PDF.',
            'bukti_transaksi.max' => 'Ukuran bukti maksimal 2 MB.',
        ];
    }
}
