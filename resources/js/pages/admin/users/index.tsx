import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Pencil, Users, Ban, CheckCircle, Download } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface UserData {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
    is_active: boolean;
    addresses_count: number;
}

interface AdminUsersIndexProps {
    users: UserData[];
    filterRole?: string | null;
}

const ROLES = [
    { value: '', label: 'All' },
    { value: 'customer', label: 'Customers' },
    { value: 'driver', label: 'Drivers' },
];

export default function AdminUsersIndex({ users, filterRole }: AdminUsersIndexProps) {
    const { flash } = (usePage().props as { flash?: { message?: string } }) ?? {};
    return (
        <AdminLayout title="Users">
            <Head title="Users - Admin" />
            <div className="space-y-4">
                {flash?.message && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{flash.message}</div>
                )}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Customers & Drivers</h2>
                    <div className="flex items-center gap-2">
                        {ROLES.map((r) => (
                            <Link
                                key={r.value || 'all'}
                                href={r.value ? `/admin/users?role=${r.value}` : '/admin/users'}
                                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                    (filterRole ?? '') === r.value
                                        ? 'bg-[var(--admin-dark-primary)] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {r.label}
                            </Link>
                        ))}
                        <Link
                            href={`/admin/users/export${filterRole ? `?role=${filterRole}` : ''}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Link>
                    </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Phone / Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Addresses</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{user.name ?? '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {user.phone ? `+91 ${user.phone}` : '—'} {user.email && ` / ${user.email}`}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{user.addresses_count}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={user.is_active ? 'text-green-600' : 'text-gray-400'}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                {user.is_active ? (
                                                    <Link
                                                        href={`/admin/users/${user.id}/block`}
                                                        method="post"
                                                        as="button"
                                                        className="rounded p-2 text-red-600 hover:bg-red-50"
                                                        title="Block"
                                                    >
                                                        <Ban className="h-4 w-4" />
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/admin/users/${user.id}/unblock`}
                                                        method="post"
                                                        as="button"
                                                        className="rounded p-2 text-emerald-600 hover:bg-emerald-50"
                                                        title="Unblock"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Link>
                                                )}
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
