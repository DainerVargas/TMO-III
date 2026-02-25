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
        Schema::create('stockmovement', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('productId');
            $table->integer('quantity');
            $table->string('type');
            $table->string('reason')->nullable();
            $table->timestamp('createdAt', 3)->useCurrent();

            $table->foreign('productId')->references('id')->on('product')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stockmovement');
    }
};
