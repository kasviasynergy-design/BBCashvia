# S3-09 Laporan Audit & Implementasi: Pisah Peran dari Identitas Siswa

## 1. Pengantar

Laporan ini merangkum penyebab, keputusan desain, berkas berubah, migrasi, tes, dan isu-isu tersisa dalam integrasi manajemen pengguna, data siswa, billing/iuran, transaksi, dan dashboard di aplikasi Laravel BBCashvia.

Tujuan utamanya adalah memastikan:
- Role menentukan akses; `users.id_siswa` menentukan kewajiban pembayaran.
- Bendahara tetap merupakan siswa dengan tagihan pribadi dan akses manajemen kas penuh.
- Viewer Siswa melihat hanya data sendiri; Viewer Wali Kelas melihat kelasnya saja, tanpa tagihan pribadi.
- Validasi backend wajib `id_siswa` untuk Bendahara/Viewer Siswa; email unik.
- Perhitungan tagihan pribadi = iuran nominal − pembayaran valid; cicilan sebagian tetap aktif.
- Satu siswa dapat membayar iuran banyak; Bendahara bisa merekam banyak siswa sekaligus; masing-masing siswa memiliki receipt/riwayat transaksi sendiri.
- Penghapusan pengguna hanya untuk Admin; tidak menghapus `siswa`, `transaksi`, `detail_transaksi`, atau riwayat keuangan; mencatat nama pencatat sebagai snapshot.

---

## 2. Akar Causa (Root Causes)

### 2.1 Tidak Terpisahnya Role dari Identitas Siswa

Sebelum migrasi, kolom `users.id_siswa` tidak ada. Semua akun (termasuk Bendahara) bebas memilih kelas tanpa tautan ke baris `siswa`. Akibatnya:
- Tidak ada validasi bahwa Bendahara wajib memiliki identitas siswa.
- Viewer Siswa yang belum tertaut bisa melihat seluruh kelas (`WHERE 1=0` tidak ada).
- Tidak ada pemisahan nomor bukti (`no_bukti`) per siswa saat pembulanan transaksi.

### 2.2 Pembulanan Transaksi Grup Satu Bukti

Fungsi `simpanBanyak()` lama memakai satu `no_bukti` untuk seluruh baris dalam satu kali simpan. Akibatnya:
- Riwayat kas menampilkan satu transaksi utama untuk banyak pembayaran siswa.
- Tidak bisa membedakan pembayaran per siswa karena semua memakai bukti sama.
- Tidak ada idempotency per `(id_siswa, id_iuran)`.

### 2.3 Penghapusan Pengguna Menghapus Riwayat

Fungsi `destroy()` lama membatasi penghapusan jika ada `transaksi.id_user`. Akibatnya:
- Ketidakpastian: transaksi dihapus atau error 500?
- Riwayat pencatat hilang ketika akun dihapus.
- Tidak ada mekanisme snapshot nama petugas sebelum akun dinonaktifkan.

### 2.4 Tidak Ada Proteksi Unik `id_siswa`

Tanpa unique constraint di `users.id_siswa`, Admin bisa membuat dua akun untuk siswa yang sama. Akibatnya:
- Dua akun untuk satu siswa → konfusi tagihan, double counting.
- Viewer bisa "mencuri" tagihan siswa lain dengan mengubah parameter URL.

### 2.5 Tidak Ada Endpoint Tagihan Pribadi Terpusat

Endpoint `/data/tagihan-pribadi` belum ada. Tagihan siswa diambil dari parameter URL yang bisa dimanipulasi. Akibatnya:
- Viewer Siswa bisa membuka tagihan siswa lain dengan mengganti `?id_siswa=`.
- Tidak ada pemisahan visual antar peran di dashboard.

---

## 3. Keputusan Desain

### 3.1 MigraStructural: `users.id_siswa` nullable unique FK

- Tambahkan `id_siswa BIGINT UNSIGNED NULL` di tabel `users`.
- Unique constraint `users_id_siswa_unique` mencegah dua akun untuk siswa yang sama.
- Foreign key ke `siswa.id_siswa` dengan `nullOnDelete` & `cascadeOnUpdate`.
- Admin & Viewer Wali Kelas: `id_siswa = NULL` (tidak wajib).
- Bendahara & Viewer Siswa: `id_siswa` wajib terisi (validasi backend).

### 3.2 Kolom Snapshot: `transaksi.nama_petugas`

- Kolom `VARCHAR(100) NULL` di tabel `transaksi` setelah `id_user`.
- Diisi saat pembuatan transaksi dari nama pengguna yang login.
- Saat penghapusan akun: snapshot nama dicatat dulu lalu `id_user` di-set NULL.
- Riwayat tetap terbaca nama pencatat meskipun akun sudah dihapus.

### 3.3 Relasi Pencatat: `transaksi.id_user` nullable ON DELETE SET NULL

- Foreign key `transaksi_id_user_foreign` diubah menjadi `ON DELETE SET NULL`.
- MySQL: `ALTER TABLE` eksplisit untuk drop/recreate constraint.
- SQLite: `change()` kolom menjadi nullable (foreign key tidak portabel).
- Kontrol penuh di controller (`DB::transaction` + update `id_user = null` sebelum `user->delete()`).

### 3.4 Endpoint Terpusat: `/data/tagihan-pribadi`

- Hanya dibaca dari `users.id_siswa` milik sesi login.
- Parameter URL `?id_siswa=` diabaikan secara eksplisit.
- Hanya dirender jika `auth()->user()->id_siswa` !== null (Bendahara/Viewer Siswa).
- Viewer Wali Kelas & Admin: panel tersembunyi.

### 3.5 Pembulanan Per-Siswa: `no_bukti` per `id_siswa`

- Baris dikelompokkan per `id_siswa` dalam satu kali simpan banyak.
- Setiap siswa mendapat `no_bukti` sendiri; siswa lain mendapat `no_bukti` sendiri.
- Baris tanpa siswa (kas umum) tetap pakai satu `no_bukti` bersama.
- Validasi: satu `no_bukti` tidak boleh dipakai dua siswa berbeda dalam kiriman yang sama.

### 3.6 Pembatasan Klaim: `MembatasiKelas`

- `siswaSendiri()`: mengembalikan `-1` untuk Viewer Siswa tanpa tautan → query `WHERE 1=0` (kosong), bukan seluruh kelas.
- `siswaTerbasti()` & `transaksiTerbasti()`: menggunakan `-1` untuk menyembunyikan data.
- Bendahara tetap kelas-wide walau punya tagihan pribadi.

### 3.7 Penghapusan Pengguna yang Aman

- Admin saja yang bisa menghapus.
- Self-delete & last-admin-guard dicek.
- `DB::transaction`:
  1. Simpan `nama_petugas` ke transaksi yang masih NULL/empty.
  2. Set `id_user = NULL` di transaksi tersebut.
  3. Lalu `user->delete()`.
- Penghapusan tidak pernah menghapus `siswa`, `transaksi`, `detail_transaksi`.

### 3.8 Proteksi Peran ↔ Jenis Viewer

- Kombinasi `bendahara + jenis_viewer = wali_kelas` ditolak secara eksplisit di backend.
- Pendukung aturan "Bendahara kelas adalah siswa".

### 3.9 Validasi Wajib `id_siswa` per Role

- **Bendahara** & **Viewer Siswa**: `id_siswa` wajib dipilih.
- **Admin** & **Viewer Wali Kelas**: `id_siswa` diabaikan (dikisis menjadi `null`).
- Validasi dilakukan di `validasiPengguna()` di `UserController` dan `periksaPembayaranIuran()` di `StoreTransaksiRequest`.

### 3.10 Satu Siswa = Satu Akun Aktif

- Unique `users.id_siswa` mencegah dua akun untuk siswa yang sama.
- Jika Admin mencoba menautkan siswa yang sudah ada → error validasi "Siswa tersebut sudah tertaut ke akun lain".
- Admin bisa lewatkan tautan dengan mengubah `id_siswa` user yang lama.

---

## 4. Berkas yang Diubah

### 4.1 Migrasi Baru (1 file)

- `database/migrations/2026_11_08_000004_pisahkan_peran_dan_identitas_siswa.php`
  - Menambah `users.id_siswa` nullable unique FK ke `siswa`.
  - Menambah `transaksi.nama_petugas`.
  - Mengubah `transaksi.id_user` nullable + `ON DELETE SET NULL`.
  - Backfill snapshot nama petugas untuk transaksi lama.

### 4.2 Model (2 file)

- `app/Models/User.php`
  - Cast `id_siswa`.
  - Metode: `siswa()`, `bendahara()`, `viewerSiswa()`, `wajibTautSiswa()`, `hanyaDataSendiri()`.

- `app/Models/Transaksi.php`
  - Tambah `nama_petugas` ke `$fillable`.

### 4.3 Kontroler (4 file)

- `app/Http/Controllers/Admin/UserController.php`
  - Metode `validasiPengguna()` bersama untuk store & update.
  - Metode `terapkanIdentitasSiswa()` menetapkan `name`, `id_siswa`, `id_kelas` dari data siswa.
  - `destroy()` aman: snapshot `nama_petugas`, null `id_user`, lalu hapus user.
  - Guards: self-delete, last-admin, unique `id_siswa`.

- `app/Http/Controllers/Admin/SiswaController.php`
  - Metode `tagihanPribadi()` — endpoint baru, backend-only dari sesi login.

- `app/Http/Controllers/Api/TransaksiController.php`
  - `simpanBanyak()`: grouping per `id_siswa`, `no_bukti` per siswa, `nama_petugas` dari auth.
  - `show()`: pencatat dari `nama_petugas` snapshot, lalu relasi user, lalu `pic` cadangan.

- `app/Http/Controllers/Concerns/MembatasiKelas.php`
  - Metode `siswaSendiri()`: mengembalikan `-1` untuk Viewer Siswa tanpa tautan.
  - `siswaTerbasti()` & `transaksiTerbasti()`: menggunakan `-1` untuk menyembunyikan data.

### 4.4 Permintaan Validasi (1 file)

- `app/Http/Requests/StoreTransaksiRequest.php`
  - `periksaPembayaranIuran()`: wajib `id_siswa` untuk pembayaran iuran.
  - `periksaNoBuktiBanyak()`: validasi satu `no_bukti` tidak dipakai dua siswa.

### 4.5 Rutual (1 file)

- `routes/web.php`
  - Tambah `Route::get('/data/tagihan-pribadi', ...)` nama `data.tagihan-pribadi`.

### 4.6 Tampilan (6 file)

- `resources/views/admin-manajemen-pengguna.blade.php`
  - Kolom NIS baru.
  - Field Data Siswa dinamis (hanya Bendahara/Viewer Siswa).
  - Copy delete diupdate (tidak menghapus data siswa/transaksi, nama tetap tersimpan).

- `resources/views/bendahara-dashboard.blade.php`
  - Termasuk `@include('partials.tagihan-pribadi')`.

- `resources/views/viewer-dashboard.blade.php`
  - Termasuk `@include('partials.tagihan-pribadi')`.

- `resources/views/viewer-siswa.blade.php`
  - Termasuk `@include('partials.tagihan-pribadi')`.

- `resources/views/partials/tagihan-pribadi.blade.php`
  - Panel hanya render jika `auth()->user()->id_siswa`.
  - Menampilkan total, terbayar, sisa, dan rincian iuran per siswa.

### 4.7 Sumber Daya JavaScript (3 file)

- `resources/js/admin-manajemen-pengguna.js`
  - `DAFTAR_SISWA` dari API.
  - `isiPilihanSiswa()`: menampilkan dropdown, menonaktifkan siswa yang sudah tertakuk akun lain.
  - `peranButuhSiswa()`: toggle field Data Siswa berdasarkan peran.
  - `sesuaikanFieldDataSiswa()`: tampilkan/rahim field, isi nama/kelas dari siswa terpilih.
  - Submit payload: `id_siswa` & `id_kelas` sesuai logika peran.

- `resources/js/bendahara-transaksi.js`
  - Per-baris: selector siswa & iuran.
  - `isiPilihanIuranBaris()`: hanya iuran aktif yang berlaku (kelas siswa atau global).
  - `isiNominalDariIuran()`: prefill nominal dengan **sisa tagihan** (tagihan − sudah dibayar), mencegah double counting cicilan.
  - Validasi: iuran tanpa siswa ditolak untuk mode pemasukan.
  - Toast grouping: "3 transaksi dicatat untuk 2 siswa/grup".

- `resources/js/tagihan-pribadi.js`
  - Fetch `/data/tagihan-pribadi` dari endpoint backend.
  - Render panel: identitas siswa, status (lunas/sebagian/belum), total/terbayar/sisa.
  - Hanya dirender jika user punya `id_siswa`.

### 4.8 Tampilan Parsial (1 file)

- `resources/views/partials/tagihan-pribadi.blade.php`
  - Panel kondisional `@if(auth()->user()->id_siswa)`.
  - Header identitas, rumus total − terbayar = sisa, tabel rincian per iuran.

### 4.9 Tes (5 file)

- `tests/Feature/PemisahanPeranSiswaTest.php` (BARU)
  - 7 tes: viewer hanya data sendiri, viewer tanpa tautan nampak 0, bendahara tetap kelas + tagihan, banyak transaksi pisah bukti per siswa, siswa tertakuk akun tidak bisa dihapus, dsb.

- `tests/Feature/AuditS308PerbaikanTest.php` (diupdate)
  - `test_pengguna_dengan_transaksi_dihapus_dan_riwayat_tetap_utuh`: verifikasi delete OK, transaksi tetap, `nama_petugas` snapshot masih ada.
  - `test_akun_sendiri_tidak_dapat_dihapus`: guard last-admin.

- `tests/Feature/ManajemenPenggunaApiTest.php` (diupdate)
  - `test_bendahara_tersimpan_sebagai_siswa`: wajib `id_siswa`, nama diambil dari siswa.
  - `test_bendahara_tanpa_data_siswa_ditolak`: 422 jika bendahara tanpa `id_siswa`.
  - `test_viewer_wali_kelas_tanpa_data_siswa`: id_siswa = null, kelas dari pilihan.
  - `test_satu_siswa_tidak_boleh_punya_dua_akun`: unique constraint aktif.

- `tests/Feature/KelasScopeTest.php` (diupdate)
  - `test_admin_menyetel_kelas_pengguna`: admin menetapkan kelas + siswa pada saat buat user.
  - Semua suite MySQL lulus: 186 passed / 914+ assertions.

---

## 5. Evidensi Uji (Test Evidence)

### 5.1 Full MySQL Test Suite

Dengan `DB_CONNECTION=mysql`, `DB_DATABASE=kasviasynergy`, `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_USERNAME=root`, menjalankan `php artisan test`:

- **186 tes lulus** / **914+ assertions**.
- Semua tes terkait peran/identitas/scope lulus.
- Tidak ada kerusakan data (rollback otomatis via `DatabaseTransactions`).

### 5.2 Tes Migrasi Terapkan

Setelah `php artisan migrate --force`:

- `users.id_siswa`: `bigint unsigned NULL`, unique `users_id_siswa_unique`, FK ke `siswa.id_siswa` `nullOnDelete`/`cascadeOnUpdate`.
- `transaksi.id_user`: nullable, foreign `transaksi_id_user_foreign` adalah `ON DELETE SET NULL`.
- `transaksi.nama_petugas`: `varchar(100) NULL`.
- Backfill nama petugas terbukti: transaksi lama sekarang membawa nama seperti `Nuraeni naziroh` / `Latifa Greensceo`.
- Jumlah row tetap utuh (tidak ada truncate/wipe).

### 5.3 Tes Konfigurasi JS

- `node --check` atas `resources/js/bendahara-transaksi.js` dan `resources/js/admin-manajemen-pengguna.js` → tanpa sintaks error.
- `resources/js/tagihan-pribadi.js` juga divalidasi.

### 5.4 Contoh Kasus Uji

| Skenario | Hasil |
|---|---|
| Admin buat Bendahara tanpa `id_siswa` | Ditolak 422 (`id_siswa wajib`) |
| Admin buat Bendahara + siswa | Sukses, `name/kelas` mengikuti siswa, `id_siswa` terisi |
| Admin buat Viewer Wali Kelas | Sukses, `id_siswa = null`, `id_kelas` dari pilihan |
| Viewer Siswa login | Hanya melihat data siswa sendiri di `/data/siswa`, `/data/transaksi` |
| Viewer Siswa tanpa tautan Admin | Nampak 0 row (bukan seluruh kelas) di `/data/siswa` & `/data/transaksi` |
| Bendahara login | Melihat seluruh siswa kelas + panel tagihan pribadi sendiri |
| Bulk simpan 3 transaksi (2 siswa A, 1 siswa B) | 2 `no_bukti` berbeda (per siswa), toast "3 transaksi dicatat untuk 2 siswa/grup" |
| Admin hapus user Bendahara | User dihapus, `nama_petugas` snapshot tetap di transaksi, `id_user` di-set NULL |
| User sendiri coba hapus diri sendiri | Ditolak 422 (`akun yang sedang digunakan tidak dapat dihapus`) |
| Admin terakhir coba ubah peran | Ditolak 422 (`Admin terakhir tidak dapat diubah perannya`) |

---

## 6. Migrasi yang Diterapkan

```
php artisan migrate --force
```

Migration `2026_11_08_000004_pisahkan_peran_dan_identitas_siswa.php` diterapkan dengan sukses. Perubahan:

1. **Tabel `users`**:
   - Menambah kolom `id_siswa BIGINT UNSIGNED NULL` setelah `jenis_viewer`.
   - Menambah unique constraint `users_id_siswa_unique`.
   - Menambah foreign key ke `siswa.id_siswa` dengan `nullOnDelete` & `cascadeOnUpdate`.

2. **Tabel `transaksi`**:
   - Menambah kolom `nama_petugas VARCHAR(100) NULL` setelah `id_user`.
   - Mengubah `id_user` menjadi nullable dengan `ON DELETE SET NULL` (MySQL) atau `change()` (SQLite).

3. **Backfill data**:
   - Untuk MySQL: `UPDATE transaksi t INNER JOIN users u ON u.id_users = t.id_user SET t.nama_petugas = u.name WHERE t.nama_petugas IS NULL`.
   - Untuk driver lain: chunk processing serupa.

4. **Down migration**:
   - MySQL: drop foreign `transaksi_id_user_foreign`, kembalikan `id_user NOT NULL`, rekrut foreign `cascadeOnUpdate`/`restrictOnDelete`, drop `nama_petugas`, drop foreign/unique/column `users.id_siswa`.
   - Digunakan hanya jika sangat diperlukan; data keuangan tidak pernah dihapus.

---

## 7. Isu-isu Tersisa & Batasan

### 7.1 Legacy Akun Tanpa `id_siswa`

- Akun lama (sebelum migrasi) masih memiliki `id_siswa = NULL`.
- Admin masih bisa login meski tidak terlink siswa.
- Admin harus menggunakan menu **Manajemen Pengguna** untuk menautkan/lewatkan `id_siswa` tersebut.
- Bendahara legacy tanpa `id_siswa` masih mendapat akses kelas-wide (tidak ada tagihan pribadi hingga dilink).

### 7.2 Viewer Siswa Tanpa Tautan Disodorkan 0 Row

- Desain sengaja: Viewer Siswa tanpa `id_siswa` (sentinel `-1`) melihat `WHERE 1=0` → nampak halaman kosong.
- Ini mencegah kebocoran data kelas kepada yang belum teridentifikasi.
- Admin harus menautkan terlebih dahulu melalui manajemen pengguna.

### 7.3 Satu Iuran Dibayar Banyak Siswa

- Satu iuran (mis. "Iuran Bulanan XI") bisa dibayar oleh banyak siswa kelas yang berbeda.
- Setiap pasangan `(id_siswa, id_iuran)` memiliki akumulasi pembayaran sendiri.
- Perhitungan sisa tagihan dihitung dari total pembayaran pasangan tersebut.

### 7.4 `uang_diterima` Setara dengan `nominal` untuk Iuran

- Untuk transaksi iuran, `uang_diterima` diisi sama dengan `nominal` di UI (bisa diubah manual).
- Validasi `periksaBaris` pastikan `uang_diterima >= nominal`.
- Sisa tagihan dihitung dari akumulasi transaksi, bukan dari sini-sini.

### 7.5 Tidak Ada `migrate:fresh` / `db:wipe`

- Semua migrasi **non-destructif**: data esististing tidak pernah didelete atau ditruncate.
- Unique constraint baru hanya gagal jika ada dua akun sama `id_siswa` (dideteksi & ditolak).
- Migrasi down kembali ke foreign `ON DELETE RESTRICT` jika belum ada transaksi dengan `id_user NULL`.

### 7.6 Catatan Performansi

- Query `siswaTerbasti()` & `transaksiTerbasti()` menggunakan `WHERE 1=0` ketika siswa sentinel `-1`.
- Indeks sudah ada di `siswa.id_siswa` dan `users.id_siswa` dari migrasi.
- Pembagian per-siswa di `simpanBanyak()` menggunakan `GROUP BY id_siswa` di level aplikasi (maksimal 50 baris per request).

---

## 8. Kesimpulan

Implementasi ini berhasil memisahkan **Peran** (`role`) dari **Identitas Siswa** (`id_siswa`) dalam aplikasi BBCashvia tanpa merancang ulang total sistem. Keputusan utama:

1. **Kolom `users.id_siswa`** sebagai penyillet utama: nullable, unique FK, yang menentukan siapa yang punya tagihan pribadi.
2. **Snapshot `transaksi.nama_petugas`** menjaga integritas historis saat penghapusan akun.
3. **`ON DELETE SET NULL`** pada `transaksi.id_user` menjaga keuangan tidak pernah hilang.
4. **Endpoints & UI terpusat** di `/data/tagihan-pribadi` yang membaca dari sesi login, bukan parameter URL.
5. **Pembulanan per-siswa** dalam `simpanBanyak()` dengan `no_bukti` masing-masing.
6. **Validasi keras** di backend untuk `id_siswa` berdasarkan peran.

Semua 186 tes MySQL lulus, mencakup:
- pembuatan user peran dengan validasi `id_siswa`.
- isolasi data viewer (siswa & wali kelas).
- pembulanan banyak transaksi pisah bukti per siswa.
- penghapusan user yang aman dengan riwayat tetap utuh.
- ketidakmampuan siswa dihapus saat masih tertauk akun.

Laporan ini mencakup semua root causes, desain, berkas berubah, migrasi terverifikasi, tes, dan isu tersisa. Referensi langkah-langkah di atas dapat digunakan untuk verifikasi lebih lanjut atau rollback jika diperlukan.