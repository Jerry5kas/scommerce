import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { MapPin, User } from 'lucide-react';
import { useEffect } from 'react';
import UserLayout from '@/layouts/UserLayout';
import type { SharedData } from '@/types';

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'hi', label: 'Hindi' },
] as const;

type UserProfile = {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
    preferred_language: string;
    communication_consent: boolean;
};

interface ProfilePageProps {
    user: UserProfile;
}

export default function ProfileIndex({ user }: ProfilePageProps) {
    const { theme, flash } = (usePage().props as unknown as SharedData & { flash?: { message?: string } }) ?? {};
    const form = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        preferred_language: user.preferred_language || 'en',
        communication_consent: user.communication_consent ?? false,
    });

    useEffect(() => {
        if (theme) {
            document.documentElement.style.setProperty('--theme-primary-1', theme.primary_1);
            document.documentElement.style.setProperty('--theme-primary-2', theme.primary_2);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
            document.documentElement.style.setProperty('--theme-tertiary', theme.tertiary);
        }
    }, [theme]);

    return (
        <UserLayout>
            <Head title="Profile" />
            <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="mt-1 text-sm text-gray-600">Manage your account and preferences.</p>

                {flash?.message && (
                    <div className="mt-4 rounded-lg bg-[var(--theme-primary-1)]/10 px-4 py-3 text-sm text-[var(--theme-primary-1)]">
                        {flash.message}
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-6 sm:flex-row">
                    <nav className="flex shrink-0 gap-2 rounded-lg border border-gray-200 bg-gray-50/50 p-2 sm:flex-col sm:gap-0">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--theme-primary-1)] bg-white shadow-sm"
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </Link>
                        <Link
                            href="/profile/addresses"
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900"
                        >
                            <MapPin className="h-4 w-4" />
                            Addresses
                        </Link>
                    </nav>

                    <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.put('/profile', { preserveScroll: true });
                            }}
                            className="space-y-5"
                        >
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                />
                                {form.errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                />
                                {form.errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>
                                )}
                            </div>
                            <div>
                                <p className="block text-sm font-medium text-gray-700">Phone</p>
                                <p className="mt-1 text-sm text-gray-900">
                                    {user.phone ? `+91 ${user.phone}` : '—'}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-500">Phone cannot be changed here.</p>
                            </div>
                            <div>
                                <label htmlFor="preferred_language" className="block text-sm font-medium text-gray-700">
                                    Preferred language
                                </label>
                                <select
                                    id="preferred_language"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                                    value={form.data.preferred_language}
                                    onChange={(e) =>
                                        form.setData('preferred_language', e.target.value as (typeof LANGUAGES)[number]['value'])
                                    }
                                >
                                    {LANGUAGES.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id="communication_consent"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                    checked={form.data.communication_consent}
                                    onChange={(e) => form.setData('communication_consent', e.target.checked)}
                                />
                                <label htmlFor="communication_consent" className="text-sm text-gray-700">
                                    I agree to receive offers and updates via SMS/email
                                </label>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 disabled:opacity-70"
                                >
                                    {form.processing ? 'Saving…' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
