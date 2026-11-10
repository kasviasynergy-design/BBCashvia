<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Aplikasi ini memakai fitur MySQL (enum, foreign key, dsb.),
        // sehingga SQLite tidak valid untuk production. Jika variabel
        // DB_CONNECTION tidak terbaca (mis. lupa diset di Railway),
        // gagalkan lebih awal dengan pesan yang jelas daripada diam-diam
        // memakai database/database.sqlite.
        if ($this->app->environment('production')
            && config('database.default') === 'sqlite') {
            throw new \RuntimeException(
                'DB_CONNECTION masih "sqlite" di production. Set DB_CONNECTION=mysql '
                .'beserta DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, dan DB_PASSWORD '
                .'pada Variables service aplikasi di Railway, lalu deploy ulang.'
            );
        }
    }
}
