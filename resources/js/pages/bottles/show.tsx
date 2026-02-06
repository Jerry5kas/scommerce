import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, GlassWater, Calendar, Package, User } from 'lucide-react';

interface BottleLog {
    id: number;
    action: string;
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
    deposit_amount: string | null;
    issued_at: string | null;
    returned_at: string | null;
    notes: string | null;
    current_subscription: {
        id: number;
        subscription_plan: { name: string };
    } | null;
    logs: BottleLog[];
}

interface Props {
    bottle: Bottle;
}

const statusColors: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    issued: 'bg-blue-100 text-blue-700',
    returned: 'bg-gray-100 text-gray-700',
    damaged: 'bg-red-100 text-red-700',
    lost: 'bg-orange-100 text-orange-700',
};

const actionColors: Record<string, string> = {
    issued: 'bg-blue-500',
    returned: 'bg-green-500',
    damaged: 'bg-red-500',
    lost: 'bg-orange-500',
    created: 'bg-gray-500',
};

export default function BottleShow({ bottle }: Props) {
    return (
        <>
            <Head title={`Bottle ${bottle.bottle_number}`} />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-3xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href="/bottles"
                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to My Bottles
                        </Link>
                    </div>

                    {/* Bottle Info Card */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100">
                                    <GlassWater className="h-8 w-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {bottle.bottle_number}
                                    </h1>
                                    <p className="text-gray-500">
                                        {bottle.type} {bottle.capacity && `• ${bottle.capacity}L`}
                                    </p>
                                    {bottle.barcode && (
                                        <p className="mt-1 text-sm text-gray-400">
                                            Barcode: {bottle.barcode}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${statusColors[bottle.status] || 'bg-gray-100 text-gray-700'}`}
                            >
                                {bottle.status}
                            </span>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    Issued Date
                                </div>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {bottle.issued_at
                                        ? new Date(bottle.issued_at).toLocaleDateString()
                                        : 'Not issued'}
                                </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Package className="h-4 w-4" />
                                    Subscription
                                </div>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {bottle.current_subscription?.subscription_plan?.name || 'None'}
                                </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <User className="h-4 w-4" />
                                    Deposit
                                </div>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {bottle.deposit_amount ? `₹${bottle.deposit_amount}` : 'None'}
                                </p>
                            </div>
                        </div>

                        {bottle.notes && (
                            <div className="mt-4 rounded-lg border border-gray-200 p-4">
                                <p className="text-sm text-gray-600">{bottle.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">History</h2>

                        {bottle.logs.length === 0 ? (
                            <p className="text-sm text-gray-500">No history available</p>
                        ) : (
                            <div className="relative">
                                <div className="absolute left-2 top-0 h-full w-0.5 bg-gray-200" />
                                <div className="space-y-6">
                                    {bottle.logs.map((log, index) => (
                                        <div key={log.id} className="relative flex gap-4">
                                            <div
                                                className={`relative z-10 h-4 w-4 rounded-full ${actionColors[log.action] || 'bg-gray-500'}`}
                                            />
                                            <div className="flex-1 -mt-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium capitalize text-gray-900">
                                                        {log.action}
                                                        {log.condition && (
                                                            <span className="ml-2 text-sm font-normal text-gray-500">
                                                                ({log.condition})
                                                            </span>
                                                        )}
                                                    </p>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(log.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {log.notes && (
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {log.notes}
                                                    </p>
                                                )}
                                                {(log.deposit_amount || log.refund_amount) && (
                                                    <div className="mt-1 flex gap-4 text-sm">
                                                        {log.deposit_amount && (
                                                            <span className="text-blue-600">
                                                                Deposit: ₹{log.deposit_amount}
                                                            </span>
                                                        )}
                                                        {log.refund_amount && (
                                                            <span className="text-green-600">
                                                                Refund: ₹{log.refund_amount}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

