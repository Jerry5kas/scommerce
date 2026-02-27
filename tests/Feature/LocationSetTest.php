<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class LocationSetTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_authenticated_user_can_set_location_and_create_default_address(): void
    {
        $user = User::factory()->create();
        $zone = Zone::factory()->create([
            'is_active' => true,
            'pincodes' => ['682001'],
        ]);

        $response = $this->actingAs($user)->post(route('location.set'), [
            'type' => UserAddress::TYPE_HOME,
            'label' => 'Selected location',
            'address_line_1' => 'Marine Drive',
            'city' => 'Kochi',
            'state' => 'Kerala',
            'pincode' => '682001',
            'latitude' => 10.000001,
            'longitude' => 76.000001,
        ]);

        $response->assertRedirect(route('catalog.home'));
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('user_addresses', [
            'user_id' => $user->id,
            'address_line_1' => 'Marine Drive',
            'city' => 'Kochi',
            'state' => 'Kerala',
            'pincode' => '682001',
            'zone_id' => $zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);
    }

    public function test_setting_location_updates_existing_default_address(): void
    {
        $user = User::factory()->create();
        Zone::factory()->create([
            'is_active' => true,
            'pincodes' => ['682002'],
        ]);

        $address = UserAddress::factory()->create([
            'user_id' => $user->id,
            'is_default' => true,
            'is_active' => true,
            'address_line_1' => 'Old Address',
            'pincode' => '600001',
        ]);

        $this->actingAs($user)->post(route('location.set'), [
            'type' => UserAddress::TYPE_HOME,
            'label' => 'Selected location',
            'address_line_1' => 'Panampilly Nagar',
            'city' => 'Kochi',
            'state' => 'Kerala',
            'pincode' => '682002',
            'latitude' => 10.010001,
            'longitude' => 76.010001,
        ])->assertRedirect(route('catalog.home'));

        $this->assertDatabaseCount('user_addresses', 1);
        $this->assertDatabaseHas('user_addresses', [
            'id' => $address->id,
            'address_line_1' => 'Panampilly Nagar',
            'pincode' => '682002',
            'is_default' => true,
            'is_active' => true,
        ]);
    }

    public function test_setting_non_serviceable_location_returns_validation_error(): void
    {
        $user = User::factory()->create();

        $response = $this->from(route('location.select'))
            ->actingAs($user)
            ->post(route('location.set'), [
                'type' => UserAddress::TYPE_HOME,
                'label' => 'Selected location',
                'address_line_1' => 'Unknown Place',
                'city' => 'Nowhere',
                'state' => 'Unknown',
                'pincode' => '999999',
                'latitude' => 12.000001,
                'longitude' => 77.000001,
            ]);

        $response->assertRedirect(route('location.select'));
        $response->assertSessionHasErrors('location');
        $this->assertDatabaseMissing('user_addresses', [
            'user_id' => $user->id,
            'pincode' => '999999',
        ]);
    }

    public function test_guest_cannot_set_location(): void
    {
        $response = $this->post(route('location.set'), [
            'type' => UserAddress::TYPE_HOME,
            'label' => 'Selected location',
            'address_line_1' => 'Marine Drive',
            'city' => 'Kochi',
            'state' => 'Kerala',
            'pincode' => '682001',
            'latitude' => 10.000001,
            'longitude' => 76.000001,
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_check_serviceability_returns_true_for_coordinates_inside_active_zone(): void
    {
        Zone::factory()->create([
            'is_active' => true,
            'boundary_coordinates' => [
                [10.0800, 76.2000],
                [10.0900, 76.2000],
                [10.0900, 76.2100],
                [10.0800, 76.2100],
            ],
            'service_time_start' => null,
            'service_time_end' => null,
        ]);

        $response = $this->postJson(route('location.check-serviceability'), [
            'latitude' => 10.0850,
            'longitude' => 76.2050,
        ]);

        $response->assertOk();
        $response->assertJsonPath('serviceable', true);
        $response->assertJsonStructure([
            'serviceable',
            'zone' => ['id', 'name', 'code', 'city', 'state', 'delivery_charge', 'min_order_amount'],
        ]);
    }

    public function test_check_serviceability_returns_false_for_coordinates_outside_zone(): void
    {
        Zone::factory()->create([
            'is_active' => true,
            'boundary_coordinates' => [
                [10.0800, 76.2000],
                [10.0900, 76.2000],
                [10.0900, 76.2100],
                [10.0800, 76.2100],
            ],
            'service_time_start' => null,
            'service_time_end' => null,
        ]);

        $response = $this->postJson(route('location.check-serviceability'), [
            'latitude' => 11.0000,
            'longitude' => 77.0000,
        ]);

        $response->assertOk();
        $response->assertJsonPath('serviceable', false);
        $response->assertJsonPath('zone', null);
    }

    public function test_setting_location_from_navbar_redirects_back(): void
    {
        $user = User::factory()->create();
        Zone::factory()->create([
            'is_active' => true,
            'pincodes' => ['682001'],
        ]);

        $response = $this->from(route('home'))
            ->actingAs($user)
            ->post(route('location.set'), [
                'from_navbar' => true,
                'type' => UserAddress::TYPE_HOME,
                'label' => 'Selected location',
                'address_line_1' => 'Marine Drive',
                'city' => 'Kochi',
                'state' => 'Kerala',
                'pincode' => '682001',
                'latitude' => 10.000001,
                'longitude' => 76.000001,
            ]);

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('message', 'Delivery location updated.');
    }
}
