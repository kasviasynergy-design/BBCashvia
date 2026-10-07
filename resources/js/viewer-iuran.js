/* ============================================================
   BBCASHVIA — VIEWER IURAN
   Dummy data + interaksi halaman
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       DATA IURAN
    ======================================================== */

    const iuran = [
        {
            nama: "Kas Kelas",
            periode: "Oktober 2026",
            nominal: 20000,
            jatuhTempo: "10 Okt 2026",
            status: "Lunas"
        },
        {
            nama: "Kebersihan",
            periode: "Oktober 2026",
            nominal: 10000,
            jatuhTempo: "15 Okt 2026",
            status: "Belum Lunas"
        },
        {
            nama: "Kegiatan Kelas",
            periode: "Oktober 2026",
            nominal: 25000,
            jatuhTempo: "20 Okt 2026",
            status: "Lunas"
        }
    ];


    /* ========================================================
       ELEMENT
    ======================================================== */

    const tableBody =
        document.getElementById("iuranTableBody");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const periodFilter =
        document.getElementById("periodFilter");

    const tableCount =
        document.getElementById("tableCount");

    const emptyState =
        document.getElementById("emptyState");

    const totalIuran =
        document.getElementById("totalIuran");

    const sudahDibayar =
        document.getElementById("sudahDibayar");

    const belumDibayar =
        document.getElementById("belumDibayar");

    const totalTagihan =
        document.getElementById("totalTagihan");


    /* ========================================================
       FORMAT RUPIAH
    ======================================================== */

    function formatRupiah(value) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0
            }
        ).format(value);
    }


    /* ========================================================
       UPDATE RINGKASAN
    ======================================================== */

    function updateSummary(data) {

        const total =
            data.length;

        const lunas =
            data.filter(
                (item) => item.status === "Lunas"
            ).length;

        const belumLunas =
            data.filter(
                (item) => item.status === "Belum Lunas"
            ).length;

        const tagihan =
            data.reduce(
                (sum, item) => sum + item.nominal,
                0
            );


        if (totalIuran) {
            totalIuran.textContent = total;
        }

        if (sudahDibayar) {
            sudahDibayar.textContent = lunas;
        }

        if (belumDibayar) {
            belumDibayar.textContent = belumLunas;
        }

        if (totalTagihan) {
            totalTagihan.textContent =
                formatRupiah(tagihan);
        }
    }


    /* ========================================================
       RENDER TABLE
    ======================================================== */

    function renderTable(data) {

        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";


        if (data.length === 0) {

            emptyState?.classList.add("show");

            if (tableCount) {
                tableCount.textContent = "0";
            }

            updateSummary(data);

            return;
        }


        emptyState?.classList.remove("show");


        data.forEach((item, index) => {

            const row =
                document.createElement("tr");


            const statusClass =
                item.status === "Lunas"
                    ? "lunas"
                    : "belum-lunas";


            row.innerHTML = `
                <td>
                    ${index + 1}
                </td>

                <td>
                    <span class="iuran-name">
                        ${item.nama}
                    </span>
                </td>

                <td>
                    <span class="iuran-period">
                        ${item.periode}
                    </span>
                </td>

                <td>
                    <span class="iuran-nominal">
                        ${formatRupiah(item.nominal)}
                    </span>
                </td>

                <td>
                    <span class="iuran-deadline">
                        ${item.jatuhTempo}
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
                data.length;
        }


        updateSummary(data);
    }


    /* ========================================================
       FILTER
    ======================================================== */

    function filterData() {

        const keyword =
            searchInput?.value
                .trim()
                .toLowerCase() || "";


        const selectedStatus =
            statusFilter?.value || "all";


        const selectedPeriod =
            periodFilter?.value || "all";


        const filtered =
            iuran.filter((item) => {

                const matchesSearch =
                    item.nama
                        .toLowerCase()
                        .includes(keyword) ||

                    item.periode
                        .toLowerCase()
                        .includes(keyword);


                const matchesStatus =
                    selectedStatus === "all" ||
                    item.status === selectedStatus;


                const matchesPeriod =
                    selectedPeriod === "all" ||
                    item.periode === selectedPeriod;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPeriod
                );
            });


        renderTable(filtered);
    }


    searchInput?.addEventListener(
        "input",
        filterData
    );


    statusFilter?.addEventListener(
        "change",
        filterData
    );


    periodFilter?.addEventListener(
        "change",
        filterData
    );


    /* ========================================================
       INITIAL TABLE
    ======================================================== */

    renderTable(iuran);


    /* ========================================================
       PROFILE DROPDOWN
    ======================================================== */

    const profileButton =
        document.getElementById("profileButton");

    const profileWrapper =
        document.querySelector(".profile-wrapper");


    profileButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            profileWrapper?.classList.toggle("open");
        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                profileWrapper &&
                !profileWrapper.contains(event.target)
            ) {
                profileWrapper.classList.remove("open");
            }
        }
    );


    /* ========================================================
       LOGOUT
    ======================================================== */

    function confirmLogout() {

        const confirmed =
            window.confirm(
                "Apakah kamu yakin ingin keluar dari akun Viewer?"
            );


        if (!confirmed) {
            return;
        }


        window.location.href = "/";
    }


    document
        .getElementById("logoutButton")
        ?.addEventListener(
            "click",
            confirmLogout
        );


    document
        .getElementById("dropdownLogout")
        ?.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                profileWrapper?.classList.remove("open");

                confirmLogout();
            }
        );


    /* ========================================================
       MOBILE SIDEBAR
    ======================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");

    const menuToggle =
        document.getElementById("menuToggle");


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


    menuToggle?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            const isOpen =
                sidebar?.classList.contains("open");


            if (isOpen) {
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


    /* ========================================================
       CLOSE SIDEBAR AFTER NAVIGATION
    ======================================================== */

    sidebar
        ?.querySelectorAll(".nav-link")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 900
                    ) {
                        closeSidebar();
                    }
                }
            );
        });


    /* ========================================================
       ESCAPE
    ======================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            closeSidebar();

            profileWrapper?.classList.remove("open");
        }
    );


    /* ========================================================
       RESPONSIVE CLEANUP
    ======================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {
                closeSidebar();
            }
        }
    );

});
