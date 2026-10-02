<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Dashboard Admin — BBCashvia</title>

    <meta name="description"
        content="Dashboard Admin BBCashvia — Sistem pengelolaan kas dan administrasi sekolah.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet">

    @vite([
        'resources/css/admindash.css',
        'resources/js/admindash.js'
    ])
</head>

<body>

    <!-- =====================================================
         MOBILE BACKDROP
    ====================================================== -->

    <div
        class="mobile-backdrop"
        id="mobileBackdrop"
        hidden>
    </div>


    <!-- =====================================================
         DASHBOARD
    ====================================================== -->

    <div class="dash">


        <!-- =================================================
             SIDEBAR
        ================================================== -->

        <aside
            class="sidebar"
            id="sidebar">

            <!-- Brand -->

            <div class="side-brand">

                <div class="side-brand__logo">
                    BB
                </div>

                <div class="side-brand__text">

                    <p class="side-brand__title">
                        BBCashvia
                    </p>

                    <p class="side-brand__subtitle">
                        KASVIA Synergy
                    </p>

                </div>

            </div>


            <!-- Navigation -->

            <nav class="side-nav">

                <span class="side-nav__label">
                    Menu Utama
                </span>


                <!-- Dashboard -->

                <a
                    href="/dashboard/admin"
                    class="side-link active">

                    <span class="side-link__icon material-symbols-outlined">
                        dashboard
                    </span>

                    <span class="side-link__text">
                        Dashboard
                    </span>

                </a>


                <!-- Data Siswa -->

                <a
                    href="#"
                    class="side-link">

                    <span class="side-link__icon material-symbols-outlined">
                        groups
                    </span>

                    <span class="side-link__text">
                        Data Siswa
                    </span>

                </a>


                <!-- Data Kelas -->

                <a
                    href="#"
                    class="side-link">

                    <span class="side-link__icon material-symbols-outlined">
                        school
                    </span>

                    <span class="side-link__text">
                        Data Kelas
                    </span>

                </a>


                <!-- Iuran -->

                <a
                    href="#"
                    class="side-link">

                    <span class="side-link__icon material-symbols-outlined">
                        payments
                    </span>

                    <span class="side-link__text">
                        Iuran
                    </span>

                </a>


                <!-- Transaksi -->

                <a
                    href="#"
                    class="side-link">

                    <span class="side-link__icon material-symbols-outlined">
                        receipt_long
                    </span>

                    <span class="side-link__text">
                        Transaksi
                    </span>

                </a>


                <!-- Laporan -->

                <a
                    href="#"
                    class="side-link">

                    <span class="side-link__icon material-symbols-outlined">
                        description
                    </span>

                    <span class="side-link__text">
                        Laporan
                    </span>

                </a>


                <span class="side-nav__label">
                    Administrasi
                </span>


                <!-- Manajemen Pengguna -->

                <a
                    href="#"
                    class="side-link">

                    <span class="side-link__icon material-symbols-outlined">
                        manage_accounts
                    </span>

                    <span class="side-link__text">
                        Manajemen Pengguna
                    </span>

                </a>


                <!-- Pengaturan -->

                <a
                    href="#"
                    class="side-link">

                    <span class="side-link__icon material-symbols-outlined">
                        settings
                    </span>

                    <span class="side-link__text">
                        Pengaturan
                    </span>

                </a>

            </nav>


            <!-- Logout -->

            <div class="sidebar__bottom">

                <button
                    type="button"
                    class="btn-logout">

                    <span class="material-symbols-outlined">
                        logout
                    </span>

                    Keluar

                </button>

            </div>

        </aside>


        <!-- =================================================
             MAIN
        ================================================== -->

        <main class="dash__main">


            <!-- =================================================
                 TOPBAR
            ================================================== -->

            <header class="topbar">


                <div class="topbar__left">

                    <h1 class="topbar__title">
                        Dashboard Admin
                    </h1>

                    <p class="topbar__subtitle">
                        Kelola seluruh data dan aktivitas BBCashvia
                    </p>

                </div>


                <div class="topbar__right">


                    <!-- Search -->

                    <div class="topbar-search">

                        <span class="topbar-search__icon material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="search"
                            placeholder="Cari data...">

                    </div>


                    <!-- Profile -->

                    <div class="profile">

                        <button
                            type="button"
                            class="profile__button"
                            id="profileButton">

                            <span class="profile__avatar">
                                AD
                            </span>

                            <span class="profile__info">

                                <span class="profile__name">
                                    Admin BBCashvia
                                </span>

                                <span class="profile__role">
                                    Administrator
                                </span>

                            </span>

                            <span class="material-symbols-outlined">
                                expand_more
                            </span>

                        </button>


                        <!-- Dropdown -->

                        <div
                            class="profile__dropdown"
                            id="profileDropdown"
                            hidden>

                            <a href="#">

                                <span class="material-symbols-outlined">
                                    person
                                </span>

                                Profil Saya

                            </a>

                            <a href="#">

                                <span class="material-symbols-outlined">
                                    settings
                                </span>

                                Pengaturan

                            </a>

                            <button type="button">

                                <span class="material-symbols-outlined">
                                    logout
                                </span>

                                Keluar

                            </button>

                        </div>

                    </div>

                </div>

            </header>


            <!-- =================================================
                 CONTENT
            ================================================== -->

            <div class="dash__content">


                <!-- =================================================
                     WELCOME HERO
                ================================================== -->

                <section class="hero">

                    <div class="hero__content">

                        <p class="hero__eyebrow">
                            BBCashvia • Admin Portal
                        </p>

                        <h1>
                            Selamat datang, Admin 👋
                        </h1>

                        <p>
                            Pantau kondisi sistem, kelola data siswa dan kelas,
                            serta pastikan seluruh aktivitas kas sekolah
                            berjalan dengan tertib.
                        </p>

                        <div class="hero__actions">

                            <a
                                href="#"
                                class="btn-dash">

                                <span class="material-symbols-outlined">
                                    add
                                </span>

                                Tambah Data

                            </a>

                            <a
                                href="#"
                                class="btn-dash secondary">

                                <span class="material-symbols-outlined">
                                    description
                                </span>

                                Lihat Laporan

                            </a>

                        </div>

                    </div>

                </section>


                <!-- =================================================
                     STATISTICS
                ================================================== -->

                <div class="stat-grid">


                    <!-- Total Siswa -->

                    <article class="stat-card">

                        <div class="stat-card__top">

                            <span class="stat-card__label">
                                Total Siswa
                            </span>

                            <span class="stat-card__icon material-symbols-outlined">
                                groups
                            </span>

                        </div>

                        <div class="stat-card__value">
                            0
                        </div>

                        <div class="stat-card__meta">
                            Data siswa terdaftar
                        </div>

                    </article>


                    <!-- Total Kelas -->

                    <article class="stat-card">

                        <div class="stat-card__top">

                            <span class="stat-card__label">
                                Total Kelas
                            </span>

                            <span class="stat-card__icon material-symbols-outlined">
                                school
                            </span>

                        </div>

                        <div class="stat-card__value">
                            0
                        </div>

                        <div class="stat-card__meta">
                            Kelas aktif
                        </div>

                    </article>


                    <!-- Total Iuran -->

                    <article class="stat-card">

                        <div class="stat-card__top">

                            <span class="stat-card__label">
                                Total Iuran
                            </span>

                            <span class="stat-card__icon material-symbols-outlined">
                                payments
                            </span>

                        </div>

                        <div class="stat-card__value">
                            Rp0
                        </div>

                        <div class="stat-card__meta success">
                            Rekapitulasi sementara
                        </div>

                    </article>


                    <!-- Transaksi -->

                    <article class="stat-card">

                        <div class="stat-card__top">

                            <span class="stat-card__label">
                                Transaksi
                            </span>

                            <span class="stat-card__icon material-symbols-outlined">
                                receipt_long
                            </span>

                        </div>

                        <div class="stat-card__value">
                            0
                        </div>

                        <div class="stat-card__meta">
                            Transaksi tercatat
                        </div>

                    </article>

                </div>


                <!-- =================================================
                     MAIN GRID
                ================================================== -->

                <div class="duo-grid">


                    <!-- =============================================
                         AKTIVITAS / GRAFIK
                    ============================================== -->

                    <section class="panel">

                        <div class="panel__head">

                            <div>

                                <h2 class="panel__title">
                                    Ringkasan Aktivitas Kas
                                </h2>

                                <p class="panel__subtitle">
                                    Gambaran aktivitas kas dalam periode berjalan.
                                </p>

                            </div>

                            <button
                                type="button"
                                class="btn-icon"
                                title="Lihat detail">

                                <span class="material-symbols-outlined">
                                    more_horiz
                                </span>

                            </button>

                        </div>


                        <div class="chart">

                            <div class="chart__group">
                                <span class="chart__bar chart__bar--in" style="height: 35%;"></span>
                            </div>

                            <div class="chart__group">
                                <span class="chart__bar chart__bar--in" style="height: 50%;"></span>
                            </div>

                            <div class="chart__group">
                                <span class="chart__bar chart__bar--in" style="height: 42%;"></span>
                            </div>

                            <div class="chart__group">
                                <span class="chart__bar chart__bar--in" style="height: 65%;"></span>
                            </div>

                            <div class="chart__group">
                                <span class="chart__bar chart__bar--in" style="height: 55%;"></span>
                            </div>

                            <div class="chart__group">
                                <span class="chart__bar chart__bar--in" style="height: 75%;"></span>
                            </div>

                        </div>


                        <div class="chart__axis">

                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>Mei</span>
                            <span>Jun</span>

                        </div>

                    </section>


                    <!-- =============================================
                         AKTIVITAS TERBARU
                    ============================================== -->

                    <section class="panel">

                        <div class="panel__head">

                            <div>

                                <h2 class="panel__title">
                                    Aktivitas Terbaru
                                </h2>

                                <p class="panel__subtitle">
                                    Aktivitas terbaru pada sistem.
                                </p>

                            </div>

                        </div>


                        <div class="activity">


                            <div class="activity-item">

                                <span class="activity-item__dot">
                                </span>

                                <div class="activity-item__content">

                                    <div class="activity-item__title">
                                        Belum ada aktivitas transaksi.
                                    </div>

                                    <div class="activity-item__time">
                                        Menunggu data sistem
                                    </div>

                                </div>

                            </div>


                            <div class="activity-item">

                                <span class="activity-item__dot">
                                </span>

                                <div class="activity-item__content">

                                    <div class="activity-item__title">
                                        Data dashboard siap digunakan.
                                    </div>

                                    <div class="activity-item__time">
                                        Sistem BBCashvia
                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>


                <!-- =================================================
                     DATA TERBARU
                ================================================== -->

                <section class="panel">

                    <div class="panel__head">

                        <div>

                            <h2 class="panel__title">
                                Data Terbaru
                            </h2>

                            <p class="panel__subtitle">
                                Informasi data yang terakhir tercatat pada sistem.
                            </p>

                        </div>


                        <a
                            href="#"
                            class="btn-dash secondary">

                            Lihat Semua

                        </a>

                    </div>


                    <div class="table-wrap">

                        <table class="table">

                            <thead>

                                <tr>

                                    <th>
                                        Nama
                                    </th>

                                    <th>
                                        Kelas
                                    </th>

                                    <th>
                                        Jenis
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Tanggal
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                <tr>

                                    <td>

                                        <div class="table__primary">
                                            Belum ada data
                                        </div>

                                        <div class="table__secondary">
                                            Data akan muncul setelah sistem digunakan.
                                        </div>

                                    </td>

                                    <td>
                                        -
                                    </td>

                                    <td>
                                        -
                                    </td>

                                    <td>

                                        <span class="badge neutral">
                                            Belum tersedia
                                        </span>

                                    </td>

                                    <td>
                                        -
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </section>


                <!-- =================================================
                     QUICK ACCESS
                ================================================== -->

                <section class="panel">

                    <div class="panel__head">

                        <div>

                            <h2 class="panel__title">
                                Akses Cepat
                            </h2>

                            <p class="panel__subtitle">
                                Menu yang sering digunakan oleh Admin.
                            </p>

                        </div>

                    </div>


                    <div class="quick-grid">


                        <a
                            href="#"
                            class="quick-card">

                            <span class="quick-card__icon material-symbols-outlined">
                                groups
                            </span>

                            <span>

                                <span class="quick-card__title">
                                    Data Siswa
                                </span>

                                <span class="quick-card__description">
                                    Kelola data seluruh siswa.
                                </span>

                            </span>

                        </a>


                        <a
                            href="#"
                            class="quick-card">

                            <span class="quick-card__icon material-symbols-outlined">
                                school
                            </span>

                            <span>

                                <span class="quick-card__title">
                                    Data Kelas
                                </span>

                                <span class="quick-card__description">
                                    Kelola data kelas sekolah.
                                </span>

                            </span>

                        </a>


                        <a
                            href="#"
                            class="quick-card">

                            <span class="quick-card__icon material-symbols-outlined">
                                payments
                            </span>

                            <span>

                                <span class="quick-card__title">
                                    Iuran
                                </span>

                                <span class="quick-card__description">
                                    Kelola data iuran siswa.
                                </span>

                            </span>

                        </a>


                        <a
                            href="#"
                            class="quick-card">

                            <span class="quick-card__icon material-symbols-outlined">
                                manage_accounts
                            </span>

                            <span>

                                <span class="quick-card__title">
                                    Manajemen Pengguna
                                </span>

                                <span class="quick-card__description">
                                    Kelola akun dan hak akses pengguna.
                                </span>

                            </span>

                        </a>

                    </div>

                </section>


                <!-- =================================================
                     INFORMASI AKSES ADMIN
                ================================================== -->

                <section class="panel">

                    <div class="compliance">

                        <span class="compliance__icon material-symbols-outlined">
                            verified_user
                        </span>

                        <div>

                            <div class="compliance__title">
                                Hak Akses Administrator
                            </div>

                            <div class="compliance__text">
                                Admin memiliki akses penuh untuk mengelola
                                data siswa, kelas, iuran, transaksi,
                                laporan, pengguna, dan pengaturan sistem
                                sesuai kewenangan yang telah ditetapkan.
                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </main>

    </div>


</body>

</html>
