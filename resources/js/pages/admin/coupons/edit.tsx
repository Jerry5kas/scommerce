import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

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

interface Coupon {
    id: number;
    code: string;
    name: string;
    description: string | null;
    type: string;
    value: string;
    min_order_amount: string | null;
    max_discount: string | null;
    usage_limit: number | null;
    usage_limit_per_user: number | null;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
    applicable_to: string;
    applicable_ids: number[] | null;
    exclude_free_samples: boolean;
    exclude_subscriptions: boolean;
    first_order_only: boolean;
    new_users_only: boolean;
}

interface Props {
    coupon: Coupon;
    typeOptions: Record<string, string>;
    applicableOptions: Record<string, string>;
    categories: Category[];
    collections: Collection[];
    products: Product[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-3">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="space-y-5 p-5">{children}</div>
        </div>
    );
}

const inputCls =
    'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-1 focus:ring-[var(--admin-dark-primary)]';
const labelCls = 'block text-sm font-medium text-gray-700';

const toDateTimeLocal = (value: string | null): string => {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const pad = (number: number) => number.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function CouponEdit({ coupon, typeOptions, applicableOptions, categories, collections, products }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description ?? '',
        type: coupon.type,
        value: coupon.value,
        min_order_amount: coupon.min_order_amount ?? '',
        max_discount: coupon.max_discount ?? '',
        usage_limit: coupon.usage_limit ? String(coupon.usage_limit) : '',
        usage_limit_per_user: coupon.usage_limit_per_user ? String(coupon.usage_limit_per_user) : '1',
        is_active: coupon.is_active,
        starts_at: toDateTimeLocal(coupon.starts_at),
        ends_at: toDateTimeLocal(coupon.ends_at),
        applicable_to: coupon.applicable_to,
        applicable_ids: coupon.applicable_ids ?? [],
        exclude_free_samples: coupon.exclude_free_samples,
        exclude_subscriptions: coupon.exclude_subscriptions,
        first_order_only: coupon.first_order_only,
        new_users_only: coupon.new_users_only,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/coupons/${coupon.id}`);
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
        <AdminLayout title="Edit coupon">
            <Head title={`Edit ${coupon.code} - Admin`} />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Link href="/admin/coupons" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-(--admin-dark-primary)">
                    <ArrowLeft className="h-4 w-4" /> Back to coupons
                </Link>

                <Section title="Basic details">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Code *</label>
                            <input
                                type="text"
                                className={inputCls + ' uppercase'}
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                            />
                            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Name *</label>
                            <input type="text" className={inputCls} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea rows={2} className={inputCls} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>
                </Section>

                <Section title="Discount settings">
                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <label className={labelCls}>Type *</label>
                            <select className={inputCls} value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                {Object.entries(typeOptions).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Value * {data.type === 'percentage' ? '(%)' : '(₹)'}</label>
                            <input
                                type="number"
                                className={inputCls}
                                min="0"
                                step={data.type === 'percentage' ? '1' : '0.01'}
                                disabled={data.type === 'free_shipping'}
                                value={data.value}
                                onChange={(e) => setData('value', e.target.value)}
                            />
                            {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Max discount (₹)</label>
                            <input
                                type="number"
                                className={inputCls}
                                min="0"
                                placeholder="No limit"
                                value={data.max_discount}
                                onChange={(e) => setData('max_discount', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Min order amount (₹)</label>
                        <input
                            type="number"
                            className={inputCls + ' max-w-xs'}
                            min="0"
                            placeholder="No minimum"
                            value={data.min_order_amount}
                            onChange={(e) => setData('min_order_amount', e.target.value)}
                        />
                    </div>
                </Section>

                <Section title="Usage limits">
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className={labelCls}>Total usage limit</label>
                            <input
                                type="number"
                                className={inputCls}
                                min="1"
                                placeholder="Unlimited"
                                value={data.usage_limit}
                                onChange={(e) => setData('usage_limit', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Per user limit</label>
                            <input
                                type="number"
                                className={inputCls}
                                min="1"
                                value={data.usage_limit_per_user}
                                onChange={(e) => setData('usage_limit_per_user', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Starts at</label>
                            <input
                                type="datetime-local"
                                className={inputCls}
                                value={data.starts_at}
                                onChange={(e) => setData('starts_at', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Ends at</label>
                            <input
                                type="datetime-local"
                                className={inputCls}
                                value={data.ends_at}
                                onChange={(e) => setData('ends_at', e.target.value)}
                            />
                        </div>
                    </div>
                </Section>

                <Section title="Applicability">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Applicable to</label>
                            <select
                                className={inputCls}
                                value={data.applicable_to}
                                onChange={(e) => {
                                    setData('applicable_to', e.target.value);
                                    setData('applicable_ids', []);
                                }}
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
                                <label className={labelCls}>Select {data.applicable_to}</label>
                                <select
                                    multiple
                                    className={inputCls + ' h-32'}
                                    value={data.applicable_ids.map(String)}
                                    onChange={(e) =>
                                        setData(
                                            'applicable_ids',
                                            Array.from(e.target.selectedOptions, (option) => parseInt(option.value)),
                                        )
                                    }
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
                </Section>

                <Section title="Restrictions">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={data.exclude_free_samples}
                                onChange={(e) => setData('exclude_free_samples', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">Exclude free samples</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={data.exclude_subscriptions}
                                onChange={(e) => setData('exclude_subscriptions', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">Exclude subscriptions</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={data.first_order_only}
                                onChange={(e) => setData('first_order_only', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">First order only</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={data.new_users_only}
                                onChange={(e) => setData('new_users_only', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">New users only</span>
                        </label>
                    </div>
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                </Section>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-(--admin-dark-primary) px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                    >
                        {processing ? 'Updating…' : 'Update coupon'}
                    </button>
                    <Link
                        href="/admin/coupons"
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
