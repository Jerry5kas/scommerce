import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

interface ActivityLogUser {
    id: number;
    name: string | null;
    phone: string | null;
}

interface ActivityLogItem {
    id: number;
    action: string;
    description: string | null;
    model_type: string | null;
    model_id: string | null;
    user: ActivityLogUser | null;
    admin: ActivityLogUser | null;
    ip_address: string | null;
    created_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ActivityLogsPageProps {
    logs: {
        data: ActivityLogItem[];
        links: PaginationLink[];
        total: number;
    };
}

export default function ActivityLogsIndex({ logs }: ActivityLogsPageProps) {
    const { url } = usePage();
    const isAdminUserPage = (link: PaginationLink) => link.url && link.url.includes('page=');

    return (
        <AdminLayout title="Activity Logs">
            <Head title="Activity Logs - Admin" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
                    <p className="text-sm text-gray-500">Total: {logs.total}</p>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Time
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Action
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Admin
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Model
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    IP
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-sm text-gray-500"
                                    >
                                        No activity logs yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr key={log.id}>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {log.created_at}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                            {log.action}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {log.description ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {log.user
                                                ? `${log.user.name ?? log.user.phone ?? `#${log.user.id}`}`
                                                : '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {log.admin
                                                ? `${log.admin.name ?? log.admin.phone ?? `#${log.admin.id}`}`
                                                : '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                                            {log.model_type
                                                ? `${log.model_type.split('\\').pop()} #${log.model_id}`
                                                : '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                                            {log.ip_address ?? '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-sm text-gray-600">
                    <span>
                        Showing {logs.data.length} of {logs.total}
                    </span>
                    <div className="flex flex-wrap gap-1">
                        {logs.links
                            .filter(isAdminUserPage)
                            .map((link, index) => (
                                <Link
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    href={link.url ?? url.toString()}
                                    className={`rounded border px-2 py-1 ${
                                        link.active
                                            ? 'border-[var(--admin-dark-primary)] bg-[var(--admin-dark-primary)] text-white'
                                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

