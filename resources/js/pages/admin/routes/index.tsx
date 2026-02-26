import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface RouteData {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    addresses_count: number;
    hub?: {
        name: string;
    };
}

interface AdminRoutesIndexProps {
    routes: RouteData[];
}

export default function AdminRoutesIndex({ routes }: AdminRoutesIndexProps) {
    const { flash } = (usePage().props as { flash?: { message?: string } }) ?? {};
    return (
        <AdminLayout title="Routes">
            <Head title="Routes - Admin" />
            <div className="space-y-4">
                {flash?.message && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{flash.message}</div>
                )}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Routes</h2>
                    <Link
                        href="/admin/routes/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Route
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Route Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Hub</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Customers</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {routes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No routes yet. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                routes.map((route) => (
                                    <tr key={route.id}>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <Link href={`/admin/routes/${route.id}/edit`} className="font-medium text-[var(--admin-dark-primary)] hover:underline">
                                                {route.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{route.hub?.name || '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {route.addresses_count} Stops
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={route.is_active ? 'text-green-600' : 'text-gray-400'}>
                                                {route.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={`/admin/routes/${route.id}/edit`}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Edit Sequence"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/routes/${route.id}/toggle-status`}
                                                    method="post"
                                                    as="button"
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title={route.is_active ? 'Disable' : 'Enable'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/routes/${route.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className="rounded p-2 text-red-500 hover:bg-red-50"
                                                    title="Delete"
                                                    preserveScroll
                                                    onBefore={() => (confirm('Delete this route?') ? undefined : false)}
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
