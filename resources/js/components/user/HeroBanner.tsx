import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Banner {
    id: number;
    title: string;
    description: string;
    image: string;
    mobile_image?: string | null;
    link?: string | null;
    link_type?: string;
}

interface HeroBannerProps {
    banners: Banner[];
    autoPlay?: boolean;
    interval?: number;
}

export default function HeroBanner({ 
    banners, 
    autoPlay = true, 
    interval = 4000 
}: HeroBannerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-play functionality with pause on hover
    useEffect(() => {
        if (!autoPlay || banners.length <= 1 || isPaused) return;
        
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, banners.length, isPaused]);

    const goToSlide = (index: number) => setCurrentSlide(index);
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);

    const displayBanners = banners.length > 0 ? banners : [{
        id: 'default-banner',
        title: 'Welcome',
        description: '',
        image: '/images/3 Milk Packs at Just @ 117 130.png',
    }] as any;

    const currentBanner = displayBanners[currentSlide];

    return (
        <section className="relative w-full pt-[88px] sm:pt-[88px] lg:pt-[92px]">
            {/* Mobile: Simple auto-height banner without thumbnails */}
            <div className="h-auto w-full lg:hidden">
                <div 
                    className="relative h-full w-full overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {displayBanners.map((banner: any, index: number) => (
                        <div
                            key={banner.id}
                            className={`transition-opacity duration-500 ease-in-out ${
                                index === currentSlide ? 'block opacity-100' : 'hidden opacity-0'
                            }`}
                        >
                            {banner.link ? (
                                <Link href={banner.link} className="block w-full">
                                    <img
                                        src={banner.mobile_image || banner.image}
                                        alt={banner.title || 'Banner'}
                                        className="h-auto w-full object-cover"
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                    />
                                </Link>
                            ) : (
                                <img
                                    src={banner.mobile_image || banner.image}
                                    alt={banner.title || 'Banner'}
                                    className="h-auto w-full object-cover"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                            )}
                        </div>
                    ))}

                    {/* Mobile Dot Indicators */}
                    {displayBanners.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                            {displayBanners.map((_: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                                        index === currentSlide
                                            ? 'w-4 bg-white'
                                            : 'w-1.5 bg-white/60'
                                    }`}
                                    aria-label={`Go to banner ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop: Full screen height with thumbnails on image */}
            <div className="hidden h-[calc(100vh-92px)] w-full lg:block">
                <div 
                    className="relative h-full w-full overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {displayBanners.map((banner: any, index: number) => (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            {banner.link ? (
                                <Link href={banner.link} className="block h-full w-full">
                                    <img
                                        src={banner.image}
                                        alt={banner.title || 'Banner'}
                                        className="h-full w-full object-cover object-center"
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                    />
                                </Link>
                            ) : (
                                <img
                                    src={banner.image}
                                    alt={banner.title || 'Banner'}
                                    className="h-full w-full object-cover object-center"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                            )}
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    {displayBanners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-all duration-200 hover:bg-white hover:scale-105 focus:outline-none"
                                aria-label="Previous banner"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-700" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-all duration-200 hover:bg-white hover:scale-105 focus:outline-none"
                                aria-label="Next banner"
                            >
                                <ChevronRight className="h-5 w-5 text-gray-700" />
                            </button>
                        </>
                    )}

                    {/* Thumbnails - Bottom Right on Image */}
                    {displayBanners.length > 1 && (
                        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                            {displayBanners.map((banner: any, index: number) => (
                                <button
                                    key={banner.id}
                                    onClick={() => goToSlide(index)}
                                    className={`relative overflow-hidden rounded-lg transition-all duration-200 ${
                                        index === currentSlide
                                            ? 'ring-2 ring-white ring-offset-1'
                                            : 'opacity-70 hover:opacity-100'
                                    }`}
                                    aria-label={`View ${banner.title || 'banner'} ${index + 1}`}
                                >
                                    <div className="h-14 w-20">
                                        <img
                                            src={banner.image}
                                            alt={banner.title || `Thumbnail ${index + 1}`}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
