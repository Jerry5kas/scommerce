<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Zone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    /**
     * Display banners list.
     */
    public function index(Request $request): Response
    {
        $query = Banner::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } else {
                $query->where('is_active', false);
            }
        }

        $banners = $query->ordered()->paginate(20)->withQueryString();

        return Inertia::render('admin/banners/index', [
            'banners' => $banners,
            'filters' => $request->only(['search', 'type', 'status']),
            'typeOptions' => Banner::typeOptions(),
        ]);
    }

    /**
     * Show create banner form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/banners/create', [
            'typeOptions' => Banner::typeOptions(),
            'linkTypeOptions' => Banner::linkTypeOptions(),
            'zones' => Zone::active()->select('id', 'name')->get(),
        ]);
    }

    /**
     * Store new banner.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:home,category,product,promotional'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'image' => ['required', 'string', 'url'],
            'mobile_image' => ['nullable', 'string', 'url'],
            'link_url' => ['nullable', 'string', 'url'],
            'link_type' => ['required', 'in:product,category,collection,external,none'],
            'link_id' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'zones' => ['nullable', 'array'],
        ]);

        Banner::create($validated);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner created successfully.');
    }

    /**
     * Display banner details.
     */
    public function show(Banner $banner): Response
    {
        return Inertia::render('admin/banners/show', [
            'banner' => $banner,
            'typeOptions' => Banner::typeOptions(),
            'linkTypeOptions' => Banner::linkTypeOptions(),
        ]);
    }

    /**
     * Show edit banner form.
     */
    public function edit(Banner $banner): Response
    {
        return Inertia::render('admin/banners/edit', [
            'banner' => $banner,
            'typeOptions' => Banner::typeOptions(),
            'linkTypeOptions' => Banner::linkTypeOptions(),
            'zones' => Zone::active()->select('id', 'name')->get(),
        ]);
    }

    /**
     * Update banner.
     */
    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:home,category,product,promotional'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'image' => ['required', 'string', 'url'],
            'mobile_image' => ['nullable', 'string', 'url'],
            'link_url' => ['nullable', 'string', 'url'],
            'link_type' => ['required', 'in:product,category,collection,external,none'],
            'link_id' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'zones' => ['nullable', 'array'],
        ]);

        $banner->update($validated);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner updated successfully.');
    }

    /**
     * Delete banner.
     */
    public function destroy(Banner $banner): RedirectResponse
    {
        $banner->delete();

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner deleted successfully.');
    }

    /**
     * Toggle banner status.
     */
    public function toggleStatus(Banner $banner): RedirectResponse
    {
        $banner->update(['is_active' => ! $banner->is_active]);

        $status = $banner->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Banner {$status}.");
    }

    /**
     * Update display order.
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'banners' => ['required', 'array'],
            'banners.*.id' => ['required', 'exists:banners,id'],
            'banners.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['banners'] as $item) {
            Banner::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
        }

        return back()->with('success', 'Banner order updated.');
    }
}
