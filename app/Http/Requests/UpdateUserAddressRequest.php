<?php

namespace App\Http\Requests;

use App\Models\UserAddress;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        $address = $this->route('address');

        return $address && $this->user() && $address->user_id === $this->user()->id;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'type' => ['sometimes', 'string', Rule::in([UserAddress::TYPE_HOME, UserAddress::TYPE_WORK, UserAddress::TYPE_OTHER])],
            'label' => ['nullable', 'string', 'max:100'],
            'address_line_1' => ['sometimes', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'landmark' => ['nullable', 'string', 'max:255'],
            'city' => ['sometimes', 'string', 'max:100'],
            'state' => ['sometimes', 'string', 'max:100'],
            'pincode' => ['sometimes', 'string', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }
}
