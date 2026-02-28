<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionPlanItem extends Model
{
    protected $fillable = [
        'subscription_plan_id',
        'product_id',
        'units',
        'total_price',
        'per_unit_price',
    ];

    protected $casts = [
        'units' => 'integer',
        'total_price' => 'decimal:2',
        'per_unit_price' => 'decimal:2',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
