<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function __construct(
        private OtpService $otpService
    ) {}

    public function showLoginForm(): Response
    {
        $messages = session('errors')?->getBag('default')->getMessages() ?? [];
        $errors = collect($messages)->map(fn (array $msgs): string => $msgs[0] ?? '')->all();

        return Inertia::render('auth/login', [
            'otp_sent' => session('otp_sent'),
            'phone' => session('phone'),
            'message' => session('message'),
            'errors' => $errors,
        ]);
    }

    public function sendOtp(SendOtpRequest $request): RedirectResponse
    {
        $phone = $request->validated('phone');
        $language = $request->validated('language');
        $consent = $request->boolean('consent');
        $ip = $request->ip();
        $deviceInfo = OtpService::getDeviceInfoFromRequest($request);

        $otpRecord = $this->otpService->generateOtp($phone, $ip, $deviceInfo);

        if (config('app.debug')) {
            logger()->info('OTP for '.$phone.': '.$otpRecord->otp);
        }

        return back()->with([
            'otp_sent' => true,
            'phone' => $phone,
            'language' => $language,
            'consent' => $consent,
            'message' => 'OTP sent to your phone.',
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request): RedirectResponse
    {
        $phone = $request->validated('phone');
        $otp = $request->validated('otp');
        $language = $request->get('language', 'en');
        $consent = $request->boolean('consent', false);

        // Development bypass: allow OTP "000000" in debug mode
        $isValidOtp = config('app.debug') && $otp === '000000'
            ? true
            : $this->otpService->verifyOtp($phone, $otp);

        if (! $isValidOtp) {
            throw ValidationException::withMessages([
                'otp' => ['Invalid or expired OTP. Please try again.'],
            ])->redirectTo($request->url());
        }

        $user = User::query()->firstOrCreate(
            ['phone' => $phone],
            [
                'role' => User::ROLE_CUSTOMER,
                'preferred_language' => $language,
                'communication_consent' => $consent,
                'password' => Hash::make(Str::random(32)),
            ]
        );

        $user->update([
            'last_login_at' => now(),
        ]);

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('home'))->with('success', 'Logged in successfully.');
    }

    public function logout(): RedirectResponse
    {
        Auth::guard('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('home');
    }
}
