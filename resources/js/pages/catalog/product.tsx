import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/layouts/UserLayout';

interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    short_description?: string | null;
    image?: string | null;
    images?: string[] | null;
    price: string;
    compare_at_price?: string | null;
    is_subscription_eligible: boolean;
    requires_bottle: boolean;
    bottle_deposit?: string | null;
    variants?: Array<{
        id: number;
        name: string;
        sku: string;
        price: string;
        stock_quantity: number;
        is_active: boolean;
    }>;
}

interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    price: string;
}

interface Zone {
    id: number;
    name: string;
    code: string;
}

interface ProductPageProps {
    product: Product;
    vertical: string;
    zone: Zone;
    price: number;
    relatedProducts: RelatedProduct[];
    crossSellProducts?: RelatedProduct[];
    upsellProducts?: RelatedProduct[];
    isFreeSampleEligible: boolean;
}

export default function ProductPage({
    product,
    vertical,
    zone,
    price,
    relatedProducts,
    crossSellProducts = [],
    upsellProducts = [],
    isFreeSampleEligible,
}: ProductPageProps) {
    const getSafeUrl = (url: string | null | undefined) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('/')) return url;
        return `/storage/${url}`;
    };

    const images = product.images && product.images.length > 0 
        ? product.images.map(getSafeUrl)
        : product.image 
            ? [getSafeUrl(product.image)]
            : [];

    const [selectedImage, setSelectedImage] = useState(images.length > 0 ? images[0] : '');
    const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    const { post, processing } = useForm({});

    const handleAddToCart = () => {
        // TODO: Implement cart functionality
        alert('Add to cart functionality coming soon');
    };

    const handleFreeSample = () => {
        post(`/products/${product.id}/free-sample/claim`, {
            onSuccess: () => {
                alert('Free sample claimed successfully!');
            },
            onError: (errors) => {
                alert(errors.message || 'Unable to claim free sample');
            },
        });
    };

    const currentPrice = selectedVariant
        ? product.variants?.find((v) => v.id === selectedVariant)?.price || price
        : price;

    return (
        <UserLayout>
            <Head title={product.name} />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Product Images */}
                        <div>
                            <div className="mb-4">
                                <img
                                    src={selectedImage || '/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-96 object-cover rounded-lg"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`flex-shrink-0 w-20 h-20 rounded border-2 ${
                                                selectedImage === img ? 'border-blue-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover rounded" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-bold">₹{currentPrice}</span>
                                {product.compare_at_price && (
                                    <span className="text-xl text-gray-500 line-through">₹{product.compare_at_price}</span>
                                )}
                            </div>

                            {product.short_description && (
                                <p className="text-gray-600 mb-6">{product.short_description}</p>
                            )}

                            {/* Variants */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Select Variant</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant.id)}
                                                className={`px-4 py-2 rounded border ${
                                                    selectedVariant === variant.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-300'
                                                }`}
                                            >
                                                {variant.name} - ₹{variant.price}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Quantity</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-1 border rounded"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 px-3 py-1 border rounded text-center"
                                        min="1"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-1 border rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add to Cart
                                </button>
                                {isFreeSampleEligible && (
                                    <button
                                        onClick={handleFreeSample}
                                        disabled={processing}
                                        className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Claiming...' : 'Try Free'}
                                    </button>
                                )}
                            </div>

                            {product.is_subscription_eligible && (
                                <Link
                                    href={`/subscription?product=${product.id}`}
                                    className="block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Subscribe & Save
                                </Link>
                            )}

                            {product.requires_bottle && product.bottle_deposit && (
                                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        Bottle deposit: ₹{product.bottle_deposit} (refundable)
                                    </p>
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-bold mb-4">Description</h2>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upsell Products */}
                    {upsellProducts.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {upsellProducts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/products/${item.slug}?vertical=${vertical}`}
                                        className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {item.image && (
                                            <img src={getSafeUrl(item.image)} alt={item.name} className="w-full h-48 object-cover" />
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-medium text-sm mb-2">{item.name}</h3>
                                            <span className="text-lg font-bold">₹{item.price}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Cross-sell Products */}
                    {crossSellProducts.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {crossSellProducts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/products/${item.slug}?vertical=${vertical}`}
                                        className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {item.image && (
                                            <img src={getSafeUrl(item.image)} alt={item.name} className="w-full h-48 object-cover" />
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-medium text-sm mb-2">{item.name}</h3>
                                            <span className="text-lg font-bold">₹{item.price}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {relatedProducts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/products/${item.slug}?vertical=${vertical}`}
                                        className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {item.image && (
                                            <img src={getSafeUrl(item.image)} alt={item.name} className="w-full h-48 object-cover" />
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-medium text-sm mb-2">{item.name}</h3>
                                            <span className="text-lg font-bold">₹{item.price}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}

