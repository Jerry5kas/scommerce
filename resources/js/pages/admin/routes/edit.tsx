import { Head, Link, useForm, router } from '@inertiajs/react';
import * as L from 'leaflet';
import { ArrowLeft, Search, X, GripVertical, Plus, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
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

function Section({ title, description, children, rightArea }: { title: string; description?: string; children: React.ReactNode, rightArea?: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
            <div className="border-b border-gray-200 px-5 py-3 flex justify-between items-center bg-gray-50 shrink-0">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                    {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
                </div>
                {rightArea && <div>{rightArea}</div>}
            </div>
            <div className="p-5 flex-1 overflow-auto">{children}</div>
        </div>
    );
}

const inputCls = 'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]';
const labelCls = 'block text-sm font-medium text-gray-700';

export default function AdminRoutesEdit({ routeRecord, hubs }: AdminRoutesEditProps) {
    // Basic Details Form
    const routeForm = useForm({
        hub_id: routeRecord.hub_id,
        name: routeRecord.name,
        description: routeRecord.description || '',
        is_active: routeRecord.is_active,
    });

    // Sequence States
    const [stops, setStops] = useState<UserAddress[]>(
        [...routeRecord.addresses].sort((a, b) => (a.pivot?.sequence || 0) - (b.pivot?.sequence || 0))
    );
    const [lastSavedStops, setLastSavedStops] = useState<UserAddress[]>(stops);

    const [isSavingStops, setIsSavingStops] = useState(false);
    const hasUnsavedChanges = JSON.stringify(stops.map(s => s.id)) !== JSON.stringify(lastSavedStops.map(s => s.id));

    // Map 
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const lineRef = useRef<L.Polyline | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current || typeof window === 'undefined') return;

        const map = L.map(mapContainerRef.current).setView([10.027, 76.308], 12);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Draw Map Route
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        // Clear markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        if (lineRef.current) lineRef.current.remove();

        const latlngs: [number, number][] = [];
        const validStops = stops.filter(s => s.latitude && s.longitude);

        validStops.forEach((stop, index) => {
            const ll: [number, number] = [Number(stop.latitude), Number(stop.longitude)];
            latlngs.push(ll);
            
            const marker = L.marker(ll).bindTooltip(`${index + 1}. ${stop.user.name}`, { permanent: false });
            marker.addTo(map);
            markersRef.current.push(marker);
        });

        if (latlngs.length > 0) {
            lineRef.current = L.polyline(latlngs, { color: '#0f766e', weight: 4, opacity: 0.7 }).addTo(map);
            map.fitBounds(lineRef.current.getBounds(), { padding: [20, 20] });
        }
    }, [stops]);

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
        router.put(`/admin/routes/${routeRecord.id}/addresses`, {
            addresses: stops.map((stop, index) => ({ id: stop.id, sequence: index + 1 }))
        }, {
            onSuccess: () => {
                setIsSavingStops(false);
                setLastSavedStops([...stops]);
                alert('Sequence Saved!');
            },
            onError: () => setIsSavingStops(false)
        });
    };

    const addStop = (address: UserAddress) => {
        if (stops.find(s => s.id === address.id)) return;
        setStops([...stops, address]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeStop = (id: number) => {
        setStops(stops.filter(s => s.id !== id));
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COL: Sequence Data */}
                <div className="lg:col-span-2 flex flex-col h-[75vh] space-y-4">
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
                        <div className="mb-4 relative z-10">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by customer name, phone, or location..."
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searching && <span className="absolute right-3 top-2.5 text-xs text-gray-400">Loading...</span>}
                            </div>
                            
                            {/* Search Dropdown */}
                            {searchQuery.trim().length >= 3 && searchResults.length > 0 && (
                                <div className="absolute top-11 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                    {searchResults.map(res => (
                                        <div key={res.id} onClick={() => addStop(res)} className="px-4 py-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer flex justify-between items-center group">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{res.user.name} <span className="text-gray-500 font-normal">({res.user.phone})</span></p>
                                                <p className="text-xs text-gray-500">{res.address_line_1}, {res.city} {res.pincode}</p>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                {stops.find(s => s.id === res.id) 
                                                    ? <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3"/> Added</span> 
                                                    : <span className="px-2 py-1 text-xs bg-[var(--admin-dark-primary)] text-white rounded">Add</span>
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* List Sequence */}
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[50vh] pr-2">
                            {stops.length === 0 && (
                                <div className="text-center py-6 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                                    No addresses added to this route yet.<br/>Search above to add customers.
                                </div>
                            )}
                            {stops.map((stop, index) => (
                                <div key={stop.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:border-gray-300 transition-colors">
                                    <div className="flex flex-col gap-1 shrink-0 px-1">
                                        <button onClick={() => moveStop(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-[var(--admin-dark-primary)] disabled:opacity-30">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button onClick={() => moveStop(index, 'down')} disabled={index === stops.length - 1} className="text-gray-400 hover:text-[var(--admin-dark-primary)] disabled:opacity-30">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                    <div className="shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-semibold text-gray-600">
                                        {index + 1}
                                    </div>
                                    <div className="ml-2 flex-grow min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{stop.user.name}</p>
                                        <div className="text-xs text-gray-500 truncate mt-0.5">
                                            <span className="font-semibold">{stop.user.phone}</span> • {stop.address_line_1}, {stop.city} {stop.pincode}
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeStop(stop.id)}
                                        title="Remove Stop"
                                        className="shrink-0 ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* RIGHT COL: Map & Details */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Section title="Map Preview" description="Visual overview of the route.">
                        <div 
                            ref={mapContainerRef} 
                            className="bg-gray-100 w-full h-64 rounded-lg border border-gray-300"
                            style={{ zIndex: 1 }}
                        />
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
                                    {hubs.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
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

                            <label className="flex items-center gap-2 cursor-pointer mt-4 border border-gray-200 p-3 rounded-lg w-max">
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
                                className="w-full justify-center flex py-2 px-4 rounded-lg mt-2 bg-[var(--admin-dark-primary)] text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
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
