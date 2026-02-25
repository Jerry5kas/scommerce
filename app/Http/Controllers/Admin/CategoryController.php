<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessVertical;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Traits\HandlesImageUploads;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    use HandlesImageUploads;

    public function index(Request $request): Response
    {
        $query = Category::query()->ordered();

        $vertical = $request->string('vertical')->toString();
        if ($vertical !== '' && in_array($vertical, array_merge(BusinessVertical::values(), [Category::VERTICAL_BOTH]), true)) {
            $query->forVertical($vertical);
        }

        $categories = $query->withCount('products')->get();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'verticalOptions' => array_merge(['' => 'All verticals'], BusinessVertical::options(), [Category::VERTICAL_BOTH => 'Both']),
            'filters' => ['vertical' => $vertical],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/categories/create', [
            'verticalOptions' => array_merge([Category::VERTICAL_BOTH => 'Both'], BusinessVertical::options()),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image_file')) {
            $data['image'] = $this->handleImageUpload(null, $request->file('image_file'), 'categories');
        }

        unset($data['image_file']);

        Category::query()->create($data);

        return redirect()->route('admin.categories.index')->with('message', 'Category created.');
    }

    public function show(Category $category): Response
    {
        $category->loadCount('products');
        $category->load([
            'products' => fn($q) => $q->withCount('variants')->ordered()->limit(20),
        ]);

        return Inertia::render('admin/categories/show', [
            'category' => $category,
            'verticalOptions' => array_merge([Category::VERTICAL_BOTH => 'Both'], BusinessVertical::options()),
        ]);
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('admin/categories/edit', [
            'category' => $category,
            'verticalOptions' => array_merge([Category::VERTICAL_BOTH => 'Both'], BusinessVertical::options()),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $data = $request->validated();

        // Log for debugging
        \Log::debug('Category update request', [
            'has_image_file' => $request->hasFile('image_file'),
            'image_file_size' => $request->hasFile('image_file') ? $request->file('image_file')->getSize() : null,
            'image_url' => $request->input('image'),
            'current_image' => $category->image,
            'category_id' => $category->id,
        ]);

        // Handle image update: Option B - Delete old image from ImageKit, then use new URL
        if ($request->hasFile('image_file')) {
            // Direct file upload (fallback if needed)
            \Log::debug('Processing image file upload for category update');

            $oldImageUrl = $category->image;
            if ($oldImageUrl) {
                $this->deleteOldImage($oldImageUrl, false);
            }

            try {
                $newImageUrl = $this->handleImageUpload(null, $request->file('image_file'), 'categories');
                if ($newImageUrl) {
                    $data['image'] = $newImageUrl;
                    \Log::debug('New image uploaded successfully', [
                        'new_image_url' => $newImageUrl,
                        'old_image_url' => $oldImageUrl,
                    ]);
                }
                else {
                    \Log::error('Image upload returned null URL');
                    throw new \RuntimeException('Failed to upload image to ImageKit.');
                }
            }
            catch (\Exception $e) {
                \Log::error('Image upload failed', [
                    'error' => $e->getMessage(),
                    'category_id' => $category->id,
                ]);
                throw $e;
            }
        }
        elseif ($request->filled('image')) {
            // Image URL provided (from separate upload endpoint)
            $newUrl = $request->input('image');
            $oldImageUrl = $category->image;

            \Log::debug('Image URL provided in request', [
                'new_url' => $newUrl,
                'old_url' => $oldImageUrl,
                'urls_match' => $newUrl === $oldImageUrl,
            ]);

            // Always update if URL is provided and different (or if old is null)
            if ($newUrl !== $oldImageUrl) {
                \Log::debug('Updating category with new image URL', [
                    'old_url' => $oldImageUrl,
                    'new_url' => $newUrl,
                ]);

                // Delete old image from ImageKit if it exists and is an ImageKit URL
                if ($oldImageUrl) {
                    $this->deleteOldImage($oldImageUrl, false);
                }

                $data['image'] = $newUrl;
                \Log::debug('Image URL set in data array', ['image' => $data['image']]);
            }
            else {
                \Log::debug('URLs match, skipping update');
            }
        }
        else {
            \Log::debug('No image file or URL provided, keeping existing image');
        }
        // If neither file nor URL is provided, keep existing image (don't update it)

        unset($data['image_file']);

        // Step 3: Update database with new image URL
        $category->update($data);

        \Log::debug('Category updated successfully', [
            'category_id' => $category->id,
            'new_image' => $category->fresh()->image,
        ]);

        return redirect()->route('admin.categories.index')->with('message', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.categories.index')->with('message', 'Category deleted.');
    }

    public function toggleStatus(Category $category): RedirectResponse
    {
        $category->update(['is_active' => !$category->is_active]);

        return redirect()->back()->with('message', $category->is_active ? 'Category enabled.' : 'Category disabled.');
    }
}
