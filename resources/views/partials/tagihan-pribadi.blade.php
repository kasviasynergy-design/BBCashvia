{{--
    Panel tagihan pribadi.

    Hanya dirender untuk akun yang memiliki identitas siswa
    (Bendahara / Viewer Siswa). Identitas dan nominal diambil dari
    endpoint /data/tagihan-pribadi yang membaca sesi login, bukan
    parameter URL.
--}}
@if(auth()->user() && auth()->user()->id_siswa)
<section class="panel" id="panelTagihanPribadi" hidden>

    <div class="panel__head">

        <div>

            <div class="panel__eyebrow">
                Tagihan Pribadi
            </div>

            <div class="panel__title">
                Iuran Saya
            </div>

            <div class="panel__sub" id="tagihanPribadiIdentitas">
                Memuat tagihan pribadi…
            </div>

        </div>

        <span class="status status--success" id="tagihanPribadiStatus">
            -
        </span>

    </div>

    <div class="rumus">

        <div class="rumus__item">
            <div class="rumus__label">Total Tagihan</div>
            <div class="rumus__value" id="tagihanPribadiTotal">Rp 0</div>
        </div>

        <div class="rumus__operator">−</div>

        <div class="rumus__item">
            <div class="rumus__label">Sudah Dibayar</div>
            <div class="rumus__value rumus__value--in" id="tagihanPribadiTerbayar">Rp 0</div>
        </div>

        <div class="rumus__operator rumus__operator--sama">=</div>

        <div class="rumus__item rumus__item--hasil">
            <div class="rumus__label">Sisa Tagihan</div>
            <div class="rumus__value" id="tagihanPribadiSisa">Rp 0</div>
        </div>

    </div>

    <div class="table-wrap">

        <table class="table">

            <thead>
                <tr>
                    <th>Iuran</th>
                    <th>Tagihan</th>
                    <th>Terbayar</th>
                    <th>Sisa</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody id="tagihanPribadiRincian">
                <tr>
                    <td colspan="5" class="table__empty">
                        Memuat rincian…
                    </td>
                </tr>
            </tbody>

        </table>

    </div>

    <div class="panel__sub" id="tagihanPribadiKosong" hidden>
        Belum ada iuran aktif untuk kelasmu.
    </div>

</section>
@endif
