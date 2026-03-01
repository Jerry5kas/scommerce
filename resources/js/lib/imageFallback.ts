import type { SyntheticEvent } from 'react';

export const FALLBACK_IMAGE_URL = '/images/icons/milk-bottle.png';

export function toSafeImageUrl(url: string | null | undefined): string {
    if (!url) {
        return FALLBACK_IMAGE_URL;
    }

    if (url.startsWith('http') || url.startsWith('/')) {
        return url;
    }

    return `/storage/${url}`;
}

export function handleImageFallbackError(event: SyntheticEvent<HTMLImageElement>): void {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE_URL;
}
