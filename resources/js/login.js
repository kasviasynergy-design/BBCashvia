document.addEventListener("DOMContentLoaded", () => {

    /*
    |--------------------------------------------------------------------------
    | DATA DEMO
    |--------------------------------------------------------------------------
    | Ini hanya untuk simulasi frontend.
    | Nanti akan diganti dengan database/backend Laravel.
    |--------------------------------------------------------------------------
    */

    const demoUsers = {
        "azinun@bbcashvia.sch.id": {
            password: "azinun#2026",
            role: "admin",
            name: "Admin BBCashvia"
        },

        "bendahara@bbcashvia.sch.id": {
            password: "Bendahara#2026",
            role: "bendahara",
            name: "Bendahara BBCashvia"
        },

        "viewer@bbcashvia.sch.id": {
            password: "Viewer#2026",
            role: "viewer",
            name: "Viewer BBCashvia"
        }
    };


    /*
    |--------------------------------------------------------------------------
    | ELEMENT
    |--------------------------------------------------------------------------
    */

    const loginForm = document.getElementById("loginForm");

    const identityInput = document.getElementById("identity");

    const passwordInput = document.getElementById("password");

    const togglePassword = document.getElementById("togglePassword");

    const peekIcon = document.getElementById("peekIcon");

    const submitBtn = document.getElementById("submitBtn");

    const identityError = document.getElementById("identityError");

    const passwordError = document.getElementById("passwordError");

    const alertBox = document.getElementById("alertBox");

    const alertText = document.getElementById("alertText");

    const forgotLink = document.getElementById("forgotLink");

    const helpLink = document.getElementById("helpLink");

    const forgotModal = document.getElementById("forgotModal");

    const successOverlay = document.getElementById("successOverlay");

    const successText = document.getElementById("successText");


    /*
    |--------------------------------------------------------------------------
    | ROLE PICKER
    |--------------------------------------------------------------------------
    */

    const roleTabs = document.querySelectorAll(".role-tab");

    const roleNoteIcon = document.getElementById("roleNoteIcon");

    const roleNoteText = document.getElementById("roleNoteText");


    const roleInformation = {

        admin: {
            icon: "admin_panel_settings",
            text:
                "<strong>Super Administrator:</strong> Konfigurasi sistem global, master siswa &amp; kelas, hak otorisasi rekening, serta riwayat audit transaksi menyeluruh."
        },

        bendahara: {
            icon: "account_balance_wallet",
            text:
                "<strong>Bendahara Kas:</strong> Mengelola data siswa, pembayaran, pemasukan, pengeluaran, saldo, serta laporan sesuai kelas yang menjadi tanggung jawabnya."
        },

        viewer: {
            icon: "visibility",
            text:
                "<strong>Viewer:</strong> Melihat informasi pembayaran, pemasukan, pengeluaran, saldo, dan laporan sesuai hak akses tanpa mengubah data."
        }

    };


    roleTabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            roleTabs.forEach((item) => {

                item.classList.remove("is-active");

                item.setAttribute(
                    "aria-selected",
                    "false"
                );

            });


            tab.classList.add("is-active");

            tab.setAttribute(
                "aria-selected",
                "true"
            );


            const selectedRole =
                tab.dataset.role;

            const role =
                roleInformation[selectedRole];

            if (!role) return;


            if (roleNoteIcon) {

                roleNoteIcon.textContent =
                    role.icon;

            }


            if (roleNoteText) {

                roleNoteText.innerHTML =
                    role.text;

            }

        });

    });


    /*
    |--------------------------------------------------------------------------
    | SHOW / HIDE PASSWORD
    |--------------------------------------------------------------------------
    */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type === "password";


                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";


                togglePassword.setAttribute(
                    "aria-pressed",
                    String(isPassword)
                );


                togglePassword.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                );


                if (peekIcon) {

                    peekIcon.textContent =
                        isPassword
                            ? "visibility_off"
                            : "visibility";

                }

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | PASSWORD POLICY
    |--------------------------------------------------------------------------
    */

    const pwPolicy =
        document.getElementById("pwPolicy");


    const ruleLength =
        document.querySelector(
            '[data-rule="length"]'
        );


    const ruleUpper =
        document.querySelector(
            '[data-rule="upper"]'
        );


    const ruleSpecial =
        document.querySelector(
            '[data-rule="special"]'
        );


    /*
    |--------------------------------------------------------------------------
    | UPDATE PASSWORD RULE
    |--------------------------------------------------------------------------
    */

    function updatePasswordRule(
        ruleElement,
        isValid
    ) {

        if (!ruleElement) return;


        ruleElement.classList.toggle(
            "is-valid",
            isValid
        );


        const icon =
            ruleElement.querySelector(
                ".material-symbols-outlined"
            );


        if (icon) {

            icon.textContent =
                isValid
                    ? "check_circle"
                    : "circle";

        }

    }


    /*
    |--------------------------------------------------------------------------
    | CHECK PASSWORD RULES
    |--------------------------------------------------------------------------
    */

    function checkPasswordRules(password) {

        const lengthOK =
            password.length >= 8;


        const upperOK =
            /[A-Z]/.test(password);


        const specialOK =
            /[^A-Za-z0-9]/.test(password);


        updatePasswordRule(
            ruleLength,
            lengthOK
        );


        updatePasswordRule(
            ruleUpper,
            upperOK
        );


        updatePasswordRule(
            ruleSpecial,
            specialOK
        );


        return {

            length: lengthOK,

            upper: upperOK,

            special: specialOK

        };

    }


    /*
    |--------------------------------------------------------------------------
    | PASSWORD INPUT EVENT
    |--------------------------------------------------------------------------
    */

    if (passwordInput) {

        passwordInput.addEventListener(
            "focus",
            () => {

                if (pwPolicy) {

                    pwPolicy.hidden = false;

                }


                checkPasswordRules(
                    passwordInput.value
                );

            }
        );


        passwordInput.addEventListener(
            "input",
            () => {

                checkPasswordRules(
                    passwordInput.value
                );

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | ERROR HELPER
    |--------------------------------------------------------------------------
    */

    function clearErrors() {

        if (identityError) {

            identityError.textContent = "";

            identityError.hidden = true;

        }


        if (passwordError) {

            passwordError.textContent = "";

            passwordError.hidden = true;

        }


        if (alertBox) {

            alertBox.hidden = true;

        }

    }


    function showIdentityError(message) {

        if (!identityError) return;


        identityError.textContent =
            message;


        identityError.hidden =
            false;

    }


    function showPasswordError(message) {

        if (!passwordError) return;


        passwordError.textContent =
            message;


        passwordError.hidden =
            false;

    }


    function showAlert(message) {

        if (!alertBox) return;


        alertText.textContent =
            message;


        alertBox.hidden =
            false;

    }


    /*
    |--------------------------------------------------------------------------
    | FORGOT PASSWORD MODAL
    |--------------------------------------------------------------------------
    */

    function openForgotModal() {

        if (!forgotModal) return;


        forgotModal.hidden =
            false;

    }


    function closeForgotModal() {

        if (!forgotModal) return;


        forgotModal.hidden =
            true;

    }


    if (forgotLink) {

        forgotLink.addEventListener(
            "click",
            openForgotModal
        );

    }


    if (helpLink) {

        helpLink.addEventListener(
            "click",
            openForgotModal
        );

    }


    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach((element) => {

            element.addEventListener(
                "click",
                closeForgotModal
            );

        });


    /*
    |--------------------------------------------------------------------------
    | ESC UNTUK MENUTUP MODAL
    |--------------------------------------------------------------------------
    */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                forgotModal &&
                !forgotModal.hidden
            ) {

                closeForgotModal();

            }

        }
    );


    /*
    |--------------------------------------------------------------------------
    | GET SAVED PASSWORD
    |--------------------------------------------------------------------------
    |
    | Setelah user mengganti password,
    | password baru disimpan di localStorage.
    |
    */

    function getChangedPasswords() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "bbc_changed_passwords"
                )
            ) || {};

        } catch (error) {

            return {};

        }

    }


    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                clearErrors();


                const email =
                    identityInput.value
                        .trim()
                        .toLowerCase();


                const password =
                    passwordInput.value;


                /*
                |--------------------------------------------------------------------------
                | VALIDASI EMAIL
                |--------------------------------------------------------------------------
                */

                if (!email) {

                    showIdentityError(
                        "Username/email wajib diisi."
                    );


                    identityInput.focus();

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | VALIDASI PASSWORD
                |--------------------------------------------------------------------------
                */

                if (!password) {

                    showPasswordError(
                        "Kata sandi wajib diisi."
                    );


                    passwordInput.focus();

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | CEK AKUN
                |--------------------------------------------------------------------------
                */

                const user =
                    demoUsers[email];


                if (!user) {

                    showAlert(
                        "Username/email tidak ditemukan."
                    );

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | PASSWORD BARU YANG SUDAH DIGANTI
                |--------------------------------------------------------------------------
                */

                const changedPasswords =
                    getChangedPasswords();


                const hasChangedPassword =
                    Object.prototype.hasOwnProperty.call(
                        changedPasswords,
                        email
                    );


                const correctPassword =
                    hasChangedPassword
                        ? changedPasswords[email]
                        : user.password;


                /*
                |--------------------------------------------------------------------------
                | CEK PASSWORD
                |--------------------------------------------------------------------------
                */

                if (
                    password !==
                    correctPassword
                ) {

                    showAlert(
                        "Username/email atau kata sandi salah."
                    );

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | LOGIN PERTAMA
                |--------------------------------------------------------------------------
                |
                | Kalau password belum pernah diganti,
                | arahkan ke halaman Change Password.
                |
                */

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


                /*
                |--------------------------------------------------------------------------
                | LOGIN SETELAH PASSWORD DIGANTI
                |--------------------------------------------------------------------------
                */

                showSuccess(
                    user.role
                );

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | SUCCESS OVERLAY
    |--------------------------------------------------------------------------
    */

    function showSuccess(role) {

        if (!successOverlay) {

            redirectToDashboard(role);

            return;

        }


        const roleName = {

            admin:
                "Dashboard Admin",

            bendahara:
                "Dashboard Bendahara",

            viewer:
                "Dashboard Viewer"

        };


        successText.textContent =
            `Login berhasil. Mengalihkan ke ${
                roleName[role] || "dashboard"
            }...`;


        successOverlay.hidden =
            false;


        setTimeout(() => {

            redirectToDashboard(
                role
            );

        }, 1200);

    }


    /*
    |--------------------------------------------------------------------------
    | REDIRECT DASHBOARD
    |--------------------------------------------------------------------------
    */

    function redirectToDashboard(role) {

        if (role === "admin") {

            window.location.href =
                "/dashboard/admin";

            return;

        }


        if (role === "bendahara") {

            window.location.href =
                "/dashboard/bendahara";

            return;

        }


        if (role === "viewer") {

            window.location.href =
                "/dashboard/viewer";

            return;

        }


        window.location.href =
            "/";

    }

});
