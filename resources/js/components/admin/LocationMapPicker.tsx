import L, { type Map as LeafletMap } from 'leaflet';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

interface SearchResult {
    lat: number;
    lng: number;
    label: string;
}

interface LocationMapPickerProps {
    /** 
     * Controlled latitude & longitude. 
     * Pass current values if editing an existing location.
     */
    latitude?: string | number | null;
    longitude?: string | number | null;
    
    /** Triggered whenever the user drops a pin via map click or search result selection */
    onLocationSelect: (lat: number, lng: number, label?: string) => void;
    
    className?: string;
    mapHeight?: string;
}

export default function LocationMapPicker({
    latitude,
    longitude,
    onLocationSelect,
    className,
    mapHeight = "h-72",
}: LocationMapPickerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;
        if (typeof window === 'undefined') return;
        if (mapRef.current) return;

        try {
            setStatus('loading');

            // Default fallback center (Kochi area) or existing coordinate
            const defaultLat = latitude ? Number(latitude) : 10.027;
            const defaultLng = longitude ? Number(longitude) : 76.308;

            const mapInstance = L.map(containerRef.current).setView([defaultLat, defaultLng], 12);
            mapRef.current = mapInstance;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors',
            }).addTo(mapInstance);

            // Set initial marker if props are valid coordinates
            if (latitude && longitude) {
                markerRef.current = L.marker([Number(latitude), Number(longitude)]).addTo(mapInstance);
            }

            // Map click listener
            mapInstance.on('click', (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;
                
                if (markerRef.current) {
                    markerRef.current.setLatLng(e.latlng);
                } else {
                    markerRef.current = L.marker(e.latlng).addTo(mapInstance);
                }

                onLocationSelect(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
            });

            setStatus('ready');
        } catch (error) {
            setStatus('error');
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []); // Empty initialized once; we rely on marker moving via map click/search

    // Allow external coordinate changes (e.g., if user types lat/lng in input fields manually outside)
    useEffect(() => {
        if (mapRef.current && markerRef.current && latitude && longitude) {
            const lat = Number(latitude);
            const lng = Number(longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                const currentLatLng = markerRef.current.getLatLng();
                if (currentLatLng.lat !== lat || currentLatLng.lng !== lng) {
                    markerRef.current.setLatLng([lat, lng]);
                    mapRef.current.setView([lat, lng], mapRef.current.getZoom());
                }
            }
        }
    }, [latitude, longitude]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        if (!mapRef.current) return;

        setSearching(true);
        setResults([]);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery
                )}&limit=5`
            );
            if (!response.ok) {
                throw new Error('Search failed');
            }
            
            const data: { lat: string; lon: string; display_name: string }[] = await response.json();
            
            const nextResults: SearchResult[] = data.map((item) => ({
                lat: Number(item.lat),
                lng: Number(item.lon),
                label: item.display_name,
            }));
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
        mapRef.current.setView(center, 15);
        
        if (markerRef.current) {
            markerRef.current.setLatLng(center);
        } else {
            markerRef.current = L.marker(center).addTo(mapRef.current);
        }

        onLocationSelect(Number(result.lat.toFixed(6)), Number(result.lng.toFixed(6)), result.label);
        setResults([]); // Clear results after selection
        setSearchQuery(result.label);
    };

    if (status === 'error') {
        return (
            <div className="mt-3 rounded-lg border border-dashed border-red-300 bg-red-50 p-3 text-xs text-red-900">
                Unable to load map.
            </div>
        );
    }

    return (
        <div className={cn("mt-3 space-y-2", className)}>
            <div className="flex flex-col gap-2 sm:flex-row relative z-[9999]">
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
                    placeholder="Search a place to drop pin..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                />
                <button
                    type="button"
                    disabled={searching}
                    onClick={() => void handleSearch()}
                    className="shrink-0 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70 flex items-center gap-2"
                >
                    <Search className="h-4 w-4" />
                    {searching ? '...' : 'Search'}
                </button>
            </div>
            
            {results.length > 0 && (
                <div className="space-y-1 rounded-lg border border-gray-200 bg-white p-2 text-sm shadow-sm max-h-48 overflow-y-auto relative z-[9999]">
                    {results.map((result) => (
                        <button
                            key={`${result.lat}-${result.lng}-${result.label}`}
                            type="button"
                            onClick={() => focusResult(result)}
                            className="block w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-left leading-snug hover:bg-gray-100 transition-colors"
                        >
                            {result.label}
                        </button>
                    ))}
                </div>
            )}
            
            <div
                ref={containerRef}
                className={cn(`w-full rounded-lg border border-gray-300 shadow-inner overflow-hidden`, mapHeight)}
                style={{ zIndex: 1 }} // Keeps map behind the dropdown search results
            />
        </div>
    );
}
