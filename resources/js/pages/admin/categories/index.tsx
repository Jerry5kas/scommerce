import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Eye, Trash2, Power } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface CategoryData {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    vertical: string;
    is_active: boolean;
    products_count: number;
}

interface AdminCategoriesIndexProps {
    categories: CategoryData[];
    verticalOptions: Record<string, string>;
    filters: { vertical: string };
}

export default function AdminCategoriesIndex({ categories, verticalOptions, filters }: AdminCategoriesIndexProps) {
    const { flash } = (usePage().props as { flash?: { message?: string } }) ?? {};

    const applyFilter = (vertical: string) => {
        const params = new URLSearchParams();
        if (vertical) params.set('vertical', vertical);
        router.get('/admin/categories' + (params.toString() ? '?' + params.toString() : ''));
    };

    return (
        <AdminLayout title="Categories">
            <Head title="Categories - Admin" />
            <div className="space-y-4">
                {flash?.message && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{flash.message}</div>
                )}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                        <select
                            value={filters.vertical}
                            onChange={(e) => applyFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                        >
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Add category
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Image</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Slug</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Vertical</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Products</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No categories yet. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            {cat.image ? (
                                                <img
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-xs text-gray-400">
                                                    No image
                                                </div>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <Link
                                                href={'/admin/categories/' + cat.id}
                                                className="font-medium text-[var(--admin-dark-primary)] hover:underline"
                                            >
                                                {cat.name}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{cat.slug}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{verticalOptions[cat.vertical] ?? cat.vertical}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{cat.products_count}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={cat.is_active ? 'text-green-600' : 'text-gray-400'}>
                                                {cat.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={'/admin/categories/' + cat.id} className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="View">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={'/admin/categories/' + cat.id + '/edit'} className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <Link href={'/admin/categories/' + cat.id + '/toggle-status'} method="post" as="button" className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title={cat.is_active ? 'Disable' : 'Enable'}>
                                                    <Power className="h-4 w-4" />
                                                </Link>
                                                <Link href={'/admin/categories/' + cat.id} method="delete" as="button" className="rounded p-2 text-red-500 hover:bg-red-50" title="Delete" preserveScroll onBefore={() => (confirm('Delete this category?') ? undefined : false)}>
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
