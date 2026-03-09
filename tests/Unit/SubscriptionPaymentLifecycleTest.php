<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Wallet;
use App\Models\Zone;
use App\Services\SubscriptionPaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionPaymentLifecycleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array{order: Order, subscription: Subscription, wallet: Wallet}
     */
    private function createSubscriptionOrderWithWallet(float $walletBalance, float $orderTotal = 120.0): array
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
            'subtotal' => $orderTotal,
            'discount' => 0,
            'delivery_charge' => 0,
            'total' => $orderTotal,
            'currency' => 'INR',
            'payment_status' => Order::PAYMENT_PENDING,
            'payment_method' => 'wallet',
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
            'subscription' => $subscription,
            'wallet' => $wallet,
        ];
    }

    public function test_subscription_payment_is_marked_paid_when_wallet_has_sufficient_balance(): void
    {
        $data = $this->createSubscriptionOrderWithWallet(walletBalance: 500, orderTotal: 120);

        /** @var SubscriptionPaymentService $service */
        $service = app(SubscriptionPaymentService::class);
        $result = $service->attemptChargeForOrder($data['order']);

        $this->assertTrue($result['success']);
        $this->assertSame('paid', $result['status']);

        $order = $data['order']->fresh();
        $this->assertSame(Order::PAYMENT_PAID, $order->payment_status);
        $this->assertSame('wallet', $order->payment_method);
        $this->assertSame(1, $order->payment_attempts);
        $this->assertNull($order->next_payment_retry_at);
        $this->assertNull($order->payment_failed_at);

        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'status' => 'completed',
            'method' => 'wallet',
        ]);

        $this->assertSame(380.0, (float) $data['wallet']->fresh()->balance);
    }

    public function test_subscription_payment_schedules_retry_and_pauses_after_max_failures(): void
    {
        $data = $this->createSubscriptionOrderWithWallet(walletBalance: 0, orderTotal: 120);

        /** @var SubscriptionPaymentService $service */
        $service = app(SubscriptionPaymentService::class);

        $firstAttempt = $service->attemptChargeForOrder($data['order']);
        $this->assertFalse($firstAttempt['success']);
        $this->assertSame('retry_scheduled', $firstAttempt['status']);

        $orderAfterFirst = $data['order']->fresh();
        $this->assertSame(Order::PAYMENT_FAILED, $orderAfterFirst->payment_status);
        $this->assertSame(1, $orderAfterFirst->payment_attempts);
        $this->assertNotNull($orderAfterFirst->next_payment_retry_at);

        $service->attemptChargeForOrder($data['order']->fresh());
        $thirdAttempt = $service->attemptChargeForOrder($data['order']->fresh());

        $this->assertFalse($thirdAttempt['success']);
        $this->assertSame('paused', $thirdAttempt['status']);

        $orderAfterThird = $data['order']->fresh();
        $subscriptionAfterThird = $data['subscription']->fresh();

        $this->assertSame(3, $orderAfterThird->payment_attempts);
        $this->assertNull($orderAfterThird->next_payment_retry_at);
        $this->assertSame(Order::PAYMENT_FAILED, $orderAfterThird->payment_status);
        $this->assertSame(Subscription::STATUS_PAUSED, $subscriptionAfterThird->status);

        $this->assertDatabaseCount('payments', 3);
        $this->assertDatabaseHas('payments', [
            'order_id' => $orderAfterThird->id,
            'status' => 'failed',
            'method' => 'wallet',
        ]);
    }
}
