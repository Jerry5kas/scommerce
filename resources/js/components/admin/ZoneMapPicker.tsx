import { usePage } from '@inertiajs/react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Crosshair } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_CENTER = { lat: 10.0, lng: 76.2 };

interface PageProps {
    googleMapsApiKey?: string | null;
}

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

function arePointsEqual(first: { lat: number; lng: number }[], second: { lat: number; lng: number }[]): boolean {
    if (first.length !== second.length) {
        return false;
    }

    for (let index = 0; index < first.length; index += 1) {
        if (first[index].lat !== second[index].lat || first[index].lng !== second[index].lng) {
            return false;
        }
    }

    return true;
}

export default function ZoneMapPicker({ value, onChange, onAddressSelected }: ZoneMapPickerProps) {
    const { googleMapsApiKey } = usePage<PageProps>().props;
    const apiKey = typeof googleMapsApiKey === 'string' ? googleMapsApiKey : '';

    const { isLoaded: isGoogleMapsLoaded, loadError: googleMapsLoadError } = useJsApiLoader({
        id: 'admin-zone-map-picker-google-script',
        googleMapsApiKey: apiKey,
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const polygonRef = useRef<google.maps.Polygon | null>(null);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const polygonListenersRef = useRef<google.maps.MapsEventListener[]>([]);
    const removeModeRef = useRef(false);
    const onAddressSelectedRef = useRef<ZoneMapPickerProps['onAddressSelected'] | undefined>(undefined);
    const pointsRef = useRef<{ lat: number; lng: number }[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isRemoveMode, setIsRemoveMode] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [toolMessage, setToolMessage] = useState<string | null>(null);

    useEffect(() => {
        onAddressSelectedRef.current = onAddressSelected;
    }, [onAddressSelected]);

    useEffect(() => {
        removeModeRef.current = isRemoveMode;
    }, [isRemoveMode]);

    useEffect(() => {
        if (!apiKey || googleMapsLoadError) {
            setStatus('error');
            setErrorMessage('Google Maps key is missing or invalid.');
            return;
        }

        if (!isGoogleMapsLoaded) {
            setStatus('loading');
            return;
        }

        setStatus('ready');
    }, [apiKey, googleMapsLoadError, isGoogleMapsLoaded]);

    const getAddressComponent = useCallback((components: google.maps.GeocoderAddressComponent[], type: string): string => {
        const component = components.find((item) => item.types.includes(type));
        return component?.long_name ?? '';
    }, []);

    const toAddressMetadata = useCallback(
        (displayName: string, components: google.maps.GeocoderAddressComponent[]) => {
            const cityLike =
                getAddressComponent(components, 'locality') ||
                getAddressComponent(components, 'administrative_area_level_3') ||
                getAddressComponent(components, 'administrative_area_level_2') ||
                getAddressComponent(components, 'sublocality_level_1');

            const locality =
                getAddressComponent(components, 'neighborhood') ||
                getAddressComponent(components, 'sublocality') ||
                getAddressComponent(components, 'sublocality_level_1') ||
                cityLike;

            return {
                displayName,
                locality: locality || undefined,
                city: cityLike || undefined,
                state: getAddressComponent(components, 'administrative_area_level_1') || undefined,
                country: getAddressComponent(components, 'country') || undefined,
                postcode: getAddressComponent(components, 'postal_code') || undefined,
            };
        },
        [getAddressComponent],
    );

    const ensureMarker = useCallback(async (): Promise<google.maps.marker.AdvancedMarkerElement | null> => {
        if (!mapRef.current || !window.google?.maps) {
            return null;
        }

        if (markerRef.current) {
            markerRef.current.map = mapRef.current;
            return markerRef.current;
        }

        const markerLibrary = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;
        const marker = new markerLibrary.AdvancedMarkerElement({
            map: mapRef.current,
            title: 'Zone point',
        });

        markerRef.current = marker;
        return marker;
    }, []);

    const setMarkerPosition = useCallback(
        async (lat: number, lng: number): Promise<void> => {
            if (!mapRef.current) {
                return;
            }

            const marker = await ensureMarker();
            if (!marker) {
                return;
            }

            marker.map = mapRef.current;
            marker.position = { lat, lng };
        },
        [ensureMarker],
    );

    const clearPolygonListeners = useCallback((): void => {
        polygonListenersRef.current.forEach((listener) => listener.remove());
        polygonListenersRef.current = [];
    }, []);

    const syncBoundaryFromPath = useCallback(
        (path: google.maps.MVCArray<google.maps.LatLng>): void => {
            const points = path.getArray().map((latLng) => ({
                lat: Number(latLng.lat().toFixed(6)),
                lng: Number(latLng.lng().toFixed(6)),
            }));

            pointsRef.current = points;

            if (points.length === 0) {
                setIsRemoveMode(false);
            }

            onChange(points.length > 0 ? serializeBoundary(points) : '');
        },
        [onChange],
    );

    const removeNearestPoint = useCallback(
        (lat: number, lng: number): boolean => {
            const map = mapRef.current;

            if (!map || pointsRef.current.length === 0 || !window.google?.maps) {
                return false;
            }

            const projection = map.getProjection();
            if (!projection) {
                return false;
            }

            const clickPoint = projection.fromLatLngToPoint(new google.maps.LatLng(lat, lng));
            if (!clickPoint) {
                return false;
            }

            const zoom = map.getZoom() ?? 12;
            const scale = Math.pow(2, zoom);
            const thresholdInPixels = 20;
            const thresholdSquared = thresholdInPixels * thresholdInPixels;

            let nearestIndex = -1;
            let nearestDistanceSquared = Number.POSITIVE_INFINITY;

            pointsRef.current.forEach((point, index) => {
                const pointAsPixel = projection.fromLatLngToPoint(new google.maps.LatLng(point.lat, point.lng));
                if (!pointAsPixel) {
                    return;
                }

                const deltaX = (pointAsPixel.x - clickPoint.x) * scale;
                const deltaY = (pointAsPixel.y - clickPoint.y) * scale;
                const distanceSquared = deltaX * deltaX + deltaY * deltaY;

                if (distanceSquared < nearestDistanceSquared) {
                    nearestDistanceSquared = distanceSquared;
                    nearestIndex = index;
                }
            });

            if (nearestIndex < 0 || nearestDistanceSquared > thresholdSquared) {
                return false;
            }

            if (polygonRef.current) {
                polygonRef.current.getPath().removeAt(nearestIndex);
                return true;
            }

            const nextPoints = pointsRef.current.filter((_, index) => index !== nearestIndex);
            pointsRef.current = nextPoints;
            onChange(nextPoints.length > 0 ? serializeBoundary(nextPoints) : '');

            if (nextPoints.length === 0) {
                setIsRemoveMode(false);
            }

            return true;
        },
        [onChange],
    );

    const drawPolygon = useCallback(
        (points: { lat: number; lng: number }[]): void => {
            if (!mapRef.current) {
                return;
            }

            clearPolygonListeners();

            if (polygonRef.current) {
                polygonRef.current.setMap(null);
                polygonRef.current = null;
            }

            if (points.length === 0) {
                return;
            }

            const polygon = new google.maps.Polygon({
                paths: points,
                strokeColor: '#0f766e',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#0f766e',
                fillOpacity: 0.15,
                editable: true,
                map: mapRef.current,
            });

            const path = polygon.getPath();
            polygonListenersRef.current = [
                path.addListener('set_at', () => syncBoundaryFromPath(path)),
                path.addListener('insert_at', () => syncBoundaryFromPath(path)),
                path.addListener('remove_at', () => syncBoundaryFromPath(path)),
                polygon.addListener('click', (event: google.maps.PolyMouseEvent) => {
                    if (!removeModeRef.current) {
                        return;
                    }

                    if (typeof event.vertex === 'number') {
                        path.removeAt(event.vertex);
                        return;
                    }

                    const clickedLatLng = event.latLng;
                    if (!clickedLatLng) {
                        return;
                    }

                    removeNearestPoint(clickedLatLng.lat(), clickedLatLng.lng());
                }),
                polygon.addListener('rightclick', (event: google.maps.PolyMouseEvent) => {
                    if (typeof event.vertex === 'number') {
                        path.removeAt(event.vertex);
                    }
                }),
            ];

            polygonRef.current = polygon;

            if (points.length >= 2) {
                const bounds = new google.maps.LatLngBounds();
                points.forEach((point) => bounds.extend(point));
                mapRef.current.fitBounds(bounds, 20);
            }
        },
        [clearPolygonListeners, removeNearestPoint, syncBoundaryFromPath],
    );

    const fitBoundaryToView = useCallback((): void => {
        if (!mapRef.current || pointsRef.current.length < 2) {
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        pointsRef.current.forEach((point) => bounds.extend(point));
        mapRef.current.fitBounds(bounds, 20);
    }, []);

    const emitAddressForPoint = useCallback(
        async (lat: number, lng: number): Promise<void> => {
            if (!onAddressSelectedRef.current || !window.google?.maps) {
                return;
            }

            try {
                const geocoder = new google.maps.Geocoder();
                const response = await geocoder.geocode({ location: { lat, lng } });
                const first = response.results?.[0];
                if (!first) {
                    return;
                }

                onAddressSelectedRef.current(toAddressMetadata(first.formatted_address, first.address_components ?? []));
            } catch {
                // ignore reverse geocoder failures
            }
        },
        [toAddressMetadata],
    );

    const handleMapClick = useCallback(
        (event: google.maps.MapMouseEvent): void => {
            if (!event.latLng) {
                return;
            }

            const lat = Number(event.latLng.lat().toFixed(6));
            const lng = Number(event.latLng.lng().toFixed(6));

            setToolMessage(null);

            if (isRemoveMode) {
                removeNearestPoint(lat, lng);
                return;
            }

            pointsRef.current = [...pointsRef.current, { lat, lng }];
            drawPolygon(pointsRef.current);
            onChange(serializeBoundary(pointsRef.current));
            void setMarkerPosition(lat, lng);
            void emitAddressForPoint(lat, lng);
        },
        [drawPolygon, emitAddressForPoint, isRemoveMode, onChange, removeNearestPoint, setMarkerPosition],
    );

    const handleUseMyLocation = useCallback((): void => {
        if (!navigator.geolocation) {
            setToolMessage('Geolocation is not supported on this browser.');
            return;
        }

        setToolMessage(null);
        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = Number(position.coords.latitude.toFixed(6));
                const lng = Number(position.coords.longitude.toFixed(6));

                if (mapRef.current) {
                    mapRef.current.setCenter({ lat, lng });
                    mapRef.current.setZoom(15);
                }

                void setMarkerPosition(lat, lng);
                setIsLocating(false);
            },
            () => {
                setToolMessage('Unable to fetch your current location.');
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 12000,
                maximumAge: 0,
            },
        );
    }, [setMarkerPosition]);

    const handleMapLoad = useCallback(
        (map: google.maps.Map): void => {
            mapRef.current = map;

            const existing = parseBoundary(value);
            if (existing && existing.length >= 3) {
                pointsRef.current = existing.map(([lat, lng]) => ({ lat, lng }));
                drawPolygon(pointsRef.current);
            }
        },
        [drawPolygon, value],
    );

    const handleMapUnmount = useCallback((): void => {
        clearPolygonListeners();

        if (polygonRef.current) {
            polygonRef.current.setMap(null);
        }

        if (markerRef.current) {
            markerRef.current.map = null;
        }

        polygonRef.current = null;
        markerRef.current = null;
        mapRef.current = null;
        pointsRef.current = [];
    }, [clearPolygonListeners]);

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        const parsedBoundary = parseBoundary(value);
        const nextPoints = parsedBoundary ? parsedBoundary.map(([lat, lng]) => ({ lat, lng })) : [];

        if (arePointsEqual(pointsRef.current, nextPoints)) {
            return;
        }

        pointsRef.current = nextPoints;
        drawPolygon(nextPoints);

        const lastPoint = nextPoints[nextPoints.length - 1];
        if (lastPoint) {
            void setMarkerPosition(lastPoint.lat, lastPoint.lng);
        }
    }, [drawPolygon, setMarkerPosition, value]);

    const handleSearch = useCallback(async (): Promise<void> => {
        if (!searchQuery.trim() || !isGoogleMapsLoaded || !window.google?.maps) {
            return;
        }

        setSearching(true);
        setResults([]);

        try {
            const geocoder = new google.maps.Geocoder();
            const geocodeResult = await geocoder.geocode({
                address: searchQuery,
            });

            const nextResults: SearchResult[] = (geocodeResult.results ?? []).slice(0, 5).map((item) => {
                const location = item.geometry.location;

                return {
                    lat: Number(location.lat().toFixed(6)),
                    lng: Number(location.lng().toFixed(6)),
                    label: item.formatted_address,
                    address: toAddressMetadata(item.formatted_address, item.address_components ?? []),
                };
            });

            setResults(nextResults);
        } catch {
            setResults([]);
        } finally {
            setSearching(false);
        }
    }, [isGoogleMapsLoaded, searchQuery, toAddressMetadata]);

    const focusResult = useCallback(
        (result: SearchResult): void => {
            if (!mapRef.current) {
                return;
            }

            mapRef.current.setCenter({ lat: result.lat, lng: result.lng });
            const currentZoom = mapRef.current.getZoom() ?? 12;
            mapRef.current.setZoom(Math.max(currentZoom, 15));
            void setMarkerPosition(result.lat, result.lng);

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
        },
        [setMarkerPosition],
    );

    const handleUndoLastPoint = useCallback((): void => {
        if (pointsRef.current.length === 0) {
            return;
        }

        const nextPoints = pointsRef.current.slice(0, -1);
        pointsRef.current = nextPoints;
        drawPolygon(nextPoints);
        onChange(nextPoints.length > 0 ? serializeBoundary(nextPoints) : '');

        if (nextPoints.length === 0) {
            setIsRemoveMode(false);
        }
    }, [drawPolygon, onChange]);

    const handleClearBoundary = useCallback((): void => {
        pointsRef.current = [];
        drawPolygon([]);
        onChange('');
        setIsRemoveMode(false);
    }, [drawPolygon, onChange]);

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
                    className="shrink-0 rounded-lg bg-(--admin-dark-primary) px-3 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-70"
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
                {isRemoveMode
                    ? 'Remove mode is ON. Tap/click a pivot point (or near it) to remove it.'
                    : 'Click to add corners. Drag existing points to reshape, drag midpoints to add new points, and right-click any point to remove it.'}
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    disabled={isLocating || !isGoogleMapsLoaded}
                >
                    <Crosshair className="h-3.5 w-3.5" />
                    {isLocating ? 'Locating…' : 'Use my location'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsRemoveMode((previous) => !previous)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                        isRemoveMode
                            ? 'border-(--admin-dark-primary) bg-(--admin-dark-primary) text-white'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={pointsRef.current.length === 0}
                >
                    {isRemoveMode ? 'Remove mode: ON' : 'Remove mode: OFF'}
                </button>
                <button
                    type="button"
                    onClick={handleUndoLastPoint}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    disabled={pointsRef.current.length === 0}
                >
                    Undo last point
                </button>
                <button
                    type="button"
                    onClick={handleClearBoundary}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    disabled={pointsRef.current.length === 0}
                >
                    Clear boundary
                </button>
                <button
                    type="button"
                    onClick={fitBoundaryToView}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    disabled={pointsRef.current.length < 2}
                >
                    Fit boundary
                </button>
            </div>

            {toolMessage && <div className="text-xs text-red-600">{toolMessage}</div>}

            <div className="h-72 w-full overflow-hidden rounded-lg border border-gray-200">
                {!apiKey || !isGoogleMapsLoaded ? (
                    <div className="flex h-full items-center justify-center bg-gray-50 text-xs text-gray-500">Loading map…</div>
                ) : (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={DEFAULT_CENTER}
                        zoom={12}
                        onLoad={handleMapLoad}
                        onUnmount={handleMapUnmount}
                        onClick={handleMapClick}
                        options={{
                            mapTypeControl: true,
                            streetViewControl: false,
                            fullscreenControl: true,
                            gestureHandling: 'greedy',
                            mapId: 'DEMO_MAP_ID',
                        }}
                    />
                )}
            </div>

            {status === 'loading' && <div className="text-xs text-gray-500">Loading map…</div>}
        </div>
    );
}
