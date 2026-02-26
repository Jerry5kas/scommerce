import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ZoneMapPicker from '@/components/admin/ZoneMapPicker';
import AdminLayout from '@/layouts/AdminLayout';

const DAY_LABELS: Record<number, string> = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
const VERTICAL_DEFAULT = ['daily_fresh', 'society_fresh'];

interface AdminZonesCreateProps { 
    verticalOptions: Record<string, string>;
    hubs: { id: number; name: string }[];
}

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

export default function AdminZonesCreate({ verticalOptions, hubs }: AdminZonesCreateProps) {
    const form = useForm({
        hub_id: hubs.length > 0 ? hubs[0].id : '',
        name: '', code: '', description: '', city: '', state: '',
        is_active: true, verticals: VERTICAL_DEFAULT as string[],
        delivery_charge: '', min_order_amount: '',
        pincodes: '' as string, boundary_coordinates: '' as string,
        service_time_start: '', service_time_end: '', service_days: [] as number[],
    });

    const toggleVertical = (value: string) => { const next = form.data.verticals.includes(value) ? form.data.verticals.filter((v) => v !== value) : [...form.data.verticals, value]; form.setData('verticals', next); };
    const toggleDay = (day: number) => { const next = form.data.service_days.includes(day) ? form.data.service_days.filter((d) => d !== day) : [...form.data.service_days, day].sort((a, b) => a - b); form.setData('service_days', next); };

    return (
        <AdminLayout title="Add zone">
            <Head title="Add zone - Admin" />
            <form onSubmit={(e) => { e.preventDefault(); form.post('/admin/zones'); }} className="space-y-6">
                <Link href="/admin/zones" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Back to zones
                </Link>

                {/* ── Basic details ─────────────────────────── */}
                <Section title="Basic details" description="Give this zone a name and location.">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Name *</label>
                            <input type="text" required className={inputCls} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Code *</label>
                            <input type="text" required className={inputCls} value={form.data.code} onChange={(e) => form.setData('code', e.target.value)} />
                            {form.errors.code && <p className="mt-1 text-sm text-red-600">{form.errors.code}</p>}
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Select Hub *</label>
                        <select required className={inputCls} value={form.data.hub_id} onChange={(e) => form.setData('hub_id', Number(e.target.value))}>
                            <option value="" disabled>Select a hub</option>
                            {hubs.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>
                        {form.errors.hub_id && <p className="mt-1 text-sm text-red-600">{form.errors.hub_id}</p>}
                    </div>
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea rows={2} className={inputCls} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>City *</label>
                            <input type="text" required className={inputCls} value={form.data.city} onChange={(e) => form.setData('city', e.target.value)} />
                            {form.errors.city && <p className="mt-1 text-sm text-red-600">{form.errors.city}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>State *</label>
                            <input type="text" required className={inputCls} value={form.data.state} onChange={(e) => form.setData('state', e.target.value)} />
                            {form.errors.state && <p className="mt-1 text-sm text-red-600">{form.errors.state}</p>}
                        </div>
                    </div>
                </Section>

                {/* ── Delivery coverage ─────────────────────── */}
                <Section title="Delivery coverage" description="Choose verticals, add pincodes — pincodes are enough for most setups.">
                    <div>
                        <label className={labelCls}>Business verticals</label>
                        <p className="mt-0.5 text-xs text-gray-500">Which verticals this zone serves</p>
                        <div className="mt-2 flex flex-wrap gap-4">
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <label key={value} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.verticals.includes(value)} onChange={() => toggleVertical(value)} />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Pincodes</label>
                        <p className="mt-0.5 text-xs text-gray-500">One per line or separated by commas (e.g. 682001, 682002).</p>
                        <textarea rows={3} className={inputCls + ' font-mono'} placeholder="682001, 682002, 682003" value={form.data.pincodes} onChange={(e) => form.setData('pincodes', e.target.value)} />
                        {form.errors.pincodes && <p className="mt-1 text-sm text-red-600">{form.errors.pincodes}</p>}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                        <span className="text-sm text-gray-700">Active</span>
                    </label>
                </Section>

                {/* ── Service schedule ──────────────────────── */}
                <Section title="Service schedule" description="Choose which days and times you deliver in this zone.">
                    <div>
                        <label className={labelCls}>Service days</label>
                        <p className="mt-0.5 text-xs text-gray-500">Leave all unchecked if you deliver every day.</p>
                        <div className="mt-2 flex flex-wrap gap-3">
                            {(Object.entries(DAY_LABELS) as [string, string][]).map(([d, label]) => (
                                <label key={d} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.service_days.includes(Number(d))} onChange={() => toggleDay(Number(d))} />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
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

                {/* ── Boundary area (advanced) ─────────────── */}
                <Section title="Boundary area" description="Optional — leave empty if just using pincodes. For precise areas, draw on the map or paste JSON.">
                    <textarea rows={4} className={inputCls + ' font-mono'} placeholder='[[10.0, 76.2], [10.1, 76.2], [10.1, 76.3]]' value={form.data.boundary_coordinates} onChange={(e) => form.setData('boundary_coordinates', e.target.value)} />
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
                    {form.errors.boundary_coordinates && <p className="mt-1 text-sm text-red-600">{form.errors.boundary_coordinates}</p>}
                </Section>

                {/* ── Actions ──────────────────────────────── */}
                <div className="flex items-center gap-3">
                    <button type="submit" disabled={form.processing} className="rounded-lg bg-[var(--admin-dark-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70">
                        {form.processing ? 'Creating…' : 'Create zone'}
                    </button>
                    <Link href="/admin/zones" className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
