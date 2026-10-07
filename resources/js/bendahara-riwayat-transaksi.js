/* ============================================================
   BBCASHVIA — RIWAYAT TRANSAKSI BENDAHARA
   Kelas XI RPL 1
   Data dummy + interaksi UI
   Tanpa fitur verifikasi
   ============================================================ */

(function () {
    "use strict";


    /* ============================================================
       DATA KATEGORI
    ============================================================ */

    const KATEGORI_MASUK = [
        "Iuran",
        "Kas",
        "Pemasukan lainnya"
    ];

    const KATEGORI_KELUAR = [
        "Kebutuhan kelas",
        "Perlengkapan kelas",
        "Kegiatan kelas",
        "Pengeluaran lainnya"
    ];


    /* ============================================================
       DATA DUMMY
       KHUSUS KELAS XI RPL 1
    ============================================================ */

    const DATA_TRANSAKSI = [

        {
            id: "TRX-0102",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Setoran kas awal tahun ajaran",
            kelas: "XI RPL 1",
            tanggal: "2026-08-11",
            waktu: "08:40",
            metode: "Tunai",
            tagihan: 350000,
            diterima: 400000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0105",
            jenis: "masuk",
            kategori: "Kas",
            keterangan: "Sisa dana orientasi kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-08-20",
            waktu: "14:35",
            metode: "Transfer",
            tagihan: 175000,
            diterima: 175000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0108",
            jenis: "keluar",
            kategori: "Kebutuhan kelas",
            keterangan: "Belanja alat kebersihan awal tahun",
            kelas: "XI RPL 1",
            tanggal: "2026-08-27",
            waktu: "15:40",
            metode: "Tunai",
            tagihan: 90000,
            diterima: 100000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0109",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Setoran kas mingguan",
            kelas: "XI RPL 1",
            tanggal: "2026-08-28",
            waktu: "08:20",
            metode: "Tunai",
            tagihan: 300000,
            diterima: 300000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0111",
            jenis: "keluar",
            kategori: "Perlengkapan kelas",
            keterangan: "Pembelian kipas untuk kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-09-16",
            waktu: "09:50",
            metode: "Transfer",
            tagihan: 145000,
            diterima: 145000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0113",
            jenis: "keluar",
            kategori: "Kebutuhan kelas",
            keterangan: "Biaya fotokopi modul latihan",
            kelas: "XI RPL 1",
            tanggal: "2026-09-19",
            waktu: "11:15",
            metode: "Tunai",
            tagihan: 75000,
            diterima: 80000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0115",
            jenis: "masuk",
            kategori: "Pemasukan lainnya",
            keterangan: "Sumbangan alumni untuk rak buku",
            kelas: "XI RPL 1",
            tanggal: "2026-09-24",
            waktu: "14:55",
            metode: "Transfer",
            tagihan: 400000,
            diterima: 400000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0118",
            jenis: "keluar",
            kategori: "Kebutuhan kelas",
            keterangan: "Belanja tisu, sabun, dan pembersih kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-09-27",
            waktu: "13:05",
            metode: "Tunai",
            tagihan: 65000,
            diterima: 65000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0120",
            jenis: "masuk",
            kategori: "Pemasukan lainnya",
            keterangan: "Refund dekorasi ruang kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-09-29",
            waktu: "14:20",
            metode: "Transfer",
            tagihan: 150000,
            diterima: 150000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0123",
            jenis: "keluar",
            kategori: "Kegiatan kelas",
            keterangan: "Pembelian tinta printer rapat",
            kelas: "XI RPL 1",
            tanggal: "2026-10-02",
            waktu: "15:12",
            metode: "Tunai",
            tagihan: 85000,
            diterima: 100000,
            petugas: "Siti Nurhaliza"
        },

        {
            id: "TRX-0124",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Setoran kas mingguan",
            kelas: "XI RPL 1",
            tanggal: "2026-10-03",
            waktu: "09:41",
            metode: "Tunai",
            tagihan: 320000,
            diterima: 320000,
            petugas: "Siti Nurhaliza"
        }

    ];


    /* ============================================================
       UTILITAS
    ============================================================ */

    const $ = (id) => document.getElementById(id);


    const formatRupiah = (angka) => {

        const n = Number(angka) || 0;

        return "Rp " + n.toLocaleString("id-ID");

    };


    const formatTanggal = (iso) => {

        const d = new Date(
            iso + "T00:00:00"
        );

        return d.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    const escapeHtml = (teks) => {

        return String(teks ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    };


    /* ============================================================
       PERHITUNGAN UANG
    ============================================================ */

    const hitungKembalian = (
        tagihan,
        diterima
    ) => {

        return Math.max(
            0,
            (Number(diterima) || 0) -
            (Number(tagihan) || 0)
        );

    };


    const hitungMasukKas = (
        tagihan,
        diterima
    ) => {

        return Math.min(
            Number(tagihan) || 0,
            Number(diterima) || 0
        );

    };


    /* ============================================================
       CHIP KATEGORI
    ============================================================ */

    const CHIP_KATEGORI = {

        "Iuran":
            "chip--iuran",

        "Kas":
            "chip--kas",

        "Pemasukan lainnya":
            "chip--masuk-lain",

        "Kebutuhan kelas":
            "chip--butuh",

        "Perlengkapan kelas":
            "chip--perlengkapan",

        "Kegiatan kelas":
            "chip--kegiatan",

        "Pengeluaran lainnya":
            "chip--keluar-lain"

    };


    /* ============================================================
       MODAL
    ============================================================ */

    const bukaModal = (id) => {

        const modal = $(id);

        if (!modal) return;

        modal.classList.add("is-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

    };


    const tutupModal = (id) => {

        const modal = $(id);

        if (!modal) return;

        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (
            !document.querySelector(
                ".modal-backdrop.is-open"
            )
        ) {
            document.body.classList.remove(
                "modal-open"
            );
        }

    };


    /* ============================================================
       FILTER KATEGORI
    ============================================================ */

    const isiPilihanKategori = () => {

        const pilihJenis =
            $("filterJenis").value;

        const pilihKategori =
            $("filterKategori");

        const nilaiLama =
            pilihKategori.value;


        const daftar =
            pilihJenis === "masuk"
                ? KATEGORI_MASUK
                : pilihJenis === "keluar"
                    ? KATEGORI_KELUAR
                    : [
                        ...KATEGORI_MASUK,
                        ...KATEGORI_KELUAR
                    ];


        pilihKategori.innerHTML =
            `<option value="semua">
                Semua Kategori
            </option>` +
            daftar
                .map(
                    (k) =>
                        `<option value="${escapeHtml(k)}">
                            ${escapeHtml(k)}
                        </option>`
                )
                .join("");


        if (
            [
                ...pilihKategori.options
            ].some(
                (o) =>
                    o.value === nilaiLama
            )
        ) {

            pilihKategori.value =
                nilaiLama;

        }

    };


    /* ============================================================
       TERAPKAN FILTER
    ============================================================ */

    const terapkanFilter = () => {

        const kata =
            $("cariRiwayat")
                .value
                .trim()
                .toLowerCase();


        const jenis =
            $("filterJenis").value;

        const kategori =
            $("filterKategori").value;

        const bulan =
            $("filterBulan").value;


        const hasil =
            DATA_TRANSAKSI.filter(
                (t) => {

                    if (
                        jenis !== "semua" &&
                        t.jenis !== jenis
                    ) {
                        return false;
                    }


                    if (
                        kategori !== "semua" &&
                        t.kategori !== kategori
                    ) {
                        return false;
                    }


                    if (
                        bulan !== "semua" &&
                        !t.tanggal.startsWith(
                            bulan
                        )
                    ) {
                        return false;
                    }


                    if (kata) {

                        const gabung =
                            `${t.id}
                            ${t.keterangan}
                            ${t.kategori}
                            ${t.kelas}
                            ${t.petugas}
                            ${t.metode}`
                                .toLowerCase();


                        if (
                            !gabung.includes(
                                kata
                            )
                        ) {
                            return false;
                        }

                    }


                    return true;

                }
            );


        hasil.sort(
            (a, b) =>
                a.tanggal < b.tanggal
                    ? 1
                    : a.tanggal > b.tanggal
                        ? -1
                        : 0
        );


        renderTabel(hasil);

        renderRingkasan(hasil);

    };


    /* ============================================================
       RESET FILTER
    ============================================================ */

    const resetFilter = () => {

        $("cariRiwayat").value = "";

        $("filterJenis").value =
            "semua";

        $("filterBulan").value =
            "semua";


        isiPilihanKategori();


        $("filterKategori").value =
            "semua";


        terapkanFilter();

    };


    /* ============================================================
       RENDER TABEL
    ============================================================ */

    const barisTabel = (t) => {

        const nominal =
            hitungMasukKas(
                t.tagihan,
                t.diterima
            );


        const tanda =
            t.jenis === "masuk"
                ? "+"
                : "−";


        const chip =
            CHIP_KATEGORI[t.kategori] ||
            "chip--keluar-lain";


        return `

            <tr>

                <td>

                    <span class="cell-id">
                        ${escapeHtml(t.id)}
                    </span>

                </td>


                <td class="cell-keterangan">

                    <div class="cell-keterangan__utama">
                        ${escapeHtml(t.keterangan)}
                    </div>

                    <span class="cell-keterangan__sub">
                        ${escapeHtml(t.kelas)}
                    </span>

                </td>


                <td>

                    <span class="chip ${chip}">
                        ${escapeHtml(t.kategori)}
                    </span>

                </td>


                <td class="cell-tanggal">

                    <div class="cell-tanggal__utama">
                        ${formatTanggal(t.tanggal)}
                    </div>

                    <div class="cell-tanggal__sub">
                        ${escapeHtml(t.waktu)} WIB
                    </div>

                </td>


                <td class="td-r">

                    <span
                        class="cell-nominal cell-nominal--${t.jenis}"
                    >
                        ${tanda}${formatRupiah(nominal)}
                    </span>

                </td>


                <td>

                    <span class="cell-petugas">
                        ${escapeHtml(t.petugas)}
                    </span>

                </td>


                <td class="td-c">

                    <span class="aksi-grup">

                        <button
                            type="button"
                            class="icon-btn"
                            data-aksi="detail"
                            data-id="${escapeHtml(t.id)}"
                            aria-label="Lihat detail ${escapeHtml(t.id)}"
                            title="Detail"
                        >

                            <span class="material-symbols-outlined">
                                visibility
                            </span>

                        </button>

                    </span>

                </td>

            </tr>

        `;

    };


    const renderTabel = (baris) => {

        const tbody =
            $("isiTabelRiwayat");

        const kosong =
            $("emptyState");


        tbody.innerHTML =
            baris
                .map(barisTabel)
                .join("");


        if (baris.length === 0) {

            kosong.hidden = false;

            tbody.innerHTML = "";

        } else {

            kosong.hidden = true;

        }


        $("tabelInfo").textContent =
            `${baris.length} transaksi ditampilkan`;

    };


    /* ============================================================
       RENDER RINGKASAN
    ============================================================ */

    const renderRingkasan = (baris) => {

        const masuk =
            baris
                .filter(
                    (t) =>
                        t.jenis === "masuk"
                )
                .reduce(
                    (total, t) =>
                        total +
                        hitungMasukKas(
                            t.tagihan,
                            t.diterima
                        ),
                    0
                );


        const keluar =
            baris
                .filter(
                    (t) =>
                        t.jenis === "keluar"
                )
                .reduce(
                    (total, t) =>
                        total +
                        hitungMasukKas(
                            t.tagihan,
                            t.diterima
                        ),
                    0
                );


        $("sumMasuk").textContent =
            formatRupiah(masuk);

        $("sumKeluar").textContent =
            formatRupiah(keluar);

        $("sumJumlah").textContent =
            baris.length;


        const jumlah =
            baris.length;


        const catatan =
            jumlah
                ? `dari ${jumlah} transaksi terfilter`
                : "tidak ada transaksi";


        $("sumMasukNote").textContent =
            catatan;

        $("sumKeluarNote").textContent =
            catatan;

        $("sumJumlahNote").textContent =
            catatan;

    };


    /* ============================================================
       DETAIL TRANSAKSI
    ============================================================ */

    const bukaDetail = (id) => {

        const t =
            DATA_TRANSAKSI.find(
                (x) => x.id === id
            );


        if (!t) return;


        $("modalDetailTitle").textContent =
            t.id;


        $("detailJenis").textContent =
            t.jenis === "masuk"
                ? "Pemasukan"
                : "Pengeluaran";


        $("detailKategori").textContent =
            t.kategori;


        $("detailKelas").textContent =
            t.kelas;


        $("detailTanggal").textContent =
            formatTanggal(
                t.tanggal
            );


        $("detailWaktu").textContent =
            `${t.waktu} WIB`;


        $("detailMetode").textContent =
            t.metode;


        $("detailPetugas").textContent =
            t.petugas;


        $("detailKeterangan").textContent =
            t.keterangan;


        const masukKas =
            hitungMasukKas(
                t.tagihan,
                t.diterima
            );


        const kembalian =
            hitungKembalian(
                t.tagihan,
                t.diterima
            );


        $("rincianTagihan").textContent =
            formatRupiah(
                t.tagihan
            );


        $("rincianDiterima").textContent =
            formatRupiah(
                t.diterima
            );


        $("rincianKembalian").textContent =
            formatRupiah(
                kembalian
            );


        $("rincianMasukKas").textContent =
            formatRupiah(
                masukKas
            );


        $("rincianLabelDiterima").textContent =
            t.jenis === "masuk"
                ? "Jumlah uang yang diterima Bendahara"
                : "Jumlah uang yang dibayarkan Bendahara";


        $("rincianLabelMasukKas").textContent =
            t.jenis === "masuk"
                ? "Jumlah uang yang masuk ke kas"
                : "Jumlah uang yang keluar dari kas";


        bukaModal(
            "modalDetail"
        );

    };


    /* ============================================================
       INTERAKSI UMUM
    ============================================================ */

    const pasangInteraksiUmum = () => {

        const sidebar =
            $("sidebar");

        const backdrop =
            $("sidebarBackdrop");

        const toggle =
            $("btnSidebar");

        const profileBtn =
            $("profileButton");

        const profileMenu =
            $("profileDropdown");


        /* SIDEBAR */

        const tutupSidebar = () => {

            document.body.classList.remove(
                "nav-open"
            );


            if (toggle) {

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        };


        if (toggle) {

            toggle.addEventListener(
                "click",
                (e) => {

                    e.stopPropagation();


                    const terbuka =
                        document.body.classList.toggle(
                            "nav-open"
                        );


                    toggle.setAttribute(
                        "aria-expanded",
                        terbuka
                            ? "true"
                            : "false"
                    );

                }
            );

        }


        if (backdrop) {

            backdrop.addEventListener(
                "click",
                tutupSidebar
            );

        }


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 1024
                ) {
                    tutupSidebar();
                }

            }
        );


        /* PROFILE */

        const tutupDropdown = () => {

            if (!profileMenu) return;


            profileMenu.classList.remove(
                "is-open"
            );


            if (profileBtn) {

                profileBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        };


        if (
            profileBtn &&
            profileMenu
        ) {

            profileBtn.addEventListener(
                "click",
                (e) => {

                    e.stopPropagation();


                    const terbuka =
                        profileMenu.classList.toggle(
                            "is-open"
                        );


                    profileBtn.setAttribute(
                        "aria-expanded",
                        terbuka
                            ? "true"
                            : "false"
                    );

                }
            );

        }


        /* GLOBAL CLICK */

        document.addEventListener(
            "click",
            (e) => {

                if (
                    profileMenu &&
                    profileBtn &&
                    !profileMenu.contains(
                        e.target
                    ) &&
                    !profileBtn.contains(
                        e.target
                    )
                ) {

                    tutupDropdown();

                }


                const tombolAksi =
                    e.target.closest(
                        "[data-aksi='detail']"
                    );


                if (tombolAksi) {

                    bukaDetail(
                        tombolAksi.dataset.id
                    );

                }


                const tombolTutup =
                    e.target.closest(
                        "[data-tutup-modal]"
                    );


                if (tombolTutup) {

                    tutupModal(
                        tombolTutup.dataset.tutupModal
                    );

                }

            }
        );


        /* MODAL CLICK */

        document
            .querySelectorAll(
                ".modal-backdrop"
            )
            .forEach(
                (modal) => {

                    modal.addEventListener(
                        "click",
                        (e) => {

                            if (
                                e.target === modal
                            ) {

                                tutupModal(
                                    modal.id
                                );

                            }

                        }
                    );

                }
            );


        /* ESCAPE */

        document.addEventListener(
            "keydown",
            (e) => {

                if (
                    e.key === "Escape"
                ) {

                    tutupDropdown();

                    tutupSidebar();

                    tutupModal(
                        "modalDetail"
                    );

                }

            }
        );


        /* TANGGAL TOPBAR */

        const now =
            new Date();


        if ($("topbarDate")) {

            $("topbarDate").textContent =
                now.toLocaleDateString(
                    "id-ID",
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

        }


        /* LOGOUT */

        const logoutSidebar =
            $("btnSidebarLogout");

        const logoutProfile =
            $("btnProfileLogout");


        const jalankanLogout = () => {

            window.location.href = "/";

        };


        if (logoutSidebar) {

            logoutSidebar.addEventListener(
                "click",
                jalankanLogout
            );

        }


        if (logoutProfile) {

            logoutProfile.addEventListener(
                "click",
                jalankanLogout
            );

        }

    };


    /* ============================================================
       INIT
    ============================================================ */

    const init = () => {

        isiPilihanKategori();

        pasangInteraksiUmum();

        terapkanFilter();


        $("cariRiwayat")
            .addEventListener(
                "input",
                terapkanFilter
            );


        $("filterJenis")
            .addEventListener(
                "change",
                () => {

                    isiPilihanKategori();

                    terapkanFilter();

                }
            );


        $("filterKategori")
            .addEventListener(
                "change",
                terapkanFilter
            );


        $("filterBulan")
            .addEventListener(
                "change",
                terapkanFilter
            );


        $("btnResetFilter")
            .addEventListener(
                "click",
                resetFilter
            );


        $("btnKosongkanFilter")
            .addEventListener(
                "click",
                resetFilter
            );

    };


    document.addEventListener(
        "DOMContentLoaded",
        init
    );

})();
