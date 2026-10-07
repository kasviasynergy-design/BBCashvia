<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Data Siswa | BBCashvia</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400..700,0..1,0"
        rel="stylesheet"
    >

    @vite([
        'resources/css/bendahara-siswa.css',
        'resources/js/bendahara-siswa.js'
    ])
</head>

<body>

<div class="app-shell">

    <!-- SIDEBAR BACKDROP -->
    <div
        class="sidebar-backdrop"
        id="sidebarBackdrop"
        aria-hidden="true"
    ></div>

    <!-- SIDEBAR -->
    <aside class="sidebar" id="sidebar">

        <div class="sidebar__brand">
            <div class="sidebar__logo">
                <span class="material-symbols-outlined">
                    account_balance_wallet
                </span>
            </div>

            <div class="sidebar__brandtext">
                <span class="sidebar__brandname">BBCashvia</span>
                <span class="sidebar__brandsub">Kas Kelas Digital</span>
            </div>
        </div>

        <nav class="sidebar__nav">

            <div class="sidebar__section">
                <div class="sidebar__section-title">MENU UTAMA</div>

                <a
                    href="/dashboard/bendahara"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">
                        dashboard
                    </span>
                    <span>Dashboard</span>
                </a>
            </div>

            <div class="sidebar__section">
                <div class="sidebar__section-title">DATA &amp; IURAN</div>

                <a
                    href="/bendahara/siswa"
                    class="side-link is-active"
                    aria-current="page"
                >
                    <span class="material-symbols-outlined">
                        groups
                    </span>
                    <span>Siswa</span>
                </a>

                <a
                    href="/bendahara/iuran"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">
                        receipt_long
                    </span>
                    <span>Iuran</span>
                </a>
            </div>

            <div class="sidebar__section">
                <div class="sidebar__section-title">TRANSAKSI</div>

                <a
                    href="/bendahara/transaksi"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">
                        payments
                    </span>
                    <span>Transaksi</span>
                </a>
            </div>

            <div class="sidebar__section">
                <div class="sidebar__section-title">LAPORAN</div>

                <a
                    href="/bendahara/laporan-kas"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">
                        account_balance
                    </span>
                    <span>Laporan Kas</span>
                </a>

                <a
                    href="/bendahara/riwayat-transaksi"
                    class="side-link"
                >
                    <span class="material-symbols-outlined">
                        history
                    </span>
                    <span>Riwayat Transaksi</span>
                </a>
            </div>

        </nav>

        <div class="sidebar__foot">

            <div class="sidebar__user">
                <div class="sidebar__avatar">SN</div>

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


    <!-- MAIN -->
    <div class="shell">

        <!-- TOPBAR -->
        <header class="topbar">

            <div class="topbar__left">

                <button
                    type="button"
                    class="topbar__burger"
                    id="sidebarToggle"
                    aria-label="Buka menu"
                    aria-expanded="false"
                >
                    <span class="material-symbols-outlined">
                        menu
                    </span>
                </button>

                <div class="topbar__title">
                    <h1>Data Siswa</h1>
                    <p id="currentDate">Selasa, 6 Oktober 2026</p>
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


                    <!-- PROFILE DROPDOWN -->
                    <div
                        class="dropdown"
                        id="profileDropdown"
                    >

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
                            id="dropdownLogout"
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


        <!-- CONTENT -->
        <main class="content">

            <!-- HERO -->
            <section class="hero">

                <div class="hero__text">

                    <span class="hero__eyebrow">
                        DATA &amp; IURAN • SISWA
                    </span>

                    <h2 class="hero__title">
                        Data Siswa
                    </h2>

                    <p class="hero__sub">
                        Kelola data siswa kelas XI RPL 1,
                        termasuk status iuran dan pembayaran.
                    </p>

                </div>

                <div class="hero__actions">

                    <button
                        type="button"
                        class="btn btn--primary"
                        id="addStudentButton"
                    >
                        <span class="material-symbols-outlined">
                            person_add
                        </span>

                        Tambah Siswa
                    </button>

                </div>

            </section>


            <!-- CLASS INFO -->
            <section class="class-info">

                <div class="class-info__icon">
                    <span class="material-symbols-outlined">
                        school
                    </span>
                </div>

                <div class="class-info__text">

                    <span class="class-info__eyebrow">
                        KELAS AKTIF
                    </span>

                    <strong>XI RPL 1</strong>

                    <span>
                        Data siswa yang menjadi tanggung jawab Bendahara
                    </span>

                </div>

                <div class="class-info__count">

                    <strong id="classStudentCount">
                        36
                    </strong>

                    <span>siswa</span>

                </div>

            </section>


            <!-- STAT -->
            <section class="stat-grid">

                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>
                            <div class="stat-card__label">
                                Total Siswa
                            </div>

                            <div
                                class="stat-card__value"
                                id="totalStudents"
                            >
                                36
                            </div>
                        </div>

                        <div class="stat-card__icon stat-card__icon--siswa">
                            <span class="material-symbols-outlined">
                                groups
                            </span>
                        </div>

                    </div>

                    <div class="stat-card__foot">
                        Siswa kelas XI RPL 1
                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>
                            <div class="stat-card__label">
                                Sudah Lunas
                            </div>

                            <div
                                class="stat-card__value"
                                id="paidStudents"
                            >
                                28
                            </div>
                        </div>

                        <div class="stat-card__icon stat-card__icon--in">
                            <span class="material-symbols-outlined">
                                check_circle
                            </span>
                        </div>

                    </div>

                    <div class="stat-card__foot">
                        Pembayaran sudah lengkap
                    </div>

                </article>


                <article class="stat-card">

                    <div class="stat-card__top">

                        <div>
                            <div class="stat-card__label">
                                Belum Lunas
                            </div>

                            <div
                                class="stat-card__value"
                                id="unpaidStudents"
                            >
                                8
                            </div>
                        </div>

                        <div class="stat-card__icon stat-card__icon--warning">
                            <span class="material-symbols-outlined">
                                pending
                            </span>
                        </div>

                    </div>

                    <div class="stat-card__foot">
                        Masih memiliki sisa tagihan
                    </div>

                </article>

            </section>


            <!-- TABLE -->
            <section class="panel student-panel">

                <div class="panel__head">

                    <div>

                        <div class="panel__eyebrow">
                            DATA SISWA
                        </div>

                        <div class="panel__title">
                            Daftar Siswa
                        </div>

                        <div class="panel__sub">
                            Data siswa kelas XI RPL 1
                        </div>

                    </div>

                </div>


                <!-- TOOLS -->
                <div class="student-tools">

                    <div class="student-search">

                        <span class="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="search"
                            id="studentSearch"
                            placeholder="Cari nama atau NIS..."
                            autocomplete="off"
                        >

                    </div>


                    <div class="student-filter">

                        <span class="material-symbols-outlined">
                            filter_list
                        </span>

                        <select id="statusFilter">

                            <option value="all">
                                Semua Status
                            </option>

                            <option value="lunas">
                                Lunas
                            </option>

                            <option value="belum">
                                Belum Lunas
                            </option>

                        </select>

                    </div>

                </div>


                <!-- TABLE -->
                <div class="table-wrap">

                    <table class="table student-table">

                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>SISWA</th>
                                <th>NIS</th>
                                <th>KELAS</th>
                                <th>STATUS</th>
                                <th>TAGIHAN</th>
                                <th>DIBAYAR</th>
                                <th>SISA</th>
                                <th>AKSI</th>
                            </tr>
                        </thead>

                        <tbody id="studentTableBody"></tbody>

                    </table>


                    <div
                        class="table-empty"
                        id="emptyState"
                    >

                        <div class="table-empty__icon">
                            <span class="material-symbols-outlined">
                                person_search
                            </span>
                        </div>

                        <h3>Siswa tidak ditemukan</h3>

                        <p>
                            Coba gunakan kata kunci atau filter yang berbeda.
                        </p>

                    </div>

                </div>


                <!-- PAGINATION -->
                <div class="student-pagination">

                    <div
                        class="pagination-info"
                        id="paginationInfo"
                    >
                        Menampilkan 1–8 dari 36 siswa
                    </div>

                    <div class="pagination">

                        <button
                            type="button"
                            class="page-btn page-btn--arrow"
                            id="prevPage"
                            aria-label="Halaman sebelumnya"
                        >
                            <span class="material-symbols-outlined">
                                chevron_left
                            </span>
                        </button>

                        <div
                            class="pagination__numbers"
                            id="pageNumbers"
                        ></div>

                        <button
                            type="button"
                            class="page-btn page-btn--arrow"
                            id="nextPage"
                            aria-label="Halaman berikutnya"
                        >
                            <span class="material-symbols-outlined">
                                chevron_right
                            </span>
                        </button>

                    </div>

                </div>

            </section>


            <div class="content__foot">
                BBCashvia • Kas Kelas Digital • Data Siswa
            </div>

        </main>

    </div>

</div>


<!-- =====================================================
     MODAL TAMBAH / EDIT
     ===================================================== -->
<div
    class="modal-backdrop"
    id="studentModal"
    aria-hidden="true"
>

    <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
    >

        <div class="modal__header">

            <div>

                <div class="modal__eyebrow">
                    DATA SISWA
                </div>

                <h2 id="modalTitle">
                    Tambah Siswa
                </h2>

                <p id="modalDescription">
                    Masukkan data siswa untuk menambahkan siswa baru.
                </p>

            </div>

            <button
                type="button"
                class="modal__close"
                id="modalClose"
            >
                <span class="material-symbols-outlined">
                    close
                </span>
            </button>

        </div>


        <form id="studentForm">

            <input
                type="hidden"
                id="editingNis"
            >

            <div class="form-grid">

                <div class="form-group">

                    <label for="studentNis">
                        NIS <span>*</span>
                    </label>

                    <input
                        type="text"
                        id="studentNis"
                        placeholder="Contoh: 24037"
                        maxlength="20"
                        autocomplete="off"
                    >

                    <div
                        class="form-error"
                        id="nisError"
                    ></div>

                </div>


                <div class="form-group">

                    <label for="studentName">
                        Nama Siswa <span>*</span>
                    </label>

                    <input
                        type="text"
                        id="studentName"
                        placeholder="Nama lengkap siswa"
                        autocomplete="off"
                    >

                    <div
                        class="form-error"
                        id="nameError"
                    ></div>

                </div>


                <div class="form-group">

                    <label for="studentClass">
                        Kelas
                    </label>

                    <input
                        type="text"
                        id="studentClass"
                        value="XI RPL 1"
                        readonly
                    >

                    <div class="form-hint">
                        Kelas mengikuti penugasan Bendahara.
                    </div>

                </div>


                <div class="form-group">

                    <label for="studentStatus">
                        Status Pembayaran
                    </label>

                    <select id="studentStatus">

                        <option value="lunas">
                            Lunas
                        </option>

                        <option value="belum">
                            Belum Lunas
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label for="studentBill">
                        Total Tagihan
                    </label>

                    <input
                        type="number"
                        id="studentBill"
                        min="0"
                        step="1000"
                        value="300000"
                    >

                </div>


                <div class="form-group">

                    <label for="studentPaid">
                        Jumlah Dibayar
                    </label>

                    <input
                        type="number"
                        id="studentPaid"
                        min="0"
                        step="1000"
                        value="0"
                    >

                </div>

            </div>


            <div class="modal__footer">

                <button
                    type="button"
                    class="btn btn--ghost"
                    id="cancelStudentButton"
                >
                    Batal
                </button>

                <button
                    type="submit"
                    class="btn btn--primary"
                >
                    <span class="material-symbols-outlined">
                        save
                    </span>

                    Simpan Siswa
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =====================================================
     DETAIL
     ===================================================== -->
<div
    class="modal-backdrop"
    id="detailModal"
    aria-hidden="true"
>

    <div
        class="modal modal--detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalStudentName"
    >

        <div class="modal__header">

            <div>

                <div class="modal__eyebrow">
                    DETAIL SISWA
                </div>

                <h2>
                    Informasi Siswa
                </h2>

                <p>
                    Detail data siswa dan status pembayarannya.
                </p>

            </div>

            <button
                type="button"
                class="modal__close"
                id="detailModalClose"
            >
                <span class="material-symbols-outlined">
                    close
                </span>
            </button>

        </div>


        <div class="detail-profile">

            <div
                class="detail-avatar"
                id="detailAvatar"
            >
                AF
            </div>

            <div class="detail-profile__info">

                <strong id="modalStudentName">
                    Ahmad Fauzan
                </strong>

                <span id="modalNis">
                    NIS 24001
                </span>

            </div>

        </div>


        <div class="detail-grid">

            <div class="detail-item">
                <span>NIS</span>
                <strong id="detailNis">24001</strong>
            </div>

            <div class="detail-item">
                <span>Kelas</span>
                <strong id="modalClass">XI RPL 1</strong>
            </div>

            <div class="detail-item">
                <span>Status</span>
                <strong id="modalStatus">Lunas</strong>
            </div>

            <div class="detail-item">
                <span>Total Tagihan</span>
                <strong id="modalTagihan">Rp300.000</strong>
            </div>

            <div class="detail-item">
                <span>Sudah Dibayar</span>
                <strong id="modalDibayar">Rp300.000</strong>
            </div>

            <div class="detail-item">
                <span>Sisa Tagihan</span>
                <strong id="modalSisa">Rp0</strong>
            </div>

            <div class="detail-item detail-item--wide">
                <span>Keterangan</span>
                <strong id="detailMessage">
                    Pembayaran iuran sudah lunas.
                </strong>
            </div>

        </div>


        <div class="modal__footer">

            <button
                type="button"
                class="btn btn--ghost"
                id="detailCloseButton"
            >
                Tutup
            </button>

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

    <span class="material-symbols-outlined toast__icon">
        check_circle
    </span>

    <div>

        <strong id="toastTitle">
            Berhasil
        </strong>

        <span id="toastMessage">
            Data berhasil disimpan.
        </span>

    </div>

</div>

</body>
</html>
