<?php

namespace App\Http\Controllers;

use App\Enums\BusinessVertical;
use App\Models\Product;
use App\Services\CatalogService;
use App\Services\FreeSampleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private CatalogService $catalogService,
        private FreeSampleService $freeSampleService
    ) {}

    /**
     * List products page (static page with hardcoded products)
     */
    public function index(Request $request): Response|RedirectResponse
    {
        // This page uses hardcoded products, so we just need to ensure user has location
        // The location middleware already handles this, but we keep it for consistency
        $zone = $this->getUserZone($request);
        if ($zone === null) {
            return redirect()->route('location.select');
        }

        return Inertia::render('products');
    }

    /**
     * Show product details
     */
    public function show(Request $request, Product $product): Response|RedirectResponse
    {
        $vertical = $request->string('vertical', BusinessVertical::DailyFresh->value)->toString();
        if (! in_array($vertical, array_merge(BusinessVertical::values(), ['both']), true)) {
            $vertical = BusinessVertical::DailyFresh->value;
        }

        $zone = $this->getUserZone($request);
        if ($zone === null) {
            return redirect()->route('location.select');
        }

        // Verify product is for this vertical
        if ($product->vertical !== $vertical && $product->vertical !== Product::VERTICAL_BOTH) {
            abort(404);
        }

        // Check if product is available in zone
        if (! $product->isAvailableInZone($zone)) {
            abort(404, 'Product not available in your area.');
        }

        // Get cross-sell and upsell products
        $crossSellProducts = $product->relatedProducts()
            ->wherePivot('relation_type', 'cross_sell')
            ->whereHas('zones', function ($q) use ($zone) {
                $q->where('zones.id', $zone->id)->where('product_zones.is_available', true);
            })
            ->active()
            ->inStock()
            ->orderByPivot('display_order')
            ->limit(6)
            ->get();

        $upsellProducts = $product->relatedProducts()
            ->wherePivot('relation_type', 'upsell')
            ->whereHas('zones', function ($q) use ($zone) {
                $q->where('zones.id', $zone->id)->where('product_zones.is_available', true);
            })
            ->active()
            ->inStock()
            ->orderByPivot('display_order')
            ->limit(4)
            ->get();

        // Check free sample eligibility
        $user = $request->user();
        $isFreeSampleEligible = $this->freeSampleService->checkEligibility($user, $product);

        $product->load(['category:id,name,slug', 'collection:id,name,slug', 'variants']);

        return Inertia::render('catalog/product', [
            'product' => $product,
            'vertical' => $vertical,
            'zone' => $zone->only(['id', 'name', 'code']),
            'crossSellProducts' => $crossSellProducts,
            'upsellProducts' => $upsellProducts,
            'price' => $product->getPriceForZone($zone),
            'isFreeSampleEligible' => $isFreeSampleEligible,
        ]);
    }

    /**
     * Get related products
     */
    public function relatedProducts(Request $request, Product $product): \Illuminate\Http\JsonResponse
    {
        $vertical = $request->string('vertical', BusinessVertical::DailyFresh->value)->toString();
        if (! in_array($vertical, array_merge(BusinessVertical::values(), ['both']), true)) {
            $vertical = BusinessVertical::DailyFresh->value;
        }

        $zone = $this->getUserZone($request);
        if ($zone === null) {
            return response()->json(['products' => []], 422);
        }

        $limit = $request->integer('limit', 8);
        $relatedProducts = $this->catalogService->getRelatedProducts($product, $zone, $vertical, $limit);

        return response()->json([
            'products' => $relatedProducts,
        ]);
    }

    /**
     * Get user's zone from default address
     */
    private function getUserZone(Request $request): ?\App\Models\Zone
    {
        $user = $request->user();
        if ($user === null) {
            return null;
        }

        $defaultAddress = $user->addresses()
            ->active()
            ->where('is_default', true)
            ->first();

        if ($defaultAddress === null || $defaultAddress->zone_id === null) {
            return null;
        }

        return $defaultAddress->zone;
    }
}
