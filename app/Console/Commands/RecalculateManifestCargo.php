<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Manifests;
use App\Models\JobOrder;

/**
 * ============================================================
 * RECALCULATE MANIFEST CARGO COMMAND
 * ============================================================
 * 
 * Command ini digunakan untuk memperbaiki data Manifest yang sudah ada:
 * 1. Recalculate cargo_weight dan cargo_summary dari Job Order AKTIF
 * 2. Kosongkan driver/vehicle jika tidak ada Job Order aktif
 * 
 * PENGGUNAAN:
 * php artisan manifest:recalculate-cargo
 * php artisan manifest:recalculate-cargo --manifest=MF-20251220-AAJKSV
 */
class RecalculateManifestCargo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'manifest:recalculate-cargo 
                            {--manifest= : Recalculate specific manifest ID only}
                            {--dry-run : Show what would be changed without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate cargo weight and summary for all manifests based on active Job Orders';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚛 Starting Manifest Cargo Recalculation...');
        $this->newLine();

        $dryRun = $this->option('dry-run');
        $specificManifest = $this->option('manifest');

        if ($dryRun) {
            $this->warn('⚠️  DRY RUN MODE - No changes will be made');
            $this->newLine();
        }

        // Get manifests to process
        $query = Manifests::with(['jobOrders']);
        
        if ($specificManifest) {
            $query->where('manifest_id', $specificManifest);
            $this->info("Processing specific manifest: {$specificManifest}");
        }

        $manifests = $query->get();

        if ($manifests->isEmpty()) {
            $this->warn('No manifests found.');
            return 0;
        }

        $this->info("Found {$manifests->count()} manifest(s) to process");
        $this->newLine();

        $updated = 0;
        $noChange = 0;
        $errors = 0;

        // Create progress bar
        $bar = $this->output->createProgressBar($manifests->count());
        $bar->start();

        foreach ($manifests as $manifest) {
            try {
                $result = $this->processManifest($manifest, $dryRun);
                
                if ($result === 'updated') {
                    $updated++;
                } elseif ($result === 'no_change') {
                    $noChange++;
                }
            } catch (\Exception $e) {
                $errors++;
                $this->error("Error processing {$manifest->manifest_id}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        // Summary
        $this->info('✅ Recalculation Complete!');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Processed', $manifests->count()],
                ['Updated', $updated],
                ['No Change', $noChange],
                ['Errors', $errors],
            ]
        );

        return 0;
    }

    /**
     * Process a single manifest
     */
    private function processManifest(Manifests $manifest, bool $dryRun): string
    {
        // Get all job orders (termasuk Cancelled untuk cargo calculation)
        $allJobOrders = $manifest->jobOrders()->get();
        
        // Get active job orders (untuk menentukan driver/vehicle status)
        $activeJobOrders = $manifest->jobOrders()
            ->where('status', '!=', 'Cancelled')
            ->get();

        // ✅ FIXED: Calculate totals from ALL job orders (termasuk Cancelled)
        // Ini sesuai dengan kebutuhan bisnis: Manifest menampilkan total rencana muatan
        $newWeight = $allJobOrders->sum('goods_weight');
        $newKoli = $allJobOrders->sum('goods_qty');

        // Build cargo summary from ALL job orders
        $newSummary = $allJobOrders->count() . ' packages';
        if ($allJobOrders->count() > 0) {
            $descriptions = $allJobOrders->pluck('goods_desc')->unique()->take(3);
            $newSummary .= ': ' . $descriptions->implode(', ');
            if ($allJobOrders->count() > 3) {
                $newSummary .= ', etc.';
            }
        }

        // Current values
        $currentWeight = $manifest->cargo_weight;
        $currentSummary = $manifest->cargo_summary;

        // Check if update is needed
        $weightChanged = (float)$currentWeight !== (float)$newWeight;
        $summaryChanged = $currentSummary !== $newSummary;

        if (!$weightChanged && !$summaryChanged) {
            return 'no_change';
        }

        // Log the change
        $this->newLine();
        $this->line("📦 <fg=cyan>{$manifest->manifest_id}</>");
        $this->line("   Total JOs: {$allJobOrders->count()} | Active JOs: {$activeJobOrders->count()}");
        $this->line("   Weight: <fg=red>{$currentWeight} kg</> → <fg=green>{$newWeight} kg</>");
        $this->line("   Summary: <fg=red>{$currentSummary}</> → <fg=green>{$newSummary}</>");

        if (!$dryRun) {
            // Decide if driver/vehicle should be released
            if ($activeJobOrders->count() === 0) {
                $manifest->update([
                    'cargo_weight' => $newWeight,
                    'cargo_summary' => $newSummary,
                    'driver_id' => null,
                    'vehicle_id' => null
                ]);
                $this->line("   <fg=yellow>⚠️  Driver & Vehicle released (0 active JOs)</>");
            } else {
                $manifest->update([
                    'cargo_weight' => $newWeight,
                    'cargo_summary' => $newSummary
                ]);
            }
        }

        return 'updated';
    }
}
