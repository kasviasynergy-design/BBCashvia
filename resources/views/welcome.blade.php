<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        <!-- Styles / Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <style>
            /*! tailwindcss v4.0.7 | MIT License | https://tailwindcss.com */@layer theme{:root,:host{--primary:#2BA19E;--primary-dark:#237A77;--primary-soft:#D4F1F9;--success:#2BA19E;--success-soft:#D4F1F9;--warning:#F4D98E;--warning-soft:#F4D98E;--bg:#FFFDFF;--surface:#FFFFFF;--surface-soft:#D4F1F9;--border:#A5DBE3;--sidebar-active:#D4F1F9;--sidebar-active-text:#2BA19E;}}
        </style>
    </head>
    <body class="bg-[var(--bg)] dark:bg-[#0a0a0a] text-[var(--primary-dark)] flex p-6 lg:p-8 items-center lg:justify-center min-h-screen flex-col">
        <header class="w-full lg:max-w-4xl max-w-[335px] text-sm mb-4 border-b border-[var(--border)] lg:sticky lg:top-0 bg-[var(--surface)] z-10">
            @if (Route::has('login'))
                <nav class="flex items-center justify-end gap-4">
                    @auth
                        <a
                            href="{{ url('/dashboard') }}"
                            class="inline-block px-5 py-1.5 dark:text-[#EDEDEC] border-[var(--border)] hover:border-opacity-100 border text-[var(--primary-dark)] dark:border-[var(--border)] dark:hover:border-opacity-100 rounded-sm text-sm leading-normal"
                        >
                            Dashboard
                        </a>
                    @else
                        <a
                            href="{{ route('login') }}"
                            class="inline-block px-5 py-1.5 dark:text-[#EDEDEC] text-[var(--primary-dark)] border border-transparent hover:border-[var(--border)] dark:hover:border-[var(--border)] rounded-sm text-sm leading-normal"
                        >
                            Log in
                        </a>

                        @if (Route::has('register'))
                            <a
                                href="{{ route('register') }}"
                                class="inline-block px-5 py-1.5 dark:text-[#EDEDEC] border-[var(--border)] hover:border-opacity-100 border text-[var(--primary-dark)] dark:border-[var(--border)] dark:hover:border-opacity-100 rounded-sm text-sm leading-normal">
                                Register
                            </a>
                        @endif
                    @endauth
                </nav>
            @endif
        </header>
        <div class="flex items-center justify-center w-full transition-opacity opacity-100 duration-750 lg:grow starting:opacity-0">
            <main class="flex max-w-[335px] w-full flex-col-reverse lg:max-w-4xl lg:flex-row">
                <div class="text-[13px] leading-[20px] flex-1 p-6 pb-12 lg:p-20 bg-[var(--surface)] dark:bg-[#161615] dark:text-[#EDEDEC] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d] rounded-bl-lg rounded-br-lg lg:rounded-tl-lg lg:rounded-br-none">
                    <h1 class="mb-1 font-medium">Let's get started</h1>
                    <p class="mb-2 text-[var(--primary-dark)] dark:text-[var(--primary-soft)]">Laravel has an incredibly rich ecosystem. <br>We suggest starting with the following.</p>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <!-- Kartu Iuran Bulanan -->
                        <div class="rounded-lg bg-[var(--primary-soft)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors overflow-hidden">
                            <div class="p-4 border-b border-[var(--border)]">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h3 class="font-medium text-[var(--primary)]">Iuran Bulanan</h3>
                                        <p class="text-sm text-[var(--primary-dark)]">XI RPL 1</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-[var(--primary)]">Rp 12.500.000</p>
                                        <p class="text-xs text-[var(--primary-soft)]">bulan ini</p>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-[gray-500]">Terbayar</span>
                                    <span class="text-[var(--primary)] font-medium">85%</span>
                                </div>
                                <div class="w-full bg-[var(--surface-soft)] rounded-full h-2 mt-2">
                                    <div class="h-2 rounded-full bg-[var(--primary)] transition-width" style="width: 85%"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Kartu Iuran Periode -->
                        <div class="rounded-lg bg-[var(--primary-soft)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors overflow-hidden">
                            <div class="p-4 border-b border-[var(--border)]">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h3 class="font-medium text-[var(--primary)]">Iuran Semester</h3>
                                        <p class="text-sm text-[var(--primary-dark)]">XI RPL 1</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-[var(--primary)]">Rp 37.500.000</p>
                                        <p class="text-xs text-[var(--primary-soft)]">2 semester ini</p>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-[gray-500]">Terbayar</span>
                                    <span class="text-[var(--primary)] font-medium">78%</span>
                                </div>
                                <div class="w-full bg-[var(--surface-soft)] rounded-full h-2 mt-2">
                                    <div class="h-2 rounded-full bg-[var(--primary)] transition-width" style="width: 78%"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Kartu Tagihan Baru -->
                        <div class="rounded-lg bg-[var(--primary-soft)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors overflow-hidden">
                            <div class="p-4 border-b border-[var(--border)]">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h3 class="font-medium text-[var(--primary)]">Tagihan Baru</h3>
                                        <p class="text-sm text-[var(--primary-dark)]">Siswa Baru</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-[var(--primary)]">Rp 5.200.000</p>
                                        <p class="text-xs text-[var(--primary-soft)]"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4">
                                <a href="#" class="inline-flex items-center text-[var(--primary)] font-medium hover:underline">
                                    Lihat Semua
                                </a>
                            </div>
                        </div>