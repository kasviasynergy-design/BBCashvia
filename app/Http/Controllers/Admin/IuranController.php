<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\MembatasiKelas;
use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class IuranController extends Controller
{
    use MembatasiKelas;
    use \App\Http\Controllers\Concerns\MengunciIdempotensi;

    public function index(Request $request): JsonResponse
    {
        $query = DB::table('iuran')->orderByDesc('id_iuran');

        $idKelas = $this->kelasDibatasi($request);

        if ($idKelas !== null) {
            $query->where('id_kelas', $idKelas);
        }

        $iuran = $query->get()
            ->map(function ($item) use ($idKelas) {
                // Peserta iuran:
                // - iuran kelas  : seluruh siswa pada kelas tersebut;
                // - iuran global : seluruh siswa. Hanya admin yang
                //   melihatnya karena query non-admin dibatasi kelas.
                $siswaKelas = collect();

                if ($item->id_kelas) {
                    $siswaKelas = DB::table('siswa')
                        ->where('id_kelas', $item->id_kelas)
                        ->orderBy('nama_siswa')
                        ->get();
                } elseif ($idKelas === null) {
                    $siswaKelas = DB::table('siswa')
                        ->orderBy('nama_siswa')
                        ->get();
                }

                // Akumulasi pembayaran per siswa untuk iuran ini.
                // Hanya transaksi pemasukan yang tertaut ke iuran dan
                // kepada peserta sah yang dihitung. Pembayaran lama
                // lintas kelas tidak boleh membuat peserta kelas lain
                // tampak lunas.
                $pembayaran = DB::table('transaksi')
                    ->where('id_iuran', $item->id_iuran)
                    ->where('jenis', Transaksi::JENIS_MASUK)
                    ->whereNotNull('id_siswa')
                    ->whereIn('id_siswa', $siswaKelas->pluck('id_siswa'))
                    ->selectRaw('id_siswa, SUM(nominal) AS total')
                    ->groupBy('id_siswa')
                    ->pluck('total', 'id_siswa');

                $peserta = $siswaKelas->map(function ($s) use ($pembayaran, $item) {
                    $nominal = (float) $item->nominal;
                    $terbayar = (float) ($pembayaran[$s->id_siswa] ?? 0.0);

                    return [
                        'id_siswa' => $s->id_siswa,
                        'nama_siswa' => $s->nama_siswa,
                        'nis' => $s->nis,
                        'status_siswa' => $s->status,
                        'lunas' => $nominal <= 0.0
                            || $terbayar + 0.009 >= $nominal,
                        'terbayar' => $terbayar,
                        'sisa' => max(0.0, $nominal - $terbayar),
                        'nominal' => $nominal,
                    ];
                })->values()->all();

                // Jumlah siswa aktif pada kelas iuran (target penerima).
                $jumlahSiswa = collect($peserta)
                    ->where('status_siswa', 'Aktif')
                    ->count();

                // Terkumpul dihitung dari peserta aktif saja agar
                // sebanding dengan target (nominal x siswa aktif).
                // Pembayaran siswa nonaktif tetap tampil di rincian
                // peserta dan tetap masuk Laporan Kas.
                $terkumpul = (float) collect($peserta)
                    ->where('status_siswa', 'Aktif')
                    ->sum('terbayar');

                return [
                    'id_iuran' => $item->id_iuran,
                    'id_kelas' => $item->id_kelas,
                    'nama_iuran' => $item->nama_iuran,
                    'keterangan' => $item->keterangan,
                    'jatuh_tempo' => $item->jatuh_tempo,
                    'kategori' => $item->kategori,
                    'nominal' => (float) $item->nominal,
                    'status' => $item->status,
                    'jumlah_siswa' => $jumlahSiswa,
                    'target' => (float) $item->nominal * $jumlahSiswa,
                    'terkumpul' => $terkumpul,
                    'peserta' => $peserta,
                ];
            });

        return response()->json([
            'data' => $iuran,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        /* =====================================================
           S3-07 - PENGAMAN SIMPAN GANDA (IDEMPOTENSI)
           ===================================================== */
        $tanggapanDuplikat = $this->klaimIdempotensi($request);

        if ($tanggapanDuplikat !== null) {
            return $tanggapanDuplikat;
        }

        try {
            return $this->tambahIuran($request);
        } catch (\Throwable $e) {
            // Proses gagal → lepaskan klaim agar boleh dicoba lagi.
            $this->lepaskanIdempotensi($request);
            throw $e;
        }
    }

    /**
     * Logika penyimpanan iuran asli (utuh), hanya respons akhir yang
     * dibungkus pengaman idempotensi.
     */
    private function tambahIuran(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_iuran' => ['required', 'string', 'max:100'],
            'keterangan' => ['nullable', 'string'],
            'jatuh_tempo' => ['nullable', 'date'],
            'id_kelas' => ['nullable', 'integer', 'exists:kelas,id_kelas'],
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

        // Kelas mengikuti pengguna: admin boleh memilih, non-admin
        // otomatis terikat kelasnya sendiri.
        $idKelas = $this->kelasDibatasi($request) ?? ($validated['id_kelas'] ?? null);

        if ($idKelas === -1) {
            // 4xx → lepaskan klaim agar boleh dicoba lagi setelah
            // kelas dizinkan admin.
            $respons = response()->json([
                'message' => 'Kelas Anda belum ditetapkan oleh admin.',
            ], 403);

            return $this->responIdempotensi($request, $respons);
        }

        $data = [
            'id_kelas' => $idKelas,
            'nama_iuran' => $validated['nama_iuran'],
            'keterangan' => $validated['keterangan'] ?? null,
            'jatuh_tempo' => $validated['jatuh_tempo'] ?? null,
            'kategori' => $validated['kategori'],
            'nominal' => $validated['nominal'],
            'status' => $validated['status'],
        ];

        $id = DB::table('iuran')->insertGetId($data);

        $respons = response()->json([
            'message' => 'Iuran berhasil ditambahkan.',
            'data' => DB::table('iuran')
                ->where('id_iuran', $id)
                ->first(),
        ], 201);

        // S3-07: catat tanggapan untuk permintaan identik berikutnya.
        return $this->responIdempotensi($request, $respons);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $query = DB::table('iuran')->where('id_iuran', $id);

        $idKelas = $this->kelasDibatasi($request);

        if ($idKelas !== null) {
            $query->where('id_kelas', $idKelas);
        }

        $exists = (clone $query)->exists();

        if (!$exists) {
            return response()->json([
                'message' => 'Data iuran tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'nama_iuran' => ['required', 'string', 'max:100'],
            'keterangan' => ['nullable', 'string'],
            'jatuh_tempo' => ['nullable', 'date'],
            'id_kelas' => ['nullable', 'integer', 'exists:kelas,id_kelas'],
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

        // Admin boleh memindahkan iuran ke kelas lain; non-admin tetap
        // pada kelasnya sendiri.
        $idKelasBaru = $this->kelasDibatasi($request)
            ?? ($validated['id_kelas'] ?? null);

        // Iuran yang sudah dipakai transaksi tidak boleh dipindah
        // kelas (termasuk dijadikan global), karena transaksi lama
        // akan menunjuk iuran yang kelasnya berbeda.
        $iuranLama = DB::table('iuran')->where('id_iuran', $id)->first();

        if ($iuranLama
            && (int) $idKelasBaru !== (int) $iuranLama->id_kelas
            && DB::table('transaksi')->where('id_iuran', $id)->exists()) {
            return response()->json([
                'message' => 'Kelas iuran tidak dapat diubah karena iuran sudah digunakan oleh transaksi.',
            ], 409);
        }

        DB::table('iuran')
            ->where('id_iuran', $id)
            ->update([
                'id_kelas' => $idKelasBaru,
                'nama_iuran' => $validated['nama_iuran'],
                'keterangan' => $validated['keterangan'] ?? null,
                'jatuh_tempo' => $validated['jatuh_tempo'] ?? null,
                'kategori' => $validated['kategori'],
                'nominal' => $validated['nominal'],
                'status' => $validated['status'],
            ]);

        return response()->json([
            'message' => 'Iuran berhasil diperbarui.',
            'data' => DB::table('iuran')
                ->where('id_iuran', $id)
                ->first(),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $query = DB::table('iuran')->where('id_iuran', $id);

        $idKelas = $this->kelasDibatasi($request);

        if ($idKelas !== null) {
            $query->where('id_kelas', $idKelas);
        }

        if (!(clone $query)->exists()) {
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
