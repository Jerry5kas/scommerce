import { router, useForm, usePage } from '@inertiajs/react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Crosshair, MapPin, Pencil, Plus, Search, Star, X } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const GOOGLE_MAP_LIBRARIES: 'places'[] = ['places'];

const ADDRESS_TYPES = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' },
] as const;

type AddressType = (typeof ADDRESS_TYPES)[number]['value'];

interface SearchResult {
    id: string;
    primaryText: string;
    secondaryText: string;
    prediction: PlacePredictionLike;
}

interface AddressComponentLike {
    longText?: string;
    long_name?: string;
    types?: string[];
}

interface PlaceLike {
    fetchFields: (options: { fields: string[] }) => Promise<void>;
    location?: google.maps.LatLng | null;
    formattedAddress?: string;
    displayName?: string | { text?: string };
    addressComponents?: AddressComponentLike[];
}

interface PlacePredictionLike {
    text?: { toString: () => string };
    placeId?: string;
    toPlace: () => PlaceLike;
}

interface PlaceSuggestionLike {
    placePrediction?: PlacePredictionLike;
}

interface AutocompleteSuggestionStaticLike {
    fetchAutocompleteSuggestions: (request: Record<string, unknown>) => Promise<{ suggestions?: PlaceSuggestionLike[] }>;
}

interface PlacesLibraryLike extends google.maps.PlacesLibrary {
    AutocompleteSuggestion?: AutocompleteSuggestionStaticLike;
    AutocompleteSessionToken?: new () => unknown;
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

interface PageProps {
    googleMapsApiKey?: string | null;
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
    const { googleMapsApiKey } = usePage<PageProps>().props;
    const apiKey = typeof googleMapsApiKey === 'string' ? googleMapsApiKey : '';

    const { isLoaded: isGoogleMapsLoaded, loadError: googleMapsLoadError } = useJsApiLoader({
        id: 'location-picker-google-map-script',
        googleMapsApiKey: apiKey,
        libraries: GOOGLE_MAP_LIBRARIES,
    });

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
    const [placesAutocompleteError, setPlacesAutocompleteError] = useState<string | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    const addAddressForm = useForm(emptyManualAddress);
    const editAddressForm = useForm(emptyManualAddress);

    const mapRef = useRef<google.maps.Map | null>(null);
    const advancedMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const hasInitialLocationAttemptedRef = useRef(false);
    const placesLibraryRef = useRef<PlacesLibraryLike | null>(null);
    const placesSessionTokenRef = useRef<unknown | null>(null);
    const placesSearchRequestIdRef = useRef(0);

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

    const panMapToLocation = useCallback((lat: number, lng: number, zoom = 17): void => {
        if (!mapRef.current) {
            return;
        }

        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(zoom);
    }, []);

    const ensureAdvancedMarker = useCallback(async (): Promise<google.maps.marker.AdvancedMarkerElement | null> => {
        if (!mapRef.current || !window.google?.maps) {
            return null;
        }

        if (advancedMarkerRef.current) {
            advancedMarkerRef.current.map = mapRef.current;
            return advancedMarkerRef.current;
        }

        const markerLibrary = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;
        const marker = new markerLibrary.AdvancedMarkerElement({
            map: mapRef.current,
            title: 'Delivery location',
        });

        advancedMarkerRef.current = marker;
        return marker;
    }, []);

    useEffect(() => {
        let isCancelled = false;

        const syncMarker = async (): Promise<void> => {
            if (!isMapReady) {
                return;
            }

            if (!mapLocation) {
                if (advancedMarkerRef.current) {
                    advancedMarkerRef.current.map = null;
                }
                return;
            }

            panMapToLocation(mapLocation.lat, mapLocation.lng);

            const marker = await ensureAdvancedMarker();
            if (!marker || isCancelled) {
                return;
            }

            marker.map = mapRef.current;
            marker.position = mapLocation;
        };

        void syncMarker();

        return () => {
            isCancelled = true;
        };
    }, [ensureAdvancedMarker, isMapReady, mapLocation, panMapToLocation]);

    const ensurePlacesLibrary = useCallback(async (): Promise<PlacesLibraryLike> => {
        if (placesLibraryRef.current) {
            return placesLibraryRef.current;
        }

        const placesLibrary = (await google.maps.importLibrary('places')) as PlacesLibraryLike;
        placesLibraryRef.current = placesLibrary;

        return placesLibrary;
    }, []);

    const ensurePlacesSessionToken = useCallback(async (): Promise<unknown | null> => {
        const placesLibrary = await ensurePlacesLibrary();

        if (!placesLibrary.AutocompleteSessionToken) {
            return null;
        }

        if (placesSessionTokenRef.current === null) {
            placesSessionTokenRef.current = new placesLibrary.AutocompleteSessionToken();
        }

        return placesSessionTokenRef.current;
    }, [ensurePlacesLibrary]);

    const refreshPlacesSessionToken = useCallback(async (): Promise<void> => {
        const placesLibrary = await ensurePlacesLibrary();

        if (!placesLibrary.AutocompleteSessionToken) {
            placesSessionTokenRef.current = null;
            return;
        }

        placesSessionTokenRef.current = new placesLibrary.AutocompleteSessionToken();
    }, [ensurePlacesLibrary]);

    const checkServiceability = useCallback(async (latitude: number, longitude: number, pincode: string): Promise<ServiceabilityResult> => {
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
            throw new Error('Unable to check serviceability. Please try again.');
        }

        const checkData = await checkResponse.json();

        return {
            serviceable: !!checkData.serviceable,
            verticals: Array.isArray(checkData.verticals) ? checkData.verticals : [],
        };
    }, []);

    const getAddressComponent = useCallback((components: AddressComponentLike[], type: string): string => {
        const component = components.find((item) => Array.isArray(item.types) && item.types.includes(type));

        if (!component) {
            return '';
        }

        if (typeof component.longText === 'string' && component.longText.trim() !== '') {
            return component.longText;
        }

        if (typeof component.long_name === 'string' && component.long_name.trim() !== '') {
            return component.long_name;
        }

        return '';
    }, []);

    const buildResolvedAddress = useCallback(
        (formattedAddress: string | undefined, addressComponents: AddressComponentLike[]): ResolvedAddress => {
            const city =
                getAddressComponent(addressComponents, 'locality') ||
                getAddressComponent(addressComponents, 'sublocality_level_1') ||
                getAddressComponent(addressComponents, 'administrative_area_level_3') ||
                getAddressComponent(addressComponents, 'administrative_area_level_2');

            const state = getAddressComponent(addressComponents, 'administrative_area_level_1');
            const rawPincode = getAddressComponent(addressComponents, 'postal_code');
            const pincode = rawPincode.replace(/\D/g, '').slice(0, 10);

            const fallbackLine1 = [
                getAddressComponent(addressComponents, 'premise'),
                getAddressComponent(addressComponents, 'route'),
                getAddressComponent(addressComponents, 'sublocality'),
            ]
                .filter((value) => value !== '')
                .join(', ');

            return {
                address_line_1: (formattedAddress && formattedAddress.trim() !== '' ? formattedAddress : fallbackLine1) || 'Selected location',
                city,
                state,
                pincode,
            };
        },
        [getAddressComponent],
    );

    const resolveAddressFromCoordinates = useCallback(
        async (latitude: number, longitude: number): Promise<ResolvedAddress> => {
            if (!window.google?.maps) {
                throw new Error('Google Maps is unavailable.');
            }

            const geocoder = new google.maps.Geocoder();
            const geocoderResult = await geocoder.geocode({
                location: { lat: latitude, lng: longitude },
            });

            const firstResult = geocoderResult.results?.[0];
            if (!firstResult) {
                throw new Error('No address found for this point.');
            }

            const components = (firstResult.address_components ?? []) as unknown as AddressComponentLike[];

            return buildResolvedAddress(firstResult.formatted_address, components);
        },
        [buildResolvedAddress],
    );

    const handleMapClick = useCallback(
        async (lat: number, lng: number) => {
            setMapLocation({ lat, lng });
            setResolvedAddress(null);
            setError(null);
            setServiceabilityStatus('checking');
            setAvailableVerticals([]);
            setIsLoading(true);

            let resolved: ResolvedAddress;

            try {
                resolved = await resolveAddressFromCoordinates(lat, lng);
                setResolvedAddress(resolved);
            } catch {
                setError('Unable to resolve address for this pin. Please try another point.');
                setServiceabilityStatus('idle');
                setAvailableVerticals([]);
                setIsLoading(false);
                return;
            }

            try {
                const serviceability = await checkServiceability(lat, lng, resolved.pincode);
                setServiceabilityStatus(serviceability.serviceable ? 'serviceable' : 'unserviceable');
                setAvailableVerticals(serviceability.verticals);
            } catch {
                setError('Unable to check serviceability right now. Please try again.');
                setServiceabilityStatus('idle');
                setAvailableVerticals([]);
            } finally {
                setIsLoading(false);
            }
        },
        [resolveAddressFromCoordinates, checkServiceability],
    );

    const handleGoogleMapClick = useCallback(
        (event: google.maps.MapMouseEvent): void => {
            if (!event.latLng) {
                return;
            }

            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            void handleMapClick(lat, lng);
        },
        [handleMapClick],
    );

    useEffect(() => {
        if (!isGoogleMapsLoaded || hasInitialLocationAttemptedRef.current) {
            return;
        }

        hasInitialLocationAttemptedRef.current = true;

        if (initialLocation || mapLocation || !navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                panMapToLocation(latitude, longitude);
                void handleMapClick(latitude, longitude);
            },
            () => {
                // ignore failure silently; user can search or open map picker
            },
            {
                enableHighAccuracy: true,
                timeout: 12000,
                maximumAge: 0,
            },
        );
    }, [handleMapClick, initialLocation, isGoogleMapsLoaded, mapLocation, panMapToLocation]);

    const handleSearch = useCallback(
        async (query: string): Promise<void> => {
            const trimmedQuery = query.trim();

            if (trimmedQuery.length < 2) {
                setSearchResults([]);
                setIsSearching(false);
                setPlacesAutocompleteError(null);
                return;
            }

            if (!isGoogleMapsLoaded || !window.google?.maps) {
                return;
            }

            const requestId = ++placesSearchRequestIdRef.current;

            setIsSearching(true);
            setError(null);
            setPlacesAutocompleteError(null);

            try {
                const placesLibrary = await ensurePlacesLibrary();
                const autocompleteSuggestion = placesLibrary.AutocompleteSuggestion;

                if (!autocompleteSuggestion) {
                    throw new Error('AutocompleteSuggestion API unavailable');
                }

                const sessionToken = await ensurePlacesSessionToken();
                const mapCenter = mapRef.current?.getCenter();

                const buildRequest = (options: { withIndiaHint: boolean; withMapBias: boolean }): Record<string, unknown> => {
                    const request: Record<string, unknown> = {
                        input: trimmedQuery,
                        language: 'en-US',
                    };

                    if (sessionToken !== null) {
                        request.sessionToken = sessionToken;
                    }

                    if (options.withIndiaHint) {
                        request.includedRegionCodes = ['in'];
                        request.region = 'in';
                    }

                    if (mapCenter) {
                        const center = {
                            lat: mapCenter.lat(),
                            lng: mapCenter.lng(),
                        };

                        request.origin = center;

                        if (options.withMapBias) {
                            request.locationBias = {
                                center,
                                radius: 50000,
                            };
                        }
                    }

                    return request;
                };

                const mapSuggestionsToResults = (suggestions?: PlaceSuggestionLike[]): SearchResult[] => {
                    return (Array.isArray(suggestions) ? suggestions : [])
                        .map((suggestion, index) => {
                            const prediction = suggestion.placePrediction;
                            if (!prediction) {
                                return null;
                            }

                            const label = prediction.text?.toString().trim() ?? '';
                            if (label === '') {
                                return null;
                            }

                            const [primaryText, ...secondaryParts] = label.split(',');

                            return {
                                id: prediction.placeId ?? `${label}-${index}`,
                                primaryText: primaryText.trim(),
                                secondaryText: secondaryParts.join(',').trim(),
                                prediction,
                            };
                        })
                        .filter((result): result is SearchResult => result !== null);
                };

                const primaryResponse = await autocompleteSuggestion.fetchAutocompleteSuggestions(
                    buildRequest({ withIndiaHint: true, withMapBias: true }),
                );

                if (requestId !== placesSearchRequestIdRef.current) {
                    return;
                }

                let nextResults = mapSuggestionsToResults(primaryResponse.suggestions);

                if (nextResults.length === 0) {
                    const fallbackResponse = await autocompleteSuggestion.fetchAutocompleteSuggestions(
                        buildRequest({ withIndiaHint: false, withMapBias: false }),
                    );

                    if (requestId !== placesSearchRequestIdRef.current) {
                        return;
                    }

                    nextResults = mapSuggestionsToResults(fallbackResponse.suggestions);
                }

                setSearchResults(nextResults);
            } catch {
                if (requestId !== placesSearchRequestIdRef.current) {
                    return;
                }

                setSearchResults([]);
                setPlacesAutocompleteError('Place suggestions are unavailable. Please check Places API (New).');
            } finally {
                if (requestId === placesSearchRequestIdRef.current) {
                    setIsSearching(false);
                }
            }
        },
        [ensurePlacesLibrary, ensurePlacesSessionToken, isGoogleMapsLoaded],
    );

    useEffect(() => {
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            setPlacesAutocompleteError(null);
            return;
        }

        const timer = window.setTimeout(() => {
            void handleSearch(trimmedQuery);
        }, 300);

        return () => {
            window.clearTimeout(timer);
        };
    }, [handleSearch, searchQuery]);

    const handleSelectSearchResult = useCallback(
        async (result: SearchResult): Promise<void> => {
            setSearchResults([]);
            setPlacesAutocompleteError(null);
            setError(null);

            try {
                const place = result.prediction.toPlace();
                await place.fetchFields({
                    fields: ['formattedAddress', 'location', 'addressComponents'],
                });

                const selectedLabel =
                    place.formattedAddress ?? `${result.primaryText}${result.secondaryText !== '' ? `, ${result.secondaryText}` : ''}`;

                setSearchQuery(selectedLabel);

                if (!place.location) {
                    setError('Could not resolve selected place coordinates.');
                    return;
                }

                const resolvedFromPlace = buildResolvedAddress(
                    place.formattedAddress,
                    Array.isArray(place.addressComponents) ? place.addressComponents : [],
                );

                await refreshPlacesSessionToken();

                const lat = place.location.lat();
                const lng = place.location.lng();

                setMapLocation({ lat, lng });
                setResolvedAddress(resolvedFromPlace);
                setServiceabilityStatus('checking');
                setAvailableVerticals([]);
                setIsLoading(true);
                panMapToLocation(lat, lng);

                try {
                    const serviceability = await checkServiceability(lat, lng, resolvedFromPlace.pincode);
                    setServiceabilityStatus(serviceability.serviceable ? 'serviceable' : 'unserviceable');
                    setAvailableVerticals(serviceability.verticals);
                } catch {
                    setError('Unable to check serviceability right now. Please try again.');
                    setServiceabilityStatus('idle');
                    setAvailableVerticals([]);
                } finally {
                    setIsLoading(false);
                }
            } catch {
                setError('Unable to load selected place details. Please try another suggestion.');
            }
        },
        [buildResolvedAddress, checkServiceability, panMapToLocation, refreshPlacesSessionToken],
    );

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                panMapToLocation(latitude, longitude);
                void handleMapClick(latitude, longitude);
            },
            () => {
                setError('Unable to retrieve your location.');
                setIsLoading(false);
            },
        );
    };

    const handleClearSelectedLocation = useCallback((): void => {
        setSearchResults([]);
        setSearchQuery('');
        setMapLocation(null);
        setResolvedAddress(null);
        setError(null);
        setServiceabilityStatus('idle');
        setAvailableVerticals([]);
        setPlacesAutocompleteError(null);

        if (advancedMarkerRef.current) {
            advancedMarkerRef.current.map = null;
        }

        if (mapRef.current) {
            mapRef.current.panTo(DEFAULT_CENTER);
            mapRef.current.setZoom(12);
        }
    }, []);

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
            <div className="space-y-4">
                <section className="space-y-4 lg:space-y-3">
                    <div className="relative z-1000">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        void handleSearch(searchQuery);
                                    }}
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
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            void handleSearch(searchQuery);
                                        }
                                    }}
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
                            <button
                                onClick={handleClearSelectedLocation}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                disabled={isLoading || (!mapLocation && !resolvedAddress && searchQuery.trim() === '')}
                            >
                                <X className="h-4 w-4" />
                                <span className="hidden sm:inline">Clear</span>
                            </button>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="absolute top-full right-0 left-0 z-1001 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.id}
                                        className="flex w-full items-start gap-3 p-3 text-left hover:bg-gray-50"
                                        onClick={() => {
                                            void handleSelectSearchResult(result);
                                        }}
                                    >
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                        <span className="min-w-0 text-sm text-gray-700">
                                            <span className="block truncate font-medium text-gray-800">{result.primaryText}</span>
                                            {result.secondaryText !== '' && (
                                                <span className="block truncate text-xs text-gray-500">{result.secondaryText}</span>
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {placesAutocompleteError && <p className="mt-1 text-xs text-red-600">{placesAutocompleteError}</p>}

                        <p className="mt-1 text-xs text-gray-500">Search, detect, clear, or tap on the map to set location.</p>
                    </div>

                    <div
                        className={`${shouldShowMapPicker ? 'block' : 'hidden'} relative h-60 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-72 lg:block lg:h-80 xl:h-96`}
                    >
                        {!apiKey ? (
                            <div className="flex h-full items-center justify-center bg-red-50 p-4 text-sm text-red-700">
                                Google Maps is not configured. Please set `GOOGLE_MAPS_API_KEY`.
                            </div>
                        ) : googleMapsLoadError ? (
                            <div className="flex h-full items-center justify-center bg-red-50 p-4 text-sm text-red-700">
                                Failed to load Google Maps. Please verify API key restrictions and enabled APIs.
                            </div>
                        ) : !isGoogleMapsLoaded ? (
                            <div className="flex h-full items-center justify-center bg-gray-50 p-4 text-sm text-gray-600">Loading map…</div>
                        ) : (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={mapLocation ?? DEFAULT_CENTER}
                                zoom={mapLocation ? 16 : 12}
                                onLoad={(map) => {
                                    mapRef.current = map;
                                    setIsMapReady(true);
                                }}
                                onUnmount={() => {
                                    if (advancedMarkerRef.current) {
                                        advancedMarkerRef.current.map = null;
                                    }
                                    mapRef.current = null;
                                    setIsMapReady(false);
                                }}
                                onClick={handleGoogleMapClick}
                                options={{
                                    streetViewControl: false,
                                    mapTypeControl: true,
                                    fullscreenControl: true,
                                    gestureHandling: 'greedy',
                                    mapId: 'DEMO_MAP_ID',
                                }}
                            />
                        )}

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

                    <div className="space-y-3 lg:space-y-2">
                        <div className="rounded-2xl border border-gray-200 bg-white">
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={isLoading}
                                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-(--theme-primary-1) disabled:opacity-60"
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
                                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-(--theme-primary-1)"
                            >
                                <span className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add new address
                                </span>
                            </button>
                        </div>
                    </div>

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
