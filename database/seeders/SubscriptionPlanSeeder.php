<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Daily Delivery',
                'slug' => 'daily',
                'description' => 'Fresh products delivered every single day. Perfect for daily milk and dairy needs.',
                'frequency_type' => SubscriptionPlan::FREQUENCY_DAILY,
                'frequency_value' => null,
                'days_of_week' => null,
                'discount_percent' => 5.00,
                'min_deliveries' => null,
                'is_active' => true,
                'display_order' => 1,
            ],
            [
                'name' => 'Alternate Days',
                'slug' => 'alternate-days',
                'description' => 'Delivery every alternate day. Ideal for smaller households or products with longer shelf life.',
                'frequency_type' => SubscriptionPlan::FREQUENCY_ALTERNATE_DAYS,
                'frequency_value' => null,
                'days_of_week' => null,
                'discount_percent' => 3.00,
                'min_deliveries' => null,
                'is_active' => true,
                'display_order' => 2,
            ],
            [
                'name' => 'Weekdays Only',
                'slug' => 'weekdays',
                'description' => 'Delivery Monday through Friday. Skip weekends and enjoy a break.',
                'frequency_type' => SubscriptionPlan::FREQUENCY_WEEKLY,
                'frequency_value' => null,
                'days_of_week' => [1, 2, 3, 4, 5], // Mon-Fri
                'discount_percent' => 4.00,
                'min_deliveries' => null,
                'is_active' => true,
                'display_order' => 3,
            ],
            [
                'name' => 'Weekends Only',
                'slug' => 'weekends',
                'description' => 'Delivery on Saturday and Sunday only. Perfect for weekend specials.',
                'frequency_type' => SubscriptionPlan::FREQUENCY_WEEKLY,
                'frequency_value' => null,
                'days_of_week' => [0, 6], // Sat-Sun
                'discount_percent' => 2.00,
                'min_deliveries' => null,
                'is_active' => true,
                'display_order' => 4,
            ],
            [
                'name' => 'Every 3 Days',
                'slug' => 'every-3-days',
                'description' => 'Delivery once every 3 days. Great for items that need less frequent replenishment.',
                'frequency_type' => SubscriptionPlan::FREQUENCY_CUSTOM,
                'frequency_value' => 3,
                'days_of_week' => null,
                'discount_percent' => 2.50,
                'min_deliveries' => null,
                'is_active' => true,
                'display_order' => 5,
            ],
            [
                'name' => 'Weekly (Monday)',
                'slug' => 'weekly-monday',
                'description' => 'Once a week delivery on Mondays. Perfect for bulk items or pantry essentials.',
                'frequency_type' => SubscriptionPlan::FREQUENCY_WEEKLY,
                'frequency_value' => null,
                'days_of_week' => [1], // Monday only
                'discount_percent' => 7.00,
                'min_deliveries' => 4,
                'is_active' => true,
                'display_order' => 6,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }

        $this->command->info('Created '.count($plans).' subscription plans.');
    }
}
