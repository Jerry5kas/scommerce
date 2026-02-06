import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, ChevronRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/layouts/UserLayout';

interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    frequency_type: string;
    discount_percent: string;
}

interface Address {
    id: number;
    label: string | null;
    address_line_1: string;
    city: string;
    pincode: string;
    is_default: boolean;
    zone: { id: number; name: string } | null;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    price: string;
    unit: string | null;
    is_subscription_eligible: boolean;
}

interface CreateSubscriptionProps {
    plans: SubscriptionPlan[];
    addresses: Address[];
    products: Product[];
    frequencyOptions: Record<string, string>;
    billingCycleOptions: Record<string, string>;
}

interface SelectedProduct {
    product_id: number;
    quantity: number;
}

export default function CreateSubscription({
    plans,
    addresses,
    products,
    frequencyOptions,
    billingCycleOptions,
}: CreateSubscriptionProps) {
    const [step, setStep] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState<Record<number, number>>({});

    const form = useForm({
        subscription_plan_id: plans[0]?.id || 0,
        user_address_id: addresses.find((a) => a.is_default)?.id || addresses[0]?.id || 0,
        start_date: new Date().toISOString().split('T')[0],
        billing_cycle: 'monthly',
        notes: '',
        items: [] as SelectedProduct[],
    });

    const selectedPlan = plans.find((p) => p.id === form.data.subscription_plan_id);
    const selectedAddress = addresses.find((a) => a.id === form.data.user_address_id);

    const updateQuantity = (productId: number, delta: number) => {
        setSelectedProducts((prev) => {
            const current = prev[productId] || 0;
            const newQty = Math.max(0, current + delta);
            if (newQty === 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: newQty };
        });
    };

    const setQuantity = (productId: number, qty: number) => {
        setSelectedProducts((prev) => {
            if (qty <= 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: qty };
        });
    };

    const calculateTotal = () => {
        return Object.entries(selectedProducts).reduce((sum, [productId, qty]) => {
            const product = products.find((p) => p.id === parseInt(productId));
            return sum + (product ? parseFloat(product.price) * qty : 0);
        }, 0);
    };

    const calculateDiscount = () => {
        if (!selectedPlan || !selectedPlan.discount_percent) return 0;
        return (calculateTotal() * parseFloat(selectedPlan.discount_percent)) / 100;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const items = Object.entries(selectedProducts).map(([productId, quantity]) => ({
            product_id: parseInt(productId),
            quantity,
        }));
        form.setData('items', items);
        form.post('/subscriptions', {
            onError: () => setStep(1),
        });
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return form.data.subscription_plan_id > 0;
            case 2:
                return Object.keys(selectedProducts).length > 0;
            case 3:
                return form.data.user_address_id > 0;
            default:
                return true;
        }
    };

    const total = calculateTotal();
    const discount = calculateDiscount();

    return (
        <UserLayout>
            <Head title="Create Subscription" />
            <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href="/subscriptions"
                            className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Subscriptions
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Create Subscription</h1>
                        <p className="mt-1 text-sm text-gray-600">Set up your recurring delivery</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8 flex items-center justify-between">
                        {['Plan', 'Products', 'Address', 'Review'].map((label, index) => (
                            <div key={label} className="flex items-center">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                        step > index + 1
                                            ? 'bg-green-600 text-white'
                                            : step === index + 1
                                              ? 'bg-[var(--theme-primary-1)] text-white'
                                              : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
                                </div>
                                <span className="ml-2 hidden text-sm sm:block">{label}</span>
                                {index < 3 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Select Plan */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Choose Your Delivery Plan</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {plans.map((plan) => (
                                        <label
                                            key={plan.id}
                                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                                                form.data.subscription_plan_id === plan.id
                                                    ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="plan"
                                                value={plan.id}
                                                checked={form.data.subscription_plan_id === plan.id}
                                                onChange={() => form.setData('subscription_plan_id', plan.id)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {frequencyOptions[plan.frequency_type]}
                                                    </p>
                                                </div>
                                                {parseFloat(plan.discount_percent) > 0 && (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                        {plan.discount_percent}% off
                                                    </span>
                                                )}
                                            </div>
                                            {plan.description && (
                                                <p className="mt-2 text-xs text-gray-500">{plan.description}</p>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Select Products */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Select Products</h2>
                                {products.length === 0 ? (
                                    <div className="rounded-xl bg-white p-8 text-center">
                                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-4 text-gray-600">
                                            No subscription-eligible products available in your area.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {products.map((product) => {
                                            const qty = selectedProducts[product.id] || 0;
                                            return (
                                                <div
                                                    key={product.id}
                                                    className={`flex items-center gap-4 rounded-xl border-2 bg-white p-4 transition-all ${
                                                        qty > 0 ? 'border-[var(--theme-primary-1)]' : 'border-transparent'
                                                    }`}
                                                >
                                                    {product.image && (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-16 w-16 rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            ₹{product.price}
                                                            {product.unit && ` / ${product.unit}`}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {qty > 0 ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(product.id, -1)}
                                                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    value={qty}
                                                                    onChange={(e) =>
                                                                        setQuantity(product.id, parseInt(e.target.value) || 0)
                                                                    }
                                                                    className="w-12 rounded-lg border px-2 py-1 text-center"
                                                                    min="0"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(product.id, 1)}
                                                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => setQuantity(product.id, 1)}
                                                                className="rounded-lg bg-[var(--theme-primary-1)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--theme-primary-1-dark)]"
                                                            >
                                                                Add
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {Object.keys(selectedProducts).length > 0 && (
                                    <div className="mt-4 rounded-xl bg-gray-100 p-4">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>₹{total.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="mt-1 flex justify-between text-sm text-green-600">
                                                <span>Plan Discount</span>
                                                <span>-₹{discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="mt-2 flex justify-between font-semibold">
                                            <span>Per Delivery</span>
                                            <span>₹{(total - discount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Select Address */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Select Delivery Address</h2>
                                <div className="space-y-3">
                                    {addresses.map((address) => (
                                        <label
                                            key={address.id}
                                            className={`block cursor-pointer rounded-xl border-2 p-4 transition-all ${
                                                form.data.user_address_id === address.id
                                                    ? 'border-[var(--theme-primary-1)] bg-[var(--theme-primary-1)]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                value={address.id}
                                                checked={form.data.user_address_id === address.id}
                                                onChange={() => form.setData('user_address_id', address.id)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    {address.label && (
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {address.label}
                                                        </span>
                                                    )}
                                                    <p className="text-sm text-gray-700">{address.address_line_1}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {address.city} - {address.pincode}
                                                    </p>
                                                    {address.zone && (
                                                        <p className="mt-1 text-xs text-green-600">
                                                            ✓ Delivery available ({address.zone.name})
                                                        </p>
                                                    )}
                                                </div>
                                                {address.is_default && (
                                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input
                                        type="date"
                                        value={form.data.start_date}
                                        onChange={(e) => form.setData('start_date', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Delivery Notes (optional)
                                    </label>
                                    <textarea
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        rows={2}
                                        placeholder="Any special instructions for delivery..."
                                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold">Review Your Subscription</h2>

                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <h3 className="mb-2 font-medium text-gray-900">Plan</h3>
                                    <p className="text-gray-700">{selectedPlan?.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {selectedPlan && frequencyOptions[selectedPlan.frequency_type]}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <h3 className="mb-2 font-medium text-gray-900">Products</h3>
                                    <div className="space-y-2">
                                        {Object.entries(selectedProducts).map(([productId, qty]) => {
                                            const product = products.find((p) => p.id === parseInt(productId));
                                            if (!product) return null;
                                            return (
                                                <div key={productId} className="flex justify-between text-sm">
                                                    <span>
                                                        {product.name} x {qty}
                                                    </span>
                                                    <span>₹{(parseFloat(product.price) * qty).toFixed(2)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-3 border-t pt-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>₹{total.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="mt-1 flex justify-between text-sm text-green-600">
                                                <span>Plan Discount ({selectedPlan?.discount_percent}%)</span>
                                                <span>-₹{discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="mt-2 flex justify-between font-bold">
                                            <span>Per Delivery</span>
                                            <span>₹{(total - discount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <h3 className="mb-2 font-medium text-gray-900">Delivery</h3>
                                    <p className="text-sm text-gray-700">{selectedAddress?.address_line_1}</p>
                                    <p className="text-sm text-gray-600">
                                        {selectedAddress?.city} - {selectedAddress?.pincode}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Starting: {new Date(form.data.start_date).toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>

                                {form.errors && Object.keys(form.errors).length > 0 && (
                                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                                        {Object.values(form.errors).map((error, i) => (
                                            <p key={i}>{error}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="mt-8 flex gap-3">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 rounded-lg border px-4 py-3 font-medium hover:bg-gray-50"
                                >
                                    Back
                                </button>
                            )}
                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    disabled={!canProceed()}
                                    className="flex-1 rounded-lg bg-[var(--theme-primary-1)] px-4 py-3 font-medium text-white hover:bg-[var(--theme-primary-1-dark)] disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="flex-1 rounded-lg bg-[var(--theme-primary-1)] px-4 py-3 font-medium text-white hover:bg-[var(--theme-primary-1-dark)] disabled:opacity-50"
                                >
                                    {form.processing ? 'Creating...' : 'Create Subscription'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}

