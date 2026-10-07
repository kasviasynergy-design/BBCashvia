<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

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

    <title>Riwayat Transaksi | BBCashvia</title>

    @vite([
        'resources/css/bendahara-riwayat-transaksi.css',
        'resources/js/bendahara-riwayat-transaksi.js'
    ])
</head>

<body>

<div class="app-shell">

    <!-- =====================================================
         SIDEBAR
    ====================================================== -->
    <aside class="sidebar" id="sidebar">

        <div class="sidebar__brand">

            <div class="sidebar__logo">
                <span class="material-symbols-outlined">
                    account_balance_wallet
                </span>
            </div>

            <div class="sidebar__brandtext">

                <div class="sidebar__brandname">
                    BBCashvia
                </div>

                <div class="sidebar__brandsub">
                    KASVIA Synergy
                </div>

            </div>

        </div>


        <nav class="sidebar__nav">

            <!-- MENU UTAMA -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    MENU UTAMA
                </div>

                <a
                    href="/dashboard/bendahara"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">
                        dashboard
                    </span>

                    <span>
                        Dashboard
                    </span>
                </a>

            </div>


            <!-- DATA & IURAN -->
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


            <!-- TRANSAKSI -->
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


            <!-- LAPORAN -->
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
                    class="side-link is-active"
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


        <!-- SIDEBAR FOOT -->
        <div class="sidebar__foot">

            <div class="sidebar__user">

                <div class="sidebar__avatar">
                    SN
                </div>

                <div class="sidebar__userinfo">

                    <div class="sidebar__username">
                        Siti Nurhaliza
                    </div>

                    <div class="sidebar__userrole">
                        Bendahara • Kelas XI RPL 1
                    </div>

                </div>

            </div>


            <button
                type="button"
                class="sidebar__logout"
                id="btnSidebarLogout"
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


    <!-- BACKDROP -->
    <div
        class="sidebar-backdrop"
        id="sidebarBackdrop"
    ></div>


    <!-- =====================================================
         MAIN SHELL
    ====================================================== -->
    <div class="shell">


        <!-- TOPBAR -->
        <header class="topbar">

            <div class="topbar__left">

                <button
                    type="button"
                    class="topbar__burger"
                    id="btnSidebar"
                    aria-label="Buka menu"
                    aria-expanded="false"
                >
                    <span class="material-symbols-outlined">
                        menu
                    </span>
                </button>


                <div class="topbar__title">

                    <h1>
                        Riwayat Transaksi
                    </h1>

                    <p id="topbarDate">
                        —
                    </p>

                </div>

            </div>


            <div class="topbar__right">

                <div class="topbar__chip">

                    <span class="material-symbols-outlined">
                        calendar_month
                    </span>

                    <span>
                        T.A 2026/2027
                    </span>

                </div>


                <!-- PROFILE -->
                <div class="topbar__profilewrap">

                    <button
                        type="button"
                        class="topbar__profile"
                        id="profileButton"
                        aria-expanded="false"
                    >

                        <div class="topbar__avatar">
                            SN
                        </div>

                        <div class="topbar__profileinfo">

                            <div class="topbar__profilename">
                                Siti Nurhaliza
                            </div>

                            <div class="topbar__profilerole">
                                Bendahara • Kelas XI RPL 1
                            </div>

                        </div>

                        <span class="material-symbols-outlined topbar__chevron">
                            expand_more
                        </span>

                    </button>


                    <!-- PROFILE DROPDOWN -->
                    <div
                        class="dropdown"
                        id="profileDropdown"
                    >

                        <div class="dropdown__head">

                            <div class="dropdown__name">
                                Siti Nurhaliza
                            </div>

                            <div class="dropdown__mail">
                                siti.nurhaliza@gmail.com
                            </div>

                        </div>


                        <button
                            type="button"
                            class="dropdown__item"
                            id="btnProfileAccount"
                        >
                            <span class="material-symbols-outlined">
                                person
                            </span>

                            <span>
                                Profil
                            </span>
                        </button>


                        <button
                            type="button"
                            class="dropdown__item dropdown__item--danger"
                            id="btnProfileLogout"
                        >
                            <span class="material-symbols-outlined">
                                logout
                            </span>

                            <span>
                                Keluar
                            </span>
                        </button>

                    </div>

                </div>

            </div>

        </header>


        <!-- =====================================================
             CONTENT
        ====================================================== -->
        <main class="content">


            <!-- HERO -->
            <section class="hero">

                <div class="hero__text">

                    <span class="hero__eyebrow">
                        Bendahara • XI RPL 1
                    </span>

                    <h2 class="hero__title">
                        Riwayat Transaksi
                    </h2>

                    <p class="hero__sub">
                        Telusuri seluruh riwayat pemasukan dan
                        pengeluaran kas kelas XI RPL 1.
                        Gunakan pencarian dan filter untuk
                        menemukan transaksi yang dibutuhkan.
                    </p>

                </div>

            </section>


            <!-- =================================================
                 SUMMARY
            ================================================== -->
            <section
                class="stat-grid"
                aria-label="Ringkasan riwayat transaksi"
            >

                <!-- PEMASUKAN -->
                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>

                            <div class="stat-card__label">
                                Total Pemasukan
                            </div>

                            <div
                                class="stat-card__value"
                                id="sumMasuk"
                            >
                                Rp 0
                            </div>

                        </div>

                        <div class="stat-card__icon stat-card__icon--in">

                            <span class="material-symbols-outlined">
                                trending_up
                            </span>

                        </div>

                    </div>

                    <div
                        class="stat-card__foot"
                        id="sumMasukNote"
                    >
                        Sesuai filter
                    </div>

                </article>


                <!-- PENGELUARAN -->
                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>

                            <div class="stat-card__label">
                                Total Pengeluaran
                            </div>

                            <div
                                class="stat-card__value"
                                id="sumKeluar"
                            >
                                Rp 0
                            </div>

                        </div>

                        <div class="stat-card__icon stat-card__icon--out">

                            <span class="material-symbols-outlined">
                                trending_down
                            </span>

                        </div>

                    </div>

                    <div
                        class="stat-card__foot"
                        id="sumKeluarNote"
                    >
                        Sesuai filter
                    </div>

                </article>


                <!-- JUMLAH TRANSAKSI -->
                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>

                            <div class="stat-card__label">
                                Total Transaksi
                            </div>

                            <div
                                class="stat-card__value"
                                id="sumJumlah"
                            >
                                0
                            </div>

                        </div>

                        <div class="stat-card__icon stat-card__icon--trx">

                            <span class="material-symbols-outlined">
                                history
                            </span>

                        </div>

                    </div>

                    <div
                        class="stat-card__foot"
                        id="sumJumlahNote"
                    >
                        Sesuai filter
                    </div>

                </article>

            </section>


            <!-- =================================================
                 FILTER
            ================================================== -->
            <section
                class="panel filter-panel"
                aria-label="Filter riwayat transaksi"
            >

                <div class="panel__head">

                    <div>

                        <div class="panel__eyebrow">
                            FILTER RIWAYAT
                        </div>

                        <div class="panel__title">
                            Cari dan Filter Transaksi
                        </div>

                        <div class="panel__sub">
                            Data hanya menampilkan transaksi
                            kelas XI RPL 1.
                        </div>

                    </div>

                </div>


                <div class="filterbar">


                    <!-- SEARCH -->
                    <div class="filterbar__search">

                        <span class="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="search"
                            id="cariRiwayat"
                            placeholder="Cari ID, keterangan, kategori..."
                            autocomplete="off"
                        >

                    </div>


                    <!-- JENIS -->
                    <div class="field">

                        <label for="filterJenis">
                            Jenis
                        </label>

                        <select id="filterJenis">

                            <option value="semua">
                                Semua Jenis
                            </option>

                            <option value="masuk">
                                Pemasukan
                            </option>

                            <option value="keluar">
                                Pengeluaran
                            </option>

                        </select>

                    </div>


                    <!-- KATEGORI -->
                    <div class="field">

                        <label for="filterKategori">
                            Kategori
                        </label>

                        <select id="filterKategori">

                            <option value="semua">
                                Semua Kategori
                            </option>

                        </select>

                    </div>


                    <!-- BULAN -->
                    <div class="field">

                        <label for="filterBulan">
                            Bulan
                        </label>

                        <select id="filterBulan">

                            <option value="semua">
                                Semua Bulan
                            </option>

                            <option value="2026-10">
                                Oktober 2026
                            </option>

                            <option value="2026-09">
                                September 2026
                            </option>

                            <option value="2026-08">
                                Agustus 2026
                            </option>

                        </select>

                    </div>


                    <!-- RESET -->
                    <div class="filter-actions">

                        <button
                            type="button"
                            class="btn btn--ghost"
                            id="btnResetFilter"
                        >

                            <span class="material-symbols-outlined">
                                restart_alt
                            </span>

                            Reset

                        </button>

                    </div>

                </div>

            </section>


            <!-- =================================================
                 TABLE
            ================================================== -->
            <section class="panel">

                <div class="panel__head">

                    <div>

                        <div class="panel__eyebrow">
                            ARSIP KAS
                        </div>

                        <div class="panel__title">
                            Riwayat Lengkap
                        </div>

                        <div
                            class="panel__sub"
                            id="tabelInfo"
                        >
                            0 transaksi ditampilkan
                        </div>

                    </div>

                </div>


                <div class="table-wrap">

                    <table class="table">

                        <thead>

                            <tr>

                                <th>
                                    ID Transaksi
                                </th>

                                <th>
                                    Keterangan
                                </th>

                                <th>
                                    Kategori
                                </th>

                                <th>
                                    Tanggal
                                </th>

                                <th class="th-r">
                                    Nominal
                                </th>

                                <th>
                                    Petugas
                                </th>

                                <th class="th-c">
                                    Aksi
                                </th>

                            </tr>

                        </thead>


                        <tbody id="isiTabelRiwayat"></tbody>

                    </table>


                    <!-- EMPTY STATE -->
                    <div
                        class="empty-state"
                        id="emptyState"
                        hidden
                    >

                        <span class="material-symbols-outlined">
                            search_off
                        </span>

                        <p>
                            Tidak ada riwayat transaksi yang
                            cocok dengan pencarian atau filter.
                        </p>

                        <button
                            type="button"
                            class="btn btn--ghost"
                            id="btnKosongkanFilter"
                        >
                            <span class="material-symbols-outlined">
                                restart_alt
                            </span>

                            Reset Filter
                        </button>

                    </div>

                </div>

            </section>


            <!-- FOOTER -->
            <div class="content__foot">

                Riwayat transaksi Bendahara •
                Kelas XI RPL 1 •
                Tahun Ajaran 2026/2027

            </div>

        </main>

    </div>

</div>


<!-- =========================================================
     MODAL DETAIL TRANSAKSI
========================================================= -->
<div
    class="modal-backdrop"
    id="modalDetail"
    aria-hidden="true"
>

    <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalDetailTitle"
    >

        <div class="modal__head">

            <div>

                <div class="modal__eyebrow">
                    DETAIL TRANSAKSI
                </div>

                <h3
                    class="modal__title"
                    id="modalDetailTitle"
                >
                    TRX-0000
                </h3>

            </div>


            <button
                type="button"
                class="modal__close"
                data-tutup-modal="modalDetail"
                aria-label="Tutup"
            >

                <span class="material-symbols-outlined">
                    close
                </span>

            </button>

        </div>


        <div class="modal__body">


            <div class="detail-grid">

                <div class="detail-item">
                    <span class="detail-item__label">
                        Jenis
                    </span>

                    <span
                        class="detail-item__value"
                        id="detailJenis"
                    >
                        —
                    </span>
                </div>


                <div class="detail-item">
                    <span class="detail-item__label">
                        Kategori
                    </span>

                    <span
                        class="detail-item__value"
                        id="detailKategori"
                    >
                        —
                    </span>
                </div>


                <div class="detail-item">
                    <span class="detail-item__label">
                        Kelas
                    </span>

                    <span
                        class="detail-item__value"
                        id="detailKelas"
                    >
                        XI RPL 1
                    </span>
                </div>


                <div class="detail-item">
                    <span class="detail-item__label">
                        Tanggal
                    </span>

                    <span
                        class="detail-item__value"
                        id="detailTanggal"
                    >
                        —
                    </span>
                </div>


                <div class="detail-item">
                    <span class="detail-item__label">
                        Waktu
                    </span>

                    <span
                        class="detail-item__value"
                        id="detailWaktu"
                    >
                        —
                    </span>
                </div>


                <div class="detail-item">

                    <span class="detail-item__label">
                        Metode
                    </span>

                    <span
                        class="detail-item__value"
                        id="detailMetode"
                    >
                        —
                    </span>

                </div>


                <div class="detail-item">

                    <span class="detail-item__label">
                        Dicatat oleh
                    </span>

                    <span
                        class="detail-item__value"
                        id="detailPetugas"
                    >
                        —
                    </span>

                </div>

            </div>


            <div class="detail-keterangan">

                <span>
                    Keterangan
                </span>

                <p id="detailKeterangan">
                    —
                </p>

            </div>


            <!-- RINCIAN UANG -->
            <div
                class="uang-rincian"
                id="uangRincian"
            >

                <p class="uang-rincian__title">

                    <span class="material-symbols-outlined">
                        payments
                    </span>

                    Rincian Uang

                </p>


                <div class="uang-rincian__baris">

                    <span>
                        Jumlah yang harus dibayar
                    </span>

                    <b id="rincianTagihan">
                        —
                    </b>

                </div>


                <div class="uang-rincian__baris">

                    <span id="rincianLabelDiterima">
                        Jumlah uang yang diterima Bendahara
                    </span>

                    <b id="rincianDiterima">
                        —
                    </b>

                </div>


                <div class="uang-rincian__baris">

                    <span>
                        Jumlah kembalian
                    </span>

                    <b id="rincianKembalian">
                        —
                    </b>

                </div>


                <div class="uang-rincian__baris uang-rincian__baris--utama">

                    <span id="rincianLabelMasukKas">
                        Jumlah uang yang masuk ke kas
                    </span>

                    <b id="rincianMasukKas">
                        —
                    </b>

                </div>

            </div>


            <div class="modal__foot">

                <button
                    type="button"
                    class="btn btn--ghost"
                    data-tutup-modal="modalDetail"
                >
                    Tutup
                </button>

            </div>

        </div>

    </div>

</div>


<!-- TOAST -->
<div
    class="toast"
    id="toast"
    role="status"
    aria-live="polite"
>

    <span class="material-symbols-outlined">
        check_circle
    </span>

    <span id="toastText">
        Berhasil
    </span>

</div>

</body>
</html>
