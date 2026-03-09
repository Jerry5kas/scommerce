<?php

namespace App\Console\Commands;

use App\Services\SubscriptionPaymentService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessSubscriptionPayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:process-payments
                            {--date= : Process payments due up to this date (defaults to now)}
                            {--retry-only : Process only failed payments that are due for retry}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process subscription order payments and retries using wallet balance';

    /**
     * Execute the console command.
     */
    public function handle(SubscriptionPaymentService $subscriptionPaymentService): int
    {
        $dateOption = $this->option('date');
        $retryOnly = (bool) $this->option('retry-only');
        $asOf = $dateOption ? Carbon::parse($dateOption) : now();

        $this->info('Processing subscription payments up to: '.$asOf->format('Y-m-d H:i:s'));
        if ($retryOnly) {
            $this->info('Mode: retry-only');
        }

        $result = $subscriptionPaymentService->processDuePayments($asOf, $retryOnly);

        $this->info("Processed: {$result['processed']}");
        $this->info("Paid: {$result['paid']}");
        $this->info("Retry scheduled: {$result['retry_scheduled']}");
        $this->info("Paused: {$result['paused']}");

        if (! empty($result['errors'])) {
            foreach ($result['errors'] as $error) {
                $this->error($error);
            }

            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
