import { Head, Link } from '@inertiajs/react';
import { ArrowDownLeft, ArrowUpRight, CreditCard, History, Plus, RefreshCw, Settings, Wallet as WalletIcon } from 'lucide-react';

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

interface Wallet {
    id: number;
    balance: string;
    currency: string;
    is_active: boolean;
    low_balance_threshold: string;
    auto_recharge_enabled: boolean;
    auto_recharge_amount: string | null;
    auto_recharge_threshold: string | null;
}

interface Summary {
    balance: number;
    formatted_balance: string;
    currency: string;
    is_active: boolean;
    is_low_balance: boolean;
    low_balance_threshold: number;
    auto_recharge_enabled: boolean;
    auto_recharge_amount: number | null;
    auto_recharge_threshold: number | null;
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

export default function WalletIndex({ wallet, transactions, summary, transactionTypeOptions }: Props) {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <ArrowDownLeft className="h-5 w-5 text-green-600" />
            </div>
        ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <ArrowUpRight className="h-5 w-5 text-red-600" />
            </div>
        );
    };

    return (
        <>
            <Head title="My Wallet" />

            <div className="min-h-screen bg-gray-50 pb-20">
                {/* Header */}
                <header className="bg-gradient-to-br from-emerald-600 to-teal-700 px-4 pt-12 pb-24 text-white">
                    <div className="mx-auto max-w-lg">
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-xl font-semibold">My Wallet</h1>
                            <Link
                                href="/wallet/auto-recharge"
                                className="rounded-full bg-white/20 p-2 transition hover:bg-white/30"
                            >
                                <Settings className="h-5 w-5" />
                            </Link>
                        </div>

                        <div className="text-center">
                            <p className="mb-2 text-emerald-100">Available Balance</p>
                            <p className="text-4xl font-bold">{summary.formatted_balance}</p>
                            {summary.is_low_balance && (
                                <p className="mt-2 text-sm text-amber-200">
                                    ⚠️ Low balance! Below ₹{summary.low_balance_threshold}
                                </p>
                            )}
                        </div>
                    </div>
                </header>

                {/* Action Cards */}
                <div className="mx-auto -mt-16 max-w-lg px-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/wallet/recharge"
                            className="flex flex-col items-center rounded-xl bg-white p-4 shadow-lg transition hover:shadow-xl"
                        >
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                <Plus className="h-6 w-6 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Add Money</span>
                        </Link>

                        <Link
                            href="/wallet/auto-recharge"
                            className="flex flex-col items-center rounded-xl bg-white p-4 shadow-lg transition hover:shadow-xl"
                        >
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <RefreshCw className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Auto Recharge</span>
                            {summary.auto_recharge_enabled && (
                                <span className="mt-1 text-xs text-emerald-600">Enabled</span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Monthly Stats */}
                <div className="mx-auto mt-6 max-w-lg px-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h3 className="mb-3 text-sm font-medium text-gray-500">This Month</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Money In</p>
                                <p className="text-lg font-semibold text-green-600">
                                    +{formatCurrency(summary.monthly_credits)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Money Out</p>
                                <p className="text-lg font-semibold text-red-600">
                                    -{formatCurrency(summary.monthly_debits)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="mx-auto mt-6 max-w-lg px-4">
                    <div className="rounded-xl bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                            <h3 className="font-medium text-gray-900">Transaction History</h3>
                            <History className="h-5 w-5 text-gray-400" />
                        </div>

                        {transactions.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <WalletIcon className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-4 text-gray-500">No transactions yet</p>
                                <Link
                                    href="/wallet/recharge"
                                    className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                >
                                    Add money to get started
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {transactions.data.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center gap-4 px-4 py-3">
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
                                                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
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

                        {/* Pagination */}
                        {transactions.last_page > 1 && (
                            <div className="border-t border-gray-100 px-4 py-3 text-center">
                                <p className="text-sm text-gray-500">
                                    Page {transactions.current_page} of {transactions.last_page}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

