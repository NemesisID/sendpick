<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobOrderAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cek apakah data sudah ada
        if (DB::table('job_order_assignments')->count() > 0) {
            $this->command->info('⚠️  Job Order Assignments already seeded. Skipping...');
            return;
        }

        // ✅ Sample assignments (Driver + Vehicle assigned to Job Order)
        $assignments = [
            [
                'job_order_id' => 'JO001', // Harus ada di job_orders
                'driver_id' => 'DRV001',
                'vehicle_id' => 'VEH001',
                'status' => 'Active',
                'notes' => 'Pengiriman rutin ke Jakarta Pusat',
                'assigned_at' => now()->subDays(2),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'job_order_id' => 'JO002',
                'driver_id' => 'DRV002',
                'vehicle_id' => 'VEH002',
                'status' => 'Active',
                'notes' => 'Pengiriman besar ke Tangerang',
                'assigned_at' => now()->subDays(1),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'job_order_id' => 'JO003',
                'driver_id' => 'DRV003',
                'vehicle_id' => 'VEH003',
                'status' => 'Completed',
                'notes' => 'Pengiriman ekspres selesai',
                'assigned_at' => now()->subDays(3),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert data
        DB::table('job_order_assignments')->insert($assignments);

        $this->command->info('✅ JobOrderAssignmentSeeder seeded successfully: ' . count($assignments) . ' assignments');
    }
}