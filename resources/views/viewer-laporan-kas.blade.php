<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Laporan Kas | BBCashvia</title>

    <meta name="description"
        content="Laporan kas kelas pada sistem BBCashvia.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0"
        rel="stylesheet"
    >

    @vite([
        'resources/css/viewer-laporan-kas.css',
        'resources/js/viewer-laporan-kas.js'
    ])
</head>

<body>

    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

    <aside class="sidebar" id="sidebar">

        <div class="sidebar-brand">

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

        <nav class="sidebar-nav">

            <div class="nav-section">

                <div class="nav-section-title">
                    MENU UTAMA
                </div>

                <a href="/dashboard/viewer" class="nav-link">
                    <span class="material-symbols-outlined">
                        dashboard
                    </span>
                    <span>Dashboard</span>
                </a>

            </div>

            <div class="nav-section">

                <div class="nav-section-title">
                    DATA & IURAN
                </div>

                <a href="/viewer/siswa" class="nav-link">
                    <span class="material-symbols-outlined">
                        groups
                    </span>
                    <span>Siswa</span>
                </a>

                <a href="/viewer/iuran" class="nav-link">
                    <span class="material-symbols-outlined">
                        receipt_long
                    </span>
                    <span>Iuran</span>
                </a>

            </div>

            <div class="nav-section">

                <div class="nav-section-title">
                    TRANSAKSI
                </div>

                <a href="/viewer/transaksi" class="nav-link">
                    <span class="material-symbols-outlined">
                        payments
                    </span>
                    <span>Transaksi</span>
                </a>

                <a href="/viewer/riwayat-transaksi" class="nav-link">
                    <span class="material-symbols-outlined">
                        history
                    </span>
                    <span>Riwayat Transaksi</span>
                </a>

            </div>

            <div class="nav-section">

                <div class="nav-section-title">
                    LAPORAN
                </div>

                <a href="/viewer/laporan-kas"
                    class="nav-link active"
                    aria-current="page">

                    <span class="material-symbols-outlined">
                        monitoring
                    </span>

                    <span>Laporan Kas</span>

                </a>

            </div>

        </nav>

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

            <button type="button"
                class="logout-button"
                id="logoutButton">

                <span class="material-symbols-outlined">
                    logout
                </span>

                <span>Keluar</span>

            </button>

        </div>

    </aside>


    <div class="main-area">

        <header class="topbar">

            <div class="topbar-left">

                <button type="button"
                    class="menu-toggle"
                    id="menuToggle"
                    aria-label="Buka menu">

                    <span class="material-symbols-outlined">
                        menu
                    </span>

                </button>

                <div class="page-heading">
                    <span>Laporan Kas</span>
                    <strong>Ringkasan Keuangan</strong>
                </div>

            </div>


            <div class="topbar-right">

                <div class="academic-chip">

                    <span class="material-symbols-outlined">
                        school
                    </span>

                    <span>XI RPL 1</span>

                </div>


                <div class="profile-wrapper">

                    <button type="button"
                        class="profile-button"
                        id="profileButton">

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


                    <div class="profile-dropdown"
                        id="profileDropdown">

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


                        <button type="button"
                            id="dropdownLogout"
                            class="dropdown-logout">

                            <span class="material-symbols-outlined">
                                logout
                            </span>

                            Keluar

                        </button>

                    </div>

                </div>

            </div>

        </header>


        <main class="content">

            <section class="page-intro">

                <div>

                    <span class="page-eyebrow">
                        LAPORAN KAS
                    </span>

                    <h1>Laporan Kas</h1>

                    <p>
                        Pantau ringkasan pemasukan, pengeluaran,
                        dan saldo kas kelas XI RPL 1.
                    </p>

                </div>

            </section>


            <!-- INFORMASI LAPORAN -->

            <section class="panel report-information">

                <div class="panel-header">

                    <div>
                        <span class="panel-eyebrow">
                            PERIODE LAPORAN
                        </span>

                        <h2>Ringkasan Kas Kelas</h2>
                    </div>

                    <span class="class-badge">
                        XI RPL 1
                    </span>

                </div>


                <div class="report-filter">

                    <div class="filter-item">

                        <label for="periodFilter">
                            Periode
                        </label>

                        <select id="periodFilter"
                            class="filter-select">

                            <option value="oktober-2026">
                                Oktober 2026
                            </option>

                            <option value="september-2026">
                                September 2026
                            </option>

                            <option value="agustus-2026">
                                Agustus 2026
                            </option>

                        </select>

                    </div>


                    <div class="report-period-info">

                        <span class="material-symbols-outlined">
                            calendar_month
                        </span>

                        <div>
                            <strong id="periodTitle">
                                Oktober 2026
                            </strong>

                            <span>
                                Tahun Ajaran 2026/2027
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            <!-- RINGKASAN KEUANGAN -->

            <section class="stats-grid">

                <article class="stat-card">

                    <div class="stat-icon blue">

                        <span class="material-symbols-outlined">
                            account_balance
                        </span>

                    </div>

                    <div class="stat-content">

                        <span class="stat-label">
                            Saldo Awal
                        </span>

                        <strong id="openingBalance">
                            Rp480.000
                        </strong>

                        <span class="stat-meta">
                            saldo sebelum periode
                        </span>

                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-icon green">

                        <span class="material-symbols-outlined">
                            trending_up
                        </span>

                    </div>

                    <div class="stat-content">

                        <span class="stat-label">
                            Total Pemasukan
                        </span>

                        <strong id="incomeAmount">
                            Rp720.000
                        </strong>

                        <span class="stat-meta">
                            dana masuk
                        </span>

                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-icon orange">

                        <span class="material-symbols-outlined">
                            trending_down
                        </span>

                    </div>

                    <div class="stat-content">

                        <span class="stat-label">
                            Total Pengeluaran
                        </span>

                        <strong id="expenseAmount">
                            Rp185.000
                        </strong>

                        <span class="stat-meta">
                            dana keluar
                        </span>

                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-icon purple">

                        <span class="material-symbols-outlined">
                            savings
                        </span>

                    </div>

                    <div class="stat-content">

                        <span class="stat-label">
                            Saldo Akhir
                        </span>

                        <strong id="closingBalance">
                            Rp1.015.000
                        </strong>

                        <span class="stat-meta">
                            saldo akhir periode
                        </span>

                    </div>

                </article>

            </section>


            <!-- DETAIL KAS -->

            <section class="panel">

                <div class="panel-header">

                    <div>

                        <span class="panel-eyebrow">
                            DETAIL LAPORAN
                        </span>

                        <h2>Rincian Pemasukan & Pengeluaran</h2>

                    </div>

                </div>


                <div class="report-summary-grid">

                    <div class="summary-box income-box">

                        <div class="summary-box-icon">

                            <span class="material-symbols-outlined">
                                arrow_downward
                            </span>

                        </div>

                        <div>

                            <span>
                                Pemasukan
                            </span>

                            <strong>
                                Rp720.000
                            </strong>

                            <small>
                                dari iuran dan pemasukan kas
                            </small>

                        </div>

                    </div>


                    <div class="summary-box expense-box">

                        <div class="summary-box-icon">

                            <span class="material-symbols-outlined">
                                arrow_upward
                            </span>

                        </div>

                        <div>

                            <span>
                                Pengeluaran
                            </span>

                            <strong>
                                Rp185.000
                            </strong>

                            <small>
                                untuk kebutuhan kelas
                            </small>

                        </div>

                    </div>


                    <div class="summary-box balance-box">

                        <div class="summary-box-icon">

                            <span class="material-symbols-outlined">
                                account_balance_wallet
                            </span>

                        </div>

                        <div>

                            <span>
                                Saldo Akhir
                            </span>

                            <strong>
                                Rp1.015.000
                            </strong>

                            <small>
                                posisi kas kelas
                            </small>

                        </div>

                    </div>

                </div>

            </section>


            <!-- RINCIAN TRANSAKSI -->

            <section class="panel">

                <div class="panel-header">

                    <div>

                        <span class="panel-eyebrow">
                            TRANSAKSI PERIODE
                        </span>

                        <h2>Rincian Transaksi</h2>

                    </div>

                </div>


                <div class="table-wrapper">

                    <table class="report-table">

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

                        <tbody id="reportTableBody"></tbody>

                    </table>

                </div>


                <div class="table-footer">

                    <span id="tableCount">
                        Menampilkan 6 transaksi
                    </span>

                </div>


                <div class="empty-state" id="emptyState">

                    <div class="empty-icon">

                        <span class="material-symbols-outlined">
                            monitoring
                        </span>

                    </div>

                    <h3>
                        Belum ada transaksi
                    </h3>

                    <p>
                        Belum terdapat transaksi pada periode
                        yang dipilih.
                    </p>

                </div>

            </section>


            <!-- CATATAN -->

            <section class="panel note-panel">

                <div class="note-content">

                    <div class="note-icon">

                        <span class="material-symbols-outlined">
                            info
                        </span>

                    </div>

                    <div>

                        <strong>
                            Informasi Laporan
                        </strong>

                        <p>
                            Laporan kas bersifat informatif dan
                            hanya dapat dilihat oleh Viewer.
                            Data yang ditampilkan berasal dari
                            aktivitas kas kelas pada periode
                            yang dipilih.
                        </p>

                    </div>

                </div>

            </section>


            <footer class="page-footer">

                <span>BBCashvia</span>
                <span>•</span>
                <span>KASVIA Synergy</span>

            </footer>

        </main>

    </div>

</body>
</html>
