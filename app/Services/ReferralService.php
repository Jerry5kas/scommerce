<?php

namespace App\Services;

use App\Models\Referral;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ReferralService
{
    // Configurable rewards (could be moved to config/referral.php)
    protected const REFERRER_REWARD = 100.00; // Reward for the person who referred

    protected const REFERRED_REWARD = 50.00;  // Reward for the new user

    protected const COMPLETION_CRITERIA = Referral::CRITERIA_FIRST_ORDER;

    public function __construct(
        private WalletService $walletService
    ) {}

    /**
     * Generate unique referral code for user
     */
    public function generateReferralCode(User $user): string
    {
        // Try username-based code first
        $baseName = Str::slug($user->name ?? 'user');
        $code = strtoupper(substr($baseName, 0, 6).$user->id);

        // Ensure uniqueness
        $counter = 0;
        while (User::where('referral_code', $code)->exists()) {
            $counter++;
            $code = strtoupper(substr($baseName, 0, 4).$user->id.$counter);
        }

        $user->update(['referral_code' => $code]);

        return $code;
    }

    /**
     * Get or create referral code for user
     */
    public function getOrCreateReferralCode(User $user): string
    {
        if ($user->referral_code) {
            return $user->referral_code;
        }

        return $this->generateReferralCode($user);
    }

    /**
     * Validate referral code
     */
    public function validateReferralCode(string $code): bool
    {
        return User::where('referral_code', $code)->exists();
    }

    /**
     * Get user by referral code
     */
    public function getUserByReferralCode(string $code): ?User
    {
        return User::where('referral_code', $code)->first();
    }

    /**
     * Create referral relationship
     *
     * @return array{success: bool, referral?: Referral, error?: string}
     */
    public function createReferral(User $referrer, User $referred, string $code): array
    {
        try {
            // Prevent self-referral
            if ($referrer->id === $referred->id) {
                return ['success' => false, 'error' => 'Cannot refer yourself.'];
            }

            // Check if referred user already has a referral
            if (Referral::where('referred_id', $referred->id)->exists()) {
                return ['success' => false, 'error' => 'User has already been referred.'];
            }

            // Check for abuse
            if ($this->checkForAbuse($referrer, $referred)) {
                Log::warning('Referral abuse detected', [
                    'referrer_id' => $referrer->id,
                    'referred_id' => $referred->id,
                ]);

                return ['success' => false, 'error' => 'Referral could not be processed.'];
            }

            $referral = Referral::create([
                'referrer_id' => $referrer->id,
                'referred_id' => $referred->id,
                'referral_code' => $code,
                'status' => Referral::STATUS_PENDING,
                'completion_criteria' => self::COMPLETION_CRITERIA,
                'referrer_reward' => self::REFERRER_REWARD,
                'referred_reward' => self::REFERRED_REWARD,
            ]);

            // Update referred user's record
            $referred->update(['referred_by_id' => $referrer->id]);

            Log::info('Referral created', [
                'referrer_id' => $referrer->id,
                'referred_id' => $referred->id,
            ]);

            return ['success' => true, 'referral' => $referral];
        } catch (\Exception $e) {
            Log::error('Failed to create referral', [
                'referrer_id' => $referrer->id,
                'referred_id' => $referred->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to create referral.'];
        }
    }

    /**
     * Apply referral code for new user
     *
     * @return array{success: bool, referral?: Referral, error?: string}
     */
    public function applyReferralCode(User $newUser, string $code): array
    {
        $referrer = $this->getUserByReferralCode($code);

        if (! $referrer) {
            return ['success' => false, 'error' => 'Invalid referral code.'];
        }

        return $this->createReferral($referrer, $newUser, $code);
    }

    /**
     * Process referral completion based on criteria
     *
     * @return array{success: bool, referral?: Referral, rewards_paid?: bool, error?: string}
     */
    public function processReferralCompletion(User $referred, string $criteria): array
    {
        try {
            $referral = Referral::where('referred_id', $referred->id)
                ->pending()
                ->first();

            if (! $referral) {
                return ['success' => false, 'error' => 'No pending referral found.'];
            }

            // Check if criteria matches
            if ($referral->completion_criteria !== $criteria) {
                return ['success' => false, 'error' => 'Criteria not met.'];
            }

            return DB::transaction(function () use ($referral) {
                // Mark as completed
                $referral->markAsCompleted();

                // Process rewards
                $rewardsPaid = $this->processRewards($referral);

                Log::info('Referral completed', [
                    'referral_id' => $referral->id,
                    'referrer_id' => $referral->referrer_id,
                    'referred_id' => $referral->referred_id,
                    'rewards_paid' => $rewardsPaid,
                ]);

                return [
                    'success' => true,
                    'referral' => $referral->fresh(),
                    'rewards_paid' => $rewardsPaid,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Failed to process referral completion', [
                'referred_id' => $referred->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to process referral.'];
        }
    }

    /**
     * Process rewards for completed referral
     */
    public function processRewards(Referral $referral): bool
    {
        try {
            // Award referrer
            if ($referral->referrer_reward > 0 && ! $referral->referrer_reward_paid) {
                $this->walletService->addReferralReward(
                    $referral->referrer,
                    (float) $referral->referrer_reward,
                    "Referral reward for inviting user #{$referral->referred_id}"
                );
                $referral->markReferrerRewardPaid();
            }

            // Award referred user
            if ($referral->referred_reward > 0 && ! $referral->referred_reward_paid) {
                $this->walletService->addReferralReward(
                    $referral->referred,
                    (float) $referral->referred_reward,
                    'Welcome bonus for joining via referral'
                );
                $referral->markReferredRewardPaid();
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to process referral rewards', [
                'referral_id' => $referral->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Check for referral abuse
     */
    public function checkForAbuse(User $referrer, User $referred): bool
    {
        // Check same device fingerprint
        if ($referrer->device_fingerprint_hash && $referred->device_fingerprint_hash) {
            if ($referrer->device_fingerprint_hash === $referred->device_fingerprint_hash) {
                return true;
            }
        }

        // Check too many referrals in short time
        $recentReferrals = Referral::where('referrer_id', $referrer->id)
            ->where('created_at', '>=', now()->subDay())
            ->count();

        if ($recentReferrals >= 10) {
            return true;
        }

        return false;
    }

    /**
     * Get referral stats for user
     *
     * @return array<string, mixed>
     */
    public function getReferralStats(User $user): array
    {
        $referralCode = $this->getOrCreateReferralCode($user);

        $referrals = Referral::where('referrer_id', $user->id)->get();

        return [
            'referral_code' => $referralCode,
            'referral_link' => url('/register?ref='.$referralCode),
            'total_referrals' => $referrals->count(),
            'pending_referrals' => $referrals->where('status', Referral::STATUS_PENDING)->count(),
            'completed_referrals' => $referrals->where('status', Referral::STATUS_COMPLETED)->count(),
            'total_rewards_earned' => $referrals->where('referrer_reward_paid', true)->sum('referrer_reward'),
            'pending_rewards' => $referrals->where('status', Referral::STATUS_COMPLETED)
                ->where('referrer_reward_paid', false)
                ->sum('referrer_reward'),
            'referrer_reward_amount' => self::REFERRER_REWARD,
            'referred_reward_amount' => self::REFERRED_REWARD,
        ];
    }

    /**
     * Get referrals made by user
     */
    public function getUserReferrals(User $user, int $limit = 20): \Illuminate\Database\Eloquent\Collection
    {
        return Referral::where('referrer_id', $user->id)
            ->with(['referred:id,name,email,created_at'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }
}
