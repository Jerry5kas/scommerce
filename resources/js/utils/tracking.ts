/**
 * Tracking utility for analytics events
 */

interface TrackingProperties {
    category?: string;
    action?: string;
    label?: string;
    value?: number;
    [key: string]: unknown;
}

interface Product {
    id: number;
    name: string;
    sku?: string;
    price: number;
    category?: string;
}

interface Order {
    id: number;
    order_number: string;
    total: number;
    subtotal?: number;
    discount?: number;
    items_count?: number;
}

// E-commerce event names (GA4 standard)
export const EVENTS = {
    PAGE_VIEW: 'page_view',
    VIEW_ITEM: 'view_item',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    VIEW_CART: 'view_cart',
    BEGIN_CHECKOUT: 'begin_checkout',
    ADD_PAYMENT_INFO: 'add_payment_info',
    PURCHASE: 'purchase',
    SUBSCRIBE: 'subscribe',
    SEARCH: 'search',
    LOGIN: 'login',
    SIGNUP: 'signup',
};

/**
 * Track a custom event
 */
export async function trackEvent(eventName: string, properties: TrackingProperties = {}): Promise<void> {
    try {
        // Send to backend
        await fetch('/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({
                event_name: eventName,
                properties,
            }),
        });

        // Push to GTM dataLayer if available
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: eventName,
                ...properties,
            });
        }

        // Track with Meta Pixel if available
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('trackCustom', eventName, properties);
        }
    } catch (error) {
        console.error('Tracking error:', error);
    }
}

/**
 * Track page view
 */
export async function trackPageView(url?: string, title?: string): Promise<void> {
    const pageUrl = url || window.location.href;
    const pageTitle = title || document.title;

    await trackEvent(EVENTS.PAGE_VIEW, {
        category: 'engagement',
        action: 'view',
        page_url: pageUrl,
        page_title: pageTitle,
    });

    // Meta Pixel PageView
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView');
    }
}

/**
 * Track product view
 */
export async function trackProductView(product: Product): Promise<void> {
    await trackEvent(EVENTS.VIEW_ITEM, {
        category: 'ecommerce',
        action: 'view',
        label: product.name,
        value: product.price,
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        product_price: product.price,
        product_category: product.category,
    });

    // Meta Pixel ViewContent
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'ViewContent', {
            content_type: 'product',
            content_ids: [product.id],
            content_name: product.name,
            value: product.price,
            currency: 'INR',
        });
    }
}

/**
 * Track add to cart
 */
export async function trackAddToCart(product: Product, quantity: number = 1): Promise<void> {
    await trackEvent(EVENTS.ADD_TO_CART, {
        category: 'ecommerce',
        action: 'add',
        label: product.name,
        value: product.price * quantity,
        product_id: product.id,
        product_name: product.name,
        quantity,
        price: product.price,
    });

    // Meta Pixel AddToCart
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
            content_type: 'product',
            content_ids: [product.id],
            content_name: product.name,
            value: product.price * quantity,
            currency: 'INR',
        });
    }
}

/**
 * Track checkout
 */
export async function trackCheckout(value: number, itemsCount: number): Promise<void> {
    await trackEvent(EVENTS.BEGIN_CHECKOUT, {
        category: 'ecommerce',
        action: 'checkout',
        value,
        items_count: itemsCount,
    });

    // Meta Pixel InitiateCheckout
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
            value,
            currency: 'INR',
            num_items: itemsCount,
        });
    }
}

/**
 * Track purchase
 */
export async function trackPurchase(order: Order): Promise<void> {
    await trackEvent(EVENTS.PURCHASE, {
        category: 'ecommerce',
        action: 'purchase',
        label: order.order_number,
        value: order.total,
        order_id: order.id,
        order_number: order.order_number,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        items_count: order.items_count,
    });

    // Meta Pixel Purchase
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
            value: order.total,
            currency: 'INR',
            content_type: 'product',
        });
    }

    // Google Ads conversion
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
            send_to: process.env.GOOGLE_ADS_CONVERSION_ID,
            value: order.total,
            currency: 'INR',
            transaction_id: order.order_number,
        });
    }
}

/**
 * Track search
 */
export async function trackSearch(query: string, resultCount: number): Promise<void> {
    await trackEvent(EVENTS.SEARCH, {
        category: 'engagement',
        action: 'search',
        label: query,
        search_query: query,
        result_count: resultCount,
    });

    // Meta Pixel Search
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Search', {
            search_string: query,
            content_type: 'product',
        });
    }
}

/**
 * Track login
 */
export async function trackLogin(): Promise<void> {
    await trackEvent(EVENTS.LOGIN, {
        category: 'authentication',
        action: 'login',
    });
}

/**
 * Track signup
 */
export async function trackSignup(): Promise<void> {
    await trackEvent(EVENTS.SIGNUP, {
        category: 'authentication',
        action: 'signup',
    });

    // Meta Pixel CompleteRegistration
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'CompleteRegistration');
    }
}

