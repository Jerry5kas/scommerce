import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface CarouselSlide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
}

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

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [showMarquee, setShowMarquee] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsHeaderScrolled(scrollY > 50);
            setShowMarquee(scrollY < 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    return (
        <>
            <Head title="FreshTick - Fresh Dairy Delivered Daily" />
            <div className="min-h-screen bg-white">
                {/* Top Promotional Banner - Marquee */}
                <div
                    className={`fixed top-0 left-0 right-0 z-50 h-10 bg-gradient-to-r from-[#45AE96] to-[#3a9a85] shadow-md transition-all duration-300 ${
                        showMarquee ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                    }`}
                >
                    <div className="relative flex h-full items-center overflow-hidden">
                        <div className="flex animate-marquee whitespace-nowrap">
                            {/* Duplicate content for seamless infinite loop - 3 copies for smooth transition */}
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex min-w-max items-center gap-3 px-6 sm:gap-4 sm:px-8">
                                    <div className="flex h-6 w-auto px-2 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                                        <img
                                            src="/logo_new.png"
                                            alt="FreshTick"
                                            className="h-4 w-auto"
                                            loading="eager"
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-white sm:text-sm md:text-base">
                                        New to FreshTick?  🎉 Welcome Offer: 3 Trial Milk Packs @ ₹117  • Free Morning Delivery 🚚🥛 <span className="font-bold">₹117</span> (
                                        <span className="line-through opacity-80">(MRP ₹135)</span>)
                                    </span>
                                    <button className="shrink-0 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#45AE96] transition-all duration-200 hover:bg-white/95 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#45AE96] sm:px-4 sm:py-1.5 sm:text-sm">
                                        Subscribe Now!
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Header */}
                <header
                    className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
                        showMarquee
                            ? 'top-10'
                            : isHeaderScrolled
                              ? 'top-0 shadow-lg'
                              : 'top-0'
                    } ${
                        isHeaderScrolled
                            ? 'bg-white/98 backdrop-blur-lg'
                            : showMarquee
                              ? 'bg-white/95 backdrop-blur-md'
                              : 'bg-white/98 backdrop-blur-lg'
                    }`}
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-3 sm:py-4 lg:py-5">
                            {/* Logo */}
                            <div className="flex items-center">
                                <a
                                    href="/"
                                    className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#45AE96] focus:ring-offset-2 rounded-lg"
                                >
                                    <img
                                        src="/logo_new.png"
                                        alt="FreshTick - Fresh Dairy Delivered"
                                        className="h-8 w-auto sm:h-10 lg:h-12"
                                        loading="eager"
                                    />
                                    {/* <div className="hidden flex-col sm:flex">
                                        <span className="text-xs font-semibold text-gray-600 sm:text-sm">
                                            Fresh Dairy Delivered
                                        </span>
                                    </div> */}
                                </a>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden items-center gap-4 lg:flex lg:gap-6">
                                <button className="relative text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#45AE96]">
                                    Shop
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#45AE96] transition-all duration-300 group-hover:w-full" />
                                </button>
                                <button className="relative text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#45AE96]">
                                    Learn
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#45AE96] transition-all duration-300 group-hover:w-full" />
                                </button>
                                <button className="relative text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#45AE96]">
                                    Blog
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#45AE96] transition-all duration-300 group-hover:w-full" />
                                </button>
                                <button className="text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#45AE96]">
                                    Gift Card
                                </button>
                            </nav>

                            {/* User Actions */}
                            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                                {/* Location Input - Desktop */}
                                <div className="hidden items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 transition-all duration-300 hover:border-[#45AE96] hover:shadow-sm lg:flex">
                                    <svg
                                        className="h-4 w-4 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Enter Pincode</span>
                                </div>

                                {/* Login */}
                                <button className="flex items-center gap-1.5 text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#45AE96] sm:gap-2">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span className="hidden text-sm font-medium lg:inline">Login</span>
                                </button>

                                {/* Cart */}
                                <button className="relative flex items-center gap-1.5 text-gray-700 transition-all duration-300 hover:scale-105 hover:text-[#45AE96] sm:gap-2">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    <span className="hidden text-sm font-medium lg:inline">Cart</span>
                                </button>

                                {/* Mobile Menu */}
                                <button className="text-gray-700 transition-colors duration-300 lg:hidden">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Carousel Section - Full Screen on Desktop */}
                <section
                    className="relative h-screen overflow-hidden"
                    style={{
                        paddingTop: showMarquee ? 'calc(2.5rem + 4.5rem)' : '4.5rem',
                    }}
                >
                    {/* Carousel Slides */}
                    <div className="relative h-full w-full">
                        {carouselSlides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                            >
                                {/* Background Image with Overlay */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${slide.image})`,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-black/95" />
                                    <div
                                        className="absolute inset-0 opacity-20"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                        }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex h-full items-center">
                                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                        <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:justify-between lg:gap-8">
                                            {/* Left Content - Condensed */}
                                            <div className="w-full text-center lg:w-2/5 lg:text-left">
                                                {/* Branding Badge */}
                                                <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                                                    <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 backdrop-blur-sm">
                                                        <img
                                                            src="/logo_new.png"
                                                            alt="FreshTick"
                                                            className="h-3.5 w-auto sm:h-4"
                                                            loading="eager"
                                                        />
                                                        <span className="text-[10px] text-[#45AE96] font-semibold sm:text-xs">
                                                            Fresh Daily
                                                        </span>
                                                    </div>
                                                </div>
                                                <h1 className="mb-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                                                    {slide.title}
                                                    <br />
                                                    <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                                                        {slide.subtitle}
                                                    </span>
                                                </h1>
                                                <p className="mb-4 text-sm leading-snug text-white/90 sm:text-base md:text-lg lg:text-xl">
                                                    {slide.description}
                                                </p>
                                                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
                                                    <button className="group relative overflow-hidden rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 sm:px-6 sm:py-3 sm:text-base">
                                                        <span className="relative z-10">Subscribe Now</span>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                    </button>
                                                    <button className="rounded-lg border-2 border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:px-6 sm:py-3 sm:text-base">
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

                                            {/* Right Visual - Larger with Unique Shape */}
                                            <div className="relative w-full lg:w-3/5">
                                                <div className="flex items-center justify-center">
                                                    <div className="relative">
                                                        {/* Decorative Elements */}
                                                        <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:-left-12 sm:-top-12 sm:h-64 sm:w-64 lg:h-80 lg:w-80" />
                                                        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:-bottom-12 sm:-right-12 sm:h-64 sm:w-64 lg:h-80 lg:w-80" />

                                                        {/* Product Image Container with Unique Shape - Fixed Size */}
                                                        <div className="relative">
                                                            <div className="relative h-[400px] w-[320px] overflow-hidden bg-white/10 shadow-2xl backdrop-blur-md sm:h-[500px] sm:w-[420px] lg:h-[600px] lg:w-[520px] xl:h-[650px] xl:w-[600px] hero-image-shape">
                                                                <img
                                                                    src={slide.image}
                                                                    alt={slide.title}
                                                                    className="absolute inset-0 h-full w-full object-cover object-center"
                                                                    style={{
                                                                        objectFit: 'cover',
                                                                        objectPosition: 'center center',
                                                                    }}
                                                                    loading="lazy"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                                            </div>

                                                            {/* Floating Decorative Elements */}
                                                            <div className="absolute -right-4 top-1/4 h-12 w-12 animate-float rounded-full bg-white/25 shadow-xl backdrop-blur-sm sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
                                                            <div className="absolute -left-4 bottom-1/4 h-10 w-10 animate-float-delayed rounded-full bg-white/25 shadow-xl backdrop-blur-sm sm:h-14 sm:w-14 lg:h-18 lg:w-18" />
                                                        </div>
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
                        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 active:scale-95 hover:scale-110 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white sm:left-4 sm:p-3 lg:left-8"
                        aria-label="Previous slide"
                    >
                        <svg
                            className="h-5 w-5 text-white sm:h-6 sm:w-6 lg:h-8 lg:w-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 active:scale-95 hover:scale-110 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white sm:right-4 sm:p-3 lg:right-8"
                        aria-label="Next slide"
                    >
                        <svg
                            className="h-5 w-5 text-white sm:h-6 sm:w-6 lg:h-8 lg:w-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
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

                {/* Location Availability Section */}
                <section className="py-16 bg-white sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                                Currently Delivering In
                            </h2>
                            <p className="mb-8 text-lg text-gray-600 sm:text-xl">
                                Fresh dairy delivered to your doorstep in these areas
                            </p>

                            {/* Cities Grid */}
                            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                {['Malappuram', 'Manjeri', 'Perinthalmanna', 'Kottakkal'].map((city) => (
                                    <div
                                        key={city}
                                        className="rounded-lg border-2 border-[#45AE96]/20 bg-[#45AE96]/5 p-4 text-center transition-all duration-300 hover:border-[#45AE96] hover:bg-[#45AE96]/10 hover:shadow-md"
                                    >
                                        <span className="text-lg font-semibold text-gray-900">{city}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Pincode Input */}
                            <div className="mx-auto max-w-md">
                                <div className="flex gap-2 rounded-lg border-2 border-gray-200 bg-white p-2 shadow-sm focus-within:border-[#45AE96]">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Enter your area / pincode"
                                        className="flex-1 border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
                                    />
                                    <button className="rounded-lg bg-[#45AE96] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#3a9a85]">
                                        Check
                                    </button>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-gray-500">
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#45AE96]/10 px-3 py-1 text-[#45AE96]">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Kerala-based dairy
                                </span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* How Subscription Works Section */}
                <section className="py-16 bg-gray-50 sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                                How Subscription Works
                            </h2>
                            <p className="mb-12 text-lg text-gray-600 sm:text-xl">
                                Simple steps to get fresh dairy delivered daily
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    step: '1',
                                    title: 'Choose Products',
                                    description: 'Milk, curd, paneer, ghee',
                                    icon: (
                                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    step: '2',
                                    title: 'Set Quantity & Schedule',
                                    description: 'Daily / Alternate days',
                                    icon: (
                                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    step: '3',
                                    title: 'We Deliver Every Morning',
                                    description: 'Fresh before 7 AM',
                                    icon: (
                                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    step: '4',
                                    title: 'Pause / Modify Anytime',
                                    description: 'Full control, no lock-in',
                                    icon: (
                                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    ),
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-lg bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="mb-4 flex justify-center text-[#45AE96]">{item.icon}</div>
                                    <div className="mb-2 flex items-center justify-center gap-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#45AE96] text-sm font-bold text-white">
                                            {item.step}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                    </div>
                                    <p className="text-gray-600">{item.description}</p>
                                    {index < 3 && (
                                        <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                                            <svg
                                                className="h-8 w-8 text-[#45AE96]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Product Categories Section */}
                <section className="py-16 bg-white sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                                Our Products
                            </h2>
                            <p className="mb-12 text-lg text-gray-600 sm:text-xl">
                                Fresh dairy products delivered to your doorstep
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    name: 'Fresh Cow Milk',
                                    emoji: '🥛',
                                    benefit: 'Pure, unadulterated cow milk',
                                    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
                                },
                                {
                                    name: 'Buffalo Milk',
                                    emoji: '🐃',
                                    benefit: 'Rich and creamy buffalo milk',
                                    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
                                },
                                {
                                    name: 'Pure Ghee',
                                    emoji: '🧈',
                                    benefit: 'Traditional homemade ghee',
                                    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&q=80',
                                },
                                {
                                    name: 'Paneer',
                                    emoji: '🧀',
                                    benefit: 'Fresh, soft paneer daily',
                                    image: 'https://images.unsplash.com/photo-1618164436262-2f2e5e9b0b5b?w=400&q=80',
                                },
                                {
                                    name: 'Fresh Curd / Yogurt',
                                    emoji: '🍶',
                                    benefit: 'Creamy, probiotic-rich curd',
                                    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
                                },
                                {
                                    name: 'Milk-based Products',
                                    emoji: '🧁',
                                    benefit: 'More products coming soon',
                                    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80',
                                },
                            ].map((product, index) => (
                                <div
                                    key={index}
                                    className="group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                                >
                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-4xl">{product.emoji}</div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">{product.name}</h3>
                                        <p className="mb-4 text-gray-600">{product.benefit}</p>
                                        <button className="w-full rounded-lg bg-[#45AE96] px-4 py-2 font-semibold text-white transition-all duration-300 hover:bg-[#3a9a85]">
                                            Subscribe
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-16 bg-gray-50 sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                                Why Choose Us
                            </h2>
                            <p className="mb-12 text-lg text-gray-600 sm:text-xl">
                                Building trust through quality and transparency
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                'Sourced from local Kerala farms',
                                'No preservatives',
                                'Hygienic processing',
                                'Morning delivery before 7 AM',
                                'Cancel / pause anytime',
                                'Quality checked daily',
                                'Cold-chain maintained',
                                'Transparent pricing',
                            ].map((point, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                                >
                                    <svg
                                        className="mt-1 h-6 w-6 flex-shrink-0 text-[#45AE96]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span className="text-gray-700">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Morning Delivery Promise Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-[#45AE96] to-[#3a9a85] py-16 sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                                    Wake Up to Freshness Every Day
                                </h2>
                                <p className="mb-6 text-lg leading-relaxed text-white/90 sm:text-xl">
                                    Milk delivered before your day starts—no store visits, no forgetting. Start your
                                    morning with the freshest dairy products right at your doorstep.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        'Delivered before 7 AM',
                                        'No need to visit stores',
                                        'Never miss your daily milk',
                                        'Fresh from farm to your door',
                                    ].map((point, index) => (
                                        <div key={index} className="flex items-center gap-3 text-white">
                                            <svg
                                                className="h-5 w-5 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span>{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="relative h-64 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm sm:h-80 lg:h-96">
                                    <img
                                        src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80"
                                        alt="Morning delivery"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Simple Pricing & Payments Section */}
                <section className="py-16 bg-white sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                                Simple Pricing & Payments
                            </h2>
                            <p className="mb-12 text-lg text-gray-600 sm:text-xl">
                                Transparent pricing with flexible payment options
                            </p>
                        </div>

                        <div className="mx-auto max-w-4xl">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        title: 'Pay Weekly / Monthly',
                                        description: 'Choose your payment cycle',
                                        icon: (
                                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        ),
                                    },
                                    {
                                        title: 'UPI / Card / Wallet',
                                        description: 'Multiple payment methods',
                                        icon: (
                                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                />
                                            </svg>
                                        ),
                                    },
                                    {
                                        title: 'No Hidden Charges',
                                        description: 'Transparent pricing per litre',
                                        icon: (
                                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        ),
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border-2 border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:border-[#45AE96] hover:shadow-lg"
                                    >
                                        <div className="mb-4 flex justify-center text-[#45AE96]">{item.icon}</div>
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Customer Testimonials Section */}
                <section className="py-16 bg-gray-50 sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                                What Our Customers Say
                            </h2>
                            <p className="mb-12 text-lg text-gray-600 sm:text-xl">
                                Real people, genuine feedback from Kerala
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    quote: 'Milk tastes just like village milk. Delivery is always on time.',
                                    name: 'Rashid',
                                    location: 'Malappuram',
                                    avatar: '👨‍💼',
                                },
                                {
                                    quote: 'Fresh curd every morning. My family loves it!',
                                    name: 'Priya',
                                    location: 'Manjeri',
                                    avatar: '👩‍💼',
                                },
                                {
                                    quote: 'Best ghee in town. Quality is unmatched.',
                                    name: 'Rajesh',
                                    location: 'Perinthalmanna',
                                    avatar: '👨‍💼',
                                },
                            ].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="mb-4 flex items-center gap-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="h-5 w-5 fill-current"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="mb-4 text-gray-700 italic">"{testimonial.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#45AE96]/10 text-2xl">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                            <p className="text-sm text-gray-600">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mobile-First / App CTA Section */}
                <section className="py-16 bg-white sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#45AE96] to-[#3a9a85] p-8 text-center sm:p-12">
                            {/* Subtle Logo Watermark */}
                            <div className="pointer-events-none absolute right-8 top-8 opacity-5">
                                <img
                                    src="/logo_new.png"
                                    alt="FreshTick"
                                    className="h-32 w-auto"
                                    loading="lazy"
                                />
                            </div>
                            <div className="relative z-10">
                                <div className="mb-4 flex items-center justify-center gap-2">
                                    <img
                                        src="/logo_new.png"
                                        alt="FreshTick"
                                        className="h-6 w-auto sm:h-8"
                                        loading="lazy"
                                    />
                                    <span className="text-sm font-semibold text-white/90 sm:text-base">
                                        FreshTick App
                                    </span>
                                </div>
                                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                                    Manage Subscriptions from Your Phone
                                </h2>
                                <p className="mb-8 text-lg text-white/90 sm:text-xl">
                                    Pause, increase, decrease anytime. Full control in your hands.
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                    <button className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-[#45AE96] transition-all duration-300 hover:bg-white/95 hover:shadow-xl">
                                        Get Started
                                    </button>
                                    <button className="rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10">
                                        Subscribe Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Support & Contact Section */}
                <section className="py-16 bg-gray-50 sm:py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                                We're Here to Help
                            </h2>
                            <p className="mb-12 text-lg text-gray-600 sm:text-xl">
                                Get in touch with us anytime
                            </p>
                        </div>

                        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    title: 'WhatsApp Support',
                                    description: 'Quick response on WhatsApp',
                                    icon: (
                                        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    ),
                                },
                                {
                                    title: 'Morning Delivery',
                                    description: 'Before 7 AM daily',
                                    icon: (
                                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    title: 'Customer Care',
                                    description: 'Local support number',
                                    icon: (
                                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    title: 'Missed Delivery?',
                                    description: 'We\'ll make it right',
                                    icon: (
                                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    ),
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md"
                                >
                                    <div className="mb-4 flex justify-center text-[#45AE96]">{item.icon}</div>
                                    <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 py-12 text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <img
                                        src="/logo_new.png"
                                        alt="FreshTick"
                                        className="h-8 w-auto sm:h-10"
                                        loading="lazy"
                                    />
                                </div>
                                <p className="mb-4 text-sm leading-relaxed text-gray-400">
                                    Kerala-based dairy delivering fresh milk and products to your doorstep every morning.
                                    <span className="mt-2 block font-semibold text-[#45AE96]">
                                        Fresh. Pure. Delivered Daily.
                                    </span>
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Kerala, India</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Quick Links</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <a href="#" className="hover:text-white">
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white">
                                            Delivery Areas
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white">
                                            Subscription FAQ
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Policies</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <a href="#" className="hover:text-white">
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white">
                                            Terms & Conditions
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white">
                                            Refund Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Contact</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>Kerala, India</li>
                                    <li>
                                        <a href="mailto:support@freshtick.com" className="hover:text-[#45AE96]">
                                            support@freshtick.com
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-800 pt-8">
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/logo_new.png"
                                        alt="FreshTick"
                                        className="h-6 w-auto opacity-60"
                                        loading="lazy"
                                    />
                                    <p className="text-sm text-gray-400">
                                        &copy; {new Date().getFullYear()} FreshTick. Made with ❤️ in Kerala.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        support@freshtick.com
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
