<?php

namespace Tests\Feature\Coupon;

use App\Http\Middleware\RedirectIfNotAdminAuthenticated;
use App\Models\Coupon;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCouponValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(RedirectIfNotAdminAuthenticated::class);
        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_admin_coupon_store_rejects_percentage_above_hundred(): void
    {
        $response = $this->from('/admin/coupons/create')->post('/admin/coupons', [
            'code' => 'OVER100',
            'name' => 'Over 100%',
            'type' => Coupon::TYPE_PERCENTAGE,
            'value' => 120,
            'applicable_to' => Coupon::APPLICABLE_ALL,
        ]);

        $response->assertRedirect('/admin/coupons/create');
        $response->assertSessionHasErrors('value');
    }

    public function test_admin_coupon_store_requires_applicable_ids_when_not_all(): void
    {
        $response = $this->from('/admin/coupons/create')->post('/admin/coupons', [
            'code' => 'NOLIST',
            'name' => 'No List Coupon',
            'type' => Coupon::TYPE_FIXED,
            'value' => 50,
            'applicable_to' => Coupon::APPLICABLE_PRODUCTS,
            'applicable_ids' => [],
        ]);

        $response->assertRedirect('/admin/coupons/create');
        $response->assertSessionHasErrors('applicable_ids');
    }

    public function test_admin_coupon_store_accepts_all_scope_without_applicable_ids(): void
    {
        $response = $this->post('/admin/coupons', [
            'code' => 'ALL10',
            'name' => 'All Products 10',
            'type' => Coupon::TYPE_FIXED,
            'value' => 10,
            'applicable_to' => Coupon::APPLICABLE_ALL,
        ]);

        $response->assertRedirect(route('admin.coupons.index'));

        $this->assertDatabaseHas('coupons', [
            'code' => 'ALL10',
            'name' => 'All Products 10',
            'applicable_to' => Coupon::APPLICABLE_ALL,
        ]);
    }
}
