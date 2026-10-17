<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== USERS ===" . PHP_EOL;
$users = DB::table('users')->get();
foreach ($users as $u) {
    echo "  " . json_encode((array) $u) . PHP_EOL;
}
