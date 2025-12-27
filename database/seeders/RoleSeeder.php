<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Skip jika data sudah ada
        if (DB::table('roles')->count() > 0) {
            $this->command->info('⚠️  Roles already seeded. Skipping...');
            return;
        }

        // $roles = [
        //     ['id' => 1, 'name' => 'Super Admin', 'description' => 'Full system access', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
        //     ['id' => 2, 'name' => 'Admin', 'description' => 'Limited admin access', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
        // ];

        // DB::table('roles')->insert($roles);

        // $this->command->info('✅ Roles seeded successfully: ' . count($roles) . ' records added.');
    }
}