<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Manajemen Pengguna - BBCashvia</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet"
    >

    @vite([
        'resources/css/admin-manajemen-pengguna.css',
        'resources/js/admin-manajemen-pengguna.js',
        'resources/css/konfirmasi-logout.css',
        'resources/js/konfirmasi-logout.js'
    ])
</head>

<body>

<div class="app-shell">

    <!-- ===== BACKDROP SIDEBAR (MOBILE) ===== -->
    <div class="sidebar-backdrop" id="sidebarBackdrop" aria-hidden="true"></div>

    <!-- =====================================================
         SIDEBAR
         ===================================================== -->
    <aside class="sidebar" id="sidebar" aria-label="Navigasi utama">

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

            <div class="sidebar__section">
                <div class="sidebar__section-title">Menu Utama</div>

                <a href="/dashboard/admin" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">dashboard</span>
                    <span class="side-link__text">Dashboard</span>
                </a>
            </div>

            <div class="sidebar__section">
                <div class="sidebar__section-title">Keuangan</div>

                <a href="/admin/transaksi" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                    <span class="side-link__text">Transaksi</span>
                </a>

                <a href="/admin/iuran" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">sell</span>
                    <span class="side-link__text">Iuran</span>
                </a>
            </div>

            <div class="sidebar__section">
                <div class="sidebar__section-title">Data</div>

                <a href="/admin/siswa" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">school</span>
                    <span class="side-link__text">Data Siswa</span>
                </a>
            </div>

            <div class="sidebar__section">
                <div class="sidebar__section-title">Laporan</div>

                <a href="/admin/laporan-kas" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">monitoring</span>
                    <span class="side-link__text">Laporan Kas</span>
                </a>

                <a href="/admin/riwayat-transaksi" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">manage_search</span>
                    <span class="side-link__text">Riwayat Transaksi</span>
                </a>
            </div>

            <div class="sidebar__section">
                <div class="sidebar__section-title">Manajemen</div>

                <a href="/admin/manajemen-pengguna" class="side-link is-active" aria-current="page">
                    <span class="material-symbols-outlined" aria-hidden="true">admin_panel_settings</span>
                    <span class="side-link__text">Manajemen Pengguna</span>
                </a>
            </div>

        </nav>

        <div class="sidebar__foot">

            <div class="sidebar__user">
                <div class="sidebar__avatar" aria-hidden="true">{{ strtoupper(mb_substr(auth()->user()->name ?? 'A', 0, 2)) }}</div>

                <div class="sidebar__userinfo">
                    <span class="sidebar__username">{{ auth()->user()->name ?? 'Administrator' }}</span>
                    <span class="sidebar__userrole">Admin</span>
                </div>
            </div>

            <a href="/logout" class="sidebar__logout">
                <span class="material-symbols-outlined" aria-hidden="true">logout</span>
                <span>Keluar</span>
            </a>

        </div>

    </aside>


    <!-- =====================================================
         MAIN SHELL
         ===================================================== -->
    <div class="shell">

        <!-- TOPBAR -->
        <header class="topbar">

            <div class="topbar__left">

                <button
                    type="button"
                    class="topbar__burger"
                    id="sidebarToggle"
                    aria-label="Buka navigasi"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">menu</span>
                </button>

                <div class="topbar__title">
                    <h1>Manajemen Pengguna</h1>
                    <p id="topbarDate">-</p>
                </div>

            </div>

            <div class="topbar__right">

                <span class="topbar__chip">
                    <span class="material-symbols-outlined" aria-hidden="true">calendar_month</span>
                    TA 2026/2027 • Ganjil
                </span>

                <div class="topbar__profilewrap">

                    <button
                        type="button"
                        class="topbar__profile"
                        id="profileBtn"
                        aria-expanded="false"
                        aria-haspopup="true"
                    >
                        <span class="topbar__avatar" aria-hidden="true">{{ strtoupper(mb_substr(auth()->user()->name ?? 'A', 0, 2)) }}</span>

                        <span class="topbar__profileinfo">
                            <span class="topbar__profilename">{{ auth()->user()->name ?? 'Administrator' }}</span>
                            <span class="topbar__profilerole">Admin • {{ auth()->user()->labelKelas() }}</span>
                        </span>

                        <span class="material-symbols-outlined topbar__chevron" aria-hidden="true">
                            expand_more
                        </span>
                    </button>

                    <div class="dropdown" id="profileMenu" role="menu">

                        <div class="dropdown__head">
                            <span class="dropdown__name">{{ auth()->user()->name ?? 'Administrator' }}</span>
                            <span class="dropdown__mail">Admin • {{ auth()->user()->labelKelas() }}</span>
                            <span class="dropdown__mail">{{ auth()->user()->email ?? '-' }}</span>
                        </div>

                        <a href="/logout" class="dropdown__item dropdown__item--danger" role="menuitem">
                            <span class="material-symbols-outlined" aria-hidden="true">logout</span>
                            <span>Keluar</span>
                        </a>

                    </div>

                </div>

            </div>

        </header>


        <!-- =================================================
             CONTENT
             ================================================= -->
        <main class="content">

            <!-- PAGE HEADER -->
            <section class="page-head">

                <div class="page-head__text">

                    <nav class="page-head__eyebrow breadcrumb" aria-label="Breadcrumb">
                        <a class="breadcrumb__link" href="/dashboard/admin">Beranda</a>
                        <span class="breadcrumb__sep" aria-hidden="true">›</span>
                        <span aria-current="page">Manajemen Pengguna</span>
                    </nav>

                    <h2 class="page-head__title">Manajemen Pengguna</h2>

                    <p class="page-head__sub">
                        Kelola akun pengguna BBCashvia dengan peran
                        Admin, Bendahara, dan Viewer. Hanya Admin yang
                        dapat membuat dan mengelola akun pengguna.
                    </p>

                </div>

                <div class="page-head__actions">

                    <button
                        type="button"
                        class="btn btn--primary"
                        id="btnTambahPengguna"
                    >
                        <span class="material-symbols-outlined" aria-hidden="true">
                            person_add
                        </span>

                        <span>Tambah Pengguna</span>
                    </button>

                </div>

            </section>


            <!-- =================================================
                 ATURAN SISTEM
                 ================================================= -->
            <section class="aturan">

                <div class="aturan__icon">
                    <span class="material-symbols-outlined" aria-hidden="true">
                        info
                    </span>
                </div>

                <div class="aturan__content">

                    <div class="aturan__title">
                        Aturan Manajemen Akun
                    </div>

                    <ul class="aturan__list">

                        <li>
                            <span class="material-symbols-outlined" aria-hidden="true">
                                check_circle
                            </span>

                            <span>
                                Hanya Admin yang dapat membuat,
                                mengubah, dan menghapus akun pengguna.
                            </span>
                        </li>

                        <li>
                            <span class="material-symbols-outlined" aria-hidden="true">
                                check_circle
                            </span>

                            <span>
                                Tidak tersedia registrasi akun secara publik.
                            </span>
                        </li>

                        <li>
                            <span class="material-symbols-outlined" aria-hidden="true">
                                check_circle
                            </span>

                            <span>
                                Jika pengguna lupa password, pengguna
                                menghubungi Admin untuk mendapatkan akun baru.
                            </span>
                        </li>

                    </ul>

                </div>

            </section>


            <!-- =================================================
                 SUMMARY
                 ================================================= -->
            <section class="sum-grid">

                <article class="sum-card">

                    <div class="sum-card__top">
                        <div>
                            <div class="sum-card__label">Admin</div>
                            <div class="sum-card__value" id="sumAdmin">0</div>
                        </div>

                        <div class="sum-card__icon sum-card__icon--primary">
                            <span class="material-symbols-outlined" aria-hidden="true">
                                admin_panel_settings
                            </span>
                        </div>
                    </div>

                    <div class="sum-card__note">
                        Pengelola seluruh sistem
                    </div>

                </article>


                <article class="sum-card">

                    <div class="sum-card__top">
                        <div>
                            <div class="sum-card__label">Bendahara</div>
                            <div class="sum-card__value" id="sumBendahara">0</div>
                        </div>

                        <div class="sum-card__icon sum-card__icon--success">
                            <span class="material-symbols-outlined" aria-hidden="true">
                                account_balance
                            </span>
                        </div>
                    </div>

                    <div class="sum-card__note">
                        Pengelola operasional kas
                    </div>

                </article>


                <article class="sum-card">

                    <div class="sum-card__top">
                        <div>
                            <div class="sum-card__label">Viewer</div>
                            <div class="sum-card__value" id="sumViewer">0</div>
                        </div>

                        <div class="sum-card__icon sum-card__icon--neutral">
                            <span class="material-symbols-outlined" aria-hidden="true">
                                visibility
                            </span>
                        </div>
                    </div>

                    <div class="sum-card__note">
                        Akses hanya untuk melihat
                    </div>

                </article>

            </section>


            <!-- =================================================
                 FILTER
                 ================================================= -->
            <section class="panel filterbar">

                <div class="filterbar__search">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        search
                    </span>

                    <input
                        type="search"
                        id="cariPengguna"
                        placeholder="Cari nama atau email pengguna..."
                        autocomplete="off"
                    >

                </div>


                <div class="filterbar__field">

                    <label for="filterPeran">
                        Peran
                    </label>

                    <select id="filterPeran">

                        <option value="semua">
                            Semua Peran
                        </option>

                        <option value="admin">
                            Admin
                        </option>

                        <option value="bendahara">
                            Bendahara
                        </option>

                        <option value="viewer">
                            Viewer
                        </option>

                    </select>

                </div>


                <div class="filterbar__field">

                    <label for="filterStatus">
                        Status
                    </label>

                    <select id="filterStatus">

                        <option value="semua">
                            Semua Status
                        </option>

                        <option value="aktif">
                            Aktif
                        </option>

                    </select>

                </div>


                <div class="filterbar__actions">

                    <button
                        type="button"
                        class="btn btn--secondary btn-reset"
                        id="btnResetFilter"
                    >
                        <span class="material-symbols-outlined" aria-hidden="true">
                            restart_alt
                        </span>

                        Reset

                    </button>

                </div>

            </section>


            <!-- =================================================
                 TABLE PANEL
                 ================================================= -->
            <section class="panel">

                <div class="panel__head">

                    <div>

                        <div class="panel__eyebrow">
                            DATA PENGGUNA
                        </div>

                        <div class="panel__title">
                            Daftar Pengguna
                        </div>

                    </div>

                    <div
                        class="table-panel__info"
                        id="jumlahPengguna"
                    >
                        0 pengguna
                    </div>

                </div>


                <div class="table-wrap">

                    <table class="data-table">

                        <thead>

                            <tr>

                                <th>Pengguna</th>

                                <th>Peran</th>

                                <th>Jenis Pengguna</th>

                                <th>Kelas</th>

                                <th>Status</th>

                                <th>Login Terakhir</th>

                                <th class="th-c">
                                    Aksi
                                </th>

                            </tr>

                        </thead>

                        <tbody id="isiTabelPengguna"></tbody>

                    </table>

                </div>


                <!-- EMPTY -->
                <div
                    class="empty-state"
                    id="emptyState"
                >

                    <div class="empty-state__icon">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            group_off
                        </span>
                    </div>

                    <h3>
                        Pengguna tidak ditemukan
                    </h3>

                    <p>
                        Coba ubah kata pencarian atau filter yang digunakan.
                    </p>

                    <button
                        type="button"
                        class="btn btn--secondary btn--sm"
                        id="btnKosongkanFilter"
                    >
                        Reset Filter
                    </button>

                </div>

            </section>


            <div class="content__foot">
                BBCashvia • Kas Kelas Digital
            </div>

        </main>

    </div>

</div>


<!-- =========================================================
     MODAL TAMBAH / EDIT
     ========================================================= -->
<div
    class="modal"
    id="modalForm"
    aria-hidden="true"
>

    <div class="modal-backdrop" data-close-modal></div>

    <div
        class="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalFormTitle"
    >

        <div class="modal__head">

            <div>

                <div class="modal__eyebrow">
                    AKUN PENGGUNA
                </div>

                <h3
                    class="modal__title"
                    id="modalFormTitle"
                >
                    Tambah Pengguna
                </h3>

                <p class="modal__sub">
                    Buat akun baru untuk pengguna BBCashvia.
                </p>

            </div>

            <button
                type="button"
                class="modal__close"
                data-close-modal
                aria-label="Tutup"
            >
                <span class="material-symbols-outlined" aria-hidden="true">
                    close
                </span>
            </button>

        </div>


        <form id="formPengguna">

            <div class="modal__body">

                <div
                    class="form-error"
                    id="formError"
                ></div>


                <div class="form-grid">

                    <div class="field field--full">

                        <label for="inputNama">
                            Nama Pengguna
                        </label>

                        <input
                            type="text"
                            id="inputNama"
                            placeholder="Contoh: Rani Puspita"
                            required
                        >

                    </div>


                    <div class="field field--full">

                        <label for="inputEmail">
                            Email
                        </label>

                        <input
                            type="email"
                            id="inputEmail"
                            placeholder="nama@gmail.com"
                            required
                        >

                        <span class="field__hint">
                            Gunakan email yang benar-benar digunakan pengguna.
                        </span>

                    </div>


                    <div class="field">

                        <label for="inputPeran">
                            Peran
                        </label>

                        <select
                            id="inputPeran"
                            required
                        >

                            <option value="admin">
                                Admin
                            </option>

                            <option value="bendahara">
                                Bendahara
                            </option>

                            <option value="viewer">
                                Viewer
                            </option>

                        </select>

                    </div>


                    <div class="field" id="fieldJenisViewer">

                        <label for="inputJenisViewer">
                            Jenis Pengguna
                        </label>

                        <select id="inputJenisViewer">
                            <option value="siswa">
                                Siswa
                            </option>

                            <option value="wali_kelas">
                                Wali Kelas
                            </option>
                        </select>

                        <span class="field__hint" id="hintJenisViewer">
                            Bendahara kelas adalah siswa; viewer dapat berupa
                            siswa atau wali kelas.
                        </span>

                    </div>


                    <div class="field field--full" id="fieldKelas">

                        <label for="inputKelas">
                            Kelas
                        </label>

                        <select id="inputKelas">
                            <option value="">
                                - Semua Kelas (khusus Admin) -
                            </option>
                        </select>

                        <span class="field__hint">
                            Bendahara &amp; viewer hanya melihat kelas ini. Admin selalu melihat semua kelas.
                        </span>

                    </div>


                    <div class="field">

                        <label for="inputPassword">
                            Password Awal
                        </label>

                        <div class="password-wrap">

                            <input
                                type="password"
                                id="inputPassword"
                                placeholder="Minimal 8 karakter"
                            >

                            <button
                                type="button"
                                class="password-toggle"
                                id="togglePassword"
                                aria-label="Tampilkan password"
                            >
                                <span class="material-symbols-outlined" aria-hidden="true">
                                    visibility
                                </span>
                            </button>

                        </div>

                        <span class="field__hint">
                            Untuk akun baru, password ini diberikan Admin kepada pengguna.
                        </span>

                    </div>

                </div>

            </div>


            <div class="modal__foot">

                <button
                    type="button"
                    class="btn btn--secondary"
                    data-close-modal
                >
                    Batal
                </button>

                <button
                    type="submit"
                    class="btn btn--primary"
                    id="btnSimpanPengguna"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        save
                    </span>

                    Simpan Pengguna
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =========================================================
     MODAL HAPUS
     ========================================================= -->
<div
    class="modal"
    id="modalHapus"
    aria-hidden="true"
>

    <div class="modal-backdrop" data-close-modal></div>

    <div
        class="modal-dialog modal-dialog--delete"
        role="dialog"
        aria-modal="true"
    >

        <div class="modal__head">

            <div>

                <div class="modal__eyebrow modal__eyebrow--danger">
                    HAPUS AKUN
                </div>

                <h3 class="modal__title">
                    Hapus Pengguna?
                </h3>

            </div>

            <button
                type="button"
                class="modal__close"
                data-close-modal
                aria-label="Tutup"
            >
                <span class="material-symbols-outlined" aria-hidden="true">
                    close
                </span>
            </button>

        </div>


        <div class="modal__body">

            <div class="delete-box">

                <div class="delete-box__icon">
                    <span class="material-symbols-outlined" aria-hidden="true">
                        delete
                    </span>
                </div>

                <div>

                    <div
                        class="delete-box__title"
                        id="hapusNama"
                    >
                        -
                    </div>

                    <p>
                        Akun ini akan dihapus dari Manajemen Pengguna.
                        Jika pengguna lupa password, akun dapat dibuat
                        kembali oleh Admin dengan password baru.
                    </p>

                </div>

            </div>

        </div>


        <div class="modal__foot">

            <button
                type="button"
                class="btn btn--secondary"
                data-close-modal
            >
                Batal
            </button>

            <button
                type="button"
                class="btn btn--danger"
                id="btnKonfirmasiHapus"
            >
                <span class="material-symbols-outlined" aria-hidden="true">
                    delete
                </span>

                Hapus Pengguna
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

    <div class="toast__icon">
        <span class="material-symbols-outlined" aria-hidden="true">
            check
        </span>
    </div>

    <div
        class="toast__text"
        id="toastText"
    >
        Berhasil.
    </div>

</div>

    @include('partials.konfirmasi-logout')
</body>
</html>
