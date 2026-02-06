import { Head, router } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, Shield } from 'lucide-react';
import { useState } from 'react';

interface Wallet {
    id: number;
    balance: string;
    auto_recharge_enabled: boolean;
    auto_recharge_amount: string | null;
    auto_recharge_threshold: string | null;
    low_balance_threshold: string;
}

interface Props {
    wallet: Wallet;
}

export default function AutoRecharge({ wallet }: Props) {
    const [enabled, setEnabled] = useState(wallet.auto_recharge_enabled);
    const [amount, setAmount] = useState(wallet.auto_recharge_amount || '500');
    const [threshold, setThreshold] = useState(wallet.auto_recharge_threshold || '100');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (enabled) {
            const numericAmount = parseFloat(amount);
            const numericThreshold = parseFloat(threshold);

            if (isNaN(numericAmount) || numericAmount < 100) {
                setError('Minimum recharge amount is ₹100');
                return;
            }
            if (isNaN(numericThreshold) || numericThreshold < 50) {
                setError('Minimum threshold is ₹50');
                return;
            }
            if (numericThreshold >= numericAmount) {
                setError('Threshold must be less than recharge amount');
                return;
            }
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        router.post(
            '/wallet/auto-recharge',
            {
                enabled,
                amount: enabled ? parseFloat(amount) : null,
                threshold: enabled ? parseFloat(threshold) : null,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    setSuccess(enabled ? 'Auto-recharge enabled successfully!' : 'Auto-recharge disabled');
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    setError(Object.values(errors).flat().join(', ') || 'Failed to update settings');
                },
            }
        );
    };

    const suggestedAmounts = [100, 200, 500, 1000];
    const suggestedThresholds = [50, 100, 200, 500];

    return (
        <>
            <Head title="Auto Recharge Settings" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
                    <div className="mx-auto flex max-w-lg items-center gap-4 px-4 py-4">
                        <button
                            onClick={() => window.history.back()}
                            className="rounded-lg p-2 hover:bg-gray-100"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-lg font-semibold">Auto Recharge</h1>
                    </div>
                </header>

                <div className="mx-auto max-w-lg px-4 py-6">
                    {/* Info Banner */}
                    <div className="mb-6 flex gap-3 rounded-xl bg-blue-50 p-4">
                        <RefreshCw className="h-5 w-5 shrink-0 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">Never run out of balance</p>
                            <p className="text-xs text-blue-700">
                                Auto recharge tops up your wallet automatically when balance falls below
                                your set threshold.
                            </p>
                        </div>
                    </div>

                    {success && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{success}</div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Enable Toggle */}
                        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                            <div>
                                <p className="font-medium text-gray-900">Enable Auto Recharge</p>
                                <p className="text-xs text-gray-500">
                                    Automatically add money when balance is low
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEnabled(!enabled)}
                                className={`relative h-6 w-11 rounded-full transition ${
                                    enabled ? 'bg-emerald-600' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${
                                        enabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>

                        {enabled && (
                            <>
                                {/* Recharge Amount */}
                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Recharge Amount
                                    </label>
                                    <p className="mb-3 text-xs text-gray-500">
                                        Amount to add when auto recharge triggers
                                    </p>
                                    <div className="relative mb-3">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            min="100"
                                            max="10000"
                                            className="w-full rounded-lg border border-gray-300 py-3 pl-8 pr-4 text-lg font-semibold focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedAmounts.map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setAmount(amt.toString())}
                                                className={`rounded-lg border px-3 py-1.5 text-sm ${
                                                    amount === amt.toString()
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                                }`}
                                            >
                                                ₹{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Threshold */}
                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Trigger Threshold
                                    </label>
                                    <p className="mb-3 text-xs text-gray-500">
                                        Recharge when balance falls below this amount
                                    </p>
                                    <div className="relative mb-3">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            value={threshold}
                                            onChange={(e) => setThreshold(e.target.value)}
                                            min="50"
                                            max="5000"
                                            className="w-full rounded-lg border border-gray-300 py-3 pl-8 pr-4 text-lg font-semibold focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedThresholds.map((thr) => (
                                            <button
                                                key={thr}
                                                type="button"
                                                onClick={() => setThreshold(thr.toString())}
                                                className={`rounded-lg border px-3 py-1.5 text-sm ${
                                                    threshold === thr.toString()
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                                }`}
                                            >
                                                ₹{thr}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-emerald-600 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Settings'}
                        </button>
                    </form>

                    {/* Security Note */}
                    <div className="mt-6 flex gap-3 rounded-lg bg-gray-100 p-4">
                        <Shield className="h-5 w-5 shrink-0 text-gray-500" />
                        <p className="text-xs text-gray-600">
                            <strong>Secure:</strong> Auto recharge uses your saved payment method.
                            You can disable it anytime. Maximum auto recharge is ₹10,000 per
                            transaction.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

