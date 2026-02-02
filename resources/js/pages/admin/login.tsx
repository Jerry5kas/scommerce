import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useId, useState } from 'react';

interface AdminLoginPageProps {
    errors?: Record<string, string>;
    message?: string;
}

export default function AdminLogin({ errors: serverErrors = {}, message }: AdminLoginPageProps) {
    const emailId = useId();
    const passwordId = useId();
    const rememberId = useId();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        login: '', // email or phone
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/login', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Admin Sign In" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                        <div className="mb-6 flex flex-col items-center">
                            <img
                                src="/logo_new.png"
                                alt="Freshtick"
                                className="h-10 w-auto"
                            />
                            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
                                Sign In
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Welcome back! Please sign in to your account.
                            </p>
                        </div>

                        {message && (
                            <div className="mb-4 rounded-lg bg-[var(--admin-dark-primary)]/10 px-4 py-3 text-sm text-[var(--admin-dark-primary)]">
                                {message}
                            </div>
                        )}

                        {Object.keys(serverErrors).length > 0 && (
                            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                {Object.values(serverErrors)[0]}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor={emailId}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    id={emailId}
                                    type="email"
                                    autoComplete="username"
                                    placeholder="your@email.com"
                                    value={form.data.login}
                                    onChange={(e) =>
                                        form.setData('login', e.target.value.trim())
                                    }
                                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-[var(--admin-dark-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-dark-primary)]"
                                />
                                {(form.errors.login || serverErrors?.login) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.login || serverErrors.login}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor={passwordId}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id={passwordId}
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        value={form.data.password}
                                        onChange={(e) =>
                                            form.setData('password', e.target.value)
                                        }
                                        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-11 text-gray-900 shadow-sm focus:border-[var(--admin-dark-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-dark-primary)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--admin-dark-primary)] focus:ring-offset-1"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" aria-hidden />
                                        ) : (
                                            <Eye className="h-5 w-5" aria-hidden />
                                        )}
                                    </button>
                                </div>
                                {(form.errors.password || serverErrors?.password) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.password || serverErrors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor={rememberId}
                                    className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                                >
                                    <input
                                        id={rememberId}
                                        type="checkbox"
                                        checked={form.data.remember}
                                        onChange={(e) =>
                                            form.setData('remember', e.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                                    />
                                    Remember me
                                </label>
                                <Link
                                    href="/admin/forgot-password"
                                    className="text-sm font-medium text-[var(--admin-dark-primary)] hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="w-full rounded-lg bg-[var(--admin-dark-primary)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--admin-dark-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-dark-primary)] focus:ring-offset-2 disabled:opacity-70"
                            >
                                {form.processing ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/admin/register"
                                className="font-medium text-[var(--admin-dark-primary)] hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
