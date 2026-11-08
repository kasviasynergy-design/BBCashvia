<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * S3-07 - Pengaman simpan ganda pada sisi backend (idempotensi).
 *
 * Frontend sudah menonaktifkan tombol saat proses berjalan, tetapi
 * klik berulang, percobaan jaringan, atau dua permintaan yang hampir
 * bersamaan tetap dapat menyelundupkan dua kali simpan. Guard ini
 * membuat SATU identitas permintaan (`X-Idempotency-Key` yang dibuat
 * JavaScript untuk setiap penekanan tombol simpan) hanya boleh
 * MENYIMPAN SATU KALI:
 *
 *   - permintaan pertama mengklaim kunci lalu menyimpan data;
 *   - permintaan yang SAMA (kunci sama) menunggu dijawab dengan
 *     tanggapan yang sama, TANPA menyimpan data lagi;
 *   - bila proses gagal (validasi/galat), klaim dilepas agar pengguna
 *     boleh mencoba lagi dengan bebas;
 *   - pembayaran cicilan TIDAK terdampak: setiap penekanan tombol
 *     menyimpan yang baru membawa kunci baru, sehingga dua cicilan
 *     (mis. Rp30.000 lalu Rp20.000 untuk satu tagihan Rp50.000)
 *     tetap tersimpan sebagai dua transaksi yang sah.
 *
 * Identitas TIDAK memakai nominal transaksi - nominal sama pada
 * transaksi berbeda tetap diizinkan.
 *
 * Klaim memakai store cache bawaan (CACHE_STORE=database) lewat
 * `Cache::add()` yang atomik (`insertOrIgnore`) sehingga aman ketika
 * dua permintaan masuk hampir bersamaan: hanya satu yang berhasil
 * melakukan interupsi klaim.
 */
trait MengunciIdempotensi
{
    /** Lama (detik) klaim & tanggapan idempotensi disimpan. */
    protected int $masaIdempotensi = 600;

    /**
     * Kunci idempotensi yang dibawa permintaan (header atau konten).
     * Boleh null - permintaan tanpa kunci diperlakukan seperti biasa.
     */
    protected function kunciIdempotensi(Request $request): ?string
    {
        $kunci = (string) (
            $request->header('X-Idempotency-Key', '')
            ?: $request->input('kunci_idempoten', '')
        );

        $kunci = trim($kunci);
        $kunci = mb_substr($kunci, 0, 100);

        return $kunci !== '' ? $kunci : null;
    }

    /**
     * Kunci penyimpanan cache: per (rute, pengguna, kunci permintaan)
     * agar kunci yang sama dari pengguna/endpoint berbeda tidak
     * saling mengunci data.
     */
    protected function kunciCacheIdempotensi(
        Request $request,
        ?string $kunci
    ): ?string {
        if ($kunci === null) {
            return null;
        }

        $rute = (string) ($request->route()?->getName()
            ?: $request->path());

        $idPengguna = (string) ($request->user()?->getAuthIdentifier()
            ?: '0');

        return 'idem:' . md5($rute . '|' . $idPengguna . '|' . $kunci);
    }

    /**
     * Klaim kunci SEBELUM menyimpan data.
     *
     * Pengembalian:
     *   - null        → klaim berhasil/pertama; lanjutkan simpan.
     *   - JsonResponse → permintaan duplikat; kembalikan langsung
     *     (tanggapan tersimpan, atau pesan "sedang diproses").
     */
    protected function klaimIdempotensi(Request $request): ?JsonResponse
    {
        $kunciCache = $this->kunciCacheIdempotensi(
            $request,
            $this->kunciIdempotensi($request)
        );

        if ($kunciCache === null) {
            return null;
        }

        $sudahAda = Cache::store()->get($kunciCache);

        if ($sudahAda !== null) {
            // Tanggapan akhir sudah tersimpan → ulangi persis tanpa
            // menyimpan data lagi (replay).
            if (is_array($sudahAda)
                && ($sudahAda['status'] ?? '') === 'SELESAI') {
                $isi = $sudahAda['konten'] ?? [];

                return response()->json(
                    $isi,
                    (int) ($sudahAda['kode'] ?? 200)
                )->withHeaders(['X-Idempotency-Replay' => 'true']);
            }

            // Masih diproses (PENDING/PERSEDIAAN) → tolak dengan 409.
            return $this->tanggapanIdempotensiTunda();
        }

        // Klaim atomik: hanya permintaan pertama yang berhasil.
        $berhasil = Cache::store()->add(
            $kunciCache,
            'PERSEDIAAN',
            $this->masaIdempotensi
        );

        if ($berhasil) {
            return null;
        }

        return $this->tanggapanIdempotensiTunda();
    }

    /** Tanggapan untuk permintaan yang tumpang tindih dengan klaim. */
    protected function tanggapanIdempotensiTunda(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Permintaan ini sedang diproses. Mohon tunggu diinformasikan selesai sebelum mencoba mengirim kembali.',
        ], 409)->withHeaders(['X-Idempotency-Replay' => 'pending']);
    }

    /**
     * Finisher baku di akhir aksi simpan:
     *   - tanggapan sukses (2xx/3xx) di-catat untuk replay tanggapan
     *     pada permintaan identik berikutnya;
     *   - tanggapan gagal (4xx/5xx java aksi) melepas klaim agar
     *     pengguna bebas mencoba lagi.
     *
     * Tanggapan yang DILEPAS tetap dikembalikan tanpa perubahan.
     */
    protected function responIdempotensi(
        Request $request,
        JsonResponse $respons
    ): JsonResponse {
        $kode = $respons->status();

        if ($kode >= 200 && $kode < 400) {
            $this->simpanTanggapanIdempotensi($request, $respons);
        } else {
            $this->lepaskanIdempotensi($request);
        }

        return $respons;
    }

    /**
     * Catat tanggapan sukses agar permintaan identik (kunci sama)
     * berikutnya menerima tanggapan yang sama tanpa menyimpan lagi.
     */
    protected function simpanTanggapanIdempotensi(
        Request $request,
        JsonResponse $respons
    ): void {
        $kunciCache = $this->kunciCacheIdempotensi(
            $request,
            $this->kunciIdempotensi($request)
        );

        if ($kunciCache === null) {
            return;
        }

        Cache::store()->put($kunciCache, [
            'status' => 'SELESAI',
            'kode'   => $respons->status(),
            'konten' => $respons->getData(true),
        ], $this->masaIdempotensi);
    }

    /**
     * Lepaskan klaim saat proses GAGAL (validasi/galat) supaya
     * permintaan berikutnya boleh mencoba simpan kembali.
     */
    protected function lepaskanIdempotensi(Request $request): void
    {
        $kunciCache = $this->kunciCacheIdempotensi(
            $request,
            $this->kunciIdempotensi($request)
        );

        if ($kunciCache === null) {
            return;
        }

        Cache::store()->forget($kunciCache);
    }
}
