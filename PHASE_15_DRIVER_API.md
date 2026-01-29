# Phase 15: Driver API & Integration

## Objective
Build complete REST API for Flutter driver mobile app with authentication, delivery management, GPS tracking, and proof upload.

## Prerequisites
- Phase 3 completed (Zones & Drivers)
- Phase 8 completed (Delivery)
- Phase 9 completed (Bottles)
- Driver authentication system ready

## Tasks

### 15.1 Driver Authentication API
- [ ] Create driver authentication endpoints
  - [ ] `POST /api/v1/driver/auth/login` - Driver login (phone + OTP)
  - [ ] `POST /api/v1/driver/auth/verify-otp` - Verify OTP
  - [ ] `POST /api/v1/driver/auth/logout` - Logout
  - [ ] `POST /api/v1/driver/auth/refresh` - Refresh token
  - [ ] `GET /api/v1/driver/auth/me` - Get current driver
- [ ] Create `Api/V1/Driver/AuthController`
- [ ] Implement token-based authentication (Sanctum or JWT)
- [ ] Create driver token model/migration
- [ ] Generate API tokens on login

### 15.2 Driver Profile API
- [ ] Create `GET /api/v1/driver/profile` - Get driver profile
- [ ] Create `PUT /api/v1/driver/profile` - Update profile
- [ ] Create `PUT /api/v1/driver/location` - Update GPS location
- [ ] Create `POST /api/v1/driver/go-online` - Go online
- [ ] Create `POST /api/v1/driver/go-offline` - Go offline
- [ ] Create `Api/V1/Driver/ProfileController`

### 15.3 Delivery List API
- [ ] Create `GET /api/v1/driver/deliveries` - Get assigned deliveries
  - [ ] Query params: date, status, zone
  - [ ] Return deliveries for driver
  - [ ] Include order details
  - [ ] Include customer address
  - [ ] Include delivery instructions
- [ ] Create `GET /api/v1/driver/deliveries/{id}` - Get delivery details
- [ ] Create `Api/V1/Driver/DeliveryController`
- [ ] Implement pagination
- [ ] Implement filtering

### 15.4 Delivery Actions API
- [ ] Create `POST /api/v1/driver/deliveries/{id}/start` - Start delivery
  - [ ] Mark as "out for delivery"
  - [ ] Update driver location
- [ ] Create `POST /api/v1/driver/deliveries/{id}/update-location` - Update location
  - [ ] Accept latitude, longitude
  - [ ] Update delivery tracking
  - [ ] Update Firebase (if used)
- [ ] Create `POST /api/v1/driver/deliveries/{id}/complete` - Complete delivery
  - [ ] Accept proof image (mandatory)
  - [ ] Accept customer signature (optional)
  - [ ] Accept notes
  - [ ] Mark delivery as delivered
  - [ ] Update order status
- [ ] Create `POST /api/v1/driver/deliveries/{id}/fail` - Mark as failed
  - [ ] Accept failure reason
  - [ ] Mark delivery as failed
- [ ] Update `Api/V1/Driver/DeliveryController`

### 15.5 Proof Upload API
- [ ] Create `POST /api/v1/driver/deliveries/{id}/upload-proof` - Upload proof
  - [ ] Accept image file
  - [ ] Validate image (size, format)
  - [ ] Upload to object storage
  - [ ] Store image URL in delivery
  - [ ] **CRITICAL**: Delivery cannot be completed without proof
- [ ] Implement image validation
- [ ] Implement image compression (optional)
- [ ] Return image URL

### 15.6 Route API
- [ ] Create `GET /api/v1/driver/route` - Get delivery route
  - [ ] Query params: date
  - [ ] Return optimized route
  - [ ] Include delivery order
  - [ ] Include addresses
  - [ ] Include estimated times
- [ ] Create `GET /api/v1/driver/route/optimize` - Optimize route
  - [ ] Accept delivery IDs
  - [ ] Return optimized order
- [ ] Create route optimization service (optional)

### 15.7 Bottle Management API
- [ ] Create `POST /api/v1/driver/deliveries/{id}/return-bottle` - Return bottle
  - [ ] Accept bottle number/barcode
  - [ ] Accept condition
  - [ ] Record bottle return
- [ ] Create `POST /api/v1/driver/deliveries/{id}/issue-bottle` - Issue bottle
  - [ ] Accept bottle number/barcode
  - [ ] Record bottle issue
- [ ] Create `POST /api/v1/driver/deliveries/{id}/mark-bottle-damaged` - Mark damaged
  - [ ] Accept bottle number/barcode
  - [ ] Accept damage reason
  - [ ] Record damage
- [ ] Create `GET /api/v1/driver/bottles` - Get bottles for delivery
- [ ] Update `Api/V1/Driver/DeliveryController`

### 15.8 GPS Tracking API
- [ ] Create `POST /api/v1/driver/location` - Update location
  - [ ] Accept latitude, longitude
  - [ ] Accept accuracy, speed, heading (optional)
  - [ ] Update driver location
  - [ ] Update Firebase (if used)
  - [ ] Create tracking record
- [ ] Create `GET /api/v1/driver/location` - Get current location
- [ ] Create `GET /api/v1/driver/deliveries/{id}/tracking` - Get delivery tracking
- [ ] Implement location update frequency (every 30-60 seconds)

### 15.9 Offline Support
- [ ] Implement offline-first architecture
  - [ ] Queue API requests when offline
  - [ ] Sync when online
  - [ ] Handle conflicts
- [ ] Create `POST /api/v1/driver/sync` - Sync offline data
  - [ ] Accept queued actions
  - [ ] Process in order
  - [ ] Return results
- [ ] Create offline queue storage (local storage in app)

### 15.10 API Documentation
- [ ] Create API documentation
  - [ ] Endpoint list
  - [ ] Request/response formats
  - [ ] Authentication flow
  - [ ] Error codes
  - [ ] Examples
- [ ] Use API documentation tool (Laravel API Documentation, Swagger, etc.)
- [ ] Create Postman collection (optional)

### 15.11 API Versioning
- [ ] Set up API versioning structure
  - [ ] `/api/v1/driver/*` - Current version
  - [ ] Prepare for future versions
- [ ] Create version middleware
- [ ] Document versioning strategy

### 15.12 API Security
- [ ] Implement rate limiting for driver API
- [ ] Implement CORS for mobile app
- [ ] Validate all inputs
- [ ] Sanitize outputs
- [ ] Implement request signing (optional)
- [ ] Log API requests
- [ ] Monitor API usage

### 15.13 Error Handling
- [ ] Create consistent error response format
  - [ ] Error code
  - [ ] Error message
  - [ ] Error details (optional)
- [ ] Create API exception handler
- [ ] Handle validation errors
- [ ] Handle authentication errors
- [ ] Handle authorization errors
- [ ] Handle server errors

### 15.14 API Testing
- [ ] Create API feature tests
  - [ ] Test authentication
  - [ ] Test delivery endpoints
  - [ ] Test proof upload
  - [ ] Test bottle management
  - [ ] Test GPS tracking
  - [ ] Test offline sync
- [ ] Create API test suite
- [ ] Test error scenarios
- [ ] Test rate limiting

### 15.15 Flutter App Integration Points
- [ ] Document integration requirements
  - [ ] Authentication flow
  - [ ] Token management
  - [ ] API base URL
  - [ ] Error handling
  - [ ] Offline support
- [ ] Create Flutter API client documentation
- [ ] Provide code examples

### 15.16 Real-time Updates (Optional)
- [ ] Implement WebSocket or Server-Sent Events
  - [ ] New delivery assignments
  - [ ] Delivery status updates
  - [ ] Route changes
- [ ] Or use Firebase Realtime Database
- [ ] Or use polling (simpler)

### 15.17 Database Seeders
- [ ] Create `DriverApiTokenSeeder` (test tokens)
- [ ] Create test driver API data

### 15.18 Testing
- [ ] Test all API endpoints
- [ ] Test authentication
- [ ] Test authorization
- [ ] Test proof upload
- [ ] Test bottle management
- [ ] Test GPS tracking
- [ ] Test offline sync
- [ ] Test error handling
- [ ] Feature tests for driver API

## Deliverables
- ✅ Complete driver authentication API
- ✅ Driver profile API
- ✅ Delivery management API
- ✅ Proof upload API
- ✅ Bottle management API
- ✅ GPS tracking API
- ✅ Route API
- ✅ Offline support
- ✅ API documentation
- ✅ API testing

## Success Criteria
- [ ] Drivers can authenticate via API
- [ ] Drivers can view assigned deliveries
- [ ] Drivers can update GPS location
- [ ] Drivers can complete deliveries with proof
- [ ] Proof upload is mandatory
- [ ] Bottle management works
- [ ] API is well-documented
- [ ] API is secure and rate-limited
- [ ] Offline support works

## API Endpoints Summary
- Authentication: `/api/v1/driver/auth/*`
- Profile: `/api/v1/driver/profile`
- Deliveries: `/api/v1/driver/deliveries/*`
- Location: `/api/v1/driver/location`
- Route: `/api/v1/driver/route`
- Bottles: `/api/v1/driver/bottles`
- Sync: `/api/v1/driver/sync`

## Notes
- Use token-based authentication (Sanctum recommended)
- All endpoints should be stateless
- Proof image is mandatory - enforce at API level
- GPS updates should be frequent (30-60 seconds)
- Offline support is critical for driver app
- API should be versioned
- Document all endpoints thoroughly
- Implement proper error handling
- Rate limit to prevent abuse

## Next Phase
Once Phase 15 is complete, proceed to **Phase 16: Testing, Security & Deployment**

