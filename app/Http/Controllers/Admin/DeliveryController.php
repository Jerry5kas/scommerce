<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignDriverRequest;
use App\Http\Requests\OverrideProofRequest;
use App\Http\Requests\UpdateDeliveryStatusRequest;
use App\Http\Requests\VerifyProofRequest;
use App\Models\Delivery;
use App\Models\Driver;
use App\Models\Zone;
use App\Services\DeliveryProofService;
use App\Services\DeliveryStatusService;
use App\Services\RouteAssignmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeliveryController extends Controller
{
    public function __construct(
        private DeliveryStatusService $statusService,
        private DeliveryProofService $proofService,
        private RouteAssignmentService $routeService
    ) {}

    /**
     * Display a listing of deliveries.
     */
    public function index(Request $request): Response
    {
        $query = Delivery::query()
            ->with(['order', 'driver', 'user', 'address', 'zone']);

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('scheduled_date', $request->date);
        }

        if ($request->filled('driver_id')) {
            $query->where('driver_id', $request->driver_id);
        }

        if ($request->filled('zone_id')) {
            $query->where('zone_id', $request->zone_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('order', fn ($o) => $o->where('order_number', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('unassigned') && $request->unassigned === 'true') {
            $query->whereNull('driver_id');
        }

        if ($request->filled('needs_verification') && $request->needs_verification === 'true') {
            $query->needsProofVerification();
        }

        $deliveries = $query->latest('scheduled_date')
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/deliveries/index', [
            'deliveries' => $deliveries,
            'filters' => $request->only(['status', 'date', 'driver_id', 'zone_id', 'search', 'unassigned', 'needs_verification']),
            'drivers' => Driver::where('is_active', true)->select('id', 'name')->get(),
            'zones' => Zone::where('is_active', true)->select('id', 'name')->get(),
            'statusOptions' => Delivery::statusOptions(),
        ]);
    }

    /**
     * Display the specified delivery.
     */
    public function show(Delivery $delivery): Response
    {
        $delivery->load(['order.items', 'driver', 'user', 'address', 'zone', 'verifiedBy', 'trackingHistory']);

        $timeline = $this->statusService->getDeliveryTimeline($delivery);
        $availableStatuses = $this->statusService->getAvailableStatuses($delivery);
        $drivers = Driver::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('admin/deliveries/show', [
            'delivery' => $delivery,
            'timeline' => $timeline,
            'availableStatuses' => $availableStatuses,
            'drivers' => $drivers,
            'proofUrl' => $this->proofService->getProofUrl($delivery),
        ]);
    }

    /**
     * Assign a driver to a delivery.
     */
    public function assignDriver(AssignDriverRequest $request, Delivery $delivery): RedirectResponse
    {
        if (! $delivery->canAssignDriver()) {
            return back()->with('error', 'Cannot assign driver to this delivery.');
        }

        $driver = Driver::findOrFail($request->driver_id);
        $delivery->assignDriver($driver);

        return back()->with('success', "Driver {$driver->name} assigned successfully.");
    }

    /**
     * Update delivery status.
     */
    public function updateStatus(UpdateDeliveryStatusRequest $request, Delivery $delivery): RedirectResponse
    {
        try {
            $this->statusService->updateStatus($delivery, $request->status, $request->validated());

            return back()->with('success', 'Delivery status updated.');
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Verify delivery proof.
     */
    public function verifyProof(VerifyProofRequest $request, Delivery $delivery): RedirectResponse
    {
        $admin = $request->user();

        if (! $delivery->hasProof()) {
            return back()->with('error', 'No proof image to verify.');
        }

        $result = $this->proofService->verifyProof($delivery, $admin);

        if (! $result['success']) {
            return back()->with('error', $result['error']);
        }

        return back()->with('success', 'Proof verified successfully.');
    }

    /**
     * Override proof requirement (admin only).
     */
    public function overrideProof(OverrideProofRequest $request, Delivery $delivery): RedirectResponse
    {
        $admin = $request->user();

        $result = $this->proofService->overrideProofRequirement($delivery, $admin, $request->reason);

        if (! $result['success']) {
            return back()->with('error', $result['error']);
        }

        return back()->with('success', 'Proof requirement overridden. Delivery marked as complete.');
    }

    /**
     * Get deliveries for a specific date.
     */
    public function forDate(Request $request): Response
    {
        $date = $request->get('date', now()->toDateString());

        $deliveries = Delivery::query()
            ->whereDate('scheduled_date', $date)
            ->with(['order', 'driver', 'user', 'address', 'zone'])
            ->orderBy('zone_id')
            ->orderBy('sequence')
            ->get();

        $zones = Zone::where('is_active', true)->get();
        $zoneSummaries = $zones->map(fn ($zone) => $this->routeService->getZoneSummary($zone, $date));

        $drivers = Driver::where('is_active', true)->get();
        $driverCapacities = $drivers->map(fn ($driver) => $this->routeService->getDriverCapacity($driver, $date));

        return Inertia::render('admin/deliveries/calendar', [
            'date' => $date,
            'deliveries' => $deliveries,
            'zoneSummaries' => $zoneSummaries,
            'driverCapacities' => $driverCapacities,
        ]);
    }

    /**
     * Get deliveries for a driver on a date.
     */
    public function driverDeliveries(Request $request, Driver $driver): JsonResponse
    {
        $date = $request->get('date', now()->toDateString());
        $route = $this->routeService->getDriverRoute($driver, $date);

        return response()->json([
            'driver' => $driver,
            'deliveries' => $route['deliveries'],
            'stats' => $route['stats'],
        ]);
    }

    /**
     * Auto-assign deliveries.
     */
    public function autoAssign(Request $request): RedirectResponse
    {
        $date = $request->get('date', now()->toDateString());
        $zoneId = $request->get('zone_id');

        $result = $this->routeService->autoAssignDeliveries($date, $zoneId);

        if (! $result['success']) {
            return back()->with('error', $result['error'] ?? 'Auto-assign failed.');
        }

        return back()->with('success', "{$result['assigned']} deliveries assigned.");
    }

    /**
     * Bulk assign deliveries to a driver.
     */
    public function bulkAssign(Request $request): RedirectResponse
    {
        $request->validate([
            'delivery_ids' => ['required', 'array'],
            'delivery_ids.*' => ['integer', 'exists:deliveries,id'],
            'driver_id' => ['required', 'integer', 'exists:drivers,id'],
        ]);

        $driver = Driver::findOrFail($request->driver_id);
        $result = $this->routeService->assignDeliveriesToDriver($driver, $request->delivery_ids);

        if (! $result['success']) {
            return back()->with('error', $result['error'] ?? 'Bulk assign failed.');
        }

        return back()->with('success', "{$result['assigned']} deliveries assigned to {$driver->name}.");
    }

    /**
     * Update delivery sequence (reorder).
     */
    public function updateSequence(Request $request): JsonResponse
    {
        $request->validate([
            'sequences' => ['required', 'array'],
            'sequences.*' => ['integer', 'min:1'],
        ]);

        $success = $this->routeService->updateDeliverySequences($request->sequences);

        return response()->json(['success' => $success]);
    }

    /**
     * Get delivery statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        $days = $request->get('days', 7);
        $summary = $this->routeService->getUpcomingDeliveriesSummary($days);

        $todayStats = [
            'total' => Delivery::whereDate('scheduled_date', today())->count(),
            'pending' => Delivery::whereDate('scheduled_date', today())->pending()->count(),
            'assigned' => Delivery::whereDate('scheduled_date', today())->assigned()->count(),
            'out_for_delivery' => Delivery::whereDate('scheduled_date', today())->outForDelivery()->count(),
            'delivered' => Delivery::whereDate('scheduled_date', today())->delivered()->count(),
            'failed' => Delivery::whereDate('scheduled_date', today())->failed()->count(),
            'unassigned' => Delivery::whereDate('scheduled_date', today())->unassigned()->count(),
            'needs_verification' => Delivery::needsProofVerification()->count(),
        ];

        return response()->json([
            'today' => $todayStats,
            'upcoming' => $summary,
        ]);
    }
}
