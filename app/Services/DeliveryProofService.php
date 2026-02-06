<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Delivery;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DeliveryProofService
{
    protected string $disk = 'public';

    protected string $directory = 'delivery-proofs';

    protected int $maxFileSize = 10240; // 10MB in KB

    /**
     * @var array<string>
     */
    protected array $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

    protected int $maxWidth = 2048;

    protected int $maxHeight = 2048;

    /**
     * Validate proof image
     *
     * @return array{valid: bool, error?: string}
     */
    public function validateProofImage(UploadedFile $image): array
    {
        // Check file size
        if ($image->getSize() > ($this->maxFileSize * 1024)) {
            return ['valid' => false, 'error' => 'Image size exceeds maximum allowed size.'];
        }

        // Check MIME type
        if (! in_array($image->getMimeType(), $this->allowedMimes, true)) {
            return ['valid' => false, 'error' => 'Invalid image format. Allowed: JPEG, PNG, WebP.'];
        }

        // Check if it's a valid image
        $imageInfo = @getimagesize($image->getPathname());
        if ($imageInfo === false) {
            return ['valid' => false, 'error' => 'Invalid image file.'];
        }

        return ['valid' => true];
    }

    /**
     * Upload proof image
     *
     * @return array{success: bool, path?: string, url?: string, error?: string}
     */
    public function uploadProof(Delivery $delivery, UploadedFile $image): array
    {
        // Validate image
        $validation = $this->validateProofImage($image);
        if (! $validation['valid']) {
            return ['success' => false, 'error' => $validation['error']];
        }

        try {
            // Generate filename
            $filename = sprintf(
                '%s_%s_%s.%s',
                $delivery->id,
                $delivery->order->order_number,
                Str::random(8),
                $image->getClientOriginalExtension()
            );

            $path = "{$this->directory}/{$delivery->scheduled_date->format('Y/m/d')}/{$filename}";

            // Store the image
            Storage::disk($this->disk)->put($path, file_get_contents($image->getPathname()));

            // Get the public URL
            $url = Storage::disk($this->disk)->url($path);

            Log::info('Delivery proof uploaded', [
                'delivery_id' => $delivery->id,
                'path' => $path,
            ]);

            return [
                'success' => true,
                'path' => $path,
                'url' => $url,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to upload delivery proof', [
                'delivery_id' => $delivery->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to upload image.'];
        }
    }

    /**
     * Complete delivery with proof
     *
     * @return array{success: bool, delivery?: Delivery, error?: string}
     */
    public function completeDeliveryWithProof(Delivery $delivery, UploadedFile $image): array
    {
        if ($delivery->status !== Delivery::STATUS_OUT_FOR_DELIVERY) {
            return ['success' => false, 'error' => 'Delivery must be out for delivery to complete.'];
        }

        // Upload proof
        $uploadResult = $this->uploadProof($delivery, $image);
        if (! $uploadResult['success']) {
            return ['success' => false, 'error' => $uploadResult['error']];
        }

        try {
            // Mark as delivered with proof
            $delivery->markAsDelivered($uploadResult['path']);

            return [
                'success' => true,
                'delivery' => $delivery->fresh(),
            ];
        } catch (\Exception $e) {
            // Delete uploaded image if delivery update fails
            $this->deleteImage($uploadResult['path']);

            Log::error('Failed to complete delivery', [
                'delivery_id' => $delivery->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to complete delivery.'];
        }
    }

    /**
     * Verify proof by admin
     *
     * @return array{success: bool, error?: string}
     */
    public function verifyProof(Delivery $delivery, Admin $admin): array
    {
        if (! $delivery->hasProof()) {
            return ['success' => false, 'error' => 'No proof image to verify.'];
        }

        if ($delivery->isProofVerified()) {
            return ['success' => false, 'error' => 'Proof already verified.'];
        }

        try {
            $delivery->verifyProof($admin);

            Log::info('Delivery proof verified', [
                'delivery_id' => $delivery->id,
                'verified_by' => $admin->id,
            ]);

            return ['success' => true];
        } catch (\Exception $e) {
            Log::error('Failed to verify proof', [
                'delivery_id' => $delivery->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to verify proof.'];
        }
    }

    /**
     * Override proof requirement (admin only, with logging)
     *
     * @return array{success: bool, error?: string}
     */
    public function overrideProofRequirement(Delivery $delivery, Admin $admin, string $reason): array
    {
        if ($delivery->status !== Delivery::STATUS_OUT_FOR_DELIVERY) {
            return ['success' => false, 'error' => 'Delivery must be out for delivery.'];
        }

        try {
            $delivery->update([
                'status' => Delivery::STATUS_DELIVERED,
                'delivered_at' => now(),
                'delivery_proof_verified' => true,
                'delivery_proof_verified_by' => $admin->id,
                'delivery_proof_verified_at' => now(),
                'notes' => "PROOF OVERRIDE: {$reason} (by Admin #{$admin->id})",
            ]);

            // Update order
            $delivery->order->markAsDelivered();

            Log::warning('Delivery proof requirement overridden', [
                'delivery_id' => $delivery->id,
                'admin_id' => $admin->id,
                'reason' => $reason,
            ]);

            return ['success' => true];
        } catch (\Exception $e) {
            Log::error('Failed to override proof', [
                'delivery_id' => $delivery->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to override proof requirement.'];
        }
    }

    /**
     * Delete proof image
     */
    public function deleteImage(string $path): bool
    {
        try {
            return Storage::disk($this->disk)->delete($path);
        } catch (\Exception $e) {
            Log::error('Failed to delete proof image', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Get proof URL
     */
    public function getProofUrl(Delivery $delivery): ?string
    {
        if (! $delivery->delivery_proof_image) {
            return null;
        }

        return Storage::disk($this->disk)->url($delivery->delivery_proof_image);
    }

    /**
     * Check if proof is required for delivery
     */
    public function requiresProof(Delivery $delivery): bool
    {
        // Proof is ALWAYS required for completion - this is critical
        return true;
    }
}
