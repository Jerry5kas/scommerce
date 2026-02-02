<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignZoneRequest;
use App\Http\Requests\Admin\StoreDriverRequest;
use App\Http\Requests\Admin\UpdateDriverRequest;
use App\Models\Driver;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(Request $request): Response
    {
        $drivers = Driver::query()
            ->with(['user:id,name,phone', 'zone:id,name,code'])
            ->orderBy('employee_id')
            ->get();

        return Inertia::render('admin/drivers/index', [
            'drivers' => $drivers,
        ]);
    }

    public function show(Driver $driver): Response
    {
        $driver->load(['user:id,name,phone,email', 'zone:id,name,code,city,state']);

        return Inertia::render('admin/drivers/show', [
            'driver' => $driver,
        ]);
    }

    public function create(): Response
    {
        $users = User::query()
            ->byRole(User::ROLE_DRIVER)
            ->whereDoesntHave('driverProfile')
            ->orderBy('name')
            ->get(['id', 'name', 'phone']);

        $zones = Zone::query()->active()->orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('admin/drivers/create', [
            'users' => $users,
            'zones' => $zones,
        ]);
    }

    public function store(StoreDriverRequest $request): RedirectResponse
    {
        Driver::query()->create($request->validated());

        return redirect()->route('admin.drivers.index')->with('message', 'Driver created.');
    }

    public function edit(Driver $driver): Response
    {
        $driver->load('zone:id,name,code');
        $zones = Zone::query()->active()->orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('admin/drivers/edit', [
            'driver' => $driver,
            'zones' => $zones,
        ]);
    }

    public function update(UpdateDriverRequest $request, Driver $driver): RedirectResponse
    {
        $driver->update($request->validated());

        return redirect()->route('admin.drivers.index')->with('message', 'Driver updated.');
    }

    public function destroy(Driver $driver): RedirectResponse
    {
        $driver->delete();

        return redirect()->route('admin.drivers.index')->with('message', 'Driver deleted.');
    }

    public function assignZone(AssignZoneRequest $request, Driver $driver): RedirectResponse
    {
        $driver->update(['zone_id' => $request->validated('zone_id')]);

        return redirect()->back()->with('message', 'Zone assigned.');
    }

    public function toggleStatus(Driver $driver): RedirectResponse
    {
        $driver->update(['is_active' => ! $driver->is_active]);

        return redirect()->back()->with('message', $driver->is_active ? 'Driver activated.' : 'Driver deactivated.');
    }
}
