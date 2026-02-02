import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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

interface ZoneData {
    id: number;
    name: string;
    code: string;
    city: string;
    state: string;
    description: string | null;
    is_active: boolean;
    verticals?: string[] | null;
    pincodes?: string[] | null;
    boundary_coordinates?: [number, number][] | null;
    service_days?: number[] | null;
    service_time_start?: string | null;
    service_time_end?: string | null;
    delivery_charge?: string | number | null;
    min_order_amount?: string | number | null;
}

interface AdminZonesEditProps {
    zone: ZoneData;
    verticalOptions: Record<string, string>;
}

function formatTime(d: string | null | undefined): string {
    if (!d) return '';
    const match = String(d).match(/(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : '';
}

export default function AdminZonesEdit({ zone, verticalOptions }: AdminZonesEditProps) {
    const form = useForm({
        name: zone.name,
        code: zone.code,
        description: zone.description ?? '',
        city: zone.city,
        state: zone.state,
        is_active: zone.is_active,
        verticals: (zone.verticals && zone.verticals.length > 0 ? zone.verticals : VERTICAL_DEFAULT) as string[],
        pincodes: Array.isArray(zone.pincodes) ? zone.pincodes.join(', ') : '',
        boundary_coordinates: Array.isArray(zone.boundary_coordinates)
            ? JSON.stringify(zone.boundary_coordinates, null, 2)
            : '',
        service_time_start: formatTime(zone.service_time_start),
        service_time_end: formatTime(zone.service_time_end),
        service_days: (zone.service_days ?? []) as number[],
        delivery_charge: zone.delivery_charge != null ? String(zone.delivery_charge) : '',
        min_order_amount: zone.min_order_amount != null ? String(zone.min_order_amount) : '',
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
        <AdminLayout title={`Edit: ${zone.name}`}>
            <Head title={`Edit ${zone.name} - Admin`} />
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
                        form.put(`/admin/zones/${zone.id}`);
                    }}
                    className="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
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
                        <label className="block text-sm font-medium text-gray-700">Business verticals</label>
                        <p className="mt-0.5 text-xs text-gray-500">Which vertical(s) this zone serves</p>
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
                        <p className="mt-0.5 text-xs text-gray-500">Comma or newline separated</p>
                        <textarea
                            rows={3}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm"
                            value={form.data.pincodes}
                            onChange={(e) => form.setData('pincodes', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Boundary coordinates (JSON)</label>
                        <p className="mt-0.5 text-xs text-gray-500">Array of [lat, lng]</p>
                        <textarea
                            rows={4}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm"
                            value={form.data.boundary_coordinates}
                            onChange={(e) => form.setData('boundary_coordinates', e.target.value)}
                        />
                        {form.errors.boundary_coordinates && <p className="mt-1 text-sm text-red-600">{form.errors.boundary_coordinates}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Service days</label>
                        <p className="mt-0.5 text-xs text-gray-500">Leave all unchecked for all days</p>
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
                            {form.processing ? 'Saving…' : 'Save'}
                        </button>
                        <Link href={`/admin/zones/${zone.id}`} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
