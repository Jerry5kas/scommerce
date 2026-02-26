import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface HubData {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    latitude: string | null;
    longitude: string | null;
}

interface AdminHubsIndexProps {
    hubs: HubData[];
}

export default function AdminHubsIndex({ hubs }: AdminHubsIndexProps) {
    const { flash } = (usePage().props as { flash?: { message?: string } }) ?? {};
    return (
        <AdminLayout title="Hubs">
            <Head title="Hubs - Admin" />
            <div className="space-y-4">
                {flash?.message && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{flash.message}</div>
                )}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Hubs</h2>
                    <Link
                        href="/admin/hubs/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Add hub
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Description</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Coordinates</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {hubs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No hubs yet. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                hubs.map((hub) => (
                                    <tr key={hub.id}>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className="font-medium text-[var(--admin-dark-primary)]">
                                                {hub.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{hub.description || '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {hub.latitude && hub.longitude ? `${hub.latitude}, ${hub.longitude}` : '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={hub.is_active ? 'text-green-600' : 'text-gray-400'}>
                                                {hub.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={`/admin/hubs/${hub.id}/edit`}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/hubs/${hub.id}/toggle-status`}
                                                    method="post"
                                                    as="button"
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title={hub.is_active ? 'Disable' : 'Enable'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/hubs/${hub.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className="rounded p-2 text-red-500 hover:bg-red-50"
                                                    title="Delete"
                                                    preserveScroll
                                                    onBefore={() => (confirm('Delete this hub?') ? undefined : false)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
