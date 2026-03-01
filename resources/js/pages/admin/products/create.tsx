import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, X, Plus, Trash2, Lock, Unlock } from 'lucide-react';
import { useState, useRef } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { uploadImageToAdmin } from '@/lib/adminUpload';
import { FALLBACK_IMAGE_URL, handleImageFallbackError } from '@/lib/imageFallback';
import { generateProductSku, generateVariantSku } from '@/lib/skuGenerator';
import type { SharedData } from '@/types';

interface VariantRow {
    name: string;
    sku: string;
    price: string;
    stock_quantity: string;
    is_active: boolean;
}

interface CategoryOption {
    id: number;
    name: string;
    slug: string;
}
interface CollectionOption {
    id: number;
    name: string;
    slug: string;
}

interface AdminProductsCreateProps {
    verticalOptions: Record<string, string>;
    categories: CategoryOption[];
    collections: CollectionOption[];
}

/* ── Reusable section wrapper ────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-3">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="space-y-5 p-5">{children}</div>
        </div>
    );
}

export default function AdminProductsCreate({ verticalOptions, categories, collections }: AdminProductsCreateProps) {
    const { csrf_token: csrfToken } = (usePage().props as unknown as SharedData) ?? {};
    const fallbackImage = FALLBACK_IMAGE_URL;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [variants, setVariants] = useState<VariantRow[]>([]);
    const [skuLocked, setSkuLocked] = useState(false);

    const addVariant = () => setVariants([...variants, { name: '', sku: '', price: '', stock_quantity: '200', is_active: true }]);
    const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
    const updateVariant = (i: number, field: keyof VariantRow, value: string | boolean) => {
        const next = [...variants];
        next[i] = { ...next[i], [field]: value };
        // Auto-generate variant SKU when label changes
        if (field === 'name' && typeof value === 'string') {
            next[i].sku = generateVariantSku(form.data.sku, value);
        }
        setVariants(next);
    };

    /** When product name changes, auto-regenerate product SKU + all variant SKUs */
    const handleNameChange = (newName: string) => {
        form.setData('name', newName);
        if (!skuLocked) {
            const newSku = generateProductSku(newName);
            form.setData('sku', newSku);
            // Re-derive all variant SKUs from the new product SKU
            setVariants((prev) => prev.map((v) => ({ ...v, sku: generateVariantSku(newSku, v.name) })));
        }
    };

    const form = useForm({
        name: '',
        slug: '',
        sku: '',
        description: '',
        short_description: '',
        category_id: '' as string | number,
        collection_id: null as number | null,
        image: '',
        images: [] as string[],
        price: '',
        compare_at_price: '',
        cost_price: '',
        stock_quantity: '',
        is_in_stock: true,
        is_subscription_eligible: false,
        requires_bottle: false,
        bottle_deposit: '',
        min_quantity: '',
        max_quantity: '',
        unit: '',
        weight: '',
        is_one_time_purchase: true,
        display_order: 0,
        is_active: true,
        vertical: 'both',
        meta_title: '',
        meta_description: '',
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUploading || form.processing) return;
        try {
            let images = Array.isArray(form.data.images) ? form.data.images : [];
            const hasUploads = !!imageFile || galleryFiles.length > 0;
            if (hasUploads) setIsUploading(true);
            if (imageFile) {
                const url = await uploadImageToAdmin(imageFile, 'products', csrfToken);
                form.setData('image', url);
                setImageFile(null);
                setImagePreview(null);
            }
            if (galleryFiles.length > 0) {
                const uploadedUrls: string[] = [];
                for (const file of galleryFiles) {
                    const url = await uploadImageToAdmin(file, 'products', csrfToken);
                    uploadedUrls.push(url);
                }
                images = [...images, ...uploadedUrls];
                setGalleryFiles([]);
                setGalleryPreviews([]);
            }
            if (hasUploads) setIsUploading(false);
            const variantPayload = variants
                .filter((v) => v.name.trim() !== '')
                .map((v) => ({
                    name: v.name,
                    sku: v.sku,
                    price: v.price ? Number(v.price) : 0,
                    stock_quantity: v.stock_quantity ? Number(v.stock_quantity) : 0,
                    is_active: v.is_active,
                }));
            const payload = {
                ...form.data,
                images,
                variants: variantPayload,
                category_id: form.data.category_id === '' ? undefined : Number(form.data.category_id),
                price: form.data.price ? Number(form.data.price) : 0,
                compare_at_price: form.data.compare_at_price ? Number(form.data.compare_at_price) : null,
                cost_price: form.data.cost_price ? Number(form.data.cost_price) : null,
                stock_quantity: form.data.stock_quantity === '' ? undefined : Number(form.data.stock_quantity),
                min_quantity: form.data.min_quantity === '' ? undefined : Number(form.data.min_quantity),
                max_quantity: form.data.max_quantity === '' ? undefined : Number(form.data.max_quantity),
                weight: form.data.weight === '' ? undefined : Number(form.data.weight),
                collection_id: form.data.collection_id || null,
                bottle_deposit: form.data.bottle_deposit === '' ? undefined : Number(form.data.bottle_deposit),
            };
            form.transform(() => payload);
            form.post('/admin/products');
        } catch (err) {
            setIsUploading(false);
            alert('Failed to upload image: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        setGalleryFiles(files);
        setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const inputCls =
        'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-1 focus:ring-[var(--admin-dark-primary)]';
    const labelCls = 'block text-sm font-medium text-gray-700';

    return (
        <AdminLayout title="Add product">
            <Head title="Add product - Admin" />
            <form onSubmit={submit} className="space-y-6">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" /> Back to products
                </Link>

                {/* ── Basic information ─────────────────────── */}
                <Section title="Basic information">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Name *</label>
                            <input
                                type="text"
                                required
                                className={inputCls}
                                value={form.data.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                            />
                            {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>
                                SKU * <span className="text-xs font-normal text-gray-400">— {skuLocked ? 'manual' : 'auto-generated'}</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className={inputCls + ' pr-9 font-mono uppercase'}
                                    value={form.data.sku}
                                    onChange={(e) => {
                                        setSkuLocked(true);
                                        form.setData('sku', e.target.value.toUpperCase());
                                    }}
                                />
                                <button
                                    type="button"
                                    title={
                                        skuLocked ? 'Unlock to auto-generate from name' : 'SKU is auto-generated — click to lock and edit manually'
                                    }
                                    onClick={() => {
                                        if (skuLocked) {
                                            const newSku = generateProductSku(form.data.name);
                                            form.setData('sku', newSku);
                                            setVariants((prev) => prev.map((v) => ({ ...v, sku: generateVariantSku(newSku, v.name) })));
                                        }
                                        setSkuLocked(!skuLocked);
                                    }}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
                                >
                                    {skuLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                </button>
                            </div>
                            {form.errors.sku && <p className="mt-1 text-sm text-red-600">{form.errors.sku}</p>}
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>
                            Slug <span className="text-xs font-normal text-gray-400">— auto-generated if empty</span>
                        </label>
                        <input type="text" className={inputCls} value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Category *</label>
                            <select
                                className={inputCls}
                                value={form.data.category_id}
                                onChange={(e) => form.setData('category_id', Number(e.target.value) || '')}
                            >
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Collection</label>
                            <select
                                className={inputCls}
                                value={form.data.collection_id ?? ''}
                                onChange={(e) => form.setData('collection_id', e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">None</option>
                                {collections.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea
                            rows={3}
                            className={inputCls}
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Short description</label>
                        <input
                            type="text"
                            className={inputCls}
                            value={form.data.short_description}
                            onChange={(e) => form.setData('short_description', e.target.value)}
                        />
                    </div>
                </Section>

                {/* ── Media ─────────────────────────────────── */}
                <Section title="Media">
                    <div className="grid gap-5 sm:grid-cols-2">
                        {/* Main image */}
                        <div>
                            <label className={labelCls}>Main image *</label>
                            <p className="mt-0.5 mb-2 text-xs text-gray-500">Upload a file or enter image URL</p>
                            {(imagePreview || form.data.image) && (
                                <div className="relative mb-3 inline-block">
                                    <img
                                        src={imagePreview || form.data.image || fallbackImage}
                                        alt="Preview"
                                        className="h-28 w-28 rounded-lg border border-gray-200 object-cover"
                                        onError={handleImageFallbackError}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                            form.setData('image', '');
                                            if (imageInputRef.current) imageInputRef.current.value = '';
                                        }}
                                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[var(--admin-dark-primary)] hover:bg-gray-100">
                                <Upload className="h-4 w-4" />
                                <span>{imageFile ? imageFile.name : 'Choose image'}</span>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                            setImageFile(f);
                                            form.setData('image', '');
                                            const r = new FileReader();
                                            r.onloadend = () => setImagePreview(r.result as string);
                                            r.readAsDataURL(f);
                                        }
                                    }}
                                />
                            </label>
                            <div className="relative my-3">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">Or enter URL</span>
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="https://..."
                                className={inputCls}
                                value={form.data.image}
                                onChange={(e) => {
                                    form.setData('image', e.target.value);
                                    if (e.target.value) {
                                        setImageFile(null);
                                        setImagePreview(null);
                                    }
                                }}
                                disabled={!!imageFile}
                            />
                            {form.errors.image && <p className="mt-1 text-sm text-red-600">{form.errors.image}</p>}
                        </div>
                        {/* Gallery */}
                        <div>
                            <label className={labelCls}>Gallery images</label>
                            <p className="mt-0.5 mb-2 text-xs text-gray-500">Upload multiple images for the gallery</p>
                            {(galleryPreviews.length > 0 || (form.data.images && form.data.images.length > 0)) && (
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {form.data.images.map((url, index) => (
                                        <div key={'existing-' + index} className="relative">
                                            <img
                                                src={url || fallbackImage}
                                                alt=""
                                                className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                                                onError={handleImageFallbackError}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    form.setData(
                                                        'images',
                                                        form.data.images.filter((_, i) => i !== index),
                                                    )
                                                }
                                                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {galleryPreviews.map((url, index) => (
                                        <img
                                            key={'new-' + index}
                                            src={url || fallbackImage}
                                            alt=""
                                            className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                                            onError={handleImageFallbackError}
                                        />
                                    ))}
                                </div>
                            )}
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[var(--admin-dark-primary)] hover:bg-gray-100">
                                <Upload className="h-4 w-4" />
                                <span>{galleryFiles.length > 0 ? `${galleryFiles.length} file(s)` : 'Choose gallery images'}</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryFilesChange} />
                            </label>
                        </div>
                    </div>
                </Section>

                {/* ── Pricing & stock ───────────────────────── */}
                <Section title="Pricing & stock">
                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <label className={labelCls}>Price *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                className={inputCls}
                                value={form.data.price}
                                onChange={(e) => form.setData('price', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Compare at price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className={inputCls}
                                value={form.data.compare_at_price}
                                onChange={(e) => form.setData('compare_at_price', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Cost price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className={inputCls}
                                value={form.data.cost_price}
                                onChange={(e) => form.setData('cost_price', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <label className={labelCls}>Stock quantity</label>
                            <input
                                type="number"
                                min="0"
                                className={inputCls}
                                value={form.data.stock_quantity}
                                onChange={(e) => form.setData('stock_quantity', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Min quantity</label>
                            <input
                                type="number"
                                min="1"
                                className={inputCls}
                                value={form.data.min_quantity}
                                onChange={(e) => form.setData('min_quantity', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Max quantity</label>
                            <input
                                type="number"
                                min="1"
                                className={inputCls}
                                value={form.data.max_quantity}
                                onChange={(e) => form.setData('max_quantity', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <label className={labelCls}>Bottle deposit</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className={inputCls}
                                value={form.data.bottle_deposit}
                                onChange={(e) => form.setData('bottle_deposit', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Unit</label>
                            <input
                                type="text"
                                placeholder="e.g. kg, L, g"
                                className={inputCls}
                                value={form.data.unit}
                                onChange={(e) => form.setData('unit', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Weight</label>
                            <input
                                type="number"
                                step="0.001"
                                min="0"
                                placeholder="e.g. 0.500"
                                className={inputCls}
                                value={form.data.weight}
                                onChange={(e) => form.setData('weight', e.target.value)}
                            />
                        </div>
                    </div>
                </Section>

                {/* ── Settings ──────────────────────────────── */}
                <Section title="Settings">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Vertical</label>
                            <select className={inputCls} value={form.data.vertical} onChange={(e) => form.setData('vertical', e.target.value)}>
                                {Object.entries(verticalOptions).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Display order</label>
                            <input
                                type="number"
                                min={0}
                                className={inputCls}
                                value={form.data.display_order}
                                onChange={(e) => form.setData('display_order', Number(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[var(--admin-dark-primary)]"
                                checked={form.data.is_in_stock}
                                onChange={(e) => form.setData('is_in_stock', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">In stock</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[var(--admin-dark-primary)]"
                                checked={form.data.is_subscription_eligible}
                                onChange={(e) => form.setData('is_subscription_eligible', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">Subscription eligible</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[var(--admin-dark-primary)]"
                                checked={form.data.requires_bottle}
                                onChange={(e) => form.setData('requires_bottle', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">Requires bottle</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[var(--admin-dark-primary)]"
                                checked={form.data.is_one_time_purchase}
                                onChange={(e) => form.setData('is_one_time_purchase', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">One-time purchase</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[var(--admin-dark-primary)]"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">Active</span>
                        </label>
                    </div>
                </Section>

                {/* ── Variants ──────────────────────────────── */}
                <Section title="Variants">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {variants.length > 0
                                ? `${variants.length} variant${variants.length > 1 ? 's' : ''} configured`
                                : 'No variants yet. Click "Add variant" to create size/weight options.'}
                        </p>
                        <button
                            type="button"
                            onClick={addVariant}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add variant
                        </button>
                    </div>
                    {variants.length > 0 && (
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Label *</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU *</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price *</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Active</th>
                                        <th className="w-10 px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {variants.map((v, i) => (
                                        <tr key={i}>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. 500g"
                                                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                    value={v.name}
                                                    onChange={(e) => updateVariant(i, 'name', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Auto"
                                                    className="w-full rounded border border-gray-300 bg-gray-50 px-2 py-1.5 font-mono text-sm uppercase"
                                                    value={v.sku}
                                                    readOnly
                                                    title="Auto-generated from product SKU + variant label"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                    placeholder="0.00"
                                                    className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                    value={v.price}
                                                    onChange={(e) => updateVariant(i, 'price', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                    value={v.stock_quantity}
                                                    onChange={(e) => updateVariant(i, 'stock_quantity', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    checked={v.is_active}
                                                    onChange={(e) => updateVariant(i, 'is_active', e.target.checked)}
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(i)}
                                                    className="rounded p-1 text-red-500 hover:bg-red-50"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Section>

                {/* ── Actions ──────────────────────────────── */}
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={form.processing || isUploading}
                        className="rounded-lg bg-[var(--admin-dark-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                    >
                        {isUploading ? 'Uploading…' : form.processing ? 'Saving…' : 'Create product'}
                    </button>
                    <Link
                        href="/admin/products"
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
