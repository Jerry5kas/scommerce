# Phase 7: Payment & Wallet System

## Objective
Implement payment gateway integration, wallet system, auto-recharge reminders, and refund handling.

## Prerequisites
- Phase 6 completed (Cart & Orders)
- Orders can be created
- Payment gateway credentials available

## Tasks

### 7.1 Payment Gateway Integration
- [ ] Choose payment gateway (Razorpay, Stripe, PayU, etc.)
- [ ] Install payment gateway SDK
- [ ] Configure payment gateway credentials in `.env`
- [ ] Create `PaymentGatewayService` class
  - [ ] `createPayment(order, amount, method)` - Create payment
  - [ ] `verifyPayment(paymentId)` - Verify payment
  - [ ] `refundPayment(paymentId, amount)` - Process refund
  - [ ] `getPaymentStatus(paymentId)` - Get status
- [ ] Set up webhook handler for payment callbacks

### 7.2 Payment Management
- [ ] Create `payments` table migration
  - [ ] `id` (primary key)
  - [ ] `order_id` (foreign key, indexed)
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `payment_id` (string, unique, indexed) - Gateway payment ID
  - [ ] `amount` (decimal)
  - [ ] `currency` (string, default: 'INR')
  - [ ] `method` (enum: 'gateway', 'wallet', 'cod') - Payment method
  - [ ] `gateway` (string, nullable) - e.g., 'razorpay', 'stripe'
  - [ ] `status` (enum: 'pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')
  - [ ] `gateway_response` (json, nullable) - Gateway response data
  - [ ] `failure_reason` (text, nullable)
  - [ ] `refunded_amount` (decimal, default: 0)
  - [ ] `refunded_at` (timestamp, nullable)
  - [ ] `paid_at` (timestamp, nullable)
  - [ ] `timestamps`
- [ ] Create `Payment` model
  - [ ] Relationships (order, user)
  - [ ] Scopes (pending, completed, failed, refunded)
  - [ ] Helper methods:
    - [ ] `isSuccessful()` - Check if payment successful
    - [ ] `canRefund()` - Check if can be refunded
    - [ ] `processRefund(amount)` - Process refund

### 7.3 Wallet System
- [ ] Create `wallets` table migration
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key, unique, indexed)
  - [ ] `balance` (decimal, default: 0)
  - [ ] `currency` (string, default: 'INR')
  - [ ] `is_active` (boolean, default: true)
  - [ ] `low_balance_threshold` (decimal, default: 100) - For reminders
  - [ ] `auto_recharge_enabled` (boolean, default: false)
  - [ ] `auto_recharge_amount` (decimal, nullable)
  - [ ] `auto_recharge_threshold` (decimal, nullable)
  - [ ] `timestamps`
- [ ] Create `Wallet` model
  - [ ] Relationships (user, transactions)
  - [ ] Helper methods:
    - [ ] `hasSufficientBalance(amount)` - Check balance
    - [ ] `deduct(amount, description)` - Deduct from wallet
    - [ ] `add(amount, description)` - Add to wallet
    - [ ] `isLowBalance()` - Check if low balance

### 7.4 Wallet Transactions
- [ ] Create `wallet_transactions` table migration
  - [ ] `id` (primary key)
  - [ ] `wallet_id` (foreign key, indexed)
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `type` (enum: 'credit', 'debit')
  - [ ] `amount` (decimal)
  - [ ] `balance_before` (decimal)
  - [ ] `balance_after` (decimal)
  - [ ] `transaction_type` (enum: 'recharge', 'payment', 'refund', 'loyalty', 'referral', 'admin_adjustment')
  - [ ] `reference_id` (string, nullable) - Order ID, payment ID, etc.
  - [ ] `reference_type` (string, nullable) - Model class
  - [ ] `description` (text, nullable)
  - [ ] `status` (enum: 'pending', 'completed', 'failed')
  - [ ] `timestamps`
- [ ] Create `WalletTransaction` model
  - [ ] Relationships (wallet, user)
  - [ ] Scopes (credit, debit, byType, completed)
  - [ ] Polymorphic relationship for reference

### 7.5 Wallet Controllers
- [ ] Create `WalletController`
  - [ ] `show()` - Get wallet balance and transactions
  - [ ] `recharge(Request)` - Recharge wallet
  - [ ] `transactions()` - Get transaction history
  - [ ] `setAutoRecharge(Request)` - Configure auto-recharge
- [ ] Create Form Requests:
  - [ ] `RechargeWalletRequest`
  - [ ] `SetAutoRechargeRequest`

### 7.6 Wallet Service
- [ ] Create `WalletService` class
  - [ ] `getOrCreateWallet(user)` - Get or create wallet
  - [ ] `recharge(wallet, amount, paymentMethod)` - Process recharge
  - [ ] `deductForOrder(wallet, order)` - Deduct for order payment
  - [ ] `addRefund(wallet, order, amount)` - Add refund to wallet
  - [ ] `addLoyaltyReward(wallet, amount, description)` - Add loyalty points - Phase 10
  - [ ] `addReferralReward(wallet, amount, description)` - Add referral reward - Phase 10
  - [ ] `createTransaction(wallet, type, amount, data)` - Create transaction record
  - [ ] `checkLowBalance(wallet)` - Check and trigger reminder

### 7.7 Payment Processing
- [ ] Create `PaymentService` class
  - [ ] `processPayment(order, method, walletUsage)` - Main payment processor
  - [ ] `processGatewayPayment(order, gateway)` - Process gateway payment
  - [ ] `processWalletPayment(order, wallet)` - Process wallet payment
  - [ ] `processCodPayment(order)` - Process COD (if applicable)
  - [ ] `handlePaymentSuccess(payment, response)` - Handle successful payment
  - [ ] `handlePaymentFailure(payment, reason)` - Handle failed payment
  - [ ] `processRefund(order, amount)` - Process refund
  - [ ] `verifyWebhook(request)` - Verify webhook signature

### 7.8 Payment Priority Logic
- [ ] Implement payment priority:
  1. Wallet (if enabled and sufficient balance)
  2. Gateway payment (for remaining amount)
- [ ] Create `PaymentPriorityService`
  - [ ] `calculatePaymentSplit(order, walletUsage)` - Calculate split
  - [ ] `processSplitPayment(order, walletAmount, gatewayAmount)` - Process split

### 7.9 Auto-Recharge System
- [ ] Create `AutoRechargeService` class
  - [ ] `checkAndRecharge(wallet)` - Check threshold and recharge
  - [ ] `processAutoRecharge(wallet)` - Process auto-recharge
- [ ] Create job: `ProcessAutoRecharges`
  - [ ] Run daily
  - [ ] Check wallets below threshold
  - [ ] Process auto-recharge if enabled
- [ ] Create recharge reminder job (Phase 12)

### 7.10 Refund Handling
- [ ] Create `RefundService` class
  - [ ] `processRefund(order, amount, reason)` - Process refund
  - [ ] `refundToWallet(order, amount)` - Refund to wallet
  - [ ] `refundToGateway(payment, amount)` - Refund via gateway
  - [ ] `createRefundRecord(order, amount, method)` - Create refund record
- [ ] Handle partial refunds
- [ ] Handle full refunds

### 7.11 Payment Controllers (Admin)
- [ ] Create `Admin/PaymentController`
  - [ ] `index()` - List all payments
  - [ ] `show(payment)` - Show payment details
  - [ ] `refund(Request, payment)` - Process refund
  - [ ] `retry(payment)` - Retry failed payment
- [ ] Create `Admin/WalletController`
  - [ ] `index()` - List all wallets
  - [ ] `show(wallet)` - Show wallet details
  - [ ] `adjust(Request, wallet)` - Admin balance adjustment
  - [ ] `transactions(wallet)` - View transactions

### 7.12 Payment Webhooks
- [ ] Create webhook route: `/api/webhooks/payment/{gateway}`
- [ ] Create `PaymentWebhookController`
  - [ ] `handle(request, gateway)` - Handle webhook
  - [ ] Verify webhook signature
  - [ ] Update payment status
  - [ ] Update order status
  - [ ] Handle refund webhooks

### 7.13 Frontend Payment UI
- [ ] Create payment method selection component
  - [ ] Wallet option (with balance display)
  - [ ] Gateway payment options
  - [ ] COD option (if applicable)
- [ ] Create wallet page (`resources/js/Pages/Wallet/Index.tsx`)
  - [ ] Balance display
  - [ ] Recharge button
  - [ ] Transaction history
  - [ ] Auto-recharge settings
- [ ] Create recharge page (`resources/js/Pages/Wallet/Recharge.tsx`)
  - [ ] Amount input
  - [ ] Payment method selection
  - [ ] Process recharge
- [ ] Integrate payment in checkout flow
  - [ ] Payment method selection
  - [ ] Wallet usage toggle
  - [ ] Payment processing
  - [ ] Success/failure handling

### 7.14 Admin Payment UI
- [ ] Create payment list page (admin)
  - [ ] Filters (status, date, gateway)
  - [ ] Search functionality
- [ ] Create payment detail page (admin)
  - [ ] Payment details
  - [ ] Gateway response
  - [ ] Refund interface
  - [ ] Retry button
- [ ] Create wallet management page (admin)
  - [ ] Wallet list
  - [ ] Balance adjustment
  - [ ] Transaction history

### 7.15 Database Seeders
- [ ] Create `WalletSeeder` (test wallets)
- [ ] Create `PaymentSeeder` (test payments)
- [ ] Create test wallet transactions

### 7.16 Testing
- [ ] Test wallet creation
- [ ] Test wallet recharge
- [ ] Test wallet payment
- [ ] Test gateway payment
- [ ] Test payment webhooks
- [ ] Test refund processing
- [ ] Test auto-recharge
- [ ] Test payment priority logic
- [ ] Feature tests for payment flow

## Deliverables
- ✅ Payment gateway integration
- ✅ Wallet system
- ✅ Wallet transactions
- ✅ Auto-recharge system
- ✅ Refund handling
- ✅ Payment webhooks
- ✅ Customer wallet UI
- ✅ Admin payment/wallet management UI

## Success Criteria
- [ ] Payments can be processed via gateway
- [ ] Wallet system works correctly
- [ ] Wallet recharge works
- [ ] Refunds are processed correctly
- [ ] Auto-recharge triggers when balance is low
- [ ] Payment webhooks are handled securely
- [ ] Payment priority logic works (wallet first, then gateway)

## Database Tables Created
- `payments`
- `wallets`
- `wallet_transactions`

## Notes
- All wallet transactions must be atomic (use database transactions)
- Payment webhooks must verify signatures
- Refunds should default to wallet (faster)
- Auto-recharge should have user consent
- Low balance threshold should be configurable
- Payment failures should trigger retry mechanism

## Next Phase
Once Phase 7 is complete, proceed to **Phase 8: Delivery & Proof Enforcement**

