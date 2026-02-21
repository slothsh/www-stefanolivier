<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('featured_items', function (Blueprint $table) {
            $table->id();
            $table->string('source_type', 32);
            $table->string('source_id', 128)->nullable();
            $table->string('title', 128);
            $table->string('description', 512);
            $table->string('image_url', 512)->nullable();
            $table->string('link_url', 512);
            $table->string('link_text', 64)->default('View Project');
            $table->json('metadata')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();

            $table->index(['source_type', 'source_id']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('featured_items');
    }
};
