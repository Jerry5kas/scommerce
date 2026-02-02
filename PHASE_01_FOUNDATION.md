# Phase 1: Foundation & Infrastructure Setup

## Objective
Establish the core infrastructure, project structure, and foundational configurations for the FreshTick platform. The platform supports **two business verticals**: **Daily Fresh** (quick commerce) and **Society Fresh** (scheduled commerce). See [PHASE_NEW_UPDATE.md](PHASE_NEW_UPDATE.md).

## Prerequisites
- Laravel 12 project initialized
- PHP 8.2+ installed
- MySQL database ready
- Node.js & npm installed

## Tasks

### 1.1 Project Structure Setup
- [x] Verify Laravel 12 installation
- [x] Configure `.env` file with database credentials
- [x] Set up application key
- [x] Configure timezone (Asia/Kolkata or appropriate)
- [x] Set up locale configuration
- [x] Configure queue driver (database recommended for VPS)

### 1.2 Database Configuration
- [x] Create MySQL database
- [x] Configure database connection in `.env`
- [ ] Test database connection
- [x] Set up migration directory structure
- [x] Create base migration for jobs table (if not exists)

### 1.3 Directory Structure
Create organized directory structure:
- [x] `app/Models/` - All Eloquent models
- [x] `app/Http/Controllers/` - Organized by module
  - [x] `Auth/` - Authentication controllers
  - [x] `Admin/` - Admin panel controllers
  - [x] `Api/V1/Driver/` - Driver API controllers
  - [x] `Customer/` - Customer web controllers
- [x] `app/Http/Requests/` - Form request validation
- [x] `app/Http/Middleware/` - Custom middleware
- [x] `app/Policies/` - Authorization policies
- [x] `app/Services/` - Business logic services
- [x] `app/Jobs/` - Queue jobs
- [x] `app/Notifications/` - Notification classes
- [x] `database/factories/` - Model factories
- [x] `database/seeders/` - Database seeders

### 1.4 Routing Structure
- [x] Set up `routes/web.php` for customer routes
- [x] Set up `routes/admin.php` for admin routes (prefixed `/admin`)
- [x] Set up `routes/api.php` for driver API routes (prefixed `/api/v1/driver`)
- [x] Configure route service provider (if needed in Laravel 12)
- [x] Set up route groups with appropriate middleware

### 1.5 Layout System
- [x] Create Inertia root component structure (`resources/views/app.blade.php`)
  - [x] SEO meta tags structure (description, robots)
  - [x] Google Tag Manager integration placeholders
  - [x] Meta Pixel placeholders
  - [x] Google Ads placeholders
- [x] Customer layout (React: `UserLayout.tsx`), Admin layout (React: `AdminLayout.tsx` + `AdminSidebar.tsx`)
- [x] Set up shared layout components in React

### 1.6 Frontend Setup
- [x] Verify Inertia v2 installation
- [x] Configure Vite for React + TypeScript
- [x] Set up Tailwind CSS configuration
- [x] Create base React components structure
  - [x] `resources/js/Components/` - Reusable components
  - [x] `resources/js/Pages/` - Page components
  - [x] `resources/js/Layouts/` - Layout components
- [x] Set up Wayfinder for route generation
- [x] Configure TypeScript paths (`@/` aliases)

### 1.7 Environment Configuration
- [x] Set up environment variables structure:
  - [x] Database credentials
  - [x] Queue configuration
  - [x] Cache configuration (Redis if available)
  - [x] Mail configuration
  - [x] SMS gateway credentials (placeholder)
  - [x] WhatsApp API credentials (placeholder)
  - [x] Firebase credentials (placeholder)
  - [x] Payment gateway credentials (placeholder)
  - [x] Object storage credentials (placeholder)
  - [x] Google Tag Manager ID (placeholder)
  - [x] Meta Pixel ID (placeholder)
  - [x] Google Ads ID (placeholder)

### 1.8 Basic Middleware
- [x] Create `EnsureUserHasLocation` middleware (for Phase 3)
- [x] Create `EnsureUserIsAdmin` middleware (alias: `admin.auth`)
- [x] Create `EnsureUserIsDriver` middleware
- [x] Set up CORS for API routes (Laravel default)
- [ ] Configure rate limiting (optional: throttle in routes)

### 1.9 Service Providers
- [x] Review and configure `AppServiceProvider`
- [ ] Set up custom service providers if needed
- [ ] Configure service container bindings

### 1.10 Queue & Jobs Setup
- [x] Configure queue connection (database)
- [ ] Set up queue worker configuration
- [x] Create base job structure (`App\Jobs\BaseJob`)
- [ ] Test queue functionality

### 1.11 Logging & Error Handling
- [x] Configure logging channels
- [ ] Set up error tracking (optional: Sentry)
- [x] Configure exception handling (419 CSRF redirect)
- [ ] Set up request logging middleware

### 1.12 Testing Foundation
- [x] Set up PHPUnit configuration
- [x] Create base test classes
- [x] Set up test database (sqlite :memory:)
- [ ] Create test helpers/utilities

### 1.13 Code Quality Tools
- [x] Configure Laravel Pint
- [x] Set up ESLint for TypeScript/React
- [x] Configure Prettier
- [ ] Set up pre-commit hooks (optional)

### 1.14 Documentation
- [ ] Create README.md with setup instructions
- [x] Document environment variables (`.env.example`)
- [ ] Create API documentation structure

### 1.15 Business Verticals (Two Models)
- [x] Add config (`config/business.php`) and enum (`App\Enums\BusinessVertical`) for verticals: `daily_fresh`, `society_fresh`
- [x] Use vertical constants across zones, catalog, and orders (Phase 3+)

## Deliverables
- ✅ Fully configured Laravel 12 project
- ✅ Database connection established
- ✅ Routing structure in place
- ✅ Layout system (Customer & Admin)
- ✅ Frontend build pipeline working
- ✅ Environment configuration documented
- ✅ Basic middleware structure
- ✅ Queue system configured
- ✅ Business vertical config/enum (1.15)

## Success Criteria
- [ ] `php artisan serve` runs without errors
- [ ] `npm run dev` compiles successfully
- [ ] Database connection works
- [ ] Routes are accessible
- [ ] Layouts render correctly
- [ ] Queue jobs can be dispatched

## Notes
- Keep configurations flexible for future scaling
- Document all environment variables
- Follow Laravel 12 conventions
- Use Inertia v2 features (deferred props, lazy loading)
- Prepare for SEO from the start
- **Business verticals**: Daily Fresh (quick commerce) and Society Fresh (scheduled commerce) — config/enum must be in place before Zone and Catalog vertical support (Phase 3–4).

## Next Phase
Once Phase 1 is complete, proceed to **Phase 2: Authentication & User Management**

