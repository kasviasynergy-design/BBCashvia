/* ============================================================
   BBCASHVIA - VIEWER DATA SISWA
   Data siswa berasal dari API Laravel (database).
============================================================ */

// S3-07: modul bersama pengaman simpan ganda (anti-double-click
// + kunci idempotensi yang dibaca oleh guard backend).
import {
    kunciIdempoten,
    kunciTombolSimpan,
} from "./simpan-guard.js";

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       DATA SISWA
    ======================================================== */


    let siswa = [];


    /* ========================================================
       AKSES API
    ======================================================== */

    const API_URL = "/data/siswa";


    const permintaanAPI = async (url, opsi = {}) => {

        let respons;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            respons = await fetch(url, {
                ...opsi,
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    ...(opsi.headers || {})
                },
                credentials: "same-origin",
                signal: controller.signal
            });
        } catch (error) {
            clearTimeout(timeoutId);
            if (error?.name === "AbortError") throw new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi.");
            throw new Error("Tidak dapat terhubung ke server.");
        }
        clearTimeout(timeoutId);

        let hasil = {};
        try {
            hasil = await respons.json();
        } catch {
            // Respons bukan JSON.
        }

        if (!respons.ok) {
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");
            throw new Error(hasil?.message || "Gagal memuat data siswa.");
        }

        return hasil;
    };


    const petakanSiswa = (item) => ({
        nis: item.nis ?? "",
        nama: item.nama ?? "",
        kelas: item.kelas ?? "",
        gender: item.jenis_kelamin || "-",
        dibayar: Number(item.total_dibayar) || 0,
        status: item.status || "Aktif"
    });


    const formatRupiah = (nilai) =>
        new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0
            }
        ).format(Number(nilai) || 0);


    const muatData = async () => {

        const tbodyV = document.getElementById("studentTableBody");
        if (tbodyV) {
            tbodyV.innerHTML = Array.from({ length: 5 })
                .map(() => `<tr class="skeleton-row"><td colspan="5"><div class="skeleton skeleton-text--lg"></div></td></tr>`)
                .join("");
        }

        try {
            const hasil = await permintaanAPI(API_URL);

            const data =
                Array.isArray(hasil.data) ? hasil.data : [];

            siswa = data.map(petakanSiswa);

            isiRingkasan();

            filterData();
        } catch (error) {

            console.error(
                "Gagal memuat data siswa:",
                error
            );

            siswa = [];

            filterData();
        }
    };


    /* ========================================================
       ELEMENT
    ======================================================== */

    const tableBody =
        document.getElementById("studentTableBody");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const tableCount =
        document.getElementById("tableCount");

    const emptyState =
        document.getElementById("emptyState");

    const totalSiswa =
        document.getElementById("totalSiswa");

    const siswaAktif =
        document.getElementById("siswaAktif");

    const siswaTidakAktif =
        document.getElementById("siswaTidakAktif");

    const infoJumlahSiswa =
        document.getElementById("infoJumlahSiswa");


    /* ========================================================
       RINGKASAN (DARI DATA ASLI DATABASE)
    ======================================================== */

    function isiRingkasan() {

        const jumlah = siswa.length;

        const aktif = siswa.filter(
            (item) => item.status === "Aktif"
        ).length;

        if (totalSiswa) {
            totalSiswa.textContent = jumlah;
        }

        if (siswaAktif) {
            siswaAktif.textContent = aktif;
        }

        if (siswaTidakAktif) {
            siswaTidakAktif.textContent = jumlah - aktif;
        }

        if (infoJumlahSiswa) {
            infoJumlahSiswa.textContent = jumlah;
        }

    }


    /* ========================================================
       INISIAL
    ======================================================== */

    function inisial(nama) {

        return String(nama || "-")
            .split(" ")
            .slice(0, 2)
            .map((kata) => kata.charAt(0))
            .join("")
            .toUpperCase();

    }


    /* ========================================================
       RENDER TABLE
    ======================================================== */

    function renderTable(data) {

        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";


        if (data.length === 0) {

            emptyState?.classList.add("show");

            if (tableCount) {
                tableCount.textContent = "0";
            }

            return;
        }


        emptyState?.classList.remove("show");


        data.forEach((item, index) => {

            const row =
                document.createElement("tr");

            const statusClass =
                item.status === "Aktif"
                    ? "success"
                    : "danger";


            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    <span class="mono-text">
                        ${item.nis}
                    </span>
                </td>

                <td>
                    <div class="table-person">
                        <div class="table-avatar">
                            ${inisial(item.nama)}
                        </div>

                        <span>
                            ${item.nama}
                        </span>
                    </div>
                </td>

                <td>
                    ${item.gender}
                </td>

                <td>
                    <span class="mono-text">
                        ${formatRupiah(item.dibayar)}
                    </span>
                </td>

                <td>
                    <span class="status-pill ${statusClass}">
                        <span class="status-dot"></span>
                        ${item.status}
                    </span>
                </td>
            `;


            tableBody.appendChild(row);
        });


        if (tableCount) {
            tableCount.textContent = data.length;
        }
    }


    /* ========================================================
       FILTER
    ======================================================== */

    function filterData() {

        const keyword =
            searchInput?.value
                .trim()
                .toLowerCase() || "";

        const selectedStatus =
            statusFilter?.value || "all";


        const filtered =
            siswa.filter((item) => {

                const matchesSearch =
                    item.nama
                        .toLowerCase()
                        .includes(keyword) ||

                    item.nis
                        .toLowerCase()
                        .includes(keyword);


                const matchesStatus =
                    selectedStatus === "all" ||
                    item.status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );
            });


        renderTable(filtered);
    }


    searchInput?.addEventListener(
        "input",
        filterData
    );


    statusFilter?.addEventListener(
        "change",
        filterData
    );


    /* ========================================================
       TAMBAH SISWA (FORM)
    ======================================================== */

    const bacaCsrf = () =>
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") || "";


    const kirimData = async (url, dataForm) => {

        let respons;

        try {

            respons = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": bacaCsrf(),
                    // S3-07: pembawaan kunci idempotensi untuk
                    // pengaman simpan ganda di backend.
                    "X-Idempotency-Key": kunciIdempoten()
                },
                body: JSON.stringify(dataForm),
                credentials: "same-origin"
            });

        } catch {

            throw new Error(
                "Tidak dapat terhubung ke server."
            );

        }

        let hasil = {};

        try {

            hasil = await respons.json();

        } catch {
            /* Respons bukan JSON. */
        }

        if (!respons.ok) {

            const pesanGagal =
                hasil?.errors
                    ? Object.values(hasil.errors)
                        .flat()
                        .join(" ")
                    : "";

            throw new Error(
                pesanGagal
                || hasil?.message
                || "Gagal menyimpan data."
            );

        }

        return hasil;

    };


    const btnTambahSiswa =
        document.getElementById("btnTambahSiswa");

    const modalFormSiswa =
        document.getElementById("modalFormSiswa");

    const formSiswa =
        document.getElementById("formSiswa");

    const formErrorSiswa =
        document.getElementById("formErrorSiswa");


    const tampilkanPesanSiswa = (pesan, sukses = false) => {

        if (!formErrorSiswa) {
            return;
        }

        formErrorSiswa.textContent = pesan;

        formErrorSiswa.classList
            .toggle("success", sukses);

        formErrorSiswa.hidden = false;

    };


    const bersihkanPesanSiswa = () => {

        if (!formErrorSiswa) {
            return;
        }

        formErrorSiswa.hidden = true;

        formErrorSiswa.classList.remove("success");

    };


    const bukaModal = (modal) => {

        if (!modal) {
            return;
        }

        modal.hidden = false;

        requestAnimationFrame(() => {
            modal.classList.add("is-open");
        });

        document.body.classList.add("modal-open");

    };


    const tutupModal = (modal) => {

        if (!modal) {
            return;
        }

        modal.classList.remove("is-open");

        window.setTimeout(() => {
            modal.hidden = true;
        }, 180);

        window.setTimeout(() => {

            if (
                !document
                    .querySelector(".modal.is-open")
            ) {
                document.body.classList
                    .remove("modal-open");
            }

        }, 190);

    };


    btnTambahSiswa?.addEventListener(
        "click",
        () => {

            bukaModal(modalFormSiswa);

            bersihkanPesanSiswa();

            document
                .getElementById("inputNisSiswa")
                ?.focus();

        }
    );


    document
        .querySelectorAll("[data-close-modal]")
        .forEach((element) => {

            element.addEventListener(
                "click",
                () => {

                    tutupModal(
                        element.closest(".modal")
                    );

                }
            );

        });


    formSiswa?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const dataForm = {
                nis:
                    document
                        .getElementById("inputNisSiswa")
                        ?.value.trim() || "",
                nama:
                    document
                        .getElementById("inputNamaSiswa")
                        ?.value.trim() || "",
                jenis_kelamin:
                    document
                        .getElementById("inputJkSiswa")
                        ?.value || "",
                status:
                    document
                        .getElementById("inputStatusSiswa")
                        ?.value || "Aktif",
                no_hp:
                    document
                        .getElementById("inputHpSiswa")
                        ?.value.trim() || ""
            };


            bersihkanPesanSiswa();

            if (!dataForm.nis || !dataForm.nama) {

                tampilkanPesanSiswa(
                    "NIS dan nama siswa wajib diisi."
                );

                return;

            }


            const tombolSimpan =
                formSiswa.querySelector(
                    'button[type="submit"]'
                );

            // S3-07: kunci tombol saat proses (teks "Memproses...",
            // tidak dapat diklik dua kali). null = masih diproses,
            // boleh henti.
            const pemulihanTombol = kunciTombolSimpan(tombolSimpan);
            if (!pemulihanTombol) return;


            try {

                await kirimData(
                    "/viewer/api/siswa",
                    dataForm
                );

                tampilkanPesanSiswa(
                    `Siswa ${dataForm.nama} berhasil ditambahkan ke kelas.`,
                    true
                );

                formSiswa.reset();

                await muatData();

                window.setTimeout(() => {
                    tutupModal(modalFormSiswa);
                }, 1300);

            } catch (error) {

                tampilkanPesanSiswa(error.message);

            } finally {

                // S3-07: tombol pulih setelah proses berakhir.
                pemulihanTombol.pulihkan();

            }

        }
    );


    /* ========================================================
       INITIAL TABLE
    ======================================================== */

    muatData();


    /* ========================================================
       PROFILE DROPDOWN
    ======================================================== */

    const profileButton =
        document.getElementById("profileButton");

    const profileWrapper =
        document.querySelector(".profile-wrapper");

    profileButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            profileWrapper?.classList.toggle("open");
        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                profileWrapper &&
                !profileWrapper.contains(event.target)
            ) {
                profileWrapper.classList.remove("open");
            }
        }
    );


    /* ========================================================
       LOGOUT
    ======================================================== */

    function confirmLogout() {

        const confirmed =
            window.confirm(
                "Apakah kamu yakin ingin keluar dari akun Viewer?"
            );


        if (!confirmed) {
            return;
        }


        window.location.href = "/logout";
    }


    document
        .getElementById("logoutButton")
        ?.addEventListener(
            "click",
            confirmLogout
        );


    document
        .getElementById("dropdownLogout")
        ?.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                profileWrapper?.classList.remove("open");

                confirmLogout();
            }
        );


    /* ========================================================
       MOBILE SIDEBAR
    ======================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");

    const menuToggle =
        document.getElementById("menuToggle");


    function openSidebar() {

        sidebar?.classList.add("open");

        sidebarBackdrop?.classList.add("show");

        document.body.classList.add("nav-open");
    }


    function closeSidebar() {

        sidebar?.classList.remove("open");

        sidebarBackdrop?.classList.remove("show");

        document.body.classList.remove("nav-open");
    }


    menuToggle?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            const isOpen =
                sidebar?.classList.contains("open");


            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }
    );


    sidebarBackdrop?.addEventListener(
        "click",
        closeSidebar
    );


    /* ========================================================
       CLOSE SIDEBAR AFTER NAVIGATION
    ======================================================== */

    sidebar
        ?.querySelectorAll(".nav-link")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 900
                    ) {
                        closeSidebar();
                    }
                }
            );
        });


    /* ========================================================
       ESCAPE
    ======================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            document
                .querySelectorAll(".modal.is-open")
                .forEach((modal) => {
                    tutupModal(modal);
                });

            closeSidebar();

            profileWrapper?.classList.remove("open");
        }
    );


    /* ========================================================
       RESPONSIVE CLEANUP
    ======================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {
                closeSidebar();
            }
        }
    );

});
