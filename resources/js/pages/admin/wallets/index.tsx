import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Eye, RefreshCw, Search, Wallet as WalletIcon } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string | null;
    phone: string;
}

interface Wallet {
    id: number;
    user_id: number;
    balance: string;
    currency: string;
    is_active: boolean;
    low_balance_threshold: string;
    auto_recharge_enabled: boolean;
    auto_recharge_amount: string | null;
    auto_recharge_threshold: string | null;
    user: User;
}

interface PaginatedWallets {
    data: Wallet[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Stats {
    total_balance: number;
    total_wallets: number;
    active_wallets: number;
    low_balance_wallets: number;
}

interface Props {
    wallets: PaginatedWallets;
    stats: Stats;
    filters: {
        status?: string;
        auto_recharge?: string;
        search?: string;
    };
}

export default function WalletsIndex({ wallets, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [autoRechargeFilter, setAutoRechargeFilter] = useState(filters.auto_recharge || '');

    const applyFilters = () => {
        router.get(
            '/admin/wallets',
            {
                search: search || undefined,
                status: selectedStatus || undefined,
                auto_recharge: autoRechargeFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedStatus('');
        setAutoRechargeFilter('');
        router.get('/admin/wallets');
    };

    const formatCurrency = (amount: string | number) => {
        return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    };

    const isLowBalance = (wallet: Wallet) => {
        return Number(wallet.balance) <= Number(wallet.low_balance_threshold);
    };

    return (
        <AdminLayout>
            <Head title="Wallets - Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Wallets</h1>
                    <p className="text-sm text-gray-500">Manage user wallet balances and transactions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-emerald-100 p-2">
                                <WalletIcon className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Balance</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(stats.total_balance)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2">
                                <WalletIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Wallets</p>
                                <p className="text-xl font-bold text-gray-900">{stats.total_wallets}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-2">
                                <WalletIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Wallets</p>
                                <p className="text-xl font-bold text-gray-900">{stats.active_wallets}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-amber-100 p-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Low Balance</p>
                                <p className="text-xl font-bold text-gray-900">{stats.low_balance_wallets}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Search by name, phone, email..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="low_balance">Low Balance</option>
                        </select>
                        <select
                            value={autoRechargeFilter}
                            onChange={(e) => setAutoRechargeFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">Auto Recharge</option>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                                Apply
                            </button>
                            <button
                                onClick={clearFilters}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Balance
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Auto Recharge
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Threshold
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {wallets.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-500">
                                            No wallets found
                                        </td>
                                    </tr>
                                ) : (
                                    wallets.data.map((wallet) => (
                                        <tr key={wallet.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{wallet.user.name}</p>
                                                    <p className="text-xs text-gray-500">{wallet.user.phone}</p>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <p
                                                        className={`text-lg font-semibold ${
                                                            isLowBalance(wallet) ? 'text-amber-600' : 'text-gray-900'
                                                        }`}
                                                    >
                                                        {formatCurrency(wallet.balance)}
                                                    </p>
                                                    {isLowBalance(wallet) && (
                                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        wallet.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {wallet.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                {wallet.auto_recharge_enabled ? (
                                                    <div className="flex items-center gap-1 text-emerald-600">
                                                        <RefreshCw className="h-4 w-4" />
                                                        <span className="text-sm">
                                                            {formatCurrency(wallet.auto_recharge_amount || 0)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Disabled</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                                {formatCurrency(wallet.low_balance_threshold)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                <Link
                                                    href={`/admin/wallets/${wallet.id}`}
                                                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
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
                    {wallets.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-700">
                                Showing {(wallets.current_page - 1) * wallets.per_page + 1} to{' '}
                                {Math.min(wallets.current_page * wallets.per_page, wallets.total)} of{' '}
                                {wallets.total} results
                            </p>
                            <div className="flex gap-1">
                                {wallets.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`rounded px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-emerald-600 text-white'
                                                : link.url
                                                  ? 'text-gray-700 hover:bg-gray-100'
                                                  : 'cursor-not-allowed text-gray-400'
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

