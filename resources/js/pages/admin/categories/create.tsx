import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { FALLBACK_IMAGE_URL, handleImageFallbackError } from '@/lib/imageFallback';
import type { SharedData } from '@/types';

interface AdminCategoriesCreateProps {
    verticalOptions: Record<string, string>;
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

export default function AdminCategoriesCreate({ verticalOptions }: AdminCategoriesCreateProps) {
    const { csrf_token: csrfToken } = (usePage().props as unknown as SharedData) ?? {};
    const fallbackImage = FALLBACK_IMAGE_URL;
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        name: '',
        slug: '',
        description: '',
        image: '',
        image_file: null as File | null,
        icon: '',
        display_order: 0,
        is_active: true,
        vertical: 'both',
        meta_title: '',
        meta_description: '',
    });

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            form.setData('image_file', file);
            form.setData('image', '');
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        form.setData('image_file', null);
        form.setData('image', '');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const inputCls =
        'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-1 focus:ring-[var(--admin-dark-primary)]';
    const labelCls = 'block text-sm font-medium text-gray-700';

    return (
        <AdminLayout title="Add category">
            <Head title="Add category - Admin" />
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (isUploading || form.processing) return;
                    if (imageFile) {
                        setIsUploading(true);
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', imageFile);
                        uploadFormData.append('folder', 'categories');
                        try {
                            const token = csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                            const xsrfCookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
                            const headers: Record<string, string> = { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' };
                            if (token) headers['X-CSRF-TOKEN'] = token;
                            else if (xsrfCookie) headers['X-XSRF-TOKEN'] = xsrfCookie.replace(/^"(.*)"$/, '$1');
                            const uploadResponse = await fetch('/admin/files/upload', {
                                method: 'POST',
                                headers,
                                credentials: 'same-origin',
                                body: uploadFormData,
                            });
                            if (!uploadResponse.ok) {
                                const errorData = await uploadResponse.json().catch(() => ({}));
                                throw new Error(errorData.message || 'File upload failed');
                            }
                            const uploadResult = await uploadResponse.json();
                            if (uploadResult.success && uploadResult.url) {
                                form.setData('image', uploadResult.url);
                                form.setData('image_file', null);
                                setImageFile(null);
                                form.post('/admin/categories', { onFinish: () => setIsUploading(false) });
                            } else {
                                throw new Error(uploadResult.message || 'Upload failed');
                            }
                        } catch (error) {
                            setIsUploading(false);
                            alert('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
                        }
                    } else {
                        form.post('/admin/categories');
                    }
                }}
                className="space-y-6"
            >
                <Link
                    href="/admin/categories"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to categories
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
                            <label className={labelCls}>
                                Slug <span className="text-xs font-normal text-gray-400">— auto-generated if empty</span>
                            </label>
                            <input type="text" className={inputCls} value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
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

                {/* ── Media ─────────────────────────────────── */}
                <Section title="Media">
                    <div>
                        <label className={labelCls}>Category image</label>
                        <p className="mt-0.5 mb-2 text-xs text-gray-500">Upload an image file or provide an image URL</p>
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
                                    onClick={clearImage}
                                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[var(--admin-dark-primary)] hover:bg-gray-100">
                            <Upload className="h-4 w-4" />
                            <span>{imageFile ? imageFile.name : 'Choose image file'}</span>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                        </label>
                        <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or enter image URL</span>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            className={inputCls}
                            value={form.data.image}
                            onChange={(e) => {
                                form.setData('image', e.target.value);
                                if (e.target.value) {
                                    setImageFile(null);
                                    setImagePreview(null);
                                    form.setData('image_file', null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }
                            }}
                            disabled={!!imageFile}
                        />
                        {form.errors.image && <p className="mt-1 text-sm text-red-600">{form.errors.image}</p>}
                    </div>
                </Section>

                {/* ── Settings ──────────────────────────────── */}
                <Section title="Settings">
                    <div className="grid gap-5 sm:grid-cols-3">
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
                            <label className={labelCls}>Icon</label>
                            <input type="text" className={inputCls} value={form.data.icon} onChange={(e) => form.setData('icon', e.target.value)} />
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
                        className="flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {(form.processing || isUploading) && (
                            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        )}
                        {isUploading ? 'Uploading image…' : form.processing ? 'Saving…' : 'Create category'}
                    </button>
                    <Link
                        href="/admin/categories"
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
