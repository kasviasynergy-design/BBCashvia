<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@bbcashvia.test'],
            [
                'name' => 'Admin BBCashvia',
                'password' => Hash::make('Admin123!'),
                'role' => 'admin',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'bendahara@bbcashvia.test'],
            [
                'name' => 'Bendahara BBCashvia',
                'password' => Hash::make('Bendahara123!'),
                'role' => 'bendahara',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'viewer@bbcashvia.test'],
            [
                'name' => 'Viewer BBCashvia',
                'password' => Hash::make('Viewer123!'),
                'role' => 'viewer',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}
