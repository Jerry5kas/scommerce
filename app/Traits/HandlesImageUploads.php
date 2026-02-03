<?php

namespace App\Traits;

use App\Jobs\DeleteImagekitFile;
use App\Services\ImageService;
use Illuminate\Http\UploadedFile;

trait HandlesImageUploads
{
    /**
     * Handle image upload - uploads file to ImageKit if provided, otherwise uses URL
     *
     * @return string|null ImageKit URL
     */
    protected function handleImageUpload(?string $url = null, ?UploadedFile $file = null, string $folder = 'images'): ?string
    {
        // If file is provided, upload to ImageKit
        if ($file !== null) {
            $imageService = app(ImageService::class);
            $result = $imageService->uploadImage($file, $folder);

            return $result['url'];
        }

        // Otherwise, use provided URL (validate it's an ImageKit URL or external URL)
        if ($url !== null && $url !== '') {
            return $url;
        }

        return null;
    }

    /**
     * Handle multiple image uploads
     *
     * @param  array<int, string>|null  $urls
     * @param  array<int, UploadedFile>|null  $files
     * @return array<int, string>
     */
    protected function handleMultipleImageUploads(?array $urls = null, ?array $files = null, string $folder = 'images'): array
    {
        $imageService = app(ImageService::class);
        $uploadedUrls = [];

        // Upload files to ImageKit
        if ($files !== null && count($files) > 0) {
            $results = $imageService->uploadMultiple($files, $folder);
            foreach ($results as $result) {
                $uploadedUrls[] = $result['url'];
            }
        }

        // Add URLs (validate they're ImageKit URLs or external URLs)
        if ($urls !== null && count($urls) > 0) {
            foreach ($urls as $url) {
                if ($url !== null && $url !== '') {
                    $uploadedUrls[] = $url;
                }
            }
        }

        return $uploadedUrls;
    }

    /**
     * Delete old image from ImageKit if it's an ImageKit URL
     * Uses queue for async deletion to improve response time
     */
    protected function deleteOldImage(?string $oldImageUrl, bool $async = true): void
    {
        if ($oldImageUrl === null || $oldImageUrl === '') {
            return;
        }

        $urlEndpoint = config('imagekit.url_endpoint');

        // Only delete if it's an ImageKit URL
        if (! str_starts_with($oldImageUrl, $urlEndpoint)) {
            \Log::debug('Skipping deletion - not an ImageKit URL', ['url' => $oldImageUrl]);

            return;
        }

        if ($async) {
            // Queue the deletion for background processing (faster response)
            \Log::debug('Queueing ImageKit image deletion', ['url' => $oldImageUrl]);
            DeleteImagekitFile::dispatch($oldImageUrl);
        } else {
            // Synchronous deletion (for immediate cleanup if needed)
            $imageService = app(ImageService::class);
            \Log::debug('Deleting ImageKit image synchronously', ['url' => $oldImageUrl]);
            $deleted = $imageService->deleteImageByUrl($oldImageUrl);
            if ($deleted) {
                \Log::debug('ImageKit image deleted successfully', ['url' => $oldImageUrl]);
            } else {
                \Log::warning('Failed to delete ImageKit image', ['url' => $oldImageUrl]);
            }
        }
    }
}
