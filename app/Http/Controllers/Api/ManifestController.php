<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Manifests;
use App\Models\JobOrder;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

/**
 * ManifestController - Controller untuk mengelola Manifest Pengiriman
 * 
 * Fungsi utama:
 * - Menampilkan daftar manifest dengan pencarian dan filter
 * - Membuat manifest baru dengan ID otomatis
 * - Menambahkan job orders ke dalam manifest
 * - Update status manifest (draft, finalized, in_transit, completed)
 * - Generate laporan manifest untuk driver
 * - Filter berdasarkan kota asal dan tujuan
 * - Tracking progress manifest dan cargo summary
 */
class ManifestController extends Controller
{
    /**
     * Menampilkan daftar manifest dengan fitur pencarian dan filter
     * 
     * Fitur yang tersedia:
     * - Pencarian berdasarkan manifest ID, kota asal, kota tujuan, atau ringkasan cargo
     * - Filter berdasarkan status manifest (draft, finalized, in_transit, completed)
     * - Filter berdasarkan kota asal dan kota tujuan
     * - Include data creator dan job orders dengan customer
     * - Pagination dengan default 15 item per halaman
     * - Sorting berdasarkan tanggal pembuatan terbaru
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Manifests::with(['createdBy', 'jobOrders.customer', 'jobOrders.assignments.driver', 'jobOrders.assignments.vehicle', 'drivers', 'vehicles']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('manifest_id', 'ILIKE', "%{$search}%")
                ->orWhere('origin_city', 'ILIKE', "%{$search}%")
                ->orWhere('dest_city', 'ILIKE', "%{$search}%")
                ->orWhere('cargo_summary', 'ILIKE', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by origin city
        if ($request->filled('origin_city')) {
            $query->where('origin_city', 'ILIKE', "%{$request->origin_city}%");
        }

        // Filter by destination city
        if ($request->filled('dest_city')) {
            $query->where('dest_city', 'ILIKE', "%{$request->dest_city}%");
        }

        // Filter by date range
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('planned_departure', [$request->start_date, $request->end_date]);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $manifests = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $manifests->items(),
            'pagination' => [
                'current_page' => $manifests->currentPage(),
                'per_page' => $manifests->perPage(),
                'total' => $manifests->total(),
                'last_page' => $manifests->lastPage()
            ]
        ], 200);
    }

    /**
     * Store a newly created manifest
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {

        $request->validate([
            'origin_city' => 'required|string|max:255',
            'dest_city' => 'required|string|max:255',
            'cargo_summary' => 'nullable|string',
            'cargo_weight' => 'nullable|numeric|min:0',
            'planned_departure' => 'nullable|date',
            'planned_arrival' => 'nullable|date|after:planned_departure',
            'job_order_ids' => 'nullable|array',
            'job_order_ids.*' => 'exists:job_orders,job_order_id',
            'driver_id' => 'nullable|exists:drivers,driver_id',
            'vehicle_id' => 'nullable|exists:vehicles,vehicle_id',
        ]);

        // Generate unique manifest_id
        $manifestId = 'MF-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        while (Manifests::where('manifest_id', $manifestId)->exists()) {
            $manifestId = 'MF-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        }

        $manifest = Manifests::create([
            'manifest_id' => $manifestId,
            'origin_city' => $request->origin_city,
            'dest_city' => $request->dest_city,
            'cargo_summary' => $request->cargo_summary,
            'cargo_weight' => $request->cargo_weight,
            'planned_departure' => $request->planned_departure,
            'planned_arrival' => $request->planned_arrival,
            'driver_id' => $request->driver_id,
            'vehicle_id' => $request->vehicle_id,
            'status' => 'Pending',
            'created_by' => Auth::id() ?? Admin::first()->user_id ?? '1'
        ]);

        // Attach job orders if provided
        // NOTE: Job Order status is NOT changed here - it remains as-is (e.g., 'Assigned')
        // The Job Order status is managed separately by the Assignment process
        $jobOrderIds = $request->job_order_ids ?? [];
        
        if (!empty($jobOrderIds) && is_array($jobOrderIds)) {
            $manifest->jobOrders()->attach($jobOrderIds);
            
            \Log::info("Manifest {$manifest->manifest_id} created with " . count($jobOrderIds) . " job orders. Job Order statuses NOT changed (remain as-is).");
                
            // Update cargo summary based on attached job orders
            $this->updateManifestCargo($manifest);
        } else {
            \Log::warning("Manifest {$manifest->manifest_id} created WITHOUT job orders. job_order_ids was: " . json_encode($jobOrderIds));
        }

        return response()->json([
            'success' => true,
            'message' => 'Manifest created successfully',
            'data' => $manifest->refresh()->load(['createdBy', 'jobOrders.customer', 'drivers', 'vehicles'])
        ], 201);
    }

    /**
     * Display the specified manifest
     * 
     * @param string $manifestId
     * @return JsonResponse
     */
    public function show(string $manifestId): JsonResponse
    {
        $manifest = Manifests::with([
            'createdBy', 
            'jobOrders.customer',
            'jobOrders.assignments.driver',
            'jobOrders.assignments.vehicle',
            'drivers',
            'vehicles'
        ])->where('manifest_id', $manifestId)->first();

        if (!$manifest) {
            return response()->json([
                'success' => false,
                'message' => 'Manifest not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $manifest
        ], 200);
    }

    /**
     * Update the specified manifest
     * 
     * @param Request $request
     * @param string $manifestId
     * @return JsonResponse
     */
    public function update(Request $request, string $manifestId): JsonResponse
    {
        $manifest = Manifests::where('manifest_id', $manifestId)->first();

        if (!$manifest) {
            return response()->json([
                'success' => false,
                'message' => 'Manifest tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'origin_city' => 'required|string|max:255',
            'dest_city' => 'required|string|max:255',
            'cargo_summary' => 'nullable|string',
            'cargo_weight' => 'nullable|numeric|min:0',
            'planned_departure' => 'nullable|date',
            'planned_arrival' => 'nullable|date|after:planned_departure',
            'status' => 'in:Pending,In Transit,Arrived,Completed',
            'job_order_ids' => 'nullable|array',
            'job_order_ids.*' => 'exists:job_orders,job_order_id',
            'driver_id' => 'nullable|exists:drivers,driver_id',
            'vehicle_id' => 'nullable|exists:vehicles,vehicle_id',
        ]);

        $manifest->update($request->only([
            'origin_city',
            'dest_city',
            'cargo_summary',
            'cargo_weight',
            'planned_departure',
            'planned_arrival',
            'status',
            'driver_id',
            'vehicle_id'
        ]));

        // Sync Job Orders if provided
        // NOTE: Job Order status is NOT changed here - it remains as-is
        // The Job Order status is managed separately by the Assignment process
        if ($request->has('job_order_ids')) {
            $jobOrderIds = $request->job_order_ids ?? [];
            
            // Sync returns array of attached, detached, updated IDs
            $syncResult = $manifest->jobOrders()->sync($jobOrderIds);
            
            if (!empty($syncResult['attached'])) {
                \Log::info("Manifest {$manifest->manifest_id} update: Attached " . count($syncResult['attached']) . " job orders. Statuses NOT changed.");
            }
            
            if (!empty($syncResult['detached'])) {
                \Log::info("Manifest {$manifest->manifest_id} update: Detached " . count($syncResult['detached']) . " job orders. Statuses NOT changed.");
            }
            
            // Update cargo summary based on current job orders
            $this->updateManifestCargo($manifest);
        }

        return response()->json([
            'success' => true,
            'message' => 'Manifest updated successfully',
            'data' => $manifest->refresh()->load(['createdBy', 'jobOrders.customer', 'drivers', 'vehicles'])
        ], 200);
    }

    /**
     * Update only the status of the specified manifest
     * Used for status transitions like Pending -> In Transit, In Transit -> Arrived, etc.
     * 
     * @param Request $request
     * @param string $manifestId
     * @return JsonResponse
     */
    public function updateStatus(Request $request, string $manifestId): JsonResponse
    {
        $manifest = Manifests::where('manifest_id', $manifestId)->first();

        if (!$manifest) {
            return response()->json([
                'success' => false,
                'message' => 'Manifest tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:Pending,In Transit,Arrived,Completed'
        ]);

        $oldStatus = $manifest->status;
        $newStatus = $request->status;

        // Validate status transitions
        $validTransitions = [
            'Pending' => ['In Transit', 'Cancelled'],
            'In Transit' => ['Arrived', 'Cancelled'],
            'Arrived' => ['Completed', 'Cancelled'],
            'Completed' => [], // Cannot transition from Completed
            'Cancelled' => [], // Cannot transition from Cancelled
        ];

        if (!in_array($newStatus, $validTransitions[$oldStatus] ?? [])) {
            return response()->json([
                'success' => false,
                'message' => "Tidak dapat mengubah status dari {$oldStatus} ke {$newStatus}"
            ], 422);
        }

        // Update status
        $updateData = ['status' => $newStatus];

        // Add timestamp fields based on status
        if ($newStatus === 'In Transit') {
            $updateData['departed_at'] = now();
        } elseif ($newStatus === 'Arrived') {
            $updateData['arrived_at'] = now();
        } elseif ($newStatus === 'Completed') {
            $updateData['completed_at'] = now();
        }

        $manifest->update($updateData);

        // Update Job Order statuses based on manifest status
        $jobOrderIds = $manifest->jobOrders()->pluck('job_orders.job_order_id')->toArray();
        
        if (!empty($jobOrderIds)) {
            $jobOrderStatus = match($newStatus) {
                'In Transit' => 'On Delivery',
                'Arrived' => 'Arrived',
                'Completed' => 'Completed',
                default => 'In Manifest'
            };
            
            JobOrder::whereIn('job_order_id', $jobOrderIds)
                ->update(['status' => $jobOrderStatus]);
        }

        return response()->json([
            'success' => true,
            'message' => "Status manifest berhasil diubah dari {$oldStatus} ke {$newStatus}",
            'data' => $manifest->refresh()->load(['createdBy', 'jobOrders.customer', 'drivers', 'vehicles'])
        ], 200);
    }

    /**
     * Remove the specified manifest
     * 
     * @param string $manifestId
     * @return JsonResponse
     */
    public function destroy(string $manifestId): JsonResponse
    {
        $manifest = Manifests::where('manifest_id', $manifestId)->first();

        if (!$manifest) {
            return response()->json([
                'success' => false,
                'message' => 'Manifest not found'
            ], 404);
        }

        // Check if manifest has job orders
        $hasJobOrders = $manifest->jobOrders()->exists();

        if ($hasJobOrders) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete manifest. It has associated job orders.'
            ], 422);
        }

        $manifest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Manifest deleted successfully'
        ], 200);
    }

    /**
     * Add job orders to manifest
     * 
     * @param Request $request
     * @param string $manifestId
     * @return JsonResponse
     */
    public function addJobOrders(Request $request, string $manifestId): JsonResponse
    {
        try {
            $manifest = Manifests::where('manifest_id', $manifestId)->first();

            if (!$manifest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Manifest not found'
                ], 404);
            }

            $request->validate([
                'job_order_ids' => 'required|array|min:1',
                'job_order_ids.*' => 'exists:job_orders,job_order_id'
            ]);

            // Check if job orders are already in another manifest
            $alreadyInManifest = DB::table('manifest_jobs')
                ->whereIn('job_order_id', $request->job_order_ids)
                ->where('manifest_id', '!=', $manifestId)
                ->pluck('job_order_id')
                ->toArray();

            if (count($alreadyInManifest) > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Some job orders are already assigned to another manifest',
                    'already_assigned' => $alreadyInManifest
                ], 422);
            }

            // Attach job orders (syncWithoutDetaching untuk tidak hapus yang sudah ada)
            // NOTE: Job Order status is NOT changed - remains as-is (e.g., 'Assigned')
            $manifest->jobOrders()->syncWithoutDetaching($request->job_order_ids);

            // Update cargo summary and weight
            $this->updateManifestCargo($manifest);

            // Reload manifest with job orders
            $manifest->load(['jobOrders.customer']);

            return response()->json([
                'success' => true,
                'message' => count($request->job_order_ids) . ' job order(s) added to manifest successfully',
                'data' => [
                    'manifest_id' => $manifestId,
                    'total_job_orders' => $manifest->jobOrders->count(),
                    'total_weight' => $manifest->cargo_weight,
                    'job_orders' => $manifest->jobOrders->map(function($jo) {
                        return [
                            'job_order_id' => $jo->job_order_id,
                            'customer_name' => $jo->customer->customer_name ?? null,
                            'goods_weight' => $jo->goods_weight,
                            'order_value' => $jo->order_value,
                        ];
                    })
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add job orders to manifest',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove job orders from manifest
     * 
     * @param Request $request
     * @param string $manifestId
     * @return JsonResponse
     */
    public function removeJobOrders(Request $request, string $manifestId): JsonResponse
    {
        try {
            $manifest = Manifests::where('manifest_id', $manifestId)->first();

            if (!$manifest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Manifest not found'
                ], 404);
            }

            $request->validate([
                'job_order_ids' => 'required|array|min:1',
                'job_order_ids.*' => 'exists:job_orders,job_order_id'
            ]);

            // Check if job orders exist in this manifest
            $jobOrdersInManifest = DB::table('manifest_jobs')
                ->where('manifest_id', $manifestId)
                ->whereIn('job_order_id', $request->job_order_ids)
                ->pluck('job_order_id')
                ->toArray();

            if (count($jobOrdersInManifest) === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'None of the specified job orders are in this manifest'
                ], 422);
            }

            // Detach job orders
            $manifest->jobOrders()->detach($request->job_order_ids);

            // Update job order status kembali ke "Assigned"
            JobOrder::whereIn('job_order_id', $request->job_order_ids)
                ->update(['status' => 'Assigned']);

            // Update cargo summary and weight
            $this->updateManifestCargo($manifest);

            // Reload manifest
            $manifest->load(['jobOrders.customer']);

            return response()->json([
                'success' => true,
                'message' => count($jobOrdersInManifest) . ' job order(s) removed from manifest successfully',
                'data' => [
                    'manifest_id' => $manifestId,
                    'removed_job_orders' => $jobOrdersInManifest,
                    'total_job_orders' => $manifest->jobOrders->count(),
                    'total_weight' => $manifest->cargo_weight,
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove job orders from manifest',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available job orders that are not yet assigned to any manifest
     * 
     * @param string $manifest_id
     * @return JsonResponse
     */
    public function getAvailableJobOrders(string $manifest_id): JsonResponse
    {
        try {
            // ✅ Cek apakah manifest ada (skip jika 'new' atau 'create')
            $manifest = null;
            if ($manifest_id !== 'new' && $manifest_id !== 'create') {
                $manifest = Manifests::where('manifest_id', $manifest_id)->first();

                if (!$manifest) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Manifest tidak ditemukan'
                    ], 404);
                }
            }

            // ✅ Get job orders yang:
            // 1. Status = 'Pending', 'Created' atau 'Assigned' (siap untuk dimasukkan ke manifest)
            //    - 'Pending' ditambahkan untuk backward compatibility dengan data lama
            // 2. Belum masuk ke manifest manapun
            $availableJobOrders = JobOrder::with(['customer', 'assignments.driver', 'assignments.vehicle'])
                ->whereIn('status', ['Pending', 'Created', 'Assigned'])
                ->whereNotIn('job_order_id', function($query) {
                    $query->select('job_order_id')
                        ->from('manifest_jobs');
                })
                ->get()
                ->map(function($jobOrder) {
                    // ✅ Ambil assignment pertama (yang aktif)
                    $assignment = $jobOrder->assignments->first();

                    return [
                        'job_order_id' => $jobOrder->job_order_id,
                        'customer_name' => $jobOrder->customer->customer_name ?? null,
                        'order_type' => $jobOrder->order_type,
                        'pickup_address' => $jobOrder->pickup_address,
                        'delivery_address' => $jobOrder->delivery_address,
                        'goods_desc' => $jobOrder->goods_desc,
                        'goods_weight' => $jobOrder->goods_weight,
                        'ship_date' => $jobOrder->ship_date,
                        'order_value' => $jobOrder->order_value,
                        'status' => $jobOrder->status,
                        'assignment' => $assignment ? [
                            'driver_id' => $assignment->driver_id,
                            'driver_name' => $assignment->driver->driver_name ?? null,
                            'vehicle_id' => $assignment->vehicle_id,
                            'vehicle_plate' => $assignment->vehicle->license_plate ?? null,
                        ] : null,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Job Orders yang tersedia berhasil diambil',
                'data' => [
                    'manifest_id' => $manifest_id,
                    'manifest_route' => $manifest ? ($manifest->origin_city . ' - ' . $manifest->dest_city) : 'New Manifest',
                    'available_job_orders' => $availableJobOrders,
                    'total_available' => $availableJobOrders->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'gagal mengambil job orders yang tersedia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel the specified manifest
     * 
     * @param string $manifestId
     * @return JsonResponse
     */
    public function cancel(string $manifestId): JsonResponse
    {
        try {
            $manifest = Manifests::where('manifest_id', $manifestId)->first();

            if (!$manifest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Manifest not found'
                ], 404);
            }

            if ($manifest->status === 'Cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Manifest is already cancelled'
                ], 422);
            }

            // Get all job order IDs currently in this manifest
            $jobOrderIds = $manifest->jobOrders()->pluck('job_orders.job_order_id')->toArray();

            // Detach all job orders
            $manifest->jobOrders()->detach();

            // Revert status of detached job orders to 'Assigned' (or 'Created' if no other assignments? Assuming 'Assigned' is safe)
            if (!empty($jobOrderIds)) {
                JobOrder::whereIn('job_order_id', $jobOrderIds)
                    ->update(['status' => 'Assigned']);
            }

            // Update manifest status to Cancelled
            // Keep cargo_weight and cargo_summary as snapshot
            $manifest->update([
                'status' => 'Cancelled',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Manifest cancelled successfully. Job orders have been released.',
                'data' => $manifest
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel manifest',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update manifest cargo information based on job orders
     * 
     * @param Manifests $manifest
     * @return void
     */
    private function updateManifestCargo(Manifests $manifest): void
    {
        $jobOrders = $manifest->jobOrders;
        
        $totalWeight = $jobOrders->sum('goods_weight');
        $cargoSummary = $jobOrders->count() . ' packages';
        
        if ($jobOrders->count() > 0) {
            $descriptions = $jobOrders->pluck('goods_desc')->unique()->take(3);
            $cargoSummary .= ': ' . $descriptions->implode(', ');
            if ($jobOrders->count() > 3) {
                $cargoSummary .= ', etc.';
            }
        }

        $manifest->update([
            'cargo_weight' => $totalWeight,
            'cargo_summary' => $cargoSummary
        ]);
    }
}