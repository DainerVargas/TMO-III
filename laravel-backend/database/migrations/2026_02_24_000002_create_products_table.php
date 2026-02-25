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
        Schema::create('product', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique();
            $table->string('categoryId');
            $table->decimal('price', 10, 2);
            $table->string('unit');
            $table->integer('stock');
            $table->string('stockStatus');
            $table->text('image');
            $table->text('description');
            $table->integer('deliveryDays')->default(1);
            $table->string('brand');
            $table->integer('minOrder')->default(1);
            $table->boolean('isRecurring')->default(false);
            $table->string('tags');
            $table->decimal('unitPrice', 10, 2)->nullable();
            $table->string('unitPriceUnit')->nullable();
            $table->boolean('isActive')->default(true);
            $table->timestamp('createdAt', 3)->useCurrent();
            $table->timestamp('updatedAt', 3)->useCurrent()->useCurrentOnUpdate();

            $table->foreign('categoryId')->references('id')->on('category')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
