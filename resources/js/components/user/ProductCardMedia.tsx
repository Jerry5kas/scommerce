import { ChevronLeft, ChevronRight } from 'lucide-react';
import { handleImageFallbackError } from '@/lib/imageFallback';

export type MediaItem = { type: 'image'; url: string } | { type: 'video'; url: string };

interface ProductCardMediaProps {
    media: MediaItem[];
    alt: string;
    productKey: string;
    currentIndexMap: Record<string, number>;
    onIndexChange: (key: string, index: number) => void;
    className?: string;
    imageClassName?: string;
}

export function getMediaList(product: { image: string; media?: MediaItem[] }): MediaItem[] {
    if (product.media && product.media.length > 0) {
        return product.media;
    }
    return [{ type: 'image', url: product.image }];
}

export default function ProductCardMedia({
    media,
    alt,
    productKey,
    currentIndexMap,
    onIndexChange,
    className = '',
    imageClassName = '',
}: ProductCardMediaProps) {
    const index = currentIndexMap[productKey] ?? 0;
    const hasMultiple = media.length > 1;

    const goPrev = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onIndexChange(productKey, (index - 1 + media.length) % media.length);
    };

    const goNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onIndexChange(productKey, (index + 1) % media.length);
    };

    return (
        <div className={`relative h-full w-full overflow-hidden bg-(--theme-secondary)/10 ${className}`}>
            <div className="relative h-full w-full">
                {media.map((item, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 h-full w-full transition-opacity duration-200 ${
                            i === index ? 'z-0 opacity-100' : 'z-[-1] opacity-0'
                        }`}
                    >
                        {item.type === 'image' ? (
                            <img
                                src={item.url}
                                alt={i === 0 ? alt : `${alt} – view ${i + 1}`}
                                className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 ${imageClassName}`}
                                loading={i === 0 ? 'lazy' : undefined}
                                onError={handleImageFallbackError}
                            />
                        ) : (
                            <video
                                src={item.url}
                                className="h-full w-full object-cover"
                                muted
                                loop
                                playsInline
                                autoPlay={i === index}
                                aria-hidden={i !== index}
                            />
                        )}
                    </div>
                ))}
            </div>

            {hasMultiple && (
                <>
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="Previous media"
                        className="absolute top-1/2 left-0 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white sm:left-1 sm:h-7 sm:w-7"
                    >
                        <ChevronLeft className="h-3 w-3 text-gray-700 sm:h-4 sm:w-4" strokeWidth={2.5} />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="Next media"
                        className="absolute top-1/2 right-0 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white sm:right-1 sm:h-7 sm:w-7"
                    >
                        <ChevronRight className="h-3 w-3 text-gray-700 sm:h-4 sm:w-4" strokeWidth={2.5} />
                    </button>
                    <div className="absolute right-0 bottom-1 left-0 z-10 flex justify-center gap-1 sm:bottom-1.5">
                        {media.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onIndexChange(productKey, i);
                                }}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`h-1.5 w-1.5 rounded-full transition-colors sm:h-2 sm:w-2 ${
                                    i === index ? 'bg-white shadow-sm' : 'bg-white/50 hover:bg-white/70'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
