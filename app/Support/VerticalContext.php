<?php

namespace App\Support;

use App\Enums\BusinessVertical;
use Illuminate\Http\Request;

class VerticalContext
{
    public static function current(Request $request, string $default = BusinessVertical::DailyFresh->value): string
    {
        $requestedVertical = $request->string('vertical')->toString();

        if (in_array($requestedVertical, BusinessVertical::values(), true)) {
            $request->session()->put('vertical', $requestedVertical);

            return $requestedVertical;
        }

        $sessionVertical = (string) $request->session()->get('vertical', '');
        if (in_array($sessionVertical, BusinessVertical::values(), true)) {
            return $sessionVertical;
        }

        $resolvedDefault = in_array($default, BusinessVertical::values(), true)
            ? $default
            : BusinessVertical::DailyFresh->value;

        $request->session()->put('vertical', $resolvedDefault);

        return $resolvedDefault;
    }
}
