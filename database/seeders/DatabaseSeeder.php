<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AdminSeeder::class,
            ProfileSeeder::class,
            CustomerSeeder::class,
            VehicleTypeSeeder::class,
            VehicleSeeder::class,
            DriverSeeder::class,
            JobOrderSeeder::class,
            JobOrderAssignmentSeeder::class,
            ManifestSeeder::class,
            DeliveryOrderSeeder::class,
            InvoiceSeeder::class,
            GpsSeeder::class,
            DashboardSeeder::class,
            ReportSeeder::class,
        ]);
    }
}