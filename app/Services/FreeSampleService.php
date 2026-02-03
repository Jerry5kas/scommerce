<?php

namespace App\Services;

use App\Models\FreeSample;
use App\Models\Product;
use App\Models\User;

class FreeSampleService
{
    /**
     * Check if user is eligible for a free sample
     */
    public function checkEligibility(?User $user, Product $product, ?string $phone = null, ?string $deviceFingerprint = null): bool
    {
        // Product must be active and in stock
        if (! $product->is_active || ! $product->is_in_stock) {
            return false;
        }

        $phoneHash = $this->hashPhone($phone ?? $user?->phone);
        $deviceHash = $this->hashDevice($deviceFingerprint ?? $user?->device_fingerprint_hash);

        if ($phoneHash === null && $deviceHash === null) {
            return false;
        }

        // Check if already claimed by phone hash
        if ($phoneHash !== null) {
            $claimedByPhone = FreeSample::query()
                ->where('product_id', $product->id)
                ->where('phone_hash', $phoneHash)
                ->exists();

            if ($claimedByPhone) {
                return false;
            }
        }

        // Check if already claimed by device hash
        if ($deviceHash !== null) {
            $claimedByDevice = FreeSample::query()
                ->where('product_id', $product->id)
                ->where('device_hash', $deviceHash)
                ->exists();

            if ($claimedByDevice) {
                return false;
            }
        }

        // Check if user has already used free sample (if user exists)
        if ($user !== null && $user->free_sample_used) {
            return false;
        }

        return true;
    }

    /**
     * Claim a free sample
     */
    public function claimSample(?User $user, Product $product, ?string $phone = null, ?string $deviceFingerprint = null): FreeSample
    {
        if (! $this->checkEligibility($user, $product, $phone, $deviceFingerprint)) {
            throw new \RuntimeException('User is not eligible for free sample.');
        }

        $phoneHash = $this->hashPhone($phone ?? $user?->phone);
        $deviceHash = $this->hashDevice($deviceFingerprint ?? $user?->device_fingerprint_hash);

        $sample = FreeSample::query()->create([
            'product_id' => $product->id,
            'user_id' => $user?->id,
            'phone_hash' => $phoneHash ?? '',
            'device_hash' => $deviceHash ?? '',
            'claimed_at' => now(),
            'is_used' => false,
        ]);

        // Mark user as having used free sample
        if ($user !== null) {
            $user->update(['free_sample_used' => true]);
        }

        return $sample;
    }

    /**
     * Mark sample as used in an order
     */
    public function markAsUsed(FreeSample $sample): void
    {
        $sample->update(['is_used' => true]);
    }

    /**
     * Hash phone number for privacy (consistent hash)
     */
    private function hashPhone(?string $phone): ?string
    {
        if ($phone === null || $phone === '') {
            return null;
        }

        $normalized = preg_replace('/\D/', '', $phone);
        if ($normalized === '') {
            return null;
        }

        return hash('sha256', $normalized);
    }

    /**
     * Hash device fingerprint for privacy (consistent hash)
     */
    private function hashDevice(?string $deviceFingerprint): ?string
    {
        if ($deviceFingerprint === null || $deviceFingerprint === '') {
            return null;
        }

        return hash('sha256', $deviceFingerprint);
    }
}
