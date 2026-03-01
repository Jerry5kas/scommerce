import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/layouts/UserLayout';
import { FALLBACK_IMAGE_URL, handleImageFallbackError } from '@/lib/imageFallback';
import { product as productRoute } from '@/routes/catalog';

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
    price,
    relatedProducts,
    crossSellProducts = [],
    upsellProducts = [],
    isFreeSampleEligible,
}: ProductPageProps) {
    const fallbackImage = FALLBACK_IMAGE_URL;

    const getSafeUrl = (url: string | null | undefined): string => {
        if (!url) return fallbackImage;
        if (url.startsWith('http') || url.startsWith('/')) return url;
        return `/storage/${url}`;
    };

    const images =
        product.images && product.images.length > 0 ? product.images.map(getSafeUrl) : product.image ? [getSafeUrl(product.image)] : [fallbackImage];

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

    const currentPrice = selectedVariant ? product.variants?.find((v) => v.id === selectedVariant)?.price || price : price;

    return (
        <UserLayout>
            <Head title={product.name} />
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Product Images */}
                        <div>
                            <div className="mb-4">
                                <img
                                    src={selectedImage || fallbackImage}
                                    alt={product.name}
                                    className="h-96 w-full rounded-lg object-cover"
                                    onError={handleImageFallbackError}
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`h-20 w-20 flex-shrink-0 rounded border-2 ${
                                                selectedImage === img ? 'border-blue-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${idx + 1}`}
                                                className="h-full w-full rounded object-cover"
                                                onError={handleImageFallbackError}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div>
                            <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
                            <div className="mb-6 flex items-center gap-4">
                                <span className="text-3xl font-bold">₹{currentPrice}</span>
                                {product.compare_at_price && <span className="text-xl text-gray-500 line-through">₹{product.compare_at_price}</span>}
                            </div>

                            {product.short_description && <p className="mb-6 text-gray-600">{product.short_description}</p>}

                            {/* Variants */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium">Select Variant</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant.id)}
                                                className={`rounded border px-4 py-2 ${
                                                    selectedVariant === variant.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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
                                <label className="mb-2 block text-sm font-medium">Quantity</label>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded border px-3 py-1">
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 rounded border px-3 py-1 text-center"
                                        min="1"
                                    />
                                    <button onClick={() => setQuantity(quantity + 1)} className="rounded border px-3 py-1">
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mb-6 flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                                >
                                    Add to Cart
                                </button>
                                {isFreeSampleEligible && (
                                    <button
                                        onClick={handleFreeSample}
                                        disabled={processing}
                                        className="rounded-lg border-2 border-blue-600 px-6 py-3 text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50"
                                    >
                                        {processing ? 'Claiming...' : 'Try Free'}
                                    </button>
                                )}
                            </div>

                            {product.is_subscription_eligible && (
                                <Link
                                    href={`/subscription?product=${product.id}`}
                                    className="block w-full rounded-lg bg-green-600 px-6 py-3 text-center text-white transition-colors hover:bg-green-700"
                                >
                                    Subscribe & Save
                                </Link>
                            )}

                            {product.requires_bottle && product.bottle_deposit && (
                                <div className="mt-4 rounded-lg bg-yellow-50 p-4">
                                    <p className="text-sm text-yellow-800">Bottle deposit: ₹{product.bottle_deposit} (refundable)</p>
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <div className="mt-8">
                                    <h2 className="mb-4 text-xl font-bold">Description</h2>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upsell Products */}
                    {upsellProducts.length > 0 && (
                        <section className="mb-12">
                            <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                                {upsellProducts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={productRoute(item.slug, { query: { vertical } })}
                                        className="overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md"
                                    >
                                        <img
                                            src={getSafeUrl(item.image)}
                                            alt={item.name}
                                            className="h-48 w-full object-cover"
                                            onError={handleImageFallbackError}
                                        />
                                        <div className="p-4">
                                            <h3 className="mb-2 text-sm font-medium">{item.name}</h3>
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
                            <h2 className="mb-6 text-2xl font-bold">Frequently Bought Together</h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                                {crossSellProducts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={productRoute(item.slug, { query: { vertical } })}
                                        className="overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md"
                                    >
                                        <img
                                            src={getSafeUrl(item.image)}
                                            alt={item.name}
                                            className="h-48 w-full object-cover"
                                            onError={handleImageFallbackError}
                                        />
                                        <div className="p-4">
                                            <h3 className="mb-2 text-sm font-medium">{item.name}</h3>
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
                            <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                                {relatedProducts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={productRoute(item.slug, { query: { vertical } })}
                                        className="overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md"
                                    >
                                        <img
                                            src={getSafeUrl(item.image)}
                                            alt={item.name}
                                            className="h-48 w-full object-cover"
                                            onError={handleImageFallbackError}
                                        />
                                        <div className="p-4">
                                            <h3 className="mb-2 text-sm font-medium">{item.name}</h3>
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
