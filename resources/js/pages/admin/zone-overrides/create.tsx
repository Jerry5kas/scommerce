import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ZoneData { id: number; name: string; code: string; }
interface UserOption { id: number; name: string | null; phone: string | null; email: string | null; role: string; }
interface AddressOption { id: number; user_id: number; address_line_1: string; city: string; pincode: string; user?: { id: number; name: string | null; phone: string | null }; }

interface AdminZoneOverridesCreateProps { zone: ZoneData; users: UserOption[]; addresses: AddressOption[]; }

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

export default function AdminZoneOverridesCreate({ zone, users, addresses }: AdminZoneOverridesCreateProps) {
    const form = useForm({
        user_id: '' as string | number,
        address_id: '' as string | number,
        reason: '', expires_at: '', is_active: true,
    });

    const submit = () => {
        const data = { ...form.data, user_id: form.data.user_id === '' ? null : Number(form.data.user_id), address_id: form.data.address_id === '' ? null : Number(form.data.address_id) };
        form.transform(() => data);
        form.post(`/admin/zones/${zone.id}/overrides`);
    };

    return (
        <AdminLayout title={'Add override: ' + zone.name}>
            <Head title={'Add override - ' + zone.name + ' - Admin'} />
            <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-6">
                <Link href={'/admin/zones/' + zone.id} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Back to zone
                </Link>

                <Section title="Override target" description={`Assign zone ${zone.name} (${zone.code}) for a specific user or address.`}>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>User (optional)</label>
                            <select className={inputCls} value={form.data.user_id} onChange={(e) => form.setData('user_id', e.target.value)}>
                                <option value="">— None (use address only) —</option>
                                {users.map((u) => <option key={u.id} value={u.id}>{u.name ?? u.phone ?? u.email ?? '#' + u.id} ({u.role})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Address (optional)</label>
                            <select className={inputCls} value={form.data.address_id} onChange={(e) => form.setData('address_id', e.target.value)}>
                                <option value="">— None (user-level override) —</option>
                                {addresses.map((a) => <option key={a.id} value={a.id}>{a.address_line_1}, {a.city} – {a.pincode}{a.user ? ' (' + (a.user.name ?? a.user.phone) + ')' : ''}</option>)}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">Provide at least user or address.</p>
                        </div>
                    </div>
                </Section>

                <Section title="Override details">
                    <div>
                        <label className={labelCls}>Reason *</label>
                        <textarea required rows={3} className={inputCls} value={form.data.reason} onChange={(e) => form.setData('reason', e.target.value)} placeholder="e.g. Special delivery agreement" />
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
                        {form.processing ? 'Creating…' : 'Create override'}
                    </button>
                    <Link href={'/admin/zones/' + zone.id} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                </div>
            </form>
        </AdminLayout>
    );
}
