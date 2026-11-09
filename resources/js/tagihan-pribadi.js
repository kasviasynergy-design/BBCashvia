/* =========================================================
   BBCASHVIA - TAGIHAN PRIBADI
   Menampilkan tagihan iuran milik pengguna yang sedang login.
   Identitas siswa ditentukan backend dari sesi (users.id_siswa),
   bukan dari parameter URL.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    const panel = document.getElementById("panelTagihanPribadi");

    if (!panel) {
        return;
    }

    const el = (id) => document.getElementById(id);

    const rupiah = (nilai) => new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(Number(nilai) || 0);

    const escapeHtml = (nilai) => String(nilai ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const labelStatus = (status) => ({
        lunas: "Lunas",
        sebagian: "Cicilan",
        belum: "Belum Lunas"
    }[status] || "Belum Lunas");

    const kelasStatus = (status) => ({
        lunas: "status status--success",
        sebagian: "status status--warning",
        belum: "status status--danger"
    }[status] || "status status--danger");

    const render = (data) => {

        panel.hidden = false;

        const identitas = el("tagihanPribadiIdentitas");

        if (identitas) {
            identitas.textContent =
                `${data.nama || "Siswa"} • NIS ${data.nis || "-"} • ${data.kelas || "Tanpa kelas"}`;
        }

        const status = el("tagihanPribadiStatus");

        if (status) {
            status.className = kelasStatus(data.status_iuran);
            status.textContent = labelStatus(data.status_iuran);
        }

        if (el("tagihanPribadiTotal")) {
            el("tagihanPribadiTotal").textContent = rupiah(data.tagihan_iuran);
        }

        if (el("tagihanPribadiTerbayar")) {
            el("tagihanPribadiTerbayar").textContent = rupiah(data.terbayar_iuran);
        }

        if (el("tagihanPribadiSisa")) {
            el("tagihanPribadiSisa").textContent = rupiah(data.sisa_iuran);
        }

        const tbody = el("tagihanPribadiRincian");
        const kosong = el("tagihanPribadiKosong");
        const rincian = Array.isArray(data.rincian_iuran)
            ? data.rincian_iuran
            : [];

        if (kosong) {
            kosong.hidden = rincian.length > 0;
        }

        if (!tbody) {
            return;
        }

        if (!rincian.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="table__empty">
                        Belum ada iuran aktif.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = rincian.map((item) => `
            <tr>
                <td>${escapeHtml(item.nama_iuran)}</td>
                <td>${rupiah(item.nominal)}</td>
                <td>${rupiah(item.terbayar)}</td>
                <td>${rupiah(item.sisa)}</td>
                <td>
                    <span class="${kelasStatus(item.status)}">
                        ${escapeHtml(labelStatus(item.status))}
                    </span>
                </td>
            </tr>
        `).join("");
    };

    const muat = async () => {

        try {
            const respons = await fetch("/data/tagihan-pribadi", {
                headers: { Accept: "application/json" },
                credentials: "same-origin",
                cache: "no-store"
            });

            if (!respons.ok) {
                panel.hidden = true;
                return;
            }

            const hasil = await respons.json();

            if (!hasil?.data) {
                panel.hidden = true;
                return;
            }

            render(hasil.data);
        } catch (error) {
            console.error("Gagal memuat tagihan pribadi:", error);
            panel.hidden = true;
        }
    };

    muat();
});
