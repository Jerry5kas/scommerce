# Phase 3: Location & Zone Management

## Objective
Implement zone-based service availability system with driver assignment and location validation.

## Prerequisites
- Phase 2 completed (User authentication)
- User addresses system in place

## Tasks

### 3.1 Zone Management
- [x] Create `zones` table migration
  - [x] `id` (primary key)
  - [x] `name` (string, unique)
  - [x] `code` (string, unique, indexed)
  - [x] `description` (text, nullable)
  - [x] `boundary_coordinates` (json, nullable) - Polygon coordinates
  - [x] `pincodes` (json, nullable) - Array of serviceable pincodes
  - [x] `city` (string)
  - [x] `state` (string)
  - [x] `is_active` (boolean, default: true)
  - [x] `delivery_charge` (decimal, nullable)
  - [x] `min_order_amount` (decimal, nullable)
  - [x] `service_days` (json) - Days of week serviceable
  - [x] `service_time_start` (time, nullable)
  - [x] `service_time_end` (time, nullable)
  - [x] `created_by` (foreign key to users, nullable)
  - [x] `timestamps`
- [x] Create `Zone` model
  - [x] Fillable attributes
  - [x] Casts (json fields, dates)
  - [x] Relationships (drivers, addresses; orders deferred)
  - [x] Scopes (active)
  - [x] Helper methods:
    - [x] `isServiceable(pincode)` - Check if pincode is serviceable
    - [x] `isWithinBoundary(lat, lng)` - Check if coordinates within boundary
    - [x] `isServiceableOnDay(day)` - Check if serviceable on day
    - [x] `isServiceableAtTime(time)` - Check if serviceable at time

### 3.2 Driver Management
- [x] Create `drivers` table migration
  - [x] `id` (primary key)
  - [x] `user_id` (foreign key to users, unique)
  - [x] `employee_id` (string, unique, indexed)
  - [x] `zone_id` (foreign key, nullable - can be reassigned)
  - [x] `vehicle_number` (string, nullable)
  - [x] `vehicle_type` (string, nullable)
  - [x] `license_number` (string, nullable)
  - [x] `phone` (string, indexed)
  - [x] `is_active` (boolean, default: true)
  - [x] `current_latitude` (decimal, nullable)
  - [x] `current_longitude` (decimal, nullable)
  - [x] `last_location_update` (timestamp, nullable)
  - [x] `is_online` (boolean, default: false)
  - [x] `timestamps`
- [x] Create `Driver` model
  - [x] Relationships (user, zone; deliveries deferred)
  - [x] Scopes (active, online, byZone)
  - [x] Helper methods:
    - [x] `updateLocation(lat, lng)` - Update GPS location
    - [x] `goOnline()` / `goOffline()` - Status management

### 3.3 Zone-Driver Assignment
- [x] Use direct `zone_id` in drivers table (one-to-many) — no pivot table
- [x] ~~Create `zone_drivers` pivot table (if many-to-many)~~ N/A

### 3.4 Location Validation Service
- [x] Create `LocationService` class
  - [x] `validateAddress(address)` - Validate address against zones
  - [x] `findZoneByPincode(pincode)` - Find zone by pincode
  - [x] `findZoneByCoordinates(lat, lng)` - Find zone by coordinates
  - [x] `isAddressServiceable(address)` - Check if address is serviceable
  - [x] `getServiceableZones()` - Get all active zones
- [ ] Integrate with Google Maps Geocoding API (optional; set `GOOGLE_MAPS_API_KEY` in `.env` and enable Geocoding API)
- [x] Cache zone lookups for performance (`LocationService`: pincode, coords, serviceable zones; 1h TTL)

### 3.5 Zone Controllers (Admin)
- [x] Create `Admin/ZoneController`
  - [x] `index()` - List all zones
  - [x] `show(zone)` - Show zone details
  - [x] `store(Request)` - Create zone
  - [x] `update(Request, zone)` - Update zone
  - [x] `destroy(zone)` - Delete zone (soft delete)
  - [x] `toggleStatus(zone)` - Enable/disable zone
- [x] Create Form Requests:
  - [x] `StoreZoneRequest`
  - [x] `UpdateZoneRequest`

### 3.6 Driver Controllers (Admin)
- [x] Create `Admin/DriverController`
  - [x] `index()` - List all drivers
  - [x] `show(driver)` - Show driver details
  - [x] `store(Request)` - Create driver
  - [x] `update(Request, driver)` - Update driver
  - [x] `destroy(driver)` - Delete driver
  - [x] `assignZone(Request, driver)` - Assign/reassign zone
  - [x] `toggleStatus(driver)` - Activate/deactivate
- [x] Create Form Requests:
  - [x] `StoreDriverRequest`
  - [x] `UpdateDriverRequest`
  - [x] `AssignZoneRequest`

### 3.7 Zone API (Customer)
- [x] Create `ZoneController` (customer-facing)
  - [x] `index()` - List active zones
  - [x] `checkServiceability(Request)` - Check if address is serviceable
  - [x] `getZoneByPincode(pincode)` - Get zone by pincode
- [x] Create Form Request: `CheckServiceabilityRequest`

### 3.8 Address-Zone Linking
- [x] Update `UserAddress` model
  - [x] Add `zone_id` relationship
  - [x] Add `autoAssignZone()` method
- [x] Update address creation/update to auto-assign zone
- [x] Create job to retroactively assign zones to existing addresses

### 3.9 Location Selection Middleware
- [x] Enhance `EnsureUserHasLocation` middleware
  - [x] Check if user has default address
  - [x] Check if address is in serviceable zone
  - [x] Redirect to location selection if needed
- [x] Create location selection page

### 3.10 Frontend Zone Selection
- [x] Create zone selection page (`resources/js/Pages/Location/Select.tsx`)
  - [x] List of serviceable zones
  - [x] Search by pincode
  - [ ] Map view (optional)
  - [x] Zone selection
- [x] Create address form with zone validation
  - [x] Real-time pincode validation
  - [x] Zone assignment feedback
  - [x] Serviceability indicator

### 3.11 Admin Zone Management UI
- [x] Create zone list page (admin)
- [x] Create zone create/edit form
  - [x] Zone details
  - [x] Pincode management (textarea → comma/newline → JSON array)
  - [x] Boundary coordinates (textarea JSON array of [lat, lng]; map picker optional)
  - [x] Service hours configuration (service_time_start/end, service_days checkboxes)
- [x] Create zone status toggle

### 3.12 Admin Driver Management UI
- [x] Create driver list page (admin)
- [x] Create driver create/edit form
- [x] Create zone assignment interface
- [x] Create driver status management

### 3.13 Zone Override System (Admin)
- [x] Create `zone_overrides` table migration
  - [x] `id`, `zone_id`, `user_id` (nullable), `address_id` (nullable), `reason`, `overridden_by` (admin_users), `expires_at`, `is_active`, `timestamps`
- [x] Create `ZoneOverride` model
- [x] Update `LocationService` to check overrides (`validateAddress` accepts optional `$userId`; `resolveOverrideZone`)
- [x] Create admin interface for overrides (zone show: list + add; create/edit override pages)

### 3.14 Database Seeders
- [x] Create `ZoneSeeder` (test zones)
- [x] Create `DriverSeeder` (test drivers)
- [x] Assign drivers to zones

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
- ✅ Zone override system (3.13)

## Success Criteria
- [x] Zones can be created and managed
- [x] Drivers can be assigned to zones
- [x] Addresses are automatically assigned to zones
- [x] Serviceability is checked before catalog access
- [x] Zone overrides work for emergency cases (3.13)
- [x] Location selection is mandatory before browsing

## Database Tables Created
- `zones`
- `drivers`
- `zone_overrides`

## Notes
- Zone boundaries can be defined by pincodes (simpler) or coordinates (more precise)
- Consider caching zone lookups for performance
- Zone assignment should be automatic on address creation
- Drivers can be reassigned to different zones
- Zone overrides should be logged for audit

## Remaining (optional / not started)
- [ ] **Google Maps Geocoding API** — Optional; set `GOOGLE_MAPS_API_KEY`, enable Geocoding API.
- [ ] **Map view** on zone selection (optional).
- [ ] **Testing** (3.15) — Zone/driver CRUD, location validation, pincode/coords lookup, serviceability, overrides, feature tests.

## Next Phase
Once Phase 3 is complete, proceed to **Phase 4: Catalog & Product Management**

