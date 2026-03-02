import { router, useForm } from '@inertiajs/react';
import * as L from 'leaflet';
import { Crosshair, MapPin, Pencil, Plus, Search, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const ADDRESS_TYPES = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' },
] as const;

type AddressType = (typeof ADDRESS_TYPES)[number]['value'];

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
    fromNavbar?: boolean;
}

interface ServiceabilityResult {
    serviceable: boolean;
    verticals: string[];
}

interface SavedAddress {
    id: number;
    type: string;
    label: string | null;
    address_line_1: string;
    address_line_2: string | null;
    landmark: string | null;
    city: string;
    state: string;
    pincode: string;
    latitude: number | null;
    longitude: number | null;
    is_default: boolean;
}

const emptyManualAddress = {
    type: 'home' as AddressType,
    label: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    is_default: false,
    from_location: true,
};

export default function LocationPicker({ onSuccess, onCancel, className = '', initialLocation, fromNavbar = true }: LocationPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(
        initialLocation ? { lat: initialLocation.latitude, lng: initialLocation.longitude } : null,
    );
    const [resolvedAddress, setResolvedAddress] = useState<ResolvedAddress | null>(
        initialLocation
            ? {
                  address_line_1: initialLocation.address_line_1,
                  city: initialLocation.city,
                  state: initialLocation.state,
                  pincode: initialLocation.pincode,
              }
            : null,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [serviceabilityStatus, setServiceabilityStatus] = useState<'idle' | 'checking' | 'serviceable' | 'unserviceable'>('idle');
    const [availableVerticals, setAvailableVerticals] = useState<string[]>([]);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [isAddressLoading, setIsAddressLoading] = useState(true);
    const [canUseSavedAddresses, setCanUseSavedAddresses] = useState(false);
    const [showManualForm, setShowManualForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [showMapPicker, setShowMapPicker] = useState(initialLocation !== null);

    const addAddressForm = useForm(emptyManualAddress);
    const editAddressForm = useForm(emptyManualAddress);

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    const getCsrfToken = (): string => {
        const metaToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content;
        if (metaToken) {
            return metaToken;
        }

        const xsrfCookie = document.cookie
            .split('; ')
            .find((part) => part.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        return xsrfCookie ? decodeURIComponent(xsrfCookie) : '';
    };

    const editingAddress = savedAddresses.find((address) => address.id === editingAddressId);

    const loadSavedAddresses = async () => {
        setIsAddressLoading(true);

        try {
            const response = await fetch('/location/addresses', {
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                setCanUseSavedAddresses(false);
                setSavedAddresses([]);
                return;
            }

            const data = await response.json();
            setCanUseSavedAddresses(!!data.can_manage);
            setSavedAddresses(Array.isArray(data.addresses) ? data.addresses : []);
        } catch {
            setCanUseSavedAddresses(false);
            setSavedAddresses([]);
        } finally {
            setIsAddressLoading(false);
        }
    };

    useEffect(() => {
        loadSavedAddresses();
    }, []);

    useEffect(() => {
        if (!editingAddress) {
            return;
        }

        editAddressForm.setData({
            type: (editingAddress.type || 'home') as AddressType,
            label: editingAddress.label ?? '',
            address_line_1: editingAddress.address_line_1,
            address_line_2: editingAddress.address_line_2 ?? '',
            landmark: editingAddress.landmark ?? '',
            city: editingAddress.city,
            state: editingAddress.state,
            pincode: editingAddress.pincode,
            latitude: editingAddress.latitude !== null ? String(editingAddress.latitude) : '',
            longitude: editingAddress.longitude !== null ? String(editingAddress.longitude) : '',
            is_default: !!editingAddress.is_default,
            from_location: true,
        });
    }, [editingAddress]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddAddress = (event: React.FormEvent) => {
        event.preventDefault();

        if (!canUseSavedAddresses) {
            const latitude = Number(addAddressForm.data.latitude);
            const longitude = Number(addAddressForm.data.longitude);

            if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
                addAddressForm.setError('latitude', 'Latitude and longitude are required for new location.');
                return;
            }

            router.post(
                '/location/set',
                {
                    from_navbar: fromNavbar,
                    type: addAddressForm.data.type,
                    label: addAddressForm.data.label || 'Selected Location',
                    address_line_1: addAddressForm.data.address_line_1,
                    address_line_2: addAddressForm.data.address_line_2,
                    landmark: addAddressForm.data.landmark,
                    city: addAddressForm.data.city,
                    state: addAddressForm.data.state,
                    pincode: addAddressForm.data.pincode,
                    latitude,
                    longitude,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        addAddressForm.reset();
                        setShowManualForm(false);
                        onSuccess?.();
                    },
                    onError: (errors) => {
                        setError((errors.location as string) || 'Failed to save location.');
                    },
                },
            );

            return;
        }

        addAddressForm.post('/profile/addresses', {
            preserveScroll: true,
            onSuccess: async () => {
                addAddressForm.reset();
                setShowManualForm(false);
                await loadSavedAddresses();
            },
        });
    };

    const handleUpdateAddress = (event: React.FormEvent) => {
        event.preventDefault();

        if (!editingAddressId) {
            return;
        }

        editAddressForm.put(`/profile/addresses/${editingAddressId}`, {
            preserveScroll: true,
            onSuccess: async () => {
                setEditingAddressId(null);
                setShowManualForm(false);
                await loadSavedAddresses();
            },
        });
    };

    const handleSetDefaultAddress = (addressId: number) => {
        router.post(
            `/profile/addresses/${addressId}/default`,
            { from_location: true },
            {
                preserveScroll: true,
                onSuccess: () => {
                    loadSavedAddresses();
                },
            },
        );
    };

    const handleEditAddress = (address: SavedAddress) => {
        setEditingAddressId(address.id);
        setShowManualForm(true);
    };

    const handleSelectSavedAddress = (address: SavedAddress) => {
        if (address.latitude === null || address.longitude === null) {
            setError('This address has no map pin. Edit it and add latitude/longitude before selecting.');
            handleEditAddress(address);
            return;
        }

        setIsLoading(true);
        setError(null);

        router.post(
            '/location/set',
            {
                from_navbar: fromNavbar,
                type: address.type,
                label: address.label || 'Saved Address',
                address_line_1: address.address_line_1,
                address_line_2: address.address_line_2 || '',
                landmark: address.landmark || '',
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                latitude: address.latitude,
                longitude: address.longitude,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                },
                onError: (errors) => {
                    setError(errors.location || 'Failed to use selected address.');
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    // Initialize Map
    useEffect(() => {
        if ((!showMapPicker && canUseSavedAddresses && savedAddresses.length > 0) || !mapContainerRef.current) {
            return;
        }

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
                    if (mapInstanceRef.current === map && (map as unknown as { _loaded?: boolean })._loaded) {
                        map.setView([latitude, longitude], 15);
                    }
                },
                () => {
                    // Ignore error
                },
            );
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [initialLocation, showMapPicker, canUseSavedAddresses, savedAddresses.length]);

    // Update Marker
    useEffect(() => {
        if (!mapInstanceRef.current || !mapLocation) return;

        const map = mapInstanceRef.current;
        if (!(map as unknown as { _loaded?: boolean })._loaded) {
            return;
        }

        const { lat, lng } = mapLocation;
        map.setView([lat, lng], map.getZoom());

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        } else {
            markerRef.current = L.marker([lat, lng]).addTo(map);
        }
    }, [mapLocation]);

    const handleMapClick = async (lat: number, lng: number) => {
        setMapLocation({ lat, lng });
        setResolvedAddress(null);
        setError(null);
        setServiceabilityStatus('checking');
        setAvailableVerticals([]);
        setIsLoading(true);

        try {
            const address = await resolveAddressFromCoordinates(lat, lng);
            setResolvedAddress(address);
            const serviceability = await checkServiceability(lat, lng, address.pincode);
            setServiceabilityStatus(serviceability.serviceable ? 'serviceable' : 'unserviceable');
            setAvailableVerticals(serviceability.verticals);
        } catch {
            setError('Could not resolve address details.');
            setServiceabilityStatus('idle');
            setAvailableVerticals([]);
        } finally {
            setIsLoading(false);
        }
    };

    const checkServiceability = async (latitude: number, longitude: number, pincode: string): Promise<ServiceabilityResult> => {
        const checkResponse = await fetch('/location/check-serviceability', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({
                latitude,
                longitude,
                pincode,
            }),
        });

        if (!checkResponse.ok) {
            throw new Error('Serviceability check failed');
        }

        const checkData = await checkResponse.json();

        return {
            serviceable: !!checkData.serviceable,
            verticals: Array.isArray(checkData.verticals) ? checkData.verticals : [],
        };
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setError(null);
        setSearchResults([]);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`,
            );
            const data = await response.json();
            setSearchResults(Array.isArray(data) ? data : []);
            if (!Array.isArray(data) || data.length === 0) {
                setError('No results found.');
            }
        } catch {
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
            () => {
                setError('Unable to retrieve your location.');
                setIsLoading(false);
            },
        );
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

    const handleConfirm = async () => {
        if (!mapLocation || !resolvedAddress) return;

        setIsLoading(true);
        setError(null);

        try {
            // Check zone serviceability
            const serviceability = await checkServiceability(mapLocation.lat, mapLocation.lng, resolvedAddress.pincode);

            if (!serviceability.serviceable) {
                setError('Sorry, we do not deliver to this location yet.');
                setServiceabilityStatus('unserviceable');
                setAvailableVerticals([]);
                setIsLoading(false);
                return;
            }

            setServiceabilityStatus('serviceable');
            setAvailableVerticals(serviceability.verticals);

            // Set location
            router.post(
                '/location/set',
                {
                    from_navbar: fromNavbar,
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
                },
            );
        } catch {
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    const serviceabilityBadgeClass =
        serviceabilityStatus === 'serviceable'
            ? 'bg-emerald-50 text-emerald-700'
            : serviceabilityStatus === 'unserviceable'
              ? 'bg-red-50 text-red-700'
              : 'bg-amber-50 text-amber-700';

    const serviceabilityBadgeText =
        serviceabilityStatus === 'serviceable'
            ? 'Serviceable area'
            : serviceabilityStatus === 'unserviceable'
              ? 'Not serviceable yet'
              : 'Checking serviceability…';

    const resolvedAddressLine1 = resolvedAddress?.address_line_1 ?? '';
    const resolvedAddressLine2 = resolvedAddress ? `${resolvedAddress.city}, ${resolvedAddress.state} ${resolvedAddress.pincode}` : '';
    const verticalLabelMap: Record<string, string> = {
        daily_fresh: 'Daily Fresh',
        society_fresh: 'Society Fresh',
    };
    const availableVerticalLabels = availableVerticals.map((vertical) => verticalLabelMap[vertical] ?? vertical).join(' • ');
    const shouldShowMapPicker = showMapPicker || !canUseSavedAddresses || savedAddresses.length === 0;

    return (
        <div className={`pb-4 ${className}`}>
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4 lg:space-y-0">
                <section className="space-y-4 lg:space-y-3">
                    <div className="relative z-1000">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="absolute top-0 left-0 flex h-full w-10 items-center justify-center text-gray-400 hover:text-gray-600"
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
                                    className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-(--theme-primary-1) focus:ring-1 focus:ring-(--theme-primary-1) focus:outline-none"
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

                        {searchResults.length > 0 && (
                            <div className="absolute top-full right-0 left-0 z-1001 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
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

                    <div className={`${shouldShowMapPicker ? 'block' : 'hidden'} relative h-60 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-72 lg:block lg:h-80 xl:h-96`}>
                        <div ref={mapContainerRef} className="h-full w-full" />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--theme-primary-1) border-t-transparent" />
                            </div>
                        )}
                    </div>

                    {resolvedAddress && (
                        <div className="rounded-lg border border-(--theme-primary-1)/20 bg-(--theme-primary-1)/8 p-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-1 h-5 w-5 shrink-0 text-(--theme-primary-1)" />
                                <div>
                                    <h4 className="font-medium text-(--theme-primary-1-dark)">Delivery Location</h4>
                                    <p className="text-sm text-(--theme-primary-1-dark)">{resolvedAddressLine1}</p>
                                    <p className="mt-1 text-xs text-(--theme-primary-1-dark)">{resolvedAddressLine2}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                    {resolvedAddress && (
                        <div
                            className={`hidden sm:inline-flex sm:items-center sm:rounded-full sm:px-2.5 sm:py-1 sm:text-xs sm:font-semibold ${serviceabilityBadgeClass}`}
                        >
                            {serviceabilityBadgeText}
                        </div>
                    )}

                    {availableVerticals.length > 0 && (
                        <p className="hidden text-xs font-medium text-gray-600 sm:block">Available: {availableVerticalLabels}</p>
                    )}

                    <div className="hidden justify-end gap-3 pt-2 sm:flex lg:hidden">
                        {onCancel && (
                            <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleConfirm}
                            disabled={!mapLocation || !resolvedAddress || isLoading}
                            className="w-full rounded-lg bg-(--theme-primary-1) px-6 py-2 text-sm font-medium text-white hover:bg-(--theme-primary-1-dark) disabled:opacity-50 sm:w-auto"
                        >
                            Confirm Location
                        </button>
                    </div>

                    <div className="hidden lg:flex lg:justify-end lg:gap-3 lg:pt-1">
                        {onCancel && (
                            <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleConfirm}
                            disabled={!mapLocation || !resolvedAddress || isLoading}
                            className="rounded-lg bg-(--theme-primary-1) px-6 py-2.5 text-sm font-semibold text-white hover:bg-(--theme-primary-1-dark) disabled:opacity-50"
                        >
                            Confirm Location
                        </button>
                    </div>
                </section>

                <aside className="space-y-4 lg:space-y-3">
                    <div className="space-y-3 lg:space-y-2">
                        <div className="rounded-2xl border border-gray-200 bg-white">
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={isLoading}
                                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-(--theme-primary-1) disabled:opacity-60 lg:py-2.5"
                            >
                                <span className="flex items-center gap-2">
                                    <Crosshair className="h-4 w-4" />
                                    Use my current location
                                </span>
                            </button>
                            <div className="h-px bg-gray-100" />
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingAddressId(null);
                                    setShowManualForm(true);
                                }}
                                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-(--theme-primary-1) lg:py-2.5"
                            >
                                <span className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add new address
                                </span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowMapPicker((value) => !value)}
                            className="text-xs font-medium text-gray-600 underline-offset-2 hover:text-gray-800 hover:underline lg:hidden"
                        >
                            {shouldShowMapPicker ? 'Hide map picker' : 'Open map picker'}
                        </button>
                    </div>

                    {canUseSavedAddresses && !isAddressLoading && savedAddresses.length > 0 && (
                        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 lg:space-y-2 lg:p-3">
                            <h3 className="text-lg font-bold text-gray-900">Saved Addresses</h3>

                            <div className="space-y-2.5 lg:space-y-2">
                                {savedAddresses.map((address) => (
                                    <div key={address.id} className="rounded-xl border border-gray-200 p-3 lg:p-2.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {address.label ||
                                                            ADDRESS_TYPES.find((item) => item.value === address.type)?.label ||
                                                            'Address'}
                                                    </p>
                                                    {address.is_default && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs text-gray-600">
                                                    {address.address_line_1}
                                                    {address.address_line_2 ? `, ${address.address_line_2}` : ''}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {address.city}, {address.state} {address.pincode}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2 lg:mt-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSelectSavedAddress(address)}
                                                disabled={isLoading}
                                                className="rounded-lg bg-(--theme-primary-1) px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                                            >
                                                Deliver here
                                            </button>
                                            {!address.is_default && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetDefaultAddress(address.id)}
                                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700"
                                                >
                                                    Set default
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleEditAddress(address)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {showManualForm && (
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-3">
                            <h3 className="text-base font-semibold text-gray-900">{editingAddressId ? 'Edit address' : 'Add new address'}</h3>

                            <form
                                onSubmit={editingAddressId ? handleUpdateAddress : handleAddAddress}
                                className="mt-3 space-y-3 lg:mt-2 lg:space-y-2"
                            >
                                <div>
                                    <label className="block text-xs font-medium text-gray-600">Type</label>
                                    <select
                                        value={editingAddressId ? editAddressForm.data.type : addAddressForm.data.type}
                                        onChange={(event) => {
                                            const selectedType = event.target.value as AddressType;
                                            if (editingAddressId) {
                                                editAddressForm.setData('type', selectedType);
                                            } else {
                                                addAddressForm.setData('type', selectedType);
                                            }
                                        }}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    >
                                        {ADDRESS_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Label (Home, Work...)"
                                    value={editingAddressId ? editAddressForm.data.label : addAddressForm.data.label}
                                    onChange={(event) => {
                                        if (editingAddressId) {
                                            editAddressForm.setData('label', event.target.value);
                                        } else {
                                            addAddressForm.setData('label', event.target.value);
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Address line 1"
                                    value={editingAddressId ? editAddressForm.data.address_line_1 : addAddressForm.data.address_line_1}
                                    onChange={(event) => {
                                        if (editingAddressId) {
                                            editAddressForm.setData('address_line_1', event.target.value);
                                        } else {
                                            addAddressForm.setData('address_line_1', event.target.value);
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Address line 2"
                                    value={editingAddressId ? editAddressForm.data.address_line_2 : addAddressForm.data.address_line_2}
                                    onChange={(event) => {
                                        if (editingAddressId) {
                                            editAddressForm.setData('address_line_2', event.target.value);
                                        } else {
                                            addAddressForm.setData('address_line_2', event.target.value);
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={editingAddressId ? editAddressForm.data.city : addAddressForm.data.city}
                                        onChange={(event) => {
                                            if (editingAddressId) {
                                                editAddressForm.setData('city', event.target.value);
                                            } else {
                                                addAddressForm.setData('city', event.target.value);
                                            }
                                        }}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={editingAddressId ? editAddressForm.data.state : addAddressForm.data.state}
                                        onChange={(event) => {
                                            if (editingAddressId) {
                                                editAddressForm.setData('state', event.target.value);
                                            } else {
                                                addAddressForm.setData('state', event.target.value);
                                            }
                                        }}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        value={editingAddressId ? editAddressForm.data.pincode : addAddressForm.data.pincode}
                                        onChange={(event) => {
                                            if (editingAddressId) {
                                                editAddressForm.setData('pincode', event.target.value);
                                            } else {
                                                addAddressForm.setData('pincode', event.target.value);
                                            }
                                        }}
                                        className="col-span-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="Latitude"
                                        value={editingAddressId ? editAddressForm.data.latitude : addAddressForm.data.latitude}
                                        onChange={(event) => {
                                            if (editingAddressId) {
                                                editAddressForm.setData('latitude', event.target.value);
                                            } else {
                                                addAddressForm.setData('latitude', event.target.value);
                                            }
                                        }}
                                        className="col-span-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="Longitude"
                                        value={editingAddressId ? editAddressForm.data.longitude : addAddressForm.data.longitude}
                                        onChange={(event) => {
                                            if (editingAddressId) {
                                                editAddressForm.setData('longitude', event.target.value);
                                            } else {
                                                addAddressForm.setData('longitude', event.target.value);
                                            }
                                        }}
                                        className="col-span-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                {(addAddressForm.errors.address_line_1 ||
                                    editAddressForm.errors.address_line_1 ||
                                    addAddressForm.errors.city ||
                                    editAddressForm.errors.city ||
                                    addAddressForm.errors.latitude) && (
                                    <p className="text-xs text-red-600">
                                        {addAddressForm.errors.latitude ||
                                            editAddressForm.errors.address_line_1 ||
                                            addAddressForm.errors.address_line_1 ||
                                            editAddressForm.errors.city ||
                                            addAddressForm.errors.city}
                                    </p>
                                )}

                                <div className="flex items-center gap-2">
                                    <button
                                        type="submit"
                                        disabled={addAddressForm.processing || editAddressForm.processing}
                                        className="rounded-lg bg-(--theme-primary-1) px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                                    >
                                        {editingAddressId ? 'Update address' : 'Save address'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowManualForm(false);
                                            setEditingAddressId(null);
                                            addAddressForm.reset();
                                            editAddressForm.reset();
                                        }}
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {canUseSavedAddresses && isAddressLoading && <p className="text-xs text-gray-500">Loading saved addresses…</p>}
                </aside>
            </div>

            {shouldShowMapPicker && (
                <div className="border-t border-gray-200 bg-white p-3 sm:hidden">
                    <div className="mx-auto max-w-6xl space-y-2">
                        {resolvedAddress && (
                            <div className="rounded-lg border border-(--theme-primary-1)/20 bg-(--theme-primary-1)/8 px-3 py-2.5">
                                <p className="truncate text-xs font-semibold text-(--theme-primary-1-dark)">Deliver to: {resolvedAddressLine1}</p>
                                <p className="truncate text-[11px] text-(--theme-primary-1-dark)">{resolvedAddressLine2}</p>
                            </div>
                        )}

                        {resolvedAddress && (
                            <div
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${serviceabilityBadgeClass}`}
                            >
                                {serviceabilityBadgeText}
                            </div>
                        )}

                        {availableVerticals.length > 0 && (
                            <p className="text-[11px] font-medium text-gray-600">Available: {availableVerticalLabels}</p>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={isLoading}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50"
                                aria-label="Detect current location"
                            >
                                <Crosshair className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={!mapLocation || !resolvedAddress || isLoading}
                                className="flex-1 rounded-lg bg-(--theme-primary-1) px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                            >
                                {isLoading ? 'Please wait…' : 'Confirm Location'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
