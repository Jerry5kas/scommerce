<?php

namespace Tests\Feature;

use App\Enums\BusinessVertical;
use App\Models\Product;
use App\Models\ProductRelation;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Zone $zone;

    protected function setUp(): void
    {
        parent::setUp();

        $this->zone = Zone::factory()->create([
            'is_active' => true,
            'verticals' => [BusinessVertical::DailyFresh->value],
        ]);

        $this->user = User::factory()->create();
        UserAddress::factory()->create([
            'user_id' => $this->user->id,
            'zone_id' => $this->zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);
    }

    public function test_product_shows_related_products(): void
    {
        $product = Product::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $relatedProduct = Product::factory()->create([
            'category_id' => $product->category_id,
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $product->zones()->attach($this->zone->id, ['is_available' => true, 'stock_quantity' => 100]);
        $relatedProduct->zones()->attach($this->zone->id, ['is_available' => true, 'stock_quantity' => 100]);

        $response = $this->actingAs($this->user)->get(route('products.related', [
            'product' => $product->id,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));

        $response->assertOk();
        $response->assertJsonStructure(['products']);
    }

    public function test_product_shows_cross_sell_products(): void
    {
        $product = Product::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $crossSellProduct = Product::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $product->zones()->attach($this->zone->id, ['is_available' => true, 'stock_quantity' => 100]);
        $crossSellProduct->zones()->attach($this->zone->id, ['is_available' => true, 'stock_quantity' => 100]);

        ProductRelation::factory()->create([
            'product_id' => $product->id,
            'related_product_id' => $crossSellProduct->id,
            'relation_type' => ProductRelation::TYPE_CROSS_SELL,
        ]);

        $response = $this->actingAs($this->user)->get(route('catalog.product', [
            'product' => $product->slug,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('crossSellProducts', 1)
        );
    }

    public function test_product_shows_upsell_products(): void
    {
        $product = Product::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $upsellProduct = Product::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $product->zones()->attach($this->zone->id, ['is_available' => true, 'stock_quantity' => 100]);
        $upsellProduct->zones()->attach($this->zone->id, ['is_available' => true, 'stock_quantity' => 100]);

        ProductRelation::factory()->create([
            'product_id' => $product->id,
            'related_product_id' => $upsellProduct->id,
            'relation_type' => ProductRelation::TYPE_UPSELL,
        ]);

        $response = $this->actingAs($this->user)->get(route('catalog.product', [
            'product' => $product->slug,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('upsellProducts', 1)
        );
    }
}
