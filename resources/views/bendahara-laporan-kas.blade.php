<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Laporan Kas | BBCashvia</title>


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
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
        rel="stylesheet"
    >

    {{-- MATERIAL SYMBOLS SAMA DENGAN BENDAHARA DASHBOARD --}}
    <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400..700,0..1,0"
        rel="stylesheet"
    >


    {{-- =====================================================
         VITE
    ====================================================== --}}

    @vite([
        'resources/css/bendahara-laporan-kas.css',
        'resources/js/bendahara-laporan-kas.js'
    ])

</head>


<body>

<div class="app-shell">


    {{-- =====================================================
         SIDEBAR
    ====================================================== --}}

    <aside
        class="sidebar"
        id="sidebar"
    >


        {{-- =================================================
             BRAND
        ================================================== --}}

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


        {{-- =================================================
             NAVIGATION
        ================================================== --}}

        <nav class="sidebar__nav">


            {{-- =================================================
                 MENU UTAMA
            ================================================== --}}

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


            {{-- =================================================
                 DATA & IURAN
            ================================================== --}}

            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    DATA &amp; IURAN
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


            {{-- =================================================
                 TRANSAKSI
            ================================================== --}}

            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    TRANSAKSI
                </div>


                <a
                    href="/bendahara/transaksi"
                    class="side-link"
                >

                    {{-- SAMA DENGAN BENDAHARA DASHBOARD --}}

                    <span class="material-symbols-outlined">
                        payments
                    </span>

                    <span>
                        Transaksi
                    </span>

                </a>

            </div>


            {{-- =================================================
                 LAPORAN
            ================================================== --}}

            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    LAPORAN
                </div>


                <a
                    href="/bendahara/laporan-kas"
                    class="side-link is-active"
                >

                    {{-- SAMA DENGAN BENDAHARA DASHBOARD --}}

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


        {{-- =================================================
             SIDEBAR FOOT
        ================================================== --}}

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
                        Bendahara • XI RPL 1
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


    {{-- =====================================================
         SIDEBAR BACKDROP
    ====================================================== --}}

    <div
        class="sidebar-backdrop"
        id="sidebarBackdrop"
    ></div>


    {{-- =====================================================
         MAIN SHELL
    ====================================================== --}}

    <div class="shell">


        {{-- =================================================
             TOPBAR
        ================================================== --}}

        <header class="topbar">


            <div class="topbar__left">


                {{-- HAMBURGER TABLET / MOBILE --}}

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
                        Laporan Kas
                    </h1>

                    <p>
                        Ringkasan dan arus kas kelas
                    </p>

                </div>

            </div>


            <div class="topbar__right">


                {{-- =================================================
                     TAHUN AJARAN
                ================================================== --}}

                <div class="topbar__chip">

                    <span class="material-symbols-outlined">
                        calendar_month
                    </span>

                    <span>
                        T.A 2026/2027
                    </span>

                </div>


                {{-- =================================================
                     PROFILE
                ================================================== --}}

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
                                Bendahara • XI RPL 1
                            </div>

                        </div>


                        <span class="material-symbols-outlined topbar__chevron">
                            expand_more
                        </span>

                    </button>


                    {{-- =================================================
                         PROFILE DROPDOWN
                    ================================================== --}}

                    <div
                        class="dropdown"
                        id="profileDropdown"
                    >


                        <div class="dropdown__head">

                            <div class="dropdown__name">
                                Siti Nurhaliza
                            </div>

                            <div class="dropdown__mail">
                                Bendahara • Kelas XI RPL 1
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


        {{-- =====================================================
             MAIN CONTENT
        ====================================================== --}}

        <main class="content">


            {{-- =================================================
                 HERO
            ================================================== --}}

            <section class="hero">


                <div class="hero__text">

                    <span class="hero__eyebrow">
                        Bendahara • XI RPL 1
                    </span>


                    <h2 class="hero__title">
                        Laporan Kas
                    </h2>


                    <p class="hero__sub">
                        Pantau arus kas kelas XI RPL 1 berdasarkan
                        pemasukan, pengeluaran, dan saldo kas
                        pada periode yang dipilih.
                    </p>

                </div>


                <div class="hero__actions">


                    <button
                        type="button"
                        class="btn btn--ghost"
                        id="btnCetak"
                    >

                        <span class="material-symbols-outlined">
                            print
                        </span>

                        Cetak

                    </button>


                    <button
                        type="button"
                        class="btn btn--primary"
                        id="btnEkspor"
                    >

                        <span class="material-symbols-outlined">
                            download
                        </span>

                        Ekspor CSV

                    </button>

                </div>

            </section>


            {{-- =================================================
                 SUMMARY
            ================================================== --}}

            <section class="stat-grid">


                {{-- TOTAL PEMASUKAN --}}

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
                        Belum ada transaksi
                    </div>

                </article>


                {{-- TOTAL PENGELUARAN --}}

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
                        Belum ada transaksi
                    </div>

                </article>


                {{-- SALDO KAS --}}

                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>

                            <div class="stat-card__label">
                                Saldo Kas Akhir
                            </div>

                            <div
                                class="stat-card__value"
                                id="sumSaldo"
                            >
                                Rp 0
                            </div>

                        </div>


                        <div class="stat-card__icon stat-card__icon--kas">

                            <span class="material-symbols-outlined">
                                account_balance_wallet
                            </span>

                        </div>

                    </div>


                    <div
                        class="stat-card__foot"
                        id="sumSaldoNote"
                    >
                        Saldo setelah transaksi
                    </div>

                </article>


                {{-- JUMLAH TRANSAKSI --}}

                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>

                            <div class="stat-card__label">
                                Jumlah Transaksi
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
                                receipt_long
                            </span>

                        </div>

                    </div>


                    <div
                        class="stat-card__foot"
                        id="sumJumlahNote"
                    >
                        Transaksi kelas XI RPL 1
                    </div>

                </article>

            </section>


            {{-- =================================================
                 FILTER
            ================================================== --}}

            <section class="panel filter-panel">


                <div class="panel__head">

                    <div>

                        <div class="panel__eyebrow">
                            Filter Laporan
                        </div>

                        <div class="panel__title">
                            Periode dan Jenis Transaksi
                        </div>

                        <div class="panel__sub">
                            Data laporan hanya menampilkan transaksi
                            kelas XI RPL 1.
                        </div>

                    </div>

                </div>


                <div class="filterbar">


                    <div class="field">

                        <label for="filterMulai">
                            Dari Tanggal
                        </label>

                        <input
                            type="date"
                            id="filterMulai"
                        >

                    </div>


                    <div class="field">

                        <label for="filterSelesai">
                            Sampai Tanggal
                        </label>

                        <input
                            type="date"
                            id="filterSelesai"
                        >

                    </div>


                    <div class="field">

                        <label for="filterBulan">
                            Bulan
                        </label>

                        <select id="filterBulan">

                            <option value="">
                                Semua Bulan
                            </option>

                        </select>

                    </div>


                    <div class="field">

                        <label for="filterTahun">
                            Tahun
                        </label>

                        <select id="filterTahun">

                            <option value="">
                                Semua Tahun
                            </option>

                        </select>

                    </div>


                    <div class="field">

                        <label for="filterJenis">
                            Jenis
                        </label>

                        <select id="filterJenis">

                            <option value="">
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


                    <div class="field">

                        <label for="filterKategori">
                            Kategori
                        </label>

                        <select id="filterKategori">

                            <option value="">
                                Semua Kategori
                            </option>

                        </select>

                    </div>


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


            {{-- =================================================
                 GRAFIK
            ================================================== --}}

            <section class="panel chart-panel">


                <div class="panel__head">

                    <div>

                        <div class="panel__eyebrow">
                            Arus Kas
                        </div>

                        <div class="panel__title">
                            Grafik Pemasukan &amp; Pengeluaran
                        </div>

                        <div class="panel__sub">
                            Perbandingan arus kas berdasarkan bulan.
                        </div>

                    </div>

                </div>


                <div
                    class="chart-empty"
                    id="grafikKosong"
                >

                    <span class="material-symbols-outlined">
                        bar_chart
                    </span>

                    <span>
                        Belum ada data untuk ditampilkan.
                    </span>

                </div>


                <div
                    class="barchart"
                    id="barChart"
                >

                    <div
                        class="barchart__ylabs"
                        id="chartYLabels"
                    ></div>


                    <div class="barchart__plot">

                        <div
                            class="barchart__gl"
                            style="top: 0;"
                        ></div>

                        <div
                            class="barchart__gl"
                            style="top: 25%;"
                        ></div>

                        <div
                            class="barchart__gl"
                            style="top: 50%;"
                        ></div>

                        <div
                            class="barchart__gl"
                            style="top: 75%;"
                        ></div>

                        <div
                            class="barchart__gl barchart__gl--base"
                        ></div>


                        <div
                            class="barchart__cols"
                            id="chartColumns"
                        ></div>

                    </div>

                </div>


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

            </section>


            {{-- =================================================
                 BUKU KAS
            ================================================== --}}

            <section class="panel laporan-panel">


                <div class="panel__head">

                    <div>

                        <div class="panel__eyebrow">
                            Buku Kas
                        </div>

                        <div class="panel__title">
                            Rincian Arus Kas
                        </div>

                        <div class="panel__sub">
                            Saldo dihitung berdasarkan urutan transaksi
                            kelas XI RPL 1.
                        </div>

                    </div>

                </div>


                <div class="table-wrap">


                    <table class="table">


                        <thead>

                            <tr>

                                <th>
                                    Tanggal
                                </th>

                                <th>
                                    Keterangan
                                </th>

                                <th>
                                    Kategori
                                </th>

                                <th>
                                    Pemasukan
                                </th>

                                <th>
                                    Pengeluaran
                                </th>

                                <th>
                                    Saldo
                                </th>

                            </tr>

                        </thead>


                        <tbody id="isiTabelLaporan">

                            <tr>

                                <td
                                    colspan="6"
                                    class="table__empty"
                                >
                                    Memuat data laporan...
                                </td>

                            </tr>

                        </tbody>


                        <tfoot id="footTabelLaporan"></tfoot>

                    </table>

                </div>


                {{-- EMPTY STATE --}}

                <div
                    class="table-empty"
                    id="emptyState"
                >


                    <div class="table-empty__icon">

                        <span class="material-symbols-outlined">
                            receipt_long
                        </span>

                    </div>


                    <div class="table-empty__title">
                        Tidak ada data laporan
                    </div>


                    <div class="table-empty__sub">
                        Belum ada transaksi yang sesuai dengan filter
                        yang dipilih.
                    </div>


                    <button
                        type="button"
                        class="btn btn--ghost"
                        id="btnKosongkanFilter"
                    >

                        <span class="material-symbols-outlined">
                            filter_alt_off
                        </span>

                        Tampilkan Semua Data

                    </button>

                </div>


                <div
                    class="table-info"
                    id="tabelInfo"
                >
                    Menampilkan 0 transaksi
                </div>

            </section>


            {{-- =================================================
                 FOOTER
            ================================================== --}}

            <div class="content__foot">

                Laporan kas Bendahara •
                Kelas XI RPL 1 •
                Tahun Ajaran 2026/2027

            </div>

        </main>

    </div>

</div>


{{-- =========================================================
     PRINT HEADER
========================================================= --}}

<div class="print-only print-head">

    <div class="print-head__brand">
        BBCashvia
    </div>


    <div class="print-head__title">
        Laporan Kas — Kelas XI RPL 1
    </div>


    <div
        class="print-head__periode"
        id="printPeriode"
    >
        Semua periode
    </div>

</div>


{{-- =========================================================
     TOAST
========================================================= --}}

<div
    class="toast"
    id="toast"
    role="status"
    aria-live="polite"
>


    <span
        class="material-symbols-outlined"
        id="toastIcon"
    >
        check_circle
    </span>


    <span id="toastText">
        Berhasil
    </span>

</div>


</body>
</html>
