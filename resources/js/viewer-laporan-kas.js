document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       DATA LAPORAN KAS
    ============================================================ */

    const reports = {

        "oktober-2026": {
            period: "Oktober 2026",
            openingBalance: 480000,

            transactions: [
                {
                    receipt: "TRX-2026-001",
                    date: "01 Okt 2026",
                    type: "Pemasukan",
                    category: "Iuran",
                    description: "Kas Kelas",
                    amount: 20000
                },
                {
                    receipt: "TRX-2026-002",
                    date: "02 Okt 2026",
                    type: "Pemasukan",
                    category: "Iuran",
                    description: "Kebersihan",
                    amount: 10000
                },
                {
                    receipt: "TRX-2026-003",
                    date: "03 Okt 2026",
                    type: "Pengeluaran",
                    category: "Operasional",
                    description: "Alat Kebersihan",
                    amount: 15000
                },
                {
                    receipt: "TRX-2026-004",
                    date: "05 Okt 2026",
                    type: "Pemasukan",
                    category: "Iuran",
                    description: "Kas Kelas",
                    amount: 30000
                },
                {
                    receipt: "TRX-2026-005",
                    date: "06 Okt 2026",
                    type: "Pengeluaran",
                    category: "Kegiatan",
                    description: "Dekorasi Kelas",
                    amount: 10000
                },
                {
                    receipt: "TRX-2026-006",
                    date: "08 Okt 2026",
                    type: "Pemasukan",
                    category: "Iuran",
                    description: "Kegiatan Kelas",
                    amount: 25000
                }
            ]
        },

        "september-2026": {
            period: "September 2026",
            openingBalance: 250000,

            transactions: [
                {
                    receipt: "TRX-2026-101",
                    date: "02 Sep 2026",
                    type: "Pemasukan",
                    category: "Iuran",
                    description: "Kas Kelas",
                    amount: 30000
                },
                {
                    receipt: "TRX-2026-102",
                    date: "05 Sep 2026",
                    type: "Pemasukan",
                    category: "Iuran",
                    description: "Kebersihan",
                    amount: 15000
                },
                {
                    receipt: "TRX-2026-103",
                    date: "08 Sep 2026",
                    type: "Pengeluaran",
                    category: "Operasional",
                    description: "Perlengkapan Kelas",
                    amount: 20000
                }
            ]
        },

        "agustus-2026": {
            period: "Agustus 2026",
            openingBalance: 100000,

            transactions: [
                {
                    receipt: "TRX-2026-201",
                    date: "03 Agu 2026",
                    type: "Pemasukan",
                    category: "Iuran",
                    description: "Kas Kelas",
                    amount: 50000
                },
                {
                    receipt: "TRX-2026-202",
                    date: "07 Agu 2026",
                    type: "Pengeluaran",
                    category: "Kegiatan",
                    description: "Kegiatan Kelas",
                    amount: 25000
                }
            ]
        }

    };


    /* ============================================================
       ELEMENT
    ============================================================ */

    const periodFilter =
        document.getElementById("periodFilter");

    const periodTitle =
        document.getElementById("periodTitle");

    const openingBalance =
        document.getElementById("openingBalance");

    const incomeAmount =
        document.getElementById("incomeAmount");

    const expenseAmount =
        document.getElementById("expenseAmount");

    const closingBalance =
        document.getElementById("closingBalance");

    const reportTableBody =
        document.getElementById("reportTableBody");

    const tableCount =
        document.getElementById("tableCount");

    const emptyState =
        document.getElementById("emptyState");


    /* ============================================================
       FORMAT RUPIAH
    ============================================================ */

    const formatCurrency = (value) => {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(value);

    };


    /* ============================================================
       UPDATE REPORT
    ============================================================ */

    const renderReport = (report) => {

        const transactions =
            report.transactions;

        const income = transactions
            .filter(item =>
                item.type === "Pemasukan"
            )
            .reduce(
                (total, item) =>
                    total + item.amount,
                0
            );

        const expense = transactions
            .filter(item =>
                item.type === "Pengeluaran"
            )
            .reduce(
                (total, item) =>
                    total + item.amount,
                0
            );

        const closing =
            report.openingBalance +
            income -
            expense;


        periodTitle.textContent =
            report.period;

        openingBalance.textContent =
            formatCurrency(
                report.openingBalance
            );

        incomeAmount.textContent =
            formatCurrency(income);

        expenseAmount.textContent =
            formatCurrency(expense);

        closingBalance.textContent =
            formatCurrency(closing);


        reportTableBody.innerHTML = "";


        if (transactions.length === 0) {

            emptyState.classList.add("show");

            tableCount.textContent =
                "Tidak ada transaksi";

            return;
        }


        emptyState.classList.remove("show");


        transactions.forEach((item, index) => {

            const row =
                document.createElement("tr");

            const typeClass =
                item.type === "Pemasukan"
                    ? "income"
                    : "expense";

            const prefix =
                item.type === "Pemasukan"
                    ? "+"
                    : "-";


            row.innerHTML = `
                <td>
                    ${index + 1}
                </td>

                <td>
                    <span class="receipt-number">
                        ${item.receipt}
                    </span>
                </td>

                <td>
                    ${item.date}
                </td>

                <td>
                    <span class="report-type ${typeClass}">
                        ${item.type}
                    </span>
                </td>

                <td>
                    <span class="report-category">
                        ${item.category}
                    </span>
                </td>

                <td>
                    <span class="report-description">
                        ${item.description}
                    </span>
                </td>

                <td>
                    <span class="report-nominal ${typeClass}">
                        ${prefix}${formatCurrency(item.amount)}
                    </span>
                </td>
            `;

            reportTableBody.appendChild(row);

        });


        tableCount.textContent =
            `Menampilkan ${transactions.length} transaksi`;

    };


    /* ============================================================
       PERIOD FILTER
    ============================================================ */

    periodFilter.addEventListener(
        "change",
        () => {

            const selectedPeriod =
                periodFilter.value;

            const selectedReport =
                reports[selectedPeriod];

            if (selectedReport) {
                renderReport(selectedReport);
            }

        }
    );


    /* ============================================================
       PROFILE DROPDOWN
    ============================================================ */

    const profileButton =
        document.getElementById("profileButton");

    const profileWrapper =
        document.querySelector(".profile-wrapper");

    const profileDropdown =
        document.getElementById("profileDropdown");


    if (
        profileButton &&
        profileWrapper &&
        profileDropdown
    ) {

        profileButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                profileWrapper.classList.toggle("open");

            }
        );


        profileDropdown.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );


        document.addEventListener(
            "click",
            () => {

                profileWrapper.classList.remove(
                    "open"
                );

            }
        );

    }


    /* ============================================================
       LOGOUT
    ============================================================ */

    const confirmLogout = () => {

        const confirmed = window.confirm(
            "Apakah kamu yakin ingin keluar dari akun Viewer?"
        );

        if (confirmed) {
            window.location.href = "/";
        }

    };


    const logoutButton =
        document.getElementById("logoutButton");

    const dropdownLogout =
        document.getElementById("dropdownLogout");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            confirmLogout
        );

    }


    if (dropdownLogout) {

        dropdownLogout.addEventListener(
            "click",
            confirmLogout
        );

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

        sidebar.classList.add("open");

        sidebarBackdrop.classList.add("show");

        document.body.classList.add(
            "nav-open"
        );

    };


    const closeSidebar = () => {

        sidebar.classList.remove("open");

        sidebarBackdrop.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "nav-open"
        );

    };


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarBackdrop) {

        sidebarBackdrop.addEventListener(
            "click",
            closeSidebar
        );

    }


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (window.innerWidth <= 900) {
                    closeSidebar();
                }

            }
        );

    });


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeSidebar();

                if (profileWrapper) {

                    profileWrapper.classList.remove(
                        "open"
                    );

                }

            }

        }
    );


    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {
                closeSidebar();
            }

        }
    );


    /* ============================================================
       INITIAL LOAD
    ============================================================ */

    renderReport(
        reports["oktober-2026"]
    );

});
