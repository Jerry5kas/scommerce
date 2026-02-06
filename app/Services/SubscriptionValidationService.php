<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Zone;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class SubscriptionValidationService
{
    public function __construct(
        private LocationService $locationService
    ) {}

    /**
     * Validate subscription creation
     *
     * @param  array<int, array{product_id: int, quantity: int}>  $products
     * @return array{valid: bool, errors: array<string>}
     */
    public function validateSubscriptionCreation(
        User $user,
        array $products,
        UserAddress $address,
        SubscriptionPlan $plan
    ): array {
        $errors = [];

        // Validate address serviceability
        $addressValidation = $this->validateAddressServiceability($address);
        if (! $addressValidation['valid']) {
            $errors = array_merge($errors, $addressValidation['errors']);
        }

        // Validate products availability
        $zone = $address->zone;
        if ($zone) {
            $productsValidation = $this->validateProductsAvailability($products, $zone);
            if (! $productsValidation['valid']) {
                $errors = array_merge($errors, $productsValidation['errors']);
            }
        }

        // Validate plan is active
        if (! $plan->is_active) {
            $errors[] = 'Selected subscription plan is not available.';
        }

        // Check if user already has an active subscription for same products
        $existingSubscription = $this->checkExistingSubscription($user, $products);
        if ($existingSubscription) {
            $errors[] = 'You already have an active subscription for some of these products.';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Validate subscription update
     *
     * @param  array<string, mixed>  $changes
     * @return array{valid: bool, errors: array<string>}
     */
    public function validateSubscriptionUpdate(Subscription $subscription, array $changes): array
    {
        $errors = [];

        // Check if subscription can be edited
        if (! $this->canEditSubscription($subscription)) {
            $errors[] = 'This subscription cannot be edited. Subscriptions can only be modified for current and previous month.';

            return [
                'valid' => false,
                'errors' => $errors,
            ];
        }

        // Check if subscription is cancelled
        if ($subscription->status === Subscription::STATUS_CANCELLED) {
            $errors[] = 'Cannot update a cancelled subscription.';

            return [
                'valid' => false,
                'errors' => $errors,
            ];
        }

        // Validate address change if provided
        if (isset($changes['user_address_id'])) {
            $address = UserAddress::find($changes['user_address_id']);
            if (! $address || $address->user_id !== $subscription->user_id) {
                $errors[] = 'Invalid delivery address.';
            } else {
                $addressValidation = $this->validateAddressServiceability($address);
                if (! $addressValidation['valid']) {
                    $errors = array_merge($errors, $addressValidation['errors']);
                }
            }
        }

        // Validate items change if provided
        if (isset($changes['items']) && is_array($changes['items'])) {
            $zone = $subscription->address->zone;
            if ($zone) {
                $productsValidation = $this->validateProductsAvailability($changes['items'], $zone);
                if (! $productsValidation['valid']) {
                    $errors = array_merge($errors, $productsValidation['errors']);
                }
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Check if subscription can be edited (current & previous month only)
     */
    public function canEditSubscription(Subscription $subscription): bool
    {
        // Cancelled subscriptions cannot be edited
        if ($subscription->status === Subscription::STATUS_CANCELLED) {
            return false;
        }

        $now = Carbon::now();
        $currentMonth = $now->copy()->startOfMonth();
        $previousMonth = $now->copy()->subMonth()->startOfMonth();

        // Subscription can be edited if it started in current or previous month
        // OR if next delivery is in current or future month
        return $subscription->start_date->gte($previousMonth) ||
               ($subscription->next_delivery_date && $subscription->next_delivery_date->gte($currentMonth));
    }

    /**
     * Validate products availability in zone
     *
     * @param  array<int, array{product_id: int, quantity: int}>  $products
     * @return array{valid: bool, errors: array<string>}
     */
    public function validateProductsAvailability(array $products, Zone $zone): array
    {
        $errors = [];

        foreach ($products as $item) {
            $product = Product::find($item['product_id']);

            if (! $product) {
                $errors[] = "Product #{$item['product_id']} not found.";

                continue;
            }

            if (! $product->is_active) {
                $errors[] = "Product '{$product->name}' is not available.";

                continue;
            }

            if (! $product->is_subscription_eligible) {
                $errors[] = "Product '{$product->name}' is not eligible for subscription.";

                continue;
            }

            if (! $product->isAvailableInZone($zone)) {
                $errors[] = "Product '{$product->name}' is not available in your delivery zone.";

                continue;
            }

            // Validate quantity
            if (isset($item['quantity'])) {
                if ($item['quantity'] < ($product->min_quantity ?? 1)) {
                    $errors[] = "Minimum quantity for '{$product->name}' is {$product->min_quantity}.";
                }

                if ($product->max_quantity && $item['quantity'] > $product->max_quantity) {
                    $errors[] = "Maximum quantity for '{$product->name}' is {$product->max_quantity}.";
                }
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Validate address serviceability
     *
     * @return array{valid: bool, errors: array<string>}
     */
    public function validateAddressServiceability(UserAddress $address): array
    {
        $errors = [];

        if (! $address->is_active) {
            $errors[] = 'Selected address is not active.';

            return [
                'valid' => false,
                'errors' => $errors,
            ];
        }

        if (! $address->zone_id) {
            // Try to auto-assign zone
            $address->autoAssignZone();
            $address->refresh();

            if (! $address->zone_id) {
                $errors[] = 'Delivery is not available at this address. Please update your pincode or address.';

                return [
                    'valid' => false,
                    'errors' => $errors,
                ];
            }
        }

        $zone = $address->zone;
        if (! $zone || ! $zone->is_active) {
            $errors[] = 'Delivery zone is not currently serviceable.';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Check if user has existing active subscription for products
     *
     * @param  array<int, array{product_id: int, quantity: int}>  $products
     */
    protected function checkExistingSubscription(User $user, array $products): ?Subscription
    {
        $productIds = array_column($products, 'product_id');

        return $user->subscriptions()
            ->active()
            ->whereHas('items', function ($query) use ($productIds) {
                $query->whereIn('product_id', $productIds)->where('is_active', true);
            })
            ->first();
    }

    /**
     * Get subscription-eligible products for a zone
     *
     * @return Collection<int, Product>
     */
    public function getEligibleProducts(Zone $zone): Collection
    {
        return Product::query()
            ->active()
            ->inStock()
            ->subscriptionEligible()
            ->whereHas('zones', function ($query) use ($zone) {
                $query->where('zones.id', $zone->id)
                    ->where('product_zones.is_available', true);
            })
            ->orderBy('display_order')
            ->get();
    }
}
