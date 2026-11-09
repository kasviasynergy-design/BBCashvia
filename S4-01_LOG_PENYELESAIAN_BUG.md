# S4-01 — Log Penyelesaian Bug & Release Candidate (BBCashvia)

**Aplikasi:** BBCashvia (Laravel + Vite)
**Prosedur:** S4-01 Final Bug Fixing (Release Candidate)
**Tanggal:** 9 November 2026
**Branch rilis:** `main`
**Tag rilis:** `v1.0.0-rc`

---

## A. Verifikasi Issue Tracker Sprint 3

Sumber tiket: `scripts/buat_issue_tracker.php` (S3-04 Issue Tracker). Seluruh tiket diperiksa ulang sebelum pembekuan kode.

| Tiket | Berkas / Modul | Prioritas | Status | Keterangan |
|---|---|---|---|---|
| ISS-01 | `config/filesystems.php` | Tinggi | Fixed & Verified | Unduh bukti `/storage/*` 403 → ditambah `serve => true` pada disk publik. |
| ISS-02 | CSS halaman viewer | Sedang | Fixed & Verified | Guard `[hidden]{display:none !important}` dipulihkan di 6 berkas CSS viewer. |
| ISS-03 | `resources/js/viewer-laporan-kas.js` | Rendah | Fixed & Verified | Fallback periode diseragamkan menjadi `|| "all"`. |
| ISS-04 | Penyaji `/storage` Laravel | Rendah | Open (dipantau) | Risiko rendah; signed URL/middleware dijadwalkan sprint berikutnya. |
| ISS-05 | `phpunit.xml` | Rendah | Won't Fix (keputusan) | Suite dijalankan memakai koneksi MySQL via environment. |
| ISS-06 | `resources/js/admin-iuran.js` | Tinggi | Fixed & Verified | `normalisasiIuran()` menyimpan `kategori` apa adanya; badge/filter/form/modal membaca nilai asli. |
| ISS-07 | `resources/js/admin-iuran.js`, `bendahara-iuran.js` | Tinggi | Fixed & Verified | Token CSRF dikirim untuk semua metode tulis (POST/PUT/DELETE). |
| ISS-08 | `resources/js/bendahara-iuran.js`, view & CSS | Sedang | Fixed & Verified | Paritas UI Admin vs Bendahara: tombol/modal hapus, kategori, dan badge status. |

**Kesimpulan verifikasi:** Tidak ada tiket berprioritas **CRITICAL** maupun **MAJOR** yang tersisa. Dua tiket terbuka (ISS-04 dan ISS-05) sama-sama berprioritas **Rendah** dan telah disepakati penanganannya, sehingga tidak menghalangi penerbitan Release Candidate.

---

## B. Log Penyelesaian Bug Terakhir (Sprint 4 Closure)

> Catatan: tabel contoh pada lembar tugas (BUG-06/07/08 dengan studi kasus CiwideyStay) diganti dengan tiket **asli** BBCashvia beserta hash commit yang benar-benar ada di repositori.

| Nomor Tiket | Modul Terkait | Deskripsi Masalah | Solusi Penanganan | Commit Hash | Status |
|---|---|---|---|---|---|
| BUG-06 (ISS-06) | Iuran (UI & Data) | Kategori iuran tidak muncul pada daftar, form edit, dan modal detail karena `normalisasiIuran()` memindahkan `kategori` ke `frekuensi`. | `normalisasiIuran()` menyimpan `kategori` dari database apa adanya; seluruh render membaca nilai asli. | `b5f6c68` | CLOSED |
| BUG-07 (ISS-07) | Iuran (Hapus data) | Hapus iuran selalu gagal 419 karena `X-CSRF-TOKEN` hanya dikirim pada request bermuatan. | Token CSRF dikirim untuk semua metode tulis (POST/PUT/DELETE); pesan galat 419 dibuat mudah dipahami. | `b5f6c68` | CLOSED |
| BUG-08 (ISS-08) | UI Bendahara | Halaman Iuran Bendahara tidak konsisten dengan Admin (tanpa tombol hapus, kategori dipaksa "sekali bayar", badge status salah gaya). | Tombol/modal hapus ditambahkan, kategori dibaca apa adanya, badge status diselaraskan dengan Admin. | `b5f6c68` | CLOSED |

---

## C. Cleanup Kode Debug (Code Freeze)

Seluruh kode debug dihapus dari sumber sebelum pembekuan:

| No | Berkas | Baris (sebelum) | Kode yang dihapus |
|---|---|---|---|
| 1 | `resources/js/login.js` | 1 | `console.log("LOGIN JS BBCASHVIA TERLOAD");` |
| 2 | `resources/js/login.js` | 531 | `console.log("Login JS BBCashvia berhasil dijalankan.");` |
| 3 | `resources/js/change-password.js` | 418–420 | `console.log("Change Password JS BBCashvia berhasil dijalankan.");` |

Hasil pemindaian ulang (seluruh `app/`, `resources/`, `routes/`, `tests/`):

- `console.log` → **0**
- `dd()` / `dump()` → **0**
- `var_dump()` / `print_r()` → **0**
- `System.out.println()` → **0**

Verifikasi build aset produksi: `npm run build` **berhasil** (103 modul, tanpa galat).

---

## D. Prosedur Git Release Tagging

```bash
# 1. Bersihkan working tree dan commit finalisasi
git add -A
git commit -m "S4-01: Final bug fixing - bersihkan console.log, tutup tiket, siapkan release candidate"

# 2. Naikkan cabang utama (fast-forward, tanpa konflik)
git fetch origin
git branch main origin/main
git checkout main
git merge --ff-only bbcashvia-release-candidate

# 3. Terbitkan Git Annotated Tag
git tag -a v1.0.0-rc -m "BBCashvia Release Candidate 1.0.0 - Siap Asesmen UKK"

# 4. Dorong commit dan tag ke remote
git push origin bbcashvia-release-candidate
git push origin main
git push origin v1.0.0-rc
```

**Verifikasi:**

```bash
git status                    # working tree bersih
git tag -n                    # menampilkan v1.0.0-rc beserta pesan tag
git ls-remote --tags origin   # memastikan v1.0.0-rc ada di remote
```

---

## E. Kesimpulan

1. Seluruh tiket Sprint 3 telah diverifikasi; tidak ada bug **CRITICAL/MAJOR** tersisa.
2. Seluruh kode debug telah dibersihkan dan build produksi berhasil.
3. Perubahan dikunci (code freeze) pada cabang `main`.
4. Tag rilis **`v1.0.0-rc`** diterbitkan dan didorong ke repositori remote sebagai Release Candidate yang siap dinilai.
