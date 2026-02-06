import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    Package,
    PackageX,
    Users,
    UserX,
    UserPlus,
    Headphones,
    TrendingUp,
    Wallet,
    Clock,
    CheckCircle,
    XCircle,
    IndianRupee,
    Sun,
    Moon,
    Package as BottleIcon,
    ShoppingCart,
    FileText,
    BarChart3,
    Milk,
    DollarSign,
    Image as ImageIcon,
    ArrowRight,
    RefreshCw,
    Bell,
    ChevronDown,
    Truck,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    LineChart,
    Line,
    Area,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
    totalOrders?: number;
    cancelOrders?: number;
    totalActiveSubscriptions?: number;
    totalInactiveSubscriptions?: number;
    totalNewSubscriptions?: number;
    openTickets?: number;
    avgOrderValue?: number;
    totalRevenue?: number;
    totalRefund?: number;
    morningOrders?: {
        delivered: number;
        total: number;
    };
    eveningOrders?: {
        delivered: number;
        total: number;
    };
    bottleCollection?: {
        collected: number;
        pending: number;
    };
    cashCollection?: {
        request: number;
        collected: number;
        accepted: number;
    };
    revenueData?: Array<{
        date: string;
        revenue: number;
        refund: number;
    }>;
    refundAmount?: {
        totalAmount: number;
        requestedAmount: number;
        refundedAmount: number;
        cancelRefundAmount: number;
    };
    pendingRefunds?: Array<{
        id: number;
        customerName: string;
        hubName: string;
        refundAmount: number;
    }>;
    lowWalletCustomers?: Array<{
        id: number;
        customerName: string;
        hubName: string;
        tomorrowLedgerBalance: number;
        tomorrowOrderValue: number;
    }>;
    subscriptionsEnds?: Array<{
        id: number;
        customerName: string;
        endDate: string;
    }>;
    latestRecharges?: Array<{
        id: number;
        dateTime: string;
        customerName: string;
        hubName: string;
        orderId: string;
        amount: number;
        type: string;
    }>;
    riders?: Array<{
        id: number;
        code: string;
        phone: string;
        status: 'online' | 'offline';
        morning: {
            completed: number;
            total: number;
        };
        evening: {
            completed: number;
            total: number;
        };
        location: string;
        hub: string;
    }>;
}

interface AdminDashboardPageProps {
    stats: DashboardStats;
    hubs?: Array<{ id: number; name: string }>;
    selectedHub?: number | null;
    dateRange?: string;
}

function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

export default function AdminDashboard({
    stats,
    hubs = [],
    selectedHub = null,
    dateRange = 'today',
}: AdminDashboardPageProps) {
    const [selectedHubId, setSelectedHubId] = useState<number | null>(selectedHub);
    const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
    const [avgOrderValue, setAvgOrderValue] = useState(stats.avgOrderValue ?? 0);
    const [chartHeight, setChartHeight] = useState(160);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateChartHeight = () => {
            if (chartContainerRef.current) {
                const width = chartContainerRef.current.offsetWidth;
                // More compact chart heights for mobile
                const height = width >= 1024 ? 256 : width >= 640 ? 200 : 160;
                setChartHeight(height);
            }
        };

        updateChartHeight();
        window.addEventListener('resize', updateChartHeight);
        return () => window.removeEventListener('resize', updateChartHeight);
    }, []);

    const formatCurrency = (amount: number | undefined | null): string => {
        const value = amount ?? 0;
        return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string | undefined | null): string => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string | undefined | null): string => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <AdminLayout>
            <Head title="Dashboard - Admin" />
            <div className="min-w-0 space-y-3 sm:space-y-4 lg:space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 shrink-0">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">Dashboard</h1>
                        <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">Overview of your business metrics and performance</p>
                    </div>
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
                        <div className="flex shrink-0 items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm sm:px-3 sm:py-2">
                            <span className="whitespace-nowrap text-xs font-medium text-gray-600">Avg Order</span>
                            <span className="whitespace-nowrap text-xs font-bold text-[var(--admin-dark-primary)] sm:text-sm">
                                {formatCurrency(avgOrderValue)}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2.5">
                            <select
                                value={selectedDateRange}
                                onChange={(e) => setSelectedDateRange(e.target.value)}
                                className="min-w-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors focus:border-[var(--admin-dark-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 sm:px-3 sm:py-2 sm:text-sm"
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                            <select
                                value={selectedHubId || ''}
                                onChange={(e) => setSelectedHubId(e.target.value ? Number(e.target.value) : null)}
                                className="min-w-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors focus:border-[var(--admin-dark-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-dark-primary)]/20 sm:px-3 sm:py-2 sm:text-sm"
                            >
                                <option value="">Select Hub</option>
                                {hubs.map((hub) => (
                                    <option key={hub.id} value={hub.id}>
                                        {hub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <button
                                type="button"
                                className="flex-1 whitespace-nowrap rounded-lg bg-[var(--admin-dark-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[var(--admin-dark-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-dark-primary)] focus:ring-offset-2 sm:flex-none sm:px-4 sm:py-2 sm:text-sm"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                className="shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:px-3 sm:py-2"
                            >
                                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Alert Box */}
                <div className="overflow-hidden rounded-lg border border-[var(--admin-accent)]/30 bg-gradient-to-r from-[var(--admin-accent)]/10 to-[var(--admin-accent)]/5 p-3 shadow-sm sm:rounded-xl sm:p-4">
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-accent)]/20 sm:h-9 sm:w-9">
                                <Bell className="h-3.5 w-3.5 text-[var(--admin-accent)] sm:h-4 sm:w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-gray-900 sm:text-sm">Action Required</p>
                                <p className="mt-0.5 text-[11px] leading-tight text-gray-700 sm:mt-1 sm:text-xs">
                                    Please update the social media link to make sure the site works well.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="w-full shrink-0 whitespace-nowrap rounded-lg bg-[var(--admin-dark-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[var(--admin-dark-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-dark-primary)] sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
                        >
                            Configure Now
                        </button>
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
                    <MetricCard
                        icon={Package}
                        value={stats.totalOrders ?? 0}
                        label="Total Orders"
                        color="bg-[var(--admin-dark-primary)]"
                    />
                    <MetricCard
                        icon={PackageX}
                        value={stats.cancelOrders ?? 0}
                        label="Cancel Orders"
                        color="bg-gray-500"
                    />
                    <MetricCard
                        icon={Users}
                        value={stats.totalActiveSubscriptions ?? 0}
                        label="Total Active Subscriptions"
                        color="bg-[var(--admin-dark-primary)]"
                    />
                    <MetricCard
                        icon={UserX}
                        value={stats.totalInactiveSubscriptions ?? 0}
                        label="Total Inactive Subscriptions"
                        color="bg-gray-500"
                    />
                    <MetricCard
                        icon={UserPlus}
                        value={stats.totalNewSubscriptions ?? 0}
                        label="Total New Subscriptions"
                        color="bg-[var(--admin-accent)]"
                    />
                    <MetricCard
                        icon={Headphones}
                        value={stats.openTickets ?? 0}
                        label="Open Tickets"
                        color="bg-[var(--admin-accent)]"
                    />
                </div>

                {/* Revenue/Refund Chart Section */}
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
                    <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:rounded-xl sm:p-4 lg:col-span-2 lg:p-6">
                        <div className="mb-3 flex flex-col gap-1.5 sm:mb-4 sm:flex-row sm:items-center sm:justify-between lg:mb-6">
                            <div className="min-w-0">
                                <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">Revenue & Refund</h2>
                                <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs lg:text-sm">Track your revenue and refund trends</p>
                            </div>
                        </div>
                        <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1 sm:mb-4 sm:gap-x-4 lg:gap-x-6">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--admin-dark-primary)] sm:h-2.5 sm:w-2.5"></div>
                                <span className="whitespace-nowrap text-[10px] text-gray-600 sm:text-xs">{formatCurrency(stats.totalRevenue)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--admin-accent)] sm:h-2.5 sm:w-2.5"></div>
                                <span className="whitespace-nowrap text-[10px] text-gray-600 sm:text-xs">{formatCurrency(stats.totalRefund)}</span>
                            </div>
                        </div>
                        <div 
                            ref={chartContainerRef}
                            className="relative w-full overflow-hidden" 
                            style={{ height: `${chartHeight}px`, minHeight: '140px' }}
                        >
                            {stats.revenueData && stats.revenueData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={chartHeight} debounce={1}>
                                    <AreaChart data={stats.revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--admin-dark-primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--admin-dark-primary)" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorRefund" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--admin-accent)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--admin-accent)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#6B7280"
                                            style={{ fontSize: '12px' }}
                                            tickFormatter={(value) => formatDate(value)}
                                        />
                                        <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                                            labelFormatter={(label) => `Date: ${formatDate(label)}`}
                                        />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="var(--admin-dark-primary)"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            name="Revenue"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="refund"
                                            stroke="var(--admin-accent)"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRefund)"
                                            name="Refund"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                    No data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Refund Amount Sidebar */}
                    <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:rounded-xl sm:p-4 lg:p-6">
                        <div className="mb-3 flex items-center justify-between sm:mb-4 lg:mb-6">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Wallet className="h-3.5 w-3.5 shrink-0 text-gray-600 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                                    <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">Refund Amount</h2>
                                </div>
                                <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">Refund statistics</p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-400 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        </div>
                        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                            <RefundMetric
                                label="Total Amount"
                                value={formatCurrency(stats.refundAmount?.totalAmount)}
                                icon={IndianRupee}
                                color="bg-[var(--admin-dark-primary)]/10 text-[var(--admin-dark-primary)]"
                            />
                            <RefundMetric
                                label="Requested Amount"
                                value={formatCurrency(stats.refundAmount?.requestedAmount)}
                                icon={Clock}
                                color="bg-[var(--admin-accent)]/10 text-[var(--admin-accent)]"
                            />
                            <RefundMetric
                                label="Refunded Amount"
                                value={formatCurrency(stats.refundAmount?.refundedAmount)}
                                icon={CheckCircle}
                                color="bg-[var(--admin-dark-primary)]/10 text-[var(--admin-dark-primary)]"
                            />
                            <RefundMetric
                                label="Cancel Refund Amount"
                                value={formatCurrency(stats.refundAmount?.cancelRefundAmount)}
                                icon={XCircle}
                                color="bg-gray-100 text-gray-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Operational Metrics */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
                    <OperationalCard
                        title="Morning Orders"
                        icon={Sun}
                        delivered={stats.morningOrders?.delivered ?? 0}
                        total={stats.morningOrders?.total ?? 0}
                        label="Delivered"
                        totalLabel="Total Orders"
                    />
                    <OperationalCard
                        title="Evening Orders"
                        icon={Moon}
                        delivered={stats.eveningOrders?.delivered ?? 0}
                        total={stats.eveningOrders?.total ?? 0}
                        label="Delivered"
                        totalLabel="Total Orders"
                    />
                    <OperationalCard
                        title="Bottle Collection"
                        icon={BottleIcon}
                        delivered={stats.bottleCollection?.collected ?? 0}
                        total={stats.bottleCollection?.pending ?? 0}
                        label="Collected"
                        totalLabel="Pending"
                    />
                    <OperationalCard
                        title="Cash Collection"
                        icon={IndianRupee}
                        delivered={stats.cashCollection?.request ?? 0}
                        total={stats.cashCollection?.collected ?? 0}
                        accepted={stats.cashCollection?.accepted ?? 0}
                        label="Request"
                        totalLabel="Collection"
                        acceptedLabel="Accepted"
                    />
                </div>

                {/* Two Tables Side by Side */}
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6">
                    <TableCard
                        title="Latest Pending Refunds"
                        viewAllLink="#"
                        headers={['Customer Name', 'Hub Name', 'Refund Amount']}
                        data={(stats.pendingRefunds ?? []).map((refund) => [
                            refund.customerName,
                            refund.hubName,
                            formatCurrency(refund.refundAmount),
                        ])}
                    />
                    <TableCard
                        title="Low Wallet/Credit Amount"
                        viewAllLink="#"
                        headers={['Customer Name', 'Hub Name', 'Tomorrow Ledger balance', 'Tomorrow Order value']}
                        data={(stats.lowWalletCustomers ?? []).map((customer) => [
                            customer.customerName,
                            customer.hubName,
                            formatCurrency(customer.tomorrowLedgerBalance),
                            formatCurrency(customer.tomorrowOrderValue),
                        ])}
                    />
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:gap-4">
                    <NavigationCard icon={ShoppingCart} label="Orders" />
                    <NavigationCard icon={FileText} label="Subscription Reports" />
                    <NavigationCard icon={BarChart3} label="Predictive Analysis" />
                    <NavigationCard icon={Milk} label="Reverse Logistic" />
                    <NavigationCard icon={DollarSign} label="Cash Collections" />
                    <NavigationCard icon={ImageIcon} label="Image Proof" />
                </div>

                {/* Subscriptions Ends and Latest Recharge Details */}
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6">
                    <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:rounded-xl sm:p-4 lg:p-6">
                        <div className="mb-3 flex flex-col gap-1.5 sm:mb-4 sm:flex-row sm:items-center sm:justify-between lg:mb-6">
                            <div className="min-w-0">
                                <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">Subscriptions Ends</h2>
                                <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">Upcoming subscription expirations</p>
                            </div>
                            <button className="shrink-0 whitespace-nowrap text-xs font-semibold text-[var(--admin-dark-primary)] transition-colors hover:text-[var(--admin-dark-primary-hover)] sm:text-sm">
                                View All
                            </button>
                        </div>
                        {(stats.subscriptionsEnds ?? []).length === 0 ? (
                            <div className="py-8 text-center sm:py-10 lg:py-12">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                                    <Package className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
                                </div>
                                <p className="mt-3 text-xs font-medium text-gray-900 sm:mt-4 sm:text-sm">No data available</p>
                                <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">Subscriptions ending data will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                                {(stats.subscriptionsEnds ?? []).map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50/50 px-2.5 py-2 transition-colors hover:bg-gray-50 sm:rounded-lg sm:px-3 sm:py-2.5 lg:px-4 lg:py-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">{sub.customerName}</p>
                                            <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">Ends on {formatDate(sub.endDate)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm sm:rounded-xl">
                        <div className="flex flex-col gap-1.5 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 lg:p-6">
                            <div className="min-w-0">
                                <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">Latest Recharge Details</h2>
                                <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">Recent wallet recharges and transactions</p>
                            </div>
                            <button className="shrink-0 whitespace-nowrap text-xs font-semibold text-[var(--admin-dark-primary)] transition-colors hover:text-[var(--admin-dark-primary-hover)] sm:text-sm">
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[400px]">
                                <thead>
                                    <tr className="border-y border-gray-200 bg-gray-50/50">
                                        <th className="whitespace-nowrap px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-600 first:pl-3 sm:px-3 sm:py-2 sm:text-xs sm:first:pl-4 lg:first:pl-6">
                                            Date & Time
                                        </th>
                                        <th className="whitespace-nowrap px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-600 sm:px-3 sm:py-2 sm:text-xs">
                                            Customer
                                        </th>
                                        <th className="whitespace-nowrap px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-600 sm:px-3 sm:py-2 sm:text-xs">
                                            Hub
                                        </th>
                                        <th className="whitespace-nowrap px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-600 sm:px-3 sm:py-2 sm:text-xs">
                                            Order ID
                                        </th>
                                        <th className="whitespace-nowrap px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-600 last:pr-3 sm:px-3 sm:py-2 sm:text-xs sm:last:pr-4 lg:last:pr-6">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(stats.latestRecharges ?? []).map((recharge) => (
                                        <tr key={recharge.id} className="transition-colors hover:bg-gray-50/50">
                                            <td className="whitespace-nowrap px-2 py-1.5 text-[10px] text-gray-900 first:pl-3 sm:px-3 sm:py-2 sm:text-xs sm:first:pl-4 lg:first:pl-6">
                                                {formatDateTime(recharge.dateTime)}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-1.5 text-[10px] font-medium text-gray-900 sm:px-3 sm:py-2 sm:text-xs">
                                                {recharge.customerName}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-1.5 text-[10px] text-gray-900 sm:px-3 sm:py-2 sm:text-xs">{recharge.hubName}</td>
                                            <td className="whitespace-nowrap px-2 py-1.5 text-[10px] text-gray-600 sm:px-3 sm:py-2 sm:text-xs">{recharge.orderId}</td>
                                            <td className="whitespace-nowrap px-2 py-1.5 text-[10px] font-semibold text-gray-900 last:pr-3 sm:px-3 sm:py-2 sm:text-xs sm:last:pr-4 lg:last:pr-6">
                                                {formatCurrency(recharge.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Our Riders */}
                <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:rounded-xl sm:p-4 lg:p-6">
                    <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between lg:mb-6">
                        <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">Our Riders</h2>
                            <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">Rider status and delivery progress</p>
                        </div>
                        <button className="w-full shrink-0 whitespace-nowrap rounded-md bg-[var(--admin-dark-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[var(--admin-dark-primary-hover)] sm:w-auto sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm">
                            View All
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
                        {(stats.riders ?? []).map((rider) => (
                            <RiderCard key={rider.id} rider={rider} />
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Helper Components
interface MetricCardProps {
    icon: React.ComponentType<{ className?: string }>;
    value: number;
    label: string;
    color: string;
}

function MetricCard({ icon: Icon, value, label, color }: MetricCardProps) {
    return (
        <div className="group relative min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md sm:rounded-xl sm:p-4 lg:p-5">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">{value.toLocaleString()}</p>
                    <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-tight text-gray-600 sm:mt-1.5 sm:text-xs lg:text-sm">{label}</p>
                </div>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color} text-white shadow-sm sm:h-10 sm:w-10 lg:h-12 lg:w-12 lg:rounded-xl`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
            </div>
            <ArrowRight className="absolute right-1.5 top-1.5 h-3 w-3 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 sm:right-2 sm:top-2 sm:h-4 sm:w-4" />
        </div>
    );
}

interface RefundMetricProps {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

function RefundMetric({ label, value, icon: Icon, color }: RefundMetricProps) {
    return (
        <div className="flex items-center gap-2 overflow-hidden rounded-lg border border-gray-100 bg-gray-50/50 p-2 transition-colors hover:bg-gray-50 sm:gap-3 sm:p-3 lg:gap-4 lg:p-4">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color} shadow-sm sm:h-9 sm:w-9 lg:h-10 lg:w-10 lg:rounded-xl`}>
                <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium text-gray-600 sm:text-xs lg:text-sm">{label}</p>
                <p className="mt-0.5 truncate text-sm font-bold text-gray-900 sm:text-base lg:text-lg">{value}</p>
            </div>
        </div>
    );
}

interface OperationalCardProps {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    delivered: number;
    total: number;
    label: string;
    totalLabel: string;
    accepted?: number;
    acceptedLabel?: string;
}

function OperationalCard({
    title,
    icon: Icon,
    delivered,
    total,
    label,
    totalLabel,
    accepted,
    acceptedLabel,
}: OperationalCardProps) {
    const percentage = calculatePercentage(delivered, total);
    const circumference = 2 * Math.PI * 30;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-all duration-200 hover:shadow-md sm:rounded-xl sm:p-4 lg:p-5">
            <div className="mb-2 flex items-center justify-between gap-1 sm:mb-4 sm:gap-2">
                <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 sm:h-8 sm:w-8 lg:h-9 lg:w-9 lg:rounded-lg">
                        <Icon className="h-3.5 w-3.5 text-gray-700 sm:h-4 sm:w-4" />
                    </div>
                    <h3 className="truncate text-[10px] font-semibold text-gray-900 sm:text-xs lg:text-sm">{title}</h3>
                </div>
                <ArrowRight className="h-3 w-3 shrink-0 text-gray-400 sm:h-4 sm:w-4" />
            </div>
            <div className="mb-2 space-y-0.5 sm:mb-4 sm:space-y-1">
                <p className="text-[10px] font-medium text-gray-900 sm:text-xs">
                    {delivered} <span className="text-gray-600">{label}</span>
                </p>
                <p className="text-[10px] font-medium text-gray-900 sm:text-xs">
                    {total} <span className="text-gray-600">{totalLabel}</span>
                </p>
                {accepted !== undefined && acceptedLabel && (
                    <p className="text-[10px] font-medium text-gray-900 sm:text-xs">
                        {accepted} <span className="text-gray-600">{acceptedLabel}</span>
                    </p>
                )}
            </div>
            <div className="relative mx-auto h-16 w-16 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                <svg className="h-16 w-16 -rotate-90 transform sm:h-24 sm:w-24 lg:h-28 lg:w-28" viewBox="0 0 64 64">
                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#E5E7EB"
                        strokeWidth="5"
                        fill="none"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke={percentage > 0 ? 'var(--admin-dark-primary)' : '#E5E7EB'}
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 - (percentage / 100) * (2 * Math.PI * 26)}
                        className="transition-all duration-500"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900 sm:text-lg lg:text-xl">{percentage}%</span>
                </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:mt-3 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="h-2 w-2 rounded bg-[var(--admin-dark-primary)] sm:h-2.5 sm:w-2.5"></div>
                    <span className="text-[9px] text-gray-600 sm:text-[10px]">{label}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="h-2 w-2 rounded bg-gray-300 sm:h-2.5 sm:w-2.5"></div>
                    <span className="text-[9px] text-gray-600 sm:text-[10px]">{totalLabel}</span>
                </div>
                {accepted !== undefined && acceptedLabel && (
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <div className="h-2 w-2 rounded bg-[var(--admin-accent)] sm:h-2.5 sm:w-2.5"></div>
                        <span className="text-[9px] text-gray-600 sm:text-[10px]">{acceptedLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

interface TableCardProps {
    title: string;
    viewAllLink: string;
    headers: string[];
    data: string[][];
}

function TableCard({ title, viewAllLink, headers, data }: TableCardProps) {
    return (
        <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm sm:rounded-xl">
            <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 lg:p-6">
                <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">{title}</h2>
                    <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">Recent activity and updates</p>
                </div>
                <a
                    href={viewAllLink}
                    className="w-full shrink-0 whitespace-nowrap rounded-md bg-[var(--admin-dark-primary)] px-3 py-1.5 text-center text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[var(--admin-dark-primary-hover)] sm:w-auto sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm"
                >
                    View All
                </a>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[320px]">
                    <thead>
                        <tr className="border-y border-gray-200 bg-gray-50/50">
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="whitespace-nowrap px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-600 first:pl-3 last:pr-3 sm:px-3 sm:py-2 sm:text-xs sm:first:pl-4 sm:last:pr-4 lg:first:pl-6 lg:last:pr-6"
                                >
                                    {header}
                                </th>
                            ))}
                            <th className="whitespace-nowrap px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-600 sm:px-3 sm:py-2 sm:text-xs">
                                View
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="transition-colors hover:bg-gray-50/50">
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="whitespace-nowrap px-2 py-1.5 text-[10px] text-gray-900 first:pl-3 last:pr-3 sm:px-3 sm:py-2 sm:text-xs sm:first:pl-4 sm:last:pr-4 lg:first:pl-6 lg:last:pr-6">
                                        {cell}
                                    </td>
                                ))}
                                <td className="px-2 py-1.5 sm:px-3 sm:py-2">
                                    <ArrowRight className="h-3 w-3 text-gray-400 transition-colors hover:text-gray-600 sm:h-4 sm:w-4" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface NavigationCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}

function NavigationCard({ icon: Icon, label }: NavigationCardProps) {
    return (
        <div className="group min-w-0 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md sm:rounded-xl sm:p-3 lg:p-4">
            <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between sm:gap-2 lg:gap-3">
                <div className="flex min-w-0 flex-col items-center gap-1.5 sm:flex-row sm:gap-2 lg:gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-dark-primary)]/10 text-[var(--admin-dark-primary)] transition-colors group-hover:bg-[var(--admin-dark-primary)]/15 sm:h-9 sm:w-9 lg:h-10 lg:w-10 lg:rounded-xl">
                        <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                    </div>
                    <span className="line-clamp-2 text-center text-[10px] font-semibold leading-tight text-gray-900 sm:text-left sm:text-xs lg:text-sm">{label}</span>
                </div>
                <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-gray-600 sm:block sm:h-4 sm:w-4" />
            </div>
        </div>
    );
}

interface RiderCardProps {
    rider: {
        code: string;
        phone: string;
        status: 'online' | 'offline';
        morning: { completed: number; total: number };
        evening: { completed: number; total: number };
        location: string;
        hub: string;
    };
}

function RiderCard({ rider }: RiderCardProps) {
    return (
        <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-all duration-200 hover:shadow-md sm:rounded-xl sm:p-3 lg:p-4">
            <div className="mb-2 flex items-center justify-center sm:mb-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                    <Truck className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
            </div>
            <div className="mb-1.5 flex items-center justify-center sm:mb-2">
                <span
                    className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-medium sm:px-2 sm:py-1 sm:text-[10px] ${
                        rider.status === 'online'
                            ? 'bg-[var(--admin-dark-primary)]/10 text-[var(--admin-dark-primary)]'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {rider.status === 'online' ? 'Online' : 'Offline'}
                </span>
            </div>
            <div className="mb-1.5 text-center sm:mb-2">
                <p className="truncate text-xs font-bold text-gray-900 sm:text-sm lg:text-base">{rider.code}</p>
                <p className="truncate text-[10px] text-gray-600 sm:text-xs">{rider.phone}</p>
            </div>
            <div className="mb-1.5 space-y-0.5 sm:mb-2 sm:space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-600 sm:text-[10px]">Morning</span>
                    <span className="text-[9px] font-medium text-gray-900 sm:text-[10px]">
                        {rider.morning.completed}/{rider.morning.total}
                    </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 sm:h-2">
                    <div
                        className="h-full bg-[var(--admin-dark-primary)] transition-all"
                        style={{
                            width: `${calculatePercentage(rider.morning.completed, rider.morning.total)}%`,
                        }}
                    ></div>
                </div>
            </div>
            <div className="mb-1.5 space-y-0.5 sm:mb-2 sm:space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-600 sm:text-[10px]">Evening</span>
                    <span className="text-[9px] font-medium text-gray-900 sm:text-[10px]">
                        {rider.evening.completed}/{rider.evening.total}
                    </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 sm:h-2">
                    <div
                        className="h-full bg-[var(--admin-dark-primary)] transition-all"
                        style={{
                            width: `${calculatePercentage(rider.evening.completed, rider.evening.total)}%`,
                        }}
                    ></div>
                </div>
            </div>
            <div className="text-center">
                <p className="truncate text-[9px] text-gray-600 sm:text-[10px]">{rider.location}</p>
                <p className="truncate text-[9px] text-gray-600 sm:text-[10px]">{rider.hub}</p>
            </div>
        </div>
    );
}

