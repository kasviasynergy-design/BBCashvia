/* =========================================================
   BBCASHVIA — BENDAHARA TRANSAKSI
   FRONTEND SIMULASI
========================================================= */

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
            return "—";
        }

        const date =
            new Date(`${tanggal}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return tanggal;
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
       DATA DEMO SISWA
    ===================================================== */

    const DATA_SISWA = [
        {
            nis: "24001",
            nama: "Ahmad Fauzan",
            kelas: "XI RPL 1"
        },
        {
            nis: "24002",
            nama: "Aisyah Putri",
            kelas: "XI RPL 1"
        },
        {
            nis: "24003",
            nama: "Bagas Pratama",
            kelas: "XI RPL 1"
        },
        {
            nis: "24004",
            nama: "Citra Lestari",
            kelas: "XI RPL 1"
        },
        {
            nis: "24005",
            nama: "Dimas Saputra",
            kelas: "XI RPL 1"
        },
        {
            nis: "24006",
            nama: "Eka Ramadhan",
            kelas: "XI RPL 1"
        },
        {
            nis: "24007",
            nama: "Fajar Nugraha",
            kelas: "XI RPL 1"
        },
        {
            nis: "24008",
            nama: "Gina Maharani",
            kelas: "XI RPL 1"
        },
        {
            nis: "24009",
            nama: "Hafiz Ramadhan",
            kelas: "XI RPL 1"
        },
        {
            nis: "24010",
            nama: "Intan Permata",
            kelas: "XI RPL 1"
        },
        {
            nis: "24011",
            nama: "Joko Prasetyo",
            kelas: "XI RPL 1"
        },
        {
            nis: "24012",
            nama: "Kania Safitri",
            kelas: "XI RPL 1"
        },
        {
            nis: "24013",
            nama: "Luthfi Maulana",
            kelas: "XI RPL 1"
        },
        {
            nis: "24014",
            nama: "Maya Sari",
            kelas: "XI RPL 1"
        },
        {
            nis: "24015",
            nama: "Nanda Akbar",
            kelas: "XI RPL 1"
        },
        {
            nis: "24016",
            nama: "Olivia Maharani",
            kelas: "XI RPL 1"
        }
    ];


    /* =====================================================
       DATA DEMO IURAN
    ===================================================== */

    const DATA_IURAN = [
        {
            id: "IUR-001",
            nama: "Iuran Kas Oktober",
            periode: "Oktober 2026",
            nominal: 10000
        },
        {
            id: "IUR-002",
            nama: "Iuran Kas September",
            periode: "September 2026",
            nominal: 10000
        },
        {
            id: "IUR-003",
            nama: "Iuran Kegiatan Kelas",
            periode: "Kegiatan 2026",
            nominal: 25000
        }
    ];


    /* =====================================================
       DATA DEMO TRANSAKSI
    ===================================================== */

    let DATA_TRANSAKSI = [

        {
            id: "TRX-001",
            jenis: "masuk",
            nis: "24001",
            siswa: "Ahmad Fauzan",
            iuranId: "IUR-001",
            iuran: "Iuran Kas Oktober",
            kategori: "Iuran Kas",
            nominal: 10000,
            diterima: 10000,
            kembalian: 0,
            masukKas: 10000,
            metode: "Tunai",
            tanggal: "2026-10-01",
            keterangan: "Pembayaran kas bulan Oktober",
            petugas: "Bendahara"
        },

        {
            id: "TRX-002",
            jenis: "masuk",
            nis: "24002",
            siswa: "Aisyah Putri",
            iuranId: "IUR-001",
            iuran: "Iuran Kas Oktober",
            kategori: "Iuran Kas",
            nominal: 10000,
            diterima: 20000,
            kembalian: 10000,
            masukKas: 10000,
            metode: "Tunai",
            tanggal: "2026-10-02",
            keterangan: "Pembayaran kas bulan Oktober",
            petugas: "Bendahara"
        },

        {
            id: "TRX-003",
            jenis: "masuk",
            nis: "24003",
            siswa: "Bagas Pratama",
            iuranId: "IUR-001",
            iuran: "Iuran Kas Oktober",
            kategori: "Iuran Kas",
            nominal: 10000,
            diterima: 10000,
            kembalian: 0,
            masukKas: 10000,
            metode: "Transfer",
            tanggal: "2026-10-02",
            keterangan: "Pembayaran melalui transfer",
            petugas: "Bendahara"
        },

        {
            id: "TRX-004",
            jenis: "masuk",
            nis: "24004",
            siswa: "Citra Lestari",
            iuranId: "IUR-002",
            iuran: "Iuran Kas September",
            kategori: "Iuran Kas",
            nominal: 10000,
            diterima: 10000,
            kembalian: 0,
            masukKas: 10000,
            metode: "Transfer",
            tanggal: "2026-09-30",
            keterangan: "Pembayaran kas bulan September",
            petugas: "Bendahara"
        },

        {
            id: "TRX-005",
            jenis: "masuk",
            nis: "24005",
            siswa: "Dimas Saputra",
            iuranId: "IUR-003",
            iuran: "Iuran Kegiatan Kelas",
            kategori: "Iuran Kegiatan",
            nominal: 25000,
            diterima: 30000,
            kembalian: 5000,
            masukKas: 25000,
            metode: "Tunai",
            tanggal: "2026-10-03",
            keterangan: "Iuran kegiatan kelas",
            petugas: "Bendahara"
        },

        {
            id: "TRX-006",
            jenis: "masuk",
            nis: "24006",
            siswa: "Eka Ramadhan",
            iuranId: "IUR-001",
            iuran: "Iuran Kas Oktober",
            kategori: "Iuran Kas",
            nominal: 10000,
            diterima: 10000,
            kembalian: 0,
            masukKas: 10000,
            metode: "Transfer",
            tanggal: "2026-10-04",
            keterangan: "Pembayaran kas bulan Oktober",
            petugas: "Bendahara"
        },

        {
            id: "TRX-007",
            jenis: "keluar",
            nis: "",
            siswa: "",
            iuranId: "",
            iuran: "",
            kategori: "Kegiatan Kelas",
            nominal: 150000,
            diterima: 0,
            kembalian: 0,
            masukKas: 0,
            metode: "Tunai",
            tanggal: "2026-10-04",
            keterangan: "Pembelian perlengkapan kegiatan kelas",
            petugas: "Bendahara"
        },

        {
            id: "TRX-008",
            jenis: "keluar",
            nis: "",
            siswa: "",
            iuranId: "",
            iuran: "",
            kategori: "Perlengkapan",
            nominal: 75000,
            diterima: 0,
            kembalian: 0,
            masukKas: 0,
            metode: "Transfer",
            tanggal: "2026-10-04",
            keterangan: "Pembelian perlengkapan kelas",
            petugas: "Bendahara"
        }

    ];


    /* =====================================================
       STATE
    ===================================================== */

    let modeForm = "tambah";

    let idSedangDiubah = null;

    let idSedangDihapus = null;

    let toastTimer = null;


    /* =====================================================
       KATEGORI
    ===================================================== */

    const KATEGORI_MASUK = [
        "Iuran Kas",
        "Iuran Kegiatan",
        "Pemasukan Lainnya"
    ];


    const KATEGORI_KELUAR = [
        "Kegiatan Kelas",
        "Perlengkapan",
        "Konsumsi",
        "Transportasi",
        "Pengeluaran Lainnya"
    ];


    /* =====================================================
       CALCULATION
    ===================================================== */

    const hitungKembalian = (
        tagihan,
        diterima
    ) => {

        const total =
            Number(tagihan) || 0;

        const bayar =
            Number(diterima) || 0;

        return Math.max(
            bayar - total,
            0
        );

    };


    const hitungMasukKas = (
        tagihan,
        diterima
    ) => {

        const total =
            Number(tagihan) || 0;

        const bayar =
            Number(diterima) || 0;

        return Math.min(
            total,
            bayar
        );

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
                siswa.nis;

            option.textContent =
                `${siswa.nama} — ${siswa.nis}`;

            select.appendChild(option);

        });

    };


    /* =====================================================
       SELECT IURAN
    ===================================================== */

    const isiPilihanIuran = () => {

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

        DATA_IURAN.forEach((iuran) => {

            const option =
                document.createElement("option");

            option.value =
                iuran.id;

            option.textContent =
                `${iuran.nama} — ${formatRupiah(iuran.nominal)}`;

            select.appendChild(option);

        });

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

        const jenis =
            document.querySelector(
                'input[name="jenisTransaksi"]:checked'
            )?.value || "masuk";

        const daftar =
            jenis === "keluar"
                ? KATEGORI_KELUAR
                : KATEGORI_MASUK;

        const nilaiSebelumnya =
            select.value;

        select.innerHTML = `
            <option value="">
                Pilih kategori
            </option>
        `;

        daftar.forEach((kategori) => {

            const option =
                document.createElement("option");

            option.value =
                kategori;

            option.textContent =
                kategori;

            select.appendChild(option);

        });

        if (daftar.includes(nilaiSebelumnya)) {
            select.value =
                nilaiSebelumnya;
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
                kategori;

            option.textContent =
                kategori;

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
                    item.id === inputIuran.value
            );

        if (!selected) {

            inputTagihan.value = "";

            hitungUangLive();

            return;

        }

        inputTagihan.value =
            new Intl.NumberFormat("id-ID")
                .format(selected.nominal);

        hitungUangLive();

    };


    /* =====================================================
       LIVE MONEY
    ===================================================== */

    const hitungUangLive = () => {

        const inputTagihan =
            $("inputTagihan");

        const inputDiterima =
            $("inputDiterima");

        const hasilKembalian =
            $("hasilKembalian");

        const hasilMasukKas =
            $("hasilMasukKas");

        const uangHint =
            $("uangHint");

        if (
            !inputTagihan ||
            !inputDiterima ||
            !hasilKembalian ||
            !hasilMasukKas
        ) {
            return;
        }

        const tagihan =
            parseAngka(
                inputTagihan.value
            );

        const diterima =
            parseAngka(
                inputDiterima.value
            );

        const kembalian =
            hitungKembalian(
                tagihan,
                diterima
            );

        const masukKas =
            hitungMasukKas(
                tagihan,
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

            if (
                tagihan > 0 &&
                diterima > 0 &&
                diterima < tagihan
            ) {

                uangHint.textContent =
                    `Uang diterima masih kurang ${formatRupiah(tagihan - diterima)}.`;

                uangHint.classList.add(
                    "is-peringatan"
                );

            } else if (
                tagihan > 0 &&
                diterima >= tagihan
            ) {

                uangHint.textContent =
                    `Kembalian ${formatRupiah(kembalian)} dan uang yang masuk ke kas ${formatRupiah(masukKas)}.`;

            } else {

                uangHint.textContent =
                    "Masukkan jumlah uang yang diterima bendahara untuk menghitung kembalian.";

            }

        }

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

        hitungUangLive();

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
                    item.nis === siswaNis
            );


        const iuran =
            DATA_IURAN.find(
                (item) =>
                    item.id === iuranId
            );


        return {

            jenis,

            siswa,

            iuran,

            tagihan,

            diterima,

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


            if (!data.tagihan) {

                showError(
                    "Nominal tagihan belum tersedia."
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
                data.tagihan
            ) {

                showError(
                    "Jumlah uang yang diterima masih kurang dari nominal tagihan."
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
                    trx.kategori === kategori;


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
                                    trx.siswa || "—"
                                )}
                            </strong>

                            <small>
                                NIS ${escapeHtml(
                                    trx.nis || "—"
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
                        `Kategori: ${trx.kategori || "—"}`
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
                            trx.tanggal || "—"
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
                    item.id === id
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

            if ($("inputSiswa")) {

                $("inputSiswa").value =
                    trx.nis || "";

            }


            if ($("inputIuran")) {

                $("inputIuran").value =
                    trx.iuranId || "";

            }


            if ($("inputTagihan")) {

                $("inputTagihan").value =
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

    const simpanTransaksi = () => {

        const data =
            ambilDataForm();


        if (
            !validateForm(data)
        ) {
            return;
        }


        const isMasuk =
            data.jenis === "masuk";


        const kembalian =
            isMasuk
                ? hitungKembalian(
                    data.tagihan,
                    data.diterima
                )
                : 0;


        const masukKas =
            isMasuk
                ? hitungMasukKas(
                    data.tagihan,
                    data.diterima
                )
                : 0;


        const nominal =
            isMasuk
                ? data.tagihan
                : data.nominalKeluar;


        if (
            modeForm === "edit"
        ) {

            const index =
                DATA_TRANSAKSI.findIndex(
                    (item) =>
                        item.id === idSedangDiubah
                );


            if (
                index !== -1
            ) {

                const dataLama =
                    DATA_TRANSAKSI[index];


                DATA_TRANSAKSI[index] = {

                    ...dataLama,

                    jenis:
                        data.jenis,

                    nis:
                        isMasuk
                            ? data.siswa.nis
                            : "",

                    siswa:
                        isMasuk
                            ? data.siswa.nama
                            : "",

                    iuranId:
                        isMasuk
                            ? data.iuran.id
                            : "",

                    iuran:
                        isMasuk
                            ? data.iuran.nama
                            : "",

                    kategori:
                        data.kategori,

                    nominal,

                    diterima:
                        isMasuk
                            ? data.diterima
                            : 0,

                    kembalian,

                    masukKas,

                    metode:
                        data.metode,

                    tanggal:
                        data.tanggal,

                    keterangan:
                        data.keterangan ||
                        (
                            isMasuk
                                ? "Pembayaran iuran"
                                : "Pengeluaran kas"
                        )

                };

            }


            tampilkanToast(
                "Transaksi berhasil diperbarui."
            );

        } else {

            const nomor =
                DATA_TRANSAKSI.length + 1;


            const id =
                `TRX-${String(
                    nomor
                ).padStart(
                    3,
                    "0"
                )}`;


            DATA_TRANSAKSI.unshift({

                id,

                jenis:
                    data.jenis,

                nis:
                    isMasuk
                        ? data.siswa.nis
                        : "",

                siswa:
                    isMasuk
                        ? data.siswa.nama
                        : "",

                iuranId:
                    isMasuk
                        ? data.iuran.id
                        : "",

                iuran:
                    isMasuk
                        ? data.iuran.nama
                        : "",

                kategori:
                    data.kategori,

                nominal,

                diterima:
                    isMasuk
                        ? data.diterima
                        : 0,

                kembalian,

                masukKas,

                metode:
                    data.metode,

                tanggal:
                    data.tanggal,

                keterangan:
                    data.keterangan ||
                    (
                        isMasuk
                            ? "Pembayaran iuran"
                            : "Pengeluaran kas"
                    ),

                petugas:
                    "Bendahara"

            });


            tampilkanToast(
                "Transaksi berhasil ditambahkan."
            );

        }


        renderTable();

        tutupModal(
            "modalForm"
        );

        resetForm();

    };


    /* =====================================================
       DETAIL
    ===================================================== */

    const bukaDetail = (id) => {

        const trx =
            DATA_TRANSAKSI.find(
                (item) =>
                    item.id === id
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
                trx.metode || "—";

        }


        if ($("detailKategori")) {

            $("detailKategori").textContent =
                trx.kategori || "—";

        }


        if ($("detailSiswa")) {

            $("detailSiswa").textContent =
                isMasuk
                    ? `${trx.siswa || "—"} (${trx.nis || "—"})`
                    : "—";

        }


        if ($("detailIuran")) {

            $("detailIuran").textContent =
                isMasuk
                    ? trx.iuran || "—"
                    : "—";

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
                "Bendahara";

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
                    item.id === id
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


    const konfirmasiHapus = () => {

        if (!idSedangDihapus) {
            return;
        }


        const index =
            DATA_TRANSAKSI.findIndex(
                (item) =>
                    item.id === idSedangDihapus
            );


        if (index === -1) {
            return;
        }


        DATA_TRANSAKSI.splice(
            index,
            1
        );


        const id =
            idSedangDihapus;


        idSedangDihapus =
            null;


        tutupModal(
            "modalHapus"
        );


        renderTable();


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

            window.location.href =
                "/";

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

        const inputIuran =
            $("inputIuran");

        const inputDiterima =
            $("inputDiterima");

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


        document
            .querySelectorAll(
                'input[name="jenisTransaksi"]'
            )
            .forEach(
                (radio) => {

                    radio.addEventListener(
                        "change",
                        sesuaikanFormJenis
                    );

                }
            );


        if (inputIuran) {

            inputIuran.addEventListener(
                "change",
                updateNominalIuran
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
       INITIALIZE
    ===================================================== */

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

});
