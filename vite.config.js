import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',

                // Halaman login & ganti kata sandi (sudah ada)
                'resources/css/login.css',
                'resources/js/login.js',
                'resources/css/change-password.css',
                'resources/js/change-password.js',

                // Halaman admin BBCashvia
                'resources/css/admin-dashboard.css',
                'resources/js/admin-dashboard.js',
                'resources/css/admin-transaksi.css',
                'resources/js/admin-transaksi.js',
                'resources/css/admin-iuran.css',
                'resources/js/admin-iuran.js',
                'resources/css/admin-siswa.css',
                'resources/js/admin-siswa.js',
                'resources/css/admin-laporan-kas.css',
                'resources/js/admin-laporan-kas.js',
                'resources/css/admin-riwayat-transaksi.css',
                'resources/js/admin-riwayat-transaksi.js',
                'resources/css/admin-manajemen-pengguna.css',
                'resources/js/admin-manajemen-pengguna.js',

                // Halaman bendahara BBCashvia
                'resources/css/bendahara-dashboard.css',
                'resources/js/bendahara-dashboard.js',
                'resources/css/bendahara-transaksi.css',
                'resources/js/bendahara-transaksi.js',
                'resources/css/bendahara-iuran.css',
                'resources/js/bendahara-iuran.js',
                'resources/css/bendahara-siswa.css',
                'resources/js/bendahara-siswa.js',
                'resources/css/bendahara-laporan-kas.css',
                'resources/js/bendahara-laporan-kas.js',
                'resources/css/bendahara-riwayat-transaksi.css',
                'resources/js/bendahara-riwayat-transaksi.js',

                // Halaman viewer BBCashvia
                'resources/css/viewer-dashboard.css',
                'resources/js/viewer-dashboard.js',
                'resources/css/viewer-siswa.css',
                'resources/js/viewer-siswa.js',
                'resources/css/viewer-iuran.css',
                'resources/js/viewer-iuran.js',
                'resources/css/viewer-transaksi.css',
                'resources/js/viewer-transaksi.js',
                'resources/css/viewer-riwayat-transaksi.css',
                'resources/js/viewer-riwayat-transaksi.js',
                'resources/css/viewer-laporan-kas.css',
                'resources/js/viewer-laporan-kas.js'

            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
