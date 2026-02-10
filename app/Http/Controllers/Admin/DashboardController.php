<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Wallet;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();

        $totalUsers = User::query()->count();
        $activeSubscriptions = Subscription::query()->where('status', 'active')->count();
        $todayOrders = Order::query()->whereDate('created_at', $today)->count();
        $todayDeliveries = Delivery::query()->whereDate('scheduled_date', $today)->count();

        $revenueToday = (float) Payment::query()
            ->where('status', Payment::STATUS_COMPLETED)
            ->whereDate('paid_at', $today)
            ->sum('amount');

        $revenueWeek = (float) Payment::query()
            ->where('status', Payment::STATUS_COMPLETED)
            ->whereBetween('paid_at', [$startOfWeek, Carbon::now()])
            ->sum('amount');

        $revenueMonth = (float) Payment::query()
            ->where('status', Payment::STATUS_COMPLETED)
            ->whereBetween('paid_at', [$startOfMonth, Carbon::now()])
            ->sum('amount');

        $pendingDeliveries = Delivery::query()
            ->whereIn('status', [Delivery::STATUS_PENDING, Delivery::STATUS_ASSIGNED])
            ->count();

        $lowWalletBalances = Wallet::query()
            ->active()
            ->whereColumn('balance', '<=', 'low_balance_threshold')
            ->count();

        $pendingProofVerifications = Delivery::query()
            ->whereNotNull('delivery_proof_image')
            ->where(function ($q) {
                $q->where('delivery_proof_verified', false)->orWhereNull('delivery_proof_verified');
            })
            ->count();

        $days = collect(range(0, 6))->map(function ($i) {
            return Carbon::today()->subDays(6 - $i);
        });

        $revenue7d = $days->map(function (Carbon $day) {
            return [
                'date' => $day->toDateString(),
                'value' => (float) Payment::query()
                    ->where('status', Payment::STATUS_COMPLETED)
                    ->whereDate('paid_at', $day)
                    ->sum('amount'),
            ];
        })->all();

        $orders7d = $days->map(function (Carbon $day) {
            return [
                'date' => $day->toDateString(),
                'value' => (int) Order::query()->whereDate('created_at', $day)->count(),
            ];
        })->all();

        $weeks = collect(range(0, 7))->map(function ($i) {
            return Carbon::now()->startOfWeek()->subWeeks(7 - $i);
        });

        $subscriptions8w = $weeks->map(function (Carbon $weekStart) {
            $weekEnd = $weekStart->copy()->endOfWeek();

            return [
                'date' => $weekStart->format('Y-m-d'),
                'value' => (int) Subscription::query()
                    ->whereBetween('created_at', [$weekStart, $weekEnd])
                    ->count(),
            ];
        })->all();

        $deliveryRate7d = $days->map(function (Carbon $day) {
            return [
                'date' => $day->toDateString(),
                'delivered' => (int) Delivery::query()
                    ->where('status', Delivery::STATUS_DELIVERED)
                    ->whereDate('delivered_at', $day)
                    ->count(),
                'failed' => (int) Delivery::query()
                    ->where('status', Delivery::STATUS_FAILED)
                    ->whereDate('updated_at', $day)
                    ->count(),
            ];
        })->all();

        $recentOrders = Order::query()
            ->latest('created_at')
            ->limit(5)
            ->get(['id', 'order_number', 'status', 'total', 'created_at']);
        $recentDeliveries = Delivery::query()
            ->latest('scheduled_date')
            ->latest('id')
            ->limit(5)
            ->get(['id', 'status', 'scheduled_date', 'delivered_at']);
        $recentSubscriptions = Subscription::query()
            ->latest('created_at')
            ->limit(5)
            ->get(['id', 'status', 'start_date', 'next_delivery_date']);

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'activeSubscriptions' => $activeSubscriptions,
                'todayOrders' => $todayOrders,
                'todayDeliveries' => $todayDeliveries,
                'revenueToday' => $revenueToday,
                'revenueWeek' => $revenueWeek,
                'revenueMonth' => $revenueMonth,
                'pendingDeliveries' => $pendingDeliveries,
                'lowWalletBalances' => $lowWalletBalances,
                'pendingProofVerifications' => $pendingProofVerifications,
            ],
            'charts' => [
                'revenue7d' => $revenue7d,
                'orders7d' => $orders7d,
                'subscriptions8w' => $subscriptions8w,
                'deliveryRate7d' => $deliveryRate7d,
            ],
            'recent' => [
                'orders' => $recentOrders,
                'deliveries' => $recentDeliveries,
                'subscriptions' => $recentSubscriptions,
            ],
        ]);
    }
}
