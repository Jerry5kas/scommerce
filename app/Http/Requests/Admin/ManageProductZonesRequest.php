<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ManageProductZonesRequest extends FormRequest
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
        return [
            'zones' => ['required', 'array'],
            'zones.*.zone_id' => ['required', 'integer', 'exists:zones,id'],
            'zones.*.is_available' => ['sometimes', 'boolean'],
            'zones.*.price_override' => ['nullable', 'numeric', 'min:0'],
            'zones.*.stock_quantity' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
