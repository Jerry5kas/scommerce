<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $subscription = $this->route('subscription');

        return $this->user() !== null &&
               $subscription &&
               $subscription->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_address_id' => ['sometimes', 'integer', 'exists:user_addresses,id'],
            'billing_cycle' => ['sometimes', 'string', 'in:weekly,monthly'],
            'notes' => ['nullable', 'string', 'max:500'],
            'auto_renew' => ['sometimes', 'boolean'],
            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.product_id' => ['required_with:items', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1', 'max:100'],
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
            'user_address_id.exists' => 'Selected address is not valid.',
            'items.min' => 'Subscription must have at least one product.',
            'items.*.product_id.required_with' => 'Product is required.',
            'items.*.product_id.exists' => 'One or more selected products are not valid.',
            'items.*.quantity.required_with' => 'Quantity is required for each product.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'items.*.quantity.max' => 'Quantity cannot exceed 100.',
        ];
    }
}
