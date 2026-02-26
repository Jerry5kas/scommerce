import { Head, Link } from '@inertiajs/react';
import { Heart, Users, Package, TrendingUp, ChevronRight } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface TopProduct {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    wishlisted_count: number;
    price: number;
}

interface TopUser {
    id: number;
    name: string;
    email: string;
    wishlisted_count: number;
}

interface Stats {
    total_wishlisted_items: number;
    unique_users: number;
    unique_products: number;
}

interface Props {
    topProducts: TopProduct[];
    topUsers: TopUser[];
    stats: Stats;
}

const formatCurrency = (val: string | number) => `₹${Number(val).toFixed(2)}`;

export default function WishlistIndex({ topProducts, topUsers, stats }: Props) {
    return (
        <AdminLayout>
            <Head title="Wishlist Insights - Admin" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Wishlist Insights</h1>
                        <p className="text-gray-500">Analyze popular products and user engagement</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-[var(--theme-primary-1)]/10 px-4 py-2 text-[var(--theme-primary-1)]">
                        <Heart className="h-5 w-5 fill-current" />
                        <span className="font-semibold">{stats.total_wishlisted_items} Total Items</span>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Unique Users</p>
                            <p className="text-2xl font-black text-gray-900">{stats.unique_users}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Unique Products</p>
                            <p className="text-2xl font-black text-gray-900">{stats.unique_products}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Conversion Ratio</p>
                            <p className="text-2xl font-black text-gray-900">{(stats.total_wishlisted_items / (stats.unique_users || 1)).toFixed(1)} items/user</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Products Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Most Wishlisted Products</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Count</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {topProducts.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden">
                                                        {p.image ? (
                                                            <img src={`/storage/${p.image}`} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-gray-300">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {p.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-900">{formatCurrency(p.price)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Heart className="h-3.5 w-3.5 text-red-500 fill-current" />
                                                    <span className="text-sm font-bold text-gray-900">{p.wishlisted_count}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/admin/products/${p.id}/edit`} className="text-gray-400 hover:text-[var(--theme-primary-1)]">
                                                    <ChevronRight className="h-5 w-5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Users Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Users by Wishlist Size</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Items Saved</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {topUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                                                    <p className="text-xs text-gray-500">{u.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-bold text-gray-900">{u.wishlisted_count}</span>
                                                    <span className="text-xs text-gray-500">items</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/admin/users/${u.id}`} className="text-gray-400 hover:text-[var(--theme-primary-1)]">
                                                    <ChevronRight className="h-5 w-5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
