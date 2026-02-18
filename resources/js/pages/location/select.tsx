import { Head, Link, useForm, usePage } from '@inertiajs/react';
import * as L from 'leaflet';
import { MapPin, Search, Check, X } from 'lucide-react';
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
    const { theme } = (usePage().props as unknown as SharedData) ?? {};
    const [pincode, setPincode] = useState('');
    const [checkResult, setCheckResult] = useState<{ serviceable: boolean; zone?: ZoneData } | null>(null);
    const [checking, setChecking] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapChecking, setMapChecking] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (theme) {
            document.documentElement.style.setProperty('--theme-primary-1', theme.primary_1);
            document.documentElement.style.setProperty('--theme-primary-2', theme.primary_2);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
            document.documentElement.style.setProperty('--theme-tertiary', theme.tertiary);
        }
    }, [theme]);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) {
            return;
        }
        if (typeof window === 'undefined') {
            return;
        }
        const map = L.map(mapContainerRef.current).setView([10.0, 76.2], 12);
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

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, []);

    const handleCheckPincode = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = pincode.replace(/\D/g, '').slice(0, 6);
        if (trimmed.length < 5) {
            setCheckResult(null);
            return;
        }
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
        if (!mapLocation) {
            return;
        }
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
                    pincode: pincode.replace(/\D/g, '').slice(0, 6),
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
            <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
                <h1 className="text-2xl font-bold text-gray-900">Set your delivery location</h1>
                <p className="mt-1 text-sm text-gray-600">
                    We deliver to selected areas. Check if your pincode is serviceable or add an address.
                </p>

                <form onSubmit={handleCheckPincode} className="mt-6">
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                        Check pincode
                    </label>
                    <div className="mt-1 flex gap-2">
                        <input
                            id="pincode"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="e.g. 682001"
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                        <button
                            type="submit"
                            disabled={checking || pincode.replace(/\D/g, '').length < 5}
                            className="shrink-0 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70 flex items-center gap-2"
                        >
                            <Search className="h-4 w-4" />
                            {checking ? 'Checking…' : 'Check'}
                        </button>
                    </div>
                </form>

                {checkResult !== null && (
                    <div
                        className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 ${
                            checkResult.serviceable
                                ? 'border-green-200 bg-green-50 text-green-800'
                                : 'border-amber-200 bg-amber-50 text-amber-800'
                        }`}
                    >
                        {checkResult.serviceable ? (
                            <>
                                <Check className="h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-medium">We deliver to this area</p>
                                    {checkResult.zone && (
                                        <p className="text-sm">
                                            {checkResult.zone.name} – {checkResult.zone.city}, {checkResult.zone.state}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <X className="h-5 w-5 shrink-0" />
                                <p className="font-medium">Sorry, we don’t deliver to this pincode yet.</p>
                            </>
                        )}
                    </div>
                )}

                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900">Pick on map (optional)</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Tap on the map to mark your location. We&apos;ll check if that point is inside a delivery zone.
                    </p>
                    <div ref={mapContainerRef} className="mt-3 h-64 w-full overflow-hidden rounded-xl border border-gray-200" />
                    <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-600">
                            {mapLocation
                                ? `Selected location: ${mapLocation.lat.toFixed(5)}, ${mapLocation.lng.toFixed(5)}`
                                : 'No location selected yet. Tap anywhere on the map.'}
                        </div>
                        <button
                            type="button"
                            onClick={handleCheckMapLocation}
                            disabled={mapChecking || !mapLocation}
                            className="shrink-0 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-70 flex items-center gap-2"
                        >
                            <Search className="h-3 w-3" />
                            {mapChecking ? 'Checking…' : 'Check this location'}
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900">Serviceable zones</h2>
                    <ul className="mt-3 space-y-2">
                        {zones.length === 0 ? (
                            <li className="text-sm text-gray-500">No zones configured yet.</li>
                        ) : (
                            zones.map((zone) => (
                                <li
                                    key={zone.id}
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
                                >
                                    <MapPin className="h-4 w-4 shrink-0 text-[var(--theme-primary-1)]" />
                                    <div>
                                        <p className="font-medium text-gray-900">{zone.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {zone.city}, {zone.state} {zone.code && `(${zone.code})`}
                                        </p>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Add your address</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Add a delivery address with a serviceable pincode. We’ll assign your zone automatically.
                    </p>
                    <Link
                        href="/profile/addresses"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        <MapPin className="h-4 w-4" />
                        Manage addresses
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
}
