# S3-07 - Bukti Waktu Muat Cepat (Performance & Usability Refinement)

**Aplikasi:** BBCashvia - **Server:** php artisan serve, http://127.0.0.1:8000 (localhost)
**Tanggal pengujian:** 2026-10-24
**Metode:** setiap halaman dimuat 5x berturut-turut per sesi peran (admin, bendahara, viewer). Muat ke-1 (dingin) tidak dihitung; lama respons = rata-rata 4 muat berikutnya (warm), diukur dari sisi klien HTTP.
**Variabel:** pengukuran 1 (baseline) dilakukan SEBELUM indeks dipasang; pengukuran 2 SETELAH skrip scripts/S3-07_indeks_kinerja.sql dijalankan. Kondisi lain (kode, data) dianggap sama.

| No | Peran | Halaman | Rata-rata SEBELUM indeks (ms) | Rata-rata SETELAH indeks (ms) |
|---:|---|---|---:|---:|
| 1 | admin | `/dashboard/admin` | 377.6 | 370.6 |
| 2 | admin | `/admin/transaksi` | 371.5 | 376.2 |
| 3 | admin | `/admin/iuran` | 371.5 | 329.8 |
| 4 | admin | `/admin/siswa` | 427.5 | 423.3 |
| 5 | admin | `/admin/laporan-kas` | 423.9 | 362.6 |
| 6 | admin | `/admin/riwayat-transaksi` | 365.0 | 363.7 |
| 7 | admin | `/admin/manajemen-pengguna` | 390.2 | 383.8 |
| 8 | bendahara | `/dashboard/bendahara` | 382.4 | 368.3 |
| 9 | bendahara | `/bendahara/transaksi` | 384.7 | 445.9 |
| 10 | bendahara | `/bendahara/iuran` | 393.0 | 376.1 |
| 11 | bendahara | `/bendahara/siswa` | 371.9 | 377.5 |
| 12 | bendahara | `/bendahara/laporan-kas` | 364.5 | 357.3 |
| 13 | bendahara | `/bendahara/riwayat-transaksi` | 379.2 | 368.3 |
| 14 | viewer | `/dashboard/viewer` | 379.7 | 412.7 |
| 15 | viewer | `/viewer/transaksi` | 372.9 | 371.6 |
| 16 | viewer | `/viewer/iuran` | 390.8 | 377.8 |
| 17 | viewer | `/viewer/siswa` | 372.9 | 332.5 |
| 18 | viewer | `/viewer/riwayat-transaksi` | 400.8 | 341.4 |
| 19 | viewer | `/viewer/laporan-kas` | 366.0 | 371.2 |

**Rata-rata seluruh 19 halaman:** 383.5 ms (sebelum) vs **374.2 ms** (setelah). **Nilai tertinggi:** 427.5 ms (sebelum) / 445.9 ms (setelah) - fluktuasi antar-run normal karena skala data sangat kecil.

## Kesimpulan (DoD S3-07)

- Rata-rata waktu respons halaman di localhost **< 500 ms** - tercapai pada KEDUA pengukuran (383.5 ms -> 374.2 ms; bahkan halaman terlama hanya 427.5 ms / 445.9 ms).
- Indeks basis data idx_transaksi_tanggal, idx_transaksi_no_bukti, idx_transaksi_jenis, dan idx_transaksi_siswa_iuran telah terpasang (lihat scripts/S3-07_indeks_kinerja.sql dan SHOW INDEX di phpMyAdmin). Pada jumlah data kecil pola peningkatan belum jauh, namun indeks memastikan respons tetap cepat tatkala data transaksi bertambah banyak.
- Pendukung lain: indikator memuat global (overlay + bar tipis di topbar) aktif secara otomatis setiap halaman/permintaan memuat data.

## Cara mereproduksi

1. Jalankan server: `php artisan serve` (port 8000), lalu buka DevTools (F12) > tab **Network** kolom **Time** pada tiap halaman menu - nilai < 500 ms.
2. Skrip indeks: `scripts/S3-07_indeks_kinerja.sql`; hasil `SHOW INDEX FROM transaksi` dapat diperiksa di phpMyAdmin.


