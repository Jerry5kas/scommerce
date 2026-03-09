<?php

namespace Tests\Feature\Cart;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddToTomorrowDeliveryTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_add_to_tomorrow_delivery_schedules_for_next_day_before_cutoff(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-03-08 21:00:00'));
        config()->set('business.next_day_cutoff_time', '22:30');

        $user = User::factory()->customer()->create();
        $address = $this->createDefaultAddress($user);
        $this->createCartWithItem($user, quantity: 2, price: 60);

        $response = $this->actingAs($user)
            ->post(route('cart.add-to-tomorrow-delivery'));

        $response->assertRedirectContains('/orders/');

        $order = Order::query()->where('user_id', $user->id)->latest('id')->first();
        $this->assertNotNull($order);
        $this->assertSame($address->id, $order->user_address_id);
        $this->assertSame('2026-03-09', $order->scheduled_delivery_date?->toDateString());

        $this->assertDatabaseHas('deliveries', [
            'order_id' => $order->id,
            'user_id' => $user->id,
            'user_address_id' => $address->id,
            'status' => Delivery::STATUS_PENDING,
        ]);

        $cart = Cart::query()->where('user_id', $user->id)->first();
        $this->assertNotNull($cart);
        $this->assertSame(0, $cart->itemCount());
    }

    public function test_add_to_tomorrow_delivery_shifts_to_day_after_when_after_cutoff(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-03-08 23:00:00'));
        config()->set('business.next_day_cutoff_time', '22:30');

        $user = User::factory()->customer()->create();
        $this->createDefaultAddress($user);
        $this->createCartWithItem($user, quantity: 1, price: 80);

        $response = $this->actingAs($user)
            ->post(route('cart.add-to-tomorrow-delivery'));

        $response->assertRedirectContains('/orders/');

        $order = Order::query()->where('user_id', $user->id)->latest('id')->first();
        $this->assertNotNull($order);
        $this->assertSame('2026-03-10', $order->scheduled_delivery_date?->toDateString());
    }

    public function test_add_to_tomorrow_delivery_merges_into_existing_due_order(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-03-08 21:00:00'));
        config()->set('business.next_day_cutoff_time', '22:30');

        $zone = Zone::factory()->create([
            'is_active' => true,
            'min_order_amount' => 0,
        ]);
        $user = User::factory()->customer()->create();
        $address = UserAddress::factory()->create([
            'user_id' => $user->id,
            'zone_id' => $zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'price' => 50,
            'is_active' => true,
            'is_in_stock' => true,
        ]);
        $product->zones()->attach($zone->id, ['is_available' => true]);

        $order = Order::query()->create([
            'user_id' => $user->id,
            'user_address_id' => $address->id,
            'vertical' => 'daily_fresh',
            'type' => Order::TYPE_ONE_TIME,
            'status' => Order::STATUS_PENDING,
            'subtotal' => 50,
            'discount' => 0,
            'delivery_charge' => 0,
            'total' => 50,
            'currency' => 'INR',
            'payment_status' => Order::PAYMENT_PENDING,
            'payment_method' => 'wallet',
            'scheduled_delivery_date' => '2026-03-09',
        ]);

        OrderItem::query()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'product_image' => $product->image,
            'quantity' => 1,
            'price' => 50,
            'subtotal' => 50,
            'is_free_sample' => false,
        ]);

        Delivery::query()->create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'user_address_id' => $address->id,
            'zone_id' => $zone->id,
            'status' => Delivery::STATUS_PENDING,
            'scheduled_date' => '2026-03-09',
        ]);

        $cart = Cart::query()->create([
            'user_id' => $user->id,
            'expires_at' => now()->addDays(7),
        ]);

        CartItem::query()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 50,
            'subtotal' => 100,
            'vertical' => 'daily_fresh',
            'is_subscription' => false,
        ]);

        $response = $this->actingAs($user)
            ->post(route('cart.add-to-tomorrow-delivery'));

        $response->assertRedirect(route('orders.show', $order));

        $order->refresh()->load('items');
        $this->assertCount(1, $order->items);
        $this->assertSame(3, $order->items->first()->quantity);
        $this->assertSame(150.0, (float) $order->subtotal);
        $this->assertSame(150.0, (float) $order->total);

        $this->assertSame(1, Order::query()->where('user_id', $user->id)->count());
        $this->assertSame(0, $cart->fresh()->itemCount());
    }

    private function createDefaultAddress(User $user): UserAddress
    {
        $zone = Zone::factory()->create([
            'is_active' => true,
            'min_order_amount' => 0,
        ]);

        return UserAddress::factory()->create([
            'user_id' => $user->id,
            'zone_id' => $zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);
    }

    private function createCartWithItem(User $user, int $quantity, float $price): void
    {
        $cart = Cart::query()->create([
            'user_id' => $user->id,
            'expires_at' => now()->addDays(7),
        ]);

        $product = Product::factory()->create([
            'price' => $price,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $zoneId = $user->addresses()->where('is_default', true)->value('zone_id');
        if ($zoneId !== null) {
            $product->zones()->attach((int) $zoneId, ['is_available' => true]);
        }

        CartItem::query()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'price' => $price,
            'subtotal' => $quantity * $price,
            'vertical' => 'daily_fresh',
            'is_subscription' => false,
        ]);
    }
}
