<?php

namespace App\Enums;

enum BusinessVertical: string
{
    case DailyFresh = 'daily_fresh';
    case SocietyFresh = 'society_fresh';

    public function label(): string
    {
        return match ($this) {
            self::DailyFresh => 'Daily Fresh',
            self::SocietyFresh => 'Society Fresh',
        };
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        $out = [];
        foreach (self::cases() as $case) {
            $out[$case->value] = $case->label();
        }
        return $out;
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
