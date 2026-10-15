document.addEventListener("DOMContentLoaded", () => {
    // =========================================================
    // ELEMENT
    // =========================================================

    const changePasswordForm =
        document.getElementById("changePasswordForm");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const passwordError =
        document.getElementById("passwordError");

    const confirmError =
        document.getElementById("confirmError");

    const successMessage =
        document.getElementById("successMessage");

    const toggleNewPassword =
        document.getElementById("toggleNewPassword");

    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");

    const submitButton =
        changePasswordForm?.querySelector(
            'button[type="submit"]'
        );

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");


    // =========================================================
    // PASSWORD TOGGLE
    // =========================================================

    function setupPasswordToggle(button, input) {
        if (!button || !input) return;

        button.addEventListener("click", () => {
            const isPassword = input.type === "password";

            input.type = isPassword ? "text" : "password";

            const icon = button.querySelector(
                ".material-symbols-outlined"
            );

            if (icon) {
                icon.textContent = isPassword
                    ? "visibility_off"
                    : "visibility";
            }

            button.setAttribute(
                "aria-label",
                isPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
            );
        });
    }

    setupPasswordToggle(toggleNewPassword, newPassword);
    setupPasswordToggle(toggleConfirmPassword, confirmPassword);


    // =========================================================
    // VALIDASI PASSWORD
    // =========================================================

    function validatePassword(password) {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        );
    }


    // =========================================================
    // ERROR HANDLING
    // =========================================================

    function clearErrors() {
        [passwordError, confirmError].forEach((element) => {
            if (!element) return;

            element.textContent = "";
            element.hidden = true;
        });
    }

    function showError(element, message) {
        if (!element) return;

        element.textContent = message;
        element.hidden = false;
    }

    function showServerErrors(errors, fallbackMessage) {
        clearErrors();

        if (errors?.new_password?.length) {
            showError(passwordError, errors.new_password[0]);
        }

        if (errors?.new_password_confirmation?.length) {
            showError(
                confirmError,
                errors.new_password_confirmation[0]
            );
        }

        if (
            !errors?.new_password?.length &&
            !errors?.new_password_confirmation?.length
        ) {
            showError(
                passwordError,
                fallbackMessage ||
                    "Password gagal diubah. Silakan coba lagi."
            );
        }
    }


    // =========================================================
    // SUBMIT CHANGE PASSWORD KE LARAVEL
    // =========================================================

    if (changePasswordForm) {
        changePasswordForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                if (submitButton?.disabled) return;

                clearErrors();

                if (successMessage) {
                    successMessage.textContent = "";
                    successMessage.hidden = true;
                }

                const password = newPassword?.value || "";
                const confirmation = confirmPassword?.value || "";

                // Password wajib diisi.
                if (!password) {
                    showError(
                        passwordError,
                        "Kata sandi baru wajib diisi."
                    );

                    newPassword?.focus();
                    return;
                }

                // Validasi format password.
                if (!validatePassword(password)) {
                    showError(
                        passwordError,
                        "Kata sandi harus memiliki minimal 8 karakter, 1 huruf kapital, dan 1 karakter khusus."
                    );

                    newPassword?.focus();
                    return;
                }

                // Konfirmasi wajib diisi.
                if (!confirmation) {
                    showError(
                        confirmError,
                        "Konfirmasi kata sandi wajib diisi."
                    );

                    confirmPassword?.focus();
                    return;
                }

                // Password harus sama.
                if (password !== confirmation) {
                    showError(
                        confirmError,
                        "Konfirmasi kata sandi tidak sama."
                    );

                    confirmPassword?.focus();
                    return;
                }

                // Pastikan token keamanan tersedia.
                if (!csrfToken) {
                    showError(
                        passwordError,
                        "Token keamanan tidak ditemukan. Muat ulang halaman."
                    );

                    console.error("Meta CSRF token tidak ditemukan.");
                    return;
                }

                if (submitButton) {
                    submitButton.disabled = true;
                }

                try {
                    const response = await fetch("/change-password", {
                        method: "POST",
                        credentials: "same-origin",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "X-CSRF-TOKEN": csrfToken,
                            "X-Requested-With": "XMLHttpRequest"
                        },
                        body: JSON.stringify({
                            new_password: password,
                            new_password_confirmation: confirmation
                        })
                    });

                    const data = await response.json().catch(() => ({}));

                    if (!response.ok || data.success !== true) {
                        if (response.status === 401) {
                            window.location.assign("/");
                            return;
                        }

                        showServerErrors(
                            data.errors,
                            data.message ||
                                "Password gagal diubah. Silakan coba lagi."
                        );

                        return;
                    }

                    // Password sudah berhasil disimpan oleh Laravel.
                    if (successMessage) {
                        successMessage.textContent =
                            data.message ||
                            "Password berhasil diubah. Mengarahkan ke halaman login...";

                        successMessage.hidden = false;
                    }

                    if (newPassword) newPassword.value = "";
                    if (confirmPassword) confirmPassword.value = "";

                    // Bersihkan data sementara versi lama jika ada.
                    sessionStorage.removeItem("bbc_pending_email");
                    sessionStorage.removeItem("bbc_pending_role");

                    window.setTimeout(() => {
                        window.location.assign(data.redirect || "/");
                    }, 1000);

                } catch (error) {
                    console.error(
                        "Kesalahan saat menghubungi server:",
                        error
                    );

                    showError(
                        passwordError,
                        "Tidak dapat menghubungi server. Pastikan Laravel berjalan, lalu coba lagi."
                    );

                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                }
            }
        );
    }


    // =========================================================
    // HAPUS ERROR SAAT INPUT BERUBAH
    // =========================================================

    newPassword?.addEventListener("input", () => {
        if (passwordError) {
            passwordError.textContent = "";
            passwordError.hidden = true;
        }
    });

    confirmPassword?.addEventListener("input", () => {
        if (confirmError) {
            confirmError.textContent = "";
            confirmError.hidden = true;
        }
    });

    console.log(
        "Change Password JS BBCashvia berhasil dijalankan."
    );
});
