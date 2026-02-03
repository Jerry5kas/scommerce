<?php

namespace App\Services;

use App\Models\ImagekitFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use ImageKit\ImageKit;
use ImageKit\ImageKitException;

class ImageService
{
    private ImageKit $imageKit;

    public function __construct()
    {
        $publicKey = config('imagekit.public_key');
        $privateKey = config('imagekit.private_key');
        $urlEndpoint = config('imagekit.url_endpoint');

        // Validate ImageKit configuration
        if (empty($publicKey) || empty($privateKey) || empty($urlEndpoint)) {
            Log::error('ImageKit configuration is missing', [
                'has_public_key' => ! empty($publicKey),
                'has_private_key' => ! empty($privateKey),
                'has_url_endpoint' => ! empty($urlEndpoint),
            ]);
            throw new \RuntimeException('ImageKit configuration is incomplete. Please check your .env file.');
        }

        $this->imageKit = new ImageKit(
            $publicKey,
            $privateKey,
            $urlEndpoint
        );
    }

    /**
     * Upload file to ImageKit
     *
     * @param  array<string, mixed>  $options
     * @return array{url: string, fileId: string, filePath: string}
     *
     * @throws \RuntimeException
     */
    public function uploadImage(UploadedFile $file, string $folder = 'images', array $options = []): array
    {
        // Validate file type
        if (! $this->isAllowedFileType($file)) {
            throw new \RuntimeException('File type not allowed.');
        }

        // Validate file size
        if ($file->getSize() > config('imagekit.max_file_size')) {
            throw new \RuntimeException('File size exceeds maximum allowed size.');
        }

        // Build folder path
        $folderPath = trim(config('imagekit.upload_folder').'/'.trim($folder, '/'), '/');

        // Check for duplicate file before uploading (by file hash in database)
        $fileHash = md5_file($file->getRealPath());
        $existingFile = ImagekitFile::where('file_hash', $fileHash)
            ->where('folder', $folderPath)
            ->first();

        if ($existingFile !== null) {
            Log::debug('Duplicate file detected, reusing existing', [
                'file_hash' => $fileHash,
                'existing_url' => $existingFile->url,
                'file_size' => $file->getSize(),
            ]);

            return [
                'url' => $existingFile->url,
                'fileId' => $existingFile->file_id,
                'filePath' => $existingFile->file_path,
                'name' => $existingFile->name,
                'size' => $existingFile->size,
                'mimeType' => $existingFile->mime_type,
            ];
        }

        // Generate unique filename
        $filename = $this->generateFilename($file);

        try {
            // Read file contents - ImageKit API expects base64 encoded file content
            $filePath = $file->getRealPath();

            // Validate file exists and is readable
            if (! file_exists($filePath) || ! is_readable($filePath)) {
                throw new \RuntimeException('File is not readable or does not exist.');
            }

            // Read file content in binary mode
            $fileContent = file_get_contents($filePath, false, null, 0, $file->getSize());

            if ($fileContent === false || strlen($fileContent) !== $file->getSize()) {
                Log::error('File read error', [
                    'expected_size' => $file->getSize(),
                    'actual_size' => $fileContent ? strlen($fileContent) : 0,
                ]);
                throw new \RuntimeException('Failed to read file correctly.');
            }

            // ImageKit API requires base64 encoded file content
            $base64File = base64_encode($fileContent);

            // Log file info for debugging
            Log::debug('ImageKit file upload', [
                'original_size' => $file->getSize(),
                'base64_size' => strlen($base64File),
                'mime_type' => $file->getMimeType(),
                'file_name' => $filename,
            ]);

            // Prepare upload options
            // ImageKit API expects base64 encoded file content
            $uploadOptions = array_merge([
                'file' => $base64File, // Base64 encoded file content
                'fileName' => $filename,
                'folder' => $folderPath,
                'useUniqueFileName' => config('imagekit.use_unique_filename', true),
                'isPrivateFile' => false,
            ], $options);

            // Upload to ImageKit
            $response = $this->imageKit->upload($uploadOptions);

            // ImageKit SDK v4 returns: { error: null, result: { fileId, url, filePath, name, ... }, responseMetadata: { statusCode: 200 } }
            // Check if upload was successful (error is null and result exists)
            if (is_object($response) && isset($response->error) && $response->error !== null) {
                $errorMessage = is_string($response->error) ? $response->error : (is_object($response->error) ? json_encode($response->error) : 'Unknown error');
                Log::error('ImageKit upload failed', [
                    'error' => $errorMessage,
                    'response' => (array) $response,
                    'file' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
                throw new \RuntimeException('Failed to upload file to ImageKit: '.$errorMessage);
            }

            // Extract result from response (ImageKit SDK v4 structure)
            $result = null;
            if (is_object($response)) {
                // ImageKit SDK v4 structure: response->result contains the file data
                $result = $response->result ?? null;
            } elseif (is_array($response)) {
                // Fallback for array structure
                $result = $response['result'] ?? $response;
            }

            // Validate result exists
            if ($result === null) {
                Log::error('ImageKit upload response missing result', [
                    'response' => is_object($response) ? (array) $response : $response,
                    'file' => $file->getClientOriginalName(),
                ]);
                throw new \RuntimeException('ImageKit upload response is missing result data.');
            }

            // Extract file data from result
            $url = is_object($result) ? ($result->url ?? null) : ($result['url'] ?? null);
            $fileId = is_object($result) ? ($result->fileId ?? null) : ($result['fileId'] ?? null);
            $filePath = is_object($result) ? ($result->filePath ?? null) : ($result['filePath'] ?? null);
            $name = is_object($result) ? ($result->name ?? null) : ($result['name'] ?? null);
            $size = is_object($result) ? ($result->size ?? null) : ($result['size'] ?? null);
            $mimeType = is_object($result) ? ($result->mimeType ?? null) : ($result['mimeType'] ?? null);

            // Validate required fields
            if ($url === null || $fileId === null) {
                Log::error('ImageKit upload result missing required fields', [
                    'result' => is_object($result) ? (array) $result : $result,
                    'has_url' => $url !== null,
                    'has_fileId' => $fileId !== null,
                ]);
                throw new \RuntimeException('ImageKit upload result is missing required fields (url or fileId).');
            }

            // Log successful upload for debugging
            $fileHash = md5_file($file->getRealPath());
            Log::debug('ImageKit upload successful', [
                'url' => $url,
                'fileId' => $fileId,
                'imagekit_size' => $size,
                'original_size' => $file->getSize(),
                'file_hash' => $fileHash,
            ]);

            // Store file metadata in database to prevent duplicates
            ImagekitFile::create([
                'file_hash' => $fileHash,
                'file_id' => $fileId,
                'url' => $url,
                'file_path' => $filePath ?? '',
                'name' => $name ?? $file->getClientOriginalName(),
                'size' => $size ?? $file->getSize(),
                'mime_type' => $mimeType ?? $file->getMimeType(),
                'folder' => $folderPath,
            ]);

            return [
                'url' => $url,
                'fileId' => $fileId,
                'filePath' => $filePath ?? '',
                'name' => $name ?? $file->getClientOriginalName(),
                'size' => $size ?? $file->getSize(),
                'mimeType' => $mimeType ?? $file->getMimeType(),
            ];
        } catch (ImageKitException $e) {
            Log::error('ImageKit upload error', [
                'error' => $e->getMessage(),
                'file' => $file->getClientOriginalName(),
            ]);
            throw new \RuntimeException('Failed to upload file: '.$e->getMessage());
        }
    }

    /**
     * Upload multiple files
     *
     * @param  array<int, UploadedFile>  $files
     * @return array<int, array{url: string, fileId: string, filePath: string}>
     */
    public function uploadMultiple(array $files, string $folder = 'images', array $options = []): array
    {
        $results = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $results[] = $this->uploadImage($file, $folder, $options);
            }
        }

        return $results;
    }

    /**
     * Delete file from ImageKit
     */
    public function deleteImage(string $fileId): bool
    {
        try {
            $response = $this->imageKit->deleteFile($fileId);

            // ImageKit SDK v4 returns: { error: null, result: {...}, responseMetadata: {...} }
            if (is_object($response)) {
                // Check if error is null (success) or if success property exists
                $hasError = isset($response->error) && $response->error !== null;
                $hasSuccess = isset($response->success) && $response->success === true;

                $success = ! $hasError || $hasSuccess;

                if ($success) {
                    Log::debug('ImageKit file deleted successfully', ['fileId' => $fileId]);
                    // Also delete from database
                    ImagekitFile::where('file_id', $fileId)->delete();
                } else {
                    Log::warning('ImageKit delete returned error', [
                        'fileId' => $fileId,
                        'error' => $response->error ?? 'Unknown error',
                    ]);
                }

                return $success;
            }

            return false;
        } catch (ImageKitException $e) {
            Log::error('ImageKit delete error', [
                'error' => $e->getMessage(),
                'fileId' => $fileId,
            ]);

            return false;
        }
    }

    /**
     * Delete file by URL (uses database to find fileId, then deletes)
     */
    public function deleteImageByUrl(string $url): bool
    {
        $urlEndpoint = config('imagekit.url_endpoint');
        if (! str_starts_with($url, $urlEndpoint)) {
            Log::debug('Skipping deletion - not an ImageKit URL', ['url' => $url]);

            return false;
        }

        // First, try to find fileId from database (exact URL or base URL without query params)
        $baseUrl = explode('?', $url)[0];
        $imagekitFile = ImagekitFile::where('url', $url)
            ->orWhere('url', $baseUrl)
            ->first();

        if ($imagekitFile !== null) {
            Log::debug('Found file in database, deleting by fileId', [
                'fileId' => $imagekitFile->file_id,
                'url' => $url,
            ]);

            $deleted = $this->deleteImage($imagekitFile->file_id);

            if ($deleted) {
                Log::debug('File deleted successfully using database lookup', ['url' => $url]);
            }

            return $deleted;
        }

        // Fallback: Try to extract fileId from URL path by listing files
        Log::debug('File not found in database, trying to find by listing files', ['url' => $url]);

        $filePath = str_replace($urlEndpoint, '', $url);
        $filePath = explode('?', $filePath)[0]; // Remove query params
        $filePath = ltrim($filePath, '/');

        try {
            $response = $this->imageKit->listFiles([
                'path' => dirname($filePath) !== '.' ? dirname($filePath) : '/',
                'limit' => 100,
            ]);

            // ImageKit SDK v4 response structure: { error: null, result: { data: [...] }, ... }
            $result = null;
            if (is_object($response)) {
                $result = $response->result ?? null;
            } elseif (is_array($response)) {
                $result = $response['result'] ?? $response;
            }

            // Extract data array
            $data = null;
            if (is_object($result)) {
                $data = $result->data ?? null;
            } elseif (is_array($result)) {
                $data = $result['data'] ?? null;
            }

            if ($data && (is_array($data) || (is_object($data) && isset($data->data)))) {
                $files = is_array($data) ? $data : (is_object($data) && isset($data->data) ? $data->data : []);
                $fileName = basename($filePath);

                Log::debug('Searching for file to delete', [
                    'fileName' => $fileName,
                    'filePath' => $filePath,
                    'files_count' => is_countable($files) ? count($files) : 0,
                ]);

                foreach ($files as $file) {
                    $filePathValue = is_object($file) ? ($file->filePath ?? null) : ($file['filePath'] ?? null);
                    $fileIdValue = is_object($file) ? ($file->fileId ?? null) : ($file['fileId'] ?? null);
                    $fileUrl = is_object($file) ? ($file->url ?? null) : ($file['url'] ?? null);

                    // Match by URL (most accurate) or by file path
                    if (($fileUrl && $fileUrl === $url) || ($filePathValue && str_ends_with($filePathValue, $fileName))) {
                        if ($fileIdValue) {
                            Log::debug('Found file to delete', [
                                'fileId' => $fileIdValue,
                                'filePath' => $filePathValue,
                                'url' => $url,
                            ]);

                            return $this->deleteImage($fileIdValue);
                        }
                    }
                }
            }

            Log::warning('File not found in ImageKit for deletion', [
                'url' => $url,
                'filePath' => $filePath,
            ]);
        } catch (ImageKitException $e) {
            Log::error('ImageKit delete by URL error', [
                'error' => $e->getMessage(),
                'url' => $url,
            ]);
        }

        return false;
    }

    /**
     * Get transformed image URL with ImageKit transformations
     *
     * @param  array<string, mixed>  $transformations
     */
    public function getTransformedUrl(string $url, array $transformations = []): string
    {
        if (empty($transformations)) {
            return $url;
        }

        // Build transformation query string
        $transformationString = $this->buildTransformationString($transformations);

        // If URL already has query params, append; otherwise add
        $separator = str_contains($url, '?') ? '&' : '?';

        return $url.$separator.'tr='.$transformationString;
    }

    /**
     * Resize image using ImageKit transformations
     *
     * @param  array{width?: int, height?: int, quality?: int, format?: string}  $dimensions
     */
    public function resizeImage(string $url, array $dimensions): string
    {
        $transformations = [];

        if (isset($dimensions['width'])) {
            $transformations['w'] = $dimensions['width'];
        }

        if (isset($dimensions['height'])) {
            $transformations['h'] = $dimensions['height'];
        }

        if (isset($dimensions['quality'])) {
            $transformations['q'] = $dimensions['quality'];
        } else {
            $transformations['q'] = config('imagekit.default_quality', 80);
        }

        if (isset($dimensions['format'])) {
            $transformations['f'] = $dimensions['format'];
        } elseif (config('imagekit.auto_format', true)) {
            $transformations['f'] = 'auto';
        }

        return $this->getTransformedUrl($url, $transformations);
    }

    /**
     * Get image URL with compression
     */
    public function getCompressedUrl(string $url, ?int $quality = null): string
    {
        $quality = $quality ?? config('imagekit.compression.quality', 80);

        return $this->getTransformedUrl($url, [
            'q' => $quality,
            'f' => 'auto',
        ]);
    }

    /**
     * Get thumbnail URL
     */
    public function getThumbnailUrl(string $url, int $width = 300, int $height = 300): string
    {
        return $this->resizeImage($url, [
            'width' => $width,
            'height' => $height,
            'quality' => 80,
            'format' => 'auto',
        ]);
    }

    /**
     * Get full URL for image path (CDN enabled)
     */
    public function getImageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        // If already a full URL (ImageKit URL), return as is
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        // If it's a file path, construct ImageKit URL
        $baseUrl = config('imagekit.cdn_enabled') ? config('imagekit.cdn_url') : config('imagekit.url_endpoint');

        return rtrim($baseUrl, '/').'/'.ltrim($path, '/');
    }

    /**
     * Check if file type is allowed
     */
    private function isAllowedFileType(UploadedFile $file): bool
    {
        $allowedTypes = config('imagekit.allowed_mime_types', []);

        return in_array($file->getMimeType(), $allowedTypes, true);
    }

    /**
     * Generate unique filename
     */
    private function generateFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $name);

        if (config('imagekit.use_unique_filename', true)) {
            return $name.'_'.time().'_'.uniqid().'.'.$extension;
        }

        return $name.'.'.$extension;
    }

    /**
     * Build transformation query string
     *
     * @param  array<string, mixed>  $transformations
     */
    private function buildTransformationString(array $transformations): string
    {
        $parts = [];

        foreach ($transformations as $key => $value) {
            $parts[] = $key.'-'.$value;
        }

        return implode(',', $parts);
    }

    /**
     * Get file details from ImageKit
     */
    public function getFileDetails(string $fileId): ?object
    {
        try {
            return $this->imageKit->getFileDetails($fileId);
        } catch (ImageKitException $e) {
            Log::error('ImageKit get file details error', [
                'error' => $e->getMessage(),
                'fileId' => $fileId,
            ]);

            return null;
        }
    }

    /**
     * List files from ImageKit
     *
     * @param  array<string, mixed>  $options
     * @return array<int, object>
     */
    public function listFiles(array $options = []): array
    {
        try {
            $response = $this->imageKit->listFiles($options);

            return $response->success ? ($response->data ?? []) : [];
        } catch (ImageKitException $e) {
            Log::error('ImageKit list files error', [
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }
}
