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
    variants_count: number;
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
    const fallbackImage = '/images/icons/milk-bottle.png';

    const getSafeImageUrl = (url: string | null | undefined): string => {
        if (!url) {
            return fallbackImage;
        }

        if (url.startsWith('http') || url.startsWith('/')) {
            return url;
        }

        return `/storage/${url}`;
    };

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
                {flash?.message && <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{flash.message}</div>}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                        <select
                            value={filters.vertical}
                            onChange={(e) => applyFilters(e.target.value, filters.zone_id)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                        >
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.zone_id}
                            onChange={(e) => applyFilters(filters.vertical, Number(e.target.value))}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                        >
                            <option value={0}>All zones</option>
                            {zones.map((z) => (
                                <option key={z.id} value={z.id}>
                                    {z.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Add product
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vertical</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No products yet. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <img
                                                src={getSafeImageUrl(p.image)}
                                                alt={p.name}
                                                className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.onerror = null;
                                                    event.currentTarget.src = fallbackImage;
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Link
                                                href={'/admin/products/' + p.id}
                                                className="font-medium text-[var(--admin-dark-primary)] hover:underline"
                                            >
                                                {p.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600">{p.sku}</td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600">{p.category?.name ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-800">
                                            ₹{Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {p.variants_count > 0 ? (
                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                    {p.variants_count} variant{p.variants_count !== 1 ? 's' : ''}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">None</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600">
                                            {verticalOptions[p.vertical] ?? p.vertical}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={p.is_active ? 'text-green-600' : 'text-gray-400'}>
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={'/admin/products/' + p.id}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={'/admin/products/' + p.id + '/zones'}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Manage zones"
                                                >
                                                    <MapPin className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={'/admin/products/' + p.id + '/edit'}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={'/admin/products/' + p.id + '/toggle-status'}
                                                    method="post"
                                                    as="button"
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title={p.is_active ? 'Disable' : 'Enable'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={'/admin/products/' + p.id}
                                                    method="delete"
                                                    as="button"
                                                    className="rounded p-2 text-red-500 hover:bg-red-50"
                                                    title="Delete"
                                                    preserveScroll
                                                    onBefore={() => (confirm('Delete this product?') ? undefined : false)}
                                                >
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
