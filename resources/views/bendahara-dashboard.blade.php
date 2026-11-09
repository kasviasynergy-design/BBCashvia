<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Dashboard Bendahara - BBCashvia</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
        rel="stylesheet">

    <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400..700,0..1,0"
        rel="stylesheet"
    >

    @vite([
        'resources/css/bendahara-dashboard.css',
        'resources/js/bendahara-dashboard.js',
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
        <nav class="sidebar__nav">

            {{-- MENU UTAMA --}}
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    MENU UTAMA
                </div>

                <a
                    href="/dashboard/bendahara"
                    class="side-link is-active"
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
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    DATA & IURAN
                </div>

                <a
                    href="/bendahara/siswa"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">
                        groups
                    </span>

                    <span>
                        Siswa
                    </span>
                </a>

                <a
                    href="/bendahara/iuran"
                    class="side-link"
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
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    TRANSAKSI
                </div>

                <a
                    href="/bendahara/transaksi"
                    class="side-link"
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
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    LAPORAN
                </div>

                <a
                    href="/bendahara/laporan-kas"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">
                        account_balance
                    </span>

                    <span>
                        Laporan Kas
                    </span>
                </a>

                <a
                    href="/bendahara/riwayat-transaksi"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">
                        history
                    </span>

                    <span>
                        Riwayat Transaksi
                    </span>
                </a>

            </div>

        </nav>


        {{-- SIDEBAR FOOT --}}
        <div class="sidebar__foot">

            <div class="sidebar__user">

                <div class="sidebar__avatar">
                    {{ strtoupper(mb_substr(auth()->user()->name ?? 'U', 0, 2)) }}
                </div>

                <div class="sidebar__userinfo">

                    <span class="sidebar__username">
                        {{ auth()->user()->name ?? 'Pengguna' }}
                    </span>

                    <span class="sidebar__userrole">
                        Bendahara • {{ auth()->user()->labelKelas() }}
                    </span>

                </div>

            </div>

            <button
                type="button"
                class="sidebar__logout"
                id="sidebarLogout"
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


    {{-- =========================================================
         MAIN SHELL
         ===================================================== --}}
    <div class="shell">


        {{-- =====================================================
             TOPBAR
             ===================================================== --}}
        <header class="topbar">

            <div class="topbar__left">

                <button
                    type="button"
                    class="topbar__burger"
                    id="sidebarToggle"
                    aria-label="Buka menu"
                    aria-expanded="false"
                >
                    <span class="material-symbols-outlined">
                        menu
                    </span>
                </button>


                <div class="topbar__title">

                    <h1>
                        Dashboard
                    </h1>

                    <p id="currentDate">
                        Memuat tanggal...
                    </p>

                </div>

            </div>


            <div class="topbar__right">

                <div class="topbar__chip">

                    <span class="material-symbols-outlined">
                        calendar_month
                    </span>

                    <span>
                        TA 2026/2027 • Ganjil
                    </span>

                </div>


                {{-- PROFILE --}}
                <div class="topbar__profilewrap">

                    <button
                        type="button"
                        class="topbar__profile"
                        id="profileButton"
                        aria-expanded="false"
                    >


                        <div class="topbar__avatar">
                            {{ strtoupper(mb_substr(auth()->user()->name ?? 'U', 0, 2)) }}
                        </div>

                        <div class="topbar__profileinfo">

                            <span class="topbar__profilename">
                                {{ auth()->user()->name ?? 'Pengguna' }}
                            </span>

                            <span class="topbar__profilerole">
                                Bendahara • {{ auth()->user()->labelKelas() }}
                            </span>

                        </div>

                        <span class="material-symbols-outlined topbar__chevron">
                            expand_more
                        </span>

                    </button>


                    {{-- PROFILE DROPDOWN --}}
                    <div
                        class="dropdown"
                        id="profileDropdown"
                    >


                        <div class="dropdown__head">

                            <span class="dropdown__name">
                                {{ auth()->user()->name ?? 'Pengguna' }}
                            </span>

                            <span class="dropdown__mail">
                                Bendahara • {{ auth()->user()->labelKelas() }}
                            </span>

                            <span class="dropdown__mail">
                                {{ auth()->user()->email ?? '-' }}
                            </span>

                        </div>


                        <button
                            type="button"
                            class="dropdown__item dropdown__item--danger"
                            id="dropdownLogout"
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


        {{-- =====================================================
             CONTENT
             ===================================================== --}}
        <main class="content">


        @include('partials.kelas-belum-ditetapkan')


            {{-- =================================================
                 HERO
                 ================================================= --}}
            {{-- SAPAAN / HERO --}}
            <section class="hero" aria-label="Panel Bendahara">

                <div class="hero__text">

                    <nav class="hero__eyebrow breadcrumb" aria-label="Breadcrumb">
                        <span aria-current="page">Beranda</span>
                    </nav>

                    <h2 class="hero__title">
                        Selamat datang, {{ auth()->user()->name ?? 'Pengguna' }} 👋
                    </h2>

                    <p class="hero__sub">
                        Kelola pembayaran, iuran, transaksi, dan kondisi
                        kas kelas dalam satu tempat.
                    </p>

                </div>


                <div class="hero__actions">

                    <a
                        href="/bendahara/transaksi"
                        class="btn btn--primary"
                    >
                        <span class="material-symbols-outlined" aria-hidden="true">
                            add_card
                        </span>

                        <span>Catat Transaksi</span>
                    </a>

                    <a
                        href="/bendahara/iuran"
                        class="btn btn--ghost"
                    >
                        <span class="material-symbols-outlined" aria-hidden="true">
                            receipt_long
                        </span>

                        <span>Lihat Iuran</span>
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
                        Seluruh transaksi tercatat
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
                            Perhitungan saldo kas berdasarkan transaksi yang tercatat.
                        </div>

                    </div>

                    <a
                        href="/bendahara/laporan-kas"
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
                            id="rumusPemasukan"
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
                            id="rumusPengeluaran"
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
                            id="rumusSaldo"
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
                                Pemasukan & Pengeluaran
                            </div>

                            <div class="panel__sub">
                                Pergerakan kas {{ auth()->user()->labelKelas() }} beberapa bulan terakhir.
                            </div>

                        </div>

                    </div>


                    <div class="chart-tabs">


                        <button
                            type="button"
                            class="chart-tab is-active"
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
                        class="chart-view"
                        id="barChart"
                    ></div>


                    <div
                        class="chart-view is-hidden"
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
                                Ringkasan pembayaran iuran siswa {{ auth()->user()->labelKelas() }}.
                            </div>

                        </div>

                        <a
                            href="/bendahara/iuran"
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

                                <strong id="iuranLunas">
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

                                <strong id="iuranBelumLunas">
                                    0 siswa
                                </strong>

                            </div>

                        </div>


                        <div class="iuran-progress">

                            <div class="iuran-progress__head">

                                <span>
                                    Progress pembayaran
                                </span>

                                <strong id="iuranProgressText">
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
                        href="/bendahara/riwayat-transaksi"
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


                        <tbody id="transactionTable">

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

</div>

@include('partials.konfirmasi-logout')
</body>
</html>
