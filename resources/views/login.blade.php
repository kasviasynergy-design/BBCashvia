<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Masuk — BBCashvia | KASVIA Synergy</title>

    <meta name="description"
        content="Gerbang autentikasi terpadu BBCashvia — sistem kas kelas digital SMK Budi Bakti Ciwidey.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet">

    @vite([
        'resources/css/login.css',
        'resources/js/login.js'
    ])
</head>

<body>

    <!-- Latar ambient -->
    <div class="ambient" aria-hidden="true">
        <span class="ambient__blob ambient__blob--a"></span>
        <span class="ambient__blob ambient__blob--b"></span>
        <span class="ambient__blob ambient__blob--c"></span>
    </div>

    <!-- Header -->
    <header class="site-header">
        <div class="site-header__inner">

            <div class="brand">
                <span class="brand__icon material-symbols-outlined" aria-hidden="true">
                    account_balance
                </span>

                <span class="brand__text">
                    <strong class="brand__name">BBCashvia</strong>
                    <small class="brand__tag">KASVIA Synergy</small>
                </span>
            </div>

            <div class="site-header__badges">

                <span class="status-badge">
                    <span class="status-badge__dot" aria-hidden="true"></span>
                    Sistem Operasional Normal
                </span>

                <span class="status-badge status-badge--icon">
                    <span class="material-symbols-outlined" aria-hidden="true">
                        verified
                    </span>
                    Enkripsi Sesi Terproteksi
                </span>

            </div>

        </div>
    </header>


    <!-- Konten utama -->
    <main class="portal">

        <div class="portal__inner">

            <!-- Strip konteks portal -->
            <div class="portal-strip">

                <div class="portal-strip__left">

                    <span class="portal-strip__pulse" aria-hidden="true"></span>

                    <strong>KASVIA Multi-Portal</strong>

                    <span class="portal-strip__sep" aria-hidden="true">
                        &bull;
                    </span>

                    <span class="portal-strip__crumb">
                        Gerbang Autentikasi Kas Kelas
                    </span>

                </div>

                <div class="portal-strip__right">

                    <span class="material-symbols-outlined" aria-hidden="true">
                        lock_person
                    </span>

                    Akses Terpusat

                </div>

            </div>


            <!-- Kartu login -->
            <section class="card" aria-labelledby="loginTitle">

                <span class="card__glow" aria-hidden="true"></span>


                <div class="card__head">

                    <div class="card__chips">

                        <span class="chip chip--solid">
                            KASVIA SYNERGY
                        </span>

                        <span class="chip chip--soft">
                            T.A. 2026/2027
                        </span>

                    </div>

                    <div class="card__secure">

                        <span class="material-symbols-outlined" aria-hidden="true">
                            verified_user
                        </span>

                        <span>Secure Login</span>

                    </div>

                </div>


                <h1 class="card__title" id="loginTitle">
                    Akses Masuk
                </h1>

                <p class="card__lead">
                    Silakan tentukan hak akses peran Anda untuk mengelola atau meninjau pembukuan kas sekolah.
                </p>


                <!-- Pilihan peran -->
                <div class="role-picker">

                    <span class="role-picker__label" id="roleLabel">
                        Pilih Peran Pengguna
                    </span>

                    <div class="role-tabs"
                        role="tablist"
                        aria-labelledby="roleLabel">


                        <!-- ADMIN -->
                        <button
                            type="button"
                            class="role-tab is-active"
                            id="roleTab-admin"
                            role="tab"
                            aria-selected="true"
                            aria-controls="rolePanel"
                            data-role="admin">

                            <span class="material-symbols-outlined" aria-hidden="true">
                                admin_panel_settings
                            </span>

                            <span class="role-tab__name">
                                Admin
                            </span>

                            <small class="role-tab__sub">
                                Akses Penuh Master
                            </small>

                        </button>


                        <!-- BENDAHARA -->
                        <button
                            type="button"
                            class="role-tab"
                            id="roleTab-bendahara"
                            role="tab"
                            aria-selected="false"
                            aria-controls="rolePanel"
                            data-role="bendahara">

                            <span class="material-symbols-outlined" aria-hidden="true">
                                account_balance_wallet
                            </span>

                            <span class="role-tab__name">
                                Bendahara Kas
                            </span>

                            <small class="role-tab__sub">
                                Operasional Transaksi
                            </small>

                        </button>


                        <!-- VIEWER -->
                        <button
                            type="button"
                            class="role-tab"
                            id="roleTab-viewer"
                            role="tab"
                            aria-selected="false"
                            aria-controls="rolePanel"
                            data-role="viewer">

                            <span class="material-symbols-outlined" aria-hidden="true">
                                visibility
                            </span>

                            <span class="role-tab__name">
                                Viewer
                            </span>

                            <small class="role-tab__sub">
                                Pemantauan &amp; Audit
                            </small>

                        </button>

                    </div>


                    <div
                        class="role-note"
                        id="rolePanel"
                        role="tabpanel">

                        <span
                            class="material-symbols-outlined"
                            id="roleNoteIcon"
                            aria-hidden="true">

                            admin_panel_settings

                        </span>

                        <p id="roleNoteText">

                            <strong>Super Administrator:</strong>

                            Konfigurasi sistem global, master siswa &amp; kelas,
                            hak otorisasi rekening, serta riwayat audit transaksi menyeluruh.

                        </p>

                    </div>

                </div>


                <!-- Form autentikasi -->
                <form
                    class="login-form"
                    id="loginForm"
                    novalidate>


                    <!-- EMAIL / USERNAME -->
                    <div class="field">

                        <div class="field__head">

                            <label
                                class="field__label"
                                for="identity"
                                id="identityLabel">

                                Email Administrator

                            </label>

                            <span
                                class="field__hint"
                                id="identityHint">

                                Email Pribadi

                            </span>

                        </div>


                        <div class="field__control">

                            <span
                                class="field__icon material-symbols-outlined"
                                id="identityIcon"
                                aria-hidden="true">

                                badge

                            </span>


                            <input
                                class="field__input"
                                type="text"
                                id="identity"
                                name="identity"
                                placeholder="contoh: admin.utama@sekolah.sch.id"
                                autocomplete="username"
                                required
                                aria-describedby="identityError">

                        </div>


                        <p
                            class="field__error"
                            id="identityError"
                            aria-live="polite"
                            hidden>
                        </p>

                    </div>


                    <!-- PASSWORD -->
                    <div class="field">

                        <div class="field__head">

                            <label
                                class="field__label"
                                for="password">

                                Kata Sandi

                            </label>

                        </div>


                        <div class="field__control">

                            <span
                                class="field__icon material-symbols-outlined"
                                aria-hidden="true">

                                lock

                            </span>


                            <input
                                class="field__input"
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Masukkan kata sandi terdaftar"
                                autocomplete="current-password"
                                required
                                aria-describedby="pwPolicy passwordError">


                            <button
                                type="button"
                                class="field__peek"
                                id="togglePassword"
                                aria-label="Tampilkan kata sandi"
                                aria-pressed="false">

                                <span
                                    class="material-symbols-outlined"
                                    id="peekIcon"
                                    aria-hidden="true">

                                    visibility

                                </span>

                            </button>

                        </div>


                        <!-- Password policy -->
                        <div
                            class="pw-policy"
                            id="pwPolicy"
                            hidden>

                            <p class="pw-policy__title">
                                Kata sandi Anda harus memenuhi syarat berikut:
                            </p>


                            <ul class="pw-policy__list">

                                <li
                                    class="pw-policy__item"
                                    data-rule="length">

                                    <span
                                        class="material-symbols-outlined"
                                        aria-hidden="true">

                                        circle

                                    </span>

                                    Minimal 8 karakter

                                </li>


                                <li
                                    class="pw-policy__item"
                                    data-rule="upper">

                                    <span
                                        class="material-symbols-outlined"
                                        aria-hidden="true">

                                        circle

                                    </span>

                                    Memuat minimal 1 huruf kapital (A&ndash;Z)

                                </li>


                                <li
                                    class="pw-policy__item"
                                    data-rule="special">

                                    <span
                                        class="material-symbols-outlined"
                                        aria-hidden="true">

                                        circle

                                    </span>

                                    Memuat minimal 1 karakter khusus (!@#$%^&amp;*)

                                </li>

                            </ul>

                        </div>


                        <p
                            class="field__error"
                            id="passwordError"
                            aria-live="polite"
                            hidden>
                        </p>

                    </div>


                    <!-- Pesan error umum -->
                    <div
                        class="alert"
                        id="alertBox"
                        role="alert"
                        hidden>

                        <p id="alertText">
                            Username/email atau kata sandi salah.
                        </p>

                    </div>


                    <!-- Lupa password -->
                    <div class="login-form__meta">

                        <button
                            type="button"
                            class="link-quiet"
                            id="forgotLink">

                            <span
                                class="material-symbols-outlined"
                                aria-hidden="true">

                                help

                            </span>

                            Lupa kata sandi?

                        </button>

                    </div>


                    <!-- Tombol login -->
                    <button
                        type="submit"
                        class="btn-primary"
                        id="submitBtn">

                        <span class="btn-primary__label">
                            Masuk ke Sistem BBCashvia
                        </span>

                        <span
                            class="material-symbols-outlined btn-primary__arrow"
                            aria-hidden="true">

                            arrow_forward

                        </span>

                        <span
                            class="btn-primary__spinner"
                            aria-hidden="true">
                        </span>

                    </button>

                </form>


                                <!-- Bantuan akses -->
                <div class="card__assist">

                    <p>
                        Belum memiliki akses?
                        Akun hanya dapat dibuat oleh
                        <strong>Admin</strong>
                        sesuai hak akses Anda.
                    </p>

                    <button
                        type="button"
                        class="link-strong"
                        id="helpLink">

                        <span
                            class="material-symbols-outlined"
                            aria-hidden="true">

                            contact_support

                        </span>

                        Bantuan Akses &amp; Reset Kata Sandi

                    </button>

                </div>

            </section>
        </div>
    </main>


    <!-- Footer -->
    <footer class="site-footer">

        <div class="site-footer__inner">

            <p class="site-footer__copy">
                <center>BBCashvia
                <strong>KASVIA Synergy</strong>

                <span aria-hidden="true">
                    &bull;
                </span>

                Copyright &copy; 2026 BBCashvia
                &bull;
                KASVIA Synergy.
                </center>
            </p>


        </div>

    </footer>

    <!-- Modal Lupa Kata Sandi -->
    <div
        class="modal"
        id="forgotModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgotTitle"
        hidden>


        <div
            class="modal__backdrop"
            data-close-modal>
        </div>


        <div class="modal__panel">

            <div class="modal__head">

                <span
                    class="modal__icon material-symbols-outlined"
                    aria-hidden="true">

                    lock_reset

                </span>


                <div>

                    <h2
                        class="modal__title"
                        id="forgotTitle">

                        Lupa Kata Sandi?

                    </h2>

                    <p class="modal__sub">
                        Reset kata sandi hanya dapat dilakukan oleh Admin.
                    </p>

                </div>


                <button
                    type="button"
                    class="modal__close"
                    data-close-modal
                    aria-label="Tutup">

                    <span
                        class="material-symbols-outlined"
                        aria-hidden="true">

                        close

                    </span>

                </button>

            </div>


            <ol class="modal__steps">

                <li>

                    <strong>
                        Hubungi Admin
                    </strong>

                    <p>
                        Sampaikan permintaan reset kepada Admin BBCashvia
                        (Tim KASVIA Synergy) melalui guru pembimbing
                        atau kanal resmi sekolah.
                    </p>

                </li>


                <li>

                    <strong>
                        Verifikasi Identitas
                    </strong>

                    <p>
                        Admin memverifikasi nama, peran, dan identitas akun
                        Anda sebelum mereset kata sandi.
                    </p>

                </li>


                <li>

                    <strong>
                        Kata Sandi Baru
                    </strong>

                    <p>
                        Admin mengatur kata sandi sementara.
                        Segera ganti setelah berhasil masuk kembali.
                    </p>

                </li>

            </ol>


            <div class="modal__note">

                <span
                    class="material-symbols-outlined"
                    aria-hidden="true">

                    info

                </span>

                <p>
                    Tidak ada fitur registrasi maupun reset otomatis.
                    Seluruh kredensial diterbitkan dan dikelola oleh Admin
                    demi keamanan data kas.
                </p>

            </div>


            <button
                type="button"
                class="btn-primary btn-primary--block"
                data-close-modal>

                <span class="btn-primary__label">
                    Mengerti, Kembali ke Halaman Masuk
                </span>

            </button>

        </div>

    </div>


    <!-- Overlay sukses -->
    <div
        class="success-overlay"
        id="successOverlay"
        hidden>

        <div class="success-overlay__panel">

            <span
                class="success-overlay__check material-symbols-outlined"
                aria-hidden="true">

                check_circle

            </span>


            <h2>
                Autentikasi Berhasil
            </h2>


            <p id="successText">
                Mengalihkan ke dasbor Anda&hellip;
            </p>


            <span
                class="success-overlay__bar"
                aria-hidden="true">
            </span>

        </div>

    </div>

</body>

</html>
