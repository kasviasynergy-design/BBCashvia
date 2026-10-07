<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Transaksi | BBCashvia</title>

    <meta
        name="description"
        content="Informasi transaksi pribadi dan aktivitas kas kelas pada sistem kas kelas BBCashvia."
    >

    {{-- =====================================================
         FONT
    ====================================================== --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0"
        rel="stylesheet"
    >

    @vite([
        'resources/css/viewer-transaksi.css',
        'resources/js/viewer-transaksi.js'
    ])
</head>

<body>

    {{-- =====================================================
         SIDEBAR BACKDROP
    ====================================================== --}}
    <div
        class="sidebar-backdrop"
        id="sidebarBackdrop"
    ></div>


    {{-- =====================================================
         SIDEBAR
    ====================================================== --}}
    <aside
        class="sidebar"
        id="sidebar"
    >

        {{-- BRAND --}}
        <div class="brand">

            <div class="brand-icon">
                <span class="material-symbols-outlined">
                    account_balance_wallet
                </span>
            </div>

            <div class="brand-text">
                <strong>BBCashvia</strong>
                <span>KASVIA Synergy</span>
            </div>

        </div>


        {{-- =================================================
             NAVIGATION
        ================================================== --}}
        <nav class="sidebar-nav">


            {{-- =================================================
                 MENU UTAMA
            ================================================== --}}
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


            {{-- =================================================
                 DATA & IURAN
            ================================================== --}}
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


            {{-- =================================================
                 TRANSAKSI
            ================================================== --}}
            <div class="nav-section">

                <div class="nav-section-title">
                    TRANSAKSI
                </div>

                <a
                    href="/viewer/transaksi"
                    class="nav-link active"
                    aria-current="page"
                >
                    <span class="material-symbols-outlined">
                        payments
                    </span>

                    <span>
                        Transaksi
                    </span>
                </a>


                <a
                    href="/viewer/riwayat-transaksi"
                    class="nav-link"
                >
                    <span class="material-symbols-outlined">
                        history
                    </span>

                    <span>
                        Riwayat Transaksi
                    </span>
                </a>

            </div>


            {{-- =================================================
                 LAPORAN
            ================================================== --}}
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
                    AR
                </div>

                <div class="user-info">
                    <strong>Andi Ramadhan</strong>
                    <span>Viewer</span>
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
    <div class="main">


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
                    <span>Transaksi</span>
                    <strong>Aktivitas Kas</strong>
                </div>

            </div>


            <div class="topbar-right">

                <div class="academic-chip">

                    <span class="material-symbols-outlined">
                        school
                    </span>

                    <span>
                        XI RPL 1
                    </span>

                </div>


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

                        <div class="dropdown-user">

                            <div class="profile-avatar large">
                                AR
                            </div>

                            <div>
                                <strong>Andi Ramadhan</strong>
                                <span>andi@example.com</span>
                            </div>

                        </div>


                        <div class="dropdown-divider"></div>


                        <button
                            type="button"
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
                 PAGE INTRO
            ================================================== --}}
            <section class="page-intro">

                <div>

                    <div class="eyebrow">
                        TRANSAKSI
                    </div>

                    <h1>
                        Transaksi
                    </h1>

                    <p>
                        Pantau transaksi pembayaran kamu dan
                        aktivitas kas kelas XI RPL 1.
                    </p>

                </div>

            </section>


            {{-- =================================================
                 INFORMASI SISWA
            ================================================== --}}
            <section class="panel">

                <div class="panel-header">

                    <div>

                        <div class="eyebrow">
                            TRANSAKSI SAYA
                        </div>

                        <h2>
                            Informasi Siswa
                        </h2>

                    </div>

                </div>


                <div class="student-info-grid">

                    <div class="student-info-item">

                        <span>
                            Nama Siswa
                        </span>

                        <strong>
                            Andi Ramadhan
                        </strong>

                    </div>


                    <div class="student-info-item">

                        <span>
                            NIS
                        </span>

                        <strong>
                            20260001
                        </strong>

                    </div>


                    <div class="student-info-item">

                        <span>
                            Kelas
                        </span>

                        <strong>
                            XI RPL 1
                        </strong>

                    </div>


                    <div class="student-info-item">

                        <span>
                            Status
                        </span>

                        <strong class="status-active">

                            <span class="status-dot"></span>

                            Aktif

                        </strong>

                    </div>

                </div>

            </section>


            {{-- =================================================
                 RINGKASAN TRANSAKSI SAYA
            ================================================== --}}
            <section class="stats-grid">


                <article class="stat-card">

                    <div class="stat-icon blue">

                        <span class="material-symbols-outlined">
                            receipt_long
                        </span>

                    </div>

                    <div class="stat-content">

                        <span>
                            Transaksi Saya
                        </span>

                        <strong id="myTransactionCount">
                            3
                        </strong>

                        <small>
                            Transaksi tercatat
                        </small>

                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-icon green">

                        <span class="material-symbols-outlined">
                            task_alt
                        </span>

                    </div>

                    <div class="stat-content">

                        <span>
                            Sudah Dibayar
                        </span>

                        <strong>
                            2
                        </strong>

                        <small>
                            Pembayaran berhasil
                        </small>

                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-icon orange">

                        <span class="material-symbols-outlined">
                            pending
                        </span>

                    </div>

                    <div class="stat-content">

                        <span>
                            Belum Dibayar
                        </span>

                        <strong>
                            1
                        </strong>

                        <small>
                            Tagihan belum selesai
                        </small>

                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-icon purple">

                        <span class="material-symbols-outlined">
                            account_balance_wallet
                        </span>

                    </div>

                    <div class="stat-content">

                        <span>
                            Total Pembayaran
                        </span>

                        <strong>
                            Rp55.000
                        </strong>

                        <small>
                            Total pembayaran saya
                        </small>

                    </div>

                </article>

            </section>


            {{-- =================================================
                 TRANSAKSI SAYA
            ================================================== --}}
            <section class="panel">

                <div class="panel-header">

                    <div>

                        <div class="eyebrow">
                            RIWAYAT PEMBAYARAN
                        </div>

                        <h2>
                            Transaksi Saya
                        </h2>

                    </div>

                    <div class="table-count">

                        <span id="myTableCount">
                            3
                        </span>

                        transaksi

                    </div>

                </div>


                {{-- FILTER --}}
                <div class="filter-row">

                    <div class="search-box">

                        <span class="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="text"
                            id="mySearchInput"
                            placeholder="Cari no. bukti atau iuran..."
                            autocomplete="off"
                        >

                    </div>


                    <select
                        class="filter-select"
                        id="myStatusFilter"
                    >

                        <option value="all">
                            Semua Status
                        </option>

                        <option value="Berhasil">
                            Berhasil
                        </option>

                        <option value="Menunggu">
                            Menunggu
                        </option>

                    </select>

                </div>


                {{-- TABLE --}}
                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>No</th>
                                <th>No. Bukti</th>
                                <th>Tanggal</th>
                                <th>Iuran</th>
                                <th>Periode</th>
                                <th>Nominal</th>
                                <th>Metode</th>
                                <th>Status</th>
                            </tr>

                        </thead>

                        <tbody id="myTransactionTableBody">
                        </tbody>

                    </table>

                </div>


                {{-- EMPTY STATE --}}
                <div
                    class="empty-state"
                    id="myEmptyState"
                >

                    <div class="empty-icon">

                        <span class="material-symbols-outlined">
                            search_off
                        </span>

                    </div>

                    <h3>
                        Transaksi tidak ditemukan
                    </h3>

                    <p>
                        Coba ubah kata pencarian atau filter.
                    </p>

                </div>

            </section>


            {{-- =================================================
                 KAS KELAS
            ================================================== --}}
            <section class="panel class-cash-panel">

                <div class="panel-header">

                    <div>

                        <div class="eyebrow">
                            KAS KELAS
                        </div>

                        <h2>
                            Ringkasan Kas XI RPL 1
                        </h2>

                    </div>

                    <div class="class-badge">
                        XI RPL 1
                    </div>

                </div>


                <div class="cash-summary-grid">

                    <div class="cash-summary-item">

                        <div class="cash-label">

                            <span class="cash-dot income"></span>

                            Total Pemasukan

                        </div>

                        <strong>
                            Rp720.000
                        </strong>

                    </div>


                    <div class="cash-summary-item">

                        <div class="cash-label">

                            <span class="cash-dot expense"></span>

                            Total Pengeluaran

                        </div>

                        <strong>
                            Rp185.000
                        </strong>

                    </div>


                    <div class="cash-summary-item">

                        <div class="cash-label">

                            <span class="cash-dot balance"></span>

                            Saldo Kas

                        </div>

                        <strong>
                            Rp535.000
                        </strong>

                    </div>

                </div>

            </section>


            {{-- =================================================
                 TRANSAKSI KAS KELAS
            ================================================== --}}
            <section class="panel">

                <div class="panel-header">

                    <div>

                        <div class="eyebrow">
                            AKTIVITAS KAS
                        </div>

                        <h2>
                            Transaksi Kas Kelas
                        </h2>

                    </div>

                    <div class="table-count">

                        <span id="classTableCount">
                            3
                        </span>

                        transaksi

                    </div>

                </div>


                {{-- FILTER --}}
                <div class="filter-row">

                    <div class="search-box">

                        <span class="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="text"
                            id="classSearchInput"
                            placeholder="Cari transaksi kas..."
                            autocomplete="off"
                        >

                    </div>


                    <select
                        class="filter-select"
                        id="classTypeFilter"
                    >

                        <option value="all">
                            Semua Jenis
                        </option>

                        <option value="Pemasukan">
                            Pemasukan
                        </option>

                        <option value="Pengeluaran">
                            Pengeluaran
                        </option>

                    </select>

                </div>


                {{-- TABLE --}}
                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>No</th>
                                <th>No. Bukti</th>
                                <th>Tanggal</th>
                                <th>Jenis</th>
                                <th>Kategori</th>
                                <th>Keterangan</th>
                                <th>Nominal</th>
                            </tr>

                        </thead>

                        <tbody id="classTransactionTableBody">
                        </tbody>

                    </table>

                </div>


                {{-- EMPTY STATE --}}
                <div
                    class="empty-state"
                    id="classEmptyState"
                >

                    <div class="empty-icon">

                        <span class="material-symbols-outlined">
                            search_off
                        </span>

                    </div>

                    <h3>
                        Transaksi kas tidak ditemukan
                    </h3>

                    <p>
                        Coba ubah kata pencarian atau filter.
                    </p>

                </div>

            </section>


            {{-- =================================================
                 FOOTER
            ================================================== --}}
            <footer class="content-footer">

                <span>
                    BBCashvia
                </span>

                <span>
                    •
                </span>

                <span>
                    KASVIA Synergy
                </span>

            </footer>

        </main>

    </div>

</body>

</html>
