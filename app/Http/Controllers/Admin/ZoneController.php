<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessVertical;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreZoneRequest;
use App\Http\Requests\Admin\UpdateZoneRequest;
use App\Models\Hub;
use App\Models\Zone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ZoneController extends Controller
{
    public function index(Request $request): Response
    {
        $zones = Zone::query()
            ->withCount('drivers', 'addresses')
            ->with('hub:id,name')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/zones/index', [
            'zones' => $zones,
        ]);
    }

    public function show(Zone $zone): Response
    {
        $zone->loadCount('drivers', 'addresses');
        $zone->load([
            'drivers:id,zone_id,user_id,employee_id,phone,is_active,is_online',
            'overrides' => fn ($q) => $q->with(['user:id,name,phone', 'address:id,user_id,address_line_1,city,pincode', 'overriddenBy:id,name'])->orderByDesc('created_at'),
        ]);

        return Inertia::render('admin/zones/show', [
            'zone' => $zone,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/zones/create', [
            'verticalOptions' => BusinessVertical::options(),
            'hubs' => Hub::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreZoneRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user('admin')?->id;
        Zone::query()->create($data);

        return redirect()->route('admin.zones.index')->with('message', 'Zone created.');
    }

    public function edit(Zone $zone): Response
    {
        return Inertia::render('admin/zones/edit', [
            'zone' => $zone,
            'verticalOptions' => BusinessVertical::options(),
            'hubs' => Hub::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateZoneRequest $request, Zone $zone): RedirectResponse
    {
        $zone->update($request->validated());

        return redirect()->route('admin.zones.index')->with('message', 'Zone updated.');
    }

    public function destroy(Zone $zone): RedirectResponse
    {
        $zone->delete();

        return redirect()->route('admin.zones.index')->with('message', 'Zone deleted.');
    }

    public function toggleStatus(Zone $zone): RedirectResponse
    {
        $zone->update(['is_active' => ! $zone->is_active]);

        return redirect()->back()->with('message', $zone->is_active ? 'Zone enabled.' : 'Zone disabled.');
    }
}
