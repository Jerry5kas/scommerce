import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface SubscriptionPlan {
    id: number;
    name: string;
    description: string | null;
    frequency_type: string;
    discount_type: 'none' | 'percentage' | 'flat';
    discount_value: number;
    is_active: boolean;
    sort_order: number;
    subscriptions_count: number;
}

interface AdminSubscriptionPlansIndexProps {
    plans: {
        data: SubscriptionPlan[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    frequencyOptions: Record<string, string>;
}

export default function AdminSubscriptionPlansIndex({
    plans,
    frequencyOptions,
}: AdminSubscriptionPlansIndexProps) {
    const handleToggle = (plan: SubscriptionPlan) => {
        router.post(`/admin/subscription-plans/${plan.id}/toggle-status`, {}, { preserveScroll: true });
    };

    const handleDelete = (plan: SubscriptionPlan) => {
        if (plan.subscriptions_count > 0) {
            alert(`Cannot delete plan with ${plan.subscriptions_count} active subscriptions.`);
            return;
        }
        if (confirm(`Delete plan "${plan.name}"?`)) {
            router.delete(`/admin/subscription-plans/${plan.id}`);
        }
    };

    return (
        <AdminLayout title="Subscription Plans">
            <Head title="Subscription Plans" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Subscription Plans</h1>
                        <p className="text-sm text-gray-600">Manage delivery frequency plans</p>
                    </div>
                    <Link
                        href="/admin/subscription-plans/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--admin-dark-primary)]/90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Plan
                    </Link>
                </div>

                {/* Plans Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.data.map((plan) => (
                        <div
                            key={plan.id}
                            className={`rounded-lg border bg-white p-4 shadow-sm ${
                                !plan.is_active ? 'opacity-60' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                                    <p className="text-sm text-gray-600">{frequencyOptions[plan.frequency_type]}</p>
                                </div>
                                <button
                                    onClick={() => handleToggle(plan)}
                                    className={`rounded-lg p-1 ${
                                        plan.is_active
                                            ? 'text-green-600 hover:bg-green-50'
                                            : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                    title={plan.is_active ? 'Deactivate' : 'Activate'}
                                >
                                    {plan.is_active ? (
                                        <ToggleRight className="h-6 w-6" />
                                    ) : (
                                        <ToggleLeft className="h-6 w-6" />
                                    )}
                                </button>
                            </div>

                            {plan.description && (
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{plan.description}</p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                {plan.discount_type !== 'none' && (
                                    <span className="rounded-full bg-green-100 px-2 py-1 text-green-800">
                                        {plan.discount_type === 'percentage' 
                                            ? `${Math.round(plan.discount_value)}% off` 
                                            : `₹${Math.round(plan.discount_value)} off`}
                                    </span>
                                )}
                                <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">
                                    Order: {plan.sort_order}
                                </span>
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                                    {plan.subscriptions_count} subscriptions
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                                <span
                                    className={`text-xs font-medium ${
                                        plan.is_active ? 'text-green-600' : 'text-gray-500'
                                    }`}
                                >
                                    {plan.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <div className="flex gap-1">
                                    <Link
                                        href={`/admin/subscription-plans/${plan.id}/edit`}
                                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(plan)}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                        disabled={plan.subscriptions_count > 0}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {plans.data.length === 0 && (
                    <div className="rounded-lg bg-white p-8 text-center">
                        <p className="text-gray-600">No subscription plans created yet.</p>
                        <Link
                            href="/admin/subscription-plans/create"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white"
                        >
                            <Plus className="h-4 w-4" />
                            Create First Plan
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

