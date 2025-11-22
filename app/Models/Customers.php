<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customers extends Model
{
    protected $table = 'customers';
    protected $primaryKey = 'customer_id';
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'customer_id',
        'customer_code',
        'customer_name',
        'customer_type',
        'contact_name',
        'phone',
        'email',
        'address',
        'status'
    ];

    /**
     * Relationship: Customer has many Job Orders
     */
    public function jobOrders(): HasMany
    {
        return $this->hasMany(JobOrder::class, 'customer_id', 'customer_id');
    }

    /**
     * Relationship: Customer has many Delivery Orders
     */
    public function deliveryOrders(): HasMany
    {
        return $this->hasMany(DeliveryOrder::class, 'customer_id', 'customer_id');
    }

    /**
     * Relationship: Customer has many Invoices
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoices::class, 'customer_id', 'customer_id');
    }

    /**
     * Generate Customer ID
     * Format: CUST + 4 digit counter
     * Contoh: CUST0001, CUST0002, ...
     */
    public static function generateCustomerId(): string
    {
        $lastNumber = self::query()
            ->selectRaw("COALESCE(MAX(CAST(REGEXP_REPLACE(customer_id, '[^0-9]', '', 'g') AS INTEGER)), 0) AS last_number")
            ->value('last_number');

        $nextNumber = ((int) $lastNumber) + 1;

        return 'CUST' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}