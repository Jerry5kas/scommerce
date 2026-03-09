<?php

namespace Tests\Feature;

use App\Enums\BusinessVertical;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SubscriptionCreatePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_subscription_create_page_loads_with_frequency_options(): void
    {
        /** @var User $user */
        $user = User::factory()->create();
        $zone = Zone::factory()->create([
            'is_active' => true,
            'verticals' => [BusinessVertical::SocietyFresh->value],
        ]);

        UserAddress::factory()->create([
            'user_id' => $user->id,
            'zone_id' => $zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);

        SubscriptionPlan::query()->create([
            'name' => 'Daily Plan',
            'description' => 'Daily deliveries',
            'frequency_type' => SubscriptionPlan::FREQUENCY_DAILY,
            'discount_type' => SubscriptionPlan::DISCOUNT_NONE,
            'discount_value' => 0,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($user)->get(route('subscriptions.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('subscriptions/create')
            ->where('frequencyOptions.daily', 'Daily')
            ->where('frequencyOptions.alternate', 'Alternate Days')
            ->where('frequencyOptions.weekly', 'Weekly')
            ->where('frequencyOptions.custom', 'Custom')
        );
    }

    public function test_subscription_create_page_only_shows_society_fresh_eligible_products(): void
    {
        /** @var User $user */
        $user = User::factory()->create();
        $zone = Zone::factory()->create([
            'is_active' => true,
            'verticals' => [BusinessVertical::SocietyFresh->value],
        ]);

        UserAddress::factory()->create([
            'user_id' => $user->id,
            'zone_id' => $zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);

        SubscriptionPlan::query()->create([
            'name' => 'Daily Plan',
            'description' => 'Daily deliveries',
            'frequency_type' => SubscriptionPlan::FREQUENCY_DAILY,
            'discount_type' => SubscriptionPlan::DISCOUNT_NONE,
            'discount_value' => 0,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $societyProduct = Product::factory()->create([
            'name' => 'Alpha Society Product',
            'vertical' => BusinessVertical::SocietyFresh->value,
            'is_subscription_eligible' => true,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $bothProduct = Product::factory()->create([
            'name' => 'Bravo Both Product',
            'vertical' => Product::VERTICAL_BOTH,
            'is_subscription_eligible' => true,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        Product::factory()->create([
            'name' => 'Charlie Daily Product',
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_subscription_eligible' => true,
            'is_active' => true,
            'is_in_stock' => true,
        ])->zones()->attach($zone->id, ['is_available' => true, 'stock_quantity' => 100]);

        $societyProduct->zones()->attach($zone->id, ['is_available' => true, 'stock_quantity' => 100]);
        $bothProduct->zones()->attach($zone->id, ['is_available' => true, 'stock_quantity' => 100]);

        $response = $this->actingAs($user)->get(route('subscriptions.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('subscriptions/create')
            ->has('products', 2)
            ->where('products', fn ($products) => collect($products)
                ->pluck('id')
                ->sort()
                ->values()
                ->all() === [$societyProduct->id, $bothProduct->id])
        );
    }
}
