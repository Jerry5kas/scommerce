import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import UserLayout from '@/layouts/UserLayout';

interface SubscriptionPlan {
    id: number;
    name: string;
    frequency_type: string;
    discount_percent: string;
}

interface Product {
    id: number;
    name: string;
    image: string | null;
    price: string;
    unit: string | null;
}

interface SubscriptionItem {
    id: number;
    product: Product;
    quantity: number;
    price: string;
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

interface Subscription {
    id: number;
    status: string;
    notes: string | null;
    billing_cycle: string;
    auto_renew: boolean;
    plan: SubscriptionPlan;
    items: SubscriptionItem[];
    address: Address;
}

interface EditSubscriptionProps {
    subscription: Subscription;
    plans: SubscriptionPlan[];
    addresses: Address[];
    products: Product[];
    billingCycleOptions: Record<string, string>;
}

export default function EditSubscription({
    subscription,
    plans,
    addresses,
    products,
    billingCycleOptions,
}: EditSubscriptionProps) {
    // Initialize selected products from subscription items
    const initialProducts: Record<number, number> = {};
    subscription.items.forEach((item) => {
        initialProducts[item.product.id] = item.quantity;
    });

    const form = useForm({
        user_address_id: subscription.address.id,
        billing_cycle: subscription.billing_cycle,
        notes: subscription.notes || '',
        auto_renew: subscription.auto_renew,
        items: subscription.items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
        })),
    });

    const selectedProducts = form.data.items.reduce(
        (acc, item) => {
            acc[item.product_id] = item.quantity;
            return acc;
        },
        {} as Record<number, number>
    );

    const updateQuantity = (productId: number, delta: number) => {
        const items = [...form.data.items];
        const index = items.findIndex((i) => i.product_id === productId);

        if (index >= 0) {
            const newQty = Math.max(0, items[index].quantity + delta);
            if (newQty === 0) {
                items.splice(index, 1);
            } else {
                items[index].quantity = newQty;
            }
        } else if (delta > 0) {
            items.push({ product_id: productId, quantity: delta });
        }

        form.setData('items', items);
    };

    const setQuantity = (productId: number, qty: number) => {
        const items = [...form.data.items];
        const index = items.findIndex((i) => i.product_id === productId);

        if (qty <= 0) {
            if (index >= 0) items.splice(index, 1);
        } else if (index >= 0) {
            items[index].quantity = qty;
        } else {
            items.push({ product_id: productId, quantity: qty });
        }

        form.setData('items', items);
    };

    const removeProduct = (productId: number) => {
        form.setData(
            'items',
            form.data.items.filter((i) => i.product_id !== productId)
        );
    };

    const calculateTotal = () => {
        return form.data.items.reduce((sum, item) => {
            const product = products.find((p) => p.id === item.product_id);
            return sum + (product ? parseFloat(product.price) * item.quantity : 0);
        }, 0);
    };

    const calculateDiscount = () => {
        if (!subscription.plan.discount_percent) return 0;
        return (calculateTotal() * parseFloat(subscription.plan.discount_percent)) / 100;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/subscriptions/${subscription.id}`);
    };

    const total = calculateTotal();
    const discount = calculateDiscount();

    return (
        <UserLayout>
            <Head title="Edit Subscription" />
            <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={`/subscriptions/${subscription.id}`}
                            className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Subscription
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Subscription</h1>
                        <p className="mt-1 text-sm text-gray-600">{subscription.plan.name}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Products */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Subscription Items</h2>

                            {/* Current Items */}
                            <div className="space-y-3">
                                {form.data.items.map((item) => {
                                    const product = products.find((p) => p.id === item.product_id);
                                    if (!product) return null;
                                    return (
                                        <div
                                            key={item.product_id}
                                            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                                        >
                                            {product.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-600">₹{product.price}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product_id, -1)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        setQuantity(item.product_id, parseInt(e.target.value) || 0)
                                                    }
                                                    className="w-12 rounded-lg border px-2 py-1 text-center"
                                                    min="1"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product_id, 1)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeProduct(item.product_id)}
                                                    className="ml-2 rounded-lg p-2 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Add More Products */}
                            {products.filter((p) => !selectedProducts[p.id]).length > 0 && (
                                <div className="mt-4 border-t pt-4">
                                    <h3 className="mb-3 text-sm font-medium text-gray-700">Add More Products</h3>
                                    <div className="space-y-2">
                                        {products
                                            .filter((p) => !selectedProducts[p.id])
                                            .map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex items-center justify-between rounded-lg border p-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {product.image && (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="h-10 w-10 rounded object-cover"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900">{product.name}</p>
                                                            <p className="text-sm text-gray-600">₹{product.price}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setQuantity(product.id, 1)}
                                                        className="rounded-lg bg-[var(--theme-primary-1)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--theme-primary-1-dark)]"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="mt-1 flex justify-between text-sm text-green-600">
                                        <span>Plan Discount ({subscription.plan.discount_percent}%)</span>
                                        <span>-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="mt-2 flex justify-between text-lg font-bold">
                                    <span>Per Delivery</span>
                                    <span>₹{(total - discount).toFixed(2)}</span>
                                </div>
                            </div>

                            {form.errors.items && (
                                <p className="mt-2 text-sm text-red-600">{form.errors.items}</p>
                            )}
                        </div>

                        {/* Delivery Address */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Delivery Address</h2>
                            <div className="space-y-3">
                                {addresses.map((address) => (
                                    <label
                                        key={address.id}
                                        className={`block cursor-pointer rounded-lg border-2 p-3 transition-all ${
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
                                        <div className="flex justify-between">
                                            <div>
                                                {address.label && (
                                                    <span className="text-sm font-medium">{address.label}</span>
                                                )}
                                                <p className="text-sm text-gray-700">{address.address_line_1}</p>
                                                <p className="text-sm text-gray-600">
                                                    {address.city} - {address.pincode}
                                                </p>
                                            </div>
                                            {address.is_default && (
                                                <span className="text-xs text-gray-500">Default</span>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Delivery Notes
                                    </label>
                                    <textarea
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        rows={2}
                                        placeholder="Special instructions for delivery..."
                                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-[var(--theme-primary-1)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary-1)]"
                                    />
                                </div>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={form.data.auto_renew}
                                        onChange={(e) => form.setData('auto_renew', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-[var(--theme-primary-1)] focus:ring-[var(--theme-primary-1)]"
                                    />
                                    <span className="text-sm text-gray-700">Auto-renew subscription</span>
                                </label>
                            </div>
                        </div>

                        {/* Error display */}
                        {form.errors && Object.keys(form.errors).length > 0 && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                                {Object.values(form.errors).map((error, i) => (
                                    <p key={i}>{error}</p>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Link
                                href={`/subscriptions/${subscription.id}`}
                                className="flex-1 rounded-lg border px-4 py-3 text-center font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={form.processing || form.data.items.length === 0}
                                className="flex-1 rounded-lg bg-[var(--theme-primary-1)] px-4 py-3 font-medium text-white hover:bg-[var(--theme-primary-1-dark)] disabled:opacity-50"
                            >
                                {form.processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}

