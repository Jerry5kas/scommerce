import { Head, Link, router, useForm } from '@inertiajs/react';
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
    User,
    X,
    AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Driver {
    id: number;
    name: string;
    phone: string;
}

interface Delivery {
    id: number;
    status: string;
    scheduled_date: string;
    scheduled_time: string | null;
    time_slot: string | null;
    assigned_at: string | null;
    dispatched_at: string | null;
    delivered_at: string | null;
    delivery_proof_image: string | null;
    delivery_proof_verified: boolean;
    delivery_proof_verified_at: string | null;
    failure_reason: string | null;
    delivery_instructions: string | null;
    notes: string | null;
    sequence: number | null;
    order: {
        id: number;
        order_number: string;
        total: string;
        status: string;
        payment_status: string;
        payment_method: string;
        items: {
            id: number;
            product_name: string;
            quantity: number;
            price: string;
        }[];
    };
    driver: Driver | null;
    user: {
        id: number;
        name: string;
        phone: string;
        email: string;
    };
    address: {
        address_line: string;
        area: string | null;
        city: string;
        state: string;
        pincode: string;
        latitude: number | null;
        longitude: number | null;
    };
    zone: {
        id: number;
        name: string;
    };
    verified_by: { name: string } | null;
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
    availableStatuses: string[];
    drivers: Driver[];
    proofUrl: string | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700 border-gray-300',
    assigned: 'bg-blue-100 text-blue-700 border-blue-300',
    out_for_delivery: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    delivered: 'bg-green-100 text-green-700 border-green-300',
    failed: 'bg-red-100 text-red-700 border-red-300',
    cancelled: 'bg-gray-200 text-gray-600 border-gray-400',
};

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    assigned: 'Assigned',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    failed: 'Failed',
    cancelled: 'Cancelled',
};

export default function DeliveryShow({
    delivery,
    timeline,
    availableStatuses,
    drivers,
    proofUrl,
}: Props) {
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showOverrideModal, setShowOverrideModal] = useState(false);

    const assignForm = useForm({ driver_id: '' });
    const statusForm = useForm({ status: '', reason: '', notes: '' });
    const overrideForm = useForm({ reason: '' });

    const handleAssignDriver = () => {
        assignForm.post(`/admin/deliveries/${delivery.id}/assign-driver`, {
            onSuccess: () => setShowAssignModal(false),
        });
    };

    const handleUpdateStatus = () => {
        statusForm.post(`/admin/deliveries/${delivery.id}/status`, {
            onSuccess: () => setShowStatusModal(false),
        });
    };

    const handleVerifyProof = () => {
        router.post(`/admin/deliveries/${delivery.id}/verify-proof`, { verified: true });
    };

    const handleOverrideProof = () => {
        overrideForm.post(`/admin/deliveries/${delivery.id}/override-proof`, {
            onSuccess: () => setShowOverrideModal(false),
        });
    };

    return (
        <AdminLayout>
            <Head title={`Delivery #${delivery.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/deliveries"
                        className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                Delivery #{delivery.id}
                            </h1>
                            <span
                                className={`rounded-full border px-3 py-1 text-sm font-medium ${statusColors[delivery.status]}`}
                            >
                                {statusLabels[delivery.status]}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Order{' '}
                            <Link
                                href={`/admin/orders/${delivery.order.id}`}
                                className="text-emerald-600 hover:text-emerald-700"
                            >
                                {delivery.order.order_number}
                            </Link>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {delivery.status === 'pending' || delivery.status === 'assigned' ? (
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Truck className="h-4 w-4" />
                                {delivery.driver ? 'Reassign' : 'Assign'} Driver
                            </button>
                        ) : null}

                        {availableStatuses.length > 0 && (
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Update Status
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Timeline */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Delivery Timeline</h2>
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
                                                    className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}
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
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
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
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Delivery Proof</h2>
                            {proofUrl ? (
                                <div className="space-y-4">
                                    <div className="overflow-hidden rounded-lg border">
                                        <img
                                            src={proofUrl}
                                            alt="Delivery proof"
                                            className="h-64 w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {delivery.delivery_proof_verified ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <Check className="h-5 w-5" />
                                                <span>Verified</span>
                                                {delivery.verified_by && (
                                                    <span className="text-sm text-gray-500">
                                                        by {delivery.verified_by.name}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleVerifyProof}
                                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                                            >
                                                <Check className="h-4 w-4" />
                                                Verify Proof
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : delivery.status === 'out_for_delivery' ? (
                                <div className="text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Proof will be uploaded upon delivery
                                    </p>
                                    <button
                                        onClick={() => setShowOverrideModal(true)}
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
                                    >
                                        <AlertTriangle className="h-4 w-4" />
                                        Override & Complete Without Proof
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-2 text-sm text-gray-500">No proof image yet</p>
                                </div>
                            )}
                        </div>

                        {/* Failure Reason */}
                        {delivery.failure_reason && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                                <h2 className="mb-2 font-semibold text-red-800">Failure Reason</h2>
                                <p className="text-red-700">{delivery.failure_reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Customer</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{delivery.user.name}</p>
                                        <p className="text-sm text-gray-500">{delivery.user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <a
                                        href={`tel:${delivery.user.phone}`}
                                        className="text-emerald-600 hover:text-emerald-700"
                                    >
                                        {delivery.user.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Delivery Address</h2>
                            <div className="space-y-3">
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
                                <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-xs text-gray-500">Zone</p>
                                    <p className="font-medium">{delivery.zone.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Scheduled Date */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Schedule</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <span>
                                        {new Date(delivery.scheduled_date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                {delivery.scheduled_time && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        <span>{delivery.scheduled_time}</span>
                                    </div>
                                )}
                                {delivery.time_slot && (
                                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                                        <p className="text-xs text-gray-500">Time Slot</p>
                                        <p className="font-medium capitalize">{delivery.time_slot}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Driver */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Assigned Driver</h2>
                            {delivery.driver ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Truck className="h-5 w-5 text-gray-400" />
                                        <span className="font-medium">{delivery.driver.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <a
                                            href={`tel:${delivery.driver.phone}`}
                                            className="text-emerald-600 hover:text-emerald-700"
                                        >
                                            {delivery.driver.phone}
                                        </a>
                                    </div>
                                    {delivery.sequence && (
                                        <div className="rounded-lg bg-gray-50 px-3 py-2">
                                            <p className="text-xs text-gray-500">Route Sequence</p>
                                            <p className="font-medium">#{delivery.sequence}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500">No driver assigned yet</p>
                            )}
                        </div>

                        {/* Delivery Instructions */}
                        {delivery.delivery_instructions && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-2 font-semibold text-gray-900">
                                    Delivery Instructions
                                </h2>
                                <p className="text-gray-600">{delivery.delivery_instructions}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Assign Driver Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Assign Driver</h3>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Select Driver
                                </label>
                                <select
                                    value={assignForm.data.driver_id}
                                    onChange={(e) => assignForm.setData('driver_id', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="">Choose a driver</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignDriver}
                                    disabled={!assignForm.data.driver_id || assignForm.processing}
                                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Update Status</h3>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">New Status</label>
                                <select
                                    value={statusForm.data.status}
                                    onChange={(e) => statusForm.setData('status', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="">Select status</option>
                                    {availableStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {statusLabels[status] || status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {statusForm.data.status === 'failed' && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Failure Reason *
                                    </label>
                                    <textarea
                                        value={statusForm.data.reason}
                                        onChange={(e) => statusForm.setData('reason', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Why did the delivery fail?"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Notes</label>
                                <textarea
                                    value={statusForm.data.notes}
                                    onChange={(e) => statusForm.setData('notes', e.target.value)}
                                    rows={2}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    placeholder="Optional notes..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={!statusForm.data.status || statusForm.processing}
                                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Override Proof Modal */}
            {showOverrideModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-orange-700">Override Proof</h3>
                            <button
                                onClick={() => setShowOverrideModal(false)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mb-4 rounded-lg bg-orange-50 p-3">
                            <p className="text-sm text-orange-800">
                                <strong>Warning:</strong> This will mark the delivery as complete without a
                                proof image. This action will be logged for audit purposes.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Reason for Override *
                                </label>
                                <textarea
                                    value={overrideForm.data.reason}
                                    onChange={(e) => overrideForm.setData('reason', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    placeholder="Provide a detailed reason (min 10 characters)"
                                />
                                {overrideForm.errors.reason && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {overrideForm.errors.reason}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowOverrideModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleOverrideProof}
                                    disabled={overrideForm.data.reason.length < 10 || overrideForm.processing}
                                    className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                                >
                                    Override & Complete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

