/* ============================================================
   BBCASHVIA — HALAMAN RIWAYAT TRANSAKSI (ADMIN)
   Data dummy + interaksi UI
   Tanpa fitur verifikasi
   ============================================================ */

(function () {
    "use strict";


    /* ============================================================
       DATA DUMMY
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


    const DATA_TRANSAKSI = [
        { id: "TRX-0102", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas awal tahun ajaran", kelas: "XI RPL 1", tanggal: "2026-08-11", waktu: "08:40", tagihan: 350000, diterima: 400000, petugas: "Azis N." },
        { id: "TRX-0103", jenis: "keluar", kategori: "Kegiatan kelas", keterangan: "Dekorasi kelas menyambut tahun ajaran", kelas: "XI RPL 2", tanggal: "2026-08-14", waktu: "13:25", tagihan: 130000, diterima: 150000, petugas: "Azis N." },
        { id: "TRX-0104", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "X TKJ 1", tanggal: "2026-08-18", waktu: "09:10", tagihan: 260000, diterima: 300000, petugas: "Azis N." },
        { id: "TRX-0105", jenis: "masuk", kategori: "Kas", keterangan: "Sisa dana orientasi kelas", kelas: "XI RPL 1", tanggal: "2026-08-20", waktu: "14:35", tagihan: 175000, diterima: 175000, petugas: "Azis N." },
        { id: "TRX-0106", jenis: "keluar", kategori: "Perlengkapan kelas", keterangan: "Pembelian sapu dan penghapus papan", kelas: "X TKJ 1", tanggal: "2026-08-21", waktu: "10:50", tagihan: 75000, diterima: 75000, petugas: "Azis N." },
        { id: "TRX-0107", jenis: "masuk", kategori: "Iuran", keterangan: "Iuran seragam olahraga", kelas: "XI RPL 2", tanggal: "2026-08-25", waktu: "11:05", tagihan: 450000, diterima: 500000, petugas: "Azis N." },
        { id: "TRX-0108", jenis: "keluar", kategori: "Kebutuhan kelas", keterangan: "Belanja alat kebersihan awal tahun", kelas: "XI RPL 1", tanggal: "2026-08-27", waktu: "15:40", tagihan: 90000, diterima: 100000, petugas: "Azis N." },
        { id: "TRX-0109", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "XI RPL 1", tanggal: "2026-08-28", waktu: "08:20", tagihan: 300000, diterima: 300000, petugas: "Azis N." },
        { id: "TRX-0110", jenis: "masuk", kategori: "Kas", keterangan: "Sisa kas kegiatan lomba kelas", kelas: "XI RPL 2", tanggal: "2026-09-15", waktu: "10:10", tagihan: 250000, diterima: 250000, petugas: "Azis N." },
        { id: "TRX-0111", jenis: "keluar", kategori: "Perlengkapan kelas", keterangan: "Pembelian kipas untuk kelas", kelas: "XI RPL 1", tanggal: "2026-09-16", waktu: "09:50", tagihan: 145000, diterima: 145000, petugas: "Azis N." },
        { id: "TRX-0112", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "X TKJ 1", tanggal: "2026-09-18", waktu: "15:00", tagihan: 280000, diterima: 300000, petugas: "Azis N." },
        { id: "TRX-0113", jenis: "keluar", kategori: "Kebutuhan kelas", keterangan: "Biaya fotokopi modul latihan", kelas: "XI RPL 1", tanggal: "2026-09-19", waktu: "11:15", tagihan: 75000, diterima: 80000, petugas: "Azis N." },
        { id: "TRX-0114", jenis: "masuk", kategori: "Iuran", keterangan: "Iuran study tour tahap 1", kelas: "XI RPL 2", tanggal: "2026-09-22", waktu: "08:30", tagihan: 1500000, diterima: 1500000, petugas: "Azis N." },
        { id: "TRX-0115", jenis: "masuk", kategori: "Pemasukan lainnya", keterangan: "Sumbangan alumni untuk rak buku", kelas: "XI RPL 1", tanggal: "2026-09-24", waktu: "14:55", tagihan: 400000, diterima: 400000, petugas: "Azis N." },
        { id: "TRX-0116", jenis: "keluar", kategori: "Perlengkapan kelas", keterangan: "Pembelian papan data kelas", kelas: "X TKJ 1", tanggal: "2026-09-25", waktu: "10:40", tagihan: 120000, diterima: 150000, petugas: "Azis N." },
        { id: "TRX-0117", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "XI RPL 2", tanggal: "2026-09-26", waktu: "09:20", tagihan: 300000, diterima: 350000, petugas: "Azis N." },
        { id: "TRX-0118", jenis: "keluar", kategori: "Kebutuhan kelas", keterangan: "Belanja tisu, sabun, dan pembersih kelas", kelas: "XI RPL 1", tanggal: "2026-09-27", waktu: "13:05", tagihan: 65000, diterima: 65000, petugas: "Azis N." },
        { id: "TRX-0119", jenis: "keluar", kategori: "Kegiatan kelas", keterangan: "Konsumsi rapat class meeting", kelas: "XI RPL 2", tanggal: "2026-09-28", waktu: "11:30", tagihan: 95000, diterima: 100000, petugas: "Azis N." },
        { id: "TRX-0120", jenis: "masuk", kategori: "Pemasukan lainnya", keterangan: "Refund dekorasi ruang kelas", kelas: "XI RPL 1", tanggal: "2026-09-29", waktu: "14:20", tagihan: 150000, diterima: 150000, petugas: "Azis N." },
        { id: "TRX-0121", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "X TKJ 1", tanggal: "2026-09-30", waktu: "08:55", tagihan: 280000, diterima: 300000, petugas: "Azis N." },
        { id: "TRX-0122", jenis: "masuk", kategori: "Iuran", keterangan: "Iuran study tour tahap 2", kelas: "XI RPL 2", tanggal: "2026-10-01", waktu: "10:05", tagihan: 1500000, diterima: 1500000, petugas: "Azis N." },
        { id: "TRX-0123", jenis: "keluar", kategori: "Kegiatan kelas", keterangan: "Pembelian tinta printer rapat", kelas: "XI RPL 1", tanggal: "2026-10-02", waktu: "15:12", tagihan: 85000, diterima: 100000, petugas: "Azis N." },
        { id: "TRX-0124", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "XI RPL 1", tanggal: "2026-10-03", waktu: "09:41", tagihan: 320000, diterima: 320000, petugas: "Azis N." }
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
        const d = new Date(iso + "T00:00:00");

        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
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

    const hitungKembalian = (tagihan, diterima) =>
        Math.max(
            0,
            (Number(diterima) || 0) - (Number(tagihan) || 0)
        );

    const hitungMasukKas = (tagihan, diterima) =>
        Math.min(
            Number(tagihan) || 0,
            Number(diterima) || 0
        );


    const CHIP_KATEGORI = {
        "Iuran": "chip--iuran",
        "Kas": "chip--kas",
        "Pemasukan lainnya": "chip--masuk-lain",
        "Kebutuhan kelas": "chip--butuh",
        "Perlengkapan kelas": "chip--perlengkapan",
        "Kegiatan kelas": "chip--kegiatan",
        "Pengeluaran lainnya": "chip--keluar-lain"
    };


    /* ============================================================
       MODAL
    ============================================================ */

    const bukaModal = (id) => {
        const modal = $(id);

        if (!modal) return;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");
    };


    const tutupModal = (id) => {
        const modal = $(id);

        if (!modal) return;

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");

        if (!document.querySelector(".modal-backdrop.is-open")) {
            document.body.classList.remove("modal-open");
        }
    };


    /* ============================================================
       FILTER
    ============================================================ */

    const isiPilihanKategori = () => {

        const pilihJenis = $("filterJenis").value;
        const pilihKategori = $("filterKategori");
        const nilaiLama = pilihKategori.value;

        const daftar =
            pilihJenis === "masuk"
                ? KATEGORI_MASUK
                : pilihJenis === "keluar"
                    ? KATEGORI_KELUAR
                    : [...KATEGORI_MASUK, ...KATEGORI_KELUAR];

        pilihKategori.innerHTML =
            `<option value="semua">Semua Kategori</option>` +
            daftar
                .map(
                    (k) =>
                        `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`
                )
                .join("");

        if (
            [...pilihKategori.options]
                .some((o) => o.value === nilaiLama)
        ) {
            pilihKategori.value = nilaiLama;
        }
    };


    const terapkanFilter = () => {

        const kata = $("cariRiwayat").value
            .trim()
            .toLowerCase();

        const jenis = $("filterJenis").value;
        const kategori = $("filterKategori").value;
        const bulan = $("filterBulan").value;


        const hasil = DATA_TRANSAKSI.filter((t) => {

            if (jenis !== "semua" && t.jenis !== jenis) {
                return false;
            }

            if (kategori !== "semua" && t.kategori !== kategori) {
                return false;
            }

            if (bulan !== "semua" && !t.tanggal.startsWith(bulan)) {
                return false;
            }

            if (kata) {

                const gabung =
                    `${t.id} ${t.keterangan} ${t.kategori} ${t.kelas} ${t.petugas}`
                        .toLowerCase();

                if (!gabung.includes(kata)) {
                    return false;
                }
            }

            return true;
        });


        hasil.sort((a, b) =>
            a.tanggal < b.tanggal
                ? 1
                : a.tanggal > b.tanggal
                    ? -1
                    : 0
        );


        renderTabel(hasil);
        renderRingkasan(hasil);
    };


    const resetFilter = () => {

        $("cariRiwayat").value = "";
        $("filterJenis").value = "semua";
        $("filterBulan").value = "semua";

        isiPilihanKategori();

        $("filterKategori").value = "semua";

        terapkanFilter();
    };


    /* ============================================================
       RENDER TABEL
    ============================================================ */

    const barisTabel = (t) => {

        const nominal = hitungMasukKas(
            t.tagihan,
            t.diterima
        );

        const tanda =
            t.jenis === "masuk"
                ? "+"
                : "−";

        const kelas = t.kelas
            ? `<span class="cell-keterangan__sub">${escapeHtml(t.kelas)}</span>`
            : "";

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

                    ${kelas}

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

                    <span class="cell-nominal cell-nominal--${t.jenis}">
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
                            data-id="${t.id}"
                            aria-label="Lihat detail ${t.id}"
                            title="Detail">

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

        const tbody = $("isiTabelRiwayat");
        const kosong = $("emptyState");

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


    const renderRingkasan = (baris) => {

        const masuk =
            baris
                .filter((t) => t.jenis === "masuk")
                .reduce(
                    (tot, t) =>
                        tot +
                        hitungMasukKas(
                            t.tagihan,
                            t.diterima
                        ),
                    0
                );


        const keluar =
            baris
                .filter((t) => t.jenis === "keluar")
                .reduce(
                    (tot, t) =>
                        tot +
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


        const n = baris.length;

        const catatan =
            n
                ? `dari ${n} transaksi terfilter`
                : "tidak ada transaksi";


        $("sumMasukNote").textContent =
            catatan;

        $("sumKeluarNote").textContent =
            catatan;

        $("sumJumlahNote").textContent =
            catatan;
    };


    /* ============================================================
       MODAL DETAIL
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
            t.kelas || "—";

        $("detailTanggal").textContent =
            formatTanggal(t.tanggal);

        $("detailWaktu").textContent =
            `${t.waktu} WIB`;

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
            formatRupiah(t.tagihan);

        $("rincianDiterima").textContent =
            formatRupiah(t.diterima);

        $("rincianKembalian").textContent =
            formatRupiah(kembalian);

        $("rincianMasukKas").textContent =
            formatRupiah(masukKas);


        $("rincianLabelDiterima").textContent =
            t.jenis === "masuk"
                ? "Jumlah uang yang diterima Bendahara"
                : "Jumlah uang yang dibayarkan Bendahara";


        $("rincianLabelMasukKas").textContent =
            t.jenis === "masuk"
                ? "Jumlah uang yang masuk ke kas"
                : "Jumlah uang yang keluar dari kas";


        bukaModal("modalDetail");
    };


    /* ============================================================
       INTERAKSI UMUM
    ============================================================ */

    const pasangInteraksiUmum = () => {

        const sidebar = $("sidebar");
        const backdrop = $("sidebarBackdrop");
        const toggle = $("sidebarToggle");
        const profileBtn = $("profileBtn");
        const profileMenu = $("profileMenu");


        const tutupSidebar = () => {

            document.body.classList.remove("nav-open");

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );
        };


        toggle.addEventListener("click", (e) => {

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
        });


        backdrop.addEventListener(
            "click",
            tutupSidebar
        );


        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth > 1024) {
                    tutupSidebar();
                }

            }
        );


        const tutupDropdown = () => {

            profileMenu.classList.remove(
                "is-open"
            );

            profileBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        };


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


        document.addEventListener(
            "click",
            (e) => {

                if (
                    !profileMenu.contains(e.target) &&
                    !profileBtn.contains(e.target)
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


        document
            .querySelectorAll(".modal-backdrop")
            .forEach((modal) => {

                modal.addEventListener(
                    "click",
                    (e) => {

                        if (e.target === modal) {
                            tutupModal(modal.id);
                        }

                    }
                );

            });


        document.addEventListener(
            "keydown",
            (e) => {

                if (e.key === "Escape") {

                    tutupDropdown();
                    tutupSidebar();
                    tutupModal("modalDetail");

                }

            }
        );


        const now = new Date();

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
