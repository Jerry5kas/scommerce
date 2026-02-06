import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, MapPin, Phone, RefreshCw, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Delivery {
    id: number;
    status: string;
    scheduled_date: string;
    time_slot: string | null;
    order: {
        id: number;
        order_number: string;
    };
    driver: { name: string; phone: string } | null;
    address: {
        address_line: string;
        city: string;
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
    initialLocation: { lat: number; lng: number } | null;
    deliveryAddress: { lat: number | null; lng: number | null };
}

export default function DeliveryTrack({
    delivery,
    timeline,
    initialLocation,
    deliveryAddress,
}: Props) {
    const [location, setLocation] = useState(initialLocation);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(initialLocation ? new Date() : null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Poll for location updates
    useEffect(() => {
        if (delivery.status !== 'out_for_delivery') return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/deliveries/${delivery.id}/live-tracking`);
                const data = await response.json();

                if (data.tracking_available && data.location) {
                    setLocation(data.location);
                    setLastUpdate(new Date());
                }
            } catch (error) {
                console.error('Failed to fetch location:', error);
            }
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, [delivery.id, delivery.status]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch(`/deliveries/${delivery.id}/live-tracking`);
            const data = await response.json();

            if (data.tracking_available && data.location) {
                setLocation(data.location);
                setLastUpdate(new Date());
            }
        } catch (error) {
            console.error('Failed to fetch location:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <>
            <Head title={`Track Delivery - ${delivery.order.order_number}`} />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-3xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-4">
                        <Link
                            href={`/deliveries/${delivery.id}`}
                            className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-900">Track Delivery</h1>
                            <p className="text-sm text-gray-500">
                                Order {delivery.order.order_number}
                            </p>
                        </div>
                    </div>

                    {delivery.status === 'out_for_delivery' ? (
                        <div className="space-y-6">
                            {/* Map Placeholder */}
                            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                                <div className="flex h-64 items-center justify-center bg-gray-100">
                                    {location ? (
                                        <div className="text-center">
                                            <MapPin className="mx-auto h-12 w-12 text-emerald-600" />
                                            <p className="mt-2 text-sm text-gray-600">
                                                Driver is at {location.lat.toFixed(4)},{' '}
                                                {location.lng.toFixed(4)}
                                            </p>
                                            {lastUpdate && (
                                                <p className="text-xs text-gray-500">
                                                    Last updated:{' '}
                                                    {lastUpdate.toLocaleTimeString()}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Truck className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">
                                                Waiting for driver location...
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Refresh Button */}
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="absolute right-4 top-4 rounded-lg bg-white p-2 shadow-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <RefreshCw
                                        className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
                                    />
                                </button>
                            </div>

                            {/* Driver Info */}
                            {delivery.driver && (
                                <div className="rounded-xl border border-gray-200 bg-white p-6">
                                    <h2 className="mb-4 font-semibold text-gray-900">
                                        Your Delivery Partner
                                    </h2>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                                <Truck className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{delivery.driver.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    Delivery Partner
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={`tel:${delivery.driver.phone}`}
                                            className="flex items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 text-emerald-700 hover:bg-emerald-200"
                                        >
                                            <Phone className="h-4 w-4" />
                                            Call
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Delivery Address */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 font-semibold text-gray-900">Delivering To</h2>
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{delivery.address.address_line}</p>
                                        <p className="text-sm text-gray-500">{delivery.address.city}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 font-semibold text-gray-900">Status</h2>
                                <div className="space-y-4">
                                    {timeline.map((item, index) => (
                                        <div key={item.status} className="flex items-center gap-3">
                                            <div
                                                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                                    item.completed
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'border-2 border-gray-300 bg-white'
                                                }`}
                                            >
                                                {item.completed && <Check className="h-3 w-3" />}
                                            </div>
                                            <p
                                                className={
                                                    item.completed ? 'text-gray-900' : 'text-gray-400'
                                                }
                                            >
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                            <Truck className="mx-auto h-16 w-16 text-gray-300" />
                            <h2 className="mt-4 text-lg font-semibold text-gray-900">
                                Live tracking not available
                            </h2>
                            <p className="mt-2 text-gray-500">
                                {delivery.status === 'delivered'
                                    ? 'This delivery has been completed.'
                                    : 'Live tracking will be available once the driver starts delivery.'}
                            </p>
                            <Link
                                href={`/deliveries/${delivery.id}`}
                                className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-2 text-white hover:bg-emerald-700"
                            >
                                View Delivery Details
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

