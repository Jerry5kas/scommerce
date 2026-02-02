<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreZoneOverrideRequest extends FormRequest
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
            'user_id' => ['nullable', 'required_without:address_id', 'integer', 'exists:users,id'],
            'address_id' => ['nullable', 'required_without:user_id', 'integer', 'exists:user_addresses,id'],
            'reason' => ['required', 'string', 'max:2000'],
            'expires_at' => ['nullable', 'date', 'after:today'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('user_id') && $this->input('user_id') === '') {
            $this->merge(['user_id' => null]);
        }
        if ($this->has('address_id') && $this->input('address_id') === '') {
            $this->merge(['address_id' => null]);
        }
    }
}
