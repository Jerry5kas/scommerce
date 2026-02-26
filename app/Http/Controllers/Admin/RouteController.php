<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRouteRequest;
use App\Http\Requests\Admin\UpdateRouteRequest;
use App\Models\Hub;
use App\Models\Route as RouteModel;
use App\Models\UserAddress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RouteController extends Controller
{
    public function index(Request $request): Response
    {
        $routesQuery = RouteModel::query()
            ->withCount('addresses')
            ->with('hub:id,name')
            ->orderBy('name');

        return Inertia::render('admin/routes/index', [
            'routes' => $routesQuery->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/routes/create', [
            'hubs' => Hub::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreRouteRequest $request): RedirectResponse
    {
        RouteModel::query()->create($request->validated());

        return redirect()->route('admin.routes.index')->with('message', 'Route created.');
    }

    public function edit(RouteModel $route): Response
    {
        $route->load(['hub:id,name', 'addresses.user:id,name,phone']);

        return Inertia::render('admin/routes/edit', [
            'routeRecord' => $route,
            'hubs' => Hub::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateRouteRequest $request, RouteModel $route): RedirectResponse
    {
        $route->update($request->validated());

        return redirect()->route('admin.routes.index')->with('message', 'Route updated.');
    }

    public function destroy(RouteModel $route): RedirectResponse
    {
        $route->delete();

        return redirect()->route('admin.routes.index')->with('message', 'Route deleted.');
    }

    public function toggleStatus(RouteModel $route): RedirectResponse
    {
        $route->update(['is_active' => ! $route->is_active]);

        return redirect()->back()->with('message', $route->is_active ? 'Route enabled.' : 'Route disabled.');
    }

    public function updateAddresses(Request $request, RouteModel $route): RedirectResponse
    {
        $validated = $request->validate([
            'addresses' => ['required', 'array'],
            'addresses.*.id' => ['required', 'exists:user_addresses,id'],
            'addresses.*.sequence' => ['required', 'integer'],
        ]);

        $syncData = [];
        foreach ($validated['addresses'] as $item) {
            $syncData[$item['id']] = ['sequence' => $item['sequence']];
        }

        $route->addresses()->sync($syncData);

        return redirect()->back()->with('message', 'Route addresses updated.');
    }

    public function searchAddresses(Request $request)
    {
        $query = $request->input('q');
        
        $addresses = UserAddress::with('user:id,name,phone')
            ->whereHas('user', function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('phone', 'like', "%{$query}%");
            })
            ->orWhere('address_line_1', 'like', "%{$query}%")
            ->orWhere('city', 'like', "%{$query}%")
            ->orWhere('pincode', 'like', "%{$query}%")
            ->take(10)
            ->get();

        return response()->json($addresses);
    }
}
