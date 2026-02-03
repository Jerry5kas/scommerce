<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessVertical;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCollectionRequest;
use App\Http\Requests\Admin\UpdateCollectionRequest;
use App\Models\Collection;
use App\Traits\HandlesImageUploads;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
    use HandlesImageUploads;

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
        $data = $request->validated();

        // Handle banner image upload
        if ($request->hasFile('banner_image_file')) {
            $data['banner_image'] = $this->handleImageUpload(null, $request->file('banner_image_file'), 'collections');
        }

        // Handle mobile banner image upload
        if ($request->hasFile('banner_mobile_image_file')) {
            $data['banner_mobile_image'] = $this->handleImageUpload(null, $request->file('banner_mobile_image_file'), 'collections');
        }

        unset($data['banner_image_file'], $data['banner_mobile_image_file']);

        Collection::query()->create($data);

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
        $data = $request->validated();

        // Handle banner image upload - delete old image if new one is uploaded
        if ($request->hasFile('banner_image_file')) {
            $this->deleteOldImage($collection->banner_image);
            $data['banner_image'] = $this->handleImageUpload(null, $request->file('banner_image_file'), 'collections');
        }

        // Handle mobile banner image upload
        if ($request->hasFile('banner_mobile_image_file')) {
            $this->deleteOldImage($collection->banner_mobile_image);
            $data['banner_mobile_image'] = $this->handleImageUpload(null, $request->file('banner_mobile_image_file'), 'collections');
        }

        unset($data['banner_image_file'], $data['banner_mobile_image_file']);

        $collection->update($data);

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
