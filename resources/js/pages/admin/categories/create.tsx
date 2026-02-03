import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import type { SharedData } from '@/types';

interface AdminCategoriesCreateProps {
    verticalOptions: Record<string, string>;
}

export default function AdminCategoriesCreate({ verticalOptions }: AdminCategoriesCreateProps) {
    const { csrf_token: csrfToken } = (usePage().props as unknown as SharedData) ?? {};
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
            form.setData('image', ''); // Clear URL when file is selected
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
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

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        form.setData('image_file', null);
        form.setData('image', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AdminLayout title="Add category">
            <Head title="Add category - Admin" />
            <div className="space-y-4">
                <Link href="/admin/categories" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--admin-dark-primary)]">
                    <ArrowLeft className="h-4 w-4" />
                    Back to categories
                </Link>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        
                        // Prevent multiple submissions
                        if (isUploading || form.processing) {
                            return;
                        }
                        
                        // If there's a file, upload it first, then create category with the URL
                        if (imageFile) {
                            setIsUploading(true);
                            
                            // Create FormData for file upload
                            const uploadFormData = new FormData();
                            uploadFormData.append('file', imageFile);
                            uploadFormData.append('folder', 'categories');
                            
                            try {
                                // Use CSRF token from Inertia shared props (current request); fallback to meta/cookie
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

                                // Upload file to ImageKit via separate endpoint
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
                                    // Update form data with the new URL
                                    form.setData('image', uploadResult.url);
                                    form.setData('image_file', null);
                                    setImageFile(null);
                                    
                                    // Now create the category
                                    form.post('/admin/categories', {
                                        onFinish: () => {
                                            setIsUploading(false);
                                        },
                                    });
                                } else {
                                    throw new Error(uploadResult.message || 'Upload failed');
                                }
                            } catch (error) {
                                setIsUploading(false);
                                console.error('File upload error:', error);
                                alert('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
                                return;
                            }
                        } else {
                            // No file, just create category normally
                            form.post('/admin/categories');
                        }
                    }}
                    className="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name *</label>
                        <input type="text" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug</label>
                        <p className="mt-0.5 text-xs text-gray-500">Leave empty to auto-generate from name</p>
                        <input type="text" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                        {form.errors.slug && <p className="mt-1 text-sm text-red-600">{form.errors.slug}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea rows={3} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vertical</label>
                        <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.vertical} onChange={(e) => form.setData('vertical', e.target.value)}>
                            {Object.entries(verticalOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category Image</label>
                        <p className="mt-0.5 mb-2 text-xs text-gray-500">Upload an image file or provide an image URL</p>
                        
                        {/* Image Preview */}
                        {(imagePreview || form.data.image) && (
                            <div className="mb-3 relative inline-block">
                                <img
                                    src={imagePreview || form.data.image}
                                    alt="Preview"
                                    className="h-32 w-32 rounded-lg border border-gray-200 object-cover"
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

                        {/* File Upload */}
                        <div className="mb-3">
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-[var(--admin-dark-primary)] hover:bg-gray-100">
                                <Upload className="h-4 w-4" strokeWidth={2} />
                                <span>{imageFile ? imageFile.name : 'Choose image file'}</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageFileChange}
                                />
                            </label>
                            {form.errors.image_file && <p className="mt-1 text-sm text-red-600">{form.errors.image_file}</p>}
                        </div>

                        {/* URL Input (Alternative) */}
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
                            className="mt-3 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                            value={form.data.image}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            disabled={!!imageFile}
                        />
                        {form.errors.image && <p className="mt-1 text-sm text-red-600">{form.errors.image}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Icon</label>
                        <input type="text" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.icon} onChange={(e) => form.setData('icon', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Display order</label>
                        <input type="number" min={0} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm" value={form.data.display_order} onChange={(e) => form.setData('display_order', Number(e.target.value) || 0)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" className="h-4 w-4 rounded border-gray-300" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                        <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                    </div>
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
                            {isUploading ? 'Uploading image…' : form.processing ? 'Saving…' : 'Save'}
                        </button>
                        <Link href="/admin/categories" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
