import AdminLayout from '@/layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { BarChart3, Calendar, Package } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useState } from 'react';

interface StatSummary {
    total_bottles: number;
    in_use: number;
    available: number;
    damaged: number;
    lost: number;
}

interface DailyCount {
    date: string;
    count: number;
}

interface TypeStatusCount {
    type: string;
    status: string;
    count: number;
}

interface Filters {
    start_date: string;
    end_date: string;
}

interface Props {
    stats: StatSummary;
    issuedByDate: DailyCount[];
    returnedByDate: DailyCount[];
    byType: TypeStatusCount[];
    filters: Filters;
}

export default function BottleReports({ stats, issuedByDate, returnedByDate, byType, filters }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const applyFilters = () => {
        router.get('/admin/bottles/reports', { start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    const typeAgg = Object.values(
        byType.reduce<Record<string, number>>((acc, row) => {
            const key = `${row.type}`;
            acc[key] = (acc[key] ?? 0) + row.count;
            return acc;
        }, {})
    ).length > 0
        ? byType.reduce<Record<string, number>>((acc, row) => {
            const key = `${row.type}`;
            acc[key] = (acc[key] ?? 0) + row.count;
            return acc;
        }, {})
        : {};

    const typeChartData = Object.entries(typeAgg).map(([name, count]) => ({ name, count }));

    return (
        <AdminLayout>
            <Head title="Bottle Reports" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Bottle Reports</h1>
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

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-100 p-2">
                                <Package className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Bottles</p>
                                <p className="text-xl font-bold">{stats.total_bottles}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">In Use</p>
                                <p className="text-xl font-bold">{stats.in_use}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-100 p-2">
                                <Package className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Available</p>
                                <p className="text-xl font-bold">{stats.available}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-100 p-2">
                                <Package className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Damaged</p>
                                <p className="text-xl font-bold">{stats.damaged}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 p-2">
                                <Package className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lost</p>
                                <p className="text-xl font-bold">{stats.lost}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Issued by Date</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={issuedByDate}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Returned by Date</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={returnedByDate}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">By Type</h2>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={typeChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#7c3aed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
