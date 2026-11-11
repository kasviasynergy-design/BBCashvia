# 💰 BBCashvia — Sistem Informasi Manajemen Kas Kelas

[![Release](https://img.shields.io/badge/Release-v1.0.0--rc-0D9488?style=for-the-badge)](https://github.com/kasviasynergy-design/BBCashvia/releases)
[![Build Status](https://img.shields.io/badge/Build-Passing-10B981?style=for-the-badge)](https://github.com/kasviasynergy-design/BBCashvia/actions)
[![Security Audit](https://img.shields.io/badge/Security-Protected-3B82F6?style=for-the-badge)](https://github.com/kasviasynergy-design/BBCashvia/security)
[![License](https://img.shields.io/badge/License-MIT-slate?style=for-the-badge)](LICENSE)

> Proyek Uji Kompetensi Keahlian (UKK) Rekayasa Perangkat Lunak / PPLG — Tahun Ajaran 2026/2027  
> **Tema:** Local Digital Solution &bull; **Mitra:** Manajemen Kas Kelas Sekolah

🔗 **Live Demo:** [bbcashvia-production.up.railway.app](https://bbcashvia-production.up.railway.app)

---

## 📌 1. Latar Belakang Masalah & Solusi

Pengelolaan kas kelas di sekolah sering dilakukan secara manual menggunakan buku catatan dan grup WhatsApp. Cara ini rawan menimbulkan data ganda, kehilangan bukti pembayaran, keterlambatan rekap iuran, serta sulitnya melakukan audit karena catatan tersebar di banyak tempat.

**BBCashvia** hadir sebagai solusi digital terintegrasi untuk mengelola administrasi kas kelas secara terpusat:

1. **Centralized Cash Management:** Seluruh data siswa, kelas, iuran, dan transaksi tersimpan dalam satu database.
2. **Role-Based Dashboard:** Admin, Bendahara, dan Viewer memiliki hak akses serta tampilan dashboard yang berbeda.
3. **Transparent Reporting:** Riwayat transaksi dan laporan kas dapat dilihat kembali secara transparan.
4. **Resilient Error Handling:** Halaman login dan halaman error tetap dapat ditampilkan saat database bermasalah, dengan respons HTTP 503 yang aman.

---

## 🛠️ 2. Tech Stack & Architecture

* **Frontend:** Blade Templating, Tailwind CSS 4, JavaScript Vanilla, Vite 7.
* **Backend:** PHP 8.2 (Laravel 12 MVC Engine).
* **Database:** MySQL / MariaDB (InnoDB Engine, relational schema).
* **Security:** Bcrypt Hashing, CSRF Protection, Role Middleware, Eloquent Parameterized Queries, Session Security.
* **Deployment:** Railway (Dockerfile, PHP CLI server port 8000).

---

## 🚀 3. Panduan Instalasi Lokal (Quick Local Setup)

### Prasyarat Sistem:

* PHP >= 8.2 & Composer
* MySQL Server (Laragon / XAMPP)
* Node.js >= 22.12 & npm
* Git CLI

### Langkah Instalasi:

```bash
# 1. Klon repositori ini
git clone https://github.com/kasviasynergy-design/BBCashvia.git
cd BBCashvia

# 2. Pasang dependensi PHP
composer install

# 3. Salin berkas environment
cp .env.example .env

# 4. Generate Application Key
php artisan key:generate

# 5. Konfigurasi basis data pada berkas .env
# DB_DATABASE=bbcashvia
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Jalankan migrasi dan data seeder dummy
# CATATAN: migrate:fresh menghapus seluruh data. Hanya untuk lokal.
php artisan migrate:fresh --seed

# 7. Hubungkan storage symlink
php artisan storage:link

# 8. Pasang dependensi frontend dan build aset
npm install
npm run build

# 9. Jalankan server lokal
php artisan serve
```

Akses aplikasi melalui browser pada tautan: <http://localhost:8000>

---

## 🔐 4. Akun Demo & Hak Akses

### 4.1 Akun Demo (Seeder)

Akun berikut dibuat otomatis saat menjalankan `php artisan migrate:fresh --seed` pada database kosong:

| Email | Password | Role |
|---|---|---|
| `admin@bbcashvia.test` | `Admin123!` | Admin |
| `bendahara@bbcashvia.test` | `Bendahara123!` | Bendahara |
| `viewer@bbcashvia.test` | `Viewer123!` | Viewer |

> **Penting:** akun demo hanya untuk pengujian lokal. Untuk production, gunakan akun asli dan jangan memakai akun demo. Jangan menjalankan `php artisan db:seed` di production yang sudah berisi data karena seeder akan membuat akun demo dan mereset password akun demo tersebut.

### 4.2 Akun Produksi Railway

Akun lama sudah diimpor ke database Railway. **Password mengikuti password lama masing-masing akun.**

| Nama | Email | Role |
|---|---|---|
| A Azis | `admin@gmail.com` | Admin |
| Nuraeni naziroh | `nuraeninaziroh51@gmail.com` | Bendahara |
| Andi Pratama | `andipratama@gmail.com` | Bendahara |
| Budi Santoso | `budisantoso@gmail.com` | Viewer |
| Gesya Fikry | `gesyafikry@gmail.com` | Admin |

Saat login, pilih role yang sesuai. Akun **Andi Pratama** dan **Gesya Fikry** akan diminta mengganti password pada login pertama.

---

## ✨ 5. Fitur Utama

- Login multi-role: Admin, Bendahara, dan Viewer.
- Dashboard terpisah untuk setiap role.
- Manajemen pengguna: tambah, ubah, hapus, dan atur role.
- Manajemen data siswa dan kelas.
- Manajemen iuran: sekali bayar, mingguan, bulanan, dan tahunan.
- Pencatatan transaksi pemasukan dan pengeluaran.
- Riwayat transaksi dan laporan kas.
- Ganti password dengan validasi kekuatan password.
- API JSON untuk dashboard, siswa, kelas, iuran, dan transaksi.
- Halaman error aman saat database bermasalah (HTTP 503).

---

## 🗄️ 6. Struktur Database

| Tabel | Fungsi |
|---|---|
| `users` | Menyimpan akun pengguna, role, relasi siswa/kelas, dan status ganti password. |
| `kelas` | Menyimpan data kelas, tingkat, dan tahun ajaran. |
| `siswa` | Menyimpan data siswa, NIS, kelas, status, jenis kelamin, dan nomor HP. |
| `iuran` | Menyimpan data iuran, kategori, nominal, jatuh tempo, dan status. |
| `transaksi` | Menyimpan transaksi pemasukan/pengeluaran, bukti, petugas, dan nominal. |
| `detail_transaksi` | Menyimpan rincian item iuran pada suatu transaksi. |

### Catatan Migrasi

- Migrasi baseline: `database/migrations/2026_11_10_000000_create_final_schema.php`.
- Migrasi lama diarsipkan di `database/migrations/archive`.
- Kolom mirip enum memakai `string` agar kompatibel dengan SQLite (testing) dan MySQL (production).
- Baseline tidak membuat foreign key agar aman untuk database lama dan pengujian.

---

## ☁️ 7. Deployment Railway

1. Buat project Railway dengan dua service: **aplikasi** dan **MySQL**.
2. Hubungkan repository GitHub ke service aplikasi.
3. Railway akan memakai `Dockerfile` pada repository ini.
4. Tambahkan variabel database berikut di service aplikasi:

```env
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}

DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_CONNECTION=mysql

APP_ENV=production
APP_DEBUG=false
SESSION_DRIVER=file
CACHE_STORE=file
```

5. Pastikan service aplikasi dan MySQL berada di project/environment yang sama agar hostname `mysql.railway.internal` bisa diakses.
6. Deploy. Health check tersedia di `/up`.
7. Jalankan migrasi bila database masih kosong:

```bash
php artisan migrate --force
```

Dockerfile menjalankan:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

---

## 🧪 8. Testing & Quality Assurance

Jalankan seluruh test suite:

```bash
php artisan test
```

Format kode dengan Laravel Pint:

```bash
./vendor/bin/pint
```

Test suite menggunakan `RefreshDatabase` dan seeder, sehingga setiap test berjalan pada database bersih.

---

## 👥 9. Tim Pengembang

| Nama | Kelas | NISN | Peran / Tugas |
|---|---|---|---|
| **A AZIS** | XII RPL 4 | NISN_3080651940 | Frontend & UI/UX Specialist |
| **NURAENI NAZIROH** | XII RPL 2 | NISN_00862755538 | Backend & Database Specialist |

> Proyek dikembangkan oleh dua anggota tim dengan pembagian tugas frontend/UI-UX dan backend/database.

---

## 📸 10. Dokumentasi Screenshot

Screenshot yang disarankan untuk laporan S4-04:

1. Halaman login.
2. Dashboard Admin.
3. Manajemen Pengguna.
4. Data Siswa.
5. Data Kelas.
6. Data Iuran.
7. Data Transaksi.
8. Halaman error 503 saat database mati (opsional).

---

## 📄 11. Lisensi

Proyek ini menggunakan lisensi **MIT**. Lihat berkas [LICENSE](LICENSE) untuk detailnya.
