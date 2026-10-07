/* ============================================================
   BBCASHVIA — VIEWER DATA SISWA
   Dummy data + interaksi halaman
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       DATA SISWA
    ======================================================== */

    const siswa = [
        {
            nis: "2026001",
            nama: "Nadia Putri",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026002",
            nama: "Rizky Maulana",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026003",
            nama: "Salsabila Putri",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026004",
            nama: "Fajar Nugraha",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026005",
            nama: "Aulia Rahma",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026006",
            nama: "Dimas Pratama",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026007",
            nama: "Citra Lestari",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026008",
            nama: "Bagas Saputra",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026009",
            nama: "Nabila Zahra",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026010",
            nama: "Rafi Kurniawan",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026011",
            nama: "Aisyah Ramadhani",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026012",
            nama: "Galang Prakoso",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026013",
            nama: "Intan Permata",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026014",
            nama: "Raka Firmansyah",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026015",
            nama: "Dewi Anggraini",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026016",
            nama: "Ardiansyah Putra",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026017",
            nama: "Nisa Maharani",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026018",
            nama: "Fikri Ramadhan",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026019",
            nama: "Putri Amelia",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026020",
            nama: "Rendy Setiawan",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026021",
            nama: "Sarah Nuraini",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026022",
            nama: "Ilham Maulana",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026023",
            nama: "Anisa Fitri",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026024",
            nama: "Yoga Pratama",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026025",
            nama: "Maya Sari",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026026",
            nama: "Daffa Alfarizi",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026027",
            nama: "Lia Oktaviani",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026028",
            nama: "Rian Hidayat",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026029",
            nama: "Vina Aprilia",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026030",
            nama: "Andika Wijaya",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026031",
            nama: "Fani Lestari",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026032",
            nama: "Reza Akbar",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026033",
            nama: "Dinda Safitri",
            gender: "Perempuan",
            status: "Aktif"
        },
        {
            nis: "2026034",
            nama: "Rizal Fadillah",
            gender: "Laki-laki",
            status: "Aktif"
        },
        {
            nis: "2026035",
            nama: "Siti Aulia",
            gender: "Perempuan",
            status: "Tidak Aktif"
        },
        {
            nis: "2026036",
            nama: "Bayu Aditya",
            gender: "Laki-laki",
            status: "Tidak Aktif"
        }
    ];


    /* ========================================================
       ELEMENT
    ======================================================== */

    const tableBody =
        document.getElementById("studentTableBody");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const tableCount =
        document.getElementById("tableCount");

    const emptyState =
        document.getElementById("emptyState");


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

            return;
        }


        emptyState?.classList.remove("show");


        data.forEach((item, index) => {

            const row =
                document.createElement("tr");

            const statusClass =
                item.status === "Aktif"
                    ? "active"
                    : "inactive";


            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    <span class="student-nis">
                        ${item.nis}
                    </span>
                </td>

                <td>
                    <span class="student-name">
                        ${item.nama}
                    </span>
                </td>

                <td>
                    ${item.gender}
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
            tableCount.textContent = data.length;
        }
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


        const filtered =
            siswa.filter((item) => {

                const matchesSearch =
                    item.nama
                        .toLowerCase()
                        .includes(keyword) ||

                    item.nis
                        .toLowerCase()
                        .includes(keyword);


                const matchesStatus =
                    selectedStatus === "all" ||
                    item.status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
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


    /* ========================================================
       INITIAL TABLE
    ======================================================== */

    renderTable(siswa);


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
