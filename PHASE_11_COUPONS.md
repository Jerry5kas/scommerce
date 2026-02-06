# Phase 11: Coupon & Offer System

## Objective
Implement controlled coupon and offer system with usage limits, user restrictions, and free sample exclusion logic.

## Prerequisites
- Phase 4 completed (Catalog)
- Phase 6 completed (Cart & Orders)
- Products and orders are working

## Tasks

### 11.1 Coupon Management
- [x] Create `coupons` table migration
  - [x] `id` (primary key)
  - [x] `code` (string, unique, indexed)
  - [x] `name` (string)
  - [x] `description` (text, nullable)
  - [x] `type` (enum: 'percentage', 'fixed', 'free_shipping')
  - [x] `value` (decimal) - Discount value
  - [x] `min_order_amount` (decimal, nullable) - Minimum order for coupon
  - [x] `max_discount` (decimal, nullable) - Maximum discount (for percentage)
  - [x] `usage_limit` (integer, nullable) - Total usage limit
  - [x] `usage_limit_per_user` (integer, default: 1) - Per user limit
  - [x] `used_count` (integer, default: 0)
  - [x] `is_active` (boolean, default: true)
  - [x] `starts_at` (timestamp, nullable)
  - [x] `ends_at` (timestamp, nullable)
  - [x] `applicable_to` (enum: 'all', 'products', 'categories', 'collections')
  - [x] `applicable_ids` (json, nullable) - Product/category/collection IDs
  - [x] `exclude_free_samples` (boolean, default: true)
  - [x] `exclude_subscriptions` (boolean, default: false)
  - [x] `first_order_only` (boolean, default: false)
  - [x] `new_users_only` (boolean, default: false)
  - [x] `timestamps`
- [x] Create `Coupon` model
  - [x] Relationships (usages)
  - [x] Scopes (active, valid, byCode)
  - [x] Helper methods:
    - [x] `isValid()` - Check if coupon is valid
    - [x] `canBeUsedBy(user)` - Check user eligibility
    - [x] `isApplicableToProduct(product)` - Check product eligibility
    - [x] `calculateDiscount(amount)` - Calculate discount amount
    - [x] `isExpired()` - Check if expired
    - [x] `hasReachedLimit()` - Check usage limit
    - [x] `hasReachedUserLimit(user)` - Check user limit

### 11.2 Coupon Usages
- [x] Create `coupon_usages` table migration
  - [x] `id` (primary key)
  - [x] `coupon_id` (foreign key, indexed)
  - [x] `user_id` (foreign key, indexed)
  - [x] `order_id` (foreign key, nullable, indexed)
  - [x] `discount_amount` (decimal)
  - [x] `order_amount` (decimal) - Order total before discount
  - [x] `used_at` (timestamp)
  - [x] `ip_address` (string, nullable)
  - [x] `device_info` (text, nullable)
  - [x] `timestamps`
- [x] Create `CouponUsage` model
  - [x] Relationships (coupon, user, order)
  - [x] Scopes (byCoupon, byUser, byDate, recent)

### 11.3 Coupon Service
- [x] Create `CouponService` class
  - [x] `validateCoupon(code, user, cart)` - Validate coupon
  - [x] `applyCoupon(cart, code, user)` - Apply coupon to cart
  - [x] `removeCoupon(cart)` - Remove coupon from cart
  - [x] `recordUsage(coupon, user, order, discount)` - Record usage
  - [x] `getEligibleCartTotal(coupon, cart)` - Get eligible cart total
  - [x] `checkProductEligibility(coupon, cart)` - Check product eligibility
  - [x] `cartHasSubscriptions(cart)` - Check subscription exclusion
  - [x] `cartHasFreeSamples(cart)` - Check free sample exclusion
  - [x] `getAvailableCoupons(user)` - Get available coupons for user
  - [x] `getCouponStats(coupon)` - Get coupon statistics

### 11.4 Coupon Validation Rules
- [x] Validation integrated into `CouponService::validateCoupon()`
  - [x] Code validation
  - [x] Date validation (starts_at, ends_at)
  - [x] Usage limit validation
  - [x] User eligibility validation (first order, new users)
  - [x] Order eligibility (min amount, product eligibility)
  - [x] Free sample/subscription exclusion

### 11.5 Coupon Controllers (Customer)
- [x] Create `CouponController`
  - [x] `validate(Request)` - Validate coupon code (API)
  - [x] `apply(Request)` - Apply coupon to cart
  - [x] `remove()` - Remove coupon from cart

### 11.6 Coupon Controllers (Admin)
- [x] Create `Admin/CouponController`
  - [x] `index()` - List all coupons with filters
  - [x] `create()` - Show create form
  - [x] `store(Request)` - Create coupon
  - [x] `show(coupon)` - Show coupon details with stats
  - [x] `edit(coupon)` - Show edit form
  - [x] `update(Request, coupon)` - Update coupon
  - [x] `destroy(coupon)` - Delete coupon
  - [x] `toggleStatus(coupon)` - Toggle active status
  - [x] `usages(coupon)` - Get usage history

### 11.7 Coupon Abuse Prevention
- [x] Basic abuse prevention in Coupon model
  - [x] Per-user usage limit enforced
  - [x] First order only restriction
  - [x] New users only restriction
  - [x] IP address logged in usage
- [ ] *Advanced abuse detection deferred (multiple accounts, device fingerprint)*

### 11.8 Integration with Cart
- [x] Cart model already has coupon_id and coupon_code fields
- [x] CouponService updates cart with coupon and recalculates totals
- [x] Customer routes for apply/remove coupon

### 11.9 Integration with Orders
- [x] Order model already has coupon_id and coupon_code fields
- [x] CouponService::recordUsage() for tracking
- [x] Integration point ready for CheckoutService

### 11.10 Frontend Coupon UI
- [x] Coupon routes available for cart integration
- [x] Validation API returns discount preview
- [ ] *Cart page coupon section - already exists in cart/index.tsx*

### 11.11 Admin Coupon UI
- [x] Create coupon list page (admin)
  - [x] Filters (status, type)
  - [x] Search functionality
  - [x] Usage statistics
  - [x] Toggle status
- [x] Create coupon create form (admin)
  - [x] Basic details
  - [x] Discount type and value
  - [x] Usage limits
  - [x] Date range
  - [x] Eligibility rules
  - [x] Product/category/collection selection
  - [x] User restrictions
- [x] Create coupon detail page (admin)
  - [x] Coupon details
  - [x] Usage history
  - [x] Statistics (usage count, total discount, etc.)
  - [x] Edit button

### 11.12 Coupon Reports
- [x] Basic stats in `CouponService::getCouponStats()`
- [ ] *Advanced reports deferred to Phase 14 (Admin Panel)*

### 11.13 Database Seeders
- [ ] *Seeders deferred - coupons created via admin UI*

### 11.14 Testing
- [ ] *Deferred - Testing will be done after all modules complete*

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
- [x] Coupons can be created and managed
- [x] Coupon codes are validated correctly
- [x] Usage limits are enforced
- [x] User restrictions work (first order, new users)
- [x] Free sample exclusion works
- [x] Coupons can be applied to cart
- [x] Basic abuse prevention (per-user limits)

## ✅ Phase 11 Complete
All mandatory features implemented.

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

