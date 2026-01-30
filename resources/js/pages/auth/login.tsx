import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const LANGUAGES = [
    { value: 'english', label: 'English' },
    { value: 'malayalam', label: 'Malayalam' },
    { value: 'hindi', label: 'Hindi' },
] as const;

type Language = (typeof LANGUAGES)[number]['value'];

interface LoginPageProps {
    otp_sent?: boolean;
    phone?: string;
    message?: string;
    errors?: Record<string, string[]>;
}

export default function Login({ phone: initialPhone, message, errors: serverErrors }: LoginPageProps) {
    const [step, setStep] = useState<'phone' | 'otp'>(initialPhone ? 'otp' : 'phone');
    const [phoneValue, setPhoneValue] = useState(initialPhone ?? '');

    const sendOtpForm = useForm({
        phone: initialPhone ?? '',
        language: 'english' as Language,
        consent: false,
    });

    const verifyOtpForm = useForm({
        phone: initialPhone ?? '',
        otp: '',
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
            onSuccess: () => setStep('otp'),
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
                                <div className="mb-4 rounded-lg bg-[#45AE96]/10 px-4 py-3 text-sm text-[#3a9a85]">
                                    {message}
                                </div>
                            )}

                            {step === 'phone' ? (
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone number
                                        </label>
                                        <div className="mt-1 flex rounded-lg border border-gray-300 shadow-sm focus-within:border-[#45AE96] focus-within:ring-1 focus-within:ring-[#45AE96]">
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
                                        {(sendOtpForm.errors.phone || serverErrors?.phone?.[0]) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {sendOtpForm.errors.phone || serverErrors?.phone?.[0]}
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
                                                    className={`flex-1 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#45AE96] focus:ring-offset-1 ${
                                                        sendOtpForm.data.language === opt.value
                                                            ? 'bg-[#45AE96] text-white shadow-sm'
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
                                        {(sendOtpForm.errors.language || serverErrors?.language?.[0]) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {sendOtpForm.errors.language || serverErrors?.language?.[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex cursor-pointer items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={sendOtpForm.data.consent}
                                                onChange={(e) => sendOtpForm.setData('consent', e.target.checked)}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#45AE96] focus:ring-[#45AE96]"
                                            />
                                            <span className="text-sm text-gray-700">
                                                I agree to receive updates and offers from Freshtick via Email, SMS,
                                                WhatsApp & RCS.
                                            </span>
                                        </label>
                                        {(sendOtpForm.errors.consent || serverErrors?.consent?.[0]) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {sendOtpForm.errors.consent || serverErrors?.consent?.[0]}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={sendOtpForm.processing}
                                        className="w-full rounded-lg bg-[#45AE96] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3a9a85] focus:outline-none focus:ring-2 focus:ring-[#45AE96] focus:ring-offset-2 disabled:opacity-70"
                                    >
                                        {sendOtpForm.processing ? 'Sending…' : 'Send OTP'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <input type="hidden" name="phone" value={verifyOtpForm.data.phone} />
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
                                            className="mt-1 block w-full rounded-lg border border-gray-300 py-3 text-center text-lg tracking-[0.4em] text-gray-900 shadow-sm placeholder:tracking-[0.4em] placeholder:text-gray-400 focus:border-[#45AE96] focus:ring-1 focus:ring-[#45AE96] sm:text-sm"
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
                                        {(verifyOtpForm.errors.otp || serverErrors?.otp?.[0]) && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {verifyOtpForm.errors.otp || serverErrors?.otp?.[0]}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={verifyOtpForm.processing || verifyOtpForm.data.otp.length !== 6}
                                        className="w-full rounded-lg bg-[#45AE96] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3a9a85] focus:outline-none focus:ring-2 focus:ring-[#45AE96] focus:ring-offset-2 disabled:opacity-70"
                                    >
                                        {verifyOtpForm.processing ? 'Verifying…' : 'Verify & sign in'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleBackToPhone}
                                        className="w-full text-sm font-medium text-gray-600 hover:text-[#45AE96]"
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
