import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface SubscriptionPlan {
    id: number;
    name: string;
    description: string | null;
    frequency_type: string;
    frequency_value: number | null;
    days_of_week: number[] | null;
    discount_percent: string;
    min_deliveries: number | null;
    is_active: boolean;
    display_order: number;
    subscriptions_count: number;
}

interface EditSubscriptionPlanProps {
    plan: SubscriptionPlan;
    frequencyOptions: Record<string, string>;
    dayOptions: Record<number, string>;
}

export default function EditSubscriptionPlan({ plan, frequencyOptions, dayOptions }: EditSubscriptionPlanProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: plan.name,
        description: plan.description ?? '',
        frequency_type: plan.frequency_type,
        frequency_value: plan.frequency_value?.toString() ?? '',
        days_of_week: plan.days_of_week ?? ([] as number[]),
        discount_percent: plan.discount_percent ?? '',
        min_deliveries: plan.min_deliveries?.toString() ?? '',
        is_active: plan.is_active,
        display_order: plan.display_order,
    });

    const handleDayToggle = (day: number) => {
        setData('days_of_week', data.days_of_week.includes(day)
            ? data.days_of_week.filter((d) => d !== day)
            : [...data.days_of_week, day].sort());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/subscription-plans/${plan.id}`);
    };

    const getPreviewDescription = () => {
        switch (data.frequency_type) {
            case 'daily':
                return 'Delivered every day.';
            case 'alternate_days':
                return 'Delivered every 2 days (alternate days).';
            case 'weekly': {
                const selected = data.days_of_week.map((d) => dayOptions[d]).join(', ');
                return selected ? `Delivered every week on: ${selected}.` : 'Select at least one day of the week.';
            }
            case 'custom':
                return data.frequency_value
                    ? `Delivered every ${data.frequency_value} day(s).`
                    : 'Enter a custom interval in days.';
            default:
                return '';
        }
    };

    return (
        <AdminLayout title={`Edit Plan: ${plan.name}`}>
            <Head title={`Edit Plan: ${plan.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/subscription-plans"
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Edit Plan</h1>
                        <p className="text-sm text-gray-500">
                            {plan.name}
                            {plan.subscriptions_count > 0 && (
                                <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                    {plan.subscriptions_count} active subscriptions
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {plan.subscriptions_count > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        This plan has <strong>{plan.subscriptions_count} active subscription(s)</strong>. Changing the
                        frequency will affect upcoming delivery dates for those subscribers.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Form */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Info */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Plan Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Plan Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                    />
                                    {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Frequency */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Delivery Frequency</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Frequency Type <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {Object.entries(frequencyOptions).map(([value, label]) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setData('frequency_type', value)}
                                                className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                                                    data.frequency_type === value
                                                        ? 'border-[var(--admin-dark-primary)] bg-[var(--admin-dark-primary)]/10 text-[var(--admin-dark-primary)]'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.frequency_type && (
                                        <p className="mt-1 text-xs text-red-600">{errors.frequency_type}</p>
                                    )}
                                </div>

                                {data.frequency_type === 'weekly' && (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Days of Week <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(dayOptions).map(([day, label]) => {
                                                const dayNum = Number(day);
                                                const isSelected = data.days_of_week.includes(dayNum);
                                                return (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => handleDayToggle(dayNum)}
                                                        className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                                                            isSelected
                                                                ? 'border-[var(--admin-dark-primary)] bg-[var(--admin-dark-primary)] text-white'
                                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        {label.slice(0, 3)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.days_of_week && (
                                            <p className="mt-1 text-xs text-red-600">{errors.days_of_week}</p>
                                        )}
                                    </div>
                                )}

                                {data.frequency_type === 'custom' && (
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Every N Days <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Every</span>
                                            <input
                                                type="number"
                                                min={1}
                                                max={30}
                                                value={data.frequency_value}
                                                onChange={(e) => setData('frequency_value', e.target.value)}
                                                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                            />
                                            <span className="text-sm text-gray-500">day(s)</span>
                                        </div>
                                        {errors.frequency_value && (
                                            <p className="mt-1 text-xs text-red-600">{errors.frequency_value}</p>
                                        )}
                                    </div>
                                )}

                                <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Preview</p>
                                    <p className="text-sm text-blue-800">{getPreviewDescription()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Constraints */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Pricing & Limits</h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Discount %</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            step={0.01}
                                            value={data.discount_percent}
                                            onChange={(e) => setData('discount_percent', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-8 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                        />
                                        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">%</span>
                                    </div>
                                    {errors.discount_percent && (
                                        <p className="mt-1 text-xs text-red-600">{errors.discount_percent}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Min. Deliveries</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={data.min_deliveries}
                                        onChange={(e) => setData('min_deliveries', e.target.value)}
                                        placeholder="Optional"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Minimum deliveries before cancellation</p>
                                    {errors.min_deliveries && (
                                        <p className="mt-1 text-xs text-red-600">{errors.min_deliveries}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Display Order</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={data.display_order}
                                        onChange={(e) => setData('display_order', Number(e.target.value))}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Lower number = shown first</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Status</h2>
                            <label className="flex cursor-pointer items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Active</p>
                                    <p className="text-xs text-gray-500">Visible to customers</p>
                                </div>
                                <div
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                                        data.is_active ? 'bg-[var(--admin-dark-primary)]' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                            data.is_active ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </div>
                            </label>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Summary</h2>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Name</dt>
                                    <dd className="font-medium text-gray-900 truncate max-w-[140px]">{data.name || '—'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Frequency</dt>
                                    <dd className="font-medium text-gray-900">{frequencyOptions[data.frequency_type]}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Discount</dt>
                                    <dd className="font-medium text-gray-900">
                                        {data.discount_percent ? `${data.discount_percent}%` : 'None'}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Subscribers</dt>
                                    <dd className="font-medium text-gray-900">{plan.subscriptions_count}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--admin-dark-primary)]/90 disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Saving…' : 'Save Changes'}
                            </button>
                            <Link
                                href="/admin/subscription-plans"
                                className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
