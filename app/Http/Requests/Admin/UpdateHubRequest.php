<?php

namespace App\Http\Requests\Admin;

use App\Enums\BusinessVertical;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHubRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user('admin');
    }

    protected function prepareForValidation(): void
    {
        $verticals = $this->input('verticals');
        if (is_array($verticals)) {
            $this->merge(['verticals' => array_values(array_intersect($verticals, BusinessVertical::values()))]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('hubs')->ignore($this->route('hub'))],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['sometimes', 'boolean'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'verticals' => ['nullable', 'array'],
            'verticals.*' => ['string', Rule::in(BusinessVertical::values())],
        ];
    }
}
