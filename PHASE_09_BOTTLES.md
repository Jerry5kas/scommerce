# Phase 9: Bottle Management

## Objective
Implement bottle tracking system to prevent asset loss in dairy logistics with issue, return, and damage tracking.

## Prerequisites
- Phase 5 completed (Subscriptions)
- Phase 8 completed (Delivery)
- Products marked as bottle-required exist

## Tasks

### 9.1 Bottle Management
- [ ] Create `bottles` table migration
  - [ ] `id` (primary key)
  - [ ] `bottle_number` (string, unique, indexed) - Unique bottle identifier
  - [ ] `barcode` (string, unique, nullable, indexed) - Barcode/QR code
  - [ ] `type` (enum: 'standard', 'premium', 'custom') - Bottle type
  - [ ] `capacity` (decimal, nullable) - Capacity in litres
  - [ ] `status` (enum: 'available', 'issued', 'returned', 'damaged', 'lost')
  - [ ] `current_user_id` (foreign key, nullable) - Current holder
  - [ ] `current_subscription_id` (foreign key, nullable) - Linked subscription
  - [ ] `purchase_cost` (decimal, nullable) - Cost of bottle
  - [ ] `deposit_amount` (decimal, nullable) - Deposit charged
  - [ ] `issued_at` (timestamp, nullable)
  - [ ] `returned_at` (timestamp, nullable)
  - [ ] `damaged_at` (timestamp, nullable)
  - [ ] `notes` (text, nullable)
  - [ ] `timestamps`
- [ ] Create `Bottle` model
  - [ ] Relationships (currentUser, currentSubscription, logs)
  - [ ] Scopes (available, issued, returned, damaged, byStatus)
  - [ ] Helper methods:
    - [ ] `issueTo(user, subscription)` - Issue bottle
    - [ ] `returnBottle(condition)` - Return bottle
    - [ ] `markAsDamaged(reason)` - Mark as damaged
    - [ ] `markAsLost()` - Mark as lost

### 9.2 Bottle Logs
- [ ] Create `bottle_logs` table migration
  - [ ] `id` (primary key)
  - [ ] `bottle_id` (foreign key, indexed)
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `subscription_id` (foreign key, nullable)
  - [ ] `delivery_id` (foreign key, nullable)
  - [ ] `action` (enum: 'issued', 'returned', 'damaged', 'lost', 'found', 'transferred')
  - [ ] `action_by` (enum: 'system', 'driver', 'admin', 'customer')
  - [ ] `action_by_id` (foreign key, nullable) - User/Driver/Admin ID
  - [ ] `condition` (string, nullable) - Condition at return
  - [ ] `notes` (text, nullable)
  - [ ] `deposit_amount` (decimal, nullable) - Deposit at issue
  - [ ] `refund_amount` (decimal, nullable) - Refund at return
  - [ ] `timestamps`
- [ ] Create `BottleLog` model
  - [ ] Relationships (bottle, user, subscription, delivery)
  - [ ] Scopes (byAction, byBottle, recent)

### 9.3 Bottle Service
- [ ] Create `BottleService` class
  - [ ] `issueBottle(user, subscription, bottle)` - Issue bottle to user
  - [ ] `returnBottle(bottle, delivery, condition)` - Return bottle
  - [ ] `markAsDamaged(bottle, reason, delivery)` - Mark as damaged
  - [ ] `markAsLost(bottle)` - Mark as lost
  - [ ] `getUserBottles(user)` - Get user's bottles
  - [ ] `getSubscriptionBottles(subscription)` - Get subscription's bottles
  - [ ] `getAvailableBottles()` - Get available bottles
  - [ ] `createBottleLog(bottle, action, data)` - Create log entry
  - [ ] `calculateDeposit(product)` - Calculate deposit amount
  - [ ] `processRefund(bottle, condition)` - Process refund on return

### 9.4 Bottle Integration with Subscriptions
- [ ] Update `Subscription` model
  - [ ] Add `bottles_issued` count
  - [ ] Add `bottles_returned` count
  - [ ] Relationship to bottles
- [ ] Update subscription creation to issue bottles if required
- [ ] Update subscription cancellation to handle bottle returns

### 9.5 Bottle Integration with Orders
- [ ] Link bottles to order items (if one-time purchase with bottle)
- [ ] Track bottle issue on order delivery
- [ ] Track bottle return on subsequent delivery

### 9.6 Bottle Controllers (Customer)
- [ ] Create `BottleController`
  - [ ] `index()` - List user's bottles
  - [ ] `show(bottle)` - Show bottle details
  - [ ] `getBalance()` - Get bottle balance (issued - returned)
- [ ] Create bottle balance API endpoint

### 9.7 Bottle Controllers (Admin)
- [ ] Create `Admin/BottleController`
  - [ ] `index()` - List all bottles (with filters)
  - [ ] `show(bottle)` - Show bottle details
  - [ ] `store(Request)` - Create new bottle
  - [ ] `update(Request, bottle)` - Update bottle
  - [ ] `issue(Request, bottle)` - Manually issue bottle
  - [ ] `return(Request, bottle)` - Manually return bottle
  - [ ] `markDamaged(Request, bottle)` - Mark as damaged
  - [ ] `markLost(bottle)` - Mark as lost
  - [ ] `getLogs(bottle)` - Get bottle logs
  - [ ] `getReports()` - Get bottle reports
- [ ] Create Form Requests:
  - [ ] `StoreBottleRequest`
  - [ ] `IssueBottleRequest`
  - [ ] `ReturnBottleRequest`

### 9.8 Driver API - Bottle Endpoints
- [ ] Update `Api/V1/Driver/DeliveryController`
  - [ ] `returnBottle(Request, delivery)` - Return bottle on delivery
  - [ ] `issueBottle(Request, delivery)` - Issue bottle on delivery
  - [ ] `markBottleDamaged(Request, delivery)` - Mark bottle as damaged
- [ ] Create Form Requests for driver bottle actions

### 9.9 Bottle Reports
- [ ] Create `BottleReportService` class
  - [ ] `getBottleStatusReport()` - Overall status report
  - [ ] `getBottleIssuedReport(dateRange)` - Issued bottles report
  - [ ] `getBottleReturnedReport(dateRange)` - Returned bottles report
  - [ ] `getBottleDamagedReport(dateRange)` - Damaged bottles report
  - [ ] `getBottleLostReport(dateRange)` - Lost bottles report
  - [ ] `getUserBottleReport(user)` - User's bottle history
  - [ ] `getBottleUtilizationReport()` - Utilization metrics
- [ ] Create admin report endpoints

### 9.10 Barcode/QR Code Integration
- [ ] Generate barcode/QR code for bottles
- [ ] Create barcode scanning endpoint (for driver app)
- [ ] Create `BarcodeService` class
  - [ ] `generateBarcode(bottle)` - Generate barcode
  - [ ] `scanBarcode(code)` - Scan and find bottle
  - [ ] `validateBarcode(code)` - Validate barcode

### 9.11 Frontend Bottle UI (Customer)
- [ ] Create bottle list page (`resources/js/Pages/Bottles/Index.tsx`)
  - [ ] List of user's bottles
  - [ ] Status indicators
  - [ ] Issue/return dates
  - [ ] Bottle balance summary
- [ ] Create bottle detail page (`resources/js/Pages/Bottles/Show.tsx`)
  - [ ] Bottle details
  - [ ] Issue history
  - [ ] Return history
  - [ ] Logs

### 9.12 Admin Bottle UI
- [ ] Create bottle list page (admin)
  - [ ] Filters (status, user, subscription)
  - [ ] Search by bottle number/barcode
  - [ ] Bulk actions
- [ ] Create bottle detail page (admin)
  - [ ] Bottle details
  - [ ] Current holder info
  - [ ] Issue/return buttons
  - [ ] Logs timeline
  - [ ] Status change history
- [ ] Create bottle reports page (admin)
  - [ ] Status overview
  - [ ] Issued/returned charts
  - [ ] Damaged/lost reports
  - [ ] Export functionality

### 9.13 Database Seeders
- [ ] Create `BottleSeeder` (test bottles)
- [ ] Create test bottle logs
- [ ] Issue bottles to test subscriptions

### 9.14 Testing
- [ ] Test bottle creation
- [ ] Test bottle issue
- [ ] Test bottle return
- [ ] Test bottle damage marking
- [ ] Test bottle logs
- [ ] Test bottle balance calculation
- [ ] Test integration with subscriptions
- [ ] Test integration with deliveries
- [ ] Feature tests for bottle flow

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
- [ ] Bottles can be created and tracked
- [ ] Bottles are issued with subscriptions
- [ ] Bottles are returned on delivery
- [ ] Bottle logs are maintained
- [ ] Customer can view bottle balance
- [ ] Admin can manage bottles
- [ ] Reports are accurate

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

