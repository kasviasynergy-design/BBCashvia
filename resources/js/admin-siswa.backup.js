/* ============================================================
   BBCASHVIA — HALAMAN DATA SISWA (ADMIN)
   Data dummy + interaksi UI (tanpa koneksi database / API)
   ============================================================ */

(function () {
    "use strict";


    /* |======================================================================
    |  DATA DUMMY
    |====================================================================== */

    const BESAR_IURAN = 250000;
    const BULAN_AKTIF = "2026-10";

    const DAFTAR_BULAN = [
        { id: "2026-10", label: "Oktober 2026" },
        { id: "2026-09", label: "September 2026" },
        { id: "2026-08", label: "Agustus 2026" }
    ];

    const SISWA = [
        { nis: "2401", nama: "Aditya Pratama", kelas: "XI RPL 1", jk: "L", hp: "0812-6042-1187" },
        { nis: "2402", nama: "Aisyah Nur Ramadhani", kelas: "XI RPL 1", jk: "P", hp: "0857-2214-9033" },
        { nis: "2403", nama: "Bagas Dwi Saputra", kelas: "XI RPL 1", jk: "L", hp: "0821-3390-4561" },
        { nis: "2404", nama: "Bella Safitri", kelas: "XI RPL 1", jk: "P", hp: "0896-4412-7708" },
        { nis: "2405", nama: "Daffa Hidayat", kelas: "XI RPL 1", jk: "L", hp: "0852-1876-3304" },
        { nis: "2406", nama: "Dinda Ayu Lestari", kelas: "XI RPL 1", jk: "P", hp: "0813-9902-5548" },
        { nis: "2407", nama: "Fajar Ramadhan", kelas: "XI RPL 1", jk: "L", hp: "0878-3311-2245" },
        { nis: "2408", nama: "Farah Nabila", kelas: "XI RPL 1", jk: "P", hp: "0822-7761-8890" },
        { nis: "2409", nama: "Gilang Rizky Pratama", kelas: "XI RPL 1", jk: "L", hp: "0895-6620-1139" },
        { nis: "2410", nama: "Hana Salsabila", kelas: "XI RPL 1", jk: "P", hp: "0812-8834-5607" },
        { nis: "2411", nama: "Ilham Maulana", kelas: "XI RPL 1", jk: "L", hp: "0853-4409-2281" },
        { nis: "2412", nama: "Kirana Putri Maharani", kelas: "XI RPL 1", jk: "P", hp: "0821-5567-3390" },
        { nis: "2413", nama: "Lukman Hakim", kelas: "XI RPL 1", jk: "L", hp: "" },
        { nis: "2414", nama: "Nadia Rahma", kelas: "XI RPL 1", jk: "P", hp: "0899-2210-7742" },
        { nis: "2415", nama: "Naufal Arifin", kelas: "XI RPL 2", jk: "L", hp: "0877-9134-6685" },
        { nis: "2416", nama: "Putri Amelia", kelas: "XI RPL 2", jk: "P", hp: "0813-6675-2218" },
        { nis: "2417", nama: "Raihan Akbar", kelas: "XI RPL 2", jk: "L", hp: "0852-9903-4471" },
        { nis: "2418", nama: "Rani Kusuma Wardani", kelas: "XI RPL 2", jk: "P", hp: "0822-1145-8836" },
        { nis: "2419", nama: "Reza Firmansyah", kelas: "XI RPL 2", jk: "L", hp: "0896-7754-1120" },
        { nis: "2420", nama: "Salsa Aulia Zahra", kelas: "XI RPL 2", jk: "P", hp: "0812-3398-6654" },
        { nis: "2421", nama: "Satria Bagas Wicaksono", kelas: "XI RPL 2", jk: "L", hp: "" },
        { nis: "2422", nama: "Shafira Octaviani", kelas: "XI RPL 2", jk: "P", hp: "0857-6642-9903" },
        { nis: "2423", nama: "Syahrul Gunawan", kelas: "XI RPL 2", jk: "L", hp: "0878-2246-5517" },
        { nis: "2424", nama: "Tiara Ayu Wandira", kelas: "XI RPL 2", jk: "P", hp: "0895-3318-7742" },
        { nis: "2425", nama: "Wahyu Nugroho", kelas: "XI RPL 2", jk: "L", hp: "0821-8873-2209" },
        { nis: "2426", nama: "Zahra Amelia Putri", kelas: "XI RPL 2", jk: "P", hp: "0838-5561-3324" },
        { nis: "2431", nama: "Andini Prameswari", kelas: "X TKJ 1", jk: "P", hp: "0813-2247-9968" },
        { nis: "2432", nama: "Bayu Setiawan", kelas: "X TKJ 1", jk: "L", hp: "0852-1136-4479" },
        { nis: "2433", nama: "Citra Melati", kelas: "X TKJ 1", jk: "P", hp: "0899-6635-2214" },
        { nis: "2434", nama: "Dimas Arya Saputra", kelas: "X TKJ 1", jk: "L", hp: "0877-4429-8853" },
        { nis: "2435", nama: "Elsa Aprilia", kelas: "X TKJ 1", jk: "P", hp: "" },
        { nis: "2436", nama: "Fikri Haikal", kelas: "X TKJ 1", jk: "L", hp: "0822-9917-3360" },
        { nis: "2437", nama: "Gita Purnama Sari", kelas: "X TKJ 1", jk: "P", hp: "0812-7754-6691" },
        { nis: "2438", nama: "Hendra Wijaya", kelas: "X TKJ 1", jk: "L", hp: "0838-2214-5578" },
        { nis: "2439", nama: "Intan Permata", kelas: "X TKJ 1", jk: "P", hp: "0895-8842-1103" },
        { nis: "2440", nama: "Joko Prasetyo", kelas: "X TKJ 1", jk: "L", hp: "0857-3369-7725" }
    ];

    /*
     * Rekaman iuran per bulan (konsisten dengan halaman Iuran).
     * Kunci: "NIS|YYYY-MM" -> { tagihan, dibayar }
     */
    const DATA_IURAN = {};

    const catat = (nis, bulan, dibayar, tagihan) => {
        DATA_IURAN[`${nis}|${bulan}`] = { tagihan: tagihan || BESAR_IURAN, dibayar };
    };

    /* --- Oktober 2026: 24 lunas, 9 sebagian, 3 belum --- */
    SISWA.forEach((s) => catat(s.nis, "2026-10", BESAR_IURAN));
    catat("2402", "2026-10", 150000);  /* Aisyah — sebagian */
    catat("2404", "2026-10", 175000);  /* Bella — sebagian */
    catat("2408", "2026-10", 200000);  /* Farah — sebagian */
    catat("2410", "2026-10", 200000);  /* Hana — sebagian */
    catat("2406", "2026-10", 0);       /* Dinda — belum */
    catat("2416", "2026-10", 200000);  /* Putri — sebagian */
    catat("2420", "2026-10", 200000);  /* Salsa — sebagian */
    catat("2422", "2026-10", 225000);  /* Shafira — sebagian */
    catat("2418", "2026-10", 0);       /* Rani — belum */
    catat("2432", "2026-10", 225000);  /* Bayu — sebagian */
    catat("2437", "2026-10", 200000);  /* Gita — sebagian */
    catat("2439", "2026-10", 225000);  /* Intan — sebagian */
    catat("2435", "2026-10", 0);       /* Elsa — belum */

    /* --- September 2026: 29 lunas, 5 sebagian, 2 belum --- */
    SISWA.forEach((s) => catat(s.nis, "2026-09", BESAR_IURAN));
    catat("2407", "2026-09", 150000);
    catat("2412", "2026-09", 200000);
    catat("2419", "2026-09", 200000);
    catat("2426", "2026-09", 175000);
    catat("2433", "2026-09", 200000);
    catat("2421", "2026-09", 0);
    catat("2438", "2026-09", 0);

    /* --- Agustus 2026: 33 lunas, 2 sebagian, 1 belum --- */
    SISWA.forEach((s) => catat(s.nis, "2026-08", BESAR_IURAN));
    catat("2403", "2026-08", 200000);
    catat("2424", "2026-08", 200000);
    catat("2409", "2026-08", 0);


    /* |======================================================================
    |  UTILITAS
    |====================================================================== */

    const $ = (id) => document.getElementById(id);

    const formatRupiah = (angka) => "Rp " + (Number(angka) || 0).toLocaleString("id-ID");

    const escapeHtml = (teks) => String(teks ?? "")
        .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const inisial = (nama) => {
        const bagian = String(nama).trim().split(/\s+/);
        const dua = bagian.length > 1
            ? bagian[0][0] + bagian[bagian.length - 1][0]
            : bagian[0].slice(0, 2);
        return dua.toUpperCase();
    };

    const statusDari = (tagihan, dibayar) => {
        if ((Number(dibayar) || 0) >= (Number(tagihan) || 0) && dibayar > 0) return "lunas";
        if ((Number(dibayar) || 0) > 0) return "sebagian";
        return "belum";
    };

    const STATUS_LABEL = { lunas: "Sudah Bayar", sebagian: "Sebagian", belum: "Belum Bayar" };
    const STATUS_BADGE = { lunas: "badge--ok", sebagian: "badge--partial", belum: "badge--none" };
    const JK_LABEL = { L: "Laki-laki", P: "Perempuan" };

    const ambilRekam = (nis, bulan) =>
        DATA_IURAN[`${nis}|${bulan}`] || { tagihan: BESAR_IURAN, dibayar: 0 };

    const statusSiswa = (s, bulan = BULAN_AKTIF) => {
        const r = ambilRekam(s.nis, bulan);
        return statusDari(r.tagihan, r.dibayar);
    };

    const labelBulan = (idBulan) => {
        const b = DAFTAR_BULAN.find((x) => x.id === idBulan);
        return b ? b.label : idBulan;
    };


    /* |======================================================================
    |  STATE
    |====================================================================== */

    let modeForm = "tambah";
    let nisSedangDiubah = null;
    let nisSedangDihapus = null;


    /* |======================================================================
    |  RENDER: TABEL
    |====================================================================== */

    const barisTabel = (s) => {
        const st = statusSiswa(s);
        const kelasChip = `<span class="chip ${s.jk === "L" ? "chip--lk" : "chip--pr"}">${JK_LABEL[s.jk]}</span>`;
        const kontak = s.hp
            ? `<span class="cell-kontak">${escapeHtml(s.hp)}</span>`
            : `<span class="cell-kontak cell-kontak--kosong">— belum ada —</span>`;

        return `
            <tr>
                <td>
                    <div class="cell-siswa">
                        <div class="cell-siswa__avatar ${s.jk === "P" ? "cell-siswa__avatar--pr" : ""}" aria-hidden="true">${escapeHtml(inisial(s.nama))}</div>
                        <div class="cell-siswa__info">
                            <div class="cell-siswa__nama">${escapeHtml(s.nama)}</div>
                            <div class="cell-siswa__sub">NIS ${escapeHtml(s.nis)}</div>
                        </div>
                    </div>
                </td>
                <td><span class="cell-kelas">${escapeHtml(s.kelas)}</span></td>
                <td>${kelasChip}</td>
                <td>${kontak}</td>
                <td><span class="badge ${STATUS_BADGE[st]}">${STATUS_LABEL[st]}</span></td>
                <td class="td-c">
                    <span class="aksi-grup">
                        <button type="button" class="icon-btn" data-aksi="detail" data-nis="${s.nis}"
                            aria-label="Lihat detail ${escapeHtml(s.nama)}" title="Detail">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        <button type="button" class="icon-btn" data-aksi="ubah" data-nis="${s.nis}"
                            aria-label="Ubah data ${escapeHtml(s.nama)}" title="Ubah">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button type="button" class="icon-btn icon-btn--hapus" data-aksi="hapus" data-nis="${s.nis}"
                            aria-label="Hapus data ${escapeHtml(s.nama)}" title="Hapus">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </span>
                </td>
            </tr>`;
    };

    const renderTabel = (baris) => {
        const tbody = $("isiTabelSiswa");
        const kosong = $("emptyState");

        tbody.innerHTML = baris.map(barisTabel).join("");

        if (baris.length === 0) {
            kosong.hidden = false;
            tbody.innerHTML = "";
        } else {
            kosong.hidden = true;
        }

        $("tabelInfo").textContent = `${baris.length} siswa ditampilkan`;
    };

    const renderRingkasan = (baris) => {
        const total = baris.length;
        const lk = baris.filter((s) => s.jk === "L").length;
        const pr = baris.filter((s) => s.jk === "P").length;
        const belum = baris.filter((s) => statusSiswa(s) === "belum").length;

        $("sumTotal").textContent = total;
        $("sumLk").textContent = lk;
        $("sumPr").textContent = pr;
        $("sumBelum").textContent = belum;

        $("sumTotalNote").textContent = total ? "anggota kelas terdaftar" : "tidak ada siswa";
        $("sumLkNote").textContent = lk === 1 ? "siswa" : "siswa";
        $("sumPrNote").textContent = pr === 1 ? "siswa" : "siswa";
        $("sumBelumNote").textContent = belum === 1 ? "iuran Oktober 2026" : "iuran Oktober 2026";
    };


    /* |======================================================================
    |  FILTER
    |====================================================================== */

    const terapkanFilter = () => {
        const kata = $("cariSiswa").value.trim().toLowerCase();
        const kelas = $("filterKelas").value;
        const jk = $("filterJk").value;
        const iuran = $("filterIuran").value;

        const hasil = SISWA.filter((s) => {
            if (kelas !== "semua" && s.kelas !== kelas) return false;
            if (jk !== "semua" && s.jk !== jk) return false;
            if (iuran !== "semua" && statusSiswa(s) !== iuran) return false;
            if (kata) {
                const gabung = `${s.nama} ${s.nis} ${s.kelas}`.toLowerCase();
                if (!gabung.includes(kata)) return false;
            }
            return true;
        });

        renderTabel(hasil);
        renderRingkasan(hasil);
    };

    const resetFilter = () => {
        $("cariSiswa").value = "";
        $("filterKelas").value = "semua";
        $("filterJk").value = "semua";
        $("filterIuran").value = "semua";
        terapkanFilter();
    };


    /* |======================================================================
    |  MODAL
    |====================================================================== */

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
        document.querySelectorAll(".modal-backdrop.is-open").forEach((m) => tutupModal(m.id));
    };

    const tampilkanToast = (pesan) => {
        const toast = $("toast");
        $("toastText").textContent = pesan;
        toast.classList.add("is-muncul");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove("is-muncul"), 2800);
    };


    /* |======================================================================
    |  FORM: TAMBAH / UBAH
    |====================================================================== */

    const jenisKelaminTerpilih = () => {
        const radio = document.querySelector('input[name="jenisKelamin"]:checked');
        return radio ? radio.value : "";
    };

    const bukaFormTambah = () => {
        modeForm = "tambah";
        nisSedangDiubah = null;

        $("modalFormEyebrow").textContent = "SISWA BARU";
        $("modalFormTitle").textContent = "Tambah Siswa";
        $("btnSimpanText").textContent = "Simpan Siswa";

        $("formSiswa").reset();
        $("formError").hidden = true;

        bukaModal("modalForm");
        setTimeout(() => $("inputNis").focus(), 120);
    };

    const bukaFormUbah = (nis) => {
        const s = SISWA.find((x) => x.nis === nis);
        if (!s) return;

        modeForm = "ubah";
        nisSedangDiubah = nis;

        $("modalFormEyebrow").textContent = "UBAH DATA SISWA";
        $("modalFormTitle").textContent = `Ubah ${s.nama}`;
        $("btnSimpanText").textContent = "Simpan Perubahan";

        $("formSiswa").reset();
        $("formError").hidden = true;

        $("inputNis").value = s.nis;
        $("inputNama").value = s.nama;
        $("inputKelas").value = s.kelas;
        document.querySelector(`input[name="jenisKelamin"][value="${s.jk}"]`).checked = true;
        $("inputHp").value = s.hp;

        bukaModal("modalForm");
        setTimeout(() => $("inputNama").focus(), 120);
    };

    const formatNomorHp = (teks) => {
        const digit = String(teks).replace(/\D/g, "").slice(0, 12);
        const potongan = digit.match(/.{1,4}/g) || [];
        return potongan.join("-");
    };

    const simpanSiswa = (e) => {
        e.preventDefault();

        const nis = $("inputNis").value.trim();
        const nama = $("inputNama").value.trim();
        const kelas = $("inputKelas").value;
        const jk = jenisKelaminTerpilih();
        const hp = $("inputHp").value.trim();

        /* Validasi */
        const galat = [];
        if (!/^\d{4}$/.test(nis)) galat.push("NIS harus berupa 4 angka");
        if (SISWA.some((x) => x.nis === nis && x.nis !== nisSedangDiubah)) {
            galat.push(`NIS ${nis} sudah dipakai siswa lain`);
        }
        if (nama.length < 3) galat.push("Nama lengkap wajib diisi (minimal 3 huruf)");
        if (!kelas) galat.push("Kelas wajib dipilih");
        if (!jk) galat.push("Jenis kelamin wajib dipilih");

        const kotakGalat = $("formError");
        if (galat.length) {
            kotakGalat.textContent = galat.join(" • ");
            kotakGalat.hidden = false;
            return;
        }
        kotakGalat.hidden = true;

        if (modeForm === "ubah" && nisSedangDiubah) {
            const s = SISWA.find((x) => x.nis === nisSedangDiubah);

            /* Pindahkan rekaman iuran jika NIS berubah */
            if (s && s.nis !== nis) {
                DAFTAR_BULAN.forEach((b) => {
                    const rekam = DATA_IURAN[`${s.nis}|${b.id}`];
                    if (rekam) {
                        DATA_IURAN[`${nis}|${b.id}`] = rekam;
                        delete DATA_IURAN[`${s.nis}|${b.id}`];
                    }
                });
            }

            if (s) {
                Object.assign(s, { nis, nama, kelas, jk, hp });
            }
            tampilkanToast(`Data ${nama} (NIS ${nis}) berhasil diperbarui`);
        } else {
            SISWA.push({ nis, nama, kelas, jk, hp });
            tampilkanToast(`Siswa baru ${nama} (NIS ${nis}) ditambahkan`);
        }

        /* Urutkan berdasar NIS agar tabel rapi */
        SISWA.sort((a, b) => a.nis.localeCompare(b.nis));

        tutupModal("modalForm");
        terapkanFilter();
    };


    /* |======================================================================
    |  DETAIL
    |====================================================================== */

    const bukaDetail = (nis) => {
        const s = SISWA.find((x) => x.nis === nis);
        if (!s) return;

        const st = statusSiswa(s);
        const rekamAktif = ambilRekam(s.nis, BULAN_AKTIF);

        /* Judul + profil */
        $("detailNama").textContent = s.nama;
        $("detailNamaKecil").textContent = s.nama;

        const avatar = $("detailAvatar");
        avatar.textContent = inisial(s.nama);
        avatar.classList.toggle("detail-profil__avatar--pr", s.jk === "P");

        $("detailKelas").textContent = s.kelas;

        const chipJk = $("detailJk");
        chipJk.textContent = JK_LABEL[s.jk];
        chipJk.classList.toggle("chip--lk", s.jk === "L");
        chipJk.classList.toggle("chip--pr", s.jk === "P");

        /* Grid identitas */
        $("detailNis").textContent = s.nis;
        $("detailJkTeks").textContent = JK_LABEL[s.jk] || "—";
        $("detailHp").textContent = s.hp || "—";

        const badgeStatus = $("detailStatus");
        badgeStatus.textContent = `${STATUS_LABEL[st]} • ${formatRupiah(rekamAktif.dibayar)} dari ${formatRupiah(rekamAktif.tagihan)}`;
        badgeStatus.className = `badge ${STATUS_BADGE[st]}`;

        /* Ringkasan iuran 3 bulan */
        $("riwayatIuran").innerHTML = DAFTAR_BULAN.map((b) => {
            const r = ambilRekam(s.nis, b.id);
            const stBulan = statusDari(r.tagihan, r.dibayar);
            const utama = b.id === BULAN_AKTIF ? " riwayat-baris--utama" : "";

            return `
                <div class="riwayat-baris${utama}">
                    <span class="riwayat-baris__bulan">${escapeHtml(b.label)}</span>
                    <span class="riwayat-baris__nominal">${formatRupiah(r.dibayar)} / ${formatRupiah(r.tagihan)}</span>
                    <span class="badge ${STATUS_BADGE[stBulan]}">${STATUS_LABEL[stBulan]}</span>
                </div>`;
        }).join("");

        bukaModal("modalDetail");
    };


    /* |======================================================================
    |  HAPUS
    |====================================================================== */

    const bukaHapus = (nis) => {
        const s = SISWA.find((x) => x.nis === nis);
        if (!s) return;

        nisSedangDihapus = nis;
        $("hapusText").innerHTML =
            `Data siswa <b>${escapeHtml(s.nama)}</b> (NIS ${escapeHtml(s.nis)}, ${escapeHtml(s.kelas)}) ` +
            `akan dihapus dari daftar anggota kelas. Tindakan ini tidak dapat dibatalkan.`;
        bukaModal("modalHapus");
    };

    const jalankanHapus = () => {
        const idx = SISWA.findIndex((x) => x.nis === nisSedangDihapus);
        if (idx >= 0) {
            const [dihapus] = SISWA.splice(idx, 1);

            /* Bersihkan rekaman iuran milik siswa */
            DAFTAR_BULAN.forEach((b) => delete DATA_IURAN[`${dihapus.nis}|${b.id}`]);

            tampilkanToast(`Data ${dihapus.nama} (NIS ${dihapus.nis}) dihapus`);
        }
        tutupModal("modalHapus");
        terapkanFilter();
    };


    /* |======================================================================
    |  INTERAKSI UMUM (SIDEBAR, DROPDOWN, TANGGAL)
    |====================================================================== */

    const pasangInteraksiUmum = () => {
        /* Sidebar mobile */
        const tombolSidebar = $("sidebarToggle");
        const backdrop = $("sidebarBackdrop");

        const tutupSidebar = () => document.body.classList.remove("nav-open");

        if (tombolSidebar) {
            tombolSidebar.addEventListener("click", () => document.body.classList.toggle("nav-open"));
        }
        if (backdrop) {
            backdrop.addEventListener("click", tutupSidebar);
        }

        /* Tutup sidebar saat pindah ke desktop */
        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024) tutupSidebar();
        });

        /* Dropdown profil */
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

        /* Escape menutup semuanya */
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                tutupSidebar();
                tutupProfil();
                tutupSemuaModal();
            }
        });

        /* Tanggal topbar */
        const elTanggal = $("topbarDate");
        if (elTanggal) {
            elTanggal.textContent = new Date().toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
            });
        }
    };


    /* |======================================================================
    |  PASANG EVENT
    |====================================================================== */

    const pasangEvent = () => {

        /* Filter */
        $("cariSiswa").addEventListener("input", terapkanFilter);
        $("filterKelas").addEventListener("change", terapkanFilter);
        $("filterJk").addEventListener("change", terapkanFilter);
        $("filterIuran").addEventListener("change", terapkanFilter);
        $("btnResetFilter").addEventListener("click", resetFilter);
        $("btnKosongkanFilter").addEventListener("click", resetFilter);

        /* Tambah */
        $("btnTambahSiswa").addEventListener("click", bukaFormTambah);

        /* Input NIS: hanya angka */
        $("inputNis").addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
        });

        /* Input HP: format 4-4-4 */
        $("inputHp").addEventListener("input", (e) => {
            e.target.value = formatNomorHp(e.target.value);
        });

        /* Form */
        $("formSiswa").addEventListener("submit", simpanSiswa);

        /* Aksi baris (event delegation) */
        $("isiTabelSiswa").addEventListener("click", (e) => {
            const tombol = e.target.closest("button[data-aksi]");
            if (!tombol) return;
            const { aksi, nis } = tombol.dataset;
            if (aksi === "detail") bukaDetail(nis);
            if (aksi === "ubah") bukaFormUbah(nis);
            if (aksi === "hapus") bukaHapus(nis);
        });

        /* Hapus */
        $("btnKonfirmasiHapus").addEventListener("click", jalankanHapus);

        /* Tombol tutup modal */
        document.querySelectorAll("[data-tutup-modal]").forEach((tombol) => {
            tombol.addEventListener("click", () => tutupModal(tombol.dataset.tutupModal));
        });

        /* Klik backdrop menutup modal */
        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
            backdrop.addEventListener("mousedown", (e) => {
                if (e.target === backdrop) tutupModal(backdrop.id);
            });
        });
    };


    /* |======================================================================
    |  JALANKAN
    |====================================================================== */

    pasangInteraksiUmum();
    pasangEvent();
    terapkanFilter();

})();
