<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionPlanController extends Controller
{
    /**
     * List all subscription plans
     */
    public function index(): Response
    {
        $plans = SubscriptionPlan::query()
            ->withCount('subscriptions')
            ->orderBy('display_order')
            ->paginate(20);

        return Inertia::render('admin/subscription-plans/index', [
            'plans' => $plans,
            'frequencyOptions' => SubscriptionPlan::frequencyOptions(),
        ]);
    }

    /**
     * Show create form
     */
    public function create(): Response
    {
        return Inertia::render('admin/subscription-plans/create', [
            'frequencyOptions' => SubscriptionPlan::frequencyOptions(),
            'dayOptions' => [
                0 => 'Sunday',
                1 => 'Monday',
                2 => 'Tuesday',
                3 => 'Wednesday',
                4 => 'Thursday',
                5 => 'Friday',
                6 => 'Saturday',
            ],
        ]);
    }

    /**
     * Store new subscription plan
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'frequency_type' => ['required', 'string', 'in:daily,alternate_days,weekly,custom'],
            'frequency_value' => ['nullable', 'integer', 'min:1', 'max:30'],
            'days_of_week' => ['nullable', 'array'],
            'days_of_week.*' => ['integer', 'min:0', 'max:6'],
            'discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'min_deliveries' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $plan = SubscriptionPlan::create($validated);

        return redirect()->route('admin.subscription-plans.index')
            ->with('success', "Plan '{$plan->name}' created successfully.");
    }

    /**
     * Show edit form
     */
    public function edit(SubscriptionPlan $subscriptionPlan): Response
    {
        return Inertia::render('admin/subscription-plans/edit', [
            'plan' => $subscriptionPlan,
            'frequencyOptions' => SubscriptionPlan::frequencyOptions(),
            'dayOptions' => [
                0 => 'Sunday',
                1 => 'Monday',
                2 => 'Tuesday',
                3 => 'Wednesday',
                4 => 'Thursday',
                5 => 'Friday',
                6 => 'Saturday',
            ],
        ]);
    }

    /**
     * Update subscription plan
     */
    public function update(Request $request, SubscriptionPlan $subscriptionPlan): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'frequency_type' => ['required', 'string', 'in:daily,alternate_days,weekly,custom'],
            'frequency_value' => ['nullable', 'integer', 'min:1', 'max:30'],
            'days_of_week' => ['nullable', 'array'],
            'days_of_week.*' => ['integer', 'min:0', 'max:6'],
            'discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'min_deliveries' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $subscriptionPlan->update($validated);

        return redirect()->route('admin.subscription-plans.index')
            ->with('success', "Plan '{$subscriptionPlan->name}' updated successfully.");
    }

    /**
     * Delete subscription plan
     */
    public function destroy(SubscriptionPlan $subscriptionPlan): RedirectResponse
    {
        // Check if plan has active subscriptions
        $activeCount = $subscriptionPlan->subscriptions()->active()->count();
        if ($activeCount > 0) {
            return back()->with('error', "Cannot delete plan with {$activeCount} active subscriptions.");
        }

        $name = $subscriptionPlan->name;
        $subscriptionPlan->delete();

        return redirect()->route('admin.subscription-plans.index')
            ->with('success', "Plan '{$name}' deleted successfully.");
    }

    /**
     * Toggle plan active status
     */
    public function toggleStatus(SubscriptionPlan $subscriptionPlan): RedirectResponse
    {
        $subscriptionPlan->is_active = ! $subscriptionPlan->is_active;
        $subscriptionPlan->save();

        $status = $subscriptionPlan->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Plan '{$subscriptionPlan->name}' {$status}.");
    }
}
