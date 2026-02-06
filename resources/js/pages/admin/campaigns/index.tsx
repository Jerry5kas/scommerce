import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Megaphone, Plus, Search, Send, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface Campaign {
    id: number;
    name: string;
    type: string;
    channel: string;
    status: string;
    scheduled_at: string | null;
    sent_at: string | null;
    total_recipients: number;
    sent_count: number;
    failed_count: number;
}

interface PaginatedCampaigns {
    data: Campaign[];
    current_page: number;
    last_page: number;
}

interface Stats {
    total: number;
    draft: number;
    scheduled: number;
    completed: number;
}

interface Props {
    campaigns: PaginatedCampaigns;
    stats: Stats;
    filters: { search?: string; status?: string; type?: string };
    typeOptions: Record<string, string>;
    statusOptions: Record<string, string>;
}

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    scheduled: 'bg-blue-100 text-blue-700',
    sending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function CampaignsIndex({ campaigns, stats, filters, typeOptions, statusOptions }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/campaigns', { ...filters, search }, { preserveState: true });
    };

    const handleSend = (id: number) => {
        if (confirm('Are you sure you want to send this campaign?')) {
            router.post(`/admin/campaigns/${id}/send`);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this campaign?')) {
            router.delete(`/admin/campaigns/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Campaigns" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                    <Link
                        href="/admin/campaigns/create"
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4" />
                        Create Campaign
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-2">
                                <Megaphone className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Draft</p>
                        <p className="text-xl font-bold text-gray-600">{stats.draft}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Scheduled</p>
                        <p className="text-xl font-bold text-blue-600">{stats.scheduled}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="text-xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                </div>

                {/* Search */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search campaigns..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
                            />
                        </div>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => router.get('/admin/campaigns', { ...filters, status: e.target.value || undefined }, { preserveState: true })}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">All Status</option>
                            {Object.entries(statusOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
                            Search
                        </button>
                    </form>
                </div>

                {/* Campaigns List */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Type</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Channel</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Sent</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {campaigns.data.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{campaign.name}</td>
                                    <td className="px-4 py-3 text-center capitalize">{typeOptions[campaign.type] || campaign.type}</td>
                                    <td className="px-4 py-3 text-center capitalize">{campaign.channel}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[campaign.status]}`}>
                                            {statusOptions[campaign.status] || campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {campaign.sent_count}/{campaign.total_recipients}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/campaigns/${campaign.id}`} className="text-gray-600 hover:text-gray-900">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            {campaign.status === 'draft' && (
                                                <>
                                                    <Link href={`/admin/campaigns/${campaign.id}/edit`} className="text-indigo-600 hover:text-indigo-700">
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button onClick={() => handleSend(campaign.id)} className="text-green-600 hover:text-green-700">
                                                        <Send className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                            {campaign.status === 'scheduled' && (
                                                <button onClick={() => router.post(`/admin/campaigns/${campaign.id}/cancel`)} className="text-red-600">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                            {campaign.status === 'draft' && (
                                                <button onClick={() => handleDelete(campaign.id)} className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {campaigns.data.length === 0 && <div className="p-8 text-center text-gray-500">No campaigns found</div>}
                </div>
            </div>
        </AdminLayout>
    );
}

