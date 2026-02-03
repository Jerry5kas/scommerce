import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/layouts/UserLayout';

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

interface SearchPageProps {
    query: string;
    vertical: string;
    zone: Zone;
    products: Product[];
}

export default function SearchPage({ query, vertical, zone, products }: SearchPageProps) {
    const [searchQuery, setSearchQuery] = useState(query);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/catalog/search', { q: searchQuery, vertical }, { preserveState: true });
    };

    return (
        <UserLayout>
            <Head title={`Search: ${query}`} />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Results */}
                    {query && (
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold">
                                Search results for &quot;{query}&quot; ({products.length} {products.length === 1 ? 'result' : 'results'})
                            </h1>
                        </div>
                    )}

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
                            <p className="text-gray-500">No products found. Try a different search term.</p>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}

