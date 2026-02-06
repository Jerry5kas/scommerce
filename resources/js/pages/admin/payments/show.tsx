import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    CheckCircle,
    Clock,
    CreditCard,
    RefreshCw,
    RotateCcw,
    Wallet,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: string;
    subtotal: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: string;
    items: OrderItem[];
}

interface User {
    id: number;
    name: string;
    email: string | null;
    phone: string;
}

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
    gateway_response: Record<string, unknown> | null;
    failure_reason: string | null;
    refunded_amount: string;
    refunded_at: string | null;
    paid_at: string | null;
    created_at: string;
    order: Order;
    user: User;
}

interface RefundSummary {
    total_paid: number;
    total_refunded: number;
    refundable: number;
    payments: Array<{
        id: number;
        method: string;
        amount: number;
        refunded: number;
        status: string;
    }>;
}

interface Props {
    payment: Payment;
    refundSummary: RefundSummary;
    canRefund: boolean;
    statusOptions: Record<string, string>;
}

export default function PaymentShow({ payment, refundSummary, canRefund, statusOptions }: Props) {
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState(refundSummary.refundable.toString());
    const [refundReason, setRefundReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            case 'failed':
                return <XCircle className="h-6 w-6 text-red-500" />;
            case 'refunded':
            case 'partially_refunded':
                return <RotateCcw className="h-6 w-6 text-purple-500" />;
            default:
                return <Clock className="h-6 w-6 text-yellow-500" />;
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'gateway':
                return <CreditCard className="h-5 w-5 text-gray-500" />;
            case 'wallet':
                return <Wallet className="h-5 w-5 text-gray-500" />;
            case 'cod':
                return <Banknote className="h-5 w-5 text-gray-500" />;
            default:
                return <RefreshCw className="h-5 w-5 text-gray-500" />;
        }
    };

    const methodLabels: Record<string, string> = {
        gateway: 'Online Payment',
        wallet: 'Wallet',
        cod: 'Cash on Delivery',
        split: 'Split Payment',
    };

    const handleRefund = () => {
        const amount = parseFloat(refundAmount);
        if (isNaN(amount) || amount <= 0 || amount > refundSummary.refundable) {
            return;
        }

        setIsProcessing(true);
        router.post(
            `/admin/payments/${payment.id}/refund`,
            { amount, reason: refundReason },
            {
                onSuccess: () => {
                    setShowRefundModal(false);
                    setIsProcessing(false);
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    const handleRetry = () => {
        if (confirm('Retry this failed payment?')) {
            router.post(`/admin/payments/${payment.id}/retry`);
        }
    };

    const handleMarkCollected = () => {
        if (confirm('Mark this COD payment as collected?')) {
            router.post(`/admin/payments/${payment.id}/mark-collected`);
        }
    };

    return (
        <AdminLayout>
            <Head title={`Payment #${payment.id} - Admin`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/payments" className="rounded-lg p-2 hover:bg-gray-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Payment #{payment.id}</h1>
                        <p className="text-sm text-gray-500">
                            Order:{' '}
                            <Link
                                href={`/admin/orders/${payment.order_id}`}
                                className="text-emerald-600 hover:underline"
                            >
                                {payment.order.order_number}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Payment Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                {getStatusIcon(payment.status)}
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {statusOptions[payment.status] || payment.status}
                                    </h2>
                                    {payment.failure_reason && (
                                        <p className="text-sm text-red-600">{payment.failure_reason}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(payment.amount)}
                                    </p>
                                    {Number(payment.refunded_amount) > 0 && (
                                        <p className="text-sm text-red-600">
                                            -{formatCurrency(payment.refunded_amount)} refunded
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">Payment Details</h3>
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm text-gray-500">Method</dt>
                                    <dd className="mt-1 flex items-center gap-2">
                                        {getMethodIcon(payment.method)}
                                        <span className="font-medium text-gray-900">
                                            {methodLabels[payment.method] || payment.method}
                                        </span>
                                    </dd>
                                </div>
                                {payment.gateway && (
                                    <div>
                                        <dt className="text-sm text-gray-500">Gateway</dt>
                                        <dd className="mt-1 font-medium capitalize text-gray-900">
                                            {payment.gateway}
                                        </dd>
                                    </div>
                                )}
                                {payment.payment_id && (
                                    <div>
                                        <dt className="text-sm text-gray-500">Transaction ID</dt>
                                        <dd className="mt-1 font-mono text-sm text-gray-900">
                                            {payment.payment_id}
                                        </dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm text-gray-500">Currency</dt>
                                    <dd className="mt-1 font-medium text-gray-900">{payment.currency}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Created</dt>
                                    <dd className="mt-1 text-gray-900">{formatDate(payment.created_at)}</dd>
                                </div>
                                {payment.paid_at && (
                                    <div>
                                        <dt className="text-sm text-gray-500">Paid At</dt>
                                        <dd className="mt-1 text-gray-900">{formatDate(payment.paid_at)}</dd>
                                    </div>
                                )}
                                {payment.refunded_at && (
                                    <div>
                                        <dt className="text-sm text-gray-500">Refunded At</dt>
                                        <dd className="mt-1 text-gray-900">{formatDate(payment.refunded_at)}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Order Items */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">Order Items</h3>
                            <div className="divide-y divide-gray-100">
                                {payment.order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product_name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} × {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Order Total</span>
                                    <span>{formatCurrency(payment.order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">Actions</h3>
                            <div className="space-y-3">
                                {canRefund && (
                                    <button
                                        onClick={() => setShowRefundModal(true)}
                                        className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                    >
                                        <RotateCcw className="mr-2 inline-block h-4 w-4" />
                                        Process Refund
                                    </button>
                                )}
                                {payment.status === 'failed' && (
                                    <button
                                        onClick={handleRetry}
                                        className="w-full rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                                    >
                                        <RefreshCw className="mr-2 inline-block h-4 w-4" />
                                        Retry Payment
                                    </button>
                                )}
                                {payment.method === 'cod' && payment.status !== 'completed' && (
                                    <button
                                        onClick={handleMarkCollected}
                                        className="w-full rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                                    >
                                        <CheckCircle className="mr-2 inline-block h-4 w-4" />
                                        Mark as Collected
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Customer */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">Customer</h3>
                            <div className="space-y-2">
                                <p className="font-medium text-gray-900">{payment.user.name}</p>
                                <p className="text-sm text-gray-500">{payment.user.phone}</p>
                                {payment.user.email && (
                                    <p className="text-sm text-gray-500">{payment.user.email}</p>
                                )}
                                <Link
                                    href={`/admin/users/${payment.user.id}`}
                                    className="mt-2 inline-block text-sm text-emerald-600 hover:underline"
                                >
                                    View Profile →
                                </Link>
                            </div>
                        </div>

                        {/* Refund Summary */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">Refund Summary</h3>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Total Paid</dt>
                                    <dd className="font-medium text-gray-900">
                                        {formatCurrency(refundSummary.total_paid)}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Total Refunded</dt>
                                    <dd className="font-medium text-red-600">
                                        -{formatCurrency(refundSummary.total_refunded)}
                                    </dd>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2">
                                    <dt className="font-medium text-gray-900">Refundable</dt>
                                    <dd className="font-semibold text-gray-900">
                                        {formatCurrency(refundSummary.refundable)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Process Refund</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Refund Amount (Max: {formatCurrency(refundSummary.refundable)})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        max={refundSummary.refundable}
                                        step="0.01"
                                        className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Reason (Optional)
                                </label>
                                <textarea
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                                    placeholder="Enter refund reason..."
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowRefundModal(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRefund}
                                disabled={isProcessing}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Process Refund'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

