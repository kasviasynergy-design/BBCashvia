<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dasbor Bendahara — BBCashvia</title>
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
    <aside class="sidebar" id="sidebar" aria-label="Navigasi dasbor bendahara">
      <div class="side-brand">
        <span class="side-brand__icon material-symbols-outlined" aria-hidden="true">account_balance_wallet</span>
        <span class="side-brand__text">
          <span class="side-brand__name">BBCashvia</span>
          <span class="side-brand__tag">Kas Kelas Digital</span>
        </span>
      </div>

      <div class="side-brand__meta">
        <span class="material-symbols-outlined" aria-hidden="true">school</span>
        XI RPL 1 &amp; XI RPL 2
        <span class="role-pill">Bendahara</span>
      </div>

      <nav class="side-nav">
        <span class="side-nav__label">Utama</span>
        <a class="side-link is-active" href="dashboard-bendahara.html" aria-current="page">
          <span class="material-symbols-outlined" aria-hidden="true">dashboard</span>
          Dashboard
        </a>

        <span class="side-nav__label">Master Data</span>
        <a class="side-link" href="#" data-soon data-soon-label="Data Siswa">
          <span class="material-symbols-outlined" aria-hidden="true">badge</span>
          Data Siswa
        </a>
        <a class="side-link" href="#" data-soon data-soon-label="Kelola Iuran">
          <span class="material-symbols-outlined" aria-hidden="true">request_quote</span>
          Kelola Iuran
        </a>

        <span class="side-nav__label">Transaksi Kas</span>
        <a class="side-link" href="#" data-soon data-soon-label="Pembayaran Siswa">
          <span class="material-symbols-outlined" aria-hidden="true">payments</span>
          Pembayaran Siswa
        </a>
        <a class="side-link" href="#" data-soon data-soon-label="Pemasukan Kas">
          <span class="material-symbols-outlined" aria-hidden="true">south_west</span>
          Pemasukan Kas
        </a>
        <a class="side-link" href="#" data-soon data-soon-label="Pengeluaran Kas">
          <span class="material-symbols-outlined" aria-hidden="true">north_east</span>
          Pengeluaran Kas
        </a>

        <span class="side-nav__label">Pembukuan &amp; Laporan</span>
        <a class="side-link" href="#" data-soon data-soon-label="Saldo Kas">
          <span class="material-symbols-outlined" aria-hidden="true">savings</span>
          Saldo Kas
        </a>
        <a class="side-link" href="#" data-soon data-soon-label="Rekap Laporan">
          <span class="material-symbols-outlined" aria-hidden="true">monitoring</span>
          Rekap Laporan
        </a>
        <a class="side-link" href="#" data-soon data-soon-label="Riwayat Kas">
          <span class="material-symbols-outlined" aria-hidden="true">history</span>
          Riwayat Kas
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

        <form class="topbar__search" data-search-form role="search">
          <span class="material-symbols-outlined" aria-hidden="true">search</span>
          <input type="search" name="q" placeholder="Cari nama siswa, no. bukti, atau keterangan transaksi" aria-label="Pencarian kas">
        </form>

        <span class="topbar__spacer"></span>

        <span class="topbar__chip">
          <span class="material-symbols-outlined" aria-hidden="true">calendar_month</span>
          TA 2026/2027 • Ganjil
        </span>

        <div class="profile">
          <button type="button" class="profile__btn" id="profileBtn" aria-haspopup="true" aria-expanded="false">
            <span class="avatar" data-avatar aria-hidden="true">SR</span>
            <span class="profile__text">
              <span class="profile__name" id="topbarName">Siti Rahmawati</span>
              <span class="profile__role" id="topbarRole">Bendahara</span>
            </span>
            <span class="material-symbols-outlined profile__caret" aria-hidden="true">expand_more</span>
          </button>
          <div class="profile__menu" id="profileMenu" role="menu">
            <div class="profile__head">
              <span class="avatar avatar--lg" data-avatar aria-hidden="true">SR</span>
              <div class="profile__head-text">
                <span class="profile__head-name" id="menuName">Siti Rahmawati</span>
                <span class="profile__head-id" id="menuIdentity">bendahara@bbcashvia.sch.id</span>
                <span class="profile__head-id" id="menuRole">Bendahara</span>
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
              <span class="material-symbols-outlined" aria-hidden="true">account_balance_wallet</span>
              Peran: Bendahara Kas
            </span>
            <span class="hero__chip">
              <span class="material-symbols-outlined" aria-hidden="true">calendar_month</span>
              TA 2026/2027 • Semester Ganjil
            </span>
            <span class="hero__chip">
              <span class="material-symbols-outlined" aria-hidden="true">book</span>
              Buku Kas Periode Oktober 2026 (Aktif)
            </span>
          </div>
          <div class="hero__row">
            <div>
              <h1 class="hero__title">Dashboard Bendahara — <span data-greet-name>Siti Rahmawati</span></h1>
              <p class="hero__desc">
                Kelola pencatatan pembayaran dan transaksi kas untuk kelas tanggung jawab Anda
                (XI RPL 1 &amp; XI RPL 2). Seluruh pemasukan dan pengeluaran tercatat pada buku kas
                periode berjalan.
              </p>
              <div class="hero__actions">
                <button type="button" class="btn-dash btn-dash--light" data-soon data-soon-label="Catat Pembayaran">
                  <span class="material-symbols-outlined" aria-hidden="true">add_card</span>
                  Catat Pembayaran
                </button>
                <button type="button" class="btn-dash btn-dash--ghostlight" data-soon data-soon-label="Pemasukan Lain">
                  <span class="material-symbols-outlined" aria-hidden="true">south_west</span>
                  Pemasukan Lain
                </button>
                <button type="button" class="btn-dash btn-dash--ghostlight" data-soon data-soon-label="Catat Pengeluaran">
                  <span class="material-symbols-outlined" aria-hidden="true">north_east</span>
                  Catat Pengeluaran
                </button>
              </div>
            </div>
            <div class="hero__side">
              <div class="hero__side-text">
                <span class="hero__side-label">Belum Lunas Periode Ini</span>
                <span class="hero__side-value">29 siswa</span>
              </div>
              <div class="hero__side-text">
                <span class="hero__side-label">Total Kewajiban</span>
                <span class="hero__side-value">360 siswa</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ===== KARTU STATISTIK ===== -->
        <section class="stat-grid" aria-label="Ringkasan kas bendahara">
          <article class="stat-card">
            <div class="stat-card__head">
              <span class="stat-card__label">Saldo Kas Kelas</span>
              <span class="stat-card__icon material-symbols-outlined" aria-hidden="true">savings</span>
            </div>
            <div class="stat-card__value">Rp 18.450.000</div>
            <div class="stat-card__trend">
              <span class="material-symbols-outlined" aria-hidden="true">trending_up</span>
              +8,4% dari bulan lalu
            </div>
            <div class="stat-card__meta"><span>Buku kas</span><strong>Periode Oktober 2026</strong></div>
          </article>

          <article class="stat-card">
            <div class="stat-card__head">
              <span class="stat-card__label">Penerimaan Siswa (Okt)</span>
              <span class="stat-card__icon material-symbols-outlined" aria-hidden="true">payments</span>
            </div>
            <div class="stat-card__value">Rp 12.300.000</div>
            <div class="stat-card__sub">331 setoran kas &amp; iuran terverifikasi bulan berjalan.</div>
            <div class="stat-card__meta"><span>Rata-rata harian</span><strong>Rp 410.000</strong></div>
          </article>

          <article class="stat-card">
            <div class="stat-card__head">
              <span class="stat-card__label">Pengeluaran Operasional</span>
              <span class="stat-card__icon material-symbols-outlined" aria-hidden="true">receipt_long</span>
            </div>
            <div class="stat-card__value">Rp 3.850.000</div>
            <div class="stat-card__sub">7 kegiatan dan kebutuhan kelas tercatat bulan berjalan.</div>
            <div class="stat-card__meta"><span>Rasio keluar/masuk</span><strong>31,3%</strong></div>
          </article>

          <article class="stat-card">
            <div class="stat-card__head">
              <span class="stat-card__label">Kepatuhan Pembayaran</span>
              <span class="stat-card__icon material-symbols-outlined" aria-hidden="true">fact_check</span>
            </div>
            <div class="stat-card__value">92<small>%</small></div>
            <div class="stat-card__sub">331 dari 360 kewajiban siswa lunas periode Oktober.</div>
            <div class="progress" role="img" aria-label="Kepatuhan pembayaran 92 persen">
              <span class="progress__fill progress__fill--ok" style="width:92%"></span>
            </div>
          </article>
        </section>

        <!-- ===== GRAFIK MINGGUAN ===== -->
        <section class="panel">
          <div class="panel__head">
            <div>
              <div class="panel__eyebrow">Arus Kas Mingguan</div>
              <h2 class="panel__title">Penerimaan &amp; Pengeluaran — 4 Pekan Terakhir</h2>
              <p class="panel__sub">Buku kas periode Oktober 2026 untuk XI RPL 1 &amp; XI RPL 2.</p>
            </div>
            <button type="button" class="panel__link" data-soon data-soon-label="Rekap Laporan">
              Lihat Rekap
              <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </button>
          </div>
          <div id="weeklyChart"></div>
          <div class="chart-legend" style="margin-top:10px">
            <span><i class="dot--in"></i>Penerimaan</span>
            <span><i class="dot--out"></i>Pengeluaran</span>
          </div>
        </section>

        <!-- ===== TABEL PEMBAYARAN HARI INI ===== -->
        <section class="panel panel--flush">
          <div class="panel__head" style="padding:20px 22px 0">
            <div>
              <div class="panel__eyebrow">Penerimaan Harian</div>
              <h2 class="panel__title">Pembayaran Siswa Hari Ini</h2>
              <p class="panel__sub">Rabu, 1 Oktober 2026 — seluruh setoran yang terverifikasi hari ini.</p>
            </div>
            <button type="button" class="panel__link" data-soon data-soon-label="Pembayaran Siswa">
              Catat Pembayaran
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
            </button>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>No. Bukti</th>
                  <th>Siswa</th>
                  <th>Kelas</th>
                  <th>Nominal</th>
                  <th>Metode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody data-pay-tbody>
                <!-- Baris dirender oleh assets/js/dashboard-bendahara.js (data dummy visual) -->
              </tbody>
            </table>
          </div>
          <div class="panel__foot">
            <span><span class="material-symbols-outlined" aria-hidden="true">info</span>Penagihan siswa belum lunas dilakukan melalui kanal kelas.</span>
            <span class="pager" data-pager>
              <span class="pager__info" data-page-info></span>
              <button type="button" class="pager__btn" data-page-prev aria-label="Halaman sebelumnya">
                <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
              </button>
              <button type="button" class="pager__btn" data-page="1">1</button>
              <button type="button" class="pager__btn" data-page="2">2</button>
              <button type="button" class="pager__btn" data-page-next aria-label="Halaman berikutnya">
                <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
              </button>
            </span>
          </div>
        </section>
      </main>
    </div>
  </div>

  <div class="toast" id="dashToast" role="status">
    <span class="material-symbols-outlined" aria-hidden="true">info</span>
    <span data-toast-text></span>
  </div>

  <script src="js/bendash.js"></script>
<script src="css/admindash.js"></script>
<script src="css/admindash.js"></script>

</body>
</html>
