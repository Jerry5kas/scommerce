import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface OverrideData {
    id: number; zone_id: number; user_id: number | null;
    address_id: number | null; reason: string;
    expires_at: string | null; is_active: boolean;
    zone: { id: number; name: string; code: string };
    user?: { id: number; name: string | null; phone: string | null } | null;
    address?: { id: number; address_line_1: string; city: string; pincode: string } | null;
}

interface AdminZoneOverridesEditProps { override: OverrideData; }

function formatDatetimeLocal(s: string | null | undefined): string {
    if (!s) return '';
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0'); const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-3">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
            </div>
            <div className="p-5 space-y-5">{children}</div>
        </div>
    );
}

const inputCls = 'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-1 focus:ring-[var(--admin-dark-primary)]';
const labelCls = 'block text-sm font-medium text-gray-700';

export default function AdminZoneOverridesEdit({ override }: AdminZoneOverridesEditProps) {
    const form = useForm({
        reason: override.reason,
        expires_at: formatDatetimeLocal(override.expires_at),
        is_active: override.is_active,
    });

    const contextParts: string[] = [];
    if (override.user) contextParts.push(`User: ${override.user.name ?? override.user.phone}`);
    if (override.address) contextParts.push(`Address: ${override.address.address_line_1}, ${override.address.city}`);

    return (
        <AdminLayout title={`Edit override: ${override.zone.name}`}>
            <Head title="Edit override - Admin" />
            <form onSubmit={(e) => { e.preventDefault(); form.put(`/admin/zone-overrides/${override.id}`); }} className="space-y-6">
                <Link href={`/admin/zones/${override.zone_id}`} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Back to zone
                </Link>

                {/* ── Context info bar ──────────────────────── */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3">
                    <p className="text-sm text-gray-700">
                        Zone: <strong>{override.zone.name}</strong> ({override.zone.code})
                        {contextParts.length > 0 && <> · {contextParts.join(' · ')}</>}
                    </p>
                </div>

                <Section title="Override details">
                    <div>
                        <label className={labelCls}>Reason *</label>
                        <textarea required rows={3} className={inputCls} value={form.data.reason} onChange={(e) => form.setData('reason', e.target.value)} />
                        {form.errors.reason && <p className="mt-1 text-sm text-red-600">{form.errors.reason}</p>}
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Expires at (optional)</label>
                            <input type="datetime-local" className={inputCls} value={form.data.expires_at} onChange={(e) => form.setData('expires_at', e.target.value)} />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                        <span className="text-sm text-gray-700">Active</span>
                    </label>
                </Section>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={form.processing} className="rounded-lg bg-[var(--admin-dark-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70">
                        {form.processing ? 'Saving…' : 'Save changes'}
                    </button>
                    <Link href={`/admin/zones/${override.zone_id}`} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
