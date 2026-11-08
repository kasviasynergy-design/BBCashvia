<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Iuran - BBCashvia</title>

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
        'resources/js/bendahara-iuran.js',
        'resources/css/konfirmasi-logout.css',
        'resources/js/konfirmasi-logout.js'
    ])
    <style>
        /*! tailwindcss v4.0.7 | MIT License | https://tailwindcss.com */@layer theme{:root,:host{--primary:#2BA19E;--primary-dark:#237A77;--primary-soft:#D4F1F9;--success:#2BA19E;--success-soft:#D4F1F9;--warning:#F4D98E;--warning-soft:#F4D98E;--bg:#FFFDFF;--surface:#FFFFFF;--surface-soft:#D4F1F9;--border:#A5DBE3;--sidebar-active:#D4F1F9;--sidebar-active-text:#2BA19E;}}
    </style>
</head>

<body data-kelas-label="{{ auth()->user()->labelKelas() }}">

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
                <img
                    src="{{ asset('build/assets/image/Logo BBCashvia.png') }}"
                    alt="Logo BBCashvia"
                    class="sidebar__logo-img"
                >
            </div>

            <div class="sidebar__brandtext">
                <span class="sidebar__brandname">BBCashvia</span>
                <span class="sidebar__brandsub">Kas Kelas Digital</span>
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

                    <span>Dashboard</span>

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

                    <span>Siswa</span>

                </a>

                <a
                    href="/bendahara/iuran"
                    class="side-link is-active">

                    <span class="material-symbols-outlined">
                        receipt_long
                    </span>

                    <span>Iuran</span>

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

                    <span>Transaksi</span>

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

                    <span>Laporan Kas</span>

                </a>

                <a
                    href="/bendahara/riwayat-transaksi"
                    class="side-link">

                    <span class="material-symbols-outlined">
                        history
                    </span>

                    <span>Riwayat Transaksi</span>

                </a>

            </div>

        </nav>

        {{-- SIDEBAR FOOT --}}
        <div class="sidebar__foot">

            <div class="sidebar__user">

                <div class="sidebar__avatar">
                    {{ strtoupper(mb_substr(auth()->user()->name ?? 'U', 0, 2)) }}
                </div>

                <div class="sidebar__userinfo">

                    <span class="sidebar__username">
                        {{ auth()->user()->name ?? 'Pengguna' }}
                    </span>

                    <span class="sidebar__userrole">
                        Bendahara • {{ auth()->user()->labelKelas() }}
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

                <span>Keluar</span>

            </button>

        </div>

    </aside>

    {{-- =========================================================
         MAIN SHELL
    ========================================================== --}}
    <div class="shell">

        {{-- TOPBAR --}}
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

                    <h1>Iuran</h1>

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

                    <span>TA 2026/2027 • Ganjil</span>

                </div>

                <div class="topbar__profilewrap">

                    <button
                        type="button"
                        class="topbar__profile"
                        id="profileButton"
                        aria-expanded="false">

                        <div class="topbar__avatar">
                            {{ strtoupper(mb_substr(auth()->user()->name ?? 'U', 0, 2)) }}
                        </div>

                        <div class="topbar__profileinfo">

                            <span class="topbar__profilename">
                                {{ auth()->user()->name ?? 'Pengguna' }}
                            </span>

                            <span class="topbar__profilerole">
                                Bendahara • {{ auth()->user()->labelKelas() }}
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
                                {{ auth()->user()->name ?? 'Pengguna' }}
                            </span>

                            <span class="dropdown__mail">
                                Bendahara • {{ auth()->user()->labelKelas() }}
                            </span>

                            <span class="dropdown__mail">
                                {{ auth()->user()->email ?? '-' }}
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

        {{-- CONTENT --}}
        <main class="content">

        @include('partials.kelas-belum-ditetapkan')


            {{-- PAGE HEADER --}}
            <section class="page-head">

                <div class="page-head__text">

                    <nav class="page-head__eyebrow breadcrumb" aria-label="Breadcrumb">
                        <a class="breadcrumb__link" href="/dashboard/bendahara">Beranda</a>
                        <span class="breadcrumb__sep" aria-hidden="true">›</span>
                        <span aria-current="page">Iuran Kelas</span>
                    </nav>

                    <h2>Iuran Kelas</h2>

                    <p>
                        Kelola iuran {{ auth()->user()->labelKelas() }} dan pantau pembayaran siswa.
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

            {{-- SUMMARY --}}
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

            {{-- MAIN PANEL --}}
            <section class="panel">

                <div class="panel__head">

                    <div>

                        <span class="panel__eyebrow">
                            {{ auth()->user()->labelKelas() }}
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

                    <select id="filterKategori">

                        <option value="semua">Semua Kategori</option>
                        <option value="sekali bayar">Sekali Bayar</option>
                        <option value="mingguan">Mingguan</option>
                        <option value="bulanan">Bulanan</option>
                        <option value="tahunan">Tahunan</option>

                    </select>

                    <select id="filterStatusIuran">

                        <option value="semua">Semua status</option>
                        <option value="aktif">Aktif</option>
                        <option value="selesai">Selesai</option>

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
                                <th>Nama Iuran</th>
                                <th>Kategori</th>
                                <th>Jatuh Tempo</th>
                                <th>Nominal</th>
                                <th>Terkumpul</th>
                                <th>Progres</th>
                                <th>Status</th>
                                <th class="text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody id="isiTabelIuran"></tbody>

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

                        <strong>Iuran tidak ditemukan</strong>

                        <p>
                            Coba ubah kata kunci atau filter pencarian.
                        </p>

                    </div>

                </div>

                <div class="panel__foot">

                    <span id="jumlahIuranFoot">
                        0 iuran
                    </span>

                    <span>{{ auth()->user()->labelKelas() }}</span>

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
                    Tambahkan iuran baru untuk {{ auth()->user()->labelKelas() }}.
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

        <form id="formIuran" class="modal__body">

            <div class="form-grid">

                <div class="form-field form-field--full">

                    <label for="inputNamaIuran">Nama Iuran</label>

                    <input
                        type="text"
                        id="inputNamaIuran"
                        placeholder="Contoh: Kas Kelas"
                        required>

                </div>

                <div class="form-field">

                    <label for="inputKategori">Kategori</label>

                    <select id="inputKategori" required>
                        <option value="sekali bayar">Sekali Bayar</option>
                        <option value="mingguan">Mingguan</option>
                        <option value="bulanan">Bulanan</option>
                        <option value="tahunan">Tahunan</option>
                    </select>

                </div>

                <div class="form-field">

                    <label for="inputJatuhTempo">Jatuh Tempo</label>

                    <input
                        type="date"
                        id="inputJatuhTempo"
                        required>

                </div>

                <div class="form-field">

                    <label for="inputNominalIuran">Nominal</label>

                    <div class="money-input">

                        <span>Rp</span>

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

                    <label for="inputStatusIuran">Status</label>

                    <select id="inputStatusIuran">
                        <option value="aktif">Aktif</option>
                        <option value="selesai">Selesai</option>
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

                <h3 id="detailIuranTitle">-</h3>

                <p id="detailIuranSub">-</p>

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
                    <span>Kategori</span>
                    <strong id="detailKategori">-</strong>
                </div>

                <div class="detail-summary__item">
                    <span>Jatuh Tempo</span>
                    <strong id="detailJatuhTempo">-</strong>
                </div>

                <div class="detail-summary__item">
                    <span>Nominal</span>
                    <strong id="detailNominal">-</strong>
                </div>

                <div class="detail-summary__item">
                    <span>Terkumpul</span>
                    <strong id="detailTerkumpul">-</strong>
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
                    <option value="semua">Semua status</option>
                    <option value="lunas">Lunas</option>
                    <option value="belum">Belum Lunas</option>
                </select>

            </div>

            <div class="table-wrap">

                <table class="data-table detail-table">

                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Siswa</th>
                            <th>NISN</th>
                            <th>Kelas</th>
                            <th>Nominal</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody id="isiTabelDetail"></tbody>

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

                    <strong>Data siswa tidak ditemukan</strong>

                    <p>
                        Coba ubah pencarian atau filter.
                    </p>

                </div>

            </div>

        </div>

    </div>

</div>

{{-- =============================================================
     MODAL HAPUS IURAN (tampilan disamakan dengan halaman Admin)
============================================================= --}}
<div class="modal" id="modalHapusIuran" hidden>

    <div
        class="modal__backdrop"
        data-close-modal>
    </div>

    <div class="modal__dialog modal__dialog--small">

        <div class="modal__head">

            <div>

                <span class="modal__eyebrow">
                    KONFIRMASI
                </span>

                <h3>Hapus Iuran?</h3>

                <p>
                    Data iuran yang dihapus tidak dapat ditampilkan kembali.
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

        <div class="modal__body">

            <div class="delete-box">

                <div class="delete-box__icon">

                    <span class="material-symbols-outlined">
                        delete
                    </span>

                </div>

                <h4 id="hapusIuranNama">
                    -
                </h4>

                <p>
                    Apakah kamu yakin ingin menghapus iuran ini?
                </p>

            </div>

        </div>

        <div class="modal__footer">

            <button
                type="button"
                class="btn btn--ghost"
                data-close-modal>
                Batal
            </button>

            <button
                type="button"
                class="btn btn--danger"
                id="btnKonfirmasiHapus">

                <span class="material-symbols-outlined">
                    delete
                </span>

                Hapus

            </button>

        </div>

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

        <strong id="toastTitle">Berhasil</strong>

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

    @include('partials.konfirmasi-logout')
</body>
</html>
