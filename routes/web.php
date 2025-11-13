<?php

use Illuminate\Support\Facades\Route;

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

require __DIR__.'/auth.php';
