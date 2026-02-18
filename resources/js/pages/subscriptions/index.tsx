import { Head, Link } from '@inertiajs/react';
import { CalendarDays, ChevronRight, Package, Pause, Play, Plus, X } from 'lucide-react';
import type React from 'react';
import UserLayout from '@/layouts/UserLayout';

interface SubscriptionPlan {
    id: number;
    name: string;
    frequency_type: string;
}

interface SubscriptionItem {
    id: number;
    product: {
        id: number;
        name: string;
        image: string | null;
    };
    quantity: number;
    price: string;
}

interface Subscription {
    id: number;
    status: 'active' | 'paused' | 'cancelled' | 'expired';
    start_date: string;
    next_delivery_date: string | null;
    plan: SubscriptionPlan;
    items: SubscriptionItem[];
    address: {
        address_line_1: string;
        city: string;
    };
}

interface SubscriptionsIndexProps {
    subscriptions: {
        data: Subscription[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    statusOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
};

const statusIcons: Record<string, React.ReactNode> = {
    active: <Play className="h-3 w-3" />,
    paused: <Pause className="h-3 w-3" />,
    cancelled: <X className="h-3 w-3" />,
    expired: <X className="h-3 w-3" />,
};

export default function SubscriptionsIndex({ subscriptions, statusOptions }: SubscriptionsIndexProps) {
    return (
        <UserLayout>
            <Head title="My Subscriptions" />
            <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Subscriptions</h1>
                            <p className="mt-1 text-sm text-gray-600">Manage your recurring deliveries</p>
                        </div>
                        <Link
                            href="/subscriptions/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-primary-1-dark)]"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">New Subscription</span>
                            <span className="sm:hidden">New</span>
                        </Link>
                    </div>

                    {/* Subscription List */}
                    {subscriptions.data.length === 0 ? (
                        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">No subscriptions yet</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Start a subscription to receive fresh products delivered regularly.
                            </p>
                            <Link
                                href="/subscriptions/create"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary-1)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-primary-1-dark)]"
                            >
                                <Plus className="h-4 w-4" />
                                Create Subscription
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {subscriptions.data.map((subscription) => (
                                <Link
                                    key={subscription.id}
                                    href={`/subscriptions/${subscription.id}`}
                                    className="group block rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            {/* Plan & Status */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">{subscription.plan.name}</h3>
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[subscription.status]}`}
                                                >
                                                    {statusIcons[subscription.status]}
                                                    {statusOptions[subscription.status]}
                                                </span>
                                            </div>

                                            {/* Products */}
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {subscription.items.slice(0, 3).map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1"
                                                    >
                                                        {item.product.image && (
                                                            <img
                                                                src={item.product.image}
                                                                alt={item.product.name}
                                                                className="h-6 w-6 rounded object-cover"
                                                            />
                                                        )}
                                                        <span className="text-xs text-gray-700">
                                                            {item.product.name} x{item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                                {subscription.items.length > 3 && (
                                                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                                        +{subscription.items.length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            {/* Delivery Info */}
                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                {subscription.next_delivery_date && subscription.status === 'active' && (
                                                    <div className="flex items-center gap-1">
                                                        <CalendarDays className="h-4 w-4" />
                                                        <span>
                                                            Next:{' '}
                                                            {new Date(subscription.next_delivery_date).toLocaleDateString('en-IN', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="truncate">{subscription.address.address_line_1}</span>
                                            </div>
                                        </div>

                                        <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {subscriptions.links.length > 3 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {subscriptions.links.map((link, index) => (
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

