<?php

namespace Tests\Feature;

use App\Enums\BusinessVertical;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class VerticalContextPersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_selected_vertical_persists_when_next_page_omits_query_parameter(): void
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

        $firstResponse = $this->actingAs($user)->get(route('home', ['vertical' => BusinessVertical::SocietyFresh->value]));

        $firstResponse->assertOk();
        $firstResponse->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->where('currentVertical', BusinessVertical::SocietyFresh->value)
        );

        $secondResponse = $this->actingAs($user)->get(route('home'));

        $secondResponse->assertOk();
        $secondResponse->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->where('currentVertical', BusinessVertical::SocietyFresh->value)
        );
    }
}
