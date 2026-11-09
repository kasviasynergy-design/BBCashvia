<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Dashboard Viewer - BBCashvia</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
        rel="stylesheet"
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400..700,0..1,0"
        rel="stylesheet"
    >

    @vite([
        'resources/css/viewer-dashboard.css',
        'resources/js/viewer-dashboard.js',
        'resources/js/tagihan-pribadi.js',
        'resources/css/konfirmasi-logout.css',
        'resources/js/konfirmasi-logout.js'
    ])
    <style>
        /*! tailwindcss v4.0.7 | MIT License | https://tailwin
css.com */@layer theme{:root,:host{--primary:#2BA19E;--primary-dark:#237A77;--primary-soft:#D4F1F9;--success:#2BA19E;--success-soft:#D4F1F9;--warning:#F4D98E;--warning-soft:#F4D98E;--bg:#FFFDFF;--surface:#FFFFFF;--surface-soft:#D4F1F9;--border:#A5DBE3;--sidebar-active:#D4F1F9;--sidebar-active-text:#2BA19E;}}
    </style>
</head>

<body data-kelas-label="{{ auth()->user()->labelKelas() }}">

<div class="app-shell">

    {{-- =========================================================
         SIDEBAR BACKDROP
         ========================================================= --}}
    <div
        class="sidebar-backdrop"
        id="sidebarBackdrop"
        aria-hidden="true"
    ></div>


    {{-- =========================================================
         SIDEBAR
         ========================================================= --}}
    <aside class="sidebar" id="sidebar">

        {{-- BRAND --}}
        <div class="sidebar__brand">

            <div class="sidebar__logo">

                <img
                    src="{{ asset('build/assets/image/Logo BBCashvia.png') }}"
                    alt="Logo BBCashvia"
                    class="sidebar__logo-img"
                >

            </div>

            <div class="sidebar__brandtext">
                <span class="sidebar__brandname">BBCashvia</span>
                <span class="sidebar__brandsub">Kas Kelas Digital</span>
            </div>

        </div>


        {{-- NAVIGATION --}}
        <nav class="sidebar-nav">

            {{-- MENU UTAMA --}}
            <div class="nav-section">

                <div class="nav-section-title">
                    MENU UTAMA
                </div>

                <a
                    href="/dashboard/viewer"
                    class="nav-link is-active"
                >
                    <span class="material-symbols-outlined">
                        dashboard
                    </span>

                    <span>
                        Dashboard
                    </span>
                </a>

            </div>

            {{-- DATA & IURAN --}}
            <div class="nav-section">

                <div class="nav-section-title">
                    DATA & IURAN
                </div>

                <a
                    href="/viewer/siswa"
                    class="nav-link"
                >
                    <span class="material-symbols-outlined">
                        groups
                    </span>

                    <span>
                        Siswa
                    </span>
                </a>

                <a
                    href="/viewer/iuran"
                    class="nav-link"
                >
                    <span class="material-symbols-outlined">
                        receipt_long
                    </span>

                    <span>
                        Iuran
                    </span>
                </a>

            </div>

            {{-- TRANSAKSI --}}
            <div class="nav-section">

                <div class="nav-section-title">
                    TRANSAKSI
                </div>

                <a
                    href="/viewer/transaksi"
                    class="nav-link"
                >
                    <span class="material-symbols-outlined">
                        payments
                    </span>

                    <span>
                        Transaksi
                    </span>
                </a>

            </div>

            {{-- LAPORAN --}}
            <div class="nav-section">

                <div class="nav-section-title">
                    LAPORAN
                </div>

                <a
                    href="/viewer/laporan-kas"
                    class="nav-link"
                >
                    <span class="material-symbols-outlined">
                        monitoring
                    </span>

                    <span>
                        Laporan Kas
                    </span>
                </a>

            </div>

        </nav>

        {{-- =================================================
             SIDEBAR FOOTER
         ================================================== --}}
        <div class="sidebar-footer">

            <div class="sidebar-user">

                <div class="user-avatar">
                    {{ strtoupper(mb_substr(auth()->user()->name ?? 'U', 0, 2)) }}
                </div>

                <div class="user-info">

                    <span class="sidebar__username">
                        {{ auth()->user()->name ?? 'Pengguna' }}
                    </span>

                    <span class="sidebar__userrole">
                        Viewer • {{ auth()->user()->labelKelas() }}
                    </span>

                </div>

            </div>

            <button
                type="button"
                class="logout-button"
                id="logoutButton"
            >
                <span class="material-symbols-outlined">
                    logout
                </span>

                <span>
                    Keluar
                </span>
            </button>

        </div>

    </aside>


    {{-- =====================================================
         MAIN AREA
     ====================================================== --}}
    <div class="main-area">

        {{-- =================================================
             TOPBAR
         ================================================== --}}
        <header class="topbar">

            <div class="topbar-left">

                <button
                    type="button"
                    class="menu-toggle"
                    id="menuToggle"
                    aria-label="Buka menu"
                >
                    <span class="material-symbols-outlined">
                        menu
                    </span>
                </button>

                <div class="page-heading">
                    <span>Dashboard</span>
                    <strong id="currentDate">Memuat tanggal...</strong>
                </div>

            </div>

            <div class="topbar-right">

                <div class="academic-chip">

                    <span class="material-symbols-outlined">
                        school
                    </span>

                    <span>
                        {{ auth()->user()->labelKelas() }}
                    </span>

                </div>

                <div class="profile-wrapper">

                    <button
                        type="button"
                        class="profile-button"
                        id="profileButton"
                    >


                        <div class="profile-avatar">
                            {{ strtoupper(mb_substr(auth()->user()->name ?? 'U', 0, 2)) }}
                        </div>

                        <div class="profile-text">
                            <strong>{{ auth()->user()->name ?? 'Pengguna' }}</strong>
                            <span>Viewer • {{ auth()->user()->labelKelas() }}</span>
                        </div>

                        <span class="material-symbols-outlined profile-arrow">
                            expand_more
                        </span>
                    </button>

                    <div
                        class="profile-dropdown"
                        id="profileDropdown"
                    >


                        <div class="profile-dropdown-head">

                            <div class="profile-avatar large">
                                {{ strtoupper(mb_substr(auth()->user()->name ?? 'U', 0, 2)) }}
                            </div>

                            <div>
                                <strong>{{ auth()->user()->name ?? 'Pengguna' }}</strong>
                                <span>Viewer • {{ auth()->user()->labelKelas() }}</span>
                                <span>{{ auth()->user()->email ?? '-' }}</span>
                            </div>

                        </div>


                        <button
                            type="button"
                            id="dropdownLogout"
                            class="dropdown-logout"
                        >
                            <span class="material-symbols-outlined">
                                logout
                            </span>

                            Keluar
                        </button>

                    </div>

                </div>

            </div>

        </header>

        {{-- =================================================
             CONTENT
         ================================================== --}}
        <main class="content">

        @include('partials.kelas-belum-ditetapkan')


        {{-- =================================================
             HERO
             ================================================= --}}
        <section class="hero" aria-label="Panel Viewer">

            <div class="hero__text">

                <nav class="hero__eyebrow breadcrumb" aria-label="Breadcrumb">
                    <span aria-current="page">Beranda</span>
                </nav>

                <h2 class="hero__title">
                    Selamat datang, {{ auth()->user()->name ?? 'Pengguna' }} 👋
                </h2>

                <p class="hero__sub">
                    Pantau saldo kas, pembayaran iuran, dan aktivitas
                    transaksi kelas secara terbuka dari database.
                </p>

            </div>


            <div class="hero__actions">

                <a
                    href="/viewer/iuran"
                    class="btn btn--primary"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        receipt_long
                    </span>

                    <span>Lihat Iuran</span>
                </a>

                <a
                    href="/viewer/laporan-kas"
                    class="btn btn--ghost"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        assessment
                    </span>

                    <span>Laporan Kas</span>
                </a>

            </div>

        </section>


        {{-- =================================================
             STATISTICS
             ================================================= --}}
        <section class="stat-grid stat-grid--kpi">


            {{-- TOTAL KAS --}}
            <article class="stat-card">


                <div class="stat-card__top">

                    <div>
                        <p class="stat-card__label">Total Kas</p>
                        <p class="stat-card__value" id="statSaldo">Rp 0</p>
                    </div>

                    <span class="stat-card__icon stat-card__icon--kas">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            account_balance_wallet
                        </span>
                    </span>

                </div>

                <div class="stat-card__foot">
                    Saldo kas saat ini
                </div>
            </article>


            {{-- TOTAL PEMASUKAN --}}
            <article class="stat-card">


                <div class="stat-card__top">

                    <div>
                        <p class="stat-card__label">Total Pemasukan</p>
                        <p class="stat-card__value" id="statPemasukan">Rp 0</p>
                    </div>

                    <span class="stat-card__icon stat-card__icon--in">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            trending_up
                        </span>
                    </span>

                </div>

                <div class="stat-card__foot">

                    <span class="stat-card__trend stat-card__trend--up">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            arrow_upward
                        </span>

                        Kas masuk
                    </span>
                </div>
            </article>


            {{-- TOTAL IURAN --}}
            <article class="stat-card">


                <div class="stat-card__top">

                    <div>
                        <p class="stat-card__label">Total Iuran</p>
                        <p class="stat-card__value" id="statIuran">Rp 0</p>
                    </div>

                    <span class="stat-card__icon stat-card__icon--iuran">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            receipt_long
                        </span>
                    </span>

                </div>

                <p class="stat-card__foot" id="statIuranMeta">
                    -
                </p>
            </article>


            {{-- BELUM LUNAS --}}
            <article class="stat-card">


                <div class="stat-card__top">

                    <div>
                        <p class="stat-card__label">Siswa Belum Lunas</p>
                        <p class="stat-card__value" id="statBelumLunas">0 siswa</p>
                    </div>

                    <span class="stat-card__icon stat-card__icon--out">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            pending_actions
                        </span>
                    </span>

                </div>

                <div class="stat-card__foot">
                    Perlu ditindaklanjuti
                </div>
            </article>


            {{-- TOTAL TRANSAKSI --}}
            <article class="stat-card">


                <div class="stat-card__top">

                    <div>
                        <p class="stat-card__label">Total Transaksi</p>
                        <p class="stat-card__value" id="statTransaksi">0 transaksi</p>
                    </div>

                    <span class="stat-card__icon stat-card__icon--trx">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            payments
                        </span>
                    </span>

                </div>

                <div class="stat-card__foot">

                    <span class="stat-card__trend">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            today
                        </span>

                        <span id="statHariIni">0</span>&nbsp;transaksi hari ini
                    </span>
                </div>
            </article>

        </section>


        {{-- =================================================
             RINGKASAN KAS
             ================================================= --}}
        <section class="panel panel--ringkasan">


            <div class="panel__head">


                <div>


                    <div class="panel__eyebrow">
                        Ringkasan Keuangan
                    </div>

                    <div class="panel__title">
                        Posisi Kas - {{ auth()->user()->labelKelas() }}
                    </div>

                    <div class="panel__sub">
                        Perhitungan saldo kas berdasarkan transaksi yang tercatat
                        di database.
                    </div>

                </div>

                <a
                    href="/viewer/laporan-kas"
                    class="panel__link"
                >
                    Laporan Kas

                    <span class="material-symbols-outlined">
                        arrow_forward
                    </span>
                </a>

            </div>


            <div class="rumus">


                <div class="rumus__item">


                    <div class="rumus__label">
                        Total Pemasukan
                    </div>

                    <div
                        class="rumus__value rumus__value--in"
                        id="kasPemasukan"
                    >
                        Rp 0
                    </div>

                </div>


                <div class="rumus__operator">
                    −
                </div>


                <div class="rumus__item">


                    <div class="rumus__label">
                        Total Pengeluaran
                    </div>

                    <div
                        class="rumus__value rumus__value--out"
                        id="kasPengeluaran"
                    >
                        Rp 0
                    </div>

                </div>


                <div class="rumus__operator rumus__operator--sama">
                    =
                </div>


                <div class="rumus__item rumus__item--hasil">


                    <div class="rumus__label">
                        Saldo Saat Ini
                    </div>

                    <div
                        class="rumus__value"
                        id="kasSaldoSaatIni"
                    >
                        Rp 0
                    </div>

                </div>

            </div>

        </section>


        @include('partials.tagihan-pribadi')


        {{-- =================================================
             DUO
             ================================================= --}}
        <section class="duo">


            {{-- GRAFIK --}}
            <article class="panel">


                <div class="panel__head">


                    <div>


                        <div class="panel__eyebrow">
                            Arus Kas
                        </div>

                        <div class="panel__title">
                            Pemasukan &amp; Pengeluaran
                        </div>

                        <div class="panel__sub">
                            Pergerakan kas {{ auth()->user()->labelKelas() }} beberapa
                            bulan terakhir.
                        </div>

                    </div>

                </div>


                <div class="chart-tabs">


                    <button
                        type="button"
                        class="chart-tab active"
                        data-chart="bar"
                    >
                        Pemasukan vs Pengeluaran
                    </button>

                    <button
                        type="button"
                        class="chart-tab"
                        data-chart="line"
                    >
                        Perkembangan Saldo
                    </button>

                </div>


                <div
                    class="chart-view active"
                    id="barChart"
                ></div>


                <div
                    class="chart-view"
                    id="lineChart"
                ></div>


                <div class="chart-legend">


                    <div class="chart-legend__item">


                        <span class="chart-legend__dot chart-legend__dot--in"></span>

                        Pemasukan

                    </div>


                    <div class="chart-legend__item">


                        <span class="chart-legend__dot chart-legend__dot--out"></span>

                        Pengeluaran

                    </div>

                </div>

            </article>


            {{-- RINGKASAN IURAN --}}
            <article class="panel">


                <div class="panel__head">


                    <div>


                        <div class="panel__eyebrow">
                            Monitoring Iuran
                        </div>

                        <div class="panel__title">
                            Status Pembayaran - {{ auth()->user()->labelKelas() }}
                        </div>

                        <div class="panel__sub">
                            Ringkasan pembayaran iuran siswa
                            {{ auth()->user()->labelKelas() }}.
                        </div>

                    </div>

                    <a
                        href="/viewer/iuran"
                        class="panel__link"
                    >
                        Lihat Iuran

                        <span class="material-symbols-outlined">
                            arrow_forward
                        </span>
                    </a>

                </div>


                <div class="iuran-summary">


                    <div class="iuran-summary__item">


                        <div class="iuran-summary__icon iuran-summary__icon--success">
                            <span class="material-symbols-outlined">
                                check_circle
                            </span>
                        </div>

                        <div class="iuran-summary__content">


                            <span class="iuran-summary__label">
                                Sudah Lunas
                            </span>

                            <strong id="iuranLunasDetail">
                                0 siswa
                            </strong>

                        </div>

                    </div>


                    <div class="iuran-summary__item">


                        <div class="iuran-summary__icon iuran-summary__icon--warning">
                            <span class="material-symbols-outlined">
                                schedule
                            </span>
                        </div>

                        <div class="iuran-summary__content">


                            <span class="iuran-summary__label">
                                Belum Lunas
                            </span>

                            <strong id="iuranBelumLunasDetail">
                                0 siswa
                            </strong>

                        </div>

                    </div>


                    <div class="iuran-progress">

                        <div class="iuran-progress__head">

                            <span>
                                <span id="iuranLunas">0</span>&nbsp;dari
                                <span id="iuranTotal">0</span>&nbsp;siswa sudah membayar
                            </span>

                            <strong id="iuranPercent">
                                0%
                            </strong>

                        </div>

                        <div class="iuran-progress__track">


                            <span
                                id="iuranProgress"
                                style="width: 0%"
                            ></span>
                        </div>

                    </div>

                </div>

            </article>

        </section>


        {{-- =================================================
             TRANSAKSI TERBARU
             ================================================= --}}
        <section
            class="panel panel--table"
            aria-label="Transaksi terbaru">

            <div class="panel__head">

                <div>

                    <div class="panel__eyebrow">
                        Aktivitas Terbaru
                    </div>

                    <div class="panel__title">
                        Transaksi Terbaru
                    </div>

                    <div class="panel__sub">
                        10 transaksi terakhir yang tercatat di database.
                    </div>

                </div>


                <a
                    href="/viewer/riwayat-transaksi"
                    class="panel__link"
                >
                    Lihat Semua

                    <span class="material-symbols-outlined" aria-hidden="true">
                        arrow_forward
                    </span>

                </a>

            </div>


            <div class="table-wrap">

                <table class="table">

                    <thead>

                        <tr>
                            <th>No. Bukti</th>
                            <th>Siswa</th>
                            <th>Keterangan</th>
                            <th>Nominal</th>
                            <th>Jenis</th>
                            <th>Tanggal</th>
                            <th>Status</th>
                        </tr>

                    </thead>


                    <tbody id="transactionTableBody">

                        <tr>
                            <td
                                colspan="7"
                                class="table__empty">
                                Memuat data…
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </section>


        {{-- FOOTER --}}
        <div class="content__foot">
            BBCashvia • KASVIA Synergy • Seluruh data dashboard diambil langsung dari database.
        </div>


        </main>

    </div>

    @include('partials.konfirmasi-logout')
</body>
</html>
