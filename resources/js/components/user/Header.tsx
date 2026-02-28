import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, MapPin, User, ShoppingCart, Heart, Home, Package, Repeat, ChevronRight, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import LocationModal from '@/components/user/LocationModal';

const NAV_LINKS = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Subscriptions', href: '/subscription', icon: Repeat },
];

interface HeaderProps {
    showTopBanner: boolean;
    isScrolled: boolean;
}

interface Location {
    address_line_1: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
}

interface UserData {
    id: number;
    name?: string;
    email?: string;
    avatar?: string;
}

export default function Header({ showTopBanner, isScrolled }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    
    const pageProps = usePage().props as unknown as {
        auth?: { user?: UserData; wishlisted_products?: number[] };
        zone?: { id: number; name: string; code: string } | null;
        location?: Location | null;
    };
    const auth = pageProps.auth;
    const authUser = auth?.user;
    const wishlistCount = auth?.wishlisted_products?.length || 0;
    const zone = pageProps.zone;
    const location = pageProps.location;

    useEffect(() => {
        // Auto-open modal if zone is missing and we are not on the location page
        if (!zone && !window.location.pathname.startsWith('/location')) {
            setIsLocationModalOpen(true);
        }
    }, [zone]);

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
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuOpen]);

    const handleLogout = () => {
        router.post('/logout');
    };

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
                            <div className="relative hidden lg:flex">
                                <button
                                    type="button"
                                    onClick={() => setIsLocationModalOpen(true)}
                                    className="flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-gray-50/60 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-[var(--theme-primary-1)]/30 hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none"
                                >
                                    <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                                    <span>{zone?.name ?? 'Select location'}</span>
                                </button>
                            </div>

                            <div className="relative" ref={userMenuRef}>
                                {authUser ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors hover:bg-emerald-200 focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none sm:h-9 sm:w-9"
                                            aria-label="User Menu"
                                        >
                                            <span className="text-sm font-semibold">
                                                {(authUser.name || 'U').charAt(0).toUpperCase()}
                                            </span>
                                        </button>

                                        {userMenuOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="mb-2 px-3 py-2">
                                                    <p className="truncate text-sm font-medium text-gray-900">{authUser.name || 'User'}</p>
                                                    <p className="truncate text-xs text-gray-500">{authUser.email || ''}</p>
                                                </div>
                                                <div className="h-px bg-gray-100" />
                                                <div className="py-1">
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        Profile & Settings
                                                    </Link>
                                                    <Link
                                                        href="/dashboard"
                                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <LayoutDashboard className="h-4 w-4" />
                                                        Dashboard
                                                    </Link>
                                                </div>
                                                <div className="h-px bg-gray-100" />
                                                <div className="mt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[var(--theme-primary-1)]/10 hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none sm:h-9 sm:w-9"
                                        aria-label="Login"
                                    >
                                        <User className="h-4 w-4" strokeWidth={2} />
                                    </Link>
                                )}
                            </div>

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

            <LocationModal 
                isOpen={isLocationModalOpen} 
                onClose={() => setIsLocationModalOpen(false)} 
                initialLocation={location}
            />

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
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg border border-gray-200/80 bg-gray-50/60 px-4 py-3 text-left text-sm font-medium text-gray-600"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                setIsLocationModalOpen(true);
                            }}
                        >
                            <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} />
                            <span>{zone?.name ?? 'Select location'}</span>
                        </button>
                        
                        {authUser && (
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="nav-drawer-item group mt-1 flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                            >
                                <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
                                Sign out
                            </button>
                        )}

                        <div className="mt-2 flex items-center gap-2">
                            <Link
                                href={authUser ? '/profile' : '/login'}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--theme-primary-1)]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <User className="h-4 w-4" strokeWidth={2} />
                                {authUser ? 'Account' : 'Login'}
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
