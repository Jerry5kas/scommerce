import { Head, router } from '@inertiajs/react';
import { BarChart3, Calendar, Gift, Percent, Users } from 'lucide-react';
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import AdminLayout from '@/layouts/AdminLayout';

interface DailyReferral {
    date: string;
    count: number;
}

interface TopReferrer {
    referrer_id: number;
    referral_count: number;
    total_rewards: number;
    referrer?: { id: number; name: string | null; email: string | null };
}

interface Filters {
    start_date: string;
    end_date: string;
}

interface Props {
    dailyReferrals: DailyReferral[];
    topReferrers: TopReferrer[];
    conversionRate: number;
    filters: Filters;
}

export default function ReferralReports({ dailyReferrals, topReferrers, conversionRate, filters }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const applyFilters = () => {
        router.get('/admin/referrals/reports', { start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Referral Reports" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Referral Reports</h1>
                    <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-indigo-700">
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-sm font-medium">Analytics</span>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-[200px] rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-[200px] rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                                <Gift className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Referrals</p>
                                <p className="text-xl font-bold">{dailyReferrals.reduce((acc, d) => acc + d.count, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-100 p-2">
                                <Percent className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Conversion Rate</p>
                                <p className="text-xl font-bold">{conversionRate}%</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Top Referrer</p>
                                <p className="text-xl font-bold">
                                    {topReferrers[0]?.referrer?.name ?? `#${topReferrers[0]?.referrer_id ?? '-'}`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-2">
                                <Gift className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Rewards (Top 10)</p>
                                <p className="text-xl font-bold">₹{topReferrers.reduce((acc, r) => acc + r.total_rewards, 0).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Daily Referrals</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyReferrals}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Top Referrers</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topReferrers.map((r) => ({ name: r.referrer?.name ?? `#${r.referrer_id}`, referrals: r.referral_count }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="referrals" fill="#2563eb" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
