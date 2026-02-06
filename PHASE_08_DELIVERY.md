# Phase 8: Delivery & Proof Enforcement

## Objective
Implement delivery management system with route assignment, live GPS tracking, mandatory proof upload, and delivery status workflow.

## Prerequisites
- Phase 6 completed (Orders) ✅
- Phase 3 completed (Zones & Drivers) ✅
- Orders are being created ✅
- Drivers are assigned to zones ✅

## Business Verticals
Delivery and slot logic branch by order **vertical**: Daily Fresh (quick delivery) vs Society Fresh (scheduled slots). See [PHASE_NEW_UPDATE.md](PHASE_NEW_UPDATE.md).
- [x] Slot/assignment logic considers order.vertical (quick vs scheduled)
- [ ] Optional: driver_type or assignment rules by vertical (quick riders vs route-based)

## Tasks

### 8.1 Delivery Management
- [x] Create `deliveries` table migration
  - [x] `id` (primary key)
  - [x] `order_id` (foreign key, unique, indexed)
  - [x] `driver_id` (foreign key, nullable, indexed)
  - [x] `user_id` (foreign key, indexed)
  - [x] `user_address_id` (foreign key)
  - [x] `zone_id` (foreign key, indexed)
  - [x] `status` (enum: 'pending', 'assigned', 'out_for_delivery', 'delivered', 'failed', 'cancelled')
  - [x] `scheduled_date` (date) - Scheduled delivery date
  - [x] `scheduled_time` (time, nullable) - Preferred time slot
  - [x] `assigned_at` (timestamp, nullable)
  - [x] `dispatched_at` (timestamp, nullable)
  - [x] `delivered_at` (timestamp, nullable)
  - [x] `delivery_proof_image` (string, nullable) - Image URL
  - [x] `delivery_proof_verified` (boolean, default: false)
  - [x] `delivery_proof_verified_by` (foreign key, nullable)
  - [x] `delivery_proof_verified_at` (timestamp, nullable)
  - [x] `failure_reason` (text, nullable)
  - [x] `delivery_instructions` (text, nullable)
  - [x] `customer_signature` (string, nullable) - If needed
  - [x] `notes` (text, nullable) - Driver notes
  - [x] `timestamps`
- [x] Create `Delivery` model
  - [x] Relationships (order, driver, user, address, zone, tracking)
  - [x] Scopes (pending, assigned, outForDelivery, delivered, byStatus, byDate, byDriver)
  - [x] Helper methods:
    - [x] `canAssignDriver()` - Check if can assign
    - [x] `assignDriver(driver)` - Assign driver
    - [x] `markAsOutForDelivery()` - Mark as dispatched
    - [x] `markAsDelivered(proofImage)` - Mark as delivered with proof
    - [x] `markAsFailed(reason)` - Mark as failed

### 8.2 Delivery Tracking
- [x] Create `delivery_tracking` table migration
  - [x] `id` (primary key)
  - [x] `delivery_id` (foreign key, indexed)
  - [x] `driver_id` (foreign key, indexed)
  - [x] `latitude` (decimal)
  - [x] `longitude` (decimal)
  - [x] `accuracy` (decimal, nullable) - GPS accuracy in meters
  - [x] `speed` (decimal, nullable) - Speed in km/h
  - [x] `heading` (decimal, nullable) - Direction
  - [x] `status` (string) - Current delivery status
  - [x] `timestamp` (timestamp)
- [x] Create `DeliveryTracking` model
  - [x] Relationships (delivery, driver)
  - [x] Scopes (recent, byDelivery)

### 8.3 Firebase Integration (Live Tracking)
- [ ] Set up Firebase project (deferred - optional for real-time, currently using polling)
- [ ] Configure Firebase credentials in `.env`
- [ ] Install Firebase SDK (for backend)
- [ ] Create `FirebaseTrackingService` class
  - [ ] `updateDriverLocation(driverId, lat, lng)` - Update driver location
  - [ ] `getDriverLocation(driverId)` - Get current location
  - [ ] `trackDelivery(deliveryId, lat, lng)` - Track delivery location
  - [ ] `getDeliveryTracking(deliveryId)` - Get tracking data
- [ ] Set up Firebase Realtime Database or Firestore structure
- [ ] Configure Firebase security rules

**Note**: Live tracking is implemented via HTTP polling. Firebase integration can be added later for real-time WebSocket updates.

### 8.4 Route Assignment
- [x] Create `RouteAssignmentService` class
  - [x] `assignDeliveriesToDriver(driver, date)` - Assign deliveries for date
  - [x] `autoAssignDeliveries(date, zone)` - Auto-assign by zone
  - [x] `getDeliveriesForDriver(driver, date)` - Get driver's deliveries
  - [x] `optimizeRoute(deliveries)` - Basic route ordering by sequence
  - [x] `reassignDelivery(delivery, newDriver)` - Reassign delivery
- [ ] Create job: `AssignDeliveryRoutes` (can be added as scheduled command)
  - [ ] Run daily (night before delivery)
  - [ ] Assign deliveries to drivers by zone
  - [ ] Consider driver capacity

### 8.5 Delivery Proof Enforcement
- [x] Create `DeliveryProofService` class
  - [x] `validateProofImage(image)` - Validate image
  - [x] `uploadProof(delivery, image)` - Upload proof image
  - [x] `verifyProof(delivery, admin)` - Admin verification
  - [x] `requireProofForDelivery(delivery)` - Enforce proof requirement
  - [x] `overrideProofRequirement()` - Admin override with logging
- [x] Integrate with storage (local/public disk, can be switched to S3)
- [x] Image validation (size, format, dimensions)
- [x] **CRITICAL**: Delivery cannot be completed without proof image ✅

### 8.6 Delivery Controllers (Admin)
- [x] Create `Admin/DeliveryController`
  - [x] `index()` - List all deliveries (with filters)
  - [x] `show(delivery)` - Show delivery details
  - [x] `assignDriver(Request, delivery)` - Assign driver
  - [x] `updateStatus(Request, delivery)` - Update status
  - [x] `verifyProof(Request, delivery)` - Verify proof
  - [x] `overrideProof(Request, delivery)` - Manual override (logged)
  - [x] `forDate(date)` - Get deliveries for date (calendar view)
  - [x] `driverDeliveries(driver, date)` - Get driver's deliveries
  - [x] `autoAssign()` - Auto-assign deliveries
  - [x] `bulkAssign()` - Bulk assign to driver
  - [x] `stats()` - Get delivery statistics
- [x] Create Form Requests:
  - [x] `AssignDriverRequest`
  - [x] `UpdateDeliveryStatusRequest`
  - [x] `VerifyProofRequest`
  - [x] `OverrideProofRequest`
  - [x] `CompleteDeliveryRequest`

### 8.7 Delivery Controllers (Customer)
- [x] Create `DeliveryController` (customer-facing)
  - [x] `index()` - List user's deliveries
  - [x] `show(delivery)` - Show delivery details
  - [x] `track(delivery)` - Track delivery (live location)
  - [x] `getStatus(delivery)` - Get current status
  - [x] `liveTracking(delivery)` - Get live tracking data
- [x] Create delivery tracking API endpoint

### 8.8 Driver API - Delivery Endpoints
- [x] Create `Api/V1/Driver/DeliveryController`
  - [x] `index()` - Get assigned deliveries
  - [x] `show(delivery)` - Get delivery details
  - [x] `startDelivery(delivery)` - Mark as out for delivery
  - [x] `updateLocation(Request, delivery)` - Update GPS location
  - [x] `completeDelivery(Request, delivery)` - Complete with proof
  - [x] `failDelivery(Request, delivery)` - Mark as failed
  - [x] `getRoute(date)` - Get delivery route for date
  - [x] `batchUpdateLocation()` - Batch location update
- [x] Create Form Requests for driver API
- [x] Driver API routes configured (`/api/v1/driver/deliveries/*`)

### 8.9 Delivery Status Workflow
- [x] Create `DeliveryStatusService` class
  - [x] `updateStatus(delivery, status, data)` - Update status
  - [x] `canTransitionTo(delivery, newStatus)` - Validate transition
  - [x] `getAvailableStatuses(delivery)` - Get allowed statuses
  - [x] `handleStatusChange(delivery, oldStatus, newStatus)` - Handle side effects
- [x] Status flow: `pending → assigned → out_for_delivery → delivered`
- [x] Handle failed deliveries
- [x] Update order status when delivery is completed

### 8.10 Image Upload Service
- [x] Using `DeliveryProofService` for proof images
  - [x] `uploadProof(delivery, image)` - Upload proof image
  - [x] `validateProofImage(image)` - Validate image
  - [x] `deleteImage(path)` - Delete image
- [x] Configure storage (public disk, can switch to S3)

### 8.11 Delivery Notifications
- [ ] Create delivery notification templates (deferred to Phase 12)
  - [ ] Delivery assigned
  - [ ] Out for delivery
  - [ ] Delivered
  - [ ] Delivery failed
- [ ] Integrate with notification system (Phase 12)
- [ ] Send push notifications for status updates

### 8.12 Frontend Delivery Tracking (Customer)
- [x] Create delivery tracking page (`resources/js/pages/deliveries/track.tsx`)
  - [x] Delivery status timeline
  - [x] Location display (polling-based)
  - [x] Driver contact info
  - [x] Delivery proof image (if delivered)
- [x] Create delivery list page (`resources/js/pages/deliveries/index.tsx`)
  - [x] List of user's deliveries
  - [x] Status badges
  - [x] Track button
- [x] Create delivery detail page (`resources/js/pages/deliveries/show.tsx`)

### 8.13 Admin Delivery UI
- [x] Create delivery list page (admin)
  - [x] Filters (status, date, driver, zone)
  - [x] Search functionality
  - [x] Quick filters (unassigned, needs verification, today)
- [x] Create delivery detail page (admin)
  - [x] Delivery details
  - [x] Driver assignment interface
  - [x] Status update interface
  - [x] Proof image viewer
  - [x] Proof verification interface
  - [x] Manual override option (with reason)
  - [x] Timeline view
  - [x] Customer & address info
- [ ] Create delivery assignment dashboard (calendar view - partial)
  - [ ] Calendar view
  - [ ] Drag-and-drop assignment
  - [ ] Driver capacity view

### 8.14 Driver App Integration Points
- [x] API endpoints for Flutter app
- [x] Authentication via Sanctum
- [ ] API documentation
- [ ] Handle offline-first scenarios (client-side)

### 8.15 Database Seeders
- [ ] Create `DeliverySeeder` (test deliveries)
- [ ] Create test delivery tracking data

### 8.16 Testing
- Deferred per user request to be done after all modules are complete.

## Routes Created

### Admin Routes (`/admin/deliveries`)
- `GET /admin/deliveries` - List deliveries
- `GET /admin/deliveries/calendar` - Calendar view
- `GET /admin/deliveries/stats` - Statistics
- `POST /admin/deliveries/auto-assign` - Auto-assign
- `POST /admin/deliveries/bulk-assign` - Bulk assign
- `POST /admin/deliveries/update-sequence` - Update sequence
- `GET /admin/deliveries/{delivery}` - Show delivery
- `POST /admin/deliveries/{delivery}/assign-driver` - Assign driver
- `POST /admin/deliveries/{delivery}/status` - Update status
- `POST /admin/deliveries/{delivery}/verify-proof` - Verify proof
- `POST /admin/deliveries/{delivery}/override-proof` - Override proof
- `GET /admin/drivers/{driver}/deliveries` - Driver's deliveries

### Customer Routes (`/deliveries`)
- `GET /deliveries` - List user's deliveries
- `GET /deliveries/{delivery}` - Show delivery
- `GET /deliveries/{delivery}/track` - Track delivery
- `GET /deliveries/{delivery}/status` - Get status (API)
- `GET /deliveries/{delivery}/live-tracking` - Live tracking (API)

### Driver API Routes (`/api/v1/driver`)
- `GET /api/v1/driver/deliveries` - List assigned deliveries
- `GET /api/v1/driver/deliveries/route` - Get route
- `GET /api/v1/driver/deliveries/{delivery}` - Show delivery
- `POST /api/v1/driver/deliveries/{delivery}/start` - Start delivery
- `POST /api/v1/driver/deliveries/{delivery}/location` - Update location
- `POST /api/v1/driver/deliveries/{delivery}/complete` - Complete delivery
- `POST /api/v1/driver/deliveries/{delivery}/fail` - Mark failed
- `POST /api/v1/driver/location/batch` - Batch location update

## Deliverables
- ✅ Delivery management system
- ✅ Route assignment system
- ⏳ Live GPS tracking (polling implemented, Firebase optional)
- ✅ Mandatory proof upload system
- ✅ Delivery status workflow
- ✅ Driver API endpoints
- ✅ Customer tracking UI
- ✅ Admin delivery management UI

## Success Criteria
- [x] Deliveries are created from orders
- [x] Drivers can be assigned to deliveries
- [x] GPS tracking works (polling)
- [x] **Delivery cannot be completed without proof image**
- [x] Proof images are stored securely
- [x] Admin can verify proof images
- [x] Status transitions work correctly
- [x] Driver API is functional

## Database Tables Created
- `deliveries` ✅
- `delivery_tracking` ✅

## Notes
- **CRITICAL**: Proof image is mandatory - enforced at model and service level
- GPS tracking updates via polling (every 30 seconds on frontend)
- Route optimization is basic (sequence-based)
- Proof images stored in `storage/app/public/delivery-proofs/`
- Manual override requires detailed reason and is logged
- Firebase integration is optional for real-time updates

## Completion Status
**Phase 8 is COMPLETE** ✅

Remaining optional items:
- Firebase real-time tracking integration
- Drag-and-drop calendar assignment UI
- Database seeders for test data
- Scheduled job for auto-assignment

## Next Phase
Once Phase 8 is complete, proceed to **Phase 9: Bottle Management**
