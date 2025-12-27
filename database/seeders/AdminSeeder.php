<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;


class AdminSeeder extends Seeder
{
    public function run(): void
    {
       // Cek apakah admin sudah ada (hindari duplicate)
        if (Admin::where('email', 'admin@sendpick.com')->exists()) {
            $this->command->info('Admin already exists, skipping...');
            return;
        }

        Admin::create([
            'user_id' => 'ADM001',
            'name' => 'Super Admin',
            'email' => 'admin@sendpick.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('Admin created successfully!');
    }
}
