<?php

namespace App\Http\Requests;

use App\Models\Delivery;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDeliveryStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::in([
                    Delivery::STATUS_PENDING,
                    Delivery::STATUS_ASSIGNED,
                    Delivery::STATUS_OUT_FOR_DELIVERY,
                    Delivery::STATUS_DELIVERED,
                    Delivery::STATUS_FAILED,
                    Delivery::STATUS_CANCELLED,
                ]),
            ],
            'driver_id' => ['nullable', 'integer', 'exists:drivers,id'],
            'reason' => ['required_if:status,failed', 'nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Please select a status.',
            'status.in' => 'Invalid status selected.',
            'reason.required_if' => 'Please provide a reason for failure.',
        ];
    }
}
