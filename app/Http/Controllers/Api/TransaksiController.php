<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\MembatasiKelas;
use App\Http\Controllers\Concerns\MenghitungSaldoKas;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransaksiRequest;
use App\Models\DetailTransaksi;
use App\Models\Iuran;
use App\Models\Transaksi;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TransaksiController extends Controller
{
    use MembatasiKelas;
    use MenghitungSaldoKas;
    use \App\Http\Controllers\Concerns\MengunciIdempotensi;

    public function index(Request $request)
    {
        $transaksi = $this->transaksiTerbatas($request)
            ->with([
                'iuran:id_iuran,nama_iuran',
                'siswa:id_siswa,nis,nama_siswa',
                'kelas:id_kelas,nama_kelas',
                'user:id_users,name',
                'detailTransaksis:id_detail,id_transaksi,id_iuran,nama_iuran,nominal',
            ])
            ->orderByDesc('id_transaksi')
            ->get();

        // Ringkasan saldo dihitung di backend agar semua halaman
        // memakai angka yang sama (pemasukan dikurung pengeluaran).
        $ringkasan = $this->ringkasanSaldo($this->transaksiTerbatas($request));

        // =====================================================
        // KELOMPOK PEMBAYARAN (GRUP BERDASARKAN no_bukti)
        // =====================================================
        // Satu pembayaran yang mencakup beberapa iuran untuk satu
        // siswa disimpan sebagai beberapa baris transaksi dengan
        // `no_bukti` yang SAMA. Baris-baris itu harus tampil sebagai
        // SATU transaksi utama di Riwayat Kas, dengan rinciannya
        // ditampilkan pada modal detail.
        //
        // Transaksi biasa (satu baris per no_bukti) tetap tampil
        // seperti sebelumnya, sehingga data lama aman.
        $kelompok = $transaksi->groupBy('no_bukti');

        $data = $transaksi->map(function (Transaksi $t) use ($kelompok) {
            $anggota = $kelompok->get($t->no_bukti, collect());

            $baris = $t->toArray();

            $baris['rincian'] = $this->susunRincian($anggota);

            $baris['jumlah_rincian'] = $anggota->count();

            // Nominal transaksi utama = jumlah seluruh rincian
            // pada grup, bukan nominal satu baris saja.
            $baris['nominal_grup'] = (float) $anggota->sum('nominal');

            $baris['uang_diterima_grup'] = (float) $anggota
                ->sum(fn (Transaksi $r) => (float) ($r->uang_diterima ?? $r->nominal));

            // Nama siswa, NIS, dan kelas untuk halaman Riwayat/
            // Laporan (frontend menampilkan `nama_siswa` bila ada).
            $baris['nama_siswa'] = $t->siswa?->nama_siswa;
            $baris['nis'] = $t->siswa?->nis;
            $baris['nama_kelas'] = $t->kelas?->nama_kelas;

            // Pencatat diambil dari snapshot `nama_petugas` (tahan
            // terhadap akun yang sudah dihapus), lalu relasi pengguna,
            // lalu `pic` sebagai cadangan data sangat lama.
            $baris['dicatat_oleh'] = $t->nama_petugas
                ?: ($t->user?->name ?: ($t->pic ?: null));

            // Status pembayaran (Lunas/Cicilan) dihitung dari
            // akumulasi seluruh pembayaran pasangan (id_siswa,
            // id_iuran), lalu ditempel pada tiap rincian.
            $status = $this->lengkapiStatusRincian($baris['rincian'], $anggota);

            $baris['status_pembayaran'] = $status['status_pembayaran'];
            $baris['sisa_tagihan'] = $status['sisa_tagihan'];

            return $baris;
        })->values();

        return response()->json([
            'success' => true,
            'message' => 'Data transaksi berhasil diambil.',
            'data' => $data,
            'ringkasan' => $ringkasan,
        ]);
    }

    /**
     * Daftar kategori transaksi dari SATU sumber (model Transaksi),
     * lengkap dengan pengelompokan jenis.
     *
     * Dipakai form Tambah Transaksi dan dropdown filter supaya
     * pilihan kategori di antarmuka selalu sama persis dengan
     * aturan server, tanpa daftar ganda di JavaScript.
     */
    public function kategori()
    {
        $petakan = fn (array $daftar) => array_map(
            fn (string $nilai) => [
                'value' => $nilai,
                'label' => Transaksi::labelKategori($nilai),
            ],
            $daftar
        );

        $masuk = $petakan(Transaksi::KATEGORI_MASUK);
        $keluar = $petakan(Transaksi::kategoriKeluar());

        return response()->json([
            'success' => true,
            'message' => 'Daftar kategori transaksi.',
            'data' => [
                'masuk' => $masuk,
                'keluar' => $keluar,
                'semua' => array_merge($masuk, $keluar),
            ],
        ]);
    }

    public function store(StoreTransaksiRequest $request)
    {
        /* =====================================================
           S3-07 - PENGAMAN SIMPAN GANDA (IDEMPOTENSI)
           Satu identitas permintaan hanya menyimpan satu kali.
           Klik berulang / permintaan hampir bersamaan dijawab
           dengan tanggapan yang sama tanpa menyimpan data baru.
           ===================================================== */
        $tanggapanDuplikat = $this->klaimIdempotensi($request);

        if ($tanggapanDuplikat !== null) {
            return $tanggapanDuplikat;
        }

        try {
            // Panggil seluruh logika penyimpanan lama (dipertahankan);
            // hanya pembungkus guard yang ditambahkan di sini.
            return $this->simpanStore($request);
        } catch (\Throwable $e) {
            // Proses gagal → lepaskan klaim agar boleh dicoba lagi.
            $this->lepaskanIdempotensi($request);
            throw $e;
        }
    }

    /**
     * Logika penyimpanan asli store(). Dipindah utuh lama, hanya
     * respons akhir dibungkus `responIdempotensi()` agar tanggapan
     * sukses ikut di-catat oleh pengaman simpan ganda.
     */
    private function simpanStore(StoreTransaksiRequest $request)
    {
        $validated = $request->validated();

        // Identitas pencatat TIDAK pernah diambil dari kiriman klien.
        // Nilai lama `pic` tetap dipertahankan hanya untuk data historis;
        // transaksi baru selalu memakai pengguna yang sedang login.
        unset($validated['pic'], $validated['id_user']);

        // Viewer hanya boleh melihat data. Pembayaran iuran adalah aksi
        // tulis, sehingga ditolak di backend meskipun UI tidak
        // menampilkannya.
        $barisDiperiksa = $request->modeBanyak
            ? ($validated['transaksi'] ?? [])
            : [$validated];

        $adaPembayaranIuran = collect($barisDiperiksa)->contains(
            fn ($baris) => is_array($baris) && !empty($baris['id_iuran'])
        );

        if ($adaPembayaranIuran
            && strtolower((string) (auth()->user()?->role)) === 'viewer') {
            $respons = response()->json([
                'success' => false,
                'message' => 'Viewer hanya dapat melihat data dan tidak dapat mencatat pembayaran iuran.',
            ], 403);

            return $this->responIdempotensi($request, $respons);
        }

        // =====================================================
        // MODE BANYAK TRANSAKSI SEKALIGUS
        // =====================================================
        if ($request->modeBanyak) {
            $respons = $this->simpanBanyak($request, $validated['transaksi']);

            return $this->responIdempotensi($request, $respons);
        }

        // =====================================================
        // MODE SATU TRANSAKSI (perilaku lama dipertahankan)
        // =====================================================

        // Kolom "Detail" tidak ada di tabel transaksi.
        unset($validated['Detail']);

        // Nomor bukti & pengguna diisi di server (jangan percaya input klien).
        if (empty($validated['no_bukti'])) {
            $validated['no_bukti'] = $this->buatNoBukti();
        }

        $validated['id_user'] = auth()->id();
        $validated['nama_petugas'] = auth()->user()?->name;

        // Kelas transaksi: non-admin dipaksa kelasnya sendiri; admin boleh
        // memilih, atau otomatis dari siswa terkait bila tidak diisi.
        $idKelas = $this->kelasDibatasi($request);

        if ($idKelas === -1) {
            // 4xx → `responIdempotensi` melepaskan klaim agar boleh
            // dicoba lagi setelah kelas dizinkan admin.
            $respons = response()->json([
                'success' => false,
                'message' => 'Kelas Anda belum ditetapkan oleh admin.',
            ], 403);

            return $this->responIdempotensi($request, $respons);
        }

        if ($idKelas === null) {
            $idKelas = $validated['id_kelas']
                ?? $this->kelasDariSiswa($validated['id_siswa'] ?? null);
        }

        $validated['id_kelas'] = $idKelas;

        $validated = $this->lengkapiNominal($validated);

        if (empty($validated['metode'])) {
            $validated['metode'] = 'CH';
        }

        if ($request->hasFile('bukti_transaksi')) {
            $validated['bukti_transaksi'] = $request->file('bukti_transaksi')
                ->store('bukti-transaksi', 'public');
        }

        $transaksi = DB::transaction(function () use ($validated) {
            // Sisa tagihan dicek di dalam transaksi database (baris
            // pembayaran lama terkunci) agar cicilan tidak bisa melebihi
            // tagihan, termasuk saat dua pembayaran masuk bersamaan.
            $this->validasiSisaTagihan([$validated]);

            $transaksi = Transaksi::create($validated);

            // Rincian pembayaran iuran ikut tersimpan pada tabel
            // detail_transaksi yang sudah ada - dalam transaksi
            // database yang sama agar utama dan detail selalu
            // konsisten (bila gagal, tidak ada yang tersimpan).
            $this->simpanDetail($transaksi);

            return $transaksi;
        });

        $respons = response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil ditambahkan.',
            'data' => $transaksi,
        ], 201);

        // S3-07: catat tanggapan untuk permintaan identik berikutnya.
        return $this->responIdempotensi($request, $respons);
    }

    /**
     * Menyimpan beberapa transaksi sekaligus dalam satu transaksi
     * database. Bila satu baris gagal, tidak ada yang tersimpan.
     *
     * Baris dikelompokkan per SISWA: seluruh iuran milik satu siswa
     * dalam satu kali simpan memakai satu `no_bukti`, sedangkan siswa
     * lain mendapat nomor bukti sendiri. Dengan begitu setiap siswa
     * memiliki satu transaksi utama dan riwayat yang terpisah, sementara
     * pembayaran multi-iuran satu siswa tetap tampil sebagai satu grup.
     *
     * Baris tanpa siswa (kas/pengeluaran umum) memakai satu nomor bukti
     * bersama. Baris yang sudah membawa `no_bukti` sendiri tetap
     * dihormati, tetapi tidak boleh dipakai dua siswa berbeda.
     *
     * @param  array<int, array<string, mixed>>  $baris
     */
    private function simpanBanyak(StoreTransaksiRequest $request, array $baris)
    {
        $idKelasDibatasi = $this->kelasDibatasi($request);

        if ($idKelasDibatasi === -1) {
            return response()->json([
                'success' => false,
                'message' => 'Kelas Anda belum ditetapkan oleh admin.',
            ], 403);
        }

        $idUser = auth()->id();
        $namaPetugas = auth()->user()?->name;

        // Nomor bukti cadangan untuk baris tanpa siswa.
        $noBuktiUmum = $this->buatNoBukti();

        $transaksi = DB::transaction(function () use (
            $baris,
            $idKelasDibatasi,
            $idUser,
            $namaPetugas,
            $noBuktiUmum
        ) {
            $hasil = [];

            // Sisa tagihan seluruh batch dicek di depan (dengan kunci
            // baris pembayaran) supaya cicilan dalam satu kali simpan
            // juga tidak melebihi tagihan.
            $this->validasiSisaTagihan($baris);

            $noBuktiPerSiswa = [];
            $pemilikNoBukti = [];

            foreach ($baris as $item) {
                // Kolom "Detail" tidak ada di tabel transaksi. Identitas
                // pencatat juga diabaikan dari klien dan diisi dari sesi.
                unset($item['Detail'], $item['pic'], $item['id_user']);

                $idSiswa = !empty($item['id_siswa'])
                    ? (int) $item['id_siswa']
                    : null;

                $kunciSiswa = $idSiswa !== null
                    ? 'siswa:' . $idSiswa
                    : 'umum';

                $noBuktiEksplisit = trim((string) ($item['no_bukti'] ?? ''));

                if ($noBuktiEksplisit !== '') {
                    if (isset($pemilikNoBukti[$noBuktiEksplisit])
                        && $pemilikNoBukti[$noBuktiEksplisit] !== $kunciSiswa) {
                        throw new HttpResponseException(
                            response()->json([
                                'success' => false,
                                'message' => 'Satu nomor bukti tidak boleh dipakai untuk siswa yang berbeda.',
                                'errors' => [
                                    'no_bukti' => ['Nomor bukti sudah dipakai siswa lain pada kiriman ini.'],
                                ],
                            ], 422)
                        );
                    }

                    $pemilikNoBukti[$noBuktiEksplisit] = $kunciSiswa;
                    $item['no_bukti'] = $noBuktiEksplisit;
                } else {
                    if (!isset($noBuktiPerSiswa[$kunciSiswa])) {
                        $noBuktiPerSiswa[$kunciSiswa] = $kunciSiswa === 'umum'
                            ? $noBuktiUmum
                            : $this->buatNoBukti();
                    }

                    $item['no_bukti'] = $noBuktiPerSiswa[$kunciSiswa];
                }

                $item['id_user'] = $idUser;
                $item['nama_petugas'] = $namaPetugas;

                $idKelas = $idKelasDibatasi;

                if ($idKelas === null) {
                    $idKelas = $item['id_kelas']
                        ?? $this->kelasDariSiswa($idSiswa);
                }

                $item['id_kelas'] = $idKelas;

                $item = $this->lengkapiNominal($item);

                if (empty($item['metode'])) {
                    $item['metode'] = 'CH';
                }

                // Rincian setiap baris iuran juga disimpan pada tabel
                // detail_transaksi yang sudah ada, dalam transaksi
                // database yang sama sehingga tetap konsisten.
                $transaksiBaru = Transaksi::create($item);
                $this->simpanDetail($transaksiBaru);

                $hasil[] = $transaksiBaru;
            }

            return $hasil;
        });

        $buktiPerSiswa = collect($transaksi)
            ->groupBy(fn (Transaksi $t) => $t->id_siswa !== null
                ? (string) $t->id_siswa
                : 'umum')
            ->map(fn ($grup) => $grup->first()->no_bukti);

        $buktiUnik = collect($transaksi)
            ->pluck('no_bukti')
            ->filter()
            ->unique()
            ->values();

        return response()->json([
            'success' => true,
            'message' => count($transaksi) . ' baris transaksi berhasil disimpan untuk '
                . $buktiPerSiswa->count() . ' kelompok pembayaran.',
            'data' => $transaksi,
            'jumlah' => count($transaksi),
            // Dipertahankan untuk kiriman satu kelompok (perilaku lama).
            'no_bukti' => $buktiUnik->count() === 1 ? $buktiUnik->first() : null,
            'no_bukti_per_siswa' => $buktiPerSiswa,
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $transaksi = $this->transaksiTerbatas($request)
            ->with([
                'iuran:id_iuran,nama_iuran',
                'siswa:id_siswa,nis,nama_siswa',
                'kelas:id_kelas,nama_kelas',
                'user:id_users,name',
                'detailTransaksis:id_detail,id_transaksi,id_iuran,nama_iuran,nominal',
            ])
            ->find($id);

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan.',
            ], 404);
        }

        // Sertakan rincian grup (baris dengan no_bukti sama) agar
        // modal detail dapat menampilkan seluruh pembayaran iuran
        // yang terhubung dengan transaksi utama ini.
        $anggota = $this->transaksiTerbatas($request)
            ->with([
                'iuran:id_iuran,nama_iuran',
                'siswa:id_siswa,nis,nama_siswa',
                'kelas:id_kelas,nama_kelas',
                'user:id_users,name',
                'detailTransaksis:id_detail,id_transaksi,id_iuran,nama_iuran,nominal',
            ])
            ->where('no_bukti', $transaksi->no_bukti)
            ->orderBy('id_transaksi')
            ->get();

        $data = $transaksi->toArray();

        // Rincian dibaca dari tabel detail_transaksi (relasi
        // detailTransaksis); data lama tanpa detail tetap tampil.
        $data['rincian'] = $this->susunRincian($anggota);

        $data['jumlah_rincian'] = $anggota->count();

        $data['nominal_grup'] = (float) $anggota->sum('nominal');

        $data['uang_diterima_grup'] = (float) $anggota
            ->sum(fn (Transaksi $r) => (float) ($r->uang_diterima ?? $r->nominal));

        // Nama siswa, NIS, dan kelas untuk modal "Lihat Detail".
        $data['nama_siswa'] = $transaksi->siswa?->nama_siswa;
        $data['nis'] = $transaksi->siswa?->nis;
        $data['nama_kelas'] = $transaksi->kelas?->nama_kelas;

        // Pencatat dari snapshot; `pic` hanya cadangan data lama.
        $data['dicatat_oleh'] = $transaksi->nama_petugas
            ?: ($transaksi->user?->name ?: ($transaksi->pic ?: null));

        // Status pembayaran (Lunas/Cicilan) + sisa tagihan tiap rincian.
        $status = $this->lengkapiStatusRincian($data['rincian'], $anggota);

        $data['status_pembayaran'] = $status['status_pembayaran'];
        $data['sisa_tagihan'] = $status['sisa_tagihan'];

        return response()->json([
            'success' => true,
            'message' => 'Data transaksi berhasil diambil.',
            'data' => $data,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $transaksi = $this->transaksiTerbatas($request)->find($id);

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan.',
            ], 404);
        }

        // Samakan kategori (huruf besar/kecil) dengan enum database.
        // Nilai tak dikenal dibiarkan agar ditolak Rule::in.
        if ($request->has('kategori')) {
            $normal = Transaksi::normalisasiKategori(
                $request->input('kategori')
            );

            if ($normal !== null) {
                $request->merge(['kategori' => $normal]);
            }
        }

        $validated = $request->validate([
            'no_bukti' => [
                'sometimes',
                'required',
                'string',
                'max:30',
            ],

            'id_siswa' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:siswa,id_siswa',
            ],

            'id_kelas' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:kelas,id_kelas',
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
                Rule::in(Transaksi::JENIS),
            ],

            'kategori' => [
                'sometimes',
                'nullable',
                Rule::in(Transaksi::KATEGORI),
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

            'bukti_transaksi' => [
                'sometimes',
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:2048',
            ],
        ]);

        // `no_bukti` sengaja tidak UNIQUE karena satu nota dapat dipakai
        // beberapa baris (grup pembayaran banyak). Saat mengubah satu
        // baris, nomor yang sama dengan grupnya sendiri harus boleh;
        // yang dilarang adalah memindahkan baris ke grup nota lain.
        if (array_key_exists('no_bukti', $validated)) {
            $noBuktiBaru = $validated['no_bukti'];

            if ($noBuktiBaru !== null
                && $noBuktiBaru !== ''
                && $noBuktiBaru !== $transaksi->no_bukti
                && DB::table('transaksi')
                    ->where('no_bukti', $noBuktiBaru)
                    ->exists()) {
                throw ValidationException::withMessages([
                    'no_bukti' => 'Nomor bukti transaksi sudah digunakan.',
                ]);
            }
        }

        // Pencatat asli dipertahankan saat transaksi diubah; identitas
        // dari klien tidak boleh menimpa siapa yang mencatat.
        unset($validated['id_user'], $validated['pic']);

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

        // Periksa iuran saat transaksi diubah. Status Selesai hanya
        // menghalangi perubahan nominal/relasi pembayaran, sehingga data
        // lama yang sudah terlanjur memakai iuran selesai tetap dapat
        // diperbaiki keterangannya tanpa mengubah nilai pembayaran.
        $infoPembayaran = $this->periksaPembayaranIuranSaatUbah(
            $transaksi,
            $validated
        );

        // Kelas transaksi: non-admin selalu terikat kelasnya; admin boleh
        // memindahkan, atau otomatis dari siswa terkait bila tidak diisi.
        $idKelas = $this->kelasDibatasi($request);

        if ($idKelas !== null) {
            $validated['id_kelas'] = $idKelas;
        } elseif (!array_key_exists('id_kelas', $validated)) {
            $validated['id_kelas'] = $this->kelasDariSiswa(
                $validated['id_siswa'] ?? $transaksi->id_siswa
            );
        }

        if ($request->hasFile('bukti_transaksi')) {
            if ($transaksi->bukti_transaksi) {
                Storage::disk('public')->delete($transaksi->bukti_transaksi);
            }

            $validated['bukti_transaksi'] = $request->file('bukti_transaksi')
                ->store('bukti-transaksi', 'public');
        } else {
            unset($validated['bukti_transaksi']);
        }

        $transaksi = DB::transaction(function () use (
            $transaksi,
            $validated,
            $infoPembayaran
        ) {
            // Hanya periksa sisa tagihan bila nominal/relasi pembayaran
            // benar-benar berubah. Perubahan keterangan pada data lama
            // tidak boleh ditolak hanya karena dulu tercatat melebihi
            // tagihan; data historis tetap dapat dipertahankan.
            if ($infoPembayaran['periksa_status'] ?? false) {
                // Baris yang sedang diubah dikecualikan agar nominal
                // lama tidak dihitung dua kali saat kenaikan diperiksa.
                $this->validasiSisaTagihan(
                    [array_merge(
                        $transaksi->only([
                            'id_siswa',
                            'id_iuran',
                            'jenis',
                            'nominal',
                        ]),
                        $validated
                    )],
                    (int) $transaksi->id_transaksi
                );
            }

            $transaksi->update($validated);
            $transaksi = $transaksi->fresh();

            // Rincian iuran harus ikut berubah saat id_iuran/nominal
            // diubah; tanpa ini detail lama tetap menunjuk iuran lama.
            $this->sinkronDetail($transaksi);

            return $transaksi;
        });

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil diperbarui.',
            'data' => $transaksi,
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $transaksi = $this->transaksiTerbatas($request)->find($id);

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

    /**
     * Melengkapi nominal & kembalian dari input UI.
     *
     * `uang_diterima` bersifat opsional; bila kosong dianggap sama
     * dengan nominal sehingga transaksi tetap tersimpan.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function lengkapiNominal(array $data): array
    {
        $nominal = (float) ($data['nominal'] ?? 0);

        $diterima = isset($data['uang_diterima']) && $data['uang_diterima'] !== ''
            ? (float) $data['uang_diterima']
            : $nominal;

        if ($diterima < $nominal) {
            $diterima = $nominal;
        }

        $data['nominal'] = $nominal;
        $data['uang_diterima'] = $diterima;
        $data['kembalian'] = $diterima - $nominal;

        return $data;
    }

    /**
     * Memeriksa relasi pembayaran iuran saat transaksi diubah.
     *
     * @param  array<string, mixed>  $validated
     * @return array{periksa_status: bool}
     */
    private function periksaPembayaranIuranSaatUbah(
        Transaksi $transaksi,
        array $validated
    ): array {
        $idIuran = array_key_exists('id_iuran', $validated)
            ? $validated['id_iuran']
            : $transaksi->id_iuran;

        if ($idIuran === null || $idIuran === '') {
            return ['periksa_status' => false];
        }

        $idSiswa = array_key_exists('id_siswa', $validated)
            ? $validated['id_siswa']
            : $transaksi->id_siswa;

        $jenis = (string) ($validated['jenis'] ?? $transaksi->jenis);

        $iuran = Iuran::find($idIuran);

        if (!$iuran) {
            throw ValidationException::withMessages([
                'id_iuran' => 'Data iuran tidak ditemukan.',
            ]);
        }

        $nominalBaru = (float) ($validated['nominal'] ?? $transaksi->nominal);

        $periksaStatus =
            (int) $idIuran !== (int) $transaksi->id_iuran ||
            (int) $idSiswa !== (int) $transaksi->id_siswa ||
            $jenis !== (string) $transaksi->jenis ||
            abs($nominalBaru - (float) $transaksi->nominal) > 0.009;

        if (($idSiswa === null || $idSiswa === '') && $periksaStatus) {
            throw ValidationException::withMessages([
                'id_siswa' => 'Siswa wajib dipilih untuk pembayaran iuran.',
            ]);
        }

        if ($periksaStatus && !Transaksi::jenisMasuk($jenis)) {
            throw ValidationException::withMessages([
                'jenis' => 'Pembayaran iuran hanya dapat dicatat sebagai transaksi pemasukan.',
            ]);
        }

        if ($periksaStatus
            && strtolower(trim((string) $iuran->status)) !== 'aktif') {
            throw ValidationException::withMessages([
                'id_iuran' => 'Iuran ini sudah berstatus Selesai sehingga tidak dapat menerima pembayaran baru.',
            ]);
        }

        if ($periksaStatus && $iuran->id_kelas) {
            $idKelasSiswa = \App\Models\Siswa::where('id_siswa', $idSiswa)
                ->value('id_kelas');

            if ($idKelasSiswa !== null
                && (int) $idKelasSiswa !== (int) $iuran->id_kelas) {
                throw ValidationException::withMessages([
                    'id_siswa' => 'Siswa tidak terdaftar pada kelas iuran ini.',
                ]);
            }
        }

        return ['periksa_status' => $periksaStatus];
    }

    /**
     * Validasi sisa tagihan pembayaran iuran (mendukung lunas & cicilan).
     *
     * Sisa tagihan = nominal iuran - jumlah seluruh transaksi pemasukan
     * yang sudah tercatat untuk pasangan (id_siswa, id_iuran). Pembayaran
     * boleh sebagian (cicilan) selama akumulasinya tidak melebihi tagihan.
     *
     * Harus dipanggil DI DALAM DB::transaction agar baris pembayaran lama
     * terkunci (`lockForUpdate`): dua pembayaran yang masuk bersamaan
     * tidak bisa sama-sama menembus batas tagihan.
     *
     * @param  array<int, array<string, mixed>>  $barisBatch
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    private function validasiSisaTagihan(
        array $barisBatch,
        ?int $kecualiIdTransaksi = null,
        bool $periksaStatusIuran = true
    ): void
    {
        // Kumpulkan kebutuhan pembayaran per pasangan (siswa, iuran) agar
        // beberapa baris dalam SATU kiriman dihitung sebagai satu total.
        $kebutuhan = [];

        foreach ($barisBatch as $baris) {
            $jenis = strtolower((string) ($baris['jenis'] ?? ''));

            if ($jenis !== Transaksi::JENIS_MASUK) {
                continue;
            }

            if (empty($baris['id_siswa']) || empty($baris['id_iuran'])) {
                continue;
            }

            $kunci = $baris['id_siswa'].'|'.$baris['id_iuran'];

            $kebutuhan[$kunci]['id_siswa'] = (int) $baris['id_siswa'];
            $kebutuhan[$kunci]['id_iuran'] = (int) $baris['id_iuran'];
            $kebutuhan[$kunci]['nominal'] = ($kebutuhan[$kunci]['nominal'] ?? 0)
                + (float) ($baris['nominal'] ?? 0);
        }

        if ($kebutuhan === []) {
            return;
        }

        $daftarIuran = Iuran::whereIn(
                'id_iuran',
                array_column($kebutuhan, 'id_iuran')
            )
            ->get()
            ->keyBy('id_iuran');

        foreach ($kebutuhan as $item) {
            $iuran = $daftarIuran->get($item['id_iuran']);

            // Iuran tidak dikenal sudah ditolak oleh validasi request.
            if (!$iuran) {
                continue;
            }

            // Pemeriksaan ulang status di dalam transaksi database:
            // status dapat berubah setelah validasi request berjalan.
            if ($periksaStatusIuran
                && strtolower(trim((string) $iuran->status)) !== 'aktif') {
                throw new HttpResponseException(
                    response()->json([
                        'success' => false,
                        'message' => 'Iuran ini sudah berstatus Selesai sehingga tidak dapat menerima pembayaran baru.',
                        'errors' => [
                            'id_iuran' => ['Iuran sudah berstatus Selesai.'],
                        ],
                    ], 422)
                );
            }

            // Siswa harus berasal dari kelas iuran (bila iuran terikat
            // kelas). Pemeriksaan ini mengulang aturan request agar
            // relasi yang tersimpan tetap valid.
            if ($iuran->id_kelas) {
                $idKelasSiswa = \App\Models\Siswa::where(
                    'id_siswa',
                    $item['id_siswa']
                )->value('id_kelas');

                if ($idKelasSiswa !== null
                    && (int) $idKelasSiswa !== (int) $iuran->id_kelas) {
                    throw new HttpResponseException(
                        response()->json([
                            'success' => false,
                            'message' => 'Siswa tidak terdaftar pada kelas iuran ini.',
                            'errors' => [
                                'id_siswa' => ['Siswa tidak terdaftar pada kelas iuran ini.'],
                            ],
                        ], 422)
                    );
                }
            }

            $tagihan = (float) $iuran->nominal;

            if ($tagihan <= 0) {
                if ($item['nominal'] > 0.009) {
                    throw new HttpResponseException(
                        response()->json([
                            'success' => false,
                            'message' => 'Iuran ini tidak memiliki tagihan nominal, sehingga tidak dapat menerima pembayaran.',
                            'errors' => [
                                'nominal' => ['Nominal iuran tidak valid.'],
                            ],
                        ], 422)
                    );
                }

                continue;
            }

            // Kunci baris pembayaran lama untuk pasangan ini: pembayaran
            // bersamaan akan menunggu, lalu membaca total terbaru.
            $queryTerbayar = Transaksi::query()
                ->where('id_siswa', $item['id_siswa'])
                ->where('id_iuran', $item['id_iuran'])
                ->where('jenis', Transaksi::JENIS_MASUK);

            if ($kecualiIdTransaksi !== null) {
                $queryTerbayar->where(
                    'id_transaksi',
                    '!=',
                    $kecualiIdTransaksi
                );
            }

            $terbayar = (float) $queryTerbayar
                ->lockForUpdate()
                ->sum('nominal');

            $sisa = $tagihan - $terbayar;

            if ($item['nominal'] > $sisa + 0.009) {
                throw new HttpResponseException(
                    response()->json([
                        'success' => false,
                        'message' => sprintf(
                            'Pembayaran melebihi sisa tagihan. Total tagihan Rp%s, sudah terbayar Rp%s, sisa Rp%s.',
                            number_format($tagihan, 0, ',', '.'),
                            number_format($terbayar, 0, ',', '.'),
                            number_format(max($sisa, 0), 0, ',', '.')
                        ),
                        'errors' => [
                            'nominal' => ['Nominal pembayaran melebihi sisa tagihan.'],
                        ],
                    ], 422)
                );
            }
        }
    }

    /**
     * Membuat nomor bukti unik untuk transaksi baru.
     */
    private function buatNoBukti(): string
    {
        do {
            $kode = 'TRX-'
                . now()->format('ymdHis')
                . random_int(100, 999);
        } while (Transaksi::where('no_bukti', $kode)->exists());

        return $kode;
    }

    /**
     * Menyimpulkan kelas dari siswa terkait (bila ada).
     */
    private function kelasDariSiswa($idSiswa): ?int
    {
        if (empty($idSiswa)) {
            return null;
        }

        $idKelas = \App\Models\Siswa::where('id_siswa', $idSiswa)
            ->value('id_kelas');

        return $idKelas !== null ? (int) $idKelas : null;
    }

    /**
     * Menyimpan rincian pembayaran iuran ke tabel `detail_transaksi`
     * yang sudah ada di database.
     *
     * Satu baris transaksi = satu rincian: nama iuran + nominal yang
     * dibayarkan PADA transaksi ini. Cicilan berikutnya membuat baris
     * transaksi dan rincian sendiri - rincian per pembayaran tetap
     * bisa ditelusuri dan riwayat pembayaran tetap lengkap.
     *
     * Harus dipanggil DI DALAM DB::transaction bersama pembuatan
     * transaksi utamanya. Panggilan ini tidak memengaruhi perhitungan
     * saldo kas (laporan tetap menghitung tabel `transaksi` saja).
     */
    private function simpanDetail(Transaksi $transaksi): void
    {
        $this->sinkronDetail($transaksi);
    }

    /**
     * Menyelaraskan rincian iuran dengan transaksi induknya.
     *
     * Dipakai saat membuat transaksi baru (belum ada rincian) dan saat
     * mengubah transaksi (id_iuran/nominal dapat berubah). Satu baris
     * transaksi = satu rincian; baris detail ganda dari data lama
     * dirapikan agar tidak dihitung dua kali.
     */
    private function sinkronDetail(Transaksi $transaksi): void
    {
        $detail = DetailTransaksi::query()
            ->where('id_transaksi', $transaksi->id_transaksi)
            ->orderBy('id_detail')
            ->get();

        if (empty($transaksi->id_iuran)) {
            // Bukan pembayaran iuran (kas / pengeluaran umum) -
            // rincian lama tidak boleh tertinggal.
            $detail->each->delete();

            return;
        }

        $namaIuran = $transaksi->iuran?->nama_iuran;

        if ($namaIuran === null) {
            $namaIuran = Iuran::where(
                'id_iuran',
                (int) $transaksi->id_iuran
            )->value('nama_iuran');
        }

        $data = [
            'id_iuran' => $transaksi->id_iuran,
            'nama_iuran' => (string) $namaIuran,
            'nominal' => (float) $transaksi->nominal,
        ];

        $utama = $detail->first();

        if ($utama) {
            $utama->update($data);
            $detail->slice(1)->each->delete();

            return;
        }

        DetailTransaksi::create(array_merge($data, [
            'id_transaksi' => $transaksi->id_transaksi,
        ]));
    }

    /**
     * Menyusun daftar rincian transaksi untuk API.
     *
     * Sumber utama adalah tabel `detail_transaksi` (relasi
     * detailTransaksis) yang digabung dari SELURUH baris grup.
     * Data lama yang belum punya baris detail tetap tampil dengan
     * rincian dari baris transaksinya sendiri (pola grup no_bukti).
     *
     * @param  iterable<int, Transaksi>  $anggota
     * @return array<int, array<string, mixed>>
     */
    private function susunRincian(iterable $anggota): array
    {
        $anggota = collect($anggota);

        $detail = $anggota->flatMap(
            fn (Transaksi $r) => $r->detailTransaksis
        );

        if ($detail->isNotEmpty()) {
            $perPembayaran = $anggota->keyBy('id_transaksi');

            return $detail
                ->map(function (DetailTransaksi $d) use ($perPembayaran) {
                    $pembayaran = $perPembayaran->get($d->id_transaksi);

                    return [
                        'id_detail' => (int) $d->id_detail,
                        'id_transaksi' => (int) $d->id_transaksi,
                        'id_iuran' => (int) $d->id_iuran,
                        'nama_iuran' => $d->nama_iuran,
                        'nominal' => (float) $d->nominal,
                        'periode' => $pembayaran?->periode,
                        'keterangan' => $pembayaran?->keterangan,
                    ];
                })
                ->values()
                ->all();
        }

        // Cadangan untuk data lama (belum punya baris detail).
        return $anggota
            ->map(fn (Transaksi $r) => [
                'id_transaksi' => $r->id_transaksi,
                'id_iuran' => $r->id_iuran,
                'nama_iuran' => $r->iuran?->nama_iuran,
                'periode' => $r->periode,
                'keterangan' => $r->keterangan,
                'nominal' => (float) $r->nominal,
            ])
            ->values()
            ->all();
    }

    /**
     * Menandai tiap rincian dengan status pembayaran serta rekap
     * status utama untuk transaksi ini.
     *
     * Status dihitung dari akumulasi SELURUH pembayaran untuk pasangan
     * (id_siswa, id_iuran) - bukan hanya baris ini - sehingga riwayat
     * pembayaran sebagian/berkala tetap benar:
     *   - tagihan terkumpul memenuhi nominal iuran → "Lunas";
     *   - belum memenuhi → "Cicilan" beserta sisa tagihan.
     *
     * Pengeluaran dan pembayaran non-iuran tidak diberi status (null)
     * sehingga tampilan tetap rapi. Perhitungan ini hanya untuk
     * tampilan; saldo kas tetap dari tabel `transaksi`.
     *
     * @param  array<int, array<string, mixed>>  $rincian  (by reference - setiap item diberi status)
     * @param  iterable<int, Transaksi>  $anggota
     * @return array{status_pembayaran: ?string, sisa_tagihan: ?float}
     */
    private function lengkapiStatusRincian(array &$rincian, iterable $anggota): array
    {
        $statusPembayaran = $this->statusPembayaranPerPasangan($anggota);

        if ($statusPembayaran === []) {
            return [
                'status_pembayaran' => null,
                'sisa_tagihan' => null,
            ];
        }

        // Peta id transaksi → kunci pasangan (id_siswa|id_iuran).
        $perBaris = [];

        foreach ($anggota as $t) {
            $perBaris[(int) $t->id_transaksi] = $t->id_siswa.'|'.$t->id_iuran;
        }

        $status = null;
        $sisa = 0.0;
        $punyaStatus = false;

        foreach ($rincian as $indeks => $r) {
            $kunci = $perBaris[(int) $r['id_transaksi']] ?? null;

            $info = $kunci !== null
                ? ($statusPembayaran[$kunci] ?? null)
                : null;

            $rincian[$indeks]['status_pembayaran'] = $info['status'] ?? null;

            $rincian[$indeks]['sisa_tagihan'] = $info['sisa_tagihan'] ?? null;

            if ($info !== null) {
                $punyaStatus = true;

                $sisa += (float) $info['sisa_tagihan'];

                if ($info['status'] === 'Cicilan') {
                    $status = 'Cicilan';
                }
            }
        }

        if (!$punyaStatus) {
            return [
                'status_pembayaran' => null,
                'sisa_tagihan' => null,
            ];
        }

        return [
            'status_pembayaran' => $status ?? 'Lunas',
            'sisa_tagihan' => $status === 'Cicilan' ? round($sisa, 2) : 0.0,
        ];
    }

    /**
     * Akumulasi pembayaran per pasangan (id_siswa, id_iuran) dengan
     * SATU query, lalu diubah menjadi status Lunas/Cicilan.
     *
     * Akumulasi membaca SELURUH transaksi pemasukan pasangan tersebut
     * (semua cicilan, lintas nomor bukti) sehingga riwayat pembayaran
     * yang sama sekali terpisah tetap dihitung sekali dengan benar.
     *
     * @param  iterable<int, Transaksi>  $anggota
     * @return array<string, array{status: string, sisa_tagihan: float, tagihan: float, terbayar: float}>
     */
    private function statusPembayaranPerPasangan(iterable $anggota): array
    {
        $pasangan = [];

        foreach ($anggota as $t) {
            if (
                $t->jenis === Transaksi::JENIS_MASUK
                && $t->id_siswa
                && $t->id_iuran
            ) {
                $pasangan[$t->id_siswa.'|'.$t->id_iuran] = [
                    (int) $t->id_siswa,
                    (int) $t->id_iuran,
                ];
            }
        }

        if ($pasangan === []) {
            return [];
        }

        $idsSiswa = array_values(array_unique(array_column($pasangan, 0)));

        $idsIuran = array_values(array_unique(array_column($pasangan, 1)));

        $tagihanIuran = Iuran::whereIn('id_iuran', $idsIuran)
            ->pluck('nominal', 'id_iuran');

        $terbayar = DB::table('transaksi')
            ->whereIn('id_siswa', $idsSiswa)
            ->whereIn('id_iuran', $idsIuran)
            ->where('jenis', Transaksi::JENIS_MASUK)
            ->selectRaw("CONCAT(id_siswa, '|', id_iuran) AS kunci")
            ->addSelect(DB::raw('SUM(nominal) AS total'))
            ->groupBy('kunci')
            ->pluck('total', 'kunci');

        $hasil = [];

        foreach ($pasangan as $kunci => [$idSiswa, $idIuran]) {
            $tagihan = (float) ($tagihanIuran[$idIuran] ?? 0);

            if ($tagihan <= 0) {
                continue;
            }

            $total = (float) ($terbayar[$kunci] ?? 0);

            $sisa = max(0.0, $tagihan - $total);

            $hasil[$kunci] = [
                'status' => $sisa > 0.009 ? 'Cicilan' : 'Lunas',
                'sisa_tagihan' => round($sisa, 2),
                'tagihan' => round($tagihan, 2),
                'terbayar' => round($total, 2),
            ];
        }

        return $hasil;
    }
}
