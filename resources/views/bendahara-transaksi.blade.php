<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Transaksi | BBCashvia</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0"
        rel="stylesheet"
    >

    @vite([
        'resources/css/bendahara-transaksi.css',
        'resources/js/bendahara-transaksi.js'
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
                <span class="material-symbols-outlined">account_balance_wallet</span>
            </div>

            <div class="sidebar__brandtext">
                <span class="sidebar__brandname">BBCashvia</span>
                <span class="sidebar__brandsub">KASVIA Synergy</span>
            </div>
        </div>


        <nav class="sidebar__nav">

            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    MENU UTAMA
                </div>

                <a
                    href="/dashboard/bendahara"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">dashboard</span>
                    <span>Dashboard</span>
                </a>

            </div>


            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    DATA &amp; IURAN
                </div>

                <a
                    href="/bendahara/siswa"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">groups</span>
                    <span>Siswa</span>
                </a>

                <a
                    href="/bendahara/iuran"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">receipt_long</span>
                    <span>Iuran</span>
                </a>

            </div>


            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    TRANSAKSI
                </div>

                <a
                    href="/bendahara/transaksi"
                    class="side-link is-active"
                >
                    <span class="material-symbols-outlined">payments</span>
                    <span>Transaksi</span>
                </a>

            </div>


            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    LAPORAN
                </div>

                <a
                    href="/bendahara/laporan-kas"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">account_balance</span>
                    <span>Laporan Kas</span>
                </a>

                <a
                    href="/bendahara/riwayat-transaksi"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">history</span>
                    <span>Riwayat Transaksi</span>
                </a>

            </div>

        </nav>


        <div class="sidebar__foot">

            <div class="sidebar__user">

                <div class="sidebar__avatar">
                    SN
                </div>

                <div class="sidebar__userinfo">

                    <span class="sidebar__username">
                        Siti Nurhaliza
                    </span>

                    <span class="sidebar__userrole">
                        Bendahara • XI RPL 1
                    </span>

                </div>

            </div>


            <button
                type="button"
                class="sidebar__logout"
                id="sidebarLogout"
            >
                <span class="material-symbols-outlined">
                    logout
                </span>

                <span>Keluar</span>
            </button>

        </div>

    </aside>


    <div
        class="sidebar-backdrop"
        id="sidebarBackdrop"
    ></div>


    <!-- =====================================================
         SHELL
    ====================================================== -->

    <div class="shell">

        <!-- =================================================
             TOPBAR
        ================================================== -->

        <header class="topbar">

            <div class="topbar__left">

                <button
                    type="button"
                    class="topbar__burger"
                    id="sidebarToggle"
                    aria-label="Buka menu"
                >
                    <span class="material-symbols-outlined">
                        menu
                    </span>
                </button>


                <div class="topbar__title">

                    <h1>
                        Transaksi
                    </h1>

                    <p id="topbarDate">
                        Selasa, 6 Oktober 2026
                    </p>

                </div>

            </div>


            <div class="topbar__right">

                <div class="topbar__chip">

                    <span class="material-symbols-outlined">
                        calendar_month
                    </span>

                    <span>
                        T.A 2026/2027 Ganjil
                    </span>

                </div>


                <div class="topbar__profilewrap">

                    <button
                        type="button"
                        class="topbar__profile"
                        id="profileButton"
                        aria-expanded="false"
                    >

                        <span class="topbar__avatar">
                            SN
                        </span>

                        <span class="topbar__profileinfo">

                            <span class="topbar__profilename">
                                Siti Nurhaliza
                            </span>

                            <span class="topbar__profilerole">
                                Bendahara • XI RPL 1
                            </span>

                        </span>

                        <span class="material-symbols-outlined topbar__chevron">
                            expand_more
                        </span>

                    </button>


                    <div
                        class="dropdown"
                        id="profileDropdown"
                    >

                        <div class="dropdown__head">

                            <span class="dropdown__name">
                                Siti Nurhaliza
                            </span>

                            <span class="topbar__profilerole">
                                Bendahara • XI RPL 1
                            </span>

                            <span class="dropdown__mail">
                                siti.nurhaliza@gmail.com
                            </span>

                        </div>


                        <button
                            type="button"
                            class="dropdown__item dropdown__item--danger"
                            id="dropdownLogout"
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


        <!-- =================================================
             CONTENT
        ================================================== -->

        <main class="content">

            <!-- HERO -->

            <section class="page-hero">

                <div>

                    <p class="page-eyebrow">
                        TRANSAKSI
                    </p>

                    <h2>
                        Catatan Transaksi
                    </h2>

                    <p class="page-description">
                        Catat dan kelola pemasukan serta pengeluaran kas kelas XI RPL 1.
                    </p>

                </div>


                <button
                    type="button"
                    class="btn btn--primary"
                    id="btnTambahTransaksi"
                >

                    <span class="material-symbols-outlined">
                        add
                    </span>

                    <span>
                        Tambah Transaksi
                    </span>

                </button>

            </section>


            <!-- =================================================
                 SUMMARY
            ================================================== -->

            <section class="summary-grid">

                <!-- TOTAL PEMASUKAN -->

                <article class="summary-card">

                    <div class="summary-card__icon summary-card__icon--green">

                        <span class="material-symbols-outlined">
                            trending_up
                        </span>

                    </div>

                    <div class="summary-card__content">

                        <span class="summary-card__label">
                            Total Pemasukan
                        </span>

                        <strong id="sumMasuk">
                            Rp0
                        </strong>

                        <small id="sumMasukNote">
                            Belum ada transaksi terfilter
                        </small>

                    </div>

                </article>


                <!-- TOTAL PENGELUARAN -->

                <article class="summary-card">

                    <div class="summary-card__icon summary-card__icon--orange">

                        <span class="material-symbols-outlined">
                            trending_down
                        </span>

                    </div>

                    <div class="summary-card__content">

                        <span class="summary-card__label">
                            Total Pengeluaran
                        </span>

                        <strong id="sumKeluar">
                            Rp0
                        </strong>

                        <small id="sumKeluarNote">
                            Belum ada transaksi terfilter
                        </small>

                    </div>

                </article>


                <!-- SELISIH BERSIH -->

                <article class="summary-card">

                    <div class="summary-card__icon summary-card__icon--blue">

                        <span class="material-symbols-outlined">
                            account_balance
                        </span>

                    </div>

                    <div class="summary-card__content">

                        <span class="summary-card__label">
                            Selisih Bersih
                        </span>

                        <strong id="sumSelisih">
                            Rp0
                        </strong>

                        <small id="sumSelisihNote">
                            Pemasukan − pengeluaran
                        </small>

                    </div>

                </article>

            </section>


            <!-- =================================================
                 TRANSACTION PANEL
            ================================================== -->

            <section class="panel transaction-panel">

                <div class="panel__head">

                    <div>

                        <div class="panel__eyebrow">
                            DATA TRANSAKSI
                        </div>

                        <h3 class="panel__title">
                            Riwayat Transaksi
                        </h3>

                        <p class="panel__sub">
                            Daftar pemasukan dan pengeluaran kas yang telah dicatat oleh bendahara.
                        </p>

                    </div>

                </div>


                <!-- FILTER -->

                <div class="transaction-tools">

                    <div class="search-box">

                        <span class="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="search"
                            id="cariTransaksi"
                            placeholder="Cari ID, nama siswa, kategori, atau keterangan..."
                            autocomplete="off"
                        >

                    </div>


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


                    <select id="filterKategori">

                        <option value="semua">
                            Semua Kategori
                        </option>

                    </select>


                    <select id="filterBulan">

                        <option value="semua">
                            Semua Bulan
                        </option>

                        <option value="01">Januari</option>
                        <option value="02">Februari</option>
                        <option value="03">Maret</option>
                        <option value="04">April</option>
                        <option value="05">Mei</option>
                        <option value="06">Juni</option>
                        <option value="07">Juli</option>
                        <option value="08">Agustus</option>
                        <option value="09">September</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">Desember</option>

                    </select>


                    <button
                        type="button"
                        class="btn btn--ghost btn-small"
                        id="btnResetFilter"
                    >

                        <span class="material-symbols-outlined">
                            filter_alt_off
                        </span>

                        <span>
                            Reset
                        </span>

                    </button>

                </div>


                <!-- TABLE -->

                <div class="table-wrap">

                    <table class="transaction-table">

                        <thead>

                            <tr>

                                <th>
                                    ID Transaksi
                                </th>

                                <th>
                                    Jenis
                                </th>

                                <th>
                                    Siswa / Keterangan
                                </th>

                                <th>
                                    Kategori
                                </th>

                                <th>
                                    Tanggal
                                </th>

                                <th>
                                    Metode
                                </th>

                                <th class="text-right">
                                    Nominal
                                </th>

                                <th class="text-center">
                                    Aksi
                                </th>

                            </tr>

                        </thead>


                        <tbody id="isiTabelTransaksi">
                        </tbody>

                    </table>


                    <div
                        class="empty-state"
                        id="emptyState"
                        hidden
                    >

                        <span class="material-symbols-outlined">
                            receipt_long
                        </span>

                        <p id="emptyStateText">
                            Transaksi tidak ditemukan.
                        </p>

                        <button
                            type="button"
                            class="btn btn--ghost btn-small"
                            id="btnKosongkanFilter"
                        >
                            Tampilkan Semua
                        </button>

                    </div>

                </div>


                <div class="panel__foot">

                    <span id="tabelInfo">
                        Menampilkan 0 transaksi
                    </span>

                </div>

            </section>


            <div class="content__foot">
                BBCashvia • KASVIA Synergy
            </div>

        </main>

    </div>

</div>


<!-- =========================================================
     MODAL FORM
========================================================= -->

<div
    class="modal-backdrop"
    id="modalForm"
    aria-hidden="true"
>

    <div
        class="modal modal--form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalFormTitle"
    >

        <div class="modal__head">

            <div>

                <p class="modal__eyebrow">
                    TRANSAKSI
                </p>

                <h3
                    class="modal__title"
                    id="modalFormTitle"
                >
                    Tambah Transaksi
                </h3>

            </div>


            <button
                type="button"
                class="modal__close"
                data-tutup-modal
                aria-label="Tutup"
            >

                <span class="material-symbols-outlined">
                    close
                </span>

            </button>

        </div>


        <form id="formTransaksi">

            <div class="modal__body">

                <!-- JENIS -->

                <div class="form-group">

                    <label>
                        Jenis Transaksi
                        <span class="required">*</span>
                    </label>

                    <div class="transaction-type">

                        <label class="transaction-type__option">

                            <input
                                type="radio"
                                name="jenisTransaksi"
                                value="masuk"
                                checked
                            >

                            <span class="transaction-type__box">

                                <span class="material-symbols-outlined">
                                    trending_up
                                </span>

                                <span>
                                    Pemasukan
                                </span>

                            </span>

                        </label>


                        <label class="transaction-type__option">

                            <input
                                type="radio"
                                name="jenisTransaksi"
                                value="keluar"
                            >

                            <span class="transaction-type__box">

                                <span class="material-symbols-outlined">
                                    trending_down
                                </span>

                                <span>
                                    Pengeluaran
                                </span>

                            </span>

                        </label>

                    </div>

                </div>


                <!-- SISWA -->

                <div
                    class="form-group"
                    id="siswaGroup"
                >

                    <label for="inputSiswa">
                        Siswa
                        <span class="required">*</span>
                    </label>

                    <select id="inputSiswa">

                        <option value="">
                            Pilih siswa
                        </option>

                    </select>

                </div>


                <!-- IURAN -->

                <div
                    class="form-group"
                    id="iuranGroup"
                >

                    <label for="inputIuran">
                        Iuran
                        <span class="required">*</span>
                    </label>

                    <select id="inputIuran">

                        <option value="">
                            Pilih iuran
                        </option>

                    </select>

                </div>


                <!-- TAGIHAN + METODE -->

                <div class="form-row">

                    <div
                        class="form-group"
                        id="tagihanGroup"
                    >

                        <label for="inputTagihan">
                            Nominal Tagihan
                            <span class="required">*</span>
                        </label>

                        <div class="money-input">

                            <span>
                                Rp
                            </span>

                            <input
                                type="text"
                                id="inputTagihan"
                                placeholder="0"
                                inputmode="numeric"
                                readonly
                            >

                        </div>

                    </div>


                    <div class="form-group">

                        <label for="inputMetode">
                            Metode
                            <span class="required">*</span>
                        </label>

                        <select id="inputMetode">

                            <option value="">
                                Pilih metode
                            </option>

                            <option value="Tunai">
                                Tunai
                            </option>

                            <option value="Transfer">
                                Transfer
                            </option>

                        </select>

                    </div>

                </div>


                <!-- KATEGORI -->

                <div class="form-group">

                    <label for="inputKategori">
                        Kategori
                        <span class="required">*</span>
                    </label>

                    <select id="inputKategori">

                        <option value="">
                            Pilih kategori
                        </option>

                    </select>

                </div>


                <!-- UANG PEMASUKAN -->

                <div
                    class="uang-box"
                    id="uangBox"
                >

                    <div class="uang-box__head">

                        <div>

                            <span class="material-symbols-outlined">
                                payments
                            </span>

                            <div>

                                <strong>
                                    Rincian Pembayaran
                                </strong>

                                <small>
                                    Hitung uang diterima, kembalian, dan uang yang masuk kas.
                                </small>

                            </div>

                        </div>

                    </div>


                    <div class="form-group">

                        <label
                            for="inputDiterima"
                            id="labelDiterima"
                        >
                            Uang Diterima Bendahara
                        </label>

                        <div class="money-input">

                            <span>
                                Rp
                            </span>

                            <input
                                type="text"
                                id="inputDiterima"
                                placeholder="0"
                                inputmode="numeric"
                                autocomplete="off"
                            >

                        </div>

                    </div>


                    <div class="uang-result-grid">

                        <div class="uang-result">

                            <span>
                                Kembalian
                            </span>

                            <strong id="hasilKembalian">
                                Rp0
                            </strong>

                        </div>


                        <div class="uang-result uang-result--primary">

                            <span id="labelMasukKas">
                                Uang Masuk Kas
                            </span>

                            <strong id="hasilMasukKas">
                                Rp0
                            </strong>

                        </div>

                    </div>


                    <p
                        class="uang-box__hint"
                        id="uangHint"
                    >
                        Contoh: tagihan Rp10.000 dan uang diterima Rp20.000 →
                        kembalian Rp10.000 dan uang masuk kas Rp10.000.
                    </p>

                </div>


                <!-- NOMINAL PENGELUARAN -->

                <div
                    class="form-group"
                    id="pengeluaranNominalGroup"
                    hidden
                >

                    <label for="inputNominalKeluar">
                        Nominal Pengeluaran
                        <span class="required">*</span>
                    </label>

                    <div class="money-input">

                        <span>
                            Rp
                        </span>

                        <input
                            type="text"
                            id="inputNominalKeluar"
                            placeholder="0"
                            inputmode="numeric"
                            autocomplete="off"
                        >

                    </div>

                </div>


                <!-- TANGGAL -->

                <div class="form-group">

                    <label for="inputTanggal">
                        Tanggal Transaksi
                        <span class="required">*</span>
                    </label>

                    <input
                        type="date"
                        id="inputTanggal"
                        required
                    >

                </div>


                <!-- KETERANGAN -->

                <div class="form-group">

                    <label for="inputKeterangan">
                        Keterangan
                    </label>

                    <textarea
                        id="inputKeterangan"
                        placeholder="Tambahkan keterangan jika diperlukan..."
                    ></textarea>

                </div>


                <div
                    class="form-error"
                    id="formError"
                    hidden
                ></div>

            </div>


            <div class="modal__foot">

                <button
                    type="button"
                    class="btn btn--ghost"
                    data-tutup-modal
                >
                    Batal
                </button>

                <button
                    type="submit"
                    class="btn btn--primary"
                    id="btnSimpanTransaksi"
                >

                    <span
                        class="material-symbols-outlined"
                        id="btnSimpanIcon"
                    >
                        save
                    </span>

                    <span id="btnSimpanText">
                        Simpan Transaksi
                    </span>

                </button>

            </div>

        </form>

    </div>

</div>


<!-- =========================================================
     MODAL DETAIL
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
    >

        <div class="modal__head">

            <div>

                <p class="modal__eyebrow">
                    DETAIL TRANSAKSI
                </p>

                <h3
                    class="modal__title"
                    id="modalDetailTitle"
                >
                    Detail Transaksi
                </h3>

            </div>


            <button
                type="button"
                class="modal__close"
                data-tutup-modal
            >

                <span class="material-symbols-outlined">
                    close
                </span>

            </button>

        </div>


        <div class="modal__body">

            <div class="detail-grid">

                <div class="detail-item">

                    <span>
                        Jenis Transaksi
                    </span>

                    <strong id="detailJenis">
                        Pemasukan
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Metode
                    </span>

                    <strong id="detailMetode">
                        —
                    </strong>

                </div>


                <div
                    class="detail-item"
                    id="detailSiswaItem"
                >

                    <span>
                        Siswa
                    </span>

                    <strong id="detailSiswa">
                        —
                    </strong>

                </div>


                <div
                    class="detail-item"
                    id="detailIuranItem"
                >

                    <span>
                        Iuran
                    </span>

                    <strong id="detailIuran">
                        —
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Kategori
                    </span>

                    <strong id="detailKategori">
                        —
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Tanggal
                    </span>

                    <strong id="detailTanggal">
                        —
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        Petugas
                    </span>

                    <strong id="detailPetugas">
                        Bendahara
                    </strong>

                </div>

            </div>


            <div class="detail-description">

                <span>
                    Keterangan
                </span>

                <p id="detailKeterangan">
                    —
                </p>

            </div>


            <div
                class="uang-rincian"
                id="detailUangRincian"
            >

                <div class="uang-rincian__title">
                    Rincian Uang
                </div>


                <div class="uang-rincian__row">

                    <span id="rincianLabelTagihan">
                        Nominal Tagihan
                    </span>

                    <strong id="rincianTagihan">
                        Rp0
                    </strong>

                </div>


                <div class="uang-rincian__row">

                    <span id="rincianLabelDiterima">
                        Uang diterima bendahara
                    </span>

                    <strong id="rincianDiterima">
                        Rp0
                    </strong>

                </div>


                <div class="uang-rincian__row">

                    <span>
                        Kembalian
                    </span>

                    <strong id="rincianKembalian">
                        Rp0
                    </strong>

                </div>


                <div class="uang-rincian__row uang-rincian__row--main">

                    <span id="rincianLabelMasukKas">
                        Uang masuk kas
                    </span>

                    <strong id="rincianMasukKas">
                        Rp0
                    </strong>

                </div>

            </div>

        </div>


        <div class="modal__foot">

            <button
                type="button"
                class="btn btn--ghost"
                data-tutup-modal
            >
                Tutup
            </button>

        </div>

    </div>

</div>


<!-- =========================================================
     MODAL HAPUS
========================================================= -->

<div
    class="modal-backdrop"
    id="modalHapus"
    aria-hidden="true"
>

    <div
        class="modal modal--small"
        role="dialog"
        aria-modal="true"
    >

        <div class="delete-content">

            <div class="delete-icon">

                <span class="material-symbols-outlined">
                    delete
                </span>

            </div>


            <h3>
                Hapus Transaksi?
            </h3>


            <p>
                Transaksi yang dihapus tidak akan ditampilkan lagi
                pada daftar transaksi.
            </p>

        </div>


        <div class="modal__foot">

            <button
                type="button"
                class="btn btn--ghost"
                data-tutup-modal
            >
                Batal
            </button>


            <button
                type="button"
                class="btn btn--danger"
                id="btnKonfirmasiHapus"
            >

                <span class="material-symbols-outlined">
                    delete
                </span>

                <span id="hapusText">
                    Hapus
                </span>

            </button>

        </div>

    </div>

</div>


<!-- =========================================================
     TOAST
========================================================= -->

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
        Berhasil.
    </span>

</div>

</body>
</html>
