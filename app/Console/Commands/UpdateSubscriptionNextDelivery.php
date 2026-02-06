<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Services\SubscriptionScheduleService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateSubscriptionNextDelivery extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:update-next-delivery
                            {--id= : Update a specific subscription ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update next_delivery_date for all active subscriptions';

    /**
     * Execute the console command.
     */
    public function handle(SubscriptionScheduleService $scheduleService): int
    {
        $subscriptionId = $this->option('id');

        $query = Subscription::query()->active();

        if ($subscriptionId) {
            $query->where('id', $subscriptionId);
        }

        $subscriptions = $query->with('plan')->get();

        if ($subscriptions->isEmpty()) {
            $this->info('No active subscriptions found.');

            return Command::SUCCESS;
        }

        $this->info("Updating {$subscriptions->count()} subscription(s)...");

        $updated = 0;
        $today = Carbon::today();

        foreach ($subscriptions as $subscription) {
            $currentNext = $subscription->next_delivery_date;
            $newNext = $scheduleService->calculateNextDeliveryDate($subscription, $today);

            // Only update if the new date is different
            if (! $currentNext || ! $currentNext->eq($newNext)) {
                $subscription->next_delivery_date = $newNext;
                $subscription->save();
                $updated++;

                $currentFormatted = $currentNext ? $currentNext->format('Y-m-d') : 'null';
                $this->line("Subscription #{$subscription->id}: {$currentFormatted} → {$newNext->format('Y-m-d')}");
            }
        }

        $this->info("Updated {$updated} subscription(s).");

        return Command::SUCCESS;
    }
}
