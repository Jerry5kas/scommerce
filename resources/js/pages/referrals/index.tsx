import { Head, useForm } from '@inertiajs/react';
import { Check, Copy, Gift, Share2, Users } from 'lucide-react';
import { useState } from 'react';

interface Referral {
    id: number;
    status: string;
    referrer_reward: string | null;
    referrer_reward_paid: boolean;
    created_at: string;
    referred: {
        id: number;
        name: string;
        email: string;
        created_at: string;
    };
}

interface Stats {
    referral_code: string;
    referral_link: string;
    total_referrals: number;
    pending_referrals: number;
    completed_referrals: number;
    total_rewards_earned: number;
    pending_rewards: number;
    referrer_reward_amount: number;
    referred_reward_amount: number;
}

interface Props {
    stats: Stats;
    referrals: Referral[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function ReferralsIndex({ stats, referrals }: Props) {
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(stats.referral_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(stats.referral_link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = () => {
        const text = `Join me on SCommerce! Use my referral code ${stats.referral_code} and get ₹${stats.referred_reward_amount} off your first order. ${stats.referral_link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <>
            <Head title="Refer & Earn" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-3xl px-4 py-8">
                    <h1 className="mb-6 text-2xl font-bold text-gray-900">Refer & Earn</h1>

                    {/* Rewards Info */}
                    <div className="mb-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Invite Friends, Earn Rewards</h2>
                                <p className="mt-2 text-purple-100">
                                    You get ₹{stats.referrer_reward_amount} for every friend who joins
                                </p>
                                <p className="text-purple-100">
                                    They get ₹{stats.referred_reward_amount} on their first order
                                </p>
                            </div>
                            <Gift className="h-12 w-12 opacity-50" />
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-lg bg-white/20 p-3">
                                <p className="text-2xl font-bold">{stats.total_referrals}</p>
                                <p className="text-xs opacity-80">Total Referrals</p>
                            </div>
                            <div className="rounded-lg bg-white/20 p-3">
                                <p className="text-2xl font-bold">{stats.completed_referrals}</p>
                                <p className="text-xs opacity-80">Successful</p>
                            </div>
                            <div className="rounded-lg bg-white/20 p-3">
                                <p className="text-2xl font-bold">₹{stats.total_rewards_earned}</p>
                                <p className="text-xs opacity-80">Earned</p>
                            </div>
                        </div>
                    </div>

                    {/* Referral Code */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900">Your Referral Code</h3>

                        <div className="mt-4 flex items-center gap-3">
                            <div className="flex-1 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-4 text-center">
                                <p className="text-2xl font-bold tracking-widest text-purple-600">
                                    {stats.referral_code}
                                </p>
                            </div>
                            <button
                                onClick={copyCode}
                                className="flex h-14 w-14 items-center justify-center rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200"
                            >
                                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={copyLink}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <Copy className="h-4 w-4" />
                                Copy Link
                            </button>
                            <button
                                onClick={shareWhatsApp}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                            >
                                <Share2 className="h-4 w-4" />
                                Share on WhatsApp
                            </button>
                        </div>
                    </div>

                    {/* Referral List */}
                    <div className="rounded-xl bg-white shadow-sm">
                        <div className="border-b p-4">
                            <h3 className="font-semibold text-gray-900">Your Referrals</h3>
                        </div>

                        {referrals.length === 0 ? (
                            <div className="p-8 text-center">
                                <Users className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-2 text-gray-500">No referrals yet</p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Share your code to start earning
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {referrals.map((referral) => (
                                    <div key={referral.id} className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {referral.referred.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Joined {new Date(referral.referred.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[referral.status]}`}
                                            >
                                                {referral.status}
                                            </span>
                                            {referral.referrer_reward_paid && (
                                                <p className="mt-1 text-sm text-green-600">
                                                    +₹{referral.referrer_reward}
                                                </p>
                                            )}
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

