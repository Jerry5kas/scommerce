<?php

namespace Tests\Feature;

use App\Enums\BusinessVertical;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Zone $zone;

    protected function setUp(): void
    {
        parent::setUp();

        // clear any cache entries created by other tests; our service caches heavily
        \Illuminate\Support\Facades\Cache::flush();

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

    public function test_home_page_displays_catalog(): void
    {
        $category = Category::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $product->zones()->attach($this->zone->id, [
            'is_available' => true,
            'stock_quantity' => 100,
        ]);

        $response = $this->actingAs($this->user)->get(route('catalog.home', ['vertical' => BusinessVertical::DailyFresh->value]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('catalog/home')
            ->has('categories')
            ->has('featuredProducts')
            ->has('zone')
            ->where('zone.id', $this->zone->id)
        );
    }

    public function test_category_page_displays_products(): void
    {
        $category = Category::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $product->zones()->attach($this->zone->id, [
            'is_available' => true,
            'stock_quantity' => 100,
        ]);

        // ensure pivot created correctly
        $this->assertDatabaseHas('product_zones', [
            'product_id' => $product->id,
            'zone_id' => $this->zone->id,
            'is_available' => true,
        ]);

        $response = $this->actingAs($this->user)->get(route('catalog.category', [
            'category' => $category->slug,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));

        $response->assertOk();

        $response->assertInertia(fn ($page) => $page
            ->component('catalog/category')
            ->has('products', 1)
        );
    }

    public function test_collection_page_displays_products(): void
    {
        $collection = Collection::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'collection_id' => $collection->id,
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $product->zones()->attach($this->zone->id, [
            'is_available' => true,
            'stock_quantity' => 100,
        ]);

        $response = $this->actingAs($this->user)->get(route('catalog.collection', [
            'collection' => $collection->slug,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('catalog/collection')
            ->has('products', 1)
        );
    }

    public function test_product_detail_page_displays_product(): void
    {
        $product = Product::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $product->zones()->attach($this->zone->id, [
            'is_available' => true,
            'stock_quantity' => 100,
        ]);

        $response = $this->actingAs($this->user)->get(route('catalog.product', [
            'product' => $product->slug,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('product-detail')
            ->has('product')
        );
    }

    public function test_search_returns_products(): void
    {
        $product = Product::factory()->create([
            'name' => 'Fresh Tomatoes',
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $product->zones()->attach($this->zone->id, [
            'is_available' => true,
            'stock_quantity' => 100,
        ]);

        $response = $this->actingAs($this->user)->get(route('catalog.search', [
            'q' => 'Tomatoes',
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('catalog/search')
            ->has('products', 1)
        );
    }

    public function test_products_filtered_by_vertical(): void
    {
        $dailyFreshProduct = Product::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $societyFreshProduct = Product::factory()->create([
            'vertical' => BusinessVertical::SocietyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $dailyFreshProduct->zones()->attach($this->zone->id, ['is_available' => true, 'stock_quantity' => 100]);
        $societyFreshProduct->zones()->attach($this->zone->id, ['is_available' => true, 'stock_quantity' => 100]);

        $response = $this->actingAs($this->user)->get(route('products', [
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('products', 1)
            ->where('products.0.id', $dailyFreshProduct->id)
        );
    }

    public function test_routes_redirect_when_user_has_no_zone(): void
    {
        $user = User::factory()->create();

        $category = Category::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
        ]);

        $collection = Collection::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        // product page
        $response = $this->actingAs($user)->get(route('catalog.product', [
            'product' => $product->slug,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));
        $response->assertRedirect(route('location.select'));

        // category page
        $response = $this->actingAs($user)->get(route('catalog.category', [
            'category' => $category->slug,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));
        $response->assertRedirect(route('location.select'));

        // collection page
        $response = $this->actingAs($user)->get(route('catalog.collection', [
            'collection' => $collection->slug,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));
        $response->assertRedirect(route('location.select'));

        // search page
        $response = $this->actingAs($user)->get(route('catalog.search', [
            'q' => 'foo',
            'vertical' => BusinessVertical::DailyFresh->value,
        ]));
        $response->assertRedirect(route('location.select'));
    }
}
