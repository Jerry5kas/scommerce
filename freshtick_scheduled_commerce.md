FreshTick – Dairy Scheduled Commerce Platform
Technical & Functional Documentation
 
 

________________________________________
1. System Overview
FreshTick is a subscription-first dairy commerce platform designed for daily logistics reliability, controlled delivery proof, bottle tracking, and growth-driven marketing automation.
Core Characteristics
●	Subscription-centric ordering
●	Mandatory location-based availability
●	Proof-based delivery enforcement
●	Wallet + loyalty driven retention
●	Analytics-ready & marketing-ready architecture
________________________________________
2. Roles & Access Control (RBAC)
2.1 User Roles
Role	Description
Customer	Browse, subscribe, order, wallet, referrals
Delivery Partner (Driver)	Assigned routes, live tracking, proof uploads
Admin	Master control, approvals, overrides, reports
2.2 Authentication Model
●	OTP-based login (phone number)
●	Device fingerprint stored
●	Communication consent mandatory
●	Preferred language stored at login
Security Controls
●	OTP abuse prevention
●	Device + phone hash locking
●	Role-based route & API access
________________________________________
3. System Architecture
3.1 High-Level Architecture
Frontend
●	Web / PWA / App
●	Catalog, Subscription, Wallet, Tracking UI
Backend (Laravel API)
●	Modular service-oriented design
●	Queue-based notifications
●	Policy-driven access control
Data Stores
●	MySQL (primary transactional DB)
●	Firebase / Redis (live tracking, sessions)
●	Object storage (delivery proof images)
External Integrations
●	Payment gateway
●	SMS / WhatsApp / Push (FCM)
●	Google Tag Manager & Pixels
________________________________________
4. User & Authentication Module
Purpose
Manages identity, access, preferences, and abuse prevention.
Key Tables
●	users
●	user_addresses
Functional Flow
1.	User enters phone number
2.	OTP verification
3.	Device fingerprint recorded
4.	Preferred language stored
5.	Session established
Special Rules
●	One phone = one free sample
●	Communication consent mandatory
●	Address must map to serviceable zone
________________________________________
5. Location & Zone Management Module
Purpose
Controls service availability and delivery routing.
Core Tables
●	zones
●	drivers
●	user_addresses
Functional Rules
●	Location selection is mandatory before browsing
●	Catalog visibility depends on zone
●	Drivers are strictly mapped to zones
Admin Capabilities
●	Enable/disable zones
●	Assign drivers per zone
●	Override availability (emergency use)
________________________________________
6. Catalog & Discovery Module
Purpose
Manages product discovery with conversion-optimized flow.
Structure
Category
 └── Collection (Hero Banner)
     └── Product

Core Tables
●	categories
●	collections
●	products
Product Capabilities
●	One-time purchase
●	Subscription eligible
●	Bottle-required products
UI Behavior
●	Home banners
●	Try-Free Sample popup
●	Cross-sell & upsell sections
________________________________________
7. Subscription Management Module (Critical)
Purpose
Drives predictable revenue & daily delivery scheduling.
Supported Patterns
●	Daily
●	Alternate days
●	Custom schedules
Core Tables
●	subscription_plans
●	subscriptions
●	subscription_items
Key Rules
●	Pause / Resume / Vacation hold
●	Editable only for current & previous month
●	Linked directly to orders & deliveries
Bottle Integration
●	Bottle issue & return tracked per subscription
________________________________________
8. Cart & Order Management Module
Purpose
Handles checkout, validation, and order lifecycle.
Core Tables
●	carts
●	cart_items
●	orders
●	order_items
Order Types
●	One-time
●	Subscription-generated
Checkout Features
●	Wallet usage
●	Coupon validation
●	Instructions for delivery
●	Free sample abuse check
Order Lifecycle
Placed → Out for Delivery → Delivered / Cancelled

________________________________________
9. Payment & Wallet Module
Purpose
Enables cashless ecosystem & refunds.
Core Tables
●	payments
●	wallets
●	wallet_transactions
Wallet Features
●	Recharge
●	Auto reminders
●	Refund credits
●	Loyalty integration
Payment Controls
●	Gateway verification
●	Wallet priority logic
●	Failed payment recovery hooks
________________________________________
10. Delivery & Proof Enforcement Module
Purpose
Ensures zero-dispute deliveries.
Core Tables
●	deliveries
●	delivery_tracking
Driver App Rules
●	Route-wise delivery list
●	Live GPS tracking
●	Mandatory delivery image
●	Bottle return entry
🚫 Delivery cannot be completed without image proof
Admin Controls
●	Proof review
●	Manual override (logged)
________________________________________
11. Bottle Management Module
Purpose
Prevents asset loss in dairy logistics.
Core Tables
●	bottles
●	bottle_logs
Tracking Types
●	Issued
●	Returned
●	Damaged
Visibility
●	Admin reports
●	Customer bottle balance view
________________________________________
12. Loyalty & Referral Module
Purpose
Drives retention and organic growth.
Core Tables
●	loyalty_points
●	referrals
Referral Rules
●	Unique referral code
●	Wallet reward on success
●	Abuse prevention checks
Loyalty Rules
●	Points per delivery
●	Wallet redeemable
●	Tier-ready (future)
________________________________________
13. Coupon & Offer System
Purpose
Controlled promotions without leakage.
Core Tables
●	coupons
●	coupon_usages
Controls
●	Usage limits
●	User-level restrictions
●	Free-sample exclusion logic
________________________________________
14. Marketing & Notification Module
Purpose
Automated engagement across lifecycle.
Core Tables
●	notifications
●	banners
Channels
●	Push
●	SMS
●	WhatsApp
●	Email
Campaign Types
●	Wallet recharge reminders
●	Subscription renewals
●	Offers
●	Free sample prompts
________________________________________
15. Analytics & Tracking Module
Purpose
Growth, performance, and operational visibility.
Core Table
●	tracking_events
Events Tracked
●	Product views
●	Add to cart
●	Checkout
●	Purchase
●	Subscription lifecycle
●	Delivery success rate
Integrations
●	Google Tag Manager
●	Meta Pixel
●	Google Ads
________________________________________
16. Admin Control Panel
Modules
●	User Management
●	Catalog & Collections
●	Zones & Drivers
●	Subscriptions
●	Delivery Proof Review
●	Wallet & Refunds
●	Marketing Campaigns
●	Reports & Exports
Admin Safeguards
●	Role-based permissions
●	Action logs
●	Override audit trail
________________________________________
17. Security & Abuse Prevention
Measures
●	OTP + device fingerprint
●	Free sample phone hash lock
●	Coupon abuse detection
●	Delivery proof enforcement
●	Role-based access control
________________________________________
18. Final System Outcome
FreshTick delivers:
✔ Dairy-grade delivery reliability
✔ Subscription-first scalable commerce
✔ Operational control over logistics
✔ Growth-ready marketing & analytics
✔ Enterprise-level architecture

