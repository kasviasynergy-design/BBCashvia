document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /*
    |--------------------------------------------------------------------------
    | DATA DEMO SISWA
    |--------------------------------------------------------------------------
    | Sementara hanya XI RPL 1.
    | Nanti diganti dengan data dari database Laravel.
    |--------------------------------------------------------------------------
    */

    const SISWA = [
        {
            id: 1,
            nama: "Azis Nugraha",
            nisn: "0061234567",
            kelas: "XI RPL 1"
        },
        {
            id: 2,
            nama: "Budi Setiawan",
            nisn: "0061234568",
            kelas: "XI RPL 1"
        },
        {
            id: 3,
            nama: "Citra Lestari",
            nisn: "0061234569",
            kelas: "XI RPL 1"
        },
        {
            id: 4,
            nama: "Dimas Pratama",
            nisn: "0061234570",
            kelas: "XI RPL 1"
        },
        {
            id: 5,
            nama: "Eka Putri",
            nisn: "0061234571",
            kelas: "XI RPL 1"
        },
        {
            id: 6,
            nama: "Fajar Ramadhan",
            nisn: "0061234572",
            kelas: "XI RPL 1"
        },
        {
            id: 7,
            nama: "Gita Maharani",
            nisn: "0061234573",
            kelas: "XI RPL 1"
        },
        {
            id: 8,
            nama: "Hendra Wijaya",
            nisn: "0061234574",
            kelas: "XI RPL 1"
        },
        {
            id: 9,
            nama: "Intan Permata",
            nisn: "0061234575",
            kelas: "XI RPL 1"
        },
        {
            id: 10,
            nama: "Joko Saputra",
            nisn: "0061234576",
            kelas: "XI RPL 1"
        }
    ];


    /*
    |--------------------------------------------------------------------------
    | DATA IURAN DEMO
    |--------------------------------------------------------------------------
    | pembayaran hanya digunakan untuk menampilkan status pembayaran.
    | Pencatatan pembayaran sebenarnya nanti dilakukan melalui Transaksi.
    |--------------------------------------------------------------------------
    */

    let iuranData = [
        {
            id: 1,
            nama: "Kas Kelas",
            frekuensi: "mingguan",
            jatuhTempo: "2026-10-10",
            nominal: 10000,
            status: "aktif",
            keterangan: "Kas rutin kelas setiap minggu.",
            pembayaran: [1, 2, 4, 6, 8, 10]
        },
        {
            id: 2,
            nama: "Kas Bulanan",
            frekuensi: "bulanan",
            jatuhTempo: "2026-10-31",
            nominal: 25000,
            status: "aktif",
            keterangan: "Iuran kas bulanan kelas.",
            pembayaran: [1, 2, 3, 5, 7]
        },
        {
            id: 3,
            nama: "Class Meeting",
            frekuensi: "insidental",
            jatuhTempo: "2026-10-20",
            nominal: 50000,
            status: "aktif",
            keterangan: "Iuran kegiatan class meeting.",
            pembayaran: [1, 2, 5, 8]
        }
    ];


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    let editingIuranId = null;
    let selectedIuranId = null;
    let toastTimer = null;


    /*
    |--------------------------------------------------------------------------
    | ELEMENTS
    |--------------------------------------------------------------------------
    */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const sidebarLogout =
        document.getElementById("sidebarLogout");

    const dropdownLogout =
        document.getElementById("dropdownLogout");

    const currentDate =
        document.getElementById("currentDate");


    /*
    |--------------------------------------------------------------------------
    | IURAN ELEMENTS
    |--------------------------------------------------------------------------
    */

    const btnTambahIuran =
        document.getElementById("btnTambahIuran");

    const cariIuran =
        document.getElementById("cariIuran");

    const filterFrekuensi =
        document.getElementById("filterFrekuensi");

    const filterStatusIuran =
        document.getElementById("filterStatusIuran");

    const btnResetFilter =
        document.getElementById("btnResetFilter");

    const isiTabelIuran =
        document.getElementById("isiTabelIuran");

    const emptyState =
        document.getElementById("emptyState");

    const jumlahIuranFoot =
        document.getElementById("jumlahIuranFoot");


    /*
    |--------------------------------------------------------------------------
    | SUMMARY ELEMENTS
    |--------------------------------------------------------------------------
    */

    const sumTotalIuran =
        document.getElementById("sumTotalIuran");

    const sumTagihan =
        document.getElementById("sumTagihan");

    const sumTerkumpul =
        document.getElementById("sumTerkumpul");


    /*
    |--------------------------------------------------------------------------
    | MODAL IURAN
    |--------------------------------------------------------------------------
    */

    const modalIuran =
        document.getElementById("modalIuran");

    const modalIuranTitle =
        document.getElementById("modalIuranTitle");

    const modalIuranSub =
        document.getElementById("modalIuranSub");

    const formIuran =
        document.getElementById("formIuran");

    const inputNamaIuran =
        document.getElementById("inputNamaIuran");

    const inputFrekuensi =
        document.getElementById("inputFrekuensi");

    const inputJatuhTempo =
        document.getElementById("inputJatuhTempo");

    const inputNominalIuran =
        document.getElementById("inputNominalIuran");

    const inputStatusIuran =
        document.getElementById("inputStatusIuran");

    const inputKeteranganIuran =
        document.getElementById("inputKeteranganIuran");

    const formErrorIuran =
        document.getElementById("formErrorIuran");


    /*
    |--------------------------------------------------------------------------
    | MODAL DETAIL
    |--------------------------------------------------------------------------
    */

    const modalDetailIuran =
        document.getElementById("modalDetailIuran");

    const detailIuranTitle =
        document.getElementById("detailIuranTitle");

    const detailIuranSub =
        document.getElementById("detailIuranSub");

    const detailFrekuensi =
        document.getElementById("detailFrekuensi");

    const detailJatuhTempo =
        document.getElementById("detailJatuhTempo");

    const detailNominal =
        document.getElementById("detailNominal");

    const detailTerkumpul =
        document.getElementById("detailTerkumpul");

    const cariDetailSiswa =
        document.getElementById("cariDetailSiswa");

    const filterDetailStatus =
        document.getElementById("filterDetailStatus");

    const isiTabelDetail =
        document.getElementById("isiTabelDetail");

    const emptyDetail =
        document.getElementById("emptyDetail");


    /*
    |--------------------------------------------------------------------------
    | TOAST
    |--------------------------------------------------------------------------
    */

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    const toastIcon =
        document.getElementById("toastIcon");

    const toastClose =
        document.getElementById("toastClose");


    /*
    |--------------------------------------------------------------------------
    | HELPER
    |--------------------------------------------------------------------------
    */

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(value) || 0);
    }


    function formatTanggal(value) {
        if (!value) {
            return "-";
        }

        const date =
            new Date(`${value}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    }


    function formatTanggalLengkap(date) {
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getFrekuensiLabel(value) {
        const labels = {
            harian: "Harian",
            mingguan: "Mingguan",
            bulanan: "Bulanan",
            tahunan: "Tahunan",
            insidental: "Insidental"
        };

        return labels[value] || value;
    }


    function getJumlahLunas(iuran) {
        if (!Array.isArray(iuran.pembayaran)) {
            return 0;
        }

        return iuran.pembayaran.length;
    }


    function getTotalSiswa() {
        return SISWA.length;
    }


    function getTotalTagihan(iuran) {
        return (
            Number(iuran.nominal) *
            getTotalSiswa()
        );
    }


    function getTotalTerkumpul(iuran) {
        return (
            Number(iuran.nominal) *
            getJumlahLunas(iuran)
        );
    }


    function getPersentase(iuran) {
        const total =
            getTotalSiswa();

        if (!total) {
            return 0;
        }

        return Math.round(
            (getJumlahLunas(iuran) / total) *
            100
        );
    }


    function getIuranById(id) {
        return iuranData.find(
            (iuran) =>
                iuran.id === Number(id)
        );
    }


    function getInitials(nama) {
        return String(nama)
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                (word) =>
                    word.charAt(0)
            )
            .join("")
            .toUpperCase();
    }


    /*
    |--------------------------------------------------------------------------
    | TOPBAR DATE
    |--------------------------------------------------------------------------
    */

    function updateCurrentDate() {
        if (!currentDate) {
            return;
        }

        currentDate.textContent =
            formatTanggalLengkap(
                new Date()
            );
    }

    updateCurrentDate();


    /*
    |--------------------------------------------------------------------------
    | SIDEBAR
    |--------------------------------------------------------------------------
    */

    function openSidebar() {
        document.body.classList.add(
            "nav-open"
        );

        if (sidebarToggle) {
            sidebarToggle.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }


    function closeSidebar() {
        document.body.classList.remove(
            "nav-open"
        );

        if (sidebarToggle) {
            sidebarToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    if (sidebarToggle) {
        sidebarToggle.addEventListener(
            "click",
            () => {
                const isOpen =
                    document.body.classList.contains(
                        "nav-open"
                    );

                if (isOpen) {
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
            closeSidebar
        );
    }


    document
        .querySelectorAll(".side-link")
        .forEach((link) => {
            link.addEventListener(
                "click",
                () => {
                    closeSidebar();
                }
            );
        });


    /*
    |--------------------------------------------------------------------------
    | PROFILE DROPDOWN
    |--------------------------------------------------------------------------
    */

    function closeProfileDropdown() {
        if (!profileDropdown) {
            return;
        }

        profileDropdown.classList.remove(
            "is-open"
        );

        if (profileButton) {
            profileButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    function toggleProfileDropdown() {
        if (!profileDropdown) {
            return;
        }

        const isOpen =
            profileDropdown.classList.contains(
                "is-open"
            );

        if (isOpen) {
            closeProfileDropdown();
            return;
        }

        profileDropdown.classList.add(
            "is-open"
        );

        if (profileButton) {
            profileButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }


    if (profileButton) {
        profileButton.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();
                toggleProfileDropdown();
            }
        );
    }


    document.addEventListener(
        "click",
        (event) => {
            if (
                profileDropdown &&
                profileButton &&
                !profileDropdown.contains(
                    event.target
                ) &&
                !profileButton.contains(
                    event.target
                )
            ) {
                closeProfileDropdown();
            }
        }
    );


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    function handleLogout() {
        closeProfileDropdown();
        closeSidebar();

        showToast(
            "Keluar",
            "Simulasi logout. Nanti akan diarahkan ke halaman login.",
            "logout"
        );

        setTimeout(() => {
            window.location.href = "/";
        }, 900);
    }


    if (sidebarLogout) {
        sidebarLogout.addEventListener(
            "click",
            handleLogout
        );
    }


    if (dropdownLogout) {
        dropdownLogout.addEventListener(
            "click",
            handleLogout
        );
    }


    /*
    |--------------------------------------------------------------------------
    | MODAL
    |--------------------------------------------------------------------------
    */

    function openModal(modal) {
        if (!modal) {
            return;
        }

        modal.hidden = false;

        requestAnimationFrame(() => {
            modal.classList.add(
                "is-open"
            );
        });

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove(
            "is-open"
        );

        setTimeout(() => {
            modal.hidden = true;
        }, 180);

        setTimeout(() => {
            const activeModal =
                document.querySelector(
                    ".modal.is-open"
                );

            if (!activeModal) {
                document.body.classList.remove(
                    "modal-open"
                );
            }
        }, 190);
    }


    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach((element) => {
            element.addEventListener(
                "click",
                () => {
                    const modal =
                        element.closest(
                            ".modal"
                        );

                    closeModal(modal);
                }
            );
        });


    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key !== "Escape") {
                return;
            }

            document
                .querySelectorAll(
                    ".modal.is-open"
                )
                .forEach((modal) => {
                    closeModal(modal);
                });

            closeProfileDropdown();
            closeSidebar();
        }
    );


    /*
    |--------------------------------------------------------------------------
    | SUMMARY
    |--------------------------------------------------------------------------
    */

    function renderSummary() {
        const activeIuran =
            iuranData.filter(
                (iuran) =>
                    iuran.status === "aktif"
            );

        const totalTagihan =
            activeIuran.reduce(
                (total, iuran) =>
                    total +
                    getTotalTagihan(iuran),
                0
            );

        const totalTerkumpul =
            activeIuran.reduce(
                (total, iuran) =>
                    total +
                    getTotalTerkumpul(iuran),
                0
            );

        if (sumTotalIuran) {
            sumTotalIuran.textContent =
                activeIuran.length;
        }

        if (sumTagihan) {
            sumTagihan.textContent =
                formatRupiah(
                    totalTagihan
                );
        }

        if (sumTerkumpul) {
            sumTerkumpul.textContent =
                formatRupiah(
                    totalTerkumpul
                );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | DATA IURAN
    |--------------------------------------------------------------------------
    */

    function getFilteredIuran() {

        const keyword =
            cariIuran
                ? cariIuran.value
                    .trim()
                    .toLowerCase()
                : "";

        const frekuensi =
            filterFrekuensi
                ? filterFrekuensi.value
                    .trim()
                    .toLowerCase()
                : "semua";

        const status =
            filterStatusIuran
                ? filterStatusIuran.value
                    .trim()
                    .toLowerCase()
                : "semua";


        return iuranData.filter(
            (iuran) => {

                const nama =
                    String(
                        iuran.nama || ""
                    ).toLowerCase();

                const keterangan =
                    String(
                        iuran.keterangan || ""
                    ).toLowerCase();

                const dataFrekuensi =
                    String(
                        iuran.frekuensi || ""
                    ).toLowerCase();

                const dataStatus =
                    String(
                        iuran.status || ""
                    ).toLowerCase();


                const matchesKeyword =
                    !keyword ||
                    nama.includes(keyword) ||
                    keterangan.includes(keyword);


                const matchesFrekuensi =
                    frekuensi === "semua" ||
                    frekuensi === "" ||
                    dataFrekuensi === frekuensi;


                const matchesStatus =
                    status === "semua" ||
                    status === "" ||
                    dataStatus === status;


                return (
                    matchesKeyword &&
                    matchesFrekuensi &&
                    matchesStatus
                );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | RENDER DAFTAR IURAN
    |--------------------------------------------------------------------------
    */

    function renderIuran() {

        if (!isiTabelIuran) {
            return;
        }

        const data =
            getFilteredIuran();

        isiTabelIuran.innerHTML = "";


        /*
        |--------------------------------------------------------------------------
        | EMPTY STATE
        |--------------------------------------------------------------------------
        */

        if (emptyState) {

            if (data.length > 0) {
                emptyState.hidden = true;
                emptyState.classList.remove("show");
            } else {
                emptyState.hidden = false;
                emptyState.classList.add("show");
            }
        }


        if (jumlahIuranFoot) {
            jumlahIuranFoot.textContent =
                `${data.length} iuran`;
        }


        /*
        |--------------------------------------------------------------------------
        | DATA KOSONG
        |--------------------------------------------------------------------------
        */

        if (!data.length) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | RENDER DATA
        |--------------------------------------------------------------------------
        */

        data.forEach(
            (iuran) => {

                const jumlahLunas =
                    getJumlahLunas(
                        iuran
                    );

                const totalSiswa =
                    getTotalSiswa();

                const terkumpul =
                    getTotalTerkumpul(
                        iuran
                    );

                const persentase =
                    getPersentase(
                        iuran
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td>
                        <div class="table-primary">
                            ${escapeHTML(
                                iuran.nama
                            )}
                        </div>

                        <div class="table-secondary">
                            ${escapeHTML(
                                iuran.keterangan ||
                                "Tidak ada keterangan"
                            )}
                        </div>
                    </td>

                    <td>
                        <span class="frequency-badge">
                            ${escapeHTML(
                                getFrekuensiLabel(
                                    iuran.frekuensi
                                )
                            )}
                        </span>
                    </td>

                    <td>
                        ${formatTanggal(
                            iuran.jatuhTempo
                        )}
                    </td>

                    <td>
                        <strong>
                            ${formatRupiah(
                                iuran.nominal
                            )}
                        </strong>
                    </td>

                    <td>
                        ${formatRupiah(
                            terkumpul
                        )}
                    </td>

                    <td>
                        <div class="progress-cell">

                            <div class="progress-top">

                                <span>
                                    ${jumlahLunas}/${totalSiswa} siswa
                                </span>

                                <strong>
                                    ${persentase}%
                                </strong>

                            </div>

                            <div class="progress-bar">
                                <span
                                    style="width:${persentase}%"
                                ></span>
                            </div>

                        </div>
                    </td>

                    <td>
                        <span
                            class="status-badge status-badge--${escapeHTML(
                                iuran.status
                            )}"
                        >
                            <span class="status-dot"></span>

                            ${
                                iuran.status ===
                                "aktif"
                                    ? "Aktif"
                                    : "Nonaktif"
                            }
                        </span>
                    </td>

                    <td class="text-right">

                        <div class="action-group">

                            <button
                                type="button"
                                class="icon-btn"
                                title="Detail"
                                data-action="detail"
                                data-id="${iuran.id}"
                            >
                                <span class="material-symbols-outlined">
                                    visibility
                                </span>
                            </button>

                            <button
                                type="button"
                                class="icon-btn"
                                title="Edit"
                                data-action="edit"
                                data-id="${iuran.id}"
                            >
                                <span class="material-symbols-outlined">
                                    edit
                                </span>
                            </button>

                        </div>

                    </td>
                `;


                isiTabelIuran.appendChild(
                    row
                );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | TAMBAHAN — SINKRONISASI EMPTY STATE
    |--------------------------------------------------------------------------
    */

    function syncIuranEmptyState() {

        if (!emptyState) {
            return;
        }

        const data =
            getFilteredIuran();

        if (data.length > 0) {

            emptyState.hidden = true;
            emptyState.style.display = "";
            emptyState.classList.remove(
                "show"
            );

        } else {

            emptyState.hidden = false;
            emptyState.style.display = "";
            emptyState.classList.add(
                "show"
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | TAMBAH IURAN
    |--------------------------------------------------------------------------
    */

    function resetFormIuran() {

        if (!formIuran) {
            return;
        }

        formIuran.reset();

        if (inputFrekuensi) {
            inputFrekuensi.value =
                "mingguan";
        }

        if (inputStatusIuran) {
            inputStatusIuran.value =
                "aktif";
        }

        if (formErrorIuran) {
            formErrorIuran.hidden = true;
            formErrorIuran.textContent =
                "";
        }

        editingIuranId = null;
    }


    function openAddIuran() {

        resetFormIuran();

        if (modalIuranTitle) {
            modalIuranTitle.textContent =
                "Tambah Iuran";
        }

        if (modalIuranSub) {
            modalIuranSub.textContent =
                "Tambahkan iuran baru untuk kelas XI RPL 1.";
        }

        openModal(
            modalIuran
        );

        setTimeout(() => {

            if (inputNamaIuran) {
                inputNamaIuran.focus();
            }

        }, 200);
    }


    if (btnTambahIuran) {
        btnTambahIuran.addEventListener(
            "click",
            openAddIuran
        );
    }


    /*
    |--------------------------------------------------------------------------
    | EDIT IURAN
    |--------------------------------------------------------------------------
    */

    function openEditIuran(id) {

        const iuran =
            getIuranById(id);

        if (!iuran) {
            return;
        }

        editingIuranId =
            iuran.id;


        if (modalIuranTitle) {
            modalIuranTitle.textContent =
                "Edit Iuran";
        }

        if (modalIuranSub) {
            modalIuranSub.textContent =
                "Perbarui data iuran kelas XI RPL 1.";
        }


        if (inputNamaIuran) {
            inputNamaIuran.value =
                iuran.nama;
        }

        if (inputFrekuensi) {
            inputFrekuensi.value =
                iuran.frekuensi;
        }

        if (inputJatuhTempo) {
            inputJatuhTempo.value =
                iuran.jatuhTempo;
        }

        if (inputNominalIuran) {
            inputNominalIuran.value =
                iuran.nominal;
        }

        if (inputStatusIuran) {
            inputStatusIuran.value =
                iuran.status;
        }

        if (inputKeteranganIuran) {
            inputKeteranganIuran.value =
                iuran.keterangan || "";
        }

        if (formErrorIuran) {
            formErrorIuran.hidden = true;
            formErrorIuran.textContent =
                "";
        }

        openModal(
            modalIuran
        );
    }


    /*
    |--------------------------------------------------------------------------
    | SIMPAN IURAN
    |--------------------------------------------------------------------------
    */

    if (formIuran) {

        formIuran.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const nama =
                    inputNamaIuran
                        ? inputNamaIuran.value.trim()
                        : "";


                const nominal =
                    inputNominalIuran
                        ? Number(
                            inputNominalIuran.value
                        )
                        : 0;


                const jatuhTempo =
                    inputJatuhTempo
                        ? inputJatuhTempo.value
                        : "";


                if (!nama) {

                    showFormError(
                        formErrorIuran,
                        "Nama iuran wajib diisi."
                    );

                    return;
                }


                if (!nominal || nominal <= 0) {

                    showFormError(
                        formErrorIuran,
                        "Nominal iuran harus lebih dari Rp0."
                    );

                    return;
                }


                if (!jatuhTempo) {

                    showFormError(
                        formErrorIuran,
                        "Jatuh tempo wajib diisi."
                    );

                    return;
                }


                /*
                |--------------------------------------------------------------------------
                | EDIT
                |--------------------------------------------------------------------------
                */

                if (editingIuranId) {

                    const iuran =
                        getIuranById(
                            editingIuranId
                        );

                    if (!iuran) {
                        return;
                    }


                    iuran.nama =
                        nama;

                    iuran.frekuensi =
                        inputFrekuensi
                            ? inputFrekuensi.value
                            : "mingguan";

                    iuran.jatuhTempo =
                        jatuhTempo;

                    iuran.nominal =
                        nominal;

                    iuran.status =
                        inputStatusIuran
                            ? inputStatusIuran.value
                            : "aktif";

                    iuran.keterangan =
                        inputKeteranganIuran
                            ? inputKeteranganIuran.value.trim()
                            : "";


                    closeModal(
                        modalIuran
                    );

                    renderSummary();
                    renderIuran();
                    syncIuranEmptyState();


                    showToast(
                        "Iuran diperbarui",
                        "Data iuran berhasil diperbarui.",
                        "check"
                    );

                    return;
                }


                /*
                |--------------------------------------------------------------------------
                | TAMBAH
                |--------------------------------------------------------------------------
                */

                const newId =
                    iuranData.length
                        ? Math.max(
                            ...iuranData.map(
                                (item) =>
                                    item.id
                            )
                        ) + 1
                        : 1;


                iuranData.push({
                    id: newId,
                    nama: nama,
                    frekuensi:
                        inputFrekuensi
                            ? inputFrekuensi.value
                            : "mingguan",
                    jatuhTempo:
                        jatuhTempo,
                    nominal:
                        nominal,
                    status:
                        inputStatusIuran
                            ? inputStatusIuran.value
                            : "aktif",
                    keterangan:
                        inputKeteranganIuran
                            ? inputKeteranganIuran.value.trim()
                            : "",
                    pembayaran: []
                });


                closeModal(
                    modalIuran
                );

                renderSummary();
                renderIuran();
                syncIuranEmptyState();


                showToast(
                    "Iuran ditambahkan",
                    "Iuran baru berhasil ditambahkan.",
                    "check"
                );
            }
        );
    }


    function showFormError(
        element,
        message
    ) {

        if (!element) {
            return;
        }

        element.textContent =
            message;

        element.hidden = false;
    }


    /*
    |--------------------------------------------------------------------------
    | DETAIL IURAN
    |--------------------------------------------------------------------------
    */

    function openDetailIuran(id) {

        const iuran =
            getIuranById(id);

        if (!iuran) {
            return;
        }


        selectedIuranId =
            iuran.id;


        if (detailIuranTitle) {
            detailIuranTitle.textContent =
                iuran.nama;
        }


        if (detailIuranSub) {
            detailIuranSub.textContent =
                iuran.keterangan ||
                "Detail status pembayaran siswa kelas XI RPL 1.";
        }


        if (detailFrekuensi) {
            detailFrekuensi.textContent =
                getFrekuensiLabel(
                    iuran.frekuensi
                );
        }


        if (detailJatuhTempo) {
            detailJatuhTempo.textContent =
                formatTanggal(
                    iuran.jatuhTempo
                );
        }


        if (detailNominal) {
            detailNominal.textContent =
                formatRupiah(
                    iuran.nominal
                );
        }


        if (detailTerkumpul) {
            detailTerkumpul.textContent =
                formatRupiah(
                    getTotalTerkumpul(
                        iuran
                    )
                );
        }


        if (cariDetailSiswa) {
            cariDetailSiswa.value =
                "";
        }


        if (filterDetailStatus) {
            filterDetailStatus.value =
                "semua";
        }


        renderDetailSiswa();

        openModal(
            modalDetailIuran
        );
    }


    /*
    |--------------------------------------------------------------------------
    | DETAIL SISWA
    |--------------------------------------------------------------------------
    */

    function renderDetailSiswa() {

        if (!isiTabelDetail) {
            return;
        }

        const iuran =
            getIuranById(
                selectedIuranId
            );

        if (!iuran) {
            return;
        }


        const keyword =
            cariDetailSiswa
                ? cariDetailSiswa.value
                    .trim()
                    .toLowerCase()
                : "";


        const status =
            filterDetailStatus
                ? filterDetailStatus.value
                : "semua";


        const data =
            SISWA.filter(
                (siswa) => {

                    const lunas =
                        Array.isArray(
                            iuran.pembayaran
                        ) &&
                        iuran.pembayaran.includes(
                            siswa.id
                        );


                    const matchesKeyword =
                        !keyword ||
                        siswa.nama
                            .toLowerCase()
                            .includes(
                                keyword
                            ) ||
                        siswa.nisn
                            .toLowerCase()
                            .includes(
                                keyword
                            );


                    const matchesStatus =
                        status ===
                            "semua" ||
                        status === "" ||
                        (
                            status ===
                                "lunas" &&
                            lunas
                        ) ||
                        (
                            status ===
                                "belum" &&
                            !lunas
                        );


                    return (
                        matchesKeyword &&
                        matchesStatus
                    );
                }
            );


        isiTabelDetail.innerHTML =
            "";


        if (emptyDetail) {
            emptyDetail.hidden =
                data.length > 0;
        }


        if (!data.length) {
            return;
        }


        data.forEach(
            (siswa, index) => {

                const lunas =
                    Array.isArray(
                        iuran.pembayaran
                    ) &&
                    iuran.pembayaran.includes(
                        siswa.id
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <div class="student-cell">

                            <div class="student-cell__avatar">
                                ${escapeHTML(
                                    getInitials(
                                        siswa.nama
                                    )
                                )}
                            </div>

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        siswa.nama
                                    )}
                                </strong>

                                <span>
                                    Siswa XI RPL 1
                                </span>

                            </div>

                        </div>
                    </td>

                    <td>
                        <span class="mono">
                            ${escapeHTML(
                                siswa.nisn
                            )}
                        </span>
                    </td>

                    <td>
                        ${escapeHTML(
                            siswa.kelas
                        )}
                    </td>

                    <td>
                        ${formatRupiah(
                            iuran.nominal
                        )}
                    </td>

                    <td>

                        <span class="status-badge ${
                            lunas
                                ? "status-badge--lunas"
                                : "status-badge--belum"
                        }">

                            <span class="status-dot"></span>

                            ${
                                lunas
                                    ? "Lunas"
                                    : "Belum Lunas"
                            }

                        </span>

                    </td>

                    <td class="text-right">

                        ${
                            lunas
                                ? `
                                    <span class="action-done">
                                        <span class="material-symbols-outlined">
                                            check_circle
                                        </span>

                                        Selesai
                                    </span>
                                `
                                : `
                                    <span class="action-pending">
                                        <span class="material-symbols-outlined">
                                            schedule
                                        </span>

                                        Menunggu Pembayaran
                                    </span>
                                `
                        }

                    </td>
                `;


                isiTabelDetail.appendChild(
                    row
                );
            }
        );
    }


    if (cariDetailSiswa) {
        cariDetailSiswa.addEventListener(
            "input",
            renderDetailSiswa
        );
    }


    if (filterDetailStatus) {
        filterDetailStatus.addEventListener(
            "change",
            renderDetailSiswa
        );
    }


    /*
    |--------------------------------------------------------------------------
    | TABLE ACTIONS
    |--------------------------------------------------------------------------
    */

    if (isiTabelIuran) {

        isiTabelIuran.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;


                const id =
                    Number(
                        button.dataset.id
                    );


                if (action === "detail") {
                    openDetailIuran(
                        id
                    );
                }


                if (action === "edit") {
                    openEditIuran(
                        id
                    );
                }
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | FILTER IURAN
    |--------------------------------------------------------------------------
    */

    if (cariIuran) {
        cariIuran.addEventListener(
            "input",
            () => {
                renderIuran();
                syncIuranEmptyState();
            }
        );
    }


    if (filterFrekuensi) {
        filterFrekuensi.addEventListener(
            "change",
            () => {
                renderIuran();
                syncIuranEmptyState();
            }
        );
    }


    if (filterStatusIuran) {
        filterStatusIuran.addEventListener(
            "change",
            () => {
                renderIuran();
                syncIuranEmptyState();
            }
        );
    }


    if (btnResetFilter) {
        btnResetFilter.addEventListener(
            "click",
            () => {

                if (cariIuran) {
                    cariIuran.value =
                        "";
                }

                if (filterFrekuensi) {
                    filterFrekuensi.value =
                        "semua";
                }

                if (filterStatusIuran) {
                    filterStatusIuran.value =
                        "semua";
                }

                renderIuran();
                syncIuranEmptyState();
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | TOAST
    |--------------------------------------------------------------------------
    */

    function showToast(
        title,
        message,
        icon = "check"
    ) {

        if (!toast) {
            return;
        }


        clearTimeout(
            toastTimer
        );


        if (toastTitle) {
            toastTitle.textContent =
                title;
        }


        if (toastMessage) {
            toastMessage.textContent =
                message;
        }


        if (toastIcon) {
            toastIcon.innerHTML = `
                <span class="material-symbols-outlined">
                    ${escapeHTML(icon)}
                </span>
            `;
        }


        toast.classList.add(
            "is-show"
        );


        toastTimer =
            setTimeout(
                () => {
                    toast.classList.remove(
                        "is-show"
                    );
                },
                3500
            );
    }


    if (toastClose) {
        toastClose.addEventListener(
            "click",
            () => {
                toast.classList.remove(
                    "is-show"
                );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | INITIAL RENDER
    |--------------------------------------------------------------------------
    */

    renderSummary();
    renderIuran();
    syncIuranEmptyState();

});
