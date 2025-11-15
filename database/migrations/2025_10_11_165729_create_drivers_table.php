<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rules\Numeric;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->string('driver_id')->primary(); // driver_id sebagai primary key string
            $table->string('driver_name'); // Nama driver
            $table->string('phone')->unique(); // Nomor telepon
            $table->string('email')->unique()->nullable(); // Email
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable(); // ← TAMBAHKAN
            $table->string('status')->default('Aktif'); // Status
            $table->string('shift')->nullable(); // Shift kerja
            $table->decimal('last_lat', 10, 8)->nullable(); // Latitude terakhir
            $table->decimal('last_lng', 11, 8)->nullable(); // Longitude terakhir
            $table->rememberToken(); // ← TAMBAHKAN
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
