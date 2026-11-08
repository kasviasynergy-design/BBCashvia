-- ============================================================
-- BBCASHVIA - S3-07 PERFORMANCE & USABILITY REFINEMENT
-- Skrip Indeks Basis Data (Foreign Keys & Kolom yang Sering Difilter)
-- Database : bbcashvia
-- Jalankan : sekali saja, via phpMyAdmin (SQL) atau mysql CLI
-- ============================================================
--
-- TUJUAN
--   1. Memasang indeks eksplisit pada kolom relasi (foreign key)
--      yang sering dipakai menyaring data: id_user, id_siswa,
--      id_kelas, dan id_iuran.
--   2. Menambah indeks pendukung query yang sering dipakai
--      aplikasi:
--        - tanggal                -> laporan kas, urutan riwayat
--        - no_bukti               -> pencarian/grup riwayat
--        - jenis                  -> rekap pemasukan vs pengeluaran
--        - (id_siswa, id_iuran)   -> perhitungan status pembayaran
--                                    (Lunas / Cicilan) per pasangan
--                                    siswa-iuran
--
-- CATATAN
--   InnoDB otomatis membuat indeks satu kolom untuk setiap foreign
--   key (dapat dilihat sebagai transaksi_id_*_foreign pada
--   SHOW INDEX). Indeks tersebut tidak mencakup kombinasi dua kolom
--   maupun kolom non-FK yang dipakai filter/laporan, sehingga
--   skrip ini MENAMBAH indeks eksplisit untuk menutupinya.
--
--   DoD (Definition of Done) S3-07:
--     - Rata-rata waktu muat halaman di localhost < 500 ms.
--     - Tidak terjadi duplikasi insert akibat klik ganda tombol
--       simpan (ditangani tombol anti-spam klik di front-end).
-- ============================================================

-- A. PASANG INDEKS PADA TABEL TRANSAKSI
--    (satu pernyataan ALTER agar tabel hanya dibangun ulang sekali)
ALTER TABLE `transaksi`
    ADD INDEX `idx_transaksi_tanggal` (`tanggal`),
    ADD INDEX `idx_transaksi_no_bukti` (`no_bukti`),
    ADD INDEX `idx_transaksi_jenis` (`jenis`),
    ADD INDEX `idx_transaksi_siswa_iuran` (`id_siswa`, `id_iuran`);

-- B. VERIFIKASI HASIL PEMASANGAN
--    Bandingkan sebelum/sesudah:
--    SEBELUM : PRIMARY + transaksi_id_user_foreign, _id_iuran_foreign,
--              _id_kelas_foreign, _id_siswa_foreign
--    SESUDAH : + idx_transaksi_tanggal, idx_transaksi_no_bukti,
--              idx_transaksi_jenis, idx_transaksi_siswa_iuran
--
--    CATATAN PENTING (perilaku normal InnoDB):
--    Indeks transaksi_id_siswa_foreign otomatis dihapus oleh MySQL
--    karena prefix kiri idx_transaksi_siswa_iuran (id_siswa, ...)
--    kini melayani kebutuhan indeks foreign key id_siswa tersebut.
--    Constraint FK TETAP AKTIF (dicek lewat
--    information_schema.KEY_COLUMN_USAGE: 4 constraint tetap ada);
--    MySQL hanya memilih indeks gabungan yang lebih efisien.
