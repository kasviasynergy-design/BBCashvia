<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Transaksi — BBCashvia</title>

    <meta name="description"
        content="Halaman Transaksi BBCashvia — catat pemasukan dan pengeluaran kas kelas lengkap dengan rincian tagihan, uang diterima, kembalian, dan uang yang masuk ke kas.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet">

    @vite([
        'resources/css/admin-transaksi.css',
        'resources/js/admin-transaksi.js'
    ])
</head>

<body>

    <!-- ===== BACKDROP SIDEBAR (TABLET / MOBILE) ===== -->
    <div class="sidebar-backdrop" id="sidebarBackdrop" aria-hidden="true"></div>


    <!-- =====================================================
         SIDEBAR
    ====================================================== -->
    <aside class="sidebar" id="sidebar" aria-label="Navigasi utama">

        <!-- ===== BRAND ===== -->
        <div class="sidebar__brand">

            <div class="sidebar__logo">
                <span class="material-symbols-outlined" aria-hidden="true">
                    account_balance_wallet
                </span>
            </div>

            <div class="sidebar__brandtext">
                <span class="sidebar__brandname">BBCashvia</span>
                <span class="sidebar__brandsub">Kas Kelas Digital</span>
            </div>

        </div>


        <!-- =================================================
             NAVIGASI SIDEBAR
        ================================================== -->
        <nav class="sidebar__nav">

            <!-- ===== MENU UTAMA ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Menu Utama
                </div>

                <a href="/dashboard/admin" class="side-link">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        dashboard
                    </span>

                    <span class="side-link__text">
                        Dashboard
                    </span>

                </a>

            </div>


            <!-- ===== KEUANGAN ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Keuangan
                </div>

                <a href="/admin/transaksi"
                    class="side-link is-active"
                    aria-current="page">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        receipt_long
                    </span>

                    <span class="side-link__text">
                        Transaksi
                    </span>

                </a>


                <a href="/admin/iuran" class="side-link">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        sell
                    </span>

                    <span class="side-link__text">
                        Iuran
                    </span>

                </a>

            </div>


            <!-- ===== DATA ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Data
                </div>

                <a href="/admin/siswa" class="side-link">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        school
                    </span>

                    <span class="side-link__text">
                        Data Siswa
                    </span>

                </a>

            </div>


            <!-- ===== LAPORAN ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Laporan
                </div>

                <a href="/admin/laporan-kas" class="side-link">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        monitoring
                    </span>

                    <span class="side-link__text">
                        Laporan Kas
                    </span>

                </a>


                <a href="/admin/riwayat-transaksi" class="side-link">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        manage_search
                    </span>

                    <span class="side-link__text">
                        Riwayat Transaksi
                    </span>

                </a>

            </div>


            <!-- ===== MANAJEMEN ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Manajemen
                </div>

                <a href="/admin/manajemen-pengguna" class="side-link">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        admin_panel_settings
                    </span>

                    <span class="side-link__text">
                        Manajemen Pengguna
                    </span>

                </a>

            </div>

        </nav>


        <!-- =================================================
             FOOTER SIDEBAR
        ================================================== -->
        <div class="sidebar__foot">

            <div class="sidebar__user">

                <div class="sidebar__avatar" aria-hidden="true">
                    AN
                </div>

                <div class="sidebar__userinfo">

                    <span class="sidebar__username">
                        Azis N.
                    </span>

                    <span class="sidebar__userrole">
                        Admin
                    </span>

                </div>

            </div>


            <a href="/" class="sidebar__logout">

                <span class="material-symbols-outlined" aria-hidden="true">
                    logout
                </span>

                <span>
                    Keluar
                </span>

            </a>

        </div>

    </aside>


    <!-- =====================================================
         KONTEN UTAMA
    ====================================================== -->
    <div class="shell">

        <!-- ===== TOPBAR ===== -->
        <header class="topbar">

            <div class="topbar__left">

                <button type="button"
                    class="topbar__burger"
                    id="sidebarToggle"
                    aria-label="Buka menu navigasi">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        menu
                    </span>

                </button>


                <div class="topbar__title">

                    <h1>
                        Transaksi
                    </h1>

                    <p id="topbarDate">
                        —
                    </p>

                </div>

            </div>


            <div class="topbar__right">

                <!-- ===== TAHUN AJARAN ===== -->
                <span class="topbar__chip">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        calendar_month
                    </span>

                    TA 2026/2027 • Ganjil

                </span>


                <!-- ===== PROFILE ===== -->
                <div class="topbar__profilewrap">

                    <button type="button"
                        class="topbar__profile"
                        id="profileBtn"
                        aria-haspopup="true"
                        aria-expanded="false">

                        <span class="topbar__avatar" aria-hidden="true">
                            AN
                        </span>

                        <span class="topbar__profileinfo">

                            <span class="topbar__profilename">
                                Azis N.
                            </span>

                            <span class="topbar__profilerole">
                                Admin
                            </span>

                        </span>

                        <span class="material-symbols-outlined topbar__chevron"
                            aria-hidden="true">
                            expand_more
                        </span>

                    </button>


                    <div class="dropdown"
                        id="profileMenu"
                        role="menu">

                        <div class="dropdown__head">

                            <span class="dropdown__name">
                                Azis N.
                            </span>

                            <span class="dropdown__mail">
                                azinun@bbcashvia.sch.id
                            </span>

                        </div>


                        <a href="/"
                            class="dropdown__item dropdown__item--danger"
                            role="menuitem">

                            <span class="material-symbols-outlined"
                                aria-hidden="true">
                                logout
                            </span>

                            <span>
                                Keluar
                            </span>

                        </a>

                    </div>

                </div>

            </div>

        </header>


        <!-- =================================================
             KONTEN
        ================================================== -->
        <main class="content">

            <!-- ===== KEPALA HALAMAN ===== -->
            <section class="page-head">

                <div class="page-head__text">

                    <p class="page-head__eyebrow">
                        Panel Admin • Kas Kelas
                    </p>

                    <h2 class="page-head__title">
                        Transaksi
                    </h2>

                    <p class="page-head__sub">
                        Catat setiap pemasukan dan pengeluaran kas kelas — lengkap dengan rincian
                        tagihan, uang diterima, kembalian, dan uang yang masuk ke kas.
                    </p>

                </div>


                <div class="page-head__actions">

                    <button type="button"
                        class="btn btn--primary"
                        id="btnTambahTransaksi">

                        <span class="material-symbols-outlined" aria-hidden="true">
                            post_add
                        </span>

                        <span>
                            Catat Transaksi
                        </span>

                    </button>

                </div>

            </section>


            <!-- =================================================
                 RINGKASAN
            ================================================== -->
            <section class="sum-grid"
                aria-label="Ringkasan transaksi">

                <article class="sum-card sum-card--masuk">

                    <div class="sum-card__iconwrap">

                        <span class="material-symbols-outlined"
                            aria-hidden="true">
                            trending_up
                        </span>

                    </div>

                    <div>

                        <p class="sum-card__label">
                            Total Pemasukan
                        </p>

                        <p class="sum-card__value"
                            id="sumMasuk">
                            —
                        </p>

                        <p class="sum-card__note"
                            id="sumMasukNote">
                            sesuai filter
                        </p>

                    </div>

                </article>


                <article class="sum-card sum-card--keluar">

                    <div class="sum-card__iconwrap">

                        <span class="material-symbols-outlined"
                            aria-hidden="true">
                            trending_down
                        </span>

                    </div>

                    <div>

                        <p class="sum-card__label">
                            Total Pengeluaran
                        </p>

                        <p class="sum-card__value"
                            id="sumKeluar">
                            —
                        </p>

                        <p class="sum-card__note"
                            id="sumKeluarNote">
                            sesuai filter
                        </p>

                    </div>

                </article>


                <article class="sum-card sum-card--saldo">

                    <div class="sum-card__iconwrap">

                        <span class="material-symbols-outlined"
                            aria-hidden="true">
                            account_balance
                        </span>

                    </div>

                    <div>

                        <p class="sum-card__label">
                            Selisih Bersih
                        </p>

                        <p class="sum-card__value"
                            id="sumSelisih">
                            —
                        </p>

                        <p class="sum-card__note"
                            id="sumSelisihNote">
                            pemasukan − pengeluaran
                        </p>

                    </div>

                </article>

            </section>


            <!-- =================================================
                 PANEL FILTER
            ================================================== -->
            <section class="panel filterbar"
                aria-label="Filter transaksi">

                <div class="filterbar__search">

                    <span class="material-symbols-outlined"
                        aria-hidden="true">
                        search
                    </span>

                    <input type="search"
                        id="cariTransaksi"
                        placeholder="Cari ID, keterangan, atau kategori…"
                        autocomplete="off">

                </div>


                <div class="filterbar__selects">

                    <label class="field-select">

                        <span class="field-select__label">
                            Jenis
                        </span>

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

                    </label>


                    <label class="field-select">

                        <span class="field-select__label">
                            Kategori
                        </span>

                        <select id="filterKategori">

                            <option value="semua">
                                Semua Kategori
                            </option>

                        </select>

                    </label>


                    <label class="field-select">

                        <span class="field-select__label">
                            Bulan
                        </span>

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

                    </label>


                    <button type="button"
                        class="btn btn--ghost btn--sm"
                        id="btnResetFilter">

                        <span class="material-symbols-outlined"
                            aria-hidden="true">
                            restart_alt
                        </span>

                        <span>
                            Reset
                        </span>

                    </button>

                </div>

            </section>


            <!-- =================================================
                 TABEL TRANSAKSI
            ================================================== -->
            <section class="panel">

                <div class="panel__head">

                    <div>

                        <p class="panel__eyebrow">
                            BUKU KAS
                        </p>

                        <h3 class="panel__title">
                            Daftar Transaksi
                        </h3>

                        <p class="panel__sub"
                            id="tabelInfo">
                            — transaksi ditampilkan
                        </p>

                    </div>

                </div>


                <div class="table-wrap">

                    <table class="table">

                        <thead>

                            <tr>

                                <th scope="col">
                                    ID Transaksi
                                </th>

                                <th scope="col">
                                    Keterangan
                                </th>

                                <th scope="col">
                                    Kategori
                                </th>

                                <th scope="col">
                                    Tanggal
                                </th>

                                <th scope="col"
                                    class="th-r">
                                    Nominal
                                </th>

                                <th scope="col"
                                    class="th-c">
                                    Aksi
                                </th>

                            </tr>

                        </thead>

                        <tbody id="isiTabelTransaksi"></tbody>

                    </table>


                    <div class="empty-state"
                        id="emptyState"
                        hidden>

                        <span class="material-symbols-outlined"
                            aria-hidden="true">
                            search_off
                        </span>

                        <p>
                            Tidak ada transaksi yang cocok dengan filter.
                        </p>

                        <button type="button"
                            class="btn btn--ghost btn--sm"
                            id="btnKosongkanFilter">

                            Reset Filter

                        </button>

                    </div>

                </div>

            </section>


            <!-- ===== FOOTER ===== -->
            <footer class="content__foot">

                BBCashvia — Kas Kelas Digital • Data yang tampil merupakan data simulasi untuk pengembangan tampilan.

            </footer>

        </main>

    </div>


    <!-- =====================================================
         MODAL: CATAT / UBAH TRANSAKSI
    ====================================================== -->
    <div class="modal-backdrop"
        id="modalForm"
        aria-hidden="true">

        <div class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalFormTitle">

            <div class="modal__head">

                <div>

                    <p class="modal__eyebrow"
                        id="modalFormEyebrow">
                        TRANSAKSI BARU
                    </p>

                    <h3 class="modal__title"
                        id="modalFormTitle">
                        Catat Transaksi
                    </h3>

                </div>


                <button type="button"
                    class="modal__close"
                    data-tutup-modal="modalForm"
                    aria-label="Tutup">

                    <span class="material-symbols-outlined"
                        aria-hidden="true">
                        close
                    </span>

                </button>

            </div>


            <form class="modal__body"
                id="formTransaksi"
                novalidate>

                <!-- ===== JENIS TRANSAKSI ===== -->
                <div class="field">

                    <span class="field__label">
                        Jenis Transaksi
                    </span>

                    <div class="jenis-toggle"
                        role="radiogroup"
                        aria-label="Jenis transaksi">

                        <label class="jenis-pill">

                            <input type="radio"
                                name="jenisTransaksi"
                                value="masuk"
                                checked>

                            <span class="material-symbols-outlined"
                                aria-hidden="true">
                                trending_up
                            </span>

                            <span>
                                Pemasukan
                            </span>

                        </label>


                        <label class="jenis-pill">

                            <input type="radio"
                                name="jenisTransaksi"
                                value="keluar">

                            <span class="material-symbols-outlined"
                                aria-hidden="true">
                                trending_down
                            </span>

                            <span>
                                Pengeluaran
                            </span>

                        </label>

                    </div>

                </div>


                <div class="form-grid">

                    <label class="field">

                        <span class="field__label">
                            Kategori <b class="wajib">*</b>
                        </span>

                        <select id="inputKategori"
                            required>
                        </select>

                    </label>


                    <label class="field">

                        <span class="field__label">
                            Kelas
                        </span>

                        <select id="inputKelas">

                            <option value="">
                                — Pilih kelas (opsional) —
                            </option>

                            <option value="XI RPL 1">
                                XI RPL 1
                            </option>

                            <option value="XI RPL 2">
                                XI RPL 2
                            </option>

                            <option value="X TKJ 1">
                                X TKJ 1
                            </option>

                        </select>

                    </label>

                </div>


                <label class="field">

                    <span class="field__label">
                        Keterangan <b class="wajib">*</b>
                    </span>

                    <input type="text"
                        id="inputKeterangan"
                        placeholder="Contoh: Setoran kas mingguan XI RPL 1"
                        required
                        autocomplete="off">

                </label>


                <div class="form-grid">

                    <label class="field">

                        <span class="field__label">
                            Tanggal <b class="wajib">*</b>
                        </span>

                        <input type="date"
                            id="inputTanggal"
                            required>

                    </label>

                </div>


                <!-- =================================================
                     RINCIAN UANG
                ================================================== -->
                <div class="uang-box"
                    id="uangBox">

                    <div class="uang-box__head">

                        <p class="uang-box__title">

                            <span class="material-symbols-outlined"
                                aria-hidden="true">
                                calculate
                            </span>

                            Rincian Uang

                        </p>


                        <p class="uang-box__note">

                            Isi <b>jumlah yang harus dibayar</b> dan
                            <b>uang yang diterima Bendahara</b> —
                            kembalian serta jumlah uang yang masuk ke kas dihitung otomatis.

                        </p>

                    </div>


                    <div class="uang-grid">

                        <!-- TAGIHAN -->
                        <label class="field field--uang">

                            <span class="field__label">

                                Jumlah yang harus dibayar
                                <b class="wajib">*</b>

                            </span>

                            <span class="input-uang">

                                <span class="input-uang__pre"
                                    aria-hidden="true">
                                    Rp
                                </span>

                                <input type="text"
                                    id="inputTagihan"
                                    inputmode="numeric"
                                    placeholder="0"
                                    autocomplete="off">

                            </span>

                        </label>


                        <!-- UANG DITERIMA -->
                        <label class="field field--uang">

                            <span class="field__label"
                                id="labelDiterima">

                                Jumlah uang yang diterima Bendahara
                                <b class="wajib">*</b>

                            </span>

                            <span class="input-uang">

                                <span class="input-uang__pre"
                                    aria-hidden="true">
                                    Rp
                                </span>

                                <input type="text"
                                    id="inputDiterima"
                                    inputmode="numeric"
                                    placeholder="0"
                                    autocomplete="off">

                            </span>

                        </label>


                        <!-- KEMBALIAN -->
                        <div class="field field--uang field--otomatis">

                            <span class="field__label">
                                Jumlah kembalian
                            </span>

                            <span class="input-uang input-uang--hasil">

                                <span class="input-uang__pre"
                                    aria-hidden="true">
                                    Rp
                                </span>

                                <output id="hasilKembalian"
                                    aria-live="polite">
                                    0
                                </output>

                            </span>

                        </div>


                        <!-- MASUK KAS -->
                        <div class="field field--uang field--otomatis">

                            <span class="field__label"
                                id="labelMasukKas">

                                Jumlah uang yang masuk ke kas

                            </span>

                            <span class="input-uang input-uang--hasil input-uang--utama">

                                <span class="input-uang__pre"
                                    aria-hidden="true">
                                    Rp
                                </span>

                                <output id="hasilMasukKas"
                                    aria-live="polite">
                                    0
                                </output>

                            </span>

                        </div>

                    </div>


                    <p class="uang-box__hint"
                        id="uangHint">

                        Contoh: tagihan Rp 10.000 dan diterima Rp 20.000 →
                        kembalian Rp 10.000,
                        uang yang masuk ke kas Rp 10.000.

                    </p>

                </div>


                <p class="form-error"
                    id="formError"
                    hidden>
                </p>


                <div class="modal__foot">

                    <button type="button"
                        class="btn btn--ghost"
                        data-tutup-modal="modalForm">

                        Batal

                    </button>


                    <button type="submit"
                        class="btn btn--primary"
                        id="btnSimpanTransaksi">

                        <span class="material-symbols-outlined"
                            aria-hidden="true">
                            check
                        </span>

                        <span id="btnSimpanText">
                            Simpan Transaksi
                        </span>

                    </button>

                </div>

            </form>

        </div>

    </div>


    <!-- =====================================================
         MODAL: DETAIL TRANSAKSI
    ====================================================== -->
    <div class="modal-backdrop"
        id="modalDetail"
        aria-hidden="true">

        <div class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalDetailTitle">

            <div class="modal__head">

                <div>

                    <p class="modal__eyebrow">
                        DETAIL TRANSAKSI
                    </p>

                    <h3 class="modal__title"
                        id="modalDetailTitle">
                        TRX-0000
                    </h3>

                </div>


                <button type="button"
                    class="modal__close"
                    data-tutup-modal="modalDetail"
                    aria-label="Tutup">

                    <span class="material-symbols-outlined"
                        aria-hidden="true">
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

                        <span class="detail-item__value"
                            id="detailJenis">
                            —
                        </span>

                    </div>


                    <div class="detail-item">

                        <span class="detail-item__label">
                            Kategori
                        </span>

                        <span class="detail-item__value"
                            id="detailKategori">
                            —
                        </span>

                    </div>


                    <div class="detail-item">

                        <span class="detail-item__label">
                            Kelas
                        </span>

                        <span class="detail-item__value"
                            id="detailKelas">
                            —
                        </span>

                    </div>


                    <div class="detail-item">

                        <span class="detail-item__label">
                            Tanggal
                        </span>

                        <span class="detail-item__value"
                            id="detailTanggal">
                            —
                        </span>

                    </div>


                    <div class="detail-item">

                        <span class="detail-item__label">
                            Waktu
                        </span>

                        <span class="detail-item__value"
                            id="detailWaktu">
                            —
                        </span>

                    </div>


                    <div class="detail-item">

                        <span class="detail-item__label">
                            Metode
                        </span>

                        <span class="detail-item__value">
                            Tunai
                        </span>

                    </div>


                    <div class="detail-item">

                        <span class="detail-item__label">
                            Dicatat oleh
                        </span>

                        <span class="detail-item__value"
                            id="detailPetugas">
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


                <!-- ===== RINCIAN UANG DETAIL ===== -->
                <div class="uang-rincian"
                    id="uangRincian">

                    <p class="uang-rincian__title">

                        <span class="material-symbols-outlined"
                            aria-hidden="true">
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

                    <button type="button"
                        class="btn btn--ghost"
                        data-tutup-modal="modalDetail">

                        Tutup

                    </button>

                </div>

            </div>

        </div>

    </div>


    <!-- =====================================================
         MODAL: KONFIRMASI HAPUS
    ====================================================== -->
    <div class="modal-backdrop"
        id="modalHapus"
        aria-hidden="true">

        <div class="modal modal--kecil"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="modalHapusTitle">

            <div class="modal__body modal__body--hapus">

                <span class="hapus-icon"
                    aria-hidden="true">

                    <span class="material-symbols-outlined">
                        delete
                    </span>

                </span>


                <h3 class="modal__title"
                    id="modalHapusTitle">

                    Hapus Transaksi?

                </h3>


                <p class="hapus-text"
                    id="hapusText">

                    Transaksi akan dihapus dari daftar.
                    Tindakan ini tidak dapat dibatalkan.

                </p>


                <div class="modal__foot modal__foot--tengah">

                    <button type="button"
                        class="btn btn--ghost"
                        data-tutup-modal="modalHapus">

                        Batal

                    </button>


                    <button type="button"
                        class="btn btn--danger"
                        id="btnKonfirmasiHapus">

                        <span class="material-symbols-outlined"
                            aria-hidden="true">
                            delete
                        </span>

                        <span>
                            Ya, Hapus
                        </span>

                    </button>

                </div>

            </div>

        </div>

    </div>


    <!-- =====================================================
         TOAST
    ====================================================== -->
    <div class="toast"
        id="toast"
        role="status"
        aria-live="polite">

        <span class="material-symbols-outlined"
            aria-hidden="true">
            check_circle
        </span>

        <span id="toastText">
            Tersimpan
        </span>

    </div>


</body>

</html>
