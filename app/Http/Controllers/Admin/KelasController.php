<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\MembatasiKelas;
use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class KelasController extends Controller
{
    use MembatasiKelas;
    use \App\Http\Controllers\Concerns\MengunciIdempotensi;

    /**
     * Mengambil daftar kelas beserta jumlah siswa per kelas.
     *
     * Admin melihat seluruh kelas; bendahara & viewer hanya kelasnya.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Kelas::withCount('siswa')->orderBy('nama_kelas');

        $idKelas = $this->kelasDibatasi($request);

        if ($idKelas !== null) {
            $query->where('id_kelas', $idKelas);
        }

        $kelas = $query->get()
            ->map(function (Kelas $item) {
                return [
                    'id_kelas' => $item->id_kelas,
                    'nama_kelas' => $item->nama_kelas,
                    'tingkat' => $item->tingkat,
                    'tahun_ajaran' => $item->tahun_ajaran,
                    'jumlah_siswa' => (int) $item->siswa_count,
                ];
            });

        return response()->json([
            'data' => $kelas,
        ]);
    }

    /**
     * Menambahkan kelas.
     */
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
            return $this->tambahKelas($request);
        } catch (\Throwable $e) {
            // Proses gagal → lepaskan klaim agar boleh dicoba lagi.
            $this->lepaskanIdempotensi($request);
            throw $e;
        }
    }

    /**
     * Logika penyimpanan kelas asli (utuh), hanya respons akhir yang
     * dibungkus pengaman idempotensi.
     */
    private function tambahKelas(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_kelas' => [
                'required',
                'string',
                'max:50',
            ],
            'tingkat' => [
                'nullable',
                'string',
                'max:20',
            ],
            'tahun_ajaran' => [
                'nullable',
                'string',
                'max:20',
            ],
        ], [
            'nama_kelas.required' => 'Nama kelas wajib diisi.',
            'nama_kelas.max' => 'Nama kelas maksimal 50 karakter.',
            'tingkat.max' => 'Tingkat maksimal 20 karakter.',
            'tahun_ajaran.max' => 'Tahun ajaran maksimal 20 karakter.',
        ]);

        $kelas = Kelas::create([
            'nama_kelas' => $validated['nama_kelas'],
            'tingkat' => $validated['tingkat'] ?? null,
            'tahun_ajaran' => $validated['tahun_ajaran'] ?? null,
        ]);

        $respons = response()->json([
            'message' => 'Data kelas berhasil ditambahkan.',
            'data' => [
                'id_kelas' => $kelas->id_kelas,
                'nama_kelas' => $kelas->nama_kelas,
                'tingkat' => $kelas->tingkat,
                'tahun_ajaran' => $kelas->tahun_ajaran,
                'jumlah_siswa' => 0,
            ],
        ], 201);

        // S3-07: catat tanggapan untuk permintaan identik berikutnya.
        return $this->responIdempotensi($request, $respons);
    }

    /**
     * Memperbarui kelas.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Anti-IDOR: batasi berdasarkan batas kelas pengguna (admin
        // null = semua). Saat ini hanya admin yang sampai ke sini,
        // guard ini menjaga bila endpoint diperluas ke peran lain.
        $idKelas = $this->kelasDibatasi($request);

        $kelas = Kelas::query()
            ->when($idKelas !== null, fn ($q) => $q->where('id_kelas', $idKelas))
            ->find($id);

        if (!$kelas) {
            return response()->json([
                'message' => 'Data kelas tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'nama_kelas' => [
                'required',
                'string',
                'max:50',
            ],
            'tingkat' => [
                'nullable',
                'string',
                'max:20',
            ],
            'tahun_ajaran' => [
                'nullable',
                'string',
                'max:20',
            ],
        ], [
            'nama_kelas.required' => 'Nama kelas wajib diisi.',
            'nama_kelas.max' => 'Nama kelas maksimal 50 karakter.',
            'tingkat.max' => 'Tingkat maksimal 20 karakter.',
            'tahun_ajaran.max' => 'Tahun ajaran maksimal 20 karakter.',
        ]);

        $kelas->update([
            'nama_kelas' => $validated['nama_kelas'],
            'tingkat' => $validated['tingkat'] ?? null,
            'tahun_ajaran' => $validated['tahun_ajaran'] ?? null,
        ]);

        return response()->json([
            'message' => 'Data kelas berhasil diperbarui.',
            'data' => [
                'id_kelas' => $kelas->id_kelas,
                'nama_kelas' => $kelas->nama_kelas,
                'tingkat' => $kelas->tingkat,
                'tahun_ajaran' => $kelas->tahun_ajaran,
                'jumlah_siswa' => (int) $kelas->siswa()->count(),
            ],
        ]);
    }

    /**
     * Menghapus kelas jika belum memiliki siswa.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $idKelas = $this->kelasDibatasi($request);

        $kelas = Kelas::query()
            ->when($idKelas !== null, fn ($q) => $q->where('id_kelas', $idKelas))
            ->find($id);

        if (!$kelas) {
            return response()->json([
                'message' => 'Data kelas tidak ditemukan.',
            ], 404);
        }

        if ($kelas->siswa()->exists()) {
            return response()->json([
                'message' => 'Kelas tidak dapat dihapus karena masih memiliki siswa.',
            ], 409);
        }

        // Foreign key ON DELETE SET NULL akan membuat iuran/transaksi/
        // pengguna kehilangan kelas tanpa peringatan. Tolak lebih awal
        // agar riwayat tidak menjadi yatim.
        $dipakai = DB::table('iuran')
            ->where('id_kelas', $kelas->id_kelas)
            ->exists()
            || DB::table('transaksi')
                ->where('id_kelas', $kelas->id_kelas)
                ->exists()
            || DB::table('users')
                ->where('id_kelas', $kelas->id_kelas)
                ->exists();

        if ($dipakai) {
            return response()->json([
                'message' => 'Kelas tidak dapat dihapus karena masih memiliki iuran, transaksi, atau pengguna terkait.',
            ], 409);
        }

        $kelas->delete();

        return response()->json([
            'message' => 'Data kelas berhasil dihapus.',
        ]);
    }
}
