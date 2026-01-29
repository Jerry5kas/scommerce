# Phase 3: Location & Zone Management

## Objective
Implement zone-based service availability system with driver assignment and location validation.

## Prerequisites
- Phase 2 completed (User authentication)
- User addresses system in place

## Tasks

### 3.1 Zone Management
- [ ] Create `zones` table migration
  - [ ] `id` (primary key)
  - [ ] `name` (string, unique)
  - [ ] `code` (string, unique, indexed)
  - [ ] `description` (text, nullable)
  - [ ] `boundary_coordinates` (json, nullable) - Polygon coordinates
  - [ ] `pincodes` (json, nullable) - Array of serviceable pincodes
  - [ ] `city` (string)
  - [ ] `state` (string)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `delivery_charge` (decimal, nullable)
  - [ ] `min_order_amount` (decimal, nullable)
  - [ ] `service_days` (json) - Days of week serviceable
  - [ ] `service_time_start` (time, nullable)
  - [ ] `service_time_end` (time, nullable)
  - [ ] `created_by` (foreign key to users, nullable)
  - [ ] `timestamps`
- [ ] Create `Zone` model
  - [ ] Fillable attributes
  - [ ] Casts (json fields, dates)
  - [ ] Relationships (drivers, addresses, orders)
  - [ ] Scopes (active)
  - [ ] Helper methods:
    - [ ] `isServiceable(pincode)` - Check if pincode is serviceable
    - [ ] `isWithinBoundary(lat, lng)` - Check if coordinates within boundary
    - [ ] `isServiceableOnDay(day)` - Check if serviceable on day
    - [ ] `isServiceableAtTime(time)` - Check if serviceable at time

### 3.2 Driver Management
- [ ] Create `drivers` table migration
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key to users, unique)
  - [ ] `employee_id` (string, unique, indexed)
  - [ ] `zone_id` (foreign key, nullable - can be reassigned)
  - [ ] `vehicle_number` (string, nullable)
  - [ ] `vehicle_type` (string, nullable)
  - [ ] `license_number` (string, nullable)
  - [ ] `phone` (string, indexed)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `current_latitude` (decimal, nullable)
  - [ ] `current_longitude` (decimal, nullable)
  - [ ] `last_location_update` (timestamp, nullable)
  - [ ] `is_online` (boolean, default: false)
  - [ ] `timestamps`
- [ ] Create `Driver` model
  - [ ] Relationships (user, zone, deliveries)
  - [ ] Scopes (active, online, byZone)
  - [ ] Helper methods:
    - [ ] `updateLocation(lat, lng)` - Update GPS location
    - [ ] `goOnline()` / `goOffline()` - Status management

### 3.3 Zone-Driver Assignment
- [ ] Create `zone_drivers` pivot table migration (if many-to-many)
  - [ ] `zone_id` (foreign key)
  - [ ] `driver_id` (foreign key)
  - [ ] `assigned_at` (timestamp)
  - [ ] `assigned_by` (foreign key to users)
  - [ ] `is_primary` (boolean, default: false)
  - [ ] `timestamps`
- [ ] Or use direct `zone_id` in drivers table (one-to-many)

### 3.4 Location Validation Service
- [ ] Create `LocationService` class
  - [ ] `validateAddress(address)` - Validate address against zones
  - [ ] `findZoneByPincode(pincode)` - Find zone by pincode
  - [ ] `findZoneByCoordinates(lat, lng)` - Find zone by coordinates
  - [ ] `isAddressServiceable(address)` - Check if address is serviceable
  - [ ] `getServiceableZones()` - Get all active zones
- [ ] Integrate with Google Maps Geocoding API (optional)
- [ ] Cache zone lookups for performance

### 3.5 Zone Controllers (Admin)
- [ ] Create `Admin/ZoneController`
  - [ ] `index()` - List all zones
  - [ ] `show(zone)` - Show zone details
  - [ ] `store(Request)` - Create zone
  - [ ] `update(Request, zone)` - Update zone
  - [ ] `destroy(zone)` - Delete zone (soft delete)
  - [ ] `toggleStatus(zone)` - Enable/disable zone
- [ ] Create Form Requests:
  - [ ] `StoreZoneRequest`
  - [ ] `UpdateZoneRequest`

### 3.6 Driver Controllers (Admin)
- [ ] Create `Admin/DriverController`
  - [ ] `index()` - List all drivers
  - [ ] `show(driver)` - Show driver details
  - [ ] `store(Request)` - Create driver
  - [ ] `update(Request, driver)` - Update driver
  - [ ] `destroy(driver)` - Delete driver
  - [ ] `assignZone(Request, driver)` - Assign/reassign zone
  - [ ] `toggleStatus(driver)` - Activate/deactivate
- [ ] Create Form Requests:
  - [ ] `StoreDriverRequest`
  - [ ] `UpdateDriverRequest`
  - [ ] `AssignZoneRequest`

### 3.7 Zone API (Customer)
- [ ] Create `ZoneController` (customer-facing)
  - [ ] `index()` - List active zones
  - [ ] `checkServiceability(Request)` - Check if address is serviceable
  - [ ] `getZoneByPincode(pincode)` - Get zone by pincode
- [ ] Create Form Request: `CheckServiceabilityRequest`

### 3.8 Address-Zone Linking
- [ ] Update `UserAddress` model
  - [ ] Add `zone_id` relationship
  - [ ] Add `autoAssignZone()` method
- [ ] Update address creation/update to auto-assign zone
- [ ] Create job to retroactively assign zones to existing addresses

### 3.9 Location Selection Middleware
- [ ] Enhance `EnsureUserHasLocation` middleware
  - [ ] Check if user has default address
  - [ ] Check if address is in serviceable zone
  - [ ] Redirect to location selection if needed
- [ ] Create location selection page

### 3.10 Frontend Zone Selection
- [ ] Create zone selection page (`resources/js/Pages/Location/Select.tsx`)
  - [ ] List of serviceable zones
  - [ ] Search by pincode
  - [ ] Map view (optional)
  - [ ] Zone selection
- [ ] Create address form with zone validation
  - [ ] Real-time pincode validation
  - [ ] Zone assignment feedback
  - [ ] Serviceability indicator

### 3.11 Admin Zone Management UI
- [ ] Create zone list page (admin)
- [ ] Create zone create/edit form
  - [ ] Zone details
  - [ ] Pincode management
  - [ ] Boundary coordinates (map picker)
  - [ ] Service hours configuration
- [ ] Create zone status toggle

### 3.12 Admin Driver Management UI
- [ ] Create driver list page (admin)
- [ ] Create driver create/edit form
- [ ] Create zone assignment interface
- [ ] Create driver status management

### 3.13 Zone Override System (Admin)
- [ ] Create `zone_overrides` table migration
  - [ ] `id` (primary key)
  - [ ] `zone_id` (foreign key)
  - [ ] `user_id` (foreign key, nullable) - Specific user override
  - [ ] `address_id` (foreign key, nullable) - Specific address override
  - [ ] `reason` (text)
  - [ ] `overridden_by` (foreign key to users)
  - [ ] `expires_at` (timestamp, nullable)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `timestamps`
- [ ] Create `ZoneOverride` model
- [ ] Update `LocationService` to check overrides
- [ ] Create admin interface for overrides

### 3.14 Database Seeders
- [ ] Create `ZoneSeeder` (test zones)
- [ ] Create `DriverSeeder` (test drivers)
- [ ] Assign drivers to zones

### 3.15 Testing
- [ ] Test zone CRUD operations
- [ ] Test driver CRUD operations
- [ ] Test zone-driver assignment
- [ ] Test location validation
- [ ] Test pincode-based zone lookup
- [ ] Test coordinate-based zone lookup
- [ ] Test serviceability checks
- [ ] Test zone override system
- [ ] Feature tests for zone management

## Deliverables
- ✅ Zone management system
- ✅ Driver management system
- ✅ Zone-driver assignment
- ✅ Location validation service
- ✅ Address-zone auto-linking
- ✅ Admin zone/driver management UI
- ✅ Customer zone selection UI
- ✅ Zone override system

## Success Criteria
- [ ] Zones can be created and managed
- [ ] Drivers can be assigned to zones
- [ ] Addresses are automatically assigned to zones
- [ ] Serviceability is checked before catalog access
- [ ] Zone overrides work for emergency cases
- [ ] Location selection is mandatory before browsing

## Database Tables Created
- `zones`
- `drivers`
- `zone_drivers` (if many-to-many)
- `zone_overrides`

## Notes
- Zone boundaries can be defined by pincodes (simpler) or coordinates (more precise)
- Consider caching zone lookups for performance
- Zone assignment should be automatic on address creation
- Drivers can be reassigned to different zones
- Zone overrides should be logged for audit

## Next Phase
Once Phase 3 is complete, proceed to **Phase 4: Catalog & Product Management**

