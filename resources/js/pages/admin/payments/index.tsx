import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Banknote, CreditCard, Eye, RefreshCw, Search, Wallet } from 'lucide-react';
import { useState } from 'react';

interface Payment {
    id: number;
    order_id: number;
    user_id: number;
    payment_id: string | null;
    amount: string;
    currency: string;
    method: string;
    gateway: string | null;
    status: string;
    refunded_amount: string;
    paid_at: string | null;
    created_at: string;
    order: {
        id: number;
        order_number: string;
    };
    user: {
        id: number;
        name: string;
        phone: string;
    };
}

interface PaginatedPayments {
    data: Payment[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    payments: PaginatedPayments;
    statusOptions: Record<string, string>;
    methodOptions: Record<string, string>;
    filters: {
        status?: string;
        method?: string;
        gateway?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
}

export default function PaymentsIndex({ payments, statusOptions, methodOptions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedMethod, setSelectedMethod] = useState(filters.method || '');

    const applyFilters = () => {
        router.get(
            '/admin/payments',
            {
                search: search || undefined,
                status: selectedStatus || undefined,
                method: selectedMethod || undefined,
            },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedStatus('');
        setSelectedMethod('');
        router.get('/admin/payments');
    };

    const formatCurrency = (amount: string | number) => {
        return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const classes: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-purple-100 text-purple-800',
            partially_refunded: 'bg-orange-100 text-orange-800',
        };
        return (
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusOptions[status] || status}
            </span>
        );
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'gateway':
                return <CreditCard className="h-4 w-4" />;
            case 'wallet':
                return <Wallet className="h-4 w-4" />;
            case 'cod':
                return <Banknote className="h-4 w-4" />;
            default:
                return <RefreshCw className="h-4 w-4" />;
        }
    };

    return (
        <AdminLayout>
            <Head title="Payments - Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                        <p className="text-sm text-gray-500">Manage all payment transactions</p>
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
                                placeholder="Search by order, user..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">All Statuses</option>
                            {Object.entries(statusOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">All Methods</option>
                            {Object.entries(methodOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
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
                                        Payment
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Order
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Method
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {payments.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-500">
                                            No payments found
                                        </td>
                                    </tr>
                                ) : (
                                    payments.data.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <p className="text-sm font-medium text-gray-900">#{payment.id}</p>
                                                {payment.payment_id && (
                                                    <p className="truncate text-xs text-gray-500 max-w-[120px]">
                                                        {payment.payment_id}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <Link
                                                    href={`/admin/orders/${payment.order_id}`}
                                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                                >
                                                    {payment.order.order_number}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <p className="text-sm font-medium text-gray-900">{payment.user.name}</p>
                                                <p className="text-xs text-gray-500">{payment.user.phone}</p>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getMethodIcon(payment.method)}
                                                    <span className="text-sm text-gray-900">
                                                        {methodOptions[payment.method] || payment.method}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(payment.amount)}
                                                </p>
                                                {Number(payment.refunded_amount) > 0 && (
                                                    <p className="text-xs text-red-600">
                                                        -{formatCurrency(payment.refunded_amount)} refunded
                                                    </p>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                {getStatusBadge(payment.status)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                                {formatDate(payment.paid_at || payment.created_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                <Link
                                                    href={`/admin/payments/${payment.id}`}
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
                    {payments.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-700">
                                Showing {(payments.current_page - 1) * payments.per_page + 1} to{' '}
                                {Math.min(payments.current_page * payments.per_page, payments.total)} of{' '}
                                {payments.total} results
                            </p>
                            <div className="flex gap-1">
                                {payments.links.map((link, index) => (
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

