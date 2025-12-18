<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryOrder;
use App\Models\JobOrder;
use App\Models\Manifests;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * DeliveryOrderController - Controller untuk mengelola Delivery Order (DO)
 * 
 * Fungsi utama:
 * - Menampilkan daftar delivery order dengan pencarian dan filter
 * - Membuat delivery order baru dengan nomor otomatis
 * - Melihat detail delivery order dan relasi job orders
 * - Mengupdate status dan data delivery order
 * - Menghapus delivery order
 * - Filter berdasarkan status, customer, dan tipe sumber
 * - Tracking dan monitoring delivery progress
 */
class DeliveryOrderController extends Controller
{
    /**
     * Menampilkan daftar delivery order dengan fitur pencarian dan filter
     * 
     * Fitur yang tersedia:
     * - Pencarian berdasarkan DO ID, source ID, ringkasan barang, atau nama customer
     * - Filter berdasarkan status delivery (pending, in_progress, delivered, dll)
     * - Filter berdasarkan customer tertentu
     * - Filter berdasarkan tipe sumber (manual, import, system)
     * - Pagination dengan default 15 item per halaman
     * - Include data customer dan creator
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = DeliveryOrder::with(['customer', 'createdBy']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('do_id', 'ILIKE', "%{$search}%")
                ->orWhere('source_id', 'ILIKE', "%{$search}%")
                ->orWhere('goods_summary', 'ILIKE', "%{$search}%")
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

        // Filter by source type
        if ($request->filled('source_type')) {
            $query->where('source_type', $request->source_type);
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by date range
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('do_date', [$request->start_date, $request->end_date]);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $deliveryOrders = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Add source information to each delivery order
        $deliveryOrders->getCollection()->transform(function ($deliveryOrder) {
            $deliveryOrder->source_info = $deliveryOrder->getSourceAttribute();
            return $deliveryOrder;
        });

        return response()->json([
            'success' => true,
            'data' => $deliveryOrders->items(),
            'pagination' => [
                'current_page' => $deliveryOrders->currentPage(),
                'per_page' => $deliveryOrders->perPage(),
                'total' => $deliveryOrders->total(),
                'last_page' => $deliveryOrders->lastPage()
            ]
        ], 200);
    }

    /**
     * Store a newly created delivery order
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'source_type' => 'required|in:JO,MF',
            'source_id' => 'required|string',
            'customer_id' => 'nullable|exists:customers,customer_id',
            'do_date' => 'required|date',
            'departure_date' => 'nullable|date',
            'eta' => 'nullable|date',
            'goods_summary' => 'nullable|string',
            'priority' => 'nullable|in:Low,Medium,High,Urgent',
            'temperature' => 'nullable|string|max:50'
        ]);

        $customerId = $request->customer_id;
        $goodsSummary = $request->goods_summary;

        // Validate source exists and fetch data
        if ($request->source_type === 'JO') {
            $source = JobOrder::where('job_order_id', $request->source_id)->first();
            if (!$source) {
                return response()->json([
                    'success' => false,
                    'message' => 'Job Order tidak ditemukan'
                ], 404);
            }
            
            // Auto-fill if not provided
            if (!$customerId) $customerId = $source->customer_id;
            if (!$goodsSummary) $goodsSummary = $source->goods_desc;

        } elseif ($request->source_type === 'MF') {
            $source = Manifests::with('jobOrders.customer')->where('manifest_id', $request->source_id)->first();
            if (!$source) {
                return response()->json([
                    'success' => false,
                    'message' => 'Manifest tidak ditemukan'
                ], 404);
            }

            // ✅ NEW: Check if specific Job Order is selected (LTL scenario)
            if ($request->filled('selected_job_order_id')) {
                // Find the specific job order from the manifest
                $selectedJobOrder = $source->jobOrders->firstWhere('job_order_id', $request->selected_job_order_id);
                
                if (!$selectedJobOrder) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Job Order yang dipilih tidak ada dalam Manifest ini'
                    ], 422);
                }

                // Use data from the selected job order
                if (!$customerId) $customerId = $selectedJobOrder->customer_id;
                if (!$goodsSummary) $goodsSummary = $selectedJobOrder->goods_desc;

                \Log::info('[DeliveryOrder] Created from Manifest with specific Job Order', [
                    'manifest_id' => $request->source_id,
                    'selected_job_order_id' => $request->selected_job_order_id,
                    'customer_id' => $customerId,
                    'goods_summary' => $goodsSummary
                ]);
            } else {
                // Fallback: Use first job order (legacy behavior)
                if (!$goodsSummary) $goodsSummary = $source->cargo_summary;
                
                if (!$customerId) {
                    $firstJob = $source->jobOrders->first();
                    if ($firstJob) {
                        $customerId = $firstJob->customer_id;
                    }
                }
            }
        }

        // Final validation for required fields
        if (!$customerId) {
             return response()->json([
                'success' => false,
                'message' => 'Customer ID tidak dapat ditemukan dari sumber data. Mohon input manual.'
            ], 422);
        }
        
        if (!$goodsSummary) {
             return response()->json([
                'success' => false,
                'message' => 'Ringkasan barang tidak dapat ditemukan dari sumber data. Mohon input manual.'
            ], 422);
        }

        // Generate kode unik do_id
        $doId = 'DO-' . date('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(6));
        while (DeliveryOrder::where('do_id', $doId)->exists()) {
            $doId = 'DO-' . date('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(6));
        }

        // Buat delivery order baru ke database
        $deliveryOrder = DeliveryOrder::create([
            'do_id' => $doId,
            'source_type' => $request->source_type,
            'source_id' => $request->source_id,
            'selected_job_order_id' => $request->selected_job_order_id, // ✅ NEW: For LTL
            'customer_id' => $customerId,
            'status' => 'Pending',
            'do_date' => $request->do_date,
            'departure_date' => $request->departure_date,
            'eta' => $request->eta,
            'goods_summary' => $goodsSummary,
            'temperature' => $request->temperature,
            'created_by' => Auth::id() ?? \App\Models\Admin::first()->user_id
        ]);

        // Menambah informasi sumber ke delivery order untuk response
        $deliveryOrder->source_info = $deliveryOrder->getSourceAttribute();

        return response()->json([
            'success' => true,
            'message' => 'Delivery Order created successfully',
            'data' => $deliveryOrder->load(['customer', 'createdBy'])
        ], 201);
    }

    /**
     * Display the specified delivery order
     * 
     * @param string $doId
     * @return JsonResponse
     */
    public function show(string $doId): JsonResponse
    {
        $deliveryOrder = DeliveryOrder::with(['customer', 'createdBy'])
            ->where('do_id', $doId)
            ->first();

        if (!$deliveryOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Delivery Order not found'
            ], 404);
        }

        // Menambah informasi sumber ke delivery order
        $deliveryOrder->source_info = $deliveryOrder->getSourceAttribute();

        return response()->json([
            'success' => true,
            'data' => $deliveryOrder
        ], 200);
    }

    /**
     * Update the specified delivery order
     * 
     * @param Request $request
     * @param string $doId
     * @return JsonResponse
     */
    public function update(Request $request, string $doId): JsonResponse
    {
        $deliveryOrder = DeliveryOrder::where('do_id', $doId)->first();

        if (!$deliveryOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Delivery Order tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'customer_id' => 'required|exists:customers,customer_id',
            'do_date' => 'required|date',
            'departure_date' => 'nullable|date',
            'eta' => 'nullable|date',
            'goods_summary' => 'required|string',
            'priority' => 'nullable|in:Low,Medium,High,Urgent',
            'temperature' => 'nullable|string|max:50',
            'status' => 'in:Pending,In Transit,Delivered,Returned,Completed,Cancelled',
            'driver_id' => 'nullable|exists:drivers,driver_id',
            'vehicle_id' => 'nullable|exists:vehicles,vehicle_id'
        ]);

        // Jika datanya berhasil divalidasi, update delivery order
        $deliveryOrder->update($request->only([
            'customer_id',
            'do_date',
            'departure_date',
            'eta',
            'goods_summary',
            'priority',
            'temperature',
            'status'
        ]));

        // Handle Driver & Vehicle Assignment
        if ($request->has('driver_id') || $request->has('vehicle_id')) {
            $driverId = $request->driver_id;
            $vehicleId = $request->vehicle_id;

            if ($deliveryOrder->source_type === 'JO') {
                // Update or Create Assignment for Job Order
                $jobOrder = JobOrder::where('job_order_id', $deliveryOrder->source_id)->first();
                if ($jobOrder) {
                    // Find active assignment
                    $assignment = \App\Models\Assignment::where('job_order_id', $jobOrder->job_order_id)
                        ->where('status', 'Active')
                        ->first();

                    if ($assignment) {
                        // Update existing assignment
                        $assignment->update([
                            'driver_id' => $driverId ?? $assignment->driver_id,
                            'vehicle_id' => $vehicleId ?? $assignment->vehicle_id,
                            'assigned_at' => now()
                        ]);
                    } else {
                        // Create new assignment if we have both driver and vehicle (or at least one if allowed)
                        if ($driverId && $vehicleId) {
                            \App\Models\Assignment::create([
                                'job_order_id' => $jobOrder->job_order_id,
                                'driver_id' => $driverId,
                                'vehicle_id' => $vehicleId,
                                'status' => 'Active',
                                'assigned_at' => now(),
                                'notes' => 'Assigned via Delivery Order Edit'
                            ]);
                            
                            // Keep status as-is (no auto-upgrade to Assigned)
                        }
                    }
                }
            } elseif ($deliveryOrder->source_type === 'MF') {
                // Update Manifest directly
                $manifest = Manifests::where('manifest_id', $deliveryOrder->source_id)->first();
                if ($manifest) {
                    $manifest->update([
                        'driver_id' => $driverId ?? $manifest->driver_id,
                        'vehicle_id' => $vehicleId ?? $manifest->vehicle_id
                    ]);
                    // Keep status as-is (no auto-upgrade to Assigned)
                }
            }
        }

        // If status is delivered, set delivered_date
        if ($request->status === 'Delivered' && !$deliveryOrder->delivered_date) {
            $deliveryOrder->update(['delivered_date' => now()->toDateString()]);
        }

        // Menambah informasi sumber ke delivery order untuk response
        $deliveryOrder->source_info = $deliveryOrder->getSourceAttribute();

        return response()->json([
            'success' => true,
            'message' => 'Delivery Order berhasil diupdate',
            'data' => $deliveryOrder->load(['customer', 'createdBy'])
        ], 200);
    }

    /**
     * Menghapus delivery order yang ditentukan dari database berdasarkan do_id
     * 
     * @param string $doId
     * @return JsonResponse
     */
    public function destroy(string $doId): JsonResponse
    {
        $deliveryOrder = DeliveryOrder::where('do_id', $doId)->first();

        if (!$deliveryOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Delivery Order tidak ditemukan'
            ], 404);
        }

        // Check if delivery order is already in progress
        if (in_array($deliveryOrder->status, ['In Transit', 'Delivered'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete delivery order that is in transit or delivered'
            ], 422);
        }

        // Menghapus data delivery order dari database
        $deliveryOrder->delete();

        return response()->json([
            'success' => true,
            'message' => 'Delivery Order berhasil dihapus'
        ], 200);
    }

    /**
     * Menugaskan driver ke delivery order tertentu
     * 
     * @param Request $request
     * @param string $doId
     * @return JsonResponse
     */
    public function assignDriverToDO(Request $request, string $doId): JsonResponse
    {
        $deliveryOrder = DeliveryOrder::where('do_id', $doId)->first();

        if (!$deliveryOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Delivery Order not found'
            ], 404);
        }

        $request->validate([
            'driver_id' => 'required|exists:drivers,driver_id',
            'vehicle_id' => 'required|exists:vehicles,vehicle_id',
            'notes' => 'nullable|string'
        ]);

        $driverId = $request->driver_id;
        $vehicleId = $request->vehicle_id;
        $notes = $request->notes;

        // Perform Assignment Logic based on source type
        if ($deliveryOrder->source_type === 'JO') {
            $jobOrder = JobOrder::where('job_order_id', $deliveryOrder->source_id)->first();
            if ($jobOrder) {
                // Deactivate previous active assignments
                \App\Models\Assignment::where('job_order_id', $jobOrder->job_order_id)
                    ->where('status', 'Active')
                    ->update(['status' => 'Inactive']);

                // Create new assignment
                \App\Models\Assignment::create([
                    'job_order_id' => $jobOrder->job_order_id,
                    'driver_id' => $driverId,
                    'vehicle_id' => $vehicleId,
                    'status' => 'Active',
                    'assigned_at' => now(),
                    'notes' => $notes ?? 'Assigned via DO Assignment'
                ]);
            }
        } elseif ($deliveryOrder->source_type === 'MF') {
             $manifest = Manifests::where('manifest_id', $deliveryOrder->source_id)->first();
             if ($manifest) {
                 $manifest->update([
                     'driver_id' => $driverId,
                     'vehicle_id' => $vehicleId
                 ]);
             }
        }

        // Status remains as-is (Pending) - will be updated when driver starts delivery via app

        return response()->json([
            'success' => true,
            'message' => 'Driver assigned to Delivery Order successfully',
            'data' => [
                'do_id' => $deliveryOrder->do_id,
                'driver_id' => $driverId,
                'vehicle_id' => $vehicleId,
                'status' => $deliveryOrder->status,
                'assigned_at' => now()
            ]
        ], 200);
    }

    /**
     * Complete delivery order setelah validasi POD oleh Admin
     * Mengubah status dari 'Delivered' menjadi 'Completed'
     * DO yang sudah completed siap untuk ditagih di modul Invoice
     * 
     * @param string $doId
     * @return JsonResponse
     */
    public function completeDeliveryOrder(string $doId): JsonResponse
    {
        // Cari delivery order berdasarkan do_id
        $deliveryOrder = DeliveryOrder::where('do_id', $doId)->first();

        if (!$deliveryOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Delivery Order tidak ditemukan'
            ], 404);
        }

        // Validasi status harus 'Delivered' sebelum bisa di-complete
        if ($deliveryOrder->status !== 'Delivered') {
            return response()->json([
                'success' => false,
                'message' => 'Delivery Order harus berstatus "Delivered" sebelum dapat di-complete. Status saat ini masih ' . $deliveryOrder->status
            ], 422);
        }

        // Check apakah sudah ada POD (Proof of Delivery)
        // Asumsi: DO harus memiliki POD sebelum bisa completed
        $hasPOD = DB::table('proof_of_deliveries')
            ->where('do_id', $doId)
            ->exists();

        if (!$hasPOD) {
            return response()->json([
                'success' => false,
                'message' => 'Delivery Order belum memiliki Proof of Delivery (POD). POD harus ada sebelum DO dapat di-complete.'
            ], 422);
        }

        // Update status menjadi 'Completed'
        $deliveryOrder->update([
            'status' => 'Completed',
            'completed_date' => now()->toDateString(),
            'completed_by' => Auth::id() ?? \App\Models\Admin::first()->user_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Delivery Order berhasil di-complete dan siap untuk ditagih',
            'data' => [
                'do_id' => $deliveryOrder->do_id,
                'status' => $deliveryOrder->status,
                'delivered_date' => $deliveryOrder->delivered_date,
                'completed_date' => $deliveryOrder->completed_date,
                'completed_by' => $deliveryOrder->completed_by,
                'completed_at' => now()
            ]
        ], 200);
    }

    /**
     * Cancel delivery order
     * Mengubah status menjadi 'Cancelled'
     * 
     * @param string $doId
     * @return JsonResponse
     */
    public function cancel(string $doId): JsonResponse
    {
        $deliveryOrder = DeliveryOrder::where('do_id', $doId)->first();

        if (!$deliveryOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Delivery Order tidak ditemukan'
            ], 404);
        }

        if ($deliveryOrder->status === 'Cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Delivery Order sudah dibatalkan'
            ], 422);
        }

        // Update status menjadi 'Cancelled'
        $deliveryOrder->update(['status' => 'Cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Delivery Order berhasil dibatalkan',
            'data' => $deliveryOrder
        ], 200);
    }
}