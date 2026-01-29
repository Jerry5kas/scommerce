# Phase 8: Delivery & Proof Enforcement

## Objective
Implement delivery management system with route assignment, live GPS tracking, mandatory proof upload, and delivery status workflow.

## Prerequisites
- Phase 6 completed (Orders)
- Phase 3 completed (Zones & Drivers)
- Orders are being created
- Drivers are assigned to zones

## Tasks

### 8.1 Delivery Management
- [ ] Create `deliveries` table migration
  - [ ] `id` (primary key)
  - [ ] `order_id` (foreign key, unique, indexed)
  - [ ] `driver_id` (foreign key, nullable, indexed)
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `user_address_id` (foreign key)
  - [ ] `zone_id` (foreign key, indexed)
  - [ ] `status` (enum: 'pending', 'assigned', 'out_for_delivery', 'delivered', 'failed', 'cancelled')
  - [ ] `scheduled_date` (date) - Scheduled delivery date
  - [ ] `scheduled_time` (time, nullable) - Preferred time slot
  - [ ] `assigned_at` (timestamp, nullable)
  - [ ] `dispatched_at` (timestamp, nullable)
  - [ ] `delivered_at` (timestamp, nullable)
  - [ ] `delivery_proof_image` (string, nullable) - Image URL
  - [ ] `delivery_proof_verified` (boolean, default: false)
  - [ ] `delivery_proof_verified_by` (foreign key, nullable)
  - [ ] `delivery_proof_verified_at` (timestamp, nullable)
  - [ ] `failure_reason` (text, nullable)
  - [ ] `delivery_instructions` (text, nullable)
  - [ ] `customer_signature` (string, nullable) - If needed
  - [ ] `notes` (text, nullable) - Driver notes
  - [ ] `timestamps`
- [ ] Create `Delivery` model
  - [ ] Relationships (order, driver, user, address, zone, tracking)
  - [ ] Scopes (pending, assigned, outForDelivery, delivered, byStatus, byDate, byDriver)
  - [ ] Helper methods:
    - [ ] `canAssignDriver()` - Check if can assign
    - [ ] `assignDriver(driver)` - Assign driver
    - [ ] `markAsOutForDelivery()` - Mark as dispatched
    - [ ] `markAsDelivered(proofImage)` - Mark as delivered with proof
    - [ ] `markAsFailed(reason)` - Mark as failed

### 8.2 Delivery Tracking
- [ ] Create `delivery_tracking` table migration
  - [ ] `id` (primary key)
  - [ ] `delivery_id` (foreign key, indexed)
  - [ ] `driver_id` (foreign key, indexed)
  - [ ] `latitude` (decimal)
  - [ ] `longitude` (decimal)
  - [ ] `accuracy` (decimal, nullable) - GPS accuracy in meters
  - [ ] `speed` (decimal, nullable) - Speed in km/h
  - [ ] `heading` (decimal, nullable) - Direction
  - [ ] `status` (string) - Current delivery status
  - [ ] `timestamp` (timestamp)
- [ ] Create `DeliveryTracking` model
  - [ ] Relationships (delivery, driver)
  - [ ] Scopes (recent, byDelivery)

### 8.3 Firebase Integration (Live Tracking)
- [ ] Set up Firebase project
- [ ] Configure Firebase credentials in `.env`
- [ ] Install Firebase SDK (for backend)
- [ ] Create `FirebaseTrackingService` class
  - [ ] `updateDriverLocation(driverId, lat, lng)` - Update driver location
  - [ ] `getDriverLocation(driverId)` - Get current location
  - [ ] `trackDelivery(deliveryId, lat, lng)` - Track delivery location
  - [ ] `getDeliveryTracking(deliveryId)` - Get tracking data
- [ ] Set up Firebase Realtime Database or Firestore structure
- [ ] Configure Firebase security rules

### 8.4 Route Assignment
- [ ] Create `RouteAssignmentService` class
  - [ ] `assignDeliveriesToDriver(driver, date)` - Assign deliveries for date
  - [ ] `autoAssignDeliveries(date, zone)` - Auto-assign by zone
  - [ ] `getDeliveriesForDriver(driver, date)` - Get driver's deliveries
  - [ ] `optimizeRoute(deliveries)` - Optimize delivery route (optional)
  - [ ] `reassignDelivery(delivery, newDriver)` - Reassign delivery
- [ ] Create job: `AssignDeliveryRoutes`
  - [ ] Run daily (night before delivery)
  - [ ] Assign deliveries to drivers by zone
  - [ ] Consider driver capacity

### 8.5 Delivery Proof Enforcement
- [ ] Create `DeliveryProofService` class
  - [ ] `validateProofImage(image)` - Validate image
  - [ ] `uploadProof(delivery, image)` - Upload proof image
  - [ ] `verifyProof(delivery, admin)` - Admin verification
  - [ ] `requireProofForDelivery(delivery)` - Enforce proof requirement
- [ ] Integrate with object storage (S3, etc.)
- [ ] Image validation (size, format, dimensions)
- [ ] **CRITICAL**: Delivery cannot be completed without proof image

### 8.6 Delivery Controllers (Admin)
- [ ] Create `Admin/DeliveryController`
  - [ ] `index()` - List all deliveries (with filters)
  - [ ] `show(delivery)` - Show delivery details
  - [ ] `assignDriver(Request, delivery)` - Assign driver
  - [ ] `updateStatus(Request, delivery)` - Update status
  - [ ] `verifyProof(Request, delivery)` - Verify proof
  - [ ] `overrideProof(Request, delivery)` - Manual override (logged)
  - [ ] `getUpcomingDeliveries(date)` - Get deliveries for date
  - [ ] `getDriverDeliveries(driver, date)` - Get driver's deliveries
- [ ] Create Form Requests:
  - [ ] `AssignDriverRequest`
  - [ ] `UpdateDeliveryStatusRequest`
  - [ ] `VerifyProofRequest`

### 8.7 Delivery Controllers (Customer)
- [ ] Create `DeliveryController` (customer-facing)
  - [ ] `index()` - List user's deliveries
  - [ ] `show(delivery)` - Show delivery details
  - [ ] `track(delivery)` - Track delivery (live location)
  - [ ] `getStatus(delivery)` - Get current status
- [ ] Create delivery tracking API endpoint

### 8.8 Driver API - Delivery Endpoints
- [ ] Create `Api/V1/Driver/DeliveryController`
  - [ ] `index()` - Get assigned deliveries
  - [ ] `show(delivery)` - Get delivery details
  - [ ] `startDelivery(delivery)` - Mark as out for delivery
  - [ ] `updateLocation(Request, delivery)` - Update GPS location
  - [ ] `completeDelivery(Request, delivery)` - Complete with proof
  - [ ] `failDelivery(Request, delivery)` - Mark as failed
  - [ ] `getRoute(date)` - Get delivery route for date
- [ ] Create Form Requests for driver API
- [ ] Implement token-based authentication for driver API

### 8.9 Delivery Status Workflow
- [ ] Create `DeliveryStatusService` class
  - [ ] `updateStatus(delivery, status, data)` - Update status
  - [ ] `canTransitionTo(delivery, newStatus)` - Validate transition
  - [ ] `getAvailableStatuses(delivery)` - Get allowed statuses
  - [ ] `handleStatusChange(delivery, oldStatus, newStatus)` - Handle side effects
- [ ] Status flow: `pending → assigned → out_for_delivery → delivered`
- [ ] Handle failed deliveries
- [ ] Update order status when delivery is completed

### 8.10 Image Upload Service
- [ ] Create `ImageUploadService` class
  - [ ] `uploadDeliveryProof(image, delivery)` - Upload proof image
  - [ ] `validateImage(image)` - Validate image
  - [ ] `resizeImage(image, maxWidth, maxHeight)` - Resize if needed
  - [ ] `deleteImage(path)` - Delete image
- [ ] Configure object storage for proof images
- [ ] Set up CDN for image delivery

### 8.11 Delivery Notifications
- [ ] Create delivery notification templates
  - [ ] Delivery assigned
  - [ ] Out for delivery
  - [ ] Delivered
  - [ ] Delivery failed
- [ ] Integrate with notification system (Phase 12)
- [ ] Send push notifications for status updates

### 8.12 Frontend Delivery Tracking (Customer)
- [ ] Create delivery tracking page (`resources/js/Pages/Deliveries/Track.tsx`)
  - [ ] Delivery status timeline
  - [ ] Live map with driver location (Firebase integration)
  - [ ] Estimated delivery time
  - [ ] Delivery proof image (if delivered)
- [ ] Create delivery list page (`resources/js/Pages/Deliveries/Index.tsx`)
  - [ ] List of user's deliveries
  - [ ] Status badges
  - [ ] Track button

### 8.13 Admin Delivery UI
- [ ] Create delivery list page (admin)
  - [ ] Filters (status, date, driver, zone)
  - [ ] Search functionality
  - [ ] Bulk actions
- [ ] Create delivery detail page (admin)
  - [ ] Delivery details
  - [ ] Driver assignment interface
  - [ ] Status update interface
  - [ ] Proof image viewer
  - [ ] Proof verification interface
  - [ ] Manual override option (with reason)
  - [ ] Live tracking map
  - [ ] Activity log
- [ ] Create delivery assignment dashboard
  - [ ] Calendar view
  - [ ] Drag-and-drop assignment
  - [ ] Driver capacity view

### 8.14 Driver App Integration Points
- [ ] Document API endpoints for Flutter app
- [ ] Create API documentation
- [ ] Set up authentication for driver API
- [ ] Test API endpoints
- [ ] Handle offline-first scenarios

### 8.15 Database Seeders
- [ ] Create `DeliverySeeder` (test deliveries)
- [ ] Create test delivery tracking data

### 8.16 Testing
- [ ] Test delivery creation
- [ ] Test driver assignment
- [ ] Test route assignment
- [ ] Test GPS tracking
- [ ] Test proof upload
- [ ] Test proof enforcement (cannot complete without proof)
- [ ] Test status transitions
- [ ] Test Firebase integration
- [ ] Feature tests for delivery flow

## Deliverables
- ✅ Delivery management system
- ✅ Route assignment system
- ✅ Live GPS tracking (Firebase)
- ✅ Mandatory proof upload system
- ✅ Delivery status workflow
- ✅ Driver API endpoints
- ✅ Customer tracking UI
- ✅ Admin delivery management UI

## Success Criteria
- [ ] Deliveries are created from orders
- [ ] Drivers can be assigned to deliveries
- [ ] Live GPS tracking works
- [ ] **Delivery cannot be completed without proof image**
- [ ] Proof images are stored securely
- [ ] Admin can verify proof images
- [ ] Status transitions work correctly
- [ ] Driver API is functional

## Database Tables Created
- `deliveries`
- `delivery_tracking`

## Notes
- **CRITICAL**: Proof image is mandatory - enforce at API level
- GPS tracking should update frequently (every 30-60 seconds)
- Route optimization is optional but recommended
- Proof images should be verified by admin
- Manual override should be logged for audit
- Consider delivery time windows
- Handle failed deliveries gracefully

## Next Phase
Once Phase 8 is complete, proceed to **Phase 9: Bottle Management**

