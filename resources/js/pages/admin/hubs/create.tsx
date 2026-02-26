import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, MapPin } from 'lucide-react';
import LocationMapPicker from '@/components/admin/LocationMapPicker';
import AdminLayout from '@/layouts/AdminLayout';

interface AdminHubsCreateProps {
    verticalOptions: Record<string, string>;
}

const VERTICAL_DEFAULT = ['daily_fresh', 'society_fresh'];

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

const inputCls =
    'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-1 focus:ring-[var(--admin-dark-primary)]';
const labelCls = 'block text-sm font-medium text-gray-700';

export default function AdminHubsCreate({ verticalOptions }: AdminHubsCreateProps) {
    const form = useForm({
        name: '',
        description: '',
        is_active: true,
        verticals: VERTICAL_DEFAULT as string[],
        latitude: '' as string | number,
        longitude: '' as string | number,
    });



    const toggleVertical = (value: string) => {
        const next = form.data.verticals.includes(value)
            ? form.data.verticals.filter((v) => v !== value)
            : [...form.data.verticals, value];
        form.setData('verticals', next);
    };

    return (
        <AdminLayout title="Add hub">
            <Head title="Add hub - Admin" />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post('/admin/hubs');
                }}
                className="space-y-6"
            >
                <Link
                    href="/admin/hubs"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to hubs
                </Link>

                <Section title="Hub details" description="Name and description for your new logistics hub.">
                    <div>
                        <label className={labelCls}>Name *</label>
                        <input
                            type="text"
                            required
                            className={inputCls}
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="e.g. FRESHTICK Hub"
                        />
                        {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                    </div>

                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea
                            rows={3}
                            className={inputCls}
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            placeholder="Default Hub for operations"
                        />
                        {form.errors.description && <p className="mt-1 text-sm text-red-600">{form.errors.description}</p>}
                    </div>

                    <div>
                        <label className={labelCls}>Business verticals</label>
                        <p className="mt-0.5 text-xs text-gray-500">Which verticals this hub serves</p>
                        <div className="mt-2 flex flex-wrap gap-4">
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <label key={value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                                        checked={form.data.verticals.includes(value)}
                                        onChange={() => toggleVertical(value)}
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer mt-4 border border-gray-200 p-3 rounded-lg w-max">
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Is Active?</span>
                    </label>
                </Section>

                <Section title="Location" description="Set the location for this hub by picking a point on the map.">
                    <div className="grid gap-5 sm:grid-cols-2 mb-4">
                        <div>
                            <label className={labelCls}>Latitude</label>
                            <input
                                type="number"
                                step="any"
                                className={inputCls}
                                value={form.data.latitude}
                                onChange={(e) => {
                                    form.setData('latitude', e.target.value);
                                }}
                            />
                            {form.errors.latitude && <p className="mt-1 text-sm text-red-600">{form.errors.latitude}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Longitude</label>
                            <input
                                type="number"
                                step="any"
                                className={inputCls}
                                value={form.data.longitude}
                                onChange={(e) => {
                                    form.setData('longitude', e.target.value);
                                }}
                            />
                            {form.errors.longitude && <p className="mt-1 text-sm text-red-600">{form.errors.longitude}</p>}
                        </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 flex items-center gap-2 mb-2 bg-blue-50 text-blue-800 p-2 rounded w-max">
                        <MapPin className="h-4 w-4" /> Tap on the map to drop a pin and set coordinates
                    </div>
                    <LocationMapPicker 
                        latitude={form.data.latitude}
                        longitude={form.data.longitude}
                        onLocationSelect={(lat, lng, label) => {
                            form.setData((data) => ({
                                ...data,
                                latitude: lat,
                                longitude: lng
                            }));
                        }}
                        mapHeight="h-96"
                    />
                </Section>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="rounded-lg bg-[var(--admin-dark-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                    >
                        {form.processing ? 'Saving…' : 'Save Hub'}
                    </button>
                    <Link
                        href="/admin/hubs"
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
