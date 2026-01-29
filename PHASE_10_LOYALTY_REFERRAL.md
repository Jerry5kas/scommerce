# Phase 10: Loyalty & Referral System

## Objective
Implement loyalty points system and referral program to drive retention and organic growth.

## Prerequisites
- Phase 6 completed (Orders)
- Phase 7 completed (Wallet)
- Orders and deliveries are working

## Tasks

### 10.1 Loyalty Points System
- [ ] Create `loyalty_points` table migration
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key, unique, indexed)
  - [ ] `points` (integer, default: 0) - Current balance
  - [ ] `total_earned` (integer, default: 0) - Lifetime earned
  - [ ] `total_redeemed` (integer, default: 0) - Lifetime redeemed
  - [ ] `is_active` (boolean, default: true)
  - [ ] `timestamps`
- [ ] Create `LoyaltyPoint` model
  - [ ] Relationships (user, transactions)
  - [ ] Helper methods:
    - [ ] `addPoints(amount, reason)` - Add points
    - [ ] `deductPoints(amount, reason)` - Deduct points
    - [ ] `getBalance()` - Get current balance

### 10.2 Loyalty Transactions
- [ ] Create `loyalty_transactions` table migration
  - [ ] `id` (primary key)
  - [ ] `loyalty_point_id` (foreign key, indexed)
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `type` (enum: 'earned', 'redeemed', 'expired', 'adjusted')
  - [ ] `points` (integer) - Positive for earned, negative for redeemed
  - [ ] `balance_before` (integer)
  - [ ] `balance_after` (integer)
  - [ ] `source` (enum: 'delivery', 'purchase', 'referral', 'promotion', 'admin')
  - [ ] `reference_id` (string, nullable) - Order ID, delivery ID, etc.
  - [ ] `reference_type` (string, nullable) - Model class
  - [ ] `description` (text, nullable)
  - [ ] `expires_at` (timestamp, nullable) - If points expire
  - [ ] `status` (enum: 'pending', 'completed', 'cancelled')
  - [ ] `timestamps`
- [ ] Create `LoyaltyTransaction` model
  - [ ] Relationships (loyaltyPoint, user)
  - [ ] Scopes (earned, redeemed, byType, bySource)
  - [ ] Polymorphic relationship for reference

### 10.3 Loyalty Rules Configuration
- [ ] Create `loyalty_rules` table migration (if configurable)
  - [ ] `id` (primary key)
  - [ ] `rule_type` (enum: 'points_per_delivery', 'points_per_order', 'points_per_referral')
  - [ ] `points` (integer)
  - [ ] `min_order_amount` (decimal, nullable) - Minimum order for points
  - [ ] `is_active` (boolean, default: true)
  - [ ] `valid_from` (date, nullable)
  - [ ] `valid_until` (date, nullable)
  - [ ] `timestamps`
- [ ] Or use config file for simple rules

### 10.4 Loyalty Service
- [ ] Create `LoyaltyService` class
  - [ ] `getOrCreateLoyaltyAccount(user)` - Get or create loyalty account
  - [ ] `awardPointsForDelivery(user, delivery)` - Award points for delivery
  - [ ] `awardPointsForOrder(user, order)` - Award points for order
  - [ ] `redeemPoints(user, points, order)` - Redeem points
  - [ ] `convertPointsToWallet(user, points)` - Convert to wallet (1 point = X rupees)
  - [ ] `createTransaction(loyaltyPoint, type, points, data)` - Create transaction
  - [ ] `calculatePointsForOrder(order)` - Calculate points for order
  - [ ] `checkExpiredPoints()` - Check and expire points

### 10.5 Referral System
- [ ] Create `referrals` table migration
  - [ ] `id` (primary key)
  - [ ] `referrer_id` (foreign key, indexed) - User who referred
  - [ ] `referred_id` (foreign key, unique, indexed) - User who was referred
  - [ ] `referral_code` (string, unique, indexed) - Unique referral code
  - [ ] `status` (enum: 'pending', 'completed', 'cancelled')
  - [ ] `completed_at` (timestamp, nullable) - When referral completed
  - [ ] `completion_criteria` (enum: 'first_order', 'first_delivery', 'first_subscription')
  - [ ] `referrer_reward` (decimal, nullable) - Reward amount
  - [ ] `referred_reward` (decimal, nullable) - Reward for new user
  - [ ] `referrer_reward_paid` (boolean, default: false)
  - [ ] `referred_reward_paid` (boolean, default: false)
  - [ ] `notes` (text, nullable)
  - [ ] `timestamps`
- [ ] Create `Referral` model
  - [ ] Relationships (referrer, referred)
  - [ ] Scopes (pending, completed, byReferrer)
  - [ ] Helper methods:
    - [ ] `markAsCompleted(criteria)` - Mark as completed
    - [ ] `processRewards()` - Process rewards

### 10.6 Referral Codes
- [ ] Update `users` table
  - [ ] Add `referral_code` (string, unique, indexed) - User's referral code
  - [ ] Add `referred_by_id` (foreign key, nullable) - Who referred this user
- [ ] Create `ReferralCodeService` class
  - [ ] `generateReferralCode(user)` - Generate unique code
  - [ ] `validateReferralCode(code)` - Validate code
  - [ ] `getUserByReferralCode(code)` - Get user by code
  - [ ] `checkCodeAvailability(code)` - Check if code available

### 10.7 Referral Service
- [ ] Create `ReferralService` class
  - [ ] `createReferral(referrer, referred, code)` - Create referral
  - [ ] `processReferralCompletion(referred, criteria)` - Process completion
  - [ ] `awardReferrerReward(referral)` - Award referrer
  - [ ] `awardReferredReward(referral)` - Award new user
  - [ ] `checkAbuse(referrer, referred)` - Check for abuse
  - [ ] `validateReferral(referrer, code)` - Validate referral

### 10.8 Referral Abuse Prevention
- [ ] Create `ReferralAbuseService` class
  - [ ] `checkDeviceFingerprint(referrer, referred)` - Check same device
  - [ ] `checkPhoneHash(referrer, referred)` - Check phone hash
  - [ ] `checkIPAddress(referrer, referred)` - Check IP address
  - [ ] `checkMultipleReferrals(referrer)` - Check multiple referrals from same user
  - [ ] `isAbuse(referrer, referred)` - Overall abuse check
- [ ] Implement abuse detection rules
- [ ] Log suspicious referrals

### 10.9 Loyalty Controllers
- [ ] Create `LoyaltyController`
  - [ ] `show()` - Get loyalty balance
  - [ ] `transactions()` - Get transaction history
  - [ ] `redeem(Request)` - Redeem points
  - [ ] `convertToWallet(Request)` - Convert to wallet
- [ ] Create Form Requests:
  - [ ] `RedeemPointsRequest`
  - [ ] `ConvertToWalletRequest`

### 10.10 Referral Controllers
- [ ] Create `ReferralController`
  - [ ] `show()` - Get user's referral code and stats
  - [ ] `referrals()` - Get referral list
  - [ ] `applyCode(Request)` - Apply referral code (for new users)
- [ ] Create Form Requests:
  - [ ] `ApplyReferralCodeRequest`

### 10.11 Admin Loyalty/Referral Controllers
- [ ] Create `Admin/LoyaltyController`
  - [ ] `index()` - List all loyalty accounts
  - [ ] `show(loyaltyPoint)` - Show account details
  - [ ] `adjust(Request, loyaltyPoint)` - Admin adjustment
  - [ ] `transactions(loyaltyPoint)` - View transactions
- [ ] Create `Admin/ReferralController`
  - [ ] `index()` - List all referrals
  - [ ] `show(referral)` - Show referral details
  - [ ] `approve(referral)` - Approve referral
  - [ ] `reject(referral)` - Reject referral
  - [ ] `getReports()` - Get referral reports

### 10.12 Integration Points
- [ ] Integrate with delivery completion (award points)
  - [ ] Update `DeliveryService` to award points
- [ ] Integrate with order completion (award points)
  - [ ] Update `OrderService` to award points
- [ ] Integrate with user registration (check referral)
  - [ ] Update `AuthController` to process referral
- [ ] Integrate with wallet (convert points)
  - [ ] Update `WalletService` to handle point conversion

### 10.13 Frontend Loyalty UI
- [ ] Create loyalty page (`resources/js/Pages/Loyalty/Index.tsx`)
  - [ ] Points balance display
  - [ ] Transaction history
  - [ ] Redeem points button
  - [ ] Convert to wallet button
  - [ ] Points earning rules
- [ ] Create loyalty transaction history page

### 10.14 Frontend Referral UI
- [ ] Create referral page (`resources/js/Pages/Referrals/Index.tsx`)
  - [ ] Referral code display (with copy button)
  - [ ] Share buttons (WhatsApp, SMS, etc.)
  - [ ] Referral stats (count, rewards earned)
  - [ ] Referral list (who referred, who was referred)
  - [ ] Referral link generation
- [ ] Create referral code application (for new users)
  - [ ] Apply code during registration

### 10.15 Admin Loyalty/Referral UI
- [ ] Create loyalty management page (admin)
  - [ ] Loyalty accounts list
  - [ ] Balance adjustment
  - [ ] Transaction history
- [ ] Create referral management page (admin)
  - [ ] Referrals list
  - [ ] Approval interface
  - [ ] Abuse detection alerts
  - [ ] Reports and analytics

### 10.16 Database Seeders
- [ ] Create `LoyaltyPointSeeder` (test accounts)
- [ ] Create `ReferralSeeder` (test referrals)
- [ ] Create test loyalty transactions

### 10.17 Testing
- [ ] Test loyalty points earning
- [ ] Test loyalty points redemption
- [ ] Test points to wallet conversion
- [ ] Test referral code generation
- [ ] Test referral creation
- [ ] Test referral completion
- [ ] Test referral abuse prevention
- [ ] Test reward distribution
- [ ] Feature tests for loyalty and referral flow

## Deliverables
- ✅ Loyalty points system
- ✅ Loyalty transactions
- ✅ Referral system
- ✅ Referral code generation
- ✅ Abuse prevention
- ✅ Wallet integration
- ✅ Customer loyalty/referral UI
- ✅ Admin management UI

## Success Criteria
- [ ] Points are awarded for deliveries
- [ ] Points can be redeemed or converted to wallet
- [ ] Referral codes are unique
- [ ] Referrals are tracked correctly
- [ ] Rewards are distributed correctly
- [ ] Abuse prevention works
- [ ] Customer can view loyalty balance and referrals

## Database Tables Created
- `loyalty_points`
- `loyalty_transactions`
- `loyalty_rules` (optional)
- `referrals`
- Update `users` table (referral_code, referred_by_id)

## Notes
- Points conversion rate should be configurable (e.g., 1 point = 1 rupee)
- Referral codes should be user-friendly (e.g., username-based)
- Abuse prevention is critical for referral system
- Points expiration can be implemented (optional)
- Referral rewards should be added to wallet automatically
- Consider referral tiers (future enhancement)

## Next Phase
Once Phase 10 is complete, proceed to **Phase 11: Coupon & Offer System**

