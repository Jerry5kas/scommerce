import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import type { SharedData } from '@/types';

interface Zone {
    id: number;
    name: string;
}

interface Banner {
    id: number;
    name: string;
    type: string;
    title: string | null;
    description: string | null;
    image: string;
    mobile_image: string | null;
    link_url: string | null;
    link_type: string;
    link_id: string | null;
    display_order: number;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
    zones: number[] | null;
}

interface AdminBannersEditProps {
    banner: Banner;
    typeOptions: Record<string, string>;
    linkTypeOptions: Record<string, string>;
    zones: Zone[];
}

export default function AdminBannersEdit({ banner, typeOptions, linkTypeOptions, zones }: AdminBannersEditProps) {
    const { csrf_token: csrfToken } = (usePage().props as unknown as SharedData) ?? {};
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(null);
    const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mobileFileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        name: banner.name,
        type: banner.type,
        title: banner.title || '',
        description: banner.description || '',
        image: banner.image,
        image_file: null as File | null,
        mobile_image: banner.mobile_image || '',
        mobile_image_file: null as File | null,
        link_url: banner.link_url || '',
        link_type: banner.link_type,
        link_id: banner.link_id || '',
        display_order: banner.display_order,
        is_active: banner.is_active,
        starts_at: banner.starts_at ? banner.starts_at.slice(0, 16) : '',
        ends_at: banner.ends_at ? banner.ends_at.slice(0, 16) : '',
        zones: banner.zones || [],
    });

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            form.setData('image_file', file);
            form.setData('image', '');
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMobileImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMobileImageFile(file);
            form.setData('mobile_image_file', file);
            form.setData('mobile_image', '');
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setMobileImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlChange = (url: string) => {
        form.setData('image', url);
        if (url) {
            setImageFile(null);
            setImagePreview(null);
            form.setData('image_file', null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleMobileImageUrlChange = (url: string) => {
        form.setData('mobile_image', url);
        if (url) {
            setMobileImageFile(null);
            setMobileImagePreview(null);
            form.setData('mobile_image_file', null);
            if (mobileFileInputRef.current) {
                mobileFileInputRef.current.value = '';
            }
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        form.setData('image_file', null);
        form.setData('image', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const clearMobileImage = () => {
        setMobileImageFile(null);
        setMobileImagePreview(null);
        form.setData('mobile_image_file', null);
        form.setData('mobile_image', '');
        if (mobileFileInputRef.current) {
            mobileFileInputRef.current.value = '';
        }
    };

    const handleZoneToggle = (zoneId: number) => {
        const currentZones = form.data.zones;
        if (currentZones.includes(zoneId)) {
            form.setData('zones', currentZones.filter(id => id !== zoneId));
        } else {
            form.setData('zones', [...currentZones, zoneId]);
        }
    };

    const uploadFile = async (file: File, folder: string): Promise<string> => {
        const token = csrfToken
            || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            || document.querySelector('input[name="_token"]')?.getAttribute('value')
            || '';
        const xsrfCookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
        const headers: Record<string, string> = {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        };
        if (token) {
            headers['X-CSRF-TOKEN'] = token;
        } else if (xsrfCookie) {
            headers['X-XSRF-TOKEN'] = xsrfCookie.replace(/^"(.*)"$/, '$1');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/admin/files/upload', {
            method: 'POST',
            headers,
            credentials: 'same-origin',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'File upload failed');
        }

        const result = await response.json();
        if (result.success && result.url) return result.url;
        throw new Error(result.message || 'Upload failed');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isUploading || form.processing) {
            return;
        }

        setIsUploading(true);

        try {
            // Upload main image if file selected
            if (imageFile) {
                const imageUrl = await uploadFile(imageFile, 'banners');
                form.setData('image', imageUrl);
                form.setData('image_file', null);
                setImageFile(null);
            }

            // Upload mobile image if file selected
            if (mobileImageFile) {
                const mobileImageUrl = await uploadFile(mobileImageFile, 'banners/mobile');
                form.setData('mobile_image', mobileImageUrl);
                form.setData('mobile_image_file', null);
                setMobileImageFile(null);
            }

            // Submit the form
            form.put(`/admin/banners/${banner.id}`, {
                onFinish: () => {
                    setIsUploading(false);
                },
            });
        } catch (error) {
            setIsUploading(false);
            console.error('File upload error:', error);
            alert('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    return (
        <AdminLayout title="Edit Banner">
            <Head title="Edit Banner - Admin" />
            <div className="space-y-4">
                <Link href="/admin/banners" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" />
                    Back to banners
                </Link>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name *</label>
                        <input 
                            type="text" 
                            required 
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                            value={form.data.name} 
                            onChange={(e) => form.setData('name', e.target.value)} 
                        />
                        {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type *</label>
                        <select 
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                            value={form.data.type} 
                            onChange={(e) => form.setData('type', e.target.value)}
                        >
                            {Object.entries(typeOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        {form.errors.type && <p className="mt-1 text-sm text-red-600">{form.errors.type}</p>}
                    </div>

                    {/* Title & Description */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                                value={form.data.title} 
                                onChange={(e) => form.setData('title', e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                                value={form.data.description} 
                                onChange={(e) => form.setData('description', e.target.value)} 
                            />
                        </div>
                    </div>

                    {/* Desktop Banner Image */}
                    <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-gray-700">Desktop Banner Image *</label>
                        <p className="mt-0.5 mb-2 text-xs text-gray-500">Recommended: 1920x600px or 21:9 ratio</p>
                        
                        {(imagePreview || form.data.image) && (
                            <div className="mb-3 relative inline-block">
                                <img
                                    src={imagePreview || form.data.image}
                                    alt="Preview"
                                    className="h-32 w-auto max-w-xs rounded-lg border border-gray-200 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                    aria-label="Remove image"
                                >
                                    <X className="h-4 w-4" strokeWidth={2} />
                                </button>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-[var(--admin-dark-primary)] hover:bg-gray-100">
                                <Upload className="h-4 w-4" strokeWidth={2} />
                                <span>{imageFile ? imageFile.name : 'Choose new image file'}</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageFileChange}
                                />
                            </label>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or enter image URL</span>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            className="mt-3 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                            value={form.data.image}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            disabled={!!imageFile}
                        />
                        {form.errors.image && <p className="mt-1 text-sm text-red-600">{form.errors.image}</p>}
                    </div>

                    {/* Mobile Banner Image */}
                    <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-gray-700">Mobile Banner Image (Optional)</label>
                        <p className="mt-0.5 mb-2 text-xs text-gray-500">Recommended: 640x480px or 4:3 ratio. Falls back to desktop image if not provided.</p>
                        
                        {(mobileImagePreview || form.data.mobile_image) && (
                            <div className="mb-3 relative inline-block">
                                <img
                                    src={mobileImagePreview || form.data.mobile_image}
                                    alt="Mobile Preview"
                                    className="h-32 w-auto max-w-xs rounded-lg border border-gray-200 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearMobileImage}
                                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                    aria-label="Remove mobile image"
                                >
                                    <X className="h-4 w-4" strokeWidth={2} />
                                </button>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-[var(--admin-dark-primary)] hover:bg-gray-100">
                                <Upload className="h-4 w-4" strokeWidth={2} />
                                <span>{mobileImageFile ? mobileImageFile.name : 'Choose new mobile image file'}</span>
                                <input
                                    ref={mobileFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleMobileImageFileChange}
                                />
                            </label>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or enter image URL</span>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="https://example.com/mobile-image.jpg"
                            className="mt-3 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]"
                            value={form.data.mobile_image}
                            onChange={(e) => handleMobileImageUrlChange(e.target.value)}
                            disabled={!!mobileImageFile}
                        />
                    </div>

                    {/* Link Settings */}
                    <div className="border-t border-gray-200 pt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Link Type</label>
                            <select 
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                                value={form.data.link_type} 
                                onChange={(e) => form.setData('link_type', e.target.value)}
                            >
                                {Object.entries(linkTypeOptions).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Link ID / URL</label>
                            <input 
                                type="text" 
                                placeholder={form.data.link_type === 'external' ? 'https://example.com' : 'ID or slug'}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                                value={form.data.link_id} 
                                onChange={(e) => form.setData('link_id', e.target.value)} 
                            />
                        </div>
                    </div>

                    {/* Display Settings */}
                    <div className="border-t border-gray-200 pt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display Order</label>
                            <input 
                                type="number" 
                                min={0} 
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                                value={form.data.display_order} 
                                onChange={(e) => form.setData('display_order', Number(e.target.value) || 0)} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input 
                                type="datetime-local" 
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                                value={form.data.starts_at} 
                                onChange={(e) => form.setData('starts_at', e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input 
                                type="datetime-local" 
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                                value={form.data.ends_at} 
                                onChange={(e) => form.setData('ends_at', e.target.value)} 
                            />
                        </div>
                    </div>

                    {/* Zones */}
                    {zones.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Visible in Zones (Optional)</label>
                            <p className="text-xs text-gray-500 mb-3">Leave empty to show in all zones</p>
                            <div className="flex flex-wrap gap-2">
                                {zones.map((zone) => (
                                    <label 
                                        key={zone.id} 
                                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                                            form.data.zones.includes(zone.id) 
                                                ? 'bg-[var(--admin-dark-primary)] text-white border-[var(--admin-dark-primary)]' 
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-[var(--admin-dark-primary)]'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={form.data.zones.includes(zone.id)}
                                            onChange={() => handleZoneToggle(zone.id)}
                                        />
                                        <span className="text-sm">{zone.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active */}
                    <div className="border-t border-gray-200 pt-4 flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="is_active" 
                            className="h-4 w-4 rounded border-gray-300 text-[var(--admin-dark-primary)] focus:ring-[var(--admin-dark-primary)]" 
                            checked={form.data.is_active} 
                            onChange={(e) => form.setData('is_active', e.target.checked)} 
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-2 border-t border-gray-200 pt-4">
                        <button
                            type="submit"
                            disabled={form.processing || isUploading}
                            className="flex items-center gap-2 rounded-lg bg-[var(--admin-dark-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {(form.processing || isUploading) && (
                                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isUploading ? 'Uploading…' : form.processing ? 'Saving…' : 'Update Banner'}
                        </button>
                        <Link href="/admin/banners" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
