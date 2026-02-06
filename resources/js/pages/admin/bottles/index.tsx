import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Eye,
    Filter,
    GlassWater,
    Plus,
    Search,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface Bottle {
    id: number;
    bottle_number: string;
    barcode: string | null;
    type: string;
    capacity: string | null;
    status: string;
    deposit_amount: string | null;
    issued_at: string | null;
    current_user: { id: number; name: string } | null;
    current_subscription: { id: number } | null;
}

interface Stats {
    total: number;
    available: number;
    issued: number;
    damaged: number;
    lost: number;
    total_deposit: string;
}

interface Props {
    bottles: {
        data: Bottle[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status?: string;
        type?: string;
        search?: string;
    };
    stats: Stats;
    statusOptions: Record<string, string>;
    typeOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    issued: 'bg-blue-100 text-blue-700',
    returned: 'bg-gray-100 text-gray-700',
    damaged: 'bg-red-100 text-red-700',
    lost: 'bg-gray-200 text-gray-600',
};

export default function BottlesIndex({
    bottles,
    filters,
    stats,
    statusOptions,
    typeOptions,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleFilter = (key: string, value: string) => {
        router.get(
            '/admin/bottles',
            { ...filters, [key]: value || undefined, page: 1 },
            { preserveState: true }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter('search', search);
    };

    return (
        <AdminLayout>
            <Head title="Bottles" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Bottles</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {bottles.total} total bottles
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/admin/bottles/reports"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Reports
                        </Link>
                        <Link
                            href="/admin/bottles/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Bottle
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700' },
                        { label: 'Available', value: stats.available, color: 'bg-green-100 text-green-700' },
                        { label: 'Issued', value: stats.issued, color: 'bg-blue-100 text-blue-700' },
                        { label: 'Damaged', value: stats.damaged, color: 'bg-red-100 text-red-700' },
                        { label: 'Lost', value: stats.lost, color: 'bg-gray-200 text-gray-600' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className={`rounded-xl p-4 ${stat.color}`}
                        >
                            <p className="text-sm font-medium opacity-80">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search bottle number or barcode..."
                                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </form>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                showFilters
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilter('status', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                                    Type
                                </label>
                                <select
                                    value={filters.type || ''}
                                    onChange={(e) => handleFilter('type', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                >
                                    <option value="">All Types</option>
                                    {Object.entries(typeOptions).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottles Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Bottle
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Current Holder
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Deposit
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {bottles.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <GlassWater className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-2 text-sm text-gray-500">
                                                No bottles found
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    bottles.data.map((bottle) => (
                                        <tr key={bottle.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {bottle.bottle_number}
                                                    </p>
                                                    {bottle.barcode && (
                                                        <p className="text-xs text-gray-500">
                                                            {bottle.barcode}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span className="capitalize">{bottle.type}</span>
                                                {bottle.capacity && (
                                                    <span className="ml-1 text-xs text-gray-500">
                                                        ({bottle.capacity}L)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[bottle.status]}`}
                                                >
                                                    {statusOptions[bottle.status] || bottle.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {bottle.current_user ? (
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                        <span>{bottle.current_user.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {bottle.deposit_amount
                                                    ? `₹${bottle.deposit_amount}`
                                                    : '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                <Link
                                                    href={`/admin/bottles/${bottle.id}`}
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
                    {bottles.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="text-sm text-gray-500">
                                Page {bottles.current_page} of {bottles.last_page}
                            </p>
                            <div className="flex gap-1">
                                {bottles.links.map((link, i) => (
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

