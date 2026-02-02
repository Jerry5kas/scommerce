<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessVertical;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ManageProductZonesRequest;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Product;
use App\Models\Zone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->with(['category:id,name,slug', 'collection:id,name,slug'])
            ->ordered();

        $vertical = $request->string('vertical')->toString();
        if ($vertical !== '' && in_array($vertical, array_merge(BusinessVertical::values(), [Product::VERTICAL_BOTH]), true)) {
            $query->forVertical($vertical);
        }

        $zoneId = $request->integer('zone_id');
        if ($zoneId > 0) {
            $query->whereHas('zones', fn ($q) => $q->where('zones.id', $zoneId)->where('product_zones.is_available', true));
        }

        $products = $query->get();

        $zones = Zone::query()->orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'zones' => $zones,
            'verticalOptions' => array_merge(['' => 'All verticals'], BusinessVertical::options(), [Product::VERTICAL_BOTH => 'Both']),
            'filters' => [
                'vertical' => $vertical,
                'zone_id' => $zoneId,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/create', [
            'verticalOptions' => array_merge([Product::VERTICAL_BOTH => 'Both'], BusinessVertical::options()),
            'categories' => \App\Models\Category::query()->ordered()->get(['id', 'name', 'slug']),
            'collections' => \App\Models\Collection::query()->ordered()->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        Product::query()->create($request->validated());

        return redirect()->route('admin.products.index')->with('message', 'Product created.');
    }

    public function show(Product $product): Response
    {
        $product->load([
            'category:id,name,slug',
            'collection:id,name,slug',
            'zones' => fn ($q) => $q->orderBy('zones.name'),
        ]);

        return Inertia::render('admin/products/show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'verticalOptions' => array_merge([Product::VERTICAL_BOTH => 'Both'], BusinessVertical::options()),
            'categories' => \App\Models\Category::query()->ordered()->get(['id', 'name', 'slug']),
            'collections' => \App\Models\Collection::query()->ordered()->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return redirect()->route('admin.products.index')->with('message', 'Product updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('message', 'Product deleted.');
    }

    public function toggleStatus(Product $product): RedirectResponse
    {
        $product->update(['is_active' => ! $product->is_active]);

        return redirect()->back()->with('message', $product->is_active ? 'Product enabled.' : 'Product disabled.');
    }

    public function manageZones(Product $product): Response
    {
        $product->load(['zones' => fn ($q) => $q->orderBy('zones.name')]);
        $allZones = Zone::query()->orderBy('name')->get(['id', 'name', 'code']);

        $zoneData = $allZones->map(function (Zone $zone) use ($product) {
            $pivot = $product->zones->firstWhere('id', $zone->id)?->pivot;

            return [
                'zone_id' => $zone->id,
                'zone_name' => $zone->name,
                'zone_code' => $zone->code,
                'is_available' => $pivot ? (bool) $pivot->is_available : false,
                'price_override' => $pivot && $pivot->price_override !== null ? (string) $pivot->price_override : null,
                'stock_quantity' => $pivot && $pivot->stock_quantity !== null ? (int) $pivot->stock_quantity : null,
            ];
        });

        return Inertia::render('admin/products/manage-zones', [
            'product' => $product->only(['id', 'name', 'slug', 'sku']),
            'zones' => $zoneData,
        ]);
    }

    public function updateZones(ManageProductZonesRequest $request, Product $product): RedirectResponse
    {
        $zones = $request->validated('zones', []);
        $sync = [];

        foreach ($zones as $row) {
            $sync[$row['zone_id']] = [
                'is_available' => $row['is_available'] ?? false,
                'price_override' => isset($row['price_override']) && $row['price_override'] !== '' ? $row['price_override'] : null,
                'stock_quantity' => isset($row['stock_quantity']) && $row['stock_quantity'] !== '' ? (int) $row['stock_quantity'] : null,
            ];
        }

        $product->zones()->sync($sync);

        return redirect()->route('admin.products.show', $product)->with('message', 'Zone availability updated.');
    }
}
