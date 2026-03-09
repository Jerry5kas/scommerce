<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddToTomorrowDeliveryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_address_id' => ['nullable', 'integer', 'exists:user_addresses,id'],
            'delivery_instructions' => ['nullable', 'string', 'max:500'],
            'time_slot' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_address_id.exists' => 'Selected address is not valid.',
            'delivery_instructions.max' => 'Delivery instructions cannot exceed 500 characters.',
            'time_slot.max' => 'Time slot selection is invalid.',
        ];
    }
}
