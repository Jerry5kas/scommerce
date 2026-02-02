import { Link } from '@inertiajs/react';
import { Menu, X, MapPin, User, ShoppingCart, Heart, ChevronRight, Home, Package, Repeat } from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Subscriptions', href: '/subscription', icon: Repeat },
];

interface HeaderProps {
    showMarquee: boolean;
    isScrolled: boolean;
}

export default function Header({ showMarquee, isScrolled }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    return (
        <>
            <header
                className={`fixed left-0 right-0 z-[1200] border-b transition-all duration-300 ease-out ${
                    showMarquee ? 'top-10' : 'top-0'
                } ${
                    isScrolled
                        ? 'border-gray-200/60 bg-white/95 shadow-sm backdrop-blur-md'
                        : 'border-gray-100/80 bg-white/95 backdrop-blur-sm'
                }`}
>
                <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6">
                    <div className="flex items-center justify-between gap-3 py-2.5 sm:py-3 lg:py-3">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex shrink-0 items-center py-1 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 rounded-lg"
                            aria-label="Freshtick Home"
                        >
                            <img
                                src="/logo_new.png"
                                alt="Freshtick"
                                className="h-7 w-auto sm:h-8 lg:h-9"
                                loading="eager"
                            />
                        </Link>

                        {/* Desktop nav – compact, with icons */}
                        <nav className="hidden items-center lg:flex lg:gap-0.5">
                            {NAV_LINKS.map((item) => {
                                const Icon = item.icon;
                                const isLink = item.href.startsWith('/') && item.href.length > 1;
                                const Component = item.href.startsWith('#') ? 'a' : Link;
                                const props = item.href.startsWith('#') || item.href === '/'
                                    ? { href: item.href }
                                    : { href: item.href as string };
                                return (
                                    <Component
                                        key={item.label}
                                        {...props}
                                        className="group flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium text-gray-600 transition-colors hover:text-[var(--theme-primary-1)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                                    >
                                        <Icon className="h-4 w-4 shrink-0 opacity-80 group-hover:opacity-100" strokeWidth={2} />
                                        <span>{item.label}</span>
                                    </Component>
                                );
                            })}
                        </nav>

                        {/* Actions: Pincode, Login, Wishlist, Cart */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="hidden lg:flex">
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-gray-50/60 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-[var(--theme-primary-1)]/30 hover:text-[var(--theme-primary-1)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                                >
                                    <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                                    <span>Pincode</span>
                                </button>
                            </div>

                            <Link
                                href="/login"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[var(--theme-primary-1)]/10 hover:text-[var(--theme-primary-1)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:h-9 sm:w-9"
                                aria-label="Login"
                            >
                                <User className="h-4 w-4" strokeWidth={2} />
                            </Link>

                            <button
                                type="button"
                                className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[var(--theme-primary-1)]/10 hover:text-[var(--theme-primary-1)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:h-9 sm:w-9"
                                aria-label="Wishlist"
                            >
                                <Heart className="h-4 w-4" strokeWidth={2} />
                            </button>

                            <Link
                                href="/cart"
                                className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[var(--theme-primary-1)]/10 hover:text-[var(--theme-primary-1)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:h-9 sm:w-9"
                                aria-label="Cart"
                            >
                                <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--theme-primary-1)] px-1 text-[10px] font-semibold text-white">
                                    0
                                </span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-[var(--theme-primary-1)]/10 hover:text-[var(--theme-primary-1)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 sm:h-9 sm:w-9 lg:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? 'visible' : 'invisible'}`}
                aria-hidden={!mobileMenuOpen}
            >
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                        mobileMenuOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-label="Close overlay"
                />
                <div
                    className={`absolute right-0 top-0 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl transition-all duration-300 ease-out ${
                        mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-95'
                    }`}
                >
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <img src="/logo_new.png" alt="FreshTick" className="h-8 w-auto" />
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-[var(--theme-primary-1)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)]"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" strokeWidth={2} />
                        </button>
                    </div>
                    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-4">
                        {NAV_LINKS.map((item, i) => {
                            const Icon = item.icon;
                            const isAnchor = item.href.startsWith('#');
                            const className = "nav-drawer-item group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-700 opacity-0 transition-colors hover:bg-gray-50 hover:text-[var(--theme-primary-1)]";
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
                            className="flex items-center gap-3 rounded-lg border border-gray-200/80 bg-gray-50/60 px-4 py-3 text-left text-sm font-medium text-gray-600"
                        >
                            <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} />
                            <span>Pincode</span>
                        </button>
                        <div className="mt-2 flex items-center gap-2">
                            <Link
                                href="/login"
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--theme-primary-1)]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <User className="h-4 w-4" strokeWidth={2} />
                                Login
                            </Link>
                            <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--theme-primary-1)]">
                                <Heart className="h-4 w-4" strokeWidth={2} />
                                Wishlist
                            </button>
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
