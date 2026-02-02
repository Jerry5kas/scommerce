import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface DriverData {
    id: number;
    employee_id: string;
    phone: string;
    is_active: boolean;
    is_online: boolean;
    user?: { id: number; name: string | null; phone: string | null; email: string | null };
    zone?: { id: number; name: string; code: string; city: string; state: string } | null;
}

interface AdminDriversShowProps {
    driver: DriverData;
}

export default function AdminDriversShow({ driver }: AdminDriversShowProps) {
    return (
        <AdminLayout title={`Driver: ${driver.employee_id}`}>
            <Head title={`Driver ${driver.employee_id} - Admin`} />
            <div className="space-y-4">
                <Link
                    href="/admin/drivers"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to drivers
                </Link>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{driver.employee_id}</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {driver.user?.name ?? '—'} · {driver.phone}
                            </p>
                            {driver.zone && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Zone: {driver.zone.name} ({driver.zone.code}) – {driver.zone.city}, {driver.zone.state}
                                </p>
                            )}
                            <p className="mt-2 text-sm">
                                Status: <span className={driver.is_active ? 'text-green-600' : 'text-gray-500'}>{driver.is_active ? 'Active' : 'Inactive'}</span>
                                {driver.is_online && <span className="ml-2 text-blue-600">Online</span>}
                            </p>
                        </div>
                        <Link
                            href={`/admin/drivers/${driver.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
