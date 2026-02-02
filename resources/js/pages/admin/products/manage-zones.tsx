import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ProductSummary {
    id: number;
    name: string;
    slug: string;
    sku: string;
}

interface ZoneRow {
    zone_id: number;
    zone_name: string;
    zone_code: string;
    is_available: boolean;
    price_override: string | null;
    stock_quantity: number | null;
}

interface AdminProductsManageZonesProps {
    product: ProductSummary;
    zones: ZoneRow[];
}

export default function AdminProductsManageZones({ product, zones }: AdminProductsManageZonesProps) {
    const initialZones = zones.map((z) => ({
        zone_id: z.zone_id,
        is_available: z.is_available,
        price_override: z.price_override ?? '',
        stock_quantity: z.stock_quantity != null ? String(z.stock_quantity) : '',
    }));

    const form = useForm({ zones: initialZones });

    const setZone = (index: number, field: 'is_available' | 'price_override' | 'stock_quantity', value: boolean | string) => {
        const next = [...form.data.zones];
        if (field === 'is_available') next[index] = { ...next[index], is_available: value as boolean };
        else if (field === 'price_override') next[index] = { ...next[index], price_override: value as string };
        else next[index] = { ...next[index], stock_quantity: value as string };
        form.setData('zones', next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = form.data.zones.map((z) => ({
            zone_id: z.zone_id,
            is_available: z.is_available,
            price_override: z.price_override === '' ? null : Number(z.price_override),
            stock_quantity: z.stock_quantity === '' ? null : Number(z.stock_quantity),
        }));
        form.transform(() => ({ zones: payload })).put('/admin/products/' + product.id + '/zones');
    };

    return (
        <AdminLayout title={'Zones: ' + product.name}>
            <Head title={'Manage zones - ' + product.name + ' - Admin'} />
            <div className="space-y-4">
                <Link href={'/admin/products/' + product.id} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" />
                    Back to product
                </Link>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                </div>
                <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-4 py-3">
                        <h3 className="text-sm font-medium text-gray-900">Zone availability & overrides</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Zone</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Available</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Price override</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Stock (zone)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {zones.map((z, i) => (
                                    <tr key={z.zone_id}>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{z.zone_name} ({z.zone_code})</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300"
                                                checked={form.data.zones[i]?.is_available ?? false}
                                                onChange={(e) => setZone(i, 'is_available', e.target.checked)}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="w-24 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                                                placeholder="Base price"
                                                value={form.data.zones[i]?.price_override ?? ''}
                                                onChange={(e) => setZone(i, 'price_override', e.target.value)}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                                                placeholder="—"
                                                value={form.data.zones[i]?.stock_quantity ?? ''}
                                                onChange={(e) => setZone(i, 'stock_quantity', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex gap-2 border-t border-gray-200 px-4 py-3">
                        <button type="submit" disabled={form.processing} className="rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70">
                            {form.processing ? 'Saving…' : 'Save zone availability'}
                        </button>
                        <Link href={'/admin/products/' + product.id} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
