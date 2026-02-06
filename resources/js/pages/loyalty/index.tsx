import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Gift, Star, Wallet } from 'lucide-react';

interface Transaction {
    id: number;
    type: string;
    points: number;
    source: string;
    description: string | null;
    created_at: string;
}

interface PaginatedTransactions {
    data: Transaction[];
    current_page: number;
    last_page: number;
}

interface Summary {
    points: number;
    total_earned: number;
    total_redeemed: number;
    money_value: number;
    points_per_delivery: number;
    points_per_order_percent: number;
    conversion_rate: number;
}

interface Props {
    summary: Summary;
    transactions: PaginatedTransactions;
}

const typeColors: Record<string, string> = {
    earned: 'text-green-600 bg-green-100',
    redeemed: 'text-red-600 bg-red-100',
    expired: 'text-gray-600 bg-gray-100',
    adjusted: 'text-blue-600 bg-blue-100',
};

export default function LoyaltyIndex({ summary, transactions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        points: 100,
    });

    const handleConvert = (e: React.FormEvent) => {
        e.preventDefault();
        post('/loyalty/convert');
    };

    return (
        <>
            <Head title="Loyalty Points" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-3xl px-4 py-8">
                    <h1 className="mb-6 text-2xl font-bold text-gray-900">Loyalty Points</h1>

                    {/* Balance Card */}
                    <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Available Points</p>
                                <p className="text-4xl font-bold">{summary.points.toLocaleString()}</p>
                                <p className="mt-1 text-sm opacity-80">
                                    Worth ₹{summary.money_value.toFixed(2)}
                                </p>
                            </div>
                            <Star className="h-16 w-16 opacity-30" />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-white/20 p-3">
                                <p className="text-xs opacity-80">Total Earned</p>
                                <p className="text-lg font-semibold">{summary.total_earned.toLocaleString()}</p>
                            </div>
                            <div className="rounded-lg bg-white/20 p-3">
                                <p className="text-xs opacity-80">Total Redeemed</p>
                                <p className="text-lg font-semibold">{summary.total_redeemed.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* How to Earn */}
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <h3 className="font-semibold text-amber-900">How to Earn Points</h3>
                        <ul className="mt-2 space-y-1 text-sm text-amber-800">
                            <li>• Earn {summary.points_per_delivery} points per delivery</li>
                            <li>• Earn {summary.points_per_order_percent}% of order value as points</li>
                            <li>• Refer friends and earn bonus points</li>
                        </ul>
                    </div>

                    {/* Convert to Wallet */}
                    {summary.points >= 100 && (
                        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
                            <h3 className="font-semibold text-gray-900">Convert to Wallet</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {summary.conversion_rate} point = ₹1
                            </p>

                            <form onSubmit={handleConvert} className="mt-4 flex gap-3">
                                <input
                                    type="number"
                                    min={100}
                                    max={summary.points}
                                    step={10}
                                    value={data.points}
                                    onChange={(e) => setData('points', parseInt(e.target.value) || 0)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                                />
                                <button
                                    type="submit"
                                    disabled={processing || data.points > summary.points || data.points < 100}
                                    className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                                >
                                    <Wallet className="h-4 w-4" />
                                    Convert
                                </button>
                            </form>
                            {errors.points && (
                                <p className="mt-2 text-sm text-red-600">{errors.points}</p>
                            )}
                        </div>
                    )}

                    {/* Transactions */}
                    <div className="rounded-xl bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                            <Link
                                href="/loyalty/transactions"
                                className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                            >
                                View All
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {transactions.data.length === 0 ? (
                            <div className="p-8 text-center">
                                <Gift className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-2 text-gray-500">No activity yet</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {transactions.data.slice(0, 10).map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {tx.description || tx.source}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div
                                            className={`rounded-full px-3 py-1 text-sm font-medium ${typeColors[tx.type] || 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {tx.points > 0 ? '+' : ''}
                                            {tx.points}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

