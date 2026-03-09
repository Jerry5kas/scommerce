<?php

use App\Enums\BusinessVertical;

return [

    /*
    |--------------------------------------------------------------------------
    | Business Verticals
    |--------------------------------------------------------------------------
    |
    | Freshtick operates two verticals: Daily Fresh (quick commerce) and
    | Society Fresh (scheduled commerce). Used across zones, catalog, orders.
    |
    */

    'verticals' => [
        BusinessVertical::DailyFresh->value => [
            'label' => 'Daily Fresh',
            'slug' => 'daily-fresh',
            'description' => 'Quick commerce — fast delivery, on-demand orders.',
        ],
        BusinessVertical::SocietyFresh->value => [
            'label' => 'Society Fresh',
            'slug' => 'society-fresh',
            'description' => 'Scheduled commerce — subscription, fixed delivery slots.',
        ],
    ],

    'vertical_values' => BusinessVertical::values(),

    /*
    |--------------------------------------------------------------------------
    | Delivery Cutoff
    |--------------------------------------------------------------------------
    |
    | Orders added before this time are eligible for next-day delivery.
    | After cutoff, the next available slot shifts by one additional day.
    |
    */

    'next_day_cutoff_time' => env('NEXT_DAY_DELIVERY_CUTOFF', '22:30'),

];
