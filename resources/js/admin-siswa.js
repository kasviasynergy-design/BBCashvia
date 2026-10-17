/* BBCASHVIA — HALAMAN DATA SISWA (ADMIN)
   Data siswa dan jurusan berasal dari API Laravel.
   Tidak menggunakan data siswa atau pembayaran dummy. */

(function () {
    "use strict";

    const API_URL = "/admin/api/siswa";
    const API_KELAS_URL = "/admin/api/kelas";

    const $ = (id) => document.getElementById(id);

    let SISWA = [];
    let DAFTAR_KELAS = [];
    let KELAS = [];
    let modeForm = "tambah";
    let idSedangDiubah = null;
    let idSedangDihapus = null;
    let modeFormKelas = "tambah";
    let idKelasSedangDiubah = null;
    let idKelasSedangDihapus = null;
    let sedangMemuat = false;
    let aktifTab = "siswa";

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
                <option value="">— Pilih kelas —</option>
                ${DAFTAR_KELAS.length
                    ? DAFTAR_KELAS.map((jurusan) => `
                        <option value="${escapeHtml(jurusan.id_kelas)}">
                            ${escapeHtml(jurusan.nama_kelas)}
                        </option>
                    `).join("")
                    : '<option value="" disabled>Belum ada kelas tersedia</option>'
                }
            `;

            if (DAFTAR_KELAS.some(
                (jurusan) => String(jurusan.id_kelas) === nilaiLama
            )) {
                input.value = nilaiLama;
            } else {
                input.value = "";
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
       DATA KELAS (DARI DATABASE)
    ====================================================== */

    const muatKelas = async () => {
        try {
            const hasil = await permintaanAPI(API_KELAS_URL);

            KELAS = Array.isArray(hasil.data) ? hasil.data : [];

            renderTabelKelas(KELAS);
        } catch (error) {
            console.error("Gagal memuat data kelas:", error);
            KELAS = [];
            renderTabelKelas([]);
            tampilkanToast(error.message);
        }
    };

    const renderTabelKelas = (baris) => {
        const tbody = $("isiTabelKelas");
        const empty = $("emptyStateKelas");
        const info = $("tabelInfoKelas");

        if (!tbody) return;

        tbody.innerHTML = baris.map((kelas) => {
            const id = escapeHtml(kelas.id_kelas);
            const nama = escapeHtml(kelas.nama_kelas);
            const tingkat = escapeHtml(kelas.tingkat || "-");
            const tahun = escapeHtml(kelas.tahun_ajaran || "-");
            const jumlah = escapeHtml(kelas.jumlah_siswa ?? 0);

            return `
                <tr>
                    <td>
                        <div class="siswa-cell">
                            <div class="siswa-cell__avatar">
                                ${escapeHtml(kelas.nama_kelas.charAt(0))}
                            </div>
                            <div class="siswa-cell__info">
                                <span class="siswa-cell__nama">${nama}</span>
                                <span class="siswa-cell__nis">ID ${id}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="cell-kelas">${tingkat}</span>
                    </td>
                    <td>
                        <span>${tahun}</span>
                    </td>
                    <td>
                        <span class="badge badge--none">${jumlah} siswa</span>
                    </td>
                    <td class="td-aksi">
                        <div class="aksi-grup">
                            <button
                                type="button"
                                class="btn-aksi"
                                data-aksi="ubah-kelas"
                                data-id="${id}"
                                aria-label="Ubah ${nama}"
                                title="Ubah">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button
                                type="button"
                                class="btn-aksi btn-aksi--hapus"
                                data-aksi="hapus-kelas"
                                data-id="${id}"
                                aria-label="Hapus ${nama}"
                                title="Hapus">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        if (empty) {
            empty.hidden = baris.length !== 0;
        }

        if (info) {
            info.textContent = `${baris.length} kelas ditampilkan`;
        }
    };

    const bukaFormTambahKelas = () => {
        modeFormKelas = "tambah";
        idKelasSedangDiubah = null;

        $("formKelas").reset();
        $("formErrorKelas").hidden = true;
        $("formErrorKelas").textContent = "";

        $("modalFormKelasEyebrow").textContent = "KELAS BARU";
        $("modalFormKelasTitle").textContent = "Tambah Kelas";
        $("btnSimpanKelasText").textContent = "Simpan Kelas";

        bukaModal("modalFormKelas");

        setTimeout(() => $("inputNamaKelas")?.focus(), 120);
    };

    const bukaFormUbahKelas = (id) => {
        const kelas = KELAS.find(
            (item) => String(item.id_kelas) === String(id)
        );

        if (!kelas) return;

        modeFormKelas = "ubah";
        idKelasSedangDiubah = kelas.id_kelas;

        $("formKelas").reset();
        $("formErrorKelas").hidden = true;
        $("formErrorKelas").textContent = "";

        $("modalFormKelasEyebrow").textContent = "UBAH DATA KELAS";
        $("modalFormKelasTitle").textContent = `Ubah ${kelas.nama_kelas}`;
        $("btnSimpanKelasText").textContent = "Simpan Perubahan";

        $("inputNamaKelas").value = kelas.nama_kelas;
        $("inputTingkat").value = kelas.tingkat || "";
        $("inputTahunAjaran").value = kelas.tahun_ajaran || "";

        bukaModal("modalFormKelas");

        setTimeout(() => $("inputNamaKelas")?.focus(), 120);
    };

    const simpanKelas = async (event) => {
        event.preventDefault();
        $("formErrorKelas").hidden = true;
        $("formErrorKelas").textContent = "";

        const namaKelas = $("inputNamaKelas").value.trim();
        const tingkat = $("inputTingkat").value.trim() || null;
        const tahunAjaran = $("inputTahunAjaran").value.trim() || null;

        const galat = [];

        if (!namaKelas) {
            galat.push("Nama kelas wajib diisi.");
        }
        if (namaKelas.length > 50) {
            galat.push("Nama kelas maksimal 50 karakter.");
        }

        if (galat.length) {
            $("formErrorKelas").textContent = galat.join(" ");
            $("formErrorKelas").hidden = false;
            return;
        }

        const tombolSimpan = $("formKelas").querySelector(
            '[type="submit"]'
        );

        if (tombolSimpan) tombolSimpan.disabled = true;

        try {
            const payload = {
                nama_kelas: namaKelas,
                tingkat,
                tahun_ajaran: tahunAjaran,
            };

            const hasil = modeFormKelas === "ubah"
                ? await permintaanAPI(
                    `${API_KELAS_URL}/${encodeURIComponent(idKelasSedangDiubah)}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload)
                    }
                )
                : await permintaanAPI(API_KELAS_URL, {
                    method: "POST",
                    body: JSON.stringify(payload)
                });

            tutupModal("modalFormKelas");

            tampilkanToast(
                hasil.message || (
                    modeFormKelas === "ubah"
                        ? "Data kelas berhasil diperbarui."
                        : "Data kelas berhasil ditambahkan."
                )
            );

            muatKelas();
        } catch (error) {
            $("formErrorKelas").textContent = error.message;
            $("formErrorKelas").hidden = false;
        } finally {
            if (tombolSimpan) tombolSimpan.disabled = false;
        }
    };

    const bukaHapusKelas = (id) => {
        const kelas = KELAS.find(
            (item) => String(item.id_kelas) === String(id)
        );

        if (!kelas) return;

        idKelasSedangDihapus = kelas.id_kelas;

        $("hapusKelasText").textContent =
            `Kelas ${kelas.nama_kelas} ` +
            "akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.";

        bukaModal("modalHapusKelas");
    };

    const jalankanHapusKelas = async () => {
        if (idKelasSedangDihapus === null) return;

        const tombol = $("btnKonfirmasiHapusKelas");

        if (tombol) tombol.disabled = true;

        try {
            const hasil = await permintaanAPI(
                `${API_KELAS_URL}/${encodeURIComponent(idKelasSedangDihapus)}`,
                { method: "DELETE" }
            );

            tutupModal("modalHapusKelas");
            idKelasSedangDihapus = null;

            tampilkanToast(hasil.message || "Data kelas berhasil dihapus.");

            muatKelas();
        } catch (error) {
            tampilkanToast(error.message);
        } finally {
            if (tombol) tombol.disabled = false;
        }
    };

    const toggleTab = (tab) => {
        if (tab === aktifTab) return;

        aktifTab = tab;

        const panelSiswa = $("panelSiswa");
        const panelKelas = $("panelKelas");
        const btnSiswa = $("tabSiswa");
        const btnKelas = $("tabKelas");
        const btnTambahSiswa = $("btnTambahSiswa");
        const btnTambahKelas = $("btnTambahKelas");

        if (tab === "kelas") {
            if (panelSiswa) panelSiswa.hidden = true;
            if (panelKelas) panelKelas.hidden = false;
            if (btnSiswa) {
                btnSiswa.classList.remove("is-active");
                btnSiswa.classList.add("btn--ghost");
                btnSiswa.classList.remove("btn--primary");
                btnSiswa.setAttribute("aria-selected", "false");
            }
            if (btnKelas) {
                btnKelas.classList.remove("btn--ghost");
                btnKelas.classList.add("btn--primary", "is-active");
                btnKelas.setAttribute("aria-selected", "true");
            }
            if (btnTambahSiswa) btnTambahSiswa.classList.add("hidden");
            if (btnTambahKelas) btnTambahKelas.classList.remove("hidden");

            muatKelas();
        } else {
            if (panelSiswa) panelSiswa.hidden = false;
            if (panelKelas) panelKelas.hidden = true;
            if (btnSiswa) {
                btnSiswa.classList.remove("btn--ghost");
                btnSiswa.classList.add("btn--primary", "is-active");
                btnSiswa.setAttribute("aria-selected", "true");
            }
            if (btnKelas) {
                btnKelas.classList.remove("btn--primary", "is-active");
                btnKelas.classList.add("btn--ghost");
                btnKelas.setAttribute("aria-selected", "false");
            }
            if (btnTambahSiswa) btnTambahSiswa.classList.remove("hidden");
            if (btnTambahKelas) btnTambahKelas.classList.add("hidden");

            muatData();
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

        // Jika daftar kelas masih kosong, muat dulu dari API agar dropdown tidak kosong
        if (DAFTAR_KELAS.length === 0) {
            muatData().then(() => {
                isiPilihanJurusan();
                sembunyikanErrorForm();
                $("modalFormEyebrow").textContent = "SISWA BARU";
                $("modalFormTitle").textContent = "Tambah Siswa";
                $("btnSimpanText").textContent = "Simpan Siswa";
                bukaModal("modalForm");
                setTimeout(() => $("inputNis")?.focus(), 120);
            });
            return;
        }

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

        // Set ulang radio jenis kelamin sesuai data
        const jenisKelaminRadios = document.querySelectorAll('input[name="jenisKelamin"]');
        const nilaiJK = siswa.jenis_kelamin === "Laki-Laki" ? "L" :
                        siswa.jenis_kelamin === "Perempuan" ? "P" : "L";
        jenisKelaminRadios.forEach(radio => {
            radio.checked = (radio.value === nilaiJK);
        });

        bukaModal("modalForm");

        setTimeout(() => $("inputNama")?.focus(), 120);
    };

    const simpanSiswa = async (event) => {
        event.preventDefault();
        sembunyikanErrorForm();

        const nis = $("inputNis").value.trim();
        const nama = $("inputNama").value.trim();
        const idKelas = $("inputKelas").value;

        // Ambil jenis kelamin yang dipilih (L atau P)
        const jenisKelaminChecked = document.querySelector('input[name="jenisKelamin"]:checked');
        const jenisKelamin = jenisKelaminChecked ? jenisKelaminChecked.value : null;

        const galat = [];

        if (!nis) {
            galat.push("NIS wajib diisi.");
        }
        if (nis.length > 20) {
            galat.push("NIS maksimal 20 karakter.");
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
                id_kelas: Number(idKelas),
                jenis_kelamin: jenisKelamin
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

            muatData();
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

        const jenisKelamin = siswa.jenis_kelamin || "Belum tersedia";
        $("detailJkTeks").textContent = jenisKelamin;
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

            muatData();
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
                .slice(0, 20);
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

        $("tabSiswa")?.addEventListener("click", () => toggleTab("siswa"));
        $("tabKelas")?.addEventListener("click", () => toggleTab("kelas"));

        $("btnTambahKelas")?.addEventListener("click", bukaFormTambahKelas);

        $("formKelas")?.addEventListener("submit", simpanKelas);

        $("isiTabelKelas")?.addEventListener("click", (event) => {
            const tombol = event.target.closest("button[data-aksi]");
            if (!tombol) return;

            const { aksi, id } = tombol.dataset;

            if (aksi === "ubah-kelas") bukaFormUbahKelas(id);
            if (aksi === "hapus-kelas") bukaHapusKelas(id);
        });

        $("btnKonfirmasiHapusKelas")?.addEventListener(
            "click",
            jalankanHapusKelas
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
