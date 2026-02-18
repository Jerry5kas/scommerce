<?php

namespace App\Http\Requests\Admin;

use App\Enums\BusinessVertical;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user('admin');
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('vertical') === false) {
            $this->merge(['vertical' => Product::VERTICAL_BOTH]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $verticals = array_merge(BusinessVertical::values(), [Product::VERTICAL_BOTH]);

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'collection_id' => ['nullable', 'integer', 'exists:collections,id'],
            'image' => ['nullable', 'string', 'max:500'],
            'image_file' => ['nullable', 'file', 'mimes:jpeg,jpg,png,gif,webp', 'max:10240'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'max:500'],
            'image_files' => ['nullable', 'array', 'max:10'],
            'image_files.*' => ['file', 'mimes:jpeg,jpg,png,gif,webp', 'max:10240'],
            'price' => ['required', 'numeric', 'min:0'],
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

        // Require either an image URL or an uploaded image file
        if ($this->isMethod('post') && ! $this->filled('image') && ! $this->hasFile('image_file')) {
            $rules['image'] = ['required', 'string', 'max:500'];
        }

        return $rules;
    }
}
