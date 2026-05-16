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
        Schema::create('appointment_slots', function (Blueprint $table) {
            $table->id();

            $table->date('date');
            $table->time('time');
            $table->unsignedInteger('duration_minutes')->default(30);
            $table->unsignedInteger('price_cents')->default(3000);
            $table->string('currency')->default('EUR');
            $table->boolean('is_booked')->default(false);

            $table->timestamps();

            $table->unique(['date', 'time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_slots');
    }
};
