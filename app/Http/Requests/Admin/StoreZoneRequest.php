<?php

namespace App\Http\Requests\Admin;

use App\Enums\BusinessVertical;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreZoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user('admin');
    }

    protected function prepareForValidation(): void
    {
        $pincodes = $this->input('pincodes');
        if (is_string($pincodes)) {
            $parsed = array_values(array_filter(array_map('trim', preg_split('/[\s,]+/', $pincodes))));
            $this->merge([
                'pincodes' => array_values(array_unique($parsed)),
            ]);
        }
        $boundary = $this->input('boundary_coordinates');
        if (is_string($boundary) && $boundary !== '') {
            $decoded = json_decode($boundary, true);
            $this->merge(['boundary_coordinates' => is_array($decoded) ? $decoded : null]);
        }
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
            'hub_id' => ['required', 'exists:hubs,id'],
            'name' => ['required', 'string', 'max:255', 'unique:zones,name'],
            'code' => ['required', 'string', 'max:50', 'unique:zones,code'],
            'description' => ['nullable', 'string', 'max:1000'],
            'boundary_coordinates' => ['nullable', 'array'],
            'boundary_coordinates.*' => ['nullable', 'array'],
            'pincodes' => ['nullable', 'array'],
            'pincodes.*' => ['nullable', 'string', 'max:20'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
            'delivery_charge' => ['nullable', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'service_days' => ['nullable', 'array'],
            'service_days.*' => ['integer', 'min:0', 'max:6'],
            'service_time_start' => ['nullable', 'date_format:H:i'],
            'service_time_end' => ['nullable', 'date_format:H:i', 'after_or_equal:service_time_start'],
            'verticals' => ['nullable', 'array'],
            'verticals.*' => ['string', Rule::in(BusinessVertical::values())],
        ];
    }
}
