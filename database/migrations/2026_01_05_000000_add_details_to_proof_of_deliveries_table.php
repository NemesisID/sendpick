<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('proof_of_deliveries', function (Blueprint $table) {
            $table->string('recipient_name')->nullable()->after('job_order_id');
            $table->text('notes')->nullable()->after('recipient_name');
            $table->timestamp('delivered_at')->nullable()->after('signature_url');
            // uploaded_at already exists
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proof_of_deliveries', function (Blueprint $table) {
            $table->dropColumn(['recipient_name', 'notes', 'delivered_at']);
        });
    }
};
