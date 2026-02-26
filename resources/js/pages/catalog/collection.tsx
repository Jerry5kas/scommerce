import { Head, Link } from '@inertiajs/react';
import { product as productRoute } from '@/routes/catalog';
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
                <div className="relative h-64 w-full overflow-hidden md:h-96">
                    <img src={collection.banner_image} alt={collection.name} className="h-full w-full object-cover" />
                    <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black">
                        <div className="text-center text-white">
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{collection.name}</h1>
                            {collection.description && <p className="max-w-2xl px-4 text-lg md:text-xl">{collection.description}</p>}
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={productRoute(product.slug, { query: { vertical } })}
                                    className="overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md"
                                >
                                    {product.image && <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />}
                                    <div className="p-4">
                                        <h3 className="mb-2 line-clamp-2 text-sm font-medium">{product.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold">₹{product.price}</span>
                                            {product.compare_at_price && (
                                                <span className="text-sm text-gray-500 line-through">₹{product.compare_at_price}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-gray-500">No products found in this collection.</p>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
