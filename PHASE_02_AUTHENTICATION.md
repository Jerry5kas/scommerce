# Phase 2: Authentication & User Management

## Objective
Implement OTP-based authentication system with device fingerprinting, user management, and address handling.

## Auth Model (Clean Split)

| Realm | Table | Model | Login | Guard |
|-------|--------|--------|--------|--------|
| **Admin** | `admin_users` | `Admin` | Email + password | `admin` |
| **Customer & Driver** | `users` | `User` | Phone OTP only | `web` |

- **One model for “user” auth:** Single `users` table + single `User` model for customer and driver. OTP-only (phone). Role: `customer` \| `driver`.
- **Admin:** Separate `admin_users` + email/password (already implemented). No OTP.
- **Precise plan and execution order:** See [PHASE_02_AUTHENTICATION_PLAN.md](PHASE_02_AUTHENTICATION_PLAN.md).
- **Audit (plan vs phase doc):** See [PHASE_02_AUDIT.md](PHASE_02_AUDIT.md).

## Prerequisites
- Phase 1 completed
- Database configured
- SMS gateway credentials (or mock service for development)

## Business Verticals
Authentication is **shared** across both verticals (Daily Fresh & Society Fresh). One user, one set of addresses; no vertical on users table. Optional: store last selected vertical in session for UX (e.g. default to Daily Fresh or Society Fresh on next visit). See [PHASE_NEW_UPDATE.md](PHASE_NEW_UPDATE.md).

## Tasks

### 2.1 User Model & Migration (customer & driver only; admin separate)
- [x] Alter `users` table (new migration) for Phase 2
  - [x] `phone` (required, unique) – already exists; ensure not nullable for OTP
  - [x] `name` (nullable)
  - [x] `email` (nullable)
  - [x] `password` (nullable – OTP-only for customer/driver)
  - [x] `device_fingerprint_hash` (string, nullable, indexed)
  - [x] `preferred_language` (string, default: 'en')
  - [x] `communication_consent` (boolean, default: false)
  - [x] `free_sample_used` (boolean, default: false)
  - [x] `role` (enum: 'customer', 'driver' – no admin; admin in admin_users)
  - [x] `is_active` (boolean, default: true)
  - [x] `last_login_at` (timestamp, nullable)
  - [x] timestamps (existing)
- [x] Create `User` model
  - [x] Fillable, hidden, casts
  - [x] Relationships (addresses; later: subscriptions, orders, wallet)
  - [x] Scopes (active, byRole)
  - [x] Helper methods (isCustomer, isDriver, hasUsedFreeSample)

### 2.2 OTP System
- [x] Create `otps` table migration
  - [x] `id` (primary key)
  - [x] `phone` (string, indexed)
  - [x] `otp` (string, 6 digits)
  - [x] `expires_at` (timestamp)
  - [x] `verified_at` (timestamp, nullable)
  - [x] `attempts` (integer, default: 0)
  - [x] `ip_address` (string, nullable)
  - [x] `device_info` (text, nullable)
  - [x] `timestamps`
- [x] Create `Otp` model
- [x] Create `OtpService` class
  - [x] `generateOtp(phone, ip, deviceInfo)` - Generate and send OTP
  - [x] `verifyOtp(phone, otp)` - Verify OTP
  - [x] `checkRateLimit(phone, ip)` - Prevent abuse
  - [x] `cleanupExpiredOtps()` - Cleanup job (scheduled daily)
- [ ] Create OTP generation job (queue-based)
- [x] Integrate SMS gateway (or mock for development) – log in dev

### 2.3 Device Fingerprinting
- [ ] Create `device_fingerprints` table migration (optional, for tracking)
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key)
  - [ ] `fingerprint_hash` (string, indexed)
  - [ ] `device_info` (json)
  - [ ] `ip_address` (string)
  - [ ] `last_seen_at` (timestamp)
  - [ ] `timestamps`
- [ ] Create `DeviceFingerprintService`
  - [ ] `generateFingerprint(request)` - Generate from request headers
  - [ ] `hashFingerprint(fingerprint)` - Create hash
  - [ ] `storeFingerprint(user, fingerprint, request)` - Store
  - [ ] `validateFingerprint(user, fingerprint)` - Validate

### 2.4 Authentication Controllers
- [x] Create `AuthController`
  - [x] `sendOtp(Request)` - Send OTP to phone
  - [x] `verifyOtp(Request)` - Verify OTP and login
  - [x] `logout()` - Logout user
- [x] Create Form Requests:
  - [x] `SendOtpRequest` - Validate phone number
  - [x] `VerifyOtpRequest` - Validate OTP
- [x] Implement rate limiting on OTP endpoints (throttle + OtpService)
- [ ] Store device fingerprint on login (column exists; optional)

### 2.5 User Address Management
- [x] Create `user_addresses` table migration
  - [x] `id` (primary key)
  - [x] `user_id` (foreign key, indexed)
  - [x] `type` (enum: 'home', 'work', 'other')
  - [x] `label` (string, e.g., "Home", "Office")
  - [x] `address_line_1` (string)
  - [x] `address_line_2` (string, nullable)
  - [x] `landmark` (string, nullable)
  - [x] `city` (string)
  - [x] `state` (string)
  - [x] `pincode` (string)
  - [x] `latitude` (decimal, nullable)
  - [x] `longitude` (decimal, nullable)
  - [x] `zone_id` (foreign key, nullable - Phase 3)
  - [x] `is_default` (boolean, default: false)
  - [x] `is_active` (boolean, default: true)
  - [x] `timestamps`
- [x] Create `UserAddress` model
  - [x] Relationships (user; zone – Phase 3)
  - [x] Scopes (active, default)
- [x] Create `UserAddressController`
  - [x] `index()` - List user addresses
  - [x] `store(Request)` - Create address
  - [x] `update(Request, address)` - Update address
  - [x] `destroy(address)` - Delete address (soft: is_active=false)
  - [x] `setDefault(address)` - Set as default
- [x] Create Form Request: `StoreUserAddressRequest`, `UpdateUserAddressRequest`

### 2.6 User Profile Management
- [x] Create `UserController` (customer-facing)
  - [x] `show()` - Show profile
  - [x] `update(Request)` - Update profile (name, email, preferred_language, communication_consent)
  - [x] Language/consent via single update endpoint
- [x] Create Form Requests for profile updates (`UpdateProfileRequest`)

### 2.7 RBAC Foundation
- [ ] Create `roles` table migration (if multi-role needed)
  - [ ] `id` (primary key)
  - [ ] `name` (string, unique)
  - [ ] `display_name` (string)
  - [ ] `permissions` (json, nullable)
  - [ ] `timestamps`
- [ ] Create `Role` model (if needed)
- [ ] Create `permissions` table migration (if granular permissions needed)
- [ ] Set up Laravel Policies structure
- [ ] Create base `UserPolicy`

### 2.8 Authentication Middleware
- [x] Create `EnsureUserIsAuthenticated` middleware (if custom needed) – use Laravel `auth`
- [x] Create `EnsureUserHasLocation` middleware (for Phase 3)
- [x] Configure middleware in `bootstrap/app.php`

### 2.9 Frontend Authentication
- [x] Create login page (`resources/js/Pages/Auth/Login.tsx`)
  - [x] Phone number input
  - [x] OTP input (conditional)
  - [x] Language selector (en, ml, hi)
  - [x] Communication consent checkbox
  - [x] Error handling (validation + rate limit)
- [x] Create OTP verification component (in login page)
- [x] Set up authentication state management (Inertia auth.user)
- [x] Protected routes use Laravel `auth` middleware
- [x] Handle authentication redirects

### 2.10 User Address Frontend
- [x] Create address list page (`profile/addresses.tsx`)
- [x] Create add/edit address form (inline edit, set default, delete)
- [ ] Integrate location picker (Google Maps or similar; optional) — For Google Maps: set `GOOGLE_MAPS_API_KEY` in `.env`, enable Geocoding API; address form already has lat/lng fields for manual entry
- [x] Zone validation UI (Phase 3: pincode check, auto-assign zone on address)

### 2.11 Abuse Prevention
- [x] Implement OTP rate limiting (per phone, per IP) – OtpService + throttle
- [ ] Implement device + phone hash locking for free samples
- [ ] Create `AbusePreventionService`
  - [ ] `checkOtpAbuse(phone, ip)`
  - [ ] `checkFreeSampleAbuse(phone, deviceHash)`
- [ ] Log suspicious activities

### 2.12 Database Seeders
- [x] Create `UserSeeder` (test users)
- [x] Create `AdminSeeder` (admin users)
- [ ] Create test OTPs (development only; optional — use log or fixed OTP in dev)

### 2.13 Admin User Management (customers & drivers)
- [x] Create `Admin/UserController` — index (filter by role), show, edit, update
- [x] Create admin route: list/show/edit users, update user address
- [x] Admin UI: users list (`admin/users`), user show, user edit (user details + inline address edit)
- [x] Form Requests: `UpdateUserRequest`, `UpdateUserAddressRequest`
- [x] Sidebar: "Users" link to customers & drivers

### 2.14 Testing
- [ ] Test OTP generation and sending
- [ ] Test OTP verification
- [ ] Test device fingerprinting
- [ ] Test address CRUD operations
- [ ] Test free sample abuse prevention
- [ ] Test rate limiting
- [ ] Feature tests for authentication flow

## Deliverables
- ✅ User authentication system (OTP-based)
- ✅ Device fingerprinting system
- ✅ User address management
- ✅ User profile management
- ✅ RBAC foundation
- ✅ Abuse prevention mechanisms
- ✅ Frontend authentication UI

## Success Criteria
- [x] Users can register/login with OTP
- [ ] Device fingerprint is stored and validated (optional)
- [x] Users can manage addresses (address CRUD + profile/addresses UI)
- [ ] Free sample abuse is prevented (optional)
- [x] OTP rate limiting works
- [x] Communication consent is mandatory
- [x] Preferred language is stored

## Database Tables Created
- `users`
- `otps`
- `user_addresses`
- `device_fingerprints` (optional)
- `roles` (if multi-role)
- `permissions` (if granular)

## Notes
- OTP should expire in 5-10 minutes
- Store OTP hashed (optional, but recommended)
- Clean up expired OTPs via scheduled job
- Free sample phone hash should be irreversible
- Device fingerprint should be consistent across sessions
- **Business verticals**: No vertical on user/address; same account works for Daily Fresh and Society Fresh. Optional: session key for last selected vertical.

## Remaining (optional / not started)
- [ ] **OTP queue job** — Move OTP send to a queued job (2.2).
- [ ] **Device fingerprinting** (2.3) — Optional: `device_fingerprints` table, `DeviceFingerprintService`, store/validate on login.
- [ ] **Store device fingerprint on login** (2.4) — Optional; column exists on users.
- [ ] **RBAC** (2.7) — Optional: roles/permissions tables, policies, if multi-role needed.
- [ ] **Abuse prevention** (2.11) — Device + phone hash for free samples, `AbusePreventionService`, log suspicious activities.
- [ ] **Location picker** (2.10) — Optional: Google Maps; lat/lng fields exist for manual entry.
- [ ] **Test OTPs seeder** (2.12) — Dev only; optional (e.g. fixed OTP or log).
- [ ] **Testing** (2.13) — OTP generation/verification, device fingerprint, address CRUD, free sample abuse, rate limiting, auth flow feature tests.
## Next Phase
Once Phase 2 is complete, proceed to **Phase 3: Location & Zone Management**
