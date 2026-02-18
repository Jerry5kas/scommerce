import { Head, Link, router } from '@inertiajs/react';
import { BarChart3, CheckCircle, Eye, Gift, Search, XCircle } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
}

interface Referral {
    id: number;
    referral_code: string;
    status: string;
    referrer_reward: string | null;
    referred_reward: string | null;
    referrer_reward_paid: boolean;
    referred_reward_paid: boolean;
    created_at: string;
    completed_at: string | null;
    referrer: User;
    referred: User;
}

interface PaginatedReferrals {
    data: Referral[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Stats {
    total_referrals: number;
    pending_referrals: number;
    completed_referrals: number;
    total_rewards_paid: number;
    pending_rewards: number;
}

interface Props {
    referrals: PaginatedReferrals;
    stats: Stats;
    filters: {
        search?: string;
        status?: string;
        unpaid?: string;
    };
    statusOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function ReferralsIndex({ referrals, stats, filters, statusOptions }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/referrals', { ...filters, search }, { preserveState: true });
    };

    const handleApprove = (id: number) => {
        if (confirm('Approve this referral and process rewards?')) {
            router.post(`/admin/referrals/${id}/approve`);
        }
    };

    const handleReject = (id: number) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            router.post(`/admin/referrals/${id}/reject`, { reason });
        }
    };

    return (
        <AdminLayout>
            <Head title="Referrals" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
                    <Link
                        href="/admin/referrals/reports"
                        className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600"
                    >
                        <BarChart3 className="h-4 w-4" />
                        Reports
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                                <Gift className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Referrals</p>
                                <p className="text-xl font-bold">{stats.total_referrals}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-xl font-bold text-yellow-600">{stats.pending_referrals}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="text-xl font-bold text-green-600">{stats.completed_referrals}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Rewards Paid</p>
                        <p className="text-xl font-bold">₹{stats.total_rewards_paid}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Pending Rewards</p>
                        <p className="text-xl font-bold text-orange-600">₹{stats.pending_rewards}</p>
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
                                placeholder="Search by code, name, or email..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
                            />
                        </div>
                        <select
                            value={filters.status || ''}
                            onChange={(e) =>
                                router.get('/admin/referrals', { ...filters, status: e.target.value || undefined }, { preserveState: true })
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">All Status</option>
                            {Object.entries(statusOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Referrals List */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Referrer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Referred</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Code</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Rewards</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {referrals.data.map((referral) => (
                                <tr key={referral.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{referral.referrer.name}</p>
                                        <p className="text-sm text-gray-500">{referral.referrer.email}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{referral.referred.name}</p>
                                        <p className="text-sm text-gray-500">{referral.referred.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-mono text-sm">{referral.referral_code}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[referral.status]}`}
                                        >
                                            {referral.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <p className="text-sm">
                                            Referrer: ₹{referral.referrer_reward}
                                            {referral.referrer_reward_paid && (
                                                <span className="ml-1 text-green-600">✓</span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Referred: ₹{referral.referred_reward}
                                            {referral.referred_reward_paid && (
                                                <span className="ml-1 text-green-600">✓</span>
                                            )}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {referral.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(referral.id)}
                                                        className="text-green-600 hover:text-green-700"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(referral.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                            <Link
                                                href={`/admin/referrals/${referral.id}`}
                                                className="text-purple-600 hover:text-purple-700"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {referrals.data.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No referrals found</div>
                    )}
                </div>

                {/* Pagination */}
                {referrals.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {referrals.prev_page_url && (
                            <Link
                                href={referrals.prev_page_url}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Previous
                            </Link>
                        )}
                        <span className="text-sm text-gray-500">
                            Page {referrals.current_page} of {referrals.last_page}
                        </span>
                        {referrals.next_page_url && (
                            <Link
                                href={referrals.next_page_url}
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

