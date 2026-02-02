import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface OverrideData {
    id: number;
    reason: string;
    expires_at: string | null;
    is_active: boolean;
    user?: { id: number; name: string | null; phone: string | null } | null;
    address?: { id: number; address_line_1: string; city: string; pincode: string } | null;
    overridden_by?: { id: number; name: string } | null;
}

interface ZoneData {
    id: number;
    name: string;
    code: string;
    city: string;
    state: string;
    description: string | null;
    is_active: boolean;
    drivers_count: number;
    addresses_count: number;
    overrides?: OverrideData[];
}

interface AdminZonesShowProps {
    zone: ZoneData;
}

function formatDate(s: string | null | undefined): string {
    if (!s) return '—';
    return new Date(s).toLocaleString();
}

export default function AdminZonesShow({ zone }: AdminZonesShowProps) {
    return (
        <AdminLayout title={`Zone: ${zone.name}`}>
            <Head title={`${zone.name} - Zones - Admin`} />
            <div className="space-y-4">
                <Link
                    href="/admin/zones"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to zones
                </Link>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{zone.name}</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {zone.code} · {zone.city}, {zone.state}
                            </p>
                            {zone.description && <p className="mt-2 text-sm text-gray-600">{zone.description}</p>}
                            <p className="mt-2 text-sm">
                                Status: <span className={zone.is_active ? 'text-green-600' : 'text-gray-500'}>{zone.is_active ? 'Active' : 'Inactive'}</span>
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                {zone.drivers_count} driver(s), {zone.addresses_count} address(es)
                            </p>
                        </div>
                        <Link
                            href={`/admin/zones/${zone.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Zone overrides</h3>
                        <Link
                            href={`/admin/zones/${zone.id}/overrides/create`}
                            className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                        >
                            <Plus className="h-4 w-4" />
                            Add override
                        </Link>
                    </div>
                    {(!zone.overrides || zone.overrides.length === 0) ? (
                        <p className="mt-4 text-sm text-gray-500">No overrides. Add one to assign this zone to a specific user or address.</p>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">User / Address</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Reason</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Expires</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {zone.overrides.map((o) => (
                                        <tr key={o.id}>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                                {o.address
                                                    ? `${o.address.address_line_1}, ${o.address.city}`
                                                    : o.user
                                                        ? (o.user.name ?? o.user.phone ?? '—')
                                                        : '—'}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-600" title={o.reason}>
                                                {o.reason}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                {formatDate(o.expires_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span className={o.is_active ? 'text-green-600' : 'text-gray-400'}>
                                                    {o.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                <Link
                                                    href={`/admin/zone-overrides/${o.id}/edit`}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Remove this override?')) {
                                                            router.delete(`/admin/zone-overrides/${o.id}`);
                                                        }
                                                    }}
                                                    className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
