<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\BookingsService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function __construct(private readonly BookingsService $bookingsService)
    {
    }

    public function handle(Request $request): Response
    {
        $secret = config('stripe.webhook_secret');

        if (! $secret) {
            Log::error('Stripe webhook secret is not configured.');

            return response('Webhook secret not configured', 500);
        }

        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature', '');

        try {
            $event = Webhook::constructEvent($payload, $signature, $secret);
        } catch (SignatureVerificationException $e) {
            Log::warning('Stripe webhook signature verification failed.', ['error' => $e->getMessage()]);

            return response('Invalid signature', 400);
        }

        $type = $event->type;
        $session = $event->data->object;

        match ($type) {
            'checkout.session.completed',
            'checkout.session.async_payment_succeeded' => $this->bookingsService->fulfillCheckout($session->id),
            'checkout.session.expired' => $this->bookingsService->markCancelledBySession($session->id),
            default => null,
        };

        return response('OK', 200);
    }
}
