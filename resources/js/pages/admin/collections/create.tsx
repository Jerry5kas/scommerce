import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface CategoryOption {
    id: number;
    name: string;
    slug: string;
}

interface AdminCollectionsCreateProps {
    verticalOptions: Record<string, string>;
    categories: CategoryOption[];
}

export default function AdminCollectionsCreate({ verticalOptions, categories }: AdminCollectionsCreateProps) {
    const form = useForm({
        name: '',
        slug: '',
        description: '',
        category_id: null as number | null,
        banner_image: '',
        banner_mobile_image: '',
        display_order: 0,
        is_active: true,
        vertical: 'both',
        starts_at: '',
        ends_at: '',
        link_url: '',
        meta_title: '',
        meta_description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/collections');
    };

    return (
        <AdminLayout title="Add collection">
            <Head title="Add collection - Admin" />
            <div className="space-y-4">
                <Link href="/admin/collections" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" />
                    Back to collections
                </Link>
                <form onSubmit={submit} className="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name *</label>
                        <input type="text" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug</label>
                        <input type="text" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                        {form.errors.slug && <p className="mt-1 text-sm text-red-600">{form.errors.slug}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea rows={3} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.category_id ?? ''} onChange={(e) => form.setData('category_id', e.target.value ? Number(e.target.value) : null)}>
                            <option value="">None</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Banner image URL *</label>
                        <input type="text" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.banner_image} onChange={(e) => form.setData('banner_image', e.target.value)} />
                        {form.errors.banner_image && <p className="mt-1 text-sm text-red-600">{form.errors.banner_image}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Banner mobile image URL</label>
                        <input type="text" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.banner_mobile_image} onChange={(e) => form.setData('banner_mobile_image', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vertical</label>
                        <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.vertical} onChange={(e) => form.setData('vertical', e.target.value)}>
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Starts at</label>
                            <input type="datetime-local" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.starts_at} onChange={(e) => form.setData('starts_at', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ends at</label>
                            <input type="datetime-local" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.ends_at} onChange={(e) => form.setData('ends_at', e.target.value)} />
                            {form.errors.ends_at && <p className="mt-1 text-sm text-red-600">{form.errors.ends_at}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Link URL</label>
                        <input type="text" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.link_url} onChange={(e) => form.setData('link_url', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Display order</label>
                        <input type="number" min={0} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.display_order} onChange={(e) => form.setData('display_order', Number(e.target.value) || 0)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" className="h-4 w-4 rounded border-gray-300" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                        <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                    </div>
                    <div className="flex gap-2 border-t border-gray-200 pt-4">
                        <button type="submit" disabled={form.processing} className="rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70">
                            {form.processing ? 'Saving…' : 'Save'}
                        </button>
                        <Link href="/admin/collections" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
