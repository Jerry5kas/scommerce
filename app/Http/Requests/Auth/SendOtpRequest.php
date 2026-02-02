<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SendOtpRequest extends FormRequest
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
            'phone' => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
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
            'phone.required' => 'Please enter your phone number.',
            'phone.regex' => 'Please enter a valid 10-digit Indian mobile number.',
            'language.required' => 'Please select your preferred language.',
            'language.in' => 'Please select a valid language.',
            'consent.required' => 'You must agree to receive updates and offers.',
            'consent.accepted' => 'You must agree to receive updates and offers from Freshtick.',
        ];
    }
}
