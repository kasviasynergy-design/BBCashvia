/* =========================================================
   BBCASHVIA - BENDAHARA DASHBOARD
   FRONTEND SIMULATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DATA DUMMY
       ===================================================== */

    const dataKas = {

        saldoAwal: 3000000,

        totalPemasukan: 12450000,

        totalPengeluaran: 7200000,

        totalIuran: 10800000,

        totalSiswa: 36,

        siswaLunas: 28,

        siswaBelumLunas: 8,

        totalTransaksi: 124,

        transaksiHariIni: 6

    };


    const arusBulanan = [
        {
            bulan: "Apr",
            masuk: 1800000,
            keluar: 900000
        },
        {
            bulan: "Mei",
            masuk: 2200000,
            keluar: 1250000
        },
        {
            bulan: "Jun",
            masuk: 1950000,
            keluar: 900000
        },
        {
            bulan: "Jul",
            masuk: 2400000,
            keluar: 1350000
        },
        {
            bulan: "Agu",
            masuk: 2100000,
            keluar: 1100000
        },
        {
            bulan: "Sep",
            masuk: 2000000,
            keluar: 950000
        },
        {
            bulan: "Okt",
            masuk: 2000000,
            keluar: 750000
        }
    ];


    const saldoBulanan = [
        {
            bulan: "Apr",
            saldo: 3900000
        },
        {
            bulan: "Mei",
            saldo: 4850000
        },
        {
            bulan: "Jun",
            saldo: 5900000
        },
        {
            bulan: "Jul",
            saldo: 6950000
        },
        {
            bulan: "Agu",
            saldo: 7950000
        },
        {
            bulan: "Sep",
            saldo: 9000000
        },
        {
            bulan: "Okt",
            saldo: 8250000
        }
    ];


    const transaksiTerbaru = [
        {
            noBukti: "TRX-2026-00124",
            siswa: "Nadia Putri",
            iuran: "Kas Oktober",
            nominal: 25000,
            metode: "Tunai",
            tanggal: "05 Okt 2026",
            status: "Lunas"
        },
        {
            noBukti: "TRX-2026-00123",
            siswa: "Raka Pratama",
            iuran: "Kas Oktober",
            nominal: 25000,
            metode: "Transfer",
            tanggal: "05 Okt 2026",
            status: "Lunas"
        },
        {
            noBukti: "TRX-2026-00122",
            siswa: "Salsa Aulia",
            iuran: "Kegiatan Kelas",
            nominal: 50000,
            metode: "Tunai",
            tanggal: "04 Okt 2026",
            status: "Lunas"
        },
        {
            noBukti: "TRX-2026-00121",
            siswa: "Fajar Ramadhan",
            iuran: "Kas Oktober",
            nominal: 25000,
            metode: "Tunai",
            tanggal: "04 Okt 2026",
            status: "Lunas"
        },
        {
            noBukti: "TRX-2026-00120",
            siswa: "Alya Safitri",
            iuran: "Kas Oktober",
            nominal: 25000,
            metode: "Transfer",
            tanggal: "03 Okt 2026",
            status: "Lunas"
        },
        {
            noBukti: "TRX-2026-00119",
            siswa: "Dimas Akbar",
            iuran: "Kebersihan",
            nominal: 15000,
            metode: "Tunai",
            tanggal: "03 Okt 2026",
            status: "Lunas"
        }
    ];


    /* =====================================================
       UTILITY
       ===================================================== */

    const formatRupiah = (value) => {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(value);

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

    const saldoSaatIni =
        dataKas.saldoAwal +
        dataKas.totalPemasukan -
        dataKas.totalPengeluaran;


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
            Math.round(
                (dataKas.siswaLunas / dataKas.totalSiswa) * 100
            );

        statIuranMeta.textContent =
            `${progress}% siswa sudah lunas`;
    }


    /* =====================================================
       RINGKASAN KAS
       ===================================================== */

    const saldoAwal =
        document.getElementById("saldoAwal");

    const rumusPemasukan =
        document.getElementById("rumusPemasukan");

    const rumusPengeluaran =
        document.getElementById("rumusPengeluaran");

    const rumusSaldo =
        document.getElementById("rumusSaldo");


    if (saldoAwal) {
        saldoAwal.textContent =
            formatRupiah(dataKas.saldoAwal);
    }


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
            formatRupiah(saldoSaatIni);
    }


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


    const progressIuran =
        Math.round(
            (dataKas.siswaLunas / dataKas.totalSiswa) * 100
        );


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


    /* =====================================================
       TRANSACTION TABLE
       ===================================================== */

    const transactionTable =
        document.getElementById("transactionTable");


    const getStatusClass = (status) => {

        if (status === "Lunas") {
            return "status status--success";
        }

        if (status === "Menunggu") {
            return "status status--warning";
        }

        return "status status--danger";

    };


    if (transactionTable) {

        transactionTable.innerHTML =
            transaksiTerbaru.map((trx) => {

                return `
                    <tr>

                        <td>
                            <strong class="table__code">
                                ${trx.noBukti}
                            </strong>
                        </td>

                        <td>
                            ${trx.siswa}
                        </td>

                        <td>
                            ${trx.iuran}
                        </td>

                        <td>
                            <strong class="table__amount">
                                ${formatRupiah(trx.nominal)}
                            </strong>
                        </td>

                        <td>
                            ${trx.metode}
                        </td>

                        <td>
                            ${trx.tanggal}
                        </td>

                        <td>
                            <span class="${getStatusClass(trx.status)}">
                                ${trx.status}
                            </span>
                        </td>

                    </tr>
                `;

            }).join("");

    }


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


        const maxValue =
            Math.max(
                ...arusBulanan.flatMap((item) => [
                    item.masuk,
                    item.keluar
                ])
            );


        const maxScale =
            Math.ceil(maxValue / 1000000) * 1000000;


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
       FRONTEND SIMULATION
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

                window.location.href = "/";

            }
        );

    });

});
