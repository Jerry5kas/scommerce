import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Pencil, Eye, Trash2, Power } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ZoneData {
    id: number;
    name: string;
    code: string;
    city: string;
    state: string;
    is_active: boolean;
    drivers_count: number;
    addresses_count: number;
    hub?: { name: string; };
}

interface AdminZonesIndexProps {
    zones: ZoneData[];
}

export default function AdminZonesIndex({ zones }: AdminZonesIndexProps) {
    const { flash } = (usePage().props as { flash?: { message?: string } }) ?? {};
    return (
        <AdminLayout title="Zones">
            <Head title="Zones - Admin" />
            <div className="space-y-4">
                {flash?.message && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{flash.message}</div>
                )}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Zones</h2>
                    <Link
                        href="/admin/zones/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Add zone
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Hub</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Code</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">City / State</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Drivers</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Addresses</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {zones.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No zones yet. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                zones.map((zone) => (
                                    <tr key={zone.id}>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <Link href={`/admin/zones/${zone.id}`} className="font-medium text-[var(--admin-dark-primary)] hover:underline">
                                                {zone.name}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--admin-dark-primary)] font-medium bg-green-50/50">{zone.hub?.name || '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{zone.code}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {zone.city}, {zone.state}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{zone.drivers_count}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{zone.addresses_count}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={zone.is_active ? 'text-green-600' : 'text-gray-400'}>
                                                {zone.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={`/admin/zones/${zone.id}`}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/zones/${zone.id}/edit`}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/zones/${zone.id}/toggle-status`}
                                                    method="post"
                                                    as="button"
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title={zone.is_active ? 'Disable' : 'Enable'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/zones/${zone.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className="rounded p-2 text-red-500 hover:bg-red-50"
                                                    title="Delete"
                                                    preserveScroll
                                                    onBefore={() => (confirm('Delete this zone?') ? undefined : false)}
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
