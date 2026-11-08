<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>@yield('kode', 'Galat') - BBCashvia | KASVIA Synergy</title>

    <style>
        :root {
            --bg-1: #eef2f7;
            --bg-2: #e2e8f0;
            --card: #ffffff;
            --text: #0f172a;
            --muted: #64748b;
            --border: #e2e8f0;
            --accent: #4338ca;
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
            background: linear-gradient(135deg, var(--bg-1), var(--bg-2));
            color: var(--text);
            padding: 24px;
        }

        .sheet {
            background: var(--card);
            border-radius: 20px;
            box-shadow: 0 24px 60px rgba(15, 23, 42, .14);
            max-width: 470px;
            width: 100%;
            padding: 44px 40px 34px;
            text-align: center;
        }

        .sheet__kode {
            font-size: 68px;
            font-weight: 800;
            letter-spacing: -.03em;
            line-height: 1;
            color: var(--accent);
        }

        .sheet__judul {
            font-size: 22px;
            font-weight: 700;
            margin: 14px 0 10px;
        }

        .sheet__pesan {
            color: var(--muted);
            font-size: 15px;
            line-height: 1.65;
            margin-bottom: 30px;
        }

        .sheet__tombol {
            display: inline-block;
            background: var(--accent);
            color: #fff;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            padding: 12px 36px;
            border-radius: 12px;
            transition: opacity .2s ease;
        }

        .sheet__tombol:hover {
            opacity: .88;
        }

        .sheet__footer {
            margin-top: 30px;
            padding-top: 18px;
            border-top: 1px solid var(--border);
            font-size: 12px;
            color: var(--muted);
        }
    </style>
</head>

<body>

    @php
        // Tujuan tombol "Kembali": ke dashboard sesuai role bila sedang login.
        $urlKembali = auth()->check()
            ? match (strtolower((string) auth()->user()->role)) {
                'admin' => '/dashboard/admin',
                'bendahara' => '/dashboard/bendahara',
                'viewer' => '/dashboard/viewer',
                default => '/login',
            }
            : '/login';
    @endphp

    <main class="sheet">

        <p class="sheet__kode">@yield('kode', 'Galat')</p>

        <h1 class="sheet__judul">@yield('judul', 'Terjadi Galat')</h1>

        <p class="sheet__pesan">@yield('pesan', 'Silakan coba lagi atau hubungi Admin.')</p>

        <a class="sheet__tombol" href="{{ $urlKembali }}">
            Kembali ke Beranda
        </a>

        <footer class="sheet__footer">
            BBCashvia &mdash; KASVIA Synergy &bull; Sistem Pengelolaan Kas Kelas
        </footer>

    </main>

</body>

</html>
