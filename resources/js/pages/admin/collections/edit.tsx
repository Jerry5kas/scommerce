import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { uploadImageToAdmin } from '@/lib/adminUpload';
import { FALLBACK_IMAGE_URL, handleImageFallbackError } from '@/lib/imageFallback';
import type { SharedData } from '@/types';

interface CategoryOption {
    id: number;
    name: string;
    slug: string;
}

interface CollectionData {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    category_id: number | null;
    banner_image: string;
    banner_mobile_image: string | null;
    display_order: number;
    is_active: boolean;
    vertical: string;
    starts_at: string | null;
    ends_at: string | null;
    link_url: string | null;
    meta_title: string | null;
    meta_description: string | null;
}

interface AdminCollectionsEditProps {
    collection: CollectionData;
    verticalOptions: Record<string, string>;
    categories: CategoryOption[];
}

function toDatetimeLocal(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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

export default function AdminCollectionsEdit({ collection, verticalOptions, categories }: AdminCollectionsEditProps) {
    const { csrf_token: csrfToken } = (usePage().props as unknown as SharedData) ?? {};
    const fallbackImage = FALLBACK_IMAGE_URL;
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(collection.banner_image ?? null);
    const [bannerMobileImageFile, setBannerMobileImageFile] = useState<File | null>(null);
    const [bannerMobileImagePreview, setBannerMobileImagePreview] = useState<string | null>(collection.banner_mobile_image ?? null);
    const [isUploading, setIsUploading] = useState(false);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const bannerMobileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        name: collection.name,
        slug: collection.slug ?? '',
        description: collection.description ?? '',
        category_id: collection.category_id,
        banner_image: collection.banner_image,
        banner_mobile_image: collection.banner_mobile_image ?? '',
        display_order: collection.display_order,
        is_active: collection.is_active,
        vertical: collection.vertical ?? 'both',
        starts_at: toDatetimeLocal(collection.starts_at),
        ends_at: toDatetimeLocal(collection.ends_at),
        link_url: collection.link_url ?? '',
        meta_title: collection.meta_title ?? '',
        meta_description: collection.meta_description ?? '',
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUploading || form.processing) return;
        try {
            const hasFiles = bannerImageFile || bannerMobileImageFile;
            if (hasFiles) setIsUploading(true);
            if (bannerImageFile) {
                const url = await uploadImageToAdmin(bannerImageFile, 'collections', csrfToken);
                form.setData('banner_image', url);
                setBannerImageFile(null);
                setBannerImagePreview(url);
            }
            if (bannerMobileImageFile) {
                const url = await uploadImageToAdmin(bannerMobileImageFile, 'collections', csrfToken);
                form.setData('banner_mobile_image', url);
                setBannerMobileImageFile(null);
                setBannerMobileImagePreview(url);
            }
            if (hasFiles) setIsUploading(false);
            form.put('/admin/collections/' + collection.id);
        } catch (err) {
            setIsUploading(false);
            alert('Failed to upload image: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const inputCls =
        'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-(--admin-dark-primary) focus:ring-1 focus:ring-(--admin-dark-primary)';
    const labelCls = 'block text-sm font-medium text-gray-700';

    return (
        <AdminLayout title={'Edit: ' + collection.name}>
            <Head title={'Edit ' + collection.name + ' - Admin'} />
            <form onSubmit={submit} className="space-y-6">
                <Link href="/admin/collections" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-(--admin-dark-primary)">
                    <ArrowLeft className="h-4 w-4" /> Back to collections
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
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                            {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Slug</label>
                            <input type="text" className={inputCls} value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Category</label>
                            <select
                                className={inputCls}
                                value={form.data.category_id ?? ''}
                                onChange={(e) => form.setData('category_id', e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">None</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                </Section>

                {/* ── Banner images ─────────────────────────── */}
                <Section title="Banner images">
                    <div className="grid gap-5 sm:grid-cols-2">
                        {/* Desktop banner */}
                        <div>
                            <label className={labelCls}>Desktop banner *</label>
                            <p className="mt-0.5 mb-2 text-xs text-gray-500">Upload a file or enter image URL</p>
                            {(bannerImagePreview || bannerImageFile) && (
                                <div className="relative mb-3 inline-block">
                                    <img
                                        src={
                                            bannerImageFile
                                                ? (bannerImagePreview ?? fallbackImage)
                                                : bannerImagePreview || form.data.banner_image || fallbackImage
                                        }
                                        alt=""
                                        className="h-28 w-auto max-w-full rounded-lg border border-gray-200 object-cover"
                                        onError={handleImageFallbackError}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBannerImageFile(null);
                                            setBannerImagePreview(collection.banner_image ?? null);
                                            form.setData('banner_image', collection.banner_image ?? '');
                                        }}
                                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-(--admin-dark-primary) hover:bg-gray-100">
                                <Upload className="h-4 w-4" />
                                <span>{bannerImageFile ? bannerImageFile.name : 'Choose banner image'}</span>
                                <input
                                    ref={bannerInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                            setBannerImageFile(f);
                                            form.setData('banner_image', '');
                                            const r = new FileReader();
                                            r.onloadend = () => setBannerImagePreview(r.result as string);
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
                                value={form.data.banner_image}
                                onChange={(e) => {
                                    form.setData('banner_image', e.target.value);
                                    setBannerImagePreview(e.target.value || (collection.banner_image ?? null));
                                    if (e.target.value) setBannerImageFile(null);
                                }}
                                disabled={!!bannerImageFile}
                            />
                            {form.errors.banner_image && <p className="mt-1 text-sm text-red-600">{form.errors.banner_image}</p>}
                        </div>
                        {/* Mobile banner */}
                        <div>
                            <label className={labelCls}>Mobile banner</label>
                            <p className="mt-0.5 mb-2 text-xs text-gray-500">Upload a file or enter image URL</p>
                            {(bannerMobileImagePreview || bannerMobileImageFile) && (
                                <div className="relative mb-3 inline-block">
                                    <img
                                        src={
                                            bannerMobileImageFile
                                                ? (bannerMobileImagePreview ?? fallbackImage)
                                                : bannerMobileImagePreview || form.data.banner_mobile_image || fallbackImage
                                        }
                                        alt=""
                                        className="h-28 w-auto max-w-full rounded-lg border border-gray-200 object-cover"
                                        onError={handleImageFallbackError}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBannerMobileImageFile(null);
                                            setBannerMobileImagePreview(collection.banner_mobile_image ?? null);
                                            form.setData('banner_mobile_image', collection.banner_mobile_image ?? '');
                                        }}
                                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-(--admin-dark-primary) hover:bg-gray-100">
                                <Upload className="h-4 w-4" />
                                <span>{bannerMobileImageFile ? bannerMobileImageFile.name : 'Choose mobile banner'}</span>
                                <input
                                    ref={bannerMobileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                            setBannerMobileImageFile(f);
                                            form.setData('banner_mobile_image', '');
                                            const r = new FileReader();
                                            r.onloadend = () => setBannerMobileImagePreview(r.result as string);
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
                                value={form.data.banner_mobile_image}
                                onChange={(e) => {
                                    form.setData('banner_mobile_image', e.target.value);
                                    setBannerMobileImagePreview(e.target.value || (collection.banner_mobile_image ?? null));
                                    if (e.target.value) setBannerMobileImageFile(null);
                                }}
                                disabled={!!bannerMobileImageFile}
                            />
                        </div>
                    </div>
                </Section>

                {/* ── Schedule & settings ───────────────────── */}
                <Section title="Schedule & settings">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Starts at</label>
                            <input
                                type="datetime-local"
                                className={inputCls}
                                value={form.data.starts_at}
                                onChange={(e) => form.setData('starts_at', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Ends at</label>
                            <input
                                type="datetime-local"
                                className={inputCls}
                                value={form.data.ends_at}
                                onChange={(e) => form.setData('ends_at', e.target.value)}
                            />
                            {form.errors.ends_at && <p className="mt-1 text-sm text-red-600">{form.errors.ends_at}</p>}
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Link URL</label>
                            <input
                                type="text"
                                className={inputCls}
                                value={form.data.link_url}
                                onChange={(e) => form.setData('link_url', e.target.value)}
                            />
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
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">Active</span>
                    </label>
                </Section>

                {/* ── SEO ───────────────────────────────────── */}
                <Section title="SEO">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>Meta title</label>
                            <input
                                type="text"
                                className={inputCls}
                                value={form.data.meta_title}
                                onChange={(e) => form.setData('meta_title', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Meta description</label>
                            <input
                                type="text"
                                className={inputCls}
                                value={form.data.meta_description}
                                onChange={(e) => form.setData('meta_description', e.target.value)}
                            />
                        </div>
                    </div>
                </Section>

                {/* ── Actions ──────────────────────────────── */}
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={form.processing || isUploading}
                        className="rounded-lg bg-(--admin-dark-primary) px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
                    >
                        {isUploading ? 'Uploading…' : form.processing ? 'Saving…' : 'Save changes'}
                    </button>
                    <Link
                        href={'/admin/collections/' + collection.id}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
