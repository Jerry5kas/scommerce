# Phase 4: Catalog & Product Management

## Objective
Implement product catalog system with categories, collections, products, and zone-based visibility.

## Prerequisites
- Phase 3 completed (Zone management)
- Zones are configured and active

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

### 4.2 Collection Management (Hero Banners)
- [ ] Create `collections` table migration
  - [ ] `id` (primary key)
  - [ ] `name` (string)
  - [ ] `slug` (string, unique, indexed)
  - [ ] `description` (text, nullable)
  - [ ] `category_id` (foreign key, nullable)
  - [ ] `banner_image` (string) - Hero banner image
  - [ ] `banner_mobile_image` (string, nullable)
  - [ ] `display_order` (integer, default: 0)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `starts_at` (timestamp, nullable) - Campaign start
  - [ ] `ends_at` (timestamp, nullable) - Campaign end
  - [ ] `link_url` (string, nullable) - Optional link
  - [ ] `meta_title` (string, nullable)
  - [ ] `meta_description` (text, nullable)
  - [ ] `timestamps`
- [ ] Create `Collection` model
  - [ ] Relationships (category, products)
  - [ ] Scopes (active, current, ordered)
  - [ ] Helper methods (isActive, etc.)

### 4.3 Product Management
- [ ] Create `products` table migration
  - [ ] `id` (primary key)
  - [ ] `name` (string)
  - [ ] `slug` (string, unique, indexed)
  - [ ] `sku` (string, unique, indexed)
  - [ ] `description` (text, nullable)
  - [ ] `short_description` (text, nullable)
  - [ ] `category_id` (foreign key)
  - [ ] `collection_id` (foreign key, nullable)
  - [ ] `image` (string) - Primary image
  - [ ] `images` (json, nullable) - Additional images
  - [ ] `price` (decimal, 2 decimal places)
  - [ ] `compare_at_price` (decimal, nullable) - MRP
  - [ ] `cost_price` (decimal, nullable) - For admin
  - [ ] `stock_quantity` (integer, default: 0)
  - [ ] `is_in_stock` (boolean, default: true)
  - [ ] `is_subscription_eligible` (boolean, default: false)
  - [ ] `requires_bottle` (boolean, default: false)
  - [ ] `bottle_deposit` (decimal, nullable) - If requires bottle
  - [ ] `is_one_time_purchase` (boolean, default: true)
  - [ ] `min_quantity` (integer, default: 1)
  - [ ] `max_quantity` (integer, nullable)
  - [ ] `unit` (string, default: 'piece') - e.g., 'litre', 'kg', 'piece'
  - [ ] `weight` (decimal, nullable) - For shipping
  - [ ] `display_order` (integer, default: 0)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `meta_title` (string, nullable)
  - [ ] `meta_description` (text, nullable)
  - [ ] `timestamps`
- [ ] Create `Product` model
  - [ ] Relationships (category, collection, zones, subscriptions, orderItems)
  - [ ] Scopes (active, inStock, subscriptionEligible, requiresBottle)
  - [ ] Helper methods:
    - [ ] `isAvailableInZone(zone)` - Check zone availability
    - [ ] `getPriceForZone(zone)` - Zone-specific pricing (future)
    - [ ] `canSubscribe()` - Check subscription eligibility

### 4.4 Product-Zone Availability
- [ ] Create `product_zones` pivot table migration
  - [ ] `product_id` (foreign key)
  - [ ] `zone_id` (foreign key)
  - [ ] `is_available` (boolean, default: true)
  - [ ] `price_override` (decimal, nullable) - Zone-specific price
  - [ ] `stock_quantity` (integer, nullable) - Zone-specific stock
  - [ ] `timestamps`
- [ ] Create `ProductZone` model (or use pivot)
- [ ] Update `Product` model with zone relationship

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
- [ ] Create `Admin/CategoryController`
  - [ ] `index()` - List categories
  - [ ] `store(Request)` - Create category
  - [ ] `update(Request, category)` - Update category
  - [ ] `destroy(category)` - Delete category
  - [ ] `toggleStatus(category)` - Toggle active status
- [ ] Create `Admin/CollectionController`
  - [ ] `index()` - List collections
  - [ ] `store(Request)` - Create collection
  - [ ] `update(Request, collection)` - Update collection
  - [ ] `destroy(collection)` - Delete collection
  - [ ] `toggleStatus(collection)` - Toggle active status
- [ ] Create `Admin/ProductController`
  - [ ] `index()` - List products (with filters)
  - [ ] `show(product)` - Show product details
  - [ ] `store(Request)` - Create product
  - [ ] `update(Request, product)` - Update product
  - [ ] `destroy(product)` - Delete product
  - [ ] `toggleStatus(product)` - Toggle active status
  - [ ] `manageZones(Request, product)` - Manage zone availability
- [ ] Create Form Requests:
  - [ ] `StoreCategoryRequest`, `UpdateCategoryRequest`
  - [ ] `StoreCollectionRequest`, `UpdateCollectionRequest`
  - [ ] `StoreProductRequest`, `UpdateProductRequest`

### 4.7 Catalog Controllers (Customer)
- [ ] Create `CatalogController`
  - [ ] `index()` - Home page with banners, categories, featured products
  - [ ] `showCategory(category)` - Category page
  - [ ] `showCollection(collection)` - Collection page
  - [ ] `showProduct(product)` - Product detail page
  - [ ] `search(Request)` - Product search
- [ ] Create `ProductController` (customer)
  - [ ] `index(Request)` - List products (filtered by zone)
  - [ ] `show(product)` - Product details
  - [ ] `relatedProducts(product)` - Related products
- [ ] Implement zone-based filtering in all queries

### 4.8 Catalog Service
- [ ] Create `CatalogService` class
  - [ ] `getProductsForZone(zone, filters)` - Get zone-available products
  - [ ] `getFeaturedProducts(zone, limit)` - Featured products
  - [ ] `getRelatedProducts(product, zone, limit)` - Related products
  - [ ] `searchProducts(query, zone)` - Search products
  - [ ] `getActiveBanners(zone)` - Active collection banners
  - [ ] `getCategoriesWithProducts(zone)` - Categories with product counts

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
  - [ ] Hero banners (collections)
  - [ ] Categories grid
  - [ ] Featured products
  - [ ] Free sample popup (conditional)
- [ ] Create category page (`resources/js/Pages/Catalog/Category.tsx`)
  - [ ] Category info
  - [ ] Product grid/list
  - [ ] Filters (price, availability)
  - [ ] Sorting
- [ ] Create product detail page (`resources/js/Pages/Catalog/Product.tsx`)
  - [ ] Product images gallery
  - [ ] Product details
  - [ ] Price display
  - [ ] Subscription option (if eligible)
  - [ ] Add to cart button
  - [ ] Free sample button (if eligible)
  - [ ] Related products
- [ ] Create product search page
- [ ] Create collection/banner pages

### 4.11 Admin Catalog Management UI
- [ ] Create category management pages
  - [ ] Category list
  - [ ] Category create/edit form
  - [ ] Image upload
- [ ] Create collection management pages
  - [ ] Collection list
  - [ ] Collection create/edit form
  - [ ] Banner image upload
  - [ ] Campaign date picker
- [ ] Create product management pages
  - [ ] Product list (with filters)
  - [ ] Product create/edit form
  - [ ] Image upload (multiple)
  - [ ] Zone availability management
  - [ ] Stock management
  - [ ] Subscription settings
  - [ ] Bottle settings

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
- ✅ Free sample system
- ✅ Customer catalog UI
- ✅ Admin catalog management UI
- ✅ Image management system

## Success Criteria
- [ ] Products can be created and managed
- [ ] Products are filtered by zone
- [ ] Collections display as banners on home page
- [ ] Free sample system works with abuse prevention
- [ ] Product search works
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
- All product queries must filter by zone
- Images should be optimized before upload
- Free sample eligibility checks device + phone hash
- Product slugs should be SEO-friendly
- Consider caching popular product queries
- Zone-specific pricing can be added later

## Next Phase
Once Phase 4 is complete, proceed to **Phase 5: Subscription Management (Critical)**

