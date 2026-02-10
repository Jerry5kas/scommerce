import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, MapPin, Ban, CheckCircle } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface AddressData {
    id: number;
    type: string;
    label: string | null;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
    is_active: boolean;
    zone?: { id: number; name: string; code: string } | null;
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

interface AdminUsersShowProps {
    user: UserData;
}

export default function AdminUsersShow({ user }: AdminUsersShowProps) {
    return (
        <AdminLayout title={`User: ${user.name ?? user.phone ?? user.id}`}>
            <Head title={`User ${user.id} - Admin`} />
            <div className="space-y-4">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to users
                </Link>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{user.name ?? '—'}</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {user.phone ? `+91 ${user.phone}` : '—'} {user.email && ` · ${user.email}`}
                            </p>
                            <p className="mt-2">
                                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700">
                                    {user.role}
                                </span>
                                <span className={`ml-2 ${user.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Language: {user.preferred_language} · Consent: {user.communication_consent ? 'Yes' : 'No'}
                            </p>
                        </div>
                        <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Link>
                        {user.is_active ? (
                            <Link
                                href={`/admin/users/${user.id}/block`}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                            >
                                <Ban className="h-4 w-4" />
                                Block
                            </Link>
                        ) : (
                            <Link
                                href={`/admin/users/${user.id}/unblock`}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Unblock
                            </Link>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Addresses</h3>
                    {user.addresses.length === 0 ? (
                        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                            No addresses.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {user.addresses.map((addr) => (
                                <li
                                    key={addr.id}
                                    className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {addr.address_line_1}
                                                {addr.address_line_2 && `, ${addr.address_line_2}`}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {addr.city}, {addr.state} – {addr.pincode}
                                            </p>
                                            <div className="mt-1 flex gap-2">
                                                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-600">
                                                    {addr.type}
                                                </span>
                                                {addr.is_default && (
                                                    <span className="rounded bg-[var(--admin-dark-primary)]/10 px-2 py-0.5 text-xs text-[var(--admin-dark-primary)]">
                                                        Default
                                                    </span>
                                                )}
                                                {addr.zone && (
                                                    <span className="text-xs text-gray-500">
                                                        Zone: {addr.zone.name} ({addr.zone.code})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/admin/users/${user.id}/edit`}
                                        className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                        title="Edit (includes addresses)"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
