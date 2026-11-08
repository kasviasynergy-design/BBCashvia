document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       DATA RIWAYAT TRANSAKSI (DARI DATABASE)
    ============================================================ */

    let transactions = [];


    /* ============================================================
       AKSES API
    ============================================================ */

    const API_URL = "/data/transaksi";

    const BULAN_SINGKAT = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];

    /* Pemetaan nilai kategori database ke label yang enak dibaca. */
    const PETAKAN_KATEGORI = {
        "iuran": "Iuran",
        "kas": "Kas",
        "kebutuhan kelas": "Kebutuhan Kelas",
        "perlengkapan kelas": "Perlengkapan Kelas",
        "kegiatan kelas": "Kegiatan Kelas",
        "pemasukan lainnya": "Pemasukan Lainnya",
        "pengeluaran lainnya": "Pengeluaran Lainnya"
    };

    const labelKategori = (kategori) => {

        const kunci = String(kategori || "").toLowerCase();

        return PETAKAN_KATEGORI[kunci] || (kategori || "-");

    };


    /* Amankan teks sebelum dimasukkan ke HTML. */
    const escapeHtml = (teks) => {

        return String(teks ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    };


    const permintaanAPI = async (url, opsi = {}) => {

        let respons;

        try {
            respons = await fetch(url, {
                ...opsi,
                headers: {
                    Accept: "application/json",
                    ...(opsi.headers || {})
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
            // Respons bukan JSON.
        }

        if (!respons.ok) {
            throw new Error(
                hasil?.message || "Gagal memuat data transaksi."
            );
        }

        return hasil;
    };


    const formatTanggal = (nilai) => {

        const iso = String(nilai ?? "").slice(0, 10);
        const bagian = iso.split("-");

        if (bagian.length !== 3) {
            return iso;
        }

        const bulan = Number(bagian[1]);

        return `${bagian[2]} ${BULAN_SINGKAT[bulan - 1] ?? bagian[1]} ${bagian[0]}`;
    };


    const petakanTransaksi = (t) => {

        const jenisDb = String(t.jenis ?? "").toUpperCase();

        return {
            receipt: t.no_bukti || ("TRX-" + (t.id_transaksi ?? "")),
            date: formatTanggal(t.tanggal),
            type: (jenisDb === "PENGELUARAN" || jenisDb === "K") ? "Pengeluaran" : "Pemasukan",
            category: labelKategori(t.kategori),
            description: t.keterangan || t.nama_pembayar || "-",
            amount: Number(t.nominal) || 0,
            status: "Berhasil"
        };
    };


    /* Isi pilihan kategori filter dari kategori nyata di database. */
    const isiPilihanKategori = () => {

        if (!categoryFilter) return;

        const nilaiLama = categoryFilter.value;

        const daftar = [...new Set(
            transactions
                .map((t) => String(t.category ?? "").trim())
                .filter(Boolean)
        )].sort((a, b) => a.localeCompare(b, "id"));

        categoryFilter.innerHTML =
            `<option value="all">Semua Kategori</option>` +
            daftar
                .map((k) => `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`)
                .join("");

        if ([...categoryFilter.options].some((o) => o.value === nilaiLama)) {
            categoryFilter.value = nilaiLama;
        }
    };


    const muatData = async () => {

        try {
            const hasil = await permintaanAPI(API_URL);

            const data =
                Array.isArray(hasil.data) ? hasil.data : [];

            transactions = data.map(petakanTransaksi);

            filterData();
        } catch (error) {

            console.error(
                "Gagal memuat data transaksi:",
                error
            );

            transactions = [];

            filterData();
        }
    };


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
            window.location.href = "/logout";
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

    muatData();

});
