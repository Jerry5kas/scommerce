import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/layouts/UserLayout';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    price: string;
    compare_at_price?: string | null;
    short_description?: string | null;
}

interface Zone {
    id: number;
    name: string;
    code: string;
}

interface CategoryPageProps {
    category: Category;
    vertical: string;
    zone: Zone;
    products: Product[];
    filters: {
        sort?: string;
        min_price?: number;
        max_price?: number;
    };
}

export default function CategoryPage({ category, vertical, zone, products, filters }: CategoryPageProps) {
    const [sortBy, setSortBy] = useState(filters.sort || 'display_order');

    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        router.get(`/categories/${category.slug}`, { ...filters, sort: newSort, vertical }, { preserveState: true });
    };

    return (
        <UserLayout>
            <Head title={category.name} />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Category Header */}
                    <div className="mb-8">
                        {category.image && (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                        )}
                        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                        {category.description && <p className="text-gray-600">{category.description}</p>}
                    </div>

                    {/* Filters and Sort */}
                    <div className="bg-white rounded-lg p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600">
                            {products.length} {products.length === 1 ? 'product' : 'products'} found
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="display_order">Default</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="name_asc">Name: A to Z</option>
                            <option value="name_desc">Name: Z to A</option>
                        </select>
                    </div>

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}?vertical=${vertical}`}
                                    className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                                        {product.short_description && (
                                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                                {product.short_description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold">₹{product.price}</span>
                                            {product.compare_at_price && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    ₹{product.compare_at_price}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No products found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}

