<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Dashboard Admin — BBCashvia</title>

    <meta name="description"
        content="Dashboard Admin BBCashvia — Sistem kas kelas digital: kelola iuran, transaksi kas, dan laporan keuangan kelas.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet">

    <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet">

    @vite([
        'resources/css/admin-dashboard.css',
        'resources/js/admin-dashboard.js'
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

                <a href="/dashboard/admin" class="side-link is-active" aria-current="page">
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

                <a href="/admin/laporan-kas" class="side-link">
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

                <button
                    type="button"
                    class="topbar__burger"
                    id="sidebarToggle"
                    aria-label="Buka menu navigasi">

                    <span class="material-symbols-outlined" aria-hidden="true">menu</span>

                </button>

                <div class="topbar__title">
                    <h1>Dashboard</h1>
                    <p id="topbarDate">—</p>
                </div>

            </div>


            <div class="topbar__right">

                <span class="topbar__chip">
                    <span class="material-symbols-outlined" aria-hidden="true">calendar_month</span>
                    TA 2026/2027 • Ganjil
                </span>


                <div class="topbar__profilewrap">

                    <button
                        type="button"
                        class="topbar__profile"
                        id="profileBtn"
                        aria-haspopup="true"
                        aria-expanded="false">

                        <span class="topbar__avatar" aria-hidden="true">AN</span>

                        <span class="topbar__profileinfo">
                            <span class="topbar__profilename">Azis N.</span>
                            <span class="topbar__profilerole">Admin</span>
                        </span>

                        <span
                            class="material-symbols-outlined topbar__chevron"
                            aria-hidden="true">
                            expand_more
                        </span>

                    </button>


                    <div class="dropdown" id="profileMenu" role="menu">

                        <div class="dropdown__head">
                            <span class="dropdown__name">Azis N.</span>
                            <span class="dropdown__mail">azinun@bbcashvia.sch.id</span>
                        </div>

                        <a
                            href="/"
                            class="dropdown__item dropdown__item--danger"
                            role="menuitem">

                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                logout
                            </span>

                            <span>Keluar</span>

                        </a>

                    </div>

                </div>

            </div>

        </header>


        <!-- ===== KONTEN ===== -->
        <main class="content">

            <!-- ===== SAPAAN / HERO ===== -->
            <section class="hero">

                <div class="hero__text">

                    <p class="hero__eyebrow">
                        Panel Admin • Kas Kelas
                    </p>

                    <h2 class="hero__title">
                        <span id="greeting">Selamat datang</span>, Azis
                    </h2>

                    <p class="hero__sub">
                        Pantau kondisi kas kelas, iuran, dan seluruh transaksi dalam satu tempat.
                    </p>

                </div>


                <div class="hero__actions">

                    <a href="/admin/transaksi" class="btn btn--primary">
                        <span
                            class="material-symbols-outlined"
                            aria-hidden="true">
                            post_add
                        </span>

                        <span>Catat Transaksi</span>
                    </a>

                    <a href="/admin/iuran" class="btn btn--ghost">
                        <span
                            class="material-symbols-outlined"
                            aria-hidden="true">
                            sell
                        </span>

                        <span>Kelola Iuran</span>
                    </a>

                </div>

            </section>


            <!-- ===== 6 KARTU RINGKASAN ===== -->
            <section
                class="stat-grid"
                aria-label="Ringkasan angka penting">

                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>
                            <p class="stat-card__label">Total Kas</p>
                            <p class="stat-card__value" id="kpiTotalKas">—</p>
                        </div>

                        <span class="stat-card__icon stat-card__icon--kas">
                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                account_balance_wallet
                            </span>
                        </span>

                    </div>

                    <p class="stat-card__foot">
                        Saldo kas kelas saat ini
                    </p>

                </article>


                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>
                            <p class="stat-card__label">Total Pemasukan</p>
                            <p class="stat-card__value" id="kpiPemasukan">—</p>
                        </div>

                        <span class="stat-card__icon stat-card__icon--in">
                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                south_west
                            </span>
                        </span>

                    </div>

                    <p class="stat-card__foot">

                        <span class="stat-card__trend stat-card__trend--up">
                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                trending_up
                            </span>

                            +18%
                        </span>

                        dibanding bulan lalu

                    </p>

                </article>


                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>
                            <p class="stat-card__label">Total Pengeluaran</p>
                            <p class="stat-card__value" id="kpiPengeluaran">—</p>
                        </div>

                        <span class="stat-card__icon stat-card__icon--out">
                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                north_east
                            </span>
                        </span>

                    </div>

                    <p class="stat-card__foot">

                        <span class="stat-card__trend stat-card__trend--down">
                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                trending_down
                            </span>

                            −6%
                        </span>

                        dibanding bulan lalu

                    </p>

                </article>


                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>
                            <p class="stat-card__label">Total Iuran</p>
                            <p class="stat-card__value" id="kpiIuran">—</p>
                        </div>

                        <span class="stat-card__icon stat-card__icon--iuran">
                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                sell
                            </span>
                        </span>

                    </div>

                    <div class="stat-card__foot">

                        <div
                            class="stat-card__progress"
                            role="img"
                            aria-label="Progres iuran 87 persen">

                            <span
                                id="kpiIuranBar"
                                style="width:0%">
                            </span>

                        </div>

                        <p
                            class="stat-card__progressmeta"
                            id="kpiIuranMeta">
                            —
                        </p>

                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>
                            <p class="stat-card__label">Jumlah Siswa</p>
                            <p class="stat-card__value" id="kpiSiswa">—</p>
                        </div>

                        <span class="stat-card__icon stat-card__icon--siswa">
                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                school
                            </span>
                        </span>

                    </div>

                    <p
                        class="stat-card__foot"
                        id="kpiSiswaMeta">
                        —
                    </p>

                </article>


                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>
                            <p class="stat-card__label">Total Transaksi</p>
                            <p class="stat-card__value" id="kpiTransaksi">—</p>
                        </div>

                        <span class="stat-card__icon stat-card__icon--trx">
                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                receipt_long
                            </span>
                        </span>

                    </div>

                    <p
                        class="stat-card__foot"
                        id="kpiTrxMeta">
                        —
                    </p>

                </article>

            </section>


            <!-- ===== RINGKASAN KAS (RUMUS) ===== -->
            <section
                class="panel panel--ringkasan"
                aria-label="Ringkasan kas">

                <div class="panel__head">

                    <div>

                        <p class="panel__eyebrow">
                            Buku Kas
                        </p>

                        <h3 class="panel__title">
                            Ringkasan Kas
                        </h3>

                        <p class="panel__sub">
                            Perhitungan saldo dari awal periode hingga hari ini.
                        </p>

                    </div>

                </div>


                <div class="rumus">

                    <div class="rumus__item">

                        <p class="rumus__label">
                            Saldo Awal
                        </p>

                        <p
                            class="rumus__value"
                            id="rumusAwal">
                            —
                        </p>

                    </div>


                    <span
                        class="rumus__operator"
                        aria-hidden="true">
                        +
                    </span>


                    <div class="rumus__item">

                        <p class="rumus__label">
                            Total Pemasukan
                        </p>

                        <p
                            class="rumus__value rumus__value--in"
                            id="rumusMasuk">
                            —
                        </p>

                    </div>


                    <span
                        class="rumus__operator"
                        aria-hidden="true">
                        −
                    </span>


                    <div class="rumus__item">

                        <p class="rumus__label">
                            Total Pengeluaran
                        </p>

                        <p
                            class="rumus__value rumus__value--out"
                            id="rumusKeluar">
                            —
                        </p>

                    </div>


                    <span
                        class="rumus__operator rumus__operator--sama"
                        aria-hidden="true">
                        =
                    </span>


                    <div class="rumus__item rumus__item--hasil">

                        <p class="rumus__label">
                            Saldo Saat Ini
                        </p>

                        <p
                            class="rumus__value"
                            id="rumusSekarang">
                            —
                        </p>

                    </div>

                </div>

            </section>


            <!-- ===== GRAFIK + TRANSAKSI TERBARU ===== -->
            <div class="duo">

                <section
                    class="panel panel--chart"
                    aria-label="Grafik kas">

                    <div class="panel__head">

                        <div>

                            <p class="panel__eyebrow">
                                Grafik
                            </p>

                            <h3 class="panel__title">
                                Arus Kas 6 Bulan Terakhir
                            </h3>

                        </div>

                    </div>


                    <div
                        class="chart-tabs"
                        role="tablist"
                        aria-label="Pilihan grafik">

                        <button
                            type="button"
                            class="chart-tab is-active"
                            id="tabBar"
                            role="tab"
                            aria-selected="true"
                            aria-controls="barChart">

                            Pemasukan vs Pengeluaran

                        </button>


                        <button
                            type="button"
                            class="chart-tab"
                            id="tabLine"
                            role="tab"
                            aria-selected="false"
                            aria-controls="lineChart">

                            Perkembangan Saldo

                        </button>

                    </div>


                    <div
                        id="barChart"
                        class="chart-view"
                        role="tabpanel"
                        aria-labelledby="tabBar">
                    </div>


                    <div
                        id="lineChart"
                        class="chart-view is-hidden"
                        role="tabpanel"
                        aria-labelledby="tabLine">
                    </div>


                    <div class="chart-legend">

                        <span
                            class="chart-legend__item"
                            id="legendBar1">

                            <i class="dot dot--in"></i>
                            Pemasukan

                        </span>


                        <span
                            class="chart-legend__item"
                            id="legendBar2">

                            <i class="dot dot--out"></i>
                            Pengeluaran

                        </span>


                        <span
                            class="chart-legend__item is-hidden"
                            id="legendLine">

                            <i class="dot dot--primary"></i>
                            Saldo akhir bulan

                        </span>

                    </div>

                </section>


                <section
                    class="panel panel--table"
                    aria-label="Transaksi terbaru">

                    <div class="panel__head">

                        <div>

                            <p class="panel__eyebrow">
                                Aktivitas Terbaru
                            </p>

                            <h3 class="panel__title">
                                Transaksi Terbaru
                            </h3>

                        </div>


                        <a
                            href="/admin/riwayat-transaksi"
                            class="panel__link">

                            Lihat Semua

                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">
                                arrow_forward
                            </span>

                        </a>

                    </div>


                    <div class="table-wrap">

                        <table class="table">

                            <thead>

                                <tr>
                                    <th>ID Transaksi</th>
                                    <th>Keterangan</th>
                                    <th>Kategori</th>
                                    <th>Tanggal</th>
                                    <th>Nominal</th>
                                    <th>Status</th>
                                </tr>

                            </thead>


                            <tbody id="recentTxBody">

                                <tr>
                                    <td
                                        colspan="6"
                                        class="table__empty">
                                        Memuat data…
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                    </div>

                </section>

            </div>


            <footer class="content__foot">

                BBCashvia — Kas Kelas Digital • Data yang tampil merupakan data simulasi untuk pengembangan tampilan.

            </footer>

        </main>

    </div>

</body>

</html>
