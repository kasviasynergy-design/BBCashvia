document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       DATA DUMMY
       NANTI DIGANTI DATABASE / BACKEND LARAVEL
       ========================================================= */

    const SISWA = [
        { id: 1, nama: "Azis Nugraha", nisn: "0061234567", kelas: "XI RPL 1" },
        { id: 2, nama: "Budi Santoso", nisn: "0061234568", kelas: "XI RPL 1" },
        { id: 3, nama: "Citra Lestari", nisn: "0061234569", kelas: "XI RPL 1" },
        { id: 4, nama: "Dimas Pratama", nisn: "0061234570", kelas: "XI RPL 1" },
        { id: 5, nama: "Eka Putri", nisn: "0061234571", kelas: "XI RPL 1" },
        { id: 6, nama: "Fajar Ramadhan", nisn: "0061234572", kelas: "XI RPL 1" },
        { id: 7, nama: "Gilang Maulana", nisn: "0061234573", kelas: "XI RPL 1" },
        { id: 8, nama: "Hana Salsabila", nisn: "0061234574", kelas: "XI RPL 1" },
        { id: 9, nama: "Intan Permata", nisn: "0061234575", kelas: "XI RPL 1" },
        { id: 10, nama: "Joko Saputra", nisn: "0061234576", kelas: "XI RPL 1" }
    ];


    /*
     * FREKUENSI MENGIKUTI VERSI YANG KAMU MAU
     */
    const FREKUENSI = {
        harian: "Harian",
        mingguan: "Mingguan",
        bulanan: "Bulanan",
        tahunan: "Tahunan",
        insidental: "Insidental"
    };


    let iuranData = [
        {
            id: 1,
            nama_iuran: "Kas Kelas",
            keterangan: "Kas rutin kelas.",
            jatuh_tempo: "2026-10-10",
            frekuensi: "mingguan",
            nominal: 10000,
            status: "aktif",
            pembayaran: {
                1: 10000,
                2: 10000,
                3: 0,
                4: 10000,
                5: 0,
                6: 10000,
                7: 0,
                8: 10000,
                9: 0,
                10: 10000
            }
        },

        {
            id: 2,
            nama_iuran: "Kas Bulanan",
            keterangan: "Iuran kas kelas bulanan.",
            jatuh_tempo: "2026-10-31",
            frekuensi: "bulanan",
            nominal: 25000,
            status: "aktif",
            pembayaran: {
                1: 25000,
                2: 25000,
                3: 25000,
                4: 0,
                5: 25000,
                6: 0,
                7: 25000,
                8: 0,
                9: 0,
                10: 25000
            }
        },

        {
            id: 3,
            nama_iuran: "Class Meeting",
            keterangan: "Iuran kegiatan class meeting.",
            jatuh_tempo: "2026-10-20",
            frekuensi: "insidental",
            nominal: 50000,
            status: "aktif",
            pembayaran: {
                1: 50000,
                2: 50000,
                3: 0,
                4: 0,
                5: 50000,
                6: 0,
                7: 0,
                8: 50000,
                9: 0,
                10: 0
            }
        }
    ];


    let editingId = null;
    let selectedIuranId = null;
    let selectedSiswaId = null;
    let deletingId = null;


    /* =========================================================
       ELEMENT
       ========================================================= */

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");

    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");

    const modalIuran = document.getElementById("modalIuran");
    const modalDetail = document.getElementById("modalDetailIuran");
    const modalPembayaran = document.getElementById("modalPembayaran");
    const modalHapus = document.getElementById("modalHapusIuran");


    /* =========================================================
       FORMAT
       ========================================================= */

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(value) || 0);
    }


    function formatTanggal(value) {
        if (!value) return "-";

        const date = new Date(`${value}T00:00:00`);

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function getTotalTerkumpul(iuran) {
        return Object.values(iuran.pembayaran || {})
            .reduce((total, value) => total + Number(value || 0), 0);
    }


    function getJumlahLunas(iuran) {
        return SISWA.filter((siswa) => {
            return Number(iuran.pembayaran?.[siswa.id] || 0) >= iuran.nominal;
        }).length;
    }


    function getPersentase(iuran) {
        if (!SISWA.length) return 0;

        return Math.round(
            (getJumlahLunas(iuran) / SISWA.length) * 100
        );
    }


    /* =========================================================
       TOPBAR DATE
       ========================================================= */

    const topbarDate = document.getElementById("topbarDate");

    if (topbarDate) {
        topbarDate.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }


    /* =========================================================
       SIDEBAR
       ========================================================= */

    function openSidebar() {
        document.body.classList.add("nav-open");
    }


    function closeSidebar() {
        document.body.classList.remove("nav-open");
    }


    sidebarToggle?.addEventListener("click", () => {
        document.body.classList.toggle("nav-open");
    });


    sidebarBackdrop?.addEventListener("click", closeSidebar);


    document.querySelectorAll(".side-link").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });


    window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) {
            closeSidebar();
        }
    });


    /* =========================================================
       PROFILE
       ========================================================= */

    profileBtn?.addEventListener("click", (event) => {

        event.stopPropagation();

        const isOpen = profileMenu.classList.toggle("is-open");

        profileBtn.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });


    document.addEventListener("click", (event) => {

        if (
            profileMenu &&
            !profileMenu.contains(event.target) &&
            !profileBtn.contains(event.target)
        ) {
            profileMenu.classList.remove("is-open");
            profileBtn?.setAttribute("aria-expanded", "false");
        }

    });


    /* =========================================================
       MODAL
       ========================================================= */

    function openModal(modal) {

        if (!modal) return;

        modal.hidden = false;

        requestAnimationFrame(() => {
            modal.classList.add("is-open");
        });

        document.body.classList.add("modal-open");
    }


    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("is-open");

        setTimeout(() => {
            modal.hidden = true;
        }, 180);

        if (
            !document.querySelector(
                ".modal.is-open"
            )
        ) {
            document.body.classList.remove("modal-open");
        }
    }


    document.querySelectorAll("[data-close-modal]").forEach((button) => {

        button.addEventListener("click", () => {

            const modal = button.closest(".modal");

            closeModal(modal);

        });

    });


    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") return;

        document.querySelectorAll(".modal.is-open").forEach((modal) => {
            closeModal(modal);
        });

    });


    /* =========================================================
       SUMMARY
       ========================================================= */

    function renderSummary() {

        const totalIuran = iuranData.length;

        const totalTagihan = iuranData.reduce((total, iuran) => {
            return total + (iuran.nominal * SISWA.length);
        }, 0);

        const totalTerkumpul = iuranData.reduce((total, iuran) => {
            return total + getTotalTerkumpul(iuran);
        }, 0);


        document.getElementById("sumTotalIuran").textContent =
            totalIuran;

        document.getElementById("sumTagihan").textContent =
            formatRupiah(totalTagihan);

        document.getElementById("sumTerkumpul").textContent =
            formatRupiah(totalTerkumpul);

        document.getElementById("jumlahIuranFoot").textContent =
            `${totalIuran} iuran`;

    }


    /* =========================================================
       RENDER TABLE IURAN
       ========================================================= */

    function renderIuran() {

        const tbody = document.getElementById("isiTabelIuran");

        const search =
            document.getElementById("cariIuran")
                .value
                .trim()
                .toLowerCase();

        const frekuensi =
            document.getElementById("filterFrekuensi").value;

        const status =
            document.getElementById("filterStatusIuran").value;


        const filtered = iuranData.filter((iuran) => {

            const matchSearch =
                !search ||
                iuran.nama_iuran.toLowerCase().includes(search) ||
                iuran.keterangan.toLowerCase().includes(search);

            const matchFrekuensi =
                !frekuensi ||
                iuran.frekuensi === frekuensi;

            const matchStatus =
                !status ||
                iuran.status === status;

            return matchSearch &&
                matchFrekuensi &&
                matchStatus;
        });


        tbody.innerHTML = "";


        document.getElementById("emptyState").hidden =
            filtered.length !== 0;


        filtered.forEach((iuran) => {

            const terkumpul =
                getTotalTerkumpul(iuran);

            const progress =
                getPersentase(iuran);

            const tr = document.createElement("tr");


            tr.innerHTML = `
                <td>
                    <div class="table-primary">
                        ${escapeHTML(iuran.nama_iuran)}
                    </div>

                    <div class="table-secondary">
                        ${escapeHTML(iuran.keterangan || "—")}
                    </div>
                </td>

                <td>
                    <span class="frequency-badge">
                        ${FREKUENSI[iuran.frekuensi]}
                    </span>
                </td>

                <td>
                    ${formatTanggal(iuran.jatuh_tempo)}
                </td>

                <td>
                    <strong class="money">
                        ${formatRupiah(iuran.nominal)}
                    </strong>
                </td>

                <td>
                    <strong class="money">
                        ${formatRupiah(terkumpul)}
                    </strong>
                </td>

                <td>
                    <div class="progress-cell">

                        <div class="progress-track">
                            <span style="width:${progress}%"></span>
                        </div>

                        <small>
                            ${progress}%
                        </small>

                    </div>
                </td>

                <td>
                    <span class="status-badge status-badge--${iuran.status}">
                        ${iuran.status === "aktif" ? "Aktif" : "Selesai"}
                    </span>
                </td>

                <td>

                    <div class="table-actions">

                        <button
                            type="button"
                            class="icon-btn"
                            title="Lihat detail"
                            data-action="detail"
                            data-id="${iuran.id}"
                        >
                            <span class="material-symbols-outlined">
                                visibility
                            </span>
                        </button>

                        <button
                            type="button"
                            class="icon-btn"
                            title="Edit"
                            data-action="edit"
                            data-id="${iuran.id}"
                        >
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </button>

                        <button
                            type="button"
                            class="icon-btn icon-btn--danger"
                            title="Hapus"
                            data-action="delete"
                            data-id="${iuran.id}"
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


        renderSummary();
    }


    /* =========================================================
       TAMBAH IURAN
       ========================================================= */

    document
        .getElementById("btnTambahIuran")
        ?.addEventListener("click", () => {

            editingId = null;

            document.getElementById("modalIuranTitle").textContent =
                "Tambah Iuran";

            document.getElementById("modalIuranSub").textContent =
                "Masukkan informasi iuran kelas.";

            document.getElementById("formIuran").reset();

            document.getElementById("formErrorIuran").hidden = true;

            openModal(modalIuran);

        });


    /* =========================================================
       EDIT IURAN
       ========================================================= */

    function editIuran(id) {

        const iuran = iuranData.find(
            (item) => item.id === id
        );

        if (!iuran) return;


        editingId = id;


        document.getElementById("modalIuranTitle").textContent =
            "Edit Iuran";

        document.getElementById("modalIuranSub").textContent =
            "Perbarui informasi iuran.";


        document.getElementById("inputNamaIuran").value =
            iuran.nama_iuran;

        document.getElementById("inputFrekuensi").value =
            iuran.frekuensi;

        document.getElementById("inputJatuhTempo").value =
            iuran.jatuh_tempo;

        document.getElementById("inputNominalIuran").value =
            iuran.nominal;

        document.getElementById("inputStatusIuran").value =
            iuran.status;

        document.getElementById("inputKeteranganIuran").value =
            iuran.keterangan || "";

        document.getElementById("formErrorIuran").hidden =
            true;


        openModal(modalIuran);
    }


    /* =========================================================
       SIMPAN IURAN
       ========================================================= */

    document
        .getElementById("formIuran")
        ?.addEventListener("submit", (event) => {

            event.preventDefault();


            const nama =
                document.getElementById("inputNamaIuran")
                    .value
                    .trim();

            const frekuensi =
                document.getElementById("inputFrekuensi")
                    .value;

            const jatuhTempo =
                document.getElementById("inputJatuhTempo")
                    .value;

            const nominal =
                Number(
                    document.getElementById("inputNominalIuran")
                        .value
                );

            const status =
                document.getElementById("inputStatusIuran")
                    .value;

            const keterangan =
                document.getElementById("inputKeteranganIuran")
                    .value
                    .trim();


            const error =
                document.getElementById("formErrorIuran");


            if (
                !nama ||
                !frekuensi ||
                !jatuhTempo ||
                !nominal ||
                nominal <= 0
            ) {

                error.textContent =
                    "Lengkapi data iuran terlebih dahulu.";

                error.hidden = false;

                return;
            }


            if (editingId) {

                const iuran = iuranData.find(
                    (item) => item.id === editingId
                );

                if (iuran) {

                    iuran.nama_iuran = nama;
                    iuran.frekuensi = frekuensi;
                    iuran.jatuh_tempo = jatuhTempo;
                    iuran.nominal = nominal;
                    iuran.status = status;
                    iuran.keterangan = keterangan;

                }


                showToast(
                    "Berhasil",
                    "Iuran berhasil diperbarui."
                );

            } else {

                iuranData.push({

                    id: Date.now(),

                    nama_iuran: nama,

                    keterangan,

                    jatuh_tempo: jatuhTempo,

                    frekuensi,

                    nominal,

                    status,

                    pembayaran: {}

                });


                showToast(
                    "Berhasil",
                    "Iuran baru berhasil ditambahkan."
                );
            }


            closeModal(modalIuran);

            renderIuran();

        });


    /* =========================================================
       DETAIL IURAN
       ========================================================= */

    function openDetail(id) {

        const iuran = iuranData.find(
            (item) => item.id === id
        );

        if (!iuran) return;


        selectedIuranId = id;


        document.getElementById("detailIuranTitle").textContent =
            iuran.nama_iuran;

        document.getElementById("detailIuranSub").textContent =
            iuran.keterangan || "Tidak ada keterangan.";

        document.getElementById("detailFrekuensi").textContent =
            FREKUENSI[iuran.frekuensi];

        document.getElementById("detailJatuhTempo").textContent =
            formatTanggal(iuran.jatuh_tempo);

        document.getElementById("detailNominal").textContent =
            formatRupiah(iuran.nominal);

        document.getElementById("detailTerkumpul").textContent =
            formatRupiah(getTotalTerkumpul(iuran));


        document.getElementById("cariDetailSiswa").value = "";

        document.getElementById("filterDetailStatus").value = "";


        renderDetailSiswa();

        openModal(modalDetail);
    }


    function renderDetailSiswa() {

        const iuran = iuranData.find(
            (item) => item.id === selectedIuranId
        );

        if (!iuran) return;


        const search =
            document.getElementById("cariDetailSiswa")
                .value
                .trim()
                .toLowerCase();

        const statusFilter =
            document.getElementById("filterDetailStatus")
                .value;


        const filtered = SISWA.filter((siswa) => {

            const dibayar =
                Number(iuran.pembayaran?.[siswa.id] || 0);

            const status =
                dibayar >= iuran.nominal
                    ? "lunas"
                    : "belum";


            const matchSearch =
                !search ||
                siswa.nama.toLowerCase().includes(search) ||
                siswa.nisn.includes(search);


            const matchStatus =
                !statusFilter ||
                status === statusFilter;


            return matchSearch && matchStatus;
        });


        const tbody =
            document.getElementById("isiTabelDetail");

        tbody.innerHTML = "";


        document.getElementById("emptyDetail").hidden =
            filtered.length !== 0;


        filtered.forEach((siswa, index) => {

            const dibayar =
                Number(iuran.pembayaran?.[siswa.id] || 0);

            const lunas =
                dibayar >= iuran.nominal;


            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    <div class="table-primary">
                        ${escapeHTML(siswa.nama)}
                    </div>
                </td>

                <td>
                    ${escapeHTML(siswa.nisn)}
                </td>

                <td>
                    ${escapeHTML(siswa.kelas)}
                </td>

                <td>
                    ${formatRupiah(dibayar)}
                    <div class="table-secondary">
                        dari ${formatRupiah(iuran.nominal)}
                    </div>
                </td>

                <td>
                    <span class="status-badge ${
                        lunas
                            ? "status-badge--lunas"
                            : "status-badge--belum"
                    }">
                        ${lunas ? "Lunas" : "Belum Bayar"}
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        class="btn btn--small ${
                            lunas
                                ? "btn--ghost"
                                : "btn--primary"
                        }"
                        data-payment="${siswa.id}"
                    >

                        <span class="material-symbols-outlined">
                            ${
                                lunas
                                    ? "visibility"
                                    : "payments"
                            }
                        </span>

                        ${
                            lunas
                                ? "Detail"
                                : "Bayar"
                        }

                    </button>

                </td>
            `;


            tbody.appendChild(tr);

        });

    }


    document
        .getElementById("cariDetailSiswa")
        ?.addEventListener(
            "input",
            renderDetailSiswa
        );


    document
        .getElementById("filterDetailStatus")
        ?.addEventListener(
            "change",
            renderDetailSiswa
        );


    /* =========================================================
       PEMBAYARAN
       ========================================================= */

    function openPembayaran(siswaId) {

        const iuran = iuranData.find(
            (item) => item.id === selectedIuranId
        );

        const siswa = SISWA.find(
            (item) => item.id === siswaId
        );

        if (!iuran || !siswa) return;


        selectedSiswaId = siswaId;


        const sudahDibayar =
            Number(iuran.pembayaran?.[siswaId] || 0);

        const sisa =
            Math.max(
                0,
                iuran.nominal - sudahDibayar
            );


        document.getElementById("inputPembayaranSiswa").value =
            siswa.nama;

        document.getElementById("pembayaranIuranSub").textContent =
            `${iuran.nama_iuran} • ${siswa.kelas}`;

        document.getElementById("pembayaranTagihan").textContent =
            formatRupiah(sisa);

        document.getElementById("inputPembayaranDiterima").value =
            "";

        document.getElementById("hasilKembalian").textContent =
            formatRupiah(0);

        document.getElementById("hasilMasukKas").textContent =
            formatRupiah(0);

        document.getElementById("formErrorPembayaran").hidden =
            true;


        openModal(modalPembayaran);
    }


    document
        .getElementById("inputPembayaranDiterima")
        ?.addEventListener("input", () => {

            const iuran = iuranData.find(
                (item) => item.id === selectedIuranId
            );

            if (!iuran) return;


            const sudahDibayar =
                Number(
                    iuran.pembayaran?.[selectedSiswaId] || 0
                );

            const sisa =
                Math.max(
                    0,
                    iuran.nominal - sudahDibayar
                );


            const diterima =
                Number(
                    document.getElementById(
                        "inputPembayaranDiterima"
                    ).value
                ) || 0;


            const masukKas =
                Math.min(
                    diterima,
                    sisa
                );


            const kembalian =
                Math.max(
                    0,
                    diterima - sisa
                );


            document.getElementById(
                "hasilKembalian"
            ).textContent =
                formatRupiah(kembalian);


            document.getElementById(
                "hasilMasukKas"
            ).textContent =
                formatRupiah(masukKas);

        });


    document
        .getElementById("formPembayaran")
        ?.addEventListener("submit", (event) => {

            event.preventDefault();


            const iuran = iuranData.find(
                (item) => item.id === selectedIuranId
            );

            if (!iuran) return;


            const sudahDibayar =
                Number(
                    iuran.pembayaran?.[selectedSiswaId] || 0
                );


            const sisa =
                Math.max(
                    0,
                    iuran.nominal - sudahDibayar
                );


            const diterima =
                Number(
                    document.getElementById(
                        "inputPembayaranDiterima"
                    ).value
                ) || 0;


            const error =
                document.getElementById(
                    "formErrorPembayaran"
                );


            if (diterima <= 0) {

                error.textContent =
                    "Masukkan jumlah uang yang diterima.";

                error.hidden = false;

                return;
            }


            if (diterima < sisa) {

                error.textContent =
                    `Uang yang diterima kurang dari sisa tagihan (${formatRupiah(sisa)}).`;

                error.hidden = false;

                return;
            }


            const masukKas =
                Math.min(
                    diterima,
                    sisa
                );


            if (!iuran.pembayaran) {
                iuran.pembayaran = {};
            }


            iuran.pembayaran[selectedSiswaId] =
                sudahDibayar + masukKas;


            closeModal(modalPembayaran);

            renderDetailSiswa();

            renderIuran();


            showToast(
                "Pembayaran berhasil",
                "Pembayaran siswa berhasil dicatat."
            );

        });


    /* =========================================================
       TABLE ACTION
       ========================================================= */

    document
        .getElementById("isiTabelIuran")
        ?.addEventListener("click", (event) => {

            const button =
                event.target.closest("[data-action]");

            if (!button) return;


            const id =
                Number(button.dataset.id);

            const action =
                button.dataset.action;


            if (action === "detail") {
                openDetail(id);
            }

            if (action === "edit") {
                editIuran(id);
            }

            if (action === "delete") {
                openDelete(id);
            }

        });


    document
        .getElementById("isiTabelDetail")
        ?.addEventListener("click", (event) => {

            const button =
                event.target.closest("[data-payment]");

            if (!button) return;


            const siswaId =
                Number(button.dataset.payment);

            openPembayaran(siswaId);

        });


    /* =========================================================
       DELETE
       ========================================================= */

    function openDelete(id) {

        const iuran =
            iuranData.find(
                (item) => item.id === id
            );

        if (!iuran) return;


        deletingId = id;


        document.getElementById("hapusIuranNama").textContent =
            iuran.nama_iuran;


        openModal(modalHapus);
    }


    document
        .getElementById("btnKonfirmasiHapus")
        ?.addEventListener("click", () => {

            if (!deletingId) return;


            iuranData =
                iuranData.filter(
                    (item) => item.id !== deletingId
                );


            deletingId = null;


            closeModal(modalHapus);

            renderIuran();


            showToast(
                "Berhasil",
                "Iuran berhasil dihapus."
            );

        });


    /* =========================================================
       FILTER
       ========================================================= */

    document
        .getElementById("cariIuran")
        ?.addEventListener(
            "input",
            renderIuran
        );


    document
        .getElementById("filterFrekuensi")
        ?.addEventListener(
            "change",
            renderIuran
        );


    document
        .getElementById("filterStatusIuran")
        ?.addEventListener(
            "change",
            renderIuran
        );


    document
        .getElementById("btnResetFilter")
        ?.addEventListener("click", () => {

            document.getElementById("cariIuran").value = "";
            document.getElementById("filterFrekuensi").value = "";
            document.getElementById("filterStatusIuran").value = "";

            renderIuran();

        });


    /* =========================================================
       TOAST
       ========================================================= */

    let toastTimer;


    function showToast(title, message) {

        const toast =
            document.getElementById("toast");

        document.getElementById("toastTitle").textContent =
            title;

        document.getElementById("toastMessage").textContent =
            message;


        toast.classList.add("is-muncul");


        clearTimeout(toastTimer);


        toastTimer = setTimeout(() => {
            toast.classList.remove("is-muncul");
        }, 3000);

    }


    /* =========================================================
       INIT
       ========================================================= */

    renderIuran();

});
