# Phase 2: Authentication & User Management

## Objective
Implement OTP-based authentication system with device fingerprinting, user management, and address handling.

## Prerequisites
- Phase 1 completed
- Database configured
- SMS gateway credentials (or mock service for development)

## Tasks

### 2.1 User Model & Migration
- [ ] Create `users` table migration
  - [ ] `id` (primary key)
  - [ ] `phone` (unique, indexed)
  - [ ] `name` (nullable, can be set later)
  - [ ] `email` (nullable)
  - [ ] `device_fingerprint` (string, nullable)
  - [ ] `device_fingerprint_hash` (string, indexed)
  - [ ] `preferred_language` (string, default: 'en')
  - [ ] `communication_consent` (boolean, default: false)
  - [ ] `free_sample_used` (boolean, default: false)
  - [ ] `free_sample_phone_hash` (string, nullable, indexed)
  - [ ] `role` (enum: 'customer', 'admin', 'driver')
  - [ ] `is_active` (boolean, default: true)
  - [ ] `last_login_at` (timestamp, nullable)
  - [ ] `timestamps`
- [ ] Create `User` model
  - [ ] Fillable attributes
  - [ ] Hidden attributes
  - [ ] Casts (dates, booleans)
  - [ ] Relationships (addresses, subscriptions, orders, wallet)
  - [ ] Scopes (active, byRole)
  - [ ] Helper methods (hasUsedFreeSample, canUseFreeSample)

### 2.2 OTP System
- [ ] Create `otps` table migration
  - [ ] `id` (primary key)
  - [ ] `phone` (string, indexed)
  - [ ] `otp` (string, 6 digits)
  - [ ] `expires_at` (timestamp)
  - [ ] `verified_at` (timestamp, nullable)
  - [ ] `attempts` (integer, default: 0)
  - [ ] `ip_address` (string, nullable)
  - [ ] `device_info` (text, nullable)
  - [ ] `timestamps`
- [ ] Create `Otp` model
- [ ] Create `OtpService` class
  - [ ] `generateOtp(phone, ip, deviceInfo)` - Generate and send OTP
  - [ ] `verifyOtp(phone, otp)` - Verify OTP
  - [ ] `checkRateLimit(phone, ip)` - Prevent abuse
  - [ ] `cleanupExpiredOtps()` - Cleanup job
- [ ] Create OTP generation job (queue-based)
- [ ] Integrate SMS gateway (or mock for development)

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
- [ ] Create `AuthController`
  - [ ] `sendOtp(Request)` - Send OTP to phone
  - [ ] `verifyOtp(Request)` - Verify OTP and login
  - [ ] `logout()` - Logout user
- [ ] Create Form Requests:
  - [ ] `SendOtpRequest` - Validate phone number
  - [ ] `VerifyOtpRequest` - Validate OTP
- [ ] Implement rate limiting on OTP endpoints
- [ ] Store device fingerprint on login

### 2.5 User Address Management
- [ ] Create `user_addresses` table migration
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `type` (enum: 'home', 'work', 'other')
  - [ ] `label` (string, e.g., "Home", "Office")
  - [ ] `address_line_1` (string)
  - [ ] `address_line_2` (string, nullable)
  - [ ] `landmark` (string, nullable)
  - [ ] `city` (string)
  - [ ] `state` (string)
  - [ ] `pincode` (string)
  - [ ] `latitude` (decimal, nullable)
  - [ ] `longitude` (decimal, nullable)
  - [ ] `zone_id` (foreign key, nullable - Phase 3)
  - [ ] `is_default` (boolean, default: false)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `timestamps`
- [ ] Create `UserAddress` model
  - [ ] Relationships (user, zone)
  - [ ] Scopes (active, default)
- [ ] Create `UserAddressController`
  - [ ] `index()` - List user addresses
  - [ ] `store(Request)` - Create address
  - [ ] `update(Request, address)` - Update address
  - [ ] `destroy(address)` - Delete address
  - [ ] `setDefault(address)` - Set as default
- [ ] Create Form Request: `StoreUserAddressRequest`, `UpdateUserAddressRequest`

### 2.6 User Profile Management
- [ ] Create `UserController` (customer-facing)
  - [ ] `show()` - Show profile
  - [ ] `update(Request)` - Update profile
  - [ ] `updateLanguage(Request)` - Update preferred language
  - [ ] `updateCommunicationConsent(Request)` - Update consent
- [ ] Create Form Requests for profile updates

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
- [ ] Create `EnsureUserIsAuthenticated` middleware (if custom needed)
- [ ] Create `EnsureUserHasLocation` middleware (for Phase 3)
- [ ] Configure middleware in `bootstrap/app.php`

### 2.9 Frontend Authentication
- [ ] Create login page (`resources/js/Pages/Auth/Login.tsx`)
  - [ ] Phone number input
  - [ ] OTP input (conditional)
  - [ ] Language selector
  - [ ] Communication consent checkbox
  - [ ] Error handling
- [ ] Create OTP verification component
- [ ] Set up authentication state management
- [ ] Create protected route wrapper
- [ ] Handle authentication redirects

### 2.10 User Address Frontend
- [ ] Create address list page
- [ ] Create add/edit address form
- [ ] Integrate location picker (Google Maps or similar)
- [ ] Zone validation UI (Phase 3 integration)

### 2.11 Abuse Prevention
- [ ] Implement OTP rate limiting (per phone, per IP)
- [ ] Implement device + phone hash locking for free samples
- [ ] Create `AbusePreventionService`
  - [ ] `checkOtpAbuse(phone, ip)`
  - [ ] `checkFreeSampleAbuse(phone, deviceHash)`
- [ ] Log suspicious activities

### 2.12 Database Seeders
- [ ] Create `UserSeeder` (test users)
- [ ] Create `AdminSeeder` (admin users)
- [ ] Create test OTPs (development only)

### 2.13 Testing
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
- [ ] Users can register/login with OTP
- [ ] Device fingerprint is stored and validated
- [ ] Users can manage addresses
- [ ] Free sample abuse is prevented
- [ ] OTP rate limiting works
- [ ] Communication consent is mandatory
- [ ] Preferred language is stored

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

## Next Phase
Once Phase 2 is complete, proceed to **Phase 3: Location & Zone Management**

