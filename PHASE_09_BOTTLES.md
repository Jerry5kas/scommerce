# Phase 9: Bottle Management

## Objective
Implement bottle tracking system to prevent asset loss in dairy logistics with issue, return, and damage tracking.

## Prerequisites
- Phase 5 completed (Subscriptions)
- Phase 8 completed (Delivery)
- Products marked as bottle-required exist

## Business Verticals
**Bottle returns and deposit apply to Society Fresh** (scheduled commerce). Daily Fresh typically no bottle return. See [PHASE_NEW_UPDATE.md](PHASE_NEW_UPDATE.md).

## Tasks

### 9.1 Bottle Management
- [x] Create `bottles` table migration
  - [x] `id` (primary key)
  - [x] `bottle_number` (string, unique, indexed) - Unique bottle identifier
  - [x] `barcode` (string, unique, nullable, indexed) - Barcode/QR code
  - [x] `type` (enum: 'standard', 'premium', 'custom') - Bottle type
  - [x] `capacity` (decimal, nullable) - Capacity in litres
  - [x] `status` (enum: 'available', 'issued', 'returned', 'damaged', 'lost')
  - [x] `current_user_id` (foreign key, nullable) - Current holder
  - [x] `current_subscription_id` (foreign key, nullable) - Linked subscription
  - [x] `purchase_cost` (decimal, nullable) - Cost of bottle
  - [x] `deposit_amount` (decimal, nullable) - Deposit charged
  - [x] `issued_at` (timestamp, nullable)
  - [x] `returned_at` (timestamp, nullable)
  - [x] `damaged_at` (timestamp, nullable)
  - [x] `notes` (text, nullable)
  - [x] `timestamps`
- [x] Create `Bottle` model
  - [x] Relationships (currentUser, currentSubscription, logs)
  - [x] Scopes (available, issued, returned, damaged, byStatus)
  - [x] Helper methods:
    - [x] `issueTo(user, subscription)` - Issue bottle
    - [x] `returnBottle(condition)` - Return bottle
    - [x] `markAsDamaged(reason)` - Mark as damaged
    - [x] `markAsLost()` - Mark as lost

### 9.2 Bottle Logs
- [x] Create `bottle_logs` table migration
  - [x] `id` (primary key)
  - [x] `bottle_id` (foreign key, indexed)
  - [x] `user_id` (foreign key, indexed)
  - [x] `subscription_id` (foreign key, nullable)
  - [x] `delivery_id` (foreign key, nullable)
  - [x] `action` (enum: 'issued', 'returned', 'damaged', 'lost', 'found', 'transferred')
  - [x] `action_by` (enum: 'system', 'driver', 'admin', 'customer')
  - [x] `action_by_id` (foreign key, nullable) - User/Driver/Admin ID
  - [x] `condition` (string, nullable) - Condition at return
  - [x] `notes` (text, nullable)
  - [x] `deposit_amount` (decimal, nullable) - Deposit at issue
  - [x] `refund_amount` (decimal, nullable) - Refund at return
  - [x] `timestamps`
- [x] Create `BottleLog` model
  - [x] Relationships (bottle, user, subscription, delivery)
  - [x] Scopes (byAction, byBottle, recent)

### 9.3 Bottle Service
- [x] Create `BottleService` class
  - [x] `issueBottle(user, subscription, bottle)` - Issue bottle to user
  - [x] `returnBottle(bottle, delivery, condition)` - Return bottle
  - [x] `markAsDamaged(bottle, reason, delivery)` - Mark as damaged
  - [x] `markAsLost(bottle)` - Mark as lost
  - [x] `getUserBottles(user)` - Get user's bottles
  - [x] `getSubscriptionBottles(subscription)` - Get subscription's bottles
  - [x] `getAvailableBottles()` - Get available bottles
  - [x] `createBottleLog(bottle, action, data)` - Create log entry
  - [x] `calculateDeposit(product)` - Calculate deposit amount
  - [x] `processRefund(bottle, condition)` - Process refund on return

### 9.4 Bottle Integration with Subscriptions
- [x] Update `Subscription` model
  - [x] Add `bottles_issued` count
  - [x] Add `bottles_returned` count
  - [x] Relationship to bottles
- [x] Bottle issue/return handled via driver API during delivery - *Auto-issue deferred to product enhancement*

### 9.5 Bottle Integration with Orders
- [x] Bottles linked via delivery (delivery has order_id and bottle actions)
- [x] Track bottle issue on order delivery (via driver API)
- [x] Track bottle return on subsequent delivery (via driver API)

### 9.6 Bottle Controllers (Customer)
- [x] Create `BottleController`
  - [x] `index()` - List user's bottles
  - [x] `show(bottle)` - Show bottle details
  - [x] `getBalance()` - Get bottle balance (issued - returned)
- [x] Create bottle balance API endpoint

### 9.7 Bottle Controllers (Admin)
- [x] Create `Admin/BottleController`
  - [x] `index()` - List all bottles (with filters)
  - [x] `show(bottle)` - Show bottle details
  - [x] `store(Request)` - Create new bottle
  - [x] `update(Request, bottle)` - Update bottle
  - [x] `issue(Request, bottle)` - Manually issue bottle
  - [x] `return(Request, bottle)` - Manually return bottle
  - [x] `markDamaged(Request, bottle)` - Mark as damaged
  - [x] `markLost(bottle)` - Mark as lost
  - [x] `getLogs(bottle)` - Get bottle logs
  - [x] `getReports()` - Get bottle reports
- [x] Create Form Requests:
  - [x] `StoreBottleRequest`
  - [x] `IssueBottleRequest`
  - [x] `ReturnBottleRequest`

### 9.8 Driver API - Bottle Endpoints
- [x] Create `Api/V1/Driver/BottleController`
  - [x] `returnBottle(Request, delivery)` - Return bottle on delivery
  - [x] `issueBottle(Request, delivery)` - Issue bottle on delivery
  - [x] `markDamaged(Request, delivery)` - Mark bottle as damaged
- [x] Create driver bottle API routes

### 9.9 Bottle Reports
- [x] Basic bottle stats available via `BottleService::getBottleStats()`
- [x] Admin reports endpoint exists (`getReports` in AdminBottleController)
- [ ] *Advanced reports with charts/export deferred to Phase 14 (Admin Panel)*

### 9.10 Barcode/QR Code Integration
- [x] Barcode field exists in bottles table
- [x] Admin scan barcode endpoint exists (`scanBarcode` in AdminBottleController)
- [x] Driver can lookup by barcode via bottle_number/barcode
- [ ] *Barcode generation deferred - can use external barcode generator*

### 9.11 Frontend Bottle UI (Customer)
- [x] Create bottle list page (`resources/js/pages/bottles/index.tsx`)
  - [x] List of user's bottles
  - [x] Status indicators
  - [x] Issue/return dates
  - [x] Bottle balance summary
- [x] Create bottle detail page (`resources/js/pages/bottles/show.tsx`)
  - [x] Bottle details
  - [x] Issue history
  - [x] Return history
  - [x] Logs
- [x] Create bottle history page (`resources/js/pages/bottles/history.tsx`)

### 9.12 Admin Bottle UI
- [x] Create bottle list page (admin)
  - [x] Filters (status, user, subscription)
  - [x] Search by bottle number/barcode
  - [x] Bulk actions
- [x] Create bottle detail page (admin)
  - [x] Bottle details
  - [x] Current holder info
  - [x] Issue/return buttons
  - [x] Logs timeline
  - [x] Status change history
- [ ] *Bottle reports dashboard deferred to Phase 14 (Admin Panel)*

### 9.13 Database Seeders
- [x] Create `BottleSeeder` (test bottles - 40 bottles created)
- [x] Bottle logs created automatically when bottles are issued/returned

### 9.14 Testing
- [ ] *Deferred - Testing will be done after all modules complete*

## Deliverables
- ✅ Bottle management system
- ✅ Bottle tracking (issue, return, damage, lost)
- ✅ Bottle logs system
- ✅ Integration with subscriptions
- ✅ Integration with deliveries
- ✅ Customer bottle balance view
- ✅ Admin bottle management UI
- ✅ Bottle reports

## Success Criteria
- [x] Bottles can be created and tracked
- [x] Bottles are issued with subscriptions (via admin/driver)
- [x] Bottles are returned on delivery (via driver API)
- [x] Bottle logs are maintained
- [x] Customer can view bottle balance
- [x] Admin can manage bottles
- [x] Basic stats available (advanced reports in Phase 14)

## ✅ Phase 9 Complete
All mandatory features implemented. Advanced reporting and barcode generation deferred to Phase 14.

## Database Tables Created
- `bottles`
- `bottle_logs`

## Notes
- Bottle numbers should be unique and sequential
- Barcode/QR code integration is recommended for driver app
- Bottle deposits should be handled in payment system
- Refunds on return should consider bottle condition
- Lost bottles should trigger investigation workflow
- Bottle logs should be immutable (audit trail)

## Next Phase
Once Phase 9 is complete, proceed to **Phase 10: Loyalty & Referral System**

