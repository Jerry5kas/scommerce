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
            ->orderBy('sort_order')
            ->paginate(20);

        return Inertia::render('admin/subscription-plans/index', [
            'plans' => $plans,
            'frequencyOptions' => [
                SubscriptionPlan::FREQUENCY_DAILY => 'Daily',
                SubscriptionPlan::FREQUENCY_ALTERNATE => 'Alternate Days',
                SubscriptionPlan::FREQUENCY_WEEKLY => 'Weekly',
                SubscriptionPlan::FREQUENCY_CUSTOM => 'Custom',
            ],
        ]);
    }

    /**
     * Show create form
     */
    public function create(): Response
    {
        return Inertia::render('admin/subscription-plans/create', [
            'products' => \App\Models\Product::select('id', 'name')->orderBy('name')->get(),
            'frequencyOptions' => [
                SubscriptionPlan::FREQUENCY_DAILY => 'Daily',
                SubscriptionPlan::FREQUENCY_ALTERNATE => 'Alternate Days',
                SubscriptionPlan::FREQUENCY_WEEKLY => 'Weekly',
                SubscriptionPlan::FREQUENCY_CUSTOM => 'Custom',
            ],
            'discountOptions' => [
                SubscriptionPlan::DISCOUNT_NONE => 'No Discount',
                SubscriptionPlan::DISCOUNT_PERCENTAGE => 'Percentage',
                SubscriptionPlan::DISCOUNT_FLAT => 'Flat Amount',
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
            'frequency_type' => ['required', 'string', 'in:daily,alternate,weekly,custom'],
            'discount_type' => ['required', 'string', 'in:none,percentage,flat'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.units' => ['required', 'integer', 'min:1'],
            'items.*.total_price' => ['required', 'numeric', 'min:0'],
            'items.*.per_unit_price' => ['required', 'numeric', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*.title' => ['required', 'string', 'max:255'],
            'features.*.highlight' => ['boolean'],
        ]);

        $plan = SubscriptionPlan::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'frequency_type' => $validated['frequency_type'],
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        foreach ($validated['items'] as $item) {
            $plan->items()->create($item);
        }

        if (!empty($validated['features'])) {
            foreach ($validated['features'] as $feature) {
                $plan->features()->create($feature);
            }
        }

        return redirect()->route('admin.subscription-plans.index')
            ->with('success', "Plan '{$plan->name}' created successfully.");
    }

    /**
     * Show edit form
     */
    public function edit(SubscriptionPlan $subscriptionPlan): Response
    {
        return Inertia::render('admin/subscription-plans/edit', [
            'plan' => $subscriptionPlan->load(['items.product', 'features']),
            'products' => \App\Models\Product::select('id', 'name')->orderBy('name')->get(),
            'frequencyOptions' => [
                SubscriptionPlan::FREQUENCY_DAILY => 'Daily',
                SubscriptionPlan::FREQUENCY_ALTERNATE => 'Alternate Days',
                SubscriptionPlan::FREQUENCY_WEEKLY => 'Weekly',
                SubscriptionPlan::FREQUENCY_CUSTOM => 'Custom',
            ],
            'discountOptions' => [
                SubscriptionPlan::DISCOUNT_NONE => 'No Discount',
                SubscriptionPlan::DISCOUNT_PERCENTAGE => 'Percentage',
                SubscriptionPlan::DISCOUNT_FLAT => 'Flat Amount',
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
            'frequency_type' => ['required', 'string', 'in:daily,alternate,weekly,custom'],
            'discount_type' => ['required', 'string', 'in:none,percentage,flat'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.units' => ['required', 'integer', 'min:1'],
            'items.*.total_price' => ['required', 'numeric', 'min:0'],
            'items.*.per_unit_price' => ['required', 'numeric', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*.title' => ['required', 'string', 'max:255'],
            'features.*.highlight' => ['boolean'],
        ]);

        $subscriptionPlan->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'frequency_type' => $validated['frequency_type'],
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        // Sync items: Delete all and recreate
        $subscriptionPlan->items()->delete();
        foreach ($validated['items'] as $item) {
            $subscriptionPlan->items()->create($item);
        }

        // Sync features: Delete all and recreate
        $subscriptionPlan->features()->delete();
        if (!empty($validated['features'])) {
            foreach ($validated['features'] as $feature) {
                $subscriptionPlan->features()->create($feature);
            }
        }

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
