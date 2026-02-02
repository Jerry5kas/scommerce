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

export default function AdminZonesCreate() {
    const form = useForm({
        name: '',
        code: '',
        description: '',
        city: '',
        state: '',
        is_active: true,
        delivery_charge: '',
        min_order_amount: '',
        pincodes: '' as string,
        boundary_coordinates: '' as string,
        service_time_start: '',
        service_time_end: '',
        service_days: [] as number[],
    });

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
                        <label className="block text-sm font-medium text-gray-700">Pincodes</label>
                        <p className="mt-0.5 text-xs text-gray-500">Comma or newline separated (e.g. 682001, 682002)</p>
                        <textarea
                            rows={3}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm"
                            placeholder="682001, 682002, 682003"
                            value={form.data.pincodes}
                            onChange={(e) => form.setData('pincodes', e.target.value)}
                        />
                        {form.errors.pincodes && <p className="mt-1 text-sm text-red-600">{form.errors.pincodes}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Boundary coordinates (JSON)</label>
                        <p className="mt-0.5 text-xs text-gray-500">Array of [lat, lng] e.g. [[10.0, 76.2], [10.1, 76.3]]</p>
                        <textarea
                            rows={4}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm"
                            placeholder='[[10.0, 76.2], [10.1, 76.2], [10.1, 76.3]]'
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
