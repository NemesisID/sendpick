<?php
try {
    $controller = app()->make(App\Http\Controllers\Api\VehicleController::class);
    $request = new Illuminate\Http\Request();
    $response = $controller->getActiveVehicles($request);
    echo $response->content();
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
