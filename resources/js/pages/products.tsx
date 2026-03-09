import { Head, Link, router, usePage } from '@inertiajs/react';
import { Heart, ChevronRight, Package } from 'lucide-react';
import { useState } from 'react';
import ProductCardMedia, { getMediaList } from '@/components/user/ProductCardMedia';
import UserLayout from '@/layouts/UserLayout';
import { FALLBACK_IMAGE_URL, handleImageFallbackError } from '@/lib/imageFallback';
import { product as productRoute } from '@/routes/catalog';
import type { SharedData } from '@/types';

interface BackendCategory {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    products_count: number;
}

interface BackendProduct {
    id: number;
    name: string;
    slug: string;
    short_description?: string | null;
    unit: string;
    weight: string;
    price: string | number;
    image: string | null;
    images: string[] | null;
    category?: { slug: string };
    is_subscription_eligible: boolean;
    cost_price?: string | number; // maybe used to show a fake best seller tag
    variants?: Array<{ price: string | number | null }>;
}

interface PageProps extends SharedData {
    categories: BackendCategory[];
    products: BackendProduct[];
    vertical: string;
}

export default function Products() {
    const { categories, products } = usePage<PageProps>().props;
    const auth = (usePage().props as { auth?: { user?: unknown; wishlisted_products?: number[] } }).auth;

    const fallbackImage = FALLBACK_IMAGE_URL;

    const isSupportedImageUrl = (url: string): boolean => {
        const cleanUrl = url.split('?')[0]?.split('#')[0]?.toLowerCase() ?? '';
        const lastDotIndex = cleanUrl.lastIndexOf('.');

        if (lastDotIndex === -1) {
            return true;
        }

        const extension = cleanUrl.slice(lastDotIndex);
        const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.bmp', '.svg', '.jfif']);

        return supportedExtensions.has(extension);
    };

    const getSafeUrl = (url: string | null | undefined): string => {
        if (!url) {
            return fallbackImage;
        }

        if (url === 'default.png' || url === '/demo/milk.png' || url === 'demo/milk.png') {
            return fallbackImage;
        }

        const normalized = url.startsWith('http') || url.startsWith('/') ? url : url.startsWith('demo/') ? `/${url}` : `/storage/${url}`;

        if (!isSupportedImageUrl(normalized)) {
            return fallbackImage;
        }

        return normalized;
    };

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [cardMediaIndex, setCardMediaIndex] = useState<Record<string, number>>({});
    const [addingProductId, setAddingProductId] = useState<number | null>(null);
    const wishlistedProductIds = new Set(auth?.wishlisted_products || []);

    const setCardMediaIndexForKey = (key: string, index: number) => {
        setCardMediaIndex((prev) => ({ ...prev, [key]: index }));
    };

    const toggleWishlist = (id: number) => {
        if (!auth?.user) {
            router.get('/login');
            return;
        }

        router.post(`/wishlist/toggle/${id}`, {}, { preserveScroll: true, preserveState: true });
    };

    const addToCart = (event: React.MouseEvent, productId: number) => {
        event.preventDefault();
        event.stopPropagation();

        if (addingProductId === productId) {
            return;
        }

        setAddingProductId(productId);
        router.post(
            '/cart/add',
            { product_id: productId, quantity: 1 },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setAddingProductId((current) => (current === productId ? null : current)),
            },
        );
    };

    // Make "All Products" category dynamically
    const allProductsCount = Array.isArray(products) ? products.length : 0;

    // Sort categories (you could sort by product count or name, or keep default)
    const validCategories = Array.isArray(categories) ? categories : [];

    const categoriesWithCount = [
        {
            id: 0,
            slug: 'all',
            name: 'All Products',
            image: fallbackImage,
            products_count: allProductsCount,
        },
        ...validCategories.map((c) => {
            const safeImage = getSafeUrl(c.image);
            return {
                ...c,
                image: safeImage,
            };
        }),
    ];

    const safeProducts = Array.isArray(products) ? products : [];
    const filteredProducts = selectedCategory === 'all' ? safeProducts : safeProducts.filter((p) => p.category?.slug === selectedCategory);

    return (
        <UserLayout>
            <Head title="Products - Freshtick" />
            <div className="min-h-screen bg-gray-50/50 pt-2 sm:pt-3 lg:pt-24">
                <div className="container mx-auto max-w-7xl px-2 py-3 sm:px-5 sm:py-5 lg:px-6 lg:py-8">
                    {/* Page title */}
                    <div className="mb-4 sm:mb-6">
                        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500 sm:mb-6 sm:text-sm" aria-label="Breadcrumb">
                            <Link href="/" className="transition-colors hover:text-(--theme-primary-1)">
                                Home
                            </Link>
                            <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                            <span className="truncate font-medium text-gray-900" aria-current="page">
                                Product
                            </span>
                        </nav>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">Products</h1>
                        <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">Fresh dairy delivered to your doorstep</p>
                    </div>

                    <div className="flex items-start gap-1.5 sm:gap-3 lg:gap-8">
                        {/* Sidebar - mobile + desktop */}
                        <aside className="sticky top-18 shrink-0 self-start sm:top-20 lg:top-24 lg:w-64" aria-label="Product categories">
                            <div className="w-21 rounded-xl border border-gray-200/80 bg-white p-1.5 shadow-sm sm:w-24 sm:p-2 lg:w-64 lg:p-4">
                                <h2 className="mb-1.5 px-0.5 text-[9px] font-semibold tracking-wide text-gray-500 uppercase sm:mb-2 sm:text-[10px] lg:mb-4 lg:px-1 lg:text-xs">
                                    Categories
                                </h2>

                                <nav className="flex flex-col gap-1 lg:gap-1">
                                    {categoriesWithCount.map((cat) => (
                                        <button
                                            key={cat.slug}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat.slug)}
                                            className={`w-full rounded-lg p-1 text-center transition-colors lg:rounded-xl lg:px-3 lg:py-3 lg:text-left ${
                                                selectedCategory === cat.slug
                                                    ? 'bg-(--theme-primary-1)/10 text-(--theme-primary-1)'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-(--theme-primary-1)'
                                            }`}
                                        >
                                            <div className="relative overflow-hidden rounded-md border border-gray-200/80 bg-gray-50 lg:hidden">
                                                <img
                                                    src={cat.image || fallbackImage}
                                                    alt=""
                                                    className="aspect-square w-full object-cover"
                                                    loading="lazy"
                                                    onError={handleImageFallbackError}
                                                />
                                                <span
                                                    className={`absolute top-0.5 right-0.5 rounded-full px-1 py-0.5 text-[8px] leading-none font-semibold ${
                                                        selectedCategory === cat.slug
                                                            ? 'bg-(--theme-primary-1) text-white'
                                                            : 'bg-white/95 text-gray-700'
                                                    }`}
                                                >
                                                    {cat.products_count}
                                                </span>
                                            </div>

                                            <span className="mt-0.5 line-clamp-2 block text-[10px] leading-tight font-semibold lg:hidden">
                                                {cat.name}
                                            </span>

                                            <div className="hidden items-center gap-3 lg:flex">
                                                <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200/80 bg-gray-50">
                                                    <img
                                                        src={cat.image || fallbackImage}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                        onError={handleImageFallbackError}
                                                    />
                                                </span>
                                                <span className="min-w-0 flex-1 truncate text-base font-medium">{cat.name}</span>
                                                <span
                                                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        selectedCategory === cat.slug
                                                            ? 'bg-(--theme-primary-1)/20 text-(--theme-primary-1)'
                                                            : 'bg-gray-100 text-gray-500'
                                                    }`}
                                                >
                                                    {cat.products_count}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main content */}
                        <div className="min-w-0 flex-1">
                            {/* Product grid – aligned with home-card visual style */}
                            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredProducts.map((product) => {
                                    const isWishlisted = wishlistedProductIds.has(product.id);

                                    const safeImage = getSafeUrl(product.image);
                                    const safeImages = (product.images || [])
                                        .map((url) => getSafeUrl(url))
                                        .filter((url) => url !== fallbackImage)
                                        .map((url) => ({ type: 'image' as const, url }));

                                    const media = getMediaList({
                                        image: safeImage,
                                        media: safeImages.length > 0 ? safeImages : undefined,
                                    });

                                    const isBestSeller =
                                        typeof product.price === 'number' ? product.price > 100 : parseFloat(product.price as string) > 100;
                                    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
                                    const mainPrice = hasVariants
                                        ? Math.min(...product.variants!.map((variant) => parseFloat(String(variant.price ?? '0'))))
                                        : parseFloat((product.price as string) || '0');
                                    const comparePriceCandidate = parseFloat(String(product.cost_price ?? '0'));
                                    const comparePrice = Number.isFinite(comparePriceCandidate) ? comparePriceCandidate : 0;
                                    const hasDiscount = comparePrice > mainPrice;
                                    const savings = hasDiscount ? Math.round(comparePrice - mainPrice) : 0;
                                    const parsedWeight = parseFloat(String(product.weight || ''));
                                    const hasWeight = Number.isFinite(parsedWeight) && parsedWeight > 0;
                                    const weightLabel = hasWeight ? `${parsedWeight} ${product.unit || ''}`.trim() : product.unit || 'Unit';

                                    return (
                                        <article key={product.id} className="group" role="listitem">
                                            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-0.5 shadow-xs transition-all duration-200 hover:border-(--theme-primary-1)/35 hover:shadow-sm sm:p-1">
                                                <Link href={productRoute(product.slug)} className="block">
                                                    <div className="h-24 w-full overflow-hidden rounded-lg bg-(--theme-secondary)/10 sm:h-34 lg:h-38">
                                                        <ProductCardMedia
                                                            media={media}
                                                            alt={product.name}
                                                            productKey={product.id.toString()}
                                                            currentIndexMap={cardMediaIndex}
                                                            onIndexChange={setCardMediaIndexForKey}
                                                            className="h-full w-full"
                                                        />
                                                    </div>
                                                </Link>

                                                {isBestSeller && (
                                                    <span className="absolute top-1.5 left-1.5 rounded-full bg-[#cf992c] px-1 py-0.5 text-[8px] font-bold tracking-wide text-white uppercase sm:top-2 sm:left-2 sm:px-2 sm:text-[10px]">
                                                        Best Seller
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleWishlist(product.id);
                                                    }}
                                                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                                    className="absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-colors sm:top-2 sm:right-2 sm:h-8 sm:w-8"
                                                >
                                                    <Heart
                                                        className={`h-3 w-3 sm:h-4 sm:w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-white text-black'}`}
                                                        strokeWidth={2}
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={(event) => addToCart(event, product.id)}
                                                    disabled={addingProductId === product.id}
                                                    className="absolute right-1.5 bottom-1.5 flex h-6 w-6 items-center justify-center rounded-md border border-blue-600 bg-blue-50 text-blue-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-70 sm:right-2 sm:bottom-2 sm:h-7 sm:w-7 sm:rounded-lg"
                                                    aria-label="Add to cart"
                                                >
                                                    <span className="text-base leading-none font-bold sm:text-lg">+</span>
                                                </button>
                                            </div>

                                            <div className="mt-0.5 flex min-h-18 flex-col sm:mt-1 sm:min-h-20">
                                                <div className="flex items-center gap-0.5 sm:gap-1">
                                                    <span className="inline-flex rounded-md bg-green-600 px-1 py-0.5 text-[10px] leading-none font-bold text-white sm:px-1.5 sm:text-[11px]">
                                                        ₹{mainPrice}
                                                    </span>
                                                    <span className="text-[9px] font-medium text-gray-600 sm:text-[10px]">/ {weightLabel}</span>
                                                    {hasDiscount && (
                                                        <span className="text-[10px] font-medium text-gray-400 line-through sm:text-[11px]">
                                                            ₹{comparePrice}
                                                        </span>
                                                    )}
                                                </div>

                                                {hasDiscount && savings > 0 && (
                                                    <p className="mt-0.5 text-[9px] font-semibold text-green-700 sm:text-[10px]">₹{savings} OFF</p>
                                                )}

                                                <Link
                                                    href={productRoute(product.slug)}
                                                    className="mt-0.5 line-clamp-1 text-[10px] leading-tight font-semibold text-gray-900 transition-colors hover:text-(--theme-primary-1) sm:text-xs"
                                                >
                                                    {product.name}
                                                </Link>

                                                <p className="mt-0.5 line-clamp-1 text-[8px] text-gray-500 sm:text-[10px]">
                                                    {product.short_description || 'Fresh daily quality.'}
                                                </p>

                                                <Link
                                                    href={productRoute(product.slug)}
                                                    className="mt-1 w-full rounded-md bg-blue-100 px-1 py-0.5 text-center text-[9px] font-semibold text-blue-700 sm:px-2 sm:py-1 sm:text-[11px]"
                                                >
                                                    See options
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
                                    <Package className="mx-auto h-12 w-12 text-gray-300" strokeWidth={1.5} />
                                    <p className="mt-3 text-sm font-medium text-gray-600">No products in this category</p>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory('all')}
                                        className="mt-3 text-sm font-medium text-(--theme-primary-1) hover:underline"
                                    >
                                        View all products
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
