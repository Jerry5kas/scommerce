import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface Coupon {
    id: number;
    code: string;
    name: string;
}

interface Usage {
    id: number;
    discount_amount: string;
    order_amount: string;
    used_at: string;
    user: { id: number; name: string; email: string };
    order: { id: number; order_number: string; total: string } | null;
}

interface PaginatedUsages {
    data: Usage[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    coupon: Coupon;
    usages: PaginatedUsages;
}

export default function CouponUsages({ coupon, usages }: Props) {
    return (
        <AdminLayout>
            <Head title={`${coupon.code} Usages`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/admin/coupons/${coupon.id}`} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Coupon Usages</h1>
                            <p className="text-gray-500">
                                {coupon.code} — {coupon.name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    {usages.data.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No usage records found for this coupon.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Order Amount</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Discount</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Used At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {usages.data.map((usage) => (
                                    <tr key={usage.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{usage.user.name}</p>
                                            <p className="text-sm text-gray-500">{usage.user.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {usage.order ? (
                                                <Link href={`/admin/orders/${usage.order.id}`} className="text-indigo-600 hover:underline">
                                                    {usage.order.order_number}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-900">₹{usage.order_amount}</td>
                                        <td className="px-4 py-3 text-right font-medium text-green-600">-₹{usage.discount_amount}</td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-500">{new Date(usage.used_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {usages.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {usages.prev_page_url && (
                            <Link href={usages.prev_page_url} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                                Previous
                            </Link>
                        )}
                        <span className="text-sm text-gray-500">
                            Page {usages.current_page} of {usages.last_page}
                        </span>
                        {usages.next_page_url && (
                            <Link href={usages.next_page_url} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                                Next
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
