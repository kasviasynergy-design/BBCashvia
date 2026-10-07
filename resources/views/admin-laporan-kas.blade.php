<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Laporan Kas — BBCashvia</title>

    <meta name="description"
        content="Halaman Laporan Kas BBCashvia — pantau arus kas kelas per periode lengkap dengan ringkasan, grafik, buku kas, serta fitur cetak dan ekspor laporan.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet">

    @vite([
        'resources/css/admin-laporan-kas.css',
        'resources/js/admin-laporan-kas.js'
    ])
</head>

<body>

    <!-- ===== BACKDROP SIDEBAR (MOBILE) ===== -->
    <div class="sidebar-backdrop" id="sidebarBackdrop" aria-hidden="true"></div>


    <!-- =====================================================
         SIDEBAR
    ====================================================== -->
    <aside class="sidebar" id="sidebar" aria-label="Navigasi utama">

        <div class="sidebar__brand">
            <div class="sidebar__logo">
                <span class="material-symbols-outlined" aria-hidden="true">account_balance_wallet</span>
            </div>
            <div class="sidebar__brandtext">
                <span class="sidebar__brandname">BBCashvia</span>
                <span class="sidebar__brandsub">Kas Kelas Digital</span>
            </div>
        </div>


        <nav class="sidebar__nav">

            <!-- ===== MENU UTAMA ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Menu Utama
                </div>

                <a href="/dashboard/admin" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">dashboard</span>
                    <span class="side-link__text">Dashboard</span>
                </a>

            </div>


            <!-- ===== KEUANGAN ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Keuangan
                </div>

                <a href="/admin/transaksi" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                    <span class="side-link__text">Transaksi</span>
                </a>

                <a href="/admin/iuran" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">sell</span>
                    <span class="side-link__text">Iuran</span>
                </a>

            </div>


            <!-- ===== DATA ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Data
                </div>

                <a href="/admin/siswa" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">school</span>
                    <span class="side-link__text">Data Siswa</span>
                </a>

            </div>


            <!-- ===== LAPORAN ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Laporan
                </div>

                <a href="/admin/laporan-kas" class="side-link is-active" aria-current="page">
                    <span class="material-symbols-outlined" aria-hidden="true">monitoring</span>
                    <span class="side-link__text">Laporan Kas</span>
                </a>

                <a href="/admin/riwayat-transaksi" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">manage_search</span>
                    <span class="side-link__text">Riwayat Transaksi</span>
                </a>

            </div>


            <!-- ===== MANAJEMEN ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Manajemen
                </div>

                <a href="/admin/manajemen-pengguna" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">admin_panel_settings</span>
                    <span class="side-link__text">Manajemen Pengguna</span>
                </a>

            </div>

        </nav>


        <div class="sidebar__foot">

            <div class="sidebar__user">
                <div class="sidebar__avatar" aria-hidden="true">AN</div>
                <div class="sidebar__userinfo">
                    <span class="sidebar__username">Azis N.</span>
                    <span class="sidebar__userrole">Admin</span>
                </div>
            </div>

            <a href="/" class="sidebar__logout">
                <span class="material-symbols-outlined" aria-hidden="true">logout</span>
                <span>Keluar</span>
            </a>

        </div>

    </aside>


    <!-- =====================================================
         KONTEN UTAMA
    ====================================================== -->
    <div class="shell">

        <!-- ===== TOPBAR ===== -->
        <header class="topbar">

            <div class="topbar__left">

                <button type="button" class="topbar__burger" id="sidebarToggle" aria-label="Buka menu navigasi">
                    <span class="material-symbols-outlined" aria-hidden="true">menu</span>
                </button>

                <div class="topbar__title">
                    <h1>Laporan Kas</h1>
                    <p id="topbarDate">—</p>
                </div>

            </div>


            <div class="topbar__right">

                <span class="topbar__chip">
                    <span class="material-symbols-outlined" aria-hidden="true">calendar_month</span>
                    TA 2026/2027 • Ganjil
                </span>

                <div class="topbar__profilewrap">

                    <button type="button" class="topbar__profile" id="profileBtn" aria-haspopup="true"
                        aria-expanded="false">
                        <span class="topbar__avatar" aria-hidden="true">AN</span>
                        <span class="topbar__profileinfo">
                            <span class="topbar__profilename">Azis N.</span>
                            <span class="topbar__profilerole">Admin</span>
                        </span>
                        <span class="material-symbols-outlined topbar__chevron" aria-hidden="true">expand_more</span>
                    </button>

                    <div class="dropdown" id="profileMenu" role="menu">

                        <div class="dropdown__head">
                            <span class="dropdown__name">Azis N.</span>
                            <span class="dropdown__mail">azinun@bbcashvia.sch.id</span>
                        </div>

                        <a href="/" class="dropdown__item dropdown__item--danger" role="menuitem">
                            <span class="material-symbols-outlined" aria-hidden="true">logout</span>
                            <span>Keluar</span>
                        </a>

                    </div>

                </div>

            </div>

        </header>


        <!-- ===== KONTEN ===== -->
        <main class="content">

            <!-- ===== KEPALA HALAMAN ===== -->
            <section class="page-head">

                <div class="page-head__text">
                    <p class="page-head__eyebrow">Panel Admin • Kas Kelas</p>
                    <h2 class="page-head__title">Laporan Kas</h2>
                    <p class="page-head__sub">
                        Pantau arus kas kelas per periode — ringkasan, grafik arus kas, dan buku kas
                        siap dicetak maupun diekspor.
                    </p>
                </div>

            </section>


            <!-- ===== KOP LAPORAN (HANYA SAAT CETAK) ===== -->
            <div class="print-head" aria-hidden="true">
                <h2>Laporan Kas — BBCashvia</h2>
                <p id="printPeriode">—</p>
            </div>


            <!-- ===== RINGKASAN (MENGIKUTI FILTER) ===== -->
            <section class="sum-grid" aria-label="Ringkasan laporan kas">

                <article class="sum-card sum-card--masuk">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">trending_up</span>
                    </div>
                    <div>
                        <p class="sum-card__label">Total Pemasukan</p>
                        <p class="sum-card__value" id="sumMasuk">—</p>
                        <p class="sum-card__note" id="sumMasukNote">sesuai filter</p>
                    </div>
                </article>

                <article class="sum-card sum-card--keluar">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">trending_down</span>
                    </div>
                    <div>
                        <p class="sum-card__label">Total Pengeluaran</p>
                        <p class="sum-card__value" id="sumKeluar">—</p>
                        <p class="sum-card__note" id="sumKeluarNote">sesuai filter</p>
                    </div>
                </article>

                <article class="sum-card sum-card--saldo">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">account_balance</span>
                    </div>
                    <div>
                        <p class="sum-card__label">Saldo Kas Akhir</p>
                        <p class="sum-card__value" id="sumSaldo">—</p>
                        <p class="sum-card__note" id="sumSaldoNote">saldo awal + pemasukan − pengeluaran</p>
                    </div>
                </article>

                <article class="sum-card sum-card--jumlah">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                    </div>
                    <div>
                        <p class="sum-card__label">Jumlah Transaksi</p>
                        <p class="sum-card__value" id="sumJumlah">—</p>
                        <p class="sum-card__note" id="sumJumlahNote">sesuai filter</p>
                    </div>
                </article>

            </section>


            <!-- ===== PANEL FILTER ===== -->
            <section class="panel filterbar" aria-label="Filter laporan kas">

                <p class="filterbar__caption">Periode Laporan</p>

                <div class="filterbar__selects">

                    <label class="field-select field-select--tanggal">
                        <span class="field-select__label">Dari Tanggal</span>
                        <input type="date" id="filterMulai">
                    </label>

                    <label class="field-select field-select--tanggal">
                        <span class="field-select__label">Sampai Tanggal</span>
                        <input type="date" id="filterSelesai">
                    </label>

                    <label class="field-select">
                        <span class="field-select__label">Bulan</span>
                        <select id="filterBulan">
                            <option value="semua">Semua Bulan</option>
                        </select>
                    </label>

                    <label class="field-select">
                        <span class="field-select__label">Tahun</span>
                        <select id="filterTahun">
                            <option value="semua">Semua Tahun</option>
                        </select>
                    </label>

                </div>

                <p class="filterbar__caption">Jenis &amp; Kategori</p>

                <div class="filterbar__selects">

                    <label class="field-select">
                        <span class="field-select__label">Jenis</span>
                        <select id="filterJenis">
                            <option value="semua">Semua Jenis</option>
                            <option value="masuk">Pemasukan</option>
                            <option value="keluar">Pengeluaran</option>
                        </select>
                    </label>

                    <label class="field-select">
                        <span class="field-select__label">Kategori</span>
                        <select id="filterKategori">
                            <option value="semua">Semua Kategori</option>
                        </select>
                    </label>

                    <button type="button" class="btn btn--ghost btn--sm" id="btnResetFilter">
                        <span class="material-symbols-outlined" aria-hidden="true">restart_alt</span>
                        <span>Reset</span>
                    </button>

                </div>

            </section>


            <!-- ===== GRAFIK ARUS KAS ===== -->
            <section class="panel" aria-label="Grafik arus kas">

                <div class="panel__head">
                    <div>
                        <p class="panel__eyebrow">GRAFIK</p>
                        <h3 class="panel__title">Arus Kas per Bulan</h3>
                        <p class="panel__sub">Pemasukan vs pengeluaran kas kelas — sesuai filter</p>
                    </div>

                    <div class="grafik-legend" aria-hidden="true">
                        <span class="legend-item">
                            <i class="legend-item__dot legend-item__dot--masuk"></i> Pemasukan
                        </span>
                        <span class="legend-item">
                            <i class="legend-item__dot legend-item__dot--keluar"></i> Pengeluaran
                        </span>
                    </div>
                </div>

                <div class="grafik">
                    <div class="bar-chart" id="barChart" role="img" aria-label="Grafik batang arus kas per bulan"></div>
                    <div class="grafik-kosong" id="grafikKosong" hidden>
                        <span class="material-symbols-outlined" aria-hidden="true">bar_chart</span>
                        <p>Tidak ada data untuk grafik — sesuaikan filter periode.</p>
                    </div>
                </div>

            </section>


            <!-- ===== TABEL BUKU KAS ===== -->
            <section class="panel">

                <div class="panel__head">
                    <div>
                        <p class="panel__eyebrow">BUKU KAS</p>
                        <h3 class="panel__title">Laporan Arus Kas</h3>
                        <p class="panel__sub" id="tabelInfo">— transaksi ditampilkan</p>
                    </div>
                </div>

                <div class="table-wrap">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Tanggal</th>
                                <th scope="col">Keterangan</th>
                                <th scope="col">Kategori</th>
                                <th scope="col" class="th-r">Pemasukan</th>
                                <th scope="col" class="th-r">Pengeluaran</th>
                                <th scope="col" class="th-r">Saldo</th>
                            </tr>
                        </thead>
                        <tbody id="isiTabelLaporan"></tbody>
                        <tfoot id="footTabelLaporan"></tfoot>
                    </table>

                    <div class="empty-state" id="emptyState" hidden>
                        <span class="material-symbols-outlined" aria-hidden="true">search_off</span>
                        <p>Tidak ada transaksi yang cocok dengan filter periode.</p>
                        <button type="button" class="btn btn--ghost btn--sm" id="btnKosongkanFilter">
                            Reset Filter
                        </button>
                    </div>
                </div>

            </section>


            <footer class="content__foot">
                BBCashvia — Kas Kelas Digital • Data yang tampil merupakan data simulasi untuk pengembangan tampilan.
            </footer>

        </main>

    </div>


    <!-- ===== TOAST ===== -->
    <div class="toast" id="toast" role="status" aria-live="polite">
        <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
        <span id="toastText">Tersimpan</span>
    </div>


</body>

</html>
