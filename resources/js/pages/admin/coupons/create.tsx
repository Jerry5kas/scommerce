import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Collection {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
}

interface Props {
    typeOptions: Record<string, string>;
    applicableOptions: Record<string, string>;
    categories: Category[];
    collections: Collection[];
    products: Product[];
}

export default function CouponCreate({ typeOptions, applicableOptions, categories, collections, products }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        description: '',
        type: 'percentage',
        value: '',
        min_order_amount: '',
        max_discount: '',
        usage_limit: '',
        usage_limit_per_user: '1',
        is_active: true,
        starts_at: '',
        ends_at: '',
        applicable_to: 'all',
        applicable_ids: [] as number[],
        exclude_free_samples: true,
        exclude_subscriptions: false,
        first_order_only: false,
        new_users_only: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/coupons');
    };

    const getApplicableItems = () => {
        switch (data.applicable_to) {
            case 'categories':
                return categories;
            case 'collections':
                return collections;
            case 'products':
                return products;
            default:
                return [];
        }
    };

    return (
        <AdminLayout>
            <Head title="Create Coupon" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/coupons"
                        className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Create Coupon</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Details */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Basic Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Code *</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 uppercase"
                                    placeholder="SUMMER20"
                                />
                                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    placeholder="Summer Sale 20% Off"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={2}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    placeholder="Optional description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discount Settings */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Discount Settings</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Type *</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                >
                                    {Object.entries(typeOptions).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Value * {data.type === 'percentage' ? '(%)' : '(₹)'}
                                </label>
                                <input
                                    type="number"
                                    value={data.value}
                                    onChange={(e) => setData('value', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    min="0"
                                    step={data.type === 'percentage' ? '1' : '0.01'}
                                    disabled={data.type === 'free_shipping'}
                                />
                                {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Max Discount (₹)</label>
                                <input
                                    type="number"
                                    value={data.max_discount}
                                    onChange={(e) => setData('max_discount', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    min="0"
                                    placeholder="No limit"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Min Order Amount (₹)</label>
                                <input
                                    type="number"
                                    value={data.min_order_amount}
                                    onChange={(e) => setData('min_order_amount', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    min="0"
                                    placeholder="No minimum"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Usage Limits */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Usage Limits</h2>
                        <div className="grid gap-4 sm:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Total Usage Limit</label>
                                <input
                                    type="number"
                                    value={data.usage_limit}
                                    onChange={(e) => setData('usage_limit', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    min="1"
                                    placeholder="Unlimited"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Per User Limit</label>
                                <input
                                    type="number"
                                    value={data.usage_limit_per_user}
                                    onChange={(e) => setData('usage_limit_per_user', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Starts At</label>
                                <input
                                    type="datetime-local"
                                    value={data.starts_at}
                                    onChange={(e) => setData('starts_at', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Ends At</label>
                                <input
                                    type="datetime-local"
                                    value={data.ends_at}
                                    onChange={(e) => setData('ends_at', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Applicability */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Applicability</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Applicable To</label>
                                <select
                                    value={data.applicable_to}
                                    onChange={(e) => {
                                        setData('applicable_to', e.target.value);
                                        setData('applicable_ids', []);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                >
                                    {Object.entries(applicableOptions).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {data.applicable_to !== 'all' && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Select {data.applicable_to}
                                    </label>
                                    <select
                                        multiple
                                        value={data.applicable_ids.map(String)}
                                        onChange={(e) =>
                                            setData(
                                                'applicable_ids',
                                                Array.from(e.target.selectedOptions, (o) => parseInt(o.value))
                                            )
                                        }
                                        className="h-32 w-full rounded-lg border border-gray-300 px-4 py-2"
                                    >
                                        {getApplicableItems().map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Restrictions */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Restrictions</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.exclude_free_samples}
                                    onChange={(e) => setData('exclude_free_samples', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">Exclude Free Samples</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.exclude_subscriptions}
                                    onChange={(e) => setData('exclude_subscriptions', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">Exclude Subscriptions</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.first_order_only}
                                    onChange={(e) => setData('first_order_only', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">First Order Only</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.new_users_only}
                                    onChange={(e) => setData('new_users_only', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">New Users Only</span>
                            </label>
                        </div>
                    </div>

                    {/* Status & Submit */}
                    <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <span className="font-medium text-gray-700">Active</span>
                        </label>

                        <div className="flex gap-3">
                            <Link
                                href="/admin/coupons"
                                className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Coupon'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

