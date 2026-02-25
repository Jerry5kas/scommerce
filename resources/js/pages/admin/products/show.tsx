import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, MapPin, Package } from 'lucide-react';
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

interface VariantData {
    id: number;
    name: string;
    sku: string;
    price: string | number;
    stock_quantity: number;
    is_active: boolean;
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
    is_one_time_purchase: boolean;
    requires_bottle: boolean;
    bottle_deposit: string | number | null;
    unit: string | null;
    weight: string | number | null;
    min_quantity: number | null;
    max_quantity: number | null;
    image?: string | null;
    images?: string[] | null;
    category?: CategoryRef | null;
    collection?: CollectionRef | null;
    zones?: ZoneRef[];
    variants?: VariantData[];
}

interface AdminProductsShowProps {
    product: ProductData;
    verticalOptions?: Record<string, string>;
}

const VERTICAL_LABELS: Record<string, string> = {
    both: 'Both',
    daily_fresh: 'Daily Fresh',
    society_fresh: 'Society Fresh',
};

const formatPrice = (price: string | number | null | undefined): string => {
    if (price == null || price === '') return '—';
    return '₹' + Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 });
};

export default function AdminProductsShow({ product, verticalOptions }: AdminProductsShowProps) {
    const productUrl = '/admin/products/' + product.id;
    const editUrl = productUrl + '/edit';
    const zonesUrl = productUrl + '/zones';
    const verticalLabel = verticalOptions?.[product.vertical] ?? VERTICAL_LABELS[product.vertical] ?? product.vertical;

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

                {/* ── Product details card ────────────────────────── */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    {(product.image || (product.images && product.images.length > 0)) && (
                        <div className="mb-5 flex flex-wrap items-start gap-4">
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
                    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">SKU</dt>
                            <dd className="mt-0.5 font-mono text-sm text-gray-900">{product.sku}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Slug</dt>
                            <dd className="mt-0.5 font-mono text-sm text-gray-900">{product.slug}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Category</dt>
                            <dd className="mt-0.5 text-sm text-gray-900">
                                {product.category ? (
                                    <Link href={`/admin/categories/${product.category.id}`} className="text-[var(--admin-dark-primary)] hover:underline">
                                        {product.category.name}
                                    </Link>
                                ) : '—'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Collection</dt>
                            <dd className="mt-0.5 text-sm text-gray-900">
                                {product.collection ? (
                                    <Link href={`/admin/collections/${product.collection.id}`} className="text-[var(--admin-dark-primary)] hover:underline">
                                        {product.collection.name}
                                    </Link>
                                ) : '—'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Price</dt>
                            <dd className="mt-0.5 text-sm font-semibold text-gray-900">{formatPrice(product.price)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Compare at price</dt>
                            <dd className="mt-0.5 text-sm text-gray-900">{formatPrice(product.compare_at_price)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Stock</dt>
                            <dd className="mt-0.5 text-sm text-gray-900">
                                {product.stock_quantity ?? '—'}
                                <span className={`ml-1.5 text-xs ${product.is_in_stock ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.is_in_stock ? '● In stock' : '● Out of stock'}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Vertical</dt>
                            <dd className="mt-0.5 text-sm text-gray-900">{verticalLabel}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-0.5">
                                <span
                                    className={
                                        product.is_active
                                            ? 'inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700'
                                            : 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500'
                                    }
                                >
                                    {product.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </dd>
                        </div>
                        {product.unit && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Unit</dt>
                                <dd className="mt-0.5 text-sm text-gray-900">{product.unit}</dd>
                            </div>
                        )}
                        {product.weight != null && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                                <dd className="mt-0.5 text-sm text-gray-900">{product.weight} {product.unit ?? 'kg'}</dd>
                            </div>
                        )}
                        {(product.min_quantity != null || product.max_quantity != null) && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Quantity range</dt>
                                <dd className="mt-0.5 text-sm text-gray-900">
                                    {product.min_quantity ?? 1} – {product.max_quantity ?? '∞'}
                                </dd>
                            </div>
                        )}
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Subscription eligible</dt>
                            <dd className="mt-0.5 text-sm text-gray-900">{product.is_subscription_eligible ? 'Yes' : 'No'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Requires bottle</dt>
                            <dd className="mt-0.5 text-sm text-gray-900">{product.requires_bottle ? 'Yes' : 'No'}</dd>
                        </div>
                        {product.requires_bottle && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Bottle deposit</dt>
                                <dd className="mt-0.5 text-sm text-gray-900">{formatPrice(product.bottle_deposit)}</dd>
                            </div>
                        )}
                        {product.description && (
                            <div className="sm:col-span-2 lg:col-span-3">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-0.5 text-sm text-gray-900 whitespace-pre-wrap">{product.description}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* ── Variants ──────────────────────────────────────── */}
                {product.variants && product.variants.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <Package className="h-4 w-4 text-gray-400" />
                                Variants
                                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                    {product.variants.length}
                                </span>
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Size / Label</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">SKU</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Stock</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {product.variants.map((v) => (
                                        <tr key={v.id}>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">
                                                {v.name}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                                                {v.sku}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                                                {formatPrice(v.price)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                {v.stock_quantity}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span
                                                    className={
                                                        v.is_active
                                                            ? 'inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700'
                                                            : 'inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500'
                                                    }
                                                >
                                                    {v.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Zone availability ─────────────────────────────── */}
                {product.zones && product.zones.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-4 py-3">
                            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                Zone availability
                                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                    {product.zones.length}
                                </span>
                            </h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {product.zones.map((z) => (
                                <li key={z.id} className="flex items-center justify-between px-4 py-3">
                                    <span className="font-medium text-gray-900">{z.name} ({z.code})</span>
                                    <span className={z.pivot?.is_available ? 'text-green-600' : 'text-gray-400'}>
                                        {z.pivot?.is_available ? 'Available' : 'Unavailable'}
                                        {z.pivot?.price_override != null && ' · ' + formatPrice(z.pivot.price_override)}
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
