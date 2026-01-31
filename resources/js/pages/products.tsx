import { Head, Link } from '@inertiajs/react';
import { Heart, LayoutGrid, ChevronDown, Package } from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/layouts/UserLayout';
import ProductCardMedia, { getMediaList, type MediaItem } from '@/components/user/ProductCardMedia';

const CATEGORIES = [
    { slug: 'all', label: 'All Products', image: '/images/dairy-products.png' },
    { slug: 'cow-ghee', label: 'Cow Ghee', image: '/images/categories/Ghee.png' },
    { slug: 'fresh-curd', label: 'Fresh Curd', image: '/images/categories/Fresh%20Curd.png' },
    { slug: 'paneer', label: 'Paneer', image: '/images/categories/panneer.png' },
    { slug: 'spiced-butter-milk', label: 'Spiced Butter Milk', image: '/images/categories/butter%20milk.png' },
    { slug: 'country-butter', label: 'Country Butter', image: '/images/categories/butter.png' },
    { slug: 'subscriptions', label: 'Subscriptions', image: '/images/dairy-products.png' },
] as const;

type CategorySlug = (typeof CATEGORIES)[number]['slug'];

interface Product {
    id: string;
    name: string;
    variant: string;
    price: string;
    image: string;
    media?: MediaItem[];
    isPlan: boolean;
    bestSeller?: boolean;
    category: CategorySlug;
}

const PRODUCTS: Product[] = [
    { id: 'ghee-100', name: 'Cow Ghee', variant: '100g', price: '₹150', image: '/demo/Ghee.png', isPlan: false, category: 'cow-ghee' },
    { id: 'ghee-200', name: 'Cow Ghee', variant: '200g', price: '₹375', image: '/demo/Ghee.png', isPlan: false, category: 'cow-ghee' },
    { id: 'ghee-500', name: 'Cow Ghee', variant: '500g', price: '₹750', image: '/demo/Ghee.png', media: [{ type: 'image', url: '/demo/Ghee.png' }, { type: 'image', url: '/images/dairy-products.png' }], isPlan: false, bestSeller: true, category: 'cow-ghee' },
    { id: 'ghee-1l', name: 'Cow Ghee', variant: '1L', price: '₹1,500', image: '/demo/Ghee.png', isPlan: false, category: 'cow-ghee' },
    { id: 'curd-1l', name: 'Fresh Curd', variant: '1L', price: '₹80', image: '/demo/Fresh Curd.png', isPlan: false, bestSeller: true, category: 'fresh-curd' },
    { id: 'curd-500', name: 'Fresh Curd', variant: '500g', price: '₹40', image: '/demo/Fresh Curd.png', isPlan: false, category: 'fresh-curd' },
    { id: 'paneer-200', name: 'Paneer', variant: '200g', price: '₹120', image: '/demo/panneer.png', isPlan: false, bestSeller: true, category: 'paneer' },
    { id: 'bm-200', name: 'Spiced Butter Milk', variant: '200ML', price: '₹15', image: '/demo/butter milk.png', isPlan: false, category: 'spiced-butter-milk' },
    { id: 'butter-250', name: 'Country Butter', variant: '250g', price: '₹250', image: '/demo/butter.png', isPlan: false, bestSeller: true, category: 'country-butter' },
    { id: 'butter-100', name: 'Country Butter', variant: '100g', price: '₹100', image: '/demo/butter.png', isPlan: false, category: 'country-butter' },
    { id: 'butter-500', name: 'Country Butter', variant: '500g', price: '₹500', image: '/demo/butter.png', isPlan: false, category: 'country-butter' },
    { id: 'butter-1kg', name: 'Country Butter', variant: '1kg', price: '₹1,000', image: '/demo/butter.png', isPlan: false, category: 'country-butter' },
    { id: 'plan-90', name: '90-Packs Plan', variant: 'Starts from ₹40/ Unit', price: '', image: '/images/dairy-products.png', isPlan: true, category: 'subscriptions' },
    { id: 'plan-30', name: '30-Packs Plan', variant: 'Starts from ₹41/ Unit', price: '', image: '/images/dairy-products.png', isPlan: true, bestSeller: true, category: 'subscriptions' },
    { id: 'plan-15', name: '15-Pack Plan', variant: 'Starts from ₹42/ Unit', price: '', image: '/images/dairy-products.png', isPlan: true, category: 'subscriptions' },
    { id: 'plan-welcome', name: 'Welcome Offer Plan', variant: '₹39/ Unit', price: '', image: '/images/dairy-products.png', isPlan: true, category: 'subscriptions' },
];

function getCategoryCount(slug: CategorySlug): number {
    if (slug === 'all') return PRODUCTS.length;
    return PRODUCTS.filter((p) => p.category === slug).length;
}

const CATEGORIES_WITH_COUNT = CATEGORIES.map((c) => ({
    ...c,
    count: getCategoryCount(c.slug),
}));

export default function Products() {
    const [selectedCategory, setSelectedCategory] = useState<CategorySlug>('all');
    const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
    const [cardMediaIndex, setCardMediaIndex] = useState<Record<string, number>>({});
    const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

    const setCardMediaIndexForKey = (key: string, index: number) => {
        setCardMediaIndex((prev) => ({ ...prev, [key]: index }));
    };

    const filteredProducts =
        selectedCategory === 'all'
            ? PRODUCTS
            : PRODUCTS.filter((p) => p.category === selectedCategory);

    const toggleWishlist = (id: string) => {
        setWishlistedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const currentCategoryLabel = CATEGORIES_WITH_COUNT.find((c) => c.slug === selectedCategory)?.label ?? 'All Products';

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
                                    {CATEGORIES_WITH_COUNT.map((cat) => (
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
                                                    src={cat.image}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </span>
                                            <span className="min-w-0 flex-1 truncate">{cat.label}</span>
                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    selectedCategory === cat.slug
                                                        ? 'bg-[var(--theme-primary-1)]/20 text-[var(--theme-primary-1)]'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {cat.count}
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
                                                src={CATEGORIES_WITH_COUNT.find((c) => c.slug === selectedCategory)?.image ?? '/images/dairy-products.png'}
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
                                        {CATEGORIES_WITH_COUNT.map((cat) => (
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
                                                    <img src={cat.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                                                </span>
                                                <span className="min-w-0 flex-1 truncate">{cat.label}</span>
                                                <span className="shrink-0 text-xs text-gray-500">({cat.count})</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product grid – compact cards */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredProducts.map((product) => {
                                    const isWishlisted = wishlistedIds.has(product.id);
                                    return (
                                        <article
                                            key={product.id}
                                            className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-[var(--theme-primary-1)]/40 hover:shadow-md"
                                            role="listitem"
                                        >
                                            <div className="relative aspect-square w-full overflow-hidden bg-[var(--theme-secondary)]/10 sm:aspect-[4/3]">
                                                <ProductCardMedia
                                                    media={getMediaList(product)}
                                                    alt={`${product.name} ${product.variant}`}
                                                    productKey={product.id}
                                                    currentIndexMap={cardMediaIndex}
                                                    onIndexChange={setCardMediaIndexForKey}
                                                    className="h-full w-full"
                                                    imageClassName="group-hover:scale-105"
                                                />
                                                {product.bestSeller && (
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
                                                <Link href={`/products/${product.id}`} className="mb-0.5 line-clamp-2 text-xs font-bold text-gray-800 transition-colors hover:text-[var(--theme-primary-1)] sm:text-sm">
                                                    {product.name} {!product.isPlan && `- (${product.variant})`}
                                                </Link>
                                                {product.isPlan ? (
                                                    <p className="mb-1 text-[10px] font-medium text-gray-600 sm:text-xs">
                                                        {product.variant}
                                                    </p>
                                                ) : (
                                                    <p className="mb-1 text-xs font-semibold text-[var(--theme-primary-1)] sm:text-sm">
                                                        {product.price}/ Unit
                                                    </p>
                                                )}
                                                <Link
                                                    href={product.isPlan ? `/subscription?plan=${encodeURIComponent(product.id)}` : '#'}
                                                    className="mt-auto w-full rounded-md bg-[var(--theme-primary-1)] py-2 text-center text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:py-2 sm:text-xs"
                                                >
                                                    {product.isPlan ? 'Subscribe' : 'Add'}
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
