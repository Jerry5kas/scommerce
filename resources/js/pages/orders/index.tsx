import { Head, Link, router } from '@inertiajs/react';
import {
    Package,
    Calendar,
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Filter,
    RefreshCw,
} from 'lucide-react';
import UserLayout from '@/layouts/UserLayout';
import type React from 'react';

interface OrderItem {
    id: number;
    product_name: string;
    product_image: string | null;
    quantity: number;
    subtotal: string;
}

interface Address {
    id: number;
    address_line_1: string;
    city: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    type: string;
    total: string;
    created_at: string;
    scheduled_delivery_date: string | null;
    delivered_at: string | null;
    items: OrderItem[];
    address: Address;
}

interface OrdersIndexProps {
    orders: {
        data: Order[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    statusOptions: Record<string, string>;
    currentStatus: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; bgColor: string }> = {
    pending: {
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        icon: <Clock className="h-3 w-3" />,
    },
    confirmed: {
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
        icon: <CheckCircle className="h-3 w-3" />,
    },
    processing: {
        color: 'text-purple-800',
        bgColor: 'bg-purple-100',
        icon: <Package className="h-3 w-3" />,
    },
    out_for_delivery: {
        color: 'text-indigo-800',
        bgColor: 'bg-indigo-100',
        icon: <Truck className="h-3 w-3" />,
    },
    delivered: {
        color: 'text-green-800',
        bgColor: 'bg-green-100',
        icon: <CheckCircle className="h-3 w-3" />,
    },
    cancelled: {
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        icon: <XCircle className="h-3 w-3" />,
    },
};

export default function OrdersIndex({ orders, statusOptions, currentStatus }: OrdersIndexProps) {
    const handleStatusFilter = (status: string) => {
        router.get('/orders', { status: status === 'all' ? '' : status }, { preserveState: true });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <UserLayout>
            <Head title="My Orders" />
            <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Orders</h1>
                        <p className="mt-1 text-sm text-gray-600">Track and manage your orders</p>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            <button
                                onClick={() => handleStatusFilter('all')}
                                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    currentStatus === 'all' || !currentStatus
                                        ? 'bg-[var(--theme-primary-1)] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                All Orders
                            </button>
                            {Object.entries(statusOptions).map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => handleStatusFilter(value)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                        currentStatus === value
                                            ? 'bg-[var(--theme-primary-1)] text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orders List */}
                    {orders.data.length === 0 ? (
                        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">No orders found</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {currentStatus && currentStatus !== 'all'
                                    ? `No orders with status "${statusOptions[currentStatus]}" found.`
                                    : "You haven't placed any orders yet."}
                            </p>
                            <Link
                                href="/products"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary-1)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-primary-1-dark)]"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.data.map((order) => {
                                const config = statusConfig[order.status] || statusConfig.pending;
                                return (
                                    <Link
                                        key={order.id}
                                        href={`/orders/${order.id}`}
                                        className="group block rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                {/* Order Number & Status */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900">#{order.order_number}</h3>
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}
                                                    >
                                                        {config.icon}
                                                        {statusOptions[order.status]}
                                                    </span>
                                                    {order.type === 'subscription' && (
                                                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                                                            <RefreshCw className="mr-1 inline h-3 w-3" />
                                                            Subscription
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Products */}
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {order.items.slice(0, 3).map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1"
                                                        >
                                                            {item.product_image && (
                                                                <img
                                                                    src={item.product_image}
                                                                    alt={item.product_name}
                                                                    className="h-6 w-6 rounded object-cover"
                                                                />
                                                            )}
                                                            <span className="text-xs text-gray-700 max-w-[100px] truncate">
                                                                {item.product_name} ×{item.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                                            +{order.items.length - 3} more
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(order.created_at)}</span>
                                                    </div>
                                                    {order.scheduled_delivery_date && order.status !== 'delivered' && (
                                                        <div className="flex items-center gap-1">
                                                            <Truck className="h-4 w-4" />
                                                            <span>Delivery: {formatDate(order.scheduled_delivery_date)}</span>
                                                        </div>
                                                    )}
                                                    {order.delivered_at && (
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span>Delivered: {formatDate(order.delivered_at)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">₹{parseFloat(order.total).toFixed(2)}</p>
                                                <ChevronRight className="mt-2 h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 ml-auto" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {orders.links.length > 3 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {orders.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`rounded-lg px-3 py-2 text-sm ${
                                        link.active
                                            ? 'bg-[var(--theme-primary-1)] text-white'
                                            : link.url
                                              ? 'bg-white text-gray-700 hover:bg-gray-100'
                                              : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                    }`}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}

