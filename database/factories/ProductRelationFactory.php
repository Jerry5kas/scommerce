<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductRelation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductRelationFactory extends Factory
{
    protected $model = ProductRelation::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'related_product_id' => Product::factory(),
            'relation_type' => ProductRelation::TYPE_CROSS_SELL,
            'display_order' => 0,
        ];
    }
}
