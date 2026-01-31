interface TopBannerProps {
    visible: boolean;
}

export default function TopBanner({ visible }: TopBannerProps) {
    return (
        <div
            className={`fixed left-0 right-0 z-50 h-10 bg-gradient-to-r from-[var(--theme-primary-1)] to-[var(--theme-primary-1-dark)] shadow-md transition-all duration-300 ${
                visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
        >
            <div className="relative flex h-full items-center overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex min-w-max items-center gap-3 px-6 sm:gap-4 sm:px-8">
                            <div className="flex h-6 w-auto shrink-0 items-center justify-center rounded-full bg-white px-2 shadow-sm">
                                <img src="/logo_new.png" alt="FreshTick" className="h-4 w-auto" loading="eager" />
                            </div>
                            <span className="text-xs font-medium text-white sm:text-sm md:text-base">
                                New to FreshTick? Welcome Offer: 3 Trial Milk Packs at Rs.117. Free Morning Delivery.
                                <span className="font-bold"> Rs.117</span>{' '}
                                <span className="line-through opacity-80">(MRP Rs.135)</span>
                            </span>
                            <a
                                href="/login"
                                className="shrink-0 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[var(--theme-primary-1)] transition-all duration-200 hover:bg-white/95 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--theme-primary-1)] sm:px-4 sm:py-1.5 sm:text-sm"
                            >
                                Subscribe Now!
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
