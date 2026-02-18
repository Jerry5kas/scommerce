import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Tag, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Coupon {
    id: number;
    code: string;
    name: string;
    type: string;
    value: string;
    min_order_amount: string | null;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
}

interface PaginatedCoupons {
    data: Coupon[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Stats {
    total_coupons: number;
    active_coupons: number;
    total_usages: number;
    expired_coupons: number;
}

interface Props {
    coupons: PaginatedCoupons;
    stats: Stats;
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
    typeOptions: Record<string, string>;
}

const typeColors: Record<string, string> = {
    percentage: 'bg-blue-100 text-blue-700',
    fixed: 'bg-green-100 text-green-700',
    free_shipping: 'bg-purple-100 text-purple-700',
};

export default function CouponsIndex({ coupons, stats, filters, typeOptions }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/coupons', { ...filters, search }, { preserveState: true });
    };

    const handleToggle = (id: number) => {
        router.post(`/admin/coupons/${id}/toggle-status`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            router.delete(`/admin/coupons/${id}`);
        }
    };

    const getDiscountLabel = (coupon: Coupon) => {
        switch (coupon.type) {
            case 'percentage':
                return `${coupon.value}%`;
            case 'fixed':
                return `₹${coupon.value}`;
            case 'free_shipping':
                return 'Free Shipping';
            default:
                return coupon.value;
        }
    };

    return (
        <AdminLayout>
            <Head title="Coupons" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
                    <Link
                        href="/admin/coupons/create"
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4" />
                        Create Coupon
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-2">
                                <Tag className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Coupons</p>
                                <p className="text-xl font-bold">{stats.total_coupons}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Active</p>
                        <p className="text-xl font-bold text-green-600">{stats.active_coupons}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Total Usages</p>
                        <p className="text-xl font-bold">{stats.total_usages}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Expired</p>
                        <p className="text-xl font-bold text-gray-500">{stats.expired_coupons}</p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by code or name..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
                            />
                        </div>
                        <select
                            value={filters.type || ''}
                            onChange={(e) =>
                                router.get('/admin/coupons', { ...filters, type: e.target.value || undefined }, { preserveState: true })
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">All Types</option>
                            {Object.entries(typeOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.status || ''}
                            onChange={(e) =>
                                router.get('/admin/coupons', { ...filters, status: e.target.value || undefined }, { preserveState: true })
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                        </select>
                        <button
                            type="submit"
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Coupons List */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Code</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Type</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Discount</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Usage</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {coupons.data.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className="font-mono font-medium text-indigo-600">{coupon.code}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-900">{coupon.name}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${typeColors[coupon.type] || 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {typeOptions[coupon.type] || coupon.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">{getDiscountLabel(coupon)}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-sm">
                                            {coupon.used_count}
                                            {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleToggle(coupon.id)}
                                            className={coupon.is_active ? 'text-green-600' : 'text-gray-400'}
                                        >
                                            {coupon.is_active ? (
                                                <ToggleRight className="h-6 w-6" />
                                            ) : (
                                                <ToggleLeft className="h-6 w-6" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/coupons/${coupon.id}`}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/coupons/${coupon.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-700"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {coupons.data.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No coupons found</div>
                    )}
                </div>

                {/* Pagination */}
                {coupons.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {coupons.prev_page_url && (
                            <Link
                                href={coupons.prev_page_url}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Previous
                            </Link>
                        )}
                        <span className="text-sm text-gray-500">
                            Page {coupons.current_page} of {coupons.last_page}
                        </span>
                        {coupons.next_page_url && (
                            <Link
                                href={coupons.next_page_url}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

