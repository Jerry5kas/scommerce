<?php

namespace App\Http\Controllers;

use App\Http\Requests\CancelSubscriptionRequest;
use App\Http\Requests\PauseSubscriptionRequest;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;
use App\Http\Requests\VacationRequest;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\SubscriptionItem;
use App\Models\SubscriptionPlan;
use App\Services\NotificationService;
use App\Services\SubscriptionScheduleService;
use App\Services\SubscriptionValidationService;
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
        private SubscriptionValidationService $validationService,
        private NotificationService $notificationService
    ) {}

    /**
     * Show subscription plans page
     */
    public function plans(Request $request): Response
    {
        $user = $request->user();
        $addresses = [];

        if ($user) {
            $addresses = $user->addresses()
                ->active()
                ->orderByDesc('is_default')
                ->orderBy('created_at')
                ->get()
                ->map(fn ($addr) => [
                    'id' => (string) $addr->id,
                    'label' => $addr->label ?? 'Address',
                    'line1' => $addr->address_line_1,
                    'line2' => $addr->address_line_2,
                    'city' => $addr->city,
                    'state' => $addr->state,
                    'pincode' => $addr->pincode,
                    'isDefault' => (bool) $addr->is_default,
                ]);
        }

        $subscriptionPlans = SubscriptionPlan::with(['items.product', 'features'])
            ->active()
            ->ordered()
            ->get()
            ->map(fn (SubscriptionPlan $plan) => [
                'id' => $plan->id,
                'name' => $plan->name,
                'description' => $plan->description,
                'frequency_type' => $plan->frequency_type,
                'discount_type' => $plan->discount_type,
                'discount_value' => (float) $plan->discount_value,
                'items' => $plan->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product ? $item->product->name : 'Unknown Product',
                    'product_image' => $item->product ? $item->product->image : null,
                    'units' => $item->units,
                    'total_price' => (float) $item->total_price,
                    'per_unit_price' => (float) $item->per_unit_price,
                ]),
                'features' => $plan->features->map(fn ($feature) => [
                    'id' => $feature->id,
                    'title' => $feature->title,
                    'highlight' => $feature->highlight,
                ]),
            ]);

        return Inertia::render('subscription', [
            'subscriptionPlans' => $subscriptionPlans,
            'selectedPlanId' => $request->query('plan'),
            'userAddresses' => $addresses,
        ]);
    }

    /**
     * List user's subscriptions
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $subscriptions = Subscription::query()
            ->forUser($user->id)
            ->with(['plan', 'address', 'items.product'])
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('subscriptions/index', [
            'subscriptions' => $subscriptions,
            'statusOptions' => Subscription::statusOptions(),
        ]);
    }

    /**
     * Show subscription details
     */
    public function show(Request $request, Subscription $subscription): Response|RedirectResponse
    {
        $user = $request->user();

        if ($subscription->user_id !== $user->id) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Subscription not found.');
        }

        $subscription->load(['plan', 'address.zone', 'items.product', 'user']);

        // Get schedule for current month
        $now = Carbon::now();
        $schedule = $this->scheduleService->getScheduleForMonth(
            $subscription,
            $now->month,
            $now->year
        );

        // Get upcoming deliveries
        $upcomingDeliveries = $this->scheduleService->getUpcomingDeliveries($subscription, 7);

        return Inertia::render('subscriptions/show', [
            'subscription' => $subscription,
            'schedule' => $schedule,
            'upcomingDeliveries' => $upcomingDeliveries,
            'canEdit' => $subscription->canEdit(),
            'statusOptions' => Subscription::statusOptions(),
        ]);
    }

    /**
     * Show create subscription form
     */
    public function create(Request $request): Response
    {
        $user = $request->user();

        $plans = SubscriptionPlan::active()->ordered()->get();
        $addresses = $user->addresses()->active()->with('zone')->get();

        // Get subscription-eligible products
        $defaultAddress = $addresses->firstWhere('is_default', true) ?? $addresses->first();
        $zone = $defaultAddress?->zone;

        $products = [];
        if ($zone) {
            $products = $this->validationService->getEligibleProducts($zone);
        }

        return Inertia::render('subscriptions/create', [
            'plans' => $plans,
            'addresses' => $addresses,
            'products' => $products,
            'frequencyOptions' => SubscriptionPlan::frequencyOptions(),
            'billingCycleOptions' => Subscription::billingCycleOptions(),
        ]);
    }

    /**
     * Create a new subscription
     */
    public function store(StoreSubscriptionRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $plan = SubscriptionPlan::findOrFail($validated['subscription_plan_id']);
        $address = $user->addresses()->findOrFail($validated['user_address_id']);

        // Validate subscription creation
        $validation = $this->validationService->validateSubscriptionCreation(
            $user,
            $validated['items'],
            $address,
            $plan
        );

        if (! $validation['valid']) {
            return back()->withErrors(['items' => implode(' ', $validation['errors'])]);
        }

        try {
            $subscription = DB::transaction(function () use ($user, $validated, $plan, $address) {
                $startDate = Carbon::parse($validated['start_date']);

                $subscription = Subscription::create([
                    'user_id' => $user->id,
                    'user_address_id' => $address->id,
                    'subscription_plan_id' => $plan->id,
                    'status' => Subscription::STATUS_ACTIVE,
                    'start_date' => $startDate,
                    'next_delivery_date' => $startDate,
                    'billing_cycle' => $validated['billing_cycle'] ?? Subscription::BILLING_MONTHLY,
                    'notes' => $validated['notes'] ?? null,
                    'vertical' => 'society_fresh',
                ]);

                // Create subscription items
                foreach ($validated['items'] as $index => $item) {
                    $product = Product::findOrFail($item['product_id']);
                    $zone = $address->zone;
                    $price = $zone ? $product->getPriceForZone($zone) : $product->price;

                    SubscriptionItem::create([
                        'subscription_id' => $subscription->id,
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $price,
                        'display_order' => $index,
                    ]);
                }

                return $subscription;
            });

            $this->notificationService->notifySubscriptionCreated($subscription);

            return redirect()->route('subscriptions.show', $subscription)
                ->with('success', 'Subscription created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create subscription: '.$e->getMessage()]);
        }
    }

    /**
     * Show edit subscription form
     */
    public function edit(Request $request, Subscription $subscription): Response|RedirectResponse
    {
        $user = $request->user();

        if ($subscription->user_id !== $user->id) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Subscription not found.');
        }

        if (! $subscription->canEdit()) {
            return redirect()->route('subscriptions.show', $subscription)
                ->with('error', 'This subscription can no longer be edited.');
        }

        $subscription->load(['plan', 'address.zone', 'items.product']);

        $plans = SubscriptionPlan::active()->ordered()->get();
        $addresses = $user->addresses()->active()->with('zone')->get();

        // Get subscription-eligible products for the subscription's zone
        $zone = $subscription->address->zone;
        $products = $zone ? $this->validationService->getEligibleProducts($zone) : collect();

        return Inertia::render('subscriptions/edit', [
            'subscription' => $subscription,
            'plans' => $plans,
            'addresses' => $addresses,
            'products' => $products,
            'billingCycleOptions' => Subscription::billingCycleOptions(),
        ]);
    }

    /**
     * Update subscription
     */
    public function update(UpdateSubscriptionRequest $request, Subscription $subscription): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if ($subscription->user_id !== $user->id) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Subscription not found.');
        }

        // Validate update
        $validation = $this->validationService->validateSubscriptionUpdate($subscription, $validated);

        if (! $validation['valid']) {
            return back()->withErrors(['error' => implode(' ', $validation['errors'])]);
        }

        try {
            DB::transaction(function () use ($subscription, $validated) {
                // Update subscription fields
                $subscription->fill([
                    'user_address_id' => $validated['user_address_id'] ?? $subscription->user_address_id,
                    'billing_cycle' => $validated['billing_cycle'] ?? $subscription->billing_cycle,
                    'notes' => $validated['notes'] ?? $subscription->notes,
                    'auto_renew' => $validated['auto_renew'] ?? $subscription->auto_renew,
                ]);
                $subscription->save();

                // Update items if provided
                if (isset($validated['items'])) {
                    // Deactivate all current items
                    $subscription->items()->update(['is_active' => false]);

                    // Create/update items
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

            $subscription->refresh();
            $this->notificationService->notifySubscriptionUpdated($subscription);

            return redirect()->route('subscriptions.show', $subscription)
                ->with('success', 'Subscription updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update subscription: '.$e->getMessage()]);
        }
    }

    /**
     * Pause subscription
     */
    public function pause(PauseSubscriptionRequest $request, Subscription $subscription): RedirectResponse
    {
        $user = $request->user();

        if ($subscription->user_id !== $user->id) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Subscription not found.');
        }

        if ($subscription->status !== Subscription::STATUS_ACTIVE) {
            return back()->with('error', 'Only active subscriptions can be paused.');
        }

        $pausedUntil = $request->validated('paused_until')
            ? Carbon::parse($request->validated('paused_until'))
            : null;

        $subscription->pause($pausedUntil);
        $subscription->refresh();
        $this->notificationService->notifySubscriptionPaused($subscription);

        return back()->with('success', 'Subscription paused successfully.');
    }

    /**
     * Resume subscription
     */
    public function resume(Request $request, Subscription $subscription): RedirectResponse
    {
        $user = $request->user();

        if ($subscription->user_id !== $user->id) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Subscription not found.');
        }

        if ($subscription->status !== Subscription::STATUS_PAUSED) {
            return back()->with('error', 'Only paused subscriptions can be resumed.');
        }

        $subscription->resume();
        $subscription->refresh();
        $this->notificationService->notifySubscriptionResumed($subscription);

        return back()->with('success', 'Subscription resumed successfully.');
    }

    /**
     * Cancel subscription
     */
    public function cancel(CancelSubscriptionRequest $request, Subscription $subscription): RedirectResponse
    {
        $user = $request->user();

        if ($subscription->user_id !== $user->id) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Subscription not found.');
        }

        if ($subscription->status === Subscription::STATUS_CANCELLED) {
            return back()->with('error', 'Subscription is already cancelled.');
        }

        $subscription->cancel($request->validated('reason'));
        $subscription->refresh();
        $this->notificationService->notifySubscriptionCancelled($subscription);

        return redirect()->route('subscriptions.index')
            ->with('success', 'Subscription cancelled successfully.');
    }

    /**
     * Set vacation hold
     */
    public function setVacation(VacationRequest $request, Subscription $subscription): RedirectResponse
    {
        $user = $request->user();

        if ($subscription->user_id !== $user->id) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Subscription not found.');
        }

        if ($subscription->status !== Subscription::STATUS_ACTIVE) {
            return back()->with('error', 'Vacation can only be set for active subscriptions.');
        }

        $validated = $request->validated();
        $subscription->setVacation(
            Carbon::parse($validated['vacation_start']),
            Carbon::parse($validated['vacation_end'])
        );

        $subscription->refresh();
        $this->notificationService->notifySubscriptionVacationSet($subscription);

        return back()->with('success', 'Vacation hold set successfully.');
    }

    /**
     * Clear vacation hold
     */
    public function clearVacation(Request $request, Subscription $subscription): RedirectResponse
    {
        $user = $request->user();

        if ($subscription->user_id !== $user->id) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Subscription not found.');
        }

        $subscription->clearVacation();
        $subscription->refresh();
        $this->notificationService->notifySubscriptionVacationCleared($subscription);

        return back()->with('success', 'Vacation hold cleared.');
    }

    /**
     * Get delivery schedule for a month
     */
    public function getSchedule(Request $request, Subscription $subscription): JsonResponse
    {
        $user = $request->user();

        if ($subscription->user_id !== $user->id) {
            return response()->json(['error' => 'Subscription not found.'], 404);
        }

        $month = $request->integer('month', Carbon::now()->month);
        $year = $request->integer('year', Carbon::now()->year);

        $schedule = $this->scheduleService->getScheduleForMonth($subscription, $month, $year);

        return response()->json($schedule);
    }
}
