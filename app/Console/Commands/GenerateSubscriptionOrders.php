<?php

namespace App\Console\Commands;

use App\Services\SubscriptionOrderService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateSubscriptionOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:generate-orders
                            {--date= : The date to generate orders for (defaults to today)}
                            {--preview : Preview orders without generating them}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate orders from active subscriptions due for delivery';

    /**
     * Execute the console command.
     */
    public function handle(SubscriptionOrderService $orderService): int
    {
        $dateOption = $this->option('date');
        $date = $dateOption ? Carbon::parse($dateOption) : Carbon::today();
        $preview = $this->option('preview');

        $this->info("Processing subscriptions for: {$date->format('Y-m-d')}");

        if ($preview) {
            $this->info('Preview mode - no orders will be generated.');
            $preview = $orderService->previewOrdersForDate($date);

            if (empty($preview)) {
                $this->info('No subscriptions due for delivery on this date.');

                return Command::SUCCESS;
            }

            $this->table(
                ['Subscription ID', 'User', 'Address', 'Items', 'Total'],
                collect($preview)->map(fn ($p) => [
                    $p['subscription_id'],
                    $p['user_name'],
                    $p['address'],
                    $p['items_count'],
                    '₹'.number_format($p['total'], 2),
                ])->toArray()
            );

            $this->info('Total orders to generate: '.count($preview));
            $this->info('Total value: ₹'.number_format(collect($preview)->sum('total'), 2));

            return Command::SUCCESS;
        }

        $results = $orderService->generateOrdersForDate($date);

        $this->info("Processed: {$results['processed']}");
        $this->info("Success: {$results['success']}");

        if ($results['failed'] > 0) {
            $this->warn("Failed: {$results['failed']}");
            foreach ($results['errors'] as $error) {
                $this->error($error);
            }

            return Command::FAILURE;
        }

        $this->info('Order generation completed successfully.');

        return Command::SUCCESS;
    }
}
