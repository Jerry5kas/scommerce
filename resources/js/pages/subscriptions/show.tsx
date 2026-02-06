import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Edit2, MapPin, Pause, Play, Trash2, Umbrella, X } from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/layouts/UserLayout';

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
    zone: { name: string } | null;
}

interface DaySchedule {
    date: string;
    day: number;
    day_of_week: number;
    day_name: string;
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
    day_name: string;
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
    plan: SubscriptionPlan;
    items: SubscriptionItem[];
    address: Address;
}

interface SubscriptionShowProps {
    subscription: Subscription;
    schedule: Schedule;
    upcomingDeliveries: UpcomingDelivery[];
    canEdit: boolean;
    statusOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    expired: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function SubscriptionShow({
    subscription,
    schedule,
    upcomingDeliveries,
    canEdit,
    statusOptions,
}: SubscriptionShowProps) {
    const [showVacationModal, setShowVacationModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(schedule);

    const vacationForm = useForm({
        vacation_start: '',
        vacation_end: '',
    });

    const cancelForm = useForm({
        reason: '',
    });

    const handlePause = () => {
        router.post(`/subscriptions/${subscription.id}/pause`, {}, {
            preserveScroll: true,
        });
    };

    const handleResume = () => {
        router.post(`/subscriptions/${subscription.id}/resume`, {}, {
            preserveScroll: true,
        });
    };

    const handleSetVacation = (e: React.FormEvent) => {
        e.preventDefault();
        vacationForm.post(`/subscriptions/${subscription.id}/vacation`, {
            preserveScroll: true,
            onSuccess: () => setShowVacationModal(false),
        });
    };

    const handleClearVacation = () => {
        router.delete(`/subscriptions/${subscription.id}/vacation`, {
            preserveScroll: true,
        });
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        cancelForm.post(`/subscriptions/${subscription.id}/cancel`, {
            preserveScroll: true,
            onSuccess: () => setShowCancelModal(false),
        });
    };

    const loadSchedule = (month: number, year: number) => {
        fetch(`/subscriptions/${subscription.id}/schedule?month=${month}&year=${year}`)
            .then((res) => res.json())
            .then((data) => setCurrentSchedule(data));
    };

    const prevMonth = () => {
        const newMonth = currentSchedule.month === 1 ? 12 : currentSchedule.month - 1;
        const newYear = currentSchedule.month === 1 ? currentSchedule.year - 1 : currentSchedule.year;
        loadSchedule(newMonth, newYear);
    };

    const nextMonth = () => {
        const newMonth = currentSchedule.month === 12 ? 1 : currentSchedule.month + 1;
        const newYear = currentSchedule.month === 12 ? currentSchedule.year + 1 : currentSchedule.year;
        loadSchedule(newMonth, newYear);
    };

    const total = subscription.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const discount = subscription.plan.discount_percent ? (total * parseFloat(subscription.plan.discount_percent)) / 100 : 0;

    return (
        <UserLayout>
            <Head title={`Subscription - ${subscription.plan.name}`} />
            <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href="/subscriptions"
                            className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Subscriptions
                        </Link>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{subscription.plan.name}</h1>
                                <span
                                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${statusColors[subscription.status]}`}
                                >
                                    {statusOptions[subscription.status]}
                                </span>
                            </div>
                            {canEdit && subscription.status !== 'cancelled' && (
                                <Link
                                    href={`/subscriptions/${subscription.id}/edit`}
                                    className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Items */}
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                                <h2 className="mb-4 font-semibold text-gray-900">Subscription Items</h2>
                                <div className="space-y-3">
                                    {subscription.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                            {item.product.image && (
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 border-t pt-4">
                                    <div className="flex justify-between text-sm text-gray-600">
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

                            {/* Schedule Calendar */}
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="font-semibold text-gray-900">Delivery Schedule</h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={prevMonth}
                                            className="rounded-lg p-1 hover:bg-gray-100"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <span className="min-w-[120px] text-center font-medium">
                                            {currentSchedule.month_name} {currentSchedule.year}
                                        </span>
                                        <button
                                            onClick={nextMonth}
                                            className="rounded-lg p-1 hover:bg-gray-100"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="py-2 text-xs font-medium text-gray-500">
                                            {day}
                                        </div>
                                    ))}
                                    {Array.from({ length: currentSchedule.first_day_offset }).map((_, i) => (
                                        <div key={`empty-${i}`} className="py-2" />
                                    ))}
                                    {currentSchedule.days.map((day) => (
                                        <div
                                            key={day.date}
                                            className={`relative rounded-lg py-2 text-sm ${
                                                day.is_today
                                                    ? 'ring-2 ring-[var(--theme-primary-1)]'
                                                    : ''
                                            } ${
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
                                            {day.is_vacation && (
                                                <Umbrella className="absolute right-1 top-1 h-3 w-3 text-yellow-600" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="h-3 w-3 rounded bg-green-100" />
                                        <span>Delivery ({currentSchedule.total_deliveries})</span>
                                    </div>
                                    {currentSchedule.vacation_days > 0 && (
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 rounded bg-yellow-100" />
                                            <span>Vacation ({currentSchedule.vacation_days})</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Delivery Address */}
                            <div className="rounded-xl bg-white p-4 shadow-sm">
                                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                    <MapPin className="h-4 w-4" />
                                    Delivery Address
                                </h3>
                                <p className="text-sm text-gray-700">{subscription.address.address_line_1}</p>
                                {subscription.address.address_line_2 && (
                                    <p className="text-sm text-gray-600">{subscription.address.address_line_2}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                    {subscription.address.city}, {subscription.address.state} - {subscription.address.pincode}
                                </p>
                            </div>

                            {/* Upcoming Deliveries */}
                            {subscription.status === 'active' && upcomingDeliveries.length > 0 && (
                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                        <CalendarDays className="h-4 w-4" />
                                        Upcoming Deliveries
                                    </h3>
                                    <div className="space-y-2">
                                        {upcomingDeliveries.slice(0, 5).map((delivery) => (
                                            <div
                                                key={delivery.date}
                                                className={`rounded-lg px-3 py-2 text-sm ${
                                                    delivery.is_today
                                                        ? 'bg-green-50 font-medium text-green-800'
                                                        : 'bg-gray-50 text-gray-700'
                                                }`}
                                            >
                                                {delivery.formatted}
                                                {delivery.is_today && (
                                                    <span className="ml-2 text-xs">(Today)</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            {subscription.status !== 'cancelled' && (
                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <h3 className="mb-3 font-semibold text-gray-900">Actions</h3>
                                    <div className="space-y-2">
                                        {subscription.status === 'active' && (
                                            <>
                                                <button
                                                    onClick={handlePause}
                                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100"
                                                >
                                                    <Pause className="h-4 w-4" />
                                                    Pause Subscription
                                                </button>
                                                <button
                                                    onClick={() => setShowVacationModal(true)}
                                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-100"
                                                >
                                                    <Umbrella className="h-4 w-4" />
                                                    {subscription.vacation_start ? 'Update Vacation' : 'Set Vacation Hold'}
                                                </button>
                                                {subscription.vacation_start && (
                                                    <button
                                                        onClick={handleClearVacation}
                                                        className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
                                                    >
                                                        Clear vacation hold
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {subscription.status === 'paused' && (
                                            <button
                                                onClick={handleResume}
                                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                            >
                                                <Play className="h-4 w-4" />
                                                Resume Subscription
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Cancel Subscription
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {subscription.notes && (
                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <h3 className="mb-2 font-semibold text-gray-900">Delivery Notes</h3>
                                    <p className="text-sm text-gray-600">{subscription.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Vacation Modal */}
            {showVacationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Set Vacation Hold</h3>
                            <button onClick={() => setShowVacationModal(false)}>
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSetVacation}>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={vacationForm.data.vacation_start}
                                        onChange={(e) => vacationForm.setData('vacation_start', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full rounded-lg border px-3 py-2 focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={vacationForm.data.vacation_end}
                                        onChange={(e) => vacationForm.setData('vacation_end', e.target.value)}
                                        min={vacationForm.data.vacation_start || new Date().toISOString().split('T')[0]}
                                        className="w-full rounded-lg border px-3 py-2 focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowVacationModal(false)}
                                    className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={vacationForm.processing}
                                    className="flex-1 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--theme-primary-1-dark)] disabled:opacity-50"
                                >
                                    Set Vacation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-red-800">Cancel Subscription</h3>
                            <button onClick={() => setShowCancelModal(false)}>
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <p className="mb-4 text-sm text-gray-600">
                            Are you sure you want to cancel this subscription? This action cannot be undone.
                        </p>
                        <form onSubmit={handleCancel}>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Reason (optional)
                                </label>
                                <textarea
                                    value={cancelForm.data.reason}
                                    onChange={(e) => cancelForm.setData('reason', e.target.value)}
                                    rows={3}
                                    placeholder="Help us improve by sharing your reason..."
                                    className="w-full rounded-lg border px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                                >
                                    Keep Subscription
                                </button>
                                <button
                                    type="submit"
                                    disabled={cancelForm.processing}
                                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    Cancel Subscription
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}

