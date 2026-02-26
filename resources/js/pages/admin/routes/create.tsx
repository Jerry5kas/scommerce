import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface HubData {
    id: number;
    name: string;
}

interface AdminRoutesCreateProps {
    hubs: HubData[];
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

const inputCls = 'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]';
const labelCls = 'block text-sm font-medium text-gray-700';

export default function AdminRoutesCreate({ hubs }: AdminRoutesCreateProps) {
    const form = useForm({
        hub_id: hubs.length > 0 ? hubs[0].id : '',
        name: '',
        description: '',
        is_active: true,
    });

    return (
        <AdminLayout title="Create Route">
            <Head title="Create Route - Admin" />
            <form onSubmit={(e) => { e.preventDefault(); form.post('/admin/routes'); }} className="space-y-6">
                <Link href="/admin/routes" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Back to routes
                </Link>

                <Section title="Route details" description="Create a new delivery route assigned to a hub.">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Select Hub *</label>
                            <select
                                required
                                className={inputCls}
                                value={form.data.hub_id}
                                onChange={(e) => form.setData('hub_id', e.target.value)}
                            >
                                <option value="" disabled>Select a hub</option>
                                {hubs.map(h => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))}
                            </select>
                            {form.errors.hub_id && <p className="mt-1 text-sm text-red-600">{form.errors.hub_id}</p>}
                        </div>

                        <div>
                            <label className={labelCls}>Route Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Malippuram Area B"
                                className={inputCls}
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                            {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Route Description</label>
                        <textarea
                            rows={3}
                            placeholder="Default Route"
                            className={inputCls}
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                        />
                        {form.errors.description && <p className="mt-1 text-sm text-red-600">{form.errors.description}</p>}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer mt-4 border border-gray-200 p-3 rounded-lg w-max">
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Mark as default (Active)</span>
                    </label>
                </Section>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={form.processing} className="rounded-lg bg-[var(--admin-dark-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70">
                        {form.processing ? 'Creating…' : 'Create Route'}
                    </button>
                    <Link href="/admin/routes" className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
