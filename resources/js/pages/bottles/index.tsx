import { Head, Link } from '@inertiajs/react';
import { Eye, GlassWater, History } from 'lucide-react';

interface Bottle {
    id: number;
    bottle_number: string;
    type: string;
    capacity: string | null;
    status: string;
    deposit_amount: string | null;
    issued_at: string | null;
    current_subscription: { id: number } | null;
}

interface Balance {
    issued: number;
    returned: number;
    balance: number;
    total_deposit: number;
}

interface Props {
    bottles: Bottle[];
    balance: Balance;
}

const statusColors: Record<string, string> = {
    issued: 'bg-blue-100 text-blue-700',
};

const statusLabels: Record<string, string> = {
    issued: 'With You',
};

export default function BottlesIndex({ bottles, balance }: Props) {
    return (
        <>
            <Head title="My Bottles" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-3xl px-4 py-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">My Bottles</h1>
                        <Link
                            href="/bottles/history"
                            className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700"
                        >
                            <History className="h-4 w-4" />
                            History
                        </Link>
                    </div>

                    {/* Balance Card */}
                    <div className="mb-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                        <h2 className="text-lg font-semibold">Bottle Balance</h2>
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm opacity-80">Currently Held</p>
                                <p className="text-3xl font-bold">{balance.balance}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-80">Total Issued</p>
                                <p className="text-2xl font-semibold">{balance.issued}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-80">Returned</p>
                                <p className="text-2xl font-semibold">{balance.returned}</p>
                            </div>
                        </div>
                        {balance.total_deposit > 0 && (
                            <div className="mt-4 rounded-lg bg-white/20 px-4 py-2">
                                <p className="text-sm">
                                    Deposit held: <span className="font-semibold">₹{balance.total_deposit}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="mb-6 rounded-xl bg-blue-50 p-4">
                        <p className="text-sm text-blue-800">
                            Bottles are issued with your Society Fresh subscription. Please return bottles
                            during your next delivery to get your deposit refunded.
                        </p>
                    </div>

                    {/* Bottles List */}
                    {bottles.length === 0 ? (
                        <div className="rounded-xl bg-white p-12 text-center">
                            <GlassWater className="mx-auto h-16 w-16 text-gray-300" />
                            <p className="mt-4 text-gray-500">No bottles currently held</p>
                            <p className="mt-2 text-sm text-gray-400">
                                Bottles will appear here when issued with your subscription
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bottles.map((bottle) => (
                                <div
                                    key={bottle.id}
                                    className="rounded-xl border border-gray-200 bg-white p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                                                <GlassWater className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {bottle.bottle_number}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {bottle.type} {bottle.capacity && `• ${bottle.capacity}L`}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[bottle.status] || 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {statusLabels[bottle.status] || bottle.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <div className="text-sm text-gray-500">
                                            {bottle.issued_at && (
                                                <span>
                                                    Issued on{' '}
                                                    {new Date(bottle.issued_at).toLocaleDateString()}
                                                </span>
                                            )}
                                            {bottle.deposit_amount && (
                                                <span className="ml-3">
                                                    Deposit: ₹{bottle.deposit_amount}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href={`/bottles/${bottle.id}`}
                                            className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

