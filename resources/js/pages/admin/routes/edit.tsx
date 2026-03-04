import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { ArrowLeft, Search, X, Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface UserAddress {
    id: number;
    address_line_1: string;
    city: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
    user: {
        id: number;
        name: string;
        phone: string;
    };
    pivot?: {
        sequence: number;
    };
}

interface HubData {
    id: number;
    name: string;
}

interface RouteData {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    hub_id: number;
    addresses: UserAddress[];
}

interface AdminRoutesEditProps {
    routeRecord: RouteData;
    hubs: HubData[];
}

interface PageProps {
    googleMapsApiKey?: string | null;
}

function Section({
    title,
    description,
    children,
    rightArea,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
    rightArea?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                    {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
                </div>
                {rightArea && <div>{rightArea}</div>}
            </div>
            <div className="flex-1 overflow-auto p-5">{children}</div>
        </div>
    );
}

const inputCls =
    'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]';
const labelCls = 'block text-sm font-medium text-gray-700';

export default function AdminRoutesEdit({ routeRecord, hubs }: AdminRoutesEditProps) {
    const { googleMapsApiKey } = usePage<PageProps>().props;
    const apiKey = typeof googleMapsApiKey === 'string' ? googleMapsApiKey : '';

    const { isLoaded: isGoogleMapsLoaded, loadError: googleMapsLoadError } = useJsApiLoader({
        id: 'admin-routes-edit-google-map-script',
        googleMapsApiKey: apiKey,
    });

    // Basic Details Form
    const routeForm = useForm({
        hub_id: routeRecord.hub_id,
        name: routeRecord.name,
        description: routeRecord.description || '',
        is_active: routeRecord.is_active,
    });

    // Sequence States
    const [stops, setStops] = useState<UserAddress[]>([...routeRecord.addresses].sort((a, b) => (a.pivot?.sequence || 0) - (b.pivot?.sequence || 0)));
    const [lastSavedStops, setLastSavedStops] = useState<UserAddress[]>(stops);

    const [isSavingStops, setIsSavingStops] = useState(false);
    const hasUnsavedChanges = JSON.stringify(stops.map((s) => s.id)) !== JSON.stringify(lastSavedStops.map((s) => s.id));

    // Map
    const mapRef = useRef<google.maps.Map | null>(null);
    const lineRef = useRef<google.maps.Polyline | null>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

    const clearRoutePreview = useCallback((): void => {
        markersRef.current.forEach((marker) => {
            marker.map = null;
        });
        markersRef.current = [];

        if (lineRef.current) {
            lineRef.current.setMap(null);
            lineRef.current = null;
        }
    }, []);

    const drawRoutePreview = useCallback(async (): Promise<void> => {
        if (!mapRef.current || !isGoogleMapsLoaded || !window.google?.maps) {
            return;
        }

        clearRoutePreview();

        const validStops = stops.filter((stop) => stop.latitude && stop.longitude);
        if (validStops.length === 0) {
            return;
        }

        const markerLibrary = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;
        const path: google.maps.LatLngLiteral[] = [];

        validStops.forEach((stop, index) => {
            const point = {
                lat: Number(stop.latitude),
                lng: Number(stop.longitude),
            };

            path.push(point);

            const marker = new markerLibrary.AdvancedMarkerElement({
                map: mapRef.current,
                position: point,
                title: `${index + 1}. ${stop.user.name}`,
            });

            markersRef.current.push(marker);
        });

        lineRef.current = new google.maps.Polyline({
            map: mapRef.current,
            path,
            strokeColor: '#0f766e',
            strokeWeight: 4,
            strokeOpacity: 0.7,
        });

        const bounds = new google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point));
        mapRef.current.fitBounds(bounds, 20);
    }, [clearRoutePreview, isGoogleMapsLoaded, stops]);

    useEffect(() => {
        void drawRoutePreview();

        return () => {
            clearRoutePreview();
        };
    }, [clearRoutePreview, drawRoutePreview]);

    const handleMapLoad = useCallback(
        (map: google.maps.Map): void => {
            mapRef.current = map;
            void drawRoutePreview();
        },
        [drawRoutePreview],
    );

    const handleMapUnmount = useCallback((): void => {
        clearRoutePreview();
        mapRef.current = null;
    }, [clearRoutePreview]);

    // Search Addresses UI
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserAddress[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.length < 3) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(`/admin/routes-search-addresses?q=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSearchResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Handlers
    const handleUpdateBasicDetails = (e: React.FormEvent) => {
        e.preventDefault();
        routeForm.put(`/admin/routes/${routeRecord.id}`);
    };

    const handleSaveSequence = () => {
        setIsSavingStops(true);
        router.put(
            `/admin/routes/${routeRecord.id}/addresses`,
            {
                addresses: stops.map((stop, index) => ({ id: stop.id, sequence: index + 1 })),
            },
            {
                onSuccess: () => {
                    setIsSavingStops(false);
                    setLastSavedStops([...stops]);
                    alert('Sequence Saved!');
                },
                onError: () => setIsSavingStops(false),
            },
        );
    };

    const addStop = (address: UserAddress) => {
        if (stops.find((s) => s.id === address.id)) return;
        setStops([...stops, address]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeStop = (id: number) => {
        setStops(stops.filter((s) => s.id !== id));
    };

    const moveStop = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === stops.length - 1) return;

        const newStops = [...stops];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newStops[index];
        newStops[index] = newStops[targetIndex];
        newStops[targetIndex] = temp;
        setStops(newStops);
    };

    return (
        <AdminLayout title={`Edit Route: ${routeRecord.name}`}>
            <Head title={`Edit Route: ${routeRecord.name} - Admin`} />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/routes" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Back to routes
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* LEFT COL: Sequence Data */}
                <div className="flex h-[75vh] flex-col space-y-4 lg:col-span-2">
                    <Section
                        title={`Delivery address sequence (${stops.length})`}
                        rightArea={
                            <button
                                onClick={handleSaveSequence}
                                disabled={!hasUnsavedChanges || isSavingStops}
                                className={`rounded bg-[var(--admin-dark-primary)] px-4 py-1.5 text-xs text-white disabled:opacity-50`}
                            >
                                {isSavingStops ? 'Saving...' : 'Save Sequence'}
                            </button>
                        }
                    >
                        <div className="relative z-10 mb-4">
                            <div className="relative">
                                <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by customer name, phone, or location..."
                                    className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searching && <span className="absolute top-2.5 right-3 text-xs text-gray-400">Loading...</span>}
                            </div>

                            {/* Search Dropdown */}
                            {searchQuery.trim().length >= 3 && searchResults.length > 0 && (
                                <div className="absolute top-11 right-0 left-0 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                    {searchResults.map((res) => (
                                        <div
                                            key={res.id}
                                            onClick={() => addStop(res)}
                                            className="group flex cursor-pointer items-center justify-between border-b px-4 py-3 last:border-0 hover:bg-gray-50"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {res.user.name} <span className="font-normal text-gray-500">({res.user.phone})</span>
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {res.address_line_1}, {res.city} {res.pincode}
                                                </p>
                                            </div>
                                            <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                                {stops.find((s) => s.id === res.id) ? (
                                                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                                        <Check className="h-3 w-3" /> Added
                                                    </span>
                                                ) : (
                                                    <span className="rounded bg-[var(--admin-dark-primary)] px-2 py-1 text-xs text-white">Add</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* List Sequence */}
                        <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto pr-2">
                            {stops.length === 0 && (
                                <div className="rounded-lg border-2 border-dashed border-gray-200 py-6 text-center text-sm text-gray-500">
                                    No addresses added to this route yet.
                                    <br />
                                    Search above to add customers.
                                </div>
                            )}
                            {stops.map((stop, index) => (
                                <div
                                    key={stop.id}
                                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors hover:border-gray-300"
                                >
                                    <div className="flex shrink-0 flex-col gap-1 px-1">
                                        <button
                                            onClick={() => moveStop(index, 'up')}
                                            disabled={index === 0}
                                            className="text-gray-400 hover:text-[var(--admin-dark-primary)] disabled:opacity-30"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => moveStop(index, 'down')}
                                            disabled={index === stops.length - 1}
                                            className="text-gray-400 hover:text-[var(--admin-dark-primary)] disabled:opacity-30"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-600">
                                        {index + 1}
                                    </div>
                                    <div className="ml-2 min-w-0 flex-grow">
                                        <p className="truncate text-sm font-medium text-gray-900">{stop.user.name}</p>
                                        <div className="mt-0.5 truncate text-xs text-gray-500">
                                            <span className="font-semibold">{stop.user.phone}</span> • {stop.address_line_1}, {stop.city}{' '}
                                            {stop.pincode}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeStop(stop.id)}
                                        title="Remove Stop"
                                        className="ml-2 shrink-0 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* RIGHT COL: Map & Details */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    <Section title="Map Preview" description="Visual overview of the route.">
                        <div className="h-64 w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100" style={{ zIndex: 1 }}>
                            {!apiKey || googleMapsLoadError ? (
                                <div className="flex h-full items-center justify-center bg-red-50 p-3 text-xs text-red-700">
                                    Unable to load map preview.
                                </div>
                            ) : !isGoogleMapsLoaded ? (
                                <div className="flex h-full items-center justify-center bg-gray-50 p-3 text-xs text-gray-500">
                                    Loading map preview…
                                </div>
                            ) : (
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={{ lat: 10.027, lng: 76.308 }}
                                    zoom={12}
                                    onLoad={handleMapLoad}
                                    onUnmount={handleMapUnmount}
                                    options={{
                                        mapTypeControl: true,
                                        streetViewControl: false,
                                        fullscreenControl: true,
                                        mapId: 'DEMO_MAP_ID',
                                    }}
                                />
                            )}
                        </div>
                    </Section>

                    <Section title="Route Details" description="Config overrides">
                        <form onSubmit={handleUpdateBasicDetails} className="space-y-4">
                            <div>
                                <label className={labelCls}>Select Hub *</label>
                                <select
                                    required
                                    className={inputCls}
                                    value={routeForm.data.hub_id}
                                    onChange={(e) => routeForm.setData('hub_id', Number(e.target.value))}
                                >
                                    {hubs.map((h) => (
                                        <option key={h.id} value={h.id}>
                                            {h.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelCls}>Route Name *</label>
                                <input
                                    type="text"
                                    required
                                    className={inputCls}
                                    value={routeForm.data.name}
                                    onChange={(e) => routeForm.setData('name', e.target.value)}
                                />
                                {routeForm.errors.name && <p className="mt-1 text-sm text-red-600">{routeForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className={labelCls}>Route Description</label>
                                <textarea
                                    rows={2}
                                    className={inputCls}
                                    value={routeForm.data.description}
                                    onChange={(e) => routeForm.setData('description', e.target.value)}
                                />
                                {routeForm.errors.description && <p className="mt-1 text-sm text-red-600">{routeForm.errors.description}</p>}
                            </div>

                            <label className="mt-4 flex w-max cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-gray-300 text-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                                    checked={routeForm.data.is_active}
                                    onChange={(e) => routeForm.setData('is_active', e.target.checked)}
                                />
                                <span className="text-sm font-medium text-gray-700">Is active?</span>
                            </label>

                            <button
                                type="submit"
                                disabled={routeForm.processing}
                                className="mt-2 flex w-full justify-center rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                            >
                                {routeForm.processing ? 'Updating...' : 'Update Details'}
                            </button>
                        </form>
                    </Section>
                </div>
            </div>
        </AdminLayout>
    );
}
