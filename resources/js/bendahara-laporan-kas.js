document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       BBCASHVIA — BENDAHARA LAPORAN KAS
       KHUSUS KELAS XI RPL 1
    ========================================================= */


    /* =========================================================
       KONFIGURASI
    ========================================================= */

    const KELAS_BENDAHARA = "XI RPL 1";

    const SALDO_AWAL = 1250000;


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


    const BULAN_ID = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];


    /* =========================================================
       DATA DEMO
       HANYA XI RPL 1
    ========================================================= */

    const DATA_TRANSAKSI = [

        {
            id: "TRX-001",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Iuran kelas September",
            kelas: "XI RPL 1",
            tanggal: "2026-09-01",
            waktu: "07:30",
            nominal: 450000,
            metode: "Tunai"
        },

        {
            id: "TRX-002",
            jenis: "masuk",
            kategori: "Kas",
            keterangan: "Kas kelas mingguan",
            kelas: "XI RPL 1",
            tanggal: "2026-09-05",
            waktu: "08:10",
            nominal: 150000,
            metode: "Tunai"
        },

        {
            id: "TRX-003",
            jenis: "keluar",
            kategori: "Perlengkapan kelas",
            keterangan: "Pembelian spidol dan penghapus papan",
            kelas: "XI RPL 1",
            tanggal: "2026-09-07",
            waktu: "13:20",
            nominal: 85000,
            metode: "Tunai"
        },

        {
            id: "TRX-004",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Iuran kelas September",
            kelas: "XI RPL 1",
            tanggal: "2026-09-10",
            waktu: "07:25",
            nominal: 375000,
            metode: "Transfer"
        },

        {
            id: "TRX-005",
            jenis: "keluar",
            kategori: "Kebutuhan kelas",
            keterangan: "Pembelian air minum kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-09-12",
            waktu: "10:15",
            nominal: 65000,
            metode: "Tunai"
        },

        {
            id: "TRX-006",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Iuran kelas September",
            kelas: "XI RPL 1",
            tanggal: "2026-09-15",
            waktu: "07:40",
            nominal: 525000,
            metode: "Transfer"
        },

        {
            id: "TRX-007",
            jenis: "keluar",
            kategori: "Kegiatan kelas",
            keterangan: "Kebutuhan kegiatan kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-09-18",
            waktu: "11:30",
            nominal: 175000,
            metode: "Transfer"
        },

        {
            id: "TRX-008",
            jenis: "masuk",
            kategori: "Kas",
            keterangan: "Tambahan kas kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-09-20",
            waktu: "08:00",
            nominal: 200000,
            metode: "Tunai"
        },

        {
            id: "TRX-009",
            jenis: "keluar",
            kategori: "Perlengkapan kelas",
            keterangan: "Pembelian alat kebersihan",
            kelas: "XI RPL 1",
            tanggal: "2026-09-22",
            waktu: "14:00",
            nominal: 90000,
            metode: "Tunai"
        },

        {
            id: "TRX-010",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Iuran kelas September",
            kelas: "XI RPL 1",
            tanggal: "2026-09-25",
            waktu: "07:35",
            nominal: 425000,
            metode: "Transfer"
        },


        {
            id: "TRX-011",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Iuran kelas Oktober",
            kelas: "XI RPL 1",
            tanggal: "2026-10-01",
            waktu: "07:20",
            nominal: 500000,
            metode: "Transfer"
        },

        {
            id: "TRX-012",
            jenis: "masuk",
            kategori: "Kas",
            keterangan: "Kas kelas mingguan",
            kelas: "XI RPL 1",
            tanggal: "2026-10-03",
            waktu: "08:05",
            nominal: 175000,
            metode: "Tunai"
        },

        {
            id: "TRX-013",
            jenis: "keluar",
            kategori: "Kebutuhan kelas",
            keterangan: "Pembelian konsumsi rapat kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-10-04",
            waktu: "12:10",
            nominal: 120000,
            metode: "Tunai"
        },

        {
            id: "TRX-014",
            jenis: "masuk",
            kategori: "Iuran",
            keterangan: "Iuran kelas Oktober",
            kelas: "XI RPL 1",
            tanggal: "2026-10-06",
            waktu: "07:45",
            nominal: 450000,
            metode: "Transfer"
        },

        {
            id: "TRX-015",
            jenis: "keluar",
            kategori: "Kegiatan kelas",
            keterangan: "Kebutuhan kegiatan kelas",
            kelas: "XI RPL 1",
            tanggal: "2026-10-08",
            waktu: "10:30",
            nominal: 150000,
            metode: "Transfer"
        },

        {
            id: "TRX-016",
            jenis: "masuk",
            kategori: "Pemasukan lainnya",
            keterangan: "Pengembalian dana kegiatan",
            kelas: "XI RPL 1",
            tanggal: "2026-10-10",
            waktu: "09:15",
            nominal: 100000,
            metode: "Transfer"
        },

        {
            id: "TRX-017",
            jenis: "keluar",
            kategori: "Perlengkapan kelas",
            keterangan: "Pembelian kertas dan tinta",
            kelas: "XI RPL 1",
            tanggal: "2026-10-12",
            waktu: "13:40",
            nominal: 110000,
            metode: "Tunai"
        }

    ];


    /* =========================================================
       ELEMENT
    ========================================================= */

    const $ = (selector) =>
        document.querySelector(selector);


    const sidebar = $("#sidebar");
    const sidebarBackdrop = $("#sidebarBackdrop");
    const btnSidebar = $("#btnSidebar");


    const profileButton = $("#profileButton");
    const profileDropdown = $("#profileDropdown");


    const filterMulai = $("#filterMulai");
    const filterSelesai = $("#filterSelesai");
    const filterBulan = $("#filterBulan");
    const filterTahun = $("#filterTahun");
    const filterJenis = $("#filterJenis");
    const filterKategori = $("#filterKategori");


    const btnResetFilter = $("#btnResetFilter");
    const btnKosongkanFilter = $("#btnKosongkanFilter");


    const sumMasuk = $("#sumMasuk");
    const sumKeluar = $("#sumKeluar");
    const sumSaldo = $("#sumSaldo");
    const sumJumlah = $("#sumJumlah");


    const sumMasukNote = $("#sumMasukNote");
    const sumKeluarNote = $("#sumKeluarNote");
    const sumSaldoNote = $("#sumSaldoNote");
    const sumJumlahNote = $("#sumJumlahNote");


    const isiTabelLaporan = $("#isiTabelLaporan");
    const footTabelLaporan = $("#footTabelLaporan");
    const emptyState = $("#emptyState");
    const tabelInfo = $("#tabelInfo");


    const barChart = $("#barChart");
    const chartColumns = $("#chartColumns");
    const chartYLabels = $("#chartYLabels");
    const grafikKosong = $("#grafikKosong");


    const btnCetak = $("#btnCetak");
    const btnEkspor = $("#btnEkspor");


    const printPeriode = $("#printPeriode");


    const toast = $("#toast");
    const toastText = $("#toastText");
    const toastIcon = $("#toastIcon");


    let hasilFilter = [];


    /* =========================================================
       FORMAT
    ========================================================= */

    function formatRupiah(value) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }
        ).format(value || 0);

    }


    function formatRupiahSingkat(value) {

        const number = Math.abs(value || 0);

        if (number >= 1000000) {

            return (
                "Rp " +
                (number / 1000000)
                    .toFixed(number % 1000000 === 0 ? 0 : 1)
                    .replace(".", ",") +
                " jt"
            );

        }

        if (number >= 1000) {

            return (
                "Rp " +
                (number / 1000)
                    .toFixed(number % 1000 === 0 ? 0 : 1)
                    .replace(".", ",") +
                " rb"
            );

        }

        return formatRupiah(number);
    }


    function formatTanggal(dateString) {

        if (!dateString) {
            return "-";
        }

        const date = new Date(
            `${dateString}T00:00:00`
        );

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    function namaBulan(index) {

        return BULAN_ID[index] || "";

    }


    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================================
       TOAST
    ========================================================= */

    function showToast(
        message,
        type = "success"
    ) {

        if (!toast) {
            return;
        }

        toastText.textContent = message;


        if (type === "error") {

            toastIcon.textContent = "error";

            toast.classList.add("toast--error");

        } else {

            toastIcon.textContent = "check_circle";

            toast.classList.remove("toast--error");

        }


        toast.classList.add("is-show");


        clearTimeout(
            showToast.timeout
        );


        showToast.timeout = setTimeout(() => {

            toast.classList.remove("is-show");

        }, 2500);

    }


    /* =========================================================
       SIDEBAR
    ========================================================= */

    function openSidebar() {

        document.body.classList.add("nav-open");

    }


    function closeSidebar() {

        document.body.classList.remove("nav-open");

    }


    if (btnSidebar) {

        btnSidebar.addEventListener(
            "click",
            () => {

                if (
                    document.body.classList.contains(
                        "nav-open"
                    )
                ) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

            }
        );

    }


    if (sidebarBackdrop) {

        sidebarBackdrop.addEventListener(
            "click",
            closeSidebar
        );

    }


    document
        .querySelectorAll(".side-link")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 1024
                    ) {

                        closeSidebar();

                    }

                }
            );

        });


    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth >= 1025) {

                closeSidebar();

            }

        }
    );


    /* =========================================================
       PROFILE DROPDOWN
    ========================================================= */

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const isOpen =
                    profileDropdown.classList.toggle(
                        "is-open"
                    );

                profileButton.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

            }
        );

    }


    document.addEventListener(
        "click",
        (event) => {

            if (
                profileDropdown &&
                profileButton &&
                !profileDropdown.contains(event.target) &&
                !profileButton.contains(event.target)
            ) {

                profileDropdown.classList.remove(
                    "is-open"
                );

                profileButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* =========================================================
       KATEGORI FILTER
    ========================================================= */

    function populateKategoriFilter() {

        if (!filterKategori) {
            return;
        }

        const jenis =
            filterJenis.value;


        let kategori = [];


        if (jenis === "masuk") {

            kategori = [
                ...KATEGORI_MASUK
            ];

        } else if (jenis === "keluar") {

            kategori = [
                ...KATEGORI_KELUAR
            ];

        } else {

            kategori = [
                ...new Set([
                    ...KATEGORI_MASUK,
                    ...KATEGORI_KELUAR
                ])
            ];

        }


        filterKategori.innerHTML = `
            <option value="">
                Semua Kategori
            </option>
        `;


        kategori.forEach((item) => {

            const option =
                document.createElement("option");

            option.value = item;
            option.textContent = item;

            filterKategori.appendChild(
                option
            );

        });

    }


    /* =========================================================
       BULAN & TAHUN
    ========================================================= */

    function populateTanggalFilter() {

        if (filterBulan) {

            filterBulan.innerHTML = `
                <option value="">
                    Semua Bulan
                </option>
            `;

            for (
                let index = 0;
                index < 12;
                index++
            ) {

                const option =
                    document.createElement("option");

                option.value =
                    String(index + 1).padStart(
                        2,
                        "0"
                    );

                option.textContent =
                    namaBulan(index);

                filterBulan.appendChild(
                    option
                );

            }

        }


        if (filterTahun) {

            const years =
                [
                    ...new Set(
                        DATA_TRANSAKSI.map(
                            (item) =>
                                item.tanggal.substring(
                                    0,
                                    4
                                )
                        )
                    )
                ]
                .sort();


            filterTahun.innerHTML = `
                <option value="">
                    Semua Tahun
                </option>
            `;


            years.forEach((year) => {

                const option =
                    document.createElement("option");

                option.value = year;
                option.textContent = year;

                filterTahun.appendChild(
                    option
                );

            });

        }

    }


    /* =========================================================
       FILTER
    ========================================================= */

    function applyFilter() {

        const mulai =
            filterMulai.value;

        const selesai =
            filterSelesai.value;

        const bulan =
            filterBulan.value;

        const tahun =
            filterTahun.value;

        const jenis =
            filterJenis.value;

        const kategori =
            filterKategori.value;


        hasilFilter =
            DATA_TRANSAKSI
                .filter(
                    (item) =>
                        item.kelas ===
                        KELAS_BENDAHARA
                )
                .filter((item) => {

                    if (
                        mulai &&
                        item.tanggal < mulai
                    ) {

                        return false;

                    }

                    if (
                        selesai &&
                        item.tanggal > selesai
                    ) {

                        return false;

                    }

                    if (
                        bulan &&
                        item.tanggal.substring(
                            5,
                            7
                        ) !== bulan
                    ) {

                        return false;

                    }

                    if (
                        tahun &&
                        item.tanggal.substring(
                            0,
                            4
                        ) !== tahun
                    ) {

                        return false;

                    }

                    if (
                        jenis &&
                        item.jenis !== jenis
                    ) {

                        return false;

                    }

                    if (
                        kategori &&
                        item.kategori !== kategori
                    ) {

                        return false;

                    }

                    return true;

                })
                .sort(
                    (a, b) =>
                        `${a.tanggal} ${a.waktu}`
                            .localeCompare(
                                `${b.tanggal} ${b.waktu}`
                            )
                );


        renderSummary();
        renderChart();
        renderTable();
        updatePrintPeriode();

    }


    /* =========================================================
       SUMMARY
    ========================================================= */

    function renderSummary() {

        const totalMasuk =
            hasilFilter
                .filter(
                    (item) =>
                        item.jenis === "masuk"
                )
                .reduce(
                    (total, item) =>
                        total + item.nominal,
                    0
                );


        const totalKeluar =
            hasilFilter
                .filter(
                    (item) =>
                        item.jenis === "keluar"
                )
                .reduce(
                    (total, item) =>
                        total + item.nominal,
                    0
                );


        const saldo =
            SALDO_AWAL +
            totalMasuk -
            totalKeluar;


        const jumlah =
            hasilFilter.length;


        sumMasuk.textContent =
            formatRupiah(totalMasuk);


        sumKeluar.textContent =
            formatRupiah(totalKeluar);


        sumSaldo.textContent =
            formatRupiah(saldo);


        sumJumlah.textContent =
            jumlah;


        sumMasukNote.textContent =
            `${hasilFilter.filter(
                (item) => item.jenis === "masuk"
            ).length} transaksi pemasukan`;


        sumKeluarNote.textContent =
            `${hasilFilter.filter(
                (item) => item.jenis === "keluar"
            ).length} transaksi pengeluaran`;


        sumSaldoNote.textContent =
            `Saldo awal ${formatRupiah(SALDO_AWAL)}`;


        sumJumlahNote.textContent =
            `Transaksi kelas ${KELAS_BENDAHARA}`;

    }


    /* =========================================================
       CHART
    ========================================================= */

    function renderChart() {

        chartColumns.innerHTML = "";
        chartYLabels.innerHTML = "";


        if (!hasilFilter.length) {

            barChart.classList.add(
                "is-hidden"
            );

            grafikKosong.classList.add(
                "is-show"
            );

            return;

        }


        barChart.classList.remove(
            "is-hidden"
        );

        grafikKosong.classList.remove(
            "is-show"
        );


        const grouped = {};


        hasilFilter.forEach((item) => {

            const key =
                item.tanggal.substring(
                    0,
                    7
                );


            if (!grouped[key]) {

                grouped[key] = {
                    masuk: 0,
                    keluar: 0
                };

            }


            if (item.jenis === "masuk") {

                grouped[key].masuk +=
                    item.nominal;

            } else {

                grouped[key].keluar +=
                    item.nominal;

            }

        });


        const keys =
            Object.keys(grouped)
                .sort();


        const maxValue =
            Math.max(
                ...keys.flatMap(
                    (key) => [
                        grouped[key].masuk,
                        grouped[key].keluar
                    ]
                ),
                1
            );


        const roundedMax =
            Math.ceil(
                maxValue /
                100000
            ) *
            100000;


        const steps = 4;


        for (
            let index = steps;
            index >= 0;
            index--
        ) {

            const label =
                roundedMax *
                (index / steps);


            const item =
                document.createElement(
                    "span"
                );

            item.textContent =
                formatRupiahSingkat(
                    label
                );

            chartYLabels.appendChild(
                item
            );

        }


        keys.forEach((key) => {

            const data =
                grouped[key];


            const column =
                document.createElement(
                    "div"
                );

            column.className =
                "barchart__col";


            const pair =
                document.createElement(
                    "div"
                );

            pair.className =
                "barchart__pair";


            const masukBar =
                createChartBar(
                    data.masuk,
                    roundedMax,
                    "in",
                    "Pemasukan"
                );


            const keluarBar =
                createChartBar(
                    data.keluar,
                    roundedMax,
                    "out",
                    "Pengeluaran"
                );


            const month =
                document.createElement(
                    "span"
                );

            month.className =
                "barchart__mon";


            const monthIndex =
                Number(
                    key.substring(
                        5,
                        7
                    )
                ) - 1;


            month.textContent =
                `${BULAN_ID[monthIndex].substring(
                    0,
                    3
                )} ${key.substring(
                    0,
                    4
                )}`;


            pair.appendChild(
                masukBar
            );

            pair.appendChild(
                keluarBar
            );


            column.appendChild(
                pair
            );

            column.appendChild(
                month
            );


            chartColumns.appendChild(
                column
            );

        });

    }


    function createChartBar(
        value,
        maxValue,
        type,
        label
    ) {

        const bar =
            document.createElement(
                "div"
            );


        bar.className =
            `barchart__bar barchart__bar--${type}`;


        const height =
            value > 0
                ? Math.max(
                    4,
                    (value / maxValue) * 100
                )
                : 2;


        bar.style.height =
            `${height}%`;


        const tip =
            document.createElement(
                "span"
            );


        tip.className =
            "barchart__tip";


        tip.textContent =
            `${label}: ${formatRupiah(value)}`;


        bar.appendChild(
            tip
        );


        return bar;

    }


    /* =========================================================
       TABLE
    ========================================================= */

    function renderTable() {

        isiTabelLaporan.innerHTML = "";
        footTabelLaporan.innerHTML = "";


        if (!hasilFilter.length) {

            emptyState.classList.add(
                "is-show"
            );

            tabelInfo.textContent =
                "Menampilkan 0 transaksi";

            return;

        }


        emptyState.classList.remove(
            "is-show"
        );


        /*
         * Saldo berjalan dimulai dari saldo awal.
         */
        let saldoBerjalan =
            SALDO_AWAL;


        let totalMasuk = 0;
        let totalKeluar = 0;


        hasilFilter.forEach((item) => {

            if (item.jenis === "masuk") {

                saldoBerjalan +=
                    item.nominal;

                totalMasuk +=
                    item.nominal;

            } else {

                saldoBerjalan -=
                    item.nominal;

                totalKeluar +=
                    item.nominal;

            }


            const row =
                document.createElement(
                    "tr"
                );


            const nominalMasuk =
                item.jenis === "masuk"
                    ? formatRupiah(
                        item.nominal
                    )
                    : "-";


            const nominalKeluar =
                item.jenis === "keluar"
                    ? formatRupiah(
                        item.nominal
                    )
                    : "-";


            row.innerHTML = `

                <td>

                    <div class="table-date">

                        <strong>
                            ${escapeHtml(
                                formatTanggal(
                                    item.tanggal
                                )
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                item.waktu
                            )}
                        </span>

                    </div>

                </td>


                <td>

                    <div class="table-description">

                        <strong>
                            ${escapeHtml(
                                item.keterangan
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                item.id
                            )}
                        </span>

                    </div>

                </td>


                <td>

                    <span
                        class="
                            category-chip
                            category-chip--${item.jenis}
                        "
                    >
                        ${escapeHtml(
                            item.kategori
                        )}
                    </span>

                </td>


                <td>

                    <span class="money money--in">
                        ${nominalMasuk}
                    </span>

                </td>


                <td>

                    <span class="money money--out">
                        ${nominalKeluar}
                    </span>

                </td>


                <td>

                    <span class="balance">
                        ${formatRupiah(
                            saldoBerjalan
                        )}
                    </span>

                </td>

            `;


            isiTabelLaporan.appendChild(
                row
            );

        });


        const finalSaldo =
            SALDO_AWAL +
            totalMasuk -
            totalKeluar;


        footTabelLaporan.innerHTML = `

            <tr class="table-total">

                <td colspan="3">

                    Total

                </td>

                <td>

                    <strong class="money money--in">
                        ${formatRupiah(
                            totalMasuk
                        )}
                    </strong>

                </td>

                <td>

                    <strong class="money money--out">
                        ${formatRupiah(
                            totalKeluar
                        )}
                    </strong>

                </td>

                <td>

                    <strong class="balance">
                        ${formatRupiah(
                            finalSaldo
                        )}
                    </strong>

                </td>

            </tr>

        `;


        tabelInfo.textContent =
            `Menampilkan ${hasilFilter.length} transaksi kelas ${KELAS_BENDAHARA}`;

    }


    /* =========================================================
       PRINT PERIOD
    ========================================================= */

    function updatePrintPeriode() {

        const mulai =
            filterMulai.value;

        const selesai =
            filterSelesai.value;

        const bulan =
            filterBulan.value;

        const tahun =
            filterTahun.value;


        let periode =
            "Semua periode";


        if (
            mulai &&
            selesai
        ) {

            periode =
                `${formatTanggal(
                    mulai
                )} — ${formatTanggal(
                    selesai
                )}`;

        } else if (mulai) {

            periode =
                `Mulai ${formatTanggal(
                    mulai
                )}`;

        } else if (selesai) {

            periode =
                `Sampai ${formatTanggal(
                    selesai
                )}`;

        } else if (
            bulan &&
            tahun
        ) {

            periode =
                `${BULAN_ID[
                    Number(bulan) - 1
                ]} ${tahun}`;

        } else if (bulan) {

            periode =
                `Bulan ${BULAN_ID[
                    Number(bulan) - 1
                ]}`;

        } else if (tahun) {

            periode =
                `Tahun ${tahun}`;

        }


        printPeriode.textContent =
            `${periode} • ${KELAS_BENDAHARA}`;

    }


    /* =========================================================
       RESET
    ========================================================= */

    function resetFilter() {

        filterMulai.value = "";
        filterSelesai.value = "";
        filterBulan.value = "";
        filterTahun.value = "";
        filterJenis.value = "";


        populateKategoriFilter();


        applyFilter();


        showToast(
            "Filter laporan telah direset."
        );

    }


    /* =========================================================
       EXPORT CSV
    ========================================================= */

    function exportCSV() {

        if (!hasilFilter.length) {

            showToast(
                "Tidak ada data untuk diekspor.",
                "error"
            );

            return;

        }


        let saldoBerjalan =
            SALDO_AWAL;


        const rows = [];


        rows.push([
            "Tanggal",
            "ID Transaksi",
            "Keterangan",
            "Kelas",
            "Kategori",
            "Jenis",
            "Pemasukan",
            "Pengeluaran",
            "Saldo"
        ]);


        hasilFilter.forEach((item) => {

            if (item.jenis === "masuk") {

                saldoBerjalan +=
                    item.nominal;

            } else {

                saldoBerjalan -=
                    item.nominal;

            }


            rows.push([
                item.tanggal,
                item.id,
                item.keterangan,
                item.kelas,
                item.kategori,
                item.jenis === "masuk"
                    ? "Pemasukan"
                    : "Pengeluaran",
                item.jenis === "masuk"
                    ? item.nominal
                    : 0,
                item.jenis === "keluar"
                    ? item.nominal
                    : 0,
                saldoBerjalan
            ]);

        });


        const csv =
            rows
                .map(
                    (row) =>
                        row
                            .map(
                                (value) => {

                                    const text =
                                        String(
                                            value ?? ""
                                        );

                                    return `"${text.replace(
                                        /"/g,
                                        '""'
                                    )}"`;

                                }
                            )
                            .join(";")
                )
                .join("\n");


        const blob =
            new Blob(
                [
                    "\uFEFF" +
                    csv
                ],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        const today =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );


        link.href = url;

        link.download =
            `laporan-kas-${KELAS_BENDAHARA
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                )}-${today}.csv`;


        document.body.appendChild(
            link
        );

        link.click();

        link.remove();


        URL.revokeObjectURL(
            url
        );


        showToast(
            "Laporan berhasil diekspor."
        );

    }


    /* =========================================================
       PRINT
    ========================================================= */

    if (btnCetak) {

        btnCetak.addEventListener(
            "click",
            () => {

                if (!hasilFilter.length) {

                    showToast(
                        "Tidak ada data untuk dicetak.",
                        "error"
                    );

                    return;

                }


                window.print();

            }
        );

    }


    /* =========================================================
       EXPORT
    ========================================================= */

    if (btnEkspor) {

        btnEkspor.addEventListener(
            "click",
            exportCSV
        );

    }


    /* =========================================================
       FILTER EVENTS
    ========================================================= */

    if (filterJenis) {

        filterJenis.addEventListener(
            "change",
            () => {

                populateKategoriFilter();

                applyFilter();

            }
        );

    }


    [
        filterMulai,
        filterSelesai,
        filterBulan,
        filterTahun,
        filterKategori
    ]
        .forEach((element) => {

            if (!element) {
                return;
            }

            element.addEventListener(
                "change",
                applyFilter
            );

        });


    if (btnResetFilter) {

        btnResetFilter.addEventListener(
            "click",
            resetFilter
        );

    }


    if (btnKosongkanFilter) {

        btnKosongkanFilter.addEventListener(
            "click",
            resetFilter
        );

    }


    /* =========================================================
       LOGOUT
    ========================================================= */

    function logout() {

        /*
         * Untuk prototype frontend,
         * logout diarahkan kembali ke login.
         *
         * Backend Laravel nantinya dapat menggantikan
         * bagian ini dengan route logout sebenarnya.
         */

        window.location.href = "/";

    }


    const btnSidebarLogout =
        $("#btnSidebarLogout");


    const btnProfileLogout =
        $("#btnProfileLogout");


    if (btnSidebarLogout) {

        btnSidebarLogout.addEventListener(
            "click",
            logout
        );

    }


    if (btnProfileLogout) {

        btnProfileLogout.addEventListener(
            "click",
            logout
        );

    }


    /* =========================================================
       PROFILE ACCOUNT
    ========================================================= */

    const btnProfileAccount =
        $("#btnProfileAccount");


    if (btnProfileAccount) {

        btnProfileAccount.addEventListener(
            "click",
            () => {

                showToast(
                    "Profil Bendahara."
                );

            }
        );

    }


    /* =========================================================
       INIT
    ========================================================= */

    populateTanggalFilter();

    populateKategoriFilter();

    applyFilter();

});
