import { Head, Link, router } from '@inertiajs/react';
import {
    Package,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Search,
    Filter,
    User,
    MapPin,
    Eye,
    RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
}

interface OrderUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
}

interface OrderAddress {
    id: number;
    address_line_1: string;
    city: string;
    zone: { name: string } | null;
}

interface OrderDriver {
    id: number;
    user: { name: string };
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    type: string;
    vertical: string;
    total: string;
    created_at: string;
    scheduled_delivery_date: string | null;
    user: OrderUser;
    address: OrderAddress;
    items: OrderItem[];
    driver: OrderDriver | null;
}

interface Driver {
    id: number;
    user: { name: string };
}

interface Filters {
    status?: string;
    vertical?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    date?: string;
    driver_id?: string;
    search?: string;
}

interface OrdersIndexProps {
    orders: {
        data: Order[];
        links: { url: string | null; label: string; active: boolean }[];
        meta?: { total: number };
    };
    drivers: Driver[];
    statusOptions: Record<string, string>;
    typeOptions: Record<string, string>;
    filters: Filters;
}

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
    pending: { color: 'text-yellow-800', bgColor: 'bg-yellow-100', icon: <Clock className="h-3 w-3" /> },
    confirmed: { color: 'text-blue-800', bgColor: 'bg-blue-100', icon: <CheckCircle className="h-3 w-3" /> },
    processing: { color: 'text-purple-800', bgColor: 'bg-purple-100', icon: <Package className="h-3 w-3" /> },
    out_for_delivery: { color: 'text-indigo-800', bgColor: 'bg-indigo-100', icon: <Truck className="h-3 w-3" /> },
    delivered: { color: 'text-green-800', bgColor: 'bg-green-100', icon: <CheckCircle className="h-3 w-3" /> },
    cancelled: { color: 'text-red-800', bgColor: 'bg-red-100', icon: <XCircle className="h-3 w-3" /> },
};

export default function OrdersIndex({ orders, drivers, statusOptions, typeOptions, filters }: OrdersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState<Filters>(filters);

    const applyFilters = () => {
        router.get('/admin/orders', { ...localFilters, search }, { preserveState: true });
    };

    const clearFilters = () => {
        setLocalFilters({});
        setSearch('');
        router.get('/admin/orders', {}, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <AdminLayout>
            <Head title="Orders" />
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Orders</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage and track all orders</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.reload()}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by order number, customer name or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${
                                    showFilters
                                        ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/10 text-[var(--theme-primary-1)]'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--theme-primary-1-dark)]"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-4 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Status</label>
                                <select
                                    value={localFilters.status || ''}
                                    onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm"
                                >
                                    <option value="">All Statuses</option>
                                    {Object.entries(statusOptions).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Type</label>
                                <select
                                    value={localFilters.type || ''}
                                    onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm"
                                >
                                    <option value="">All Types</option>
                                    {Object.entries(typeOptions).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Vertical</label>
                                <select
                                    value={localFilters.vertical || ''}
                                    onChange={(e) => setLocalFilters({ ...localFilters, vertical: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm"
                                >
                                    <option value="">All Verticals</option>
                                    <option value="daily_fresh">Daily Fresh</option>
                                    <option value="society_fresh">Society Fresh</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Driver</label>
                                <select
                                    value={localFilters.driver_id || ''}
                                    onChange={(e) => setLocalFilters({ ...localFilters, driver_id: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm"
                                >
                                    <option value="">All Drivers</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>{driver.user.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Date From</label>
                                <input
                                    type="date"
                                    value={localFilters.date_from || ''}
                                    onChange={(e) => setLocalFilters({ ...localFilters, date_from: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Date To</label>
                                <input
                                    type="date"
                                    value={localFilters.date_to || ''}
                                    onChange={(e) => setLocalFilters({ ...localFilters, date_to: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm"
                                />
                            </div>
                            <div className="sm:col-span-2 flex items-end gap-2">
                                <button
                                    type="button"
                                    onClick={applyFilters}
                                    className="rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--theme-primary-1-dark)]"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Orders Table */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Items</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Delivery</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center">
                                            <Package className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">No orders found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.data.map((order) => {
                                        const config = statusConfig[order.status] || statusConfig.pending;
                                        return (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">#{order.order_number}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                                        {order.type === 'subscription' && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-purple-600">
                                                                <RefreshCw className="h-3 w-3" />
                                                                Subscription
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 shrink-0 text-gray-400" />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium text-gray-900">{order.user.name}</p>
                                                            <p className="truncate text-xs text-gray-500">{order.user.phone || order.user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {order.items.slice(0, 2).map((item) => (
                                                            <span key={item.id} className="inline-flex rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
                                                                {item.product_name.slice(0, 15)}... ×{item.quantity}
                                                            </span>
                                                        ))}
                                                        {order.items.length > 2 && (
                                                            <span className="text-xs text-gray-500">+{order.items.length - 2} more</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs text-gray-700">{order.address.address_line_1}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {order.scheduled_delivery_date ? formatDate(order.scheduled_delivery_date) : 'Not scheduled'}
                                                            </p>
                                                            {order.driver && (
                                                                <p className="text-xs text-[var(--theme-primary-1)]">
                                                                    <Truck className="mr-1 inline h-3 w-3" />
                                                                    {order.driver.user.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}>
                                                        {config.icon}
                                                        {statusOptions[order.status]}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <p className="font-semibold text-gray-900">₹{parseFloat(order.total).toFixed(2)}</p>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--theme-primary-1)]/10 px-3 py-1.5 text-sm font-medium text-[var(--theme-primary-1)] hover:bg-[var(--theme-primary-1)]/20"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.links.length > 3 && (
                        <div className="border-t border-gray-100 px-4 py-3">
                            <div className="flex flex-wrap justify-center gap-1">
                                {orders.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`rounded px-3 py-1.5 text-sm ${
                                            link.active
                                                ? 'bg-[var(--theme-primary-1)] text-white'
                                                : link.url
                                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                  : 'cursor-not-allowed bg-gray-50 text-gray-400'
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

