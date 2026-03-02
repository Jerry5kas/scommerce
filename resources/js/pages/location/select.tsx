import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, MapPin, ShieldCheck, Timer } from 'lucide-react';
import { useEffect } from 'react';
import LocationPicker from '@/components/user/LocationPicker';
import UserLayout from '@/layouts/UserLayout';

export default function LocationSelect() {
    const { zone } = usePage().props as unknown as { zone?: { id: number } | null };

    useEffect(() => {
        if (zone) {
            router.visit('/');
        }
    }, [zone]);

    return (
        <UserLayout showHeader={false} showTopBanner={false}>
            <Head title="Select Location" />
            <div className="min-h-screen bg-gray-100 lg:p-4">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="bg-white lg:grid lg:min-h-[calc(100vh-2rem)] lg:grid-cols-2 lg:rounded-2xl lg:shadow-lg">
                        <section className="border-b border-gray-200 bg-white px-4 py-4 lg:hidden">
                            <button
                                type="button"
                                onClick={() => router.visit('/')}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="mt-3 text-2xl font-bold text-gray-900">Select Location</h1>
                            <p className="mt-1 text-sm text-gray-600">Search, detect, or tap on map to confirm delivery location.</p>
                        </section>

                        <section className="hidden bg-(--theme-primary-1) px-5 py-7 text-white sm:px-8 lg:block lg:px-7 lg:py-8 xl:px-9">
                            <img src="/logo_new.png" alt="Freshtick" className="h-9 w-auto rounded-md bg-white p-1" />
                            <h1 className="mt-5 text-2xl leading-tight font-bold sm:text-3xl">Choose your delivery location</h1>
                            <p className="mt-2.5 text-sm text-white/90 sm:text-base">
                                Set it once and enjoy a fast app-like shopping experience, just like leading commerce apps.
                            </p>

                            <div className="mt-5 space-y-2.5">
                                <div className="flex items-start gap-3 rounded-xl bg-white/10 px-3 py-2.5">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">Zone-based delivery</p>
                                        <p className="text-xs text-white/85">We validate your exact serviceability from the map/pincode.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-xl bg-white/10 px-3 py-2.5">
                                    <Timer className="mt-0.5 h-5 w-5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">Quick checkout later</p>
                                        <p className="text-xs text-white/85">Once saved, all catalog and cart flows are faster.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-xl bg-white/10 px-3 py-2.5">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">Safe address handling</p>
                                        <p className="text-xs text-white/85">Used only for delivery and communication preferences.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="px-4 py-4 sm:px-6 sm:py-6 lg:px-6 lg:py-6 xl:px-8">
                            <div className="mb-3 hidden sm:mb-4 lg:block">
                                <h2 className="text-xl font-bold text-gray-900">Pin your location</h2>
                                <p className="mt-1 text-sm text-gray-600">Search, detect, or tap on map to confirm delivery location.</p>
                            </div>

                            <LocationPicker
                                fromNavbar={false}
                                onCancel={() => router.visit('/')}
                                className="sm:rounded-2xl sm:border sm:border-gray-200 sm:bg-white sm:p-4 lg:p-4"
                            />
                        </section>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
