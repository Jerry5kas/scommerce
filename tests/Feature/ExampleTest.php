<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_access_home(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
    }

    public function test_authenticated_user_with_default_serviceable_address_can_access_home(): void
    {
        $zone = Zone::factory()->create([
            'is_active' => true,
        ]);

        $user = User::factory()->create();

        UserAddress::factory()->create([
            'user_id' => $user->id,
            'zone_id' => $zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->get(route('home'));

        $response->assertOk();
    }
}
