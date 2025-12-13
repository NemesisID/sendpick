<?php

use App\Models\Vehicles;

$vehicles = Vehicles::with(['assignments' => function($q) {
    $q->where('status', 'Active')->with(['driver', 'jobOrder']);
}])->get();

echo "--- DATA CHECK ---\n";
foreach($vehicles as $v) {
    echo "Vehicle: " . $v->plate_no . "\n";
    $assignment = $v->assignments->first();
    
    if ($assignment) {
        echo "  - Has Active Assignment (ID: {$assignment->assignment_id})\n";
        
        $driver = $assignment->driver;
        echo "  - Driver: " . ($driver ? $driver->driver_name : 'NULL') . "\n";
        
        $jobOrder = $assignment->jobOrder;
        if ($jobOrder) {
            echo "  - Job Order: {$jobOrder->job_order_id}\n";
            echo "  - Status: {$jobOrder->status}\n";
        } else {
            echo "  - Job Order: NULL\n";
        }
    } else {
        echo "  - No Active Assignment\n";
    }
    echo "----------------\n";
}
