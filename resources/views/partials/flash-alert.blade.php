{{--
    Pesan flash & validasi formulir (SKKNI-5).

    Menampilkan:
    - session('error')   -> penolakan duplikat / kegagalan simpan;
    - session('success') -> data berhasil disimpan;
    - session('warning') -> peringatan umum;
    - $errors->all()     -> ringkasan galat validasi server.

    Dipakai di halaman form agar pesan dari controller terlihat jelas
    di atas formulir, termasuk saat JavaScript tidak aktif.
--}}

@php
    $pesanError = session('error');
    $pesanSukses = session('success');
    $pesanPeringatan = session('warning');
    $adaValidasi = isset($errors) && $errors->any();
@endphp

@if ($pesanError || $pesanSukses || $pesanPeringatan || $adaValidasi)
    <div
        class="flash-stack"
        aria-live="polite"
        style="display:grid; gap:10px; margin:0 0 18px;"
    >
        @if ($pesanSukses)
            <div
                role="status"
                style="display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border:1px solid #A5DBE3; border-radius:12px; background:#ECFDF5; color:#166534; font:500 14px/1.5 'Inter', sans-serif;"
            >
                <span class="material-symbols-outlined" aria-hidden="true" style="font-size:22px; line-height:1; flex:none;">
                    check_circle
                </span>

                <div>
                    <strong style="display:block; margin-bottom:2px;">Berhasil.</strong>
                    <p style="margin:0;">{{ $pesanSukses }}</p>
                </div>
            </div>
        @endif

        @if ($pesanError)
            <div
                role="alert"
                style="display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border:1px solid #FECACA; border-radius:12px; background:#FEF2F2; color:#991B1B; font:500 14px/1.5 'Inter', sans-serif;"
            >
                <span class="material-symbols-outlined" aria-hidden="true" style="font-size:22px; line-height:1; flex:none;">
                    error
                </span>

                <div>
                    <strong style="display:block; margin-bottom:2px;">Data tidak dapat disimpan.</strong>
                    <p style="margin:0;">{{ $pesanError }}</p>
                </div>
            </div>
        @endif

        @if ($pesanPeringatan)
            <div
                role="alert"
                style="display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border:1px solid #F4D98E; border-radius:12px; background:#FFFBEB; color:#92400E; font:500 14px/1.5 'Inter', sans-serif;"
            >
                <span class="material-symbols-outlined" aria-hidden="true" style="font-size:22px; line-height:1; flex:none;">
                    warning
                </span>

                <div>
                    <strong style="display:block; margin-bottom:2px;">Perhatian.</strong>
                    <p style="margin:0;">{{ $pesanPeringatan }}</p>
                </div>
            </div>
        @endif

        @if ($adaValidasi)
            <div
                role="alert"
                style="display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border:1px solid #FECACA; border-radius:12px; background:#FEF2F2; color:#991B1B; font:500 14px/1.5 'Inter', sans-serif;"
            >
                <span class="material-symbols-outlined" aria-hidden="true" style="font-size:22px; line-height:1; flex:none;">
                    rule
                </span>

                <div>
                    <strong style="display:block; margin-bottom:2px;">Periksa kembali data yang diisi.</strong>

                    <ul style="margin:6px 0 0; padding-left:18px;">
                        @foreach ($errors->all() as $pesan)
                            <li>{{ $pesan }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        @endif
    </div>
@endif
