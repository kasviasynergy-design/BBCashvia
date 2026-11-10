# Arsip migrasi lama

Migrasi di folder ini **tidak dijalankan lagi** oleh `php artisan migrate`.

## Alasan

Sebagian besar migrasi lama ditulis untuk database produksi yang sudah
memiliki tabel `siswa`, `iuran`, `transaksi`, dan `users` dengan nama kolom
legacy. Beberapa migrasi bahkan mengubah tabel yang belum pernah dibuat oleh
migrasi sebelumnya. Akibatnya:

- `php artisan migrate` pada database kosong gagal (`no such table: siswa`);
- `php artisan migrate:fresh --seed` pada SQLite pengujian gagal;
- deployment baru di Railway tidak bisa menyiapkan database dari nol.

## Pengganti

Semua tabel final sekarang dibuat oleh:

```
database/migrations/2026_11_10_000000_create_final_schema.php
```

Migrasi tersebut aman untuk dua kondisi:

1. **Database baru** — membuat seluruh tabel aplikasi.
2. **Database lama** — langsung berhenti bila tabel `users` dan `transaksi`
   sudah ada, sehingga data produksi tidak tersentuh.

File di folder ini disimpan hanya sebagai dokumentasi historis. Jangan
memindahkannya kembali ke `database/migrations` tanpa menyesuaikan urutan
dan dependensinya.
