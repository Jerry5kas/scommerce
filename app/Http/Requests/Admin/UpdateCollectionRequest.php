<?php

namespace App\Http\Requests\Admin;

use App\Enums\BusinessVertical;
use App\Models\Collection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCollectionRequest extends FormRequest
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
        $collection = $this->route('collection');
        $verticals = array_merge(BusinessVertical::values(), [Collection::VERTICAL_BOTH]);

        return [
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('collections', 'name')->ignore($collection->id)],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('collections', 'slug')->ignore($collection->id)],
            'description' => ['nullable', 'string', 'max:2000'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'banner_image' => ['sometimes', 'string', 'max:500'],
            'banner_mobile_image' => ['nullable', 'string', 'max:500'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'vertical' => ['nullable', 'string', Rule::in($verticals)],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'link_url' => ['nullable', 'string', 'max:500'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
