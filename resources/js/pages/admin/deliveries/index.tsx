import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Eye,
    Filter,
    MapPin,
    Package,
    Search,
    Truck,
    User,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Driver {
    id: number;
    name: string;
}

interface Zone {
    id: number;
    name: string;
}

interface Delivery {
    id: number;
    status: string;
    scheduled_date: string;
    scheduled_time: string | null;
    time_slot: string | null;
    delivery_proof_verified: boolean;
    delivery_proof_image: string | null;
    order: {
        id: number;
        order_number: string;
        total: string;
    };
    driver: Driver | null;
    user: {
        id: number;
        name: string;
        phone: string;
    };
    address: {
        address_line: string;
        city: string;
        pincode: string;
    };
    zone: Zone;
}

interface Props {
    deliveries: {
        data: Delivery[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status?: string;
        date?: string;
        driver_id?: string;
        zone_id?: string;
        search?: string;
        unassigned?: string;
        needs_verification?: string;
    };
    drivers: Driver[];
    zones: Zone[];
    statusOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    assigned: 'bg-blue-100 text-blue-700',
    out_for_delivery: 'bg-yellow-100 text-yellow-700',
    delivered: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-200 text-gray-600',
};

export default function DeliveriesIndex({
    deliveries,
    filters,
    drivers,
    zones,
    statusOptions,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleFilter = (key: string, value: string) => {
        router.get(
            '/admin/deliveries',
            { ...filters, [key]: value || undefined, page: 1 },
            { preserveState: true }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter('search', search);
    };

    const clearFilters = () => {
        router.get('/admin/deliveries', {}, { preserveState: true });
    };

    const hasActiveFilters =
        filters.status ||
        filters.date ||
        filters.driver_id ||
        filters.zone_id ||
        filters.search ||
        filters.unassigned ||
        filters.needs_verification;

    return (
        <AdminLayout>
            <Head title="Deliveries" />

            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Deliveries</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {deliveries.total} total deliveries
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/admin/deliveries/calendar"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Calendar className="h-4 w-4" />
                            Calendar View
                        </Link>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleFilter('unassigned', filters.unassigned ? '' : 'true')}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                            filters.unassigned
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Truck className="mr-1 inline h-3.5 w-3.5" />
                        Unassigned
                    </button>
                    <button
                        onClick={() =>
                            handleFilter('needs_verification', filters.needs_verification ? '' : 'true')
                        }
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                            filters.needs_verification
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <AlertCircle className="mr-1 inline h-3.5 w-3.5" />
                        Needs Verification
                    </button>
                    <button
                        onClick={() => handleFilter('date', new Date().toISOString().split('T')[0])}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                            filters.date === new Date().toISOString().split('T')[0]
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Today
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search order number, customer..."
                                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </form>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                showFilters || hasActiveFilters
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-xs text-white">
                                    {Object.values(filters).filter(Boolean).length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilter('status', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="">All Statuses</option>
                                    {Object.entries(statusOptions).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.date || ''}
                                    onChange={(e) => handleFilter('date', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Driver
                                </label>
                                <select
                                    value={filters.driver_id || ''}
                                    onChange={(e) => handleFilter('driver_id', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="">All Drivers</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Zone
                                </label>
                                <select
                                    value={filters.zone_id || ''}
                                    onChange={(e) => handleFilter('zone_id', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="">All Zones</option>
                                    {zones.map((zone) => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {hasActiveFilters && (
                                <div className="flex items-end sm:col-span-2 lg:col-span-4">
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Deliveries Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Order
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Customer
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Scheduled
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Driver
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Zone
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Proof
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {deliveries.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center">
                                            <Package className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-2 text-sm text-gray-500">
                                                No deliveries found
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    deliveries.data.map((delivery) => (
                                        <tr key={delivery.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <Link
                                                    href={`/admin/orders/${delivery.order.id}`}
                                                    className="font-medium text-emerald-600 hover:text-emerald-700"
                                                >
                                                    {delivery.order.order_number}
                                                </Link>
                                                <p className="text-xs text-gray-500">
                                                    ₹{delivery.order.total}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-gray-900">
                                                            {delivery.user.name}
                                                        </p>
                                                        <p className="truncate text-xs text-gray-500">
                                                            {delivery.address.address_line}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {new Date(delivery.scheduled_date).toLocaleDateString()}
                                                </div>
                                                {delivery.time_slot && (
                                                    <p className="text-xs">{delivery.time_slot}</p>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {delivery.driver ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Truck className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="text-sm">
                                                            {delivery.driver.name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-orange-600">
                                                        Not assigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                                    <span className="text-sm">{delivery.zone.name}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[delivery.status] || 'bg-gray-100 text-gray-700'}`}
                                                >
                                                    {statusOptions[delivery.status] || delivery.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center">
                                                {delivery.delivery_proof_image ? (
                                                    delivery.delivery_proof_verified ? (
                                                        <span className="text-xs text-green-600">✓ Verified</span>
                                                    ) : (
                                                        <span className="text-xs text-yellow-600">
                                                            Pending
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                <Link
                                                    href={`/admin/deliveries/${delivery.id}`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
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
                    {deliveries.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="text-sm text-gray-500">
                                Page {deliveries.current_page} of {deliveries.last_page}
                            </p>
                            <div className="flex gap-1">
                                {deliveries.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`rounded px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-emerald-600 text-white'
                                                : link.url
                                                  ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                  : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                        }`}
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

