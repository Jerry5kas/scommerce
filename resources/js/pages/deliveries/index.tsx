import { Head, Link } from '@inertiajs/react';
import { Calendar, Eye, MapPin, Package, Truck } from 'lucide-react';

interface Delivery {
    id: number;
    status: string;
    scheduled_date: string;
    scheduled_time: string | null;
    time_slot: string | null;
    order: {
        id: number;
        order_number: string;
        total: string;
    };
    driver: { name: string } | null;
    address: {
        address_line: string;
        city: string;
    };
}

interface Props {
    deliveries: {
        data: Delivery[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    filters: {
        status?: string;
    };
    statusOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    assigned: 'bg-blue-100 text-blue-700',
    out_for_delivery: 'bg-yellow-100 text-yellow-700',
    delivered: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-200 text-gray-600',
};

export default function DeliveriesIndex({ deliveries, statusOptions }: Props) {
    return (
        <>
            <Head title="My Deliveries" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-3xl px-4 py-8">
                    <h1 className="mb-6 text-2xl font-bold text-gray-900">My Deliveries</h1>

                    {deliveries.data.length === 0 ? (
                        <div className="rounded-xl bg-white p-12 text-center">
                            <Package className="mx-auto h-16 w-16 text-gray-300" />
                            <p className="mt-4 text-gray-500">No deliveries yet</p>
                            <Link
                                href="/catalog"
                                className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-2 text-white hover:bg-emerald-700"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {deliveries.data.map((delivery) => (
                                <div
                                    key={delivery.id}
                                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                                >
                                    <div className="p-4 sm:p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link
                                                    href={`/orders/${delivery.order.id}`}
                                                    className="text-lg font-semibold text-emerald-600 hover:text-emerald-700"
                                                >
                                                    {delivery.order.order_number}
                                                </Link>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    ₹{delivery.order.total}
                                                </p>
                                            </div>
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[delivery.status]}`}
                                            >
                                                {statusOptions[delivery.status] || delivery.status}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(delivery.scheduled_date).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                    {delivery.time_slot && ` • ${delivery.time_slot}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="h-4 w-4" />
                                                <span className="truncate">
                                                    {delivery.address.address_line}
                                                </span>
                                            </div>
                                        </div>

                                        {delivery.driver && delivery.status === 'out_for_delivery' && (
                                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
                                                <Truck className="h-4 w-4" />
                                                <span>
                                                    {delivery.driver.name} is on the way!
                                                </span>
                                            </div>
                                        )}

                                        <div className="mt-4 flex gap-2">
                                            <Link
                                                href={`/deliveries/${delivery.id}`}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </Link>
                                            {delivery.status === 'out_for_delivery' && (
                                                <Link
                                                    href={`/deliveries/${delivery.id}/track`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                                                >
                                                    <MapPin className="h-4 w-4" />
                                                    Track Live
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {deliveries.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-1">
                            {deliveries.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`rounded px-3 py-1.5 text-sm ${
                                        link.active
                                            ? 'bg-emerald-600 text-white'
                                            : link.url
                                              ? 'bg-white text-gray-700 hover:bg-gray-100'
                                              : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

