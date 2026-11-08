
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Transaksi - BBCashvia</title>

    <meta name="description"
        content="Halaman Transaksi BBCashvia - catat pemasukan dan pengeluaran kas kelas lengkap dengan rincian tagihan, uang diterima, kembalian, dan uang yang masuk ke kas.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet">

    @vite([
        'resources/css/admin-transaksi.css',
        'resources/js/admin-transaksi.js',
        'resources/css/konfirmasi-logout.css',
        'resources/js/konfirmasi-logout.js'
    ])
</head>

<body>

    <!-- BACKDROP SIDEBAR -->
    <div class="sidebar-backdrop" id="sidebarBackdrop" aria-hidden="true"></div>

    <!-- SIDEBAR -->
    <aside class="sidebar" id="sidebar" aria-label="Navigasi utama">

        <!-- BRAND -->
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

        <!-- NAVIGASI -->
        <nav class="sidebar__nav">

            <!-- MENU UTAMA -->
            <div class="sidebar__section">
                <div class="sidebar__section-title">
                    Menu Utama
                </div>

                <a
                    href="/dashboard/admin"
                    class="side-link {{ request()->is('dashboard/admin') ? 'is-active' : '' }}"
                    @if(request()->is('dashboard/admin')) aria-current="page" @endif
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        dashboard
                    </span>
                    <span class="side-link__text">Dashboard</span>
                </a>
            </div>

            <!-- KEUANGAN -->
            <div class="sidebar__section">
                <div class="sidebar__section-title">
                    Keuangan
                </div>

                <a
                    href="/admin/transaksi"
                    class="side-link {{ request()->is('admin/transaksi') ? 'is-active' : '' }}"
                    @if(request()->is('admin/transaksi')) aria-current="page" @endif
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        receipt_long
                    </span>
                    <span class="side-link__text">Transaksi</span>
                </a>

                <a
                    href="/admin/iuran"
                    class="side-link {{ request()->is('admin/iuran') ? 'is-active' : '' }}"
                    @if(request()->is('admin/iuran')) aria-current="page" @endif
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        sell
                    </span>
                    <span class="side-link__text">Iuran</span>
                </a>
            </div>

            <!-- DATA -->
            <div class="sidebar__section">
                <div class="sidebar__section-title">
                    Data
                </div>

                <a
                    href="/admin/siswa"
                    class="side-link {{ request()->is('admin/siswa') ? 'is-active' : '' }}"
                    @if(request()->is('admin/siswa')) aria-current="page" @endif
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        school
                    </span>
                    <span class="side-link__text">Data Siswa</span>
                </a>
            </div>

            <!-- LAPORAN -->
            <div class="sidebar__section">
                <div class="sidebar__section-title">
                    Laporan
                </div>

                <a
                    href="/admin/laporan-kas"
                    class="side-link {{ request()->is('admin/laporan-kas') ? 'is-active' : '' }}"
                    @if(request()->is('admin/laporan-kas')) aria-current="page" @endif
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        monitoring
                    </span>
                    <span class="side-link__text">Laporan Kas</span>
                </a>

                <a
                    href="/admin/riwayat-transaksi"
                    class="side-link {{ request()->is('admin/riwayat-transaksi') ? 'is-active' : '' }}"
                    @if(request()->is('admin/riwayat-transaksi')) aria-current="page" @endif
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        manage_search
                    </span>
                    <span class="side-link__text">Riwayat Transaksi</span>
                </a>
            </div>

            <!-- MANAJEMEN -->
            <div class="sidebar__section">
                <div class="sidebar__section-title">
                    Manajemen
                </div>

                <a
                    href="/admin/manajemen-pengguna"
                    class="side-link {{ request()->is('admin/manajemen-pengguna') ? 'is-active' : '' }}"
                    @if(request()->is('admin/manajemen-pengguna')) aria-current="page" @endif
                >
                    <span class="material-symbols-outlined" aria-hidden="true">
                        admin_panel_settings
                    </span>
                    <span class="side-link__text">Manajemen Pengguna</span>
                </a>
            </div>

        </nav>

        <!-- PROFIL ADMIN DAN LOGOUT -->
        <div class="sidebar__foot">

            <div class="sidebar__user">
                <div class="sidebar__avatar">
                    <span class="material-symbols-outlined" aria-hidden="true">
                        account_circle
                    </span>
                </div>

                <div class="sidebar__userinfo">
                    <span class="sidebar__username">
                        {{ auth()->user()->name ?? 'Administrator' }}
                    </span>

                    <span class="sidebar__userrole">
                        Admin
                    </span>
                </div>
            </div>

            <form action="{{ url('/logout') }}" method="POST">
                @csrf

                <button type="submit" class="sidebar__logout">
                    <span class="material-symbols-outlined" aria-hidden="true">
                        logout
                    </span>
                    <span>Logout</span>
                </button>
            </form>

        </div>

    </aside>

    <!-- KONTEN UTAMA -->
    <div class="shell">

        <!-- ===== TOPBAR ===== -->
        <header class="topbar">

            <div class="topbar__left">

                <button type="button" class="topbar__burger" id="sidebarToggle" aria-label="Buka menu navigasi">
                    <span class="material-symbols-outlined" aria-hidden="true">menu</span>
                </button>

                <div class="topbar__title">
                    <h1>Transaksi</h1>
                    <p id="topbarDate">-</p>
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
                        <span class="topbar__avatar" aria-hidden="true">{{ strtoupper(mb_substr(auth()->user()->name ?? 'A', 0, 2)) }}</span>
                        <span class="topbar__profileinfo">
                            <span class="topbar__profilename">{{ auth()->user()->name ?? 'Administrator' }}</span>
                            <span class="topbar__profilerole">Admin • {{ auth()->user()->labelKelas() }}</span>
                        </span>
                        <span class="material-symbols-outlined topbar__chevron" aria-hidden="true">expand_more</span>
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

        <!-- ===== KONTEN ===== -->
        <main class="content">

            <!-- KEPALA HALAMAN -->
            <section class="page-head">
                <div class="page-head__text">
                    <nav class="page-head__eyebrow breadcrumb" aria-label="Breadcrumb">
                        <a class="breadcrumb__link" href="/dashboard/admin">Beranda</a>
                        <span class="breadcrumb__sep" aria-hidden="true">›</span>
                        <span aria-current="page">Transaksi</span>
                    </nav>
                    <h2 class="page-head__title">Transaksi</h2>
                    <p class="page-head__sub">
                        Catat pemasukan dan pengeluaran kas kelas lengkap dengan rincian dan bukti.
                    </p>
                </div>
                <div class="page-head__actions">
                    <button type="button" class="btn btn--secondary" id="btnTambahBanyak">
                        <span class="material-symbols-outlined" aria-hidden="true">playlist_add</span>
                        <span>Catat Banyak</span>
                    </button>

                    <button type="button" class="btn btn--primary" id="btnTambahTransaksi">
                        <span class="material-symbols-outlined" aria-hidden="true">add</span>
                        <span>Catat Transaksi</span>
                    </button>
                </div>
            </section>

            <!-- RINGKASAN -->
            <section class="sum-grid" aria-label="Ringkasan transaksi">

                <article class="sum-card sum-card--masuk">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            trending_up
                        </span>
                    </div>

                    <div>
                        <p class="sum-card__label">Total Pemasukan</p>
                        <p class="sum-card__value" id="sumMasuk">-</p>
                        <p class="sum-card__note" id="sumMasukNote">
                            sesuai filter
                        </p>
                    </div>
                </article>

                <article class="sum-card sum-card--keluar">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            trending_down
                        </span>
                    </div>

                    <div>
                        <p class="sum-card__label">Total Pengeluaran</p>
                        <p class="sum-card__value" id="sumKeluar">-</p>
                        <p class="sum-card__note" id="sumKeluarNote">
                            sesuai filter
                        </p>
                    </div>
                </article>

                <article class="sum-card sum-card--saldo">
                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            account_balance
                        </span>
                    </div>

                    <div>
                        <p class="sum-card__label">Selisih Bersih</p>
                        <p class="sum-card__value" id="sumSelisih">-</p>
                        <p class="sum-card__note" id="sumSelisihNote">
                            pemasukan − pengeluaran
                        </p>
                    </div>
                </article>

            </section>

            <!-- FILTER TRANSAKSI -->
            <section class="panel filterbar" aria-label="Filter transaksi">

                <div class="filterbar__search">
                    <span class="material-symbols-outlined" aria-hidden="true">
                        search
                    </span>

                    <input
                        type="search"
                        id="cariTransaksi"
                        placeholder="Cari ID, keterangan, atau kategori…"
                        autocomplete="off"
                    >
                </div>

                <div class="filterbar__selects">

                    <label class="field-select">
                        <span class="field-select__label">Jenis</span>

                        <select id="filterJenis">
                            <option value="semua">Semua Jenis</option>
                            <option value="masuk">Pemasukan</option>
                            <option value="keluar">Pengeluaran</option>
                        </select>
                    </label>

                    <label class="field-select">
                        <span class="field-select__label">Kategori</span>

                        <select id="filterKategori">
                            <option value="semua">Semua Kategori</option>
                        </select>
                    </label>

                    <label class="field-select">
                        <span class="field-select__label">Bulan</span>

                        <select id="filterBulan">
                            <option value="semua">Semua Bulan</option>
                        </select>
                    </label>

                    <button type="button" class="btn btn--ghost btn--sm" id="btnResetFilter">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            restart_alt
                        </span>
                        <span>Reset</span>
                    </button>

                </div>
            </section>

            <!-- TABEL TRANSAKSI -->
            <section class="panel">

                <div class="panel__head">
                    <div>
                        <p class="panel__eyebrow">BUKU KAS</p>
                        <h3 class="panel__title">Daftar Transaksi</h3>
                        <p class="panel__sub" id="tabelInfo">
                            - transaksi ditampilkan
                        </p>
                    </div>
                </div>

                <div class="table-wrap">

                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">ID Transaksi</th>
                                <th scope="col">Keterangan</th>
                                <th scope="col">Kategori</th>
                                <th scope="col">Tanggal</th>
                                <th scope="col">Dicatat oleh</th>
                                <th scope="col" class="th-r">Nominal</th>
                                <th scope="col" class="th-c">Aksi</th>
                            </tr>
                        </thead>

                        <tbody id="isiTabelTransaksi"></tbody>
                    </table>

                    <div class="empty-state" id="emptyState" hidden>
                        <span class="material-symbols-outlined" aria-hidden="true">
                            search_off
                        </span>

                        <p>Tidak ada transaksi yang cocok dengan filter.</p>

                        <button
                            type="button"
                            class="btn btn--ghost btn--sm"
                            id="btnKosongkanFilter"
                        >
                            Reset Filter
                        </button>
                    </div>

                </div>
            </section>

            <!-- FOOTER -->
            <footer class="content__foot">
                BBCashvia - Kas Kelas Digital • Seluruh data ditampilkan langsung dari database.
            </footer>

        </main>
    </div>

    <!-- MODAL CATAT / UBAH TRANSAKSI -->
    <div class="modal-backdrop" id="modalForm" aria-hidden="true">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalFormTitle">

            <div class="modal__head">
                <div>
                    <p class="modal__eyebrow" id="modalFormEyebrow">TRANSAKSI BARU</p>
                    <h3 class="modal__title" id="modalFormTitle">Catat Transaksi</h3>
                </div>

                <button
                    type="button"
                    class="modal__close"
                    data-tutup-modal="modalForm"
                    aria-label="Tutup"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
            </div>

            <form class="modal__body" id="formTransaksi" novalidate>

                <div class="field">
                    <span class="field__label">Jenis Transaksi</span>

                    <div class="jenis-toggle" role="radiogroup" aria-label="Jenis transaksi">

                        <label class="jenis-pill">
                            <input type="radio" name="jenisTransaksi" value="masuk" checked>
                            <span class="material-symbols-outlined" aria-hidden="true">trending_up</span>
                            <span>Pemasukan</span>
                        </label>

                        <label class="jenis-pill">
                            <input type="radio" name="jenisTransaksi" value="keluar">
                            <span class="material-symbols-outlined" aria-hidden="true">trending_down</span>
                            <span>Pengeluaran</span>
                        </label>

                    </div>
                </div>

                <div class="form-grid">

                    <label class="field">
                        <span class="field__label">
                            Kategori <b class="wajib">*</b>
                        </span>
                        <!--
                            Form menampilkan SELURUH kategori (7),
                            dipisah per jenis ("Pemasukan" &
                            "Pengeluaran"). JavaScript menyesuaikan
                            jenis transaksi otomatis saat kategori
                            dipilih. Opsi diisi di server agar tidak
                            pernah kosong walau JS belum sempat jalan.
                        -->
                        <select id="inputKategori" required>
                            <optgroup label="Pemasukan">
                                <option value="Iuran">Iuran</option>
                                <option value="kas">Kas</option>
                                <option value="pemasukan lainnya">Pemasukan Lainnya</option>
                            </optgroup>
                            <optgroup label="Pengeluaran">
                                <option value="kebutuhan kelas">Kebutuhan Kelas</option>
                                <option value="perlengkapan kelas">Perlengkapan Kelas</option>
                                <option value="kegiatan kelas">Kegiatan Kelas</option>
                                <option value="pengeluaran lainnya">Pengeluaran Lainnya</option>
                            </optgroup>
                        </select>
                    </label>

                    <label class="field">
                        <span class="field__label">Kelas</span>
                        <select id="inputKelas">
                            <option value="">- Pilih kelas (opsional) -</option>
                        </select>
                    </label>

                </div>

                <!--
                    Pilihan iuran hanya menampilkan iuran berstatus Aktif.
                    Saat iuran dipilih, nominal & keterangan ikut terisi
                    dan pembayaran tersimpan dengan relasi id_iuran serta
                    id_siswa yang benar.
                -->
                <div class="form-grid" id="grupPembayaranIuran">

                    <label class="field">
                        <span class="field__label">Iuran (opsional)</span>
                        <select id="inputIuran">
                            <option value="">- Tanpa iuran -</option>
                        </select>
                    </label>

                    <label class="field">
                        <span class="field__label">Siswa</span>
                        <select id="inputSiswa">
                            <option value="">- Pilih siswa -</option>
                        </select>
                    </label>

                </div>

                <p class="uang-box__hint" id="infoIuran" hidden></p>

                <label class="field">
                    <span class="field__label">
                        Keterangan <b class="wajib">*</b>
                    </span>
                    <input
                        type="text"
                        id="inputKeterangan"
                        placeholder="Contoh: Setoran kas mingguan kelas XI RPL"
                        required
                        autocomplete="off"
                    >
                </label>

                <div class="form-grid">
                    <label class="field">
                        <span class="field__label">
                            Tanggal <b class="wajib">*</b>
                        </span>
                        <input type="date" id="inputTanggal" required>
                    </label>
                </div>

                <!-- RINCIAN UANG -->
                <div class="uang-box" id="uangBox">

                    <div class="uang-box__head">
                        <p class="uang-box__title">
                            <span class="material-symbols-outlined" aria-hidden="true">
                                calculate
                            </span>
                            Rincian Uang
                        </p>

                        <p class="uang-box__note">
                            Isi <b>jumlah yang harus dibayar</b> dan
                            <b>uang yang diterima Bendahara</b> -
                            kembalian serta jumlah uang yang masuk ke kas dihitung otomatis.
                        </p>
                    </div>

                    <div class="uang-grid">

                        <label class="field field--uang">
                            <span class="field__label">
                                Jumlah yang harus dibayar <b class="wajib">*</b>
                            </span>

                            <span class="input-uang">
                                <span class="input-uang__pre" aria-hidden="true">Rp</span>
                                <input
                                    type="text"
                                    id="inputTagihan"
                                    inputmode="numeric"
                                    placeholder="0"
                                    autocomplete="off"
                                >
                            </span>
                        </label>

                        <label class="field field--uang">
                            <span class="field__label" id="labelDiterima">
                                Jumlah uang yang diterima Bendahara <b class="wajib">*</b>
                            </span>

                            <span class="input-uang">
                                <span class="input-uang__pre" aria-hidden="true">Rp</span>
                                <input
                                    type="text"
                                    id="inputDiterima"
                                    inputmode="numeric"
                                    placeholder="0"
                                    autocomplete="off"
                                >
                            </span>
                        </label>

                        <div class="field field--uang field--otomatis">
                            <span class="field__label">Jumlah kembalian</span>

                            <span class="input-uang input-uang--hasil">
                                <span class="input-uang__pre" aria-hidden="true">Rp</span>
                                <output id="hasilKembalian" aria-live="polite">0</output>
                            </span>
                        </div>

                        <div class="field field--uang field--otomatis">
                            <span class="field__label" id="labelMasukKas">
                                Jumlah uang yang masuk ke kas
                            </span>

                            <span class="input-uang input-uang--hasil input-uang--utama">
                                <span class="input-uang__pre" aria-hidden="true">Rp</span>
                                <output id="hasilMasukKas" aria-live="polite">0</output>
                            </span>
                        </div>

                    </div>

                    <p class="uang-box__hint" id="uangHint">
                        Contoh: tagihan Rp 10.000 dan diterima Rp 20.000 →
                        kembalian Rp 10.000, uang yang masuk ke kas Rp 10.000.
                    </p>

                </div>

                <p class="form-error" id="formError" hidden></p>

                <div class="modal__foot">
                    <button type="button" class="btn btn--ghost" data-tutup-modal="modalForm">
                        Batal
                    </button>

                    <button type="submit" class="btn btn--primary" id="btnSimpanTransaksi">
                        <span class="material-symbols-outlined" aria-hidden="true">check</span>
                        <span id="btnSimpanText">Simpan Transaksi</span>
                    </button>

                    <button type="button" class="btn btn--primary" id="btnSimpanDanTambah" hidden>
                        <span class="material-symbols-outlined" aria-hidden="true">add</span>
                        <span>Simpan &amp; Tambah Lagi</span>
                    </button>
                </div>

            </form>
        </div>
    </div>

    <!-- MODAL CATAT BANYAK TRANSAKSI -->
    <div class="modal-backdrop" id="modalFormBanyak" aria-hidden="true">
        <div class="modal modal--lebar" role="dialog" aria-modal="true" aria-labelledby="modalBanyakTitle">

            <div class="modal__head">
                <div>
                    <p class="modal__eyebrow" id="modalBanyakEyebrow">BANYAK TRANSAKSI</p>
                    <h3 class="modal__title" id="modalBanyakTitle">Catat Beberapa Transaksi</h3>
                </div>

                <button
                    type="button"
                    class="modal__close"
                    data-tutup-modal="modalFormBanyak"
                    aria-label="Tutup"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
            </div>

            <form class="modal__body" id="formTransaksiBanyak" novalidate>

                <div class="field">
                    <div class="banyak-head">
                        <span class="field__label">
                            Daftar Transaksi <b class="wajib">*</b>
                        </span>

                        <button type="button" class="btn btn--ghost btn--sm" id="btnTambahBaris">
                            <span class="material-symbols-outlined" aria-hidden="true">add</span>
                            <span>Tambah Baris</span>
                        </button>
                    </div>

                    <div class="banyak-body" id="isiBarisTransaksi"></div>
                </div>

                <p class="form-error" id="formBanyakError" hidden></p>

                <div class="modal__foot">
                    <button type="button" class="btn btn--ghost" data-tutup-modal="modalFormBanyak">
                        Batal
                    </button>

                    <button type="submit" class="btn btn--primary" id="btnSimpanBanyak">
                        <span class="material-symbols-outlined" aria-hidden="true">save</span>
                        <span>Simpan Semua Transaksi</span>
                    </button>
                </div>

            </form>
        </div>
    </div>

    <!-- MODAL DETAIL TRANSAKSI -->
    <div class="modal-backdrop" id="modalDetail" aria-hidden="true">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalDetailTitle">

            <div class="modal__head">
                <div>
                    <p class="modal__eyebrow">DETAIL TRANSAKSI</p>
                    <h3 class="modal__title" id="modalDetailTitle">TRX-0000</h3>
                </div>

                <button
                    type="button"
                    class="modal__close"
                    data-tutup-modal="modalDetail"
                    aria-label="Tutup"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
            </div>

            <div class="modal__body">

                <div class="detail-grid">

                    <div class="detail-item">
                        <span class="detail-item__label">Jenis</span>
                        <span class="detail-item__value" id="detailJenis">-</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Kategori</span>
                        <span class="detail-item__value" id="detailKategori">-</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Kelas</span>
                        <span class="detail-item__value" id="detailKelas">-</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Tanggal</span>
                        <span class="detail-item__value" id="detailTanggal">-</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Waktu</span>
                        <span class="detail-item__value" id="detailWaktu">-</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Metode</span>
                        <span class="detail-item__value">Tunai</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Dicatat oleh</span>
                        <span class="detail-item__value" id="detailPetugas">-</span>
                    </div>

                </div>

                <div class="detail-keterangan">
                    <span>Keterangan</span>
                    <p id="detailKeterangan">-</p>
                </div>

                <!-- RINCIAN UANG DETAIL -->
                <div class="uang-rincian" id="uangRincian">

                    <p class="uang-rincian__title">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            payments
                        </span>
                        Rincian Uang
                    </p>

                    <div class="uang-rincian__baris">
                        <span>Jumlah yang harus dibayar</span>
                        <b id="rincianTagihan">-</b>
                    </div>

                    <div class="uang-rincian__baris">
                        <span id="rincianLabelDiterima">
                            Jumlah uang yang diterima Bendahara
                        </span>
                        <b id="rincianDiterima">-</b>
                    </div>

                    <div class="uang-rincian__baris">
                        <span>Jumlah kembalian</span>
                        <b id="rincianKembalian">-</b>
                    </div>

                    <div class="uang-rincian__baris uang-rincian__baris--utama">
                        <span id="rincianLabelMasukKas">
                            Jumlah uang yang masuk ke kas
                        </span>
                        <b id="rincianMasukKas">-</b>
                    </div>

                </div>

                <div class="modal__foot">
                    <button type="button" class="btn btn--ghost" data-tutup-modal="modalDetail">
                        Tutup
                    </button>
                </div>

            </div>
        </div>
    </div>

    <!-- MODAL KONFIRMASI HAPUS -->
    <div class="modal-backdrop" id="modalHapus" aria-hidden="true">
        <div class="modal modal--kecil" role="alertdialog" aria-modal="true" aria-labelledby="modalHapusTitle">

            <div class="modal__body modal__body--hapus">

                <span class="hapus-icon" aria-hidden="true">
                    <span class="material-symbols-outlined">delete</span>
                </span>

                <h3 class="modal__title" id="modalHapusTitle">
                    Hapus Transaksi?
                </h3>

                <p class="hapus-text" id="hapusText">
                    Transaksi akan dihapus dari daftar.
                    Tindakan ini tidak dapat dibatalkan.
                </p>

                <div class="modal__foot modal__foot--tengah">
                    <button type="button" class="btn btn--ghost" data-tutup-modal="modalHapus">
                        Batal
                    </button>

                    <button type="button" class="btn btn--danger" id="btnKonfirmasiHapus">
                        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
                        <span>Ya, Hapus</span>
                    </button>
                </div>

            </div>
        </div>
    </div>

    <!-- TOAST -->
    <div class="toast" id="toast" role="status" aria-live="polite">
        <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
        <span id="toastText">Tersimpan</span>
    </div>

    @include('partials.konfirmasi-logout')
</body>
</html>
