<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'session_id',
        'coupon_code',
        'coupon_id',
        'subtotal',
        'discount',
        'delivery_charge',
        'total',
        'currency',
        'expires_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'delivery_charge' => 'decimal:2',
            'total' => 'decimal:2',
            'expires_at' => 'datetime',
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<CartItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    // ─────────────────────────────────────────────────────────────
    // Scopes
    // ─────────────────────────────────────────────────────────────

    /**
     * @param  Builder<Cart>  $query
     * @return Builder<Cart>
     */
    public function scopeNotExpired(Builder $query): Builder
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
                ->orWhere('expires_at', '>', Carbon::now());
        });
    }

    /**
     * @param  Builder<Cart>  $query
     * @return Builder<Cart>
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * @param  Builder<Cart>  $query
     * @return Builder<Cart>
     */
    public function scopeForSession(Builder $query, string $sessionId): Builder
    {
        return $query->where('session_id', $sessionId);
    }

    // ─────────────────────────────────────────────────────────────
    // Helper Methods
    // ─────────────────────────────────────────────────────────────

    /**
     * Calculate and update cart totals
     */
    public function calculateTotals(): self
    {
        $items = $this->items()->with('product')->get();

        $subtotal = $items->sum(fn ($item) => $item->subtotal);

        $this->subtotal = $subtotal;
        $this->total = $subtotal - $this->discount + $this->delivery_charge;
        $this->save();

        return $this;
    }

    /**
     * Check if cart is empty
     */
    public function isEmpty(): bool
    {
        return $this->items()->count() === 0;
    }

    /**
     * Get item count
     */
    public function itemCount(): int
    {
        return $this->items()->sum('quantity');
    }

    /**
     * Clear all cart items
     */
    public function clear(): self
    {
        $this->items()->delete();
        $this->subtotal = 0;
        $this->discount = 0;
        $this->total = 0;
        $this->coupon_code = null;
        $this->coupon_id = null;
        $this->save();

        return $this;
    }

    /**
     * Check if cart has expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Set cart expiration
     */
    public function setExpiration(int $days = 7): self
    {
        $this->expires_at = Carbon::now()->addDays($days);
        $this->save();

        return $this;
    }

    /**
     * Get items by vertical
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, CartItem>
     */
    public function getItemsByVertical(string $vertical): \Illuminate\Database\Eloquent\Collection
    {
        return $this->items()->where('vertical', $vertical)->get();
    }

    /**
     * Check if cart has items from both verticals
     */
    public function hasMultipleVerticals(): bool
    {
        return $this->items()->distinct('vertical')->count('vertical') > 1;
    }

    /**
     * Get verticals in cart
     *
     * @return array<string>
     */
    public function getVerticals(): array
    {
        return $this->items()->distinct()->pluck('vertical')->toArray();
    }
}
