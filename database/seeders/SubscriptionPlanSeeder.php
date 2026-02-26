<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * The five features shown on every plan card on the home page.
     * Stored pipe-delimited so the front-end can split into a bullet list.
     */
    private const FEATURES = 'Daily Morning delivery|Free delivery|Pause/Resume anytime|Vacation hold|WhatsApp alerts';

    /**
     * Pricing reference (exact values from home.tsx SUBSCRIPTION_PLANS constant).
     *
     * MRP basis used for the "X% OFF" badge:
     *   480ml MRP = ₹80 / unit
     *   1L    MRP = ₹160 / unit
     *
     *  Plan          | 480ml p.u | 480ml total | 1L p.u | 1L total | discount badge
     *  15-Pack Plan  |  ₹42      |  ₹630       | ₹84    | ₹1,260   | —
     *  30-Packs Plan |  ₹41      |  ₹1,230     | ₹81    | ₹2,430   | 49% OFF
     *  90-Packs Plan |  ₹40      |  ₹3,600     | ₹80    | ₹7,200   | 50% OFF
     */
    public function run(): void
    {
        $plans = [

            // ── 1. 15-Pack Plan ── starter · no discount ───────────────────────
            [
                'name'             => '15-Pack Plan',
                'slug'             => '15-pack-plan',
                'description'      => 'Perfect starter plan — 15 days of fresh dairy delivered to your doorstep every morning before 7 AM. '
                    . 'No store visits, no missed mornings. '
                    . 'Features: ' . self::FEATURES,
                'frequency_type'   => SubscriptionPlan::FREQUENCY_DAILY,
                'frequency_value'  => null,
                'days_of_week'     => null,
                'discount_percent' => '0.00',
                'prices'           => [
                    '480ml' => [
                        'units'          => 15,
                        'price_per_unit' => 42.00,
                        'total_price'    => 630.00,
                        'mrp_per_unit'   => 80.00,
                    ],
                    '1L'    => [
                        'units'          => 15,
                        'price_per_unit' => 84.00,
                        'total_price'    => 1260.00,
                        'mrp_per_unit'   => 160.00,
                    ],
                ],
                'min_deliveries'   => 15,
                'is_active'        => true,
                'display_order'    => 1,
            ],

            // ── 2. 30-Packs Plan ── most popular · 49% OFF ─────────────────────
            [
                'name'             => '30-Packs Plan',
                'slug'             => '30-packs-plan',
                'description'      => 'Our most popular plan — 30 days of daily fresh dairy at 49% off the retail price. '
                    . 'Ideal for families who want consistent quality every single morning without the hassle. '
                    . 'Features: ' . self::FEATURES,
                'frequency_type'   => SubscriptionPlan::FREQUENCY_DAILY,
                'frequency_value'  => null,
                'days_of_week'     => null,
                'discount_percent' => '49.00',
                'prices'           => [
                    '480ml' => [
                        'units'          => 30,
                        'price_per_unit' => 41.00,
                        'total_price'    => 1230.00,
                        'mrp_per_unit'   => 80.00,
                    ],
                    '1L'    => [
                        'units'          => 30,
                        'price_per_unit' => 81.00,
                        'total_price'    => 2430.00,
                        'mrp_per_unit'   => 160.00,
                    ],
                ],
                'min_deliveries'   => 30,
                'is_active'        => true,
                'display_order'    => 2,
            ],

            // ── 3. 90-Packs Plan ── best value · 50% OFF ───────────────────────
            [
                'name'             => '90-Packs Plan',
                'slug'             => '90-packs-plan',
                'description'      => 'Maximum savings plan — 90 days of daily fresh dairy at our best-ever price with 50% off. '
                    . 'Best value for long-term subscribers who never want to run out of farm-fresh goodness. '
                    . 'Features: ' . self::FEATURES,
                'frequency_type'   => SubscriptionPlan::FREQUENCY_DAILY,
                'frequency_value'  => null,
                'days_of_week'     => null,
                'discount_percent' => '50.00',
                'prices'           => [
                    '480ml' => [
                        'units'          => 90,
                        'price_per_unit' => 40.00,
                        'total_price'    => 3600.00,
                        'mrp_per_unit'   => 80.00,
                    ],
                    '1L'    => [
                        'units'          => 90,
                        'price_per_unit' => 80.00,
                        'total_price'    => 7200.00,
                        'mrp_per_unit'   => 160.00,
                    ],
                ],
                'min_deliveries'   => 90,
                'is_active'        => true,
                'display_order'    => 3,
            ],
        ];

        foreach ($plans as $planData) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $planData['slug']],
                $planData
            );
        }

        $this->command->info('Seeded ' . count($plans) . ' subscription plans with variant pricing.');
    }
}
