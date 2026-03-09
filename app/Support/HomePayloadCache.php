<?php

namespace App\Support;

use App\Enums\BusinessVertical;
use App\Models\Collection;
use Closure;
use Illuminate\Support\Facades\Cache;

class HomePayloadCache
{
    private const FRESH_SECONDS = 60;

    private const STALE_SECONDS = 300;

    public static function remember(string $vertical, Closure $resolver): array
    {
        /** @var array<string, mixed> $payload */
        $payload = Cache::flexible(
            self::key($vertical),
            [self::FRESH_SECONDS, self::STALE_SECONDS],
            $resolver,
        );

        return $payload;
    }

    public static function forgetAll(): void
    {
        $cacheKeys = array_map(
            fn (string $vertical) => self::key($vertical),
            array_merge(BusinessVertical::values(), [Collection::VERTICAL_BOTH, 'all']),
        );

        foreach ($cacheKeys as $cacheKey) {
            Cache::forget($cacheKey);
        }
    }

    private static function key(string $vertical): string
    {
        return 'home:payload:v1:vertical:'.$vertical;
    }
}
