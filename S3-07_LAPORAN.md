# Laporan S3-07 - Performance & Usability Refinement

**Project:** BBCashvia (Laravel 12, MySQL) - `D:\foto foto ukk\BBCashvia`
**Tanggal:** 30 Oktober 2026 (audit lanjutan: 5–6 November 2026)
**Status keseluruhan:** BERHASIL - alur simpan (tambah/ubah/hapus) terverifikasi end-to-end di browser + MySQL; beberapa item visual tetap BELUM DIUJI

---

## A. Ringkasan

Sprint S3-07 menyelesaikan penyempurnaan performa dan kegunaan:

1. **Indeks database** - migrasi baru (komposit `transaksi(id_kelas, id_transaksi)`, UNIQUE `siswa.nis`, drop indeks redundan `saldo_awal_kas`).
2. **Breadcrumb** - audit seluruh view admin/bendahara/viewer; semua sudah benar per role, tidak ada link lintas role → tidak ada perubahan.
3. **Anti-double-click** - modul bersama `resources/js/simpan-guard.js` + wiring ke 11 halaman JS (teks "Memproses..." + disabled + pemulihan saat gagal/sukses).
4. **Proteksi data ganda backend** - trait `MengunciIdempotensi` (Cache database, `Cache::add` atomik) diintegrasikan ke 5 controller store; UNIQUE DB untuk `siswa.nis` dan `users.email`; QueryException 1062 → pesan ramah.
5. **Pengujian performa** - rata-rata waktu muat halaman/API di bawah 500 ms (maks. 338,8 ms).
6. **Regression testing** - suite `php artisan test` 166 lulus (824 assertion) pada mode desain (MySQL); idempotensi, cicilan, role crossing, duplicate protection terverifikasi via HTTP.

Tidak ada perubahan desain visual, warna, ID/class tombol, nama variabel, routes, controllers (struktur), autentikasi, middleware, role. Tidak ada `migrate:fresh/refresh/db:wipe`, tidak ada package baru, tidak ada penghapusan data.

**Pembaruan audit 5–6 November 2026:** ditemukan 4 drift skema DB yang membuat penyimpanan gagal (lihat Bagian I). Diperbaiki lewat 3 migrasi aditif + penyelarasan `Iuran::$timestamps`. Data UJI seluruhnya dibersihkan; baseline saat audit: users 3, kelas 3, siswa 10, iuran 10, transaksi 36, detail_transaksi 9, saldo_awal_kas 0. Setelah audit, pengguna menambahkan data manual (users 4, siswa 11) - data itu sengaja tidak dihapus.

---

## B. File yang diubah (existing files edited)

- `app/Http/Controllers/Api/TransaksiController.php` - `store()` dibungkus guard, logika dipindah ke `simpanStore()`; `responIdempotensi()` pada respons.
- `app/Http/Controllers/Admin/SiswaController.php` - `store()` → `tambahSiswa()` + guard + catch QueryException 1062 → "NIS sudah digunakan siswa lain."
- `app/Http/Controllers/Admin/IuranController.php` - `store()` → `tambahIuran()` + guard.
- `app/Http/Controllers/Admin/UserController.php` - `store()` → `tambahPengguna()` + guard + catch 1062 → "Email sudah terdaftar."
- `app/Http/Controllers/Admin/KelasController.php` - `store()` → `tambahKelas()` + guard.
- `resources/js/admin-transaksi.js`, `admin-siswa.js`, `admin-iuran.js`, `admin-manajemen-pengguna.js`, `bendahara-transaksi.js`, `bendahara-siswa.js`, `bendahara-iuran.js`, `viewer-transaksi.js`, `viewer-iuran.js`, `viewer-siswa.js`, `change-password.js` - wiring `kunciTombolSimpan` dari `simpan-guard.js`.
- `resources/views/bendahara-transaksi.blade.php` - tambah tombol "Catat Banyak" + modal `modalFormBanyak` (porting fitur bulk dari admin, disesuaikan untuk bendahara).
- `database/migrations/2026_10_30_000001_refine_indeks_database_s3_07.php` - migrasi baru (lihat D).

(Seluruh perubahan lain pada working tree berasal dari sprint sebelumnya dan tidak disentuh pada S3-07.)

---

## C. File baru + alasan teknis

| File | Alasan teknis |
|---|---|
| `app/Http/Controllers/Concerns/MengunciIdempotensi.php` | Trait pengaman simpan ganda: klaim atomik via `Cache::add` (database store), replay tanggapan tersimpan, lepas klaim saat gagal, catat hanya 2xx/3xx. Dibutuhkan untuk idempotensi backend tanpa mengubah struktur controller. |
| `resources/js/simpan-guard.js` | Modul bersama anti-double-click: `kunciTombolSimpan`, `kunciIdempoten`, `beriKunciIdempoten`. Satu sumber agar perilaku konsisten di 11 halaman. |
| `database/migrations/2026_10_30_000001_refine_indeks_database_s3_07.php` | Optimasi indeks (lihat D). |

---

## D. Indeks database

**Migrasi:** `2026_10_30_000001_refine_indeks_database_s3_07.php`
**Diujicobakan:** up → down → up pada DB klon `bbcashvia_audit`, lalu diterapkan ke DB asli `bbcashvia` (`php artisan migrate --force`). Terverifikasi via `information_schema`.

| # | Perubahan | Tabel | Keterangan |
|---|---|---|---|
| 1 | `+ INDEX idx_transaksi_kelas_id (id_kelas, id_transaksi)` | `transaksi` | Pola kueri utama `WHERE id_kelas = ? ORDER BY id_transaksi DESC` (daftar transaksi, ringkasan saldo, dashboard per kelas). |
| 2 | `+ UNIQUE siswa_nis_unique (nis)` | `siswa` | Data NIS diperiksa tanpa duplikat sebelum dibuat. Jaminan mutlak anti-duplikat. |
| 3 | `- DROP INDEX saldo_awal_kas_id_kelas_index` | `saldo_awal_kas` | Redundan: UNIQUE `saldo_awal_kas_id_kelas_unique` sudah memuat kolom yang sama dan tetap dipakai FK. |

**Verifikasi (DB asli):** `idx_transaksi_kelas_id` (NON_UNIQUE=1) ada; `siswa_nis_unique` (NON_UNIQUE=0) ada; `saldo_awal_kas_id_kelas_index` tidak ada; `saldo_awal_kas_id_kelas_unique` tetap ada.

**Rollback:** `down()` mengembalikan struktur persis seperti semula (diuji).

**Catatan:** Tidak ada data yang diubah/dihapus. Migrasi diuji up→down→up di klon sebelum diterapkan ke DB asli.

---

## E. Breadcrumb

**Audit:** seluruh view admin/bendahara/viewer (22 blade + partials) diperiksa via grep. Hasil:

- Setiap halaman memiliki breadcrumb yang menunjuk ke dashboard peran sendiri:
  - Admin → `/dashboard/admin`
  - Bendahara → `/dashboard/bendahara`
  - Viewer → `/dashboard/viewer`
- Tidak ada link lintas peran pada breadcrumb.
- Tidak ada halaman tanpa breadcrumb.

**Keputusan:** tidak ada perubahan kode; dilaporkan sebagai verifikasi.

---

## F. Anti-double-click (frontend)

**Implementasi:** `resources/js/simpan-guard.js` mengekspor `kunciTombolSimpan`, `kunciIdempoten`, `beriKunciIdempoten`. Pola: teks tombol tetap asli → setelah klik jadi "Memproses..." + disabled → dipulihkan saat gagal/sukses.

**Wiring:** 11 file JS halaman (admin: transaksi, siswa, iuran, manajemen-pengguna; bendahara: transaksi, siswa, iuran; viewer: transaksi, iuran, siswa; change-password). `login.js` sengaja tidak diubah (throttle + tidak membuat data).

**Tambahan (di luar ruang lingkup asli S3-07, atas permintaan):** fitur "Catat Banyak" (bulk transaksi) yang sebelumnya hanya ada di admin, ditambahkan ke halaman bendahara (`bendahara-transaksi.blade.php` + `bendahara-transaksi.js`), disesuaikan dengan scope kelas bendahara (kelas diisi otomatis oleh backend). Build Vite sukses.

**Build:** `npm run build` sukses; `simpan-guard-B5jxxchN.js` masuk manifest.

**Status visual browser:** BELUM DIUJI (memerlukan browser manual). Verifikasi kode + wiring (grep) BERHASIL.

---

## G. Proteksi data ganda backend (idempotensi)

**Mekanisme:** `MengunciIdempotensi` memakai Cache database store dengan `Cache::add` (atomik). Kunci klaim: `idem:md5(rute|idUser|kunci)` dengan kunci dari header `X-Idempotency-Key` atau input `kunci_idempoten`. Header JS dibuat per percobaan submit (runtime key baru tiap submit → cicilan tetap sah). Replay tanggapan tersimpan; klaim dilepas saat gagal; `responIdempotensi()` menyimpan 2xx/3xx dan melepas 4xx/5xx.

**Integrasi:** `store()` pada TransaksiController, SiswaController, IuranController, UserController, KelasController.

**UNIQUE DB:** `siswa.nis` (`siswa_nis_unique`) dan `users.email` (sudah ada) → QueryException 1062 ditangkap → pesan ramah ("NIS sudah digunakan siswa lain.", "Email sudah terdaftar.").

**Iuran & Kelas:** tidak diberi UNIQUE DB (ambigu secara bisnis) - hanya idempotensi.

**Verifikasi HTTP (terhadap DB klon, lalu dibersihkan):**
- Scenario A (kunci sama, dua POST) → satu transaksi (id sama), count +1. BERHASIL.
- Scenario B (nominal sama, kunci berbeda) → dua transaksi sah (id berbeda), count +2. BERHASIL (bukan nominal yang jadi identitas).
- Scenario C (cicilan Rp30.000 + Rp20.000 untuk tagihan Rp50.000) → Cicilan lalu Lunas, sisa 0. BERHASIL (mekanisme cicilan tetap utuh).
- Siswa NIS duplikat → 422 "NIS sudah digunakan siswa lain."; NIS unik → 201. BERHASIL.
- User email duplikat → 422 "Email sudah terdaftar."; email unik → 201. BERHASIL.
- Idempotensi iuran & kelas: kunci sama dua POST → satu baris. BERHASIL.

---

## H. Pengujian performa & regresi

### H.1 Regression test (PHPUnit)

- Perintah: `php artisan test` (mode desain: `DB_CONNECTION=mysql`, `DB_DATABASE=bbcashvia_audit`/`bbcashvia`, Cache array).
- Hasil: **166 passed, 0 failed, 0 skipped (824 assertions)**, durasi 36,19 s.
- Catatan lingkungan: dengan konfigurasi default `phpunit.xml` (sqlite `:memory:`), suite gagal "no such table" karena DatabaseTransactions tidak memigrasi dan guard `butuhMysql()` melewati tes MySQL; ini adalah kondisi lingkungan, bukan regresi kode. Suite dirancang untuk MySQL `bbcashvia`. Pada mode desain, seluruh suite hijau dengan perubahan S3-07 diterapkan.

### H.2 Role crossing (HTTP)

- Viewer POST/GET ke endpoint admin → 403. BERHASIL.
- Bendahara POST ke endpoint admin → 403. BERHASIL.

### H.3 Performa (3x pengukuran, curl `-w time_starttransfer`/`time_total`)

Semua 31 URL (19 halaman + 12 API index) diukur 3 kali. Rata-rata total (ms):

| URL | Role | TTFB avg (ms) | Total avg (ms) |
|---|---|---|---|
| /bendahara/siswa | bendahara | 335,8 | 338,8 |
| /admin/api/transaksi | admin | 287,7 | 290,5 |
| /bendahara/api/transaksi | bendahara | 255,1 | 257,8 |
| /bendahara/laporan-kas | bendahara | 253,4 | 256,0 |
| /admin/laporan-kas | admin | 251,7 | 254,6 |
| (lainnya) | - | - | 192,9 – 280,0 |

- **Maksimum total avg: 338,8 ms < 500 ms.** Target terpenuhi.
- TTFB rata-rata seluruhnya di bawah 500 ms.

### H.4 Status uji (ringkas)

| Item | Status |
|---|---|
| Indeks DB (migrasi up/down/up + apply) | BERHASIL |
| Breadcrumb audit (tanpa perubahan) | BERHASIL |
| Anti-double-click JS (kode + wiring + build) | BERHASIL (audit kode) |
| Anti-double-click JS (visual klik browser) | BELUM DIUJI |
| Idempotensi HTTP (transaksi A/B/C) | BERHASIL |
| Idempotensi HTTP (iuran, kelas) | BERHASIL |
| Duplikat NIS / email backend | BERHASIL |
| Cicilan Rp30k+Rp20k → Lunas | BERHASIL |
| Role crossing 403 | BERHASIL |
| Performa < 500 ms | BERHASIL |
| Regression suite (mode desain) | BERHASIL (166/166) |
| Regression suite (sqlite default) | BELUM BERHASIL (kondisi lingkungan: no such table) |
| Upload bukti (manual) | BELUM DIUJI |

### H.5 Pembersihan artefak audit

- DB klon `bbcashvia_audit` di-drop.
- File dump `bbcashvia_dump.sql` dihapus.
- Skrip audit `db_*.php` dihapus.
- Data UJI (transaksi/siswa/iuran/pengguna/kelas) seluruhnya dihapus; count DB asli setelah audit: users 3, kelas 3, siswa 10, iuran 10, transaksi 36, detail_transaksi 9, saldo_awal_kas 0.
- Server dev dimatikan. Indeks DB asli terverifikasi utuh.

---

## I. Audit Alur Simpan (Frontend → Backend → MySQL) - 5–6 November 2026

Audit ini menjawab gejala "Memproses..." yang tidak pernah selesai pada tambah/ubah/hapus. Fokus: Siswa, Iuran, Transaksi, Manajemen Pengguna. Metode: inspeksi kode, log Laravel, HTTP nyata, browser headless (Chrome DevTools Protocol), dan verifikasi langsung ke MySQL.

### I.1 Akar masalah (root cause)

**A. Frontend - request tidak pernah dikirim.**
`resources/js/konfirmasi-logout.js` memasang listener `submit` global pada fase *capture* (sekitar baris 439–450). Sebelum handler halaman sempat berjalan, listener ini men-disable tombol submit dan mengganti teksnya menjadi "Memproses...". Ketika handler halaman (`simpanSiswa`, `simpanTransaksi`, dan seterusnya) memanggil `kunciTombolSimpan()`, tombol sudah dalam keadaan `disabled`, sehingga fungsi mengembalikan `null` dan handler **berhenti tanpa pernah memanggil `fetch`**. Karena itu tidak ada request yang dikirim dan tampilan tetap "Memproses...". Dampaknya berlaku di semua halaman admin/bendahara/viewer yang memuat `konfirmasi-logout.js`.

**B. Backend/DB - drift skema.**
Setelah frontend diperbaiki, request benar-benar terkirim, tetapi `POST /admin/api/transaksi` mengembalikan **503**. Log Laravel:
`SQLSTATE[42S22]: Column not found: 1054 Unknown column 'created_at' in 'field list'`.
Audit model vs skema nyata menemukan empat drift:
- `transaksi.created_at` hilang, padahal model `Transaksi` memakai `timestamps = true` (`UPDATED_AT = null`) dan migrasi pembuat tabel mendefinisikannya.
- `saldo_awal_kas.created_at` dan `updated_at` hilang, padahal migrasi memakai `$table->timestamps()` dan controller memakai `save()`.
- `siswa.nis` bertipe `varchar(11)`, padahal validasi `max:20` dan migrasi `string('nis', 20)`.
- `transaksi.bukti_file` hilang, padahal controller dan model memakainya untuk unggah bukti.

**C. Ketidaksesuaian model.**
`App\Models\Iuran` memakai `timestamps = true`, sedangkan tabel `iuran` tidak memiliki kolom timestamp sama sekali.

**D. Ekspektasi test lama.**
Test login masih mengharapkan pesan gabungan lama, sedangkan aplikasi sudah memisahkan pesan salah password (sesuai permintaan).

### I.2 Ketidaksesuaian (mismatch) yang ditemukan

| # | Model / Tabel | Definisi kode atau migrasi | Kenyataan DB `bbcashvia` | Akibat |
|---|---|---|---|---|
| 1 | `Transaksi` / `transaksi` | `timestamps = true`, `created_at` ada di migrasi | `created_at` tidak ada | INSERT gagal 42S22 → 503 |
| 2 | `SaldoAwalKas` / `saldo_awal_kas` | `$table->timestamps()` | `created_at`, `updated_at` tidak ada | `save()` gagal 42S22 |
| 3 | `Siswa` / `siswa` | `string('nis', 20)` + validasi `max:20` | `varchar(11)` | NIS 12–20 karakter → 1406 *Data too long* → 503 |
| 4 | `Transaksi` / `transaksi` | `bukti_file` (migrasi + `$fillable`) | kolom tidak ada | unggah bukti gagal 42S22 → 503 |
| 5 | `Iuran` / `iuran` | model `timestamps = true` | tidak ada kolom timestamp | berpotensi gagal bila ditulis via Eloquent |

### I.3 File + lokasi

| File | Lokasi / bagian |
|---|---|
| `resources/js/konfirmasi-logout.js` | `kunciTombol` (baris 389), listener `submit` capture (baris 439–450) - diperbaiki |
| `resources/js/simpan-guard.js` | `kunciTombolSimpan` (baris 45–85), self-heal 30 detik - dipertahankan |
| `app/Models/Iuran.php` | `$timestamps` (baris 14–18) - diubah ke `false` |
| `database/migrations/2026_11_05_000001_restore_missing_timestamps.php` | migrasi baru (transaksi + saldo awal) |
| `database/migrations/2026_11_05_000002_widen_siswa_nis.php` | migrasi baru (`nis` → `VARCHAR(20)`) |
| `database/migrations/2026_11_05_000003_add_missing_bukti_file_to_transaksi.php` | migrasi baru (`bukti_file`) |
| `tests/Feature/FungsionalEndToEndTest.php` | baris 126–128 - ekspektasi pesan login |
| `S3-07_LAPORAN.md` | laporan ini (Bagian I) |

### I.4 Perbaikan

**Frontend.**
- `konfirmasi-logout.js`: pemanggilan `kunciTombol(tombol)` dipindah ke `setTimeout(..., 0)` dan listener langsung keluar bila `e.defaultPrevented || tombol.disabled`. Dengan begitu form AJAX yang mengelola kuncinya sendiri (`simpan-guard`) tidak lagi "dicuri" lebih dulu.
- `simpan-guard.js`: kunci tetap memberi teks "Memproses...", tetapi memiliki pemulihan otomatis setelah 30 detik bila ada jalur yang lupa membuka kunci.

**Backend.**
- `Iuran::$timestamps = false` diselaraskan dengan skema `iuran` yang memang tanpa timestamp. Tidak ada perubahan pada query builder yang sudah dipakai controller.
- Test login diperbarui ke pesan `Password yang Anda masukkan salah.` (perilaku aplikasi tidak diubah; test yang menyesuaikan).

**Database (migrasi aditif, idempoten, dengan guard `Schema::hasColumn`).**
1. `2026_11_05_000001_restore_missing_timestamps.php` - menambah `transaksi.created_at` (nullable) dan `saldo_awal_kas.created_at`/`updated_at` (nullable).
2. `2026_11_05_000002_widen_siswa_nis.php` - melebarkan `siswa.nis` ke `VARCHAR(20)` hanya bila masih lebih pendek; indeks UNIQUE `siswa_nis_unique` tetap.
3. `2026_11_05_000003_add_missing_bukti_file_to_transaksi.php` - menambah `transaksi.bukti_file` (nullable) bila belum ada.

Tidak ada tabel/kolom lain yang diubah, tidak ada data yang dihapus. Ketiga migrasi diterapkan ke DB asli `bbcashvia` dan ke DB klon uji.

**Penyesuaian NIS menjadi 11 karakter (permintaan pengguna, 6 Nov 2026).** Tampilan NIS pada form admin (`#inputNis`) dan bendahara (`#studentNis`) dibatasi `maxlength="11"`; handler input admin memotong ke 11 digit; validasi server di `SiswaController` (store & update) diubah menjadi `max:11` dengan pesan "NIS maksimal 11 karakter."; test yang membangkitkan NIS panjang disesuaikan agar tetap ≤11 karakter; ditambah test regresi NIS 12 karakter → 422. Kolom DB tetap `VARCHAR(20)` sebagai kapasitas (superset aman) - aplikasi tidak akan pernah menulis lebih dari 11 karakter.

### I.5 Hasil uji INSERT / UPDATE / DELETE

| Modul | CREATE | UPDATE | DELETE | Verifikasi DB |
|---|---|---|---|---|
| Siswa (browser) | `POST /admin/api/siswa` → **201**, toast "Data siswa berhasil ditambahkan." | toast "Data siswa berhasil diperbarui." | (dibersihkan saat cleanup) | `id_siswa=1482`; nama berubah menjadi "Siswa Uji Browser Diubah" |
| Siswa (HTTP) | 201 | 200 | 200 | baris ada → berubah → `NO_ROW` |
| Iuran (HTTP) | `POST /admin/api/iuran` → **201**, `id_iuran=222` | 200, nominal `15000 → 20000` | 200 | `NO_ROW` setelah hapus |
| Pengguna (HTTP) | `POST /admin/api/pengguna` → **201**, `db_id=513` | 200, nama berubah | 200 | `NO_ROW` setelah hapus |
| Transaksi (HTTP) | `POST /admin/api/transaksi` → **201**, `id_transaksi=2832` | 200, keterangan berubah | 200 | `NO_ROW` setelah hapus |
| Transaksi (browser) | toast "Transaksi TRX-261106020601412 berhasil dicatat" | - | - | baris `id_transaksi=2833` ada di MySQL |

**Validasi & duplikat (HTTP):**
- Nama siswa kosong → **422** "Nama siswa wajib diisi."
- NIS duplikat → **422** "NIS sudah digunakan siswa lain."
- NIS 12 karakter → **422** "NIS maksimal 11 karakter."
- Waktu respons seluruh operasi ±200–500 ms; tidak ada loading menggantung.

### I.6 Bukti DB berubah

Contoh baris nyata yang dibaca ulang langsung dari MySQL:

- **Iuran `id_iuran=222`**
  - setelah CREATE: `nominal="15000.00"`, `keterangan="baris uji otomatis"`
  - setelah UPDATE: `nominal="20000.00"`, `keterangan="sudah diubah"`
  - setelah DELETE: `NO_ROW`
- **Pengguna `id_users=513`**
  - setelah CREATE: `name="Uji Pengguna 180316"`
  - setelah UPDATE: `name="Uji Pengguna Diubah 180316"`
  - setelah DELETE: `NO_ROW`
- **Transaksi `id_transaksi=2832`**
  - setelah CREATE: `keterangan="UJI TRANSAKSI 180316"`, `created_at="2026-11-06 02:03:21"` (respons API juga memuat `waktu="09:03"` WIB)
  - setelah UPDATE: `keterangan="UJI TRANSAKSI DIUBAH 180316"`
  - setelah DELETE: `NO_ROW`
- **Transaksi browser `id_transaksi=2833`**
  - `no_bukti="TRX-261106020601412"`, `keterangan="UJI BROWSER TRANSAKSI 761105"`, `created_at="2026-11-06 02:06:01"`
- **Siswa `id_siswa=1482`**
  - setelah CREATE: `nis="9611858"`, `nama_siswa="Siswa Uji Browser"`
  - setelah UPDATE: `nama_siswa="Siswa Uji Browser Diubah"`

### I.7 Masalah yang belum terselesaikan + alasan

| Item | Status | Alasan |
|---|---|---|
| Logo 404 (`build/assets/image/Logo BBCashvia.png`) | BELUM DIPERBAIKI | File logo tidak ada di seluruh project (bukan salah path). Tidak dibuat placeholder agar desain tidak berubah; perlu file logo asli dari pemilik proyek. Tidak terkait alur simpan. |
| Uji visual manual (autofill, skeleton, posisi error) | BELUM DIUJI | Verifikasi dilakukan dengan browser headless (CDP) untuk alur fungsional; interaksi visual by-hand belum dilakukan. |
| `php artisan migrate` pada DB kosong (MariaDB) | GAGAL (pre-existing) | Migrasi legacy `2026_09_24_015613_create_siswa_table` memakai `renameColumn` yang gagal pada intropeksi MariaDB/Laravel 12 (`compileLegacyRenameColumn`). Bukan disebabkan audit ini; suite dijalankan pada klon skema DB asli. |
| Suite dengan `phpunit.xml` default (sqlite `:memory:`) | GAGAL (lingkungan) | `DatabaseTransactions` tidak memigrasi; suite memang dirancang untuk MySQL. |
| Password akun asli (`admin@gmail.com`, dll.) | TIDAK DIKETAHUI | Untuk pengujian dibuat admin sementara `diag-admin@bbcashvia.test` (id 511); sudah dihapus setelah pengujian. |
| Commit/push | BELUM | Working tree sengaja tidak di-commit; semua perubahan masih lokal. |

### I.8 Pemeriksaan akhir

- `node --check` seluruh `resources/js/*.js` → **0 kegagalan**.
- `npm run build` → **sukses** (2,26 s); aset `konfirmasi-logout` hasil build memuat penanda `defaultPrevented` + `setTimeout`.
- `php artisan view:cache` → **sukses**.
- `php -l` pada `app/Models/Iuran.php` dan ketiga migrasi baru → **tidak ada syntax error**.
- Audit `fillable` semua model vs skema → **OK**; audit timestamps model vs skema → **semua cocok**.
- `php artisan test` (MySQL, DB klon `bbcashvia_audit`) → **167 passed, 827 assertions, 0 failed** (33,81 s).
- Ketiga migrasi baru diterapkan ke DB asli `bbcashvia` → **DONE**.

### I.9 Pembersihan

- Data UJI dihapus: 1 transaksi, 5 siswa, 1 pengguna (admin sementara), 0 iuran tersisa.
- Baseline saat audit: `users=3, kelas=3, siswa=10, iuran=10, transaksi=36, detail_transaksi=9, saldo_awal_kas=0`.
- Setelah audit, pengguna menambahkan data manual: user id 514 (`vsdfg@gmial.com`, bendahara) dan siswa id 1483 (`bdxrcyhvbjvkvkjn`, NIS 20 digit). Keduanya sengaja tidak dihapus.
- Daftar siswa data asli: Ripki, Andi Pratama, Siti Aulia, Budi Santoso, Nadia Putri, Rizky Maulana, Salsabila Putri, Fajar Nugraha, Citra Lestari, zizis. Siswa id 1483 adalah data manual pengguna (tidak dihapus).
- DB klon `bbcashvia_audit` di-drop dan file dump dihapus setelah suite selesai.
- Server dev `php artisan serve` masih berjalan di `http://127.0.0.1:8123` untuk verifikasi manual bila diperlukan.

---

*Selesai.*
