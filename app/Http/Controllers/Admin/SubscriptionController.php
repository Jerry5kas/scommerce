<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\SubscriptionOrderService;
use App\Services\SubscriptionScheduleService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function __construct(
        private SubscriptionScheduleService $scheduleService,
        private SubscriptionOrderService $orderService
    ) {}

    /**
     * List all subscriptions with filters
     */
    public function index(Request $request): Response
    {
        $query = Subscription::query()
            ->with(['user', 'plan', 'address.zone', 'items']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        // Filter by plan
        if ($request->filled('plan_id')) {
            $query->where('subscription_plan_id', $request->integer('plan_id'));
        }

        // Filter by date range
        if ($request->filled('start_from')) {
            $query->whereDate('start_date', '>=', $request->date('start_from'));
        }
        if ($request->filled('start_to')) {
            $query->whereDate('start_date', '<=', $request->date('start_to'));
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $subscriptions = $query->orderByDesc('created_at')->paginate(20);

        $plans = SubscriptionPlan::active()->ordered()->get();

        return Inertia::render('admin/subscriptions/index', [
            'subscriptions' => $subscriptions,
            'plans' => $plans,
            'statusOptions' => Subscription::statusOptions(),
            'filters' => $request->only(['status', 'user_id', 'plan_id', 'start_from', 'start_to', 'search']),
        ]);
    }

    /**
     * Show subscription details
     */
    public function show(Subscription $subscription): Response
    {
        $subscription->load(['user', 'plan', 'address.zone', 'items.product']);

        // Get schedule for current and next month
        $now = Carbon::now();
        $currentMonthSchedule = $this->scheduleService->getScheduleForMonth(
            $subscription,
            $now->month,
            $now->year
        );

        $nextMonth = $now->copy()->addMonth();
        $nextMonthSchedule = $this->scheduleService->getScheduleForMonth(
            $subscription,
            $nextMonth->month,
            $nextMonth->year
        );

        // Get upcoming deliveries
        $upcomingDeliveries = $this->scheduleService->getUpcomingDeliveries($subscription, 14);

        return Inertia::render('admin/subscriptions/show', [
            'subscription' => $subscription,
            'currentMonthSchedule' => $currentMonthSchedule,
            'nextMonthSchedule' => $nextMonthSchedule,
            'upcomingDeliveries' => $upcomingDeliveries,
            'statusOptions' => Subscription::statusOptions(),
        ]);
    }

    /**
     * Show edit form
     */
    public function edit(Subscription $subscription): Response
    {
        $subscription->load(['user', 'plan', 'address.zone', 'items.product']);

        $plans = SubscriptionPlan::active()->ordered()->get();
        $addresses = $subscription->user->addresses()->active()->with('zone')->get();

        // Get products available in the zone
        $zone = $subscription->address->zone;
        $products = Product::query()
            ->active()
            ->subscriptionEligible()
            ->when($zone, function ($q) use ($zone) {
                $q->whereHas('zones', function ($zq) use ($zone) {
                    $zq->where('zones.id', $zone->id)->where('product_zones.is_available', true);
                });
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/subscriptions/edit', [
            'subscription' => $subscription,
            'plans' => $plans,
            'addresses' => $addresses,
            'products' => $products,
            'statusOptions' => Subscription::statusOptions(),
            'billingCycleOptions' => Subscription::billingCycleOptions(),
        ]);
    }

    /**
     * Admin update subscription (can override restrictions)
     */
    public function update(Request $request, Subscription $subscription): RedirectResponse
    {
        $validated = $request->validate([
            'subscription_plan_id' => ['sometimes', 'integer', 'exists:subscription_plans,id'],
            'user_address_id' => ['sometimes', 'integer', 'exists:user_addresses,id'],
            'status' => ['sometimes', 'string', 'in:active,paused,cancelled,expired'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'next_delivery_date' => ['sometimes', 'date'],
            'billing_cycle' => ['sometimes', 'string', 'in:weekly,monthly'],
            'auto_renew' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:500'],
            'items' => ['sometimes', 'array'],
            'items.*.product_id' => ['required_with:items', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
        ]);

        try {
            DB::transaction(function () use ($subscription, $validated) {
                // Track status change
                $oldStatus = $subscription->status;

                $subscription->fill($validated);

                // Handle status changes
                if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
                    if ($validated['status'] === Subscription::STATUS_CANCELLED) {
                        $subscription->cancelled_at = Carbon::now();
                    }
                }

                $subscription->save();

                // Update items if provided
                if (isset($validated['items'])) {
                    $subscription->items()->update(['is_active' => false]);

                    $zone = $subscription->address->zone;
                    foreach ($validated['items'] as $index => $item) {
                        $product = Product::findOrFail($item['product_id']);
                        $price = $zone ? $product->getPriceForZone($zone) : $product->price;

                        $subscription->items()->updateOrCreate(
                            ['product_id' => $product->id],
                            [
                                'quantity' => $item['quantity'],
                                'price' => $price,
                                'display_order' => $index,
                                'is_active' => true,
                            ]
                        );
                    }
                }
            });

            return redirect()->route('admin.subscriptions.show', $subscription)
                ->with('success', 'Subscription updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update subscription: '.$e->getMessage()]);
        }
    }

    /**
     * Admin pause subscription
     */
    public function pause(Request $request, Subscription $subscription): RedirectResponse
    {
        $validated = $request->validate([
            'paused_until' => ['nullable', 'date', 'after:today'],
        ]);

        if ($subscription->status !== Subscription::STATUS_ACTIVE) {
            return back()->with('error', 'Only active subscriptions can be paused.');
        }

        $pausedUntil = isset($validated['paused_until'])
            ? Carbon::parse($validated['paused_until'])
            : null;

        $subscription->pause($pausedUntil);

        return back()->with('success', 'Subscription paused.');
    }

    /**
     * Admin resume subscription
     */
    public function resume(Subscription $subscription): RedirectResponse
    {
        if ($subscription->status !== Subscription::STATUS_PAUSED) {
            return back()->with('error', 'Only paused subscriptions can be resumed.');
        }

        $subscription->resume();

        return back()->with('success', 'Subscription resumed.');
    }

    /**
     * Admin cancel subscription
     */
    public function cancel(Request $request, Subscription $subscription): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($subscription->status === Subscription::STATUS_CANCELLED) {
            return back()->with('error', 'Subscription is already cancelled.');
        }

        $subscription->cancel($validated['reason'] ?? 'Cancelled by admin');

        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription cancelled.');
    }

    /**
     * Get delivery schedule
     */
    public function getSchedule(Request $request, Subscription $subscription): JsonResponse
    {
        $month = $request->integer('month', Carbon::now()->month);
        $year = $request->integer('year', Carbon::now()->year);

        $schedule = $this->scheduleService->getScheduleForMonth($subscription, $month, $year);

        return response()->json($schedule);
    }

    /**
     * Get upcoming deliveries dashboard
     */
    public function upcomingDeliveries(Request $request): Response
    {
        $date = $request->date('date', Carbon::today());

        $subscriptions = $this->orderService->getSubscriptionsDueForDelivery($date);

        // Group by zone
        $groupedByZone = $subscriptions->groupBy(fn ($sub) => $sub->address->zone->name ?? 'Unknown');

        // Preview orders
        $orderPreview = $this->orderService->previewOrdersForDate($date);

        return Inertia::render('admin/subscriptions/upcoming', [
            'date' => $date->format('Y-m-d'),
            'subscriptions' => $subscriptions,
            'groupedByZone' => $groupedByZone,
            'orderPreview' => $orderPreview,
            'totalOrders' => count($orderPreview),
            'totalValue' => collect($orderPreview)->sum('total'),
        ]);
    }

    /**
     * Generate orders for a specific date (manual trigger)
     */
    public function generateOrders(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
        ]);

        $date = Carbon::parse($validated['date']);
        $results = $this->orderService->generateOrdersForDate($date);

        $message = "Processed {$results['processed']} subscriptions. Success: {$results['success']}, Failed: {$results['failed']}.";

        if ($results['failed'] > 0) {
            return back()->with('warning', $message);
        }

        return back()->with('success', $message);
    }
}
