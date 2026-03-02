<?php

namespace Tests\Feature\Coupon;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CouponCartFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_apply_coupon_to_cart(): void
    {
        $user = User::factory()->customer()->create();
        $product = Product::factory()->create(['price' => 100]);

        $cart = Cart::query()->create([
            'user_id' => $user->id,
            'expires_at' => now()->addDays(7),
        ]);

        CartItem::query()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 100,
            'subtotal' => 100,
            'vertical' => 'daily_fresh',
            'is_subscription' => false,
        ]);

        $cart->calculateTotals();

        Coupon::query()->create([
            'code' => 'SAVE10',
            'name' => 'Save 10%',
            'type' => Coupon::TYPE_PERCENTAGE,
            'value' => 10,
            'is_active' => true,
            'applicable_to' => Coupon::APPLICABLE_ALL,
            'exclude_free_samples' => false,
            'exclude_subscriptions' => false,
            'first_order_only' => false,
            'new_users_only' => false,
        ]);

        $response = $this->actingAs($user)
            ->from('/cart')
            ->post('/coupons/apply', [
                'code' => 'SAVE10',
            ]);

        $response->assertRedirect('/cart');
        $response->assertSessionHas('success');

        $cart->refresh();

        $this->assertSame('SAVE10', $cart->coupon_code);
        $this->assertEquals(10.00, (float) $cart->discount);
        $this->assertEquals(90.00, (float) $cart->total);
    }

    public function test_authenticated_user_can_remove_coupon_from_cart(): void
    {
        $user = User::factory()->customer()->create();
        $product = Product::factory()->create(['price' => 100]);

        $cart = Cart::query()->create([
            'user_id' => $user->id,
            'coupon_code' => 'SAVE10',
            'discount' => 10,
            'subtotal' => 100,
            'total' => 90,
            'expires_at' => now()->addDays(7),
        ]);

        CartItem::query()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 100,
            'subtotal' => 100,
            'vertical' => 'daily_fresh',
            'is_subscription' => false,
        ]);

        $cart->calculateTotals();

        $cart->update([
            'coupon_code' => 'SAVE10',
            'discount' => 10,
            'total' => 90,
        ]);

        $response = $this->actingAs($user)
            ->from('/cart')
            ->delete('/coupons/remove');

        $response->assertRedirect('/cart');
        $response->assertSessionHas('success', 'Coupon removed.');

        $cart->refresh();

        $this->assertNull($cart->coupon_id);
        $this->assertNull($cart->coupon_code);
        $this->assertEquals(0.00, (float) $cart->discount);
        $this->assertEquals(100.00, (float) $cart->total);
    }

    public function test_guest_is_redirected_when_trying_to_apply_coupon(): void
    {
        $response = $this->post('/coupons/apply', [
            'code' => 'SAVE10',
        ]);

        $response->assertRedirect('/login');
    }

    public function test_cart_page_contains_available_coupons_for_authenticated_user(): void
    {
        $user = User::factory()->customer()->create();
        $zone = Zone::factory()->create(['is_active' => true]);

        UserAddress::factory()->create([
            'user_id' => $user->id,
            'zone_id' => $zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);

        Coupon::query()->create([
            'code' => 'WELCOME50',
            'name' => 'Welcome Offer',
            'type' => Coupon::TYPE_FIXED,
            'value' => 50,
            'is_active' => true,
            'applicable_to' => Coupon::APPLICABLE_ALL,
            'exclude_free_samples' => false,
            'exclude_subscriptions' => false,
            'first_order_only' => false,
            'new_users_only' => false,
        ]);

        $response = $this->actingAs($user)->get('/cart');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('available_coupons.0')
            ->where('available_coupons.0.code', 'WELCOME50')
        );
    }
}
