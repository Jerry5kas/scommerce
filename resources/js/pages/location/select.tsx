import { Head, Link, useForm, usePage } from '@inertiajs/react';
import * as L from 'leaflet';
import { MapPin, Search, Check, X, Crosshair } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import UserLayout from '@/layouts/UserLayout';
import type { SharedData } from '@/types';

interface ZoneData {
    id: number;
    name: string;
    code: string;
    city: string;
    state: string;
    delivery_charge: number | null;
    min_order_amount: number | null;
}

interface LocationSelectPageProps {
    zones?: ZoneData[];
    message?: string;
}

export default function LocationSelect({ zones = [] }: LocationSelectPageProps) {
    const { theme, auth } = (usePage().props as unknown as SharedData) ?? {};
    const [pincode, setPincode] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    
    const [checkResult, setCheckResult] = useState<{ serviceable: boolean; zone?: ZoneData } | null>(null);
    const [checking, setChecking] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapChecking, setMapChecking] = useState(false);
    
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    // Apply Theme
    useEffect(() => {
        if (theme) {
            document.documentElement.style.setProperty('--theme-primary-1', theme.primary_1);
            document.documentElement.style.setProperty('--theme-primary-2', theme.primary_2);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
            document.documentElement.style.setProperty('--theme-tertiary', theme.tertiary);
            document.documentElement.style.setProperty('--theme-primary-1-dark', '#3a9a85');
        }
    }, [theme]);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;
        if (typeof window === 'undefined') return;
        
        const map = L.map(mapContainerRef.current).setView([10.081, 76.205], 13);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            setMapLocation({ lat, lng });
            if (markerRef.current) {
                markerRef.current.setLatLng(e.latlng);
            } else {
                markerRef.current = L.marker(e.latlng).addTo(map);
            }
        });

        // Try getting initial geolocation quickly if HTTPS
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
               map.setView([pos.coords.latitude, pos.coords.longitude], 14);
            }, () => {});
        }

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, []);

    // Effect for handling auto-panning map when search is selected
    useEffect(() => {
        if (mapInstanceRef.current && mapLocation) {
            mapInstanceRef.current.setView([mapLocation.lat, mapLocation.lng], 15);
            if (markerRef.current) {
                markerRef.current.setLatLng([mapLocation.lat, mapLocation.lng]);
            } else {
                markerRef.current = L.marker([mapLocation.lat, mapLocation.lng]).addTo(mapInstanceRef.current);
            }
        }
    }, [mapLocation]);

    const handleSearchLocation = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching location:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSearchResult = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setMapLocation({ lat, lng });
        setSearchQuery(result.display_name);
        setSearchResults([]);
    };

    const handleCheckPincode = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = pincode.replace(/\D/g, '').slice(0, 6);
        if (trimmed.length < 5) return;
        
        setChecking(true);
        setCheckResult(null);
        try {
            const res = await fetch('/location/check-serviceability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
                body: JSON.stringify({ pincode: trimmed }),
            });
            const data = await res.json();
            setCheckResult({
                serviceable: data.serviceable ?? false,
                zone: data.zone ?? undefined,
            });
        } catch {
            setCheckResult({ serviceable: false });
        } finally {
            setChecking(false);
        }
    };

    const handleCheckMapLocation = async () => {
        if (!mapLocation) return;
        setMapChecking(true);
        setCheckResult(null);
        try {
            const res = await fetch('/location/check-serviceability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
                body: JSON.stringify({
                    latitude: mapLocation.lat,
                    longitude: mapLocation.lng,
                }),
            });
            const data = await res.json();
            setCheckResult({
                serviceable: data.serviceable ?? false,
                zone: data.zone ?? undefined,
            });
        } catch {
            setCheckResult({ serviceable: false });
        } finally {
            setMapChecking(false);
        }
    };

    return (
        <UserLayout>
            <Head title="Delivery location" />
            
            <div className="flex flex-col lg:flex-row w-full h-screen lg:h-[calc(100vh-120px)] mt-[120px] bg-white lg:overflow-hidden">
                
                {/* Left Side: Forms & Map */}
                <div className="w-full lg:w-1/2 h-full overflow-y-auto pb-20 lg:pb-0">
                    <div className="w-full max-w-[640px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
                        
                        <div className="mb-8">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Delivery Location</h1>
                            <p className="mt-3 text-base text-gray-600">
                                Verify serviceability in your area to see accurate product stock and delivery times.
                            </p>
                        </div>

                        <div className="space-y-6">
                            
                            {/* Manage Address Block */}
                            <div className="rounded-2xl border border-[var(--theme-primary-1)]/40 bg-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ring-1 ring-[var(--theme-primary-1)]/10">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-[var(--theme-primary-1)]" />
                                        Saved Addresses
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Login to access and manage your delivery addresses.
                                    </p>
                                </div>
                                <div className="shrink-0">
                                    <Link
                                        href={auth?.user ? "/profile/addresses" : "/login"}
                                        className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl bg-[var(--theme-primary-1)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                                    >
                                        {auth?.user ? 'Manage Addresses' : 'Login to Manage'}
                                    </Link>
                                </div>
                            </div>

                            {/* Pincode Check Form */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Check Pincode</h2>
                                <p className="text-sm text-gray-500 mb-5">Enter your 6-digit postal code below.</p>
                                <form onSubmit={handleCheckPincode}>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            id="pincode"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="e.g. 682502"
                                            className="block w-full rounded-xl border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)] sm:text-sm transition-colors"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        />
                                        <button
                                            type="submit"
                                            disabled={checking || pincode.replace(/\D/g, '').length < 5}
                                            className="shrink-0 rounded-xl bg-[var(--theme-primary-1)] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:bg-gray-300 disabled:text-gray-500 transition-all min-w-[120px]"
                                        >
                                            {checking ? 'Checking...' : 'Check'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">or pick on map</span>
                                </div>
                            </div>

                            {/* Location Search & Map Container */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Search Area</h2>
                                <p className="text-sm text-gray-500 mb-5">Find your building or landmark.</p>
                                
                                <div className="relative mb-5">
                                    <div className="flex flex-col sm:flex-row gap-3 relative">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search area, street, etc..."
                                                className="block w-full rounded-xl border-gray-300 py-3 pl-11 pr-4 text-gray-900 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)] sm:text-sm transition-colors"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSearchLocation}
                                            disabled={isSearching || !searchQuery.trim()}
                                            className="shrink-0 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:bg-gray-300 disabled:text-gray-500 transition-all"
                                        >
                                            {isSearching ? '...' : 'Search'}
                                        </button>
                                    </div>
                                    
                                    {searchResults.length > 0 && (
                                        <div className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5">
                                            <ul className="py-2">
                                                {searchResults.map((res: any) => (
                                                    <li
                                                        key={res.place_id}
                                                        onClick={() => handleSelectSearchResult(res)}
                                                        className="relative cursor-pointer select-none py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-[var(--theme-primary-1)] transition-colors text-sm border-b border-gray-100 last:border-0"
                                                    >
                                                        <span className="block truncate font-medium">{res.display_name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="relative w-full rounded-xl overflow-hidden border border-gray-200">
                                    <div ref={mapContainerRef} className="h-[350px] w-full z-0" />
                                    
                                    <div className="absolute bottom-5 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4">
                                        <button
                                            type="button"
                                            onClick={handleCheckMapLocation}
                                            disabled={mapChecking || !mapLocation}
                                            className="pointer-events-auto shadow-xl bg-[var(--theme-primary-1)] rounded-xl px-6 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-0 disabled:translate-y-4 transition-all duration-300 flex items-center gap-2"
                                        >
                                            <Crosshair className="h-4 w-4" />
                                            {mapChecking ? 'Checking...' : 'Check this area'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Serviceability Result Banner */}
                            {checkResult !== null && (
                                <div
                                    className={`flex items-start gap-4 rounded-2xl border p-5 sm:p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 ${
                                        checkResult.serviceable
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                                            : 'border-rose-200 bg-rose-50 text-rose-900'
                                    }`}
                                >
                                    <div className={`mt-0.5 shrink-0 rounded-full p-2.5 shadow-sm ${checkResult.serviceable ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {checkResult.serviceable ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {checkResult.serviceable ? 'Great news! We serve your area.' : 'Service unavailable.'}
                                        </h3>
                                        <p className={`mt-1 text-sm leading-relaxed ${checkResult.serviceable ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            {checkResult.serviceable && checkResult.zone ? (
                                                <>You belong to the <span className="font-semibold">{checkResult.zone.name}</span> zone in {checkResult.zone.city}.</>
                                            ) : (
                                                'We haven\'t reached your location just yet. We are constantly expanding our delivery network!'
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Serviceable Zones List */}
                            <div className="pt-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Currently active zones</h3>
                                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                                    {zones.length === 0 ? (
                                        <p className="col-span-full text-sm text-gray-500 italic">No zones active.</p>
                                    ) : (
                                        zones.map((zone) => (
                                            <div
                                                key={zone.id}
                                                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                                            >
                                                <div className="bg-white border border-gray-200 p-2 rounded-lg shrink-0">
                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm truncate">{zone.name}</p>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">{zone.city}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Side: Visual Banner */}
                <div className="hidden lg:flex lg:w-1/2 h-full bg-[var(--theme-primary-1)]/5 items-center justify-center p-8 lg:p-12 lg:border-l lg:border-gray-100">
                    <img 
                        src="https://ik.imagekit.io/freshtickstorage/banner/Untitled%20design%20(4).png" 
                        alt="Fresh Dairy Delivery" 
                        className="w-full h-full object-contain"
                    />
                </div>

            </div>
        </UserLayout>
    );
}
