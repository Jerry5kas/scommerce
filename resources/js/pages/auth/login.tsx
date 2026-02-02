import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { SharedData } from '@/types';

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'hi', label: 'Hindi' },
] as const;

type Language = (typeof LANGUAGES)[number]['value'];

interface LoginPageProps {
    otp_sent?: boolean;
    phone?: string;
    message?: string;
    errors?: Record<string, string | string[]>;
}

export default function Login({ phone: initialPhone, message, errors: serverErrors }: LoginPageProps) {
    const { theme } = (usePage().props as unknown as SharedData) ?? {};
    const [step, setStep] = useState<'phone' | 'otp'>(initialPhone ? 'otp' : 'phone');
    const [phoneValue, setPhoneValue] = useState(initialPhone ?? '');

    useEffect(() => {
        if (theme) {
            document.documentElement.style.setProperty('--theme-primary-1', theme.primary_1);
            document.documentElement.style.setProperty('--theme-primary-2', theme.primary_2);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
            document.documentElement.style.setProperty('--theme-tertiary', theme.tertiary);
        }
    }, [theme]);

    const sendOtpForm = useForm({
        phone: initialPhone ?? '',
        language: 'en' as Language,
        consent: false,
    });

    const verifyOtpForm = useForm({
        phone: initialPhone ?? '',
        otp: '',
        language: sendOtpForm.data.language,
        consent: sendOtpForm.data.consent,
    });

    useEffect(() => {
        if (initialPhone) {
            setStep('otp');
            setPhoneValue(initialPhone);
            verifyOtpForm.setData((prev) => ({ ...prev, phone: initialPhone }));
        }
    }, [initialPhone]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        sendOtpForm.post('/auth/send-otp', {
            preserveScroll: true,
            onSuccess: () => {
                setStep('otp');
                verifyOtpForm.setData((prev) => ({
                    ...prev,
                    phone: sendOtpForm.data.phone,
                    language: sendOtpForm.data.language,
                    consent: sendOtpForm.data.consent,
                }));
            },
        });
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        verifyOtpForm.post('/auth/verify-otp', {
            preserveScroll: true,
        });
    };

    const handleBackToPhone = () => {
        setStep('phone');
        verifyOtpForm.reset();
    };

    return (
        <>
            <Head title="Login - Freshtick" />
            <div className="min-h-screen bg-white flex flex-col lg:flex-row lg:items-center lg:justify-center">
                <div className="flex w-full max-w-7xl flex-col lg:mx-auto lg:flex-row lg:overflow-hidden lg:rounded-2xl lg:shadow-xl">
                    {/* Left: Image - height matches form column */}
                    <div className="relative hidden shrink-0 lg:block lg:w-[45%] xl:w-[42%]">
                        <div className="h-full min-h-[280px] w-full lg:min-h-0 lg:overflow-hidden lg:rounded-l-2xl">
                            <img
                                src="/images/dairy-products.jpg"
                                alt="Fresh dairy from Freshtick"
                                className="h-full w-full object-cover object-center lg:rounded-l-2xl"
                                style={{
                                    maxWidth: 1024,
                                    maxHeight: 647,
                                    objectFit: 'cover',
                                }}
                                width={1024}
                                height={647}
                                fetchPriority="high"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:from-black/20" />
                            <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-md lg:bottom-8 lg:left-8 ">
                                <div className="max-w-max p-2 bg-white h-auto rounded-lg">
                                <img src="/logo_new.png" alt="Freshtick" className="mb-2 h-8 w-auto opacity-95" /></div>
                                <p className="text-sm font-medium text-white/95 sm:text-base pt-3">
                                    Fresh dairy delivered daily.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: small image strip */}
                    <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-t-xl lg:hidden">
                        <img
                            src="/images/dairy-products.jpg"
                            alt="Fresh dairy from Freshtick"
                            className="h-full w-full object-cover object-center rounded-t-xl"
                            width={1024}
                            height={647}
                            fetchPriority="high"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                            <img src="/logo_new.png" alt="Freshtick" className="h-6 w-auto opacity-95" />
                            <span className="text-xs font-medium text-white">Freshtick</span>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="flex flex-1 flex-col justify-center rounded-b-xl bg-white px-4 py-8 sm:px-6 sm:py-10 lg:rounded-b-none lg:rounded-r-2xl lg:px-12 lg:py-16">
                        <div className="mx-auto w-full max-w-[400px]">
                            <div className="mb-6 lg:mb-8">
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    {step === 'phone' ? 'Sign in or sign up' : 'Enter OTP'}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    {step === 'phone'
                                        ? 'We’ll send a one-time code to your phone.'
                                        : `Code sent to +91 ${phoneValue.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3')}.`}
                                </p>
                            </div>

                            {message && (
                                <div className="mb-4 rounded-lg bg-[var(--theme-primary-1)]/10 px-4 py-3 text-sm text-[var(--theme-primary-1-dark)]">
                                    {message}
                                </div>
                            )}

                            {step === 'phone' ? (
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone number
                                        </label>
                                        <div className="mt-1 flex rounded-lg border border-gray-300 shadow-sm focus-within:border-[var(--theme-primary-1)] focus-within:ring-1 focus-within:ring-[var(--theme-primary-1)]">
                                            <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-600">
                                                +91
                                            </span>
                                            <input
                                                id="phone"
                                                type="tel"
                                                inputMode="numeric"
                                                maxLength={10}
                                                placeholder="10-digit mobile number"
                                                className="block w-full rounded-r-lg border-0 bg-transparent py-3 pl-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                                                value={sendOtpForm.data.phone}
                                                onChange={(e) =>
                                                    sendOtpForm.setData(
                                                        'phone',
                                                        e.target.value.replace(/\D/g, '').slice(0, 10),
                                                    )
                                                }
                                                autoComplete="tel-national"
                                            />
                                        </div>
                                        {(sendOtpForm.errors.phone || (Array.isArray(serverErrors?.phone) ? serverErrors.phone[0] : serverErrors?.phone)) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {sendOtpForm.errors.phone || (Array.isArray(serverErrors?.phone) ? serverErrors.phone[0] : serverErrors?.phone)}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Preferred language for communication
                                        </label>
                                        <input
                                            type="hidden"
                                            name="language"
                                            value={sendOtpForm.data.language}
                                        />
                                        <div
                                            className="mt-1 flex rounded-lg border border-gray-300 bg-gray-100 p-1 shadow-sm"
                                            role="tablist"
                                            aria-label="Preferred language"
                                        >
                                            {LANGUAGES.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={sendOtpForm.data.language === opt.value}
                                                    className={`flex-1 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-1 ${
                                                        sendOtpForm.data.language === opt.value
                                                            ? 'bg-[var(--theme-primary-1)] text-white shadow-sm'
                                                            : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                                    }`}
                                                    onClick={() =>
                                                        sendOtpForm.setData('language', opt.value as Language)
                                                    }
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                        {(sendOtpForm.errors.language || (Array.isArray(serverErrors?.language) ? serverErrors.language[0] : serverErrors?.language)) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {sendOtpForm.errors.language || (Array.isArray(serverErrors?.language) ? serverErrors.language[0] : serverErrors?.language)}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex cursor-pointer items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={sendOtpForm.data.consent}
                                                onChange={(e) => sendOtpForm.setData('consent', e.target.checked)}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                            />
                                            <span className="text-sm text-gray-700">
                                                I agree to receive updates and offers from Freshtick via Email, SMS,
                                                WhatsApp & RCS.
                                            </span>
                                        </label>
                                        {(sendOtpForm.errors.consent || (Array.isArray(serverErrors?.consent) ? serverErrors.consent[0] : serverErrors?.consent)) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {sendOtpForm.errors.consent || (Array.isArray(serverErrors?.consent) ? serverErrors.consent[0] : serverErrors?.consent)}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={sendOtpForm.processing}
                                        className="w-full rounded-lg bg-[var(--theme-primary-1)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 disabled:opacity-70"
                                    >
                                        {sendOtpForm.processing ? 'Sending…' : 'Send OTP'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <input type="hidden" name="phone" value={verifyOtpForm.data.phone} />
                                    <input type="hidden" name="language" value={verifyOtpForm.data.language} />
                                    <input type="hidden" name="consent" value={verifyOtpForm.data.consent ? '1' : '0'} />
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                            Enter 6-digit OTP
                                        </label>
                                        <input
                                            id="otp"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="000000"
                                            className="mt-1 block w-full rounded-lg border border-gray-300 py-3 text-center text-lg tracking-[0.4em] text-gray-900 shadow-sm placeholder:tracking-[0.4em] placeholder:text-gray-400 focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] sm:text-sm"
                                            value={verifyOtpForm.data.otp}
                                            onChange={(e) =>
                                                verifyOtpForm.setData(
                                                    'otp',
                                                    e.target.value.replace(/\D/g, '').slice(0, 6),
                                                )
                                            }
                                            autoComplete="one-time-code"
                                            autoFocus
                                        />
                                        {(verifyOtpForm.errors.otp || (Array.isArray(serverErrors?.otp) ? serverErrors.otp[0] : serverErrors?.otp)) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {verifyOtpForm.errors.otp || (Array.isArray(serverErrors?.otp) ? serverErrors.otp[0] : serverErrors?.otp)}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={verifyOtpForm.processing || verifyOtpForm.data.otp.length !== 6}
                                        className="w-full rounded-lg bg-[var(--theme-primary-1)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 disabled:opacity-70"
                                    >
                                        {verifyOtpForm.processing ? 'Verifying…' : 'Verify & sign in'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleBackToPhone}
                                        className="w-full text-sm font-medium text-gray-600 hover:text-[var(--theme-primary-1)]"
                                    >
                                        Change phone number
                                    </button>
                                </form>
                            )}

                            <p className="mt-6 text-center text-xs text-gray-500">
                                By continuing, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
