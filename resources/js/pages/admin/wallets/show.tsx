import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowLeft,
    ArrowUpRight,
    Ban,
    CheckCircle,
    History,
    Minus,
    Plus,
    RefreshCw,
    Wallet as WalletIcon,
} from 'lucide-react';
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

interface WalletTransaction {
    id: number;
    type: 'credit' | 'debit';
    amount: string;
    balance_before: string;
    balance_after: string;
    transaction_type: string;
    description: string | null;
    status: string;
    created_at: string;
}

interface PaginatedTransactions {
    data: WalletTransaction[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Summary {
    balance: number;
    formatted_balance: string;
    is_low_balance: boolean;
    monthly_credits: number;
    monthly_debits: number;
}

interface TransactionTypeOptions {
    [key: string]: string;
}

interface Props {
    wallet: Wallet;
    transactions: PaginatedTransactions;
    summary: Summary;
    transactionTypeOptions: TransactionTypeOptions;
}

export default function WalletShow({ wallet, transactions, summary, transactionTypeOptions }: Props) {
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState<'credit' | 'debit'>('credit');
    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [adjustmentDescription, setAdjustmentDescription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const formatCurrency = (amount: string | number) => {
        return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTransactionIcon = (type: 'credit' | 'debit') => {
        return type === 'credit' ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <ArrowDownLeft className="h-4 w-4 text-green-600" />
            </div>
        ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <ArrowUpRight className="h-4 w-4 text-red-600" />
            </div>
        );
    };

    const handleAdjust = () => {
        const amount = parseFloat(adjustmentAmount);
        if (isNaN(amount) || amount <= 0) return;
        if (!adjustmentDescription.trim()) return;

        setIsProcessing(true);
        router.post(
            `/admin/wallets/${wallet.id}/adjust`,
            {
                amount: adjustmentType === 'debit' ? -amount : amount,
                description: adjustmentDescription,
            },
            {
                onSuccess: () => {
                    setShowAdjustModal(false);
                    setAdjustmentAmount('');
                    setAdjustmentDescription('');
                    setIsProcessing(false);
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    const handleToggleStatus = () => {
        const action = wallet.is_active ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} this wallet?`)) {
            router.post(`/admin/wallets/${wallet.id}/toggle-status`);
        }
    };

    return (
        <AdminLayout>
            <Head title={`Wallet - ${wallet.user.name} - Admin`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/wallets" className="rounded-lg p-2 hover:bg-gray-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Wallet #{wallet.id}</h1>
                        <p className="text-sm text-gray-500">
                            User:{' '}
                            <Link
                                href={`/admin/users/${wallet.user_id}`}
                                className="text-emerald-600 hover:underline"
                            >
                                {wallet.user.name}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Balance Card */}
                        <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-emerald-100">Current Balance</p>
                                    <p className="text-3xl font-bold">{summary.formatted_balance}</p>
                                    {summary.is_low_balance && (
                                        <p className="mt-1 text-sm text-amber-200">⚠️ Low balance</p>
                                    )}
                                </div>
                                <WalletIcon className="h-12 w-12 opacity-50" />
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                                <div>
                                    <p className="text-xs text-emerald-100">This Month In</p>
                                    <p className="text-lg font-semibold">
                                        +{formatCurrency(summary.monthly_credits)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-100">This Month Out</p>
                                    <p className="text-lg font-semibold">
                                        -{formatCurrency(summary.monthly_debits)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div className="rounded-lg bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <h3 className="font-semibold text-gray-900">Transaction History</h3>
                                <History className="h-5 w-5 text-gray-400" />
                            </div>

                            {transactions.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <WalletIcon className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-4 text-gray-500">No transactions yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {transactions.data.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center gap-4 px-6 py-4"
                                        >
                                            {getTransactionIcon(transaction.type)}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-gray-900">
                                                    {transactionTypeOptions[transaction.transaction_type] ||
                                                        transaction.transaction_type}
                                                </p>
                                                <p className="truncate text-xs text-gray-500">
                                                    {transaction.description || formatDate(transaction.created_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`font-semibold ${
                                                        transaction.type === 'credit'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {transaction.type === 'credit' ? '+' : '-'}
                                                    {formatCurrency(transaction.amount)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Bal: {formatCurrency(transaction.balance_after)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {transactions.last_page > 1 && (
                                <div className="border-t border-gray-200 px-6 py-4 text-center">
                                    <p className="text-sm text-gray-500">
                                        Page {transactions.current_page} of {transactions.last_page} ({transactions.total}{' '}
                                        total)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setAdjustmentType('credit');
                                        setShowAdjustModal(true);
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                                >
                                    <Plus className="h-4 w-4" />
                                    Credit Balance
                                </button>
                                <button
                                    onClick={() => {
                                        setAdjustmentType('debit');
                                        setShowAdjustModal(true);
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                >
                                    <Minus className="h-4 w-4" />
                                    Debit Balance
                                </button>
                                <button
                                    onClick={handleToggleStatus}
                                    className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${
                                        wallet.is_active
                                            ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                            : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    }`}
                                >
                                    {wallet.is_active ? (
                                        <>
                                            <Ban className="h-4 w-4" />
                                            Deactivate Wallet
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4" />
                                            Activate Wallet
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">User</h3>
                            <div className="space-y-2">
                                <p className="font-medium text-gray-900">{wallet.user.name}</p>
                                <p className="text-sm text-gray-500">{wallet.user.phone}</p>
                                {wallet.user.email && (
                                    <p className="text-sm text-gray-500">{wallet.user.email}</p>
                                )}
                                <Link
                                    href={`/admin/users/${wallet.user_id}`}
                                    className="mt-2 inline-block text-sm text-emerald-600 hover:underline"
                                >
                                    View Profile →
                                </Link>
                            </div>
                        </div>

                        {/* Wallet Settings */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">Settings</h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Status</dt>
                                    <dd>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                wallet.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {wallet.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Currency</dt>
                                    <dd className="font-medium text-gray-900">{wallet.currency}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Low Balance Threshold</dt>
                                    <dd className="font-medium text-gray-900">
                                        {formatCurrency(wallet.low_balance_threshold)}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Auto Recharge</dt>
                                    <dd>
                                        {wallet.auto_recharge_enabled ? (
                                            <div className="flex items-center gap-1 text-emerald-600">
                                                <RefreshCw className="h-3 w-3" />
                                                <span className="font-medium">Enabled</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Disabled</span>
                                        )}
                                    </dd>
                                </div>
                                {wallet.auto_recharge_enabled && (
                                    <>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">Recharge Amount</dt>
                                            <dd className="font-medium text-gray-900">
                                                {formatCurrency(wallet.auto_recharge_amount || 0)}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">Recharge Threshold</dt>
                                            <dd className="font-medium text-gray-900">
                                                {formatCurrency(wallet.auto_recharge_threshold || 0)}
                                            </dd>
                                        </div>
                                    </>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Adjust Balance Modal */}
            {showAdjustModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            {adjustmentType === 'credit' ? 'Credit' : 'Debit'} Wallet Balance
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        value={adjustmentAmount}
                                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                                        min="1"
                                        step="0.01"
                                        className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 focus:border-emerald-500 focus:ring-emerald-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Description (Required)
                                </label>
                                <textarea
                                    value={adjustmentDescription}
                                    onChange={(e) => setAdjustmentDescription(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                                    placeholder="Enter reason for adjustment..."
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowAdjustModal(false);
                                    setAdjustmentAmount('');
                                    setAdjustmentDescription('');
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdjust}
                                disabled={isProcessing || !adjustmentAmount || !adjustmentDescription.trim()}
                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                                    adjustmentType === 'credit'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {isProcessing
                                    ? 'Processing...'
                                    : adjustmentType === 'credit'
                                      ? 'Credit'
                                      : 'Debit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

