<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\TrackingEvent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get dashboard metrics
     *
     * @return array<string, mixed>
     */
    public function getDashboardData(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate ??= Carbon::now()->subDays(30);
        $endDate ??= Carbon::now();

        return [
            'revenue' => $this->getRevenueMetrics($startDate, $endDate),
            'orders' => $this->getOrderMetrics($startDate, $endDate),
            'users' => $this->getUserMetrics($startDate, $endDate),
            'subscriptions' => $this->getSubscriptionMetrics($startDate, $endDate),
            'top_products' => $this->getTopProducts(5, $startDate, $endDate),
            'conversion_funnel' => $this->getConversionFunnel($startDate, $endDate),
        ];
    }

    /**
     * Get revenue metrics
     *
     * @return array<string, mixed>
     */
    public function getRevenueMetrics(Carbon $startDate, Carbon $endDate): array
    {
        $currentRevenue = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_status', 'paid')
            ->sum('total');

        $previousStart = $startDate->copy()->subDays($endDate->diffInDays($startDate));
        $previousRevenue = Order::whereBetween('created_at', [$previousStart, $startDate])
            ->where('payment_status', 'paid')
            ->sum('total');

        $growth = $previousRevenue > 0
            ? round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 2)
            : 0;

        return [
            'total' => (float) $currentRevenue,
            'previous' => (float) $previousRevenue,
            'growth' => $growth,
            'daily_average' => $currentRevenue / max(1, $endDate->diffInDays($startDate)),
        ];
    }

    /**
     * Get order metrics
     *
     * @return array<string, mixed>
     */
    public function getOrderMetrics(Carbon $startDate, Carbon $endDate): array
    {
        $orders = Order::whereBetween('created_at', [$startDate, $endDate]);

        return [
            'total' => $orders->count(),
            'completed' => (clone $orders)->where('status', 'delivered')->count(),
            'cancelled' => (clone $orders)->where('status', 'cancelled')->count(),
            'average_value' => (float) $orders->avg('total') ?? 0,
            'by_status' => Order::whereBetween('created_at', [$startDate, $endDate])
                ->select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray(),
        ];
    }

    /**
     * Get user metrics
     *
     * @return array<string, mixed>
     */
    public function getUserMetrics(Carbon $startDate, Carbon $endDate): array
    {
        $newUsers = User::whereBetween('created_at', [$startDate, $endDate])->count();
        $activeUsers = User::where('last_login_at', '>=', $startDate)->count();

        return [
            'total' => User::count(),
            'new' => $newUsers,
            'active' => $activeUsers,
            'with_orders' => User::has('orders')->count(),
            'with_subscriptions' => User::has('subscriptions')->count(),
        ];
    }

    /**
     * Get subscription metrics
     *
     * @return array<string, mixed>
     */
    public function getSubscriptionMetrics(Carbon $startDate, Carbon $endDate): array
    {
        $newSubscriptions = Subscription::whereBetween('created_at', [$startDate, $endDate])->count();

        return [
            'total' => Subscription::count(),
            'active' => Subscription::active()->count(),
            'new' => $newSubscriptions,
            'cancelled' => Subscription::cancelled()
                ->whereBetween('cancelled_at', [$startDate, $endDate])
                ->count(),
            'paused' => Subscription::paused()->count(),
        ];
    }

    /**
     * Get top products by sales
     *
     * @return array<int, array<string, mixed>>
     */
    public function getTopProducts(int $limit, Carbon $startDate, Carbon $endDate): array
    {
        return DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.status', '!=', 'cancelled')
            ->select(
                'products.id',
                'products.name',
                'products.sku',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get top categories by sales
     *
     * @return array<int, array<string, mixed>>
     */
    public function getTopCategories(int $limit, Carbon $startDate, Carbon $endDate): array
    {
        return DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.status', '!=', 'cancelled')
            ->select(
                'categories.id',
                'categories.name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get conversion funnel
     *
     * @return array<string, int>
     */
    public function getConversionFunnel(Carbon $startDate, Carbon $endDate): array
    {
        return [
            'product_views' => TrackingEvent::byEvent(TrackingEvent::EVENT_VIEW_ITEM)
                ->byDate($startDate, $endDate)
                ->count(),
            'add_to_cart' => TrackingEvent::byEvent(TrackingEvent::EVENT_ADD_TO_CART)
                ->byDate($startDate, $endDate)
                ->count(),
            'checkout_started' => TrackingEvent::byEvent(TrackingEvent::EVENT_BEGIN_CHECKOUT)
                ->byDate($startDate, $endDate)
                ->count(),
            'purchases' => TrackingEvent::byEvent(TrackingEvent::EVENT_PURCHASE)
                ->byDate($startDate, $endDate)
                ->count(),
        ];
    }

    /**
     * Get revenue chart data
     *
     * @return array<int, array<string, mixed>>
     */
    public function getRevenueChart(Carbon $startDate, Carbon $endDate, string $groupBy = 'day'): array
    {
        $dateFormat = match ($groupBy) {
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        return DB::table('orders')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_status', 'paid')
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->toArray();
    }

    /**
     * Get product views
     *
     * @return array<int, array<string, mixed>>
     */
    public function getProductViews(Carbon $startDate, Carbon $endDate, ?int $productId = null): array
    {
        $query = TrackingEvent::byEvent(TrackingEvent::EVENT_VIEW_ITEM)
            ->byDate($startDate, $endDate)
            ->select(
                DB::raw("JSON_EXTRACT(properties, '$.product_id') as product_id"),
                DB::raw("JSON_EXTRACT(properties, '$.product_name') as product_name"),
                DB::raw('COUNT(*) as views')
            )
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('views');

        if ($productId) {
            $query->whereRaw("JSON_EXTRACT(properties, '$.product_id') = ?", [$productId]);
        }

        return $query->limit(20)->get()->toArray();
    }

    /**
     * Get event stats
     *
     * @return array<string, int>
     */
    public function getEventStats(Carbon $startDate, Carbon $endDate): array
    {
        return TrackingEvent::byDate($startDate, $endDate)
            ->select('event_name', DB::raw('COUNT(*) as count'))
            ->groupBy('event_name')
            ->pluck('count', 'event_name')
            ->toArray();
    }

    /**
     * Get device breakdown
     *
     * @return array<string, int>
     */
    public function getDeviceBreakdown(Carbon $startDate, Carbon $endDate): array
    {
        return TrackingEvent::byDate($startDate, $endDate)
            ->select('device_type', DB::raw('COUNT(*) as count'))
            ->groupBy('device_type')
            ->pluck('count', 'device_type')
            ->toArray();
    }
}
