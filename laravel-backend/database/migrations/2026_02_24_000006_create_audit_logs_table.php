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
        Schema::create('auditlog', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('userId');
            $table->string('action');
            $table->string('entity');
            $table->string('entityId');
            $table->text('oldData')->nullable();
            $table->text('newData')->nullable();
            $table->timestamp('createdAt', 3)->useCurrent();

            $table->foreign('userId')->references('id')->on('user')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditlog');
    }
};
