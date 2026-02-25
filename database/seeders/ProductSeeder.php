<?php

namespace Database\Seeders;

use App\Enums\BusinessVertical;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Zone;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Product catalogue mapped to their DB category slugs.
     *
     * Structure:
     *  - category   : slug that matches the category already in DB
     *  - vertical   : BusinessVertical value ('society_fresh' | 'daily_fresh' | 'both')
     *  - products[] : each entry represents ONE parent product with ONE or many variants
     *      - name        : product display name
     *      - description : short marketing copy
     *      - image       : primary image path (stored in public/demo)
     *      - bestSeller  : bool – marks the product as featured/bestseller
     *      - variants[]  : size/weight variants with individual prices
     *          - label  : variant display label (e.g. "500g", "1L")
     *          - price  : numeric price (INR)
     *          - unit   : unit string for the products table (g / ml / L / kg)
     *          - weight : decimal weight for the products table
     */
    private array $catalogue = [

        // ─── GHEE ────────────────────────────────────────────────────────────
        [
            'category' => 'ghee',
            'vertical' => 'both',
            'products' => [
                [
                    'name' => 'Cow Ghee',
                    'description' => 'Pure, traditionally churned cow ghee made from fresh cream. Rich aroma, golden colour, and full of essential nutrients.',
                    'image' => '/demo/Ghee.png',
                    'bestSeller' => false,
                    'variants' => [
                        ['label' => '100g', 'price' => 150.00, 'unit' => 'g', 'weight' => 0.100],
                        ['label' => '200g', 'price' => 375.00, 'unit' => 'g', 'weight' => 0.200],
                        ['label' => '500g', 'price' => 750.00, 'unit' => 'g', 'weight' => 0.500, 'bestSeller' => true],
                        ['label' => '1L', 'price' => 1500.00, 'unit' => 'L', 'weight' => 1.000],
                    ],
                ],
            ],
        ],

        // ─── FRESH CURD ──────────────────────────────────────────────────────
        [
            'category' => 'fresh-curd',
            'vertical' => 'both',
            'products' => [
                [
                    'name' => 'Fresh Curd',
                    'description' => 'Thick, creamy curd set fresh every morning from full-fat cow milk. No preservatives, naturally probiotic.',
                    'image' => '/demo/Fresh Curd.png',
                    'bestSeller' => true,
                    'variants' => [
                        ['label' => '500g', 'price' => 40.00, 'unit' => 'g', 'weight' => 0.500],
                        ['label' => '1L', 'price' => 80.00, 'unit' => 'L', 'weight' => 1.000, 'bestSeller' => true],
                    ],
                ],
            ],
        ],

        // ─── PANEER ──────────────────────────────────────────────────────────
        [
            'category' => 'paneer',
            'vertical' => 'society_fresh',
            'products' => [
                [
                    'name' => 'Paneer',
                    'description' => 'Soft, fresh-pressed cottage cheese made daily from whole cow milk. Perfect for curries, grills, and snacks.',
                    'image' => '/demo/panneer.png',
                    'bestSeller' => true,
                    'variants' => [
                        ['label' => '200g', 'price' => 120.00, 'unit' => 'g', 'weight' => 0.200, 'bestSeller' => true],
                    ],
                ],
            ],
        ],

        // ─── BUTTER MILK ─────────────────────────────────────────────────────
        [
            'category' => 'butter-milk',
            'vertical' => 'society_fresh',
            'products' => [
                [
                    'name' => 'Spiced Butter Milk',
                    'description' => 'Chilled, hand-spiced buttermilk with curry leaves, ginger, and green chilli. A refreshing summer staple.',
                    'image' => '/demo/butter milk.png',
                    'bestSeller' => false,
                    'variants' => [
                        ['label' => '200ML', 'price' => 15.00, 'unit' => 'ml', 'weight' => 0.200],
                    ],
                ],
            ],
        ],

        // ─── COUNTRY BUTTER ──────────────────────────────────────────────────
        [
            'category' => 'country-butter',
            'vertical' => 'society_fresh',
            'products' => [
                [
                    'name' => 'Country Butter',
                    'description' => 'Hand-churned country-style butter from fresh, full-cream cow milk. Unsalted and pure — great for cooking and spreading.',
                    'image' => '/demo/butter.png',
                    'bestSeller' => true,
                    'variants' => [
                        ['label' => '100g', 'price' => 100.00, 'unit' => 'g', 'weight' => 0.100],
                        ['label' => '250g', 'price' => 250.00, 'unit' => 'g', 'weight' => 0.250, 'bestSeller' => true],
                        ['label' => '500g', 'price' => 500.00, 'unit' => 'g', 'weight' => 0.500],
                        ['label' => '1kg', 'price' => 1000.00, 'unit' => 'kg', 'weight' => 1.000],
                    ],
                ],
            ],
        ],
    ];

    // ─────────────────────────────────────────────────────────────────────────

    public function run(): void
    {
        $zones = Zone::query()->active()->get();

        foreach ($this->catalogue as $group) {
            /** @var Category $category */
            $category = Category::query()
                ->where('slug', $group['category'])
                ->first();

            if (!$category) {
                $this->command->warn("⚠️  Category [{$group['category']}] not found — skipping.");
                continue;
            }

            foreach ($group['products'] as $productData) {
                $baseSlug = Str::slug($productData['name']);
                $isBestSeller = $productData['bestSeller'] ?? false;

                // The "primary" variant drives the product-level price
                $primaryVariant = $productData['variants'][0];

                // ── Upsert the parent product ────────────────────────────────
                /** @var Product $product */
                $product = Product::query()->updateOrCreate(
                ['slug' => $baseSlug],
                [
                    'name' => $productData['name'],
                    'slug' => $baseSlug,
                    'sku' => $this->buildSku($category->slug, $productData['name']),
                    'description' => $productData['description'],
                    'short_description' => $productData['description'],
                    'category_id' => $category->id,
                    'image' => $productData['image'],
                    'price' => $primaryVariant['price'],
                    'compare_at_price' => null,
                    'stock_quantity' => 200,
                    'is_in_stock' => true,
                    'is_subscription_eligible' => false,
                    'requires_bottle' => false,
                    'is_one_time_purchase' => true,
                    'min_quantity' => 1,
                    'max_quantity' => 20,
                    'unit' => $primaryVariant['unit'],
                    'weight' => $primaryVariant['weight'],
                    'display_order' => 0,
                    'is_active' => true,
                    'vertical' => $group['vertical'],
                ],
                );

                // ── Upsert each variant ──────────────────────────────────────
                foreach ($productData['variants'] as $index => $variant) {
                    $variantSku = $this->buildVariantSku(
                        $category->slug,
                        $productData['name'],
                        $variant['label'],
                    );

                    ProductVariant::query()->updateOrCreate(
                    ['sku' => $variantSku],
                    [
                        'product_id' => $product->id,
                        'name' => $variant['label'],
                        'sku' => $variantSku,
                        'price' => $variant['price'],
                        'stock_quantity' => 200,
                        'is_active' => true,
                    ],
                    );
                }

                // ── Assign product to all active zones ───────────────────────
                $zoneData = [];
                foreach ($zones as $zone) {
                    $zoneData[$zone->id] = [
                        'is_available' => true,
                        'price_override' => null,
                        'stock_quantity' => 200,
                    ];
                }
                $product->zones()->sync($zoneData);

                $this->command->info("✅  Seeded: {$productData['name']} ({$product->variants()->count()} variants)");
            }
        }

        $this->command->newLine();
        $this->command->info('🎉  ProductSeeder finished successfully.');
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /**
     * Build a clean, short SKU for the parent product.
     * e.g. "cow-ghee" in category "ghee" → "GHEE-COW-GHEE"
     */
    private function buildSku(string $categorySlug, string $productName): string
    {
        $prefix = strtoupper(substr(str_replace('-', '', $categorySlug), 0, 4));
        $name = strtoupper(substr(str_replace(' ', '-', $productName), 0, 8));

        return "{$prefix}-{$name}";
    }

    /**
     * Build a unique variant SKU.
     * e.g. "GHEE-COW-GHEE-500G"
     */
    private function buildVariantSku(string $categorySlug, string $productName, string $variantLabel): string
    {
        $base = $this->buildSku($categorySlug, $productName);
        $variant = strtoupper(str_replace([' ', '.'], '', $variantLabel));

        return "{$base}-{$variant}";
    }
}
