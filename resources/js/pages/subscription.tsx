import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, MapPin, Calendar, Clock, Plus, Minus, Tag, Repeat, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
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

interface SubscriptionPlanItem {
    id: number;
    product_id: number;
    product_name: string;
    product_image: string | null;
    units: number;
    total_price: number;
    per_unit_price: number;
}

interface SubscriptionPlanFeature {
    id: number;
    title: string;
    highlight: boolean;
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

const MOCK_ADDRESSES: SavedAddress[] = [
    {
        id: 'addr-1',
        label: 'Home',
        line1: '12, Green Valley Road',
        line2: 'Near City Mall',
        city: 'Kozhikode',
        state: 'Kerala',
        pincode: '673001',
        isDefault: true,
    },
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

interface SubscriptionPlan {
    id: number;
    name: string;
    description: string;
    frequency_type: string;
    discount_type: string;
    discount_value: number;
    items: SubscriptionPlanItem[];
    features: SubscriptionPlanFeature[];
}

interface SubscriptionPageProps {
    subscriptionPlans: SubscriptionPlan[];
    selectedPlanId?: number;
    userAddresses?: SavedAddress[];
}

export default function Subscription({ subscriptionPlans = [], selectedPlanId, userAddresses = [] }: SubscriptionPageProps) {
    const fallbackImage = '/images/icons/milk-bottle.png';

    const getSafeImageUrl = (url: string | null | undefined): string => {
        if (!url) {
            return fallbackImage;
        }

        if (url.startsWith('http') || url.startsWith('/')) {
            return url;
        }

        return `/storage/${url}`;
    };

    // Determine default plan
    const defaultPlan = useMemo(() => {
        if (selectedPlanId) {
            const found = subscriptionPlans.find((p) => p.id === Number(selectedPlanId));
            if (found) return found;
        }
        return subscriptionPlans[0];
    }, [subscriptionPlans, selectedPlanId]);

    const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(defaultPlan);

    // Manage sub-variant selection (e.g., 480ml vs 1L)
    // We'll track selection by product name substring for now, or just index
    // Let's assume user picks a specific item from the plan items list
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    const [addresses] = useState<SavedAddress[]>(userAddresses.length > 0 ? userAddresses : MOCK_ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        userAddresses.length > 0 ? userAddresses.find((a) => a.isDefault)?.id || userAddresses[0].id : (MOCK_ADDRESSES[0]?.id ?? null),
    );
    const [deliverySlot, setDeliverySlot] = useState<string>(DELIVERY_SLOTS[0].id);
    // Pattern is now determined by the plan's frequency_type, but let's keep it flexible if plan allows custom
    const [pattern, setPattern] = useState<string>(currentPlan?.frequency_type || 'daily');

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

    // Derived values
    const selectedItem = currentPlan?.items[selectedItemIndex] || currentPlan?.items[0];
    const mrp = selectedItem ? selectedItem.total_price : 0;
    const deliveryFee = 0;
    const discount = appliedCoupon?.discount ?? 0;
    const toPay = Math.max(0, mrp + deliveryFee - discount);

    const deliveriesCount = selectedItem ? Math.ceil(selectedItem.units / quantityPerDelivery) : 0;
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
                            className="flex items-center gap-1.5 rounded-lg text-sm font-medium text-gray-600 transition-colors hover:text-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none"
                        >
                            <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2} />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                        <span className="text-sm text-gray-400" aria-hidden>
                            |
                        </span>
                        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Subscribe</h1>
                    </nav>

                    <div className="grid gap-6 lg:grid-cols-10 lg:gap-8">
                        {/* Left: Plans, delivery, pattern, quantity, date, address, instructions */}
                        <div className="space-y-4 lg:col-span-6">
                            {/* Available plans */}
                            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="plans-heading">
                                <h2 id="plans-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                    <Repeat className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                    1. Choose Plan & Product
                                </h2>

                                {/* Plan Selection Tabs */}
                                <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto pb-2">
                                    {subscriptionPlans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => {
                                                setCurrentPlan(plan);
                                                setSelectedItemIndex(0); // Reset item selection
                                                setPattern(plan.frequency_type);
                                            }}
                                            className={`relative flex-shrink-0 rounded-xl border-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                                                currentPlan.id === plan.id
                                                    ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)] text-white shadow-md'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {plan.name}
                                            {plan.discount_type !== 'none' && plan.discount_value > 0 && (
                                                <span
                                                    className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                                        currentPlan.id === plan.id
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-[var(--theme-primary-1)]/10 text-[var(--theme-primary-1)]'
                                                    }`}
                                                >
                                                    {plan.discount_type === 'percentage'
                                                        ? `${Math.round(plan.discount_value)}% OFF`
                                                        : `₹${Math.round(plan.discount_value)} OFF`}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Plan Features */}
                                <div className="mb-6 rounded-xl border border-[var(--theme-primary-1)]/10 bg-[var(--theme-primary-1)]/5 p-4">
                                    <h3 className="mb-3 text-sm font-bold tracking-wide text-[var(--theme-primary-1)] uppercase">Plan Benefits</h3>
                                    <ul className="grid gap-2 sm:grid-cols-2">
                                        {currentPlan.features.map((feature) => (
                                            <li key={feature.id} className="flex items-start gap-2 text-sm text-gray-700">
                                                <CheckCircle2
                                                    className={`mt-0.5 h-4 w-4 shrink-0 ${feature.highlight ? 'text-[var(--theme-primary-1)]' : 'text-gray-400'}`}
                                                />
                                                <span className={feature.highlight ? 'font-medium text-gray-900' : ''}>{feature.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Variant Selection */}
                                <h3 className="mb-3 text-sm font-bold text-gray-900">Select Product</h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {currentPlan.items.map((item, index) => {
                                        const isSelected = selectedItemIndex === index;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => setSelectedItemIndex(index)}
                                                className={`group relative flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all sm:gap-4 sm:p-4 ${
                                                    isSelected
                                                        ? 'border-[var(--theme-primary-1)] bg-white shadow-md ring-1 ring-[var(--theme-primary-1)]'
                                                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white'
                                                }`}
                                            >
                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white p-1">
                                                    <img
                                                        src={getSafeImageUrl(item.product_image)}
                                                        alt={item.product_name}
                                                        className="h-full w-full object-contain"
                                                        onError={(event) => {
                                                            event.currentTarget.onerror = null;
                                                            event.currentTarget.src = fallbackImage;
                                                        }}
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span
                                                            className={`font-bold transition-colors ${isSelected ? 'text-[var(--theme-primary-1)]' : 'text-gray-900'}`}
                                                        >
                                                            {item.product_name}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500">{item.units} unit(s) per delivery</p>
                                                    <div className="mt-2 flex items-baseline gap-2">
                                                        <span className="text-lg font-bold text-gray-900">₹{Math.round(item.total_price)}</span>
                                                        <span className="text-xs text-gray-500">(₹{Math.round(item.per_unit_price)}/unit)</span>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 text-[var(--theme-primary-1)]">
                                                        <CheckCircle2 className="h-5 w-5 fill-[var(--theme-primary-1)] text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Delivery Schedule (Grouped) */}
                            <section
                                className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6"
                                aria-labelledby="schedule-heading"
                            >
                                <h2 id="schedule-heading" className="mb-6 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                    <Clock className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                    2. Delivery Schedule
                                </h2>

                                <div className="space-y-6">
                                    {/* Start Date */}
                                    <div>
                                        <label htmlFor="start-date" className="mb-2 block text-sm font-semibold text-gray-900">
                                            Start Date
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="start-date"
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                min={new Date().toISOString().slice(0, 10)}
                                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 pl-11 text-sm font-medium text-gray-900 transition-colors focus:border-[var(--theme-primary-1)] focus:ring-2 focus:ring-[var(--theme-primary-1)]/20 focus:outline-none"
                                            />
                                            <Calendar className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Time Slot */}
                                    <div>
                                        <span className="mb-2 block text-sm font-semibold text-gray-900">Preferred Time Slot</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            {DELIVERY_SLOTS.map((slot) => {
                                                const isSelected = deliverySlot === slot.id;
                                                return (
                                                    <button
                                                        key={slot.id}
                                                        type="button"
                                                        onClick={() => setDeliverySlot(slot.id)}
                                                        className={`flex flex-col items-start gap-1 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                                                            isSelected
                                                                ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/5 ring-1 ring-[var(--theme-primary-1)]'
                                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <div className="flex w-full items-center justify-between">
                                                            <span
                                                                className={`text-sm font-bold ${isSelected ? 'text-[var(--theme-primary-1)]' : 'text-gray-900'}`}
                                                            >
                                                                {slot.label}
                                                            </span>
                                                            {isSelected && <CheckCircle2 className="h-4 w-4 text-[var(--theme-primary-1)]" />}
                                                        </div>
                                                        <span className="text-xs text-gray-500">{slot.time}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Frequency Pattern */}
                                    <div>
                                        <span className="mb-2 block text-sm font-semibold text-gray-900">Delivery Frequency</span>
                                        <div className="flex flex-wrap gap-2">
                                            {PATTERNS.map((p) => {
                                                const isSelected = pattern === p.id;
                                                // If plan is strict (e.g. daily), we might want to disable others, but for now keeping flexible
                                                return (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => setPattern(p.id)}
                                                        className={`rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                                                            isSelected
                                                                ? 'border-[var(--theme-tertiary)] bg-[var(--theme-tertiary)] text-white shadow-sm'
                                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {p.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <span className="mb-2 block text-sm font-semibold text-gray-900">Quantity per Delivery</span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center rounded-xl border-2 border-gray-200 bg-white">
                                                <button
                                                    type="button"
                                                    onClick={() => setQuantityPerDelivery((q) => Math.max(1, q - 1))}
                                                    className="flex h-11 w-11 items-center justify-center rounded-l-lg text-gray-600 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:outline-none focus:ring-inset"
                                                >
                                                    <Minus className="h-4 w-4" strokeWidth={2.5} />
                                                </button>
                                                <span className="flex h-11 min-w-[3.5rem] items-center justify-center border-x-2 border-gray-100 text-lg font-bold text-gray-900">
                                                    {quantityPerDelivery}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setQuantityPerDelivery((q) => Math.min(99, q + 1))}
                                                    className="flex h-11 w-11 items-center justify-center rounded-r-lg text-gray-600 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:outline-none focus:ring-inset"
                                                >
                                                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                                                </button>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <p>
                                                    Total units: <span className="font-semibold text-gray-900">{selectedItem?.units}</span>
                                                </p>
                                                <p>
                                                    Deliveries: <span className="font-semibold text-gray-900">{deliveriesCount}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-blue-800">
                                            <Calendar className="mt-0.5 h-5 w-5 shrink-0" />
                                            <div className="text-sm">
                                                <p className="font-semibold">Subscription Duration</p>
                                                <p className="mt-1 opacity-90">
                                                    Starts{' '}
                                                    <strong>
                                                        {new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    </strong>{' '}
                                                    • Ends <strong>{formatEndDate(endDate)}</strong>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Address */}
                            <section
                                className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6"
                                aria-labelledby="address-heading"
                            >
                                <h2 id="address-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                    <MapPin className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                    3. Delivery Address
                                </h2>
                                {addresses.length > 0 ? (
                                    <div className="space-y-2">
                                        {addresses.map((addr) => {
                                            const isSelected = selectedAddressId === addr.id;
                                            return (
                                                <label
                                                    key={addr.id}
                                                    className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-colors ${
                                                        isSelected
                                                            ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/5'
                                                            : 'border-gray-200 hover:border-gray-300'
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
                                                                <span className="rounded bg-[var(--theme-primary-1)]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--theme-primary-1)]">
                                                                    Default
                                                                </span>
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
                                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--theme-primary-1)]/50 bg-[var(--theme-primary-1)]/5 py-3 text-sm font-semibold text-[var(--theme-primary-1)] transition-colors hover:bg-[var(--theme-primary-1)]/10 focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none"
                                    >
                                        <Plus className="h-4 w-4" strokeWidth={2} />
                                        Add new address
                                    </button>
                                ) : (
                                    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                                        <p className="mb-3 text-xs font-semibold text-gray-500">New address (connect to backend)</p>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddAddress(false)}
                                            className="text-sm font-medium text-[var(--theme-primary-1)] hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Delivery instructions */}
                            <section
                                className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6"
                                aria-labelledby="instructions-heading"
                            >
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
                                                    {opt.emoji && (
                                                        <span className="mr-1.5" aria-hidden>
                                                            {opt.emoji}
                                                        </span>
                                                    )}
                                                    {opt.label}
                                                </span>
                                            </label>
                                            {opt.id === 'other' && instructionIds.has('other') && (
                                                <div className="mt-2 ml-7">
                                                    <input
                                                        type="text"
                                                        placeholder="Describe your instruction"
                                                        value={otherInstruction}
                                                        onChange={(e) => setOtherInstruction(e.target.value)}
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] focus:outline-none"
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
                                <section
                                    className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6"
                                    aria-labelledby="summary-heading"
                                >
                                    <h2 id="summary-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                        <Repeat className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                        Subscription
                                    </h2>
                                    <div className="flex gap-3 rounded-xl border border-gray-100 bg-[var(--theme-primary-1)]/5 p-4 sm:p-4">
                                        <span className="flex h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white sm:h-16 sm:w-16">
                                            <img
                                                src={getSafeImageUrl(selectedItem?.product_image)}
                                                alt={selectedItem?.product_name}
                                                className="h-full w-full object-contain p-1"
                                                onError={(event) => {
                                                    event.currentTarget.onerror = null;
                                                    event.currentTarget.src = fallbackImage;
                                                }}
                                            />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-gray-900 sm:text-base">{currentPlan.name}</p>
                                            <p className="text-xs text-gray-600">{selectedItem?.product_name}</p>
                                            <p className="mt-0.5 text-sm font-semibold text-[var(--theme-primary-1)]">
                                                ₹{Math.round(selectedItem?.per_unit_price || 0)}/unit
                                            </p>
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
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[var(--theme-primary-1)] focus:ring-1 focus:ring-[var(--theme-primary-1)] focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAddInstruction(false)}
                                                        className="mt-1 text-[10px] text-gray-500 hover:underline"
                                                    >
                                                        Done
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Offers */}
                                <section
                                    className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6"
                                    aria-labelledby="offers-heading"
                                >
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
                                            <button
                                                type="button"
                                                onClick={removeCoupon}
                                                className="text-xs font-medium text-green-700 underline hover:no-underline"
                                            >
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
                                                className="min-w-0 flex-1 rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium uppercase placeholder:text-gray-400 placeholder:normal-case focus:border-[var(--theme-primary-1)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-primary-1)]/20 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={applyCoupon}
                                                className="shrink-0 rounded-xl bg-[var(--theme-primary-1)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none"
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
                                <section
                                    className="rounded-2xl border border-gray-200/80 bg-[var(--theme-primary-1)]/5 p-4 shadow-sm sm:p-6"
                                    aria-labelledby="bill-heading"
                                >
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
                                            <dd className="font-semibold text-[var(--theme-primary-1)]">
                                                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                            </dd>
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
                                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-primary-1)] py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none"
                                    >
                                        Proceed to pay ₹{toPay}
                                    </Link>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* Sticky CTA on mobile */}
                    <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
                        <div className="container mx-auto flex max-w-7xl items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-gray-500">To pay</p>
                                <p className="text-xl font-bold text-gray-900">₹{toPay}</p>
                            </div>
                            <Link
                                href="#"
                                className="flex max-w-[200px] flex-1 items-center justify-center rounded-xl bg-[var(--theme-primary-1)] py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 focus:outline-none"
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
