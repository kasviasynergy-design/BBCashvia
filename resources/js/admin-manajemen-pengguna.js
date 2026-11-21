// BBCASHVIA - modul bersama S3-07 (pengaman simpan ganda).
import {
    beriKunciIdempoten,
    kunciTombolSimpan,
} from "./simpan-guard.js";
import {
    ambilFilterKelasDariUrl,
    isiDropdownFilterKelas,
    nilaiFilterKelas,
    simpanFilterKelasKeUrl,
} from "./admin-filter-kelas.js";

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =========================================================
       KONFIGURASI API
       ========================================================= */

    const API_URL = "/admin/api/pengguna";


    /* =========================================================
       DATA PENGGUNA (BERASAL DARI DATABASE)
       ========================================================= */

    let DATA_PENGGUNA = [];


    /* =========================================================
       HELPER API
       ========================================================= */

    function pesanErrorAPI(data, status) {

        if (data?.errors) {

            const pesanValidasi =
                Object.values(data.errors)
                    .flat()
                    .filter(Boolean);

            if (pesanValidasi.length) {
                return pesanValidasi.join(" ");
            }
        }

        if (data?.message) {
            return data.message;
        }

        if (status === 401 || status === 403) {
            return "Akses ditolak. Pastikan kamu sudah login sebagai Admin.";
        }

        if (status === 419) {
            return "Sesi berakhir. Muat ulang halaman lalu coba lagi.";
        }

        if (status >= 500) {
            return "Terjadi gangguan pada server. Coba lagi beberapa saat.";
        }

        return "Terjadi kesalahan saat menghubungi server.";
    }


    async function ambilTokenCsrfBaru() {

        try {

            const respons = await fetch("/admin/api/csrf-token", {
                headers: { Accept: "application/json" },
                credentials: "same-origin",
                cache: "no-store"
            });

            if (!respons.ok) {
                return null;
            }

            const data = await respons.json();

            return (
                typeof data?.token === "string" &&
                data.token !== ""
            )
                ? data.token
                : null;

        } catch {

            return null;
        }
    }


    async function permintaanAPI(url, opsi = {}) {

        const {
            csrfBaru = false,
            ...opsiFetch
        } = opsi;

        const csrf = (
            csrfBaru
                ? await ambilTokenCsrfBaru()
                : null
        ) || document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        const headers = {
            Accept: "application/json",
            ...(opsiFetch.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
            ...(opsiFetch.headers || {})
        };

        let respons;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            // S3-07: permintaan POST otomatis dibawa kunci idempotensi.
            respons = await fetch(url, beriKunciIdempoten({
                ...opsiFetch,
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
            throw new Error(
                pesanErrorAPI(hasil, respons.status)
            );
        }

        return hasil;
    }


    /**
     * Upload FormData tidak boleh memakai header Content-Type JSON.
     * Helper ini memisahkan jalur unggah berkas dari permintaanAPI().
     */
    async function permintaanFormData(url, formData, opsi = {}) {
        const csrf = (
            opsi.csrfBaru
                ? await ambilTokenCsrfBaru()
                : null
        ) || document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        const opsiFetch = beriKunciIdempoten({
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
                ...(csrf ? { "X-CSRF-TOKEN": csrf } : {})
            },
            credentials: "same-origin"
        });

        const respons = await fetch(url, opsiFetch);

        let hasil = {};

        try {
            hasil = await respons.json();
        } catch {
            // Respons bukan JSON.
        }

        if (!respons.ok) {
            throw new Error(pesanErrorAPI(hasil, respons.status));
        }

        return hasil;
    }


    /** Unduh file XLSX dari base64 yang dikirim server (tanpa disimpan). */
    function unduhXlsx(base64, namaFile) {
        if (!base64) return;

        let biner;

        try {
            biner = atob(base64);
        } catch {
            showToast("File akun tidak dapat dibuka.");
            return;
        }

        const byte = new Uint8Array(biner.length);

        for (let i = 0; i < biner.length; i++) {
            byte[i] = biner.charCodeAt(i);
        }

        const url = URL.createObjectURL(
            new Blob([byte], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            })
        );

        const tautan = document.createElement("a");
        tautan.href = url;
        tautan.download = namaFile;
        document.body.appendChild(tautan);
        tautan.click();
        tautan.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1500);
    }


    /* =========================================================
       MUAT DATA DARI DATABASE
       ========================================================= */

    let sedangMemuat = false;


    async function muatData() {

        if (sedangMemuat) return;

        sedangMemuat = true;

        try {
            const idKelas = nilaiFilterKelas(filterKelas);

            const url = idKelas
                ? `${API_URL}?id_kelas=${encodeURIComponent(idKelas)}`
                : API_URL;

            // Simpan pilihan kelas di URL agar tidak hilang saat reload.
            simpanFilterKelasKeUrl(filterKelas?.value);

            const hasil = await permintaanAPI(url);

            const data =
                Array.isArray(hasil.data)
                    ? hasil.data
                    : [];

            DAFTAR_KELAS =
                Array.isArray(hasil.kelas)
                    ? hasil.kelas
                    : [];

            isiPilihanKelas();
            isiPilihanKelasPendukung();

            DATA_PENGGUNA = data.map((user) => ({
                db_id: user.db_id,
                id: user.id,
                nama: user.nama,
                email: user.email,
                peran: String(user.peran || "").toLowerCase(),
                jenis_viewer: user.jenis_viewer ?? null,
                jenis_viewer_label: user.jenis_viewer_label ?? null,
                id_siswa: user.id_siswa ?? null,
                nis: user.nis ?? null,
                nama_siswa: user.nama_siswa ?? null,
                id_kelas: user.id_kelas ?? null,
                kelas: user.kelas ?? null,
                login: user.login || null,
                utama: Boolean(user.utama)
            }));

            renderSummary();
            renderTable();
        } catch (error) {

            console.error(
                "Gagal memuat data pengguna:",
                error
            );

            DATA_PENGGUNA = [];

            isiPilihanKelasPendukung();
            renderSummary();
            renderTable();

            showToast(error.message);
        } finally {
            sedangMemuat = false;
        }
    }


    /* =========================================================
       ELEMENT
       ========================================================= */

    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");

    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");

    const topbarDate = document.getElementById("topbarDate");

    const cariPengguna = document.getElementById("cariPengguna");
    const filterPeran = document.getElementById("filterPeran");
    const filterKelas = document.getElementById("filterKelas");
    const btnResetFilter = document.getElementById("btnResetFilter");

    const isiTabelPengguna = document.getElementById("isiTabelPengguna");
    const emptyState = document.getElementById("emptyState");
    const btnKosongkanFilter = document.getElementById("btnKosongkanFilter");

    const jumlahPengguna = document.getElementById("jumlahPengguna");

    const sumAdmin = document.getElementById("sumAdmin");
    const sumBendahara = document.getElementById("sumBendahara");
    const sumViewer = document.getElementById("sumViewer");

    const btnTambahPengguna = document.getElementById("btnTambahPengguna");
    const btnImportPengguna = document.getElementById("btnImportPengguna");

    const modalForm = document.getElementById("modalForm");
    const modalHapus = document.getElementById("modalHapus");
    const modalImport = document.getElementById("modalImport");
    const modalAkun = document.getElementById("modalAkun");

    const importFile = document.getElementById("importFile");
    const importKelas = document.getElementById("importKelas");
    const btnPreviewImport = document.getElementById("btnPreviewImport");
    const btnKonfirmasiImport = document.getElementById("btnKonfirmasiImport");
    const btnUnduhAkunImport = document.getElementById("btnUnduhAkunImport");
    const previewImport = document.getElementById("previewImport");
    const isiPreviewImport = document.getElementById("isiPreviewImport");
    const rekapPreview = document.getElementById("rekapPreview");
    const hasilImport = document.getElementById("hasilImport");
    const rekapImport = document.getElementById("rekapImport");
    const rincianImport = document.getElementById("rincianImport");

    const akunEmail = document.getElementById("akunEmail");
    const akunPassword = document.getElementById("akunPassword");
    const akunPeringatan = document.getElementById("akunPeringatan");
    const btnUnduhAkunManual = document.getElementById("btnUnduhAkunManual");

    const formPengguna = document.getElementById("formPengguna");
    const modalFormTitle = document.getElementById("modalFormTitle");

    const inputNama = document.getElementById("inputNama");
    const inputEmail = document.getElementById("inputEmail");
    const inputPeran = document.getElementById("inputPeran");
    const inputKelas = document.getElementById("inputKelas");
    const fieldKelas = document.getElementById("fieldKelas");
    const inputJenisViewer = document.getElementById("inputJenisViewer");
    const fieldJenisViewer = document.getElementById("fieldJenisViewer");
    const hintJenisViewer = document.getElementById("hintJenisViewer");
    const inputSiswa = document.getElementById("inputSiswa");
    const inputKelasSiswa = document.getElementById("inputKelasSiswa");
    const cariSiswaForm = document.getElementById("cariSiswaForm");
    const infoSiswaKelas = document.getElementById("infoSiswaKelas");
    const fieldDataSiswa = document.getElementById("fieldDataSiswa");
    const hintDataSiswa = document.getElementById("hintDataSiswa");
    const inputPassword = document.getElementById("inputPassword");

    const togglePassword = document.getElementById("togglePassword");
    const formError = document.getElementById("formError");

    const hapusNama = document.getElementById("hapusNama");
    const btnKonfirmasiHapus = document.getElementById("btnKonfirmasiHapus");

    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");


    /* =========================================================
       STATE
       ========================================================= */

    let editId = null;
    let hapusId = null;
    let HASIL_PREVIEW = [];
    let AKUN_TERAKHIR = null;
    let AKUN_IMPORT = null;

    /* Daftar kelas dari API untuk pilihan kelas pengguna. */
    let DAFTAR_KELAS = [];

    /* Daftar siswa dari API untuk penautan identitas akun. */
    let SISWA_FORM = [];
    let pengaturWaktuCariSiswa = null;
    let urutanMuatSiswa = 0;


    /* =========================================================
       HELPER
       ========================================================= */

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function roleLabel(role) {
        const labels = {
            admin: "Admin",
            bendahara: "Bendahara",
            viewer: "Viewer"
        };

        return labels[role] || role;
    }


    function roleClass(role) {
        const classes = {
            admin: "badge--primary",
            bendahara: "badge--success",
            viewer: "badge--neutral"
        };

        return classes[role] || "badge--neutral";
    }


    /* Isi pilihan kelas pada form sesuai daftar kelas dari API. */
    function isiPilihanKelas() {
        const opsi = DAFTAR_KELAS.map((kelas) => `
            <option value="${escapeHtml(kelas.id_kelas)}">
                ${escapeHtml(kelas.nama_kelas)}
            </option>
        `).join("");

        if (inputKelas) {
            const nilaiLama = inputKelas.value;

            inputKelas.innerHTML = `
                <option value="">- Semua Kelas (khusus Admin) -</option>
                ${opsi}
            `;

            const cocok = DAFTAR_KELAS.some(
                (kelas) => String(kelas.id_kelas) === String(nilaiLama)
            );

            inputKelas.value = cocok ? nilaiLama : "";
        }

        if (inputKelasSiswa) {
            const nilaiLama = inputKelasSiswa.value || inputKelas?.value || "";

            inputKelasSiswa.innerHTML = `
                <option value="">- Pilih kelas terlebih dahulu -</option>
                ${opsi}
            `;

            const cocok = DAFTAR_KELAS.some(
                (kelas) => String(kelas.id_kelas) === String(nilaiLama)
            );

            inputKelasSiswa.value = cocok ? nilaiLama : "";
        }
    }


    /** Isi dropdown kelas pada filter dan form import dari data DB. */
    function isiPilihanKelasPendukung() {
        const opsiKelas = DAFTAR_KELAS.map((kelas) => `
            <option value="${escapeHtml(kelas.id_kelas)}">
                ${escapeHtml(kelas.nama_kelas)}
            </option>
        `).join("");

        // Filter kelas memakai daftar DB yang sama dengan form, dan
        // mengembalikan nilai ?id_kelas= bila halaman dibuka ulang.
        isiDropdownFilterKelas(filterKelas, DAFTAR_KELAS);

        if (importKelas) {
            const nilaiLama = importKelas.value || "";
            importKelas.innerHTML = `
                <option value="">- Semua Kelas / ambil dari kolom Kelas -</option>
                ${opsiKelas}
            `;
            importKelas.value = nilaiLama;
        }
    }


    /*
     * Isi pilihan Data Siswa. Siswa yang sudah tertaut ke akun lain
     * dinonaktifkan agar satu siswa tidak memiliki dua akun. Saat
     * mengedit, siswa milik akun itu sendiri tetap dapat dipilih.
     *
     * Daftar diambil dari endpoint per-kelas, bukan dari seluruh siswa.
     */
    function isiPilihanSiswa(idTerpilih = null) {
        if (!inputSiswa) return;

        const nilaiLama = idTerpilih !== null
            ? String(idTerpilih)
            : inputSiswa.value;

        inputSiswa.innerHTML = `
            <option value="">- Pilih siswa -</option>
            ${SISWA_FORM.map((siswa) => {
                const terpakai =
                    siswa.tertaut &&
                    String(siswa.id_siswa) !== String(nilaiLama);

                return `
                    <option
                        value="${escapeHtml(siswa.id_siswa)}"
                        ${terpakai ? "disabled" : ""}
                    >
                        ${escapeHtml(siswa.nama)}
                        • ${escapeHtml(siswa.nis)}
                        • ${escapeHtml(siswa.kelas || "Tanpa kelas")}
                        ${terpakai ? "(sudah memiliki akun)" : ""}
                    </option>
                `;
            }).join("")}
        `;

        const cocok = SISWA_FORM.some(
            (siswa) => String(siswa.id_siswa) === String(nilaiLama)
        );

        inputSiswa.value = cocok ? nilaiLama : "";
    }


    function siswaTerpilih() {
        if (!inputSiswa || !inputSiswa.value) return null;

        return SISWA_FORM.find(
            (siswa) => String(siswa.id_siswa) === String(inputSiswa.value)
        ) || null;
    }


    /**
     * Muat daftar siswa HANYA untuk kelas yang dipilih.
     * Pencarian nama/NIS juga diproses di server.
     */
    async function muatSiswaForm(idTerpilih = null, idUsers = null) {
        if (!inputSiswa) return;

        const idKelas = inputKelasSiswa?.value || inputKelas?.value || "";
        const urutan = ++urutanMuatSiswa;

        if (!idKelas) {
            SISWA_FORM = [];
            isiPilihanSiswa(idTerpilih);

            if (infoSiswaKelas) {
                infoSiswaKelas.textContent = "Pilih kelas untuk menampilkan siswa.";
            }
            return;
        }

        const kata = (cariSiswaForm?.value || "").trim();
        const parameter = new URLSearchParams({ id_kelas: idKelas });

        if (kata) parameter.set("q", kata);
        if (idUsers) parameter.set("id_users", idUsers);

        try {
            const hasil = await permintaanAPI(
                `${API_URL}/siswa?${parameter.toString()}`
            );

            if (urutan !== urutanMuatSiswa) return;

            SISWA_FORM = Array.isArray(hasil.data) ? hasil.data : [];
            isiPilihanSiswa(idTerpilih);

            if (infoSiswaKelas) {
                const namaKelas = hasil.nama_kelas || "kelas ini";
                const totalKelas = hasil.total_kelas ?? SISWA_FORM.length;
                const totalTampil = hasil.total_tampil ?? SISWA_FORM.length;

                infoSiswaKelas.textContent = kata
                    ? `Ditemukan ${totalTampil} dari ${totalKelas} siswa di kelas ${namaKelas}.`
                    : (SISWA_FORM.length
                        ? `${totalKelas} siswa di kelas ${namaKelas}.`
                        : `Belum ada data siswa pada kelas ${namaKelas}.`);
            }
        } catch (error) {
            if (urutan !== urutanMuatSiswa) return;

            SISWA_FORM = [];
            isiPilihanSiswa(idTerpilih);

            if (infoSiswaKelas) {
                infoSiswaKelas.textContent = error.message || "Gagal memuat siswa.";
            }
        }
    }


    /* Apakah peran saat ini wajib memiliki identitas siswa? */
    function peranButuhSiswa() {
        const peran = inputPeran?.value;
        const jenis = inputJenisViewer?.value || "siswa";

        return peran === "bendahara"
            || (peran === "viewer" && jenis === "siswa");
    }


    /*
     * Tampilkan Data Siswa hanya untuk Bendahara / Viewer Siswa.
     * Nama dan kelas mengikuti siswa terpilih (backend juga menegakkan
     * aturan ini), sehingga tampilan dan data tersimpan konsisten.
     */
    function sesuaikanFieldDataSiswa() {
        if (!fieldDataSiswa || !inputPeran) return;

        const butuh = peranButuhSiswa();

        fieldDataSiswa.style.display = butuh ? "" : "none";

        if (inputSiswa) {
            inputSiswa.disabled = !butuh;
            inputSiswa.required = butuh;

            if (!butuh) {
                inputSiswa.value = "";
            }
        }

        if (!butuh) {
            if (inputNama) inputNama.readOnly = false;
            if (inputKelas) inputKelas.disabled = inputPeran.value === "admin";
            if (hintDataSiswa) {
                hintDataSiswa.textContent =
                    "Data siswa hanya diperlukan untuk Bendahara dan Viewer Siswa.";
            }
            return;
        }

        if (hintDataSiswa) {
            hintDataSiswa.textContent =
                "Wajib dipilih. Nama serta kelas akun mengikuti data siswa agar tagihan pribadi tepat.";
        }

        const siswa = siswaTerpilih();

        if (siswa) {
            if (inputNama) {
                inputNama.value = siswa.nama;
                inputNama.readOnly = true;
            }

            if (inputKelas) {
                inputKelas.value = siswa.id_kelas !== null
                    && siswa.id_kelas !== undefined
                    ? String(siswa.id_kelas)
                    : "";
                inputKelas.disabled = true;
            }
        } else {
            if (inputNama) inputNama.readOnly = false;
            if (inputKelas) inputKelas.disabled = false;
        }
    }


    /*
     * Aturan jenis pengguna mengikuti peran:
     *
     *  - Admin     : tidak memiliki jenis pengguna (field disembunyikan).
     *  - Bendahara : selalu Siswa (bendahara kelas adalah siswa).
     *  - Viewer    : Siswa atau Wali Kelas.
     *
     * Aturan yang sama juga ditegakkan di backend (UserController),
     * jadi kombinasi yang tidak sesuai tetap ditolak walau checkbox
     * di frontend dilewati.
     */
    function sesuaikanFieldJenisViewer() {
        if (!fieldJenisViewer || !inputPeran) return;

        const peran = inputPeran.value;
        const hint = document.getElementById("hintJenisViewer");

        if (peran === "admin") {
            fieldJenisViewer.style.display = "none";
            if (inputJenisViewer) {
                inputJenisViewer.value = "siswa";
                inputJenisViewer.disabled = true;
            }
            sesuaikanFieldDataSiswa();
            return;
        }

        fieldJenisViewer.style.display = "";

        if (peran === "bendahara") {
            // Bendahara = siswa. Pilihan wali kelas tidak relevan
            // sehingga dimatikan, bukan sekadar disembunyikan.
            if (inputJenisViewer) {
                inputJenisViewer.value = "siswa";
                inputJenisViewer.disabled = true;
            }
            if (hint) {
                hint.textContent =
                    "Bendahara kelas merupakan siswa yang mengelola keuangan kelas.";
            }
            sesuaikanFieldDataSiswa();
            return;
        }

        // Viewer: siswa atau wali kelas.
        if (inputJenisViewer) {
            inputJenisViewer.disabled = false;
        }
        if (hint) {
            hint.textContent =
                "Viewer dapat berupa siswa atau wali kelas; keduanya hanya melihat data.";
        }
        sesuaikanFieldDataSiswa();
    }


    /* Label jenis pengguna untuk tabel. */
    function jenisPenggunaLabel(user) {
        if (user.jenis_viewer_label) {
            return user.jenis_viewer_label;
        }

        if (user.peran === "bendahara") {
            return "Siswa";
        }

        if (user.peran === "admin") {
            return "-";
        }

        return "Siswa";
    }


    /* Label kelas untuk tabel: admin = "Semua Kelas". */
    function kelasLabel(user) {
        if (user.peran === "admin") {
            return "Semua Kelas";
        }

        return user.kelas || "Belum ditetapkan";
    }


    /* Admin tidak dibatasi kelas: dropdown tetap tampil tapi dimatikan
       agar admin paham bahwa kelas hanya berlaku untuk bendahara/viewer. */
    function sesuaikanFieldKelas() {
        if (!fieldKelas || !inputPeran) return;

        const peran = inputPeran.value;
        const keterangan = fieldKelas.querySelector(".field__hint");

        if (peran === "admin") {
            fieldKelas.style.display = "";
            if (inputKelas) {
                inputKelas.value = "";
                inputKelas.disabled = true;
            }
            if (keterangan) {
                keterangan.textContent =
                    "Admin selalu melihat semua kelas, jadi pilihan kelas tidak berlaku.";
            }
        } else {
            fieldKelas.style.display = "";
            if (inputKelas) inputKelas.disabled = false;
            if (keterangan) {
                keterangan.textContent =
                    "Bendahara & viewer hanya melihat kelas ini.";
            }
        }
    }


    function avatarText(nama) {
        const parts = String(nama)
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (!parts.length) {
            return "U";
        }

        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    }


    function formatLogin(login) {
        if (!login) {
            return "Belum pernah masuk";
        }

        const parts = login.split(" ");

        if (parts.length < 2) {
            return login;
        }

        return `${parts[0]} • ${parts[1]}`;
    }


    function showToast(message) {

        if (!toast || !toastText) return;

        toastText.textContent = message;

        toast.classList.add("is-muncul");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove("is-muncul");
        }, 2600);
    }


    /* =========================================================
       DATE
       ========================================================= */

    function renderDate() {

        if (!topbarDate) return;

        const now = new Date();

        topbarDate.textContent = now.toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    }

    renderDate();


    /* =========================================================
       SIDEBAR RESPONSIVE
       ========================================================= */

    function openSidebar() {
        document.body.classList.add("nav-open");
    }


    function closeSidebar() {
        document.body.classList.remove("nav-open");
    }


    sidebarToggle?.addEventListener("click", () => {

        if (document.body.classList.contains("nav-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }

    });


    sidebarBackdrop?.addEventListener(
        "click",
        closeSidebar
    );


    document.querySelectorAll(".side-link").forEach((link) => {

        link.addEventListener("click", () => {
            closeSidebar();
        });

    });


    /* =========================================================
       PROFILE DROPDOWN
       ========================================================= */

    profileBtn?.addEventListener("click", (event) => {

        event.stopPropagation();

        if (!profileMenu) return;

        const isOpen =
            profileMenu.classList.toggle("is-open");

        profileBtn.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );
    });


    document.addEventListener("click", (event) => {

        if (
            profileMenu &&
            profileBtn &&
            !profileMenu.contains(event.target) &&
            !profileBtn.contains(event.target)
        ) {
            profileMenu.classList.remove("is-open");

            profileBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        }

    });


    /* =========================================================
       SUMMARY
       ========================================================= */

    function renderSummary() {

        const admin = DATA_PENGGUNA.filter(
            (user) => user.peran === "admin"
        ).length;

        const bendahara = DATA_PENGGUNA.filter(
            (user) => user.peran === "bendahara"
        ).length;

        const viewer = DATA_PENGGUNA.filter(
            (user) => user.peran === "viewer"
        ).length;


        if (sumAdmin) {
            sumAdmin.textContent = admin;
        }

        if (sumBendahara) {
            sumBendahara.textContent = bendahara;
        }

        if (sumViewer) {
            sumViewer.textContent = viewer;
        }
    }


    /* =========================================================
       FILTER
       ========================================================= */

    function getFilteredUsers() {

        const keyword = cariPengguna
            ? cariPengguna.value.trim().toLowerCase()
            : "";

        const role = filterPeran
            ? filterPeran.value
            : "semua";


        return DATA_PENGGUNA.filter((user) => {

            const matchKeyword =
                !keyword ||
                user.nama.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword);


            const matchRole =
                role === "semua" ||
                user.peran === role;


            return matchKeyword && matchRole;
        });
    }


    /* =========================================================
       TABLE
       ========================================================= */

    function renderTable() {

        if (!isiTabelPengguna) return;

        const data = getFilteredUsers();


        if (jumlahPengguna) {
            jumlahPengguna.textContent =
                `${data.length} pengguna`;
        }


        if (!data.length) {

            isiTabelPengguna.innerHTML = "";

            emptyState?.classList.add("is-visible");

            return;
        }


        emptyState?.classList.remove("is-visible");


        isiTabelPengguna.innerHTML = data
            .map((user) => {

                return `
                    <tr>

                        <td>
                            <div class="user-cell">

                                <div class="user-cell__avatar">
                                    ${escapeHtml(
                                        avatarText(user.nama)
                                    )}
                                </div>

                                <div class="user-cell__info">

                                    <div class="user-cell__name">
                                        ${escapeHtml(user.nama)}
                                    </div>

                                    <div class="user-cell__email">
                                        ${escapeHtml(user.email)}
                                    </div>

                                </div>

                            </div>
                        </td>


                        <td>
                            <span class="badge ${roleClass(user.peran)}">
                                ${escapeHtml(
                                    roleLabel(user.peran)
                                )}
                            </span>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${escapeHtml(jenisPenggunaLabel(user))}
                            </div>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${escapeHtml(user.nis || "-")}
                            </div>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${escapeHtml(kelasLabel(user))}
                            </div>
                        </td>


                        <td>
                            <span class="badge badge--success">
                                <span class="status-dot"></span>
                                Aktif
                            </span>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${escapeHtml(
                                    formatLogin(user.login)
                                )}
                            </div>
                        </td>


                        <td class="th-c">

                            <div class="row-actions">

                                <button
                                    type="button"
                                    class="row-action"
                                    data-action="edit"
                                    data-id="${escapeHtml(user.id)}"
                                    title="Edit pengguna"
                                    aria-label="Edit pengguna"
                                >
                                    <span class="material-symbols-outlined">
                                        edit
                                    </span>
                                </button>


                                <button
                                    type="button"
                                    class="row-action row-action--danger"
                                    data-action="delete"
                                    data-id="${escapeHtml(user.id)}"
                                    title="Hapus pengguna"
                                    aria-label="Hapus pengguna"
                                    ${user.utama ? "disabled" : ""}
                                >
                                    <span class="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>

                            </div>

                        </td>

                    </tr>
                `;
            })
            .join("");
    }


    /* =========================================================
       FILTER EVENTS
       ========================================================= */

    cariPengguna?.addEventListener(
        "input",
        renderTable
    );


    filterPeran?.addEventListener(
        "change",
        renderTable
    );


    // Filter kelas dijalankan di server (query ?id_kelas=) sehingga
    // daftar pengguna benar-benar berasal dari DB yang sudah disaring.
    filterKelas?.addEventListener(
        "change",
        muatData
    );


    function resetFilter() {

        if (cariPengguna) {
            cariPengguna.value = "";
        }

        if (filterPeran) {
            filterPeran.value = "semua";
        }

        if (filterKelas) {
            filterKelas.value = "semua";
        }

        renderTable();
        muatData();
    }


    btnResetFilter?.addEventListener(
        "click",
        resetFilter
    );


    btnKosongkanFilter?.addEventListener(
        "click",
        resetFilter
    );


    /* =========================================================
       MODAL
       ========================================================= */

    function openModal(modal) {

        if (!modal) return;

        modal.classList.add("is-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("is-open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        if (!document.querySelector(
            ".modal.is-open"
        )) {

            document.body.classList.remove(
                "modal-open"
            );
        }
    }


    document
        .querySelectorAll("[data-close-modal]")
        .forEach((button) => {

            button.addEventListener("click", () => {

                closeModal(modalForm);
                closeModal(modalHapus);
                closeModal(modalImport);
                closeModal(modalAkun);

            });

        });


    /* =========================================================
       FORM RESET
       ========================================================= */

    function clearFormError() {

        if (!formError) return;

        formError.textContent = "";

        formError.classList.remove(
            "is-visible"
        );
    }


    function showFormError(message) {

        if (!formError) return;

        formError.textContent = message;

        formError.classList.add(
            "is-visible"
        );
    }


    function resetForm() {

        formPengguna?.reset();

        editId = null;


        if (modalFormTitle) {
            modalFormTitle.textContent =
                "Tambah Pengguna";
        }


        if (inputPassword) {

            inputPassword.value = "";

            inputPassword.type = "password";

            inputPassword.required = false;

            inputPassword.placeholder =
                "Kosongkan untuk password otomatis";
        }


        if (togglePassword) {

            togglePassword.innerHTML = `
                <span class="material-symbols-outlined">
                    visibility
                </span>
            `;
        }


        clearFormError();


        if (inputPeran) {
            inputPeran.disabled = false;
        }

        if (inputKelas) {
            inputKelas.value = "";
        }

        if (inputKelasSiswa) {
            inputKelasSiswa.value = "";
        }

        if (inputSiswa) {
            inputSiswa.value = "";
        }

        if (cariSiswaForm) cariSiswaForm.value = "";

        if (inputNama) {
            inputNama.readOnly = false;
        }

        SISWA_FORM = [];
        isiPilihanSiswa();
        muatSiswaForm();

        sesuaikanFieldKelas();
        sesuaikanFieldJenisViewer();
        sesuaikanFieldDataSiswa();
    }


    /* =========================================================
       TAMBAH PENGGUNA
       ========================================================= */

    btnTambahPengguna?.addEventListener(
        "click",
        () => {

            resetForm();

            openModal(modalForm);

            setTimeout(() => {
                inputNama?.focus();
            }, 100);

        }
    );


    /* =========================================================
       EDIT PENGGUNA
       ========================================================= */

    async function openEdit(id) {

        const user = DATA_PENGGUNA.find(
            (item) => String(item.id) === String(id)
        );

        if (!user) return;


        editId = id;


        if (modalFormTitle) {
            modalFormTitle.textContent =
                "Edit Pengguna";
        }


        inputNama.value = user.nama;
        inputEmail.value = user.email;
        inputPeran.value = user.peran;

        const kelasAkun = user.id_kelas !== null && user.id_kelas !== undefined
            ? String(user.id_kelas)
            : "";

        if (inputKelas) inputKelas.value = kelasAkun;
        if (inputKelasSiswa) inputKelasSiswa.value = kelasAkun;
        if (cariSiswaForm) cariSiswaForm.value = "";

        SISWA_FORM = [];
        isiPilihanSiswa(user.id_siswa);
        await muatSiswaForm(user.id_siswa, user.db_id);

        if (inputJenisViewer) {
            inputJenisViewer.value =
                user.jenis_viewer || "siswa";
        }

        sesuaikanFieldKelas();
        sesuaikanFieldJenisViewer();
        sesuaikanFieldDataSiswa();


        inputPassword.value = "";
        inputPassword.type = "password";
        inputPassword.required = false;

        inputPassword.placeholder =
            "Kosongkan jika tidak ingin mengubah";


        if (togglePassword) {

            togglePassword.innerHTML = `
                <span class="material-symbols-outlined">
                    visibility
                </span>
            `;
        }


        /*
         * Akun utama tidak boleh berganti role.
         */
        inputPeran.disabled =
            Boolean(user.utama);


        clearFormError();

        openModal(modalForm);


        setTimeout(() => {
            inputNama?.focus();
        }, 100);
    }


    /* =========================================================
       DELETE
       ========================================================= */

    function openDelete(id) {

        const user = DATA_PENGGUNA.find(
            (item) => String(item.id) === String(id)
        );

        if (!user || user.utama) {
            return;
        }


        hapusId = id;


        if (hapusNama) {
            hapusNama.textContent =
                user.nama;
        }


        openModal(modalHapus);
    }


    /* =========================================================
       TABLE ACTION
       ========================================================= */

    isiTabelPengguna?.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-action]"
                );

            if (!button) return;


            const action =
                button.dataset.action;

            const id =
                button.dataset.id;


            if (action === "edit") {
                openEdit(id);
            }


            if (action === "delete") {
                openDelete(id);
            }

        }
    );


    /* =========================================================
       PASSWORD TOGGLE
       ========================================================= */

    inputPeran?.addEventListener(
        "change",
        () => {
            sesuaikanFieldKelas();
            sesuaikanFieldJenisViewer();
            sesuaikanFieldDataSiswa();
        }
    );


    inputPeran?.addEventListener(
        "change",
        sesuaikanFieldJenisViewer
    );


    inputJenisViewer?.addEventListener(
        "change",
        sesuaikanFieldDataSiswa
    );


    inputSiswa?.addEventListener(
        "change",
        sesuaikanFieldDataSiswa
    );


    /* Kelas dipilih lebih dulu; daftar siswa mengikuti kelas tersebut. */
    inputKelas?.addEventListener("change", () => {
        if (inputKelasSiswa) inputKelasSiswa.value = inputKelas.value;
        muatSiswaForm();
        sesuaikanFieldDataSiswa();
    });


    inputKelasSiswa?.addEventListener("change", () => {
        if (inputKelas) inputKelas.value = inputKelasSiswa.value;
        muatSiswaForm();
        sesuaikanFieldDataSiswa();
    });


    cariSiswaForm?.addEventListener("input", () => {
        window.clearTimeout(pengaturWaktuCariSiswa);
        pengaturWaktuCariSiswa = window.setTimeout(
            () => muatSiswaForm(),
            250
        );
    });


    togglePassword?.addEventListener(
        "click",
        () => {

            if (!inputPassword) return;


            const isPassword =
                inputPassword.type === "password";


            inputPassword.type =
                isPassword
                    ? "text"
                    : "password";


            togglePassword.innerHTML = `
                <span class="material-symbols-outlined">
                    ${
                        isPassword
                            ? "visibility_off"
                            : "visibility"
                    }
                </span>
            `;
        }
    );


    /* =========================================================
       SUBMIT FORM
       ========================================================= */

    formPengguna?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearFormError();

            // S3-07: kunci tombol simpan saat proses (teks
            // "Memproses...", tidak dapat diklik dua kali via klik
            // maupun Enter). null = masih diproses, boleh henti.
            const tombolSimpanPengguna =
                formPengguna.querySelector('button[type="submit"]');

            const pemulihanTombol =
                kunciTombolSimpan(tombolSimpanPengguna);

            if (!pemulihanTombol) return;

            try {


            const nama =
                inputNama.value.trim();

            const email =
                inputEmail.value.trim().toLowerCase();

            const peran =
                inputPeran.value;

            const jenisPengguna =
                peran === "viewer"
                    ? (inputJenisViewer?.value || "siswa")
                    : peran === "bendahara"
                        ? "siswa"
                        : null;

            const siswa = peranButuhSiswa()
                ? siswaTerpilih()
                : null;

            const idSiswa = siswa
                ? siswa.id_siswa
                : null;

            const password =
                inputPassword.value;


            /* NAMA */

            if (!nama) {

                showFormError(
                    "Nama pengguna wajib diisi."
                );

                inputNama.focus();

                return;
            }


            /* EMAIL */

            if (!email) {

                showFormError(
                    "Email wajib diisi."
                );

                inputEmail.focus();

                return;
            }


            /* FORMAT EMAIL */

            const emailValid =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email);


            if (!emailValid) {

                showFormError(
                    "Masukkan alamat email yang valid."
                );

                inputEmail.focus();

                return;
            }


            /* ROLE */

            if (
                !["admin", "bendahara", "viewer"]
                    .includes(peran)
            ) {

                showFormError(
                    "Pilih peran pengguna."
                );

                inputPeran.focus();

                return;
            }


            /* IDENTITAS SISWA */

            if (peranButuhSiswa() && !siswa) {

                showFormError(
                    "Pilih Data Siswa untuk Bendahara atau Viewer Siswa."
                );

                inputSiswa?.focus();

                return;
            }


            /* EMAIL DUPLIKAT */

            const emailExists =
                DATA_PENGGUNA.some((user) => {

                    return (
                        user.email.toLowerCase() === email &&
                        user.id !== editId
                    );

                });


            if (emailExists) {

                showFormError(
                    "Email tersebut sudah digunakan oleh pengguna lain."
                );

                inputEmail.focus();

                return;
            }


            /* PASSWORD TAMBAH */

            if (!editId && password && password.length < 8) {

                showFormError(
                    "Password awal minimal 8 karakter, atau kosongkan untuk dibuat otomatis."
                );

                inputPassword.focus();

                return;
            }


            /* PASSWORD EDIT */

            if (
                editId &&
                password &&
                password.length < 8
            ) {

                showFormError(
                    "Password baru minimal 8 karakter."
                );

                inputPassword.focus();

                return;
            }


            /* =================================================
               EDIT
               ================================================= */

            if (editId) {

                const user =
                    DATA_PENGGUNA.find(
                        (item) =>
                            item.id === editId
                    );


                if (!user) return;


                const payload = {
                    nama: siswa ? siswa.nama : nama,
                    email,
                    peran,
                    jenis_viewer: jenisPengguna,
                    id_siswa: idSiswa,
                    id_kelas: siswa
                        ? siswa.id_kelas
                        : (peran === "admin"
                            ? null
                            : (inputKelas?.value || null))
                };


                if (password) {
                    payload.password = password;
                }


                try {
                    await permintaanAPI(
                        `${API_URL}/${encodeURIComponent(user.db_id)}`,
                        {
                            method: "PUT",
                            csrfBaru: true,
                            body: JSON.stringify(payload)
                        }
                    );


                    closeModal(modalForm);

                    await muatData();


                    showToast(
                        "Data pengguna berhasil diperbarui."
                    );


                    editId = null;
                } catch (error) {

                    showFormError(error.message);
                }

                return;
            }


            /* =================================================
               TAMBAH
               ================================================= */

            try {
                const hasilTambah = await permintaanAPI(API_URL, {
                    method: "POST",
                    csrfBaru: true,
                    body: JSON.stringify({
                        nama: siswa ? siswa.nama : nama,
                        email,
                        peran,
                        jenis_viewer: jenisPengguna,
                        id_siswa: idSiswa,
                        id_kelas: siswa
                            ? siswa.id_kelas
                            : (peran === "admin"
                                ? null
                                : (inputKelas?.value || null)),
                        password
                    })
                });


                closeModal(modalForm);

                await muatData();

                // Segera segarkan status siswa: siswa yang baru diberi
                // akun tidak lagi bisa dipilih untuk akun berikutnya.
                await muatSiswaForm();


                if (hasilTambah?.password_awal) {
                    tampilkanAkun(hasilTambah);
                } else {
                    showToast(
                        "Pengguna baru berhasil ditambahkan."
                    );
                }


                editId = null;
            } catch (error) {

                showFormError(error.message);
            }
            } finally {
                // S3-07: tombol pulih setelah proses apa pun berakhir
                // (sukses, gagal validasi, maupun galat server).
                pemulihanTombol.pulihkan();
            }
        }
    );


    /* =========================================================
       KONFIRMASI HAPUS
       ========================================================= */

    btnKonfirmasiHapus?.addEventListener(
        "click",
        async () => {

            if (!hapusId) return;


            const user =
                DATA_PENGGUNA.find(
                    (item) =>
                        item.id === hapusId
                );


            if (!user) return;


            if (user.utama) {

                closeModal(modalHapus);

                showToast(
                    "Akun utama Admin tidak dapat dihapus."
                );

                hapusId = null;

                return;
            }


            try {
                await permintaanAPI(
                    `${API_URL}/${encodeURIComponent(user.db_id)}`,
                    { method: "DELETE", csrfBaru: true }
                );


                hapusId = null;


                closeModal(modalHapus);

                await muatData();


                showToast(
                    "Pengguna berhasil dihapus."
                );
            } catch (error) {

                closeModal(modalHapus);

                showToast(error.message);
            }
        }
    );


    /* =========================================================
       PASSWORD AWAL & IMPORT PENGGUNA
       ========================================================= */

    function tampilkanAkun(hasil) {
        AKUN_TERAKHIR = {
            base64: hasil.file_xlsx || null,
            nama: hasil.nama_file || "akun-pengguna-bbcashvia.xlsx"
        };

        if (akunEmail) {
            akunEmail.textContent =
                hasil.data?.email || hasil.akun?.[0]?.email || "-";
        }

        if (akunPassword) {
            akunPassword.textContent = hasil.password_awal || "-";
        }

        if (akunPeringatan) {
            akunPeringatan.textContent =
                hasil.peringatan || "Simpan password ini di tempat aman.";
        }

        if (btnUnduhAkunManual) {
            btnUnduhAkunManual.hidden = !AKUN_TERAKHIR.base64;
        }

        openModal(modalAkun);
    }


    function resetImportForm() {
        HASIL_PREVIEW = [];
        AKUN_IMPORT = null;

        if (importFile) importFile.value = "";
        if (previewImport) previewImport.hidden = true;
        if (hasilImport) hasilImport.hidden = true;
        if (btnKonfirmasiImport) btnKonfirmasiImport.hidden = true;
        if (btnUnduhAkunImport) btnUnduhAkunImport.hidden = true;
        if (isiPreviewImport) isiPreviewImport.innerHTML = "";
        if (rincianImport) rincianImport.innerHTML = "";
    }


    function renderPreview(hasil) {
        const baris = Array.isArray(hasil.data) ? hasil.data : [];

        if (rekapPreview) {
            rekapPreview.textContent =
                `Total ${hasil.total ?? baris.length} baris · ` +
                `${hasil.berhasil ?? 0} valid · ${hasil.gagal ?? 0} tidak valid · ` +
                `${hasil.duplikat ?? 0} duplikat`;
        }

        if (isiPreviewImport) {
            isiPreviewImport.innerHTML = baris.map((item) => {
                const valid = item.status === "valid";

                return `
                    <tr style="border-bottom:1px solid #D4F1F9;">
                        <td style="padding:7px;">${escapeHtml(item.baris)}</td>
                        <td style="padding:7px;">${escapeHtml(item.nama)}</td>
                        <td style="padding:7px;">${escapeHtml(item.email)}</td>
                        <td style="padding:7px;">${escapeHtml(item.peran)}</td>
                        <td style="padding:7px;">${escapeHtml(item.kelas || "-")}</td>
                        <td style="padding:7px;">
                            <span class="badge ${valid ? "badge--success" : "badge--danger"}">
                                ${valid ? "Valid" : "Tidak valid"}
                            </span>
                        </td>
                        <td style="padding:7px;color:#5C7A80;">
                            ${escapeHtml((item.alasan || []).join(" "))}
                        </td>
                    </tr>
                `;
            }).join("");
        }

        if (previewImport) previewImport.hidden = false;
        if (hasilImport) hasilImport.hidden = true;
        if (btnKonfirmasiImport) {
            btnKonfirmasiImport.hidden =
                (hasil.berhasil ?? 0) === 0;
        }
        if (btnUnduhAkunImport) btnUnduhAkunImport.hidden = true;
    }


    async function pratinjauImport() {
        if (!importFile?.files?.length) {
            showToast("Pilih file Excel atau CSV terlebih dahulu.");
            return;
        }

        const kunci = kunciTombolSimpan(btnPreviewImport);
        if (!kunci) return;

        try {
            const formData = new FormData();
            formData.append("file", importFile.files[0]);

            if (importKelas?.value) {
                formData.append("id_kelas", importKelas.value);
            }

            const hasil = await permintaanFormData(
                `${API_URL}/preview`,
                formData
            );

            HASIL_PREVIEW = Array.isArray(hasil.data) ? hasil.data : [];
            renderPreview(hasil);
        } catch (error) {
            showToast(error.message);
        } finally {
            kunci.pulihkan();
        }
    }


    async function jalankanImport() {
        const barisValid = HASIL_PREVIEW
            .filter((item) => item.status === "valid")
            .map((item) => ({
                baris: item.baris,
                nama: item.nama,
                email: item.email,
                nis: item.nis,
                peran: item.peran,
                jenis_viewer: item.jenis_viewer || "",
                kelas: item.kelas,
                id_siswa: item.id_siswa,
                id_kelas: item.id_kelas,
                jenis_kelamin: item.jenis_kelamin || "",
                no_hp: item.no_hp || "",
                siswa_baru: Boolean(item.siswa_baru)
            }));

        if (!barisValid.length) {
            showToast("Tidak ada baris valid yang dapat disimpan.");
            return;
        }

        const kunci = kunciTombolSimpan(btnKonfirmasiImport);
        if (!kunci) return;

        try {
            const hasil = await permintaanAPI(`${API_URL}/import`, {
                method: "POST",
                csrfBaru: true,
                body: JSON.stringify({
                    id_kelas: importKelas?.value || null,
                    baris: barisValid
                })
            });

            AKUN_IMPORT = hasil.file_xlsx
                ? {
                    base64: hasil.file_xlsx,
                    nama: hasil.nama_file || "akun-pengguna-bbcashvia.xlsx"
                }
                : null;

            if (rekapImport) {
                rekapImport.textContent =
                    `Import selesai · ${hasil.akun_berhasil ?? hasil.berhasil ?? 0} akun dibuat · ` +
                    `${hasil.siswa_dibuat ?? 0} siswa ditambahkan · ` +
                    `${hasil.siswa_terhubung ?? 0} siswa ditautkan · ` +
                    `${hasil.duplikat ?? 0} duplikat · ` +
                    `${hasil.gagal ?? 0} gagal`;

                const alasanPertama = (hasil.rincian || [])
                    .flatMap((item) => item.alasan || [])
                    .find((teks) => Boolean(teks));

                if (alasanPertama) {
                    rekapImport.textContent += ` · Alasan: ${alasanPertama}`;
                }
            }

            if (rincianImport) {
                rincianImport.innerHTML = (hasil.rincian || [])
                    .map((item) => `
                        <div>
                            Baris ${escapeHtml(item.baris)}:
                            ${escapeHtml((item.alasan || []).join(" "))}
                        </div>
                    `)
                    .join("");
            }

            if (hasilImport) hasilImport.hidden = false;
            if (btnKonfirmasiImport) btnKonfirmasiImport.hidden = true;
            if (btnUnduhAkunImport) {
                btnUnduhAkunImport.hidden = !AKUN_IMPORT;
            }

            await muatData();
            await muatSiswaForm();
            showToast(hasil.message || "Import selesai.");
        } catch (error) {
            showToast(error.message);
        } finally {
            kunci.pulihkan();
        }
    }


    btnImportPengguna?.addEventListener("click", () => {
        resetImportForm();
        openModal(modalImport);

        setTimeout(() => {
            importFile?.click();
        }, 120);
    });

    btnPreviewImport?.addEventListener("click", pratinjauImport);
    btnKonfirmasiImport?.addEventListener("click", jalankanImport);

    btnUnduhAkunManual?.addEventListener("click", () => {
        if (AKUN_TERAKHIR) {
            unduhXlsx(AKUN_TERAKHIR.base64, AKUN_TERAKHIR.nama);
        }
    });

    btnUnduhAkunImport?.addEventListener("click", () => {
        if (AKUN_IMPORT) {
            unduhXlsx(AKUN_IMPORT.base64, AKUN_IMPORT.nama);
        }
    });


    /* =========================================================
       ESCAPE
       ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            closeModal(modalForm);
            closeModal(modalHapus);
            closeModal(modalImport);
            closeModal(modalAkun);


            profileMenu?.classList.remove(
                "is-open"
            );


            profileBtn?.setAttribute(
                "aria-expanded",
                "false"
            );


            closeSidebar();
        }
    );


    /* =========================================================
       INITIAL LOAD (DARI DATABASE)
       ========================================================= */

    if (filterKelas) {
        filterKelas.value = ambilFilterKelasDariUrl();
    }
    muatData();

});
