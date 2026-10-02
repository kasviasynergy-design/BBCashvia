<!DOCTYPE html>
<html lang="id">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>
        Buat Kata Sandi Baru — BBCashvia
    </title>

    <link rel="preconnect"
        href="https://fonts.googleapis.com">

    <link rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">

    <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet">

    @vite([
        'resources/css/change-password.css',
        'resources/js/change-password.js'
    ])

</head>


<body>

    <main class="change-password-page">

        <section class="change-password-card">

            <div class="change-password-icon">

                <span class="material-symbols-outlined">
                    lock_reset
                </span>

            </div>


            <p class="change-password-badge">
                AKSES PERTAMA
            </p>


            <h1>
                Buat Kata Sandi Baru
            </h1>


            <p class="change-password-description">

                Anda berhasil masuk menggunakan kata sandi
                sementara dari Admin.

                Silakan buat kata sandi Anda sendiri
                sebelum melanjutkan ke BBCashvia.

            </p>


            <form
                id="changePasswordForm"
                novalidate>


                <!-- PASSWORD BARU -->
                <div class="change-field">

                    <label for="newPassword">
                        Kata Sandi Baru
                    </label>


                    <div class="change-input">

                        <span class="material-symbols-outlined">
                            lock
                        </span>


                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Masukkan kata sandi baru"
                            autocomplete="new-password"
                            required>


                        <button
                            type="button"
                            id="toggleNewPassword"
                            aria-label="Tampilkan kata sandi">

                            <span class="material-symbols-outlined">
                                visibility
                            </span>

                        </button>

                    </div>


                    <small>
                        Minimal 8 karakter, 1 huruf kapital,
                        dan 1 karakter khusus.
                    </small>


                    <p
                        class="change-error"
                        id="passwordError"
                        hidden>
                    </p>

                </div>


                <!-- KONFIRMASI -->
                <div class="change-field">

                    <label for="confirmPassword">
                        Konfirmasi Kata Sandi
                    </label>


                    <div class="change-input">

                        <span class="material-symbols-outlined">
                            lock
                        </span>


                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Masukkan kembali kata sandi"
                            autocomplete="new-password"
                            required>


                        <button
                            type="button"
                            id="toggleConfirmPassword"
                            aria-label="Tampilkan kata sandi">

                            <span class="material-symbols-outlined">
                                visibility
                            </span>

                        </button>

                    </div>


                    <p
                        class="change-error"
                        id="confirmError"
                        hidden>
                    </p>

                </div>


                <p
                    class="change-success"
                    id="successMessage"
                    hidden>
                </p>


                <button
                    type="submit"
                    class="change-submit">

                    Simpan Kata Sandi

                    <span class="material-symbols-outlined">
                        arrow_forward
                    </span>

                </button>

            </form>


            <p class="change-password-note">

                Setelah berhasil, Anda akan kembali ke
                halaman login yang sama dan harus masuk
                menggunakan kata sandi baru.

            </p>

        </section>

    </main>

</body>

</html>
