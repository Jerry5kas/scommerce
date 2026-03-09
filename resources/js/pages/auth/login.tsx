import { Head, useForm, usePage } from '@inertiajs/react';
import { Chrome, Smartphone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { SharedData } from '@/types';

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'hi', label: 'Hindi' },
] as const;

type Language = (typeof LANGUAGES)[number]['value'];

type AuthStep = 'language' | 'method' | 'phone' | 'otp';

interface LoginPageProps {
    otp_sent?: boolean;
    phone?: string;
    message?: string;
    debug_otp?: string;
    resend_available_in?: number;
    otp_expires_in?: number;
    errors?: Record<string, string | string[]>;
}

export default function Login({
    otp_sent,
    phone: initialPhone,
    message,
    debug_otp,
    resend_available_in,
    otp_expires_in,
    errors: serverErrors,
}: LoginPageProps) {
    const { theme } = (usePage().props as unknown as SharedData) ?? {};

    const [showSplash, setShowSplash] = useState(true);
    const [step, setStep] = useState<AuthStep>(otp_sent && initialPhone ? 'otp' : 'language');
    const [phoneValue, setPhoneValue] = useState(initialPhone ?? '');
    const [resendInSeconds, setResendInSeconds] = useState<number>(resend_available_in ?? 0);

    const sendOtpForm = useForm({
        phone: initialPhone ?? '',
        language: 'en' as Language,
        consent: false,
    });

    const verifyOtpForm = useForm({
        phone: initialPhone ?? '',
        otp: '',
        language: 'en' as Language,
        consent: false,
    });

    useEffect(() => {
        if (theme) {
            document.documentElement.style.setProperty('--theme-primary-1', theme.primary_1);
            document.documentElement.style.setProperty('--theme-primary-2', theme.primary_2);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
            document.documentElement.style.setProperty('--theme-tertiary', theme.tertiary);
        }
    }, [theme]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setShowSplash(false);
        }, 1200);

        return () => {
            window.clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        setResendInSeconds(resend_available_in ?? 0);
    }, [resend_available_in]);

    useEffect(() => {
        if (step !== 'otp' || resendInSeconds <= 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setResendInSeconds((previous) => (previous > 0 ? previous - 1 : 0));
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [step, resendInSeconds]);

    useEffect(() => {
        if (!initialPhone) {
            return;
        }

        setPhoneValue(initialPhone);
        setStep('otp');
        verifyOtpForm.setData((prev) => ({
            ...prev,
            phone: initialPhone,
            language: sendOtpForm.data.language,
            consent: sendOtpForm.data.consent,
        }));
    }, [initialPhone]); // eslint-disable-line react-hooks/exhaustive-deps

    const activeError = useMemo(() => {
        if (step === 'phone') {
            return sendOtpForm.errors.phone || (Array.isArray(serverErrors?.phone) ? serverErrors.phone[0] : serverErrors?.phone);
        }

        if (step === 'otp') {
            return verifyOtpForm.errors.otp || (Array.isArray(serverErrors?.otp) ? serverErrors.otp[0] : serverErrors?.otp);
        }

        if (step === 'method') {
            return Array.isArray(serverErrors?.google) ? serverErrors.google[0] : serverErrors?.google;
        }

        return null;
    }, [step, sendOtpForm.errors.phone, verifyOtpForm.errors.otp, serverErrors]);

    const consentError = sendOtpForm.errors.consent || (Array.isArray(serverErrors?.consent) ? serverErrors.consent[0] : serverErrors?.consent);

    const handleLanguageNext = (): void => {
        setStep('method');
    };

    const selectLanguage = (language: Language): void => {
        sendOtpForm.setData('language', language);
        verifyOtpForm.setData('language', language);
    };

    const selectConsent = (checked: boolean): void => {
        sendOtpForm.setData('consent', checked);
        verifyOtpForm.setData('consent', checked);
    };

    const handleSendOtp = (event: React.FormEvent): void => {
        event.preventDefault();
        sendOtpForm.post('/auth/send-otp', {
            preserveScroll: true,
            onSuccess: () => {
                setPhoneValue(sendOtpForm.data.phone);
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

    const handleVerifyOtp = (event: React.FormEvent): void => {
        event.preventDefault();
        verifyOtpForm.post('/auth/verify-otp', {
            preserveScroll: true,
        });
    };

    const handleResendOtp = (): void => {
        if (resendInSeconds > 0 || verifyOtpForm.processing) {
            return;
        }

        verifyOtpForm
            .transform((data) => ({
                phone: data.phone,
                language: data.language,
                consent: data.consent ? '1' : '0',
            }))
            .post('/auth/resend-otp', {
                preserveScroll: true,
                onSuccess: () => {
                    verifyOtpForm.setData('otp', '');
                },
                onFinish: () => {
                    verifyOtpForm.transform((data) => data);
                },
            });
    };

    const handleGoogleContinue = (): void => {
        const params = new URLSearchParams({
            language: sendOtpForm.data.language,
            consent: sendOtpForm.data.consent ? '1' : '0',
        });

        window.location.assign(`/auth/google/redirect?${params.toString()}`);
    };

    if (showSplash) {
        return (
            <>
                <Head title="Welcome - Freshtick" />
                <div className="flex min-h-screen flex-col items-center justify-center bg-white">
                    <div className="animate-pulse rounded-2xl bg-white p-4 shadow-sm">
                        <img src="/logo_new.png" alt="Freshtick" className="h-14 w-auto" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-500">Loading…</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Login - Freshtick" />
            <div className="min-h-screen bg-gray-100 lg:flex lg:items-center lg:justify-center lg:p-6">
                <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden bg-white shadow-sm lg:min-h-170 lg:flex-row lg:rounded-3xl lg:shadow-xl">
                    <div className="relative hidden bg-(--theme-primary-1) p-10 text-white lg:flex lg:w-[42%] lg:flex-col lg:justify-between">
                        <div>
                            <img src="/logo_new.png" alt="Freshtick" className="h-10 w-auto rounded-lg bg-white p-1.5" />
                            <h1 className="mt-8 text-3xl leading-tight font-bold">Fresh dairy, app-like shopping, and fast checkout.</h1>
                            <p className="mt-4 text-sm text-white/90">
                                Mobile-first experience with a clean desktop layout, just like modern e-commerce apps.
                            </p>
                        </div>
                        <p className="text-xs text-white/80">By continuing, you agree to Terms & Privacy Policy and communication updates.</p>
                    </div>

                    <div className="relative flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:flex lg:items-center lg:px-12">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-4 rounded-2xl bg-linear-to-r from-(--theme-primary-1) to-(--theme-primary-1-dark) px-4 py-3 text-white shadow-sm lg:hidden">
                                <p className="text-xs font-medium tracking-wide text-white/90 uppercase">FreshTick</p>
                                <p className="mt-0.5 text-sm font-semibold">Quick onboarding, app-like login</p>
                            </div>

                            <div className="mb-4 flex items-center gap-2">
                                <span className={`h-1.5 flex-1 rounded-full ${step === 'language' ? 'bg-(--theme-primary-1)' : 'bg-gray-200'}`} />
                                <span className={`h-1.5 flex-1 rounded-full ${step === 'method' ? 'bg-(--theme-primary-1)' : 'bg-gray-200'}`} />
                                <span className={`h-1.5 flex-1 rounded-full ${step === 'phone' ? 'bg-(--theme-primary-1)' : 'bg-gray-200'}`} />
                                <span className={`h-1.5 flex-1 rounded-full ${step === 'otp' ? 'bg-(--theme-primary-1)' : 'bg-gray-200'}`} />
                            </div>

                            <div className="mb-6 lg:mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    {step === 'language' && 'Choose communication language'}
                                    {step === 'method' && 'Continue with'}
                                    {step === 'phone' && 'Login with mobile number'}
                                    {step === 'otp' && 'Enter OTP'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    {step === 'language' && 'This is for messages and updates (not full translation).'}
                                    {step === 'method' && 'Use mobile OTP or Google sign-in to continue.'}
                                    {step === 'phone' && 'We will send a one-time password to your mobile.'}
                                    {step === 'otp' && `OTP sent to +91 ${phoneValue.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3')}.`}
                                </p>
                                {step === 'otp' && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Code expires in about {Math.max(1, Math.floor((otp_expires_in ?? 300) / 60))} minutes.
                                    </p>
                                )}
                            </div>

                            {message && (
                                <div className="mb-4 rounded-lg bg-(--theme-primary-1)/10 px-4 py-3 text-sm text-(--theme-primary-1-dark)">
                                    {message}
                                </div>
                            )}

                            {step === 'otp' && debug_otp && (
                                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    Test mode OTP: <span className="font-semibold tracking-wider">{debug_otp}</span>
                                </div>
                            )}

                            {activeError && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{activeError}</p>}

                            {step === 'language' && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                        {LANGUAGES.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => selectLanguage(option.value as Language)}
                                                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                                                    sendOtpForm.data.language === option.value
                                                        ? 'border-(--theme-primary-1) bg-(--theme-primary-1)/12 text-(--theme-primary-1) shadow-sm'
                                                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLanguageNext}
                                        className="w-full rounded-xl bg-(--theme-primary-1) px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--theme-primary-1-dark)"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {step === 'method' && (
                                <div className="space-y-3.5">
                                    <button
                                        type="button"
                                        onClick={() => setStep('phone')}
                                        className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 text-left transition-colors hover:border-(--theme-primary-1) hover:bg-(--theme-primary-1)/5"
                                    >
                                        <span>
                                            <span className="block text-sm font-semibold text-gray-900">Mobile Number + OTP</span>
                                            <span className="mt-0.5 block text-xs text-gray-600">Fast sign-in like shopping apps</span>
                                        </span>
                                        <Smartphone className="h-5 w-5 text-(--theme-primary-1)" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleGoogleContinue}
                                        className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 text-left transition-colors hover:border-(--theme-primary-1) hover:bg-(--theme-primary-1)/5"
                                    >
                                        <span>
                                            <span className="block text-sm font-semibold text-gray-900">Continue with Google</span>
                                            <span className="mt-0.5 block text-xs text-gray-600">Sign in using your Gmail account</span>
                                        </span>
                                        <Chrome className="h-5 w-5 text-(--theme-primary-1)" />
                                    </button>

                                    <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                                        <input
                                            type="checkbox"
                                            checked={sendOtpForm.data.consent}
                                            onChange={(event) => selectConsent(event.target.checked)}
                                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-(--theme-primary-1) focus:ring-(--theme-primary-1)"
                                        />
                                        <span className="text-xs leading-relaxed text-gray-600">
                                            By continuing, you agree to our Terms and Privacy Policy and allow marketing communication via SMS, email,
                                            WhatsApp, push notifications, and DM.
                                        </span>
                                    </label>
                                    {consentError && <p className="text-sm text-red-600">{consentError}</p>}

                                    <button
                                        type="button"
                                        onClick={() => setStep('language')}
                                        className="w-full pt-1 text-sm font-medium text-gray-600 hover:text-(--theme-primary-1)"
                                    >
                                        Change language
                                    </button>
                                </div>
                            )}

                            {step === 'phone' && (
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Mobile number
                                        </label>
                                        <div className="mt-1 flex rounded-2xl border border-gray-300 bg-white focus-within:border-(--theme-primary-1) focus-within:ring-1 focus-within:ring-(--theme-primary-1)">
                                            <span className="inline-flex items-center rounded-l-xl border-r border-gray-200 px-3 text-sm text-gray-600">
                                                +91
                                            </span>
                                            <input
                                                id="phone"
                                                type="tel"
                                                inputMode="numeric"
                                                maxLength={10}
                                                placeholder="10-digit mobile number"
                                                className="block w-full rounded-r-xl border-0 py-3 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                                                value={sendOtpForm.data.phone}
                                                onChange={(event) => sendOtpForm.setData('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
                                            />
                                        </div>
                                    </div>

                                    <label className="flex cursor-pointer items-start gap-2.5">
                                        <input
                                            type="checkbox"
                                            checked={sendOtpForm.data.consent}
                                            onChange={(event) => selectConsent(event.target.checked)}
                                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-(--theme-primary-1) focus:ring-(--theme-primary-1)"
                                        />
                                        <span className="text-xs leading-relaxed text-gray-600">
                                            By clicking continue, you agree to our Terms and Privacy Policy and allow marketing communication via SMS,
                                            email, WhatsApp, push notifications, and DM.
                                        </span>
                                    </label>
                                    {consentError && <p className="text-sm text-red-600">{consentError}</p>}

                                    <button
                                        type="submit"
                                        disabled={sendOtpForm.processing}
                                        className="w-full rounded-2xl bg-(--theme-primary-1) px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--theme-primary-1-dark) disabled:opacity-70"
                                    >
                                        {sendOtpForm.processing ? 'Sending OTP…' : 'Continue'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStep('method')}
                                        className="w-full text-sm font-medium text-gray-600 hover:text-(--theme-primary-1)"
                                    >
                                        Back
                                    </button>
                                </form>
                            )}

                            {step === 'otp' && (
                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <input type="hidden" name="phone" value={verifyOtpForm.data.phone} />
                                    <input type="hidden" name="language" value={verifyOtpForm.data.language} />
                                    <input type="hidden" name="consent" value={verifyOtpForm.data.consent ? '1' : '0'} />

                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                            6-digit OTP
                                        </label>
                                        <input
                                            id="otp"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="000000"
                                            value={verifyOtpForm.data.otp}
                                            onChange={(event) => verifyOtpForm.setData('otp', event.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="mt-1 block w-full rounded-2xl border border-gray-300 py-3 text-center text-lg tracking-[0.35em] text-gray-900 placeholder:tracking-[0.35em] placeholder:text-gray-400 focus:border-(--theme-primary-1) focus:ring-1 focus:ring-(--theme-primary-1)"
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={verifyOtpForm.processing || verifyOtpForm.data.otp.length !== 6}
                                        className="w-full rounded-2xl bg-(--theme-primary-1) px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--theme-primary-1-dark) disabled:opacity-70"
                                    >
                                        {verifyOtpForm.processing ? 'Verifying…' : 'Verify & Continue'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            verifyOtpForm.setData('otp', '');
                                            setStep('phone');
                                        }}
                                        className="w-full text-sm font-medium text-gray-600 hover:text-(--theme-primary-1)"
                                    >
                                        Change mobile number
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendInSeconds > 0 || verifyOtpForm.processing}
                                        className="w-full text-sm font-medium text-(--theme-primary-1) disabled:cursor-not-allowed disabled:text-gray-400"
                                    >
                                        {resendInSeconds > 0 ? `Resend OTP in ${resendInSeconds}s` : 'Resend OTP'}
                                    </button>
                                </form>
                            )}

                            <p className="mt-6 text-center text-xs text-gray-500">
                                Communication language selected: {LANGUAGES.find((item) => item.value === sendOtpForm.data.language)?.label}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
