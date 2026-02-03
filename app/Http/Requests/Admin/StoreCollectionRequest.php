<?php

namespace App\Http\Requests\Admin;

use App\Enums\BusinessVertical;
use App\Models\Collection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCollectionRequest extends FormRequest
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
        $verticals = array_merge(BusinessVertical::values(), [Collection::VERTICAL_BOTH]);

        $rules = [
            'name' => ['required', 'string', 'max:255', 'unique:collections,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:collections,slug'],
            'description' => ['nullable', 'string', 'max:2000'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'banner_image' => ['nullable', 'string', 'max:500'],
            'banner_image_file' => ['nullable', 'file', 'mimes:jpeg,jpg,png,gif,webp', 'max:10240'],
            'banner_mobile_image' => ['nullable', 'string', 'max:500'],
            'banner_mobile_image_file' => ['nullable', 'file', 'mimes:jpeg,jpg,png,gif,webp', 'max:10240'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'vertical' => ['nullable', 'string', Rule::in($verticals)],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'link_url' => ['nullable', 'string', 'max:500'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];

        // Require either banner_image or banner_image_file
        if (! $this->has('banner_image') && ! $this->hasFile('banner_image_file')) {
            $rules['banner_image'] = ['required', 'string', 'max:500'];
        }

        return $rules;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('vertical') === false) {
            $this->merge(['vertical' => Collection::VERTICAL_BOTH]);
        }
    }
}
