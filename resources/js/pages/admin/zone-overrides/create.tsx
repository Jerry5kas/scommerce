import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ZoneData {
    id: number;
    name: string;
    code: string;
}

interface UserOption {
    id: number;
    name: string | null;
    phone: string | null;
    email: string | null;
    role: string;
}

interface AddressOption {
    id: number;
    user_id: number;
    address_line_1: string;
    city: string;
    pincode: string;
    user?: { id: number; name: string | null; phone: string | null };
}

interface AdminZoneOverridesCreateProps {
    zone: ZoneData;
    users: UserOption[];
    addresses: AddressOption[];
}

export default function AdminZoneOverridesCreate({ zone, users, addresses }: AdminZoneOverridesCreateProps) {
    const form = useForm({
        user_id: '' as string | number,
        address_id: '' as string | number,
        reason: '',
        expires_at: '',
        is_active: true,
    });

    const submit = () => {
        const data = {
            ...form.data,
            user_id: form.data.user_id === '' ? null : Number(form.data.user_id),
            address_id: form.data.address_id === '' ? null : Number(form.data.address_id),
        };
        form.transform(() => data);
        form.post(`/admin/zones/${zone.id}/overrides`);
    };

    return (
        <AdminLayout title={'Add override: ' + zone.name}>
            <Head title={'Add override - ' + zone.name + ' - Admin'} />
            <div className="space-y-4">
                <Link
                    href={'/admin/zones/' + zone.id}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to zone
                </Link>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Add zone override</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Assign zone <strong>{zone.name}</strong> ({zone.code}) for a specific user or address.
                    </p>
                    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-6 max-w-xl space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">User (optional)</label>
                            <select
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                value={form.data.user_id}
                                onChange={(e) => form.setData('user_id', e.target.value)}
                            >
                                <option value="">— None (use address only) —</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name ?? u.phone ?? u.email ?? '#' + u.id} ({u.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address (optional)</label>
                            <select
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                value={form.data.address_id}
                                onChange={(e) => form.setData('address_id', e.target.value)}
                            >
                                <option value="">— None (user-level override) —</option>
                                {addresses.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.address_line_1}, {a.city} – {a.pincode}
                                        {a.user ? ' (' + (a.user.name ?? a.user.phone) + ')' : ''}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">Provide at least user or address.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reason *</label>
                            <textarea
                                required
                                rows={3}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                value={form.data.reason}
                                onChange={(e) => form.setData('reason', e.target.value)}
                                placeholder="e.g. Special delivery agreement"
                            />
                            {form.errors.reason && <p className="mt-1 text-sm text-red-600">{form.errors.reason}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expires at (optional)</label>
                            <input
                                type="datetime-local"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                value={form.data.expires_at}
                                onChange={(e) => form.setData('expires_at', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                        </div>
                        <div className="flex gap-2 border-t border-gray-200 pt-4">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                            >
                                {form.processing ? 'Creating…' : 'Create override'}
                            </button>
                            <Link
                                href={'/admin/zones/' + zone.id}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
