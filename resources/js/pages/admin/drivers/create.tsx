import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface UserOption {
    id: number;
    name: string | null;
    phone: string | null;
}

interface ZoneOption {
    id: number;
    name: string;
    code: string;
}

interface AdminDriversCreateProps {
    users: UserOption[];
    zones: ZoneOption[];
}

export default function AdminDriversCreate({ users, zones }: AdminDriversCreateProps) {
    const form = useForm({
        user_id: '' as number | '',
        employee_id: '',
        zone_id: '' as number | '',
        phone: '',
        is_active: true,
    });

    return (
        <AdminLayout title="Add driver">
            <Head title="Add driver - Admin" />
            <div className="space-y-4">
                <Link
                    href="/admin/drivers"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to drivers
                </Link>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/admin/drivers');
                    }}
                    className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User (driver role) *</label>
                        <select
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                            value={form.data.user_id}
                            onChange={(e) => {
                                const id = e.target.value ? Number(e.target.value) : '';
                                const u = users.find((x) => x.id === id);
                                form.setData({
                                    ...form.data,
                                    user_id: id,
                                    phone: u?.phone ?? form.data.phone,
                                });
                            }}
                        >
                            <option value="">Select user</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name ?? u.phone} ({u.phone})
                                </option>
                            ))}
                        </select>
                        {users.length === 0 && <p className="mt-1 text-sm text-amber-600">No users with driver role available. Create a user with role=driver first.</p>}
                        {form.errors.user_id && <p className="mt-1 text-sm text-red-600">{form.errors.user_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee ID *</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                            value={form.data.employee_id}
                            onChange={(e) => form.setData('employee_id', e.target.value)}
                        />
                        {form.errors.employee_id && <p className="mt-1 text-sm text-red-600">{form.errors.employee_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone *</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                        />
                        {form.errors.phone && <p className="mt-1 text-sm text-red-600">{form.errors.phone}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Zone</label>
                        <select
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                            value={form.data.zone_id}
                            onChange={(e) => form.setData('zone_id', e.target.value ? Number(e.target.value) : '')}
                        >
                            <option value="">—</option>
                            {zones.map((z) => (
                                <option key={z.id} value={z.id}>
                                    {z.name} ({z.code})
                                </option>
                            ))}
                        </select>
                        {form.errors.zone_id && <p className="mt-1 text-sm text-red-600">{form.errors.zone_id}</p>}
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
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                        >
                            {form.processing ? 'Creating…' : 'Create driver'}
                        </button>
                        <Link href="/admin/drivers" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
