import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ZoneOption { id: number; name: string; code: string; }

interface DriverData {
    id: number; employee_id: string; phone: string;
    zone_id: number | null; is_active: boolean;
    zone?: { id: number; name: string; code: string } | null;
}

interface AdminDriversEditProps { driver: DriverData; zones: ZoneOption[]; }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-3"><h3 className="text-sm font-semibold text-gray-900">{title}</h3></div>
            <div className="p-5 space-y-5">{children}</div>
        </div>
    );
}

const inputCls = 'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-1 focus:ring-[var(--admin-dark-primary)]';
const labelCls = 'block text-sm font-medium text-gray-700';

export default function AdminDriversEdit({ driver, zones }: AdminDriversEditProps) {
    const form = useForm({
        employee_id: driver.employee_id,
        zone_id: driver.zone_id ?? ('' as number | ''),
        phone: driver.phone,
        is_active: driver.is_active,
    });

    return (
        <AdminLayout title={`Edit driver: ${driver.employee_id}`}>
            <Head title="Edit driver - Admin" />
            <form onSubmit={(e) => { e.preventDefault(); form.put(`/admin/drivers/${driver.id}`); }} className="space-y-6">
                <Link href="/admin/drivers" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Back to drivers
                </Link>

                <Section title="Driver details">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Employee ID *</label>
                            <input type="text" required className={inputCls} value={form.data.employee_id} onChange={(e) => form.setData('employee_id', e.target.value)} />
                            {form.errors.employee_id && <p className="mt-1 text-sm text-red-600">{form.errors.employee_id}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Phone *</label>
                            <input type="text" required className={inputCls} value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                            {form.errors.phone && <p className="mt-1 text-sm text-red-600">{form.errors.phone}</p>}
                        </div>
                    </div>
                </Section>

                <Section title="Assignment & status">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Zone</label>
                            <select className={inputCls} value={form.data.zone_id} onChange={(e) => form.setData('zone_id', e.target.value ? Number(e.target.value) : '')}>
                                <option value="">—</option>
                                {zones.map((z) => <option key={z.id} value={z.id}>{z.name} ({z.code})</option>)}
                            </select>
                            {form.errors.zone_id && <p className="mt-1 text-sm text-red-600">{form.errors.zone_id}</p>}
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                        <span className="text-sm text-gray-700">Active</span>
                    </label>
                </Section>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={form.processing} className="rounded-lg bg-[var(--admin-dark-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70">
                        {form.processing ? 'Saving…' : 'Save changes'}
                    </button>
                    <Link href={`/admin/drivers/${driver.id}`} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
