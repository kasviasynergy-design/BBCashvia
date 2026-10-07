<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Riwayat Transaksi | BBCashvia</title>

    <meta name="description"
        content="Riwayat transaksi kas kelas pada sistem BBCashvia.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0"
        rel="stylesheet"
    >

    @vite([
        'resources/css/viewer-riwayat-transaksi.css',
        'resources/js/viewer-riwayat-transaksi.js'
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
                <div class="nav-section-title">MENU UTAMA</div>

                <a href="/dashboard/viewer" class="nav-link">
                    <span class="material-symbols-outlined">dashboard</span>
                    <span>Dashboard</span>
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-section-title">DATA & IURAN</div>

                <a href="/viewer/siswa" class="nav-link">
                    <span class="material-symbols-outlined">groups</span>
                    <span>Siswa</span>
                </a>

                <a href="/viewer/iuran" class="nav-link">
                    <span class="material-symbols-outlined">receipt_long</span>
                    <span>Iuran</span>
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-section-title">TRANSAKSI</div>

                <a href="/viewer/transaksi" class="nav-link">
                    <span class="material-symbols-outlined">payments</span>
                    <span>Transaksi</span>
                </a>

                <a href="/viewer/riwayat-transaksi"
                    class="nav-link active"
                    aria-current="page">
                    <span class="material-symbols-outlined">history</span>
                    <span>Riwayat Transaksi</span>
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-section-title">LAPORAN</div>

                <a href="/viewer/laporan-kas" class="nav-link">
                    <span class="material-symbols-outlined">monitoring</span>
                    <span>Laporan Kas</span>
                </a>
            </div>

        </nav>

        <div class="sidebar-footer">

            <div class="sidebar-user">
                <div class="user-avatar">AR</div>

                <div class="user-info">
                    <strong>Andi Ramadhan</strong>
                    <span>Viewer</span>
                </div>
            </div>

            <button type="button"
                class="logout-button"
                id="logoutButton">

                <span class="material-symbols-outlined">logout</span>
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

                    <span class="material-symbols-outlined">menu</span>

                </button>

                <div class="page-heading">
                    <span>Riwayat Transaksi</span>
                    <strong>Aktivitas Kas</strong>
                </div>

            </div>

            <div class="topbar-right">

                <div class="academic-chip">
                    <span class="material-symbols-outlined">school</span>
                    <span>XI RPL 1</span>
                </div>

                <div class="profile-wrapper">

                    <button type="button"
                        class="profile-button"
                        id="profileButton">

                        <div class="profile-avatar">AR</div>

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
                        RIWAYAT TRANSAKSI
                    </span>

                    <h1>Riwayat Transaksi</h1>

                    <p>
                        Pantau seluruh aktivitas transaksi kas kelas
                        XI RPL 1 secara ringkas dan transparan.
                    </p>
                </div>

            </section>

            <!-- RINGKASAN -->

            <section class="stats-grid">

                <article class="stat-card">

                    <div class="stat-icon blue">
                        <span class="material-symbols-outlined">
                            receipt_long
                        </span>
                    </div>

                    <div class="stat-content">
                        <span class="stat-label">
                            Total Transaksi
                        </span>

                        <strong id="totalTransactions">
                            6
                        </strong>

                        <span class="stat-meta">
                            seluruh transaksi
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
                            Pemasukan
                        </span>

                        <strong id="totalIncome">
                            Rp55.000
                        </strong>

                        <span class="stat-meta">
                            transaksi masuk
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
                            Pengeluaran
                        </span>

                        <strong id="totalExpense">
                            Rp30.000
                        </strong>

                        <span class="stat-meta">
                            transaksi keluar
                        </span>
                    </div>

                </article>

                <article class="stat-card">

                    <div class="stat-icon purple">
                        <span class="material-symbols-outlined">
                            account_balance
                        </span>
                    </div>

                    <div class="stat-content">
                        <span class="stat-label">
                            Saldo Kas
                        </span>

                        <strong id="cashBalance">
                            Rp25.000
                        </strong>

                        <span class="stat-meta">
                            posisi kas
                        </span>
                    </div>

                </article>

            </section>

            <!-- RIWAYAT TRANSAKSI -->

            <section class="panel">

                <div class="panel-header">

                    <div>
                        <span class="panel-eyebrow">
                            AKTIVITAS KAS
                        </span>

                        <h2>Daftar Riwayat Transaksi</h2>
                    </div>

                </div>

                <div class="filter-row">

                    <div class="search-wrapper">

                        <span class="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="search"
                            id="searchInput"
                            placeholder="Cari nomor bukti atau keterangan..."
                            autocomplete="off"
                        >

                    </div>

                    <select id="typeFilter" class="filter-select">

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

                    <select id="categoryFilter" class="filter-select">

                        <option value="all">
                            Semua Kategori
                        </option>

                        <option value="Iuran">
                            Iuran
                        </option>

                        <option value="Operasional">
                            Operasional
                        </option>

                        <option value="Kegiatan">
                            Kegiatan
                        </option>

                    </select>

                    <select id="statusFilter" class="filter-select">

                        <option value="all">
                            Semua Status
                        </option>

                        <option value="Berhasil">
                            Berhasil
                        </option>

                        <option value="Dibatalkan">
                            Dibatalkan
                        </option>

                    </select>

                </div>

                <div class="table-wrapper">

                    <table class="transaction-table">

                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No. Bukti</th>
                                <th>Tanggal</th>
                                <th>Jenis</th>
                                <th>Kategori</th>
                                <th>Keterangan</th>
                                <th>Nominal</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody id="transactionTableBody"></tbody>

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
                            receipt_long
                        </span>
                    </div>

                    <h3>Transaksi tidak ditemukan</h3>

                    <p>
                        Tidak ada transaksi yang sesuai dengan
                        pencarian atau filter yang dipilih.
                    </p>

                </div>

            </section>

            <!-- INFORMASI KAS -->

            <section class="panel class-cash-panel">

                <div class="panel-header">

                    <div>
                        <span class="panel-eyebrow">
                            RINGKASAN KAS
                        </span>

                        <h2>Posisi Kas Kelas</h2>
                    </div>

                    <span class="class-badge">
                        XI RPL 1
                    </span>

                </div>

                <div class="cash-summary-grid">

                    <div class="cash-summary-item">

                        <div class="cash-summary-top">

                            <span class="cash-label">
                                Total Pemasukan
                            </span>

                            <span class="cash-dot income"></span>

                        </div>

                        <strong class="cash-amount income">
                            Rp55.000
                        </strong>

                        <span class="cash-description">
                            Dana yang masuk ke kas kelas
                        </span>

                    </div>

                    <div class="cash-summary-item">

                        <div class="cash-summary-top">

                            <span class="cash-label">
                                Total Pengeluaran
                            </span>

                            <span class="cash-dot expense"></span>

                        </div>

                        <strong class="cash-amount expense">
                            Rp30.000
                        </strong>

                        <span class="cash-description">
                            Dana yang digunakan
                        </span>

                    </div>

                    <div class="cash-summary-item">

                        <div class="cash-summary-top">

                            <span class="cash-label">
                                Saldo Kas
                            </span>

                            <span class="cash-dot balance"></span>

                        </div>

                        <strong class="cash-amount balance">
                            Rp25.000
                        </strong>

                        <span class="cash-description">
                            Saldo setelah transaksi
                        </span>

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
