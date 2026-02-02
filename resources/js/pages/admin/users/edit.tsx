import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, MapPin, Pencil } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ml', label: 'Malayalam' },
];

const ADDRESS_TYPES = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' },
];

interface ZoneOption {
    id: number;
    name: string;
    code: string;
}

interface AddressData {
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
    is_active: boolean;
}

interface UserData {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
    preferred_language: string;
    communication_consent: boolean;
    is_active: boolean;
    addresses: AddressData[];
}

interface AdminUsersEditProps {
    user: UserData;
    zones: ZoneOption[];
}

type AddressFormData = {
    type: string;
    label: string;
    address_line_1: string;
    address_line_2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    latitude: string;
    longitude: string;
    is_default: boolean;
    is_active: boolean;
};

function addressToFormData(addr: AddressData): AddressFormData & { id: number } {
    return {
        id: addr.id,
        type: addr.type,
        label: addr.label ?? '',
        address_line_1: addr.address_line_1,
        address_line_2: addr.address_line_2 ?? '',
        landmark: addr.landmark ?? '',
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        latitude: addr.latitude?.toString() ?? '',
        longitude: addr.longitude?.toString() ?? '',
        is_default: addr.is_default,
        is_active: addr.is_active,
    };
}

export default function AdminUsersEdit({ user, zones }: AdminUsersEditProps) {
    const { flash } = (usePage().props as { flash?: { message?: string } }) ?? {};
    const [editingAddress, setEditingAddress] = useState<(AddressFormData & { id: number }) | null>(null);

    const userForm = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        role: user.role,
        preferred_language: user.preferred_language || 'en',
        communication_consent: user.communication_consent ?? false,
        is_active: user.is_active ?? true,
        password: '',
        password_confirmation: '',
    });

    return (
        <AdminLayout title={`Edit user: ${user.name ?? user.phone ?? user.id}`}>
            <Head title="Edit user - Admin" />
            <div className="space-y-6">
                {flash?.message && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{flash.message}</div>
                )}
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to users
                </Link>

                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">User details</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const data = { ...userForm.data };
                            if (!data.password) delete (data as Record<string, unknown>).password;
                            if (!data.password_confirmation) delete (data as Record<string, unknown>).password_confirmation;
                            userForm.put(`/admin/users/${user.id}`);
                        }}
                        className="max-w-xl space-y-4"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                    value={userForm.data.name}
                                    onChange={(e) => userForm.setData('name', e.target.value)}
                                />
                                {userForm.errors.name && <p className="mt-1 text-sm text-red-600">{userForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                    value={userForm.data.phone}
                                    onChange={(e) => userForm.setData('phone', e.target.value)}
                                />
                                {userForm.errors.phone && <p className="mt-1 text-sm text-red-600">{userForm.errors.phone}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                value={userForm.data.email}
                                onChange={(e) => userForm.setData('email', e.target.value)}
                            />
                            {userForm.errors.email && <p className="mt-1 text-sm text-red-600">{userForm.errors.email}</p>}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                    value={userForm.data.role}
                                    onChange={(e) => userForm.setData('role', e.target.value)}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="driver">Driver</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Language</label>
                                <select
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                    value={userForm.data.preferred_language}
                                    onChange={(e) => userForm.setData('preferred_language', e.target.value)}
                                >
                                    {LANGUAGES.map((l) => (
                                        <option key={l.value} value={l.value}>{l.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={userForm.data.communication_consent}
                                    onChange={(e) => userForm.setData('communication_consent', e.target.checked)}
                                />
                                <span className="text-sm text-gray-700">Communication consent</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={userForm.data.is_active}
                                    onChange={(e) => userForm.setData('is_active', e.target.checked)}
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <label className="block text-sm font-medium text-gray-700">New password (leave blank to keep)</label>
                            <input
                                type="password"
                                className="mt-1 block w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                value={userForm.data.password}
                                onChange={(e) => userForm.setData({ ...userForm.data, password: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="mt-2 block w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                value={userForm.data.password_confirmation}
                                onChange={(e) => userForm.setData({ ...userForm.data, password_confirmation: e.target.value })}
                            />
                            {userForm.errors.password && <p className="mt-1 text-sm text-red-600">{userForm.errors.password}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={userForm.processing}
                            className="rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                        >
                            {userForm.processing ? 'Saving…' : 'Save user'}
                        </button>
                    </form>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <MapPin className="h-4 w-4" />
                        Addresses
                    </h3>
                    {user.addresses.length === 0 ? (
                        <p className="text-sm text-gray-500">No addresses.</p>
                    ) : (
                        <ul className="space-y-4">
                            {user.addresses.map((addr) => {
                                const isEditing = editingAddress?.id === addr.id;
                                const formData = isEditing ? editingAddress : null;
                                return (
                                    <li key={addr.id} className="rounded-lg border border-gray-200 p-4">
                                        {isEditing && formData ? (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    router.put(
                                                        `/admin/users/${user.id}/addresses/${addr.id}`,
                                                        {
                                                            type: formData.type,
                                                            label: formData.label || null,
                                                            address_line_1: formData.address_line_1,
                                                            address_line_2: formData.address_line_2 || null,
                                                            landmark: formData.landmark || null,
                                                            city: formData.city,
                                                            state: formData.state,
                                                            pincode: formData.pincode,
                                                            latitude: formData.latitude ? Number(formData.latitude) : null,
                                                            longitude: formData.longitude ? Number(formData.longitude) : null,
                                                            is_default: formData.is_default,
                                                            is_active: formData.is_active,
                                                        },
                                                        { preserveScroll: true, onSuccess: () => setEditingAddress(null) },
                                                    );
                                                }}
                                                className="space-y-3"
                                            >
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600">Type</label>
                                                        <select
                                                            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                            value={formData.type}
                                                            onChange={(e) => setEditingAddress((p) => (p ? { ...p, type: e.target.value } : null))}
                                                        >
                                                            {ADDRESS_TYPES.map((t) => (
                                                                <option key={t.value} value={t.value}>{t.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600">Label</label>
                                                        <input
                                                            type="text"
                                                            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                            value={formData.label}
                                                            onChange={(e) => setEditingAddress((p) => (p ? { ...p, label: e.target.value } : null))}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600">Address line 1 *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                        value={formData.address_line_1}
                                                        onChange={(e) => setEditingAddress((p) => (p ? { ...p, address_line_1: e.target.value } : null))}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600">Address line 2</label>
                                                    <input
                                                        type="text"
                                                        className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                        value={formData.address_line_2}
                                                        onChange={(e) => setEditingAddress((p) => (p ? { ...p, address_line_2: e.target.value } : null))}
                                                    />
                                                </div>
                                                <div className="grid gap-3 sm:grid-cols-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600">City *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                            value={formData.city}
                                                            onChange={(e) => setEditingAddress((p) => (p ? { ...p, city: e.target.value } : null))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600">State *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                            value={formData.state}
                                                            onChange={(e) => setEditingAddress((p) => (p ? { ...p, state: e.target.value } : null))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600">Pincode *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                            value={formData.pincode}
                                                            onChange={(e) => setEditingAddress((p) => (p ? { ...p, pincode: e.target.value } : null))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <label className="flex items-center gap-1.5 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="h-3.5 w-3.5 rounded border-gray-300"
                                                            checked={formData.is_default}
                                                            onChange={(e) => setEditingAddress((p) => (p ? { ...p, is_default: e.target.checked } : null))}
                                                        />
                                                        Default
                                                    </label>
                                                    <label className="flex items-center gap-1.5 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="h-3.5 w-3.5 rounded border-gray-300"
                                                            checked={formData.is_active}
                                                            onChange={(e) => setEditingAddress((p) => (p ? { ...p, is_active: e.target.checked } : null))}
                                                        />
                                                        Active
                                                    </label>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="submit"
                                                        className="rounded bg-[var(--admin-dark-primary)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingAddress(null)}
                                                        className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {addr.address_line_1}
                                                        {addr.address_line_2 && `, ${addr.address_line_2}`}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {addr.city}, {addr.state} – {addr.pincode}
                                                    </p>
                                                    <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-600">
                                                        {addr.type}
                                                    </span>
                                                    {addr.is_default && (
                                                        <span className="ml-1 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingAddress(addressToFormData(addr))}
                                                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Edit address"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}
