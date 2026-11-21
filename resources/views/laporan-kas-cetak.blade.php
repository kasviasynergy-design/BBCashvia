<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $judul }} - {{ $id_kelas_nama }} | {{ $namaAplikasi }}</title>
    <style>
        :root {
            --bb-primary: #2BA19E;
            --bb-primary-dark: #237A77;
            --bb-soft: #D4F1F9;
            --bb-softest: #FFFDFF;
            --bb-white: #FFFFFF;
            --bb-accent: #A5DBE3;
            --bb-gold: #F4D98E;
            --bb-ink: #1D3F45;
            --bb-muted: #5C7A80;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            background: var(--bb-soft);
            color: var(--bb-ink);
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.5;
        }

        .toolbar {
            background: var(--bb-white);
            border-bottom: 1px solid var(--bb-accent);
            padding: 12px 20px;
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: space-between;
        }

        .toolbar__title {
            font-weight: bold;
            color: var(--bb-primary-dark);
            letter-spacing: .04em;
        }

        .toolbar__aksi { display: flex; gap: 8px; flex-wrap: wrap; }

        .btn-cetak {
            border: 1px solid var(--bb-primary);
            background: var(--bb-primary);
            color: var(--bb-white);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
        }

        .btn-cetak--kedua {
            background: var(--bb-white);
            color: var(--bb-primary-dark);
        }

        .lembar {
            max-width: 1000px;
            margin: 20px auto;
            background: var(--bb-white);
            padding: 28px 32px;
            box-shadow: 0 4px 18px rgba(35, 122, 119, .12);
        }

        .kop {
            display: flex;
            align-items: center;
            gap: 18px;
            border-bottom: 3px solid var(--bb-primary);
            padding-bottom: 16px;
        }

        .kop__logo {
            width: 72px;
            height: 72px;
            object-fit: contain;
            border: 1px solid var(--bb-soft);
            border-radius: 10px;
            background: var(--bb-softest);
            padding: 6px;
        }

        .kop__nama {
            font-size: 26px;
            font-weight: bold;
            color: var(--bb-primary-dark);
            margin: 0;
            letter-spacing: .06em;
        }

        .kop__tagline {
            margin: 2px 0 0;
            color: var(--bb-primary);
            font-size: 13px;
            font-weight: bold;
            letter-spacing: .12em;
        }

        .kop__desc { margin: 4px 0 0; color: var(--bb-muted); }

        .judul {
            text-align: center;
            margin: 24px 0 4px;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: .04em;
            text-transform: uppercase;
            color: var(--bb-primary-dark);
        }

        .subjudul {
            text-align: center;
            margin: 0 0 20px;
            color: var(--bb-muted);
        }

        .info {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }

        .info td {
            border: 1px solid var(--bb-accent);
            padding: 7px 10px;
            background: var(--bb-softest);
        }

        .info td.label {
            width: 18%;
            font-weight: bold;
            color: var(--bb-primary-dark);
            background: var(--bb-soft);
        }

        .info td.label-kanan { width: 16%; }

        .ringkasan {
            display: table;
            width: 100%;
            table-layout: fixed;
            border-spacing: 8px 0;
            margin: 0 -8px 20px;
        }

        .ringkasan__item {
            display: table-cell;
            border: 1px solid var(--bb-accent);
            border-top: 4px solid var(--bb-primary);
            background: var(--bb-softest);
            padding: 10px 12px;
            text-align: right;
        }

        .ringkasan__label {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: .08em;
            color: var(--bb-muted);
            text-align: left;
        }

        .ringkasan__nilai {
            display: block;
            font-size: 16px;
            font-weight: bold;
            color: var(--bb-primary-dark);
            margin-top: 4px;
        }

        .ringkasan__item--saldo { background: var(--bb-soft); }
        .ringkasan__item--keluar { border-top-color: var(--bb-gold); }

        table.rincian {
            width: 100%;
            border-collapse: collapse;
        }

        table.rincian th,
        table.rincian td {
            border: 1px solid var(--bb-accent);
            padding: 7px 8px;
            vertical-align: top;
        }

        table.rincian thead th {
            background: var(--bb-primary);
            color: var(--bb-white);
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: .04em;
        }

        table.rincian td.angka { text-align: right; white-space: nowrap; }
        table.rincian td.tengah { text-align: center; }
        table.rincian tr.total td {
            background: var(--bb-soft);
            font-weight: bold;
            color: var(--bb-primary-dark);
        }

        .rincian-iuran {
            margin: 4px 0 0;
            padding-left: 16px;
            color: var(--bb-muted);
            font-size: 10px;
        }

        .keterangan-kosong { color: var(--bb-muted); font-style: italic; }

        .ttd {
            margin-top: 34px;
            display: table;
            width: 100%;
            table-layout: fixed;
        }

        .ttd__kolom { display: table-cell; text-align: center; }
        .ttd__jarak { height: 58px; }
        .ttd__nama { font-weight: bold; border-top: 1px solid var(--bb-ink); padding-top: 6px; display: inline-block; min-width: 220px; }

        .catatan {
            margin-top: 22px;
            padding: 9px 12px;
            background: var(--bb-softest);
            border-left: 4px solid var(--bb-gold);
            color: var(--bb-muted);
            font-size: 10px;
        }

        @page { size: A4 portrait; margin: 14mm; }

        @media print {
            body { background: var(--bb-white); font-size: 10px; }
            .toolbar { display: none !important; }
            .lembar {
                max-width: none;
                margin: 0;
                padding: 0;
                box-shadow: none;
            }
            .kop__logo { width: 56px; height: 56px; }
            .kop__nama { font-size: 20px; }
            .judul { margin-top: 16px; font-size: 15px; }
            .ringkasan { margin-bottom: 12px; }
            table.rincian { font-size: 9px; }
            table.rincian th, table.rincian td { padding: 4px 5px; }
            table.rincian thead { display: table-header-group; }
            table.rincian tr { page-break-inside: avoid; }
            .ttd { page-break-inside: avoid; margin-top: 20px; }
            .catatan { page-break-inside: avoid; }
        }
    </style>
</head>
<body>

    <div class="toolbar no-print">
        <span class="toolbar__title">BBCASHVIA · LAPORAN KAS</span>
        <div class="toolbar__aksi">
            <button type="button" class="btn-cetak" onclick="window.print()">Cetak Laporan</button>
            <a class="btn-cetak btn-cetak--kedua"
               href="{{ route('laporan.kas.pdf', request()->query()) }}">
                Unduh PDF
            </a>
            <button type="button" class="btn-cetak btn-cetak--kedua"
                    onclick="history.back()">Kembali</button>
        </div>
    </div>

    <div class="lembar">
        <header class="kop">
            @if($logo)
                <img class="kop__logo" src="{{ $logo }}" alt="Logo BBCashvia">
            @endif
            <div>
                <h1 class="kop__nama">{{ $namaAplikasi }}</h1>
                <p class="kop__tagline">{{ $tagline }}</p>
                <p class="kop__desc">Kas Kelas Digital — laporan keuangan kelas yang tercatat di aplikasi.</p>
            </div>
        </header>

        <h2 class="judul">{{ $judul }}</h2>
        <p class="subjudul">Dokumen ini dihasilkan langsung dari data transaksi BBCashvia</p>

        <table class="info">
            <tr>
                <td class="label">Kelas</td>
                <td>{{ $id_kelas_nama }}</td>
                <td class="label label-kanan">Periode</td>
                <td>{{ $periode }}</td>
            </tr>
            <tr>
                <td class="label">Dicetak</td>
                <td>{{ $tanggal_cetak }}</td>
                <td class="label label-kanan">Oleh</td>
                <td>{{ $nama_petugas }}</td>
            </tr>
        </table>

        <div class="ringkasan">
            <div class="ringkasan__item">
                <span class="ringkasan__label">Total Pemasukan</span>
                <span class="ringkasan__nilai">Rp{{ number_format((float) $ringkasan['total_masuk'], 0, ',', '.') }}</span>
            </div>
            <div class="ringkasan__item ringkasan__item--keluar">
                <span class="ringkasan__label">Total Pengeluaran</span>
                <span class="ringkasan__nilai">Rp{{ number_format((float) $ringkasan['total_keluar'], 0, ',', '.') }}</span>
            </div>
            <div class="ringkasan__item ringkasan__item--saldo">
                <span class="ringkasan__label">Saldo Sekarang</span>
                <span class="ringkasan__nilai">Rp{{ number_format((float) $ringkasan['saldo_sekarang'], 0, ',', '.') }}</span>
            </div>
        </div>

        <table class="rincian">
            <thead>
                <tr>
                    <th style="width:5%">No</th>
                    <th style="width:11%">Tanggal</th>
                    <th style="width:14%">No. Bukti</th>
                    <th style="width:27%">Keterangan / Rincian</th>
                    <th style="width:16%">Siswa / Kelas</th>
                    <th style="width:13%">Masuk</th>
                    <th style="width:14%">Keluar</th>
                </tr>
            </thead>
            <tbody>
                @forelse($rincian_transaksi as $index => $item)
                    <tr>
                        <td class="tengah">{{ $index + 1 }}</td>
                        <td>{{ $item['tanggal'] }}</td>
                        <td>{{ $item['no_bukti'] ?: '-' }}</td>
                        <td>
                            {{ $item['keterangan'] }}
                            @if(!empty($item['rincian']))
                                <ul class="rincian-iuran">
                                    @foreach($item['rincian'] as $r)
                                        <li>{{ $r['nama_iuran'] }}: Rp{{ number_format((float) $r['nominal'], 0, ',', '.') }}</li>
                                    @endforeach
                                </ul>
                            @endif
                        </td>
                        <td>
                            {{ $item['nama_siswa'] }}<br>
                            <span class="keterangan-kosong">{{ $item['nama_kelas'] }}</span>
                        </td>
                        <td class="angka">
                            {{ $item['jenis'] === 'pemasukan' ? 'Rp' . number_format($item['nominal'], 0, ',', '.') : '-' }}
                        </td>
                        <td class="angka">
                            {{ $item['jenis'] === 'pengeluaran' ? 'Rp' . number_format($item['nominal'], 0, ',', '.') : '-' }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="tengah keterangan-kosong">
                            Tidak ada transaksi pada kelas dan periode yang dipilih.
                        </td>
                    </tr>
                @endforelse
            </tbody>
            <tfoot>
                <tr class="total">
                    <td colspan="5" class="angka">TOTAL</td>
                    <td class="angka">Rp{{ number_format((float) $ringkasan['total_masuk'], 0, ',', '.') }}</td>
                    <td class="angka">Rp{{ number_format((float) $ringkasan['total_keluar'], 0, ',', '.') }}</td>
                </tr>
                <tr class="total">
                    <td colspan="6" class="angka">SALDO AKHIR</td>
                    <td class="angka">Rp{{ number_format((float) $ringkasan['saldo_sekarang'], 0, ',', '.') }}</td>
                </tr>
            </tfoot>
        </table>

        <div class="ttd">
            <div class="ttd__kolom">
                <div class="ttd__jarak"></div>
                <span class="ttd__nama">Bendahara Kelas</span>
            </div>
            <div class="ttd__kolom">
                <div class="ttd__jarak"></div>
                <span class="ttd__nama">Wali Kelas</span>
            </div>
        </div>

        <p class="catatan">
            Saldo dihitung dari seluruh transaksi pemasukan dikurangi pengeluaran pada kelas dan periode yang tercantum di atas.
            Data yang tampil pada laporan ini adalah data yang tersimpan di database BBCashvia, bukan data contoh.
        </p>
    </div>

</body>
</html>
