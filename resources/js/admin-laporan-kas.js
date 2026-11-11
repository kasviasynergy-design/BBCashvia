/* ============================================================
   BBCASHVIA - HALAMAN LAPORAN KAS (ADMIN)
   Data transaksi berasal dari API Laravel (database).
   ============================================================ */

(function () {
    "use strict";


    /* |======================================================================
    |  KONFIGURASI API
    |====================================================================== */

    const API_URL = "/admin/api/transaksi";


    /* |======================================================================
    |  DAFTAR KATEGORI (UNTUK FILTER)
    |====================================================================== */

    const KATEGORI_MASUK = [
        "Iuran",
        "kas",
        "pemasukan lainnya"
    ];

    const KATEGORI_KELUAR = [
        "kebutuhan kelas",
        "perlengkapan kelas",
        "kegiatan kelas",
        "pengeluaran lainnya"
    ];

    /*
     * Nilai kategori mengikuti isi database (huruf kecil),
     * sedangkan "label" dipakai untuk tampilan agar tetap rapi.
     */
    const KATEGORI = [
        { value: "Iuran", label: "Iuran" },
        { value: "kas", label: "Kas" },
        { value: "pemasukan lainnya", label: "Pemasukan Lainnya" },
        { value: "kebutuhan kelas", label: "Kebutuhan Kelas" },
        { value: "perlengkapan kelas", label: "Perlengkapan Kelas" },
        { value: "kegiatan kelas", label: "Kegiatan Kelas" },
        { value: "pengeluaran lainnya", label: "Pengeluaran Lainnya" }
    ];

    /* Ubah nilai kategori menjadi label yang enak dibaca. */
    const labelKategori = (nilai) => {
        const cocok = KATEGORI.find(
            (k) => k.value.toLowerCase() === String(nilai ?? "").toLowerCase()
        );

        return cocok ? cocok.label : String(nilai ?? "");
    };

    let DATA_TRANSAKSI = [];

    /* ============================================================
       AKSES API
    ============================================================ */

    const permintaanAPI = async (url, opsi = {}) => {

        let respons;

        try {
            respons = await fetch(url, {
                ...opsi,
                headers: {
                    Accept: "application/json",
                    ...(opsi.headers || {})
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
            // Respons bukan JSON.
        }

        if (!respons.ok) {
            throw new Error(
                hasil?.message ||
                "Gagal memuat data transaksi."
            );
        }

        return hasil;
    };

    const petakanTransaksi = (t) => {

        const jenisDb = String(t.jenis ?? "").toUpperCase();

        const tanggal = String(t.tanggal_format ?? t.tanggal ?? "").slice(0, 10);

        // Jam WIB dari backend; created_at hanya cadangan.
        let waktu = String(t.waktu ?? "").trim();

        if (!waktu && t.created_at) {
            const cocok = String(t.created_at)
                .match(/[T ](\d{2}):(\d{2})/);

            if (cocok) {
                waktu = cocok[1] + ":" + cocok[2];
            }
        }

        const nominal = Number(t.nominal) || 0;
        const diterima = Number(t.uang_diterima) || nominal;

        return {
            id: t.no_bukti || ("TRX-" + (t.id_transaksi ?? "")),
            jenis: (jenisDb === "PENGELUARAN" || jenisDb === "K") ? "keluar" : "masuk",
            kategori: t.kategori ?? "",
            keterangan: t.keterangan ?? "",
            kelas: t.nama_kelas ?? "",
            tanggal: tanggal,
            waktu: waktu || "-",
            tagihan: nominal,
            diterima: diterima,
            status: "verifikasi",
            petugas: t.dicatat_oleh ?? t.pic ?? t.nama_pembayar ?? ""
        };
    };

    const muatData = async () => {

        try {
            const hasil = await permintaanAPI(API_URL);

            const data =
                Array.isArray(hasil.data)
                    ? hasil.data
                    : [];

            DATA_TRANSAKSI = data.map(petakanTransaksi);

            isiPilihanTahun();
            isiPilihanKategori();
            terapkanFilter();
        } catch (error) {

            console.error(
                "Gagal memuat data laporan:",
                error
            );

            DATA_TRANSAKSI = [];

            terapkanFilter();
        }
    };


    /* |======================================================================
    |  UTILITAS
    |====================================================================== */

    const $ = (id) => document.getElementById(id);

    const formatRupiah = (angka) => {
        const n = Number(angka) || 0;
        return "Rp " + n.toLocaleString("id-ID");
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

        if (Number.isNaN(d.getTime())) return String(iso ?? "");

        return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    };

    const BULAN_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const BULAN_PANJANG = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const namaBulan = (iso) => {
        const [th, bl] = iso.split("-");
        return BULAN_ID[parseInt(bl, 10) - 1] + " " + th;
    };

    /* Format ringkas untuk label grafik: 1,5jt / 320rb / 0 */
    const formatRingkas = (angka) => {
        const n = Number(angka) || 0;
        if (n >= 1000000) {
            const juta = n / 1000000;
            return juta.toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "jt";
        }
        if (n >= 1000) {
            return Math.round(n / 1000).toLocaleString("id-ID") + "rb";
        }
        return n.toLocaleString("id-ID");
    };

    const escapeHtml = (teks) => {
        return String(teks ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    };

    /* Nominal efektif yang benar-benar masuk/keluar kas */
    const hitungMasukKas = (tagihan, diterima) => Math.min(Number(tagihan) || 0, Number(diterima) || 0);

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


    /* |======================================================================
    |  STATE
    |====================================================================== */

    let hasilFilter = [];


    /* |======================================================================
    |  TOAST
    |====================================================================== */

    let toastTimer = null;

    const tampilkanToast = (pesan) => {
        const toast = $("toast");
        $("toastText").textContent = pesan;
        toast.classList.add("is-muncul");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("is-muncul"), 2800);
    };


    /* |======================================================================
    |  PILIHAN FILTER DINAMIS
    |====================================================================== */

    const isiPilihanBulan = () => {
        const pilih = $("filterBulan");
        pilih.innerHTML = `<option value="semua">Semua Bulan</option>` +
            BULAN_PANJANG.map((nama, i) => `<option value="${String(i + 1).padStart(2, "0")}">${nama}</option>`).join("");
    };

    const isiPilihanTahun = () => {
        const tahun = [...new Set(DATA_TRANSAKSI.map((t) => t.tanggal.slice(0, 4)))].sort().reverse();
        $("filterTahun").innerHTML = `<option value="semua">Semua Tahun</option>` +
            tahun.map((th) => `<option value="${th}">${th}</option>`).join("");
    };

    const isiPilihanKategori = () => {
        const pilihJenis = $("filterJenis").value;
        const pilihKategori = $("filterKategori");
        const nilaiLama = pilihKategori.value;

        const daftar = pilihJenis === "masuk" ? KATEGORI_MASUK
            : pilihJenis === "keluar" ? KATEGORI_KELUAR
                : [...KATEGORI_MASUK, ...KATEGORI_KELUAR];

        pilihKategori.innerHTML = `<option value="semua">Semua Kategori</option>` +
            daftar.map((k) => `<option value="${escapeHtml(k)}">${escapeHtml(labelKategori(k))}</option>`).join("");

        if ([...pilihKategori.options].some((o) => o.value === nilaiLama)) {
            pilihKategori.value = nilaiLama;
        } else {
            pilihKategori.value = "semua";
        }
    };


    /* |======================================================================
    |  FILTER
    |====================================================================== */

    /*
     * Nilai select "tanpa filter" bisa berupa "semua" (markup halaman)
     * atau string kosong (mis. setelah pilihan lama tidak ada lagi).
     * Keduanya diperlakukan sama: TIDAK menyaring apa pun, supaya data
     * tidak pernah kosong hanya karena nilai filter tidak dikenali.
     */
    const tanpaFilter = (nilai) => {
        const teks = String(nilai ?? "").trim().toLowerCase();
        return teks === "" || teks === "semua" || teks === "all";
    };

    /* Ambil nilai sebuah select tanpa membuat halaman berhenti. */
    const nilaiFilter = (id) => {
        const el = $(id);
        return el ? String(el.value ?? "") : "";
    };

    const terapkanFilter = () => {
        const mulai = nilaiFilter("filterMulai");
        const selesai = nilaiFilter("filterSelesai");
        const bulan = nilaiFilter("filterBulan");
        const tahun = nilaiFilter("filterTahun");
        const jenis = nilaiFilter("filterJenis");
        const kategori = nilaiFilter("filterKategori");

        hasilFilter = DATA_TRANSAKSI.filter((t) => {
            if (mulai && t.tanggal < mulai) return false;
            if (selesai && t.tanggal > selesai) return false;
            if (!tanpaFilter(bulan) && t.tanggal.slice(5, 7) !== bulan) return false;
            if (!tanpaFilter(tahun) && t.tanggal.slice(0, 4) !== tahun) return false;
            if (!tanpaFilter(jenis) && t.jenis !== jenis) return false;
            if (
                !tanpaFilter(kategori) &&
                String(t.kategori ?? "").toLowerCase() !==
                    String(kategori).toLowerCase()
            ) return false;
            return true;
        }).sort((a, b) => (a.tanggal < b.tanggal ? -1 : a.tanggal > b.tanggal ? 1 : 0));

        renderRingkasan();
        renderGrafik();
        renderTabel();
    };

    const resetFilter = () => {
        $("filterMulai").value = "";
        $("filterSelesai").value = "";
        $("filterBulan").value = "semua";
        $("filterTahun").value = "semua";
        $("filterJenis").value = "semua";
        isiPilihanKategori();
        $("filterKategori").value = "semua";
        terapkanFilter();
    };


    /* |======================================================================
    |  TEKS PERIODE
    |====================================================================== */

    const teksPeriode = () => {
        if (hasilFilter.length === 0) return "Periode: -";

        const awal = hasilFilter[0].tanggal;
        const akhir = hasilFilter[hasilFilter.length - 1].tanggal;

        if (awal === akhir) {
            return `Periode: ${formatTanggal(awal)} • ${hasilFilter.length} transaksi`;
        }
        return `Periode: ${formatTanggal(awal)} – ${formatTanggal(akhir)} • ${hasilFilter.length} transaksi`;
    };


    /* |======================================================================
    |  RINGKASAN
    |====================================================================== */

    const renderRingkasan = () => {
        const masuk = hasilFilter.filter((t) => t.jenis === "masuk")
            .reduce((tot, t) => tot + hitungMasukKas(t.tagihan, t.diterima), 0);
        const keluar = hasilFilter.filter((t) => t.jenis === "keluar")
            .reduce((tot, t) => tot + hitungMasukKas(t.tagihan, t.diterima), 0);
        const saldo = masuk - keluar;

        $("sumMasuk").textContent = formatRupiah(masuk);
        $("sumKeluar").textContent = formatRupiah(keluar);
        $("sumSaldo").textContent = formatRupiah(saldo);
        $("sumJumlah").textContent = hasilFilter.length;

        const n = hasilFilter.length;
        const catatan = n ? `dari ${n} transaksi terfilter` : "tidak ada transaksi";
        $("sumMasukNote").textContent = catatan;
        $("sumKeluarNote").textContent = catatan;
        $("sumJumlahNote").textContent = catatan;

        $("tabelInfo").textContent = `${n} transaksi ditampilkan`;
        $("printPeriode").textContent = teksPeriode();
    };


    /* |======================================================================
    |  GRAFIK ARUS KAS (BATANG CSS MURNI)
    |====================================================================== */

    const TINGGI_MAKS = 150; /* px, ruang untuk batang di dalam .bar-pasangan 190px */

    const renderGrafik = () => {
        const wadah = $("barChart");
        const kosong = $("grafikKosong");

        if (hasilFilter.length === 0) {
            wadah.innerHTML = "";
            kosong.hidden = false;
            wadah.setAttribute("aria-label", "Grafik batang arus kas per bulan - tidak ada data");
            return;
        }

        /* Kelompokkan total masuk/keluar per bulan (YYYY-MM), urut kronologis */
        const perBulan = new Map();
        hasilFilter.forEach((t) => {
            const kunci = t.tanggal.slice(0, 7);
            const nominal = hitungMasukKas(t.tagihan, t.diterima);
            if (!perBulan.has(kunci)) {
                perBulan.set(kunci, { masuk: 0, keluar: 0 });
            }
            const g = perBulan.get(kunci);
            g[t.jenis] += nominal;
        });

        const grup = [...perBulan.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
        const nilaiMaks = Math.max(...grup.flatMap(([, g]) => [g.masuk, g.keluar]), 1);

        const barisGrafik = grup.map(([kunci, g]) => {
            const [th, bl] = kunci.split("-");
            const label = BULAN_ID[parseInt(bl, 10) - 1] + " " + th;
            const tinggiMasuk = Math.max(4, Math.round((g.masuk / nilaiMaks) * TINGGI_MAKS));
            const tinggiKeluar = Math.max(4, Math.round((g.keluar / nilaiMaks) * TINGGI_MAKS));

            return `
                <div class="bar-grup">
                    <div class="bar-pasangan">
                        <div class="bar-kolom">
                            <span class="bar__nilai">${formatRingkas(g.masuk)}</span>
                            <div class="bar bar--masuk" style="height:${tinggiMasuk}px"></div>
                        </div>
                        <div class="bar-kolom">
                            <span class="bar__nilai">${formatRingkas(g.keluar)}</span>
                            <div class="bar bar--keluar" style="height:${tinggiKeluar}px"></div>
                        </div>
                    </div>
                    <span class="bar__label">${label}</span>
                </div>`;
        }).join("");

        wadah.innerHTML = barisGrafik;
        kosong.hidden = true;

        const ringkas = grup.map(([kunci, g]) => {
            const [th, bl] = kunci.split("-");
            return `${BULAN_ID[parseInt(bl, 10) - 1]} ${th}: masuk ${formatRupiah(g.masuk)}, keluar ${formatRupiah(g.keluar)}`;
        }).join("; ");
        wadah.setAttribute("aria-label", `Grafik batang arus kas per bulan - ${ringkas}`);
    };


    /* |======================================================================
    |  TABEL BUKU KAS + SALDO BERJALAN
    |====================================================================== */

    const renderTabel = () => {
        const tbody = $("isiTabelLaporan");
        const tfoot = $("footTabelLaporan");
        const kosong = $("emptyState");

        if (hasilFilter.length === 0) {
            tbody.innerHTML = "";
            tfoot.innerHTML = "";
            kosong.hidden = false;
            return;
        }

        let saldo = 0;
        let totalMasuk = 0;
        let totalKeluar = 0;

        const baris = hasilFilter.map((t) => {
            const nominal = hitungMasukKas(t.tagihan, t.diterima);
            const kelas = t.kelas ? `<span class="cell-keterangan__sub">${escapeHtml(t.kelas)} • ${escapeHtml(t.id)}</span>` : "";
            const chip = chipKategori(t.kategori);

            if (t.jenis === "masuk") {
                saldo += nominal;
                totalMasuk += nominal;
            } else {
                saldo -= nominal;
                totalKeluar += nominal;
            }

            return `
                <tr>
                    <td class="cell-tanggal">
                        <div class="cell-tanggal__utama">${formatTanggal(t.tanggal)}</div>
                        <div class="cell-tanggal__sub">${escapeHtml(t.waktu)} WIB</div>
                    </td>
                    <td class="cell-keterangan">
                        <div class="cell-keterangan__utama">${escapeHtml(t.keterangan)}</div>
                        ${kelas}
                    </td>
                    <td><span class="chip ${chip}">${escapeHtml(labelKategori(t.kategori))}</span></td>
                    <td class="td-r">${t.jenis === "masuk" ? formatRupiah(nominal) : '<span class="cell-kosong">-</span>'}</td>
                    <td class="td-r">${t.jenis === "keluar" ? formatRupiah(nominal) : '<span class="cell-kosong">-</span>'}</td>
                    <td class="td-r"><span class="cell-saldo">${formatRupiah(saldo)}</span></td>
                </tr>`;
        }).join("");

        tbody.innerHTML = baris;
        tfoot.innerHTML = `
            <tr>
                <td colspan="3">Total Periode (${hasilFilter.length} transaksi)</td>
                <td class="td-uang td-uang--masuk">${formatRupiah(totalMasuk)}</td>
                <td class="td-uang td-uang--keluar">${formatRupiah(totalKeluar)}</td>
                <td class="td-uang td-uang--saldo">${formatRupiah(saldo)}</td>
            </tr>`;
        kosong.hidden = true;
    };


    /* |======================================================================
    |  CETAK + EXPORT CSV
    |====================================================================== */

    const cetakLaporan = () => {
        $("printPeriode").textContent = teksPeriode();
        window.print();
    };

    const eksporCsv = () => {
        if (hasilFilter.length === 0) {
            tampilkanToast("Tidak ada data untuk diekspor.");
            return;
        }

        const baris = [
            ["Tanggal", "ID Transaksi", "Keterangan", "Kelas", "Kategori", "Jenis", "Pemasukan", "Pengeluaran", "Saldo"]
        ];

        let saldo = 0;
        hasilFilter.forEach((t) => {
            const nominal = hitungMasukKas(t.tagihan, t.diterima);
            if (t.jenis === "masuk") {
                saldo += nominal;
            } else {
                saldo -= nominal;
            }
            baris.push([
                t.tanggal,
                t.id,
                t.keterangan,
                t.kelas || "-",
                t.kategori,
                t.jenis === "masuk" ? "Pemasukan" : "Pengeluaran",
                t.jenis === "masuk" ? nominal : 0,
                t.jenis === "keluar" ? nominal : 0,
                saldo
            ]);
        });

        const totalMasuk = hasilFilter.filter((t) => t.jenis === "masuk").reduce((s, t) => s + hitungMasukKas(t.tagihan, t.diterima), 0);
        const totalKeluar = hasilFilter.filter((t) => t.jenis === "keluar").reduce((s, t) => s + hitungMasukKas(t.tagihan, t.diterima), 0);
        baris.push([]);
        baris.push(["Total", "", "", "", "", "", totalMasuk, totalKeluar, totalMasuk - totalKeluar]);

        /* BOM + pemisah titik koma agar angka terbaca langsung di Excel Indonesia */
        const csv = "\uFEFF" + baris.map((r) =>
            r.map((sel) => {
                const teks = String(sel ?? "");
                return /[";\n]/.test(teks) ? `"${teks.replaceAll('"', '""')}"` : teks;
            }).join(";")
        ).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `laporan-kas-bbcashvia-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        tampilkanToast("Laporan kas berhasil diekspor ke CSV.");
    };


    /* |======================================================================
    |  INTERAKSI UMUM (SIDEBAR + DROPDOWN PROFIL)
    |====================================================================== */

    const pasangInteraksiUmum = () => {
        const sidebar = $("sidebar");
        const backdrop = $("sidebarBackdrop");
        const toggle = $("sidebarToggle");
        const profileBtn = $("profileBtn");
        const profileMenu = $("profileMenu");

        const tutupSidebar = () => {
            document.body.classList.remove("nav-open");
            toggle.setAttribute("aria-expanded", "false");
        };

        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const terbuka = document.body.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", terbuka ? "true" : "false");
        });

        backdrop.addEventListener("click", tutupSidebar);

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024) tutupSidebar();
        });

        const tutupDropdown = () => {
            profileMenu.classList.remove("is-open");
            profileBtn.setAttribute("aria-expanded", "false");
        };

        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const terbuka = profileMenu.classList.toggle("is-open");
            profileBtn.setAttribute("aria-expanded", terbuka ? "true" : "false");
        });

        document.addEventListener("click", (e) => {
            if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
                tutupDropdown();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                tutupDropdown();
                tutupSidebar();
            }
        });

        const now = new Date();
        $("topbarDate").textContent = now.toLocaleDateString("id-ID", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
    };


    /* |======================================================================
    |  INIT
    |====================================================================== */

    const init = () => {
        isiPilihanBulan();
        isiPilihanTahun();
        isiPilihanKategori();

        pasangInteraksiUmum();
        terapkanFilter();

        $("filterMulai").addEventListener("change", terapkanFilter);
        $("filterSelesai").addEventListener("change", terapkanFilter);
        $("filterBulan").addEventListener("change", terapkanFilter);
        $("filterTahun").addEventListener("change", terapkanFilter);
        $("filterJenis").addEventListener("change", () => {
            isiPilihanKategori();
            terapkanFilter();
        });
        $("filterKategori").addEventListener("change", terapkanFilter);
        $("btnResetFilter").addEventListener("click", resetFilter);
        $("btnKosongkanFilter").addEventListener("click", resetFilter);

        /*
         * Tombol cetak & ekspor dilepas dari halaman ini.
         * Dipasang hanya bila elemennya ada, supaya halaman tidak
         * berhenti karena error saat data belum sempat dimuat.
         */
        const btnCetak = $("btnCetak");
        if (btnCetak) {
            btnCetak.addEventListener("click", cetakLaporan);
        }

        const btnEkspor = $("btnEkspor");
        if (btnEkspor) {
            btnEkspor.addEventListener("click", eksporCsv);
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        init();
        muatData();
    });

})();
