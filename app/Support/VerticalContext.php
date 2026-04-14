<?php

namespace App\Support;

use App\Enums\BusinessVertical;
use App\Models\Zone;
use Illuminate\Http\Request;

class VerticalContext
{
    public static function current(Request $request, string $default = BusinessVertical::DailyFresh->value, ?Zone $zone = null): string
    {
        $requestedVertical = $request->string('vertical')->toString();

        if (in_array($requestedVertical, BusinessVertical::values(), true)) {
            $request->session()->put('vertical', $requestedVertical);

            $resolved = $requestedVertical;
        } else {
            $sessionVertical = (string) $request->session()->get('vertical', '');
            if (in_array($sessionVertical, BusinessVertical::values(), true)) {
                $resolved = $sessionVertical;
            } else {
                $resolved = in_array($default, BusinessVertical::values(), true)
                    ? $default
                    : BusinessVertical::DailyFresh->value;

                $request->session()->put('vertical', $resolved);
            }
        }

        if ($zone !== null) {
            $supported = $zone->verticals ?? [];
            if (is_array($supported) && count($supported) > 0 && ! in_array($resolved, $supported, true)) {
                $resolved = $supported[0];
                $request->session()->put('vertical', $resolved);
            }
        }

        return $resolved;
    }
}
