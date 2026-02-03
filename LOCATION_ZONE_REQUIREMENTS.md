# Location, Zone, Address, and Pincode Requirements

## Overview
This document explains the proper requirements and flow for setting up zones, addresses, pincodes, and locations in the Freshtick application.

## System Architecture

### 1. **Zones** (Delivery Service Areas)
Zones define geographic areas where delivery is available.

**Required Fields:**
- `name` (string, unique) - e.g., "Kochi Central"
- `code` (string, unique) - e.g., "KOCHI-C"
- `city` (string) - e.g., "Kochi"
- `state` (string) - e.g., "Kerala"
- `pincodes` (JSON array) - Array of serviceable pincodes, e.g., `["682001", "682002", "682003"]`
- `is_active` (boolean) - Must be `true` for zone to be usable
- `delivery_charge` (decimal, nullable) - Delivery fee for this zone
- `min_order_amount` (decimal, nullable) - Minimum order value
- `boundary_coordinates` (JSON array, optional) - Polygon coordinates `[[lat, lng], ...]`
- `service_days` (JSON array, optional) - Days of week `[0,1,2,3,4,5,6]` (Sunday-Saturday)
- `service_time_start` (time, optional) - Start time for service
- `service_time_end` (time, optional) - End time for service
- `verticals` (JSON array, optional) - Business verticals: `["daily_fresh", "society_fresh"]`

**Minimum Requirements for Zone to Work:**
1. Zone must exist in `zones` table
2. `is_active` must be `true`
3. `pincodes` array must contain at least one pincode
4. Zone must be seeded or created via admin panel

### 2. **User Addresses** (Delivery Locations)
User addresses are where customers want products delivered.

**Required Fields:**
- `user_id` (foreign key) - Links to user
- `address_line_1` (string) - Street address
- `city` (string)
- `state` (string)
- `pincode` (string) - Must match a zone's pincode for auto-assignment
- `is_default` (boolean) - One address per user should be default
- `is_active` (boolean) - Must be `true` for address to be usable
- `zone_id` (foreign key, nullable) - Auto-assigned based on pincode

**Optional Fields:**
- `address_line_2` (string)
- `landmark` (string)
- `latitude` (decimal) - For coordinate-based zone matching
- `longitude` (decimal) - For coordinate-based zone matching
- `type` (string) - "home", "work", "other"
- `label` (string) - Custom label

**Minimum Requirements for Address to Work:**
1. Address must have a valid `pincode` that exists in at least one zone's `pincodes` array
2. Address must be set as `is_default = true` (one per user)
3. Address must have `is_active = true`
4. Address must have `zone_id` assigned (auto-assigned via `autoAssignZone()`)

### 3. **Pincode Validation Flow**

**How Zone Assignment Works:**
1. User creates/updates address with a pincode
2. System calls `LocationService::validateAddress()`
3. System searches all active zones for matching pincode
4. If pincode matches a zone's `pincodes` array → zone is assigned
5. If coordinates (lat/lng) provided → also checks `boundary_coordinates`
6. If zone found → `zone_id` is set on address
7. If no zone found → `zone_id` remains `null` (address unusable for shopping)

**Pincode Matching Rules:**
- Pincode is normalized (spaces removed)
- Exact match required in zone's `pincodes` array
- Case-insensitive
- Example: `"682001"` matches `["682001", "682002"]` ✅

### 4. **Location Middleware Requirements**

**What `EnsureUserHasLocation` Middleware Checks:**
1. User must be authenticated
2. User must have at least one active address with `is_default = true`
3. That default address must have `zone_id` set (not null)

**If Requirements Not Met:**
- User is redirected to `/location` (location selection page)
- User cannot access protected routes (catalog, products, cart, etc.)

**Protected Routes (require location):**
- `/catalog/*`
- `/products/*`
- `/cart`
- `/subscription`

**Unprotected Routes (don't require location):**
- `/` (home - but controller checks zone)
- `/login`
- `/location`
- `/profile/addresses`

## Proper Setup Flow

### Step 1: Seed Zones (One-Time Setup)
```bash
php artisan db:seed --class=ZoneSeeder
```

Or manually create zones via admin panel at `/admin/zones`

**Example Zone Data:**
```php
[
    'name' => 'Kochi Central',
    'code' => 'KOCHI-C',
    'pincodes' => ['682001', '682002', '682003'],
    'city' => 'Kochi',
    'state' => 'Kerala',
    'is_active' => true,
]
```

### Step 2: User Creates Address
1. User logs in
2. User goes to `/profile/addresses`
3. User adds address with:
   - Valid pincode (must be in a zone's pincodes array)
   - Address details
   - Sets as default (or sets existing as default)

**What Happens Automatically:**
- `autoAssignZone()` is called
- System finds zone matching pincode
- `zone_id` is set on address
- Address becomes usable

### Step 3: User Can Access Protected Pages
Once address has `zone_id`:
- User can access home page
- User can browse catalog
- User can view products
- User can add to cart

## Common Issues & Solutions

### Issue 1: Blank Layout / Can't Access Pages
**Cause:** Address exists but `zone_id` is `null`

**Solution:**
1. Check if pincode exists in any zone's `pincodes` array
2. Edit address and save (triggers `autoAssignZone()`)
3. Or set address as default (triggers `autoAssignZone()`)

### Issue 2: "No zones configured yet"
**Cause:** Zones not seeded or all zones are inactive

**Solution:**
```bash
php artisan db:seed --class=ZoneSeeder
```

### Issue 3: Pincode Not Serviceable
**Cause:** Pincode not in any zone's `pincodes` array

**Solution:**
1. Add pincode to a zone via admin panel (`/admin/zones`)
2. Or create new zone with that pincode

### Issue 4: Zone Assignment Fails
**Possible Causes:**
- Pincode format mismatch (spaces, leading zeros)
- Zone is inactive (`is_active = false`)
- Cache issue (clear cache: `php artisan cache:clear`)

**Solution:**
- Normalize pincode: remove spaces, ensure 6 digits
- Check zone is active
- Clear cache and retry

## Development Bypass

In `APP_DEBUG=true` mode:
- Middleware auto-assigns zone if address exists but `zone_id` is null
- CatalogController auto-assigns zone when checking user zone
- Helps during development when zone assignment fails

## Testing Checklist

✅ Zones seeded in database
✅ At least one zone has `is_active = true`
✅ Zone has pincodes in `pincodes` array
✅ User has address with pincode matching a zone
✅ Address has `is_default = true`
✅ Address has `is_active = true`
✅ Address has `zone_id` set (not null)
✅ User can access `/` (home page)
✅ User can access `/products`
✅ User can access `/cart`

## Database Queries to Verify Setup

```php
// Check zones
\App\Models\Zone::active()->count(); // Should be > 0

// Check user's default address
$user = auth()->user();
$address = $user->addresses()->active()->where('is_default', true)->first();
$address->zone_id; // Should not be null
$address->zone; // Should return Zone model

// Check if pincode is serviceable
$pincode = '682001';
\App\Models\Zone::active()->get()->first(fn($z) => $z->isServiceable($pincode));
```

## Summary

**Minimum Requirements:**
1. ✅ Zones exist and are active
2. ✅ Zones have pincodes configured
3. ✅ User has default address
4. ✅ Address pincode matches a zone's pincode
5. ✅ Address has `zone_id` assigned

**Flow:**
1. Admin creates zones with pincodes
2. User creates address with pincode
3. System auto-assigns zone based on pincode
4. User can now shop

