import { Head, Link } from '@inertiajs/react';
import { Heart, Star, ChevronDown, ChevronRight, Clock, Tag, ShoppingBag, CheckCircle2, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import ProductCardMedia, { getMediaList, type MediaItem } from '@/components/user/ProductCardMedia';
import UserLayout from '@/layouts/UserLayout';

interface ProductVariant {
    unit: string;
    price: string;
    mrp?: string;
}

interface ProductDetail {
    id: string;
    name: string;
    category: string;
    categoryLabel: string;
    image: string;
    media: MediaItem[];
    variants: ProductVariant[];
    shortDescription: string;
    description: string;
    highlights: string[];
    details: { label: string; value: string }[];
    rating: number;
    ratingCount: number;
    isPlan: boolean;
    bestSeller?: boolean;
}

interface Review {
    id: string;
    name: string;
    rating: number;
    date: string;
    text: string;
    verified?: boolean;
    helpfulCount?: number;
}

interface SimilarProduct {
    id: string;
    name: string;
    variant: string;
    price: string;
    image: string;
    media?: MediaItem[];
    isPlan: boolean;
    bestSeller?: boolean;
}

const MOCK_PRODUCTS: Record<string, ProductDetail> = {
    'ghee-500': {
        id: 'ghee-500',
        name: 'Cow Ghee',
        category: 'cow-ghee',
        categoryLabel: 'Cow Ghee',
        image: '/demo/Ghee.png',
        media: [
            { type: 'image', url: '/demo/Ghee.png' },
            { type: 'image', url: '/images/dairy-products.png' },
        ],
        variants: [
            { unit: '100g', price: '₹150', mrp: '₹165' },
            { unit: '200g', price: '₹375', mrp: '₹410' },
            { unit: '500g', price: '₹750', mrp: '₹799' },
            { unit: '1L', price: '₹1,500', mrp: '₹1,599' },
        ],
        shortDescription: 'Pure cow ghee from Kerala farms. Traditional bilona process, no additives.',
        description: 'Pure cow ghee sourced from local Kerala farms. Traditional bilona process, no additives. Perfect for cooking and wellness. Packed in food-grade jars to retain freshness.',
        highlights: [
            'Sourced from local Kerala farms',
            'Traditional bilona process',
            'No additives or preservatives',
            '6 months shelf life (refrigerate after opening)',
            'Food-grade packaging',
        ],
        details: [
            { label: 'Fat profile', value: 'Pure cow ghee' },
            { label: 'Shelf life', value: '6 months (refrigerate after opening)' },
            { label: 'Storage', value: 'Cool, dry place' },
        ],
        rating: 4.5,
        ratingCount: 128,
        isPlan: false,
        bestSeller: true,
    },
    'curd-1l': {
        id: 'curd-1l',
        name: 'Fresh Curd',
        category: 'fresh-curd',
        categoryLabel: 'Fresh Curd',
        image: '/demo/Fresh Curd.png',
        media: [{ type: 'image', url: '/demo/Fresh Curd.png' }],
        variants: [
            { unit: '500g', price: '₹40', mrp: '₹45' },
            { unit: '1L', price: '₹80', mrp: '₹90' },
        ],
        shortDescription: 'Fresh set curd delivered daily. No preservatives, probiotic-rich.',
        description: 'Fresh, set curd delivered daily. No preservatives, probiotic-rich. Ideal for breakfast and cooking. Made from fresh milk.',
        highlights: [
            'Delivered fresh every morning',
            'No preservatives',
            'Probiotic-rich',
            '3–4 days shelf life (refrigerated)',
        ],
        details: [
            { label: 'Type', value: 'Set curd' },
            { label: 'Shelf life', value: '3–4 days (refrigerated)' },
        ],
        rating: 4.7,
        ratingCount: 94,
        isPlan: false,
        bestSeller: true,
    },
};

const DEFAULT_PRODUCT: ProductDetail = {
    id: 'default',
    name: 'Cow Ghee',
    category: 'cow-ghee',
    categoryLabel: 'Cow Ghee',
    image: '/demo/Ghee.png',
    media: [{ type: 'image', url: '/demo/Ghee.png' }],
    variants: [{ unit: '500g', price: '₹750', mrp: '₹799' }],
    shortDescription: 'Fresh dairy from Kerala farms.',
    description: 'Fresh dairy from Kerala farms. Delivered to your doorstep.',
    highlights: ['Fresh daily', 'No preservatives'],
    details: [{ label: 'Fat profile', value: 'Pure' }],
    rating: 4.5,
    ratingCount: 0,
    isPlan: false,
};

const MOCK_REVIEWS: Review[] = [
    { id: '1', name: 'Priya M.', rating: 5, date: '2 days ago', text: 'Best ghee we have used. Fresh and aromatic. Delivery always on time.', verified: true, helpfulCount: 12 },
    { id: '2', name: 'Rajesh K.', rating: 5, date: '1 week ago', text: 'Quality is unmatched. My family prefers this over store-bought.', verified: true, helpfulCount: 8 },
    { id: '3', name: 'Anitha S.', rating: 4, date: '2 weeks ago', text: 'Good product. Would order again. Packaging could be sturdier.', verified: false, helpfulCount: 3 },
    { id: '4', name: 'Suresh P.', rating: 5, date: '3 days ago', text: 'Morning delivery is a game-changer. Curd is always fresh.', verified: true, helpfulCount: 5 },
    { id: '5', name: 'Deepa R.', rating: 4, date: '5 days ago', text: 'Consistent quality. Subscribed for monthly delivery.', verified: true, helpfulCount: 2 },
];

const SIMILAR_PRODUCTS: SimilarProduct[] = [
    { id: 'ghee-100', name: 'Cow Ghee', variant: '100g', price: '₹150', image: '/demo/Ghee.png', isPlan: false },
    { id: 'ghee-200', name: 'Cow Ghee', variant: '200g', price: '₹375', image: '/demo/Ghee.png', isPlan: false },
    { id: 'ghee-1l', name: 'Cow Ghee', variant: '1L', price: '₹1,500', image: '/demo/Ghee.png', isPlan: false },
    { id: 'curd-1l', name: 'Fresh Curd', variant: '1L', price: '₹80', image: '/demo/Fresh Curd.png', isPlan: false },
    { id: 'butter-250', name: 'Country Butter', variant: '250g', price: '₹250', image: '/demo/butter.png', media: [{ type: 'image', url: '/demo/butter.png' }, { type: 'image', url: '/images/dairy-products.png' }], isPlan: false },
];

const WHY_SHOP = [
    { icon: Clock, title: 'Morning delivery', text: 'Fresh at your doorstep before 7 AM, every day.' },
    { icon: Tag, title: 'Best prices', text: 'Direct from farm. No middlemen, no markups.' },
    { icon: ShoppingBag, title: 'Wide range', text: 'Milk, curd, ghee, butter, and more.' },
];

interface ProductDetailPageProps {
    id: string;
}

export default function ProductDetail({ id }: ProductDetailPageProps) {
    const product = MOCK_PRODUCTS[id] ?? { ...DEFAULT_PRODUCT, id };
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [mediaIndex, setMediaIndex] = useState(0);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [similarWishlistedIds, setSimilarWishlistedIds] = useState<Set<string>>(new Set());
    const [similarCardMediaIndex, setSimilarCardMediaIndex] = useState<Record<string, number>>({});

    const variant = product.variants[selectedVariantIndex];

    const toggleSimilarWishlist = (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSimilarWishlistedIds((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });
    };
    const setSimilarCardMediaIndexForKey = (key: string, index: number) => {
        setSimilarCardMediaIndex((prev) => ({ ...prev, [key]: index }));
    };
    const similar = SIMILAR_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

    return (
        <UserLayout>
            <Head title={`${product.name} - Freshtick`} />
            <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-24">
                <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
                    {/* Breadcrumbs – mobile first */}
                    <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500 sm:mb-6 sm:text-sm" aria-label="Breadcrumb">
                        <Link href="/" className="transition-colors hover:text-[var(--theme-primary-1)]">Home</Link>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                        <Link href="/products" className="transition-colors hover:text-[var(--theme-primary-1)]">Products</Link>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                        <span className="truncate font-medium text-gray-900">{product.name}</span>
                    </nav>

                    {/* 1. Product info – stack on mobile; on lg: media | info */}
                    <section className="mb-10 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:mb-12 sm:p-6 lg:mb-10 lg:grid lg:grid-cols-9 lg:gap-6 lg:p-8">
                        {/* Media – top on mobile, col 1 on lg; tall image, clean layout */}
                        <div className="mb-6 lg:col-span-5 lg:mb-0">
                            <div className="relative aspect-[3/4] w-full min-h-[380px] overflow-hidden rounded-xl bg-[var(--theme-secondary)]/10 sm:min-h-[480px] lg:min-h-[560px]">
                                {product.media[mediaIndex].type === 'image' ? (
                                    <img
                                        src={product.media[mediaIndex].url}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                        loading="eager"
                                    />
                                ) : (
                                    <video
                                        src={product.media[mediaIndex].url}
                                        className="h-full w-full object-cover"
                                        muted
                                        loop
                                        playsInline
                                        autoPlay
                                    />
                                )}
                                {product.bestSeller && (
                                    <span className="absolute left-2 top-2 rounded-full bg-[#cf992c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
                                        Best Seller
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setWishlisted((b) => !b)}
                                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                    className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
                                >
                                    <Heart className={`h-4 w-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} strokeWidth={2} />
                                </button>
                            </div>
                            {/* Thumbnail strip */}
                            {product.media.length > 1 && (
                                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                                    {product.media.map((item, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setMediaIndex(i)}
                                            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-16 sm:w-16 ${
                                                i === mediaIndex ? 'border-[var(--theme-primary-1)]' : 'border-transparent bg-gray-100'
                                            }`}
                                        >
                                            {item.type === 'image' ? (
                                                <img src={item.url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <video src={item.url} className="h-full w-full object-cover" muted playsInline />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info – below on mobile, col 2 on lg */}
                        <div className="lg:col-span-4 lg:min-w-0">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                                {product.name}
                            </h1>

                            {/* Rating strip */}
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">
                                    <Star className="h-4 w-4 fill-amber-500" strokeWidth={0} />
                                    <span className="font-semibold">{product.rating}</span>
                                </span>
                                <span className="text-gray-500">({product.ratingCount} ratings)</span>
                            </div>

                            {/* Short description */}
                            <p className="mt-2 text-sm text-gray-600">{product.shortDescription}</p>

                            {!product.isPlan && product.variants.length > 0 && (
                                <>
                                    {/* Price: strikethrough MRP + selling price + discount */}
                                    <div className="mt-3 flex flex-wrap items-baseline gap-2">
                                        {variant.mrp && (
                                            <span className="text-sm text-gray-400 line-through">{variant.mrp}</span>
                                        )}
                                        <span className="text-xl font-bold text-[var(--theme-primary-1)] sm:text-2xl">{variant.price}</span>
                                        {variant.mrp && (() => {
                                            const mrpNum = parseInt(variant.mrp.replace(/[^\d]/g, ''), 10);
                                            const priceNum = parseInt(variant.price.replace(/[^\d]/g, ''), 10);
                                            const pct = mrpNum > 0 ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
                                            return pct > 0 ? <span className="text-xs font-semibold text-green-600">{pct}% off</span> : null;
                                        })()}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>

                                    <p className="mt-3 text-sm font-medium text-gray-600">Select unit</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.variants.map((v, i) => (
                                            <button
                                                key={v.unit}
                                                type="button"
                                                onClick={() => setSelectedVariantIndex(i)}
                                                className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors ${
                                                    i === selectedVariantIndex
                                                        ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/10 text-[var(--theme-primary-1)]'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {v.unit} — {v.price}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <Link
                                    href="#"
                                    className="w-full rounded-xl bg-[var(--theme-primary-1)] px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:w-auto sm:flex-1 sm:max-w-xs"
                                >
                                    Add to cart
                                </Link>
                                {product.isPlan && (
                                    <Link
                                        href="/#subscriptions"
                                        className="w-full rounded-xl border-2 border-[var(--theme-primary-1)] bg-white px-4 py-3.5 text-center text-sm font-semibold text-[var(--theme-primary-1)] transition-colors hover:bg-[var(--theme-primary-1)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:w-auto sm:flex-1 sm:max-w-xs"
                                    >
                                        Subscribe
                                    </Link>
                                )}
                            </div>

                            {/* Highlights */}
                            {product.highlights.length > 0 && (
                                <div className="mt-5 border-t border-gray-100 pt-4">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Highlights</h3>
                                    <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                                        {product.highlights.map((h) => (
                                            <li key={h} className="flex items-start gap-2">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--theme-primary-1)]" />
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Product details – expandable */}
                            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50">
                                <button
                                    type="button"
                                    onClick={() => setDetailsOpen((b) => !b)}
                                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                    Product details
                                    <ChevronDown className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                                </button>
                                {detailsOpen && (
                                    <div className="border-t border-gray-200 px-4 py-3">
                                        <p className="mb-3 text-sm text-gray-600">{product.description}</p>
                                        <dl className="space-y-2">
                                            {product.details.map((d) => (
                                                <div key={d.label} className="flex justify-between gap-4 text-sm">
                                                    <dt className="font-medium text-gray-600">{d.label}</dt>
                                                    <dd className="text-gray-900">{d.value}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                )}
                            </div>

                            {/* Why shop from Freshtick */}
                            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                                <h2 className="mb-3 text-sm font-semibold text-gray-900">Why shop from Freshtick?</h2>
                                <ul className="space-y-3">
                                    {WHY_SHOP.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={item.title} className="flex gap-3">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-primary-1)]/10 text-[var(--theme-primary-1)]">
                                                    <Icon className="h-4 w-4" strokeWidth={2} />
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                                    <p className="text-xs text-gray-600 sm:text-sm">{item.text}</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 2. Customer reviews – full width below product details */}
                    <section className="mb-10 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:mb-12 sm:p-6 lg:mb-14 lg:p-8" aria-labelledby="reviews-heading">
                        <h2 id="reviews-heading" className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">
                            Customer reviews
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-4">
                            {MOCK_REVIEWS.map((review) => (
                                <article key={review.id} className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 sm:p-4">
                                    <div className="flex gap-2.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary-1)]/15 text-xs font-semibold text-[var(--theme-primary-1)]">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="text-xs font-semibold text-gray-900">{review.name}</span>
                                                {review.verified && (
                                                    <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600" title="Verified purchase">
                                                        <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-gray-500 sm:text-xs">
                                                <span className="flex items-center gap-0.5 text-amber-500" aria-label={`${review.rating} stars`}>
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <Star key={i} className={`h-3 w-3 ${i <= review.rating ? 'fill-amber-500' : 'fill-gray-200'}`} strokeWidth={0} />
                                                    ))}
                                                </span>
                                                <span>{review.date}</span>
                                            </div>
                                            <p className="mt-1.5 line-clamp-2 text-xs text-gray-700 sm:line-clamp-3">{review.text}</p>
                                            {review.helpfulCount !== undefined && review.helpfulCount > 0 && (
                                                <button type="button" className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-700 sm:text-xs">
                                                    <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                                                    Helpful ({review.helpfulCount})
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* 3. Similar products – same cards as products / home */}
                    <section className="mb-8" aria-labelledby="similar-heading">
                        <h2 id="similar-heading" className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">
                            Similar products
                        </h2>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {similar.map((p) => {
                                const isWishlisted = similarWishlistedIds.has(p.id);
                                return (
                                    <article
                                        key={p.id}
                                        className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-[var(--theme-primary-1)]/40 hover:shadow-md"
                                        role="listitem"
                                    >
                                        <div className="relative aspect-square w-full overflow-hidden bg-[var(--theme-secondary)]/10 sm:aspect-[4/3]">
                                            <ProductCardMedia
                                                media={getMediaList(p)}
                                                alt={`${p.name} ${p.variant}`}
                                                productKey={p.id}
                                                currentIndexMap={similarCardMediaIndex}
                                                onIndexChange={setSimilarCardMediaIndexForKey}
                                                className="h-full w-full"
                                                imageClassName="group-hover:scale-105"
                                            />
                                            {p.bestSeller && (
                                                <span className="absolute left-1 top-1 rounded-full bg-[#cf992c] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white sm:left-1.5 sm:top-1.5 sm:px-2 sm:text-[10px]">
                                                    Best Seller
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => toggleSimilarWishlist(e, p.id)}
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
                                            <Link
                                                href={`/products/${p.id}`}
                                                className="mb-0.5 line-clamp-2 text-xs font-bold text-gray-800 transition-colors hover:text-[var(--theme-primary-1)] sm:text-sm"
                                            >
                                                {p.name} {!p.isPlan && `- (${p.variant})`}
                                            </Link>
                                            {p.isPlan ? (
                                                <p className="mb-1 text-[10px] font-medium text-gray-600 sm:text-xs">
                                                    {p.variant}
                                                </p>
                                            ) : (
                                                <p className="mb-1 text-xs font-semibold text-[var(--theme-primary-1)] sm:text-sm">
                                                    {p.price}/ Unit
                                                </p>
                                            )}
                                            <Link
                                                href={p.isPlan ? '/#subscriptions' : '#'}
                                                className="mt-auto w-full rounded-md bg-[var(--theme-primary-1)] py-2 text-center text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:py-2 sm:text-xs"
                                            >
                                                {p.isPlan ? 'Subscribe' : 'Add'}
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </UserLayout>
    );
}
