<?php

namespace Database\Seeders;

use App\Models\JobOrder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class JobOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // ✅ Cek apakah data sudah ada
        if (DB::table('job_orders')->count() > 0) {
            $this->command->info('⚠️  Job Orders already seeded. Skipping...');
            return;
        }

        // ✅ Pastikan master data sudah ada
        $customerExists = DB::table('customers')->where('customer_id', 'CUST001')->exists();
        $adminExists = DB::table('admin')->where('user_id', 'ADM001')->exists();

        if (!$customerExists) {
            $this->command->error('❌ Customer CUST001 not found. Please seed CustomerSeeder first!');

            $this->command->warn('Available Customers:');
            $customers = DB::table('customers')->select('customer_id', 'customer_code', 'customer_name')->get();
            foreach ($customers as $customer) {
                $this->command->line("- ID: {$customer->customer_id}, Code: {$customer->customer_code}, Name: {$customer->customer_name}");
            }

            return;
        }

        if (!$adminExists) {
            $this->command->error('❌ Admin ADM001 not found. Please seed AdminSeeder/ProfileSeeder first!');
            return;
        }

        // ✅ Data job orders SESUAI MIGRATION
        $jobOrders = [
            // Job Order 1 - Created (Order Type: LTL)
            [
                'job_order_id' => 'JO-20251109-001',
                'customer_id' => 'CUST001',
                'order_type' => 'LTL', // ✅ Less Than Truckload
                'status' => 'Created',
                'pickup_address' => 'Jl. Sudirman No. 123, Blok A, Jakarta Pusat, DKI Jakarta 10220',
                'delivery_address' => 'Jl. Gatot Subroto No. 456, Gedung B Lt. 3, Jakarta Selatan, DKI Jakarta 12930',
                'goods_desc' => 'Elektronik - Laptop Dell 15 unit, Monitor LG 10 unit, Keyboard & Mouse 25 set',
                'goods_weight' => 500.00, // kg
                'ship_date' => Carbon::now()->addDay()->format('Y-m-d'),
                'order_value' => 15000000.00, // Rp 15 juta
                'created_by' => 'ADM001',
                'completed_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Job Order 2 - Assigned (Order Type: FTL)
            [
                'job_order_id' => 'JO-20251109-002',
                'customer_id' => 'CUST002',
                'order_type' => 'FTL', // ✅ Full Truckload
                'status' => 'Assigned',
                'pickup_address' => 'Jl. Thamrin No. 789, Warehouse B, Jakarta Pusat, DKI Jakarta 10230',
                'delivery_address' => 'Jl. Kuningan No. 321, Office Tower 25th Floor, Jakarta Selatan, DKI Jakarta 12950',
                'goods_desc' => 'Dokumen Penting - Kontrak & Proposal 50 Box, File Legal 30 Box',
                'goods_weight' => 250.00, // kg
                'ship_date' => Carbon::now()->format('Y-m-d'),
                'order_value' => 5000000.00, // Rp 5 juta
                'created_by' => 'ADM001',
                'completed_at' => null,
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(1),
            ],

            // Job Order 3 - Picked Up (Order Type: LTL)
            [
                'job_order_id' => 'JO-20251109-003',
                'customer_id' => 'CUST003',
                'order_type' => 'LTL',
                'status' => 'Picked Up',
                'pickup_address' => 'Jl. Merdeka No. 111, Ruko Makmur, Jakarta Barat, DKI Jakarta 11220',
                'delivery_address' => 'Jl. Asia Afrika No. 222, Toko Buku Gramedia, Jakarta Timur, DKI Jakarta 13330',
                'goods_desc' => 'Buku - Novel 200 pcs, Majalah 150 pcs, Komik 100 pcs',
                'goods_weight' => 300.00, // kg
                'ship_date' => Carbon::now()->format('Y-m-d'),
                'order_value' => 8000000.00, // Rp 8 juta
                'created_by' => 'ADM001',
                'completed_at' => null,
                'created_at' => now()->subHours(3),
                'updated_at' => now()->subMinutes(30),
            ],

            // Job Order 4 - In Transit (Order Type: FTL)
            [
                'job_order_id' => 'JO-20251109-004',
                'customer_id' => 'CUST001',
                'order_type' => 'FTL',
                'status' => 'In Transit',
                'pickup_address' => 'Jl. Kebon Jeruk No. 333, Pabrik Tekstil ABC, Jakarta Barat, DKI Jakarta 11530',
                'delivery_address' => 'Jl. Cikini No. 444, Mall Fashion Center, Jakarta Pusat, DKI Jakarta 10330',
                'goods_desc' => 'Fashion - Kaos 500 pcs, Celana Jeans 300 pcs, Jaket 200 pcs',
                'goods_weight' => 450.00, // kg
                'ship_date' => Carbon::now()->format('Y-m-d'),
                'order_value' => 25000000.00, // Rp 25 juta
                'created_by' => 'ADM001',
                'completed_at' => null,
                'created_at' => now()->subHours(5),
                'updated_at' => now()->subHour(),
            ],

            // Job Order 5 - Delivered (Order Type: LTL)
            [
                'job_order_id' => 'JO-20251109-005',
                'customer_id' => 'CUST002',
                'order_type' => 'LTL',
                'status' => 'Delivered',
                'pickup_address' => 'Jl. Raya Bogor No. 555, Pabrik Makanan XYZ, Jakarta Timur, DKI Jakarta 13750',
                'delivery_address' => 'Jl. Pancoran No. 666, Supermarket ABC, Jakarta Selatan, DKI Jakarta 12780',
                'goods_desc' => 'Makanan - Snack 100 box, Minuman 200 box, Mie Instan 150 box',
                'goods_weight' => 600.00, // kg
                'ship_date' => Carbon::now()->subDay()->format('Y-m-d'),
                'order_value' => 12000000.00, // Rp 12 juta
                'created_by' => 'ADM001',
                'completed_at' => null,
                'created_at' => now()->subHours(6),
                'updated_at' => now()->subMinutes(15),
            ],

            // Job Order 6 - Completed (Order Type: FTL)
            [
                'job_order_id' => 'JO-20251108-001',
                'customer_id' => 'CUST003',
                'order_type' => 'FTL',
                'status' => 'Completed',
                'pickup_address' => 'Surabaya - Jl. Basuki Rahmat No. 100, Gudang Central',
                'delivery_address' => 'Jakarta Selatan - Jl. TB Simatupang No. 200, Office Park',
                'goods_desc' => 'Furniture - Meja Kantor 50 unit, Kursi 100 unit, Lemari 30 unit',
                'goods_weight' => 1500.00, // kg
                'ship_date' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'order_value' => 45000000.00, // Rp 45 juta
                'created_by' => 'ADM001',
                'completed_at' => now()->subDay(), // ✅ Completed date
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDay(),
            ],

            // Job Order 7 - Cancelled (Order Type: LTL)
            [
                'job_order_id' => 'JO-20251108-002',
                'customer_id' => 'CUST001',
                'order_type' => 'LTL',
                'status' => 'Cancelled',
                'pickup_address' => 'Bandung - Jl. Dago No. 77, Toko Fashion',
                'delivery_address' => 'Yogyakarta - Jl. Malioboro No. 88, Boutique',
                'goods_desc' => 'Pakaian - Dress 100 pcs, Kemeja 80 pcs, Rok 60 pcs',
                'goods_weight' => 180.00, // kg
                'ship_date' => Carbon::now()->addDay()->format('Y-m-d'),
                'order_value' => 9000000.00, // Rp 9 juta
                'created_by' => 'ADM001',
                'completed_at' => null,
                'created_at' => now()->subHours(12),
                'updated_at' => now()->subHours(10),
            ],

            // Job Order 8 - Created (Order Type: FTL) - High Value
            [
                'job_order_id' => 'JO-20251109-006',
                'customer_id' => 'CUST002',
                'order_type' => 'FTL',
                'status' => 'Created',
                'pickup_address' => 'Tangerang - Jl. BSD Raya No. 999, Warehouse Tech',
                'delivery_address' => 'Bekasi - Jl. Kalimalang No. 888, IT Center',
                'goods_desc' => 'Peralatan IT - Server 10 unit, Network Equipment 50 box, Kabel & Aksesoris',
                'goods_weight' => 800.00, // kg
                'ship_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'order_value' => 75000000.00, // Rp 75 juta (High value)
                'created_by' => 'ADM001',
                'completed_at' => null,
                'created_at' => now()->subMinutes(30),
                'updated_at' => now()->subMinutes(30),
            ],

        ];

        // ✅ Insert data
        DB::table('job_orders')->insert($jobOrders);

        $this->command->info('✅ JobOrderSeeder seeded successfully: ' . count($jobOrders) . ' job orders');

    }
}