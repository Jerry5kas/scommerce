import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface CategoryOption {
    id: number;
    name: string;
    slug: string;
}

interface CollectionOption {
    id: number;
    name: string;
    slug: string;
}

interface AdminProductsCreateProps {
    verticalOptions: Record<string, string>;
    categories: CategoryOption[];
    collections: CollectionOption[];
}

export default function AdminProductsCreate({ verticalOptions, categories, collections }: AdminProductsCreateProps) {
    const form = useForm({
        name: '',
        slug: '',
        sku: '',
        description: '',
        short_description: '',
        category_id: '' as string | number,
        collection_id: null as number | null,
        image: '',
        price: '',
        compare_at_price: '',
        cost_price: '',
        stock_quantity: '',
        is_in_stock: true,
        is_subscription_eligible: false,
        requires_bottle: false,
        bottle_deposit: '',
        min_quantity: '',
        max_quantity: '',
        unit: '',
        display_order: 0,
        is_active: true,
        vertical: 'both',
        meta_title: '',
        meta_description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...form.data,
            category_id: form.data.category_id === '' ? undefined : Number(form.data.category_id),
            price: form.data.price ? Number(form.data.price) : 0,
            compare_at_price: form.data.compare_at_price ? Number(form.data.compare_at_price) : null,
            cost_price: form.data.cost_price ? Number(form.data.cost_price) : null,
            stock_quantity: form.data.stock_quantity ? Number(form.data.stock_quantity) : null,
            min_quantity: form.data.min_quantity ? Number(form.data.min_quantity) : null,
            max_quantity: form.data.max_quantity ? Number(form.data.max_quantity) : null,
            collection_id: form.data.collection_id || null,
            bottle_deposit: form.data.bottle_deposit ? Number(form.data.bottle_deposit) : null,
        };
        form.transform(() => payload).post('/admin/products');
    };

    return (
        <AdminLayout title="Add product">
            <Head title="Add product - Admin" />
            <div className="space-y-4">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" />
                    Back to products
                </Link>
                <form onSubmit={submit} className="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name *</label>
                        <input type="text" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Slug</label>
                            <input type="text" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                            {form.errors.slug && <p className="mt-1 text-sm text-red-600">{form.errors.slug}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SKU *</label>
                            <input type="text" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.sku} onChange={(e) => form.setData('sku', e.target.value)} />
                            {form.errors.sku && <p className="mt-1 text-sm text-red-600">{form.errors.sku}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea rows={4} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short description</label>
                        <input type="text" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.short_description} onChange={(e) => form.setData('short_description', e.target.value)} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category *</label>
                            <select required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.category_id === '' ? '' : form.data.category_id} onChange={(e) => form.setData('category_id', Number(e.target.value))}>
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {form.errors.category_id && <p className="mt-1 text-sm text-red-600">{form.errors.category_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Collection</label>
                            <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.collection_id ?? ''} onChange={(e) => form.setData('collection_id', e.target.value ? Number(e.target.value) : null)}>
                                <option value="">None</option>
                                {collections.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL *</label>
                        <input type="text" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.image} onChange={(e) => form.setData('image', e.target.value)} />
                        {form.errors.image && <p className="mt-1 text-sm text-red-600">{form.errors.image}</p>}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price *</label>
                            <input type="number" step="0.01" min="0" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.price} onChange={(e) => form.setData('price', e.target.value)} />
                            {form.errors.price && <p className="mt-1 text-sm text-red-600">{form.errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Compare at price</label>
                            <input type="number" step="0.01" min="0" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.compare_at_price} onChange={(e) => form.setData('compare_at_price', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cost price</label>
                            <input type="number" step="0.01" min="0" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.cost_price} onChange={(e) => form.setData('cost_price', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock quantity</label>
                            <input type="number" min="0" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.stock_quantity} onChange={(e) => form.setData('stock_quantity', e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" id="is_in_stock" className="h-4 w-4 rounded border-gray-300" checked={form.data.is_in_stock} onChange={(e) => form.setData('is_in_stock', e.target.checked)} />
                            <label htmlFor="is_in_stock" className="text-sm text-gray-700">In stock</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vertical</label>
                        <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.vertical} onChange={(e) => form.setData('vertical', e.target.value)}>
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.is_subscription_eligible} onChange={(e) => form.setData('is_subscription_eligible', e.target.checked)} />
                            <span className="text-sm text-gray-700">Subscription eligible</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.requires_bottle} onChange={(e) => form.setData('requires_bottle', e.target.checked)} />
                            <span className="text-sm text-gray-700">Requires bottle</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" id="is_active" className="h-4 w-4 rounded border-gray-300" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                            <span className="text-sm text-gray-700">Active</span>
                        </label>
                    </div>
                    {form.data.requires_bottle && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bottle deposit</label>
                            <input type="number" step="0.01" min="0" className="mt-1 block w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.bottle_deposit} onChange={(e) => form.setData('bottle_deposit', e.target.value)} />
                        </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Min quantity</label>
                            <input type="number" min="1" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.min_quantity} onChange={(e) => form.setData('min_quantity', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Max quantity</label>
                            <input type="number" min="1" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.max_quantity} onChange={(e) => form.setData('max_quantity', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unit</label>
                            <input type="text" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" placeholder="e.g. kg, L" value={form.data.unit} onChange={(e) => form.setData('unit', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display order</label>
                            <input type="number" min={0} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.display_order} onChange={(e) => form.setData('display_order', Number(e.target.value) || 0)} />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-gray-200 pt-4">
                        <button type="submit" disabled={form.processing} className="rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70">
                            {form.processing ? 'Saving…' : 'Save'}
                        </button>
                        <Link href="/admin/products" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
