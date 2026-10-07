document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       DATA DEMO
       ========================================================= */

    const DATA_PENGGUNA = [
        {
            id: "PGN-001",
            nama: "Azis N.",
            email: "azinun@bbcashvia.sch.id",
            peran: "admin",
            login: "2026-10-03 07:12",
            utama: true
        },
        {
            id: "PGN-002",
            nama: "Rani Puspita",
            email: "ranipuspita06@gmail.com",
            peran: "bendahara",
            login: "2026-10-02 15:40",
            utama: false
        },
        {
            id: "PGN-003",
            nama: "Bagas Wicaksono",
            email: "bagaswicaksono.ku@gmail.com",
            peran: "admin",
            login: "2026-10-01 09:30",
            utama: false
        },
        {
            id: "PGN-004",
            nama: "Kirana Maheswari",
            email: "kiranamaheswari.dv@gmail.com",
            peran: "bendahara",
            login: "2026-09-30 13:18",
            utama: false
        },
        {
            id: "PGN-005",
            nama: "Dimas Prakoso",
            email: "dimas.prakoso12@gmail.com",
            peran: "viewer",
            login: "2026-09-29 10:05",
            utama: false
        },
        {
            id: "PGN-006",
            nama: "Fajar Ramadhan",
            email: "fajarramadhan.rl@gmail.com",
            peran: "viewer",
            login: "2026-09-27 16:22",
            utama: false
        },
        {
            id: "PGN-007",
            nama: "Salsabila Putri",
            email: "salsabilaputri.aq@gmail.com",
            peran: "bendahara",
            login: "2026-09-26 08:45",
            utama: false
        },
        {
            id: "PGN-008",
            nama: "Nadia Ayu Lestari",
            email: "nadiaayulestari99@gmail.com",
            peran: "viewer",
            login: "2026-09-25 11:20",
            utama: false
        }
    ];


    /* =========================================================
       ELEMENT
       ========================================================= */

    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");

    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");

    const topbarDate = document.getElementById("topbarDate");

    const cariPengguna = document.getElementById("cariPengguna");
    const filterPeran = document.getElementById("filterPeran");
    const btnResetFilter = document.getElementById("btnResetFilter");

    const isiTabelPengguna = document.getElementById("isiTabelPengguna");
    const emptyState = document.getElementById("emptyState");
    const btnKosongkanFilter = document.getElementById("btnKosongkanFilter");

    const jumlahPengguna = document.getElementById("jumlahPengguna");

    const sumAdmin = document.getElementById("sumAdmin");
    const sumBendahara = document.getElementById("sumBendahara");
    const sumViewer = document.getElementById("sumViewer");

    const btnTambahPengguna = document.getElementById("btnTambahPengguna");

    const modalForm = document.getElementById("modalForm");
    const modalHapus = document.getElementById("modalHapus");

    const formPengguna = document.getElementById("formPengguna");
    const modalFormTitle = document.getElementById("modalFormTitle");

    const inputNama = document.getElementById("inputNama");
    const inputEmail = document.getElementById("inputEmail");
    const inputPeran = document.getElementById("inputPeran");
    const inputPassword = document.getElementById("inputPassword");

    const togglePassword = document.getElementById("togglePassword");
    const formError = document.getElementById("formError");

    const hapusNama = document.getElementById("hapusNama");
    const btnKonfirmasiHapus = document.getElementById("btnKonfirmasiHapus");

    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");


    /* =========================================================
       STATE
       ========================================================= */

    let editId = null;
    let hapusId = null;


    /* =========================================================
       HELPER
       ========================================================= */

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function roleLabel(role) {
        const labels = {
            admin: "Admin",
            bendahara: "Bendahara",
            viewer: "Viewer"
        };

        return labels[role] || role;
    }


    function roleClass(role) {
        const classes = {
            admin: "badge--primary",
            bendahara: "badge--success",
            viewer: "badge--neutral"
        };

        return classes[role] || "badge--neutral";
    }


    function avatarText(nama) {
        const parts = String(nama)
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (!parts.length) {
            return "U";
        }

        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    }


    function formatLogin(login) {
        if (!login) {
            return "Belum pernah masuk";
        }

        const parts = login.split(" ");

        if (parts.length < 2) {
            return login;
        }

        return `${parts[0]} • ${parts[1]}`;
    }


    function showToast(message) {

        if (!toast || !toastText) return;

        toastText.textContent = message;

        toast.classList.add("is-muncul");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove("is-muncul");
        }, 2600);
    }


    /* =========================================================
       DATE
       ========================================================= */

    function renderDate() {

        if (!topbarDate) return;

        const now = new Date();

        topbarDate.textContent = now.toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    }

    renderDate();


    /* =========================================================
       SIDEBAR RESPONSIVE
       ========================================================= */

    function openSidebar() {
        document.body.classList.add("nav-open");
    }


    function closeSidebar() {
        document.body.classList.remove("nav-open");
    }


    sidebarToggle?.addEventListener("click", () => {

        if (document.body.classList.contains("nav-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }

    });


    sidebarBackdrop?.addEventListener(
        "click",
        closeSidebar
    );


    document.querySelectorAll(".side-link").forEach((link) => {

        link.addEventListener("click", () => {
            closeSidebar();
        });

    });


    /* =========================================================
       PROFILE DROPDOWN
       ========================================================= */

    profileBtn?.addEventListener("click", (event) => {

        event.stopPropagation();

        if (!profileMenu) return;

        const isOpen =
            profileMenu.classList.toggle("is-open");

        profileBtn.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );
    });


    document.addEventListener("click", (event) => {

        if (
            profileMenu &&
            profileBtn &&
            !profileMenu.contains(event.target) &&
            !profileBtn.contains(event.target)
        ) {
            profileMenu.classList.remove("is-open");

            profileBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        }

    });


    /* =========================================================
       SUMMARY
       ========================================================= */

    function renderSummary() {

        const admin = DATA_PENGGUNA.filter(
            (user) => user.peran === "admin"
        ).length;

        const bendahara = DATA_PENGGUNA.filter(
            (user) => user.peran === "bendahara"
        ).length;

        const viewer = DATA_PENGGUNA.filter(
            (user) => user.peran === "viewer"
        ).length;


        if (sumAdmin) {
            sumAdmin.textContent = admin;
        }

        if (sumBendahara) {
            sumBendahara.textContent = bendahara;
        }

        if (sumViewer) {
            sumViewer.textContent = viewer;
        }
    }


    /* =========================================================
       FILTER
       ========================================================= */

    function getFilteredUsers() {

        const keyword = cariPengguna
            ? cariPengguna.value.trim().toLowerCase()
            : "";

        const role = filterPeran
            ? filterPeran.value
            : "semua";


        return DATA_PENGGUNA.filter((user) => {

            const matchKeyword =
                !keyword ||
                user.nama.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword);


            const matchRole =
                role === "semua" ||
                user.peran === role;


            return matchKeyword && matchRole;
        });
    }


    /* =========================================================
       TABLE
       ========================================================= */

    function renderTable() {

        if (!isiTabelPengguna) return;

        const data = getFilteredUsers();


        if (jumlahPengguna) {
            jumlahPengguna.textContent =
                `${data.length} pengguna`;
        }


        if (!data.length) {

            isiTabelPengguna.innerHTML = "";

            emptyState?.classList.add("is-visible");

            return;
        }


        emptyState?.classList.remove("is-visible");


        isiTabelPengguna.innerHTML = data
            .map((user) => {

                return `
                    <tr>

                        <td>
                            <div class="user-cell">

                                <div class="user-cell__avatar">
                                    ${escapeHtml(
                                        avatarText(user.nama)
                                    )}
                                </div>

                                <div class="user-cell__info">

                                    <div class="user-cell__name">
                                        ${escapeHtml(user.nama)}
                                    </div>

                                    <div class="user-cell__email">
                                        ${escapeHtml(user.email)}
                                    </div>

                                </div>

                            </div>
                        </td>


                        <td>
                            <span class="badge ${roleClass(user.peran)}">
                                ${escapeHtml(
                                    roleLabel(user.peran)
                                )}
                            </span>
                        </td>


                        <td>
                            <span class="badge badge--success">
                                <span class="status-dot"></span>
                                Aktif
                            </span>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${escapeHtml(
                                    formatLogin(user.login)
                                )}
                            </div>
                        </td>


                        <td class="th-c">

                            <div class="row-actions">

                                <button
                                    type="button"
                                    class="row-action"
                                    data-action="edit"
                                    data-id="${escapeHtml(user.id)}"
                                    title="Edit pengguna"
                                    aria-label="Edit pengguna"
                                >
                                    <span class="material-symbols-outlined">
                                        edit
                                    </span>
                                </button>


                                <button
                                    type="button"
                                    class="row-action row-action--danger"
                                    data-action="delete"
                                    data-id="${escapeHtml(user.id)}"
                                    title="Hapus pengguna"
                                    aria-label="Hapus pengguna"
                                    ${user.utama ? "disabled" : ""}
                                >
                                    <span class="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>

                            </div>

                        </td>

                    </tr>
                `;
            })
            .join("");
    }


    /* =========================================================
       FILTER EVENTS
       ========================================================= */

    cariPengguna?.addEventListener(
        "input",
        renderTable
    );


    filterPeran?.addEventListener(
        "change",
        renderTable
    );


    function resetFilter() {

        if (cariPengguna) {
            cariPengguna.value = "";
        }

        if (filterPeran) {
            filterPeran.value = "semua";
        }

        renderTable();
    }


    btnResetFilter?.addEventListener(
        "click",
        resetFilter
    );


    btnKosongkanFilter?.addEventListener(
        "click",
        resetFilter
    );


    /* =========================================================
       MODAL
       ========================================================= */

    function openModal(modal) {

        if (!modal) return;

        modal.classList.add("is-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("is-open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        if (!document.querySelector(
            ".modal.is-open"
        )) {

            document.body.classList.remove(
                "modal-open"
            );
        }
    }


    document
        .querySelectorAll("[data-close-modal]")
        .forEach((button) => {

            button.addEventListener("click", () => {

                closeModal(modalForm);
                closeModal(modalHapus);

            });

        });


    /* =========================================================
       FORM RESET
       ========================================================= */

    function clearFormError() {

        if (!formError) return;

        formError.textContent = "";

        formError.classList.remove(
            "is-visible"
        );
    }


    function showFormError(message) {

        if (!formError) return;

        formError.textContent = message;

        formError.classList.add(
            "is-visible"
        );
    }


    function resetForm() {

        formPengguna?.reset();

        editId = null;


        if (modalFormTitle) {
            modalFormTitle.textContent =
                "Tambah Pengguna";
        }


        if (inputPassword) {

            inputPassword.value = "";

            inputPassword.type = "password";

            inputPassword.required = true;

            inputPassword.placeholder =
                "Minimal 8 karakter";
        }


        if (togglePassword) {

            togglePassword.innerHTML = `
                <span class="material-symbols-outlined">
                    visibility
                </span>
            `;
        }


        clearFormError();


        if (inputPeran) {
            inputPeran.disabled = false;
        }
    }


    /* =========================================================
       TAMBAH PENGGUNA
       ========================================================= */

    btnTambahPengguna?.addEventListener(
        "click",
        () => {

            resetForm();

            openModal(modalForm);

            setTimeout(() => {
                inputNama?.focus();
            }, 100);

        }
    );


    /* =========================================================
       EDIT PENGGUNA
       ========================================================= */

    function openEdit(id) {

        const user = DATA_PENGGUNA.find(
            (item) => item.id === id
        );

        if (!user) return;


        editId = id;


        if (modalFormTitle) {
            modalFormTitle.textContent =
                "Edit Pengguna";
        }


        inputNama.value = user.nama;
        inputEmail.value = user.email;
        inputPeran.value = user.peran;


        inputPassword.value = "";
        inputPassword.type = "password";
        inputPassword.required = false;

        inputPassword.placeholder =
            "Kosongkan jika tidak ingin mengubah";


        if (togglePassword) {

            togglePassword.innerHTML = `
                <span class="material-symbols-outlined">
                    visibility
                </span>
            `;
        }


        /*
         * Akun utama tidak boleh berganti role.
         */
        inputPeran.disabled =
            Boolean(user.utama);


        clearFormError();

        openModal(modalForm);


        setTimeout(() => {
            inputNama?.focus();
        }, 100);
    }


    /* =========================================================
       DELETE
       ========================================================= */

    function openDelete(id) {

        const user = DATA_PENGGUNA.find(
            (item) => item.id === id
        );

        if (!user || user.utama) {
            return;
        }


        hapusId = id;


        if (hapusNama) {
            hapusNama.textContent =
                user.nama;
        }


        openModal(modalHapus);
    }


    /* =========================================================
       TABLE ACTION
       ========================================================= */

    isiTabelPengguna?.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-action]"
                );

            if (!button) return;


            const action =
                button.dataset.action;

            const id =
                button.dataset.id;


            if (action === "edit") {
                openEdit(id);
            }


            if (action === "delete") {
                openDelete(id);
            }

        }
    );


    /* =========================================================
       PASSWORD TOGGLE
       ========================================================= */

    togglePassword?.addEventListener(
        "click",
        () => {

            if (!inputPassword) return;


            const isPassword =
                inputPassword.type === "password";


            inputPassword.type =
                isPassword
                    ? "text"
                    : "password";


            togglePassword.innerHTML = `
                <span class="material-symbols-outlined">
                    ${
                        isPassword
                            ? "visibility_off"
                            : "visibility"
                    }
                </span>
            `;
        }
    );


    /* =========================================================
       SUBMIT FORM
       ========================================================= */

    formPengguna?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            clearFormError();


            const nama =
                inputNama.value.trim();

            const email =
                inputEmail.value.trim().toLowerCase();

            const peran =
                inputPeran.value;

            const password =
                inputPassword.value;


            /* NAMA */

            if (!nama) {

                showFormError(
                    "Nama pengguna wajib diisi."
                );

                inputNama.focus();

                return;
            }


            /* EMAIL */

            if (!email) {

                showFormError(
                    "Email wajib diisi."
                );

                inputEmail.focus();

                return;
            }


            /* FORMAT EMAIL */

            const emailValid =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email);


            if (!emailValid) {

                showFormError(
                    "Masukkan alamat email yang valid."
                );

                inputEmail.focus();

                return;
            }


            /* ROLE */

            if (
                !["admin", "bendahara", "viewer"]
                    .includes(peran)
            ) {

                showFormError(
                    "Pilih peran pengguna."
                );

                inputPeran.focus();

                return;
            }


            /* EMAIL DUPLIKAT */

            const emailExists =
                DATA_PENGGUNA.some((user) => {

                    return (
                        user.email.toLowerCase() === email &&
                        user.id !== editId
                    );

                });


            if (emailExists) {

                showFormError(
                    "Email tersebut sudah digunakan oleh pengguna lain."
                );

                inputEmail.focus();

                return;
            }


            /* PASSWORD TAMBAH */

            if (!editId && password.length < 8) {

                showFormError(
                    "Password awal minimal 8 karakter."
                );

                inputPassword.focus();

                return;
            }


            /* PASSWORD EDIT */

            if (
                editId &&
                password &&
                password.length < 8
            ) {

                showFormError(
                    "Password baru minimal 8 karakter."
                );

                inputPassword.focus();

                return;
            }


            /* =================================================
               EDIT
               ================================================= */

            if (editId) {

                const user =
                    DATA_PENGGUNA.find(
                        (item) =>
                            item.id === editId
                    );


                if (!user) return;


                user.nama = nama;
                user.email = email;


                if (!user.utama) {
                    user.peran = peran;
                }


                closeModal(modalForm);

                renderSummary();
                renderTable();


                showToast(
                    "Data pengguna berhasil diperbarui."
                );


                editId = null;

                return;
            }


            /* =================================================
               TAMBAH
               ================================================= */

            const maxNumber =
                DATA_PENGGUNA.reduce(
                    (max, user) => {

                        const number =
                            parseInt(
                                user.id.replace(
                                    "PGN-",
                                    ""
                                ),
                                10
                            ) || 0;

                        return Math.max(
                            max,
                            number
                        );

                    },
                    0
                );


            DATA_PENGGUNA.push({

                id:
                    `PGN-${String(
                        maxNumber + 1
                    ).padStart(3, "0")}`,

                nama,
                email,
                peran,

                login: null,

                utama: false

            });


            closeModal(modalForm);

            renderSummary();
            renderTable();


            showToast(
                "Pengguna baru berhasil ditambahkan."
            );


            editId = null;
        }
    );


    /* =========================================================
       KONFIRMASI HAPUS
       ========================================================= */

    btnKonfirmasiHapus?.addEventListener(
        "click",
        () => {

            if (!hapusId) return;


            const index =
                DATA_PENGGUNA.findIndex(
                    (item) =>
                        item.id === hapusId
                );


            if (index === -1) return;


            const user =
                DATA_PENGGUNA[index];


            if (user.utama) {

                closeModal(modalHapus);

                showToast(
                    "Akun utama Admin tidak dapat dihapus."
                );

                hapusId = null;

                return;
            }


            DATA_PENGGUNA.splice(
                index,
                1
            );


            hapusId = null;


            closeModal(modalHapus);

            renderSummary();
            renderTable();


            showToast(
                "Pengguna berhasil dihapus."
            );
        }
    );


    /* =========================================================
       ESCAPE
       ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            closeModal(modalForm);
            closeModal(modalHapus);


            profileMenu?.classList.remove(
                "is-open"
            );


            profileBtn?.setAttribute(
                "aria-expanded",
                "false"
            );


            closeSidebar();
        }
    );


    /* =========================================================
       INITIAL RENDER
       ========================================================= */

    renderSummary();
    renderTable();

});
