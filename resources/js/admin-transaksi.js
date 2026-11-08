/* ============================================================
   BBCASHVIA - HALAMAN TRANSAKSI (ADMIN)
   Data transaksi berasal dari API Laravel (database sungguhan).
   Tidak menggunakan data dummy.
   ============================================================ */
// S3-07: modul bersama pengaman simpan ganda (anti-double-click
// + kunci idempotensi yang dibaca oleh guard backend).
import {
    beriKunciIdempoten,
    kunciTombolSimpan,
} from "./simpan-guard.js";

(function () {
    "use strict";

    const API_URL = "/admin/api/transaksi";
    const API_KATEGORI = "/admin/api/transaksi/kategori";

    const $ = (id) => document.getElementById(id);

    /* ============================================================
       OPSI KATEGORI (SATU SUMBER DARI BACKEND)
       ============================================================ */
    /*
     * Daftar kategori TIDAK lagi ditulis dua kali di JavaScript.
     * Halaman mengambilnya dari endpoint /admin/api/transaksi/kategori
     * yang bersumber dari model Transaksi::KATEGORI, sehingga pilihan
     * di form Tambah Transaksi, form banyak baris, dan dropdown filter
     * SELALU sama persis dengan yang diterima server.
     *
     * Cadangan di bawah hanya dipakai bila pengambilan gagal, supaya
     * form tidak pernah kosong.
     */
    const KATEGORI_CADANGAN = {
        masuk: ["Iuran", "kas", "pemasukan lainnya"],
        keluar: [
            "kebutuhan kelas",
            "perlengkapan kelas",
            "kegiatan kelas",
            "pengeluaran lainnya"
        ]
    };

    let KATEGORI_MASUK = [...KATEGORI_CADANGAN.masuk];
    let KATEGORI_KELUAR = [...KATEGORI_CADANGAN.keluar];

    /* Label tampilan (Iuran, Kas, dst.) dari backend bila ada. */
    const LABEL_KATEGORI = new Map();

    /* Ambil kategori dari backend sekali, lalu pakai di semua tempat. */
    const muatKategori = async () => {
        try {
            const hasil = await permintaanAPI(API_KATEGORI);
            const data = hasil?.data;

            if (!data) return;

            const masuk = Array.isArray(data.masuk) ? data.masuk : [];
            const keluar = Array.isArray(data.keluar) ? data.keluar : [];

            const nilaiMasuk = masuk.map((k) => k.value).filter(Boolean);
            const nilaiKeluar = keluar.map((k) => k.value).filter(Boolean);

            if (nilaiMasuk.length) KATEGORI_MASUK = nilaiMasuk;
            if (nilaiKeluar.length) KATEGORI_KELUAR = nilaiKeluar;

            [...masuk, ...keluar].forEach((k) => {
                if (k?.value) LABEL_KATEGORI.set(k.value, k.label ?? k.value);
            });

            // Isi ulang pilihan yang mungkin sudah terlanjur dibuat
            // dengan daftar cadangan.
            isiKategoriForm();
            isiPilihanKategori();
            document
                .querySelectorAll(".baris-transaksi")
                .forEach((baris) => {
                    if (baris.querySelector(".baris-kategori")) {
                        isiKategoriBaris(baris);
                    }
                });
        } catch {
            /* Diamkan; cadangan sudah terpasang. */
        }
    };

    /* Ubah nilai kategori menjadi label yang enak dibaca. */
    const labelKategori = (nilai) => {
        const teks = String(nilai ?? "");

        if (LABEL_KATEGORI.has(teks)) {
            return LABEL_KATEGORI.get(teks);
        }

        // Cadangan: kapitalkan setiap kata (kecuali yang sudah rapi).
        return teks.replace(/\b\w/g, (c) => c.toUpperCase());
    };

    /* ============================================================
       STATE
       ============================================================ */
    let TRANSAKSI = [];
    let modeForm = "tambah";
    let idSedangDiubah = null;
    let idSedangDihapus = null;

    /* Daftar kelas dari database (untuk pilihan kelas transaksi). */
    let DAFTAR_KELAS = [];

    /* Master iuran aktif & siswa untuk pembayaran iuran. */
    let DAFTAR_IURAN = [];
    let DAFTAR_SISWA = [];

    const kelasDariId = (id) => {
        if (id === null || id === undefined || id === "") return "";
        const kelas = DAFTAR_KELAS.find(
            (k) => String(k.id_kelas) === String(id)
        );
        return kelas ? kelas.nama_kelas : "";
    };

    /* Ambil daftar kelas dari API admin. */
    const muatKelas = async () => {
        if (DAFTAR_KELAS.length) return;

        try {
            const hasil = await permintaanAPI("/admin/api/kelas");
            DAFTAR_KELAS = Array.isArray(hasil.data) ? hasil.data : [];
            isiPilihanKelas();
        } catch {
            DAFTAR_KELAS = [];
        }
    };

    /* Isi select kelas pada form dengan data kelas nyata. */
    const isiPilihanKelas = () => {
        const select = $("inputKelas");
        if (!select) return;

        const nilaiLama = select.value;

        select.innerHTML = `
            <option value="">- Pilih kelas (opsional) -</option>
            ${DAFTAR_KELAS.map((k) => `
                <option value="${escapeHtml(k.id_kelas)}">
                    ${escapeHtml(k.nama_kelas)}
                </option>
            `).join("")}
        `;

        select.value = DAFTAR_KELAS.some(
            (k) => String(k.id_kelas) === String(nilaiLama)
        ) ? nilaiLama : "";
    };

    /* ============================================================
       PILIHAN IURAN & SISWA (PEMBAYARAN)
       ============================================================ */

    const iuranAktif = (iuran) =>
        String(iuran?.status ?? "").toLowerCase() === "aktif";

    const cariIuran = (id) =>
        DAFTAR_IURAN.find(
            (iuran) => String(iuran.id_iuran) === String(id)
        );

    const cariSiswa = (id) =>
        DAFTAR_SISWA.find(
            (siswa) => String(siswa.id_siswa) === String(id)
        );

    /* Ambil master iuran & siswa dari API admin. */
    const muatPilihanPembayaran = async () => {
        try {
            const [hasilIuran, hasilSiswa] = await Promise.all([
                permintaanAPI("/admin/api/iuran"),
                permintaanAPI("/admin/api/siswa")
            ]);

            DAFTAR_IURAN = Array.isArray(hasilIuran?.data)
                ? hasilIuran.data
                : [];
            DAFTAR_SISWA = Array.isArray(hasilSiswa?.data)
                ? hasilSiswa.data
                : [];

            isiPilihanIuran($("inputIuran")?.value || "");
            isiPilihanSiswa($("inputSiswa")?.value || "");
        } catch (error) {
            // Form tetap dapat dipakai untuk pemasukan non-iuran.
            console.error("Gagal memuat pilihan iuran/siswa:", error);
        }
    };

    /* Hanya iuran Aktif yang boleh dipilih untuk pembayaran baru. */
    const isiPilihanIuran = (
        nilaiTerpilih = "",
        idKelas = null
    ) => {
        const select = $("inputIuran");
        if (!select) return;

        const nilaiLama = nilaiTerpilih || select.value;
        const kelas = idKelas === null
            ? String($("inputKelas")?.value || "")
            : String(idKelas || "");

        let daftar = DAFTAR_IURAN.filter(
            (iuran) =>
                iuranAktif(iuran) &&
                (!kelas || String(iuran.id_kelas) === kelas)
        );

        // Saat mengubah transaksi lama, sertakan iuran yang sudah
        // Selesai agar relasi lamanya tidak hilang tanpa sengaja.
        if (
            nilaiLama &&
            !daftar.some(
                (iuran) => String(iuran.id_iuran) === String(nilaiLama)
            )
        ) {
            const lama = cariIuran(nilaiLama);
            if (lama) daftar = [lama, ...daftar];
        }

        select.innerHTML =
            `<option value="">- Tanpa iuran -</option>` +
            daftar.map((iuran) => `
                <option value="${escapeHtml(iuran.id_iuran)}">
                    ${escapeHtml(iuran.nama_iuran)}
                    - Rp ${escapeHtml(
                        Number(iuran.nominal || 0).toLocaleString("id-ID")
                    )}
                    ${iuranAktif(iuran) ? "" : " (Selesai)"}
                </option>
            `).join("");

        select.value = daftar.some(
            (iuran) => String(iuran.id_iuran) === String(nilaiLama)
        ) ? String(nilaiLama) : "";
    };

    /* Siswa mengikuti kelas iuran/kelas transaksi yang dipilih. */
    const isiPilihanSiswa = (
        nilaiTerpilih = "",
        idKelas = null
    ) => {
        const select = $("inputSiswa");
        if (!select) return;

        const nilaiLama = nilaiTerpilih || select.value;
        const kelas = idKelas === null
            ? String($("inputKelas")?.value || "")
            : String(idKelas || "");

        let daftar = DAFTAR_SISWA.filter(
            (siswa) =>
                !kelas || String(siswa.id_kelas) === kelas
        );

        if (
            nilaiLama &&
            !daftar.some(
                (siswa) => String(siswa.id_siswa) === String(nilaiLama)
            )
        ) {
            const lama = cariSiswa(nilaiLama);
            if (lama) daftar = [lama, ...daftar];
        }

        select.innerHTML =
            `<option value="">- Pilih siswa -</option>` +
            daftar.map((siswa) => `
                <option value="${escapeHtml(siswa.id_siswa)}">
                    ${escapeHtml(siswa.nama)}
                    - ${escapeHtml(siswa.nis || "-")}
                </option>
            `).join("");

        select.value = daftar.some(
            (siswa) => String(siswa.id_siswa) === String(nilaiLama)
        ) ? String(nilaiLama) : "";
    };

    /* Terapkan informasi iuran: nominal, keterangan, kelas, siswa. */
    const terapkanPilihanIuran = (otomatis = true) => {
        const iuran = cariIuran($("inputIuran")?.value || "");
        const info = $("infoIuran");

        if (!iuran) {
            if (info) {
                info.hidden = true;
                info.textContent = "";
            }

            if (otomatis) {
                isiPilihanSiswa($("inputSiswa")?.value || "", "");
            }

            return;
        }

        if (otomatis) {
            const radioMasuk = document.querySelector(
                'input[name="jenisTransaksi"][value="masuk"]'
            );
            if (radioMasuk) radioMasuk.checked = true;

            if ($("inputKategori")) $("inputKategori").value = "Iuran";
            if ($("inputKelas")) $("inputKelas").value = iuran.id_kelas ?? "";
            if ($("inputTagihan")) {
                $("inputTagihan").value = Number(iuran.nominal || 0)
                    .toLocaleString("id-ID");
            }
            if ($("inputDiterima")) {
                const diterimaLama = parseAngka($("inputDiterima").value);
                if (diterimaLama < Number(iuran.nominal || 0)) {
                    $("inputDiterima").value = Number(iuran.nominal || 0)
                        .toLocaleString("id-ID");
                }
            }
            if (
                $("inputKeterangan") &&
                !$("inputKeterangan").value.trim()
            ) {
                $("inputKeterangan").value =
                    `Pembayaran ${iuran.nama_iuran}`;
            }

            isiPilihanSiswa(
                "",
                iuran.id_kelas || $("inputKelas")?.value || ""
            );
        } else {
            isiPilihanSiswa(
                $("inputSiswa")?.value || "",
                iuran.id_kelas || $("inputKelas")?.value || ""
            );
        }

        if (info) {
            info.textContent =
                `${iuran.nama_iuran} - Tagihan Rp ` +
                `${Number(iuran.nominal || 0).toLocaleString("id-ID")}` +
                (iuran.keterangan ? ` - ${iuran.keterangan}` : "") +
                (iuranAktif(iuran) ? "" : " (Selesai)");
            info.hidden = false;
        }

        hitungUangLive();
    };

    /* Tampilkan pilihan iuran hanya untuk transaksi pemasukan. */
    const perbaruiVisibilitasPembayaran = () => {
        const grup = $("grupPembayaranIuran");
        const masuk = jenisTerpilih() === "masuk";

        if (grup) grup.hidden = !masuk;

        if (!masuk) {
            if ($("inputIuran")) $("inputIuran").value = "";
            if ($("inputSiswa")) $("inputSiswa").value = "";
            if ($("infoIuran")) {
                $("infoIuran").hidden = true;
                $("infoIuran").textContent = "";
            }
        }
    };

    /* ============================================================
       UTILITAS
       ============================================================ */

    const escapeHtml = (teks) => {
        return String(teks ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    };

    const formatRupiah = (angka) => {
        const n = Number(angka) || 0;
        return "Rp " + n.toLocaleString("id-ID");
    };

    const parseAngka = (teks) => {
        const digit = String(teks ?? "").replace(/[^\d]/g, "");
        return digit ? parseInt(digit, 10) : 0;
    };

    const formatTanggal = (iso) => {
        // Terima "2026-10-19", "2026-10-19 00:00:00", atau ISO penuh.
        const bagian = String(iso ?? "").slice(0, 10).split("-");

        if (bagian.length !== 3 || !bagian[0]) return "-";

        const d = new Date(
            Number(bagian[0]),
            Number(bagian[1]) - 1,
            Number(bagian[2])
        );

        if (Number.isNaN(d.getTime())) return String(iso);

        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const hitungKembalian = (tagihan, diterima) => {
        return Math.max(0, (Number(diterima) || 0) - (Number(tagihan) || 0));
    };

    const hitungNilaiKas = (tagihan, diterima) => {
        return Math.min(Number(tagihan) || 0, Number(diterima) || 0);
    };

    /* ============================================================
       AMBIL DATA DARI API
       ============================================================ */

    const permintaanAPI = async (url, opsi = {}) => {
        const csrf = document.querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        const headers = {
            Accept: "application/json",
            ...(opsi.body ? { "Content-Type": "application/json" } : {}),
            ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
            ...(opsi.headers || {})
        };

        let respons;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            // S3-07: permintaan POST otomatis dibawa kunci
            // idempotensi untuk pengaman di backend.
            respons = await fetch(url, beriKunciIdempoten({
                ...opsi,
                headers,
                credentials: "same-origin",
                signal: controller.signal
            }));
        } catch (error) {
            clearTimeout(timeoutId);
            if (error?.name === "AbortError") {
                throw new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi.");
            }
            throw new Error("Tidak dapat terhubung ke server. Periksa koneksi Laravel.");
        }
        clearTimeout(timeoutId);

        let hasil = {};
        try {
            hasil = await respons.json();
        } catch {
            // Respons bukan JSON.
        }

        if (!respons.ok) {
            if (hasil?.message) throw new Error(hasil.message);
            if (hasil?.errors) {
                const pesan = Object.values(hasil.errors).flat().filter(Boolean);
                if (pesan.length) throw new Error(pesan.join(" "));
            }
            if (respons.status >= 500) throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");
            if (respons.status === 419) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
            if (respons.status === 401 || respons.status === 403) throw new Error("Akses ditolak. Pastikan kamu sudah login.");
            throw new Error("Terjadi kesalahan saat menghubungi server.");
        }

        return hasil;
    };

    const muatData = async () => {
        const tbodyTx = $("isiTabelTransaksi");
        if (tbodyTx) {
            tbodyTx.innerHTML = Array.from({ length: 5 })
                .map(() => `<tr class="skeleton-row"><td colspan="7"><div class="skeleton skeleton-text--lg"></div></td></tr>`)
                .join("");
        }
        try {
            await muatKelas();
            await muatPilihanPembayaran();

            const hasil = await permintaanAPI(API_URL);

            const data = Array.isArray(hasil.data) ? hasil.data : [];

            TRANSAKSI = data.map((t) => {
                const jenisDb = String(t.jenis ?? "").toUpperCase();
                const jenis = (jenisDb === "PEMASUKAN" || jenisDb === "M") ? "masuk" : (jenisDb === "PENGELUARAN" || jenisDb === "K") ? "keluar" : String(t.jenis ?? "masuk").toLowerCase();

                return {
                    id: t.id_transaksi ?? t.id ?? "",
                    no_bukti: t.no_bukti ?? "",
                    jenis: jenis,
                    kategori: t.kategori ?? "",
                    keterangan: t.keterangan ?? "",
                    id_kelas: t.id_kelas ?? "",
                    id_siswa: t.id_siswa ?? "",
                    id_iuran: t.id_iuran ?? "",
                    nama_siswa: t.siswa?.nama_siswa ?? t.nama_siswa ?? "",
                    kelas: kelasDariId(t.id_kelas) || (t.siswa?.nama_kelas ?? t.nama_siswa ?? ""),
                    tanggal: String(t.tanggal_format ?? t.tanggal ?? "").slice(0, 10),
                    waktu: t.waktu ?? "",
                    tagihan: (floatval(t.nominal ?? 0)),
                    diterima: (floatval(t.uang_diterima ?? 0)),
                    petugas: t.dicatat_oleh ?? t.pic ?? "",
                    metode: t.metode ?? "",
                    detail: t.Detail ?? "",
                    bukti_transaksi: t.bukti_transaksi ?? ""
                };
            });

            // Isi dropdown filter Kategori & Bulan lebih dulu agar
            // pilihannya tersedia sejak halaman dibuka (sebelumnya
            // baru terisi setelah filter Jenis diubah atau Reset
            // diklik).
            isiPilihanKategori();
            isiPilihanBulan();

            terapkanFilter();
        } catch (error) {
            console.error("Gagal memuat data transaksi:", error);
            TRANSAKSI = [];
            renderTabel([]);
            renderRingkasan([]);
            tampilkanToast(error.message || "Gagal memuat data transaksi.");
        }
    };

    const floatval = (val) => {
        return parseFloat(val) || 0;
    };

    /* ============================================================
       CHIP KATEGORI
       ============================================================ */
    const CHIP_KATEGORI = {
        "iuran": "chip--iuran",
        "kas": "chip--kas",
        "pemasukan lainnya": "chip--masuk-lain",
        "kebutuhan kelas": "chip--butuh",
        "perlengkapan kelas": "chip--perlengkapan",
        "kegiatan kelas": "chip--kegiatan",
        "pengeluaran lainnya": "chip--keluar-lain"
    };

    /* Cari kelas warna chip tanpa terpengaruh huruf besar/kecil. */
    const chipKategori = (nilai) =>
        CHIP_KATEGORI[String(nilai ?? "").toLowerCase()] || "chip--keluar-lain";

    /* ============================================================
       RENDER TABEL
       ============================================================ */
    const barisTabel = (t) => {
        const nominal = hitungNilaiKas(t.tagihan, t.diterima);
        const tanda = t.jenis === "masuk" ? "+" : "−";
        const chip = chipKategori(t.kategori);

        return `
            <tr>
                <td>
                    <span class="cell-id">${escapeHtml(t.id)}</span>
                </td>
                <td class="cell-keterangan">
                    <div class="cell-keterangan__utama">${escapeHtml(t.keterangan)}</div>
                    ${t.kelas ? `<span class="cell-keterangan__sub">${escapeHtml(t.kelas)}</span>` : ""}
                </td>
                <td>
                    <span class="chip ${chip}">${escapeHtml(labelKategori(t.kategori))}</span>
                </td>
                <td class="cell-tanggal">
                    <div class="cell-tanggal__utama">${formatTanggal(t.tanggal)}</div>
                    <div class="cell-tanggal__sub">${escapeHtml(t.waktu || "-")} WIB</div>
                </td>
                <td class="cell-petugas">
                    ${escapeHtml(t.petugas || "-")}
                </td>
                <td class="td-r">
                    <span class="cell-nominal cell-nominal--${escapeHtml(t.jenis)}">
                        ${tanda}${formatRupiah(nominal)}
                    </span>
                </td>
                <td class="td-c">
                    <span class="aksi-grup">
                        <button type="button" class="icon-btn" data-aksi="detail" data-id="${escapeHtml(t.id)}" aria-label="Lihat detail ${escapeHtml(t.id)}" title="Detail">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        <button type="button" class="icon-btn" data-aksi="ubah" data-id="${escapeHtml(t.id)}" aria-label="Ubah ${escapeHtml(t.id)}" title="Ubah">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button type="button" class="icon-btn icon-btn--hapus" data-aksi="hapus" data-id="${escapeHtml(t.id)}" aria-label="Hapus ${escapeHtml(t.id)}" title="Hapus">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </span>
                </td>
            </tr>
        `;
    };

    const renderTabel = (baris) => {
        const tbody = $("isiTabelTransaksi");
        const kosong = $("emptyState");
        if (!tbody || !kosong) return;

        tbody.innerHTML = baris.map(barisTabel).join("");
        if (baris.length === 0) {
            kosong.hidden = false;
            tbody.innerHTML = "";
        } else {
            kosong.hidden = true;
        }

        const info = $("tabelInfo");
        if (info) info.textContent = `${baris.length} transaksi ditampilkan`;
    };

    /* ============================================================
       RENDER RINGKASAN
       ============================================================ */
    const renderRingkasan = (baris) => {
        const masuk = baris.filter(t => t.jenis === "masuk")
            .reduce((total, t) => total + hitungNilaiKas(t.tagihan, t.diterima), 0);
        const keluar = baris.filter(t => t.jenis === "keluar")
            .reduce((total, t) => total + hitungNilaiKas(t.tagihan, t.diterima), 0);
        const selisih = masuk - keluar;

        if ($("sumMasuk")) $("sumMasuk").textContent = formatRupiah(masuk);
        if ($("sumKeluar")) $("sumKeluar").textContent = formatRupiah(keluar);
        if ($("sumSelisih")) $("sumSelisih").textContent = (selisih >= 0 ? "+" : "−") + formatRupiah(Math.abs(selisih));

        const jumlah = baris.length;
        if ($("sumMasukNote")) $("sumMasukNote").textContent = jumlah ? `${baris.filter(t => t.jenis === "masuk").length} transaksi pemasukan` : "tidak ada pemasukan";
        if ($("sumKeluarNote")) $("sumKeluarNote").textContent = jumlah ? `${baris.filter(t => t.jenis === "keluar").length} transaksi pengeluaran` : "tidak ada pengeluaran";
        if ($("sumSelisihNote")) {
            if (!jumlah) $("sumSelisihNote").textContent = "tidak ada transaksi";
            else if (selisih > 0) $("sumSelisihNote").textContent = "saldo kas bertambah";
            else if (selisih < 0) $("sumSelisihNote").textContent = "saldo kas berkurang";
            else $("sumSelisihNote").textContent = "pemasukan dan pengeluaran seimbang";
        }
    };

    /* ============================================================
       FILTER - KATEGORI
       ============================================================ */
    const isiPilihanKategori = () => {
        const pilihJenis = $("filterJenis");
        const pilihKategori = $("filterKategori");
        if (!pilihJenis || !pilihKategori) return;

        const jenis = pilihJenis.value;
        const nilaiLama = pilihKategori.value;
        let daftar = [];

        if (jenis === "masuk") daftar = KATEGORI_MASUK;
        else if (jenis === "keluar") daftar = KATEGORI_KELUAR;
        else daftar = [...KATEGORI_MASUK, ...KATEGORI_KELUAR];

        pilihKategori.innerHTML = `<option value="semua">Semua Kategori</option>` +
            daftar.map(k => `<option value="${escapeHtml(k)}">${escapeHtml(labelKategori(k))}</option>`).join("");

        const masihAda = [...pilihKategori.options].some(o => o.value === nilaiLama);
        if (masihAda) pilihKategori.value = nilaiLama;
    };

    /* ============================================================
       FILTER - BULAN
       ============================================================ */
    /*
     * Daftar bulan diambil dari data nyata (bukan hardcode), sehingga
     * isinya selalu sesuai transaksi yang tersimpan.
     */
    const NAMA_BULAN = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const isiPilihanBulan = () => {
        const pilih = $("filterBulan");
        if (!pilih) return;

        const nilaiLama = pilih.value;

        const daftar = [...new Set(
            TRANSAKSI
                .map(t => String(t.tanggal ?? "").slice(0, 7))
                .filter(b => /^\d{4}-\d{2}$/.test(b))
        )].sort().reverse();

        pilih.innerHTML = `<option value="semua">Semua Bulan</option>` +
            daftar.map(b => {
                const [th, bl] = b.split("-");
                const nama = NAMA_BULAN[Number(bl) - 1] ?? bl;
                return `<option value="${b}">${nama} ${th}</option>`;
            }).join("");

        if ([...pilih.options].some(o => o.value === nilaiLama)) {
            pilih.value = nilaiLama;
        }
    };

    /* ============================================================
       TERAPKAN FILTER
       ============================================================ */
    const terapkanFilter = () => {
        const inputCari = $("cariTransaksi");
        const filterJenis = $("filterJenis");
        const filterKategori = $("filterKategori");
        const filterBulan = $("filterBulan");
        if (!inputCari || !filterJenis || !filterKategori || !filterBulan) return;

        const kata = inputCari.value.trim().toLowerCase();
        const jenis = filterJenis.value;
        const kategori = filterKategori.value;
        const bulan = filterBulan.value;

        const hasil = TRANSAKSI.filter(t => {
            if (jenis !== "semua" && t.jenis !== jenis) return false;
            if (
                kategori !== "semua" &&
                String(t.kategori ?? "").toLowerCase() !==
                    String(kategori).toLowerCase()
            ) return false;
            if (
                bulan !== "semua" &&
                !String(t.tanggal ?? "").startsWith(bulan)
            ) return false;
            if (kata) {
                const gabung = `${t.id} ${t.keterangan} ${t.kategori} ${t.kelas} ${t.petugas}`.toLowerCase();
                if (!gabung.includes(kata)) return false;
            }
            return true;
        });

        renderTabel(hasil);
        renderRingkasan(hasil);
    };

    const resetFilter = () => {
        if ($("cariTransaksi")) $("cariTransaksi").value = "";
        if ($("filterJenis")) $("filterJenis").value = "semua";
        isiPilihanKategori();
        isiPilihanBulan();
        if ($("filterKategori")) $("filterKategori").value = "semua";
        if ($("filterBulan")) $("filterBulan").value = "semua";
        terapkanFilter();
    };

    /* ============================================================
       MODAL & TOAST
       ============================================================ */
    const bukaModal = (id) => {
        const modal = $(id);
        if (!modal) return;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    };

    const tutupModal = (id) => {
        const modal = $(id);
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        if (!document.querySelector(".modal-backdrop.is-open")) {
            document.body.classList.remove("modal-open");
        }
    };

    const tutupSemuaModal = () => {
        document.querySelectorAll(".modal-backdrop.is-open").forEach(m => tutupModal(m.id));
    };

    let toastTimer = null;
    const tampilkanToast = (pesan) => {
        const toast = $("toast");
        const toastText = $("toastText");
        if (!toast || !toastText) return;
        toastText.textContent = pesan;
        toast.classList.add("is-muncul");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("is-muncul"), 2800);
    };

    /* ============================================================
       FORM - JENIS & KATEGORI
       ============================================================ */
    const jenisTerpilih = () => {
        const radio = document.querySelector('input[name="jenisTransaksi"]:checked');
        return radio ? radio.value : "masuk";
    };

    const isiKategoriForm = () => {
        const pilih = $("inputKategori");
        if (!pilih) return;

        const nilaiLama = pilih.value;

        /*
         * Form menampilkan SELURUH kategori (7) dipisah per jenis:
         * kelompok "Pemasukan" dan "Pengeluaran". Saat pengguna
         * memilih kategori, jenis transaksi menyesuaikan otomatis
         * (lihat pasangEvent) sehingga server tidak pernah menerima
         * kategori yang salah jenis.
         */
        const opsi = (k) =>
            `<option value="${escapeHtml(k)}">${escapeHtml(labelKategori(k))}</option>`;

        pilih.innerHTML =
            `<optgroup label="Pemasukan">${KATEGORI_MASUK.map(opsi).join("")}</optgroup>` +
            `<optgroup label="Pengeluaran">${KATEGORI_KELUAR.map(opsi).join("")}</optgroup>`;

        const masihAda = [...pilih.options].some(o => o.value === nilaiLama);
        if (masihAda) {
            pilih.value = nilaiLama;
        } else if (pilih.options.length) {
            pilih.selectedIndex = 0;
        }
    };

    /**
     * Kategori menentukan jenis transaksi.
     *
     * Kategori pengeluaran hanya sah bila jenis = Pengeluaran
     * (aturan server), jadi saat pengguna memilih kategori dari
     * kelompok pengeluaran, radio jenis otomatis dipindah.
     */
    const sesuaikanJenisKeKategori = () => {
        const pilih = $("inputKategori");
        if (!pilih) return;

        const kategori = pilih.value;
        const jenisKategori = KATEGORI_MASUK.includes(kategori) ? "masuk" : "keluar";
        const radio = document.querySelector(
            `input[name="jenisTransaksi"][value="${jenisKategori}"]`
        );

        if (radio && !radio.checked) {
            radio.checked = true;
            sesuaikanLabelJenis();
        }

        perbaruiVisibilitasPembayaran();
    };

    const sesuaikanLabelJenis = () => {
        const jenis = jenisTerpilih();
        const labelDiterima = $("labelDiterima");
        const labelMasukKas = $("labelMasukKas");
        const uangBox = $("uangBox");

        if (labelDiterima) {
            labelDiterima.innerHTML = jenis === "masuk"
                ? `Jumlah uang yang diterima Bendahara <b class="wajib">*</b>`
                : `Jumlah uang yang dibayarkan Bendahara <b class="wajib">*</b>`;
        }
        if (labelMasukKas) {
            labelMasukKas.textContent = jenis === "masuk"
                ? "Jumlah uang yang masuk ke kas"
                : "Jumlah uang yang keluar dari kas";
        }
        if (uangBox) uangBox.classList.toggle("is-keluar", jenis === "keluar");
        hitungUangLive();
    };

    const hitungUangLive = () => {
        const inputTagihan = $("inputTagihan");
        const inputDiterima = $("inputDiterima");
        const hasilKembalian = $("hasilKembalian");
        const hasilMasukKas = $("hasilMasukKas");
        if (!inputTagihan || !inputDiterima || !hasilKembalian || !hasilMasukKas) return;

        const jenis = jenisTerpilih();
        const tagihan = parseAngka(inputTagihan.value);
        const diterima = parseAngka(inputDiterima.value);
        const kembalian = hitungKembalian(tagihan, diterima);
        const nilaiKas = hitungNilaiKas(tagihan, diterima);

        hasilKembalian.textContent = kembalian.toLocaleString("id-ID");
        hasilMasukKas.textContent = nilaiKas.toLocaleString("id-ID");

        const hint = $("uangHint");
        if (!hint) return;

        if (diterima > 0 && diterima < tagihan) {
            const kekurangan = tagihan - diterima;
            hint.classList.add("is-peringatan");
            hint.innerHTML = `<span class="material-symbols-outlined">info</span>Uang ${jenis === "masuk" ? "yang diterima" : "yang dibayarkan"} lebih kecil dari nilai transaksi - masih kurang Rp ${kekurangan.toLocaleString("id-ID")}.`;
            return;
        }
        if (diterima > tagihan && tagihan > 0) {
            hint.classList.remove("is-peringatan");
            hint.innerHTML = `<span class="material-symbols-outlined">info</span>Uang diterima/dibayarkan Rp ${diterima.toLocaleString("id-ID")} menghasilkan kembalian Rp ${kembalian.toLocaleString("id-ID")}. Nilai yang dicatat ke kas Rp ${nilaiKas.toLocaleString("id-ID")}.`;
            return;
        }
        hint.classList.remove("is-peringatan");
        hint.innerHTML = `<span class="material-symbols-outlined">info</span>Contoh: transaksi Rp 10.000 dan uang Rp 20.000 → kembalian Rp 10.000, sehingga nilai yang dicatat ke kas Rp 10.000.`;
    };

    /* ============================================================
       FORM - BUKA TAMBAH (Langsung Tambahkan)
       ============================================================ */
    const bukaFormTambah = async () => {
        const form = $("formTransaksi");
        if (!form) return;

        modeForm = "tambah";
        idSedangDiubah = null;

        await muatPilihanPembayaran();

        if ($("modalFormEyebrow")) $("modalFormEyebrow").textContent = "TRANSAKSI BARU";
        if ($("modalFormTitle")) $("modalFormTitle").textContent = "Catat Transaksi";
        if ($("btnSimpanText")) $("btnSimpanText").textContent = "Simpan Transaksi";
        if ($("btnSimpanDanTambah")) $("btnSimpanDanTambah").hidden = false;

        form.reset();
        if ($("formError")) $("formError").hidden = true;

        const radioMasuk = document.querySelector('input[name="jenisTransaksi"][value="masuk"]');
        if (radioMasuk) radioMasuk.checked = true;

        isiKategoriForm();
        isiPilihanIuran();
        isiPilihanSiswa();

        const hariIni = new Date();
        const iso = `${hariIni.getFullYear()}-${String(hariIni.getMonth() + 1).padStart(2, "0")}-${String(hariIni.getDate()).padStart(2, "0")}`;
        if ($("inputTanggal")) $("inputTanggal").value = iso;
        if ($("hasilKembalian")) $("hasilKembalian").textContent = "0";
        if ($("hasilMasukKas")) $("hasilMasukKas").textContent = "0";
        if ($("infoIuran")) {
            $("infoIuran").hidden = true;
            $("infoIuran").textContent = "";
        }

        perbaruiVisibilitasPembayaran();
        sesuaikanLabelJenis();
        bukaModal("modalForm");

        setTimeout(() => { if ($("inputKeterangan")) $("inputKeterangan").focus(); }, 120);
    };

    /* ============================================================
       FORM - BUKA UBAH
       ============================================================ */
    const bukaFormUbah = async (id) => {
        const t = TRANSAKSI.find(item => String(item.id) === String(id));
        if (!t) return;

        const form = $("formTransaksi");
        if (!form) return;

        modeForm = "ubah";
        idSedangDiubah = id;

        await muatPilihanPembayaran();

        if ($("modalFormEyebrow")) $("modalFormEyebrow").textContent = "UBAH TRANSAKSI";
        if ($("modalFormTitle")) $("modalFormTitle").textContent = `Ubah ${t.id}`;
        if ($("btnSimpanText")) $("btnSimpanText").textContent = "Perbarui Transaksi";
        if ($("btnSimpanDanTambah")) $("btnSimpanDanTambah").hidden = true;

        form.reset();
        if ($("formError")) $("formError").hidden = true;

        const nilaiJenis = t.jenis === "masuk" ? "masuk" : "keluar";
        const radio = document.querySelector(`input[name="jenisTransaksi"][value="${nilaiJenis}"]`);
        if (radio) radio.checked = true;

        // Isi daftar kategori lengkap (7 pilihan), lalu pilih kategori
        // transaksi yang sedang diubah. Sesudah itu jenis disamakan
        // dengan kategori tersebut agar kombinasi tetap valid.
        isiKategoriForm();
        if ($("inputKategori")) $("inputKategori").value = t.kategori;
        sesuaikanJenisKeKategori();
        if ($("inputKelas")) $("inputKelas").value = t.id_kelas != null ? String(t.id_kelas) : "";
        if ($("inputKeterangan")) $("inputKeterangan").value = t.keterangan || "";
        if ($("inputTanggal")) $("inputTanggal").value = t.tanggal || "";

        isiPilihanIuran(
            t.id_iuran != null ? t.id_iuran : "",
            t.id_kelas != null ? t.id_kelas : null
        );
        if ($("inputIuran")) {
            $("inputIuran").value =
                t.id_iuran != null ? String(t.id_iuran) : "";
        }
        terapkanPilihanIuran(false);

        isiPilihanSiswa(
            t.id_siswa != null ? t.id_siswa : "",
            t.id_kelas != null ? t.id_kelas : null
        );
        if ($("inputSiswa")) {
            $("inputSiswa").value =
                t.id_siswa != null ? String(t.id_siswa) : "";
        }

        if ($("inputTagihan")) $("inputTagihan").value = Number(t.tagihan || 0).toLocaleString("id-ID");
        if ($("inputDiterima")) $("inputDiterima").value = Number(t.diterima || 0).toLocaleString("id-ID");

        perbaruiVisibilitasPembayaran();
        sesuaikanLabelJenis();
        bukaModal("modalForm");

        setTimeout(() => { if ($("inputKeterangan")) $("inputKeterangan").focus(); }, 120);
    };

    /* ============================================================
       FORM - SIMPAN TRANSAKSI
       ============================================================ */
    const simpanTransaksi = async (e) => {
        e.preventDefault();
        await simpanTransaksiBaruDariForm(false);
    };

    /**
     * Menyimpan transaksi dari form modal.
     *
     * @param {boolean} lanjutTambah Bila true, form dibuka kembali
     *        dalam keadaan kosong agar admin dapat langsung mencatat
     *        transaksi berikutnya.
     */
    const simpanTransaksiBaruDariForm = async (lanjutTambah = false) => {

        const kategori = $("inputKategori") ? $("inputKategori").value : "";
        const keterangan = $("inputKeterangan") ? $("inputKeterangan").value.trim() : "";
        const tanggal = $("inputTanggal") ? $("inputTanggal").value : "";
        const kelas = $("inputKelas") ? $("inputKelas").value : "";
        const jenis = jenisTerpilih();
        const tagihan = $("inputTagihan") ? parseAngka($("inputTagihan").value) : 0;
        const diterima = $("inputDiterima") ? parseAngka($("inputDiterima").value) : 0;
        const idIuran = $("inputIuran") ? $("inputIuran").value : "";
        const idSiswa = $("inputSiswa") ? $("inputSiswa").value : "";
        const iuranDipilih = cariIuran(idIuran);
        const siswaDipilih = cariSiswa(idSiswa);

        const transaksiLama =
            modeForm === "ubah"
                ? TRANSAKSI.find(
                    (item) =>
                        String(item.id) === String(idSedangDiubah)
                )
                : null;

        // Iuran Selesai hanya boleh dipertahankan pada transaksi lama
        // yang nominalnya tidak dinaikkan; pembayaran baru ditolak.
        const iuranLamaTidakBerubah =
            transaksiLama &&
            String(transaksiLama.id_iuran) === String(idIuran) &&
            tagihan <= Number(transaksiLama.tagihan || 0) + 0.009;

        const galat = [];
        if (!keterangan) galat.push("Keterangan wajib diisi");
        if (!tanggal) galat.push("Tanggal wajib diisi");
        if (!kategori) galat.push("Kategori wajib dipilih");
        if (tagihan <= 0) galat.push("Jumlah transaksi wajib lebih dari 0");
        if (diterima <= 0) galat.push("Jumlah uang wajib lebih dari 0");

        if (idIuran) {
            if (jenis !== "masuk") {
                galat.push("Pembayaran iuran hanya untuk transaksi pemasukan");
            }
            if (!idSiswa) {
                galat.push("Siswa wajib dipilih untuk pembayaran iuran");
            }
            if (
                !iuranAktif(iuranDipilih) &&
                !iuranLamaTidakBerubah
            ) {
                galat.push("Iuran sudah berstatus Selesai dan tidak dapat menerima pembayaran baru");
            }
        }

        const kotakGalat = $("formError");
        if (galat.length) {
            if (kotakGalat) {
                kotakGalat.textContent = galat.join(" • ");
                kotakGalat.hidden = false;
            }
            return;
        }
        if (kotakGalat) kotakGalat.hidden = true;

        const jam = new Date();
        const waktu = `${String(jam.getHours()).padStart(2, "0")}:${String(jam.getMinutes()).padStart(2, "0")}`;

        const jenisDb = jenis === "masuk" ? "pemasukan" : "pengeluaran";

        let idKelasPayload = kelas ? Number(kelas) : null;

        if (!idKelasPayload && iuranDipilih?.id_kelas) {
            idKelasPayload = Number(iuranDipilih.id_kelas);
        }

        if (!idKelasPayload && siswaDipilih?.id_kelas) {
            idKelasPayload = Number(siswaDipilih.id_kelas);
        }

        const payload = {
            jenis: jenisDb,
            kategori: kategori,
            keterangan: keterangan,
            tanggal: tanggal,
            nominal: tagihan,
            uang_diterima: diterima,
            metode: "CH",
            id_kelas: idKelasPayload
        };

        if (idIuran) {
            payload.id_iuran = Number(idIuran);
            payload.id_siswa = Number(idSiswa);
            payload.nama_pembayar = siswaDipilih?.nama ?? "";
        } else if (idSiswa) {
            payload.id_siswa = Number(idSiswa);
        }

        const tombolSimpan = $("btnSimpanTransaksi");

        // S3-07: kunci tombol saat proses (teks "Memproses...", tidak
        // dapat diklik dua kali). null = masih diproses, boleh henti.
        const pemulihanTombol = kunciTombolSimpan(tombolSimpan);
        if (!pemulihanTombol) return;

        try {
            if (modeForm === "ubah" && idSedangDiubah) {
                await permintaanAPI(`${API_URL}/${encodeURIComponent(idSedangDiubah)}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });
                tampilkanToast(`Transaksi ${idSedangDiubah} berhasil diperbarui`);
                tutupModal("modalForm");
            } else {
                const hasil = await permintaanAPI(API_URL, {
                    method: "POST",
                    body: JSON.stringify(payload)
                });
                const idBaru = hasil.data?.no_bukti ?? hasil.data?.id_transaksi ?? hasil.data?.id ?? "";
                tampilkanToast(`Transaksi ${idBaru} berhasil dicatat`);

                if (lanjutTambah) {
                    // Kosongkan form untuk transaksi berikutnya.
                    bukaFormTambah();
                } else {
                    tutupModal("modalForm");
                }
            }

            await muatData();
        } catch (error) {
            tampilkanToast(error.message || "Gagal menyimpan transaksi.");
        } finally {
            // S3-07: teks & tombol pulih kembali setelah proses gagal
            // maupun sukses.
            pemulihanTombol.pulihkan();
        }
    };

    /* ============================================================
       DETAIL TRANSAKSI
       ============================================================ */
    const bukaDetail = (id) => {
        const t = TRANSAKSI.find(item => String(item.id) === String(id));
        if (!t) return;

        const nilaiKas = hitungNilaiKas(t.tagihan, t.diterima);
        const kembalian = hitungKembalian(t.tagihan, t.diterima);

        if ($("modalDetailTitle")) $("modalDetailTitle").textContent = t.id;
        if ($("detailJenis")) $("detailJenis").textContent = t.jenis === "masuk" ? "Pemasukan" : "Pengeluaran";
        if ($("detailKategori")) $("detailKategori").textContent = labelKategori(t.kategori);
        if ($("detailKelas")) $("detailKelas").textContent = t.kelas || "-";
        if ($("detailTanggal")) $("detailTanggal").textContent = formatTanggal(t.tanggal);
        if ($("detailWaktu")) $("detailWaktu").textContent = `${t.waktu || "-"} WIB`;
        if ($("detailPetugas")) $("detailPetugas").textContent = t.petugas || "-";
        if ($("detailKeterangan")) $("detailKeterangan").textContent = t.keterangan || "-";

        if ($("rincianLabelDiterima")) $("rincianLabelDiterima").textContent = t.jenis === "masuk"
            ? "Jumlah uang yang diterima Bendahara"
            : "Jumlah uang yang dibayarkan Bendahara";
        if ($("rincianLabelMasukKas")) $("rincianLabelMasukKas").textContent = t.jenis === "masuk"
            ? "Jumlah uang yang masuk ke kas"
            : "Jumlah uang yang keluar dari kas";
        if ($("rincianTagihan")) $("rincianTagihan").textContent = formatRupiah(t.tagihan);
        if ($("rincianDiterima")) $("rincianDiterima").textContent = formatRupiah(t.diterima);
        if ($("rincianKembalian")) $("rincianKembalian").textContent = formatRupiah(kembalian);
        if ($("rincianMasukKas")) $("rincianMasukKas").textContent = formatRupiah(nilaiKas);

        bukaModal("modalDetail");
    };

    /* ============================================================
       HAPUS TRANSAKSI
       ============================================================ */
    const bukaHapus = (id) => {
        const transaksi = TRANSAKSI.find(item => String(item.id) === String(id));
        if (!transaksi) return;
        idSedangDihapus = id;
        if ($("hapusText")) $("hapusText").textContent = `Transaksi ${id} akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.`;
        bukaModal("modalHapus");
    };

    const jalankanHapus = async () => {
        if (!idSedangDihapus) return;
        const tombol = $("btnKonfirmasiHapus");
        if (tombol) tombol.disabled = true;

        try {
            await permintaanAPI(`${API_URL}/${encodeURIComponent(idSedangDihapus)}`, { method: "DELETE" });
            tampilkanToast(`Transaksi ${idSedangDihapus} dihapus`);
            tutupModal("modalHapus");
            idSedangDihapus = null;
            await muatData();
        } catch (error) {
            tampilkanToast(error.message || "Gagal menghapus transaksi.");
        } finally {
            if (tombol) tombol.disabled = false;
        }
    };

    /* ============================================================
       FORM BANYAK TRANSAKSI
       ============================================================ */

    let nomorBaris = 0;

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
                    <span class="field__label">Nominal <b class="wajib">*</b></span>
                    <span class="input-uang">
                        <span class="input-uang__pre" aria-hidden="true">Rp</span>
                        <input type="text" class="baris-nominal" inputmode="numeric" placeholder="0" autocomplete="off">
                    </span>
                </label>

                <label class="field">
                    <span class="field__label">Kelas</span>
                    <select class="baris-kelas">
                        <option value="">- Pilih kelas (opsional) -</option>
                    </select>
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
            .map((k) => `<option value="${escapeHtml(k)}">${escapeHtml(labelKategori(k))}</option>`)
            .join("");

        if ([...pilih.options].some((o) => o.value === nilaiLama)) {
            pilih.value = nilaiLama;
        }
    };

    const isiKelasBaris = (baris) => {
        const pilih = baris.querySelector(".baris-kelas");
        if (!pilih) return;

        pilih.innerHTML = `
            <option value="">- Pilih kelas (opsional) -</option>
            ${DAFTAR_KELAS.map((k) => `
                <option value="${escapeHtml(k.id_kelas)}">${escapeHtml(k.nama_kelas)}</option>
            `).join("")}
        `;
    };

    const tanggalHariIni = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const tambahBarisTransaksi = () => {
        const wadah = $("isiBarisTransaksi");
        if (!wadah) return;

        const index = nomorBaris++;
        wadah.insertAdjacentHTML("beforeend", barisBanyakHtml(index));

        const baris = wadah.querySelector(`[data-baris="${index}"]`);
        if (!baris) return;

        isiKategoriBaris(baris);
        isiKelasBaris(baris);

        const tanggal = baris.querySelector(".baris-tanggal");
        if (tanggal) tanggal.value = tanggalHariIni();

        const nominal = baris.querySelector(".baris-nominal");
        nominal?.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        });

        const jenis = baris.querySelector(".baris-jenis");
        jenis?.addEventListener("change", () => isiKategoriBaris(baris));

        const keterangan = baris.querySelector(".baris-keterangan");
        if (keterangan) keterangan.focus();
    };

    /* Nomor baris ditampilkan ulang agar selalu berurutan. */
    const perbaruiNomorBaris = () => {
        const wadah = $("isiBarisTransaksi");
        if (!wadah) return;

        wadah.querySelectorAll(".baris-transaksi").forEach((baris, i) => {
            const label = baris.querySelector(".baris-transaksi__nomor");
            if (label) label.textContent = `Baris ${i + 1}`;
        });
    };

    const bukaFormBanyak = () => {
        const form = $("formTransaksiBanyak");
        const wadah = $("isiBarisTransaksi");
        if (!form || !wadah) return;

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
            const kelas = baris.querySelector(".baris-kelas")?.value || "";

            if (!tanggal) galat.push(`Baris ${nomor}: tanggal wajib diisi`);
            if (!kategori) galat.push(`Baris ${nomor}: kategori wajib dipilih`);
            if (nominal <= 0) galat.push(`Baris ${nomor}: nominal wajib lebih dari 0`);
            if (!keterangan) galat.push(`Baris ${nomor}: keterangan wajib diisi`);

            if (tanggal && kategori && nominal > 0 && keterangan) {
                data.push({
                    tanggal,
                    jenis: jenis === "masuk" ? "pemasukan" : "pengeluaran",
                    kategori,
                    nominal,
                    uang_diterima: nominal,
                    keterangan,
                    metode: "CH",
                    id_kelas: kelas ? Number(kelas) : null
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

        // S3-07: kunci tombol saat proses (tidak dapat diklik dua kali).
        const pemulihanTombol = kunciTombolSimpan(tombol);
        if (!pemulihanTombol) return;

        try {
            const hasil = await permintaanAPI(API_URL, {
                method: "POST",
                body: JSON.stringify({ transaksi: data })
            });

            const jumlah = hasil.jumlah ?? data.length;
            tutupModal("modalFormBanyak");
            tampilkanToast(`${jumlah} transaksi berhasil dicatat`);
            await muatData();
        } catch (error) {
            if (kotakGalat) {
                kotakGalat.textContent = error.message || "Gagal menyimpan transaksi.";
                kotakGalat.hidden = false;
            }
        } finally {
            // S3-07: tombol pulih setelah proses selesai.
            pemulihanTombol.pulihkan();
        }
    };

    /* ============================================================
       SIDEBAR + DROPDOWN + TANGGAL
       ============================================================ */
    const pasangInteraksiUmum = () => {
        const tombolSidebar = $("sidebarToggle");
        const backdrop = $("sidebarBackdrop");
        const tutupSidebar = () => document.body.classList.remove("nav-open");

        if (tombolSidebar) tombolSidebar.addEventListener("click", () => document.body.classList.toggle("nav-open"));
        if (backdrop) backdrop.addEventListener("click", tutupSidebar);
        window.addEventListener("resize", () => { if (window.innerWidth > 1024) tutupSidebar(); });

        const tombolProfil = $("profileBtn");
        const menuProfil = $("profileMenu");
        const tutupProfil = () => {
            if (menuProfil) menuProfil.classList.remove("is-open");
            if (tombolProfil) tombolProfil.setAttribute("aria-expanded", "false");
        };
        if (tombolProfil && menuProfil) {
            tombolProfil.addEventListener("click", (e) => {
                e.stopPropagation();
                const terbuka = menuProfil.classList.toggle("is-open");
                tombolProfil.setAttribute("aria-expanded", terbuka ? "true" : "false");
            });
            document.addEventListener("click", (e) => {
                if (!menuProfil.contains(e.target) && e.target !== tombolProfil) tutupProfil();
            });
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") { tutupSidebar(); tutupProfil(); tutupSemuaModal(); }
        });

        const elTanggal = $("topbarDate");
        if (elTanggal) {
            elTanggal.textContent = new Date().toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
            });
        }
    };

    /* ============================================================
       EVENT
       ============================================================ */
    const pasangEvent = () => {
        $("cariTransaksi")?.addEventListener("input", terapkanFilter);
        $("filterJenis")?.addEventListener("change", () => { isiPilihanKategori(); terapkanFilter(); });
        $("filterKategori")?.addEventListener("change", terapkanFilter);
        $("filterBulan")?.addEventListener("change", terapkanFilter);

        $("btnResetFilter")?.addEventListener("click", resetFilter);
        $("btnKosongkanFilter")?.addEventListener("click", resetFilter);

        $("btnTambahTransaksi")?.addEventListener("click", bukaFormTambah);

        /* Form banyak transaksi sekaligus. */
        $("btnTambahBanyak")?.addEventListener("click", bukaFormBanyak);
        $("btnTambahBaris")?.addEventListener("click", tambahBarisTransaksi);

        $("isiBarisTransaksi")?.addEventListener("click", (e) => {
            const tombol = e.target.closest("[data-hapus-baris]");
            if (!tombol) return;

            const baris = tombol.closest(".baris-transaksi");
            if (!baris) return;

            const jumlah = $("isiBarisTransaksi")?.querySelectorAll(".baris-transaksi").length || 0;
            if (jumlah <= 1) {
                tampilkanToast("Minimal satu baris transaksi harus ada.");
                return;
            }

            baris.remove();
            perbaruiNomorBaris();
        });

        $("formTransaksiBanyak")?.addEventListener("submit", simpanBanyakTransaksi);

        /*
         * "Simpan & Tambah Lagi": simpan transaksi lalu buka kembali
         * form kosong supaya admin bisa mencatat transaksi berikutnya
         * tanpa mengulang dari awal.
         */
        $("btnSimpanDanTambah")?.addEventListener("click", async () => {
            await simpanTransaksiBaruDariForm(true);
        });

        $("inputTanggal")?.addEventListener("input", hitungUangLive);
        $("inputTagihan")?.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            hitungUangLive();
        });
        $("inputDiterima")?.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            hitungUangLive();
        });

        $("inputIuran")?.addEventListener("change", () => {
            terapkanPilihanIuran(true);
        });

        $("inputSiswa")?.addEventListener("change", () => {
            const siswa = cariSiswa($("inputSiswa")?.value || "");
            if (siswa?.id_kelas && !$("inputKelas")?.value) {
                if ($("inputKelas")) {
                    $("inputKelas").value = String(siswa.id_kelas);
                }
                isiPilihanIuran(
                    $("inputIuran")?.value || "",
                    siswa.id_kelas
                );
            }
        });

        $("inputKelas")?.addEventListener("change", () => {
            const kelas = $("inputKelas")?.value || "";
            const iuranLama = $("inputIuran")?.value || "";
            const siswaLama = $("inputSiswa")?.value || "";

            isiPilihanIuran(iuranLama, kelas);
            isiPilihanSiswa(
                siswaLama,
                cariIuran($("inputIuran")?.value)?.id_kelas || kelas
            );
        });

        $("formTransaksi")?.addEventListener("submit", simpanTransaksi);

        $("isiTabelTransaksi")?.addEventListener("click", (e) => {
            const tombol = e.target.closest("button[data-aksi]");
            if (!tombol) return;
            const { aksi, id } = tombol.dataset;
            if (aksi === "detail") bukaDetail(id);
            if (aksi === "ubah") bukaFormUbah(id);
            if (aksi === "hapus") bukaHapus(id);
        });

        $("btnKonfirmasiHapus")?.addEventListener("click", jalankanHapus);

        document.querySelectorAll("[data-tutup-modal]").forEach(tombol => {
            tombol.addEventListener("click", () => tutupModal(tombol.dataset.tutupModal));
        });

        document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
            backdrop.addEventListener("mousedown", (e) => {
                if (e.target === backdrop) tutupModal(backdrop.id);
            });
        });

        const radioJenis = document.querySelectorAll('input[name="jenisTransaksi"]');
        radioJenis.forEach(radio => {
            radio.addEventListener("change", () => {
                // Saat jenis diganti, kategori otomatis dipindah ke
                // kategori pertama yang sah untuk jenis itu supaya
                // kombinasi jenis + kategori selalu valid di server.
                pilihKategoriPertamaSesuaiJenis();
                sesuaikanLabelJenis();
                perbaruiVisibilitasPembayaran();
            });
        });

        // Saat pengguna memilih kategori, jenis ikut menyesuaikan.
        $("inputKategori")?.addEventListener("change", sesuaikanJenisKeKategori);
    };

    /**
     * Pindahkan pilihan kategori ke kategori pertama yang sah untuk
     * jenis yang sedang aktif (mencegah kombinasi tidak valid).
     */
    const pilihKategoriPertamaSesuaiJenis = () => {
        const pilih = $("inputKategori");
        if (!pilih) return;

        const daftar = jenisTerpilih() === "masuk" ? KATEGORI_MASUK : KATEGORI_KELUAR;
        const pertama = daftar[0];

        if (pertama && [...pilih.options].some(o => o.value === pertama)) {
            pilih.value = pertama;
        }
    };

    /* ============================================================
       JALANKAN
       ============================================================ */
    pasangInteraksiUmum();
    pasangEvent();

    // Kategori diambil lebih dulu supaya form & filter memakai daftar
    // yang sama dengan server sejak halaman dibuka.
    muatKategori().finally(muatData);

})();
