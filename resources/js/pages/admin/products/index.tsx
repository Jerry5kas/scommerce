import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Eye, Trash2, Power, MapPin } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface CategoryRef {
    id: number;
    name: string;
    slug: string;
}

interface CollectionRef {
    id: number;
    name: string;
    slug: string;
}

interface ProductData {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: string | number;
    is_active: boolean;
    vertical: string;
    image?: string | null;
    category?: CategoryRef | null;
    collection?: CollectionRef | null;
}

interface ZoneOption {
    id: number;
    name: string;
    code: string;
}

interface AdminProductsIndexProps {
    products: ProductData[];
    zones: ZoneOption[];
    verticalOptions: Record<string, string>;
    filters: { vertical: string; zone_id: number };
}

export default function AdminProductsIndex({ products, zones, verticalOptions, filters }: AdminProductsIndexProps) {
    const { flash } = (usePage().props as { flash?: { message?: string } }) ?? {};

    const applyFilters = (vertical: string, zoneId: number) => {
        const params = new URLSearchParams();
        if (vertical) params.set('vertical', vertical);
        if (zoneId > 0) params.set('zone_id', String(zoneId));
        router.get('/admin/products' + (params.toString() ? '?' + params.toString() : ''));
    };

    return (
        <AdminLayout title="Products">
            <Head title="Products - Admin" />
            <div className="space-y-4">
                {flash?.message && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{flash.message}</div>
                )}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                        <select
                            value={filters.vertical}
                            onChange={(e) => applyFilters(e.target.value, filters.zone_id)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                        >
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <select
                            value={filters.zone_id}
                            onChange={(e) => applyFilters(filters.vertical, Number(e.target.value))}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                        >
                            <option value={0}>All zones</option>
                            {zones.map((z) => (
                                <option key={z.id} value={z.id}>{z.name}</option>
                            ))}
                        </select>
                    </div>
                    <Link href="/admin/products/create" className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                        <Plus className="h-4 w-4" />
                        Add product
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Image</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">SKU</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Vertical</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No products yet. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id}>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {p.image ? (
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-gray-200 text-xs text-gray-400">
                                                        No image
                                                    </div>
                                                )}
                                            </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <Link href={'/admin/products/' + p.id} className="font-medium text-[var(--admin-dark-primary)] hover:underline">
                                                {p.name}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{p.sku}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{p.category?.name ?? '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{p.price}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{verticalOptions[p.vertical] ?? p.vertical}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={p.is_active ? 'text-green-600' : 'text-gray-400'}>{p.is_active ? 'Active' : 'Inactive'}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={'/admin/products/' + p.id} className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="View">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={'/admin/products/' + p.id + '/zones'} className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Manage zones">
                                                    <MapPin className="h-4 w-4" />
                                                </Link>
                                                <Link href={'/admin/products/' + p.id + '/edit'} className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <Link href={'/admin/products/' + p.id + '/toggle-status'} method="post" as="button" className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title={p.is_active ? 'Disable' : 'Enable'}>
                                                    <Power className="h-4 w-4" />
                                                </Link>
                                                <Link href={'/admin/products/' + p.id} method="delete" as="button" className="rounded p-2 text-red-500 hover:bg-red-50" title="Delete" preserveScroll onBefore={() => (confirm('Delete this product?') ? undefined : false)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
