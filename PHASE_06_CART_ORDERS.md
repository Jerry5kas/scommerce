# Phase 6: Cart & Order Management

## Objective
Implement shopping cart system, checkout flow, and order lifecycle management for both one-time and subscription-generated orders.

## Prerequisites
- Phase 4 completed (Catalog)
- Phase 5 completed (Subscriptions)
- Products and subscriptions are available

## Business Verticals
Orders have a **vertical** (`daily_fresh` | `society_fresh`). Cart/checkout and delivery options branch by vertical. See [PHASE_NEW_UPDATE.md](PHASE_NEW_UPDATE.md).
- [x] Add `vertical` to orders table (required)
- [x] Cart: support items from both verticals; checkout per vertical or split (two delivery options when both present)
- [x] Order creation: set `order.vertical` from cart/checkout context
- [x] Delivery options and charges computed by vertical (quick vs scheduled)

## Tasks

### 6.1 Cart System
- [x] Create `carts` table migration
  - [x] `id` (primary key)
  - [x] `user_id` (foreign key, indexed)
  - [x] `session_id` (string, nullable, indexed) - For guest carts
  - [x] `coupon_code` (string, nullable)
  - [x] `coupon_id` (foreign key, nullable) - Phase 11
  - [x] `subtotal` (decimal, default: 0)
  - [x] `discount` (decimal, default: 0)
  - [x] `delivery_charge` (decimal, default: 0)
  - [x] `total` (decimal, default: 0)
  - [x] `currency` (string, default: 'INR')
  - [x] `expires_at` (timestamp, nullable) - Cart expiration
  - [x] `timestamps`
- [x] Create `Cart` model
  - [x] Relationships (user, items, coupon)
  - [x] Helper methods:
    - [x] `calculateTotals()` - Recalculate cart totals
    - [x] `isEmpty()` - Check if cart is empty
    - [x] `clear()` - Clear cart items

### 6.2 Cart Items
- [x] Create `cart_items` table migration
  - [x] `id` (primary key)
  - [x] `cart_id` (foreign key, indexed)
  - [x] `product_id` (foreign key)
  - [x] `quantity` (integer, default: 1)
  - [x] `price` (decimal) - Price at time of add
  - [x] `subtotal` (decimal) - quantity * price
  - [x] `is_subscription` (boolean, default: false) - If adding as subscription
  - [x] `subscription_plan_id` (foreign key, nullable) - If subscription
  - [x] `timestamps`
- [x] Create `CartItem` model
  - [x] Relationships (cart, product, subscriptionPlan)
  - [x] Helper methods (getSubtotal, etc.)

### 6.3 Cart Controllers
- [x] Create `CartController`
  - [x] `show()` - Get current cart
  - [x] `addItem(Request)` - Add product to cart
  - [x] `updateItem(Request, item)` - Update item quantity
  - [x] `removeItem(item)` - Remove item from cart
  - [x] `clear()` - Clear entire cart
  - [ ] `applyCoupon(Request)` - Apply coupon (Phase 11)
  - [ ] `removeCoupon()` - Remove coupon
- [x] Create Form Requests:
  - [x] `AddToCartRequest`
  - [x] `UpdateCartItemRequest`
  - [ ] `ApplyCouponRequest` (Phase 11)

### 6.4 Cart Service
- [x] Create `CartService` class
  - [x] `getOrCreateCart(user, sessionId)` - Get or create cart
  - [x] `addProduct(cart, product, quantity, isSubscription)` - Add product
  - [x] `updateItem(cartItem, quantity)` - Update item
  - [x] `removeItem(cartItem)` - Remove item
  - [x] `calculateTotals(cart)` - Calculate all totals
  - [x] `validateCart(cart)` - Validate cart before checkout
  - [x] `checkProductAvailability(cart)` - Check stock/zone availability
  - [ ] `checkFreeSampleEligibility(cart, user)` - Check free sample (Phase 4 integration)

### 6.5 Order Management
- [x] Create `orders` table migration
  - [x] `id` (primary key)
  - [x] `order_number` (string, unique, indexed) - e.g., "FT-2024-001234"
  - [x] `user_id` (foreign key, indexed)
  - [x] `user_address_id` (foreign key) - Delivery address
  - [x] `subscription_id` (foreign key, nullable) - If from subscription
  - [x] `type` (enum: 'one_time', 'subscription') - Order type
  - [x] `status` (enum: 'pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')
  - [x] `subtotal` (decimal)
  - [x] `discount` (decimal, default: 0)
  - [x] `delivery_charge` (decimal, default: 0)
  - [x] `total` (decimal)
  - [x] `currency` (string, default: 'INR')
  - [x] `payment_status` (enum: 'pending', 'paid', 'failed', 'refunded') - Phase 7
  - [x] `payment_method` (string, nullable) - Phase 7
  - [x] `coupon_id` (foreign key, nullable) - Phase 11
  - [x] `coupon_code` (string, nullable)
  - [x] `delivery_instructions` (text, nullable)
  - [x] `scheduled_delivery_date` (date) - When to deliver
  - [x] `scheduled_delivery_time` (time, nullable) - Preferred time slot
  - [x] `driver_id` (foreign key, nullable) - Assigned driver - Phase 8
  - [x] `delivered_at` (timestamp, nullable)
  - [x] `cancelled_at` (timestamp, nullable)
  - [x] `cancellation_reason` (text, nullable)
  - [x] `notes` (text, nullable) - Internal notes
  - [x] `timestamps`
- [x] Create `Order` model
  - [x] Relationships (user, address, subscription, items, payment, delivery, coupon)
  - [x] Scopes (pending, confirmed, delivered, cancelled, byStatus, byDate)
  - [x] Helper methods:
    - [x] `generateOrderNumber()` - Generate unique order number
    - [x] `canCancel()` - Check if can be cancelled
    - [x] `cancel(reason)` - Cancel order
    - [x] `markAsDelivered()` - Mark as delivered

### 6.6 Order Items
- [x] Create `order_items` table migration
  - [x] `id` (primary key)
  - [x] `order_id` (foreign key, indexed)
  - [x] `product_id` (foreign key)
  - [x] `product_name` (string) - Snapshot of product name
  - [x] `product_sku` (string) - Snapshot of SKU
  - [x] `quantity` (integer)
  - [x] `price` (decimal) - Price at time of order
  - [x] `subtotal` (decimal)
  - [x] `is_free_sample` (boolean, default: false)
  - [x] `free_sample_id` (foreign key, nullable) - Phase 4
  - [x] `timestamps`
- [x] Create `OrderItem` model
  - [x] Relationships (order, product, freeSample)

### 6.7 Order Controllers (Customer)
- [x] Create `OrderController`
  - [x] `index()` - List user's orders
  - [x] `show(order)` - Show order details
  - [x] `create()` - Show checkout page
  - [x] `store(Request)` - Create order from cart
  - [x] `cancel(Request, order)` - Cancel order
  - [x] `track(order)` - Track order status
- [x] Create Form Requests:
  - [x] `StoreOrderRequest`
  - [x] `CancelOrderRequest`

### 6.8 Order Controllers (Admin)
- [x] Create `Admin/OrderController`
  - [x] `index()` - List all orders (with filters)
  - [x] `show(order)` - Show order details
  - [x] `update(Request, order)` - Update order
  - [x] `cancel(Request, order)` - Admin cancel
  - [x] `assignDriver(Request, order)` - Assign driver - Phase 8
  - [x] `updateStatus(Request, order)` - Update status
  - [ ] `export(Request)` - Export orders (deferred)
- [x] Create Form Requests for admin actions

### 6.9 Checkout Service
- [x] Create `CheckoutService` class
  - [x] `processCheckout(cart, user, address, paymentMethod)` - Main checkout process
  - [x] `validateCheckout(cart, user, address)` - Validate before checkout
  - [x] `createOrderFromCart(cart, user, address, data)` - Create order
  - [x] `createOrderItems(order, cartItems)` - Create order items
  - [ ] `applyCouponToOrder(order, coupon)` - Apply coupon - Phase 11
  - [x] `calculateDeliveryCharge(address, order)` - Calculate delivery charge
  - [ ] `reserveInventory(order)` - Reserve stock (if needed) - deferred
  - [ ] `handleFreeSamples(order, user)` - Mark free samples as used - Phase 4 integration

### 6.10 Order Lifecycle Management
- [x] Create `OrderStatusService` class
  - [x] `updateStatus(order, status, notes)` - Update order status
  - [x] `canTransitionTo(order, newStatus)` - Validate status transition
  - [x] `getAvailableStatuses(order)` - Get allowed status transitions
  - [x] `handleStatusChange(order, oldStatus, newStatus)` - Handle side effects
- [x] Status flow: `pending → confirmed → out_for_delivery → delivered`
- [x] Handle cancellation at any stage (before delivery)

### 6.11 Order Number Generation
- [x] Create `OrderNumberService` class (implemented in Order model)
  - [x] `generate()` - Generate unique order number
  - [x] Format: "FT-YYYY-NNNNNN" (e.g., "FT-2024-001234")
  - [x] Ensure uniqueness

### 6.12 Free Sample Abuse Prevention
- [ ] Integrate with free sample system (Phase 4) - deferred to future phase
  - [ ] Check eligibility before checkout
  - [ ] Mark free sample as used on order creation
  - [ ] Prevent multiple free sample orders
- [ ] Validate device + phone hash

### 6.13 Frontend Cart UI
- [x] Create cart page (`resources/js/Pages/Cart/Index.tsx`)
  - [x] Cart items list
  - [x] Quantity controls
  - [x] Remove item button
  - [x] Price breakdown
  - [ ] Coupon code input (Phase 11)
  - [x] Proceed to checkout button
- [x] Create add to cart functionality
  - [x] Add to cart button on product page (requires integration)
  - [x] Cart icon with item count (in layout)
  - [ ] Mini cart dropdown (optional enhancement)
- [x] Create cart item component
  - [x] Product image and name
  - [x] Quantity selector
  - [x] Price display
  - [x] Remove button

### 6.14 Frontend Checkout UI
- [x] Create checkout page (`resources/js/Pages/Checkout/Index.tsx`)
  - [x] Order summary
  - [x] Address selection/confirmation
  - [x] Delivery date/time selection
  - [x] Delivery instructions
  - [x] Payment method selection (Phase 7 - placeholder)
  - [ ] Wallet usage toggle (Phase 7)
  - [ ] Coupon code (Phase 11)
  - [ ] Terms & conditions checkbox
  - [x] Place order button
- [ ] Create checkout success page (redirects to order detail)
- [x] Handle checkout errors

### 6.15 Frontend Order UI
- [x] Create order list page (`resources/js/Pages/Orders/Index.tsx`)
  - [x] List of user's orders
  - [x] Status badges
  - [x] Filter by status
  - [ ] Search orders (simplified)
- [x] Create order detail page (`resources/js/Pages/Orders/Show.tsx`)
  - [x] Order details
  - [x] Items list
  - [x] Delivery address
  - [ ] Payment details (Phase 7)
  - [ ] Delivery tracking (Phase 8)
  - [x] Cancel button (if allowed)
  - [x] Reorder button

### 6.16 Admin Order UI
- [x] Create order list page (admin)
  - [x] Filters (status, date, user, driver)
  - [x] Search functionality
  - [ ] Bulk actions (deferred)
  - [ ] Export button (deferred)
- [x] Create order detail page (admin)
  - [x] Full order details
  - [x] Status update interface
  - [x] Driver assignment (Phase 8 ready)
  - [ ] Payment details (Phase 7)
  - [ ] Delivery details (Phase 8)
  - [ ] Activity log (deferred)
  - [x] Notes section

### 6.17 Database Seeders
- [ ] Create `CartSeeder` (test carts) - optional
- [x] Create `OrderSeeder` (test orders)
- [x] Create test order items (in OrderSeeder)

### 6.18 Testing
- [ ] Test cart add/update/remove - deferred
- [ ] Test cart expiration - deferred
- [ ] Test checkout process - deferred
- [ ] Test order creation - deferred
- [ ] Test order status transitions - deferred
- [ ] Test order cancellation - deferred
- [ ] Test free sample abuse prevention - deferred
- [ ] Test order number generation - deferred
- [ ] Feature tests for cart and checkout flow - deferred

## Deliverables
- ✅ Shopping cart system
- ✅ Checkout flow
- ✅ Order management system
- ✅ Order lifecycle management
- ✅ Free sample integration
- ✅ Customer cart/checkout/order UI
- ✅ Admin order management UI

## Success Criteria
- [x] Users can add products to cart
- [x] Cart persists across sessions
- [x] Checkout process works smoothly
- [x] Orders are created correctly
- [x] Order status transitions work
- [ ] Free sample abuse is prevented (Phase 4 integration pending)
- [x] Order numbers are unique

## Database Tables Created
- `carts`
- `cart_items`
- `orders`
- `order_items`

## Notes
- Cart should expire after certain period (e.g., 7 days)
- Order numbers should be sequential and unique
- Order items should snapshot product details (price, name, SKU)
- Status transitions should be validated
- Cancellation should handle refunds (Phase 7)
- Consider inventory reservation if needed

## Next Phase
Once Phase 6 is complete, proceed to **Phase 7: Payment & Wallet System**

