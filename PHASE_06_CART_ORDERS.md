# Phase 6: Cart & Order Management

## Objective
Implement shopping cart system, checkout flow, and order lifecycle management for both one-time and subscription-generated orders.

## Prerequisites
- Phase 4 completed (Catalog)
- Phase 5 completed (Subscriptions)
- Products and subscriptions are available

## Tasks

### 6.1 Cart System
- [ ] Create `carts` table migration
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `session_id` (string, nullable, indexed) - For guest carts
  - [ ] `coupon_code` (string, nullable)
  - [ ] `coupon_id` (foreign key, nullable) - Phase 11
  - [ ] `subtotal` (decimal, default: 0)
  - [ ] `discount` (decimal, default: 0)
  - [ ] `delivery_charge` (decimal, default: 0)
  - [ ] `total` (decimal, default: 0)
  - [ ] `currency` (string, default: 'INR')
  - [ ] `expires_at` (timestamp, nullable) - Cart expiration
  - [ ] `timestamps`
- [ ] Create `Cart` model
  - [ ] Relationships (user, items, coupon)
  - [ ] Helper methods:
    - [ ] `calculateTotals()` - Recalculate cart totals
    - [ ] `isEmpty()` - Check if cart is empty
    - [ ] `clear()` - Clear cart items

### 6.2 Cart Items
- [ ] Create `cart_items` table migration
  - [ ] `id` (primary key)
  - [ ] `cart_id` (foreign key, indexed)
  - [ ] `product_id` (foreign key)
  - [ ] `quantity` (integer, default: 1)
  - [ ] `price` (decimal) - Price at time of add
  - [ ] `subtotal` (decimal) - quantity * price
  - [ ] `is_subscription` (boolean, default: false) - If adding as subscription
  - [ ] `subscription_plan_id` (foreign key, nullable) - If subscription
  - [ ] `timestamps`
- [ ] Create `CartItem` model
  - [ ] Relationships (cart, product, subscriptionPlan)
  - [ ] Helper methods (getSubtotal, etc.)

### 6.3 Cart Controllers
- [ ] Create `CartController`
  - [ ] `show()` - Get current cart
  - [ ] `addItem(Request)` - Add product to cart
  - [ ] `updateItem(Request, item)` - Update item quantity
  - [ ] `removeItem(item)` - Remove item from cart
  - [ ] `clear()` - Clear entire cart
  - [ ] `applyCoupon(Request)` - Apply coupon (Phase 11)
  - [ ] `removeCoupon()` - Remove coupon
- [ ] Create Form Requests:
  - [ ] `AddToCartRequest`
  - [ ] `UpdateCartItemRequest`
  - [ ] `ApplyCouponRequest`

### 6.4 Cart Service
- [ ] Create `CartService` class
  - [ ] `getOrCreateCart(user, sessionId)` - Get or create cart
  - [ ] `addProduct(cart, product, quantity, isSubscription)` - Add product
  - [ ] `updateItem(cartItem, quantity)` - Update item
  - [ ] `removeItem(cartItem)` - Remove item
  - [ ] `calculateTotals(cart)` - Calculate all totals
  - [ ] `validateCart(cart)` - Validate cart before checkout
  - [ ] `checkProductAvailability(cart)` - Check stock/zone availability
  - [ ] `checkFreeSampleEligibility(cart, user)` - Check free sample (Phase 4)

### 6.5 Order Management
- [ ] Create `orders` table migration
  - [ ] `id` (primary key)
  - [ ] `order_number` (string, unique, indexed) - e.g., "FT-2024-001234"
  - [ ] `user_id` (foreign key, indexed)
  - [ ] `user_address_id` (foreign key) - Delivery address
  - [ ] `subscription_id` (foreign key, nullable) - If from subscription
  - [ ] `type` (enum: 'one_time', 'subscription') - Order type
  - [ ] `status` (enum: 'pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')
  - [ ] `subtotal` (decimal)
  - [ ] `discount` (decimal, default: 0)
  - [ ] `delivery_charge` (decimal, default: 0)
  - [ ] `total` (decimal)
  - [ ] `currency` (string, default: 'INR')
  - [ ] `payment_status` (enum: 'pending', 'paid', 'failed', 'refunded') - Phase 7
  - [ ] `payment_method` (string, nullable) - Phase 7
  - [ ] `coupon_id` (foreign key, nullable) - Phase 11
  - [ ] `coupon_code` (string, nullable)
  - [ ] `delivery_instructions` (text, nullable)
  - [ ] `scheduled_delivery_date` (date) - When to deliver
  - [ ] `scheduled_delivery_time` (time, nullable) - Preferred time slot
  - [ ] `driver_id` (foreign key, nullable) - Assigned driver - Phase 8
  - [ ] `delivered_at` (timestamp, nullable)
  - [ ] `cancelled_at` (timestamp, nullable)
  - [ ] `cancellation_reason` (text, nullable)
  - [ ] `notes` (text, nullable) - Internal notes
  - [ ] `timestamps`
- [ ] Create `Order` model
  - [ ] Relationships (user, address, subscription, items, payment, delivery, coupon)
  - [ ] Scopes (pending, confirmed, delivered, cancelled, byStatus, byDate)
  - [ ] Helper methods:
    - [ ] `generateOrderNumber()` - Generate unique order number
    - [ ] `canCancel()` - Check if can be cancelled
    - [ ] `cancel(reason)` - Cancel order
    - [ ] `markAsDelivered()` - Mark as delivered

### 6.6 Order Items
- [ ] Create `order_items` table migration
  - [ ] `id` (primary key)
  - [ ] `order_id` (foreign key, indexed)
  - [ ] `product_id` (foreign key)
  - [ ] `product_name` (string) - Snapshot of product name
  - [ ] `product_sku` (string) - Snapshot of SKU
  - [ ] `quantity` (integer)
  - [ ] `price` (decimal) - Price at time of order
  - [ ] `subtotal` (decimal)
  - [ ] `is_free_sample` (boolean, default: false)
  - [ ] `free_sample_id` (foreign key, nullable) - Phase 4
  - [ ] `timestamps`
- [ ] Create `OrderItem` model
  - [ ] Relationships (order, product, freeSample)

### 6.7 Order Controllers (Customer)
- [ ] Create `OrderController`
  - [ ] `index()` - List user's orders
  - [ ] `show(order)` - Show order details
  - [ ] `create()` - Show checkout page
  - [ ] `store(Request)` - Create order from cart
  - [ ] `cancel(Request, order)` - Cancel order
  - [ ] `track(order)` - Track order status
- [ ] Create Form Requests:
  - [ ] `StoreOrderRequest`
  - [ ] `CancelOrderRequest`

### 6.8 Order Controllers (Admin)
- [ ] Create `Admin/OrderController`
  - [ ] `index()` - List all orders (with filters)
  - [ ] `show(order)` - Show order details
  - [ ] `update(Request, order)` - Update order
  - [ ] `cancel(Request, order)` - Admin cancel
  - [ ] `assignDriver(Request, order)` - Assign driver - Phase 8
  - [ ] `updateStatus(Request, order)` - Update status
  - [ ] `export(Request)` - Export orders
- [ ] Create Form Requests for admin actions

### 6.9 Checkout Service
- [ ] Create `CheckoutService` class
  - [ ] `processCheckout(cart, user, address, paymentMethod)` - Main checkout process
  - [ ] `validateCheckout(cart, user, address)` - Validate before checkout
  - [ ] `createOrderFromCart(cart, user, address, data)` - Create order
  - [ ] `createOrderItems(order, cartItems)` - Create order items
  - [ ] `applyCouponToOrder(order, coupon)` - Apply coupon - Phase 11
  - [ ] `calculateDeliveryCharge(address, order)` - Calculate delivery charge
  - [ ] `reserveInventory(order)` - Reserve stock (if needed)
  - [ ] `handleFreeSamples(order, user)` - Mark free samples as used - Phase 4

### 6.10 Order Lifecycle Management
- [ ] Create `OrderStatusService` class
  - [ ] `updateStatus(order, status, notes)` - Update order status
  - [ ] `canTransitionTo(order, newStatus)` - Validate status transition
  - [ ] `getAvailableStatuses(order)` - Get allowed status transitions
  - [ ] `handleStatusChange(order, oldStatus, newStatus)` - Handle side effects
- [ ] Status flow: `pending → confirmed → out_for_delivery → delivered`
- [ ] Handle cancellation at any stage (before delivery)

### 6.11 Order Number Generation
- [ ] Create `OrderNumberService` class
  - [ ] `generate()` - Generate unique order number
  - [ ] Format: "FT-YYYY-NNNNNN" (e.g., "FT-2024-001234")
  - [ ] Ensure uniqueness

### 6.12 Free Sample Abuse Prevention
- [ ] Integrate with free sample system (Phase 4)
  - [ ] Check eligibility before checkout
  - [ ] Mark free sample as used on order creation
  - [ ] Prevent multiple free sample orders
- [ ] Validate device + phone hash

### 6.13 Frontend Cart UI
- [ ] Create cart page (`resources/js/Pages/Cart/Index.tsx`)
  - [ ] Cart items list
  - [ ] Quantity controls
  - [ ] Remove item button
  - [ ] Price breakdown
  - [ ] Coupon code input (Phase 11)
  - [ ] Proceed to checkout button
- [ ] Create add to cart functionality
  - [ ] Add to cart button on product page
  - [ ] Cart icon with item count
  - [ ] Mini cart dropdown
- [ ] Create cart item component
  - [ ] Product image and name
  - [ ] Quantity selector
  - [ ] Price display
  - [ ] Remove button

### 6.14 Frontend Checkout UI
- [ ] Create checkout page (`resources/js/Pages/Checkout/Index.tsx`)
  - [ ] Order summary
  - [ ] Address selection/confirmation
  - [ ] Delivery date/time selection
  - [ ] Delivery instructions
  - [ ] Payment method selection (Phase 7)
  - [ ] Wallet usage toggle (Phase 7)
  - [ ] Coupon code (Phase 11)
  - [ ] Terms & conditions checkbox
  - [ ] Place order button
- [ ] Create checkout success page
- [ ] Handle checkout errors

### 6.15 Frontend Order UI
- [ ] Create order list page (`resources/js/Pages/Orders/Index.tsx`)
  - [ ] List of user's orders
  - [ ] Status badges
  - [ ] Filter by status
  - [ ] Search orders
- [ ] Create order detail page (`resources/js/Pages/Orders/Show.tsx`)
  - [ ] Order details
  - [ ] Items list
  - [ ] Delivery address
  - [ ] Payment details (Phase 7)
  - [ ] Delivery tracking (Phase 8)
  - [ ] Cancel button (if allowed)
  - [ ] Reorder button

### 6.16 Admin Order UI
- [ ] Create order list page (admin)
  - [ ] Filters (status, date, user, driver)
  - [ ] Search functionality
  - [ ] Bulk actions
  - [ ] Export button
- [ ] Create order detail page (admin)
  - [ ] Full order details
  - [ ] Status update interface
  - [ ] Driver assignment (Phase 8)
  - [ ] Payment details (Phase 7)
  - [ ] Delivery details (Phase 8)
  - [ ] Activity log
  - [ ] Notes section

### 6.17 Database Seeders
- [ ] Create `CartSeeder` (test carts)
- [ ] Create `OrderSeeder` (test orders)
- [ ] Create test order items

### 6.18 Testing
- [ ] Test cart add/update/remove
- [ ] Test cart expiration
- [ ] Test checkout process
- [ ] Test order creation
- [ ] Test order status transitions
- [ ] Test order cancellation
- [ ] Test free sample abuse prevention
- [ ] Test order number generation
- [ ] Feature tests for cart and checkout flow

## Deliverables
- ✅ Shopping cart system
- ✅ Checkout flow
- ✅ Order management system
- ✅ Order lifecycle management
- ✅ Free sample integration
- ✅ Customer cart/checkout/order UI
- ✅ Admin order management UI

## Success Criteria
- [ ] Users can add products to cart
- [ ] Cart persists across sessions
- [ ] Checkout process works smoothly
- [ ] Orders are created correctly
- [ ] Order status transitions work
- [ ] Free sample abuse is prevented
- [ ] Order numbers are unique

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

