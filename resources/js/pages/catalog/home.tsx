import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/layouts/UserLayout';
import { BusinessVertical } from '@/types';

interface Banner {
    id: number;
    name: string;
    slug: string;
    banner_image: string;
    banner_mobile_image?: string | null;
    link_url?: string | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    icon?: string | null;
    products_count: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    price: string;
    compare_at_price?: string | null;
}

interface Zone {
    id: number;
    name: string;
    code: string;
    city: string;
    state: string;
}

interface CatalogHomeProps {
    vertical: string;
    verticalOptions: Record<string, string>;
    zone: Zone;
    banners: Banner[];
    categories: Category[];
    featuredProducts: Product[];
}

export default function CatalogHome({
    vertical,
    verticalOptions,
    zone,
    banners,
    categories,
    featuredProducts,
}: CatalogHomeProps) {
    const [selectedVertical, setSelectedVertical] = useState(vertical);

    const handleVerticalChange = (newVertical: string) => {
        setSelectedVertical(newVertical);
        router.get('/catalog', { vertical: newVertical }, { preserveState: true, preserveScroll: true });
    };

    return (
        <UserLayout>
            <Head title="Catalog" />
            <div className="min-h-screen bg-gray-50">
                {/* Vertical Tabs */}
                <div className="bg-white border-b sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex space-x-1">
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => handleVerticalChange(value)}
                                    className={`px-6 py-4 font-medium text-sm transition-colors ${
                                        selectedVertical === value
                                            ? 'border-b-2 border-blue-600 text-blue-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hero Banners */}
                {banners.length > 0 && (
                    <div className="relative w-full h-64 md:h-96 overflow-hidden">
                        <div className="flex h-full transition-transform duration-500">
                            {banners.map((banner) => (
                                <div key={banner.id} className="min-w-full h-full relative">
                                    <img
                                        src={banner.banner_image}
                                        alt={banner.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <h2 className="text-3xl md:text-4xl font-bold mb-2">{banner.name}</h2>
                                            {banner.link_url && (
                                                <Link
                                                    href={banner.link_url}
                                                    className="inline-block mt-4 px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
                                                >
                                                    Shop Now
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Categories Grid */}
                    {categories.length > 0 ? (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}?vertical=${selectedVertical}`}
                                        className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                                    >
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-24 object-cover rounded mb-2"
                                            />
                                        ) : (
                                            <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                                                {category.icon || '📦'}
                                            </div>
                                        )}
                                        <h3 className="font-medium text-sm">{category.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{category.products_count} products</p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
                            <div className="bg-white rounded-lg p-8 text-center">
                                <p className="text-gray-500">No categories available for this vertical yet.</p>
                            </div>
                        </section>
                    )}

                    {/* Featured Products */}
                    {featuredProducts.length > 0 ? (
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {featuredProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={productRoute(product.slug, { query: { vertical: selectedVertical } })}
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
                        </section>
                    ) : (
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
                            <div className="bg-white rounded-lg p-8 text-center">
                                <p className="text-gray-500">No featured products available for this vertical yet.</p>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}

