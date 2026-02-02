# Phase 5: Subscription Management (Critical)

## Objective
Implement subscription-first ordering system with flexible scheduling, pause/resume, and automatic order generation.

## Prerequisites
- Phase 4 completed (Catalog & Products)
- Products marked as subscription-eligible exist
- User addresses and zones are set up

## Business Verticals
**Subscriptions are Society Fresh only** (scheduled commerce). Subscription UI lives under Society Fresh. See [PHASE_NEW_UPDATE.md](PHASE_NEW_UPDATE.md).
- [ ] Optional: add `vertical` (default `society_fresh`) to subscription tables for clarity and reporting

## Tasks

### 5.1 Subscription Plans
- [ ] Create `subscription_plans` table migration
  - [ ] `id` (primary key)
  - [ ] `name` (string) - e.g., "Daily", "Alternate Days"
  - [ ] `slug` (string, unique)
  - [ ] `description` (text, nullable)
  - [ ] `frequency_type` (enum: 'daily', 'alternate_days', 'custom')
  - [ ] `frequency_value` (integer, nullable) - For custom (e.g., every 3 days)
  - [ ] `days_of_week` (json, nullable) - For custom weekly schedule
  - [ ] `is_active` (boolean, default: true)
  - [ ] `display_order` (integer, default: 0)
  - [ ] `timestamps`
- [ ] Create `SubscriptionPlan` model
  - [ ] Relationships (subscriptions)
  - [ ] Scopes (active)
  - [ ] Helper methods (getNextDeliveryDate, etc.)

### 5.2 Subscriptions
- [ ] Create `subscriptions` table migration
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `user_address_id` (foreign key) - Delivery address
  - [ ] `subscription_plan_id` (foreign key)
  - [ ] `status` (enum: 'active', 'paused', 'cancelled', 'expired')
  - [ ] `start_date` (date)
  - [ ] `end_date` (date, nullable) - If has expiry
  - [ ] `next_delivery_date` (date) - Calculated next delivery
  - [ ] `paused_until` (date, nullable) - If paused
  - [ ] `vacation_start` (date, nullable)
  - [ ] `vacation_end` (date, nullable)
  - [ ] `billing_cycle` (enum: 'weekly', 'monthly') - For future billing
  - [ ] `auto_renew` (boolean, default: true)
  - [ ] `notes` (text, nullable) - Delivery instructions
  - [ ] `cancelled_at` (timestamp, nullable)
  - [ ] `cancellation_reason` (text, nullable)
  - [ ] `timestamps`
- [ ] Create `Subscription` model
  - [ ] Relationships (user, address, plan, items, orders, bottles)
  - [ ] Scopes (active, paused, cancelled, dueForDelivery)
  - [ ] Helper methods:
    - [ ] `calculateNextDeliveryDate()` - Calculate next delivery
    - [ ] `isDueForDelivery(date)` - Check if due
    - [ ] `canEdit()` - Check if editable (current & previous month)
    - [ ] `pause(until)` - Pause subscription
    - [ ] `resume()` - Resume subscription
    - [ ] `cancel(reason)` - Cancel subscription
    - [ ] `setVacation(start, end)` - Set vacation hold

### 5.3 Subscription Items
- [ ] Create `subscription_items` table migration
  - [ ] `id` (primary key)
  - [ ] `subscription_id` (foreign key, indexed)
  - [ ] `product_id` (foreign key)
  - [ ] `quantity` (integer, default: 1)
  - [ ] `price` (decimal) - Price at time of subscription
  - [ ] `display_order` (integer, default: 0)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `timestamps`
- [ ] Create `SubscriptionItem` model
  - [ ] Relationships (subscription, product)
  - [ ] Scopes (active)

### 5.4 Subscription Schedule Calculation
- [ ] Create `SubscriptionScheduleService` class
  - [ ] `calculateNextDeliveryDate(subscription, fromDate)` - Calculate next delivery
  - [ ] `getDeliveryDatesForMonth(subscription, month, year)` - Get all delivery dates for month
  - [ ] `isDeliveryDate(subscription, date)` - Check if date is delivery date
  - [ ] `getScheduleForMonth(subscription, month, year)` - Get full schedule
- [ ] Handle different frequency types:
  - [ ] Daily: Every day
  - [ ] Alternate days: Every 2 days
  - [ ] Custom: Based on frequency_value or days_of_week

### 5.5 Subscription Controllers (Customer)
- [ ] Create `SubscriptionController`
  - [ ] `index()` - List user's subscriptions
  - [ ] `show(subscription)` - Show subscription details
  - [ ] `store(Request)` - Create subscription
  - [ ] `update(Request, subscription)` - Update subscription (current & previous month only)
  - [ ] `pause(Request, subscription)` - Pause subscription
  - [ ] `resume(subscription)` - Resume subscription
  - [ ] `cancel(Request, subscription)` - Cancel subscription
  - [ ] `setVacation(Request, subscription)` - Set vacation hold
  - [ ] `getSchedule(subscription, month, year)` - Get delivery schedule
- [ ] Create Form Requests:
  - [ ] `StoreSubscriptionRequest`
  - [ ] `UpdateSubscriptionRequest`
  - [ ] `PauseSubscriptionRequest`
  - [ ] `CancelSubscriptionRequest`
  - [ ] `VacationRequest`

### 5.6 Subscription Controllers (Admin)
- [ ] Create `Admin/SubscriptionController`
  - [ ] `index()` - List all subscriptions (with filters)
  - [ ] `show(subscription)` - Show subscription details
  - [ ] `update(Request, subscription)` - Admin override update
  - [ ] `pause(Request, subscription)` - Admin pause
  - [ ] `resume(subscription)` - Admin resume
  - [ ] `cancel(Request, subscription)` - Admin cancel
  - [ ] `getSchedule(subscription)` - Get schedule
  - [ ] `getUpcomingDeliveries(date)` - Get subscriptions due for delivery
- [ ] Create Form Requests for admin actions

### 5.7 Subscription-to-Order Generation
- [ ] Create `GenerateOrdersFromSubscriptions` job
  - [ ] Run daily via cron
  - [ ] Find all active subscriptions due for delivery today
  - [ ] Check if order already exists for today
  - [ ] Create orders for each subscription
  - [ ] Link orders to subscriptions
  - [ ] Handle paused/vacation subscriptions
- [ ] Create `SubscriptionOrderService`
  - [ ] `generateOrderForSubscription(subscription, deliveryDate)` - Generate single order
  - [ ] `generateOrdersForDate(date)` - Generate all orders for date
  - [ ] `shouldGenerateOrder(subscription, date)` - Check if should generate

### 5.8 Subscription Validation
- [ ] Create `SubscriptionValidationService`
  - [ ] `validateSubscriptionCreation(user, products, address)` - Validate before creation
  - [ ] `validateSubscriptionUpdate(subscription, changes)` - Validate update
  - [ ] `canEditSubscription(subscription)` - Check edit permissions (current & previous month)
  - [ ] `validateProductsAvailability(products, zone)` - Check product availability
  - [ ] `validateAddressServiceability(address)` - Check address serviceability

### 5.9 Bottle Integration (Phase 9 Preview)
- [ ] Link bottles to subscriptions
  - [ ] `bottles_issued` count in subscription
  - [ ] `bottles_returned` count in subscription
  - [ ] Track bottle issue/return per subscription
- [ ] Update subscription when bottles are issued/returned

### 5.10 Frontend Subscription UI
- [ ] Create subscription list page (`resources/js/Pages/Subscriptions/Index.tsx`)
  - [ ] List of user's subscriptions
  - [ ] Status indicators
  - [ ] Next delivery date
  - [ ] Quick actions (pause, cancel)
- [ ] Create subscription detail page (`resources/js/Pages/Subscriptions/Show.tsx`)
  - [ ] Subscription details
  - [ ] Items list
  - [ ] Delivery schedule calendar
  - [ ] Edit button (if editable)
  - [ ] Pause/Resume buttons
  - [ ] Cancel button
  - [ ] Vacation hold form
- [ ] Create subscription create page (`resources/js/Pages/Subscriptions/Create.tsx`)
  - [ ] Plan selection
  - [ ] Product selection (subscription-eligible only)
  - [ ] Quantity selection
  - [ ] Address selection
  - [ ] Delivery instructions
  - [ ] Schedule preview
- [ ] Create subscription edit page (`resources/js/Pages/Subscriptions/Edit.tsx`)
  - [ ] Edit items (add/remove/update quantity)
  - [ ] Edit schedule (if within editable period)
  - [ ] Edit delivery instructions
- [ ] Create subscription schedule component
  - [ ] Calendar view
  - [ ] Delivery dates highlighted
  - [ ] Month navigation

### 5.11 Admin Subscription UI
- [ ] Create subscription list page (admin)
  - [ ] Filters (status, date, user)
  - [ ] Bulk actions
  - [ ] Export functionality
- [ ] Create subscription detail page (admin)
  - [ ] Full subscription details
  - [ ] Edit override (admin can edit any subscription)
  - [ ] Order history linked
  - [ ] Bottle history
  - [ ] Activity log
- [ ] Create upcoming deliveries dashboard
  - [ ] List of subscriptions due today/tomorrow
  - [ ] Group by zone/driver

### 5.12 Subscription Notifications
- [ ] Create subscription notification templates
  - [ ] Subscription created
  - [ ] Subscription updated
  - [ ] Subscription paused
  - [ ] Subscription resumed
  - [ ] Subscription cancelled
  - [ ] Upcoming delivery reminder
  - [ ] Delivery scheduled
- [ ] Integrate with notification system (Phase 12)

### 5.13 Database Seeders
- [ ] Create `SubscriptionPlanSeeder` (daily, alternate, custom plans)
- [ ] Create `SubscriptionSeeder` (test subscriptions)
- [ ] Create test subscription items

### 5.14 Cron Job Setup
- [ ] Create artisan command: `subscriptions:generate-orders`
  - [ ] Generate orders for today's deliveries
  - [ ] Can be run manually or via cron
- [ ] Schedule in `routes/console.php` or cron
  - [ ] Run daily at specified time (e.g., 6 AM)
- [ ] Create command: `subscriptions:update-next-delivery`
  - [ ] Update next_delivery_date for all active subscriptions

### 5.15 Testing
- [ ] Test subscription creation
- [ ] Test subscription update (within editable period)
- [ ] Test subscription update (outside editable period - should fail)
- [ ] Test pause/resume
- [ ] Test vacation hold
- [ ] Test cancellation
- [ ] Test schedule calculation (daily, alternate, custom)
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
- [ ] Users can create subscriptions with flexible schedules
- [ ] Subscriptions can only be edited for current & previous month
- [ ] Orders are automatically generated from subscriptions
- [ ] Pause/resume/vacation hold works correctly
- [ ] Schedule calculation is accurate for all frequency types
- [ ] Cron job generates orders daily

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

