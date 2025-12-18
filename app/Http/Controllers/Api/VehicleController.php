<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicles;
use App\Models\VehicleTypes;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

/**
 * VehicleController - Controller untuk mengelola data Kendaraan
 * 
 * Fungsi utama:
 * - Menampilkan daftar kendaraan dengan pencarian dan filter
 * - Membuat data kendaraan baru dengan validasi lengkap
 * - Update data kendaraan termasuk status dan kondisi
 * - Menghapus data kendaraan
 * - Filter berdasarkan tipe kendaraan dan status
 * - Tracking maintenance dan assignment history
 * - Monitor utilisasi dan performa kendaraan
 */
class VehicleController extends Controller
{
    /**
     * Display a listing of vehicles
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Include active assignment with job order for location display, and driver relationship
        $query = Vehicles::with(['vehicleType', 'driver', 'assignments' => function ($q) {
            $q->where('status', 'Active')
              ->with(['jobOrder', 'driver']);
        }]);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('plate_no', 'ILIKE', "%{$search}%")
                ->orWhere('brand', 'ILIKE', "%{$search}%")
                ->orWhere('model', 'ILIKE', "%{$search}%")
                ->orWhere('vehicle_id', 'ILIKE', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by vehicle type
        if ($request->filled('vehicle_type_id')) {
            $query->where('vehicle_type_id', $request->vehicle_type_id);
        }

        // Filter by condition
        if ($request->filled('condition_label')) {
            $query->where('condition_label', $request->condition_label);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $vehicles = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Transform data to include current location based on assignment status
        $transformedVehicles = collect($vehicles->items())->map(function ($vehicle) {
            $activeAssignment = $vehicle->assignments->first();
            $jobOrder = $activeAssignment ? $activeAssignment->jobOrder : null;
            $driver = $activeAssignment ? $activeAssignment->driver : null;

            // Determine current location
            // If vehicle has active job order with status "On Delivery" or "Pickup", show destination city
            $currentLocation = 'Pool (Standby)';
            $inTransitStatuses = ['On Delivery', 'Pickup'];
            
            if ($jobOrder && in_array($jobOrder->status, $inTransitStatuses)) {
                $currentLocation = $jobOrder->delivery_city ?? 'Pool (Standby)';
            }

            // Add computed fields to vehicle
            $vehicleData = $vehicle->toArray();
            $vehicleData['current_location'] = $currentLocation;
            // Use directly assigned driver first, fallback to assignment driver
            $vehicleData['driver'] = $vehicle->driver ?? $driver;
            $vehicleData['active_job_order'] = $jobOrder;

            return $vehicleData;
        });

        return response()->json([
            'success' => true,
            'data' => $transformedVehicles,
            'pagination' => [
                'current_page' => $vehicles->currentPage(),
                'per_page' => $vehicles->perPage(),
                'total' => $vehicles->total(),
                'last_page' => $vehicles->lastPage()
            ]
        ], 200);
    }

    /**
     * Store a newly created vehicle
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'plate_no' => 'required|string|max:20|unique:vehicles,plate_no',
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'brand' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'capacity_label' => 'nullable|string|max:100',
            'odometer_km' => 'nullable|integer|min:0',
            'status' => 'nullable|in:Aktif,Tidak Aktif',
            'condition_label' => 'nullable|in:Baru,Sangat Baik,Baik,Perlu Perbaikan',
            'driver_id' => 'nullable|exists:drivers,driver_id',
            'fuel_level_pct' => 'nullable|integer|min:0|max:100',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date|after:last_maintenance_date'
        ]);

        // Generate unique vehicle_id
        $vehicleId = 'VHC-' . strtoupper(Str::random(8));
        while (Vehicles::where('vehicle_id', $vehicleId)->exists()) {
            $vehicleId = 'VHC-' . strtoupper(Str::random(8));
        }

        $vehicle = Vehicles::create([
            'vehicle_id' => $vehicleId,
            'plate_no' => $request->plate_no,
            'vehicle_type_id' => $request->vehicle_type_id,
            'brand' => $request->brand,
            'model' => $request->model,
            'year' => $request->year,
            'capacity_label' => $request->capacity_label,
            'odometer_km' => $request->odometer_km ?? 0,
            'status' => $request->status ?? 'Aktif',
            'condition_label' => $request->condition_label ?? 'Baik',
            'driver_id' => $request->driver_id ?: null,
            'fuel_level_pct' => $request->fuel_level_pct ?? 0,
            'last_maintenance_date' => $request->last_maintenance_date,
            'next_maintenance_date' => $request->next_maintenance_date
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vehicle created successfully',
            'data' => $vehicle->load(['vehicleType', 'driver'])
        ], 201);
    }

    /**
     * Display the specified vehicle
     * 
     * @param string $vehicleId
     * @return JsonResponse
     */
    public function show(string $vehicleId): JsonResponse
    {
        $vehicle = Vehicles::with(['vehicleType', 'assignments.jobOrder', 'assignments.driver', 'gpsLogs'])
            ->where('vehicle_id', $vehicleId)
            ->first();

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $vehicle
        ], 200);
    }

    /**
     * Update the specified vehicle
     * 
     * @param Request $request
     * @param string $vehicleId
     * @return JsonResponse
     */
    public function update(Request $request, string $vehicleId): JsonResponse
    {
        $vehicle = Vehicles::where('vehicle_id', $vehicleId)->first();

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }

        $request->validate([
            'plate_no' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles', 'plate_no')->ignore($vehicle->vehicle_id, 'vehicle_id')
            ],
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'brand' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'capacity_label' => 'nullable|string|max:100',
            'odometer_km' => 'nullable|integer|min:0',
            'status' => 'nullable|in:Aktif,Tidak Aktif',
            'condition_label' => 'nullable|in:Baru,Sangat Baik,Baik,Perlu Perbaikan',
            'driver_id' => 'nullable|exists:drivers,driver_id',
            'fuel_level_pct' => 'nullable|integer|min:0|max:100',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date|after:last_maintenance_date'
        ]);

        // Handle driver_id - convert empty string to null
        $updateData = $request->only([
            'plate_no',
            'vehicle_type_id',
            'brand',
            'model',
            'year',
            'capacity_label',
            'odometer_km',
            'status',
            'condition_label',
            'fuel_level_pct',
            'last_maintenance_date',
            'next_maintenance_date'
        ]);
        
        // Add driver_id (convert empty string to null)
        $updateData['driver_id'] = $request->driver_id ?: null;
        
        $vehicle->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Vehicle updated successfully',
            'data' => $vehicle->load(['vehicleType', 'driver'])
        ], 200);
    }

    /**
     * Remove the specified vehicle
     * 
     * @param string $vehicleId
     * @return JsonResponse
     */
    public function destroy(string $vehicleId): JsonResponse
    {
        $vehicle = Vehicles::where('vehicle_id', $vehicleId)->first();

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }

        // Check if vehicle has active assignments
        $hasActiveAssignments = $vehicle->assignments()->where('status', 'Active')->exists();

        if ($hasActiveAssignments) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak bisa menghapus kendaraan yang memiliki assignment aktif.'
            ], 422);
        }

        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Vehicle deleted successfully'
        ], 200);
    }

    /**
     * Get available vehicles (not currently assigned)
     * 
     * Supports min_capacity filter to only show vehicles that can carry
     * the required weight (based on vehicle_types.capacity_max_kg)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getAvailable(Request $request): JsonResponse
    {
        // Validate optional min_capacity parameter
        $request->validate([
            'min_capacity' => 'nullable|numeric|min:0'
        ]);

        // Filter kendaraan yang statusnya 'Aktif', kondisi bukan 'Rusak', dan tidak memiliki assignment aktif 
        $query = Vehicles::with('vehicleType')
            ->where('status', 'Aktif')
            ->where('condition_label', '!=', 'Rusak')
            ->whereDoesntHave('assignments', function($q) {
                // Active assignment for active JobOrders
                $q->where('status', 'Active')
                  ->whereHas('jobOrder', function($jo) {
                      $jo->whereNotIn('status', ['Completed', 'Cancelled', 'Delivered']);
                  });
            })
            ->whereDoesntHave('manifests', function($q) {
                // Active assignment for active Manifests
                $q->whereNotIn('status', ['Completed', 'Cancelled', 'Delivered']);
            });

        // Filter by minimum capacity if provided
        // Only show vehicles whose vehicle type can carry at least min_capacity kg
        if ($request->filled('min_capacity')) {
            $minCapacity = (float) $request->min_capacity;
            $query->whereHas('vehicleType', function($q) use ($minCapacity) {
                $q->where('capacity_max_kg', '>=', $minCapacity);
            });
        }

        $vehicles = $query
            ->select('vehicle_id', 'plate_no', 'brand', 'model', 'vehicle_type_id', 'capacity_label', 'fuel_level_pct', 'driver_id')
            ->orderBy('plate_no')
            ->get()
            ->map(function ($vehicle) {
                $vehicle->license_plate = $vehicle->plate_no; // Alias for frontend compatibility
                return $vehicle;
            });

        return response()->json([
            'success' => true,
            'data' => $vehicles,
            'filter_applied' => $request->filled('min_capacity') ? [
                'min_capacity' => (float) $request->min_capacity
            ] : null
        ], 200);
    }

    /**
     * Update vehicle maintenance info
     * 
     * @param Request $request
     * @param string $vehicleId
     * @return JsonResponse
     */
    public function updateMaintenance(Request $request, string $vehicleId): JsonResponse
    {
        $vehicle = Vehicles::where('vehicle_id', $vehicleId)->first();

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }

        $request->validate([
            'last_maintenance_date' => 'required|date',
            'next_maintenance_date' => 'required|date|after:last_maintenance_date',
            'condition_label' => 'required|in:Baru,Sangat Baik,Baik,Perlu Perbaikan'
        ]);

        $vehicle->update([
            'last_maintenance_date' => $request->last_maintenance_date,
            'next_maintenance_date' => $request->next_maintenance_date,
            'condition_label' => $request->condition_label
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vehicle maintenance info updated successfully',
            'data' => $vehicle
        ], 200);
    }
    /**
 * Get active vehicles with real-time status
 * 
 * @param Request $request
 * @return JsonResponse
 */
public function getActiveVehicles(Request $request): JsonResponse
{
    // Include driver relationship (directly assigned driver) and assignments
    $vehicles = Vehicles::with(['driver', 'assignments' => function ($query) {
        $query->where('status', 'Active')
              ->with(['driver', 'jobOrder']);
    }, 'gpsLogs' => function ($query) {
        $query->latest()->limit(1);
    }])->get();

    // Transform data
    $data = $vehicles->map(function ($vehicle) {
        $activeAssignment = $vehicle->assignments->first();
        $jobOrder = $activeAssignment ? $activeAssignment->jobOrder : null;
        // Use directly assigned driver first, fallback to assignment driver
        $assignmentDriver = $activeAssignment ? $activeAssignment->driver : null;
        $driver = $vehicle->driver ?? $assignmentDriver;
        $lastGps = $vehicle->gpsLogs->first();

        // Default values (Idle/Empty)
        // Show directly assigned driver even when vehicle is idle
        $displayDriver = $driver ? $driver->driver_name : '-';
        $displayRoute = '-';
        $displayLoad = '-';
        $displayEta = '-';
        $status = 'idle';
        $statusLabel = 'Idle';

        // Define active statuses that should show data
        $activeStatuses = ['Assigned', 'Pickup', 'On Delivery'];

        // Only populate route/load data if we have a Job Order in an active state
        if ($jobOrder && in_array($jobOrder->status, $activeStatuses)) {
            $displayRoute = "{$jobOrder->pickup_city} - {$jobOrder->delivery_city}";
            $displayLoad = ($jobOrder->goods_weight / 1000) . ' Ton';
            
            // Map Status
            if ($jobOrder->status === 'On Delivery') {
                $status = 'onRoute';
                $statusLabel = 'On Route';
            } elseif ($jobOrder->status === 'Pickup') {
                $status = 'loading';
                $statusLabel = 'Loading';
            } else {
                // Assigned
                $status = 'assigned';
                $statusLabel = 'Assigned';
            }
        } else {
             // Fallback to vehicle status if no active job order or job order is not active
             if ($vehicle->status === 'Maintenance') {
                 $status = 'maintenance';
                 $statusLabel = 'Maintenance';
             }
        }

        return [
            'id' => $vehicle->vehicle_id,
            'vehicle' => $vehicle->plate_no,
            'driver' => $displayDriver,
            'route' => $displayRoute,
            'eta' => $displayEta,
            'load' => $displayLoad,
            'status' => $status,
            'status_label' => $statusLabel,
            'lastUpdate' => $lastGps ? $lastGps->created_at->diffForHumans() : '-',
            'region' => 'jabodetabek', // Default
        ];
    });

    return response()->json([
        'success' => true,
        'data' => $data
    ], 200);
}
}