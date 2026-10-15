console.log("LOGIN JS BBCASHVIA TERLOAD");

document.addEventListener("DOMContentLoaded", () => {
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

    const lengthRule = document.querySelector('[data-rule="length"]');
    const upperRule = document.querySelector('[data-rule="upper"]');
    const specialRule = document.querySelector('[data-rule="special"]');

    // =========================================================
    // CSRF TOKEN
    // =========================================================

    const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
    )?.getAttribute("content");

    // =========================================================
    // HELPER EMAIL
    // =========================================================

    function normalizeEmail(value) {
        return String(value || "").trim().toLowerCase();
    }

    // =========================================================
    // INFORMASI ROLE
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
        const activeRoleTab = document.querySelector(
            ".role-tab.is-active"
        );

        return activeRoleTab?.dataset.role || null;
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

        if (!info) return;

        const identityLabel = document.getElementById("identityLabel");
        const identityHint = document.getElementById("identityHint");
        const identityIcon = document.getElementById("identityIcon");

        if (identityLabel) identityLabel.textContent = info.label;
        if (identityHint) identityHint.textContent = info.hint;
        if (identityIcon) identityIcon.textContent = "badge";
        if (roleNoteIcon) roleNoteIcon.textContent = info.icon;

        if (roleNoteText) {
            roleNoteText.innerHTML = info.text;
        }
    }

    // =========================================================
    // PASSWORD SHOW / HIDE
    // =========================================================

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            if (peekIcon) {
                peekIcon.textContent = isPassword
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
        updateRule(lengthRule, password.length >= 8);
        updateRule(upperRule, /[A-Z]/.test(password));
        updateRule(specialRule, /[^A-Za-z0-9]/.test(password));
    }

    function updateRule(element, valid) {
        if (!element) return;

        element.classList.toggle("is-ok", valid);

        const icon = element.querySelector(
            ".material-symbols-outlined"
        );

        if (icon) {
            icon.textContent = valid ? "check_circle" : "circle";
        }
    }

    if (passwordInput) {
        passwordInput.addEventListener("focus", () => {
            if (pwPolicy) pwPolicy.hidden = false;

            updatePasswordPolicy(passwordInput.value);
        });

        passwordInput.addEventListener("input", () => {
            updatePasswordPolicy(passwordInput.value);
            clearPasswordError();
            hideAlert();
        });
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

        identityInput?.classList.remove("is-invalid");
    }

    function clearPasswordError() {
        if (passwordError) {
            passwordError.textContent = "";
            passwordError.hidden = true;
        }

        passwordInput?.classList.remove("is-invalid");
    }

    function showIdentityError(message) {
        if (identityError) {
            identityError.textContent = message;
            identityError.hidden = false;
        }

        identityInput?.classList.add("is-invalid");
    }

    function showPasswordError(message) {
        if (passwordError) {
            passwordError.textContent = message;
            passwordError.hidden = false;
        }

        passwordInput?.classList.add("is-invalid");
    }

    function showAlert(message) {
        if (alertBox) alertBox.hidden = false;
        if (alertText) alertText.textContent = message;
    }

    function hideAlert() {
        if (alertBox) alertBox.hidden = true;
        if (alertText) alertText.textContent = "";
    }

    // =========================================================
    // TAMPILKAN ERROR DARI LARAVEL
    // =========================================================

    function showServerErrors(errors, fallbackMessage) {
        clearErrors();

        if (errors?.email?.length) {
            showIdentityError(errors.email[0]);
        }

        if (errors?.password?.length) {
            showPasswordError(errors.password[0]);
        }

        if (errors?.role?.length) {
            showAlert(errors.role[0]);
        }

        if (
            !errors?.email?.length &&
            !errors?.password?.length &&
            !errors?.role?.length
        ) {
            showAlert(
                fallbackMessage ||
                "Login gagal. Silakan periksa kembali data Anda."
            );
        }
    }

    // =========================================================
    // MODAL LUPA PASSWORD
    // =========================================================

    function openForgotModal() {
        if (!forgotModal) return;

        forgotModal.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function closeForgotModal() {
        if (!forgotModal) return;

        forgotModal.hidden = true;
        document.body.style.overflow = "";
    }

    forgotLink?.addEventListener("click", (event) => {
        event.preventDefault();
        openForgotModal();
    });

    helpLink?.addEventListener("click", (event) => {
        event.preventDefault();
        openForgotModal();
    });

    if (forgotModal) {
        forgotModal
            .querySelectorAll("[data-close-modal]")
            .forEach((button) => {
                button.addEventListener("click", closeForgotModal);
            });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeForgotModal();
    });

    // =========================================================
    // LOADING
    // =========================================================

    function setLoading(isLoading) {
        if (!submitBtn) return;

        submitBtn.classList.toggle("is-loading", isLoading);
        submitBtn.disabled = isLoading;
    }

    // =========================================================
    // OVERLAY LOGIN BERHASIL
    // =========================================================

    function showSuccess(role, redirectUrl) {
        const messages = {
            admin: "Login berhasil. Mengarahkan ke Dashboard Admin...",
            bendahara: "Login berhasil. Mengarahkan ke Dashboard Bendahara...",
            viewer: "Login berhasil. Mengarahkan ke Dashboard Viewer..."
        };

        if (successText) {
            successText.textContent =
                messages[role] ||
                "Login berhasil. Mengarahkan ke halaman berikutnya...";
        }

        if (!successOverlay) {
            window.location.assign(redirectUrl);
            return;
        }

        successOverlay.hidden = false;

        window.setTimeout(() => {
            window.location.assign(redirectUrl);
        }, 800);
    }

    // =========================================================
    // PROSES LOGIN KE LARAVEL
    // =========================================================

    async function handleLogin() {
        if (submitBtn?.disabled) return;

        clearErrors();

        const email = normalizeEmail(identityInput?.value);
        const password = passwordInput?.value || "";
        const role = getSelectedRole();

        // Validasi input di sisi frontend.
        if (!email) {
            showIdentityError("Email wajib diisi.");
            identityInput?.focus();
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showIdentityError("Masukkan alamat email yang valid.");
            identityInput?.focus();
            return;
        }

        if (!password) {
            showPasswordError("Kata sandi wajib diisi.");
            passwordInput?.focus();
            return;
        }

        if (!role) {
            showAlert("Silakan pilih peran pengguna.");
            return;
        }

        if (!csrfToken) {
            showAlert(
                "Token keamanan tidak ditemukan. Muat ulang halaman login."
            );
            console.error("Meta CSRF token tidak ditemukan.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/login", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    role: role
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || data.success !== true) {
                showServerErrors(
                    data.errors,
                    data.message ||
                    "Email, kata sandi, atau peran tidak sesuai."
                );

                return;
            }

            if (!data.redirect) {
                showAlert(
                    "Login berhasil, tetapi alamat tujuan belum tersedia."
                );

                console.error("Respons login tidak memiliki redirect:", data);
                return;
            }

            // Laravel menentukan apakah harus mengganti password
            // atau masuk ke dashboard.
            if (data.must_change_password === true) {
                window.location.assign(data.redirect);
                return;
            }

            showSuccess(role, data.redirect);

        } catch (error) {
            console.error("Kesalahan saat menghubungi server:", error);

            showAlert(
                "Tidak dapat menghubungi server. Pastikan Laravel berjalan, lalu coba lagi."
            );

        } finally {
            setLoading(false);
        }
    }

    // =========================================================
    // FORM SUBMIT
    // =========================================================

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleLogin();
        });
    } else {
        console.error("ERROR: #loginForm tidak ditemukan.");
    }

    // =========================================================
    // HAPUS ERROR SAAT INPUT BERUBAH
    // =========================================================

    identityInput?.addEventListener("input", () => {
        clearIdentityError();
        hideAlert();
    });

    // =========================================================
    // INITIAL STATE
    // =========================================================

    if (successOverlay) successOverlay.hidden = true;
    if (forgotModal) forgotModal.hidden = true;
    if (alertBox) alertBox.hidden = true;
    if (identityError) identityError.hidden = true;
    if (passwordError) passwordError.hidden = true;

    updateRoleInformation("admin");

    console.log("Login JS BBCashvia berhasil dijalankan.");
});
