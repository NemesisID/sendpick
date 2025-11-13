<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== GENERATE QR CODES FOR JOB ORDERS ===\n\n";

$jobOrders = DB::table('job_orders')->get();

foreach ($jobOrders as $jo) {
    $qrCode = 'QR-' . $jo->job_order_id;
    DB::table('job_orders')
        ->where('job_order_id', $jo->job_order_id)
        ->update(['qr_code_string' => $qrCode]);
    
    echo "✓ Generated QR code for {$jo->job_order_id}: {$qrCode}\n";
}

echo "\n✅ Total: " . $jobOrders->count() . " QR codes generated\n";
