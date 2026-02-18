import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    GlassWater,
    Package,
    Send,
    Undo2,
    User,
    X,
    AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface BottleLog {
    id: number;
    action: string;
    action_by: string;
    condition: string | null;
    notes: string | null;
    deposit_amount: string | null;
    refund_amount: string | null;
    created_at: string;
}

interface Bottle {
    id: number;
    bottle_number: string;
    barcode: string | null;
    type: string;
    capacity: string | null;
    status: string;
    purchase_cost: string | null;
    deposit_amount: string | null;
    issued_at: string | null;
    returned_at: string | null;
    damaged_at: string | null;
    notes: string | null;
    current_user: { id: number; name: string; phone: string } | null;
    current_subscription: { id: number } | null;
    logs: BottleLog[];
}

interface Props {
    bottle: Bottle;
    statusOptions: Record<string, string>;
    typeOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    available: 'bg-green-100 text-green-700 border-green-300',
    issued: 'bg-blue-100 text-blue-700 border-blue-300',
    returned: 'bg-gray-100 text-gray-700 border-gray-300',
    damaged: 'bg-red-100 text-red-700 border-red-300',
    lost: 'bg-gray-200 text-gray-600 border-gray-400',
};

const actionColors: Record<string, string> = {
    issued: 'bg-blue-500',
    returned: 'bg-green-500',
    damaged: 'bg-red-500',
    lost: 'bg-gray-600',
    found: 'bg-emerald-500',
    transferred: 'bg-purple-500',
};

export default function BottleShow({ bottle, statusOptions, typeOptions }: Props) {
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showDamagedModal, setShowDamagedModal] = useState(false);

    const issueForm = useForm({ user_id: '', subscription_id: '', notes: '' });
    const returnForm = useForm({ condition: 'good', notes: '' });
    const damagedForm = useForm({ reason: '' });

    const handleIssue = () => {
        issueForm.post(`/admin/bottles/${bottle.id}/issue`, {
            onSuccess: () => setShowIssueModal(false),
        });
    };

    const handleReturn = () => {
        returnForm.post(`/admin/bottles/${bottle.id}/return`, {
            onSuccess: () => setShowReturnModal(false),
        });
    };

    const handleMarkDamaged = () => {
        damagedForm.post(`/admin/bottles/${bottle.id}/mark-damaged`, {
            onSuccess: () => setShowDamagedModal(false),
        });
    };

    const handleMarkLost = () => {
        if (confirm('Are you sure you want to mark this bottle as lost?')) {
            router.post(`/admin/bottles/${bottle.id}/mark-lost`);
        }
    };

    return (
        <AdminLayout>
            <Head title={`Bottle ${bottle.bottle_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/bottles"
                        className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <GlassWater className="h-6 w-6 text-emerald-600" />
                            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                {bottle.bottle_number}
                            </h1>
                            <span
                                className={`rounded-full border px-3 py-1 text-sm font-medium ${statusColors[bottle.status]}`}
                            >
                                {statusOptions[bottle.status]}
                            </span>
                        </div>
                        {bottle.barcode && (
                            <p className="mt-1 text-sm text-gray-500">
                                Barcode: {bottle.barcode}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {bottle.status === 'available' && (
                            <button
                                onClick={() => setShowIssueModal(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Send className="h-4 w-4" />
                                Issue
                            </button>
                        )}
                        {bottle.status === 'issued' && (
                            <>
                                <button
                                    onClick={() => setShowReturnModal(true)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                >
                                    <Undo2 className="h-4 w-4" />
                                    Return
                                </button>
                                <button
                                    onClick={() => setShowDamagedModal(true)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                >
                                    <AlertTriangle className="h-4 w-4" />
                                    Mark Damaged
                                </button>
                                <button
                                    onClick={handleMarkLost}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Mark Lost
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Details */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Bottle Details</h2>
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm text-gray-500">Type</dt>
                                    <dd className="font-medium capitalize">{bottle.type}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Capacity</dt>
                                    <dd className="font-medium">
                                        {bottle.capacity ? `${bottle.capacity}L` : '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Purchase Cost</dt>
                                    <dd className="font-medium">
                                        {bottle.purchase_cost ? `₹${bottle.purchase_cost}` : '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Deposit Amount</dt>
                                    <dd className="font-medium">
                                        {bottle.deposit_amount ? `₹${bottle.deposit_amount}` : '—'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Activity Log */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Activity Log</h2>
                            {bottle.logs.length === 0 ? (
                                <p className="text-sm text-gray-500">No activity yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {bottle.logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex gap-3 border-b border-gray-100 pb-4 last:border-0"
                                        >
                                            <div
                                                className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${actionColors[log.action] || 'bg-gray-400'}`}
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium capitalize">
                                                    {log.action}
                                                    {log.condition && (
                                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                                            ({log.condition})
                                                        </span>
                                                    )}
                                                </p>
                                                {log.notes && (
                                                    <p className="text-sm text-gray-600">{log.notes}</p>
                                                )}
                                                <div className="mt-1 flex gap-4 text-xs text-gray-500">
                                                    <span>
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </span>
                                                    <span className="capitalize">
                                                        by {log.action_by}
                                                    </span>
                                                    {log.deposit_amount && (
                                                        <span>Deposit: ₹{log.deposit_amount}</span>
                                                    )}
                                                    {log.refund_amount && (
                                                        <span>Refund: ₹{log.refund_amount}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Current Holder */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Current Holder</h2>
                            {bottle.current_user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">{bottle.current_user.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {bottle.current_user.phone}
                                            </p>
                                        </div>
                                    </div>
                                    {bottle.current_subscription && (
                                        <Link
                                            href={`/admin/subscriptions/${bottle.current_subscription.id}`}
                                            className="text-sm text-emerald-600 hover:text-emerald-700"
                                        >
                                            View Subscription
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500">Not assigned</p>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Timeline</h2>
                            <div className="space-y-3">
                                {bottle.issued_at && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Issued</p>
                                            <p className="text-sm">
                                                {new Date(bottle.issued_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {bottle.returned_at && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Returned</p>
                                            <p className="text-sm">
                                                {new Date(bottle.returned_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {bottle.damaged_at && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-red-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Damaged</p>
                                            <p className="text-sm text-red-600">
                                                {new Date(bottle.damaged_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        {bottle.notes && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-2 font-semibold text-gray-900">Notes</h2>
                                <p className="text-sm text-gray-600">{bottle.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Issue Modal */}
            {showIssueModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Issue Bottle</h3>
                            <button
                                onClick={() => setShowIssueModal(false)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">User ID *</label>
                                <input
                                    type="number"
                                    value={issueForm.data.user_id}
                                    onChange={(e) => issueForm.setData('user_id', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Enter user ID"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Subscription ID (optional)
                                </label>
                                <input
                                    type="number"
                                    value={issueForm.data.subscription_id}
                                    onChange={(e) =>
                                        issueForm.setData('subscription_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Enter subscription ID"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Notes</label>
                                <textarea
                                    value={issueForm.data.notes}
                                    onChange={(e) => issueForm.setData('notes', e.target.value)}
                                    rows={2}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowIssueModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleIssue}
                                    disabled={!issueForm.data.user_id || issueForm.processing}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Issue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Return Bottle</h3>
                            <button
                                onClick={() => setShowReturnModal(false)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Condition *</label>
                                <select
                                    value={returnForm.data.condition}
                                    onChange={(e) => returnForm.setData('condition', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="good">Good</option>
                                    <option value="damaged">Damaged</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Notes</label>
                                <textarea
                                    value={returnForm.data.notes}
                                    onChange={(e) => returnForm.setData('notes', e.target.value)}
                                    rows={2}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowReturnModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReturn}
                                    disabled={returnForm.processing}
                                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    Return
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Damaged Modal */}
            {showDamagedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-red-700">Mark as Damaged</h3>
                            <button
                                onClick={() => setShowDamagedModal(false)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Reason *</label>
                                <textarea
                                    value={damagedForm.data.reason}
                                    onChange={(e) => damagedForm.setData('reason', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Describe the damage..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowDamagedModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMarkDamaged}
                                    disabled={!damagedForm.data.reason || damagedForm.processing}
                                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    Mark Damaged
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

