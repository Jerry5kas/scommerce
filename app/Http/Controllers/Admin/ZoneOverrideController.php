<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreZoneOverrideRequest;
use App\Http\Requests\Admin\UpdateZoneOverrideRequest;
use App\Models\Zone;
use App\Models\ZoneOverride;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ZoneOverrideController extends Controller
{
    public function create(Zone $zone): Response
    {
        $users = User::query()
            ->whereIn('role', [User::ROLE_CUSTOMER, User::ROLE_DRIVER])
            ->orderBy('name')
            ->get(['id', 'name', 'phone', 'email', 'role']);
        $addresses = UserAddress::query()
            ->with('user:id,name,phone')
            ->orderByDesc('created_at')
            ->limit(500)
            ->get(['id', 'user_id', 'address_line_1', 'city', 'pincode']);

        return Inertia::render('admin/zone-overrides/create', [
            'zone' => $zone->only('id', 'name', 'code'),
            'users' => $users,
            'addresses' => $addresses,
        ]);
    }

    public function store(StoreZoneOverrideRequest $request, Zone $zone): RedirectResponse
    {
        $data = $request->validated();
        $data['zone_id'] = $zone->id;
        $data['overridden_by'] = $request->user('admin')->id;
        $data['is_active'] = $data['is_active'] ?? true;
        ZoneOverride::query()->create($data);

        return redirect()
            ->route('admin.zones.show', $zone)
            ->with('message', 'Override created.');
    }

    public function edit(ZoneOverride $zoneOverride): Response
    {
        $zoneOverride->load(['zone:id,name,code', 'user:id,name,phone', 'address:id,address_line_1,city,pincode']);

        return Inertia::render('admin/zone-overrides/edit', [
            'override' => $zoneOverride,
        ]);
    }

    public function update(UpdateZoneOverrideRequest $request, ZoneOverride $zoneOverride): RedirectResponse
    {
        $zoneOverride->update($request->validated());

        return redirect()
            ->route('admin.zones.show', $zoneOverride->zone_id)
            ->with('message', 'Override updated.');
    }

    public function destroy(ZoneOverride $zoneOverride): RedirectResponse
    {
        $zoneId = $zoneOverride->zone_id;
        $zoneOverride->delete();

        return redirect()
            ->route('admin.zones.show', $zoneId)
            ->with('message', 'Override removed.');
    }
}
