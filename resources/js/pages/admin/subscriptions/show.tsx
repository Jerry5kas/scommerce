import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Edit2, MapPin, Package, Pause, Play, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { handleImageFallbackError, toSafeImageUrl } from '@/lib/imageFallback';

interface SubscriptionPlan {
    id: number;
    name: string;
    frequency_type: string;
    discount_percent: string;
}

interface Product {
    id: number;
    name: string;
    image: string | null;
}

interface SubscriptionItem {
    id: number;
    product: Product;
    quantity: number;
    price: string;
}

interface Address {
    id: number;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    pincode: string;
    zone: { id: number; name: string } | null;
}

interface UserData {
    id: number;
    name: string;
    phone: string;
    email: string | null;
}

interface DaySchedule {
    date: string;
    day: number;
    is_delivery: boolean;
    is_vacation: boolean;
    is_today: boolean;
    is_past: boolean;
}

interface Schedule {
    month: number;
    year: number;
    month_name: string;
    total_deliveries: number;
    vacation_days: number;
    days: DaySchedule[];
    first_day_offset: number;
}

interface UpcomingDelivery {
    date: string;
    formatted: string;
    is_today: boolean;
}

interface Subscription {
    id: number;
    status: 'active' | 'paused' | 'cancelled' | 'expired';
    start_date: string;
    next_delivery_date: string | null;
    vacation_start: string | null;
    vacation_end: string | null;
    notes: string | null;
    billing_cycle: string;
    auto_renew: boolean;
    bottles_issued: number;
    bottles_returned: number;
    created_at: string;
    plan: SubscriptionPlan;
    items: SubscriptionItem[];
    address: Address;
    user: UserData;
}

interface AdminSubscriptionShowProps {
    subscription: Subscription;
    currentMonthSchedule: Schedule;
    nextMonthSchedule: Schedule;
    upcomingDeliveries: UpcomingDelivery[];
    statusOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    expired: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function AdminSubscriptionShow({
    subscription,
    currentMonthSchedule,
    nextMonthSchedule,
    upcomingDeliveries,
    statusOptions,
}: AdminSubscriptionShowProps) {
    const [activeSchedule, setActiveSchedule] = useState<'current' | 'next'>('current');

    const schedule = activeSchedule === 'current' ? currentMonthSchedule : nextMonthSchedule;

    const handlePause = () => {
        if (confirm('Pause this subscription?')) {
            router.post(`/admin/subscriptions/${subscription.id}/pause`);
        }
    };

    const handleResume = () => {
        router.post(`/admin/subscriptions/${subscription.id}/resume`);
    };

    const handleCancel = () => {
        const reason = prompt('Enter cancellation reason (optional):');
        if (reason !== null) {
            router.post(`/admin/subscriptions/${subscription.id}/cancel`, { reason });
        }
    };

    const total = subscription.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const discount = subscription.plan.discount_percent ? (total * parseFloat(subscription.plan.discount_percent)) / 100 : 0;

    return (
        <AdminLayout title={`Subscription #${subscription.id}`}>
            <Head title={`Subscription #${subscription.id}`} />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Link href="/admin/subscriptions" className="mb-2 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Subscriptions
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Subscription #{subscription.id}</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${statusColors[subscription.status]}`}>
                                {statusOptions[subscription.status]}
                            </span>
                            <span className="text-sm text-gray-600">{subscription.plan.name}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/subscriptions/${subscription.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit
                        </Link>
                        {subscription.status === 'active' && (
                            <button
                                onClick={handlePause}
                                className="inline-flex items-center gap-2 rounded-lg bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                            >
                                <Pause className="h-4 w-4" />
                                Pause
                            </button>
                        )}
                        {subscription.status === 'paused' && (
                            <button
                                onClick={handleResume}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-200"
                            >
                                <Play className="h-4 w-4" />
                                Resume
                            </button>
                        )}
                        {subscription.status !== 'cancelled' && (
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
                            >
                                <Trash2 className="h-4 w-4" />
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Items */}
                        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                                <Package className="h-5 w-5" />
                                Subscription Items
                            </h2>
                            <div className="space-y-3">
                                {subscription.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                        <img
                                            src={toSafeImageUrl(item.product.image)}
                                            alt={item.product.name}
                                            className="h-12 w-12 rounded-lg object-cover"
                                            onError={handleImageFallbackError}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="mt-1 flex justify-between text-sm text-green-600">
                                        <span>Plan Discount ({subscription.plan.discount_percent}%)</span>
                                        <span>-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="mt-2 flex justify-between text-lg font-bold">
                                    <span>Per Delivery</span>
                                    <span>₹{(total - discount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                                    <CalendarDays className="h-5 w-5" />
                                    Delivery Schedule
                                </h2>
                                <div className="flex rounded-lg bg-gray-100 p-1">
                                    <button
                                        onClick={() => setActiveSchedule('current')}
                                        className={`rounded-md px-3 py-1 text-sm font-medium ${
                                            activeSchedule === 'current' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {currentMonthSchedule.month_name}
                                    </button>
                                    <button
                                        onClick={() => setActiveSchedule('next')}
                                        className={`rounded-md px-3 py-1 text-sm font-medium ${
                                            activeSchedule === 'next' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {nextMonthSchedule.month_name}
                                    </button>
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="py-2 text-xs font-medium text-gray-500">
                                        {day}
                                    </div>
                                ))}
                                {Array.from({ length: schedule.first_day_offset }).map((_, i) => (
                                    <div key={`empty-${i}`} className="py-2" />
                                ))}
                                {schedule.days.map((day) => (
                                    <div
                                        key={day.date}
                                        className={`rounded-lg py-2 text-sm ${day.is_today ? 'ring-2 ring-blue-500' : ''} ${
                                            day.is_delivery
                                                ? 'bg-green-100 font-semibold text-green-800'
                                                : day.is_vacation
                                                  ? 'bg-yellow-100 text-yellow-800'
                                                  : day.is_past
                                                    ? 'text-gray-400'
                                                    : 'text-gray-700'
                                        }`}
                                    >
                                        {day.day}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="h-3 w-3 rounded bg-green-100" />
                                    <span>Delivery ({schedule.total_deliveries})</span>
                                </div>
                                {schedule.vacation_days > 0 && (
                                    <div className="flex items-center gap-1">
                                        <div className="h-3 w-3 rounded bg-yellow-100" />
                                        <span>Vacation ({schedule.vacation_days})</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer */}
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                <User className="h-4 w-4" />
                                Customer
                            </h3>
                            <p className="font-medium text-gray-900">{subscription.user.name}</p>
                            <p className="text-sm text-gray-600">{subscription.user.phone}</p>
                            {subscription.user.email && <p className="text-sm text-gray-600">{subscription.user.email}</p>}
                            <Link
                                href={`/admin/users/${subscription.user.id}`}
                                className="mt-2 inline-block text-sm text-(--admin-dark-primary) hover:underline"
                            >
                                View customer →
                            </Link>
                        </div>

                        {/* Address */}
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                <MapPin className="h-4 w-4" />
                                Delivery Address
                            </h3>
                            <p className="text-sm text-gray-700">{subscription.address.address_line_1}</p>
                            {subscription.address.address_line_2 && <p className="text-sm text-gray-600">{subscription.address.address_line_2}</p>}
                            <p className="text-sm text-gray-600">
                                {subscription.address.city}, {subscription.address.state} - {subscription.address.pincode}
                            </p>
                            {subscription.address.zone && (
                                <p className="mt-2 text-sm font-medium text-green-600">Zone: {subscription.address.zone.name}</p>
                            )}
                        </div>

                        {/* Upcoming */}
                        {subscription.status === 'active' && upcomingDeliveries.length > 0 && (
                            <div className="rounded-lg bg-white p-4 shadow-sm">
                                <h3 className="mb-3 font-semibold text-gray-900">Upcoming Deliveries</h3>
                                <div className="space-y-2">
                                    {upcomingDeliveries.slice(0, 7).map((delivery) => (
                                        <div
                                            key={delivery.date}
                                            className={`rounded-lg px-3 py-2 text-sm ${
                                                delivery.is_today ? 'bg-green-50 font-medium text-green-800' : 'bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            {delivery.formatted}
                                            {delivery.is_today && <span className="ml-2 text-xs">(Today)</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <h3 className="mb-3 font-semibold text-gray-900">Details</h3>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Start Date</dt>
                                    <dd>{new Date(subscription.start_date).toLocaleDateString('en-IN')}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Billing Cycle</dt>
                                    <dd className="capitalize">{subscription.billing_cycle}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Auto-renew</dt>
                                    <dd>{subscription.auto_renew ? 'Yes' : 'No'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Bottles Issued</dt>
                                    <dd>{subscription.bottles_issued}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Bottles Returned</dt>
                                    <dd>{subscription.bottles_returned}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Created</dt>
                                    <dd>{new Date(subscription.created_at).toLocaleDateString('en-IN')}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Notes */}
                        {subscription.notes && (
                            <div className="rounded-lg bg-white p-4 shadow-sm">
                                <h3 className="mb-2 font-semibold text-gray-900">Delivery Notes</h3>
                                <p className="text-sm text-gray-600">{subscription.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
