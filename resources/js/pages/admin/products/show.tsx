import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, MapPin } from 'lucide-react';
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

interface ZoneRef {
    id: number;
    name: string;
    code: string;
    pivot?: { is_available: boolean; price_override: string | null; stock_quantity: number | null };
}

interface ProductData {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    short_description: string | null;
    price: string | number;
    compare_at_price: string | number | null;
    stock_quantity: number | null;
    is_in_stock: boolean;
    is_active: boolean;
    vertical: string;
    is_subscription_eligible: boolean;
    requires_bottle: boolean;
    bottle_deposit: string | number | null;
    image?: string | null;
    images?: string[] | null;
    category?: CategoryRef | null;
    collection?: CollectionRef | null;
    zones?: ZoneRef[];
}

interface AdminProductsShowProps {
    product: ProductData;
}

export default function AdminProductsShow({ product }: AdminProductsShowProps) {
    const productUrl = '/admin/products/' + product.id;
    const editUrl = productUrl + '/edit';
    const zonesUrl = productUrl + '/zones';

    return (
        <AdminLayout title={product.name}>
            <Head title={product.name + ' - Admin'} />
            <div className="space-y-4">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" />
                    Back to products
                </Link>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                    <div className="flex gap-2">
                        <Link href={zonesUrl} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <MapPin className="h-4 w-4" />
                            Manage zones
                        </Link>
                        <Link href={editUrl} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Link>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    {(product.image || (product.images && product.images.length > 0)) && (
                        <div className="mb-4 flex flex-wrap items-start gap-4">
                            {product.image && (
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Main image</div>
                                    <img src={product.image} alt={product.name} className="mt-1 h-32 w-32 rounded-lg border border-gray-200 object-cover" />
                                </div>
                            )}
                            {product.images && product.images.length > 0 && (
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-500">Gallery</div>
                                    <div className="mt-1 flex flex-wrap gap-3">
                                        {product.images.map((url, index) => (
                                            <img key={index} src={url} alt={product.name + ' image ' + (index + 1)} className="h-20 w-20 rounded-lg border border-gray-200 object-cover" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <dl className="grid gap-3 sm:grid-cols-2">
                        <div><dt className="text-sm font-medium text-gray-500">SKU</dt><dd className="mt-0.5 text-sm text-gray-900">{product.sku}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Slug</dt><dd className="mt-0.5 text-sm text-gray-900">{product.slug}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Category</dt><dd className="mt-0.5 text-sm text-gray-900">{product.category?.name ?? '—'}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Collection</dt><dd className="mt-0.5 text-sm text-gray-900">{product.collection?.name ?? '—'}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Price</dt><dd className="mt-0.5 text-sm text-gray-900">{product.price}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Compare at price</dt><dd className="mt-0.5 text-sm text-gray-900">{product.compare_at_price ?? '—'}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Stock</dt><dd className="mt-0.5 text-sm text-gray-900">{product.stock_quantity ?? '—'} {product.is_in_stock ? '(In stock)' : '(Out of stock)'}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Vertical</dt><dd className="mt-0.5 text-sm text-gray-900">{product.vertical}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Status</dt><dd className="mt-0.5 text-sm text-gray-900">{product.is_active ? 'Active' : 'Inactive'}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Subscription eligible</dt><dd className="mt-0.5 text-sm text-gray-900">{product.is_subscription_eligible ? 'Yes' : 'No'}</dd></div>
                        <div><dt className="text-sm font-medium text-gray-500">Requires bottle</dt><dd className="mt-0.5 text-sm text-gray-900">{product.requires_bottle ? 'Yes' : 'No'}</dd></div>
                        {product.requires_bottle && <div><dt className="text-sm font-medium text-gray-500">Bottle deposit</dt><dd className="mt-0.5 text-sm text-gray-900">{product.bottle_deposit ?? '—'}</dd></div>}
                        {product.description && <div className="sm:col-span-2"><dt className="text-sm font-medium text-gray-500">Description</dt><dd className="mt-0.5 text-sm text-gray-900 whitespace-pre-wrap">{product.description}</dd></div>}
                    </dl>
                </div>
                {product.zones && product.zones.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-4 py-3"><h3 className="text-sm font-medium text-gray-900">Zone availability</h3></div>
                        <ul className="divide-y divide-gray-200">
                            {product.zones.map((z) => (
                                <li key={z.id} className="flex items-center justify-between px-4 py-3">
                                    <span className="font-medium text-gray-900">{z.name} ({z.code})</span>
                                    <span className={z.pivot?.is_available ? 'text-green-600' : 'text-gray-400'}>
                                        {z.pivot?.is_available ? 'Available' : 'Unavailable'}
                                        {z.pivot?.price_override != null && ' · Rs ' + z.pivot.price_override}
                                        {z.pivot?.stock_quantity != null && ' · Stock: ' + z.pivot.stock_quantity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
