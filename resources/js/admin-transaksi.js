/* ============================================================
   BBCASHVIA — HALAMAN TRANSAKSI (ADMIN)
   Data transaksi berasal dari API Laravel (database sungguhan).
   Tidak menggunakan data dummy.
   ============================================================ */

(function () {
    "use strict";

    const API_URL = "/admin/api/transaksi";

    const $ = (id) => document.getElementById(id);

    /* ============================================================
       OPSI KATEGORI (konfigurasi UI, bukan data dummy tampilan)
       ============================================================ */
    const KATEGORI_MASUK = [
        "Iuran",
        "Kas",
        "Pemasukan lainnya"
    ];

    const KATEGORI_KELUAR = [
        "Kebutuhan kelas",
        "Perlengkapan kelas",
        "Kegiatan kelas",
        "Pengeluaran lainnya"
    ];

    /* ============================================================
       STATE
       ============================================================ */
    let TRANSAKSI = [];
    let modeForm = "tambah";
    let idSedangDiubah = null;
    let idSedangDihapus = null;

    /* ============================================================
       UTILITAS
       ============================================================ */

    const escapeHtml = (teks) => {
        return String(teks ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    };

    const formatRupiah = (angka) => {
        const n = Number(angka) || 0;
        return "Rp " + n.toLocaleString("id-ID");
    };

    const parseAngka = (teks) => {
        const digit = String(teks ?? "").replace(/[^\d]/g, "");
        return digit ? parseInt(digit, 10) : 0;
    };

    const formatTanggal = (iso) => {
        if (!iso) return "—";
        const d = new Date(iso + "T00:00:00");
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const hitungKembalian = (tagihan, diterima) => {
        return Math.max(0, (Number(diterima) || 0) - (Number(tagihan) || 0));
    };

    const hitungNilaiKas = (tagihan, diterima) => {
        return Math.min(Number(tagihan) || 0, Number(diterima) || 0);
    };

    /* ============================================================
       AMBIL DATA DARI API
       ============================================================ */

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
            throw new Error("Tidak dapat terhubung ke server. Periksa koneksi Laravel.");
        }

        let hasil = {};
        try {
            hasil = await respons.json();
        } catch {
            // Respons bukan JSON.
        }

        if (!respons.ok) {
            if (hasil?.message) throw new Error(hasil.message);
            if (hasil?.errors) {
                const pesan = Object.values(hasil.errors).flat().filter(Boolean);
                if (pesan.length) throw new Error(pesan.join(" "));
            }
            throw new Error("Terjadi kesalahan saat menghubungi server.");
        }

        return hasil;
    };

    const muatData = async () => {
        try {
            const hasil = await permintaanAPI(API_URL);

            const data = Array.isArray(hasil.data) ? hasil.data : [];

            TRANSAKSI = data.map((t) => {
                const jenisDb = String(t.jenis ?? "").toUpperCase();
                const jenis = jenisDb === "M" ? "masuk" : jenisDb === "K" ? "keluar" : String(t.jenis ?? "masuk").toLowerCase();

                return {
                    id: t.id_transaksi ?? t.id ?? "",
                    no_bukti: t.no_bukti ?? "",
                    jenis: jenis,
                    kategori: t.kategori ?? "",
                    keterangan: t.keterangan ?? "",
                    kelas: t.nama_siswa ?? t.pic ?? t.id_siswa ?? "",
                    tanggal: t.tanggal ?? "",
                    waktu: "",
                    tagihan: (floatval(t.nominal ?? 0)),
                    diterima: (floatval(t.uang_diterima ?? 0)),
                    petugas: t.pic ?? "",
                    metode: t.metode ?? "",
                    detail: t.Detail ?? "",
                    bukti_file: t.bukti_file ?? ""
                };
            });

            terapkanFilter();
        } catch (error) {
            console.error("Gagal memuat data transaksi:", error);
            TRANSAKSI = [];
            renderTabel([]);
            renderRingkasan([]);
            tampilkanToast(error.message || "Gagal memuat data transaksi.");
        }
    };

    const floatval = (val) => {
        return parseFloat(val) || 0;
    };

    /* ============================================================
       CHIP KATEGORI
       ============================================================ */
    const CHIP_KATEGORI = {
        "Iuran": "chip--iuran",
        "Kas": "chip--kas",
        "Pemasukan lainnya": "chip--masuk-lain",
        "Kebutuhan kelas": "chip--butuh",
        "Perlengkapan kelas": "chip--perlengkapan",
        "Kegiatan kelas": "chip--kegiatan",
        "Pengeluaran lainnya": "chip--keluar-lain"
    };

    /* ============================================================
       RENDER TABEL
       ============================================================ */
    const barisTabel = (t) => {
        const nominal = hitungNilaiKas(t.tagihan, t.diterima);
        const tanda = t.jenis === "masuk" ? "+" : "−";
        const chip = CHIP_KATEGORI[t.kategori] || "chip--keluar-lain";

        return `
            <tr>
                <td>
                    <span class="cell-id">${escapeHtml(t.id)}</span>
                </td>
                <td class="cell-keterangan">
                    <div class="cell-keterangan__utama">${escapeHtml(t.keterangan)}</div>
                    ${t.kelas ? `<span class="cell-keterangan__sub">${escapeHtml(t.kelas)}</span>` : ""}
                </td>
                <td>
                    <span class="chip ${chip}">${escapeHtml(t.kategori)}</span>
                </td>
                <td class="cell-tanggal">
                    <div class="cell-tanggal__utama">${formatTanggal(t.tanggal)}</div>
                    <div class="cell-tanggal__sub">${escapeHtml(t.waktu || "—")} WIB</div>
                </td>
                <td class="td-r">
                    <span class="cell-nominal cell-nominal--${escapeHtml(t.jenis)}">
                        ${tanda}${formatRupiah(nominal)}
                    </span>
                </td>
                <td class="td-c">
                    <span class="aksi-grup">
                        <button type="button" class="icon-btn" data-aksi="detail" data-id="${escapeHtml(t.id)}" aria-label="Lihat detail ${escapeHtml(t.id)}" title="Detail">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        <button type="button" class="icon-btn" data-aksi="ubah" data-id="${escapeHtml(t.id)}" aria-label="Ubah ${escapeHtml(t.id)}" title="Ubah">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button type="button" class="icon-btn icon-btn--hapus" data-aksi="hapus" data-id="${escapeHtml(t.id)}" aria-label="Hapus ${escapeHtml(t.id)}" title="Hapus">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </span>
                </td>
            </tr>
        `;
    };

    const renderTabel = (baris) => {
        const tbody = $("isiTabelTransaksi");
        const kosong = $("emptyState");
        if (!tbody || !kosong) return;

        tbody.innerHTML = baris.map(barisTabel).join("");
        if (baris.length === 0) {
            kosong.hidden = false;
            tbody.innerHTML = "";
        } else {
            kosong.hidden = true;
        }

        const info = $("tabelInfo");
        if (info) info.textContent = `${baris.length} transaksi ditampilkan`;
    };

    /* ============================================================
       RENDER RINGKASAN
       ============================================================ */
    const renderRingkasan = (baris) => {
        const masuk = baris.filter(t => t.jenis === "masuk")
            .reduce((total, t) => total + hitungNilaiKas(t.tagihan, t.diterima), 0);
        const keluar = baris.filter(t => t.jenis === "keluar")
            .reduce((total, t) => total + hitungNilaiKas(t.tagihan, t.diterima), 0);
        const selisih = masuk - keluar;

        if ($("sumMasuk")) $("sumMasuk").textContent = formatRupiah(masuk);
        if ($("sumKeluar")) $("sumKeluar").textContent = formatRupiah(keluar);
        if ($("sumSelisih")) $("sumSelisih").textContent = (selisih >= 0 ? "+" : "−") + formatRupiah(Math.abs(selisih));

        const jumlah = baris.length;
        if ($("sumMasukNote")) $("sumMasukNote").textContent = jumlah ? `${baris.filter(t => t.jenis === "masuk").length} transaksi pemasukan` : "tidak ada pemasukan";
        if ($("sumKeluarNote")) $("sumKeluarNote").textContent = jumlah ? `${baris.filter(t => t.jenis === "keluar").length} transaksi pengeluaran` : "tidak ada pengeluaran";
        if ($("sumSelisihNote")) {
            if (!jumlah) $("sumSelisihNote").textContent = "tidak ada transaksi";
            else if (selisih > 0) $("sumSelisihNote").textContent = "saldo kas bertambah";
            else if (selisih < 0) $("sumSelisihNote").textContent = "saldo kas berkurang";
            else $("sumSelisihNote").textContent = "pemasukan dan pengeluaran seimbang";
        }
    };

    /* ============================================================
       FILTER — KATEGORI
       ============================================================ */
    const isiPilihanKategori = () => {
        const pilihJenis = $("filterJenis");
        const pilihKategori = $("filterKategori");
        if (!pilihJenis || !pilihKategori) return;

        const jenis = pilihJenis.value;
        const nilaiLama = pilihKategori.value;
        let daftar = [];

        if (jenis === "masuk") daftar = KATEGORI_MASUK;
        else if (jenis === "keluar") daftar = KATEGORI_KELUAR;
        else daftar = [...KATEGORI_MASUK, ...KATEGORI_KELUAR];

        pilihKategori.innerHTML = `<option value="semua">Semua Kategori</option>` +
            daftar.map(k => `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`).join("");

        const masihAda = [...pilihKategori.options].some(o => o.value === nilaiLama);
        if (masihAda) pilihKategori.value = nilaiLama;
    };

    /* ============================================================
       TERAPKAN FILTER
       ============================================================ */
    const terapkanFilter = () => {
        const inputCari = $("cariTransaksi");
        const filterJenis = $("filterJenis");
        const filterKategori = $("filterKategori");
        const filterBulan = $("filterBulan");
        if (!inputCari || !filterJenis || !filterKategori || !filterBulan) return;

        const kata = inputCari.value.trim().toLowerCase();
        const jenis = filterJenis.value;
        const kategori = filterKategori.value;
        const bulan = filterBulan.value;

        const hasil = TRANSAKSI.filter(t => {
            if (jenis !== "semua" && t.jenis !== jenis) return false;
            if (kategori !== "semua" && t.kategori !== kategori) return false;
            if (bulan !== "semua" && !t.tanggal.startsWith(bulan)) return false;
            if (kata) {
                const gabung = `${t.id} ${t.keterangan} ${t.kategori} ${t.kelas} ${t.petugas}`.toLowerCase();
                if (!gabung.includes(kata)) return false;
            }
            return true;
        });

        renderTabel(hasil);
        renderRingkasan(hasil);
    };

    const resetFilter = () => {
        if ($("cariTransaksi")) $("cariTransaksi").value = "";
        if ($("filterJenis")) $("filterJenis").value = "semua";
        if ($("filterBulan")) $("filterBulan").value = "semua";
        isiPilihanKategori();
        if ($("filterKategori")) $("filterKategori").value = "semua";
        terapkanFilter();
    };

    /* ============================================================
       MODAL & TOAST
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

    const tutupSemuaModal = () => {
        document.querySelectorAll(".modal-backdrop.is-open").forEach(m => tutupModal(m.id));
    };

    let toastTimer = null;
    const tampilkanToast = (pesan) => {
        const toast = $("toast");
        const toastText = $("toastText");
        if (!toast || !toastText) return;
        toastText.textContent = pesan;
        toast.classList.add("is-muncul");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("is-muncul"), 2800);
    };

    /* ============================================================
       FORM — JENIS & KATEGORI
       ============================================================ */
    const jenisTerpilih = () => {
        const radio = document.querySelector('input[name="jenisTransaksi"]:checked');
        return radio ? radio.value : "masuk";
    };

    const isiKategoriForm = () => {
        const pilih = $("inputKategori");
        if (!pilih) return;
        const jenis = jenisTerpilih();
        const nilaiLama = pilih.value;
        const daftar = jenis === "masuk" ? KATEGORI_MASUK : KATEGORI_KELUAR;
        pilih.innerHTML = daftar.map(k => `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`).join("");
        const masihAda = [...pilih.options].some(o => o.value === nilaiLama);
        if (masihAda) pilih.value = nilaiLama;
    };

    const sesuaikanLabelJenis = () => {
        const jenis = jenisTerpilih();
        const labelDiterima = $("labelDiterima");
        const labelMasukKas = $("labelMasukKas");
        const uangBox = $("uangBox");

        if (labelDiterima) {
            labelDiterima.innerHTML = jenis === "masuk"
                ? `Jumlah uang yang diterima Bendahara <b class="wajib">*</b>`
                : `Jumlah uang yang dibayarkan Bendahara <b class="wajib">*</b>`;
        }
        if (labelMasukKas) {
            labelMasukKas.textContent = jenis === "masuk"
                ? "Jumlah uang yang masuk ke kas"
                : "Jumlah uang yang keluar dari kas";
        }
        if (uangBox) uangBox.classList.toggle("is-keluar", jenis === "keluar");
        hitungUangLive();
    };

    const hitungUangLive = () => {
        const inputTagihan = $("inputTagihan");
        const inputDiterima = $("inputDiterima");
        const hasilKembalian = $("hasilKembalian");
        const hasilMasukKas = $("hasilMasukKas");
        if (!inputTagihan || !inputDiterima || !hasilKembalian || !hasilMasukKas) return;

        const tagihan = parseAngka(inputTagihan.value);
        const diterima = parseAngka(inputDiterima.value);
        const kembalian = hitungKembalian(tagihan, diterima);
        const nilaiKas = hitungNilaiKas(tagihan, diterima);

        hasilKembalian.textContent = kembalian.toLocaleString("id-ID");
        hasilMasukKas.textContent = nilaiKas.toLocaleString("id-ID");

        const hint = $("uangHint");
        if (!hint) return;

        if (diterima > 0 && diterima < tagihan) {
            const kekurangan = tagihan - diterima;
            hint.classList.add("is-peringatan");
            hint.innerHTML = `<span class="material-symbols-outlined">info</span>Uang ${jenis === "masuk" ? "yang diterima" : "yang dibayarkan"} lebih kecil dari nilai transaksi — masih kurang Rp ${kekurangan.toLocaleString("id-ID")}.`;
            return;
        }
        if (diterima > tagihan && tagihan > 0) {
            hint.classList.remove("is-peringatan");
            hint.innerHTML = `<span class="material-symbols-outlined">info</span>Uang diterima/dibayarkan Rp ${diterima.toLocaleString("id-ID")} menghasilkan kembalian Rp ${kembalian.toLocaleString("id-ID")}. Nilai yang dicatat ke kas Rp ${nilaiKas.toLocaleString("id-ID")}.`;
            return;
        }
        hint.classList.remove("is-peringatan");
        hint.innerHTML = `<span class="material-symbols-outlined">info</span>Contoh: transaksi Rp 10.000 dan uang Rp 20.000 → kembalian Rp 10.000, sehingga nilai yang dicatat ke kas Rp 10.000.`;
    };

    /* ============================================================
       FORM — BUKA TAMBAH (Langsung Tambahkan)
       ============================================================ */
    const bukaFormTambah = () => {
        const form = $("formTransaksi");
        if (!form) return;

        modeForm = "tambah";
        idSedangDiubah = null;

        if ($("modalFormEyebrow")) $("modalFormEyebrow").textContent = "TRANSAKSI BARU";
        if ($("modalFormTitle")) $("modalFormTitle").textContent = "Catat Transaksi";
        if ($("btnSimpanText")) $("btnSimpanText").textContent = "Simpan Transaksi";

        form.reset();
        if ($("formError")) $("formError").hidden = true;

        const radioMasuk = document.querySelector('input[name="jenisTransaksi"][value="masuk"]');
        if (radioMasuk) radioMasuk.checked = true;

        isiKategoriForm();

        const hariIni = new Date();
        const iso = `${hariIni.getFullYear()}-${String(hariIni.getMonth() + 1).padStart(2, "0")}-${String(hariIni.getDate()).padStart(2, "0")}`;
        if ($("inputTanggal")) $("inputTanggal").value = iso;
        if ($("hasilKembalian")) $("hasilKembalian").textContent = "0";
        if ($("hasilMasukKas")) $("hasilMasukKas").textContent = "0";

        sesuaikanLabelJenis();
        bukaModal("modalForm");

        setTimeout(() => { if ($("inputKeterangan")) $("inputKeterangan").focus(); }, 120);
    };

    /* ============================================================
       FORM — BUKA UBAH
       ============================================================ */
    const bukaFormUbah = async (id) => {
        const t = TRANSAKSI.find(item => item.id === id);
        if (!t) return;

        const form = $("formTransaksi");
        if (!form) return;

        modeForm = "ubah";
        idSedangDiubah = id;

        if ($("modalFormEyebrow")) $("modalFormEyebrow").textContent = "UBAH TRANSAKSI";
        if ($("modalFormTitle")) $("modalFormTitle").textContent = `Ubah ${t.id}`;
        if ($("btnSimpanText")) $("btnSimpanText").textContent = "Perbarui Transaksi";

        form.reset();
        if ($("formError")) $("formError").hidden = true;

        const radio = document.querySelector(`input[name="jenisTransaksi"][value="${t.jenis}"]`);
        if (radio) radio.checked = true;

        isiKategoriForm();
        if ($("inputKategori")) $("inputKategori").value = t.kategori;
        if ($("inputKelas")) $("inputKelas").value = t.kelas || "";
        if ($("inputKeterangan")) $("inputKeterangan").value = t.keterangan || "";
        if ($("inputTanggal")) $("inputTanggal").value = t.tanggal || "";

        if ($("inputTagihan")) $("inputTagihan").value = Number(t.tagihan || 0).toLocaleString("id-ID");
        if ($("inputDiterima")) $("inputDiterima").value = Number(t.diterima || 0).toLocaleString("id-ID");

        sesuaikanLabelJenis();
        bukaModal("modalForm");

        setTimeout(() => { if ($("inputKeterangan")) $("inputKeterangan").focus(); }, 120);
    };

    /* ============================================================
       FORM — SIMPAN TRANSAKSI
       ============================================================ */
    const simpanTransaksi = async (e) => {
        e.preventDefault();

        const kategori = $("inputKategori") ? $("inputKategori").value : "";
        const keterangan = $("inputKeterangan") ? $("inputKeterangan").value.trim() : "";
        const tanggal = $("inputTanggal") ? $("inputTanggal").value : "";
        const kelas = $("inputKelas") ? $("inputKelas").value : "";
        const jenis = jenisTerpilih();
        const tagihan = $("inputTagihan") ? parseAngka($("inputTagihan").value) : 0;
        const diterima = $("inputDiterima") ? parseAngka($("inputDiterima").value) : 0;

        const galat = [];
        if (!keterangan) galat.push("Keterangan wajib diisi");
        if (!tanggal) galat.push("Tanggal wajib diisi");
        if (!kategori) galat.push("Kategori wajib dipilih");
        if (tagihan <= 0) galat.push("Jumlah transaksi wajib lebih dari 0");
        if (diterima <= 0) galat.push("Jumlah uang wajib lebih dari 0");

        const kotakGalat = $("formError");
        if (galat.length) {
            if (kotakGalat) {
                kotakGalat.textContent = galat.join(" • ");
                kotakGalat.hidden = false;
            }
            return;
        }
        if (kotakGalat) kotakGalat.hidden = true;

        const jam = new Date();
        const waktu = `${String(jam.getHours()).padStart(2, "0")}:${String(jam.getMinutes()).padStart(2, "0")}`;

        const jenisDb = jenis === "masuk" ? "M" : "K";

        const payload = {
            jenis: jenisDb,
            kategori: kategori,
            keterangan: keterangan,
            tanggal: tanggal,
            nominal: tagihan,
            uang_diterima: diterima,
            keterangan_detail: keterangan,
            metode: "Tunai",
            pic: "Admin"
        };

        const tombolSimpan = $("btnSimpanTransaksi");
        if (tombolSimpan) tombolSimpan.disabled = true;

        try {
            if (modeForm === "ubah" && idSedangDiubah) {
                await permintaanAPI(`${API_URL}/${encodeURIComponent(idSedangDiubah)}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });
                tampilkanToast(`Transaksi ${idSedangDiubah} berhasil diperbarui`);
            } else {
                const hasil = await permintaanAPI(API_URL, {
                    method: "POST",
                    body: JSON.stringify(payload)
                });
                const idBaru = hasil.data?.id_transaksi ?? hasil.data?.id ?? "";
                tampilkanToast(`Transaksi ${idBaru} berhasil dicatat`);
            }

            tutupModal("modalForm");
            await muatData();
        } catch (error) {
            tampilkanToast(error.message || "Gagal menyimpan transaksi.");
        } finally {
            if (tombolSimpan) tombolSimpan.disabled = false;
        }
    };

    /* ============================================================
       DETAIL TRANSAKSI
       ============================================================ */
    const bukaDetail = (id) => {
        const t = TRANSAKSI.find(item => item.id === id);
        if (!t) return;

        const nilaiKas = hitungNilaiKas(t.tagihan, t.diterima);
        const kembalian = hitungKembalian(t.tagihan, t.diterima);

        if ($("modalDetailTitle")) $("modalDetailTitle").textContent = t.id;
        if ($("detailJenis")) $("detailJenis").textContent = t.jenis === "masuk" ? "Pemasukan" : "Pengeluaran";
        if ($("detailKategori")) $("detailKategori").textContent = t.kategori;
        if ($("detailKelas")) $("detailKelas").textContent = t.kelas || "—";
        if ($("detailTanggal")) $("detailTanggal").textContent = formatTanggal(t.tanggal);
        if ($("detailWaktu")) $("detailWaktu").textContent = `${t.waktu || "—"} WIB`;
        if ($("detailPetugas")) $("detailPetugas").textContent = t.petugas || "—";
        if ($("detailKeterangan")) $("detailKeterangan").textContent = t.keterangan || "—";

        if ($("rincianLabelDiterima")) $("rincianLabelDiterima").textContent = t.jenis === "masuk"
            ? "Jumlah uang yang diterima Bendahara"
            : "Jumlah uang yang dibayarkan Bendahara";
        if ($("rincianLabelMasukKas")) $("rincianLabelMasukKas").textContent = t.jenis === "masuk"
            ? "Jumlah uang yang masuk ke kas"
            : "Jumlah uang yang keluar dari kas";
        if ($("rincianTagihan")) $("rincianTagihan").textContent = formatRupiah(t.tagihan);
        if ($("rincianDiterima")) $("rincianDiterima").textContent = formatRupiah(t.diterima);
        if ($("rincianKembalian")) $("rincianKembalian").textContent = formatRupiah(kembalian);
        if ($("rincianMasukKas")) $("rincianMasukKas").textContent = formatRupiah(nilaiKas);

        bukaModal("modalDetail");
    };

    /* ============================================================
       HAPUS TRANSAKSI
       ============================================================ */
    const bukaHapus = (id) => {
        const transaksi = TRANSAKSI.find(item => item.id === id);
        if (!transaksi) return;
        idSedangDihapus = id;
        if ($("hapusText")) $("hapusText").textContent = `Transaksi ${id} akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.`;
        bukaModal("modalHapus");
    };

    const jalankanHapus = async () => {
        if (!idSedangDihapus) return;
        const tombol = $("btnKonfirmasiHapus");
        if (tombol) tombol.disabled = true;

        try {
            await permintaanAPI(`${API_URL}/${encodeURIComponent(idSedangDihapus)}`, { method: "DELETE" });
            tampilkanToast(`Transaksi ${idSedangDihapus} dihapus`);
            tutupModal("modalHapus");
            idSedangDihapus = null;
            await muatData();
        } catch (error) {
            tampilkanToast(error.message || "Gagal menghapus transaksi.");
        } finally {
            if (tombol) tombol.disabled = false;
        }
    };

    /* ============================================================
       SIDEBAR + DROPDOWN + TANGGAL
       ============================================================ */
    const pasangInteraksiUmum = () => {
        const tombolSidebar = $("sidebarToggle");
        const backdrop = $("sidebarBackdrop");
        const tutupSidebar = () => document.body.classList.remove("nav-open");

        if (tombolSidebar) tombolSidebar.addEventListener("click", () => document.body.classList.toggle("nav-open"));
        if (backdrop) backdrop.addEventListener("click", tutupSidebar);
        window.addEventListener("resize", () => { if (window.innerWidth > 1024) tutupSidebar(); });

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

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") { tutupSidebar(); tutupProfil(); tutupSemuaModal(); }
        });

        const elTanggal = $("topbarDate");
        if (elTanggal) {
            elTanggal.textContent = new Date().toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
            });
        }
    };

    /* ============================================================
       EVENT
       ============================================================ */
    const pasangEvent = () => {
        $("cariTransaksi")?.addEventListener("input", terapkanFilter);
        $("filterJenis")?.addEventListener("change", () => { isiPilihanKategori(); terapkanFilter(); });
        $("filterKategori")?.addEventListener("change", terapkanFilter);
        $("filterBulan")?.addEventListener("change", terapkanFilter);

        $("btnResetFilter")?.addEventListener("click", resetFilter);
        $("btnKosongkanFilter")?.addEventListener("click", resetFilter);

        $("btnTambahTransaksi")?.addEventListener("click", bukaFormTambah);

        $("inputTanggal")?.addEventListener("input", hitungUangLive);
        $("inputTagihan")?.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            hitungUangLive();
        });
        $("inputDiterima")?.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            hitungUangLive();
        });

        $("formTransaksi")?.addEventListener("submit", simpanTransaksi);

        $("isiTabelTransaksi")?.addEventListener("click", (e) => {
            const tombol = e.target.closest("button[data-aksi]");
            if (!tombol) return;
            const { aksi, id } = tombol.dataset;
            if (aksi === "detail") bukaDetail(id);
            if (aksi === "ubah") bukaFormUbah(id);
            if (aksi === "hapus") bukaHapus(id);
        });

        $("btnKonfirmasiHapus")?.addEventListener("click", jalankanHapus);

        document.querySelectorAll("[data-tutup-modal]").forEach(tombol => {
            tombol.addEventListener("click", () => tutupModal(tombol.dataset.tutupModal));
        });

        document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
            backdrop.addEventListener("mousedown", (e) => {
                if (e.target === backdrop) tutupModal(backdrop.id);
            });
        });

        const radioJenis = document.querySelectorAll('input[name="jenisTransaksi"]');
        radioJenis.forEach(radio => {
            radio.addEventListener("change", sesuaikanLabelJenis);
        });
    };

    /* ============================================================
       JALANKAN
       ============================================================ */
    pasangInteraksiUmum();
    pasangEvent();
    muatData();

})();
