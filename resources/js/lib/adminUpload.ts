/**
 * Upload a file to admin ImageKit endpoint. Returns the image URL on success.
 */
export async function uploadImageToAdmin(
    file: File,
    folder: string,
    csrfToken?: string
): Promise<string> {
    const token =
        csrfToken ||
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
        document.querySelector('input[name="_token"]')?.getAttribute('value') ||
        '';
    const xsrfCookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
    const headers: Record<string, string> = {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    };
    if (token) {
        headers['X-CSRF-TOKEN'] = token;
    } else if (xsrfCookie) {
        headers['X-XSRF-TOKEN'] = xsrfCookie.replace(/^"(.*)"$/, '$1');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/admin/files/upload', {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || 'File upload failed');
    }

    const data = (await res.json()) as { success?: boolean; url?: string; message?: string };
    if (data.success && data.url) return data.url;
    throw new Error(data.message || 'Upload failed');
}
