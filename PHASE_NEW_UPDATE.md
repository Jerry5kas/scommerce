# Freshtick: Two Business Verticals — Plan & Phase Updates

## 1. Business Model Definition

Freshtick operates under **two distinct verticals** (like Zepto: Zepto Fresh / Mall / Electronics; Swiggy: Food / Mart):

| Vertical | Name | Commerce Type | Delivery | Typical Products | Mindset |
|----------|------|---------------|----------|------------------|---------|
| **Daily Fresh** | Daily Fresh | Quick commerce | Fast (e.g. 30 min – 2 hr) | Packaged/pouch milk, curd, paneer; on-demand | Convenience & price |
| **Society Fresh** | Society Fresh | Scheduled commerce | Fixed slots (e.g. 5–8 AM daily) | Bottled milk, subscription milk, add-ons | Trust & quality |

- **Daily Fresh** = Instamart/Zepto-style quick delivery, cart-based, one-time or repeat orders.
- **Society Fresh** = Subscription-first, scheduled delivery, bottle returns, route-based.

---

## 2. What We Require (Summary)

### 2.1 Data Model

- **Business vertical enum** used across zones, catalog, orders, subscriptions, delivery.
- **Zones**: Each zone declares which vertical(s) it serves (`daily_fresh`, `society_fresh`, or both).
- **Catalog (categories, collections, products)**: Each entity is tagged with vertical(s) so we filter by "Daily Fresh" or "Society Fresh".
- **Orders**: Every order has a `vertical` (daily_fresh | society_fresh); fulfillment and delivery logic branch on this.
- **Subscriptions**: Society Fresh only (or primary); subscription module is Society Fresh.
- **Cart**: Single cart; line items are tagged by vertical; checkout can show two delivery options (quick vs scheduled) when both apply.
- **Drivers**: Can be shared or separated; optionally `driver_type` or assignment rules by vertical (quick riders vs route-based).

### 2.2 Application Logic

- **Location/zone**: After pincode/address, resolve which vertical(s) are available in that zone.
- **Catalog**: Filter categories/collections/products by selected vertical (and zone).
- **Checkout**: Compute delivery options and charges by vertical (quick vs scheduled).
- **Admin**: Filter and manage zones, catalog, and orders by vertical.

### 2.3 UI/UX

- **Home**: Two clear entry points — **Daily Fresh** and **Society Fresh** (tabs, sections, or routes e.g. `/daily-fresh`, `/society-fresh`).
- **Navigation**: User can switch vertical; catalog, cart, and checkout reflect the chosen vertical (or show both where relevant).
- **URLs**: Optional prefix or segment by vertical (e.g. `/daily-fresh/products`, `/society-fresh/subscription`).

---

## 3. What We Need to Change (By Phase)

### Phase 1 (Foundation)
- **No schema change.** Add config/app constants for verticals (e.g. `VERTICAL_DAILY_FRESH`, `VERTICAL_SOCIETY_FRESH`) and a helper or enum used everywhere.

### Phase 2 (Authentication)
- **No structural change.** Same user can use both verticals; one account, one set of addresses. Optional: store "last selected vertical" in session for UX.

### Phase 3 (Location & Zones) — **MAJOR**
- **Zones table**: Add `verticals` (json array, e.g. `["daily_fresh","society_fresh"]`) or `supports_daily_fresh` + `supports_society_fresh` (booleans). Default: both true for backward compatibility.
- **Zone model**: Scopes e.g. `scopeForDailyFresh()`, `scopeForSocietyFresh()`; helper `supportsVertical(string $vertical)`.
- **LocationService**: When resolving zone, return which vertical(s) are available for that zone/address.
- **UI**: Location selection (or post-login flow) can show "We serve Daily Fresh & Society Fresh at your location" or let user pick default vertical for that address.

### Phase 4 (Catalog) — **MAJOR**
- **Categories table**: Add `vertical` (string, e.g. `daily_fresh`, `society_fresh`, or `both`) or `verticals` (json). Index for filtering.
- **Collections table**: Same — `vertical` or `verticals`.
- **Products table**: Same — `vertical` or `verticals`.
- **Models**: Scopes e.g. `scopeForVertical($vertical)`; ensure all catalog queries filter by vertical (and zone).
- **product_zones**: No change; zone-level availability stays. Filter products by vertical first, then by zone.
- **Admin**: Category/Collection/Product CRUD must set vertical; list/filter by vertical.
- **Customer catalog**: Home and listing pages filter by selected vertical (and zone).

### Phase 5 (Subscriptions)
- **Subscriptions**: Society Fresh only. Subscription model/table can have `vertical` default `society_fresh` for clarity and future-proofing.
- **UI**: Subscription flows live under Society Fresh (e.g. `/society-fresh/subscription` or `/subscription` with Society Fresh context).

### Phase 6 (Cart & Orders) — **MAJOR**
- **Orders table**: Add `vertical` (enum: `daily_fresh`, `society_fresh`). Required.
- **Order items**: Inherit order’s vertical (no extra column needed unless we allow mixed vertical in one order — not recommended).
- **Cart**: One cart; each line item is tied to a product (hence vertical). If cart has items from both verticals, checkout can show two orders or force user to choose (e.g. "Delivery today – Daily Fresh" vs "Scheduled – Society Fresh"). Simpler: one checkout per vertical; cart can show two sections and two "Checkout" actions.
- **Delivery options**: Compute by vertical (quick slots for Daily Fresh, scheduled slots for Society Fresh).

### Phase 7 (Payment / Wallet)
- **No vertical on payment record required.** Optional: `vertical` on transaction for reporting. Same wallet/balance can be used for both verticals.

### Phase 8 (Delivery)
- **Delivery/Slot logic**: Branch by order’s `vertical` — quick delivery for Daily Fresh, scheduled slots for Society Fresh.
- **Drivers**: Optional `driver_type` or assignment by vertical (e.g. quick riders vs route-based); or same pool with different assignment rules.

### Phase 9 (Bottles)
- **Society Fresh**: Bottle return and deposit; link to Society Fresh orders/subscriptions. Daily Fresh typically no bottle return.

### Phases 10–16
- **Loyalty, coupons, marketing, analytics, admin, driver app**: Where relevant, filter or segment by `vertical` (e.g. reports per vertical, admin filters, driver app showing only Society Fresh or Daily Fresh orders).

---

## 4. Major Modifications Summary

| Area | Change |
|------|--------|
| **Config / Enum** | Add `business_vertical` enum or config keys: `daily_fresh`, `society_fresh`. Use everywhere we branch by vertical. |
| **Zones** | Add `verticals` (json) or two booleans; Zone model scopes and `supportsVertical()`. |
| **Categories** | Add `vertical` (or `verticals`); scope `forVertical()`. |
| **Collections** | Add `vertical` (or `verticals`); scope `forVertical()`. |
| **Products** | Add `vertical` (or `verticals`); scope `forVertical()`. |
| **Orders** | Add `vertical`; set from cart/checkout context. |
| **Cart** | Support cart items from both verticals; checkout per vertical or split UI. |
| **LocationService** | Return available vertical(s) for an address/zone. |
| **Customer UI** | Home: Daily Fresh + Society Fresh entry points; catalog and flows filtered by vertical. |
| **Admin** | All catalog and order screens filter/create by vertical; zone screens show which verticals are supported. |
| **Driver** | Optional: driver type or assignment rules by vertical. |

---

## 5. Implementation Order (Recommended)

1. **Introduce vertical in config and code**
   - Add `config/business.php` (or use existing `app.php`) with vertical constants.
   - Add `App\Enums\BusinessVertical` (DailyFresh, SocietyFresh) and use it in new code.

2. **Phase 3 change: Zones**
   - Migration: add `verticals` (or two booleans) to `zones`.
   - Update Zone model and LocationService; update admin zone form and list.

3. **Phase 4 change: Catalog**
   - Migrations: add `vertical` to `categories`, `collections`, `products`.
   - Update models (scopes, fillable); update admin CRUD and customer catalog to filter by vertical.

4. **Customer UI: Two entry points**
   - Home page: Daily Fresh and Society Fresh sections/links.
   - Routing: e.g. `/daily-fresh`, `/society-fresh` or query/session for vertical; catalog and cart respect it.

5. **Phase 6: Cart & Orders**
   - Migration: add `vertical` to `orders`.
   - Checkout and order creation set `order.vertical`; delivery and post-order flows use it.

6. **Subscriptions (Phase 5)**  
   - Treat as Society Fresh only; subscription UI under Society Fresh.

7. **Delivery, drivers, bottles**  
   - Apply vertical where needed (slot type, driver assignment, bottle returns for Society Fresh).

---

## 6. Phase Document Updates (Checklist)

- [x] **PHASE_01_FOUNDATION.md** — Added: Business Verticals note + task for config/enum.
- [x] **PHASE_03_LOCATION_ZONES.md** — Added: Zones support verticals; migration, model scopes, LocationService, admin UI.
- [x] **PHASE_04_CATALOG.md** — Added: Categories, collections, products have vertical; filter by vertical and zone; admin and customer UI.
- [x] **PHASE_05_SUBSCRIPTIONS.md** — Added: Subscriptions are Society Fresh only; optional vertical column.
- [x] **PHASE_06_CART_ORDERS.md** — Added: Orders have vertical; cart/checkout per vertical; delivery options by vertical.
- [x] **PHASE_08_DELIVERY.md** — Added: Delivery/slot logic and driver assignment by order vertical.
- [x] **PHASE_09_BOTTLES.md** — Added: Bottle returns apply to Society Fresh.
- [x] **PHASE_NEW_UPDATE.md** — This file; single source of truth for two-vertical plan.

---

## 7. Open Decisions (Product)

- **One cart or two?** — One cart with items from both verticals, with checkout split by vertical (two delivery options), vs. separate carts per vertical. Recommendation: one cart, two checkout flows (Daily Fresh vs Society Fresh) when both are present.
- **Can one zone serve both verticals?** — Yes, recommended; use `verticals` array on zone.
- **Can a product appear in both verticals?** — Allowed if needed (e.g. same SKU in both); use `verticals` array or `both` for products/categories/collections.
- **Driver pool** — Same drivers for both vs. dedicated (e.g. quick riders vs. route drivers). Can start with same pool and add `driver_type` later.

---

*Last updated: Plan created for two business verticals (Daily Fresh + Society Fresh). Apply phase updates in order above before continuing Phase 4 catalog work.*
