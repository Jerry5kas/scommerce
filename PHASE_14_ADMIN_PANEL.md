# Phase 14: Admin Control Panel

## Objective
Build comprehensive admin control panel with all management interfaces, dashboards, and operational tools.

## Prerequisites
- All previous phases completed
- All modules are functional
- Admin authentication is working

## Tasks

### 14.1 Admin Dashboard
- [ ] Create admin dashboard page (`resources/js/Pages/Admin/Dashboard.tsx`)
  - [ ] Key metrics cards:
    - [ ] Total users
    - [ ] Active subscriptions
    - [ ] Today's orders
    - [ ] Today's deliveries
    - [ ] Revenue (today, week, month)
    - [ ] Pending deliveries
    - [ ] Low wallet balances
    - [ ] Pending proof verifications
  - [ ] Charts:
    - [ ] Revenue chart (daily, weekly, monthly)
    - [ ] Order trend
    - [ ] Subscription growth
    - [ ] Delivery success rate
  - [ ] Recent activities feed
  - [ ] Quick actions
- [ ] Create `Admin/DashboardController`
  - [ ] `index()` - Get dashboard data
  - [ ] `getMetrics(dateRange)` - Get metrics
  - [ ] `getCharts(dateRange)` - Get chart data

### 14.2 User Management
- [ ] Create user list page (admin)
  - [ ] User table with filters
  - [ ] Search functionality
  - [ ] Filters (status, role, date, zone)
  - [ ] Bulk actions
  - [ ] Export functionality
- [ ] Create user detail page (admin)
  - [ ] User profile
  - [ ] Addresses
  - [ ] Orders history
  - [ ] Subscriptions
  - [ ] Wallet balance
  - [ ] Loyalty points
  - [ ] Referrals
  - [ ] Activity log
  - [ ] Edit/block user actions
- [ ] Create `Admin/UserController`
  - [ ] `index()` - List users
  - [ ] `show(user)` - Show user details
  - [ ] `update(Request, user)` - Update user
  - [ ] `block(user)` - Block user
  - [ ] `unblock(user)` - Unblock user
  - [ ] `export(Request)` - Export users

### 14.3 Catalog Management (Admin)
- [ ] Category management (from Phase 4)
  - [ ] List, create, edit, delete
  - [ ] Image upload
  - [ ] Display order management
- [ ] Collection management (from Phase 4)
  - [ ] List, create, edit, delete
  - [ ] Banner image upload
  - [ ] Campaign dates
- [ ] Product management (from Phase 4)
  - [ ] List with advanced filters
  - [ ] Create/edit form
  - [ ] Image gallery
  - [ ] Zone availability management
  - [ ] Stock management
  - [ ] Bulk operations
  - [ ] Import/export

### 14.4 Zone & Driver Management (Admin)
- [ ] Zone management (from Phase 3)
  - [ ] List, create, edit zones
  - [ ] Pincode management
  - [ ] Boundary coordinates (map)
  - [ ] Service hours configuration
- [ ] Driver management (from Phase 3)
  - [ ] List, create, edit drivers
  - [ ] Zone assignment
  - [ ] Status management
  - [ ] Location tracking view

### 14.5 Subscription Management (Admin)
- [ ] Subscription list (from Phase 5)
  - [ ] Filters (status, user, date, zone)
  - [ ] Search functionality
  - [ ] Bulk actions
- [ ] Subscription detail (from Phase 5)
  - [ ] Full subscription details
  - [ ] Edit override (admin can edit any)
  - [ ] Schedule view
  - [ ] Order history
  - [ ] Bottle history
  - [ ] Activity log
- [ ] Upcoming deliveries dashboard
  - [ ] Calendar view
  - [ ] Group by zone/driver
  - [ ] Assignment interface

### 14.6 Order Management (Admin)
- [ ] Order list (from Phase 6)
  - [ ] Filters (status, date, user, driver, zone)
  - [ ] Search by order number
  - [ ] Bulk actions
  - [ ] Export functionality
- [ ] Order detail (from Phase 6)
  - [ ] Full order details
  - [ ] Status update
  - [ ] Driver assignment
  - [ ] Payment details
  - [ ] Delivery details
  - [ ] Refund interface
  - [ ] Notes section
  - [ ] Activity log

### 14.7 Delivery Management (Admin)
- [ ] Delivery list (from Phase 8)
  - [ ] Filters (status, date, driver, zone)
  - [ ] Search functionality
  - [ ] Bulk actions
- [ ] Delivery detail (from Phase 8)
  - [ ] Delivery details
  - [ ] Driver assignment
  - [ ] Status update
  - [ ] Proof image viewer
  - [ ] Proof verification
  - [ ] Manual override (with reason)
  - [ ] Live tracking map
  - [ ] Activity log
- [ ] Delivery assignment dashboard
  - [ ] Calendar view
  - [ ] Drag-and-drop assignment
  - [ ] Driver capacity view

### 14.8 Payment & Wallet Management (Admin)
- [ ] Payment list (from Phase 7)
  - [ ] Filters (status, gateway, date)
  - [ ] Search functionality
  - [ ] Refund interface
  - [ ] Retry failed payments
- [ ] Payment detail (from Phase 7)
  - [ ] Payment details
  - [ ] Gateway response
  - [ ] Refund interface
  - [ ] Retry button
- [ ] Wallet management (from Phase 7)
  - [ ] Wallet list
  - [ ] Balance adjustment
  - [ ] Transaction history
  - [ ] Export functionality

### 14.9 Bottle Management (Admin)
- [ ] Bottle list (from Phase 9)
  - [ ] Filters (status, user, subscription)
  - [ ] Search by bottle number/barcode
  - [ ] Bulk actions
- [ ] Bottle detail (from Phase 9)
  - [ ] Bottle details
  - [ ] Current holder info
  - [ ] Issue/return buttons
  - [ ] Logs timeline
  - [ ] Status change history
- [ ] Bottle reports (from Phase 9)
  - [ ] Status overview
  - [ ] Issued/returned charts
  - [ ] Damaged/lost reports
  - [ ] Export functionality

### 14.10 Marketing Management (Admin)
- [ ] Campaign management (from Phase 12)
  - [ ] Campaign list
  - [ ] Create/edit campaign
  - [ ] Target audience selection
  - [ ] Message template editor
  - [ ] Schedule interface
  - [ ] Send/preview
  - [ ] Campaign statistics
- [ ] Banner management (from Phase 12)
  - [ ] Banner list
  - [ ] Create/edit banner
  - [ ] Image upload
  - [ ] Link configuration
  - [ ] Zone selection
  - [ ] Date range

### 14.11 Coupon Management (Admin)
- [ ] Coupon list (from Phase 11)
  - [ ] Filters (status, type, date)
  - [ ] Search functionality
  - [ ] Usage statistics
- [ ] Coupon create/edit (from Phase 11)
  - [ ] Basic details
  - [ ] Discount configuration
  - [ ] Usage limits
  - [ ] Eligibility rules
  - [ ] Product/category selection
- [ ] Coupon detail (from Phase 11)
  - [ ] Coupon details
  - [ ] Usage history
  - [ ] Statistics

### 14.12 Reports & Exports
- [ ] Create reports page (admin)
  - [ ] Sales report
  - [ ] Product report
  - [ ] Subscription report
  - [ ] Delivery report
  - [ ] User report
  - [ ] Revenue report
  - [ ] Bottle report
  - [ ] Analytics report
- [ ] Create report filters
  - [ ] Date range
  - [ ] Zone filter
  - [ ] Product filter
  - [ ] User filter
- [ ] Implement export functionality
  - [ ] CSV export
  - [ ] PDF export (optional)
  - [ ] Excel export (optional)

### 14.13 Admin Settings
- [ ] Create settings page (admin)
  - [ ] General settings
  - [ ] Payment gateway settings
  - [ ] SMS/WhatsApp settings
  - [ ] Email settings
  - [ ] Notification settings
  - [ ] Loyalty settings
  - [ ] Referral settings
  - [ ] Zone settings
  - [ ] Delivery settings
- [ ] Create `Admin/SettingsController`
  - [ ] `index()` - Get settings
  - [ ] `update(Request)` - Update settings

### 14.14 Activity Logs
- [ ] Create `activity_logs` table migration
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key, nullable)
  - [ ] `admin_id` (foreign key, nullable)
  - [ ] `action` (string) - Action performed
  - [ ] `model_type` (string, nullable)
  - [ ] `model_id` (string, nullable)
  - [ ] `description` (text)
  - [ ] `changes` (json, nullable) - Changed attributes
  - [ ] `ip_address` (string, nullable)
  - [ ] `user_agent` (text, nullable)
  - [ ] `timestamps`
- [ ] Create `ActivityLog` model
- [ ] Create `ActivityLogService`
  - [ ] `log(action, model, user, changes)` - Log activity
- [ ] Integrate activity logging in admin actions
- [ ] Create activity log viewer (admin)

### 14.15 Admin Navigation
- [ ] Create admin navigation component
  - [ ] Dashboard
  - [ ] Users
  - [ ] Catalog (Categories, Collections, Products)
  - [ ] Zones & Drivers
  - [ ] Subscriptions
  - [ ] Orders
  - [ ] Deliveries
  - [ ] Payments & Wallets
  - [ ] Bottles
  - [ ] Marketing (Campaigns, Banners)
  - [ ] Coupons
  - [ ] Reports
  - [ ] Analytics
  - [ ] Settings
- [ ] Implement role-based menu visibility

### 14.16 Admin Layout
- [ ] Enhance admin layout (from Phase 1)
  - [ ] Header with user info
  - [ ] Sidebar navigation
  - [ ] Breadcrumbs
  - [ ] Notification bell
  - [ ] Search functionality
  - [ ] Logout button
- [ ] Create admin components
  - [ ] Data table component
  - [ ] Filter component
  - [ ] Form components
  - [ ] Modal components
  - [ ] Chart components

### 14.17 Admin Permissions
- [ ] Create `permissions` table (if granular permissions needed)
- [ ] Create `roles` table (if multi-role)
- [ ] Create `role_permissions` pivot table
- [ ] Implement permission checks in controllers
- [ ] Implement permission checks in policies
- [ ] Create permission management UI

### 14.18 Database Seeders
- [ ] Create `AdminUserSeeder` (admin users)
- [ ] Create test admin data

### 14.19 Testing
- [ ] Test admin dashboard
- [ ] Test all management interfaces
- [ ] Test permissions
- [ ] Test activity logging
- [ ] Test reports and exports
- [ ] Feature tests for admin panel

## Deliverables
- ✅ Complete admin dashboard
- ✅ User management interface
- ✅ Catalog management interface
- ✅ Zone & driver management
- ✅ Subscription management
- ✅ Order management
- ✅ Delivery management
- ✅ Payment & wallet management
- ✅ Bottle management
- ✅ Marketing management
- ✅ Coupon management
- ✅ Reports & exports
- ✅ Activity logs
- ✅ Admin settings

## Success Criteria
- [ ] All modules are manageable from admin panel
- [ ] Admin dashboard shows accurate metrics
- [ ] All CRUD operations work
- [ ] Reports can be generated and exported
- [ ] Activity logs are maintained
- [ ] Permissions are enforced
- [ ] Admin UI is intuitive and responsive

## Database Tables Created
- `activity_logs`
- `permissions` (if granular)
- `roles` (if multi-role)
- `role_permissions` (if multi-role)

## Notes
- Admin panel should be responsive
- Use consistent UI components
- Implement proper error handling
- Add loading states
- Implement pagination for large lists
- Add search and filters everywhere
- Activity logs should be comprehensive
- Consider admin user roles and permissions

## Next Phase
Once Phase 14 is complete, proceed to **Phase 15: Driver API & Integration**

