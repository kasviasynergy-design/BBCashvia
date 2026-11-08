/* ============================================================
   BBCASHVIA - KONFIRMASI LOGOUT & HELPER MEMUAT
   ============================================================

   Dipakai di semua halaman (admin, bendahara, viewer).

   - Konfirmasi logout: mencegah pengguna langsung keluar karena
     salah pencet. Semua tautan/tombol logout di halaman otomatis
     dicegat dan menampilkan dialog "Yakin ingin keluar?" dulu.

   - Overlay memuat: menampilkan indikator saat halaman/permintaan
     sedang memuat data, supaya layar tidak terlihat kosong.

   Keduanya opsional: bila elemennya tidak ada di halaman, kode
   tidak melakukan apa-apa (aman untuk semua halaman).
   ============================================================ */

(function () {
    "use strict";

    /* ============================================================
       KONFIRMASI LOGOUT
       ============================================================ */

    const dialog = document.getElementById("konfirmasiLogout");
    const btnBatal = document.getElementById("klBatal");
    const btnKeluar = document.getElementById("klKeluar");
    const teksNama = document.getElementById("klNamaUser");

    /* Tautan/tombol logout yang akan dicegat. */
    const selektorLogout = [
        'a[href$="/logout"]',
        'a[href="/logout"]',
        'form[action$="/logout"] button[type="submit"]',
        '#sidebarLogout',
        '#dropdownLogout',
        '#logoutButton',
        '#btnProfileLogout',
        '#btnSidebarLogout',
        '[data-logout]',
        // Tambahan: link logout di dropdown profil (kanan atas)
        '.dropdown__item--danger[href$="/logout"]',
        'a.dropdown__item[role="menuitem"][href$="/logout"]'
    ].join(",");

    /* Simpan aksi logout agar bisa dijalankan setelah dikonfirmasi. */
    let aksiTertunda = null;

    const bukaDialog = (aksi) => {
        aksiTertunda = aksi;

        if (!dialog) {
            // Tidak ada dialog di halaman ini - langsung jalankan.
            aksi();
            return;
        }

        if (teksNama && !teksNama.textContent.trim()) {
            const nama = document.querySelector(
                "[data-nama-user], .sidebar__username, .topbar__profilename"
            );
            if (nama && nama.textContent.trim()) {
                teksNama.textContent = nama.textContent.trim();
            }
        }

        dialog.classList.add("is-open");
        dialog.setAttribute("aria-hidden", "false");

        // Fokuskan tombol "Batal" agar aman dari salah tekan.
        setTimeout(() => btnBatal && btnBatal.focus(), 60);
    };

    const tutupDialog = () => {
        if (!dialog) return;
        dialog.classList.remove("is-open");
        dialog.setAttribute("aria-hidden", "true");
        aksiTertunda = null;
    };

    const jalankanLogout = (formAtauHref) => {
        if (formAtauHref instanceof HTMLFormElement) {
            formAtauHref.submit();
            return;
        }
        if (typeof formAtauHref === "string") {
            window.location.href = formAtauHref;
        }
    };

    /*
     * Dipasang pada FASE CAPTURE (argumen ke-3 = true) supaya event
     * dicegat SEBELUM sampai ke tombol/tautan. Banyak halaman punya
     * penangan logout sendiri (langsung window.location.href), jadi
     * tanpa ini pengguna akan ter-logout sebelum dialog muncul.
     * stopImmediatePropagation() mematikan penangan lama tersebut.
     */
    document.addEventListener("click", (e) => {
        const target = e.target.closest(selektorLogout);
        if (!target) return;

        // Sudah dikonfirmasi? Biarkan aksi asli berjalan.
        if (target.dataset.klDiizinkan === "1") return;

        e.preventDefault();
        e.stopImmediatePropagation();

        // Tentukan aksi: kirim form POST (lebih aman) atau buka URL.
        const form = target.closest('form[action$="/logout"]');
        if (form) {
            bukaDialog(() => {
                form.dataset.klDiizinkan = "1";
                form.submit();
            });
            return;
        }

        const href = target.getAttribute("href") || "/logout";
        bukaDialog(() => jalankanLogout(href));
    }, true);

    // Form logout yang dikirim lewat Enter/Submit juga dicegat.
    document.addEventListener("submit", (e) => {
        const form = e.target;
        if (!(form instanceof HTMLFormElement)) return;
        if (!form.matches('form[action$="/logout"]')) return;
        if (form.dataset.klDiizinkan === "1") return;

        e.preventDefault();
        e.stopImmediatePropagation();

        bukaDialog(() => {
            form.dataset.klDiizinkan = "1";
            form.submit();
        });
    }, true);

    if (btnBatal) btnBatal.addEventListener("click", tutupDialog);

    if (btnKeluar) {
        btnKeluar.addEventListener("click", () => {
            const aksi = aksiTertunda;
            if (typeof aksi === "function") {
                aksi();
            } else {
                jalankanLogout("/logout");
            }
        });
    }

    if (dialog) {
        // Klik area gelap = batal.
        dialog.addEventListener("mousedown", (e) => {
            if (e.target === dialog) tutupDialog();
        });

        // Tombol Esc = batal.
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && dialog.classList.contains("is-open")) {
                tutupDialog();
            }
        });
    }

    /* ============================================================
       OVERLAY MEMUAT
       ============================================================ */

    const overlay = document.getElementById("loadingOverlay");
    const teksLoading = document.getElementById("loadingText");
    const topbar = document.getElementById("topbarLoading");

    let hitung = 0;

    const tampilkan = () => {
        hitung += 1;

        overlay?.classList.add("is-open");
        topbar?.classList.add("is-open");

        if (overlay) overlay.setAttribute("aria-hidden", "false");
    };

    const sembunyikan = () => {
        hitung = Math.max(0, hitung - 1);

        if (hitung > 0) return;

        overlay?.classList.remove("is-open");
        topbar?.classList.remove("is-open");

        if (overlay) overlay.setAttribute("aria-hidden", "true");
    };

    const aturTeks = (teks) => {
        if (teksLoading && teks) teksLoading.textContent = teks;
    };

    /* API global sederhana untuk dipakai skrip halaman. */
    window.KasviaMemuat = {
        mulai: (teks) => {
            if (teks) aturTeks(teks);
            tampilkan();
        },
        selesai: sembunyikan
    };

    /* ------------------------------------------------------------
       Tampilkan spinner saat memuat data dari API.

       Semua panggilan fetch ke endpoint internal dicatat, sehingga
       halaman tidak perlu diubah satu per satu. Overlay hanya
       muncul bila permintaan berlangsung lebih dari sesaat
       (mencegah kedipan pada respons cepat).
       ------------------------------------------------------------ */

    const fetchAsli = window.fetch;
    let jedaSpinner = null;

    const mulaiJikaLambat = () => {
        if (jedaSpinner) return;
        jedaSpinner = setTimeout(() => {
            jedaSpinner = null;
            tampilkan();
        }, 220);
    };

    const hentikanSpinner = () => {
        if (jedaSpinner) {
            clearTimeout(jedaSpinner);
            jedaSpinner = null;
        } else {
            sembunyikan();
        }
    };

    if (typeof fetchAsli === "function") {
        window.fetch = function (...args) {
            let alamat = "";

            try {
                alamat = typeof args[0] === "string"
                    ? args[0]
                    : (args[0] && args[0].url) || "";
            } catch {
                alamat = "";
            }

            const internal = alamat && !/^https?:\/\//i.test(alamat);

            if (!internal) {
                return fetchAsli.apply(this, args);
            }

            mulaiJikaLambat();
            permintaanAktif += 1;

            return fetchAsli.apply(this, args).finally(() => {
                permintaanAktif = Math.max(0, permintaanAktif - 1);
                hentikanSpinner();
                cobaBukaKunci();
            });
        };
    }

    /* ------------------------------------------------------------
       Tampilkan spinner saat berpindah halaman (klik menu / submit).
       ------------------------------------------------------------ */

    document.addEventListener("click", (e) => {
        const link = e.target.closest("a[href]");
        if (!link) return;

        const href = link.getAttribute("href") || "";

        if (
            href.startsWith("#") ||
            href.startsWith("javascript:") ||
            link.target === "_blank" ||
            link.hasAttribute("download") ||
            link.closest(".kl-backdrop")
        ) {
            return;
        }

        // Tautan logout ditangani dialog konfirmasi, bukan spinner.
        if (link.matches('a[href$="/logout"]')) return;

        // Tampilkan bar tipis sebagai isyarat perpindahan halaman.
        topbar?.classList.add("is-open");
    });

    document.addEventListener("submit", (e) => {
        const form = e.target;
        if (!(form instanceof HTMLFormElement)) return;
        if (form.matches('form[action$="/logout"]')) return;

        topbar?.classList.add("is-open");
    });

    /* ============================================================
       TOMBOL SIMPAN ANTI-SPAM KLIK (S3-07)
       ============================================================
       Saat form dikirim, tombol submit di-disable dan teksnya
       menjadi "Memproses…" (dengan titik-titik animasi). Ini
       mencegah pengguna mengeklik tombol berkali-kali sehingga
       data terkirim dua kali (duplikasi insert).

       - Tombol dibuka kembali otomatis setelah semua permintaan
         fetch halaman selesai (berhasil/berkomenang error apa pun).
       - Bila handler form gagal melakukan fetch (validasi gagal di
         sisi klien), kunci terbuka lagi setelah 400 ms.
       - Ada juga pengaman waktu maksimal 30 detik agar tombol tidak
         mungkin terkunci selamanya.
       ============================================================ */

    let permintaanAktif = 0;

    const tombolTerkunci = [];
    let kunciBekerja = false;
    let timerCekFetch = null;
    let timerPengaman = null;

    /* Cari simpul yang menyimpan teks tombol: span terakhir tanpa
       anak element (ikon Material imkannya jadi anak pertama), atau
       tombol itu sendiri bila teksnya langsung. */
    const simpulTeks = (tombol) => {
        const daun = Array.from(tombol.querySelectorAll("span")).filter(
            (span) => !span.querySelector("*") && span.textContent.trim().length > 0
        );
        return daun.length ? daun[daun.length - 1] : tombol;
    };

    const bukaSemuaKunci = () => {
        kunciBekerja = false;

        if (timerCekFetch) {
            clearTimeout(timerCekFetch);
            timerCekFetch = null;
        }

        if (timerPengaman) {
            clearTimeout(timerPengaman);
            timerPengaman = null;
        }

        while (tombolTerkunci.length) {
            const { tombol, node, teks } = tombolTerkunci.pop();

            if (!tombol || !tombol.disabled) continue;

            tombol.disabled = false;
            tombol.classList.remove("is-memproses", "kl-memproses-langsung");
            tombol.removeAttribute("aria-busy");

            if (node === tombol) {
                tombol.textContent = teks;
            } else if (node) {
                node.classList.remove("kl-titik-memproses");
                node.textContent = teks;
            }
        }
    };

    const cobaBukaKunci = () => {
        if (!kunciBekerja) return;
        if (permintaanAktif > 0) return;
        bukaSemuaKunci();
    };

    const kunciTombol = (tombol) => {
        if (!tombol || tombol.disabled) return;

        kunciBekerja = true;

        if (timerPengaman) clearTimeout(timerPengaman);
        timerPengaman = setTimeout(bukaSemuaKunci, 30000);

        const node = simpulTeks(tombol);
        const teks = node === tombol ? tombol.textContent : node.textContent;

        tombol.disabled = true;
        tombol.setAttribute("aria-busy", "true");
        tombol.classList.add("is-memproses");

        if (node === tombol) {
            tombol.classList.add("kl-memproses-langsung");
            tombol.textContent = "Memproses";
        } else {
            node.classList.add("kl-titik-memproses");
            node.textContent = "Memproses";
        }

        tombolTerkunci.push({ tombol, node, teks });
    };

    /* Kunci saat submit.
       PENTING: jangan mengunci di fase capture. Form AJAX (siswa,
       iuran, transaksi, pengguna, dll.) sudah punya handler sendiri
       yang memanggil kunciTombolSimpan(). Bila tombol dinonaktifkan
       lebih dulu di sini, kunciTombolSimpan() menganggap proses
       sedang berjalan lalu berhenti - request simpan tidak pernah
       dikirim sehingga pengguna hanya melihat "Memproses..." tanpa
       hasil. Karena itu penantian sebentar (setTimeout 0) dipakai
       agar handler halaman sempat mengambil alih tombol lebih dulu. */
    document.addEventListener("submit", (e) => {
        const form = e.target;

        if (!(form instanceof HTMLFormElement)) return;
        if (form.matches('form[action$="/logout"]')) return;
        if (form.dataset.klTanpaAntispam === "1") return;

        const tombol = e.submitter
            ? e.submitter
            : form.querySelector(
                'button[type="submit"], input[type="submit"], button:not([type])'
            );

        if (!tombol || !(tombol instanceof HTMLButtonElement || tombol instanceof HTMLInputElement)) return;

        setTimeout(() => {
            // Form AJAX memanggil preventDefault() dan sudah
            // menonaktifkan tombolnya sendiri (simpan-guard) -
            // biarkan handler halaman mengelola tombol tersebut.
            if (e.defaultPrevented || tombol.disabled) return;

            kunciTombol(tombol);

            /* Bila tidak ada fetch sama sekali setelah submit
               (validasi klien gagal, dsb.), buka tombol kembali. */
            if (timerCekFetch) clearTimeout(timerCekFetch);
            timerCekFetch = setTimeout(cobaBukaKunci, 400);
        }, 0);
    }, true);

})();
