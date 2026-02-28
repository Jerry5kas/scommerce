import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Product {
    id: number;
    name: string;
}

interface SubscriptionPlanItem {
    id?: number;
    product_id: number | string;
    units: number;
    total_price: number;
    per_unit_price: number;
}

interface SubscriptionPlanFeature {
    id?: number;
    title: string;
    highlight: boolean;
}

interface SubscriptionPlan {
    id: number;
    name: string;
    description: string | null;
    frequency_type: string;
    discount_type: string;
    discount_value: number;
    is_active: boolean;
    sort_order: number;
    subscriptions_count: number;
    items: SubscriptionPlanItem[];
    features: SubscriptionPlanFeature[];
}

interface EditSubscriptionPlanProps {
    plan: SubscriptionPlan;
    products: Product[];
    frequencyOptions: Record<string, string>;
    discountOptions: Record<string, string>;
}

export default function EditSubscriptionPlan({ plan, products, frequencyOptions, discountOptions }: EditSubscriptionPlanProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: plan.name,
        description: plan.description ?? '',
        frequency_type: plan.frequency_type,
        discount_type: plan.discount_type,
        discount_value: plan.discount_value,
        is_active: plan.is_active,
        sort_order: plan.sort_order,
        items: plan.items.map(item => ({
            product_id: item.product_id,
            units: item.units,
            total_price: item.total_price,
            per_unit_price: item.per_unit_price
        })),
        features: plan.features.map(feature => ({
            title: feature.title,
            highlight: feature.highlight
        })),
    });

    // Items management
    const addItem = () => {
        setData('items', [...data.items, { product_id: '', units: 1, total_price: 0, per_unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    // Features management
    const addFeature = () => {
        setData('features', [...data.features, { title: '', highlight: false }]);
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...data.features];
        newFeatures.splice(index, 1);
        setData('features', newFeatures);
    };

    const updateFeature = (index: number, field: string, value: any) => {
        const newFeatures = [...data.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setData('features', newFeatures);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/subscription-plans/${plan.id}`);
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

                        {/* Configuration */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Configuration</h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Frequency Type</label>
                                    <select
                                        value={data.frequency_type}
                                        onChange={(e) => setData('frequency_type', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                    >
                                        {Object.entries(frequencyOptions).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    {errors.frequency_type && <p className="mt-1 text-xs text-red-600">{errors.frequency_type}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Sort Order</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                    />
                                    {errors.sort_order && <p className="mt-1 text-xs text-red-600">{errors.sort_order}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Discount Type</label>
                                    <select
                                        value={data.discount_type}
                                        onChange={(e) => setData('discount_type', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                    >
                                        {Object.entries(discountOptions).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    {errors.discount_type && <p className="mt-1 text-xs text-red-600">{errors.discount_type}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Discount Value</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={data.discount_value}
                                        onChange={(e) => setData('discount_value', parseFloat(e.target.value))}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 focus:outline-none"
                                    />
                                    {errors.discount_value && <p className="mt-1 text-xs text-red-600">{errors.discount_value}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Plan Items */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Plan Items (Products)</h2>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="flex items-center gap-1 text-xs font-medium text-[var(--admin-dark-primary)] hover:text-[var(--admin-dark-primary)]/80"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {data.items.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:flex-row sm:items-start">
                                        <div className="flex-1 space-y-3">
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">Product</label>
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                                                    >
                                                        <option value="">Select Product</option>
                                                        {products.map((p) => (
                                                            <option key={p.id} value={p.id}>{p.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">Units</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.units}
                                                        onChange={(e) => updateItem(index, 'units', parseInt(e.target.value))}
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">Total Price</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step={0.01}
                                                        value={item.total_price}
                                                        onChange={(e) => updateItem(index, 'total_price', parseFloat(e.target.value))}
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">Per Unit Price</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step={0.01}
                                                        value={item.per_unit_price}
                                                        onChange={(e) => updateItem(index, 'per_unit_price', parseFloat(e.target.value))}
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="mt-6 text-gray-400 hover:text-red-500 sm:mt-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {data.items.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No items added yet.</p>
                                )}
                                {errors.items && <p className="text-xs text-red-600">{errors.items}</p>}
                            </div>
                        </div>

                        {/* Plan Features */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Features (Benefits)</h2>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="flex items-center gap-1 text-xs font-medium text-[var(--admin-dark-primary)] hover:text-[var(--admin-dark-primary)]/80"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Feature
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={feature.title}
                                            onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                            placeholder="Feature title"
                                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                        />
                                        <label className="flex items-center gap-2 text-xs text-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={feature.highlight}
                                                onChange={(e) => updateFeature(index, 'highlight', e.target.checked)}
                                                className="rounded border-gray-300 text-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                                            />
                                            Highlight
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {data.features.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No features added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Status */}
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

                        {/* Actions */}
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Actions</h2>
                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[var(--admin-dark-primary)]/90 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                                <Link
                                    href="/admin/subscription-plans"
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}