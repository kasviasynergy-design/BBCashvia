/* ============================================================
   BBCASHVIA - VIEWER TRANSAKSI
   Data berasal dari database (endpoint /data/transaksi).
   Tidak menggunakan data dummy.
   Viewer juga dapat menambah transaksi untuk kelasnya
   lewat endpoint /viewer/api/transaksi.
============================================================ */

// S3-07: modul bersama pengaman simpan ganda (anti-double-click
// + kunci idempotensi yang dibaca oleh guard backend).
import {
    kunciIdempoten,
    kunciTombolSimpan,
} from "./simpan-guard.js";

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       ENDPOINT + STATE
    ============================================================ */

    const API_URL = "/data/transaksi";

    const BULAN_SINGKAT = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];

    const PETAKAN_KATEGORI = {
        "iuran": "Iuran",
        "kas": "Kas",
        "kebutuhan kelas": "Kebutuhan Kelas",
        "perlengkapan kelas": "Perlengkapan Kelas",
        "kegiatan kelas": "Kegiatan Kelas",
        "pemasukan lainnya": "Pemasukan Lainnya",
        "pengeluaran lainnya": "Pengeluaran Lainnya"
    };

    let grupTransaksi = [];


    /* ============================================================
       AKSES API
    ============================================================ */

    const permintaanAPI = async (url, opsi = {}) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        let respons;
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

        clearTimeout(timeoutId);

        let hasil = {};
        try {
            hasil = await respons.json();
        } catch {
            /* Respons bukan JSON. */
        }

        if (!respons.ok) {
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");
            throw new Error(hasil?.message || "Gagal memuat data transaksi.");
        }

        return hasil;
    };


    /* ============================================================
       HELPER
    ============================================================ */

    const escapeHtml = (teks) => {

        return String(teks ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    };

    const labelKategori = (kategori) => {

        const kunci = String(kategori || "").toLowerCase();

        return PETAKAN_KATEGORI[kunci] || (kategori || "-");

    };

    const formatTanggal = (nilai) => {

        const iso = String(nilai ?? "").slice(0, 10);
        const bagian = iso.split("-");

        if (bagian.length !== 3) {
            return iso || "-";
        }

        const bulan = Number(bagian[1]);

        return `${bagian[2]} ${BULAN_SINGKAT[bulan - 1] ?? bagian[1]} ${bagian[0]}`;

    };

    /* Nilai jenis dari database: pemasukan / pengeluaran
       (data lama bisa berupa masuk / M). */
    const jenisTransaksi = (nilai) => {

        const arah = String(nilai ?? "").toLowerCase();

        if (arah === "pemasukan" || arah === "masuk" || arah === "m") {
            return "Pemasukan";
        }

        return "Pengeluaran";

    };

    const formatCurrency = (value) => {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(value) || 0);

    };

    const inisial = (nama) => {

        return String(nama || "-")
            .split(" ")
            .slice(0, 2)
            .map((kata) => kata.charAt(0))
            .join("")
            .toUpperCase();

    };


    /* ============================================================
       KELOMPOKKAN - SATU BARIS UTAMA PER NO BUKTI
       (pembayaran multi-iuran disimpan sebagai beberapa baris
        dengan no_bukti sama; nominal utamanya = nominal_grup)
    ============================================================ */

    const kelompokkan = (baris) => {

        const peta = new Map();

        baris.forEach((t) => {

            const noBukti = String(t.no_bukti || ("TRX-" + (t.id_transaksi ?? "")));

            if (peta.has(noBukti)) {
                return;
            }

            peta.set(noBukti, {
                bukti: noBukti,
                tanggal: formatTanggal(t.tanggal),
                waktu: t.waktu || "",
                jenis: jenisTransaksi(t.jenis),
                kategori: labelKategori(t.kategori),
                keterangan: t.keterangan || "",
                pembayar: t.nama_pembayar || "",
                nominal: Number(t.nominal_grup ?? t.nominal) || 0,
                jumlahRincian: Number(t.jumlah_rincian) || 1
            });

        });

        return [...peta.values()];

    };


    /* ============================================================
       ELEMENT (ID PERSIS SEPERTI BLADE)
    ============================================================ */

    const transaksiTableBody =
        document.getElementById("transaksiTableBody");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const tableCount =
        document.getElementById("tableCount");

    const emptyState =
        document.getElementById("emptyState");

    const totalTransaksi =
        document.getElementById("totalTransaksi");

    const totalPemasukan =
        document.getElementById("totalPemasukan");

    const totalPengeluaran =
        document.getElementById("totalPengeluaran");


    /* ============================================================
       RINGKASAN
    ============================================================ */

    const isiRingkasan = (data) => {

        const masuk = data
            .filter((item) => item.jenis === "Pemasukan")
            .reduce((total, item) => total + item.nominal, 0);

        const keluar = data
            .filter((item) => item.jenis === "Pengeluaran")
            .reduce((total, item) => total + item.nominal, 0);

        if (totalTransaksi) {
            totalTransaksi.textContent = `${data.length} transaksi`;
        }

        if (totalPemasukan) {
            totalPemasukan.textContent = formatCurrency(masuk);
        }

        if (totalPengeluaran) {
            totalPengeluaran.textContent = formatCurrency(keluar);
        }

    };


    /* ============================================================
       RENDER TABEL - KOLOM: TANGGAL | KETERANGAN | JENIS |
       NOMINAL | SISWA  (sesuai struktur tabel halaman)
    ============================================================ */

    const renderTable = (data) => {

        if (!transaksiTableBody) {
            return;
        }

        transaksiTableBody.innerHTML = "";

        if (data.length === 0) {

            emptyState?.classList.add("show");

            if (tableCount) {
                tableCount.textContent = "0";
            }

            return;

        }

        emptyState?.classList.remove("show");

        data.forEach((item, index) => {

            const masuk = item.jenis === "Pemasukan";

            const typeClass = masuk ? "success" : "danger";

            const prefix = masuk ? "+" : "-";

            const pembayarCell = item.pembayar
                ? `
                    <div class="table-person">
                        <div class="table-avatar">
                            ${escapeHtml(inisial(item.pembayar))}
                        </div>

                        <span>
                            ${escapeHtml(item.pembayar)}
                        </span>
                    </div>
                `
                : `<span class="mono-text">-</span>`;

            const rowHTML = `
                <td>
                    <span class="mono-text">
                        ${escapeHtml(item.tanggal)}
                    </span>

                    ${item.waktu
                        ? `<div class="mono-text">${escapeHtml(item.waktu)} WIB</div>`
                        : ""}
                </td>

                <td>
                    <span>
                        ${escapeHtml(item.keterangan || "-")}
                    </span>

                    <div class="mono-text">
                        ${escapeHtml(item.kategori)}${item.jumlahRincian > 1
                            ? ` • ${item.jumlahRincian} iuran`
                            : ""}
                    </div>
                </td>

                <td>
                    <span class="status-pill ${typeClass}">
                        <span class="status-dot"></span>
                        ${item.jenis}
                    </span>
                </td>

                <td>
                    <strong class="nominal">
                        ${prefix}${formatCurrency(item.nominal)}
                    </strong>
                </td>

                <td>
                    ${pembayarCell}
                </td>
            `;

            const row = document.createElement("tr");

            row.innerHTML = rowHTML;

            transaksiTableBody.appendChild(row);

        });

        if (tableCount) {
            tableCount.textContent = data.length;
        }

    };


    /* ============================================================
       FILTER
    ============================================================ */

    const filterData = () => {

        const cari =
            searchInput?.value.trim().toLowerCase() || "";

        const jenisDipilih = statusFilter?.value || "all";

        const jenisStandar =
            jenisDipilih === "masuk" ? "Pemasukan"
            : jenisDipilih === "keluar" ? "Pengeluaran"
            : "all";

        const hasil = grupTransaksi.filter((item) => {

            const kunciCari = [
                item.bukti,
                item.keterangan,
                item.pembayar,
                item.kategori,
                item.nominal
            ].join(" ").toLowerCase();

            const cocokCari =
                !cari || kunciCari.includes(cari);

            const cocokJenis =
                jenisStandar === "all" ||
                item.jenis === jenisStandar;

            return cocokCari && cocokJenis;

        });

        renderTable(hasil);
        isiRingkasan(hasil);

    };


    searchInput?.addEventListener("input", filterData);

    statusFilter?.addEventListener("change", filterData);


    /* ============================================================
       TAMBAH TRANSAKSI (FORM)
    ============================================================ */

    const KATEGORI_URL = "/viewer/api/transaksi/kategori";

    /* Cadangan bila daftar kategori dari server gagal dimuat;
       nilainya tetap dari enum resmi model Transaksi. */
    const DAFTAR_KATEGORI = {
        pemasukan: ["iuran", "kas", "pemasukan lainnya"],
        pengeluaran: [
            "kebutuhan kelas",
            "perlengkapan kelas",
            "kegiatan kelas",
            "pengeluaran lainnya"
        ]
    };

    let kategoriSumber = null;

    const bacaCsrf = () =>
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") || "";

    const kirimData = async (url, dataForm) => {

        let respons;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

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
            /* Respons bukan JSON. */
        }

        if (!respons.ok) {
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");
            const pesanGagal = hasil?.errors
                ? Object.values(hasil.errors).flat().join(" ")
                : "";

            throw new Error(
                pesanGagal
                || hasil?.message
                || "Gagal menyimpan data."
            );

        }

        return hasil;

    };

    const btnTambahTransaksi =
        document.getElementById("btnTambahTransaksi");

    const modalFormTransaksi =
        document.getElementById("modalFormTransaksi");

    const formTransaksi =
        document.getElementById("formTransaksi");

    const formErrorTransaksi =
        document.getElementById("formErrorTransaksi");

    const inputJenisTransaksi =
        document.getElementById("inputJenisTransaksi");

    const inputKategoriTransaksi =
        document.getElementById("inputKategoriTransaksi");

    const inputTanggalTransaksi =
        document.getElementById("inputTanggalTransaksi");

    const tampilkanPesanTransaksi = (pesan, sukses = false) => {

        if (!formErrorTransaksi) {
            return;
        }

        formErrorTransaksi.textContent = pesan;

        formErrorTransaksi.classList
            .toggle("success", sukses);

        formErrorTransaksi.hidden = false;

    };

    const bersihkanPesanTransaksi = () => {

        if (!formErrorTransaksi) {
            return;
        }

        formErrorTransaksi.hidden = true;

        formErrorTransaksi.classList.remove("success");

    };

    /* Isi dropdown kategori sesuai jenis transaksi. */
    const isiKategori = () => {

        if (!inputKategoriTransaksi) {
            return;
        }

        const jenis =
            inputJenisTransaksi?.value || "pemasukan";

        const nilaiSumber =
            jenis === "pemasukan"
                ? kategoriSumber?.masuk
                : kategoriSumber?.keluar;

        const daftar = Array.isArray(nilaiSumber)
            ? nilaiSumber
            : (DAFTAR_KATEGORI[jenis] || []).map(
                (nilai) => ({
                    value: nilai,
                    label: labelKategori(nilai)
                })
            );

        inputKategoriTransaksi.innerHTML = "";

        const kosong = document.createElement("option");
        kosong.value = "";
        kosong.textContent = "– Pilih kategori –";
        inputKategoriTransaksi.appendChild(kosong);

        daftar.forEach((item) => {

            const opsi = document.createElement("option");

            opsi.value = item.value;
            opsi.textContent = item.label;

            inputKategoriTransaksi.appendChild(opsi);

        });

    };

    const muatKategori = async () => {

        if (kategoriSumber) {
            return;
        }

        try {

            const hasil =
                await permintaanAPI(KATEGORI_URL);

            kategoriSumber = hasil?.data || null;

        } catch (error) {

            console.error(
                "Gagal memuat kategori:",
                error
            );

            kategoriSumber = null;

        }

        isiKategori();

    };

    const hariIni = () => {

        const sekarang = new Date();

        const pad = (angka) =>
            String(angka).padStart(2, "0");

        return [
            sekarang.getFullYear(),
            pad(sekarang.getMonth() + 1),
            pad(sekarang.getDate())
        ].join("-");

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

            if (!document.querySelector(".modal.is-open")) {
                document.body.classList.remove("modal-open");
            }

        }, 190);

    };

    btnTambahTransaksi?.addEventListener("click", () => {

        bukaModal(modalFormTransaksi);

        bersihkanPesanTransaksi();

        muatKategori();

        if (inputTanggalTransaksi) {
            inputTanggalTransaksi.value = hariIni();
        }

        inputJenisTransaksi?.focus();

    });

    document.querySelectorAll("[data-close-modal]")
        .forEach((element) => {

            element.addEventListener("click", () => {
                tutupModal(element.closest(".modal"));
            });

        });

    inputJenisTransaksi?.addEventListener(
        "change",
        isiKategori
    );

    formTransaksi?.addEventListener("submit", async (event) => {

        event.preventDefault();

        const dataForm = {
            jenis:
                inputJenisTransaksi?.value || "pemasukan",
            kategori:
                inputKategoriTransaksi?.value || "",
            tanggal:
                inputTanggalTransaksi?.value || "",
            nominal:
                Number(
                    document
                        .getElementById("inputNominalTransaksi")
                        ?.value
                ) || 0,
            nama_pembayar:
                document
                    .getElementById("inputPembayarTransaksi")
                    ?.value.trim() || "",
            metode:
                document
                    .getElementById("inputMetodeTransaksi")
                    ?.value || "CH",
            keterangan:
                document
                    .getElementById("inputKeteranganTransaksi")
                    ?.value.trim() || ""
        };

        bersihkanPesanTransaksi();

        if (dataForm.nominal <= 0) {
            tampilkanPesanTransaksi(
                "Nominal harus lebih dari 0."
            );
            return;
        }

        if (!dataForm.tanggal) {
            tampilkanPesanTransaksi(
                "Tanggal transaksi wajib diisi."
            );
            return;
        }

        if (!dataForm.kategori) {
            tampilkanPesanTransaksi(
                "Kategori wajib dipilih."
            );
            return;
        }

        const tombolSimpan =
            formTransaksi.querySelector(
                'button[type="submit"]'
            );

        // S3-07: kunci tombol saat proses (teks "Memproses...", tidak
        // dapat diklik dua kali). null = masih diproses, boleh henti.
        const pemulihanTombol = kunciTombolSimpan(tombolSimpan);
        if (!pemulihanTombol) return;

        try {

            await kirimData(
                "/viewer/api/transaksi",
                dataForm
            );

            tampilkanPesanTransaksi(
                `Transaksi ${dataForm.jenis} berhasil disimpan dengan nomor bukti baru.`,
                true
            );

            formTransaksi.reset();

            if (inputTanggalTransaksi) {
                inputTanggalTransaksi.value = hariIni();
            }

            await muatData();

            window.setTimeout(() => {
                tutupModal(modalFormTransaksi);
            }, 1300);

        } catch (error) {

            tampilkanPesanTransaksi(error.message);

        } finally {

            // S3-07: tombol pulih setelah proses berakhir.
            pemulihanTombol.pulihkan();

        }

    });


    /* ============================================================
       MUAT DATA
    ============================================================ */

    const muatData = async () => {

        const tbodyV = document.getElementById("transaksiTableBody");
        if (tbodyV) {
            tbodyV.innerHTML = Array.from({ length: 5 })
                .map(() => `<tr class="skeleton-row"><td colspan="7"><div class="skeleton skeleton-text--lg"></div></td></tr>`)
                .join("");
        }

        let baris = [];

        try {

            const hasil = await permintaanAPI(API_URL);

            baris = Array.isArray(hasil?.data) ? hasil.data : [];

        } catch (error) {

            console.error("Gagal memuat data transaksi:", error);

        }

        grupTransaksi = kelompokkan(baris);

        filterData();

    };


    /* ============================================================
       PROFILE DROPDOWN
    ============================================================ */

    const profileButton =
        document.getElementById("profileButton");

    const profileWrapper =
        document.querySelector(".profile-wrapper");

    const profileDropdown =
        document.getElementById("profileDropdown");

    if (profileButton && profileWrapper && profileDropdown) {

        profileButton.addEventListener("click", (event) => {

            event.stopPropagation();

            profileWrapper.classList.toggle("open");

        });

        profileDropdown.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        document.addEventListener("click", () => {
            profileWrapper.classList.remove("open");
        });

    }


    /* ============================================================
       LOGOUT (konfirmasi ditangani konfirmasi-logout.js)
    ============================================================ */

    /* ============================================================
       MOBILE SIDEBAR
    ============================================================ */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarBackdrop =
        document.getElementById("sidebarBackdrop");

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.querySelectorAll(".nav-link");


    const openSidebar = () => {

        sidebar?.classList.add("open");

        sidebarBackdrop?.classList.add("show");

        document.body.classList.add("nav-open");

    };


    const closeSidebar = () => {

        sidebar?.classList.remove("open");

        sidebarBackdrop?.classList.remove("show");

        document.body.classList.remove("nav-open");

    };


    menuToggle?.addEventListener("click", (event) => {

        event.stopPropagation();

        const terbuka = sidebar?.classList.contains("open");

        if (terbuka) {
            closeSidebar();
        } else {
            openSidebar();
        }

    });

    sidebarBackdrop?.addEventListener("click", closeSidebar);

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 900) {
                closeSidebar();
            }

        });

    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            document.querySelectorAll(".modal.is-open")
                .forEach((modal) => {
                    tutupModal(modal);
                });

            closeSidebar();

            profileWrapper?.classList.remove("open");

        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeSidebar();
        }

    });


    /* ============================================================
       INITIAL RENDER
    ============================================================ */

    muatData();

});
