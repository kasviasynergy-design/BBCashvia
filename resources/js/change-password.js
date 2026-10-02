document.addEventListener("DOMContentLoaded", () => {

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


    /*
    |--------------------------------------------------------------------------
    | CEK USER YANG SEDANG GANTI PASSWORD
    |--------------------------------------------------------------------------
    */

    const email =
        sessionStorage.getItem(
            "bbc_pending_email"
        );


    const role =
        sessionStorage.getItem(
            "bbc_pending_role"
        );


    /*
    |--------------------------------------------------------------------------
    | KALAU TIDAK ADA USER PENDING
    |--------------------------------------------------------------------------
    */

    if (!email || !role) {

        window.location.href = "/";

        return;

    }


    /*
    |--------------------------------------------------------------------------
    | SHOW / HIDE PASSWORD
    |--------------------------------------------------------------------------
    */

    function setupPasswordToggle(
        button,
        input
    ) {

        if (!button || !input) return;


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


    /*
    |--------------------------------------------------------------------------
    | PASSWORD RULE
    |--------------------------------------------------------------------------
    */

    function validatePassword(password) {

        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        );

    }


    /*
    |--------------------------------------------------------------------------
    | SIMPAN PASSWORD
    |--------------------------------------------------------------------------
    */

    if (changePasswordForm) {

        changePasswordForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                passwordError.hidden = true;

                confirmError.hidden = true;


                const password =
                    newPassword.value;


                const confirmation =
                    confirmPassword.value;


                /*
                |--------------------------------------------------------------------------
                | VALIDASI PASSWORD BARU
                |--------------------------------------------------------------------------
                */

                if (!validatePassword(password)) {

                    passwordError.textContent =
                        "Kata sandi harus memiliki minimal 8 karakter, 1 huruf kapital, dan 1 karakter khusus.";

                    passwordError.hidden = false;

                    newPassword.focus();

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | KONFIRMASI PASSWORD
                |--------------------------------------------------------------------------
                */

                if (password !== confirmation) {

                    confirmError.textContent =
                        "Konfirmasi kata sandi tidak sama.";

                    confirmError.hidden = false;

                    confirmPassword.focus();

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | AMBIL DATA PASSWORD
                |--------------------------------------------------------------------------
                */

                let changedPasswords = {};


                try {

                    changedPasswords =
                        JSON.parse(
                            localStorage.getItem(
                                "bbc_changed_passwords"
                            )
                        ) || {};

                } catch (error) {

                    changedPasswords = {};

                }


                /*
                |--------------------------------------------------------------------------
                | SIMPAN PASSWORD BARU
                |--------------------------------------------------------------------------
                */

                changedPasswords[email] =
                    password;


                localStorage.setItem(
                    "bbc_changed_passwords",
                    JSON.stringify(
                        changedPasswords
                    )
                );


                /*
                |--------------------------------------------------------------------------
                | HAPUS STATUS PENDING
                |--------------------------------------------------------------------------
                */

                sessionStorage.removeItem(
                    "bbc_pending_email"
                );


                sessionStorage.removeItem(
                    "bbc_pending_role"
                );


                /*
                |--------------------------------------------------------------------------
                | PESAN BERHASIL
                |--------------------------------------------------------------------------
                */

                if (successMessage) {

                    successMessage.textContent =
                        "Kata sandi berhasil dibuat. Anda akan dikembalikan ke halaman login.";

                    successMessage.hidden =
                        false;

                }


                /*
                |--------------------------------------------------------------------------
                | KEMBALI KE LOGIN YANG SAMA
                |--------------------------------------------------------------------------
                */

                setTimeout(() => {

                    window.location.href =
                        "/?password_changed=1";

                }, 1200);

            }
        );

    }

});
