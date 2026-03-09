<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Wallet;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProcessSubscriptionPaymentsCommandTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array{order: Order, wallet: Wallet}
     */
    private function createSubscriptionOrder(float $walletBalance, string $paymentStatus = Order::PAYMENT_PENDING): array
    {
        $zone = Zone::factory()->create();
        $user = User::factory()->customer()->create();

        $address = UserAddress::factory()->create([
            'user_id' => $user->id,
            'zone_id' => $zone->id,
        ]);

        $plan = SubscriptionPlan::query()->create([
            'name' => 'Society Daily Plan',
            'description' => 'Daily recurring deliveries',
            'frequency_type' => 'daily',
            'discount_type' => 'none',
            'discount_value' => 0,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $subscription = Subscription::query()->create([
            'user_id' => $user->id,
            'user_address_id' => $address->id,
            'subscription_plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'start_date' => now()->toDateString(),
            'next_delivery_date' => now()->toDateString(),
            'billing_cycle' => Subscription::BILLING_MONTHLY,
            'auto_renew' => true,
            'vertical' => 'society_fresh',
        ]);

        $order = Order::query()->create([
            'user_id' => $user->id,
            'user_address_id' => $address->id,
            'subscription_id' => $subscription->id,
            'vertical' => 'society_fresh',
            'type' => Order::TYPE_SUBSCRIPTION,
            'status' => Order::STATUS_CONFIRMED,
            'subtotal' => 120,
            'discount' => 0,
            'delivery_charge' => 0,
            'total' => 120,
            'currency' => 'INR',
            'payment_status' => $paymentStatus,
            'payment_method' => Payment::METHOD_WALLET,
            'payment_attempts' => 0,
            'scheduled_delivery_date' => now()->toDateString(),
        ]);

        $wallet = Wallet::query()->create([
            'user_id' => $user->id,
            'balance' => $walletBalance,
            'currency' => 'INR',
            'is_active' => true,
            'low_balance_threshold' => 100,
        ]);

        return [
            'order' => $order,
            'wallet' => $wallet,
        ];
    }

    public function test_command_processes_pending_subscription_payments(): void
    {
        $data = $this->createSubscriptionOrder(walletBalance: 300, paymentStatus: Order::PAYMENT_PENDING);

        $this->artisan('subscriptions:process-payments')
            ->expectsOutputToContain('Processed: 1')
            ->expectsOutputToContain('Paid: 1')
            ->assertSuccessful();

        $this->assertSame(Order::PAYMENT_PAID, $data['order']->fresh()->payment_status);
    }

    public function test_retry_only_mode_ignores_pending_orders_and_processes_due_retries(): void
    {
        $pending = $this->createSubscriptionOrder(walletBalance: 300, paymentStatus: Order::PAYMENT_PENDING);
        $retry = $this->createSubscriptionOrder(walletBalance: 300, paymentStatus: Order::PAYMENT_FAILED);

        $retry['order']->update([
            'payment_attempts' => 1,
            'next_payment_retry_at' => now()->subHour(),
            'payment_failed_at' => now()->subHour(),
        ]);

        $this->artisan('subscriptions:process-payments --retry-only')
            ->expectsOutputToContain('Processed: 1')
            ->expectsOutputToContain('Paid: 1')
            ->assertSuccessful();

        $this->assertSame(Order::PAYMENT_PENDING, $pending['order']->fresh()->payment_status);
        $this->assertSame(Order::PAYMENT_PAID, $retry['order']->fresh()->payment_status);
    }
}
