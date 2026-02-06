<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrackingEvent extends Model
{
    use HasFactory;

    // Standard E-commerce Events
    public const EVENT_VIEW_ITEM = 'view_item';

    public const EVENT_ADD_TO_CART = 'add_to_cart';

    public const EVENT_REMOVE_FROM_CART = 'remove_from_cart';

    public const EVENT_VIEW_CART = 'view_cart';

    public const EVENT_BEGIN_CHECKOUT = 'begin_checkout';

    public const EVENT_ADD_PAYMENT_INFO = 'add_payment_info';

    public const EVENT_PURCHASE = 'purchase';

    public const EVENT_SUBSCRIBE = 'subscribe';

    public const EVENT_SEARCH = 'search';

    public const EVENT_PAGE_VIEW = 'page_view';

    public const EVENT_LOGIN = 'login';

    public const EVENT_SIGNUP = 'signup';

    // Categories
    public const CATEGORY_ECOMMERCE = 'ecommerce';

    public const CATEGORY_ENGAGEMENT = 'engagement';

    public const CATEGORY_AUTHENTICATION = 'authentication';

    public const CATEGORY_SUBSCRIPTION = 'subscription';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'session_id',
        'event_name',
        'event_category',
        'event_action',
        'event_label',
        'event_value',
        'properties',
        'page_url',
        'page_title',
        'referrer',
        'user_agent',
        'ip_address',
        'device_type',
        'browser',
        'os',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'event_value' => 'decimal:2',
            'properties' => 'array',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes

    public function scopeByEvent($query, string $eventName)
    {
        return $query->where('event_name', $eventName);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('event_category', $category);
    }

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeBySession($query, string $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    public function scopeByDate($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->where('created_at', '>=', now()->startOfWeek());
    }

    public function scopeThisMonth($query)
    {
        return $query->where('created_at', '>=', now()->startOfMonth());
    }

    public function scopeEcommerce($query)
    {
        return $query->where('event_category', self::CATEGORY_ECOMMERCE);
    }

    // Helper Methods

    public function getDeviceInfo(): array
    {
        return [
            'device_type' => $this->device_type,
            'browser' => $this->browser,
            'os' => $this->os,
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function eventOptions(): array
    {
        return [
            self::EVENT_PAGE_VIEW => 'Page View',
            self::EVENT_VIEW_ITEM => 'View Item',
            self::EVENT_ADD_TO_CART => 'Add to Cart',
            self::EVENT_REMOVE_FROM_CART => 'Remove from Cart',
            self::EVENT_VIEW_CART => 'View Cart',
            self::EVENT_BEGIN_CHECKOUT => 'Begin Checkout',
            self::EVENT_ADD_PAYMENT_INFO => 'Add Payment Info',
            self::EVENT_PURCHASE => 'Purchase',
            self::EVENT_SUBSCRIBE => 'Subscribe',
            self::EVENT_SEARCH => 'Search',
            self::EVENT_LOGIN => 'Login',
            self::EVENT_SIGNUP => 'Sign Up',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function categoryOptions(): array
    {
        return [
            self::CATEGORY_ECOMMERCE => 'E-commerce',
            self::CATEGORY_ENGAGEMENT => 'Engagement',
            self::CATEGORY_AUTHENTICATION => 'Authentication',
            self::CATEGORY_SUBSCRIPTION => 'Subscription',
        ];
    }
}
