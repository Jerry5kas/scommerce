# Phase 11: Coupon & Offer System

## Objective
Implement controlled coupon and offer system with usage limits, user restrictions, and free sample exclusion logic.

## Prerequisites
- Phase 4 completed (Catalog)
- Phase 6 completed (Cart & Orders)
- Products and orders are working

## Tasks

### 11.1 Coupon Management
- [ ] Create `coupons` table migration
  - [ ] `id` (primary key)
  - [ ] `code` (string, unique, indexed)
  - [ ] `name` (string)
  - [ ] `description` (text, nullable)
  - [ ] `type` (enum: 'percentage', 'fixed', 'free_shipping')
  - [ ] `value` (decimal) - Discount value
  - [ ] `min_order_amount` (decimal, nullable) - Minimum order for coupon
  - [ ] `max_discount` (decimal, nullable) - Maximum discount (for percentage)
  - [ ] `usage_limit` (integer, nullable) - Total usage limit
  - [ ] `usage_limit_per_user` (integer, default: 1) - Per user limit
  - [ ] `used_count` (integer, default: 0)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `starts_at` (timestamp, nullable)
  - [ ] `ends_at` (timestamp, nullable)
  - [ ] `applicable_to` (enum: 'all', 'products', 'categories', 'collections')
  - [ ] `applicable_ids` (json, nullable) - Product/category/collection IDs
  - [ ] `exclude_free_samples` (boolean, default: true)
  - [ ] `exclude_subscriptions` (boolean, default: false)
  - [ ] `first_order_only` (boolean, default: false)
  - [ ] `new_users_only` (boolean, default: false)
  - [ ] `timestamps`
- [ ] Create `Coupon` model
  - [ ] Relationships (usages)
  - [ ] Scopes (active, valid, byCode)
  - [ ] Helper methods:
    - [ ] `isValid()` - Check if coupon is valid
    - [ ] `canBeUsedBy(user)` - Check user eligibility
    - [ ] `canBeUsedForOrder(order)` - Check order eligibility
    - [ ] `calculateDiscount(amount)` - Calculate discount amount
    - [ ] `isExpired()` - Check if expired
    - [ ] `hasReachedLimit()` - Check usage limit

### 11.2 Coupon Usages
- [ ] Create `coupon_usages` table migration
  - [ ] `id` (primary key)
  - [ ] `coupon_id` (foreign key, indexed)
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `order_id` (foreign key, nullable, indexed)
  - [ ] `discount_amount` (decimal)
  - [ ] `order_amount` (decimal) - Order total before discount
  - [ ] `used_at` (timestamp)
  - [ ] `ip_address` (string, nullable)
  - [ ] `device_info` (text, nullable)
  - [ ] `timestamps`
- [ ] Create `CouponUsage` model
  - [ ] Relationships (coupon, user, order)
  - [ ] Scopes (byCoupon, byUser, byDate)

### 11.3 Coupon Service
- [ ] Create `CouponService` class
  - [ ] `validateCoupon(code, user, cart)` - Validate coupon
  - [ ] `applyCoupon(cart, code)` - Apply coupon to cart
  - [ ] `removeCoupon(cart)` - Remove coupon from cart
  - [ ] `calculateDiscount(coupon, amount)` - Calculate discount
  - [ ] `checkEligibility(coupon, user, cart)` - Check eligibility
  - [ ] `checkUsageLimit(coupon, user)` - Check usage limit
  - [ ] `recordUsage(coupon, user, order, discount)` - Record usage
  - [ ] `checkFreeSampleExclusion(coupon, cart)` - Check free sample exclusion
  - [ ] `checkProductEligibility(coupon, cart)` - Check product eligibility

### 11.4 Coupon Validation Rules
- [ ] Create `CouponValidationService` class
  - [ ] `validateCode(code)` - Validate coupon code format
  - [ ] `validateDates(coupon)` - Validate start/end dates
  - [ ] `validateUsageLimit(coupon)` - Validate usage limit
  - [ ] `validateUserEligibility(coupon, user)` - Validate user eligibility
  - [ ] `validateOrderEligibility(coupon, cart)` - Validate order eligibility
  - [ ] `validateMinOrderAmount(coupon, cart)` - Validate minimum order
  - [ ] `validateProductEligibility(coupon, cartItems)` - Validate products

### 11.5 Coupon Controllers (Customer)
- [ ] Create `CouponController`
  - [ ] `validate(Request)` - Validate coupon code
  - [ ] `apply(Request)` - Apply coupon to cart
  - [ ] `remove()` - Remove coupon from cart
- [ ] Create Form Requests:
  - [ ] `ValidateCouponRequest`
  - [ ] `ApplyCouponRequest`

### 11.6 Coupon Controllers (Admin)
- [ ] Create `Admin/CouponController`
  - [ ] `index()` - List all coupons
  - [ ] `show(coupon)` - Show coupon details
  - [ ] `store(Request)` - Create coupon
  - [ ] `update(Request, coupon)` - Update coupon
  - [ ] `destroy(coupon)` - Delete coupon
  - [ ] `toggleStatus(coupon)` - Toggle active status
  - [ ] `getUsages(coupon)` - Get usage history
  - [ ] `getStats(coupon)` - Get coupon statistics
- [ ] Create Form Requests:
  - [ ] `StoreCouponRequest`
  - [ ] `UpdateCouponRequest`

### 11.7 Coupon Abuse Prevention
- [ ] Create `CouponAbuseService` class
  - [ ] `checkMultipleAccounts(user, coupon)` - Check multiple accounts
  - [ ] `checkDeviceFingerprint(user, coupon)` - Check device
  - [ ] `checkIPAddress(user, coupon)` - Check IP
  - [ ] `isAbuse(user, coupon)` - Overall abuse check
- [ ] Log suspicious coupon usage
- [ ] Block abusive users

### 11.8 Integration with Cart
- [ ] Update `Cart` model
  - [ ] Add coupon relationship
  - [ ] Add coupon discount calculation
- [ ] Update `CartService`
  - [ ] Integrate coupon application
  - [ ] Recalculate totals with coupon
- [ ] Update cart controllers to handle coupons

### 11.9 Integration with Orders
- [ ] Update `Order` model
  - [ ] Add coupon relationship
  - [ ] Store coupon code and discount
- [ ] Update `CheckoutService`
  - [ ] Apply coupon to order
  - [ ] Record coupon usage
- [ ] Update order creation to include coupon

### 11.10 Frontend Coupon UI
- [ ] Create coupon input component
  - [ ] Code input field
  - [ ] Apply button
  - [ ] Validation feedback
  - [ ] Error messages
- [ ] Update cart page
  - [ ] Coupon code section
  - [ ] Applied coupon display
  - [ ] Discount breakdown
  - [ ] Remove coupon button
- [ ] Create coupon validation feedback

### 11.11 Admin Coupon UI
- [ ] Create coupon list page (admin)
  - [ ] Filters (status, type, date)
  - [ ] Search functionality
  - [ ] Usage statistics
- [ ] Create coupon create/edit form (admin)
  - [ ] Basic details
  - [ ] Discount type and value
  - [ ] Usage limits
  - [ ] Date range
  - [ ] Eligibility rules
  - [ ] Product/category selection
  - [ ] User restrictions
- [ ] Create coupon detail page (admin)
  - [ ] Coupon details
  - [ ] Usage history
  - [ ] Statistics (usage count, total discount, etc.)
  - [ ] Edit/delete buttons

### 11.12 Coupon Reports
- [ ] Create `CouponReportService` class
  - [ ] `getCouponUsageReport(coupon, dateRange)` - Usage report
  - [ ] `getCouponPerformanceReport(dateRange)` - Performance report
  - [ ] `getTopCoupons(limit)` - Top performing coupons
  - [ ] `getAbuseAlerts()` - Abuse alerts
- [ ] Create admin report endpoints

### 11.13 Database Seeders
- [ ] Create `CouponSeeder` (test coupons)
  - [ ] Percentage discount coupon
  - [ ] Fixed discount coupon
  - [ ] Free shipping coupon
  - [ ] First order coupon
  - [ ] Category-specific coupon

### 11.14 Testing
- [ ] Test coupon creation
- [ ] Test coupon validation
- [ ] Test coupon application
- [ ] Test usage limits
- [ ] Test user restrictions
- [ ] Test free sample exclusion
- [ ] Test product eligibility
- [ ] Test coupon abuse prevention
- [ ] Feature tests for coupon flow

## Deliverables
- ✅ Coupon management system
- ✅ Coupon validation
- ✅ Usage tracking
- ✅ Abuse prevention
- ✅ Cart integration
- ✅ Order integration
- ✅ Customer coupon UI
- ✅ Admin coupon management UI

## Success Criteria
- [ ] Coupons can be created and managed
- [ ] Coupon codes are validated correctly
- [ ] Usage limits are enforced
- [ ] User restrictions work
- [ ] Free sample exclusion works
- [ ] Coupons are applied correctly in checkout
- [ ] Abuse prevention is effective

## Database Tables Created
- `coupons`
- `coupon_usages`

## Notes
- Coupon codes should be case-insensitive
- Usage limits should be checked before application
- Free sample exclusion is important for abuse prevention
- Coupon validation should be comprehensive
- Consider coupon expiration
- Track coupon performance for marketing insights

## Next Phase
Once Phase 11 is complete, proceed to **Phase 12: Marketing & Notifications**

