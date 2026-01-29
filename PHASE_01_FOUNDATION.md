# Phase 1: Foundation & Infrastructure Setup

## Objective
Establish the core infrastructure, project structure, and foundational configurations for the FreshTick platform.

## Prerequisites
- Laravel 12 project initialized
- PHP 8.2+ installed
- MySQL database ready
- Node.js & npm installed

## Tasks

### 1.1 Project Structure Setup
- [ ] Verify Laravel 12 installation
- [ ] Configure `.env` file with database credentials
- [ ] Set up application key
- [ ] Configure timezone (Asia/Kolkata or appropriate)
- [ ] Set up locale configuration
- [ ] Configure queue driver (database recommended for VPS)

### 1.2 Database Configuration
- [ ] Create MySQL database
- [ ] Configure database connection in `.env`
- [ ] Test database connection
- [ ] Set up migration directory structure
- [ ] Create base migration for jobs table (if not exists)

### 1.3 Directory Structure
Create organized directory structure:
- [ ] `app/Models/` - All Eloquent models
- [ ] `app/Http/Controllers/` - Organized by module
  - [ ] `Auth/` - Authentication controllers
  - [ ] `Admin/` - Admin panel controllers
  - [ ] `Api/V1/Driver/` - Driver API controllers
  - [ ] `Customer/` - Customer web controllers
- [ ] `app/Http/Requests/` - Form request validation
- [ ] `app/Http/Middleware/` - Custom middleware
- [ ] `app/Policies/` - Authorization policies
- [ ] `app/Services/` - Business logic services
- [ ] `app/Jobs/` - Queue jobs
- [ ] `app/Notifications/` - Notification classes
- [ ] `database/factories/` - Model factories
- [ ] `database/seeders/` - Database seeders

### 1.4 Routing Structure
- [ ] Set up `routes/web.php` for customer routes
- [ ] Set up `routes/admin.php` for admin routes (prefixed `/admin`)
- [ ] Set up `routes/api.php` for driver API routes (prefixed `/api/v1/driver`)
- [ ] Configure route service provider (if needed in Laravel 12)
- [ ] Set up route groups with appropriate middleware

### 1.5 Layout System
- [ ] Create `resources/views/layouts/web.blade.php` (Customer layout)
  - [ ] SEO meta tags structure
  - [ ] Google Tag Manager integration placeholders
  - [ ] Meta Pixel placeholders
  - [ ] Google Ads placeholders
  - [ ] Navigation structure
  - [ ] Footer structure
- [ ] Create `resources/views/layouts/admin.blade.php` (Admin layout)
  - [ ] Admin navigation
  - [ ] Admin sidebar
  - [ ] Admin header
  - [ ] Exclude from SEO (robots meta)
- [ ] Create Inertia root component structure
- [ ] Set up shared layout components in React

### 1.6 Frontend Setup
- [ ] Verify Inertia v2 installation
- [ ] Configure Vite for React + TypeScript
- [ ] Set up Tailwind CSS configuration
- [ ] Create base React components structure
  - [ ] `resources/js/Components/` - Reusable components
  - [ ] `resources/js/Pages/` - Page components
  - [ ] `resources/js/Layouts/` - Layout components
- [ ] Set up Wayfinder for route generation
- [ ] Configure TypeScript paths (`@/` aliases)

### 1.7 Environment Configuration
- [ ] Set up environment variables structure:
  - [ ] Database credentials
  - [ ] Queue configuration
  - [ ] Cache configuration (Redis if available)
  - [ ] Mail configuration
  - [ ] SMS gateway credentials (placeholder)
  - [ ] WhatsApp API credentials (placeholder)
  - [ ] Firebase credentials (placeholder)
  - [ ] Payment gateway credentials (placeholder)
  - [ ] Object storage credentials (placeholder)
  - [ ] Google Tag Manager ID (placeholder)
  - [ ] Meta Pixel ID (placeholder)
  - [ ] Google Ads ID (placeholder)

### 1.8 Basic Middleware
- [ ] Create `EnsureUserHasLocation` middleware (for Phase 3)
- [ ] Create `EnsureUserIsAdmin` middleware
- [ ] Create `EnsureUserIsDriver` middleware
- [ ] Set up CORS for API routes
- [ ] Configure rate limiting

### 1.9 Service Providers
- [ ] Review and configure `AppServiceProvider`
- [ ] Set up custom service providers if needed
- [ ] Configure service container bindings

### 1.10 Queue & Jobs Setup
- [ ] Configure queue connection (database)
- [ ] Set up queue worker configuration
- [ ] Create base job structure
- [ ] Test queue functionality

### 1.11 Logging & Error Handling
- [ ] Configure logging channels
- [ ] Set up error tracking (optional: Sentry)
- [ ] Configure exception handling
- [ ] Set up request logging middleware

### 1.12 Testing Foundation
- [ ] Set up PHPUnit configuration
- [ ] Create base test classes
- [ ] Set up test database
- [ ] Create test helpers/utilities

### 1.13 Code Quality Tools
- [ ] Configure Laravel Pint
- [ ] Set up ESLint for TypeScript/React
- [ ] Configure Prettier
- [ ] Set up pre-commit hooks (optional)

### 1.14 Documentation
- [ ] Create README.md with setup instructions
- [ ] Document environment variables
- [ ] Create API documentation structure

## Deliverables
- ✅ Fully configured Laravel 12 project
- ✅ Database connection established
- ✅ Routing structure in place
- ✅ Layout system (Customer & Admin)
- ✅ Frontend build pipeline working
- ✅ Environment configuration documented
- ✅ Basic middleware structure
- ✅ Queue system configured

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

## Next Phase
Once Phase 1 is complete, proceed to **Phase 2: Authentication & User Management**

