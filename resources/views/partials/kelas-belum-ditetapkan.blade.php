{{--
    Peringatan kelas belum ditetapkan.

    Ditampilkan pada halaman bendahara & viewer ketika admin belum
    menautkan pengguna ke sebuah kelas (users.id_kelas NULL). Tanpa
    kelas, seluruh data yang tampil akan kosong. Admin tidak pernah
    melihat peringatan ini karena mengakses semua kelas.

    Disisipkan lewat @include('partials.kelas-belum-ditetapkan').
--}}

@php
    $pengguna = auth()->user();
    $tampilkanPeringatan = $pengguna
        && ! $pengguna->aksesSemuaKelas()
        && $pengguna->id_kelas === null;
@endphp

@if ($tampilkanPeringatan)
    <div
        role="alert"
        style="
            display:flex;
            align-items:flex-start;
            gap:12px;
            margin:0 0 18px;
            padding:14px 18px;
            background:#F4D98E;
            border:1px solid #A5DBE3;
            border-radius:14px;
            color:#A16207;
            font:500 14px/1.5 'Inter', sans-serif;
        "
    >
        <span
            class="material-symbols-outlined"
            aria-hidden="true"
            style="font-size:22px;line-height:1;flex:none;"
        >info</span>

        <span>
            <strong>Kelas Anda belum ditetapkan.</strong>
            Hubungi admin untuk menetapkan kelas Anda. Selama kelas belum
            ditetapkan, data kelas tidak dapat ditampilkan.
        </span>
    </div>
@endif
