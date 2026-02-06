<?php

namespace App\Services;

use App\Models\Subscription;
use Carbon\Carbon;

class SubscriptionScheduleService
{
    /**
     * Calculate next delivery date for a subscription
     */
    public function calculateNextDeliveryDate(Subscription $subscription, ?Carbon $fromDate = null): Carbon
    {
        $fromDate ??= Carbon::today();
        $plan = $subscription->plan;

        if (! $plan) {
            return $fromDate->copy()->addDay();
        }

        $nextDate = $plan->getNextDeliveryDate($fromDate);

        // Skip vacation period
        while ($subscription->isOnVacation($nextDate)) {
            $nextDate = $plan->getNextDeliveryDate($nextDate);
        }

        // Skip past dates
        while ($nextDate->lt(Carbon::today())) {
            $nextDate = $plan->getNextDeliveryDate($nextDate);
        }

        return $nextDate;
    }

    /**
     * Get all delivery dates for a month
     *
     * @return array<string, array{date: string, is_vacation: bool, is_delivered: bool}>
     */
    public function getDeliveryDatesForMonth(Subscription $subscription, int $month, int $year): array
    {
        $plan = $subscription->plan;
        if (! $plan) {
            return [];
        }

        $dates = [];
        $startDate = $subscription->start_date;
        $monthStart = Carbon::create($year, $month, 1);
        $monthEnd = $monthStart->copy()->endOfMonth();

        // If subscription started after the month, no deliveries
        if ($startDate->gt($monthEnd)) {
            return [];
        }

        // Calculate deliveries for each day of the month
        $current = $monthStart->copy();
        if ($startDate->gt($current)) {
            $current = $startDate->copy();
        }

        while ($current->lte($monthEnd)) {
            if ($plan->isDeliveryDate($current, $startDate)) {
                $isVacation = $subscription->isOnVacation($current);
                $dateKey = $current->format('Y-m-d');

                $dates[$dateKey] = [
                    'date' => $dateKey,
                    'day' => $current->day,
                    'day_name' => $current->format('D'),
                    'is_vacation' => $isVacation,
                    'is_delivered' => $current->lt(Carbon::today()) && ! $isVacation,
                    'is_today' => $current->isToday(),
                    'is_future' => $current->gt(Carbon::today()),
                ];
            }
            $current->addDay();
        }

        return $dates;
    }

    /**
     * Check if a specific date is a delivery date
     */
    public function isDeliveryDate(Subscription $subscription, Carbon $date): bool
    {
        $plan = $subscription->plan;
        if (! $plan) {
            return false;
        }

        // Not a delivery date if on vacation
        if ($subscription->isOnVacation($date)) {
            return false;
        }

        // Not a delivery date if before subscription start
        if ($date->lt($subscription->start_date)) {
            return false;
        }

        // Check if it matches the plan schedule
        return $plan->isDeliveryDate($date, $subscription->start_date);
    }

    /**
     * Get complete schedule for a month with calendar data
     *
     * @return array{
     *     month: int,
     *     year: int,
     *     month_name: string,
     *     total_deliveries: int,
     *     vacation_days: int,
     *     days: array<array{date: string, day: int, is_delivery: bool, is_vacation: bool, is_today: bool}>
     * }
     */
    public function getScheduleForMonth(Subscription $subscription, int $month, int $year): array
    {
        $deliveryDates = $this->getDeliveryDatesForMonth($subscription, $month, $year);
        $monthStart = Carbon::create($year, $month, 1);
        $monthEnd = $monthStart->copy()->endOfMonth();

        $days = [];
        $current = $monthStart->copy();

        while ($current->lte($monthEnd)) {
            $dateKey = $current->format('Y-m-d');
            $isDelivery = isset($deliveryDates[$dateKey]);
            $isVacation = $isDelivery && $deliveryDates[$dateKey]['is_vacation'];

            $days[] = [
                'date' => $dateKey,
                'day' => $current->day,
                'day_of_week' => $current->dayOfWeek,
                'day_name' => $current->format('D'),
                'is_delivery' => $isDelivery && ! $isVacation,
                'is_vacation' => $isVacation,
                'is_today' => $current->isToday(),
                'is_past' => $current->lt(Carbon::today()),
            ];

            $current->addDay();
        }

        $totalDeliveries = collect($deliveryDates)->where('is_vacation', false)->count();
        $vacationDays = collect($deliveryDates)->where('is_vacation', true)->count();

        return [
            'month' => $month,
            'year' => $year,
            'month_name' => $monthStart->format('F'),
            'total_deliveries' => $totalDeliveries,
            'vacation_days' => $vacationDays,
            'days' => $days,
            'first_day_offset' => $monthStart->dayOfWeek,
        ];
    }

    /**
     * Get upcoming deliveries for a subscription
     *
     * @return array<array{date: string, day_name: string}>
     */
    public function getUpcomingDeliveries(Subscription $subscription, int $limit = 7): array
    {
        $plan = $subscription->plan;
        if (! $plan || $subscription->status !== Subscription::STATUS_ACTIVE) {
            return [];
        }

        $deliveries = [];
        $current = Carbon::today();
        $attempts = 0;
        $maxAttempts = 60; // Prevent infinite loop

        while (count($deliveries) < $limit && $attempts < $maxAttempts) {
            if ($this->isDeliveryDate($subscription, $current)) {
                $deliveries[] = [
                    'date' => $current->format('Y-m-d'),
                    'day_name' => $current->format('l'),
                    'formatted' => $current->format('M j, Y'),
                    'is_today' => $current->isToday(),
                ];
            }
            $current->addDay();
            $attempts++;
        }

        return $deliveries;
    }

    /**
     * Count deliveries in a date range
     */
    public function countDeliveriesInRange(Subscription $subscription, Carbon $start, Carbon $end): int
    {
        $count = 0;
        $current = $start->copy();

        while ($current->lte($end)) {
            if ($this->isDeliveryDate($subscription, $current)) {
                $count++;
            }
            $current->addDay();
        }

        return $count;
    }
}
