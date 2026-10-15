/* BBCASHVIA — HALAMAN DATA SISWA (ADMIN)
   Data siswa dan jurusan berasal dari API Laravel.
   Tidak menggunakan data siswa atau pembayaran dummy. */

(function () {
    "use strict";

    const API_URL = "/admin/api/siswa";

    const $ = (id) => document.getElementById(id);

    let SISWA = [];
    let DAFTAR_KELAS = [];
    let modeForm = "tambah";
    let idSedangDiubah = null;
    let idSedangDihapus = null;
    let sedangMemuat = false;

    const escapeHtml = (value) =>
        String(value ?? "").replace(/[&<>"']/g, (karakter) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[karakter]);

    const inisial = (nama) =>
        String(nama || "?")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((kata) => kata.charAt(0))
            .join("")
            .toUpperCase();

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(Number(angka) || 0);

    const tampilkanToast = (pesan) => {
        const toast = $("toast");
        const toastText = $("toastText");

        if (!toast || !toastText) {
            alert(pesan);
            return;
        }

        toastText.textContent = pesan;
        toast.classList.add("is-muncul");

        clearTimeout(toast._timer);

        toast._timer = setTimeout(() => {
            toast.classList.remove("is-muncul");
        }, 2800);
    };

    const tampilkanErrorForm = (pesan) => {
        const kotak = $("formError");

        if (kotak) {
            kotak.textContent = pesan;
            kotak.hidden = false;
        } else {
            tampilkanToast(pesan);
        }
    };

    const sembunyikanErrorForm = () => {
        const kotak = $("formError");

        if (kotak) {
            kotak.textContent = "";
            kotak.hidden = true;
        }
    };

    const pesanErrorAPI = (data, status) => {
        if (data?.errors) {
            const pesanValidasi = Object.values(data.errors)
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

        return "Terjadi kesalahan saat menghubungi server.";
    };

    const permintaanAPI = async (url, opsi = {}) => {
        const csrf = document.querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        const headers = {
            Accept: "application/json",
            ...(opsi.body ? { "Content-Type": "application/json" } : {}),
            ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
            ...(opsi.headers || {})
        };

        let respons;

        try {
            respons = await fetch(url, {
                ...opsi,
                headers,
                credentials: "same-origin"
            });
        } catch {
            throw new Error(
                "Tidak dapat terhubung ke server. Periksa koneksi Laravel."
            );
        }

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
    };

    /* =====================================================
       DATA DARI DATABASE
    ====================================================== */

    const muatData = async () => {
        if (sedangMemuat) return;

        sedangMemuat = true;

        try {
            const hasil = await permintaanAPI(API_URL);

            SISWA = Array.isArray(hasil.data) ? hasil.data : [];
            DAFTAR_KELAS = Array.isArray(hasil.kelas) ? hasil.kelas : [];

            SISWA.sort((a, b) =>
                String(a.nis).localeCompare(String(b.nis))
            );

            isiPilihanJurusan();
            aturFilterYangBelumTersedia();
            terapkanFilter();
        } catch (error) {
            console.error("Gagal memuat data siswa:", error);

            SISWA = [];
            DAFTAR_KELAS = [];

            isiPilihanJurusan();
            terapkanFilter();

            tampilkanToast(error.message);
        } finally {
            sedangMemuat = false;
        }
    };

    const isiPilihanJurusan = () => {
        const filter = $("filterKelas");
        const input = $("inputKelas");

        if (filter) {
            const nilaiLama = filter.value || "semua";

            filter.innerHTML = `
                <option value="semua">Semua Jurusan</option>
                ${DAFTAR_KELAS.map((jurusan) => `
                    <option value="${escapeHtml(jurusan.id_kelas)}">
                        ${escapeHtml(jurusan.nama_kelas)}
                    </option>
                `).join("")}
            `;

            filter.value = DAFTAR_KELAS.some(
                (jurusan) => String(jurusan.id_kelas) === nilaiLama
            ) ? nilaiLama : "semua";
        }

        if (input) {
            const nilaiLama = input.value;

            input.innerHTML = `
                <option value="">— Pilih jurusan —</option>
                ${DAFTAR_KELAS.map((jurusan) => `
                    <option value="${escapeHtml(jurusan.id_kelas)}">
                        ${escapeHtml(jurusan.nama_kelas)}
                    </option>
                `).join("")}
            `;

            if (DAFTAR_KELAS.some(
                (jurusan) => String(jurusan.id_kelas) === nilaiLama
            )) {
                input.value = nilaiLama;
            }
        }
    };

    const aturFilterYangBelumTersedia = () => {
        const filterJk = $("filterJk");
        const filterIuran = $("filterIuran");

        if (filterJk) {
            Array.from(filterJk.options).forEach((opsi) => {
                opsi.disabled = opsi.value !== "semua";
            });
            filterJk.value = "semua";
        }

        if (filterIuran) {
            Array.from(filterIuran.options).forEach((opsi) => {
                opsi.disabled = opsi.value !== "semua";
            });
            filterIuran.value = "semua";
        }
    };

    /* =====================================================
       TABEL
    ====================================================== */

    const barisTabel = (siswa) => {
        const id = escapeHtml(siswa.id_siswa);
        const nis = escapeHtml(siswa.nis);
        const nama = escapeHtml(siswa.nama);
        const jurusan = escapeHtml(siswa.kelas || "Belum ditentukan");
        const status = escapeHtml(siswa.status || "Aktif");

        return `
            <tr>
                <td>
                    <div class="siswa-cell">
                        <div class="siswa-cell__avatar">
                            ${escapeHtml(inisial(siswa.nama))}
                        </div>
                        <div class="siswa-cell__info">
                            <span class="siswa-cell__nama">
                                ${nama}
                            </span>
                            <span class="siswa-cell__nis">
                                NIS ${nis}
                            </span>
                        </div>
                    </div>
                </td>

                <td>
                    <span class="cell-kelas">${jurusan}</span>
                </td>

                <td>
                    <span>—</span>
                </td>

                <td>
                    <span>—</span>
                </td>

                <td>
                    <span class="badge badge--none">
                        Data iuran belum tersedia
                    </span>
                </td>

                <td class="td-aksi">
                    <div class="aksi-grup">
                        <button
                            type="button"
                            class="btn-aksi"
                            data-aksi="detail"
                            data-id="${id}"
                            aria-label="Detail ${nama}"
                            title="Detail">
                            <span class="material-symbols-outlined">
                                visibility
                            </span>
                        </button>

                        <button
                            type="button"
                            class="btn-aksi"
                            data-aksi="ubah"
                            data-id="${id}"
                            aria-label="Ubah ${nama}"
                            title="Ubah">
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </button>

                        <button
                            type="button"
                            class="btn-aksi btn-aksi--hapus"
                            data-aksi="hapus"
                            data-id="${id}"
                            aria-label="Hapus ${nama}"
                            title="Hapus">
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    };

    const renderTabel = (baris) => {
        const tbody = $("isiTabelSiswa");
        const empty = $("emptyState");
        const info = $("tabelInfo");

        if (!tbody) return;

        tbody.innerHTML = baris.map(barisTabel).join("");

        if (empty) {
            empty.hidden = baris.length !== 0;
        }

        if (info) {
            info.textContent = `${baris.length} siswa ditampilkan`;
        }
    };

    const renderRingkasan = (baris) => {
        if ($("sumTotal")) {
            $("sumTotal").textContent = baris.length;
        }

        /*
         * Jenis kelamin belum tersimpan dalam tabel siswa.
         * Jangan menghitung atau menampilkan angka buatan.
         */
        if ($("sumLk")) $("sumLk").textContent = "—";
        if ($("sumPr")) $("sumPr").textContent = "—";
        if ($("sumBelum")) $("sumBelum").textContent = "—";

        if ($("sumTotalNote")) {
            $("sumTotalNote").textContent = baris.length
                ? "siswa terdaftar"
                : "belum ada siswa";
        }

        if ($("sumLkNote")) {
            $("sumLkNote").textContent = "data belum tersedia";
        }

        if ($("sumPrNote")) {
            $("sumPrNote").textContent = "data belum tersedia";
        }

        if ($("sumBelumNote")) {
            $("sumBelumNote").textContent = "data iuran belum tersedia";
        }
    };

    /* =====================================================
       FILTER
    ====================================================== */

    const terapkanFilter = () => {
        const kata = $("cariSiswa")?.value.trim().toLowerCase() || "";
        const kelas = $("filterKelas")?.value || "semua";

        const hasil = SISWA.filter((siswa) => {
            if (
                kelas !== "semua" &&
                String(siswa.id_kelas) !== String(kelas)
            ) {
                return false;
            }

            if (kata) {
                const gabung = [
                    siswa.nama,
                    siswa.nis,
                    siswa.kelas
                ].join(" ").toLowerCase();

                if (!gabung.includes(kata)) return false;
            }

            return true;
        });

        renderTabel(hasil);
        renderRingkasan(hasil);
    };

    const resetFilter = () => {
        if ($("cariSiswa")) $("cariSiswa").value = "";
        if ($("filterKelas")) $("filterKelas").value = "semua";
        if ($("filterJk")) $("filterJk").value = "semua";
        if ($("filterIuran")) $("filterIuran").value = "semua";

        terapkanFilter();
    };

    /* =====================================================
       MODAL
    ====================================================== */

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
        document.querySelectorAll(".modal-backdrop.is-open")
            .forEach((modal) => tutupModal(modal.id));
    };

    /* =====================================================
       TAMBAH / UBAH SISWA
    ====================================================== */

    const bukaFormTambah = () => {
        modeForm = "tambah";
        idSedangDiubah = null;

        $("formSiswa").reset();
        isiPilihanJurusan();
        sembunyikanErrorForm();

        $("modalFormEyebrow").textContent = "SISWA BARU";
        $("modalFormTitle").textContent = "Tambah Siswa";
        $("btnSimpanText").textContent = "Simpan Siswa";

        bukaModal("modalForm");

        setTimeout(() => $("inputNis")?.focus(), 120);
    };

    const bukaFormUbah = (id) => {
        const siswa = SISWA.find(
            (item) => String(item.id_siswa) === String(id)
        );

        if (!siswa) return;

        modeForm = "ubah";
        idSedangDiubah = siswa.id_siswa;

        $("formSiswa").reset();
        isiPilihanJurusan();
        sembunyikanErrorForm();

        $("modalFormEyebrow").textContent = "UBAH DATA SISWA";
        $("modalFormTitle").textContent = `Ubah ${siswa.nama}`;
        $("btnSimpanText").textContent = "Simpan Perubahan";

        $("inputNis").value = siswa.nis;
        $("inputNama").value = siswa.nama;
        $("inputKelas").value = siswa.id_kelas ?? "";

        bukaModal("modalForm");

        setTimeout(() => $("inputNama")?.focus(), 120);
    };

    const simpanSiswa = async (event) => {
        event.preventDefault();
        sembunyikanErrorForm();

        const nis = $("inputNis").value.trim();
        const nama = $("inputNama").value.trim();
        const idKelas = $("inputKelas").value;

        const galat = [];

        if (!/^\d{4}$/.test(nis)) {
            galat.push("NIS harus terdiri dari 4 angka.");
        }

        if (nama.length < 3) {
            galat.push("Nama siswa minimal 3 karakter.");
        }

        if (!idKelas) {
            galat.push("Jurusan wajib dipilih.");
        }

        if (galat.length) {
            tampilkanErrorForm(galat.join(" "));
            return;
        }

        const tombolSimpan = $("formSiswa").querySelector(
            '[type="submit"]'
        );

        if (tombolSimpan) tombolSimpan.disabled = true;

        try {
            const payload = {
                nis,
                nama,
                id_kelas: Number(idKelas)
            };

            const hasil = modeForm === "ubah"
                ? await permintaanAPI(
                    `${API_URL}/${encodeURIComponent(idSedangDiubah)}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload)
                    }
                )
                : await permintaanAPI(API_URL, {
                    method: "POST",
                    body: JSON.stringify(payload)
                });

            tutupModal("modalForm");

            tampilkanToast(
                hasil.message || (
                    modeForm === "ubah"
                        ? "Data siswa berhasil diperbarui."
                        : "Data siswa berhasil ditambahkan."
                )
            );

            await muatData();
        } catch (error) {
            tampilkanErrorForm(error.message);
        } finally {
            if (tombolSimpan) tombolSimpan.disabled = false;
        }
    };

    /* =====================================================
       DETAIL SISWA
    ====================================================== */

    const bukaDetail = (id) => {
        const siswa = SISWA.find(
            (item) => String(item.id_siswa) === String(id)
        );

        if (!siswa) return;

        $("detailNama").textContent = siswa.nama;
        $("detailNamaKecil").textContent = siswa.nama;

        $("detailAvatar").textContent = inisial(siswa.nama);
        $("detailKelas").textContent = siswa.kelas || "Belum ditentukan";
        $("detailNis").textContent = siswa.nis;

        if ($("detailJk")) {
            $("detailJk").textContent = "—";
            $("detailJk").classList.remove(
                "chip--lk",
                "chip--pr"
            );
        }

        $("detailJkTeks").textContent = "Belum tersedia di database";
        $("detailHp").textContent = "Belum tersedia di database";

        const badgeStatus = $("detailStatus");

        if (badgeStatus) {
            badgeStatus.textContent = "Data iuran belum tersedia";
            badgeStatus.className = "badge badge--none";
        }

        const riwayat = $("riwayatIuran");

        if (riwayat) {
            riwayat.innerHTML = `
                <div class="riwayat-baris">
                    <span class="riwayat-baris__bulan">
                        Riwayat pembayaran
                    </span>
                    <span class="riwayat-baris__nominal">
                        Belum tersedia
                    </span>
                </div>
            `;
        }

        bukaModal("modalDetail");
    };

    /* =====================================================
       HAPUS SISWA
    ====================================================== */

    const bukaHapus = (id) => {
        const siswa = SISWA.find(
            (item) => String(item.id_siswa) === String(id)
        );

        if (!siswa) return;

        idSedangDihapus = siswa.id_siswa;

        $("hapusText").textContent =
            `Data siswa ${siswa.nama} (NIS ${siswa.nis}, ` +
            `${siswa.kelas || "jurusan belum ditentukan"}) ` +
            "akan dihapus. Tindakan ini tidak dapat dibatalkan.";

        bukaModal("modalHapus");
    };

    const jalankanHapus = async () => {
        if (idSedangDihapus === null) return;

        const tombol = $("btnKonfirmasiHapus");

        if (tombol) tombol.disabled = true;

        try {
            const hasil = await permintaanAPI(
                `${API_URL}/${encodeURIComponent(idSedangDihapus)}`,
                { method: "DELETE" }
            );

            tutupModal("modalHapus");
            idSedangDihapus = null;

            tampilkanToast(hasil.message || "Data siswa berhasil dihapus.");

            await muatData();
        } catch (error) {
            tampilkanToast(error.message);
        } finally {
            if (tombol) tombol.disabled = false;
        }
    };

    /* =====================================================
       INTERAKSI SIDEBAR, PROFIL, DAN TANGGAL
    ====================================================== */

    const pasangInteraksiUmum = () => {
        const tombolSidebar = $("sidebarToggle");
        const backdrop = $("sidebarBackdrop");

        const tutupSidebar = () =>
            document.body.classList.remove("nav-open");

        if (tombolSidebar) {
            tombolSidebar.addEventListener("click", () => {
                document.body.classList.toggle("nav-open");
            });
        }

        if (backdrop) {
            backdrop.addEventListener("click", tutupSidebar);
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024) tutupSidebar();
        });

        const tombolProfil = $("profileBtn");
        const menuProfil = $("profileMenu");

        const tutupProfil = () => {
            menuProfil?.classList.remove("is-open");
            tombolProfil?.setAttribute("aria-expanded", "false");
        };

        if (tombolProfil && menuProfil) {
            tombolProfil.addEventListener("click", (event) => {
                event.stopPropagation();

                const terbuka = menuProfil.classList.toggle("is-open");

                tombolProfil.setAttribute(
                    "aria-expanded",
                    terbuka ? "true" : "false"
                );
            });

            document.addEventListener("click", (event) => {
                if (
                    !menuProfil.contains(event.target) &&
                    !tombolProfil.contains(event.target)
                ) {
                    tutupProfil();
                }
            });
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                tutupSidebar();
                tutupProfil();
                tutupSemuaModal();
            }
        });

        const tanggal = $("topbarDate");

        if (tanggal) {
            tanggal.textContent = new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }
    };

    /* =====================================================
       EVENT
    ====================================================== */

    const pasangEvent = () => {
        $("cariSiswa")?.addEventListener("input", terapkanFilter);
        $("filterKelas")?.addEventListener("change", terapkanFilter);

        $("filterJk")?.addEventListener("change", () => {
            $("filterJk").value = "semua";
            tampilkanToast(
                "Filter jenis kelamin belum tersedia karena datanya belum tersimpan."
            );
        });

        $("filterIuran")?.addEventListener("change", () => {
            $("filterIuran").value = "semua";
            tampilkanToast(
                "Filter iuran belum tersedia karena data pembayaran belum terhubung."
            );
        });

        $("btnResetFilter")?.addEventListener("click", resetFilter);
        $("btnKosongkanFilter")?.addEventListener("click", resetFilter);

        $("btnTambahSiswa")?.addEventListener("click", bukaFormTambah);

        $("inputNis")?.addEventListener("input", (event) => {
            event.target.value = event.target.value
                .replace(/\D/g, "")
                .slice(0, 4);
        });

        $("formSiswa")?.addEventListener("submit", simpanSiswa);

        $("isiTabelSiswa")?.addEventListener("click", (event) => {
            const tombol = event.target.closest("button[data-aksi]");
            if (!tombol) return;

            const { aksi, id } = tombol.dataset;

            if (aksi === "detail") bukaDetail(id);
            if (aksi === "ubah") bukaFormUbah(id);
            if (aksi === "hapus") bukaHapus(id);
        });

        $("btnKonfirmasiHapus")?.addEventListener(
            "click",
            jalankanHapus
        );

        document.querySelectorAll("[data-tutup-modal]")
            .forEach((tombol) => {
                tombol.addEventListener("click", () => {
                    tutupModal(tombol.dataset.tutupModal);
                });
            });

        document.querySelectorAll(".modal-backdrop")
            .forEach((backdrop) => {
                backdrop.addEventListener("mousedown", (event) => {
                    if (event.target === backdrop) {
                        tutupModal(backdrop.id);
                    }
                });
            });
    };

    /* =====================================================
       JALANKAN
    ====================================================== */

    pasangInteraksiUmum();
    pasangEvent();
    muatData();

})();
