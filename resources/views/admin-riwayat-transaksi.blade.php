<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Riwayat Transaksi — BBCashvia</title>

    <meta name="description"
        content="Halaman Riwayat Transaksi BBCashvia — telusuri seluruh riwayat pemasukan dan pengeluaran kas kelas dengan pencarian, filter, dan detail transaksi lengkap.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet">

    @vite([
        'resources/css/admin-riwayat-transaksi.css',
        'resources/js/admin-riwayat-transaksi.js'
    ])
</head>

<body>

    <div class="sidebar-backdrop" id="sidebarBackdrop" aria-hidden="true"></div>

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

                <a href="/admin/riwayat-transaksi" class="side-link is-active" aria-current="page">
                    <span class="material-symbols-outlined" aria-hidden="true">manage_search</span>
                    <span class="side-link__text">Riwayat Transaksi</span>
                </a>
            </div>

            <div class="sidebar__section">
                <div class="sidebar__section-title">Manajemen</div>

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


    <div class="shell">

        <header class="topbar">

            <div class="topbar__left">

                <button type="button" class="topbar__burger" id="sidebarToggle" aria-label="Buka menu navigasi">
                    <span class="material-symbols-outlined" aria-hidden="true">menu</span>
                </button>

                <div class="topbar__title">
                    <h1>Riwayat Transaksi</h1>
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

                        <span class="material-symbols-outlined topbar__chevron" aria-hidden="true">
                            expand_more
                        </span>

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


        <main class="content">

            <section class="page-head">

                <div class="page-head__text">

                    <p class="page-head__eyebrow">Panel Admin • Kas Kelas</p>

                    <h2 class="page-head__title">Riwayat Transaksi</h2>

                    <p class="page-head__sub">
                        Telusuri seluruh riwayat pemasukan dan pengeluaran kas kelas — gunakan pencarian
                        dan filter untuk menemukan transaksi, lalu buka detailnya untuk rincian lengkap.
                    </p>

                </div>

            </section>


            <section class="sum-grid" aria-label="Ringkasan riwayat transaksi">

                <article class="sum-card sum-card--masuk">

                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            trending_up
                        </span>
                    </div>

                    <div>
                        <p class="sum-card__label">Total Pemasukan</p>
                        <p class="sum-card__value" id="sumMasuk">—</p>
                        <p class="sum-card__note" id="sumMasukNote">sesuai filter</p>
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
                        <p class="sum-card__value" id="sumKeluar">—</p>
                        <p class="sum-card__note" id="sumKeluarNote">sesuai filter</p>
                    </div>

                </article>


                <article class="sum-card sum-card--jumlah">

                    <div class="sum-card__iconwrap">
                        <span class="material-symbols-outlined" aria-hidden="true">
                            history
                        </span>
                    </div>

                    <div>
                        <p class="sum-card__label">Total Transaksi</p>
                        <p class="sum-card__value" id="sumJumlah">—</p>
                        <p class="sum-card__note" id="sumJumlahNote">sesuai filter</p>
                    </div>

                </article>

            </section>


            <section class="panel filterbar" aria-label="Filter riwayat transaksi">

                <div class="filterbar__search">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        search
                    </span>

                    <input type="search"
                        id="cariRiwayat"
                        placeholder="Cari ID, keterangan, kategori, atau kelas…"
                        autocomplete="off">

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
                            <option value="2026-10">Oktober 2026</option>
                            <option value="2026-09">September 2026</option>
                            <option value="2026-08">Agustus 2026</option>
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


            <section class="panel">

                <div class="panel__head">

                    <div>

                        <p class="panel__eyebrow">ARSIP KAS</p>

                        <h3 class="panel__title">Riwayat Lengkap</h3>

                        <p class="panel__sub" id="tabelInfo">
                            — transaksi ditampilkan
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
                                <th scope="col" class="th-r">Nominal</th>
                                <th scope="col">Petugas</th>
                                <th scope="col" class="th-c">Aksi</th>
                            </tr>

                        </thead>

                        <tbody id="isiTabelRiwayat"></tbody>

                    </table>


                    <div class="empty-state" id="emptyState" hidden>

                        <span class="material-symbols-outlined" aria-hidden="true">
                            search_off
                        </span>

                        <p>
                            Tidak ada riwayat transaksi yang cocok dengan pencarian atau filter.
                        </p>

                        <button type="button"
                            class="btn btn--ghost btn--sm"
                            id="btnKosongkanFilter">
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


    <div class="modal-backdrop" id="modalDetail" aria-hidden="true">

        <div class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalDetailTitle">

            <div class="modal__head">

                <div>

                    <p class="modal__eyebrow">DETAIL TRANSAKSI</p>

                    <h3 class="modal__title" id="modalDetailTitle">
                        TRX-0000
                    </h3>

                </div>

                <button type="button"
                    class="modal__close"
                    data-tutup-modal="modalDetail"
                    aria-label="Tutup">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        close
                    </span>

                </button>

            </div>


            <div class="modal__body">

                <div class="detail-grid">

                    <div class="detail-item">
                        <span class="detail-item__label">Jenis</span>
                        <span class="detail-item__value" id="detailJenis">—</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Kategori</span>
                        <span class="detail-item__value" id="detailKategori">—</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Kelas</span>
                        <span class="detail-item__value" id="detailKelas">—</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Tanggal</span>
                        <span class="detail-item__value" id="detailTanggal">—</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Waktu</span>
                        <span class="detail-item__value" id="detailWaktu">—</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Metode</span>
                        <span class="detail-item__value">Tunai</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-item__label">Dicatat oleh</span>
                        <span class="detail-item__value" id="detailPetugas">—</span>
                    </div>

                </div>


                <div class="detail-keterangan">

                    <span>Keterangan</span>

                    <p id="detailKeterangan">—</p>

                </div>


                <div class="uang-rincian" id="uangRincian">

                    <p class="uang-rincian__title">

                        <span class="material-symbols-outlined" aria-hidden="true">
                            payments
                        </span>

                        Rincian Uang

                    </p>


                    <div class="uang-rincian__baris">
                        <span>Jumlah yang harus dibayar</span>
                        <b id="rincianTagihan">—</b>
                    </div>


                    <div class="uang-rincian__baris">

                        <span id="rincianLabelDiterima">
                            Jumlah uang yang diterima Bendahara
                        </span>

                        <b id="rincianDiterima">—</b>

                    </div>


                    <div class="uang-rincian__baris">

                        <span>Jumlah kembalian</span>

                        <b id="rincianKembalian">—</b>

                    </div>


                    <div class="uang-rincian__baris uang-rincian__baris--utama">

                        <span id="rincianLabelMasukKas">
                            Jumlah uang yang masuk ke kas
                        </span>

                        <b id="rincianMasukKas">—</b>

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

</body>

</html>
