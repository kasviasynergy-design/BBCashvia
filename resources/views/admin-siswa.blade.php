<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Data Siswa — BBCashvia</title>

    <meta name="description"
        content="Halaman Data Siswa BBCashvia — kelola daftar anggota kelas, lengkap dengan NIS, kelas, kontak, dan status iuran setiap siswa.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet">

    @vite([
        'resources/css/admin-siswa.css',
        'resources/js/admin-siswa.js'
    ])
</head>

<body>

    <!-- ===== BACKDROP SIDEBAR (MOBILE) ===== -->
    <div class="sidebar-backdrop" id="sidebarBackdrop" aria-hidden="true"></div>


    <!-- =====================================================
         SIDEBAR
    ====================================================== -->
    <aside class="sidebar" id="sidebar" aria-label="Navigasi utama">

        <div class="sidebar__brand">
            <div class="sidebar__logo">
                <span class="material-symbols-outlined" aria-hidden="true">account_balance_wallet</span>
            </div>
            <div class="sidebar__brandtext">
                <span class="sidebar__brandname">BBCashvia</span>
                <span class="sidebar__brandsub">Kas Kelas Digital</span>
            </div>
        </div>


        <nav class="sidebar__nav">

            <!-- ===== MENU UTAMA ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Menu Utama
                </div>

                <a href="/dashboard/admin" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">dashboard</span>
                    <span class="side-link__text">Dashboard</span>
                </a>

            </div>


            <!-- ===== KEUANGAN ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Keuangan
                </div>

                <a href="/admin/transaksi" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                    <span class="side-link__text">Transaksi</span>
                </a>

                <a href="/admin/iuran" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">sell</span>
                    <span class="side-link__text">Iuran</span>
                </a>

            </div>


            <!-- ===== DATA ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Data
                </div>

                <a href="/admin/siswa" class="side-link is-active" aria-current="page">
                    <span class="material-symbols-outlined" aria-hidden="true">school</span>
                    <span class="side-link__text">Data Siswa</span>
                </a>

            </div>


            <!-- ===== LAPORAN ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Laporan
                </div>

                <a href="/admin/laporan-kas" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">monitoring</span>
                    <span class="side-link__text">Laporan Kas</span>
                </a>

                <a href="/admin/riwayat-transaksi" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">manage_search</span>
                    <span class="side-link__text">Riwayat Transaksi</span>
                </a>

            </div>


            <!-- ===== MANAJEMEN ===== -->
            <div class="sidebar__section">

                <div class="sidebar__section-title">
                    Manajemen
                </div>

                <a href="/admin/manajemen-pengguna" class="side-link">
                    <span class="material-symbols-outlined" aria-hidden="true">admin_panel_settings</span>
                    <span class="side-link__text">Manajemen Pengguna</span>
                </a>

            </div>

        </nav>

        <div class="sidebar__foot">

            <div class="sidebar__user">
                <div class="sidebar__avatar" aria-hidden="true">AN</div>
                <div class="sidebar__userinfo">
                    <span class="sidebar__username">Azis N.</span>
                    <span class="sidebar__userrole">Admin</span>
                </div>
            </div>

            <a href="/" class="sidebar__logout">
                <span class="material-symbols-outlined" aria-hidden="true">logout</span>
                <span>Keluar</span>
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

                <button type="button" class="topbar__burger" id="sidebarToggle" aria-label="Buka menu navigasi">
                    <span class="material-symbols-outlined" aria-hidden="true">menu</span>
                </button>

                <div class="topbar__title">
                    <h1>Data Siswa</h1>
                    <p id="topbarDate">—</p>
                </div>

            </div>


            <div class="topbar__right">

                <span class="topbar__chip">
                    <span class="material-symbols-outlined" aria-hidden="true">calendar_month</span>
                    TA 2026/2027 • Ganjil
                </span>

                <div class="topbar__profilewrap">

                    <button type="button" class="topbar__profile" id="profileBtn" aria-haspopup="true"
                        aria-expanded="false">
                        <span class="topbar__avatar" aria-hidden="true">AN</span>
                        <span class="topbar__profileinfo">
                            <span class="topbar__profilename">Azis N.</span>
                            <span class="topbar__profilerole">Admin</span>
                        </span>
                        <span class="material-symbols-outlined topbar__chevron" aria-hidden="true">expand_more</span>
                    </button>

                    <div class="dropdown" id="profileMenu" role="menu">

                        <div class="dropdown__head">
                            <span class="dropdown__name">Azis N.</span>
                            <span class="dropdown__mail">azinun@bbcashvia.sch.id</span>
                        </div>

                        <a href="/" class="dropdown__item dropdown__item--danger" role="menuitem">
                            <span class="material-symbols-outlined" aria-hidden="true">logout</span>
                            <span>Keluar</span>
                        </a>

                    </div>

                </div>

            </div>

        </header>


        <!-- ===== KONTEN ===== -->
        <main class="content">

            <!-- ===== KEPALA HALAMAN ===== -->
            <section class="page-head">

                <div class="page-head__text">
                    <p class="page-head__eyebrow">Panel Admin • Kas Kelas</p>
                    <h2 class="page-head__title">Data Siswa</h2>
                    <p class="page-head__sub">
                        Kelola daftar anggota kelas — tambah, ubah, dan hapus data siswa
                        beserta status iurannya dalam satu tempat.
                    </p>
                </div>

                <div class="page-head__actions">
                    <button type="button" class="btn btn--primary" id="btnTambahSiswa">
                        <span class="material-symbols-outlined" aria-hidden="true">person_add</span>
                        <span>Tambah Siswa</span>
                    </button>
                </div>

            </section>


            <!-- ===== RINGKASAN (MENGIKUTI FILTER) ===== -->
            <section class="sum-grid" aria-label="Ringkasan data siswa">

                <article class="sum-card sum-card--total">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">groups</span>
                    </div>
                    <div>
                        <p class="sum-card__label">Total Siswa</p>
                        <p class="sum-card__value" id="sumTotal">—</p>
                        <p class="sum-card__note" id="sumTotalNote">sesuai filter</p>
                    </div>
                </article>

                <article class="sum-card sum-card--lk">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">male</span>
                    </div>
                    <div>
                        <p class="sum-card__label">Laki-laki</p>
                        <p class="sum-card__value" id="sumLk">—</p>
                        <p class="sum-card__note" id="sumLkNote">siswa</p>
                    </div>
                </article>

                <article class="sum-card sum-card--pr">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">female</span>
                    </div>
                    <div>
                        <p class="sum-card__label">Perempuan</p>
                        <p class="sum-card__value" id="sumPr">—</p>
                        <p class="sum-card__note" id="sumPrNote">siswa</p>
                    </div>
                </article>

                <article class="sum-card sum-card--tunggak">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">event_busy</span>
                    </div>
                    <div>
                        <p class="sum-card__label">Belum Bayar</p>
                        <p class="sum-card__value" id="sumBelum">—</p>
                        <p class="sum-card__note" id="sumBelumNote">iuran Oktober 2026</p>
                    </div>
                </article>

            </section>


            <!-- ===== PANEL FILTER ===== -->
            <section class="panel filterbar" aria-label="Filter siswa">

                <div class="filterbar__search">
                    <span class="material-symbols-outlined" aria-hidden="true">search</span>
                    <input type="search" id="cariSiswa" placeholder="Cari nama siswa atau NIS…" autocomplete="off">
                </div>

                <div class="filterbar__selects">

                    <label class="field-select">
                        <span class="field-select__label">Kelas</span>
                        <select id="filterKelas">
                            <option value="semua">Semua Kelas</option>
                            <option value="XI RPL 1">XI RPL 1</option>
                            <option value="XI RPL 2">XI RPL 2</option>
                            <option value="X TKJ 1">X TKJ 1</option>
                        </select>
                    </label>

                    <label class="field-select">
                        <span class="field-select__label">Jenis Kelamin</span>
                        <select id="filterJk">
                            <option value="semua">Semua</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </label>

                    <label class="field-select">
                        <span class="field-select__label">Status Iuran</span>
                        <select id="filterIuran">
                            <option value="semua">Semua Status</option>
                            <option value="lunas">Sudah Bayar</option>
                            <option value="sebagian">Sebagian</option>
                            <option value="belum">Belum Bayar</option>
                        </select>
                    </label>

                    <button type="button" class="btn btn--ghost btn--sm" id="btnResetFilter">
                        <span class="material-symbols-outlined" aria-hidden="true">restart_alt</span>
                        <span>Reset</span>
                    </button>

                </div>

            </section>


            <!-- ===== TABEL SISWA ===== -->
            <section class="panel">

                <div class="panel__head">
                    <div>
                        <p class="panel__eyebrow">ANGGOTA KELAS</p>
                        <h3 class="panel__title">Daftar Siswa</h3>
                        <p class="panel__sub" id="tabelInfo">— siswa ditampilkan</p>
                    </div>
                </div>

                <div class="table-wrap">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Siswa</th>
                                <th scope="col">Kelas</th>
                                <th scope="col">Jenis Kelamin</th>
                                <th scope="col">Kontak</th>
                                <th scope="col">Status Iuran</th>
                                <th scope="col" class="th-c">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="isiTabelSiswa"></tbody>
                    </table>

                    <div class="empty-state" id="emptyState" hidden>
                        <span class="material-symbols-outlined" aria-hidden="true">search_off</span>
                        <p>Tidak ada siswa yang cocok dengan filter.</p>
                        <button type="button" class="btn btn--ghost btn--sm" id="btnKosongkanFilter">
                            Reset Filter
                        </button>
                    </div>
                </div>

            </section>


            <footer class="content__foot">
                BBCashvia — Kas Kelas Digital • Data yang tampil merupakan data simulasi untuk pengembangan tampilan.
            </footer>

        </main>

    </div>


    <!-- =====================================================
         MODAL: TAMBAH / UBAH SISWA
    ====================================================== -->
    <div class="modal-backdrop" id="modalForm" aria-hidden="true">

        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalFormTitle">

            <div class="modal__head">
                <div>
                    <p class="modal__eyebrow" id="modalFormEyebrow">SISWA BARU</p>
                    <h3 class="modal__title" id="modalFormTitle">Tambah Siswa</h3>
                </div>
                <button type="button" class="modal__close" data-tutup-modal="modalForm" aria-label="Tutup">
                    <span class="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
            </div>

            <form class="modal__body" id="formSiswa" novalidate>

                <div class="form-grid">

                    <label class="field">
                        <span class="field__label">NIS <b class="wajib">*</b></span>
                        <input type="text" id="inputNis" inputmode="numeric" maxlength="4"
                            placeholder="Contoh: 2441" required autocomplete="off">
                    </label>

                    <label class="field">
                        <span class="field__label">Kelas <b class="wajib">*</b></span>
                        <select id="inputKelas" required>
                            <option value="">— Pilih kelas —</option>
                            <option value="XI RPL 1">XI RPL 1</option>
                            <option value="XI RPL 2">XI RPL 2</option>
                            <option value="X TKJ 1">X TKJ 1</option>
                        </select>
                    </label>

                </div>


                <label class="field">
                    <span class="field__label">Nama Lengkap <b class="wajib">*</b></span>
                    <input type="text" id="inputNama" placeholder="Contoh: Rizky Ananda Putra" required
                        autocomplete="off">
                </label>


                <!-- Jenis kelamin -->
                <div class="field">
                    <span class="field__label">Jenis Kelamin <b class="wajib">*</b></span>
                    <div class="jenis-toggle" role="radiogroup" aria-label="Jenis kelamin">

                        <label class="jenis-pill">
                            <input type="radio" name="jenisKelamin" value="L" checked>
                            <span class="material-symbols-outlined" aria-hidden="true">male</span>
                            <span>Laki-laki</span>
                        </label>

                        <label class="jenis-pill">
                            <input type="radio" name="jenisKelamin" value="P">
                            <span class="material-symbols-outlined" aria-hidden="true">female</span>
                            <span>Perempuan</span>
                        </label>

                    </div>
                </div>


                <label class="field">
                    <span class="field__label">No. HP / WhatsApp <span class="field__opsional">(opsional)</span></span>
                    <span class="input-kontak">
                        <span class="input-kontak__pre" aria-hidden="true">
                            <span class="material-symbols-outlined">call</span>
                        </span>
                        <input type="tel" id="inputHp" inputmode="tel" placeholder="08xx xxxx xxxx"
                            autocomplete="off" maxlength="16">
                    </span>
                </label>


                <p class="form-note">
                    <span class="material-symbols-outlined">info</span>
                    Siswa baru otomatis berstatus <b>Belum Bayar</b> pada rekap iuran bulan berjalan.
                </p>

                <p class="form-error" id="formError" hidden></p>


                <div class="modal__foot">
                    <button type="button" class="btn btn--ghost" data-tutup-modal="modalForm">Batal</button>
                    <button type="submit" class="btn btn--primary" id="btnSimpanSiswa">
                        <span class="material-symbols-outlined" aria-hidden="true">check</span>
                        <span id="btnSimpanText">Simpan Siswa</span>
                    </button>
                </div>

            </form>

        </div>

    </div>


    <!-- =====================================================
         MODAL: DETAIL SISWA
    ====================================================== -->
    <div class="modal-backdrop" id="modalDetail" aria-hidden="true">

        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="detailNama">

            <div class="modal__head">
                <div>
                    <p class="modal__eyebrow">DETAIL SISWA</p>
                    <h3 class="modal__title" id="detailNama">—</h3>
                </div>
                <button type="button" class="modal__close" data-tutup-modal="modalDetail" aria-label="Tutup">
                    <span class="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
            </div>

            <div class="modal__body">

                <div class="detail-profil">
                    <div class="detail-profil__avatar" id="detailAvatar" aria-hidden="true">—</div>
                    <div class="detail-profil__info">
                        <p class="detail-profil__nama" id="detailNamaKecil">—</p>
                        <div class="detail-profil__meta">
                            <span class="cell-kelas" id="detailKelas">—</span>
                            <span class="chip chip--lk" id="detailJk">—</span>
                        </div>
                    </div>
                </div>


                <div class="detail-grid">

                    <div class="detail-item">
                        <span class="detail-item__label">NIS</span>
                        <span class="detail-item__value detail-item__value--mono" id="detailNis">—</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Jenis Kelamin</span>
                        <span class="detail-item__value" id="detailJkTeks">—</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">No. HP / WhatsApp</span>
                        <span class="detail-item__value detail-item__value--mono" id="detailHp">—</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Status Iuran Berjalan</span>
                        <span class="detail-item__value">
                            <span class="badge badge--none" id="detailStatus">—</span>
                        </span>
                    </div>

                </div>


                <!-- Riwayat iuran ringkas -->
                <div class="riwayat-box" aria-label="Ringkasan iuran siswa">

                    <p class="riwayat-box__title">
                        <span class="material-symbols-outlined" aria-hidden="true">sell</span>
                        Ringkasan Iuran (Besar iuran Rp 250.000/bulan)
                    </p>

                    <div id="riwayatIuran"></div>

                </div>

            </div>

            <div class="modal__foot">
                <button type="button" class="btn btn--ghost" data-tutup-modal="modalDetail">Tutup</button>
                <a href="/admin/iuran" class="btn btn--primary">
                    <span class="material-symbols-outlined" aria-hidden="true">payments</span>
                    <span>Kelola Iuran Siswa</span>
                </a>
            </div>

        </div>

    </div>


    <!-- =====================================================
         MODAL: KONFIRMASI HAPUS SISWA
    ====================================================== -->
    <div class="modal-backdrop" id="modalHapus" aria-hidden="true">

        <div class="modal modal--kecil" role="alertdialog" aria-modal="true" aria-labelledby="modalHapusTitle">

            <div class="modal__body modal__body--hapus">

                <span class="hapus-icon hapus-icon--merah" aria-hidden="true">
                    <span class="material-symbols-outlined">person_remove</span>
                </span>

                <h3 class="modal__title" id="modalHapusTitle">Hapus Data Siswa?</h3>

                <p class="hapus-text" id="hapusText">
                    Data siswa akan dihapus dari daftar anggota kelas.
                </p>

                <div class="modal__foot modal__foot--tengah">
                    <button type="button" class="btn btn--ghost" data-tutup-modal="modalHapus">Batal</button>
                    <button type="button" class="btn btn--danger" id="btnKonfirmasiHapus">
                        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
                        <span>Ya, Hapus</span>
                    </button>
                </div>

            </div>

        </div>

    </div>


    <!-- ===== TOAST ===== -->
    <div class="toast" id="toast" role="status" aria-live="polite">
        <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
        <span id="toastText">Tersimpan</span>
    </div>


</body>

</html>
