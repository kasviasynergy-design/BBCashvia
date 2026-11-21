/*
 * BBCASHVIA — Filter Kelas Khusus Admin
 *
 * Dipakai oleh seluruh halaman Admin yang memiliki dropdown kelas.
 * Peran Bendahara/Viewer TIDAK memuat modul ini, sehingga tidak ada
 * filter kelas tambahan di halaman mereka.
 *
 * Nilai "semua" berarti "Semua Kelas" dan TIDAK dikirim ke backend.
 */

const PARAM = "id_kelas";
const TANPA_FILTER = "semua";

/** Baca pilihan kelas dari URL saat halaman dibuka/muat ulang. */
export function ambilFilterKelasDariUrl(param = PARAM) {
    const nilai = new URLSearchParams(window.location.search)
        .get(param);

    if (nilai === null || nilai === "") return TANPA_FILTER;

    // Hanya id numerik yang diterima; nilai aneh diabaikan.
    return /^\d+$/.test(nilai) ? nilai : TANPA_FILTER;
}

/** Tulis pilihan kelas (dan page bila ada) ke URL tanpa reload. */
export function simpanFilterKelasKeUrl(nilai, opsi = {}) {
    const {
        param = PARAM,
        halaman = null
    } = opsi;

    const url = new URL(window.location.href);

    if (nilai !== null
        && nilai !== undefined
        && String(nilai) !== ""
        && String(nilai) !== TANPA_FILTER) {
        url.searchParams.set(param, String(nilai));
    } else {
        url.searchParams.delete(param);
    }

    if (halaman !== null && halaman !== undefined) {
        const nomor = Number(halaman);

        if (Number.isFinite(nomor) && nomor > 1) {
            url.searchParams.set("page", String(nomor));
        } else {
            url.searchParams.delete("page");
        }
    }

    window.history.replaceState(
        window.history.state,
        "",
        url.pathname + url.search + url.hash
    );
}

/** Isi <select> dengan kelas dari database, dengan opsi Semua Kelas. */
export function isiDropdownFilterKelas(select, daftarKelas, opsi = {}) {
    if (!select) return;

    const {
        param = PARAM,
        nilaiTerpilih = null,
        teksSemua = "Semua Kelas"
    } = opsi;

    const dariUrl = ambilFilterKelasDariUrl(param);
    const nilaiLama = nilaiTerpilih !== null && nilaiTerpilih !== undefined
        ? String(nilaiTerpilih)
        : (select.value || dariUrl);

    select.innerHTML =
        `<option value="${TANPA_FILTER}">${teksSemua}</option>` +
        (Array.isArray(daftarKelas) ? daftarKelas : [])
            .map((kelas) => {
                const id = kelas.id_kelas;
                const nama = String(kelas.nama_kelas ?? "")
                    .replace(/[&<>"']/g, (karakter) => ({
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#039;"
                    })[karakter]);

                return `<option value="${id}">${nama}</option>`;
            })
            .join("");

    const daftar = Array.isArray(daftarKelas) ? daftarKelas : [];
    const adaDiDaftar = dariUrl !== TANPA_FILTER
        && daftar.some((kelas) => String(kelas.id_kelas) === dariUrl);

    const pilihan = adaDiDaftar ? dariUrl : nilaiLama;
    const valid = pilihan === TANPA_FILTER
        || daftar.some((kelas) => String(kelas.id_kelas) === pilihan);

    select.value = valid ? pilihan : TANPA_FILTER;
}

/** Nilai filter siap dikirim ke API ("" untuk Semua Kelas). */
export function nilaiFilterKelas(select, param = PARAM) {
    if (!select) return "";

    const nilai = String(select.value || "");
    return nilai === "" || nilai === TANPA_FILTER
        ? ""
        : nilai;
}

export { TANPA_FILTER };
