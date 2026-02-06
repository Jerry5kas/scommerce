<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrackingEvent;
use App\Services\AnalyticsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(
        private AnalyticsService $analyticsService
    ) {}

    /**
     * Display analytics dashboard.
     */
    public function dashboard(Request $request): Response
    {
        $startDate = $request->filled('start_date')
            ? Carbon::parse($request->start_date)
            : Carbon::now()->subDays(30);
        $endDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date)
            : Carbon::now();

        $data = $this->analyticsService->getDashboardData($startDate, $endDate);
        $revenueChart = $this->analyticsService->getRevenueChart($startDate, $endDate);
        $eventStats = $this->analyticsService->getEventStats($startDate, $endDate);
        $deviceBreakdown = $this->analyticsService->getDeviceBreakdown($startDate, $endDate);

        return Inertia::render('admin/analytics/dashboard', [
            'data' => $data,
            'revenueChart' => $revenueChart,
            'eventStats' => $eventStats,
            'deviceBreakdown' => $deviceBreakdown,
            'dateRange' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
        ]);
    }

    /**
     * Get events list.
     */
    public function events(Request $request): Response
    {
        $query = TrackingEvent::with('user:id,name,email');

        if ($request->filled('event_name')) {
            $query->byEvent($request->event_name);
        }

        if ($request->filled('event_category')) {
            $query->byCategory($request->event_category);
        }

        if ($request->filled('user_id')) {
            $query->byUser($request->user_id);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->byDate($request->start_date, $request->end_date);
        }

        $events = $query->orderByDesc('created_at')->paginate(50)->withQueryString();

        return Inertia::render('admin/analytics/events', [
            'events' => $events,
            'filters' => $request->only(['event_name', 'event_category', 'user_id', 'start_date', 'end_date']),
            'eventOptions' => TrackingEvent::eventOptions(),
            'categoryOptions' => TrackingEvent::categoryOptions(),
        ]);
    }

    /**
     * Get conversion funnel.
     */
    public function funnel(Request $request): Response
    {
        $startDate = $request->filled('start_date')
            ? Carbon::parse($request->start_date)
            : Carbon::now()->subDays(30);
        $endDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date)
            : Carbon::now();

        $funnel = $this->analyticsService->getConversionFunnel($startDate, $endDate);

        // Calculate conversion rates
        $rates = [];
        $previous = null;
        foreach ($funnel as $step => $count) {
            if ($previous !== null && $previous > 0) {
                $rates[$step] = round(($count / $previous) * 100, 2);
            } else {
                $rates[$step] = 100;
            }
            $previous = $count;
        }

        return Inertia::render('admin/analytics/funnel', [
            'funnel' => $funnel,
            'rates' => $rates,
            'dateRange' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
        ]);
    }

    /**
     * Get revenue analytics.
     */
    public function revenue(Request $request): Response
    {
        $startDate = $request->filled('start_date')
            ? Carbon::parse($request->start_date)
            : Carbon::now()->subDays(30);
        $endDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date)
            : Carbon::now();
        $groupBy = $request->get('group_by', 'day');

        $metrics = $this->analyticsService->getRevenueMetrics($startDate, $endDate);
        $chart = $this->analyticsService->getRevenueChart($startDate, $endDate, $groupBy);
        $topProducts = $this->analyticsService->getTopProducts(10, $startDate, $endDate);
        $topCategories = $this->analyticsService->getTopCategories(10, $startDate, $endDate);

        return Inertia::render('admin/analytics/revenue', [
            'metrics' => $metrics,
            'chart' => $chart,
            'topProducts' => $topProducts,
            'topCategories' => $topCategories,
            'dateRange' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
            'groupBy' => $groupBy,
        ]);
    }

    /**
     * Get product analytics.
     */
    public function products(Request $request): Response
    {
        $startDate = $request->filled('start_date')
            ? Carbon::parse($request->start_date)
            : Carbon::now()->subDays(30);
        $endDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date)
            : Carbon::now();

        $productViews = $this->analyticsService->getProductViews($startDate, $endDate);
        $topProducts = $this->analyticsService->getTopProducts(20, $startDate, $endDate);

        return Inertia::render('admin/analytics/products', [
            'productViews' => $productViews,
            'topProducts' => $topProducts,
            'dateRange' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
        ]);
    }
}
