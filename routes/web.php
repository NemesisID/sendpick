<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard.index');
})->name('dashboard');

// Add fallback route for SPA navigation
Route::get('/job-orders', function () {
    return view('dashboard.index');
})->name('job-orders');

// ========================================
// PDF Print Routes (Public - No Auth)
// ========================================
// Cetak Delivery Order ke PDF
Route::get('/print/delivery-order/{doId}', [PdfController::class, 'printDeliveryOrder'])
    ->name('print.delivery-order');

// Cetak Manifest ke PDF
Route::get('/print/manifest/{manifestId}', [PdfController::class, 'printManifest'])
    ->name('print.manifest');

require __DIR__.'/auth.php';
