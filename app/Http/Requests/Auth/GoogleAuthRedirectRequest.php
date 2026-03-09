<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class GoogleAuthRedirectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'language' => ['required', 'string', 'in:en,hi,ml'],
            'consent' => ['required', 'accepted'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'language.required' => 'Please select your preferred language.',
            'language.in' => 'Please select a valid language.',
            'consent.required' => 'You must agree to continue.',
            'consent.accepted' => 'You must agree to continue.',
        ];
    }
}
