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
    public static function generateCustomerId()
    {
        $lastCustomer = self::orderBy('customer_id', 'desc')->first();

        if ($lastCustomer) {
            $lastNumber = (int) substr($lastCustomer->customer_id, 4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return 'CUST' . $newNumber;
    }
}
