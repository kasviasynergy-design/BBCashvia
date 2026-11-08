{{--
    ============================================================
    BBCASHVIA - KONFIRMASI LOGOUT & OVERLAY MEMUAT
    ============================================================

    Disisipkan lewat @include('partials.konfirmasi-logout').

    Berisi:
    - Dialog konfirmasi sebelum benar-benar keluar (logout),
      supaya pengguna tidak langsung ter-logout karena salah pencet.
    - Overlay memuat (spinner + bar tipis di atas) supaya layar
      tidak kosong saat data sedang dimuat.

    Logika ada di resources/js/konfirmasi-logout.js, gaya di
    resources/css/konfirmasi-logout.css.
--}}

<!-- DIALOG KONFIRMASI LOGOUT -->
<div class="kl-backdrop" id="konfirmasiLogout" aria-hidden="true">
    <div class="kl-modal" role="alertdialog" aria-modal="true" aria-labelledby="klJudul" aria-describedby="klTeks">

        <span class="kl-modal__icon" aria-hidden="true">
            <span class="material-symbols-outlined">logout</span>
        </span>

        <h3 class="kl-modal__title" id="klJudul">Keluar dari akun?</h3>

        <p class="kl-modal__text" id="klTeks">
            Anda akan keluar dari akun
            <b id="klNamaUser">{{ auth()->user()->name ?? 'ini' }}</b>.
            Pastikan semua pekerjaan sudah tersimpan.
        </p>

        <div class="kl-modal__actions">
            <button type="button" class="kl-btn kl-btn--batal" id="klBatal">
                Tidak. Tetap di halaman
            </button>

            <button type="button" class="kl-btn kl-btn--keluar" id="klKeluar">
                <span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">logout</span>
                <span>Ya, Keluar saja!</span>
            </button>
        </div>

    </div>
</div>

<!-- OVERLAY MEMUAT -->
<div class="kl-loading" id="loadingOverlay" aria-hidden="true">
    <div class="kl-spinner" aria-hidden="true"></div>
    <p class="kl-loading__text" id="loadingText">Memuat data…</p>
</div>

<!-- BAR MEMUAT TIPIS DI ATAS -->
<div class="kl-topbar-loading" id="topbarLoading" aria-hidden="true"></div>
