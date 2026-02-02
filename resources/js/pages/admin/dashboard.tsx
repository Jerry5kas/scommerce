import { Head } from '@inertiajs/react';
import { LayoutDashboard, Users, Package, Truck } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface DashboardStats {
    totalUsers: number;
    activeSubscriptions: number;
    todayOrders: number;
    todayDeliveries: number;
}

interface AdminDashboardPageProps {
    stats: DashboardStats;
}

const statCards = [
    {
        key: 'totalUsers',
        label: 'Total Users',
        value: (s: DashboardStats) => s.totalUsers.toLocaleString(),
        icon: Users,
        color: 'bg-[var(--admin-dark-primary)] text-white',
    },
    {
        key: 'activeSubscriptions',
        label: 'Active Subscriptions',
        value: (s: DashboardStats) => s.activeSubscriptions.toLocaleString(),
        icon: Package,
        color: 'bg-[var(--admin-accent)] text-white',
    },
    {
        key: 'todayOrders',
        label: "Today's Orders",
        value: (s: DashboardStats) => s.todayOrders.toLocaleString(),
        icon: LayoutDashboard,
        color: 'bg-[var(--admin-dark-primary)]/90 text-white',
    },
    {
        key: 'todayDeliveries',
        label: "Today's Deliveries",
        value: (s: DashboardStats) => s.todayDeliveries.toLocaleString(),
        icon: Truck,
        color: 'bg-[var(--admin-accent)]/90 text-white',
    },
];

export default function AdminDashboard({ stats }: AdminDashboardPageProps) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard - Admin" />
            <div className="space-y-6">
                <section>
                    <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-500">
                        Overview
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map(({ key, label, value, icon: Icon, color }) => (
                            <div
                                key={key}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-center gap-4 p-5">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${color}`}
                                    >
                                        <Icon className="h-6 w-6" aria-hidden />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-600">
                                            {label}
                                        </p>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                                            {value(stats)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-500">
                        Welcome
                    </h2>
                    <p className="text-gray-600">
                        Use the sidebar to navigate. Dashboard metrics and charts
                        can be wired to your data next.
                    </p>
                </section>
            </div>
        </AdminLayout>
    );
}
