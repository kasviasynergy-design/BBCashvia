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
        const tanggalIso = String(t.tanggal ?? "").slice(0, 10);

        return {
            receipt: t.no_bukti || ("TRX-" + (t.id_transaksi ?? "")),
            tanggalIso,
            date: formatTanggal(tanggalIso),
            type: (jenisDb === "PENGELUARAN" || jenisDb === "K") ? "Pengeluaran" : "Pemasukan",
            kategoriMentah: String(t.kategori ?? ""),
            category: labelKategori(t.kategori),
            description: t.keterangan || t.nama_pembayar || "-",
            // Satu pembayaran multi-iuran sudah diagregasi backend.
            amount: Number(t.nominal_grup ?? t.nominal) || 0,
            kelas: t.nama_kelas || "-",
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
            // Periode dikirim ke server supaya ringkasan & daftar
            // dihitung dari query yang sama. Kelas tetap dikunci
            // oleh hak akses pengguna (tanpa parameter id_kelas).
            const parameter = new URLSearchParams();

            if (dariInput?.value) parameter.set("dari", dariInput.value);
            if (sampaiInput?.value) parameter.set("sampai", sampaiInput.value);

            const url = parameter.toString()
                ? `${API_URL}?${parameter.toString()}`
                : API_URL;

            const hasil = await permintaanAPI(url);

            const data =
                Array.isArray(hasil.data) ? hasil.data : [];

            // Satu no_bukti = satu transaksi utama, meski pembayaran
            // terdiri dari beberapa baris iuran.
            const perBukti = new Map();

            data.forEach((t) => {
                const kunci = t.no_bukti || ("TRX-" + (t.id_transaksi ?? ""));
                if (!perBukti.has(kunci)) perBukti.set(kunci, t);
            });

            transactions = Array.from(perBukti.values())
                .map(petakanTransaksi);

            isiPilihanKategori();
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
        document.getElementById("riwayatTableBody");

    const searchInput =
        document.getElementById("searchInput");

    /* Select lama bernama statusFilter berisi pilihan jenis transaksi. */
    const typeFilter =
        document.getElementById("statusFilter");

    const statusFilter = typeFilter;

    const categoryFilter =
        document.getElementById("categoryFilter");

    const dariInput =
        document.getElementById("dariTanggal");

    const sampaiInput =
        document.getElementById("sampaiTanggal");

    const tableCount =
        document.getElementById("tableCount");

    const emptyState =
        document.getElementById("emptyState");

    const ringkasanTransaksi =
        document.getElementById("ringkasanTransaksi");

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

        if (totalTransactions) totalTransactions.textContent = data.length;
        if (totalIncome) totalIncome.textContent = formatCurrency(income);
        if (totalExpense) totalExpense.textContent = formatCurrency(expense);
        if (cashBalance) cashBalance.textContent = formatCurrency(balance);

        if (ringkasanTransaksi) {
            ringkasanTransaksi.textContent =
                `${data.length} transaksi • Pemasukan ${formatCurrency(income)} • ` +
                `Pengeluaran ${formatCurrency(expense)} • Saldo ${formatCurrency(balance)}`;
        }

    };


    /* ============================================================
       RENDER TABLE
    ============================================================ */

    const renderTable = (data) => {

        if (!tableBody) return;

        tableBody.innerHTML = "";

        if (data.length === 0) {

            emptyState?.classList.add("show");

            if (tableCount) {
                tableCount.textContent = "Tidak ada transaksi";
            }

            return;
        }

        emptyState?.classList.remove("show");

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
                        ${escapeHtml(item.receipt)}
                    </span>
                </td>

                <td>
                    ${escapeHtml(item.date)}
                </td>

                <td>
                    <span class="transaction-type ${typeClass}">
                        ${escapeHtml(item.type)}
                    </span>
                </td>

                <td>
                    <span class="transaction-category">
                        ${escapeHtml(item.category)}
                    </span>
                </td>

                <td>
                    <span class="transaction-description">
                        ${escapeHtml(item.description)}
                        <span class="transaction-category">${escapeHtml(item.kelas)}</span>
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

        if (tableCount) {
            tableCount.textContent =
                `Menampilkan ${data.length} transaksi`;
        }

    };


    /* ============================================================
       FILTER
    ============================================================ */

    const filterData = () => {

        const search =
            (searchInput?.value ?? "")
                .trim()
                .toLowerCase();

        /* Nilai lama: all | masuk | keluar. */
        const selectedType =
            typeFilter?.value ?? "all";

        const jenisLabel =
            selectedType === "masuk"
                ? "Pemasukan"
                : selectedType === "keluar"
                    ? "Pengeluaran"
                    : null;

        const selectedCategory =
            categoryFilter?.value ?? "all";

        const dari = dariInput?.value ?? "";
        const sampai = sampaiInput?.value ?? "";

        const filtered = transactions.filter(item => {

            const matchesSearch =
                !search ||
                String(item.receipt).toLowerCase().includes(search) ||
                String(item.description).toLowerCase().includes(search) ||
                String(item.category).toLowerCase().includes(search) ||
                String(item.kelas).toLowerCase().includes(search);

            const matchesType =
                !jenisLabel || item.type === jenisLabel;

            const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;

            /* Server sudah memfilter periode; ini pengaman bila
               pengguna mengubah tanggal sebelum data selesai dimuat. */
            const matchesPeriode =
                (!dari || item.tanggalIso >= dari) &&
                (!sampai || item.tanggalIso <= sampai);

            return (
                matchesSearch &&
                matchesType &&
                matchesCategory &&
                matchesPeriode
            );

        });

        renderTable(filtered);
        updateSummary(filtered);

    };


    /* ============================================================
       EVENT FILTER
    ============================================================ */

    searchInput?.addEventListener(
        "input",
        filterData
    );

    typeFilter?.addEventListener(
        "change",
        filterData
    );

    categoryFilter?.addEventListener(
        "change",
        filterData
    );

    /* Periode dikirim ulang ke server agar ringkasan ikut berubah. */
    dariInput?.addEventListener("change", muatData);
    sampaiInput?.addEventListener("change", muatData);


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
