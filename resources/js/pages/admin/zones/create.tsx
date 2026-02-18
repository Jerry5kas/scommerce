import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ZoneMapPicker from '@/components/admin/ZoneMapPicker';
import AdminLayout from '@/layouts/AdminLayout';

const DAY_LABELS: Record<number, string> = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
};

const VERTICAL_DEFAULT = ['daily_fresh', 'society_fresh'];

interface AdminZonesCreateProps {
    verticalOptions: Record<string, string>;
}

export default function AdminZonesCreate({ verticalOptions }: AdminZonesCreateProps) {
    const form = useForm({
        name: '',
        code: '',
        description: '',
        city: '',
        state: '',
        is_active: true,
        verticals: VERTICAL_DEFAULT as string[],
        delivery_charge: '',
        min_order_amount: '',
        pincodes: '' as string,
        boundary_coordinates: '' as string,
        service_time_start: '',
        service_time_end: '',
        service_days: [] as number[],
    });

    const toggleVertical = (value: string) => {
        const next = form.data.verticals.includes(value)
            ? form.data.verticals.filter((v) => v !== value)
            : [...form.data.verticals, value];
        form.setData('verticals', next);
    };

    const toggleDay = (day: number) => {
        const next = form.data.service_days.includes(day)
            ? form.data.service_days.filter((d) => d !== day)
            : [...form.data.service_days, day].sort((a, b) => a - b);
        form.setData('service_days', next);
    };

    return (
        <AdminLayout title="Add zone">
            <Head title="Add zone - Admin" />
            <div className="space-y-4">
                <Link
                    href="/admin/zones"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to zones
                </Link>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/admin/zones');
                    }}
                    className="mx-auto max-w-5xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Basic details</h2>
                                <p className="mt-1 text-sm text-gray-500">Give this zone a simple name and location.</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                    />
                                    {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code *</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value)}
                                    />
                                    {form.errors.code && <p className="mt-1 text-sm text-red-600">{form.errors.code}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    rows={2}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City *</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                        value={form.data.city}
                                        onChange={(e) => form.setData('city', e.target.value)}
                                    />
                                    {form.errors.city && <p className="mt-1 text-sm text-red-600">{form.errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State *</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                        value={form.data.state}
                                        onChange={(e) => form.setData('state', e.target.value)}
                                    />
                                    {form.errors.state && <p className="mt-1 text-sm text-red-600">{form.errors.state}</p>}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Where do you deliver?</h2>
                                <p className="mt-1 text-sm text-gray-500">Choose verticals and add pincodes. For most setups, pincodes are enough.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Business verticals</label>
                                <p className="mt-0.5 text-xs text-gray-500">Which verticals this zone serves</p>
                                <div className="mt-2 flex flex-wrap gap-4">
                                    {Object.entries(verticalOptions).map(([value, label]) => (
                                        <label key={value} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300"
                                                checked={form.data.verticals.includes(value)}
                                                onChange={() => toggleVertical(value)}
                                            />
                                            <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pincodes</label>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    Easiest option: enter pincodes, one per line or separated by commas (e.g. 682001, 682002).
                                </p>
                                <textarea
                                    rows={3}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm"
                                    placeholder="682001, 682002, 682003"
                                    value={form.data.pincodes}
                                    onChange={(e) => form.setData('pincodes', e.target.value)}
                                />
                                {form.errors.pincodes && <p className="mt-1 text-sm text-red-600">{form.errors.pincodes}</p>}
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
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Service schedule</h2>
                                <p className="mt-1 text-sm text-gray-500">Choose which days and times you deliver in this zone.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Service days</label>
                                <p className="mt-0.5 text-xs text-gray-500">Leave all unchecked if you deliver every day.</p>
                                <div className="mt-2 flex flex-wrap gap-3">
                                    {(Object.entries(DAY_LABELS) as [string, string][]).map(([d, label]) => (
                                        <label key={d} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300"
                                                checked={form.data.service_days.includes(Number(d))}
                                                onChange={() => toggleDay(Number(d))}
                                            />
                                            <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service time start</label>
                                    <input
                                        type="time"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                        value={form.data.service_time_start}
                                        onChange={(e) => form.setData('service_time_start', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service time end</label>
                                    <input
                                        type="time"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                        value={form.data.service_time_end}
                                        onChange={(e) => form.setData('service_time_end', e.target.value)}
                                    />
                                    {form.errors.service_time_end && <p className="mt-1 text-sm text-red-600">{form.errors.service_time_end}</p>}
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Delivery charge</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                        value={form.data.delivery_charge}
                                        onChange={(e) => form.setData('delivery_charge', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Min order amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                        value={form.data.min_order_amount}
                                        onChange={(e) => form.setData('min_order_amount', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4">
                                <label className="block text-sm font-medium text-gray-900">Advanced: boundary area (optional)</label>
                                <p className="mt-1 text-xs text-gray-500">
                                    Leave this empty if you are not sure. Pincode list above is enough for most cases. For very precise areas, draw
                                    on the map or paste a JSON array of [lat, lng] points (e.g. [[10.0, 76.2], [10.1, 76.3]]).
                                </p>
                                <textarea
                                    rows={4}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm"
                                    placeholder='[[10.0, 76.2], [10.1, 76.2], [10.1, 76.3]]'
                                    value={form.data.boundary_coordinates}
                                    onChange={(e) => form.setData('boundary_coordinates', e.target.value)}
                                />
                                <ZoneMapPicker
                                    value={form.data.boundary_coordinates}
                                    onChange={(v) => form.setData('boundary_coordinates', v)}
                                    onAddressSelected={(data) => {
                                        if (data.city && !form.data.city) {
                                            form.setData('city', data.city);
                                        }
                                        if (data.state && !form.data.state) {
                                            form.setData('state', data.state);
                                        }
                                        if (data.postcode) {
                                            const current = form.data.pincodes.trim();
                                            if (!current) {
                                                form.setData('pincodes', data.postcode);
                                            } else if (!current.split(/[\s,]+/).includes(data.postcode)) {
                                                form.setData('pincodes', `${current}, ${data.postcode}`);
                                            }
                                        }
                                        if (data.locality && !form.data.name) {
                                            form.setData('name', data.locality);
                                        }
                                    }}
                                />
                                {form.errors.boundary_coordinates && <p className="mt-1 text-sm text-red-600">{form.errors.boundary_coordinates}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                        >
                            {form.processing ? 'Creating…' : 'Create zone'}
                        </button>
                        <Link href="/admin/zones" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
