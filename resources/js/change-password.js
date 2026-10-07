document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENT
    // =========================================================

    const changePasswordForm =
        document.getElementById(
            "changePasswordForm"
        );

    const newPassword =
        document.getElementById(
            "newPassword"
        );

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        );

    const passwordError =
        document.getElementById(
            "passwordError"
        );

    const confirmError =
        document.getElementById(
            "confirmError"
        );

    const successMessage =
        document.getElementById(
            "successMessage"
        );

    const toggleNewPassword =
        document.getElementById(
            "toggleNewPassword"
        );

    const toggleConfirmPassword =
        document.getElementById(
            "toggleConfirmPassword"
        );

    const submitButton =
        changePasswordForm?.querySelector(
            'button[type="submit"]'
        );


    // =========================================================
    // USER PENDING
    // =========================================================

    const email =
        normalizeEmail(
            sessionStorage.getItem(
                "bbc_pending_email"
            )
        );

    const role =
        sessionStorage.getItem(
            "bbc_pending_role"
        );


    // =========================================================
    // CEK USER
    // =========================================================

    if (!email || !role) {

        console.warn(
            "Tidak ada user yang sedang melakukan change password."
        );

        window.location.href = "/";

        return;
    }


    // =========================================================
    // NORMALIZE EMAIL
    // =========================================================

    function normalizeEmail(value) {

        return String(value || "")
            .trim()
            .toLowerCase();
    }


    // =========================================================
    // PASSWORD TOGGLE
    // =========================================================

    function setupPasswordToggle(
        button,
        input
    ) {

        if (!button || !input) {
            return;
        }

        button.addEventListener(
            "click",
            () => {

                const isPassword =
                    input.type === "password";

                input.type =
                    isPassword
                        ? "text"
                        : "password";


                const icon =
                    button.querySelector(
                        ".material-symbols-outlined"
                    );


                if (icon) {

                    icon.textContent =
                        isPassword
                            ? "visibility_off"
                            : "visibility";
                }


                button.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                );
            }
        );
    }


    setupPasswordToggle(
        toggleNewPassword,
        newPassword
    );


    setupPasswordToggle(
        toggleConfirmPassword,
        confirmPassword
    );


    // =========================================================
    // VALIDASI PASSWORD
    // =========================================================

    function validatePassword(password) {

        const hasLength =
            password.length >= 8;

        const hasUpper =
            /[A-Z]/.test(password);

        const hasSpecial =
            /[^A-Za-z0-9]/.test(password);

        return (
            hasLength &&
            hasUpper &&
            hasSpecial
        );
    }


    // =========================================================
    // CLEAR ERROR
    // =========================================================

    function clearErrors() {

        if (passwordError) {
            passwordError.textContent = "";
            passwordError.hidden = true;
        }

        if (confirmError) {
            confirmError.textContent = "";
            confirmError.hidden = true;
        }
    }


    // =========================================================
    // AMBIL PASSWORD TERSIMPAN
    // =========================================================

    function getChangedPasswords() {

        try {

            const saved =
                localStorage.getItem(
                    "bbc_changed_passwords"
                );

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
    // SIMPAN PASSWORD
    // =========================================================

    function saveChangedPassword(
        email,
        password
    ) {

        const changedPasswords =
            getChangedPasswords();

        changedPasswords[email] =
            password;

        localStorage.setItem(
            "bbc_changed_passwords",
            JSON.stringify(
                changedPasswords
            )
        );
    }


    // =========================================================
    // SUBMIT CHANGE PASSWORD
    // =========================================================

    if (changePasswordForm) {

        changePasswordForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                clearErrors();


                const password =
                    newPassword?.value || "";

                const confirmation =
                    confirmPassword?.value || "";


                // -------------------------------------------------
                // PASSWORD KOSONG
                // -------------------------------------------------

                if (!password) {

                    if (passwordError) {

                        passwordError.textContent =
                            "Kata sandi baru wajib diisi.";

                        passwordError.hidden =
                            false;
                    }

                    newPassword?.focus();

                    return;
                }


                // -------------------------------------------------
                // PASSWORD TIDAK SESUAI RULE
                // -------------------------------------------------

                if (
                    !validatePassword(
                        password
                    )
                ) {

                    if (passwordError) {

                        passwordError.textContent =
                            "Kata sandi harus memiliki minimal 8 karakter, 1 huruf kapital, dan 1 karakter khusus.";

                        passwordError.hidden =
                            false;
                    }

                    newPassword?.focus();

                    return;
                }


                // -------------------------------------------------
                // KONFIRMASI KOSONG
                // -------------------------------------------------

                if (!confirmation) {

                    if (confirmError) {

                        confirmError.textContent =
                            "Konfirmasi kata sandi wajib diisi.";

                        confirmError.hidden =
                            false;
                    }

                    confirmPassword?.focus();

                    return;
                }


                // -------------------------------------------------
                // PASSWORD TIDAK SAMA
                // -------------------------------------------------

                if (
                    password !== confirmation
                ) {

                    if (confirmError) {

                        confirmError.textContent =
                            "Konfirmasi kata sandi tidak sama.";

                        confirmError.hidden =
                            false;
                    }

                    confirmPassword?.focus();

                    return;
                }


                // -------------------------------------------------
                // CEK EMAIL PENDING
                // -------------------------------------------------

                if (!email || !role) {

                    window.location.href =
                        "/";

                    return;
                }


                // -------------------------------------------------
                // SIMPAN PASSWORD BARU
                // -------------------------------------------------

                try {

                    saveChangedPassword(
                        email,
                        password
                    );

                } catch (error) {

                    console.error(
                        "Gagal menyimpan password:",
                        error
                    );

                    if (passwordError) {

                        passwordError.textContent =
                            "Kata sandi gagal disimpan. Silakan coba lagi.";

                        passwordError.hidden =
                            false;
                    }

                    return;
                }


                // -------------------------------------------------
                // HAPUS PENDING
                // -------------------------------------------------

                sessionStorage.removeItem(
                    "bbc_pending_email"
                );

                sessionStorage.removeItem(
                    "bbc_pending_role"
                );


                // -------------------------------------------------
                // SIMPAN STATUS BERHASIL
                // -------------------------------------------------

                if (successMessage) {

                    successMessage.textContent =
                        "Kata sandi berhasil dibuat. Mengarahkan ke halaman login...";

                    successMessage.hidden =
                        false;
                }


                // -------------------------------------------------
                // NONAKTIFKAN BUTTON
                // -------------------------------------------------

                if (submitButton) {
                    submitButton.disabled = true;
                }


                // -------------------------------------------------
                // KEMBALI KE LOGIN
                // -------------------------------------------------

                setTimeout(() => {

                    window.location.href =
                        "/?password_changed=1";

                }, 1000);

            }
        );
    }


    // =========================================================
    // CLEAR ERROR SAAT MENGETIK
    // =========================================================

    if (newPassword) {

        newPassword.addEventListener(
            "input",
            () => {

                if (passwordError) {
                    passwordError.textContent = "";
                    passwordError.hidden = true;
                }
            }
        );
    }


    if (confirmPassword) {

        confirmPassword.addEventListener(
            "input",
            () => {

                if (confirmError) {
                    confirmError.textContent = "";
                    confirmError.hidden = true;
                }
            }
        );
    }


    console.log(
        "Change Password JS BBCashvia berhasil dijalankan."
    );
});
