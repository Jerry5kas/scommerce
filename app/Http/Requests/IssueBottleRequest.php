<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IssueBottleRequest extends FormRequest
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
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'subscription_id' => ['nullable', 'integer', 'exists:subscriptions,id'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
