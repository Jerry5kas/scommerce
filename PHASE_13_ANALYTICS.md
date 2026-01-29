# Phase 13: Analytics & Tracking

## Objective
Implement event tracking system with Google Tag Manager, Meta Pixel, and Google Ads integration for growth and performance visibility.

## Prerequisites
- Phase 4 completed (Catalog)
- Phase 6 completed (Orders)
- Phase 5 completed (Subscriptions)
- All major user flows are working

## Tasks

### 13.1 Event Tracking System
- [ ] Create `tracking_events` table migration
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key, nullable, indexed) - Nullable for anonymous
  - [ ] `session_id` (string, indexed) - Session identifier
  - [ ] `event_name` (string, indexed) - e.g., 'product_view', 'add_to_cart'
  - [ ] `event_category` (string, nullable) - e.g., 'ecommerce', 'engagement'
  - [ ] `event_action` (string, nullable) - e.g., 'view', 'click', 'purchase'
  - [ ] `event_label` (string, nullable) - Additional label
  - [ ] `event_value` (decimal, nullable) - Numeric value
  - [ ] `properties` (json, nullable) - Additional event data
  - [ ] `page_url` (string, nullable)
  - [ ] `page_title` (string, nullable)
  - [ ] `referrer` (string, nullable)
  - [ ] `user_agent` (text, nullable)
  - [ ] `ip_address` (string, nullable)
  - [ ] `device_type` (string, nullable) - 'mobile', 'desktop', 'tablet'
  - [ ] `browser` (string, nullable)
  - [ ] `os` (string, nullable)
  - [ ] `timestamps`
- [ ] Create `TrackingEvent` model
  - [ ] Relationships (user)
  - [ ] Scopes (byEvent, byCategory, byUser, byDate)
  - [ ] Helper methods

### 13.2 Tracking Service
- [ ] Create `TrackingService` class
  - [ ] `track(eventName, properties, user)` - Track event
  - [ ] `trackPageView(url, title, user)` - Track page view
  - [ ] `trackProductView(product, user)` - Track product view
  - [ ] `trackAddToCart(product, quantity, user)` - Track add to cart
  - [ ] `trackCheckout(cart, user)` - Track checkout start
  - [ ] `trackPurchase(order, user)` - Track purchase
  - [ ] `trackSubscription(subscription, user)` - Track subscription
  - [ ] `trackDelivery(delivery, user)` - Track delivery
  - [ ] `trackSearch(query, results, user)` - Track search
  - [ ] `getUserSession(user)` - Get or create session

### 13.3 E-commerce Events
- [ ] Implement standard e-commerce events:
  - [ ] `view_item` - Product view
  - [ ] `add_to_cart` - Add to cart
  - [ ] `remove_from_cart` - Remove from cart
  - [ ] `begin_checkout` - Checkout start
  - [ ] `add_payment_info` - Payment info added
  - [ ] `purchase` - Order completed
  - [ ] `subscribe` - Subscription created
  - [ ] `view_cart` - Cart view
  - [ ] `search` - Product search

### 13.4 Google Tag Manager Integration
- [ ] Set up GTM container
- [ ] Configure GTM ID in `.env`
- [ ] Add GTM script to customer layout
- [ ] Create dataLayer push helper
- [ ] Create `GTMService` class
  - [ ] `push(data)` - Push data to dataLayer
  - [ ] `trackEvent(eventName, data)` - Track event
  - [ ] `trackEcommerce(data)` - Track e-commerce event
- [ ] Implement GTM events for all major actions

### 13.5 Meta Pixel Integration
- [ ] Set up Meta Pixel
- [ ] Configure Pixel ID in `.env`
- [ ] Add Pixel script to customer layout
- [ ] Create `MetaPixelService` class
  - [ ] `track(eventName, data)` - Track event
  - [ ] `trackPageView()` - Track page view
  - [ ] `trackViewContent(product)` - Track product view
  - [ ] `trackAddToCart(product, quantity)` - Track add to cart
  - [ ] `trackInitiateCheckout(cart)` - Track checkout
  - [ ] `trackPurchase(order)` - Track purchase
  - [ ] `trackSubscribe(subscription)` - Track subscription
- [ ] Implement Meta Pixel events

### 13.6 Google Ads Integration
- [ ] Set up Google Ads conversion tracking
- [ ] Configure conversion IDs in `.env`
- [ ] Add Google Ads script to customer layout
- [ ] Create `GoogleAdsService` class
  - [ ] `trackConversion(conversionId, value)` - Track conversion
  - [ ] `trackPurchase(order)` - Track purchase conversion
  - [ ] `trackSubscription(subscription)` - Track subscription conversion
- [ ] Implement conversion tracking

### 13.7 Frontend Tracking
- [ ] Create tracking utility (`resources/js/utils/tracking.ts`)
  - [ ] `trackEvent(name, properties)` - Track event
  - [ ] `trackPageView(url, title)` - Track page view
  - [ ] `trackProductView(product)` - Track product view
  - [ ] `trackAddToCart(product, quantity)` - Track add to cart
  - [ ] `trackCheckout(cart)` - Track checkout
  - [ ] `trackPurchase(order)` - Track purchase
- [ ] Integrate tracking in React components
- [ ] Track user interactions (clicks, scrolls, etc.)

### 13.8 Backend Tracking
- [ ] Integrate tracking in controllers
  - [ ] Product view tracking
  - [ ] Add to cart tracking
  - [ ] Checkout tracking
  - [ ] Purchase tracking
  - [ ] Subscription tracking
  - [ ] Delivery tracking
- [ ] Create tracking middleware (optional)
- [ ] Track API events

### 13.9 Analytics Controllers
- [ ] Create `AnalyticsController` (admin)
  - [ ] `dashboard()` - Analytics dashboard data
  - [ ] `events(Request)` - Get events with filters
  - [ ] `productViews(Request)` - Product view analytics
  - [ ] `cartAnalytics(Request)` - Cart analytics
  - [ ] `conversionFunnel()` - Conversion funnel
  - [ ] `revenue(Request)` - Revenue analytics
  - [ ] `subscriptionAnalytics(Request)` - Subscription analytics
  - [ ] `deliveryAnalytics(Request)` - Delivery analytics
- [ ] Create Form Requests for analytics filters

### 13.10 Analytics Service
- [ ] Create `AnalyticsService` class
  - [ ] `getDashboardData(dateRange)` - Dashboard metrics
  - [ ] `getProductViews(dateRange, filters)` - Product view analytics
  - [ ] `getCartMetrics(dateRange)` - Cart metrics
  - [ ] `getConversionFunnel(dateRange)` - Conversion funnel
  - [ ] `getRevenue(dateRange, groupBy)` - Revenue analytics
  - [ ] `getSubscriptionMetrics(dateRange)` - Subscription metrics
  - [ ] `getDeliveryMetrics(dateRange)` - Delivery metrics
  - [ ] `getUserJourney(user)` - User journey
  - [ ] `getTopProducts(limit, dateRange)` - Top products
  - [ ] `getTopCategories(limit, dateRange)` - Top categories

### 13.11 Reports
- [ ] Create `ReportService` class
  - [ ] `generateSalesReport(dateRange)` - Sales report
  - [ ] `generateProductReport(dateRange)` - Product report
  - [ ] `generateSubscriptionReport(dateRange)` - Subscription report
  - [ ] `generateDeliveryReport(dateRange)` - Delivery report
  - [ ] `generateUserReport(dateRange)` - User report
  - [ ] `exportReport(report, format)` - Export report
- [ ] Create report export functionality (CSV, PDF)

### 13.12 Admin Analytics UI
- [ ] Create analytics dashboard page (admin)
  - [ ] Key metrics cards
  - [ ] Revenue charts
  - [ ] Conversion funnel
  - [ ] Top products
  - [ ] Top categories
  - [ ] User growth chart
  - [ ] Subscription metrics
  - [ ] Delivery success rate
- [ ] Create analytics filters
  - [ ] Date range picker
  - [ ] Zone filter
  - [ ] Product filter
  - [ ] User filter
- [ ] Create report export interface

### 13.13 Data Privacy
- [ ] Implement GDPR compliance (if applicable)
- [ ] Add cookie consent banner
- [ ] Allow users to opt-out of tracking
- [ ] Anonymize IP addresses
- [ ] Implement data retention policies
- [ ] Create privacy policy page

### 13.14 Database Seeders
- [ ] Create `TrackingEventSeeder` (test events)
- [ ] Create sample analytics data

### 13.15 Testing
- [ ] Test event tracking
- [ ] Test GTM integration
- [ ] Test Meta Pixel integration
- [ ] Test Google Ads integration
- [ ] Test analytics queries
- [ ] Test report generation
- [ ] Feature tests for tracking

## Deliverables
- ✅ Event tracking system
- ✅ Google Tag Manager integration
- ✅ Meta Pixel integration
- ✅ Google Ads integration
- ✅ Analytics dashboard
- ✅ Reporting system
- ✅ Admin analytics UI

## Success Criteria
- [ ] Events are tracked correctly
- [ ] GTM dataLayer is populated
- [ ] Meta Pixel events fire correctly
- [ ] Google Ads conversions are tracked
- [ ] Analytics dashboard shows accurate data
- [ ] Reports can be generated and exported
- [ ] Data privacy is respected

## Database Tables Created
- `tracking_events`

## Notes
- Track events both on frontend and backend
- Use standard e-commerce event names
- Ensure data privacy compliance
- Consider data retention policies
- Cache analytics queries for performance
- Use queue for heavy analytics processing
- Anonymize sensitive user data

## Next Phase
Once Phase 13 is complete, proceed to **Phase 14: Admin Control Panel**

