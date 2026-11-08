# Laporan Audit Database & Sinkronisasi BBCashvia (S3-08)

| Item | Keterangan |
|---|---|
| Tanggal audit | 8 November 2026 |
| Proyek | `D:\foto foto ukk\BBCashvia` |
| Database | `bbcashvia` (MariaDB 10.4.32) |
| Framework | Laravel 12.69.2, PHP 8.2.12 |
| Lingkup | Skema database, model, controller, request validation, query agregasi, dan JS yang membaca data |
| Metode | Inspeksi langsung `information_schema`, data live, kode aplikasi, lalu migrasi bertarget dan pengujian Feature |
| Backup sebelum perubahan | `C:\Users\user\AppData\Local\Temp\opencode\bbcashvia_backup_2026-11-08.sql` (48.302 byte) |
| Salinan uji | `bbcashvia_audit_s308` (11 tabel, 9 siswa, 43 transaksi) |

> Catatan batasan: tidak ada `migrate:fresh`, `db`, `TRUNCATE`, penghapusan tabel, atau penghapusan data. Perubahan skema dilakukan lewat tiga migrasi bertarget (`php artisan migrate --path=... --force`) setelah backup dan setelah diuji pada salinan database. Satu kolom legacy (`siswa.nama_kelas`) dihapus karena redundan; tidak ada tabel yang dihapus.

---

## A. Ringkasan Audit

### A.1 Kondisi awal

Database live memiliki **11 tabel**:

- **6 tabel bisnis**: `users`, `kelas`, `siswa`, `iuran`, `transaksi`, `detail_transaksi`.
- **5 tabel infrastruktur Laravel**: `cache`, `cache_locks`, `failed_jobs`, `jobs`, `migrations`.

Jumlah kolom tabel bisnis sebelum audit: **54 kolom**.

| Tabel | Baris awal | Kolom awal | Keterangan |
|---|---:|---:|---|
| `users` | 3 | 10 | admin, bendahara, viewer |
| `kelas` | 3 | 4 | XI RPL 1, XI DKV 1, XI BR 1 |
| `siswa` | 9 | 8 | termasuk kolom legacy `nama_kelas` |
| `iuran` | 10 | 8 | 9 iuran kelas + 1 iuran `kas` |
| `transaksi` | 43 | 19 | pemasukan/pengeluaran |
| `detail_transaksi` | 17 | 5 | 17 baris, 17 `id_transaksi` unik |

Temuan utama pada kondisi awal:

1. `siswa.nama_siswa` live `VARCHAR(50)`, sedangkan validasi dan migrasi struktur memakai **100**. Pada mode MySQL non-strict, nama 51–100 karakter **terpotong diam-diam**.
2. `siswa.nama_kelas` adalah `ENUM('XI BR','XI DKV','XI RPL') NOT NULL` yang **tidak dibuat oleh migrasi mana pun**, tidak ada di `$fillable`, dan tidak ditulis aplikasi. Karena `NOT NULL` tanpa default, insert tanpa kolom ini mendapat nilai pertama enum (`XI BR`) sehingga kelas bisa salah tanpa error.
3. `siswa.id_kelas` live `BIGINT(7) UNSIGNED`, sedangkan `kelas.id_kelas` `BIGINT(20) UNSIGNED`.
4. `users.role` memakai `VARCHAR(255)`, padahal nilai sah hanya `admin`, `bendahara`, `viewer` (maksimal 9 karakter).
5. `transaksi.metode` masih memuat nilai enum kosong `''` yang tidak pernah dikirim UI/validasi.
6. **34 baris** `transaksi.created_at` bernilai `NULL`, sehingga kolom jam di dashboard/riwayat tampil `-`.
7. `IuranController@index` menandai peserta **lunas** hanya jika ada transaksi apa pun, sehingga pembayaran cicilan dianggap lunas.
8. `IuranController@index` tidak membentuk peserta untuk iuran global (`id_kelas NULL`), padahal UI menyediakan pilihan “Semua Kelas (khusus Admin)”.
9. `DashboardController` memakai target tetap `$siswaCount * 250000` dan menghitung `siswa_belum_lunas` hanya dari ada/tidaknya transaksi, bukan dari sisa tagihan.
10. `viewer-iuran.js` menentukan “Lunas/Belum Lunas” dari `iuran.status` (`aktif`/`selesai`), bukan dari total pembayaran.
11. `TransaksiController@update` tidak menyinkronkan `detail_transaksi` saat `id_iuran`/`nominal` diubah.
12. `TransaksiController@update` memakai aturan unik `no_bukti` yang menolak edit baris dalam grup nota yang sama.
13. Mode banyak tidak menolak `no_bukti` yang sudah ada, berisiko menyatukan baris baru dengan grup lama.
14. `KelasController@destroy` hanya memblokir jika masih ada siswa; iuran/transaksi/pengguna bisa kehilangan kelas lewat `ON DELETE SET NULL`.
15. `UserController@destroy` tidak memeriksa transaksi; FK `transaksi.id_user` bersifat `RESTRICT`, sehingga penghapusan menghasilkan error 500.
16. `admin-dashboard.js` memeriksa `t.arah === "masuk"`, padahal backend mengirim `arah` bernilai `pemasukan`/`pengeluaran`; semua transaksi terbaru tampil sebagai pengeluaran.
17. Data legacy: baris lama menghubungkan siswa kelas 4/5 ke iuran kelas 6 (`id_iuran` 24/25/26), beberapa baris lama belum punya `detail_transaksi`, dan sebagian baris `pengeluaran` masih memiliki `id_iuran`.
18. `transaksi.kategori` mencampur kapitalisasi `'Iuran'` dengan kategori lowercase lain.
19. Tidak ada tabel `saldo_awal_kas`; fitur saldo awal tidak memiliki UI, controller, model, atau tes. Perhitungan saldo memakai `pemasukan − pengeluaran`, sehingga **saldo awal efektif 0**.

### A.2 Kondisi akhir

- **3 migrasi baru** diterapkan pada salinan dan database nyata.
- Kolom bisnis menjadi **53** (berkurang 1 karena `siswa.nama_kelas` dihapus).
- Tidak ada baris data yang dihapus. Jumlah baris tetap: `users` 3, `kelas` 3, `siswa` 9, `iuran` 10, `transaksi` 43, `detail_transaksi` 17.
- `transaksi.created_at` NULL: **34 → 0**.
- **177 tes Feature lulus** (889 assertion) pada database nyata setelah migrasi.
- Aplikasi tetap boot dan seluruh route utama terdaftar.

### A.3 Kesesuaian vs penyesuaian

| Aspek | Sebelum | Sesudah | Status |
|---|---|---|---|
| `siswa.nama_siswa` | `VARCHAR(50)` | `VARCHAR(100)` | **Diubah** |
| `siswa.nama_kelas` | `ENUM NOT NULL`, duplikat | dihapus | **Dihapus** |
| `siswa.id_kelas` | `BIGINT(7) UNSIGNED` | `BIGINT(20) UNSIGNED` + FK | **Diubah** |
| `users.role` | `VARCHAR(255)` | `VARCHAR(20)` default `viewer` | **Diubah** |
| `transaksi.metode` | `ENUM('TF','CH','')` | `ENUM('TF','CH')` | **Diubah** |
| `transaksi.created_at` | 34 NULL | 0 NULL (diisi dari `tanggal`) | **Diubah** |
| `transaksi.no_bukti` | non-unique | non-unique (dipertahankan) | **Dipertahankan** |
| `detail_transaksi` | 1:N secara skema | 1:N, aplikasi 1:1 | **Dipertahankan** |
| `transaksi.kategori` | `'Iuran'` + lowercase | tetap, dinormalisasi aplikasi | **Dipertahankan** |
| `saldo_awal` | tidak ada | tidak ada, saldo awal 0 | **Dipertahankan** |
| Target dashboard | `jumlah siswa × 250.000` | nominal iuran aktif × siswa aktif | **Diubah** |
| Status cicilan iuran | ada transaksi = lunas | total bayar ≥ nominal | **Diubah** |
| Status viewer | dari `iuran.status` | dari `terkumpul` vs `target` | **Diubah** |
| Detail saat edit transaksi | tidak disinkronkan | disinkronkan | **Diubah** |
| `no_bukti` mode banyak | bisa bertabrakan | ditolak 422 | **Diubah** |
| Hapus kelas/pengguna | rawan yatim/500 | dicegah 409 | **Diubah** |

---

## B. Tabel Analisis Database

Keterangan status:

- **Sesuai** = tipe/panjang/relasi sudah tepat, tidak diubah.
- **Diubah** = disesuaikan pada audit ini.
- **Dihapus** = kolom legacy redundan.
- **Dipertahankan** = sengaja tidak diubah, dengan justifikasi.

### B.1 `users` (10 kolom)

| Kolom | Tipe | Null | Default | Key/Index | Fungsi & justifikasi | Status |
|---|---|---|---|---|---|---|
| `id_users` | `BIGINT(20) UNSIGNED` | NO | — | PK, auto_increment | Identitas pengguna; `BIGINT` memberi ruang pertumbuhan. | Sesuai |
| `name` | `VARCHAR(255)` | NO | — | — | Nama tampilan; 255 adalah default aman Laravel. | Sesuai |
| `email` | `VARCHAR(255)` | NO | — | UNIQUE | Login; unik mencegah akun ganda. | Sesuai |
| `email_verified_at` | `TIMESTAMP` | YES | NULL | — | Kebutuhan autentikasi Laravel; tidak dipakai UI saat ini. | Dipertahankan |
| `password` | `VARCHAR(255)` | NO | — | — | Hash bcrypt/argon; 255 cukup. | Sesuai |
| `role` | `VARCHAR(20)` | NO | `'viewer'` | — | Nilai sah: `admin`, `bendahara`, `viewer` (maks. 9 huruf). 20 memberi ruang peran baru. | **Diubah** |
| `jenis_viewer` | `ENUM('siswa','wali_kelas')` | YES | NULL | — | Sub-peran viewer; nilai tetap dan sudah dipakai UI. | Sesuai |
| `id_kelas` | `BIGINT(20) UNSIGNED` | YES | NULL | MUL, FK → `kelas.id_kelas` | Pembatasan kelas untuk bendahara/viewer; `NULL` = admin. | Sesuai |
| `must_change_password` | `TINYINT(1)` | NO | `0` | — | Flag keamanan; boolean. | Sesuai |
| `last_login_at` | `TIMESTAMP` | YES | NULL | — | Jejak login; `TIMESTAMP` sesuai waktu kejadian. | Dipertahankan |

Catatan: `users` tidak memiliki `created_at`/`updated_at`. Model `User` memakai `$timestamps = false`; tidak ada fitur yang membaca/menulis kolom tersebut. Tidak ditambahkan agar tidak mengubah perilaku dan tidak memerlukan backfill.

### B.2 `kelas` (4 kolom)

| Kolom | Tipe | Null | Default | Key/Index | Fungsi & justifikasi | Status |
|---|---|---|---|---|---|---|
| `id_kelas` | `BIGINT(20) UNSIGNED` | NO | — | PK, auto_increment | Identitas kelas; tipe acuan untuk FK. | Sesuai |
| `nama_kelas` | `VARCHAR(50)` | NO | — | — | Nama kelas (mis. `XI RPL 1`); 50 cukup. Tidak diberi UNIQUE karena validasi aplikasi sudah mencegah duplikat; data live unik. | Dipertahankan |
| `tingkat` | `VARCHAR(20)` | YES | NULL | — | `XI`; panjang proporsional. | Sesuai |
| `tahun_ajaran` | `VARCHAR(20)` | YES | NULL | — | `2026/2027`; panjang proporsional. | Sesuai |

Catatan: `kelas` tidak memiliki timestamp; model `Kelas` memakai `$timestamps = false`.

### B.3 `siswa` (7 kolom setelah audit; awalnya 8)

| Kolom | Tipe | Null | Default | Key/Index | Fungsi & justifikasi | Status |
|---|---|---|---|---|---|---|
| `id_siswa` | `BIGINT(10) UNSIGNED` | NO | — | PK, auto_increment | Identitas siswa. Angka `10` hanya lebar tampilan; rentang penyimpanan `BIGINT` tetap 8 byte. Tidak diubah agar tidak membangun ulang PK/FK tanpa manfaat fungsional. | Dipertahankan |
| `nis` | `VARCHAR(20)` | NO | — | UNIQUE | Nomor induk siswa; unik mencegah duplikat. | Sesuai |
| `nama_siswa` | `VARCHAR(100)` | NO | — | — | Nama lengkap; disamakan dengan validasi `max:100` dan migrasi struktur. Sebelumnya 50 sehingga nama 51–100 terpotong. | **Diubah** |
| `id_kelas` | `BIGINT(20) UNSIGNED` | YES | NULL | MUL, FK → `kelas.id_kelas` | Relasi kelas; disamakan dengan tipe `kelas.id_kelas`, FK dipasang ulang. | **Diubah** |
| `status` | `ENUM('Aktif','Tidak Aktif')` | NO | `'Aktif'` | — | Status keaktifan; nilai tetap dan dipakai filter dashboard. | Sesuai |
| `Jenis_Kelamin` | `ENUM('Perempuan','Laki-Laki')` | YES | NULL | — | Nilai legacy berkapital; frontend dan DB sudah konsisten. | Sesuai |
| `no_hp` | `VARCHAR(20)` | YES | NULL | — | Nomor HP; 20 cukup untuk format Indonesia. | Sesuai |
| `nama_kelas` | `ENUM('XI BR','XI DKV','XI RPL')` | NO | — | — | **Dihapus.** Duplikasi `kelas.nama_kelas`; tidak ada di migrasi/fillable; `NOT NULL` tanpa default menyebabkan nilai salah `XI BR`. | **Dihapus** |

Catatan: `siswa` tidak memiliki timestamp; model `Siswa` memakai `$timestamps = false`.

### B.4 `iuran` (8 kolom)

| Kolom | Tipe | Null | Default | Key/Index | Fungsi & justifikasi | Status |
|---|---|---|---|---|---|---|
| `id_iuran` | `BIGINT(20) UNSIGNED` | NO | — | PK, auto_increment | Identitas iuran. | Sesuai |
| `id_kelas` | `BIGINT(20) UNSIGNED` | YES | NULL | MUL, FK → `kelas.id_kelas` | `NULL` = iuran global (“Semua Kelas”); hanya admin yang melihat/menghitungnya. | Sesuai |
| `nama_iuran` | `VARCHAR(100)` | NO | — | — | Nama iuran; validasi `max:100`. | Sesuai |
| `keterangan` | `TEXT` | YES | NULL | — | Deskripsi bebas; `TEXT` sesuai. | Sesuai |
| `jatuh_tempo` | `DATE` | YES | NULL | — | Tanggal jatuh tempo tanpa jam; `DATE` tepat. | Sesuai |
| `kategori` | `ENUM('sekali bayar','mingguan','bulanan','tahunan')` | NO | — | — | Kategori tetap; validasi dan UI memakai nilai yang sama. | Sesuai |
| `nominal` | `DECIMAL(10,2)` | NO | — | — | Uang; `DECIMAL` mencegah galat pembulatan. Maks. 99.999.999,99 sesuai validasi. | Sesuai |
| `status` | `ENUM('aktif','selesai')` | NO | — | — | Status master: `aktif` boleh dibayar, `selesai` tidak. Status “Lunas” peserta dihitung dari pembayaran, bukan kolom ini. | Sesuai |

Catatan: `iuran` tidak memiliki timestamp; model `Iuran` memakai `$timestamps = false`.

### B.5 `transaksi` (19 kolom)

| Kolom | Tipe | Null | Default | Key/Index | Fungsi & justifikasi | Status |
|---|---|---|---|---|---|---|
| `id_transaksi` | `BIGINT(20) UNSIGNED` | NO | — | PK, auto_increment | Identitas transaksi. | Sesuai |
| `no_bukti` | `VARCHAR(30)` | NO | — | MUL (`idx_transaksi_no_bukti`, non-unique) | Nomor nota. **Sengaja non-unique** karena mode banyak menyimpan beberapa baris dengan satu nomor sebagai satu grup pembayaran. Keunikan dijaga aplikasi per grup. | Dipertahankan |
| `id_user` | `BIGINT(20) UNSIGNED` | NO | — | MUL, FK → `users.id_users` (`RESTRICT`) | Pencatat transaksi; jejak audit. | Sesuai |
| `id_siswa` | `BIGINT(20) UNSIGNED` | YES | NULL | MUL, FK → `siswa.id_siswa` (`RESTRICT`) | Siswa yang membayar; `NULL` untuk kas umum. | Sesuai |
| `id_kelas` | `BIGINT(20) UNSIGNED` | YES | NULL | MUL, FK → `kelas.id_kelas` (`SET NULL`) | Kelas transaksi untuk scoping laporan. | Sesuai |
| `id_iuran` | `BIGINT(20) UNSIGNED` | YES | NULL | MUL, FK → `iuran.id_iuran` (`RESTRICT`) | Iuran yang dibayar; `NULL` untuk non-iuran. | Sesuai |
| `tanggal` | `DATETIME` | NO | — | MUL (`idx_transaksi_tanggal`) | Waktu transaksi; `DATETIME` karena perlu jam. | Sesuai |
| `nominal` | `DECIMAL(10,2)` | NO | — | — | Nilai uang; `DECIMAL` tepat. | Sesuai |
| `keterangan` | `TEXT` | YES | NULL | — | Catatan bebas. | Sesuai |
| `nama_pembayar` | `VARCHAR(100)` | YES | NULL | — | Nama pembayar; validasi `max:100`. | Sesuai |
| `metode` | `ENUM('TF','CH')` | NO | — | — | Transfer/cash. Nilai kosong `''` dihapus karena tidak pernah dikirim UI dan controller mengisi `CH` bila kosong. | **Diubah** |
| `jenis` | `ENUM('pemasukan','pengeluaran')` | NO | — | MUL (`idx_transaksi_jenis`) | Arah kas; dipakai laporan dan dashboard. | Sesuai |
| `kategori` | `ENUM('Iuran','kas','kebutuhan kelas','perlengkapan kelas','kegiatan kelas','pemasukan lainnya','pengeluaran lainnya')` | YES | NULL | — | Kategori tetap. Kapitalisasi `'Iuran'` adalah legacy yang sudah dinormalisasi aplikasi; mengubah enum berisiko merusak data lama. | Dipertahankan |
| `pic` | `VARCHAR(100)` | YES | NULL | — | Penanggung jawab; panjang cukup. | Sesuai |
| `periode` | `VARCHAR(20)` | YES | NULL | — | Periode laporan (mis. `2026-11`); 20 cukup. | Sesuai |
| `uang_diterima` | `DECIMAL(10,2)` | NO | — | — | Uang fisik diterima; `DECIMAL`. | Sesuai |
| `kembalian` | `DECIMAL(10,2)` | NO | `0.00` | — | Kembalian; `DECIMAL` dengan default 0. | Sesuai |
| `created_at` | `DATETIME` | YES | NULL | — | Waktu pencatatan; 34 baris lama diisi dari `tanggal`. Tetap nullable untuk kompatibilitas baris lama/insert langsung. Tidak ada `updated_at` karena model memakai `UPDATED_AT = null`. | **Diubah** |
| `bukti_transaksi` | `VARCHAR(255)` | YES | NULL | — | Path file bukti; 255 cukup untuk path storage. | Sesuai |

### B.6 `detail_transaksi` (5 kolom)

| Kolom | Tipe | Null | Default | Key/Index | Fungsi & justifikasi | Status |
|---|---|---|---|---|---|---|
| `id_detail` | `BIGINT(20) UNSIGNED` | NO | — | PK, auto_increment | Identitas rincian. | Sesuai |
| `id_transaksi` | `BIGINT(20) UNSIGNED` | NO | — | MUL, FK → `transaksi.id_transaksi` (`CASCADE`) | Rincian milik transaksi; ikut terhapus bila transaksi dihapus. | Sesuai |
| `id_iuran` | `BIGINT(20) UNSIGNED` | NO | — | MUL, FK → `iuran.id_iuran` (`RESTRICT`) | Iuran yang dirinci; tidak boleh dihapus selama rincian ada. | Sesuai |
| `nama_iuran` | `VARCHAR(100)` | NO | — | — | Snapshot nama iuran saat transaksi; 100 sesuai `iuran.nama_iuran`. | Sesuai |
| `nominal` | `DECIMAL(12,2)` | NO | — | — | Nilai rincian; lebih lebar dari `transaksi.nominal(10,2)` karena warisan data lama. Tidak dikecilkan agar aman. | Dipertahankan |

Catatan: `detail_transaksi` tidak memiliki timestamp; model memakai `$timestamps = false`. Skema mengizinkan 1:N, tetapi alur aplikasi saat ini menulis satu rincian per transaksi. Tidak ditambahkan UNIQUE pada `id_transaksi` agar kapabilitas lama tidak hilang; duplikat dirapikan saat edit.

### B.7 Ringkasan indeks

| Tabel | Indeks | Unik | Kolom | Alasan |
|---|---|---:|---|---|
| `users` | `users_email_unique` | Ya | `email` | Login unik. |
| `users` | `users_id_kelas_foreign` | Tidak | `id_kelas` | Mempercepat scoping pengguna per kelas + FK. |
| `kelas` | `PRIMARY` | Ya | `id_kelas` | PK. |
| `siswa` | `siswa_nis_unique` | Ya | `nis` | Mencegah NIS ganda. |
| `siswa` | `siswa_id_kelas_foreign` | Tidak | `id_kelas` | Join/filter kelas + FK. |
| `iuran` | `iuran_id_kelas_foreign` | Tidak | `id_kelas` | Filter iuran per kelas + FK. |
| `transaksi` | `idx_transaksi_no_bukti` | Tidak | `no_bukti` | Mencari grup nota; sengaja non-unique. |
| `transaksi` | `idx_transaksi_jenis` | Tidak | `jenis` | Filter pemasukan/pengeluaran. |
| `transaksi` | `idx_transaksi_kelas_id` | Tidak | `id_kelas, id_transaksi` | Daftar transaksi per kelas terurut. |
| `transaksi` | `idx_transaksi_siswa_iuran` | Tidak | `id_siswa, id_iuran` | Agregasi pembayaran per siswa per iuran (cicilan). |
| `transaksi` | `idx_transaksi_tanggal` | Tidak | `tanggal` | Filter periode/laporan. |
| `transaksi` | `transaksi_id_user_foreign` | Tidak | `id_user` | Jejak pencatat + FK. |
| `transaksi` | `transaksi_id_iuran_foreign` | Tidak | `id_iuran` | Relasi iuran + FK. |
| `detail_transaksi` | `detail_transaksi_id_transaksi_foreign` | Tidak | `id_transaksi` | Rincian per transaksi + FK. |
| `detail_transaksi` | `detail_transaksi_id_iuran_foreign` | Tidak | `id_iuran` | Relasi iuran + FK. |

Tidak ada indeks baru pada audit ini karena indeks yang ada sudah menutup pola query utama (filter kelas, jenis, tanggal, grup nota, dan agregasi siswa–iuran). Indeks tambahan tanpa query nyata hanya menambah biaya tulis.

---

## C. Detail Perubahan

### C.1 Migrasi database

#### 1) `database/migrations/2026_11_08_000001_selaraskan_skema_siswa.php`

| Perubahan | Detail | Alasan teknis |
|---|---|---|
| `siswa.nama_siswa` | `VARCHAR(50)` → `VARCHAR(100)` | Validasi `SiswaController` dan migrasi struktur memakai `max:100`. MySQL non-strict memotong nama 51–100 karakter tanpa error. |
| `siswa.nama_kelas` | dihapus | Redundan dengan `kelas.nama_kelas`; tidak ada di migrasi/fillable; `ENUM NOT NULL` tanpa default mengisi `XI BR` secara salah. |
| `siswa.id_kelas` | `BIGINT(7)` → `BIGINT(20) UNSIGNED`; FK di-drop dan dipasang ulang | Menyamakan tipe dengan `kelas.id_kelas` dan mempertahankan relasi `ON DELETE SET NULL`. |

Migrasi bersifat idempoten: memeriksa `information_schema` sebelum mengubah. `down()` sengaja tidak mengembalikan `nama_kelas` karena data kelas sudah terwakili oleh relasi.

#### 2) `database/migrations/2026_11_08_000002_selaraskan_role_dan_metode.php`

| Perubahan | Detail | Alasan teknis |
|---|---|---|
| `users.role` | `VARCHAR(255)` → `VARCHAR(20) NOT NULL DEFAULT 'viewer'` | Nilai sah maksimal 9 karakter; 20 proporsional dan tetap memberi ruang peran baru. |
| `transaksi.metode` | `ENUM('TF','CH','')` → `ENUM('TF','CH') NOT NULL` | Nilai `''` tidak pernah dikirim UI/validasi; controller mengisi `CH` bila kosong. Migrasi hanya berjalan bila tidak ada baris `''`. |

#### 3) `database/migrations/2026_11_08_000003_lengkapi_created_at_transaksi.php`

| Perubahan | Detail | Alasan teknis |
|---|---|---|
| `transaksi.created_at` | `UPDATE ... SET created_at = tanggal WHERE created_at IS NULL` | 34 baris lama kehilangan jam. `tanggal` adalah waktu bisnis yang paling akurat; tidak menimpa baris yang sudah terisi. |

### C.2 Backend

#### `app/Http/Controllers/Admin/IuranController.php`

- **`index()`**
  - Menghitung pembayaran per siswa dengan `SUM(nominal)` dari `transaksi` yang `jenis = pemasukan`, `id_iuran` cocok, dan `id_siswa` termasuk peserta sah.
  - `peserta[].lunas` sekarang `nominal <= 0` atau `terbayar + 0.009 >= nominal`; cicilan tidak otomatis lunas.
  - Menambahkan `terbayar` dan `sisa` per peserta.
  - `terkumpul` dihitung dari peserta **aktif** agar sebanding dengan `target` (`nominal × siswa aktif`). Pembayaran siswa nonaktif tetap tampil di rincian peserta dan tetap masuk Laporan Kas.
  - Iuran global (`id_kelas NULL`) membentuk peserta dari **seluruh siswa** dan hanya muncul untuk admin; non-admin tetap dibatasi kelas oleh query.
- **`update()`**
  - Menolak `409` bila `id_kelas` iuran diubah (termasuk dijadikan global) sementara iuran sudah dipakai transaksi. Ini mencegah transaksi lama menunjuk iuran yang kelasnya berbeda.

#### `app/Http/Controllers/Api/DashboardController.php`

- **`index()`**
  - Menghapus target tetap `250.000`.
  - `iuran_target` = Σ(`nominal` iuran aktif × jumlah siswa aktif yang berhak).
  - Iuran global (`id_kelas NULL`) dihitung untuk admin; non-admin hanya iuran kelasnya.
  - `siswa_belum_lunas` dihitung per siswa: setiap iuran aktif harus `terbayar + 0.009 >= nominal`. Siswa tanpa tagihan aktif tidak dihitung belum lunas (sisa = 0).
  - `total_iuran`, `total_kas`, `total_pemasukan`, `total_pengeluaran` tetap dari agregasi `transaksi` yang sudah ada.

#### `app/Http/Controllers/Admin/SiswaController.php`

- **`index()`**
  - Memuat iuran global sekali untuk admin (`aksesSemuaKelas()`), lalu menggabungkannya ke iuran tiap siswa.
  - Non-admin tetap hanya melihat iuran kelasnya.
- **`ringkasanIuran()`**
  - Parameter baru `bool $includeGlobal = false`.
  - Tanpa tagihan aktif → status `lunas` (sisa 0), konsisten dengan dashboard.
  - Perhitungan `tagihan`, `terbayar` (dibatasi nominal per item), `sisa`, dan `rincian` tetap.
- **`formatSiswa()`**
  - Menerima `includeGlobal` agar respons tambah/ubah siswa memakai cakupan yang sama dengan daftar.

#### `app/Http/Controllers/Api/TransaksiController.php`

- **`update()`**
  - Aturan `Rule::unique('transaksi','no_bukti')` diganti pemeriksaan manual:
    - nomor sama dengan grup sendiri → boleh;
    - nomor milik grup lain → `422`.
  - Setelah `update`, memanggil `sinkronDetail()` agar `detail_transaksi` ikut berubah saat `id_iuran`/`nominal` berubah.
- **`sinkronDetail()`** (baru; `simpanDetail()` mendelegasikan)
  - Tanpa `id_iuran` → hapus rincian lama.
  - Ada `id_iuran` → perbarui rincian pertama; hapus rincian ganda legacy; buat rincian bila belum ada.
  - Satu transaksi = satu rincian pada alur saat ini, tanpa menghapus kapabilitas skema 1:N.

#### `app/Http/Requests/StoreTransaksiRequest.php`

- Menambahkan `periksaNoBuktiBanyak()` pada mode banyak.
- `no_bukti` yang sudah ada di database ditolak dengan error `transaksi.{index}.no_bukti`, sehingga baris baru tidak menyatu dengan grup lama.

#### `app/Http/Controllers/Admin/KelasController.php`

- `destroy()` menolak `409` bila kelas masih dipakai `iuran`, `transaksi`, atau `users`, selain siswa.
- Ini mencegah `ON DELETE SET NULL` membuat riwayat kehilangan kelas secara diam-diam.

#### `app/Http/Controllers/Admin/UserController.php`

- `destroy()` menolak `409` bila pengguna memiliki transaksi (`transaksi.id_user` bersifat `RESTRICT`).
- Mencegah error 500 saat admin menghapus pencatat transaksi.

#### `database/seeders/SiswaSeeder.php`

- Menghapus `nama_kelas` dari data seed.
- Mengambil `id_kelas` dari `kelas.nama_kelas` (`XI RPL 1`, `XI DKV 1`, `XI BR 1`), sesuai relasi baru.

### C.3 Frontend

#### `resources/js/admin-dashboard.js`

- `t.arah === "masuk"` → `t.arah === "pemasukan"` (dua tempat).
- Backend `DashboardController@recent` mengirim `arah = strtolower(jenis)` = `pemasukan`/`pengeluaran`; sebelumnya semua baris dirender sebagai pengeluaran.

#### `resources/js/viewer-iuran.js`

- Status “Lunas/Belum Lunas” tidak lagi dari `iuran.status` (`aktif`/`selesai`).
- Sekarang memakai `target` dan `terkumpul` dari API:
  - `target > 0 && terkumpul + 0.009 >= target` → `Lunas`;
  - selain itu → `Belum Lunas`.
- Ini membuat status kelas konsisten dengan total pembayaran, bukan status master iuran.

### C.4 Pengujian baru

`tests/Feature/AuditS308PerbaikanTest.php` — 11 tes:

1. Cicilan tidak otomatis lunas sampai terkumpul penuh.
2. Dashboard memakai target iuran nyata dan hitungan cicilan.
3. Iuran global dihitung untuk admin.
4. Ubah transaksi menyelaraskan detail iuran.
5. Mode banyak menolak `no_bukti` yang sudah ada.
6. Kelas dengan iuran tidak dapat dihapus.
7. Pengguna dengan transaksi tidak dapat dihapus.
8. Iuran yang sudah dipakai tidak boleh pindah kelas.
9. JS dashboard admin memakai `arah` pemasukan.
10. JS viewer iuran memakai `target`/`terkumpul`.
11. Nama siswa sampai 100 karakter tersimpan utuh.

---

## D. Struktur yang Dipertahankan

| Struktur | Keputusan | Justifikasi |
|---|---|---|
| `saldo_awal` / `saldo_awal_kas` | Tidak ditambahkan | Tidak ada UI, controller, model, atau tes. `MenghitungSaldoKas` menghitung `saldo_sekarang = total_masuk − total_keluar`; saldo awal efektif 0. Menambahkannya akan menjadi fitur baru di luar scope. |
| `transaksi.no_bukti` non-unique | Dipertahankan | Mode banyak menyimpan beberapa baris dengan satu `no_bukti` sebagai satu grup pembayaran (`TransaksiBanyakTest`, `RiwayatKasGrupTest`). UNIQUE akan memecah grup. Keunikan dijaga aplikasi per grup. |
| `detail_transaksi` 1:N | Dipertahankan | Skema lama mengizinkan banyak rincian per transaksi. Alur saat ini 1:1, tetapi UNIQUE pada `id_transaksi` akan menghapus kapabilitas lama dan berisiko pada data/feature mendatang. Duplikat dirapikan saat edit. |
| `transaksi.kategori` dengan `'Iuran'` kapital | Dipertahankan | Nilai enum sudah dipakai data lama (32 baris `'Iuran'`). Aplikasi menormalisasi input; mengubah enum memerlukan migrasi data berisiko. |
| `detail_transaksi.nominal DECIMAL(12,2)` | Dipertahankan | Lebih lebar dari `transaksi.nominal(10,2)` karena warisan data. Tidak ada kerugian; mengecilkan berisiko truncation. |
| Tanpa timestamp di `users`, `kelas`, `siswa`, `iuran`, `detail_transaksi` | Dipertahankan | Model memakai `$timestamps = false`; tidak ada fitur yang membaca/menulis `created_at`/`updated_at`. Menambahkan kolom hanya menambah beban tanpa manfaat. |
| `transaksi.created_at` nullable, tanpa `updated_at` | Dipertahankan | Baris lama/insert langsung tetap aman. `UPDATED_AT = null` pada model; tidak ada fitur edit yang membutuhkan jejak update. |
| `siswa.id_siswa BIGINT(10)` | Dipertahankan | Angka 10 hanya lebar tampilan; `BIGINT` tetap 8 byte. Mengubah PK akan membangun ulang FK tanpa manfaat fungsional. |
| `users.role VARCHAR(20)` | Dipertahankan | Lebih fleksibel dari ENUM bila peran baru ditambahkan; panjang 20 proporsional. |
| `users.jenis_viewer ENUM` | Dipertahankan | Nilai tetap `siswa`/`wali_kelas`, sudah dipakai UI dan validasi. |
| `siswa.Jenis_Kelamin` kapital | Dipertahankan | Nilai `Perempuan`/`Laki-Laki` sudah konsisten antara DB, model, dan UI. |
| `kelas.nama_kelas` tanpa UNIQUE | Dipertahankan | Validasi aplikasi mencegah duplikat; data live unik. UNIQUE dapat ditambahkan sebagai hardening setelah konfirmasi bisnis. |
| Data legacy lintas kelas, baris tanpa detail, `pengeluaran` ber-`id_iuran` | Dipertahankan | Merupakan riwayat nyata. Aplikasi membaca data dengan scoping peserta/kelas; membersihkan data lama memerlukan keputusan bisnis dan tidak boleh dilakukan sembarangan. |
| Record migrasi hantu `create_saldo_awal_kas_table` | Dipertahankan | File migrasi hilang dan tabel tidak ada. Menghapus record adalah perubahan langsung pada `migrations`; lebih aman dibiarkan dan dicatat. |

---

## E. Relasi Database

### E.1 Daftar foreign key

| Tabel anak | Kolom | Tabel induk | Kolom induk | ON DELETE | ON UPDATE | Alasan |
|---|---|---|---|---|---|---|
| `users` | `id_kelas` | `kelas` | `id_kelas` | `SET NULL` | `RESTRICT` | Menghapus kelas tidak boleh menghapus pengguna; scope pengguna menjadi kosong. `KelasController@destroy` sekarang memblokir jika masih ada pengguna. |
| `siswa` | `id_kelas` | `kelas` | `id_kelas` | `SET NULL` | `CASCADE` | Siswa tetap ada bila kelas dihapus, tetapi menjadi tanpa kelas. Controller memblokir jika masih ada siswa. |
| `iuran` | `id_kelas` | `kelas` | `id_kelas` | `SET NULL` | `RESTRICT` | Iuran global memakai `NULL`; riwayat iuran tidak ikut terhapus. Controller memblokir jika iuran masih dipakai. |
| `transaksi` | `id_user` | `users` | `id_users` | `RESTRICT` | `CASCADE` | Jejak pencatat harus dipertahankan. `UserController@destroy` sekarang mengembalikan `409`. |
| `transaksi` | `id_siswa` | `siswa` | `id_siswa` | `RESTRICT` | `CASCADE` | Riwayat pembayaran siswa tidak boleh hilang. `SiswaController@destroy` mengembalikan `422` bila ada transaksi. |
| `transaksi` | `id_kelas` | `kelas` | `id_kelas` | `SET NULL` | `RESTRICT` | Kelas pada transaksi adalah snapshot scoping; bila kelas dihapus, transaksi tetap ada. Controller memblokir lebih awal. |
| `transaksi` | `id_iuran` | `iuran` | `id_iuran` | `RESTRICT` | `CASCADE` | Transaksi yang menunjuk iuran tidak boleh kehilangan relasi. `IuranController@destroy` memblokir bila dipakai. |
| `detail_transaksi` | `id_transaksi` | `transaksi` | `id_transaksi` | `CASCADE` | `CASCADE` | Rincian adalah bagian dari transaksi; ikut terhapus bersama induk. |
| `detail_transaksi` | `id_iuran` | `iuran` | `id_iuran` | `RESTRICT` | `CASCADE` | Rincian tidak boleh kehilangan iuran; penghapusan iuran diblokir. |

### E.2 Alur relasi utama

```text
kelas 1 ─── N users        (users.id_kelas, SET NULL)
kelas 1 ─── N siswa        (siswa.id_kelas, SET NULL)
kelas 1 ─── N iuran        (iuran.id_kelas, SET NULL; NULL = global)
kelas 1 ─── N transaksi    (transaksi.id_kelas, SET NULL)

users 1 ─── N transaksi    (transaksi.id_user, RESTRICT)
siswa 1 ─── N transaksi    (transaksi.id_siswa, RESTRICT)
iuran 1 ─── N transaksi    (transaksi.id_iuran, RESTRICT)
iuran 1 ─── N detail_transaksi (detail_transaksi.id_iuran, RESTRICT)
transaksi 1 ─ N detail_transaksi (detail_transaksi.id_transaksi, CASCADE)
```

### E.3 Justifikasi aturan hapus

- **`RESTRICT`** dipakai pada relasi yang membawa nilai audit/keuangan: pencatat (`id_user`), siswa (`id_siswa`), iuran (`id_iuran`), dan rincian iuran. Data keuangan tidak boleh hilang atau menjadi yatim.
- **`SET NULL`** dipakai pada relasi kelas karena kelas adalah atribut scoping, bukan pemilik data. Namun aplikasi sekarang memblokir penghapusan kelas yang masih dipakai agar `SET NULL` tidak menjadi jalur kehilangan konteks.
- **`CASCADE`** hanya dipakai pada `detail_transaksi.id_transaksi` karena rincian tidak bermakna tanpa transaksi induk.

---

## F. Hasil Pengujian

### F.1 Ringkasan status

| No | Pengujian | Status | Bukti |
|---:|---|---|---|
| 1 | Backup database sebelum perubahan | **Berhasil** | `bbcashvia_backup_2026-11-08.sql`, 48.302 byte |
| 2 | Migrasi pada salinan `bbcashvia_audit_s308` | **Berhasil** | 3 migrasi `DONE`; salinan 11 tabel, 9 siswa, 43 transaksi |
| 3 | Suite Feature lama pada salinan | **Berhasil** | 166 tes lulus |
| 4 | 11 tes regresi baru pada salinan | **Berhasil** | 11 tes lulus |
| 5 | Migrasi pada database nyata `bbcashvia` | **Berhasil** | 3 migrasi `DONE` (batch 27) |
| 6 | Verifikasi skema akhir | **Berhasil** | `nama_siswa` 100; `nama_kelas` hilang; `id_kelas` `BIGINT(20)`; `role` 20; `metode` `TF/CH`; `created_at` NULL = 0 |
| 7 | Data lama tetap utuh | **Berhasil** | 3/3/9/10/43/17 baris; tidak ada penghapusan data |
| 8 | Suite Feature penuh pada database nyata | **Berhasil** | **177 passed (889 assertions)**, 33,21 detik (setelah build) |
| 9 | Aplikasi boot & route utama | **Berhasil** | `php artisan route:list`, `php artisan about` (Laravel 12.69.2, PHP 8.2.12) |
| 10 | Sintaks PHP file yang diubah | **Berhasil** | `php -l` semua file: no syntax errors |
| 11 | Build aset Vite | **Berhasil** | Import rusak `./desktop-large.css` dihapus dari `resources/css/konfirmasi-logout.css`; `npm run build` sukses, 103 modul, `public/build/manifest.json` diperbarui. |
| 12 | Uji browser end-to-end | **Belum diuji** | Tidak ada otomasi browser; aset produksi sudah dibangun dan perbaikan JS terverifikasi di bundle (`arah==="pemasukan"`, `target`/`terkumpul`), bukan lewat klik browser. |
| 13 | Pembersihan data legacy | **Belum dilakukan (sengaja)** | Data lama dipertahankan; lihat bagian D. |
| 14 | Saldo awal | **Tidak berlaku** | Tidak ada tabel/fitur; saldo awal 0; `LaporanKasRingkasanTest` lulus dengan `pemasukan − pengeluaran`. |
| 15 | Akses peran (admin/bendahara/viewer) | **Berhasil** | `RoleAccessTest`, `DataAccessTest`, `BendaharaApiTest`, `SiswaIdorTest` lulus |
| 16 | CRUD siswa/iuran/transaksi/pengguna | **Berhasil** | `SiswaApiTest`, `IuranKategoriCrudTest`, `TransaksiCrudTest`, `ManajemenPenggunaApiTest` lulus |
| 17 | Pembayaran cicilan/parsial | **Berhasil** | `AuditS308PerbaikanTest::test_cicilan...`, `IuranApiTest::test_cicilan...` lulus |
| 18 | Konsistensi status iuran | **Berhasil** | Tes cicilan + dashboard + viewer source lulus |
| 19 | Saldo & laporan kas | **Berhasil** | `LaporanKasRingkasanTest`, `LaporanKasApiTest`, delta dashboard lulus |
| 20 | Grup `no_bukti` mode banyak | **Berhasil** | `RiwayatKasGrupTest`, `TransaksiBanyakTest`, `AuditS308...` lulus |
| 21 | Guard hapus kelas/pengguna | **Berhasil** | `AuditS308...` lulus (409) |
| 22 | Nama siswa 100 karakter | **Berhasil** | `AuditS308...::test_nama_siswa...` lulus pada skema baru |
| 23 | Arah transaksi dashboard admin | **Berhasil (source + build)** | Tes statis lulus; bundle `admin-dashboard-yydlGxyo.js` memuat `a.arah==="pemasukan"` |
| 24 | Status viewer dari pembayaran | **Berhasil (source + build)** | Tes statis lulus; bundle `viewer-iuran-Ddkuy34O.js` memuat `target`/`terkumpul` |

### F.2 Perintah pengujian utama

```powershell
Set-Location 'D:/foto foto ukk/BBCashvia'
$env:DB_CONNECTION='mysql'
$env:DB_DATABASE='bbcashvia'
$env:APP_ENV='testing'
php artisan test --testsuite=Feature --no-coverage
```

Hasil akhir:

```text
Tests:    177 passed (889 assertions)
Duration: 33.21s
```

Bukti tersimpan:

- `C:\Users\user\AppData\Local\Temp\opencode\final-feature-3.txt` — hasil final 177 tes setelah build Vite.
- `C:\Users\user\AppData\Local\Temp\opencode\final-feature-2.txt` — hasil 177 tes sebelum perbaikan build.
- `C:\Users\user\AppData\Local\Temp\opencode\final-feature.txt` — hasil 177 tes sebelum perubahan terakhir `terkumpul`.
- `C:\Users\user\AppData\Local\Temp\opencode\after-migrasi-audit-feature.txt` — 166 tes pada salinan berskema baru.
- `C:\Users\user\AppData\Local\Temp\opencode\audit-s308-tests.txt` — 11 tes regresi pada salinan.
- `C:\Users\user\AppData\Local\Temp\opencode\skema-final.txt` — dump kolom/indeks/relasi final.
- `C:\Users\user\AppData\Local\Temp\opencode\npm-build-after-fix.txt` — log build Vite sukses.
- `C:\Users\user\AppData\Local\Temp\opencode\npm-build.txt` — log kegagalan Vite sebelum perbaikan.

### F.3 Verifikasi skema final

| Objek | Nilai akhir |
|---|---|
| `siswa.nama_siswa` | `VARCHAR(100) NOT NULL` |
| `siswa.nama_kelas` | tidak ada |
| `siswa.id_kelas` | `BIGINT(20) UNSIGNED NULL`, FK `siswa_id_kelas_foreign` |
| `users.role` | `VARCHAR(20) NOT NULL DEFAULT 'viewer'` |
| `transaksi.metode` | `ENUM('TF','CH') NOT NULL` |
| `transaksi.created_at` NULL | 0 |
| Jumlah tabel | 11 |
| Jumlah kolom bisnis | 53 |
| Baris data | users 3, kelas 3, siswa 9, iuran 10, transaksi 43, detail 17 |

### F.4 Perbaikan build Vite

`npm run build` sempat gagal karena `resources/css/konfirmasi-logout.css` mengimpor `./desktop-large.css` yang tidak ada:

```text
[vite:css] [postcss] ENOENT: no such file or directory,
open 'D:\foto foto ukk\BBCashvia\desktop-large.css'
```

Penyebabnya adalah file CSS untracked milik pekerjaan pengguna, bukan perubahan audit. Perbaikan yang dipilih: menghapus satu baris `@import url("./desktop-large.css");` dari `resources/css/konfirmasi-logout.css` tanpa mengubah aturan CSS lain. Setelah itu:

```text
vite v7.3.6 building client environment for production...
✓ 103 modules transformed.
public/build/manifest.json 11.02 kB
```

Hasil: build **berhasil**, `public/build` diperbarui, dan bundle produksi memuat perbaikan audit:

- `assets/admin-dashboard-yydlGxyo.js` → `a.arah==="pemasukan"`
- `assets/viewer-iuran-Ddkuy34O.js` → `target`/`terkumpul` untuk status Lunas

Suite Feature dijalankan ulang setelah build: **177 passed (889 assertions), 33,21 detik**. Log: `npm-build-after-fix.txt`, `final-feature-3.txt`.

---

## G. Kesimpulan

### G.1 Yang sudah selesai

1. **Skema diselaraskan** dengan tiga migrasi bertarget:
   - `siswa.nama_siswa` 100, `nama_kelas` dihapus, `id_kelas` `BIGINT(20)`;
   - `users.role` 20, `transaksi.metode` `TF/CH`;
   - `transaksi.created_at` diisi dari `tanggal`.
2. **Backend disinkronkan** dengan alur nyata:
   - cicilan tidak otomatis lunas;
   - target dashboard dari iuran aktif;
   - `siswa_belum_lunas` dari sisa tagihan;
   - iuran global konsisten untuk admin;
   - detail transaksi ikut berubah saat edit;
   - `no_bukti` grup aman;
   - hapus kelas/pengguna dicegah bila masih dipakai.
3. **Frontend source disinkronkan**:
   - arah transaksi dashboard memakai `pemasukan`;
   - status viewer memakai `target`/`terkumpul`.
4. **Pengujian nyata**:
   - 177 tes Feature lulus (889 assertion) pada database nyata;
   - data lama utuh;
   - aplikasi boot dan route utama terdaftar;
   - backup tersedia.
5. **Laporan A–G** ini mendokumentasikan setiap tipe, panjang, relasi, constraint, indeks, dan alasan perubahan/penolakan perubahan.

### G.2 Risiko residual

| Risiko | Dampak | Rekomendasi |
|---|---|---|
| Data legacy lintas kelas (iuran 24/25/26) | Angka “terkumpul” per iuran bisa lebih kecil dari total transaksi historis | Bersihkan dengan migrasi data terpisah setelah konfirmasi bisnis |
| Baris lama tanpa `detail_transaksi` | Modal detail transaksi lama kosong | Biarkan sebagai riwayat; bila perlu, backfill dari `transaksi` |
| `pengeluaran` ber-`id_iuran` | Relasi tidak semantik | Bersihkan setelah audit data |
| `kelas.nama_kelas` tanpa UNIQUE | Duplikat mungkin lewat insert langsung | Tambah UNIQUE setelah memastikan tidak ada duplikat |
| `detail_transaksi` 1:N vs aplikasi 1:1 | Duplikat bisa muncul dari penulis lain | Tambah UNIQUE `id_transaksi` hanya bila multi-iuran tidak diperlukan |
| Timestamp drift `users`/`kelas` | Fresh migrate membuat kolom yang tidak ada di live | Samakan migrasi create atau tambahkan migrasi penyelaras |
| Record hantu `create_saldo_awal_kas_table` | Membingungkan saat audit migrasi | Hapus record hanya setelah konfirmasi tidak ada fitur saldo awal |
| `siswa.id_siswa`/`transaksi.id_siswa` lebar tampilan berbeda | Kosmetik, bukan fungsional | Tidak perlu diubah |

### G.3 Status akhir

**Selesai untuk lingkup audit database, backend, source UI, dan build aset.** Seluruh perubahan bersifat terukur, mempertahankan data lama, dan diverifikasi dengan 177 tes Feature pada database nyata. Build Vite berhasil setelah import rusak dihapus; `public/build` kini memuat perbaikan JS audit. Uji klik browser end-to-end tetap belum dilakukan karena tidak ada otomasi browser.

---

### Lampiran: file yang diubah/ditambahkan pada audit ini

| File | Jenis | Ringkasan |
|---|---|---|
| `database/migrations/2026_11_08_000001_selaraskan_skema_siswa.php` | Baru | Lebar nama, hapus `nama_kelas`, samakan `id_kelas` |
| `database/migrations/2026_11_08_000002_selaraskan_role_dan_metode.php` | Baru | `role` 20, `metode` `TF/CH` |
| `database/migrations/2026_11_08_000003_lengkapi_created_at_transaksi.php` | Baru | Backfill `created_at` |
| `database/seeders/SiswaSeeder.php` | Diubah | Hapus `nama_kelas`, ambil `id_kelas` dari `kelas` |
| `app/Http/Controllers/Admin/IuranController.php` | Diubah | Cicilan, global, guard pindah kelas |
| `app/Http/Controllers/Admin/SiswaController.php` | Diubah | Global admin, status tanpa tagihan |
| `app/Http/Controllers/Admin/KelasController.php` | Diubah | Guard hapus kelas |
| `app/Http/Controllers/Admin/UserController.php` | Diubah | Guard hapus pengguna |
| `app/Http/Controllers/Api/DashboardController.php` | Diubah | Target & belum lunas dari data nyata |
| `app/Http/Controllers/Api/TransaksiController.php` | Diubah | Sinkron detail & `no_bukti` grup |
| `app/Http/Requests/StoreTransaksiRequest.php` | Diubah | Tolak `no_bukti` lama pada mode banyak |
| `resources/js/admin-dashboard.js` | Diubah | Arah `pemasukan` |
| `resources/js/viewer-iuran.js` | Diubah | Status dari `target`/`terkumpul` |
| `resources/css/konfirmasi-logout.css` | Diubah | Hapus import `./desktop-large.css` yang hilang agar build Vite berhasil |
| `public/build/` | Dibangun ulang | Manifest dan aset produksi memuat perbaikan JS |
| `tests/Feature/AuditS308PerbaikanTest.php` | Baru | 11 tes regresi |
| `S3-08_LAPORAN_AUDIT.md` | Baru | Laporan ini |
