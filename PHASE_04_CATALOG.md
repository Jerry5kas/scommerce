# Phase 4: Catalog & Product Management

## Objective
Implement product catalog system with categories, collections, products, and zone-based visibility. Catalog is filtered by **business vertical** (Daily Fresh or Society Fresh) and zone. See [PHASE_NEW_UPDATE.md](PHASE_NEW_UPDATE.md).

## Prerequisites
- Phase 3 completed (Zone management)
- Zones are configured and active (with verticals support from 3.16)

## Tasks

### 4.1 Category Management
- [x] Create `categories` table migration
  - [x] `id` (primary key)
  - [x] `name` (string)
  - [x] `slug` (string, unique, indexed)
  - [x] `description` (text, nullable)
  - [x] `image` (string, nullable) - Image URL
  - [x] `icon` (string, nullable) - Icon class or URL
  - [x] `display_order` (integer, default: 0)
  - [x] `is_active` (boolean, default: true)
  - [x] `meta_title` (string, nullable) - SEO
  - [x] `meta_description` (text, nullable) - SEO
  - [x] `timestamps`
- [x] Create `Category` model
  - [x] Relationships (products, collections)
  - [x] Scopes (active, ordered)
  - [x] Helper methods (productsCount; slug auto from name in creating)
- [x] **Business verticals**: Migration to add `vertical` (string: `daily_fresh`, `society_fresh`, or `both`) to categories; Category model: fillable, scope `forVertical($vertical)`; Admin form: set vertical when built; Customer: filter by vertical

### 4.2 Collection Management (Hero Banners)
- [x] Create `collections` table migration
  - [x] `id` (primary key)
  - [x] `name` (string)
  - [x] `slug` (string, unique, indexed)
  - [x] `description` (text, nullable)
  - [x] `category_id` (foreign key, nullable)
  - [x] `banner_image` (string) - Hero banner image
  - [x] `banner_mobile_image` (string, nullable)
  - [x] `display_order` (integer, default: 0)
  - [x] `is_active` (boolean, default: true)
  - [x] `starts_at` (timestamp, nullable) - Campaign start
  - [x] `ends_at` (timestamp, nullable) - Campaign end
  - [x] `link_url` (string, nullable) - Optional link
  - [x] `meta_title` (string, nullable)
  - [x] `meta_description` (text, nullable)
  - [x] `timestamps`
- [x] Create `Collection` model
  - [x] Relationships (category, products)
  - [x] Scopes (active, current, ordered)
  - [x] Helper methods (isActive; slug auto from name in creating)
- [x] **Business verticals**: Migration to add `vertical` to collections; Collection model: fillable, scope `forVertical($vertical)`; Admin form: set vertical when built; Customer: filter by vertical

### 4.3 Product Management
- [x] Create `products` table migration
  - [x] `id` (primary key)
  - [x] `name`, `slug` (unique, indexed), `sku` (unique, indexed)
  - [x] `description`, `short_description` (nullable)
  - [x] `category_id` (foreign key), `collection_id` (nullable)
  - [x] `image`, `images` (json, nullable)
  - [x] `price`, `compare_at_price`, `cost_price` (nullable)
  - [x] `stock_quantity`, `is_in_stock`, `is_subscription_eligible`, `requires_bottle`, `bottle_deposit`
  - [x] `is_one_time_purchase`, `min_quantity`, `max_quantity`, `unit`, `weight`
  - [x] `display_order`, `is_active`, `meta_title`, `meta_description`, `timestamps`
- [x] Create `Product` model
  - [x] Relationships (category, collection, zones via product_zones)
  - [x] Scopes (active, inStock, subscriptionEligible, requiresBottle, ordered)
  - [x] Helper methods: `isAvailableInZone(zone)`, `getPriceForZone(zone)`, `canSubscribe()`; slug auto from name
- [x] **Business verticals**: Migration to add `vertical` to products; Product model: fillable, scope `forVertical($vertical)`; Admin form: set vertical when built; All catalog queries filter by vertical (and zone)

### 4.4 Product-Zone Availability
- [x] Create `product_zones` pivot table migration
  - [x] `product_id`, `zone_id` (unique pair), `is_available`, `price_override`, `stock_quantity`, `timestamps`
- [x] ~~Create `ProductZone` model~~ Use pivot with `withPivot`
- [x] Update `Product` model with zones() BelongsToMany; Update `Zone` model with products() BelongsToMany

### 4.5 Product Variants (Optional - for future)
- [ ] Create `product_variants` table migration (if needed)
  - [ ] `id` (primary key)
  - [ ] `product_id` (foreign key)
  - [ ] `name` (string) - e.g., "500ml", "1L"
  - [ ] `sku` (string, unique)
  - [ ] `price` (decimal)
  - [ ] `stock_quantity` (integer)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `timestamps`

### 4.6 Catalog Controllers (Admin)
- [x] Create `Admin/CategoryController`
  - [x] `index()` - List categories (filter by vertical)
  - [x] `store(Request)` - Create category (set vertical)
  - [x] `update(Request, category)` - Update category
  - [x] `destroy(category)` - Delete category
  - [x] `toggleStatus(category)` - Toggle active status
- [x] Create `Admin/CollectionController`
  - [x] `index()` - List collections (filter by vertical)
  - [x] `store(Request)` - Create collection (set vertical)
  - [x] `update(Request, collection)` - Update collection
  - [x] `destroy(collection)` - Delete collection
  - [x] `toggleStatus(collection)` - Toggle active status
- [x] Create `Admin/ProductController`
  - [x] `index()` - List products (filter by vertical and zone)
  - [x] `show(product)` - Show product details
  - [x] `store(Request)` - Create product (set vertical)
  - [x] `update(Request, product)` - Update product
  - [x] `destroy(product)` - Delete product
  - [x] `toggleStatus(product)` - Toggle active status
  - [x] `manageZones(product)` / `updateZones(Request, product)` - Manage zone availability
- [x] Create Form Requests:
  - [x] `StoreCategoryRequest`, `UpdateCategoryRequest`
  - [x] `StoreCollectionRequest`, `UpdateCollectionRequest`
  - [x] `StoreProductRequest`, `UpdateProductRequest`
  - [x] `ManageProductZonesRequest`

### 4.7 Catalog Controllers (Customer)
- [ ] Create `CatalogController`
  - [ ] `index()` - Home page with banners, categories, featured products (filtered by vertical + zone)
  - [ ] `showCategory(category)` - Category page (vertical + zone)
  - [ ] `showCollection(collection)` - Collection page
  - [ ] `showProduct(product)` - Product detail page
  - [ ] `search(Request)` - Product search (vertical + zone)
- [ ] Create `ProductController` (customer)
  - [ ] `index(Request)` - List products (filtered by vertical and zone)
  - [ ] `show(product)` - Product details
  - [ ] `relatedProducts(product)` - Related products (same vertical + zone)
- [ ] Implement vertical + zone-based filtering in all catalog queries

### 4.8 Catalog Service
- [ ] Create `CatalogService` class
  - [ ] `getProductsForZone(zone, vertical, filters)` - Get zone-available products for vertical
  - [ ] `getFeaturedProducts(zone, vertical, limit)` - Featured products
  - [ ] `getRelatedProducts(product, zone, vertical, limit)` - Related products
  - [ ] `searchProducts(query, zone, vertical)` - Search products
  - [ ] `getActiveBanners(zone, vertical)` - Active collection banners for vertical
  - [ ] `getCategoriesWithProducts(zone, vertical)` - Categories with product counts

### 4.9 Free Sample System
- [ ] Create `free_samples` table migration
  - [ ] `id` (primary key)
  - [ ] `product_id` (foreign key)
  - [ ] `user_id` (foreign key, nullable) - If user-specific
  - [ ] `phone_hash` (string, indexed) - Hashed phone
  - [ ] `device_hash` (string, indexed) - Hashed device
  - [ ] `claimed_at` (timestamp)
  - [ ] `is_used` (boolean, default: false)
  - [ ] `timestamps`
- [ ] Create `FreeSample` model
- [ ] Create `FreeSampleService`
  - [ ] `checkEligibility(user, product)` - Check if eligible
  - [ ] `claimSample(user, product)` - Claim free sample
  - [ ] `markAsUsed(sample)` - Mark as used in order
- [ ] Integrate with product display (show "Try Free" button)

### 4.10 Frontend Catalog Pages
- [ ] Create home page (`resources/js/Pages/Home.tsx`)
  - [ ] **Daily Fresh** and **Society Fresh** entry points (tabs/sections or routes `/daily-fresh`, `/society-fresh`)
  - [ ] Hero banners (collections filtered by selected vertical)
  - [ ] Categories grid (by vertical)
  - [ ] Featured products (by vertical + zone)
  - [ ] Free sample popup (conditional)
- [ ] Create category page (`resources/js/Pages/Catalog/Category.tsx`)
  - [ ] Category info (vertical context)
  - [ ] Product grid/list (vertical + zone)
  - [ ] Filters (price, availability)
  - [ ] Sorting
- [ ] Create product detail page (`resources/js/Pages/Catalog/Product.tsx`)
  - [ ] Product images gallery
  - [ ] Product details
  - [ ] Price display
  - [ ] Subscription option (Society Fresh; if eligible)
  - [ ] Add to cart button
  - [ ] Free sample button (if eligible)
  - [ ] Related products (same vertical + zone)
- [ ] Create product search page (vertical + zone)
- [ ] Create collection/banner pages (vertical context)

### 4.11 Admin Catalog Management UI
- [x] Create category management pages
  - [x] Category list (filter by vertical)
  - [x] Category create/edit form (vertical selector)
  - [ ] Image upload (URL only for now)
- [x] Create collection management pages
  - [x] Collection list (filter by vertical)
  - [x] Collection create/edit form (vertical selector)
  - [x] Banner image URL, campaign date picker
- [x] Create product management pages
  - [x] Product list (filter by vertical and zone)
  - [x] Product create/edit form (vertical selector)
  - [x] Image URL; zone availability (manage-zones page)
  - [x] Stock, subscription, bottle settings in form

### 4.12 Cross-sell & Upsell
- [ ] Create `product_relations` table migration
  - [ ] `id` (primary key)
  - [ ] `product_id` (foreign key)
  - [ ] `related_product_id` (foreign key)
  - [ ] `relation_type` (enum: 'cross_sell', 'upsell', 'bundle')
  - [ ] `display_order` (integer, default: 0)
  - [ ] `timestamps`
- [ ] Create `ProductRelation` model
- [ ] Update product detail page to show related products

### 4.13 Image Management
- [ ] Set up object storage integration (S3, DigitalOcean Spaces, etc.)
- [ ] Create `ImageService` class
  - [ ] `uploadImage(file, folder)` - Upload to storage
  - [ ] `deleteImage(path)` - Delete from storage
  - [ ] `resizeImage(path, dimensions)` - Resize images
- [ ] Configure image optimization
- [ ] Set up CDN for images

### 4.14 Database Seeders
- [ ] Create `CategorySeeder` (sample categories)
- [ ] Create `CollectionSeeder` (sample collections/banners)
- [ ] Create `ProductSeeder` (sample products)
- [ ] Assign products to zones
- [ ] Create `FreeSampleSeeder` (test data)

### 4.15 Testing
- [ ] Test category CRUD operations
- [ ] Test collection CRUD operations
- [ ] Test product CRUD operations
- [ ] Test zone-based product filtering
- [ ] Test free sample eligibility
- [ ] Test product search
- [ ] Test related products
- [ ] Feature tests for catalog pages

## Deliverables
- ✅ Category management system
- ✅ Collection (banner) management system
- ✅ Product management system
- ✅ Zone-based product availability
- ✅ Vertical on categories, collections, products (migration + model scope `forVertical`); filter catalog by vertical when building controllers
- [ ] Home: Daily Fresh and Society Fresh entry points (when home page is built)
- ✅ Free sample system (when implemented)
- ✅ Customer catalog UI (vertical-aware when implemented)
- ✅ Admin catalog management UI (vertical filter/selector when implemented)
- ✅ Image management system

## Success Criteria
- [ ] Products can be created and managed
- [ ] Products are filtered by vertical and zone
- [ ] Home has Daily Fresh and Society Fresh entry points
- [ ] Collections display as banners (per vertical)
- [ ] Free sample system works with abuse prevention
- [ ] Product search works (vertical + zone)
- [ ] Images are optimized and served via CDN
- [ ] Catalog is SEO-friendly

## Database Tables Created
- `categories`
- `collections`
- `products`
- `product_zones`
- `product_variants` (optional)
- `free_samples`
- `product_relations`

## Notes
- All product queries must filter by **vertical** (Daily Fresh / Society Fresh) and **zone**
- Categories, collections, and products have a `vertical` field (`daily_fresh`, `society_fresh`, or `both`)
- Home and catalog UI must support switching or selecting vertical (two entry points)
- Images should be optimized before upload
- Free sample eligibility checks device + phone hash
- Product slugs should be SEO-friendly
- Consider caching popular product queries
- Zone-specific pricing can be added later

## Next Phase
Once Phase 4 is complete, proceed to **Phase 5: Subscription Management (Critical)**

