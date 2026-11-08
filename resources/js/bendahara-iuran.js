// BBCASHVIA - modul bersama S3-07 (pengaman simpan ganda).
import {
    kunciIdempoten,
    kunciTombolSimpan,
} from "./simpan-guard.js";

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /*
    |--------------------------------------------------------------------------
    | ENDPOINT + STATE
    |--------------------------------------------------------------------------
    | Seluruh data berasal dari database melalui endpoint /bendahara/api/*.
    | Tidak ada data dummy.
    |--------------------------------------------------------------------------
    */

    const API_IURAN = "/bendahara/api/iuran";
    const API_SISWA = "/bendahara/api/siswa";
    const API_TRANSAKSI = "/bendahara/api/transaksi";

    let SISWA = [];

    let iuranData = [];

    let transaksiData = [];

    let csrfToken = "";

    const bacaCsrf = () => {
        const meta =
            document.querySelector('meta[name="csrf-token"]');

        return meta ? meta.getAttribute("content") : "";
    };

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
            /* bukan JSON */
        }

        if (!respons.ok) {
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");
            throw new Error(hasil?.message || "Gagal mengambil data dari server.");
        }

        return hasil;
    };

    const kirimJSON = async (url, method, payload) => {
        let respons;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            respons = await fetch(url, {
                method,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrfToken,
                    // S3-07: POST dibawa kunci idempotensi untuk
                    // pengaman simpan ganda di backend.
                    ...(String(method).toUpperCase() === "POST"
                        ? { "X-Idempotency-Key": kunciIdempoten() }
                        : {}),
                },
                credentials: "same-origin",
                body: JSON.stringify(payload),
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
            /* bukan JSON */
        }

        if (!respons.ok) {
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");

            if (hasil?.errors) {
                const pesan = Object.values(hasil.errors)
                    .flat()
                    .filter(Boolean);

                if (pesan.length) {
                    throw new Error(pesan.join(" "));
                }
            }

            throw new Error(
                hasil?.message || "Terjadi kesalahan saat menyimpan."
            );
        }

        return hasil;
    };


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    let editingIuranId = null;
    let selectedIuranId = null;
    let toastTimer = null;


    /*
    |--------------------------------------------------------------------------
    | ELEMENTS
    |--------------------------------------------------------------------------
    */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const sidebarLogout =
        document.getElementById("sidebarLogout");

    const dropdownLogout =
        document.getElementById("dropdownLogout");

    const currentDate =
        document.getElementById("currentDate");


    /*
    |--------------------------------------------------------------------------
    | IURAN ELEMENTS
    |--------------------------------------------------------------------------
    */

    const btnTambahIuran =
        document.getElementById("btnTambahIuran");

    const cariIuran =
        document.getElementById("cariIuran");

    const filterKategori =
        document.getElementById("filterKategori");

    const filterStatusIuran =
        document.getElementById("filterStatusIuran");

    const btnResetFilter =
        document.getElementById("btnResetFilter");

    const isiTabelIuran =
        document.getElementById("isiTabelIuran");

    const emptyState =
        document.getElementById("emptyState");

    const jumlahIuranFoot =
        document.getElementById("jumlahIuranFoot");


    /*
    |--------------------------------------------------------------------------
    | SUMMARY ELEMENTS
    |--------------------------------------------------------------------------
    */

    const sumTotalIuran =
        document.getElementById("sumTotalIuran");

    const sumTagihan =
        document.getElementById("sumTagihan");

    const sumTerkumpul =
        document.getElementById("sumTerkumpul");


    /*
    |--------------------------------------------------------------------------
    | MODAL IURAN
    |--------------------------------------------------------------------------
    */

    const modalIuran =
        document.getElementById("modalIuran");

    const modalIuranTitle =
        document.getElementById("modalIuranTitle");

    const modalIuranSub =
        document.getElementById("modalIuranSub");

    const formIuran =
        document.getElementById("formIuran");

    const inputNamaIuran =
        document.getElementById("inputNamaIuran");

    const inputKategori =
        document.getElementById("inputKategori");

    const inputJatuhTempo =
        document.getElementById("inputJatuhTempo");

    const inputNominalIuran =
        document.getElementById("inputNominalIuran");

    const inputStatusIuran =
        document.getElementById("inputStatusIuran");

    const inputKeteranganIuran =
        document.getElementById("inputKeteranganIuran");

    const formErrorIuran =
        document.getElementById("formErrorIuran");


    /*
    |--------------------------------------------------------------------------
    | MODAL DETAIL
    |--------------------------------------------------------------------------
    */

    const modalDetailIuran =
        document.getElementById("modalDetailIuran");

    const detailIuranTitle =
        document.getElementById("detailIuranTitle");

    const detailIuranSub =
        document.getElementById("detailIuranSub");

    const detailKategori =
        document.getElementById("detailKategori");

    const detailJatuhTempo =
        document.getElementById("detailJatuhTempo");

    const detailNominal =
        document.getElementById("detailNominal");

    const detailTerkumpul =
        document.getElementById("detailTerkumpul");

    const cariDetailSiswa =
        document.getElementById("cariDetailSiswa");

    const filterDetailStatus =
        document.getElementById("filterDetailStatus");

    const isiTabelDetail =
        document.getElementById("isiTabelDetail");

    const emptyDetail =
        document.getElementById("emptyDetail");


    /*
    |--------------------------------------------------------------------------
    | TOAST
    |--------------------------------------------------------------------------
    */

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    const toastIcon =
        document.getElementById("toastIcon");

    const toastClose =
        document.getElementById("toastClose");


    /*
    |--------------------------------------------------------------------------
    | HELPER
    |--------------------------------------------------------------------------
    */

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(value) || 0);
    }


    function formatTanggal(value) {
        if (!value) {
            return "-";
        }

        const date =
            new Date(`${value}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    }


    function formatTanggalLengkap(date) {
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getKategoriLabel(value) {
        const labels = {
            harian: "Harian",
            mingguan: "Mingguan",
            bulanan: "Bulanan",
            tahunan: "Tahunan",
            insidental: "Insidental",
            "sekali bayar": "Sekali Bayar"
        };

        return labels[value] || value;
    }


    function getJumlahLunas(iuran) {
        return transaksiData.filter((t) => {
            const arah = String(t.jenis || "").toUpperCase();

            return (
                arah === "PEMASUKAN" &&
                String(t.id_iuran) === String(iuran.id_iuran)
            );
        }).length;
    }


    function getTotalSiswa() {
        if (SISWA.length) {
            return SISWA.length;
        }

        return 0;
    }


    function getTotalTagihan(iuran) {
        return (
            Number(iuran.nominal) *
            getTotalSiswa()
        );
    }


    function getTotalTerkumpul(iuran) {
        return transaksiData
            .filter((t) => {
                const arah = String(t.jenis || "").toUpperCase();

                return (
                    arah === "PEMASUKAN" &&
                    String(t.id_iuran) === String(iuran.id_iuran)
                );
            })
            .reduce(
                (total, t) => total + (Number(t.nominal) || 0),
                0
            );
    }


    function getPersentase(iuran) {
        const total =
            getTotalSiswa();

        if (!total) {
            return 0;
        }

        return Math.round(
            (getJumlahLunas(iuran) / total) *
            100
        );
    }


    function getIuranById(id) {
        return iuranData.find(
            (iuran) =>
                String(iuran.id_iuran) === String(id)
        );
    }


    function siswaLunas(iuran, siswa) {
        // Lunas bila akumulasi pembayaran pemasukan (cicilan) sudah
        // mencapai nominal iuran.
        const terbayar = hitungDibayarPasangan(
            siswa.id_siswa,
            iuran.id_iuran
        );

        const tagihan = Number(iuran.nominal) || 0;

        return (
            tagihan > 0 &&
            terbayar >= tagihan
        );
    }


    const petakanSiswa = (s) => ({
        id_siswa: s.id_siswa,
        nama: s.nama ?? "-",
        nisn: s.nis ?? "-",
        kelas: s.kelas || "-"
    });


    const petakanIuran = (i) => ({
        id_iuran: i.id_iuran,
        nama: i.nama_iuran ?? "-",
        /* Kategori ditampilkan apa adanya dari database - bukan
           dikonversi paksa ke nilai default (kategori hoax tiap hover). */
        kategori: String(i.kategori ?? "").toLowerCase(),
        jatuhTempo: i.jatuh_tempo ? String(i.jatuh_tempo).slice(0, 10) : "",
        nominal: Number(i.nominal) || 0,
        status: String(i.status || "aktif").toLowerCase(),
        keterangan: i.keterangan || ""
    });


    function getInitials(nama) {
        return String(nama)
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                (word) =>
                    word.charAt(0)
            )
            .join("")
            .toUpperCase();
    }


    /*
    |--------------------------------------------------------------------------
    | TOPBAR DATE
    |--------------------------------------------------------------------------
    */

    function updateCurrentDate() {
        if (!currentDate) {
            return;
        }

        currentDate.textContent =
            formatTanggalLengkap(
                new Date()
            );
    }

    updateCurrentDate();


    /*
    |--------------------------------------------------------------------------
    | SIDEBAR
    |--------------------------------------------------------------------------
    */

    function openSidebar() {
        document.body.classList.add(
            "nav-open"
        );

        if (sidebarToggle) {
            sidebarToggle.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }


    function closeSidebar() {
        document.body.classList.remove(
            "nav-open"
        );

        if (sidebarToggle) {
            sidebarToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    if (sidebarToggle) {
        sidebarToggle.addEventListener(
            "click",
            () => {
                const isOpen =
                    document.body.classList.contains(
                        "nav-open"
                    );

                if (isOpen) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            }
        );
    }


    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener(
            "click",
            closeSidebar
        );
    }


    document
        .querySelectorAll(".side-link")
        .forEach((link) => {
            link.addEventListener(
                "click",
                () => {
                    closeSidebar();
                }
            );
        });


    /*
    |--------------------------------------------------------------------------
    | PROFILE DROPDOWN
    |--------------------------------------------------------------------------
    */

    function closeProfileDropdown() {
        if (!profileDropdown) {
            return;
        }

        profileDropdown.classList.remove(
            "is-open"
        );

        if (profileButton) {
            profileButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    function toggleProfileDropdown() {
        if (!profileDropdown) {
            return;
        }

        const isOpen =
            profileDropdown.classList.contains(
                "is-open"
            );

        if (isOpen) {
            closeProfileDropdown();
            return;
        }

        profileDropdown.classList.add(
            "is-open"
        );

        if (profileButton) {
            profileButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }


    if (profileButton) {
        profileButton.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();
                toggleProfileDropdown();
            }
        );
    }


    document.addEventListener(
        "click",
        (event) => {
            if (
                profileDropdown &&
                profileButton &&
                !profileDropdown.contains(
                    event.target
                ) &&
                !profileButton.contains(
                    event.target
                )
            ) {
                closeProfileDropdown();
            }
        }
    );


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    function handleLogout() {
        closeProfileDropdown();
        closeSidebar();

        showToast(
            "Keluar",
            "Anda akan diarahkan ke halaman login.",
            "logout"
        );

        setTimeout(() => {
            window.location.href = "/logout";
        }, 900);
    }


    if (sidebarLogout) {
        sidebarLogout.addEventListener(
            "click",
            handleLogout
        );
    }


    if (dropdownLogout) {
        dropdownLogout.addEventListener(
            "click",
            handleLogout
        );
    }


    /*
    |--------------------------------------------------------------------------
    | MODAL
    |--------------------------------------------------------------------------
    */

    function openModal(modal) {
        if (!modal) {
            return;
        }

        modal.hidden = false;

        requestAnimationFrame(() => {
            modal.classList.add(
                "is-open"
            );
        });

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove(
            "is-open"
        );

        setTimeout(() => {
            modal.hidden = true;
        }, 180);

        setTimeout(() => {
            const activeModal =
                document.querySelector(
                    ".modal.is-open"
                );

            if (!activeModal) {
                document.body.classList.remove(
                    "modal-open"
                );
            }
        }, 190);
    }


    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach((element) => {
            element.addEventListener(
                "click",
                () => {
                    const modal =
                        element.closest(
                            ".modal"
                        );

                    closeModal(modal);
                }
            );
        });


    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key !== "Escape") {
                return;
            }

            document
                .querySelectorAll(
                    ".modal.is-open"
                )
                .forEach((modal) => {
                    closeModal(modal);
                });

            closeProfileDropdown();
            closeSidebar();
        }
    );


    /*
    |--------------------------------------------------------------------------
    | SUMMARY
    |--------------------------------------------------------------------------
    */

    function renderSummary() {
        const activeIuran =
            iuranData.filter(
                (iuran) =>
                    iuran.status === "aktif"
            );

        const totalTagihan =
            activeIuran.reduce(
                (total, iuran) =>
                    total +
                    getTotalTagihan(iuran),
                0
            );

        const totalTerkumpul =
            activeIuran.reduce(
                (total, iuran) =>
                    total +
                    getTotalTerkumpul(iuran),
                0
            );

        if (sumTotalIuran) {
            sumTotalIuran.textContent =
                activeIuran.length;
        }

        if (sumTagihan) {
            sumTagihan.textContent =
                formatRupiah(
                    totalTagihan
                );
        }

        if (sumTerkumpul) {
            sumTerkumpul.textContent =
                formatRupiah(
                    totalTerkumpul
                );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | DATA IURAN
    |--------------------------------------------------------------------------
    */

    function getFilteredIuran() {

        const keyword =
            cariIuran
                ? cariIuran.value
                    .trim()
                    .toLowerCase()
                : "";

        const filterKategoriVal =
            filterKategori
                ? filterKategori.value
                    .trim()
                    .toLowerCase()
                : "semua";

        const status =
            filterStatusIuran
                ? filterStatusIuran.value
                    .trim()
                    .toLowerCase()
                : "semua";


        return iuranData.filter(
            (iuran) => {

                const nama =
                    String(
                        iuran.nama || ""
                    ).toLowerCase();

                const keterangan =
                    String(
                        iuran.keterangan || ""
                    ).toLowerCase();

                const dataKategori =
                    String(
                        iuran.kategori || ""
                    ).toLowerCase();

                const dataStatus =
                    String(
                        iuran.status || ""
                    ).toLowerCase();


                const matchesKeyword =
                    !keyword ||
                    nama.includes(keyword) ||
                    keterangan.includes(keyword);


                const matchesKategori =
                    filterKategoriVal === "semua" ||
                    filterKategoriVal === "" ||
                    dataKategori === filterKategoriVal;


                const matchesStatus =
                    status === "semua" ||
                    status === "" ||
                    dataStatus === status;


                return (
                    matchesKeyword &&
                    matchesKategori &&
                    matchesStatus
                );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | RENDER DAFTAR IURAN
    |--------------------------------------------------------------------------
    */

    function renderIuran() {

        if (!isiTabelIuran) {
            return;
        }

        const data =
            getFilteredIuran();

        isiTabelIuran.innerHTML = "";


        /*
        |--------------------------------------------------------------------------
        | EMPTY STATE
        |--------------------------------------------------------------------------
        */

        if (emptyState) {

            if (data.length > 0) {
                emptyState.hidden = true;
                emptyState.classList.remove("show");
            } else {
                emptyState.hidden = false;
                emptyState.classList.add("show");
            }
        }


        if (jumlahIuranFoot) {
            jumlahIuranFoot.textContent =
                `${data.length} iuran`;
        }


        /*
        |--------------------------------------------------------------------------
        | DATA KOSONG
        |--------------------------------------------------------------------------
        */

        if (!data.length) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | RENDER DATA
        |--------------------------------------------------------------------------
        */

        data.forEach(
            (iuran) => {

                const jumlahLunas =
                    getJumlahLunas(
                        iuran
                    );

                const totalSiswa =
                    getTotalSiswa();

                const terkumpul =
                    getTotalTerkumpul(
                        iuran
                    );

                const persentase =
                    getPersentase(
                        iuran
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td>
                        <div class="table-primary">
                            ${escapeHTML(
                                iuran.nama
                            )}
                        </div>

                        <div class="table-secondary">
                            ${escapeHTML(
                                iuran.keterangan ||
                                "Tidak ada keterangan"
                            )}
                        </div>
                    </td>

                    <td>
                        <span class="frequency-badge">
                            ${escapeHTML(
                                getKategoriLabel(
                                    iuran.kategori
                                )
                            )}
                        </span>
                    </td>

                    <td>
                        ${formatTanggal(
                            iuran.jatuhTempo
                        )}
                    </td>

                    <td>
                        <strong>
                            ${formatRupiah(
                                iuran.nominal
                            )}
                        </strong>
                    </td>

                    <td>
                        ${formatRupiah(
                            terkumpul
                        )}
                    </td>

                    <td>
                        <div class="progress-cell">

                            <div class="progress-top">

                                <span>
                                    ${jumlahLunas}/${totalSiswa} siswa
                                </span>

                                <strong>
                                    ${persentase}%
                                </strong>

                            </div>

                            <div class="progress-bar">
                                <span
                                    style="width:${persentase}%"
                                ></span>
                            </div>

                        </div>
                    </td>

                    <td>
                        <span
                            class="status-badge status-badge--${
                                iuran.status === "aktif"
                                    ? "aktif"
                                    : "selesai"
                            }"
                        >
                            <span class="status-dot"></span>

                            ${
                                iuran.status ===
                                "aktif"
                                    ? "Aktif"
                                    : "Selesai"
                            }
                        </span>
                    </td>

                    <td class="text-right">

                        <div class="action-group">

                            <button
                                type="button"
                                class="icon-btn"
                                title="Detail"
                                data-action="detail"
                                data-id="${iuran.id_iuran}"
                            >
                                <span class="material-symbols-outlined">
                                    visibility
                                </span>
                            </button>

                            <button
                                type="button"
                                class="icon-btn"
                                title="Edit"
                                data-action="edit"
                                data-id="${iuran.id_iuran}"
                            >
                                <span class="material-symbols-outlined">
                                    edit
                                </span>
                            </button>

                            <button
                                type="button"
                                class="icon-btn icon-btn--danger"
                                title="Hapus"
                                data-action="delete"
                                data-id="${iuran.id_iuran}"
                            >
                                <span class="material-symbols-outlined">
                                    delete
                                </span>
                            </button>

                        </div>

                    </td>
                `;


                isiTabelIuran.appendChild(
                    row
                );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | TAMBAHAN - SINKRONISASI EMPTY STATE
    |--------------------------------------------------------------------------
    */

    function syncIuranEmptyState() {

        if (!emptyState) {
            return;
        }

        const data =
            getFilteredIuran();

        if (data.length > 0) {

            emptyState.hidden = true;
            emptyState.style.display = "";
            emptyState.classList.remove(
                "show"
            );

        } else {

            emptyState.hidden = false;
            emptyState.style.display = "";
            emptyState.classList.add(
                "show"
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | TAMBAH IURAN
    |--------------------------------------------------------------------------
    */

    function resetFormIuran() {

        if (!formIuran) {
            return;
        }

        formIuran.reset();

        if (inputKategori) {
            inputKategori.value =
                "mingguan";
        }

        if (inputStatusIuran) {
            inputStatusIuran.value =
                "aktif";
        }

        if (formErrorIuran) {
            formErrorIuran.hidden = true;
            formErrorIuran.textContent =
                "";
        }

        editingIuranId = null;
    }


    function openAddIuran() {

        resetFormIuran();

        if (modalIuranTitle) {
            modalIuranTitle.textContent =
                "Tambah Iuran";
        }

        if (modalIuranSub) {
            modalIuranSub.textContent =
                "Tambahkan iuran baru untuk kelas ini.";
        }

        openModal(
            modalIuran
        );

        setTimeout(() => {

            if (inputNamaIuran) {
                inputNamaIuran.focus();
            }

        }, 200);
    }


    if (btnTambahIuran) {
        btnTambahIuran.addEventListener(
            "click",
            openAddIuran
        );
    }


    /*
    |--------------------------------------------------------------------------
    | EDIT IURAN
    |--------------------------------------------------------------------------
    */

    function openEditIuran(id) {

        const iuran =
            getIuranById(id);

        if (!iuran) {
            return;
        }

        editingIuranId =
            iuran.id_iuran;


        if (modalIuranTitle) {
            modalIuranTitle.textContent =
                "Edit Iuran";
        }

        if (modalIuranSub) {
            modalIuranSub.textContent =
                "Perbarui data iuran kelas ini.";
        }


        if (inputNamaIuran) {
            inputNamaIuran.value =
                iuran.nama;
        }

        if (inputKategori) {
            inputKategori.value =
                iuran.kategori;
        }

        if (inputJatuhTempo) {
            inputJatuhTempo.value =
                iuran.jatuhTempo;
        }

        if (inputNominalIuran) {
            inputNominalIuran.value =
                iuran.nominal;
        }

        if (inputStatusIuran) {
            inputStatusIuran.value =
                iuran.status;
        }

        if (inputKeteranganIuran) {
            inputKeteranganIuran.value =
                iuran.keterangan || "";
        }

        if (formErrorIuran) {
            formErrorIuran.hidden = true;
            formErrorIuran.textContent =
                "";
        }

        openModal(
            modalIuran
        );
    }


    /*
    |--------------------------------------------------------------------------
    | PERHITUNGAN PEMBAYARAN
    |--------------------------------------------------------------------------
    */

    // Total pembayaran pemasukan yang sudah tercatat untuk
    // pasangan (siswa, iuran) tertentu dari data transaksi asli.
    const hitungDibayarPasangan = (idSiswa, idIuran) =>
        transaksiData
            .filter((t) => {
                const arah = String(t.jenis || "").toUpperCase();

                return (
                    (arah === "PEMASUKAN" || arah === "M") &&
                    String(t.id_siswa ?? "") === String(idSiswa) &&
                    String(t.id_iuran ?? "") === String(idIuran)
                );
            })
            .reduce(
                (total, t) => total + (Number(t.nominal) || 0),
                0
            );

    /*
    |--------------------------------------------------------------------------
    | SIMPAN IURAN
    |--------------------------------------------------------------------------
    */

    if (formIuran) {

        formIuran.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                // S3-07: kunci tombol simpan saat proses (teks
                // "Memproses...", tidak dapat diklik dua kali via klik
                // maupun Enter). null = masih diproses, boleh henti.
                const tombolSimpan = formIuran.querySelector(
                    'button[type="submit"]'
                );

                const pemulihanTombol = kunciTombolSimpan(tombolSimpan);

                if (!pemulihanTombol) return;

                try {

                const nama =
                    inputNamaIuran
                        ? inputNamaIuran.value.trim()
                        : "";


                const nominal =
                    inputNominalIuran
                        ? Number(
                            inputNominalIuran.value
                        )
                        : 0;


                const jatuhTempo =
                    inputJatuhTempo
                        ? inputJatuhTempo.value
                        : "";


                if (!nama) {

                    showFormError(
                        formErrorIuran,
                        "Nama iuran wajib diisi."
                    );

                    return;
                }


                if (!nominal || nominal <= 0) {

                    showFormError(
                        formErrorIuran,
                        "Nominal iuran harus lebih dari Rp0."
                    );

                    return;
                }


                if (!jatuhTempo) {

                    showFormError(
                        formErrorIuran,
                        "Jatuh tempo wajib diisi."
                    );

                    return;
                }


                const payload = {
                    nama_iuran: nama,
                    kategori:
                        inputKategori
                            ? inputKategori.value
                            : "sekali bayar",
                    jatuh_tempo: jatuhTempo,
                    nominal: nominal,
                    status:
                        inputStatusIuran
                            ? inputStatusIuran.value
                            : "aktif",
                    keterangan:
                        inputKeteranganIuran
                            ? inputKeteranganIuran.value.trim()
                            : ""
                };


                try {

                    if (editingIuranId) {

                        await kirimJSON(
                            `${API_IURAN}/${editingIuranId}`,
                            "PUT",
                            payload
                        );

                        closeModal(modalIuran);

                        await muatData();

                        showToast(
                            "Iuran diperbarui",
                            "Data iuran berhasil diperbarui.",
                            "check"
                        );

                    } else {

                        await kirimJSON(
                            API_IURAN,
                            "POST",
                            payload
                        );

                        closeModal(modalIuran);

                        await muatData();

                        showToast(
                            "Iuran ditambahkan",
                            "Iuran baru berhasil ditambahkan.",
                            "check"
                        );
                    }

                } catch (err) {

                    showFormError(
                        formErrorIuran,
                        err.message
                    );
                }
                } finally {
                    // S3-07: tombol pulih setelah proses apa pun
                    // berakhir (sukses, gagal validasi, galat server).
                    pemulihanTombol.pulihkan();
                }
            }
        );
    }


    function showFormError(
        element,
        message
    ) {

        if (!element) {
            return;
        }

        element.textContent =
            message;

        element.hidden = false;
    }


    /*
    |--------------------------------------------------------------------------
    | DETAIL IURAN
    |--------------------------------------------------------------------------
    */

    function openDetailIuran(id) {

        const iuran =
            getIuranById(id);

        if (!iuran) {
            return;
        }


        selectedIuranId =
            iuran.id_iuran;


        if (detailIuranTitle) {
            detailIuranTitle.textContent =
                iuran.nama;
        }


        if (detailIuranSub) {
            detailIuranSub.textContent =
                iuran.keterangan ||
                "Detail status pembayaran siswa kelas ini.";
        }


        if (detailKategori) {
            detailKategori.textContent =
                getKategoriLabel(
                    iuran.kategori
                );
        }


        if (detailJatuhTempo) {
            detailJatuhTempo.textContent =
                formatTanggal(
                    iuran.jatuhTempo
                );
        }


        if (detailNominal) {
            detailNominal.textContent =
                formatRupiah(
                    iuran.nominal
                );
        }


        if (detailTerkumpul) {
            detailTerkumpul.textContent =
                formatRupiah(
                    getTotalTerkumpul(
                        iuran
                    )
                );
        }


        if (cariDetailSiswa) {
            cariDetailSiswa.value =
                "";
        }


        if (filterDetailStatus) {
            filterDetailStatus.value =
                "semua";
        }


        renderDetailSiswa();

        openModal(
            modalDetailIuran
        );
    }


    /*
    |--------------------------------------------------------------------------
    | DETAIL SISWA
    |--------------------------------------------------------------------------
    */

    function renderDetailSiswa() {

        if (!isiTabelDetail) {
            return;
        }

        const iuran =
            getIuranById(
                selectedIuranId
            );

        if (!iuran) {
            return;
        }


        const keyword =
            cariDetailSiswa
                ? cariDetailSiswa.value
                    .trim()
                    .toLowerCase()
                : "";


        const status =
            filterDetailStatus
                ? filterDetailStatus.value
                : "semua";


        const data =
            SISWA.filter(
                (siswa) => {

                    const lunas =
                        siswaLunas(iuran, siswa);


                    const matchesKeyword =
                        !keyword ||
                        String(siswa.nama)
                            .toLowerCase()
                            .includes(
                                keyword
                            ) ||
                        String(siswa.nisn)
                            .toLowerCase()
                            .includes(
                                keyword
                            );


                    const matchesStatus =
                        status ===
                            "semua" ||
                        status === "" ||
                        (
                            status ===
                                "lunas" &&
                            lunas
                        ) ||
                        (
                            status ===
                                "belum" &&
                            !lunas
                        );


                    return (
                        matchesKeyword &&
                        matchesStatus
                    );
                }
            );


        isiTabelDetail.innerHTML =
            "";


        if (emptyDetail) {
            emptyDetail.hidden =
                data.length > 0;
        }


        if (!data.length) {
            return;
        }


        data.forEach(
            (siswa, index) => {

                const lunas =
                    siswaLunas(iuran, siswa);


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <div class="student-cell">

                            <div class="student-cell__avatar">
                                ${escapeHTML(
                                    getInitials(
                                        siswa.nama
                                    )
                                )}
                            </div>

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        siswa.nama
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(siswa.kelas || "Siswa")}
                                </span>

                            </div>

                        </div>
                    </td>

                    <td>
                        <span class="mono">
                            ${escapeHTML(
                                siswa.nisn
                            )}
                        </span>
                    </td>

                    <td>
                        ${escapeHTML(
                            siswa.kelas
                        )}
                    </td>

                    <td>
                        ${formatRupiah(
                            iuran.nominal
                        )}
                    </td>

                    <td>

                        <span class="status-badge ${
                            lunas
                                ? "status-badge--lunas"
                                : "status-badge--belum"
                        }">

                            <span class="status-dot"></span>

                            ${
                                lunas
                                    ? "Lunas"
                                    : "Belum Lunas"
                            }

                        </span>

                    </td>

                `;


                isiTabelDetail.appendChild(
                    row
                );
            }
        );
    }


    if (cariDetailSiswa) {
        cariDetailSiswa.addEventListener(
            "input",
            renderDetailSiswa
        );
    }


    if (filterDetailStatus) {
        filterDetailStatus.addEventListener(
            "change",
            renderDetailSiswa
        );
    }


    /*
    |--------------------------------------------------------------------------
    | TABLE ACTIONS
    |--------------------------------------------------------------------------
    */

    if (isiTabelIuran) {

        isiTabelIuran.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;


                const id =
                    Number(
                        button.dataset.id
                    );


                if (action === "detail") {
                    openDetailIuran(
                        id
                    );
                }


                if (action === "edit") {
                    openEditIuran(
                        id
                    );
                }


                if (action === "delete") {
                    openDeleteIuran(
                        id
                    );
                }
            }
        );
    }

    /*
    |--------------------------------------------------------------------------
    | HAPUS IURAN (disamakan dengan halaman Admin)
    |--------------------------------------------------------------------------
    */

    let deletingIuranId = null;

    function openDeleteIuran(id) {

        const iuran =
            getIuranById(id);

        if (!iuran) {
            return;
        }

        const modalHapusIuran =
            document.getElementById(
                "modalHapusIuran"
            );

        if (!modalHapusIuran) {
            return;
        }

        deletingIuranId =
            iuran.id_iuran;

        document.getElementById("hapusIuranNama").textContent =
            iuran.nama;

        openModal(modalHapusIuran);
    }

    document
        .getElementById("btnKonfirmasiHapus")
        ?.addEventListener(
            "click",
            async () => {

                if (deletingIuranId === null) {
                    return;
                }

                const id =
                    deletingIuranId;
                const tombol =
                    document.getElementById(
                        "btnKonfirmasiHapus"
                    );

                if (tombol) {
                    tombol.disabled = true;
                }

                try {

                    await kirimJSON(
                        `${API_IURAN}/${id}`,
                        "DELETE",
                        null
                    );

                    deletingIuranId = null;

                    closeModal(
                        document.getElementById(
                            "modalHapusIuran"
                        )
                    );

                    showToast(
                        "Iuran dihapus",
                        "Iuran berhasil dihapus.",
                        "check"
                    );

                    await muatData();

                } catch (err) {

                    showToast(
                        "Gagal menghapus",
                        err.message,
                        "close"
                    );

                } finally {

                    if (tombol) {
                        tombol.disabled = false;
                    }
                }
            }
        );

    /*
    |--------------------------------------------------------------------------
    | FILTER IURAN
    |--------------------------------------------------------------------------
    */

    if (cariIuran) {
        cariIuran.addEventListener(
            "input",
            () => {
                renderIuran();
                syncIuranEmptyState();
            }
        );
    }


    if (filterKategori) {
        filterKategori.addEventListener(
            "change",
            () => {
                renderIuran();
                syncIuranEmptyState();
            }
        );
    }


    if (filterStatusIuran) {
        filterStatusIuran.addEventListener(
            "change",
            () => {
                renderIuran();
                syncIuranEmptyState();
            }
        );
    }


    if (btnResetFilter) {
        btnResetFilter.addEventListener(
            "click",
            () => {

                if (cariIuran) {
                    cariIuran.value =
                        "";
                }

                if (filterKategori) {
                    filterKategori.value =
                        "semua";
                }

                if (filterStatusIuran) {
                    filterStatusIuran.value =
                        "semua";
                }

                renderIuran();
                syncIuranEmptyState();
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | TOAST
    |--------------------------------------------------------------------------
    */

    function showToast(
        title,
        message,
        icon = "check"
    ) {

        if (!toast) {
            return;
        }


        clearTimeout(
            toastTimer
        );


        if (toastTitle) {
            toastTitle.textContent =
                title;
        }


        if (toastMessage) {
            toastMessage.textContent =
                message;
        }


        if (toastIcon) {
            toastIcon.innerHTML = `
                <span class="material-symbols-outlined">
                    ${escapeHTML(icon)}
                </span>
            `;
        }


        toast.classList.add(
            "is-show"
        );


        toastTimer =
            setTimeout(
                () => {
                    toast.classList.remove(
                        "is-show"
                    );
                },
                3500
            );
    }


    if (toastClose) {
        toastClose.addEventListener(
            "click",
            () => {
                toast.classList.remove(
                    "is-show"
                );
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | MUAT DATA DARI DATABASE
    |--------------------------------------------------------------------------
    */

    const muatData = async () => {

        const tbodyIuran = document.getElementById("isiTabelIuran");
        if (tbodyIuran) {
            tbodyIuran.innerHTML = Array.from({ length: 5 })
                .map(() => `<tr class="skeleton-row"><td colspan="8"><div class="skeleton skeleton-text--lg"></div></td></tr>`)
                .join("");
        }

        let hasilIuran = { data: [] };
        let hasilSiswa = { data: [] };
        let hasilTransaksi = { data: [] };

        try {

            [hasilIuran, hasilSiswa, hasilTransaksi] =
                await Promise.all([
                    ambilJSON(API_IURAN),
                    ambilJSON(API_SISWA),
                    ambilJSON(API_TRANSAKSI)
                ]);

        } catch (error) {

            console.error(error);
        }

        SISWA = (Array.isArray(hasilSiswa?.data)
            ? hasilSiswa.data
            : []
        ).map(petakanSiswa);

        transaksiData = Array.isArray(hasilTransaksi?.data)
            ? hasilTransaksi.data
            : [];

        iuranData = (Array.isArray(hasilIuran?.data)
            ? hasilIuran.data
            : []
        ).map(petakanIuran);

        renderSummary();
        renderIuran();
        syncIuranEmptyState();
    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL RENDER
    |--------------------------------------------------------------------------
    */

    csrfToken = bacaCsrf();

    renderSummary();
    renderIuran();
    syncIuranEmptyState();

    muatData();

});
