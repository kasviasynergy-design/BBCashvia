/* ============================================================
   BBCASHVIA - S3-07 PENGAMAN SIMPAN GANDA (MODUL BERSAMA)
   ============================================================
   Dipakai seluruh halaman untuk mewujudkan dua lapisan
   pencegahan simpan ganda (anti-double-click):

   1. `kunciTombolSimpan(tombol)`
      - teks tombol tetap ASLI sebelum diklik;
      - begitu diklik: tombol dinonaktifkan dan teksnya berubah
        menjadi "Memproses..." selama proses berjalan;
      - proses GAGAL/SUKSES: teks asli dikembalikan persis
        (termasuk ikon di dalam tombol) oleh `pulihkan()`;
      - tombol yang sedang diproses mengembalikan null, sehingga
        handler submit boleh langsung berhenti - ini menutup jalur
        dobel lewat klik mouse MAUPUN tombol Enter/spasi.

   2. `beriKunciIdempoten(...)`
      menambahkan header `X-Idempotency-Key` (nilai acak per
      penekanan tombol) pada setiap permintaan POST agar backend
      (trait MengunciIdempotensi) dapat menolak penyimpanan ganda
      yang lolos dari sisi antarmuka. Setiap percobaan simpan
      memakai kunci BARU, sehingga pembayaran cicilan (nominal
      sama maupun berbeda) tetap sah sebagai transaksi berbeda.

   Tidak ada ID/class/tampilan yang diubah - hanya isi teks tombol
   sesaat selama proses, sesuai ketentuan S3-07.
   ============================================================ */

const LABEL_MEMPROSES = "Memproses...";

/**
 * Kunci tombol selama proses simpan berjalan.
 *
 * Pengembalian:
 *   - objek { pulihkan }  → proses boleh lanjut; pulihkan() wajib
 *     dipanggil di akhir proses (sukses maupun gagal);
 *   - null                → tombol sedang diproses; jangan simpan.
 * Tombol yang tidak ditemukan tidak menahan proses (tidak berubah
 * dari perilaku lama).
 */
export function kunciTombolSimpan(tombol, labelProses = LABEL_MEMPROSES) {
    if (!tombol) {
        // Tanpa tombol (mis. submit otomatis) - proses tetap jalan.
        return { pulihkan() {} };
    }

    // Pemulihan otomatis: jika tombol macet dalam keadaan "Memproses..."
    // lebih dari 30 detik (request gagal/timeout yang tidak pulih),
    // kembalikan ke keadaan semula agar pengguna bisa mencoba lagi.
    if (tombol.disabled && tombol.dataset.kunciWaktu) {
        const mulai = Number(tombol.dataset.kunciWaktu) || 0;
        if (mulai > 0 && (Date.now() - mulai) > 30000) {
            if (tombol.dataset.kunciAsli) {
                tombol.innerHTML = tombol.dataset.kunciAsli;
            }
            tombol.disabled = false;
            delete tombol.dataset.kunciWaktu;
            delete tombol.dataset.kunciAsli;
        }
    }

    if (tombol.disabled) {
        // Sudah diproses (atau macet < 30s); tolak klik/Enter berikutnya.
        return null;
    }

    const isiAsli = tombol.innerHTML;
    tombol.dataset.kunciAsli = isiAsli;
    tombol.dataset.kunciWaktu = String(Date.now());

    tombol.disabled = true;
    tombol.textContent = labelProses;

    let sudahPulih = false;

    return {
        pulihkan() {
            if (sudahPulih) return;
            sudahPulih = true;

            tombol.disabled = false;
            tombol.innerHTML = isiAsli;
            delete tombol.dataset.kunciWaktu;
            delete tombol.dataset.kunciAsli;
            tombol.blur();
        },
    };
}

/**
 * Kunci idempotensi acak untuk SATU percobaan simpan.
 * (crypto.randomUUID bila tersedia, dengan cadangan aman.)
 */
export function kunciIdempoten() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return (
        "k-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 12)
    );
}

/**
 * Sisipkan header X-Idempotency-Key ke opsi/headers permintaan
 * bila metodenya POST (aksi simpan). Permintaan GET/PUT/DELETE
 * tidak diberi kunci - hanya pembuatan data yang perlu diamankan.
 */
export function beriKunciIdempoten(opsi = {}) {
    if ((opsi?.method || "GET").toUpperCase() === "POST") {
        return {
            ...opsi,
            headers: {
                ...(opsi.headers || {}),
                "X-Idempotency-Key": kunciIdempoten(),
            },
        };
    }

    return opsi;
}
