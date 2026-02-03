<?php

namespace Tests\Feature;

use App\Enums\BusinessVertical;
use App\Models\Product;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use App\Services\FreeSampleService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FreeSampleTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Zone $zone;

    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->zone = Zone::factory()->create([
            'is_active' => true,
            'verticals' => [BusinessVertical::DailyFresh->value],
        ]);

        $this->user = User::factory()->create([
            'free_sample_used' => false,
        ]);

        UserAddress::factory()->create([
            'user_id' => $this->user->id,
            'zone_id' => $this->zone->id,
            'is_default' => true,
            'is_active' => true,
        ]);

        $this->product = Product::factory()->create([
            'vertical' => BusinessVertical::DailyFresh->value,
            'is_active' => true,
            'is_in_stock' => true,
        ]);

        $this->product->zones()->attach($this->zone->id, [
            'is_available' => true,
            'stock_quantity' => 100,
        ]);
    }

    public function test_user_can_check_free_sample_eligibility(): void
    {
        $service = app(FreeSampleService::class);
        $isEligible = $service->checkEligibility($this->user, $this->product);

        $this->assertTrue($isEligible);
    }

    public function test_user_can_claim_free_sample(): void
    {
        $service = app(FreeSampleService::class);
        $sample = $service->claimSample($this->user, $this->product, '9876543210', 'device-001');

        $this->assertNotNull($sample);
        $this->assertEquals($this->product->id, $sample->product_id);
        $this->assertEquals($this->user->id, $sample->user_id);
        $this->assertFalse($sample->is_used);

        // User should be marked as having used free sample
        $this->user->refresh();
        $this->assertTrue($this->user->free_sample_used);
    }

    public function test_user_cannot_claim_free_sample_twice(): void
    {
        $service = app(FreeSampleService::class);
        $service->claimSample($this->user, $this->product, '9876543210', 'device-001');

        $isEligible = $service->checkEligibility($this->user, $this->product);
        $this->assertFalse($isEligible);

        $this->expectException(\RuntimeException::class);
        $service->claimSample($this->user, $this->product, '9876543210', 'device-001');
    }

    public function test_free_sample_claim_endpoint(): void
    {
        $response = $this->actingAs($this->user)->post(route('products.free-sample.claim', $this->product->id), [
            'phone' => '9876543210',
            'device_fingerprint' => 'device-001',
        ]);

        $response->assertOk();
        $response->assertJsonStructure(['success', 'message', 'sample']);

        $this->assertDatabaseHas('free_samples', [
            'product_id' => $this->product->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_free_sample_eligibility_endpoint(): void
    {
        $response = $this->actingAs($this->user)->get(route('products.free-sample.check', $this->product->id), [
            'phone' => '9876543210',
            'device_fingerprint' => 'device-001',
        ]);

        $response->assertOk();
        $response->assertJson(['eligible' => true]);
    }

    public function test_free_sample_prevented_by_phone_hash(): void
    {
        $service = app(FreeSampleService::class);
        $service->claimSample($this->user, $this->product, '9876543210', 'device-001');

        // Try to claim with same phone but different device
        $isEligible = $service->checkEligibility(null, $this->product, '9876543210', 'device-002');
        $this->assertFalse($isEligible);
    }

    public function test_free_sample_prevented_by_device_hash(): void
    {
        $service = app(FreeSampleService::class);
        $service->claimSample($this->user, $this->product, '9876543210', 'device-001');

        // Try to claim with same device but different phone
        $isEligible = $service->checkEligibility(null, $this->product, '9876543211', 'device-001');
        $this->assertFalse($isEligible);
    }
}
