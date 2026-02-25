import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ZoneMapPicker from '@/components/admin/ZoneMapPicker';
import AdminLayout from '@/layouts/AdminLayout';

const DAY_LABELS: Record<number, string> = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
const VERTICAL_DEFAULT = ['daily_fresh', 'society_fresh'];

interface ZoneData {
    id: number; name: string; code: string; city: string; state: string;
    description: string | null; is_active: boolean;
    verticals?: string[] | null; pincodes?: string[] | null;
    boundary_coordinates?: [number, number][] | null;
    service_days?: number[] | null;
    service_time_start?: string | null; service_time_end?: string | null;
    delivery_charge?: string | number | null; min_order_amount?: string | number | null;
}

interface AdminZonesEditProps { zone: ZoneData; verticalOptions: Record<string, string>; }

function formatTime(d: string | null | undefined): string { if (!d) return ''; const m = String(d).match(/(\d{2}):(\d{2})/); return m ? `${m[1]}:${m[2]}` : ''; }

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-3">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
            </div>
            <div className="p-5 space-y-5">{children}</div>
        </div>
    );
}

const inputCls = 'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-1 focus:ring-[var(--admin-dark-primary)]';
const labelCls = 'block text-sm font-medium text-gray-700';

export default function AdminZonesEdit({ zone, verticalOptions }: AdminZonesEditProps) {
    const form = useForm({
        name: zone.name, code: zone.code, description: zone.description ?? '',
        city: zone.city, state: zone.state, is_active: zone.is_active,
        verticals: (zone.verticals && zone.verticals.length > 0 ? zone.verticals : VERTICAL_DEFAULT) as string[],
        pincodes: Array.isArray(zone.pincodes) ? zone.pincodes.join(', ') : '',
        boundary_coordinates: Array.isArray(zone.boundary_coordinates) ? JSON.stringify(zone.boundary_coordinates, null, 2) : '',
        service_time_start: formatTime(zone.service_time_start),
        service_time_end: formatTime(zone.service_time_end),
        service_days: (zone.service_days ?? []) as number[],
        delivery_charge: zone.delivery_charge != null ? String(zone.delivery_charge) : '',
        min_order_amount: zone.min_order_amount != null ? String(zone.min_order_amount) : '',
    });

    const toggleVertical = (value: string) => { const next = form.data.verticals.includes(value) ? form.data.verticals.filter((v) => v !== value) : [...form.data.verticals, value]; form.setData('verticals', next); };
    const toggleDay = (day: number) => { const next = form.data.service_days.includes(day) ? form.data.service_days.filter((d) => d !== day) : [...form.data.service_days, day].sort((a, b) => a - b); form.setData('service_days', next); };

    return (
        <AdminLayout title={`Edit: ${zone.name}`}>
            <Head title={`Edit ${zone.name} - Admin`} />
            <form onSubmit={(e) => { e.preventDefault(); form.put(`/admin/zones/${zone.id}`); }} className="space-y-6">
                <Link href="/admin/zones" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Back to zones
                </Link>

                <Section title="Basic details" description="Update the name and city/state for this zone.">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div><label className={labelCls}>Name *</label><input type="text" required className={inputCls} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />{form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}</div>
                        <div><label className={labelCls}>Code *</label><input type="text" required className={inputCls} value={form.data.code} onChange={(e) => form.setData('code', e.target.value)} />{form.errors.code && <p className="mt-1 text-sm text-red-600">{form.errors.code}</p>}</div>
                    </div>
                    <div><label className={labelCls}>Description</label><textarea rows={2} className={inputCls} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} /></div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div><label className={labelCls}>City *</label><input type="text" required className={inputCls} value={form.data.city} onChange={(e) => form.setData('city', e.target.value)} />{form.errors.city && <p className="mt-1 text-sm text-red-600">{form.errors.city}</p>}</div>
                        <div><label className={labelCls}>State *</label><input type="text" required className={inputCls} value={form.data.state} onChange={(e) => form.setData('state', e.target.value)} />{form.errors.state && <p className="mt-1 text-sm text-red-600">{form.errors.state}</p>}</div>
                    </div>
                </Section>

                <Section title="Delivery coverage" description="Verticals and pincodes define coverage for this zone.">
                    <div>
                        <label className={labelCls}>Business verticals</label>
                        <div className="mt-2 flex flex-wrap gap-4">
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <label key={value} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.verticals.includes(value)} onChange={() => toggleVertical(value)} /><span className="text-sm text-gray-700">{label}</span></label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Pincodes</label>
                        <p className="mt-0.5 text-xs text-gray-500">Separated by commas or one per line.</p>
                        <textarea rows={3} className={inputCls + ' font-mono'} value={form.data.pincodes} onChange={(e) => form.setData('pincodes', e.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} /><span className="text-sm text-gray-700">Active</span></label>
                </Section>

                <Section title="Service schedule" description="Control which days and times you deliver in this zone.">
                    <div>
                        <label className={labelCls}>Service days</label>
                        <p className="mt-0.5 text-xs text-gray-500">Leave all unchecked if you deliver every day.</p>
                        <div className="mt-2 flex flex-wrap gap-3">
                            {(Object.entries(DAY_LABELS) as [string, string][]).map(([d, label]) => (
                                <label key={d} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.service_days.includes(Number(d))} onChange={() => toggleDay(Number(d))} /><span className="text-sm text-gray-700">{label}</span></label>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div><label className={labelCls}>Service time start</label><input type="time" className={inputCls} value={form.data.service_time_start} onChange={(e) => form.setData('service_time_start', e.target.value)} /></div>
                        <div><label className={labelCls}>Service time end</label><input type="time" className={inputCls} value={form.data.service_time_end} onChange={(e) => form.setData('service_time_end', e.target.value)} />{form.errors.service_time_end && <p className="mt-1 text-sm text-red-600">{form.errors.service_time_end}</p>}</div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div><label className={labelCls}>Delivery charge</label><input type="number" step="0.01" min="0" className={inputCls} value={form.data.delivery_charge} onChange={(e) => form.setData('delivery_charge', e.target.value)} /></div>
                        <div><label className={labelCls}>Min order amount</label><input type="number" step="0.01" min="0" className={inputCls} value={form.data.min_order_amount} onChange={(e) => form.setData('min_order_amount', e.target.value)} /></div>
                    </div>
                </Section>

                <Section title="Boundary area" description="Leave blank if not using drawn map areas. Paste JSON array of [lat, lng] points.">
                    <textarea rows={4} className={inputCls + ' font-mono'} value={form.data.boundary_coordinates} onChange={(e) => form.setData('boundary_coordinates', e.target.value)} />
                    {form.errors.boundary_coordinates && <p className="mt-1 text-sm text-red-600">{form.errors.boundary_coordinates}</p>}
                    <ZoneMapPicker
                        value={form.data.boundary_coordinates}
                        onChange={(v) => form.setData('boundary_coordinates', v)}
                        onAddressSelected={(data) => {
                            if (data.city && !form.data.city) form.setData('city', data.city);
                            if (data.state && !form.data.state) form.setData('state', data.state);
                            if (data.postcode) { const c = form.data.pincodes.trim(); if (!c) form.setData('pincodes', data.postcode); else if (!c.split(/[\s,]+/).includes(data.postcode)) form.setData('pincodes', `${c}, ${data.postcode}`); }
                            if (data.locality && !form.data.name) form.setData('name', data.locality);
                        }}
                    />
                </Section>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={form.processing} className="rounded-lg bg-[var(--admin-dark-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70">
                        {form.processing ? 'Saving…' : 'Save changes'}
                    </button>
                    <Link href={`/admin/zones/${zone.id}`} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
