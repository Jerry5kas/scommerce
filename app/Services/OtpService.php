<?php

namespace App\Services;

use App\Models\Otp;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OtpService
{
    private const OTP_TTL_MINUTES = 5;

    private const MAX_ATTEMPTS = 5;

    private const RATE_LIMIT_PER_PHONE = 3;

    private const RATE_LIMIT_PER_PHONE_WINDOW_MINUTES = 15;

    private const RATE_LIMIT_PER_IP = 10;

    private const RATE_LIMIT_PER_IP_WINDOW_MINUTES = 15;

    public function generateOtp(string $phone, ?string $ip = null, ?string $deviceInfo = null): Otp
    {
        $this->checkRateLimit($phone, $ip);

        $otp = (string) random_int(100000, 999999);
        $expiresAt = now()->addMinutes(self::OTP_TTL_MINUTES);

        return Otp::query()->create([
            'phone' => $phone,
            'otp' => $otp,
            'expires_at' => $expiresAt,
            'ip_address' => $ip,
            'device_info' => $deviceInfo,
        ]);
    }

    public function verifyOtp(string $phone, string $code): bool
    {
        $otp = Otp::query()
            ->forPhone($phone)
            ->valid()
            ->latest()
            ->first();

        if (! $otp) {
            return false;
        }

        if ($otp->attempts >= self::MAX_ATTEMPTS) {
            return false;
        }

        $otp->increment('attempts');

        if ($otp->otp !== $code) {
            return false;
        }

        $otp->update(['verified_at' => now()]);

        return true;
    }

    public function checkRateLimit(string $phone, ?string $ip): void
    {
        $windowStart = now()->subMinutes(self::RATE_LIMIT_PER_PHONE_WINDOW_MINUTES);
        $phoneCount = Otp::query()
            ->forPhone($phone)
            ->where('created_at', '>=', $windowStart)
            ->count();

        if ($phoneCount >= self::RATE_LIMIT_PER_PHONE) {
            throw ValidationException::withMessages([
                'phone' => ['Too many OTP requests for this phone. Please try again later.'],
            ]);
        }

        if ($ip !== null && $ip !== '') {
            $ipWindowStart = now()->subMinutes(self::RATE_LIMIT_PER_IP_WINDOW_MINUTES);
            $ipCount = Otp::query()
                ->where('ip_address', $ip)
                ->where('created_at', '>=', $ipWindowStart)
                ->count();

            if ($ipCount >= self::RATE_LIMIT_PER_IP) {
                throw ValidationException::withMessages([
                    'phone' => ['Too many OTP requests. Please try again later.'],
                ]);
            }
        }
    }

    public function cleanupExpiredOtps(): int
    {
        return Otp::query()
            ->where('expires_at', '<', now()->subDays(1))
            ->delete();
    }

    public static function getDeviceInfoFromRequest(Request $request): ?string
    {
        $parts = array_filter([
            $request->userAgent(),
            $request->header('Accept-Language'),
        ]);

        if (empty($parts)) {
            return null;
        }

        return Str::limit(implode(' | ', $parts), 500);
    }
}
