<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Data Siswa | BBCashvia</title>

    <meta
        name="description"
        content="Informasi siswa dan kelas pada sistem kas kelas BBCashvia."
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
        'resources/css/viewer-siswa.css',
        'resources/js/viewer-siswa.js'
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
                    class="nav-link active"
                    aria-current="page"
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
                    class="nav-link"
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
                    <span>Data Siswa</span>
                    <strong>Profil & Kelas</strong>
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


            {{-- =================================================
                 PAGE INTRO
            ================================================== --}}
            <section class="page-intro">

                <div>

                    <span class="page-eyebrow">
                        PROFIL SISWA
                    </span>

                    <h1>
                        Data Siswa
                    </h1>

                    <p>
                        Informasi diri kamu dan gambaran kelas
                        tempat kamu terdaftar di BBCashvia.
                    </p>

                </div>

            </section>


            {{-- =================================================
                 PROFIL SAYA
            ================================================== --}}
            <section class="panel">

                <div class="panel-header">

                    <div>

                        <span class="panel-eyebrow">
                            PROFIL SAYA
                        </span>

                        <h2>
                            Informasi Siswa
                        </h2>

                    </div>

                </div>


                <div class="student-profile">

                    <div class="profile-avatar large">
                        AR
                    </div>


                    <div class="student-profile-info">

                        <h3>
                            Andi Ramadhan
                        </h3>

                        <span>
                            Siswa aktif
                        </span>

                    </div>


                    <div class="student-profile-details">

                        <div class="profile-detail-item">

                            <span class="profile-detail-label">
                                NIS
                            </span>

                            <strong>
                                20260001
                            </strong>

                        </div>


                        <div class="profile-detail-item">

                            <span class="profile-detail-label">
                                Kelas
                            </span>

                            <strong>
                                XI RPL 1
                            </strong>

                        </div>


                        <div class="profile-detail-item">

                            <span class="profile-detail-label">
                                Jenis Kelamin
                            </span>

                            <strong>
                                Laki-laki
                            </strong>

                        </div>


                        <div class="profile-detail-item">

                            <span class="profile-detail-label">
                                Status
                            </span>

                            <strong>
                                Aktif
                            </strong>

                        </div>


                        <div class="profile-detail-item">

                            <span class="profile-detail-label">
                                Tahun Ajaran
                            </span>

                            <strong>
                                2026/2027
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {{-- =================================================
                 RINGKASAN KELAS
            ================================================== --}}
            <section class="stats-grid">


                <article class="stat-card">

                    <div class="stat-card-top">

                        <div class="stat-icon blue">
                            <span class="material-symbols-outlined">
                                groups
                            </span>
                        </div>

                    </div>

                    <div class="stat-label">
                        Total Siswa
                    </div>

                    <div
                        class="stat-value"
                        id="totalSiswa"
                    >
                        36
                    </div>

                    <div class="stat-meta">
                        Siswa dalam kelas
                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-card-top">

                        <div class="stat-icon green">
                            <span class="material-symbols-outlined">
                                verified
                            </span>
                        </div>

                    </div>

                    <div class="stat-label">
                        Siswa Aktif
                    </div>

                    <div
                        class="stat-value"
                        id="siswaAktif"
                    >
                        34
                    </div>

                    <div class="stat-meta">
                        Siswa berstatus aktif
                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-card-top">

                        <div class="stat-icon orange">
                            <span class="material-symbols-outlined">
                                person_off
                            </span>
                        </div>

                    </div>

                    <div class="stat-label">
                        Tidak Aktif
                    </div>

                    <div
                        class="stat-value"
                        id="siswaTidakAktif"
                    >
                        2
                    </div>

                    <div class="stat-meta">
                        Siswa tidak aktif
                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-card-top">

                        <div class="stat-icon purple">
                            <span class="material-symbols-outlined">
                                classroom
                            </span>
                        </div>

                    </div>

                    <div class="stat-label">
                        Kelas
                    </div>

                    <div class="stat-value">
                        XI RPL 1
                    </div>

                    <div class="stat-meta">
                        Tahun ajaran 2026/2027
                    </div>

                </article>

            </section>


            {{-- =================================================
                 INFORMASI KELAS
            ================================================== --}}
            <section class="panel">

                <div class="panel-header">

                    <div>

                        <span class="panel-eyebrow">
                            KELAS SAYA
                        </span>

                        <h2>
                            XI RPL 1
                        </h2>

                    </div>

                </div>


                <div class="class-info-grid">

                    <div class="class-info-item">

                        <span class="material-symbols-outlined">
                            school
                        </span>

                        <div>
                            <span>
                                Kelas
                            </span>

                            <strong>
                                XI RPL 1
                            </strong>
                        </div>

                    </div>


                    <div class="class-info-item">

                        <span class="material-symbols-outlined">
                            groups
                        </span>

                        <div>
                            <span>
                                Jumlah Siswa
                            </span>

                            <strong>
                                36 Siswa
                            </strong>
                        </div>

                    </div>


                    <div class="class-info-item">

                        <span class="material-symbols-outlined">
                            calendar_month
                        </span>

                        <div>
                            <span>
                                Tahun Ajaran
                            </span>

                            <strong>
                                2026/2027
                            </strong>
                        </div>

                    </div>


                    <div class="class-info-item">

                        <span class="material-symbols-outlined">
                            person
                        </span>

                        <div>
                            <span>
                                Wali Kelas
                            </span>

                            <strong>
                                Belum tersedia
                            </strong>
                        </div>

                    </div>

                </div>

            </section>


            {{-- =================================================
                 TEMAN SEKELAS
            ================================================== --}}
            <section class="panel">

                <div class="panel-header">

                    <div>

                        <span class="panel-eyebrow">
                            TEMAN SEKELAS
                        </span>

                        <h2>
                            Siswa Kelas XI RPL 1
                        </h2>

                    </div>

                    <div class="panel-count">
                        <span id="tableCount">
                            36
                        </span>
                        siswa
                    </div>

                </div>


                {{-- FILTER --}}
                <div class="filter-area">

                    <div class="search-box">

                        <span class="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="text"
                            id="searchInput"
                            placeholder="Cari nama atau NIS..."
                            autocomplete="off"
                        >

                    </div>


                    <div class="filter-control">

                        <span class="material-symbols-outlined">
                            filter_list
                        </span>

                        <select id="statusFilter">

                            <option value="all">
                                Semua Status
                            </option>

                            <option value="Aktif">
                                Aktif
                            </option>

                            <option value="Tidak Aktif">
                                Tidak Aktif
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
                                <th>NIS</th>
                                <th>Nama Siswa</th>
                                <th>Jenis Kelamin</th>
                                <th>Status</th>
                            </tr>

                        </thead>

                        <tbody id="studentTableBody">
                        </tbody>

                    </table>

                </div>


                {{-- EMPTY STATE --}}
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
                        Data siswa tidak ditemukan
                    </strong>

                    <span>
                        Coba ubah kata pencarian atau filter.
                    </span>

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
