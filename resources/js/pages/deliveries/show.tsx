import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    Image as ImageIcon,
    MapPin,
    Package,
    Phone,
    Truck,
} from 'lucide-react';

interface Delivery {
    id: number;
    status: string;
    scheduled_date: string;
    scheduled_time: string | null;
    time_slot: string | null;
    delivered_at: string | null;
    delivery_instructions: string | null;
    order: {
        id: number;
        order_number: string;
        total: string;
        items: {
            id: number;
            product_name: string;
            quantity: number;
            price: string;
        }[];
    };
    driver: { name: string; phone: string } | null;
    address: {
        address_line: string;
        area: string | null;
        city: string;
        state: string;
        pincode: string;
    };
    zone: { name: string };
}

interface TimelineItem {
    status: string;
    label: string;
    timestamp: string | null;
    completed: boolean;
}

interface Props {
    delivery: Delivery;
    timeline: TimelineItem[];
    proofUrl: string | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    assigned: 'bg-blue-100 text-blue-700',
    out_for_delivery: 'bg-yellow-100 text-yellow-700',
    delivered: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-200 text-gray-600',
};

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    assigned: 'Assigned',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    failed: 'Failed',
    cancelled: 'Cancelled',
};

export default function DeliveryShow({ delivery, timeline, proofUrl }: Props) {
    return (
        <>
            <Head title={`Delivery - ${delivery.order.order_number}`} />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-3xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-4">
                        <Link
                            href="/deliveries"
                            className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-900">
                                Delivery Details
                            </h1>
                            <p className="text-sm text-gray-500">
                                Order{' '}
                                <Link
                                    href={`/orders/${delivery.order.id}`}
                                    className="text-emerald-600 hover:text-emerald-700"
                                >
                                    {delivery.order.order_number}
                                </Link>
                            </p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[delivery.status]}`}
                        >
                            {statusLabels[delivery.status]}
                        </span>
                    </div>

                    {/* Track Button for Active Deliveries */}
                    {delivery.status === 'out_for_delivery' && (
                        <Link
                            href={`/deliveries/${delivery.id}/track`}
                            className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white hover:bg-emerald-700"
                        >
                            <MapPin className="h-5 w-5" />
                            Track Live Location
                        </Link>
                    )}

                    <div className="space-y-6">
                        {/* Timeline */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Delivery Status</h2>
                            <div className="relative">
                                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
                                <div className="space-y-6">
                                    {timeline.map((item, index) => (
                                        <div key={item.status} className="relative flex gap-4">
                                            <div
                                                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                                                    item.completed
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'border-2 border-gray-300 bg-white text-gray-400'
                                                }`}
                                            >
                                                {item.completed ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <span className="text-xs">{index + 1}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 pb-2">
                                                <p
                                                    className={`font-medium ${
                                                        item.completed ? 'text-gray-900' : 'text-gray-400'
                                                    }`}
                                                >
                                                    {item.label}
                                                </p>
                                                {item.timestamp && (
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(item.timestamp).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Schedule & Driver */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 font-semibold text-gray-900">Schedule</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <span>
                                            {new Date(delivery.scheduled_date).toLocaleDateString(
                                                'en-US',
                                                {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                }
                                            )}
                                        </span>
                                    </div>
                                    {delivery.time_slot && (
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                            <span className="capitalize">{delivery.time_slot}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 font-semibold text-gray-900">Driver</h2>
                                {delivery.driver ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Truck className="h-5 w-5 text-gray-400" />
                                            <span className="font-medium">{delivery.driver.name}</span>
                                        </div>
                                        <a
                                            href={`tel:${delivery.driver.phone}`}
                                            className="flex items-center gap-3 text-emerald-600 hover:text-emerald-700"
                                        >
                                            <Phone className="h-5 w-5" />
                                            <span>{delivery.driver.phone}</span>
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Driver will be assigned soon</p>
                                )}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Delivery Address</h2>
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-gray-900">{delivery.address.address_line}</p>
                                    {delivery.address.area && (
                                        <p className="text-sm text-gray-500">{delivery.address.area}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        {delivery.address.city}, {delivery.address.state}{' '}
                                        {delivery.address.pincode}
                                    </p>
                                </div>
                            </div>
                            {delivery.delivery_instructions && (
                                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                                    <p className="text-xs text-gray-500">Delivery Instructions</p>
                                    <p className="text-sm">{delivery.delivery_instructions}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Order Items</h2>
                            <div className="space-y-3">
                                {delivery.order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.product_name}
                                                </p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">
                                            ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>₹{delivery.order.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Proof */}
                        {proofUrl && delivery.status === 'delivered' && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 font-semibold text-gray-900">Delivery Proof</h2>
                                <div className="overflow-hidden rounded-lg border">
                                    <img
                                        src={proofUrl}
                                        alt="Delivery proof"
                                        className="h-64 w-full object-cover"
                                    />
                                </div>
                                {delivery.delivered_at && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Delivered at {new Date(delivery.delivered_at).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

