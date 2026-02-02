<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessVertical;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
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
        Category::query()->create($request->validated());

        return redirect()->route('admin.categories.index')->with('message', 'Category created.');
    }

    public function show(Category $category): Response
    {
        $category->loadCount('products');
        $category->load(['products' => fn ($q) => $q->ordered()->limit(10)]);

        return Inertia::render('admin/categories/show', [
            'category' => $category,
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
        $category->update($request->validated());

        return redirect()->route('admin.categories.index')->with('message', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.categories.index')->with('message', 'Category deleted.');
    }

    public function toggleStatus(Category $category): RedirectResponse
    {
        $category->update(['is_active' => ! $category->is_active]);

        return redirect()->back()->with('message', $category->is_active ? 'Category enabled.' : 'Category disabled.');
    }
}
