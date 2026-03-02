<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CustomerAuthFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_guest_can_continue_with_email_and_create_account(): void
    {
        $response = $this->from('/login')->post('/auth/email-continue', [
            'email' => 'new.customer@example.com',
            'password' => 'Password@123',
            'password_confirmation' => 'Password@123',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect(route('location.select'));
        $this->assertAuthenticated();

        $this->assertDatabaseHas('users', [
            'email' => 'new.customer@example.com',
            'role' => User::ROLE_CUSTOMER,
            'preferred_language' => 'en',
            'communication_consent' => true,
        ]);
    }

    public function test_existing_user_can_continue_with_email_and_password(): void
    {
        $user = User::factory()->create([
            'email' => 'existing.customer@example.com',
            'password' => Hash::make('Password@123'),
            'role' => User::ROLE_CUSTOMER,
        ]);

        $response = $this->from('/login')->post('/auth/email-continue', [
            'email' => 'existing.customer@example.com',
            'password' => 'Password@123',
            'password_confirmation' => 'Password@123',
            'language' => 'ml',
            'consent' => '1',
        ]);

        $response->assertRedirect(route('location.select'));
        $this->assertAuthenticatedAs($user);

        $user->refresh();
        $this->assertSame('ml', $user->preferred_language);
        $this->assertTrue($user->communication_consent);
        $this->assertNotNull($user->last_login_at);
    }

    public function test_email_continue_rejects_wrong_password_for_existing_user(): void
    {
        User::factory()->create([
            'email' => 'existing.customer@example.com',
            'password' => Hash::make('Password@123'),
            'role' => User::ROLE_CUSTOMER,
        ]);

        $response = $this->from('/login')->post('/auth/email-continue', [
            'email' => 'existing.customer@example.com',
            'password' => 'WrongPassword@123',
            'password_confirmation' => 'WrongPassword@123',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect('/auth/email-continue');
        $response->assertSessionHasErrors('password');
        $this->assertGuest();
    }

    public function test_guest_is_redirected_to_login_when_opening_location_selector(): void
    {
        $response = $this->get(route('location.select'));

        $response->assertRedirect(route('login'));
    }
}
