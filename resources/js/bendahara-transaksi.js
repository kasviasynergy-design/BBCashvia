/* =========================================================
   BBCASHVIA - BENDAHARA TRANSAKSI
   Data berasal dari database (endpoint /bendahara/api/*).
========================================================= */

// S3-07: modul bersama pengaman simpan ganda (anti-double-click
// + kunci idempotensi yang dibaca oleh guard backend).
import {
    kunciIdempoten,
    kunciTombolSimpan,
} from "./simpan-guard.js";

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       HELPER
    ===================================================== */

    const $ = (id) => document.getElementById(id);


    const formatRupiah = (angka) => {

        const nilai = Number(angka) || 0;

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(nilai);

    };


    const parseAngka = (value) => {

        if (
            value === null ||
            value === undefined
        ) {
            return 0;
        }

        const angka = String(value)
            .replace(/[^\d]/g, "");

        return Number(angka) || 0;

    };


    const formatTeksUang = (input) => {

        if (!input) {
            return;
        }

        const angka =
            parseAngka(input.value);

        input.value =
            angka > 0
                ? new Intl.NumberFormat("id-ID")
                    .format(angka)
                : "";

    };


    const escapeHtml = (value) => {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    };


    const inisial = (nama) => {

        const bagian =
            String(nama || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (!bagian.length) {
            return "??";
        }

        if (bagian.length === 1) {
            return bagian[0]
                .slice(0, 2)
                .toUpperCase();
        }

        return (
            bagian[0][0] +
            bagian[bagian.length - 1][0]
        ).toUpperCase();

    };


    const formatTanggal = (tanggal) => {

        if (!tanggal) {
            return "-";
        }

        // Terima "2026-10-19", "2026-10-19 00:00:00", atau ISO penuh.
        const bagian = String(tanggal).slice(0, 10).split("-");

        if (bagian.length !== 3 || !bagian[0]) {
            return String(tanggal);
        }

        const date = new Date(
            Number(bagian[0]),
            Number(bagian[1]) - 1,
            Number(bagian[2])
        );

        if (Number.isNaN(date.getTime())) {
            return String(tanggal);
        }

        return new Intl.DateTimeFormat(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).format(date);

    };


    const getTodayLocal = () => {

        const now = new Date();

        const year =
            now.getFullYear();

        const month =
            String(now.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(now.getDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;

    };


    /* =====================================================
       ENDPOINT + STATE DATA
       Data berasal dari database (endpoint /bendahara/api/*).
       Tidak menggunakan data dummy.
    ===================================================== */

    const API_TRANSAKSI = "/bendahara/api/transaksi";
    const API_SISWA = "/bendahara/api/siswa";
    const API_IURAN = "/bendahara/api/iuran";
    const API_KATEGORI = "/bendahara/api/transaksi/kategori";

    let DATA_SISWA = [];

    let DATA_IURAN = [];

    let DATA_TRANSAKSI = [];


    /* =====================================================
       STATE
    ===================================================== */

    let modeForm = "tambah";

    let idSedangDiubah = null;

    let idSedangDihapus = null;

    let toastTimer = null;

    let csrfToken = "";


    const bacaCsrf = () => {

        const meta =
            document.querySelector(
                'meta[name="csrf-token"]'
            );

        return meta
            ? meta.getAttribute("content")
            : "";

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
            if (error?.name === "AbortError") {
                throw new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi.");
            }
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
            if (error?.name === "AbortError") {
                throw new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi.");
            }
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
                const pesan = Object.values(hasil.errors).flat().filter(Boolean);
                if (pesan.length) throw new Error(pesan.join(" "));
            }

            throw new Error(hasil?.message || "Terjadi kesalahan saat menyimpan.");

        }

        return hasil;

    };


    const hapusJSON = async (url) => {

        let respons;

        try {

            respons = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrfToken
                },
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
            /* bukan JSON */
        }

        if (!respons.ok) {

            throw new Error(
                hasil?.message ||
                "Gagal menghapus data."
            );

        }

        return hasil;

    };


    /* =====================================================
       KATEGORI (SATU SUMBER DARI BACKEND)
    ===================================================== */

    /*
     * Daftar kategori diambil dari endpoint /bendahara/api/transaksi/kategori
     * agar sama persis dengan dropdown filter dan dengan aturan server.
     * Cadangan berikut hanya dipakai bila pengambilan gagal.
     */
    const KATEGORI_CADANGAN = {
        masuk: [
            { value: "Iuran", label: "Iuran" },
            { value: "kas", label: "Kas" },
            { value: "pemasukan lainnya", label: "Pemasukan Lainnya" }
        ],
        keluar: [
            { value: "kebutuhan kelas", label: "Kebutuhan Kelas" },
            { value: "perlengkapan kelas", label: "Perlengkapan Kelas" },
            { value: "kegiatan kelas", label: "Kegiatan Kelas" },
            { value: "pengeluaran lainnya", label: "Pengeluaran Lainnya" }
        ]
    };


    let KATEGORI_MASUK = [...KATEGORI_CADANGAN.masuk];

    let KATEGORI_KELUAR = [...KATEGORI_CADANGAN.keluar];


    const muatKategori = async () => {

        let hasil;

        try {

            hasil = await ambilJSON(API_KATEGORI);

        } catch {

            return;

        }

        const data = hasil?.data;
        if (!data) return;

        if (Array.isArray(data.masuk) && data.masuk.length) {
            KATEGORI_MASUK = data.masuk;
        }

        if (Array.isArray(data.keluar) && data.keluar.length) {
            KATEGORI_KELUAR = data.keluar;
        }

        // Isi ulang pilihan yang mungkin sudah memakai daftar cadangan.
        isiKategoriForm();
        isiKategoriFilter();

    };


    const labelKategori = (value) => {

        const semua =
            [...KATEGORI_MASUK, ...KATEGORI_KELUAR];

        const cocok =
            semua.find(
                (item) => item.value === value
            );

        if (cocok) {
            return cocok.label;
        }

        const teks = String(value || "").trim();

        return teks
            ? teks.charAt(0).toUpperCase() + teks.slice(1)
            : "-";

    };


    /* =====================================================
       CALCULATION
       Semantik cicilan: "nominalBayar" adalah pembayaran
       SAAT INI (boleh sebagian dari tagihan), "diterima" adalah
       uang tunai yang diserahkan bendahara (untuk kembalian).
    ===================================================== */

    const hitungKembalian = (
        nominalBayar,
        diterima
    ) => {

        const total =
            Number(nominalBayar) || 0;

        const bayar =
            Number(diterima) || 0;

        return Math.max(
            bayar - total,
            0
        );

    };


    const hitungMasukKas = (
        nominalBayar,
        diterima
    ) => {

        const total =
            Number(nominalBayar) || 0;

        const bayar =
            Number(diterima) || 0;

        return Math.min(
            total,
            bayar
        );

    };


    /* =====================================================
       INFO PEMBAYARAN (CICILAN) - DATA ASLI DARI DATABASE
       "Pembayaran sebelumnya" = jumlah seluruh transaksi
       pemasukan yang sudah tercatat untuk pasangan
       (siswa, iuran). Sisa tagihan = tagihan - terbayar.
    ===================================================== */

    const hitungTerbayar = (
        idSiswa,
        idIuran,
        kecualiId = null
    ) =>
        DATA_TRANSAKSI.reduce(
            (total, t) => {

                if (t.jenis !== "masuk") {
                    return total;
                }

                if (
                    String(t.id_siswa ?? "") !==
                    String(idSiswa)
                ) {
                    return total;
                }

                if (
                    String(t.iuranId ?? "") !==
                    String(idIuran)
                ) {
                    return total;
                }

                // Saat mengubah transaksi, baris itu sendiri
                // dikecualikan agar tidak dihitung dua kali.
                if (
                    kecualiId != null &&
                    String(t.id_transaksi) ===
                    String(kecualiId)
                ) {
                    return total;
                }

                return (
                    total +
                    (Number(t.nominal) || 0)
                );

            },
            0
        );

    // Dapatkan sisa tagihan untuk satu baris transaksi di form "banyak"
    const hitungSisaTagihanBaris = (barisElement) => {
        const idSiswa = barisElement.querySelector(".baris-siswa")?.value || "";
        const idIuran = barisElement.querySelector(".baris-iuran")?.value || "";

        if (!idSiswa || !idIuran) {
            return 0;
        }

        const iuran = DATA_IURAN.find(
            (item) => String(item.id) === String(idIuran)
        );

        if (!iuran) {
            return 0;
        }

        const tagihan = Number(iuran.nominal) || 0;
        const terbayar = hitungTerbayar(idSiswa, idIuran);

        return Math.max(tagihan - terbayar, 0);
    };

    const perbaruiInfoPembayaran = () => {

        const inputSiswa =
            $("inputSiswa");

        const inputIuran =
            $("inputIuran");

        const inputSisaTagihan =
            $("inputSisaTagihan");

        const inputNominalBayar =
            $("inputNominalBayar");

        if (
            !inputSisaTagihan
        ) {
            return;
        }

        const idSiswa =
            inputSiswa?.value || "";

        const idIuran =
            inputIuran?.value || "";

        const adaPilihan =
            Boolean(idSiswa) &&
            Boolean(idIuran);

        const iuran =
            DATA_IURAN.find(
                (item) =>
                    String(item.id) === String(idIuran)
            );

        const tagihan =
            Number(iuran?.nominal) || 0;

        // Saat mode edit, baris yang sedang diubah dikecualikan.
        const trxEdit =
            modeForm === "edit"
                ? DATA_TRANSAKSI.find(
                    (item) =>
                        String(item.id) ===
                        String(idSedangDiubah)
                )
                : null;

        const terbayar =
            adaPilihan
                ? hitungTerbayar(
                    idSiswa,
                    idIuran,
                    trxEdit?.id_transaksi ?? null
                )
                : 0;

        const sisa =
            Math.max(tagihan - terbayar, 0);

        inputSisaTagihan.value = adaPilihan
            ? new Intl.NumberFormat("id-ID").format(sisa)
            : "";

        // Saran cicilan: placeholder mengikuti sisa tagihan.
        if (
            inputNominalBayar &&
            modeForm === "tambah"
        ) {

            inputNominalBayar.placeholder =
                adaPilihan && sisa > 0
                    ? new Intl.NumberFormat("id-ID").format(sisa)
                    : "0";

        }

        hitungUangLive();

    };


    /* =====================================================
       PEMETAAN DATA DARI DATABASE
    ===================================================== */

    const petakanSiswa = (s) => ({
        id_siswa: s.id_siswa,
        nis: s.nis ?? "",
        nama: s.nama ?? "-",
        kelas: s.kelas || "-",
        id_kelas: s.id_kelas ?? null,
        rincian_iuran: Array.isArray(s.rincian_iuran)
            ? s.rincian_iuran
            : []
    });


    const petakanIuran = (i) => ({
        id: i.id_iuran,
        nama: i.nama_iuran ?? "-",
        periode: i.keterangan || "-",
        keterangan: i.keterangan || "",
        status: String(i.status ?? "").toLowerCase(),
        id_kelas: i.id_kelas,
        nominal: Number(i.nominal) || 0
    });


    const petakanTransaksi = (t) => {

        const jenis =
            ["PEMASUKAN", "M"].includes(String(t.jenis || "").toUpperCase())
                ? "masuk"
                : "keluar";

        const siswaCocok =
            t.id_siswa != null
                ? DATA_SISWA.find(
                    (s) =>
                        String(s.id_siswa) === String(t.id_siswa)
                )
                : null;

        const iuranCocok =
            t.id_iuran != null
                ? DATA_IURAN.find(
                    (i) =>
                        String(i.id) === String(t.id_iuran)
                )
                : null;

        return {

            id_transaksi: t.id_transaksi,

            /* Nomor bukti dipakai sebagai identitas tampilan. */
            id: t.no_bukti ?? "-",

            jenis,

            nis: siswaCocok
                ? siswaCocok.nis
                : "",

            siswa:
                t.nama_pembayar ||
                (siswaCocok ? siswaCocok.nama : ""),

            id_siswa: t.id_siswa,

            iuranId: t.id_iuran,

            iuran:
                iuranCocok
                    ? iuranCocok.nama
                    : (t.keterangan || ""),

            kategori: t.kategori || "",

            nominal: Number(t.nominal) || 0,

            diterima: Number(t.uang_diterima) || 0,

            kembalian: Number(t.kembalian) || 0,

            masukKas:
                jenis === "masuk"
                    ? Number(t.nominal) || 0
                    : 0,

            metode: t.metode === "TF" ? "Transfer" : "Tunai",

            tanggal: t.tanggal
                ? String(t.tanggal).slice(0, 10)
                : "",

            keterangan: t.keterangan || "",

            petugas: t.dicatat_oleh || t.pic || "Bendahara"

        };

    };


    /* =====================================================
       DATE
    ===================================================== */

    const updateTanggal = () => {

        const target =
            $("topbarDate");

        if (!target) {
            return;
        }

        target.textContent =
            new Intl.DateTimeFormat(
                "id-ID",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(new Date());

    };


    /* =====================================================
       SELECT SISWA
    ===================================================== */

    const isiPilihanSiswa = () => {

        const select =
            $("inputSiswa");

        if (!select) {
            return;
        }

        select.innerHTML = `
            <option value="">
                Pilih siswa
            </option>
        `;

        DATA_SISWA.forEach((siswa) => {

            const option =
                document.createElement("option");

            option.value =
                siswa.id_siswa;

            option.textContent =
                `${siswa.nama} - ${siswa.nis}`;

            select.appendChild(option);

        });

    };


    /* =====================================================
       SELECT IURAN
    ===================================================== */

    const isiPilihanIuran = (idTerpilih = "") => {

        const select =
            $("inputIuran");

        if (!select) {
            return;
        }

        select.innerHTML = `
            <option value="">
                Pilih iuran
            </option>
        `;

        // Hanya iuran Aktif yang boleh dipakai untuk pembayaran baru.
        // Saat mengubah transaksi lama, iuran yang sudah Selesai tetap
        // ditampilkan agar relasi lama tidak hilang tanpa sengaja.
        const daftar =
            DATA_IURAN.filter(
                (iuran) =>
                    iuran.status === "aktif" ||
                    (
                        idTerpilih &&
                        String(iuran.id) === String(idTerpilih)
                    )
            );

        daftar.forEach((iuran) => {

            const option =
                document.createElement("option");

            option.value =
                iuran.id;

            option.textContent =
                `${iuran.nama} - ${formatRupiah(iuran.nominal)}` +
                (iuran.status === "aktif"
                    ? ""
                    : " (Selesai)");

            select.appendChild(option);

        });

        if (idTerpilih) {
            select.value = String(idTerpilih);
        }

    };


    /* =====================================================
       KATEGORI FORM
    ===================================================== */

    const isiKategoriForm = () => {

        const select =
            $("inputKategori");

        if (!select) {
            return;
        }

        const nilaiSebelumnya =
            select.value;

        /*
         * Tampilkan SELURUH kategori (7 pilihan) dipisah per jenis:
         * kelompok "Pemasukan" dan "Pengeluaran". Saat pengguna
         * memilih kategori, jenis transaksi menyesuaikan otomatis
         * supaya server tidak pernah menerima kombinasi yang salah.
         */
        select.innerHTML = "";

        const buatGrup = (nama, daftar) => {

            const grup =
                document.createElement("optgroup");

            grup.label =
                nama;

            daftar.forEach((kategori) => {

                const option =
                    document.createElement("option");

                option.value =
                    kategori.value;

                option.textContent =
                    kategori.label;

                grup.appendChild(option);

            });

            select.appendChild(grup);

        };

        buatGrup("Pemasukan", KATEGORI_MASUK);
        buatGrup("Pengeluaran", KATEGORI_KELUAR);

        const semua =
            [...KATEGORI_MASUK, ...KATEGORI_KELUAR];

        if (
            semua.some(
                (item) => item.value === nilaiSebelumnya
            )
        ) {
            select.value =
                nilaiSebelumnya;
        } else if (select.options.length) {
            select.selectedIndex = 0;
        }

    };


    /**
     * Kategori menentukan jenis transaksi.
     *
     * Kategori pengeluaran hanya sah bila jenis = Pengeluaran, jadi
     * saat pengguna memilih kategori dari kelompok pengeluaran, radio
     * jenis otomatis dipindah ke Pengeluaran (dan sebaliknya).
     */
    const sesuaikanJenisKeKategori = () => {

        const select =
            $("inputKategori");

        if (!select) {
            return;
        }

        const kategori =
            select.value;

        if (!kategori) {
            return;
        }

        const masuk =
            KATEGORI_MASUK.some(
                (item) => item.value === kategori
            );

        const nilaiJenis =
            masuk ? "masuk" : "keluar";

        const radio =
            document.querySelector(
                `input[name="jenisTransaksi"][value="${nilaiJenis}"]`
            );

        if (radio && !radio.checked) {
            radio.checked = true;
            sesuaikanFormJenis();
        }

    };


    /**
     * Pindahkan pilihan kategori ke kategori pertama yang sah untuk
     * jenis yang sedang aktif (mencegah kombinasi tidak valid).
     */
    const pilihKategoriPertamaSesuaiJenis = () => {

        const select =
            $("inputKategori");

        if (!select) {
            return;
        }

        const jenis =
            document.querySelector(
                'input[name="jenisTransaksi"]:checked'
            )?.value ?? "masuk";

        const daftar =
            jenis === "keluar"
                ? KATEGORI_KELUAR
                : KATEGORI_MASUK;

        const pertama =
            daftar[0]?.value;

        if (
            pertama &&
            [...select.options].some(
                (o) => o.value === pertama
            )
        ) {
            select.value = pertama;
        }

    };


    /* =====================================================
       KATEGORI FILTER
    ===================================================== */

    const isiKategoriFilter = () => {

        const select =
            $("filterKategori");

        if (!select) {
            return;
        }

        const semuaKategori =
            [
                ...KATEGORI_MASUK,
                ...KATEGORI_KELUAR
            ];

        select.innerHTML = `
            <option value="semua">
                Semua Kategori
            </option>
        `;

        semuaKategori.forEach((kategori) => {

            const option =
                document.createElement("option");

            option.value =
                kategori.value;

            option.textContent =
                kategori.label;

            select.appendChild(option);

        });

    };


    /* =====================================================
       UPDATE NOMINAL IURAN
    ===================================================== */

    const updateNominalIuran = () => {

        const inputIuran =
            $("inputIuran");

        const inputTagihan =
            $("inputTagihan");

        if (
            !inputIuran ||
            !inputTagihan
        ) {
            return;
        }

        const selected =
            DATA_IURAN.find(
                (item) =>
                    String(item.id) === String(inputIuran.value)
            );

        if (!selected) {

            inputTagihan.value = "";

            perbaruiInfoPembayaran();

            return;

        }

        inputTagihan.value =
            new Intl.NumberFormat("id-ID")
                .format(selected.nominal);

        perbaruiInfoPembayaran();

    };


    /* =====================================================
       LIVE MONEY
    ===================================================== */

    const hitungUangLive = () => {

        const inputDiterima =
            $("inputDiterima");

        const inputNominalBayar =
            $("inputNominalBayar");

        const hasilKembalian =
            $("hasilKembalian");

        const hasilMasukKas =
            $("hasilMasukKas");

        const uangHint =
            $("uangHint");

        if (
            !inputDiterima ||
            !inputNominalBayar ||
            !hasilKembalian ||
            !hasilMasukKas
        ) {
            return;
        }

        const bayar =
            parseAngka(
                inputNominalBayar.value
            );

        const diterima =
            parseAngka(
                inputDiterima.value
            );

        const kembalian =
            hitungKembalian(
                bayar,
                diterima
            );

        const masukKas =
            hitungMasukKas(
                bayar,
                diterima
            );

        hasilKembalian.textContent =
            formatRupiah(kembalian);

        hasilMasukKas.textContent =
            formatRupiah(masukKas);


        if (uangHint) {

            uangHint.classList.remove(
                "is-peringatan"
            );

            const sisa =
                parseAngka(
                    $("inputSisaTagihan")?.value
                );

            if (
                bayar > 0 &&
                sisa > 0 &&
                bayar > sisa
            ) {

                uangHint.textContent =
                    `Nominal pembayaran melebihi sisa tagihan (sisa ${formatRupiah(sisa)}).`;

                uangHint.classList.add(
                    "is-peringatan"
                );

            } else if (
                bayar > 0 &&
                diterima > 0 &&
                diterima < bayar
            ) {

                uangHint.textContent =
                    `Uang diterima masih kurang ${formatRupiah(bayar - diterima)} dari nominal pembayaran.`;

                uangHint.classList.add(
                    "is-peringatan"
                );

            } else if (
                bayar > 0 &&
                diterima >= bayar
            ) {

                if (sisa > 0 && bayar < sisa) {

                    uangHint.textContent =
                        `Cicilan: sisa tagihan berikutnya ${formatRupiah(sisa - bayar)}.`;

                } else {

                    uangHint.textContent =
                        `Tagihan lunas. Kembalian ${formatRupiah(kembalian)} dan uang yang masuk ke kas ${formatRupiah(masukKas)}.`;

                }

            } else {

                uangHint.textContent =
                    "Masukkan nominal pembayaran (boleh penuh atau cicilan) untuk menghitung kembalian.";

            }

        }

    };
    /* =====================================================
       LIVE MONEY PER BARIS (BANYAK TRANSAKSI)
     ===================================================== */

    const hitungUangLiveBaris = (barisElement) => {

        const nominalInput =
            barisElement.querySelector(".baris-nominal");

        const sisaEl =
            barisElement.querySelector(".baris-sisa-tagihan");

        if (!nominalInput || !sisaEl) return;

        const nominalBayar = parseAngka(nominalInput.value);
        const tagihanAwal = parseAngka(sisaEl.dataset.tagihanAwal || "0");
        const sisaBaru = Math.max(tagihanAwal - nominalBayar, 0);
        const kembalian = Math.max(nominalBayar - tagihanAwal, 0);

        sisaEl.value = new Intl.NumberFormat("id-ID").format(sisaBaru);

        // Set tagihan awal jika belum diset (dari iuran pertama kali dipilih)
        if (!sisaEl.dataset.tagihanAwal) {
            sisaEl.dataset.tagihanAwal = tagihanAwal;
        }

        return {
            sisa: sisaBaru,
            kembalian
        };

    };



    /* =====================================================
       SESUAIKAN JENIS FORM
    ===================================================== */

    const sesuaikanFormJenis = () => {

        const jenis =
            document.querySelector(
                'input[name="jenisTransaksi"]:checked'
            )?.value || "masuk";


        const siswaGroup =
            $("siswaGroup");

        const iuranGroup =
            $("iuranGroup");

        const tagihanGroup =
            $("tagihanGroup");

        const uangBox =
            $("uangBox");

        const pengeluaranNominalGroup =
            $("pengeluaranNominalGroup");

        const inputSiswa =
            $("inputSiswa");

        const inputIuran =
            $("inputIuran");

        const inputTagihan =
            $("inputTagihan");

        const inputDiterima =
            $("inputDiterima");

        const inputNominalKeluar =
            $("inputNominalKeluar");

        const labelDiterima =
            $("labelDiterima");

        const labelMasukKas =
            $("labelMasukKas");

        const infoTagihanGroup =
            $("infoTagihanGroup");

        const inputNominalBayar =
            $("inputNominalBayar");

        if (jenis === "keluar") {

            if (siswaGroup) {
                siswaGroup.hidden = true;
            }

            if (iuranGroup) {
                iuranGroup.hidden = true;
            }

            if (tagihanGroup) {
                tagihanGroup.hidden = true;
            }

            if (infoTagihanGroup) {
                infoTagihanGroup.hidden = true;
            }

            if (uangBox) {
                uangBox.hidden = true;
            }

            if (pengeluaranNominalGroup) {
                pengeluaranNominalGroup.hidden = false;
            }

            if (inputSiswa) {
                inputSiswa.value = "";
            }

            if (inputIuran) {
                inputIuran.value = "";
            }

            if (inputTagihan) {
                inputTagihan.value = "";
            }

            if (inputNominalBayar) {
                inputNominalBayar.value = "";
            }

            if (inputDiterima) {
                inputDiterima.value = "";
            }

            if (labelDiterima) {
                labelDiterima.textContent =
                    "Uang Diterima Bendahara";
            }

            if (labelMasukKas) {
                labelMasukKas.textContent =
                    "Uang Masuk Kas";
            }

        } else {

            if (siswaGroup) {
                siswaGroup.hidden = false;
            }

            if (iuranGroup) {
                iuranGroup.hidden = false;
            }

            if (tagihanGroup) {
                tagihanGroup.hidden = false;
            }

            if (infoTagihanGroup) {
                infoTagihanGroup.hidden = false;
            }

            if (uangBox) {
                uangBox.hidden = false;
            }

            if (pengeluaranNominalGroup) {
                pengeluaranNominalGroup.hidden = true;
            }

            if (inputNominalKeluar) {
                inputNominalKeluar.value = "";
            }

            if (labelDiterima) {
                labelDiterima.textContent =
                    "Uang Diterima Bendahara";
            }

            if (labelMasukKas) {
                labelMasukKas.textContent =
                    "Uang Masuk Kas";
            }

        }

        isiKategoriForm();

        perbaruiInfoPembayaran();

    };


    /* =====================================================
       RESET FORM
    ===================================================== */

    const resetForm = () => {

        const form =
            $("formTransaksi");

        if (form) {
            form.reset();
        }


        const radioMasuk =
            document.querySelector(
                'input[name="jenisTransaksi"][value="masuk"]'
            );

        if (radioMasuk) {
            radioMasuk.checked = true;
        }


        const inputTagihan =
            $("inputTagihan");

        if (inputTagihan) {
            inputTagihan.value = "";
        }


        const inputDiterima =
            $("inputDiterima");

        if (inputDiterima) {
            inputDiterima.value = "";
        }


        const inputNominalKeluar =
            $("inputNominalKeluar");

        if (inputNominalKeluar) {
            inputNominalKeluar.value = "";
        }


        const inputNominalBayar =
            $("inputNominalBayar");

        if (inputNominalBayar) {
            inputNominalBayar.value = "";
            inputNominalBayar.placeholder = "0";
        }


        const inputSisaTagihan =
            $("inputSisaTagihan");

        if (inputSisaTagihan) {
            inputSisaTagihan.value = "";
        }


        const hasilKembalian =
            $("hasilKembalian");

        if (hasilKembalian) {
            hasilKembalian.textContent =
                formatRupiah(0);
        }


        const hasilMasukKas =
            $("hasilMasukKas");

        if (hasilMasukKas) {
            hasilMasukKas.textContent =
                formatRupiah(0);
        }


        const tanggal =
            $("inputTanggal");

        if (tanggal) {
            tanggal.value =
                getTodayLocal();
        }


        const error =
            $("formError");

        if (error) {
            error.hidden = true;
            error.textContent = "";
        }


        const title =
            $("modalFormTitle");

        if (title) {
            title.textContent =
                "Tambah Transaksi";
        }


        const buttonText =
            $("btnSimpanText");

        if (buttonText) {
            buttonText.textContent =
                "Simpan Transaksi";
        }


        modeForm = "tambah";

        idSedangDiubah = null;


        sesuaikanFormJenis();

    };


    /* =====================================================
       AMBIL DATA FORM
    ===================================================== */

    const ambilDataForm = () => {

        const jenis =
            document.querySelector(
                'input[name="jenisTransaksi"]:checked'
            )?.value || "masuk";


        const siswaNis =
            $("inputSiswa")?.value || "";


        const iuranId =
            $("inputIuran")?.value || "";


        const tagihan =
            parseAngka(
                $("inputTagihan")?.value
            );


        const diterima =
            parseAngka(
                $("inputDiterima")?.value
            );


        const nominalBayar =
            parseAngka(
                $("inputNominalBayar")?.value
            );


        const nominalKeluar =
            parseAngka(
                $("inputNominalKeluar")?.value
            );


        const tanggal =
            $("inputTanggal")?.value || "";


        const metode =
            $("inputMetode")?.value || "";


        const kategori =
            $("inputKategori")?.value || "";


        const keterangan =
            $("inputKeterangan")
                ?.value
                .trim() || "";


        const siswa =
            DATA_SISWA.find(
                (item) =>
                    String(item.id_siswa) === String(siswaNis)
            );


        const iuran =
            DATA_IURAN.find(
                (item) =>
                    String(item.id) === String(iuranId)
            );


        return {

            jenis,

            siswa,

            iuran,

            tagihan,

            diterima,

            nominalBayar,

            nominalKeluar,

            tanggal,

            metode,

            kategori,

            keterangan

        };

    };


    /* =====================================================
       VALIDATE
    ===================================================== */

    const validateForm = (data) => {

        const error =
            $("formError");


        const showError = (message) => {

            if (!error) {
                return;
            }

            error.textContent =
                message;

            error.hidden = false;

        };


        if (
            data.jenis !== "masuk" &&
            data.jenis !== "keluar"
        ) {

            showError(
                "Silakan pilih jenis transaksi."
            );

            return false;

        }


        if (!data.tanggal) {

            showError(
                "Tanggal transaksi wajib diisi."
            );

            return false;

        }


        if (!data.metode) {

            showError(
                "Silakan pilih metode transaksi."
            );

            return false;

        }


        if (!data.kategori) {

            showError(
                "Silakan pilih kategori transaksi."
            );

            return false;

        }


        if (data.jenis === "masuk") {

            if (!data.siswa) {

                showError(
                    "Silakan pilih siswa terlebih dahulu."
                );

                return false;

            }


            if (!data.iuran) {

                showError(
                    "Silakan pilih iuran terlebih dahulu."
                );

                return false;

            }


            const trxAsal =
                modeForm === "edit"
                    ? DATA_TRANSAKSI.find(
                        (item) =>
                            String(item.id) ===
                            String(idSedangDiubah)
                    )
                    : null;

            const iuranLamaTidakBerubah =
                trxAsal &&
                String(trxAsal.iuranId) === String(data.iuran.id) &&
                data.nominalBayar <=
                    Number(trxAsal.nominal || 0) + 0.009;

            if (
                String(data.iuran.status || "").toLowerCase() !==
                    "aktif" &&
                !iuranLamaTidakBerubah
            ) {

                showError(
                    "Iuran ini sudah berstatus Selesai dan tidak dapat menerima pembayaran baru."
                );

                return false;

            }


            if (!data.tagihan) {

                showError(
                    "Nominal tagihan belum tersedia."
                );

                return false;

            }


            if (!data.nominalBayar) {

                showError(
                    "Masukkan nominal pembayaran saat ini (boleh penuh atau cicilan)."
                );

                return false;

            }


            // Sisa tagihan dari data asli: tagihan - semua pembayaran
            // pemasukan yang sudah tercatat (baris yang sedang diedit
            // dikecualikan agar tidak dihitung dua kali).
            const trxEdit =
                modeForm === "edit"
                    ? DATA_TRANSAKSI.find(
                        (item) =>
                            String(item.id) ===
                            String(idSedangDiubah)
                    )
                    : null;

            const terbayar =
                hitungTerbayar(
                    data.siswa.id_siswa,
                    data.iuran.id,
                    trxEdit?.id_transaksi ?? null
                );

            const sisa =
                Math.max(
                    Number(data.tagihan) - terbayar,
                    0
                );


            if (data.nominalBayar > sisa) {

                showError(
                    `Pembayaran melebihi sisa tagihan. Sisa tagihan saat ini ${formatRupiah(sisa)}.`
                );

                return false;

            }


            if (!data.diterima) {

                showError(
                    "Masukkan jumlah uang yang diterima bendahara."
                );

                return false;

            }


            if (
                data.diterima <
                data.nominalBayar
            ) {

                showError(
                    "Jumlah uang yang diterima masih kurang dari nominal pembayaran."
                );

                return false;

            }

        }


        if (data.jenis === "keluar") {

            if (!data.nominalKeluar) {

                showError(
                    "Masukkan nominal pengeluaran."
                );

                return false;

            }

        }


        if (error) {

            error.hidden = true;

            error.textContent = "";

        }

        return true;

    };


    /* =====================================================
       FILTERED DATA
    ===================================================== */

    const getFilteredData = () => {

        const keyword =
            (
                $("cariTransaksi")
                    ?.value || ""
            )
                .trim()
                .toLowerCase();


        const jenis =
            $("filterJenis")
                ?.value || "semua";


        const kategori =
            $("filterKategori")
                ?.value || "semua";


        const bulan =
            $("filterBulan")
                ?.value || "semua";


        return DATA_TRANSAKSI.filter(
            (trx) => {

                const teks = [
                    trx.id,
                    trx.jenis,
                    trx.siswa,
                    trx.nis,
                    trx.iuran,
                    trx.iuranId,
                    trx.kategori,
                    trx.keterangan,
                    trx.metode,
                    trx.petugas
                ]
                    .join(" ")
                    .toLowerCase();


                const cocokKeyword =
                    !keyword ||
                    teks.includes(keyword);


                const cocokJenis =
                    jenis === "semua" ||
                    trx.jenis === jenis;


                const cocokKategori =
                    kategori === "semua" ||
                    String(trx.kategori ?? "").toLowerCase() ===
                        String(kategori).toLowerCase();


                const tanggal =
                    String(
                        trx.tanggal || ""
                    );


                const cocokBulan =
                    bulan === "semua" ||
                    tanggal.slice(5, 7) === bulan;


                return (
                    cocokKeyword &&
                    cocokJenis &&
                    cocokKategori &&
                    cocokBulan
                );

            }
        );

    };


    /* =====================================================
       SUMMARY
    ===================================================== */

    const renderSummary = (data) => {

        const totalPemasukan =
            data.reduce(
                (sum, trx) => {

                    if (
                        trx.jenis !== "masuk"
                    ) {
                        return sum;
                    }

                    return (
                        sum +
                        Number(
                            trx.masukKas ||
                            trx.nominal ||
                            0
                        )
                    );

                },
                0
            );


        const totalPengeluaran =
            data.reduce(
                (sum, trx) => {

                    if (
                        trx.jenis !== "keluar"
                    ) {
                        return sum;
                    }

                    return (
                        sum +
                        Number(
                            trx.nominal ||
                            0
                        )
                    );

                },
                0
            );


        const selisih =
            totalPemasukan -
            totalPengeluaran;


        const jumlah =
            data.length;


        if ($("sumMasuk")) {

            $("sumMasuk").textContent =
                formatRupiah(
                    totalPemasukan
                );

        }


        if ($("sumMasukNote")) {

            $("sumMasukNote").textContent =
                jumlah === 0
                    ? "Belum ada transaksi terfilter"
                    : `dari ${jumlah} transaksi terfilter`;

        }


        if ($("sumKeluar")) {

            $("sumKeluar").textContent =
                formatRupiah(
                    totalPengeluaran
                );

        }


        if ($("sumKeluarNote")) {

            $("sumKeluarNote").textContent =
                jumlah === 0
                    ? "Belum ada transaksi terfilter"
                    : `dari ${jumlah} transaksi terfilter`;

        }


        if ($("sumSelisih")) {

            $("sumSelisih").textContent =
                selisih > 0
                    ? `+${formatRupiah(selisih)}`
                    : formatRupiah(selisih);

        }


        if ($("sumSelisih")) {

            $("sumSelisih").style.color =
                selisih > 0
                    ? "var(--success)"
                    : selisih < 0
                        ? "var(--danger)"
                        : "var(--text)";

        }


        if ($("sumSelisihNote")) {

            $("sumSelisihNote").textContent =
                "pemasukan − pengeluaran";

        }

    };


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    const renderTable = () => {

        const tbody =
            $("isiTabelTransaksi");

        const empty =
            $("emptyState");

        const info =
            $("tabelInfo");


        if (!tbody) {
            return;
        }


        const data =
            getFilteredData();


        tbody.innerHTML = "";


        if (empty) {

            empty.hidden =
                data.length !== 0;

        }


        if (!data.length) {

            if (info) {

                info.textContent =
                    "Menampilkan 0 transaksi";

            }

            renderSummary(data);

            return;

        }


        data.forEach((trx) => {

            const tr =
                document.createElement("tr");


            const methodClass =
                String(
                    trx.metode || ""
                )
                    .toLowerCase();


            const jenisLabel =
                trx.jenis === "masuk"
                    ? "Pemasukan"
                    : "Pengeluaran";


            const nominal =
                trx.jenis === "masuk"
                    ? Number(
                        trx.masukKas ||
                        trx.nominal ||
                        0
                    )
                    : Number(
                        trx.nominal ||
                        0
                    );


            let identitasHtml;


            if (trx.jenis === "masuk") {

                identitasHtml = `

                    <div class="student-cell">

                        <div class="student-avatar">
                            ${escapeHtml(
                                inisial(trx.siswa)
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeHtml(
                                    trx.siswa || "-"
                                )}
                            </strong>

                            <small>
                                NIS ${escapeHtml(
                                    trx.nis || "-"
                                )}
                            </small>

                        </div>

                    </div>

                `;

            } else {

                identitasHtml = `

                    <div class="student-cell">

                        <div class="student-avatar">
                            <span class="material-symbols-outlined">
                                payments
                            </span>
                        </div>

                        <div>

                            <strong>
                                Pengeluaran Kas
                            </strong>

                            <small>
                                ${escapeHtml(
                                    trx.keterangan ||
                                    "Transaksi pengeluaran"
                                )}
                            </small>

                        </div>

                    </div>

                `;

            }


            const deskripsi =
                trx.jenis === "masuk"
                    ? (
                        trx.iuran ||
                        "Pembayaran Iuran"
                    )
                    : (
                        trx.keterangan ||
                        "Pengeluaran Kas"
                    );


            const subDeskripsi =
                trx.jenis === "masuk"
                    ? (
                        trx.keterangan ||
                        "Pembayaran iuran"
                    )
                    : (
                        `Kategori: ${labelKategori(trx.kategori)}`
                    );


            tr.innerHTML = `

                <td>

                    <span class="transaction-id">
                        ${escapeHtml(trx.id)}
                    </span>

                </td>


                <td>

                    <span class="type-badge type-badge--${escapeHtml(trx.jenis)}">
                        ${escapeHtml(jenisLabel)}
                    </span>

                </td>


                <td>

                    ${identitasHtml}

                </td>


                <td>

                    <span class="transaction-description">

                        <strong>
                            ${escapeHtml(deskripsi)}
                        </strong>

                        <small>
                            ${escapeHtml(subDeskripsi)}
                        </small>

                    </span>

                </td>


                <td>

                    <span class="transaction-date">
                        ${escapeHtml(
                            formatTanggal(
                                trx.tanggal
                            )
                        )}
                    </span>

                    <small class="transaction-date">
                        ${escapeHtml(
                            trx.tanggal || "-"
                        )}
                    </small>

                </td>


                <td>

                    <span class="method-badge method-badge--${escapeHtml(methodClass)}">
                        ${escapeHtml(
                            trx.metode
                        )}
                    </span>

                </td>


                <td class="cell-petugas">

                    ${escapeHtml(trx.petugas || "-")}

                </td>


                <td class="text-right">

                    <span class="nominal nominal--${escapeHtml(trx.jenis)}">

                        ${escapeHtml(
                            trx.jenis === "keluar"
                                ? `-${formatRupiah(nominal)}`
                                : formatRupiah(nominal)
                        )}

                    </span>

                </td>


                <td class="text-center">

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="action-btn"
                            data-aksi="detail"
                            data-id="${escapeHtml(trx.id)}"
                            title="Lihat detail"
                            aria-label="Lihat detail"
                        >

                            <span class="material-symbols-outlined">
                                visibility
                            </span>

                        </button>


                        <button
                            type="button"
                            class="action-btn"
                            data-aksi="ubah"
                            data-id="${escapeHtml(trx.id)}"
                            title="Ubah transaksi"
                            aria-label="Ubah transaksi"
                        >

                            <span class="material-symbols-outlined">
                                edit
                            </span>

                        </button>


                        <button
                            type="button"
                            class="action-btn action-btn--delete"
                            data-aksi="hapus"
                            data-id="${escapeHtml(trx.id)}"
                            title="Hapus transaksi"
                            aria-label="Hapus transaksi"
                        >

                            <span class="material-symbols-outlined">
                                delete
                            </span>

                        </button>

                    </div>

                </td>

            `;


            tbody.appendChild(tr);

        });


        if (info) {

            info.textContent =
                `Menampilkan ${data.length} transaksi`;

        }


        renderSummary(data);

    };


    /* =====================================================
       MODAL
    ===================================================== */

    const bukaModal = (id) => {

        const modal =
            $(id);

        if (!modal) {
            return;
        }

        modal.classList.add(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

    };


    const tutupModal = (id) => {

        const modal =
            $(id);

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        if (
            !document.querySelector(
                ".modal-backdrop.is-open"
            )
        ) {

            document.body.classList.remove(
                "modal-open"
            );

        }

    };


    const tutupSemuaModal = () => {

        document
            .querySelectorAll(
                ".modal-backdrop.is-open"
            )
            .forEach(
                (modal) => {

                    modal.classList.remove(
                        "is-open"
                    );

                    modal.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }
            );

        document.body.classList.remove(
            "modal-open"
        );

    };


    /* =====================================================
       TAMBAH
    ===================================================== */

    const bukaTambah = () => {

        resetForm();

        isiPilihanIuran();

        bukaModal(
            "modalForm"
        );

    };


    /* =====================================================
       EDIT
    ===================================================== */

    const bukaEdit = (id) => {

        const trx =
            DATA_TRANSAKSI.find(
                (item) =>
                    String(item.id) === String(id)
            );


        if (!trx) {
            return;
        }


        modeForm = "edit";

        idSedangDiubah = id;


        const radio =
            document.querySelector(
                `input[name="jenisTransaksi"][value="${trx.jenis}"]`
            );


        if (radio) {
            radio.checked = true;
        }


        sesuaikanFormJenis();


        if ($("modalFormTitle")) {

            $("modalFormTitle").textContent =
                "Ubah Transaksi";

        }


        if ($("btnSimpanText")) {

            $("btnSimpanText").textContent =
                "Simpan Perubahan";

        }


        if (
            trx.jenis === "masuk"
        ) {

            isiPilihanIuran(trx.iuranId);

            if ($("inputSiswa")) {

                $("inputSiswa").value =
                    trx.id_siswa != null
                        ? trx.id_siswa
                        : "";

            }


            if ($("inputIuran")) {

                $("inputIuran").value =
                    trx.iuranId != null
                        ? trx.iuranId
                        : "";

            }


            // Tagihan diisi ulang dari data iuran asli, lalu info
            // pembayaran sebelumnya & sisa dihitung dari transaksi
            // database (baris yang diedit dikecualikan).
            updateNominalIuran();


            if ($("inputNominalBayar")) {

                $("inputNominalBayar").value =
                    new Intl.NumberFormat(
                        "id-ID"
                    ).format(
                        Number(
                            trx.nominal || 0
                        )
                    );

            }


            if ($("inputDiterima")) {

                $("inputDiterima").value =
                    new Intl.NumberFormat(
                        "id-ID"
                    ).format(
                        Number(
                            trx.diterima || 0
                        )
                    );

            }

        } else {

            if ($("inputNominalKeluar")) {

                $("inputNominalKeluar").value =
                    new Intl.NumberFormat(
                        "id-ID"
                    ).format(
                        Number(
                            trx.nominal || 0
                        )
                    );

            }

        }


        if ($("inputKategori")) {

            $("inputKategori").value =
                trx.kategori || "";

            // Samakan jenis dengan kategori transaksi yang dibuka
            // agar kombinasi tetap valid saat disimpan ulang.
            sesuaikanJenisKeKategori();

        }


        if ($("inputMetode")) {

            $("inputMetode").value =
                trx.metode || "";

        }


        if ($("inputTanggal")) {

            $("inputTanggal").value =
                trx.tanggal || "";

        }


        if ($("inputKeterangan")) {

            $("inputKeterangan").value =
                trx.keterangan || "";

        }


        hitungUangLive();

        bukaModal(
            "modalForm"
        );

    };


    /* =====================================================
       SAVE
    ===================================================== */

    /* =========================================================
       CATAT BANYAK TRANSAKSI (BENDAHARA)
    ========================================================= */
    let nomorBaris = 0;

    const formatNilaiInput = (nilai) => String(Math.max(0, Math.floor(Number(nilai) || 0)))
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    const isiPilihanSiswaBaris = (baris) => {
        const pilih = baris.querySelector(".baris-siswa");
        if (!pilih) return;

        pilih.innerHTML = `
            <option value="">- Tanpa siswa (kas umum) -</option>
            ${DATA_SISWA.map((siswa) => `
                <option value="${escapeHtml(siswa.id_siswa)}">
                    ${escapeHtml(siswa.nama)} • ${escapeHtml(siswa.nis)}
                </option>
            `).join("")}
        `;
    };

    /*
     * Iuran yang ditampilkan hanya iuran aktif yang berlaku untuk
     * siswa terpilih: iuran kelasnya sendiri atau iuran global
     * (id_kelas NULL). Baris tanpa siswa hanya menampilkan iuran global.
     */
    const isiPilihanIuranBaris = (baris, idTerpilih = "") => {
        const pilih = baris.querySelector(".baris-iuran");
        if (!pilih) return;

        const idSiswa = baris.querySelector(".baris-siswa")?.value || "";
        const siswa = DATA_SISWA.find(
            (item) => String(item.id_siswa) === String(idSiswa)
        );

        const daftar = DATA_IURAN.filter((iuran) => {
            if (iuran.status !== "aktif") return false;

            if (iuran.id_kelas === null || iuran.id_kelas === undefined) {
                return true;
            }

            return siswa
                && String(iuran.id_kelas) === String(siswa.id_kelas);
        });

        pilih.innerHTML = `
            <option value="">- Tanpa iuran -</option>
            ${daftar.map((iuran) => `
                <option value="${escapeHtml(iuran.id)}">
                    ${escapeHtml(iuran.nama)} • ${formatRupiah(iuran.nominal)}
                </option>
            `).join("")}
        `;

        if (idTerpilih && [...pilih.options].some(
            (option) => option.value === String(idTerpilih)
        )) {
            pilih.value = String(idTerpilih);
        }
    };

    /*
     * Saat iuran dipilih, nominal diisi dengan SISA tagihan siswa
     * untuk iuran tersebut (bukan nominal penuh), sehingga cicilan
     * sebelumnya tidak tertagih dua kali. Nilai tetap dapat diubah
     * menjadi pembayaran sebagian.
     */
    const isiNominalDariIuran = (baris) => {
        const idIuran = baris.querySelector(".baris-iuran")?.value || "";
        const idSiswa = baris.querySelector(".baris-siswa")?.value || "";
        const nominal = baris.querySelector(".baris-nominal");
        const sisaTagihanEl = baris.querySelector(".baris-sisa-tagihan");

        if (!idIuran || !idSiswa || !nominal || !sisaTagihanEl) return;

        const iuran = DATA_IURAN.find(
            (item) => String(item.id) === String(idIuran)
        );

        if (!iuran) {
            nominal.value = formatNilaiInput(0);
            sisaTagihanEl.value = "";
            return;
        }

        const tagihan = Number(iuran.nominal) || 0;

        // Sisa tagihan dihitung dari akumulasi transaksi pemasukan yang
        // sudah tercatat untuk pasangan (siswa, iuran). Ini mencegah
        // cicilan sebelumnya ikut tertagih dua kali.
        const terbayar = hitungTerbayar(idSiswa, idIuran);
        const sisa = Math.max(tagihan - terbayar, 0);

        nominal.value = formatNilaiInput(sisa);
        sisaTagihanEl.value = new Intl.NumberFormat("id-ID").format(sisa);
    };

    const sesuaikanBarisJenis = (baris) => {
        const jenis = baris.querySelector(".baris-jenis")?.value || "masuk";
        const siswa = baris.querySelector(".baris-siswa");
        const iuran = baris.querySelector(".baris-iuran");

        const pemasukan = jenis === "masuk";

        if (siswa) siswa.disabled = !pemasukan;
        if (iuran) iuran.disabled = !pemasukan;

        if (!pemasukan) {
            // Pengeluaran tidak boleh membawa relasi siswa/iuran.
            if (siswa) siswa.value = "";
            if (iuran) iuran.value = "";
        }

        isiPilihanIuranBaris(baris);
    };

    const barisBanyakHtml = (index) => `
        <div class="baris-transaksi" data-baris="${index}">
            <div class="baris-transaksi__head">
                <span class="baris-transaksi__nomor">Baris ${index + 1}</span>

                <button type="button" class="icon-btn icon-btn--hapus" data-hapus-baris
                    aria-label="Hapus baris ${index + 1}" title="Hapus baris">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>

            <div class="form-grid">
                <label class="field">
                    <span class="field__label">Data Siswa</span>
                    <select class="baris-siswa">
                        <option value="">- Tanpa siswa (kas umum) -</option>
                    </select>
                </label>

                <label class="field">
                    <span class="field__label">Iuran</span>
                    <select class="baris-iuran">
                        <option value="">- Tanpa iuran -</option>
                    </select>
                </label>

                <label class="field">
                    <span class="field__label">Jenis <b class="wajib">*</b></span>
                    <select class="baris-jenis">
                        <option value="masuk">Pemasukan</option>
                        <option value="keluar">Pengeluaran</option>
                    </select>
                </label>

                <label class="field">
                    <span class="field__label">Kategori <b class="wajib">*</b></span>
                    <select class="baris-kategori"></select>
                </label>

                <label class="field">
                    <span class="field__label">Tanggal <b class="wajib">*</b></span>
                    <input type="date" class="baris-tanggal">
                </label>

                <label class="field">
                    <span class="field__label">Sisa Tagihan</span>
                    <div class="money-input">
                        <span>Rp</span>
                        <input type="text" class="baris-sisa-tagihan" inputmode="numeric" placeholder="0" readonly>
                    </div>
                </label>

                <label class="field">
                    <span class="field__label">Nominal <b class="wajib">*</b></span>
                    <span class="input-uang">
                        <span class="input-uang__pre" aria-hidden="true">Rp</span>
                        <input type="text" class="baris-nominal" inputmode="numeric" placeholder="0" autocomplete="off">
                    </span>
                </label>

                <label class="field field--full">
                    <span class="field__label">Keterangan <b class="wajib">*</b></span>
                    <input type="text" class="baris-keterangan" placeholder="Contoh: setoran kas kelas" autocomplete="off">
                </label>
            </div>
        </div>
    `;

    const isiKategoriBaris = (baris) => {
        const jenis = baris.querySelector(".baris-jenis")?.value || "masuk";
        const pilih = baris.querySelector(".baris-kategori");
        if (!pilih) return;

        const daftar = jenis === "masuk" ? KATEGORI_MASUK : KATEGORI_KELUAR;
        const nilaiLama = pilih.value;

        pilih.innerHTML = daftar
            .map((k) => `<option value="${escapeHtml(k.value)}">${escapeHtml(k.label)}</option>`)
            .join("");

        if ([...pilih.options].some((o) => o.value === nilaiLama)) {
            pilih.value = nilaiLama;
        }
    };

    const tambahBarisTransaksi = () => {
        const wadah = $("isiBarisTransaksi");
        if (!wadah) return;

        const index = nomorBaris++;
        wadah.insertAdjacentHTML("beforeend", barisBanyakHtml(index));

        const baris = wadah.querySelector(`[data-baris="${index}"]`);
        if (!baris) return;

        isiPilihanSiswaBaris(baris);
        isiPilihanIuranBaris(baris);
        isiKategoriBaris(baris);

        const tanggal = baris.querySelector(".baris-tanggal");
        if (tanggal) {
            const d = new Date();
            tanggal.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }

        const nominal = baris.querySelector(".baris-nominal");
        nominal?.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        });

        const jenis = baris.querySelector(".baris-jenis");
        jenis?.addEventListener("change", () => {
            isiKategoriBaris(baris);
            sesuaikanBarisJenis(baris);
            // Reset sisa tagihan dan nominal when jenis changes
            const sisaEl = baris.querySelector(".baris-sisa-tagihan");
            if (sisaEl) sisaEl.value = "";
        });

        // Siswa menentukan iuran mana yang berlaku (kelasnya atau global).
        baris.querySelector(".baris-siswa")?.addEventListener("change", () => {
            isiPilihanIuranBaris(baris);
            isiNominalDariIuran(baris);
        });

        // Memilih iuran mengisi nominal dengan SISA tagihan; nilainya
        // tetap dapat diubah menjadi pembayaran sebagian (cicilan).
        baris.querySelector(".baris-iuran")?.addEventListener("change", () => {
            isiNominalDariIuran(baris);
        });

        // Update sisa tagihan ketika nominal berubah
        const nominalInput = baris.querySelector(".baris-nominal");
        const sisaEl = baris.querySelector(".baris-sisa-tagihan");
        if (nominalInput && sisaEl) {
            nominalInput.addEventListener("input", (e) => {
                const nominalBayar = parseAngka(nominalInput.value);
                const tagihanAwal = parseAngka(sisaEl.dataset.tagihanAwal || "0");
                const sisaBaru = Math.max(tagihanAwal - nominalBayar, 0);
                const kembalian = Math.max(nominalBayar - tagihanAwal, 0);
                sisaEl.value = new Intl.NumberFormat("id-ID").format(sisaBaru);
                // Simpan tagihan awal jika belum diset
                if (!sisaEl.dataset.tagihanAwal) {
                    sisaEl.dataset.tagihanAwal = tagihanAwal;
                }
                hitungUangLiveBaris(baris);
            });
        }

        const siswa = baris.querySelector(".baris-siswa");
        if (siswa) {
            siswa.focus();
        } else {
            baris.querySelector(".baris-keterangan")?.focus();
        }
    };

    const perbaruiNomorBaris = () => {
        const wadah = $("isiBarisTransaksi");
        if (!wadah) return;

        wadah.querySelectorAll(".baris-transaksi").forEach((baris, i) => {
            const label = baris.querySelector(".baris-transaksi__nomor");
            if (label) label.textContent = `Baris ${i + 1}`;
        });
    };

    const bukaFormBanyak = () => {
        const wadah = $("isiBarisTransaksi");
        if (!wadah) return;

        wadah.innerHTML = "";
        nomorBaris = 0;

        const kotakGalat = $("formBanyakError");
        if (kotakGalat) kotakGalat.hidden = true;

        tambahBarisTransaksi();
        bukaModal("modalFormBanyak");
    };

    const kumpulkanBaris = () => {
        const wadah = $("isiBarisTransaksi");
        if (!wadah) return { galat: ["Form tidak ditemukan"], data: [] };

        const galat = [];
        const data = [];

        wadah.querySelectorAll(".baris-transaksi").forEach((baris, i) => {
            const nomor = i + 1;
            const jenis = baris.querySelector(".baris-jenis")?.value || "masuk";
            const kategori = baris.querySelector(".baris-kategori")?.value || "";
            const tanggal = baris.querySelector(".baris-tanggal")?.value || "";
            const nominal = parseAngka(baris.querySelector(".baris-nominal")?.value || "");
            const keterangan = (baris.querySelector(".baris-keterangan")?.value || "").trim();

            const pemasukan = jenis === "masuk";

            // Relasi siswa/iuran hanya sah untuk pemasukan. Baris
            // pengeluaran selalu disimpan sebagai kas umum.
            const idSiswa = pemasukan
                ? (baris.querySelector(".baris-siswa")?.value || "")
                : "";
            const idIuran = pemasukan
                ? (baris.querySelector(".baris-iuran")?.value || "")
                : "";

            const siswa = idSiswa
                ? DATA_SISWA.find(
                    (item) => String(item.id_siswa) === String(idSiswa)
                )
                : null;

            if (!tanggal) galat.push(`Baris ${nomor}: tanggal wajib diisi`);
            if (!kategori) galat.push(`Baris ${nomor}: kategori wajib dipilih`);
            if (nominal <= 0) galat.push(`Baris ${nomor}: nominal wajib lebih dari 0`);
            if (!keterangan) galat.push(`Baris ${nomor}: keterangan wajib diisi`);

            // Iuran tidak boleh dicatat tanpa siswa karena sisa tagihan
            // tidak dapat dihitung dan riwayat tidak dapat dipisahkan.
            if (idIuran && !idSiswa) {
                galat.push(`Baris ${nomor}: pilih siswa untuk pembayaran iuran`);
            }

            if (tanggal && kategori && nominal > 0 && keterangan
                && !(idIuran && !idSiswa)) {
                data.push({
                    tanggal: `${tanggal} 00:00:00`,
                    jenis: pemasukan ? "pemasukan" : "pengeluaran",
                    kategori,
                    nominal,
                    uang_diterima: nominal,
                    keterangan,
                    metode: "CH",
                    id_siswa: idSiswa ? Number(idSiswa) : null,
                    id_iuran: idIuran ? Number(idIuran) : null,
                    id_kelas: siswa?.id_kelas ?? null,
                    nama_pembayar: siswa?.nama || ""
                });
            }
        });

        if (!data.length && !galat.length) {
            galat.push("Tambahkan minimal satu baris transaksi.");
        }

        return { galat, data };
    };

    const simpanBanyakTransaksi = async (e) => {
        e.preventDefault();

        const kotakGalat = $("formBanyakError");
        const { galat, data } = kumpulkanBaris();

        if (galat.length) {
            if (kotakGalat) {
                kotakGalat.textContent = galat.join(" • ");
                kotakGalat.hidden = false;
            }
            return;
        }

        if (kotakGalat) kotakGalat.hidden = true;

        const tombol = $("btnSimpanBanyak");

        const pemulihanTombol = kunciTombolSimpan(tombol);
        if (!pemulihanTombol) return;

        try {
            const hasil = await kirimJSON(API_TRANSAKSI, "POST", { transaksi: data });

            const jumlah = hasil.jumlah ?? data.length;
            const kelompok = hasil.no_bukti_per_siswa
                ? Object.keys(hasil.no_bukti_per_siswa).length
                : 1;

            tutupModal("modalFormBanyak");

            tampilkanToast(
                kelompok > 1
                    ? `${jumlah} transaksi dicatat untuk ${kelompok} siswa/grup`
                    : `${jumlah} transaksi berhasil dicatat`
            );

            await muatData();
        } catch (error) {
            if (kotakGalat) {
                kotakGalat.textContent = error?.message || "Gagal menyimpan transaksi.";
                kotakGalat.hidden = false;
            }
        } finally {
            pemulihanTombol.pulihkan();
        }
    };

    const simpanTransaksi = async () => {

        // S3-07: kunci tombol simpan saat proses (teks
        // "Memproses...", tidak dapat diklik dua kali via klik maupun
        // Enter). null = masih diproses, boleh henti.
        const tombolSimpan = $("formTransaksi")?.querySelector(
            'button[type="submit"]'
        );

        const pemulihanTombol = kunciTombolSimpan(tombolSimpan);

        if (!pemulihanTombol) return;

        try {

        const data =
            ambilDataForm();


        if (
            !validateForm(data)
        ) {
            return;
        }


        const isMasuk =
            data.jenis === "masuk";


        // Pemasukan: nominal yang dicatat adalah pembayaran SAAT INI
        // (boleh cicilan/sebagian), bukan seluruh tagihan.
        const nominal =
            isMasuk
                ? data.nominalBayar
                : data.nominalKeluar;


        const payload = {

            id_siswa:
                isMasuk && data.siswa
                    ? data.siswa.id_siswa
                    : null,

            id_iuran:
                isMasuk && data.iuran
                    ? data.iuran.id
                    : null,

            tanggal: `${data.tanggal} 00:00:00`,

            nominal,

            keterangan:
                data.keterangan ||
                (
                    isMasuk
                        ? "Pembayaran iuran"
                        : "Pengeluaran kas"
                ),

            nama_pembayar:
                isMasuk && data.siswa
                    ? data.siswa.nama
                    : "",

            metode:
                data.metode === "Transfer"
                    ? "TF"
                    : "CH",

            jenis:
                isMasuk ? "pemasukan" : "pengeluaran",

            kategori:
                data.kategori || null,

            periode: "",

            uang_diterima:
                isMasuk
                    ? data.diterima
                    : nominal,

            kembalian: 0

        };


        try {

            if (modeForm === "edit") {

                const trx =
                    DATA_TRANSAKSI.find(
                        (item) =>
                            String(item.id) === String(idSedangDiubah)
                    );

                if (!trx) {
                    return;
                }

                await kirimJSON(
                    `${API_TRANSAKSI}/${trx.id_transaksi}`,
                    "PUT",
                    payload
                );

                tampilkanToast(
                    "Transaksi berhasil diperbarui."
                );

            } else {

                await kirimJSON(
                    API_TRANSAKSI,
                    "POST",
                    payload
                );

                tampilkanToast(
                    "Transaksi berhasil ditambahkan."
                );

            }

        } catch (error) {

            const errorBox =
                $("formError");

            if (errorBox) {

                errorBox.textContent =
                    error.message;

                errorBox.hidden = false;

            }

            return;

        }


        await muatData();

        tutupModal(
            "modalForm"
        );

        resetForm();

        } finally {
            // S3-07: tombol pulih setelah proses apa pun berakhir
            // (sukses, gagal validasi, maupun galat server).
            pemulihanTombol.pulihkan();
        }

    };


    /* =====================================================
       DETAIL
    ===================================================== */

    const bukaDetail = (id) => {

        const trx =
            DATA_TRANSAKSI.find(
                (item) =>
                    String(item.id) === String(id)
            );


        if (!trx) {
            return;
        }


        const isMasuk =
            trx.jenis === "masuk";


        if ($("modalDetailTitle")) {

            $("modalDetailTitle").textContent =
                trx.id;

        }


        if ($("detailJenis")) {

            $("detailJenis").textContent =
                isMasuk
                    ? "Pemasukan"
                    : "Pengeluaran";

        }


        if ($("detailMetode")) {

            $("detailMetode").textContent =
                trx.metode || "-";

        }


        if ($("detailKategori")) {

            $("detailKategori").textContent =
                labelKategori(trx.kategori);

        }


        if ($("detailSiswa")) {

            $("detailSiswa").textContent =
                isMasuk
                    ? `${trx.siswa || "-"} (${trx.nis || "-"})`
                    : "-";

        }


        if ($("detailIuran")) {

            $("detailIuran").textContent =
                isMasuk
                    ? trx.iuran || "-"
                    : "-";

        }


        if ($("detailTanggal")) {

            $("detailTanggal").textContent =
                formatTanggal(
                    trx.tanggal
                );

        }


        if ($("detailPetugas")) {

            $("detailPetugas").textContent =
                trx.petugas ||
                "-";

        }


        if ($("detailKeterangan")) {

            $("detailKeterangan").textContent =
                trx.keterangan ||
                "Tidak ada keterangan.";

        }


        const detailSiswaItem =
            $("detailSiswaItem");

        const detailIuranItem =
            $("detailIuranItem");

        const detailUangRincian =
            $("detailUangRincian");


        if (detailSiswaItem) {
            detailSiswaItem.hidden =
                !isMasuk;
        }


        if (detailIuranItem) {
            detailIuranItem.hidden =
                !isMasuk;
        }


        if (detailUangRincian) {
            detailUangRincian.hidden =
                !isMasuk;
        }


        if ($("rincianTagihan")) {

            $("rincianTagihan").textContent =
                formatRupiah(
                    trx.nominal
                );

        }


        if ($("rincianDiterima")) {

            $("rincianDiterima").textContent =
                formatRupiah(
                    trx.diterima
                );

        }


        if ($("rincianKembalian")) {

            $("rincianKembalian").textContent =
                formatRupiah(
                    trx.kembalian
                );

        }


        if ($("rincianMasukKas")) {

            $("rincianMasukKas").textContent =
                formatRupiah(
                    trx.masukKas
                );

        }


        bukaModal(
            "modalDetail"
        );

    };


    /* =====================================================
       DELETE
    ===================================================== */

    const bukaHapus = (id) => {

        const trx =
            DATA_TRANSAKSI.find(
                (item) =>
                    String(item.id) === String(id)
            );


        if (!trx) {
            return;
        }


        idSedangDihapus =
            id;


        const text =
            $("hapusText");


        if (text) {

            text.textContent =
                `Hapus ${trx.id}`;

        }


        bukaModal(
            "modalHapus"
        );

    };


    const konfirmasiHapus = async () => {

        if (!idSedangDihapus) {
            return;
        }


        const trx =
            DATA_TRANSAKSI.find(
                (item) =>
                    String(item.id) === String(idSedangDihapus)
            );


        if (!trx) {
            tutupModal("modalHapus");
            idSedangDihapus = null;
            return;
        }


        try {

            await hapusJSON(
                `${API_TRANSAKSI}/${trx.id_transaksi}`
            );

        } catch (error) {

            tampilkanToast(
                error.message
            );

            return;

        }


        const id =
            idSedangDihapus;


        idSedangDihapus =
            null;


        tutupModal(
            "modalHapus"
        );


        await muatData();


        tampilkanToast(
            `${id} berhasil dihapus.`
        );

    };


    /* =====================================================
       TOAST
    ===================================================== */

    const tampilkanToast = (message) => {

        const toast =
            $("toast");

        const toastText =
            $("toastText");


        if (
            !toast ||
            !toastText
        ) {
            return;
        }


        toastText.textContent =
            message;


        toast.classList.add(
            "is-muncul"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "is-muncul"
                    );

                },
                2600
            );

    };


    /* =====================================================
       FILTER RESET
    ===================================================== */

    const resetFilter = () => {

        if ($("cariTransaksi")) {
            $("cariTransaksi").value = "";
        }


        if ($("filterJenis")) {
            $("filterJenis").value =
                "semua";
        }


        if ($("filterKategori")) {
            $("filterKategori").value =
                "semua";
        }


        if ($("filterBulan")) {
            $("filterBulan").value =
                "semua";
        }


        renderTable();

    };


    /* =====================================================
       SIDEBAR
    ===================================================== */

    const pasangSidebar = () => {

        const toggle =
            $("sidebarToggle");

        const backdrop =
            $("sidebarBackdrop");

        const sidebar =
            $("sidebar");


        const bukaSidebar = () => {

            document.body.classList.add(
                "nav-open"
            );

        };


        const tutupSidebar = () => {

            document.body.classList.remove(
                "nav-open"
            );

        };


        if (toggle) {

            toggle.addEventListener(
                "click",
                () => {

                    if (
                        document.body.classList.contains(
                            "nav-open"
                        )
                    ) {

                        tutupSidebar();

                    } else {

                        bukaSidebar();

                    }

                }
            );

        }


        if (backdrop) {

            backdrop.addEventListener(
                "click",
                tutupSidebar
            );

        }


        if (sidebar) {

            sidebar
                .querySelectorAll(
                    ".side-link"
                )
                .forEach(
                    (link) => {

                        link.addEventListener(
                            "click",
                            () => {

                                tutupSidebar();

                            }
                        );

                    }
                );

        }


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 1024
                ) {

                    tutupSidebar();

                }

            }
        );

    };


    /* =====================================================
       PROFILE
    ===================================================== */

    const pasangProfile = () => {

        const button =
            $("profileButton");

        const dropdown =
            $("profileDropdown");


        if (
            !button ||
            !dropdown
        ) {
            return;
        }


        button.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                const isOpen =
                    dropdown.classList.toggle(
                        "is-open"
                    );


                button.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        document.addEventListener(
            "click",
            (event) => {

                if (
                    !dropdown.contains(
                        event.target
                    ) &&
                    !button.contains(
                        event.target
                    )
                ) {

                    dropdown.classList.remove(
                        "is-open"
                    );

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const pasangLogout = () => {

        const sidebarLogout =
            $("sidebarLogout");

        const dropdownLogout =
            $("dropdownLogout");


        const logout = () => {

            window.location.href = "/logout";

        };


        if (sidebarLogout) {

            sidebarLogout.addEventListener(
                "click",
                logout
            );

        }


        if (dropdownLogout) {

            dropdownLogout.addEventListener(
                "click",
                logout
            );

        }

    };


    /* =====================================================
       EVENTS
    ===================================================== */

    const pasangEvent = () => {

        const search =
            $("cariTransaksi");

        const filterJenis =
            $("filterJenis");

        const filterKategori =
            $("filterKategori");

        const filterBulan =
            $("filterBulan");

        const reset =
            $("btnResetFilter");

        const tampilSemua =
            $("btnKosongkanFilter");

        const tambah =
            $("btnTambahTransaksi");

        const inputSiswa =
            $("inputSiswa");

        const inputIuran =
            $("inputIuran");

        const inputDiterima =
            $("inputDiterima");

        const inputNominalBayar =
            $("inputNominalBayar");

        const inputNominalKeluar =
            $("inputNominalKeluar");

        const form =
            $("formTransaksi");

        const tbody =
            $("isiTabelTransaksi");

        const konfirmasi =
            $("btnKonfirmasiHapus");


        if (search) {

            search.addEventListener(
                "input",
                renderTable
            );

        }


        if (filterJenis) {

            filterJenis.addEventListener(
                "change",
                renderTable
            );

        }


        if (filterKategori) {

            filterKategori.addEventListener(
                "change",
                renderTable
            );

        }


        if (filterBulan) {

            filterBulan.addEventListener(
                "change",
                renderTable
            );

        }


        if (reset) {

            reset.addEventListener(
                "click",
                resetFilter
            );

        }


        if (tampilSemua) {

            tampilSemua.addEventListener(
                "click",
                resetFilter
            );

        }


        if (tambah) {

            tambah.addEventListener(
                "click",
                bukaTambah
            );

        }

        const catatBanyak =
            $("btnTambahBanyak");

        if (catatBanyak) {

            catatBanyak.addEventListener(
                "click",
                bukaFormBanyak
            );

        }

        $("btnTambahBaris")?.addEventListener(
            "click",
            tambahBarisTransaksi
        );

        $("isiBarisTransaksi")?.addEventListener(
            "click",
            (e) => {

                const tombol =
                    e.target.closest(
                        "[data-hapus-baris]"
                    );

                if (!tombol) return;

                const baris =
                    tombol.closest(
                        ".baris-transaksi"
                    );

                if (!baris) return;

                const jumlah =
                    $("isiBarisTransaksi")
                        ?.querySelectorAll(
                            ".baris-transaksi"
                        ).length || 0;

                if (jumlah <= 1) {

                    tampilkanToast(
                        "Minimal satu baris transaksi harus ada."
                    );

                    return;

                }

                baris.remove();
                perbaruiNomorBaris();

            }
        );

        $("formTransaksiBanyak")?.addEventListener(
            "submit",
            simpanBanyakTransaksi
        );


        document
            .querySelectorAll(
                'input[name="jenisTransaksi"]'
            )
            .forEach(
                (radio) => {

                    radio.addEventListener(
                        "change",
                        () => {

                            // Saat jenis diganti, kategori dipindah ke
                            // kategori pertama yang sah untuk jenis itu
                            // agar kombinasi tetap valid di server.
                            pilihKategoriPertamaSesuaiJenis();

                            sesuaikanFormJenis();

                        }
                    );

                }
            );


        // Saat pengguna memilih kategori, jenis ikut menyesuaikan.
        $("inputKategori")?.addEventListener(
            "change",
            sesuaikanJenisKeKategori
        );


        if (inputSiswa) {

            // Siswa berganti → pembayaran sebelumnya & sisa tagihan
            // dihitung ulang dari data transaksi asli.
            inputSiswa.addEventListener(
                "change",
                perbaruiInfoPembayaran
            );

        }


        if (inputIuran) {

            inputIuran.addEventListener(
                "change",
                updateNominalIuran
            );

        }


        if (inputNominalBayar) {

            inputNominalBayar.addEventListener(
                "input",
                () => {

                    formatTeksUang(
                        inputNominalBayar
                    );

                    hitungUangLive();

                }
            );

        }


        if (inputDiterima) {

            inputDiterima.addEventListener(
                "input",
                () => {

                    formatTeksUang(
                        inputDiterima
                    );

                    hitungUangLive();

                }
            );

        }


        if (inputNominalKeluar) {

            inputNominalKeluar.addEventListener(
                "input",
                () => {

                    formatTeksUang(
                        inputNominalKeluar
                    );

                }
            );

        }


        if (form) {

            form.addEventListener(
                "submit",
                (event) => {

                    event.preventDefault();

                    simpanTransaksi();

                }
            );

        }


        if (tbody) {

            tbody.addEventListener(
                "click",
                (event) => {

                    const button =
                        event.target.closest(
                            "[data-aksi]"
                        );


                    if (!button) {
                        return;
                    }


                    const aksi =
                        button.dataset.aksi;

                    const id =
                        button.dataset.id;


                    if (
                        aksi === "detail"
                    ) {

                        bukaDetail(id);

                    }


                    if (
                        aksi === "ubah"
                    ) {

                        bukaEdit(id);

                    }


                    if (
                        aksi === "hapus"
                    ) {

                        bukaHapus(id);

                    }

                }
            );

        }


        if (konfirmasi) {

            konfirmasi.addEventListener(
                "click",
                konfirmasiHapus
            );

        }


        document
            .querySelectorAll(
                "[data-tutup-modal]"
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        tutupSemuaModal
                    );

                }
            );


        document
            .querySelectorAll(
                ".modal-backdrop"
            )
            .forEach(
                (modal) => {

                    modal.addEventListener(
                        "click",
                        (event) => {

                            if (
                                event.target === modal
                            ) {

                                tutupSemuaModal();

                            }

                        }
                    );

                }
            );


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape"
                ) {

                    tutupSemuaModal();

                    document.body.classList.remove(
                        "nav-open"
                    );

                }

            }
        );

    };


    /* =====================================================
       MUAT DATA DARI DATABASE
    ===================================================== */

    const muatData = async () => {

        const tbodyBend = $("isiTabelTransaksi");
        if (tbodyBend) {
            tbodyBend.innerHTML = Array.from({ length: 5 })
                .map(() => `<tr class="skeleton-row"><td colspan="9"><div class="skeleton skeleton-text--lg"></div></td></tr>`)
                .join("");
        }

        let hasilSiswa = { data: [] };
        let hasilIuran = { data: [] };
        let hasilTransaksi = { data: [] };

        try {

            [hasilSiswa, hasilIuran, hasilTransaksi] =
                await Promise.all([
                    ambilJSON(API_SISWA),
                    ambilJSON(API_IURAN),
                    ambilJSON(API_TRANSAKSI)
                ]);

        } catch (error) {

            console.error(error);

            tampilkanToast(error.message);

            return;

        }

        DATA_SISWA = (Array.isArray(hasilSiswa?.data)
            ? hasilSiswa.data
            : []
        ).map(petakanSiswa);

        DATA_IURAN = (Array.isArray(hasilIuran?.data)
            ? hasilIuran.data
            : []
        ).map(petakanIuran);

        DATA_TRANSAKSI = (
            Array.isArray(hasilTransaksi?.data)
                ? hasilTransaksi.data
                : []
        ).map(petakanTransaksi);

        isiPilihanSiswa();

        isiPilihanIuran();

        renderTable();

    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    csrfToken = bacaCsrf();

    updateTanggal();

    isiPilihanSiswa();

    isiPilihanIuran();

    isiKategoriFilter();

    pasangSidebar();

    pasangProfile();

    pasangLogout();

    pasangEvent();

    sesuaikanFormJenis();

    renderTable();

    resetForm();

    // Ambil daftar kategori dari server lebih dulu (sumber tunggal),
    // lalu muat data. Bila gagal, daftar cadangan tetap dipakai.
    muatKategori().finally(muatData);

});
