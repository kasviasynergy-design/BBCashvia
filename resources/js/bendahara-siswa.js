// BBCASHVIA - modul bersama S3-07 (pengaman simpan ganda).
import {
    kunciIdempoten,
    kunciTombolSimpan,
} from "./simpan-guard.js";

document.addEventListener("DOMContentLoaded", () => {
    /* =========================================================
       BBCASHVIA - BENDAHARA DATA SISWA
       Data berasal dari database (endpoint /bendahara/api/*).
       Tidak menggunakan data dummy.
       ========================================================= */

    /* =========================================================
       ENDPOINT + STATE
       ========================================================= */

    const API_SISWA = "/bendahara/api/siswa";
    const API_KELAS = "/bendahara/api/kelas";

    let students = [];
    let daftarKelas = [];

    let csrfToken = "";

    const bacaCsrf = () => {
        const meta = document.querySelector('meta[name="csrf-token"]');

        return meta ? meta.getAttribute("content") : "";
    };

    const ambilJSON = async (url) => {
        let respons;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            respons = await fetch(url, {
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                credentials: "same-origin",
                signal: controller.signal
            });
        } catch (error) {
            clearTimeout(timeoutId);
            if (error?.name === "AbortError") throw new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi.");
            throw new Error("Tidak dapat terhubung ke server.");
        }
        clearTimeout(timeoutId);

        let hasil = {};
        try {
            hasil = await respons.json();
        } catch {
            /* bukan JSON */
        }

        if (!respons.ok) {
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");
            throw new Error(hasil?.message || "Gagal mengambil data dari server.");
        }

        return hasil;
    };

    const kirimJSON = async (url, method, payload) => {
        let respons;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            respons = await fetch(url, {
                method,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrfToken,
                    // S3-07: POST dibawa kunci idempotensi untuk
                    // pengaman simpan ganda di backend.
                    ...(String(method).toUpperCase() === "POST"
                        ? { "X-Idempotency-Key": kunciIdempoten() }
                        : {}),
                },
                credentials: "same-origin",
                body: JSON.stringify(payload),
                signal: controller.signal
            });
        } catch (error) {
            clearTimeout(timeoutId);
            if (error?.name === "AbortError") throw new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi.");
            throw new Error("Tidak dapat terhubung ke server.");
        }
        clearTimeout(timeoutId);

        let hasil = {};
        try {
            hasil = await respons.json();
        } catch {
            /* bukan JSON */
        }

        if (!respons.ok) {
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");
            if (hasil?.errors) {
                const pesan = Object.values(hasil.errors).flat().filter(Boolean);
                if (pesan.length) throw new Error(pesan.join(" "));
            }
            throw new Error(hasil?.message || "Terjadi kesalahan saat menyimpan.");
        }

        return hasil;
    };

    const hapusData = async (url) => {
        let respons;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            respons = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrfToken
                },
                credentials: "same-origin",
                signal: controller.signal
            });
        } catch (error) {
            clearTimeout(timeoutId);
            if (error?.name === "AbortError") throw new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi.");
            throw new Error("Tidak dapat terhubung ke server.");
        }
        clearTimeout(timeoutId);

        let hasil = {};
        try {
            hasil = await respons.json();
        } catch {
            /* bukan JSON */
        }

        if (!respons.ok) {
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");
            throw new Error(hasil?.message || "Gagal menghapus data.");
        }

        return hasil;
    };


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
    const studentStatusAktif = document.getElementById("studentStatusAktif");
    const studentJenisKelamin = document.getElementById("studentJenisKelamin");
    const studentNoHp = document.getElementById("studentNoHp");
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

        // "Belum Lunas" mencakup siswa yang belum membayar sama sekali
        // maupun yang baru membayar sebagian.
        const unpaid = students.filter(
            student => student.status !== "lunas"
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
                    : student.status === "sebagian"
                        ? "status-badge status-badge--warning"
                        : "status-badge status-badge--danger";

            const statusText =
                student.status === "lunas"
                    ? "Sudah Bayar"
                    : student.status === "sebagian"
                        ? "Sebagian"
                        : "Belum Bayar";

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
                editingNis.value = student.id_siswa; // Simpan id_siswa (PK) untuk URL API PUT
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
                studentStatus.value = student.status === "lunas" ? "lunas" : "belum";
            }

            if (studentStatusAktif) {
                studentStatusAktif.value = student.status_aktif || "Aktif";
            }

            if (studentJenisKelamin) {
                studentJenisKelamin.value = student.jenis_kelamin || "";
            }

            if (studentNoHp) {
                studentNoHp.value = student.no_hp || "";
            }

            if (studentBill) {
                studentBill.value = student.bill || 0;
            }

            if (studentPaid) {
                studentPaid.value = student.paid || 0;
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
                isiPilihanKelas();
                studentClass.value = "";
            }

            if (studentStatusAktif) {
                studentStatusAktif.value = "Aktif";
            }

            if (studentJenisKelamin) {
                studentJenisKelamin.value = "";
            }

            if (studentNoHp) {
                studentNoHp.value = "";
            }

            if (studentBill) {
                studentBill.value = 0;
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
        studentForm.addEventListener("submit", async event => {
            event.preventDefault();

            clearFormErrors();

            // S3-07: kunci tombol simpan saat proses (teks
            // "Memproses...", tidak dapat diklik dua kali via klik
            // maupun Enter). null = masih diproses, boleh henti.
            const tombolSimpan = studentForm.querySelector(
                'button[type="submit"]'
            );

            const pemulihanTombol = kunciTombolSimpan(tombolSimpan);

            if (!pemulihanTombol) return;

            try {

            const nis = studentNis
                ? studentNis.value.trim()
                : "";

            const name = studentName
                ? studentName.value.trim()
                : "";

            const className = studentClass
                ? studentClass.value.trim()
                : "";

            const statusAktif = studentStatusAktif
                ? studentStatusAktif.value
                : "Aktif";

            let valid = true;

            const editingId =
                editingNis && editingNis.value
                    ? editingNis.value.trim()
                    : "";

            const duplicateNis = students.some(student => {
                return (
                    student.nis === nis &&
                    String(student.id_siswa) !== editingId
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

            const kelasCocok = daftarKelas.find(
                (k) =>
                    String(k.nama_kelas).toLowerCase() ===
                    className.toLowerCase()
            );

            const payload = {
                nis,
                nama: name,
                id_kelas: kelasCocok
                    ? Number(kelasCocok.id_kelas)
                    : null,
                jenis_kelamin: studentJenisKelamin ? studentJenisKelamin.value : "",
                no_hp: studentNoHp ? studentNoHp.value.trim() : "",
                status: statusAktif
            };

            const siswaLama = editingId
                ? students.find((s) => String(s.id_siswa) === String(editingId))
                : null;

            try {

                if (siswaLama) {

                    await kirimJSON(
                        `${API_SISWA}/${siswaLama.id_siswa}`,
                        "PUT",
                        payload
                    );

                    showToast("Data siswa berhasil diperbarui.");

                } else {

                    await kirimJSON(API_SISWA, "POST", payload);

                    showToast("Siswa berhasil ditambahkan.");
                }

            } catch (err) {

                showFormError(nisError, err.message);

                return;
            }

            await muatData();

            closeStudentModal();
            } finally {
                // S3-07: tombol pulih setelah proses apa pun berakhir
                // (sukses, gagal validasi, maupun galat server).
                pemulihanTombol.pulihkan();
            }
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
                    ? "Sudah Bayar"
                    : student.status === "sebagian"
                        ? "Sebagian"
                        : "Belum Bayar";

            modalStatus.className =
                student.status === "lunas"
                    ? "status-badge status-badge--success"
                    : student.status === "sebagian"
                        ? "status-badge status-badge--warning"
                        : "status-badge status-badge--danger";
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
                    : student.status === "sebagian"
                        ? "Siswa sudah membayar sebagian, tetapi masih memiliki sisa tagihan."
                        : "Siswa masih memiliki tagihan yang belum dibayar.";
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
        tableBody.addEventListener("click", async event => {
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

                try {

                    await hapusData(
                        `${API_SISWA}/${student.id_siswa}`
                    );

                } catch (err) {

                    showToast(err.message);

                    return;
                }

                await muatData();

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
        window.location.href = "/logout";
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
       MUAT DATA DARI DATABASE
       ========================================================= */

    const muatData = async () => {

        const tbodyBend = document.getElementById("studentTableBody");
        if (tbodyBend) {
            tbodyBend.innerHTML = Array.from({ length: 5 })
                .map(() => `<tr class="skeleton-row"><td colspan="7"><div class="skeleton skeleton-text--lg"></div></td></tr>`)
                .join("");
        }

        let hasilSiswa = { data: [], kelas: [] };

        try {

            hasilSiswa = await ambilJSON(API_SISWA);

        } catch (err) {

            console.error(err);

            showToast(err.message);
        }

        daftarKelas = Array.isArray(hasilSiswa?.kelas)
            ? hasilSiswa.kelas
            : [];

        isiPilihanKelas();

        // Status, tagihan, dan pembayaran dihitung di server dari
        // pembayaran iuran yang benar-benar tercatat.
        students = (Array.isArray(hasilSiswa?.data)
            ? hasilSiswa.data
            : []
        ).map((s) => {

            const statusIuran = ["lunas", "sebagian", "belum"].includes(
                s.status_iuran
            )
                ? s.status_iuran
                : "belum";

            return {
                id_siswa: s.id_siswa,
                nis: s.nis ?? "-",
                name: s.nama ?? "-",
                className: s.kelas || "-",
                status: statusIuran,
                status_aktif: s.status ?? "Aktif",
                jenis_kelamin: s.jenis_kelamin ?? "",
                no_hp: s.no_hp ?? "",
                bill: Number(s.tagihan_iuran) || 0,
                paid: Number(s.terbayar_iuran) || 0,
                sisa: Number(s.sisa_iuran) || 0
            };
        });

        currentPage = 1;

        updateStats();

        renderTable();
    };


    const isiPilihanKelas = () => {

        if (!studentClass || studentClass.tagName !== "SELECT") {
            return;
        }

        const nilaiLama = studentClass.value;

        studentClass.innerHTML =
            `<option value="">- Pilih Kelas -</option>` +
            daftarKelas
                .map(
                    (k) =>
                        `<option value="${escapeHTML(k.nama_kelas)}">${escapeHTML(k.nama_kelas)}</option>`
                )
                .join("");

        studentClass.value = nilaiLama;
    };


    /* =========================================================
       INITIALIZE
       ========================================================= */

    csrfToken = bacaCsrf();

    updateDate();

    renderTable();

    muatData();
});
