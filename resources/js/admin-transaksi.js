/* ============================================================
   BBCASHVIA — HALAMAN TRANSAKSI (ADMIN)
   Data dummy + interaksi UI
   Tanpa koneksi database / API
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
       ============================================================ */

    const DATA_TRANSAKSI = [
        {
            id: "TRX-0124",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Setoran kas mingguan",
            kelas: "XI RPL 1",
            tanggal: "2026-10-03",
            waktu: "09:41",
            tagihan: 320000,
            diterima: 320000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0123",
            jenis: "keluar",
            kategori: "Kegiatan kelas",
            keterangan: "Pembelian tinta printer rapat",
            kelas: "XI RPL 1",
            tanggal: "2026-10-02",
            waktu: "15:12",
            tagihan: 85000,
            diterima: 100000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0122",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Iuran study tour tahap 2",
            kelas: "XI RPL 2",
            tanggal: "2026-10-01",
            waktu: "10:05",
            tagihan: 1500000,
            diterima: 1500000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0121",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Setoran kas mingguan",
            kelas: "X TKJ 1",
            tanggal: "2026-09-30",
            waktu: "08:55",
            tagihan: 280000,
            diterima: 300000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0120",
            jenis: "masuk",
            kategori: "Pemasukan lainnya",
            keterangan: "Refund dekorasi ruang kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-09-29",
            waktu: "14:20",
            tagihan: 150000,
            diterima: 150000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0119",
            jenis: "keluar",
            kategori: "Kegiatan kelas",
            keterangan: "Konsumsi rapat class meeting",
            kelas: "XI RPL 2",
            tanggal: "2026-09-28",
            waktu: "11:30",
            tagihan: 95000,
            diterima: 100000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0118",
            jenis: "keluar",
            kategori: "Kebutuhan kelas",
            keterangan: "Belanja tisu, sabun, dan pembersih kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-09-27",
            waktu: "13:05",
            tagihan: 65000,
            diterima: 65000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0117",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Setoran kas mingguan",
            kelas: "XI RPL 2",
            tanggal: "2026-09-26",
            waktu: "09:20",
            tagihan: 300000,
            diterima: 350000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0116",
            jenis: "keluar",
            kategori: "Perlengkapan kelas",
            keterangan: "Pembelian papan data kelas",
            kelas: "X TKJ 1",
            tanggal: "2026-09-25",
            waktu: "10:40",
            tagihan: 120000,
            diterima: 150000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0115",
            jenis: "masuk",
            kategori: "Pemasukan lainnya",
            keterangan: "Sumbangan alumni untuk rak buku",
            kelas: "XI RPL 1",
            tanggal: "2026-09-24",
            waktu: "14:55",
            tagihan: 400000,
            diterima: 400000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0114",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Iuran study tour tahap 1",
            kelas: "XI RPL 2",
            tanggal: "2026-09-22",
            waktu: "08:30",
            tagihan: 1500000,
            diterima: 1500000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0113",
            jenis: "keluar",
            kategori: "Kebutuhan kelas",
            keterangan: "Biaya fotokopi modul latihan",
            kelas: "XI RPL 1",
            tanggal: "2026-09-19",
            waktu: "11:15",
            tagihan: 75000,
            diterima: 80000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0112",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Setoran kas mingguan",
            kelas: "X TKJ 1",
            tanggal: "2026-09-18",
            waktu: "15:00",
            tagihan: 280000,
            diterima: 300000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0111",
            jenis: "keluar",
            kategori: "Perlengkapan kelas",
            keterangan: "Pembelian kipas untuk kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-09-16",
            waktu: "09:50",
            tagihan: 145000,
            diterima: 145000,
            petugas: "Azis N."
        },
        {
            id: "TRX-0110",
            jenis: "masuk",
            kategori: "Kas",
            keterangan: "Sisa kas kegiatan lomba kelas",
            kelas: "XI RPL 2",
            tanggal: "2026-09-15",
            waktu: "10:10",
            tagihan: 250000,
            diterima: 250000,
            petugas: "Azis N."
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

    const parseAngka = (teks) => {
        const digit = String(teks ?? "")
            .replace(/[^\d]/g, "");

        return digit
            ? parseInt(digit, 10)
            : 0;
    };

    const formatTeksUang = (teks) => {
        const n = parseAngka(teks);

        return n
            ? n.toLocaleString("id-ID")
            : "";
    };

    const formatTanggal = (iso) => {
        if (!iso) return "—";

        const d = new Date(
            iso + "T00:00:00"
        );

        if (Number.isNaN(d.getTime())) {
            return iso;
        }

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
        const totalTagihan =
            Number(tagihan) || 0;

        const totalDiterima =
            Number(diterima) || 0;

        return Math.max(
            0,
            totalDiterima - totalTagihan
        );
    };


    /*
       Jumlah yang benar-benar memengaruhi kas.

       Contoh MASUK:
       Tagihan 10.000
       Diterima 20.000
       Kembalian 10.000
       Kas bertambah 10.000

       Contoh KELUAR:
       Pengeluaran 85.000
       Dibayarkan 100.000
       Kembalian 15.000
       Kas berkurang 85.000
    */

    const hitungNilaiKas = (
        tagihan,
        diterima
    ) => {
        const totalTagihan =
            Number(tagihan) || 0;

        const totalDiterima =
            Number(diterima) || 0;

        return Math.min(
            totalTagihan,
            totalDiterima
        );
    };


    /* ============================================================
       CHIP KATEGORI
       ============================================================ */

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
       STATE
       ============================================================ */

    let modeForm = "tambah";
    let idSedangDiubah = null;
    let idSedangDihapus = null;


    /* ============================================================
       RENDER TABEL
       ============================================================ */

    const barisTabel = (t) => {
        const nominal =
            hitungNilaiKas(
                t.tagihan,
                t.diterima
            );

        const tanda =
            t.jenis === "masuk"
                ? "+"
                : "−";

        const kelas =
            t.kelas
                ? `
                    <span class="cell-keterangan__sub">
                        ${escapeHtml(t.kelas)}
                    </span>
                `
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
                        ${escapeHtml(t.waktu || "—")} WIB
                    </div>

                </td>

                <td class="td-r">

                    <span class="cell-nominal cell-nominal--${escapeHtml(t.jenis)}">
                        ${tanda}${formatRupiah(nominal)}
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

                        <button
                            type="button"
                            class="icon-btn"
                            data-aksi="ubah"
                            data-id="${escapeHtml(t.id)}"
                            aria-label="Ubah ${escapeHtml(t.id)}"
                            title="Ubah"
                        >
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </button>

                        <button
                            type="button"
                            class="icon-btn icon-btn--hapus"
                            data-aksi="hapus"
                            data-id="${escapeHtml(t.id)}"
                            aria-label="Hapus ${escapeHtml(t.id)}"
                            title="Hapus"
                        >
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </button>

                    </span>

                </td>

            </tr>
        `;
    };


    const renderTabel = (baris) => {
        const tbody =
            $("isiTabelTransaksi");

        const kosong =
            $("emptyState");

        if (!tbody || !kosong) {
            return;
        }

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

        const info =
            $("tabelInfo");

        if (info) {
            info.textContent =
                `${baris.length} transaksi ditampilkan`;
        }
    };


    /* ============================================================
       RENDER RINGKASAN
       ============================================================ */

    const renderRingkasan = (baris) => {

        const masuk =
            baris
                .filter(
                    (t) => t.jenis === "masuk"
                )
                .reduce(
                    (total, t) =>
                        total +
                        hitungNilaiKas(
                            t.tagihan,
                            t.diterima
                        ),
                    0
                );

        const keluar =
            baris
                .filter(
                    (t) => t.jenis === "keluar"
                )
                .reduce(
                    (total, t) =>
                        total +
                        hitungNilaiKas(
                            t.tagihan,
                            t.diterima
                        ),
                    0
                );

        const selisih =
            masuk - keluar;

        if ($("sumMasuk")) {
            $("sumMasuk").textContent =
                formatRupiah(masuk);
        }

        if ($("sumKeluar")) {
            $("sumKeluar").textContent =
                formatRupiah(keluar);
        }

        if ($("sumSelisih")) {
            $("sumSelisih").textContent =
                (selisih >= 0 ? "+" : "−") +
                formatRupiah(
                    Math.abs(selisih)
                );
        }

        const jumlah =
            baris.length;

        if ($("sumMasukNote")) {
            $("sumMasukNote").textContent =
                jumlah
                    ? `${baris.filter(t => t.jenis === "masuk").length} transaksi pemasukan`
                    : "tidak ada pemasukan";
        }

        if ($("sumKeluarNote")) {
            $("sumKeluarNote").textContent =
                jumlah
                    ? `${baris.filter(t => t.jenis === "keluar").length} transaksi pengeluaran`
                    : "tidak ada pengeluaran";
        }

        if ($("sumSelisihNote")) {

            if (!jumlah) {
                $("sumSelisihNote").textContent =
                    "tidak ada transaksi";
            }

            else if (selisih > 0) {
                $("sumSelisihNote").textContent =
                    "saldo kas bertambah";
            }

            else if (selisih < 0) {
                $("sumSelisihNote").textContent =
                    "saldo kas berkurang";
            }

            else {
                $("sumSelisihNote").textContent =
                    "pemasukan dan pengeluaran seimbang";
            }
        }
    };


    /* ============================================================
       FILTER — KATEGORI
       ============================================================ */

    const isiPilihanKategori = () => {
        const pilihJenis =
            $("filterJenis");

        const pilihKategori =
            $("filterKategori");

        if (!pilihJenis || !pilihKategori) {
            return;
        }

        const jenis =
            pilihJenis.value;

        const nilaiLama =
            pilihKategori.value;

        let daftar = [];

        if (jenis === "masuk") {
            daftar = KATEGORI_MASUK;
        }

        else if (jenis === "keluar") {
            daftar = KATEGORI_KELUAR;
        }

        else {
            daftar = [
                ...KATEGORI_MASUK,
                ...KATEGORI_KELUAR
            ];
        }

        pilihKategori.innerHTML =
            `
                <option value="semua">
                    Semua Kategori
                </option>
            ` +
            daftar
                .map(
                    (kategori) => `
                        <option value="${escapeHtml(kategori)}">
                            ${escapeHtml(kategori)}
                        </option>
                    `
                )
                .join("");

        const masihAda =
            [...pilihKategori.options]
                .some(
                    (option) =>
                        option.value === nilaiLama
                );

        if (masihAda) {
            pilihKategori.value =
                nilaiLama;
        }
    };


    /* ============================================================
       TERAPKAN FILTER
       ============================================================ */

    const terapkanFilter = () => {

        const inputCari =
            $("cariTransaksi");

        const filterJenis =
            $("filterJenis");

        const filterKategori =
            $("filterKategori");

        const filterBulan =
            $("filterBulan");

        if (
            !inputCari ||
            !filterJenis ||
            !filterKategori ||
            !filterBulan
        ) {
            return;
        }

        const kata =
            inputCari.value
                .trim()
                .toLowerCase();

        const jenis =
            filterJenis.value;

        const kategori =
            filterKategori.value;

        const bulan =
            filterBulan.value;

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
                        !t.tanggal.startsWith(bulan)
                    ) {
                        return false;
                    }

                    if (kata) {

                        const gabung =
                            `
                                ${t.id}
                                ${t.keterangan}
                                ${t.kategori}
                                ${t.kelas}
                                ${t.petugas}
                            `
                                .toLowerCase();

                        if (
                            !gabung.includes(kata)
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );

        renderTabel(hasil);
        renderRingkasan(hasil);
    };


    /* ============================================================
       RESET FILTER
       ============================================================ */

    const resetFilter = () => {

        if ($("cariTransaksi")) {
            $("cariTransaksi").value = "";
        }

        if ($("filterJenis")) {
            $("filterJenis").value = "semua";
        }

        if ($("filterBulan")) {
            $("filterBulan").value = "semua";
        }

        isiPilihanKategori();

        if ($("filterKategori")) {
            $("filterKategori").value =
                "semua";
        }

        terapkanFilter();
    };


    /* ============================================================
       MODAL
       ============================================================ */

    const bukaModal = (id) => {

        const modal =
            $(id);

        if (!modal) {
            return;
        }

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

        const modal =
            $(id);

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        const masihTerbuka =
            document.querySelector(
                ".modal-backdrop.is-open"
            );

        if (!masihTerbuka) {
            document.body.classList.remove(
                "modal-open"
            );
        }
    };


    const tutupSemuaModal = () => {

        document
            .querySelectorAll(
                ".modal-backdrop.is-open"
            )
            .forEach(
                (modal) => {
                    tutupModal(
                        modal.id
                    );
                }
            );
    };


    /* ============================================================
       TOAST
       ============================================================ */

    let toastTimer = null;

    const tampilkanToast = (pesan) => {

        const toast =
            $("toast");

        const toastText =
            $("toastText");

        if (!toast || !toastText) {
            return;
        }

        toastText.textContent =
            pesan;

        toast.classList.add(
            "is-muncul"
        );

        clearTimeout(
            toastTimer
        );

        toastTimer =
            setTimeout(
                () => {
                    toast.classList.remove(
                        "is-muncul"
                    );
                },
                2800
            );
    };


    /* ============================================================
       FORM — JENIS
       ============================================================ */

    const jenisTerpilih = () => {

        const radio =
            document.querySelector(
                'input[name="jenisTransaksi"]:checked'
            );

        return radio
            ? radio.value
            : "masuk";
    };


    /* ============================================================
       FORM — KATEGORI
       ============================================================ */

    const isiKategoriForm = () => {

        const pilih =
            $("inputKategori");

        if (!pilih) {
            return;
        }

        const jenis =
            jenisTerpilih();

        const nilaiLama =
            pilih.value;

        const daftar =
            jenis === "masuk"
                ? KATEGORI_MASUK
                : KATEGORI_KELUAR;

        pilih.innerHTML =
            daftar
                .map(
                    (kategori) => `
                        <option value="${escapeHtml(kategori)}">
                            ${escapeHtml(kategori)}
                        </option>
                    `
                )
                .join("");

        const masihAda =
            [...pilih.options]
                .some(
                    (option) =>
                        option.value === nilaiLama
                );

        if (masihAda) {
            pilih.value =
                nilaiLama;
        }
    };


    /* ============================================================
       FORM — LABEL SESUAI JENIS
       ============================================================ */

    const sesuaikanLabelJenis = () => {

        const jenis =
            jenisTerpilih();

        const labelDiterima =
            $("labelDiterima");

        const labelMasukKas =
            $("labelMasukKas");

        const uangBox =
            $("uangBox");

        if (labelDiterima) {
            labelDiterima.innerHTML =
                jenis === "masuk"
                    ? `
                        Jumlah uang yang diterima Bendahara
                        <b class="wajib">*</b>
                    `
                    : `
                        Jumlah uang yang dibayarkan Bendahara
                        <b class="wajib">*</b>
                    `;
        }

        if (labelMasukKas) {
            labelMasukKas.textContent =
                jenis === "masuk"
                    ? "Jumlah uang yang masuk ke kas"
                    : "Jumlah uang yang keluar dari kas";
        }

        if (uangBox) {
            uangBox.classList.toggle(
                "is-keluar",
                jenis === "keluar"
            );
        }

        hitungUangLive();
    };


    /* ============================================================
       FORM — HITUNG UANG LIVE
       ============================================================ */

    const hitungUangLive = () => {

        const inputTagihan =
            $("inputTagihan");

        const inputDiterima =
            $("inputDiterima");

        const hasilKembalian =
            $("hasilKembalian");

        const hasilMasukKas =
            $("hasilMasukKas");

        if (
            !inputTagihan ||
            !inputDiterima ||
            !hasilKembalian ||
            !hasilMasukKas
        ) {
            return;
        }

        const tagihan =
            parseAngka(
                inputTagihan.value
            );

        const diterima =
            parseAngka(
                inputDiterima.value
            );

        const kembalian =
            hitungKembalian(
                tagihan,
                diterima
            );

        const nilaiKas =
            hitungNilaiKas(
                tagihan,
                diterima
            );

        hasilKembalian.textContent =
            kembalian.toLocaleString(
                "id-ID"
            );

        hasilMasukKas.textContent =
            nilaiKas.toLocaleString(
                "id-ID"
            );


        /* --------------------------------------------------------
           HINT
           -------------------------------------------------------- */

        const hint =
            $("uangHint");

        if (!hint) {
            return;
        }

        const jenis =
            jenisTerpilih();

        if (
            diterima > 0 &&
            diterima < tagihan
        ) {

            const kekurangan =
                tagihan - diterima;

            hint.classList.add(
                "is-peringatan"
            );

            hint.innerHTML = `
                <span class="material-symbols-outlined">
                    info
                </span>

                Uang ${
                    jenis === "masuk"
                        ? "yang diterima"
                        : "yang dibayarkan"
                }
                lebih kecil dari nilai transaksi
                — masih kurang
                Rp ${kekurangan.toLocaleString("id-ID")}.
            `;

            return;
        }


        if (
            diterima > tagihan &&
            tagihan > 0
        ) {

            hint.classList.remove(
                "is-peringatan"
            );

            hint.innerHTML = `
                <span class="material-symbols-outlined">
                    info
                </span>

                Uang diterima/dibayarkan
                Rp ${diterima.toLocaleString("id-ID")}
                menghasilkan kembalian
                Rp ${kembalian.toLocaleString("id-ID")}.
                Nilai yang dicatat ke kas
                Rp ${nilaiKas.toLocaleString("id-ID")}.
            `;

            return;
        }


        hint.classList.remove(
            "is-peringatan"
        );

        hint.innerHTML = `
            <span class="material-symbols-outlined">
                info
            </span>

            Contoh: transaksi Rp 10.000 dan uang
            Rp 20.000 → kembalian Rp 10.000,
            sehingga nilai yang dicatat ke kas Rp 10.000.
        `;
    };


    /* ============================================================
       FORM — BUKA TAMBAH
       ============================================================ */

    const bukaFormTambah = () => {

        const form =
            $("formTransaksi");

        if (!form) {
            return;
        }

        modeForm =
            "tambah";

        idSedangDiubah =
            null;

        if ($("modalFormEyebrow")) {
            $("modalFormEyebrow").textContent =
                "TRANSAKSI BARU";
        }

        if ($("modalFormTitle")) {
            $("modalFormTitle").textContent =
                "Catat Transaksi";
        }

        if ($("btnSimpanText")) {
            $("btnSimpanText").textContent =
                "Simpan Transaksi";
        }

        form.reset();

        if ($("formError")) {
            $("formError").hidden =
                true;
        }

        const radioMasuk =
            document.querySelector(
                'input[name="jenisTransaksi"][value="masuk"]'
            );

        if (radioMasuk) {
            radioMasuk.checked =
                true;
        }

        isiKategoriForm();


        /* --------------------------------------------------------
           TANGGAL HARI INI
           -------------------------------------------------------- */

        const hariIni =
            new Date();

        const iso =
            `${hariIni.getFullYear()}-` +
            `${String(
                hariIni.getMonth() + 1
            ).padStart(2, "0")}-` +
            `${String(
                hariIni.getDate()
            ).padStart(2, "0")}`;

        if ($("inputTanggal")) {
            $("inputTanggal").value =
                iso;
        }

        if ($("hasilKembalian")) {
            $("hasilKembalian").textContent =
                "0";
        }

        if ($("hasilMasukKas")) {
            $("hasilMasukKas").textContent =
                "0";
        }

        sesuaikanLabelJenis();

        bukaModal(
            "modalForm"
        );

        setTimeout(
            () => {
                if ($("inputKeterangan")) {
                    $("inputKeterangan").focus();
                }
            },
            120
        );
    };


    /* ============================================================
       FORM — BUKA UBAH
       ============================================================ */

    const bukaFormUbah = (id) => {

        const t =
            DATA_TRANSAKSI.find(
                (item) =>
                    item.id === id
            );

        if (!t) {
            return;
        }

        const form =
            $("formTransaksi");

        if (!form) {
            return;
        }

        modeForm =
            "ubah";

        idSedangDiubah =
            id;

        if ($("modalFormEyebrow")) {
            $("modalFormEyebrow").textContent =
                "UBAH TRANSAKSI";
        }

        if ($("modalFormTitle")) {
            $("modalFormTitle").textContent =
                `Ubah ${t.id}`;
        }

        if ($("btnSimpanText")) {
            $("btnSimpanText").textContent =
                "Perbarui Transaksi";
        }

        form.reset();

        if ($("formError")) {
            $("formError").hidden =
                true;
        }

        const radio =
            document.querySelector(
                `input[name="jenisTransaksi"][value="${t.jenis}"]`
            );

        if (radio) {
            radio.checked =
                true;
        }

        isiKategoriForm();

        if ($("inputKategori")) {
            $("inputKategori").value =
                t.kategori;
        }

        if ($("inputKelas")) {
            $("inputKelas").value =
                t.kelas || "";
        }

        if ($("inputKeterangan")) {
            $("inputKeterangan").value =
                t.keterangan || "";
        }

        if ($("inputTanggal")) {
            $("inputTanggal").value =
                t.tanggal || "";
        }

        if ($("inputTagihan")) {
            $("inputTagihan").value =
                Number(t.tagihan || 0)
                    .toLocaleString("id-ID");
        }

        if ($("inputDiterima")) {
            $("inputDiterima").value =
                Number(t.diterima || 0)
                    .toLocaleString("id-ID");
        }

        sesuaikanLabelJenis();

        bukaModal(
            "modalForm"
        );

        setTimeout(
            () => {
                if ($("inputKeterangan")) {
                    $("inputKeterangan").focus();
                }
            },
            120
        );
    };


    /* ============================================================
       ID TRANSAKSI BARU
       ============================================================ */

    const buatIdBaru = () => {

        const nomorTerbesar =
            DATA_TRANSAKSI.reduce(
                (maks, t) => {

                    const nomor =
                        parseInt(
                            String(t.id)
                                .replace(
                                    "TRX-",
                                    ""
                                ),
                            10
                        );

                    return nomor > maks
                        ? nomor
                        : maks;
                },
                0
            );

        return `
            TRX-${String(
                nomorTerbesar + 1
            ).padStart(4, "0")}
        `.trim();
    };


    /* ============================================================
       FORM — SIMPAN TRANSAKSI
       ============================================================ */

    const simpanTransaksi = (e) => {

        e.preventDefault();

        const kategori =
            $("inputKategori")
                ? $("inputKategori").value
                : "";

        const keterangan =
            $("inputKeterangan")
                ? $("inputKeterangan")
                    .value
                    .trim()
                : "";

        const tanggal =
            $("inputTanggal")
                ? $("inputTanggal").value
                : "";

        const kelas =
            $("inputKelas")
                ? $("inputKelas").value
                : "";

        const jenis =
            jenisTerpilih();

        const tagihan =
            $("inputTagihan")
                ? parseAngka(
                    $("inputTagihan").value
                )
                : 0;

        const diterima =
            $("inputDiterima")
                ? parseAngka(
                    $("inputDiterima").value
                )
                : 0;


        /* --------------------------------------------------------
           VALIDASI
           -------------------------------------------------------- */

        const galat = [];

        if (!keterangan) {
            galat.push(
                "Keterangan wajib diisi"
            );
        }

        if (!tanggal) {
            galat.push(
                "Tanggal wajib diisi"
            );
        }

        if (!kategori) {
            galat.push(
                "Kategori wajib dipilih"
            );
        }

        if (tagihan <= 0) {
            galat.push(
                "Jumlah transaksi wajib lebih dari 0"
            );
        }

        if (diterima <= 0) {
            galat.push(
                "Jumlah uang wajib lebih dari 0"
            );
        }


        const kotakGalat =
            $("formError");

        if (galat.length) {

            if (kotakGalat) {
                kotakGalat.textContent =
                    galat.join(" • ");

                kotakGalat.hidden =
                    false;
            }

            return;
        }

        if (kotakGalat) {
            kotakGalat.hidden =
                true;
        }


        /* --------------------------------------------------------
           WAKTU
           -------------------------------------------------------- */

        const jam =
            new Date();

        const waktu =
            `${String(
                jam.getHours()
            ).padStart(2, "0")}:` +
            `${String(
                jam.getMinutes()
            ).padStart(2, "0")}`;


        /* --------------------------------------------------------
           UBAH
           -------------------------------------------------------- */

        if (
            modeForm === "ubah" &&
            idSedangDiubah
        ) {

            const t =
                DATA_TRANSAKSI.find(
                    (item) =>
                        item.id ===
                        idSedangDiubah
                );

            if (t) {

                Object.assign(
                    t,
                    {
                        jenis,
                        kategori,
                        keterangan,
                        kelas,
                        tanggal,
                        waktu,
                        tagihan,
                        diterima
                    }
                );
            }

            tampilkanToast(
                `Transaksi ${idSedangDiubah} berhasil diperbarui`
            );
        }


        /* --------------------------------------------------------
           TAMBAH
           -------------------------------------------------------- */

        else {

            const baru = {

                id:
                    buatIdBaru(),

                jenis,

                kategori,

                keterangan,

                kelas,

                tanggal,

                waktu,

                tagihan,

                diterima,

                petugas:
                    "Azis N."
            };

            DATA_TRANSAKSI.unshift(
                baru
            );

            tampilkanToast(
                `Transaksi ${baru.id} berhasil dicatat`
            );
        }

        tutupModal(
            "modalForm"
        );

        terapkanFilter();
    };


    /* ============================================================
       DETAIL TRANSAKSI
       ============================================================ */

    const bukaDetail = (id) => {

        const t =
            DATA_TRANSAKSI.find(
                (item) =>
                    item.id === id
            );

        if (!t) {
            return;
        }

        const nilaiKas =
            hitungNilaiKas(
                t.tagihan,
                t.diterima
            );

        const kembalian =
            hitungKembalian(
                t.tagihan,
                t.diterima
            );


        if ($("modalDetailTitle")) {
            $("modalDetailTitle").textContent =
                t.id;
        }

        if ($("detailJenis")) {
            $("detailJenis").textContent =
                t.jenis === "masuk"
                    ? "Pemasukan"
                    : "Pengeluaran";
        }

        if ($("detailKategori")) {
            $("detailKategori").textContent =
                t.kategori;
        }

        if ($("detailKelas")) {
            $("detailKelas").textContent =
                t.kelas || "—";
        }

        if ($("detailTanggal")) {
            $("detailTanggal").textContent =
                formatTanggal(
                    t.tanggal
                );
        }

        if ($("detailWaktu")) {
            $("detailWaktu").textContent =
                `${t.waktu || "—"} WIB`;
        }

        if ($("detailPetugas")) {
            $("detailPetugas").textContent =
                t.petugas || "—";
        }

        if ($("detailKeterangan")) {
            $("detailKeterangan").textContent =
                t.keterangan || "—";
        }


        if ($("rincianLabelDiterima")) {
            $("rincianLabelDiterima").textContent =
                t.jenis === "masuk"
                    ? "Jumlah uang yang diterima Bendahara"
                    : "Jumlah uang yang dibayarkan Bendahara";
        }

        if ($("rincianLabelMasukKas")) {
            $("rincianLabelMasukKas").textContent =
                t.jenis === "masuk"
                    ? "Jumlah uang yang masuk ke kas"
                    : "Jumlah uang yang keluar dari kas";
        }

        if ($("rincianTagihan")) {
            $("rincianTagihan").textContent =
                formatRupiah(
                    t.tagihan
                );
        }

        if ($("rincianDiterima")) {
            $("rincianDiterima").textContent =
                formatRupiah(
                    t.diterima
                );
        }

        if ($("rincianKembalian")) {
            $("rincianKembalian").textContent =
                formatRupiah(
                    kembalian
                );
        }

        if ($("rincianMasukKas")) {
            $("rincianMasukKas").textContent =
                formatRupiah(
                    nilaiKas
                );
        }

        bukaModal(
            "modalDetail"
        );
    };


    /* ============================================================
       HAPUS TRANSAKSI
       ============================================================ */

    const bukaHapus = (id) => {

        const transaksi =
            DATA_TRANSAKSI.find(
                (item) =>
                    item.id === id
            );

        if (!transaksi) {
            return;
        }

        idSedangDihapus =
            id;

        if ($("hapusText")) {
            $("hapusText").textContent =
                `Transaksi ${id} akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.`;
        }

        bukaModal(
            "modalHapus"
        );
    };


    const jalankanHapus = () => {

        if (!idSedangDihapus) {
            return;
        }

        const index =
            DATA_TRANSAKSI.findIndex(
                (item) =>
                    item.id ===
                    idSedangDihapus
            );

        if (index >= 0) {

            const [dihapus] =
                DATA_TRANSAKSI.splice(
                    index,
                    1
                );

            tampilkanToast(
                `Transaksi ${dihapus.id} dihapus`
            );
        }

        tutupModal(
            "modalHapus"
        );

        idSedangDihapus =
            null;

        terapkanFilter();
    };


    /* ============================================================
       SIDEBAR + DROPDOWN + TANGGAL
       ============================================================ */

    const pasangInteraksiUmum = () => {

        /* --------------------------------------------------------
           SIDEBAR
           -------------------------------------------------------- */

        const tombolSidebar =
            $("sidebarToggle");

        const backdrop =
            $("sidebarBackdrop");

        const tutupSidebar = () => {
            document.body.classList.remove(
                "nav-open"
            );
        };

        if (tombolSidebar) {

            tombolSidebar.addEventListener(
                "click",
                () => {

                    document.body.classList.toggle(
                        "nav-open"
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
                    window.innerWidth >
                    1024
                ) {
                    tutupSidebar();
                }
            }
        );


        /* --------------------------------------------------------
           DROPDOWN PROFIL
           -------------------------------------------------------- */

        const tombolProfil =
            $("profileBtn");

        const menuProfil =
            $("profileMenu");

        const tutupProfil = () => {

            if (menuProfil) {
                menuProfil.classList.remove(
                    "is-open"
                );
            }

            if (tombolProfil) {
                tombolProfil.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        };


        if (
            tombolProfil &&
            menuProfil
        ) {

            tombolProfil.addEventListener(
                "click",
                (e) => {

                    e.stopPropagation();

                    const terbuka =
                        menuProfil.classList.toggle(
                            "is-open"
                        );

                    tombolProfil.setAttribute(
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
                        !menuProfil.contains(
                            e.target
                        ) &&
                        e.target !==
                            tombolProfil
                    ) {
                        tutupProfil();
                    }
                }
            );
        }


        /* --------------------------------------------------------
           ESCAPE
           -------------------------------------------------------- */

        document.addEventListener(
            "keydown",
            (e) => {

                if (
                    e.key === "Escape"
                ) {

                    tutupSidebar();
                    tutupProfil();
                    tutupSemuaModal();
                }
            }
        );


        /* --------------------------------------------------------
           TANGGAL TOPBAR
           -------------------------------------------------------- */

        const elTanggal =
            $("topbarDate");

        if (elTanggal) {

            elTanggal.textContent =
                new Date()
                    .toLocaleDateString(
                        "id-ID",
                        {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    );
        }
    };


    /* ============================================================
       EVENT
       ============================================================ */

    const pasangEvent = () => {

        /* --------------------------------------------------------
           FILTER
           -------------------------------------------------------- */

        if ($("cariTransaksi")) {
            $("cariTransaksi")
                .addEventListener(
                    "input",
                    terapkanFilter
                );
        }

        if ($("filterJenis")) {

            $("filterJenis")
                .addEventListener(
                    "change",
                    () => {

                        isiPilihanKategori();
                        terapkanFilter();
                    }
                );
        }

        if ($("filterKategori")) {

            $("filterKategori")
                .addEventListener(
                    "change",
                    terapkanFilter
                );
        }

        if ($("filterBulan")) {

            $("filterBulan")
                .addEventListener(
                    "change",
                    terapkanFilter
                );
        }

        if ($("btnResetFilter")) {

            $("btnResetFilter")
                .addEventListener(
                    "click",
                    resetFilter
                );
        }

        if ($("btnKosongkanFilter")) {

            $("btnKosongkanFilter")
                .addEventListener(
                    "click",
                    resetFilter
                );
        }


        /* --------------------------------------------------------
           TAMBAH
           -------------------------------------------------------- */

        if ($("btnTambahTransaksi")) {

            $("btnTambahTransaksi")
                .addEventListener(
                    "click",
                    bukaFormTambah
                );
        }


        /* --------------------------------------------------------
           JENIS TRANSAKSI
           -------------------------------------------------------- */

        document
            .querySelectorAll(
                'input[name="jenisTransaksi"]'
            )
            .forEach(
                (radio) => {

                    radio.addEventListener(
                        "change",
                        () => {

                            isiKategoriForm();
                            sesuaikanLabelJenis();
                        }
                    );
                }
            );


        /* --------------------------------------------------------
           FORMAT INPUT UANG
           -------------------------------------------------------- */

        [
            "inputTagihan",
            "inputDiterima"
        ]
            .forEach(
                (id) => {

                    const el =
                        $(id);

                    if (!el) {
                        return;
                    }

                    el.addEventListener(
                        "input",
                        () => {

                            el.value =
                                formatTeksUang(
                                    el.value
                                );

                            el.setSelectionRange(
                                el.value.length,
                                el.value.length
                            );

                            hitungUangLive();
                        }
                    );
                }
            );


        /* --------------------------------------------------------
           SUBMIT
           -------------------------------------------------------- */

        const form =
            $("formTransaksi");

        if (form) {

            form.addEventListener(
                "submit",
                simpanTransaksi
            );
        }


        /* --------------------------------------------------------
           AKSI TABEL
           -------------------------------------------------------- */

        const tbody =
            $("isiTabelTransaksi");

        if (tbody) {

            tbody.addEventListener(
                "click",
                (e) => {

                    const tombol =
                        e.target.closest(
                            "button[data-aksi]"
                        );

                    if (!tombol) {
                        return;
                    }

                    const aksi =
                        tombol.dataset.aksi;

                    const id =
                        tombol.dataset.id;

                    if (
                        aksi === "detail"
                    ) {
                        bukaDetail(id);
                    }

                    else if (
                        aksi === "ubah"
                    ) {
                        bukaFormUbah(id);
                    }

                    else if (
                        aksi === "hapus"
                    ) {
                        bukaHapus(id);
                    }
                }
            );
        }


        /* --------------------------------------------------------
           KONFIRMASI HAPUS
           -------------------------------------------------------- */

        if ($("btnKonfirmasiHapus")) {

            $("btnKonfirmasiHapus")
                .addEventListener(
                    "click",
                    jalankanHapus
                );
        }


        /* --------------------------------------------------------
           TOMBOL TUTUP MODAL
           -------------------------------------------------------- */

        document
            .querySelectorAll(
                "[data-tutup-modal]"
            )
            .forEach(
                (tombol) => {

                    tombol.addEventListener(
                        "click",
                        () => {

                            tutupModal(
                                tombol.dataset
                                    .tutupModal
                            );
                        }
                    );
                }
            );


        /* --------------------------------------------------------
           KLIK BACKDROP
           -------------------------------------------------------- */

        document
            .querySelectorAll(
                ".modal-backdrop"
            )
            .forEach(
                (backdrop) => {

                    backdrop.addEventListener(
                        "mousedown",
                        (e) => {

                            if (
                                e.target ===
                                backdrop
                            ) {

                                tutupModal(
                                    backdrop.id
                                );
                            }
                        }
                    );
                }
            );
    };


    /* ============================================================
       INIT
       ============================================================ */

    const init = () => {

        pasangInteraksiUmum();

        pasangEvent();

        isiPilihanKategori();

        terapkanFilter();
    };


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();
    }

})();
