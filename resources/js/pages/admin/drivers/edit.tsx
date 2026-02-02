import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ZoneOption {
    id: number;
    name: string;
    code: string;
}

interface DriverData {
    id: number;
    employee_id: string;
    phone: string;
    zone_id: number | null;
    is_active: boolean;
    zone?: { id: number; name: string; code: string } | null;
}

interface AdminDriversEditProps {
    driver: DriverData;
    zones: ZoneOption[];
}

export default function AdminDriversEdit({ driver, zones }: AdminDriversEditProps) {
    const form = useForm({
        employee_id: driver.employee_id,
        zone_id: driver.zone_id ?? ('' as number | ''),
        phone: driver.phone,
        is_active: driver.is_active,
    });

    return (
        <AdminLayout title={`Edit driver: ${driver.employee_id}`}>
            <Head title={`Edit driver - Admin`} />
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
                        form.put(`/admin/drivers/${driver.id}`);
                    }}
                    className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
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
                            {form.processing ? 'Saving…' : 'Save'}
                        </button>
                        <Link href={`/admin/drivers/${driver.id}`} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
