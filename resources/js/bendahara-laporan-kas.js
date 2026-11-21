document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       BBCASHVIA - BENDAHARA LAPORAN KAS
       DATA TRANSAKSI BERDASARKAN KELAS YANG LOGIN
    ========================================================= */


    /* =========================================================
       KONFIGURASI
    ========================================================= */

    /*
     * Hanya dipakai sebagai teks tampilan.
     * Pembatasan data per kelas dilakukan server-side oleh
     * endpoint /bendahara/api/transaksi (trait MembatasiKelas).
     */
    const KELAS_BENDAHARA =
        document.body.dataset.kelasLabel ||
        "Kelas Saya";


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
       DATA TRANSAKSI
       SUMBER: /bendahara/api/transaksi (DATABASE)
    ========================================================= */

    let DATA_TRANSAKSI = [];


    async function muatDataDariServer() {

        try {

            const response = await fetch(
                "/bendahara/api/transaksi",
                {
                    headers: {
                        Accept: "application/json"
                    },
                    credentials: "same-origin"
                }
            );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const payload =
                await response.json();

            if (
                !payload.success ||
                !Array.isArray(payload.data)
            ) {
                throw new Error(
                    payload.message ||
                    "Respons transaksi tidak valid"
                );
            }


            /*
             * Satu pembayaran dengan beberapa cicilan iuran
             * muncul sebagai beberapa baris dengan no_bukti
             * yang sama. Ambil satu baris per no_bukti dan
             * pakai nominal_grup agar nominal tidak terpotong.
             */
            const dilihat = new Set();

            DATA_TRANSAKSI =
                payload.data
                    .filter((row) => {

                        const kunci =
                            row.no_bukti ||
                            `id:${row.id_transaksi}`;

                        if (
                            !kunci ||
                            dilihat.has(kunci)
                        ) {
                            return false;
                        }

                        dilihat.add(kunci);

                        return true;

                    })
                    .map((row) => {

                        const jenisApi =
                            String(
                                row.jenis || ""
                            )
                                .trim()
                                .toLowerCase();

                        const jenis =
                            [
                                "pengeluaran",
                                "keluar",
                                "k"
                            ].includes(jenisApi)
                                ? "keluar"
                                : "masuk";

                        const createdAt =
                            String(
                                row.created_at || ""
                            );

                        const nominal =
                            Number(
                                row.nominal_grup ??
                                row.nominal ??
                                0
                            ) || 0;

                        return {
                            id:
                                row.no_bukti ||
                                String(
                                    row.id_transaksi ??
                                    "-"
                                ),
                            jenis,
                            kategori:
                                row.kategori ||
                                "-",
                            keterangan:
                                row.keterangan ||
                                row.kategori ||
                                "-",
                            kelas:
                                row.nama_kelas ||
                                "",
                            tanggal:
                                String(
                                    row.tanggal ||
                                    createdAt
                                ).substring(
                                    0,
                                    10
                                ),
                            waktu:
                                createdAt.substring(
                                    11,
                                    16
                                ) || "",
                            nominal,
                            metode:
                                row.metode === "TF"
                                    ? "Transfer"
                                    : "Tunai"
                        };

                    });

        } catch (error) {

            console.warn(
                "Gagal memuat transaksi dari server:",
                error
            );

            DATA_TRANSAKSI = [];

            showToast(
                "Gagal memuat data transaksi dari server.",
                "error"
            );

        }

    }


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
    const btnUnduhPdf = $("#btnUnduhPdf");
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

    async function populateKategoriFilter() {

        if (!filterKategori) {
            return;
        }

        const jenis =
            filterJenis.value;


        let kategori = [];

        try {
            const response = await fetch("/bendahara/api/transaksi/kategori", {
                headers: { Accept: "application/json" },
                credentials: "same-origin"
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    if (jenis === "masuk") {
                        kategori = data.data.masuk || [];
                    } else if (jenis === "keluar") {
                        kategori = data.data.keluar || [];
                    } else {
                        kategori = data.data.semua || [];
                    }
                }
            }
        } catch (error) {
            console.warn("Gagal memuat kategori dari server:", error);
        }

        // Fallback ke konstanta lokal jika fetch gagal
        if (!kategori.length) {
            if (jenis === "masuk") {
                kategori = [...KATEGORI_MASUK];
            } else if (jenis === "keluar") {
                kategori = [...KATEGORI_KELUAR];
            } else {
                kategori = [...new Set([...KATEGORI_MASUK, ...KATEGORI_KELUAR])];
            }
        }


        filterKategori.innerHTML = `
            <option value="">
                Semua Kategori
            </option>
        `;


        kategori.forEach((item) => {

            const option =
                document.createElement("option");

            option.value = item.value || item;
            option.textContent = item.label || item;

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


        const saldo = totalMasuk - totalKeluar;


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
         * Saldo berjalan dihitung dari transaksi (pemasukan dikurung pengeluaran).
         */
        let saldoBerjalan = 0;


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


        const finalSaldo = totalMasuk - totalKeluar;


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
                )} - ${formatTanggal(
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


        let saldoBerjalan = 0;


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
       CETAK & UNDUH PDF
    ========================================================= */

    function bangunQueryLaporan() {

        const bagian = [];


        const tambah = (kunci, nilai) => {

            bagian.push(
                `${kunci}=${encodeURIComponent(nilai)}`
            );

        };


        const mulai =
            filterMulai ? filterMulai.value : "";

        const selesai =
            filterSelesai ? filterSelesai.value : "";


        if (
            mulai &&
            selesai
        ) {

            tambah("dari", mulai);
            tambah("sampai", selesai);

        } else if (mulai) {

            tambah("dari", mulai);

        } else if (selesai) {

            tambah("sampai", selesai);

        } else {

            const bulan =
                filterBulan ? filterBulan.value : "";

            const tahun =
                filterTahun ? filterTahun.value : "";


            if (
                bulan &&
                tahun
            ) {

                const tanggalAwal =
                    new Date(
                        Number(tahun),
                        Number(bulan) - 1,
                        1
                    );

                const tanggalAkhir =
                    new Date(
                        Number(tahun),
                        Number(bulan),
                        0
                    );

                tambah(
                    "dari",
                    `${tanggalAwal.getFullYear()}-${String(
                        tanggalAwal.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                        tanggalAwal.getDate()
                    ).padStart(2, "0")}`
                );

                tambah(
                    "sampai",
                    `${tanggalAkhir.getFullYear()}-${String(
                        tanggalAkhir.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                        tanggalAkhir.getDate()
                    ).padStart(2, "0")}`
                );

            } else if (tahun) {

                tambah(
                    "dari",
                    `${tahun}-01-01`
                );

                tambah(
                    "sampai",
                    `${tahun}-12-31`
                );

            } else if (bulan) {

                const tahunAktif =
                    new Date().getFullYear();

                const tanggalAkhir =
                    new Date(
                        tahunAktif,
                        Number(bulan),
                        0
                    );

                tambah(
                    "dari",
                    `${tahunAktif}-${String(
                        bulan
                    ).padStart(2, "0")}-01`
                );

                tambah(
                    "sampai",
                    `${tahunAktif}-${String(
                        tanggalAkhir.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                        tanggalAkhir.getDate()
                    ).padStart(2, "0")}`
                );

            }

        }


        return bagian.length
            ? `?${bagian.join("&")}`
            : "";

    }


    function bukaLaporan(
        url,
        pesanKosong
    ) {

        if (!hasilFilter.length) {

            showToast(
                pesanKosong,
                "error"
            );

            return;

        }

        window.location.href =
            url + bangunQueryLaporan();

    }


    if (btnCetak) {

        btnCetak.addEventListener(
            "click",
            () => {

                bukaLaporan(
                    "/laporan-kas/cetak",
                    "Tidak ada data untuk dicetak."
                );

            }
        );

    }


    if (btnUnduhPdf) {

        btnUnduhPdf.addEventListener(
            "click",
            () => {

                bukaLaporan(
                    "/laporan-kas/pdf",
                    "Tidak ada data untuk diunduh."
                );

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
       INIT
    ========================================================= */

    (async () => {

        await muatDataDariServer();

        populateTanggalFilter();

        await populateKategoriFilter();

        applyFilter();

    })();

});
