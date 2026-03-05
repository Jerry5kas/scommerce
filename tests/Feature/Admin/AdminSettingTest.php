<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSettingTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_login_page_is_accessible_for_guests(): void
    {
        $response = $this->get(route('admin.login'));

        $response->assertOk();
    }

    public function test_authenticated_admin_is_redirected_from_login_page_to_dashboard(): void
    {
        $admin = Admin::factory()->create();

        $response = $this->actingAs($admin, 'admin')
            ->get(route('admin.login'));

        $response->assertRedirect(route('admin.dashboard'));
    }
}
