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
     * Get the source model (Job Order or Manifest) - Polymorphic relation
     */
    public function getSourceAttribute()
    {
        if ($this->source_type === 'JO') {
            return JobOrder::where('job_order_id', $this->source_id)->first();
        } elseif ($this->source_type === 'MF') {
            return Manifests::where('manifest_id', $this->source_id)->first();
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