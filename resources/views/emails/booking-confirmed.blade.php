<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px;">
    @php
        $slot = $booking->slot;
        $date = $slot?->date?->format('l, j F Y') ?? '—';
        $time = $slot ? substr((string) $slot->time, 0, 5) : '—';
        $duration = $slot?->duration_minutes ?? 30;
        $price = $slot ? number_format($slot->price_cents / 100, 2).' '.$slot->currency : '—';
        $timezone = config('google.timezone', config('app.timezone'));
    @endphp

    @if($forAdmin)
        <h1 style="color: #0359E8; margin-bottom: 8px;">New paid consultation</h1>
        <p style="margin-top: 0;">A customer completed payment and booked a slot.</p>
    @else
        <h1 style="color: #0359E8; margin-bottom: 8px;">Your consultation is confirmed</h1>
        <p style="margin-top: 0;">Thank you, <strong>{{ $booking->full_name }}</strong>. Payment was successful.</p>
    @endif

    <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: #f3f7ff; border-radius: 12px;">
        <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;"><strong>Name</strong></td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;">{{ $booking->full_name }}</td>
        </tr>
        <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;"><strong>Email</strong></td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;">{{ $booking->email ?? '—' }}</td>
        </tr>
        <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;"><strong>Phone</strong></td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;">{{ $booking->phone ?? '—' }}</td>
        </tr>
        <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;"><strong>Date</strong></td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;">{{ $date }}</td>
        </tr>
        <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;"><strong>Time</strong></td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;">{{ $time }} ({{ $timezone }})</td>
        </tr>
        <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;"><strong>Duration</strong></td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #d1e0ff;">{{ $duration }} minutes</td>
        </tr>
        <tr>
            <td style="padding: 16px 20px;"><strong>Price paid</strong></td>
            <td style="padding: 16px 20px;">{{ $price }}</td>
        </tr>
    </table>

    @if($booking->google_meet_url)
        <p style="margin: 24px 0 12px;"><strong>Google Meet (join your consultation):</strong></p>
        <p style="margin: 0 0 16px;">
            <a href="{{ $booking->google_meet_url }}"
               style="display: inline-block; background: #0359E8; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
                Join Google Meet
            </a>
        </p>
        <p style="margin: 0; font-size: 14px; color: #64748b; word-break: break-all;">
            Or copy this link: <a href="{{ $booking->google_meet_url }}" style="color: #0359E8;">{{ $booking->google_meet_url }}</a>
        </p>
    @else
        <p style="background: #fef3c7; padding: 12px 16px; border-radius: 8px; font-size: 14px;">
            Google Meet link is being prepared. You will receive it shortly from Germany Pro Guide.
        </p>
    @endif

    <p style="font-size: 13px; color: #94a3b8; margin-top: 32px;">
        Germany Pro Guide · Booking #{{ $booking->id }}
    </p>
</body>
</html>
