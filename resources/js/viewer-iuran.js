/* ============================================================
   BBCASHVIA - VIEWER IURAN
   Data berasal dari database (endpoint /data/iuran).
   Tidak menggunakan data dummy.
============================================================ */

// S3-07: modul bersama pengaman simpan ganda (anti-double-click
// + kunci idempotensi yang dibaca oleh guard backend).
import {
    kunciIdempoten,
    kunciTombolSimpan,
} from "./simpan-guard.js";

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       ENDPOINT + STATE
    ======================================================== */

    const API_URL = "/data/iuran";

    let iuran = [];


    const ambilJSON = async (url) => {

        let respons;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {

            respons = await fetch(url, {

                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
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
            /* respons bukan JSON */
        }

        if (!respons.ok) {
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");
            throw new Error(hasil?.message || "Gagal mengambil data iuran.");
        }

        return hasil;

    };


    /* Pemetaan kategori database ke label periode yang ramah. */

    const LABEL_PERIODE = {
        "sekali bayar": "Sekali Bayar",
        "mingguan": "Mingguan",
        "bulanan": "Bulanan",
        "tahunan": "Tahunan"
    };


    const pilihPeriode = (kategori) =>
        LABEL_PERIODE[String(kategori || "").toLowerCase()]
        || "Lainnya";


    const formatTanggal = (nilai) => {

        if (!nilai) {
            return "-";
        }

        const date = new Date(nilai);

        if (Number.isNaN(date.getTime())) {
            return String(nilai);
        }

        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);

    };


    const escapeHtml = (value) =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");


    /* ========================================================
       ELEMENT
    ======================================================== */

    const tableBody =
        document.getElementById("iuranTableBody");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const periodFilter =
        document.getElementById("periodFilter");

    const tableCount =
        document.getElementById("tableCount");

    const emptyState =
        document.getElementById("emptyState");

    const totalIuran =
        document.getElementById("totalIuran");

    const sudahDibayar =
        document.getElementById("sudahDibayar");

    const belumDibayar =
        document.getElementById("belumDibayar");

    const totalTagihan =
        document.getElementById("totalTagihan");


    /* ========================================================
       FORMAT RUPIAH
    ======================================================== */

    function formatRupiah(value) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0
            }
        ).format(Number(value) || 0);
    }


    /* ========================================================
       UPDATE RINGKASAN
    ======================================================== */

    function updateSummary(data) {

        const total =
            data.length;

        const lunas =
            data.filter(
                (item) => item.status === "Lunas"
            ).length;

        const belumLunas =
            data.filter(
                (item) => item.status === "Belum Lunas"
            ).length;

        const tagihan =
            data.reduce(
                (sum, item) => sum + item.nominal,
                0
            );


        if (totalIuran) {
            totalIuran.textContent = total;
        }

        if (sudahDibayar) {
            sudahDibayar.textContent = lunas;
        }

        if (belumDibayar) {
            belumDibayar.textContent = belumLunas;
        }

        if (totalTagihan) {
            totalTagihan.textContent =
                formatRupiah(tagihan);
        }
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

            updateSummary(data);

            return;
        }


        emptyState?.classList.remove("show");


        data.forEach((item, index) => {

            const row =
                document.createElement("tr");


            const statusClass =
                item.status === "Lunas"
                    ? "lunas"
                    : "belum-lunas";


            row.innerHTML = `
                <td>
                    ${index + 1}
                </td>

                <td>
                    <span class="iuran-name">
                        ${escapeHtml(item.nama)}
                    </span>
                </td>

                <td>
                    <span class="iuran-period">
                        ${escapeHtml(item.periode)}
                    </span>
                </td>

                <td>
                    <span class="iuran-nominal">
                        ${formatRupiah(item.nominal)}
                    </span>
                </td>

                <td>
                    <span class="iuran-deadline">
                        ${escapeHtml(item.jatuhTempo)}
                    </span>
                </td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${escapeHtml(item.status)}
                    </span>
                </td>
            `;


            tableBody.appendChild(row);
        });


        if (tableCount) {
            tableCount.textContent =
                data.length;
        }


        updateSummary(data);
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


        const selectedPeriod =
            periodFilter?.value || "all";


        const filtered =
            iuran.filter((item) => {

                const matchesSearch =
                    item.nama
                        .toLowerCase()
                        .includes(keyword) ||

                    item.periode
                        .toLowerCase()
                        .includes(keyword);


                const matchesStatus =
                    selectedStatus === "all" ||
                    item.status === selectedStatus;


                const matchesPeriod =
                    selectedPeriod === "all" ||
                    item.periode === selectedPeriod;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPeriod
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


    periodFilter?.addEventListener(
        "change",
        filterData
    );


    /* ========================================================
       TAMBAH IURAN (FORM)
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


    const btnTambahIuran =
        document.getElementById("btnTambahIuran");

    const modalFormIuran =
        document.getElementById("modalFormIuran");

    const formIuran =
        document.getElementById("formIuran");

    const formErrorIuran =
        document.getElementById("formErrorIuran");


    const tampilkanPesanIuran = (pesan, sukses = false) => {

        if (!formErrorIuran) {
            return;
        }

        formErrorIuran.textContent = pesan;

        formErrorIuran.classList
            .toggle("success", sukses);

        formErrorIuran.hidden = false;

    };


    const bersihkanPesanIuran = () => {

        if (!formErrorIuran) {
            return;
        }

        formErrorIuran.hidden = true;

        formErrorIuran.classList.remove("success");

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


    btnTambahIuran?.addEventListener(
        "click",
        () => {

            bukaModal(modalFormIuran);

            bersihkanPesanIuran();

            document
                .getElementById("inputNamaIuran")
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


    formIuran?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const dataForm = {
                nama_iuran:
                    document
                        .getElementById("inputNamaIuran")
                        ?.value.trim() || "",
                kategori:
                    document
                        .getElementById("inputKategoriIuran")
                        ?.value || "sekali bayar",
                jatuh_tempo:
                    document
                        .getElementById("inputJatuhTempo")
                        ?.value || "",
                nominal:
                    Number(
                        document
                            .getElementById("inputNominalIuran")
                            ?.value
                    ) || 0,
                status:
                    document
                        .getElementById("inputStatusIuran")
                        ?.value || "aktif",
                keterangan:
                    document
                        .getElementById("inputKeteranganIuran")
                        ?.value.trim() || ""
            };


            bersihkanPesanIuran();

            if (
                !dataForm.nama_iuran ||
                dataForm.nominal <= 0
            ) {

                tampilkanPesanIuran(
                    "Nama iuran wajib diisi dan nominal harus lebih dari 0."
                );

                return;

            }


            const tombolSimpan =
                formIuran.querySelector(
                    'button[type="submit"]'
                );

            // S3-07: kunci tombol saat proses (teks "Memproses...",
            // tidak dapat diklik dua kali). null = masih diproses,
            // boleh henti.
            const pemulihanTombol = kunciTombolSimpan(tombolSimpan);
            if (!pemulihanTombol) return;


            try {

                await kirimData(
                    "/viewer/api/iuran",
                    dataForm
                );

                tampilkanPesanIuran(
                    `Iuran ${dataForm.nama_iuran} berhasil ditambahkan.`,
                    true
                );

                formIuran.reset();

                await muatData();

                window.setTimeout(() => {
                    tutupModal(modalFormIuran);
                }, 1300);

            } catch (error) {

                tampilkanPesanIuran(error.message);

            } finally {

                // S3-07: tombol pulih setelah proses berakhir.
                pemulihanTombol.pulihkan();

            }

        }
    );


    /* ========================================================
       MUAT DATA DARI DATABASE
    ======================================================== */

    const muatData = async () => {

        const tbodyV = document.getElementById("iuranTableBody");
        if (tbodyV) {
            tbodyV.innerHTML = Array.from({ length: 5 })
                .map(() => `<tr class="skeleton-row"><td colspan="6"><div class="skeleton skeleton-text--lg"></div></td></tr>`)
                .join("");
        }

        try {

            const hasil = await ambilJSON(API_URL);

            const baris =
                Array.isArray(hasil?.data) ? hasil.data : [];


            iuran = baris.map((item) => {

                const target = Number(item.target) || 0;
                const terkumpul = Number(item.terkumpul) || 0;


                return {
                    nama: item.nama_iuran ?? "-",
                    periode: pilihPeriode(item.kategori),
                    nominal: Number(item.nominal) || 0,
                    jatuhTempo: formatTanggal(item.jatuh_tempo),
                    // Status kelas dihitung dari pembayaran yang sudah
                    // terkumpul, bukan dari status master iuran.
                    status: target > 0 && terkumpul + 0.009 >= target
                        ? "Lunas"
                        : "Belum Lunas"
                };

            });

        } catch (err) {

            console.error(err);

            iuran = [];

        }


        filterData();

    };


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
