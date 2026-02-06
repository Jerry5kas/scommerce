import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Bell, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';

interface Notification {
    id: string;
    type: string;
    channel: string;
    title: string | null;
    message: string | null;
    status: string;
    sent_at: string | null;
    user: { id: number; name: string; email: string } | null;
}

interface PaginatedNotifications {
    data: Notification[];
    current_page: number;
    last_page: number;
}

interface Stats {
    total: number;
    pending: number;
    sent: number;
    failed: number;
}

interface Props {
    notifications: PaginatedNotifications;
    stats: Stats;
    filters: { search?: string; channel?: string; status?: string };
    channelOptions: Record<string, string>;
    statusOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    sent: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
    delivered: 'bg-green-100 text-green-700',
    read: 'bg-gray-100 text-gray-700',
};

export default function NotificationsIndex({ notifications, stats, filters, channelOptions, statusOptions }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/notifications', { ...filters, search }, { preserveState: true });
    };

    const handleRetry = (id: string) => {
        router.post(`/admin/notifications/${id}/retry`);
    };

    return (
        <AdminLayout>
            <Head title="Notifications" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <Link
                        href="/admin/notifications/stats"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        View Stats
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-2">
                                <Bell className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Sent</p>
                        <p className="text-xl font-bold text-blue-600">{stats.sent}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Failed</p>
                        <p className="text-xl font-bold text-red-600">{stats.failed}</p>
                    </div>
                </div>

                {/* Search */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by user..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
                            />
                        </div>
                        <select
                            value={filters.channel || ''}
                            onChange={(e) => router.get('/admin/notifications', { ...filters, channel: e.target.value || undefined }, { preserveState: true })}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">All Channels</option>
                            {Object.entries(channelOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => router.get('/admin/notifications', { ...filters, status: e.target.value || undefined }, { preserveState: true })}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">All Status</option>
                            {Object.entries(statusOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
                            Search
                        </button>
                    </form>
                </div>

                {/* Notifications List */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Channel</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Title/Message</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {notifications.data.map((notification) => (
                                <tr key={notification.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        {notification.user ? (
                                            <div>
                                                <p className="font-medium">{notification.user.name}</p>
                                                <p className="text-sm text-gray-500">{notification.user.email}</p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">System</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 capitalize">{channelOptions[notification.channel] || notification.channel}</td>
                                    <td className="max-w-xs truncate px-4 py-3">
                                        {notification.title || notification.message || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[notification.status]}`}>
                                            {statusOptions[notification.status] || notification.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {notification.status === 'failed' && (
                                            <button onClick={() => handleRetry(notification.id)} className="text-indigo-600 hover:text-indigo-700">
                                                <RefreshCw className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {notifications.data.length === 0 && <div className="p-8 text-center text-gray-500">No notifications found</div>}
                </div>
            </div>
        </AdminLayout>
    );
}

