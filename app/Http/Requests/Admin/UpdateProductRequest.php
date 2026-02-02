<?php

namespace App\Http\Requests\Admin;

use App\Enums\BusinessVertical;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user('admin');
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $product = $this->route('product');
        $verticals = array_merge(BusinessVertical::values(), [Product::VERTICAL_BOTH]);

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($product->id)],
            'sku' => ['sometimes', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product->id)],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'collection_id' => ['nullable', 'integer', 'exists:collections,id'],
            'image' => ['sometimes', 'string', 'max:500'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'max:500'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'cost_price' => ['nullable', 'numeric', 'min:0'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'is_in_stock' => ['sometimes', 'boolean'],
            'is_subscription_eligible' => ['sometimes', 'boolean'],
            'requires_bottle' => ['sometimes', 'boolean'],
            'bottle_deposit' => ['nullable', 'numeric', 'min:0'],
            'is_one_time_purchase' => ['sometimes', 'boolean'],
            'min_quantity' => ['nullable', 'integer', 'min:1'],
            'max_quantity' => ['nullable', 'integer', 'min:1'],
            'unit' => ['nullable', 'string', 'max:50'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'vertical' => ['nullable', 'string', Rule::in($verticals)],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
