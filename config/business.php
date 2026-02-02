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

];
