<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobOrder;
use App\Models\JobOrderStatusHistory;
use App\Models\Assignment;
use App\Models\Customers;
use App\Models\Drivers;
use App\Models\Vehicles;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;

/**
 * JobOrderController - Controller untuk mengelola Job Order (Pesanan Kerja)
 * 
 * Fungsi utama:
 * - Menampilkan daftar job order dengan pencarian dan filter
 * - Membuat job order baru dengan ID otomatis
 * - Assign driver dan vehicle ke job order
 * - Update status job order dengan history tracking
 * - Menghapus job order
 * - Filter berdasarkan status, customer, priority, dan tanggal
 * - Tracking progress dari pickup sampai delivery
 * - Generate manifest dan assignment
 */
class JobOrderController extends Controller
{
    /**
     * Menampilkan daftar job order dengan fitur pencarian dan filter
     * 
     * Fitur yang tersedia:
     * - Pencarian berdasarkan job order ID, deskripsi barang, alamat pickup/delivery, atau customer
     * - Filter berdasarkan status (created, assigned, pickup, delivery, completed, cancelled)
     * - Filter berdasarkan customer tertentu
     * - Filter berdasarkan prioritas dan tanggal
     * - Include data customer, creator, assignments dengan driver dan vehicle
     * - Pagination dengan default 15 item per halaman
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = JobOrder::with(['customer', 'createdBy', 'assignments.driver', 'assignments.vehicle']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('job_order_id', 'ILIKE', "%{$search}%")
                ->orWhere('goods_desc', 'ILIKE', "%{$search}%")
                ->orWhere('pickup_address', 'ILIKE', "%{$search}%")
                ->orWhere('delivery_address', 'ILIKE', "%{$search}%")
                ->orWhereHas('customer', function($customerQuery) use ($search) {
                    $customerQuery->where('customer_name', 'ILIKE', "%{$search}%");
                });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by customer
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        // Filter by order type
        if ($request->filled('order_type')) {
            $query->where('order_type', $request->order_type);
        }

        // Filter by date range
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('ship_date', [$request->start_date, $request->end_date]);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);

        $jobOrders = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Data Job Orders berhasil diambil',
            'data' => $jobOrders->items(),
            'pagination' => [
                'current_page' => $jobOrders->currentPage(),
                'per_page' => $jobOrders->perPage(),
                'total' => $jobOrders->total(),
                'last_page' => $jobOrders->lastPage()
            ]
        ], 200);
    }

    /**
     * Store a newly created job order
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,customer_id',
            'order_type' => 'required|in:LTL,FTL',
            'pickup_address' => 'required|string',
            'pickup_city' => 'nullable|string',
            'delivery_address' => 'required|string',
            'delivery_city' => 'nullable|string',
            'goods_desc' => 'required|string',
            'goods_weight' => 'required|numeric|min:0',
            'goods_volume' => 'nullable|numeric|min:0',
            'ship_date' => 'required|date',
            'order_value' => 'nullable|numeric|min:0'
        ]);

        // Generate unique job_order_id
        $jobOrderId = 'JO-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        while (JobOrder::where('job_order_id', $jobOrderId)->exists()) {
            $jobOrderId = 'JO-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        }

        // Determine created_by
        $creatorId = Auth::id();
        if (!$creatorId) {
            $admin = Admin::first();
            if ($admin) {
                $creatorId = $admin->user_id;
            } else {
                // Create a default system admin if none exists
                try {
                    $admin = Admin::create([
                        'user_id' => 'ADMIN-SYSTEM',
                        'name' => 'System Administrator',
                        'email' => 'system@sendpick.com',
                        'password' => bcrypt('system123'),
                        'status' => 'active'
                    ]);
                    $creatorId = $admin->user_id;
                } catch (\Exception $e) {
                    $creatorId = 'ADMIN-SYSTEM';
                }
            }
        }

        $jobOrder = JobOrder::create([
            'job_order_id' => $jobOrderId,
            'customer_id' => $request->customer_id,
            'order_type' => $request->order_type,
            'status' => 'Created',
            'pickup_address' => $request->pickup_address,
            'pickup_city' => $request->pickup_city,
            'delivery_address' => $request->delivery_address,
            'delivery_city' => $request->delivery_city,
            'goods_desc' => $request->goods_desc,
            'goods_weight' => $request->goods_weight,
            'goods_volume' => $request->goods_volume,
            'ship_date' => $request->ship_date,
            'order_value' => $request->order_value,
            'created_by' => $creatorId
        ]);

        // Create status history
        $this->createStatusHistory($jobOrder->job_order_id, 'Created', 'Admin', 'Job Order created', 'user');

        return response()->json([
            'success' => true,
            'message' => 'Job Order created successfully',
            'data' => $jobOrder->load(['customer', 'createdBy'])
        ], 201);
    }

    /**
     * Menampilkan ID Job Order yg dipilih
     * 
     * @param string $jobOrderId
     * @return JsonResponse
     */
    public function show(string $jobOrderId): JsonResponse
    {
        $jobOrder = JobOrder::with([
            'customer', 
            'createdBy', 
            'assignments.driver', 
            'assignments.vehicle.vehicleType',
            'statusHistories',
            'proofOfDeliveries',
            'manifests'
        ])->where('job_order_id', $jobOrderId)->first();

        if (!$jobOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Job Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $jobOrder
        ], 200);
    }

    /**
     * Update the specified job order
     * 
     * @param Request $request
     * @param string $jobOrderId
     * @return JsonResponse
     */
    public function update(Request $request, string $jobOrderId): JsonResponse
    {
        $jobOrder = JobOrder::where('job_order_id', $jobOrderId)->first();

        if (!$jobOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Job Order not found'
            ], 404);
        }

    $validated = $request->validate([
            'customer_id' => 'sometimes|exists:customers,customer_id',
            'order_type' => 'sometimes|in:LTL,FTL',
            'pickup_address' => 'sometimes|string|max:500',
            'pickup_city' => 'nullable|string',
            'delivery_address' => 'sometimes|string|max:500',
            'delivery_city' => 'nullable|string',
            'goods_desc' => 'sometimes|string',
            'goods_weight' => 'sometimes|numeric|min:0',
            'goods_volume' => 'nullable|numeric|min:0',
            'ship_date' => 'sometimes|date|after_or_equal:today',
            'order_value' => 'sometimes|nullable|numeric|min:0',
            'status' => 'sometimes|string'
        ]);

        $oldStatus = $jobOrder->status;

        $jobOrder->update($validated);

        // Check if status changed to Completed
        if (isset($validated['status']) && $validated['status'] === 'Completed' && $oldStatus !== 'Completed') {
            // Find active assignment
            $activeAssignment = $jobOrder->assignments()->where('status', 'Active')->first();
            
            if ($activeAssignment && $activeAssignment->driver) {
                $activeAssignment->driver->increment('delivery_count');
            }
        }

        // Check for changes in other fields (Audit Trail)
        $changes = [];
        $fieldsToCheck = [
            'pickup_address', 'delivery_address', 'goods_desc', 'goods_weight', 
            'goods_volume', 'ship_date', 'order_value', 'order_type'
        ];

        foreach ($fieldsToCheck as $field) {
            if (isset($validated[$field]) && $jobOrder->$field != $validated[$field]) {
                $fieldName = ucwords(str_replace('_', ' ', $field));
                $changes[] = "{$fieldName}";
            }
        }

        $user = Auth::user();
        $changedBy = $user ? ($user->name ?? $user->email ?? 'Admin') : 'Admin';

        // Create status history if status changed
        if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
            $notes = "Status updated from {$oldStatus} to {$validated['status']}";
            
            $this->createStatusHistory(
                $jobOrder->job_order_id, 
                $validated['status'], 
                $changedBy,
                $notes,
                'user'
            );
        } 
        // Create history if other details changed but status didn't
        elseif (!empty($changes)) {
            $changesStr = implode(', ', $changes);
            $notes = "Order details updated by {$changedBy}. Changed: {$changesStr}.";
            
            // Use 'Order Updated' as a special status label for the history
            $this->createStatusHistory(
                $jobOrder->job_order_id, 
                'Order Updated', 
                $changedBy,
                $notes,
                'user'
            );
        }

        $jobOrder->load(['customer', 'createdBy']);

        return response()->json([
            'success' => true,
            'message' => 'Job Order updated successfully',
            'data' => [
                'job_order_id' => $jobOrder->job_order_id,
                'customer_id' => $jobOrder->customer_id,
                'customer_name' => $jobOrder->customer->customer_name ?? null,
                'customer_code' => $jobOrder->customer->customer_code ?? null,
                'order_type' => $jobOrder->order_type,
                'status' => $jobOrder->status,
                'pickup_address' => $jobOrder->pickup_address,
                'delivery_address' => $jobOrder->delivery_address,
                'goods_desc' => $jobOrder->goods_desc,
                'goods_weight' => $jobOrder->goods_weight,
                'ship_date' => $jobOrder->ship_date,
                'order_value' => $jobOrder->order_value,
                'created_by' => $jobOrder->created_by,
                'completed_at' => $jobOrder->completed_at,
                'created_at' => $jobOrder->created_at,
                'updated_at' => $jobOrder->updated_at,
            ]
        ], 200);
    }

    /**
     * Menghapus job order yg dipilih
     * 
     * @param string $jobOrderId
     * @return JsonResponse
     */
    public function destroy(string $jobOrderId): JsonResponse
    {
        $jobOrder = JobOrder::where('job_order_id', $jobOrderId)->first();

        if (!$jobOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Job Order not found'
            ], 404);
        }

        // Check if job order has active assignments
        $hasActiveAssignments = $jobOrder->assignments()->where('status', 'Active')->exists();

        if ($hasActiveAssignments) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete Job Order. It has active assignments.'
            ], 422);
        }

        $jobOrder->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job Order deleted successfully'
        ], 200);
    }

    /**
     * Store assignment driver and vehicle to job order
     * 
     * @param Request $request
     * @param string $jobOrderId
     * @return JsonResponse
     */
    public function storeAssignment(Request $request, string $jobOrderId): JsonResponse
    {
        try {
            $jobOrder = JobOrder::where('job_order_id', $jobOrderId)->first();

            if (!$jobOrder) {
                return response()->json([
                    'success' => false,
                    'message' => 'Job Order not found'
                ], 404);
            }

            // ✅ Validation
        $validated = $request->validate([
            'driver_id' => 'required|exists:drivers,driver_id',
            'vehicle_id' => 'required|exists:vehicles,vehicle_id',
            'status' => 'required|in:Active,Standby',
            'notes' => 'nullable|string|max:500'
        ]);

        // ✅ Check if driver is available
        $driverBusy = Assignment::where('driver_id', $request->driver_id)
            ->where('status', 'Active')
            ->whereHas('jobOrder', function($query) use ($jobOrderId) {
                $query->where('job_order_id', '!=', $jobOrderId)
                ->whereNotIn('status', ['Completed', 'Cancelled']);
            })
            ->first();

            if ($driverBusy) {
            return response()->json([
                'success' => false,
                'message' => 'Driver is currently assigned to another active job order',
                'errors' => [
                    'driver_id' => ['Driver is currently assigned to another active job order (' . $driverBusy->job_order_id . ')']
                ],
                'assigned_to' => $driverBusy->job_order_id
            ], 422);
        }

        // ✅ Check if vehicle is available
        $vehicleBusy = Assignment::where('vehicle_id', $request->vehicle_id)
            ->where('status', 'Active')
            ->whereHas('jobOrder', function($query) use ($jobOrderId) {
                $query->where('job_order_id', '!=', $jobOrderId)
                ->whereNotIn('status', ['Completed', 'Cancelled']);
            })
            ->exists();

        if ($vehicleBusy) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle is currently assigned to another active job order',
                'errors' => [
                    'vehicle_id' => ['Vehicle is currently assigned to another active job order']
                ]
            ], 422);
        }

        // ✅ 1. Cancel existing active assignments for this job order (History Logic)
        Assignment::where('job_order_id', $jobOrderId)
            ->where('status', 'Active')
            ->update(['status' => 'Cancelled']);

        // ✅ 2. Create new assignment
        $assignment = Assignment::create([
            'job_order_id' => $jobOrderId,
            'driver_id' => $request->driver_id,
            'vehicle_id' => $request->vehicle_id,
            'status' => 'Active', // Always Active for new assignment
            'notes' => $request->notes,
            'assigned_at' => now(),
            'assigned_by' => Auth::id() ?? 'SYSTEM' // Ideally should be logged in user
        ]);

        // ✅ 3. Update job order status (Side Effect)
        $jobOrder->update(['status' => 'Assigned']);
        
        // Record status history
        $driverName = $assignment->driver->driver_name ?? 'Driver';
        $vehiclePlate = $assignment->vehicle->license_plate ?? '-';
        $notes = "Order assigned to driver {$driverName} - Vehicle {$vehiclePlate}";
        
        $this->createStatusHistory($jobOrderId, 'Assigned', 'Admin', $notes, 'user');

        // ✅ Load relations
        $assignment->load(['driver', 'vehicle.vehicleType']);

        return response()->json([
            'success' => true,
            'message' => 'Assignment created successfully',
            'data' => [
                'assignment_id' => $assignment->assignment_id, // Use correct primary key
                'job_order_id' => $jobOrderId,
                'status' => 'Active',
                'driver' => [
                    'driver_id' => $assignment->driver->driver_id,
                    'driver_name' => $assignment->driver->driver_name,
                    'phone' => $assignment->driver->phone ?? null,
                    'license_number' => $assignment->driver->license_number ?? null,
                ],
                'vehicle' => [
                    'vehicle_id' => $assignment->vehicle->vehicle_id,
                    'license_plate' => $assignment->vehicle->license_plate,
                    'vehicle_type' => $assignment->vehicle->vehicleType->type_name ?? null,
                    'capacity' => $assignment->vehicle->capacity ?? null,
                ],
                'assigned_at' => $assignment->assigned_at,
                'assigned_by' => $assignment->assigned_by ?? 'SYSTEM',
                'notes' => $assignment->notes,
            ]
        ], 201);
        
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the assignment',
                'error' => $e->getMessage()
            ], 500);
        }
        
    }

    /**
     * Get job order assignments
     * 
     * @param string $jobOrderId
     * @return JsonResponse
     */
    public function getAssignments(string $jobOrderId): JsonResponse
    {
        $assignments = Assignment::with(['driver', 'vehicle.vehicleType'])
            ->where('job_order_id', $jobOrderId)
            ->orderBy('assigned_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $assignments
        ], 200);
    }

    /**
     * Create status history record
     * 
     * @param string $jobOrderId
     * @param string $status
     * @param string $changedBy
     * @return void
     */
    private function createStatusHistory(string $jobOrderId, string $status, string $changedBy, ?string $notes = null, string $triggerType = 'user'): void
    {
        JobOrderStatusHistory::create([
            'job_order_id' => $jobOrderId,
            'status' => $status,
            'changed_by' => $changedBy,
            'notes' => $notes,
            'trigger_type' => $triggerType,
            'changed_at' => now()
        ]);
    }
}