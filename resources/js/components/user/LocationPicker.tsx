import { router } from '@inertiajs/react';
import * as L from 'leaflet';
import { Crosshair, MapPin, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

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

interface Location {
    address_line_1: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
}

interface LocationPickerProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
    initialLocation?: Location | null;
}

export default function LocationPicker({ onSuccess, onCancel, className = '', initialLocation }: LocationPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(
        initialLocation ? { lat: initialLocation.latitude, lng: initialLocation.longitude } : null
    );
    const [resolvedAddress, setResolvedAddress] = useState<ResolvedAddress | null>(
        initialLocation ? {
            address_line_1: initialLocation.address_line_1,
            city: initialLocation.city,
            state: initialLocation.state,
            pincode: initialLocation.pincode
        } : null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
        }

        const defaultLat = initialLocation?.latitude || 10.081;
        const defaultLng = initialLocation?.longitude || 76.205;
        const defaultZoom = initialLocation ? 15 : 13;

        const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], defaultZoom);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        if (initialLocation) {
             markerRef.current = L.marker([initialLocation.latitude, initialLocation.longitude]).addTo(map);
             setSearchQuery(initialLocation.address_line_1);
        }

        map.on('click', (e: L.LeafletMouseEvent) => {
            handleMapClick(e.latlng.lat, e.latlng.lng);
        });

        // Try to get current location if available and no initial location
        if (!initialLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 15);
                },
                () => {
                    // Ignore error
                }
            );
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [initialLocation]);

    // Update Marker
    useEffect(() => {
        if (!mapInstanceRef.current || !mapLocation) return;

        const { lat, lng } = mapLocation;
        mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        } else {
            markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
        }
    }, [mapLocation]);

    const handleMapClick = async (lat: number, lng: number) => {
        setMapLocation({ lat, lng });
        setResolvedAddress(null);
        setError(null);
        setIsLoading(true);

        try {
            const address = await resolveAddressFromCoordinates(lat, lng);
            setResolvedAddress(address);
        } catch (err) {
            setError('Could not resolve address details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setError(null);
        setSearchResults([]);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`
            );
            const data = await response.json();
            setSearchResults(Array.isArray(data) ? data : []);
            if (!Array.isArray(data) || data.length === 0) {
                setError('No results found.');
            }
        } catch (err) {
            setError('Search failed.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSearchResult = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setMapLocation({ lat, lng });
        setSearchQuery(result.display_name);
        setSearchResults([]);
        handleMapClick(lat, lng);
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleMapClick(latitude, longitude);
            },
            (err) => {
                setError('Unable to retrieve your location.');
                setIsLoading(false);
            }
        );
    };

    const resolveAddressFromCoordinates = async (latitude: number, longitude: number): Promise<ResolvedAddress> => {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

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

    const handleConfirm = async () => {
        if (!mapLocation || !resolvedAddress) return;

        setIsLoading(true);
        setError(null);

        try {
            // Check zone serviceability
            const checkResponse = await fetch('/location/check-serviceability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    latitude: mapLocation.lat,
                    longitude: mapLocation.lng,
                    pincode: resolvedAddress.pincode,
                }),
            });

            const checkData = await checkResponse.json();

            if (!checkData.serviceable) {
                setError('Sorry, we do not deliver to this location yet.');
                setIsLoading(false);
                return;
            }

            // Set location
            router.post(
                '/location/set',
                {
                    from_navbar: true,
                    type: 'home', // Default
                    label: 'Selected Location',
                    address_line_1: resolvedAddress.address_line_1,
                    address_line_2: '',
                    landmark: '',
                    city: resolvedAddress.city,
                    state: resolvedAddress.state,
                    pincode: resolvedAddress.pincode,
                    latitude: mapLocation.lat,
                    longitude: mapLocation.lng,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSearchQuery('');
                        setMapLocation(null);
                        setResolvedAddress(null);
                        onSuccess?.();
                    },
                    onError: (errors) => {
                        setError(errors.location || 'Failed to save location.');
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    },
                }
            );
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search Bar */}
            <div className="relative z-[1000]">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <button 
                            type="button"
                            onClick={handleSearch}
                            className="absolute left-0 top-0 flex h-full w-10 items-center justify-center text-gray-400 hover:text-gray-600"
                        >
                            {isSearching ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                        </button>
                        <input
                            type="text"
                            placeholder="Search for area, street name..."
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <button
                        onClick={handleDetectLocation}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        disabled={isLoading}
                    >
                        <Crosshair className="h-4 w-4" />
                        <span className="hidden sm:inline">Detect</span>
                    </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-[1001] mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {searchResults.map((result) => (
                            <button
                                key={result.place_id}
                                className="flex w-full items-start gap-3 p-3 text-left hover:bg-gray-50"
                                onClick={() => handleSelectSearchResult(result)}
                            >
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                <span className="text-sm text-gray-700">{result.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-80">
                <div ref={mapContainerRef} className="h-full w-full" />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                )}
            </div>

            {/* Selected Location Info */}
            {resolvedAddress && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                            <h4 className="font-medium text-emerald-900">Delivery Location</h4>
                            <p className="text-sm text-emerald-700">{resolvedAddress.address_line_1}</p>
                            <p className="text-xs text-emerald-600 mt-1">
                                {resolvedAddress.city}, {resolvedAddress.state} - {resolvedAddress.pincode}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                )}
                <button
                    onClick={handleConfirm}
                    disabled={!mapLocation || !resolvedAddress || isLoading}
                    className="w-full rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
                >
                    Confirm Location
                </button>
            </div>
        </div>
    );
}
