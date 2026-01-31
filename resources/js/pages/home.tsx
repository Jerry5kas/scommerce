import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ExternalLink, Heart, MapPin, MapPinned, Mail, Phone, Play, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import UserLayout from '@/layouts/UserLayout';
import ProductCardMedia, { getMediaList } from '@/components/user/ProductCardMedia';

interface CarouselSlide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
}

const PRODUCTS: Array<{
    name: string;
    variant: string;
    price: string;
    image: string;
    media?: { type: 'image'; url: string }[] | { type: 'video'; url: string }[];
    isPlan: boolean;
    bestSeller?: boolean;
}> = [
    { name: 'Cow Ghee', variant: '100g', price: '₹150', image: '/demo/Ghee.png', isPlan: false },
    { name: 'Cow Ghee', variant: '200g', price: '₹375', image: '/demo/Ghee.png', isPlan: false },
    { name: 'Cow Ghee', variant: '500g', price: '₹750', image: '/demo/Ghee.png', media: [{ type: 'image', url: '/demo/Ghee.png' }, { type: 'image', url: '/images/dairy-products.png' }], isPlan: false, bestSeller: true },
    { name: 'Cow Ghee', variant: '1L', price: '₹1,500', image: '/demo/Ghee.png', isPlan: false },
    { name: 'Fresh Curd', variant: '1L', price: '₹80', image: '/demo/Fresh Curd.png', isPlan: false, bestSeller: true },
    { name: 'Fresh Curd', variant: '500g', price: '₹40', image: '/demo/Fresh Curd.png', isPlan: false },
    { name: 'Paneer', variant: '200g', price: '₹120', image: '/demo/panneer.png', isPlan: false, bestSeller: true },
    { name: 'Spiced Butter Milk', variant: '200ML', price: '₹15', image: '/demo/butter milk.png', isPlan: false },
    { name: 'Country Butter', variant: '250g', price: '₹250', image: '/demo/butter.png', isPlan: false, bestSeller: true },
    { name: 'Country Butter', variant: '100g', price: '₹100', image: '/demo/butter.png', isPlan: false },
    { name: 'Country Butter', variant: '500g', price: '₹500', image: '/demo/butter.png', isPlan: false },
    { name: 'Country Butter', variant: '1kg', price: '₹1,000', image: '/demo/butter.png', isPlan: false },
    { name: '90-Packs Plan', variant: 'Starts from ₹40/ Unit', price: '', image: '/images/dairy-products.png', isPlan: true },
    { name: '30-Packs Plan', variant: 'Starts from ₹41/ Unit', price: '', image: '/images/dairy-products.png', isPlan: true, bestSeller: true },
    { name: '15-Pack Plan', variant: 'Starts from ₹42/ Unit', price: '', image: '/images/dairy-products.png', isPlan: true },
    { name: 'Welcome Offer Plan', variant: '₹39/ Unit', price: '', image: '/images/dairy-products.png', isPlan: true },
];

const carouselSlides: CarouselSlide[] = [
    {
        id: 1,
        title: 'FROM OUR FARM TO',
        subtitle: 'YOUR HOME, WITH LOVE.',
        description: 'Fresh, pure milk delivered daily to your doorstep.',
        image: '/demo/Fresh Curd.png',
    },
    {
        id: 2,
        title: 'FRESH DAILY',
        subtitle: 'PURE QUALITY.',
        description: 'Farm-fresh dairy products, delivered every morning.',
        image: '/demo/Ghee.png',
    },
    {
        id: 3,
        title: 'NATURALLY RICH',
        subtitle: 'NATURALLY PURE.',
        description: 'Premium quality dairy, straight from our farm.',
        image: '/demo/panneer.png',
    },
];

const SUBSCRIPTION_FEATURES = [
    'Daily Morning delivery',
    'Free delivery',
    'Pause/Resume anytime',
    'Vacation hold',
    'WhatsApp alerts',
];

const SUBSCRIPTION_PLANS = [
    {
        name: '15-Pack Plan',
        '480ml': { units: 15, total: '₹630', perUnit: '₹42/Unit(s)' },
        '1L': { units: 15, total: '₹1,260', perUnit: '₹84/Unit(s)' },
    },
    {
        name: '30-Packs Plan',
        discount: '49% OFF',
        '480ml': { units: 30, total: '₹1,230', perUnit: '₹41/Unit(s)' },
        '1L': { units: 30, total: '₹2,430', perUnit: '₹81/Unit(s)' },
    },
    {
        name: '90-Packs Plan',
        discount: '50% OFF',
        '480ml': { units: 90, total: '₹3,600', perUnit: '₹40/Unit(s)' },
        '1L': { units: 90, total: '₹7,200', perUnit: '₹80/Unit(s)' },
    },
];

const TESTIMONIALS = [
    { quote: 'Milk tastes just like village milk. Delivery is always on time.', name: 'Rashid', location: 'Malappuram', recent: '2 days ago' },
    { quote: 'Fresh curd every morning. My family loves it!', name: 'Priya', location: 'Manjeri', recent: '1 week ago' },
    { quote: 'Best ghee in town. Quality is unmatched.', name: 'Rajesh', location: 'Perinthalmanna', recent: '3 days ago' },
    { quote: 'Subscription is so convenient. Pause when we travel, resume when we’re back.', name: 'Anitha', location: 'Kozhikode', recent: '5 days ago' },
    { quote: 'Morning delivery before 7 AM—perfect for our chai.', name: 'Suresh', location: 'Palakkad', recent: 'Yesterday' },
    { quote: 'No preservatives, real taste. Kids finally drink milk without fuss.', name: 'Deepa', location: 'Thrissur', recent: '4 days ago' },
];

const STORIES = [
    { id: 1, src: '/video/stories/14214919_2160_3840_25fps.mp4', label: 'Fresh from farm', views: '2.1K' },
    { id: 2, src: '/video/stories/4764773-uhd_2160_3840_30fps.mp4', label: 'Morning delivery', views: '1.8K' },
    { id: 3, src: '/video/stories/4911096-uhd_2160_4096_25fps.mp4', label: 'Pure quality', views: '3.4K' },
    { id: 4, src: '/video/stories/4911443-uhd_2160_4096_25fps.mp4', label: 'Farm to home', views: '1.2K' },
    { id: 5, src: '/video/stories/8064134-hd_1080_1920_24fps.mp4', label: 'Daily fresh', views: '2.9K' },
] as const;

const PRODUCTS_PER_VIEW = { mobile: 2, sm: 3, md: 4, lg: 4 };
const TESTIMONIALS_PER_VIEW = { mobile: 1, sm: 2, lg: 3 };
const GAP_PX = 16; // gap-4
const TESTIMONIAL_GAP_PX = 16;

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [productIndex, setProductIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(4);
    const [stepPx, setStepPx] = useState(0);
    const [subVariant, setSubVariant] = useState<'480ml' | '1L'>('480ml');
    const [testimonialCardsPerView, setTestimonialCardsPerView] = useState(1);
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [testimonialStepPx, setTestimonialStepPx] = useState(0);
    const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);
    const [storyProgress, setStoryProgress] = useState(0);
    const [wishlistedProductIds, setWishlistedProductIds] = useState<Set<string>>(new Set());
    const [cardMediaIndex, setCardMediaIndex] = useState<Record<string, number>>({});
    const productSliderRef = useRef<HTMLDivElement>(null);

    const setCardMediaIndexForKey = (key: string, index: number) => {
        setCardMediaIndex((prev) => ({ ...prev, [key]: index }));
    };

    const toggleProductWishlist = (id: string) => {
        setWishlistedProductIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };
    const testimonialSliderRef = useRef<HTMLDivElement>(null);
    const storyVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const updateCardsPerView = () => {
            const w = window.innerWidth;
            if (w >= 1024) setCardsPerView(PRODUCTS_PER_VIEW.lg);
            else if (w >= 768) setCardsPerView(PRODUCTS_PER_VIEW.md);
            else if (w >= 640) setCardsPerView(PRODUCTS_PER_VIEW.sm);
            else setCardsPerView(PRODUCTS_PER_VIEW.mobile);
        };
        updateCardsPerView();
        window.addEventListener('resize', updateCardsPerView);
        return () => window.removeEventListener('resize', updateCardsPerView);
    }, []);

    useEffect(() => {
        const el = productSliderRef.current;
        if (!el) return;
        const updateStep = () => {
            const width = el.offsetWidth;
            setStepPx((width - (cardsPerView - 1) * GAP_PX) / cardsPerView + GAP_PX);
        };
        updateStep();
        const ro = new ResizeObserver(updateStep);
        ro.observe(el);
        return () => ro.disconnect();
    }, [cardsPerView]);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w >= 1024) setTestimonialCardsPerView(TESTIMONIALS_PER_VIEW.lg);
            else if (w >= 640) setTestimonialCardsPerView(TESTIMONIALS_PER_VIEW.sm);
            else setTestimonialCardsPerView(TESTIMONIALS_PER_VIEW.mobile);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    useEffect(() => {
        const el = testimonialSliderRef.current;
        if (!el) return;
        const updateStep = () => {
            const width = el.offsetWidth;
            setTestimonialStepPx((width - (testimonialCardsPerView - 1) * TESTIMONIAL_GAP_PX) / testimonialCardsPerView + TESTIMONIAL_GAP_PX);
        };
        updateStep();
        const ro = new ResizeObserver(updateStep);
        ro.observe(el);
        return () => ro.disconnect();
    }, [testimonialCardsPerView]);

    useEffect(() => {
        if (storyViewerIndex === null) {
            setStoryProgress(0);
            storyVideoRef.current?.pause();
            return;
        }
        const video = storyVideoRef.current;
        if (!video) return;
        setStoryProgress(0);
        video.currentTime = 0;
        video.play().catch(() => {});
        const onTimeUpdate = () => setStoryProgress(video.duration ? (100 * video.currentTime) / video.duration : 0);
        const onEnded = () => {
            if (storyViewerIndex < STORIES.length - 1) setStoryViewerIndex(storyViewerIndex + 1);
            else setStoryViewerIndex(null);
        };
        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('ended', onEnded);
        return () => {
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('ended', onEnded);
        };
    }, [storyViewerIndex]);

    const productMaxIndex = Math.max(0, PRODUCTS.length - cardsPerView);
    const canGoPrev = productIndex > 0;
    const canGoNext = productIndex < productMaxIndex;
    const goPrev = () => setProductIndex((i) => Math.max(0, i - 1));
    const goNext = () => setProductIndex((i) => Math.min(productMaxIndex, i + 1));

    const testimonialMaxIndex = Math.max(0, TESTIMONIALS.length - testimonialCardsPerView);
    const canGoPrevTestimonial = testimonialIndex > 0;
    const canGoNextTestimonial = testimonialIndex < testimonialMaxIndex;
    const goPrevTestimonial = () => setTestimonialIndex((i) => Math.max(0, i - 1));
    const goNextTestimonial = () => setTestimonialIndex((i) => Math.min(testimonialMaxIndex, i + 1));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index: number) => setCurrentSlide(index);
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

    return (
        <UserLayout>
            <Head title="FreshTick - Fresh Dairy Delivered Daily" />
            {/* Hero Carousel - bg image + black overlay (previous design), mobile responsive */}
            <section
                className="relative min-h-[min(100vh,900px)] overflow-hidden pt-[7rem] lg:h-screen lg:min-h-0 lg:pt-[7rem]"
                aria-label="Hero carousel"
            >
                    <div className="relative h-full min-h-[min(100vh,900px)] w-full lg:h-[calc(100vh-7rem)] lg:min-h-0">
                        {carouselSlides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                            >
                                {/* Background image (full bleed) */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url(${slide.image})` }}
                                    aria-hidden
                                />
                                {/* Black overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-black/90" aria-hidden />
                                {/* Subtle texture overlay */}
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                    }}
                                    aria-hidden
                                />

                                {/* Content - fills slide wrapper, vertically centered */}
                                <div className="relative z-10 flex h-full min-h-0 flex-col justify-center overflow-y-auto pt-6 pb-24 lg:pt-0 lg:pb-0 lg:overflow-visible">
                                    <div className="container mx-auto w-full flex-1 px-4 sm:px-6 lg:flex lg:flex-1 lg:items-stretch lg:min-h-0 lg:px-8">
                                        <div className="flex flex-col items-center justify-center gap-4 py-6 sm:gap-6 lg:flex-row lg:min-h-0 lg:flex-1 lg:items-stretch lg:justify-between lg:gap-8 lg:py-0">
                                            {/* Left Content - centered in column */}
                                            <div className="flex w-full flex-shrink-0 flex-col justify-center text-center lg:w-2/5 lg:text-left">
                                                {/* Branding Badge */}
                                                <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                                                    <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 backdrop-blur-sm">
                                                        <img
                                                            src="/logo_new.png"
                                                            alt="FreshTick"
                                                            className="h-3.5 w-auto sm:h-4"
                                                            loading="eager"
                                                        />
                                                        <span className="text-[10px] text-[var(--theme-primary-1)] font-semibold sm:text-xs">
                                                            Fresh Daily
                                                        </span>
                                                    </div>
                                                </div>
                                                <h1 className="mb-2 text-xl font-extrabold leading-tight text-white sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl">
                                                    {slide.title}
                                                    <br />
                                                    <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                                                        {slide.subtitle}
                                                    </span>
                                                </h1>
                                                <p className="mb-4 text-sm leading-snug text-white/90 sm:text-base md:text-lg lg:text-xl">
                                                    {slide.description}
                                                </p>
                                                <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:flex-row sm:gap-3 lg:justify-start">
                                                    <button className="group relative max-w-max overflow-hidden rounded-lg bg-white px-4 py-2 text-xs font-bold text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 sm:px-5 sm:py-2.5 sm:text-sm md:px-6 md:py-3 md:text-base">
                                                        <span className="relative z-10">Subscribe Now</span>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                    </button>
                                                    <button className="max-w-max rounded-lg border-2 border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:px-5 sm:py-2.5 sm:text-sm md:px-6 md:py-3 md:text-base">
                                                        Check Area
                                                    </button>
                                                </div>
                                                {/* Trust Badges - Compact */}
                                                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                                                    {['Farm-fresh', 'Morning delivery', 'Pause anytime', 'No lock-in'].map(
                                                        (badge) => (
                                                            <div
                                                                key={badge}
                                                                className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm sm:text-xs"
                                                            >
                                                                <svg
                                                                    className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                <span>{badge}</span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Visual - desktop: image full hero height; width unchanged */}
                                            <div className="relative flex w-full flex-shrink-0 items-center justify-center lg:h-full lg:w-3/5 lg:min-h-0 lg:justify-end">
                                                <div className="relative flex h-full w-full flex-col items-center justify-center lg:flex-row lg:justify-end">
                                                    <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-3xl sm:-left-8 sm:-top-8 sm:h-40 sm:w-40 lg:-left-12 lg:-top-12 lg:h-64 lg:w-64" />
                                                    <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-3xl sm:-bottom-8 sm:-right-8 sm:h-40 sm:w-40 lg:-bottom-12 lg:-right-12 lg:h-64 lg:w-64" />

                                                    {/* Product image + edge bubbles (anchored to image) */}
                                                    <div className="relative h-[240px] w-[280px] shrink-0 overflow-visible sm:h-[320px] sm:w-[320px] md:h-[380px] md:w-[340px] lg:h-full lg:min-h-[420px] lg:w-[85%] lg:max-w-[620px] xl:max-w-[720px]">
                                                        <div className="relative h-full w-full overflow-hidden bg-white/10 shadow-2xl backdrop-blur-md hero-image-shape">
                                                            <img
                                                                src={slide.image}
                                                                alt={slide.title}
                                                                className="absolute inset-0 h-full w-full object-cover object-center"
                                                                loading="lazy"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                                        </div>
                                                        {/* Bubbles at image edges only - larger on large screens */}
                                                        <div className="absolute right-0 top-[28%] z-10 h-6 w-6 animate-float rounded-full bg-white/25 shadow-xl backdrop-blur-sm sm:right-0 sm:top-[28%] sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-20 lg:w-20 lg:top-[25%] xl:h-24 xl:w-24" aria-hidden />
                                                        <div className="absolute bottom-[28%] left-0 z-10 h-6 w-6 animate-float-delayed rounded-full bg-white/25 shadow-xl backdrop-blur-sm sm:bottom-[28%] sm:left-0 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:bottom-[25%] lg:h-20 lg:w-20 xl:h-24 xl:w-24" aria-hidden />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Carousel Controls */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white active:scale-95 sm:left-4 sm:p-3 lg:left-8"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-5 w-5 text-white sm:h-6 sm:w-6 lg:h-8 lg:w-8" strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white active:scale-95 sm:right-4 sm:p-3 lg:right-8"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6 lg:h-8 lg:w-8" strokeWidth={2.5} />
                    </button>

                    {/* Carousel Indicators */}
                    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8">
                        {carouselSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 active:scale-125 sm:h-2 ${
                                    index === currentSlide
                                        ? 'w-6 bg-white sm:w-8'
                                        : 'w-1.5 bg-white/50 hover:bg-white/75 sm:w-2'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </section>

                {/* We deliver to – dark marquee, solid colors, larger size */}
                <section className="marquee-dark overflow-hidden border-y border-white/10 py-5 sm:py-6 lg:py-7">
                    <div className="flex items-center overflow-hidden">
                        <div className="flex flex-1 animate-marquee-slow items-center whitespace-nowrap">
                            {[...Array(3)].map((_, copyIndex) => (
                                <div key={copyIndex} className="flex min-w-max items-center gap-2 px-8 sm:gap-3 sm:px-10 lg:gap-4 lg:px-12">
                                    <span className="inline-flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-[var(--theme-secondary)] sm:text-lg lg:text-xl">
                                        <MapPinned className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.5} />
                                        We deliver to
                                    </span>
                                    <span className="text-base font-bold text-white/30 sm:text-lg lg:text-xl" aria-hidden>_</span>
                                    <span className="inline-flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-[var(--theme-secondary)] sm:text-lg lg:text-xl">
                                        <MapPinned className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.5} />
                                        Ernakulam
                                    </span>
                                    <span className="text-base font-bold text-white/30 sm:text-lg lg:text-xl" aria-hidden>_</span>
                                    {['Kaloor', 'Panampilly Nagar', 'High Court (Kochi)', 'Nayarambalam'].map(
                                        (location, locIdx) => (
                                            <span key={`ern-${copyIndex}-${location}`} className="inline-flex items-center gap-2 text-base font-semibold text-white/70 sm:text-lg lg:text-xl">
                                                {locIdx > 0 && <span className="text-base font-bold text-white/30 sm:text-lg lg:text-xl" aria-hidden>_</span>}
                                                <MapPin className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={2} />
                                                {location}
                                            </span>
                                        ),
                                    )}
                                    <span className="text-base font-bold text-white/30 sm:text-lg lg:text-xl" aria-hidden>_</span>
                                    <span className="inline-flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-[var(--theme-secondary)] sm:text-lg lg:text-xl">
                                        <MapPinned className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.5} />
                                        Malappuram
                                    </span>
                                    <span className="text-base font-bold text-white/30 sm:text-lg lg:text-xl" aria-hidden>_</span>
                                    {['Malipuram', 'Alathurpadi'].map((location, locIdx) => (
                                        <span key={`mal-${copyIndex}-${location}`} className="inline-flex items-center gap-2 text-base font-semibold text-white/70 sm:text-lg lg:text-xl">
                                            {locIdx > 0 && <span className="text-base font-bold text-white/30 sm:text-lg lg:text-xl" aria-hidden>_</span>}
                                            <MapPin className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={2} />
                                            {location}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
               
                {/* Trending Product Categories */}
                <section className="py-16 bg-white sm:py-20 lg:py-24" aria-labelledby="trending-categories-heading">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 id="trending-categories-heading" className="mb-3 text-3xl font-bold text-gray-800 sm:text-4xl lg:text-5xl">
                                Trending Product Categories
                            </h2>
                            <p className="text-lg text-gray-700 sm:text-xl">
                                Explore our most loved dairy categories
                            </p>
                        </div>
                        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-5 lg:gap-6">
                            {[
                                { name: 'Country Butter', image: '/images/categories/butter.png' },
                                { name: 'Butter Milk', image: '/images/categories/butter milk.png' },
                                { name: 'Paneer', image: '/images/categories/panneer.png' },
                                { name: 'Fresh Curd', image: '/images/categories/Fresh Curd.png' },
                                { name: 'Ghee', image: '/images/categories/Ghee.png' },
                            ].map((category) => (
                                <div key={category.name} className="group flex flex-col items-center">
                                    <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-xl group-hover:ring-[var(--theme-primary-1)]/30">
                                        <div className="aspect-square w-full">
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="mt-4 text-center text-base font-bold text-gray-800 sm:text-lg">
                                        {category.name}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How Subscription Works Section */}
                <section className="py-16 bg-gray-50 sm:py-20 lg:py-24" aria-labelledby="subscription-steps-heading">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 id="subscription-steps-heading" className="mb-3 text-3xl font-bold text-gray-800 sm:text-4xl lg:text-5xl">
                                How Subscription Works
                            </h2>
                            <p className="text-lg text-gray-700 sm:text-xl">
                                Simple steps to get fresh dairy delivered daily
                            </p>
                        </div>

                        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-6 sm:gap-8 lg:flex lg:flex-row lg:items-stretch lg:justify-center lg:gap-2">
                            {[
                                {
                                    step: '1',
                                    title: 'Choose Products',
                                    description: 'Milk, curd, paneer, ghee',
                                    image: '/images/dairy-products.png',
                                    imageAlt: 'Dairy products',
                                },
                                {
                                    step: '2',
                                    title: 'Set Quantity & Schedule',
                                    description: 'Daily / Alternate days',
                                    image: '/images/calendar.png',
                                    imageAlt: 'Calendar schedule',
                                },
                                {
                                    step: '3',
                                    title: 'We Deliver Every Morning',
                                    description: 'Fresh before 7 AM',
                                    image: '/images/motorbike.png',
                                    imageAlt: 'Delivery',
                                },
                                {
                                    step: '4',
                                    title: 'Pause / Modify Anytime',
                                    description: 'Full control, no lock-in',
                                    image: '/images/pause.png',
                                    imageAlt: 'Pause or modify',
                                },
                            ].flatMap((item, index) => {
                                const card = (
                                    <article
                                        key={`step-${index}`}
                                        className="group relative flex h-full min-h-[260px] flex-col rounded-2xl border-2 border-[var(--theme-primary-1)]/20 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[var(--theme-primary-1)]/40 hover:shadow-lg sm:min-h-[280px] sm:p-7 lg:min-h-[300px] lg:min-w-0 lg:flex-1 lg:basis-0"
                                    >
                                        <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--theme-primary-1)] text-xs font-bold text-white shadow-md sm:left-7 sm:h-8 sm:w-8 sm:text-sm" aria-hidden>
                                            {item.step}
                                        </span>
                                        <div className="mb-4 flex flex-shrink-0 flex-col items-center pt-1">
                                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--theme-primary-1)]/10 p-3 transition-colors group-hover:bg-[var(--theme-primary-1)]/20 sm:h-24 sm:w-24 sm:p-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.imageAlt}
                                                    className="h-full w-full object-contain"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="mb-2 text-center text-lg font-bold text-gray-800 sm:text-xl">
                                            {item.title}
                                        </h3>
                                        <p className="mt-auto text-center text-sm text-gray-700 sm:text-base">
                                            {item.description}
                                        </p>
                                    </article>
                                );
                                const arrow = (
                                    <div
                                        key={`arrow-${index}`}
                                        className="hidden flex-shrink-0 items-center justify-center lg:flex"
                                        aria-hidden
                                    >
                                        <svg className="h-6 w-6 text-[var(--theme-primary-1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                );
                                return index < 3 ? [card, arrow] : [card];
                            })}
                        </div>
                    </div>
                </section>

                {/* Our Products – compact card slider, wishlist on image, full-width cards, clean slider */}
                <section id="products" className="py-10 sm:py-12 lg:py-14" aria-labelledby="products-heading">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-6 text-center sm:mb-8">
                            <h2 id="products-heading" className="mb-1.5 text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
                                Our Products
                            </h2>
                            <p className="text-sm text-gray-600 sm:text-base">
                                Fresh dairy delivered to your doorstep
                            </p>
                        </div>

                        <div className="relative flex items-stretch gap-3 sm:gap-4">
                            <button
                                type="button"
                                onClick={goPrev}
                                disabled={!canGoPrev}
                                aria-label="Previous products"
                                className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:h-10 sm:w-10 ${
                                    canGoPrev
                                        ? 'border-[var(--theme-primary-1)]/40 bg-white text-[var(--theme-primary-1)] hover:bg-[var(--theme-primary-1)]/10'
                                        : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
                                }`}
                            >
                                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
                            </button>

                            <div ref={productSliderRef} className="min-w-0 flex-1 overflow-hidden">
                                <div
                                    className="flex gap-3 transition-transform duration-300 ease-out sm:gap-4"
                                    style={{
                                        width: stepPx > 0 ? `${PRODUCTS.length * stepPx - GAP_PX}px` : undefined,
                                        transform: `translateX(-${productIndex * stepPx}px)`,
                                    }}
                                    role="list"
                                >
                                    {PRODUCTS.map((product, index) => {
                                        const productId = `${product.name}-${product.variant}-${index}`;
                                        const isWishlisted = wishlistedProductIds.has(productId);
                                        return (
                                            <article
                                                key={productId}
                                                className="group flex w-full shrink-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-[var(--theme-primary-1)]/40 hover:shadow-md"
                                                style={{ width: stepPx > 0 ? `${stepPx - GAP_PX}px` : undefined }}
                                                role="listitem"
                                            >
                                                <div className="relative w-full aspect-square overflow-hidden bg-[var(--theme-secondary)]/10 sm:aspect-[4/3]">
                                                    <ProductCardMedia
                                                        media={getMediaList(product)}
                                                        alt={`${product.name} ${product.variant}`}
                                                        productKey={productId}
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
                                                            toggleProductWishlist(productId);
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
                                                <div className="flex w-full flex-1 flex-col p-2 sm:p-2.5">
                                                    <h3 className="mb-0.5 line-clamp-2 text-xs font-bold text-gray-800 sm:text-sm">
                                                        {product.name} {!product.isPlan && `- (${product.variant})`}
                                                    </h3>
                                                    {product.isPlan ? (
                                                        <p className="mb-1 text-[10px] font-medium text-gray-600 sm:text-xs">
                                                            {product.variant}
                                                        </p>
                                                    ) : (
                                                        <p className="mb-1 text-xs font-semibold text-[var(--theme-primary-1)] sm:text-sm">
                                                            {product.price}/ Unit
                                                        </p>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="mt-auto w-full rounded-md bg-[var(--theme-primary-1)] py-2 text-center text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:py-2 sm:text-xs"
                                                    >
                                                        {product.isPlan ? 'Subscribe' : 'Add'}
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={goNext}
                                disabled={!canGoNext}
                                aria-label="Next products"
                                className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:h-10 sm:w-10 ${
                                    canGoNext
                                        ? 'border-[var(--theme-primary-1)]/40 bg-white text-[var(--theme-primary-1)] hover:bg-[var(--theme-primary-1)]/10'
                                        : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
                                }`}
                            >
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us – compact horizontal story strip */}
                <section className="py-12 bg-gray-50/80 sm:py-14 lg:py-16" aria-labelledby="why-choose-heading">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 text-center sm:mb-10">
                            <h2 id="why-choose-heading" className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
                                Why Choose Us
                            </h2>
                            <p className="text-base text-gray-600 sm:text-lg">
                                Building trust through quality and transparency
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-6 lg:grid-cols-8 lg:gap-4">
                            {[
                                { title: 'Sourced from local Kerala farms', image: '/images/why-choose-us/Sourced from local Kerala farms.png' },
                                { title: 'No preservatives', image: '/images/why-choose-us/no-preservatives.png' },
                                { title: 'Hygienic processing', image: '/images/why-choose-us/Hygienic processing.png' },
                                { title: 'Morning delivery before 7 AM', image: '/images/why-choose-us/morning-delivery.png' },
                                { title: 'Cancel / pause anytime', image: '/images/why-choose-us/Cancel-pause anytime.png' },
                                { title: 'Quality checked daily', image: '/images/why-choose-us/Quality checked daily.png' },
                                { title: 'Cold-chain maintained', image: '/images/why-choose-us/Cold-chain maintained.png' },
                                { title: 'Transparent pricing', image: '/images/why-choose-us/transparent-pricing.png' },
                            ].map((item, index) => (
                                <div
                                    key={item.title}
                                    className="group flex flex-col items-center"
                                >
                                    <span
                                        className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-primary-1)] sm:text-xs"
                                        aria-hidden
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className="relative mb-2 flex h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--theme-secondary)]/30 p-2.5 transition-colors group-hover:bg-[var(--theme-primary-1)]/15 sm:h-16 sm:w-16 sm:p-3">
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    </div>
                                    <p className="line-clamp-2 min-h-[2.5em] text-center text-xs font-medium text-gray-700 sm:text-sm">
                                        {item.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Morning Delivery Promise – gray section, max-w-7xl, creative icon bg */}
                <section className="relative overflow-hidden bg-gray-100 py-9">
                    {/* Creative background: scattered icons from public/images/icons */}
                    <div className="section-icon-bg absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
                        <img src="/images/icons/milk-bottle.png" alt="" className="absolute -left-4 top-[12%] h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 lg:left-[8%] lg:top-[15%]" style={{ transform: 'rotate(-12deg)' }} />
                        <img src="/images/icons/farm.png" alt="" className="absolute right-[5%] top-[8%] h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 lg:right-[12%] lg:top-[10%]" style={{ transform: 'rotate(8deg)' }} />
                        <img src="/images/icons/animal.png" alt="" className="absolute bottom-[20%] left-[2%] h-14 w-14 sm:h-18 sm:w-18 sm:bottom-[18%] lg:h-20 lg:w-20 lg:left-[5%] lg:bottom-[22%]" style={{ transform: 'rotate(6deg)' }} />
                        <img src="/images/icons/milk-bottle%20(1).png" alt="" className="absolute bottom-[15%] right-[10%] h-20 w-20 sm:h-22 sm:w-22 sm:right-[8%] lg:h-24 lg:w-24 lg:right-[15%] lg:bottom-[18%]" style={{ transform: 'rotate(-10deg)' }} />
                        <img src="/images/icons/discount.png" alt="" className="absolute left-1/2 top-[25%] h-12 w-12 -translate-x-1/2 sm:h-14 sm:w-14 lg:h-16 lg:w-16 lg:top-[28%]" style={{ transform: 'rotate(15deg)' }} />
                        <img src="/images/icons/milk%20(1).png" alt="" className="absolute right-[20%] bottom-[12%] h-14 w-14 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem] lg:right-[25%] lg:bottom-[14%]" style={{ transform: 'rotate(-5deg)' }} />
                    </div>
                    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative flex min-h-[min(50vh,420px)] flex-col gap-6 sm:gap-8 lg:min-h-[480px] lg:flex-row lg:items-stretch lg:gap-10">
                            {/* Left: content – on gray, black/dark text, primary accent */}
                            <div className="relative z-10 flex flex-shrink-0 flex-col justify-center py-4 lg:w-[44%] lg:max-w-xl lg:py-6">
                                <span className="mb-3 inline-flex w-fit rounded-full bg-[var(--theme-primary-1)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white sm:text-xs">
                                    Morning delivery
                                </span>
                                <h2 className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-4xl">
                                    Wake Up to <span className="text-[var(--theme-primary-1)]">Freshness</span> Every Day
                                </h2>
                                <p className="mb-5 max-w-md text-base leading-relaxed text-gray-700 sm:text-lg">
                                    Milk delivered before your day starts—no store visits, no forgetting. Start your
                                    morning with the freshest dairy products right at your doorstep.
                                </p>
                                <ul className="mb-5 space-y-2.5 sm:mb-6 sm:space-y-3" role="list">
                                    {[
                                        'Delivered before 7 AM',
                                        'No need to visit stores',
                                        'Never miss your daily milk',
                                        'Fresh from farm to your door',
                                    ].map((point) => (
                                        <li key={point} className="flex items-center gap-3 text-gray-800">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--theme-secondary)] text-[var(--theme-primary-1)]">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            <span className="text-sm font-medium text-gray-800 sm:text-base">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                    <a
                                        href="/login"
                                        className="inline-flex items-center justify-center rounded-xl bg-[var(--theme-primary-1)] px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:px-6 sm:py-3.5 sm:text-base"
                                    >
                                        Subscribe Now
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center justify-center rounded-xl border-2 border-gray-800 bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-100 hover:border-black focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 sm:px-6 sm:py-3.5 sm:text-base"
                                    >
                                        Check delivery area
                                    </a>
                                </div>
                            </div>

                            {/* Right: video – explicit size so it never collapses; hero-style clip-path */}
                            <div className="relative min-h-[260px] w-full flex-1 lg:min-h-[420px] lg:min-w-[50%]">
                                <div className="absolute inset-0 overflow-hidden rounded-lg bg-gray-300 hero-image-shape">
                                    <video
                                        src="/video/fresh-milk.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                        className="absolute inset-0 h-full w-full object-cover"
                                        aria-label="Fresh milk delivery"
                                        onEnded={(e) => e.currentTarget.play()}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 via-transparent to-transparent pointer-events-none" aria-hidden />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Stories – YouTube Shorts–style preview with user/channel details, primary bg */}
                <section className="py-12 bg-[var(--theme-primary-1)] sm:py-14 lg:py-16" aria-labelledby="our-stories-heading">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-6 text-center sm:mb-8">
                            <h2 id="our-stories-heading" className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                                Our Stories
                            </h2>
                            <p className="mt-2 text-sm text-white/90 sm:text-base">
                                Freshtick Shorts — fresh updates, farm to home.
                            </p>
                        </div>
                        <div className="flex overflow-x-auto pb-4 scrollbar-thin sm:justify-center">
                            <div className="flex gap-4 sm:gap-5">
                                {STORIES.map((story, index) => (
                                    <button
                                        key={story.id}
                                        type="button"
                                        onClick={() => setStoryViewerIndex(index)}
                                        className="group flex shrink-0 flex-col focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--theme-primary-1)] rounded-xl text-left"
                                        aria-label={`Watch short: ${story.label}`}
                                    >
                                        {/* Short video preview – vertical 9:16 */}
                                        <div className="relative w-[140px] overflow-hidden rounded-lg bg-gray-200 sm:w-[160px]">
                                            <div className="aspect-[9/16] w-full">
                                                <video
                                                    src={story.src}
                                                    className="h-full w-full object-cover"
                                                    muted
                                                    loop
                                                    playsInline
                                                    preload="metadata"
                                                    aria-hidden
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/30">
                                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md sm:h-12 sm:w-12">
                                                        <Play className="h-5 w-5 text-[var(--theme-primary-1)] sm:h-6 sm:w-6" strokeWidth={2} fill="currentColor" />
                                                    </span>
                                                </div>
                                                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/6 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur sm:text-xs">
                                                    {story.views} views
                                                </span>
                                            </div>
                                        </div>
                                        {/* User / channel details */}
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white/20 ring-1 ring-white/40">
                                                <img src="/images/logo_light.png" alt="" className="h-full w-full object-contain p-0.5" />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-semibold text-white sm:text-sm">Freshtick</p>
                                                <p className="truncate text-[10px] text-white/80 sm:text-xs">{story.label}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story viewer fullscreen overlay – video fills viewport, close above tap zones */}
                {storyViewerIndex !== null && (
                    <div
                        className="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-black"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Story viewer"
                    >
                        {/* Video – fills entire viewport */}
                        <div className="absolute inset-0">
                            <video
                                ref={storyVideoRef}
                                src={STORIES[storyViewerIndex].src}
                                className="h-full w-full object-contain"
                                playsInline
                                muted={false}
                            />
                        </div>
                        {/* Progress bars – above video, above tap zones so close is clickable */}
                        <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 px-2 pt-3 sm:gap-1.5 sm:px-3 sm:pt-4">
                            {STORIES.map((_, i) => (
                                <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                                    <div
                                        className="h-full rounded-full bg-white transition-[width] duration-75"
                                        style={{ width: i < storyViewerIndex ? '100%' : i === storyViewerIndex ? `${storyProgress}%` : '0%' }}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Brand + close – z-20 so button is clickable (above tap zones) */}
                        <div className="absolute left-0 right-0 top-10 z-20 flex items-center justify-between px-4 sm:top-12 sm:px-6">
                            <span className="text-sm font-semibold text-white/90">Freshtick</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setStoryViewerIndex(null);
                                }}
                                className="relative z-20 rounded-full p-2 text-white/90 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label="Close story"
                            >
                                <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                            </button>
                        </div>
                        {/* Tap zones: left = prev, right = next (z-10, below header so close works) */}
                        <div className="absolute inset-0 z-10 flex">
                            <button
                                type="button"
                                className="w-2/5 shrink-0 focus:outline-none"
                                onClick={() => setStoryViewerIndex(storyViewerIndex > 0 ? storyViewerIndex - 1 : null)}
                                aria-label="Previous story"
                            />
                            <button
                                type="button"
                                className="flex-1 focus:outline-none"
                                onClick={() => setStoryViewerIndex(storyViewerIndex < STORIES.length - 1 ? storyViewerIndex + 1 : null)}
                                aria-label="Next story"
                            />
                        </div>
                    </div>
                )}

                {/* Subscription Plans – white cards, 480ml/1L tabs, primary outline */}
                <section id="subscriptions" className="py-12 bg-white sm:py-16 lg:py-20">
                    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                            Subscription Plans
                        </h2>

                        {/* Variant tabs */}
                        <div className="mb-8 flex justify-center gap-2">
                            {(['480ml', '1L'] as const).map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => setSubVariant(v)}
                                    className={`rounded-lg border-2 px-5 py-2.5 text-sm font-semibold transition-all sm:px-6 sm:py-3 sm:text-base ${
                                        subVariant === v
                                            ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)] text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-[var(--theme-primary-1)] hover:text-[var(--theme-primary-1)]'
                                    }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
                            {SUBSCRIPTION_PLANS.map((plan) => {
                                const variant = plan[subVariant];
                                return (
                                    <div
                                        key={plan.name}
                                        className="flex flex-col rounded-xl border-2 border-[var(--theme-primary-1)] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-2">
                                            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                                                {plan.name} {subVariant}
                                            </h3>
                                            {plan.discount && (
                                                <span className="shrink-0 rounded bg-[var(--theme-primary-1)] px-2 py-0.5 text-xs font-bold text-white">
                                                    {plan.discount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mb-2 text-sm text-gray-600">
                                            {variant.units} Unit(s)
                                        </p>
                                        <p className="mb-1 text-xl font-bold text-[var(--theme-primary-1)] sm:text-2xl">
                                            {variant.total}
                                        </p>
                                        <p className="mb-3 text-sm font-medium text-gray-700">
                                            {variant.perUnit}
                                        </p>
                                        <ul className="mb-4 space-y-1.5 border-t border-gray-100 pt-3" role="list">
                                            {SUBSCRIPTION_FEATURES.map((feature) => (
                                                <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--theme-secondary)] text-[var(--theme-primary-1)]">
                                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <a
                                            href="/login"
                                            className="mt-auto rounded-lg bg-[var(--theme-primary-1)] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] sm:py-3 sm:text-base"
                                        >
                                            Subscribe
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Customer Testimonials – single-row carousel, icon bg from public/images/icons */}
                <section className="relative overflow-hidden py-10 bg-gray-50 sm:py-12 lg:py-14" aria-label="Customer testimonials">
                    <div className="section-icon-bg absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
                        <img src="/images/icons/milk-bottle.png" alt="" className="absolute left-[2%] top-[8%] h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" style={{ opacity: 0.06, transform: 'rotate(-15deg)' }} />
                        <img src="/images/icons/farm.png" alt="" className="absolute right-[4%] top-[5%] h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14" style={{ opacity: 0.05, transform: 'rotate(10deg)' }} />
                        <img src="/images/icons/animal.png" alt="" className="absolute bottom-[15%] left-[1%] h-10 w-10 sm:h-12 sm:w-12" style={{ opacity: 0.05, transform: 'rotate(8deg)' }} />
                        <img src="/images/icons/milk-bottle%20(1).png" alt="" className="absolute bottom-[10%] right-[8%] h-12 w-12 sm:h-14 sm:w-14" style={{ opacity: 0.06, transform: 'rotate(-8deg)' }} />
                        <img src="/images/icons/discount.png" alt="" className="absolute left-[15%] top-1/2 h-8 w-8 -translate-y-1/2 sm:h-10 sm:w-10" style={{ opacity: 0.04, transform: 'rotate(12deg)' }} />
                        <img src="/images/icons/milk%20(1).png" alt="" className="absolute right-[18%] top-1/2 h-8 w-8 -translate-y-1/2 sm:h-10 sm:w-10" style={{ opacity: 0.05, transform: 'rotate(-6deg)' }} />
                    </div>
                    <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:mb-8 sm:flex-row sm:gap-6">
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                                    What Our Customers Say
                                </h2>
                                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                                    Real feedback from Kerala
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={goPrevTestimonial}
                                    disabled={!canGoPrevTestimonial}
                                    aria-label="Previous testimonials"
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:h-10 sm:w-10 ${
                                        canGoPrevTestimonial
                                            ? 'border-[var(--theme-primary-1)]/30 bg-white text-[var(--theme-primary-1)] hover:border-[var(--theme-primary-1)] hover:bg-[var(--theme-secondary)]/40'
                                            : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
                                    }`}
                                >
                                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
                                </button>
                                <button
                                    type="button"
                                    onClick={goNextTestimonial}
                                    disabled={!canGoNextTestimonial}
                                    aria-label="Next testimonials"
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:h-10 sm:w-10 ${
                                        canGoNextTestimonial
                                            ? 'border-[var(--theme-primary-1)]/30 bg-white text-[var(--theme-primary-1)] hover:border-[var(--theme-primary-1)] hover:bg-[var(--theme-secondary)]/40'
                                            : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
                                    }`}
                                >
                                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

                        <div ref={testimonialSliderRef} className="min-w-0 overflow-hidden">
                            <div
                                className="flex gap-4 transition-transform duration-300 ease-out sm:gap-5"
                                style={{
                                    width: testimonialStepPx > 0 ? `${TESTIMONIALS.length * testimonialStepPx - TESTIMONIAL_GAP_PX}px` : undefined,
                                    transform: `translateX(-${testimonialIndex * testimonialStepPx}px)`,
                                }}
                                role="list"
                            >
                                {TESTIMONIALS.map((t, index) => (
                                    <article
                                        key={index}
                                        className="flex shrink-0 flex-col rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                                        style={{ width: testimonialStepPx > 0 ? `${testimonialStepPx - TESTIMONIAL_GAP_PX}px` : undefined }}
                                        role="listitem"
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <div className="flex gap-0.5 text-[var(--theme-tertiary)]">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden>
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-medium text-[var(--theme-primary-1)] sm:text-xs">{t.recent}</span>
                                        </div>
                                        <p className="mb-3 flex-1 text-sm leading-relaxed text-gray-700 line-clamp-3 sm:text-base">
                                            "{t.quote}"
                                        </p>
                                        <div className="flex items-center gap-2 border-t border-gray-100 pt-2 sm:pt-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary-1)]/15 text-xs font-bold text-[var(--theme-primary-1)] sm:h-9 sm:w-9 sm:text-sm">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-gray-900 text-sm">{t.name}</p>
                                                <p className="flex items-center gap-1 truncate text-xs text-gray-600">
                                                    <MapPin className="h-3 w-3 shrink-0 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                                    {t.location}, Kerala
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Support – two-col layout, max-w, white bg */}
                <section className="py-8 bg-white sm:py-10 lg:py-12">
                    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 lg:items-start">
                            {/* Col 1: Active Support GIF (cropped/compressed) + App CTA — matches right height */}
                            <div className="flex w-full flex-col gap-4">
                                <div className="flex h-[160px] w-full max-w-full items-center justify-center overflow-hidden rounded-lg bg-[var(--theme-primary-1)]/10 sm:h-[200px] lg:h-[220px]">
                                    <img
                                        src="/images/Active%20Support.gif"
                                        alt=""
                                        className="h-full max-h-full w-full max-w-full object-contain object-center p-3 sm:p-4"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="shrink-0 rounded-lg bg-gradient-to-r from-[var(--theme-primary-1)] to-[var(--theme-primary-1-dark)] px-4 py-3 sm:px-5 sm:py-3.5">
                                    <p className="text-xs font-semibold text-white/90 sm:text-sm">
                                        Manage subscriptions from your phone — pause, increase, decrease anytime.
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <a href="/login" className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[var(--theme-primary-1)] transition-colors hover:bg-white/95 sm:px-4 sm:py-2">
                                            Get Started
                                        </a>
                                        <a href="/login" className="rounded-lg border border-white/80 bg-transparent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 sm:px-4 sm:py-2">
                                            Subscribe Now
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Col 2: Support contact card */}
                            <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200/80 bg-white shadow-sm">
                            <h2 className="border-b border-gray-100 px-4 py-3 text-lg font-bold text-gray-900 sm:px-5 sm:py-3.5 sm:text-xl">
                                Support
                            </h2>
                            <div className="divide-y divide-gray-100">
                                <a href="tel:7736121233" className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-gray-50/80 sm:px-5 sm:py-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-primary-1)]/15 text-[var(--theme-primary-1)]">
                                        <Phone className="h-4 w-4" strokeWidth={2} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900">Call Us</p>
                                        <p className="text-xs text-gray-600">7736121233</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
                                </a>
                                <a href="https://wa.me/917736121233" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-gray-50/80 sm:px-5 sm:py-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-primary-1)]/15 text-[var(--theme-primary-1)]">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900">Chat With Us</p>
                                        <p className="text-xs text-gray-600">7736121233</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
                                </a>
                                <a href="mailto:support@freshtick.in" className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-gray-50/80 sm:px-5 sm:py-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-primary-1)]/15 text-[var(--theme-primary-1)]">
                                        <Mail className="h-4 w-4" strokeWidth={2} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900">Email Us</p>
                                        <p className="text-xs text-gray-600">support@freshtick.in</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
                                </a>
                                <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-primary-1)]/15 text-[var(--theme-primary-1)]">
                                        <MapPin className="h-4 w-4" strokeWidth={2} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900">Address</p>
                                        <p className="text-xs leading-snug text-gray-600">
                                            Door No: VI / 404K, 2nd floor Karakattu Building, Nayarambalam PO, Nayarambalam, Puduvypin, Kochi, Kerala, India, 682509
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>
                
            </UserLayout>
    );
}
