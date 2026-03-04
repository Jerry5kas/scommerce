import { router, usePage } from '@inertiajs/react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { Crosshair, MapPin, Star, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const GOOGLE_MAP_LIBRARIES: 'places'[] = ['places'];

interface PageProps {
    googleMapsApiKey?: string | null;
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

interface GoogleLocationPickerProps {
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
    city: string;
    state: string;
    pincode: string;
    latitude: number | null;
    longitude: number | null;
    is_default: boolean;
}

interface PlaceLike {
    fetchFields: (options: { fields: string[] }) => Promise<void>;
    location?: google.maps.LatLng | null;
    formattedAddress?: string;
}

interface PlacePredictionLike {
    toPlace: () => PlaceLike;
}

interface PlaceSelectEventLike extends Event {
    placePrediction?: PlacePredictionLike;
}

interface PlaceAutocompleteElementLike extends HTMLElement {
    placeholder?: string;
    includedRegionCodes?: string[];
}

function getCsrfToken(): string {
    const metaToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content;
    if (metaToken) {
        return metaToken;
    }

    const xsrfCookie = document.cookie
        .split('; ')
        .find((part) => part.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    return xsrfCookie ? decodeURIComponent(xsrfCookie) : '';
}

export default function GoogleLocationPicker({ onSuccess, onCancel, className = '', initialLocation, fromNavbar = true }: GoogleLocationPickerProps) {
    const { googleMapsApiKey } = usePage<PageProps>().props;
    const apiKey = typeof googleMapsApiKey === 'string' ? googleMapsApiKey : '';

    const { isLoaded: isGoogleMapsLoaded, loadError: googleMapsLoadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        libraries: GOOGLE_MAP_LIBRARIES,
    });

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
    const [isGeolocating, setIsGeolocating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [serviceabilityStatus, setServiceabilityStatus] = useState<'idle' | 'checking' | 'serviceable' | 'unserviceable'>(
        initialLocation ? 'serviceable' : 'idle',
    );
    const [availableVerticals, setAvailableVerticals] = useState<string[]>([]);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [isAddressLoading, setIsAddressLoading] = useState(true);
    const [showMapPicker, setShowMapPicker] = useState(initialLocation !== null);
    const [placeWidgetError, setPlaceWidgetError] = useState<string | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);
    const placeAutocompleteContainerRef = useRef<HTMLDivElement | null>(null);

    const loadSavedAddresses = useCallback(async (): Promise<void> => {
        setIsAddressLoading(true);

        try {
            const response = await fetch('/location/addresses', {
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                setSavedAddresses([]);
                return;
            }

            const data = await response.json();
            setSavedAddresses(Array.isArray(data.addresses) ? data.addresses : []);
        } catch {
            setSavedAddresses([]);
        } finally {
            setIsAddressLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadSavedAddresses();
    }, [loadSavedAddresses]);

    const resolveAddressFromCoordinates = useCallback(async (lat: number, lng: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setServiceabilityStatus('checking');

        try {
            const response = await fetch('/location/check-serviceability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({ latitude: lat, longitude: lng }),
            });

            if (!response.ok) {
                setServiceabilityStatus('unserviceable');
                setResolvedAddress(null);
                setError('Location is not serviceable.');
                return;
            }

            const data: ServiceabilityResult = await response.json();

            if (!data.serviceable) {
                setServiceabilityStatus('unserviceable');
                setAvailableVerticals([]);
                setResolvedAddress(null);
                setError('Location is outside our delivery area.');
                return;
            }

            setServiceabilityStatus('serviceable');
            setAvailableVerticals(Array.isArray(data.verticals) ? data.verticals : []);

            if (!window.google?.maps) {
                setResolvedAddress({
                    address_line_1: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                    city: '',
                    state: '',
                    pincode: '',
                });
                return;
            }

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status !== 'OK' || !results || !results[0]) {
                    setResolvedAddress({
                        address_line_1: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                        city: '',
                        state: '',
                        pincode: '',
                    });
                    return;
                }

                const result = results[0];
                const getComponent = (type: string): string => {
                    const component = result.address_components.find((addressComponent) => addressComponent.types.includes(type));
                    return component?.long_name ?? '';
                };

                const city = getComponent('administrative_area_level_3') || getComponent('administrative_area_level_2');
                const state = getComponent('administrative_area_level_1');
                const pincode = getComponent('postal_code');

                setResolvedAddress({
                    address_line_1: result.formatted_address,
                    city,
                    state,
                    pincode,
                });
            });
        } catch {
            setServiceabilityStatus('unserviceable');
            setError('Failed to check serviceability. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleMapClick = useCallback(
        (event: google.maps.MapMouseEvent): void => {
            if (!event.latLng) {
                return;
            }

            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setMapLocation({ lat, lng });
            void resolveAddressFromCoordinates(lat, lng);
        },
        [resolveAddressFromCoordinates],
    );

    const handleDetectLocation = useCallback((): void => {
        setError(null);
        setIsGeolocating(true);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setIsGeolocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setMapLocation({ lat, lng });

                if (mapRef.current) {
                    mapRef.current.panTo({ lat, lng });
                    mapRef.current.setZoom(16);
                }

                void resolveAddressFromCoordinates(lat, lng);
                setIsGeolocating(false);
            },
            () => {
                setError('Unable to fetch your location. Please enable location permissions.');
                setIsGeolocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 12000,
                maximumAge: 0,
            },
        );
    }, [resolveAddressFromCoordinates]);

    const handleClearSelection = useCallback((): void => {
        setMapLocation(null);
        setResolvedAddress(null);
        setServiceabilityStatus('idle');
        setAvailableVerticals([]);
        setError(null);

        if (mapRef.current) {
            mapRef.current.panTo(DEFAULT_CENTER);
            mapRef.current.setZoom(6);
        }
    }, []);

    useEffect(() => {
        const container = placeAutocompleteContainerRef.current;

        if (!isGoogleMapsLoaded || !apiKey || !container || !window.google?.maps) {
            return;
        }

        let isCancelled = false;
        let element: PlaceAutocompleteElementLike | null = null;
        let cleanupListener: (() => void) | null = null;

        const initializePlaceWidget = async (): Promise<void> => {
            try {
                const placesLibrary = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary & {
                    PlaceAutocompleteElement?: new (options?: { includedRegionCodes?: string[] }) => PlaceAutocompleteElementLike;
                };

                if (isCancelled) {
                    return;
                }

                const PlaceAutocompleteElementConstructor = placesLibrary.PlaceAutocompleteElement;
                if (!PlaceAutocompleteElementConstructor) {
                    setPlaceWidgetError('Place autocomplete widget is unavailable. Please check Places API (New).');
                    return;
                }

                element = new PlaceAutocompleteElementConstructor({
                    includedRegionCodes: ['in'],
                });
                element.placeholder = 'Search location...';
                element.setAttribute('style', 'display:block;width:100%;');

                const handlePlaceSelect = async (event: Event): Promise<void> => {
                    const placeSelectEvent = event as PlaceSelectEventLike;
                    const customEvent = event as CustomEvent<{ placePrediction?: PlacePredictionLike }>;
                    const placePrediction = placeSelectEvent.placePrediction ?? customEvent.detail?.placePrediction;

                    if (!placePrediction) {
                        return;
                    }

                    const place = placePrediction.toPlace();
                    await place.fetchFields({ fields: ['formattedAddress', 'location'] });

                    if (!place.location) {
                        return;
                    }

                    const lat = place.location.lat();
                    const lng = place.location.lng();

                    setMapLocation({ lat, lng });

                    if (mapRef.current) {
                        mapRef.current.panTo({ lat, lng });
                        mapRef.current.setZoom(16);
                    }

                    void resolveAddressFromCoordinates(lat, lng);
                };

                element.addEventListener('gmp-select', handlePlaceSelect as EventListener);
                cleanupListener = () => {
                    element?.removeEventListener('gmp-select', handlePlaceSelect as EventListener);
                };

                container.innerHTML = '';
                container.appendChild(element);
                setPlaceWidgetError(null);
            } catch {
                if (!isCancelled) {
                    setPlaceWidgetError('Failed to initialize place autocomplete. Please refresh and try again.');
                }
            }
        };

        void initializePlaceWidget();

        return () => {
            isCancelled = true;
            cleanupListener?.();

            container.innerHTML = '';
        };
    }, [apiKey, isGoogleMapsLoaded, resolveAddressFromCoordinates]);

    const handleSelectSavedAddress = useCallback(
        (address: SavedAddress): void => {
            if (address.latitude === null || address.longitude === null) {
                setError('Selected address has no coordinates.');
                return;
            }

            const lat = address.latitude;
            const lng = address.longitude;

            setMapLocation({ lat, lng });
            setResolvedAddress({
                address_line_1: address.address_line_1,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
            });
            setServiceabilityStatus('serviceable');
            setError(null);

            if (mapRef.current) {
                mapRef.current.panTo({ lat, lng });
                mapRef.current.setZoom(16);
            }

            void resolveAddressFromCoordinates(lat, lng);
        },
        [resolveAddressFromCoordinates],
    );

    const handleConfirmLocation = useCallback((): void => {
        if (!mapLocation || !resolvedAddress) {
            setError('Pick a location on the map before confirming.');
            return;
        }

        if (serviceabilityStatus !== 'serviceable') {
            setError('Please pick a serviceable location.');
            return;
        }

        router.post(
            '/location/set',
            {
                from_navbar: fromNavbar,
                type: 'home',
                label: 'Selected Location',
                address_line_1: resolvedAddress.address_line_1,
                city: resolvedAddress.city,
                state: resolvedAddress.state,
                pincode: resolvedAddress.pincode,
                latitude: mapLocation.lat,
                longitude: mapLocation.lng,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                },
                onError: (errors: Record<string, string>) => {
                    setError(errors.location || 'Failed to save location.');
                },
            },
        );
    }, [fromNavbar, mapLocation, onSuccess, resolvedAddress, serviceabilityStatus]);

    return (
        <div className={`space-y-4 ${className}`}>
            {!apiKey && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    Google Maps is not configured. Please set `GOOGLE_MAPS_API_KEY` in your environment.
                </div>
            )}

            {showMapPicker && apiKey && (
                <div className="space-y-3">
                    <div>
                        {isGoogleMapsLoaded ? (
                            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-(--theme-primary-1)">
                                <div ref={placeAutocompleteContainerRef} className="min-h-10 w-full" />
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="Loading places..."
                                disabled
                                className="w-full rounded-lg border border-gray-200 bg-gray-100 py-3 pr-4 pl-4"
                            />
                        )}
                    </div>

                    {placeWidgetError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{placeWidgetError}</div>
                    )}

                    <div className="grid gap-2 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={isGeolocating || !isGoogleMapsLoaded}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <Crosshair className="h-4 w-4" />
                            {isGeolocating ? 'Detecting...' : 'Use My Location'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClearSelection}
                            disabled={!mapLocation && !resolvedAddress}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <X className="h-4 w-4" />
                            Clear Selection
                        </button>
                    </div>

                    <p className="text-xs text-gray-500">Search, detect your location, or tap the map to pin delivery location.</p>

                    <div className="h-96 w-full overflow-hidden rounded-lg border border-gray-200">
                        {googleMapsLoadError ? (
                            <div className="flex h-full items-center justify-center bg-red-50 p-4 text-sm text-red-700">
                                Failed to load Google Maps. Please verify the API key and enabled APIs.
                            </div>
                        ) : !isGoogleMapsLoaded ? (
                            <div className="flex h-full items-center justify-center bg-gray-50 p-4 text-sm text-gray-600">Loading map...</div>
                        ) : (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={mapLocation ?? DEFAULT_CENTER}
                                zoom={mapLocation ? 16 : 6}
                                onLoad={(map) => {
                                    mapRef.current = map;
                                }}
                                onClick={handleMapClick}
                                options={{
                                    streetViewControl: false,
                                    fullscreenControl: true,
                                    mapTypeControl: true,
                                    gestureHandling: 'greedy',
                                }}
                            >
                                {mapLocation && <MarkerF position={mapLocation} />}
                            </GoogleMap>
                        )}
                    </div>

                    {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                    {resolvedAddress && serviceabilityStatus === 'serviceable' && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-900">
                                <MapPin className="h-4 w-4" />
                                Serviceable location
                            </p>
                            <p className="text-sm text-gray-700">{resolvedAddress.address_line_1}</p>
                            <p className="text-xs text-gray-600">
                                {resolvedAddress.city}, {resolvedAddress.state} – {resolvedAddress.pincode}
                            </p>
                            {availableVerticals.length > 0 && (
                                <p className="mt-2 text-xs text-green-700">Available: {availableVerticals.join(', ')}</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!isAddressLoading && savedAddresses.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900">Saved addresses</p>
                    {savedAddresses.map((address) => (
                        <button
                            key={address.id}
                            type="button"
                            onClick={() => handleSelectSavedAddress(address)}
                            className="w-full rounded-lg border border-gray-200 p-3 text-left transition hover:border-(--theme-primary-1) hover:bg-(--theme-primary-1)/5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">{address.label || address.type}</p>
                                    <p className="text-xs text-gray-600">{address.address_line_1}</p>
                                </div>
                                {address.is_default && <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => setShowMapPicker((previous) => !previous)}
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                    {showMapPicker ? 'Hide Map' : 'Show Map'}
                </button>

                <button
                    type="button"
                    onClick={handleConfirmLocation}
                    disabled={isLoading || serviceabilityStatus !== 'serviceable'}
                    className="flex-1 rounded-lg bg-(--theme-primary-1) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--theme-primary-1-dark) disabled:opacity-50"
                >
                    {isLoading ? 'Checking...' : 'Confirm Location'}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
