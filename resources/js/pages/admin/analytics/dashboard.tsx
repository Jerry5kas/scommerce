import { Head, Link, router } from '@inertiajs/react';
import { BarChart3, DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface RevenueMetrics {
    total: number;
    previous: number;
    growth: number;
    daily_average: number;
}

interface OrderMetrics {
    total: number;
    completed: number;
    cancelled: number;
    average_value: number;
    by_status: Record<string, number>;
}

interface UserMetrics {
    total: number;
    new: number;
    active: number;
    with_orders: number;
    with_subscriptions: number;
}

interface SubscriptionMetrics {
    total: number;
    active: number;
    new: number;
    cancelled: number;
    paused: number;
}

interface TopProduct {
    id: number;
    name: string;
    sku: string;
    total_quantity: number;
    total_revenue: number;
}

interface ConversionFunnel {
    product_views: number;
    add_to_cart: number;
    checkout_started: number;
    purchases: number;
}

interface RevenueChartItem {
    period: string;
    revenue: number;
    orders: number;
}

interface Props {
    data: {
        revenue: RevenueMetrics;
        orders: OrderMetrics;
        users: UserMetrics;
        subscriptions: SubscriptionMetrics;
        top_products: TopProduct[];
        conversion_funnel: ConversionFunnel;
    };
    revenueChart: RevenueChartItem[];
    eventStats: Record<string, number>;
    deviceBreakdown: Record<string, number>;
    dateRange: { start: string; end: string };
}

export default function AnalyticsDashboard({ data, revenueChart, eventStats, deviceBreakdown, dateRange }: Props) {
    const [startDate, setStartDate] = useState(dateRange.start);
    const [endDate, setEndDate] = useState(dateRange.end);

    const handleDateChange = () => {
        router.get('/admin/analytics', { start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    return (
        <AdminLayout>
            <Head title="Analytics" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <button onClick={handleDateChange} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
                            Apply
                        </button>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/analytics" className="rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700">
                        Overview
                    </Link>
                    <Link href="/admin/analytics/revenue" className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
                        Revenue
                    </Link>
                    <Link href="/admin/analytics/funnel" className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
                        Funnel
                    </Link>
                    <Link href="/admin/analytics/events" className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
                        Events
                    </Link>
                    <Link href="/admin/analytics/products" className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
                        Products
                    </Link>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Revenue</p>
                                <p className="text-xl font-bold">{formatCurrency(data.revenue.total)}</p>
                                <p className={`text-xs ${data.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {data.revenue.growth >= 0 ? '+' : ''}{data.revenue.growth}% from previous
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Orders</p>
                                <p className="text-xl font-bold">{data.orders.total}</p>
                                <p className="text-xs text-gray-500">
                                    Avg: {formatCurrency(data.orders.average_value)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">New Users</p>
                                <p className="text-xl font-bold">{data.users.new}</p>
                                <p className="text-xs text-gray-500">
                                    Total: {data.users.total}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-100 p-2">
                                <TrendingUp className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Subscriptions</p>
                                <p className="text-xl font-bold">{data.subscriptions.active}</p>
                                <p className="text-xs text-gray-500">
                                    New: {data.subscriptions.new}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Conversion Funnel */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Conversion Funnel</h2>
                        <div className="space-y-3">
                            {Object.entries(data.conversion_funnel).map(([key, value], index, arr) => {
                                const rate = index > 0 && arr[index - 1][1] > 0
                                    ? ((value / arr[index - 1][1]) * 100).toFixed(1)
                                    : '100';
                                const labels: Record<string, string> = {
                                    product_views: 'Product Views',
                                    add_to_cart: 'Add to Cart',
                                    checkout_started: 'Checkout Started',
                                    purchases: 'Purchases',
                                };
                                return (
                                    <div key={key} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 rounded bg-indigo-100" style={{ width: `${Math.max(20, (value / Math.max(...Object.values(data.conversion_funnel))) * 200)}px` }} />
                                            <span className="text-sm font-medium">{labels[key] || key}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold">{value.toLocaleString()}</span>
                                            <span className="ml-2 text-xs text-gray-500">({rate}%)</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Top Products</h2>
                        <div className="space-y-3">
                            {data.top_products.length === 0 ? (
                                <p className="text-gray-500">No data available</p>
                            ) : (
                                data.top_products.map((product, index) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.total_quantity} sold</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-green-600">{formatCurrency(product.total_revenue)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Event Stats */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Event Breakdown</h2>
                        <div className="space-y-2">
                            {Object.entries(eventStats).length === 0 ? (
                                <p className="text-gray-500">No events tracked yet</p>
                            ) : (
                                Object.entries(eventStats)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 10)
                                    .map(([event, count]) => (
                                        <div key={event} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50">
                                            <span className="text-sm">{event.replace(/_/g, ' ')}</span>
                                            <span className="font-medium">{count.toLocaleString()}</span>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Device Breakdown</h2>
                        <div className="space-y-3">
                            {Object.entries(deviceBreakdown).length === 0 ? (
                                <p className="text-gray-500">No device data available</p>
                            ) : (
                                Object.entries(deviceBreakdown).map(([device, count]) => {
                                    const total = Object.values(deviceBreakdown).reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                                    return (
                                        <div key={device}>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="capitalize">{device}</span>
                                                <span>{percentage}%</span>
                                            </div>
                                            <div className="mt-1 h-2 rounded-full bg-gray-100">
                                                <div
                                                    className="h-2 rounded-full bg-indigo-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Revenue Chart Placeholder */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Revenue Over Time</h2>
                    {revenueChart.length === 0 ? (
                        <p className="text-gray-500">No revenue data available</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left text-sm font-medium text-gray-500">Period</th>
                                        <th className="py-2 text-right text-sm font-medium text-gray-500">Revenue</th>
                                        <th className="py-2 text-right text-sm font-medium text-gray-500">Orders</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {revenueChart.slice(0, 14).map((item) => (
                                        <tr key={item.period} className="border-b">
                                            <td className="py-2 text-sm">{item.period}</td>
                                            <td className="py-2 text-right font-medium text-green-600">{formatCurrency(item.revenue)}</td>
                                            <td className="py-2 text-right text-sm">{item.orders}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

