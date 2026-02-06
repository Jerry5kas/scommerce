<?php

namespace App\Http\Requests;

use App\Models\Bottle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBottleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bottle_number' => ['nullable', 'string', 'max:50', 'unique:bottles,bottle_number'],
            'barcode' => ['nullable', 'string', 'max:100', 'unique:bottles,barcode'],
            'type' => ['required', 'string', Rule::in([Bottle::TYPE_STANDARD, Bottle::TYPE_PREMIUM, Bottle::TYPE_CUSTOM])],
            'capacity' => ['nullable', 'numeric', 'min:0.1', 'max:100'],
            'purchase_cost' => ['nullable', 'numeric', 'min:0'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
