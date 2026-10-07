console.log("LOGIN JS BBCASHVIA TERLOAD");

document.addEventListener("DOMContentLoaded", () => {
    // =========================================================
    // DATA DEMO
    // =========================================================

    const demoUsers = {
        "admin@gmail.com": {
            password: "Admin#2026",
            role: "admin",
            name: "Admin"
        },

        "bendahara@gmail.com": {
            password: "Bendahara#2026",
            role: "bendahara",
            name: "Bendahara"
        },

        "viewer@gmail.com": {
            password: "Viewer#2026",
            role: "viewer",
            name: "Viewer"
        }
    };


    // =========================================================
    // ELEMENT
    // =========================================================

    const loginForm = document.getElementById("loginForm");

    const identityInput = document.getElementById("identity");
    const passwordInput = document.getElementById("password");

    const submitBtn = document.getElementById("submitBtn");

    const identityError = document.getElementById("identityError");
    const passwordError = document.getElementById("passwordError");

    const alertBox = document.getElementById("alertBox");
    const alertText = document.getElementById("alertText");

    const roleTabs = document.querySelectorAll(".role-tab");

    const roleNoteIcon = document.getElementById("roleNoteIcon");
    const roleNoteText = document.getElementById("roleNoteText");

    const togglePassword = document.getElementById("togglePassword");
    const peekIcon = document.getElementById("peekIcon");

    const forgotLink = document.getElementById("forgotLink");
    const helpLink = document.getElementById("helpLink");

    const forgotModal = document.getElementById("forgotModal");

    const successOverlay = document.getElementById("successOverlay");
    const successText = document.getElementById("successText");

    const pwPolicy = document.getElementById("pwPolicy");

    const lengthRule = document.querySelector(
        '[data-rule="length"]'
    );

    const upperRule = document.querySelector(
        '[data-rule="upper"]'
    );

    const specialRule = document.querySelector(
        '[data-rule="special"]'
    );


    // =========================================================
    // HELPER EMAIL
    // =========================================================

    function normalizeEmail(value) {
        return String(value || "")
            .trim()
            .toLowerCase();
    }


    // =========================================================
    // ROLE INFORMATION
    // =========================================================

    const roleInformation = {
        admin: {
            icon: "admin_panel_settings",
            label: "Email Administrator",
            hint: "Email Pribadi",
            text: `
                <strong>Super Administrator:</strong>
                Konfigurasi sistem global, master siswa &amp; kelas,
                hak otorisasi rekening, serta riwayat audit transaksi menyeluruh.
            `
        },

        bendahara: {
            icon: "account_balance_wallet",
            label: "Email Bendahara",
            hint: "Email Pribadi",
            text: `
                <strong>Bendahara Kas:</strong>
                Mengelola transaksi, iuran, data kas, serta informasi
                yang sesuai dengan kelas atau tanggung jawab yang diberikan.
            `
        },

        viewer: {
            icon: "visibility",
            label: "Email Viewer",
            hint: "Email Pribadi",
            text: `
                <strong>Viewer:</strong>
                Memantau informasi kas dan laporan yang tersedia
                tanpa melakukan perubahan terhadap data sistem.
            `
        }
    };


    function getSelectedRole() {
        const activeRoleTab =
            document.querySelector(".role-tab.is-active");

        return activeRoleTab
            ? activeRoleTab.dataset.role
            : null;
    }


    // =========================================================
    // ROLE TAB
    // =========================================================

    roleTabs.forEach((tab) => {
        tab.addEventListener("click", () => {

            roleTabs.forEach((item) => {
                item.classList.remove("is-active");
                item.setAttribute("aria-selected", "false");
            });

            tab.classList.add("is-active");
            tab.setAttribute("aria-selected", "true");

            updateRoleInformation(tab.dataset.role);
            clearErrors();
        });
    });


    function updateRoleInformation(role) {
        const info = roleInformation[role];

        if (!info) {
            return;
        }

        const identityLabel =
            document.getElementById("identityLabel");

        const identityHint =
            document.getElementById("identityHint");

        const identityIcon =
            document.getElementById("identityIcon");

        if (identityLabel) {
            identityLabel.textContent = info.label;
        }

        if (identityHint) {
            identityHint.textContent = info.hint;
        }

        if (identityIcon) {
            identityIcon.textContent = "badge";
        }

        if (roleNoteIcon) {
            roleNoteIcon.textContent = info.icon;
        }

        if (roleNoteText) {
            roleNoteText.innerHTML = info.text;
        }
    }


    // =========================================================
    // PASSWORD SHOW / HIDE
    // =========================================================

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {

            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword ? "text" : "password";

            if (peekIcon) {
                peekIcon.textContent =
                    isPassword
                        ? "visibility_off"
                        : "visibility";
            }

            togglePassword.setAttribute(
                "aria-label",
                isPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
            );

            togglePassword.setAttribute(
                "aria-pressed",
                isPassword ? "true" : "false"
            );
        });
    }


    // =========================================================
    // PASSWORD POLICY DISPLAY
    // =========================================================

    function updatePasswordPolicy(password) {

        const hasLength =
            password.length >= 8;

        const hasUpper =
            /[A-Z]/.test(password);

        const hasSpecial =
            /[^A-Za-z0-9]/.test(password);

        updateRule(lengthRule, hasLength);
        updateRule(upperRule, hasUpper);
        updateRule(specialRule, hasSpecial);
    }


    function updateRule(element, valid) {

        if (!element) {
            return;
        }

        element.classList.toggle(
            "is-ok",
            valid
        );

        const icon =
            element.querySelector(
                ".material-symbols-outlined"
            );

        if (icon) {
            icon.textContent =
                valid
                    ? "check_circle"
                    : "circle";
        }
    }


    if (passwordInput) {

        passwordInput.addEventListener(
            "focus",
            () => {

                if (pwPolicy) {
                    pwPolicy.hidden = false;
                }

                updatePasswordPolicy(
                    passwordInput.value
                );
            }
        );


        passwordInput.addEventListener(
            "input",
            () => {

                updatePasswordPolicy(
                    passwordInput.value
                );

                clearPasswordError();
                hideAlert();
            }
        );
    }


    // =========================================================
    // ERROR HANDLING
    // =========================================================

    function clearErrors() {
        clearIdentityError();
        clearPasswordError();
        hideAlert();
    }


    function clearIdentityError() {

        if (identityError) {
            identityError.textContent = "";
            identityError.hidden = true;
        }

        if (identityInput) {
            identityInput.classList.remove(
                "is-invalid"
            );
        }
    }


    function clearPasswordError() {

        if (passwordError) {
            passwordError.textContent = "";
            passwordError.hidden = true;
        }

        if (passwordInput) {
            passwordInput.classList.remove(
                "is-invalid"
            );
        }
    }


    function showIdentityError(message) {

        if (identityError) {
            identityError.textContent = message;
            identityError.hidden = false;
        }

        if (identityInput) {
            identityInput.classList.add(
                "is-invalid"
            );
        }
    }


    function showPasswordError(message) {

        if (passwordError) {
            passwordError.textContent = message;
            passwordError.hidden = false;
        }

        if (passwordInput) {
            passwordInput.classList.add(
                "is-invalid"
            );
        }
    }


    function showAlert(message) {

        if (alertBox) {
            alertBox.hidden = false;
        }

        if (alertText) {
            alertText.textContent = message;
        }
    }


    function hideAlert() {

        if (alertBox) {
            alertBox.hidden = true;
        }

        if (alertText) {
            alertText.textContent = "";
        }
    }


    // =========================================================
    // FORGOT PASSWORD MODAL
    // =========================================================

    function openForgotModal() {

        if (!forgotModal) {
            return;
        }

        forgotModal.hidden = false;
        document.body.style.overflow = "hidden";
    }


    function closeForgotModal() {

        if (!forgotModal) {
            return;
        }

        forgotModal.hidden = true;
        document.body.style.overflow = "";
    }


    if (forgotLink) {
        forgotLink.addEventListener("click", (event) => {
            event.preventDefault();
            openForgotModal();
        });
    }


    if (helpLink) {
        helpLink.addEventListener("click", (event) => {
            event.preventDefault();
            openForgotModal();
        });
    }


    if (forgotModal) {

        const closeButtons =
            forgotModal.querySelectorAll(
                "[data-close-modal]"
            );

        closeButtons.forEach((button) => {
            button.addEventListener(
                "click",
                closeForgotModal
            );
        });
    }


    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeForgotModal();
        }
    });


    // =========================================================
    // PASSWORD BARU YANG SUDAH DISIMPAN
    // =========================================================

    function getChangedPasswords() {

        const storageKey =
            "bbc_changed_passwords";

        try {

            const saved =
                localStorage.getItem(storageKey);

            if (!saved) {
                return {};
            }

            const parsed =
                JSON.parse(saved);

            if (
                parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
            ) {
                return parsed;
            }

        } catch (error) {

            console.error(
                "Gagal membaca password tersimpan:",
                error
            );

        }

        return {};
    }


    // =========================================================
    // SIMPAN SESSION USER
    // =========================================================

    function saveLoggedInUser(
        email,
        user
    ) {

        sessionStorage.setItem(
            "bbc_user_email",
            email
        );

        sessionStorage.setItem(
            "bbc_user_role",
            user.role
        );

        sessionStorage.setItem(
            "bbc_user_name",
            user.name
        );
    }


    // =========================================================
    // DASHBOARD REDIRECT
    // =========================================================

    function redirectToDashboard(role) {

        const routes = {
            admin: "/dashboard/admin",
            bendahara: "/dashboard/bendahara",
            viewer: "/dashboard/viewer"
        };

        const destination =
            routes[role];

        if (!destination) {
            console.error(
                "Role tidak memiliki dashboard:",
                role
            );

            window.location.href = "/";
            return;
        }

        window.location.href =
            destination;
    }


    // =========================================================
    // SUCCESS LOGIN
    // =========================================================

    function showSuccess(role) {

        if (!successOverlay) {
            redirectToDashboard(role);
            return;
        }

        const messages = {
            admin:
                "Login berhasil. Mengarahkan ke Dashboard Admin...",

            bendahara:
                "Login berhasil. Mengarahkan ke Dashboard Bendahara...",

            viewer:
                "Login berhasil. Mengarahkan ke Dashboard Viewer..."
        };

        if (successText) {
            successText.textContent =
                messages[role] ||
                "Login berhasil. Mengarahkan ke dashboard...";
        }

        successOverlay.hidden = false;

        setTimeout(() => {
            redirectToDashboard(role);
        }, 800);
    }


    // =========================================================
    // LOADING
    // =========================================================

    function setLoading(isLoading) {

        if (!submitBtn) {
            return;
        }

        submitBtn.classList.toggle(
            "is-loading",
            isLoading
        );

        submitBtn.disabled =
            isLoading;
    }


    // =========================================================
    // LOGIN PROCESS
    // =========================================================

    function handleLogin() {

        if (
            submitBtn &&
            submitBtn.disabled
        ) {
            return;
        }

        clearErrors();

        const email =
            normalizeEmail(
                identityInput?.value
            );

        const password =
            passwordInput?.value || "";


        // -----------------------------------------------------
        // EMAIL KOSONG
        // -----------------------------------------------------

        if (!email) {

            showIdentityError(
                "Email wajib diisi."
            );

            identityInput?.focus();

            return;
        }


        // -----------------------------------------------------
        // PASSWORD KOSONG
        // -----------------------------------------------------

        if (!password) {

            showPasswordError(
                "Kata sandi wajib diisi."
            );

            passwordInput?.focus();

            return;
        }


        // -----------------------------------------------------
        // CARI USER
        // -----------------------------------------------------

        const user =
            demoUsers[email];


        if (!user) {

            showIdentityError(
                "Email belum terdaftar."
            );

            identityInput?.focus();

            return;
        }


        // -----------------------------------------------------
        // CEK ROLE
        // -----------------------------------------------------

        const selectedRole =
            getSelectedRole();


        if (
            selectedRole &&
            selectedRole !== user.role
        ) {

            showAlert(
                "Peran yang dipilih tidak sesuai dengan akun ini."
            );

            return;
        }


        // -----------------------------------------------------
        // AMBIL PASSWORD
        // -----------------------------------------------------

        const changedPasswords =
            getChangedPasswords();

        const hasChangedPassword =
            Object.prototype.hasOwnProperty.call(
                changedPasswords,
                email
            );


        const correctPassword =
            hasChangedPassword
                ? String(changedPasswords[email])
                : user.password;


        // -----------------------------------------------------
        // CEK PASSWORD
        // -----------------------------------------------------

        if (password !== correctPassword) {

            showPasswordError(
                "Kata sandi yang dimasukkan salah."
            );

            passwordInput?.focus();

            return;
        }


        // -----------------------------------------------------
        // LOGIN PERTAMA
        // -----------------------------------------------------

        if (!hasChangedPassword) {

            sessionStorage.setItem(
                "bbc_pending_email",
                email
            );

            sessionStorage.setItem(
                "bbc_pending_role",
                user.role
            );

            window.location.href =
                "/change-password";

            return;
        }


        // -----------------------------------------------------
        // LOGIN KEDUA
        // -----------------------------------------------------

        saveLoggedInUser(
            email,
            user
        );

        setLoading(true);

        showSuccess(user.role);
    }


    // =========================================================
    // FORM SUBMIT
    // =========================================================

    /*
     * HANYA gunakan submit event.
     *
     * Jangan tambahkan click event ke submitBtn.
     * Kalau keduanya digunakan, handleLogin() dapat dipanggil
     * dua kali.
     */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                handleLogin();
            }
        );

    } else {

        console.error(
            "ERROR: #loginForm tidak ditemukan."
        );
    }


    // =========================================================
    // CLEAR ERROR SAAT INPUT
    // =========================================================

    if (identityInput) {

        identityInput.addEventListener(
            "input",
            () => {

                clearIdentityError();
                hideAlert();
            }
        );
    }


    // =========================================================
    // ENTER
    // =========================================================

    if (identityInput) {

        identityInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {
                    event.preventDefault();

                    loginForm?.requestSubmit();
                }
            }
        );
    }


    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {
                    event.preventDefault();

                    loginForm?.requestSubmit();
                }
            }
        );
    }


    // =========================================================
    // INITIAL STATE
    // =========================================================

    if (successOverlay) {
        successOverlay.hidden = true;
    }

    if (forgotModal) {
        forgotModal.hidden = true;
    }

    if (alertBox) {
        alertBox.hidden = true;
    }

    if (identityError) {
        identityError.hidden = true;
    }

    if (passwordError) {
        passwordError.hidden = true;
    }


    updateRoleInformation("admin");

    console.log(
        "Login JS BBCashvia berhasil dijalankan."
    );
});
