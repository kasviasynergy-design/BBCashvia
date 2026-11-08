<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Laporan Kas - BBCashvia</title>

    <meta name="description"
        content="Laporan keuangan dan status kas kelas pada sistem BBCashvia.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0"
        rel="stylesheet"
    >

    @vite([
        'resources/css/viewer-laporan-kas.css',
        'resources/js/viewer-laporan-kas.js',
        'resources/css/konfirmasi-logout.css',
        'resources/js/konfirmasi-logout.js'
    ])
</head>

<body data-kelas-label="{{ auth()->user()->labelKelas() }}">

    {{-- =====================================================
         SIDEBAR BACKDROP
     ===================================================== --}}
    <div
        class="sidebar-backdrop"
        id="sidebarBackdrop"
    ></div>

    {{-- =====================================================
         SIDEBAR
     ===================================================== --}}
    <aside
        class="sidebar"
        id="sidebar"
    >    {{-- BRAND --}}
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

        {{-- =================================================
             NAVIGATION
         ================================================== --}}
        <nav class="sidebar-nav">

            {{-- MENU UTAMA --}}
            <div class="nav-section">

                <div class="nav-section-title">
                    MENU UTAMA
                </div>

                <a
                    href="/dashboard/viewer"
                    class="nav-link"
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
                    class="nav-link is-active"
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
                    <span>Laporan Kas</span>
                    <strong>Laporan Keuangan</strong>
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
                 PAGE INTRO
             ================================================== --}}
            <section class="page-intro">

                <div>

                    <nav class="page-eyebrow breadcrumb" aria-label="Breadcrumb">
                        <a class="breadcrumb__link" href="/dashboard/viewer">Beranda</a>
                        <span class="breadcrumb__sep" aria-hidden="true">›</span>
                        <span aria-current="page">Laporan Kas</span>
                    </nav>

                    <h1>
                        Laporan Kas
                    </h1>

                    <p>
                        Rekapitulasi pemasukan, pengeluaran, dan saldo kas kelas
                        berdasarkan transaksi yang tercatat.
                    </p>

                </div>

            </section>


            {{-- =================================================
                 CONTENT
             ================================================== --}}
            <section class="page-content">


                {{-- =================================================
                     LAPORAN TRANSAKSI (TABEL + FILTER)
                 ================================================== --}}
                <section class="panel">

                    <div class="panel-header">


                        <div>


                            <span class="panel-eyebrow">
                                REKAP TRANSAKSI
                            </span>

                            <h2>
                                Laporan Transaksi
                            </h2>

                        </div>


                        <div class="panel-count">

                            <span id="tableCount">
                                0
                            </span>
                            transaksi

                        </div>

                    </div>

                    <div class="filter-area">

                        <div class="filter-control">

                            <span class="material-symbols-outlined">
                                calendar_today
                            </span>

                            <select id="periodFilter">
                            </select>

                        </div>

                        <div class="filter-control">

                            <span class="material-symbols-outlined">
                                monitoring
                            </span>

                            <select id="statusFilter">

                                <option value="all">
                                    Pemasukan & Pengeluaran
                                </option>

                                <option value="pemasukan">
                                    Pemasukan
                                </option>

                                <option value="pengeluaran">
                                    Pengeluaran
                                </option>

                            </select>

                        </div>

                    </div>

                    {{-- TABLE --}}
                    <div class="table-wrapper">


                    <table class="data-table">


                        <thead>


                            <tr>


                                <th>No</th>

                                <th>Tanggal</th>

                                <th>Jenis</th>

                                <th>Kategori</th>

                                <th>Keterangan</th>

                                <th>Nominal</th>

                            </tr>

                        </thead>


                        <tbody id="laporanKasTableBody">
                        </tbody>

                    </table>

                </div>

                {{-- =================================================
                     EMPTY STATE
                 ================================================== --}}
                <div
                    class="empty-state"
                    id="emptyState"
                >


                    <div class="empty-icon">


                        <span class="material-symbols-outlined">
                            search_off
                        </span>

                    </div>


                    <strong>
                        Transaksi tidak ditemukan untuk filter ini
                    </strong>


                    <span>
                        Coba pilih periode atau jenis transaksi yang lain.
                    </span>

                </div>

                </section>

                {{-- =================================================
                     SUMMARY / RUMUS
                 ================================================== --}}
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

                {{-- =================================================
                     FOOTER
                 ================================================== --}}
                <footer class="page-footer">


                    <span>
                        BBCashvia
                    </span>

                    <span>
                        ·
                    </span>

                    <span>
                        KASVIA Synergy
                    </span>

                </footer>

            </section>

        </main>

    </div>

    @include('partials.konfirmasi-logout')
</body>
</html>
