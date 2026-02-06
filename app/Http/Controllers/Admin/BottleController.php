<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\IssueBottleRequest;
use App\Http\Requests\ReturnBottleRequest;
use App\Http\Requests\StoreBottleRequest;
use App\Models\Bottle;
use App\Models\BottleLog;
use App\Models\Subscription;
use App\Models\User;
use App\Services\BottleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BottleController extends Controller
{
    public function __construct(
        private BottleService $bottleService
    ) {}

    /**
     * Display a listing of bottles.
     */
    public function index(Request $request): Response
    {
        $query = Bottle::query()
            ->with(['currentUser', 'currentSubscription']);

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('user_id')) {
            $query->where('current_user_id', $request->user_id);
        }

        if ($request->filled('subscription_id')) {
            $query->where('current_subscription_id', $request->subscription_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('bottle_number', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        $bottles = $query->latest()
            ->paginate(20)
            ->withQueryString();

        $stats = $this->bottleService->getBottleStats();

        return Inertia::render('admin/bottles/index', [
            'bottles' => $bottles,
            'filters' => $request->only(['status', 'type', 'user_id', 'subscription_id', 'search']),
            'stats' => $stats,
            'statusOptions' => Bottle::statusOptions(),
            'typeOptions' => Bottle::typeOptions(),
        ]);
    }

    /**
     * Show the form for creating a new bottle.
     */
    public function create(): Response
    {
        return Inertia::render('admin/bottles/create', [
            'typeOptions' => Bottle::typeOptions(),
            'nextBottleNumber' => Bottle::generateBottleNumber(),
        ]);
    }

    /**
     * Store a newly created bottle.
     */
    public function store(StoreBottleRequest $request): RedirectResponse
    {
        $bottle = $this->bottleService->createBottle($request->validated());

        return redirect()
            ->route('admin.bottles.show', $bottle)
            ->with('success', 'Bottle created successfully.');
    }

    /**
     * Display the specified bottle.
     */
    public function show(Bottle $bottle): Response
    {
        $bottle->load(['currentUser', 'currentSubscription', 'logs' => fn ($q) => $q->latest()->limit(20)]);

        return Inertia::render('admin/bottles/show', [
            'bottle' => $bottle,
            'statusOptions' => Bottle::statusOptions(),
            'typeOptions' => Bottle::typeOptions(),
        ]);
    }

    /**
     * Show the form for editing the specified bottle.
     */
    public function edit(Bottle $bottle): Response
    {
        return Inertia::render('admin/bottles/edit', [
            'bottle' => $bottle,
            'typeOptions' => Bottle::typeOptions(),
        ]);
    }

    /**
     * Update the specified bottle.
     */
    public function update(Request $request, Bottle $bottle): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['sometimes', 'string', 'in:standard,premium,custom'],
            'capacity' => ['nullable', 'numeric', 'min:0.1', 'max:100'],
            'purchase_cost' => ['nullable', 'numeric', 'min:0'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $bottle->update($validated);

        return back()->with('success', 'Bottle updated successfully.');
    }

    /**
     * Issue a bottle to a user.
     */
    public function issue(IssueBottleRequest $request, Bottle $bottle): RedirectResponse
    {
        $user = User::findOrFail($request->user_id);
        $subscription = $request->subscription_id
            ? Subscription::find($request->subscription_id)
            : null;

        $result = $this->bottleService->issueBottle($user, $bottle, $subscription, null, [
            'action_by' => BottleLog::ACTION_BY_ADMIN,
            'action_by_id' => $request->user()->id,
            'notes' => $request->notes,
        ]);

        if (! $result['success']) {
            return back()->with('error', $result['error']);
        }

        return back()->with('success', "Bottle issued to {$user->name}.");
    }

    /**
     * Return a bottle.
     */
    public function return(ReturnBottleRequest $request, Bottle $bottle): RedirectResponse
    {
        $result = $this->bottleService->returnBottle($bottle, $request->condition, null, [
            'action_by' => BottleLog::ACTION_BY_ADMIN,
            'action_by_id' => $request->user()->id,
            'notes' => $request->notes,
        ]);

        if (! $result['success']) {
            return back()->with('error', $result['error']);
        }

        $message = 'Bottle returned successfully.';
        if ($result['refund'] > 0) {
            $message .= " Refund: ₹{$result['refund']}";
        }

        return back()->with('success', $message);
    }

    /**
     * Mark bottle as damaged.
     */
    public function markDamaged(Request $request, Bottle $bottle): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $result = $this->bottleService->markAsDamaged($bottle, $validated['reason'], null, [
            'action_by' => BottleLog::ACTION_BY_ADMIN,
            'action_by_id' => $request->user()->id,
        ]);

        if (! $result['success']) {
            return back()->with('error', $result['error']);
        }

        return back()->with('success', 'Bottle marked as damaged.');
    }

    /**
     * Mark bottle as lost.
     */
    public function markLost(Request $request, Bottle $bottle): RedirectResponse
    {
        $result = $this->bottleService->markAsLost($bottle, [
            'action_by' => BottleLog::ACTION_BY_ADMIN,
            'action_by_id' => $request->user()->id,
        ]);

        if (! $result['success']) {
            return back()->with('error', $result['error']);
        }

        return back()->with('success', 'Bottle marked as lost.');
    }

    /**
     * Get bottle logs.
     */
    public function logs(Bottle $bottle): JsonResponse
    {
        $logs = $bottle->logs()
            ->with(['user', 'subscription', 'delivery'])
            ->paginate(20);

        return response()->json($logs);
    }

    /**
     * Get bottle reports.
     */
    public function reports(Request $request): Response
    {
        $startDate = $request->get('start_date', now()->subMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        $stats = $this->bottleService->getBottleStats();

        $issuedByDate = BottleLog::issued()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $returnedByDate = BottleLog::returned()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $byType = Bottle::selectRaw('type, status, count(*) as count')
            ->groupBy('type', 'status')
            ->get();

        return Inertia::render('admin/bottles/reports', [
            'stats' => $stats,
            'issuedByDate' => $issuedByDate,
            'returnedByDate' => $returnedByDate,
            'byType' => $byType,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Scan barcode and find bottle.
     */
    public function scanBarcode(Request $request): JsonResponse
    {
        $request->validate(['barcode' => 'required|string']);

        $bottle = $this->bottleService->getBottleByBarcode($request->barcode);

        if (! $bottle) {
            return response()->json([
                'success' => false,
                'error' => 'Bottle not found.',
            ], 404);
        }

        $bottle->load(['currentUser', 'currentSubscription']);

        return response()->json([
            'success' => true,
            'bottle' => $bottle,
        ]);
    }
}
