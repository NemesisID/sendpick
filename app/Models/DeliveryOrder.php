<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryOrder extends Model
{
    protected $table = 'delivery_orders';
    protected $primaryKey = 'do_id';
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'do_id',
        'source_type',
        'source_id',
        'customer_id',
        'status',
        'do_date',
        'departure_date',
        'eta',
        'delivered_date',
        'goods_summary',
        'priority',
        'temperature',
        'created_by'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['driver_name', 'vehicle_plate'];

    protected $casts = [
        'do_date' => 'date',
        'departure_date' => 'datetime',
        'eta' => 'datetime',
        'delivered_date' => 'date'
    ];

    /**
     * Relationship: Delivery Order belongs to Customer
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customers::class, 'customer_id', 'customer_id');
    }

    /**
     * Relationship: Delivery Order belongs to Admin (created by)
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Relationship: Delivery Order source Job Order (conditional)
     * NOTE: Hanya return Job Order jika source_type = 'JO'
     * Gunakan accessor atau check manual di controller
     */
    public function jobOrder() 
    {
        return $this->belongsTo(JobOrder::class, 'source_id', 'job_order_id');
    }

    /**
     * Relationship: Delivery Order source Manifest (conditional)
     * NOTE: Hanya return Manifest jika source_type = 'MF'
     * Gunakan accessor atau check manual di controller
     */
    public function manifest()
    {
        return $this->belongsTo(Manifests::class, 'source_id', 'manifest_id');
    }

    /**
     * Get the source model (Job Order or Manifest) with calculated totals
     * Returns enriched data for display purposes
     */
    public function getSourceAttribute()
    {
        if ($this->source_type === 'JO') {
            $jobOrder = JobOrder::where('job_order_id', $this->source_id)->first();
            if ($jobOrder) {
                // Return enriched data for Job Order
                return [
                    'job_order_id' => $jobOrder->job_order_id,
                    'customer_id' => $jobOrder->customer_id,
                    'customer_name' => $jobOrder->customer?->customer_name,
                    'pickup_city' => $jobOrder->pickup_city,
                    'delivery_city' => $jobOrder->delivery_city,
                    'goods_desc' => $jobOrder->goods_desc,
                    'goods_weight' => $jobOrder->goods_weight,
                    'goods_volume' => $jobOrder->goods_volume,
                    'quantity' => 1, // Single Job Order = 1 unit
                    'status' => $jobOrder->status,
                ];
            }
        } elseif ($this->source_type === 'MF') {
            $manifest = Manifests::with('jobOrders')->where('manifest_id', $this->source_id)->first();
            if ($manifest) {
                // Calculate totals from all Job Orders in Manifest
                $totalWeight = 0;
                $totalVolume = 0;  // Used as Koli count
                $totalKoli = 0;    // Total physical packages (koli/colli)
                $jobOrdersCount = 0;
                $goodsDescriptions = [];
                
                foreach ($manifest->jobOrders as $jo) {
                    $totalWeight += floatval($jo->goods_weight ?? 0);
                    // goods_volume is used as koli count in this system
                    $totalVolume += floatval($jo->goods_volume ?? 0);
                    $jobOrdersCount++;
                    if ($jo->goods_desc) {
                        $goodsDescriptions[] = $jo->goods_desc;
                    }
                }
                
                // Total Koli: Use goods_volume if available, otherwise estimate 1 koli per JO
                $totalKoli = $totalVolume > 0 ? intval($totalVolume) : $jobOrdersCount;
                
                // Also add cargo_weight from manifest if Job Orders don't have weight
                if ($totalWeight == 0 && $manifest->cargo_weight) {
                    $totalWeight = floatval($manifest->cargo_weight);
                }
                
                // Create combined goods description
                $combinedDesc = $manifest->cargo_summary ?? implode(', ', array_slice($goodsDescriptions, 0, 3));
                if (count($goodsDescriptions) > 3) {
                    $combinedDesc .= '...';
                }
                
                return [
                    'manifest_id' => $manifest->manifest_id,
                    'origin_city' => $manifest->origin_city,
                    'dest_city' => $manifest->dest_city,
                    'goods_desc' => $combinedDesc,
                    'goods_weight' => $totalWeight > 0 ? $totalWeight : null,
                    'goods_volume' => $totalVolume > 0 ? $totalVolume : null,
                    'quantity' => $totalKoli, // Total Koli (physical packages)
                    'koli' => $totalKoli,     // Alias for clarity
                    'job_orders_count' => $jobOrdersCount, // Number of Job Orders in Manifest
                    'status' => $manifest->status,
                    'cargo_summary' => $manifest->cargo_summary,
                ];
            }
        }
        return null;
    }

    /**
     * Accessor: Get driver name from Job Order Assignment or Manifest
     */
    public function getDriverNameAttribute()
    {
        if ($this->source_type === 'JO' && $this->jobOrder) {
            $assignment = $this->jobOrder->assignments()
                ->where('status', 'Active')
                ->with('driver')
                ->first();
            
            return $assignment?->driver?->driver_name ?? 'Belum ditugaskan';
        } elseif ($this->source_type === 'MF' && $this->manifest) {
            return $this->manifest->drivers?->driver_name ?? 'Belum ditugaskan';
        }
        
        return 'Belum ditugaskan';
    }

    /**
     * Accessor: Get vehicle plate from Job Order Assignment or Manifest
     */
    public function getVehiclePlateAttribute()
    {
        if ($this->source_type === 'JO' && $this->jobOrder) {
            $assignment = $this->jobOrder->assignments()
                ->where('status', 'Active')
                ->with('vehicle')
                ->first();
            
            return $assignment?->vehicle?->plate_no ?? 'Belum ditugaskan';
        } elseif ($this->source_type === 'MF' && $this->manifest) {
            return $this->manifest->vehicles?->plate_no ?? 'Belum ditugaskan';
        }
        
        return 'Belum ditugaskan';
    }
}