import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MapPin } from 'lucide-react';
import LocationMapPicker from '@/components/admin/LocationMapPicker';
import AdminLayout from '@/layouts/AdminLayout';

interface HubData {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    verticals: string[];
    latitude: number | null;
    longitude: number | null;
}

interface AdminHubsEditProps {
    hub: HubData;
    verticalOptions: Record<string, string>;
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-3">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
            </div>
            <div className="space-y-5 p-5">{children}</div>
        </div>
    );
}

const inputCls =
    'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-(--admin-dark-primary) focus:ring-1 focus:ring-(--admin-dark-primary)';
const labelCls = 'block text-sm font-medium text-gray-700';

export default function AdminHubsEdit({ hub, verticalOptions }: AdminHubsEditProps) {
    const form = useForm({
        name: hub.name,
        description: hub.description || '',
        is_active: hub.is_active,
        verticals: hub.verticals || [],
        latitude: hub.latitude ?? '',
        longitude: hub.longitude ?? '',
    });

    const toggleVertical = (value: string) => {
        const next = form.data.verticals.includes(value) ? form.data.verticals.filter((v) => v !== value) : [...form.data.verticals, value];
        form.setData('verticals', next);
    };

    return (
        <AdminLayout title={`Edit Hub: ${hub.name}`}>
            <Head title={`Edit Hub: ${hub.name} - Admin`} />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.put(`/admin/hubs/${hub.id}`);
                }}
                className="space-y-6"
            >
                <Link href="/admin/hubs" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-(--admin-dark-primary)">
                    <ArrowLeft className="h-4 w-4" /> Back to hubs
                </Link>

                <Section title="Hub details" description="Update name and description.">
                    <div>
                        <label className={labelCls}>Name *</label>
                        <input
                            type="text"
                            required
                            className={inputCls}
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
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
                        />
                        {form.errors.description && <p className="mt-1 text-sm text-red-600">{form.errors.description}</p>}
                    </div>

                    <div>
                        <label className={labelCls}>Business verticals</label>
                        <p className="mt-0.5 text-xs text-gray-500">Which verticals this hub serves</p>
                        <div className="mt-2 flex flex-wrap gap-4">
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <label key={value} className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-(--admin-dark-primary) focus:ring-(--admin-dark-primary)"
                                        checked={form.data.verticals.includes(value)}
                                        onChange={() => toggleVertical(value)}
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <label className="mt-4 flex w-max cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3">
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-(--admin-dark-primary) focus:ring-(--admin-dark-primary)"
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Is Active?</span>
                    </label>
                </Section>

                <Section title="Location" description="Set the location for this hub by picking a point on the map.">
                    <div className="mb-4 grid gap-5 sm:grid-cols-2">
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

                    <div className="mb-2 flex w-max items-center gap-2 rounded bg-blue-50 p-2 text-sm text-blue-800">
                        <MapPin className="h-4 w-4" /> Tap on the map to drop a pin and set coordinates
                    </div>
                    <LocationMapPicker
                        latitude={form.data.latitude}
                        longitude={form.data.longitude}
                        onLocationSelect={(lat, lng, label) => {
                            form.setData((data) => ({
                                ...data,
                                latitude: lat,
                                longitude: lng,
                            }));
                        }}
                        onLocationClear={() => {
                            form.setData((data) => ({
                                ...data,
                                latitude: '',
                                longitude: '',
                            }));
                        }}
                        mapHeight="h-96"
                    />
                </Section>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="rounded-lg bg-(--admin-dark-primary) px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                    >
                        {form.processing ? 'Saving…' : 'Update Hub'}
                    </button>
                    <Link
                        href="/admin/hubs"
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
