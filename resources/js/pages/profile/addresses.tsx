import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Plus, User, Pencil, Trash2, Star, Map as MapIcon, Search, Crosshair, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import UserLayout from '@/layouts/UserLayout';
import type { SharedData } from '@/types';

const ADDRESS_TYPES = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' },
] as const;

type AddressType = (typeof ADDRESS_TYPES)[number]['value'];

interface UserAddressData {
    id: number;
    type: string;
    label: string | null;
    address_line_1: string;
    address_line_2: string | null;
    landmark: string | null;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
}

interface AddressesPageProps {
    addresses: UserAddressData[];
}

const emptyAddress = {
    type: 'home' as AddressType,
    label: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
};

export default function ProfileAddresses({ addresses }: AddressesPageProps) {
    const { theme, flash } = (usePage().props as unknown as SharedData & { flash?: { message?: string } }) ?? {};
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const addForm = useForm(emptyAddress);
    const editingAddress = addresses.find((a) => a.id === editingId);
    const editForm = useForm({
        type: (editingAddress?.type ?? 'home') as AddressType,
        label: editingAddress?.label ?? '',
        address_line_1: editingAddress?.address_line_1 ?? '',
        address_line_2: editingAddress?.address_line_2 ?? '',
        landmark: editingAddress?.landmark ?? '',
        city: editingAddress?.city ?? '',
        state: editingAddress?.state ?? '',
        pincode: editingAddress?.pincode ?? '',
        is_default: editingAddress?.is_default ?? false,
    });

    useEffect(() => {
        if (editingAddress) {
            editForm.setData({
                type: editingAddress.type as AddressType,
                label: editingAddress.label ?? '',
                address_line_1: editingAddress.address_line_1,
                address_line_2: editingAddress.address_line_2 ?? '',
                landmark: editingAddress.landmark ?? '',
                city: editingAddress.city,
                state: editingAddress.state,
                pincode: editingAddress.pincode,
                is_default: editingAddress.is_default,
            });
        }
    }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (theme) {
            document.documentElement.style.setProperty('--theme-primary-1', theme.primary_1);
            document.documentElement.style.setProperty('--theme-primary-2', theme.primary_2);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
            document.documentElement.style.setProperty('--theme-tertiary', theme.tertiary);
        }
    }, [theme]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/profile/addresses', {
            preserveScroll: true,
            onSuccess: () => {
                addForm.reset();
                setShowAddForm(false);
            },
        });
    };

    const handleUpdate = (id: number, e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(`/profile/addresses/${id}`, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Remove this address?')) return;
        router.delete(`/profile/addresses/${id}`, { preserveScroll: true });
    };

    const handleSetDefault = (id: number) => {
        router.post(`/profile/addresses/${id}/default`, {}, { preserveScroll: true });
    };

    return (
        <UserLayout>
            <Head title="Addresses" />
            <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
                <h1 className="text-2xl font-bold text-gray-900">Addresses</h1>
                <p className="mt-1 text-sm text-gray-600">Manage your delivery addresses.</p>

                {flash?.message && (
                    <div className="mt-4 rounded-lg bg-[var(--theme-primary-1)]/10 px-4 py-3 text-sm text-[var(--theme-primary-1)]">
                        {flash.message}
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-6 sm:flex-row">
                    <nav className="flex shrink-0 gap-2 rounded-lg border border-gray-200 bg-gray-50/50 p-2 sm:flex-col sm:gap-0">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900"
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </Link>
                        <Link
                            href="/profile/addresses"
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--theme-primary-1)] bg-white shadow-sm"
                        >
                            <MapPin className="h-4 w-4" />
                            Addresses
                        </Link>
                    </nav>

                    <div className="min-w-0 flex-1 space-y-4">
                        {!showAddForm ? (
                            <button
                                type="button"
                                onClick={() => setShowAddForm(true)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-6 text-sm font-medium text-gray-600 hover:border-[var(--theme-primary-1)] hover:text-[var(--theme-primary-1)]"
                            >
                                <Plus className="h-5 w-5" />
                                Add address
                            </button>
                        ) : (
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900">Add address</h2>
                                <form onSubmit={handleAdd} className="mt-4 space-y-4">
                                    <AddressFormFields form={addForm} formId="add" />
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={addForm.processing}
                                            className="rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                                        >
                                            {addForm.processing ? 'Adding…' : 'Add address'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                addForm.reset();
                                            }}
                                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {addresses.length === 0 && !showAddForm && (
                            <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
                                No addresses yet. Add one above.
                            </p>
                        )}

                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                {editingId === addr.id ? (
                                    <>
                                        <h2 className="text-lg font-semibold text-gray-900">Edit address</h2>
                                        <form
                                            onSubmit={(e) => handleUpdate(addr.id, e)}
                                            className="mt-4 space-y-4"
                                        >
                                            <AddressFormFields form={editForm} formId={`edit-${addr.id}`} />
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={editForm.processing}
                                                    className="rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(null)}
                                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                                        {ADDRESS_TYPES.find((t) => t.value === addr.type)?.label ?? addr.type}
                                                    </span>
                                                    {addr.is_default && (
                                                        <span className="flex items-center gap-1 rounded bg-[var(--theme-primary-1)]/10 px-2 py-0.5 text-xs font-medium text-[var(--theme-primary-1)]">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-2 text-sm text-gray-900">
                                                    {addr.address_line_1}
                                                    {addr.address_line_2 && `, ${addr.address_line_2}`}
                                                </p>
                                                {addr.landmark && (
                                                    <p className="text-xs text-gray-500">Landmark: {addr.landmark}</p>
                                                )}
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {addr.city}, {addr.state} – {addr.pincode}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 gap-1">
                                                {!addr.is_default && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetDefault(addr.id)}
                                                        className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-[var(--theme-primary-1)]"
                                                        title="Set as default"
                                                    >
                                                        <Star className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(addr.id)}
                                                    className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(addr.id)}
                                                    className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

function AddressFormFields({
    form,
    formId = 'form',
}: {
    form: ReturnType<typeof useForm<typeof emptyAddress & { address_line_1?: string; city?: string; state?: string; pincode?: string }>>;
    formId?: string;
}) {
    const [isMapOpen, setIsMapOpen] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

    useEffect(() => {
        if (!isMapOpen || !mapContainerRef.current) return;
        if (mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current).setView([10.081, 76.205], 13);
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

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
               map.setView([pos.coords.latitude, pos.coords.longitude], 14);
            }, () => {});
        }

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, [isMapOpen]);

    useEffect(() => {
        if (mapInstanceRef.current && mapLocation) {
            mapInstanceRef.current.setView([mapLocation.lat, mapLocation.lng], 15);
            if (markerRef.current) {
                markerRef.current.setLatLng([mapLocation.lat, mapLocation.lng]);
            } else {
                markerRef.current = L.marker([mapLocation.lat, mapLocation.lng]).addTo(mapInstanceRef.current);
            }
        }
    }, [mapLocation]);

    const handleSearchLocation = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching location:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSearchResult = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setMapLocation({ lat, lng });
        setSearchQuery(result.display_name);
        setSearchResults([]);
    };

    const handleConfirmMapLocation = async () => {
        if (!mapLocation) return;
        setIsReverseGeocoding(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${mapLocation.lat}&lon=${mapLocation.lng}`);
            const data = await res.json();
            
            if (data && data.address) {
                const add = data.address;
                const road = add.road || add.neighbourhood || add.suburb || '';
                const city = add.city || add.town || add.village || add.county || add.state_district || '';
                const state = add.state || '';
                const postcode = add.postcode || '';

                form.setData({
                    ...form.data,
                    address_line_1: road ? `${add.building ? add.building + ', ' : ''}${road}, ${data.display_name.split(',')[0]}` : data.display_name,
                    city: city,
                    state: state,
                    pincode: postcode,
                });
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        } finally {
            setIsReverseGeocoding(false);
            setIsMapOpen(false);
        }
    };

    return (
        <>
            <div className="mb-4">
                {!isMapOpen ? (
                    <button
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-[var(--theme-primary-1)] transition-colors shadow-sm"
                    >
                        <MapIcon className="h-4 w-4" />
                        Pick on map (Auto-fill address)
                    </button>
                ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 relative ring-1 ring-gray-900/5 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setIsMapOpen(false)}
                            className="absolute right-2 top-2 z-10 p-1.5 rounded-md bg-white text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <h3 className="text-sm font-bold text-gray-800 mb-3">Find your location</h3>
                        
                        <div className="relative mb-3 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search area..."
                                    className="block w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSearchLocation}
                                disabled={isSearching || !searchQuery.trim()}
                                className="shrink-0 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-50"
                            >
                                {isSearching ? '...' : 'Search'}
                            </button>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="absolute z-[1001] mt-1 max-h-40 w-[calc(100%-2rem)] overflow-auto rounded-lg bg-white shadow-xl border border-gray-100">
                                <ul className="py-1">
                                    {searchResults.map((res: any) => (
                                        <li
                                            key={res.place_id}
                                            onClick={() => handleSelectSearchResult(res)}
                                            className="cursor-pointer py-2 pl-3 pr-4 text-gray-800 hover:bg-gray-50 hover:text-[var(--theme-primary-1)] text-xs border-b border-gray-50 last:border-0"
                                        >
                                            <span className="block truncate font-medium">{res.display_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="relative w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm h-[240px] z-0">
                            <div ref={mapContainerRef} className="h-full w-full" />
                            
                            <div className="absolute bottom-3 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-3">
                                <button
                                    type="button"
                                    onClick={handleConfirmMapLocation}
                                    disabled={isReverseGeocoding || !mapLocation}
                                    className="pointer-events-auto shadow-md bg-[var(--theme-primary-1)] rounded-full px-5 py-2.5 text-xs font-bold text-white hover:opacity-90 disabled:opacity-0 disabled:translate-y-4 transition-all duration-300 flex items-center gap-2"
                                >
                                    <Crosshair className="h-3.5 w-3.5" />
                                    {isReverseGeocoding ? 'Fetching...' : 'Confirm Location'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                        value={form.data.type}
                        onChange={(e) => form.setData('type', e.target.value as AddressType)}
                    >
                        {ADDRESS_TYPES.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Label (optional)</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                        value={form.data.label}
                        onChange={(e) => form.setData('label', e.target.value)}
                        placeholder="e.g. Home, Office"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Address line 1 *</label>
                <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                    value={form.data.address_line_1}
                    onChange={(e) => form.setData('address_line_1', e.target.value)}
                />
                {form.errors.address_line_1 && (
                    <p className="mt-1 text-sm text-red-600">{form.errors.address_line_1}</p>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Address line 2 (optional)</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                    value={form.data.address_line_2}
                    onChange={(e) => form.setData('address_line_2', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Landmark (optional)</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                    value={form.data.landmark}
                    onChange={(e) => form.setData('landmark', e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">City *</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                        value={form.data.city}
                        onChange={(e) => form.setData('city', e.target.value)}
                    />
                    {form.errors.city && (
                        <p className="mt-1 text-sm text-red-600">{form.errors.city}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">State *</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                        value={form.data.state}
                        onChange={(e) => form.setData('state', e.target.value)}
                    />
                    {form.errors.state && (
                        <p className="mt-1 text-sm text-red-600">{form.errors.state}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode *</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                        value={form.data.pincode}
                        onChange={(e) => form.setData('pincode', e.target.value)}
                    />
                    {form.errors.pincode && (
                        <p className="mt-1 text-sm text-red-600">{form.errors.pincode}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    id={`is_default_${formId}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                    checked={form.data.is_default}
                    onChange={(e) => form.setData('is_default', e.target.checked)}
                />
                <label htmlFor={`is_default_${formId}`} className="text-sm text-gray-700">
                    Set as default address
                </label>
            </div>
        </>
    );
}
