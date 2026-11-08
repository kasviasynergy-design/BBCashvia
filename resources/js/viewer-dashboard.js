document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       BBCASHVIA - VIEWER DASHBOARD
       Data berasal dari database (endpoint /data/dashboard*).
       Tidak menggunakan data dummy.
       Read-only dashboard
    ============================================================ */


    /* ============================================================
       ENDPOINT
    ============================================================ */

    const API = {
        ringkasan: "/data/dashboard",
        chart: "/data/dashboard/chart",
        recent: "/data/dashboard/recent"
    };


    /* ============================================================
       STATE (diisi dari server)
    ============================================================ */

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


    /* ============================================================
       HELPER
    ============================================================ */

    const formatRupiah = (value) => {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(value) || 0);

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


    const hitungSaldoSaatIni = () =>
        dataKas.totalPemasukan -
        dataKas.totalPengeluaran;


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

            throw new Error(
                "Tidak dapat terhubung ke server."
            );

        }

        let hasil = {};

        try {
            hasil = await respons.json();
        } catch {
            /* respons bukan JSON */
        }

        if (!respons.ok) {

            throw new Error(
                hasil?.message ||
                "Gagal mengambil data dari server."
            );

        }

        return hasil;

    };


    const escapeHtml = (value) =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");


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


        /* RINGKASAN KAS */

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


        /* MONITORING IURAN */

        const persentaseLunas =
            dataKas.totalSiswa > 0
                ? Math.round(
                    (dataKas.siswaLunas / dataKas.totalSiswa) * 100
                )
                : 0;


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

    };


    /* ============================================================
       INITIALS
    ============================================================ */

    function getInitials(name) {

        return String(name || "-")
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


    const renderTransaksi = () => {

        if (!transactionTableBody) {
            return;
        }


        if (!transaksiTerbaru.length) {

            transactionTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding:24px; color:#64748b;">
                        Belum ada transaksi.
                    </td>
                </tr>
            `;

            return;

        }


        transactionTableBody.innerHTML =
            transaksiTerbaru
                .map((trx) => {

                    return `
                        <tr>

                            <td>
                                <span class="mono-text">
                                    ${escapeHtml(trx.bukti)}
                                </span>
                            </td>

                            <td>
                                <div class="table-person">
                                    <div class="table-avatar">
                                        ${getInitials(trx.siswa)}
                                    </div>

                                    <span>
                                        ${escapeHtml(trx.siswa)}
                                    </span>
                                </div>
                            </td>

                            <td>
                                ${escapeHtml(trx.iuran)}
                            </td>

                            <td>
                                <strong class="nominal">
                                    ${formatRupiah(trx.nominal)}
                                </strong>
                            </td>

                            <td>
                                <span class="method-text">
                                    ${escapeHtml(trx.metode)}
                                </span>
                            </td>

                            <td>
                                ${escapeHtml(trx.tanggal)}
                            </td>

                            <td>
                                <span class="status-pill success">
                                    <span class="status-dot"></span>
                                    ${escapeHtml(trx.status)}
                                </span>
                            </td>

                        </tr>
                    `;

                })
                .join("");

    };


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


        if (!arusBulanan.length) {

            barChart.innerHTML =
                `<p class="chart-empty">Belum ada data grafik.</p>`;

            return;

        }


        const maxValue =
            Math.max(
                1,
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


    /* ============================================================
       LINE CHART
    ============================================================ */

    const lineChart =
        document.getElementById("lineChart");


    function renderLineChart() {

        if (!lineChart) {
            return;
        }


        if (!saldoBulanan.length) {

            lineChart.innerHTML =
                `<p class="chart-empty">Belum ada data saldo.</p>`;

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
            Math.max(1, ...saldoBulanan);


        const pembagi =
            saldoBulanan.length > 1
                ? saldoBulanan.length - 1
                : 1;


        const points =
            saldoBulanan.map((value, index) => {

                const x =
                    leftPadding +
                    (usableWidth / pembagi) *
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

            const label =
                arusBulanan[index]?.bulan ?? "";


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
                    ${label}
                </text>

            `;

        });


        svg += `</svg>`;


        lineChart.innerHTML = svg;

    }


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
       MUAT DATA DARI DATABASE
    ============================================================ */

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


        /* Saldo kumulatif per bulan (untuk grafik garis). */

        let jalan = 0;

        saldoBulanan = arusBulanan.map((item) => {

            jalan += item.masuk - item.keluar;

            return jalan;

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
                bukti: t.id ?? "-",
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

            /* Tetap render nilai nol / kosong agar UI tidak rusak. */

            console.error(err);

        }


        renderStatistik();

        renderTransaksi();

        renderBarChart();

        renderLineChart();

    };


    /* Render awal (kosong), lalu isi dari database. */

    renderBarChart();

    renderLineChart();

    muatSemua();


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


        window.location.href = "/logout";

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
       CLOSE SIDEBAR AFTER NAVIGATION - MOBILE
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
