import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface OverrideData {
    id: number;
    zone_id: number;
    user_id: number | null;
    address_id: number | null;
    reason: string;
    expires_at: string | null;
    is_active: boolean;
    zone: { id: number; name: string; code: string };
    user?: { id: number; name: string | null; phone: string | null } | null;
    address?: { id: number; address_line_1: string; city: string; pincode: string } | null;
}

interface AdminZoneOverridesEditProps {
    override: OverrideData;
}

function formatDatetimeLocal(s: string | null | undefined): string {
    if (!s) return '';
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
}

export default function AdminZoneOverridesEdit({ override }: AdminZoneOverridesEditProps) {
    const form = useForm({
        reason: override.reason,
        expires_at: formatDatetimeLocal(override.expires_at),
        is_active: override.is_active,
    });

    return (
        <AdminLayout title={`Edit override: ${override.zone.name}`}>
            <Head title={`Edit override - Admin`} />
            <div className="space-y-4">
                <Link
                    href={`/admin/zones/${override.zone_id}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to zone
                </Link>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Edit zone override</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Zone: <strong>{override.zone.name}</strong> ({override.zone.code})
                        {override.user && ` · User: ${override.user.name ?? override.user.phone}`}
                        {override.address && ` · Address: ${override.address.address_line_1}, ${override.address.city}`}
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.put(`/admin/zone-overrides/${override.id}`);
                        }}
                        className="mt-6 max-w-xl space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reason *</label>
                            <textarea
                                required
                                rows={3}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                value={form.data.reason}
                                onChange={(e) => form.setData('reason', e.target.value)}
                            />
                            {form.errors.reason && <p className="mt-1 text-sm text-red-600">{form.errors.reason}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expires at (optional)</label>
                            <input
                                type="datetime-local"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                                value={form.data.expires_at}
                                onChange={(e) => form.setData('expires_at', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                        </div>
                        <div className="flex gap-2 border-t border-gray-200 pt-4">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                            >
                                {form.processing ? 'Saving…' : 'Save'}
                            </button>
                            <Link
                                href={`/admin/zones/${override.zone_id}`}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
