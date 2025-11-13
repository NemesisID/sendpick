<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Manifests extends Model
{
    protected $table = 'manifests';
    protected $primaryKey = 'manifest_id';
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'manifest_id',
        'origin_city',
        'dest_city',
        'cargo_summary',
        'cargo_weight',
        'planned_departure',
        'planned_arrival',
        'status',
        'created_by'
    ];

    protected $casts = [
        'cargo_weight' => 'decimal:2',
        'planned_departure' => 'datetime',
        'planned_arrival' => 'datetime'
    ];

    /**
     * Relationship: Manifest belongs to Admin (created by)
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Relationship: Manifest belongs to many Job Orders
     */
    public function jobOrders(): BelongsToMany
    {
        return $this->belongsToMany(JobOrder::class, 'manifest_jobs', 'manifest_id', 'job_order_id', 'manifest_id', 'job_order_id');
    }
}