import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, Calendar, CheckCircle2, Package, Truck, Users, Wallet } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AdminLayout from '@/layouts/AdminLayout';

interface MetricStats {
    totalUsers: number;
    activeSubscriptions: number;
    todayOrders: number;
    todayDeliveries: number;
    revenueToday: number;
    revenueWeek: number;
    revenueMonth: number;
    pendingDeliveries: number;
    lowWalletBalances: number;
    pendingProofVerifications: number;
}

interface ChartPoint {
    date: string;
    value: number;
}

interface DeliveryRatePoint {
    date: string;
    delivered: number;
    failed: number;
}

interface Props {
    stats: MetricStats;
    charts?: {
        revenue7d?: ChartPoint[];
        orders7d?: ChartPoint[];
        subscriptions8w?: ChartPoint[];
        deliveryRate7d?: DeliveryRatePoint[];
    };
    recent?: {
        orders?: { id: number; order_number: string; status: string; total: string | number; created_at: string }[];
        deliveries?: { id: number; status: string; scheduled_date: string | null; delivered_at: string | null }[];
        subscriptions?: { id: number; status: string; start_date: string; next_delivery_date: string | null }[];
    };
}

export default function AdminDashboard({ stats, charts, recent }: Props) {
    const revenueData = charts?.revenue7d ?? [];
    const ordersData = charts?.orders7d ?? [];
    const subsData = charts?.subscriptions8w ?? [];
    const deliveryRateData = charts?.deliveryRate7d ?? [];
    const message = (usePage().props as any)?.message as string | undefined;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                {message && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Users</p>
                                <p className="text-xl font-bold">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-100 p-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Subscriptions</p>
                                <p className="text-xl font-bold">{stats.activeSubscriptions}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-2">
                                <Package className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Today’s Orders</p>
                                <p className="text-xl font-bold">{stats.todayOrders}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-100 p-2">
                                <Truck className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Today’s Deliveries</p>
                                <p className="text-xl font-bold">{stats.todayDeliveries}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                                <Wallet className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Revenue Today</p>
                                <p className="text-xl font-bold">₹{Number(stats.revenueToday).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                                <Wallet className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Revenue This Week</p>
                                <p className="text-xl font-bold">₹{Number(stats.revenueWeek).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                                <Wallet className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Revenue This Month</p>
                                <p className="text-xl font-bold">₹{Number(stats.revenueMonth).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Revenue (Last 7 Days)</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Orders (Last 7 Days)</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ordersData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#2563eb" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Subscription Growth (Last 8 Weeks)</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={subsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <Truck className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Delivery Success (Last 7 Days)</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deliveryRateData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="delivered" fill="#16a34a" />
                                    <Bar dataKey="failed" fill="#dc2626" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">Recent Activities</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Orders</p>
                                {(recent?.orders ?? []).map((o) => (
                                    <Link key={o.id} href={'/admin/orders/' + o.id} className="flex justify-between rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                                        <span>#{o.order_number} · {o.status}</span>
                                        <span>₹{Number(o.total).toFixed(2)}</span>
                                    </Link>
                                ))}
                                {(recent?.orders ?? []).length === 0 && <p className="text-sm text-gray-500">No recent orders</p>}
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Deliveries</p>
                                {(recent?.deliveries ?? []).map((d) => (
                                    <Link key={d.id} href={'/admin/deliveries/' + d.id} className="flex justify-between rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                                        <span>{d.status}</span>
                                        <span>{d.delivered_at ? new Date(d.delivered_at).toLocaleDateString('en-IN') : (d.scheduled_date ? new Date(d.scheduled_date).toLocaleDateString('en-IN') : '-')}</span>
                                    </Link>
                                ))}
                                {(recent?.deliveries ?? []).length === 0 && <p className="text-sm text-gray-500">No recent deliveries</p>}
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Subscriptions</p>
                                {(recent?.subscriptions ?? []).map((s) => (
                                    <Link key={s.id} href={'/admin/subscriptions/' + s.id} className="flex justify-between rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                                        <span>{s.status}</span>
                                        <span>{new Date(s.start_date).toLocaleDateString('en-IN')}</span>
                                    </Link>
                                ))}
                                {(recent?.subscriptions ?? []).length === 0 && <p className="text-sm text-gray-500">No recent subscriptions</p>}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <Link href="/admin/products/create" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Add Product</Link>
                            <Link href="/admin/categories/create" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Add Category</Link>
                            <Link href="/admin/campaigns/create" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">New Campaign</Link>
                            <Link href="/admin/subscriptions/upcoming-deliveries" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Upcoming Deliveries</Link>
                            <Link href="/admin/analytics" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Analytics</Link>
                            <Link href="/admin/referrals/reports" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Referral Reports</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
