import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Pencil, Eye, Trash2, Power } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface DriverData {
    id: number;
    employee_id: string;
    phone: string;
    is_active: boolean;
    is_online: boolean;
    user?: { id: number; name: string | null; phone: string | null };
    zone?: { id: number; name: string; code: string } | null;
}

interface AdminDriversIndexProps {
    drivers: DriverData[];
}

export default function AdminDriversIndex({ drivers }: AdminDriversIndexProps) {
    const { flash } = (usePage().props as { flash?: { message?: string } }) ?? {};
    return (
        <AdminLayout title="Drivers">
            <Head title="Drivers - Admin" />
            <div className="space-y-4">
                {flash?.message && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{flash.message}</div>
                )}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Drivers</h2>
                    <Link
                        href="/admin/drivers/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Add driver
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Employee ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name / Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Zone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {drivers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No drivers yet. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                drivers.map((driver) => (
                                    <tr key={driver.id}>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{driver.employee_id}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {driver.user?.name ?? '—'} / {driver.phone}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {driver.zone ? `${driver.zone.name} (${driver.zone.code})` : '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={driver.is_active ? 'text-green-600' : 'text-gray-400'}>
                                                {driver.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            {driver.is_online && <span className="ml-1 text-xs text-blue-600">Online</span>}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/admin/drivers/${driver.id}`} className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="View">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={`/admin/drivers/${driver.id}/edit`} className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/drivers/${driver.id}/toggle-status`}
                                                    method="post"
                                                    as="button"
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title={driver.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/drivers/${driver.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className="rounded p-2 text-red-500 hover:bg-red-50"
                                                    title="Delete"
                                                    preserveScroll
                                                    onBefore={() => (confirm('Delete this driver?') ? undefined : false)}
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
