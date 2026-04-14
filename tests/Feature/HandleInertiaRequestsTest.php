<?php

namespace Tests\Feature;

use App\Enums\BusinessVertical;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HandleInertiaRequestsTest extends TestCase
{
    use RefreshDatabase;

    public function test_society_fresh_only_zone_shares_correct_vertical_and_available_verticals(): void
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

        $this->actingAs($user)
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home')
                ->where('currentVertical', BusinessVertical::SocietyFresh->value)
                ->where('availableVerticals', [BusinessVertical::SocietyFresh->value])
            );
    }

    public function test_stale_daily_fresh_session_is_overridden_for_society_fresh_only_zone(): void
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

        $this->actingAs($user)
            ->withSession(['vertical' => BusinessVertical::DailyFresh->value])
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home')
                ->where('currentVertical', BusinessVertical::SocietyFresh->value)
            );
    }

    public function test_both_vertical_zone_preserves_normal_resolution_chain(): void
    {
        /** @var User $user */
        $user = User::factory()->create();
        $zone = Zone::factory()->create([
            'is_active' => true,
            'verticals' => [BusinessVertical::DailyFresh->value, BusinessVertical::SocietyFresh->value],
        ]);

        UserAddress::factory()->create([
            'user_id' => $user->id,
            'zone_id' => $zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home')
                ->where('currentVertical', BusinessVertical::DailyFresh->value)
                ->where('availableVerticals', BusinessVertical::values())
            );
    }

    public function test_unauthenticated_user_gets_all_verticals_as_available(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home')
                ->where('availableVerticals', BusinessVertical::values())
            );
    }
}
