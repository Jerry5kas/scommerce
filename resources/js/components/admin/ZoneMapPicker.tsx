import L, { type Map as LeafletMap, type Polygon as LeafletPolygon } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface ZoneMapPickerProps {
    value: string;
    onChange: (value: string) => void;
    onAddressSelected?: (data: {
        displayName: string;
        locality?: string;
        city?: string;
        state?: string;
        country?: string;
        postcode?: string;
    }) => void;
}

interface SearchResult {
    lat: number;
    lng: number;
    label: string;
    address?: {
        locality?: string;
        city?: string;
        state?: string;
        country?: string;
        postcode?: string;
    };
}

function parseBoundary(value: string): [number, number][] | null {
    if (!value.trim()) return null;
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return null;
        const cleaned: [number, number][] = [];
        for (const item of parsed) {
            if (!Array.isArray(item) || item.length < 2) continue;
            const lat = Number(item[0]);
            const lng = Number(item[1]);
            if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
            cleaned.push([lat, lng]);
        }
        return cleaned.length ? cleaned : null;
    } catch {
        return null;
    }
}

function serializeBoundary(points: { lat: number; lng: number }[]): string {
    const arr = points.map((p) => [p.lat, p.lng]);
    return JSON.stringify(arr);
}

export default function ZoneMapPicker({ value, onChange, onAddressSelected }: ZoneMapPickerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const polygonRef = useRef<LeafletPolygon | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const onAddressSelectedRef = useRef<ZoneMapPickerProps['onAddressSelected'] | undefined>(undefined);
    const pointsRef = useRef<{ lat: number; lng: number }[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        onAddressSelectedRef.current = onAddressSelected;
    }, [onAddressSelected]);

    useEffect(() => {
        if (!containerRef.current) return;
        if (typeof window === 'undefined') return;
        if (mapRef.current) return;

        try {
            setStatus('loading');

            const mapInstance = L.map(containerRef.current).setView([10.0, 76.2], 12);
            mapRef.current = mapInstance;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors',
            }).addTo(mapInstance);

            const existing = parseBoundary(value);
            if (existing && existing.length >= 3) {
                pointsRef.current = existing.map(([lat, lng]) => ({ lat, lng }));
                const polygon = L.polygon(existing, {
                    color: '#0f766e',
                    weight: 2,
                    fillOpacity: 0.15,
                }).addTo(mapInstance);
                polygonRef.current = polygon;
                mapInstance.fitBounds(polygon.getBounds());
            }

            mapInstance.on('click', async (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;
                pointsRef.current = [...pointsRef.current, { lat, lng }];
                if (polygonRef.current) {
                    polygonRef.current.remove();
                }
                const polygon = L.polygon(
                    pointsRef.current.map((p) => [p.lat, p.lng]),
                    {
                        color: '#0f766e',
                        weight: 2,
                        fillOpacity: 0.15,
                    }
                ).addTo(mapInstance);
                polygonRef.current = polygon;
                onChange(serializeBoundary(pointsRef.current));
                if (markerRef.current) {
                    markerRef.current.setLatLng(e.latlng);
                } else {
                    markerRef.current = L.marker(e.latlng).addTo(mapInstance);
                }
                if (onAddressSelectedRef.current) {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`
                        );
                        if (response.ok) {
                            const data: {
                                display_name?: string;
                                address?: {
                                    city?: string;
                                    town?: string;
                                    village?: string;
                                    suburb?: string;
                                    neighbourhood?: string;
                                    city_district?: string;
                                    state?: string;
                                    postcode?: string;
                                    country?: string;
                                };
                            } = await response.json();
                            const cityLike =
                                data.address?.city ||
                                data.address?.town ||
                                data.address?.village ||
                                data.address?.suburb ||
                                data.address?.city_district;
                            const locality =
                                data.address?.neighbourhood ||
                                data.address?.suburb ||
                                data.address?.city_district ||
                                cityLike;
                            onAddressSelectedRef.current({
                                displayName: data.display_name ?? '',
                                locality: locality || undefined,
                                city: cityLike || undefined,
                                state: data.address?.state,
                                country: data.address?.country,
                                postcode: data.address?.postcode,
                            });
                        }
                    } catch {
                    }
                }
            });

            setStatus('ready');
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
            mapRef.current = null;
            polygonRef.current = null;
            if (markerRef.current) {
                markerRef.current.remove();
            }
            markerRef.current = null;
            pointsRef.current = [];
        };
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        if (!mapRef.current) return;

        setSearching(true);
        setResults([]);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
                    searchQuery
                )}&limit=5`
            );
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data: {
                lat: string;
                lon: string;
                display_name: string;
                address?: {
                    city?: string;
                    town?: string;
                    village?: string;
                    suburb?: string;
                    neighbourhood?: string;
                    city_district?: string;
                    state?: string;
                    postcode?: string;
                    country?: string;
                };
            }[] = await response.json();
            const nextResults: SearchResult[] = data.map((item) => {
                const cityLike =
                    item.address?.city ||
                    item.address?.town ||
                    item.address?.village ||
                    item.address?.suburb ||
                    item.address?.city_district;
                const locality =
                    item.address?.neighbourhood ||
                    item.address?.suburb ||
                    item.address?.city_district ||
                    cityLike;
                return {
                    lat: Number(item.lat),
                    lng: Number(item.lon),
                    label: item.display_name,
                    address: {
                        locality: locality || undefined,
                        city: cityLike || undefined,
                        state: item.address?.state,
                        country: item.address?.country,
                        postcode: item.address?.postcode,
                    },
                };
            });
            setResults(nextResults);
        } catch (error) {
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    const focusResult = (result: SearchResult) => {
        if (!mapRef.current) return;
        const center = L.latLng(result.lat, result.lng);
        mapRef.current.setView(center, Math.max(mapRef.current.getZoom(), 15));
        if (markerRef.current) {
            markerRef.current.setLatLng(center);
        } else {
            markerRef.current = L.marker(center).addTo(mapRef.current);
        }
        if (onAddressSelectedRef.current && result.address) {
            onAddressSelectedRef.current({
                displayName: result.label,
                locality: result.address.locality,
                city: result.address.city,
                state: result.address.state,
                country: result.address.country,
                postcode: result.address.postcode,
            });
        }
    };

    if (status === 'error') {
        return (
            <div className="mt-3 rounded-lg border border-dashed border-red-300 bg-red-50 p-3 text-xs text-red-900">
                Unable to load map: {errorMessage}. You can still save the zone using pincodes only.
            </div>
        );
    }

    return (
        <div className="mt-3 space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            void handleSearch();
                        }
                    }}
                    placeholder="Search a place or area to jump the map"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs shadow-sm"
                />
                <button
                    type="button"
                    disabled={searching}
                    onClick={() => void handleSearch()}
                    className="shrink-0 rounded-lg bg-[var(--admin-dark-primary)] px-3 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-70"
                >
                    {searching ? 'Searching…' : 'Search'}
                </button>
            </div>
            {results.length > 0 && (
                <div className="space-y-1 rounded-lg border border-gray-200 bg-white p-2 text-xs shadow-sm">
                    {results.map((result) => (
                        <button
                            key={`${result.lat}-${result.lng}-${result.label}`}
                            type="button"
                            onClick={() => focusResult(result)}
                            className="block w-full rounded border border-gray-200 bg-gray-50 px-2 py-1 text-left text-[11px] leading-snug hover:bg-gray-100"
                        >
                            {result.label}
                        </button>
                    ))}
                </div>
            )}
            <div className="text-xs text-gray-600">
                Click around the map to outline this zone. Each click adds a corner. When you finish, the coordinates will be filled automatically.
            </div>
            <div ref={containerRef} className="h-72 w-full rounded-lg border border-gray-200" />
            {status === 'loading' && <div className="text-xs text-gray-500">Loading map…</div>}
        </div>
    );
}
