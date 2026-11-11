# BBCashvia

Aplikasi manajemen kas kelas berbasis **Laravel 12** untuk mengelola data siswa, kelas, iuran, transaksi, dan laporan kas. Aplikasi mendukung tiga peran: **Admin**, **Bendahara**, dan **Viewer**.

## Live

- Aplikasi: <https://bbcashvia-production.up.railway.app>
- Health check: <https://bbcashvia-production.up.railway.app/up>

## Fitur

- Login multi-role: Admin, Bendahara, dan Viewer.
- Dashboard terpisah untuk Admin, Bendahara, dan Viewer.
- Manajemen pengguna (tambah, ubah, hapus, atur role).
- Manajemen data siswa dan kelas.
- Manajemen iuran (sekali bayar, mingguan, bulanan, tahunan).
- Pencatatan transaksi pemasukan dan pengeluaran.
- Riwayat transaksi dan laporan kas.
- Ganti password dengan validasi kekuatan password.
- Halaman error aman saat database bermasalah (HTTP 503, tanpa fatal error).
- API JSON untuk data dashboard, siswa, kelas, iuran, dan transaksi.

## Teknologi

- PHP 8.2
- Laravel 12
- MySQL / MariaDB
- Vite 7 + Tailwind CSS 4
- PHPUnit 11
- Railway (Dockerfile, PHP CLI server port 8000)

## Akun

### Akun produksi Railway

Akun lama sudah diimpor ke database Railway. **Password mengikuti password lama masing-masing akun.**

| Nama | Email | Role |
|---|---|---|
| A Azis | `admin@gmail.com` | Admin |
| Nuraeni naziroh | `nuraeninaziroh51@gmail.com` | Bendahara |
| Andi Pratama | `andipratama@gmail.com` | Bendahara |
| Budi Santoso | `budisantoso@gmail.com` | Viewer |
| Gesya Fikry | `gesyafikry@gmail.com` | Admin |

Saat login, pilih role yang sesuai dengan akun. Akun **Andi Pratama** dan **Gesya Fikry** akan diminta mengganti password pada login pertama.

### Akun demo (seeder)

Akun berikut hanya dibuat jika menjalankan `php artisan db:seed` pada database kosong:

| Email | Password | Role |
|---|---|---|
| `admin@bbcashvia.test` | `Admin123!` | Admin |
| `bendahara@bbcashvia.test` | `Bendahara123!` | Bendahara |
| `viewer@bbcashvia.test` | `Viewer123!` | Viewer |

> **Penting:** jangan menjalankan `php artisan db:seed` di production yang sudah berisi data. Seeder akan membuat akun demo dan mereset password akun demo tersebut.

## Menjalankan di Lokal

### Prasyarat

- PHP >= 8.2 dengan ekstensi `pdo_mysql`
- Composer
- Node.js >= 22.12
- MySQL / MariaDB (XAMPP/Laragon juga bisa)

### Langkah

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Buat database MySQL, misalnya `bbcashvia`, lalu sesuaikan konfigurasi di `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bbcashvia
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrasi dan seeder:

```bash
php artisan migrate --seed
```

Install dan build aset frontend:

```bash
npm install
npm run build
```

Jalankan aplikasi:

```bash
php artisan serve
```

Atau gunakan perintah bawaan Composer:

```bash
composer run setup   # install dependency, generate key, migrate, build aset
composer run dev     # server + queue + log + Vite
```

## Konfigurasi Database

### Lokal

Gunakan MySQL/MariaDB. Konfigurasi default ada di `.env.example`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bbcashvia
DB_USERNAME=root
DB_PASSWORD=
```

### Railway

Di service aplikasi Railway, hubungkan variabel database ke service MySQL. Cara paling aman adalah memakai referensi variabel:

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
```

`config/database.php` memprioritaskan variabel `MYSQL*` dari service MySQL Railway di atas `DB_*` manual.

Variabel production yang disarankan:

```env
APP_ENV=production
APP_DEBUG=false
SESSION_DRIVER=file
CACHE_STORE=file
```

`SESSION_DRIVER=file` dan `CACHE_STORE=file` membuat halaman login dan halaman error tetap bisa tampil saat database mati.

Setelah deploy pertama, jalankan migrasi di container:

```bash
php artisan migrate --force
```

## Deployment Railway

1. Buat project Railway dengan dua service: **aplikasi** dan **MySQL**.
2. Hubungkan repository GitHub ke service aplikasi.
3. Railway akan memakai `Dockerfile` pada repository ini.
4. Tambahkan variabel database seperti pada bagian **Konfigurasi Database**.
5. Pastikan service aplikasi dan MySQL berada di project/environment yang sama agar hostname `mysql.railway.internal` bisa diakses.
6. Deploy. Health check tersedia di `/up`.
7. Jalankan `php artisan migrate --force` bila database masih kosong.

Dockerfile menjalankan:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

## Testing

```bash
php artisan test
```

Format kode:

```bash
./vendor/bin/pint
```

Test suite menggunakan `RefreshDatabase` dan seeder, sehingga setiap test berjalan pada database bersih.

## Struktur Proyek

```text
app/
  Http/Controllers/       # Controller web dan API
  Models/                 # Model Eloquent
  Support/                # Helper error handling database
bootstrap/
  app.php                 # Konfigurasi exception Laravel 12
config/
  database.php            # Prioritas MYSQL* Railway dan fallback DB_*
  session.php             # Default session driver: file
  cache.php               # Default cache store: file
database/
  migrations/             # Migrasi baseline + arsip migrasi lama
  seeders/                # Seeder akun demo
resources/
  views/                  # Blade views
routes/
  web.php                 # Route web dan API internal
  api.php                 # Route API
public/
  build/                  # Aset Vite hasil build
Dockerfile                # Deployment Railway
```

## Penanganan Error Database

- Kegagalan koneksi database saat login atau akses halaman publik ditangkap dan dikembalikan sebagai **HTTP 503**.
- Request JSON menerima respons JSON `503`; request web menerima halaman error aman.
- `QueryException` yang bukan kegagalan koneksi dikembalikan sebagai **HTTP 500**.
- Halaman error tidak memakai `Auth::user()`, Eloquent, session, atau komponen lain yang bergantung pada database.
- Pesan login saat database mati: `Gagal terhubung ke server database. Silakan coba beberapa saat lagi.`

## Catatan Migrasi

- Migrasi baseline ada di `database/migrations/2026_11_10_000000_create_final_schema.php`.
- Baseline tidak mengubah database lama yang sudah memiliki tabel `users` dan `transaksi`.
- Migrasi lama diarsipkan di `database/migrations/archive`.
- Kolom mirip enum memakai `string` agar kompatibel dengan SQLite (testing) dan MySQL (production).
- Baseline tidak membuat foreign key agar aman untuk database lama dan pengujian.

## Lisensi

Proyek ini menggunakan lisensi MIT.
