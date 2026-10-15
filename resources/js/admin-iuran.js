
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

    const FREKUENSI = {
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
    const modalPembayaran = document.getElementById("modalPembayaran");
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
        if (!value) return "—";

        const tanggal = String(value).slice(0, 10);
        const date = new Date(`${tanggal}T00:00:00`);

        if (Number.isNaN(date.getTime())) return "—";

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

    function normalisasiIuran(item) {
        return {
            id: Number(item.id_iuran),
            nama_iuran: item.nama_iuran ?? "",
            keterangan: item.keterangan ?? "",
            jatuh_tempo: item.jatuh_tempo
                ? String(item.jatuh_tempo).slice(0, 10)
                : "",
            frekuensi: item.kategori ?? "",
            nominal: Number(item.nominal) || 0,
            status: item.status ?? "aktif"
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

        const options = {
            method,
            headers,
            credentials: "same-origin"
        };

        if (payload !== null) {
            headers["Content-Type"] = "application/json";

            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            if (csrfToken) {
                headers["X-CSRF-TOKEN"] = csrfToken;
            }

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

        // Pembayaran belum dihitung karena endpoint transaksi
        // belum dihubungkan ke halaman ini.
        document.getElementById("sumTerkumpul").textContent = "—";

        document.getElementById("sumTerkumpulNote").textContent =
            "Menunggu integrasi transaksi";

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

        const frekuensi = document.getElementById("filterFrekuensi").value;
        const status = document.getElementById("filterStatusIuran").value;

        const filtered = iuranData.filter(item => {
            const matchSearch =
                item.nama_iuran.toLowerCase().includes(search) ||
                item.keterangan.toLowerCase().includes(search);

            const matchFrekuensi =
                !frekuensi || item.frekuensi === frekuensi;

            const matchStatus =
                !status || item.status === status;

            return matchSearch && matchFrekuensi && matchStatus;
        });

        tbody.innerHTML = "";

        emptyState.hidden = filtered.length !== 0;

        filtered.forEach(item => {
            const tr = document.createElement("tr");

            const namaFrekuensi =
                FREKUENSI[item.frekuensi] || item.frekuensi || "—";

            tr.innerHTML = `
                <td>
                    <div class="table-primary">
                        ${escapeHTML(item.nama_iuran)}
                    </div>
                    <div class="table-secondary">
                        ${escapeHTML(item.keterangan || "—")}
                    </div>
                </td>

                <td>
                    <span class="frequency-badge">
                        ${escapeHTML(namaFrekuensi)}
                    </span>
                </td>

                <td>${escapeHTML(formatTanggal(item.jatuh_tempo))}</td>

                <td>
                    <strong class="money">
                        ${formatRupiah(item.nominal)}
                    </strong>
                </td>

                <td>
                    <strong class="money">—</strong>
                </td>

                <td>
                    <div class="progress-cell">
                        <div class="progress-track">
                            <span style="width:0%"></span>
                        </div>
                        <small>—</small>
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

        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:24px">
                    Memuat data iuran...
                </td>
            </tr>
        `;

        try {
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
                    <td colspan="8" style="text-align:center;padding:24px">
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

        document.getElementById("inputFrekuensi").value =
            item.frekuensi;

        document.getElementById("inputJatuhTempo").value =
            item.jatuh_tempo;

        document.getElementById("inputNominalIuran").value =
            item.nominal;

        document.getElementById("inputStatusIuran").value =
            item.status;

        document.getElementById("inputKeteranganIuran").value =
            item.keterangan;

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

        const kategori = document.getElementById("inputFrekuensi").value;
        const jatuhTempo = document.getElementById("inputJatuhTempo").value;
        const nominal = Number(
            document.getElementById("inputNominalIuran").value
        );
        const status = document.getElementById("inputStatusIuran").value;
        const keterangan = document.getElementById("inputKeteranganIuran")
            .value.trim();

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
            keterangan: keterangan || null
        };

        const tombolSubmit = formIuran.querySelector(
            'button[type="submit"]'
        );

        if (tombolSubmit) tombolSubmit.disabled = true;

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
            if (tombolSubmit) tombolSubmit.disabled = false;
        }
    });

    /* =========================================================
       DETAIL IURAN
       Pembayaran siswa belum dihubungkan ke API transaksi.
       ========================================================= */

    function openDetail(id) {
        const item = cariIuran(id);
        if (!item) return;

        selectedIuranId = item.id;

        document.getElementById("detailIuranTitle").textContent =
            item.nama_iuran;

        document.getElementById("detailIuranSub").textContent =
            item.keterangan || "Tidak ada keterangan.";

        document.getElementById("detailFrekuensi").textContent =
            FREKUENSI[item.frekuensi] || item.frekuensi || "—";

        document.getElementById("detailJatuhTempo").textContent =
            formatTanggal(item.jatuh_tempo);

        document.getElementById("detailNominal").textContent =
            formatRupiah(item.nominal);

        document.getElementById("detailTerkumpul").textContent =
            "Belum tersedia";

        document.getElementById("cariDetailSiswa").value = "";
        document.getElementById("filterDetailStatus").value = "";

        renderDetailSiswa();
        openModal(modalDetail);
    }

    function renderDetailSiswa() {
        const tbody = document.getElementById("isiTabelDetail");
        const emptyDetail = document.getElementById("emptyDetail");

        // Tidak menggunakan data siswa atau pembayaran palsu.
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:24px">
                    Data siswa dan status pembayaran belum dihubungkan
                    ke database transaksi.
                </td>
            </tr>
        `;

        emptyDetail.hidden = true;
    }

    document.getElementById("cariDetailSiswa")
        ?.addEventListener("input", renderDetailSiswa);

    document.getElementById("filterDetailStatus")
        ?.addEventListener("change", renderDetailSiswa);

    /* =========================================================
       FORM PEMBAYARAN
       Jangan menyimpan pembayaran ke JavaScript saja.
       ========================================================= */

    document.getElementById("formPembayaran")
        ?.addEventListener("submit", event => {
            event.preventDefault();

            const error = document.getElementById(
                "formErrorPembayaran"
            );

            error.textContent =
                "Pencatatan pembayaran belum dihubungkan ke API transaksi. Pembayaran belum disimpan.";

            error.hidden = false;
        });

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

    document.getElementById("filterFrekuensi")
        ?.addEventListener("change", renderIuran);

    document.getElementById("filterStatusIuran")
        ?.addEventListener("change", renderIuran);

    document.getElementById("btnResetFilter")
        ?.addEventListener("click", () => {
            document.getElementById("cariIuran").value = "";
            document.getElementById("filterFrekuensi").value = "";
            document.getElementById("filterStatusIuran").value = "";

            renderIuran();
        });

    /* =========================================================
       INIT
       ========================================================= */

    muatIuran();
});
