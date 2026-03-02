<?php

namespace Tests\Feature\Cart;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartSessionManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_add_a_product_to_cart_using_session(): void
    {
        $zone = Zone::factory()->create();
        $product = Product::factory()->create(['price' => 42.50]);

        $this->startSession();
        session(['guest_zone_id' => $zone->id]);

        $response = $this->from('/products')->post('/cart/add', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertRedirect('/products');

        $cart = Cart::query()->where('session_id', session()->getId())->first();

        $this->assertNotNull($cart);
        $this->assertSame(2, $cart->itemCount());
        $this->assertEquals(85.00, (float) $cart->subtotal);

        $item = CartItem::query()->where('cart_id', $cart->id)->where('product_id', $product->id)->first();

        $this->assertNotNull($item);
        $this->assertSame(2, $item->quantity);
    }

    public function test_guest_can_update_and_remove_a_cart_item(): void
    {
        $zone = Zone::factory()->create();
        $product = Product::factory()->create(['price' => 20]);

        $this->startSession();
        session(['guest_zone_id' => $zone->id]);

        $cart = Cart::query()->create([
            'session_id' => session()->getId(),
            'expires_at' => now()->addDays(7),
        ]);

        $cartItem = CartItem::query()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 20,
            'subtotal' => 20,
            'vertical' => 'daily_fresh',
            'is_subscription' => false,
        ]);

        $updateResponse = $this->from('/cart')->put("/cart/items/{$cartItem->id}", [
            'quantity' => 3,
        ]);

        $updateResponse->assertRedirect('/cart');

        $cartItem->refresh();
        $this->assertSame(3, $cartItem->quantity);

        $deleteResponse = $this->from('/cart')->delete("/cart/items/{$cartItem->id}");

        $deleteResponse->assertRedirect('/cart');
        $this->assertDatabaseMissing('cart_items', ['id' => $cartItem->id]);
    }
}
