{{--
    Galat validasi untuk satu field (SKKNI-5).

    Contoh pemakaian:
        @include('partials.field-error', ['field' => 'nama_iuran'])
--}}

@error($field)
    <span
        role="alert"
        style="display:block; margin:6px 0 0; color:#B91C1C; font:500 13px/1.45 'Inter', sans-serif;"
    >
        {{ $message }}
    </span>
@enderror
