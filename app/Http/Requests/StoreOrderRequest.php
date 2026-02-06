<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
            'user_address_id' => ['required', 'integer', 'exists:user_addresses,id'],
            'scheduled_delivery_date' => ['required', 'date', 'after_or_equal:today'],
            'scheduled_delivery_time' => ['nullable', 'date_format:H:i'],
            'delivery_instructions' => ['nullable', 'string', 'max:500'],
            'payment_method' => ['sometimes', 'string', 'in:cod,wallet,upi,gateway'],
            'vertical' => ['sometimes', 'string', 'in:daily_fresh,society_fresh'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_address_id.required' => 'Please select a delivery address.',
            'user_address_id.exists' => 'Selected address is not valid.',
            'scheduled_delivery_date.required' => 'Please select a delivery date.',
            'scheduled_delivery_date.after_or_equal' => 'Delivery date must be today or a future date.',
            'delivery_instructions.max' => 'Delivery instructions cannot exceed 500 characters.',
        ];
    }
}
