<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user('admin');
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('zone_id') && $this->zone_id === '') {
            $this->merge(['zone_id' => null]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $driver = $this->route('driver');

        return [
            'employee_id' => ['sometimes', 'string', 'max:50', Rule::unique('drivers', 'employee_id')->ignore($driver->id)],
            'zone_id' => ['nullable', 'integer', 'exists:zones,id'],
            'vehicle_number' => ['nullable', 'string', 'max:50'],
            'vehicle_type' => ['nullable', 'string', 'max:50'],
            'license_number' => ['nullable', 'string', 'max:100'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
