import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
}

interface LoyaltyAccount {
    id: number;
    user_id: number;
    points: number;
    total_earned: number;
    total_redeemed: number;
    is_active: boolean;
    user: User;
}

interface PaginatedAccounts {
    data: LoyaltyAccount[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Stats {
    total_accounts: number;
    active_accounts: number;
    total_points: number;
    total_earned: number;
    total_redeemed: number;
}

interface Props {
    accounts: PaginatedAccounts;
    stats: Stats;
    filters: {
        search?: string;
        status?: string;
        min_points?: string;
    };
}

export default function LoyaltyIndex({ accounts, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/loyalty', { ...filters, search }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Loyalty Points" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Loyalty Points</h1>
                    <Link
                        href="/admin/loyalty/transactions"
                        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                    >
                        All Transactions
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-100 p-2">
                                <Star className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Accounts</p>
                                <p className="text-xl font-bold">{stats.total_accounts.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active</p>
                                <p className="text-xl font-bold">{stats.active_accounts.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Total Points</p>
                        <p className="text-xl font-bold text-amber-600">{stats.total_points.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Total Earned</p>
                        <p className="text-xl font-bold text-green-600">{stats.total_earned.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Total Redeemed</p>
                        <p className="text-xl font-bold text-red-600">{stats.total_redeemed.toLocaleString()}</p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, or phone..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
                            />
                        </div>
                        <select
                            value={filters.status || ''}
                            onChange={(e) =>
                                router.get('/admin/loyalty', { ...filters, status: e.target.value || undefined }, { preserveState: true })
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            type="submit"
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Accounts List */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Points</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Earned</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Redeemed</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {accounts.data.map((account) => (
                                <tr key={account.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{account.user.name}</p>
                                        <p className="text-sm text-gray-500">{account.user.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-amber-600">
                                        {account.points.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right text-green-600">
                                        {account.total_earned.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right text-red-600">
                                        {account.total_redeemed.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${account.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {account.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/admin/loyalty/${account.id}`}
                                            className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {accounts.data.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No loyalty accounts found</div>
                    )}
                </div>

                {/* Pagination */}
                {accounts.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {accounts.prev_page_url && (
                            <Link
                                href={accounts.prev_page_url}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Previous
                            </Link>
                        )}
                        <span className="text-sm text-gray-500">
                            Page {accounts.current_page} of {accounts.last_page}
                        </span>
                        {accounts.next_page_url && (
                            <Link
                                href={accounts.next_page_url}
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

