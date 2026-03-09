<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Delivery;
use App\Models\Driver;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminSubscriptionDeliveryHooksTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_filter_deliveries_to_subscription_only(): void
    {
        /** @var Admin $admin */
        $admin = Admin::factory()->create();

        $this->createDelivery(type: Order::TYPE_ONE_TIME, withSubscription: false);
        $subscriptionDelivery = $this->createDelivery(type: Order::TYPE_SUBSCRIPTION, withSubscription: true);

        $response = $this->actingAs($admin, 'admin')
            ->get(route('admin.deliveries.index', ['subscription_only' => 'true']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/deliveries/index')
            ->where('filters.subscription_only', 'true')
            ->has('deliveries.data', 1)
            ->where('deliveries.data.0.id', $subscriptionDelivery->id)
            ->where('deliveries.data.0.order.type', Order::TYPE_SUBSCRIPTION)
            ->where('deliveries.data.0.order.subscription_id', $subscriptionDelivery->order->subscription_id)
        );
    }

    public function test_admin_deliveries_payload_exposes_order_subscription_fields(): void
    {
        /** @var Admin $admin */
        $admin = Admin::factory()->create();
        $this->createDelivery(type: Order::TYPE_ONE_TIME, withSubscription: false);
        $subscriptionDelivery = $this->createDelivery(type: Order::TYPE_SUBSCRIPTION, withSubscription: true);

        $response = $this->actingAs($admin, 'admin')
            ->get(route('admin.deliveries.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/deliveries/index')
            ->has('deliveries.data', 2)
            ->where('deliveries.data.0.order.type', Order::TYPE_SUBSCRIPTION)
            ->where('deliveries.data.0.order.subscription_id', $subscriptionDelivery->order->subscription_id)
        );
    }

    public function test_admin_deliveries_payload_exposes_subscription_metrics(): void
    {
        /** @var Admin $admin */
        $admin = Admin::factory()->create();

        $this->createDelivery(type: Order::TYPE_SUBSCRIPTION, withSubscription: true, status: Delivery::STATUS_PENDING, scheduledDate: now());
        $this->createDelivery(type: Order::TYPE_SUBSCRIPTION, withSubscription: true, status: Delivery::STATUS_OUT_FOR_DELIVERY, scheduledDate: now());
        $this->createDelivery(
            type: Order::TYPE_SUBSCRIPTION,
            withSubscription: true,
            status: Delivery::STATUS_DELIVERED,
            hasProofImage: true,
            isProofVerified: false,
            scheduledDate: now()->addDay(),
        );
        $this->createDelivery(type: Order::TYPE_ONE_TIME, withSubscription: false, status: Delivery::STATUS_PENDING, scheduledDate: now());

        $response = $this->actingAs($admin, 'admin')->get(route('admin.deliveries.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/deliveries/index')
            ->where('subscriptionMetrics.total', 3)
            ->where('subscriptionMetrics.pending_assignment', 3)
            ->where('subscriptionMetrics.out_for_delivery', 1)
            ->where('subscriptionMetrics.needs_verification', 1)
            ->where('subscriptionMetrics.due_today', 2)
        );
    }

    public function test_admin_can_auto_assign_only_due_today_subscription_deliveries(): void
    {
        /** @var Admin $admin */
        $admin = Admin::factory()->create();

        $zone = Zone::factory()->create();
        $this->createDriverForZone($zone);

        $dueTodaySubscription = $this->createDelivery(
            type: Order::TYPE_SUBSCRIPTION,
            withSubscription: true,
            status: Delivery::STATUS_PENDING,
            scheduledDate: now(),
            zone: $zone,
        );

        $dueTodayOneTime = $this->createDelivery(
            type: Order::TYPE_ONE_TIME,
            withSubscription: false,
            status: Delivery::STATUS_PENDING,
            scheduledDate: now(),
            zone: $zone,
        );

        $tomorrowSubscription = $this->createDelivery(
            type: Order::TYPE_SUBSCRIPTION,
            withSubscription: true,
            status: Delivery::STATUS_PENDING,
            scheduledDate: now()->addDay(),
            zone: $zone,
        );

        $response = $this->actingAs($admin, 'admin')->post(route('admin.deliveries.auto-assign'), [
            'date' => now()->toDateString(),
            'subscription_only' => true,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', '1 subscription deliveries assigned for the selected date.');

        $this->assertNotNull($dueTodaySubscription->fresh()->driver_id);
        $this->assertNull($dueTodayOneTime->fresh()->driver_id);
        $this->assertNull($tomorrowSubscription->fresh()->driver_id);
    }

    public function test_admin_can_auto_assign_all_due_today_deliveries(): void
    {
        /** @var Admin $admin */
        $admin = Admin::factory()->create();

        $zone = Zone::factory()->create();
        $this->createDriverForZone($zone);

        $dueTodaySubscription = $this->createDelivery(
            type: Order::TYPE_SUBSCRIPTION,
            withSubscription: true,
            status: Delivery::STATUS_PENDING,
            scheduledDate: now(),
            zone: $zone,
        );

        $dueTodayOneTime = $this->createDelivery(
            type: Order::TYPE_ONE_TIME,
            withSubscription: false,
            status: Delivery::STATUS_PENDING,
            scheduledDate: now(),
            zone: $zone,
        );

        $tomorrowOneTime = $this->createDelivery(
            type: Order::TYPE_ONE_TIME,
            withSubscription: false,
            status: Delivery::STATUS_PENDING,
            scheduledDate: now()->addDay(),
            zone: $zone,
        );

        $response = $this->actingAs($admin, 'admin')->post(route('admin.deliveries.auto-assign'), [
            'date' => now()->toDateString(),
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', '2 deliveries assigned for the selected date.');

        $this->assertNotNull($dueTodaySubscription->fresh()->driver_id);
        $this->assertNotNull($dueTodayOneTime->fresh()->driver_id);
        $this->assertNull($tomorrowOneTime->fresh()->driver_id);
    }

    private function createDelivery(
        string $type,
        bool $withSubscription,
        string $status = Delivery::STATUS_PENDING,
        ?CarbonInterface $scheduledDate = null,
        bool $hasProofImage = false,
        bool $isProofVerified = false,
        ?Zone $zone = null,
    ): Delivery {
        $zone = $zone ?? Zone::factory()->create([
            'name' => 'Zone '.uniqid('', true),
            'code' => 'Z-'.str_replace('.', '', uniqid('', true)),
        ]);
        $user = User::factory()->customer()->create();

        $address = UserAddress::factory()->create([
            'user_id' => $user->id,
            'zone_id' => $zone->id,
        ]);

        $subscriptionId = null;
        if ($withSubscription) {
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

            $subscriptionId = $subscription->id;
        }

        $order = Order::query()->create([
            'user_id' => $user->id,
            'user_address_id' => $address->id,
            'subscription_id' => $subscriptionId,
            'vertical' => $withSubscription ? 'society_fresh' : 'daily_fresh',
            'type' => $type,
            'status' => Order::STATUS_PENDING,
            'subtotal' => 120,
            'discount' => 0,
            'delivery_charge' => 0,
            'total' => 120,
            'currency' => 'INR',
            'payment_status' => Order::PAYMENT_PENDING,
            'scheduled_delivery_date' => ($scheduledDate ?? ($withSubscription ? now()->addDay() : now()))->toDateString(),
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
            'status' => $status,
            'scheduled_date' => $order->scheduled_delivery_date,
            'delivery_proof_image' => $hasProofImage ? 'https://example.com/proof.jpg' : null,
            'delivery_proof_verified' => $isProofVerified,
        ]);
    }

    private function createDriverForZone(Zone $zone): Driver
    {
        $driverUser = User::factory()->driver()->create();

        return Driver::query()->create([
            'user_id' => $driverUser->id,
            'employee_id' => 'DRV-'.$zone->id.'-'.$driverUser->id,
            'zone_id' => $zone->id,
            'phone' => (string) $driverUser->phone,
            'is_active' => true,
        ]);
    }
}
