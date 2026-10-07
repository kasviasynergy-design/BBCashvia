<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Iuran | BBCashvia</title>

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

    @vite([
        'resources/css/bendahara-iuran.css',
        'resources/js/bendahara-iuran.js'
    ])
</head>

<body>

<div class="app-shell">

    {{-- =========================================================
         SIDEBAR BACKDROP
    ========================================================== --}}
    <div
        class="sidebar-backdrop"
        id="sidebarBackdrop"
        aria-hidden="true">
    </div>


    {{-- =========================================================
         SIDEBAR
    ========================================================== --}}
    <aside class="sidebar" id="sidebar">

        <div class="sidebar__brand">

            <div class="sidebar__logo">
                <span class="material-symbols-outlined">
                    account_balance_wallet
                </span>
            </div>

            <div class="sidebar__brandtext">
                <span class="sidebar__brandname">
                    BBCashvia
                </span>

                <span class="sidebar__brandsub">
                    Kas Kelas Digital
                </span>
            </div>

        </div>


        <nav class="sidebar__nav">

            {{-- MENU UTAMA --}}
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    MENU UTAMA
                </div>

                <a
                    href="/dashboard/bendahara"
                    class="side-link">

                    <span class="material-symbols-outlined">
                        dashboard
                    </span>

                    <span>
                        Dashboard
                    </span>

                </a>

            </div>


            {{-- DATA & IURAN --}}
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    DATA &amp; IURAN
                </div>

                <a
                    href="/bendahara/siswa"
                    class="side-link">

                    <span class="material-symbols-outlined">
                        groups
                    </span>

                    <span>
                        Siswa
                    </span>

                </a>

                <a
                    href="/bendahara/iuran"
                    class="side-link is-active">

                    <span class="material-symbols-outlined">
                        receipt_long
                    </span>

                    <span>
                        Iuran
                    </span>

                </a>

            </div>


            {{-- TRANSAKSI --}}
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    TRANSAKSI
                </div>

                <a
                    href="/bendahara/transaksi"
                    class="side-link">

                    <span class="material-symbols-outlined">
                        payments
                    </span>

                    <span>
                        Transaksi
                    </span>

                </a>

            </div>


            {{-- LAPORAN --}}
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    LAPORAN
                </div>

                <a
                    href="/bendahara/laporan-kas"
                    class="side-link">

                    <span class="material-symbols-outlined">
                        account_balance
                    </span>

                    <span>
                        Laporan Kas
                    </span>

                </a>

                <a
                    href="/bendahara/riwayat-transaksi"
                    class="side-link">

                    <span class="material-symbols-outlined">
                        history
                    </span>

                    <span>
                        Riwayat Transaksi
                    </span>

                </a>

            </div>

        </nav>


        {{-- SIDEBAR FOOT --}}
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
                id="sidebarLogout">

                <span class="material-symbols-outlined">
                    logout
                </span>

                <span>
                    Keluar
                </span>

            </button>

        </div>

    </aside>


    {{-- =========================================================
         MAIN SHELL
    ========================================================== --}}
    <div class="shell">

        {{-- =====================================================
             TOPBAR
        ====================================================== --}}
        <header class="topbar">

            <div class="topbar__left">

                <button
                    type="button"
                    class="topbar__burger"
                    id="sidebarToggle"
                    aria-label="Buka menu"
                    aria-expanded="false">

                    <span class="material-symbols-outlined">
                        menu
                    </span>

                </button>


                <div class="topbar__title">

                    <h1>
                        Iuran
                    </h1>

                    <p id="currentDate">
                        Memuat tanggal...
                    </p>

                </div>

            </div>


            <div class="topbar__right">

                <div class="topbar__chip">

                    <span class="material-symbols-outlined">
                        calendar_month
                    </span>

                    <span>
                        TA 2026/2027 • Ganjil
                    </span>

                </div>


                <div class="topbar__profilewrap">

                    <button
                        type="button"
                        class="topbar__profile"
                        id="profileButton"
                        aria-expanded="false">

                        <div class="topbar__avatar">
                            SN
                        </div>

                        <div class="topbar__profileinfo">

                            <span class="topbar__profilename">
                                Siti Nurhaliza
                            </span>

                            <span class="topbar__profilerole">
                                Bendahara • XI RPL 1
                            </span>

                        </div>

                        <span class="material-symbols-outlined topbar__chevron">
                            expand_more
                        </span>

                    </button>


                    <div
                        class="dropdown"
                        id="profileDropdown">

                        <div class="dropdown__head">

                            <span class="dropdown__name">
                                Siti Nurhaliza
                            </span>

                            <span class="dropdown__mail">
                                Bendahara • Kelas XI RPL 1
                            </span>

                            <span class="dropdown__mail">
                                siti.nurhaliza@gmail.com
                            </span>

                        </div>

                        <button
                            type="button"
                            class="dropdown__item dropdown__item--danger"
                            id="dropdownLogout">

                            <span class="material-symbols-outlined">
                                logout
                            </span>

                            Keluar

                        </button>

                    </div>

                </div>

            </div>

        </header>


        {{-- =====================================================
             CONTENT
        ====================================================== --}}
        <main class="content">

            {{-- PAGE HEADER --}}
            <section class="page-head">

                <div class="page-head__text">

                    <span class="page-head__eyebrow">
                        DATA &amp; IURAN
                    </span>

                    <h2>
                        Iuran Kelas
                    </h2>

                    <p>
                        Kelola iuran kelas XI RPL 1 dan pantau pembayaran siswa.
                    </p>

                </div>

                <div class="page-head__actions">

                    <button
                        type="button"
                        class="btn btn--primary"
                        id="btnTambahIuran">

                        <span class="material-symbols-outlined">
                            add
                        </span>

                        Tambah Iuran

                    </button>

                </div>

            </section>


            {{-- =================================================
                 SUMMARY
            ================================================== --}}
            <section class="summary-grid">

                <article class="summary-card">

                    <div class="summary-card__icon summary-card__icon--blue">

                        <span class="material-symbols-outlined">
                            receipt_long
                        </span>

                    </div>

                    <div class="summary-card__content">

                        <span class="summary-card__label">
                            Total Iuran
                        </span>

                        <strong
                            class="summary-card__value"
                            id="sumTotalIuran">
                            0
                        </strong>

                        <span class="summary-card__meta">
                            Iuran aktif di kelas
                        </span>

                    </div>

                </article>


                <article class="summary-card">

                    <div class="summary-card__icon summary-card__icon--orange">

                        <span class="material-symbols-outlined">
                            payments
                        </span>

                    </div>

                    <div class="summary-card__content">

                        <span class="summary-card__label">
                            Total Tagihan
                        </span>

                        <strong
                            class="summary-card__value"
                            id="sumTagihan">
                            Rp0
                        </strong>

                        <span class="summary-card__meta">
                            Akumulasi nominal iuran
                        </span>

                    </div>

                </article>


                <article class="summary-card">

                    <div class="summary-card__icon summary-card__icon--green">

                        <span class="material-symbols-outlined">
                            check_circle
                        </span>

                    </div>

                    <div class="summary-card__content">

                        <span class="summary-card__label">
                            Terkumpul
                        </span>

                        <strong
                            class="summary-card__value"
                            id="sumTerkumpul">
                            Rp0
                        </strong>

                        <span class="summary-card__meta">
                            Pembayaran yang sudah masuk
                        </span>

                    </div>

                </article>

            </section>


            {{-- =================================================
                 MAIN PANEL
            ================================================== --}}
            <section class="panel">

                <div class="panel__head">

                    <div>

                        <span class="panel__eyebrow">
                            XI RPL 1
                        </span>

                        <h3 class="panel__title">
                            Daftar Iuran
                        </h3>

                        <p class="panel__sub">
                            Daftar tagihan iuran yang dikelola untuk kelas.
                        </p>

                    </div>

                </div>


                {{-- FILTER --}}
                <div class="filter-bar">

                    <div class="search-box">

                        <span class="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="text"
                            id="cariIuran"
                            placeholder="Cari nama iuran..."
                            autocomplete="off">

                    </div>


                    <select id="filterFrekuensi">

                        <option value="semua">
                            Semua frekuensi
                        </option>

                        <option value="harian">
                            Harian
                        </option>

                        <option value="mingguan">
                            Mingguan
                        </option>

                        <option value="bulanan">
                            Bulanan
                        </option>

                        <option value="tahunan">
                            Tahunan
                        </option>

                        <option value="insidental">
                            Insidental
                        </option>

                    </select>


                    <select id="filterStatusIuran">

                        <option value="semua">
                            Semua status
                        </option>

                        <option value="aktif">
                            Aktif
                        </option>

                        <option value="nonaktif">
                            Nonaktif
                        </option>

                    </select>


                    <button
                        type="button"
                        class="btn btn--ghost"
                        id="btnResetFilter">

                        <span class="material-symbols-outlined">
                            restart_alt
                        </span>

                        Reset

                    </button>

                </div>


                {{-- TABLE --}}
                <div class="table-wrap">

                    <table class="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Nama Iuran
                                </th>

                                <th>
                                    Frekuensi
                                </th>

                                <th>
                                    Jatuh Tempo
                                </th>

                                <th>
                                    Nominal
                                </th>

                                <th>
                                    Terkumpul
                                </th>

                                <th>
                                    Progres
                                </th>

                                <th>
                                    Status
                                </th>

                                <th class="text-right">
                                    Aksi
                                </th>

                            </tr>

                        </thead>

                        <tbody id="isiTabelIuran">
                        </tbody>

                    </table>


                    <div
                        class="empty-state"
                        id="emptyState"
                        hidden>

                        <div class="empty-state__icon">

                            <span class="material-symbols-outlined">
                                receipt_long
                            </span>

                        </div>

                        <strong>
                            Iuran tidak ditemukan
                        </strong>

                        <p>
                            Coba ubah kata kunci atau filter pencarian.
                        </p>

                    </div>

                </div>


                <div class="panel__foot">

                    <span id="jumlahIuranFoot">
                        0 iuran
                    </span>

                    <span>
                        Kelas XI RPL 1
                    </span>

                </div>

            </section>

        </main>

    </div>

</div>


{{-- =============================================================
     MODAL TAMBAH / EDIT IURAN
============================================================= --}}
<div
    class="modal"
    id="modalIuran"
    hidden>

    <div
        class="modal__backdrop"
        data-close-modal>
    </div>

    <div class="modal__dialog">

        <div class="modal__head">

            <div>

                <span class="modal__eyebrow">
                    DATA IURAN
                </span>

                <h3 id="modalIuranTitle">
                    Tambah Iuran
                </h3>

                <p id="modalIuranSub">
                    Tambahkan iuran baru untuk kelas XI RPL 1.
                </p>

            </div>

            <button
                type="button"
                class="modal__close"
                data-close-modal
                aria-label="Tutup">

                <span class="material-symbols-outlined">
                    close
                </span>

            </button>

        </div>


        <form
            id="formIuran"
            class="modal__body">

            <div class="form-grid">

                <div class="form-field form-field--full">

                    <label for="inputNamaIuran">
                        Nama Iuran
                    </label>

                    <input
                        type="text"
                        id="inputNamaIuran"
                        placeholder="Contoh: Kas Kelas"
                        required>

                </div>


                <div class="form-field">

                    <label for="inputFrekuensi">
                        Frekuensi
                    </label>

                    <select
                        id="inputFrekuensi"
                        required>

                        <option value="harian">
                            Harian
                        </option>

                        <option value="mingguan">
                            Mingguan
                        </option>

                        <option value="bulanan">
                            Bulanan
                        </option>

                        <option value="tahunan">
                            Tahunan
                        </option>

                        <option value="insidental">
                            Insidental
                        </option>

                    </select>

                </div>


                <div class="form-field">

                    <label for="inputJatuhTempo">
                        Jatuh Tempo
                    </label>

                    <input
                        type="date"
                        id="inputJatuhTempo"
                        required>

                </div>


                <div class="form-field">

                    <label for="inputNominalIuran">
                        Nominal
                    </label>

                    <div class="money-input">

                        <span>
                            Rp
                        </span>

                        <input
                            type="number"
                            id="inputNominalIuran"
                            min="0"
                            step="1000"
                            placeholder="10000"
                            required>

                    </div>

                </div>


                <div class="form-field">

                    <label for="inputStatusIuran">
                        Status
                    </label>

                    <select id="inputStatusIuran">

                        <option value="aktif">
                            Aktif
                        </option>

                        <option value="nonaktif">
                            Nonaktif
                        </option>

                    </select>

                </div>


                <div class="form-field form-field--full">

                    <label for="inputKeteranganIuran">
                        Keterangan
                    </label>

                    <textarea
                        id="inputKeteranganIuran"
                        rows="3"
                        placeholder="Tambahkan keterangan jika diperlukan..."></textarea>

                </div>

            </div>


            <div
                class="form-error"
                id="formErrorIuran"
                hidden>
            </div>


            <div class="modal__footer">

                <button
                    type="button"
                    class="btn btn--ghost"
                    data-close-modal>
                    Batal
                </button>

                <button
                    type="submit"
                    class="btn btn--primary">

                    <span class="material-symbols-outlined">
                        save
                    </span>

                    Simpan Iuran

                </button>

            </div>

        </form>

    </div>

</div>


{{-- =============================================================
     MODAL DETAIL IURAN
============================================================= --}}
<div
    class="modal"
    id="modalDetailIuran"
    hidden>

    <div
        class="modal__backdrop"
        data-close-modal>
    </div>

    <div class="modal__dialog modal__dialog--wide">

        <div class="modal__head">

            <div>

                <span class="modal__eyebrow">
                    DETAIL IURAN
                </span>

                <h3 id="detailIuranTitle">
                    -
                </h3>

                <p id="detailIuranSub">
                    -
                </p>

            </div>

            <button
                type="button"
                class="modal__close"
                data-close-modal>

                <span class="material-symbols-outlined">
                    close
                </span>

            </button>

        </div>


        <div class="modal__body">

            <div class="detail-summary">

                <div class="detail-summary__item">

                    <span>
                        Frekuensi
                    </span>

                    <strong id="detailFrekuensi">
                        -
                    </strong>

                </div>

                <div class="detail-summary__item">

                    <span>
                        Jatuh Tempo
                    </span>

                    <strong id="detailJatuhTempo">
                        -
                    </strong>

                </div>

                <div class="detail-summary__item">

                    <span>
                        Nominal
                    </span>

                    <strong id="detailNominal">
                        -
                    </strong>

                </div>

                <div class="detail-summary__item">

                    <span>
                        Terkumpul
                    </span>

                    <strong id="detailTerkumpul">
                        -
                    </strong>

                </div>

            </div>


            <div class="detail-toolbar">

                <div class="search-box">

                    <span class="material-symbols-outlined">
                        search
                    </span>

                    <input
                        type="text"
                        id="cariDetailSiswa"
                        placeholder="Cari siswa..."
                        autocomplete="off">

                </div>


                <select id="filterDetailStatus">

                    <option value="semua">
                        Semua status
                    </option>

                    <option value="lunas">
                        Lunas
                    </option>

                    <option value="belum">
                        Belum Lunas
                    </option>

                </select>

            </div>


            <div class="table-wrap">

                <table class="data-table detail-table">

                    <thead>

                        <tr>

                            <th>
                                No
                            </th>

                            <th>
                                Siswa
                            </th>

                            <th>
                                NISN
                            </th>

                            <th>
                                Kelas
                            </th>

                            <th>
                                Nominal
                            </th>

                            <th>
                                Status
                            </th>

                            <th class="text-right">
                                Aksi
                            </th>

                        </tr>

                    </thead>

                    <tbody id="isiTabelDetail">
                    </tbody>

                </table>


                <div
                    class="empty-state"
                    id="emptyDetail"
                    hidden>

                    <div class="empty-state__icon">

                        <span class="material-symbols-outlined">
                            groups
                        </span>

                    </div>

                    <strong>
                        Data siswa tidak ditemukan
                    </strong>

                    <p>
                        Coba ubah pencarian atau filter.
                    </p>

                </div>

            </div>

        </div>

    </div>

</div>


{{-- =============================================================
     MODAL PEMBAYARAN
============================================================= --}}
<div
    class="modal"
    id="modalPembayaran"
    hidden>

    <div
        class="modal__backdrop"
        data-close-modal>
    </div>

    <div class="modal__dialog modal__dialog--payment">

        <div class="modal__head">

            <div>

                <span class="modal__eyebrow">
                    CATAT PEMBAYARAN
                </span>

                <h3>
                    Pembayaran Iuran
                </h3>

                <p>
                    Catat pembayaran siswa dan uang yang diterima bendahara.
                </p>

            </div>

            <button
                type="button"
                class="modal__close"
                data-close-modal>

                <span class="material-symbols-outlined">
                    close
                </span>

            </button>

        </div>


        <form
            id="formPembayaran"
            class="modal__body">

            <div class="payment-student">

                <div class="payment-student__avatar" id="paymentAvatar">
                    SN
                </div>

                <div>

                    <strong id="paymentStudentName">
                        -
                    </strong>

                    <span id="paymentStudentMeta">
                        -
                    </span>

                </div>

            </div>


            <div class="payment-box">

                <div class="payment-box__row">

                    <span>
                        Iuran
                    </span>

                    <strong id="paymentIuranName">
                        -
                    </strong>

                </div>

                <div class="payment-box__row">

                    <span>
                        Tagihan
                    </span>

                    <strong id="pembayaranTagihan">
                        Rp0
                    </strong>

                </div>

                <div class="payment-box__row payment-box__row--remaining">

                    <span>
                        Sisa Tagihan
                    </span>

                    <strong id="paymentSisa">
                        Rp0
                    </strong>

                </div>

            </div>


            <div class="form-field">

                <label for="inputPembayaranDiterima">
                    Uang Diterima Bendahara
                </label>

                <div class="money-input money-input--large">

                    <span>
                        Rp
                    </span>

                    <input
                        type="number"
                        id="inputPembayaranDiterima"
                        min="0"
                        step="1000"
                        placeholder="0"
                        required>

                </div>

                <small id="uangHint">
                    Masukkan jumlah uang yang diterima dari siswa.
                </small>

            </div>


            <div class="payment-result">

                <div class="payment-result__item">

                    <span>
                        Kembalian
                    </span>

                    <strong id="hasilKembalian">
                        Rp0
                    </strong>

                </div>

                <div class="payment-result__item payment-result__item--success">

                    <span>
                        Uang Masuk Kas
                    </span>

                    <strong id="hasilMasukKas">
                        Rp0
                    </strong>

                </div>

            </div>


            <div
                class="form-error"
                id="formErrorPembayaran"
                hidden>
            </div>


            <div class="modal__footer">

                <button
                    type="button"
                    class="btn btn--ghost"
                    data-close-modal>
                    Batal
                </button>

                <button
                    type="submit"
                    class="btn btn--primary"
                    id="btnSimpanPembayaran">

                    <span class="material-symbols-outlined">
                        payments
                    </span>

                    Simpan Pembayaran

                </button>

            </div>

        </form>

    </div>

</div>


{{-- =============================================================
     TOAST
============================================================= --}}
<div
    class="toast"
    id="toast"
    role="status"
    aria-live="polite">

    <div class="toast__icon" id="toastIcon">

        <span class="material-symbols-outlined">
            check
        </span>

    </div>

    <div class="toast__content">

        <strong id="toastTitle">
            Berhasil
        </strong>

        <span id="toastMessage">
            Data berhasil disimpan.
        </span>

    </div>

    <button
        type="button"
        class="toast__close"
        id="toastClose">

        <span class="material-symbols-outlined">
            close
        </span>

    </button>

</div>

</body>
</html>
