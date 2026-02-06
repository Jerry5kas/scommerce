<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubscriptionRequest extends FormRequest
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
            'subscription_plan_id' => ['required', 'integer', 'exists:subscription_plans,id'],
            'user_address_id' => ['required', 'integer', 'exists:user_addresses,id'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'billing_cycle' => ['sometimes', 'string', 'in:weekly,monthly'],
            'notes' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
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
            'subscription_plan_id.required' => 'Please select a subscription plan.',
            'subscription_plan_id.exists' => 'Selected subscription plan is not valid.',
            'user_address_id.required' => 'Please select a delivery address.',
            'user_address_id.exists' => 'Selected address is not valid.',
            'start_date.required' => 'Please select a start date.',
            'start_date.after_or_equal' => 'Start date must be today or a future date.',
            'items.required' => 'Please add at least one product to your subscription.',
            'items.min' => 'Please add at least one product to your subscription.',
            'items.*.product_id.required' => 'Product is required.',
            'items.*.product_id.exists' => 'One or more selected products are not valid.',
            'items.*.quantity.required' => 'Quantity is required for each product.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'items.*.quantity.max' => 'Quantity cannot exceed 100.',
        ];
    }
}
