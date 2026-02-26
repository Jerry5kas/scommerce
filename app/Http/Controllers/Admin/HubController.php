<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessVertical;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHubRequest;
use App\Http\Requests\Admin\UpdateHubRequest;
use App\Models\Hub;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HubController extends Controller
{
    public function index(Request $request): Response
    {
        $hubs = Hub::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/hubs/index', [
            'hubs' => $hubs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/hubs/create', [
            'verticalOptions' => BusinessVertical::options(),
        ]);
    }

    public function store(StoreHubRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user('admin')?->id;
        Hub::query()->create($data);

        return redirect()->route('admin.hubs.index')->with('message', 'Hub created.');
    }

    public function edit(Hub $hub): Response
    {
        return Inertia::render('admin/hubs/edit', [
            'hub' => $hub,
            'verticalOptions' => BusinessVertical::options(),
        ]);
    }

    public function update(UpdateHubRequest $request, Hub $hub): RedirectResponse
    {
        $hub->update($request->validated());

        return redirect()->route('admin.hubs.index')->with('message', 'Hub updated.');
    }

    public function destroy(Hub $hub): RedirectResponse
    {
        $hub->delete();

        return redirect()->route('admin.hubs.index')->with('message', 'Hub deleted.');
    }

    public function toggleStatus(Hub $hub): RedirectResponse
    {
        $hub->update(['is_active' => ! $hub->is_active]);

        return redirect()->back()->with('message', $hub->is_active ? 'Hub enabled.' : 'Hub disabled.');
    }
}
