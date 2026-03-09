<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\V1\Driver\DeliveryController as DriverDeliveryController;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use App\Services\DeliveryProofService;
use App\Services\DeliveryStatusService;
use App\Services\NotificationService;
use App\Services\RouteAssignmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use ReflectionMethod;
use Tests\TestCase;

class DriverDeliveryFormatterTest extends TestCase
{
    use RefreshDatabase;

    public function test_driver_delivery_formatter_includes_subscription_context(): void
    {
        $delivery = $this->createSubscriptionDelivery();

        $controller = new DriverDeliveryController(
            Mockery::mock(DeliveryStatusService::class),
            Mockery::mock(DeliveryProofService::class),
            Mockery::mock(RouteAssignmentService::class),
            Mockery::mock(NotificationService::class)
        );

        $formatDeliveryMethod = new ReflectionMethod(DriverDeliveryController::class, 'formatDelivery');
        $formatDeliveryMethod->setAccessible(true);

        /** @var array<string, mixed> $formatted */
        $formatted = $formatDeliveryMethod->invoke($controller, $delivery, true);

        $this->assertSame(Order::TYPE_SUBSCRIPTION, $formatted['order_type']);
        $this->assertTrue($formatted['is_subscription']);
        $this->assertSame($delivery->order->subscription_id, $formatted['subscription_id']);
        $this->assertSame('society_fresh', $formatted['vertical']);
        $this->assertSame(Order::TYPE_SUBSCRIPTION, $formatted['order']['type']);
        $this->assertSame($delivery->order->subscription_id, $formatted['order']['subscription_id']);
    }

    private function createSubscriptionDelivery(): Delivery
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
            'status' => Order::STATUS_PENDING,
            'subtotal' => 120,
            'discount' => 0,
            'delivery_charge' => 0,
            'total' => 120,
            'currency' => 'INR',
            'payment_status' => Order::PAYMENT_PENDING,
            'scheduled_delivery_date' => now()->toDateString(),
        ]);

        $product = Product::factory()->create();

        OrderItem::query()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'product_image' => $product->image,
            'quantity' => 1,
            'price' => $product->price,
            'subtotal' => $product->price,
            'is_free_sample' => false,
        ]);

        return Delivery::query()->create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'user_address_id' => $address->id,
            'zone_id' => $zone->id,
            'status' => Delivery::STATUS_ASSIGNED,
            'scheduled_date' => now()->toDateString(),
        ])->load(['order.items', 'user', 'address', 'zone']);
    }
}
