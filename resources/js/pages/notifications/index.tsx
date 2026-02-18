import { Head, router } from '@inertiajs/react';
import { Bell, Check, CheckCheck, Package, Wallet } from 'lucide-react';
import UserLayout from '@/layouts/UserLayout';

interface Notification {
    id: string;
    type: string;
    title: string | null;
    message: string | null;
    data: Record<string, unknown> | null;
    read_at: string | null;
    created_at: string;
}

interface PaginatedNotifications {
    data: Notification[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
}

interface Props {
    notifications: PaginatedNotifications;
    unreadCount: number;
}

const typeIcons: Record<string, typeof Bell> = {
    order: Package,
    wallet: Wallet,
    default: Bell,
};

export default function NotificationsIndex({ notifications, unreadCount }: Props) {
    const handleMarkAsRead = (id: string) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const getIcon = (type: string) => {
        const Icon = typeIcons[type] || typeIcons.default;
        return <Icon className="h-5 w-5" />;
    };

    return (
        <UserLayout>
            <Head title="Notifications" />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-500">{unreadCount} unread</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {notifications.data.length === 0 ? (
                        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                            <Bell className="mx-auto h-12 w-12 text-gray-300" />
                            <p className="mt-4 text-gray-500">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.data.map((notification) => (
                            <div
                                key={notification.id}
                                className={`rounded-xl bg-white p-4 shadow-sm transition ${
                                    !notification.read_at ? 'border-l-4 border-indigo-500' : ''
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`rounded-full p-2 ${!notification.read_at ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        {notification.title && (
                                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                        )}
                                        {notification.message && (
                                            <p className="text-sm text-gray-600">{notification.message}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-400">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {!notification.read_at && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="text-indigo-600 hover:text-indigo-700"
                                            title="Mark as read"
                                        >
                                            <Check className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {notifications.next_page_url && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.get(notifications.next_page_url!)}
                            className="text-indigo-600 hover:underline"
                        >
                            Load more
                        </button>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}

