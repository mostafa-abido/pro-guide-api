<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('google_meet_url')->nullable()->after('paid_at');
            $table->string('google_calendar_event_id')->nullable()->after('google_meet_url');
            $table->timestamp('confirmation_email_sent_at')->nullable()->after('google_calendar_event_id');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'google_meet_url',
                'google_calendar_event_id',
                'confirmation_email_sent_at',
            ]);
        });
    }
};
