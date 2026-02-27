import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, MapPin, User, ShoppingCart, Heart, ChevronRight, Home, Package, Repeat } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Subscriptions', href: '/subscription', icon: Repeat },
];

interface HeaderProps {
    showTopBanner: boolean;
    isScrolled: boolean;
}

interface SearchResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

interface ResolvedAddress {
    address_line_1: string;
    city: string;
    state: string;
    pincode: string;
}

export default function Header({ showTopBanner, isScrolled }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
    const [locationQuery, setLocationQuery] = useState('');
    const [locationResults, setLocationResults] = useState<SearchResult[]>([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [isSavingLocation, setIsSavingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const locationDropdownRef = useRef<HTMLDivElement | null>(null);
    const pageProps = usePage().props as unknown as {
        auth?: { user?: unknown; wishlisted_products?: number[] };
        zone?: { id: number; name: string; code: string } | null;
    };
    const auth = pageProps.auth;
    const authUser = auth?.user;
    const wishlistCount = auth?.wishlisted_products?.length || 0;
    const zone = pageProps.zone;

    const resolveAddressFromCoordinates = async (latitude: number, longitude: number): Promise<ResolvedAddress> => {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);

        if (!response.ok) {
            throw new Error('Reverse geocoding failed');
        }

        const data = await response.json();
        const address = data?.address ?? {};
        const road = address.road || address.neighbourhood || address.suburb || '';
        const city = address.city || address.town || address.village || address.county || address.state_district || '';
        const state = address.state || '';
        const pincode = typeof address.postcode === 'string' ? address.postcode.replace(/\D/g, '').slice(0, 10) : '';
        const headline = typeof data?.display_name === 'string' ? data.display_name.split(',')[0] : '';
        const addressLine1 = road
            ? `${address.building ? `${address.building}, ` : ''}${road}${headline ? `, ${headline}` : ''}`
            : data?.display_name;

        return {
            address_line_1: typeof addressLine1 === 'string' ? addressLine1 : '',
            city: typeof city === 'string' ? city : '',
            state: typeof state === 'string' ? state : '',
            pincode: typeof pincode === 'string' ? pincode : '',
        };
    };

    const fetchZoneByPincode = async (pincode: string): Promise<boolean> => {
        const response = await fetch(`/location/zone/${encodeURIComponent(pincode)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            return false;
        }

        const data = (await response.json()) as { zone?: { id: number } | null };

        return Boolean(data.zone?.id);
    };

    const handleSearchLocation = async () => {
        if (!locationQuery.trim()) {
            return;
        }

        setIsSearchingLocation(true);
        setLocationError(null);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&addressdetails=1&limit=6`,
            );
            const data = await response.json();
            setLocationResults(Array.isArray(data) ? data : []);
            if (!Array.isArray(data) || data.length === 0) {
                setLocationError('No matching location found. Try a nearby landmark or pincode.');
            }
        } catch {
            setLocationResults([]);
            setLocationError('Location search failed. Please try again.');
        } finally {
            setIsSearchingLocation(false);
        }
    };

    const handleSelectLocation = async (result: SearchResult) => {
        if (!authUser) {
            window.location.href = '/login';

            return;
        }

        setIsSavingLocation(true);
        setLocationError(null);

        try {
            const latitude = parseFloat(result.lat);
            const longitude = parseFloat(result.lon);
            const resolved = await resolveAddressFromCoordinates(latitude, longitude);

            if (!resolved.address_line_1 || !resolved.city || !resolved.state || !resolved.pincode) {
                setLocationError('Could not resolve complete address details. Please pick another result.');
                setIsSavingLocation(false);

                return;
            }

            const hasServiceableZone = await fetchZoneByPincode(resolved.pincode);
            if (!hasServiceableZone) {
                setLocationError('Selected location is outside our delivery zone.');
                setIsSavingLocation(false);

                return;
            }

            router.post(
                '/location/set',
                {
                    from_navbar: true,
                    type: 'home',
                    label: 'Selected location',
                    address_line_1: resolved.address_line_1,
                    address_line_2: '',
                    landmark: '',
                    city: resolved.city,
                    state: resolved.state,
                    pincode: resolved.pincode,
                    latitude,
                    longitude,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setLocationDropdownOpen(false);
                        setLocationResults([]);
                        setLocationQuery('');
                    },
                    onError: (errors) => {
                        if (errors.location) {
                            setLocationError(errors.location);
                        } else {
                            setLocationError('Failed to save location. Please try again.');
                        }
                    },
                    onFinish: () => {
                        setIsSavingLocation(false);
                    },
                },
            );
        } catch {
            setLocationError('Could not verify this location. Please try another nearby result.');
            setIsSavingLocation(false);
        }
    };

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && setMobileMenuOpen(false);
        document.addEventListener('keydown', onEscape);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onEscape);
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const onEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setLocationDropdownOpen(false);
            }
        };

        const onClickOutside = (event: MouseEvent) => {
            if (!locationDropdownRef.current) {
                return;
            }

            if (!locationDropdownRef.current.contains(event.target as Node)) {
                setLocationDropdownOpen(false);
            }
        };

        document.addEventListener('keydown', onEscape);
        document.addEventListener('mousedown', onClickOutside);

        return () => {
            document.removeEventListener('keydown', onEscape);
            document.removeEventListener('mousedown', onClickOutside);
        };
    }, []);

    return (
        <>
            <header
                className={`fixed right-0 left-0 z-[1200] border-b bg-white transition-all duration-300 ease-out ${
                    showTopBanner ? 'top-10 border-gray-100' : 'top-0 border-gray-200 shadow-sm'
                }`}
            >
                <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6">
                    <div className="flex items-center justify-between gap-3 py-2.5 sm:py-3 lg:py-3">
                        {/* Logo with white background */}
                        <Link
                            href="/"
                            className="flex shrink-0 items-center rounded-xl bg-white px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none"
                            aria-label="Freshtick Home"
                        >
                            <img src="/logo_new.png" alt="Freshtick" className="h-6 w-auto sm:h-7 lg:h-8" loading="eager" />
                        </Link>

                        {/* Desktop nav – compact, with icons */}
                        <nav className="hidden items-center lg:flex lg:gap-0.5">
                            {NAV_LINKS.map((item) => {
                                const Icon = item.icon;
                                const isLink = item.href.startsWith('/') && item.href.length > 1;
                                const Component = item.href.startsWith('#') ? 'a' : Link;
                                const props = item.href.startsWith('#') || item.href === '/' ? { href: item.href } : { href: item.href as string };
                                return (
                                    <Component
                                        key={item.label}
                                        {...props}
                                        className="group flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium text-gray-600 transition-colors hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none"
                                    >
                                        <Icon className="h-4 w-4 shrink-0 opacity-80 group-hover:opacity-100" strokeWidth={2} />
                                        <span>{item.label}</span>
                                    </Component>
                                );
                            })}
                        </nav>

                        {/* Actions: Pincode, Login, Wishlist, Cart */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="relative hidden lg:flex" ref={locationDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLocationDropdownOpen((current) => !current);
                                        setLocationError(null);
                                    }}
                                    className="flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-gray-50/60 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-[var(--theme-primary-1)]/30 hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none"
                                >
                                    <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                                    <span>{zone?.name ?? 'Select location'}</span>
                                </button>

                                {locationDropdownOpen && (
                                    <div className="absolute top-11 right-0 z-[1300] w-[26rem] rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                                        <div className="flex gap-2">
                                            <input
                                                value={locationQuery}
                                                onChange={(event) => setLocationQuery(event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault();
                                                        handleSearchLocation();
                                                    }
                                                }}
                                                placeholder="Search area, street, landmark"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSearchLocation}
                                                disabled={isSearchingLocation || !locationQuery.trim()}
                                                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:bg-gray-300 disabled:text-gray-500"
                                            >
                                                {isSearchingLocation ? '...' : 'Search'}
                                            </button>
                                        </div>

                                        {locationError && (
                                            <p className="mt-2 rounded-md bg-rose-50 px-2 py-1 text-xs text-rose-700">{locationError}</p>
                                        )}

                                        {locationResults.length > 0 && (
                                            <ul className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-gray-100">
                                                {locationResults.map((result) => (
                                                    <li
                                                        key={result.place_id}
                                                        className="cursor-pointer border-b border-gray-100 px-3 py-2 text-sm text-gray-700 last:border-0 hover:bg-gray-50"
                                                        onClick={() => handleSelectLocation(result)}
                                                    >
                                                        {result.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {isSavingLocation && <p className="mt-2 text-xs text-gray-500">Saving location...</p>}
                                    </div>
                                )}
                            </div>

                            <Link
                                href={authUser ? '/profile' : '/login'}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[var(--theme-primary-1)]/10 hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none sm:h-9 sm:w-9"
                                aria-label={authUser ? 'Profile' : 'Login'}
                            >
                                <User className="h-4 w-4" strokeWidth={2} />
                            </Link>

                            <Link
                                href="/wishlist"
                                className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[var(--theme-primary-1)]/10 hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none sm:h-9 sm:w-9"
                                aria-label="Wishlist"
                            >
                                <Heart className="h-4 w-4" strokeWidth={2} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/cart"
                                className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[var(--theme-primary-1)]/10 hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none sm:h-9 sm:w-9"
                                aria-label="Cart"
                            >
                                <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--theme-primary-1)] px-1 text-[10px] font-semibold text-white">
                                    0
                                </span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-[var(--theme-primary-1)]/10 hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none sm:h-9 sm:w-9 lg:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            <div className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? 'visible' : 'invisible'}`} aria-hidden={!mobileMenuOpen}>
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                        mobileMenuOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-label="Close overlay"
                />
                <div
                    className={`absolute top-0 right-0 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl transition-all duration-300 ease-out ${
                        mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-95'
                    }`}
                >
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <img src="/logo_new.png" alt="FreshTick" className="h-8 w-auto" />
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:outline-none"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" strokeWidth={2} />
                        </button>
                    </div>
                    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-4">
                        {NAV_LINKS.map((item, i) => {
                            const Icon = item.icon;
                            const isAnchor = item.href.startsWith('#');
                            const className =
                                'nav-drawer-item group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-700 opacity-0 transition-colors hover:bg-gray-50 hover:text-[var(--theme-primary-1)]';
                            const style = mobileMenuOpen ? { animationDelay: `${i * 50}ms` } : undefined;
                            const content = (
                                <>
                                    <span className="flex items-center gap-2.5">
                                        <Icon className="h-4 w-4 shrink-0 text-gray-500 group-hover:text-[var(--theme-primary-1)]" strokeWidth={2} />
                                        {item.label}
                                    </span>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} />
                                </>
                            );
                            if (isAnchor) {
                                return (
                                    <a key={item.label} href={item.href} className={className} style={style} onClick={() => setMobileMenuOpen(false)}>
                                        {content}
                                    </a>
                                );
                            }
                            return (
                                <Link key={item.label} href={item.href} className={className} style={style} onClick={() => setMobileMenuOpen(false)}>
                                    {content}
                                </Link>
                            );
                        })}
                        <div className="my-3 border-t border-gray-100" />
                        <Link
                            href="/location"
                            className="flex items-center gap-3 rounded-lg border border-gray-200/80 bg-gray-50/60 px-4 py-3 text-left text-sm font-medium text-gray-600"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} />
                            <span>{zone?.name ?? 'Select location'}</span>
                        </Link>
                        <div className="mt-2 flex items-center gap-2">
                            <Link
                                href={authUser ? '/profile' : '/login'}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--theme-primary-1)]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <User className="h-4 w-4" strokeWidth={2} />
                                {authUser ? 'Profile' : 'Login'}
                            </Link>
                            <Link
                                href="/wishlist"
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--theme-primary-1)]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="relative">
                                    <Heart className="h-4 w-4" strokeWidth={2} />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-2 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </div>
                                Wishlist
                            </Link>
                            <Link
                                href="/cart"
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--theme-primary-1)]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                                Cart
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
