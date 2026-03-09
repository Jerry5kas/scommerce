<?php

namespace Tests\Feature\Admin;

use App\Enums\BusinessVertical;
use App\Models\Admin;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCollectionCustomizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_manual_collection_with_selected_categories_and_products(): void
    {
        /** @var Admin $admin */
        $admin = Admin::factory()->create();
        $categoryA = Category::factory()->create();
        $categoryB = Category::factory()->create();
        $productA = Product::factory()->create(['category_id' => $categoryA->id]);
        $productB = Product::factory()->create(['category_id' => $categoryB->id]);

        $response = $this->actingAs($admin, 'admin')->post(route('admin.collections.store'), [
            'name' => 'Daily Best Sellers',
            'slug' => 'daily-best-sellers',
            'description' => 'Custom collection for testing.',
            'category_id' => null,
            'product_selection_mode' => Collection::PRODUCT_SELECTION_MANUAL,
            'category_selection_mode' => Collection::CATEGORY_SELECTION_SELECTED,
            'category_ids' => [$categoryA->id],
            'product_ids' => [$productA->id, $productB->id],
            'random_products_limit' => 9,
            'banner_image' => '/images/collection-banner.png',
            'banner_mobile_image' => '/images/collection-banner-mobile.png',
            'display_order' => 1,
            'is_active' => true,
            'vertical' => BusinessVertical::DailyFresh->value,
            'starts_at' => null,
            'ends_at' => null,
            'link_url' => null,
            'meta_title' => null,
            'meta_description' => null,
        ]);

        $response->assertRedirect(route('admin.collections.index'));

        $collection = Collection::query()->where('slug', 'daily-best-sellers')->firstOrFail();

        $this->assertSame(Collection::PRODUCT_SELECTION_MANUAL, $collection->product_selection_mode);
        $this->assertSame(Collection::CATEGORY_SELECTION_SELECTED, $collection->category_selection_mode);
        $this->assertSame([$categoryA->id], array_values(array_map('intval', $collection->category_ids ?? [])));
        $this->assertSame([
            $productA->id,
        ], array_values(array_map('intval', $collection->product_ids ?? [])), 'Products should be constrained to selected categories only.');
    }

    public function test_admin_update_random_mode_clears_manual_product_ids_and_sets_limit(): void
    {
        /** @var Admin $admin */
        $admin = Admin::factory()->create();
        $category = Category::factory()->create();
        $productA = Product::factory()->create(['category_id' => $category->id]);
        $productB = Product::factory()->create(['category_id' => $category->id]);
        $collection = Collection::factory()->create([
            'name' => 'Editable Collection',
            'slug' => 'editable-collection',
            'banner_image' => '/images/original-banner.png',
            'product_selection_mode' => Collection::PRODUCT_SELECTION_MANUAL,
            'category_selection_mode' => Collection::CATEGORY_SELECTION_SELECTED,
            'category_ids' => [$category->id],
            'product_ids' => [$productA->id, $productB->id],
            'random_products_limit' => 5,
            'vertical' => BusinessVertical::DailyFresh->value,
        ]);

        $response = $this->actingAs($admin, 'admin')->put(route('admin.collections.update', $collection), [
            'name' => $collection->name,
            'slug' => $collection->slug,
            'description' => $collection->description,
            'category_id' => null,
            'product_selection_mode' => Collection::PRODUCT_SELECTION_RANDOM,
            'category_selection_mode' => Collection::CATEGORY_SELECTION_ALL,
            'category_ids' => [$category->id],
            'product_ids' => [$productA->id, $productB->id],
            'random_products_limit' => 7,
            'banner_image' => $collection->banner_image,
            'banner_mobile_image' => $collection->banner_mobile_image,
            'display_order' => $collection->display_order,
            'is_active' => true,
            'vertical' => BusinessVertical::DailyFresh->value,
            'starts_at' => null,
            'ends_at' => null,
            'link_url' => null,
            'meta_title' => null,
            'meta_description' => null,
        ]);

        $response->assertRedirect(route('admin.collections.index'));

        $collection->refresh();

        $this->assertSame(Collection::PRODUCT_SELECTION_RANDOM, $collection->product_selection_mode);
        $this->assertSame(Collection::CATEGORY_SELECTION_ALL, $collection->category_selection_mode);
        $this->assertSame([], array_values(array_map('intval', $collection->category_ids ?? [])));
        $this->assertSame([], array_values(array_map('intval', $collection->product_ids ?? [])));
        $this->assertSame(7, $collection->random_products_limit);
    }

    public function test_configured_products_query_returns_only_matching_products_for_selected_category_mode(): void
    {
        $categoryA = Category::factory()->create();
        $categoryB = Category::factory()->create();
        $matchingProduct = Product::factory()->create([
            'category_id' => $categoryA->id,
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        Product::factory()->create([
            'category_id' => $categoryB->id,
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        Product::factory()->create([
            'category_id' => $categoryA->id,
            'vertical' => BusinessVertical::SocietyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $collection = Collection::factory()->create([
            'product_selection_mode' => Collection::PRODUCT_SELECTION_CATEGORY,
            'category_selection_mode' => Collection::CATEGORY_SELECTION_SELECTED,
            'category_ids' => [$categoryA->id],
            'vertical' => Collection::VERTICAL_BOTH,
            'banner_image' => '/images/collection-banner.png',
        ]);

        $productIds = $collection->configuredProductsQuery(BusinessVertical::DailyFresh->value)
            ->pluck('id')
            ->map(fn (int $id) => (int) $id)
            ->values()
            ->all();

        $this->assertSame([$matchingProduct->id], $productIds);

        $this->assertSame(1, $collection->configuredProductsCount(BusinessVertical::DailyFresh->value));
    }

    public function test_admin_can_update_collection_banners_and_metadata_fields(): void
    {
        /** @var Admin $admin */
        $admin = Admin::factory()->create();
        $category = Category::factory()->create();
        $collection = Collection::factory()->create([
            'name' => 'Customer Favourites',
            'slug' => 'customer-favourites',
            'description' => 'Initial description',
            'category_id' => $category->id,
            'product_selection_mode' => Collection::PRODUCT_SELECTION_MANUAL,
            'category_selection_mode' => Collection::CATEGORY_SELECTION_ALL,
            'category_ids' => [],
            'product_ids' => [],
            'random_products_limit' => 12,
            'banner_image' => '/images/old-desktop.png',
            'banner_mobile_image' => '/images/old-mobile.png',
            'display_order' => 0,
            'is_active' => true,
            'vertical' => BusinessVertical::DailyFresh->value,
            'starts_at' => null,
            'ends_at' => null,
            'link_url' => null,
            'meta_title' => null,
            'meta_description' => null,
        ]);

        $response = $this->actingAs($admin, 'admin')->put(route('admin.collections.update', $collection), [
            'name' => 'Customer Favourites Updated',
            'slug' => 'customer-favourites-updated',
            'description' => 'Updated description',
            'category_id' => null,
            'product_selection_mode' => Collection::PRODUCT_SELECTION_CATEGORY,
            'category_selection_mode' => Collection::CATEGORY_SELECTION_ALL,
            'category_ids' => [],
            'product_ids' => [],
            'random_products_limit' => 15,
            'banner_image' => 'https://ik.imagekit.io/example/new-desktop.png',
            'banner_mobile_image' => 'https://ik.imagekit.io/example/new-mobile.png',
            'display_order' => 3,
            'is_active' => false,
            'vertical' => Collection::VERTICAL_BOTH,
            'starts_at' => '2026-03-08 08:00:00',
            'ends_at' => '2026-03-12 20:00:00',
            'link_url' => 'https://example.com/collections/customer-favourites',
            'meta_title' => 'Updated Meta Title',
            'meta_description' => 'Updated Meta Description',
        ]);

        $response->assertRedirect(route('admin.collections.index'));

        $collection->refresh();

        $this->assertSame('Customer Favourites Updated', $collection->name);
        $this->assertSame('customer-favourites-updated', $collection->slug);
        $this->assertSame('Updated description', $collection->description);
        $this->assertNull($collection->category_id);
        $this->assertSame(Collection::PRODUCT_SELECTION_CATEGORY, $collection->product_selection_mode);
        $this->assertSame(Collection::CATEGORY_SELECTION_ALL, $collection->category_selection_mode);
        $this->assertSame(15, $collection->random_products_limit);
        $this->assertSame('https://ik.imagekit.io/example/new-desktop.png', $collection->banner_image);
        $this->assertSame('https://ik.imagekit.io/example/new-mobile.png', $collection->banner_mobile_image);
        $this->assertSame(3, $collection->display_order);
        $this->assertFalse($collection->is_active);
        $this->assertSame(Collection::VERTICAL_BOTH, $collection->vertical);
        $this->assertSame('https://example.com/collections/customer-favourites', $collection->link_url);
        $this->assertSame('Updated Meta Title', $collection->meta_title);
        $this->assertSame('Updated Meta Description', $collection->meta_description);
    }
}
