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
        Schema::table('sales_return', function (Blueprint $table) {
            $table->integer('payment_status')->nullable()->after('payment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_return', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });
    }
};
