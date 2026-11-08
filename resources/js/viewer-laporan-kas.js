/* ============================================================
   BBCASHVIA - VIEWER LAPORAN KAS
   Laporan kas per bulan dari endpoint /data/transaksi.
   Semua angka berasal dari database,
   tidak ada data dummy.
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       ENDPOINT + STATE
    ============================================================ */

    const API_URL = "/data/transaksi";

    const NAMA_BULAN = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const PETAKAN_KATEGORI = {
        "iuran": "Iuran",
        "kas": "Kas",
        "kebutuhan kelas": "Kebutuhan Kelas",
        "perlengkapan kelas": "Perlengkapan Kelas",
        "kegiatan kelas": "Kegiatan Kelas",
        "pemasukan lainnya": "Pemasukan Lainnya",
        "pengeluaran lainnya": "Pengeluaran Lainnya"
    };

    /* Peta bulan → laporan bulan, disusun ulang setiap muat data. */
    let reports = {};

    /* Kunci bulan terbaru, dipakai sebagai pilihan bawaan. */
    let kunciTerbaru = "";

    /* Filter jenis yang sedang dipilih: all | pemasukan | pengeluaran. */
    let jenisDipilih = "all";


    /* ============================================================
       AKSES API
    ============================================================ */

    const ambilJSON = async (url) => {

        let respons;

        try {

            respons = await fetch(url, {

                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },

                credentials: "same-origin"

            });

        } catch {

            throw new Error("Tidak dapat terhubung ke server.");

        }

        let hasil = {};

        try {
            hasil = await respons.json();
        } catch {
            /* respons bukan JSON */
        }

        if (!respons.ok) {

            throw new Error(
                hasil?.message || "Gagal mengambil data laporan."
            );

        }

        return {
            data: Array.isArray(hasil?.data) ? hasil.data : [],
            ringkasan: hasil?.ringkasan ?? {}
        };

    };


    /* ============================================================
       HELPER
    ============================================================ */

    const escapeHtml = (value) =>
        String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    const labelKategori = (kategori) => {

        const kunci = String(kategori || "").toLowerCase();

        return PETAKAN_KATEGORI[kunci] || (kategori || "-");

    };

    const jenisTransaksi = (nilai) => {

        const arah = String(nilai ?? "").toLowerCase();

        if (arah === "pemasukan" || arah === "masuk" || arah === "m") {
            return "Pemasukan";
        }

        return "Pengeluaran";

    };

    const formatTanggal = (nilai) => {

        const iso = String(nilai ?? "").slice(0, 10);
        const bagian = iso.split("-");

        if (bagian.length !== 3) {
            return iso || "-";
        }

        const tanggal = new Date(
            Number(bagian[0]),
            Number(bagian[1]) - 1,
            Number(bagian[2])
        );

        if (Number.isNaN(tanggal.getTime())) {
            return iso;
        }

        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(tanggal);

    };

    const formatCurrency = (value) => {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(value) || 0);

    };


    /* ============================================================
       ELEMENT (ID PERSIS SEPERTI BLADE)
    ============================================================ */

    const periodFilter =
        document.getElementById("periodFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const reportTableBody =
        document.getElementById("laporanKasTableBody");

    const tableCount =
        document.getElementById("tableCount");

    const emptyState =
        document.getElementById("emptyState");

    const rumusPemasukanEl =
        document.getElementById("rumusPemasukan");

    const rumusPengeluaranEl =
        document.getElementById("rumusPengeluaran");

    const rumusSaldoEl =
        document.getElementById("rumusSaldo");


    /* ============================================================
       KELOMPOKKAN TRANSAKSI PER BULAN (DARI DATABASE)
       Satu no_bukti yang mencakup beberapa iuran tampil sebagai
       SATU transaksi utama (nominal = nominal_grup).
    ============================================================ */

    const kelompokkanPerBulan = (baris) => {

        const peta = {};

        baris.forEach((t) => {

            const iso = String(t.tanggal ?? "").slice(0, 10);
            const bagian = iso.split("-");

            if (bagian.length !== 3 || !bagian[0]) {
                return;
            }

            const tahun = Number(bagian[0]);
            const bulan = Number(bagian[1]);

            if (!tahun || bulan < 1 || bulan > 12) {
                return;
            }

            const kunci = `${bagian[0]}-${bagian[1]}`;

            if (!peta[kunci]) {

                peta[kunci] = {
                    kunci,
                    tahun,
                    bulan,
                    period: `${NAMA_BULAN[bulan - 1]} ${tahun}`,
                    openingBalance: 0,
                    totalMasuk: 0,
                    totalKeluar: 0,
                    transactions: []
                };

            }

            const noBukti = String(
                t.no_bukti || ("TRX-" + (t.id_transaksi ?? ""))
            );

            /* Satu no_bukti satu baris utama per bulan. */
            if (peta[kunci].transactions.some(trx => trx.bukti === noBukti)) {
                return;
            }

            const jenis = jenisTransaksi(t.jenis);

            const nominal =
                Number(t.nominal_grup ?? t.nominal) || 0;

            peta[kunci].transactions.push({
                bukti: noBukti,
                tanggal: formatTanggal(t.tanggal),
                sortKey: new Date(
                    tahun, bulan - 1, Number(bagian[2]) || 1
                ).getTime(),
                jenis,
                category: labelKategori(t.kategori),
                description: t.keterangan || "-",
                amount: nominal,
                jumlahRincian: Number(t.jumlah_rincian) || 1
            });

            if (jenis === "Pemasukan") {
                peta[kunci].totalMasuk += nominal;
            } else {
                peta[kunci].totalKeluar += nominal;
            }

        });

        /* Urutkan transaksi tiap bulan dari tua ke baru. */
        Object.values(peta).forEach((report) => {

            report.transactions.sort(
                (a, b) => a.sortKey - b.sortKey
            );

        });

        return peta;

    };


    /* Saldo akhir tiap bulan dihitung dari data:
       Saldo akhir = pemasukan - pengeluaran. */
    const hitungSaldoBulanan = () => {

        const kunciUrut = Object.keys(reports).sort((a, b) => {

            if (a === b) return 0;

            return a < b ? -1 : 1;   /* "2026-09" < "2026-10" */

        });

        let saldoBerjalan = 0;

        kunciUrut.forEach((kunci) => {

            const report = reports[kunci];

            report.openingBalance = saldoBerjalan;

            saldoBerjalan =
                saldoBerjalan +
                report.totalMasuk -
                report.totalKeluar;

            report.closingBalance = saldoBerjalan;

        });

        return kunciUrut;

    };


    /* ============================================================
       RINGKASAN PERIODE (RUMUS KAS)
    ============================================================ */

    const isiRingkasan = (report) => {

        if (rumusPemasukanEl) {
            rumusPemasukanEl.textContent =
                formatCurrency(report?.totalMasuk ?? 0);
        }

        if (rumusPengeluaranEl) {
            rumusPengeluaranEl.textContent =
                formatCurrency(report?.totalKeluar ?? 0);
        }

        if (rumusSaldoEl) {
            rumusSaldoEl.textContent =
                formatCurrency(report?.closingBalance ?? 0);
        }

    };


    /* ============================================================
       TABEL LAPORAN - KOLOM: NO | TANGGAL | JENIS | KATEGORI |
       KETERANGAN | NOMINAL (sesuai struktur tabel halaman)
    ============================================================ */

    const renderTable = (transactions) => {

        if (!reportTableBody) {
            return;
        }

        reportTableBody.innerHTML = "";


        if (transactions.length === 0) {

            emptyState?.classList.add("show");

            if (tableCount) {
                tableCount.textContent = "0";
            }

            return;

        }

        emptyState?.classList.remove("show");


        transactions.forEach((item, index) => {

            const masuk = item.jenis === "Pemasukan";

            const typeClass = masuk ? "success" : "danger";

            const prefix = masuk ? "+" : "-";

            const rincianTeks = item.jumlahRincian > 1
                ? ` • ${item.jumlahRincian} iuran`
                : "";

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    ${index + 1}
                </td>

                <td>
                    <span class="mono-text">
                        ${escapeHtml(item.tanggal)}
                    </span>
                </td>

                <td>
                    <span class="status-pill ${typeClass}">
                        <span class="status-dot"></span>
                        ${item.jenis}
                    </span>
                </td>

                <td>
                    ${escapeHtml(item.category)}
                </td>

                <td>
                    <span>
                        ${escapeHtml(item.description)}
                    </span>

                    <div class="mono-text">
                        ${escapeHtml(item.bukti)}${rincianTeks}
                    </div>
                </td>

                <td>
                    <strong class="nominal">
                        ${prefix}${formatCurrency(item.amount)}
                    </strong>
                </td>
            `;

            reportTableBody.appendChild(row);

        });

        if (tableCount) {
            tableCount.textContent = transactions.length;
        }

    };


    /* ============================================================
       PERIODE FILTER - PILIHAN DARI DATA NYATA (TANPA "SEMUA")
    ============================================================ */

    const isiPilihanPeriode = () => {

        if (!periodFilter) {
            return;
        }

        const urutDariTerbaru = Object.values(reports)
            .sort((a, b) =>
                (a.kunci < b.kunci ? 1 : -1));

        periodFilter.innerHTML = urutDariTerbaru
            .map((report) => `
                <option value="${escapeHtml(report.kunci)}">
                    ${escapeHtml(report.period)}
                </option>
            `)
            .join("");

        if (urutDariTerbaru.length > 0) {
            kunciTerbaru = urutDariTerbaru[0].kunci;
        }

        periodFilter.value = kunciTerbaru;

    };


    const tampilkanPeriodeDipilih = () => {

        /*
         * Nilai kosong diperlakukan setara pilihan "all" (regesi
         * FilterLaporanKasTest) - bukan filter yang membuang seluruh
         * tampilan: tanpa periode terpilih, pakai periode terbarunya
         * bila data tersedia.
         */
        const kunciDipilih = periodFilter?.value || "all";

        const report =
            kunciDipilih === "all"
                ? (reports[kunciTerbaru] ?? null)
                : (reports[kunciDipilih] ?? null);

        /* Ringkasan selalu memakai seluruh transaksi bulan itu. */
        isiRingkasan(report);

        /* Tabel mengikuti filter jenis yang dipilih. */
        const jenisDasar = jenisDipilih;

        const baris = (report?.transactions ?? [])
            .filter(item =>
                jenisDasar === "all" ||
                item.jenis.toLowerCase() === jenisDasar
            );

        renderTable(baris);

    };

    periodFilter?.addEventListener("change", tampilkanPeriodeDipilih);

    statusFilter?.addEventListener("change", () => {

        jenisDipilih = statusFilter.value || "all";

        tampilkanPeriodeDipilih();

    });


    /* ============================================================
       PROFILE DROPDOWN
    ============================================================ */

    const profileButton =
        document.getElementById("profileButton");

    const profileWrapper =
        document.querySelector(".profile-wrapper");

    const profileDropdown =
        document.getElementById("profileDropdown");

    if (profileButton && profileWrapper && profileDropdown) {

        profileButton.addEventListener("click", (event) => {

            event.stopPropagation();

            profileWrapper.classList.toggle("open");

        });

        profileDropdown.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        document.addEventListener("click", () => {
            profileWrapper.classList.remove("open");
        });

    }


    /* ============================================================
       MOBILE SIDEBAR
    ============================================================ */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.querySelectorAll(".nav-link");

    const openSidebar = () => {

        sidebar?.classList.add("open");

        sidebarBackdrop?.classList.add("show");

        document.body.classList.add("nav-open");

    };

    const closeSidebar = () => {

        sidebar?.classList.remove("open");

        sidebarBackdrop?.classList.remove("show");

        document.body.classList.remove("nav-open");

    };

    menuToggle?.addEventListener("click", (event) => {

        event.stopPropagation();

        const terbuka = sidebar?.classList.contains("open");

        if (terbuka) {
            closeSidebar();
        } else {
            openSidebar();
        }

    });

    sidebarBackdrop?.addEventListener("click", closeSidebar);

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 900) {
                closeSidebar();
            }

        });

    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeSidebar();

            profileWrapper?.classList.remove("open");

        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeSidebar();
        }

    });


    /* ============================================================
       MUAT DATA DARI DATABASE
    ============================================================ */

    const muatData = async () => {

        let baris = [];

        try {

            const hasil = await ambilJSON(API_URL);

            baris = hasil.data;

        } catch (err) {

            console.error("Gagal memuat laporan kas:", err);

        }

        reports = kelompokkanPerBulan(baris);

        hitungSaldoBulanan();

        isiPilihanPeriode();

        tampilkanPeriodeDipilih();

    };

    muatData();

});
