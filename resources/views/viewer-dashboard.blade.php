<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Dashboard Viewer | BBCashvia</title>

    <meta
        name="description"
        content="Dashboard Viewer kas kelas BBCashvia."
    >

    {{-- =====================================================
         FONT
    ====================================================== --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
        rel="stylesheet"
    >

    {{-- =====================================================
         MATERIAL SYMBOLS
    ====================================================== --}}
    <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0"
        rel="stylesheet"
    >

    @vite([
        'resources/css/viewer-dashboard.css',
        'resources/js/viewer-dashboard.js'
    ])
</head>

<body>

    <div class="app-shell">

        {{-- =================================================
             SIDEBAR BACKDROP
        ================================================== --}}
        <div
            class="sidebar-backdrop"
            id="sidebarBackdrop"
        ></div>


        {{-- =================================================
             SIDEBAR
        ================================================== --}}
        <aside
            class="sidebar"
            id="sidebar"
        >

            {{-- BRAND --}}
            <div class="sidebar-brand">

                <div class="brand-icon">
                    <span class="material-symbols-outlined">
                        account_balance_wallet
                    </span>
                </div>

                <div class="brand-text">
                    <strong>BBCashvia</strong>
                    <span>Kas Kelas Digital</span>
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
                        class="nav-link active"
                    >
                        <span class="material-symbols-outlined">
                            dashboard
                        </span>

                        <span>Dashboard</span>
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

                        <span>Siswa</span>
                    </a>

                    <a
                        href="/viewer/iuran"
                        class="nav-link"
                    >
                        <span class="material-symbols-outlined">
                            receipt_long
                        </span>

                        <span>Iuran</span>
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

                        <span>Transaksi</span>
                    </a>

                    <a
                        href="/viewer/riwayat-transaksi"
                        class="nav-link"
                    >
                        <span class="material-symbols-outlined">
                            history
                        </span>

                        <span>Riwayat Transaksi</span>
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

                        <span>Laporan Kas</span>
                    </a>

                </div>

            </nav>


            {{-- SIDEBAR USER --}}
            <div class="sidebar-footer">

                <div class="sidebar-user">

                    <div class="user-avatar">
                        AR
                    </div>

                    <div class="user-info">
                        <strong>Andi Ramadhan</strong>
                        <span>Viewer • XI RPL 1</span>
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

                    <span>Keluar</span>
                </button>

            </div>

        </aside>


        {{-- =================================================
             MAIN AREA
        ================================================== --}}
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
                        <strong>Dashboard</strong>
                        <span id="currentDate"></span>
                    </div>

                </div>


                <div class="topbar-right">

                    <div class="academic-chip">
                        TA 2026/2027 • Ganjil
                    </div>


                    {{-- PROFILE --}}
                    <div class="profile-wrapper">

                        <button
                            type="button"
                            class="profile-button"
                            id="profileButton"
                        >

                            <div class="profile-avatar">
                                AR
                            </div>

                            <div class="profile-text">
                                <strong>Andi Ramadhan</strong>
                                <span>Viewer</span>
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
                                    AR
                                </div>

                                <div>
                                    <strong>Andi Ramadhan</strong>
                                    <span>andi@example.com</span>
                                </div>

                            </div>

                            <div class="profile-dropdown-divider"></div>

                            <button
                                type="button"
                                class="dropdown-item"
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


            {{-- =================================================
                 CONTENT
            ================================================== --}}
            <main class="content">


                {{-- =================================================
                     HERO
                ================================================== --}}
                <section class="hero-card">

                    <div class="hero-content">

                        <div class="hero-eyebrow">
                            <span class="material-symbols-outlined">
                                visibility
                            </span>

                            Panel Viewer • Kas Kelas
                        </div>

                        <h1>
                            Selamat datang, Andi Ramadhan 👋
                        </h1>

                        <p class="hero-subtitle">
                            Viewer Kelas XI RPL 1 • 36 Siswa
                        </p>

                        <p class="hero-description">
                            Pantau informasi kas, iuran, transaksi,
                            dan kondisi keuangan kelas dalam satu tempat.
                        </p>

                        <div class="hero-actions">

                            <a
                                href="/viewer/iuran"
                                class="btn btn-primary"
                            >
                                <span class="material-symbols-outlined">
                                    receipt_long
                                </span>

                                Lihat Iuran
                            </a>

                            <a
                                href="/viewer/laporan-kas"
                                class="btn btn-ghost"
                            >
                                <span class="material-symbols-outlined">
                                    monitoring
                                </span>

                                Lihat Laporan Kas
                            </a>

                        </div>

                    </div>


                    <div class="hero-decoration">

                        <span class="material-symbols-outlined">
                            account_balance
                        </span>

                    </div>

                </section>


                {{-- =================================================
                     STATISTICS
                ================================================== --}}
                <section class="stats-grid">


                    {{-- TOTAL KAS --}}
                    <div class="stat-card">

                        <div class="stat-card-top">

                            <div class="stat-icon blue">
                                <span class="material-symbols-outlined">
                                    account_balance_wallet
                                </span>
                            </div>

                        </div>

                        <div class="stat-label">
                            Total Kas
                        </div>

                        <div
                            class="stat-value"
                            id="statSaldo"
                        >
                            Rp0
                        </div>

                        <div class="stat-meta">
                            Saldo kas kelas saat ini
                        </div>

                    </div>


                    {{-- PEMASUKAN --}}
                    <div class="stat-card">

                        <div class="stat-card-top">

                            <div class="stat-icon green">
                                <span class="material-symbols-outlined">
                                    trending_up
                                </span>
                            </div>

                        </div>

                        <div class="stat-label">
                            Total Pemasukan
                        </div>

                        <div
                            class="stat-value"
                            id="statPemasukan"
                        >
                            Rp0
                        </div>

                        <div class="stat-meta">
                            Akumulasi pemasukan
                        </div>

                    </div>


                    {{-- IURAN --}}
                    <div class="stat-card">

                        <div class="stat-card-top">

                            <div class="stat-icon purple">
                                <span class="material-symbols-outlined">
                                    receipt_long
                                </span>
                            </div>

                        </div>

                        <div class="stat-label">
                            Total Iuran
                        </div>

                        <div
                            class="stat-value"
                            id="statIuran"
                        >
                            Rp0
                        </div>

                        <div
                            class="stat-meta"
                            id="statIuranMeta"
                        >
                            -
                        </div>

                    </div>


                    {{-- BELUM LUNAS --}}
                    <div class="stat-card">

                        <div class="stat-card-top">

                            <div class="stat-icon orange">
                                <span class="material-symbols-outlined">
                                    pending_actions
                                </span>
                            </div>

                        </div>

                        <div class="stat-label">
                            Siswa Belum Lunas
                        </div>

                        <div
                            class="stat-value"
                            id="statBelumLunas"
                        >
                            0
                        </div>

                        <div class="stat-meta">
                            Dari total siswa kelas
                        </div>

                    </div>


                    {{-- TRANSAKSI --}}
                    <div class="stat-card">

                        <div class="stat-card-top">

                            <div class="stat-icon cyan">
                                <span class="material-symbols-outlined">
                                    swap_horiz
                                </span>
                            </div>

                        </div>

                        <div class="stat-label">
                            Total Transaksi
                        </div>

                        <div
                            class="stat-value"
                            id="statTransaksi"
                        >
                            0
                        </div>

                        <div class="stat-meta">
                            Seluruh transaksi tercatat
                        </div>

                    </div>


                    {{-- TRANSAKSI HARI INI --}}
                    <div class="stat-card">

                        <div class="stat-card-top">

                            <div class="stat-icon rose">
                                <span class="material-symbols-outlined">
                                    today
                                </span>
                            </div>

                        </div>

                        <div class="stat-label">
                            Transaksi Hari Ini
                        </div>

                        <div
                            class="stat-value"
                            id="statHariIni"
                        >
                            0
                        </div>

                        <div class="stat-meta">
                            Aktivitas transaksi hari ini
                        </div>

                    </div>

                </section>


                {{-- =================================================
                     RINGKASAN KAS
                ================================================== --}}
                <section class="panel kas-panel">

                    <div class="panel-header">

                        <div>

                            <div class="panel-eyebrow">
                                RINGKASAN KEUANGAN
                            </div>

                            <h2>
                                Kondisi Kas Kelas
                            </h2>

                        </div>

                        <a
                            href="/viewer/laporan-kas"
                            class="panel-link"
                        >
                            Laporan Kas

                            <span class="material-symbols-outlined">
                                arrow_forward
                            </span>
                        </a>

                    </div>


                    <div class="kas-summary">

                        <div class="kas-item">

                            <span class="kas-item-label">
                                Saldo Awal
                            </span>

                            <strong id="kasSaldoAwal">
                                Rp0
                            </strong>

                        </div>


                        <div class="kas-divider">
                            <span class="material-symbols-outlined">
                                add
                            </span>
                        </div>


                        <div class="kas-item income">

                            <span class="kas-item-label">
                                Pemasukan
                            </span>

                            <strong id="kasPemasukan">
                                Rp0
                            </strong>

                        </div>


                        <div class="kas-divider">
                            <span class="material-symbols-outlined">
                                remove
                            </span>
                        </div>


                        <div class="kas-item expense">

                            <span class="kas-item-label">
                                Pengeluaran
                            </span>

                            <strong id="kasPengeluaran">
                                Rp0
                            </strong>

                        </div>


                        <div class="kas-divider">
                            <span class="material-symbols-outlined">
                                drag_handle
                            </span>
                        </div>


                        <div class="kas-item current">

                            <span class="kas-item-label">
                                Saldo Saat Ini
                            </span>

                            <strong id="kasSaldoSaatIni">
                                Rp0
                            </strong>

                        </div>

                    </div>

                </section>


                {{-- =================================================
                     DUO PANEL
                ================================================== --}}
                <section class="duo-grid">


                    {{-- ARUS KAS --}}
                    <div class="panel">

                        <div class="panel-header">

                            <div>

                                <div class="panel-eyebrow">
                                    ANALISIS KAS
                                </div>

                                <h2>
                                    Arus Kas
                                </h2>

                            </div>


                            <div class="chart-tabs">

                                <button
                                    type="button"
                                    class="chart-tab active"
                                    data-chart="bar"
                                >
                                    Bar
                                </button>

                                <button
                                    type="button"
                                    class="chart-tab"
                                    data-chart="line"
                                >
                                    Line
                                </button>

                            </div>

                        </div>


                        <div class="chart-container">

                            <div
                                id="barChart"
                                class="chart-view active"
                            ></div>

                            <div
                                id="lineChart"
                                class="chart-view"
                            ></div>

                        </div>

                    </div>


                    {{-- MONITORING IURAN --}}
                    <div class="panel">

                        <div class="panel-header">

                            <div>

                                <div class="panel-eyebrow">
                                    MONITORING
                                </div>

                                <h2>
                                    Iuran Kelas
                                </h2>

                            </div>

                            <a
                                href="/viewer/iuran"
                                class="panel-link"
                            >
                                Lihat Iuran

                                <span class="material-symbols-outlined">
                                    arrow_forward
                                </span>
                            </a>

                        </div>


                        <div class="iuran-summary">

                            <div class="iuran-summary-top">

                                <div>

                                    <span class="iuran-label">
                                        Tingkat Pelunasan
                                    </span>

                                    <strong id="iuranPercent">
                                        0%
                                    </strong>

                                </div>

                                <div class="iuran-count">
                                    <span id="iuranLunas">
                                        0
                                    </span>
                                    /
                                    <span id="iuranTotal">
                                        0
                                    </span>
                                    siswa
                                </div>

                            </div>


                            <div class="progress-track">

                                <div
                                    class="progress-bar"
                                    id="iuranProgress"
                                ></div>

                            </div>


                            <div class="iuran-detail">

                                <div class="iuran-detail-item success">

                                    <span class="material-symbols-outlined">
                                        check_circle
                                    </span>

                                    <div>
                                        <strong id="iuranLunasDetail">
                                            0
                                        </strong>

                                        <span>
                                            Sudah lunas
                                        </span>
                                    </div>

                                </div>


                                <div class="iuran-detail-item warning">

                                    <span class="material-symbols-outlined">
                                        schedule
                                    </span>

                                    <div>
                                        <strong id="iuranBelumLunasDetail">
                                            0
                                        </strong>

                                        <span>
                                            Belum lunas
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {{-- =================================================
                     TRANSAKSI TERBARU
                ================================================== --}}
                <section class="panel">

                    <div class="panel-header">

                        <div>

                            <div class="panel-eyebrow">
                                AKTIVITAS TERBARU
                            </div>

                            <h2>
                                Transaksi Terbaru
                            </h2>

                        </div>

                        <a
                            href="/viewer/riwayat-transaksi"
                            class="panel-link"
                        >
                            Lihat Semua

                            <span class="material-symbols-outlined">
                                arrow_forward
                            </span>
                        </a>

                    </div>


                    <div class="table-wrapper">

                        <table class="data-table">

                            <thead>

                                <tr>

                                    <th>No. Bukti</th>

                                    <th>Siswa</th>

                                    <th>Iuran</th>

                                    <th>Nominal</th>

                                    <th>Metode</th>

                                    <th>Tanggal</th>

                                    <th>Status</th>

                                </tr>

                            </thead>

                            <tbody id="transactionTableBody">
                                {{-- Diisi oleh JavaScript --}}
                            </tbody>

                        </table>

                    </div>

                </section>


                {{-- =================================================
                     FOOTER
                ================================================== --}}
                <footer class="page-footer">

                    <span>
                        BBCashvia • KASVIA Synergy
                    </span>

                    <span>
                        Data dashboard Kelas XI RPL 1 saat ini
                        menggunakan simulasi frontend.
                    </span>

                </footer>

            </main>

        </div>

    </div>

</body>

</html>
