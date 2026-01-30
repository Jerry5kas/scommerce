<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    private const OTP_CACHE_PREFIX = 'otp:';

    private const OTP_TTL_MINUTES = 5;

    public function showLoginForm(): Response
    {
        return Inertia::render('auth/login', [
            'otp_sent' => session('otp_sent'),
            'phone' => session('phone'),
            'message' => session('message'),
            'errors' => session('errors')?->getMessages() ?? [],
        ]);
    }

    public function sendOtp(SendOtpRequest $request): RedirectResponse
    {
        $phone = $request->validated('phone');
        $language = $request->validated('language');

        $otp = (string) random_int(100000, 999999);
        Cache::put(self::OTP_CACHE_PREFIX.$phone, $otp, now()->addMinutes(self::OTP_TTL_MINUTES));

        // TODO: Integrate SMS gateway (Twilio, MSG91, Firebase, etc.) to send OTP.
        // For development, log OTP (remove in production).
        if (config('app.debug')) {
            logger()->info('OTP for '.$phone.': '.$otp);
        }

        return back()->with([
            'otp_sent' => true,
            'phone' => $phone,
            'language' => $language,
            'message' => 'OTP sent to your phone.',
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request): RedirectResponse
    {
        $phone = $request->validated('phone');
        $otp = $request->validated('otp');

        $cached = Cache::get(self::OTP_CACHE_PREFIX.$phone);

        if ($cached === null || $cached !== $otp) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP.'])->withInput($request->only('phone'));
        }

        Cache::forget(self::OTP_CACHE_PREFIX.$phone);

        // TODO: Create or find user by phone and log in (e.g. session or Sanctum).
        // For now, simulate login by storing in session.
        $request->session()->put('auth.phone', $phone);
        $request->session()->put('auth.verified_at', now()->toIso8601String());

        return redirect()->intended(route('home'))->with('success', 'Logged in successfully.');
    }
}
