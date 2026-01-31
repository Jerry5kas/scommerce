<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class ThemeSetting extends Model
{
    protected $fillable = ['key', 'value'];

    /** @var array<string, string>|null */
    protected static ?array $cache = null;

    /**
     * @return array{primary_1: string, primary_2: string, secondary: string, tertiary: string}
     */
    public static function getTheme(): array
    {
        if (self::$cache !== null) {
            return self::$cache;
        }

        $defaults = [
            'primary_1' => '#45AE96',
            'primary_2' => '#46ae97',
            'secondary' => '#c4f5ea',
            'tertiary' => '#cf992c',
        ];

        try {
            if (! Schema::hasTable('theme_settings')) {
                self::$cache = $defaults;

                return self::$cache;
            }

            $rows = self::query()
                ->whereIn('key', array_keys($defaults))
                ->pluck('value', 'key');

            self::$cache = [
                'primary_1' => $rows->get('primary_1', $defaults['primary_1']),
                'primary_2' => $rows->get('primary_2', $defaults['primary_2']),
                'secondary' => $rows->get('secondary', $defaults['secondary']),
                'tertiary' => $rows->get('tertiary', $defaults['tertiary']),
            ];
        } catch (\Throwable) {
            self::$cache = $defaults;
        }

        return self::$cache;
    }

    public static function clearCache(): void
    {
        self::$cache = null;
    }
}
