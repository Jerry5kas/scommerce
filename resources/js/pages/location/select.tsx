import { Head, useForm, usePage } from '@inertiajs/react';
import * as L from 'leaflet';
import { Crosshair, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import UserLayout from '@/layouts/UserLayout';
import type { SharedData } from '@/types';

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

interface ServiceabilityResponse {
    serviceable?: boolean;
}

interface LocationFormData {
    type: 'home' | 'work' | 'other';
    label: string;
    address_line_1: string;
    address_line_2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
}

const isCompleteResolvedAddress = (address: ResolvedAddress | null): address is ResolvedAddress => {
    return Boolean(address?.address_line_1 && address.city && address.state && address.pincode);
};

export default function LocationSelect() {
    const { theme, auth, flash, csrf_token } =
        (usePage().props as unknown as SharedData & {
            flash?: { message?: string };
            csrf_token?: string;
        }) ?? {};

    const form = useForm<LocationFormData>({
        type: 'home',
        label: 'Selected location',
        address_line_1: '',
        address_line_2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        latitude: 0,
        longitude: 0,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [resolvedAddress, setResolvedAddress] = useState<ResolvedAddress | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isResolvingAddress, setIsResolvingAddress] = useState(false);

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (theme) {
            document.documentElement.style.setProperty('--theme-primary-1', theme.primary_1);
            document.documentElement.style.setProperty('--theme-primary-2', theme.primary_2);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
            document.documentElement.style.setProperty('--theme-tertiary', theme.tertiary);
            document.documentElement.style.setProperty('--theme-primary-1-dark', '#3a9a85');
        }
    }, [theme]);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) {
            return;
        }

        if (typeof window === 'undefined') {
            return;
        }

        const map = L.map(mapContainerRef.current).setView([10.081, 76.205], 13);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        map.on('click', (event: L.LeafletMouseEvent) => {
            const { lat, lng } = event.latlng;
            setMapLocation({ lat, lng });
            setResolvedAddress(null);
            setSubmitError(null);

            if (markerRef.current) {
                markerRef.current.setLatLng(event.latlng);
                return;
            }

            markerRef.current = L.marker(event.latlng).addTo(map);
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    map.setView([position.coords.latitude, position.coords.longitude], 14);
                },
                () => {},
            );
        }

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current || !mapLocation) {
            return;
        }

        mapInstanceRef.current.setView([mapLocation.lat, mapLocation.lng], 15);

        if (markerRef.current) {
            markerRef.current.setLatLng([mapLocation.lat, mapLocation.lng]);
            return;
        }

        markerRef.current = L.marker([mapLocation.lat, mapLocation.lng]).addTo(mapInstanceRef.current);
    }, [mapLocation]);

    const handleSearchLocation = async () => {
        if (!searchQuery.trim()) {
            return;
        }

        setIsSearching(true);

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(Array.isArray(data) ? data : []);
        } catch {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSearchResult = (result: SearchResult) => {
        setMapLocation({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
        setSearchQuery(result.display_name);
        setSearchResults([]);
        setResolvedAddress(null);
        setSubmitError(null);
    };

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

    const checkServiceability = async (payload: { pincode: string; latitude: number; longitude: number }): Promise<boolean> => {
        const metaCsrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const xsrfCookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]?.replace(/^"(.*)"$/, '$1') || '';
        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        };

        if (csrf_token || metaCsrfToken) {
            requestHeaders['X-CSRF-TOKEN'] = csrf_token || metaCsrfToken;
        }

        if (xsrfCookie) {
            requestHeaders['X-XSRF-TOKEN'] = decodeURIComponent(xsrfCookie);
        }

        const response = await fetch('/location/check-serviceability', {
            method: 'POST',
            credentials: 'same-origin',
            headers: requestHeaders,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Unable to validate serviceability');
        }

        const data: ServiceabilityResponse = await response.json();

        return data.serviceable === true;
    };

    const handleSetLocation = async () => {
        form.clearErrors();
        setSubmitError(null);

        if (!mapLocation) {
            setSubmitError('Pick your delivery point on the map first.');
            return;
        }

        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }

        setIsResolvingAddress(true);

        try {
            const reverseResolved = isCompleteResolvedAddress(resolvedAddress)
                ? resolvedAddress
                : await resolveAddressFromCoordinates(mapLocation.lat, mapLocation.lng);

            const resolved = reverseResolved;

            if (!resolved.address_line_1 || !resolved.city || !resolved.state || !resolved.pincode) {
                setSubmitError('Could not auto-fill a complete address. Please pick a more precise map point.');
                setIsResolvingAddress(false);
                return;
            }

            const isServiceable = await checkServiceability({
                pincode: resolved.pincode,
                latitude: mapLocation.lat,
                longitude: mapLocation.lng,
            });

            if (!isServiceable) {
                setSubmitError('Selected location is outside our current delivery zone. Please choose a nearby serviceable point.');
                setIsResolvingAddress(false);
                return;
            }

            setResolvedAddress(resolved);

            const payload: LocationFormData = {
                type: 'home',
                label: 'Selected location',
                address_line_1: resolved.address_line_1,
                address_line_2: '',
                landmark: '',
                city: resolved.city,
                state: resolved.state,
                pincode: resolved.pincode,
                latitude: mapLocation.lat,
                longitude: mapLocation.lng,
            };

            form.transform(() => payload).post('/location/set', {
                preserveScroll: true,
                onError: (errors) => {
                    if (errors.location) {
                        setSubmitError(errors.location);
                    }
                },
                onFinish: () => {
                    setIsResolvingAddress(false);
                    form.transform((data) => data);
                },
            });
        } catch {
            setSubmitError('Could not verify this location right now. Please try again or select a more precise map point.');
            setIsResolvingAddress(false);
        }
    };

    const isSavingLocation = isResolvingAddress || form.processing;

    return (
        <UserLayout showHeader={false} showTopBanner={false}>
            <Head title="Set delivery location" />

            <section
                className="relative h-screen w-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://ik.imagekit.io/freshtickstorage/banner/location-select-bg.png?updatedAt=1772153058208)',
                }}
            >
                <div className="absolute inset-0 bg-white/35" aria-hidden />

                <div className="relative z-10 flex h-full items-start px-3 py-4 sm:px-6 sm:py-6 lg:items-center lg:px-10">
                    <div className="w-full max-w-[560px] rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:p-5">
                        <div className="mb-3 sm:mb-4">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Set delivery location</h1>
                            <p className="mt-1 text-sm text-gray-600">Pick your delivery point and save it instantly.</p>
                        </div>

                        <div className="space-y-3">
                            {flash?.message && (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 sm:text-sm">
                                    {flash.message}
                                </div>
                            )}

                            <div className="relative z-10">
                                <div className="relative flex flex-col gap-2 sm:flex-row">
                                    <div className="relative flex-1">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search area, street, landmark..."
                                            className="block w-full rounded-lg border-gray-300 py-2.5 pr-4 pl-10 text-sm text-gray-900 shadow-sm transition-colors focus:border-(--theme-primary-1) focus:ring-(--theme-primary-1)"
                                            value={searchQuery}
                                            onChange={(event) => setSearchQuery(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    handleSearchLocation();
                                                }
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSearchLocation}
                                        disabled={isSearching || !searchQuery.trim()}
                                        className="shrink-0 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black disabled:bg-gray-300 disabled:text-gray-500"
                                    >
                                        {isSearching ? 'Searching...' : 'Search'}
                                    </button>
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="absolute top-full right-0 left-0 z-[1001] mt-2 max-h-52 overflow-auto rounded-xl border border-gray-100 bg-white shadow-xl">
                                        <ul className="py-2">
                                            {searchResults.map((result) => (
                                                <li
                                                    key={result.place_id}
                                                    onClick={() => handleSelectSearchResult(result)}
                                                    className="cursor-pointer border-b border-gray-100 px-4 py-2.5 text-sm text-gray-700 transition-colors last:border-0 hover:bg-gray-50 hover:text-(--theme-primary-1)"
                                                >
                                                    <span className="block truncate font-medium">{result.display_name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="relative z-0 w-full overflow-hidden rounded-xl border border-gray-200">
                                <div ref={mapContainerRef} className="h-56 w-full sm:h-64 lg:h-72" />
                            </div>

                            <div className="space-y-2">
                                <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700 sm:text-sm">
                                    {mapLocation
                                        ? `Selected coordinates: ${mapLocation.lat.toFixed(6)}, ${mapLocation.lng.toFixed(6)}`
                                        : 'No map point selected yet.'}
                                </div>

                                {resolvedAddress && (
                                    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 sm:text-sm">
                                        <p className="font-semibold text-gray-900">Auto-filled address</p>
                                        <p className="mt-1">{resolvedAddress.address_line_1}</p>
                                        <p className="text-xs text-gray-500">
                                            {resolvedAddress.city}, {resolvedAddress.state} - {resolvedAddress.pincode}
                                        </p>
                                    </div>
                                )}

                                {(submitError || form.errors.location) && (
                                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 sm:text-sm">
                                        {submitError ?? form.errors.location}
                                    </div>
                                )}

                                {(form.errors.address_line_1 || form.errors.city || form.errors.state || form.errors.pincode) && (
                                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 sm:text-sm">
                                        {form.errors.address_line_1 || form.errors.city || form.errors.state || form.errors.pincode}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleSetLocation}
                                    disabled={isSavingLocation || !mapLocation}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-(--theme-primary-1) px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                                >
                                    <Crosshair className="h-4 w-4" />
                                    {isSavingLocation ? 'Saving location...' : 'Set this as my location'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
