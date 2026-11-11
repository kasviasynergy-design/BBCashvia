/* ============================================================
   BBCASHVIA - HALAMAN RIWAYAT TRANSAKSI (ADMIN)
   Data transaksi berasal dari API Laravel (database).
   Tanpa fitur verifikasi
   ============================================================ */

(function () {
    "use strict";


    /* ============================================================
       KONFIGURASI API
    ============================================================ */

    const API_URL = "/admin/api/transaksi";


    /* ============================================================
       DAFTAR KATEGORI (UNTUK FILTER)
    ============================================================ */

    /*
     * Nilai kategori mengikuti isi database (huruf kecil),
     * sedangkan "label" dipakai untuk tampilan agar tetap rapi.
     * Ini mencegah filter kosong karena beda huruf besar/kecil.
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

        // Jam WIB dikirim backend lewat field "waktu"; created_at
        // hanya dipakai sebagai cadangan.
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

        // Rincian grup dari backend (baris dengan no_bukti sama).
        // Satu pembayaran multi-iuran = satu transaksi utama; semua
        // rinciannya ditampilkan pada modal detail.
        const rincian = Array.isArray(t.rincian) ? t.rincian : [];

        const nominalGrup =
            Number(t.nominal_grup) > 0 ? Number(t.nominal_grup) : nominal;

        const diterimaGrup =
            Number(t.uang_diterima_grup) > 0
                ? Number(t.uang_diterima_grup)
                : diterima;

        return {
            id: t.no_bukti || ("TRX-" + (t.id_transaksi ?? "")),
            no_bukti: t.no_bukti ?? "",
            id_transaksi: t.id_transaksi ?? null,
            jenis: (jenisDb === "PENGELUARAN" || jenisDb === "K") ? "keluar" : "masuk",
            kategori: t.kategori ?? "",
            keterangan: t.keterangan ?? "",
            kelas: t.nama_kelas ?? "",
            tanggal: tanggal,
            waktu: waktu || "-",
            // Nilai grup dipakai untuk baris & ringkasan transaksi utama
            // agar multi-iuran tidak terhitung sebagian.
            tagihan: nominalGrup,
            diterima: diterimaGrup,
            petugas: t.dicatat_oleh ?? t.pic ?? t.nama_pembayar ?? "",
            rincian: rincian,
            jumlah_rincian:
                Number(t.jumlah_rincian) > 0
                    ? Number(t.jumlah_rincian)
                    : rincian.length,
            // Status pembayaran & sisa tagihan dari backend (dihitung
            // dari akumulasi pembayaran; bukan kolom database).
            status_pembayaran: t.status_pembayaran ?? null,
            sisa_tagihan: t.sisa_tagihan !== null && t.sisa_tagihan !== undefined
                ? Number(t.sisa_tagihan)
                : null
        };
    };

    const muatData = async () => {

        try {
            const hasil = await permintaanAPI(API_URL);

            const data =
                Array.isArray(hasil.data)
                    ? hasil.data
                    : [];

            // =====================================================
            // SATU TRANSAKSI UTAMA PER no_bukti
            // =====================================================
            // Backend mengirim satu entri per baris transaksi, namun
            // setiap entri sudah memuat seluruh rincian grup
            // (`rincian`). Di sini kita simpan hanya SATU wakil per
            // no_bukti agar pembayaran multi-iuran (beberapa baris
            // dengan no_bukti sama) tidak muncul sebagai beberapa
            // transaksi utama. Data lama (no_bukti unik per baris)
            // tetap tampil satu per satu seperti semula.
            const perBukti = new Map();

            data.forEach((t) => {
                const kunci =
                    t.no_bukti || ("TRX-" + (t.id_transaksi ?? ""));

                if (!perBukti.has(kunci)) {
                    perBukti.set(kunci, t);
                    return;
                }

                // Bila entri wakil belum punya rincian lengkap,
                // lengkapi dari entri lain di grup yang sama.
                const wakil = perBukti.get(kunci);

                if (
                    (!Array.isArray(wakil.rincian) || wakil.rincian.length === 0) &&
                    Array.isArray(t.rincian)
                ) {
                    wakil.rincian = t.rincian;
                    wakil.nominal_grup = t.nominal_grup;
                    wakil.uang_diterima_grup = t.uang_diterima_grup;
                    wakil.jumlah_rincian = t.jumlah_rincian;
                }
            });

            DATA_TRANSAKSI = Array.from(perBukti.values())
                .map(petakanTransaksi);

            isiPilihanBulan();
            isiPilihanKategori();
            terapkanFilter();
        } catch (error) {

            console.error(
                "Gagal memuat data transaksi:",
                error
            );

            DATA_TRANSAKSI = [];

            terapkanFilter();
        }
    };


    /* ============================================================
       UTILITAS
    ============================================================ */

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

        if (Number.isNaN(d.getTime())) return String(iso);

        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const escapeHtml = (teks) => {
        return String(teks ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    };


    /* ============================================================
       PERHITUNGAN UANG
    ============================================================ */

    const hitungKembalian = (tagihan, diterima) =>
        Math.max(
            0,
            (Number(diterima) || 0) - (Number(tagihan) || 0)
        );

    const hitungMasukKas = (tagihan, diterima) =>
        Math.min(
            Number(tagihan) || 0,
            Number(diterima) || 0
        );


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
       MODAL
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


    /* ============================================================
       FILTER
    ============================================================ */

    const isiPilihanKategori = () => {

        const pilihJenis = $("filterJenis").value;
        const pilihKategori = $("filterKategori");
        const nilaiLama = pilihKategori.value;

        const daftar =
            pilihJenis === "masuk"
                ? KATEGORI_MASUK
                : pilihJenis === "keluar"
                    ? KATEGORI_KELUAR
                    : [...KATEGORI_MASUK, ...KATEGORI_KELUAR];

        pilihKategori.innerHTML =
            `<option value="semua">Semua Kategori</option>` +
            daftar
                .map(
                    (k) =>
                        `<option value="${escapeHtml(k)}">${escapeHtml(labelKategori(k))}</option>`
                )
                .join("");

        if (
            [...pilihKategori.options]
                .some((o) => o.value === nilaiLama)
        ) {
            pilihKategori.value = nilaiLama;
        }
    };


    const isiPilihanBulan = () => {

        const pilih = $("filterBulan");
        if (!pilih) return;

        const nilaiLama = pilih.value;

        // Bulan diambil dari data nyata agar tidak pernah basi.
        const daftar = [...new Set(
            DATA_TRANSAKSI
                .map((t) => String(t.tanggal ?? "").slice(0, 7))
                .filter((b) => /^\d{4}-\d{2}$/.test(b))
        )].sort().reverse();

        const NAMA_BULAN = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        pilih.innerHTML =
            `<option value="semua">Semua Bulan</option>` +
            daftar.map((b) => {
                const [th, bl] = b.split("-");
                const nama = NAMA_BULAN[Number(bl) - 1] ?? bl;
                return `<option value="${b}">${nama} ${th}</option>`;
            }).join("");

        if ([...pilih.options].some((o) => o.value === nilaiLama)) {
            pilih.value = nilaiLama;
        }
    };


    const terapkanFilter = () => {

        const kata = $("cariRiwayat").value
            .trim()
            .toLowerCase();

        const jenis = $("filterJenis").value;
        const kategori = $("filterKategori").value;
        const bulan = $("filterBulan").value;


        const hasil = DATA_TRANSAKSI.filter((t) => {

            if (jenis !== "semua" && t.jenis !== jenis) {
                return false;
            }

            if (
                kategori !== "semua" &&
                String(t.kategori ?? "").toLowerCase() !==
                    String(kategori).toLowerCase()
            ) {
                return false;
            }

            if (
                bulan !== "semua" &&
                !String(t.tanggal ?? "").startsWith(bulan)
            ) {
                return false;
            }

            if (kata) {

                const gabung =
                    `${t.id} ${t.keterangan} ${t.kategori} ${t.kelas} ${t.petugas}`
                        .toLowerCase();

                if (!gabung.includes(kata)) {
                    return false;
                }
            }

            return true;
        });


        hasil.sort((a, b) =>
            a.tanggal < b.tanggal
                ? 1
                : a.tanggal > b.tanggal
                    ? -1
                    : 0
        );


        renderTabel(hasil);
        renderRingkasan(hasil);
    };


    const resetFilter = () => {

        $("cariRiwayat").value = "";
        $("filterJenis").value = "semua";
        $("filterBulan").value = "semua";

        isiPilihanKategori();

        $("filterKategori").value = "semua";

        terapkanFilter();
    };


    /* ============================================================
       RENDER TABEL
    ============================================================ */

    const barisTabel = (t) => {

        const nominal = hitungMasukKas(
            t.tagihan,
            t.diterima
        );

        const tanda =
            t.jenis === "masuk"
                ? "+"
                : "−";

        const kelas = t.kelas
            ? `<span class="cell-keterangan__sub">${escapeHtml(t.kelas)}</span>`
            : "";

        // Tandai transaksi yang punya rincian (mis. pembayaran
        // multi-iuran) agar pengguna tahu detailnya bisa dibuka.
        const rincianBadge =
            t.jumlah_rincian > 1
                ? `<span class="cell-rincian">${t.jumlah_rincian} rincian</span>`
                : "";

        const chip = chipKategori(t.kategori);


        return `
            <tr>

                <td>
                    <span class="cell-id">
                        ${escapeHtml(t.id)}
                    </span>
                </td>

                <td class="cell-keterangan">

                    <div class="cell-keterangan__utama">
                        ${escapeHtml(t.keterangan)}
                    </div>

                    ${rincianBadge}

                    ${kelas}

                </td>

                <td>
                    <span class="chip ${chip}">
                        ${escapeHtml(labelKategori(t.kategori))}
                    </span>
                </td>

                <td class="cell-tanggal">

                    <div class="cell-tanggal__utama">
                        ${formatTanggal(t.tanggal)}
                    </div>

                    <div class="cell-tanggal__sub">
                        ${escapeHtml(t.waktu)} WIB
                    </div>

                </td>

                <td class="td-r">

                    <span class="cell-nominal cell-nominal--${t.jenis}">
                        ${tanda}${formatRupiah(nominal)}
                    </span>

                </td>

                <td>
                    <span class="cell-petugas">
                        ${escapeHtml(t.petugas)}
                    </span>
                </td>

                <td class="td-c">

                    <span class="aksi-grup">

                        <button
                            type="button"
                            class="icon-btn"
                            data-aksi="detail"
                            data-id="${t.id}"
                            aria-label="Lihat detail ${t.id}"
                            title="Detail">

                            <span class="material-symbols-outlined">
                                visibility
                            </span>

                        </button>

                    </span>

                </td>

            </tr>
        `;
    };


    const renderTabel = (baris) => {

        const tbody = $("isiTabelRiwayat");
        const kosong = $("emptyState");

        tbody.innerHTML =
            baris
                .map(barisTabel)
                .join("");


        if (baris.length === 0) {

            kosong.hidden = false;
            tbody.innerHTML = "";

        } else {

            kosong.hidden = true;

        }


        $("tabelInfo").textContent =
            `${baris.length} transaksi ditampilkan`;
    };


    const renderRingkasan = (baris) => {

        const masuk =
            baris
                .filter((t) => t.jenis === "masuk")
                .reduce(
                    (tot, t) =>
                        tot +
                        hitungMasukKas(
                            t.tagihan,
                            t.diterima
                        ),
                    0
                );


        const keluar =
            baris
                .filter((t) => t.jenis === "keluar")
                .reduce(
                    (tot, t) =>
                        tot +
                        hitungMasukKas(
                            t.tagihan,
                            t.diterima
                        ),
                    0
                );


        $("sumMasuk").textContent =
            formatRupiah(masuk);

        $("sumKeluar").textContent =
            formatRupiah(keluar);

        $("sumJumlah").textContent =
            baris.length;


        const n = baris.length;

        const catatan =
            n
                ? `dari ${n} transaksi terfilter`
                : "tidak ada transaksi";


        $("sumMasukNote").textContent =
            catatan;

        $("sumKeluarNote").textContent =
            catatan;

        $("sumJumlahNote").textContent =
            catatan;
    };


    /* ============================================================
       MODAL DETAIL
    ============================================================ */

    const bukaDetail = (id) => {

        const t =
            DATA_TRANSAKSI.find(
                (x) => String(x.id) === String(id)
            );

        if (!t) return;


        $("modalDetailTitle").textContent =
            t.id;

        $("detailJenis").textContent =
            t.jenis === "masuk"
                ? "Pemasukan"
                : "Pengeluaran";

        $("detailKategori").textContent =
            labelKategori(t.kategori);

        $("detailKelas").textContent =
            t.kelas || "-";

        $("detailTanggal").textContent =
            formatTanggal(t.tanggal);

        $("detailWaktu").textContent =
            `${t.waktu} WIB`;

        $("detailPetugas").textContent =
            t.petugas;

        $("detailKeterangan").textContent =
            t.keterangan;


        // Status pembayaran (Lunas / Cicilan) - chip di bawah judul
        // modal. Transaksi non-iuran tidak punya status (disembunyikan).
        const chipStatus = $("detailStatusBayar");

        if (chipStatus) {
            if (t.status_pembayaran === "Lunas") {
                chipStatus.hidden = false;
                chipStatus.className = "badge badge--ok";
                chipStatus.textContent = "Lunas";
            } else if (t.status_pembayaran === "Cicilan") {
                chipStatus.hidden = false;
                chipStatus.className = "badge badge--pending";
                chipStatus.textContent =
                    "Cicilan • Sisa " + formatRupiah(t.sisa_tagihan ?? 0);
            } else {
                chipStatus.hidden = true;
                chipStatus.textContent = "";
            }
        }


        const masukKas =
            hitungMasukKas(
                t.tagihan,
                t.diterima
            );

        const kembalian =
            hitungKembalian(
                t.tagihan,
                t.diterima
            );


        $("rincianTagihan").textContent =
            formatRupiah(t.tagihan);

        $("rincianDiterima").textContent =
            formatRupiah(t.diterima);

        $("rincianKembalian").textContent =
            formatRupiah(kembalian);

        $("rincianMasukKas").textContent =
            formatRupiah(masukKas);


        $("rincianLabelDiterima").textContent =
            t.jenis === "masuk"
                ? "Jumlah uang yang diterima Bendahara"
                : "Jumlah uang yang dibayarkan Bendahara";


        $("rincianLabelMasukKas").textContent =
            t.jenis === "masuk"
                ? "Jumlah uang yang masuk ke kas"
                : "Jumlah uang yang keluar dari kas";


        tampilkanRincianDetail(t);


        bukaModal("modalDetail");
    };


    /* ============================================================
       RINCIAN TRANSAKSI (MULTI-IURAN / PENGELUARAN)
       ============================================================ */

    /*
     * Menampilkan rincian pembayaran/pengeluaran pada modal detail.
     * Satu pembayaran multi-iuran tetap satu transaksi utama;
     * seluruh rinciannya (siswa, iuran, periode, nominal) muncul
     * di sini. Bila transaksi hanya satu baris, blok ini
     * disembunyikan agar tampilan tetap ringkas.
     */
    const tampilkanRincianDetail = (t) => {

        const wadah = $("detailRincian");
        const list = $("detailRincianList");
        const total = $("detailRincianTotal");

        if (!wadah || !list || !total) return;

        const rincian =
            Array.isArray(t.rincian)
                ? t.rincian.filter(Boolean)
                : [];

        // Tanpa rincian bermakna (hanya satu baris) → sembunyikan.
        if (rincian.length <= 1) {
            wadah.hidden = true;
            list.innerHTML = "";
            total.textContent = "-";
            return;
        }

        list.innerHTML = rincian
            .map((r) => {

                const nama =
                    r.nama_iuran
                        ? escapeHtml(r.nama_iuran)
                        : escapeHtml(r.keterangan || "Pembayaran");

                const periode =
                    r.periode
                        ? `<span class="detail-rincian__periode">${escapeHtml(r.periode)}</span>`
                        : "";

                // Status pembayaran rincian ini (Lunas/Cicilan) dari
                // tabel detail_transaksi + akumulasi pembayaran.
                const chip = r.status_pembayaran === "Lunas"
                    ? `<span class="badge badge--ok">Lunas</span>`
                    : r.status_pembayaran === "Cicilan"
                        ? `<span class="badge badge--pending">Cicilan${r.sisa_tagihan != null ? " • Sisa " + formatRupiah(r.sisa_tagihan) : ""}</span>`
                        : "";

                return `
                    <div class="detail-rincian__baris">
                        <div class="detail-rincian__info">
                            <span class="detail-rincian__nama">${nama}</span>
                            ${periode}
                            ${chip}
                        </div>
                        <b class="detail-rincian__nominal">${formatRupiah(r.nominal)}</b>
                    </div>
                `;
            })
            .join("");

        const totalRincian = rincian.reduce(
            (jumlah, r) => jumlah + (Number(r.nominal) || 0),
            0
        );

        total.textContent = formatRupiah(totalRincian);

        wadah.hidden = false;
    };


    /* ============================================================
       INTERAKSI UMUM
    ============================================================ */

    const pasangInteraksiUmum = () => {

        const sidebar = $("sidebar");
        const backdrop = $("sidebarBackdrop");
        const toggle = $("sidebarToggle");
        const profileBtn = $("profileBtn");
        const profileMenu = $("profileMenu");


        const tutupSidebar = () => {

            document.body.classList.remove("nav-open");

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );
        };


        toggle.addEventListener("click", (e) => {

            e.stopPropagation();

            const terbuka =
                document.body.classList.toggle(
                    "nav-open"
                );

            toggle.setAttribute(
                "aria-expanded",
                terbuka
                    ? "true"
                    : "false"
            );
        });


        backdrop.addEventListener(
            "click",
            tutupSidebar
        );


        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth > 1024) {
                    tutupSidebar();
                }

            }
        );


        const tutupDropdown = () => {

            profileMenu.classList.remove(
                "is-open"
            );

            profileBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        };


        profileBtn.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                const terbuka =
                    profileMenu.classList.toggle(
                        "is-open"
                    );

                profileBtn.setAttribute(
                    "aria-expanded",
                    terbuka
                        ? "true"
                        : "false"
                );
            }
        );


        document.addEventListener(
            "click",
            (e) => {

                if (
                    !profileMenu.contains(e.target) &&
                    !profileBtn.contains(e.target)
                ) {
                    tutupDropdown();
                }


                const tombolAksi =
                    e.target.closest(
                        "[data-aksi='detail']"
                    );

                if (tombolAksi) {
                    bukaDetail(
                        tombolAksi.dataset.id
                    );
                }


                const tombolTutup =
                    e.target.closest(
                        "[data-tutup-modal]"
                    );

                if (tombolTutup) {
                    tutupModal(
                        tombolTutup.dataset.tutupModal
                    );
                }

            }
        );


        document
            .querySelectorAll(".modal-backdrop")
            .forEach((modal) => {

                modal.addEventListener(
                    "click",
                    (e) => {

                        if (e.target === modal) {
                            tutupModal(modal.id);
                        }

                    }
                );

            });


        document.addEventListener(
            "keydown",
            (e) => {

                if (e.key === "Escape") {

                    tutupDropdown();
                    tutupSidebar();
                    tutupModal("modalDetail");

                }

            }
        );


        const now = new Date();

        $("topbarDate").textContent =
            now.toLocaleDateString(
                "id-ID",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );
    };


    /* ============================================================
       INIT
    ============================================================ */

    const init = () => {

        isiPilihanKategori();

        pasangInteraksiUmum();

        terapkanFilter();


        $("cariRiwayat")
            .addEventListener(
                "input",
                terapkanFilter
            );


        $("filterJenis")
            .addEventListener(
                "change",
                () => {

                    isiPilihanKategori();
                    terapkanFilter();

                }
            );


        $("filterKategori")
            .addEventListener(
                "change",
                terapkanFilter
            );


        $("filterBulan")
            .addEventListener(
                "change",
                terapkanFilter
            );


        $("btnResetFilter")
            .addEventListener(
                "click",
                resetFilter
            );


        $("btnKosongkanFilter")
            .addEventListener(
                "click",
                resetFilter
            );
    };


    document.addEventListener(
        "DOMContentLoaded",
        () => {
            init();
            muatData();
        }
    );

})();
