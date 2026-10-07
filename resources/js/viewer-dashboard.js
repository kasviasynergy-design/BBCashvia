document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       BBCASHVIA — VIEWER DASHBOARD
       Data dummy + interaksi UI
       Read-only dashboard
    ============================================================ */


    /* ============================================================
       DATA DUMMY
    ============================================================ */

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
            masuk: 1450000,
            keluar: 850000
        },

        {
            bulan: "Mei",
            masuk: 1800000,
            keluar: 950000
        },

        {
            bulan: "Jun",
            masuk: 1250000,
            keluar: 700000
        },

        {
            bulan: "Jul",
            masuk: 2100000,
            keluar: 1250000
        },

        {
            bulan: "Agu",
            masuk: 1850000,
            keluar: 1100000
        },

        {
            bulan: "Sep",
            masuk: 2200000,
            keluar: 1350000
        },

        {
            bulan: "Okt",
            masuk: 1800000,
            keluar: 1000000
        }

    ];


    const saldoBulanan = [

        3600000,
        4450000,
        5000000,
        5850000,
        6600000,
        7450000,
        8250000

    ];


    const transaksiTerbaru = [

        {
            bukti: "TRX-2026-00124",
            siswa: "Nadia Putri",
            iuran: "Kas Oktober",
            nominal: 25000,
            metode: "Tunai",
            tanggal: "05 Okt 2026",
            status: "Lunas"
        },

        {
            bukti: "TRX-2026-00123",
            siswa: "Rizky Maulana",
            iuran: "Kas Oktober",
            nominal: 25000,
            metode: "Transfer",
            tanggal: "05 Okt 2026",
            status: "Lunas"
        },

        {
            bukti: "TRX-2026-00122",
            siswa: "Salsabila Putri",
            iuran: "Kas Oktober",
            nominal: 25000,
            metode: "Tunai",
            tanggal: "04 Okt 2026",
            status: "Lunas"
        },

        {
            bukti: "TRX-2026-00121",
            siswa: "Fajar Nugraha",
            iuran: "Kas Oktober",
            nominal: 25000,
            metode: "Transfer",
            tanggal: "04 Okt 2026",
            status: "Lunas"
        },

        {
            bukti: "TRX-2026-00120",
            siswa: "Aulia Rahma",
            iuran: "Kas September",
            nominal: 25000,
            metode: "Tunai",
            tanggal: "03 Okt 2026",
            status: "Lunas"
        },

        {
            bukti: "TRX-2026-00119",
            siswa: "Dimas Pratama",
            iuran: "Kas September",
            nominal: 25000,
            metode: "Transfer",
            tanggal: "02 Okt 2026",
            status: "Lunas"
        }

    ];


    /* ============================================================
       HELPER
    ============================================================ */

    const formatRupiah = (value) => {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(value);

    };


    const formatCompact = (value) => {

        if (value >= 1000000) {

            return (
                "Rp" +
                (value / 1000000)
                    .toFixed(value % 1000000 === 0 ? 0 : 1)
                    .replace(".", ",") +
                " jt"
            );

        }

        if (value >= 1000) {

            return (
                "Rp" +
                (value / 1000)
                    .toFixed(value % 1000 === 0 ? 0 : 1)
                    .replace(".", ",") +
                " rb"
            );

        }

        return formatRupiah(value);

    };


    const saldoSaatIni =
        dataKas.saldoAwal +
        dataKas.totalPemasukan -
        dataKas.totalPengeluaran;


    /* ============================================================
       ELEMENTS
    ============================================================ */

    const statSaldo =
        document.getElementById("statSaldo");

    const statPemasukan =
        document.getElementById("statPemasukan");

    const statIuran =
        document.getElementById("statIuran");

    const statIuranMeta =
        document.getElementById("statIuranMeta");

    const statBelumLunas =
        document.getElementById("statBelumLunas");

    const statTransaksi =
        document.getElementById("statTransaksi");

    const statHariIni =
        document.getElementById("statHariIni");


    const kasSaldoAwal =
        document.getElementById("kasSaldoAwal");

    const kasPemasukan =
        document.getElementById("kasPemasukan");

    const kasPengeluaran =
        document.getElementById("kasPengeluaran");

    const kasSaldoSaatIni =
        document.getElementById("kasSaldoSaatIni");


    const iuranPercent =
        document.getElementById("iuranPercent");

    const iuranLunas =
        document.getElementById("iuranLunas");

    const iuranTotal =
        document.getElementById("iuranTotal");

    const iuranProgress =
        document.getElementById("iuranProgress");

    const iuranLunasDetail =
        document.getElementById("iuranLunasDetail");

    const iuranBelumLunasDetail =
        document.getElementById("iuranBelumLunasDetail");


    /* ============================================================
       RENDER STATISTICS
    ============================================================ */

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


    if (statIuranMeta) {

        statIuranMeta.textContent =
            `${dataKas.siswaLunas} dari ${dataKas.totalSiswa} siswa lunas`;

    }


    if (statBelumLunas) {
        statBelumLunas.textContent =
            dataKas.siswaBelumLunas;
    }


    if (statTransaksi) {
        statTransaksi.textContent =
            dataKas.totalTransaksi;
    }


    if (statHariIni) {
        statHariIni.textContent =
            dataKas.transaksiHariIni;
    }


    /* ============================================================
       RENDER RINGKASAN KAS
    ============================================================ */

    if (kasSaldoAwal) {
        kasSaldoAwal.textContent =
            formatRupiah(dataKas.saldoAwal);
    }


    if (kasPemasukan) {
        kasPemasukan.textContent =
            formatRupiah(dataKas.totalPemasukan);
    }


    if (kasPengeluaran) {
        kasPengeluaran.textContent =
            formatRupiah(dataKas.totalPengeluaran);
    }


    if (kasSaldoSaatIni) {
        kasSaldoSaatIni.textContent =
            formatRupiah(saldoSaatIni);
    }


    /* ============================================================
       RENDER MONITORING IURAN
    ============================================================ */

    const persentaseLunas =
        Math.round(
            (dataKas.siswaLunas / dataKas.totalSiswa) * 100
        );


    if (iuranPercent) {
        iuranPercent.textContent =
            `${persentaseLunas}%`;
    }


    if (iuranLunas) {
        iuranLunas.textContent =
            dataKas.siswaLunas;
    }


    if (iuranTotal) {
        iuranTotal.textContent =
            dataKas.totalSiswa;
    }


    if (iuranProgress) {

        iuranProgress.style.width =
            `${persentaseLunas}%`;

    }


    if (iuranLunasDetail) {
        iuranLunasDetail.textContent =
            dataKas.siswaLunas;
    }


    if (iuranBelumLunasDetail) {
        iuranBelumLunasDetail.textContent =
            dataKas.siswaBelumLunas;
    }


    /* ============================================================
       INITIALS
    ============================================================ */

    function getInitials(name) {

        return name
            .split(" ")
            .slice(0, 2)
            .map(word => word.charAt(0))
            .join("")
            .toUpperCase();

    }


    /* ============================================================
       RENDER TRANSAKSI
    ============================================================ */

    const transactionTableBody =
        document.getElementById("transactionTableBody");


    if (transactionTableBody) {

        transactionTableBody.innerHTML =
            transaksiTerbaru
                .map((trx) => {

                    return `
                        <tr>

                            <td>
                                <span class="mono-text">
                                    ${trx.bukti}
                                </span>
                            </td>

                            <td>
                                <div class="table-person">
                                    <div class="table-avatar">
                                        ${getInitials(trx.siswa)}
                                    </div>

                                    <span>
                                        ${trx.siswa}
                                    </span>
                                </div>
                            </td>

                            <td>
                                ${trx.iuran}
                            </td>

                            <td>
                                <strong class="nominal">
                                    ${formatRupiah(trx.nominal)}
                                </strong>
                            </td>

                            <td>
                                <span class="method-text">
                                    ${trx.metode}
                                </span>
                            </td>

                            <td>
                                ${trx.tanggal}
                            </td>

                            <td>
                                <span class="status-pill success">
                                    <span class="status-dot"></span>
                                    ${trx.status}
                                </span>
                            </td>

                        </tr>
                    `;

                })
                .join("");

    }


    /* ============================================================
       CURRENT DATE
    ============================================================ */

    const currentDate =
        document.getElementById("currentDate");


    if (currentDate) {

        const now = new Date();

        currentDate.textContent =
            new Intl.DateTimeFormat(
                "id-ID",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(now);

    }


    /* ============================================================
       BAR CHART
    ============================================================ */

    const barChart =
        document.getElementById("barChart");


    function renderBarChart() {

        if (!barChart) {
            return;
        }


        const maxValue =
            Math.max(
                ...arusBulanan.flatMap(item => [
                    item.masuk,
                    item.keluar
                ])
            );


        const chartHeight = 240;

        const chartWidth = 620;

        const leftPadding = 52;

        const rightPadding = 20;

        const topPadding = 20;

        const bottomPadding = 42;


        const usableWidth =
            chartWidth -
            leftPadding -
            rightPadding;


        const usableHeight =
            chartHeight -
            topPadding -
            bottomPadding;


        const groupWidth =
            usableWidth /
            arusBulanan.length;


        const barWidth = 18;


        let svg = `

            <svg
                viewBox="0 0 ${chartWidth} ${chartHeight}"
                class="chart-svg"
                preserveAspectRatio="none"
            >

        `;


        /* GRID */

        for (let i = 0; i <= 4; i++) {

            const y =
                topPadding +
                (usableHeight / 4) * i;


            const value =
                maxValue -
                (maxValue / 4) * i;


            svg += `

                <line
                    x1="${leftPadding}"
                    y1="${y}"
                    x2="${chartWidth - rightPadding}"
                    y2="${y}"
                    class="chart-grid-line"
                />

                <text
                    x="${leftPadding - 10}"
                    y="${y + 4}"
                    text-anchor="end"
                    class="chart-axis-label"
                >
                    ${formatCompact(value)}
                </text>

            `;

        }


        /* BARS */

        arusBulanan.forEach((item, index) => {

            const centerX =
                leftPadding +
                groupWidth * index +
                groupWidth / 2;


            const masukHeight =
                (item.masuk / maxValue) *
                usableHeight;


            const keluarHeight =
                (item.keluar / maxValue) *
                usableHeight;


            const masukY =
                topPadding +
                usableHeight -
                masukHeight;


            const keluarY =
                topPadding +
                usableHeight -
                keluarHeight;


            svg += `

                <rect
                    x="${centerX - barWidth - 2}"
                    y="${masukY}"
                    width="${barWidth}"
                    height="${masukHeight}"
                    rx="5"
                    class="bar-income"
                />

                <rect
                    x="${centerX + 2}"
                    y="${keluarY}"
                    width="${barWidth}"
                    height="${keluarHeight}"
                    rx="5"
                    class="bar-expense"
                />

                <text
                    x="${centerX}"
                    y="${chartHeight - 16}"
                    text-anchor="middle"
                    class="chart-axis-label"
                >
                    ${item.bulan}
                </text>

            `;

        });


        svg += `</svg>`;


        barChart.innerHTML = svg;

    }


    renderBarChart();


    /* ============================================================
       LINE CHART
    ============================================================ */

    const lineChart =
        document.getElementById("lineChart");


    function renderLineChart() {

        if (!lineChart) {
            return;
        }


        const chartHeight = 240;

        const chartWidth = 620;

        const leftPadding = 52;

        const rightPadding = 20;

        const topPadding = 20;

        const bottomPadding = 42;


        const usableWidth =
            chartWidth -
            leftPadding -
            rightPadding;


        const usableHeight =
            chartHeight -
            topPadding -
            bottomPadding;


        const maxValue =
            Math.max(...saldoBulanan);


        const points =
            saldoBulanan.map((value, index) => {

                const x =
                    leftPadding +
                    (usableWidth / (saldoBulanan.length - 1)) *
                    index;


                const y =
                    topPadding +
                    usableHeight -
                    (value / maxValue) *
                    usableHeight;


                return {
                    x,
                    y,
                    value
                };

            });


        let svg = `

            <svg
                viewBox="0 0 ${chartWidth} ${chartHeight}"
                class="chart-svg"
                preserveAspectRatio="none"
            >

        `;


        /* GRID */

        for (let i = 0; i <= 4; i++) {

            const y =
                topPadding +
                (usableHeight / 4) * i;


            const value =
                maxValue -
                (maxValue / 4) * i;


            svg += `

                <line
                    x1="${leftPadding}"
                    y1="${y}"
                    x2="${chartWidth - rightPadding}"
                    y2="${y}"
                    class="chart-grid-line"
                />

                <text
                    x="${leftPadding - 10}"
                    y="${y + 4}"
                    text-anchor="end"
                    class="chart-axis-label"
                >
                    ${formatCompact(value)}
                </text>

            `;

        }


        const path =
            points
                .map(
                    (point, index) =>
                        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
                )
                .join(" ");


        svg += `

            <path
                d="${path}"
                class="line-path"
            />

        `;


        points.forEach((point, index) => {

            svg += `

                <circle
                    cx="${point.x}"
                    cy="${point.y}"
                    r="4"
                    class="line-point"
                />

                <text
                    x="${point.x}"
                    y="${chartHeight - 16}"
                    text-anchor="middle"
                    class="chart-axis-label"
                >
                    ${arusBulanan[index].bulan}
                </text>

            `;

        });


        svg += `</svg>`;


        lineChart.innerHTML = svg;

    }


    renderLineChart();


    /* ============================================================
       CHART TABS
    ============================================================ */

    const chartTabs =
        document.querySelectorAll(".chart-tab");


    chartTabs.forEach(tab => {

        tab.addEventListener("click", () => {

            chartTabs.forEach(item => {
                item.classList.remove("active");
            });


            tab.classList.add("active");


            const chartType =
                tab.dataset.chart;


            if (chartType === "bar") {

                barChart?.classList.add("active");
                lineChart?.classList.remove("active");

            }


            if (chartType === "line") {

                lineChart?.classList.add("active");
                barChart?.classList.remove("active");

            }

        });

    });


    /* ============================================================
       SIDEBAR MOBILE
    ============================================================ */

    const menuToggle =
        document.getElementById("menuToggle");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");


    function openSidebar() {

        sidebar?.classList.add("open");

        sidebarBackdrop?.classList.add("show");

        document.body.classList.add("nav-open");

    }


    function closeSidebar() {

        sidebar?.classList.remove("open");

        sidebarBackdrop?.classList.remove("show");

        document.body.classList.remove("nav-open");

    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();


                if (
                    sidebar?.classList.contains("open")
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
            () => {

                closeSidebar();

            }
        );

    }


    /* ============================================================
       PROFILE DROPDOWN
    ============================================================ */

    const profileButton =
        document.getElementById("profileButton");

    const profileWrapper =
        document.querySelector(".profile-wrapper");

    const profileDropdown =
        document.getElementById("profileDropdown");


    function openProfile() {

        if (!profileWrapper) {
            return;
        }


        profileWrapper.classList.add("open");


        if (profileButton) {

            profileButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    function closeProfile() {

        if (!profileWrapper) {
            return;
        }


        profileWrapper.classList.remove("open");


        if (profileButton) {

            profileButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    function toggleProfile() {

        if (!profileWrapper) {
            return;
        }


        if (
            profileWrapper.classList.contains("open")
        ) {

            closeProfile();

        } else {

            openProfile();

        }

    }


    if (profileButton && profileWrapper) {

        profileButton.setAttribute(
            "aria-expanded",
            "false"
        );


        profileButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                toggleProfile();

            }
        );

    }


    if (profileDropdown) {

        profileDropdown.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );

    }


    document.addEventListener(
        "click",
        (event) => {

            if (
                profileWrapper &&
                !profileWrapper.contains(event.target)
            ) {

                closeProfile();

            }

        }
    );


    /* ============================================================
       LOGOUT CONFIRMATION
    ============================================================ */

    function confirmLogout(event) {

        if (event) {

            event.preventDefault();
            event.stopPropagation();

        }


        const confirmed =
            window.confirm(
                "Apakah kamu yakin ingin keluar dari akun Viewer?"
            );


        if (!confirmed) {
            return;
        }


        window.location.href = "/";

    }


    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            confirmLogout
        );

    }


    const dropdownLogout =
        document.getElementById("dropdownLogout");


    if (dropdownLogout) {

        dropdownLogout.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                closeProfile();

                confirmLogout(event);

            }
        );

    }


    /* ============================================================
       ESCAPE
    ============================================================ */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeSidebar();

                closeProfile();

            }

        }
    );


    /* ============================================================
       CLOSE SIDEBAR AFTER NAVIGATION — MOBILE
    ============================================================ */

    document
        .querySelectorAll(".sidebar .nav-link")
        .forEach(link => {

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

});
