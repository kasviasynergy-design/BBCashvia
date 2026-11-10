<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * Jalankan DatabaseSeeder sekali setelah migrasi database uji.
     * Test yang membutuhkan user/kelas/siswa contoh tidak perlu
     * menyiapkan data master sendiri.
     *
     * @var bool
     */
    protected $seed = true;
}
