import { Head, Link, usePage } from '@inertiajs/react';
import { Heart, ChevronDown, Package } from 'lucide-react';
import { useState } from 'react';
import ProductCardMedia, { getMediaList } from '@/components/user/ProductCardMedia';
import UserLayout from '@/layouts/UserLayout';
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
    unit: string;
    weight: string;
    price: string | number;
    image: string | null;
    images: string[] | null;
    category?: { slug: string };
    is_subscription_eligible: boolean;
    cost_price?: string | number; // maybe used to show a fake best seller tag
}

interface PageProps extends SharedData {
    categories: BackendCategory[];
    products: BackendProduct[];
    vertical: string;
    zone: any;
}

export default function Products() {
    const { categories, products } = usePage<PageProps>().props;

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());
    const [cardMediaIndex, setCardMediaIndex] = useState<Record<string, number>>({});
    const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

    const setCardMediaIndexForKey = (key: string, index: number) => {
        setCardMediaIndex((prev) => ({ ...prev, [key]: index }));
    };

    const toggleWishlist = (id: number) => {
        setWishlistedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
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
            image: '/images/dairy-products.png',
            products_count: allProductsCount,
        },
        ...validCategories.map(c => {
            let safeImage = '/images/dairy-products.png';
            if (c.image) {
                if (c.image.startsWith('http') || c.image.startsWith('/')) safeImage = c.image;
                else safeImage = `/storage/${c.image}`;
            }
            return {
                ...c,
                image: safeImage
            };
        })
    ];

    const currentCategoryLabel = categoriesWithCount.find((c) => c.slug === selectedCategory)?.name ?? 'All Products';

    const safeProducts = Array.isArray(products) ? products : [];
    const filteredProducts =
        selectedCategory === 'all'
            ? safeProducts
            : safeProducts.filter((p) => p.category?.slug === selectedCategory);

    return (
        <UserLayout>
            <Head title="Products - Freshtick" />
            {/* Spacer so fixed header + top banner don’t overlap content */}
            <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-24 lg:pt-24">
                <div className="container mx-auto max-w-7xl px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
                    {/* Page title */}
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                            Products
                        </h1>
                        <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                            Fresh dairy delivered to your doorstep
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                        {/* Sidebar – desktop */}
                        <aside
                            className="hidden shrink-0 lg:block lg:w-64"
                            aria-label="Product categories"
                        >
                            <div className="sticky top-24 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
                                <h2 className="mb-4 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Categories
                                </h2>
                                <nav className="flex flex-col gap-1">
                                    {categoriesWithCount.map((cat) => (
                                        <button
                                            key={cat.slug}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat.slug)}
                                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors ${
                                                selectedCategory === cat.slug
                                                    ? 'bg-[var(--theme-primary-1)]/10 text-[var(--theme-primary-1)]'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--theme-primary-1)]'
                                            }`}
                                        >
                                            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200/80 bg-gray-50">
                                                <img
                                                    src={cat.image || '/images/dairy-products.png'}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </span>
                                            <span className="min-w-0 flex-1 truncate">{cat.name}</span>
                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    selectedCategory === cat.slug
                                                        ? 'bg-[var(--theme-primary-1)]/20 text-[var(--theme-primary-1)]'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {cat.products_count}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main content */}
                        <div className="min-w-0 flex-1">
                            {/* Mobile category filter */}
                            <div className="mb-4 lg:hidden">
                                <button
                                    type="button"
                                    onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm"
                                    aria-expanded={mobileCategoryOpen}
                                    aria-haspopup="listbox"
                                    aria-label="Select category"
                                >
                                    <span className="flex min-w-0 flex-1 items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                            <img
                                                src={categoriesWithCount.find((c) => c.slug === selectedCategory)?.image ?? '/images/dairy-products.png'}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </span>
                                        <span className="truncate">{currentCategoryLabel}</span>
                                    </span>
                                    <ChevronDown
                                        className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${mobileCategoryOpen ? 'rotate-180' : ''}`}
                                        strokeWidth={2}
                                    />
                                </button>
                                {mobileCategoryOpen && (
                                    <div
                                        className="mt-2 rounded-xl border border-gray-200 bg-white py-2 shadow-lg"
                                        role="listbox"
                                    >
                                        {categoriesWithCount.map((cat) => (
                                            <button
                                                key={cat.slug}
                                                type="button"
                                                role="option"
                                                aria-selected={selectedCategory === cat.slug}
                                                onClick={() => {
                                                    setSelectedCategory(cat.slug);
                                                    setMobileCategoryOpen(false);
                                                }}
                                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${
                                                    selectedCategory === cat.slug
                                                        ? 'bg-[var(--theme-primary-1)]/10 font-medium text-[var(--theme-primary-1)]'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                                    <img src={cat.image || '/images/dairy-products.png'} alt="" className="h-full w-full object-cover" loading="lazy" />
                                                </span>
                                                <span className="min-w-0 flex-1 truncate">{cat.name}</span>
                                                <span className="shrink-0 text-xs text-gray-500">({cat.products_count})</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product grid – compact cards */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredProducts.map((product) => {
                                    const isWishlisted = wishlistedIds.has(product.id);
                                    
                                    const getSafeUrl = (url: string | null | undefined) => {
                                        if (!url) return '';
                                        if (url.startsWith('http') || url.startsWith('/')) return url;
                                        return `/storage/${url}`;
                                    };

                                    const safeImage = getSafeUrl(product.image) || '/images/dairy-products.png';
                                    const safeImages = (product.images || []).map(url => ({ type: 'image' as const, url: getSafeUrl(url) }));
                                    
                                    const media = getMediaList({
                                        id: product.id.toString(),
                                        image: safeImage,
                                        media: safeImages.length > 0 ? safeImages : undefined
                                    });

                                    const isBestSeller = (typeof product.price === 'number' ? product.price > 100 : parseFloat(product.price as string) > 100);
                                    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
                                    const mainPrice = hasVariants 
                                        ? Math.min(...product.variants!.map(v => parseFloat(v.price || '0'))) 
                                        : parseFloat(product.price as string || '0');

                                    return (
                                        <article
                                            key={product.id}
                                            className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-[var(--theme-primary-1)]/40 hover:shadow-md"
                                            role="listitem"
                                        >
                                            <div className="relative aspect-square w-full overflow-hidden bg-[var(--theme-secondary)]/10 sm:aspect-[4/3]">
                                                <ProductCardMedia
                                                    media={media}
                                                    alt={product.name}
                                                    productKey={product.id.toString()}
                                                    currentIndexMap={cardMediaIndex}
                                                    onIndexChange={setCardMediaIndexForKey}
                                                    className="h-full w-full"
                                                    imageClassName="group-hover:scale-105"
                                                />
                                                {isBestSeller && (
                                                    <span className="absolute left-1 top-1 rounded-full bg-[#cf992c] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white sm:left-1.5 sm:top-1.5 sm:px-2 sm:text-[10px]">
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
                                                    className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white sm:right-1.5 sm:top-1.5 sm:h-7 sm:w-7"
                                                >
                                                    <Heart
                                                        className={`h-3 w-3 sm:h-4 sm:w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                                                        strokeWidth={2}
                                                    />
                                                </button>
                                            </div>
                                            <div className="flex flex-1 flex-col p-2 sm:p-2.5">
                                                <Link href={`/products/${product.slug}`} className="mb-0.5 line-clamp-2 text-xs font-bold text-gray-800 transition-colors hover:text-[var(--theme-primary-1)] sm:text-sm">
                                                    {product.name} {(!product.is_subscription_eligible && !hasVariants && product.weight) && `- (${parseFloat(product.weight)} ${product.unit})`}
                                                </Link>
                                                {product.is_subscription_eligible || hasVariants ? (
                                                    <p className="mb-1 text-[10px] font-medium text-gray-600 sm:text-xs">
                                                        Starts from ₹{mainPrice}/ Unit
                                                    </p>
                                                ) : (
                                                    <p className="mb-1 text-xs font-semibold text-[var(--theme-primary-1)] sm:text-sm">
                                                        ₹{mainPrice}/ Unit
                                                    </p>
                                                )}
                                                <Link
                                                    href={product.is_subscription_eligible ? `/subscription?plan=${encodeURIComponent(product.slug)}` : `/products/${product.slug}`}
                                                    className="mt-auto w-full rounded-md bg-[var(--theme-primary-1)] py-2 text-center text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:py-2 sm:text-xs"
                                                >
                                                    {product.is_subscription_eligible ? 'Subscribe' : 'View Details'}
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
                                        className="mt-3 text-sm font-medium text-[var(--theme-primary-1)] hover:underline"
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
