<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoices;

/**
 * ============================================================
 * RELEASE CANCELLED INVOICE SOURCES COMMAND
 * ============================================================
 * 
 * Command ini digunakan untuk memperbaiki data Invoice yang sudah
 * di-cancel sebelum fix, dimana source_id masih terisi sehingga
 * Job Order tidak muncul di dropdown "Pilih Order".
 * 
 * PENGGUNAAN:
 * php artisan invoice:release-cancelled-sources
 * php artisan invoice:release-cancelled-sources --dry-run
 */
class ReleaseCancelledInvoiceSources extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoice:release-cancelled-sources 
                            {--dry-run : Show what would be changed without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Release source_id from cancelled invoices so Job Orders can be reused';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔓 Releasing sources from cancelled invoices...');
        $this->newLine();

        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('⚠️  DRY RUN MODE - No changes will be made');
            $this->newLine();
        }

        // Find cancelled invoices that still have source_id
        $cancelledWithSource = Invoices::where('status', 'Cancelled')
            ->whereNotNull('source_id')
            ->get();

        if ($cancelledWithSource->isEmpty()) {
            $this->info('✅ No cancelled invoices with sources found. All sources already released.');
            return 0;
        }

        $this->info("Found {$cancelledWithSource->count()} cancelled invoice(s) with sources still attached:");
        $this->newLine();

        $released = 0;

        foreach ($cancelledWithSource as $invoice) {
            $this->line("📄 <fg=cyan>{$invoice->invoice_id}</>");
            $this->line("   Source: {$invoice->source_type} - {$invoice->source_id}");
            $this->line("   Cancelled at: {$invoice->updated_at}");

            if (!$dryRun) {
                // Store source info in cancellation note
                $sourceInfo = "Original source: {$invoice->source_type}-{$invoice->source_id}";
                $existingNote = $invoice->cancellation_note;
                
                $invoice->update([
                    'source_type' => null,
                    'source_id' => null,
                    'cancellation_note' => $existingNote 
                        ? $existingNote . "\n\n[{$sourceInfo}] (retrofix)"
                        : "[{$sourceInfo}] (retrofix)"
                ]);
                
                $this->line("   <fg=green>✓ Source released</>");
                $released++;
            }

            $this->newLine();
        }

        // Summary
        $this->info('✅ Release Complete!');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Cancelled Invoices Processed', $cancelledWithSource->count()],
                ['Sources Released', $dryRun ? '(dry run)' : $released],
            ]
        );

        if (!$dryRun && $released > 0) {
            $this->newLine();
            $this->info("💡 Job Orders/Manifests/DOs from these invoices are now available for new invoices.");
        }

        return 0;
    }
}
