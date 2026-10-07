/* ============================================================
   BBCASHVIA — HALAMAN LAPORAN KAS (ADMIN)
   Data dummy + interaksi UI (tanpa koneksi database / API)
   ============================================================ */

(function () {
    "use strict";


    /* |======================================================================
    |  DATA DUMMY
    |====================================================================== */

    const KATEGORI_MASUK = ["Iuran", "Kas", "Pemasukan lainnya"];
    const KATEGORI_KELUAR = ["Kebutuhan kelas", "Perlengkapan kelas", "Kegiatan kelas", "Pengeluaran lainnya"];

    /* Saldo kas sebelum periode data dummy (1 Agustus 2026) */
    const SALDO_AWAL = 1250000;

    const DATA_TRANSAKSI = [
        { id: "TRX-0102", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas awal tahun ajaran", kelas: "XI RPL 1", tanggal: "2026-08-11", waktu: "08:40", tagihan: 350000, diterima: 400000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0103", jenis: "keluar", kategori: "Kegiatan kelas", keterangan: "Dekorasi kelas menyambut tahun ajaran", kelas: "XI RPL 2", tanggal: "2026-08-14", waktu: "13:25", tagihan: 130000, diterima: 150000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0104", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "X TKJ 1", tanggal: "2026-08-18", waktu: "09:10", tagihan: 260000, diterima: 300000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0105", jenis: "masuk", kategori: "Kas", keterangan: "Sisa dana orientasi kelas", kelas: "XI RPL 1", tanggal: "2026-08-20", waktu: "14:35", tagihan: 175000, diterima: 175000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0106", jenis: "keluar", kategori: "Perlengkapan kelas", keterangan: "Pembelian sapu dan penghapus papan", kelas: "X TKJ 1", tanggal: "2026-08-21", waktu: "10:50", tagihan: 75000, diterima: 75000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0107", jenis: "masuk", kategori: "Iuran", keterangan: "Iuran seragam olahraga", kelas: "XI RPL 2", tanggal: "2026-08-25", waktu: "11:05", tagihan: 450000, diterima: 500000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0108", jenis: "keluar", kategori: "Kebutuhan kelas", keterangan: "Belanja alat kebersihan awal tahun", kelas: "XI RPL 1", tanggal: "2026-08-27", waktu: "15:40", tagihan: 90000, diterima: 100000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0109", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "XI RPL 1", tanggal: "2026-08-28", waktu: "08:20", tagihan: 300000, diterima: 300000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0110", jenis: "masuk", kategori: "Kas", keterangan: "Sisa kas kegiatan lomba kelas", kelas: "XI RPL 2", tanggal: "2026-09-15", waktu: "10:10", tagihan: 250000, diterima: 250000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0111", jenis: "keluar", kategori: "Perlengkapan kelas", keterangan: "Pembelian kipas untuk kelas", kelas: "XI RPL 1", tanggal: "2026-09-16", waktu: "09:50", tagihan: 145000, diterima: 145000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0112", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "X TKJ 1", tanggal: "2026-09-18", waktu: "15:00", tagihan: 280000, diterima: 300000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0113", jenis: "keluar", kategori: "Kebutuhan kelas", keterangan: "Biaya fotokopi modul latihan", kelas: "XI RPL 1", tanggal: "2026-09-19", waktu: "11:15", tagihan: 75000, diterima: 80000, status: "menunggu", petugas: "Azis N." },
        { id: "TRX-0114", jenis: "masuk", kategori: "Iuran", keterangan: "Iuran study tour tahap 1", kelas: "XI RPL 2", tanggal: "2026-09-22", waktu: "08:30", tagihan: 1500000, diterima: 1500000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0115", jenis: "masuk", kategori: "Pemasukan lainnya", keterangan: "Sumbangan alumni untuk rak buku", kelas: "XI RPL 1", tanggal: "2026-09-24", waktu: "14:55", tagihan: 400000, diterima: 400000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0116", jenis: "keluar", kategori: "Perlengkapan kelas", keterangan: "Pembelian papan data kelas", kelas: "X TKJ 1", tanggal: "2026-09-25", waktu: "10:40", tagihan: 120000, diterima: 150000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0117", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "XI RPL 2", tanggal: "2026-09-26", waktu: "09:20", tagihan: 300000, diterima: 350000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0118", jenis: "keluar", kategori: "Kebutuhan kelas", keterangan: "Belanja tisu, sabun, dan pembersih kelas", kelas: "XI RPL 1", tanggal: "2026-09-27", waktu: "13:05", tagihan: 65000, diterima: 65000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0119", jenis: "keluar", kategori: "Kegiatan kelas", keterangan: "Konsumsi rapat class meeting", kelas: "XI RPL 2", tanggal: "2026-09-28", waktu: "11:30", tagihan: 95000, diterima: 100000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0120", jenis: "masuk", kategori: "Pemasukan lainnya", keterangan: "Refund dekorasi ruang kelas", kelas: "XI RPL 1", tanggal: "2026-09-29", waktu: "14:20", tagihan: 150000, diterima: 150000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0121", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "X TKJ 1", tanggal: "2026-09-30", waktu: "08:55", tagihan: 280000, diterima: 300000, status: "menunggu", petugas: "Azis N." },
        { id: "TRX-0122", jenis: "masuk", kategori: "Iuran", keterangan: "Iuran study tour tahap 2", kelas: "XI RPL 2", tanggal: "2026-10-01", waktu: "10:05", tagihan: 1500000, diterima: 1500000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0123", jenis: "keluar", kategori: "Kegiatan kelas", keterangan: "Pembelian tinta printer rapat", kelas: "XI RPL 1", tanggal: "2026-10-02", waktu: "15:12", tagihan: 85000, diterima: 100000, status: "verifikasi", petugas: "Azis N." },
        { id: "TRX-0124", jenis: "masuk", kategori: "Iuran", keterangan: "Setoran kas mingguan", kelas: "XI RPL 1", tanggal: "2026-10-03", waktu: "09:41", tagihan: 320000, diterima: 320000, status: "verifikasi", petugas: "Azis N." }
    ];


    /* |======================================================================
    |  UTILITAS
    |====================================================================== */

    const $ = (id) => document.getElementById(id);

    const formatRupiah = (angka) => {
        const n = Number(angka) || 0;
        return "Rp " + n.toLocaleString("id-ID");
    };

    const formatTanggal = (iso) => {
        const d = new Date(iso + "T00:00:00");
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
        "Iuran": "chip--iuran",
        "Kas": "chip--kas",
        "Pemasukan lainnya": "chip--masuk-lain",
        "Kebutuhan kelas": "chip--butuh",
        "Perlengkapan kelas": "chip--perlengkapan",
        "Kegiatan kelas": "chip--kegiatan",
        "Pengeluaran lainnya": "chip--keluar-lain"
    };


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
            daftar.map((k) => `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`).join("");

        if ([...pilihKategori.options].some((o) => o.value === nilaiLama)) {
            pilihKategori.value = nilaiLama;
        } else {
            pilihKategori.value = "semua";
        }
    };


    /* |======================================================================
    |  FILTER
    |====================================================================== */

    const terapkanFilter = () => {
        const mulai = $("filterMulai").value;
        const selesai = $("filterSelesai").value;
        const bulan = $("filterBulan").value;
        const tahun = $("filterTahun").value;
        const jenis = $("filterJenis").value;
        const kategori = $("filterKategori").value;

        hasilFilter = DATA_TRANSAKSI.filter((t) => {
            if (mulai && t.tanggal < mulai) return false;
            if (selesai && t.tanggal > selesai) return false;
            if (bulan !== "semua" && t.tanggal.slice(5, 7) !== bulan) return false;
            if (tahun !== "semua" && t.tanggal.slice(0, 4) !== tahun) return false;
            if (jenis !== "semua" && t.jenis !== jenis) return false;
            if (kategori !== "semua" && t.kategori !== kategori) return false;
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
        if (hasilFilter.length === 0) return "Periode: —";

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
        const saldo = SALDO_AWAL + masuk - keluar;

        $("sumMasuk").textContent = formatRupiah(masuk);
        $("sumKeluar").textContent = formatRupiah(keluar);
        $("sumSaldo").textContent = formatRupiah(saldo);
        $("sumJumlah").textContent = hasilFilter.length;

        const n = hasilFilter.length;
        const catatan = n ? `dari ${n} transaksi terfilter` : "tidak ada transaksi";
        $("sumMasukNote").textContent = catatan;
        $("sumKeluarNote").textContent = catatan;
        $("sumJumlahNote").textContent = catatan;
        $("sumSaldoNote").textContent = `saldo awal ${formatRupiah(SALDO_AWAL)} + pemasukan − pengeluaran`;

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
            wadah.setAttribute("aria-label", "Grafik batang arus kas per bulan — tidak ada data");
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
        wadah.setAttribute("aria-label", `Grafik batang arus kas per bulan — ${ringkas}`);
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

        let saldo = SALDO_AWAL;
        let totalMasuk = 0;
        let totalKeluar = 0;

        const baris = hasilFilter.map((t) => {
            const nominal = hitungMasukKas(t.tagihan, t.diterima);
            const kelas = t.kelas ? `<span class="cell-keterangan__sub">${escapeHtml(t.kelas)} • ${escapeHtml(t.id)}</span>` : "";
            const chip = CHIP_KATEGORI[t.kategori] || "chip--keluar-lain";

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
                    <td><span class="chip ${chip}">${escapeHtml(t.kategori)}</span></td>
                    <td class="td-r">${t.jenis === "masuk" ? formatRupiah(nominal) : '<span class="cell-kosong">—</span>'}</td>
                    <td class="td-r">${t.jenis === "keluar" ? formatRupiah(nominal) : '<span class="cell-kosong">—</span>'}</td>
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

        let saldo = SALDO_AWAL;
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
        baris.push(["Total", "", "", "", "", "", totalMasuk, totalKeluar, SALDO_AWAL + totalMasuk - totalKeluar]);

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

        $("btnCetak").addEventListener("click", cetakLaporan);
        $("btnEkspor").addEventListener("click", eksporCsv);
    };

    document.addEventListener("DOMContentLoaded", init);

})();
