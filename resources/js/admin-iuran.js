
// BBCASHVIA - modul bersama S3-07 (pengaman simpan ganda).
import {
    kunciIdempoten,
    kunciTombolSimpan,
} from "./simpan-guard.js";

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       KONFIGURASI API LARAVEL
       ========================================================= */

    const API_IURAN = "/admin/api/iuran";

    let iuranData = [];
    let editingId = null;
    let selectedIuranId = null;
    let deletingId = null;
    let toastTimer = null;

    const KATEGORI_IURAN = {
        "sekali bayar": "Sekali Bayar",
        mingguan: "Mingguan",
        bulanan: "Bulanan",
        tahunan: "Tahunan"
    };

    /* =========================================================
       ELEMENT
       ========================================================= */

    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");
    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");

    const modalIuran = document.getElementById("modalIuran");
    const modalDetail = document.getElementById("modalDetailIuran");
    const modalHapus = document.getElementById("modalHapusIuran");

    const formIuran = document.getElementById("formIuran");
    const formErrorIuran = document.getElementById("formErrorIuran");

    /* =========================================================
       FORMAT DATA
       ========================================================= */

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Number(value) || 0);
    }

    function formatTanggal(value) {
        if (!value) return "-";

        const tanggal = String(value).slice(0, 10);
        const date = new Date(`${tanggal}T00:00:00`);

        if (Number.isNaN(date.getTime())) return "-";

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

    /* Daftar kelas nyata dari database (untuk pilihan kelas iuran). */
    let daftarKelasIuran = [];

    /* Nama kelas dari id, untuk ditampilkan di tabel & filter. */
    function namaKelasDariId(id) {
        if (id === null || id === undefined || id === "") return "Semua Kelas";
        const kelas = daftarKelasIuran.find(
            k => String(k.id_kelas) === String(id)
        );
        return kelas ? kelas.nama_kelas : "Semua Kelas";
    }

    /* Persentase iuran terkumpul terhadap target (nominal x siswa). */
    function persenIuran(item) {
        if (!item.target || item.target <= 0) return 0;
        const persen = Math.round((item.terkumpul / item.target) * 100);
        return Math.max(0, Math.min(100, persen));
    }

    /* Muat daftar kelas dari API admin dan isi select kelas. */
    async function muatKelasIuran() {
        if (daftarKelasIuran.length) return;

        try {
            const hasil = await requestAPI("/admin/api/kelas");
            daftarKelasIuran = Array.isArray(hasil.data)
                ? hasil.data
                : [];
            isiPilihanKelasIuran();
        } catch {
            daftarKelasIuran = [];
        }
    }

    /* Isi select kelas iuran dengan kelas nyata. */
    function isiPilihanKelasIuran() {
        const select = document.getElementById("inputKelasIuran");
        if (!select) return;

        const nilaiLama = select.value;

        select.innerHTML = `
            <option value="">
                - Semua Kelas (khusus Admin) -
            </option>
            ${daftarKelasIuran.map(k => `
                <option value="${escapeHTML(k.id_kelas)}">
                    ${escapeHTML(k.nama_kelas)}
                </option>
            `).join("")}
        `;

        select.value = daftarKelasIuran.some(
            k => String(k.id_kelas) === String(nilaiLama)
        ) ? nilaiLama : "";
    }

    function normalisasiIuran(item) {
        return {
            id: Number(item.id_iuran),
            id_kelas: item.id_kelas ?? "",
            nama_iuran: item.nama_iuran ?? "",
            keterangan: item.keterangan ?? "",
            jatuh_tempo: item.jatuh_tempo
                ? String(item.jatuh_tempo).slice(0, 10)
                : "",
            /* Kategori dari database dipertahankan apa adanya - dipakai
               tabel (badge), form edit, modal detail, dan filter. */
            kategori: item.kategori ?? "",
            nominal: Number(item.nominal) || 0,
            status: item.status ?? "aktif",
            jumlah_siswa: Number(item.jumlah_siswa) || 0,
            target: Number(item.target) || 0,
            terkumpul: Number(item.terkumpul) || 0,
            peserta: Array.isArray(item.peserta) ? item.peserta : []
        };
    }

    function cariIuran(id) {
        return iuranData.find(
            item => Number(item.id) === Number(id)
        );
    }

    /* =========================================================
       REQUEST KE LARAVEL
       ========================================================= */

    async function requestAPI(url, method = "GET", payload = null) {
        const headers = {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
        };

        // S3-07: permintaan POST dibawa kunci idempotensi bagi
        // pengaman simpan ganda di backend.
        if (method === "POST") {
            headers["X-Idempotency-Key"] = kunciIdempoten();
        }

        // Token CSRF wajib dikirim untuk SEMUA metode tulis (POST, PUT,
        // DELETE) - bukan hanya request yang bermuatan. Tanpa ini,
        // hapus iuran (DELETE tanpa badan request) ditolak middleware
        // sebagai "CSRF token mismatch" (419).
        if (method !== "GET") {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            if (csrfToken) {
                headers["X-CSRF-TOKEN"] = csrfToken;
            }
        }

        const options = {
            method,
            headers,
            credentials: "same-origin"
        };

        if (payload !== null) {
            headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(payload);
        }

        let response;

        try {
            response = await fetch(url, options);
        } catch {
            throw new Error(
                "Tidak dapat terhubung ke server. Pastikan Laravel sedang berjalan."
            );
        }

        const contentType = response.headers.get("content-type") || "";
        let result = {};

        if (contentType.includes("application/json")) {
            result = await response.json();
        } else if (!response.ok) {
            if (response.status === 419) {
                throw new Error(
                    "Sesi atau token CSRF kedaluwarsa. Muat ulang halaman, lalu coba lagi."
                );
            }

            if (response.status === 401 || response.status === 403) {
                throw new Error(
                    "Akses ditolak atau sesi login berakhir. Silakan login kembali."
                );
            }

            throw new Error(
                "Server tidak memberikan respons yang sesuai. Periksa route dan controller Laravel."
            );
        }

        if (!response.ok) {
            if (response.status === 422 && result.errors) {
                const pesanValidasi = Object.values(result.errors)
                    .flat()
                    .filter(Boolean);

                throw new Error(
                    pesanValidasi.join(" ") ||
                    "Periksa kembali data yang kamu masukkan."
                );
            }

            if (response.status === 419) {
                throw new Error(
                    "Sesi atau token CSRF kedaluwarsa. Muat ulang halaman, lalu coba lagi."
                );
            }

            if (response.status === 401 || response.status === 403) {
                throw new Error(
                    "Kamu tidak memiliki akses atau sesi login telah berakhir."
                );
            }

            if (response.status >= 500) {
                throw new Error(
                    "Terjadi gangguan pada server. Coba lagi beberapa saat."
                );
            }

            throw new Error(
                result.message || `Permintaan gagal (${response.status}).`
            );
        }

        return result;
    }

    /* =========================================================
       NOTIFIKASI
       ========================================================= */

    function showToast(title, message) {
        const toast = document.getElementById("toast");
        const toastTitle = document.getElementById("toastTitle");
        const toastMessage = document.getElementById("toastMessage");
        const toastIcon = document.getElementById("toastIcon");

        if (!toast || !toastTitle || !toastMessage) return;

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        if (toastIcon) {
            toastIcon.textContent =
                title.toLowerCase().includes("gagal") ||
                title.toLowerCase().includes("error")
                    ? "error"
                    : "check_circle";
        }

        toast.classList.add("is-muncul");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("is-muncul");
        }, 3500);
    }

    /* =========================================================
       TANGGAL TOPBAR
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

    function closeSidebar() {
        document.body.classList.remove("nav-open");
    }

    sidebarToggle?.addEventListener("click", () => {
        document.body.classList.toggle("nav-open");
    });

    sidebarBackdrop?.addEventListener("click", closeSidebar);

    document.querySelectorAll(".side-link").forEach(link => {
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

    profileBtn?.addEventListener("click", event => {
        event.stopPropagation();

        const isOpen = profileMenu?.classList.toggle("is-open") ?? false;

        profileBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", event => {
        if (
            profileMenu &&
            profileBtn &&
            !profileMenu.contains(event.target) &&
            !profileBtn.contains(event.target)
        ) {
            profileMenu.classList.remove("is-open");
            profileBtn.setAttribute("aria-expanded", "false");
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

            const modalMasihTerbuka = Array.from(
                document.querySelectorAll(".modal")
            ).some(item => !item.hidden && item.classList.contains("is-open"));

            if (!modalMasihTerbuka) {
                document.body.classList.remove("modal-open");
            }
        }, 180);
    }

    document.querySelectorAll("[data-close-modal]").forEach(button => {
        button.addEventListener("click", () => {
            closeModal(button.closest(".modal"));
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        document.querySelectorAll(".modal.is-open").forEach(modal => {
            closeModal(modal);
        });
    });

    /* =========================================================
       SUMMARY
       ========================================================= */

    function renderSummary() {
        const totalIuran = iuranData.length;

        // Total nominal yang tercatat pada daftar iuran.
        // Bukan total tagihan seluruh siswa.
        const totalNominalIuran = iuranData.reduce(
            (total, item) => total + item.nominal,
            0
        );

        document.getElementById("sumTotalIuran").textContent =
            totalIuran;

        document.getElementById("sumTagihan").textContent =
            formatRupiah(totalNominalIuran);

        // Total nominal yang sudah dibayarkan siswa (transaksi iuran).
        const totalTerkumpul = iuranData.reduce(
            (total, item) => total + item.terkumpul,
            0
        );

        document.getElementById("sumTerkumpul").textContent =
            formatRupiah(totalTerkumpul);

        document.getElementById("sumTerkumpulNote").textContent =
            "Dari pembayaran siswa";

        document.getElementById("sumTagihanNote").textContent =
            "Jumlah nominal per iuran";

        document.getElementById("jumlahIuranFoot").textContent =
            `${totalIuran} iuran`;
    }

    /* =========================================================
       RENDER TABEL IURAN DARI DATABASE
       ========================================================= */

    function renderIuran() {
        const tbody = document.getElementById("isiTabelIuran");
        const emptyState = document.getElementById("emptyState");

        const search = document.getElementById("cariIuran")
            .value.trim().toLowerCase();

        const frekuensi = document.getElementById("filterKategori").value;
        const status = document.getElementById("filterStatusIuran").value;

        const filtered = iuranData.filter(item => {
            const matchSearch =
                item.nama_iuran.toLowerCase().includes(search) ||
                (item.keterangan || "").toLowerCase().includes(search);

            const matchKategori =
                !frekuensi || item.kategori === frekuensi;

            const matchStatus =
                !status || item.status === status;

            return matchSearch && matchKategori && matchStatus;
        });

        tbody.innerHTML = "";

        emptyState.hidden = filtered.length !== 0;

        filtered.forEach(item => {
            const tr = document.createElement("tr");

            const namaKategori =
                KATEGORI_IURAN[item.kategori] || item.kategori || "-";

            tr.innerHTML = `
                <td>
                    <div class="table-primary">
                        ${escapeHTML(item.nama_iuran)}
                    </div>
                    <div class="table-secondary">
                        ${escapeHTML(item.keterangan || "-")}
                    </div>
                </td>

                <td>
                    <span class="frequency-badge">
                        ${escapeHTML(namaKelasDariId(item.id_kelas))}
                    </span>
                </td>

                <td>
                    <span class="frequency-badge">
                        ${escapeHTML(namaKategori)}
                    </span>
                </td>

                <td>${escapeHTML(formatTanggal(item.jatuh_tempo))}</td>

                <td>
                    <strong class="money">
                        ${formatRupiah(item.nominal)}
                    </strong>
                </td>

                <td>
                    <strong class="money">
                        ${formatRupiah(item.terkumpul)}
                    </strong>
                </td>

                <td>
                    <div class="progress-cell">
                        <div class="progress-track">
                            <span style="width:${persenIuran(item)}%"></span>
                        </div>
                        <small>${persenIuran(item)}% • ${item.jumlah_siswa} siswa</small>
                    </div>
                </td>

                <td>
                    <span class="status-badge status-badge--${escapeHTML(item.status)}">
                        ${item.status === "aktif" ? "Aktif" : "Selesai"}
                    </span>
                </td>

                <td>
                    <div class="table-actions">
                        <button
                            type="button"
                            class="icon-btn"
                            title="Lihat detail"
                            data-action="detail"
                            data-id="${item.id}"
                        >
                            <span class="material-symbols-outlined">visibility</span>
                        </button>

                        <button
                            type="button"
                            class="icon-btn"
                            title="Edit"
                            data-action="edit"
                            data-id="${item.id}"
                        >
                            <span class="material-symbols-outlined">edit</span>
                        </button>

                        <button
                            type="button"
                            class="icon-btn icon-btn--danger"
                            title="Hapus"
                            data-action="delete"
                            data-id="${item.id}"
                        >
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        renderSummary();
    }

    /* =========================================================
       AMBIL IURAN DARI DATABASE
       ========================================================= */

    async function muatIuran() {
        const tbody = document.getElementById("isiTabelIuran");

        tbody.innerHTML = Array.from({ length: 5 })
            .map(() => `<tr class="skeleton-row"><td colspan="9"><div class="skeleton skeleton-text--lg"></div></td></tr>`)
            .join("");

        try {
            await muatKelasIuran();

            const response = await requestAPI(API_IURAN);

            iuranData = Array.isArray(response.data)
                ? response.data.map(normalisasiIuran)
                : [];

            renderIuran();
        } catch (error) {
            iuranData = [];
            renderIuran();

            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align:center;padding:24px">
                        ${escapeHTML(error.message)}
                    </td>
                </tr>
            `;

            document.getElementById("emptyState").hidden = true;

            showToast("Gagal memuat data", error.message);
        }
    }

    /* =========================================================
       RESET FORM IURAN
       ========================================================= */

    function resetFormIuran() {
        formIuran.reset();
        formErrorIuran.textContent = "";
        formErrorIuran.hidden = true;
    }

    /* =========================================================
       TAMBAH IURAN
       ========================================================= */

    document.getElementById("btnTambahIuran")
        ?.addEventListener("click", () => {
            editingId = null;

            document.getElementById("modalIuranTitle").textContent =
                "Tambah Iuran";

            document.getElementById("modalIuranSub").textContent =
                "Masukkan informasi iuran kelas.";

            resetFormIuran();
            openModal(modalIuran);
        });

    /* =========================================================
       EDIT IURAN
       ========================================================= */

    function editIuran(id) {
        const item = cariIuran(id);
        if (!item) return;

        editingId = item.id;

        document.getElementById("modalIuranTitle").textContent =
            "Edit Iuran";

        document.getElementById("modalIuranSub").textContent =
            "Perbarui informasi iuran.";

        document.getElementById("inputNamaIuran").value =
            item.nama_iuran;

        document.getElementById("inputKategori").value =
            item.kategori;

        document.getElementById("inputJatuhTempo").value =
            item.jatuh_tempo;

        document.getElementById("inputNominalIuran").value =
            item.nominal;

        document.getElementById("inputStatusIuran").value =
            item.status;

        document.getElementById("inputKeteranganIuran").value =
            item.keterangan;

        document.getElementById("inputKelasIuran").value =
            item.id_kelas != null ? String(item.id_kelas) : "";

        formErrorIuran.textContent = "";
        formErrorIuran.hidden = true;

        openModal(modalIuran);
    }

    /* =========================================================
       SIMPAN TAMBAH / EDIT KE DATABASE
       ========================================================= */

    formIuran?.addEventListener("submit", async event => {
        event.preventDefault();

        const nama = document.getElementById("inputNamaIuran")
            .value.trim();

        const kategori = document.getElementById("inputKategori").value;
        const jatuhTempo = document.getElementById("inputJatuhTempo").value;
        const nominal = Number(
            document.getElementById("inputNominalIuran").value
        );
        const status = document.getElementById("inputStatusIuran").value;
        const keterangan = document.getElementById("inputKeteranganIuran")
            .value.trim();
        const idKelas = document.getElementById("inputKelasIuran").value;

        if (
            !nama ||
            !kategori ||
            !jatuhTempo ||
            !Number.isFinite(nominal) ||
            nominal <= 0
        ) {
            formErrorIuran.textContent =
                "Lengkapi semua data yang wajib diisi dan pastikan nominal lebih dari nol.";

            formErrorIuran.hidden = false;
            return;
        }

        const payload = {
            nama_iuran: nama,
            kategori,
            jatuh_tempo: jatuhTempo,
            nominal,
            status,
            id_kelas: idKelas ? Number(idKelas) : null,
            keterangan: keterangan || null
        };

        const tombolSubmit = formIuran.querySelector(
            'button[type="submit"]'
        );

        // S3-07: kunci tombol saat proses (teks "Memproses...", tidak
        // dapat diklik dua kali). null = masih diproses, boleh henti.
        const pemulihanTombol = kunciTombolSimpan(tombolSubmit);
        if (!pemulihanTombol) return;

        try {
            if (editingId !== null) {
                await requestAPI(
                    `${API_IURAN}/${editingId}`,
                    "PUT",
                    payload
                );

                closeModal(modalIuran);
                showToast("Berhasil", "Iuran berhasil diperbarui.");
            } else {
                await requestAPI(API_IURAN, "POST", payload);

                closeModal(modalIuran);
                showToast("Berhasil", "Iuran berhasil ditambahkan.");
            }

            editingId = null;
            await muatIuran();
        } catch (error) {
            formErrorIuran.textContent = error.message;
            formErrorIuran.hidden = false;
        } finally {
            // S3-07: tombol pulih setelah proses selesai.
            pemulihanTombol.pulihkan();
        }
    });

    /* =========================================================
       DETAIL IURAN
       Daftar peserta + status bayar diambil dari transaksi nyata.
       ========================================================= */

    function openDetail(id) {
        const item = cariIuran(id);
        if (!item) return;

        selectedIuranId = item.id;

        document.getElementById("detailIuranTitle").textContent =
            item.nama_iuran;

        document.getElementById("detailIuranSub").textContent =
            item.keterangan || "Tidak ada keterangan.";

        document.getElementById("detailKategori").textContent =
            KATEGORI_IURAN[item.kategori] || item.kategori || "-";

        document.getElementById("detailJatuhTempo").textContent =
            formatTanggal(item.jatuh_tempo);

        document.getElementById("detailNominal").textContent =
            formatRupiah(item.nominal);

        document.getElementById("detailTerkumpul").textContent =
            formatRupiah(item.terkumpul);

        document.getElementById("cariDetailSiswa").value = "";
        document.getElementById("filterDetailStatus").value = "";

        renderDetailSiswa();
        openModal(modalDetail);
    }

    function renderDetailSiswa() {
        const tbody = document.getElementById("isiTabelDetail");
        const emptyDetail = document.getElementById("emptyDetail");

        const item = cariIuran(selectedIuranId);

        const search = document
            .getElementById("cariDetailSiswa")
            .value.trim().toLowerCase();

        const filter = document.getElementById("filterDetailStatus").value;

        const peserta = item ? item.peserta : [];

        const filtered = peserta.filter(row => {
            const nama = String(row.nama_siswa ?? "").toLowerCase();
            const nis = String(row.nis ?? "").toLowerCase();

            const matchSearch =
                !search || nama.includes(search) || nis.includes(search);

            const matchStatus =
                !filter ||
                (filter === "lunas" && row.lunas) ||
                (filter === "belum" && !row.lunas);

            return matchSearch && matchStatus;
        });

        tbody.innerHTML = "";

        emptyDetail.hidden = filtered.length !== 0;

        filtered.forEach((row, index) => {
            const tr = document.createElement("tr");

            const namaKelas = namaKelasDariId(item ? item.id_kelas : "");

            tr.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    <div class="table-primary">
                        ${escapeHTML(row.nama_siswa)}
                    </div>
                </td>

                <td>${escapeHTML(row.nis ?? "-")}</td>

                <td>${escapeHTML(namaKelas)}</td>

                <td>
                    <strong class="money">
                        ${formatRupiah(row.nominal)}
                    </strong>
                </td>

                <td>
                    <span class="status-badge status-badge--${
                        row.lunas ? "lunas" : "belum"
                    }">
                        ${row.lunas ? "Lunas" : "Belum Bayar"}
                    </span>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }

    document.getElementById("cariDetailSiswa")
        ?.addEventListener("input", renderDetailSiswa);

    document.getElementById("filterDetailStatus")
        ?.addEventListener("change", renderDetailSiswa);

    /* =========================================================
       AKSI TABEL IURAN
       ========================================================= */

    document.getElementById("isiTabelIuran")
        ?.addEventListener("click", event => {
            const button = event.target.closest("[data-action]");
            if (!button) return;

            const id = Number(button.dataset.id);
            const action = button.dataset.action;

            if (action === "detail") openDetail(id);
            if (action === "edit") editIuran(id);
            if (action === "delete") openDelete(id);
        });

    /* =========================================================
       HAPUS IURAN
       ========================================================= */

    function openDelete(id) {
        const item = cariIuran(id);
        if (!item) return;

        deletingId = item.id;

        document.getElementById("hapusIuranNama").textContent =
            item.nama_iuran;

        openModal(modalHapus);
    }

    document.getElementById("btnKonfirmasiHapus")
        ?.addEventListener("click", async () => {
            if (deletingId === null) return;

            const id = deletingId;
            const tombol = document.getElementById("btnKonfirmasiHapus");

            tombol.disabled = true;

            try {
                await requestAPI(`${API_IURAN}/${id}`, "DELETE");

                deletingId = null;
                closeModal(modalHapus);

                showToast("Berhasil", "Iuran berhasil dihapus.");

                await muatIuran();
            } catch (error) {
                showToast("Gagal menghapus", error.message);
            } finally {
                tombol.disabled = false;
            }
        });

    /* =========================================================
       FILTER IURAN
       ========================================================= */

    document.getElementById("cariIuran")
        ?.addEventListener("input", renderIuran);

    document.getElementById("filterKategori")
        ?.addEventListener("change", renderIuran);

    document.getElementById("filterStatusIuran")
        ?.addEventListener("change", renderIuran);

    document.getElementById("btnResetFilter")
        ?.addEventListener("click", () => {
            document.getElementById("cariIuran").value = "";
            document.getElementById("filterKategori").value = "";
            document.getElementById("filterStatusIuran").value = "";

            renderIuran();
        });

    /* =========================================================
       INIT
       ========================================================= */

    muatIuran();
});
