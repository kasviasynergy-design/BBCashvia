# S4-02 — Laporan Implementasi & Pengujian Demo Day (BBCashvia)

**Aplikasi:** BBCashvia — Kas Kelas Digital (KASVIA Synergy)  
**Prosedur:** S4-02 Demo Day Readiness  
**Tanggal:** 19 November 2026  
**Branch kerja:** `hotfix/cr-exam`  
**Status:** Selesai diimplementasikan dan diuji; **belum di-commit** (menunggu instruksi).

---

## A. Ringkasan

Delapan kemampuan demo day ditambahkan tanpa mengubah skema basis data, tanpa data dummy, dan tanpa mengubah identitas visual BBCashvia. Seluruh angka dan daftar diambil langsung dari MySQL `bbcashvia` melalui Eloquent. Hak akses kelas tetap memakai trait `MembatasiKelas`; peran Admin, Bendahara, dan Viewer tidak diubah.

| # | Fitur | Status |
|---|---|---|
| 1 | Filter kelas **khusus Admin** pada 6 halaman (Siswa, Iuran, Transaksi, Riwayat, Laporan Kas, Manajemen Pengguna) dari data DB | Selesai |
| 2 | Import Pengguna massal: template, pratinjau, validasi, duplikat, rekap | Selesai |
| 3 | Penjelasan/penolakan DOCX sebagai format bukan tabular | Selesai |
| 4 | Password awal otomatis + berkas akun XLSX rahasia | Selesai |
| 5 | Laporan kas Admin/Bendahara/Viewer dengan filter kelas & periode nyata | Selesai |
| 6 | Riwayat transaksi dengan dropdown kelas + filter lama yang tetap jalan | Selesai |
| 7 | Data Siswa pagination server-side maksimal 10 baris per peran | Selesai |
| 8 | Cetak laporan (kop BBCashvia) + unduh PDF | Selesai |

---

## B. Fitur, Cara Kerja, dan Berkas Terkait

### 1. Filter kelas khusus Admin (6 halaman)

Filter kelas tersedia di halaman Admin: **Data Siswa, Data Iuran, Transaksi, Riwayat Transaksi, Laporan Kas, dan Manajemen Pengguna**.

- Dropdown selalu memakai **Semua Kelas** (`value="semua"`) plus daftar kelas dari database (`/admin/api/kelas` atau `/data/kelas`). Tidak ada array kelas statis.
- Pilihan kelas dikirim sebagai `?id_kelas=` dan diproses di server. Untuk non-admin, parameter ini **divalidasi dan diabaikan** sepenuhnya oleh pembantu bersama `MembatasiKelas::validasiFilterKelasAdmin()` / `terapkanFilterKelasAdmin()`, sehingga tidak memicu 422 juga tidak melebar/mempersempit data mereka.
- Filter bekerja bersama pencarian, status/kategori/jenis, periode tanggal, dan pagination. Nilai `id_kelas` serta `page` disimpan di URL (`history.replaceState`), sehingga pilihan kelas tetap terbawa saat pindah halaman maupun reload.
- Halaman Bendahara/Viewer tidak memuat modul `admin-filter-kelas.js` dan tidak memiliki dropdown kelas; tampilan serta hak akses mereka tidak diubah.

**Berkas:** `app/Http/Controllers/Concerns/MembatasiKelas.php`, `app/Http/Controllers/Admin/{User,Siswa,Iuran}Controller.php`, `app/Http/Controllers/Api/TransaksiController.php`, `app/Http/Controllers/LaporanKasController.php`, `resources/js/admin-filter-kelas.js`, enam view/JS Admin terkait.

### 2. Import Pengguna massal

Alur: **Unduh template → pilih berkas → Preview → periksa rekap → Konfirmasi → unduh berkas akun**.

- Rute baru:
  - `GET admin/api/pengguna/template`
  - `POST admin/api/pengguna/preview`
  - `POST admin/api/pengguna/import`
- Format diterima: `.xlsx`, `.xls`, `.csv`; maksimal 2 MB dan 200 baris.
- Template XLSX berisi sheet `Template Pengguna` (kolom: Nama, Email, NIS, Peran, Jenis Viewer, Kelas) dan sheet `Petunjuk`.
- Preview **tidak menulis database**. Data ternormalisasi dikirim kembali untuk konfirmasi, lalu **divalidasi ulang server** sebelum `save()`.
- Validasi per baris: nama/email/peran wajib, email unik (case-insensitive, cek DB + cek antarbaris), role hanya `admin`/`bendahara`/`viewer`, jenis viewer `siswa`/`wali_kelas`, NIS wajib untuk Bendahara & Viewer Siswa dan harus ada di `siswa`, NIS tidak boleh sudah punya akun, kelas harus terdaftar (atau memakai kelas default pilihan Admin).
- Duplikat dalam satu berkas dilaporkan dengan nomor baris asal.
- Rekap menampilkan `total`, `berhasil`, `gagal`, dan `rincian` berisi nomor baris + alasan. Baris invalid dilewati; seluruh proses dibungkus `DB::transaction()`.

**Berkas baru:** `app/Http/Controllers/Admin/PenggunaImportController.php`, `app/Support/BerkasAkun.php`.  
**Berkas diubah:** view/JS/CSS Manajemen Pengguna, `routes/web.php`.

### 3. DOCX bukan format tabular

DOCX adalah format dokumen (paragraf, tabel bebas, gaya), bukan format tabular yang deterministik seperti Excel/CSV. Mengurai DOCX rentan salah kolom dan baris, sehingga:

- Validasi `mimes` hanya menerima Excel/CSV.
- Ekstensi `.docx`/`.txt` ditolak dengan pesan eksplisit: *“DOCX adalah format dokumen, bukan tabel. Simpan tabel sebagai .xlsx atau .csv.”*
- Petunjuk pada template XLSX memuat catatan yang sama.

Bagian ini sengaja dijadikan edukasi pengguna, bukan sekadar galat teknis.

### 4. Password awal otomatis & berkas akun

- `app/Support/KataSandiAwal.php` menghasilkan 12 karakter dengan minimal satu huruf kapital, huruf kecil, angka, dan simbol. Karakter mudah tertukar (`I`, `O`, `0`, `1`) tidak dipakai. Urutan diacak dengan `random_int()`.
- Password disimpan hanya sebagai `Hash::make(...)` pada `users.password`; `users.must_change_password = true` diset saat pembuatan (kolom sudah ada, tidak ada migrasi baru).
- Password plaintext hanya muncul **sekali** di respons pembuatan/import. Tidak disimpan ke DB, storage, cache, maupun log. Tidak ada cara mengambilnya kembali dari database.
- Untuk tambah pengguna manual, field password pada form kini opsional; bila kosong, generator yang dipakai.
- Respons idempotensi `UserController` dibersihkan dari `password_awal`, `akun`, dan `file_xlsx` sebelum di-cache (override `simpanTanggapanIdempotensi()`), agar rahasia tidak tersimpan di cache idempotensi.
- `BerkasAkun::akun()` membuat XLSX di memori dengan kolom **Nama Pengguna, Email/Gmail, Kelas, Role, Password Awal** plus peringatan kerahasiaan. XLSX dikirim sebagai base64 pada respons, lalu diunduh browser; tidak ditulis ke server.

### 5. Laporan kas berbasis data DB

- Controller baru `LaporanKasController` memakai `MembatasiKelas` + `MenghitungSaldoKas`.
- Filter: `dari`, `sampai`, dan `id_kelas`. `id_kelas` hanya dipakai Admin untuk mempersempit; Bendahara/Viewer tetap terkunci pada kelasnya oleh trait (tidak bisa melihat kelas lain lewat query string).
- Ringkasan (`total_masuk`, `total_keluar`, `saldo_sekarang`) dihitung dari query yang already-terbatas, sehingga tidak pernah mencampur kelas.
- Transaksi dikelompokkan per `no_bukti`; nominal memakai `nominal_grup`/jumlah `detailTransaksis` agar pembayaran multi-iuran tidak terpotong menjadi satu nominal.
- Perbaikan lama: laporan Bendahara tidak lagi memakai array `DATA_TRANSAKSI` demo, kini mengambil `/bendahara/api/transaksi`, melakukan dedupe `no_bukti`, dan menjumlahkan nominal grup.

**Berkas:** `app/Http/Controllers/LaporanKasController.php`, `resources/js/admin-laporan-kas.js`, `resources/js/bendahara-laporan-kas.js`, `resources/js/viewer-laporan-kas.js`, view laporan kas terkait, CSS Bendahara/Viewer.

### 6. Riwayat transaksi

- `TransaksiController::index()` menerima `dari`, `sampai`, `id_kelas` (khusus Admin) dalam satu query untuk daftar sekaligus `ringkasan`; payload `filter` dikembalikan ke frontend.
- Admin: dropdown kelas baru `filterKelasRiwayat` dari `/data/kelas`, opsi **Semua Kelas**, dikirim sebagai `?id_kelas=`. Tombol reset memuat ulang daftar.
- Viewer: perbaikan mismatch ID DOM menjadi `riwayatTableBody`, ditambah `categoryFilter`, `dariTanggal`, `sampaiTanggal`, `tableCount`, dan `ringkasanTransaksi`. Filter kategori dipetakan ke jenis `masuk`/`keluar`; nominal grup dipakai; output di-escape. Semua elemen diberi guard agar halaman tidak error bila elemen opsional absen.
- Filter lama tetap berfungsi; endpoint lama tetap mengembalikan struktur lama.

**Berkas:** `app/Http/Controllers/Api/TransaksiController.php`, `resources/js/admin-riwayat-transaksi.js`, `resources/js/viewer-riwayat-transaksi.js`, view riwayat terkait.

### 7. Pagination siswa server-side

- `SiswaController::index()` mendapat mode opt-in `?serverSide=1&page=...`.
- Mode ini memakai `paginate(10)` dan mengembalikan `pagination` (total, per_page, current_page, last_page, dll.) serta `statistik`. Filter `q`, `id_kelas`, `jenis_kelamin`, `status`, `status_iuran` tetap diterapkan di query SQL sebelum pagination.
- **Kompatibilitas:** bila `serverSide` tidak dikirim, respons tetap berisi seluruh data seperti sebelumnya. Ini menjaga 207 test lama dan pemanggil lama tetap lolos. Tidak ada seluruh baris siswa yang dikirim ke JS ketika mode server-side aktif.
- Frontend Admin/Bendahara/Viewer siswa memakai `serverSide=1`, menampilkan info “Menampilkan X–Y dari Z data” dan halaman aktif, serta kontrol Prev/Next + nomor halaman. Hak akses per peran tetap memakai `siswaTerbatas()`.

**Berkas:** `app/Http/Controllers/Admin/SiswaController.php`, `resources/js/{admin,bendahara,viewer}-siswa.js`, `resources/views/{admin,bendahara,viewer}-siswa.blade.php`.

### 8. Cetak laporan & unduh PDF

- Rute baru:
  - `GET /laporan-kas/cetak`
  - `GET /laporan-kas/pdf`
- Keduanya menerima `?dari=&sampai=&id_kelas=` dan memakai controller yang sama dengan halaman laporan, sehingga angka cetak/PDF identik dengan layar.
- View standalone `resources/views/laporan-kas-cetak.blade.php` memuat kop identitas BBCashvia (logo + “BBCashvia” + “KASVIA Synergy”), judul, nama kelas, periode, tanggal cetak, nama petugas, ringkasan, dan rincian transaksi.
- CSS print menyembunyikan sidebar, navbar, dan tombol; halaman memakai `@page A4`; tabel `break-inside: avoid` agar baris tidak terpotong.
- Tombol **Cetak** dan **Unduh PDF** hadir di laporan kas Admin, Bendahara, dan Viewer. Periode viewer dipetakan ke query `dari`/`sampai`.
- PDF dibuat server-side dengan Dompdf. Karena Dompdf membutuhkan ekstensi GD untuk PNG dan GD tidak terpasang di lingkungan lokal, PDF memakai versi JPEG dari logo yang sama (`public/image/Logo BBCashvia.pdf.jpg`); halaman cetak browser tetap memakai PNG asli. Jika JPEG tidak ada, controller fallback ke PNG.

**Berkas:** `app/Http/Controllers/LaporanKasController.php`, `resources/views/laporan-kas-cetak.blade.php`, `public/image/Logo BBCashvia.pdf.jpg`, view/JS/CSS laporan kas per peran, `routes/web.php`.

---

## C. Perubahan Basis Data & Relasi

### Perubahan skema

**Tidak ada.** Tidak ada tabel baru, kolom baru, migration baru, atau perubahan data lama. Kolom `users.must_change_password` sudah tersedia di database dan langsung dipakai. Tidak ada `migrate` yang dijalankan karena masih ada migration pending yang berisiko mengubah data lokal.

### Relasi yang dipakai

| Model | Relasi | Pemakaian |
|---|---|---|
| `User` | `belongsTo Kelas` (`id_kelas`), `belongsTo Siswa` (`id_siswa`) | Filter pengguna, pembatasan kelas, identitas Viewer Siswa |
| `Siswa` | `belongsTo Kelas` (`id_kelas`) | Import NIS → kelas, pagination, laporan |
| `Transaksi` | `belongsTo Kelas`, `Siswa`, `User`, `Iuran`; `hasMany DetailTransaksi` | Laporan, riwayat, ringkasan saldo, pengelompokan `no_bukti` |
| `Kelas` | daftar dipakai semua dropdown | Filter kelas nyata dari DB |

Pembatasan akses terpusat di `MembatasiKelas`: Admin → `null` (semua kelas), Bendahara/Viewer → `users.id_kelas`, Viewer Siswa → `users.id_siswa`. Nilai `-1` dipakai sebagai sentinel bila pengguna non-admin belum memiliki kelas/identitas sehingga query mengembalikan kosong, bukan membocorkan data kelas lain.

---

## D. Dependensi & Aset

- Ditambahkan: `phpoffice/phpspreadsheet:5.11` (template/import/ekspor XLSX) dan `dompdf/dompdf:3.1.6` (PDF).
- `composer.json` memuat `"platform": {"ext-gd": "8.2.12"}` agar instalasi Composer tidak gagal pada PHP lokal tanpa GD. `composer.lock` sudah disinkronkan via `composer update --lock --no-scripts`.
- `composer validate --no-check-publish` lolos dengan peringatan versi eksak untuk dua paket baru (bukan error lock).
- `npm run build` berhasil; `public/build/manifest.json` dan aset hasil build diperbarui (file lama terhapus, file baru muncul).
- Warna yang dipakai tetap: `#2BA19E`, `#237A77`, `#D4F1F9`, `#FFFDFF`, `#FFFFFF`, `#A5DBE3`, `#F4D98E`. Font/sidebar/header/spacing/ID/class/JS lama tidak dirombak; perubahan hanya penambahan kontrol dan perbaikan yang diperlukan.

---

## E. Hasil Pengujian

### 1. Uji khusus fitur demo day

Perintah: `php artisan test tests/Feature/DemoDayFiturTest.php --testdox`

```
Tests:    7 passed (130 assertions)
Duration: 1.09s
```

| Uji | Hasil |
|---|---|
| Halaman cetak memuat kop dan filter | PASS |
| Unduh PDF menghasilkan dokumen `%PDF` | PASS |
| Pagination siswa server-side maksimal 10 baris | PASS |
| Template import XLSX dapat diunduh | PASS |
| Preview import tidak menyimpan baris invalid | PASS |
| DOCX ditolak karena bukan format tabular | PASS |
| Password awal memenuhi aturan aplikasi | PASS (100 iterasi) |

### 2. Uji revisi filter kelas khusus Admin

Perintah: `php artisan test tests/Feature/FilterKelasKhususAdminTest.php --testdox`

```
Tests:    8 passed (44 assertions)
Duration: 0.84s
```

| Uji | Hasil |
|---|---|
| Admin memfilter siswa per kelas (＋ pagination 10/baris) | PASS |
| Bendahara mengirim `id_kelas` palsu → tetap kelasnya, tanpa 422 | PASS |
| Admin memfilter iuran per kelas | PASS |
| Bendahara tidak bisa memakai filter iuran | PASS |
| Admin memfilter transaksi per kelas | PASS |
| Viewer tidak bisa memakai filter transaksi | PASS |
| Filter juga berlaku di laporan cetak & Manajemen Pengguna | PASS |
| Modul/filter kelas hanya ada di 6 halaman Admin | PASS |

### 3. Regresi seluruh suite

Perintah: `php artisan test`

```
Tests:    222 passed (1199 assertions)
Duration: 48.22s
```

Riwayat penambahan test: awal **207 passed (1025 assertions)** → setelah 8 fitur demo day **214 passed (1155 assertions)** → setelah revisi filter kelas Admin **222 passed (1199 assertions)**. Tidak ada regresi.

### 4. Pemeriksaan lain

- `node --check` lolos untuk seluruh JS yang diubah, termasuk `admin-filter-kelas.js` dan 6 modul Admin (siswa, iuran, transaksi, riwayat, laporan kas, manajemen pengguna).
- `php -l` lolos untuk seluruh controller/support/test baru dan yang diubah.
- `php artisan route:list --path=...` mengonfirmasi 3 rute import dan 2 rute cetak/PDF terdaftar.
- Pembacaan DB nyata via tinker: `users=2`, `kelas=1`, `siswa=1`, `transaksi=0`; kolom `must_change_password` terbukti ada.
- Data uji memakai transaksi nyata yang dibuat test di database testing; tidak ada data produksi yang dihapus atau ditimpa.

---

## F. Kendala & Catatan

1. **DOCX** — bukan format tabular; sengaja ditolak dengan pesan edukatif. Pengguna harus menyimpan tabel sebagai `.xlsx`/`.csv` terlebih dahulu.
2. **ext-gd tidak terpasang** — Composer memakai `platform config` agar instalasi sukses, sedangkan Dompdf butuh GD untuk PNG. Diatasi dengan menyediakan versi JPEG logo untuk PDF. Jika lingkungan produksi memiliki GD, PNG asli tetap bisa dipakai lewat fallback.
3. **Composer audit** — 9 advisory pada 6 paket dilaporkan; sebagian besar berasal dari paket lama, bukan dua dependensi baru. Perlu ditindaklanjuti terpisah, tidak menghalangi demo.
4. **Data lokal sangat sedikit** (1 kelas, 1 siswa, 0 transaksi), sehingga tampilan laporan/riwayat saat demo menampilkan ringkasan kosong. Ini bukan bug; angka akan otomatis terisi saat transaksi nyata dicatat.
5. **Migration pending** sengaja tidak dijalankan agar tidak merusak data lokal. Tidak ada perubahan skema yang diperlukan untuk fitur ini.
6. **Belum di-commit** — seluruh perubahan masih uncommitted di `hotfix/cr-exam`. Sesuai instruksi, commit/push tidak dilakukan.

---

## G. Daftar Berkas Terdampak (Ringkas)

**Controller / Support (baru):** `PenggunaImportController.php`, `LaporanKasController.php`, `KataSandiAwal.php`, `BerkasAkun.php`.  
**Controller / Concern (diubah):** `Concerns/MembatasiKelas.php`, `Admin/UserController.php`, `Admin/SiswaController.php`, `Admin/IuranController.php`, `Api/TransaksiController.php`, `LaporanKasController.php`.  
**Route:** `routes/web.php` (+3 import, +2 cetak/PDF).  
**View baru:** `laporan-kas-cetak.blade.php`.  
**View diubah:** admin manajemen pengguna, admin/bendahara/viewer laporan kas, admin/viewer riwayat transaksi, admin/bendahara/viewer siswa, **admin iuran**, **admin transaksi**.  
**JS baru:** `resources/js/admin-filter-kelas.js`.  
**JS diubah:** 6 modul Admin (manajemen pengguna, siswa, iuran, transaksi, riwayat, laporan kas) + bendahara/viewer laporan kas, viewer riwayat, bendahara/viewer siswa.  
**CSS diubah:** admin manajemen pengguna, bendahara laporan kas, viewer laporan kas.  
**Aset:** `public/image/Logo BBCashvia.pdf.jpg`, hasil `npm run build`.  
**Test baru:** `tests/Feature/DemoDayFiturTest.php`, `tests/Feature/FilterKelasKhususAdminTest.php`.  
**Dependensi:** `composer.json`, `composer.lock`.  
**Model:** tidak ada perubahan. **Migration:** tidak ada perubahan.

---

**Kesimpulan:** Delapan fitur demo day siap ditampilkan, termasuk revisi akhir filter kelas yang hanya aktif untuk Admin pada 6 halaman. Seluruh pengujian lolos (222 test, 1199 assertion), tidak ada perubahan database, dan identitas visual BBCashvia terjaga. Menunggu keputusan untuk commit/release.
