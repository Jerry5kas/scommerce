FreshTick – Final Technology Stack & Deployment Documentation
1. Document Purpose
This document formally confirms and describes the final, approved technology stack and deployment architecture for the FreshTick platform.
It is intended for:
●	Clients & stakeholders
●	Technical reviewers
●	Internal engineering reference
The architecture prioritizes cost efficiency, operational reliability, security, SEO readiness, and long-term scalability, specifically tailored for scheduled commerce (subscription-based delivery).
________________________________________
2. Final Architecture Confirmation
The FreshTick platform will be deployed using a single VPS, single repository architecture, with logical separation at the application level.
This decision is deliberate and based on:
●	Predictable subscription traffic
●	Daily scheduled execution
●	Controlled operational load
●	Cost optimization
This architecture is production-ready and appropriate for FreshTick’s current and near-future scale.
________________________________________
3. Hosting & Infrastructure Strategy
3.1 Hosting Provider
●	Hostinger VPS – KVM 4 Plan
3.2 Deployment Model
●	Single VPS
●	Single Laravel repository
●	One database (MySQL)
●	One deployment pipeline
3.3 Why Single VPS Is Sufficient
●	Subscription-based orders (no flash-sale spikes)
●	Predictable daily traffic patterns
●	Cron-driven order generation
●	Queue-based background jobs
This ensures stable performance while keeping infrastructure costs low.
________________________________________
4. Repository Strategy
4.1 Single Repository (Laravel)
A single Laravel repository acts as the core system and contains:
●	Customer Web Application
●	Admin Panel
●	Customer APIs
●	Driver APIs
This avoids business-logic duplication and ensures data consistency across all platforms.
________________________________________
5. Application Layer Separation
5.1 Layout-Based UI Separation
Two primary layouts exist within the same repository:
●	Customer Layout (web.blade.php)
●	Admin Layout (admin.blade.php)
Layout selection is controlled by routes and middleware, not by frontend logic.
________________________________________
5.2 Routing Strategy
Customer Web Routes
●	Default entry point (/)
●	SEO enabled
●	Marketing and analytics enabled
●	Uses customer layout
Admin Routes
●	Prefixed with /admin
●	Protected by authentication and RBAC middleware
●	Uses admin layout
●	Excluded from search engine indexing
Driver API Routes
●	Prefixed with /api/v1/driver
●	Token-based authentication
●	Stateless
●	Accessible only by the Flutter Driver App
________________________________________
6. Backend Technology Stack
6.1 Framework
●	Laravel (PHP)
6.2 Role of Laravel
Laravel acts as:
●	Admin Panel
●	Core business engine
●	API backend for customer web and driver mobile app
6.3 Why Laravel Is the Right Choice
●	Stateful, rule-heavy subscription logic
●	Native cron and queue support
●	ACID-safe financial operations
●	Strong RBAC via middleware and policies
●	Mature ecosystem and long-term maintainability
This makes Laravel ideal for scheduled commerce, not flash-based eCommerce.
________________________________________
7. Database Layer
7.1 Database Technology
●	MySQL (InnoDB)
7.2 Why MySQL
●	ACID compliance for wallet and payments
●	Strong relational integrity
●	Accurate subscription billing
●	Order → Delivery → Proof linkage
●	Audit-friendly reporting
MySQL is the single source of truth for all transactional data.
________________________________________
8. Frontend Architecture
8.1 Customer Web Interface
●	SEO-focused
●	Marketing and lead-generation oriented
●	Integrated with GTM, GA4, Meta Ads, Google Ads
●	GoKwik login and checkout
●	Subscription onboarding and account management
8.2 Admin Panel
●	Operational dashboards
●	User, zone, driver, and delivery management
●	Wallet and refund control
●	Reporting and audit tools
Admin access is fully RBAC-controlled.
________________________________________
9. Driver Mobile Application
9.1 Technology
●	Flutter (Driver-only application)
9.2 Purpose
●	Assigned delivery management
●	Live GPS tracking
●	Delivery proof capture (camera)
●	Bottle return entry
●	Offline-first execution
9.3 Backend Communication
The Driver App communicates only with:
/api/v1/driver/*

●	Token-based authentication
●	No access to customer or admin routes
________________________________________
10. Real-Time & Notification Layer
10.1 Real-Time Services
●	Firebase (selective usage)
Used only for:
●	Live GPS tracking
●	Push notifications
Firebase is not used as the system of record.
10.2 Notifications
●	SMS (OTP, alerts)
●	WhatsApp (wallet reminders)
●	Push notifications (delivery updates)
●	Email (admin alerts)
________________________________________
11. Media Storage
●	External object storage with CDN
●	Used for delivery proof images
●	Reduces VPS IO load
●	Improves performance and scalability
________________________________________
12. Security Architecture
Even with a single server deployment, security is enforced through:
●	Route isolation
●	Middleware enforcement
●	Role-Based Access Control (RBAC)
●	Token-based API authentication
●	Admin routes excluded from SEO
Same server does not mean same access.
________________________________________
13. Scalability & Upgrade Path
This architecture supports future growth through:
●	Vertical VPS scaling
●	API versioning
●	Additional mobile apps
●	Gradual service extraction if required
No architectural rewrite is required for scaling.
________________________________________
14. Final Approval Statement
This technology stack and deployment architecture is:
●	Cost-efficient
●	Secure
●	Operationally reliable
●	SEO and marketing ready
●	Scalable without rewrite
This document represents the final, approved technical direction for the FreshTick platform.


