document.addEventListener("DOMContentLoaded", () => {
    /* =========================================================
       BBCASHVIA — BENDAHARA DATA SISWA
       FRONTEND SIMULATION
       ========================================================= */

    /* =========================================================
       DATA SISWA
       ========================================================= */

    let students = [
        {
            nis: "24001",
            name: "Ahmad Fauzan",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24002",
            name: "Aisyah Putri",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24003",
            name: "Bagas Pratama",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24004",
            name: "Citra Lestari",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24005",
            name: "Dimas Saputra",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24006",
            name: "Eka Ramadhan",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24007",
            name: "Fajar Nugraha",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24008",
            name: "Gina Maharani",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24009",
            name: "Hafiz Ramadhan",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24010",
            name: "Intan Permata",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24011",
            name: "Joko Prasetyo",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24012",
            name: "Kania Safitri",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24013",
            name: "Luthfi Maulana",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24014",
            name: "Maya Sari",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24015",
            name: "Nanda Akbar",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24016",
            name: "Olivia Maharani",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24017",
            name: "Putra Wijaya",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24018",
            name: "Qori Aulia",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24019",
            name: "Raka Firmansyah",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24020",
            name: "Salsa Nabila",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24021",
            name: "Taufik Hidayat",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24022",
            name: "Ulya Ramadhani",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24023",
            name: "Vino Saputra",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24024",
            name: "Wulan Anggraini",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24025",
            name: "Yoga Pratama",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24026",
            name: "Zahra Aulia",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24027",
            name: "Aditya Nugroho",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24028",
            name: "Bella Safira",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24029",
            name: "Cahya Ramadhan",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24030",
            name: "Dewi Lestari",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24031",
            name: "Fikri Akmal",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24032",
            name: "Gita Permata",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24033",
            name: "Hendra Wijaya",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24034",
            name: "Indah Sari",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        },
        {
            nis: "24035",
            name: "Rizky Maulana",
            className: "XI RPL 1",
            status: "lunas",
            bill: 150000,
            paid: 150000
        },
        {
            nis: "24036",
            name: "Nadia Putri",
            className: "XI RPL 1",
            status: "belum",
            bill: 150000,
            paid: 0
        }
    ];


    /* =========================================================
       ELEMENT
       ========================================================= */

    const tableBody = document.getElementById("studentTableBody");
    const emptyState = document.getElementById("emptyState");

    const searchInput = document.getElementById("studentSearch");
    const statusFilter = document.getElementById("statusFilter");

    const totalStudents = document.getElementById("totalStudents");
    const paidStudents = document.getElementById("paidStudents");
    const unpaidStudents = document.getElementById("unpaidStudents");
    const classStudentCount = document.getElementById("classStudentCount");

    const paginationInfo = document.getElementById("paginationInfo");
    const pageNumbers = document.getElementById("pageNumbers");
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");

    const currentDate = document.getElementById("currentDate");

    const studentModal = document.getElementById("studentModal");
    const studentForm = document.getElementById("studentForm");
    const addStudentButton = document.getElementById("addStudentButton");
    const cancelStudentButton = document.getElementById("cancelStudentButton");
    const modalClose = document.getElementById("modalClose");

    const editingNis = document.getElementById("editingNis");
    const studentNis = document.getElementById("studentNis");
    const studentName = document.getElementById("studentName");
    const studentClass = document.getElementById("studentClass");
    const studentStatus = document.getElementById("studentStatus");
    const studentBill = document.getElementById("studentBill");
    const studentPaid = document.getElementById("studentPaid");

    const nisError = document.getElementById("nisError");
    const nameError = document.getElementById("nameError");

    const detailModal = document.getElementById("detailModal");
    const detailModalClose = document.getElementById("detailModalClose");
    const detailCloseButton = document.getElementById("detailCloseButton");

    const detailAvatar = document.getElementById("detailAvatar");
    const modalStudentName = document.getElementById("modalStudentName");
    const modalNis = document.getElementById("modalNis");

    const detailNis = document.getElementById("detailNis");
    const modalClass = document.getElementById("modalClass");
    const modalStatus = document.getElementById("modalStatus");
    const modalTagihan = document.getElementById("modalTagihan");
    const modalDibayar = document.getElementById("modalDibayar");
    const modalSisa = document.getElementById("modalSisa");
    const detailMessage = document.getElementById("detailMessage");

    const profileButton = document.getElementById("profileButton");
    const profileDropdown = document.getElementById("profileDropdown");
    const dropdownLogout = document.getElementById("dropdownLogout");

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");
    const sidebarLogout = document.getElementById("sidebarLogout");

    const toast = document.getElementById("toast");


    /* =========================================================
       PAGINATION
       ========================================================= */

    const perPage = 8;
    let currentPage = 1;


    /* =========================================================
       HELPER
       ========================================================= */

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(value) || 0);
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getInitials(name) {
        return String(name || "")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }


    function showToast(message) {
        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }


    /* =========================================================
       DATE
       ========================================================= */

    function updateDate() {
        if (!currentDate) {
            return;
        }

        const now = new Date();

        currentDate.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
    }


    /* =========================================================
       STATISTICS
       ========================================================= */

    function updateStats() {
        const total = students.length;

        const paid = students.filter(
            student => student.status === "lunas"
        ).length;

        const unpaid = students.filter(
            student => student.status === "belum"
        ).length;

        if (totalStudents) {
            totalStudents.textContent = total;
        }

        if (paidStudents) {
            paidStudents.textContent = paid;
        }

        if (unpaidStudents) {
            unpaidStudents.textContent = unpaid;
        }

        if (classStudentCount) {
            classStudentCount.textContent = total;
        }
    }


    /* =========================================================
       FILTER
       ========================================================= */

    function getFilteredStudents() {
        const keyword = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedStatus = statusFilter
            ? statusFilter.value
            : "all";

        return students.filter(student => {
            const matchesKeyword =
                !keyword ||
                student.name.toLowerCase().includes(keyword) ||
                student.nis.toLowerCase().includes(keyword);

            const matchesStatus =
                selectedStatus === "all" ||
                student.status === selectedStatus;

            return matchesKeyword && matchesStatus;
        });
    }


    /* =========================================================
       RENDER TABLE
       ========================================================= */

    function renderTable() {
        if (!tableBody) {
            console.error(
                "BBCashvia: #studentTableBody tidak ditemukan."
            );
            return;
        }

        const filteredStudents = getFilteredStudents();

        const totalItems = filteredStudents.length;

        const totalPages = Math.max(
            1,
            Math.ceil(totalItems / perPage)
        );

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * perPage;
        const endIndex = Math.min(
            startIndex + perPage,
            totalItems
        );

        const currentStudents = filteredStudents.slice(
            startIndex,
            endIndex
        );

        tableBody.innerHTML = "";

        if (currentStudents.length === 0) {
            if (emptyState) {
                emptyState.classList.add("show");
            }

            if (paginationInfo) {
                paginationInfo.textContent = "Tidak ada data siswa";
            }

            renderPagination(0);

            return;
        }

        if (emptyState) {
            emptyState.classList.remove("show");
        }

        const fragment = document.createDocumentFragment();

        currentStudents.forEach(student => {
            const row = document.createElement("tr");

            const statusClass =
                student.status === "lunas"
                    ? "status-badge status-badge--success"
                    : "status-badge status-badge--warning";

            const statusText =
                student.status === "lunas"
                    ? "Lunas"
                    : "Belum Lunas";

            const remaining =
                Math.max(
                    Number(student.bill) - Number(student.paid),
                    0
                );

            row.innerHTML = `
                <td>
                    <div class="student-name">
                        <div class="student-avatar">
                            ${escapeHTML(getInitials(student.name))}
                        </div>

                        <div class="student-name__text">
                            <strong>
                                ${escapeHTML(student.name)}
                            </strong>

                            <span class="student-nis">
                                NIS ${escapeHTML(student.nis)}
                            </span>
                        </div>
                    </div>
                </td>

                <td>
                    ${escapeHTML(student.className)}
                </td>

                <td>
                    <span class="money">
                        ${formatRupiah(student.bill)}
                    </span>
                </td>

                <td>
                    <span class="money">
                        ${formatRupiah(student.paid)}
                    </span>
                </td>

                <td>
                    <span class="money">
                        ${formatRupiah(remaining)}
                    </span>
                </td>

                <td>
                    <span class="${statusClass}">
                        ${statusText}
                    </span>
                </td>

                <td>
                    <div class="action-buttons">

                        <button
                            type="button"
                            class="action-btn action-btn--view"
                            data-action="detail"
                            data-nis="${escapeHTML(student.nis)}"
                            title="Lihat detail"
                        >
                            <span class="material-symbols-outlined">
                                visibility
                            </span>
                        </button>

                        <button
                            type="button"
                            class="action-btn action-btn--edit"
                            data-action="edit"
                            data-nis="${escapeHTML(student.nis)}"
                            title="Edit siswa"
                        >
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </button>

                        <button
                            type="button"
                            class="action-btn action-btn--delete"
                            data-action="delete"
                            data-nis="${escapeHTML(student.nis)}"
                            title="Hapus siswa"
                        >
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </button>

                    </div>
                </td>
            `;

            fragment.appendChild(row);
        });

        tableBody.appendChild(fragment);

        if (paginationInfo) {
            paginationInfo.textContent =
                `Menampilkan ${startIndex + 1}–${endIndex} dari ${totalItems} siswa`;
        }

        renderPagination(totalPages);
    }


    /* =========================================================
       PAGINATION RENDER
       ========================================================= */

    function renderPagination(totalPages) {
        if (!pageNumbers) {
            return;
        }

        pageNumbers.innerHTML = "";

        if (totalPages <= 0) {
            if (prevPage) {
                prevPage.disabled = true;
            }

            if (nextPage) {
                nextPage.disabled = true;
            }

            return;
        }

        for (let page = 1; page <= totalPages; page++) {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "page-btn";

            if (page === currentPage) {
                button.classList.add("active");
            }

            button.textContent = page;

            button.addEventListener("click", () => {
                currentPage = page;
                renderTable();
            });

            pageNumbers.appendChild(button);
        }

        if (prevPage) {
            prevPage.disabled = currentPage <= 1;

            prevPage.onclick = () => {
                if (currentPage <= 1) {
                    return;
                }

                currentPage--;
                renderTable();
            };
        }

        if (nextPage) {
            nextPage.disabled = currentPage >= totalPages;

            nextPage.onclick = () => {
                if (currentPage >= totalPages) {
                    return;
                }

                currentPage++;
                renderTable();
            };
        }
    }


    /* =========================================================
       SEARCH
       ========================================================= */

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderTable();
        });
    }


    /* =========================================================
       FILTER
       ========================================================= */

    if (statusFilter) {
        statusFilter.addEventListener("change", () => {
            currentPage = 1;
            renderTable();
        });
    }


    /* =========================================================
       MODAL ADD / EDIT
       ========================================================= */

    function openStudentModal(student = null) {
        if (!studentModal) {
            return;
        }

        studentModal.classList.add("is-open");
        document.body.classList.add("modal-open");

        if (student) {
            if (editingNis) {
                editingNis.value = student.nis;
            }

            if (studentNis) {
                studentNis.value = student.nis;
                studentNis.disabled = true;
            }

            if (studentName) {
                studentName.value = student.name;
            }

            if (studentClass) {
                studentClass.value = student.className;
            }

            if (studentStatus) {
                studentStatus.value = student.status;
            }

            if (studentBill) {
                studentBill.value = student.bill;
            }

            if (studentPaid) {
                studentPaid.value = student.paid;
            }
        } else {
            if (studentForm) {
                studentForm.reset();
            }

            if (editingNis) {
                editingNis.value = "";
            }

            if (studentNis) {
                studentNis.disabled = false;
            }

            if (studentClass) {
                studentClass.value = "XI RPL 1";
            }

            if (studentStatus) {
                studentStatus.value = "belum";
            }

            if (studentBill) {
                studentBill.value = 150000;
            }

            if (studentPaid) {
                studentPaid.value = 0;
            }
        }

        clearFormErrors();
    }


    function closeStudentModal() {
        if (!studentModal) {
            return;
        }

        studentModal.classList.remove("is-open");
        document.body.classList.remove("modal-open");
    }


    function clearFormErrors() {
        if (nisError) {
            nisError.textContent = "";
            nisError.classList.remove("show");
        }

        if (nameError) {
            nameError.textContent = "";
            nameError.classList.remove("show");
        }
    }


    function showFormError(element, message) {
        if (!element) {
            return;
        }

        element.textContent = message;
        element.classList.add("show");
    }


    if (addStudentButton) {
        addStudentButton.addEventListener("click", () => {
            openStudentModal();
        });
    }


    if (cancelStudentButton) {
        cancelStudentButton.addEventListener(
            "click",
            closeStudentModal
        );
    }


    if (modalClose) {
        modalClose.addEventListener(
            "click",
            closeStudentModal
        );
    }


    /* =========================================================
       SAVE STUDENT
       ========================================================= */

    if (studentForm) {
        studentForm.addEventListener("submit", event => {
            event.preventDefault();

            clearFormErrors();

            const nis = studentNis
                ? studentNis.value.trim()
                : "";

            const name = studentName
                ? studentName.value.trim()
                : "";

            const className = studentClass
                ? studentClass.value.trim()
                : "XI RPL 1";

            const status = studentStatus
                ? studentStatus.value
                : "belum";

            const bill = studentBill
                ? Number(studentBill.value) || 0
                : 0;

            const paid = studentPaid
                ? Number(studentPaid.value) || 0
                : 0;

            let valid = true;

            const editingId =
                editingNis && editingNis.value
                    ? editingNis.value.trim()
                    : "";

            const duplicateNis = students.some(student => {
                return (
                    student.nis === nis &&
                    student.nis !== editingId
                );
            });

            if (!nis) {
                showFormError(
                    nisError,
                    "NIS wajib diisi."
                );

                valid = false;
            } else if (duplicateNis) {
                showFormError(
                    nisError,
                    "NIS sudah digunakan."
                );

                valid = false;
            }

            if (!name) {
                showFormError(
                    nameError,
                    "Nama siswa wajib diisi."
                );

                valid = false;
            }

            if (!valid) {
                return;
            }

            const normalizedPaid =
                Math.min(Math.max(paid, 0), bill);

            const normalizedStatus =
                normalizedPaid >= bill && bill > 0
                    ? "lunas"
                    : "belum";

            if (editingId) {
                const index = students.findIndex(
                    student => student.nis === editingId
                );

                if (index !== -1) {
                    students[index] = {
                        nis,
                        name,
                        className,
                        status: normalizedStatus,
                        bill,
                        paid: normalizedPaid
                    };
                }

                showToast("Data siswa berhasil diperbarui.");
            } else {
                students.push({
                    nis,
                    name,
                    className,
                    status: normalizedStatus,
                    bill,
                    paid: normalizedPaid
                });

                showToast("Siswa berhasil ditambahkan.");
            }

            updateStats();

            currentPage = 1;

            renderTable();

            closeStudentModal();
        });
    }


    /* =========================================================
       DETAIL MODAL
       ========================================================= */

    function openDetailModal(student) {
        if (!detailModal || !student) {
            return;
        }

        const remaining =
            Math.max(
                Number(student.bill) -
                Number(student.paid),
                0
            );

        if (detailAvatar) {
            detailAvatar.textContent =
                getInitials(student.name);
        }

        if (modalStudentName) {
            modalStudentName.textContent =
                student.name;
        }

        if (modalNis) {
            modalNis.textContent =
                `NIS ${student.nis}`;
        }

        if (detailNis) {
            detailNis.textContent =
                student.nis;
        }

        if (modalClass) {
            modalClass.textContent =
                student.className;
        }

        if (modalStatus) {
            modalStatus.textContent =
                student.status === "lunas"
                    ? "Lunas"
                    : "Belum Lunas";

            modalStatus.className =
                student.status === "lunas"
                    ? "status-badge status-badge--success"
                    : "status-badge status-badge--warning";
        }

        if (modalTagihan) {
            modalTagihan.textContent =
                formatRupiah(student.bill);
        }

        if (modalDibayar) {
            modalDibayar.textContent =
                formatRupiah(student.paid);
        }

        if (modalSisa) {
            modalSisa.textContent =
                formatRupiah(remaining);
        }

        if (detailMessage) {
            detailMessage.textContent =
                student.status === "lunas"
                    ? "Iuran siswa sudah lunas."
                    : "Siswa masih memiliki tagihan yang belum lunas.";
        }

        detailModal.classList.add("is-open");
        document.body.classList.add("modal-open");
    }


    function closeDetailModal() {
        if (!detailModal) {
            return;
        }

        detailModal.classList.remove("is-open");
        document.body.classList.remove("modal-open");
    }


    if (detailModalClose) {
        detailModalClose.addEventListener(
            "click",
            closeDetailModal
        );
    }


    if (detailCloseButton) {
        detailCloseButton.addEventListener(
            "click",
            closeDetailModal
        );
    }


    /* =========================================================
       TABLE ACTION
       ========================================================= */

    if (tableBody) {
        tableBody.addEventListener("click", event => {
            const button =
                event.target.closest("[data-action]");

            if (!button) {
                return;
            }

            const action =
                button.dataset.action;

            const nis =
                button.dataset.nis;

            const student =
                students.find(
                    item => item.nis === nis
                );

            if (!student) {
                return;
            }

            if (action === "detail") {
                openDetailModal(student);
                return;
            }

            if (action === "edit") {
                openStudentModal(student);
                return;
            }

            if (action === "delete") {
                const confirmed = window.confirm(
                    `Hapus data siswa "${student.name}"?`
                );

                if (!confirmed) {
                    return;
                }

                students = students.filter(
                    item => item.nis !== nis
                );

                updateStats();

                const filteredStudents =
                    getFilteredStudents();

                const totalPages =
                    Math.max(
                        1,
                        Math.ceil(
                            filteredStudents.length /
                            perPage
                        )
                    );

                if (currentPage > totalPages) {
                    currentPage = totalPages;
                }

                renderTable();

                showToast(
                    "Data siswa berhasil dihapus."
                );
            }
        });
    }


    /* =========================================================
       PROFILE DROPDOWN
       ========================================================= */

    if (profileButton && profileDropdown) {
        profileButton.addEventListener("click", event => {
            event.stopPropagation();

            profileDropdown.classList.toggle(
                "is-open"
            );
        });
    }


    document.addEventListener("click", event => {
        if (
            profileDropdown &&
            profileButton &&
            !profileButton.contains(event.target) &&
            !profileDropdown.contains(event.target)
        ) {
            profileDropdown.classList.remove(
                "is-open"
            );
        }
    });


    /* =========================================================
       SIDEBAR
       ========================================================= */

    function openSidebar() {
        document.body.classList.add("nav-open");
    }


    function closeSidebar() {
        document.body.classList.remove("nav-open");
    }


    if (sidebarToggle) {
        sidebarToggle.addEventListener(
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


    /* =========================================================
       LOGOUT
       ========================================================= */

    function handleLogout() {
        window.location.href = "/";
    }


    if (dropdownLogout) {
        dropdownLogout.addEventListener(
            "click",
            handleLogout
        );
    }


    if (sidebarLogout) {
        sidebarLogout.addEventListener(
            "click",
            handleLogout
        );
    }


    /* =========================================================
       ESCAPE
       ========================================================= */

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") {
            return;
        }

        closeStudentModal();
        closeDetailModal();
        closeSidebar();

        if (profileDropdown) {
            profileDropdown.classList.remove(
                "is-open"
            );
        }
    });


    /* =========================================================
       MODAL BACKDROP
       ========================================================= */

    if (studentModal) {
        studentModal.addEventListener(
            "click",
            event => {
                if (event.target === studentModal) {
                    closeStudentModal();
                }
            }
        );
    }


    if (detailModal) {
        detailModal.addEventListener(
            "click",
            event => {
                if (event.target === detailModal) {
                    closeDetailModal();
                }
            }
        );
    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    updateDate();
    updateStats();
    renderTable();
});
