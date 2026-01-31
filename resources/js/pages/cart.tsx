import { Head, Link } from '@inertiajs/react';
import {
    ChevronLeft,
    MapPin,
    Calendar,
    Clock,
    Plus,
    Minus,
    Trash2,
    Tag,
    Truck,
    FileText,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/layouts/UserLayout';

const DELIVERY_SLOTS = [
    { id: 'morning', label: 'Morning', time: '6 AM – 9 AM', icon: Clock },
    { id: 'evening', label: 'Evening', time: '4 PM – 7 PM', icon: Clock },
] as const;

interface CartLineItem {
    id: string;
    productId: string;
    name: string;
    variant: string;
    image: string;
    unitPrice: number;
    quantity: number;
    instruction?: string;
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

const MOCK_CART_ITEMS: CartLineItem[] = [
    {
        id: 'line-1',
        productId: 'butter-250',
        name: 'Country Butter',
        variant: '250g',
        image: '/demo/butter.png',
        unitPrice: 250,
        quantity: 1,
    },
];

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
    {
        id: 'addr-2',
        label: 'Office',
        line1: 'Tech Park, Building A',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682030',
    },
];

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartLineItem[]>(MOCK_CART_ITEMS);
    const [addresses, setAddresses] = useState<SavedAddress[]>(MOCK_ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(MOCK_ADDRESSES[0]?.id ?? null);
    const [deliverySlot, setDeliverySlot] = useState<string>(DELIVERY_SLOTS[0].id);
    const [deliveryDate, setDeliveryDate] = useState<string>('2026-02-01');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [editingInstructionId, setEditingInstructionId] = useState<string | null>(null);

    const itemTotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const deliveryFee = itemTotal >= 500 ? 0 : 40;
    const discount = appliedCoupon?.discount ?? 0;
    const toPay = Math.max(0, itemTotal + deliveryFee - discount);

    const updateQuantity = (lineId: string, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === lineId
                        ? { ...item, quantity: Math.max(1, Math.min(99, item.quantity + delta)) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeItem = (lineId: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== lineId));
    };

    const applyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        if (!code) {
            setCouponError('Enter a coupon code');
            return;
        }
        if (code === 'SAVE20') {
            setAppliedCoupon({ code: 'SAVE20', discount: Math.min(50, Math.floor(itemTotal * 0.2)) });
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

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    const isEmpty = cartItems.length === 0;

    return (
        <UserLayout>
            <Head title="Review Cart - Freshtick" />
            <div className="min-h-screen bg-gray-50/50 pt-20 pb-24 sm:pt-24 sm:pb-8">
                <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
                    {/* Back + title – mobile first */}
                    <nav className="mb-6 flex items-center gap-3 sm:mb-8" aria-label="Breadcrumb">
                        <Link
                            href="/products"
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-[var(--theme-primary-1)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2 rounded-lg"
                        >
                            <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2} />
                            <span className="hidden sm:inline">Review Cart</span>
                        </Link>
                        <span className="text-sm text-gray-400" aria-hidden>|</span>
                        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Cart</h1>
                    </nav>

                    {isEmpty ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--theme-primary-1)]/10 text-[var(--theme-primary-1)]">
                                <Truck className="h-8 w-8" strokeWidth={1.5} />
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-gray-900">Your cart is empty</h2>
                            <p className="mt-2 text-sm text-gray-600">Add products from our catalog to get started.</p>
                            <Link
                                href="/products"
                                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[var(--theme-primary-1)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                            >
                                Shop Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-10 lg:gap-8">
                            {/* Left: Delivery + Address – full width on mobile, then lg:6 */}
                            <div className="space-y-4 lg:col-span-6">
                                {/* Delivery – Schedule */}
                                <section
                                    className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6"
                                    aria-labelledby="delivery-heading"
                                >
                                    <h2 id="delivery-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                        <Calendar className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                        Delivery
                                    </h2>
                                    <fieldset className="space-y-4">
                                        <legend className="sr-only">Delivery option</legend>
                                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/5 p-4">
                                            <input
                                                type="radio"
                                                name="deliveryType"
                                                value="scheduled"
                                                defaultChecked
                                                className="mt-1 h-4 w-4 border-gray-300 text-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <span className="font-semibold text-gray-900">Schedule delivery</span>
                                                <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">Choose date and time slot</p>
                                            </div>
                                        </label>
                                    </fieldset>

                                    {/* Time slots */}
                                    <div className="mt-4">
                                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Time slot</p>
                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {DELIVERY_SLOTS.map((slot) => {
                                                const Icon = slot.icon;
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
                                                        <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                                                        <div>
                                                            <span className="block text-sm font-semibold">{slot.label}</span>
                                                            <span className="block text-[10px] text-gray-500 sm:text-xs">{slot.time}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="mt-4">
                                        <label htmlFor="delivery-date" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Delivery date
                                        </label>
                                        <input
                                            id="delivery-date"
                                            type="date"
                                            value={deliveryDate}
                                            onChange={(e) => setDeliveryDate(e.target.value)}
                                            min={new Date().toISOString().slice(0, 10)}
                                            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 transition-colors focus:border-[var(--theme-primary-1)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)]/20"
                                        />
                                    </div>
                                </section>

                                {/* Delivery Address */}
                                <section
                                    className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6"
                                    aria-labelledby="address-heading"
                                >
                                    <h2 id="address-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                        <MapPin className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                        Delivery address
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
                                                            checked={isSelected}
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
                                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--theme-primary-1)]/50 bg-[var(--theme-primary-1)]/5 py-3 text-sm font-semibold text-[var(--theme-primary-1)] transition-colors hover:bg-[var(--theme-primary-1)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                                        >
                                            <Plus className="h-4 w-4" strokeWidth={2} />
                                            Add new address
                                        </button>
                                    ) : (
                                        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                                            <p className="mb-3 text-xs font-semibold text-gray-500">New address (form placeholder – connect to backend)</p>
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
                            </div>

                            {/* Right: Order summary + Offers + Bill – full width on mobile, then lg:4 */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-24 space-y-4">
                                    {/* Order summary */}
                                    <section
                                        className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6"
                                        aria-labelledby="order-heading"
                                    >
                                        <h2 id="order-heading" className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
                                            <FileText className="h-5 w-5 text-[var(--theme-primary-1)]" strokeWidth={2} />
                                            One time order ({cartItems.length})
                                        </h2>
                                        <ul className="space-y-4">
                                            {cartItems.map((item) => (
                                                <li key={item.id} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:p-4">
                                                    <Link
                                                        href={`/products/${item.productId}`}
                                                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--theme-secondary)]/20 sm:h-20 sm:w-20"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt=""
                                                            className="h-full w-full object-contain p-1"
                                                            loading="lazy"
                                                        />
                                                    </Link>
                                                    <div className="min-w-0 flex-1">
                                                        <Link
                                                            href={`/products/${item.productId}`}
                                                            className="font-semibold text-gray-900 hover:text-[var(--theme-primary-1)] line-clamp-2 text-sm sm:text-base"
                                                        >
                                                            {item.name} – ({item.variant})
                                                        </Link>
                                                        <p className="mt-0.5 text-xs text-[var(--theme-primary-1)] font-semibold sm:text-sm">
                                                            ₹{item.unitPrice}/unit
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                                            <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.id, -1)}
                                                                    className="flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--theme-primary-1)] rounded-l-lg"
                                                                    aria-label="Decrease quantity"
                                                                >
                                                                    <Minus className="h-4 w-4" strokeWidth={2} />
                                                                </button>
                                                                <span className="flex h-8 min-w-[2rem] items-center justify-center text-sm font-semibold text-gray-900" aria-live="polite">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.id, 1)}
                                                                    className="flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--theme-primary-1)] rounded-r-lg"
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <Plus className="h-4 w-4" strokeWidth={2} />
                                                                </button>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                                                                aria-label={`Remove ${item.name} from cart`}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                                                                Remove
                                                            </button>
                                                        </div>
                                                        {editingInstructionId === item.id ? (
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Delivery instruction (e.g. Leave at gate)"
                                                                    defaultValue={item.instruction}
                                                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                                                    onBlur={() => setEditingInstructionId(null)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && setEditingInstructionId(null)}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditingInstructionId(item.id)}
                                                                className="mt-2 flex items-center gap-1 text-xs font-medium text-[var(--theme-primary-1)] hover:underline"
                                                            >
                                                                <FileText className="h-3 w-3" strokeWidth={2} />
                                                                {item.instruction ? 'Edit instruction' : 'Add instruction'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                                            <Link
                                                href="/products"
                                                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[var(--theme-primary-1)] bg-white px-4 py-2 text-sm font-semibold text-[var(--theme-primary-1)] transition-colors hover:bg-[var(--theme-primary-1)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                                            >
                                                <Plus className="h-4 w-4" strokeWidth={2} />
                                                Add more items
                                            </Link>
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
                                    <section
                                        className="rounded-2xl border border-gray-200/80 bg-[var(--theme-primary-1)]/5 p-4 shadow-sm sm:p-6"
                                        aria-labelledby="bill-heading"
                                    >
                                        <h2 id="bill-heading" className="mb-4 text-base font-bold text-gray-900 sm:text-lg">
                                            Bill details (includes taxes)
                                        </h2>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between text-gray-700">
                                                <dt>Item total</dt>
                                                <dd className="font-semibold">₹{itemTotal}</dd>
                                            </div>
                                            <div className="flex justify-between text-gray-700">
                                                <dt>Delivery</dt>
                                                <dd className={deliveryFee === 0 ? 'font-semibold text-[var(--theme-primary-1)]' : 'font-semibold'}>
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
                                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-primary-1)] py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-[var(--theme-primary-1-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-1)] focus:ring-offset-2"
                                        >
                                            Proceed to pay ₹{toPay}
                                        </Link>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sticky CTA on mobile when cart has items */}
                    {!isEmpty && (
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
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
