<?php

namespace App\Services;

use App\Models\Otp;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OtpService
{
    private const OTP_TTL_MINUTES = 5;

    private const RESEND_COOLDOWN_SECONDS = 30;

    private const MAX_ATTEMPTS = 5;

    private const RATE_LIMIT_PER_PHONE = 3;

    private const RATE_LIMIT_PER_PHONE_WINDOW_MINUTES = 15;

    private const RATE_LIMIT_PER_IP = 10;

    private const RATE_LIMIT_PER_IP_WINDOW_MINUTES = 15;

    public function generateOtp(string $phone, ?string $ip = null, ?string $deviceInfo = null): Otp
    {
        $this->checkRateLimit($phone, $ip);

        Otp::query()
            ->forPhone($phone)
            ->whereNull('verified_at')
            ->where('expires_at', '>', now())
            ->update([
                'expires_at' => now(),
            ]);

        $otp = (string) random_int(100000, 999999);
        $expiresAt = now()->addMinutes(self::OTP_TTL_MINUTES);

        $otpRecord = Otp::query()->create([
            'phone' => $phone,
            'otp' => $otp,
            'expires_at' => $expiresAt,
            'ip_address' => $ip,
            'device_info' => $deviceInfo,
        ]);

        if ($this->shouldUseMsg91()) {
            try {
                $this->sendViaMsg91($phone, $otp);
            } catch (ValidationException $exception) {
                $otpRecord->delete();

                throw $exception;
            }
        }

        return $otpRecord;
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

        $isOtpValid = $this->shouldUseMsg91()
            ? $this->verifyViaMsg91($phone, $code)
            : $otp->otp === $code;

        if (! $isOtpValid) {
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

    public function getResendCooldownSeconds(string $phone): int
    {
        $latestOtp = Otp::query()
            ->forPhone($phone)
            ->latest()
            ->first();

        if (! $latestOtp) {
            return 0;
        }

        $nextAllowedAt = $latestOtp->created_at->copy()->addSeconds(self::RESEND_COOLDOWN_SECONDS);

        if ($nextAllowedAt->isPast()) {
            return 0;
        }

        return max(0, $nextAllowedAt->getTimestamp() - now()->getTimestamp());
    }

    public function getOtpTtlSeconds(): int
    {
        return self::OTP_TTL_MINUTES * 60;
    }

    public function validateResendCooldown(string $phone): void
    {
        $seconds = $this->getResendCooldownSeconds($phone);

        if ($seconds <= 0) {
            return;
        }

        throw ValidationException::withMessages([
            'phone' => ["Please wait {$seconds} seconds before requesting a new OTP."],
        ]);
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

    private function shouldUseMsg91(): bool
    {
        return config('services.sms.driver') === 'msg91';
    }

    /**
     * @throws ValidationException
     */
    private function sendViaMsg91(string $phone, string $otp): void
    {
        $authKey = (string) config('services.sms.msg91_key', '');
        $templateId = (string) config('services.sms.msg91_template_id', '');

        if ($authKey === '' || $templateId === '') {
            throw ValidationException::withMessages([
                'phone' => ['SMS provider is not configured. Please contact support.'],
            ]);
        }

        try {
            $response = Http::timeout(10)
                ->asJson()
                ->acceptJson()
                ->post($this->msg91Endpoint('otp'), [
                    'mobile' => $this->formatMsg91Phone($phone),
                    'authkey' => $authKey,
                    'template_id' => $templateId,
                    'otp' => $otp,
                ]);
        } catch (ConnectionException) {
            throw ValidationException::withMessages([
                'phone' => ['Unable to send OTP right now. Please try again.'],
            ]);
        }

        if (! $response->successful() || ! $this->msg91SendWasSuccessful($response->json())) {
            throw ValidationException::withMessages([
                'phone' => ['Unable to send OTP right now. Please try again.'],
            ]);
        }
    }

    private function verifyViaMsg91(string $phone, string $otp): bool
    {
        $authKey = (string) config('services.sms.msg91_key', '');

        if ($authKey === '') {
            return false;
        }

        try {
            $response = Http::timeout(10)
                ->acceptJson()
                ->withHeaders([
                    'authkey' => $authKey,
                ])
                ->get($this->msg91Endpoint('otp/verify'), [
                    'mobile' => $this->formatMsg91Phone($phone),
                    'otp' => $otp,
                ]);
        } catch (ConnectionException) {
            return false;
        }

        if (! $response->successful()) {
            return false;
        }

        return $this->msg91VerifyWasSuccessful($response->json());
    }

    private function msg91Endpoint(string $path): string
    {
        $baseUrl = rtrim((string) config('services.sms.msg91_base_url', 'https://control.msg91.com/api/v5'), '/');

        return $baseUrl.'/'.ltrim($path, '/');
    }

    private function formatMsg91Phone(string $phone): string
    {
        $countryCode = (string) config('services.sms.msg91_country_code', '91');

        return $countryCode.$phone;
    }

    /**
     * @param  array<string, mixed>|null  $payload
     */
    private function msg91SendWasSuccessful(?array $payload): bool
    {
        if ($payload === null) {
            return false;
        }

        $type = Str::lower((string) ($payload['type'] ?? ''));
        $message = Str::lower((string) ($payload['message'] ?? ''));

        return $type === 'success'
            || Str::contains($message, 'otp sent')
            || Str::contains($message, 'success');
    }

    /**
     * @param  array<string, mixed>|null  $payload
     */
    private function msg91VerifyWasSuccessful(?array $payload): bool
    {
        if ($payload === null) {
            return false;
        }

        $type = Str::lower((string) ($payload['type'] ?? ''));
        $message = Str::lower((string) ($payload['message'] ?? ''));

        if ($type === 'success') {
            return true;
        }

        return Str::contains($message, 'verified')
            || Str::contains($message, 'success');
    }
}
