<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Coupon;
use App\Models\Product;
use App\Services\CouponService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as ValidatorFacade;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function __construct(
        private CouponService $couponService
    ) {}

    /**
     * Display coupons list.
     */
    public function index(Request $request): Response
    {
        $query = Coupon::query();

        // Filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'expired') {
                $query->where('ends_at', '<', now());
            }
        }

        $coupons = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        // Stats
        $stats = [
            'total_coupons' => Coupon::count(),
            'active_coupons' => Coupon::active()->count(),
            'total_usages' => Coupon::sum('used_count'),
            'expired_coupons' => Coupon::where('ends_at', '<', now())->count(),
        ];

        return Inertia::render('admin/coupons/index', [
            'coupons' => $coupons,
            'stats' => $stats,
            'filters' => $request->only(['search', 'type', 'status']),
            'typeOptions' => Coupon::typeOptions(),
        ]);
    }

    /**
     * Show create coupon form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/coupons/create', [
            'typeOptions' => Coupon::typeOptions(),
            'applicableOptions' => Coupon::applicableOptions(),
            'categories' => Category::active()->select('id', 'name')->get(),
            'collections' => Collection::active()->select('id', 'name')->get(),
            'products' => Product::active()->select('id', 'name', 'sku')->limit(100)->get(),
        ]);
    }

    /**
     * Store new coupon.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateCouponPayload($request);

        $validated['code'] = strtoupper($validated['code']);

        Coupon::create($validated);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon created successfully.');
    }

    /**
     * Display coupon details.
     */
    public function show(Coupon $coupon): Response
    {
        $stats = $this->couponService->getCouponStats($coupon);

        $usages = $coupon->usages()
            ->with(['user:id,name,email', 'order:id,order_number,total'])
            ->orderByDesc('used_at')
            ->paginate(20);

        return Inertia::render('admin/coupons/show', [
            'coupon' => $coupon,
            'stats' => $stats,
            'usages' => $usages,
        ]);
    }

    /**
     * Show edit coupon form.
     */
    public function edit(Coupon $coupon): Response
    {
        return Inertia::render('admin/coupons/edit', [
            'coupon' => $coupon,
            'typeOptions' => Coupon::typeOptions(),
            'applicableOptions' => Coupon::applicableOptions(),
            'categories' => Category::active()->select('id', 'name')->get(),
            'collections' => Collection::active()->select('id', 'name')->get(),
            'products' => Product::active()->select('id', 'name', 'sku')->limit(100)->get(),
        ]);
    }

    /**
     * Update coupon.
     */
    public function update(Request $request, Coupon $coupon): RedirectResponse
    {
        $validated = $this->validateCouponPayload($request, $coupon);

        $validated['code'] = strtoupper($validated['code']);

        $coupon->update($validated);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon updated successfully.');
    }

    /**
     * Delete coupon.
     */
    public function destroy(Coupon $coupon): RedirectResponse
    {
        // Don't delete if coupon has usages
        if ($coupon->usages()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete a coupon that has been used.']);
        }

        $coupon->delete();

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon deleted successfully.');
    }

    /**
     * Toggle coupon status.
     */
    public function toggleStatus(Coupon $coupon): RedirectResponse
    {
        $coupon->update(['is_active' => ! $coupon->is_active]);

        $status = $coupon->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Coupon {$status}.");
    }

    /**
     * Get coupon usages.
     */
    public function usages(Coupon $coupon): Response
    {
        $usages = $coupon->usages()
            ->with(['user:id,name,email', 'order:id,order_number,total'])
            ->orderByDesc('used_at')
            ->paginate(30);

        return Inertia::render('admin/coupons/usages', [
            'coupon' => $coupon,
            'usages' => $usages,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateCouponPayload(Request $request, ?Coupon $coupon = null): array
    {
        $rules = [
            'code' => [
                'required',
                'string',
                'min:3',
                'max:50',
                Rule::unique('coupons', 'code')->ignore($coupon?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'type' => ['required', Rule::in(['percentage', 'fixed', 'free_shipping'])],
            'value' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'usage_limit_per_user' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'applicable_to' => ['required', Rule::in(['all', 'products', 'categories', 'collections'])],
            'applicable_ids' => ['required_unless:applicable_to,all', 'array'],
            'applicable_ids.*' => ['integer'],
            'exclude_free_samples' => ['boolean'],
            'exclude_subscriptions' => ['boolean'],
            'first_order_only' => ['boolean'],
            'new_users_only' => ['boolean'],
        ];

        $validator = ValidatorFacade::make($request->all(), $rules);
        $validator->after($this->couponAfterValidation($request));

        return $validator->validate();
    }

    /**
     * @return \Closure(\Illuminate\Contracts\Validation\Validator): void
     */
    protected function couponAfterValidation(Request $request): \Closure
    {
        return function (Validator $validator) use ($request): void {
            $type = (string) $request->input('type');
            $value = (float) $request->input('value', 0);
            $applicableTo = (string) $request->input('applicable_to', 'all');
            $applicableIds = $request->input('applicable_ids', []);

            if ($type === Coupon::TYPE_PERCENTAGE && $value > 100) {
                $validator->errors()->add('value', 'Percentage coupon value cannot exceed 100.');
            }

            if ($type === Coupon::TYPE_FREE_SHIPPING && $value !== 0.0) {
                $validator->errors()->add('value', 'Free shipping coupon value must be 0.');
            }

            if ($applicableTo !== Coupon::APPLICABLE_ALL) {
                if (! is_array($applicableIds) || count($applicableIds) === 0) {
                    $validator->errors()->add('applicable_ids', 'Select at least one applicable item.');

                    return;
                }

                $modelClass = match ($applicableTo) {
                    Coupon::APPLICABLE_PRODUCTS => Product::class,
                    Coupon::APPLICABLE_CATEGORIES => Category::class,
                    Coupon::APPLICABLE_COLLECTIONS => Collection::class,
                    default => null,
                };

                if ($modelClass !== null) {
                    $validCount = $modelClass::query()->whereIn('id', $applicableIds)->count();
                    if ($validCount !== count($applicableIds)) {
                        $validator->errors()->add('applicable_ids', 'One or more selected items are invalid.');
                    }
                }
            }
        };
    }
}
