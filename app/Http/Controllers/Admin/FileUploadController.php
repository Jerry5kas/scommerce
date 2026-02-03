<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FileUploadController extends Controller
{
    public function __construct(
        private ImageService $imageService
    ) {}

    /**
     * Upload a single file
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file'],
            'folder' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $file = $request->file('file');
            $folder = $request->string('folder', 'uploads')->toString();

            $result = $this->imageService->uploadImage($file, $folder);

            return response()->json([
                'success' => true,
                'url' => $result['url'],
                'fileId' => $result['fileId'],
                'filePath' => $result['filePath'],
                'name' => $result['name'],
            ]);
        } catch (\RuntimeException $e) {
            Log::error('File upload error', [
                'error' => $e->getMessage(),
                'file' => $request->file('file')?->getClientOriginalName(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Upload multiple files
     */
    public function uploadMultiple(Request $request): JsonResponse
    {
        $request->validate([
            'files' => ['required', 'array', 'min:1', 'max:10'],
            'files.*' => ['required', 'file'],
            'folder' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $files = $request->file('files');
            $folder = $request->string('folder', 'uploads')->toString();

            $results = $this->imageService->uploadMultiple($files, $folder);

            return response()->json([
                'success' => true,
                'files' => $results,
            ]);
        } catch (\RuntimeException $e) {
            Log::error('Multiple file upload error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete a file
     */
    public function delete(Request $request): JsonResponse
    {
        $request->validate([
            'fileId' => ['required', 'string'],
        ]);

        $deleted = $this->imageService->deleteImage($request->string('fileId')->toString());

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to delete file.',
        ], 422);
    }

    /**
     * Delete file by URL
     */
    public function deleteByUrl(Request $request): JsonResponse
    {
        $request->validate([
            'url' => ['required', 'url'],
        ]);

        $deleted = $this->imageService->deleteImageByUrl($request->string('url')->toString());

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to delete file.',
        ], 422);
    }

    /**
     * Get transformed image URL
     */
    public function getTransformedUrl(Request $request): JsonResponse
    {
        $request->validate([
            'url' => ['required', 'url'],
            'width' => ['nullable', 'integer', 'min:1', 'max:5000'],
            'height' => ['nullable', 'integer', 'min:1', 'max:5000'],
            'quality' => ['nullable', 'integer', 'min:1', 'max:100'],
            'format' => ['nullable', 'string', 'in:auto,jpg,png,webp'],
        ]);

        $transformations = [];

        if ($request->has('width')) {
            $transformations['w'] = $request->integer('width');
        }

        if ($request->has('height')) {
            $transformations['h'] = $request->integer('height');
        }

        if ($request->has('quality')) {
            $transformations['q'] = $request->integer('quality');
        }

        if ($request->has('format')) {
            $transformations['f'] = $request->string('format')->toString();
        }

        $transformedUrl = $this->imageService->getTransformedUrl(
            $request->string('url')->toString(),
            $transformations
        );

        return response()->json([
            'success' => true,
            'url' => $transformedUrl,
        ]);
    }
}
