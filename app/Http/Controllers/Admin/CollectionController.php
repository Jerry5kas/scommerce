<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessVertical;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCollectionRequest;
use App\Http\Requests\Admin\UpdateCollectionRequest;
use App\Models\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Collection::query()->with('category:id,name,slug')->ordered();

        $vertical = $request->string('vertical')->toString();
        if ($vertical !== '' && in_array($vertical, array_merge(BusinessVertical::values(), [Collection::VERTICAL_BOTH]), true)) {
            $query->forVertical($vertical);
        }

        $collections = $query->withCount('products')->get();

        return Inertia::render('admin/collections/index', [
            'collections' => $collections,
            'verticalOptions' => array_merge(['' => 'All verticals'], BusinessVertical::options(), [Collection::VERTICAL_BOTH => 'Both']),
            'filters' => ['vertical' => $vertical],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/collections/create', [
            'verticalOptions' => array_merge([Collection::VERTICAL_BOTH => 'Both'], BusinessVertical::options()),
            'categories' => \App\Models\Category::query()->ordered()->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(StoreCollectionRequest $request): RedirectResponse
    {
        Collection::query()->create($request->validated());

        return redirect()->route('admin.collections.index')->with('message', 'Collection created.');
    }

    public function show(Collection $collection): Response
    {
        $collection->load(['category:id,name,slug', 'products' => fn ($q) => $q->ordered()->limit(10)]);

        return Inertia::render('admin/collections/show', [
            'collection' => $collection,
        ]);
    }

    public function edit(Collection $collection): Response
    {
        return Inertia::render('admin/collections/edit', [
            'collection' => $collection,
            'verticalOptions' => array_merge([Collection::VERTICAL_BOTH => 'Both'], BusinessVertical::options()),
            'categories' => \App\Models\Category::query()->ordered()->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(UpdateCollectionRequest $request, Collection $collection): RedirectResponse
    {
        $collection->update($request->validated());

        return redirect()->route('admin.collections.index')->with('message', 'Collection updated.');
    }

    public function destroy(Collection $collection): RedirectResponse
    {
        $collection->delete();

        return redirect()->route('admin.collections.index')->with('message', 'Collection deleted.');
    }

    public function toggleStatus(Collection $collection): RedirectResponse
    {
        $collection->update(['is_active' => ! $collection->is_active]);

        return redirect()->back()->with('message', $collection->is_active ? 'Collection enabled.' : 'Collection disabled.');
    }
}
