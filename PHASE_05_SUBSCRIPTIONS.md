# Phase 5: Subscription Management (Critical)

## Objective
Implement subscription-first ordering system with flexible scheduling, pause/resume, and automatic order generation.

## Prerequisites
- Phase 4 completed (Catalog & Products)
- Products marked as subscription-eligible exist
- User addresses and zones are set up

## Business Verticals
**Subscriptions are Society Fresh only** (scheduled commerce). Subscription UI lives under Society Fresh. See [PHASE_NEW_UPDATE.md](PHASE_NEW_UPDATE.md).
- [x] Add `vertical` (default `society_fresh`) to subscriptions table

## Tasks

### 5.1 Subscription Plans
- [x] Create `subscription_plans` table migration
  - [x] `id` (primary key)
  - [x] `name` (string) - e.g., "Daily", "Alternate Days"
  - [x] `slug` (string, unique)
  - [x] `description` (text, nullable)
  - [x] `frequency_type` (enum: 'daily', 'alternate_days', 'weekly', 'custom')
  - [x] `frequency_value` (integer, nullable) - For custom (e.g., every 3 days)
  - [x] `days_of_week` (json, nullable) - For custom weekly schedule
  - [x] `discount_percent` (decimal) - Plan discount
  - [x] `min_deliveries` (integer, nullable) - Min commitment
  - [x] `is_active` (boolean, default: true)
  - [x] `display_order` (integer, default: 0)
  - [x] `timestamps`
- [x] Create `SubscriptionPlan` model
  - [x] Relationships (subscriptions)
  - [x] Scopes (active, ordered)
  - [x] Helper methods (getNextDeliveryDate, isDeliveryDate, getDeliveryDatesForMonth)

### 5.2 Subscriptions
- [x] Create `subscriptions` table migration
  - [x] `id` (primary key)
  - [x] `user_id` (foreign key, indexed)
  - [x] `user_address_id` (foreign key) - Delivery address
  - [x] `subscription_plan_id` (foreign key)
  - [x] `status` (enum: 'active', 'paused', 'cancelled', 'expired')
  - [x] `start_date` (date)
  - [x] `end_date` (date, nullable) - If has expiry
  - [x] `next_delivery_date` (date) - Calculated next delivery
  - [x] `paused_until` (date, nullable) - If paused
  - [x] `vacation_start` (date, nullable)
  - [x] `vacation_end` (date, nullable)
  - [x] `billing_cycle` (enum: 'weekly', 'monthly') - For future billing
  - [x] `auto_renew` (boolean, default: true)
  - [x] `notes` (text, nullable) - Delivery instructions
  - [x] `vertical` (string) - Business vertical
  - [x] `bottles_issued`, `bottles_returned` - Bottle tracking
  - [x] `cancelled_at` (timestamp, nullable)
  - [x] `cancellation_reason` (text, nullable)
  - [x] `timestamps`
- [x] Create `Subscription` model
  - [x] Relationships (user, address, plan, items)
  - [x] Scopes (active, paused, cancelled, dueForDelivery, forUser)
  - [x] Helper methods:
    - [x] `calculateNextDeliveryDate()` - Calculate next delivery
    - [x] `isDueForDelivery(date)` - Check if due
    - [x] `isOnVacation(date)` - Check vacation status
    - [x] `canEdit()` - Check if editable (current & previous month)
    - [x] `pause(until)` - Pause subscription
    - [x] `resume()` - Resume subscription
    - [x] `cancel(reason)` - Cancel subscription
    - [x] `setVacation(start, end)` - Set vacation hold
    - [x] `clearVacation()` - Clear vacation hold

### 5.3 Subscription Items
- [x] Create `subscription_items` table migration
  - [x] `id` (primary key)
  - [x] `subscription_id` (foreign key, indexed)
  - [x] `product_id` (foreign key)
  - [x] `quantity` (integer, default: 1)
  - [x] `price` (decimal) - Price at time of subscription
  - [x] `display_order` (integer, default: 0)
  - [x] `is_active` (boolean, default: true)
  - [x] `timestamps`
- [x] Create `SubscriptionItem` model
  - [x] Relationships (subscription, product)
  - [x] Scopes (active, ordered)
  - [x] Helper methods (getLineTotal)

### 5.4 Subscription Schedule Calculation
- [x] Create `SubscriptionScheduleService` class
  - [x] `calculateNextDeliveryDate(subscription, fromDate)` - Calculate next delivery
  - [x] `getDeliveryDatesForMonth(subscription, month, year)` - Get all delivery dates for month
  - [x] `isDeliveryDate(subscription, date)` - Check if date is delivery date
  - [x] `getScheduleForMonth(subscription, month, year)` - Get full schedule with calendar
  - [x] `getUpcomingDeliveries(subscription, limit)` - Get upcoming deliveries
  - [x] `countDeliveriesInRange(subscription, start, end)` - Count deliveries
- [x] Handle different frequency types:
  - [x] Daily: Every day
  - [x] Alternate days: Every 2 days
  - [x] Weekly: Based on days_of_week
  - [x] Custom: Based on frequency_value

### 5.5 Subscription Controllers (Customer)
- [x] Create `SubscriptionController`
  - [x] `index()` - List user's subscriptions
  - [x] `show(subscription)` - Show subscription details
  - [x] `create()` - Show create form
  - [x] `store(Request)` - Create subscription
  - [x] `edit(subscription)` - Show edit form
  - [x] `update(Request, subscription)` - Update subscription (current & previous month only)
  - [x] `pause(Request, subscription)` - Pause subscription
  - [x] `resume(subscription)` - Resume subscription
  - [x] `cancel(Request, subscription)` - Cancel subscription
  - [x] `setVacation(Request, subscription)` - Set vacation hold
  - [x] `clearVacation(subscription)` - Clear vacation hold
  - [x] `getSchedule(subscription, month, year)` - Get delivery schedule
- [x] Create Form Requests:
  - [x] `StoreSubscriptionRequest`
  - [x] `UpdateSubscriptionRequest`
  - [x] `PauseSubscriptionRequest`
  - [x] `CancelSubscriptionRequest`
  - [x] `VacationRequest`

### 5.6 Subscription Controllers (Admin)
- [x] Create `Admin/SubscriptionController`
  - [x] `index()` - List all subscriptions (with filters)
  - [x] `show(subscription)` - Show subscription details
  - [x] `edit(subscription)` - Show edit form
  - [x] `update(Request, subscription)` - Admin override update
  - [x] `pause(Request, subscription)` - Admin pause
  - [x] `resume(subscription)` - Admin resume
  - [x] `cancel(Request, subscription)` - Admin cancel
  - [x] `getSchedule(subscription)` - Get schedule
  - [x] `upcomingDeliveries(date)` - Get subscriptions due for delivery
  - [x] `generateOrders(date)` - Manually trigger order generation
- [x] Create `Admin/SubscriptionPlanController`
  - [x] CRUD operations for subscription plans
  - [x] Toggle status

### 5.7 Subscription-to-Order Generation
- [x] Create `SubscriptionOrderService`
  - [x] `generateOrderForSubscription(subscription, deliveryDate)` - Generate single order
  - [x] `generateOrdersForDate(date)` - Generate all orders for date
  - [x] `shouldGenerateOrder(subscription, date)` - Check if should generate
  - [x] `getSubscriptionsDueForDelivery(date)` - Get due subscriptions
  - [x] `previewOrdersForDate(date)` - Preview orders

### 5.8 Subscription Validation
- [x] Create `SubscriptionValidationService`
  - [x] `validateSubscriptionCreation(user, products, address, plan)` - Validate before creation
  - [x] `validateSubscriptionUpdate(subscription, changes)` - Validate update
  - [x] `canEditSubscription(subscription)` - Check edit permissions (current & previous month)
  - [x] `validateProductsAvailability(products, zone)` - Check product availability
  - [x] `validateAddressServiceability(address)` - Check address serviceability
  - [x] `getEligibleProducts(zone)` - Get subscription-eligible products

### 5.9 Bottle Integration (Phase 9 Preview)
- [x] Link bottles to subscriptions
  - [x] `bottles_issued` count in subscription
  - [x] `bottles_returned` count in subscription

### 5.10 Frontend Subscription UI
- [x] Create subscription list page (`resources/js/pages/subscriptions/index.tsx`)
  - [x] List of user's subscriptions
  - [x] Status indicators
  - [x] Next delivery date
  - [x] Quick actions link
- [x] Create subscription detail page (`resources/js/pages/subscriptions/show.tsx`)
  - [x] Subscription details
  - [x] Items list
  - [x] Delivery schedule calendar
  - [x] Edit button (if editable)
  - [x] Pause/Resume buttons
  - [x] Cancel button
  - [x] Vacation hold form
- [x] Create subscription create page (`resources/js/pages/subscriptions/create.tsx`)
  - [x] Plan selection (step 1)
  - [x] Product selection (step 2)
  - [x] Address selection (step 3)
  - [x] Review & confirm (step 4)
  - [x] Delivery instructions
  - [x] Price preview with discounts
- [x] Create subscription edit page (`resources/js/pages/subscriptions/edit.tsx`)
  - [x] Edit items (add/remove/update quantity)
  - [x] Edit delivery address
  - [x] Edit delivery instructions

### 5.11 Admin Subscription UI
- [x] Create subscription list page (admin)
  - [x] Filters (status, plan, search)
  - [x] User details
  - [x] Zone info
- [x] Create subscription detail page (admin)
  - [x] Full subscription details
  - [x] Edit override (admin can edit any subscription)
  - [x] Bottle counts
  - [x] Schedule calendar
- [x] Create subscription plans management page
  - [x] List plans with subscription counts
  - [x] Create/edit/delete plans
  - [x] Toggle active status

### 5.12 Subscription Notifications
- [ ] Create subscription notification templates (deferred to Phase 12)
  - [ ] Subscription created
  - [ ] Subscription updated
  - [ ] Subscription paused
  - [ ] Subscription resumed
  - [ ] Subscription cancelled
  - [ ] Upcoming delivery reminder
  - [ ] Delivery scheduled

### 5.13 Database Seeders
- [x] Create `SubscriptionPlanSeeder` (daily, alternate, weekly, custom plans)

### 5.14 Cron Job Setup
- [x] Create artisan command: `subscriptions:generate-orders`
  - [x] Generate orders for today's deliveries
  - [x] Preview mode with --preview flag
  - [x] Can be run manually or via cron
- [x] Schedule in `routes/console.php`
  - [x] Run daily at 6 AM
- [x] Create command: `subscriptions:update-next-delivery`
  - [x] Update next_delivery_date for all active subscriptions
  - [x] Scheduled at 5 AM

### 5.15 Testing
> **Deferred**: Testing will be done after all modules are complete.
- [ ] Test subscription creation
- [ ] Test subscription update (within editable period)
- [ ] Test subscription update (outside editable period - should fail)
- [ ] Test pause/resume
- [ ] Test vacation hold
- [ ] Test cancellation
- [ ] Test schedule calculation (daily, alternate, weekly, custom)
- [ ] Test order generation from subscriptions
- [ ] Test duplicate order prevention
- [ ] Feature tests for subscription flow

## Deliverables
- ✅ Subscription plans system
- ✅ Subscription management (create, update, pause, resume, cancel)
- ✅ Subscription schedule calculation
- ✅ Subscription-to-order generation (automated)
- ✅ Subscription validation (editable period enforcement)
- ✅ Customer subscription UI
- ✅ Admin subscription management UI
- ✅ Cron job for order generation

## Success Criteria
- [x] Users can create subscriptions with flexible schedules
- [x] Subscriptions can only be edited for current & previous month
- [x] Orders are automatically generated from subscriptions
- [x] Pause/resume/vacation hold works correctly
- [x] Schedule calculation is accurate for all frequency types
- [x] Cron job generates orders daily

## Database Tables Created
- `subscription_plans`
- `subscriptions`
- `subscription_items`

## Notes
- Subscription editing restriction (current & previous month) is critical
- Order generation should be idempotent (prevent duplicates)
- Schedule calculation must account for paused/vacation periods
- Next delivery date should be recalculated after any change
- Consider timezone handling for delivery dates
- Subscription status transitions should be logged

## Next Phase
Once Phase 5 is complete, proceed to **Phase 6: Cart & Order Management**

