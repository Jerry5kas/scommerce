import { Head, Link, useForm, router } from '@inertiajs/react';
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
    Mail,
    Edit3,
} from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import AdminLayout from '@/layouts/AdminLayout';

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
    product: {
        id: number;
        name: string;
    } | null;
}

interface OrderUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
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
    notes: string | null;
    created_at: string;
    scheduled_delivery_date: string | null;
    scheduled_delivery_time: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
    cancellation_reason: string | null;
    driver_id: number | null;
    items: OrderItem[];
    user: OrderUser;
    address: Address;
    driver: Driver | null;
    subscription_id: number | null;
}

interface OrderShowProps {
    order: Order;
    timeline: TimelineItem[];
    availableStatuses: string[];
    statusOptions: Record<string, string>;
    paymentStatusOptions: Record<string, string>;
    drivers: Driver[];
}

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
    pending: { color: 'text-yellow-800', bgColor: 'bg-yellow-100', icon: <Clock className="h-4 w-4" /> },
    confirmed: { color: 'text-blue-800', bgColor: 'bg-blue-100', icon: <CheckCircle className="h-4 w-4" /> },
    processing: { color: 'text-purple-800', bgColor: 'bg-purple-100', icon: <Package className="h-4 w-4" /> },
    out_for_delivery: { color: 'text-indigo-800', bgColor: 'bg-indigo-100', icon: <Truck className="h-4 w-4" /> },
    delivered: { color: 'text-green-800', bgColor: 'bg-green-100', icon: <CheckCircle className="h-4 w-4" /> },
    cancelled: { color: 'text-red-800', bgColor: 'bg-red-100', icon: <XCircle className="h-4 w-4" /> },
};

export default function OrderShow({
    order,
    timeline,
    availableStatuses,
    statusOptions,
    paymentStatusOptions,
    drivers,
}: OrderShowProps) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDriverModal, setShowDriverModal] = useState(false);

    const statusForm = useForm({
        status: '',
        notes: '',
    });

    const cancelForm = useForm({
        reason: '',
    });

    const driverForm = useForm({
        driver_id: order.driver_id || '',
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

    const handleStatusUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        statusForm.post(`/admin/orders/${order.id}/update-status`, {
            onSuccess: () => {
                setShowStatusModal(false);
                statusForm.reset();
            },
        });
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        cancelForm.post(`/admin/orders/${order.id}/cancel`, {
            onSuccess: () => setShowCancelModal(false),
        });
    };

    const handleDriverAssign = (e: React.FormEvent) => {
        e.preventDefault();
        driverForm.post(`/admin/orders/${order.id}/assign-driver`, {
            onSuccess: () => setShowDriverModal(false),
        });
    };

    return (
        <AdminLayout>
            <Head title={`Order #${order.order_number}`} />
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[var(--theme-primary-1)]"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Order #{order.order_number}</h1>
                            <p className="mt-0.5 text-sm text-gray-600">Placed {formatDateTime(order.created_at)}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <>
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--theme-primary-1-dark)]"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    Update Status
                                </button>
                                <button
                                    onClick={() => setShowDriverModal(true)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    <Truck className="h-4 w-4" />
                                    {order.driver ? 'Change Driver' : 'Assign Driver'}
                                </button>
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
                    {/* Main Content */}
                    <div className="space-y-4 lg:col-span-2 lg:space-y-6">
                        {/* Status Card */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${config.bgColor} ${config.color}`}>
                                    {config.icon}
                                    {statusOptions[order.status]}
                                </span>
                                {order.type === 'subscription' && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                                        <RefreshCw className="h-4 w-4" />
                                        Subscription
                                    </span>
                                )}
                                <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                                    order.vertical === 'daily_fresh' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {order.vertical === 'daily_fresh' ? 'Daily Fresh' : 'Society Fresh'}
                                </span>
                            </div>

                            {/* Timeline */}
                            {order.status !== 'cancelled' && (
                                <div className="mt-6 overflow-x-auto">
                                    <div className="flex items-center justify-between min-w-[500px]">
                                        {timeline.map((item, index) => (
                                            <div key={item.status} className="flex flex-col items-center">
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
                        </div>

                        {/* Order Items */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                <Package className="h-5 w-5 text-[var(--theme-primary-1)]" />
                                Order Items ({order.items.length})
                            </h2>
                            <ul className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                            <img
                                                src={item.product_image || '/images/placeholder-product.png'}
                                                alt={item.product_name}
                                                className="h-full w-full object-contain p-1"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-gray-900">
                                                {item.product_name}
                                                {item.is_free_sample && (
                                                    <span className="ml-2 inline-block rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                                                        Free Sample
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">SKU: {item.product_sku}</p>
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
                        </div>

                        {/* Customer Info */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                <User className="h-5 w-5 text-[var(--theme-primary-1)]" />
                                Customer
                            </h2>
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{order.user.name}</p>
                                    <p className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        {order.user.email}
                                    </p>
                                    {order.user.phone && (
                                        <p className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            {order.user.phone}
                                        </p>
                                    )}
                                    <Link
                                        href={`/admin/users/${order.user.id}`}
                                        className="mt-2 inline-flex text-sm font-medium text-[var(--theme-primary-1)] hover:underline"
                                    >
                                        View Customer →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 lg:space-y-6">
                        {/* Delivery Address */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                <MapPin className="h-5 w-5 text-[var(--theme-primary-1)]" />
                                Delivery
                            </h2>
                            <div className="space-y-3 text-sm">
                                <p className="font-semibold text-gray-900">{order.address.label}</p>
                                <p className="text-gray-600">
                                    {order.address.address_line_1}
                                    {order.address.address_line_2 && <><br />{order.address.address_line_2}</>}
                                </p>
                                <p className="text-gray-600">
                                    {order.address.city}, {order.address.state} – {order.address.pincode}
                                </p>
                                {order.address.zone && (
                                    <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                                        Zone: {order.address.zone.name}
                                    </p>
                                )}
                            </div>

                            {/* Schedule */}
                            {order.scheduled_delivery_date && (
                                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                                    <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(order.scheduled_delivery_date)}
                                        {order.scheduled_delivery_time && ` (${order.scheduled_delivery_time})`}
                                    </p>
                                </div>
                            )}

                            {/* Driver */}
                            {order.driver && (
                                <div className="mt-4 rounded-lg border border-[var(--theme-primary-1)]/30 bg-[var(--theme-primary-1)]/5 p-3">
                                    <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                        <Truck className="h-4 w-4 text-[var(--theme-primary-1)]" />
                                        {order.driver.user.name}
                                    </p>
                                    {order.driver.user.phone && (
                                        <p className="mt-1 text-sm text-gray-600">{order.driver.user.phone}</p>
                                    )}
                                </div>
                            )}

                            {/* Instructions */}
                            {order.delivery_instructions && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Instructions</p>
                                    <p className="mt-1 text-sm text-gray-600">{order.delivery_instructions}</p>
                                </div>
                            )}
                        </div>

                        {/* Payment */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                <CreditCard className="h-5 w-5 text-[var(--theme-primary-1)]" />
                                Payment
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Method</span>
                                    <span className="font-medium text-gray-900">
                                        {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {paymentStatusOptions[order.payment_status] || order.payment_status}
                                    </span>
                                </div>
                            </div>

                            <hr className="my-4" />

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
                                    <dt>Delivery</dt>
                                    <dd className={parseFloat(order.delivery_charge) === 0 ? 'font-medium text-green-600' : 'font-medium'}>
                                        {parseFloat(order.delivery_charge) === 0 ? 'FREE' : `₹${parseFloat(order.delivery_charge).toFixed(2)}`}
                                    </dd>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-base font-bold text-gray-900">
                                    <dt>Total</dt>
                                    <dd>₹{parseFloat(order.total).toFixed(2)}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <FileText className="h-4 w-4 text-[var(--theme-primary-1)]" />
                                    Admin Notes
                                </h2>
                                <p className="text-sm text-gray-600">{order.notes}</p>
                            </div>
                        )}

                        {/* Subscription Link */}
                        {order.subscription_id && (
                            <Link
                                href={`/admin/subscriptions/${order.subscription_id}`}
                                className="block rounded-xl bg-purple-50 p-4 text-center text-sm font-medium text-purple-700 hover:bg-purple-100"
                            >
                                View Subscription →
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Update Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900">Update Order Status</h3>
                        <form onSubmit={handleStatusUpdate} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Status</label>
                                <select
                                    value={statusForm.data.status}
                                    onChange={(e) => statusForm.setData('status', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-gray-300 focus:border-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                >
                                    <option value="">Select status...</option>
                                    {availableStatuses.map((status) => (
                                        <option key={status} value={status}>{statusOptions[status]}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                                <textarea
                                    value={statusForm.data.notes}
                                    onChange={(e) => statusForm.setData('notes', e.target.value)}
                                    rows={3}
                                    className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!statusForm.data.status || statusForm.processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--theme-primary-1-dark)] disabled:opacity-50"
                                >
                                    {statusForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Driver Modal */}
            {showDriverModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900">Assign Driver</h3>
                        <form onSubmit={handleDriverAssign} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Driver</label>
                                <select
                                    value={driverForm.data.driver_id}
                                    onChange={(e) => driverForm.setData('driver_id', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-gray-300 focus:border-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                >
                                    <option value="">Select driver...</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>{driver.user.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDriverModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!driverForm.data.driver_id || driverForm.processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--theme-primary-1-dark)] disabled:opacity-50"
                                >
                                    {driverForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assign'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <form onSubmit={handleCancel} className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Reason</label>
                            <textarea
                                value={cancelForm.data.reason}
                                onChange={(e) => cancelForm.setData('reason', e.target.value)}
                                placeholder="Enter cancellation reason..."
                                rows={3}
                                className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                            />
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
                                    disabled={cancelForm.processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    {cancelForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancel Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

