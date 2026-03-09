<?php

namespace Tests\Feature\Auth;

use App\Models\Otp;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CustomerAuthFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_guest_can_be_redirected_to_google_oauth_with_context(): void
    {
        config()->set('services.google.client_id', 'google-client-id');
        config()->set('services.google.client_secret', 'google-client-secret');
        config()->set('services.google.redirect', 'http://127.0.0.1:8000/auth/google/callback');

        $response = $this->get('/auth/google/redirect?'.http_build_query([
            'language' => 'en',
            'consent' => '1',
        ]));

        $response->assertRedirect();
        $redirectUrl = $response->headers->get('Location');

        $this->assertIsString($redirectUrl);
        $this->assertStringContainsString('https://accounts.google.com/o/oauth2/v2/auth?', $redirectUrl);
        $this->assertStringContainsString('client_id=google-client-id', $redirectUrl);
        $this->assertStringContainsString('redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fauth%2Fgoogle%2Fcallback', $redirectUrl);
        $this->assertStringContainsString('scope=openid+email+profile', $redirectUrl);

        $this->assertSame('en', session('google_auth_context.language'));
        $this->assertTrue((bool) session('google_auth_context.consent'));
        $this->assertNotNull(session('google_oauth_state'));
    }

    public function test_guest_can_continue_with_google_and_create_account(): void
    {
        config()->set('services.google.client_id', 'google-client-id');
        config()->set('services.google.client_secret', 'google-client-secret');
        config()->set('services.google.redirect', 'http://127.0.0.1:8000/auth/google/callback');

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response([
                'access_token' => 'access-token-123',
                'token_type' => 'Bearer',
                'expires_in' => 3599,
            ], 200),
            'www.googleapis.com/oauth2/v3/userinfo' => Http::response([
                'sub' => 'google-provider-1',
                'email' => 'new.customer@example.com',
                'email_verified' => true,
                'name' => 'New Customer',
                'picture' => 'https://lh3.googleusercontent.com/photo1',
            ], 200),
        ]);

        $response = $this
            ->withSession([
                'google_oauth_state' => 'state-123',
                'google_auth_context' => [
                    'language' => 'en',
                    'consent' => true,
                ],
            ])
            ->get('/auth/google/callback?'.http_build_query([
                'code' => 'google-auth-code',
                'state' => 'state-123',
            ]));

        $response->assertRedirect(route('location.select'));
        $this->assertAuthenticated();

        $this->assertDatabaseHas('users', [
            'email' => 'new.customer@example.com',
            'name' => 'New Customer',
            'role' => User::ROLE_CUSTOMER,
            'preferred_language' => 'en',
            'communication_consent' => true,
        ]);

        $user = User::query()->where('email', 'new.customer@example.com')->first();
        $this->assertNotNull($user);

        $this->assertDatabaseHas('social_accounts', [
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google-provider-1',
        ]);
    }

    public function test_existing_user_can_continue_with_google_and_profile_is_updated(): void
    {
        config()->set('services.google.client_id', 'google-client-id');
        config()->set('services.google.client_secret', 'google-client-secret');
        config()->set('services.google.redirect', 'http://127.0.0.1:8000/auth/google/callback');

        $user = User::factory()->create([
            'email' => 'existing.customer@example.com',
            'name' => 'Existing User',
            'role' => User::ROLE_CUSTOMER,
            'preferred_language' => 'en',
            'communication_consent' => false,
            'email_verified_at' => null,
        ]);

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response([
                'access_token' => 'access-token-123',
            ], 200),
            'www.googleapis.com/oauth2/v3/userinfo' => Http::response([
                'sub' => 'google-provider-existing',
                'email' => 'existing.customer@example.com',
                'email_verified' => true,
                'name' => 'Existing Customer',
            ], 200),
        ]);

        $response = $this
            ->withSession([
                'google_oauth_state' => 'state-xyz',
                'google_auth_context' => [
                    'language' => 'ml',
                    'consent' => true,
                ],
            ])
            ->get('/auth/google/callback?'.http_build_query([
                'code' => 'existing-user-code',
                'state' => 'state-xyz',
            ]));

        $response->assertRedirect(route('location.select'));
        $this->assertAuthenticatedAs($user);

        $user->refresh();
        $this->assertSame('ml', $user->preferred_language);
        $this->assertTrue($user->communication_consent);
        $this->assertSame('Existing Customer', $user->name);
        $this->assertNotNull($user->email_verified_at);
        $this->assertNotNull($user->last_login_at);

        $this->assertDatabaseHas('social_accounts', [
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google-provider-existing',
        ]);
    }

    public function test_google_callback_prioritizes_provider_id_over_email(): void
    {
        config()->set('services.google.client_id', 'google-client-id');
        config()->set('services.google.client_secret', 'google-client-secret');
        config()->set('services.google.redirect', 'http://127.0.0.1:8000/auth/google/callback');

        $providerUser = User::factory()->create([
            'email' => 'provider.user@example.com',
            'name' => 'Provider User',
            'role' => User::ROLE_CUSTOMER,
        ]);

        SocialAccount::query()->create([
            'user_id' => $providerUser->id,
            'provider' => 'google',
            'provider_id' => 'google-priority-provider-id',
        ]);

        User::factory()->create([
            'email' => 'google.payload@example.com',
            'name' => 'Email Matched User',
            'role' => User::ROLE_CUSTOMER,
        ]);

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response([
                'access_token' => 'access-token-priority',
            ], 200),
            'www.googleapis.com/oauth2/v3/userinfo' => Http::response([
                'sub' => 'google-priority-provider-id',
                'email' => 'google.payload@example.com',
                'email_verified' => true,
                'name' => 'Google Payload Name',
            ], 200),
        ]);

        $response = $this
            ->withSession([
                'google_oauth_state' => 'state-priority',
                'google_auth_context' => [
                    'language' => 'en',
                    'consent' => true,
                ],
            ])
            ->get('/auth/google/callback?'.http_build_query([
                'code' => 'priority-code',
                'state' => 'state-priority',
            ]));

        $response->assertRedirect(route('location.select'));
        $this->assertAuthenticatedAs($providerUser);
    }

    public function test_guest_can_request_otp_with_log_driver(): void
    {
        config()->set('services.sms.driver', 'log');
        config()->set('app.debug', true);

        $response = $this->from('/login')->post('/auth/send-otp', [
            'phone' => '9876543210',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHas('otp_sent', true);
        $response->assertSessionHas('phone', '9876543210');
        $response->assertSessionHas('debug_otp');

        $this->assertDatabaseHas('otps', [
            'phone' => '9876543210',
        ]);
    }

    public function test_guest_can_request_otp_with_msg91_driver(): void
    {
        config()->set('services.sms.driver', 'msg91');
        config()->set('services.sms.msg91_key', 'test-auth-key');
        config()->set('services.sms.msg91_template_id', 'test-template-id');
        config()->set('services.sms.msg91_base_url', 'https://control.msg91.com/api/v5');
        config()->set('services.sms.msg91_country_code', '91');

        Http::fake([
            'control.msg91.com/*' => Http::response([
                'type' => 'success',
                'message' => 'OTP sent',
            ], 200),
        ]);

        $response = $this->from('/login')->post('/auth/send-otp', [
            'phone' => '9876543210',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHas('otp_sent', true);

        Http::assertSent(function (Request $request): bool {
            $data = $request->data();

            return $request->method() === 'POST'
                && str_contains($request->url(), '/api/v5/otp')
                && ($data['mobile'] ?? null) === '919876543210'
                && ($data['template_id'] ?? null) === 'test-template-id'
                && isset($data['otp'])
                && strlen((string) $data['otp']) === 6;
        });
    }

    public function test_guest_can_resend_otp_after_cooldown_with_log_driver(): void
    {
        config()->set('services.sms.driver', 'log');

        Otp::query()->create([
            'phone' => '9876543210',
            'otp' => '123456',
            'expires_at' => now()->addMinutes(5),
            'attempts' => 0,
        ]);

        $this->travel(31)->seconds();

        $response = $this->from('/login')->post('/auth/resend-otp', [
            'phone' => '9876543210',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHas('otp_sent', true);
        $response->assertSessionHas('resend_available_in', 30);

        $this->assertSame(2, Otp::query()->where('phone', '9876543210')->count());
    }

    public function test_guest_cannot_resend_otp_before_cooldown(): void
    {
        config()->set('services.sms.driver', 'log');

        Otp::query()->create([
            'phone' => '9876543210',
            'otp' => '123456',
            'expires_at' => now()->addMinutes(5),
            'attempts' => 0,
        ]);

        $response = $this->from('/login')->post('/auth/resend-otp', [
            'phone' => '9876543210',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('phone');
    }

    public function test_user_can_verify_otp_with_msg91_driver(): void
    {
        config()->set('services.sms.driver', 'msg91');
        config()->set('services.sms.msg91_key', 'test-auth-key');
        config()->set('services.sms.msg91_template_id', 'test-template-id');
        config()->set('services.sms.msg91_base_url', 'https://control.msg91.com/api/v5');
        config()->set('services.sms.msg91_country_code', '91');

        Otp::query()->create([
            'phone' => '9876543210',
            'otp' => '123456',
            'expires_at' => now()->addMinutes(5),
            'attempts' => 0,
        ]);

        User::factory()->create([
            'phone' => '9876543210',
            'email' => 'otp.user@example.com',
            'role' => User::ROLE_CUSTOMER,
        ]);

        Http::fake([
            'control.msg91.com/*' => Http::response([
                'type' => 'success',
                'message' => 'OTP verified',
            ], 200),
        ]);

        $response = $this->from('/login')->post('/auth/verify-otp', [
            'phone' => '9876543210',
            'otp' => '123456',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect(route('location.select'));
        $this->assertAuthenticated();

        $otp = Otp::query()->where('phone', '9876543210')->latest()->first();
        $this->assertNotNull($otp);
        $this->assertNotNull($otp->verified_at);

        Http::assertSent(function (Request $request): bool {
            return $request->method() === 'GET'
                && str_contains($request->url(), '/api/v5/otp/verify')
                && str_contains($request->url(), 'mobile=919876543210')
                && str_contains($request->url(), 'otp=123456')
                && $request->hasHeader('authkey', 'test-auth-key');
        });
    }

    public function test_msg91_send_failure_returns_validation_error(): void
    {
        config()->set('services.sms.driver', 'msg91');
        config()->set('services.sms.msg91_key', 'test-auth-key');
        config()->set('services.sms.msg91_template_id', 'test-template-id');

        Http::fake([
            'control.msg91.com/*' => Http::response([
                'type' => 'error',
                'message' => 'Failed',
            ], 200),
        ]);

        $response = $this->from('/login')->post('/auth/send-otp', [
            'phone' => '9876543210',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('phone');

        $this->assertDatabaseMissing('otps', [
            'phone' => '9876543210',
        ]);
    }

    public function test_user_can_verify_otp_with_log_driver_and_phone_only_account(): void
    {
        config()->set('services.sms.driver', 'log');

        Otp::query()->create([
            'phone' => '9876543210',
            'otp' => '123456',
            'expires_at' => now()->addMinutes(5),
            'attempts' => 0,
        ]);

        $response = $this->from('/login')->post('/auth/verify-otp', [
            'phone' => '9876543210',
            'otp' => '123456',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect(route('location.select'));
        $this->assertAuthenticated();

        $this->assertDatabaseHas('users', [
            'phone' => '9876543210',
            'email' => 'phone.9876543210@freshtick.local',
            'role' => User::ROLE_CUSTOMER,
        ]);

        $user = User::query()->where('phone', '9876543210')->first();
        $this->assertNotNull($user);
        $this->assertNotNull($user->phone_verified_at);
    }

    public function test_google_callback_rejects_unverified_google_email(): void
    {
        config()->set('services.google.client_id', 'google-client-id');
        config()->set('services.google.client_secret', 'google-client-secret');
        config()->set('services.google.redirect', 'http://127.0.0.1:8000/auth/google/callback');

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response([
                'access_token' => 'access-token-123',
            ], 200),
            'www.googleapis.com/oauth2/v3/userinfo' => Http::response([
                'sub' => 'google-unverified',
                'email' => 'unverified.customer@example.com',
                'email_verified' => false,
                'name' => 'Unverified Customer',
            ], 200),
        ]);

        $response = $this
            ->withSession([
                'google_oauth_state' => 'state-987',
                'google_auth_context' => [
                    'language' => 'en',
                    'consent' => true,
                ],
            ])
            ->get('/auth/google/callback?'.http_build_query([
                'code' => 'google-auth-code',
                'state' => 'state-987',
            ]));

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('google');
        $this->assertGuest();
    }

    public function test_google_callback_rejects_invalid_state(): void
    {
        config()->set('services.google.client_id', 'google-client-id');
        config()->set('services.google.client_secret', 'google-client-secret');
        config()->set('services.google.redirect', 'http://127.0.0.1:8000/auth/google/callback');

        $response = $this
            ->withSession([
                'google_oauth_state' => 'expected-state',
                'google_auth_context' => [
                    'language' => 'en',
                    'consent' => true,
                ],
            ])
            ->get('/auth/google/callback?'.http_build_query([
                'code' => 'google-auth-code',
                'state' => 'wrong-state',
            ]));

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('google');
        $this->assertGuest();
    }

    public function test_google_redirect_requires_communication_consent(): void
    {
        config()->set('services.google.client_id', 'google-client-id');
        config()->set('services.google.client_secret', 'google-client-secret');
        config()->set('services.google.redirect', 'http://127.0.0.1:8000/auth/google/callback');

        $response = $this->from('/login')->get('/auth/google/redirect?'.http_build_query([
            'language' => 'en',
            'consent' => '0',
        ]));

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('consent');
        $this->assertGuest();
    }

    public function test_authenticated_user_can_link_phone_after_google_login(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'phone' => null,
            'phone_verified_at' => null,
            'role' => User::ROLE_CUSTOMER,
        ]);

        Otp::query()->create([
            'phone' => '9876543210',
            'otp' => '123456',
            'expires_at' => now()->addMinutes(5),
            'attempts' => 0,
        ]);

        $response = $this->actingAs($user)->post('/auth/link-phone/verify-otp', [
            'phone' => '9876543210',
            'otp' => '123456',
            'language' => 'en',
            'consent' => '1',
        ]);

        $response->assertRedirect(route('location.select'));

        $user->refresh();
        $this->assertSame('9876543210', $user->phone);
        $this->assertNotNull($user->phone_verified_at);
    }

    public function test_guest_is_redirected_to_login_when_opening_location_selector(): void
    {
        $response = $this->get(route('location.select'));

        $response->assertRedirect(route('login'));
    }
}
