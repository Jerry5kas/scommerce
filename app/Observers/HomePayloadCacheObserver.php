<?php

namespace App\Observers;

use App\Support\HomePayloadCache;

class HomePayloadCacheObserver
{
    public function saved(object $model): void
    {
        HomePayloadCache::forgetAll();
    }

    public function deleted(object $model): void
    {
        HomePayloadCache::forgetAll();
    }

    public function restored(object $model): void
    {
        HomePayloadCache::forgetAll();
    }

    public function forceDeleted(object $model): void
    {
        HomePayloadCache::forgetAll();
    }
}
