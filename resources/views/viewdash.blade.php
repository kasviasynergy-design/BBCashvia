<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Halaman Utama Viewer — BBCashvia</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/dashboard.css">
</head>
<body>
  <div class="ambient" aria-hidden="true">
    <span class="ambient__blob ambient__blob--a"></span>
    <span class="ambient__blob ambient__blob--b"></span>
    <span class="ambient__blob ambient__blob--c"></span>
  </div>

  <div class="dash">
    <!-- ============ SIDEBAR ============ -->
    <aside class="sidebar" id="sidebar" aria-label="Navigasi portal kas siswa">
      <div class="side-brand">
        <span class="side-brand__icon material-symbols-outlined" aria-hidden="true">account_balance_wallet</span>
        <span class="side-brand__text">
          <span class="side-brand__name">BBCashvia</span>
          <span class="side-brand__tag">Kas Kelas Digital</span>
        </span>
      </div>

      <div class="side-brand__meta">
        <span class="material-symbols-outlined" aria-hidden="true">school</span>
        Kelas X RPL 1
        <span class="role-pill">Viewer</span>
      </div>

      <nav class="side-nav">
        <span class="side-nav__label">Utama</span>
        <a class="side-link is-active" href="dashboard-viewer.html" aria-current="page">
          <span class="material-symbols-outlined" aria-hidden="true">home</span>
          Halaman Utama
        </a>

        <span class="side-nav__label">Keuangan Siswa</span>
        <a class="side-link" href="#" data-soon data-soon-label="Status Pembayaran">
          <span class="material-symbols-outlined" aria-hidden="true">fact_check</span>
          Status Pembayaran
        </a>

        <span class="side-nav__label">Arus Kas Kelas</span>
        <a class="side-link" href="#" data-soon data-soon-label="Pemasukan Kas">
          <span class="material-symbols-outlined" aria-hidden="true">south_west</span>
          Pemasukan Kas
        </a>
        <a class="side-link" href="#" data-soon data-soon-label="Pengeluaran Kas">
          <span class="material-symbols-outlined" aria-hidden="true">north_east</span>
          Pengeluaran Kas
        </a>
        <a class="side-link" href="#" data-soon data-soon-label="Saldo Kas">
          <span class="material-symbols-outlined" aria-hidden="true">savings</span>
          Saldo Kas
        </a>

        <span class="side-nav__label">Rekapitulasi</span>
        <a class="side-link" href="#" data-soon data-soon-label="Laporan Kas">
          <span class="material-symbols-outlined" aria-hidden="true">monitoring</span>
          Laporan Kas
        </a>
      </nav>

      <div class="sidebar__footer">
        <span class="sidebar__version">BBCashvia • Sprint 1 — Prototype UI</span>
        <button type="button" class="btn-logout" data-logout>
          <span class="material-symbols-outlined" aria-hidden="true">logout</span>
          Keluar
        </button>
      </div>
    </aside>

    <div class="backdrop" id="sidebarBackdrop" aria-hidden="true"></div>

    <!-- ============ KONTEN ============ -->
    <div class="dash__main">
      <header class="topbar">
        <button type="button" class="topbar__burger" id="sidebarToggle" aria-label="Buka menu navigasi" aria-expanded="false">
          <span class="material-symbols-outlined" aria-hidden="true">menu</span>
        </button>

        <span class="topbar__spacer"></span>

        <span class="topbar__chip topbar__chip--readonly">
          <span class="material-symbols-outlined" aria-hidden="true">visibility</span>
          Akses Pratinjau (Read-Only)
        </span>

        <div class="profile">
          <button type="button" class="profile__btn" id="profileBtn" aria-haspopup="true" aria-expanded="false">
            <span class="avatar" data-avatar aria-hidden="true">MP</span>
            <span class="profile__text">
              <span class="profile__name" id="topbarName">Muhammad Rizky Pratama</span>
              <span class="profile__role" id="topbarRole">Viewer</span>
            </span>
            <span class="material-symbols-outlined profile__caret" aria-hidden="true">expand_more</span>
          </button>
          <div class="profile__menu" id="profileMenu" role="menu">
            <div class="profile__head">
              <span class="avatar avatar--lg" data-avatar aria-hidden="true">MP</span>
              <div class="profile__head-text">
                <span class="profile__head-name" id="menuName">Muhammad Rizky Pratama</span>
                <span class="profile__head-id" id="menuIdentity">viewer@bbcashvia.sch.id</span>
                <span class="profile__head-id" id="menuRole">Viewer</span>
              </div>
            </div>
            <button type="button" class="profile__item profile__item--danger" data-logout role="menuitem">
              <span class="material-symbols-outlined" aria-hidden="true">logout</span>
              Keluar dari Akun
            </button>
          </div>
        </div>
      </header>

      <main class="dash__content">
        <!-- ===== HERO ===== -->
        <section class="hero">
          <div class="hero__chips">
            <span class="hero__chip">
              <span class="material-symbols-outlined" aria-hidden="true">public</span>
              Portal Kas Siswa Terpadu
            </span>
            <span class="hero__chip">
              <span class="material-symbols-outlined" aria-hidden="true">calendar_month</span>
              TA 2026/2027 • Semester Ganjil
            </span>
          </div>
          <div class="hero__row">
            <div>
              <h1 class="hero__title">Halo, <span data-greet-name>Muhammad Rizky Pratama</span></h1>
              <p class="hero__desc">
                Pantau status pembayaran dan kondisi kas kelas X RPL 1 secara transparan.
                Informasi ditampilkan sesuai hak akses Viewer — tanpa kemampuan mengubah data.
              </p>
            </div>
            <div class="hero__side">
              <span class="avatar avatar--lg" data-avatar aria-hidden="true">MP</span>
              <div class="hero__side-text">
                <span class="hero__side-value">Muhammad Rizky Pratama</span>
                <span class="hero__side-label">Siswa • X RPL 1 • NISN 0087929162</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ===== PILIHAN MENU ===== -->
        <section>
          <div class="panel__head" style="margin-bottom:12px">
            <div>
              <div class="panel__eyebrow">Transparansi Kas</div>
              <h2 class="panel__title">Pilihan Menu Informasi Kas</h2>
            </div>
          </div>
          <div class="vnav-grid">
            <a class="vnav-card" href="#" data-soon data-soon-label="Status Pembayaran">
              <div class="vnav-card__top">
                <span class="vnav-card__icon material-symbols-outlined" aria-hidden="true">fact_check</span>
                <span class="vnav-card__chip">Terkini</span>
              </div>
              <span class="vnav-card__label">Status Pembayaran</span>
              <span class="vnav-card__value">3 Lunas • 1 Menunggu</span>
              <span class="vnav-card__desc">Kewajiban iuran periode Oktober 2026.</span>
              <span class="vnav-card__link">Lihat Detail<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></span>
            </a>

            <a class="vnav-card" href="#" data-soon data-soon-label="Pemasukan Kas">
              <div class="vnav-card__top">
                <span class="vnav-card__icon material-symbols-outlined" aria-hidden="true">south_west</span>
                <span class="vnav-card__chip">Bulan Ini</span>
              </div>
              <span class="vnav-card__label">Pemasukan Kas</span>
              <span class="vnav-card__value">Rp 4.850.000</span>
              <span class="vnav-card__desc">Seluruh setoran kas &amp; iuran kelas X RPL 1.</span>
              <span class="vnav-card__link">Lihat Detail<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></span>
            </a>

            <a class="vnav-card" href="#" data-soon data-soon-label="Pengeluaran Kas">
              <div class="vnav-card__top">
                <span class="vnav-card__icon material-symbols-outlined" aria-hidden="true">north_east</span>
                <span class="vnav-card__chip">Bulan Ini</span>
              </div>
              <span class="vnav-card__label">Pengeluaran Kas</span>
              <span class="vnav-card__value">Rp 1.620.000</span>
              <span class="vnav-card__desc">Pengeluaran tercatat beserta keterangannya.</span>
              <span class="vnav-card__link">Lihat Detail<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></span>
            </a>

            <a class="vnav-card" href="#" data-soon data-soon-label="Saldo Kas">
              <div class="vnav-card__top">
                <span class="vnav-card__icon material-symbols-outlined" aria-hidden="true">savings</span>
                <span class="vnav-card__chip">Tersedia</span>
              </div>
              <span class="vnav-card__label">Saldo Kas</span>
              <span class="vnav-card__value">Rp 3.230.000</span>
              <span class="vnav-card__desc">Saldo akhir dihitung dari seluruh transaksi.</span>
              <span class="vnav-card__link">Lihat Detail<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></span>
            </a>

            <a class="vnav-card" href="#" data-soon data-soon-label="Laporan Kas">
              <div class="vnav-card__top">
                <span class="vnav-card__icon material-symbols-outlined" aria-hidden="true">monitoring</span>
                <span class="vnav-card__chip">Periode Okt 2026</span>
              </div>
              <span class="vnav-card__label">Laporan Kas</span>
              <span class="vnav-card__value">Rekap Tersedia</span>
              <span class="vnav-card__desc">Ringkasan pemasukan, pengeluaran, dan saldo.</span>
              <span class="vnav-card__link">Lihat Detail<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></span>
            </a>
          </div>
        </section>

        <!-- ===== KEWAJIBAN + KEPATUHAN ===== -->
        <div class="duo">
          <section class="panel">
            <div class="panel__head">
              <div>
                <div class="panel__eyebrow">Kewajiban Anda</div>
                <h2 class="panel__title">Ringkasan Kewajiban Iuran</h2>
                <p class="panel__sub">Periode Oktober 2026 — Kelas X RPL 1.</p>
              </div>
            </div>

            <div class="tagihan-item">
              <span class="tagihan-item__icon material-symbols-outlined" aria-hidden="true">event_repeat</span>
              <div class="tagihan-item__body">
                <div class="tagihan-item__title">Kas Pekan 1</div>
                <div class="tagihan-item__meta">Jatuh tempo 5 Okt 2026</div>
              </div>
              <span class="tagihan-item__nominal">Rp 10.000</span>
              <span class="badge badge--ok">Lunas</span>
            </div>
            <div class="tagihan-item">
              <span class="tagihan-item__icon material-symbols-outlined" aria-hidden="true">event_repeat</span>
              <div class="tagihan-item__body">
                <div class="tagihan-item__title">Kas Pekan 2</div>
                <div class="tagihan-item__meta">Jatuh tempo 12 Okt 2026</div>
              </div>
              <span class="tagihan-item__nominal">Rp 10.000</span>
              <span class="badge badge--ok">Lunas</span>
            </div>
            <div class="tagihan-item">
              <span class="tagihan-item__icon material-symbols-outlined" aria-hidden="true">event_repeat</span>
              <div class="tagihan-item__body">
                <div class="tagihan-item__title">Kas Pekan 3</div>
                <div class="tagihan-item__meta">Jatuh tempo 19 Okt 2026</div>
              </div>
              <span class="tagihan-item__nominal">Rp 10.000</span>
              <span class="badge badge--ok">Lunas</span>
            </div>
            <div class="tagihan-item">
              <span class="tagihan-item__icon material-symbols-outlined" aria-hidden="true">event_repeat</span>
              <div class="tagihan-item__body">
                <div class="tagihan-item__title">Kas Pekan 4</div>
                <div class="tagihan-item__meta">Jatuh tempo 26 Okt 2026</div>
              </div>
              <span class="tagihan-item__nominal">Rp 10.000</span>
              <span class="badge badge--warn">Menunggu</span>
            </div>
            <div class="tagihan-item">
              <span class="tagihan-item__icon material-symbols-outlined" aria-hidden="true">dns</span>
              <div class="tagihan-item__body">
                <div class="tagihan-item__title">Praktikum Jaringan &amp; Cloud</div>
                <div class="tagihan-item__meta">Iuran khusus • Sekali bayar</div>
              </div>
              <span class="tagihan-item__nominal">Rp 25.000</span>
              <span class="badge badge--ok">Lunas</span>
            </div>

            <div class="panel__foot" style="margin:16px -22px -20px">
              <span><span class="material-symbols-outlined" aria-hidden="true">info</span>Pembayaran divalidasi oleh Bendahara Kelas.</span>
              <span>Total Rp 65.000 • Terbayar Rp 55.000</span>
            </div>
          </section>

          <section class="panel">
            <div class="panel__head">
              <div>
                <div class="panel__eyebrow">Transparansi</div>
                <h2 class="panel__title">Kepatuhan Iuran Kelas</h2>
              </div>
            </div>
            <div class="compliance">
              <div class="compliance__ring" style="--pct:84.6" role="img" aria-label="Kepatuhan iuran 84,6 persen">
                <span>84,6%</span>
              </div>
              <div class="compliance__body">
                <div class="compliance__title">Tepat Waktu periode Oktober</div>
                <div class="compliance__desc">
                  Persentase kewajiban iuran seluruh siswa kelas X RPL 1 yang diselesaikan
                  sesuai jatuh tempo. Data diperbarui setiap ada transaksi terverifikasi.
                </div>
              </div>
            </div>

            <div class="activity" style="margin-top:16px">
              <div class="activity__item">
                <span class="activity__icon material-symbols-outlined" aria-hidden="true">verified</span>
                <div class="activity__body">
                  <div class="activity__title">Pembayaran terverifikasi</div>
                  <div class="activity__desc">Kas Pekan 3 Anda dicatat oleh bendahara dan masuk buku kas.</div>
                  <div class="activity__time">20 Okt 2026 • 07:05</div>
                </div>
              </div>
              <div class="activity__item">
                <span class="activity__icon material-symbols-outlined" aria-hidden="true">receipt_long</span>
                <div class="activity__body">
                  <div class="activity__title">Laporan periode tersedia</div>
                  <div class="activity__desc">Rekap kas kelas periode September 2026 telah dipublikasikan.</div>
                  <div class="activity__time">1 Okt 2026 • 10:00</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- ===== TRANSAKSI TERAKHIR ===== -->
        <section class="panel panel--flush">
          <div class="panel__head" style="padding:20px 22px 0">
            <div>
              <div class="panel__eyebrow">Buku Kas Terbuka</div>
              <h2 class="panel__title">5 Transaksi Terakhir Kelas</h2>
              <p class="panel__sub">Arus kas X RPL 1 yang dapat dipantau seluruh viewer kelas.</p>
            </div>
            <button type="button" class="panel__link" data-soon data-soon-label="Riwayat Transaksi">
              Semua Transaksi
              <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </button>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Bukti &amp; Tanggal</th>
                  <th>Keterangan</th>
                  <th>Metode</th>
                  <th>Nominal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="table__primary">KAS-20261001-039</div><div class="table__secondary">1 Okt 2026 • 07:12</div></td>
                  <td><div class="table__primary">Setoran kas pekan 4</div><div class="table__secondary">Muhammad Alif Pratama</div></td>
                  <td><span class="tag-method">QRIS</span></td>
                  <td><span class="table__nominal table__nominal--in">+Rp 10.000</span></td>
                </tr>
                <tr>
                  <td><div class="table__primary">KAS-20261001-038</div><div class="table__secondary">1 Okt 2026 • 07:08</div></td>
                  <td><div class="table__primary">Setoran kas pekan 4</div><div class="table__secondary">Nabila Azzahra Putri</div></td>
                  <td><span class="tag-method">Tunai</span></td>
                  <td><span class="table__nominal table__nominal--in">+Rp 10.000</span></td>
                </tr>
                <tr>
                  <td><div class="table__primary">TRS-20260930-021</div><div class="table__secondary">30 Sep 2026 • 13:20</div></td>
                  <td><div class="table__primary">Alat tulis &amp; ATK kelas</div><div class="table__secondary">Pengeluaran operasional</div></td>
                  <td><span class="tag-method">Kas Tunai</span></td>
                  <td><span class="table__nominal table__nominal--out">-Rp 65.000</span></td>
                </tr>
                <tr>
                  <td><div class="table__primary">KAS-20260930-017</div><div class="table__secondary">30 Sep 2026 • 07:03</div></td>
                  <td><div class="table__primary">Iuran praktikum jaringan</div><div class="table__secondary">Dimas Fakhri Ramadhan</div></td>
                  <td><span class="tag-method">Transfer Bank</span></td>
                  <td><span class="table__nominal table__nominal--in">+Rp 25.000</span></td>
                </tr>
                <tr>
                  <td><div class="table__primary">TRS-20260929-009</div><div class="table__secondary">29 Sep 2026 • 11:45</div></td>
                  <td><div class="table__primary">Konsumsi rapat kelas</div><div class="table__secondary">Pengeluaran kegiatan</div></td>
                  <td><span class="tag-method">Kas Tunai</span></td>
                  <td><span class="table__nominal table__nominal--out">-Rp 85.000</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="panel__foot">
            <span><span class="material-symbols-outlined" aria-hidden="true">visibility</span>Anda melihat data sebagai Viewer — tanpa hak mengubah.</span>
          </div>
        </section>
      </main>
    </div>
  </div>

  <div class="toast" id="dashToast" role="status">
    <span class="material-symbols-outlined" aria-hidden="true">info</span>
    <span data-toast-text></span>
  </div>

  <script src="assets/js/dashboard.js"></script>
  <script src="assets/js/dashboard-viewer.js"></script>
</body>
</html>