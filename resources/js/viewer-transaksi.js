/* ============================================================
   BBCASHVIA — VIEWER TRANSAKSI
   Dummy data + interaksi UI
============================================================ */


/* ============================================================
   DATA TRANSAKSI SAYA
============================================================ */

const myTransactions = [
    {
        noBukti: "TRX-2026-001",
        tanggal: "01 Okt 2026",
        iuran: "Kas Kelas",
        periode: "Oktober 2026",
        nominal: 20000,
        metode: "Tunai",
        status: "Berhasil"
    },
    {
        noBukti: "TRX-2026-002",
        tanggal: "05 Okt 2026",
        iuran: "Kebersihan",
        periode: "Oktober 2026",
        nominal: 10000,
        metode: "Tunai",
        status: "Berhasil"
    },
    {
        noBukti: "TRX-2026-003",
        tanggal: "08 Okt 2026",
        iuran: "Kegiatan Kelas",
        periode: "Oktober 2026",
        nominal: 25000,
        metode: "Transfer",
        status: "Berhasil"
    }
];


/* ============================================================
   DATA TRANSAKSI KAS KELAS
============================================================ */

const classTransactions = [
    {
        noBukti: "TRX-2026-001",
        tanggal: "01 Okt 2026",
        jenis: "Pemasukan",
        kategori: "Iuran",
        keterangan: "Kas Kelas",
        nominal: 20000
    },
    {
        noBukti: "TRX-2026-002",
        tanggal: "02 Okt 2026",
        jenis: "Pemasukan",
        kategori: "Iuran",
        keterangan: "Kebersihan",
        nominal: 10000
    },
    {
        noBukti: "TRX-2026-003",
        tanggal: "03 Okt 2026",
        jenis: "Pengeluaran",
        kategori: "Operasional",
        keterangan: "Alat Kebersihan",
        nominal: 15000
    }
];


/* ============================================================
   FORMAT RUPIAH
============================================================ */

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


/* ============================================================
   TRANSAKSI SAYA
============================================================ */

const myTableBody =
    document.getElementById("myTransactionTableBody");

const mySearchInput =
    document.getElementById("mySearchInput");

const myStatusFilter =
    document.getElementById("myStatusFilter");

const myTableCount =
    document.getElementById("myTableCount");

const myEmptyState =
    document.getElementById("myEmptyState");


function renderMyTransactions(data) {

    if (!myTableBody) {
        return;
    }

    myTableBody.innerHTML = "";


    if (data.length === 0) {

        myEmptyState?.classList.add("show");

        if (myTableCount) {
            myTableCount.textContent = "0";
        }

        return;
    }


    myEmptyState?.classList.remove("show");


    data.forEach((item, index) => {

        const row =
            document.createElement("tr");


        const statusClass =
            item.status === "Berhasil"
                ? ""
                : "pending";


        row.innerHTML = `
            <td>
                ${index + 1}
            </td>

            <td>
                <span class="receipt-number">
                    ${item.noBukti}
                </span>
            </td>

            <td>
                ${item.tanggal}
            </td>

            <td>
                <span class="transaction-name">
                    ${item.iuran}
                </span>
            </td>

            <td>
                ${item.periode}
            </td>

            <td>
                <span class="transaction-nominal income">
                    ${formatRupiah(item.nominal)}
                </span>
            </td>

            <td>
                ${item.metode}
            </td>

            <td>
                <span class="status-badge ${statusClass}">
                    ${item.status}
                </span>
            </td>
        `;


        myTableBody.appendChild(row);

    });


    if (myTableCount) {
        myTableCount.textContent = data.length;
    }

}


function filterMyTransactions() {

    const keyword =
        mySearchInput?.value
            .trim()
            .toLowerCase() || "";


    const selectedStatus =
        myStatusFilter?.value || "all";


    const filtered =
        myTransactions.filter((item) => {

            const matchesSearch =
                item.noBukti
                    .toLowerCase()
                    .includes(keyword) ||

                item.iuran
                    .toLowerCase()
                    .includes(keyword) ||

                item.periode
                    .toLowerCase()
                    .includes(keyword);


            const matchesStatus =
                selectedStatus === "all" ||
                item.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    renderMyTransactions(filtered);

}


mySearchInput?.addEventListener(
    "input",
    filterMyTransactions
);


myStatusFilter?.addEventListener(
    "change",
    filterMyTransactions
);


renderMyTransactions(myTransactions);


/* ============================================================
   TRANSAKSI KAS KELAS
============================================================ */

const classTableBody =
    document.getElementById("classTransactionTableBody");

const classSearchInput =
    document.getElementById("classSearchInput");

const classTypeFilter =
    document.getElementById("classTypeFilter");

const classTableCount =
    document.getElementById("classTableCount");

const classEmptyState =
    document.getElementById("classEmptyState");


function renderClassTransactions(data) {

    if (!classTableBody) {
        return;
    }

    classTableBody.innerHTML = "";


    if (data.length === 0) {

        classEmptyState?.classList.add("show");

        if (classTableCount) {
            classTableCount.textContent = "0";
        }

        return;
    }


    classEmptyState?.classList.remove("show");


    data.forEach((item, index) => {

        const row =
            document.createElement("tr");


        const typeClass =
            item.jenis === "Pemasukan"
                ? "income"
                : "expense";


        const nominalClass =
            item.jenis === "Pemasukan"
                ? "income"
                : "expense";


        const prefix =
            item.jenis === "Pemasukan"
                ? "+"
                : "-";


        row.innerHTML = `
            <td>
                ${index + 1}
            </td>

            <td>
                <span class="receipt-number">
                    ${item.noBukti}
                </span>
            </td>

            <td>
                ${item.tanggal}
            </td>

            <td>
                <span class="transaction-type ${typeClass}">
                    ${item.jenis}
                </span>
            </td>

            <td>
                ${item.kategori}
            </td>

            <td>
                <span class="transaction-name">
                    ${item.keterangan}
                </span>
            </td>

            <td>
                <span class="transaction-nominal ${nominalClass}">
                    ${prefix}${formatRupiah(item.nominal)}
                </span>
            </td>
        `;


        classTableBody.appendChild(row);

    });


    if (classTableCount) {
        classTableCount.textContent = data.length;
    }

}


function filterClassTransactions() {

    const keyword =
        classSearchInput?.value
            .trim()
            .toLowerCase() || "";


    const selectedType =
        classTypeFilter?.value || "all";


    const filtered =
        classTransactions.filter((item) => {

            const matchesSearch =
                item.noBukti
                    .toLowerCase()
                    .includes(keyword) ||

                item.kategori
                    .toLowerCase()
                    .includes(keyword) ||

                item.keterangan
                    .toLowerCase()
                    .includes(keyword);


            const matchesType =
                selectedType === "all" ||
                item.jenis === selectedType;


            return matchesSearch && matchesType;

        });


    renderClassTransactions(filtered);

}


classSearchInput?.addEventListener(
    "input",
    filterClassTransactions
);


classTypeFilter?.addEventListener(
    "change",
    filterClassTransactions
);


renderClassTransactions(classTransactions);


/* ============================================================
   PROFILE DROPDOWN
============================================================ */

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


/* ============================================================
   LOGOUT
============================================================ */

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


/* ============================================================
   MOBILE SIDEBAR
============================================================ */

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


/* ============================================================
   NAVIGATION MOBILE
============================================================ */

sidebar
    ?.querySelectorAll(".nav-link")
    .forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                if (window.innerWidth <= 900) {
                    closeSidebar();
                }

            }
        );

    });


/* ============================================================
   ESCAPE
============================================================ */

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


/* ============================================================
   RESPONSIVE CLEANUP
============================================================ */

window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 900) {
            closeSidebar();
        }

    }
);
