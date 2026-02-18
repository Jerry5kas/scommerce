import { Head, Link } from '@inertiajs/react';
import { BarChart3 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function AdminReportsIndex() {
    return (
        <AdminLayout>
            <Head title="Reports" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-indigo-700">
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-sm font-medium">Overview</span>
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Link href="/admin/referrals/reports" className="rounded-xl border p-4 hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Referrals Report</h3>
                        <p className="text-sm text-gray-600">Daily referrals, top referrers, conversion rate</p>
                    </Link>
                    <Link href="/admin/bottles/reports" className="rounded-xl border p-4 hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Bottles Report</h3>
                        <p className="text-sm text-gray-600">Issued/returned by date, type breakdown</p>
                    </Link>
                    <Link href="/admin/analytics" className="rounded-xl border p-4 hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Analytics</h3>
                        <p className="text-sm text-gray-600">Revenue, events, funnel, products</p>
                    </Link>
                    <Link href="/admin/orders" className="rounded-xl border p-4 hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Orders</h3>
                        <p className="text-sm text-gray-600">Filter by status, date, driver, zone</p>
                    </Link>
                    <Link href="/admin/subscriptions" className="rounded-xl border p-4 hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Subscriptions</h3>
                        <p className="text-sm text-gray-600">List and filter subscriptions</p>
                    </Link>
                    <Link href="/admin/deliveries" className="rounded-xl border p-4 hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Deliveries</h3>
                        <p className="text-sm text-gray-600">List and filter deliveries</p>
                    </Link>
                    <Link href="/admin/payments" className="rounded-xl border p-4 hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Payments</h3>
                        <p className="text-sm text-gray-600">List payments and actions</p>
                    </Link>
                    <Link href="/admin/wallets" className="rounded-xl border p-4 hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Wallets</h3>
                        <p className="text-sm text-gray-600">Wallet balances and transactions</p>
                    </Link>
                    <Link href="/admin/users" className="rounded-xl border p-4 hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Users</h3>
                        <p className="text-sm text-gray-600">Customers and drivers list</p>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
