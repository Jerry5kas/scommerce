import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/layouts/UserLayout';

interface Collection {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    banner_image: string;
    banner_mobile_image?: string | null;
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
}

interface CollectionPageProps {
    collection: Collection;
    vertical: string;
    zone: Zone;
    products: Product[];
    filters: {
        sort?: string;
    };
}

export default function CollectionPage({ collection, vertical, zone, products, filters }: CollectionPageProps) {
    return (
        <UserLayout>
            <Head title={collection.name} />
            <div className="min-h-screen bg-gray-50">
                {/* Collection Banner */}
                <div className="relative w-full h-64 md:h-96 overflow-hidden">
                    <img
                        src={collection.banner_image}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{collection.name}</h1>
                            {collection.description && (
                                <p className="text-lg md:text-xl max-w-2xl px-4">{collection.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            <p className="text-gray-500">No products found in this collection.</p>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}

