<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">

    <title>@yield('kode', 'Galat') - BBCashvia | KASVIA Synergy</title>

    {{--
        CSS sengaja ditulis inline dan tidak memakai @vite/asset build.
        Halaman error harus tetap tampil meskipun database mati, Vite
        belum di-build, atau storage/framework/views bermasalah.
    --}}
    <style>
        :root {
            --brand: #4338ca;
            --brand-dark: #312e81;
            --brand-soft: #eef2ff;
            --bg-1: #eef2f7;
            --bg-2: #dbe4f0;
            --card: #ffffff;
            --text: #0f172a;
            --muted: #64748b;
            --border: #e2e8f0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            color: var(--text);
            background:
                radial-gradient(circle at 12% 12%, rgba(67, 56, 202, .14), transparent 32%),
                radial-gradient(circle at 88% 88%, rgba(14, 165, 233, .12), transparent 34%),
                linear-gradient(135deg, var(--bg-1), var(--bg-2));
        }

        .sheet {
            width: 100%;
            max-width: 470px;
            padding: 38px 40px 32px;
            text-align: center;
            background: var(--card);
            border: 1px solid rgba(226, 232, 240, .9);
            border-radius: 20px;
            box-shadow: 0 24px 60px rgba(15, 23, 42, .14);
        }

        .brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 26px;
            text-align: left;
        }

        .brand__mark {
            display: grid;
            place-items: center;
            width: 38px;
            height: 38px;
            border-radius: 12px;
            color: #fff;
            font-size: 18px;
            font-weight: 800;
            background: linear-gradient(135deg, var(--brand), #0ea5e9);
            box-shadow: 0 8px 20px rgba(67, 56, 202, .22);
        }

        .brand__text {
            display: flex;
            flex-direction: column;
            line-height: 1.15;
        }

        .brand__text strong {
            font-size: 16px;
            letter-spacing: -.01em;
        }

        .brand__text small {
            margin-top: 3px;
            color: var(--muted);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: .08em;
            text-transform: uppercase;
        }

        .sheet__kode {
            display: inline-block;
            padding: 7px 14px;
            border-radius: 999px;
            color: var(--brand-dark);
            font-size: 13px;
            font-weight: 800;
            letter-spacing: .12em;
            background: var(--brand-soft);
        }

        .sheet__judul {
            margin: 18px 0 10px;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -.02em;
        }

        .sheet__pesan {
            color: var(--muted);
            font-size: 15px;
            line-height: 1.65;
        }

        .sheet__aksi {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 28px;
        }

        .tombol {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
            padding: 11px 22px;
            border: 1px solid transparent;
            border-radius: 12px;
            font-family: inherit;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            transition: opacity .2s ease, transform .2s ease;
        }

        .tombol:hover {
            opacity: .9;
            transform: translateY(-1px);
        }

        .tombol--utama {
            color: #fff;
            background: var(--brand);
            box-shadow: 0 10px 22px rgba(67, 56, 202, .2);
        }

        .tombol--sekunder {
            color: var(--brand-dark);
            background: #fff;
            border-color: var(--border);
        }

        .sheet__footer {
            margin-top: 30px;
            padding-top: 18px;
            border-top: 1px solid var(--border);
            color: var(--muted);
            font-size: 12px;
            line-height: 1.5;
        }

        @media (max-width: 480px) {
            .sheet {
                padding: 30px 24px 26px;
            }

            .sheet__judul {
                font-size: 21px;
            }
        }
    </style>
</head>

<body>

    <main class="sheet" role="main" aria-labelledby="errorTitle">

        <div class="brand">
            <span class="brand__mark" aria-hidden="true">B</span>
            <span class="brand__text">
                <strong>BBCashvia</strong>
                <small>KASVIA Synergy</small>
            </span>
        </div>

        <p class="sheet__kode">@yield('kode', 'Galat')</p>

        <h1 class="sheet__judul" id="errorTitle">@yield('judul', 'Terjadi Galat')</h1>

        <p class="sheet__pesan">@yield('pesan', 'Silakan coba lagi atau hubungi Admin.')</p>

        <div class="sheet__aksi">
            <a class="tombol tombol--utama" href="/login">Ke Halaman Login</a>
            <button class="tombol tombol--sekunder" type="button" onclick="window.location.reload()">
                Muat Ulang
            </button>
        </div>

        <footer class="sheet__footer">
            BBCashvia &mdash; KASVIA Synergy &bull; Sistem Pengelolaan Kas Kelas
        </footer>

    </main>

</body>

</html>
