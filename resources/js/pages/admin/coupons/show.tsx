import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Tag, TrendingUp, Users } from 'lucide-react';

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
    usage_limit_per_user: number;
    used_count: number;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
    applicable_to: string;
    exclude_free_samples: boolean;
    exclude_subscriptions: boolean;
    first_order_only: boolean;
    new_users_only: boolean;
    created_at: string;
}

interface Usage {
    id: number;
    discount_amount: string;
    order_amount: string;
    used_at: string;
    user: { id: number; name: string; email: string };
    order: { id: number; order_number: string; total: string } | null;
}

interface Stats {
    total_uses: number;
    total_discount: number;
    total_order_value: number;
    unique_users: number;
    average_discount: number;
    average_order_value: number;
    remaining_uses: number | null;
}

interface PaginatedUsages {
    data: Usage[];
    current_page: number;
    last_page: number;
}

interface Props {
    coupon: Coupon;
    stats: Stats;
    usages: PaginatedUsages;
}

const typeLabels: Record<string, string> = {
    percentage: 'Percentage',
    fixed: 'Fixed Amount',
    free_shipping: 'Free Shipping',
};

export default function CouponShow({ coupon, stats, usages }: Props) {
    const getDiscountLabel = () => {
        switch (coupon.type) {
            case 'percentage':
                return `${coupon.value}% off`;
            case 'fixed':
                return `₹${coupon.value} off`;
            case 'free_shipping':
                return 'Free Shipping';
            default:
                return coupon.value;
        }
    };

    return (
        <AdminLayout>
            <Head title={`Coupon: ${coupon.code}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/coupons"
                            className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{coupon.code}</h1>
                            <p className="text-gray-500">{coupon.name}</p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/coupons/${coupon.id}/edit`}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-2">
                                <Tag className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Uses</p>
                                <p className="text-xl font-bold">{stats.total_uses}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Discount Given</p>
                                <p className="text-xl font-bold">₹{stats.total_discount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Unique Users</p>
                                <p className="text-xl font-bold">{stats.unique_users}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Order Value Generated</p>
                        <p className="text-xl font-bold">₹{stats.total_order_value.toFixed(2)}</p>
                    </div>
                </div>

                {/* Coupon Details */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Coupon Details</h2>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Discount</dt>
                                <dd className="font-medium text-indigo-600">{getDiscountLabel()}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Type</dt>
                                <dd>{typeLabels[coupon.type]}</dd>
                            </div>
                            {coupon.min_order_amount && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Min Order</dt>
                                    <dd>₹{coupon.min_order_amount}</dd>
                                </div>
                            )}
                            {coupon.max_discount && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Max Discount</dt>
                                    <dd>₹{coupon.max_discount}</dd>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Usage</dt>
                                <dd>
                                    {coupon.used_count}
                                    {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ' (unlimited)'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Per User Limit</dt>
                                <dd>{coupon.usage_limit_per_user}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Status</dt>
                                <dd>
                                    <span
                                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                                    >
                                        {coupon.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Restrictions</h2>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Applicable To</dt>
                                <dd className="capitalize">{coupon.applicable_to.replace('_', ' ')}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Exclude Free Samples</dt>
                                <dd>{coupon.exclude_free_samples ? 'Yes' : 'No'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Exclude Subscriptions</dt>
                                <dd>{coupon.exclude_subscriptions ? 'Yes' : 'No'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">First Order Only</dt>
                                <dd>{coupon.first_order_only ? 'Yes' : 'No'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">New Users Only</dt>
                                <dd>{coupon.new_users_only ? 'Yes' : 'No'}</dd>
                            </div>
                            {coupon.starts_at && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Starts</dt>
                                    <dd>{new Date(coupon.starts_at).toLocaleString()}</dd>
                                </div>
                            )}
                            {coupon.ends_at && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Ends</dt>
                                    <dd>{new Date(coupon.ends_at).toLocaleString()}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>

                {/* Usage History */}
                <div className="rounded-xl bg-white shadow-sm">
                    <div className="border-b p-4">
                        <h2 className="text-lg font-semibold">Usage History</h2>
                    </div>
                    {usages.data.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No usages yet</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Order
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                        Order Amount
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                        Discount
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {usages.data.map((usage) => (
                                    <tr key={usage.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{usage.user.name}</p>
                                            <p className="text-sm text-gray-500">{usage.user.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {usage.order ? (
                                                <Link
                                                    href={`/admin/orders/${usage.order.id}`}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    {usage.order.order_number}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">₹{usage.order_amount}</td>
                                        <td className="px-4 py-3 text-right font-medium text-green-600">
                                            -₹{usage.discount_amount}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-500">
                                            {new Date(usage.used_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

