<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Manifests;
use App\Models\JobOrder;
use Illuminate\Support\Facades\DB;

/**
 * ============================================================
 * RE-ATTACH CANCELLED JOB ORDERS COMMAND
 * ============================================================
 * 
 * Command ini digunakan untuk memperbaiki data dimana Job Order
 * yang di-cancel sudah ter-detach dari Manifest (karena bug lama).
 * 
 * LOGIKA:
 * 1. Cari Manifest yang tidak punya Job Order (manifest_jobs kosong)
 * 2. Cari Job Order yang Cancelled dan origin/destination cocok dengan Manifest
 * 3. Re-attach Job Order ke Manifest berdasarkan kecocokan
 * 
 * PENGGUNAAN:
 * php artisan manifest:reattach-jobs
 * php artisan manifest:reattach-jobs --dry-run
 * php artisan manifest:reattach-jobs --manifest=MF-20251220-AAJKSV
 */
class ReattachCancelledJobOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'manifest:reattach-jobs 
                            {--manifest= : Process specific manifest ID only}
                            {--dry-run : Show what would be changed without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Re-attach cancelled Job Orders to their Manifests based on matching criteria';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔗 Starting Re-attach Cancelled Job Orders...');
        $this->newLine();

        $dryRun = $this->option('dry-run');
        $specificManifest = $this->option('manifest');

        if ($dryRun) {
            $this->warn('⚠️  DRY RUN MODE - No changes will be made');
            $this->newLine();
        }

        // Find manifests with NO job orders (empty)
        $query = Manifests::doesntHave('jobOrders');
        
        if ($specificManifest) {
            $query = Manifests::where('manifest_id', $specificManifest);
            $this->info("Processing specific manifest: {$specificManifest}");
        }

        $emptyManifests = $query->get();

        if ($emptyManifests->isEmpty()) {
            $this->info('✅ No empty manifests found. All manifests have Job Orders attached.');
            return 0;
        }

        $this->info("Found {$emptyManifests->count()} manifest(s) without Job Orders");
        $this->newLine();

        $reattached = 0;
        $noMatch = 0;

        foreach ($emptyManifests as $manifest) {
            $this->line("📦 <fg=cyan>{$manifest->manifest_id}</> ({$manifest->status})");
            $this->line("   Route: {$manifest->origin_city} → {$manifest->dest_city}");
            $this->line("   Created: {$manifest->created_at}");

            // Find cancelled Job Orders that match this Manifest's route
            $matchingJobOrders = $this->findMatchingJobOrders($manifest);

            if ($matchingJobOrders->isEmpty()) {
                $this->line("   <fg=yellow>⚠️  No matching Job Orders found</>");
                $noMatch++;
                $this->newLine();
                continue;
            }

            $this->line("   Found {$matchingJobOrders->count()} potential match(es):");

            foreach ($matchingJobOrders as $jo) {
                $this->line("      - {$jo->job_order_id} ({$jo->status}): {$jo->pickup_city} → {$jo->delivery_city} | {$jo->goods_weight} kg");
            }

            if (!$dryRun) {
                // Re-attach the job orders
                $jobOrderIds = $matchingJobOrders->pluck('job_order_id')->toArray();
                
                foreach ($jobOrderIds as $joId) {
                    // Check if already attached (to prevent duplicate)
                    $exists = DB::table('manifest_jobs')
                        ->where('manifest_id', $manifest->manifest_id)
                        ->where('job_order_id', $joId)
                        ->exists();
                    
                    if (!$exists) {
                        DB::table('manifest_jobs')->insert([
                            'manifest_id' => $manifest->manifest_id,
                            'job_order_id' => $joId,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                        $this->line("      <fg=green>✓ Re-attached {$joId}</>");
                        $reattached++;
                    }
                }

                // Trigger recalculation via observer pattern
                // (Since we're using DB::table, observer won't fire. We need to recalculate manually)
                $this->recalculateManifest($manifest);
            }

            $this->newLine();
        }

        // Summary
        $this->info('✅ Re-attach Complete!');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Empty Manifests Processed', $emptyManifests->count()],
                ['Job Orders Re-attached', $reattached],
                ['Manifests with No Match', $noMatch],
            ]
        );

        if (!$dryRun && $reattached > 0) {
            $this->newLine();
            $this->info("💡 Tip: Run 'php artisan manifest:recalculate-cargo' to update cargo weights.");
        }

        return 0;
    }

    /**
     * Find Job Orders that potentially belong to this Manifest
     * based on matching origin/destination and timeline
     */
    private function findMatchingJobOrders(Manifests $manifest)
    {
        // Strategy 1: Match by origin and destination city (fuzzy match)
        $originCity = $manifest->origin_city;
        $destCity = $manifest->dest_city;

        // Look for Cancelled job orders that match the route
        // and were created around the same time as the manifest
        return JobOrder::where('status', 'Cancelled')
            ->where(function ($query) use ($originCity) {
                $query->where('pickup_city', 'ILIKE', "%{$originCity}%")
                      ->orWhere('pickup_address', 'ILIKE', "%{$originCity}%");
            })
            ->where(function ($query) use ($destCity) {
                $query->where('delivery_city', 'ILIKE', "%{$destCity}%")
                      ->orWhere('delivery_address', 'ILIKE', "%{$destCity}%");
            })
            // Job Order should be created before or around manifest creation
            ->where('created_at', '<=', $manifest->created_at->addDay())
            // Job Order should not already be attached to another manifest
            ->whereDoesntHave('manifests')
            ->get();
    }

    /**
     * Recalculate manifest cargo after re-attaching job orders
     */
    private function recalculateManifest(Manifests $manifest)
    {
        $manifest->refresh();
        
        $activeJobOrders = $manifest->jobOrders()
            ->where('status', '!=', 'Cancelled')
            ->get();

        $totalWeight = $activeJobOrders->sum('goods_weight');
        $totalKoli = $activeJobOrders->sum('goods_qty');

        $cargoSummary = $activeJobOrders->count() . ' packages';
        if ($activeJobOrders->count() > 0) {
            $descriptions = $activeJobOrders->pluck('goods_desc')->unique()->take(3);
            $cargoSummary .= ': ' . $descriptions->implode(', ');
        }

        // Also calculate from ALL job orders (including cancelled) for total display
        $allJobOrders = $manifest->jobOrders()->get();
        $totalWeightAll = $allJobOrders->sum('goods_weight');
        $totalKoliAll = $allJobOrders->sum('goods_qty');

        $manifest->update([
            'cargo_weight' => $totalWeightAll, // Use ALL for total (including cancelled)
            'cargo_summary' => "{$allJobOrders->count()} packages"
        ]);

        $this->line("   <fg=green>✓ Recalculated: {$totalWeightAll} kg, {$totalKoliAll} koli</>");
    }
}