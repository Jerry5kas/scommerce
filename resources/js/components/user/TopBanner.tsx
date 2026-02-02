import { Gift, Sparkles, ArrowRight } from 'lucide-react';

interface TopBannerProps {
    visible: boolean;
}

export default function TopBanner({ visible }: TopBannerProps) {
    // Don't render if not visible
    if (!visible) {
        return null;
    }

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 h-10 bg-[var(--theme-primary-1-dark)] shadow-lg"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
        >
            <div className="relative flex h-full items-center overflow-hidden">
                {/* Animated sparkle effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <Sparkles className="absolute left-[10%] top-1/2 h-3 w-3 -translate-y-1/2 animate-pulse text-white/40" />
                    <Sparkles className="absolute left-[50%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 animate-pulse text-white/30" style={{ animationDelay: '0.5s' }} />
                    <Sparkles className="absolute left-[80%] top-1/2 h-3 w-3 -translate-y-1/2 animate-pulse text-white/40" style={{ animationDelay: '1s' }} />
                </div>

                {/* Marquee content */}
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex min-w-max items-center gap-2.5 px-5 sm:gap-3 sm:px-6">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/10">
                                <Gift className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-medium text-white/95 sm:text-xs">
                                <span className="font-semibold">🎉 Special Welcome Offer:</span> Get 3 Trial Packs of Fresh Dairy at{' '}
                                <span className="font-bold text-white">₹117</span>
                                <span className="mx-1.5 text-white/60 line-through">₹135</span>
                                <span className="ml-1.5 font-semibold text-white">Save ₹18!</span>
                            </span>
                            <a
                                href="/login"
                                className="group flex shrink-0 items-center gap-1 rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--theme-primary-1)] transition-all duration-200 hover:bg-white/95 hover:shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--theme-primary-1)] sm:px-3 sm:py-1.5 sm:text-xs"
                            >
                                Subscribe
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
