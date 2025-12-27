<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin role if not exists
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'Super Admin'],
            ['description' => 'Full system access']
        );

        // Create default admin user
        $admin = Admin::updateOrCreate(
            ['email' => 'admin@sendpick.com'],
            [
                'user_id' => 'USR001',
                'name' => 'Super Admin',
                'email' => 'admin@sendpick.com',
                'password' => Hash::make('password'), // Default password
                'phone' => '081234567890',
                'department' => 'IT',
                'status' => 'Active',
                'address' => 'Jakarta, Indonesia',
            ]
        );

        // Attach Super Admin role
        if (!$admin->roles->contains($superAdminRole->role_id)) {
            $admin->roles()->attach($superAdminRole->role_id);
        }

        $this->command->info('✅ Super Admin created successfully!');
        $this->command->info('📧 Email: admin@sendpick.com');
        $this->command->info('🔑 Password: password');
    }
}
