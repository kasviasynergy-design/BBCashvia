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
