/* ============================================================
   BBCASHVIA — ADMIN DASHBOARD (FRONTEND SIMULASI)
   ------------------------------------------------------------
   Semua data di bawah adalah DATA DUMMY untuk keperluan
   tampilan. Belum ada koneksi database / API.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* |======================================================================
    |  DATA DUMMY
    |====================================================================== */

    const dataKas = {
        saldoAwal: 3000000,
        totalPemasukan: 8900000,
        totalPengeluaran: 3450000,
        totalIuran: 7800000,
        targetIuran: 9000000,
        jumlahSiswa: 36,
        siswaBelumLunas: 12,
        totalTransaksi: 124,
    };

    const arusBulanan = [
        { bulan: "Mei", masuk: 1100000, keluar: 420000 },
        { bulan: "Jun", masuk: 1350000, keluar: 510000 },
        { bulan: "Jul", masuk: 1500000, keluar: 480000 },
        { bulan: "Agu", masuk: 1250000, keluar: 610000 },
        { bulan: "Sep", masuk: 1700000, keluar: 720000 },
        { bulan: "Okt", masuk: 2000000, keluar: 710000 }
    ];

    const saldoBulanan = [
        { bulan: "Apr", saldo: 3000000 },
        { bulan: "Mei", saldo: 3680000 },
        { bulan: "Jun", saldo: 4520000 },
        { bulan: "Jul", saldo: 5540000 },
        { bulan: "Agu", saldo: 6180000 },
        { bulan: "Sep", saldo: 7160000 },
        { bulan: "Okt", saldo: 8450000 }
    ];

    const transaksiTerbaru = [
        {
            id: "TRX-0124",
            ket: "Setoran kas mingguan",
            unit: "XI RPL 1",
            kategori: "Iuran",
            tipe: "iuran",
            tanggal: "03 Okt 2026",
            jam: "09:41",
            nominal: 320000,
            arah: "masuk",
            status: "Terverifikasi",
            statusTipe: "ok"
        },
        {
            id: "TRX-0123",
            ket: "Pembelian tinta printer rapat",
            unit: "Kegiatan kelas",
            kategori: "Kegiatan Kelas",
            tipe: "keluar",
            tanggal: "02 Okt 2026",
            jam: "15:12",
            nominal: 85000,
            arah: "keluar",
            status: "Terverifikasi",
            statusTipe: "ok"
        },
        {
            id: "TRX-0122",
            ket: "Iuran study tour tahap 2",
            unit: "XI RPL 2",
            kategori: "Iuran",
            tipe: "iuran",
            tanggal: "01 Okt 2026",
            jam: "10:05",
            nominal: 1500000,
            arah: "masuk",
            status: "Terverifikasi",
            statusTipe: "ok"
        },
        {
            id: "TRX-0121",
            ket: "Setoran kas mingguan",
            unit: "X TKJ 1",
            kategori: "Iuran",
            tipe: "iuran",
            tanggal: "30 Sep 2026",
            jam: "08:55",
            nominal: 280000,
            arah: "masuk",
        },
        {
            id: "TRX-0120",
            ket: "Refund dekorasi ruang kelas",
            unit: "Pemasukan lainnya",
            kategori: "Pemasukan Lainnya",
            tipe: "masuk",
            tanggal: "29 Sep 2026",
            jam: "14:20",
            nominal: 150000,
            arah: "masuk",
            statusTipe: "ok"
        },
        {
            id: "TRX-0119",
            ket: "Konsumsi rapat class meeting",
            unit: "Kegiatan kelas",
            kategori: "Kegiatan Kelas",
            tipe: "keluar",
            tanggal: "28 Sep 2026",
            jam: "11:30",
            nominal: 95000,
            arah: "keluar",
            status: "Terverifikasi",
            statusTipe: "ok"
        }
    ];


    /* |======================================================================
    |  UTILITAS
    |====================================================================== */

    const formatRupiah = (nilai) => {
        return "Rp " + new Intl.NumberFormat("id-ID").format(nilai);
    };

    const formatSingkat = (nilai) => {
        if (nilai >= 1000000) {
            const juta = nilai / 1000000;
            const teks = juta % 1 === 0 ? juta.toFixed(0) : juta.toFixed(2).replace(/0$/, "");
            return teks.replace(".", ",") + "jt";
        }
        if (nilai >= 1000) {
            return (nilai / 1000).toFixed(0) + "rb";
        }
        return String(nilai);
    };

    const $ = (selector) => document.querySelector(selector);


    /* |======================================================================
    |  KPI + RINGKASAN KAS
    |====================================================================== */

    const saldoSaatIni =
        dataKas.saldoAwal + dataKas.totalPemasukan - dataKas.totalPengeluaran;

    const isiKpi = () => {
        const map = [
            ["#kpiTotalKas", formatRupiah(saldoSaatIni)],
            ["#kpiPemasukan", formatRupiah(dataKas.totalPemasukan)],
            ["#kpiPengeluaran", formatRupiah(dataKas.totalPengeluaran)],
            ["#kpiIuran", formatRupiah(dataKas.totalIuran)],
            ["#kpiSiswa", dataKas.jumlahSiswa + " siswa"],
            ["#kpiTransaksi", dataKas.totalTransaksi + " transaksi"]
        ];

        map.forEach(([selector, teks]) => {
            const el = $(selector);
            if (el) {
                el.textContent = teks;
            }
        });

        const bar = $("#kpiIuranBar");
        if (bar) {
            const persen = Math.round((dataKas.totalIuran / dataKas.targetIuran) * 100);
            bar.style.width = persen + "%";
        }

        const metaIuran = $("#kpiIuranMeta");
        if (metaIuran) {
            metaIuran.textContent =
                formatRupiah(dataKas.totalIuran) + " dari target " +
                formatRupiah(dataKas.targetIuran);
        }

        const metaSiswa = $("#kpiSiswaMeta");
        if (metaSiswa) {
            metaSiswa.textContent =
                dataKas.siswaBelumLunas + " siswa belum lunas iuran bulan ini";
        }

       const metaTrx = $("#kpiTrxMeta");

        if (metaTrx) {
            metaTrx.textContent = "Seluruh transaksi tercatat";
        }
    };

    const isiRumus = () => {
        const map = [
            ["#rumusAwal", formatRupiah(dataKas.saldoAwal)],
            ["#rumusMasuk", "+ " + formatRupiah(dataKas.totalPemasukan)],
            ["#rumusKeluar", "− " + formatRupiah(dataKas.totalPengeluaran)],
            ["#rumusSekarang", formatRupiah(saldoSaatIni)]
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
| ============================================================ */

const renderBarChart = () => {

    const wadah = document.getElementById("barChart");

    if (!wadah) {
        console.warn("Elemen #barChart tidak ditemukan.");
        return;
    }

    const nilaiMaks = Math.max(
        ...arusBulanan.flatMap((item) => [
            item.masuk,
            item.keluar
        ])
    );

    /*
     * Tambahkan ruang 15% di atas nilai tertinggi
     * supaya batang terakhir tidak mentok.
     */
    const maks = Math.ceil(
        (nilaiMaks * 1.15) / 500000
    ) * 500000;


    const tinggiChart = 300;

    const garis = [
        0,
        0.25,
        0.5,
        0.75,
        1
    ];


    /* LABEL SUMBU Y */

    const labelSumbu = garis
        .map((persen) => {

            const nilai =
                maks * persen;

            return `
                <span>
                    ${formatSingkat(nilai)}
                </span>
            `;

        })
        .join("");


    /* GARIS HORIZONTAL */

    const garisSvg = garis
        .map((persen, index) => {

            const kelas =
                index === 0
                    ? "barchart__gl barchart__gl--base"
                    : "barchart__gl";

            return `
                <i
                    class="${kelas}"
                    style="bottom:${persen * 100}%"
                ></i>
            `;

        })
        .join("");


    /* BATANG */

    const kolom = arusBulanan
        .map((item) => {

            const tinggiMasuk = Math.max(
                2,
                Math.round(
                    (item.masuk / maks) * 100
                )
            );


            const tinggiKeluar = Math.max(
                2,
                Math.round(
                    (item.keluar / maks) * 100
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
                            <i class="barchart__tip">
                                ${formatSingkat(item.masuk)}
                            </i>
                        </div>


                        <div
                            class="barchart__bar barchart__bar--out"
                            style="height:${tinggiKeluar}%"
                            title="Pengeluaran ${item.bulan}: ${formatRupiah(item.keluar)}"
                            aria-label="Pengeluaran ${item.bulan}: ${formatRupiah(item.keluar)}"
                        >
                            <i class="barchart__tip">
                                ${formatSingkat(item.keluar)}
                            </i>
                        </div>

                    </div>


                    <span class="barchart__mon">
                        ${item.bulan}
                    </span>

                </div>
            `;

        })
        .join("");


    /* RENDER */

    wadah.innerHTML = `
        <div class="barchart">

            <div class="barchart__ylabs">
                ${labelSumbu}
            </div>


            <div
                class="barchart__plot"
                style="height:${tinggiChart}px"
            >

                ${garisSvg}

                <div class="barchart__cols">
                    ${kolom}
                </div>

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

        const lebar = 660;
        const tinggi = 300;
        const padKiri = 52;
        const padKanan = 26;
        const padAtas = 26;
        const padBawah = 34;

        const plotW = lebar - padKiri - padKanan;
        const plotH = tinggi - padAtas - padBawah;

        const nilaiMin = 3000000;
        const nilaiMaks = 9000000;
        const jumlah = saldoBulanan.length;

        const titikX = (i) => padKiri + (plotW / (jumlah - 1)) * i;
        const titikY = (v) =>
            padAtas + (1 - (v - nilaiMin) / (nilaiMaks - nilaiMin)) * plotH;

        const gridlines = [3000000, 4500000, 6000000, 7500000, 9000000]
            .map((v) => {
                const y = titikY(v).toFixed(1);
                return `
                    <line class="lc-grid" x1="${padKiri}" y1="${y}" x2="${lebar - padKanan}" y2="${y}"></line>
                    <text x="${padKiri - 8}" y="${y}" text-anchor="end" dominant-baseline="middle">${formatSingkat(v)}</text>`;
            })
            .join("");

        const titik = saldoBulanan
            .map((t, i) => {
                return `${titikX(i).toFixed(1)},${titikY(t.saldo).toFixed(1)}`;
            })
            .join(" ");

        const pertama = saldoBulanan[0];
        const terakhir = saldoBulanan[jumlah - 1];

        const area = `
            M ${titikX(0).toFixed(1)},${titikY(pertama.saldo).toFixed(1)}
            ${saldoBulanan
                .map((t, i) => `L ${titikX(i).toFixed(1)},${titikY(t.saldo).toFixed(1)}`)
                .join(" ")}
            L ${titikX(jumlah - 1).toFixed(1)},${(padAtas + plotH).toFixed(1)}
            L ${titikX(0).toFixed(1)},${(padAtas + plotH).toFixed(1)}
            Z`;

        const lingkaran = saldoBulanan
            .map((t, i) => {
                const isTerakhir = i === jumlah - 1;
                const kelas = isTerakhir ? "lc-dot lc-dot--last" : "lc-dot";
                const r = isTerakhir ? 5.5 : 4;
                return `<circle class="${kelas}" cx="${titikX(i).toFixed(1)}" cy="${titikY(t.saldo).toFixed(1)}" r="${r}"></circle>`;
            })
            .join("");

        const labelNilai = `
            <text class="lc-val" x="${titikX(0).toFixed(1)}" y="${(titikY(pertama.saldo) - 12).toFixed(1)}" text-anchor="start">${formatSingkat(pertama.saldo)}</text>
            <text class="lc-val" x="${titikX(jumlah - 1).toFixed(1)}" y="${(titikY(terakhir.saldo) - 12).toFixed(1)}" text-anchor="end">${formatSingkat(terakhir.saldo)}</text>`;

        const labelBulan = saldoBulanan
            .map((t, i) => {
                return `<text x="${titikX(i).toFixed(1)}" y="${tinggi - 10}" text-anchor="middle">${t.bulan}</text>`;
            })
            .join("");

        wadah.innerHTML = `
            <svg class="linechart" viewBox="0 0 ${lebar} ${tinggi}" role="img"
                 aria-label="Grafik perkembangan saldo kas dari April sampai Oktober 2026">
                ${gridlines}
                <path class="lc-area" d="${area}"></path>
                <polyline class="lc-line" points="${titik}"></polyline>
                ${lingkaran}
                ${labelNilai}
                ${labelBulan}
            </svg>`;
    };



    /* |======================================================================
    |  TABEL TRANSAKSI TERBARU
    |====================================================================== */

    const renderTransaksi = () => {
        const tbody = document.getElementById("recentTxBody");
        if (!tbody) {
            return;
        }

        const baris = transaksiTerbaru
            .map((t) => {
                const tanda = t.arah === "masuk" ? "+" : "−";
                const kelasNominal =
                    t.arah === "masuk" ? "table__nominal--in" : "table__nominal--out";
                const kelasKategori = "table__cat--" + t.tipe;
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
