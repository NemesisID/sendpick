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
        $query = Vehicles::with('vehicleType');

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

        return response()->json([
            'success' => true,
            'data' => $vehicles->items(),
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
            'fuel_level_pct' => $request->fuel_level_pct ?? 0,
            'last_maintenance_date' => $request->last_maintenance_date,
            'next_maintenance_date' => $request->next_maintenance_date
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vehicle created successfully',
            'data' => $vehicle->load('vehicleType')
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
            'fuel_level_pct' => 'nullable|integer|min:0|max:100',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date|after:last_maintenance_date'
        ]);

        $vehicle->update($request->only([
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
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Vehicle updated successfully',
            'data' => $vehicle->load('vehicleType')
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
     * @param Request $request
     * @return JsonResponse
     */
    public function getAvailable(Request $request): JsonResponse
    {
        // Filter kendaraan yang statusnya 'Aktif', kondisi bukan 'Rusak', dan tidak memiliki assignment aktif 
        $vehicles = Vehicles::with('vehicleType')
            ->where('status', 'Aktif')
            ->where('condition_label', '!=', 'Rusak')
            ->whereDoesntHave('assignments', function($query) {
                $query->where('status', 'Active');
            })
            ->select('vehicle_id', 'plate_no', 'brand', 'model', 'vehicle_type_id', 'capacity_label', 'fuel_level_pct')
            ->orderBy('plate_no')
            ->get()
            ->map(function ($vehicle) {
                $vehicle->license_plate = $vehicle->plate_no; // Alias for frontend compatibility
                return $vehicle;
            });

        return response()->json([
            'success' => true,
            'data' => $vehicles
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
}