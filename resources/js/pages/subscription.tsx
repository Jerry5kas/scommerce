import { Head, Link } from '@inertiajs/react';
import {
    ChevronLeft,
    MapPin,
    Calendar,
    Clock,
    Plus,
    Minus,
    Tag,
    Repeat,
    FileText,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import UserLayout from '@/layouts/UserLayout';

const DELIVERY_SLOTS = [
    { id: 'morning', label: 'Morning', time: '6 AM – 9 AM' },
    { id: 'evening', label: 'Evening', time: '4 PM – 7 PM' },
] as const;

const PATTERNS = [
    { id: 'daily', label: 'Daily', description: 'Every day' },
    { id: 'alternate', label: 'Alternate Day', description: 'Every 2 days' },
    { id: 'weekly', label: 'Weekly', description: 'Once a week' },
    { id: 'nth', label: 'Nth Day', description: 'Custom interval' },
] as const;

const DELIVERY_INSTRUCTIONS = [
    { id: 'no-bell', label: 'Do not ring the bell and leave at the door', emoji: '🥾' },
    { id: 'ring-bell', label: 'Ring the bell and leave at the door', emoji: '🔔' },
    { id: 'hand', label: 'Hand deliver', emoji: '👋' },
    { id: 'security', label: 'Give to the security', emoji: '👨‍✈️' },
    { id: 'other', label: 'Other', emoji: '' },
] as const;

interface SubscriptionPlan {
    id: string;
    name: string;
    image: string;
    perUnit: number;
    units: number;
    total: number;
    discount?: string;
}

interface SavedAddress {
    id: string;
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

const PLANS: SubscriptionPlan[] = [
    { id: 'plan-welcome', name: 'Welcome Offer Plan', image: '/images/dairy-products.png', perUnit: 39, units: 3, total: 117 },
    { id: 'plan-15', name: '15-Pack Plan', image: '/images/dairy-products.png', perUnit: 42, units: 15, total: 630 },
    { id: 'plan-30', name: '30-Packs Plan', image: '/images/dairy-products.png', perUnit: 41, units: 30, total: 1230, discount: '49% OFF' },
    { id: 'plan-90', name: '90-Packs Plan', image: '/images/dairy-products.png', perUnit: 40, units: 90, total: 3600, discount: '50% OFF' },
];

const MOCK_ADDRESSES: SavedAddress[] = [
    { id: 'addr-1', label: 'Home', line1: '12, Green Valley Road', line2: 'Near City Mall', city: 'Kozhikode', state: 'Kerala', pincode: '673001', isDefault: true },
    { id: 'addr-2', label: 'Office', line1: 'Tech Park, Building A', city: 'Kochi', state: 'Kerala', pincode: '682030' },
];

function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function formatEndDate(date: Date): string {
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface SubscriptionPageProps {
    planId?: string;
}

export default function Subscription({ planId }: SubscriptionPageProps) {
    const defaultPlanId = planId && PLANS.some((p) => p.id === planId) ? planId : PLANS[0].id;
    const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
    const [addresses, setAddresses] = useState<SavedAddress[]>(MOCK_ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(MOCK_ADDRESSES[0]?.id ?? null);
    const [deliverySlot, setDeliverySlot] = useState<string>(DELIVERY_SLOTS[0].id);
    const [pattern, setPattern] = useState<string>(PATTERNS[0].id);
    const [quantityPerDelivery, setQuantityPerDelivery] = useState(1);
    const [startDate, setStartDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().slice(0, 10);
    });
    const [instructionIds, setInstructionIds] = useState<Set<string>>(new Set());
    const [otherInstruction, setOtherInstruction] = useState('');
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [showAddInstruction, setShowAddInstruction] = useState(false);
    const [customInstruction, setCustomInstruction] = useState('');

    const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) ?? PLANS[0];
    const mrp = selectedPlan.total;
    const deliveryFee = 0;
    const discount = appliedCoupon?.discount ?? 0;
    const toPay = Math.max(0, mrp + deliveryFee - discount);

    const deliveriesCount = Math.ceil(selectedPlan.units / quantityPerDelivery);
    const endDate = useMemo(() => {
        const start = new Date(startDate);
        if (pattern === 'daily') return addDays(start, deliveriesCount - 1);
        if (pattern === 'alternate') return addDays(start, (deliveriesCount - 1) * 2);
        if (pattern === 'weekly') return addDays(start, (deliveriesCount - 1) * 7);
        return addDays(start, deliveriesCount - 1);
    }, [startDate, pattern, deliveriesCount]);

    const toggleInstruction = (id: string) => {
        setInstructionIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const applyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        if (!code) {
            setCouponError('Enter a coupon code');
            return;
        }
        if (code === 'SAVE20') {
            setAppliedCoupon({ code: 'SAVE20', discount: Math.min(50, Math.floor(mrp * 0.2)) });
            setCouponError(null);
            return;
        }
        setCouponError('Invalid or expired coupon');
        setAppliedCoupon(null);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponError(null);
    };

    return (
        <UserLayout>
            <Head title="Subscribe - Freshtick" />
            <div className="min-h-screen bg-gray-50/50 pt-20 pb-24 sm:pt-24 sm:pb-8">
                <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
                    <nav className="mb-6 flex items-center gap-3 sm:mb-8" aria-label="Breadcrumb">
                        <Link
                            href="/#subscriptions"
                            className="flex items-center gap-1.5 rounded-lg text-sm font-medium text-gray-600 transition-colors hover:text-[var(--theme-primary-1)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                        >
                            <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2} />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                        <span className="text-sm text-gray-400" aria-hidden>|</span>
                        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Subscribe</h1>
                    </nav>

                    <div className="grid gap-6 lg:grid-cols-10 lg:gap-8">
                        {/* Left: Plans, delivery, pattern, quantity, date, address, instructions */}
                        <div className="space-y-4 lg:col-span-6">
                            {/* Available plans */}
                            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="plans-heading">
                                <h2 id="plans-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                    <Repeat className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                    Available plans
                                </h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {PLANS.map((plan) => {
                                        const isSelected = selectedPlanId === plan.id;
                                        return (
                                            <button
                                                key={plan.id}
                                                type="button"
                                                onClick={() => setSelectedPlanId(plan.id)}
                                                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors sm:gap-4 sm:p-4 ${
                                                    isSelected
                                                        ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/5'
                                                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                                                }`}
                                            >
                                                <span className="flex h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--theme-secondary)]/20 sm:h-14 sm:w-14">
                                                    <img src={plan.image} alt="" className="h-full w-full object-contain p-1" />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-semibold text-gray-900 sm:text-base">{plan.name}</span>
                                                        {plan.discount && (
                                                            <span className="rounded bg-[var(--theme-tertiary)]/20 px-1.5 py-0.5 text-[10px] font-bold text-[var(--theme-tertiary)]">
                                                                {plan.discount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                                                        {plan.units} unit(s) · ₹{plan.total} total
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-[var(--theme-primary-1)]">₹{plan.perUnit}/unit</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Delivery time */}
                            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="delivery-heading">
                                <h2 id="delivery-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                    <Clock className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                    Delivery time
                                </h2>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {DELIVERY_SLOTS.map((slot) => {
                                        const isSelected = deliverySlot === slot.id;
                                        return (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => setDeliverySlot(slot.id)}
                                                className={`flex flex-1 min-w-[120px] items-center gap-2 rounded-xl border-2 px-4 py-3 text-left transition-colors sm:min-w-0 ${
                                                    isSelected
                                                        ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/10 text-[var(--theme-primary-1)]'
                                                        : 'border-gray-200 bg-gray-50/80 text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                <Clock className="h-4 w-4 shrink-0" strokeWidth={2} />
                                                <div>
                                                    <span className="block text-sm font-semibold">{slot.label}</span>
                                                    <span className="block text-[10px] text-gray-500 sm:text-xs">{slot.time}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Pattern */}
                            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="pattern-heading">
                                <h2 id="pattern-heading" className="mb-4 text-base font-bold text-gray-900 sm:text-lg">Pattern</h2>
                                <p className="mb-3 text-xs text-gray-600 sm:text-sm">How often should we deliver?</p>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {PATTERNS.map((p) => {
                                        const isSelected = pattern === p.id;
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setPattern(p.id)}
                                                className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors sm:px-5 ${
                                                    isSelected
                                                        ? 'border-[var(--theme-tertiary)] bg-[var(--theme-tertiary)] text-white'
                                                        : 'border-gray-200 bg-gray-50/80 text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {p.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Quantity per delivery */}
                            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="qty-heading">
                                <h2 id="qty-heading" className="mb-4 text-base font-bold text-gray-900 sm:text-lg">Quantity per delivery</h2>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center rounded-xl border-2 border-gray-200 bg-white">
                                        <button
                                            type="button"
                                            onClick={() => setQuantityPerDelivery((q) => Math.max(1, q - 1))}
                                            className="flex h-10 w-10 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--theme-primary-1)] rounded-l-lg"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" strokeWidth={2} />
                                        </button>
                                        <span className="flex h-10 min-w-[3rem] items-center justify-center text-base font-bold text-gray-900" aria-live="polite">
                                            {quantityPerDelivery}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantityPerDelivery((q) => Math.min(99, q + 1))}
                                            className="flex h-10 w-10 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--theme-primary-1)] rounded-r-lg"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" strokeWidth={2} />
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                                    Your subscription is expected to end on <strong>{formatEndDate(endDate)}</strong>.
                                </p>
                            </section>

                            {/* Start date */}
                            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="start-heading">
                                <h2 id="start-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                    <Calendar className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                    Select start date
                                </h2>
                                <input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().slice(0, 10)}
                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 transition-colors focus:border-[var(--theme-primary-1)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)]/20"
                                />
                            </section>

                            {/* Address */}
                            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="address-heading">
                                <h2 id="address-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                    <MapPin className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                    Select address
                                </h2>
                                {addresses.length > 0 ? (
                                    <div className="space-y-2">
                                        {addresses.map((addr) => {
                                            const isSelected = selectedAddressId === addr.id;
                                            return (
                                                <label
                                                    key={addr.id}
                                                    className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-colors ${
                                                        isSelected ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/5' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        value={addr.id}
                                                        checked={isSelected ?? false}
                                                        onChange={() => setSelectedAddressId(addr.id)}
                                                        className="mt-1 h-4 w-4 border-gray-300 text-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="font-semibold text-gray-900">{addr.label}</span>
                                                            {addr.isDefault && (
                                                                <span className="rounded bg-[var(--theme-primary-1)]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--theme-primary-1)]">Default</span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-600">
                                                            {addr.line1}
                                                            {addr.line2 && `, ${addr.line2}`}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {addr.city}, {addr.state} – {addr.pincode}
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : null}
                                {!showAddAddress ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowAddAddress(true)}
                                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--theme-primary-1)]/50 bg-[var(--theme-primary-1)]/5 py-3 text-sm font-semibold text-[var(--theme-primary-1)] transition-colors hover:bg-[var(--theme-primary-1)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                                    >
                                        <Plus className="h-4 w-4" strokeWidth={2} />
                                        Add new address
                                    </button>
                                ) : (
                                    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                                        <p className="mb-3 text-xs font-semibold text-gray-500">New address (connect to backend)</p>
                                        <button type="button" onClick={() => setShowAddAddress(false)} className="text-sm font-medium text-[var(--theme-primary-1)] hover:underline">
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Delivery instructions */}
                            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="instructions-heading">
                                <h2 id="instructions-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                    <FileText className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                    Delivery instructions
                                </h2>
                                <ul className="space-y-2">
                                    {DELIVERY_INSTRUCTIONS.map((opt) => (
                                        <li key={opt.id}>
                                            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50/50 has-[:checked]:border-[var(--theme-primary-1)] has-[:checked]:bg-[var(--theme-primary-1)]/5">
                                                <input
                                                    type="checkbox"
                                                    checked={instructionIds.has(opt.id)}
                                                    onChange={() => toggleInstruction(opt.id)}
                                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                                />
                                                <span className="text-sm font-medium text-gray-800">
                                                    {opt.emoji && <span className="mr-1.5" aria-hidden>{opt.emoji}</span>}
                                                    {opt.label}
                                                </span>
                                            </label>
                                            {opt.id === 'other' && instructionIds.has('other') && (
                                                <div className="ml-7 mt-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Describe your instruction"
                                                        value={otherInstruction}
                                                        onChange={(e) => setOtherInstruction(e.target.value)}
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                                    />
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        {/* Right: Summary, offers, bill */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-4">
                                {/* Subscription summary */}
                                <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="summary-heading">
                                    <h2 id="summary-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                        <Repeat className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                        Subscription
                                    </h2>
                                    <div className="flex gap-3 rounded-xl border border-gray-100 bg-[var(--theme-primary-1)]/5 p-4 sm:p-4">
                                        <span className="flex h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white sm:h-16 sm:w-16">
                                            <img src={selectedPlan.image} alt="" className="h-full w-full object-contain p-1" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-gray-900 sm:text-base">{selectedPlan.name}</p>
                                            <p className="mt-0.5 text-sm font-semibold text-[var(--theme-primary-1)]">₹{selectedPlan.perUnit}/unit</p>
                                            {!showAddInstruction ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddInstruction(true)}
                                                    className="mt-2 flex items-center gap-1 text-xs font-medium text-[var(--theme-primary-1)] hover:underline"
                                                >
                                                    <FileText className="h-3 w-3" strokeWidth={2} />
                                                    Add instruction
                                                </button>
                                            ) : (
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Delivery note (optional)"
                                                        value={customInstruction}
                                                        onChange={(e) => setCustomInstruction(e.target.value)}
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                                    />
                                                    <button type="button" onClick={() => setShowAddInstruction(false)} className="mt-1 text-[10px] text-gray-500 hover:underline">
                                                        Done
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Offers */}
                                <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="offers-heading">
                                    <h2 id="offers-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                        <Tag className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                        Offers & benefits
                                    </h2>
                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 text-green-800">
                                            <span className="flex items-center gap-2 text-sm font-semibold">
                                                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                                                {appliedCoupon.code} applied (–₹{appliedCoupon.discount})
                                            </span>
                                            <button type="button" onClick={removeCoupon} className="text-xs font-medium text-green-700 underline hover:no-underline">
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                                value={couponCode}
                                                onChange={(e) => {
                                                    setCouponCode(e.target.value);
                                                    setCouponError(null);
                                                }}
                                                onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                                                className="min-w-0 flex-1 rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium uppercase placeholder:normal-case placeholder:text-gray-400 focus:border-[var(--theme-primary-1)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)]/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={applyCoupon}
                                                className="shrink-0 rounded-xl bg-[var(--theme-primary-1)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                    {couponError && (
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600" role="alert">
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                                            {couponError}
                                        </p>
                                    )}
                                    <p className="mt-2 text-[10px] text-gray-500">Try SAVE20 for 20% off (max ₹50)</p>
                                </section>

                                {/* Bill details */}
                                <section className="rounded-2xl border border-gray-200/80 bg-[var(--theme-primary-1)]/5 p-4 shadow-sm sm:p-6" aria-labelledby="bill-heading">
                                    <h2 id="bill-heading" className="mb-4 text-base font-bold text-gray-900 sm:text-lg">
                                        Bill details (includes taxes)
                                    </h2>
                                    <dl className="space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-700">
                                            <dt>MRP</dt>
                                            <dd className="font-semibold">₹{mrp}</dd>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <dt>Delivery fee</dt>
                                            <dd className="font-semibold text-[var(--theme-primary-1)]">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</dd>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <dt>Discount</dt>
                                                <dd className="font-semibold">–₹{discount}</dd>
                                            </div>
                                        )}
                                        <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                                            <dt>To pay</dt>
                                            <dd>₹{toPay}</dd>
                                        </div>
                                    </dl>
                                    <Link
                                        href="#"
                                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-primary-1)] py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                                    >
                                        Proceed to pay ₹{toPay}
                                    </Link>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* Sticky CTA on mobile */}
                    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
                        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-gray-500">To pay</p>
                                <p className="text-xl font-bold text-gray-900">₹{toPay}</p>
                            </div>
                            <Link
                                href="#"
                                className="flex flex-1 max-w-[200px] items-center justify-center rounded-xl bg-[var(--theme-primary-1)] py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                            >
                                Pay ₹{toPay}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
