<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Iuran — BBCashvia</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">

    <link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" rel="stylesheet">

    @vite([
        'resources/css/admin-iuran.css',
        'resources/js/admin-iuran.js'
    ])
</head>

<body>

<div class="sidebar-backdrop" id="sidebarBackdrop" aria-hidden="true"></div>

<aside class="sidebar" id="sidebar" aria-label="Navigasi utama">

    <div class="sidebar__brand">
        <div class="sidebar__logo">
            <span class="material-symbols-outlined">account_balance_wallet</span>
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
                <span class="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
            </a>
        </div>

        <div class="sidebar__section">
            <div class="sidebar__section-title">Keuangan</div>

            <a href="/admin/transaksi" class="side-link">
                <span class="material-symbols-outlined">receipt_long</span>
                <span>Transaksi</span>
            </a>

            <a href="/admin/iuran" class="side-link is-active">
                <span class="material-symbols-outlined">sell</span>
                <span>Iuran</span>
            </a>
        </div>

        <div class="sidebar__section">
            <div class="sidebar__section-title">Data</div>

            <a href="/admin/siswa" class="side-link">
                <span class="material-symbols-outlined">school</span>
                <span>Data Siswa</span>
            </a>
        </div>

        <div class="sidebar__section">
            <div class="sidebar__section-title">Laporan</div>

            <a href="/admin/laporan-kas" class="side-link">
                <span class="material-symbols-outlined">monitoring</span>
                <span>Laporan Kas</span>
            </a>

            <a href="/admin/riwayat-transaksi" class="side-link">
                <span class="material-symbols-outlined">manage_search</span>
                <span>Riwayat Transaksi</span>
            </a>
        </div>

        <div class="sidebar__section">
            <div class="sidebar__section-title">Manajemen</div>

            <a href="/admin/manajemen-pengguna" class="side-link">
                <span class="material-symbols-outlined">admin_panel_settings</span>
                <span>Manajemen Pengguna</span>
            </a>
        </div>

    </nav>

    <div class="sidebar__foot">

        <div class="sidebar__user">
            <div class="sidebar__avatar">AN</div>

            <div class="sidebar__userinfo">
                <span class="sidebar__username">Azis N.</span>
                <span class="sidebar__userrole">Admin</span>
            </div>
        </div>

        <a href="/" class="sidebar__logout">
            <span class="material-symbols-outlined">logout</span>
            <span>Keluar</span>
        </a>

    </div>

</aside>


<div class="shell">

    <header class="topbar">

        <div class="topbar__left">

            <button
                type="button"
                class="topbar__burger"
                id="sidebarToggle"
                aria-label="Buka navigasi"
            >
                <span class="material-symbols-outlined">menu</span>
            </button>

            <div class="topbar__title">
                <h1>Iuran</h1>
                <p id="topbarDate">—</p>
            </div>

        </div>

        <div class="topbar__right">

            <span class="topbar__chip">
                TA 2026/2027 • Ganjil
            </span>

            <div class="topbar__profilewrap">

                <button
                    type="button"
                    class="topbar__profile"
                    id="profileBtn"
                    aria-expanded="false"
                >
                    <span class="topbar__avatar">AN</span>

                    <span class="topbar__profileinfo">
                        <strong>Azis N.</strong>
                        <small>Admin</small>
                    </span>

                    <span class="material-symbols-outlined topbar__chevron">
                        expand_more
                    </span>
                </button>

                <div class="dropdown" id="profileMenu">
                    <a href="/">
                        <span class="material-symbols-outlined">logout</span>
                        Keluar
                    </a>
                </div>

            </div>

        </div>

    </header>


    <main class="content">

        <section class="page-head">

            <div>
                <div class="page-head__eyebrow">
                    Panel Admin • Kas Kelas
                </div>

                <h2>Iuran</h2>

                <p>
                    Kelola daftar iuran kelas, tentukan frekuensi dan nominal,
                    lalu pantau pembayaran siswa.
                </p>
            </div>

            <button
                type="button"
                class="btn btn--primary"
                id="btnTambahIuran"
            >
                <span class="material-symbols-outlined">add</span>
                Tambah Iuran
            </button>

        </section>


        <!-- SUMMARY -->

        <section class="sum-grid">

            <article class="sum-card">
                <div class="sum-card__icon">
                    <span class="material-symbols-outlined">sell</span>
                </div>

                <div>
                    <span class="sum-card__label">Total Iuran</span>
                    <strong id="sumTotalIuran">0</strong>
                    <small id="sumTotalIuranNote">Iuran terdaftar</small>
                </div>
            </article>


            <article class="sum-card sum-card--masuk">
                <div class="sum-card__icon">
                    <span class="material-symbols-outlined">payments</span>
                </div>

                <div>
                    <span class="sum-card__label">Total Tagihan</span>
                    <strong id="sumTagihan">Rp0</strong>
                    <small id="sumTagihanNote">Total nominal iuran</small>
                </div>
            </article>


            <article class="sum-card sum-card--saldo">
                <div class="sum-card__icon">
                    <span class="material-symbols-outlined">task_alt</span>
                </div>

                <div>
                    <span class="sum-card__label">Sudah Terkumpul</span>
                    <strong id="sumTerkumpul">Rp0</strong>
                    <small id="sumTerkumpulNote">Dari pembayaran siswa</small>
                </div>
            </article>

        </section>


        <!-- LIST IURAN -->

        <section class="panel">

            <div class="panel__head">

                <div>
                    <div class="panel__eyebrow">
                        DAFTAR IURAN
                    </div>

                    <h3>Iuran Kelas</h3>

                    <p>
                        Semua iuran yang sedang dan pernah dikelola.
                    </p>
                </div>

            </div>


            <div class="filterbar">

                <div class="searchbox">

                    <span class="material-symbols-outlined">
                        search
                    </span>

                    <input
                        type="search"
                        id="cariIuran"
                        placeholder="Cari nama iuran..."
                    >

                </div>


                <select id="filterFrekuensi">
                    <option value="">Semua Frekuensi</option>
                    <option value="harian">Harian</option>
                    <option value="mingguan">Mingguan</option>
                    <option value="bulanan">Bulanan</option>
                    <option value="tahunan">Tahunan</option>
                    <option value="insidental">Insidental</option>
                </select>


                <select id="filterStatusIuran">
                    <option value="">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="selesai">Selesai</option>
                </select>


                <button
                    type="button"
                    class="btn btn--ghost"
                    id="btnResetFilter"
                >
                    <span class="material-symbols-outlined">restart_alt</span>
                    Reset
                </button>

            </div>


            <div class="table-wrap">

                <table class="table">

                    <thead>
                        <tr>
                            <th>Nama Iuran</th>
                            <th>Frekuensi</th>
                            <th>Jatuh Tempo</th>
                            <th>Nominal</th>
                            <th>Terkumpul</th>
                            <th>Progres</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>

                    <tbody id="isiTabelIuran"></tbody>

                </table>

            </div>


            <div class="empty-state" id="emptyState" hidden>

                <div class="empty-state__icon">
                    <span class="material-symbols-outlined">
                        receipt_long
                    </span>
                </div>

                <h4>Iuran tidak ditemukan</h4>

                <p>
                    Belum ada iuran yang sesuai dengan pencarian atau filter.
                </p>

            </div>


            <div class="content__foot">
                <span id="jumlahIuranFoot">0 iuran</span>
                <span>BBCashvia • Kas Kelas Digital</span>
            </div>

        </section>

    </main>

</div>


<!-- =========================================================
     MODAL TAMBAH / EDIT IURAN
     ========================================================= -->

<div class="modal" id="modalIuran" hidden>

    <div class="modal__backdrop" data-close-modal></div>

    <div
        class="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalIuranTitle"
    >

        <div class="modal__head">

            <div>
                <div class="modal__eyebrow">
                    DATA IURAN
                </div>

                <h3 id="modalIuranTitle">
                    Tambah Iuran
                </h3>

                <p id="modalIuranSub">
                    Masukkan informasi iuran kelas.
                </p>
            </div>

            <button
                type="button"
                class="modal__close"
                data-close-modal
            >
                <span class="material-symbols-outlined">close</span>
            </button>

        </div>


        <form id="formIuran">

            <div class="modal__body">

                <div class="form-grid">

                    <div class="field field--full">

                        <label for="inputNamaIuran">
                            Nama Iuran
                        </label>

                        <input
                            type="text"
                            id="inputNamaIuran"
                            placeholder="Contoh: Kas Kelas"
                            required
                        >

                    </div>


                    <div class="field">

                        <label for="inputFrekuensi">
                            Frekuensi
                        </label>

                        <select id="inputFrekuensi" required>
                            <option value="">Pilih frekuensi</option>
                            <option value="harian">Harian</option>
                            <option value="mingguan">Mingguan</option>
                            <option value="bulanan">Bulanan</option>
                            <option value="tahunan">Tahunan</option>
                            <option value="insidental">Insidental</option>
                        </select>

                    </div>


                    <div class="field">

                        <label for="inputJatuhTempo">
                            Jatuh Tempo
                        </label>

                        <input
                            type="date"
                            id="inputJatuhTempo"
                            required
                        >

                    </div>


                    <div class="field">

                        <label for="inputNominalIuran">
                            Nominal
                        </label>

                        <div class="input-money">

                            <span>Rp</span>

                            <input
                                type="number"
                                id="inputNominalIuran"
                                min="0"
                                step="500"
                                placeholder="0"
                                required
                            >

                        </div>

                    </div>


                    <div class="field">

                        <label for="inputStatusIuran">
                            Status
                        </label>

                        <select id="inputStatusIuran" required>
                            <option value="aktif">Aktif</option>
                            <option value="selesai">Selesai</option>
                        </select>

                    </div>


                    <div class="field field--full">

                        <label for="inputKeteranganIuran">
                            Keterangan
                        </label>

                        <textarea
                            id="inputKeteranganIuran"
                            rows="4"
                            placeholder="Keterangan tambahan tentang iuran..."
                        ></textarea>

                    </div>


                    <div
                        class="form-error field--full"
                        id="formErrorIuran"
                        hidden
                    ></div>

                </div>

            </div>


            <div class="modal__foot">

                <button
                    type="button"
                    class="btn btn--ghost"
                    data-close-modal
                >
                    Batal
                </button>

                <button
                    type="submit"
                    class="btn btn--primary"
                >
                    <span class="material-symbols-outlined">save</span>
                    Simpan Iuran
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =========================================================
     MODAL DETAIL
     ========================================================= -->

<div class="modal" id="modalDetailIuran" hidden>

    <div class="modal__backdrop" data-close-modal></div>

    <div
        class="modal__dialog modal__dialog--large"
        role="dialog"
        aria-modal="true"
    >

        <div class="modal__head">

            <div>
                <div class="modal__eyebrow">
                    DETAIL IURAN
                </div>

                <h3 id="detailIuranTitle">
                    —
                </h3>

                <p id="detailIuranSub">
                    —
                </p>
            </div>

            <button
                type="button"
                class="modal__close"
                data-close-modal
            >
                <span class="material-symbols-outlined">close</span>
            </button>

        </div>


        <div class="modal__body">

            <div class="detail-summary">

                <div class="detail-stat">
                    <span>Frekuensi</span>
                    <strong id="detailFrekuensi">—</strong>
                </div>

                <div class="detail-stat">
                    <span>Jatuh Tempo</span>
                    <strong id="detailJatuhTempo">—</strong>
                </div>

                <div class="detail-stat">
                    <span>Nominal</span>
                    <strong id="detailNominal">—</strong>
                </div>

                <div class="detail-stat">
                    <span>Terkumpul</span>
                    <strong id="detailTerkumpul">—</strong>
                </div>

            </div>


            <div class="detail-toolbar">

                <div class="searchbox">

                    <span class="material-symbols-outlined">
                        search
                    </span>

                    <input
                        type="search"
                        id="cariDetailSiswa"
                        placeholder="Cari siswa..."
                    >

                </div>


                <select id="filterDetailStatus">
                    <option value="">Semua Status</option>
                    <option value="lunas">Lunas</option>
                    <option value="belum">Belum Bayar</option>
                </select>

            </div>


            <div class="table-wrap">

                <table class="table">

                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Siswa</th>
                            <th>NISN</th>
                            <th>Kelas</th>
                            <th>Nominal</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>

                    <tbody id="isiTabelDetail"></tbody>

                </table>

            </div>


            <div class="empty-state" id="emptyDetail" hidden>

                <div class="empty-state__icon">
                    <span class="material-symbols-outlined">
                        person_search
                    </span>
                </div>

                <h4>Siswa tidak ditemukan</h4>

                <p>
                    Tidak ada siswa yang sesuai dengan pencarian.
                </p>

            </div>

        </div>

    </div>

</div>


<!-- =========================================================
     MODAL PEMBAYARAN
     ========================================================= -->

<div class="modal" id="modalPembayaran" hidden>

    <div class="modal__backdrop" data-close-modal></div>

    <div class="modal__dialog">

        <div class="modal__head">

            <div>
                <div class="modal__eyebrow">
                    CATAT PEMBAYARAN
                </div>

                <h3>Pembayaran Iuran</h3>

                <p id="pembayaranIuranSub">
                    —
                </p>
            </div>

            <button
                type="button"
                class="modal__close"
                data-close-modal
            >
                <span class="material-symbols-outlined">close</span>
            </button>

        </div>


        <form id="formPembayaran">

            <div class="modal__body">

                <div class="field">

                    <label>Siswa</label>

                    <input
                        type="text"
                        id="inputPembayaranSiswa"
                        readonly
                    >

                </div>


                <div class="uang-box">

                    <div class="uang-box__title">
                        Rincian Pembayaran
                    </div>


                    <div class="uang-grid">

                        <div class="uang-item">

                            <span class="uang-item__label">
                                Sisa Tagihan
                            </span>

                            <strong
                                class="uang-item__value"
                                id="pembayaranTagihan"
                            >
                                Rp0
                            </strong>

                        </div>


                        <div class="uang-item">

                            <span class="uang-item__label">
                                Uang Diterima
                            </span>

                            <div class="input-money input-money--small">

                                <span>Rp</span>

                                <input
                                    type="number"
                                    id="inputPembayaranDiterima"
                                    min="0"
                                    step="500"
                                    placeholder="0"
                                    required
                                >

                            </div>

                        </div>


                        <div class="uang-item uang-item--warning">

                            <span class="uang-item__label">
                                Kembalian
                            </span>

                            <strong
                                class="uang-item__value"
                                id="hasilKembalian"
                            >
                                Rp0
                            </strong>

                        </div>

                    </div>


                    <div class="uang-masuk">

                        <span>
                            Uang masuk ke kas
                        </span>

                        <strong id="hasilMasukKas">
                            Rp0
                        </strong>

                    </div>


                    <p class="uang-hint" id="uangHint">
                        Masukkan jumlah uang yang diterima dari siswa.
                    </p>

                </div>


                <div
                    class="form-error"
                    id="formErrorPembayaran"
                    hidden
                ></div>

            </div>


            <div class="modal__foot">

                <button
                    type="button"
                    class="btn btn--ghost"
                    data-close-modal
                >
                    Batal
                </button>

                <button
                    type="submit"
                    class="btn btn--primary"
                    id="btnSimpanPembayaran"
                >
                    <span class="material-symbols-outlined">
                        payments
                    </span>
                    Simpan Pembayaran
                </button>

            </div>

        </form>

    </div>

</div>


<!-- =========================================================
     MODAL HAPUS
     ========================================================= -->

<div class="modal" id="modalHapusIuran" hidden>

    <div class="modal__backdrop" data-close-modal></div>

    <div class="modal__dialog modal__dialog--small">

        <div class="modal__head">

            <div>
                <div class="modal__eyebrow">
                    KONFIRMASI
                </div>

                <h3>Hapus Iuran?</h3>

                <p>
                    Data iuran yang dihapus tidak dapat ditampilkan kembali.
                </p>
            </div>

            <button
                type="button"
                class="modal__close"
                data-close-modal
            >
                <span class="material-symbols-outlined">close</span>
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
                    —
                </h4>

                <p>
                    Apakah kamu yakin ingin menghapus iuran ini?
                </p>

            </div>

        </div>


        <div class="modal__foot">

            <button
                type="button"
                class="btn btn--ghost"
                data-close-modal
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
                Hapus
            </button>

        </div>

    </div>

</div>


<!-- TOAST -->

<div class="toast" id="toast">

    <span class="material-symbols-outlined" id="toastIcon">
        check_circle
    </span>

    <div>
        <strong id="toastTitle">Berhasil</strong>
        <span id="toastMessage">Data berhasil disimpan.</span>
    </div>

</div>

</body>
</html>
