/* =========================================================
   BBCASHVIA - BENDAHARA DASHBOARD
   Data berasal dari database (endpoint /bendahara/api/dashboard*).
   Tidak menggunakan data dummy.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ENDPOINT
       ===================================================== */

    const API = {
        ringkasan: "/bendahara/api/dashboard",
        chart: "/bendahara/api/dashboard/chart",
        recent: "/bendahara/api/dashboard/recent"
    };


    /* =====================================================
       STATE (diisi dari server)
       ===================================================== */

    let dataKas = {

        totalPemasukan: 0,

        totalPengeluaran: 0,

        totalIuran: 0,

        totalSiswa: 0,

        siswaLunas: 0,

        siswaBelumLunas: 0,

        totalTransaksi: 0,

        transaksiHariIni: 0

    };


    let arusBulanan = [];


    let saldoBulanan = [];


    let transaksiTerbaru = [];


    /* =====================================================
       UTILITY
       ===================================================== */

    const formatRupiah = (value) => {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(value) || 0);

    };


    const escapeHtml = (value) =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");


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
                hasil?.message || "Gagal mengambil data dari server."
            );

        }

        return hasil;

    };


    const formatCompact = (value) => {

        if (value >= 1000000) {
            return `Rp ${(value / 1000000).toFixed(1)} jt`;
        }

        if (value >= 1000) {
            return `Rp ${(value / 1000).toFixed(0)} rb`;
        }

        return formatRupiah(value);

    };


    /* =====================================================
       SALDO
       ===================================================== */

    const hitungSaldoSaatIni = () =>
        dataKas.totalPemasukan - dataKas.totalPengeluaran;


    /* =====================================================
       RENDER STATISTICS
       ===================================================== */

    const statSaldo =
        document.getElementById("statSaldo");

    const statPemasukan =
        document.getElementById("statPemasukan");

    const statIuran =
        document.getElementById("statIuran");

    const statBelumLunas =
        document.getElementById("statBelumLunas");

    const statTransaksi =
        document.getElementById("statTransaksi");

    const statHariIni =
        document.getElementById("statHariIni");

    const statIuranMeta =
        document.getElementById("statIuranMeta");


    const renderStatistik = () => {

        const saldoSaatIni =
            hitungSaldoSaatIni();


        if (statSaldo) {
            statSaldo.textContent =
                formatRupiah(saldoSaatIni);
        }


        if (statPemasukan) {
            statPemasukan.textContent =
                formatRupiah(dataKas.totalPemasukan);
        }


        if (statIuran) {
            statIuran.textContent =
                formatRupiah(dataKas.totalIuran);
        }


        if (statBelumLunas) {
            statBelumLunas.textContent =
                `${dataKas.siswaBelumLunas} siswa`;
        }


        if (statTransaksi) {
            statTransaksi.textContent =
                `${dataKas.totalTransaksi} transaksi`;
        }


        if (statHariIni) {
            statHariIni.textContent =
                `${dataKas.transaksiHariIni} transaksi`;
        }


        if (statIuranMeta) {
            const progress =
                dataKas.totalSiswa > 0
                    ? Math.round(
                        (dataKas.siswaLunas / dataKas.totalSiswa) * 100
                    )
                    : 0;

            statIuranMeta.textContent =
                `${progress}% siswa sudah lunas`;
        }

    };


    /* =====================================================
       RINGKASAN KAS
       ===================================================== */

    const rumusPemasukan =
        document.getElementById("rumusPemasukan");

    const rumusPengeluaran =
        document.getElementById("rumusPengeluaran");

    const rumusSaldo =
        document.getElementById("rumusSaldo");


    const renderRingkasanKas = () => {

        if (rumusPemasukan) {
            rumusPemasukan.textContent =
                formatRupiah(dataKas.totalPemasukan);
        }


        if (rumusPengeluaran) {
            rumusPengeluaran.textContent =
                formatRupiah(dataKas.totalPengeluaran);
        }


        if (rumusSaldo) {
            rumusSaldo.textContent =
                formatRupiah(hitungSaldoSaatIni());
        }

    };


    /* =====================================================
       IURAN SUMMARY
       ===================================================== */

    const iuranLunas =
        document.getElementById("iuranLunas");

    const iuranBelumLunas =
        document.getElementById("iuranBelumLunas");

    const iuranProgress =
        document.getElementById("iuranProgress");

    const iuranProgressText =
        document.getElementById("iuranProgressText");


    const renderIuran = () => {

        const progressIuran =
            dataKas.totalSiswa > 0
                ? Math.round(
                    (dataKas.siswaLunas / dataKas.totalSiswa) * 100
                )
                : 0;


        if (iuranLunas) {
            iuranLunas.textContent =
                `${dataKas.siswaLunas} siswa`;
        }


        if (iuranBelumLunas) {
            iuranBelumLunas.textContent =
                `${dataKas.siswaBelumLunas} siswa`;
        }


        if (iuranProgress) {
            iuranProgress.style.width =
                `${progressIuran}%`;
        }


        if (iuranProgressText) {
            iuranProgressText.textContent =
                `${progressIuran}%`;
        }

    };


    /* =====================================================
       TRANSACTION TABLE
       ===================================================== */

    const transactionTable =
        document.getElementById("transactionTable");


    const getStatusClass = (status) => {

        if (status === "Lunas" || status === "Terverifikasi") {
            return "status status--success";
        }

        if (status === "Menunggu") {
            return "status status--warning";
        }

        return "status status--danger";

    };


    const renderTransaksi = () => {

        if (!transactionTable) {
            return;
        }


        if (!transaksiTerbaru.length) {

            transactionTable.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding:24px; color:#64748b;">
                        Belum ada transaksi.
                    </td>
                </tr>
            `;

            return;

        }


        transactionTable.innerHTML =
            transaksiTerbaru.map((trx) => {

                return `
                    <tr>

                        <td>
                            <strong class="table__code">
                                ${escapeHtml(trx.noBukti)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(trx.siswa)}
                        </td>

                        <td>
                            ${escapeHtml(trx.iuran)}
                        </td>

                        <td>
                            <strong class="table__amount">
                                ${formatRupiah(trx.nominal)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(trx.metode)}
                        </td>

                        <td>
                            ${escapeHtml(trx.tanggal)}
                        </td>

                        <td>
                            <span class="${getStatusClass(trx.status)}">
                                ${escapeHtml(trx.status)}
                            </span>
                        </td>

                    </tr>
                `;

            }).join("");

    };


    /* =====================================================
       DATE
       ===================================================== */

    const currentDate =
        document.getElementById("currentDate");


    if (currentDate) {

        const today =
            new Date();

        currentDate.textContent =
            today.toLocaleDateString(
                "id-ID",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    /* =====================================================
       BAR CHART
       ===================================================== */

    const barChart =
        document.getElementById("barChart");


    const renderBarChart = () => {

        if (!barChart) {
            return;
        }


        if (!arusBulanan.length) {

            barChart.innerHTML =
                `<p class="chart-empty">Belum ada data grafik.</p>`;

            return;

        }


        const maxValue =
            Math.max(
                1,
                ...arusBulanan.flatMap((item) => [
                    item.masuk,
                    item.keluar
                ])
            );


        const maxScale =
            Math.max(1, Math.ceil(maxValue / 1000000) * 1000000);


        const gridValues = [
            maxScale,
            maxScale * 0.75,
            maxScale * 0.5,
            maxScale * 0.25,
            0
        ];


        const labels =
            gridValues.map((value) => {

                if (value === 0) {
                    return "0";
                }

                return formatCompact(value);

            });


        const columns =
            arusBulanan.map((item) => {

                const masukHeight =
                    Math.max(
                        3,
                        (item.masuk / maxScale) * 100
                    );

                const keluarHeight =
                    Math.max(
                        3,
                        (item.keluar / maxScale) * 100
                    );


                return `
                    <div class="barchart__col">

                        <div class="barchart__pair">

                            <div
                                class="barchart__bar barchart__bar--in"
                                style="height:${masukHeight}%"
                            >
                                <span class="barchart__tip">
                                    Masuk: ${formatRupiah(item.masuk)}
                                </span>
                            </div>

                            <div
                                class="barchart__bar barchart__bar--out"
                                style="height:${keluarHeight}%"
                            >
                                <span class="barchart__tip">
                                    Keluar: ${formatRupiah(item.keluar)}
                                </span>
                            </div>

                        </div>

                        <span class="barchart__mon">
                            ${item.bulan}
                        </span>

                    </div>
                `;

            }).join("");


        const gridLines =
            gridValues.map((value, index) => {

                const position =
                    index * 25;

                return `
                    <div
                        class="barchart__gl"
                        style="bottom:${position}%"
                    ></div>
                `;

            }).join("");


        barChart.innerHTML = `

            <div class="barchart">

                <div class="barchart__ylabs">

                    ${labels.map((label) => `
                        <span>
                            ${label}
                        </span>
                    `).join("")}

                </div>


                <div class="barchart__plot">

                    ${gridLines}

                    <div class="barchart__cols">

                        ${columns}

                    </div>

                </div>

            </div>

        `;

    };


    renderBarChart();


    /* =====================================================
       LINE CHART
       ===================================================== */

    const lineChart =
        document.getElementById("lineChart");


    const renderLineChart = () => {

        if (!lineChart) {
            return;
        }


        if (!saldoBulanan.length) {

            lineChart.innerHTML =
                `<p class="chart-empty">Belum ada data saldo.</p>`;

            return;

        }


        const width = 620;
        const height = 210;

        const paddingLeft = 35;
        const paddingRight = 20;
        const paddingTop = 20;
        const paddingBottom = 32;


        const plotWidth =
            width -
            paddingLeft -
            paddingRight;


        const plotHeight =
            height -
            paddingTop -
            paddingBottom;


        const values =
            saldoBulanan.map(
                (item) => item.saldo
            );


        const minValue =
            Math.min(...values);


        const maxValue =
            Math.max(...values);


        const range =
            maxValue - minValue || 1;


        const points =
            saldoBulanan.map((item, index) => {

                const x =
                    paddingLeft +
                    (
                        index /
                        (saldoBulanan.length - 1)
                    ) *
                    plotWidth;


                const y =
                    paddingTop +
                    (
                        1 -
                        (
                            (item.saldo - minValue) /
                            range
                        )
                    ) *
                    plotHeight;


                return {
                    x,
                    y,
                    value: item.saldo,
                    bulan: item.bulan
                };

            });


        const linePoints =
            points
                .map(
                    (point) =>
                        `${point.x},${point.y}`
                )
                .join(" ");


        const areaPoints =
            [
                `${points[0].x},${height - paddingBottom}`,
                ...points.map(
                    (point) =>
                        `${point.x},${point.y}`
                ),
                `${points[points.length - 1].x},${height - paddingBottom}`
            ].join(" ");


        const horizontalLines =
            [0, 0.25, 0.5, 0.75, 1]
                .map((position) => {

                    const y =
                        paddingTop +
                        position * plotHeight;

                    return `
                        <line
                            class="lc-grid"
                            x1="${paddingLeft}"
                            y1="${y}"
                            x2="${width - paddingRight}"
                            y2="${y}"
                        />
                    `;

                })
                .join("");


        const dots =
            points.map((point, index) => {

                const isLast =
                    index === points.length - 1;


                return `
                    <circle
                        class="${isLast ? "lc-dot lc-dot--last" : "lc-dot"}"
                        cx="${point.x}"
                        cy="${point.y}"
                        r="${isLast ? 5 : 4}"
                    />

                    <text
                        class="lc-val"
                        x="${point.x}"
                        y="${point.y - 12}"
                    >
                        ${formatCompact(point.value)}
                    </text>

                    <text
                        x="${point.x}"
                        y="${height - 8}"
                        text-anchor="middle"
                        fill="#64748b"
                        font-size="9"
                        font-weight="600"
                    >
                        ${point.bulan}
                    </text>
                `;

            })
            .join("");


        lineChart.innerHTML = `

            <div class="linechart">

                <svg
                    viewBox="0 0 ${width} ${height}"
                    preserveAspectRatio="none"
                    aria-label="Grafik perkembangan saldo"
                >

                    ${horizontalLines}

                    <polygon
                        class="lc-area"
                        points="${areaPoints}"
                    />

                    <polyline
                        class="lc-line"
                        points="${linePoints}"
                    />

                    ${dots}

                </svg>

            </div>

        `;

    };


    renderLineChart();


    /* =====================================================
       MUAT DATA DARI DATABASE
       ===================================================== */

    const muatRingkasan = async () => {

        const hasil = await ambilJSON(API.ringkasan);

        const kpi = hasil?.data?.kpi ?? {};
        const ring = hasil?.data?.ringkasan ?? {};

        const belumLunas =
            Number(kpi.siswa_belum_lunas) || 0;


        dataKas = {
            totalPemasukan: Number(kpi.total_pemasukan) || 0,
            totalPengeluaran: Number(kpi.total_pengeluaran) || 0,
            totalIuran: Number(kpi.total_iuran) || 0,
            totalSiswa: Number(kpi.jumlah_siswa) || 0,
            siswaLunas: Math.max(
                0,
                (Number(kpi.jumlah_siswa) || 0) - belumLunas
            ),
            siswaBelumLunas: belumLunas,
            totalTransaksi: Number(kpi.total_transaksi) || 0,
            transaksiHariIni: 0
        };

    };


    const muatGrafik = async () => {

        const hasil = await ambilJSON(API.chart);

        const baris =
            Array.isArray(hasil?.data) ? hasil.data : [];


        arusBulanan = baris.map((item) => ({
            bulan: item.bulan ?? "-",
            masuk: Number(item.masuk) || 0,
            keluar: Number(item.keluar) || 0
        }));


        let jalan = 0;

        saldoBulanan = arusBulanan.map((item) => {

            jalan += item.masuk - item.keluar;

            return {
                bulan: item.bulan,
                saldo: jalan
            };

        });

    };


    const muatTerbaru = async () => {

        const hasil = await ambilJSON(API.recent);

        const baris =
            Array.isArray(hasil?.data) ? hasil.data : [];


        transaksiTerbaru = baris.map((t) => {

            const arah =
                String(t.arah || "").toLowerCase();


            return {
                noBukti: t.id ?? "-",
                siswa: t.unit ?? "-",
                iuran: t.ket ?? "-",
                nominal: Number(t.nominal) || 0,
                metode: arah === "pemasukan"
                    ? "Masuk"
                    : (arah === "pengeluaran" ? "Keluar" : "-"),
                tanggal: t.tanggal ?? "-",
                tanggalIso: t.tanggal_iso ?? null,
                status: t.status ?? "-"
            };

        });


        const hariIni = (() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        })();


        dataKas.transaksiHariIni =
            transaksiTerbaru.filter(
                (t) => t.tanggalIso === hariIni
            ).length;

    };


    const muatSemua = async () => {

        try {

            await Promise.all([
                muatRingkasan(),
                muatGrafik(),
                muatTerbaru()
            ]);

        } catch (err) {

            console.error(err);

        }


        renderStatistik();

        renderRingkasanKas();

        renderIuran();

        renderTransaksi();

        renderBarChart();

        renderLineChart();

    };


    muatSemua();


    /* =====================================================
       CHART TABS
       ===================================================== */

    const chartTabs =
        document.querySelectorAll(".chart-tab");


    chartTabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            chartTabs.forEach((item) => {
                item.classList.remove("is-active");
            });


            tab.classList.add("is-active");


            const target =
                tab.dataset.chart;


            const bar =
                document.getElementById("barChart");

            const line =
                document.getElementById("lineChart");


            if (target === "bar") {

                bar?.classList.remove("is-hidden");
                line?.classList.add("is-hidden");

            }


            if (target === "line") {

                bar?.classList.add("is-hidden");
                line?.classList.remove("is-hidden");

            }

        });

    });


    /* =====================================================
       SIDEBAR
       ===================================================== */

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");


    const openSidebar = () => {

        document.body.classList.add("nav-open");

        sidebarToggle?.setAttribute(
            "aria-expanded",
            "true"
        );

    };


    const closeSidebar = () => {

        document.body.classList.remove("nav-open");

        sidebarToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

    };


    sidebarToggle?.addEventListener(
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


    sidebarBackdrop?.addEventListener(
        "click",
        closeSidebar
    );


    /* =====================================================
       PROFILE DROPDOWN
       ===================================================== */

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");


    const closeProfile =
        () => {

            profileDropdown?.classList.remove(
                "is-open"
            );

            profileButton?.setAttribute(
                "aria-expanded",
                "false"
            );

        };


    profileButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();


            const isOpen =
                profileDropdown?.classList.contains(
                    "is-open"
                );


            if (isOpen) {

                closeProfile();

            } else {

                profileDropdown?.classList.add(
                    "is-open"
                );

                profileButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                !profileDropdown ||
                !profileButton
            ) {
                return;
            }


            if (
                !profileDropdown.contains(event.target) &&
                !profileButton.contains(event.target)
            ) {

                closeProfile();

            }

        }
    );


    /* =====================================================
       ESCAPE
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            closeProfile();
            closeSidebar();

        }
    );


    /* =====================================================
       LOGOUT
       ===================================================== */

    const logoutButtons = [
        document.getElementById("sidebarLogout"),
        document.getElementById("dropdownLogout")
    ].filter(Boolean);


    logoutButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                /*
                 * Nanti bagian ini dapat diganti
                 * dengan route logout Laravel.
                 */

                window.location.href = "/logout";

            }
        );

    });

});
