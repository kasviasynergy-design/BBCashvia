document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       DATA DUMMY RIWAYAT TRANSAKSI
    ============================================================ */

    const transactions = [
        {
            no: 1,
            receipt: "TRX-2026-001",
            date: "01 Okt 2026",
            type: "Pemasukan",
            category: "Iuran",
            description: "Kas Kelas",
            amount: 20000,
            status: "Berhasil"
        },
        {
            no: 2,
            receipt: "TRX-2026-002",
            date: "02 Okt 2026",
            type: "Pemasukan",
            category: "Iuran",
            description: "Kebersihan",
            amount: 10000,
            status: "Berhasil"
        },
        {
            no: 3,
            receipt: "TRX-2026-003",
            date: "03 Okt 2026",
            type: "Pengeluaran",
            category: "Operasional",
            description: "Alat Kebersihan",
            amount: 15000,
            status: "Berhasil"
        },
        {
            no: 4,
            receipt: "TRX-2026-004",
            date: "05 Okt 2026",
            type: "Pemasukan",
            category: "Iuran",
            description: "Kas Kelas",
            amount: 25000,
            status: "Berhasil"
        },
        {
            no: 5,
            receipt: "TRX-2026-005",
            date: "06 Okt 2026",
            type: "Pengeluaran",
            category: "Kegiatan",
            description: "Dekorasi Kelas",
            amount: 10000,
            status: "Berhasil"
        },
        {
            no: 6,
            receipt: "TRX-2026-006",
            date: "08 Okt 2026",
            type: "Pemasukan",
            category: "Iuran",
            description: "Kegiatan Kelas",
            amount: 0,
            status: "Dibatalkan"
        }
    ];


    /* ============================================================
       ELEMENT
    ============================================================ */

    const tableBody =
        document.getElementById("transactionTableBody");

    const searchInput =
        document.getElementById("searchInput");

    const typeFilter =
        document.getElementById("typeFilter");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const tableCount =
        document.getElementById("tableCount");

    const emptyState =
        document.getElementById("emptyState");

    const totalTransactions =
        document.getElementById("totalTransactions");

    const totalIncome =
        document.getElementById("totalIncome");

    const totalExpense =
        document.getElementById("totalExpense");

    const cashBalance =
        document.getElementById("cashBalance");


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
       UPDATE SUMMARY
    ============================================================ */

    const updateSummary = (data) => {

        const income = data
            .filter(item =>
                item.type === "Pemasukan" &&
                item.status === "Berhasil"
            )
            .reduce((total, item) => total + item.amount, 0);

        const expense = data
            .filter(item =>
                item.type === "Pengeluaran" &&
                item.status === "Berhasil"
            )
            .reduce((total, item) => total + item.amount, 0);

        const balance = income - expense;

        totalTransactions.textContent = data.length;
        totalIncome.textContent = formatCurrency(income);
        totalExpense.textContent = formatCurrency(expense);
        cashBalance.textContent = formatCurrency(balance);

    };


    /* ============================================================
       RENDER TABLE
    ============================================================ */

    const renderTable = (data) => {

        tableBody.innerHTML = "";

        if (data.length === 0) {

            emptyState.classList.add("show");

            tableCount.textContent =
                "Tidak ada transaksi";

            return;
        }

        emptyState.classList.remove("show");

        data.forEach((item, index) => {

            const row = document.createElement("tr");

            const typeClass =
                item.type === "Pemasukan"
                    ? "income"
                    : "expense";

            const statusClass =
                item.status === "Berhasil"
                    ? "success"
                    : "cancelled";

            const amountPrefix =
                item.type === "Pemasukan"
                    ? "+"
                    : "-";

            row.innerHTML = `
                <td>
                    <span class="transaction-number">
                        ${index + 1}
                    </span>
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
                    <span class="transaction-type ${typeClass}">
                        ${item.type}
                    </span>
                </td>

                <td>
                    <span class="transaction-category">
                        ${item.category}
                    </span>
                </td>

                <td>
                    <span class="transaction-description">
                        ${item.description}
                    </span>
                </td>

                <td>
                    <span class="transaction-nominal ${typeClass}">
                        ${amountPrefix}${formatCurrency(item.amount)}
                    </span>
                </td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${item.status}
                    </span>
                </td>
            `;

            tableBody.appendChild(row);

        });

        tableCount.textContent =
            `Menampilkan ${data.length} transaksi`;

    };


    /* ============================================================
       FILTER
    ============================================================ */

    const filterData = () => {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();

        const selectedType =
            typeFilter.value;

        const selectedCategory =
            categoryFilter.value;

        const selectedStatus =
            statusFilter.value;

        const filtered = transactions.filter(item => {

            const matchesSearch =
                item.receipt.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search);

            const matchesType =
                selectedType === "all" ||
                item.type === selectedType;

            const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;

            const matchesStatus =
                selectedStatus === "all" ||
                item.status === selectedStatus;

            return (
                matchesSearch &&
                matchesType &&
                matchesCategory &&
                matchesStatus
            );

        });

        renderTable(filtered);
        updateSummary(filtered);

    };


    /* ============================================================
       EVENT FILTER
    ============================================================ */

    searchInput.addEventListener(
        "input",
        filterData
    );

    typeFilter.addEventListener(
        "change",
        filterData
    );

    categoryFilter.addEventListener(
        "change",
        filterData
    );

    statusFilter.addEventListener(
        "change",
        filterData
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

        document.body.classList.add("nav-open");

    };


    const closeSidebar = () => {

        sidebar.classList.remove("open");
        sidebarBackdrop.classList.remove("show");

        document.body.classList.remove("nav-open");

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

        link.addEventListener("click", () => {

            if (window.innerWidth <= 900) {
                closeSidebar();
            }

        });

    });


    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeSidebar();

            if (profileWrapper) {
                profileWrapper.classList.remove("open");
            }

        }

    });


    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeSidebar();
        }

    });


    /* ============================================================
       INITIAL RENDER
    ============================================================ */

    renderTable(transactions);
    updateSummary(transactions);

});
