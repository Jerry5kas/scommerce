<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_admin_login_from_reports(): void
    {
        $response = $this->get(route('admin.reports.index'));

        $response->assertRedirect(route('admin.login'));
    }

    public function test_authenticated_admin_can_view_reports_index(): void
    {
        $admin = Admin::factory()->create();

        $response = $this->actingAs($admin, 'admin')
            ->get(route('admin.reports.index'));

        $response->assertOk();
    }
}
