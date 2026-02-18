import { Heart, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const FOOTER_PRODUCTS = [
    { label: 'Welcome Offer Plan', href: '#' },
    { label: 'Cow Ghee - (100g)', href: '#' },
    { label: 'Cow Ghee - (200g)', href: '#' },
    { label: 'Cow Ghee - (500g)', href: '#' },
    { label: 'More', href: '#' },
];

const FOOTER_POLICIES = [
    { label: 'Refunds/Cancellations Policy', href: '#' },
    { label: 'Shipping Policy', href: '#' },
    { label: 'Terms and Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
];

const DELIVERY_AREAS = [
    'Malipuram',
    'Nayarambalam',
    'High Court',
    'Alathurpadi Malapuram',
    'Kaloor',
    'Panampilly Nagar',
];

export default function Footer() {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!consent) return;
        // TODO: submit to backend
    };

    return (
        <footer className="bg-gray-900 text-white">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                {/* Main grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
                    {/* Brand + About + Contact + Social */}
                    <div className="lg:col-span-2">
                        <img
                            src="/images/logo_light.png"
                            alt="Freshtick"
                            className="mb-4 h-8 w-auto sm:h-9"
                            loading="lazy"
                        />
                        <p className="mb-4 text-sm leading-relaxed text-gray-400">
                            Kerala-based dairy delivering fresh milk and products to your doorstep every morning.
                        </p>
                        <ul className="space-y-1.5 text-sm text-gray-400">
                            <li>
                                <a href="#" className="transition-colors hover:text-white">
                                    About us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-white">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                        <div className="mt-4 flex gap-3">
                            <a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="Instagram">
                                Instagram
                            </a>
                            <a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="Facebook">
                                Facebook
                            </a>
                            <a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="Twitter">
                                Twitter
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-300">
                            Product
                        </h4>
                        <ul className="space-y-1.5 text-sm text-gray-400">
                            {FOOTER_PRODUCTS.map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="transition-colors hover:text-white">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policy */}
                    <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-300">
                            Policy
                        </h4>
                        <ul className="space-y-1.5 text-sm text-gray-400">
                            {FOOTER_POLICIES.map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="transition-colors hover:text-white">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* We deliver to */}
                    <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-300">
                            We deliver to
                        </h4>
                        <ul className="space-y-1.5 text-sm text-gray-400">
                            {DELIVERY_AREAS.map((area) => (
                                <li key={area}>{area}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Subscribe section with consent - hidden for now */}
                {false && (
                    <div className="mt-8 border-t border-gray-800 pt-8">
                        <form onSubmit={handleSubscribe} className="mx-auto max-w-xl">
                            <label htmlFor="footer-email" className="mb-2 block text-sm font-medium text-gray-300">
                                Subscribe for updates
                            </label>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <input
                                    id="footer-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email"
                                    className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={!consent}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-primary-1-dark)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" strokeWidth={2} />
                                    Subscribe
                                </button>
                            </div>
                            <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-800 text-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                />
                                <span>
                                    I agree to receive updates and offers from Freshtick via Email, SMS, WhatsApp & RCS.
                                </span>
                            </label>
                        </form>
                    </div>
                )}

                {/* Copyright bar */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 sm:flex-row">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <img
                            src="/images/logo_light.png"
                            alt="Freshtick"
                            className="h-5 w-auto opacity-70"
                            loading="lazy"
                        />
                        <span>
                            &copy; {new Date().getFullYear()} Freshtick. Made with{' '}
                            <Heart className="inline-block h-3.5 w-3.5 fill-[var(--theme-primary-1)] text-[var(--theme-primary-1)]" strokeWidth={2} /> in Kerala.
                        </span>
                    </div>
                    <a
                        href="mailto:support@freshtick.in"
                        className="flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-gray-400"
                    >
                        <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                        support@freshtick.in
                    </a>
                </div>
            </div>
        </footer>
    );
}
