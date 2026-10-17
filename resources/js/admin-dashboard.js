/* ============================================================
   BBCASHVIA — ADMIN DASHBOARD
   Data dari database sungguhan melalui API Laravel.
   Tidak menggunakan data dummy.
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

    /* |======================================================================
    |  KONSTANTA & UTILITAS
    |====================================================================== */

    const API_BASE = "/admin/api/dashboard";

    const formatRupiah = (nilai) => {
        return "Rp " + new Intl.NumberFormat("id-ID").format(nilai || 0);
    };

    const formatSingkat = (nilai) => {
        const n = Number(nilai) || 0;
        if (n >= 1000000) {
            const juta = n / 1000000;
            const teks = juta % 1 === 0 ? juta.toFixed(0) : juta.toFixed(2).replace(/0$/, "");
            return teks.replace(".", ",") + "jt";
        }
        if (n >= 1000) {
            return (n / 1000).toFixed(0) + "rb";
        }
        return String(n);
    };

    const $ = (selector) => document.querySelector(selector);

    const permintaanAPI = async (url) => {
        const csrf = document.querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        const respons = await fetch(url, {
            headers: {
                Accept: "application/json",
                ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
            },
            credentials: "same-origin",
        });
        if (!respons.ok) {
            throw new Error("Gagal memuat data dari server.");
        }
        return await respons.json();
    };

    /* |======================================================================
    |  AMBIL DATA DARI API
    |====================================================================== */

    let dataKpi = {};
    let dataChart = [];
    let dataRecent = [];

    try {
        const [resKpi, resChart, resRecent] = await Promise.all([
            permintaanAPI(API_BASE + "/"),
            permintaanAPI(API_BASE + "/chart"),
            permintaanAPI(API_BASE + "/recent"),
        ]);

        dataKpi = resKpi.data || resKpi;
        dataChart = resChart.data || resChart;
        dataRecent = resRecent.data || resRecent;
    } catch (error) {
        console.error("Gagal memuat dashboard:", error);
    }

    const kpi = dataKpi.kpi || {};
    const ringkasan = dataKpi.ringkasan || {};

    /* |======================================================================
    |  KPI + RINGKASAN KAS
    |====================================================================== */

    const saldoSaatIni = Number(kpi.total_kas) || 0;

    const isiKpi = () => {
        const map = [
            ["#kpiTotalKas", formatRupiah(saldoSaatIni)],
            ["#kpiPemasukan", formatRupiah(kpi.total_pemasukan)],
            ["#kpiPengeluaran", formatRupiah(kpi.total_pengeluaran)],
            ["#kpiIuran", formatRupiah(kpi.total_iuran)],
            ["#kpiSiswa", kpi.jumlah_siswa + " siswa"],
            ["#kpiTransaksi", kpi.total_transaksi + " transaksi"]
        ];

        map.forEach(([selector, teks]) => {
            const el = $(selector);
            if (el) {
                el.textContent = teks;
            }
        });

        const bar = $("#kpiIuranBar");
        if (bar) {
            const persen = kpi.iuran_target
                ? Math.round((Number(kpi.total_iuran) / Number(kpi.iuran_target)) * 100)
                : 0;
            bar.style.width = Math.min(persen, 100) + "%";
        }

        const metaIuran = $("#kpiIuranMeta");
        if (metaIuran && kpi.iuran_target) {
            metaIuran.textContent =
                formatRupiah(kpi.total_iuran) + " dari target " +
                formatRupiah(kpi.iuran_target);
        }

        const metaSiswa = $("#kpiSiswaMeta");
        if (metaSiswa) {
            metaSiswa.textContent =
                kpi.siswa_belum_lunas + " siswa belum lunas iuran bulan ini";
        }

        const metaTrx = $("#kpiTrxMeta");
        if (metaTrx) {
            metaTrx.textContent = "Seluruh transaksi tercatat";
        }
    };

    const isiRumus = () => {
        const map = [
            ["#rumusAwal", formatRupiah(ringkasan.saldo_awal)],
            ["#rumusMasuk", "+ " + formatRupiah(ringkasan.total_masuk)],
            ["#rumusKeluar", "− " + formatRupiah(ringkasan.total_keluar)],
            ["#rumusSekarang", formatRupiah(ringkasan.saldo_sekarang)]
        ];

        map.forEach(([selector, teks]) => {
            const el = $(selector);
            if (el) {
                el.textContent = teks;
            }
        });
    };

    /* ============================================================
    |  GRAFIK BAR — PEMASUKAN VS PENGELUARAN
    |============================================================ */

    const renderBarChart = () => {
        const wadah = document.getElementById("barChart");
        if (!wadah) {
            return;
        }

        if (!dataChart || dataChart.length === 0) {
            wadah.innerHTML = '<div class="kosong">Data grafik tidak tersedia.</div>';
            return;
        }

        const semuaNilai = dataChart.flatMap((item) => [
            Number(item.masuk) || 0,
            Number(item.keluar) || 0
        ]);
        const nilaiMaks = Math.max(...semuaNilai);

        const maks = Math.ceil(
            (nilaiMaks * 1.15) / 500000
        ) * 500000 || 500000;

        const tinggiChart = 300;
        const garis = [0, 0.25, 0.5, 0.75, 1];

        const labelSumbu = garis
            .map((persen) => {
                const nilai = maks * persen;
                return `<span>${formatSingkat(nilai)}</span>`;
            })
            .join("");

        const garisSvg = garis
            .map((persen, index) => {
                const kelas =
                    index === 0
                        ? "barchart__gl barchart__gl--base"
                        : "barchart__gl";
                return `<i class="${kelas}" style="bottom:${persen * 100}%"></i>`;
            })
            .join("");

        const kolom = dataChart
            .map((item) => {
                const tinggiMasuk = Math.max(
                    2,
                    Math.round(
                        ((Number(item.masuk) || 0) / maks) * 100
                    )
                );
                const tinggiKeluar = Math.max(
                    2,
                    Math.round(
                        ((Number(item.keluar) || 0) / maks) * 100
                    )
                );

                return `
                    <div class="barchart__col">
                        <div class="barchart__pair">
                            <div
                                class="barchart__bar barchart__bar--in"
                                style="height:${tinggiMasuk}%"
                                title="Pemasukan ${item.bulan}: ${formatRupiah(item.masuk)}"
                                aria-label="Pemasukan ${item.bulan}: ${formatRupiah(item.masuk)}"
                            >
                                <i class="barchart__tip">${formatSingkat(item.masuk)}</i>
                            </div>
                            <div
                                class="barchart__bar barchart__bar--out"
                                style="height:${tinggiKeluar}%"
                                title="Pengeluaran ${item.bulan}: ${formatRupiah(item.keluar)}"
                                aria-label="Pengeluaran ${item.bulan}: ${formatRupiah(item.keluar)}"
                            >
                                <i class="barchart__tip">${formatSingkat(item.keluar)}</i>
                            </div>
                        </div>
                        <span class="barchart__mon">${item.bulan}</span>
                    </div>
                `;
            })
            .join("");

        wadah.innerHTML = `
            <div class="barchart">
                <div class="barchart__ylabs">${labelSumbu}</div>
                <div class="barchart__plot" style="height:${tinggiChart}px">
                    ${garisSvg}
                    <div class="barchart__cols">${kolom}</div>
                </div>
            </div>
        `;
    };

    /* |======================================================================
    |  GRAFIK GARIS — PERKEMBANGAN SALDO
    |====================================================================== */

    const renderLineChart = () => {
        const wadah = document.getElementById("lineChart");
        if (!wadah) {
            return;
        }

        wadah.innerHTML = '<div class="kosong">Grafik garis akan tersedia dalam versi mendatang.</div>';
    };

    /* |======================================================================
    |  TABEL TRANSAKSI TERBARU
    |====================================================================== */

    const renderTransaksi = () => {
        const tbody = document.getElementById("recentTxBody");
        if (!tbody) {
            return;
        }

        if (!dataRecent || dataRecent.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="table__empty">Belum ada transaksi.</td>
                </tr>`;
            return;
        }

        const baris = dataRecent
            .map((t) => {
                const tanda = t.arah === "masuk" ? "+" : "−";
                const kelasNominal =
                    t.arah === "masuk" ? "table__nominal--in" : "table__nominal--out";
                const kelasKategori = "table__cat--" + (t.tipe || t.arah || "");
                const kelasStatus =
                    t.statusTipe === "ok" ? "badge--ok" : "badge--warn";

                return `
                    <tr>
                        <td>
                            <div class="table__primary">${t.id}</div>
                            <div class="table__secondary">${t.tanggal} • ${t.jam}</div>
                        </td>
                        <td>
                            <div class="table__primary">${t.ket}</div>
                            <div class="table__secondary">${t.unit}</div>
                        </td>
                        <td>
                            <span class="table__cat ${kelasKategori}">${t.kategori}</span>
                        </td>
                        <td>
                            <div class="table__primary">${t.tanggal}</div>
                            <div class="table__secondary">${t.jam} WIB</div>
                        </td>
                        <td>
                            <span class="table__nominal ${kelasNominal}">${tanda}${formatRupiah(t.nominal)}</span>
                        </td>
                        <td>
                            <span class="badge ${kelasStatus}">${t.status}</span>
                        </td>
                    </tr>`;
            })
            .join("");

        tbody.innerHTML = baris;
    };

    /* |======================================================================
    |  INTERAKSI UI
    |====================================================================== */

    /* --- Sidebar mobile --- */
    const tombolSidebar = document.getElementById("sidebarToggle");
    const backdrop = document.getElementById("sidebarBackdrop");

    const tutupSidebar = () => {
        document.body.classList.remove("nav-open");
    };

    if (tombolSidebar) {
        tombolSidebar.addEventListener("click", () => {
            document.body.classList.toggle("nav-open");
        });
    }

    if (backdrop) {
        backdrop.addEventListener("click", tutupSidebar);
    }

    /* --- Dropdown profil --- */
    const tombolProfil = document.getElementById("profileBtn");
    const menuProfil = document.getElementById("profileMenu");

    const tutupProfil = () => {
        if (menuProfil) {
            menuProfil.classList.remove("is-open");
        }
        if (tombolProfil) {
            tombolProfil.setAttribute("aria-expanded", "false");
        }
    };

    if (tombolProfil && menuProfil) {
        tombolProfil.addEventListener("click", (e) => {
            e.stopPropagation();
            const terbuka = menuProfil.classList.toggle("is-open");
            tombolProfil.setAttribute("aria-expanded", terbuka ? "true" : "false");
        });

        document.addEventListener("click", (e) => {
            if (!menuProfil.contains(e.target) && e.target !== tombolProfil) {
                tutupProfil();
            }
        });
    }

    /* --- Tutup semua dengan tombol Escape --- */
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            tutupSidebar();
            tutupProfil();
        }
    });

    /* --- Tab grafik --- */
    const tabBar = document.getElementById("tabBar");
    const tabLine = document.getElementById("tabLine");
    const tampilanBar = document.getElementById("barChart");
    const tampilanLine = document.getElementById("lineChart");
    const legendBar1 = document.getElementById("legendBar1");
    const legendBar2 = document.getElementById("legendBar2");
    const legendLine = document.getElementById("legendLine");

    const aktifkanTab = (tabAktif) => {
        const keBar = tabAktif === "bar";

        [tabBar, tabLine].forEach((tab) => {
            if (!tab) {
                return;
            }
            const aktif = (tab === tabBar) === keBar;
            tab.classList.toggle("is-active", aktif);
            tab.setAttribute("aria-selected", aktif ? "true" : "false");
        });

        if (tampilanBar) {
            tampilanBar.classList.toggle("is-hidden", !keBar);
        }
        if (tampilanLine) {
            tampilanLine.classList.toggle("is-hidden", keBar);
        }
        if (legendBar1) {
            legendBar1.classList.toggle("is-hidden", !keBar);
        }
        if (legendBar2) {
            legendBar2.classList.toggle("is-hidden", !keBar);
        }
        if (legendLine) {
            legendLine.classList.toggle("is-hidden", keBar);
        }
    };

    if (tabBar) {
        tabBar.addEventListener("click", () => aktifkanTab("bar"));
    }
    if (tabLine) {
        tabLine.addEventListener("click", () => aktifkanTab("line"));
    }

    /* |======================================================================
    |  SAPAAN + TANGGAL
    |====================================================================== */

    const isiSapaan = () => {
        const elSapaan = document.getElementById("greeting");
        if (elSapaan) {
            const jam = new Date().getHours();
            let sapaan = "Selamat malam";
            if (jam >= 4 && jam < 11) {
                sapaan = "Selamat pagi";
            } else if (jam >= 11 && jam < 15) {
                sapaan = "Selamat siang";
            } else if (jam >= 15 && jam < 18) {
                sapaan = "Selamat sore";
            }
            elSapaan.textContent = sapaan;
        }

        const elTanggal = document.getElementById("topbarDate");
        if (elTanggal) {
            elTanggal.textContent = new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }
    };

    /* |======================================================================
    |  JALANKAN
    |====================================================================== */

    isiKpi();
    isiRumus();
    renderBarChart();
    renderLineChart();
    renderTransaksi();
    isiSapaan();
});
