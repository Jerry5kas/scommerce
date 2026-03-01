import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Package } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { handleImageFallbackError, toSafeImageUrl } from '@/lib/imageFallback';

interface ProductSummary {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    price: string | number;
    is_active: boolean;
    variants_count: number;
}

interface CategoryData {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    vertical: string;
    is_active: boolean;
    display_order: number;
    products_count: number;
    products?: ProductSummary[];
}

interface AdminCategoriesShowProps {
    category: CategoryData;
    verticalOptions: Record<string, string>;
}

const VERTICAL_LABELS: Record<string, string> = {
    both: 'Both',
    daily_fresh: 'Daily Fresh',
    society_fresh: 'Society Fresh',
};

export default function AdminCategoriesShow({ category, verticalOptions }: AdminCategoriesShowProps) {
    const verticalLabel = verticalOptions?.[category.vertical] ?? VERTICAL_LABELS[category.vertical] ?? category.vertical;

    return (
        <AdminLayout title={category.name}>
            <Head title={`${category.name} - Admin`} />
            <div className="space-y-4">
                <Link
                    href="/admin/categories"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to categories
                </Link>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                    <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Link>
                </div>

                {/* ── Details card ───────────────────────────────────── */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    {/* Category image */}
                    <div className="mb-5">
                        <div className="text-sm font-medium text-gray-500">Image</div>
                        <img
                            src={toSafeImageUrl(category.image)}
                            alt={category.name}
                            className="mt-1 h-32 w-32 rounded-lg border border-gray-200 object-cover"
                            onError={handleImageFallbackError}
                        />
                    </div>

                    <dl className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Slug</dt>
                            <dd className="mt-0.5 font-mono text-sm text-gray-900">{category.slug}</dd>
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
                                        category.is_active
                                            ? 'inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700'
                                            : 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500'
                                    }
                                >
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Display order</dt>
                            <dd className="mt-0.5 text-sm text-gray-900">{category.display_order}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Products</dt>
                            <dd className="mt-0.5">
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                    {category.products_count} product{category.products_count !== 1 ? 's' : ''}
                                </span>
                            </dd>
                        </div>
                        {category.description && (
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-0.5 text-sm whitespace-pre-wrap text-gray-900">{category.description}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* ── Products list ──────────────────────────────────── */}
                {category.products && category.products.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-4 py-3">
                            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <Package className="h-4 w-4 text-gray-400" />
                                Products in this category
                                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{category.products.length}</span>
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {category.products.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <img
                                                    src={toSafeImageUrl(p.image)}
                                                    alt={p.name}
                                                    className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                                                    onError={handleImageFallbackError}
                                                />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Link
                                                    href={`/admin/products/${p.id}`}
                                                    className="font-medium text-[var(--admin-dark-primary)] hover:underline"
                                                >
                                                    {p.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-800">
                                                ₹{Number(p.price).toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {p.variants_count > 0 ? (
                                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                        {p.variants_count}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span
                                                    className={
                                                        p.is_active
                                                            ? 'inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700'
                                                            : 'inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500'
                                                    }
                                                >
                                                    {p.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
