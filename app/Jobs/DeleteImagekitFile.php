<?php

namespace App\Jobs;

use App\Services\ImageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class DeleteImagekitFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private string $imageUrl
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ImageService $imageService): void
    {
        try {
            Log::debug('Queued: Deleting ImageKit file', ['url' => $this->imageUrl]);

            $deleted = $imageService->deleteImageByUrl($this->imageUrl);

            if ($deleted) {
                Log::debug('Queued: ImageKit file deleted successfully', ['url' => $this->imageUrl]);
            } else {
                Log::warning('Queued: Failed to delete ImageKit file', ['url' => $this->imageUrl]);
            }
        } catch (\Exception $e) {
            Log::error('Queued: Error deleting ImageKit file', [
                'url' => $this->imageUrl,
                'error' => $e->getMessage(),
            ]);

            // Re-throw to mark job as failed
            throw $e;
        }
    }
}
