import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, ChevronRight, Eye, Filter, Search, Users } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface SubscriptionPlan {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    phone: string;
}

interface Address {
    address_line_1: string;
    city: string;
    zone?: { name: string } | null;
}

interface Subscription {
    id: number;
    status: 'active' | 'paused' | 'cancelled' | 'expired';
    start_date: string;
    next_delivery_date: string | null;
    user: User;
    plan: SubscriptionPlan;
    address: Address;
    items: { id: number }[];
}

interface AdminSubscriptionsIndexProps {
    subscriptions: {
        data: Subscription[];
        links: { url: string | null; label: string; active: boolean }[];
        total: number;
    };
    plans: SubscriptionPlan[];
    statusOptions: Record<string, string>;
    filters: {
        status?: string;
        plan_id?: string;
        search?: string;
    };
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
};

export default function AdminSubscriptionsIndex({
    subscriptions,
    plans,
    statusOptions,
    filters,
}: AdminSubscriptionsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/subscriptions', { ...filters, search }, { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/subscriptions', { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    const clearFilters = () => {
        router.get('/admin/subscriptions', {}, { preserveState: true });
    };

    return (
        <AdminLayout title="Subscriptions">
            <Head title="Manage Subscriptions" />
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Subscriptions</h1>
                        <p className="text-sm text-gray-600">{subscriptions.total} total subscriptions</p>
                    </div>
                    <Link
                        href="/admin/subscriptions/upcoming"
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--admin-dark-primary)]/90"
                    >
                        <CalendarDays className="h-4 w-4" />
                        Upcoming Deliveries
                    </Link>
                </div>

                {/* Search & Filters */}
                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by user name or phone..."
                                    className="w-full rounded-lg border py-2 pl-9 pr-4 text-sm focus:border-[var(--admin-dark-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-dark-primary)]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
                            >
                                Search
                            </button>
                        </form>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 flex flex-wrap gap-4 border-t pt-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Status</label>
                                <select
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="rounded-lg border px-3 py-2 text-sm"
                                >
                                    <option value="">All</option>
                                    {Object.entries(statusOptions).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Plan</label>
                                <select
                                    value={filters.plan_id || ''}
                                    onChange={(e) => handleFilterChange('plan_id', e.target.value)}
                                    className="rounded-lg border px-3 py-2 text-sm"
                                >
                                    <option value="">All Plans</option>
                                    {plans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={clearFilters}
                                className="self-end rounded-lg px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Subscriptions Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Plan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Items
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Next Delivery
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Zone
                                    </th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {subscriptions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            No subscriptions found.
                                        </td>
                                    </tr>
                                ) : (
                                    subscriptions.data.map((subscription) => (
                                        <tr key={subscription.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{subscription.user.name}</p>
                                                    <p className="text-sm text-gray-500">{subscription.user.phone}</p>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                                {subscription.plan.name}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[subscription.status]}`}
                                                >
                                                    {statusOptions[subscription.status]}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                                {subscription.items.length} items
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                                {subscription.next_delivery_date
                                                    ? new Date(subscription.next_delivery_date).toLocaleDateString('en-IN', {
                                                          day: 'numeric',
                                                          month: 'short',
                                                      })
                                                    : '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                                {subscription.address.zone?.name || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                <Link
                                                    href={`/admin/subscriptions/${subscription.id}`}
                                                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--admin-dark-primary)] hover:bg-gray-100"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {subscriptions.links.length > 3 && (
                        <div className="border-t px-4 py-3">
                            <div className="flex justify-center gap-1">
                                {subscriptions.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`rounded px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-[var(--admin-dark-primary)] text-white'
                                                : link.url
                                                  ? 'text-gray-600 hover:bg-gray-100'
                                                  : 'cursor-not-allowed text-gray-400'
                                        }`}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

