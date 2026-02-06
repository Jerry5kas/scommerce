import AdminLayout from '@/layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface TrackingEvent {
    id: number;
    event_name: string;
    event_category: string | null;
    event_action: string | null;
    event_value: number | null;
    page_url: string | null;
    device_type: string | null;
    browser: string | null;
    created_at: string;
    user: { id: number; name: string; email: string } | null;
}

interface PaginatedEvents {
    data: TrackingEvent[];
    current_page: number;
    last_page: number;
}

interface Props {
    events: PaginatedEvents;
    filters: { event_name?: string; event_category?: string; start_date?: string; end_date?: string };
    eventOptions: Record<string, string>;
    categoryOptions: Record<string, string>;
}

export default function EventsIndex({ events, filters, eventOptions, categoryOptions }: Props) {
    const [search, setSearch] = useState('');

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/analytics/events', { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Tracking Events" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Tracking Events</h1>

                {/* Filters */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={filters.event_name || ''}
                            onChange={(e) => handleFilter('event_name', e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">All Events</option>
                            {Object.entries(eventOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <select
                            value={filters.event_category || ''}
                            onChange={(e) => handleFilter('event_category', e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">All Categories</option>
                            {Object.entries(categoryOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={filters.start_date || ''}
                            onChange={(e) => handleFilter('start_date', e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        />
                        <input
                            type="date"
                            value={filters.end_date || ''}
                            onChange={(e) => handleFilter('end_date', e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        />
                    </div>
                </div>

                {/* Events Table */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Event</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Device</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Value</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {events.data.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                                {event.event_name.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm capitalize text-gray-600">
                                            {event.event_category || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {event.user ? (
                                                <div className="text-sm">
                                                    <p className="font-medium">{event.user.name}</p>
                                                    <p className="text-gray-500">{event.user.email}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Anonymous</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm capitalize text-gray-600">
                                            {event.device_type || '-'} / {event.browser || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium">
                                            {event.event_value ? `₹${event.event_value}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(event.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {events.data.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No events found</div>
                    )}
                </div>

                {/* Pagination */}
                {events.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: Math.min(5, events.last_page) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => router.get('/admin/analytics/events', { ...filters, page }, { preserveState: true })}
                                className={`rounded-lg px-3 py-1 ${events.current_page === page ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

