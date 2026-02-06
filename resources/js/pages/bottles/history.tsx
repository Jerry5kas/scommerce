import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, GlassWater } from 'lucide-react';

interface Bottle {
    id: number;
    bottle_number: string;
}

interface BottleLog {
    id: number;
    action: string;
    condition: string | null;
    notes: string | null;
    deposit_amount: string | null;
    refund_amount: string | null;
    created_at: string;
    bottle: Bottle | null;
}

interface PaginatedLogs {
    data: BottleLog[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    logs: PaginatedLogs;
}

const actionColors: Record<string, string> = {
    issued: 'bg-blue-100 text-blue-700',
    returned: 'bg-green-100 text-green-700',
    damaged: 'bg-red-100 text-red-700',
    lost: 'bg-orange-100 text-orange-700',
    created: 'bg-gray-100 text-gray-700',
};

export default function BottleHistory({ logs }: Props) {
    return (
        <>
            <Head title="Bottle History" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-3xl px-4 py-8">
                    <div className="mb-6">
                        <Link
                            href="/bottles"
                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to My Bottles
                        </Link>
                    </div>

                    <h1 className="mb-6 text-2xl font-bold text-gray-900">Bottle History</h1>

                    {logs.data.length === 0 ? (
                        <div className="rounded-xl bg-white p-12 text-center">
                            <GlassWater className="mx-auto h-16 w-16 text-gray-300" />
                            <p className="mt-4 text-gray-500">No bottle history yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {logs.data.map((log) => (
                                <div
                                    key={log.id}
                                    className="rounded-xl border border-gray-200 bg-white p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                                <GlassWater className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 capitalize">
                                                    {log.action}
                                                </p>
                                                {log.bottle && (
                                                    <p className="text-sm text-gray-500">
                                                        {log.bottle.bottle_number}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {log.action}
                                            </span>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {new Date(log.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {(log.notes || log.deposit_amount || log.refund_amount) && (
                                        <div className="mt-3 border-t pt-3">
                                            {log.notes && (
                                                <p className="text-sm text-gray-600">{log.notes}</p>
                                            )}
                                            <div className="mt-2 flex gap-4 text-sm">
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
                                                {log.condition && (
                                                    <span className="capitalize text-gray-500">
                                                        Condition: {log.condition}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            {logs.prev_page_url && (
                                <Link
                                    href={logs.prev_page_url}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            )}
                            <span className="text-sm text-gray-500">
                                Page {logs.current_page} of {logs.last_page}
                            </span>
                            {logs.next_page_url && (
                                <Link
                                    href={logs.next_page_url}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

