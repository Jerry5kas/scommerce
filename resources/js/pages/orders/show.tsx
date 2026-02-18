import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Package,
    Calendar,
    ChevronLeft,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    MapPin,
    CreditCard,
    Phone,
    User,
    FileText,
    AlertCircle,
    RefreshCw,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import UserLayout from '@/layouts/UserLayout';

interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    product_image: string | null;
    product_sku: string;
    quantity: number;
    price: string;
    subtotal: string;
    is_free_sample: boolean;
}

interface Address {
    id: number;
    label: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    pincode: string;
    phone: string | null;
    zone: {
        id: number;
        name: string;
    } | null;
}

interface Driver {
    id: number;
    user: {
        name: string;
        phone: string | null;
    };
}

interface TimelineItem {
    status: string;
    label: string;
    timestamp: string | null;
    is_current: boolean;
    is_completed: boolean;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    type: string;
    vertical: string;
    subtotal: string;
    discount: string;
    delivery_charge: string;
    total: string;
    payment_status: string;
    payment_method: string | null;
    coupon_code: string | null;
    delivery_instructions: string | null;
    created_at: string;
    scheduled_delivery_date: string | null;
    scheduled_delivery_time: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
    cancellation_reason: string | null;
    items: OrderItem[];
    address: Address;
    driver: Driver | null;
    subscription_id: number | null;
}

interface OrderShowProps {
    order: Order;
    timeline: TimelineItem[];
    canCancel: boolean;
    statusOptions: Record<string, string>;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; bgColor: string }> = {
    pending: {
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        icon: <Clock className="h-4 w-4" />,
    },
    confirmed: {
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
        icon: <CheckCircle className="h-4 w-4" />,
    },
    processing: {
        color: 'text-purple-800',
        bgColor: 'bg-purple-100',
        icon: <Package className="h-4 w-4" />,
    },
    out_for_delivery: {
        color: 'text-indigo-800',
        bgColor: 'bg-indigo-100',
        icon: <Truck className="h-4 w-4" />,
    },
    delivered: {
        color: 'text-green-800',
        bgColor: 'bg-green-100',
        icon: <CheckCircle className="h-4 w-4" />,
    },
    cancelled: {
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        icon: <XCircle className="h-4 w-4" />,
    },
};

export default function OrderShow({ order, timeline, canCancel, statusOptions }: OrderShowProps) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        reason: '',
    });

    const config = statusConfig[order.status] || statusConfig.pending;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/orders/${order.id}/cancel`, {
            onSuccess: () => setShowCancelModal(false),
        });
    };

    const handleReorder = () => {
        router.post(`/orders/${order.id}/reorder`);
    };

    return (
        <UserLayout>
            <Head title={`Order #${order.order_number}`} />
            <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <nav className="mb-6 flex items-center gap-3" aria-label="Breadcrumb">
                        <Link
                            href="/orders"
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-[var(--theme-primary-1)]"
                        >
                            <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2} />
                            <span className="hidden sm:inline">Back to Orders</span>
                        </Link>
                        <span className="text-sm text-gray-400" aria-hidden>|</span>
                        <h1 className="text-lg font-bold text-gray-900">Order #{order.order_number}</h1>
                    </nav>

                    <div className="space-y-6">
                        {/* Status Card */}
                        <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${config.bgColor} ${config.color}`}
                                        >
                                            {config.icon}
                                            {statusOptions[order.status]}
                                        </span>
                                        {order.type === 'subscription' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                                                <RefreshCw className="h-4 w-4" />
                                                Subscription Order
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Placed on {formatDateTime(order.created_at)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {order.status === 'delivered' && (
                                        <button
                                            onClick={handleReorder}
                                            className="inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-primary-1-dark)]"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Reorder
                                        </button>
                                    )}
                                    {canCancel && (
                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            {order.status !== 'cancelled' && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between overflow-x-auto pb-2">
                                        {timeline.map((item, index) => (
                                            <div key={item.status} className="flex flex-col items-center min-w-[80px]">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                        item.is_completed
                                                            ? 'bg-green-500 text-white'
                                                            : item.is_current
                                                              ? 'bg-[var(--theme-primary-1)] text-white'
                                                              : 'bg-gray-200 text-gray-500'
                                                    }`}
                                                >
                                                    {statusConfig[item.status]?.icon || <Clock className="h-4 w-4" />}
                                                </div>
                                                <p className={`mt-2 text-xs font-medium ${item.is_current ? 'text-[var(--theme-primary-1)]' : 'text-gray-600'}`}>
                                                    {item.label}
                                                </p>
                                                {item.timestamp && (
                                                    <p className="text-[10px] text-gray-400">{formatDate(item.timestamp)}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cancellation Info */}
                            {order.status === 'cancelled' && (
                                <div className="mt-4 rounded-lg bg-red-50 p-4">
                                    <p className="text-sm font-medium text-red-800">
                                        Cancelled on {formatDateTime(order.cancelled_at)}
                                    </p>
                                    {order.cancellation_reason && (
                                        <p className="mt-1 text-sm text-red-600">Reason: {order.cancellation_reason}</p>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Order Items */}
                        <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                <Package className="h-5 w-5 text-[var(--theme-primary-1)]" />
                                Order Items ({order.items.length})
                            </h2>
                            <ul className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                        <Link
                                            href={`/products/${item.product_id}`}
                                            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-20"
                                        >
                                            <img
                                                src={item.product_image || '/images/placeholder-product.png'}
                                                alt={item.product_name}
                                                className="h-full w-full object-contain p-1"
                                                loading="lazy"
                                            />
                                        </Link>
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/products/${item.product_id}`}
                                                className="font-semibold text-gray-900 hover:text-[var(--theme-primary-1)]"
                                            >
                                                {item.product_name}
                                            </Link>
                                            {item.is_free_sample && (
                                                <span className="ml-2 inline-block rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                                                    Free Sample
                                                </span>
                                            )}
                                            <p className="mt-0.5 text-xs text-gray-500">SKU: {item.product_sku}</p>
                                            <p className="mt-1 text-sm text-gray-700">
                                                ₹{parseFloat(item.price).toFixed(2)} × {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            ₹{parseFloat(item.subtotal).toFixed(2)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Delivery Address */}
                            <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <MapPin className="h-5 w-5 text-[var(--theme-primary-1)]" />
                                    Delivery Address
                                </h2>
                                <div className="space-y-2 text-sm">
                                    <p className="font-semibold text-gray-900">{order.address.label}</p>
                                    <p className="text-gray-600">
                                        {order.address.address_line_1}
                                        {order.address.address_line_2 && <br />}
                                        {order.address.address_line_2}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.address.city}, {order.address.state} – {order.address.pincode}
                                    </p>
                                    {order.address.phone && (
                                        <p className="flex items-center gap-1.5 text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            {order.address.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Delivery Info */}
                                {order.scheduled_delivery_date && (
                                    <div className="mt-4 rounded-lg bg-gray-50 p-3">
                                        <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Calendar className="h-4 w-4" />
                                            Scheduled: {formatDate(order.scheduled_delivery_date)}
                                            {order.scheduled_delivery_time && ` (${order.scheduled_delivery_time})`}
                                        </p>
                                    </div>
                                )}

                                {/* Delivery Instructions */}
                                {order.delivery_instructions && (
                                    <div className="mt-4">
                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            <FileText className="h-4 w-4" />
                                            Instructions
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">{order.delivery_instructions}</p>
                                    </div>
                                )}

                                {/* Driver Info */}
                                {order.driver && (
                                    <div className="mt-4 rounded-lg border border-[var(--theme-primary-1)]/30 bg-[var(--theme-primary-1)]/5 p-3">
                                        <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                            <User className="h-4 w-4 text-[var(--theme-primary-1)]" />
                                            Driver: {order.driver.user.name}
                                        </p>
                                        {order.driver.user.phone && (
                                            <a
                                                href={`tel:${order.driver.user.phone}`}
                                                className="mt-1 flex items-center gap-1.5 text-sm text-[var(--theme-primary-1)] hover:underline"
                                            >
                                                <Phone className="h-4 w-4" />
                                                {order.driver.user.phone}
                                            </a>
                                        )}
                                    </div>
                                )}
                            </section>

                            {/* Payment & Bill */}
                            <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <CreditCard className="h-5 w-5 text-[var(--theme-primary-1)]" />
                                    Payment Details
                                </h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Method</span>
                                        <span className="font-medium text-gray-900">
                                            {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method || '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>

                                <hr className="my-4 border-gray-100" />

                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-700">
                                        <dt>Subtotal</dt>
                                        <dd className="font-medium">₹{parseFloat(order.subtotal).toFixed(2)}</dd>
                                    </div>
                                    {parseFloat(order.discount) > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <dt>Discount {order.coupon_code && `(${order.coupon_code})`}</dt>
                                            <dd className="font-medium">–₹{parseFloat(order.discount).toFixed(2)}</dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-700">
                                        <dt className="flex items-center gap-1">
                                            <Truck className="h-4 w-4" />
                                            Delivery
                                        </dt>
                                        <dd className={parseFloat(order.delivery_charge) === 0 ? 'font-medium text-green-600' : 'font-medium'}>
                                            {parseFloat(order.delivery_charge) === 0 ? 'FREE' : `₹${parseFloat(order.delivery_charge).toFixed(2)}`}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                                        <dt>Total</dt>
                                        <dd>₹{parseFloat(order.total).toFixed(2)}</dd>
                                    </div>
                                </dl>
                            </section>
                        </div>

                        {/* Subscription Link */}
                        {order.subscription_id && (
                            <Link
                                href={`/subscriptions/${order.subscription_id}`}
                                className="block rounded-xl bg-purple-50 p-4 text-center text-sm font-medium text-purple-700 hover:bg-purple-100"
                            >
                                View related subscription →
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <form onSubmit={handleCancel} className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Reason (optional)
                            </label>
                            <textarea
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Please tell us why you're cancelling..."
                                rows={3}
                                className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                            />
                            {errors.reason && (
                                <p className="mt-1 text-xs text-red-600">{errors.reason}</p>
                            )}
                            <div className="mt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Keep Order
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Cancel Order'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}

