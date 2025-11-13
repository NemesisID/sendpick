<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\Drivers;
use App\Models\Vehicles;
use App\Models\JobOrder;
use App\Models\DeliveryOrder;
use App\Models\Manifests;
use App\Models\Invoices;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * ReportController - Controller untuk mengelola Laporan dan Analytics
 * 
 * Fungsi utama:
 * - Generate laporan penjualan berdasarkan periode
 * - Laporan performa driver dan utilisasi kendaraan
 * - Analytics revenue dan profitability
 * - Laporan customer dan tren pengiriman
 * - Export laporan ke Excel/PDF format
 * - Dashboard analytics dan KPI monitoring
 * - Laporan operasional harian/bulanan
 */
class ReportController extends Controller
{
    /**
     * Get sales performance report
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function sales(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'group_by' => 'in:day,week,month,year'
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();
        $groupBy = $request->get('group_by', 'month');

        // Sales trend data
        $salesTrend = JobOrder::select(
                DB::raw("DATE_TRUNC('{$groupBy}', created_at) as period"),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(order_value) as total_revenue'),
                DB::raw('AVG(order_value) as avg_order_value')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(function ($item) use ($groupBy) {
                return [
                    'period' => Carbon::parse($item->period)->format($this->getDateFormat($groupBy)),
                    'total_orders' => $item->total_orders,
                    'total_revenue' => $item->total_revenue,
                    'avg_order_value' => round($item->avg_order_value, 2)
                ];
            });

        // Customer distribution
        $customerDistribution = Customers::select('customers.customer_name')
            ->selectRaw('COUNT(job_orders.job_order_id) as order_count')
            ->selectRaw('SUM(job_orders.order_value) as total_revenue')
            ->leftJoin('job_orders', 'customers.customer_id', '=', 'job_orders.customer_id')
            ->whereBetween('job_orders.created_at', [$startDate, $endDate])
            ->groupBy('customers.customer_id', 'customers.customer_name')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get();

        // Order status distribution
        $statusDistribution = JobOrder::select('status', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('status')
            ->get();

        // Summary statistics
        $summary = [
            'total_orders' => JobOrder::whereBetween('created_at', [$startDate, $endDate])->count(),
            'total_revenue' => JobOrder::whereBetween('created_at', [$startDate, $endDate])->sum('order_value'),
            'avg_order_value' => JobOrder::whereBetween('created_at', [$startDate, $endDate])->avg('order_value'),
            'total_customers' => JobOrder::whereBetween('created_at', [$startDate, $endDate])
                ->distinct('customer_id')->count('customer_id'),
            'completion_rate' => $this->calculateCompletionRate($startDate, $endDate)
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'sales_trend' => $salesTrend,
                'customer_distribution' => $customerDistribution,
                'status_distribution' => $statusDistribution
            ]
        ], 200);
    }

    /**
     * Get financial report
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function financial(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'group_by' => 'in:day,week,month,year'
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();
        $groupBy = $request->get('group_by', 'month');

        // Revenue trend
        $revenueTrend = Invoices::select(
                DB::raw("DATE_TRUNC('{$groupBy}', created_at) as period"),
                DB::raw('SUM(CASE WHEN status = \'Paid\' THEN total_amount ELSE 0 END) as paid_amount'),
                DB::raw('SUM(CASE WHEN status = \'Pending\' THEN total_amount ELSE 0 END) as pending_amount'),
                DB::raw('SUM(CASE WHEN status = \'Overdue\' THEN total_amount ELSE 0 END) as overdue_amount'),
                DB::raw('SUM(total_amount) as total_invoiced')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(function ($item) use ($groupBy) {
                return [
                    'period' => Carbon::parse($item->period)->format($this->getDateFormat($groupBy)),
                    'paid_amount' => $item->paid_amount,
                    'pending_amount' => $item->pending_amount,
                    'overdue_amount' => $item->overdue_amount,
                    'total_invoiced' => $item->total_invoiced
                ];
            });

        // Payment status summary
        $paymentSummary = Invoices::select('status')
            ->selectRaw('COUNT(*) as invoice_count')
            ->selectRaw('SUM(total_amount) as total_amount')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('status')
            ->get();

        // Outstanding receivables aging
        $receivablesAging = Invoices::select(
                DB::raw("CASE 
                    WHEN due_date >= CURRENT_DATE THEN 'Current'
                    WHEN due_date >= CURRENT_DATE - INTERVAL '30 days' THEN '1-30 days'
                    WHEN due_date >= CURRENT_DATE - INTERVAL '60 days' THEN '31-60 days'
                    WHEN due_date >= CURRENT_DATE - INTERVAL '90 days' THEN '61-90 days'
                    ELSE 'Over 90 days'
                END as aging_category"),
                DB::raw('COUNT(*) as invoice_count'),
                DB::raw('SUM(total_amount) as total_amount')
            )
            ->whereIn('status', ['Pending', 'Overdue'])
            ->groupBy('aging_category')
            ->get();

        // Top paying customers
        $topPayingCustomers = Customers::select('customers.customer_name')
            ->selectRaw('SUM(invoices.total_amount) as total_paid')
            ->selectRaw('COUNT(invoices.invoice_id) as invoice_count')
            ->join('invoices', 'customers.customer_id', '=', 'invoices.customer_id')
            ->where('invoices.status', 'Paid')
            ->whereBetween('invoices.created_at', [$startDate, $endDate])
            ->groupBy('customers.customer_id', 'customers.customer_name')
            ->orderByDesc('total_paid')
            ->limit(10)
            ->get();

        $summary = [
            'total_invoiced' => Invoices::whereBetween('created_at', [$startDate, $endDate])->sum('total_amount'),
            'total_paid' => Invoices::where('status', 'Paid')->whereBetween('created_at', [$startDate, $endDate])->sum('total_amount'),
            'total_pending' => Invoices::whereIn('status', ['Pending', 'Overdue'])->sum('total_amount'),
            'collection_rate' => $this->calculateCollectionRate($startDate, $endDate),
            'avg_invoice_value' => Invoices::whereBetween('created_at', [$startDate, $endDate])->avg('total_amount')
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'revenue_trend' => $revenueTrend,
                'payment_summary' => $paymentSummary,
                'receivables_aging' => $receivablesAging,
                'top_paying_customers' => $topPayingCustomers
            ]
        ], 200);
    }

    /**
     * Get operational report
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function operational(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date'
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        // Delivery performance
        $deliveryStats = DeliveryOrder::selectRaw("
                COUNT(*) as total_deliveries,
                SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as completed_deliveries,
                SUM(CASE WHEN status = 'Failed' THEN 1 ELSE 0 END) as failed_deliveries,
                SUM(CASE WHEN status IN ('Assigned', 'In Transit', 'At Destination') THEN 1 ELSE 0 END) as in_progress_deliveries
            ")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->first();

        // Driver performance
        $driverPerformance = Drivers::select('drivers.driver_name', 'drivers.phone')
            ->selectRaw('COUNT(delivery_orders.do_id) as total_deliveries')
            ->selectRaw('SUM(CASE WHEN delivery_orders.status = \'Delivered\' THEN 1 ELSE 0 END) as successful_deliveries')
            ->selectRaw('ROUND(AVG(CASE WHEN delivery_orders.status = \'Delivered\' THEN 1 ELSE 0 END) * 100, 2) as success_rate')
            ->leftJoin('delivery_orders', 'drivers.driver_id', '=', 'delivery_orders.driver_id')
            ->whereBetween('delivery_orders.created_at', [$startDate, $endDate])
            ->groupBy('drivers.driver_id', 'drivers.driver_name', 'drivers.phone')
            ->orderByDesc('total_deliveries')
            ->limit(10)
            ->get();

        // Vehicle utilization
        $vehicleUtilization = Vehicles::select('vehicles.plate_number', 'vehicle_types.type_name')
            ->selectRaw('COUNT(delivery_orders.do_id) as trips_count')
            ->selectRaw('COUNT(DISTINCT delivery_orders.driver_id) as drivers_used')
            ->leftJoin('vehicle_types', 'vehicles.vehicle_type_id', '=', 'vehicle_types.vehicle_type_id')
            ->leftJoin('delivery_orders', 'vehicles.vehicle_id', '=', 'delivery_orders.vehicle_id')
            ->whereBetween('delivery_orders.created_at', [$startDate, $endDate])
            ->groupBy('vehicles.vehicle_id', 'vehicles.plate_number', 'vehicle_types.type_name')
            ->orderByDesc('trips_count')
            ->limit(10)
            ->get();

        // Manifest efficiency
        $manifestStats = Manifests::selectRaw("
                COUNT(*) as total_manifests,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_manifests,
                AVG(cargo_weight) as avg_cargo_weight,
                SUM(cargo_weight) as total_cargo_handled
            ")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->first();

        // Route analysis
        $routeAnalysis = Manifests::select('origin_city', 'dest_city')
            ->selectRaw('COUNT(*) as route_frequency')
            ->selectRaw('AVG(cargo_weight) as avg_cargo_weight')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('origin_city', 'dest_city')
            ->orderByDesc('route_frequency')
            ->limit(10)
            ->get();

        $summary = [
            'delivery_success_rate' => $deliveryStats->total_deliveries > 0 
                ? round(($deliveryStats->completed_deliveries / $deliveryStats->total_deliveries) * 100, 2) 
                : 0,
            'active_drivers' => Drivers::whereIn('status', ['Available', 'On Duty'])->count(),
            'active_vehicles' => Vehicles::where('status', 'Available')->count(),
            'avg_deliveries_per_driver' => $driverPerformance->avg('total_deliveries'),
            'manifest_completion_rate' => $manifestStats->total_manifests > 0 
                ? round(($manifestStats->completed_manifests / $manifestStats->total_manifests) * 100, 2) 
                : 0
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'delivery_stats' => $deliveryStats,
                'driver_performance' => $driverPerformance,
                'vehicle_utilization' => $vehicleUtilization,
                'manifest_stats' => $manifestStats,
                'route_analysis' => $routeAnalysis
            ]
        ], 200);
    }

    /**
     * Get customer analytics report
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function customerAnalytics(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'customer_id' => 'nullable|exists:customers,customer_id'
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        if ($request->filled('customer_id')) {
            return $this->getSingleCustomerAnalytics($request->customer_id, $startDate, $endDate);
        }

        // Overall customer analytics
        $customerStats = Customers::select('customers.*')
            ->selectRaw('COUNT(job_orders.job_order_id) as total_orders')
            ->selectRaw('SUM(job_orders.order_value) as total_revenue')
            ->selectRaw('AVG(job_orders.order_value) as avg_order_value')
            ->selectRaw('MAX(job_orders.created_at) as last_order_date')
            ->leftJoin('job_orders', 'customers.customer_id', '=', 'job_orders.customer_id')
            ->whereBetween('job_orders.created_at', [$startDate, $endDate])
            ->groupBy('customers.customer_id')
            ->having('total_orders', '>', 0)
            ->orderByDesc('total_revenue')
            ->get();

        // Customer segmentation
        $customerSegmentation = $customerStats->groupBy(function ($customer) {
            if ($customer->total_revenue > 50000000) return 'Premium';
            if ($customer->total_revenue > 20000000) return 'Gold';
            if ($customer->total_revenue > 5000000) return 'Silver';
            return 'Bronze';
        })->map(function ($group, $segment) {
            return [
                'segment' => $segment,
                'customer_count' => $group->count(),
                'total_revenue' => $group->sum('total_revenue'),
                'avg_revenue_per_customer' => $group->avg('total_revenue')
            ];
        })->values();

        // Customer lifetime value
        $customerLTV = Customers::select('customers.customer_name')
            ->selectRaw('COUNT(job_orders.job_order_id) as lifetime_orders')
            ->selectRaw('SUM(job_orders.order_value) as lifetime_value')
            ->selectRaw('DATEDIFF(month, MIN(job_orders.created_at), MAX(job_orders.created_at)) + 1 as customer_lifetime_months')
            ->leftJoin('job_orders', 'customers.customer_id', '=', 'job_orders.customer_id')
            ->groupBy('customers.customer_id', 'customers.customer_name')
            ->having('lifetime_orders', '>', 0)
            ->orderByDesc('lifetime_value')
            ->limit(20)
            ->get();

        // New vs returning customers
        $newVsReturning = [
            'new_customers' => Customers::whereHas('jobOrders', function($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
            })->whereDoesntHave('jobOrders', function($q) use ($startDate) {
                $q->where('created_at', '<', $startDate);
            })->count(),
            
            'returning_customers' => Customers::whereHas('jobOrders', function($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
            })->whereHas('jobOrders', function($q) use ($startDate) {
                $q->where('created_at', '<', $startDate);
            })->count()
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'customer_stats' => $customerStats,
                'customer_segmentation' => $customerSegmentation,
                'customer_ltv' => $customerLTV,
                'new_vs_returning' => $newVsReturning
            ]
        ], 200);
    }

    /**
     * ============================================
     * EXPORT METHODS - Spesifik untuk setiap laporan
     * ============================================
     */

    /**
     * Export sales report to CSV/Excel
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function exportSales(Request $request): JsonResponse
    {
        $request->validate([
            'format' => 'required|in:csv,excel',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date'
        ]);

        $exportData = $this->generateSalesExportData($request);
        $filename = 'sales_report_' . now()->format('Y-m-d_H-i-s') . '.' . $request->format;

        // In real implementation, generate actual file and return download link
        return response()->json([
            'success' => true,
            'message' => 'Sales report export prepared successfully',
            'data' => [
                'filename' => $filename,
                'records_count' => count($exportData),
                'download_url' => url("/api/reports/download/{$filename}"),
                'expires_at' => now()->addHours(24)->toIso8601String()
            ]
        ], 200);
    }

    /**
     * Export financial report to CSV/Excel
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function exportFinancial(Request $request): JsonResponse
    {
        $request->validate([
            'format' => 'required|in:csv,excel',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date'
        ]);

        $exportData = $this->generateFinancialExportData($request);
        $filename = 'financial_report_' . now()->format('Y-m-d_H-i-s') . '.' . $request->format;

        return response()->json([
            'success' => true,
            'message' => 'Financial report export prepared successfully',
            'data' => [
                'filename' => $filename,
                'records_count' => count($exportData),
                'download_url' => url("/api/reports/download/{$filename}"),
                'expires_at' => now()->addHours(24)->toIso8601String()
            ]
        ], 200);
    }

    /**
     * Export operational report to CSV/Excel
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function exportOperational(Request $request): JsonResponse
    {
        $request->validate([
            'format' => 'required|in:csv,excel',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date'
        ]);

        $exportData = $this->generateOperationalExportData($request);
        $filename = 'operational_report_' . now()->format('Y-m-d_H-i-s') . '.' . $request->format;

        return response()->json([
            'success' => true,
            'message' => 'Operational report export prepared successfully',
            'data' => [
                'filename' => $filename,
                'records_count' => count($exportData),
                'download_url' => url("/api/reports/download/{$filename}"),
                'expires_at' => now()->addHours(24)->toIso8601String()
            ]
        ], 200);
    }

    /**
     * Export customer analytics report to CSV/Excel
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function exportCustomerAnalytics(Request $request): JsonResponse
    {
        $request->validate([
            'format' => 'required|in:csv,excel',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'customer_id' => 'nullable|exists:customers,customer_id'
        ]);

        $exportData = $this->generateCustomerExportData($request);
        $filename = 'customer_analytics_' . now()->format('Y-m-d_H-i-s') . '.' . $request->format;

        return response()->json([
            'success' => true,
            'message' => 'Customer analytics export prepared successfully',
            'data' => [
                'filename' => $filename,
                'records_count' => count($exportData),
                'download_url' => url("/api/reports/download/{$filename}"),
                'expires_at' => now()->addHours(24)->toIso8601String()
            ]
        ], 200);
    }

    /**
     * ============================================
     * HELPER METHODS - Private methods untuk internal use
     * ============================================
     */

    /**
     * Helper method to get single customer analytics
     */
    private function getSingleCustomerAnalytics($customerId, $startDate, $endDate)
    {
        $customer = Customers::where('customer_id', $customerId)->first();
        
        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $analytics = [
            'customer_info' => $customer,
            'period_stats' => [
                'orders_count' => JobOrder::where('customer_id', $customerId)
                    ->whereBetween('created_at', [$startDate, $endDate])->count(),
                'total_revenue' => JobOrder::where('customer_id', $customerId)
                    ->whereBetween('created_at', [$startDate, $endDate])->sum('order_value'),
                'deliveries_count' => DeliveryOrder::where('customer_id', $customerId)
                    ->whereBetween('created_at', [$startDate, $endDate])->count()
            ],
            'order_history' => JobOrder::where('customer_id', $customerId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->orderBy('created_at', 'desc')
                ->get(),
            'payment_history' => Invoices::where('customer_id', $customerId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->orderBy('created_at', 'desc')
                ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $analytics
        ], 200);
    }

    /**
     * Helper methods for calculations
     */
    private function calculateCompletionRate($startDate, $endDate): float
    {
        $totalOrders = JobOrder::whereBetween('created_at', [$startDate, $endDate])->count();
        $completedOrders = JobOrder::where('status', 'Completed')
            ->whereBetween('created_at', [$startDate, $endDate])->count();

        return $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 2) : 0;
    }

    private function calculateCollectionRate($startDate, $endDate): float
    {
        $totalInvoiced = Invoices::whereBetween('created_at', [$startDate, $endDate])->sum('total_amount');
        $totalPaid = Invoices::where('status', 'Paid')
            ->whereBetween('created_at', [$startDate, $endDate])->sum('total_amount');

        return $totalInvoiced > 0 ? round(($totalPaid / $totalInvoiced) * 100, 2) : 0;
    }

    private function getDateFormat($groupBy): string
    {
        return match($groupBy) {
            'day' => 'Y-m-d',
            'week' => 'Y-\WW',
            'month' => 'Y-m',
            'year' => 'Y',
            default => 'Y-m'
        };
    }

    /**
     * Generate export data methods (simplified for demo)
     */
    private function generateSalesExportData($request): array
    {
        return JobOrder::with('customer')
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->get()
            ->toArray();
    }

    private function generateFinancialExportData($request): array
    {
        return Invoices::with('customer')
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->get()
            ->toArray();
    }

    private function generateOperationalExportData($request): array
    {
        return DeliveryOrder::with(['customer', 'driver', 'vehicle'])
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->get()
            ->toArray();
    }

    private function generateCustomerExportData($request): array
    {
        return Customers::with('jobOrders')
            ->whereHas('jobOrders', function($q) use ($request) {
                $q->whereBetween('created_at', [$request->start_date, $request->end_date]);
            })
            ->get()
            ->toArray();
    }
}